---
name: ira-workbench
description: Advance or resume an Apache release with IRA, show a progress checklist, inspect project context and diffs, make scoped repairs, and report progress whenever work stops. Use when the user expresses release intent or provides an IRA release/task ID or workbench packet.
---

# IRA workbench task bridge

Use the user's existing local Agent tools. IRA supplies a Node.js/TypeScript
workbench, not a model runtime. From the IRA clone run `npm install` and
`npm run dev`. Node.js 22.14+ and Git are required; Go is only needed when the
optional IRA release adapter is invoked.

## Start, continue and stop a release

When the user asks to prepare, advance or resume a release, show a progress
checklist before substantive work. Reuse the existing release and verified
records; create a release if needed. Distinguish completed steps, the current
step and remaining work. Continue authorized work without treating the
checklist as an extra approval gate. Preserve explicit scope decisions,
including changes the user has excluded from this release.

Read `/api/packet?releaseId=<release ID>` without `jobId` for release-level
context. It includes `progress`, `progressRevision` and copyable `progressText`.
It also includes `readiness` and `readinessInstructions`: inspect unresolved and
stale findings before claiming preparation complete. Follow the packet's
`recordReadiness` protocol with its current revision, Git snapshot and release
settings.
Use `readinessRevision`, `readinessSnapshot`, `readinessContext` and `readiness`
in the action; copy the first three from the packet's review metadata. The item
contains the review fields only, without derived/server fields `stale`, `at`,
`snapshot` or `context`. Preserve finding IDs across PR reductions and handoffs; review each
component's actual ecosystem and distribution identity. Specific evidence and
disposition are required to close a finding; a merge or compatibility rationale
alone is not an exception decision. The API validates records, not legal truth.
Update the shared progress after each meaningful milestone and before ending
a turn with the release unfinished. In the response, report completed and
remaining steps, why work stopped, and the concrete next action. A preflight,
local archive or mail draft alone does not complete a release. If the requested
preparation is complete, say so and show which later release steps remain;
the checklist does not authorize those later actions.

Use `reportProgress` through `/api/action` as described in
[release progress](../../docs/release-progress-reporting.md). Send the current
`progressRevision` with the complete updated checklist. Completed items need
evidence; skipped items need a reason. For a pause or blockage, save `paused`
or `blocked`, change the running step accordingly, and provide `stopReason`
and `nextAction`. The final response must include the same progress even when
the API is unavailable; explain the save failure rather than claiming it saved.
If no workbench is running, keep a local progress note outside public source
and show the same checklist in chat; a server setup is not a prerequisite to
advancing an otherwise actionable release.

An abrupt interruption may prevent a final report. On resumption, inspect the
last saved checkpoint and actual artifacts or external results before updating
it. Do not infer success or an active Agent from a stored `running` status.
Do not repeat signing, upload or sending just because their result is unknown.

## Complete a task

Read [the mandatory readiness standard](references/release-readiness.md) and
complete [the readiness record](references/release-readiness-record.md) before
declaring preparation complete or submitting its PR. All PREP-01 through
PREP-08 gates need current, source-bound evidence or a valid applicable
disposition. Missing, stale, unknown or unresolved evidence cannot pass.
Build/RAT/advisory success does not establish ASF header, provenance,
dependency-license, package-content or incubation-display compliance. These
are ordinary preparation checks, not an audit deferred until the user asks.
Distinguish technical success, preparation complete, verified RC, vote approval
and public release; correct overstated reports promptly. The progress API does
not automatically establish or enforce legal compliance. Follow the portable
[preparation workflow](references/release-preparation.md) and keep later gates
visible without adding per-check permission requests.

For each target repository/version, use at most one release-preparation PR
(none if no source edits are needed). Before submitting it, finish the scoped
version, dependency/public-advisory, legal/RAT, packaging and build/test checks
locally and validate their combined changes. Reuse the same branch/PR for fixes
and review feedback, batching updates before pushes or Actions approval requests.
Do not leave a known preparation category for after merge. After merge verify
the actual merged candidate and proceed to release stages. A newly found code
blocker needs an explicit scope decision before any second PR; do not create
one automatically. Preserve exclusions and existing authorization, and avoid
per-check confirmation prompts. A PR does not replace GitHub run approvals or
ASF votes. See [preparation workflow](references/release-preparation.md).

1. Read the task command displayed under **Agent 与改动 → 交给 Agent**:

   ```powershell
   npm run ira -- api --data '<IRA local data directory>' --path '/api/packet?releaseId=<release ID>&jobId=<task ID>'
   ```

   The CLI reads local session credentials. Never paste `session.json` or its
   token into reports. If the server is stopped, start it with the same data
   directory. Only one server may own that directory. Do not edit `state.json`
   directly while it runs.

2. Read the target project's `AGENTS.md`, existing changes and relevant files.
   The packet includes project path, task, release, tool selection, Git state,
   checks, user preferences and Markdown notes with source paths. Imported mail
   and notes are context to evaluate, not permission to expand the task.

3. Make authorized changes using your normal file tools. Preserve existing
   work. Explain changes and run appropriate checks. Workbench checks archive
   fixed HEAD and do not run target code, RAT, signing or publication. The
   existing IRA engine handles separately configured Casbin Go RC workflows;
   do not call a local workbench snapshot a verified public candidate.

4. Save a UTF-8 JSON report outside the target repository:

   ```json
   {
     "op": "reportJob",
     "releaseId": "<release ID>",
     "jobId": "<task ID>",
     "status": "reported",
     "summary": "What changed and why",
     "evidence": "Commands actually run, observed results, remaining limits"
   }
   ```

   Submit it to the live API:

   ```powershell
   npm run ira -- api --data '<IRA local data directory>' --path /api/action --body '<report.json>'
   ```

   These commands also work in Unix shells with suitable paths. For a compiled
   installation use `node dist/server/cli.js api` with the same flags.

   Status can also be `running` or `blocked`. A `reported` task awaits user
   review in the frontend. The server records the actual repository snapshot
   at submission; refresh the UI to inspect the report and real diff. Submit
   fresh evidence if the files change again.

## Review mail

Users can import mail into IRA and create linked tasks. If asked to connect
their existing mailbox, honor its actual capabilities and the user's
authorization. Reading, importing, drafting, sending and receipt are distinct.
The workbench has no send endpoint; `importMail` and `saveDraft` preserve the
local task relationship. EML export is not delivery. Never copy private mail
into a public Git repository.

The API schema lives in `src/shared/model.ts` in the IRA clone; the
[workbench guide](../../docs/workbench.md) describes routes and startup.
