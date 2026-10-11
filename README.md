# Incubator Release Assistant (IRA)

For the current multi-project release preparation, start with the
[downloadable release checklists](docs/release-checklists/README.md). Each
snapshot includes exact commits, completed checks, pending steps, source
patches, and tools for independent verification and continued development.

**IRA is an open-source Apache release workbench that Agents can use, with a
friendly local interface and customization.**

Run `npm install` and `npm run dev`, then open the complete URL printed in the
terminal. Requires Node.js 22.14+ and Git; Go is optional for the separate IRA
release engine. Use `npm run build` followed by `npm start` for production.
The [workbench guide](docs/workbench.md)
covers project onboarding, persistent release tasks, actual Agent handoff and
diffs, source-snapshot checks, preferences and vote/reply drafts.

When you ask an Agent to advance a release, the IRA Skill calls for an initial
progress checklist and a report whenever work stops: completed steps, remaining
work, the stopping reason and the next action. The workbench preserves these
checkpoints and displays them in the release overview. See
[release progress](docs/release-progress-reporting.md) for the shared protocol
and abrupt-interruption limits.

The [preparation review](docs/readiness-workbench.md) records findings by project,
component and ecosystem. It preserves issue history across same-version RCs,
marks old conclusions stale after source/settings changes, and checks evidence
fields before accepting new preparation-complete or later-stage progress claims.
The UI and Agent API share these records; record completeness is not release
approval or independent verification of the evidence.

Release preparation uses [at most one PR per repository/version](docs/release-preparation.md):
complete scoped checks locally, submit the combined fixes, then verify the merged
candidate and advance the release. Updates stay on the existing PR. Automated
checks do not add individual approval prompts; GitHub run policies and ASF votes
remain separate.

The workbench supports generic project/task coordination; the existing **IRA
release engine still executes Casbin Go RC workflows only**. Workbench source
snapshots and mail drafts are explicitly separate from signed public RCs,
community votes and actual email delivery.

## Existing RC engine and reference skills

Alongside the [IRA workbench Agent bridge](skills/ira-workbench/SKILL.md), this
repository contains two independent Agent Skills:

- **Incubator Release Assistant (IRA):** a configuration-driven, cross-platform
  Apache Casbin Go RC preparation, signing, dist-dev upload, and verification
  tool.
- **Apache Incubator Handbook:** an offline reference for podling governance,
  reporting, roles, voting, release policy, IP/licensing, branding, websites,
  community, infrastructure, security, graduation, and retirement.

Its normal job is deliberately small: select a commit, prepare an RC, sign it,
upload the archive/checksum/signature to ASF dist dev, and verify the public
copy. Voting, final release promotion, and broader compliance programs are
separate follow-up work rather than prerequisites for using the RC workflow.

The current RC engine deliberately supports **Apache Casbin Go only**.
The engine has an adapter boundary so later languages and repositories can be
added without weakening the shared release gates.

> IRA is a community tool. ASF policy and the required human votes remain the
> authority. Signing, ASF writes, votes, and announcements are never fully
> automated without human approval.

## What is implemented

- strict, unknown-field-rejecting release-ready configuration validation;
- canonical Casbin upstream, ASF URL, legal-file, disclaimer, and naming
  invariants that configuration cannot turn off;
- exact-commit `git archive` packaging with one top-level directory;
- Apache RAT verification and canonical LF-only SHA-512 output;
- no target-project code execution during `prepare`; verify the selected
  commit's GitHub CI separately;
- lightweight CI for IRA's own tests, vet, formatting, wrappers, and contracts;
- live command logs with PID, 30-second progress heartbeats, and elapsed time;
- separate `prepare`, `sign`, and `stage` trust boundaries;
- an external signing home under the parent workspace, never inside Git;
- signing-key and official `KEYS` verification in an isolated public keyring;
- no-overwrite ASF dist dev staging and public byte-for-byte re-verification;
- resumable state under ignored `.ira/runs/`;
- an ordered release queue that reports the current repository, its next action,
  and the next queued repository without accepting shell commands from data;
