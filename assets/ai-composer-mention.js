(function (global) {
  "use strict";

  const EXPERTS_FALLBACK = [
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

  const SKILLS_FALLBACK = [
    { id: "s1", name: "期刊数据多维分析", desc: "多维度拆解期刊数据", icon: "⚡" },
    { id: "s2", name: "大白话版数据分析", desc: "复杂结论转易懂表达", icon: "📊" },
    { id: "s3", name: "数据可视化", desc: "一键生成图表与汇报素材", icon: "📈" },
    { id: "s4", name: "数据分析技能", desc: "通用数据分析与指标解读", icon: "🔍" },
    { id: "s5", name: "运营数据分析技能", desc: "面向运营场景的指标拆解", icon: "📋" }
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bind(options = {}) {
    const textarea = options.textarea;
    if (!textarea) return null;

    const popoverId = options.popoverId || "aiComposerMentionPopover";
    const onExpertSelect = typeof options.onExpertSelect === "function" ? options.onExpertSelect : null;
    const onAfterChange = typeof options.onAfterChange === "function" ? options.onAfterChange : null;

    let popover = null;
    let head = null;
    let list = null;
    let skillChips = null;
    let composerSkills = [];
    let mentionState = {
      open: false,
      type: null,
      query: "",
      start: -1,
      end: -1,
      activeIndex: 0,
      items: []
    };

    function ensurePopover() {
      if (popover) return;
      const el = document.createElement("div");
      el.className = "ai-mention-popover hidden";
      el.id = popoverId;
      el.setAttribute("role", "listbox");
      el.setAttribute("aria-label", "联想选择");
      el.hidden = true;
      el.innerHTML = `
        <div class="ai-mention-head">切换专家 (@, 一次一位)</div>
        <div class="ai-mention-list"></div>
      `;
      document.body.appendChild(el);
      popover = el;
      head = el.querySelector(".ai-mention-head");
      list = el.querySelector(".ai-mention-list");
    }

    function ensureSkillChips() {
      if (skillChips) return skillChips;
      const top = textarea.closest(".ai-input-top");
      if (!top) return null;
      const el = document.createElement("div");
      el.className = "ai-skill-chips hidden";
      el.setAttribute("aria-label", "已选技能");
      top.insertBefore(el, textarea);
      skillChips = el;
      return skillChips;
    }

    function detectTrigger() {
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

    function getSource(type) {
      if (type === "expert") {
        return global.AiToolModals?.getExperts?.() || EXPERTS_FALLBACK;
      }
      return global.AiToolModals?.getSkills?.() || SKILLS_FALLBACK;
    }

    function getItems(type, query) {
      const q = (query || "").trim().toLowerCase();
      const source = getSource(type);
      if (!q) return source.slice();
      return source.filter(item => {
        const hay = type === "expert"
          ? `${item.name} ${item.dept || ""}`
          : `${item.name} ${item.desc || ""}`;
        return hay.toLowerCase().includes(q);
      });
    }

    function closePopover() {
      mentionState.open = false;
      mentionState.type = null;
      mentionState.items = [];
      mentionState.activeIndex = 0;
      if (!popover) return;
      popover.classList.add("hidden");
      popover.hidden = true;
    }

    function renderList() {
      if (!list) return;
      const { items, type, activeIndex } = mentionState;
      if (!items.length) {
        list.innerHTML = `<div class="ai-mention-empty">暂无匹配${type === "expert" ? "专家" : "技能"}</div>`;
        return;
      }
      list.innerHTML = items
        .map((item, index) => {
          if (type === "expert") {
            return `
            <button type="button" class="ai-mention-item${index === activeIndex ? " is-active" : ""}" data-index="${index}" role="option" aria-selected="${index === activeIndex}">
              <span class="ai-mention-avatar">${item.avatar || "👤"}</span>
              <span class="ai-mention-meta">
                <span class="ai-mention-name">${escapeHtml(item.name)}</span>
                <span class="ai-mention-sub">${escapeHtml(item.dept || "")}</span>
              </span>
            </button>`;
          }
          return `
          <button type="button" class="ai-mention-item${index === activeIndex ? " is-active" : ""}" data-index="${index}" role="option" aria-selected="${index === activeIndex}">
            <span class="ai-mention-avatar is-skill">${item.icon || "⚡"}</span>
            <span class="ai-mention-meta">
              <span class="ai-mention-name">${escapeHtml(item.name)}</span>
              <span class="ai-mention-sub">${escapeHtml(item.desc || "")}</span>
            </span>
          </button>`;
        })
        .join("");

      list.querySelectorAll(".ai-mention-item").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
          mentionState.activeIndex = Number(btn.dataset.index) || 0;
          list.querySelectorAll(".ai-mention-item").forEach((el, i) => {
            el.classList.toggle("is-active", i === mentionState.activeIndex);
          });
        });
        btn.addEventListener("mousedown", e => {
          e.preventDefault();
          selectItem(Number(btn.dataset.index) || 0);
        });
      });
    }

    function positionPopover() {
      ensurePopover();
      if (!popover) return;
      const rect = textarea.getBoundingClientRect();
      const popW = Math.min(360, window.innerWidth - 32);
      const left = Math.min(Math.max(16, rect.left), window.innerWidth - popW - 16);
      popover.style.width = `${popW}px`;
      popover.style.left = `${left}px`;
      popover.hidden = false;
      popover.classList.remove("hidden");
      const popH = popover.offsetHeight || 220;
      let top = rect.top - popH - 8;
      if (top < 8) top = Math.min(rect.bottom + 8, window.innerHeight - popH - 8);
      popover.style.top = `${Math.max(8, top)}px`;
    }

    function openPopover(info) {
      ensurePopover();
      const type = info.trigger === "@" ? "expert" : "skill";
      mentionState.open = true;
      mentionState.type = type;
      mentionState.query = info.query;
      mentionState.start = info.start;
      mentionState.end = info.end;
      mentionState.items = getItems(type, info.query);
      mentionState.activeIndex = 0;
      if (head) {
        head.textContent = type === "expert"
          ? "切换专家 (@, 一次一位)"
          : "添加技能 (/, 可多选)";
      }
      renderList();
      positionPopover();
    }

    function updateFromTextarea() {
      const info = detectTrigger();
      if (!info) {
        closePopover();
        return;
      }
      openPopover(info);
    }

    function renderComposerSkills() {
      const row = ensureSkillChips();
      if (!row) return;
      if (!composerSkills.length) {
        row.innerHTML = "";
        row.classList.add("hidden");
        return;
      }
      row.classList.remove("hidden");
      row.innerHTML = composerSkills
        .map(s => `
          <span class="ai-skill-chip" data-skill-id="${escapeHtml(s.id)}">
            <span class="ai-skill-chip-icon" aria-hidden="true">${s.icon || "🔧"}</span>
            <span class="ai-skill-chip-name">${escapeHtml(s.name)}</span>
            <button type="button" class="ai-skill-chip-remove" data-remove-skill="${escapeHtml(s.id)}" aria-label="移除技能 ${escapeHtml(s.name)}">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </span>`)
        .join("");
      row.querySelectorAll("[data-remove-skill]").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();
          removeSkill(btn.dataset.removeSkill);
        });
      });
    }

    function addSkill(item) {
      if (!item?.id) return;
      if (composerSkills.some(s => s.id === item.id)) return;
      composerSkills.push({
        id: item.id,
        name: item.name,
        icon: item.icon || "🔧"
      });
      const skills = global.AiToolModals?.getSkills?.() || [];
      const found = skills.find(s => s.id === item.id);
      if (found) found.selected = true;
      renderComposerSkills();
    }

    function removeSkill(id) {
      composerSkills = composerSkills.filter(s => s.id !== id);
      const skills = global.AiToolModals?.getSkills?.() || [];
      const found = skills.find(s => s.id === id);
      if (found) found.selected = false;
      renderComposerSkills();
      onAfterChange?.();
    }

    function clearSkills() {
      composerSkills.forEach(s => {
        const skills = global.AiToolModals?.getSkills?.() || [];
        const found = skills.find(x => x.id === s.id);
        if (found) found.selected = false;
      });
      composerSkills = [];
      renderComposerSkills();
    }

    function replaceTrigger(before, after) {
      const next = `${before}${after}`.replace(/[ \t]{2,}/g, " ");
      textarea.value = next;
      const caret = Math.min(before.length, next.length);
      textarea.setSelectionRange(caret, caret);
    }

    function selectItem(index) {
      const item = mentionState.items[index];
      if (!item) return;
      const value = textarea.value;
      const before = value.slice(0, mentionState.start);
      const after = value.slice(mentionState.end);
      replaceTrigger(before, after);

      if (mentionState.type === "expert") {
        global.AiToolModals?.setActiveExpert?.(item.id);
        onExpertSelect?.(item);
      } else {
        addSkill(item);
      }

      closePopover();
      textarea.focus();
      onAfterChange?.();
    }

    function handleKeydown(e) {
      if (!mentionState.open) return false;
      const max = mentionState.items.length;
      if (e.key === "Escape") {
        e.preventDefault();
        closePopover();
        return true;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!max) return true;
        mentionState.activeIndex = (mentionState.activeIndex + 1) % max;
        renderList();
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!max) return true;
        mentionState.activeIndex = (mentionState.activeIndex - 1 + max) % max;
        renderList();
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        if (!max) {
          closePopover();
          return e.key === "Tab";
        }
        e.preventDefault();
        selectItem(mentionState.activeIndex);
        return true;
      }
      return false;
    }

    function buildSendPayload(text) {
      const skillNames = composerSkills.map(s => s.name).filter(Boolean);
      if (!text && !skillNames.length) return "";
      if (!skillNames.length) return text;
      const skillLine = `[技能] ${skillNames.join("、")}`;
      return text ? `${text}\n${skillLine}` : skillLine;
    }

    ensurePopover();
    ensureSkillChips();

    textarea.addEventListener("input", () => {
      updateFromTextarea();
      onAfterChange?.();
    });
    textarea.addEventListener("click", updateFromTextarea);
    textarea.addEventListener("keyup", e => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        updateFromTextarea();
      }
    });
    textarea.addEventListener("keydown", e => {
      if (handleKeydown(e)) {
        e.stopImmediatePropagation();
      }
    }, true);

    document.addEventListener("pointerdown", e => {
      if (!mentionState.open) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(`#${popoverId}`) || t === textarea || textarea.contains(t)) return;
      closePopover();
    }, true);

    window.addEventListener("resize", () => {
      if (mentionState.open) positionPopover();
    });

    return {
      isOpen: () => mentionState.open,
      close: closePopover,
      getSkills: () => composerSkills.slice(),
      clearSkills,
      buildSendPayload,
      handleKeydown,
      update: updateFromTextarea
    };
  }

  global.AiComposerMention = { bind };
})(window);
