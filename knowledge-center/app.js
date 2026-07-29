/**
 * 角色与权限矩阵来源：企业智库权限.xlsx
 * 数据范围：all / dept / personal / authorized
 * 系统专员（原知识专员）：全部数据 + 新建知识库等完整权限
 * 知识查看专员：可查看全部知识库，但无任何操作权限（产品特殊规则）
 */
const ROLE_DEFS = {
  系统专员: {
    code: "kb.role.admin",
    data: "all",
    perms: {
      "kb.kb.create": true,
      "kb.kb.edit": true,
      "kb.kb.delete": true,
      "kb.category.show": true,
      "kb.access.auth": true,
      "kb.edit.auth": true,
      "kb.qa.auth": true,
      "kb.dir.create": true,
      "kb.dir.edit": true,
      "kb.dir.delete": true,
      "kb.dir.category.show": true,
      "kb.dir.access.auth": true,
      "kb.dir.edit.auth": true,
      "kb.dir.qa.auth": true,
      "kb.doc.create": true,
      "kb.doc.upload": true,
      "kb.doc.batch.delete": true,
      "kb.doc.preview": true,
      "kb.doc.download": true,
      "kb.doc.delete": true,
      "kb.doc.log": true,
      "kb.doc.access.auth": true,
    },
  },
  部门数智化专员: {
    code: "kb.role.dept_admin",
    data: "dept",
    perms: {
      "kb.kb.create": false,
      "kb.kb.edit": true,
      "kb.kb.delete": true, // ✓- 受限，演示按有权限处理
      "kb.category.show": true,
      "kb.access.auth": true,
      "kb.edit.auth": true,
      "kb.qa.auth": true,
      "kb.dir.create": true,
      "kb.dir.edit": true,
      "kb.dir.delete": true,
      "kb.dir.category.show": true,
      "kb.dir.access.auth": true,
      "kb.dir.edit.auth": true,
      "kb.dir.qa.auth": true,
      "kb.doc.create": true,
      "kb.doc.upload": true,
      "kb.doc.batch.delete": true,
      "kb.doc.preview": true,
      "kb.doc.download": true,
      "kb.doc.delete": false,
      "kb.doc.log": true,
      "kb.doc.access.auth": true,
    },
  },
  知识维护者: {
    code: "kb.role.dept_edit",
    data: "personal",
    perms: {
      "kb.kb.create": false,
      "kb.kb.edit": true,
      "kb.kb.delete": false,
      "kb.category.show": true,
      "kb.access.auth": false,
      "kb.edit.auth": false,
      "kb.qa.auth": false,
      "kb.dir.create": true,
      "kb.dir.edit": true,
      "kb.dir.delete": false,
      "kb.dir.category.show": true,
      "kb.dir.access.auth": false,
      "kb.dir.edit.auth": false,
      "kb.dir.qa.auth": false,
      "kb.doc.create": true,
      "kb.doc.upload": true,
      "kb.doc.batch.delete": true,
      "kb.doc.preview": true,
      "kb.doc.download": true,
      "kb.doc.delete": true,
      "kb.doc.log": true,
      "kb.doc.access.auth": false,
    },
  },
  知识使用者: {
    code: "kb.role.user",
    data: "authorized",
    perms: {
      "kb.kb.create": false,
      "kb.kb.edit": false,
      "kb.kb.delete": false,
      "kb.category.show": true,
      "kb.access.auth": false,
      "kb.edit.auth": false,
      "kb.qa.auth": false,
      "kb.dir.create": false,
      "kb.dir.edit": false,
      "kb.dir.delete": false,
      "kb.dir.category.show": true,
      "kb.dir.access.auth": false,
      "kb.dir.edit.auth": false,
      "kb.dir.qa.auth": false,
      "kb.doc.create": false,
      "kb.doc.upload": false,
      "kb.doc.batch.delete": false,
      "kb.doc.preview": true,
      "kb.doc.download": true,
      "kb.doc.delete": false,
      "kb.doc.log": true,
      "kb.doc.access.auth": false,
    },
  },
  知识查看专员: {
    code: "kb.role.dept_manager",
    data: "all", // 特殊：可查看全部知识库
    viewOnly: true, // 无任何操作权限
    perms: {
      "kb.kb.create": false,
      "kb.kb.edit": false,
      "kb.kb.delete": false,
      "kb.category.show": false,
      "kb.access.auth": false,
      "kb.edit.auth": false,
      "kb.qa.auth": false,
      "kb.dir.create": false,
      "kb.dir.edit": false,
      "kb.dir.delete": false,
      "kb.dir.category.show": false,
      "kb.dir.access.auth": false,
      "kb.dir.edit.auth": false,
      "kb.dir.qa.auth": false,
      "kb.doc.create": false,
      "kb.doc.upload": false,
      "kb.doc.batch.delete": false,
      "kb.doc.preview": false,
      "kb.doc.download": false,
      "kb.doc.delete": false,
      "kb.doc.log": false,
      "kb.doc.access.auth": false,
    },
  },
};

let currentRoleName = "系统专员";

function getRole() {
  return ROLE_DEFS[currentRoleName] || ROLE_DEFS["系统专员"];
}

function can(perm) {
  return !!getRole().perms[perm];
}

function getVisibleKnowledgeBases() {
  const role = getRole();
  if (role.data === "all") return KNOWLEDGE_BASES;
  return KNOWLEDGE_BASES.filter((kb) => {
    // 部门数智化专员：仅本部门知识库
    if (role.data === "dept") return !!kb.scope.dept;
    // 知识维护者：个人维护 + 被授权
    if (role.data === "personal") return !!(kb.scope.personal || kb.scope.authorized);
    // 知识使用者：仅被授权
    if (role.data === "authorized") return !!kb.scope.authorized;
    return false;
  });
}

