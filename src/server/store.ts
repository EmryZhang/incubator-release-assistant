import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { stateSchema, type State, type Release } from "../shared/model.js";

export const id = () => randomBytes(12).toString("hex");
export const now = () => new Date().toISOString();
export const isMissing = (error: unknown) =>
  (error as NodeJS.ErrnoException).code === "ENOENT";
export const defaultDir = () =>
  process.env.ISA_DATA_DIR ||
  path.join(
    process.platform === "win32"
      ? process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming")
      : process.platform === "darwin"
        ? path.join(os.homedir(), "Library", "Application Support")
        : process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
    "isa",
  );

export async function atomicWrite(file: string, content: string | Buffer) {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = path.join(path.dirname(file), `.isa-tmp-${id()}`);
  const handle = await fs.open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(content);
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export function getProject(state: State, pid: string) {
  const project = state.projects.find((p) => p.id === pid);
  if (!project) throw new Error("project not found");
  return project;
}
export function getRelease(state: State, rid: string) {
  const release = state.releases.find((r) => r.id === rid);
  if (!release) throw new Error("release not found");
  return release;
}
export function getJob(release: Release, jid: string) {
  const job = release.jobs.find((j) => j.id === jid);
  if (!job) throw new Error("agent task not found");
  return job;
}
export class Store {
  private queue: Promise<unknown> = Promise.resolve();
  private backupCreated = false;
  private constructor(
    readonly dir: string,
    private state: State,
  ) {}
  static async open(dir: string) {
    const resolved = path.resolve(dir);
    await fs.mkdir(resolved, { recursive: true, mode: 0o700 });
    let state: State = {
      schema: 1,
      projects: [],
      releases: [],
      preferences: { toolchain: "builtin", signature: "" },
    };
    try {
      state = stateSchema.parse(
        JSON.parse(
          (
            await fs.readFile(path.join(resolved, "state.json"), "utf8")
          ).replace(/^\uFEFF/, ""),
        ),
      );
    } catch (error) {
      if (!isMissing(error))
        throw new Error(
          `Cannot load saved ISA state; original file preserved: ${String(error)}`,
        );
    }
    const projectIDs = new Set(state.projects.map((p) => p.id));
    if (
      projectIDs.size !== state.projects.length ||
      new Set(state.releases.map((r) => r.id)).size !== state.releases.length ||
      state.releases.some((r) => !projectIDs.has(r.projectId))
    )
      throw new Error(
        "Invalid project/release references; original state preserved",
      );
    return new Store(await fs.realpath(resolved), state);
  }
  snapshot(): State {
    return structuredClone(this.state);
  }
  async update<T>(operation: (state: State) => Promise<T> | T): Promise<T> {
    const pending = this.queue.then(async () => {
      const next = this.snapshot();
      const result = await operation(next);
      stateSchema.parse(next);
      if (!this.backupCreated) {
        try {
          await fs.copyFile(
            path.join(this.dir, "state.json"),
            path.join(this.dir, "state.before-node.json"),
            fs.constants.COPYFILE_EXCL,
          );
        } catch (error) {
          if (
            !isMissing(error) &&
            (error as NodeJS.ErrnoException).code !== "EEXIST"
          )
            throw error;
        }
        this.backupCreated = true;
      }
      await atomicWrite(
        path.join(this.dir, "state.json"),
        JSON.stringify(next, null, 2),
      );
      this.state = next;
      return structuredClone(result);
    });
    this.queue = pending.catch(() => undefined);
    return pending;
  }
  notePath(pid = "") {
    if (pid) getProject(this.state, pid);
    return path.join(this.dir, "notes", pid ? `${pid}.md` : "user.md");
  }
  async notes(pid = "") {
    try {
      return await fs.readFile(this.notePath(pid), "utf8");
    } catch (error) {
      if (isMissing(error)) return "";
      throw error;
    }
  }
  async saveNotes(pid: string, text: string) {
    await atomicWrite(this.notePath(pid), text);
    return true;
  }
}

// One writer per directory, including when different TCP ports are chosen.
export async function acquireLock(dir: string) {
  const file = path.join(dir, "server-lock.json"),
    nonce = id();
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await fs.writeFile(file, JSON.stringify({ pid: process.pid, nonce }), {
        flag: "wx",
        mode: 0o600,
      });
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const previous = JSON.parse(await fs.readFile(file, "utf8")) as {
        pid: number;
      };
      if (!Number.isSafeInteger(previous.pid) || previous.pid <= 0)
        throw new Error("Invalid server lock; inspect local data directory");
      let running = true;
      try {
        process.kill(previous.pid, 0);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ESRCH") running = false;
        else throw error;
      }
      if (running)
        throw new Error(
          "This ISA data directory is already in use. Stop its server before restarting.",
        );
      if (attempt === 1) throw new Error("Could not acquire ISA data lock");
      await fs.unlink(file);
    }
  }
  return async () => {
    try {
      const current = JSON.parse(await fs.readFile(file, "utf8")) as {
        nonce: string;
      };
      if (current.nonce === nonce) await fs.unlink(file);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  };
}
