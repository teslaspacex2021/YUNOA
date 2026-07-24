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
  { id: "e1", name: "小翼·智能助手", dept: "综合服务部·智能综合助理", avatar: "👩‍💼" },
  { id: "e2", name: "小翼·客服", dept: "客户服务部·智能客服专员", avatar: "👨‍💼" },
  { id: "e3", name: "小翼·财务", dept: "财务部·智能财务助理", avatar: "👩‍💻" },
  { id: "e4", name: "小翼·人力", dept: "人力资源部·智能人力助理", avatar: "👨‍💻" },
  { id: "e5", name: "小翼·法务", dept: "法务部·智能法务顾问", avatar: "👩‍⚖️" },
  { id: "e6", name: "小翼·公文", dept: "办公室·智能公文助理", avatar: "👨‍🏫" }
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

  document.getElementById("headerAiAttachBtn")?.addEventListener("click", () => {
    document.getElementById("aiUploadBtn")?.click();
  });
  document.getElementById("stickyAiAttachBtn")?.addEventListener("click", () => {
    document.getElementById("aiUploadBtn")?.click();
  });

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
    // 主动切换到 AI 时展开；吸顶出现时的收起由 sticky 滚动逻辑控制
    setAiCompact(false);
    requestAnimationFrame(() => {
      const target = stickyVisible ? stickyAiTextarea : headerAiTextarea;
      target?.focus();
    });
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
  aiCompact = Boolean(compact) && headerMode === "ai" && stickyAiEntry?.classList.contains("visible");
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

  let insert = "";
  if (mentionState.type === "expert") {
    // 一次一位：清掉文本中已有的 @专家
    const cleanedBefore = before.replace(/(^|[\s\n])@[^\s@／/]+/g, "$1");
    const cleanedAfter = after.replace(/(^|[\s\n])@[^\s@／/]+/g, "$1");
    insert = `@${item.name} `;
    const next = `${cleanedBefore}${insert}${cleanedAfter}`.replace(/\s{2,}/g, " ");
    textarea.value = next;
    const caret = cleanedBefore.length + insert.length;
    textarea.setSelectionRange(caret, caret);
    window.AiToolModals?.setActiveExpert?.(item.id);
  } else {
    insert = `/${item.name} `;
    const next = `${before}${insert}${after}`;
    textarea.value = next;
    const caret = before.length + insert.length;
    textarea.setSelectionRange(caret, caret);
  }

  // 同步双输入框
  if (textarea === headerAiTextarea && stickyAiTextarea) stickyAiTextarea.value = textarea.value;
  if (textarea === stickyAiTextarea && headerAiTextarea) headerAiTextarea.value = textarea.value;

  closeMentionPopover();
  autoResize(textarea);
  syncAiSendState();
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
  [headerAiSend, stickyAiSend].forEach(btn => {
    btn?.classList.toggle("has-text", hasText);
  });
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
  const text = textarea?.value.trim();
  if (!text) return;
  if (headerAiTextarea) headerAiTextarea.value = "";
  if (stickyAiTextarea) stickyAiTextarea.value = "";
  autoResize(headerAiTextarea);
  autoResize(stickyAiTextarea);
  syncAiSendState();
  AiChatPanel.openWithMessage(text);
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

function initStickyAiBar() {
  if (!stickyAiEntry || !headerAiEntry) return;

  let wasVisible = false;

  const update = () => {
    const visible = headerAiEntry.getBoundingClientRect().bottom < 0;
    stickyAiEntry.classList.toggle("visible", visible);

    // 吸顶栏出现时：保持当前模式；若是 AI，仅收成一行，不切回公文搜索
    if (visible && !wasVisible && headerMode === "ai") {
      setAiCompact(true);
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
      if (!stickyAiEntry.contains(document.activeElement)) {
        setAiCompact(true);
      }
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
