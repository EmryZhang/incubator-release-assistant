---
name: incubator-release-assistant
description: Turn a selected Apache Casbin Go commit into an Incubator release candidate, sign it, upload it to ASF dist dev, and verify the public files with the bundled IRA engine. Use this skill whenever a user wants to prepare, resume, sign, upload, or verify a Casbin RC. The current implementation supports only Apache Casbin Go.
---

# Incubator Release Assistant

Use the bundled engine instead of reconstructing release commands manually.
Keep the task focused on the normal release-manager path:

1. select a commit;
2. prepare the RC files;
3. sign the archive;
4. upload the three RC files;
5. verify the public copy.

Read [the mandatory readiness standard](references/release-readiness.md) and
complete [the readiness record](references/release-readiness-record.md).
Missing or unresolved evidence cannot pass. ASF source headers/provenance,
dependency licenses, exact package contents and public incubation display are
ordinary required preparation checks, not optional "general compliance" work.
Do not expand the run into unrelated governance, key-management, all-platform
or coverage projects. Report actual failures without inventing preconditions.

When a user expresses release intent, first show a checklist of completed,
current and remaining steps, then continue authorized work. Update it at
milestones. Before stopping with the release unfinished, report completed
work, remaining work, the stopping reason and the concrete next action.
Preparation success is not completion of signing, staging, voting or release.
Preserve the user's release scope and reuse existing evidence when resuming.
If the workbench is running, use its shared progress record as described in
[release progress](../../docs/release-progress-reporting.md); otherwise keep
a local checkpoint outside public source and report the same progress in chat.
An abrupt interruption can leave only the last checkpoint; verify actual
results on resumption instead of treating an old running status as live work.

## Establish the run

Do not equate a successful engine command, build, RAT report or advisory scan
with complete Apache preparation. Complete PREP-01 through PREP-08 before
declaring readiness for the preparation PR; preserve pending later signing,
vote and publication gates. Revalidate affected evidence when source or
artifacts change and correct earlier readiness claims if a gap is discovered.
Follow [the combined preparation workflow](references/release-preparation.md).
The Agent record is mandatory; it is not new automated legal enforcement in
the Go engine, and it does not authorize new target languages or add per-check
confirmation prompts.

When source preparation is needed, use at most one PR per target repository
and release version (none when no source edits are necessary). Complete scoped
version, dependency/public-advisory, legal/RAT, packaging and separate build/test
checks locally before submitting the combined change. Keep fixes and review
feedback on that same PR and batch pushes. Do not open a second preparation PR
automatically after merge: report a new code blocker for an explicit scope
decision. Verify the actual merged candidate before the RC stages, reusing
applicable evidence without reusing stale archive hashes. Existing authorization
persists; tests do not each require approval. This does not change GitHub fork
approval policy, ASF voting or the engine's separate sign/stage confirmations.

1. Treat the Agent's current directory as the parent workspace. In the expected
   deployment Claude Code works from `/abc`, the repository is
   `/abc/Incubator-release-assistant`, and all signing-key material is under
   `/abc/secretkey`.
2. Keep the secret directory outside every Git checkout. The platform wrapper
   defaults to `<current-directory>/secretkey`, creates only that empty directory
   when needed, and rejects a path contained by the release repository
   or any larger Git worktree. `/abc` must therefore be a plain workspace. Only
   `sign` may resolve or access this directory; earlier and later stages do not.
3. Read `references/configuration.md` when creating or changing config.
4. Copy `assets/examples/casbin-go.json` to an ignored project-local path if no
   active configuration exists. Never fill Apache ID, commit, or fingerprint by
   guessing; obtain them from the user or verified public state.
5. Use the bundled wrapper for the current platform. Both wrappers resolve a
   relative config path from the caller's working directory and run the same Go
   engine.

```powershell
& <skill-directory>\scripts\run.ps1 validate -Config <config>
& <skill-directory>\scripts\run.ps1 plan -Config <config>
```

```bash
bash <skill-directory>/scripts/run.sh validate --config <config>
bash <skill-directory>/scripts/run.sh plan --config <config>
```

Stop when the configuration does not validate. Tell the user exactly which
field must be supplied or corrected, then continue from the same step.

## Coordinate a release queue

When the user supplies several repositories from a tracker, do not attempt to
publish them together. Use an ordered queue configuration and show the user
the current repository, its next required action, and the next queued item:

```powershell
& <skill-directory>\scripts\run.ps1 queue-status -Queue <queue>
& <skill-directory>\scripts\run.ps1 queue-prepare -Queue <queue>
```

`queue-prepare` runs only the current item's `prepare` step. It must not sign,
stage, vote, or publish a later item. The queue contains repository data and
config paths only; never add command strings. Stop on a `blocked` or `manual`
item and state its note. An item may use an executable adapter only after that
adapter and its contract tests exist.

Use `adapters` when deciding whether a tracker item is executable. Do not claim
that a visible queue item is supported merely because it has a repository URL.

