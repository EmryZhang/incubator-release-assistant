import { test } from "node:test";
import http from "node:http";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Store, acquireLock, defaultDir } from "../src/server/store.js";
import { Workbench, draftEML } from "../src/server/actions.js";
import { git, repoView, safeRead } from "../src/server/git.js";
import { startServer } from "../src/server/server.js";
import type {
  Project,
  Release,
  Job,
  Mail,
  Draft,
  CheckRun,
  State,
} from "../src/shared/model.js";

const execute = promisify(execFile);

test("IRA defaults preserve existing ISA data and environment overrides", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ira-naming-"));
  const keys = ["IRA_DATA_DIR", "ISA_DATA_DIR", "APPDATA", "XDG_CONFIG_HOME"];
  const previous = keys.map((key) => process.env[key]);
  t.mock.method(os, "homedir", () => dir);
  t.after(async () => {
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
    await fs.rm(dir, { recursive: true, force: true });
  });
  delete process.env.IRA_DATA_DIR;
  delete process.env.ISA_DATA_DIR;
  process.env.APPDATA = dir;
  process.env.XDG_CONFIG_HOME = dir;
  const base =
    process.platform === "darwin"
      ? path.join(dir, "Library", "Application Support")
      : dir;
  const current = path.join(base, "ira");
  const legacy = path.join(base, "isa");
  assert.equal(defaultDir(), current);
  await fs.mkdir(legacy, { recursive: true });
  const saved =
    '{"schema":1,"projects":[],"releases":[],"preferences":{"toolchain":"builtin","signature":"saved signature"}}';
  await fs.writeFile(path.join(legacy, "state.json"), saved);
  assert.equal(defaultDir(), legacy);
  assert.equal(
    (await Store.open(defaultDir())).snapshot().preferences.signature,
    "saved signature",
  );
  assert.equal(
    await fs.readFile(path.join(legacy, "state.json"), "utf8"),
    saved,
  );
  await fs.mkdir(current);
  assert.equal(defaultDir(), current);
  process.env.ISA_DATA_DIR = path.join(dir, "legacy-override");
  assert.equal(defaultDir(), process.env.ISA_DATA_DIR);
  process.env.IRA_DATA_DIR = path.join(dir, "current-override");
  assert.equal(defaultDir(), process.env.IRA_DATA_DIR);
});

async function fixture(dir: string) {
  await fs.mkdir(dir, { recursive: true });
  await git(dir, ["init"]);
  await git(dir, ["config", "user.name", "IRA test"]);
  await git(dir, ["config", "user.email", "ira@example.invalid"]);
  await git(dir, ["config", "commit.gpgsign", "false"]);
  for (const [name, content] of Object.entries({
    LICENSE: "Apache License test fixture\n",
    NOTICE: "Test fixture notice\n",
    DISCLAIMER: "Test fixture disclaimer\n",
    "README.md": "before\n",
    "go.mod": "module example.invalid/test\n\ngo 1.22\n",
  }))
    await fs.writeFile(path.join(dir, name), content);
  await git(dir, ["add", "."]);
  await git(dir, ["commit", "-m", "test: create isolated fixture"]);
  return dir;
}
test("real Git check, Agent edit/report, mail task/reply and restart preserve state", async (t) => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "ira-node-"));
  t.after(() => fs.rm(temporary, { recursive: true, force: true }));
  const repo = await fixture(path.join(temporary, "repo")),
    data = path.join(temporary, "data");
  const store = await Store.open(data),
    app = new Workbench(store);
  const project = (await app.action({
    op: "addProject",
    path: repo,
    name: "Apache fixture",
    incubating: true,
  })) as Project;
  await app.action({
    op: "notes",
    projectId: project.id,
    text: "Project note: check NOTICE.",
  });
  await app.action({ op: "notes", text: "User note: explain your evidence." });
  await app.action({
    op: "preferences",
    toolchain: "agent",
    signature: "Local test",
  });
  const release = (await app.action({
    op: "createRelease",
    projectId: project.id,
    version: "1.0.0-incubating",
  })) as Release;
  assert.equal(release.toolchain, "agent");
  const task = (await app.action({
    op: "createJob",
    releaseId: release.id,
    title: "Clarify README",
  })) as Job;
  const first = (await app.action({
    op: "check",
    releaseId: release.id,
  })) as CheckRun;
  assert.equal(first.sha512.length, 128);
  assert.equal(first.findings[0].status, "pass");
  assert.equal(first.toolchain, "agent");
  await fs.writeFile(path.join(repo, "README.md"), "after: real Agent edit\n");
  const report = (await app.action({
    op: "reportJob",
    releaseId: release.id,
    jobId: task.id,
    status: "reported",
    summary: "Clarified README",
    evidence: "git diff reviewed; no target code executed",
  })) as Job;
  assert.equal(report.status, "reported");
  assert.notEqual(report.reports[0].snapshot, first.snapshot);
  assert.match((await repoView(project)).diff, /after: real Agent edit/);
  await app.action({
    op: "reviewJob",
    releaseId: release.id,
    jobId: task.id,
    status: "done",
  });
  const mail = (await app.action({
    op: "importMail",
    releaseId: release.id,
    mail: {
      from: "Reviewer <reviewer@example.invalid>",
      subject: "Review",
      messageId: "<review@example.invalid>",
      references: "<vote@example.invalid>",
      body: "Explain the README change.",
      url: "https://lists.apache.org/",
    },
  })) as Mail;
  const followup = (await app.action({
    op: "mailToJob",
    releaseId: release.id,
    mailId: mail.id,
    title: "Address review",
  })) as Job;
  assert.equal(followup.mailId, mail.id);
  const draft = (await app.action({
    op: "saveDraft",
    releaseId: release.id,
    draft: {
      kind: "reply",
      mailId: mail.id,
      to: mail.from,
      subject: "Re: Review",
      body: "Investigating.",
    },
  })) as Draft;
  assert.match(draftEML(draft), /In-Reply-To: <review@example.invalid>\r\n/);
  assert.match(
    draftEML(draft),
    /References: <vote@example.invalid> <review@example.invalid>/,
  );
  assert.match(draftEML(draft), /X-Unsent: 1/);
  const second = (await app.action({
    op: "check",
    releaseId: release.id,
  })) as CheckRun;
  assert.equal(second.findings[0].status, "fail");
  assert.notEqual(second.artifact, first.artifact);
  assert.equal(
    second.sha512,
    first.sha512,
    "uncommitted edit must not change HEAD archive",
  );
  const packet = await app.packet(release.id, followup.id);
  assert.match(packet.projectNotes, /Project note/);
  assert.match(packet.userNotes, /User note/);
  const reopened = await Store.open(data);
  assert.deepEqual(reopened.snapshot(), store.snapshot());
  assert.equal(await reopened.notes(project.id), packet.projectNotes);
});

