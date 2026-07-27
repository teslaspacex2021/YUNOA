const PLUS_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;

const GRID_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`;

const BOLT_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

const PLUG_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>`;

const PAPERCLIP_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;

const CHEVRON_SVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

const KNOWLEDGE_BASE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
  <ellipse cx="12" cy="5" rx="8" ry="3"/>
  <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>
  <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>
</svg>`;

const WEBSEARCH_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`;

const LLM_MODEL_GROUPS = [
  {
    group: "推荐",
    items: [{ id: "auto", name: "自动", vendor: "智能调度" }]
  },
  {
    group: "国产主流",
    items: [
      { id: "glm-4-plus", name: "GLM-4 Plus", vendor: "智谱AI" },
      { id: "glm-4", name: "GLM-4", vendor: "智谱AI" },
      { id: "deepseek-v3", name: "DeepSeek-V3", vendor: "深度求索" },
      { id: "deepseek-r1", name: "DeepSeek-R1", vendor: "深度求索" },
      { id: "kimi-k2", name: "Kimi K2", vendor: "月之暗面" },
      { id: "qwen-max", name: "通义千问 Max", vendor: "阿里云" },
      { id: "qwen-plus", name: "通义千问 Plus", vendor: "阿里云" },
      { id: "ernie-4", name: "文心一言 4.0", vendor: "百度" },
      { id: "spark-v4", name: "讯飞星火 V4", vendor: "科大讯飞" },
      { id: "hunyuan-pro", name: "腾讯混元 Pro", vendor: "腾讯" },
      { id: "baichuan4", name: "Baichuan4", vendor: "百川智能" },
      { id: "minimax-abab65", name: "MiniMax abab6.5", vendor: "MiniMax" }
    ]
  },
  {
    group: "息壤·电信",
    items: [
      { id: "xirang-star", name: "星辰大模型", vendor: "中国电信" },
      { id: "xirang-star-ultra", name: "星辰大模型 Ultra", vendor: "中国电信" },
      { id: "xirang-glm", name: "息壤 GLM-4", vendor: "息壤 MaaS" },
      { id: "xirang-deepseek", name: "息壤 DeepSeek", vendor: "息壤 MaaS" },
      { id: "xirang-kimi", name: "息壤 Kimi", vendor: "息壤 MaaS" },
      { id: "xirang-qwen", name: "息壤 通义千问", vendor: "息壤 MaaS" },
      { id: "xirang-telechat", name: "TeleChat", vendor: "电信自研" }
    ]
  }
];

let selectedModelId = "auto";
let selectedComposerMode = "fast"; // fast | think | office
let webSearchEnabled = false;
const mountedToolbars = new Set();

const MODE_LABELS = {
  fast: "快速模式",
  think: "深度思考",
  office: "办公任务"
};

const MODE_DESCS = {
  fast: "适用于大部分情况",
  think: "擅长解决更难的问题",
  office: "支持技能与办公流程"
};

function isSkillModeEnabled(mode = selectedComposerMode) {
  return mode === "office";
}

