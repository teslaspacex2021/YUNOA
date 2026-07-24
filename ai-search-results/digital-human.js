const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatWelcome = document.getElementById("chatWelcome");
const chatMessages = document.getElementById("chatMessages");
const appLayout = document.querySelector(".app-layout");
const dhThirdPanel = document.getElementById("dhThirdPanel");

const TOTAL_REFS = 19;

const AGENT_RESPONSES = {
  "office-writing": {
    text: "我是办公写作助手，可以帮您起草、润色公文，检查格式规范。已加载《集团翼办使用手册》《安全公司督办系统操作手册》作为知识背景，请告诉我您需要撰写什么类型的公文？",
    plugin: { kind: "references", refCount: 8, label: "已加载 8 条公文规范" }
  },
  "enterprise-qa": {
    text: "我是企业知识问答智能体，已检索企业知识库（《翼办手册》《督办手册》《天翼云解决方案》《竞品分析报告》），可针对公文、督办、办公协同等问题进行解答。请问您想了解什么？",
    plugin: { kind: "references", refCount: TOTAL_REFS, label: `已检索到 ${TOTAL_REFS} 条知识库内容` }
  },
  "marketing": {
    text: "已为您构建营销场景，核心标签、原始数据已生成，请查看右侧工作台。",
    plugin: { kind: "workbench", keyword: "deepseek", label: "进入营销工作台" }
  },
  default: {
    text: "您好！我是天翼云数字人，已为您检索企业知识库：\n\n1. 《集团翼办使用手册》——OA 全模块操作\n2. 《安全公司督办系统操作手册》——督办全流程\n3. 《天翼云解决方案》——政企云方案\n4. 《协同办公竞品分析报告》——同业对比与建议\n\n还有什么我可以帮您的吗？",
    plugin: { kind: "references", refCount: TOTAL_REFS, label: `已检索到 ${TOTAL_REFS} 条检索记录` }
  }
};

let pluginSeq = 0;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const agent = params.get("agent");

  if (query) {
    chatInput.value = query;
    setTimeout(() => sendMessage(query, agent), 500);
  }

  bindEvents();
});

function bindEvents() {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text) sendMessage(text);
  });

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) sendMessage(text);
    }
  });

  document.querySelectorAll(".query-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      chatInput.value = pill.textContent;
      sendMessage(pill.textContent);
    });
  });

  document.querySelectorAll(".agent-shortcut:not(.more)").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const agent = link.dataset.agent;
      const name = link.querySelector("span:last-child").textContent;
      sendMessage(`我想使用${name}`, agent);
    });
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  dhThirdPanel.addEventListener("tp:closed", () => {
    appLayout.classList.remove("with-third");
    document.querySelectorAll(".msg-plugin.active").forEach(b => b.classList.remove("active"));
    delete dhThirdPanel.dataset.triggerId;
  });
}

function pickResponse(text, agentId) {
  if (agentId && AGENT_RESPONSES[agentId]) return AGENT_RESPONSES[agentId];
  const lower = (text || "").toLowerCase();
  if (lower.includes("deepseek") || lower.includes("挖商机") || lower.includes("营销")) {
    return AGENT_RESPONSES.marketing;
  }
  if (lower.includes("写作") || lower.includes("起草") || lower.includes("润色")) {
    return AGENT_RESPONSES["office-writing"];
  }
  if (lower.includes("知识") || lower.includes("问答")) {
    return AGENT_RESPONSES["enterprise-qa"];
  }
  return AGENT_RESPONSES.default;
}

function sendMessage(text, agentId) {
  chatWelcome.classList.add("hidden");
  chatMessages.classList.remove("hidden");

  appendMessage("user", text);
  chatInput.value = "";

  const typingEl = appendMessage("assistant", "正在思考...");
  typingEl.querySelector(".message-content").classList.add("typing");

  setTimeout(() => {
    typingEl.remove();
    const response = pickResponse(text, agentId);
    appendMessage("assistant", response.text, response.plugin);
  }, 1200);
}

function openThirdPanel(plugin) {
  appLayout.classList.add("with-third");
  if (plugin.kind === "references") {
    ThirdPanel.openPanel(dhThirdPanel, "references", ThirdPanel.getReferences(plugin.refCount), { baseDepth: 1 });
  } else if (plugin.kind === "workbench") {
    ThirdPanel.openPanel(dhThirdPanel, "workbench", ThirdPanel.getWorkbench(plugin.keyword));
  }
}

function togglePluginPanel(plugin, trigger) {
  const isOpen = appLayout.classList.contains("with-third");
  const sameTrigger = dhThirdPanel.dataset.triggerId === trigger.id;
  if (isOpen && sameTrigger) {
    ThirdPanel.closePanel(dhThirdPanel);
    appLayout.classList.remove("with-third");
    trigger.classList.remove("active");
  } else {
    document.querySelectorAll(".msg-plugin.active").forEach(b => b.classList.remove("active"));
    openThirdPanel(plugin);
    dhThirdPanel.dataset.triggerId = trigger.id;
    trigger.classList.add("active");
  }
}

function appendMessage(role, content, plugin) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  let pluginHTML = "";
  if (plugin) {
    const id = `dh-tp-${++pluginSeq}`;
    const icon = plugin.kind === "references"
      ? `<span class="msg-plugin-icon">📚</span>`
      : `<span class="msg-plugin-icon">🗂</span>`;
    const count = plugin.kind === "references"
      ? `<span class="msg-plugin-count">${plugin.refCount}</span>`
      : "";
    pluginHTML = `
      <button class="msg-plugin" id="${id}" type="button">
        ${icon}
        <span>${plugin.label}</span>
        ${count}
        <span class="msg-plugin-arrow">›</span>
      </button>
    `;
  }
  div.innerHTML = `
    <div class="message-avatar">${role === "user" ? "我" : "AI"}</div>
    <div>
      <div class="message-content">${content.replace(/\n/g, "<br>")}</div>
      ${pluginHTML}
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (plugin) {
    const trigger = div.querySelector(".msg-plugin");
    trigger.addEventListener("click", () => togglePluginPanel(plugin, trigger));
  }

  return div;
}
