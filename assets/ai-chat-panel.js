(function (global) {
  "use strict";

  let config = {
    aiLogo: "../public/ailogo.gif",
    baseDepth: 1,
    assetBase: "../public"
  };

  let aiChatPanel, aiSidePanel, chatMessages, chatCloseBtn, chatPanelInput, chatPanelSend;
  let aiNewChatBtn, aiHistoryToggleBtn, aiFullscreenBtn, aiClearChatBtn, portalHistoryBtn;
  let attachmentBar, attachmentText, attachmentClose, aiUploadBtn;
  let chatAiToolbar;
  let aiTitleSwitchBtn, aiAgentSwitcher;
  let chatMentionPopover, chatMentionHead, chatMentionList;
  let chatSkillChips;
  let composerSkills = [];

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

  let mentionState = {
    open: false,
    type: null,
    query: "",
    start: -1,
    end: -1,
    activeIndex: 0,
    items: []
  };

  const TOTAL_REFS = 19;

const USER_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

const SUGGESTIONS = [
  "公文格式规范有哪些？",
  "如何修改 OA 密码？",
  "帮我查一下待办事项"
];

function makeRefLabel(count) {
  return `已检索到${count}条相关记录内容`;
}

const RESPONSES = {
  "如何修改 OA 密码？": {
    text: "修改 OA 密码的步骤如下：\n1. 登录 OA 门户后，点击右上角个人头像\n2. 选择「个人设置」→「修改密码」\n3. 输入原密码和新密码，确认提交\n\n如忘记密码，请联系 IT 服务台（内线：8888）重置。\n\n详细操作可参考《集团翼办使用手册》。",
    plugin: { kind: "references", refCount: 6, label: makeRefLabel(6) },
    thinking: "正在检索知识库中关于「OA 密码修改」的相关文档...",
    thinkingTime: 3.2
  },
  "公文格式规范有哪些？": {
    text: "公司公文格式主要规范包括：\n1. 标题：二号小标宋体，居中\n2. 正文：三号仿宋体，每面 22 行，每行 28 字\n3. 结构层次：一、（一）、1.（1）\n4. 附件：在正文下空一行标注\n\n建议查阅《集团翼办使用手册》第 4 章「公文格式规范」，或借助「办公写作助手」智能体辅助起草。",
    plugin: { kind: "references", refCount: 12, label: makeRefLabel(12) },
    thinking: "正在分析公文格式标准文档，匹配 GB/T 9704 规范要求...",
    thinkingTime: 5.8
  },
  "查找最近的公文新闻": {
    text: "根据您的问题，可在 OA 中查看公文新闻，建议按以下路径检索：\n\n1. 查看待办与已办事项，定位最新流转的公文通知\n2. 在「公文检索」中按文种、时间筛选最新公告\n3. 关注首页「通知公告」栏目中的集团及公司级新闻\n\n相关检索材料：\n• «cite:【福富测试】4天翼云内部收文〔2021〕397号»\n• «cite:【福富测试】云公司督办单527»\n• «cite:集团翼办使用手册»\n• «cite:协同办公竞品分析报告»",
    plugin: { kind: "references", refCount: 20, label: makeRefLabel(20) },
    thinking: "正在检索知识库中与「公文新闻」相关的最新文档和通知...",
    thinkingTime: 7.1
  },
  "帮我查一下待办": {
    text: "您当前有 3 条 OA 待办事项：\n1. 【审批】关于征集 AI 智慧办公大模型优化建议的通知\n2. 【阅办】关于印发《公文处理管理办法（2025版）》的通知\n3. 【会签】2025 年第二季度工作总结\n\n点击「OA待办」标签可查看详情并处理。",
    plugin: { kind: "references", refCount: TOTAL_REFS, label: makeRefLabel(TOTAL_REFS) },
    thinking: "正在查询 OA 待办系统，获取当前用户的待办事项列表...",
    thinkingTime: 2.5
  },
  "帮我查一下待办公文": {
    text: "您当前有 3 条公文相关待办：\n1. 【审批】关于征集 AI 智慧办公大模型优化建议的通知\n2. 【阅办】关于印发《公文处理管理办法（2025版）》的通知\n3. 【会签】2025 年第二季度工作总结\n\n可在首页「OA待办」或「公文管理」中按文种、紧急程度筛选处理。",
    plugin: { kind: "references", refCount: TOTAL_REFS, label: makeRefLabel(TOTAL_REFS) },
    thinking: "正在查询 OA 公文待办，按收发文、阅办、会签等类型汇总...",
    thinkingTime: 2.8
  },
  "帮我起草一份通知公文": {
    text: "我是 AI 拟稿助手，可帮您智能起草、润色公文，并自动检查格式规范。\n\n请告诉我：\n1. 公文类型（通知/请示/报告等）\n2. 主题与背景\n3. 核心要点\n\n我将为您生成符合 GB/T 9704 标准的初稿。",
    plugin: { kind: "references", refCount: 8, label: makeRefLabel(8) },
    thinking: "正在加载公文模板库与格式规范文档...",
    thinkingTime: 4.5
  },
  "收文阅办怎么操作？": {
    text: "收文阅办标准流程如下：\n1. 在「OA待阅」或待办列表中打开待阅公文\n2. 阅读正文及附件，填写阅办意见\n3. 选择「已阅」或「阅办完毕」提交\n4. 需流转的公文可选择下一环节处理人\n\n如需批量阅办，可在待阅列表勾选多条后统一提交。详细说明见《集团翼办使用手册》收发文管理章节。",
    plugin: { kind: "references", refCount: 10, label: makeRefLabel(10) },
    thinking: "正在检索收文阅办操作手册与流程规范...",
    thinkingTime: 3.6
  },
  "请推荐 deepseek 相关云产品": {
    text: "已为您构建「DeepSeek 云生态高价值客户精准拓销计划」营销场景：\n\n• 产品定位：高性能计算、AI 模型部署\n• 渠道策略：联合云公司渠道伙伴推出预集成镜像\n• 目标客户：云主机 ≥500 台、年云支出超百万\n• 转化抓手：免费云资源健康度评估 + DeepSeek POC 试用\n\n请在左侧工作台查看核心标签和原始客户数据。",
    plugin: { kind: "workbench", keyword: "deepseek", label: "查看营销工作台" },
    thinking: "正在分析 DeepSeek 云产品矩阵，构建精准营销场景...",
    thinkingTime: 8.4
  },
  "AI 智慧办公大模型征集说明": {
    text: "公司正在征集 AI 智慧办公大模型优化建议，征集范围包括：\n• 公文起草、审批、归档全流程\n• 智能校对与格式规范检查\n• 会议纪要与信息摘要生成\n\n参考材料：《协同办公竞品分析报告》、《天翼云解决方案》。",
    plugin: { kind: "references", refCount: 8, label: makeRefLabel(8) },
    thinking: "正在检索 AI 大模型征集相关通知和说明文档...",
    thinkingTime: 4.6
  },
  "AI拟稿": {
    text: "我是 AI 拟稿助手，可帮您智能起草、润色公文，并自动检查格式规范。\n\n请告诉我：\n1. 公文类型（通知/请示/报告等）\n2. 主题与背景\n3. 核心要点\n\n我将为您生成符合 GB/T 9704 标准的初稿。",
    plugin: { kind: "references", refCount: 8, label: makeRefLabel(8) },
    thinking: "正在加载公文模板库与格式规范文档...",
    thinkingTime: 4.5
  },
  "日程助手": {
    text: "我是日程助手，可帮您：\n• 查看今日/本周日程安排\n• 创建会议提醒\n• 检测时间冲突\n\n您可以说「帮我看看今天的日程」或「下周三下午安排一次部门例会」。",
    plugin: { kind: "references", refCount: 5, label: makeRefLabel(5) },
    thinking: "正在同步 OA 日程数据...",
    thinkingTime: 2.8
  },
  "会议室预定": {
    text: "我是会议室预定助手，可帮您：\n• 查询空闲会议室\n• 按人数、设备需求筛选\n• 提交预定并发送会邀\n\n请告诉我会议时间、人数和所需设备（投影/视频会议等）。",
    plugin: { kind: "references", refCount: 6, label: makeRefLabel(6) },
    thinking: "正在查询会议室资源占用情况...",
    thinkingTime: 3.1
  },
  "访客预约": {
    text: "我是访客预约助手，可帮您：\n• 登记访客信息\n• 提交来访审批\n• 生成通行二维码\n\n请提供访客姓名、来访单位、来访时间及接待人信息。",
    plugin: { kind: "references", refCount: 4, label: makeRefLabel(4) },
    thinking: "正在加载访客管理流程与审批规则...",
    thinkingTime: 2.6
  },
  default: {
    text: "您好！我是天翼云数字人，很高兴为您服务。\n\n我可以帮您：\n• 查询 OA 待办、公文、公告等信息\n• 解答办公流程和制度规范\n• 推荐合适的 AI 智能体辅助办公\n\n请告诉我您需要什么帮助？",
    plugin: null,
    thinking: null,
    thinkingTime: 0
  }
};

let isFirstMessage = true;
let pluginSeq = 0;
let currentSessionId = null;
let sidePanelMode = null;
let isFullscreen = false;
let historySearchQuery = "";
const DEFAULT_AGENT_ID = "default";
const DEFAULT_AGENT_NAME = "天翼云数字人";

let currentAgentId = DEFAULT_AGENT_ID;
let currentAgentName = DEFAULT_AGENT_NAME;

/** 标题下拉可切换的智能体列表（与参考截图一致） */
const TITLE_SWITCH_AGENTS = [
  { id: "default", name: "天翼云数字人" },
  { id: "enterprise-qa", name: "企业知识问答", welcomeKey: "default" },
  { id: "it-brain", name: "【IT大脑】模型审核智能体-正式", welcomeKey: "default" },
  { id: "data-dispatch", name: "数据下发助手", welcomeKey: "default" },
  { id: "schedule-integrated", name: "日程综合调度智能体", welcomeKey: "schedule" },
  { id: "schedule-test", name: "日程调度智能体测试", welcomeKey: "schedule" },
  { id: "ai-draft", name: "AI拟稿", welcomeKey: "draft" },
  { id: "risk", name: "风险治理", welcomeKey: "risk" },
  { id: "meeting-room", name: "会议室预定", welcomeKey: "meeting" },
  { id: "visitor", name: "访客预约", welcomeKey: "visitor" },
  { id: "data-ops", name: "数据运营智能体", welcomeKey: "default" },
  { id: "value-mgmt", name: "价值经营", welcomeKey: "default" }
];

const CAPABILITY_ICONS = {
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  analyze: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16M7 16V8M12 16V5M17 16v-3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  polish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 1.9 5.8H20l-4.8 3.5 1.8 5.7L12 14.8 7 18l1.8-5.7L4 8.8h6.1Z"/></svg>`,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  conflict: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
  team: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  room: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  invite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  approve: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>`,
  qrcode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h2v3h-2zM18 18h1v1h-1zM21 18h1v3h-1z"/></svg>`,
  reception: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>`
};

const AGENT_WELCOMES = {
  risk: {
    title: "欢迎使用智能风控助手",
    subtitle: "我是您的 AI 风控协同中枢，集成了风险洞察、分析、处置与问答能力，助您高效应对各类风险挑战",
    capabilities: [
      { icon: "chat", color: "red", title: "风险问答", desc: "快速解答风控政策、流程与合规疑问" },
      { icon: "scan", color: "green", title: "风险识别", desc: "智能识别业务场景中的潜在风险点" },
      { icon: "analyze", color: "blue", title: "风险分析", desc: "多维度分析风险成因与影响范围" },
      { icon: "shield", color: "purple", title: "风险治理", desc: "提供风险处置建议与闭环跟踪" }
    ],
    suggestions: [
      ["当前有哪些高风险待办事项？", "如何识别合同审批中的合规风险？", "风险事件的处置流程是什么？"],
      ["本月风险预警统计有哪些？", "供应商准入的风控要点有哪些？", "如何提交风险整改报告？"]
    ]
  },
  draft: {
    title: "欢迎使用 AI 拟稿助手",
    subtitle: "我是您的智能公文写作助手，可帮您智能起草、润色公文，并自动检查格式规范，提升写作效率",
    capabilities: [
      { icon: "edit", color: "red", title: "智能起草", desc: "根据主题与要点自动生成公文初稿" },
      { icon: "check", color: "green", title: "格式检查", desc: "自动校验 GB/T 9704 公文格式规范" },
      { icon: "polish", color: "blue", title: "润色优化", desc: "优化措辞表达，提升公文专业度" },
      { icon: "template", color: "purple", title: "模板推荐", desc: "按文种智能匹配最佳公文模板" }
    ],
    suggestions: [
      ["帮我起草一份通知", "公文格式规范有哪些？", "如何润色已有文稿？"],
      ["请示和报告有什么区别？", "附件格式有什么要求？", "帮我检查这份公文格式"]
    ]
  },
  schedule: {
    title: "欢迎使用日程助手",
    subtitle: "我是您的智能日程管家，可帮您查看安排、创建提醒、检测冲突，让日程管理更高效",
    capabilities: [
      { icon: "calendar", color: "red", title: "日程查看", desc: "查看今日、本周及自定义时段安排" },
      { icon: "bell", color: "green", title: "会议提醒", desc: "创建会议提醒，避免错过重要事项" },
      { icon: "conflict", color: "blue", title: "冲突检测", desc: "自动检测时间冲突并给出调整建议" },
      { icon: "team", color: "purple", title: "协同安排", desc: "协调多人日程，找到最佳会议时间" }
    ],
    suggestions: [
      ["帮我看看今天的日程", "下周三下午有空吗？", "创建一个会议提醒"],
      ["本周有哪些重要会议？", "检测一下明天的时间冲突", "帮我安排部门例会"]
    ]
  },
  meeting: {
    title: "欢迎使用会议室预定助手",
    subtitle: "我是您的会议室预定专家，可帮您查询空闲会议室、按条件筛选并快速完成预定",
    capabilities: [
      { icon: "room", color: "red", title: "空闲查询", desc: "实时查询各楼层会议室占用情况" },
      { icon: "filter", color: "green", title: "条件筛选", desc: "按人数、设备需求精准筛选" },
      { icon: "book", color: "blue", title: "在线预定", desc: "一键提交预定，自动同步 OA 日程" },
      { icon: "invite", color: "purple", title: "会邀发送", desc: "预定成功后自动发送会议邀请" }
    ],
    suggestions: [
      ["查询今天下午空闲的会议室", "预定一个能容纳 20 人的会议室", "有哪些带视频会议的会议室？"],
      ["取消已预定的会议室", "明天上午 10 点有空的会议室吗？", "帮我预定下周二的会议室"]
    ]
  },
  visitor: {
    title: "欢迎使用访客预约助手",
    subtitle: "我是您的访客管理助手，可帮您登记访客信息、提交审批并生成通行二维码",
    capabilities: [
      { icon: "user", color: "red", title: "访客登记", desc: "快速登记访客姓名、单位与来访信息" },
      { icon: "approve", color: "green", title: "来访审批", desc: "提交来访审批，跟踪审批进度" },
      { icon: "qrcode", color: "blue", title: "通行二维码", desc: "审批通过后自动生成访客通行码" },
      { icon: "reception", color: "purple", title: "接待安排", desc: "关联接待人，通知前台做好准备" }
    ],
    suggestions: [
      ["帮我登记一位访客", "访客预约的审批流程是什么？", "生成访客通行二维码"],
      ["今天有哪些预约访客？", "如何修改访客预约信息？", "访客来访需要准备什么材料？"]
    ]
  },
  default: {
    hero: true,
    title: "我是天翼云数字人",
    subtitle: "请问有什么可以帮您的吗？",
    capabilities: [],
    suggestions: [
      ["如何加快销售速度？", "如何修改 OA 密码？", "公文格式规范有哪些？"],
      ["AI 智慧办公大模型征集说明", "帮我查一下待办事项", "请推荐 deepseek 相关云产品"]
    ]
  }
};

let welcomeSuggestionIndex = 0;

const chatSessions = [
  {
    id: "hist-1",
    title: "风险控制问答",
    preview: "阐述一下问题内容，根据检索到的相关记录，为您整理如下...",
    time: "2025-06-08 14:32",
    pinned: true,
    messages: [
      { role: "user", content: "公文格式规范有哪些？" },
      { role: "assistant", content: RESPONSES["公文格式规范有哪些？"].text, plugin: RESPONSES["公文格式规范有哪些？"].plugin, thinking: RESPONSES["公文格式规范有哪些？"].thinking, thinkingTime: RESPONSES["公文格式规范有哪些？"].thinkingTime }
    ]
  },
  {
    id: "hist-2",
    title: "风险控制问答",
    preview: "帮我查一下待办事项，当前有 3 条 OA 待办...",
    time: "2025-06-07 09:15",
    pinned: false,
    messages: [
      { role: "user", content: "帮我查一下待办" },
      { role: "assistant", content: RESPONSES["帮我查一下待办"].text, plugin: RESPONSES["帮我查一下待办"].plugin, thinking: RESPONSES["帮我查一下待办"].thinking, thinkingTime: RESPONSES["帮我查一下待办"].thinkingTime }
    ]
  },
  {
    id: "hist-3",
    title: "风险控制问答",
    preview: "如何修改 OA 密码？修改步骤如下...",
    time: "2025-06-05 16:48",
    pinned: false,
    messages: [
      { role: "user", content: "如何修改 OA 密码？" },
      { role: "assistant", content: RESPONSES["如何修改 OA 密码？"].text, plugin: RESPONSES["如何修改 OA 密码？"].plugin, thinking: RESPONSES["如何修改 OA 密码？"].thinking, thinkingTime: RESPONSES["如何修改 OA 密码？"].thinkingTime }
    ]
  }
];

function init(options = {}) {
  config = { ...config, ...options };

  aiChatPanel = document.getElementById("aiChatPanel");
  if (!aiChatPanel) return;

  aiSidePanel = document.getElementById("aiSidePanel");
  chatMessages = document.getElementById("chatMessages");
  chatCloseBtn = document.getElementById("chatCloseBtn");
  chatPanelInput = document.getElementById("chatPanelInput");
  chatPanelSend = document.getElementById("chatPanelSend");
  aiNewChatBtn = document.getElementById("aiNewChatBtn");
  aiHistoryToggleBtn = document.getElementById("aiHistoryToggleBtn");
  aiFullscreenBtn = document.getElementById("aiFullscreenBtn");
  aiClearChatBtn = document.getElementById("aiClearChatBtn");
  portalHistoryBtn = document.getElementById("portalHistoryBtn");
  attachmentBar = document.getElementById("attachmentBar");
  attachmentText = document.getElementById("attachmentText");
  attachmentClose = document.getElementById("attachmentClose");
  aiUploadBtn = document.getElementById("aiUploadBtn");
  aiTitleSwitchBtn = document.getElementById("aiTitleSwitchBtn");
  aiAgentSwitcher = document.getElementById("aiAgentSwitcher");
  chatAiToolbar = document.getElementById("chatAiToolbar");
  const chatAiModeSlot = document.getElementById("chatAiModeSlot");
  const chatAiModelSlot = document.getElementById("chatAiModelSlot");

  if (chatAiToolbar && global.AiInputTools) {
    AiInputTools.mountAiToolbar(chatAiToolbar);
    AiInputTools.bindAiToolbar(chatAiToolbar);
    aiUploadBtn = document.getElementById("aiUploadBtn");
  }
  if (chatAiModeSlot && global.AiInputTools) {
    AiInputTools.mountModeSelect(chatAiModeSlot);
  }
  if (chatAiModelSlot && global.AiInputTools) {
    AiInputTools.mountModelSelect(chatAiModelSlot, { autoLabel: "自动" });
    const modelLabel = chatAiModelSlot.querySelector(".ai-model-select-label");
    if (modelLabel) modelLabel.dataset.preferAuto = "true";
  }

  // 点击对话面板内其他区域时收起 + 菜单
  aiChatPanel?.addEventListener("pointerdown", e => {
    if (e.target.closest?.(".ai-composer-plus-wrap")) return;
    global.AiInputTools?.closeAllPlusMenus?.();
  });

  renderSuggestions();
  bindChatEvents();
  bindTitleSwitcher();
  selectAgent(currentAgentId, currentAgentName);
  resetChatInputHeight();
}

function bindTitleSwitcher() {
  renderTitleSwitcher();
  aiTitleSwitchBtn?.addEventListener("click", e => {
    e.stopPropagation();
    const main = aiChatPanel?.querySelector(".ai-chat-main");
    const isOpen = main?.classList.contains("agent-switcher-open");
    toggleTitleSwitcher(!isOpen);
  });

  aiAgentSwitcher?.addEventListener("click", e => {
    const item = e.target.closest("[data-agent-id]");
    if (!item) return;
    e.stopPropagation();
    const agentId = item.dataset.agentId;
    const agent = TITLE_SWITCH_AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    const changed = agent.id !== currentAgentId;
    if (changed) {
      currentSessionId = null;
      isFirstMessage = true;
      chatMessages.innerHTML = "";
      welcomeSuggestionIndex = 0;
      hideSuggestions();
    }
    selectAgent(agent.id, agent.name);
    toggleTitleSwitcher(false);
    if (changed) resetChatInputHeight();
  });

  document.querySelector(".ai-chat-input-area")?.addEventListener("click", () => {
    if (aiChatPanel?.querySelector(".ai-chat-main")?.classList.contains("agent-switcher-open")) {
      toggleTitleSwitcher(false);
    }
  });
}

function renderTitleSwitcher() {
  if (!aiAgentSwitcher) return;
  aiAgentSwitcher.innerHTML = TITLE_SWITCH_AGENTS.map(agent => `
    <button type="button" class="ai-agent-switcher-item${agent.id === currentAgentId ? " active" : ""}" role="option" data-agent-id="${agent.id}" aria-selected="${agent.id === currentAgentId ? "true" : "false"}">
      ${escapeHtml(agent.name)}
    </button>
  `).join("");
}

function toggleTitleSwitcher(open) {
  if (!aiChatPanel || !aiAgentSwitcher || !aiTitleSwitchBtn) return;
  const main = aiChatPanel.querySelector(".ai-chat-main");
  main?.classList.toggle("agent-switcher-open", open);
  aiAgentSwitcher.classList.toggle("hidden", !open);
  aiTitleSwitchBtn.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) renderTitleSwitcher();
}

function selectAgent(agentId, agentName) {
  currentAgentId = agentId;
  currentAgentName = agentName;
  const titleEl = document.querySelector(".ai-chat-title");
  if (titleEl) {
    titleEl.textContent = agentName || DEFAULT_AGENT_NAME;
  }
  renderTitleSwitcher();
  if (isWelcomeState()) {
    welcomeSuggestionIndex = 0;
    showWelcome();
  }
}

function isWelcomeState() {
  if (!chatMessages) return false;
  if (chatMessages.querySelector(".chat-welcome-screen")) return true;
  return !chatMessages.querySelector(".chat-msg") && !chatMessages.children.length;
}

function getAgentWelcome(agentId) {
  const mapped = TITLE_SWITCH_AGENTS.find(a => a.id === agentId);
  const welcomeKey = mapped?.welcomeKey || agentId;
  return AGENT_WELCOMES[welcomeKey] || AGENT_WELCOMES.default;
}

function buildWelcomeTitleHTML(welcome) {
  if (welcome.hero) {
    return `
      <h2 class="chat-welcome-title hero">
        <span class="welcome-hi">H<i class="welcome-i-dot">i</i></span>
        <span class="welcome-name">${escapeHtml(welcome.title)}</span>
      </h2>
    `;
  }
  return `<h2 class="chat-welcome-title">${escapeHtml(welcome.title)}</h2>`;
}

function buildCapabilityCards(capabilities = []) {
  if (!capabilities.length) return "";
  return `
    <div class="chat-welcome-capabilities">
      ${capabilities.map(cap => `
        <div class="welcome-cap-card">
          <div class="welcome-cap-icon ${cap.color}">${CAPABILITY_ICONS[cap.icon] || ""}</div>
          <div class="welcome-cap-title">${escapeHtml(cap.title)}</div>
          <div class="welcome-cap-desc">${escapeHtml(cap.desc)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function buildWelcomeSuggestionsHTML(items = []) {
  if (!items.length) return "";
  return `
    <div class="chat-welcome-suggestions">
      <div class="chat-welcome-suggest-header">
        <span>猜你想问</span>
        <button type="button" class="chat-welcome-refresh" aria-label="换一换">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
          换一换
        </button>
      </div>
      <div class="chat-welcome-suggest-list">
        ${items.map(q => `
          <button type="button" class="chat-welcome-suggest-chip" data-query="${escapeHtml(q)}">
            ${escapeHtml(q)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function bindWelcomeInteractions(container, welcome) {
  container.querySelectorAll(".chat-welcome-suggest-chip").forEach(chip => {
    chip.addEventListener("click", () => sendChatMessage(chip.dataset.query));
  });

  const refreshBtn = container.querySelector(".chat-welcome-refresh");
  if (refreshBtn && welcome.suggestions.length > 1) {
    refreshBtn.addEventListener("click", () => {
      welcomeSuggestionIndex = (welcomeSuggestionIndex + 1) % welcome.suggestions.length;
      const suggestList = container.querySelector(".chat-welcome-suggest-list");
      if (!suggestList) return;
      const items = welcome.suggestions[welcomeSuggestionIndex];
      suggestList.innerHTML = items.map(q => `
        <button type="button" class="chat-welcome-suggest-chip" data-query="${escapeHtml(q)}">
          ${escapeHtml(q)}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      `).join("");
      bindWelcomeInteractions(container, welcome);
    });
  }
}

function removeWelcomeScreen() {
  chatMessages?.querySelector(".chat-welcome-screen")?.remove();
}

function buildSuggestionsHTML(items = SUGGESTIONS) {
  return `
    <div class="msg-suggestions">
      <span class="ai-suggest-label">猜你还想问：</span>
      <div class="ai-suggest-list">
        ${items.map(q => `
          <button type="button" class="ai-suggest-chip" data-query="${escapeHtml(q)}">
            ${escapeHtml(q)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function bindSuggestionChips(container) {
  container.querySelectorAll(".ai-suggest-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      sendChatMessage(chip.dataset.query);
    });
  });
}

function removeAllSuggestions() {
  chatMessages.querySelectorAll(".msg-suggestions").forEach(el => el.remove());
}

function attachSuggestionsToMessage(msgEl, items) {
  if (!msgEl) return;
  const body = msgEl.querySelector(".chat-msg-body");
  if (!body) return;
  body.querySelector(".msg-suggestions")?.remove();
  body.insertAdjacentHTML("beforeend", buildSuggestionsHTML(items));
  bindSuggestionChips(body);
}

function attachSuggestionsToLastAssistant(items) {
  const assistants = chatMessages.querySelectorAll(".chat-msg.assistant");
  const last = assistants[assistants.length - 1];
  if (last && !last.querySelector(".chat-msg-bubble.typing")) {
    attachSuggestionsToMessage(last, items);
  }
}

function renderSuggestions() {
  // no-op: suggestions render inline below AI messages
}

function getChatInputMinHeight() {
  if (!chatPanelInput) return 60;
  const styles = getComputedStyle(chatPanelInput);
  const lineHeight = parseFloat(styles.lineHeight) || 20;
  const defaultRows = parseFloat(styles.getPropertyValue("--input-default-rows")) || 3;
  return lineHeight * defaultRows;
}

function resizeChatInput() {
  if (!chatPanelInput) return;
  const minHeight = getChatInputMinHeight();
  chatPanelInput.style.height = "auto";
  chatPanelInput.style.height = `${Math.max(minHeight, chatPanelInput.scrollHeight)}px`;
}

function resetChatInputHeight() {
  if (!chatPanelInput) return;
  chatPanelInput.style.height = "";
  resizeChatInput();
}

function ensureMentionPopover() {
  if (chatMentionPopover) return;
  const el = document.createElement("div");
  el.className = "ai-mention-popover hidden";
  el.id = "chatMentionPopover";
  el.setAttribute("role", "listbox");
  el.setAttribute("aria-label", "联想选择");
  el.hidden = true;
  el.innerHTML = `
    <div class="ai-mention-head" id="chatMentionHead">切换数字员工 (@, 一次一位)</div>
    <div class="ai-mention-list" id="chatMentionList"></div>
  `;
  document.body.appendChild(el);
  chatMentionPopover = el;
  chatMentionHead = el.querySelector("#chatMentionHead");
  chatMentionList = el.querySelector("#chatMentionList");
}

function detectMentionTrigger(textarea) {
  if (!textarea) return null;
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
    return global.AiToolModals?.getExperts?.() || MENTION_EXPERTS_FALLBACK;
  }
  return global.AiToolModals?.getSkills?.() || MENTION_SKILLS_FALLBACK;
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
  mentionState.items = [];
  mentionState.activeIndex = 0;
  if (!chatMentionPopover) return;
  chatMentionPopover.classList.add("hidden");
  chatMentionPopover.hidden = true;
}

function renderMentionList() {
  if (!chatMentionList) return;
  const { items, type, activeIndex } = mentionState;
  if (!items.length) {
    chatMentionList.innerHTML = `<div class="ai-mention-empty">暂无匹配${type === "expert" ? "专家" : "技能"}</div>`;
    return;
  }
  chatMentionList.innerHTML = items
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

  chatMentionList.querySelectorAll(".ai-mention-item").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      mentionState.activeIndex = Number(btn.dataset.index) || 0;
      chatMentionList.querySelectorAll(".ai-mention-item").forEach((el, i) => {
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
  ensureMentionPopover();
  if (!chatMentionPopover || !textarea) return;
  const rect = textarea.getBoundingClientRect();
  const popW = Math.min(360, window.innerWidth - 32);
  const left = Math.min(
    Math.max(16, rect.left),
    window.innerWidth - popW - 16
  );
  chatMentionPopover.style.width = `${popW}px`;
  chatMentionPopover.style.left = `${left}px`;
  chatMentionPopover.hidden = false;
  chatMentionPopover.classList.remove("hidden");
  const popH = chatMentionPopover.offsetHeight || 220;
  let top = rect.top - popH - 8;
  if (top < 8) top = Math.min(rect.bottom + 8, window.innerHeight - popH - 8);
  chatMentionPopover.style.top = `${Math.max(8, top)}px`;
}

function openMentionPopover(triggerInfo) {
  ensureMentionPopover();
  const type = triggerInfo.trigger === "@" ? "expert" : "skill";
  mentionState.open = true;
  mentionState.type = type;
  mentionState.query = triggerInfo.query;
  mentionState.start = triggerInfo.start;
  mentionState.end = triggerInfo.end;
  mentionState.items = getMentionItems(type, triggerInfo.query);
  mentionState.activeIndex = 0;

  if (chatMentionHead) {
    chatMentionHead.textContent = type === "expert"
      ? "召唤专家 (@, 一次一位)"
      : "添加技能 (/, 可多选)";
  }
  renderMentionList();
  positionMentionPopover(chatPanelInput);
}

function updateMentionFromTextarea() {
  if (!chatPanelInput) return;
  const info = detectMentionTrigger(chatPanelInput);
  if (!info) {
    closeMentionPopover();
    return;
  }
  openMentionPopover(info);
}

function ensureSkillChips() {
  if (chatSkillChips) return chatSkillChips;
  const top = chatPanelInput?.closest(".ai-input-top");
  if (!top) return null;
  const el = document.createElement("div");
  el.className = "ai-skill-chips hidden";
  el.id = "chatSkillChips";
  el.setAttribute("aria-label", "已选技能");
  top.insertBefore(el, chatPanelInput);
  chatSkillChips = el;
  return chatSkillChips;
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
      removeComposerSkill(btn.dataset.removeSkill);
    });
  });
}

function addComposerSkill(item) {
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

function removeComposerSkill(id) {
  composerSkills = composerSkills.filter(s => s.id !== id);
  const skills = global.AiToolModals?.getSkills?.() || [];
  const found = skills.find(s => s.id === id);
  if (found) found.selected = false;
  renderComposerSkills();
}

function clearComposerSkills() {
  composerSkills.forEach(s => {
    const skills = global.AiToolModals?.getSkills?.() || [];
    const found = skills.find(x => x.id === s.id);
    if (found) found.selected = false;
  });
  composerSkills = [];
  renderComposerSkills();
}

function applyExpertToChatHeader(expert) {
  if (!expert?.name) return;
  currentAgentName = expert.name;
  const titleEl = document.querySelector(".ai-chat-title");
  if (titleEl) titleEl.textContent = expert.name;
}

function replaceMentionTrigger(before, after) {
  const next = `${before}${after}`.replace(/[ \t]{2,}/g, " ");
  chatPanelInput.value = next;
  const caret = Math.min(before.length, next.length);
  chatPanelInput.setSelectionRange(caret, caret);
}

function selectMentionItem(index) {
  const item = mentionState.items[index];
  if (!chatPanelInput || !item) return;

  const value = chatPanelInput.value;
  const start = mentionState.start;
  const end = mentionState.end;
  const before = value.slice(0, start);
  const after = value.slice(end);

  if (mentionState.type === "expert") {
    replaceMentionTrigger(before, after);
    global.AiToolModals?.setActiveExpert?.(item.id);
    applyExpertToChatHeader(item);
  } else {
    replaceMentionTrigger(before, after);
    addComposerSkill(item);
  }

  closeMentionPopover();
  resizeChatInput();
  chatPanelInput.focus();
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

function bindChatEvents() {
  ensureMentionPopover();
  ensureSkillChips();

  chatPanelSend?.addEventListener("click", () => {
    closeMentionPopover();
    const text = chatPanelInput.value.trim();
    const payload = buildSendPayload(text);
    if (payload) sendChatMessage(payload);
  });

  chatPanelInput?.addEventListener("input", () => {
    resizeChatInput();
    updateMentionFromTextarea();
  });
  chatPanelInput?.addEventListener("click", updateMentionFromTextarea);
  chatPanelInput?.addEventListener("keyup", e => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      updateMentionFromTextarea();
    }
  });
  chatPanelInput?.addEventListener("keydown", e => {
    if (handleMentionKeydown(e)) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = chatPanelInput.value.trim();
      const payload = buildSendPayload(text);
      if (payload) sendChatMessage(payload);
    }
  });

  window.addEventListener("ai-expert-change", e => {
    const expert = e.detail?.expert;
    if (!expert || expert.id === "default") return;
    if (aiChatPanel?.classList.contains("hidden")) return;
    applyExpertToChatHeader(expert);
  });

  document.addEventListener("pointerdown", e => {
    if (!mentionState.open) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("#chatMentionPopover") || t.closest("#chatPanelInput")) return;
    closeMentionPopover();
  }, true);

  window.addEventListener("resize", () => {
    if (mentionState.open) positionMentionPopover(chatPanelInput);
  });

  chatCloseBtn?.addEventListener("click", closeChatPanel);
  aiNewChatBtn?.addEventListener("click", startNewConversation);
  aiHistoryToggleBtn?.addEventListener("click", toggleHistoryPanel);
  portalHistoryBtn?.addEventListener("click", openHistoryPanel);
  aiFullscreenBtn?.addEventListener("click", toggleFullscreen);
  aiClearChatBtn?.addEventListener("click", clearCurrentChat);
  attachmentClose?.addEventListener("click", () => attachmentBar.classList.add("hidden"));
  aiUploadBtn?.addEventListener("click", () => {
    attachmentBar.classList.remove("hidden");
    attachmentText.textContent = "公文格式标准与排版规范.pdf";
  });

  aiSidePanel?.addEventListener("tp:closed", () => {
    if (sidePanelMode === "history") return;
    sidePanelMode = null;
    aiChatPanel.classList.remove("with-side");
    aiSidePanel.classList.add("hidden");
    aiSidePanel.setAttribute("aria-hidden", "true");
    document.querySelectorAll(".msg-ref-bar.active, .msg-cite-link.active").forEach(el => el.classList.remove("active"));
    delete aiSidePanel.dataset.triggerId;
  });

  window.addEventListener("scroll", syncChatPanelTopAlign, { passive: true });
  window.addEventListener("resize", syncChatPanelTopAlign);
}

function openWithMessage(text) {
  openChatPanel();
  sendChatMessage(text);
}

function openChatPanel() {
  aiChatPanel.classList.remove("hidden");
  lockPageScroll();
  syncChatPanelTopAlign();
  window.dispatchEvent(new CustomEvent("ai-chat-panel-open"));
  // 头部收起为搜索模式后再对齐一次
  requestAnimationFrame(() => syncChatPanelTopAlign());
}

function syncChatPanelTopAlign() {
  if (!aiChatPanel || aiChatPanel.classList.contains("hidden") || aiChatPanel.classList.contains("fullscreen")) {
    if (aiChatPanel?.classList.contains("fullscreen")) {
      aiChatPanel.style.top = "";
    }
    return;
  }

  const sticky = document.getElementById("stickyAiEntry");
  const headerEntry = document.getElementById("headerAiEntry");
  const anchor = sticky?.classList.contains("visible") ? sticky : headerEntry;
  const top = anchor ? Math.max(8, Math.round(anchor.getBoundingClientRect().top)) : 8;
  aiChatPanel.style.top = `${top}px`;
}

function lockPageScroll() {
  if (document.body.dataset.scrollLocked === "1") return;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  document.body.dataset.scrollLocked = "1";
  document.body.dataset.scrollY = String(scrollY);
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.documentElement.classList.add("ai-chat-scroll-lock");
}

function unlockPageScroll() {
  if (document.body.dataset.scrollLocked !== "1") return;
  const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
  document.body.dataset.scrollLocked = "0";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.documentElement.classList.remove("ai-chat-scroll-lock");
  window.scrollTo(0, scrollY);
}

function closeChatPanel() {
  closeMentionPopover();
  aiChatPanel.classList.add("hidden");
  aiChatPanel.style.top = "";
  unlockPageScroll();
  closeSidePanel();
  toggleTitleSwitcher(false);
  aiHistoryToggleBtn.classList.remove("active");
}

function openAvatarChat() {
  const isOpen = !aiChatPanel.classList.contains("hidden");
  if (isOpen) {
    closeChatPanel();
    return;
  }
  openChatPanel();
  if (isFirstMessage && !chatMessages.children.length) {
    showWelcome();
  }
  setTimeout(() => chatPanelInput?.focus(), 50);
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  aiChatPanel.classList.toggle("fullscreen", isFullscreen);
  aiFullscreenBtn.classList.toggle("active", isFullscreen);
  if (isFullscreen) {
    aiChatPanel.style.top = "";
  } else {
    syncChatPanelTopAlign();
  }
}

function clearCurrentChat() {
  if (!confirm("确定清空当前对话吗？")) return;
  chatMessages.innerHTML = "";
  welcomeSuggestionIndex = 0;
  clearComposerSkills();
  if (chatPanelInput) chatPanelInput.value = "";
  showWelcome();
  closeSidePanel();
  hideSuggestions();
}

function toggleHistoryPanel() {
  if (sidePanelMode === "history") {
    closeSidePanel();
    aiHistoryToggleBtn.classList.remove("active");
  } else {
    openHistoryPanel();
  }
}

function openHistoryPanel() {
  openChatPanel();
  if (isFirstMessage && !chatMessages.children.length) showWelcome();
  openSidePanel("history");
  aiHistoryToggleBtn.classList.add("active");
}

function openSidePanel(mode, payload) {
  sidePanelMode = mode;
  aiChatPanel.classList.add("with-side");
  aiSidePanel.classList.remove("hidden");
  aiSidePanel.setAttribute("aria-hidden", "false");

  if (mode === "history") {
    aiSidePanel.classList.remove("tp-open");
    renderHistoryPanel();
    return;
  }

  if (mode === "references") {
    ThirdPanel.openPanel(
      aiSidePanel,
      "references",
      payload || TOTAL_REFS,
      { baseDepth: config.baseDepth }
    );
  } else if (mode === "workbench") {
    ThirdPanel.openPanel(
      aiSidePanel,
      "workbench",
      ThirdPanel.getWorkbench(payload || "")
    );
  }
}

function closeSidePanel() {
  if (sidePanelMode && sidePanelMode !== "history") {
    ThirdPanel.closePanel(aiSidePanel);
  } else {
    aiSidePanel.innerHTML = "";
    aiSidePanel.classList.remove("tp-open");
    aiSidePanel.classList.add("hidden");
    aiSidePanel.setAttribute("aria-hidden", "true");
  }

  sidePanelMode = null;
  aiChatPanel.classList.remove("with-side");
  document.querySelectorAll(".msg-ref-bar.active, .msg-cite-link.active").forEach(el => el.classList.remove("active"));
  delete aiSidePanel.dataset.triggerId;
}

function renderHistoryPanel() {
  const filtered = chatSessions.filter(s => {
    if (!historySearchQuery) return true;
    const q = historySearchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.preview.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  aiSidePanel.innerHTML = `
    <div class="side-history">
      <div class="side-history-search">
        <input type="text" id="historySearchInput" placeholder="搜索历史对话" value="${escapeHtml(historySearchQuery)}" />
      </div>
      <div class="side-history-header">
        <h4>历史对话记录</h4>
        <button type="button" class="side-history-collapse" id="sideHistoryCollapse" title="收起" aria-label="收起">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
            <path d="m16 15-3-3 3-3"/>
          </svg>
        </button>
      </div>
      <ul class="side-history-list">
        ${sorted.map(s => `
          <li class="side-history-item${s.id === currentSessionId ? " active" : ""}" data-session-id="${s.id}">
            <div class="side-history-item-icon">💬</div>
            <div class="side-history-item-body">
              <div class="side-history-item-title">${escapeHtml(s.title)}</div>
              <div class="side-history-item-preview">${escapeHtml(s.preview)}</div>
            </div>
            <div class="side-history-item-actions">
              <button type="button" class="side-history-action pin-btn${s.pinned ? " pinned" : ""}" data-id="${s.id}" title="置顶">☆</button>
              <button type="button" class="side-history-action del-btn" data-id="${s.id}" title="删除">🗑</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  aiSidePanel.querySelector("#sideHistoryCollapse")?.addEventListener("click", () => {
    closeSidePanel();
    aiHistoryToggleBtn.classList.remove("active");
  });

  aiSidePanel.querySelector("#historySearchInput")?.addEventListener("input", e => {
    historySearchQuery = e.target.value;
    renderHistoryPanel();
  });

  aiSidePanel.querySelectorAll(".side-history-item").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.closest(".side-history-action")) return;
      loadSession(item.dataset.sessionId);
    });
  });

  aiSidePanel.querySelectorAll(".pin-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const session = chatSessions.find(s => s.id === btn.dataset.id);
      if (session) {
        session.pinned = !session.pinned;
        renderHistoryPanel();
      }
    });
  });

  aiSidePanel.querySelectorAll(".del-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const idx = chatSessions.findIndex(s => s.id === btn.dataset.id);
      if (idx > -1) {
        if (currentSessionId === btn.dataset.id) startNewConversation();
        chatSessions.splice(idx, 1);
        renderHistoryPanel();
      }
    });
  });
}

function loadSession(sessionId) {
  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) return;

  currentSessionId = sessionId;
  isFirstMessage = false;
  chatMessages.innerHTML = "";
  session.messages.forEach(msg => {
    appendChatMessage(msg.role, msg.content, msg.plugin, {
      persist: false,
      thinking: msg.thinking,
      thinkingTime: msg.thinkingTime
    });
  });
  showSuggestions();
  renderHistoryPanel();
}

function showSuggestions() {
  attachSuggestionsToLastAssistant();
}

function startNewConversation() {
  currentSessionId = null;
  isFirstMessage = true;
  closeSidePanel();
  toggleTitleSwitcher(false);
  aiHistoryToggleBtn.classList.remove("active");
  chatMessages.innerHTML = "";
  welcomeSuggestionIndex = 0;
  clearComposerSkills();
  if (chatPanelInput) chatPanelInput.value = "";
  selectAgent(DEFAULT_AGENT_ID, DEFAULT_AGENT_NAME);
  hideSuggestions();
  resetChatInputHeight();
  chatPanelInput.focus();
}

function ensureCurrentSession(firstUserText) {
  if (currentSessionId) return;
  currentSessionId = `s-${Date.now()}`;
  chatSessions.unshift({
    id: currentSessionId,
    title: "风险控制问答",
    preview: firstUserText.slice(0, 40) + "...",
    time: formatNow(),
    pinned: false,
    messages: []
  });
}

function saveToSession(role, content, plugin, meta = {}) {
  if (!currentSessionId) return;
  const session = chatSessions.find(s => s.id === currentSessionId);
  if (session) {
    session.messages.push({ role, content, plugin: plugin || null, ...meta });
    if (role === "user") {
      session.preview = content.slice(0, 40) + "...";
    }
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAssistantContent(content, plugin) {
  if (!content) return "";
  if (!plugin || plugin.kind !== "references") {
    return escapeHtml(content).replace(/\n/g, "<br>");
  }

  let citeIndex = 0;
  let html = "";
  const citeRegex = /«cite:([^»]+)»/g;
  let lastIndex = 0;
  let match;

  while ((match = citeRegex.exec(content)) !== null) {
    html += escapeHtml(content.slice(lastIndex, match.index)).replace(/\n/g, "<br>");
    citeIndex += 1;
    const title = match[1];
    html += `<button type="button" class="msg-cite-link" data-ref-query="${escapeHtml(title)}">${escapeHtml(title)}</button><sup class="msg-cite-num">${citeIndex}</sup>`;
    lastIndex = match.index + match[0].length;
  }

  html += escapeHtml(content.slice(lastIndex)).replace(/\n/g, "<br>");
  html = html.replace(/《([^》]+)》/g, (_, title) => (
    `<button type="button" class="msg-cite-link" data-ref-query="${escapeHtml(title)}">《${escapeHtml(title)}》</button>`
  ));

  return html;
}

function clearRefActiveState(msgEl) {
  if (!msgEl) return;
  msgEl.querySelector(".msg-ref-bar")?.classList.remove("active");
  msgEl.querySelectorAll(".msg-cite-link.active").forEach(el => el.classList.remove("active"));
}

function bindMessageReferences(msgEl, plugin) {
  if (!plugin || !msgEl) return;

  const refBar = msgEl.querySelector(".msg-ref-bar");
  refBar?.addEventListener("click", () => toggleSidePanelForPlugin(plugin, refBar, msgEl));

  msgEl.querySelectorAll(".msg-cite-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      toggleSidePanelForPlugin(plugin, link, msgEl);
    });
  });
}

function formatNow() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function showWelcome() {
  isFirstMessage = false;
  const welcome = getAgentWelcome(currentAgentId);
  const suggestions = welcome.suggestions[welcomeSuggestionIndex] || welcome.suggestions[0] || [];
  chatMessages.innerHTML = `
    <div class="chat-welcome-screen${welcome.hero ? " hero" : ""}">
      ${buildWelcomeTitleHTML(welcome)}
      <p class="chat-welcome-desc">${escapeHtml(welcome.subtitle)}</p>
      ${buildCapabilityCards(welcome.capabilities)}
      ${welcome.capabilities.length ? '<div class="chat-welcome-dots"><span class="active"></span><span></span><span></span></div>' : ""}
      ${buildWelcomeSuggestionsHTML(suggestions)}
    </div>
  `;
  bindWelcomeInteractions(chatMessages.querySelector(".chat-welcome-screen"), welcome);
}

function hideSuggestions() {
  removeAllSuggestions();
}

function buildSendPayload(text) {
  const skillNames = composerSkills.map(s => s.name).filter(Boolean);
  if (!text && !skillNames.length) return "";
  if (!skillNames.length) return text;
  const skillLine = `[技能] ${skillNames.join("、")}`;
  return text ? `${text}\n${skillLine}` : skillLine;
}

function sendChatMessage(text) {
  removeWelcomeScreen();
  isFirstMessage = false;
  closeMentionPopover();

  ensureCurrentSession(text);
  removeAllSuggestions();
  appendChatMessage("user", text);
  chatPanelInput.value = "";
  resetChatInputHeight();

  const typingEl = appendChatMessage("assistant", "正在思考", null, { persist: false });
  typingEl.querySelector(".chat-msg-bubble").classList.add("typing");

  setTimeout(() => {
    typingEl.remove();
    const response = findResponse(text);
    const msgEl = appendChatMessage("assistant", response.text, response.plugin, {
      thinking: response.thinking,
      thinkingTime: response.thinkingTime
    });
    attachSuggestionsToMessage(msgEl);

    if (response.plugin?.kind === "workbench") {
      setTimeout(() => {
        const triggers = chatMessages.querySelectorAll(".msg-ref-bar");
        const lastTrigger = triggers[triggers.length - 1];
        if (lastTrigger) toggleSidePanelForPlugin(response.plugin, lastTrigger);
      }, 50);
    }
  }, 1000 + Math.random() * 800);
}

function toggleSidePanelForPlugin(plugin, trigger, msgEl) {
  msgEl = msgEl || trigger?.closest(".chat-msg");
  const triggerKey = trigger?.id || trigger?.dataset?.refQuery || "ref-panel";
  const isOpen = aiChatPanel.classList.contains("with-side") && sidePanelMode === plugin.kind;
  const sameTrigger = aiSidePanel.dataset.triggerId === triggerKey;

  if (isOpen && sameTrigger) {
    closeSidePanel();
    clearRefActiveState(msgEl);
    trigger?.classList.remove("active");
    return;
  }

  document.querySelectorAll(".msg-ref-bar.active, .msg-cite-link.active").forEach(el => el.classList.remove("active"));
  aiHistoryToggleBtn.classList.remove("active");
  trigger?.classList.add("active");
  msgEl?.querySelector(".msg-ref-bar")?.classList.add("active");
  aiSidePanel.dataset.triggerId = triggerKey;

  if (plugin.kind === "references") {
    openSidePanel("references", plugin.refCount);
  } else if (plugin.kind === "workbench") {
    openSidePanel("workbench", plugin.keyword);
  }
}

function findResponse(text) {
  for (const [key, value] of Object.entries(RESPONSES)) {
    if (key !== "default" && text.includes(key)) return value;
  }

  const lowerText = text.toLowerCase();
  if (lowerText.includes("拟稿") || lowerText.includes("ai拟稿") || lowerText.includes("起草")) {
    return RESPONSES["AI拟稿"];
  }
  if (lowerText.includes("日程助手") || (lowerText.includes("日程") && lowerText.includes("助手"))) {
    return RESPONSES["日程助手"];
  }
  if (lowerText.includes("会议室")) return RESPONSES["会议室预定"];
  if (lowerText.includes("访客")) return RESPONSES["访客预约"];
  if (lowerText.includes("deepseek") || lowerText.includes("挖商机") || lowerText.includes("营销")) {
    return RESPONSES["请推荐 deepseek 相关云产品"];
  }
  if (lowerText.includes("密码")) return RESPONSES["如何修改 OA 密码？"];
  if (lowerText.includes("公文") && (lowerText.includes("格式") || lowerText.includes("规范"))) {
    return RESPONSES["公文格式规范有哪些？"];
  }
  if (lowerText.includes("公文") || lowerText.includes("新闻") || lowerText.includes("公告")) {
    return RESPONSES["查找最近的公文新闻"];
  }
  if (lowerText.includes("待办")) {
    return lowerText.includes("公文")
      ? RESPONSES["帮我查一下待办公文"]
      : RESPONSES["帮我查一下待办"];
  }
  if (lowerText.includes("收文") || lowerText.includes("阅办")) {
    return RESPONSES["收文阅办怎么操作？"];
  }
  if (lowerText.includes("ai") || lowerText.includes("大模型") || lowerText.includes("征集")) {
    return RESPONSES["AI 智慧办公大模型征集说明"];
  }

  return RESPONSES.default;
}

function appendChatMessage(role, content, plugin, { persist = true, thinking, thinkingTime } = {}) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;

  let bodyHTML = "";

  if (role === "assistant" && plugin) {
    const refId = `ref-trigger-${++pluginSeq}`;
    bodyHTML += `
      <button type="button" class="msg-ref-bar" id="${refId}">
        ${plugin.label}
        <span class="msg-ref-arrow">›</span>
      </button>
    `;
  }

  if (role === "assistant" && thinking) {
    const thinkId = `think-${++pluginSeq}`;
    bodyHTML += `
      <button type="button" class="msg-thinking" data-think-id="${thinkId}">
        思考过程 (共 ${thinkingTime}S)
        <span class="thinking-arrow">›</span>
      </button>
      <div class="msg-thinking-detail" id="${thinkId}">${escapeHtml(thinking)}</div>
    `;
  }

  bodyHTML += `<div class="chat-msg-bubble">${formatAssistantContent(content, plugin)}</div>`;

  if (role === "assistant" && content !== "正在思考") {
    bodyHTML += `
      <div class="msg-actions">
        <button type="button" class="msg-action-btn" title="重新生成" data-action="regen" aria-label="重新生成">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
        </button>
        <button type="button" class="msg-action-btn" title="复制" data-action="copy" aria-label="复制">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <span class="msg-actions-divider" aria-hidden="true"></span>
        <button type="button" class="msg-action-btn" title="喜欢" data-action="like" aria-label="喜欢">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 10v12"/>
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
          </svg>
        </button>
        <button type="button" class="msg-action-btn" title="不喜欢" data-action="dislike" aria-label="不喜欢">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 14V2"/>
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
          </svg>
        </button>
      </div>
    `;
  }

  const avatarHTML = role === "user"
    ? USER_AVATAR_SVG
    : `<img src="${config.aiLogo}" alt="AI" class="ai-logo-img">`;

  div.innerHTML = `
    <div class="chat-msg-avatar">${avatarHTML}</div>
    <div class="chat-msg-body">${bodyHTML}</div>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (plugin) {
    bindMessageReferences(div, plugin);
  }

  div.querySelectorAll(".msg-thinking").forEach(btn => {
    btn.addEventListener("click", () => {
      const detail = document.getElementById(btn.dataset.thinkId);
      detail?.classList.toggle("show");
      btn.classList.toggle("expanded");
    });
  });

  div.querySelectorAll(".msg-action-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const actionsEl = btn.closest(".msg-actions");

      if (action === "copy") {
        navigator.clipboard?.writeText(content.replace(/<br>/g, "\n"));
        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 1500);
      } else if (action === "like") {
        btn.classList.toggle("liked");
        actionsEl?.querySelector('[data-action="dislike"]')?.classList.remove("disliked");
      } else if (action === "dislike") {
        btn.classList.toggle("disliked");
        actionsEl?.querySelector('[data-action="like"]')?.classList.remove("liked");
      } else if (action === "regen") {
        const userMsgs = chatMessages.querySelectorAll(".chat-msg.user");
        const lastUser = userMsgs[userMsgs.length - 1];
        if (lastUser) {
          const userText = lastUser.querySelector(".chat-msg-bubble")?.textContent;
          if (userText) sendChatMessage(userText);
        }
      }
    });
  });

  if (persist && content !== "正在思考") {
    saveToSession(role, content, plugin, { thinking, thinkingTime });
  }

  return div;
}

  global.AiChatPanel = {
    init,
    openPanel: openChatPanel,
    closePanel: closeChatPanel,
    openWithMessage,
    sendMessage: sendChatMessage,
    openAvatarChat,
    openHistoryPanel
  };
})(window);
