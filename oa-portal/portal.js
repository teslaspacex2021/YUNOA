(function () {
"use strict";
const headerAiEntry = document.getElementById("headerAiEntry");
const headerAiInput = document.getElementById("headerAiInput");
const headerAiTextarea = document.getElementById("headerAiTextarea");
const headerAiSend = document.getElementById("headerAiSend");
const headerAiAvatarBtn = document.getElementById("headerAiAvatarBtn");
const headerAiSearchBtn = document.getElementById("headerAiSearchBtn");
const headerAiPlusBtn = document.getElementById("headerAiPlusBtn");
const headerAiPlusMenu = document.getElementById("headerAiPlusMenu");
const headerAiModelSlot = document.getElementById("headerAiModelSlot");

const stickyAiEntry = document.getElementById("stickyAiEntry");
const stickyAiInput = document.getElementById("stickyAiInput");
const stickyAiTextarea = document.getElementById("stickyAiTextarea");
const stickyAiSend = document.getElementById("stickyAiSend");
const stickyAiAvatarBtn = document.getElementById("stickyAiAvatarBtn");
const stickyAiSearchBtn = document.getElementById("stickyAiSearchBtn");
const stickyAiPlusBtn = document.getElementById("stickyAiPlusBtn");
const stickyAiPlusMenu = document.getElementById("stickyAiPlusMenu");
const stickyAiModelSlot = document.getElementById("stickyAiModelSlot");

const SEARCH_PLACEHOLDER = "搜索公文、信息";
const AI_PLACEHOLDER = "向 AI 专家提问，@切换专家，/添加技能";
const AI_COMPACT_PLACEHOLDER = "向 AI 专家提问...";
const SEARCH_PAGE = "../ai-search-results/index.html";

const MENTION_EXPERTS_FALLBACK = [
  { id: "e1", name: "小翼·智能助手", dept: "综合服务部 · 综合支撑 - 办公室 - 智能综合", avatar: "👩‍💼" },
  { id: "e2", name: "小翼·定时任务助手", dept: "综合服务部 · 定时调度与任务提醒", avatar: "⏱️" },
  { id: "e3", name: "小翼·客服", dept: "客户服务部 · 智能客服专员", avatar: "👨‍💼" },
  { id: "e4", name: "小翼·数据", dept: "数据运营部 · 数据分析与指标解读", avatar: "📊" },
  { id: "e5", name: "小翼·营销", dept: "市场营销部 · 营销策划与客户洞察", avatar: "📣" },
  { id: "e6", name: "小翼·审计", dept: "审计部 · 合规审计与风险核查", avatar: "🔍" },
  { id: "e7", name: "小翼·HR", dept: "人力资源部 · 智能人力助理", avatar: "👨‍💻" },
  { id: "e8", name: "小翼·财务", dept: "财务部 · 智能财务助理", avatar: "👩‍💻" },
  { id: "e9", name: "小翼·运维", dept: "信息技术部 · 系统运维与故障排查", avatar: "🛠️" },
  { id: "e10", name: "小翼·商机", dept: "销售支撑部 · 商机挖掘与拓客", avatar: "💡" },
  { id: "e11", name: "小翼·文档", dept: "办公室 · 智能公文助理", avatar: "📄" },
  { id: "e12", name: "小翼·经分", dept: "经营分析部 · 经营分析与报表", avatar: "📈" }
];

const MENTION_SKILLS_FALLBACK = [
  { id: "s1", name: "期刊数据多维分析", desc: "多维度拆解期刊数据", icon: "⚡" },
  { id: "s2", name: "大白话版数据分析", desc: "复杂结论转易懂表达", icon: "📊" },
  { id: "s3", name: "数据可视化", desc: "一键生成图表与汇报素材", icon: "📈" },
  { id: "s4", name: "数据分析技能", desc: "通用数据分析与指标解读", icon: "🔍" },
  { id: "s5", name: "运营数据分析技能", desc: "面向运营场景的指标拆解", icon: "📋" }
];

let headerMode = "search";
let aiComposerMode = "fast"; // fast | think | office
let webSearchEnabled = false;
let aiCompact = false;
/** @type {Array<{id: string, name: string, size: string, ext: string, type: string, url?: string}>} */
let composerAttachments = [];
let attachSeq = 1;
/** @type {Array<{id: string, name: string, icon: string}>} */
let composerSkills = [];
let syncingSkillsFromModal = false;

let mentionState = {
  open: false,
  type: null, // expert | skill
  query: "",
  start: -1,
  end: -1,
  activeIndex: 0,
  items: [],
  textarea: null
};

const aiMentionPopover = document.getElementById("aiMentionPopover");
const aiMentionHead = document.getElementById("aiMentionHead");
const aiMentionList = document.getElementById("aiMentionList");

const MODE_LABELS = {
  fast: "快速模式",
  think: "深度思考",
  office: "办公任务"
};

function bootPortal() {
  if (window.__portalBooted) return;
  window.__portalBooted = true;

  // 头像切换必须优先绑定：即使对话面板初始化失败，搜索/AI 模式仍可切换
  bindHeaderAvatarToggle();

  try {
    window.AiChatPanel?.init?.({ aiLogo: "../public/ailogo.gif", baseDepth: 1, assetBase: "../public" });
  } catch (err) {
    console.error("[portal] AiChatPanel.init failed", err);
  }

  try {
    initHeaderComposer();
    initStickyAiBar();
    bindTabEvents();
    window.addEventListener("ai-chat-panel-open", () => setHeaderMode("search"));
  } catch (err) {
    console.error("[portal] boot failed", err);
  }
}

function bindHeaderAvatarToggle() {
  // 点击由 index.html 内联兜底监听统一分发；此处只挂载完整切换实现
  window.toggleHeaderAiMode = toggleHeaderMode;
  window.setHeaderMode = setHeaderMode;
  window.__headerAvatarBound = true;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootPortal);
} else {
  bootPortal();
}

function initHeaderComposer() {
  setHeaderMode("search");
  setAiComposerMode("fast");
  mountHeaderModelSelects();

  headerAiSearchBtn?.addEventListener("click", () => submitSearch(headerAiInput));
  stickyAiSearchBtn?.addEventListener("click", () => submitSearch(stickyAiInput));

  headerAiSend?.addEventListener("click", () => submitAi(headerAiTextarea));
  stickyAiSend?.addEventListener("click", () => submitAi(stickyAiTextarea));

  bindSearchInput(headerAiInput);
  bindSearchInput(stickyAiInput);
  bindAiTextarea(headerAiTextarea);
  bindAiTextarea(stickyAiTextarea);

  bindPlusMenu(headerAiPlusBtn, headerAiPlusMenu);
  bindPlusMenu(stickyAiPlusBtn, stickyAiPlusMenu);
  bindAiComposerModes();
  syncHeaderPlusSelectionBadges();

  window.addEventListener("ai-skill-change", () => {
    syncHeaderPlusSelectionBadges();
    syncComposerSkillsFromModal();
  });
  window.addEventListener("ai-knowledge-change", syncHeaderPlusSelectionBadges);
  window.addEventListener("ai-mcp-change", syncHeaderPlusSelectionBadges);

  // 整个切换容器（含图标、间隙、内边距）任意处点击都切换模式
  [headerAiEntry, stickyAiEntry].forEach(entry => {
    entry?.querySelector(".header-ai-aside")?.addEventListener("click", e => {
      e.stopPropagation();
      toggleHeaderMode();
    });
  });

  document.getElementById("headerAiExpertBtn")?.addEventListener("click", () => {
    window.AiToolModals?.open("expert");
  });
  document.getElementById("stickyAiExpertBtn")?.addEventListener("click", () => {
    window.AiToolModals?.open("expert");
  });

  bindHeaderAttachments();

  document.querySelectorAll(".header-ai-plus-item").forEach(item => {
    item.addEventListener("click", () => {
      const tool = item.dataset.tool;
      closeAllPlusMenus();
      if (tool === "websearch") {
        if (!isWebSearchEnabled()) return;
        setWebSearchEnabled(!webSearchEnabled);
        return;
      }
      if (tool === "skill") {
        if (!isSkillEnabled()) return;
        window.AiToolModals?.open("skill");
      } else if (tool === "knowledge") {
        window.AiToolModals?.open("knowledge");
      } else if (tool === "mcp") {
        if (!isSkillEnabled()) return;
        window.AiToolModals?.open("mcp");
      }
    });
  });

  document.addEventListener("pointerdown", e => {
    if (!e.target.closest(".header-ai-plus-wrap")) {
      closeAllPlusMenus();
    }
    if (!e.target.closest(".ai-mention-popover") && !e.target.closest(".header-ai-textarea")) {
      closeMentionPopover();
    }
  }, true);

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (mentionState.open) {
      closeMentionPopover();
      return;
    }
    if (headerMode === "ai") setHeaderMode("search");
  });

  window.addEventListener("ai-composer-mode-change", e => {
    if (e.detail?.source === "header") return;
    const mode = e.detail?.mode;
    if (mode && mode !== aiComposerMode) {
      // 由对话面板工具栏切换时，同步头部模式 UI（不再二次派发）
      syncHeaderModeUI(mode);
    }
  });

  window.addEventListener("ai-websearch-change", e => {
    if (typeof e.detail?.enabled !== "boolean") return;
    if (e.detail.enabled === webSearchEnabled) return;
    webSearchEnabled = Boolean(e.detail.enabled) && isWebSearchEnabled();
    document.querySelectorAll('.header-ai-plus-item[data-tool="websearch"]').forEach(btn => {
      btn.classList.toggle("is-active", webSearchEnabled);
      btn.setAttribute("aria-pressed", String(webSearchEnabled));
    });
  });
}