function isWebSearchModeEnabled(mode = selectedComposerMode) {
  return mode === "think" || mode === "office";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findModel(id) {
  for (const g of LLM_MODEL_GROUPS) {
    const item = g.items.find(i => i.id === id);
    if (item) return item;
  }
  return LLM_MODEL_GROUPS[0].items[0];
}

function renderModelMenu() {
  return LLM_MODEL_GROUPS.map(g => `
    <div class="ai-model-select-group">
      <div class="ai-model-select-group-title">${escapeHtml(g.group)}</div>
      ${g.items.map(item => `
        <button type="button" class="ai-model-select-option${item.id === selectedModelId ? " active" : ""}" data-model-id="${item.id}">
          <span class="ai-model-select-option-main">
            <span class="ai-model-select-option-name">${escapeHtml(item.name)}</span>
            <span class="ai-model-select-option-vendor">${escapeHtml(item.vendor)}</span>
          </span>
          ${item.id === selectedModelId ? `<span class="ai-model-select-check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>` : ""}
        </button>`).join("")}
    </div>`).join("");
}

function getModelSelectHtml(options = {}) {
  const model = findModel(selectedModelId);
  const label = options.autoLabel === "自动" && model.id === "auto" ? "自动" : model.name;
  return `
  <div class="ai-model-select-wrap">
    <button type="button" class="ai-model-select-trigger" data-tool="model-select" aria-haspopup="listbox" aria-expanded="false" title="大模型选择：${escapeHtml(model.name)}">
      <span class="ai-model-select-label">${escapeHtml(label)}</span>
      ${CHEVRON_SVG}
    </button>
    <div class="ai-model-select-menu hidden" role="listbox" aria-label="选择大模型">
      ${renderModelMenu()}
    </div>
  </div>`;
}

function getModeOptionHtml(modeId, currentMode) {
  const label = MODE_LABELS[modeId] || modeId;
  const desc = MODE_DESCS[modeId] || "";
  return `
    <button type="button" class="ai-composer-mode-option${modeId === currentMode ? " is-active" : ""}" data-ai-mode="${modeId}" role="option">
      <span class="ai-composer-mode-option-text">
        <span class="ai-composer-mode-option-label">${label}</span>
        <span class="ai-composer-mode-option-desc">${desc}</span>
      </span>
    </button>`;
}

/** 对话模式下拉（放在 Auto 左侧） */
function getAiModeSelectHtml(options = {}) {
  const mode = options.mode || selectedComposerMode;
  const label = MODE_LABELS[mode] || MODE_LABELS.fast;
  return `
  <div class="ai-composer-modes" data-ai-mode="${mode}">
    <button type="button" class="ai-composer-mode-trigger" data-tool="mode-select" aria-label="对话模式" aria-haspopup="listbox" aria-expanded="false">
      <span class="ai-composer-mode-label">${label}</span>
      ${CHEVRON_SVG}
    </button>
    <div class="ai-composer-mode-menu hidden" role="listbox" aria-label="对话模式">
      ${getModeOptionHtml("fast", mode)}
      ${getModeOptionHtml("think", mode)}
      ${getModeOptionHtml("office", mode)}
    </div>
  </div>`;
}

/** 与顶部 AI 输入框一致：附件、+（联网/技能/智库/工具）、专家 */
function getAiToolbarHtml(options = {}) {
  const mode = options.mode || selectedComposerMode;
  const skillEnabled = isSkillModeEnabled(mode);
  const websearchEnabledFlag = isWebSearchModeEnabled(mode);
  return `
  <button type="button" class="ai-tool-btn" data-tool="attach" id="aiUploadBtn" title="上传附件" aria-label="上传附件">
    ${PAPERCLIP_SVG}
  </button>
  <div class="ai-composer-plus-wrap" data-skill-enabled="${skillEnabled}" data-websearch-enabled="${websearchEnabledFlag}">
    <button type="button" class="ai-tool-btn" data-tool="plus-menu" aria-label="更多工具" aria-expanded="false" aria-haspopup="menu">
      ${PLUS_SVG}
    </button>
    <div class="ai-composer-plus-menu hidden" role="menu">
      <button type="button" class="ai-composer-plus-item${webSearchEnabled ? " active" : ""}" data-tool="websearch" role="menuitem" aria-pressed="${webSearchEnabled}">
        ${WEBSEARCH_SVG}
        联网
      </button>
      <button type="button" class="ai-composer-plus-item" data-tool="add-skill" role="menuitem">
        ${BOLT_SVG}
        技能
      </button>
      <button type="button" class="ai-composer-plus-item" data-tool="knowledge-base" role="menuitem">
        ${KNOWLEDGE_BASE_SVG}
        智库
      </button>
      <button type="button" class="ai-composer-plus-item" data-tool="mcp" role="menuitem">
        ${PLUG_SVG}
        工具
      </button>
    </div>
  </div>
  <button type="button" class="ai-tool-chip" data-tool="expert" aria-label="专家">
    ${GRID_SVG}
    <span>专家</span>
  </button>`;
}

function closeAllModelMenus(except) {
  mountedToolbars.forEach(container => {
    if (container === except) return;
    const menu = container.querySelector(".ai-model-select-menu");
    const trigger = container.querySelector(".ai-model-select-trigger");
    menu?.classList.add("hidden");
    trigger?.classList.remove("open");
    trigger?.setAttribute("aria-expanded", "false");
  });
}

function closeAllPlusMenus(except) {
  document.querySelectorAll(".ai-composer-plus-menu").forEach(menu => {
    if (except && except.contains(menu)) return;
    menu.classList.add("hidden");
    menu.classList.remove("is-open");
  });
  document.querySelectorAll('[data-tool="plus-menu"]').forEach(btn => {
    if (except && except.contains(btn)) return;
    btn.setAttribute("aria-expanded", "false");
  });
}

function openPlusMenu(plusBtn, plusMenu) {
  if (!plusMenu || !plusBtn) return;
  closeAllPlusMenus();
  closeAllModelMenus();
  plusMenu.classList.remove("hidden");
  plusMenu.classList.add("is-open");
  plusBtn.setAttribute("aria-expanded", "true");
}

function isEventInsidePlusMenu(target) {
  return Boolean(
    target instanceof Element &&
      (target.closest(".ai-composer-plus-wrap") || target.closest(".ai-composer-plus-menu"))
  );
}

function dismissPlusMenusIfOutside(e) {
  if (isEventInsidePlusMenu(e.target)) return;
  closeAllPlusMenus();
}

function syncModelLabels() {
  const model = findModel(selectedModelId);
  document.querySelectorAll(".ai-model-select-label").forEach(el => {
    const preferAuto = el.closest(".header-ai-model-slot") || el.dataset.preferAuto === "true";
    el.textContent = preferAuto && model.id === "auto" ? "自动" : model.name;
  });
  document.querySelectorAll(".ai-model-select-trigger").forEach(el => {
    el.title = `大模型选择：${model.name}`;
  });
  document.querySelectorAll(".ai-model-select-option").forEach(el => {
    const active = el.dataset.modelId === selectedModelId;
    el.classList.toggle("active", active);
    const check = el.querySelector(".ai-model-select-check");
    if (active && !check) {
      el.insertAdjacentHTML("beforeend", `<span class="ai-model-select-check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`);
    } else if (!active && check) {
      check.remove();
    }
  });
}

function selectModel(id) {
  selectedModelId = id;
  syncModelLabels();
  window.dispatchEvent(new CustomEvent("ai-model-change", { detail: { modelId: id, model: findModel(id) } }));
}

function bindModelSelect(container) {
  const wrap = container.querySelector(".ai-model-select-wrap");
  if (!wrap) return;

  const trigger = wrap.querySelector(".ai-model-select-trigger");
  const menu = wrap.querySelector(".ai-model-select-menu");

  trigger?.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = !menu.classList.contains("hidden");
    closeAllModelMenus(container);
    closeAllPlusMenus();
    if (!isOpen) {
      menu.classList.remove("hidden");
      trigger.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu?.querySelectorAll(".ai-model-select-option").forEach(option => {
    option.addEventListener("click", e => {
      e.stopPropagation();
      selectModel(option.dataset.modelId);
      menu.classList.add("hidden");
      trigger.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });
  });
}

function syncKnowledgeBaseButtons() {
  const hasSelected = (window.AiToolModals?.getSelectedKnowledge?.() || []).length > 0;
  mountedToolbars.forEach(container => {
    container.querySelectorAll('[data-tool="knowledge-base"]').forEach(btn => {
      btn.classList.toggle("active", hasSelected);
    });
  });
  syncComposerPlusSelectionBadges();
}

function syncComposerPlusSelectionBadges() {
  const counts = {
    "add-skill": (window.AiToolModals?.getSelectedSkills?.() || []).length,
    "knowledge-base": (window.AiToolModals?.getSelectedKnowledge?.() || []).length,
    mcp: (window.AiToolModals?.getSelectedMcp?.() || []).length
  };
  document.querySelectorAll(".ai-composer-plus-item").forEach(btn => {
    const tool = btn.dataset.tool;
    if (!(tool in counts)) return;
    const count = counts[tool];
    let badge = btn.querySelector(".ai-composer-plus-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "ai-composer-plus-badge";
      badge.setAttribute("aria-hidden", "true");
      btn.appendChild(badge);
    }
    const active = count > 0;
    btn.classList.toggle("has-selection", active);
    btn.classList.toggle("active", active);
    badge.textContent = active ? String(count) : "";
    badge.hidden = !active;
  });
}

function closeAllComposerModeMenus(except) {
  document.querySelectorAll(".ai-composer-mode-menu").forEach(menu => {
    if (except && except.contains(menu)) return;
    menu.classList.add("hidden");
  });
  document.querySelectorAll(".ai-composer-mode-trigger").forEach(btn => {
    if (except && except.contains(btn)) return;
    btn.setAttribute("aria-expanded", "false");
  });
}

function syncWebSearchButtons() {
  if (!isWebSearchModeEnabled()) webSearchEnabled = false;
  mountedToolbars.forEach(container => {
    container.querySelectorAll('[data-tool="websearch"]').forEach(btn => {
      btn.classList.toggle("active", webSearchEnabled);
      btn.setAttribute("aria-pressed", String(webSearchEnabled));
    });
    container.querySelectorAll(".ai-composer-plus-wrap").forEach(wrap => {
      wrap.dataset.websearchEnabled = String(isWebSearchModeEnabled());
    });
  });
}

function setWebSearchEnabled(enabled) {
  webSearchEnabled = Boolean(enabled) && isWebSearchModeEnabled();
  syncWebSearchButtons();
  window.dispatchEvent(new CustomEvent("ai-websearch-change", {
    detail: { enabled: webSearchEnabled, allowed: isWebSearchModeEnabled() }
  }));
}

function syncComposerModeUI() {
  const skillEnabled = isSkillModeEnabled();
  const websearchEnabledFlag = isWebSearchModeEnabled();
  const label = MODE_LABELS[selectedComposerMode] || MODE_LABELS.fast;
  mountedToolbars.forEach(container => {
    const group = container.querySelector(".ai-composer-modes");
    if (group) {
      group.dataset.aiMode = selectedComposerMode;
      const triggerLabel = group.querySelector(".ai-composer-mode-label");
      if (triggerLabel) triggerLabel.textContent = label;
      group.querySelectorAll(".ai-composer-mode-option").forEach(btn => {
        btn.classList.toggle("is-active", btn.dataset.aiMode === selectedComposerMode);
      });
    }
    container.querySelectorAll(".ai-composer-plus-wrap").forEach(wrap => {
      wrap.dataset.skillEnabled = String(skillEnabled);
      wrap.dataset.websearchEnabled = String(websearchEnabledFlag);
    });
  });
  syncWebSearchButtons();
}

function setComposerMode(mode, { emit = true } = {}) {
  if (!mode || mode === selectedComposerMode) {
    syncComposerModeUI();
    closeAllComposerModeMenus();
    return;
  }
  selectedComposerMode = mode;
  syncComposerModeUI();
  closeAllComposerModeMenus();
  if (!isSkillModeEnabled()) {
    const t = window.AiToolModals?.getCurrentType?.();
    if (t === "skill" || t === "mcp") window.AiToolModals?.close?.();
  }
  if (emit) {
    window.dispatchEvent(new CustomEvent("ai-composer-mode-change", {
      detail: { mode, skillEnabled: isSkillModeEnabled(), source: "toolbar" }
    }));
  }
}

function mountAiToolbar(container) {
  if (!container) return;
  container.innerHTML = getAiToolbarHtml({ mode: selectedComposerMode });
  mountedToolbars.add(container);
  syncKnowledgeBaseButtons();
  syncComposerPlusSelectionBadges();
}

function mountModeSelect(container) {
  if (!container) return;
  container.innerHTML = getAiModeSelectHtml({ mode: selectedComposerMode });
  mountedToolbars.add(container);
  bindComposerModes(container);
}

function mountModelSelect(container, options = {}) {
  if (!container) return;
  container.innerHTML = getModelSelectHtml(options);
  mountedToolbars.add(container);
  bindModelSelect(container);
}

function bindComposerModes(container) {
  if (!container) return;
  const modeGroup = container.querySelector(".ai-composer-modes");
  const modeTrigger = modeGroup?.querySelector(".ai-composer-mode-trigger");
  const modeMenu = modeGroup?.querySelector(".ai-composer-mode-menu");

  modeTrigger?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const willOpen = modeMenu && modeMenu.classList.contains("hidden");
    closeAllPlusMenus();
    closeAllComposerModeMenus();
    closeAllModelMenus();
    if (willOpen) {
      modeMenu.classList.remove("hidden");
      modeTrigger.setAttribute("aria-expanded", "true");
    }
  });

  modeGroup?.querySelectorAll(".ai-composer-mode-option").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      setComposerMode(btn.dataset.aiMode);
    });
  });
}