const KNOWLEDGE_BASES = [
  { name: "数字化运营部", desc: "数字化运营部部门内部知识库", count: 21, cover: "cover-wave", scope: { dept: true, personal: false, authorized: false } },
  { name: "OA", desc: "", count: 9807, cover: "cover-yellow", scope: { dept: true, personal: false, authorized: true } },
  { name: "BCP文档中心", desc: "", count: 6753, cover: "cover-sky", scope: { dept: true, personal: false, authorized: true } },
  { name: "DCP知识库", desc: "天翼云数据中台 业务说明文档...", count: 87, cover: "cover-blue-doc", scope: { dept: true, personal: false, authorized: false } },
  { name: "天翼云官网", desc: "天翼云官网知识库", count: 0, cover: "cover-green", scope: { dept: false, personal: true, authorized: false } },
  { name: "天翼云产品库", desc: "天翼云产品库", count: 0, cover: "cover-teal", scope: { dept: false, personal: true, authorized: false } },
  { name: "天翼云简历库", desc: "人岗匹配-简历库", count: 155666, cover: "cover-orange", scope: { dept: false, personal: false, authorized: true } },
  { name: "政企客户中心", desc: "政企客户中心知识库", count: 0, cover: "cover-purple", scope: { dept: false, personal: false, authorized: true } },
  { name: "数智产品事业部", desc: "数智产品事业部知识库", count: 0, cover: "cover-pink", scope: { dept: false, personal: false, authorized: true } },
  { name: "云网产品事业部", desc: "云网产品事业部知识库", count: 0, cover: "cover-mint", scope: { dept: false, personal: false, authorized: true } },
  { name: "云网运营部", desc: "云网运营部知识库", count: 0, cover: "cover-slate", scope: { dept: false, personal: false, authorized: false } },
  { name: "云网发展部", desc: "云网发展部知识库", count: 0, cover: "cover-coral", scope: { dept: false, personal: false, authorized: false } },
  { name: "招投标工具库", desc: "", count: 0, cover: "cover-ink", scope: { dept: true, personal: false, authorized: false } },
  { name: "IT质量分析知识库", desc: "", count: 79, cover: "cover-daisy", scope: { dept: true, personal: false, authorized: false } },
  { name: "客户服务部", desc: "客户服务部知识库", count: 0, cover: "cover-indigo", scope: { dept: false, personal: true, authorized: false } },
  { name: "云电脑产品部", desc: "云电脑产品部知识库", count: 0, cover: "cover-lime", scope: { dept: false, personal: false, authorized: true } },
  { name: "安全产品部", desc: "安全产品部知识库", count: 0, cover: "cover-rose", scope: { dept: false, personal: true, authorized: false } },
  { name: "端云平台事业部", desc: "", count: 0, cover: "cover-sage", scope: { dept: false, personal: false, authorized: false } },
];

