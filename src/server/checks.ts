import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import yauzl from "yauzl";
import type { CheckRun, Finding, Project, Release } from "../shared/model.js";
import { atomicWrite, id, now } from "./store.js";
import { git, repoView } from "./git.js";

// Inspect zip metadata and at most 64 KiB of go.mod; never extract or execute.
async function inspectZip(file: string) {
  return new Promise<{ entries: Map<string, number>; goMod?: string }>(
    (resolve, reject) => {
      yauzl.open(
        file,
        { lazyEntries: true, validateEntrySizes: true },
        (error, zip) => {
          if (error || !zip) {
            reject(error || new Error("Cannot open zip"));
            return;
          }
          const entries = new Map<string, number>();
          let goMod: string | undefined;
          const fail = (error: Error) => {
            zip.close();
            reject(error);
          };
          zip.on("error", fail);
          zip.on("end", () => resolve({ entries, goMod }));
          zip.on("entry", (entry: yauzl.Entry) => {
            const name = entry.fileName.replace(/^source\//, "");
            entries.set(name, entry.uncompressedSize);
            if (name !== "go.mod" || entry.uncompressedSize > 65536) {
              zip.readEntry();
              return;
            }
            zip.openReadStream(entry, (error, stream) => {
              if (error || !stream) {
                fail(error || new Error("Cannot read go.mod"));
                return;
              }
              const chunks: Buffer[] = [];
              let size = 0;
              stream.on("data", (chunk: Buffer) => {
                size += chunk.length;
                if (size > 65536) {
                  stream.destroy(new Error("go.mod exceeds 64 KiB"));
                  return;
                }
                chunks.push(chunk);
              });
              stream.on("error", fail);
              stream.on("end", () => {
                goMod = Buffer.concat(chunks).toString("utf8");
                zip.readEntry();
              });
            });
          });
          zip.readEntry();
        },
      );
    },
  );
}
export async function runChecks(
  dir: string,
  release: Release,
  project: Project,
): Promise<CheckRun> {
  const view = await repoView(project);
  const run: CheckRun = {
    id: id(),
    at: now(),
    commit: view.commit,
    snapshot: view.snapshot,
    toolchain: release.toolchain,
    incubating: project.incubating,
    artifact: "",
    sha512: "",
    findings: [],
  };
  const add = (name: string, status: Finding["status"], detail: string) =>
    run.findings.push({ name, status, detail });
  add(
    "工作目录",
    view.status ? "fail" : "pass",
    view.status
      ? `存在未提交改动。此次归档只包含 HEAD；审查并提交修正后重新检查。\n${view.status}`
      : "工作目录干净，归档固定 HEAD 提交。",
  );
  try {
    await git(project.path, ["diff", "--check", "HEAD", "--"]);
    add("差异格式", "pass", "git diff --check HEAD 未发现空白错误。");
  } catch (error) {
    add("差异格式", "fail", String(error));
  }
  const evidenceDir = path.join(dir, "evidence", run.id);
  await fs.mkdir(evidenceDir, { recursive: true, mode: 0o700 });
  run.artifact = path.join(evidenceDir, "source.zip");
  await git(
    project.path,
    [
      "archive",
      "--format=zip",
      "--prefix=source/",
      `--output=${run.artifact}`,
      run.commit,
    ],
    90_000,
  );
  const hash = createHash("sha512");
  for await (const chunk of createReadStream(run.artifact)) hash.update(chunk);
  run.sha512 = hash.digest("hex");
  add(
    "候选快照归档",
    "pass",
    `已从固定提交生成本地检查用 source.zip；这不是已签名或已发布的 RC。SHA-512: ${run.sha512}`,
  );
  const zip = await inspectZip(run.artifact);
  for (const name of [
    "LICENSE",
    "NOTICE",
    ...(project.incubating ? ["DISCLAIMER"] : []),
  ]) {
    add(
      name,
      (zip.entries.get(name) || 0) > 0 ? "pass" : "fail",
      (zip.entries.get(name) || 0) > 0
        ? `归档根目录含非空 ${name}；内容正确性仍需人工审核。`
        : `归档根目录缺少非空 ${name}。`,
    );
  }
  if (zip.entries.has("go.mod"))
    add(
      "Go 模块清单",
      zip.goMod && /^module\s+\S+/m.test(zip.goMod) ? "pass" : "fail",
      "核对归档内 go.mod 模块声明；大于 64 KiB 或缺少声明记为失败。未执行目标代码。",
    );
  else
    add(
      "语言适配",
      "not-run",
      "基础归档检查适用于已添加项目；该项目的语言构建与发版适配尚未执行。",
    );
  add(
    "Apache RAT / 法律审核",
    "not-run",
    "本工作台尚未调用 RAT。对正式最终源码包运行现有 IRA prepare/RAT 流程，并人工审查法律文件、第三方材料和排除项。",
  );
  add(
    "独立构建与测试",
    "not-run",
    "审核者应从最终公开候选包独立解压、构建和测试。当前检查不会执行目标仓库代码。",
  );
  add(
    "签名 / KEYS / 公开下载",
    "not-run",
    "尚未签名、托管或独立验证公开 RC；使用现有 IRA 分步命令或项目选择的外部流程。",
  );
  if (release.toolchain === "agent")
    add(
      "Agent 辅助审查",
      "not-run",
      "创建 Agent 任务并提交带证据的回报；Agent 意见不会自动替代确定性检查或社区投票。",
    );
  await atomicWrite(
    path.join(evidenceDir, "digest.txt"),
    `Commit: ${run.commit}\nSHA-512: ${run.sha512}\n`,
  );
  return run;
}