- a registered-adapter boundary: `ira adapters` shows what IRA can actually
  run, while unsupported queue entries remain visible and blocked;
- a self-contained Skill containing the Go engine, schema, and Casbin template.

## Prerequisites

- Go 1.22 or newer;
- Git, tar, Java, GnuPG, SVN.

The release Skill includes `scripts/run.ps1` for Windows PowerShell 5.1+ and
`scripts/run.sh` for Bash on Linux and macOS. Both invoke the same Go engine.

## Release readiness is broader than CI

Every release preparation must follow the [mandatory evidence gates](docs/release-readiness.md)
and use the [readiness record](docs/release-readiness-record.md). Missing or
unresolved header, provenance, dependency-license, packaging or public-display
evidence prevents a preparation-complete claim, even when build/RAT/advisory
checks pass. These are Agent workflow requirements; the current engine and
workbench do not automatically decide legal compliance.

For Maven convenience binaries, also follow the [staging checklist](docs/release-maven-staging.md).

Passing target-project CI is necessary evidence for a selected commit; it is
not release approval. Every RC must additionally undergo RAT on the final
source archive, a human review of `LICENSE`, `NOTICE`, `DISCLAIMER`, third-party
material, and each RAT exclusion, and an independent build/test of the extracted
source package before a binding release vote. See
[`docs/release-readiness.md`](docs/release-readiness.md) for the non-negotiable
standard shared by every adapter.

Docker and Podman are not required. `prepare` does not rerun the target
project's `go test ./...` and does not execute candidate code. Select and
review the exact upstream commit, and separately confirm that commit's GitHub
CI before preparation.

Run this command to see the currently executable release adapters:

```powershell
.\Incubator-release-assistant\ira.ps1 adapters
```

## Expected Claude Code workspace

Run Claude Code from the parent workspace, not from inside the repository. The
parent `/abc` directory itself must not be a Git checkout. The normal
Linux/macOS layout is:

```text
/abc/
├── Incubator-release-assistant/   cloned Git repository
└── secretkey/                     release manager's GPG home; never a Git repository
```

Clone with the intended directory name and prepare the external key directory:

```bash
cd /abc
git clone https://github.com/EmryZhang/incubator-release-assistant.git Incubator-release-assistant
mkdir -p secretkey
chmod 700 secretkey
```

Import or generate the signing key with `GNUPGHOME=/abc/secretkey`.
Do not copy a private-key export, keyring, passphrase, token, or credential file
into `Incubator-release-assistant/`. The wrappers reject a secret directory
inside the repository. `.gitignore` also excludes a mistakenly created
`secretkey/` as defence in depth, but ignore rules are not the security boundary.
The wrappers and engine also reject `secretkey` when any parent directory owns
Git metadata, preventing accidental capture by a larger wrapper repository.

The ASF `KEYS` file is public verification material. IRA downloads a disposable
copy under ignored run state; it is not the release manager's private keyring.

## Human workflow

From `/abc`, copy and fill the non-secret template:

```bash
mkdir -p ./Incubator-release-assistant/config/local
cp ./Incubator-release-assistant/config/examples/casbin-go.json \
  ./Incubator-release-assistant/config/local/casbin.local.json
```

The corresponding PowerShell setup from a parent workspace is:

```powershell
New-Item -ItemType Directory -Force .\Incubator-release-assistant\config\local | Out-Null
Copy-Item .\Incubator-release-assistant\config\examples\casbin-go.json `
  .\Incubator-release-assistant\config\local\casbin.local.json
notepad .\Incubator-release-assistant\config\local\casbin.local.json
```

Only the commit, version/RC-derived names, Apache ID, signer fingerprint, and
reviewed runtime choice normally need attention. Passwords, private keys,
tokens, and cookies never belong in JSON.

Then run:

```bash
./Incubator-release-assistant/ira.sh validate \
  --config ./Incubator-release-assistant/config/local/casbin.local.json