const ACTION_ICONS = {
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`,
  view: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  qa: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>`,
  download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  folder: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>`,
};

const DEFAULT_DIR_TREE = [
  {
    name: "数字化运营部",
    children: ["xs数据", "xs文档", "资产元数据", "数据运营中心"],
  },
  {
    name: "翼析",
    children: ["test", "业务术语", "SQL数据集"],
  },
];

/** @type {Record<string, Array<{name: string, children: string[]}>>} */
const dirTreeStore = {};

function cloneTree(tree) {
  return tree.map((g) => ({ name: g.name, children: [...g.children] }));
}

function getDirTreeForKb(kbName) {
  if (!dirTreeStore[kbName]) {
    dirTreeStore[kbName] =
      kbName === "数字化运营部"
        ? cloneTree(DEFAULT_DIR_TREE)
        : [{ name: kbName, children: ["默认目录", "文档资料", "数据资产"] }];
  }
  return dirTreeStore[kbName];
}

function getParentDirOptions() {
  if (!currentKb) return [];
  const tree = getDirTreeForKb(currentKb.name);
  const options = [{ value: "__root__", label: currentKb.name }];
  tree.forEach((group) => {
    options.push({ value: group.name, label: `${currentKb.name} / ${group.name}` });
  });
  return options;
}

const DOCUMENTS = [
  { title: "产品订购量top100.xlsx", author: "徐攀登", duration: "222.04s", status: "success", createdAt: "2026-07-22 17:47:08" },
  { title: "BCP系统已加载云产品数据.xlsx", author: "徐攀登", duration: "18.83s", status: "success", createdAt: "2026-07-22 17:46:17" },
  { title: "2026年巡视提供资料-数字化运营部.xlsx", author: "徐攀登", duration: "1秒", status: "fail", createdAt: "2026-07-22 17:41:54" },
  { title: "2025年云电脑订购量排名.xlsx", author: "徐攀登", duration: "13.48s", status: "success", createdAt: "2026-07-22 17:40:59" },
  { title: "云电脑订购量top100.xlsx", author: "徐攀登", duration: "15.06s", status: "success", createdAt: "2026-07-22 17:36:55" },
  { title: "2025年巡视提供资料.xlsx", author: "陈文强", duration: "1秒", status: "success", createdAt: "2026-05-21 14:52:39" },
  { title: "产品订购量明细表.xlsx", author: "陈文强", duration: "1秒", status: "success", createdAt: "2026-05-21 14:52:39" },
  { title: "运营指标月度汇总.xlsx", author: "陈文强", duration: "1秒", status: "success", createdAt: "2026-05-21 14:52:39" },
  { title: "客户活跃度分析报告.xlsx", author: "陈文强", duration: "1秒", status: "success", createdAt: "2026-05-21 14:52:39" },
  { title: "云资源使用统计.xlsx", author: "徐攀登", duration: "8.21s", status: "success", createdAt: "2026-05-18 10:12:03" },
  { title: "政企客户清单.xlsx", author: "徐攀登", duration: "25.40s", status: "success", createdAt: "2026-05-18 09:55:11" },
  { title: "数智产品发布计划.docx", author: "陈文强", duration: "3.12s", status: "success", createdAt: "2026-05-10 16:20:44" },
  { title: "数据质量巡检结果.xlsx", author: "徐攀登", duration: "41.67s", status: "fail", createdAt: "2026-05-09 11:08:22" },
  { title: "知识库建设规范.pdf", author: "陈文强", duration: "6.90s", status: "success", createdAt: "2026-04-28 15:33:01" },
  { title: "SQL数据集说明文档.md", author: "徐攀登", duration: "2.05s", status: "success", createdAt: "2026-04-22 09:14:50" },
  { title: "业务术语字典.xlsx", author: "陈文强", duration: "11.33s", status: "success", createdAt: "2026-04-15 18:02:17" },
  { title: "资产元数据清单.xlsx", author: "徐攀登", duration: "19.88s", status: "success", createdAt: "2026-04-10 13:27:39" },
  { title: "翼析平台操作手册.pdf", author: "陈文强", duration: "7.54s", status: "success", createdAt: "2026-03-28 10:41:05" },
  { title: "数据运营周报-第12周.xlsx", author: "徐攀登", duration: "4.16s", status: "success", createdAt: "2026-03-20 17:09:28" },
  { title: "测试上传样例.csv", author: "陈文强", duration: "1秒", status: "success", createdAt: "2026-03-12 08:55:46" },
];

/* ===== DOM ===== */
const listView = document.getElementById("listView");
const detailView = document.getElementById("detailView");
const grid = document.getElementById("kbGrid");
const searchInput = document.getElementById("kbSearch");
const tabs = document.querySelectorAll(".kb-tab");
const detailKbName = document.getElementById("detailKbName");
const dirTree = document.getElementById("dirTree");
const dirSearch = document.getElementById("dirSearch");
const titleFilter = document.getElementById("titleFilter");
const docTableBody = document.getElementById("docTableBody");
const pageTotal = document.getElementById("pageTotal");
const pageSizeSelect = document.getElementById("pageSize");

let currentKb = null;
let currentDir = "xs数据";
let filteredDocs = [...DOCUMENTS];
let pageSize = 20;

function formatCount(n) {
  return Number(n).toLocaleString("zh-CN");
}

/* ===== List view ===== */
function createCard(item) {
  const card = document.createElement("article");
  card.className = "kb-card";
  card.dataset.name = item.name;
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.setAttribute("aria-label", `进入「${item.name}」知识库`);

  const kbActions = [
    { tip: "编辑", perm: "kb.kb.edit", action: "kb-edit", icon: ACTION_ICONS.edit, danger: false },
    { tip: "删除", perm: "kb.kb.delete", action: "kb-delete", icon: ACTION_ICONS.delete, danger: true },
    { tip: "显示/隐藏分类", perm: "kb.category.show", action: "kb-category", icon: ACTION_ICONS.view, danger: false },
    { tip: "查看权限", perm: "kb.access.auth", action: "view-perm", icon: ACTION_ICONS.lock, danger: false },
    { tip: "编辑权限", perm: "kb.edit.auth", action: "edit-perm", icon: ACTION_ICONS.settings, danger: false },
    { tip: "问答权限", perm: "kb.qa.auth", action: "qa-perm", icon: ACTION_ICONS.qa, danger: false },
  ].filter((a) => can(a.perm));

  const actionsHtml = kbActions.length
    ? `<div class="kb-card-actions">${kbActions
        .map(
          (a) =>
            `<button type="button" class="kb-action${a.danger ? " danger" : ""}" data-action="${a.action}" data-tip="${a.tip}" title="${a.tip}" aria-label="${a.tip}">${a.icon}</button>`
        )
        .join("")}</div>`
    : "";

  if (!kbActions.length) card.classList.add("kb-card--readonly");

  card.innerHTML = `
    <div class="kb-card-cover ${item.cover}">
      <h3 class="kb-card-title">${item.name}</h3>
      ${item.desc ? `<p class="kb-card-desc">${item.desc}</p>` : ""}
      <span class="kb-card-count">知识数量: ${formatCount(item.count)}</span>
    </div>
    ${actionsHtml}
  `;

  card.querySelectorAll(".kb-action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === "view-perm" || action === "edit-perm" || action === "qa-perm") {
        openPermModal(action, { type: "kb", name: item.name });
      } else if (action === "kb-delete") {
        if (confirm(`确定删除知识库「${item.name}」吗？`)) {
          alert(`已删除：${item.name}（演示）`);
        }
      } else if (action === "kb-edit") {
        alert(`编辑知识库：${item.name}（演示）`);
      } else if (action === "kb-category") {
        alert(`显示/隐藏分类：${item.name}（演示）`);
      }
    });
  });

  card.addEventListener("click", () => openKbDetail(item));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openKbDetail(item);
    }
  });

  return card;
}

function renderList(list) {
  grid.innerHTML = "";
  if (!list.length) {
    grid.innerHTML = `<div class="kb-empty">当前角色下暂无可见知识库</div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach((item) => frag.appendChild(createCard(item)));
  grid.appendChild(frag);
}

function filterAndRender() {
  const q = searchInput.value.trim().toLowerCase();
  const base = getVisibleKnowledgeBases();
  const filtered = !q
    ? base
    : base.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.desc || "").toLowerCase().includes(q)
      );
  renderList(filtered);
}

function setPermVisible(el, visible) {
  if (!el) return;
  el.classList.toggle("perm-hidden", !visible);
  el.hidden = !visible;
}

function applyRoleUI() {
  setPermVisible(document.getElementById("btnCreateKb"), can("kb.kb.create"));
  setPermVisible(document.getElementById("btnAddDir"), can("kb.dir.create"));
  setPermVisible(document.getElementById("btnCreate"), can("kb.doc.create"));
  setPermVisible(document.getElementById("btnUpload"), can("kb.doc.upload"));
  setPermVisible(document.getElementById("btnBatchDelete"), can("kb.doc.batch.delete"));

  // 目录菜单项按权限显隐
  document.querySelectorAll("#dirCtxMenu [data-action]").forEach((btn) => {
    const map = {
      edit: "kb.dir.edit",
      delete: "kb.dir.delete",
      "toggle-category": "kb.dir.category.show",
      "view-perm": "kb.dir.access.auth",
      "edit-perm": "kb.dir.edit.auth",
      "qa-perm": "kb.dir.qa.auth",
      "add-child": "kb.dir.create",
    };
    const perm = map[btn.dataset.action];
    setPermVisible(btn, !perm || can(perm));
  });

  document.body.dataset.role = currentRoleName;
  document.body.classList.toggle("role-view-only", !!getRole().viewOnly);
}

