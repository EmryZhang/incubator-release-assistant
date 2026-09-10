# casbin-python-django-orm-adapter 核对清单

快照日期：2026-09-10；精确查询时间：`2026-09-10T14:50:53.832995+00:00`。此清单记录当时的实际进度，后续提交须重新核对。

| 项目字段 | 当前记录 |
| --- | --- |
| 仓库 | [apache/casbin-python-django-orm-adapter](https://github.com/apache/casbin-python-django-orm-adapter) |
| 检查的提交 | [`d56f80d6f39fa8c033a0bd4fd475f6ade0875c30`](https://github.com/apache/casbin-python-django-orm-adapter/commit/d56f80d6f39fa8c033a0bd4fd475f6ade0875c30) |
| 观察到的已发布版本 | [v1.7.0](https://github.com/apache/casbin-python-django-orm-adapter/releases/tag/v1.7.0) |
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

- [Indicate completion to coveralls.io](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92547866037): `success`，完成于 `2026-08-06T07:38:10Z`。
- [Run Linters](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545974221): `success`，完成于 `2026-08-06T07:19:06Z`。
- [test (3.10, ubuntu-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545973380): `success`，完成于 `2026-08-06T07:19:13Z`。
- [test (3.11, ubuntu-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545973175): `success`，完成于 `2026-08-06T07:19:07Z`。
- [test (3.11, windows-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545973158): `success`，完成于 `2026-08-06T07:10:57Z`。
- [test (3.10, macOS-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545973131): `success`，完成于 `2026-08-06T07:10:32Z`。
- [test (3.12, macOS-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545972904): `success`，完成于 `2026-08-06T07:10:20Z`。
- [test (3.10, windows-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545972900): `success`，完成于 `2026-08-06T07:10:56Z`。
- [test (3.12, windows-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545972894): `success`，完成于 `2026-08-06T07:10:53Z`。
- [test (3.12, ubuntu-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545972880): `success`，完成于 `2026-08-06T07:17:39Z`。
- [test (3.11, macOS-latest)](https://github.com/apache/casbin-python-django-orm-adapter/actions/runs/31079857492/job/92545972858): `success`，完成于 `2026-08-06T07:10:14Z`。

## 下一步

先用复查脚本恢复上述精确提交，检查版本文件、与已发布标签之间的差异、依赖和项目发布工作流。随后生成源码快照并做 RAT/法律文件预检；本轮没有为该项目准备补丁或宣布可发版。

[复查与接续开发步骤](REPRODUCE.md) · [全项目总表](README.md) · [机器可读状态](projects.json)