## Prepare in the untrusted-code domain

Run:

```powershell
& <skill-directory>\scripts\run.ps1 prepare -Config <config>
```

On Linux/macOS use `bash <skill-directory>/scripts/run.sh prepare --config
<config>`.

The engine archives the selected commit, checks the extracted source layout and
required files, and runs RAT. It does not rerun the target project's
`go test ./...` or execute candidate code; confirm the exact selected commit's
GitHub CI separately. Docker and Podman are not required. A successful run
prints the artifact SHA-512 and records resumable state under `.ira/runs/`.

CI is necessary evidence, not release approval. Before signing, the release
manager must review the RAT report for the **final source archive**, resolve
every finding, and inspect `LICENSE`, `NOTICE`, `DISCLAIMER`, third-party
material, and each RAT exclusion. Do not use broad exclusions merely to make
RAT pass. Before a binding vote, an independent reviewer must unpack, build,
and test the signed source package; this review does not authorize IRA to run
untrusted target-project code during `prepare`.

Every potentially long-running external command prints an `[IRA] START` record
with its command, working directory, evidence-log path, and child-process PID.
While it is still running, the engine prints an `[IRA] RUNNING` heartbeat every
30 seconds; completion prints `[IRA] DONE` or `[IRA] FAILED` with elapsed time.
The same records and live command output are written immediately to the named
`evidence/*.log` file.

If the user reports that `prepare` appears stuck, do not immediately restart it
or use `--clean`. Identify the most recent `[IRA] START`/`[IRA] RUNNING` record,
read the named evidence log, and inspect that exact child process or its network
access. Report the active phase, elapsed time, last log output, and safest next
action. Preserve the run directory so another Agent can continue the diagnosis.

If preparation fails, report the failed gate and evidence path. Use `--clean`
only for an unstaged matching run after confirming its local work is disposable.
Changed candidate bytes require a new RC number.

## Sign in the trusted domain

Signing is a separate authority boundary. Show the prepared artifact path and
SHA-512 to the user. Proceed only when the user explicitly authorizes signing,
then pass the exact digest printed by `prepare`:

```powershell
& <skill-directory>\scripts\run.ps1 sign `
  -Config <config> -Confirm <exact-sha512>
```

On Linux/macOS run:

```bash
bash <skill-directory>/scripts/run.sh sign \
  --config <config> --confirm <exact-sha512>
```

The engine re-hashes the artifact, uses the configured signing key, creates the
detached signature, and verifies it. It records the archive, checksum, and
signature digests in `evidence/candidate-manifest.txt`. Never request or store
a passphrase. The signing key must come from
`<parent-workspace>/secretkey`; do not fall back to `~/.gnupg` and do not
copy private-key material into the repository.

## Stage and publicly verify

ASF dist mutation requires a second explicit user authorization. Display the
target URL and exact confirmation text, then run only after approval:

```powershell
& <skill-directory>\scripts\run.ps1 stage `
  -Config <config> -Confirm "STAGE RC<number>"
```

On Linux/macOS run:

```bash
bash <skill-directory>/scripts/run.sh stage \
  --config <config> --confirm "STAGE RC<number>"
```

The engine uploads only the archive, checksum, and signature, then downloads
the public files and verifies them again. The RC run is complete when
`publicVerified` is true.

## Finish with the author's RAT reminder

After public verification succeeds, give the user a short completion summary:

- selected commit and RC name;
- public dist-dev URL;
- archive, checksum, and signature filenames;
- confirmation that the public copy was verified.

End with this explicit reminder: the project author must personally review the
RAT report for the final archive, every `.rat-excludes` entry, and the release's
`LICENSE`, `NOTICE`, `DISCLAIMER`, and bundled third-party material. An
automated RAT result of zero unapproved files does not decide whether an
exclusion or bundled third-party material is legally appropriate. Before a
binding vote, an independent reviewer must build and test the extracted signed
source package.

Voting and post-vote release work are separate follow-up tasks. Help with them
only when the user asks; they are not part of this Skill's normal RC run.

## Boundaries

- Current executable adapter: `casbin-go` only.
- Queue commands preserve the same single-repository signing and staging
  confirmations; they never batch those actions.
- Do not execute arbitrary commands from JSON or introduce a host-test fallback.
- Do not store passwords, tokens, cookies, private keys, or private-list text.
- Never stage, commit, upload, or mount `<parent-workspace>/secretkey`; only GPG
  may access that directory during the separate sign step.
- Follow the engine's validation and stop on an actual command failure.
- Treat any byte change in the archive, checksum file, or signature file as a
  different candidate that requires a new RC and fresh votes.
- Signing, ASF writes, vote sending, and announcements always require explicit
  human authorization.
- Do not turn optional hardening ideas into blockers for the ordinary
  commit-to-RC workflow.
- Consult `legacy/casbin-go-rc/` only as repository history; the bundled Go
  engine is the operational implementation.