searchInput.addEventListener("input", filterAndRender);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });
    filterAndRender();
  });
});

/* ===== Role switch ===== */
const roleSwitch = document.getElementById("roleSwitch");
const roleSwitchBtn = document.getElementById("roleSwitchBtn");
const roleSwitchMenu = document.getElementById("roleSwitchMenu");
const roleSwitchValue = document.getElementById("roleSwitchValue");
const roleOptions = roleSwitchMenu.querySelectorAll(".role-option");

function setRoleMenuOpen(open) {
  roleSwitch.classList.toggle("open", open);
  roleSwitchBtn.setAttribute("aria-expanded", open ? "true" : "false");
  roleSwitchMenu.hidden = !open;
}

function selectRole(option) {
  currentRoleName = option.dataset.role;
  roleSwitchValue.textContent = currentRoleName;
  roleOptions.forEach((item) => {
    const active = item === option;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });
  setRoleMenuOpen(false);
  applyRoleUI();
  filterAndRender();

  // 若当前打开的知识库对新角色不可见，返回列表
  if (currentKb && !getVisibleKnowledgeBases().some((k) => k.name === currentKb.name)) {
    closeKbDetail();
  } else if (currentKb) {
    renderDirTree(getDirTreeForKb(currentKb.name));
    renderDocTable();
  }
}

roleSwitchBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setRoleMenuOpen(roleSwitchMenu.hidden);
});

roleOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    selectRole(option);
  });
});

document.addEventListener("click", (e) => {
  if (!roleSwitch.contains(e.target)) setRoleMenuOpen(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setRoleMenuOpen(false);
    if (!detailView.classList.contains("hidden")) {
      if (!createPanel.classList.contains("hidden") || !uploadPanel.classList.contains("hidden")) {
        showDetailList();
      } else {
        closeKbDetail();
      }
    }
  }
});

/* ===== Detail view ===== */
const detailListPanel = document.getElementById("detailListPanel");
const createPanel = document.getElementById("createPanel");
const uploadPanel = document.getElementById("uploadPanel");
const createTitle = document.getElementById("createTitle");
const createDir = document.getElementById("createDir");
const createBatchDir = document.getElementById("createBatchDir");
const createBody = document.getElementById("createBody");
const createSingleFields = document.getElementById("createSingleFields");
const createBatchFields = document.getElementById("createBatchFields");
const createBatchFile = document.getElementById("createBatchFile");
const createBatchFileList = document.getElementById("createBatchFileList");
const uploadTitle = document.getElementById("uploadTitle");
const uploadDir = document.getElementById("uploadDir");
const uploadFile = document.getElementById("uploadFile");
const uploadFileList = document.getElementById("uploadFileList");
const uploadTitleField = document.getElementById("uploadTitleField");

function collectDirOptions() {
  if (!currentKb) return [];
  const tree = getDirTreeForKb(currentKb.name);
  const options = [];
  tree.forEach((group) => {
    group.children.forEach((name) => options.push(name));
  });
  return options.length ? options : [currentKb.name];
}

function fillDirSelect(selectEl, preferred) {
  const options = collectDirOptions();
  const value = preferred && options.includes(preferred) ? preferred : options[0] || "";
  selectEl.innerHTML = `<option value="" disabled>所属目录</option>` +
    options.map((name) => `<option value="${name}">${name}</option>`).join("");
  if (value) {
    selectEl.value = value;
    selectEl.classList.add("has-value");
  }
}

function showDetailList() {
  createPanel.classList.add("hidden");
  uploadPanel.classList.add("hidden");
  detailListPanel.classList.remove("hidden");
  if (currentKb) document.title = `${currentKb.name} - 知识库`;
}

function openCreatePanel() {
  detailListPanel.classList.add("hidden");
  uploadPanel.classList.add("hidden");
  createPanel.classList.remove("hidden");
  document.querySelector('input[name="createMode"][value="single"]').checked = true;
  createSingleFields.classList.remove("hidden");
  createBatchFields.classList.add("hidden");
  createTitle.value = "";
  createBody.innerHTML = "";
  createBatchFile.value = "";
  createBatchFileList.innerHTML = "";
  fillDirSelect(createDir, currentDir);
  fillDirSelect(createBatchDir, currentDir);
  document.title = `新建文章 - ${currentKb?.name || ""}`;
}

function openUploadPanel() {
  detailListPanel.classList.add("hidden");
  createPanel.classList.add("hidden");
  uploadPanel.classList.remove("hidden");
  document.querySelector('input[name="uploadMode"][value="single"]').checked = true;
  uploadFile.multiple = false;
  uploadTitleField.classList.remove("hidden");
  uploadTitle.value = "";
  uploadFile.value = "";
  uploadFileList.innerHTML = "";
  fillDirSelect(uploadDir, currentDir);
  document.title = `上传文档 - ${currentKb?.name || ""}`;
}

function renderFileList(listEl, files) {
  listEl.innerHTML = Array.from(files)
    .map(
      (file, i) => `
      <li>
        <span>${file.name} <span style="color:#999">(${(file.size / 1024).toFixed(1)} KB)</span></span>
        <button type="button" class="file-remove" data-index="${i}">移除</button>
      </li>`
    )
    .join("");
}

function openKbDetail(item) {
  currentKb = item;
  detailKbName.textContent = item.name;
  const tree = getDirTreeForKb(item.name);
  currentDir = tree[0]?.children?.[0] || item.name;
  titleFilter.value = "";
  dirSearch.value = "";
  filteredDocs = [...DOCUMENTS];
  renderDirTree(tree);
  renderDocTable();
  showDetailList();
  listView.classList.add("hidden");
  detailView.classList.remove("hidden");
  document.title = `${item.name} - 知识库`;
}

function closeKbDetail() {
  showDetailList();
  detailView.classList.add("hidden");
  listView.classList.remove("hidden");
  document.title = "企业专属智库 - 知识中心";
  currentKb = null;
}

