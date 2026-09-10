# 多项目发版核对清单 · 2026-09-10

这是一份可下载、可复查、可接续开发的进度快照。本轮核查 **8 个项目**，其中 **4 个已完成本地补丁和打包验证**。没有新版本发布，也没有签名、上传正式 RC 或发送投票邮件。

| 项目清单 | 观察到的发布版本 | 核对提交 | 当前推进阶段 |
| --- | --- | --- | --- |
| [casbin-sqlx-adapter](casbin-sqlx-adapter.md) | `v1.8.0` | `6dbb79b4904f` | 修补与本地打包验证完成；待版本、审阅和合入 |
| [casbin-jcasbin-jdbc-adapter](casbin-jcasbin-jdbc-adapter.md) | `v2.13.0` | `989a5933e38d` | 修补与本地打包验证完成；待版本、审阅和合入 |
| [casbin-typeorm-adapter](casbin-typeorm-adapter.md) | `v1.10.0` | `065d76cd2d40` | 修补与本地打包验证完成；待版本、审阅和合入 |
| [casbin-mongodb-adapter](casbin-mongodb-adapter.md) | `v4.3.0` | `67c101979371` | 修补与本地打包验证完成；待版本、审阅和合入 |
| [casbin-python-django-orm-adapter](casbin-python-django-orm-adapter.md) | `v1.7.0` | `d56f80d6f39f` | 公共 CI 初筛；待源码包预检 |
| [casbin-ent-adapter](casbin-ent-adapter.md) | `v1.4.0` | `dba7bd2d8b00` | 公共 CI 初筛；待源码包预检 |
| [casbin-redis-watcher](casbin-redis-watcher.md) | `v2.8.0` | `b23b3433cd15` | 公共 CI 初筛；待源码包预检 |
| [casbin-rust-diesel-adapter](casbin-rust-diesel-adapter.md) | `v1.2.0` | `d1c9a4e37bf3` | 公共 CI 初筛；待源码包预检 |

## 下载后从这里开始

1. 打开对应项目的清单，先核对提交、检查范围和未勾选事项。
2. 按 [REPRODUCE.md](REPRODUCE.md) 校验下载完整性，恢复固定提交并应用补丁。
3. 重新执行 RAT 和本地打包检查，或在独立分支继续开发；新的结果单独留档。

[工具复查验证记录](REPLAY-VALIDATION.md) · [机器可读进度](projects.json) · [历史打包检查结果](workflow-checks.json) · [文件完整性清单](integrity.json)

## 本轮已落实的改动

- SQLx：补齐许可证声明；RAT 0.18 将 `.rs` 误判为二进制，另以相同字节的文本副本扫描五个 Rust 源文件并保留摘要映射。
- JDBC：版本必须先写入 POM；打包时验证而不改写版本，直接归档 Git 提交。
- TypeORM：版本必须先写入 package.json；拒绝覆盖已有候选资产；补齐两个源码文件及配置声明。
- MongoDB：源码包使用统一 Apache 前缀，包名和目录不含 RC 后缀；同一提交的 RC/正式包字节一致。

四份补丁后源码快照均在明确列出的精确豁免下达到 RAT 未批准项 0；豁免和法律文件仍待发布者审阅。这不是发布批准。数据库集成测试本轮没有重跑，当前上游 CI 只覆盖表中原始提交，不覆盖补丁。

所有目标版本和正式候选提交仍为空。补丁仅随本清单公开保存，尚未合入目标 Apache 仓库；“清单已上传 GitHub”与“项目补丁已合入/项目已发布”分别记录。

## 范围与持续更新

原 [19 项队列](../../release-progress.md) 中另外 11 项没有纳入本轮实时检查，不能将本清单视作它们的进度确认。SQLx #113 在本次查询中已合并，旧队列的未合并记录已过期；TypeORM 的部分 Dependabot 作业失败与通过的项目 CI 分开看待。

保留本日期目录作为历史证据。推进后新建日期快照，更新 [清单入口](../README.md)；逐项目更新精确 SHA、版本、补丁/PR 链接、检查时间、检查对象和未完成事项。不要把旧提交的绿色结果沿用到新版本。更新任何文件后重新生成 integrity.json（方法见复查说明）。

本目录仅包含公开源码补丁和精选的公共检查结果，运行数据和私人通信不在这个下载包中。机器可读字段说明见 [REPRODUCE.md](REPRODUCE.md#状态字段)。
