# Repository guidance

## Purpose and current scope

Maintain a safe, configuration-driven Apache Incubator release engine and
self-contained Agent Skill. The current executable scope is Apache Casbin Go
only. Do not claim support for another project/language until its adapter and
contract tests exist.

The local IRA workbench is a separate coordination surface in
`src/server`, shared TypeScript models in `src/shared`, and Vite frontend in
`web`. Start it with `npm run dev`; `npm test` builds and checks the Node
workbench. Go is only required for the independent IRA adapter. It supports
generic project/task/notes/mail records and source-snapshot presence checks;
this is not executable multi-language release support. Read
`docs/workbench.md` for the implemented scope. Preserve the Apache focus,
Agent accessibility, friendly interface, customization and open-source
direction. Ordinary extensions may refine implementation without changing
these core product commitments.

## Commands

```powershell
# Human entry point from the parent workspace (for example C:\abc)
.\Incubator-release-assistant\ira.ps1 validate `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json
.\Incubator-release-assistant\ira.ps1 plan `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json
.\Incubator-release-assistant\ira.ps1 prepare `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json

# Repository-maintenance commands, still from the parent workspace
$repository = ".\Incubator-release-assistant"
$engine = Join-Path $repository "skills\incubator-release-assistant\scripts\ira"
go -C $engine test ./...
go -C $engine vet ./...

# Repository and Skill contract
& (Join-Path $repository "scripts\validate-repository.ps1")
```

After changing root schema/example files, run
`Incubator-release-assistant/scripts/sync-skill-assets.ps1` and commit both
mirrors.

The canonical readiness standard, evidence template and preparation workflow
live in `docs/release-readiness.md`, `docs/release-readiness-record.md` and
`docs/release-preparation.md`. After editing them, run the same sync script and
`scripts/validate-repository.ps1`; include the generated references for all
three Skills. Do not hand-edit policy mirrors or leave installed Skills with
older rules. Scenario expectations in the release Skill's evals are evaluation
cases, not evidence that a model evaluation has actually been run.

## Commit and pull-request convention

Use Conventional Commits for every non-merge commit subject and PR title:
`type[(scope)]: summary`. Allowed default types are `feat`, `fix`, `docs`,
`style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.
Examples: `feat: add prepare progress logs` and
`docs: document semantic commit rules`. Before pushing, inspect every subject
in the PR range and make the PR title semantic as well; squash merges use that
title. Do not rely on an empty follow-up commit to repair a non-semantic change.

## Non-negotiable boundaries

- Carry an authorized release request through the same conversation without
  repeated user reminders to continue or recheck. Do not stop at a checklist,
  checkpoint, isolated successful command or milestone while Agent-owned work
  remains actionable. Finish independent checks/research/fixes, then hand off
  genuine external decisions together with concrete evidence and continuation.
  Follow `docs/release-preparation.md#complete-authorized-work-in-one-conversation`.

- Finish all foreseeable scoped changes and local verification before the first
  preparation PR, including decisions that can change source/artifact contents.
  Apply new audit rules to the current candidate before submission. Actual RC
  signing/staging and vote evidence belong later and must not block that PR.
  After merge, verify the exact candidate and advance release execution; report
  unexpected source blockers without planning or silently opening another PR.
  Follow the first-PR boundary in `docs/release-preparation.md`.

- Complete the detailed AUDIT-01 through AUDIT-07 evidence in the readiness
  standard/template as part of PREP, including public review history and all
  publication side effects. A checker verdict, earlier vote or promised fix is
  not a verified disposition. Preserve component and PPMC/IPMC vote boundaries.
  These checks are mandatory on ordinary release work and resumption.

- Read `docs/release-readiness.md` and complete every gate in
  `docs/release-readiness-record.md` before declaring preparation complete or
  submitting its PR. Missing, unknown, stale or unresolved evidence cannot pass.
  Separate ASF contribution headers/provenance, exact package licensing/RAT,
  dependency licensing AND advisories, artifact contents, public incubation
  display/metadata, workflow safety and actual builds. Technical success is not
  Apache compliance approval. Required checks are ordinary release preparation,
  not optional hardening; do not defer them until the user requests an audit.
- Name the exact readiness stage and preserve pending later gates. Rebind
  evidence after source/dependency/artifact changes; promptly correct earlier
  "ready" claims when an overlooked issue appears. Record policy versus guidance
  and case-specific dispositions; do not invent blanket license bans, human
  approvals or mandatory namespace changes. The record is an Agent requirement,
  not a claim of new automated legal enforcement or per-check user approval.
- Use at most one preparation PR per target repository/release version; use none
  if no source changes are needed. Complete scoped dependency/advisory, version,
  legal/RAT, packaging and build/test checks locally before requesting review.
  Batch fixes in that branch and update the existing PR. After merge, verify
  the actual candidate and proceed with release stages; do not automatically
  open another preparation PR. Follow `docs/release-preparation.md` and carry
  existing authorization forward without per-check approval prompts.

- `prepare` must not execute target-project tests or accept project commands
  from JSON. Verify the selected commit's existing GitHub CI separately; IRA's
  own unit tests belong in this repository's lightweight CI.
- CI is necessary evidence, never release approval. Before signing, every final
  source archive must pass RAT with zero unexplained findings, and its
  `LICENSE`, `NOTICE`, `DISCLAIMER`, third-party material, and every RAT
  exclusion must receive a human legal review. A reviewer must also build and
  test the extracted source package before casting a binding release vote.
- `prepare` must not invoke GPG or ASF-authenticated commands. It archives and
  inspects a reviewed upstream commit without running code from that project.
- The Agent runs from the parent workspace. Keep the checkout and secret root as
  siblings (`/abc/Incubator-release-assistant` and `/abc/secretkey`); never
  weaken the wrapper/engine rejection of repository-contained keys.
- Signing and staging remain separate commands with exact human confirmations.
- Configuration contains no arbitrary shell command.
- ASF legal, disclaimer, RAT, checksum, signature, KEYS, no-overwrite,
  and public-download gates are engine policy, not optional project data.
- A staged RC cannot be cleaned or overwritten; changed bytes require a new RC.
- Treat `legacy/casbin-go-rc/` only as historical migration evidence.

## Repository hygiene

Never commit active local configuration, `.ira/`, artifacts, evidence, private
keys, passwords, tokens, cookies, credential stores, or private-list content.
Public Apache IDs and signing fingerprints may appear only where operationally
necessary. Inspect staged changes for secrets before committing.

When adding an adapter, follow `docs/adapter-contract.md` and preserve the shared
trust boundaries rather than adding project-name branches to common execution.
