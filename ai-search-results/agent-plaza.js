const RECOMMEND_AGENTS = [
  {
    id: "enterprise-talent",
    name: "惠企优才",
    desc: "描述：面向企业人才招聘与优才匹配场景",
    dept: "人力资源部",
    icon: "🏢",
    color: "blue",
    stars: 4.8,
    likes: 128,
    views: "2.3k",
    locked: true
  },
  {
    id: "yida",
    name: "翼达2.0",
    desc: "描述：智能营销与客户洞察一体化助手",
    dept: "市场部",
    icon: "🚀",
    color: "orange",
    stars: 4.6,
    likes: 96,
    views: "1.8k"
  },
  {
    id: "marketing",
    name: "营销智能体",
    desc: "描述：营销方案生成、客户画像与商机挖掘",
    dept: "市场部",
    icon: "📣",
    color: "red",
    stars: 4.7,
    likes: 210,
    views: "3.1k"
  },
  {
    id: "job-match",
    name: "人岗匹配",
    desc: "描述：岗位能力模型匹配与人才推荐",
    dept: "人力资源部",
    icon: "🎯",
    color: "purple",
    stars: 4.5,
    likes: 74,
    views: "1.2k",
    locked: true
  }
];

const ALL_AGENTS = [
  {
    id: "enterprise-qa",
    name: "企业知识问答",
    desc: "描述：企业知识库检索与问答服务",
    dept: "数字化运营部",
    icon: "💬",
    color: "blue",
    category: "chat",
    stars: 4.9,
    likes: 320,
    views: "5.6k"
  },
  {
    id: "value-mgmt",
    name: "价值经营",
    desc: "描述：经营数据分析与价值洞察",
    dept: "数字化运营部",
    icon: "📊",
    color: "purple",
    category: "chat",
    stars: 4.7,
    likes: 186,
    views: "2.9k"
  },
  {
    id: "data-ops",
    name: "数据运营智能体",
    desc: "描述：数据看板运营与指标分析",
    dept: "数字化运营部",
    icon: "📈",
    color: "green",
    category: "rd",
    stars: 4.6,
    likes: 142,
    views: "2.1k"
  },
  {
    id: "schedule-test",
    name: "日程调度智能体测试",
    desc: "描述：日程冲突检测与会议协调测试版",
    dept: "数字化运营部",
    icon: "📅",
    color: "orange",
    category: "office",
    stars: 4.3,
    likes: 58,
    views: "980"
  },
  {
    id: "schedule-integrated",
    name: "日程综合调度智能体",
    desc: "描述：跨部门日程统筹与智能调度",
    dept: "数字化运营部",
    icon: "🗓️",
    color: "blue",
    category: "office",
    stars: 4.5,
    likes: 91,
    views: "1.5k"
  },
  {
    id: "ecosystem",
    name: "生态合作智能助手(废弃)",
    desc: "描述：生态伙伴合作流程辅助（已下线）",
    dept: "市场部",
    icon: "🤝",
    color: "orange",
    category: "chat",
    stars: 4.0,
    likes: 24,
    views: "430",
    locked: true
  },
  {
    id: "audit",
    name: "审计整改填报",
    desc: "描述：审计问题整改填报与跟踪",
    dept: "审计部",
    icon: "📋",
    color: "green",
    category: "doc",
    stars: 4.4,
    likes: 67,
    views: "860"
  },
  {
    id: "it-brain",
    name: "【IT大脑】模型审核智能体",
    desc: "描述：AI 模型合规审核与风险评估",
    dept: "数字化运营部",
    icon: "🧠",
    color: "red",
    category: "rd",
    stars: 4.8,
    likes: 175,
    views: "2.4k"
  },
  {
    id: "ai-draft",
    name: "AI拟稿",
    desc: "描述：智能辅助公文起草、润色与格式规范",
    dept: "数字化运营部",
    icon: "📝",
    color: "blue",
    category: "doc",
    stars: 4.7,
    likes: 203,
    views: "3.2k"
  },
  {
    id: "meeting-room",
    name: "会议室预定",
    desc: "描述：快速查询空闲会议室并完成预定",
    dept: "行政部",
    icon: "🏢",
    color: "green",
    category: "office",
    stars: 4.5,
    likes: 118,
    views: "1.7k"
  },
  {
    id: "visitor",
    name: "访客预约",
    desc: "描述：访客登记、审批与通行一体化管理",
    dept: "行政部",
    icon: "👤",
    color: "orange",
    category: "office",
    stars: 4.4,
    likes: 86,
    views: "1.1k"
  },
  {
    id: "risk",
    name: "风险治理",
    desc: "描述：风险洞察、分析、处置与问答",
    dept: "风控部",
    icon: "🛡️",
    color: "red",
    category: "chat",
    stars: 4.8,
    likes: 156,
    views: "2.0k"
  }
];

