# Release coordination checklist

This is the one-round confirmation sheet for the Casbin release queue. It is
deliberately a decision record, not an authorization to tag or publish.

Last public repository review: 2026-08-26.

## What needs one owner decision

For each repository, confirm all four items in one reply:

1. whether it is in this release wave;
2. the target version `V`;
3. the exact candidate commit, including whether the listed PR must merge (or
   which closed issue/merged change is intended); and
4. whether the current manual-tag workflow is the approved path for the final
   package publication.

For any selected repository, the version-change PR must merge before its
candidate commit is selected. A green CI run and a closed issue are evidence,
not a release decision. The RC is always a separately signed, RAT-checked
source archive reviewed and voted on before the final `vV` tag/publish step.

## Observed facts and questions

The first two repositories were assessed earlier and are included below so the
release owner can close the whole wave in one response.

| Repository | Public baseline observed | Release-context item | Current publication mechanism | Decision needed from release owner |
| --- | --- | --- | --- | --- |
| casbin-sqlx-adapter | latest tag `v1.8.0`; Cargo version `1.8.0` | PR [#113](https://github.com/apache/casbin-sqlx-adapter/pull/113) is closed and unmerged | Manual `vX.Y.Z-rcN` / `vX.Y.Z` tags; final publishes to crates.io | Include or defer? If included, choose `V` and the candidate commit; do not treat #113 as merged. |
| casbin-jcasbin-jdbc-adapter | latest tag `v2.13.0`; root `pom.xml` says `2.6.0` | PR [#95](https://github.com/apache/casbin-jcasbin-jdbc-adapter/pull/95) merged | Manual RC/final tags; final publishes to Maven Central | Confirm `V` (for example, the proposed patch line must be new), and approve a version-preparation PR before selecting the RC commit. |
| casbin-jcasbin | latest release `v1.99.0`; working POM is `0.0.0-SNAPSHOT`; snapshot tags exist for `v1.100.0` | PR [#525](https://github.com/apache/casbin-jcasbin/pull/525) is open | Manual RC/final tags; final publishes to Maven Central | Is #525 part of this release? Confirm `V`, source-version preparation, and candidate commit. |
| casbin-pycasbin | latest release `v2.8.0`; `pyproject.toml` says `2.6.1` | Issue [#424](https://github.com/apache/casbin-pycasbin/issues/424) is closed | Manual RC/final tags; final publishes to PyPI | Confirm the intended fix/commit and `V`; reconcile the package-file/tag version discrepancy in the version PR. |
| casbin-typeorm-adapter | latest release `v1.10.0`; `package.json` says `0.0.0` | Issue [#81](https://github.com/apache/casbin-typeorm-adapter/issues/81) is closed | Manual RC/final tags; final publishes to npm | Confirm the intended fix/commit and `V`; include package-version preparation. |
| casbin-mongodb-adapter | latest release `v4.3.0` | PR [#76](https://github.com/apache/casbin-mongodb-adapter/pull/76) merged | Manual RC/final tags; final Go module becomes available through the proxy | Confirm whether the Casbin v3 upgrade is this wave's basis, its compatibility/version bump, and candidate commit. |
| casbin-python-django-orm-adapter | latest release and `pyproject.toml` both `v1.7.0` | No release-context PR supplied | Manual RC/final tags; final publishes to PyPI | Confirm whether there is a post-`v1.7.0` change to release; if yes, give `V` and candidate commit. |
| casbin-ent-adapter | latest release `v1.4.0` | PR [#35](https://github.com/apache/casbin-ent-adapter/pull/35) is closed without merge | Manual RC/final tags; final package publication is workflow-controlled | Confirm the replacement change/commit (if any), `V`, and inclusion. |
| casbin-redis-watcher | latest release `v2.8.0` | No release-context PR supplied | Manual RC/final tags; final publishes to Go module proxy | Confirm whether a post-`v2.8.0` change is intended, then give `V` and candidate commit. |
| casbin-lua-casbin | latest release `v1.46.0` | Issue [#164](https://github.com/apache/casbin-lua-casbin/issues/164) is closed | Manual RC/final tags; final publishes to LuaRocks | Confirm the implementation/commit for #164 (if it is the release basis), `V`, and inclusion. |
| casbin-core | latest tag `v1.0.0`; `package.json` says `1.0.0` | No release-context PR supplied | **Automatic** `semantic-release` remains configured on `master` | Decide whether to include it. If yes, first approve a PR replacing automatic release with the manual RC/final-tag route; then set `V` and candidate commit. |
| casbin-casbin.js | latest release `v1.2.0` | No release-context PR supplied | Manual RC/final tags; final publishes to npm | Confirm post-`v1.2.0` scope, `V`, and candidate commit. |
| casbin-python-async-sqlalchemy-adapter | latest release `v1.17.0`; `pyproject.toml` says `0.0.0` | Issue [#27](https://github.com/apache/casbin-python-async-sqlalchemy-adapter/issues/27) is closed | Manual RC/final tags; final publishes to PyPI | Confirm intended change/commit and `V`; include package-version preparation. |
| casbin-SwiftCasbin | latest release `v1.17.0` | No release-context PR supplied | Manual RC/final tags; GitHub source release | Confirm post-`v1.17.0` scope, `V`, and candidate commit. |
| casbin-rs | latest tag `v2.20.0`; Cargo version `2.18.1` | No release-context PR supplied | Manual RC/final tags; workflow checks Cargo version equals tag and final publishes to crates.io | Confirm `V` and require a Cargo version PR before tag/RC selection. |
| casbin-node-casbin | latest release `v5.51.1`; `package.json` says `5.43.0` | No release-context PR supplied | Manual RC/final tags; final publishes to npm | Confirm `V` and resolve the package-file/tag version discrepancy before the RC commit. |
| casbin-rust-diesel-adapter | latest release and Cargo version `v1.2.0` | No release-context PR supplied | Manual RC/final tags; workflow checks Cargo version equals tag and final publishes to crates.io | Confirm post-`v1.2.0` scope, `V`, and candidate commit. |
| casbin-ex | latest release `v1.13.0` | Issue [#31](https://github.com/apache/casbin-ex/issues/31) is closed | **Automatic** `semantic-release` runs after successful CI on `master`/`main` | Decide whether to include it. If yes, first approve a PR switching to manual RC/final-tag release; then set `V` and candidate commit. |

## Copy-ready one-round message

> 罗老师您好。为避免每个仓库分别追问，我把这一轮候选仓库一次整理好了：
> [release coordination checklist](https://github.com/EmryZhang/incubator-release-assistant/blob/main/docs/release-coordination.md)。
>
> 麻烦您对每个准备纳入本轮的仓库一次确认四项即可：
> 1. 是否纳入本轮；2. 目标版本 `V`；3. 用于 RC 的确切 commit（列出的 PR 是否必须先合并/已关闭 issue 对应哪次修复）；4. 当前人工 tag 的发布工作流是否就是批准路径及最终包发布负责人。
>
> 两个需要优先拍板的阻塞是：`casbin-core` 和 `casbin-ex` 仍会在 CI 成功后运行 `semantic-release` 自动发布，若纳入本轮，应先以 PR 改为“`vV-rcN` 只产出 RC、投票通过后 `vV` 才发布”的流程。另有 JCasbin、PyCasbin、TypeORM、async SQLAlchemy、casbin-rs、node-casbin 的版本文件与最新 tag/release 不一致，需在版本 PR 中统一后再确定候选 commit。
>
> 收到确认后，我会按“个人仓库先改和验证 → 合适的独立功能再向 Casdoor 提 PR”的方式，逐仓库准备版本 PR、锁定 SHA，并进入 RC/RAT/签名/投票流程。

Do not send the message until the receiver, repository scope, and current
release-owner authority have been confirmed by the user.