function isSkillEnabled() {
  return aiComposerMode === "office";
}

function isWebSearchEnabled() {
  return aiComposerMode === "think" || aiComposerMode === "office";
}

function syncWebSearchUI() {
  const allowed = isWebSearchEnabled();
  if (!allowed) webSearchEnabled = false;
  document.querySelectorAll('.header-ai-plus-item[data-tool="websearch"]').forEach(btn => {
    btn.classList.toggle("is-active", webSearchEnabled);
    btn.setAttribute("aria-pressed", String(webSearchEnabled));
  });
  window.dispatchEvent(new CustomEvent("ai-websearch-change", {
    detail: { enabled: webSearchEnabled, allowed }
  }));
}

function setWebSearchEnabled(enabled) {
  webSearchEnabled = Boolean(enabled) && isWebSearchEnabled();
  syncWebSearchUI();
}

function closeAllModeMenus() {
  document.querySelectorAll(".header-ai-mode-menu").forEach(menu => menu.classList.add("hidden"));
  document.querySelectorAll(".header-ai-mode-trigger").forEach(btn => {
    btn.setAttribute("aria-expanded", "false");
  });
}

function syncHeaderModeUI(mode) {
  aiComposerMode = mode;
  const skillEnabled = isSkillEnabled();
  const websearchEnabledFlag = isWebSearchEnabled();
  const label = MODE_LABELS[mode] || MODE_LABELS.fast;

  document.querySelectorAll(".header-ai-modes").forEach(group => {
    group.dataset.aiMode = mode;
    const triggerLabel = group.querySelector(".header-ai-mode-label");
    if (triggerLabel) triggerLabel.textContent = label;
    group.querySelectorAll(".header-ai-mode-option").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.aiMode === mode);
    });
  });

  document.querySelectorAll(".header-ai-plus-wrap").forEach(wrap => {
    wrap.dataset.skillEnabled = String(skillEnabled);
    wrap.dataset.websearchEnabled = String(websearchEnabledFlag);
  });

  syncWebSearchUI();
}

