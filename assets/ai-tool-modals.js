(function () {
  "use strict";

  const MAX_SELECT = 99;

  const MOCK_SKILLS = [
    { id: "s1", name: "期刊数据多维分析", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", icon: "⚡", color: "#722ed1", selected: true },
    { id: "s2", name: "大白话版数据分析", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", icon: "📊", color: "#1677ff", selected: true },
    { id: "s3", name: "数据可视化", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", icon: "📈", color: "#52c41a", selected: true },
    { id: "s4", name: "数据分析技能", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", icon: "🔍", color: "#fa8c16", selected: false },
    { id: "s5", name: "运营数据分析技能", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", icon: "📋", color: "#13c2c2", selected: false }
  ];

  const MOCK_EXPERTS = [
    { id: "e1", name: "小翼·智能助手", dept: "综合服务部 · 综合支撑 - 办公室 - 智能综合", avatar: "👩‍💼", status: "online", color: "#1677ff", selected: true },
    { id: "e2", name: "小翼·定时任务助手", dept: "综合服务部 · 定时调度与任务提醒", avatar: "⏱️", status: "online", color: "#13c2c2", selected: false },
    { id: "e3", name: "小翼·客服", dept: "客户服务部 · 智能客服专员", avatar: "👨‍💼", status: "online", color: "#52c41a", selected: false },
    { id: "e4", name: "小翼·数据", dept: "数据运营部 · 数据分析与指标解读", avatar: "📊", status: "training", color: "#722ed1", selected: false },
    { id: "e5", name: "小翼·营销", dept: "市场营销部 · 营销策划与客户洞察", avatar: "📣", status: "online", color: "#eb2f96", selected: false },
    { id: "e6", name: "小翼·审计", dept: "审计部 · 合规审计与风险核查", avatar: "🔍", status: "online", color: "#2f54eb", selected: false },
    { id: "e7", name: "小翼·HR", dept: "人力资源部 · 智能人力助理", avatar: "👨‍💻", status: "online", color: "#fa8c16", selected: false },
    { id: "e8", name: "小翼·财务", dept: "财务部 · 智能财务助理", avatar: "👩‍💻", status: "online", color: "#fa541c", selected: false },
    { id: "e9", name: "小翼·运维", dept: "信息技术部 · 系统运维与故障排查", avatar: "🛠️", status: "paused", color: "#8c8c8c", selected: false },
    { id: "e10", name: "小翼·商机", dept: "销售支撑部 · 商机挖掘与拓客", avatar: "💡", status: "online", color: "#a0d911", selected: false },
    { id: "e11", name: "小翼·文档", dept: "办公室 · 智能公文助理", avatar: "📄", status: "online", color: "#36cfc9", selected: false },
    { id: "e12", name: "小翼·经分", dept: "经营分析部 · 经营分析与报表", avatar: "📈", status: "training", color: "#597ef7", selected: false },
    { id: "e13", name: "小翼·法务", dept: "法务部 · 智能法务顾问", avatar: "👩‍⚖️", status: "online", color: "#9254de", selected: false },
    { id: "e14", name: "小翼·采购", dept: "采购管理部 · 采购询比与供应商协同", avatar: "🛒", status: "online", color: "#13c2c2", selected: false },
    { id: "e15", name: "小翼·合同", dept: "法务部 · 合同审查与条款比对", avatar: "📝", status: "online", color: "#1890ff", selected: false },
    { id: "e16", name: "小翼·会议", dept: "综合服务部 · 会议安排与纪要生成", avatar: "🗓️", status: "online", color: "#52c41a", selected: false },
    { id: "e17", name: "小翼·访客", dept: "行政管理部 · 访客预约与通行指引", avatar: "🪪", status: "paused", color: "#8c8c8c", selected: false },
    { id: "e18", name: "小翼·督办", dept: "办公室 · 督办跟踪与进度提醒", avatar: "🎯", status: "online", color: "#fa541c", selected: false },
    { id: "e19", name: "小翼·安全", dept: "安全部 · 安全合规与风险提示", avatar: "🛡️", status: "online", color: "#f5222d", selected: false },
    { id: "e20", name: "小翼·知识", dept: "知识管理部 · 知识检索与问答", avatar: "📚", status: "training", color: "#2f54eb", selected: false },
    { id: "e21", name: "小翼·报表", dept: "数据运营部 · 报表生成与可视化", avatar: "📉", status: "online", color: "#722ed1", selected: false },
    { id: "e22", name: "小翼·培训", dept: "人力资源部 · 培训课程与学习助手", avatar: "🎓", status: "online", color: "#eb2f96", selected: false },
    { id: "e23", name: "小翼·资产", dept: "资产管理部 · 资产盘点与调拨", avatar: "📦", status: "paused", color: "#8c8c8c", selected: false },
    { id: "e24", name: "小翼·项目", dept: "项目管理部 · 项目进度与风险跟踪", avatar: "🚀", status: "online", color: "#fa8c16", selected: false }
  ];

  const EXPERT_PAGE_SIZE = 12;

  const EXPERT_STATUS_LABELS = {
    online: "在线",
    training: "训练中",
    paused: "已暂停"
  };

  const MOCK_MCP = [
    { id: "m1", name: "期刊数据多维分析", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", selected: true },
    { id: "m2", name: "大白话版数据分析", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", selected: true },
    { id: "m3", name: "数据可视化", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", selected: true },
    { id: "m4", name: "数据分析技能", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", selected: false },
    { id: "m5", name: "运营数据分析技能", desc: "描述描述描述描述描述描述描述描述描述描述描述描述", selected: false }
  ];

  const MOCK_KNOWLEDGE = [
    { id: "k1", name: "集团翼办使用手册", desc: "集团办公室 · 操作手册", icon: "📘", color: "#1677ff", selected: false },
    { id: "k2", name: "公文格式标准与排版规范", desc: "综合管理部 · 规范", icon: "📄", color: "#52c41a", selected: false },
    { id: "k3", name: "2025年度收发文登记管理办法", desc: "集团办公室 · 制度", icon: "📋", color: "#722ed1", selected: false },
    { id: "k4", name: "请示报告工作规范", desc: "人力资源部 · 规范", icon: "📝", color: "#fa8c16", selected: false },
    { id: "k5", name: "安全公司督办系统操作手册", desc: "安全公司 · 操作手册", icon: "🛡️", color: "#13c2c2", selected: false },
    { id: "k6", name: "协同办公竞品分析报告", desc: "数字化运营部 · 分析报告", icon: "📊", color: "#eb2f96", selected: false },
    { id: "k7", name: "关于进一步加强公文管理工作的通知", desc: "集团办公室 · 通知", icon: "📢", color: "#ff4d4f", selected: false },
    { id: "k8", name: "天翼云解决方案", desc: "政企事业部 · 方案", icon: "☁️", color: "#2f54eb", selected: false }
  ];

  const CONFIGS = {
    skill: {
      sidebarTitle: "",
      showCreate: true,
      createLabel: "创建技能",
      nav: [
        { id: "public", label: "公共技能", icon: "😊" },
        { id: "custom", label: "自建技能", icon: "⚙️" }
      ],
      listTitle: "技能列表",
      searchPlaceholder: "搜索技能",
      items: () => MOCK_SKILLS,
      type: "skill"
    },
    expert: {
      sidebarTitle: "专家市场",
      showCreate: false,
      showSidebar: false,
      layout: "expert-grid",
      nav: [
        { id: "digital", label: "数字员工", icon: "👤" },
        { id: "agent", label: "智能体市场", icon: "🤖" }
      ],
      listTitle: "选择数字员工",
      searchPlaceholder: "搜索数字员工名称、岗位、部门...",
      items: () => MOCK_EXPERTS,
      type: "expert"
    },
    mcp: {
      sidebarTitle: "工具",
      showCreate: false,
      nav: [
        { id: "public", label: "公共工具", icon: "😊" },
        { id: "custom", label: "自建工具", icon: "⚙️" }
      ],
      listTitle: "工具列表",
      searchPlaceholder: "搜索工具",
      items: () => MOCK_MCP,
      type: "mcp"
    },
    knowledge: {
      sidebarTitle: "智库",
      showCreate: false,
      nav: [
        { id: "public", label: "公共智库", icon: "📚" },
        { id: "department", label: "部门智库", icon: "🏢" },
        { id: "personal", label: "我的收藏", icon: "⭐" }
      ],
      listTitle: "知识列表",
      searchPlaceholder: "搜索知识",
      items: () => MOCK_KNOWLEDGE,
      type: "knowledge"
    }
  };

  let overlay = null;
  let currentType = null;
  let currentNav = null;
  let searchQuery = "";
  let expertPage = 1;
  let activeExpertId = "e1";

  const DEFAULT_EXPERT = { id: "default", name: "AI专家", dept: "默认数字人助手" };

  function getSelectedExperts() {
    return MOCK_EXPERTS.filter(item => item.selected);
  }

  function getSelectedKnowledge() {
    return MOCK_KNOWLEDGE.filter(item => item.selected);
  }

  function notifyKnowledgeChange() {
    window.dispatchEvent(new CustomEvent("ai-knowledge-change", {
      detail: { selected: getSelectedKnowledge() }
    }));
  }

  function getActiveExpert() {
    if (activeExpertId === "default") return DEFAULT_EXPERT;
    const found = MOCK_EXPERTS.find(item => item.id === activeExpertId);
    return found || DEFAULT_EXPERT;
  }

  function setActiveExpert(id, options = {}) {
    const item = MOCK_EXPERTS.find(e => e.id === id);
    if (item) {
      MOCK_EXPERTS.forEach(e => {
        e.selected = e.id === id;
      });
      activeExpertId = id;
    } else {
      activeExpertId = id || "default";
    }
    notifyExpertChange();
    if (!options.skipRender && currentType === "expert" && overlay && !overlay.classList.contains("hidden")) {
      render();
    }
  }

  function getExperts() {
    return MOCK_EXPERTS.slice();
  }

  function getSkills() {
    return MOCK_SKILLS.slice();
  }

  function notifyExpertChange() {
    window.dispatchEvent(new CustomEvent("ai-expert-change", {
      detail: {
        expert: getActiveExpert(),
        selected: getSelectedExperts()
      }
    }));
  }

  function syncActiveExpertAfterSelection() {
    const selected = getSelectedExperts();
    if (!selected.length) {
      activeExpertId = "default";
      notifyExpertChange();
      return;
    }
    if (activeExpertId === "default") {
      notifyExpertChange();
      return;
    }
    if (!activeExpertId || !selected.some(item => item.id === activeExpertId)) {
      activeExpertId = selected[0].id;
    }
    notifyExpertChange();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "ai-picker-overlay hidden";
    overlay.id = "aiPickerOverlay";
    overlay.innerHTML = `<div class="ai-picker-dialog" role="dialog" aria-modal="true"></div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) close();
    });
    return overlay;
  }

  function getItems() {
    const cfg = CONFIGS[currentType];
    const all = cfg.items();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter(item => {
      const text = [item.name, item.dept, item.desc].filter(Boolean).join(" ").toLowerCase();
      return text.includes(q);
    });
  }

  function getSelected(items) {
    return items.filter(i => i.selected);
  }

  function renderTags(items) {
    const selected = getSelected(items);
    if (!selected.length) return "";
    return selected.map(item => {
      const icon = item.icon
        ? `<span class="ai-picker-tag-icon" style="background:${item.color || "#fff1f0"}">${item.icon}</span>`
        : "";
      return `<span class="ai-picker-tag" data-id="${item.id}">
        ${icon}
        <span>${escapeHtml(item.name)}</span>
        <button type="button" class="ai-picker-tag-remove" data-remove="${item.id}" aria-label="移除">×</button>
      </span>`;
    }).join("");
  }

  function renderSkillItem(item) {
    return `<div class="ai-picker-item" data-id="${item.id}">
      <div class="ai-picker-item-icon" style="background:${item.color}15;color:${item.color}">${item.icon}</div>
      <div class="ai-picker-item-body">
        <div class="ai-picker-item-title">${escapeHtml(item.name)}</div>
        <div class="ai-picker-item-desc">${escapeHtml(item.desc)}</div>
      </div>
      <div class="ai-picker-item-action">
        ${item.selected
          ? `<span class="ai-picker-check"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`
          : `<button type="button" class="ai-picker-add-btn" data-add="${item.id}">添加</button>`}
      </div>
    </div>`;
  }

  function renderExpertItem(item) {
    const isActive = getActiveExpert().id === item.id;
    const status = item.status || "online";
    const statusLabel = EXPERT_STATUS_LABELS[status] || EXPERT_STATUS_LABELS.online;
    return `
    <button type="button" class="ai-expert-card${isActive ? " is-active" : ""}" data-expert-id="${item.id}" role="option" aria-selected="${isActive}">
      <span class="ai-expert-card-avatar" style="background:${(item.color || "#1677ff")}18">${item.avatar || "👤"}</span>
      <span class="ai-expert-card-body">
        <span class="ai-expert-card-name-row">
          <span class="ai-expert-card-name">${escapeHtml(item.name)}</span>
          <span class="ai-expert-status is-${status}">${statusLabel}</span>
        </span>
        <span class="ai-expert-card-desc">${escapeHtml(item.dept || "")}</span>
      </span>
    </button>`;
  }

  function renderExpertGrid(items) {
    if (!items.length) return `<div class="ai-picker-empty">暂无匹配的数字员工</div>`;
    return `<div class="ai-expert-grid" role="listbox" aria-label="数字员工列表">${items.map(renderExpertItem).join("")}</div>`;
  }

  function getExpertPageCount(total) {
    return Math.max(1, Math.ceil(total / EXPERT_PAGE_SIZE));
  }

  function paginateExperts(items) {
    const totalPages = getExpertPageCount(items.length);
    if (expertPage > totalPages) expertPage = totalPages;
    if (expertPage < 1) expertPage = 1;
    const start = (expertPage - 1) * EXPERT_PAGE_SIZE;
    return {
      pageItems: items.slice(start, start + EXPERT_PAGE_SIZE),
      total: items.length,
      page: expertPage,
      totalPages
    };
  }

  function renderExpertPagination(page, totalPages, total) {
    if (total === 0) return "";
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(p => `
        <button type="button" class="ai-expert-page-btn${p === page ? " is-active" : ""}" data-expert-page="${p}" aria-label="第 ${p} 页" aria-current="${p === page ? "page" : "false"}">${p}</button>`)
      .join("");
    return `
    <div class="ai-expert-pagination" role="navigation" aria-label="数字员工分页">
      <button type="button" class="ai-expert-page-nav" data-expert-page-nav="prev" aria-label="上一页" ${page <= 1 ? "disabled" : ""}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="ai-expert-page-list">${pages}</div>
      <button type="button" class="ai-expert-page-nav" data-expert-page-nav="next" aria-label="下一页" ${page >= totalPages ? "disabled" : ""}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <span class="ai-expert-page-meta">共 ${total} 人 · ${page}/${totalPages} 页</span>
    </div>`;
  }

  function renderMcpItem(item) {
    return `<div class="ai-picker-item" data-id="${item.id}">
      <div class="ai-picker-item-body">
        <div class="ai-picker-item-title">${escapeHtml(item.name)}</div>
        <div class="ai-picker-item-desc">${escapeHtml(item.desc)}</div>
      </div>
      <div class="ai-picker-item-action">
        ${item.selected
          ? `<span class="ai-picker-check"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`
          : `<button type="button" class="ai-picker-add-btn" data-add="${item.id}">添加</button>`}
      </div>
    </div>`;
  }

  function renderKnowledgeItem(item) {
    return `<div class="ai-picker-item" data-id="${item.id}">
      <div class="ai-picker-item-icon" style="background:${item.color}15;color:${item.color}">${item.icon}</div>
      <div class="ai-picker-item-body">
        <div class="ai-picker-item-title">${escapeHtml(item.name)}</div>
        <div class="ai-picker-item-desc">${escapeHtml(item.desc)}</div>
      </div>
      <div class="ai-picker-item-action">
        ${item.selected
          ? `<span class="ai-picker-check"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`
          : `<button type="button" class="ai-picker-add-btn" data-add="${item.id}">添加</button>`}
      </div>
    </div>`;
  }

  function renderList(items, type) {
    if (type === "expert") return renderExpertGrid(items);
    if (!items.length) return `<div class="ai-picker-empty">暂无匹配结果</div>`;
    const renderMap = {
      mcp: renderMcpItem,
      knowledge: renderKnowledgeItem
    };
    const renderFn = renderMap[type] || renderSkillItem;
    return items.map(renderFn).join("");
  }

  function renderExpertPicker(dialog, cfg, items) {
    const { pageItems, page, totalPages, total } = paginateExperts(items);
    dialog.classList.add("no-sidebar", "is-expert-picker");
    dialog.innerHTML = `
      <main class="ai-picker-main ai-expert-picker-main">
        <div class="ai-expert-picker-header">
          <div class="ai-expert-picker-title-row">
            <h3 class="ai-expert-picker-title">
              <span class="ai-expert-picker-title-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              ${escapeHtml(cfg.listTitle)}
            </h3>
            <button type="button" class="ai-picker-close" id="aiPickerCloseBtn" aria-label="关闭">×</button>
          </div>
          <div class="ai-picker-search ai-expert-picker-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" id="aiPickerSearchInput" placeholder="${escapeHtml(cfg.searchPlaceholder)}" value="${escapeHtml(searchQuery)}" />
          </div>
        </div>
        <div class="ai-picker-list ai-expert-picker-list">${renderExpertGrid(pageItems)}</div>
        ${renderExpertPagination(page, totalPages, total)}
      </main>`;
  }

  function render() {
    const cfg = CONFIGS[currentType];
    const items = getItems();
    const allItems = cfg.items();
    const selectedCount = getSelected(allItems).length;
    const dialog = ensureOverlay().querySelector(".ai-picker-dialog");

    if (cfg.layout === "expert-grid") {
      renderExpertPicker(dialog, cfg, items);
      bindDialogEvents(dialog, allItems);
      return;
    }

    dialog.classList.remove("is-expert-picker");
    const sidebarTitle = cfg.sidebarTitle
      ? `<div class="ai-picker-sidebar-title">${escapeHtml(cfg.sidebarTitle)}</div>`
      : "";
    const createBtn = cfg.showCreate
      ? `<button type="button" class="ai-picker-create-btn">+ ${escapeHtml(cfg.createLabel)}</button>`
      : "";
    const navHtml = cfg.nav.map(n => `
      <button type="button" class="ai-picker-nav-item${n.id === currentNav ? " active" : ""}" data-nav="${n.id}">
        <span class="ai-picker-nav-icon">${n.icon}</span>
        ${escapeHtml(n.label)}
      </button>`).join("");
    const showSidebar = cfg.showSidebar !== false;
    const sidebarHtml = showSidebar
      ? `<aside class="ai-picker-sidebar">
        ${sidebarTitle}
        ${navHtml}
        ${createBtn}
      </aside>`
      : "";

    dialog.classList.toggle("no-sidebar", !showSidebar);
    dialog.innerHTML = `
      ${sidebarHtml}
      <main class="ai-picker-main">
        <div class="ai-picker-header">
          <div class="ai-picker-header-left">
            <h3>${escapeHtml(cfg.listTitle)}</h3>
            <div class="ai-picker-count">已选${selectedCount}/${MAX_SELECT}</div>
          </div>
          <div class="ai-picker-header-right">
            <div class="ai-picker-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" id="aiPickerSearchInput" placeholder="${escapeHtml(cfg.searchPlaceholder)}" value="${escapeHtml(searchQuery)}" />
            </div>
            <button type="button" class="ai-picker-close" id="aiPickerCloseBtn" aria-label="关闭">×</button>
          </div>
        </div>
        <div class="ai-picker-tags">${renderTags(allItems)}</div>
        <div class="ai-picker-list">${renderList(items, cfg.type)}</div>
      </main>`;

    bindDialogEvents(dialog, allItems);
  }

  function bindDialogEvents(dialog, allItems) {
    dialog.querySelector("#aiPickerCloseBtn")?.addEventListener("click", close);

    dialog.querySelector("#aiPickerSearchInput")?.addEventListener("input", e => {
      searchQuery = e.target.value;
      if (currentType === "expert") expertPage = 1;
      render();
      const input = ensureOverlay().querySelector("#aiPickerSearchInput");
      if (input) {
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    });

    dialog.querySelectorAll("[data-nav]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentNav = btn.dataset.nav;
        render();
      });
    });

    dialog.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = allItems.find(i => i.id === btn.dataset.add);
        if (!item) return;
        const selected = getSelected(allItems);
        if (selected.length >= MAX_SELECT) return;
        item.selected = true;
        if (currentType === "knowledge") notifyKnowledgeChange();
        render();
      });
    });

    dialog.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const item = allItems.find(i => i.id === btn.dataset.remove);
        if (item) item.selected = false;
        if (currentType === "knowledge") notifyKnowledgeChange();
        render();
      });
    });

    if (currentType === "expert") {
      dialog.querySelectorAll("[data-expert-id]").forEach(card => {
        card.addEventListener("click", () => {
          setActiveExpert(card.dataset.expertId, { skipRender: true });
          close();
        });
      });

      dialog.querySelectorAll("[data-expert-page]").forEach(btn => {
        btn.addEventListener("click", () => {
          const page = Number(btn.dataset.expertPage);
          if (!Number.isFinite(page) || page === expertPage) return;
          expertPage = page;
          render();
        });
      });

      dialog.querySelectorAll("[data-expert-page-nav]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.disabled) return;
          const dir = btn.dataset.expertPageNav;
          const filtered = getItems();
          const totalPages = getExpertPageCount(filtered.length);
          if (dir === "prev") expertPage = Math.max(1, expertPage - 1);
          if (dir === "next") expertPage = Math.min(totalPages, expertPage + 1);
          render();
        });
      });
    }
  }

  function open(type) {
    const cfg = CONFIGS[type];
    if (!cfg) return;
    currentType = type;
    currentNav = cfg.nav[0].id;
    searchQuery = "";
    expertPage = 1;
    ensureOverlay().classList.remove("hidden");
    document.body.style.overflow = "hidden";
    render();
  }

  function close() {
    if (!overlay) return;
    const closingType = currentType;
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    if (closingType === "expert") syncActiveExpertAfterSelection();
    if (closingType === "knowledge") notifyKnowledgeChange();
    currentType = null;
  }

  function init() {
    ensureOverlay();
    syncActiveExpertAfterSelection();
  }

  window.AiToolModals = {
    init,
    open,
    close,
    getCurrentType: () => (overlay && !overlay.classList.contains("hidden") ? currentType : null),
    getSelectedExperts,
    getSelectedKnowledge,
    getExperts,
    getSkills,
    getActiveExpert,
    setActiveExpert
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
