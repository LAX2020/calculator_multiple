window.PageRenderers = window.PageRenderers || {};

(function () {
  const LIVE_URL = "https://open.er-api.com/v6/latest/USD";
  const MODE_KEY = "fx_mode";
  const CACHE_KEY = "fx_live_cache";
  const LOCAL_FALLBACK = {
    base: "USD",
    updatedAt: "2026-03-04T00:00:00Z",
    rates: {
      USD: 1,
      CNY: 6.915072,
      JPY: 157.706313,
    },
  };

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.rates || !parsed.rates.USD) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeCache(payload) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  }

  function getRate(rates, from, to) {
    const fromUsd = rates[from];
    const toUsd = rates[to];
    if (!fromUsd || !toUsd) return null;
    return toUsd / fromUsd;
  }

  function toNumber(v) {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }

  window.PageRenderers.fx = function renderFx(container, app) {
    container.className = "page page-fx";
    container.innerHTML = `
      <section class="hero glass compact">
        <p class="eyebrow" data-i18n="calculatorLabel">计算器</p>
        <h1 data-i18n="fxTitle">汇率转换</h1>
        <p class="hero-copy" data-i18n="fxSubtitle">默认实时汇率，获取失败自动降级本地汇率，也可手动切换。</p>
      </section>

      <section class="card glass fx-panel">
        <div class="fx-header">
          <div class="fx-mode-group">
            <span data-i18n="fxModeLabel">汇率模式</span>
            <div class="mode-tabs">
              <button type="button" class="mode-tab" id="mode-live" data-i18n="fxModeLive">实时汇率</button>
              <button type="button" class="mode-tab" id="mode-local" data-i18n="fxModeLocal">本地汇率</button>
            </div>
          </div>
          <button type="button" class="btn-secondary" id="fx-refresh" data-i18n="fxRefresh">刷新实时汇率</button>
        </div>

        <div class="fx-grid">
          <label class="form-row">
            <span data-i18n="fxAmount">金额</span>
            <input id="fx-amount" type="number" step="any" value="100" inputmode="decimal">
          </label>

          <label class="form-row">
            <span data-i18n="fxFrom">源货币</span>
            <select id="fx-from">
              <option value="CNY">CNY</option>
              <option value="USD" selected>USD</option>
              <option value="JPY">JPY</option>
            </select>
          </label>

          <label class="form-row">
            <span data-i18n="fxTo">目标货币</span>
            <select id="fx-to">
              <option value="CNY" selected>CNY</option>
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </select>
          </label>
        </div>

        <div class="fx-result glass-soft">
          <p class="result-tag" data-i18n="fxResult">转换结果</p>
          <p class="result-number" id="fx-output">--</p>
          <p class="info-copy" id="fx-meta">--</p>
        </div>
      </section>

      <section class="unit-reference">
        <article class="card glass info-card">
          <h2 data-i18n="fxFormulaTitle">换算公式</h2>
          <p class="formula-line" data-i18n="fxFormulaLine1">结果 = 金额 × 汇率(from->to)</p>
          <p class="formula-line" data-i18n="fxFormulaLine2">交叉汇率：A->B = (USD->B)/(USD->A)</p>
        </article>

        <article class="card glass info-card">
          <h2 data-i18n="fxRateInfo">汇率信息</h2>
          <p class="example-line" id="fx-rate-line">--</p>
          <p class="info-copy" id="fx-updated-line">--</p>
        </article>

        <article class="card glass info-card">
          <h2 data-i18n="noteRefTitle">注意事项</h2>
          <p class="info-copy" data-i18n="fxDisclaimer">仅供参考，不作为交易报价。</p>
          <a class="btn-secondary" href="#/home" data-i18n="backHome">返回主页</a>
        </article>
      </section>
    `;

    const amountInput = container.querySelector("#fx-amount");
    const fromSelect = container.querySelector("#fx-from");
    const toSelect = container.querySelector("#fx-to");
    const outputEl = container.querySelector("#fx-output");
    const metaEl = container.querySelector("#fx-meta");
    const rateLineEl = container.querySelector("#fx-rate-line");
    const updatedLineEl = container.querySelector("#fx-updated-line");
    const modeLiveBtn = container.querySelector("#mode-live");
    const modeLocalBtn = container.querySelector("#mode-local");
    const refreshBtn = container.querySelector("#fx-refresh");

    let sourceType = "local";
    let currentData = readCache() || LOCAL_FALLBACK;
    let mode = localStorage.getItem(MODE_KEY) || "live";

    function fmt(n, max) {
      return new Intl.NumberFormat(app.getLang(), { maximumFractionDigits: max, minimumFractionDigits: 0 }).format(n);
    }

    function setModeButtons() {
      modeLiveBtn.classList.toggle("active", mode === "live");
      modeLocalBtn.classList.toggle("active", mode === "local");
    }

    function sourceLabel() {
      const lang = app.getLang();
      if (sourceType === "live") return lang === "en" ? "Source: Live" : (lang === "ja" ? "ソース: リアルタイム" : "来源：实时汇率");
      if (sourceType === "cache") return lang === "en" ? "Source: Cache" : (lang === "ja" ? "ソース: キャッシュ" : "来源：缓存汇率");
      return lang === "en" ? "Source: Local default" : (lang === "ja" ? "ソース: ローカル既定" : "来源：本地默认汇率");
    }

    function renderConversion() {
      const amount = toNumber(amountInput.value);
      const from = fromSelect.value;
      const to = toSelect.value;
      const rate = getRate(currentData.rates, from, to);

      if (amount === null || rate === null) {
        outputEl.textContent = "--";
        metaEl.textContent = sourceLabel();
        rateLineEl.textContent = "--";
        return;
      }

      const result = amount * rate;
      outputEl.textContent = `${fmt(result, 4)} ${to}`;
      metaEl.textContent = `${sourceLabel()} | 1 ${from} = ${fmt(rate, 6)} ${to}`;
      rateLineEl.textContent = `1 ${from} = ${fmt(rate, 6)} ${to}`;

      if (currentData.updatedAt) {
        const dateText = new Intl.DateTimeFormat(app.getLang(), {
          year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"
        }).format(new Date(currentData.updatedAt));
        updatedLineEl.textContent = `${app.getLang() === "en" ? "Updated" : (app.getLang() === "ja" ? "更新" : "更新时间")}：${dateText}`;
      } else {
        updatedLineEl.textContent = "--";
      }
    }

    async function fetchLiveRates() {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 3500);
      try {
        const res = await fetch(LIVE_URL, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error("network");
        const data = await res.json();
        if (!data || data.result !== "success" || !data.rates) throw new Error("invalid");

        const payload = {
          base: "USD",
          updatedAt: data.time_last_update_utc ? new Date(data.time_last_update_utc).toISOString() : new Date().toISOString(),
          rates: {
            USD: 1,
            CNY: data.rates.CNY,
            JPY: data.rates.JPY,
          },
        };

        if (!payload.rates.CNY || !payload.rates.JPY) throw new Error("missing");
        writeCache(payload);
        currentData = payload;
        sourceType = "live";
        renderConversion();
        return true;
      } catch (e) {
        return false;
      } finally {
        window.clearTimeout(timer);
      }
    }

    async function applyMode(nextMode, userSwitch) {
      mode = nextMode;
      localStorage.setItem(MODE_KEY, mode);
      setModeButtons();

      if (mode === "local") {
        currentData = LOCAL_FALLBACK;
        sourceType = "local";
        renderConversion();
        return;
      }

      const ok = await fetchLiveRates();
      if (!ok) {
        const cached = readCache();
        if (cached) {
          currentData = cached;
          sourceType = "cache";
        } else {
          currentData = LOCAL_FALLBACK;
          sourceType = "local";
        }
        renderConversion();
        if (userSwitch) {
          metaEl.textContent = `${sourceLabel()} | ${app.getLang() === "en" ? "Live request failed" : (app.getLang() === "ja" ? "リアルタイム取得失敗" : "实时汇率获取失败")}`;
        }
      }
    }

    const onInput = () => renderConversion();
    const onLang = () => renderConversion();
    const onLive = () => applyMode("live", true);
    const onLocal = () => applyMode("local", true);
    const onRefresh = () => applyMode("live", true);

    amountInput.addEventListener("input", onInput);
    fromSelect.addEventListener("change", onInput);
    toSelect.addEventListener("change", onInput);
    modeLiveBtn.addEventListener("click", onLive);
    modeLocalBtn.addEventListener("click", onLocal);
    refreshBtn.addEventListener("click", onRefresh);
    document.addEventListener("app:language-changed", onLang);

    setModeButtons();
    renderConversion();
    applyMode(mode, false);

    return function cleanupFx() {
      amountInput.removeEventListener("input", onInput);
      fromSelect.removeEventListener("change", onInput);
      toSelect.removeEventListener("change", onInput);
      modeLiveBtn.removeEventListener("click", onLive);
      modeLocalBtn.removeEventListener("click", onLocal);
      refreshBtn.removeEventListener("click", onRefresh);
      document.removeEventListener("app:language-changed", onLang);
    };
  };
})();