function bindAiComposerModes() {
  document.querySelectorAll(".header-ai-modes").forEach(group => {
    const trigger = group.querySelector(".header-ai-mode-trigger");
    const menu = group.querySelector(".header-ai-mode-menu");

    trigger?.addEventListener("click", e => {
      e.stopPropagation();
      const willOpen = menu?.classList.contains("hidden");
      closeAllPlusMenus();
      closeAllModeMenus();
      if (willOpen) {
        menu?.classList.remove("hidden");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    group.querySelectorAll(".header-ai-mode-option").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const mode = btn.dataset.aiMode;
        closeAllModeMenus();
        if (!mode || mode === aiComposerMode) return;
        setAiComposerMode(mode);
      });
    });
  });

  document.addEventListener("pointerdown", e => {
    if (!(e.target instanceof Element)) return;
    if (!e.target.closest(".header-ai-modes")) closeAllModeMenus();
  }, true);
}

function setAiComposerMode(mode) {
  syncHeaderModeUI(mode);
  closeAllModeMenus();

  // 非办公任务时关闭已打开的技能/工具弹窗
  if (!isSkillEnabled()) {
    const t = window.AiToolModals?.getCurrentType?.();
    if (t === "skill" || t === "mcp") window.AiToolModals?.close?.();
  }

  window.dispatchEvent(new CustomEvent("ai-composer-mode-change", {
    detail: { mode, skillEnabled: isSkillEnabled(), source: "header" }
  }));
}

function mountHeaderModelSelects() {
  [headerAiModelSlot, stickyAiModelSlot].forEach(slot => {
    if (!slot || !window.AiInputTools?.mountModelSelect) return;
    window.AiInputTools.mountModelSelect(slot, { autoLabel: "自动" });
    const label = slot.querySelector(".ai-model-select-label");
    if (label) label.dataset.preferAuto = "true";
  });

  syncHeaderModelLabels();
  window.addEventListener("ai-model-change", syncHeaderModelLabels);
}

function syncHeaderModelLabels() {
  const model = window.AiInputTools?.getSelectedModel?.();
  const labelText = !model || model.id === "auto" ? "自动" : model.name;
  document.querySelectorAll(".header-ai-model-slot .ai-model-select-label").forEach(el => {
    el.textContent = labelText;
  });
}

