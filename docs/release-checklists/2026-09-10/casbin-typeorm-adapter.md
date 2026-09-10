# casbin-typeorm-adapter 核对清单

快照日期：2026-09-10；精确查询时间：`2026-09-10T14:50:50.987274+00:00`。此清单记录当时的实际进度，后续提交须重新核对。

| 项目字段 | 当前记录 |
| --- | --- |
| 仓库 | [apache/casbin-typeorm-adapter](https://github.com/apache/casbin-typeorm-adapter) |
| 检查的提交 | [`065d76cd2d408d9c21b5984d09fc3b4ac4429592`](https://github.com/apache/casbin-typeorm-adapter/commit/065d76cd2d408d9c21b5984d09fc3b4ac4429592) |
| 观察到的已发布版本 | [v1.10.0](https://github.com/apache/casbin-typeorm-adapter/releases/tag/v1.10.0) |
| 下一版本 / 正式 RC commit | 尚未确定 / 尚未选定 |
| 当前阶段 | 本地源码修补与打包验证完成，补丁待合入 |

## 已完成与待办

- [x] 核对公共仓库、精确提交、已发布版本。
- [x] 查询该提交的 CI，保存下方运行链接；与 Dependabot 作业分开。
- [x] 从固定源码生成归档，包含隐藏目录执行 RAT。
- [x] 准备可独立应用的源码修补，记录补丁 Git tree。
- [x] 补丁后扫描无未批准项（明确逐项豁免仍待人工审阅）。
- [x] 在本地临时仓库验证源码打包步骤及 RC/正式包字节一致。
- [ ] 发布者审阅 LICENSE / NOTICE / DISCLAIMER、第三方材料及全部豁免。
- [ ] 完成本轮依赖版本、兼容性和发布范围判断。
- [ ] 确定目标版本并提交版本文件，合入所需补丁。
- [ ] 在新的正式候选提交上通过目标 CI；当前公共 CI 不覆盖本地补丁。
- [ ] 对最终候选源码包重新运行 RAT 并完成检查。
- [ ] 按流程准备签名、托管及公共下载验证。
- [ ] 审核者独立构建、测试公开签名 RC，完成适用投票。
- [ ] 正式分发、标签、包注册表发布、公告及收尾。

未勾选表示本次记录中尚未完成，不能推断历史上从未做过该动作。

## 精确提交上的公共 CI

- [coverage](https://github.com/apache/casbin-typeorm-adapter/actions/runs/31084503706/job/92562523572): `success`，完成于 `2026-08-06T08:33:36Z`。
- [test (^20)](https://github.com/apache/casbin-typeorm-adapter/actions/runs/31084503706/job/92562523521): `success`，完成于 `2026-08-06T08:34:00Z`。
- [lint](https://github.com/apache/casbin-typeorm-adapter/actions/runs/31084503706/job/92560687771): `success`，完成于 `2026-08-06T08:29:07Z`。

## 本轮实际修改

补齐 src/index.ts、test/config.ts 及配置、文档声明；明确四项精确豁免；版本必须先提交，打包和 npm 发布步骤不再改写版本；已有 GitHub Release 时拒绝覆盖资产。

[可应用补丁](patches/casbin-typeorm-adapter.patch)；补丁树：`b47484cd32b5405d6cd32ed95ff27db42d6cf460`。补丁已随清单公开保存，尚未合入目标 Apache 仓库。

## 已完成验证

- 从上游提交生成源码归档，再解包执行 RAT 0.18，包含隐藏目录；普通扫描初始未批准项 **14**。
- 对暂存树重新归档并解包，使用逐项列明的 `.rat-excludes` 后，普通扫描 **0 未批准项**。
- 本地执行工作流中的元数据和源码打包步骤，确认同一测试提交的 RC/正式标签产生相同归档字节，并逐文件与 Git 中的字节比较。
- 除 release.yml 的明确逻辑改动外，已修改文件均保留原始字节作为后缀，只新增许可证注释；没有改写原始代码或模型正文。
- 工作流测试使用独立临时 Git 仓库和本地标签；没有调用真实 GitHub 写入、注册表发布或签名操作。

精确豁免（逐项理由见补丁内 `.rat-excludes`，仍需发布者审阅）：`.prettierrc`, `examples/acl_policy.csv`, `examples/rbac_policy.csv`, `yarn.lock`。

[补丁前 RAT](checks/casbin-typeorm-adapter/baseline-rat.xml) · [补丁后 RAT](checks/casbin-typeorm-adapter/patched-rat.xml) · [树与归档 SHA-512](checks/casbin-typeorm-adapter/patched-audit.json) · [打包行为验证](workflow-checks.json)

扫描通过不是法律审批或发布批准。目标版本仍未确定，补丁树不是已合入的 RC commit；本轮没有重跑数据库集成测试，也没有独立构建尚不存在的签名公开 RC。后续版本提交会改变候选字节，必须重新检查最终包。

## 下一步

确定新版本（已发布 1.10.0，源码 package.json 仍为 0.0.0）；提交实际版本并合入补丁；复核包依赖与发布负责人，在新提交上重跑 CI。

确认最终候选后，再准备正式命名的源码包、复核 LICENSE/NOTICE/DISCLAIMER 与豁免、签名、托管、验证公共下载件并发起适用投票。当前没有发送投票邮件。

[复查与接续开发步骤](REPRODUCE.md) · [全项目总表](README.md) · [机器可读状态](projects.json)
