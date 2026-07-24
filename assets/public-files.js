(function (global) {
  "use strict";

  const PUBLIC_FILES = [
    {
      id: 5,
      filename: "关于进一步加强公文管理工作的通知.pdf",
      ext: "PDF",
      tag: "通知",
      title: "关于进一步加强公文管理工作的通知",
      date: "2025-03-15",
      department: "集团办公室",
      size: "1.3 KB",
      sizeBytes: 1282,
      pageCount: 2,
      keywords: ["公文", "通知", "管理", "规范", "发文"],
      snippet: "集团办公室发文，要求各单位严格执行公文处理条例，规范发文、收文、签批、归档全流程管理，明确公文分类与 GB/T 9704 格式标准要求..."
    },
    {
      id: 6,
      filename: "公文格式标准与排版规范.pdf",
      ext: "PDF",
      tag: "规范",
      title: "公文格式标准与排版规范",
      date: "2025-01-01",
      department: "综合管理部",
      size: "1.2 KB",
      sizeBytes: 1179,
      pageCount: 3,
      keywords: ["公文", "格式", "排版", "标准", "规范"],
      snippet: "规定公文用纸 A4 版面、字体字号（标题小标宋二号、正文仿宋三号）、行距段落等排版标准，适用于全集团各类正式公文的撰写与印发..."
    },
    {
      id: 7,
      filename: "2025年度收发文登记管理办法.docx",
      ext: "DOCX",
      tag: "制度",
      title: "2025年度收发文登记管理办法",
      date: "2025-01-01",
      department: "集团办公室",
      size: "1.5 KB",
      sizeBytes: 1518,
      pageCount: 4,
      keywords: ["公文", "收文", "发文", "登记", "管理办法"],
      snippet: "规范公司收发文登记管理，收文须在 24 小时内完成登记，发文须经审批后统一编号，确保公文全流程可追溯、可查询..."
    },
    {
      id: 8,
      filename: "请示报告工作规范.pdf",
      ext: "PDF",
      tag: "规范",
      title: "请示报告工作规范",
      date: "2024-11-20",
      department: "人力资源部",
      size: "1.0 KB",
      sizeBytes: 1053,
      pageCount: 2,
      keywords: ["公文", "请示", "报告", "规范", "撰写"],
      snippet: "适用于各单位向上级请示、报告工作的公文撰写，明确请示类公文一文一事原则及报告类公文的客观真实与数据支撑要求..."
    },
    {
      id: 3,
      filename: "集团翼办使用手册.docx",
      ext: "DOCX",
      tag: "操作手册",
      title: "集团翼办使用手册",
      date: "2025-06-30",
      department: "集团办公室",
      size: "5.0 MB",
      sizeBytes: 5250848,
      pageCount: 120,
      keywords: ["翼办", "OA", "公文", "待办", "操作手册"],
      snippet: "集团翼办（OA）平台的完整使用指南，涵盖登录认证、公文管理、待办督办、邮件、日程、知识库等模块，详细说明常用功能操作与移动端使用要点..."
    },
    {
      id: 4,
      filename: "安全公司督办系统操作手册(3).docx",
      ext: "DOCX",
      tag: "操作手册",
      title: "安全公司督办系统操作手册",
      date: "2025-07-08",
      department: "安全公司",
      size: "8.3 MB",
      sizeBytes: 8680660,
      pageCount: 158,
      keywords: ["督办", "OA", "公文", "操作手册", "安全公司"],
      snippet: "督办系统支持任务派发、节点跟踪、进度提醒、报告归档等全流程管理。本手册详细介绍系统登录、任务创建、督办流程、查询统计、移动端协同等操作步骤..."
    },
    {
      id: 2,
      filename: "协同办公竞品分析报告.pdf",
      ext: "PDF",
      tag: "分析报告",
      title: "协同办公竞品分析报告",
      date: "2024-07-24",
      department: "数字化运营部",
      size: "1.9 MB",
      sizeBytes: 1944671,
      pageCount: 42,
      keywords: ["协同办公", "竞品", "OA", "公文", "分析"],
      snippet: "针对市面主流协同办公 OA 平台（钉钉、企业微信、飞书、华为云 WeLink）进行功能、性能、生态对比，重点分析公文流转、待办督办、移动办公、智能助手等关键模块..."
    },
    {
      id: 1,
      filename: "天翼云-解决方案-202307V3 1.pdf",
      ext: "PDF",
      tag: "解决方案",
      title: "天翼云解决方案白皮书 2023 V3",
      date: "2023-07-01",
      department: "天翼云科技有限公司",
      size: "4.4 MB",
      sizeBytes: 4556910,
      pageCount: 86,
      keywords: ["天翼云", "解决方案", "云计算", "信息化"],
      snippet: "天翼云面向政企客户提供云计算、大数据、人工智能等综合解决方案，涵盖 IaaS / PaaS / SaaS 全栈能力，支持公有云、专属云、混合云多种部署模式，助力企业数字化转型..."
    }
  ];

  function getPublicFiles() {
    return PUBLIC_FILES.slice();
  }

  function getFileById(id) {
    return PUBLIC_FILES.find(f => f.id === id);
  }

  function filterByKeyword(keyword) {
    if (!keyword) return getPublicFiles();
    const lower = keyword.toLowerCase();
    const matched = PUBLIC_FILES.filter(f => {
      return (
        f.title.toLowerCase().includes(lower) ||
        f.filename.toLowerCase().includes(lower) ||
        f.snippet.toLowerCase().includes(lower) ||
        f.tag.toLowerCase().includes(lower) ||
        f.keywords.some(k => k.toLowerCase().includes(lower))
      );
    });
    return matched.length > 0 ? matched : getPublicFiles();
  }

  function highlight(text, keyword) {
    if (!keyword) return text;
    const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  }

  function buildFileUrl(file, baseDepth) {
    const depth = baseDepth == null ? 1 : baseDepth;
    const prefix = "../".repeat(depth);
    return `${prefix}public/${encodeURIComponent(file.filename)}`;
  }

  global.PublicFiles = {
    list: getPublicFiles,
    getById: getFileById,
    filter: filterByKeyword,
    highlight,
    buildFileUrl
  };
})(window);
