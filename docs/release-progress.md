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

Last reviewed: 2026-08-26.

## Completed

| Project | Upstream release readiness | IRA adapter support | Release status |
| --- | --- | --- | --- |
| [casbin](https://github.com/apache/casbin) (Go) | Completed | Implemented | Released |

## Release queue

| # | Project | Ecosystem | Upstream tracking context | Upstream release readiness | IRA adapter support | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [casbin-sqlx-adapter](https://github.com/apache/casbin-sqlx-adapter) | Rust | [PR #113](https://github.com/apache/casbin-sqlx-adapter/pull/113) | Pending review | Not implemented in this checkout | Research release workflow and implement the Rust adapter. |
| 2 | [casbin-jcasbin-jdbc-adapter](https://github.com/apache/casbin-jcasbin-jdbc-adapter) | Java / Maven | [PR #95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) | Pending review | Not implemented in this checkout | Research Maven and ASF RC requirements. |
| 3 | [casbin-jcasbin](https://github.com/apache/casbin-jcasbin) | Java / Maven | [PR #525](https://github.com/apache/casbin-jcasbin/pull/525) | Pending review | Not implemented in this checkout | Research version, CI, tag, and Maven publication workflow. |
| 4 | [casbin-pycasbin](https://github.com/apache/casbin-pycasbin) | Python / PyPI | [Issue #424](https://github.com/apache/casbin-pycasbin/issues/424) | Pending review | Not implemented in this checkout | Research PyPI/tag workflow and release policy. |
| 5 | [casbin-typeorm-adapter](https://github.com/apache/casbin-typeorm-adapter) | TypeScript / npm | [Issue #81](https://github.com/apache/casbin-typeorm-adapter/issues/81) | Pending review | Not implemented | Research package, CI, and release workflow. |
| 6 | [casbin-mongodb-adapter](https://github.com/apache/casbin-mongodb-adapter) | TypeScript / npm | [PR #76](https://github.com/apache/casbin-mongodb-adapter/pull/76) | Pending review | Not implemented | Research package, CI, and release workflow. |
| 7 | [casbin-python-django-orm-adapter](https://github.com/apache/casbin-python-django-orm-adapter) | Python / PyPI | Repository | Pending review | Not implemented | Research package metadata and publication workflow. |
| 8 | [casbin-ent-adapter](https://github.com/apache/casbin-ent-adapter) | Go | [PR #35](https://github.com/apache/casbin-ent-adapter/pull/35) | Pending review | Not implemented | Research module, CI, and tag workflow. |
| 9 | [casbin-redis-watcher](https://github.com/apache/casbin-redis-watcher) | Go | Repository | Pending review | Not implemented | Research module, CI, and tag workflow. |
| 10 | [casbin-lua-casbin](https://github.com/apache/casbin-lua-casbin) | Lua | [Issue #164](https://github.com/apache/casbin-lua-casbin/issues/164) | Pending review | Not implemented | Research source package and publication workflow. |
| 11 | [casbin-core](https://github.com/apache/casbin-core) | TypeScript / npm | Repository | Pending review | Not implemented | Research package, CI, and release workflow. |
| 12 | [casbin-casbin.js](https://github.com/apache/casbin-casbin.js) | TypeScript / npm | Repository | Pending review | Not implemented | Research package, CI, and release workflow. |
| 13 | [casbin-python-async-sqlalchemy-adapter](https://github.com/apache/casbin-python-async-sqlalchemy-adapter) | Python / PyPI | [Issue #27](https://github.com/apache/casbin-python-async-sqlalchemy-adapter/issues/27) | Pending review | Not implemented | Research package metadata and publication workflow. |
| 14 | [casbin-SwiftCasbin](https://github.com/apache/casbin-SwiftCasbin) | Swift | Repository | Pending review | Not implemented | Research package and release workflow. |
| 15 | [casbin-rs](https://github.com/apache/casbin-rs) | Rust | Repository | Pending review | Not implemented | Research crate, CI, and tag workflow. |
| 16 | [casbin-node-casbin](https://github.com/apache/casbin-node-casbin) | Node.js / TypeScript | Repository | Pending review | Not implemented | Research package, CI, and release workflow. |
| 17 | [casbin-rust-diesel-adapter](https://github.com/apache/casbin-rust-diesel-adapter) | Rust | Repository | Pending review | Not implemented | Research crate, CI, and tag workflow. |
| 18 | [casbin-ex](https://github.com/apache/casbin-ex) | To be determined | [Issue #31](https://github.com/apache/casbin-ex/issues/31) | Pending review | Not implemented | Identify the releasable package and its workflow. |

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