function toggleHeaderMode() {
  // 以 DOM 为准，点击切换容器任意处即在搜索 / AI 间切换
  const isAi = headerAiEntry?.classList.contains("ai-mode");
  setHeaderMode(isAi ? "search" : "ai");
}

function hasComposerContent() {
  return Boolean(
    (headerAiTextarea?.value || "").trim() ||
    (stickyAiTextarea?.value || "").trim() ||
    composerAttachments.length ||
    composerSkills.length
  );
}

function isStickyAiFocused() {
  return Boolean(stickyAiEntry?.contains(document.activeElement));
}

function setHeaderMode(mode) {
  headerMode = mode;
  const isAi = mode === "ai";

  [headerAiEntry, stickyAiEntry].forEach(entry => {
    if (!entry) return;
    entry.classList.toggle("ai-mode", isAi);
    entry.classList.toggle("search-mode", !isAi);
    entry.dataset.mode = mode;
  });

  [headerAiAvatarBtn, stickyAiAvatarBtn].forEach(btn => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(isAi));
    btn.title = isAi ? "当前为 AI专家" : "切换到 AI专家";
    btn.setAttribute("aria-label", btn.title);
  });

  ["headerAiToSearchBtn", "stickyAiToSearchBtn"].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(!isAi));
    btn.title = isAi ? "切换到搜索" : "当前为搜索";
    btn.setAttribute("aria-label", btn.title);
  });

  if (isAi) {
    syncText(headerAiTextarea, stickyAiTextarea);
    syncAiSendState();
    const stickyVisible = stickyAiEntry?.classList.contains("visible");
    // 吸顶且无内容：保持缩起；有内容或顶部输入时再展开
    if (stickyVisible && !hasComposerContent()) {
      setAiCompact(true);
    } else {
      setAiCompact(false);
      requestAnimationFrame(() => {
        const target = stickyVisible ? stickyAiTextarea : headerAiTextarea;
        target?.focus();
      });
    }
  } else {
    setAiCompact(false);
    closeMentionPopover();
    closeAllPlusMenus();
    closeAllModeMenus();
    if (headerAiInput) headerAiInput.placeholder = SEARCH_PLACEHOLDER;
    if (stickyAiInput) stickyAiInput.placeholder = SEARCH_PLACEHOLDER;
  }
}

function setAiCompact(compact) {
  // 有附件/技能时保持展开；纯文本仍可缩成一行
  aiCompact =
    Boolean(compact) &&
    headerMode === "ai" &&
    stickyAiEntry?.classList.contains("visible") &&
    composerAttachments.length === 0 &&
    composerSkills.length === 0;
  stickyAiEntry?.classList.toggle("ai-compact", aiCompact);
  if (stickyAiTextarea) {
    stickyAiTextarea.placeholder = aiCompact ? AI_COMPACT_PLACEHOLDER : AI_PLACEHOLDER;
    if (aiCompact) {
      stickyAiTextarea.style.height = "32px";
    } else {
      autoResize(stickyAiTextarea);
    }
  }
  if (aiCompact) {
    closeAllPlusMenus();
    closeAllModeMenus();
  }
}

function bindSearchInput(input) {
  input?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch(input);
    }
  });

  input?.addEventListener("input", () => {
    if (input === headerAiInput && stickyAiInput) stickyAiInput.value = input.value;
    if (input === stickyAiInput && headerAiInput) headerAiInput.value = input.value;
  });
}

function bindAiTextarea(textarea) {
  textarea?.addEventListener("keydown", e => {
    if (mentionState.open && handleMentionKeydown(e)) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAi(textarea);
    }
  });

  textarea?.addEventListener("input", () => {
    autoResize(textarea);
    syncAiSendState();
    if (textarea === headerAiTextarea && stickyAiTextarea) {
      stickyAiTextarea.value = textarea.value;
      autoResize(stickyAiTextarea);
    }
    if (textarea === stickyAiTextarea && headerAiTextarea) {
      headerAiTextarea.value = textarea.value;
      autoResize(headerAiTextarea);
    }
    updateMentionFromTextarea(textarea);
  });

  textarea?.addEventListener("click", () => updateMentionFromTextarea(textarea));
  textarea?.addEventListener("keyup", e => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      updateMentionFromTextarea(textarea);
    }
  });
}

function detectMentionTrigger(textarea) {
  if (!textarea || headerMode !== "ai") return null;
  const value = textarea.value;
  const caret = textarea.selectionStart ?? value.length;
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s\n])([@／/])([^\s@／/]*)$/);
  if (!match) return null;
  const trigger = match[2] === "／" ? "/" : match[2];
  const query = match[3] || "";
  const start = before.length - match[0].length + match[1].length;
  return { trigger, query, start, end: caret };
}

