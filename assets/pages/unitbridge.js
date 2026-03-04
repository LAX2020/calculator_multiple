window.PageRenderers = window.PageRenderers || {};

(function () {
  const STORAGE_KEY = "unit_bridge_category";

  const CATEGORIES = [
    { id: "mass", tab: { zh: "质量", en: "Mass", ja: "質量" }, usUnit: "lb", siUnit: "kg", defaultUs: 165, defaultSi: 75, precision: 2, usToSi: (x) => x * 0.45359237, siToUs: (x) => x * 2.2046226218, formula: ["lb × 0.45359237 = kg", "kg × 2.2046226218 = lb"], note: { zh: "英镑(lb)常用于美国体重与包装标注。", en: "Pounds (lb) are common in US body weight and packaging labels.", ja: "ポンド(lb)は米国の体重表記や包装でよく使われます。" } },
    { id: "temperature", tab: { zh: "温度", en: "Temp", ja: "温度" }, usUnit: "°F", siUnit: "°C", defaultUs: 72, defaultSi: 22.2, precision: 1, usToSi: (x) => ((x - 32) * 5) / 9, siToUs: (x) => (x * 9) / 5 + 32, formula: ["(°F - 32) × 5/9 = °C", "°C × 9/5 + 32 = °F"], note: { zh: "美国日常温度常用华氏(°F)。", en: "US daily weather reports usually use Fahrenheit (°F).", ja: "米国の日常気温は華氏(°F)が一般的です。" } },
    { id: "length_small", tab: { zh: "长度(cm/in)", en: "cm/in", ja: "長さ(cm/in)" }, usUnit: "in", siUnit: "cm", defaultUs: 69, defaultSi: 175, precision: 2, usToSi: (x) => x * 2.54, siToUs: (x) => x / 2.54, formula: ["in × 2.54 = cm", "cm ÷ 2.54 = in"], note: { zh: "英寸(in)常用于屏幕尺寸和身高换算。", en: "Inches are common for displays and quick height conversions.", ja: "インチ(in)は画面サイズや身長換算でよく使われます。" } },
    { id: "length_large", tab: { zh: "长度(m/ft)", en: "m/ft", ja: "長さ(m/ft)" }, usUnit: "ft", siUnit: "m", defaultUs: 5.74, defaultSi: 1.75, precision: 3, usToSi: (x) => x * 0.3048, siToUs: (x) => x / 0.3048, formula: ["ft × 0.3048 = m", "m ÷ 0.3048 = ft"], note: { zh: "英尺(ft)常见于美国建筑与身高口语表达。", en: "Feet are common in US construction and spoken height references.", ja: "フィート(ft)は米国の建築や身長表現でよく使われます。" } },
    { id: "distance", tab: { zh: "距离(km/mi)", en: "km/mi", ja: "距離(km/mi)" }, usUnit: "mi", siUnit: "km", defaultUs: 3.11, defaultSi: 5, precision: 3, usToSi: (x) => x * 1.609344, siToUs: (x) => x * 0.6213711922, formula: ["mi × 1.609344 = km", "km × 0.6213711922 = mi"], note: { zh: "美国道路里程普遍使用英里(mi)。", en: "US roads and maps commonly use miles (mi).", ja: "米国の道路距離はマイル(mi)表記が一般的です。" } },
    { id: "volume", tab: { zh: "体积(L/gal)", en: "L/gal", ja: "体積(L/gal)" }, usUnit: "US gal", siUnit: "L", defaultUs: 1, defaultSi: 3.785, precision: 3, usToSi: (x) => x * 3.785411784, siToUs: (x) => x / 3.785411784, formula: ["US gal × 3.785411784 = L", "L ÷ 3.785411784 = US gal"], note: { zh: "这里使用 US gallon，不是 Imperial gallon。", en: "This uses US gallon, not Imperial gallon.", ja: "ここではUSガロンを使用し、英ガロンではありません。" } },
    { id: "speed", tab: { zh: "速度(km/h)", en: "Speed", ja: "速度" }, usUnit: "mph", siUnit: "km/h", defaultUs: 62.14, defaultSi: 100, precision: 2, usToSi: (x) => x * 1.609344, siToUs: (x) => x * 0.6213711922, formula: ["mph × 1.609344 = km/h", "km/h × 0.6213711922 = mph"], note: { zh: "美国限速牌通常使用 mph。", en: "US speed limits are typically posted in mph.", ja: "米国の速度制限標識は通常 mph です。" } },
    { id: "pressure", tab: { zh: "压力(kPa/psi)", en: "kPa/psi", ja: "圧力(kPa/psi)" }, usUnit: "psi", siUnit: "kPa", defaultUs: 14.7, defaultSi: 101.325, precision: 3, usToSi: (x) => x * 6.894757293, siToUs: (x) => x / 6.894757293, formula: ["psi × 6.894757293 = kPa", "kPa ÷ 6.894757293 = psi"], note: { zh: "轮胎压力在美国常用 psi，在国际常用 kPa。", en: "Tire pressure uses psi in US and often kPa internationally.", ja: "タイヤ空気圧は米国でpsi、国際的にはkPaが一般的です。" } },
    { id: "fuel", tab: { zh: "油耗(mpg)", en: "Fuel", ja: "燃費" }, usUnit: "mpg (US)", siUnit: "L/100km", defaultUs: 30, defaultSi: 7.84, precision: 2, usToSi: (x) => 235.214583 / x, siToUs: (x) => 235.214583 / x, formula: ["L/100km = 235.214583 ÷ mpg", "mpg = 235.214583 ÷ (L/100km)"], note: { zh: "油耗方向相反：mpg 越大表示越省油。", en: "Fuel economy is inverse: higher mpg means lower consumption.", ja: "燃費は逆数関係で、mpg が高いほど低消費です。" } },
  ];

  window.PageRenderers.unitbridge = function renderUnitBridge(container, app) {
    container.className = "page page-unitbridge";
    container.innerHTML = `
      <section class="hero glass compact">
        <p class="eyebrow" data-i18n="calculatorLabel">计算器</p>
        <h1 data-i18n="unitBridgeTitle">UnitBridge 美标-国标换算中心</h1>
        <p class="hero-copy" data-i18n="unitBridgeSubtitle">左侧美标转国标，右侧国标转美标，输入后自动换算。</p>
      </section>
      <section class="unit-converter card glass">
        <div class="unit-tabs" id="unit-tabs" role="tablist" aria-label="Converter Categories"></div>
        <div class="convert-grid">
          <article class="convert-panel glass-soft">
            <h2 data-i18n="usToSiLabel">美标 -> 国标</h2>
            <p class="panel-unit" id="left-unit-name">lb</p>
            <input id="left-input" type="number" step="any" inputmode="decimal">
          </article>
          <article class="convert-panel glass-soft">
            <h2 data-i18n="siToUsLabel">国标 -> 美标</h2>
            <p class="panel-unit" id="right-unit-name">kg</p>
            <input id="right-input" type="number" step="any" inputmode="decimal">
            <a class="btn-secondary" href="#/home" data-i18n="backHome">返回主页</a>
          </article>
        </div>
      </section>
      <section class="unit-reference">
        <article class="card glass info-card">
          <h2 data-i18n="formulaRefTitle">换算公式</h2>
          <p class="formula-line" id="formula-forward"></p>
          <p class="formula-line" id="formula-reverse"></p>
        </article>
        <article class="card glass info-card">
          <h2 data-i18n="defaultRefTitle">常用默认值</h2>
          <p class="example-line" id="default-example"></p>
          <p class="info-copy" id="default-note"></p>
        </article>
        <article class="card glass info-card">
          <h2 data-i18n="noteRefTitle">注意事项</h2>
          <p class="info-copy" id="category-note"></p>
        </article>
      </section>
    `;

    const tabsEl = container.querySelector("#unit-tabs");
    const leftInput = container.querySelector("#left-input");
    const rightInput = container.querySelector("#right-input");
    const leftUnitName = container.querySelector("#left-unit-name");
    const rightUnitName = container.querySelector("#right-unit-name");
    const formulaForward = container.querySelector("#formula-forward");
    const formulaReverse = container.querySelector("#formula-reverse");
    const defaultExample = container.querySelector("#default-example");
    const defaultNote = container.querySelector("#default-note");
    const categoryNote = container.querySelector("#category-note");

    let activeCategory = CATEGORIES.find((c) => c.id === localStorage.getItem(STORAGE_KEY)) || CATEGORIES[0];

    function fmt(value, precision) {
      return new Intl.NumberFormat(app.getLang(), { maximumFractionDigits: precision, minimumFractionDigits: 0 }).format(value);
    }

    function parseNumber(value) {
      if (value === "" || value === null) return null;
      const n = Number.parseFloat(value);
      return Number.isFinite(n) ? n : null;
    }

    function updateReference() {
      const lang = app.getLang();
      leftUnitName.textContent = activeCategory.usUnit;
      rightUnitName.textContent = activeCategory.siUnit;
      formulaForward.textContent = activeCategory.formula[0];
      formulaReverse.textContent = activeCategory.formula[1];
      defaultExample.textContent = `${fmt(activeCategory.defaultUs, activeCategory.precision)} ${activeCategory.usUnit} -> ${fmt(activeCategory.usToSi(activeCategory.defaultUs), activeCategory.precision)} ${activeCategory.siUnit}`;
      defaultNote.textContent = `${fmt(activeCategory.defaultSi, activeCategory.precision)} ${activeCategory.siUnit} -> ${fmt(activeCategory.siToUs(activeCategory.defaultSi), activeCategory.precision)} ${activeCategory.usUnit}`;
      categoryNote.textContent = activeCategory.note[lang] || activeCategory.note.zh;
    }

    function setDefaults() {
      leftInput.value = String(activeCategory.defaultUs);
      rightInput.value = String(activeCategory.defaultSi);
    }

    function renderTabs() {
      const lang = app.getLang();
      tabsEl.innerHTML = "";
      CATEGORIES.forEach((category) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "unit-tab";
        if (category.id === activeCategory.id) button.classList.add("active");
        button.textContent = category.tab[lang] || category.tab.zh;
        button.addEventListener("click", () => {
          activeCategory = category;
          localStorage.setItem(STORAGE_KEY, category.id);
          renderTabs();
          setDefaults();
          updateReference();
        });
        tabsEl.appendChild(button);
      });
    }

    function onLeftInput() {
      const val = parseNumber(leftInput.value);
      if (val === null) {
        rightInput.value = "";
        return;
      }
      rightInput.value = String(Number(activeCategory.usToSi(val).toFixed(activeCategory.precision + 2)));
    }

    function onRightInput() {
      const val = parseNumber(rightInput.value);
      if (val === null) {
        leftInput.value = "";
        return;
      }
      leftInput.value = String(Number(activeCategory.siToUs(val).toFixed(activeCategory.precision + 2)));
    }

    function onLangChange() {
      renderTabs();
      updateReference();
    }

    leftInput.addEventListener("input", onLeftInput);
    rightInput.addEventListener("input", onRightInput);
    document.addEventListener("app:language-changed", onLangChange);

    renderTabs();
    setDefaults();
    updateReference();
    onLeftInput();

    return function cleanupUnitBridge() {
      leftInput.removeEventListener("input", onLeftInput);
      rightInput.removeEventListener("input", onRightInput);
      document.removeEventListener("app:language-changed", onLangChange);
    };
  };
})();
