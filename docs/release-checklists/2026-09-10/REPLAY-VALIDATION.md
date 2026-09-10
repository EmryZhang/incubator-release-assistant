# 下载包复查工具验证

2026-09-10 在新的输出目录进行独立恢复，未使用原修补工作树作为源码来源。

- [x] 从公开 Apache 仓库重新 clone 四个项目，定位清单中的完整提交。
- [x] 应用随包补丁并核对全部四个 `patched_tree`，与原记录一致。
- [x] 从恢复后的树重新生成源码快照，四项 RAT 全部通过；SQLx Rust 同字节补充扫描也通过。
- [x] 使用随包 `verify_workflows.py` 重跑四套打包检查，RC/正式包字节与源码内容比较通过。
- [x] JDBC/TypeORM 拒绝版本不匹配；TypeORM 对已有 Release 仅执行模拟查询，没有修改或覆盖。

环境：Windows、Python 3.12.7、Git 2.51.0.windows.1、Node.js 24.14.1、PyYAML 6.0.1、Git Bash、Apache RAT 0.18。这验证的是源码恢复和选定打包步骤，不是数据库集成测试、完整发布工作流、法律批准或正式 RC 审核。

历史检查结果保存在 `workflow-checks.json`，复查命令见 [REPRODUCE.md](REPRODUCE.md)。不同机器、工具版本上的结果应重新记录；不能直接继承本次通过结论。