function getMentionSource(type) {
  if (type === "expert") {
    return window.AiToolModals?.getExperts?.() || MENTION_EXPERTS_FALLBACK;
  }
  return window.AiToolModals?.getSkills?.() || MENTION_SKILLS_FALLBACK;
}

function getMentionItems(type, query) {
  const q = (query || "").trim().toLowerCase();
  const source = getMentionSource(type);
  if (!q) return source.slice();
  return source.filter(item => {
    const hay = type === "expert"
      ? `${item.name} ${item.dept || ""}`
      : `${item.name} ${item.desc || ""}`;
    return hay.toLowerCase().includes(q);
  });
}

function closeMentionPopover() {
  mentionState.open = false;
  mentionState.type = null;
  mentionState.textarea = null;
  mentionState.items = [];
  mentionState.activeIndex = 0;
  if (!aiMentionPopover) return;
  aiMentionPopover.classList.add("hidden");
  aiMentionPopover.hidden = true;
}

function renderMentionList() {
  if (!aiMentionList) return;
  const { items, type, activeIndex } = mentionState;
  if (!items.length) {
    aiMentionList.innerHTML = `<div class="ai-mention-empty">暂无匹配${type === "expert" ? "专家" : "技能"}</div>`;
    return;
  }
  aiMentionList.innerHTML = items
    .map((item, index) => {
      if (type === "expert") {
        return `
        <button type="button" class="ai-mention-item${index === activeIndex ? " is-active" : ""}" data-index="${index}" role="option" aria-selected="${index === activeIndex}">
          <span class="ai-mention-avatar">${item.avatar || "👤"}</span>
          <span class="ai-mention-meta">
            <span class="ai-mention-name">${item.name}</span>
            <span class="ai-mention-sub">${item.dept || ""}</span>
          </span>
        </button>`;
      }
      return `
      <button type="button" class="ai-mention-item${index === activeIndex ? " is-active" : ""}" data-index="${index}" role="option" aria-selected="${index === activeIndex}">
        <span class="ai-mention-avatar is-skill">${item.icon || "⚡"}</span>
        <span class="ai-mention-meta">
          <span class="ai-mention-name">${item.name}</span>
          <span class="ai-mention-sub">${item.desc || ""}</span>
        </span>
      </button>`;
    })
    .join("");

  aiMentionList.querySelectorAll(".ai-mention-item").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      mentionState.activeIndex = Number(btn.dataset.index) || 0;
      aiMentionList.querySelectorAll(".ai-mention-item").forEach((el, i) => {
        el.classList.toggle("is-active", i === mentionState.activeIndex);
      });
    });
    btn.addEventListener("mousedown", e => {
      e.preventDefault();
      selectMentionItem(Number(btn.dataset.index) || 0);
    });
  });
}

function positionMentionPopover(textarea) {
  if (!aiMentionPopover || !textarea) return;
  const rect = textarea.getBoundingClientRect();
  const popW = Math.min(360, window.innerWidth - 32);
  const left = Math.min(
    Math.max(16, rect.left),
    window.innerWidth - popW - 16
  );
  aiMentionPopover.style.width = `${popW}px`;
  aiMentionPopover.style.left = `${left}px`;
  aiMentionPopover.hidden = false;
  aiMentionPopover.classList.remove("hidden");
  // 先显示再量高，优先放在输入框上方
  const popH = aiMentionPopover.offsetHeight || 220;
  let top = rect.top - popH - 8;
  if (top < 8) top = Math.min(rect.bottom + 8, window.innerHeight - popH - 8);
  aiMentionPopover.style.top = `${Math.max(8, top)}px`;
}

function openMentionPopover(textarea, triggerInfo) {
  const type = triggerInfo.trigger === "@" ? "expert" : "skill";
  mentionState.open = true;
  mentionState.type = type;
  mentionState.query = triggerInfo.query;
  mentionState.start = triggerInfo.start;
  mentionState.end = triggerInfo.end;
  mentionState.textarea = textarea;
  mentionState.items = getMentionItems(type, triggerInfo.query);
  mentionState.activeIndex = 0;

  if (aiMentionHead) {
    aiMentionHead.textContent = type === "expert"
      ? "切换数字员工 (@, 一次一位)"
      : "添加技能标签 (/, 可多选)";
  }
  renderMentionList();
  positionMentionPopover(textarea);
  if (type === "expert" && textarea === stickyAiTextarea && aiCompact) {
    setAiCompact(false);
  }
}

function updateMentionFromTextarea(textarea) {
  const info = detectMentionTrigger(textarea);
  if (!info) {
    closeMentionPopover();
    return;
  }
  openMentionPopover(textarea, info);
}

