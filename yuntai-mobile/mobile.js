(() => {
  const MESSAGES = [
    {
      name: "数据运营中心",
      tag: "部门",
      tagClass: "dept",
      time: "17:10",
      preview: "[@我]霍永津: @徐攀登 目前数据集…",
      unread: 16,
      avatar: { type: "text", bg: "#1677ff", text: "数据" }
    },
    {
      name: "云台OA开发沟通群",
      tag: "数字化运营",
      time: "16:25",
      preview: "张明: 今晚发布窗口确认一下",
      unread: 3,
      avatar: { type: "grid" }
    },
    {
      name: "黄锐",
      time: "15:48",
      preview: "好的，我这边先改一版给你看",
      unread: 0,
      avatar: { type: "text", bg: "#69b1ff", text: "黄锐" }
    },
    {
      name: "公文督办通知",
      tag: "系统",
      time: "14:02",
      preview: "您有 2 条公文即将超时，请及时处理",
      unread: 5,
      avatar: { type: "notice", text: "📄" }
    },
    {
      name: "云公司市场部",
      tag: "部门",
      tagClass: "dept",
      time: "11:36",
      preview: "李倩: 本周营销素材已上传网盘",
      unread: 14,
      avatar: { type: "text", bg: "#36cfc9", text: "市场" }
    },
    {
      name: "安全专项推进群",
      tag: "项目",
      time: "昨天",
      preview: "[图片]",
      unread: 0,
      avatar: { type: "grid" }
    },
    {
      name: "段磊",
      time: "昨天",
      preview: "会议纪要我整理好了，你看下",
      unread: 1,
      avatar: { type: "text", bg: "#ff85c0", text: "段磊" }
    },
    {
      name: "天翼云数字人助手",
      tag: "AI",
      time: "周一",
      preview: "已为您生成周报草稿，可继续润色",
      unread: 0,
      avatar: { type: "system", text: "AI" }
    }
  ];

  const SUGGEST_SETS = [
    ["请问这里有什么风险", "你能识别到风险的个数是多少", "举例分析风险类型占比", "如何治理这些风险"],
    ["帮我总结今日待办", "起草一份会议纪要", "如何修改 OA 密码？", "本周工作周报模板"],
    ["查询空闲会议室", "公文格式规范有哪些？", "生成部门业务通知单", "解释一下云主机规格选型"]
  ];

  const msgList = document.getElementById("msgList");
  const yxkSuggests = document.getElementById("yxkSuggests");
  const yxkWelcome = document.getElementById("yxkWelcome");
  const yxkMessages = document.getElementById("yxkMessages");
  const yxkInput = document.getElementById("yxkInput");
  const yxkSendBtn = document.getElementById("yxkSendBtn");
  const yxkComposer = document.getElementById("yxkComposer");
  const yxkPlusBtn = document.getElementById("yxkPlusBtn");
  const yxkPlusSheet = document.getElementById("yxkPlusSheet");
  const yxkPlusSheetMask = document.getElementById("yxkPlusSheetMask");
  const yxkPlusSheetPanel = yxkPlusSheet?.querySelector(".yxk-sheet-panel");
  const yxkPlusWrap = document.querySelector(".yxk-plus-wrap");
  const yxkKeyboard = document.getElementById("yxkKeyboard");
  const placeholderTitle = document.getElementById("placeholderTitle");
  const yxkSheetModeMeta = document.getElementById("yxkSheetModeMeta");
  const yxkSheetModeBadge = document.getElementById("yxkSheetModeBadge");
  const yxkSheetModeBack = document.getElementById("yxkSheetModeBack");
  const yxkSheetModelMeta = document.getElementById("yxkSheetModelMeta");
  const yxkSheetModelBadge = document.getElementById("yxkSheetModelBadge");
  const yxkSheetModelBack = document.getElementById("yxkSheetModelBack");
  const yxkVoiceBtn = document.getElementById("yxkVoiceBtn");
  const yxkKeyboardBtn = document.getElementById("yxkKeyboardBtn");
  const yxkHoldSpeak = document.getElementById("yxkHoldSpeak");
  const yxkVoiceOverlay = document.getElementById("yxkVoiceOverlay");
  const yxkVoiceTip = document.getElementById("yxkVoiceTip");
  const yxkExpertScroller = document.getElementById("yxkExpertScroller");
  const yxkExpertBar = document.getElementById("yxkExpertBar");
  const yxkActiveExpert = document.getElementById("yxkActiveExpert");
  const yxkComposerExtras = document.getElementById("yxkComposerExtras");
  const yxkAttachRow = document.getElementById("yxkAttachRow");
  const yxkSkillRow = document.getElementById("yxkSkillRow");
  const yxkExpertMore = document.getElementById("yxkExpertMore");
  const yxkNavTitle = document.getElementById("yxkNavTitle");
  const yxkTitleSwitchBtn = document.getElementById("yxkTitleSwitchBtn");
  const yxkAgentSwitcher = document.getElementById("yxkAgentSwitcher");
  const yxkHi = document.querySelector(".yxk-hi");
  const yxkAsk = document.querySelector(".yxk-ask");
  const pageYxk = document.getElementById("page-yxk");

  const pages = {
    messages: document.getElementById("page-messages"),
    yxk: document.getElementById("page-yxk"),
    experts: document.getElementById("page-experts"),
    toolPicker: document.getElementById("page-tool-picker"),
    placeholder: document.getElementById("page-placeholder")
  };
  const phoneFrame = document.querySelector(".phone-frame");
  const expertsGrid = document.getElementById("expertsGrid");
  const expertsSearchInput = document.getElementById("expertsSearchInput");
  const expertsCats = document.getElementById("expertsCats");
  const tpNavTitle = document.getElementById("tpNavTitle");
  const tpSearchInput = document.getElementById("tpSearchInput");
  const tpCats = document.getElementById("tpCats");
  const tpCount = document.getElementById("tpCount");
  const tpCreateBtn = document.getElementById("tpCreateBtn");
  const tpTags = document.getElementById("tpTags");
  const tpList = document.getElementById("tpList");
  const yxkHistoryBtn = document.getElementById("yxkHistoryBtn");
  const yxkHistoryDrawer = document.getElementById("yxkHistoryDrawer");
  const yxkHistoryMask = document.getElementById("yxkHistoryMask");
  const yxkHistoryList = document.getElementById("yxkHistoryList");
  const yxkHistorySearch = document.getElementById("yxkHistorySearch");
  const yxkHistoryCloseBtn = document.getElementById("yxkHistoryCloseBtn");
  const yxkHistoryNewBtn = document.getElementById("yxkHistoryNewBtn");

  const tabItems = document.querySelectorAll(".tab-item");
  let suggestIndex = 0;
  let aiMode = "fast";
  let selectedModel = "auto";
  let voiceMode = false;
  let recording = false;
  let recordWillCancel = false;
  let recordStartY = 0;
  let recordPointerId = null;
  let activeExpertId = null;

  const CANCEL_SLIDE_PX = 56;
  const VOICE_TIP_SEND = "松手发送，上移取消";
  const VOICE_TIP_CANCEL = "松开手指，取消发送";

  const DEFAULT_EXPERT = {
    id: null,
    name: "AI专家",
    title: "AI专家",
    greet: "我是AI专家",
    ask: "请问有什么我能帮的吗？",
    desc: "",
    tags: [],
    cat: "all",
    avatar: "AI",
    color: "#1677ff"
  };

  const EXPERTS = [
    {
      id: "audit",
      name: "审计整改填报",
      title: "审计整改专家",
      greet: "我是审计整改填报专家",
      ask: "可协助审计问题整改填报与跟踪。",
      desc: "审计问题整改填报、跟踪闭环与材料归档辅助。",
      tags: ["审计", "整改"],
      cat: "ops",
      avatar: "审",
      color: "#52c41a",
      chip: true
    },
    {
      id: "datalake",
      name: "手工数据入湖智能体",
      title: "数据入湖助手",
      greet: "我是手工数据入湖智能体",
      ask: "可协助手工数据校验、入湖与异常排查。",
      desc: "手工数据校验、入湖编排与异常排查一体化处理。",
      tags: ["数据", "入湖"],
      cat: "tech",
      avatar: "湖",
      color: "#1677ff",
      chip: true
    },
    {
      id: "cloud-prov",
      name: "云省协同智能助手",
      title: "云省协同助手",
      greet: "我是云省协同智能助手",
      ask: "可协助云省协同事项沟通与进度同步。",
      desc: "云省协同事项沟通、进度同步与纪要整理。",
      tags: ["协同", "云省"],
      cat: "ops",
      avatar: "云",
      color: "#13c2c2",
      chip: true
    },
    {
      id: "senior-dev",
      name: "吴八哥",
      title: "高级开发工程师",
      greet: "我是高级开发工程师吴八哥",
      ask: "可协助全栈开发、架构设计与疑难排查。",
      desc: "10年以上全栈经验，擅长架构设计与复杂问题拆解落地。",
      tags: ["高级开发", "架构设计"],
      cat: "tech",
      avatar: "吴",
      color: "#2f54eb",
      chip: true
    },
    {
      id: "content",
      name: "文博凯",
      title: "内容创作专家",
      greet: "我是内容创作专家文博凯",
      ask: "可协助多平台内容创作与品牌故事打磨。",
      desc: "多平台内容策划、品牌故事与传播文案一站式支持。",
      tags: ["内容", "品牌"],
      cat: "tencent",
      avatar: "文",
      color: "#eb2f96",
      chip: true
    },
    {
      id: "meituan",
      name: "美团生活助手",
      title: "生活服务专家",
      greet: "我是美团生活助手",
      ask: "可协助餐饮优惠、本地团购与出行推荐。",
      desc: "餐饮优惠、本地团购与出行推荐，帮你更快做决策。",
      tags: ["生活", "优惠"],
      cat: "ops",
      avatar: "团",
      color: "#fa8c16"
    },
    {
      id: "partner",
      name: "FBSir",
      title: "超级合伙人",
      greet: "我是超级合伙人 FBSir",
      ask: "可协助目标拆解与可落地结果产出。",
      desc: "聚焦目标执行，产出可直接使用的方案与结果。",
      tags: ["合伙人", "执行"],
      cat: "tencent",
      avatar: "F",
      color: "#722ed1"
    },
    {
      id: "industry",
      name: "产业场景研究员",
      title: "产业场景研究员",
      greet: "我是产业场景研究员",
      ask: "可协助产业定位与流程场景梳理。",
      desc: "产业定位、业务流程与场景落地路径研究。",
      tags: ["产业", "场景"],
      cat: "tech",
      avatar: "研",
      color: "#08979c"
    },
    {
      id: "news",
      name: "资讯速递专家",
      title: "资讯速递专家",
      greet: "我是资讯速递专家",
      ask: "可提供 AI 模型/产品/行业每日速览。",
      desc: "每日 AI 模型、产品与行业资讯精选速递。",
      tags: ["资讯", "AI"],
      cat: "tencent",
      avatar: "讯",
      color: "#cf1322"
    },
    {
      id: "startup",
      name: "创业搭子",
      title: "创业搭子",
      greet: "我是你的创业搭子",
      ask: "可协助阅读材料与创业判断讨论。",
      desc: "陪你读材料、做判断，一起推进创业关键决策。",
      tags: ["创业", "判断"],
      cat: "ops",
      avatar: "创",
      color: "#d48806"
    },
    {
      id: "longdoc",
      name: "长文写作助手",
      title: "长文写作助手",
      greet: "我是长文写作助手",
      ask: "可协助材料梳理与清晰结构成文。",
      desc: "把零散材料整理成结构清晰、可直接交付的长文。",
      tags: ["写作", "长文"],
      cat: "tech",
      avatar: "写",
      color: "#1d39c4"
    }
  ];

  let expertCat = "all";
  let expertQuery = "";
  let expertsReturnPage = "yxk";
  let pickerType = "knowledge";
  let composerAttachments = [];
  let attachSeq = 1;
  let pickerNav = "public";
  let pickerQuery = "";
  let pickerReturnPage = "yxk";
  let historyQuery = "";
  let currentSessionId = null;

  const CHAT_SESSIONS = [
    {
      id: "h1",
      title: "本周工作总结起草",
      preview: "帮我整理本周待办并生成工作总结提纲",
      group: "今天",
      pinned: true,
      messages: [
        { role: "user", text: "帮我整理本周待办并生成工作总结提纲" },
        { role: "ai", text: "可以。建议按「重点推进 / 日常事项 / 风险事项」三段整理，需要我按这个结构直接起草一版吗？" }
      ]
    },
    {
      id: "h2",
      title: "公文格式校对",
      preview: "请检查这份请示的标题与主送机关是否规范",
      group: "今天",
      pinned: false,
      messages: [
        { role: "user", text: "请检查这份请示的标题与主送机关是否规范" },
        { role: "ai", text: "已核对：标题宜用「关于××的请示」，主送机关建议保留一个主要受文单位。" }
      ]
    },
    {
      id: "h3",
      title: "会议纪要润色",
      preview: "把刚才的会议要点改成正式纪要",
      group: "昨天",
      pinned: false,
      messages: [
        { role: "user", text: "把刚才的会议要点改成正式纪要" },
        { role: "ai", text: "已按「会议基本信息 / 议题讨论 / 决议事项 / 后续安排」整理完成。" }
      ]
    },
    {
      id: "h4",
      title: "差旅报销说明",
      preview: "如何填写跨省差旅补助明细？",
      group: "昨天",
      pinned: false,
      messages: [
        { role: "user", text: "如何填写跨省差旅补助明细？" },
        { role: "ai", text: "按出发地、目的地、天数与标准分项填写，票据与行程单需一一对应。" }
      ]
    },
    {
      id: "h5",
      title: "云省协同进度同步",
      preview: "汇总本月云省协同事项进展",
      group: "更早",
      pinned: false,
      messages: [
        { role: "user", text: "汇总本月云省协同事项进展" },
        { role: "ai", text: "本月共 6 项在推，其中 2 项已闭环，4 项推进中，是否需要导出周报模板？" }
      ]
    }
  ];

  const MOCK_SKILLS = [
    { id: "s1", name: "期刊数据多维分析", desc: "多维度拆解期刊数据，快速输出分析结论", icon: "⚡", color: "#722ed1", selected: true, nav: "public" },
    { id: "s2", name: "大白话版数据分析", desc: "把复杂数据结论转成易懂表达", icon: "📊", color: "#1677ff", selected: true, nav: "public" },
    { id: "s3", name: "数据可视化", desc: "一键生成图表与汇报素材", icon: "📈", color: "#52c41a", selected: true, nav: "public" },
    { id: "s4", name: "数据分析技能", desc: "通用数据分析与指标解读", icon: "🔍", color: "#fa8c16", selected: false, nav: "public" },
    { id: "s5", name: "运营数据分析技能", desc: "面向运营场景的指标拆解与建议", icon: "📋", color: "#13c2c2", selected: false, nav: "custom" }
  ];

  const MOCK_KNOWLEDGE = [
    { id: "k1", name: "集团翼办使用手册", desc: "集团办公室 · 操作手册", icon: "📘", color: "#1677ff", selected: false, nav: "public" },
    { id: "k2", name: "公文格式标准与排版规范", desc: "综合管理部 · 规范", icon: "📄", color: "#52c41a", selected: false, nav: "public" },
    { id: "k3", name: "2025年度收发文登记管理办法", desc: "集团办公室 · 制度", icon: "📋", color: "#722ed1", selected: false, nav: "department" },
    { id: "k4", name: "请示报告工作规范", desc: "人力资源部 · 规范", icon: "📝", color: "#fa8c16", selected: false, nav: "department" },
    { id: "k5", name: "安全公司督办系统操作手册", desc: "安全公司 · 操作手册", icon: "🛡️", color: "#13c2c2", selected: false, nav: "personal" },
    { id: "k6", name: "协同办公竞品分析报告", desc: "数字化运营部 · 分析报告", icon: "📊", color: "#eb2f96", selected: false, nav: "personal" },
    { id: "k7", name: "关于进一步加强公文管理工作的通知", desc: "集团办公室 · 通知", icon: "📢", color: "#ff4d4f", selected: false, nav: "public" },
    { id: "k8", name: "天翼云解决方案", desc: "政企事业部 · 方案", icon: "☁️", color: "#2f54eb", selected: false, nav: "department" }
  ];

  const MOCK_MCP = [
    { id: "m1", name: "公文检索", desc: "检索公文、制度与历史文件", icon: "🔎", color: "#1677ff", selected: true, connected: true, nav: "public" },
    { id: "m2", name: "日程助手", desc: "查询日程并生成会议纪要提纲", icon: "📅", color: "#52c41a", selected: true, connected: true, nav: "public" },
    { id: "m3", name: "邮件助手", desc: "起草、润色与分类邮件", icon: "✉️", color: "#722ed1", selected: true, connected: true, nav: "public" },
    { id: "m4", name: "数据看板", desc: "拉取关键业务指标并生成摘要", icon: "📉", color: "#fa8c16", selected: false, connected: false, nav: "public" },
    { id: "m5", name: "自建审批查询", desc: "查询本部门审批单进度", icon: "🛠️", color: "#13c2c2", selected: false, connected: false, nav: "custom" }
  ];

  const PICKER_CONFIG = {
    skill: {
      title: "技能",
      searchPlaceholder: "搜索技能",
      createLabel: "创建技能",
      showCreate: true,
      doneLabel: "技能",
      nav: [
        { id: "public", label: "公共技能" },
        { id: "custom", label: "自建技能" }
      ],
      items: () => MOCK_SKILLS
    },
    knowledge: {
      title: "智库",
      searchPlaceholder: "搜索知识",
      createLabel: "",
      showCreate: false,
      doneLabel: "智库",
      nav: [
        { id: "public", label: "公共智库" },
        { id: "department", label: "部门智库" },
        { id: "personal", label: "我的收藏" }
      ],
      items: () => MOCK_KNOWLEDGE
    },
    mcp: {
      title: "工具",
      searchPlaceholder: "搜索工具",
      createLabel: "",
      showCreate: false,
      doneLabel: "工具",
      nav: [
        { id: "public", label: "公共工具" },
        { id: "custom", label: "自建工具" }
      ],
      items: () => MOCK_MCP
    }
  };

  const MODE_LABELS = {
    fast: "快速模式",
    think: "深度思考",
    office: "办公任务"
  };

  const MODE_BADGES = {
    fast: "A",
    think: "深",
    office: "办"
  };

  const MODEL_LABELS = {
    auto: "Auto",
    deepseek: "DeepSeek",
    qwen: "通义千问"
  };

  const MODEL_BADGES = {
    auto: "A",
    deepseek: "D",
    qwen: "通"
  };

  const IDLE_PLACEHOLDER = "发消息或按住说话";
  const FOCUS_PLACEHOLDER = "发消息...";

  function avatarHtml(avatar) {
    if (avatar.type === "grid") {
      return `<div class="msg-avatar grid"><span></span><span></span><span></span><span></span></div>`;
    }
    if (avatar.type === "notice") {
      return `<div class="msg-avatar notice">${avatar.text}</div>`;
    }
    if (avatar.type === "system") {
      return `<div class="msg-avatar system">${avatar.text}</div>`;
    }
    return `<div class="msg-avatar" style="background:${avatar.bg}">${avatar.text}</div>`;
  }

  function renderMessages() {
    msgList.innerHTML = MESSAGES.map((m) => `
      <article class="msg-item">
        ${avatarHtml(m.avatar)}
        <div class="msg-body">
          <div class="msg-row1">
            <span class="msg-name">${m.name}</span>
            ${m.tag ? `<span class="msg-tag ${m.tagClass || ""}">${m.tag}</span>` : ""}
            <span class="msg-time">${m.time}</span>
          </div>
          <div class="msg-row2">
            <span class="msg-preview">${m.preview}</span>
            ${m.unread ? `<span class="msg-unread">${m.unread}</span>` : ""}
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderSuggests() {
    const list = SUGGEST_SETS[suggestIndex % SUGGEST_SETS.length];
    yxkSuggests.innerHTML = list
      .map((t) => `<button type="button" class="yxk-suggest">${t}</button>`)
      .join("");
    yxkSuggests.querySelectorAll(".yxk-suggest").forEach((btn) => {
      btn.addEventListener("click", () => sendYxk(btn.textContent.trim()));
    });
  }

  function showPage(name) {
    Object.values(pages).forEach((p) => p?.classList.remove("is-active"));
    phoneFrame?.classList.toggle("yxk-open", name === "yxk");
    phoneFrame?.classList.toggle("experts-open", name === "experts");
    phoneFrame?.classList.toggle("picker-open", name === "tool-picker");
    if (name === "messages" || name === "yxk" || name === "experts" || name === "tool-picker") {
      const pageKey = name === "tool-picker" ? "toolPicker" : name;
      pages[pageKey]?.classList.add("is-active");
    } else {
      pages.placeholder?.classList.add("is-active");
      const titles = {
        contacts: "通讯录",
        workbench: "工作台",
        more: "更多"
      };
      if (placeholderTitle) placeholderTitle.textContent = titles[name] || name;
    }
  }

  function setActiveTab(tab) {
    tabItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.tab === tab);
    });
  }

  function switchTab(tab) {
    toggleTitleSwitcher(false);
    closeHistoryDrawer();
    setActiveTab(tab);
    if (tab === "yxk") showPage("yxk");
    else if (tab === "messages") showPage("messages");
    else showPage(tab);
  }

  function getActiveExpert() {
    return EXPERTS.find((e) => e.id === activeExpertId) || DEFAULT_EXPERT;
  }

  function getChipExperts() {
    const pinned = EXPERTS.filter((e) => e.chip);
    return pinned.length ? pinned : EXPERTS.slice(0, 5);
  }

  function renderExpertChips() {
    if (!yxkExpertScroller) return;
    yxkExpertScroller.innerHTML = getChipExperts()
      .map(
        (e) => `
      <button type="button" class="yxk-expert-chip${e.id === activeExpertId ? " is-active" : ""}" data-expert-id="${e.id}" role="option" aria-selected="${e.id === activeExpertId}">
        ${e.name}
      </button>`
      )
      .join("");
    yxkExpertScroller.querySelectorAll(".yxk-expert-chip").forEach((chip) => {
      chip.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openExpertChat(chip.dataset.expertId);
      });
    });
  }

  function renderActiveExpert() {
    if (!yxkActiveExpert) return;
    const expert = getActiveExpert();
    const isActive = Boolean(activeExpertId) && expert.id;
    if (!isActive) {
      yxkActiveExpert.classList.add("hidden");
      yxkActiveExpert.innerHTML = "";
      if (yxkExpertBar) yxkExpertBar.classList.remove("hidden");
      return;
    }
    if (yxkExpertBar) yxkExpertBar.classList.add("hidden");
    yxkActiveExpert.classList.remove("hidden");
    yxkActiveExpert.innerHTML = `
      <span class="yxk-active-expert-avatar" style="background:${expert.color}">${expert.avatar}</span>
      <span class="yxk-active-expert-name">${expert.name}</span>
      <button type="button" class="yxk-active-expert-remove" aria-label="取消选择专家">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>`;
    const removeBtn = yxkActiveExpert.querySelector(".yxk-active-expert-remove");
    if (removeBtn) {
      removeBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        clearExpertSelection();
      });
    }
  }

  function getSelectedSkills() {
    if (aiMode !== "office") return [];
    return MOCK_SKILLS.filter((s) => s.selected);
  }

  function mockImageDataUri(label, color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.45"/>
      </linearGradient></defs>
      <rect width="112" height="112" fill="url(#g)"/>
      <text x="56" y="60" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function addComposerAttachment(item) {
    composerAttachments.push({
      id: `att-${attachSeq++}`,
      type: item.type || "file",
      name: item.name || "附件",
      size: item.size || "",
      ext: item.ext || "",
      url: item.url || ""
    });
    renderComposerExtras();
    setComposerFocused(true);
  }

  function removeComposerAttachment(id) {
    composerAttachments = composerAttachments.filter((a) => a.id !== id);
    renderComposerExtras();
    syncSendState();
  }

  function clearComposerAttachments() {
    composerAttachments = [];
    renderComposerExtras();
  }

  function removeComposerSkill(id) {
    const skill = MOCK_SKILLS.find((s) => s.id === id);
    if (skill) skill.selected = false;
    renderComposerExtras();
  }

  function renderComposerExtras() {
    if (!yxkComposerExtras || !yxkAttachRow || !yxkSkillRow) return;
    const skills = getSelectedSkills();
    const hasAttach = composerAttachments.length > 0;
    const hasSkills = skills.length > 0;
    const hasExtras = hasAttach || hasSkills;

    yxkComposer?.classList.toggle("has-extras", hasExtras);
    yxkComposerExtras.classList.toggle("hidden", !hasExtras);
    yxkAttachRow.classList.toggle("hidden", !hasAttach);
    yxkSkillRow.classList.toggle("hidden", !hasSkills);

    if (hasAttach) {
      yxkAttachRow.innerHTML = composerAttachments
        .map((att) => {
          if (att.type === "image") {
            return `
            <div class="yxk-attach-thumb" data-attach-id="${att.id}">
              <img src="${att.url}" alt="${att.name}" />
              <button type="button" class="yxk-attach-remove" data-remove-attach="${att.id}" aria-label="移除图片">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>`;
          }
          return `
          <div class="yxk-attach-file" data-attach-id="${att.id}">
            <span class="yxk-attach-file-icon">${att.ext || "FILE"}</span>
            <span class="yxk-attach-file-meta">
              <span class="yxk-attach-file-name">${att.name}</span>
              ${att.size ? `<span class="yxk-attach-file-size">${att.size}</span>` : ""}
            </span>
            <button type="button" class="yxk-attach-remove" data-remove-attach="${att.id}" aria-label="移除文件">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>`;
        })
        .join("");
      yxkAttachRow.querySelectorAll("[data-remove-attach]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          removeComposerAttachment(btn.dataset.removeAttach);
        });
      });
    } else {
      yxkAttachRow.innerHTML = "";
    }

    if (hasSkills) {
      yxkSkillRow.innerHTML = skills
        .map(
          (s) => `
        <span class="yxk-skill-chip" data-skill-id="${s.id}">
          <span class="yxk-skill-chip-icon">${s.icon || "⚡"}</span>
          <span class="yxk-skill-chip-name">${s.name}</span>
          <button type="button" class="yxk-skill-chip-remove" data-remove-skill="${s.id}" aria-label="移除技能">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </span>`
        )
        .join("");
      yxkSkillRow.querySelectorAll("[data-remove-skill]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          removeComposerSkill(btn.dataset.removeSkill);
        });
      });
    } else {
      yxkSkillRow.innerHTML = "";
    }

    autoResizeInput();
  }

  function filteredExperts() {
    const q = expertQuery.trim().toLowerCase();
    return EXPERTS.filter((e) => {
      if (expertCat !== "all" && e.cat !== expertCat) return false;
      if (!q) return true;
      const hay = `${e.name} ${e.title} ${e.desc} ${e.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderExpertsGrid() {
    if (!expertsGrid) return;
    const list = filteredExperts();
    if (!list.length) {
      expertsGrid.innerHTML = `<p class="experts-empty">暂无匹配专家</p>`;
      return;
    }
    expertsGrid.innerHTML = list
      .map(
        (e) => `
      <button type="button" class="expert-card" data-expert-id="${e.id}">
        <div class="expert-card-top">
          <span class="expert-card-avatar" style="background:${e.color}">${e.avatar}</span>
          <span class="expert-card-meta">
            <span class="expert-card-title">${e.title}</span>
            <span class="expert-card-name">${e.name}</span>
          </span>
        </div>
        <p class="expert-card-desc">${e.desc}</p>
        <div class="expert-card-tags">
          ${e.tags.map((t) => `<span class="expert-card-tag">${t}</span>`).join("")}
        </div>
      </button>`
      )
      .join("");
    expertsGrid.querySelectorAll(".expert-card").forEach((card) => {
      card.addEventListener("click", () => openExpertChat(card.dataset.expertId));
    });
  }

  function openExpertList() {
    expertsReturnPage = pages.yxk?.classList.contains("is-active") ? "yxk" : "yxk";
    closePlusSheet();
    setVoiceMode(false);
    closeComposerMenus();
    expertCat = "all";
    expertQuery = "";
    if (expertsSearchInput) expertsSearchInput.value = "";
    expertsCats?.querySelectorAll(".experts-cat").forEach((btn) => {
      const active = btn.dataset.cat === "all";
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    renderExpertsGrid();
    showPage("experts");
  }

  function getPickerConfig() {
    return PICKER_CONFIG[pickerType] || PICKER_CONFIG.knowledge;
  }

  function getPickerItems() {
    const cfg = getPickerConfig();
    const q = pickerQuery.trim().toLowerCase();
    return cfg.items().filter((item) => {
      if (item.nav && item.nav !== pickerNav) return false;
      if (!q) return true;
      const hay = `${item.name} ${item.desc || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function getPickerSelected() {
    return getPickerConfig().items().filter((item) => item.selected);
  }

  function renderPickerCats() {
    const cfg = getPickerConfig();
    if (!tpCats) return;
    tpCats.innerHTML = cfg.nav
      .map(
        (n) => `
      <button type="button" class="tp-cat${n.id === pickerNav ? " is-active" : ""}" data-nav="${n.id}" role="tab" aria-selected="${n.id === pickerNav}">
        ${n.label}
      </button>`
      )
      .join("");
    tpCats.querySelectorAll(".tp-cat").forEach((btn) => {
      btn.addEventListener("click", () => {
        pickerNav = btn.dataset.nav || cfg.nav[0]?.id;
        renderToolPicker();
      });
    });
  }

  function renderPickerTags() {
    if (!tpTags) return;
    const selected = getPickerSelected();
    if (!selected.length) {
      tpTags.hidden = true;
      tpTags.innerHTML = "";
      return;
    }
    tpTags.hidden = false;
    tpTags.innerHTML = selected
      .map(
        (item) => `
      <span class="tp-tag" data-id="${item.id}">
        ${item.icon ? `<span class="tp-tag-icon" style="background:${item.color || "#1677ff"}18">${item.icon}</span>` : ""}
        <span class="tp-tag-name">${item.name}</span>
        <button type="button" class="tp-tag-remove" data-remove="${item.id}" aria-label="移除">×</button>
      </span>`
      )
      .join("");
    tpTags.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePickerItem(btn.dataset.remove, false);
      });
    });
  }

  function renderPickerList() {
    if (!tpList) return;
    const list = getPickerItems();
    if (!list.length) {
      tpList.innerHTML = `<p class="tp-empty">暂无匹配结果</p>`;
      return;
    }
    tpList.innerHTML = list
      .map((item) => {
        const action = item.selected
          ? `<span class="tp-item-check" aria-label="已选"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>`
          : pickerType === "mcp" && item.connected
            ? `<span class="tp-item-badge">已连接</span>`
            : `<span class="tp-item-add">添加</span>`;
        const icon = item.icon
          ? `<span class="tp-item-icon" style="background:${item.color || "#1677ff"}15;color:${item.color || "#1677ff"}">${item.icon}</span>`
          : "";
        return `
      <button type="button" class="tp-item" data-id="${item.id}">
        ${icon}
        <span class="tp-item-body">
          <span class="tp-item-title">${item.name}</span>
          <span class="tp-item-desc">${item.desc || ""}</span>
        </span>
        <span class="tp-item-action">${action}</span>
      </button>`;
      })
      .join("");
    tpList.querySelectorAll(".tp-item").forEach((row) => {
      row.addEventListener("click", () => {
        const item = getPickerConfig().items().find((x) => x.id === row.dataset.id);
        if (!item) return;
        togglePickerItem(item.id, !item.selected);
      });
    });
  }

  function renderToolPicker() {
    const cfg = getPickerConfig();
    if (tpNavTitle) tpNavTitle.textContent = cfg.title;
    if (tpSearchInput) {
      tpSearchInput.placeholder = cfg.searchPlaceholder;
      tpSearchInput.value = pickerQuery;
    }
    if (tpCreateBtn) {
      tpCreateBtn.classList.toggle("hidden", !cfg.showCreate);
      tpCreateBtn.textContent = cfg.showCreate ? `+ ${cfg.createLabel}` : "";
    }
    if (tpCount) tpCount.textContent = `已选 ${getPickerSelected().length}`;
    renderPickerCats();
    renderPickerTags();
    renderPickerList();
  }

  function togglePickerItem(id, selected) {
    const item = getPickerConfig().items().find((x) => x.id === id);
    if (!item) return;
    item.selected = Boolean(selected);
    if (pickerType === "mcp") item.connected = item.selected;
    renderToolPicker();
    syncSheetMcpIcons();
  }

  function syncSheetMcpIcons() {
    const host = document.getElementById("yxkSheetMcpIcons");
    if (!host) return;
    const connected = MOCK_MCP.filter((item) => item.selected || item.connected);
    if (!connected.length) {
      host.innerHTML = "";
      host.hidden = true;
      return;
    }
    host.hidden = false;
    const maxShow = 3;
    const shown = connected.slice(0, maxShow);
    const rest = connected.length - shown.length;
    host.innerHTML =
      shown
        .map(
          (item, index) => `
      <span class="yxk-sheet-tool-icon" style="background:${item.color || "#1677ff"}18;z-index:${shown.length - index}" title="${item.name}">${item.icon || "🔧"}</span>`
        )
        .join("") +
      (rest > 0 ? `<span class="yxk-sheet-tool-more">+${rest}</span>` : "");
  }

  function openToolPicker(type) {
    const cfg = PICKER_CONFIG[type];
    if (!cfg) return;
    pickerType = type;
    pickerNav = cfg.nav[0]?.id || "public";
    pickerQuery = "";
    pickerReturnPage = "yxk";
    closePlusSheet();
    setVoiceMode(false);
    closeComposerMenus();
    renderToolPicker();
    showPage("tool-picker");
  }

  function closeToolPicker({ announce = true } = {}) {
    const cfg = getPickerConfig();
    const count = getPickerSelected().length;
    showPage(pickerReturnPage || "yxk");
    if (pickerReturnPage === "yxk") setActiveTab("yxk");
    syncSheetMcpIcons();
    renderComposerExtras();
    if (announce) {
      appendBubble("ai", count ? `已选择 ${count} 个${cfg.doneLabel}` : `未选择${cfg.doneLabel}`);
    }
  }

  function getTitleSwitchAgents() {
    const chips = EXPERTS.filter((e) => e.chip);
    const list = chips.length ? chips : EXPERTS.slice(0, 6);
    return [DEFAULT_EXPERT, ...list];
  }

  function renderTitleSwitcher() {
    if (!yxkAgentSwitcher) return;
    const currentId = activeExpertId;
    yxkAgentSwitcher.innerHTML = getTitleSwitchAgents()
      .map((agent) => {
        const id = agent.id || "default";
        const active = (currentId == null && id === "default") || currentId === agent.id;
        return `
      <button type="button" class="yxk-agent-switcher-item${active ? " is-active" : ""}" role="option" data-agent-id="${id}" aria-selected="${active}">
        ${agent.name}
      </button>`;
      })
      .join("");
  }

  function toggleTitleSwitcher(open) {
    if (!pageYxk || !yxkAgentSwitcher || !yxkTitleSwitchBtn) return;
    pageYxk.classList.toggle("agent-switcher-open", open);
    yxkAgentSwitcher.classList.toggle("hidden", !open);
    yxkTitleSwitchBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      closePlusSheet();
      closeHistoryDrawer();
      closeComposerMenus();
      setComposerFocused(false);
      renderTitleSwitcher();
    }
  }

  function selectTitleAgent(agentId) {
    if (!agentId || agentId === "default") {
      resetYxkChat();
      toggleTitleSwitcher(false);
      return;
    }
    openExpertChat(agentId);
    toggleTitleSwitcher(false);
  }

  function syncExpertHeader() {
    const expert = getActiveExpert();
    if (yxkNavTitle) yxkNavTitle.textContent = expert.name;
    if (yxkHi) {
      yxkHi.innerHTML = `
        <span class="yxk-hi-word">Hi</span>
        <span class="yxk-hi-spark" aria-hidden="true">✦</span>
        ${expert.greet}
      `;
    }
    if (yxkAsk) yxkAsk.textContent = expert.ask;
  }

  function openExpertChat(expertId) {
    const expert = EXPERTS.find((e) => e.id === expertId);
    if (!expert) return;
    activeExpertId = expert.id;
    currentSessionId = null;
    renderExpertChips();
    renderActiveExpert();
    syncExpertHeader();
    setVoiceMode(false);
    closeComposerMenus();
    closePlusSheet();
    toggleTitleSwitcher(false);
    yxkMessages.innerHTML = "";
    yxkMessages.classList.add("hidden");
    yxkWelcome.classList.remove("hidden");
    yxkInput.value = "";
    syncSendState();
    setComposerFocused(false);
    showPage("yxk");
    setActiveTab("yxk");
    const body = document.getElementById("yxkBody");
    if (body) body.scrollTop = 0;
  }

  function clearExpertSelection() {
    activeExpertId = null;
    renderExpertChips();
    renderActiveExpert();
    syncExpertHeader();
    toggleTitleSwitcher(false);
  }

  function appendBubble(role, text) {
    yxkWelcome.classList.add("hidden");
    yxkMessages.classList.remove("hidden");
    const el = document.createElement("div");
    el.className = `yxk-bubble ${role}`;
    el.textContent = text;
    yxkMessages.appendChild(el);
    yxkMessages.scrollTop = yxkMessages.scrollHeight;
    document.getElementById("yxkBody").scrollTop = document.getElementById("yxkBody").scrollHeight;
  }

  function sendYxk(raw) {
    const text = (raw ?? yxkInput.value).trim();
    const skills = getSelectedSkills();
    const hasAttach = composerAttachments.length > 0;
    if (!text && !hasAttach) return;

    const attachNames = composerAttachments.map((a) => a.name).join("、");
    const skillNames = skills.map((s) => s.name).join("、");
    let userLine = text;
    if (hasAttach) userLine = `${userLine ? `${userLine}\n` : ""}[附件] ${attachNames}`;
    if (skillNames) userLine = `${userLine ? `${userLine}\n` : ""}[技能] ${skillNames}`;

    appendBubble("user", userLine || "[附件]");
    yxkInput.value = "";
    clearComposerAttachments();
    syncSendState();
    const expert = getActiveExpert();
    const modeTip = MODE_LABELS[aiMode] || "快速模式";
    setTimeout(() => {
      appendBubble(
        "ai",
        `我是${expert.name}，已收到你的问题：\n「${text || attachNames}」\n\n当前为「${modeTip}」，可继续追问或切换模式。`
      );
    }, 320);
  }

  function resetYxkChat() {
    clearExpertSelection();
    clearComposerAttachments();
    currentSessionId = null;
    yxkMessages.innerHTML = "";
    yxkMessages.classList.add("hidden");
    yxkWelcome.classList.remove("hidden");
    yxkInput.value = "";
    syncSendState();
    setVoiceMode(false);
    closeComposerMenus();
  }

  function filteredHistorySessions() {
    const q = historyQuery.trim().toLowerCase();
    const list = [...CHAT_SESSIONS].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    if (!q) return list;
    return list.filter((s) => `${s.title} ${s.preview}`.toLowerCase().includes(q));
  }

  function renderHistoryList() {
    if (!yxkHistoryList) return;
    const list = filteredHistorySessions();
    if (!list.length) {
      yxkHistoryList.innerHTML = `<p class="yxk-history-empty">暂无匹配对话</p>`;
      return;
    }
    const groups = [];
    list.forEach((s) => {
      const g = s.pinned ? "置顶" : s.group || "更早";
      let bucket = groups.find((x) => x.title === g);
      if (!bucket) {
        bucket = { title: g, items: [] };
        groups.push(bucket);
      }
      bucket.items.push(s);
    });
    yxkHistoryList.innerHTML = groups
      .map(
        (g) => `
      <div class="yxk-history-group-title">${g.title}</div>
      ${g.items
        .map(
          (s) => `
      <div class="yxk-history-item${s.id === currentSessionId ? " is-active" : ""}" data-session-id="${s.id}">
        <span class="yxk-history-item-icon">💬</span>
        <span class="yxk-history-item-body">
          <span class="yxk-history-item-title">${s.title}</span>
          <span class="yxk-history-item-preview">${s.preview}</span>
        </span>
        <span class="yxk-history-item-actions">
          <button type="button" class="yxk-history-action pin-btn${s.pinned ? " pinned" : ""}" data-pin="${s.id}" aria-label="置顶">${s.pinned ? "★" : "☆"}</button>
          <button type="button" class="yxk-history-action del-btn" data-del="${s.id}" aria-label="删除">🗑</button>
        </span>
      </div>`
        )
        .join("")}`
      )
      .join("");

    yxkHistoryList.querySelectorAll(".yxk-history-item").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".yxk-history-action")) return;
        loadHistorySession(row.dataset.sessionId);
      });
    });
    yxkHistoryList.querySelectorAll("[data-pin]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const session = CHAT_SESSIONS.find((s) => s.id === btn.dataset.pin);
        if (!session) return;
        session.pinned = !session.pinned;
        renderHistoryList();
      });
    });
    yxkHistoryList.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = CHAT_SESSIONS.findIndex((s) => s.id === btn.dataset.del);
        if (idx < 0) return;
        const removedId = CHAT_SESSIONS[idx].id;
        CHAT_SESSIONS.splice(idx, 1);
        if (currentSessionId === removedId) resetYxkChat();
        renderHistoryList();
      });
    });
  }

  function openHistoryDrawer() {
    if (!yxkHistoryDrawer) return;
    toggleTitleSwitcher(false);
    closePlusSheet();
    closeComposerMenus();
    setComposerFocused(false);
    setVoiceMode(false);
    historyQuery = "";
    if (yxkHistorySearch) yxkHistorySearch.value = "";
    renderHistoryList();
    yxkHistoryDrawer.hidden = false;
    yxkHistoryDrawer.setAttribute("aria-hidden", "false");
    yxkHistoryBtn?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      yxkHistoryDrawer.classList.add("is-open");
    });
  }

  function closeHistoryDrawer() {
    if (!yxkHistoryDrawer || yxkHistoryDrawer.hidden) return;
    yxkHistoryDrawer.classList.remove("is-open");
    yxkHistoryBtn?.setAttribute("aria-expanded", "false");
    yxkHistoryDrawer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!yxkHistoryDrawer.classList.contains("is-open")) {
        yxkHistoryDrawer.hidden = true;
      }
    }, 280);
  }

  function loadHistorySession(sessionId) {
    const session = CHAT_SESSIONS.find((s) => s.id === sessionId);
    if (!session) return;
    currentSessionId = session.id;
    clearExpertSelection();
    yxkWelcome.classList.add("hidden");
    yxkMessages.classList.remove("hidden");
    yxkMessages.innerHTML = "";
    session.messages.forEach((m) => {
      const el = document.createElement("div");
      el.className = `yxk-bubble ${m.role}`;
      el.textContent = m.text;
      yxkMessages.appendChild(el);
    });
    yxkInput.value = "";
    syncSendState();
    setComposerFocused(false);
    setVoiceMode(false);
    closeHistoryDrawer();
    const body = document.getElementById("yxkBody");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function syncSendState() {
    const hasText = Boolean(yxkInput?.value.trim());
    const hasAttach = composerAttachments.length > 0;
    yxkComposer?.classList.toggle("has-text", hasText);
    yxkSendBtn?.classList.toggle("has-text", hasText || hasAttach);
    autoResizeInput();
  }

  function autoResizeInput() {
    if (!yxkInput) return;
    yxkInput.style.height = "34px";
  }

  function setKeyboardVisible(visible) {
    if (!yxkKeyboard) return;
    yxkKeyboard.hidden = !visible;
    yxkKeyboard.setAttribute("aria-hidden", String(!visible));
  }

  function setComposerFocused(focused) {
    if (focused && voiceMode) setVoiceMode(false);
    yxkComposer?.classList.toggle("is-focused", focused);
    if (yxkInput) yxkInput.placeholder = focused ? FOCUS_PLACEHOLDER : IDLE_PLACEHOLDER;
    if (!focused) closeComposerMenus();
    const sheetOpen = yxkPlusSheet?.classList.contains("is-open");
    setKeyboardVisible(Boolean(focused && !sheetOpen && !voiceMode));
    autoResizeInput();
  }

  function setVoiceMode(enabled) {
    voiceMode = Boolean(enabled);
    yxkComposer?.classList.toggle("is-voice-mode", voiceMode);
    yxkVoiceBtn?.setAttribute("aria-pressed", String(voiceMode));
    if (yxkHoldSpeak) yxkHoldSpeak.hidden = !voiceMode;
    if (yxkKeyboardBtn) yxkKeyboardBtn.hidden = !voiceMode;
    if (voiceMode) {
      yxkComposer?.classList.remove("is-focused");
      closeComposerMenus();
      setKeyboardVisible(false);
      yxkInput?.blur();
    } else {
      stopRecording(false);
    }
  }

  function setRecordingCancelState(willCancel) {
    recordWillCancel = willCancel;
    yxkVoiceOverlay?.classList.toggle("is-cancel", willCancel);
    if (yxkVoiceTip) yxkVoiceTip.textContent = willCancel ? VOICE_TIP_CANCEL : VOICE_TIP_SEND;
  }

  function startRecording(e) {
    if (!voiceMode || recording) return;
    recording = true;
    recordPointerId = e.pointerId;
    recordStartY = e.clientY;
    setRecordingCancelState(false);
    if (yxkVoiceOverlay) {
      yxkVoiceOverlay.hidden = false;
      yxkVoiceOverlay.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => yxkVoiceOverlay.classList.add("is-open"));
    }
    try {
      yxkHoldSpeak?.setPointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  function updateRecording(e) {
    if (!recording) return;
    if (recordPointerId != null && e.pointerId !== recordPointerId) return;
    const dy = recordStartY - e.clientY;
    setRecordingCancelState(dy >= CANCEL_SLIDE_PX);
  }

  function stopRecording(shouldSend) {
    if (!recording && !yxkVoiceOverlay?.classList.contains("is-open")) {
      recording = false;
      recordPointerId = null;
      return;
    }
    const send = shouldSend && recording && !recordWillCancel;
    recording = false;
    recordPointerId = null;
    yxkVoiceOverlay?.classList.remove("is-open", "is-cancel");
    if (yxkVoiceOverlay) {
      yxkVoiceOverlay.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        if (!recording) yxkVoiceOverlay.hidden = true;
      }, 180);
    }
    if (yxkVoiceTip) yxkVoiceTip.textContent = VOICE_TIP_SEND;
    recordWillCancel = false;
    if (send) {
      appendBubble("user", "[语音消息]");
      const expert = getActiveExpert();
      setTimeout(() => {
        appendBubble("ai", `我是${expert.name}，已收到你的语音（原型演示）。可继续按住说话，或点键盘图标切换文字输入。`);
      }, 320);
    }
  }

  function setAiMode(mode) {
    if (!MODE_LABELS[mode]) return;
    aiMode = mode;
    const skillEnabled = mode === "office";
    yxkComposer?.setAttribute("data-ai-mode", mode);
    if (yxkPlusWrap) yxkPlusWrap.dataset.skillEnabled = String(skillEnabled);
    if (yxkPlusSheetPanel) yxkPlusSheetPanel.dataset.skillEnabled = String(skillEnabled);
    if (yxkSheetModeMeta) yxkSheetModeMeta.textContent = MODE_LABELS[mode];
    if (yxkSheetModeBadge) yxkSheetModeBadge.textContent = MODE_BADGES[mode] || "A";
    yxkPlusSheet?.querySelectorAll(".yxk-sheet-mode-list [data-ai-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.aiMode === mode);
    });
    renderComposerExtras();
  }

  function setSheetView(view) {
    if (!yxkPlusSheetPanel) return;
    yxkPlusSheetPanel.dataset.sheetView = view;
    yxkPlusSheetPanel.querySelectorAll(".yxk-sheet-view").forEach((el) => {
      el.hidden = el.dataset.view !== view;
    });
  }

  function setSelectedModel(modelId) {
    if (!MODEL_LABELS[modelId]) return;
    selectedModel = modelId;
    if (yxkSheetModelMeta) yxkSheetModelMeta.textContent = MODEL_LABELS[modelId];
    if (yxkSheetModelBadge) yxkSheetModelBadge.textContent = MODEL_BADGES[modelId] || "A";
    yxkPlusSheet?.querySelectorAll(".yxk-sheet-model-list [data-model]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.model === modelId);
    });
  }

  function openPlusSheet() {
    if (!yxkPlusSheet) return;
    toggleTitleSwitcher(false);
    closeHistoryDrawer();
    setSheetView("main");
    setKeyboardVisible(false);
    syncSheetMcpIcons();
    yxkPlusSheet.hidden = false;
    yxkPlusSheet.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => yxkPlusSheet.classList.add("is-open"));
    yxkPlusBtn?.classList.add("is-open");
    yxkPlusBtn?.setAttribute("aria-expanded", "true");
  }

  function closePlusSheet() {
    if (!yxkPlusSheet || yxkPlusSheet.hidden) return;
    yxkPlusSheet.classList.remove("is-open");
    yxkPlusBtn?.classList.remove("is-open");
    yxkPlusBtn?.setAttribute("aria-expanded", "false");
    yxkPlusSheet.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!yxkPlusSheet.classList.contains("is-open")) {
        yxkPlusSheet.hidden = true;
        setSheetView("main");
      }
    }, 280);
    if (yxkComposer?.classList.contains("is-focused")) {
      setKeyboardVisible(true);
    }
  }

  function closeComposerMenus() {
    closePlusSheet();
  }

  function insertAtCursor(text) {
    if (!yxkInput) return;
    const start = yxkInput.selectionStart ?? yxkInput.value.length;
    const end = yxkInput.selectionEnd ?? yxkInput.value.length;
    const value = yxkInput.value;
    yxkInput.value = value.slice(0, start) + text + value.slice(end);
    const pos = start + text.length;
    yxkInput.setSelectionRange(pos, pos);
    syncSendState();
  }

  tabItems.forEach((item) => {
    item.addEventListener("click", () => switchTab(item.dataset.tab));
  });

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });

  yxkPlusBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setComposerFocused(true);
    if (yxkPlusSheet?.classList.contains("is-open")) closePlusSheet();
    else openPlusSheet();
  });

  yxkPlusSheetMask?.addEventListener("click", () => closePlusSheet());

  yxkSheetModeBack?.addEventListener("click", (e) => {
    e.stopPropagation();
    setSheetView("main");
  });

  yxkSheetModelBack?.addEventListener("click", (e) => {
    e.stopPropagation();
    setSheetView("main");
  });

  yxkPlusSheet?.querySelectorAll("[data-tool]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const tool = item.dataset.tool;
      if (tool === "mode") {
        setSheetView("mode");
        return;
      }
      if (tool === "model") {
        setSheetView("model");
        return;
      }
      closePlusSheet();
      if (tool === "skill") {
        if (aiMode !== "office") {
          appendBubble("ai", "技能仅在「办公任务」模式下可用，请先切换模式后再选择。");
          return;
        }
        openToolPicker("skill");
        return;
      }
      if (tool === "knowledge") {
        openToolPicker("knowledge");
        return;
      }
      if (tool === "mcp") {
        openToolPicker("mcp");
        return;
      }
      if (tool === "expert") {
        openExpertList();
        return;
      }
      if (tool === "camera") {
        addComposerAttachment({
          type: "image",
          name: "拍照.jpg",
          url: mockImageDataUri("拍照", "#1677ff")
        });
        return;
      }
      if (tool === "album") {
        addComposerAttachment({
          type: "image",
          name: "相册图片.jpg",
          url: mockImageDataUri("相册", "#13c2c2")
        });
        addComposerAttachment({
          type: "image",
          name: "相册图片2.jpg",
          url: mockImageDataUri("图片", "#722ed1")
        });
        return;
      }
      if (tool === "file") {
        addComposerAttachment({
          type: "file",
          name: "公文格式标准与排版规范.pdf",
          ext: "PDF",
          size: "1.2 MB"
        });
        return;
      }
      appendBubble("ai", `已打开「${tool}」（原型演示）`);
    });
  });

  yxkPlusSheet?.querySelectorAll(".yxk-sheet-mode-list [data-ai-mode]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const mode = item.dataset.aiMode;
      setAiMode(mode);
      closePlusSheet();
      appendBubble("ai", `已切换为「${MODE_LABELS[mode]}」（原型演示）`);
    });
  });

  yxkPlusSheet?.querySelectorAll(".yxk-sheet-model-list [data-model]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const model = item.dataset.model;
      setSelectedModel(model);
      closePlusSheet();
      appendBubble("ai", `已切换模型为「${MODEL_LABELS[model]}」（原型演示）`);
    });
  });

  yxkKeyboard?.querySelectorAll(".yxk-key").forEach((key) => {
    key.addEventListener("mousedown", (e) => e.preventDefault());
    key.addEventListener("click", () => {
      setComposerFocused(true);
      yxkInput?.focus();
      const action = key.dataset.key;
      if (action === "backspace") {
        if (!yxkInput) return;
        const start = yxkInput.selectionStart ?? yxkInput.value.length;
        const end = yxkInput.selectionEnd ?? yxkInput.value.length;
        if (start !== end) {
          yxkInput.value = yxkInput.value.slice(0, start) + yxkInput.value.slice(end);
          yxkInput.setSelectionRange(start, start);
        } else if (start > 0) {
          yxkInput.value = yxkInput.value.slice(0, start - 1) + yxkInput.value.slice(start);
          yxkInput.setSelectionRange(start - 1, start - 1);
        }
        syncSendState();
        return;
      }
      if (action === "space") {
        insertAtCursor(" ");
        return;
      }
      if (action === "enter") {
        insertAtCursor("\n");
        return;
      }
      const ch = key.textContent?.trim();
      if (ch && ch.length <= 2 && !["⇧", "123", "⌫", "空格", "换行"].includes(ch)) {
        insertAtCursor(ch.toLowerCase());
      }
    });
  });

  yxkKeyboard?.querySelectorAll(".yxk-keyboard-candidates span").forEach((chip) => {
    chip.addEventListener("mousedown", (e) => e.preventDefault());
    chip.addEventListener("click", () => {
      setComposerFocused(true);
      yxkInput?.focus();
      insertAtCursor(chip.textContent || "");
    });
  });

  document.addEventListener("pointerdown", (e) => {
    if (!(e.target instanceof Element)) return;
    if (recording) return;
    if (e.target.closest(".yxk-sheet-panel") || e.target.closest("#yxkPlusBtn")) return;
    if (e.target.closest(".yxk-composer") || e.target.closest(".yxk-keyboard")) {
      return;
    }
    closeComposerMenus();
    if (!yxkInput?.value.trim() && !voiceMode) setComposerFocused(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (recording) {
      recordWillCancel = true;
      stopRecording(false);
      return;
    }
    if (voiceMode) {
      setVoiceMode(false);
      return;
    }
    if (
      (yxkPlusSheetPanel?.dataset.sheetView === "mode" || yxkPlusSheetPanel?.dataset.sheetView === "model") &&
      yxkPlusSheet?.classList.contains("is-open")
    ) {
      setSheetView("main");
      return;
    }
    closePlusSheet();
  });

  document.getElementById("yxkRefresh")?.addEventListener("click", () => {
    suggestIndex += 1;
    renderSuggests();
  });

  document.getElementById("yxkNewChatBtn")?.addEventListener("click", resetYxkChat);
  document.getElementById("yxkBackBtn")?.addEventListener("click", () => switchTab("messages"));
  document.getElementById("yxkCloseBtn")?.addEventListener("click", () => switchTab("messages"));

  yxkTitleSwitchBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !pageYxk?.classList.contains("agent-switcher-open");
    toggleTitleSwitcher(open);
  });

  yxkAgentSwitcher?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-agent-id]");
    if (!item) return;
    e.stopPropagation();
    selectTitleAgent(item.dataset.agentId);
  });

  yxkHistoryBtn?.addEventListener("click", () => {
    if (yxkHistoryDrawer?.classList.contains("is-open")) closeHistoryDrawer();
    else openHistoryDrawer();
  });
  yxkHistoryMask?.addEventListener("click", () => closeHistoryDrawer());
  yxkHistoryCloseBtn?.addEventListener("click", () => closeHistoryDrawer());
  yxkHistoryNewBtn?.addEventListener("click", () => {
    resetYxkChat();
    closeHistoryDrawer();
  });
  yxkHistorySearch?.addEventListener("input", () => {
    historyQuery = yxkHistorySearch.value || "";
    renderHistoryList();
  });

  yxkInput?.addEventListener("focus", () => setComposerFocused(true));
  yxkInput?.addEventListener("pointerdown", () => setComposerFocused(true));
  yxkInput?.addEventListener("click", () => setComposerFocused(true));
  yxkComposer?.querySelector(".yxk-composer-card")?.addEventListener("pointerdown", (e) => {
    if (
      e.target.closest("#yxkPlusBtn") ||
      e.target.closest("#yxkVoiceBtn") ||
      e.target.closest("#yxkHoldSpeak") ||
      e.target.closest("#yxkKeyboardBtn")
    ) {
      return;
    }
    if (voiceMode) return;
    setComposerFocused(true);
  });
  yxkComposer?.querySelector(".yxk-composer-card")?.addEventListener("click", (e) => {
    if (
      e.target.closest("#yxkPlusBtn") ||
      e.target.closest("#yxkSendBtn") ||
      e.target.closest("#yxkVoiceBtn") ||
      e.target.closest("#yxkHoldSpeak") ||
      e.target.closest("#yxkKeyboardBtn")
    ) {
      return;
    }
    if (voiceMode) return;
    setComposerFocused(true);
  });

  yxkVoiceBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closePlusSheet();
    setVoiceMode(true);
  });

  yxkKeyboardBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setVoiceMode(false);
    setComposerFocused(true);
    yxkInput?.focus();
  });

  yxkHoldSpeak?.addEventListener("pointerdown", (e) => {
    if (e.button != null && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    closePlusSheet();
    startRecording(e);
  });

  yxkHoldSpeak?.addEventListener("pointermove", updateRecording);

  const endHoldSpeak = (e) => {
    if (!recording) return;
    if (recordPointerId != null && e.pointerId !== recordPointerId) return;
    e.preventDefault();
    stopRecording(true);
  };

  yxkHoldSpeak?.addEventListener("pointerup", endHoldSpeak);
  yxkHoldSpeak?.addEventListener("pointercancel", (e) => {
    if (!recording) return;
    recordWillCancel = true;
    endHoldSpeak(e);
  });

  document.addEventListener("pointermove", (e) => {
    if (!recording) return;
    updateRecording(e);
  });

  document.addEventListener("pointerup", (e) => {
    if (!recording) return;
    endHoldSpeak(e);
  });

  yxkInput?.addEventListener("blur", () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (
        voiceMode ||
        yxkComposer?.contains(active) ||
        yxkKeyboard?.contains(active) ||
        yxkPlusSheet?.contains(active) ||
        yxkInput?.value.trim()
      ) {
        return;
      }
      setComposerFocused(false);
    }, 120);
  });
  yxkInput?.addEventListener("input", syncSendState);
  yxkInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendYxk();
    }
  });
  yxkSendBtn?.addEventListener("click", () => sendYxk());

  yxkExpertMore?.addEventListener("click", (e) => {
    e.stopPropagation();
    openExpertList();
  });

  document.getElementById("expertsBackBtn")?.addEventListener("click", () => {
    showPage(expertsReturnPage || "yxk");
    if (expertsReturnPage === "yxk") setActiveTab("yxk");
  });

  document.getElementById("tpBackBtn")?.addEventListener("click", () => {
    closeToolPicker({ announce: false });
  });

  document.getElementById("tpDoneBtn")?.addEventListener("click", () => {
    closeToolPicker({ announce: true });
  });

  tpCreateBtn?.addEventListener("click", () => {
    appendBubble("ai", "创建技能（原型演示）");
    closeToolPicker({ announce: false });
  });

  tpSearchInput?.addEventListener("input", () => {
    pickerQuery = tpSearchInput.value || "";
    if (tpCount) tpCount.textContent = `已选 ${getPickerSelected().length}`;
    renderPickerTags();
    renderPickerList();
  });

  expertsCats?.querySelectorAll(".experts-cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      expertCat = btn.dataset.cat || "all";
      expertsCats.querySelectorAll(".experts-cat").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      renderExpertsGrid();
    });
  });

  expertsSearchInput?.addEventListener("input", () => {
    expertQuery = expertsSearchInput.value || "";
    renderExpertsGrid();
  });

  renderMessages();
  renderSuggests();
  renderExpertChips();
  renderActiveExpert();
  renderComposerExtras();
  syncExpertHeader();
  syncSheetMcpIcons();
  setAiMode("fast");
  setSelectedModel("auto");
  syncSendState();
  switchTab("messages");
})();
