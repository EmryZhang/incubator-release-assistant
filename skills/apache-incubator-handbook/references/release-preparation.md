# One preparation PR per release

For each target repository and release version, complete the scoped preparation
before requesting upstream review. Use at most one preparation PR; use none
when the reviewed source already needs no changes. This is the Agent workflow,
not a new executable adapter or a server-enforced PR limit.

## Complete authorized work in one conversation

The user should be able to request a release once and have the Agent carry the
authorized work through in the same conversation, without repeated prompts to
continue, recheck readiness or look for missing requirements. This is the target
execution experience, not a promise that external reviewers or votes finish in
one turn. Preserve the requested scope, existing authorization and exclusions.

Recover the current record, apply every required check, investigate findings,
repair scoped defects, verify the combined result and continue to the next
authorized stage. A successful command, a new checklist, a saved checkpoint or
a small milestone is not by itself a reason to end unfinished release work.
An unperformed check or research task that the Agent can still execute is an
Agent-owned pending action, not an external blocker to send back to the user.

Before handing work back, finish independent actionable work and consolidate
genuine external dependencies into one concrete handoff: exact affected stage,
what was investigated, evidence, responsible role, prepared change or choices,
the minimum action needed, and what resumes afterward. Do not repeatedly ask
for the same evidence, approval or a generic instruction to continue. If new
external evidence arrives, reconcile it with the checkpoint and proceed without
requiring the user to repeat the release objective. Keep progress updates brief
and proactive; do not make the user act as the checklist runner.

Stop when the requested scope is complete, the user explicitly narrows/stops
the work, or no meaningful authorized action remains until a concrete external
event/decision. Record technical interruptions honestly and preserve a usable
checkpoint. Do not bypass votes, signing/publication authorization or the one-PR
boundary to meet this experience target, and do not claim background follow-up
unless a supported follow-up mechanism was actually arranged. A request only
to record progress is satisfied by recording it; it does not itself authorize
new external release actions.

## Finish foreseeable changes before the first PR

The intended sequence is: complete local preparation and validation -> submit
one preparation PR -> review and merge -> verify the actual merged candidate
and CI -> create, sign, stage and verify the RC -> vote -> publish the approved
originals and complete the announcement. Repeat this per repository/version;
coordinating several releases does not combine their source or approval gates.

The first preparation PR is the boundary for finishing all foreseeable scoped
changes, not the starting point for discovering standard release requirements.
Complete code, dependencies, versioning, legal files, packaging, metadata and
release-workflow changes and their local verification before submission.
Writing a new checklist is not completing its checks: apply new audit items to
the current candidate before declaring it ready for that first PR.

| Timing | What must be resolved or verified |
| --- | --- |
| Before the first preparation PR | All known scoped source/artifact changes and local checks; provenance, copyright, licensing or distribution decisions that can change source, bundled contents, coordinates or workflows |
| During review of that same PR | Reviewer feedback and new findings; batch corrections into its branch and revalidate affected evidence before merge |
| After merge | Rebind to the actual merged commit/CI and final archives; final reviewer and signing/KEYS/channel prerequisites; actual RC creation, signatures, staging and public verification; votes and approved publication |

Do not keep a PR waiting for evidence that can only exist later, such as an
actual staged RC, its signatures or a release vote. Conversely, do not postpone
an unresolved source-affecting decision as "release paperwork" until after
merge. Resolve known workflow/coordinate requirements before the PR even when
actual credential use and publication are later steps.

For Maven distribution, apply the [Maven staging checklist](release-maven-staging.md):
settle the staging/promotion route and known binary/Javadoc legal questions
before submission when they can change source or contents. Actual signed closed
repository URLs belong before the vote, not before the preparation PR. Include
source and Maven review links and the applicable dev ballot/result; replacement
candidates receive fresh votes rather than inheriting a cancelled RC's tally.

After merge the normal work is candidate verification and release execution,
not a planned second round of source repairs. This does not guarantee that no
unexpected problem can ever appear: report any new blocker and its effect,
stop the affected release step, and seek an explicit scope decision before
another preparation PR. Never conceal the problem or bypass review to preserve
the one-PR count. Later gates stay distinct; a passed vote still requires
promotion/publication of its approved originals.

## Prepare the complete change locally

Read the [mandatory readiness standard](release-readiness.md) and fill the
[per-release evidence record](release-readiness-record.md). PREP-01 through
PREP-08 are required before a completeness claim or preparation PR submission.
The table below is navigation, not a substitute for those gates. In particular,
RAT does not establish ASF header/provenance compliance, an advisory scan does
not clear dependency licenses, and a bundled DISCLAIMER does not satisfy
public incubation-display review. Unknown or unresolved items remain pending
or blocked. These checks are part of ordinary preparation, not an optional
audit to perform only after the user challenges a readiness claim.

Complete AUDIT-01 through AUDIT-07 within those PREP gates: origin/history,
nested license/NOTICE mapping, actual RAT coverage, artifact/display consistency,
all publication triggers, prior public review findings, and tool/reviewer limits.
Use the detailed rows in the evidence record, not a generic pass statement.
On resumption, check whether new public review findings affect the current
candidate and revalidate their dispositions before advancing its stage.

Fill the readiness record's project-specific matrix for each released component
and ecosystem, including actual package identity and source-affecting naming
decisions. Carry unresolved finding IDs across replacement commits and smaller
PR revisions; require specific closure evidence rather than treating merge or
an Agent's compatibility rationale as approval. Before signing, reconcile that
list again. A source-only RC still contains the manifests and workflows that
determine later distribution; do not defer their known identity changes.

Recover the release scope, existing preparation branch/PR and previous evidence.
Reuse decisions already made. Collect genuinely missing owner decisions in one
request after the available checks make the choices concrete.