function renderDirTree(tree) {
  const q = dirSearch.value.trim().toLowerCase();
  dirTree.innerHTML = "";
  closeDirCtxMenu();

  const dirMenuActions = [
    "kb.dir.edit",
    "kb.dir.delete",
    "kb.dir.category.show",
    "kb.dir.access.auth",
    "kb.dir.edit.auth",
    "kb.dir.qa.auth",
    "kb.dir.create",
  ];
  const showDirMore = dirMenuActions.some((p) => can(p));

  tree.forEach((group) => {
    const children = group.children.filter((name) => !q || name.toLowerCase().includes(q) || group.name.toLowerCase().includes(q));
    if (q && !children.length && !group.name.toLowerCase().includes(q)) return;

    const moreHtml = showDirMore
      ? `<span class="dir-item-more" title="更多" role="button" tabindex="0" aria-label="更多">⋯</span>`
      : "";

    const groupEl = document.createElement("div");
    groupEl.className = "dir-group";
    groupEl.innerHTML = `
      <div class="dir-folder" role="button" tabindex="0">
        <svg class="dir-folder-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        <span class="dir-folder-icon">${ACTION_ICONS.folder}</span>
        <span class="dir-folder-name">${group.name}</span>
        ${moreHtml}
      </div>
      <div class="dir-children"></div>
    `;

    const folderBtn = groupEl.querySelector(".dir-folder");
    const childrenEl = groupEl.querySelector(".dir-children");
    const folderMore = groupEl.querySelector(".dir-item-more");

    folderBtn.addEventListener("click", (e) => {
      if (e.target.closest(".dir-item-more")) return;
      groupEl.classList.toggle("collapsed");
    });
    folderBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!e.target.closest(".dir-item-more")) groupEl.classList.toggle("collapsed");
      }
    });

    folderMore?.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      openDirCtxMenu(folderMore, { type: "folder", name: group.name, groupName: group.name });
    });

    (q ? children : group.children).forEach((name) => {
      const itemBtn = document.createElement("div");
      itemBtn.className = `dir-item${name === currentDir ? " active" : ""}`;
      itemBtn.setAttribute("role", "button");
      itemBtn.tabIndex = 0;
      itemBtn.innerHTML = `
        <span class="dir-item-name">${name}</span>
        ${moreHtml}
      `;
      const moreBtn = itemBtn.querySelector(".dir-item-more");
      moreBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        openDirCtxMenu(moreBtn, { type: "item", name, groupName: group.name });
      });
      const selectItem = () => {
        currentDir = name;
        dirTree.querySelectorAll(".dir-item").forEach((el) => el.classList.remove("active"));
        itemBtn.classList.add("active");
        filteredDocs = [...DOCUMENTS];
        titleFilter.value = "";
        renderDocTable();
        showDetailList();
      };
      itemBtn.addEventListener("click", (e) => {
        if (e.target.closest(".dir-item-more")) return;
        selectItem();
      });
      itemBtn.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && !e.target.closest(".dir-item-more")) {
          e.preventDefault();
          selectItem();
        }
      });
      childrenEl.appendChild(itemBtn);
    });

    dirTree.appendChild(groupEl);
  });
}

function renderDocTable() {
  const docs = filteredDocs.slice(0, pageSize);
  pageTotal.textContent = `共 ${filteredDocs.length} 条`;
  const docActions = [
    { tip: "下载", perm: "kb.doc.download", action: "doc-download", icon: ACTION_ICONS.download, danger: false },
    { tip: "删除", perm: "kb.doc.delete", action: "doc-delete", icon: ACTION_ICONS.delete, danger: true },
    { tip: "预览", perm: "kb.doc.preview", action: "doc-preview", icon: ACTION_ICONS.view, danger: false },
    { tip: "查看权限", perm: "kb.doc.access.auth", action: "view-perm", icon: ACTION_ICONS.lock, danger: false },
    { tip: "日志", perm: "kb.doc.log", action: "doc-log", icon: ACTION_ICONS.file, danger: false },
  ].filter((a) => can(a.perm));

  docTableBody.innerHTML = docs
    .map(
      (doc, i) => `
      <tr data-doc-title="${doc.title}">
        <td>${i + 1}</td>
        <td class="td-title" title="${doc.title}">${doc.title}</td>
        <td>${doc.author}</td>
        <td>${doc.duration}</td>
        <td>
          <span class="status-tag ${doc.status === "success" ? "success" : "fail"}">
            ${doc.status === "success" ? "解析成功" : "解析失败"}
          </span>
        </td>
        <td>${doc.createdAt}</td>
        <td>
          <div class="row-actions">
            ${docActions
              .map(
                (a) =>
                  `<button type="button" class="row-action${a.danger ? " danger" : ""}" data-action="${a.action}" data-tip="${a.tip}" title="${a.tip}" aria-label="${a.tip}">${a.icon}</button>`
              )
              .join("")}
            ${docActions.length ? "" : `<span class="row-actions-empty">—</span>`}
          </div>
        </td>
      </tr>
    `
    )
    .join("");

  docTableBody.querySelectorAll(".row-action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const title = btn.closest("tr")?.dataset.docTitle || "文档";
      if (action === "view-perm" || action === "edit-perm" || action === "qa-perm") {
        openPermModal(action, { type: "doc", name: title });
      } else if (action === "doc-delete") {
        if (confirm(`确定删除「${title}」吗？`)) alert(`已删除：${title}（演示）`);
      } else {
        alert(`${btn.getAttribute("aria-label")}：${title}（演示）`);
      }
    });
  });
}

