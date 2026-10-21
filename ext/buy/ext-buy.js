// Checkout page for the LiveSubtitles for Web browser extension (separate product, "web-ext").
// Paddle setup (script URL / token / environment switch / eventCallback shape) is copied from
// /buy/index.html so both checkout pages behave identically in production.
(function () {
  "use strict";

  // All UI copy lives here so the page can be localized later without touching the logic below.
  var STRINGS = {
    pageTitle: "Unlock LiveSubtitles for Web",
    missingInstallTitle: "Open this page from the LiveSubtitles extension",
    missingInstallBody: "This checkout link is missing its install id, so there is nothing to " +
      "attach the purchase to. Please go back to the extension and open “Upgrade” again from there.",
    configErrorTitle: "Could not load plans",
    configErrorBody: "Something went wrong while loading prices. Please check your connection and try again.",
    paymentsUnavailable: "Payments are not available yet. Please try again later.",
    retry: "Retry",
    loadingTitle: "Loading plans…",
    loadingBody: "One moment.",
    continueToCheckout: "Continue to checkout",
    cancelAnytime: "Cancel anytime.",
    planUnavailable: "This plan is not available right now.",
    successTitle: "Payment complete — LiveSubtitles is now unlocked in your browser.",
    successTitleConfirmed: "LiveSubtitles {0} is active in this browser ✓",
    yourKey: "Your license key:",
    copy: "Copy",
    copied: "Copied",
    restoreHint: "If the extension doesn't update within a minute, open its Settings → Plan → " +
      "Restore purchase and paste this key.",
    closeTab: "You can close this tab.",
    perMonth: "/month",
    perYear: "/year",
    approxPerMonth: "≈ {0}/mo billed yearly",
    oneTimeSingle: "One-time purchase · 5 hours of Live · never expire",
    oneTimeMulti: "Total for {0} packs ({1} hours of Live) · never expire",
    hoursPacksLabel: "Hours packs"
  };

  var TIER_LABEL = { pro: "Pro", live: "Live" };

  function applyStrings() {
    $("missing-install-title").textContent = STRINGS.missingInstallTitle;
    $("missing-install-body").textContent = STRINGS.missingInstallBody;
    $("error-title").textContent = STRINGS.configErrorTitle;
    $("error-text").textContent = STRINGS.configErrorBody;
    $("retry-btn").textContent = STRINGS.retry;
    $("loading-title").textContent = STRINGS.loadingTitle;
    $("loading-body").textContent = STRINGS.loadingBody;
    $("checkout-btn").textContent = STRINGS.continueToCheckout;
    $("cancel-note").textContent = STRINGS.cancelAnytime;
    $("unavailable-note").textContent = STRINGS.planUnavailable;
    $("qty-label").textContent = STRINGS.hoursPacksLabel;
    $("success-title").textContent = STRINGS.successTitle;
    $("your-key-label").textContent = STRINGS.yourKey;
    $("copy-key-btn").textContent = STRINGS.copy;
    $("restore-hint").textContent = STRINGS.restoreHint;
    $("close-tab").textContent = STRINGS.closeTab;
  }

  var FAMILY_LABELS = { pro: "Pro", live: "Live", pack: "Live hours pack" };
  var FAMILY_NAME = { pro: "Pro", live: "Live", pack: "5-Hour Live Pack" };
  var FAMILY_FEATURES = {
    pro: [
      "Unlimited AI explanations",
      "Unlimited saved words + Anki / CSV export",
      "Saved words highlighted in every video"
    ],
    live: [
      "Everything in Pro",
      "Live translation of tab audio — streams, browser calls, and videos without subtitles",
      "20 hours / month"
    ],
    pack: [
      "5 hours of Live",
      "Never expire"
    ]
  };

  var PLAN_META = {
    "pro-month": { family: "pro", cycle: "month" },
    "pro-year": { family: "pro", cycle: "year" },
    "live-month": { family: "live", cycle: "month" },
    "live-year": { family: "live", cycle: "year" },
    "live-pack": { family: "pack", cycle: null }
  };
  var FAMILY_ORDER = ["pro", "live", "pack"];

  var CONFIG_URL = "https://ext-api.live-subtitles.com/v1/config";

  // Client-side tokens: Paddle > Developer Tools > Authentication. Same values as /buy/index.html.
  var PADDLE_TOKEN_LIVE = "live_f8552070ee7e11c7bcb7a2b2e52";
  var PADDLE_TOKEN_SANDBOX = "REPLACE_WITH_SANDBOX_CLIENT_TOKEN";

  var params = new URLSearchParams(window.location.search);
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var installId = (params.get("install") || "").trim();
  var hasValidInstall = UUID_RE.test(installId);
  var sandbox = params.get("sandbox") === "1";
  var langParam = (params.get("lang") || "").trim();
  // ?discount=CODE pre-fills a Paddle discount code (tests, support, campaigns).
  var discountParam = (params.get("discount") || "").trim();
  if (!/^[A-Za-z0-9_-]{3,40}$/.test(discountParam)) discountParam = "";
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(langParam)) langParam = "";

  var requestedPlan = params.get("plan") || "";
  var qty = parseInt(params.get("qty"), 10);
  if (!isFinite(qty) || qty < 1) qty = 1;
  if (qty > 10) qty = 10;

  var cfgPlans = null; // key -> config plan entry
  var state = { family: "pro", cycle: "year", qty: qty };
  var paddleReady = false;

  function $(id) { return document.getElementById(id); }

  function showState(id) {
    ["state-missing-install", "state-error", "state-loading", "state-ready", "state-success"]
      .forEach(function (s) { $(s).classList.toggle("hidden", s !== id); });
  }

  function planKeyFor(family, cycle) {
    return family === "pack" ? "live-pack" : family + "-" + cycle;
  }

  function availablePlan(key) {
    var entry = cfgPlans && cfgPlans[key];
    return entry && entry.priceId ? entry : null;
  }

  function familyHasAnyPlan(family) {
    if (family === "pack") return !!availablePlan("live-pack");
    return !!availablePlan(family + "-month") || !!availablePlan(family + "-year");
  }

  function loadConfig() {
    showState("state-loading");
    fetch(CONFIG_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("http_" + res.status);
        return res.json();
      })
      .then(function (cfg) {
        cfgPlans = {};
        (cfg.plans || []).forEach(function (p) { cfgPlans[p.key] = p; });
        initSelection();
        renderReady();
      })
      .catch(function (err) {
        $("error-text").textContent = STRINGS.configErrorBody;
        showState("state-error");
      });
  }

  function initSelection() {
    var meta = PLAN_META[requestedPlan];
    if (meta && familyHasAnyPlan(meta.family) &&
        (meta.family === "pack" || availablePlan(meta.family + "-" + meta.cycle) || availablePlan(meta.family + "-" + (meta.cycle === "year" ? "month" : "year")))) {
      state.family = meta.family;
      state.cycle = meta.cycle || "year";
      if (meta.family !== "pack" && !availablePlan(meta.family + "-" + state.cycle)) {
        state.cycle = state.cycle === "year" ? "month" : "year";
      }
    } else {
      var fallback = FAMILY_ORDER.filter(familyHasAnyPlan)[0] || "pro";
      state.family = fallback;
      state.cycle = availablePlan(fallback + "-year") ? "year" : "month";
    }
  }

  function renderReady() {
    renderTabs();
    updatePlanView();
    showState("state-ready");
  }

  function renderTabs() {
    var wrap = $("family-tabs");
    wrap.innerHTML = "";
    FAMILY_ORDER.filter(familyHasAnyPlan).forEach(function (family) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (family === state.family ? " sel" : "");
      btn.textContent = FAMILY_LABELS[family];
      btn.addEventListener("click", function () {
        state.family = family;
        state.cycle = availablePlan(family + "-year") ? "year" : "month";
        renderTabs();
        updatePlanView();
      });
      wrap.appendChild(btn);
    });
  }

  // Intl knows each currency's decimals (JPY/KRW have none).
  function formatMoney(amount, currency) {
    var n = parseFloat(amount);
    if (!isFinite(n)) return amount + " " + currency;
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(n); }
    catch (e) { return n.toFixed(2) + " " + currency; }
  }

  function updatePlanView() {
    var isSub = state.family !== "pack";
    $("cycle-toggle").classList.toggle("hidden", !isSub);
    $("qty-row").classList.toggle("hidden", isSub);

    if (isSub) {
      Array.prototype.forEach.call($("cycle-toggle").querySelectorAll(".cycle-btn"), function (b) {
        var c = b.getAttribute("data-cycle");
        b.classList.toggle("sel", c === state.cycle);
        b.disabled = !availablePlan(state.family + "-" + c);
      });
    }

    var key = planKeyFor(state.family, state.cycle);
    var entry = availablePlan(key);

    $("plan-name").textContent = FAMILY_NAME[state.family] + (isSub ? (state.cycle === "year" ? " — Yearly" : " — Monthly") : "");
    $("plan-features").innerHTML = "";
    FAMILY_FEATURES[state.family].forEach(function (f) {
      var li = document.createElement("li");
      li.textContent = f;
      $("plan-features").appendChild(li);
    });

    $("cancel-note").classList.toggle("hidden", !isSub || !entry);
    $("unavailable-note").classList.toggle("hidden", !!entry);
    $("checkout-btn").disabled = !entry;

    if (!entry) {
      $("plan-price").textContent = "—";
      $("plan-price-sub").textContent = "";
      return;
    }

    if (state.family === "pack") {
      var unit = parseFloat(entry.price.amount) || 0;
      var total = unit * state.qty;
      $("plan-price").textContent = entry.price.currency ? formatMoney(total, entry.price.currency) : entry.price.formatted;
      $("plan-price-sub").textContent = state.qty > 1
        ? STRINGS.oneTimeMulti.replace("{0}", state.qty).replace("{1}", state.qty * 5)
        : STRINGS.oneTimeSingle;
    } else {
      $("plan-price").textContent = entry.price.formatted + (state.cycle === "year" ? STRINGS.perYear : STRINGS.perMonth);
      $("plan-price-sub").textContent = (state.cycle === "year" && entry.price.perMonthFormatted)
        ? STRINGS.approxPerMonth.replace("{0}", entry.price.perMonthFormatted)
        : "";
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".cycle-btn"), function (b) {
    b.addEventListener("click", function () {
      var c = b.getAttribute("data-cycle");
      if (availablePlan(state.family + "-" + c)) {
        state.cycle = c;
        updatePlanView();
      }
    });
  });

  $("qty-input").value = state.qty;
  function setQty(q) {
    q = Math.max(1, Math.min(10, q));
    state.qty = q;
    $("qty-input").value = q;
    updatePlanView();
  }
  $("qty-minus").addEventListener("click", function () { setQty(state.qty - 1); });
  $("qty-plus").addEventListener("click", function () { setQty(state.qty + 1); });
  $("qty-input").addEventListener("change", function () {
    var v = parseInt($("qty-input").value, 10);
    setQty(isFinite(v) ? v : 1);
  });

  $("retry-btn").addEventListener("click", loadConfig);

  function initPaddle() {
    var token = sandbox ? PADDLE_TOKEN_SANDBOX : PADDLE_TOKEN_LIVE;
    if (!token || token.indexOf("REPLACE_WITH") === 0) return false;
    if (sandbox) Paddle.Environment.set("sandbox");
    Paddle.Initialize({
      token: token,
      eventCallback: function (event) {
        if (!event || !event.name) return;
        if (event.name === "checkout.completed") {
          onCheckoutCompleted(event.data || {});
        }
      }
    });
    return true;
  }

  function onCheckoutCompleted(data) {
    var txn = data.transaction_id || "";
    showSuccess(txn);
    sendLicenseMessage(txn);
    reportConversion(data);
    listenForLicenseAck();
  }

  function sendLicenseMessage(key) {
    var payload = { __lswLicense: 1, key: key };
    var fire = function () { window.postMessage(payload, "*"); };
    fire();
    setTimeout(fire, 1000);
    setTimeout(fire, 3000);
  }

  // The extension's content script relays __lswLicense to its service worker, resolves it via
  // /v1/license and (if reachable in this browser) posts back __lswLicenseAck. No ack within the
  // window just means this browser profile doesn't have the extension installed — keep the
  // generic success copy, don't treat it as an error.
  function listenForLicenseAck() {
    var settled = false;
    function handler(event) {
      if (settled || event.source !== window) return;
      var d = event.data;
      if (!d || d.__lswLicenseAck !== 1) return;
      settled = true;
      window.removeEventListener("message", handler);
      if (d.ok && (d.tier === "pro" || d.tier === "live")) {
        $("success-title").textContent = STRINGS.successTitleConfirmed.replace("{0}", TIER_LABEL[d.tier] || d.tier);
        $("restore-hint").classList.add("hidden");
      }
    }
    window.addEventListener("message", handler);
    setTimeout(function () {
      if (!settled) {
        settled = true;
        window.removeEventListener("message", handler);
      }
    }, 8000);
  }

  // Нет вебхука на бэкенде для web-ext (см. PRO_CONTRACT.md): единственная точка, откуда можно
  // отправить конверсию в аналитику — эта страница сразу после checkout.completed.
  function reportConversion(data) {
    try {
      var totals = data.totals || {};
      var amount = parseFloat(totals.total);
      var currency = data.currency_code || totals.currency_code || "";
      if (typeof gtag === "function") {
        var payload = { transaction_id: data.transaction_id || "", method: "paddle" };
        if (isFinite(amount) && amount > 0 && currency) {
          payload.value = amount;
          payload.currency = currency;
        }
        gtag("event", "purchase_web_ext", payload);
      }
      if (typeof fbq === "function" && isFinite(amount) && amount > 0 && currency) {
        fbq("track", "Purchase", { value: amount, currency: currency });
      }
    } catch (e) { /* аналитика не должна мешать показу успеха */ }
  }

  function showSuccess(txn) {
    $("license-key").textContent = txn || "—";
    showState("state-success");
  }

  $("copy-key-btn").addEventListener("click", function () {
    var key = $("license-key").textContent;
    var done = function () {
      $("copy-key-btn").textContent = STRINGS.copied;
      setTimeout(function () { $("copy-key-btn").textContent = STRINGS.copy; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(key).then(done, done);
    } else {
      done();
    }
  });

  $("checkout-btn").addEventListener("click", function () {
    var key = planKeyFor(state.family, state.cycle);
    var entry = availablePlan(key);
    if (!entry || !paddleReady) return;
    var options = {
      items: [{ priceId: entry.priceId, quantity: state.family === "pack" ? state.qty : 1 }],
      customData: { product: "web-ext", install: installId },
      settings: { displayMode: "overlay", theme: "dark" }
    };
    if (langParam) options.settings.locale = langParam;
    if (discountParam) options.discountCode = discountParam;
    Paddle.Checkout.open(options);
  });

  // Entry point.
  applyStrings();

  if (!hasValidInstall) {
    showState("state-missing-install");
    return;
  }

  paddleReady = initPaddle();
  if (!paddleReady) {
    $("error-text").textContent = STRINGS.paymentsUnavailable;
    showState("state-error");
    return;
  }

  loadConfig();
})();
