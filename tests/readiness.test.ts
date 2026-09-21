import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { Store } from "../src/server/store.js";
import { Workbench } from "../src/server/actions.js";
import { git } from "../src/server/git.js";
import type { Project, Release } from "../src/shared/model.js";
import {
  readinessContext,
  emptyReadiness,
  type ReadinessInput,
} from "../src/shared/readiness.js";

test("project findings survive handoff; closure, source freshness and progress claims are enforced", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ira-readiness-"));
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(dir)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(dir).startsWith("ira-readiness-"));
    await fs.rm(dir, { recursive: true, force: true });
  });
  const repo = path.join(dir, "repo"),
    data = path.join(dir, "data");
  await fs.mkdir(repo);
  await git(repo, ["init"]);
  await git(repo, ["config", "user.name", "IRA fixture"]);
  await git(repo, ["config", "user.email", "fixture@example.invalid"]);
  await git(repo, ["config", "commit.gpgsign", "false"]);
  await fs.writeFile(
    path.join(repo, "pom.xml"),
    "<groupId>legacy.fixture</groupId>\n",
  );
  await git(repo, ["add", "."]);
  await git(repo, ["commit", "-m", "test fixture"]);
  let app = new Workbench(await Store.open(data));
  const project = (await app.action({
    op: "addProject",
    path: repo,
    name: "Example",
    incubating: true,
  })) as Project;
  const release = (await app.action({
    op: "createRelease",
    projectId: project.id,
    version: "1.0.0",
  })) as Release;
  const other = (await app.action({
    op: "createRelease",
    projectId: project.id,
    version: "2.0.0",
  })) as Release;
  // Legacy schema-1 files remain byte-identical after read; virtual required rows
  // have no invented pass, timestamp or saved history.
  const savedPath = path.join(data, "state.json");
  const bytes = await fs.readFile(savedPath, "utf8");
  app = new Workbench(await Store.open(data));
  let packet = await app.packet(release.id, "");
  assert.equal(packet.readiness.items.length, 15);
  assert.equal(packet.readiness.revision, 0);
  assert.ok(
    packet.readiness.items.every(
      (item) => item.status === "pending" && !item.at,
    ),
  );
  assert.equal(await fs.readFile(savedPath, "utf8"), bytes);
  const command = async (input: ReadinessInput) => {
    const p = await app.packet(release.id, "");
    return {
      op: "recordReadiness",
      releaseId: release.id,
      readinessRevision: p.readiness.revision,
      readinessSnapshot: p.git.snapshot,
      readinessContext: readinessContext(p.release, p.project),
      readiness: input,
    };
  };
  const finding = {
    ...emptyReadiness("NAME-01", "Maven identity", "Library"),
    ecosystem: "Maven",
    status: "blocked" as const,
    observed: "Legacy groupId",
    nextAction: "Assess migration and obtain specific disposition",
  };
  const update = await command(finding);
  const writes = await Promise.allSettled([
    app.action(update),
    app.action(update),
  ]);
  assert.equal(
    writes.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal(
    writes.filter((result) => result.status === "rejected").length,
    1,
  );
  packet = await app.packet(release.id, "");
  assert.equal(packet.readiness.items.at(-1)!.status, "blocked");
  assert.equal((await app.packet(other.id, "")).readiness.items.length, 15);
  await app.action({
    op: "updateRelease",
    releaseId: release.id,
    phase: "communication",
    toolchain: "builtin",
  });
  assert.ok(
    (await app.packet(release.id, "")).readiness.unresolved.some(
      (item) => item.id === "NAME-01",
    ),
  );
  await assert.rejects(
    app.action(
      await command({ ...finding, status: "pass", disposition: "PR merged" }),
    ),
    /关闭审查项/,
  );
  await assert.rejects(
    app.action(await command({ ...finding, component: "Other component" })),
    /不能改作其他问题/,
  );
  const resolved: ReadinessInput = {
    ...finding,
    status: "pass",
    basis: "Fixture project naming decision",
    evidence: "fixture-review/NAME-01",
    disposition: "Specific migration disposition verified against candidate",
    reviewer: "Agent fixture",
    nextAction: "",
    changeReason: "Verified specific disposition",
    exception: true,
  };
  await assert.rejects(app.action(await command(resolved)), /例外处置/);
  await app.action(
    await command({
      ...resolved,
      authority: "Fixture decision authority and scope",
    }),
  );
  // A single closed finding cannot make unreviewed common gates pass.
  packet = await app.packet(release.id, "");
  const { at: _at, snapshot: _snapshot, ...progress } = packet.progress;
  progress.status = "running";
  progress.steps.find((step) => step.id === "prepare")!.status = "done";
  progress.steps.find((step) => step.id === "prepare")!.evidence =
    "Fixture technical build";
  await assert.rejects(
    app.action({
      op: "reportProgress",
      releaseId: release.id,
      progressRevision: packet.progressRevision,
      progress,
    }),
    /准备审查仍有/,
  );
  // The full set cannot be dropped or replaced by a bespoke success step.
  await assert.rejects(
    app.action({
      op: "reportProgress",
      releaseId: release.id,
      progressRevision: packet.progressRevision,
      progress: {
        ...progress,
        steps: [
          {
            id: "anything",
            title: "All green",
            status: "done",
            evidence: "Fixture",
          },
        ],
      },
    }),
    /不能从回报中删除/,
  );
  for (const item of packet.readiness.items.filter(
    (item) => item.id !== "NAME-01",
  )) {
    const { at, snapshot, context, stale, ...input } = item;
    await app.action(
      await command({
        ...input,
        status: "pass",
        ecosystem: "Maven / Java",
        observed: "Fixture candidate inspected",
        basis: "Fixture policy",
        evidence: "fixture-review/" + input.id,
        disposition: "Verified fixture result",
        reviewer: "Agent fixture",
        nextAction: "",
        changeReason: "Initial verified review",
      }),
    );
  }
  assert.equal((await app.packet(release.id, "")).readiness.ready, true);
  await app.action({
    op: "reportProgress",
    releaseId: release.id,
    progressRevision: packet.progressRevision,
    progress,
  });
  const beforeChange = await command({ ...resolved, exception: false });
  await fs.writeFile(
    path.join(repo, "pom.xml"),
    "<groupId>changed.fixture</groupId>\n",
  );
  await assert.rejects(app.action(beforeChange), /候选或检查设置已变化/);
  packet = await app.packet(release.id, "");
  assert.ok(packet.readiness.items.every((item) => item.stale));
  assert.equal(packet.readiness.ready, false);
  const advance = {
    ...progress,
    steps: progress.steps.map((step) =>
      step.id === "sign" ? { ...step, status: "running" as const } : step,
    ),
  };
  await assert.rejects(
    app.action({
      op: "reportProgress",
      releaseId: release.id,
      progressRevision: packet.progressRevision,
      progress: advance,
    }),
    /准备审查仍有/,
  );
  // New blockers do not erase the fact that an earlier operation was recorded.
  await app.action({
    op: "reportProgress",
    releaseId: release.id,
    progressRevision: packet.progressRevision,
    progress: {
      ...progress,
      status: "blocked",
      stopReason: "Candidate changed",
      nextAction: "Review changes",
    },
  });
  await app.action(
    await command({
      ...finding,
      changeReason: "Reopened for candidate change",
    }),
  );
  const reopened = new Workbench(await Store.open(data));
  const latest = await reopened.packet(release.id, "");
  assert.equal(
    latest.release.readinessUpdates!.filter((item) => item.id === "NAME-01")
      .length,
    3,
  );
  assert.equal(
    latest.readiness.items.find((item) => item.id === "NAME-01")!.status,
    "blocked",
  );
  assert.equal(
    latest.progress.steps.find((step) => step.id === "prepare")!.status,
    "done",
  );
  assert.match(
    (await reopened.progress(release.id)).text,
    /准备审查：16 项待解决或复查/,
  );
  const rc2 = (await reopened.action({
    op: "createRelease",
    projectId: project.id,
    version: "1.0.0",
    rc: "RC2",
  })) as Release;
  assert.equal(rc2.readinessInheritedFrom, release.id);
  const carried = await reopened.packet(rc2.id, "");
  assert.equal(
    carried.readiness.items.find((item) => item.id === "NAME-01")!.status,
    "blocked",
  );
  assert.ok(
    carried.readiness.items
      .filter((item) => item.status === "pass")
      .every((item) => item.stale),
  );
  // Settings changes are detected even when Git bytes have not changed.
  app = reopened;
  const settingsUpdate = await command({
    ...finding,
    changeReason: "Fresh observation",
  });
  await app.action({
    op: "projectSettings",
    projectId: project.id,
    toolchain: "builtin",
    incubating: false,
  });
  await assert.rejects(app.action(settingsUpdate), /候选或检查设置已变化/);
});
