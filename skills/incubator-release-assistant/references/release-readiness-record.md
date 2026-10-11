# Required release-readiness record

Copy this template to local release evidence outside public product source.
Follow [the readiness standard](release-readiness.md). Fill every gate before
declaring preparation complete or submitting the combined preparation PR.
Keep evidence links sanitized; never include credentials or private mail.

## Identity and current claim

- Repository / selected version:
- Upstream baseline / preparation branch and PR (if any):
- Reviewed commit or tree / archive path and hash:
- Included scope / explicit exclusions:
- Review date / reviewer identity and role (Agent, automated, or named human):
- Policy sources checked and date:
- Metadata checker (if used): revision/hash, explicit expected identities, per-file report hashes and coverage limits; findings reconciled separately:
- Non-Docker test alternatives checked, disposable service isolation/cleanup, actual matrix and remaining unverified checks:
- Current stage claim: **preparation incomplete**
- Remaining findings / next action:
- First-PR boundary: all known source-affecting decisions/changes and newly added audits resolved, with evidence:
- Later-stage prerequisites still pending (distinct from source changes):

## Official-rule applicability and evidence

Use the [common rule map](release-readiness.md#official-authority-and-common-rule-map)
as the source index. Record each applicable rule and every known review finding;
do not treat a checker's absence of findings as a policy result. Preserve the
official wording/strength separately from IRA's decision to keep a gate open.

| Rule ID / official URL and section / checked date | Basis kind and wording (policy, SHOULD guidance, case decision, IRA rule) | Project/component/channel and applicability | Exact file/artifact/hash and observed result | State / finding ID / verified disposition or next owner/action |
| --- | --- | --- | --- | --- |
| Not yet assessed | | | | pending |

When reusing or superseding a record, reconcile each earlier finding ID. State
what new evidence justifies closure; an omitted row, unchanged legacy code,
general permission to proceed or successful unrelated check is not closure.

## Preparation gates — initially pending, never inferred from tool success

For each row provide evidence location, observed result, source/artifact binding,
reviewer/date and limits. Valid states: `pending`, `pass`, `blocked`,
`not-applicable`. A non-applicable entry needs its concrete scope/policy basis;
an exception needs its authority, decision, scope and durable evidence.
Missing/unknown/unresolved evidence cannot pass. Do not delete required rows.

| Gate | State | Required evidence and disposition |
| --- | --- | --- |
| PREP-01 | pending | Version, release/tag observations, exact source and scope |
| PREP-02 | pending | ASF header classification, old copyright/NOTICE treatment, applicable grants/provenance; distinguish third-party files |
| PREP-03 | pending | Exact package LICENSE/NOTICE/DISCLAIMER review, RAT coverage/blind spots, individually justified exclusions |
| PREP-04 | pending | BOTH dependency advisories and license dispositions; actual/default/optional/test/transitive/bundled roles |
| PREP-05 | pending | Every distribution format, actual bundled/generated content, legal-file placement, version/source match and metadata |
| PREP-06 | pending | RC/final and retry paths, immutable voted originals, user-visible incubation display, official links, separate permissions/credentials |
| PREP-07 | pending | Extracted-source commands/toolchains/platforms/databases/features/results; skipped/mocked/failed coverage and limits |
| PREP-08 | pending | Combined review, findings closed or validly disposed, one-PR handoff, remaining stages |

## Findings, exceptions and change invalidation

### Project-specific review matrix

Complete one set per project/component and applicable ecosystem/channel using
actual candidate files. Reuse shared evidence only with an explicit applicability
and input-equivalence reason. A Maven rule being inapplicable does not waive
package identity review in another ecosystem. Mark uninvestigated facts pending.

| Project / component / ecosystem or channel | Actual identity and evidence (manifest, built metadata, display, consumer import) | Applicable official guidance / project decision and date | Difference, migration/control implications | Gate / state / finding ID / next action |
| --- | --- | --- | --- | --- |
| Not yet inspected | | | | PREP-05/06; pending |

| Project-specific area | Actual candidate requirement / evidence | Shared evidence reused and why applicable | Gate / state / next action |
| --- | --- | --- | --- |
| Build, toolchain, databases and feature combinations | | | PREP-07; pending |
| Bundled/generated material and provenance | | | PREP-02/03/04/05; pending |
| Publication routes and registry administration | | | PREP-06; pending |
| Previous project/component review findings | | | PREP-08 / AUDIT-06; pending |

For naming, distinguish default policy compliance, a proposed compatibility
rationale, and an evidenced disposition by the responsible authority. Record
registry-name availability separately from control. Source-only scope does not
exclude metadata decisions that would alter the source candidate.

### Required detailed audit evidence

Fill all AUDIT rows as well as the PREP gates. Cite actual evidence and its
commit/artifact binding, reviewer/date, observed result, limits and disposition.
Every applicable unresolved row keeps its parent PREP gate pending/blocked.
Do not delete a row or substitute a general "all checks passed" statement.

| Audit | State | Required evidence and disposition |
| --- | --- | --- |
| AUDIT-01 | pending | Origin/version/upstream file and NOTICE; grant basis where applicable; history of changed copyright or copied-from statements |
| AUDIT-02 | pending | Nested/shaded/minified/doc components; actual version-to-license/attribution map; every bundled license pointer resolves to the correct text; OR/AND and scope-specific obligations |
| AUDIT-03 | pending | Final file inventory reconciled with RAT scanned/excluded/unrecognized/binary classes; all blind spots and exclusions reviewed; supplemental byte mappings |
| AUDIT-04 | pending | Source/binary/metadata/public-display comparison; standard/WIP consistency, JAR legal contents, historical non-ASF markings; live versus planned evidence |
| AUDIT-05 | pending | Trigger-to-publication side effects including branches, schedules, manual/reusable/retry paths and latest aliases; relevant public-state observation; immutable promotion |
| AUDIT-06 | pending | Public prior/current RC review threads, queries/time/coverage; each applicable finding mapped to verified current disposition, not a promise |
| AUDIT-07 | pending | Actual checker/tool version, commands/inputs/outputs and unavailable coverage; deterministic/Agent/human distinctions; actual build/test and outstanding reviewer duties |

For Maven, record separate results for groupId/artifactId, description's full
incubation disclaimer, Apache project developer entry, ALv2 license and SCM.
Identify whether each result comes from the source, flattened/published POM or
embedded metadata. Mark generated-artifact results stale when the input changes;
an old build is not verification of a newly edited POM.

For a public checker/skill run, attach the upstream revision, input stage and
archive hashes, exact commands, raw report/exit status, regression result and
any local compatibility change. Record raw finding -> verified disposition ->
affected PREP gate, distinguishing missing later-stage sidecars from source
defects. Explicitly list coverage gaps (including package identity, build/RAT
and registry control) and their separate evidence. For a historical replay,
disclose prior knowledge and distinguish script hits, Agent additions and
reviewer-originated findings; never label a non-blind run as a blind evaluation.

Public review finding trace (use an evidenced not-applicable reason if none):

| Original public message / date / candidate | Finding and evidence type | Current affected files/artifacts | Verified fix or disposition / evidence | State / owner / next action |
| --- | --- | --- | --- | --- |
| Not yet searched | | | | pending |

### Dispositions and invalidation

Carry unresolved findings across replacement commits, PR scope reductions and
handoffs. Reconcile this table before signing; no unexplained disappearance or
pending-to-pass transition is allowed. A merge or generic human archive review
is not specific disposition evidence for an already identified naming issue.

| Finding ID / prior record and state | Current state / candidate | New fix or disposition evidence / decision scope and authority | Verification / owner / next action |
| --- | --- | --- | --- |
| Not yet reconciled | pending | | |

| Finding ID / affected source or artifact | Observed defect or missing evidence / basis | Blocking stage | Responsible role / next action | Closure evidence / state | Independent work that can continue |
| --- | --- | --- | --- | --- | --- |
| Populate each actual finding; do not invent blockers | | | | | |

For post-merge source blockers, link the unapplied correction, validation and
agreed process exception. A proposed patch is not an adopted fix. Track actual
supplemental RAT classifications separately from manual exception reviews.

| Finding | Requirement/guidance and source | Affected files/artifacts | Disposition, authority if needed, and evidence | Owner / next action |
| --- | --- | --- | --- | --- |
| Not yet reviewed | | | Unresolved | |

- Changes since the previous review:
- Affected evidence invalidated/refreshed:
- Unchanged evidence reused, exact input equivalence and limits:
- Corrections to earlier readiness claims/index/PR draft, if any:

## Later release gates — separate from local preparation

| Gate | State | Exact evidence / owner / next action |
| --- | --- | --- |
| Actual merged commit, its CI and final source archive | pending | |
| Human final archive legal/provenance review and valid dispositions | pending | |
| Release manager, signing fingerprint/KEYS and distinct channel permissions | pending | |
| Actual RC tag, immutable archive/checksum/signature and staging | pending | |
| Public RC download, signature/hash and independent extracted build/test | pending | |
| Applicable project/IPMC votes, binding roles and results | pending | |
| Approved originals promoted and public distribution verified | pending | |
| Download pages, announcement and closeout | pending | |

### Maven review repository, when applicable

| Evidence | State | Exact candidate binding, result, owner and limits |
| --- | --- | --- |
| Staging/promotion route and source-affecting POM/workflow decisions | pending | |
| Actual profile/groupId mapping and deployment permission, distinct from Central | pending | |
| Main/sources/Javadoc JAR and flattened POM inventory, GAV and legal/resource review | pending | |
| Named human review of these binaries, distinct from source review | pending | |
| Signed closed repository ID/state/URL; fresh public downloads and manifest comparison | pending | |
| Dev ballot/result links, replacement findings and fresh vote records | pending | |
| Post-approval promotion of reviewed Maven originals; no duplicate rebuild/publication | pending | |

Mark rows not-applicable with evidence for projects without this channel. Route
and known source-affecting decisions are preparation work; upload, signing,
close, URLs and votes are later evidence. Login, another visible profile or
anonymous 401 does not establish this project's deployment permission. See
the [Maven staging checklist](release-maven-staging.md) for sources and the case.

Later gates may legitimately remain pending when preparing a PR. They must
remain visible; never convert them to passed because preparation, tagging or
the RC command finished. For a non-podling, document why the IPMC-specific part
does not apply without skipping the project's own release approval.

## Handoff

### Vote evidence when entering the voting stage

Remain pending during local preparation. Complete one row per independent
release item and voting body; record the adopted ballot scope and any combined
email arrangement. Do not sum PPMC and IPMC votes or different components.

| Component / version / RC / immutable artifact hashes | Body / list | Start / earliest normal close | Explicit voter / role / vote / original message | Tally / result evidence | State |
| --- | --- | --- | --- | --- | --- |
| Not staged | Project/PPMC | | | | pending |
| Not staged | IPMC if applicable | | | | pending |

- Sequential/concurrent arrangement and current policy basis:
- For combined mail: independent motions, withdrawal/replacement rules and project process:
- Ambiguous votes awaiting clarification; corrections, cancellation or replacement RC:

### Handoff summary

- What actually passed:
- What remains incomplete or limited:
- Precise stage reached (avoid unqualified "all ready"):
- Evidence suitable for reuse and evidence that must be recreated after merge:
- Next authorized action, responsible role and any real external blocker:
- Agent-owned checks/research/fixes still pending (do not relabel as external):
- Why no further independent authorized action can be completed now, if stopping:
- Consolidated minimum external action and exact continuation after it arrives:

This record is mandatory for the Agent workflow. It is not a new legal approval,
permission prompt or assertion of automatic backend enforcement.
