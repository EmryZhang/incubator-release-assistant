# casbin-redis-watcher 核对清单

快照日期：2026-09-10；精确查询时间：`2026-09-10T14:50:59.602401+00:00`。此清单记录当时的实际进度，后续提交须重新核对。

| 项目字段 | 当前记录 |
| --- | --- |
| 仓库 | [apache/casbin-redis-watcher](https://github.com/apache/casbin-redis-watcher) |
| 检查的提交 | [`b23b3433cd156f26081beb6c0e743ac966c094f9`](https://github.com/apache/casbin-redis-watcher/commit/b23b3433cd156f26081beb6c0e743ac966c094f9) |
| 观察到的已发布版本 | [v2.8.0](https://github.com/apache/casbin-redis-watcher/releases/tag/v2.8.0) |
| 下一版本 / 正式 RC commit | 尚未确定 / 尚未选定 |
| 当前阶段 | 公共提交与 CI 初筛完成，尚未进行源码包预检 |

## 已完成与待办

- [x] 核对公共仓库、精确提交、已发布版本。
- [x] 查询该提交的 CI，保存下方运行链接；与 Dependabot 作业分开。
- [ ] 从固定源码生成归档，包含隐藏目录执行 RAT。
- [ ] 准备可独立应用的源码修补，记录补丁 Git tree。
- [ ] 补丁后扫描无未批准项（明确逐项豁免仍待人工审阅）。
- [ ] 在本地临时仓库验证源码打包步骤及 RC/正式包字节一致。
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

- [golangci](https://github.com/apache/casbin-redis-watcher/actions/runs/31106448842/job/92632746481): `success`，完成于 `2026-08-06T13:41:14Z`。
- [test (1.23)](https://github.com/apache/casbin-redis-watcher/actions/runs/31106448144/job/92632743618): `success`，完成于 `2026-08-06T13:40:14Z`。

## 下一步

先用复查脚本恢复上述精确提交，检查版本文件、与已发布标签之间的差异、依赖和项目发布工作流。随后生成源码快照并做 RAT/法律文件预检；本轮没有为该项目准备补丁或宣布可发版。

[复查与接续开发步骤](REPRODUCE.md) · [全项目总表](README.md) · [机器可读状态](projects.json)
