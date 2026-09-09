import { z } from "zod";

const text = z.string();
const identifier = text.regex(/^[a-f0-9]{24}$/);
export const toolSchema = z.enum(["builtin", "agent"]);
export const phaseSchema = z.enum(["prepare", "review", "communication"]);
export const jobStatusSchema = z.enum([
  "open",
  "running",
  "reported",
  "blocked",
  "done",
]);
export const projectSchema = z
  .object({
    id: identifier,
    name: text,
    path: text,
    incubating: z.boolean(),
    toolchain: z.union([toolSchema, z.literal("")]),
  })
  .strict();
export const reportSchema = z
  .object({
    summary: text,
    evidence: text,
    status: z.enum(["running", "reported", "blocked"]),
    snapshot: text,
    at: text,
  })
  .strict();
export const jobSchema = z
  .object({
    id: identifier,
    title: text,
    instructions: text,
    status: jobStatusSchema,
    mailId: text,
    createdAt: text,
    reports: z.array(reportSchema),
  })
  .strict();
export const findingSchema = z
  .object({
    name: text,
    status: z.enum(["pass", "fail", "not-run"]),
    detail: text,
  })
  .strict();
export const checkSchema = z
  .object({
    id: identifier,
    at: text,
    commit: text,
    snapshot: text,
    artifact: text,
    sha512: text,
    findings: z.array(findingSchema),
    // Early Go records can contain the zero value after later state writes.
    toolchain: z.union([toolSchema, z.literal("")]).optional(),
    incubating: z.boolean().optional(),
  })
  .strict();
export const mailSchema = z
  .object({
    id: text.default(""),
    from: text.default(""),
    subject: text.default(""),
    messageId: text.default(""),
    references: text.default(""),
    url: text.default(""),
    body: text.default(""),
    at: text.default(""),
  })
  .strict();
export const draftSchema = z
  .object({
    id: text.default(""),
    kind: z.enum(["vote", "reply"]),
    mailId: text.default(""),
    to: text.default(""),
    subject: text.default(""),
    body: text.default(""),
    inReplyTo: text.default(""),
    references: text.default(""),
    updatedAt: text.default(""),
  })
  .strict();
export const preferencesSchema = z
  .object({ toolchain: toolSchema, signature: text })
  .strict();
export const releaseSchema = z
  .object({
    id: identifier,
    projectId: identifier,
    version: text,
    rc: text,
    phase: phaseSchema,
    toolchain: toolSchema,
    createdAt: text,
    jobs: z.array(jobSchema),
    checks: z.array(checkSchema),
    mails: z.array(mailSchema),
    drafts: z.array(draftSchema),
  })
  .strict();
export const stateSchema = z
  .object({
    schema: z.literal(1),
    projects: z.array(projectSchema),
    releases: z.array(releaseSchema),
    preferences: preferencesSchema,
  })
  .strict();
export type Project = z.infer<typeof projectSchema>;
export type Release = z.infer<typeof releaseSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Report = z.infer<typeof reportSchema>;
export type CheckRun = z.infer<typeof checkSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type Mail = z.infer<typeof mailSchema>;
export type Draft = z.infer<typeof draftSchema>;
export type State = z.infer<typeof stateSchema>;
export type Toolchain = z.infer<typeof toolSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export interface RepoView {
  branch: string;
  commit: string;
  status: string;
  diff: string;
  files: string[];
  snapshot: string;
}
export interface StateResponse {
  state: State;
  dataDir: string;
  runtime?: string;
}

const optionalText = text.default("");
// Keep the initial Go API's field names; unknown fields and wrong types fail closed.
export const actionSchema = z
  .object({
    op: z.enum([
      "notes",
      "check",
      "addProject",
      "preferences",
      "projectSettings",
      "createRelease",
      "updateRelease",
      "createJob",
      "mailToJob",
      "reportJob",
      "reviewJob",
      "importMail",
      "saveDraft",
    ]),
    projectId: optionalText,
    releaseId: optionalText,
    jobId: optionalText,
    mailId: optionalText,
    path: optionalText,
    name: optionalText,
    incubating: z.boolean().default(false),
    version: optionalText,
    rc: optionalText,
    phase: optionalText,
    toolchain: optionalText,
    title: optionalText,
    instructions: optionalText,
    status: optionalText,
    summary: optionalText,
    evidence: optionalText,
    text: optionalText,
    signature: optionalText,
    mail: mailSchema.optional(),
    draft: draftSchema.optional(),
  })
  .strict();
export type Action = z.infer<typeof actionSchema>;
export type ActionInput = z.input<typeof actionSchema>;