function selectMentionItem(index) {
  const textarea = mentionState.textarea;
  const item = mentionState.items[index];
  if (!textarea || !item) return;

  const value = textarea.value;
  const start = mentionState.start;
  const end = mentionState.end;
  const before = value.slice(0, start);
  const after = value.slice(end);

  // 与数字人面板一致：清除触发词，技能回显为 chips，专家切换头像/标题
  const next = `${before}${after}`.replace(/[ \t]{2,}/g, " ");
  textarea.value = next;
  const caret = Math.min(before.length, next.length);
  textarea.setSelectionRange(caret, caret);

  if (mentionState.type === "expert") {
    window.AiToolModals?.setActiveExpert?.(item.id);
  } else {
    addComposerSkill(item);
  }

  // 同步双输入框
  if (textarea === headerAiTextarea && stickyAiTextarea) stickyAiTextarea.value = textarea.value;
  if (textarea === stickyAiTextarea && headerAiTextarea) headerAiTextarea.value = textarea.value;

  closeMentionPopover();
  autoResize(textarea);
  syncAiSendState();
  setAiCompact(false);
  textarea.focus();
}

function handleMentionKeydown(e) {
  if (!mentionState.open) return false;
  const max = mentionState.items.length;
  if (e.key === "Escape") {
    e.preventDefault();
    closeMentionPopover();
    return true;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!max) return true;
    mentionState.activeIndex = (mentionState.activeIndex + 1) % max;
    renderMentionList();
    return true;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!max) return true;
    mentionState.activeIndex = (mentionState.activeIndex - 1 + max) % max;
    renderMentionList();
    return true;
  }
  if (e.key === "Enter" || e.key === "Tab") {
    if (!max) {
      closeMentionPopover();
      return e.key === "Tab";
    }
    e.preventDefault();
    selectMentionItem(mentionState.activeIndex);
    return true;
  }
  return false;
}

function syncAiSendState() {
  const hasText = Boolean(
    (headerAiTextarea?.value || stickyAiTextarea?.value || "").trim()
  );
  const hasAttach = composerAttachments.length > 0;
  const hasSkills = composerSkills.length > 0;
  const canSend = hasText || hasAttach || hasSkills;
  [headerAiSend, stickyAiSend].forEach(btn => {
    btn?.classList.toggle("has-text", canSend);
  });
}

function formatAttachSize(bytes) {
  if (bytes == null || Number.isNaN(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

function getFileExtLabel(name) {
  const i = name.lastIndexOf(".");
  const ext = i >= 0 ? name.slice(i + 1).toUpperCase() : "FILE";
  return ext.slice(0, 4) || "FILE";
}

function isImageFile(file) {
  return Boolean(file?.type?.startsWith("image/"));
}

function escapeAttachHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bindHeaderAttachments() {
  const headerBtn = document.getElementById("headerAiAttachBtn");
  const stickyBtn = document.getElementById("stickyAiAttachBtn");
  const headerInput = document.getElementById("headerAiFileInput");
  const stickyInput = document.getElementById("stickyAiFileInput");

  const openPicker = (input) => {
    if (headerMode !== "ai") setHeaderMode("ai");
    setAiCompact(false);
    input?.click();
  };

  headerBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    openPicker(headerInput);
  });
  stickyBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    openPicker(stickyInput);
  });

  const onFiles = (input) => {
    const files = Array.from(input?.files || []);
    input.value = "";
    if (!files.length) return;
    files.forEach((file) => addComposerAttachmentFromFile(file));
  };

  headerInput?.addEventListener("change", () => onFiles(headerInput));
  stickyInput?.addEventListener("change", () => onFiles(stickyInput));

  ["headerAiAttachRow", "stickyAiAttachRow"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-attach]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      removeComposerAttachment(btn.dataset.removeAttach);
    });
  });
}

function addComposerAttachmentFromFile(file) {
  const item = {
    id: `att-${attachSeq++}`,
    name: file.name || "附件",
    size: formatAttachSize(file.size),
    ext: getFileExtLabel(file.name || ""),
    type: isImageFile(file) ? "image" : "file",
    url: ""
  };
  if (item.type === "image") {
    try {
      item.url = URL.createObjectURL(file);
    } catch (_) {
      item.type = "file";
    }
  }
  composerAttachments.push(item);
  renderComposerAttachments();
  syncAiSendState();
  setAiCompact(false);
}

function removeComposerAttachment(id) {
  const target = composerAttachments.find((a) => a.id === id);
  if (target?.url) {
    try {
      URL.revokeObjectURL(target.url);
    } catch (_) {}
  }
  composerAttachments = composerAttachments.filter((a) => a.id !== id);
  renderComposerAttachments();
  syncAiSendState();
}