const CATEGORIES = [
  { id: "all", label: "全部", count: 81 },
  { id: "doc", label: "文档制作", count: 0 },
  { id: "chat", label: "聊天问答", count: 14 },
  { id: "rd", label: "研发辅助", count: 65 },
  { id: "office", label: "办公工具", count: 1 },
  { id: "ocr", label: "图文识别", count: 0 }
];

let activeCategory = "all";
let searchQuery = "";

const recommendGrid = document.getElementById("recommendGrid");
const agentGrid = document.getElementById("agentGrid");
const categoryTabs = document.getElementById("categoryTabs");
const plazaSearchInput = document.getElementById("plazaSearchInput");

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderRecommendAgents();
  renderAllAgents();
  bindEvents();
});

function bindEvents() {
  categoryTabs?.addEventListener("click", e => {
    const tab = e.target.closest(".plaza-category-tab");
    if (!tab) return;
    activeCategory = tab.dataset.category;
    categoryTabs.querySelectorAll(".plaza-category-tab").forEach(el => {
      el.classList.toggle("active", el.dataset.category === activeCategory);
    });
    renderAllAgents();
  });

  plazaSearchInput?.addEventListener("input", e => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderAllAgents();
  });

  document.getElementById("plazaTabs")?.addEventListener("click", e => {
    const tab = e.target.closest(".plaza-tab");
    if (!tab) return;
    document.querySelectorAll(".plaza-tab").forEach(el => el.classList.remove("active"));
    tab.classList.add("active");
  });
}

function renderCategories() {
  if (!categoryTabs) return;
  categoryTabs.innerHTML = CATEGORIES.map(cat => `
    <button type="button" class="plaza-category-tab${cat.id === activeCategory ? " active" : ""}" data-category="${cat.id}">
      ${cat.label} (${cat.count})
    </button>
  `).join("");
}

function buildAgentCard(agent) {
  return `
    <button type="button" class="plaza-agent-card${agent.locked ? " locked" : ""}" data-agent-id="${agent.id}" data-agent-name="${escapeHtml(agent.name)}">
      ${agent.locked ? '<span class="plaza-agent-lock">🔒 无权限</span>' : ""}
      <div class="plaza-agent-icon ${agent.color}">${agent.icon}</div>
      <div class="plaza-agent-name">${escapeHtml(agent.name)}</div>
      <div class="plaza-agent-desc">${escapeHtml(agent.desc)}</div>
      <div class="plaza-agent-dept">发布部门：${escapeHtml(agent.dept)}</div>
      <div class="plaza-agent-stats">
        <span>⭐ ${agent.stars}</span>
        <span>👍 ${agent.likes}</span>
        <span>👁 ${agent.views}</span>
      </div>
    </button>
  `;
}

function renderRecommendAgents() {
  if (!recommendGrid) return;
  recommendGrid.innerHTML = RECOMMEND_AGENTS.map(buildAgentCard).join("");
  bindAgentCards(recommendGrid);
}

function renderAllAgents() {
  if (!agentGrid) return;
  const filtered = ALL_AGENTS.filter(agent => {
    const matchCategory = activeCategory === "all" || agent.category === activeCategory;
    const matchSearch = !searchQuery || [
      agent.name,
      agent.desc,
      agent.dept
    ].join(" ").toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  agentGrid.innerHTML = filtered.length
    ? filtered.map(buildAgentCard).join("")
    : '<p class="plaza-empty">暂无匹配的智能体</p>';

  bindAgentCards(agentGrid);
}

function bindAgentCards(container) {
  container.querySelectorAll(".plaza-agent-card").forEach(card => {
    card.addEventListener("click", () => {
      const agentId = card.dataset.agentId;
      const agentName = card.dataset.agentName;
      window.location.href = `digital-human.html?agent=${encodeURIComponent(agentId)}&q=${encodeURIComponent(`我想使用${agentName}`)}`;
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
