// ===== 真实搜索结果（来自 /public 目录） =====
const MOCK_RESULTS = PublicFiles.list().map(f => ({
  id: f.id,
  tag: f.tag,
  title: f.title,
  date: f.date,
  department: f.department,
  snippet: f.snippet,
  filename: f.filename,
  ext: f.ext,
  size: f.size,
  pageCount: f.pageCount,
  keywords: f.keywords || [],
  fileUrl: PublicFiles.buildFileUrl(f, 1)
}));

const MOCK_AGENTS = [
  {
    id: "ai-draft",
    name: "AI拟稿",
    desc: "智能辅助公文起草、润色与格式规范",
    dept: "数字化运营部",
    icon: "📝",
    color: "blue"
  },
  {
    id: "schedule-assistant",
    name: "日程助手",
    desc: "智能管理个人日程，提醒会议与待办",
    dept: "数字化运营部",
    icon: "📅",
    color: "purple"
  },
  {
    id: "meeting-room",
    name: "会议室预定",
    desc: "快速查询空闲会议室并完成预定",
    dept: "行政部",
    icon: "🏢",
    color: "green"
  },
  {
    id: "visitor-appointment",
    name: "访客预约",
    desc: "访客登记、审批与通行一体化管理",
    dept: "行政部",
    icon: "👤",
    color: "orange"
  }
];

const AI_SUMMARY_TEMPLATES = {
  公文: {
    greeting: "您好！我理解您想了解公司<strong>公文</strong>相关的制度规范、操作手册与同业最佳实践。根据知识库中的真实文档，我为您整理了以下关键信息：",
    conclusion: "建议优先查阅《关于进一步加强公文管理工作的通知》与《公文格式标准与排版规范》，掌握最新管理要求与格式标准；结合《2025年度收发文登记管理办法》规范登记流程，并参考《集团翼办使用手册》完成日常 OA 操作。",
    keyPoints: [
      {
        title: "关于进一步加强公文管理工作的通知",
        content: "集团办公室最新发文，明确公文分类、格式规范与全流程管理要求。",
        subPoints: ["公文分类五类标准", "GB/T 9704 格式要求", "签批归档时限规定"]
      },
      {
        title: "公文格式标准与排版规范",
        content: "统一公文用纸、字体字号、行距段落等排版标准，适用于全集团正式公文。",
        subPoints: ["A4 版面与页边距", "标题/正文字体规范", "行距与首行缩进"]
      },
      {
        title: "2025年度收发文登记管理办法",
        content: "规范收发文登记流程，确保公文可追溯、可查询。",
        subPoints: ["收文 24 小时登记", "发文统一编号规则", "全流程追溯机制"]
      }
    ]
  },
  督办: {
    greeting: "为您找到关于<strong>督办</strong>的核心文档：",
    conclusion: "推荐重点阅读《安全公司督办系统操作手册》，掌握督办任务全流程；并结合《集团翼办使用手册》了解平台层面的待办整合方案。",
    keyPoints: [
      {
        title: "督办任务全流程",
        content: "包括任务创建、派发、跟踪、提醒、归档等环节。",
        subPoints: ["任务模板", "节点配置", "超期提醒"]
      }
    ]
  },
  default: {
    greeting: "您好！根据您的搜索关键词，我为您分析了知识库中的真实文档，整理了以下摘要：",
    conclusion: "以上是知识库中匹配的文档智能摘要。如需了解更多细节，建议下载原文或前往 AI 数字人深入对话。",
    keyPoints: [
      {
        title: "知识库匹配文档",
        content: "已为您找到相关 OA、公文、督办与天翼云解决方案文档。",
        subPoints: ["点击文件卡片可查看原文", "可使用筛选条件进一步缩小范围"]
      }
    ]
  }
};

// ===== DOM 元素 =====
const keywordInput = document.getElementById("keywordInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const queryDisplay = document.getElementById("queryDisplay");
const aiPriorityZone = document.getElementById("aiPriorityZone");
const smartSearchToggle = document.getElementById("smartSearchToggle");
const searchCompactField = document.querySelector(".search-compact-field");
const aiLoading = document.getElementById("aiLoading");
const aiContent = document.getElementById("aiContent");
const aiGreeting = document.getElementById("aiGreeting");
const coreConclusion = document.getElementById("coreConclusion");
const keyPoints = document.getElementById("keyPoints");
const resultList = document.getElementById("resultList");
const resultCount = document.getElementById("resultCount");
const totalCount = document.getElementById("totalCount");
const agentList = document.getElementById("agentList");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const askAiBtn = document.getElementById("askAiBtn");
const aiRecommendCards = document.getElementById("aiRecommendCards");
const aiBrief = document.getElementById("aiBrief");
const aiExpandBtn = document.getElementById("aiExpandBtn");
const viewAllAgents = document.getElementById("viewAllAgents");

let aiExpanded = false;
let smartSearchEnabled = false;
let aiSummaryTimer = null;

function isSmartSearchOn() {
  return Boolean(smartSearchToggle?.checked);
}

function setSmartSearchUI(enabled) {
  smartSearchEnabled = Boolean(enabled);
  if (smartSearchToggle) smartSearchToggle.checked = smartSearchEnabled;
  searchCompactField?.classList.toggle("is-smart-on", smartSearchEnabled);
  document.querySelector(".results-layout")?.classList.toggle("is-traditional", !smartSearchEnabled);
  if (!aiPriorityZone) return;
  if (smartSearchEnabled) {
    aiPriorityZone.hidden = false;
    aiPriorityZone.classList.remove("hidden");
  } else {
    aiPriorityZone.hidden = true;
    aiPriorityZone.classList.add("hidden");
  }
}

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", () => {
  AiChatPanel.init({ aiLogo: "../public/ailogo.gif", baseDepth: 1, assetBase: "../public" });
  initFilterTags();
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) keywordInput.value = q;
  setSmartSearchUI(false);
  performSearch(keywordInput.value);
  bindEvents();
});