function bindAiToolbar(container) {
  if (!container) return;

  bindModelSelect(container);
  bindComposerModes(container);

  const plusBtn = container.querySelector('[data-tool="plus-menu"]');
  const plusMenu = container.querySelector(".ai-composer-plus-menu");
  plusBtn?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = plusMenu && !plusMenu.classList.contains("hidden");
    closeAllComposerModeMenus();
    if (isOpen) {
      closeAllPlusMenus();
      return;
    }
    openPlusMenu(plusBtn, plusMenu);
  });

  container.querySelectorAll("[data-tool]").forEach(btn => {
    const tool = btn.dataset.tool;
    if (tool === "model-select" || tool === "plus-menu" || tool === "attach" || tool === "mode-select") return;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      closeAllPlusMenus();
      closeAllComposerModeMenus();
      if (tool === "knowledge-base") {
        window.AiToolModals?.open("knowledge");
        return;
      }
      if (tool === "websearch") {
        if (!isWebSearchModeEnabled()) return;
        setWebSearchEnabled(!webSearchEnabled);
        return;
      }
      if (tool === "add-skill") {
        if (!isSkillModeEnabled()) return;
        window.AiToolModals?.open("skill");
        return;
      }
      if (tool === "expert") {
        window.AiToolModals?.open("expert");
        return;
      }
      if (tool === "mcp") {
        if (!isSkillModeEnabled()) return;
        window.AiToolModals?.open("mcp");
      }
    });
  });
}

