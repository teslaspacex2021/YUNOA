(function (global) {
  "use strict";

  // 检索记录数据：基于 /public 真实文件，每个文件分章节展开成多条片段
  const PUBLIC_REF_MAP = [
    {
      sourceId: 3,
      filename: "集团翼办使用手册.docx",
      ext: "DOCX",
      chapters: [
        "集团翼办平台登录与个人主页设置：通过统一身份认证登录后，进入首页可看到待办、公文、邮件等核心模块入口...",
        "公文起草与流转：在「公文管理」模块新建公文，按文种选择模板，正文编辑完成后提交流程审批，支持多级会签...",
        "待办督办：所有待办事项汇总至首页待办栏目，支持按督办状态、文种、紧急程度筛选，超期任务自动红色高亮...",
        "公文格式规范：标题二号小标宋体，正文三号仿宋；附件应在正文下空一行单独标注；落款日期使用阿拉伯数字...",
        "移动端翼办使用：在手机端可处理待办、查看公文正文、附件预览、批注，支持电子签批与人脸识别审批...",
        "知识库与文档检索：知识库支持全文检索、关键词高亮、相关推荐，文档可一键收藏到个人空间..."
      ]
    },
    {
      sourceId: 4,
      filename: "安全公司督办系统操作手册(3).docx",
      ext: "DOCX",
      chapters: [
        "督办系统首页概览：展示当前待办、已办、即将超期、本月统计四个核心区块，便于快速掌握督办全局态势...",
        "督办任务创建：进入「新建督办」页面，填写任务名称、责任部门、责任人、办结时限、关联公文等字段...",
        "节点跟踪：每条督办任务可设置 1~5 个进度节点，支持节点到期提醒、节点完成上报、节点延期申请...",
        "督办报告归档：办结后系统自动生成督办报告，支持 PDF 导出、批量归档、按年度/部门/类型查询...",
        "数据统计与报表：提供督办量统计、办结率、平均时长、超期率等多维报表，支持自定义导出..."
      ]
    },
    {
      sourceId: 1,
      filename: "天翼云-解决方案-202307V3 1.pdf",
      ext: "PDF",
      chapters: [
        "天翼云政企云解决方案：依托国家云底座，为政府、央国企客户提供安全可控的云基础设施及行业应用...",
        "公文协同办公解决方案：基于天翼云提供 OA、邮件、视频会议、文档协作等一站式协同办公服务...",
        "数据安全合规：符合等保 2.0 三级、密评、关基保护等多项国家标准，数据存储与传输全链路加密...",
        "AI 智慧办公：基于翼支付智能体平台，提供智能写作、智能审核、智能问答等 AI 增强能力..."
      ]
    },
    {
      sourceId: 2,
      filename: "协同办公竞品分析报告.pdf",
      ext: "PDF",
      chapters: [
        "市场格局：钉钉（阿里）、企业微信（腾讯）、飞书（字节）三足鼎立，华为云 WeLink、腾讯 TAPD 紧随其后...",
        "公文流转能力对比：钉钉 OA 强在审批引擎；飞书强在多维表格协作；翼办强在公文规范化与集团级管控...",
        "AI 智能能力对比：飞书已上线智能助理，企业微信集成混元大模型，钉钉 AI 助理 7.5 全面发布...",
        "对天翼云翼办的建议：强化 AI 智慧办公能力，整合数字人入口；优化移动端体验；构建央国企专属知识库..."
      ]
    }
  ];

  const REFERENCE_LIBRARY = [];
  let refId = 0;
  PUBLIC_REF_MAP.forEach(group => {
    group.chapters.forEach((snippet, idx) => {
      refId += 1;
      REFERENCE_LIBRARY.push({
        id: refId,
        sourceId: group.sourceId,
        filename: group.filename,
        ext: group.ext,
        chapter: `第 ${idx + 1} 章节`,
        snippet
      });
    });
  });

  const WORKBENCH_PRESETS = {
    "deepseek": {
      scenarioName: "DeepSeek云生态高价值客户精准拓销计划",
      description:
        "面向云服务商、大型企业IT部门等渠道为云公司且云主机数量多的高价值客户，结合DeepSeek相关云产品（如AI算力、模型训练平台、数据处理引擎等），提供定制化云解决方案包。通过以下策略实现精准营销：\n\n1. 产品定位：突出DeepSeek云产品在高性能计算、AI模型部署、弹性资源调度等方面的优势，匹配客户对大规模云主机的需求。\n2. 渠道策略：联合云公司（如AWS/Azure/阿里云等）的渠道伙伴，推出联合云品牌解决方案或预集成镜像，通过云市场快速触达客户。\n3. 高价值客户标签：目标客户特征：云主机数量≥500台、年云支出超百万，有AI/大数据业务场景。\n4. 转化抓手：免费云资源健康度评估 + DeepSeek产品POC试用。",
      tags: [
        { code: "10A02002002", name: "来源渠道名称", value: "云公司", weight: "80%" },
        { code: "10A02002012", name: "云主机台数", value: "20台", weight: "15%" },
        { code: "10A02003004", name: "客户近3个月平均消费", value: "10000元", weight: "5%" }
      ],
      customers: [
        { name: "AA公司", province: "福建省", industry: "畜牧业", scale: "大型企业", isListed: "是", duration: "5年" },
        { name: "BB集团", province: "广东省", industry: "信息技术", scale: "大型企业", isListed: "否", duration: "8年" },
        { name: "CC科技", province: "北京市", industry: "互联网", scale: "中型企业", isListed: "是", duration: "3年" },
        { name: "DD智能", province: "上海市", industry: "AI 服务", scale: "大型企业", isListed: "是", duration: "6年" },
        { name: "EE能源", province: "山东省", industry: "能源", scale: "大型企业", isListed: "是", duration: "10年" }
      ]
    },
    default: {
      scenarioName: "通用营销场景拓客计划",
      description: "针对当前业务关键词，自动构建客户标签体系、商机挖掘规则与派发策略。",
      tags: [
        { code: "10A00000001", name: "客户分级", value: "高价值", weight: "60%" },
        { code: "10A00000002", name: "在网时长", value: "≥3年", weight: "25%" },
        { code: "10A00000003", name: "月均消费", value: "≥5000元", weight: "15%" }
      ],
      customers: [
        { name: "示例客户", province: "—", industry: "—", scale: "—", isListed: "—", duration: "—" }
      ]
    }
  };

  function getReferences(count) {
    return REFERENCE_LIBRARY.slice(0, count || 20);
  }

  function getReferenceFiles(count) {
    const n = count || 10;
    const base = PUBLIC_REF_MAP.map(g => ({
      id: g.sourceId,
      filename: g.filename,
      ext: g.ext,
      snippet: g.chapters[0]
    }));
    const result = [];
    for (let i = 0; i < n; i += 1) {
      const item = base[i % base.length];
      result.push({
        id: item.id,
        filename: item.filename,
        ext: item.ext,
        snippet: item.snippet
      });
    }
    return result;
  }

  function getWorkbench(keyword) {
    const key = (keyword || "").toLowerCase();
    if (key.includes("deepseek") || key.includes("营销") || key.includes("挖商机") || key.includes("商机")) {
      return WORKBENCH_PRESETS.deepseek;
    }
    return WORKBENCH_PRESETS.default;
  }

  function renderReferencePanel(refs, baseDepth) {
    const depth = baseDepth == null ? 1 : baseDepth;
    const items = refs.map((r, idx) => {
      const extColor = r.ext === "PDF" ? "#ff4d4f" : (r.ext === "DOCX" ? "#1677ff" : (r.ext === "PPTX" ? "#fa8c16" : "#52c41a"));
      const extLabel = r.ext === "DOCX" ? "W" : r.ext.slice(0, 1);
      const fileUrl = `${"../".repeat(depth)}public/${encodeURIComponent(r.filename)}`;
      const showDownload = idx === 1;
      return `
        <li class="tp-ref-item">
          <a class="tp-ref-link" href="${fileUrl}" target="_blank" rel="noopener">
            <div class="tp-ref-icon">
              <svg width="32" height="38" viewBox="0 0 44 54" fill="none">
                <path d="M4 0h26l10 10v40a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#fff" stroke="#e8e8e8" stroke-width="1"/>
                <path d="M30 0v10h10" fill="#fafafa" stroke="#e8e8e8" stroke-width="1"/>
                <text x="22" y="42" font-size="10" fill="${extColor}" stroke="none" font-weight="700" text-anchor="middle">${extLabel}</text>
              </svg>
            </div>
            <div class="tp-ref-body">
              <div class="tp-ref-title">${r.filename}</div>
              <div class="tp-ref-snippet">${r.snippet}</div>
            </div>
            ${showDownload ? `
              <span class="tp-ref-download" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </span>
            ` : ""}
          </a>
        </li>
      `;
    }).join("");

    return `
      <div class="tp-header">
        <div class="tp-header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          检索结果
        </div>
        <button class="tp-close" data-tp-close aria-label="收起">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
            <path d="m16 15-3-3 3-3"/>
          </svg>
        </button>
      </div>
      <div class="tp-body">
        <ul class="tp-ref-list">${items}</ul>
      </div>
    `;
  }

  function renderWorkbenchPanel(data) {
    const tagRows = data.tags.map(t => `
      <tr><td>${t.code}</td><td>${t.name}</td><td>${t.value}</td><td>${t.weight}</td></tr>
    `).join("");
    const customerRows = data.customers.map(c => `
      <tr><td>${c.name}</td><td>${c.province}</td><td>${c.industry}</td><td>${c.scale}</td><td>${c.isListed}</td><td>${c.duration}</td></tr>
    `).join("");

    return `
      <div class="tp-header">
        <div class="tp-header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>
          </svg>
          工作台
        </div>
        <button class="tp-close" data-tp-close aria-label="关闭"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="tp-body">
        <div class="tp-stepper">
          <div class="tp-step done"><span class="tp-step-icon">▦</span><span>设场景</span></div>
          <div class="tp-step-line"></div>
          <div class="tp-step active"><span class="tp-step-icon">⛏</span><span>挖商机</span></div>
          <div class="tp-step-line"></div>
          <div class="tp-step"><span class="tp-step-icon">⛓</span><span>建线索</span></div>
          <div class="tp-step-line"></div>
          <div class="tp-step"><span class="tp-step-icon">📨</span><span>派发</span></div>
        </div>

        <div class="tp-section">
          <h4 class="tp-section-title">营销场景</h4>
          <div class="tp-scenario-name">${data.scenarioName}</div>
        </div>

        <div class="tp-section">
          <h4 class="tp-section-title">场景描述</h4>
          <div class="tp-scenario-desc">${data.description.replace(/\n/g, "<br>")}</div>
        </div>

        <div class="tp-section">
          <div class="tp-section-row">
            <h4 class="tp-section-title">核心标签</h4>
            <div class="tp-section-actions">
              <button class="tp-btn primary">添加</button>
              <button class="tp-btn">编辑</button>
            </div>
          </div>
          <table class="tp-table">
            <thead><tr><th>标签编码</th><th>标签名称</th><th>标签值</th><th>权重</th></tr></thead>
            <tbody>${tagRows}</tbody>
          </table>
        </div>

        <div class="tp-section">
          <h4 class="tp-section-title">全部原始数据如下</h4>
          <table class="tp-table">
            <thead><tr><th>客户名称</th><th>省份</th><th>所属行业</th><th>企业规模</th><th>是否上市</th><th>在网时长</th></tr></thead>
            <tbody>${customerRows}</tbody>
          </table>
        </div>

        <div class="tp-wb-footer">
          <button class="tp-btn" type="button">编辑</button>
          <button class="tp-btn" type="button">重新总结</button>
          <button class="tp-btn primary" type="button">下一步</button>
        </div>
      </div>
    `;
  }

  function openPanel(host, mode, payload, opts) {
    if (!host) return;
    const baseDepth = (opts && opts.baseDepth) != null ? opts.baseDepth : 1;
    let html = "";
    if (mode === "references") {
      html = renderReferencePanel(getReferenceFiles(typeof payload === "number" ? payload : 20), baseDepth);
    } else if (mode === "workbench") {
      html = renderWorkbenchPanel(payload || getWorkbench(""));
    }
    host.innerHTML = html;
    host.classList.add("tp-open");
    host.classList.remove("hidden");
    host.dataset.mode = mode;

    host.querySelector("[data-tp-close]")?.addEventListener("click", () => {
      closePanel(host);
    });

    host.dispatchEvent(new CustomEvent("tp:opened", { detail: { mode } }));
  }

  function closePanel(host) {
    if (!host) return;
    host.classList.remove("tp-open");
    host.classList.add("hidden");
    host.innerHTML = "";
    host.dispatchEvent(new CustomEvent("tp:closed"));
  }

  global.ThirdPanel = {
    openPanel,
    closePanel,
    getReferences,
    getReferenceFiles,
    getWorkbench,
    renderReferencePanel,
    renderWorkbenchPanel
  };
})(window);
