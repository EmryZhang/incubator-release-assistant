import type {
  State,
  StateResponse,
  Project,
  Release,
  CheckRun,
  Draft,
  RepoView,
} from "../../src/shared/model.js";
import "./style.css";
("use strict");
function $<T extends HTMLElement = HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("Missing UI element: " + selector);
  return element;
}
const esc = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as Record<string, string>
      )[c]!,
  );
const labels: Record<string, string> = {
  pass: "通过",
  fail: "发现问题",
  "not-run": "未执行",
  open: "待处理",
  running: "进行中",
  reported: "待审查",
  blocked: "受阻",
  done: "已审查",
  prepare: "准备",
  review: "检查与修正",
  communication: "投票与沟通",
};
const badge = (s: string) =>
  `<span class="status ${esc(s)}">${esc(labels[s] || s)}</span>`;
const date = (s: string) => new Date(s).toLocaleString("zh-CN");
const toolName = (s: string) =>
  s === "agent" ? "内置检查 + Agent 辅助" : "内置确定性检查";
let token =
  new URLSearchParams(location.hash.slice(1)).get("token") ||
  sessionStorage.getItem("isa-token") ||
  "";
if (token) sessionStorage.setItem("isa-token", token);
history.replaceState(null, "", location.pathname);
window.addEventListener("hashchange", () => {
  if (new URLSearchParams(location.hash.slice(1)).get("token"))
    location.reload();
});
let state: State, dataDir: string, view: RepoView;
let page = "projects",
  pid = "",
  rid = "",
  tab = "overview",
  busy = false;
let toastTimer: ReturnType<typeof setTimeout>;
let projectNotes = "",
  userNotes = "";