function clearComposerAttachments() {
  composerAttachments.forEach((a) => {
    if (a.url) {
      try {
        URL.revokeObjectURL(a.url);
      } catch (_) {}
    }
  });
  composerAttachments = [];
  renderComposerAttachments();
  syncAiSendState();
}

function renderComposerAttachments() {
  const rows = [
    document.getElementById("headerAiAttachRow"),
    document.getElementById("stickyAiAttachRow")
  ];
  const hasAttach = composerAttachments.length > 0;
  const fileIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  // 输入框内部文件 chip（与参考稿一致）
  const html = hasAttach
    ? composerAttachments
        .map(
          (att) => `<div class="header-ai-file-chip" data-attach-id="${att.id}">
            <span class="header-ai-file-icon">${fileIcon}</span>
            <span class="header-ai-file-name" title="${escapeAttachHtml(att.name)}">${escapeAttachHtml(att.name)}</span>
            <button type="button" class="header-ai-file-remove" data-remove-attach="${att.id}" aria-label="移除附件">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>`
        )
        .join("")
    : "";

  rows.forEach((row) => {
    if (!row) return;
    row.classList.toggle("hidden", !hasAttach);
    row.innerHTML = html;
  });

  [headerAiEntry, stickyAiEntry].forEach((entry) => {
    entry?.classList.toggle("has-attachments", hasAttach);
  });
  ["headerAiAttachBtn", "stickyAiAttachBtn"].forEach((id) => {
    document.getElementById(id)?.classList.toggle("has-attach", hasAttach);
  });

  // 同步数字人面板附件条
  const attachmentBar = document.getElementById("attachmentBar");
  const attachmentText = document.getElementById("attachmentText");
  if (attachmentBar && attachmentText) {
    if (hasAttach) {
      attachmentBar.classList.remove("hidden");
      attachmentText.textContent = composerAttachments.map((a) => a.name).join("、");
    } else {
      attachmentBar.classList.add("hidden");
    }
  }
}

function addComposerSkill(item) {
  if (!item?.id) return;
  if (composerSkills.some((s) => s.id === item.id)) {
    renderComposerSkills();
    return;
  }
  composerSkills.push({
    id: item.id,
    name: item.name,
    icon: item.icon || "🔧"
  });
  const skills = window.AiToolModals?.getSkills?.() || [];
  const found = skills.find((s) => s.id === item.id);
  if (found) found.selected = true;
  renderComposerSkills();
  syncAiSendState();
  setAiCompact(false);
}

function removeComposerSkill(id) {
  composerSkills = composerSkills.filter((s) => s.id !== id);
  const skills = window.AiToolModals?.getSkills?.() || [];
  const found = skills.find((s) => s.id === id);
  if (found) found.selected = false;
  renderComposerSkills();
  syncAiSendState();
}

function clearComposerSkills() {
  composerSkills.forEach((s) => {
    const skills = window.AiToolModals?.getSkills?.() || [];
    const found = skills.find((x) => x.id === s.id);
    if (found) found.selected = false;
  });
  composerSkills = [];
  renderComposerSkills();
  syncAiSendState();
}

function syncComposerSkillsFromModal() {
  if (syncingSkillsFromModal) return;
  if (!window.AiToolModals?.getSelectedSkills) return;
  syncingSkillsFromModal = true;
  try {
    const selected = window.AiToolModals.getSelectedSkills() || [];
    composerSkills = selected.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon || "🔧"
    }));
    renderComposerSkills();
    syncAiSendState();
    if (composerSkills.length) setAiCompact(false);
  } finally {
    syncingSkillsFromModal = false;
  }
}

function renderComposerSkills() {
  const rows = [
    document.getElementById("headerAiSkillChips"),
    document.getElementById("stickyAiSkillChips")
  ];
  const hasSkills = composerSkills.length > 0;
  const html = hasSkills
    ? composerSkills
        .map(
          (s) => `
      <span class="ai-skill-chip" data-skill-id="${escapeAttachHtml(s.id)}">
        <span class="ai-skill-chip-icon" aria-hidden="true">${s.icon || "🔧"}</span>
        <span class="ai-skill-chip-name">${escapeAttachHtml(s.name)}</span>
        <button type="button" class="ai-skill-chip-remove" data-remove-skill="${escapeAttachHtml(s.id)}" aria-label="移除技能 ${escapeAttachHtml(s.name)}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </span>`
        )
        .join("")
    : "";

  rows.forEach((row) => {
    if (!row) return;
    row.classList.toggle("hidden", !hasSkills);
    row.innerHTML = html;
    row.querySelectorAll("[data-remove-skill]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeComposerSkill(btn.dataset.removeSkill);
      });
    });
  });

  [headerAiEntry, stickyAiEntry].forEach((entry) => {
    entry?.classList.toggle("has-skills", hasSkills);
  });
  syncHeaderPlusSelectionBadges();
}