./Incubator-release-assistant/ira.sh plan \
  --config ./Incubator-release-assistant/config/local/casbin.local.json
./Incubator-release-assistant/ira.sh prepare \
  --config ./Incubator-release-assistant/config/local/casbin.local.json
```

## Ordered release queue

Use a queue when several repositories appear in a release tracker. IRA processes
the queue in listed order and always prints the current repository, its next
required action, and the next incomplete repository. It does not treat a queue
as permission to skip the signing or staging confirmations.

The maintained [release progress table](docs/release-progress.md) records the
upstream and IRA-adapter status for the active release queue. Keep those two
tracks separate: an upstream issue or pull request is context, not release
approval.

Copy both reviewed examples to the same ignored local directory. Keep each
queued `releaseConfig` path relative to the queue file:

```powershell
Copy-Item .\Incubator-release-assistant\config\examples\casbin-go.json `
  .\Incubator-release-assistant\config\local\casbin.local.json
Copy-Item .\Incubator-release-assistant\config\examples\casbin-release-queue.json `
  .\Incubator-release-assistant\config\local\casbin-release-queue.local.json
```

Change the first item's `releaseConfig` to `casbin.local.json`, then run:

```powershell
.\Incubator-release-assistant\ira.ps1 queue-status `
  -Queue .\Incubator-release-assistant\config\local\casbin-release-queue.local.json
.\Incubator-release-assistant\ira.ps1 queue-prepare `
  -Queue .\Incubator-release-assistant\config\local\casbin-release-queue.local.json
```

`queue-prepare` runs only the current item's safe `prepare` stage. Its status
then tells the release manager whether to sign, stage, resolve a blocker, or
move to the next repository. A `blocked` or `manual` item stops the queue and
must include a note. At present only `casbin-go` has an executable adapter;
other repositories can still remain in the queue with a visible blocker.

During the later `sign` command, the Bash wrapper defaults to
`/abc/secretkey` because the caller is `/abc`. Override it only with another
absolute external directory by passing `--secret-dir`. Validation, planning,
preparation, staging, and public verification do not access the private key
directory.

On Windows, use the same parent-workspace layout:

```powershell
.\Incubator-release-assistant\ira.ps1 validate `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json
.\Incubator-release-assistant\ira.ps1 plan `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json
.\Incubator-release-assistant\ira.ps1 prepare `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json
```

`prepare` prints the exact SHA-512 required for the next explicit boundary:

```powershell
.\Incubator-release-assistant\ira.ps1 sign `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json `
  -Confirm <exact-128-character-sha512>

.\Incubator-release-assistant\ira.ps1 stage `
  -Config .\Incubator-release-assistant\config\local\casbin.local.json `
  -Confirm "STAGE RC2"
```

On Linux/macOS, remain in `/abc` and use:

```bash
./Incubator-release-assistant/ira.sh sign \
  --config ./Incubator-release-assistant/config/local/casbin.local.json \
  --confirm <exact-128-character-sha512>
./Incubator-release-assistant/ira.sh stage \
  --config ./Incubator-release-assistant/config/local/casbin.local.json \
  --confirm "STAGE RC2"
```

Staging automatically re-downloads the public candidate and verifies its
archive, checksum file, and signature file byte-for-byte, then also verifies
the checksum meaning and GPG signature. Re-running `prepare`, `sign`, or
`stage` resumes and revalidates the frozen files instead of rebuilding them.

After the run succeeds, the project author must still personally inspect the
RAT report, every `.rat-excludes` entry, and the actual `LICENSE`, `NOTICE`, and
`DISCLAIMER` content. RAT reporting zero unapproved files does not by itself
approve the legal reason for an exclusion or bundled third-party material.

## What signing and "exact bytes" mean

