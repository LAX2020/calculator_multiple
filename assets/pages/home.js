window.PageRenderers = window.PageRenderers || {};

window.PageRenderers.home = function renderHome(container) {
  container.className = "page page-home";
  container.innerHTML = `
    <section class="hero glass">
      <p class="eyebrow" data-i18n="heroEyebrow">工具入口</p>
      <h1 data-i18n="homeTitle">你的多功能计算器主页</h1>
      <p class="hero-copy" data-i18n="homeSubtitle">先从身高体重比例开始，后续可以继续扩展更多计算器。</p>
    </section>

    <section class="cards">
      <article class="card glass">
        <h2 data-i18n="bmiCardTitle">身高体重比例（BMI）</h2>
        <p data-i18n="bmiCardDesc">输入身高和体重，快速计算 BMI，并查看对应区间。</p>
        <a class="btn-primary" href="#/bmi" data-i18n="goBmi">进入 BMI 计算器</a>
      </article>

      <article class="card glass">
        <h2 data-i18n="unitCardTitle">UnitBridge 美标-国标换算中心</h2>
        <p data-i18n="unitCardDesc">支持美标与国际单位互转，包括质量、温度、长度、体积、速度、压力和油耗。</p>
        <a class="btn-primary" href="#/unitbridge" data-i18n="goUnitBridge">进入 UnitBridge</a>
      </article>

      <article class="card glass">
        <h2 data-i18n="fxCardTitle">汇率转换</h2>
        <p data-i18n="fxCardDesc">支持 CNY / USD / JPY 的实时与本地汇率切换计算，联网失败自动降级。</p>
        <a class="btn-primary" href="#/fx" data-i18n="goFx">进入汇率转换</a>
      </article>
    </section>
  `;

  return function cleanupHome() {};
};
