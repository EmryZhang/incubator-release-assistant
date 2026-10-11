# Release progress

> JCasbin replacement preparation resumed (2026-10-11): RC2 was cancelled on general@ on October 10; its historical PPMC result and votes do not approve a replacement. The reviewed upstream remains `6c83cac9a22b930fff94836d87af8c91adfbb8fd`; no replacement RC or final release has been created. Missing Maven review staging, unverified Casbin Nexus profile/permissions and the exact JDK 8 Javadoc-resource disposition remain open. Apply the [Maven staging checklist](release-maven-staging.md) and refreshed readiness record before advancing. [Public cancellation](https://lists.apache.org/thread/4cjsgl0qp14d0sb552xlvd1qnjq7dj47). Older JCasbin carry-over/window claims below are historical. Other paused release preparation remains paused.

> Latest execution checkpoint (2026-10-09): preparation stopped at the user's request. TypeORM 1.10.1, async SQLAlchemy 1.18.0 and node-casbin 5.52.0 remain incomplete local candidates, with JDBC bypassed for this batch. The [paused urgent-release record](../../docs/release-preflight/2026-10-09/urgent/README.md) preserves findings, exact source snapshots, patches and two verified GitHub status replies. No preparation PR, release tag, publication or background continuation was created. Older preparation checkpoints below do not establish readiness for these candidates.

> Latest coordinated record (2026-10-09): the original scoped batch remains JCasbin 1.100.0, SQLx Adapter 1.9.0, and JDBC Adapter 2.14.0. JCasbin/SQLx each passed the PPMC vote and have two explicit IPMC/mentor +1 votes on dev@ eligible for carry-over under the current Cookbook; general@ requests are publicly archived but omit tally links and the IPMC distinction. Separate, unsent supplements are prepared; IPMC approval remains pending and the stated general@ windows end no earlier than October 11 at 10:06:31/10:06:38 Asia/Shanghai. JDBC remains queued behind the formally published JCasbin dependency, plus its own coordinate/audit refresh. TypeORM #81/#88 are one component follow-up; async SQLAlchemy #32 adds another component. See the [five-component status, evidence and next actions](../../docs/release-preflight/2026-10-09/README.md). The original queue below is preserved as historical order; no new fixed publication dates, automatic background work or external actions are authorized by this record.

> RC1 cancellation notices sent (2026-09-24): the release proposer sent separate `[CANCELLED] [VOTE]` replies for JCasbin 1.100.0 RC1 and SQLx Adapter 1.9.0 RC1 to dev@casbin.apache.org at 19:34 Asia/Shanghai. Sent messages and original-thread reply headers were read back; public-list delivery remains independently unconfirmed. The naming concerns require resolution before replacement candidates and fresh votes. RC1 artifacts/tags were preserved. [Cancellation record](../../docs/release-preflight/2026-09-24/vote-cancellation.md). Earlier vote-open checkpoints below are historical.

> Naming root-cause correction (2026-09-21): JCasbin's known GAP-05 was closed without specific disposition evidence; SQLx lacked its own package-identity review. Both RC1s remain blocked. JDBC must review its own Maven groupId as well as the eventual JCasbin dependency coordinates; waiting for dependency publication is not its only remaining gate. [Root cause](../../docs/release-preflight/2026-09-21/ROOT-CAUSE.md) and [per-project application](../../docs/release-preflight/2026-09-21/PROJECT-REVIEW.md). The canonical readiness standard/template now require project-specific evidence and finding-transition reconciliation; no runtime naming enforcement is claimed.

> Current live check (2026-09-21): JCasbin #533 is MERGED at `2d95932d7feba1a5ce15fcadd40f5caece5502d1`; JCasbin 1.100.0 RC1 and SQLx 1.9.0 RC1 are staged and under separate project votes. Both received unresolved `-1 binding` replies from tison on September 20: JCasbin Maven groupId and SQLx crate naming. Neither is approved or released. JDBC still waits for the final JCasbin dependency and has no open PR. Evidence and scope: [September 21 status](../../docs/release-preflight/2026-09-21/README.md). Older checkpoints below are historical.

> Current JCasbin review revision (2026-09-20): [#533](https://github.com/apache/casbin-jcasbin/pull/533) updated to `676aa4b4c836928453a556092db6a63e63d08c08`. The final diff is two files, 11 additions and 1 deletion, retaining Java 8 and the existing plugin setup. The commit exactly matches the locally tested 218-file snapshot. PR title/body updated; [new-head CI](https://github.com/apache/casbin-jcasbin/actions/runs/35455890669) passed; maintainer re-review pending. No merge, tag or publication. Evidence: parent workspace `docs/release-preflight/2026-09-19/jcasbin-review/README.md`. Older checkpoints below are historical.

> Latest JCasbin submission (2026-09-18): [PR #533](https://github.com/apache/casbin-jcasbin/pull/533) is OPEN at `4dcfd1e61296585c96bc9eb148e4e2ea5d841bf2`, matching the locally verified candidate and eight changed files. Hosted build `success`: https://github.com/apache/casbin-jcasbin/actions/runs/35251259513 . JDBC remains local; no merge or release performed.
> Current pre-PR completion (2026-09-18): JCasbin `4dcfd1e61296585c96bc9eb148e4e2ea5d841bf2` and JDBC `783118a077f3fe5cf730b74224844a5387c72046` are prepared for parallel review; no PR or push. SQLx remains at verified upstream `ad4f8f827006ad240207024eb3d6a702c31565ff` and needs no additional preparation patch. All three upstream baselines are unchanged. JDBC only adds the final release-order wording correction; exact archive/RAT/patch verification and same-input reuse of 9+9 database tests are recorded in [final pre-PR handoff](../../docs/release-preflight/2026-09-18/pre-pr/README.md). Public JCasbin dependency verification remains pending before the adapter RC, not before preparing/reviewing its patch. Hosted CI, merge, external-page edits, signing/staging and votes remain later steps. Older statuses below are historical.

> New live status check (2026-09-17): JDBC #97 is now closed without merge; maintainer replacement `0b24efa59abc205110311978e8a7b63ea113d44f` needs a fresh candidate audit. Direct POM/workflow inspection still shows JCasbin 1.99.0 and no proposed Javadoc/release-note disclaimer configuration. The three old PRs are all closed. The local JCasbin display patch does not complete all three projects' final preparation. No new PR authorized or created.

> Latest scoped local fix (2026-09-17): the user requested only the urgent JCasbin release-note/API incubation display changes. A two-file, 13-line local patch on `8d904d9` passed generated RC/final notes, extracted Java 8 package, all 217 substantive Javadoc pages, JAR legal-file checks, RAT and actionlint. No PR/push or public-page change. Full preparation remains incomplete; Maven metadata/coordinates are SHOULD-guidance dispositions and the exact JDK8 resource licensing basis remains unresolved. Evidence: parent workspace `docs/release-preflight/2026-09-17/jcasbin-display/README.md`. Older no-source-change statements below describe the prior investigation.

> JCasbin gap follow-up (2026-09-17): master remains `8d904d9`. Concrete remaining changes are release-note/Javadoc incubation display and POM project metadata; the exact JDK8 documentation-resource licensing basis and Maven-coordinate disposition remain pending, with existing GitHub release-page labeling tracked separately. Refreshed 21 runtime/test dependency advisories (no matches), 115 actual package tool coordinates (known build-only advisories), exact resource provenance and public mailbox queries. Maintainer adoption of the Glob rewrite/source-header treatment is now recorded rather than left as an unadopted proposal. Full updated PREP/AUDIT: parent `docs/release-preflight/2026-09-17/jcasbin-gaps/README.md`. User explicitly said not to submit a PR; this turn changed only local evidence/progress records.

> Latest verified update (2026-09-17 evening): maintainers CLOSED (not merged) JCasbin #532 and SQLx #115 with explicit replacement commits. SQLx `ad4f8f827006ad240207024eb3d6a702c31565ff` passed scoped replacement review: actual versioned archive/crate, local end-to-end release helper tests and exact upstream database CI. JCasbin `8d904d9ad7ca7860ed5f828d6f95673779815d01` passed 338 ordinary + 338 coverage tests, 55,161 Glob comparisons and resolved Maven version checks, but generated release notes and Javadoc lack incubation display; JDK8 documentation resource disposition needs refresh. Do not create an RC from that head. JDBC #97 remains OPEN. Full PREP/AUDIT and evidence: parent workspace `docs/release-preflight/2026-09-17/upstream-review/README.md`. Earlier OPEN-PR and old-candidate claims below are historical. No new PR, tag, external message, signing/staging or publication was performed; SQLx test used only throwaway fixture keys.

> Latest submission update (2026-09-17): the user explicitly authorized one consolidated JCasbin follow-up because #531 is already merged. [PR #532](https://github.com/apache/casbin-jcasbin/pull/532) is now OPEN, non-draft, at `5c9f074794570b01a4ff6d9fbf56ad4b30c4b063`, based on unchanged upstream `3ab35f38b088f32ea3f2285474cc98009945e53d`. This resolves the local workflow decision to open the corrective PR, not the outstanding provenance/copyright/Maven-coordinate decisions, which remain explicitly in its body for pre-merge review. JDBC #97 and SQLx #115 are already OPEN at their verified heads, with all current CI checks successful; do not create duplicates. Subsequent review fixes stay in #532/#97/#115 respectively. Readback and authoritative PREP/AUDIT: parent workspace `docs/release-preflight/2026-09-17/casbin-jcasbin/complete/READINESS.md` and `pr-state.json`. Earlier "not pushed/no second PR" notes below describe superseded checkpoints. No merge, tag, signing, staging, publication or mail send was performed.

> Current consolidated checkpoint (2026-09-17): JDBC #97 and SQLx #115 are OPEN, with all current hosted checks successful (JDBC one build; SQLx Ubuntu/macOS/coverage). Continue any changes in those same PRs before merge. JDBC has a new explicit pre-merge provenance review item: published JCasbin 1.99.0 contains the Glob implementation also observed in the JCasbin baseline, with substantial OpenJDK source matches and differing license headers. It is an external dependency, not bundled; do not infer legal clearance from its POM. If disposition requires a dependency change, complete it and database testing in #97 before merge. JCasbin's complete local corrective proposal is `5c9f074794570b01a4ff6d9fbf56ad4b30c4b063` in `.cache/jcasbin-complete-20260917/checkout` under the parent workspace, with 317 ordinary + 317 coverage tests successful, final 220-file archive/RAT and three JARs checked, and all original copyright sentences retained in the proposed NOTICE. The local full patch is prepared, but not pushed and no second PR was opened. Remaining project dispositions: Glob source/replacement, copyright relocation, retained Maven coordinates, and the consolidated post-merge correction path for #531. Full PREP/AUDIT, replay commands, limitations and next action: parent `docs/release-preflight/2026-09-17/casbin-jcasbin/complete/READINESS.md`. **Do not tag merged `3ab35f3`; historical green results below are superseded for readiness.**

> Latest SQLx update (2026-09-17): [PR #115](https://github.com/apache/casbin-sqlx-adapter/pull/115) is OPEN at `ade4d7da9ab7f3b6ecefc01334473a8530e9e982`; source/crate identity and actual RC/final notes were rechecked before submission. Hosted CI/review remain pending. JDBC #97 is also open. JCasbin #531 is merged but still blocked before RC; the old checker verified legal-file presence/packaging without checking full disclaimer display, and technical success was overstated as overall readiness. Exact evidence and remaining audit gaps are in parent workspace `docs/release-preflight/2026-09-17/casbin-jcasbin/AUDIT-GAP.md`. No second JCasbin PR or direct upstream fix has been made.

> Latest JDBC update (2026-09-17): [preparation PR #97](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/97) is open at `d6c44cdd5d5c6a9088cb47b3ba90e45e7becec2b`. The user explicitly chose review of the complete copyright-relocation and Maven-compatibility proposals in this one PR, without a separate preliminary discussion. These are pending adoption/review, not inferred legal or IPMC approval. Fresh archive/three-JAR/RAT and negative checks passed; hosted CI has started. Continue feedback in #97; no merge/tag/signing/publication. Current PREP/AUDIT: parent workspace `docs/release-preflight/2026-09-17/casbin-jcasbin-jdbc-adapter/READINESS.md`. Older checkpoints below do not block creating an already-open PR.

> Execution expectation recorded 2026-09-16: one release request should be carried through in the same conversation without repeated user reminders. Agent-owned license research and remaining audits are still actionable work, not automatically external blockers. Finish them before consolidating the minimum external decisions. See [execution contract](release-preparation.md#complete-authorized-work-in-one-conversation) and parent workspace `docs/release-preflight/2026-09-16/execution-expectation.md` for the current checkpoint. Recording this checkpoint is not release completion.

> Latest audit (2026-09-16): JDBC is at `931e8c9acf634ac786ae9d8e4f80b3fbf37fb93f`, SQLx at `ade4d7da9ab7f3b6ecefc01334473a8530e9e982`; both are local, unpushed preparation. Publication links and SQLx CI were repaired. JDBC Javadoc now uses JDK 25 with complete UPL/MIT texts and actual asset checks; 25-file RAT, three JARs, six negative cases, 12 mocked verifier tests and workflows passed. Its remaining first-PR decisions are six copyright-line relocations and Maven compatibility coordinates; concrete unsent wording and an unapplied patch are in `casbin-jcasbin-jdbc-adapter/javadoc-followup/DECISIONS.md` under the evidence directory below. No further independent JDBC preparation check is being relabeled as an external blocker. **JCasbin merged candidate `3ab35f3` is blocked before RC:** README/POM/generated notes lack the full incubation disclaimer. A minimal three-file proposal is prepared but not adopted; do not silently open a second preparation PR. Current per-project PREP/AUDIT records, source/copyright and distribution findings, proposed patch and mentor handoff are in parent workspace `docs/release-preflight/2026-09-16/`. Historical evidence below does not override those findings. SQLx supplemental RAT actually approved 5 Rust files; 2 shell files remained BINARY and were separately Agent-reviewed.

This table is the working order for the next Apache Casbin Incubator releases.
It records two separate tracks for every project:

- **Upstream release readiness**: repository version, selected commit, CI, legal
  files, and the project-specific tag/package-publication workflow.
- **IRA adapter support**: the reviewed adapter, schema/template, Skill mirror,
  and regression tests needed for IRA to prepare the ASF source RC safely.

IRA only prepares, signs, stages, and verifies the ASF source RC. Votes, final
tags, GitHub releases, and registry publication remain explicit human steps.
The linked issue or pull request is release context, not proof that a project is
ready to release.

Historical queue review: 2026-08-26. For the 2026-09-10 checks of eight projects,
four prepared source patches, and independent replay instructions, use the
[published release checklists](release-checklists/2026-09-10/README.md).
The snapshot distinguishes local patch verification from upstream merge, final
candidate selection, vote and publication. Entries below retain their original
tracker context unless explicitly refreshed.

Original queue review: 2026-08-26. Latest partial review: 2026-09-15 (eight queued repositories refreshed; SQLx/JDBC local preparation advanced).

JCasbin preparation [PR #531](https://github.com/apache/casbin-jcasbin/pull/531)
merged at `3ab35f38b088f32ea3f2285474cc98009945e53d`. Both the PR build and
the exact merged commit [build](https://github.com/apache/casbin-jcasbin/actions/runs/34799155928)
passed. Fresh tar.gz/zip archives match all 217 Git files and pass RAT with
zero unapproved findings and no exclusions. The 2026-09-14 independent extraction
passed all 266 tests and all three JAR legal-file checks; source archive
digests remained unchanged after the build. The merged tree equals the
previously verified `da3b9ba`, preserving that historical dependency review and
11 passing release-script tests. This September 14 checkpoint was incomplete:
later full display, generated-resource and source-provenance review found
blockers. Its old "no additional preparation PR" and immediate RC handoff
conclusions are withdrawn. Follow the current consolidated checkpoint above;
do not tag `3ab35f3` or infer current permissions from this historical entry.
No RC tag, signature, ASF upload or vote mail has been created. Detailed local
evidence: parent workspace `docs/release-preflight/2026-09-14/casbin-jcasbin.md`.

## Current preparation — 2026-09-15

The user chose to continue other projects and collect mature candidates for
their mentor to create RC tags together. JCasbin remains the only row with
an exact merged candidate and completed local archive verification. Apache
organization membership is active, but the current account still lacks
Casbin/JCasbin repository write permission. Permission troubleshooting is
deferred while release preparation continues.

Eight repositories retain their previously inspected HEADs/latest observed
releases, with no open PRs and successful project checks on those exact HEADs.
These are historical runs rechecked today, not new CI runs of local patches.
TypeORM Dependabot failures remain separate from project test results.

| Project | New local preparation | Verification and remaining work |
| --- | --- | --- |
| SQLx | 1.9.0; local `22eae2db03c94d1324262ab94414bc472977f833`; ASF headers (including shell scripts), display/metadata and extracted-source package exclusions corrected | 36 test executions, fmt/clippy, offline builds and final verified 20-file crate pass; RAT 27; supplementary RAT approved 5 Rust files, with 2 shell files separately Agent-reviewed (see 2026-09-16 correction). 255 dependency license/advisory records, two unmaintained notices. Provenance/distribution records and upstream PR/CI/merge remain pending |
| JDBC | 2.14.0; local `44410fc332e89cceeb1da348db199bf4d6375914`; ASF headers/display/metadata corrected, Oracle default dependency removed, JCasbin upgraded to published 1.99.0 replacing LGPL Aviator | Java 8 full build: 9 tests twice, three JAR contents/legal checks and 23-file RAT pass. 20 resolved dependencies with no OSV matches; 29 dependency/plugin license records. Copyright/provenance/distribution records and upstream PR/CI/merge remain pending |

The source-side remediation is locally committed on the existing preparation branches;
no PRs were opened or pushed. Both have 12 passing release-script tests plus
actionlint and local RC shell checks. External signing/publication was not run. Current local evidence and the mentor tag handoff:
parent workspace `docs/release-preflight/2026-09-15/README.md`. RC tag batching
does not combine project votes or authorize final release tags before promotion.

## Current preparation — 2026-09-10

Eight queued repositories were checked against live GitHub state. Four have
local source-readiness patches, source-archive RAT evidence and successful
packaging-step checks. No new release or RC was published.

| Project | Reviewed upstream commit | Concrete preparation | Remaining next step |
| --- | --- | --- | --- |
| SQLx | `6dbb79b4904fe4b72594466fc0dacece8db56615` | License headers and exact fixture exceptions; supplemental Rust text scan for RAT 0.18 MIME misclassification; RC/final archive parity verified | Select a new version after `1.8.0`, review compatibility, merge changes and verify final commit/package |
| JDBC | `989a5933e38dc9c28d58f6dfb5fe32ab37e62147` | License preparation; reject tag/POM mismatch instead of rewriting the POM; archive the commit directly; parity verified | Select a new version after `2.13.0`, replace source POM `2.6.0`, merge and verify |
| TypeORM | `065d76cd2d408d9c21b5984d09fc3b4ac4429592` | License preparation; reject package-version mismatch and existing Release asset replacement; parity verified | Select a new version after `1.10.0`, replace source version `0.0.0`, merge and verify |
| MongoDB | `67c101979371cff80af2ce7f3094a6c5b0f2dc29` | License preparation; consistent Apache source basename for RC and final; parity verified | Select version after `4.3.0` and review Apache module-path/Casbin v3 compatibility; merge and verify |

Django ORM, Ent, Redis watcher and Rust Diesel also had passing build/test checks
on their inspected HEADs, but did not receive this round's source-package preflight.
Local patches are staged on isolated `chore/release-source-readiness` branches;
they are not upstream commits. Per-project evidence is retained in the parent
workspace at `docs/release-preflight/2026-09-10/`.

All four patched source trees have zero RAT unapproved findings with explicit,
individually documented exceptions. This is preparatory evidence: versions are
not selected, exceptions still need release-manager review, and new candidate
commits/final archives require fresh checks. IRA adapter support is unchanged.

The current owner-decision questions and the copy-ready one-round message are
maintained in [release coordination checklist](release-coordination.md).

## Completed

| Project | Upstream release readiness | IRA adapter support | Release status |
| --- | --- | --- | --- |
| [casbin](https://github.com/apache/casbin) (Go) | Completed | Implemented | Released |

## Release queue

The following operational fields were transcribed from the Casbin recent-repository
tracker supplied on 2026-08-26. `Commits submitted` and `Manual release changed`
are historical reported states, not proof that the changes have merged or that a project is
ready to release. Blank source fields are recorded as **Not provided**.

| # | Project | Date | Current version | Current phase | Local path | Repository update reason | Manual release? | IRA adapter support |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [casbin](https://github.com/apache/casbin) | 2026-08-05 | `3.11.0-rc2` | Vote initiated (Yanrui); subsequently released | `D:\github_repos\casbin` | Not provided | Changed | Implemented |
| 2 | [casbin-sqlx-adapter](https://github.com/apache/casbin-sqlx-adapter) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-sqlx-adapter` | [PR #113](https://github.com/apache/casbin-sqlx-adapter/pull/113) | PR #113 confirmed merged on 2026-09-10; current source still requires a new release version | Historical validation exists, not in this checkout |
| 3 | [casbin-jcasbin-jdbc-adapter](https://github.com/apache/casbin-jcasbin-jdbc-adapter) | Not provided | `pom.xml` `2.6.0`; latest tag `v2.13.0` | [PR #95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) merged; [master 989a593](https://github.com/apache/casbin-jcasbin-jdbc-adapter/commit/989a5933e38dc9c28d58f6dfb5fe32ab37e62147) build passed | `D:\github_repos\casbin-jcasbin-jdbc-adapter` | [PR #95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) | Yes: manual `vX.Y.Z-rcN` tag creates a GitHub pre-release; final tag publishes GitHub/Maven Central | Historical validation exists, not in this checkout; first commit the selected release version because the workflow currently rewrites `pom.xml` before packaging |
| 4 | [casbin-jcasbin](https://github.com/apache/casbin-jcasbin) | 2026-09-14 | Preparing `1.100.0` RC | [#531](https://github.com/apache/casbin-jcasbin/pull/531) merged at `3ab35f3`; exact merged build passed; fresh 217-file archives match Git and pass RAT; source tree matches previously verified PR | `D:\Study\Codes\isa\.cache\jcasbin-preflight-20260914` | Dependencies and final-publication corrections merged in #531; #525 excluded | Maintainer to create `v1.100.0-rc1` at exact verified SHA after prerequisite checks; verify RC, sign/stage/vote/publish | Not implemented in this checkout |
| 5 | [casbin-pycasbin](https://github.com/apache/casbin-pycasbin) | Not provided | Not provided | Commits submitted | `D:\github_repos\pycasbin` | [Issue #424](https://github.com/apache/casbin-pycasbin/issues/424) | Changed | Not implemented in this checkout |
| 6 | [casbin-typeorm-adapter](https://github.com/apache/casbin-typeorm-adapter) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-typeorm-adapter` | [Issue #81](https://github.com/apache/casbin-typeorm-adapter/issues/81) | Changed | Not implemented |
| 7 | [casbin-mongodb-adapter](https://github.com/apache/casbin-mongodb-adapter) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-mongodb-adapter` | [PR #76](https://github.com/apache/casbin-mongodb-adapter/pull/76) | Changed | Not implemented |
| 8 | [casbin-python-django-orm-adapter](https://github.com/apache/casbin-python-django-orm-adapter) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-python-django-orm-adapter` | Repository | Changed | Not implemented |
| 9 | [casbin-ent-adapter](https://github.com/apache/casbin-ent-adapter) | Not provided | Not provided | Not provided | `D:\github_repos\ent-adapter` | [PR #35](https://github.com/apache/casbin-ent-adapter/pull/35) | Not provided | Not implemented |
| 10 | [casbin-redis-watcher](https://github.com/apache/casbin-redis-watcher) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-redis-watcher` | Repository | Not provided | Not implemented |
| 11 | [casbin-lua-casbin](https://github.com/apache/casbin-lua-casbin) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-lua-casbin` | [Issue #164](https://github.com/apache/casbin-lua-casbin/issues/164) | Changed | Not implemented |
| 12 | [casbin-core](https://github.com/apache/casbin-core) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-core` | Repository | Not provided | Not implemented |
| 13 | [casbin-casbin.js](https://github.com/apache/casbin-casbin.js) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-casbin.js` | Repository | Changed | Not implemented |
| 14 | [casbin-python-async-sqlalchemy-adapter](https://github.com/apache/casbin-python-async-sqlalchemy-adapter) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-python-async-sqlalchemy-adapter` | [Issue #27](https://github.com/apache/casbin-python-async-sqlalchemy-adapter/issues/27) | Changed | Not implemented |
| 15 | [casbin-SwiftCasbin](https://github.com/apache/casbin-SwiftCasbin) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-SwiftCasbin` | Repository | Not provided | Not implemented |
| 16 | [casbin-rs](https://github.com/apache/casbin-rs) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-rs` | Repository | Not provided | Not implemented |
| 17 | [casbin-node-casbin](https://github.com/apache/casbin-node-casbin) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-node-casbin` | Repository | Not provided | Not implemented |
| 18 | [casbin-rust-diesel-adapter](https://github.com/apache/casbin-rust-diesel-adapter) | Not provided | Not provided | Not provided | `D:\github_repos\casbin-rust-diesel-adapter` | Repository | Not provided | Not implemented |
| 19 | [casbin-ex](https://github.com/apache/casbin-ex) | Not provided | Not provided | Not provided | Not provided | [Issue #31](https://github.com/apache/casbin-ex/issues/31) | Not provided | Not implemented |

## Update rules

1. Update the two status columns independently after each concrete check or
   implementation step; include the selected version, commit, RC number, and
   evidence link once available.
2. Do not mark **upstream release readiness** complete until the project has a
   reviewed candidate commit, passing target CI, and a confirmed human release
   plan. Do not mark **Released** until the applicable vote and publication
   steps have completed.
3. Promote a change from this repository to `casdoor/incubator-release-assistant`
   only after it is self-contained, tested, and suitable for a Conventional
   Commit PR.