Signing does not change the source archive. GPG reads the exact
`*.tar.gz` bytes and uses the release manager's private key to create a
separate ASCII-armored `*.asc` file. A reviewer imports the public key from
the official `KEYS` file and verifies the signature. Verification proves both
that the configured key signed the archive and that the archive has not
changed since signing.

An RC consists of three immutable files:

1. the source archive (`*.tar.gz`);
2. its canonical checksum line (`*.sha512`);
3. its detached signature (`*.asc`).

"Exact bytes" means every byte in all three files must remain identical to
the files proposed for the vote. CRLF instead of LF, recompressing the same
source, or signing the same archive again produces different bytes. Any such
change creates a different candidate and requires a new RC and fresh votes.

After signing, IRA writes `evidence/candidate-manifest.txt` with a SHA-512 for
each of the three files. Resume, staging, remote-directory recovery, and public
verification must all match that manifest. The checksum file itself is
accepted only as exactly 128 lowercase hexadecimal characters, two spaces, the
plain archive filename, and one final LF byte.

## Safety model

The release is split into three trust domains:

1. `prepare` clones the selected commit, builds and inspects the source archive,
   and runs RAT. It does not execute target-project code, invoke GPG, or use
   ASF-authenticated commands. Confirm GitHub CI separately for the exact
   selected commit.
2. `sign` executes no repository code. It re-hashes the prepared artifact and
   requires the human to repeat that exact digest before accessing GPG. It
   explicitly uses the external `<workspace>/secretkey` home, then freezes
   the archive, checksum, and signature file digests.
3. `stage` revalidates all three frozen files and the GPG signature, requires
   `STAGE RC<n>`, refuses existing remote RC directories, avoids credential
   caching, and verifies every public file byte-for-byte.

IRA records complete host test command output as private local evidence. The
installed Go toolchain and selected upstream commit must therefore be trusted.
If a command takes a long time, its current command, working directory, elapsed
time, and `evidence/*.log` path remain visible on screen and in the log itself.

## Repository layout

```text
config/                         Human-facing schema and template
docs/                           Architecture, security, adapter contract, and repository map
legacy/casbin-go-rc/            Preserved pre-engine PowerShell baseline
skills/apache-incubator-handbook/
  SKILL.md                      Offline incubation-knowledge router
  references/                   Roles, governance, release, IP, branding, lifecycle, and security
skills/incubator-release-assistant/
  SKILL.md                      Agent workflow
  assets/                       Self-contained schema and template mirrors
  scripts/run.ps1               Windows Skill entry point
  scripts/run.sh                Linux/macOS Skill entry point
  scripts/ira/                  Go CLI, engine, and tests
scripts/sync-skill-assets.ps1   Keeps Skill assets identical to root config
ira.ps1 / ira.sh                Human-friendly entry points
```

`secretkey/` is intentionally absent from this tree because it is a sibling of
the repository, not repository content.

For a file-by-file explanation, see
[`docs/repository-map.md`](docs/repository-map.md).

## Offline incubation knowledge

Broader Apache Incubator knowledge lives in the separate
[`apache-incubator-handbook`](skills/apache-incubator-handbook/SKILL.md) Skill.
It uses progressive disclosure: an Agent reads only the reference matching the
question. The release Skill neither loads nor depends on the handbook.

The bundled summaries were verified against official ASF sources on 2026-08-02.
Ordinary questions should be answered offline; live rosters, current report
templates/deadlines, vote state, distribution contents, and later policy changes
still require current official evidence.

## Current boundary and extension path

The only registered adapter is `casbin-go`; other project IDs, repositories,
ASF destinations, and adapters are rejected. To add another ecosystem, first
implement and test a new adapter following [docs/adapter-contract.md](docs/adapter-contract.md).
Do not add arbitrary shell commands or project-name conditionals to config.

The old PowerShell flow remains under `legacy/` as migration evidence, not as
the default engine.

## License

Apache License 2.0. See [LICENSE](LICENSE).
