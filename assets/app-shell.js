(function () {
  const STORAGE_KEYS = { theme: "multi_calc_theme", lang: "multi_calc_lang", bg: "multi_calc_bg" };
  const defaults = { theme: "light", lang: "zh", bg: "mica" };

  const i18n = {
    zh: {
      siteTitle: "多功能计算器",
      themeLabel: "主题",
      themeLight: "普通",
      themeDark: "暗黑",
      langLabel: "语言",
      langZh: "中文",
      langEn: "英语",
      langJa: "日语",
      bgLabel: "背景",
      bgMica: "云母",
      bgAurora: "极光",
      bgWaves: "波浪",
      bgGeo: "几何",
      bgPaper: "纸感",
      heroEyebrow: "工具入口",
      homeTitle: "你的多功能计算器主页",
      homeSubtitle: "先从身高体重比例开始，后续可以继续扩展更多计算器。",
      bmiCardTitle: "身高体重比例（BMI）",
      bmiCardDesc: "输入身高和体重，快速计算 BMI，并查看对应区间。",
      goBmi: "进入 BMI 计算器",
      unitCardTitle: "UnitBridge 美标-国标换算中心",
      unitCardDesc: "支持美标与国际单位互转，包括质量、温度、长度、体积、速度、压力和油耗。",
      goUnitBridge: "进入 UnitBridge",
      fxCardTitle: "汇率转换",
      fxCardDesc: "支持 CNY / USD / JPY 的实时与本地汇率切换计算，联网失败自动降级。",
      goFx: "进入汇率转换",
      calculatorLabel: "计算器",
      bmiTitle: "身高体重比例 BMI 计算器",
      unitBridgeTitle: "UnitBridge 美标-国标换算中心",
      unitBridgeSubtitle: "左侧美标转国标，右侧国标转美标，输入后自动换算。",
      usToSiLabel: "美标 -> 国标",
      siToUsLabel: "国标 -> 美标",
      formulaRefTitle: "换算公式",
      defaultRefTitle: "常用默认值",
      noteRefTitle: "注意事项",
      inputTitle: "输入信息",
      heightLabel: "身高（cm）",
      weightLabel: "体重（kg）",
      calcButton: "计算 BMI",
      resultTitle: "计算结果",
      resultPending: "请先输入数据并计算",
      resultNote: "说明：BMI 仅用于健康参考，不替代医疗诊断。",
      backHome: "返回主页",
      formulaTitle: "BMI 计算公式",
      formulaWeight: "体重(kg)",
      formulaHeight: "身高(m)",
      formulaHint: "提示：先把身高从 cm 换算为 m 再计算。",
      examplePrefix: "示例：",
      rangeTitle: "BMI 参考区间",
      rangeUnder: "过轻",
      rangeNormal: "正常",
      rangeOver: "超重",
      rangeObese: "肥胖",
      reminderTitle: "适用提醒",
      reminderBody: "BMI 用于一般健康参考，不适用于所有人群，也不能替代医生诊断。",
      fxTitle: "汇率转换",
      fxSubtitle: "默认实时汇率，获取失败自动降级本地汇率，也可手动切换。",
      fxModeLabel: "汇率模式",
      fxModeLive: "实时汇率",
      fxModeLocal: "本地汇率",
      fxRefresh: "刷新实时汇率",
      fxAmount: "金额",
      fxFrom: "源货币",
      fxTo: "目标货币",
      fxResult: "转换结果",
      fxFormulaTitle: "换算公式",
      fxFormulaLine1: "结果 = 金额 × 汇率(from->to)",
      fxFormulaLine2: "交叉汇率：A->B = (USD->B)/(USD->A)",
      fxRateInfo: "汇率信息",
      fxDisclaimer: "仅供参考，不作为交易报价。"
    },
    en: {
      siteTitle: "Multi Calculator",
      themeLabel: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      langLabel: "Language",
      langZh: "Chinese",
      langEn: "English",
      langJa: "Japanese",
      bgLabel: "Background",
      bgMica: "Mica",
      bgAurora: "Aurora",
      bgWaves: "Waves",
      bgGeo: "Geometry",
      bgPaper: "Paper",
      heroEyebrow: "Tools",
      homeTitle: "Your Multi-Calculator Home",
      homeSubtitle: "Start with BMI now and keep adding new calculators later.",
      bmiCardTitle: "Height & Weight Ratio (BMI)",
      bmiCardDesc: "Enter your height and weight to calculate BMI instantly.",
      goBmi: "Open BMI Calculator",
      unitCardTitle: "UnitBridge US-SI Converter",
      unitCardDesc: "Convert between US customary and SI units across mass, temperature, length, volume, speed, pressure, and fuel economy.",
      goUnitBridge: "Open UnitBridge",
      fxCardTitle: "Exchange Converter",
      fxCardDesc: "CNY / USD / JPY conversion with live mode and local fallback mode.",
      goFx: "Open Exchange Converter",
      calculatorLabel: "Calculator",
      bmiTitle: "BMI Calculator",
      unitBridgeTitle: "UnitBridge US-SI Converter",
      unitBridgeSubtitle: "Left side converts US to SI, right side converts SI to US in real time.",
      usToSiLabel: "US -> SI",
      siToUsLabel: "SI -> US",
      formulaRefTitle: "Conversion Formulas",
      defaultRefTitle: "Default Reference Values",
      noteRefTitle: "Notes",
      inputTitle: "Input",
      heightLabel: "Height (cm)",
      weightLabel: "Weight (kg)",
      calcButton: "Calculate BMI",
      resultTitle: "Result",
      resultPending: "Enter your values and calculate first.",
      resultNote: "Note: BMI is for general health reference only.",
      backHome: "Back to Home",
      formulaTitle: "BMI Formula",
      formulaWeight: "Weight (kg)",
      formulaHeight: "Height (m)",
      formulaHint: "Tip: Convert height from cm to m before calculation.",
      examplePrefix: "Example:",
      rangeTitle: "BMI Reference Ranges",
      rangeUnder: "Underweight",
      rangeNormal: "Normal",
      rangeOver: "Overweight",
      rangeObese: "Obese",
      reminderTitle: "Reminder",
      reminderBody: "BMI is for general health reference and does not replace medical diagnosis.",
      fxTitle: "Exchange Converter",
      fxSubtitle: "Live rates by default; auto fallback to local rates on failure; manual switch supported.",
      fxModeLabel: "Rate Mode",
      fxModeLive: "Live Rates",
      fxModeLocal: "Local Rates",
      fxRefresh: "Refresh Live Rates",
      fxAmount: "Amount",
      fxFrom: "From",
      fxTo: "To",
      fxResult: "Result",
      fxFormulaTitle: "Formula",
      fxFormulaLine1: "Result = Amount × rate(from->to)",
      fxFormulaLine2: "Cross rate: A->B = (USD->B)/(USD->A)",
      fxRateInfo: "Rate Info",
      fxDisclaimer: "For reference only, not a trading quote."
    },
    ja: {
      siteTitle: "マルチ電卓",
      themeLabel: "テーマ",
      themeLight: "ライト",
      themeDark: "ダーク",
      langLabel: "言語",
      langZh: "中国語",
      langEn: "英語",
      langJa: "日本語",
      bgLabel: "背景",
      bgMica: "マイカ",
      bgAurora: "オーロラ",
      bgWaves: "ウェーブ",
      bgGeo: "ジオメトリ",
      bgPaper: "ペーパー",
      heroEyebrow: "ツール",
      homeTitle: "マルチ電卓ホーム",
      homeSubtitle: "まずBMIから始めて、あとで他の計算機能を追加できます。",
      bmiCardTitle: "身長体重比率（BMI）",
      bmiCardDesc: "身長と体重を入力してBMIをすぐ計算できます。",
      goBmi: "BMI計算機へ",
      unitCardTitle: "UnitBridge 米国標準-SI単位変換",
      unitCardDesc: "米国単位とSI単位を、質量・温度・長さ・体積・速度・圧力・燃費で相互変換できます。",
      goUnitBridge: "UnitBridgeへ",
      fxCardTitle: "為替変換",
      fxCardDesc: "CNY / USD / JPY をリアルタイムとローカルで切替計算できます。",
      goFx: "為替変換へ",
      calculatorLabel: "計算機",
      bmiTitle: "BMI 計算機",
      unitBridgeTitle: "UnitBridge 米国標準-SI単位変換",
      unitBridgeSubtitle: "左側は米国単位からSI、右側はSIから米国単位を自動変換します。",
      usToSiLabel: "米国 -> SI",
      siToUsLabel: "SI -> 米国",
      formulaRefTitle: "変換式",
      defaultRefTitle: "よく使う初期値",
      noteRefTitle: "注意点",
      inputTitle: "入力",
      heightLabel: "身長（cm）",
      weightLabel: "体重（kg）",
      calcButton: "BMIを計算",
      resultTitle: "結果",
      resultPending: "数値を入力して計算してください。",
      resultNote: "注記：BMIは一般的な健康の目安です。",
      backHome: "ホームへ戻る",
      formulaTitle: "BMI 計算式",
      formulaWeight: "体重(kg)",
      formulaHeight: "身長(m)",
      formulaHint: "ヒント：計算前に身長を cm から m に換算してください。",
      examplePrefix: "例：",
      rangeTitle: "BMI 参考範囲",
      rangeUnder: "低体重",
      rangeNormal: "標準",
      rangeOver: "過体重",
      rangeObese: "肥満",
      reminderTitle: "注意事項",
      reminderBody: "BMIは一般的な健康の目安であり、医師の診断に代わるものではありません。",
      fxTitle: "為替変換",
      fxSubtitle: "既定はリアルタイム。取得失敗時はローカルへ自動フォールバック。手動切替も可能です。",
      fxModeLabel: "レートモード",
      fxModeLive: "リアルタイム",
      fxModeLocal: "ローカル",
      fxRefresh: "リアルタイム更新",
      fxAmount: "金額",
      fxFrom: "元通貨",
      fxTo: "先通貨",
      fxResult: "結果",
      fxFormulaTitle: "計算式",
      fxFormulaLine1: "結果 = 金額 × レート(from->to)",
      fxFormulaLine2: "クロスレート：A->B = (USD->B)/(USD->A)",
      fxRateInfo: "レート情報",
      fxDisclaimer: "参考値であり、取引レートではありません。"
    }
  };

  function readSetting(key) { return localStorage.getItem(STORAGE_KEYS[key]) || defaults[key]; }
  function writeSetting(key, value) { localStorage.setItem(STORAGE_KEYS[key], value); }

  function getCurrentRoute() {
    const raw = (window.location.hash || "#/home").replace(/^#\//, "").toLowerCase().trim();
    return (window.PageRenderers && window.PageRenderers[raw]) ? raw : "home";
  }

  function applyI18n(root) {
    const lang = readSetting("lang");
    (root || document).querySelectorAll("[data-i18n]").forEach((el) => {
      const text = i18n[lang] && i18n[lang][el.dataset.i18n];
      if (text) el.textContent = text;
    });
  }

  function setTheme(theme) { document.documentElement.dataset.theme = theme; writeSetting("theme", theme); }

  function setLanguage(lang) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    writeSetting("lang", lang);
    applyI18n(document);
    document.dispatchEvent(new CustomEvent("app:language-changed", { detail: { lang: lang } }));
  }

  function setBackground(bg) {
    document.documentElement.dataset.bg = bg;
    writeSetting("bg", bg);
    document.querySelectorAll(".bg-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.bg === bg));
  }

  function updateClock() {
    const timeEl = document.getElementById("clock-time");
    const dateEl = document.getElementById("clock-date");
    if (!timeEl || !dateEl) return;
    const lang = readSetting("lang");
    const now = new Date();
    timeEl.textContent = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
    dateEl.textContent = new Intl.DateTimeFormat(lang, { year: "numeric", month: "numeric", day: "numeric" }).format(now);
  }

  let cleanupView = null;
  function renderRoute() {
    const view = document.getElementById("app-view");
    if (!view) return;
    if (typeof cleanupView === "function") cleanupView();

    const route = getCurrentRoute();
    const renderer = window.PageRenderers[route];
    cleanupView = renderer(view, { getLang: function () { return readSetting("lang"); } }) || null;
    applyI18n(view);
  }

  function wireControls() {
    var themeSelect = document.getElementById("theme-select");
    var langSelect = document.getElementById("lang-select");

    themeSelect.value = readSetting("theme");
    langSelect.value = readSetting("lang");

    themeSelect.addEventListener("change", function (e) { setTheme(e.target.value); });
    langSelect.addEventListener("change", function (e) { setLanguage(e.target.value); updateClock(); });

    document.querySelectorAll(".bg-tab").forEach((tab) => {
      tab.addEventListener("click", function () { setBackground(tab.dataset.bg); });
    });
  }

  function init() {
    if (!window.PageRenderers) window.PageRenderers = {};
    setTheme(readSetting("theme"));
    setLanguage(readSetting("lang"));
    setBackground(readSetting("bg"));
    wireControls();

    if (!window.location.hash) window.location.hash = "#/home";
    window.addEventListener("hashchange", renderRoute);
    renderRoute();
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  window.AppShell = { i18n: i18n, getLang: function () { return readSetting("lang"); }, applyI18n: applyI18n };

  init();
})();
