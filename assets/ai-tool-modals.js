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
    { id: "e1", name: "小翼·智能助手", dept: "综合服务部·智能综合助理", avatar: "👩‍💼", selected: true },
    { id: "e2", name: "小翼·客服", dept: "客户服务部·智能客服专员", avatar: "👨‍💼", selected: true },
    { id: "e3", name: "小翼·财务", dept: "财务部·智能财务助理", avatar: "👩‍💻", selected: true },
    { id: "e4", name: "小翼·人力", dept: "人力资源部·智能人力助理", avatar: "👨‍💻", selected: false },
    { id: "e5", name: "小翼·法务", dept: "法务部·智能法务顾问", avatar: "👩‍⚖️", selected: false },
    { id: "e6", name: "小翼·公文", dept: "办公室·智能公文助理", avatar: "👨‍🏫", selected: false }
  ];

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
      nav: [
        { id: "digital", label: "数字员工", icon: "👤" },
        { id: "agent", label: "智能体市场", icon: "🤖" }
      ],
      listTitle: "数字人列表",
      searchPlaceholder: "搜索数字人",
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
  let activeExpertId = "default";

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
    const selected = getSelectedExperts();
    if (!selected.length) return DEFAULT_EXPERT;
    if (activeExpertId) {
      const found = selected.find(item => item.id === activeExpertId);
      if (found) return found;
    }
    return selected[0];
  }

  function setActiveExpert(id) {
    const item = MOCK_EXPERTS.find(e => e.id === id);
    if (item) item.selected = true;
    activeExpertId = id || "default";
    notifyExpertChange();
    if (currentType === "expert" && overlay && !overlay.classList.contains("hidden")) {
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
    return `<div class="ai-picker-item${item.selected ? " ai-picker-item-selectable" : ""}${isActive ? " ai-picker-item-active" : ""}" data-id="${item.id}">
      <div class="ai-picker-item-avatar" style="display:flex;align-items:center;justify-content:center;font-size:22px">${item.avatar}</div>
      <div class="ai-picker-item-body">
        <div class="ai-picker-item-title">${escapeHtml(item.name)}</div>
        <div class="ai-picker-item-desc">${escapeHtml(item.dept)}</div>
      </div>
      <div class="ai-picker-item-action">
        ${item.selected
          ? `<span class="ai-picker-check"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`
          : `<button type="button" class="ai-picker-add-btn" data-add="${item.id}">添加</button>`}
      </div>
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
    if (!items.length) return `<div class="ai-picker-empty">暂无匹配结果</div>`;
    const renderMap = {
      expert: renderExpertItem,
      mcp: renderMcpItem,
      knowledge: renderKnowledgeItem
    };
    const render = renderMap[type] || renderSkillItem;
    return items.map(render).join("");
  }

  function render() {
    const cfg = CONFIGS[currentType];
    const items = getItems();
    const allItems = cfg.items();
    const selectedCount = getSelected(allItems).length;
    const dialog = ensureOverlay().querySelector(".ai-picker-dialog");

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
      render();
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
        if (currentType === "expert") setActiveExpert(item.id);
        else if (currentType === "knowledge") notifyKnowledgeChange();
        render();
      });
    });

    dialog.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const item = allItems.find(i => i.id === btn.dataset.remove);
        if (item) item.selected = false;
        if (currentType === "expert") syncActiveExpertAfterSelection();
        else if (currentType === "knowledge") notifyKnowledgeChange();
        render();
      });
    });

    if (currentType === "expert") {
      dialog.querySelectorAll(".ai-picker-item-selectable").forEach(row => {
        row.addEventListener("click", () => {
          const item = allItems.find(i => i.id === row.dataset.id);
          if (item?.selected) setActiveExpert(item.id);
        });
      });

      dialog.querySelectorAll(".ai-picker-tag[data-id]").forEach(tag => {
        tag.addEventListener("click", e => {
          if (e.target.closest("[data-remove]")) return;
          setActiveExpert(tag.dataset.id);
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
