import { z } from "zod";

export const progressLabels: Record<string, string> = {
  pending: "待开始",
  running: "进行中",
  done: "已完成",
  paused: "已暂停",
  blocked: "受阻",
  skipped: "不适用",
  complete: "全部完成",
};
export const progressStepSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/),
    title: z.string().trim().min(1).max(160),
    status: z.enum([
      "pending",
      "running",
      "done",
      "paused",
      "blocked",
      "skipped",
    ]),
    evidence: z.string().max(20000),
  })
  .strict();
const progressFields = {
  status: z.enum(["pending", "running", "paused", "blocked", "complete"]),
  summary: z.string().trim().min(1).max(20000),
  stopReason: z.string().max(20000),
  nextAction: z.string().max(20000),
  steps: z.array(progressStepSchema).min(1).max(40),
};
export const progressInputSchema = z.object(progressFields).strict();
export const progressReportSchema = z
  .object({
    ...progressFields,
    at: z.string(),
    snapshot: z.string(),
  })
  .strict();
export type ProgressInput = z.infer<typeof progressInputSchema>;
export type ProgressReport = z.infer<typeof progressReportSchema>;

export function validateProgress(progress: ProgressInput) {
  const steps = progress.steps;
  if (new Set(steps.map((s) => s.id)).size !== steps.length)
    throw new Error("进度步骤 ID 不能重复");
  if (steps.filter((s) => s.status === "running").length > 1)
    throw new Error("请明确一个当前正在推进的步骤");
  if (
    steps.some(
      (s) => ["done", "skipped"].includes(s.status) && !s.evidence.trim(),
    )
  )
    throw new Error("已完成项需要证据，不适用项需要说明理由");
  if (["paused", "blocked"].includes(progress.status)) {
    if (!progress.stopReason.trim()) throw new Error("停止时必须说明原因");
    if (steps.some((s) => s.status === "running"))
      throw new Error("停止时请把进行中的步骤标为暂停或受阻");
  }
  if (progress.status !== "complete" && !progress.nextAction.trim())
    throw new Error("未完成发布时必须说明下一步");
  if (
    progress.status === "complete" &&
    steps.some((s) => !["done", "skipped"].includes(s.status))
  )
    throw new Error("仍有未完成步骤，不能将本次发布标为全部完成");
}

export function initialProgress(at: string): ProgressReport {
  return {
    status: "pending",
    summary: "发布任务已创建，尚未开始执行。",
    stopReason: "",
    nextAction: "确认目标版本、改动范围和候选提交。",
    at,
    snapshot: "",
    steps: [
      ["scope", "确定版本、范围与候选提交"],
      ["prepare", "修正源码与发布配置"],
      ["verify", "验证候选源码包、许可证与构建测试"],
      ["sign", "签名并核验校验文件"],
      ["stage", "托管 RC 并验证公共下载件"],
      ["vote", "完成适用的社区投票"],
      ["publish", "晋升获批产物并正式分发"],
      ["announce", "发送公告与归档"],
    ].map(([id, title]) => ({
      id: id!,
      title: title!,
      status: "pending",
      evidence: "",
    })),
  };
}

export function currentProgress(release: {
  createdAt: string;
  progressReports?: ProgressReport[];
}) {
  return (
    release.progressReports?.at(-1) ?? {
      ...initialProgress(""),
      summary: "尚无完整进度回报，请根据已有任务与证据补录。",
      nextAction: "核对已有记录，更新当前步骤与下一步。",
    }
  );
}

export function formatProgress(
  title: string,
  progress: ProgressReport,
): string {
  const compact = (value: string) => value.replace(/\s+/g, " ").trim();
  const done = progress.steps.filter((s) => s.status === "done").length;
  const skipped = progress.steps.filter((s) => s.status === "skipped").length;
  return [
    `${compact(title)} — 发版进度`,
    `状态：${progressLabels[progress.status]}；已完成 ${done}/${progress.steps.length}，不适用 ${skipped} 项`,
    `当前情况：${compact(progress.summary)}`,
    "",
    ...progress.steps.map(
      (s) =>
        `- [${progressLabels[s.status]}] ${compact(s.title)}${s.evidence ? `：${compact(s.evidence)}` : ""}`,
    ),
    "",
    `停止原因：${compact(progress.stopReason) || "无已记录的停止原因"}`,
    `下一步：${compact(progress.nextAction) || "本次清单已完成"}`,
    `最后记录：${progress.at || "尚无回报"}`,
  ].join("\n");
}
