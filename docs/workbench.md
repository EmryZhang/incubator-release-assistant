# IRA local release workbench

IRA is an open-source Apache release project that Agents can use, with a
friendly local interface and customization. The workbench frontend and backend
use **Node.js / TypeScript**. The existing Go IRA engine remains an independent,
optional release-tool adapter.

## Start

Install Node.js **22.14 or newer** (Node 24 is used in CI) and Git. A Go
installation is not needed to start or use the workbench.

From the cloned IRA repository:

```powershell
npm install
npm run dev
```

Open the **complete URL** printed in the terminal, including its initial
session fragment. Keep the terminal running. Ctrl+C stops the server and
releases its data-directory lock.

Vite serves the frontend with hot updates on the same local origin as the Node
API. The backend runs through the TypeScript development watcher. No model API
key or database service is needed.

To choose a data directory and port:

```powershell
npm run dev -- --data D:\ira-local --addr 127.0.0.1:8788
```

For production, build once and start the compiled Node server:

```powershell
npm run build
npm start
# Optional arguments:
npm start -- --data D:\ira-local --addr 127.0.0.1:8788
```

The same npm commands work on macOS/Linux; supply a platform-appropriate
absolute data path. Existing `isa.ps1` / `isa.sh` are compatibility launchers
for the Node development server and API client.
Use `npm run ira -- serve` or `npm run ira -- api ...` for the workbench CLI.
`npm run isa -- ...` remains an alias for existing integrations. The separate
`ira.ps1` / `ira.sh` entry points still invoke the Go release engine.

A port can be used by one server. A data directory can be used by one IRA
instance even when ports differ. Stop the previous instance before restarting
or switching between Go and Node. A restart rotates the local session token;
open the newly printed URL to reconnect.

## Data compatibility

New installations use `%AppData%/ira` on Windows,
`~/Library/Application Support/ira` on macOS, and `$XDG_CONFIG_HOME/ira`
(or `~/.config/ira`) on Linux. If the new directory is absent and the sibling
`isa` directory exists, IRA reuses that directory in place, preserving saved
records and absolute evidence paths. If both exist, `ira` takes precedence.
Override the location with `--data` or `IRA_DATA_DIR`; `ISA_DATA_DIR` remains
a fallback when `IRA_DATA_DIR` is unset. Explicit `--data` has highest priority.

Node reads the same schema-1 `state.json`, `notes/user.md`,
`notes/PROJECT_ID.md`, and evidence paths. Loading old data does not rewrite it.
Before the first successful Node state write, the original bytes are saved as
`state.before-node.json` if no such backup exists. Existing project/task IDs,
release versions, mail, drafts and checks are retained.

Corrupt state, unsupported schemas or invalid references fail startup while
preserving the original file. Notes remain editable Markdown; refresh the UI
after external edits. Back up the full private data directory, not just the
metadata: evidence files may live at recorded absolute paths.

`server-lock.json` prevents simultaneous Node writers. Stale locks from a dead
process can be reclaimed; an active process is never silently displaced. The
startup check also recognizes a reachable Go prototype sharing the directory.
`session.json` contains local API credentials and must not be published.

## Initial capabilities

1. Add existing Git checkouts without moving them; view branch, commit, status,
   tracked diffs and bounded text previews, including untracked files.
2. Save versions, RC labels, work phases, tasks, reports and evidence.
   Work phases organize work; they are not release approval states.
3. Give a real local Agent a task packet through the API/Skill, receive evidence,
   inspect its actual file changes and record a separate review.
4. Run deterministic Git, whitespace, fixed-HEAD zip, SHA-512, archive-root
   legal-file presence, incubating disclaimer and Go manifest checks.
5. Choose built-in checks or built-in checks plus an existing Agent review.
6. Save personal defaults and project notes with provenance. Release choices
   override project defaults, which override user defaults.
7. Draft/edit votes, import plain-text review mail with optional source URL and
   threading IDs, create linked tasks, and draft/export unsent EML replies.
8. Maintain project/component-specific preparation findings with immutable
   update history, required closure evidence and source/settings freshness.
   Unresolved or stale review prevents new preparation-complete progress claims.
   See [preparation review and Agent API](readiness-workbench.md); these are
   evidence records and structural guards, not automated legal approval.

Check snapshots exclude uncommitted modifications. Changed source or selected
check settings makes old checks stale. The normal tracked/text-file fingerprint
is preserved across the Go-to-Node migration; unsupported or protected
untracked files may invalidate older evidence conservatively.