async function api<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch("/api/" + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      message = JSON.parse(text).error;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}
function toast(text: string, error = false) {
  const t = $("#toast");
  t.textContent = text;
  t.className = error ? "error" : "";
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => (t.style.display = "none"),
    error ? 9000 : 4000,
  );
}
const project = (): Project => {
  const p = state.projects.find((p) => p.id === pid);
  if (!p) throw new Error("请先选择项目");
  return p;
};
const release = (): Release => {
  const r = state.releases.find((r) => r.id === rid);
  if (!r) throw new Error("请先选择发布任务");
  return r;
};
async function load() {
  const data = await api<StateResponse>("state");
  state = data.state;
  dataDir = data.dataDir;
  if (pid) {
    const values = await Promise.all([
      api<RepoView>("project?id=" + pid),
      api<{ text: string }>("notes?projectId=" + pid),
    ]);
    view = values[0];
    projectNotes = values[1].text;
  }
  userNotes = (await api<{ text: string }>("notes")).text;
  render();
}
function button(text: string, action: string, id = "", cls = "") {
  return `<button class="${cls}" data-do="${action}" data-id="${esc(id)}">${text}</button>`;
}
function toolsOptions(selected: string, inherit = false) {
  return `${inherit ? '<option value="">沿用用户默认</option>' : ""}<option value="builtin" ${selected === "builtin" ? "selected" : ""}>内置确定性检查</option><option value="agent" ${selected === "agent" ? "selected" : ""}>内置检查 + Agent 辅助</option>`;
}
function render() {
  queueMicrotask(() => labelFields($("#app")));
  $("#app").innerHTML =
    `<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">i</div><div><strong>ISA</strong><small>APACHE RELEASE WORKSPACE</small></div></div><nav>${button('◫　项目 <span class="nav-count">' + state.projects.length + "</span>", "nav", "projects", page === "projects" ? "active" : "")}${button("↗　发布工作台", "nav", "workbench", page === "workbench" ? "active" : "")}${button("⚙　偏好与说明", "nav", "settings", page === "settings" ? "active" : "")}</nav><div class="side-foot"><p><span class="dot"></span>本地运行 · 数据由你保管</p><p>让每一次 Apache 发布，<br>都有清楚的下一步。</p><span>ISA · Node.js / TypeScript</span></div></aside><main id="main" class="main"><div class="topline"><span>工作空间 / ${page === "projects" ? "项目" : page === "settings" ? "偏好与说明" : "发布工作台"}</span><span class="pill">LOCAL · 仅本机访问</span></div>${page === "projects" ? projectsPage() : page === "settings" ? settingsPage() : workbenchPage()}</main></div>`;
}
function labelFields(root: HTMLElement) {
  root.querySelectorAll("label").forEach((label, i) => {
    const field = label.nextElementSibling;
    if (field && /^(INPUT|SELECT|TEXTAREA)$/.test(field.tagName)) {
      if (!field.id) field.id = "isa-field-" + root.id + "-" + i;
      label.htmlFor = field.id;
    }
  });
}
function projectsPage() {
  return `<div class="hero"><div><div class="eyebrow">YOUR RELEASES, IN ONE PLACE</div><h1>从一个本地项目开始</h1><p class="muted">浏览源码、协作修正、核对证据，再准备社区沟通。ISA 帮你把发布拆成可理解、可接续的步骤。</p></div>${button("＋ 添加项目", "addProject", "", "primary")}</div><div class="stats"><div class="stat"><b>${state.projects.length}</b><span>已添加的项目</span></div><div class="stat"><b>${state.releases.length}</b><span>发布任务</span></div><div class="stat"><b>${state.releases.flatMap((r) => r.jobs).filter((j) => j.status !== "done").length}</b><span>待处理 / 待审查</span></div></div>${state.projects.length ? `<div class="grid">${state.projects.map((p) => `<article class="card project"><div class="row between"><span class="badge-num">${esc(p.name[0].toUpperCase())}</span><span class="pill">${p.incubating ? "Apache 孵化中" : "项目工作区"}</span></div><h2>${esc(p.name)}</h2><span class="muted path">${esc(p.path)}</span><div class="small muted">${state.releases.filter((r) => r.projectId === p.id).length} 个发布任务 · 保留原目录</div>${button("打开项目 →", "openProject", p.id)}</article>`).join("")}</div>` : `<div class="empty"><div class="eyebrow">第一次使用 ISA</div><h2>项目不需要搬家</h2><p class="muted">添加你已经 clone 的 Git 仓库绝对路径。ISA 会读取当前分支和改动；发布记录、个人笔记和草稿保存在独立的本地数据目录。</p>${button("添加第一个项目", "addProject", "", "primary")}<div class="step-grid"><div><b>01　添加仓库</b><span class="muted">选择已有项目，查看真实 Git 状态。</span></div><div><b>02　创建发布任务</b><span class="muted">确定版本和工具，让 Agent 接续修正。</span></div><div><b>03　准备审核与沟通</b><span class="muted">核对检查证据，整理投票和回复草稿。</span></div></div></div>`}<div class="hint mt">初版提供项目管理、真实源码快照检查、Agent 任务和邮件草稿。完整 RC 的 RAT、签名、公开验证以及社区投票仍需在相应流程中完成。</div>`;
}
function workbenchPage() {
  const p = state.projects.find((p) => p.id === pid),
    r = state.releases.find((r) => r.id === rid);
  if (!p)
    return `<div class="hero"><div><h1>发布工作台</h1><p class="muted">先打开一个项目，或继续已有发布。</p></div></div>${state.releases.map((r) => `<div class="card row between"><div><h2>${esc(state.projects.find((p) => p.id === r.projectId)?.name)} · ${esc(r.version)}</h2><span class="muted">${esc(r.rc)} · ${date(r.createdAt)}</span></div>${button("继续任务 →", "openRelease", r.id)}</div>`).join("") || `<div class="empty"><h2>还没有发布任务</h2><p class="muted">先在项目页添加一个本地 Git 仓库。</p>${button("前往项目", "nav", "projects", "primary")}</div>`}`;
  return `<div class="hero"><div><div class="eyebrow">RELEASE WORKSPACE</div><h1>${esc(p.name)} ${r ? `<span class="muted">/ ${esc(r.version)}</span>` : ""}</h1><div class="mono muted">${esc(p.path)}</div></div><div class="row">${button("刷新状态", "refresh")}${button("＋ 新建发布", "createRelease", "", "primary")}</div></div><div class="row between"><div class="row"><span class="pill">${esc(view.branch)}</span><span class="mono">${esc(view.commit.slice(0, 12))}</span>${view.status ? badge("fail") : '<span class="pill">工作目录干净</span>'}</div>${
    state.releases.some((r) => r.projectId === pid)
      ? `<select id="release-select" aria-label="切换发布任务" class="release-select"><option value="">选择发布任务</option>${state.releases
          .filter((r) => r.projectId === pid)
          .map(
            (x) =>
              `<option value="${x.id}" ${x.id === rid ? "selected" : ""}>${esc(x.version)} · ${esc(x.rc)}</option>`,
          )
          .join("")}</select>`
      : ""
  }</div><div class="tabs">${[
    ["overview", "总览"],
    ["agent", "Agent 与改动"],
    ["checks", "工具链与检查"],
    ["mail", "投票与邮件"],
    ["notes", "项目说明"],
  ]
    .map(([key, label]) =>
      button(label, "tab", key, tab === key ? "active" : ""),
    )
    .join(
      "",
    )}</div>${tab === "notes" ? notesPage() : !r ? `<div class="empty"><h2>为 ${esc(p.name)} 创建第一次发布任务</h2><p class="muted">填写目标版本、选择工具链。之后可随时退出，再从同一个任务继续。</p>${button("创建发布任务", "createRelease", "", "primary")}</div>` : tab === "agent" ? agentPage(r) : tab === "checks" ? checksPage(r) : tab === "mail" ? mailPage(r) : overview(r)}`;
}
function overview(r: Release) {
  const last = r.checks.at(-1),
    unresolved = r.jobs.filter((j) => j.status !== "done");
  return `<div class="steps">${["prepare", "review", "communication"].map((s, i) => `<div class="${r.phase === s ? "current" : ""}">${i + 1}　${labels[s]}</div>`).join("")}<div>后续：正式发布与公告</div></div><div class="two"><div><section class="card"><div class="section-title"><h2>这次发布，下一步做什么</h2><span class="pill">${esc(r.rc)}</span></div><p class="muted">阶段用于整理工作，不代表 Apache 审批或检查已完成。</p><div class="task"><h3>1. 查看改动，让 Agent 处理具体问题</h3><p class="muted">${unresolved.length} 项待处理或待审查。保留原有改动，逐项解释修正理由。</p>${button("打开 Agent 与改动", "tab", "agent", "mini")}</div><div class="task"><h3>2. 为当前提交留一份检查证据</h3><p class="muted">${last ? (checkStale(last, r) ? "文件或检查设置已变化，旧检查不能证明当前状态。" : "已有检查记录；仍需处理失败和未执行项。") : "还未运行检查。先生成固定 HEAD 提交的源码快照。"}</p>${button("查看检查", "tab", "checks", "mini")}</div><div class="task"><h3>3. 起草投票，接住审查意见</h3><p class="muted">准备草稿并核实候选包链接；收到回复后关联成任务。</p>${button("打开沟通", "tab", "mail", "mini")}</div></section></div><aside><section class="card"><h2>发布设置</h2><form data-form="releaseSettings"><label>当前工作阶段</label><select name="phase">${["prepare", "review", "communication"].map((s) => `<option value="${s}" ${s === r.phase ? "selected" : ""}>${labels[s]}</option>`).join("")}</select><label>本次任务工具链</label><select name="toolchain">${toolsOptions(r.toolchain)}</select><p class="small muted mt">来源：本次发布配置。创建时继承项目设置或个人默认。</p><button class="primary">保存设置</button></form></section><div class="hint"><strong>新手提示</strong><br>一个绿色检查项只证明它描述的范围。发布投票、正式分发和公告各有独立证据，ISA 不会用一个“完成”按钮代替这些步骤。</div></aside></div>`;
}
function agentPage(r: Release) {
  return `<div class="hint">你可以使用现有的本地 Agent。先创建任务，再打开“交给 Agent”取得上下文与回报命令。ISA 不会伪装后台已启动模型；真实回报到达后点“刷新状态”查看。</div><div class="section-title"><h2>Agent 任务 <span class="muted">${r.jobs.length}</span></h2>${button("＋ 创建任务", "createJob", "", "primary")}</div>${r.jobs.map((j) => `<article class="task"><div class="row between"><div class="row"><span class="task-title">${esc(j.title)}</span>${badge(j.status)}</div><small>${date(j.createdAt)}</small></div><p class="muted">${esc(j.instructions)}</p>${j.reports.map((a) => `<div class="report"><strong>${esc(a.summary)}</strong><div class="small muted">${date(a.at)} · Agent 回报 ${a.snapshot !== view.snapshot ? "· 文件随后已变化" : ""}</div>${esc(a.evidence)}</div>`).join("")}<div class="row">${button("交给 Agent", "packet", j.id, "mini")}${j.reports.length && j.status !== "done" ? button("审查通过", "reviewJob", j.id, "mini") : ""}${j.status === "done" ? button("重新打开", "reopenJob", j.id, "mini") : ""}</div></article>`).join("") || '<div class="empty"><h3>还没有 Agent 任务</h3><p class="muted">写明需要修正什么、预期结果和验证方式。</p></div>'}<div class="section-title"><h2>真实文件差异</h2><span class="small muted">相对 HEAD · 包含暂存和未暂存改动</span></div><pre class="diff">${
    view.diff
      ? view.diff
          .split("\n")
          .map(
            (line) =>
              `<span class="${line.startsWith("+") ? "diff-add" : line.startsWith("-") ? "diff-del" : line.startsWith("@@") ? "diff-header" : ""}">${esc(line)}</span>`,
          )
          .join("\n")
      : "没有已跟踪文件的差异。未跟踪文件可在下方文件列表预览。"
  }</pre><details><summary>Git 状态与文件浏览（最多列出 4,000 个文件）</summary><pre>${esc(view.status || "工作目录干净")}</pre><div class="file-grid"><div class="file-list">${view.files.map((f) => button(esc(f), "file", f)).join("")}</div><div><h3 id="file-name">选择文件</h3><pre id="file-preview">在左侧选择文件查看内容。敏感路径、符号链接、二进制和大文件不提供预览。</pre></div></div></details>`;
}
function checkStale(c: CheckRun, r: Release) {
  return (
    c.snapshot !== view.snapshot ||
    c.toolchain !== r.toolchain ||
    c.incubating !== project().incubating
  );
}
function checksPage(r: Release) {
  const last = r.checks.at(-1);
  return `<div class="two"><div class="card"><div class="row between"><h2>当前工具链</h2><span class="pill">本次发布选择</span></div><form data-form="toolchain"><label>检查方式</label><select name="toolchain">${toolsOptions(r.toolchain)}</select><p class="muted mt">内置工具读取 Git 状态、检查差异格式，从 HEAD 归档并计算 SHA-512，核对归档中的法律文件与 Go 模块清单。</p><p class="muted">Agent 辅助在此基础上增加可接续的审查任务，由你的 Agent 提交理由和证据；模型输出保留为审查意见。</p><button>保存选择</button></form></div><div class="card"><h2>接入更多发布链路</h2><p class="muted">现有 IRA 命令继续承担 Casbin Go 的 RC 准备、签名和托管。ATR、Magpie 和其他工具尚未接入工作台，后续通过明确的适配器扩展。</p><p class="small muted">初版选择的是检查与协作方式，正式发布的端到端工具选择仍需迭代。</p></div></div><div class="section-title"><h2>检查与证据</h2>${button("运行真实检查", "runCheck", "", "primary")}</div><div class="hint">检查读取当前 Git 仓库，并在 ISA 数据目录生成固定提交的源码快照。未提交的修正不会进入归档；不会运行目标代码、签名、上传或发送邮件。</div>${last ? `${checkStale(last, r) ? '<div class="hint warning">检查后文件或检查设置已改变。这份证据仅对应当时的快照和设置，请重新运行。</div>' : ""}<div class="card"><div class="row between"><h2>最近一次检查</h2><span class="small muted">${date(last.at)}</span></div><div class="mono muted">提交 ${esc(last.commit)}<br>证据 ${esc(last.artifact)}</div>${last.findings.map((f) => `<div class="check"><div class="check-head"><strong>${esc(f.name)}</strong>${badge(f.status)}</div><div><p class="small">${esc(f.detail)}</p>${f.status !== "pass" ? button("转为 Agent 任务", "findingJob", f.name, "mini") : ""}</div></div>`).join("")}</div><details><summary>历史检查 · ${r.checks.length} 次，证据文件持续保留</summary>${r.checks.map((c) => `<div class="task"><strong>${date(c.at)}</strong><div class="mono">${esc(c.commit)}<br>${esc(c.artifact)}<br>SHA-512 ${esc(c.sha512)}</div></div>`).join("")}</details>` : '<div class="empty"><h2>还没有检查证据</h2><p class="muted">运行后会分别显示通过、发现问题、未执行，不会隐藏缺失的发布环节。</p></div>'}`;
}
function mailPage(r: Release) {
  return `<div class="hint warning">这里保存的是草稿与导入的审查意见。导出 .eml 不等于发送成功；初版没有邮箱发送连接。正式投票前请核实项目流程、真实收件人、公开候选包与验证证据。</div><div class="section-title"><h2>投票与回复草稿</h2>${button("＋ 起草投票", "voteDraft", "", "primary")}</div>${r.drafts.map((d) => `<div class="card"><div class="row between"><h3>${esc(d.subject || "未命名草稿")}</h3><span class="pill">草稿 · 未发送</span></div><p class="small muted">To: ${esc(d.to || "待填写")} · ${date(d.updatedAt)}</p><details><summary>查看正文</summary><pre>${esc(d.body)}</pre></details><div class="row">${button("编辑草稿", "editDraft", d.id, "mini")}${button("导出 .eml", "exportDraft", d.id, "mini")}</div></div>`).join("") || '<p class="muted">还没有草稿。ISA 会根据当前版本生成一份待补充的投票正文。</p>'}<div class="section-title"><h2>收到的审查意见</h2>${button("＋ 导入邮件 / 意见", "importMail")}</div>${r.mails.map((m) => `<article class="card"><h3>${esc(m.subject)}</h3><p class="small muted">${esc(m.from || "发件人未记录")} · ${date(m.at)}</p>${m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noreferrer">打开来源邮件 ↗</a>` : ""}<pre class="diff">${esc(m.body)}</pre><div class="small mono muted">Message-ID: ${esc(m.messageId || "未提供；回复线程需要手工核对")}</div><div class="row mt">${button("转为处理任务", "mailToJob", m.id, "mini")}${button("起草回复", "replyDraft", m.id, "mini")}</div></article>`).join("") || '<div class="empty"><h3>把沟通变成下一步</h3><p class="muted">粘贴收到的邮件正文，补充来源链接和 Message-ID。每条意见都可以关联 Agent 任务，再生成回复草稿。</p></div>'}`;
}
function notesPage() {
  const p = project();
  return `<div class="two"><section class="card"><h2>项目注意事项</h2><p class="muted">例如特殊模块、第三方材料、项目发布惯例。这里是项目级个人记录，不自动提交到目标仓库。</p><form data-form="projectNotes"><textarea name="text" rows="13" aria-label="项目注意事项">${esc(projectNotes)}</textarea><p class="mono small muted">${esc(dataDir)} / notes / ${esc(pid)}.md</p><button class="primary">保存项目说明</button></form></section><section class="card"><h2>项目偏好</h2><form data-form="projectSettings"><label>创建发布时默认工具链</label><select name="toolchain">${toolsOptions(p.toolchain, true)}</select><label><input type="checkbox" name="incubating" ${p.incubating ? "checked" : ""}> 项目处于 Apache 孵化阶段</label><p class="small muted">孵化项目的归档会额外检查 DISCLAIMER 是否存在。</p><button>保存项目偏好</button></form><hr class="divider"><h3>优先级与来源</h3><p class="muted">本次发布选择 → 项目默认 → 用户默认。文字注意事项保留来源，一并提供给 Agent；个人偏好不覆盖正式规则。</p><details><summary>查看用户级说明</summary><pre class="diff">${esc(userNotes || "尚未设置用户说明")}</pre></details></section></div>`;
}
function settingsPage() {
  return `<div class="hero"><div><div class="eyebrow">MAKE IT YOURS</div><h1>偏好与说明</h1><p class="muted">可读、可修改、留在本地。换一个 Agent，也能接续同一份上下文。</p></div></div><div class="two"><section class="card"><h2>个人默认设置</h2><form data-form="preferences"><label>新任务默认工具链</label><select name="toolchain">${toolsOptions(state.preferences.toolchain)}</select><label>邮件签名</label><input name="signature" value="${esc(state.preferences.signature)}" placeholder="你的公开署名"><p class="small muted">仅用于新建草稿；不会改写已有邮件。</p><button class="primary">保存偏好</button></form></section><section class="card"><h2>数据保存在这里</h2><p class="mono">${esc(dataDir)}</p><p class="muted">任务、回报、检查历史和草稿保存在 state.json；说明保存在 notes/*.md，源码快照保存在 evidence/。重启时从这些文件恢复。</p><p class="small muted">这里可能包含你的私人邮件和项目路径，请自行选择备份位置，不要提交到公共仓库。session.json 是本机 API 会话凭据。</p></section></div><section class="card"><h2>给自己和 Agent 的说明</h2><p class="muted">例如：偏好的邮件语言、审查习惯、需要额外解释的事项。适用于所有项目。</p><form data-form="userNotes"><textarea name="text" rows="8" aria-label="用户说明">${esc(userNotes)}</textarea><div class="actions"><button class="primary">保存用户说明</button></div></form></section>`;
}
function modal(title: string, body: string, form: string, submit = "保存") {
  const d = $<HTMLDialogElement>("#dialog");
  d.innerHTML = `<h2>${title}</h2><form data-form="${form}">${body}<div class="actions">${button("取消", "close")}<button class="primary">${submit}</button></div></form>`;
  labelFields(d);
  d.showModal();
}
function draftModal(d: Partial<Draft> & Pick<Draft, "kind">) {
  modal(
    d.kind === "vote" ? "投票草稿" : "回复草稿",
    `<input type="hidden" name="id" value="${esc(d.id)}"><input type="hidden" name="kind" value="${d.kind}"><input type="hidden" name="mailId" value="${esc(d.mailId)}"><label>收件人</label><input name="to" value="${esc(d.to)}" placeholder="核实项目的实际投票或回复列表"><label>主题</label><input name="subject" required value="${esc(d.subject)}"><label>正文</label><textarea name="body" rows="14">${esc(d.body)}</textarea><p class="small muted">保存后仍为草稿；占位内容必须在发送前补齐。</p>`,
    "draft",
  );
}
async function act(a: unknown) {
  const result = await api("action", a);
  await load();
  return result;
}
document.addEventListener("click", async (e) => {
  const b =
    e.target instanceof Element
      ? e.target.closest<HTMLButtonElement>("[data-do]")
      : null;
  if (!b) return;
  e.preventDefault();
  if (busy) return;
  const action = b.dataset.do,
    id = b.dataset.id || "",
    r = state.releases.find((r) => r.id === rid)!;
  try {
    if (action === "close") {
      $<HTMLDialogElement>("#dialog").close();
      return;
    }
    if (action === "nav") {
      page = id;
      render();
      return;
    }
    if (action === "tab") {
      tab = id;
      render();
      return;
    }
    if (action === "openProject") {
      pid = id;
      rid = state.releases.filter((r) => r.projectId === pid).at(-1)?.id || "";
      page = "workbench";
      tab = "overview";
      await load();
      return;
    }
    if (action === "openRelease") {
      rid = id;
      pid = release().projectId;
      page = "workbench";
      tab = "overview";
      await load();
      return;
    }
    if (action === "refresh") {
      await load();
      toast("状态已刷新");
      return;
    }
    if (action === "addProject") {
      modal(
        "添加本地 Git 项目",
        '<p class="muted">选择已有仓库的绝对路径。不会移动文件，也不会修改源码。</p><label>仓库路径</label><input name="path" required placeholder="D:\\projects\\my-apache-project"><label>显示名称（可选）</label><input name="name" placeholder="例如 Apache Casbin"><label><input type="checkbox" name="incubating" checked> Apache 孵化项目</label>',
        "addProject",
        "添加项目",
      );
      return;
    }
    if (action === "createRelease") {
      modal(
        "创建发布任务",
        `<p class="muted">项目：${esc(project().name)}。版本用于任务和草稿，初版不会自动修改项目版本文件。</p><div class="form-row"><div><label>目标版本</label><input name="version" required placeholder="例如 3.12.0-incubating"></div><div><label>候选编号</label><input name="rc" value="RC1" required></div></div><label>工具链</label><select name="toolchain">${toolsOptions(project().toolchain || state.preferences.toolchain)}</select><p class="small muted">默认来源：${project().toolchain ? "项目偏好" : "用户偏好"}。可在任务中调整。</p>`,
        "createRelease",
        "创建任务",
      );
      return;
    }
    if (
      action === "createJob" ||
      action === "findingJob" ||
      action === "mailToJob"
    ) {
      const finding = r?.checks.at(-1)?.findings.find((f) => f.name === id);
      const m = r?.mails.find((m) => m.id === id);
      modal(
        "交给 Agent 的任务",
        `<input type="hidden" name="mailId" value="${action === "mailToJob" ? id : ""}"><label>需要完成什么</label><input name="title" required value="${esc(action === "findingJob" ? "核实并处理：" + id : action === "mailToJob" ? "处理审查意见：" + (m?.subject || "") : "")}"><label>背景与验收方式</label><textarea name="instructions" rows="7" placeholder="描述要解决的问题、可修改的范围，以及如何验证">${esc(finding?.detail || "")}</textarea><p class="small muted">创建任务不会自动启动 Agent。下一步通过任务包交给你使用的 Agent。</p>`,
        "job",
        "创建任务",
      );
      return;
    }
    if (action === "packet") {
      const packet = await api(`packet?releaseId=${rid}&jobId=${id}`);
      modal(
        "交给你的 Agent",
        `<p>在 ISA 仓库启动本地 Agent，读取配套 <span class="mono">skills/isa-workbench/SKILL.md</span>，然后把下面的命令交给它。</p><label>读取任务（在 ISA 项目目录）</label><pre>${esc(`npm run isa -- api --data '${dataDir.replaceAll("'", "''")}' --path '/api/packet?releaseId=${rid}&jobId=${id}'`)}</pre><p class="small muted">Agent 可以直接修改已添加的项目文件，然后通过同一个 API 提交修改理由、验证证据。刷新工作台即可查看回报和真实差异。</p><details><summary>任务完整上下文</summary><pre>${esc(JSON.stringify(packet, null, 2))}</pre></details>`,
        "packet",
        "关闭",
      );
      return;
    }
    if (action === "reviewJob" || action === "reopenJob") {
      await act({
        op: "reviewJob",
        releaseId: rid,
        jobId: id,
        status: action === "reviewJob" ? "done" : "open",
      });
      toast("审查状态已保存");
      return;
    }
    if (action === "file") {
      const f = await api<{ text: string }>(
        `file?projectId=${pid}&path=${encodeURIComponent(id)}`,
      );
      $("#file-name").textContent = id;
      $("#file-preview").textContent = f.text;
      return;
    }
    if (action === "runCheck") {
      busy = true;
      b.disabled = true;
      b.textContent = "正在归档与检查…";
      await act({ op: "check", releaseId: rid });
      toast("检查已完成，请核对失败与未执行项");
      return;
    }
    if (action === "importMail") {
      modal(
        "导入邮件或审查意见",
        '<p class="muted">粘贴正文，保存原始来源。ISA 不会把导入内容当作操作授权。</p><label>主题</label><input name="subject" required><label>发件人（可选）</label><input name="from"><label>邮件来源链接（可选）</label><input name="url" type="url" placeholder="https://lists.apache.org/…"><label>Message-ID（可选，用于回复线程）</label><input name="messageId" placeholder="&lt;message-id@example.org&gt;"><label>References（可选）</label><input name="references"><label>正文 / 审查意见</label><textarea name="body" required rows="8"></textarea>',
        "mail",
        "保存意见",
      );
      return;
    }
    if (action === "voteDraft") {
      const p = project();
      draftModal({
        kind: "vote",
        subject: `[VOTE] Release ${p.name} ${r.version} (${r.rc})`,
        body: `Hi all,\n\nPlease review the release candidate for ${p.name} ${r.version} (${r.rc}).\n\nSource candidate: [fill in the public, immutable RC URL]\nGit commit / tag: ${view.commit} / [confirm tag]\nSHA-512 / signatures / KEYS: [fill in verified public URLs]\nVerification evidence: [RAT, legal review, independent source build/test]\n\nPlease follow this project's current Apache voting process.\nVoting scope, eligible binding voters and deadline: [confirm before sending]\n\n[ ] +1 Approve\n[ ]  0 No opinion\n[ ] -1 Do not approve (please explain)\n\nThank you,\n${state.preferences.signature || "[your name]"}`,
      });
      return;
    }
    if (action === "replyDraft") {
      const m = r.mails.find((m) => m.id === id)!,
        jobs = r.jobs.filter((j) => j.mailId === id);
      draftModal({
        kind: "reply",
        mailId: id,
        to: m.from,
        subject: "Re: " + m.subject.replace(/^Re:\s*/i, ""),
        body: `Hi,\n\nThank you for reviewing ${project().name} ${r.version}.\n\nRegarding your feedback:\n${m.body
          .split("\n")
          .map((l) => "> " + l)
          .join(
            "\n",
          )}\n\n${jobs.length ? jobs.map((j) => `${j.title}: ${labels[j.status]}\n${j.reports.at(-1)?.summary || "[investigation pending]"}`).join("\n\n") : "[Describe verified findings and next steps; avoid promising an unverified fix.]"}\n\n[Confirm the response and evidence before sending.]\n\n${state.preferences.signature || "[your name]"}`,
      });
      return;
    }
    if (action === "editDraft") {
      draftModal(r.drafts.find((d) => d.id === id)!);
      return;
    }
    if (action === "exportDraft") {
      const res = await fetch(`/api/draft?releaseId=${rid}&id=${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error(await res.text());
      const url = URL.createObjectURL(await res.blob()),
        a = document.createElement("a");
      a.href = url;
      a.download = "isa-draft.eml";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      toast("草稿已导出，尚未发送");
      return;
    }
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), true);
  } finally {
    busy = false;
    b.disabled = false;
  }
});
document.addEventListener("change", async (e) => {
  if (
    e.target instanceof HTMLSelectElement &&
    e.target.id === "release-select"
  ) {
    rid = e.target.value;
    render();
  }
});
document.addEventListener("submit", async (e) => {
  const form =
    e.target instanceof Element
      ? e.target.closest<HTMLFormElement>("[data-form]")
      : null;
  if (!form) return;
  e.preventDefault();
  if (busy) return;
  const type = form.dataset.form;
  if (type === "packet") {
    $<HTMLDialogElement>("#dialog").close();
    return;
  }
  const values = Object.fromEntries(
      [...new FormData(form)].map(([key, value]) => [key, String(value)]),
    ),
    r = state.releases.find((r) => r.id === rid)!;
  let action: unknown;
  if (type === "addProject")
    action = { op: type, ...values, incubating: values.incubating === "on" };
  if (type === "createRelease")
    action = { op: type, ...values, projectId: pid };
  if (type === "releaseSettings")
    action = { op: "updateRelease", releaseId: rid, ...values };
  if (type === "toolchain")
    action = { op: "updateRelease", releaseId: rid, phase: r.phase, ...values };
  if (type === "job")
    action = {
      op: values.mailId ? "mailToJob" : "createJob",
      releaseId: rid,
      ...values,
    };
  if (type === "mail")
    action = { op: "importMail", releaseId: rid, mail: values };
  if (type === "draft")
    action = { op: "saveDraft", releaseId: rid, draft: values };
  if (type === "preferences") action = { op: type, ...values };
  if (type === "userNotes" || type === "projectNotes")
    action = {
      op: "notes",
      projectId: type === "projectNotes" ? pid : "",
      ...values,
    };
  if (type === "projectSettings")
    action = {
      op: type,
      projectId: pid,
      ...values,
      incubating: values.incubating === "on",
    };
  if (!action) return;
  busy = true;
  toast("正在保存…");
  const submit =
    form.querySelector<HTMLButtonElement>("button.primary") ||
    form.querySelector<HTMLButtonElement>("button");
  if (submit) submit.disabled = true;
  try {
    const result = await api<{ id: string }>("action", action);
    if (type === "addProject") {
      pid = result.id;
      rid = "";
      page = "workbench";
      tab = "overview";
    }
    if (type === "createRelease") {
      rid = result.id;
      tab = "overview";
    }
    await load();
    $<HTMLDialogElement>("#dialog").close();
    toast("已保存到本地");
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), true);
  } finally {
    busy = false;
    if (submit) submit.disabled = false;
  }
});
load().catch((err) => {
  $("#app").innerHTML =
    `<main class="loading"><h1>连接本地 ISA</h1><p>${esc(err instanceof Error ? err.message : String(err))}</p><p class="muted">请从终端打开本次启动显示的完整链接（包含会话片段）。</p><button id="retry">重试连接</button></main>`;
  $("#retry").onclick = () => location.reload();
});