function buildHeaderSendPayload(text) {
  const skillNames = composerSkills.map((s) => s.name).filter(Boolean);
  const attachNames = composerAttachments.map((a) => a.name).filter(Boolean);
  const parts = [];
  if (text) parts.push(text);
  if (skillNames.length) parts.push(`[技能] ${skillNames.join("、")}`);
  if (attachNames.length) parts.push(`[附件] ${attachNames.join("、")}`);
  return parts.join("\n");
}

function autoResize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
}

function syncText(a, b) {
  if (a && b && a.value !== b.value) b.value = a.value;
}

function submitSearch(input) {
  const text = input?.value.trim();
  if (!text) return;
  window.location.href = `${SEARCH_PAGE}?q=${encodeURIComponent(text)}`;
}

function submitAi(textarea) {
  const text = textarea?.value.trim() || "";
  const message = buildHeaderSendPayload(text);
  if (!message) return;

  if (headerAiTextarea) headerAiTextarea.value = "";
  if (stickyAiTextarea) stickyAiTextarea.value = "";
  clearComposerAttachments();
  clearComposerSkills();
  autoResize(headerAiTextarea);
  autoResize(stickyAiTextarea);
  syncAiSendState();
  AiChatPanel.openWithMessage(message);
}

function bindPlusMenu(btn, menu) {
  btn?.addEventListener("click", e => {
    e.stopPropagation();
    const willOpen = menu?.classList.contains("hidden");
    closeAllPlusMenus();
    closeAllModeMenus();
    if (willOpen) {
      menu?.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });
}

function closeAllPlusMenus() {
  [headerAiPlusMenu, stickyAiPlusMenu].forEach(menu => {
    if (menu?.classList) menu.classList.add("hidden");
  });
  [headerAiPlusBtn, stickyAiPlusBtn].forEach(btn => {
    btn?.setAttribute?.("aria-expanded", "false");
  });
}

function getPlusSelectionCount(tool) {
  const modals = window.AiToolModals;
  if (!modals) return 0;
  if (tool === "skill") return (modals.getSelectedSkills?.() || []).length;
  if (tool === "knowledge") return (modals.getSelectedKnowledge?.() || []).length;
  if (tool === "mcp") return (modals.getSelectedMcp?.() || []).length;
  return 0;
}

function syncHeaderPlusSelectionBadges() {
  document.querySelectorAll(".header-ai-plus-item").forEach(btn => {
    const tool = btn.dataset.tool;
    if (!["skill", "knowledge", "mcp"].includes(tool)) return;
    const count = getPlusSelectionCount(tool);
    let badge = btn.querySelector(".header-ai-plus-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "header-ai-plus-badge";
      badge.setAttribute("aria-hidden", "true");
      btn.appendChild(badge);
    }
    const active = count > 0;
    btn.classList.toggle("has-selection", active);
    badge.textContent = active ? String(count) : "";
    badge.hidden = !active;
  });
}

function initStickyAiBar() {
  if (!stickyAiEntry || !headerAiEntry) return;

  let wasVisible = false;

  const update = () => {
    const visible = headerAiEntry.getBoundingClientRect().bottom < 0;
    stickyAiEntry.classList.toggle("visible", visible);

    if (visible && headerMode === "ai") {
      // 无内容且未聚焦：滚动后始终保持缩起
      if (!hasComposerContent() && !isStickyAiFocused()) {
        setAiCompact(true);
      } else if (visible && !wasVisible) {
        // 首次吸顶：有附件/技能则展开，否则缩起
        setAiCompact(!composerAttachments.length && !composerSkills.length);
      }
    }
    if (!visible) {
      setAiCompact(false);
    }
    wasVisible = visible;
  };

  stickyAiEntry.addEventListener("pointerdown", e => {
    if (headerMode !== "ai") return;
    if (e.target.closest(".header-ai-aside")) return;
    if (stickyAiEntry.classList.contains("ai-compact")) {
      setAiCompact(false);
    }
  });

  stickyAiTextarea?.addEventListener("focus", () => {
    if (headerMode === "ai" && stickyAiEntry.classList.contains("visible")) {
      setAiCompact(false);
    }
  });

  stickyAiEntry.addEventListener("focusout", () => {
    if (headerMode !== "ai" || !stickyAiEntry.classList.contains("visible")) return;
    requestAnimationFrame(() => {
      // 失焦后缩回；有附件/技能时 setAiCompact 会拒绝收起
      if (!isStickyAiFocused()) setAiCompact(true);
    });
  });

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function bindTabEvents() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  document.querySelectorAll(".widget-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".widget-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  document.querySelectorAll(".efficiency-head-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".efficiency-head-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  document.querySelectorAll(".efficiency-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".efficiency-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}
})();