function applyTitleFilter() {
  const q = titleFilter.value.trim().toLowerCase();
  filteredDocs = !q
    ? [...DOCUMENTS]
    : DOCUMENTS.filter((d) => d.title.toLowerCase().includes(q));
  renderDocTable();
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function saveCreate() {
  const mode = document.querySelector('input[name="createMode"]:checked')?.value;
  if (mode === "batch") {
    if (!createBatchFile.files.length) {
      alert("请选择要导入的文件");
      return;
    }
    Array.from(createBatchFile.files).forEach((file) => {
      DOCUMENTS.unshift({
        title: file.name,
        author: "段磊",
        duration: "1秒",
        status: "success",
        createdAt: nowStamp(),
      });
    });
  } else {
    const title = createTitle.value.trim();
    if (!title) {
      alert("请输入标题");
      createTitle.focus();
      return;
    }
    DOCUMENTS.unshift({
      title,
      author: "段磊",
      duration: "1秒",
      status: "success",
      createdAt: nowStamp(),
    });
  }
  filteredDocs = [...DOCUMENTS];
  renderDocTable();
  showDetailList();
}

function saveUpload() {
  if (!uploadFile.files.length) {
    alert("请选择附件");
    return;
  }
  const mode = document.querySelector('input[name="uploadMode"]:checked')?.value;
  if (mode === "single") {
    const title = uploadTitle.value.trim() || uploadFile.files[0].name;
    DOCUMENTS.unshift({
      title,
      author: "段磊",
      duration: "1秒",
      status: "success",
      createdAt: nowStamp(),
    });
  } else {
    Array.from(uploadFile.files).forEach((file) => {
      DOCUMENTS.unshift({
        title: file.name,
        author: "段磊",
        duration: "1秒",
        status: "success",
        createdAt: nowStamp(),
      });
    });
  }
  filteredDocs = [...DOCUMENTS];
  renderDocTable();
  showDetailList();
}

document.getElementById("backToList").addEventListener("click", () => {
  if (!createPanel.classList.contains("hidden") || !uploadPanel.classList.contains("hidden")) {
    showDetailList();
    return;
  }
  closeKbDetail();
});

dirSearch.addEventListener("input", () => {
  if (currentKb) renderDirTree(getDirTreeForKb(currentKb.name));
});

document.getElementById("btnQuery").addEventListener("click", applyTitleFilter);
document.getElementById("btnReset").addEventListener("click", () => {
  titleFilter.value = "";
  filteredDocs = [...DOCUMENTS];
  renderDocTable();
});

titleFilter.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyTitleFilter();
});

document.getElementById("btnRefresh").addEventListener("click", () => {
  filteredDocs = [...DOCUMENTS];
  titleFilter.value = "";
  renderDocTable();
});

pageSizeSelect.addEventListener("change", () => {
  pageSize = Number(pageSizeSelect.value) || 20;
  renderDocTable();
});

document.getElementById("btnCreate").addEventListener("click", openCreatePanel);
document.getElementById("btnUpload").addEventListener("click", openUploadPanel);

document.querySelectorAll(".form-back").forEach((btn) => {
  btn.addEventListener("click", showDetailList);
});

document.querySelectorAll('input[name="createMode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const batch = radio.value === "batch" && radio.checked;
    createSingleFields.classList.toggle("hidden", batch);
    createBatchFields.classList.toggle("hidden", !batch);
  });
});

document.querySelectorAll('input[name="uploadMode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!radio.checked) return;
    const batch = radio.value === "batch";
    uploadFile.multiple = batch;
    uploadTitleField.classList.toggle("hidden", batch);
    uploadFile.value = "";
    uploadFileList.innerHTML = "";
  });
});

document.getElementById("btnCreateBatchPick").addEventListener("click", () => createBatchFile.click());
createBatchFile.addEventListener("change", () => renderFileList(createBatchFileList, createBatchFile.files));
createBatchFileList.addEventListener("click", (e) => {
  if (e.target.classList.contains("file-remove")) {
    createBatchFile.value = "";
    createBatchFileList.innerHTML = "";
  }
});

document.getElementById("btnUploadPick").addEventListener("click", () => uploadFile.click());
uploadFile.addEventListener("change", () => {
  renderFileList(uploadFileList, uploadFile.files);
  if (uploadFile.files[0] && !uploadTitle.value) {
    uploadTitle.value = uploadFile.files[0].name.replace(/\.[^.]+$/, "");
  }
});
uploadFileList.addEventListener("click", (e) => {
  if (e.target.classList.contains("file-remove")) {
    uploadFile.value = "";
    uploadFileList.innerHTML = "";
  }
});

document.getElementById("btnSaveCreate").addEventListener("click", saveCreate);
document.getElementById("btnSaveUpload").addEventListener("click", saveUpload);

[createDir, createBatchDir, uploadDir].forEach((sel) => {
  sel.addEventListener("change", () => {
    sel.classList.toggle("has-value", Boolean(sel.value));
  });
});

/* ===== 新建知识目录弹窗 ===== */
const dirModal = document.getElementById("dirModal");
const dirNameInput = document.getElementById("dirNameInput");
const dirParentSelect = document.getElementById("dirParentSelect");
const dirDescInput = document.getElementById("dirDescInput");
const dirSortInput = document.getElementById("dirSortInput");

function openDirModal(preferredParent) {
  if (!currentKb) return;
  const options = getParentDirOptions();
  dirParentSelect.innerHTML =
    `<option value="" disabled>请选择上级目录</option>` +
    options.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");

  let preferred = preferredParent;
  if (!preferred) {
    const tree = getDirTreeForKb(currentKb.name);
    const parentGroup = tree.find((g) => g.children.includes(currentDir) || g.name === currentDir);
    preferred = parentGroup?.name || options[0]?.value || "";
  }
  if (preferred) {
    dirParentSelect.value = preferred;
    dirParentSelect.classList.add("has-value");
  }

  dirNameInput.value = "";
  dirDescInput.value = "";
  dirSortInput.value = "100";
  dirModal.classList.remove("hidden");
  dirNameInput.focus();
}

function closeDirModal() {
  dirModal.classList.add("hidden");
}

function confirmCreateDir() {
  const name = dirNameInput.value.trim();
  const parent = dirParentSelect.value;
  if (!name) {
    alert("请输入目录名称");
    dirNameInput.focus();
    return;
  }
  if (!parent) {
    alert("请选择上级目录");
    return;
  }

  const tree = getDirTreeForKb(currentKb.name);
  if (parent === "__root__") {
    if (tree.some((g) => g.name === name)) {
      alert("该目录已存在");
      return;
    }
    tree.push({ name, children: [] });
  } else {
    const group = tree.find((g) => g.name === parent);
    if (!group) {
      alert("上级目录不存在");
      return;
    }
    if (group.children.includes(name)) {
      alert("该目录已存在");
      return;
    }
    group.children.push(name);
  }

  currentDir = name;
  renderDirTree(tree);
  closeDirModal();
}

