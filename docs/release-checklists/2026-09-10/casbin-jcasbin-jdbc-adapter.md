# casbin-jcasbin-jdbc-adapter 核对清单

快照日期：2026-09-10；精确查询时间：`2026-09-10T14:50:46.570051+00:00`。此清单记录当时的实际进度，后续提交须重新核对。

| 项目字段 | 当前记录 |
| --- | --- |
| 仓库 | [apache/casbin-jcasbin-jdbc-adapter](https://github.com/apache/casbin-jcasbin-jdbc-adapter) |
| 检查的提交 | [`989a5933e38dc9c28d58f6dfb5fe32ab37e62147`](https://github.com/apache/casbin-jcasbin-jdbc-adapter/commit/989a5933e38dc9c28d58f6dfb5fe32ab37e62147) |
| 观察到的已发布版本 | [v2.13.0](https://github.com/apache/casbin-jcasbin-jdbc-adapter/releases/tag/v2.13.0) |
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

- [build](https://github.com/apache/casbin-jcasbin-jdbc-adapter/actions/runs/30937684478/job/92087835586): `success`，完成于 `2026-08-04T18:59:18Z`。

## 本轮实际修改

补齐声明和两个精确 CSV 测试数据豁免；打包前验证已提交 POM 版本，使用 git archive 归档提交，移除打包时修改 POM 的步骤。

[可应用补丁](patches/casbin-jcasbin-jdbc-adapter.patch)；补丁树：`bb00d2290d7e7c05ffdc6060c850c50efbd31095`。补丁已随清单公开保存，尚未合入目标 Apache 仓库。

## 已完成验证

- 从上游提交生成源码归档，再解包执行 RAT 0.18，包含隐藏目录；普通扫描初始未批准项 **8**。
- 对暂存树重新归档并解包，使用逐项列明的 `.rat-excludes` 后，普通扫描 **0 未批准项**。
- 本地执行工作流中的元数据和源码打包步骤，确认同一测试提交的 RC/正式标签产生相同归档字节，并逐文件与 Git 中的字节比较。
- 除 release.yml 的明确逻辑改动外，已修改文件均保留原始字节作为后缀，只新增许可证注释；没有改写原始代码或模型正文。
- 工作流测试使用独立临时 Git 仓库和本地标签；没有调用真实 GitHub 写入、注册表发布或签名操作。

精确豁免（逐项理由见补丁内 `.rat-excludes`，仍需发布者审阅）：`examples/rbac_policy.csv`, `examples/rbac_with_domains_policy.csv`。

[补丁前 RAT](checks/casbin-jcasbin-jdbc-adapter/baseline-rat.xml) · [补丁后 RAT](checks/casbin-jcasbin-jdbc-adapter/patched-rat.xml) · [树与归档 SHA-512](checks/casbin-jcasbin-jdbc-adapter/patched-audit.json) · [打包行为验证](workflow-checks.json)

扫描通过不是法律审批或发布批准。目标版本仍未确定，补丁树不是已合入的 RC commit；本轮没有重跑数据库集成测试，也没有独立构建尚不存在的签名公开 RC。后续版本提交会改变候选字节，必须重新检查最终包。

## 下一步

确定新版本（已发布 2.13.0，源码 POM 仍为 2.6.0）；把版本写入 POM 并合入补丁；在新提交上验证数据库测试及最终包。

确认最终候选后，再准备正式命名的源码包、复核 LICENSE/NOTICE/DISCLAIMER 与豁免、签名、托管、验证公共下载件并发起适用投票。当前没有发送投票邮件。

[复查与接续开发步骤](REPRODUCE.md) · [全项目总表](README.md) · [机器可读状态](projects.json)
