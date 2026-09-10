# Release progress

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

The current owner-decision questions and the copy-ready one-round message are
maintained in [release coordination checklist](release-coordination.md).

## Completed

| Project | Upstream release readiness | IRA adapter support | Release status |
| --- | --- | --- | --- |
| [casbin](https://github.com/apache/casbin) (Go) | Completed | Implemented | Released |

## Release queue

The following operational fields were transcribed from the Casbin recent-repository
tracker supplied on 2026-08-26. `Commits submitted` and `Manual release changed`
are reported states, not proof that the changes have merged or that a project is
ready to release. Blank source fields are recorded as **Not provided**.

| # | Project | Date | Current version | Current phase | Local path | Repository update reason | Manual release? | IRA adapter support |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [casbin](https://github.com/apache/casbin) | 2026-08-05 | `3.11.0-rc2` | Vote initiated (Yanrui); subsequently released | `D:\github_repos\casbin` | Not provided | Changed | Implemented |
| 2 | [casbin-sqlx-adapter](https://github.com/apache/casbin-sqlx-adapter) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-sqlx-adapter` | [PR #113](https://github.com/apache/casbin-sqlx-adapter/pull/113) | Reported changed; PR is closed, so merge status must be rechecked | Historical validation exists, not in this checkout |
| 3 | [casbin-jcasbin-jdbc-adapter](https://github.com/apache/casbin-jcasbin-jdbc-adapter) | Not provided | `pom.xml` `2.6.0`; latest tag `v2.13.0` | [PR #95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) merged; [master 989a593](https://github.com/apache/casbin-jcasbin-jdbc-adapter/commit/989a5933e38dc9c28d58f6dfb5fe32ab37e62147) build passed | `D:\github_repos\casbin-jcasbin-jdbc-adapter` | [PR #95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) | Yes: manual `vX.Y.Z-rcN` tag creates a GitHub pre-release; final tag publishes GitHub/Maven Central | Historical validation exists, not in this checkout; first commit the selected release version because the workflow currently rewrites `pom.xml` before packaging |
| 4 | [casbin-jcasbin](https://github.com/apache/casbin-jcasbin) | Not provided | Not provided | Commits submitted | `D:\github_repos\casbin-jcasbin` | [PR #525](https://github.com/apache/casbin-jcasbin/pull/525) | Changed | Not implemented in this checkout |
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