RAT, human legal review, independent extracted-source build/test, signing,
KEYS and public RC verification remain explicitly **not run** in this workbench.
A local snapshot is not a ready-to-vote public release candidate. Agent reports
do not turn deterministic failures into passes.

Full release providers, embedded model execution, mailbox sending/receipts,
vote tally, formal promotion/announcement, all-language adapters and bulk
operation across 200 repositories remain later work. Non-Go projects can use
generic coordination and archive checks without claiming language release
support.

## Directory responsibilities

```text
package.json / package-lock.json          npm entry points, pinned dependencies
web/
  index.html
  src/app.ts                             typed interface and user actions
  src/style.css                          presentation and responsive layout
src/
  shared/model.ts                        shared types and runtime validation
  server/
    cli.ts                               development/production/API entry point
    server.ts                            loopback HTTP, Vite and session handling
    store.ts                             serialized state, backup and locking
    git.ts                               bounded read-only Git/file access
    actions.ts                           tasks, Agent reports and communication
    checks.ts                            source snapshot checks and evidence
    providers/ira.ts                     optional existing Go CLI adapter
tests/workbench.test.ts                   integration, migration and boundaries
skills/ira-workbench/SKILL.md             bridge to users' existing Agents
skills/incubator-release-assistant/       unchanged Go IRA engine and RC Skill
dist/                                    generated frontend and backend build
```

The old Go workbench server has been removed; Go remains only in the independent
release engine. Avoid a second parallel implementation of task state. New
language release adapters still follow [the adapter contract](adapter-contract.md).
Do not add arbitrary shell-command configuration.

## Agent/API access

Release intent starts a shared checklist. The overview displays completed,
current and pending steps, evidence, the last saved time and stop/next-action
reports. See [release progress and interruption reports](release-progress-reporting.md)
for the Agent contract, editing, restart behavior and API examples.

Use the local CLI so the Agent does not have to copy session tokens:

```powershell
npm run ira -- api --path /api/state
npm run ira -- api --data D:\ira-local --path '/api/packet?releaseId=ID&jobId=ID'
npm run ira -- api --data D:\ira-local --path /api/action --body D:\report.json
```

For production without dev dependencies, use
`node dist/server/cli.js api --path /api/state` with the same optional flags.

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/state` | GET | State, data directory and runtime |
| `/api/project?id=ID` | GET | Current Git snapshot and file list |
| `/api/file?projectId=ID&path=PATH` | GET | Bounded text preview |
| `/api/notes?projectId=ID` | GET | Notes; omit ID for user notes |
| `/api/packet?releaseId=ID&jobId=ID` | GET | Agent context and progress; omit jobId for the whole release |
| `/api/progress?releaseId=ID` | GET | Current progress, report text, history, revision and source changes |
| `/api/action` | POST | One validated action object |
| `/api/draft?releaseId=ID&id=ID` | GET | Unsent EML export |

Action names and fields remain compatible with the first workbench; their
authoritative schemas are in `src/shared/model.ts`. Unknown fields and wrong
types are rejected. See [the Agent Skill](../skills/ira-workbench/SKILL.md) for
the report protocol. Imported mail and notes are context, not authorization.

## Optional Go IRA adapter

```powershell
npm run ira -- ira adapters
npm run ira -- ira version
```

The bridge exposes read-only `version`, `adapters`, `validate`, `plan` and
`queue-status` commands. It requires Go only when invoked. The existing
`ira.ps1` / `ira.sh` workflows continue to handle prepare, signing, staging and
public verification with their original gates and explicit confirmations.
Node does not reimplement or bypass those release rules.

## Local boundaries and verification

The server binds only numeric loopback addresses, rejects unexpected Host and
Origin, requires session authentication on API requests, bounds request bodies
and prevents path traversal/symlink previews. Common credential paths, Git
metadata, binary and large files are not previewed. These filters are not a
general secret classifier. Source archives contain the selected repository's
tracked source; review what you choose to publish.

Production CSP permits same-origin assets only. Development additionally
permits Vite's inline CSS hot updates and WebSocket connection. Do not expose
the development server through a public reverse proxy.

```powershell
npm test
npm run typecheck
go -C skills/incubator-release-assistant/scripts/ira test ./...
go -C skills/incubator-release-assistant/scripts/ira vet ./...
.\scripts\validate-repository.ps1
```

`npm test` includes production build and real Git/archive → Agent edit/report →
mail/task/reply → restart checks, schema-1 compatibility, backup, concurrency,
locking, API boundaries and a compiled CLI run with Go removed from its PATH.
Node CI runs on Windows and Linux; Go CI remains independent.
