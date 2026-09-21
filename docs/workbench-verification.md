# Workbench verification

## Node.js / TypeScript migration — 2026-09-10

The complete workbench frontend, local API, task storage, Git checks and Agent
CLI now run on Node.js / TypeScript. Go remains an optional IRA adapter, with
the previous Go workbench implementation removed from the product tree.

- `npm run dev` started the Node API and Vite frontend on one loopback origin.
  Editing the frontend TypeScript produced an automatic browser update; a
  backend/shared-schema change restarted the development server successfully.
- `npm test` builds the production application and runs four integration tests:
  real Git/archive → Agent/report → mail/task/reply → restart; old Go schema-1
  preservation and backup; stale reports, validation and concurrent writes;
  production HTTP/CLI authentication, Host/Origin, request-size and process-lock
  boundaries. The compiled API client also runs with Go removed from PATH.
- `npm start` launched the compiled server successfully. It was stopped after
  the smoke test, leaving the development demonstration available separately.
- A copy of the actual earlier demo data loaded both projects, both releases,
  Agent reports, notes and both drafts. Its normal Git fingerprint exactly
  matched the previous Go report. A new check ran successfully from the Node
  frontend. The first-write backup hash matched the untouched original state.
- Real migration exposed an old Go zero-value case: historical check records
  sometimes contain `toolchain: ""`. The compatibility schema accepts that
  historical value, and the migration regression test now includes it. Such
  incomplete historical check settings remain visibly stale when appropriate.
- Browser inspection verified the new npm Agent packet command, restored vote
  and reply drafts, and real check results. No application console errors were
  observed during the development workflow.
- `npm run isa -- ira adapters` still reports `casbin-go` through the independent
  Go engine. Existing Go tests and vet passed, as did the repository validator.

Node 24.14.1 and npm 11.12.1 were used locally. Exact npm dependencies are recorded
in `package-lock.json`. Windows and Linux Node CI jobs were added; Linux CI has
not been run from this local session. All mail remains draft-only and no release
was signed, staged, promoted or announced during migration.

## Initial Go prototype — 2026-09-09 (historical)

The initial seven capabilities were exercised locally on Windows. This is
product verification, not an Apache release approval record.

| Capability | Observed evidence |
| --- | --- |
| Local startup and projects | PowerShell launcher and compiled server started; browser empty state, Git project form, branch and commit displayed. Casbin was cloned locally into an isolated sample directory; Apache Commons CLI was cloned separately from its official repository. |
| Persistent release workbench | Two named demonstration releases created; tasks, checks, notes, draft mail and preferences survived a server restart. The saved state file hash was unchanged by restart. |
| Actual Agent workflow | A task created in the frontend was read through `isa api`; a real file was added in the isolated Casbin clone, its staged diff checked, and reports submitted through the API. UI showed actual added lines and file preview, followed by a separate review action. |
| Real checks | Both repositories were archived from fixed commits and SHA-512 was computed. Casbin legal-file and Go manifest presence passed. Its staged, uncommitted demo file correctly caused a dirty-tree finding and stayed outside the HEAD archive. RAT, independent build/test and signature/public verification remained not run. |
| Toolchain choice | Casbin task selected built-in checks plus Agent; Commons CLI used built-in checks. Selection persisted. No remote model or release provider execution was simulated. |
| Preferences and notes | Project Markdown note saved in UI; personal mail signature saved. Automated integration checks verify user/project notes in Agent packets and preference inheritance. |
| Vote and review mail | UI generated an editable vote draft, imported a controlled review message, created a linked task, and generated a reply draft. EML includes `X-Unsent`, `In-Reply-To` and `References`; no real messages were sent. |

Casbin sample source commit: `34297a19bd65cd52d40d146452c20aea7b45c205`.
Apache Commons CLI source commit: `e17111798da51037659b3594d9c0b3b525040081`.
The Commons CLI exercise validates generic coordination and archive checks,
not a Java release adapter. No existing target checkout was edited by these
verification steps. Sample email addresses use `example.invalid`.