function initFilterTags() {
  document.querySelectorAll(".filter-tags").forEach(group => {
    group.querySelectorAll(".tag").forEach(tag => {
      tag.addEventListener("click", () => {
        group.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
        tag.classList.add("active");
      });
    });
  });
}

function bindEvents() {
  searchBtn.addEventListener("click", () => performSearch(keywordInput.value));
  keywordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") performSearch(keywordInput.value);
  });
  resetBtn.addEventListener("click", resetFilters);

  smartSearchToggle?.addEventListener("change", () => {
    setSmartSearchUI(smartSearchToggle.checked);
    performSearch(keywordInput.value);
  });

  const filterToggle = document.getElementById("filterToggle");
  const searchPanel = document.getElementById("searchPanel");
  filterToggle?.addEventListener("click", () => {
    const isCollapsed = searchPanel.classList.toggle("collapsed");
    filterToggle.querySelector(".toggle-label").textContent = isCollapsed ? "高级筛选" : "收起筛选";
  });
  copySummaryBtn?.addEventListener("click", copySummary);
  askAiBtn?.addEventListener("click", () => {
    AiChatPanel.openWithMessage(keywordInput.value.trim() || "请帮我分析当前搜索结果");
  });
  viewAllAgents?.addEventListener("click", () => {
    window.location.href = "agent-plaza.html";
  });
  document.querySelectorAll(".feedback-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".feedback-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  aiExpandBtn?.addEventListener("click", toggleAiExpand);
}

function resetFilters() {
  keywordInput.value = "";
  document.querySelectorAll(".text-input:not(.keyword-input)").forEach(input => {
    input.value = "";
  });
  document.querySelectorAll(".date-input").forEach(input => {
    input.value = "";
  });
  document.querySelectorAll(".filter-tags").forEach(group => {
    group.querySelectorAll(".tag").forEach((tag, i) => {
      tag.classList.toggle("active", i === 0);
    });
  });
}

function performSearch(keyword) {
  const query = keyword.trim() || "公文";
  queryDisplay.textContent = query;
  keywordInput.value = query;

  if (aiSummaryTimer) {
    clearTimeout(aiSummaryTimer);
    aiSummaryTimer = null;
  }

  renderResults(query);

  if (!isSmartSearchOn()) {
    setSmartSearchUI(false);
    return;
  }

  setSmartSearchUI(true);
  aiExpanded = false;
  aiExpandBtn.classList.add("hidden");
  aiExpandBtn.classList.remove("expanded");
  aiExpandBtn.querySelector(".expand-label").textContent = "展开";
  aiContent.classList.add("hidden");
  aiBrief.classList.add("hidden");
  aiRecommendCards.classList.add("hidden");
  aiLoading.classList.remove("hidden");

  aiSummaryTimer = setTimeout(() => {
    if (!isSmartSearchOn()) return;
    renderAiSummary(query);
    renderAiPriorityCards(query);
    renderAgents();
    aiLoading.classList.add("hidden");
    aiRecommendCards.classList.remove("hidden");
    aiBrief.classList.remove("hidden");
    aiExpandBtn.classList.remove("hidden");
  }, 1500);
}

function toggleAiExpand() {
  aiExpanded = !aiExpanded;
  aiContent.classList.toggle("hidden", !aiExpanded);
  aiBrief.classList.toggle("hidden", aiExpanded);
  aiExpandBtn.classList.toggle("expanded", aiExpanded);
  aiExpandBtn.querySelector(".expand-label").textContent = aiExpanded ? "收起" : "展开";
}

function renderAiPriorityCards(keyword) {
  const topResults = getFilteredResults(keyword)
    .filter(item => item.title && item.filename && item.snippet)
    .slice(0, 4);
  aiRecommendCards.innerHTML = topResults.map(item => renderFileCard(item, keyword)).join("");

  aiRecommendCards.querySelectorAll(".ai-interpret-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title;
      AiChatPanel.openWithMessage(`请解读：${title}`);
    });
  });
}

