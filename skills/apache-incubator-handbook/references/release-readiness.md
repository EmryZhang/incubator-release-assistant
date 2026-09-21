# Release readiness standard

This is the non-negotiable release standard for every IRA adapter and RC. CI
answers whether the selected commit passed the project's normal automated
checks. It does not alone establish that the final source package is safe and
permitted to distribute as an Apache release.

Start with the [one-PR preparation workflow](release-preparation.md): inspect
dependencies, versions, licensing, packaging and builds together before review.
The final-archive gates below validate the merged candidate; they are not a
reason to split known preparation work into additional PRs.

Use the [first-PR boundary](release-preparation.md#finish-foreseeable-changes-before-the-first-pr):
finish all foreseeable scoped changes and checks before submission, including
source-affecting provenance/licensing/distribution decisions. Apply new audit
rules to the current candidate; merely documenting the rule is not evidence.
Do not require later RC signatures, staging or votes before the preparation PR.
After merge, verify the actual candidate and execute the release stages; do not
plan to discover ordinary source requirements in a second preparation round.

## Mandatory evidence and completion claims

This is an IRA Agent workflow requirement for every target language, including
projects without an executable IRA adapter. Read this standard before starting
or resuming release preparation and complete the [readiness record](release-readiness-record.md)
before saying preparation is complete or submitting the combined preparation
PR. Ordinary Apache compliance checks are part of the requested release work;
they do not require a separate request for a "compliance audit".

Use `pending`, `pass`, `blocked`, or `not-applicable` for each gate. Missing,
unknown, stale, unreviewed, or unresolved evidence is NOT a pass. Record a
concrete next action for every pending/blocked item. A not-applicable entry
requires a specific reason and policy/scope basis; absence of evidence is not
such a reason. An applicable obligation cannot be skipped to turn the table
green. An exception requires an identified competent authority, decision,
scope and durable evidence, not an Agent assumption or generic user approval.

Every finding or pass must identify the repository/version, commit or tree,
relevant archive/hash or artifact, evidence location, reviewer and date, and
limits. Record whether the check was automated, Agent-reviewed, or performed
by a named human; never invent human approval. Review current official policy
when applying a legal/distribution rule. Distinguish ASF requirements,
Incubator requirements, SHOULD guidance, project decisions, and IRA workflow
requirements. A case-specific concern is not a new universal prohibition.

### PREP-01 — Version, scope and source identity

Record the selected version, latest observed release/tags, upstream baseline,
preparation branch/PR and explicit exclusions. Inspect the actual manifest and
archive, not just a checklist. Bind all subsequent findings to that source.
Local, fork, PR, merged and tagged states must remain distinguishable.

### PREP-02 — ASF source headers and provenance

Classify first-party contributed files, third-party/copied files, generated
material and justified exceptions. Check the appropriate ASF contribution and
NOTICE header (or an officially accepted equivalent), separately from whether
a file uses Apache-2.0. A generic Apache-2.0 license header is not proof of the
ASF contribution/NOTICE information. Include build manifests, scripts, configs,
documentation and test code, not only production files. Resolve old copyright
lines with the relevant contribution/permission evidence and NOTICE placement.
Never mechanically relabel third-party code or invent a grant. Where donated
code or assets require provenance/clearance evidence, retain the applicable
record; repository location under `apache/` is not that evidence.

### PREP-03 — Exact package licensing and RAT

Review LICENSE, NOTICE and (for podlings) DISCLAIMER against actual bundled
contents, including copied dependencies, images, fixtures and generated files.
Do not append notices for separately downloaded, non-bundled dependencies as
though they were bundled. Run RAT on the clean archive, inspect its coverage
and manually classify exceptions or MIME/binary blind spots. Zero RAT findings
does not prove header, provenance, license or exclusion correctness. Document
exact exclusions and their reasons; broad exclusions are not a repair.

### PREP-04 — Dependencies: security AND licensing

Record both public advisory review and license disposition for direct and
relevant resolved dependencies. Include default, transitive, test-only, optional,
build-tool and bundled roles. Zero OSV/advisory matches is not license clearance.
Distinguish an artifact actually containing third-party code from a POM/manifest
that downloads it. For non-open-source or restricted dependencies, resolve
whether standard use/build requires them, how optional features obtain them,
what is distributed, and the applicable policy basis. Record justified scope,
remediation or an existing applicable decision; unresolved classification stays
pending. Do not label every proprietary driver automatically illegal, remove
compatibility without assessment, or treat an unmaintained notice as a proven
vulnerability.

### PREP-05 — Built and registry artifacts

Inspect the source archive AND each distributed artifact type (for example main,
sources and Javadoc JARs or a crate). Verify required legal material in the
correct locations, actual bundled/generated contents, committed version,
source correspondence, and absence of unintended build outputs or test data.
Copying three legal files successfully is not a complete legal review of the
artifact. Review relevant naming/metadata rules and document compatibility or
platform-specific decisions instead of guessing that a source filename covers
every distribution channel.

### PREP-06 — Publication, incubation display and credentials

Inspect both executable workflow paths and generated user-visible materials.
Check RC marking, no premature registry publication, no overwrite, final reuse
of voted ASF source originals, integrity/source verification before publication
credentials, retry behavior and official download/verification links. For
podlings, check the required incubation disclaimer in GitHub release text,
package descriptions/README displays and other applicable channels, not only
a DISCLAIMER file inside an archive. Check project identity, license and SCM
metadata. Record the basis for ecosystem coordinates and any departure from
SHOULD guidance; do not silently force a breaking namespace/version change.
Track GitHub write/tag, ASF dev staging, ASF release promotion, signing/KEYS,
and registry administration separately. Never expose secret values in evidence.

#### Project-specific identity and distribution review

Apply the common gates separately to each Apache project, released component
and ecosystem/channel. Fill the project-specific matrix in the readiness record
from the actual candidate manifests and artifacts. Shared ownership, a similar
adapter or another component's pass does not establish this component's result.
Map project/component identity, display spelling, package coordinates, consumer
imports, registry administration and publication routes independently. Also
record project-specific build/database/feature requirements, bundled material
and prior review findings under their relevant gates; naming is one example,
not the full project review.

For Maven, check the effective and published POM groupId/artifactId against
current Incubator Maven guidance. Treat `org.apache.<project>` as the default
preparation choice for an incubating project's Maven distribution. If retaining
legacy coordinates, investigate migration costs and the applicable disposition
process before closing the finding. SHOULD does not mean an Agent can waive it:
record the concrete rationale, responsible project decision and any required
IPMC permission. Do not turn this into a claim that all ecosystems must use an
`apache-` prefix, or rename Java packages merely because the Maven groupId changes.

For Cargo and other ecosystems, review the package's own identity and applicable
project/platform rules even when a Maven-specific rule is not applicable. A
manifest name, a source archive filename and a GitHub repository name identify
different surfaces. Check package names, README/install examples, documentation
URLs, generated release text and consumer imports together. Distinguish product
display spelling from public API identifiers; a spelling comment alone does not
authorize breaking API renames. If a new registry name is proposed, verify its
availability/control and the migration implications; an unused name is not proof
that the project controls it. These checks implement project review, not a new
universal Cargo naming policy.

Source-only RC packaging does not postpone a known coordinate/name decision
that would change its POM, Cargo.toml, documentation or publication workflow.
Actual registry publication and credentials remain later gates; the identity of
the source that will produce those artifacts must be settled during preparation.

### PREP-07 — Build, tests and limits

Build and test a disposable extraction of the prepared source with suitable
toolchain/database/feature coverage. Record commands, versions, results and
what did not run. Mocked signature/network tests, skipped tests, historical CI,
pre-created database fixtures and parser warnings must be identified as such.
An all-platform run is not an invented universal ASF requirement, but a failed
or untested configuration cannot be reported as passing. This does not permit
the IRA `prepare` engine to execute target code; separate verification remains
in the untrusted-code domain.

### PREP-08 — Combined review and honest handoff

Complete a final review of PREP-01 through PREP-07 on the combined change,
including independent scrutiny of legal/distribution evidence rather than
repeating the build summary. "Independent" does not mean spawning another
Agent or claiming another person's vote. Close or validly dispose of findings
before declaring PR preparation complete. Keep one preparation branch/PR;
newly discovered categories belong in that change, not a second release PR.
Carry explicit limitations and later release gates into the handoff.

## Mandatory detailed audit for PREP gates

AUDIT-01 through AUDIT-07 are required evidence fields within PREP-01 through
PREP-08, not optional follow-up hardening. Complete the corresponding rows in
the readiness record before claiming preparation complete. For each applicable
row inspect actual files, workflows or original records, retain concrete
findings and disposition, and name the limits. A summary such as "RAT green",
"licenses present", "previous release passed" or "the agent recommends +1"
does not fill a row. Missing evidence keeps the affected PREP gate pending.

When resuming an older release record that predates these fields, add the missing
AUDIT rows as pending before advancing readiness. Reuse existing evidence only
where it demonstrably answers the detailed check for the current candidate;
an older PREP pass is not automatic coverage of newly identified omissions.

### AUDIT-01 — Origin and attribution history (PREP-02)

For copied, vendored, generated, donated or otherwise suspect material, record
the origin, exact upstream version/file, applicable license and upstream NOTICE,
and the contribution/grant basis where relevant. Inspect history when headers
or origin statements have changed, especially deletion of "copied from" text.
Do not erase provenance to make a header checker pass. Restore the appropriate
upstream attribution for third-party material; use ASF contribution headers
for work actually contributed to the ASF. Resolve old first-party copyright
lines using the applicable grant and source-header policy, not a blanket rule
that all old notices must either stay or go. Unresolved origin stays pending.
This requires scoped evidence-based investigation, not an impossible claim to
have exhaustively proven the originality of every line of code.

### AUDIT-02 — Nested licenses and notice pointers (PREP-03/04/05)

Inventory bundled material down to nested, shaded, minified or concatenated
components, including documentation assets, generated code and single-header
libraries. A top-level dependency's MIT or Apache label does not establish the
license of everything it embeds. For every bundled component, map its actual
version and paths to the correct license text and required attribution; verify
each LICENSE pointer resolves inside that artifact and names that component's
license, not another dependency with the same license family. Record OR choices
and AND obligations, version-specific license changes and any applicable
relicensing evidence. Keep separately downloaded dependencies distinct.

Review source and binary legal files separately. NOTICE carries required
notifications/attribution, not copied license grant/conditions blocks; required
license texts belong in LICENSE or its correctly referenced files. An SBOM or
package metadata declaration is evidence to verify, not final clearance. Assess
crypto/export applicability when the actual distributed material warrants it;
do not copy another project's license/export finding as a universal verdict.

### AUDIT-03 — Account for RAT coverage (PREP-03)

Reconcile the final archive inventory with scanned, excluded, unrecognized and
binary-classified files. Retain the actual tool/configuration and a disposition
for each excluded or unexamined file or precisely justified group. Inspect text
files classified as binary, rather than treating that classification as review.
If supplemental scans rename files to force text detection, prove byte identity
with the originals and retain the mapping. Broad extension/directory exclusions
such as all SQL, Markdown or C++ files must not hide unreviewed source. Also
inspect unexpected databases, caches and generated binaries in the archive.

Read each supplemental report's actual classification and license result. A
renamed file can still be detected as binary from its content (for example a
shell shebang). A mapping or zero exit code does not prove it was scanned. Count
RAT-approved files and Agent/human-reviewed exceptions separately, retaining
the file hash, full-file review and reason for the latter.

### AUDIT-04 — Artifact and public-display consistency (PREP-05/06)

Compare the actual source packages, JAR/crate/other distributed formats,
manifests/POM descriptions, README, generated release notes and public download
surfaces. Check required incubation text and identity in each applicable place,
including META-INF legal material for JARs; a source DISCLAIMER alone is not
proof that the other surfaces are correct. Resolve conflicting standard/WIP
disclaimers and stale assertions that clearance is in progress. Check whether
pre-donation or other non-ASF releases are clearly distinguished from ASF
releases. Record planned text separately from verified live display; local
preparation does not falsely pass later publication checks. Keep existing
coordinate compatibility decisions and scope-specific dispositions explicit.

### AUDIT-05 — All routes to publication (PREP-06)

Trace branch pushes, tags, manual dispatch, scheduled jobs, reusable workflows,
release events and retries to their actual side effects. Inspect package,
container and GitHub publication paths, including stable version tags and
moving aliases such as latest. Evidence must show how an unapproved branch/RC
cannot become a public final release or retarget a stable alias prematurely.
Check existing public state read-only for the relevant release when applicable;
do not infer safety from the intended final-tag path alone. Repairs to external
published state remain separate from the authorized local source changes.
Never run a real publication as a test. Tie promotion to approval of the exact
immutable source originals, with no-overwrite and safe retry behavior.

### AUDIT-06 — Prior review findings and current policy (PREP-08)

On starting or resuming preparation, check relevant public dev/general vote,
cancellation, result and correction threads for this project and candidate,
including earlier RCs. Search the exact subject across split threads and all
available mailbox folders when using Gmail; record the query, date window,
pagination and coverage limits. No matching mail in one account is not proof
that no issue exists. Use public archives or mark unavailable evidence honestly;
do not require a Gmail account as a universal release prerequisite.

Map each applicable finding to the current file/artifact, fix or documented
disposition and verification. An author's promise to fix is not completion.
Do not check only changes since the last RC: retained and inherited issues
also need disposition. A past successful vote does not clear a present issue.
When an overlooked category appears, update the shared standard/template and
affected release records in the same work, using current official policy as
the basis. Distinguish author opinions, tool findings, confirmed maintainer
facts and formal decisions; an individual's +1 or tolerance is not an exemption.

### AUDIT-07 — Tool and reviewer evidence boundaries (PREP-07/08)

Separate deterministic checks, Agent inferences and named human review. If
using a skill/MCP/checker, record its source/version, actual command/config,
inputs and output, coverage, unavailable optional services and remaining
human-review items. Treat suspicious findings as candidates until verified;
neither a tool's +1 recommendation nor a benchmark score is release approval.
Do not claim tool installation, integration or reproduction from a mailing-list
announcement. Human binding-vote build/test duties remain even if a prior vote
email omitted them. A model evaluation not actually run stays unrun.

These audit fields capture recurring public review failures discussed in
September 2026 (Seata, Cloudberry and Fesod) and the release-checker discussion.
The mandatory evidence fields are IRA workflow rules. Those examples do not
establish blanket license bans or supersede current official policy.

## States are not interchangeable

| Claim | Required evidence |
| --- | --- |
| Technical checks passed | Only the named commands/artifacts/configurations actually verified; state remaining compliance items |
| Preparation complete / ready for preparation PR | All PREP gates pass or have valid applicable dispositions for the exact local source; no unresolved preparation finding |
| Ready to sign/stage an RC | Actual merged candidate/CI and final archive review, identified release manager and applicable signing/staging prerequisites below |
| RC publicly verified | Exact signed staged files downloaded and verified; this is not a passed vote |
| Release approved | Applicable votes and binding roles/results verified for those exact files |
| Released | Approved originals promoted and public distribution verified; report remaining announcement/closeout work separately |

Never answer "all ready" without naming the stage. A successful engine command,
RAT report, archive, CI run, task `done` status or checklist with only technical
rows does not establish the other states. Workbench reports remain evidence
records, not an automated legal verdict; these new Agent requirements do not
claim new server-side or Go-engine enforcement.

When source, version, dependency resolution, packaging, headers, disclaimer or
workflow changes, invalidate affected conclusions and refresh their evidence.
When the same omitted category can affect other active releases, check those
actual candidates too, including already merged ones. A repair in one adapter
or a new shared rule does not establish that another repository contains it.
Record any newly discovered post-merge blocker before continuing RC creation.

At every handoff or scope/PR change, carry each unresolved finding ID forward.
For a pending/blocked finding to pass, cite the specific fix or disposition,
the decision's scope and authority where required, and verification against the
current candidate. A narrower PR, an unchanged manifest, a general merge/review,
an Agent-written compatibility paragraph, or a generic final archive-review
confirmation does not by itself close an independently recorded naming issue.
Preserve a transition record; deleting a finding from the next checklist does
not resolve it. Before signing, reconcile the previous unresolved list with the
current list, including source-affecting distribution decisions.
Unchanged checks may be reused only with an explicit source/input equivalence
link and limits. After merge, rebind to the actual merged commit and new archive
hashes. On discovering an overlooked preparation issue, correct the current
status, index, handoff and PR draft promptly; preserve earlier test evidence
as historical evidence rather than silently deleting it or leaving "ready"
as the current claim.

## Before signing an RC

1. Select one exact upstream commit and retain evidence that its target-project
   CI passed.
2. Build the final source archive from that commit; inspect its top-level layout
   and required files, not merely the working tree.
3. Run Apache RAT on that final source archive. Resolve every finding. An
   exclusion is acceptable only when its file/pattern, origin, applicable
   license, reason, attribution location, reviewer, and review date are
   documented. Do not add broad exclusions merely to produce a clean report.
4. Perform a human review of the archive's `LICENSE`, `NOTICE`, `DISCLAIMER`,
   bundled or copied third-party material, generated files, test fixtures,
   images, archives, and other files that cannot carry normal ASF headers.
5. Do not sign until the archive has zero unexplained RAT findings and no
   unresolved applicable legal/provenance gate. Merely listing follow-up work
   does not clear a gate. Record any valid exception and its actual authority.

## Before a binding release vote

1. Download the signed public RC and verify its checksum, detached signature,
   and public `KEYS` entry.
2. Independently unpack the source archive, build it, and run the appropriate
   project tests. This is a reviewer responsibility; IRA `prepare` deliberately
   does not execute untrusted target-project code.
3. Confirm that the files proposed for voting are the immutable archive,
   checksum, and signature that will be promoted if the vote passes.

If any of those files changes, create a new RC number and repeat the review.

### Concurrent or multi-component votes

At vote preparation, recheck the current Incubation Policy. It permits sequential
or concurrent PPMC/IPMC votes; concurrency does not remove either approval.
For each release item record its exact version/RC/artifacts, each list's timing,
explicit votes and verified voter roles. PPMC endorsement needs at least three
PPMC +1 votes and more PPMC +1 than -1; IPMC approval independently needs at least
three binding IPMC +1 votes and more binding +1 than -1. Use the normal review
period of at least 72 hours for each unless a valid expedited procedure applies.

If proposing multiple independent releases in one email, state the separate
motions, ballot scope, tally and withdrawal/replacement behavior in advance,
and record the project's applicable process. Do not pool votes across components
or lists, infer votes from silence/RM status, or copy votes to a replacement RC.
Clarify ambiguous blanket replies before allocating them to independent motions.
A change affecting shared dependencies or provenance can affect other items
and must be assessed before those continue. Only the unchanged, unaffected
items with their own required approvals can proceed. This is IRA's organization
rule for independent motions, not a claim that ASF requires that email format
or that Casbin has already adopted combined voting.

For podlings, verify the actual project review and IPMC release approval;
PPMC-only votes do not become binding IPMC votes. Signing, tagging, CI and
GitHub organization membership do not replace those votes. Promote the voted
originals only after approval, verify public distribution, and retain the
download/announcement/closeout evidence. Do not require votes before the
preparation PR, or add per-check permission prompts to already authorized work.

## Basis and scope

Detailed audit and vote rules reviewed 2026-09-16 against the
[ASF release policy](https://www.apache.org/legal/release-policy.html),
[source-header policy](https://www.apache.org/legal/src-headers.html) and
[current Incubation Policy](https://incubator.apache.org/policy/incubation.html#releases).
Use these official rules to assess examples; public correspondence supplies
investigation leads and case dispositions, not new blanket policy.

Sources checked 2026-09-15: [ASF release policy](https://www.apache.org/legal/release-policy.html),
[ASF source headers](https://www.apache.org/legal/src-headers.html),
[third-party license policy](https://www.apache.org/legal/resolved.html),
[Incubator release management](https://incubator.apache.org/guides/releasemanagement.html),
[Incubator distribution guidance](https://incubator.apache.org/guides/distribution.html),
and [Infra distribution policy](https://infra.apache.org/release-distribution.html).
Check relevant changes when applying them to a later release. The mandatory
record, conservative completion claims and one-PR sequencing are IRA workflow
requirements; they do not turn every ASF SHOULD into an ASF MUST.

This standard incorporates the 2026-09 JDBC/SQLx preparation lesson: passing
builds, clean RAT, legal-file copying and advisory queries had left generic
headers, missing display disclaimers and an unresolved driver-license role
undetected. These categories are mandatory preparation checks, not optional
hardening to defer until after merge. Individual driver classification,
namespace compatibility and provenance still require case-specific evidence.