## Checks run

- `go test ./...` — existing IRA tests and three new workbench integration /
  boundary tests passed. Real temporary Git repositories and zip artifacts
  are used; no target-project code is executed.
- `go vet ./...` and Go formatting — passed.
- `node --check .../web/app.js` — passed.
- PowerShell repository validator — passed, including launcher/Skill entries.
- `bash -n isa.sh` — passed; a Unix runtime launch has not been exercised here.
- `git diff --check` — passed.
- Browser — inspected empty/project/task/diff/check/settings/mail screens,
  form submissions and real file preview. Desktop and narrow viewport checks
  covered the responsive layout. No application console errors observed.

The Windows sandbox denied Go telemetry cache writes; relocating the build
cache allowed builds and tests to finish. The telemetry message was nonfatal.
Bash syntax checking required the ordinary executable outside the sandbox
because its signal pipe was blocked inside it.

Browser testing found and corrected early modal dismissal during saves,
missing form-label associations and a release selector inline-style/CSP issue.
Check records now also preserve toolchain and incubating settings, so changing
these settings makes earlier checks visibly stale.

## Practical limits

The local server uses one data directory per instance. Existing Agents connect
through the task/JSON API and Skill; there is no embedded model chat runtime.
File previews and Git output are bounded. Legal-file existence does not prove
legal compliance. Full language adapters, mailbox send/receipt, remote release
providers, voting results and formal publication remain future capabilities.
## IRA naming verification — 2026-09-10

The product name is Incubator Release Assistant (IRA). The UI, package name,
documented npm command and canonical Agent skill now use IRA. Earlier records
above retain the command names used at the time.

- `npm test` — passed: TypeScript checks, production build and all five tests.
  The added test checks new `ira` defaults, reading existing `isa` records
  without rewriting them, directory precedence and both environment overrides.
- `scripts/validate-repository.ps1` — passed, including the `ira-workbench`
  skill and both npm entry points.
- Old npm commands, launcher scripts, skill links and data paths remain
  compatibility entries. The workspace and historical design directory were
  not moved.

## Release progress verification — 2026-09-11

- `npm test` passed: TypeScript checks, production build and all seven tests.
  New coverage exercises stop/completion validation, authenticated progress
  API and release-level packets, conflicting updates, restart persistence,
  changed-source detection and reading older records without rewriting them.
- `scripts/validate-repository.ps1` passed for repository and Skill contracts.
- A headless Edge run with an isolated Git fixture verified the initial eight
  steps, saving a paused report with evidence, and copyable report text. Desktop
  and 390-pixel mobile views were inspected; no page errors or page overflow.
- This records checkpoints from users and Agents. It does not automatically
  detect a killed Agent, validate claimed external evidence, or execute any new
  signing, staging, voting, distribution or mail-sending provider.

## Preparation review verification — 2026-09-21

- `npm test` passed: TypeScript checks, production build and all eight tests.
  The new integration scenario uses a temporary Git repository and covers
  missing closure evidence, exception-authority fields, immutable finding
  identities, concurrent writers, source/settings changes, progress gating,
  restart persistence and same-version RC history inheritance. Older schema-1
  records remain byte-identical after read and acquire pending virtual checks.
- `scripts/validate-repository.ps1` passed. The IRA workbench Skill passed
  `quick_validate.py` with Python UTF-8 mode; Windows' default GBK encoding
  could not decode the existing multilingual Skill text.
- In-app browser testing with isolated Java and Rust demonstration projects
  verified project-specific ecosystem records, blockers appearing first,
  refusal of an evidence-free closure, an inline error inside the modal,
  successful saving of an unresolved item, visible appended history and RC2
  inheritance. The narrow layout and modal error were visually inspected.
- The demo records are fictional and live outside the product repository.
  They are not readiness findings or approvals for an actual Apache release.
  The API checks record structure, freshness and supported progress transitions;
  it does not validate linked evidence or authenticate a claimed decision maker.
  External release tools and custom progress labels remain outside this guard.