function renderFileCard(item, keyword) {
  const ext = item.ext || "PDF";
  const extClass = ext.toLowerCase();
  return `
    <div class="ai-file-card">
      <span class="ai-file-ext-badge ${extClass}">${ext}</span>
      <div class="ai-file-main">
        <div class="ai-file-row">
          <span class="ai-file-tag">${item.tag}</span>
          <h4 class="ai-file-title">${highlightKeyword(item.title, keyword)}</h4>
          <span class="ai-file-filename" title="${escapeHtml(item.filename)}">📎 ${highlightKeyword(item.filename, keyword)}</span>
          <div class="ai-file-meta">
            <span>${item.date}</span>
            <span class="meta-sep">·</span>
            <span>${item.department}</span>
            <span class="meta-sep">·</span>
            <span>${ext} · ${item.size}${item.pageCount ? " · " + item.pageCount + " 页" : ""}</span>
          </div>
          <div class="ai-file-actions">
            <a href="${item.fileUrl}" class="ai-file-btn primary" target="_blank" rel="noopener">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              查看原文
            </a>
            <button type="button" class="ai-file-btn ai-interpret-btn" data-title="${escapeHtml(item.title)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1677ff"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"/></svg>
              AI 解读
            </button>
          </div>
        </div>
        <p class="ai-file-desc">${item.snippet.replace(/<\/?mark>/g, "")}</p>
      </div>
    </div>
  `;
}

function getFilteredResults(keyword) {
  if (!keyword) return MOCK_RESULTS;
  const lower = keyword.toLowerCase();
  const scored = MOCK_RESULTS.map(r => {
    let score = 0;
    const fields = [r.title, r.filename, r.tag, r.snippet.replace(/<\/?mark>/g, ""), ...(r.keywords || [])];
    fields.forEach(f => {
      if (f && f.toLowerCase().includes(lower)) score += 10;
    });
    if (r.tag === "通知" || r.tag === "制度" || r.tag === "规范") score += 5;
    return { item: r, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.length > 0 ? scored.map(x => x.item) : MOCK_RESULTS;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderAiSummary(keyword) {
  const template = AI_SUMMARY_TEMPLATES[keyword] || AI_SUMMARY_TEMPLATES.default;
  aiGreeting.innerHTML = template.greeting.replace(/<mark>公文<\/mark>/g, `<mark>${keyword}</mark>`);
  aiBrief.textContent = template.conclusion;
  coreConclusion.textContent = template.conclusion;

  keyPoints.innerHTML = template.keyPoints.map((point, index) => `
    <li>
      <strong>${index + 1}. ${point.title}</strong>：${point.content}
      ${point.subPoints ? `<ul>${point.subPoints.map(sp => `<li>${sp}</li>`).join("")}</ul>` : ""}
    </li>
  `).join("");
}

function renderResults(keyword) {
  const results = getFilteredResults(keyword).filter(item => item.title && item.filename && item.snippet);
  resultCount.textContent = results.length;
  totalCount.textContent = results.length;

  resultList.innerHTML = results.map(item => `
    <li class="result-item" data-file-url="${item.fileUrl}">
      <span class="result-tag">[${item.tag}]</span>
      <h4 class="result-title">
        <a href="${item.fileUrl}" target="_blank" rel="noopener">${highlightKeyword(item.title, keyword)}</a>
      </h4>
      <p class="result-meta">${item.date} · ${item.department} · ${item.ext} · ${item.size}${item.pageCount ? " · " + item.pageCount + " 页" : ""}</p>
      <p class="result-snippet">${highlightKeyword(item.snippet.replace(/<\/?mark>/g, ""), keyword)}</p>
      <p class="result-filename">📎 ${item.filename}</p>
    </li>
  `).join("");
}

function highlightKeyword(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${escapeRegex(keyword)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderAgents() {
  agentList.innerHTML = MOCK_AGENTS.map(agent => `
    <button type="button" class="agent-card" data-agent-name="${agent.name}">
      <div class="agent-icon ${agent.color}">${agent.icon}</div>
      <div class="agent-info">
        <div class="agent-name">${agent.name}</div>
        <div class="agent-desc">${agent.desc}</div>
        <div class="agent-dept">发布部门：${agent.dept}</div>
      </div>
    </button>
  `).join("");

  agentList.querySelectorAll(".agent-card").forEach(btn => {
    btn.addEventListener("click", () => {
      AiChatPanel.openWithMessage(`我想使用${btn.dataset.agentName}`);
    });
  });
}

function copySummary() {
  const text = [
    aiGreeting.textContent,
    "",
    "【核心结论】",
    coreConclusion.textContent,
    "",
    "【关键信息分点】",
    ...Array.from(keyPoints.querySelectorAll("li")).map(li => li.textContent)
  ].join("\n");

  navigator.clipboard.writeText(text).then(() => {
    const btn = copySummaryBtn;
    const original = btn.innerHTML;
    btn.innerHTML = "✓ 已复制";
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  });
}