document.getElementById("btnAddDir").addEventListener("click", openDirModal);
document.getElementById("dirModalClose").addEventListener("click", closeDirModal);
document.getElementById("dirModalCancel").addEventListener("click", closeDirModal);
document.getElementById("dirModalConfirm").addEventListener("click", confirmCreateDir);

document.getElementById("dirSortUp").addEventListener("click", () => {
  dirSortInput.value = String(Number(dirSortInput.value || 0) + 1);
});
document.getElementById("dirSortDown").addEventListener("click", () => {
  dirSortInput.value = String(Math.max(0, Number(dirSortInput.value || 0) - 1));
});

dirModal.addEventListener("click", (e) => {
  if (e.target === dirModal) closeDirModal();
});

dirNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmCreateDir();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !dirModal.classList.contains("hidden")) {
    e.stopImmediatePropagation();
    closeDirModal();
  }
}, true);

/* ===== 目录三点菜单 ===== */
const dirCtxMenu = document.getElementById("dirCtxMenu");
let dirCtxTarget = null;
let dirCtxAnchor = null;

function closeDirCtxMenu() {
  dirCtxMenu.classList.add("hidden");
  document.querySelectorAll(".dir-ctx-open").forEach((el) => el.classList.remove("dir-ctx-open"));
  dirCtxTarget = null;
  dirCtxAnchor = null;
}

function openDirCtxMenu(anchorBtn, target) {
  if (dirCtxAnchor === anchorBtn && !dirCtxMenu.classList.contains("hidden")) {
    closeDirCtxMenu();
    return;
  }
  closeDirCtxMenu();
  dirCtxTarget = target;
  dirCtxAnchor = anchorBtn;
  anchorBtn.closest(".dir-item, .dir-folder")?.classList.add("dir-ctx-open");

  dirCtxMenu.classList.remove("hidden");
  const rect = anchorBtn.getBoundingClientRect();
  const menuW = dirCtxMenu.offsetWidth || 120;
  let left = rect.right - menuW;
  let top = rect.bottom + 8;
  left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));
  if (top + dirCtxMenu.offsetHeight > window.innerHeight - 8) {
    top = rect.top - dirCtxMenu.offsetHeight - 8;
  }
  dirCtxMenu.style.left = `${left}px`;
  dirCtxMenu.style.top = `${top}px`;

  const arrowRight = Math.max(10, Math.min(menuW - 22, rect.right - left - 11));
  dirCtxMenu.style.setProperty("--arrow-right", `${arrowRight}px`);
}

function renameDir(target) {
  const next = prompt("请输入新的目录名称", target.name);
  if (!next || !next.trim() || next.trim() === target.name) return;
  const name = next.trim();
  const tree = getDirTreeForKb(currentKb.name);

  if (target.type === "folder") {
    if (tree.some((g) => g.name === name)) {
      alert("该目录已存在");
      return;
    }
    const group = tree.find((g) => g.name === target.name);
    if (group) group.name = name;
  } else {
    const group = tree.find((g) => g.name === target.groupName);
    if (!group) return;
    if (group.children.includes(name)) {
      alert("该目录已存在");
      return;
    }
    const idx = group.children.indexOf(target.name);
    if (idx >= 0) group.children[idx] = name;
    if (currentDir === target.name) currentDir = name;
  }
  renderDirTree(tree);
}

function deleteDir(target) {
  if (!confirm(`确定删除「${target.name}」吗？`)) return;
  const tree = getDirTreeForKb(currentKb.name);

  if (target.type === "folder") {
    const idx = tree.findIndex((g) => g.name === target.name);
    if (idx >= 0) tree.splice(idx, 1);
    if (!tree.some((g) => g.children.includes(currentDir))) {
      currentDir = tree[0]?.children?.[0] || tree[0]?.name || "";
    }
  } else {
    const group = tree.find((g) => g.name === target.groupName);
    if (!group) return;
    group.children = group.children.filter((n) => n !== target.name);
    if (currentDir === target.name) {
      currentDir = group.children[0] || tree[0]?.children?.[0] || "";
    }
  }
  renderDirTree(tree);
  renderDocTable();
}

dirCtxMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn || !dirCtxTarget) return;
  const action = btn.dataset.action;
  const target = dirCtxTarget;
  closeDirCtxMenu();

  switch (action) {
    case "edit":
      renameDir(target);
      break;
    case "delete":
      deleteDir(target);
      break;
    case "toggle-category":
      alert(`显示/隐藏分类：${target.name}`);
      break;
    case "view-perm":
    case "edit-perm":
    case "qa-perm":
      openPermModal(action, { type: "dir", name: target.name });
      break;
    case "add-child":
      openDirModal(target.type === "folder" ? target.name : target.groupName);
      break;
    default:
      break;
  }
});

document.addEventListener("click", (e) => {
  if (!dirCtxMenu.classList.contains("hidden") && !dirCtxMenu.contains(e.target) && !e.target.closest(".dir-item-more")) {
    closeDirCtxMenu();
  }
});

document.addEventListener("scroll", closeDirCtxMenu, true);
window.addEventListener("resize", closeDirCtxMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !dirCtxMenu.classList.contains("hidden")) {
    e.stopImmediatePropagation();
    closeDirCtxMenu();
  }
}, true);