test("Go schema 1 data stays readable and is backed up before first Node write", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ira-migrate-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const original: State = {
    schema: 1,
    projects: [
      {
        id: "a".repeat(24),
        name: "Existing Apache project",
        path: dir,
        incubating: true,
        toolchain: "",
      },
    ],
    releases: [
      {
        id: "b".repeat(24),
        projectId: "a".repeat(24),
        version: "existing",
        rc: "RC1",
        phase: "communication",
        toolchain: "builtin",
        createdAt: "2026-09-09T00:00:00Z",
        jobs: [],
        checks: [
          {
            id: "c".repeat(24),
            at: "2026-09-09T00:00:00Z",
            commit: "old",
            snapshot: "old",
            artifact: path.join(dir, "evidence", "old.zip"),
            sha512: "old",
            toolchain: "",
            incubating: false,
            findings: [],
          },
        ],
        mails: [],
        drafts: [
          {
            id: "d".repeat(24),
            kind: "vote",
            mailId: "",
            to: "dev@example.invalid",
            subject: "Existing draft",
            body: "Keep this text",
            inReplyTo: "",
            references: "",
            updatedAt: "2026-09-09T00:00:00Z",
          },
        ],
      },
    ],
    preferences: { toolchain: "builtin", signature: "Existing signature" },
  };
  const bytes = JSON.stringify(original, null, 2);
  await fs.writeFile(path.join(dir, "state.json"), bytes);
  const store = await Store.open(dir);
  assert.deepEqual(store.snapshot(), original);
  assert.equal(await fs.readFile(path.join(dir, "state.json"), "utf8"), bytes);
  await new Workbench(store).action({
    op: "preferences",
    toolchain: "agent",
    signature: "New signature",
  });
  assert.equal(
    await fs.readFile(path.join(dir, "state.before-node.json"), "utf8"),
    bytes,
  );
  assert.deepEqual(store.snapshot().releases, original.releases);
  await fs.writeFile(path.join(dir, "state.json"), "{broken");
  await assert.rejects(Store.open(dir), /original file preserved/);
  assert.equal(
    await fs.readFile(path.join(dir, "state.json"), "utf8"),
    "{broken",
  );
});

