# 复查与接续开发

以下命令从本日期目录执行。完整下载仓库后，进入 `docs/release-checklists/2026-09-10`。也可以只下载此目录，但需保留全部子目录。源码原仓库位于 Apache；本包附带补丁，不依赖原作者的工作区。

## 1. 检查下载内容

需要 Python 3.12 或更新版本。

```text
python replay.py verify
```

核对随包文件的 SHA-256。`integrity.json` 不包含自身；它用于发现文件缺失或变化，公开 GitHub commit 用于定位来源版本。

## 2. 恢复记录中的源码

需要 Git 和访问公开 GitHub 的网络。输出目录使用你选择的新目录；脚本拒绝覆盖已有项目目录。

```text
python replay.py restore --project all --output ../../../../review-sources
```

`all` 恢复四个带补丁的项目：clone 公开仓库 → checkout 清单中的完整 SHA → `git apply --index` → 核对 Git tree。可以用任一清单中的项目 ID 替换 `all`，包括其他四个仅完成 CI 初筛的项目。

Git tree 必须与 `projects.json` 中的 `patched_tree` 一致；它证明被复查的文件内容与记录相同。脚本不会提交、推送、签名、调用注册表或执行目标项目代码。

## 3. 重新运行源码包 RAT

需要 Java 和 Apache RAT 0.18 JAR。JAR 的原检查摘要记录在各项目 `checks/*/baseline-audit.json` 的 `rat_jar_sha512` 中。自行取得 JAR 后指定本机路径；工具不下载或安装 JAR。

```text
python replay.py rat --project all --sources ../../../../review-sources --output ../../../../review-rat --rat-jar /absolute/path/apache-rat-0.18.jar
```

Windows 可将 JAR 参数替换为 `D:\path\apache-rat-0.18.jar`。脚本从已核对的暂存树创建新的源码归档并解包，扫描隐藏目录，应用每份补丁中的 `.rat-excludes`。请逐项阅读豁免理由与 XML 报告。SQLx 另将相同 Rust 源字节写入 `.txt` 副本扫描并生成 SHA-512 映射，以补足 RAT 0.18 的 MIME 识别盲区。

`checks/*/patched-audit.json` 中的归档 SHA-512 是当时实际扫描包的摘要。原始运行归档未随本清单分发；从 Git tree 重新生成的归档时间戳可能不同，因此先比较 **Git tree 和文件内容**，不要把新生成的压缩包哈希不同误判为源码变化。新运行的日志、时间和摘要应另行保存。

## 4. 复查打包工作流

额外需要 Node.js、PyYAML（原运行使用 6.0.1）、Bash、GNU tar 和 gzip。Windows 使用 Git for Windows 的 Git Bash；不要把 WSL 的 Bash 与 Windows Python 混用。

```text
python verify_workflows.py --sources ../../../../review-sources --work ../../../../review-workflows
```

Windows 指定 Git Bash 的真实路径，例如：

```text
python verify_workflows.py --sources ../../../../review-sources --work ../../../../review-workflows --bash "C:\Program Files\Git\bin\bash.exe"
```

工作目录必须是新目录。此脚本仅执行清单中的元数据计算、版本验证、源码打包及模拟的既有 Release 拒绝检查；它会在独立临时 Git 仓库创建测试提交和标签。`gh` 使用本地模拟程序，不会发布 GitHub Release。不会运行真实 npm/Maven/crates.io 发布步骤。

验证内容：

- 四个项目：同一测试提交的 RC/正式标签产生相同归档字节，包内每个文件等于 Git 中的对应文件。
- JDBC：POM 与标签版本不符时失败，匹配时不改写源码。
- TypeORM：package.json 与版本不符时失败；已有 Release 时只做模拟查询，不修改或覆盖。

原检查结果在 [workflow-checks.json](workflow-checks.json)。测试提交包含运行时创建的时间等元数据，重跑不要求与历史测试包的 SHA-512 相同，只要求**本次同提交 RC/正式包相同**。Windows Git Bash 已实际执行；其他系统需在当地验证，不能由脚本可移植性推断已经测试通过。

## 5. 继续开发

恢复后的项目停在原基线的 detached HEAD，补丁已暂存。进入对应项目后创建自己的分支，例如 `git switch -c my-release-preparation`；检查 `git diff --cached`，审阅修改和豁免，再提交。

下一步先确定目标版本、依赖兼容及需要合入的修改。将版本和修补合入后重新选定候选 SHA，运行针对该提交的 CI、最终源码包 RAT 和法律文件审阅；随后按项目流程推进签名、托管、独立审核、投票及发布。当前记录不授权或证明这些步骤已完成。

## 状态字段

`projects.json` 的 `schema_version` 为 1，每条记录包括：

| 字段 | 含义 |
| --- | --- |
| `base_commit` / `checked_at` | 本次核对的完整提交和公开状态查询时间 |
| `ci` | 原提交的具体检查、结果、完成时间和 GitHub 链接 |
| `patch` / `patched_tree` / `patch_sha256` | 补丁位置、应用后的树及补丁摘要；没有修补时为 null |
| `phase` | `local_patch_verified` 或 `public_ci_screened` |
| `target_version` / `rc_commit` | 正式候选选择，当前均为 null |
| `rat_status` / `workflow_replay` | 本地检查范围；passed 不等于发布批准 |
| `upstream_patch_ci` / `legal_review` / `dependency_compatibility_review` | 分别跟踪新提交 CI、人工法律审阅与依赖兼容 |
| `signed_rc` / `vote` / `publication` | 本轮 RC、投票、发布进度；不推断全部历史状态 |

更新清单、补丁或复查代码后，在新的快照目录运行 `python update_integrity.py`，然后 `python replay.py verify`。摘要仅反映文件内容；更新摘要不会自动把任何检查标记为已完成。
