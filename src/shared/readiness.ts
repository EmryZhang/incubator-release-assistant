import { z } from "zod";
import type { ProgressInput, ProgressReport } from "./progress.js";

export const readinessLabels: Record<string, string> = {
  pending: "待核查",
  blocked: "未解决",
  pass: "已核查",
  "not-applicable": "不适用",
  stale: "需复查",
};
const short = z.string().trim().max(200);
const detail = z.string().trim().max(20000);
export const readinessInputSchema = z
  .object({
    id: z.string().regex(/^[A-Za-z][A-Za-z0-9-]{0,63}$/),
    title: short.min(1),
    component: short.min(1),
    ecosystem: short,
    status: z.enum(["pending", "blocked", "pass", "not-applicable"]),
    observed: detail,
    basis: detail,
    evidence: detail,
    disposition: detail,
    exception: z.boolean(),
    authority: short,
    reviewer: short,
    nextAction: detail,
    changeReason: detail.min(1),
  })
  .strict();
export const readinessUpdateSchema = readinessInputSchema
  .extend({
    at: z.string(),
    snapshot: z.string(),
    context: z.string(),
  })
  .strict();
export type ReadinessInput = z.infer<typeof readinessInputSchema>;
export type ReadinessUpdate = z.infer<typeof readinessUpdateSchema>;
type ReviewRelease = {
  version: string;
  rc: string;
  toolchain: string;
  readinessUpdates?: ReadinessUpdate[];
};
type ReviewProject = { name: string; incubating: boolean };

const requiredChecks = [
  ["PREP-01", "版本、范围与候选身份"],
  ["PREP-02", "来源、贡献头与归属"],
  ["PREP-03", "法律文件与 RAT 覆盖"],
  ["PREP-04", "依赖安全及许可证"],
  ["PREP-05", "实际分发包与项目身份"],
  ["PREP-06", "发布渠道、坐标与权限"],
  ["PREP-07", "构建、测试与适用环境"],
  ["PREP-08", "未决项收口与准备交接"],
  ["AUDIT-01", "来源与归属历史"],
  ["AUDIT-02", "嵌套许可证与 NOTICE 映射"],
  ["AUDIT-03", "扫描盲区与逐文件处置"],
  ["AUDIT-04", "包名、元数据与公开展示"],
  ["AUDIT-05", "所有发布入口及副作用"],
  ["AUDIT-06", "本项目历次评审意见"],
  ["AUDIT-07", "工具、Agent 与人审证据边界"],
] as const;

export function emptyReadiness(
  id: string,
  title: string,
  component: string,
): ReadinessInput {
  return {
    id,
    title,
    component,
    ecosystem: "",
    status: "pending",
    observed: "",
    basis: "",
    evidence: "",
    disposition: "",
    exception: false,
    authority: "",
    reviewer: "",
    nextAction: "核查本项目实际候选并记录依据。",
    changeReason: "首次核查",
  };
}
export function readinessContext(
  release: ReviewRelease,
  project: ReviewProject,
): string {
  return JSON.stringify([
    release.version,
    release.rc,
    release.toolchain,
    project.incubating,
  ]);
}
export function readinessView(
  release: ReviewRelease,
  project: ReviewProject,
  snapshot: string,
) {
  const context = readinessContext(release, project);
  const entries = new Map<string, ReadinessUpdate>(
    requiredChecks.map(([id, title]) => [
      id,
      {
        ...emptyReadiness(id, title, project.name),
        at: "",
        snapshot: "",
        context: "",
      },
    ]),
  );
  for (const update of release.readinessUpdates ?? [])
    entries.set(update.id, update);
  const items = [...entries.values()].map((item) => ({
    ...item,
    stale:
      ["pass", "not-applicable"].includes(item.status) &&
      (item.snapshot !== snapshot || item.context !== context),
  }));
  const unresolved = items.filter(
    (item) => item.stale || !["pass", "not-applicable"].includes(item.status),
  );
  return {
    items,
    unresolved,
    ready: unresolved.length === 0,
    snapshot,
    context,
    revision: release.readinessUpdates?.length ?? 0,
  };
}

export function validateReadinessUpdate(
  input: ReadinessInput,
  previous?: ReadinessUpdate,
) {
  if (
    previous &&
    (input.title !== previous.title ||
      input.component !== previous.component ||
      (previous.ecosystem && input.ecosystem !== previous.ecosystem))
  )
    throw new Error(
      "审查项的标题、组件和已确定的生态不能改作其他问题；请新增审查项并保留原项处置",
    );
  const canonical = requiredChecks.find(([id]) => id === input.id);
  if (canonical && input.title !== canonical[1])
    throw new Error("标准审查项标题不能替换");
  if (/^(PREP|AUDIT)-/i.test(input.id) && !canonical)
    throw new Error("标准审查项 ID 不正确；额外问题请使用独立 ID");
  if (["pass", "not-applicable"].includes(input.status)) {
    if (
      ![
        input.ecosystem,
        input.observed,
        input.basis,
        input.evidence,
        input.disposition,
        input.reviewer,
      ].every((value) => value.trim())
    )
      throw new Error(
        "关闭审查项需要生态/渠道、实际观察、规则依据、证据、处置和审查者",
      );
    if (input.exception && !input.authority.trim())
      throw new Error("例外处置必须记录具体决定者及其权限依据");
  } else if (!input.nextAction.trim())
    throw new Error("未解决审查项必须说明下一步");
}

export function guardReadinessProgress(
  next: ProgressInput,
  previous: ProgressReport,
  ready: boolean,
) {
  if (
    previous.steps.some(
      (step) => !next.steps.some((candidate) => candidate.id === step.id),
    )
  )
    throw new Error("已有进度步骤不能从回报中删除；不适用时请保留理由");
  if (ready) return;
  const advances = next.steps.some((step) => {
    const before = previous.steps.find((old) => old.id === step.id);
    if (before?.status === step.status) return false; // Preserve historical completed actions.
    return (
      (["prepare", "verify"].includes(step.id) && step.status === "done") ||
      (["sign", "stage", "vote", "publish", "announce"].includes(step.id) &&
        ["running", "done"].includes(step.status))
    );
  });
  if (next.status === "complete" || advances)
    throw new Error(
      "准备审查仍有未解决或需复查项，请先核对审查记录；技术检查或 PR 合并不能代替关闭证据",
    );
}

export function formatReadiness(view: ReturnType<typeof readinessView>) {
  return [
    `准备审查：${view.ready ? "记录齐备（不代表发布批准）" : `${view.unresolved.length} 项待解决或复查`}`,
    ...view.unresolved.map(
      (item) =>
        `- ${item.id} ${item.title} · ${item.component}${item.ecosystem ? ` / ${item.ecosystem}` : ""}：${item.stale ? "候选或检查设置变化，需复查" : readinessLabels[item.status]}；${item.nextAction || "核对现有证据与当前候选"}`,
    ),
  ].join("\n");
}
