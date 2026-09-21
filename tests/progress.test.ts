import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { Store } from "../src/server/store.js";
import { Workbench } from "../src/server/actions.js";
import { git } from "../src/server/git.js";
import { startServer } from "../src/server/server.js";
import type { Project, Release } from "../src/shared/model.js";
import {
  currentProgress,
  initialProgress,
  validateProgress,
  type ProgressInput,
} from "../src/shared/progress.js";

test("release progress rejects misleading completion and incomplete stop reports", () => {
  const input = (): ProgressInput => structuredClone(initialProgress(""));
  const missingEvidence = input();
  missingEvidence.steps[0]!.status = "done";
  assert.throws(() => validateProgress(missingEvidence), /证据/);
  missingEvidence.steps[0]!.status = "skipped";
  assert.throws(() => validateProgress(missingEvidence), /理由/);
  const duplicate = input();
  duplicate.steps[1]!.id = duplicate.steps[0]!.id;
  assert.throws(() => validateProgress(duplicate), /重复/);
  const stop = input();
  stop.status = "paused";
  assert.throws(() => validateProgress(stop), /原因/);
  stop.stopReason = "Waiting for an external result";
  stop.nextAction = "";
  assert.throws(() => validateProgress(stop), /下一步/);
  stop.nextAction = "Read the result and resume";
  stop.steps[0]!.status = "running";
  assert.throws(() => validateProgress(stop), /进行中/);
  stop.steps[0]!.status = "paused";
  validateProgress(stop);
  stop.status = "blocked";
  validateProgress(stop);
  const complete = input();
  complete.status = "complete";
  assert.throws(() => validateProgress(complete), /未完成/);
  for (const step of complete.steps) {
    step.status = "done";
    step.evidence = "Verified fixture evidence";
  }
  complete.nextAction = "";
  validateProgress(complete);
});

test("progress API preserves checkpoints across stops, concurrent writers and restart", async (t) => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "ira-progress-"));
  const repo = path.join(temporary, "repo"),
    data = path.join(temporary, "data");
  await fs.mkdir(repo);
  await git(repo, ["init"]);
  await git(repo, ["config", "user.name", "IRA fixture"]);
  await git(repo, ["config", "user.email", "fixture@example.invalid"]);
  await git(repo, ["config", "commit.gpgsign", "false"]);
  await fs.writeFile(path.join(repo, "README.md"), "Fixture\n");
  await git(repo, ["add", "."]);
  await git(repo, ["commit", "-m", "test fixture"]);
  const server = await startServer({ dir: data, port: 0 });
  t.after(async () => {
    await server.close();
    // Remove only this test's resolved temporary directory.
    assert.equal(
      path.dirname(path.resolve(temporary)),
      path.resolve(os.tmpdir()),
    );
    assert.ok(path.basename(temporary).startsWith("ira-progress-"));
    await fs.rm(temporary, { recursive: true, force: true });
  });
  const app = server.workbench;
  const project = (await app.action({
    op: "addProject",
    path: repo,
  })) as Project;
  const release = (await app.action({
    op: "createRelease",
    projectId: project.id,
    version: "1.0.0",
  })) as Release;
  assert.equal(release.progressReports?.length, 1);
  assert.equal(currentProgress(release).steps.length, 8);
  assert.ok(
    currentProgress(release).steps.every((s) => s.status === "pending"),
  );
  const packet = await app.packet(release.id, "");
  assert.equal(packet.task, null);
  assert.equal(packet.progressRevision, 1);
  assert.match(packet.progressText, /下一步/);

  const { at: _at, snapshot: _snapshot, ...running } = currentProgress(release);
  running.status = "running";
  running.summary = "Scope confirmed; preparing source";
  running.steps[0]!.status = "done";
  running.steps[0]!.evidence = "Fixture commit and version reviewed";
  running.steps[1]!.status = "running";
  running.nextAction = "Prepare source";
  const update = {
    op: "reportProgress",
    releaseId: release.id,
    progressRevision: 1,
    progress: running,
  };
  const writes = await Promise.allSettled([
    app.action(update),
    app.action(update),
  ]);
  assert.equal(writes.filter((w) => w.status === "fulfilled").length, 1);
  const rejected = writes.find((w) => w.status === "rejected");
  assert.ok(rejected?.status === "rejected");
  assert.match(String(rejected.reason), /进度已更新/);

  const paused = structuredClone(running);
  paused.status = "paused";
  paused.summary = "Scope complete; source preparation paused";
  paused.steps[1]!.status = "paused";
  paused.stopReason = "User requested a pause";
  paused.nextAction = "Resume source preparation at the recorded commit";
  await app.action({ ...update, progressRevision: 2, progress: paused });
  const headers = { Authorization: `Bearer ${server.session.token}` };
  const url = `${server.session.url}/api/progress?releaseId=${release.id}`;
  const unauthenticated = await fetch(url);
  assert.equal(unauthenticated.status, 401);
  const response = await fetch(url, { headers });
  assert.equal(response.status, 200);
  const saved = (await response.json()) as Awaited<
    ReturnType<Workbench["progress"]>
  >;
  assert.equal(saved.revision, 3);
  assert.equal(saved.history.length, 3);
  assert.equal(saved.progress.status, "paused");
  assert.equal(saved.sourceChanged, false);
  assert.match(saved.text, /已完成 1\/8/);
  assert.match(saved.text, /待开始/);
  assert.match(saved.text, /停止原因：User requested a pause/);
  assert.match(saved.text, /下一步：Resume source preparation/);
  await fs.writeFile(path.join(repo, "README.md"), "Changed after report\n");
  assert.equal((await app.progress(release.id)).sourceChanged, true);
  await server.close();
  const reopened = new Workbench(await Store.open(data));
  assert.deepEqual(
    (await reopened.progress(release.id)).history,
    saved.history,
  );

  // Old schema-1 state has no progress field. Reading it must not invent history
  // or rewrite the file, and the first new report uses revision zero.
  const legacy = reopened.store.snapshot();
  delete legacy.releases[0]!.progressReports;
  const oldPath = path.join(data, "state.json");
  const oldBytes = JSON.stringify(legacy);
  await fs.writeFile(oldPath, oldBytes);
  const oldApp = new Workbench(await Store.open(data));
  const oldProgress = await oldApp.progress(release.id);
  assert.equal(oldProgress.revision, 0);
  assert.equal(oldProgress.progress.at, "");
  assert.match(oldProgress.text, /尚无完整进度回报/);
  assert.equal(await fs.readFile(oldPath, "utf8"), oldBytes);
  await oldApp.action({ ...update, progressRevision: 0, progress: paused });
  assert.equal((await oldApp.progress(release.id)).revision, 1);
});