/* ===== Permission config modal ===== */
const PERM_USERS = [
  { id: "u1", name: "欧阳昌剑", org: "天翼云科技有限公司/数字化运营部/数据分析组" },
  { id: "u2", name: "周安安", org: "天翼云科技有限公司/数字化运营部/产品运营组" },
  { id: "u3", name: "张巍", org: "天翼云科技有限公司/数字化运营部/数据资产组" },
  { id: "u4", name: "葛懿", org: "天翼云科技有限公司/数字化运营部/数字孪生组" },
  { id: "u5", name: "何燕辉", org: "天翼云科技有限公司/数字化运营部/数字化赋能中心" },
  { id: "u6", name: "张杰", org: "天翼云科技有限公司/数字化运营部/数字化赋能中心" },
  { id: "u7", name: "陈孟琪", org: "天翼云科技有限公司/数字化运营部/数字化赋能中心" },
  { id: "u8", name: "段磊", org: "天翼云科技有限公司/数字化运营部/知识中心" },
  { id: "u9", name: "徐攀登", org: "天翼云科技有限公司/数字化运营部/数据运营中心" },
  { id: "u10", name: "陈文强", org: "天翼云科技有限公司/数字化运营部/业务中台组" },
  { id: "u11", name: "李婷", org: "天翼云科技有限公司/云网运营部/运营支撑组" },
  { id: "u12", name: "王浩", org: "天翼云科技有限公司/政企客户中心/解决方案组" },
];

const PERM_TITLE_MAP = {
  "view-perm": "查看权限配置",
  "edit-perm": "编辑权限配置",
  "qa-perm": "问答权限配置",
};

const DEFAULT_SELECTED_BY_TYPE = {
  "view-perm": ["u5", "u6", "u7"],
  "edit-perm": ["u5", "u6", "u7"],
  "qa-perm": ["u8", "u9"],
};

/** @type {Record<string, string[]>} */
const permStore = {};

const permModal = document.getElementById("permModal");
const permModalTitle = document.getElementById("permModalTitle");
const permUserSearch = document.getElementById("permUserSearch");
const permUserList = document.getElementById("permUserList");
const permSelectedList = document.getElementById("permSelectedList");
const PERSON_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

let permModalCtx = null;
let permDraftSelected = [];
let permActiveUserId = null;

function permStoreKey(action, target) {
  return `${action}::${target.type}::${target.name}`;
}

function getUserById(id) {
  return PERM_USERS.find((u) => u.id === id);
}

function openPermModal(action, target) {
  const key = permStoreKey(action, target);
  permModalCtx = { action, target, key };
  permModalTitle.textContent = PERM_TITLE_MAP[action] || "权限配置";
  permDraftSelected = [...(permStore[key] || DEFAULT_SELECTED_BY_TYPE[action] || [])];
  permActiveUserId = null;
  permUserSearch.value = "";
  renderPermUserList();
  renderPermSelectedList();
  permModal.classList.remove("hidden");
  permUserSearch.focus();
}

function closePermModal() {
  permModal.classList.add("hidden");
  permModalCtx = null;
}

function renderPermUserList() {
  const q = permUserSearch.value.trim().toLowerCase();
  const list = PERM_USERS.filter(
    (u) => !q || u.name.toLowerCase().includes(q) || u.org.toLowerCase().includes(q)
  );
  if (!list.length) {
    permUserList.innerHTML = `<div class="perm-empty">未找到匹配人员</div>`;
    return;
  }
  permUserList.innerHTML = list
    .map((u) => {
      const selected = permDraftSelected.includes(u.id);
      const active = permActiveUserId === u.id;
      return `<button type="button" class="perm-user-item${selected ? " is-selected" : ""}${active ? " is-active" : ""}" data-id="${u.id}" role="option" aria-selected="${selected}">
        ${PERSON_ICON}<span>${u.name}</span>
      </button>`;
    })
    .join("");
}

function renderPermSelectedList() {
  if (!permDraftSelected.length) {
    permSelectedList.innerHTML = `<div class="perm-empty">暂无已选用户</div>`;
    return;
  }
  permSelectedList.innerHTML = permDraftSelected
    .map((id) => {
      const u = getUserById(id);
      if (!u) return "";
      return `<div class="perm-selected-card" data-id="${u.id}">
        <div class="perm-selected-avatar">${PERSON_ICON}</div>
        <div class="perm-selected-meta">
          <div class="perm-selected-name">${u.name}</div>
          <div class="perm-selected-org" title="${u.org}">${u.org}</div>
        </div>
        <button type="button" class="perm-selected-remove" data-id="${u.id}" title="移除" aria-label="移除">${ACTION_ICONS.delete}</button>
      </div>`;
    })
    .join("");
}

function togglePermUser(id) {
  permActiveUserId = id;
  if (permDraftSelected.includes(id)) {
    permDraftSelected = permDraftSelected.filter((x) => x !== id);
  } else {
    permDraftSelected = [...permDraftSelected, id];
  }
  renderPermUserList();
  renderPermSelectedList();
}

permUserList.addEventListener("click", (e) => {
  const item = e.target.closest(".perm-user-item");
  if (!item) return;
  togglePermUser(item.dataset.id);
});

permSelectedList.addEventListener("click", (e) => {
  const btn = e.target.closest(".perm-selected-remove");
  if (!btn) return;
  permDraftSelected = permDraftSelected.filter((id) => id !== btn.dataset.id);
  renderPermUserList();
  renderPermSelectedList();
});

document.getElementById("permClearSelected").addEventListener("click", () => {
  if (!permDraftSelected.length) return;
  if (!confirm("确定清空已选用户列表吗？")) return;
  permDraftSelected = [];
  renderPermUserList();
  renderPermSelectedList();
});

permUserSearch.addEventListener("input", renderPermUserList);
document.getElementById("permUserSearchBtn").addEventListener("click", renderPermUserList);

document.getElementById("permModalClose").addEventListener("click", closePermModal);
document.getElementById("permModalCancel").addEventListener("click", closePermModal);
document.getElementById("permModalConfirm").addEventListener("click", () => {
  if (!permModalCtx) return;
  permStore[permModalCtx.key] = [...permDraftSelected];
  const names = permDraftSelected.map((id) => getUserById(id)?.name).filter(Boolean);
  alert(
    `已保存「${PERM_TITLE_MAP[permModalCtx.action]}」\n对象：${permModalCtx.target.name}\n已选用户：${names.join("、") || "无"}`
  );
  closePermModal();
});

permModal.addEventListener("click", (e) => {
  if (e.target === permModal) closePermModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !permModal.classList.contains("hidden")) {
    e.stopImmediatePropagation();
    closePermModal();
  }
}, true);

filterAndRender();
applyRoleUI();