function bindGlobalMenuDismiss() {
  if (window.__aiComposerMenuDismissBound) return;
  window.__aiComposerMenuDismissBound = true;

  const onDismiss = e => {
    dismissPlusMenusIfOutside(e);
    if (!(e.target instanceof Element) || !e.target.closest(".ai-composer-modes")) {
      closeAllComposerModeMenus();
    }
    if (!(e.target instanceof Element) || !e.target.closest(".ai-model-select-wrap")) {
      closeAllModelMenus();
    }
  };

  // 捕获阶段，避免被面板内 stopPropagation 打断
  window.addEventListener("pointerdown", onDismiss, true);
  window.addEventListener("mousedown", onDismiss, true);
  window.addEventListener("touchstart", onDismiss, true);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeAllPlusMenus();
      closeAllComposerModeMenus();
      closeAllModelMenus();
    }
  });
}

bindGlobalMenuDismiss();
window.addEventListener("ai-knowledge-change", syncKnowledgeBaseButtons);
window.addEventListener("ai-skill-change", syncComposerPlusSelectionBadges);
window.addEventListener("ai-mcp-change", syncComposerPlusSelectionBadges);
window.addEventListener("ai-composer-mode-change", e => {
  const mode = e.detail?.mode;
  if (!mode || e.detail?.source === "toolbar") {
    syncComposerModeUI();
    return;
  }
  setComposerMode(mode, { emit: false });
});

window.addEventListener("ai-websearch-change", e => {
  if (typeof e.detail?.enabled !== "boolean") return;
  if (e.detail.enabled === webSearchEnabled) {
    syncWebSearchButtons();
    return;
  }
  webSearchEnabled = Boolean(e.detail.enabled) && isWebSearchModeEnabled();
  syncWebSearchButtons();
});

window.AiInputTools = {
  getAiToolbarHtml,
  getAiModeSelectHtml,
  getModelSelectHtml,
  mountAiToolbar,
  mountModeSelect,
  mountModelSelect,
  bindAiToolbar,
  closeAllPlusMenus,
  getSelectedModel: () => findModel(selectedModelId),
  setSelectedModel: selectModel,
  getComposerMode: () => selectedComposerMode,
  setComposerMode,
  isWebSearchEnabled: () => webSearchEnabled,
  setWebSearchEnabled,
  getModelGroups: () => LLM_MODEL_GROUPS
};
