window.PageRenderers = window.PageRenderers || {};

(function () {
  const BMI_LABELS = {
    zh: {
      invalid: "请输入有效的身高和体重",
      under: "过轻（BMI < 18.5）",
      normal: "正常（BMI < 24）",
      over: "超重（BMI < 28）",
      obese: "肥胖（BMI >= 28）",
    },
    en: {
      invalid: "Please enter valid height and weight.",
      under: "Underweight (BMI < 18.5)",
      normal: "Normal (BMI < 24)",
      over: "Overweight (BMI < 28)",
      obese: "Obese (BMI >= 28)",
    },
    ja: {
      invalid: "有効な身長と体重を入力してください。",
      under: "低体重（BMI < 18.5）",
      normal: "標準（BMI < 24）",
      over: "過体重（BMI < 28）",
      obese: "肥満（BMI >= 28）",
    },
  };

  window.PageRenderers.bmi = function renderBmi(container, app) {
    container.className = "page page-bmi";
    container.innerHTML = `
      <section class="hero glass compact">
        <p class="eyebrow" data-i18n="calculatorLabel">计算器</p>
        <h1 data-i18n="bmiTitle">身高体重比例 BMI 计算器</h1>
      </section>

      <section class="bmi-grid">
        <article class="card glass">
          <h2 data-i18n="inputTitle">输入信息</h2>
          <form id="bmi-form" class="form">
            <label for="height-input" data-i18n="heightLabel">身高（cm）</label>
            <input id="height-input" type="number" min="50" max="260" step="0.1" placeholder="170" value="175">

            <label for="weight-input" data-i18n="weightLabel">体重（kg）</label>
            <input id="weight-input" type="number" min="10" max="300" step="0.1" placeholder="65" value="75">

            <button class="btn-primary" type="submit" data-i18n="calcButton">计算 BMI</button>
          </form>
        </article>

        <article class="card glass result-card">
          <h2 data-i18n="resultTitle">计算结果</h2>
          <p class="result-number"><span id="bmi-value">--</span></p>
          <p class="result-tag" id="bmi-tag" data-i18n="resultPending">请先输入数据并计算</p>
          <p class="result-note" data-i18n="resultNote">说明：BMI 仅用于健康参考，不替代医疗诊断。</p>
          <a class="btn-secondary" href="#/home" data-i18n="backHome">返回主页</a>
        </article>
      </section>

      <section class="bmi-reference">
        <article class="card glass info-card">
          <h2 data-i18n="formulaTitle">BMI 计算公式</h2>
          <p class="formula-line">BMI = <span data-i18n="formulaWeight">体重(kg)</span> / [<span data-i18n="formulaHeight">身高(m)</span>]²</p>
          <p class="info-copy" data-i18n="formulaHint">提示：先把身高从 cm 换算为 m 再计算。</p>
          <p class="example-line"><span data-i18n="examplePrefix">示例：</span>175 cm + 75 kg -> BMI = 24.49</p>
        </article>

        <article class="card glass info-card">
          <h2 data-i18n="rangeTitle">BMI 参考区间</h2>
          <ul class="range-list">
            <li><span class="status-under" data-i18n="rangeUnder">过轻</span>: BMI < 18.5</li>
            <li><span class="status-normal" data-i18n="rangeNormal">正常</span>: 18.5 <= BMI < 24</li>
            <li><span class="status-over" data-i18n="rangeOver">超重</span>: 24 <= BMI < 28</li>
            <li><span class="status-obese" data-i18n="rangeObese">肥胖</span>: BMI >= 28</li>
          </ul>
        </article>

        <article class="card glass info-card">
          <h2 data-i18n="reminderTitle">适用提醒</h2>
          <p class="info-copy" data-i18n="reminderBody">BMI 用于一般健康参考，不适用于所有人群，也不能替代医生诊断。</p>
        </article>
      </section>
    `;

    const form = container.querySelector("#bmi-form");
    const heightInput = container.querySelector("#height-input");
    const weightInput = container.querySelector("#weight-input");
    const bmiValue = container.querySelector("#bmi-value");
    const bmiTag = container.querySelector("#bmi-tag");

    function setStatusClass(name) {
      bmiTag.classList.remove("status-under", "status-normal", "status-over", "status-obese");
      bmiTag.classList.add(name);
    }

    function pickLabel(score, lang) {
      const t = BMI_LABELS[lang] || BMI_LABELS.zh;
      if (score < 18.5) return { text: t.under, cls: "status-under" };
      if (score < 24) return { text: t.normal, cls: "status-normal" };
      if (score < 28) return { text: t.over, cls: "status-over" };
      return { text: t.obese, cls: "status-obese" };
    }

    function calculate() {
      const lang = app.getLang();
      const t = BMI_LABELS[lang] || BMI_LABELS.zh;
      const height = Number.parseFloat(heightInput.value);
      const weight = Number.parseFloat(weightInput.value);

      if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
        bmiValue.textContent = "--";
        bmiTag.textContent = t.invalid;
        bmiTag.classList.remove("status-under", "status-normal", "status-over", "status-obese");
        return;
      }

      const bmi = weight / ((height / 100) * (height / 100));
      const result = pickLabel(bmi, lang);
      bmiValue.textContent = new Intl.NumberFormat(lang, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(bmi);
      bmiTag.textContent = result.text;
      setStatusClass(result.cls);
    }

    function onSubmit(e) {
      e.preventDefault();
      calculate();
    }

    function onLang() {
      if (bmiValue.textContent.trim() !== "--") calculate();
    }

    form.addEventListener("submit", onSubmit);
    document.addEventListener("app:language-changed", onLang);

    return function cleanupBmi() {
      form.removeEventListener("submit", onSubmit);
      document.removeEventListener("app:language-changed", onLang);
    };
  };
})();
