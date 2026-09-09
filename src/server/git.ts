import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { Project, RepoView } from "../shared/model.js";

const execute = promisify(execFile);
export async function git(
  dir: string,
  args: string[],
  timeout = 45_000,
): Promise<string> {
  try {
    const { stdout } = await execute(
      "git",
      [
        "--no-pager",
        "-c",
        "core.quotePath=false",
        "-c",
        "core.fsmonitor=false",
        "-C",
        dir,
        ...args,
      ],
      { encoding: "utf8", maxBuffer: 2 << 20, timeout, windowsHide: true },
    );
    return stdout;
  } catch (error) {
    const detail = error as Error & { stdout?: string; stderr?: string };
    throw new Error(
      `git ${args[0]}: ${detail.stdout || ""}${detail.stderr || detail.message}`,
    );
  }
}
export async function resolveRepo(input: string) {
  if (!path.isAbsolute(input)) throw new Error("请选择本地 Git 仓库的绝对路径");
  const real = await fs.realpath(input);
  const top = await git(real, ["rev-parse", "--show-toplevel"]);
  await git(real, ["rev-parse", "--verify", "HEAD"]);
  return fs.realpath(path.normalize(top.trim()));
}
export async function safeRead(root: string, name: string): Promise<Buffer> {
  if (
    !name ||
    name.includes(":") ||
    name.includes("\0") ||
    path.isAbsolute(name) ||
    path.win32.isAbsolute(name)
  )
    throw new Error("invalid relative file path");
  const parts = name.replaceAll("\\", "/").split("/");
  if (parts.includes("..")) throw new Error("path escapes repository");
  let current = root;
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (
      /^(\.git|\.env(?:\..*)?|secretkey|\.ssh|\.npmrc|\.pypirc|credentials\.json|auth\.json)$/i.test(
        part,
      ) ||
      /\.(key|pem|p12|pfx)$/i.test(part)
    )
      throw new Error("credential or Git metadata file is not exposed");
    current = path.join(current, part);
    const entry = await fs.lstat(current);
    if (entry.isSymbolicLink())
      throw new Error("symlink files are not exposed");
  }
  const entry = await fs.stat(current);
  if (!entry.isFile() || entry.size > 512 << 10)
    throw new Error("preview supports regular text files up to 512 KiB");
  const content = await fs.readFile(current);
  if (content.includes(0)) throw new Error("binary file: preview unavailable");
  return content;
}
export async function repoView(project: Project): Promise<RepoView> {
  const [commit, branch, status, diff, allFiles, untracked] = await Promise.all(
    [
      git(project.path, ["rev-parse", "HEAD"]),
      git(project.path, ["branch", "--show-current"]),
      git(project.path, ["status", "--short", "--untracked-files=all"]),
      git(project.path, [
        "diff",
        "--no-ext-diff",
        "--no-textconv",
        "--binary",
        "HEAD",
        "--",
      ]),
      git(project.path, [
        "ls-files",
        "-z",
        "--cached",
        "--others",
        "--exclude-standard",
      ]),
      git(project.path, ["ls-files", "-z", "--others", "--exclude-standard"]),
    ],
  );
  // Preserve the Go v1 fingerprint for ordinary tracked/text files.
  const hash = createHash("sha256")
    .update(commit.trim())
    .update(status)
    .update(diff);
  for (const name of untracked.split("\0").filter(Boolean)) {
    hash.update(name);
    try {
      hash.update(await safeRead(project.path, name));
    } catch {
      const entry = await fs.lstat(path.join(project.path, name));
      hash.update(`unread-node:${entry.size}:${entry.mtimeMs}`);
    }
  }
  return {
    commit: commit.trim(),
    branch: branch.trim() || "detached HEAD",
    status,
    diff,
    files: [...new Set(allFiles.split("\0").filter(Boolean))].slice(0, 4000),
    snapshot: hash.digest("hex"),
  };
}