Before opening the PR or asking a maintainer to approve its workflows, cover
the following areas together:

| Area | Evidence to prepare |
| --- | --- |
| Scope and version | Latest formal release and RC tags, chosen next version, included changes and explicit exclusions; version committed in the package manifest |
| Dependencies | Direct dependencies, relevant resolved dependencies and public advisories/update PRs; compatibility and a scoped fix or documented disposition |
| Source and licensing | Source archive layout, headers, LICENSE, NOTICE, DISCLAIMER, third-party material and precise RAT exclusions |
| Packaging and publication | Tag/version equality, RC versus final triggers, no-overwrite behavior, preservation of voted artifacts and required credentials/permissions |
| Build and tests | Appropriate full build/test run of the final locally prepared source extraction and checks of distributed artifacts |
| Review handoff | One coherent diff, latest source revision, results, unresolved decisions and the concrete next release action |

Resolve findings in the same local branch, then validate the combined result.
Batch related fixes before pushing; do not push each finding just to discover
the next one in upstream CI. Automated tests and scans do not each require
user approval. The IRA `prepare` engine still does not execute target code:
target builds run as separate, appropriately isolated verification work.

If Docker is unavailable, first check for an existing native toolchain and
disposable local database processes or an already authorized test environment.
Use separate test data directories and loopback ports, preserve existing
services, and stop temporary processes after verification. Record the actual
platform/runtime/TLS/database matrix and consumer/package checks. Do not turn
a Docker failure into a source defect or automatically skip tests that can run
without it; do not make unrelated dependency/toolchain changes to force a pass.

Keep dependency review within the selected release. Public affected-version
matches need assessment, not an unsupported claim of application exploitability.
A closed update PR needs its prior disposition checked. Optional upgrades and
unrelated hardening do not become new release blockers. Private security
material stays outside public PRs, reports and the distributed product.

## Review one PR

Before pausing for a blocker, record a stable finding ID, affected repository
and exact source/artifact, observed evidence, policy or project-decision basis,
the stage it actually blocks, responsible role, next action and evidence that
will close it. Distinguish a confirmed defect from missing evidence and from a
tool/environment failure. A project's public clarification may answer an older
question: read the complete relevant thread before asking for the same material
again. Do not demand a private grant copy when an applicable durable project
record is sufficient, or mistake a blank status-page field for proof of no grant.

Continue independent authorized work while a blocker is open. A blocker is not
a waiver, and recording it does not complete the affected gate. Keep the current
index, readiness record and PR/handoff draft consistent. When evidence arrives,
close or narrow the finding with the actual disposition and rerun only affected
checks. A later channel-administration task must not be confused with a local
source change; unresolved decisions that can change source remain pre-PR work.

For a defect discovered after merge, first report the affected merged commit
and blocked release stage. Prepare a minimal, reviewable correction and its
validation separately from the target branch. Do not silently create another
preparation PR, amend the merged candidate or push directly; record the agreed
exception/process before applying the correction to the release candidate.


Submit the combined version, dependency, legal and packaging changes in that
one PR. If a preparation PR already exists, update its branch, title and body;
do not open a separate dependency, license or workflow PR for the same release.
Apply reviewer feedback to the same PR and batch updates before requesting
another workflow run. Do not request merge until the scoped checks and required
decisions are resolved and the final PR revision has the required CI evidence.

A draft preparation PR counts as the same single PR and has the same PREP gate
requirements; draft status does not waive the submission gate. Resolve concrete
scope questions using the local diff and evidence before submission. After
merging, a newly discovered code blocker must be reported with its consequence;
do not silently open a second preparation PR or bypass review with a direct
push. An exception to the one-PR scope needs an explicit owner decision.

## Merge, verify the candidate and release

After merge, freeze the actual merged commit and verify its CI. Recreate and
check its final archives and digests: squash/merge metadata can change archive
bytes even when the source tree matches. Reuse applicable findings with an
explicit tree/toolchain link, but do not substitute old archive hashes or PR CI
for the actual merged candidate. Changed code/dependencies require affected
checks to run again. Unchanged checks are not repeated without a reason.

Continue with the RC tag, final archive/legal review, signing, staging, public
download verification, applicable community votes, promotion and announcement.
These stages do not need new preparation PRs. Promote the voted originals.
An actual change to staged artifacts requires a new RC under the existing
[release readiness standard](release-readiness.md).

Carry existing authorization forward; routine preparation, local checks and
same-PR repairs do not add confirmation prompts. When a distinct action still
requires authorization, prepare the exact reviewable action first and explain
the applicable requirement. Separate signing/staging commands and their exact
engine confirmations remain; they do not imply approval for each test.

## GitHub workflow approval is a separate policy

One PR does not guarantee one Actions approval. Public-fork runs may require a
maintainer with write access to approve them; later updates can trigger more
runs. Do not repeatedly request approval while the prepared change is still
being assembled.

An administrator can inspect the repository's Actions settings and any inherited
organization/enterprise constraints. GitHub offers approval policies for all
external contributors, first-time contributors, or first-time contributors new
to GitHub. Where project policy permits, the administrator can consider the
first-time-contributor policy for recurring contributors. A maintainer-owned
branch is another route for an authorized release manager with appropriate
repository access; branch/ruleset and release-environment controls still apply.
Do not grant access or relax organization policy as an incidental release edit.

Without the required permissions, report the observed run status and hand off
one concrete administration task; do not claim that the policy was changed.
Never replace fork CI with privileged execution of PR code to avoid approval.

Sources checked 2026-09-13: [GitHub fork-run approval](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks),
[repository Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository),
and [ASF release policy](https://www.apache.org/legal/release-policy.html).
Code review and Actions approval do not replace the applicable ASF release vote.
