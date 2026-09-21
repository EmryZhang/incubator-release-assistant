# Release progress and interruption reports

When a user asks IRA to prepare, advance or resume a release, the Agent shows
a checklist, continues authorized work, and records meaningful milestones.
Before ending an unfinished run, it reports completed steps, remaining steps,
the reason for stopping and the next action. This does not introduce an approval
gate or expand the user's requested scope.

The expected experience is one release request carried through in the same
conversation, without the user repeatedly asking for progress or readiness
checks. Follow [continuous execution and its stopping boundary](release-preparation.md#complete-authorized-work-in-one-conversation).
Saving progress is a checkpoint, not a substitute for finishing Agent-owned
checks/research/fixes or a reason to return a generic "next step" to the user.

Follow the [one-PR preparation workflow](release-preparation.md). Keep the
existing preparation PR, validated revision and outstanding decisions in the
preparation step's evidence. Distinguish a pending Actions run approval from
code review or an ASF vote. Report automated test counts as test results, never
as a count of user approvals. Do not introduce per-check confirmation prompts.

## Shared checklist

Before reporting preparation complete, attach a completed
[readiness record](release-readiness-record.md) for the exact source and satisfy
the [mandatory readiness gates](release-readiness.md). A customized progress
list containing only build/RAT rows must not be used to claim Apache readiness.
Keep technical-check success, preparation completion, verified RC, vote approval
and public release distinct. Invalidate affected conclusions after changes and
correct the current report when a previously missed requirement is discovered.
The progress API does not independently verify these legal facts.
The workbench now also enforces the [structured review log](readiness-workbench.md):
existing findings/steps cannot disappear, closure fields must be complete, and
new preparation/later-stage progress claims require current review records.
It still cannot establish the truth or authority of submitted evidence.

Creating a workbench release initializes eight pending steps: scope, source
preparation, candidate verification, signing, staging and public verification,
applicable votes, distribution, and announcement/archive. The overview shows
each status and its evidence, the last report time, next action and recent
history. “更新进度 / 记录暂停” edits the checklist; “查看汇报文本” provides text
that can be copied into a conversation. These are recorded reports, not a live
Agent monitor or new execution providers.

The API can customize the steps for a project's release process. It accepts
1–40 steps with unique stable IDs. Keep required release gates visible;
non-applicable steps need an explicit reason. Mark a step completed only with
actual evidence. Checks, task review, phase changes and draft creation do not
automatically complete release steps. If the user requested preparation only,
report preparation complete only after every applicable PREP gate is satisfied,
and explain the remaining release steps. Otherwise report the technical checks
that passed and the unresolved preparation gates.

## Agent API

Read `/api/packet?releaseId=ID` for release context without a job ID, or
`/api/progress?releaseId=ID` for `progress`, copyable `text`, full `history`,
`revision` and `sourceChanged`. A changed source snapshot means the report
needs review, not that all previously completed external actions are undone.

Submit a JSON file through the existing CLI:

```powershell
npm run ira -- api --data D:\ira-local --path /api/action --body D:\progress.json
```

Example of completed technical checks with preparation still blocked (use the
full current checklist in an actual update; `progressRevision` is the count
returned by the server). Replace all placeholders with actual evidence. The
example is not a preparation-complete report or a reason to stop when the
Agent can resolve the remaining work under existing authorization:

```json
{
  "op": "reportProgress",
  "releaseId": "<release ID>",
  "progressRevision": 1,
  "progress": {
    "status": "blocked",
    "summary": "Recorded build and RAT checks passed; preparation remains incomplete.",
    "stopReason": "PREP-04 requires a dependency-license decision from the responsible project authority; see the linked finding.",
    "nextAction": "Resolve the documented PREP-04 finding, complete the remaining PREP gates, then review the combined preparation change.",
    "steps": [
      {"id": "technical-checks", "title": "Recorded build and RAT checks", "status": "done", "evidence": "<exact commit/tree, archive hash, commands, results and limits>"},
      {"id": "prepare", "title": "Complete preparation gates", "status": "blocked", "evidence": "<readiness record with all PREP-01 through PREP-08 states; PREP-04 finding, policy basis and responsible authority>"},
      {"id": "public-rc", "title": "Sign, stage and verify public RC", "status": "pending", "evidence": ""},
      {"id": "vote", "title": "Complete applicable votes", "status": "pending", "evidence": ""},
      {"id": "publish", "title": "Distribute, announce and archive", "status": "pending", "evidence": ""}
    ]
  }
}
```

Overall status is `pending`, `running`, `paused`, `blocked` or `complete`.
Step status is `pending`, `running`, `done`, `paused`, `blocked` or `skipped`.
Only one step may be running. Completed/skipped steps require evidence/reason;
all unfinished reports require `nextAction`. Paused/blocked reports also require
`stopReason` and cannot leave a running step. `complete` requires every step
to be done or skipped. On resumption, update the summary and clear the previous
stop reason. The server records time and current source snapshot; clients do
not submit them. A stale or missing revision is rejected: reload and reconcile
the other report before retrying, rather than overwriting it.

Reports append to optional `release.progressReports` in schema 1. Older state
without reports remains readable and is not rewritten merely by opening it.
The UI asks for an evidence-based initial report instead of inventing completed
steps from older task history. Persisted history survives server restarts.

## Stopping and resuming

Separate Agent-owned pending work from real external dependencies. Before
ending an unfinished execution, identify why each remaining action cannot be
performed now and finish independent work that can. Group the minimum external
decisions/actions into one evidence-backed handoff. Do not label unfinished
legal research, an unrun audit row or a fixable tool failure as requiring the
user merely because it has been written into the blocker table.

For normal stops, save a paused/blocked report and show it to the user in the
same turn. If saving fails, still report progress in chat and state that the
checkpoint was not saved. With no workbench, keep a local progress note outside
public source. Do not put private release data in IRA's distributed examples.

A crash, killed process or lost connection may prevent an immediate report.
IRA retains the last saved checkpoint and its timestamp; it does not detect
Agent termination automatically. On resumption, reconcile artifacts and
external results first, especially before repeating an action with an unknown
result. Stored `running` does not prove that work is still executing.