test("stale reports, path boundaries, validation and concurrent writes", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ira-boundary-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const repo = await fixture(path.join(dir, "repo")),
    store = await Store.open(path.join(dir, "data")),
    app = new Workbench(store);
  const project = (await app.action({
      op: "addProject",
      path: repo,
    })) as Project,
    release = (await app.action({
      op: "createRelease",
      projectId: project.id,
      version: "test",
    })) as Release;
  for (const file of [
    "../outside",
    ".git/config",
    ".env",
    ".npmrc",
    "C:\\Windows\\win.ini",
  ])
    await assert.rejects(safeRead(repo, file));
  await fs.mkdir(path.join(dir, "external"));
  await fs.writeFile(path.join(dir, "external", "secret"), "private");
  try {
    await fs.symlink(
      path.join(dir, "external"),
      path.join(repo, "linked"),
      process.platform === "win32" ? "junction" : "dir",
    );
    await assert.rejects(safeRead(repo, "linked/secret"), /symlink/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EPERM") throw error;
  }
  const task = (await app.action({
    op: "createJob",
    releaseId: release.id,
    title: "Task",
  })) as Job;
  await assert.rejects(
    app.action({
      op: "reviewJob",
      releaseId: release.id,
      jobId: task.id,
      status: "done",
    }),
    /没有 Agent 回报/,
  );
  await app.action({
    op: "reportJob",
    releaseId: release.id,
    jobId: task.id,
    status: "reported",
    summary: "Done",
  });
  await fs.writeFile(path.join(repo, "new.md"), "another change");
  await assert.rejects(
    app.action({
      op: "reviewJob",
      releaseId: release.id,
      jobId: task.id,
      status: "done",
    }),
    /文件发生变化/,
  );
  const previous = store.snapshot();
  await assert.rejects(
    app.action({
      op: "saveDraft",
      releaseId: release.id,
      draft: { kind: "vote", subject: "Vote\r\nBcc: injected@example.invalid" },
    }),
  );
  assert.deepEqual(store.snapshot(), previous);
  await assert.rejects(
    app.action({
      op: "importMail",
      releaseId: release.id,
      mail: { body: "x", url: "javascript:alert(1)" },
    }),
  );
  await assert.rejects(
    app.action({
      op: "preferences",
      toolchain: "builtin",
      shell: "must not execute",
    }),
  );
  await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      app.action({
        op: "createJob",
        releaseId: release.id,
        title: `Concurrent ${i}`,
      }),
    ),
  );
  assert.equal(store.snapshot().releases[0].jobs.length, 7);
  assert.equal(
    (await Store.open(store.dir)).snapshot().releases[0].jobs.length,
    7,
  );
  const unlock = await acquireLock(store.dir);
  await assert.rejects(acquireLock(store.dir), /already in use/);
  await unlock();
});

test("production Node server and CLI enforce API boundaries without needing Go", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ira-http-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const app = await startServer({ dir, port: 0 });
  t.after(() => app.close());
  const base = app.session.url,
    auth = { Authorization: `Bearer ${app.session.token}` };
  assert.equal((await fetch(`${base}/api/state`)).status, 401);
  assert.equal(
    (
      await fetch(`${base}/api/state`, {
        headers: { ...auth, Origin: "https://evil.example" },
      })
    ).status,
    403,
  );
  const wrongHostStatus = await new Promise<number | undefined>(
    (resolve, reject) => {
      const request = http.get(
        `${base}/api/state`,
        { headers: { ...auth, Host: "evil.example" } },
        (response) => {
          response.resume();
          resolve(response.statusCode);
        },
      );
      request.once("error", reject);
    },
  );
  assert.equal(wrongHostStatus, 403);
  assert.equal(
    (
      await fetch(`${base}/api/action`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({ op: "notes", text: "x".repeat((1 << 20) + 1) }),
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await fetch(`${base}/api/action`, {
        method: "POST",
        headers: auth,
        body: '{"op":"notes"} {"op":"notes"}',
      })
    ).status,
    400,
  );
  const homepage = await fetch(base);
  assert.match(await homepage.text(), /IRA/);
  assert.match(
    homepage.headers.get("content-security-policy") || "",
    /frame-ancestors 'none'/,
  );
  await assert.rejects(startServer({ dir, port: 0 }), /already uses/);
  const noGoPath = (process.env.PATH || "")
    .split(path.delimiter)
    .filter((p) => !/[\\/]go[\\/]bin/i.test(p))
    .join(path.delimiter);
  const cli = await execute(
    process.execPath,
    ["dist/server/cli.js", "api", "--data", dir, "--path", "/api/state"],
    { env: { ...process.env, PATH: noGoPath }, windowsHide: true },
  );
  assert.equal(JSON.parse(cli.stdout).runtime, "node");
  await app.close();
  const restarted = await startServer({ dir, port: 0 });
  assert.notEqual(restarted.session.token, app.session.token);
  await restarted.close();
});
