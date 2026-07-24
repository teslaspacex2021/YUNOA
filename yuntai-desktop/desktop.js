(() => {
  const railItems = document.querySelectorAll(".yt-rail-item[data-module]");
  const yxkPanel = document.getElementById("yxkPanel");
  const sidePanel = document.getElementById("sidePanel");
  const sidePanelInner = document.getElementById("sidePanelInner");
  const mainContent = document.getElementById("mainContent");
  const modulePlaceholder = document.getElementById("modulePlaceholder");
  const modulePlaceholderText = document.getElementById("modulePlaceholderText");
  const oaPortalLink = document.getElementById("oaPortalLink");

  const chatWelcome = document.getElementById("chatWelcome");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const newChatBtn = document.getElementById("yxkNewChatBtn");
  const ytAiToolbar = document.getElementById("ytAiToolbar");
  const ytAiModeSlot = document.getElementById("ytAiModeSlot");
  const ytAiModelSlot = document.getElementById("ytAiModelSlot");

  const MODULE_META = {
    message: { title: "消息", desc: "即时消息与通知中心。" },
    contacts: { title: "通讯录", desc: "查看云公司与集团通讯录。" },
    meeting: { title: "会议", desc: "发起或加入音视频会议。" },
    workbench: { title: "工作台", desc: "常用应用与工作台首页。" },
    oa: {
      title: "OA门户",
      desc: "进入天翼云 OA 门户处理待办与公文。",
      link: true
    },
    "ai-todo": { title: "AI待办", desc: "智能待办与日程提醒。" },
    more: { title: "更多", desc: "更多应用与设置入口。" }
  };

  function setActiveRail(module) {
    railItems.forEach((item) => {
      const active = item.dataset.module === module;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }

  function showYixiaoka() {
    setActiveRail("yixiaoka");
    yxkPanel.classList.remove("hidden");
    sidePanel.classList.add("hidden");
    mainContent.classList.remove("hidden");
    modulePlaceholder.classList.add("hidden");
  }

  function showModule(module) {
    if (module === "yixiaoka") {
      showYixiaoka();
      return;
    }

    if (module === "oa") {
      window.location.href = "../oa-portal/index.html";
      return;
    }

    setActiveRail(module);
    yxkPanel.classList.add("hidden");
    sidePanel.classList.remove("hidden");
    mainContent.classList.add("hidden");
    modulePlaceholder.classList.remove("hidden");

    const meta = MODULE_META[module] || { title: module, desc: "" };
    sidePanelInner.innerHTML = `<h2>${meta.title}</h2><p>${meta.desc}</p>`;
    modulePlaceholderText.textContent = `${meta.title} · 功能预览占位`;
    oaPortalLink.classList.toggle("hidden", !meta.link);
  }

  function setChatStage(hasMessages) {
    mainContent?.classList.toggle("is-welcome", !hasMessages);
    mainContent?.classList.toggle("has-messages", hasMessages);
  }

  function resetChat() {
    chatMessages.innerHTML = "";
    chatMessages.classList.add("hidden");
    chatWelcome.classList.remove("hidden");
    chatInput.value = "";
    syncSendState();
    setChatStage(false);
    chatInput.focus();
  }

  function appendMessage(role, text) {
    chatWelcome.classList.add("hidden");
    chatMessages.classList.remove("hidden");
    setChatStage(true);
    const el = document.createElement("div");
    el.className = `yt-msg ${role}`;
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function syncSendState() {
    const hasText = Boolean(chatInput?.value.trim());
    sendBtn?.classList.toggle("has-text", hasText);
  }

  function sendMessage(raw) {
    const text = (raw ?? chatInput.value).trim();
    if (!text) return;
    appendMessage("user", text);
    chatInput.value = "";
    syncSendState();
    setTimeout(() => {
      appendMessage(
        "ai",
        `我是AI专家，已收到：「${text}」\n\n可继续提问，或从左侧进入智能体广场、日程与知识中心。`
      );
    }, 350);
  }

  function mountSharedAiTools() {
    if (!window.AiInputTools) return;
    if (ytAiToolbar) {
      AiInputTools.mountAiToolbar(ytAiToolbar);
      AiInputTools.bindAiToolbar(ytAiToolbar);
    }
    if (ytAiModeSlot) {
      AiInputTools.mountModeSelect(ytAiModeSlot);
    }
    if (ytAiModelSlot) {
      AiInputTools.mountModelSelect(ytAiModelSlot, { autoLabel: "自动" });
      const modelLabel = ytAiModelSlot.querySelector(".ai-model-select-label");
      if (modelLabel) modelLabel.dataset.preferAuto = "true";
    }
  }

  railItems.forEach((item) => {
    item.addEventListener("click", () => showModule(item.dataset.module));
  });

  newChatBtn?.addEventListener("click", () => {
    showYixiaoka();
    resetChat();
  });

  document.querySelectorAll(".yt-yxk-recent-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      showYixiaoka();
      resetChat();
      appendMessage("user", btn.dataset.chat || btn.textContent.trim());
      appendMessage("ai", `已打开「${btn.dataset.chat}」对话，请问需要我帮您做什么？`);
    });
  });

  sendBtn?.addEventListener("click", () => sendMessage());
  chatInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  chatInput?.addEventListener("input", syncSendState);

  document.querySelectorAll(".yt-suggest").forEach((btn) => {
    btn.addEventListener("click", () => sendMessage(btn.textContent.trim()));
  });

  document.querySelectorAll(".yt-agent-chip:not(a)").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendMessage(`请帮我使用「${btn.textContent.trim()}」`);
    });
  });

  mountSharedAiTools();
  syncSendState();
  setChatStage(false);
  showYixiaoka();
})();
