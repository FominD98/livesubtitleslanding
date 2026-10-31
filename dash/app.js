"use strict";

const API = "https://dash-api.live-subtitles.com";
const ALL_PLATFORMS = [
    { id: "paddle", name: "Paddle (web)", slot: 1 },
    { id: "appstore", name: "App Store", slot: 2 },
    { id: "play", name: "Google Play", slot: 3 },
    { id: "msstore", name: "Microsoft Store", slot: 4 },
];
// Live Captions продаётся только через Paddle и Microsoft Store, а в GA4 — одно приложение
const PRODUCTS = {
    livesubs: {
        name: "Live Subtitles", platforms: ["paddle", "appstore", "play", "msstore"], apps: ["windows", "android", "apple", "mac"],
        ids: { msstore: "9PH1R9DJG47S", appstore: "6760197210", play: "com.livesubtitles.android" },
        funnel: { start: "onboarding", recording: 3, purchase: 7 },
        serp: [["site", "Site"], ["msstore", "Microsoft Store"], ["play", "Google Play"], ["appstore", "App Store"]],
    },
    captions: {
        name: "Live Captions", platforms: ["paddle", "msstore"], apps: ["captions"],
        ids: { msstore: "9NJHDV2W6999" },
        funnel: { start: "first launch", recording: 2, purchase: 6 },
        serp: [["msstore", "Microsoft Store"]],
    },
};
let PLATFORMS = ALL_PLATFORMS;
let STORES = PLATFORMS.filter((p) => p.id !== "paddle");
const product = () => PRODUCTS[state.product];
const CHANNELS = [
    { id: "new", name: "New purchase", color: "--series-5" },
    { id: "renewal", name: "Renewal", color: "--series-6" },
    { id: "upgrade", name: "Plan change", color: "--series-7" },
    { id: "unknown", name: "Not reported", color: "--neutral" },
];
const byId = Object.fromEntries(ALL_PLATFORMS.map((p) => [p.id, p]));

const root = document.querySelector(".viz-root");
const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
const color = (platform) => css(`--series-${byId[platform].slot}`);
const usd = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });
const int = (v) => Math.round(v).toLocaleString("en-US");
const sum = (rows, f) => rows.reduce((a, r) => a + (f(r) || 0), 0);

const M = () => state.salesMetric;
const state = { product: "livesubs", salesMetric: localStorage.getItem("salesMetric") || "net", ga4: null, weekly: null, campaigns: null, tab: "sales", range: null, salesFilter: { platform: "", country: "" }, sales: null, aso: null, funnel: null, subs: null, health: null, live: null, charts: {}, asoSel: { store: "msstore", country: null } };

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") node.className = v;
        else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
        if (c !== null && c !== undefined) node.append(c instanceof Node ? c : String(c));
    }
    return node;
}

function table(target, head, rows, empty = "No data") {
    const t = document.getElementById(target);
    const body = rows.length ? rows : [el("tr", {}, el("td", { colspan: String(head.length), class: "muted" }, empty))];
    t.replaceChildren(
        el("thead", {}, el("tr", {}, head.map(([label, num]) => el("th", num ? { class: "num" } : {}, label)))),
        el("tbody", {}, body));
}

function td(value, num = false, cls = "") {
    return el("td", { class: `${num ? "num" : ""} ${cls}`.trim() }, value);
}

function swatch(platform) {
    return el("span", { class: `swatch sw-${byId[platform].slot}`, "aria-hidden": "true" });
}

// higherIsBetter=false для метрик-проблем (ошибки, отказы): рост красный
function deltaPct(cur, prev, higherIsBetter = true) {
    if (!prev) return el("span", { class: "muted" }, "—");
    const d = (cur - prev) / Math.abs(prev) * 100;
    const good = (d >= 0) === higherIsBetter;
    return el("span", { class: good ? "up" : "down" }, `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(0)}%`);
}

function alpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function gradient(hex, top = 0.45, bottom = 0.03) {
    return (ctx) => {
        const { chart } = ctx;
        if (!chart.chartArea) return alpha(hex, top);
        const g = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
        g.addColorStop(0, alpha(hex, top));
        g.addColorStop(1, alpha(hex, bottom));
        return g;
    };
}

function countUp(node, target, format) {
    const start = performance.now();
    const step = (now) => {
        const t = Math.min(1, (now - start) / 700);
        node.textContent = format(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function draw(id, config) {
    state.charts[id]?.destroy();
    state.charts[id] = new Chart(document.getElementById(id), config);
}

const legend = { position: "top", align: "start", labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "rectRounded" } };
const timeX = { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 16 } };

// Без входа Access отвечает редиректом на чужой домен — fetch падает целиком (нет ответа): это вход.
// Ответ с кодом ошибки — сбой сервера: показываем ошибку, а не логин. quiet — для необязательных блоков.
async function api(path, { quiet = false } = {}) {
    let res;
    try {
        res = await fetch(`${API}${path}`, { credentials: "include" });
    } catch {
        res = null;
    }
    if (!res) {
        if (!quiet) showLogin();
        return null;
    }
    if (!res.ok) {
        if (!quiet) showError(`Couldn't load data (${res.status}). Try again in a minute.`);
        return null;
    }
    sessionStorage.removeItem("loginTried");
    document.getElementById("load-error")?.setAttribute("hidden", "");
    return res.json();
}

function showError(text) {
    const panel = document.getElementById(`tab-${state.tab}`);
    panel.classList.remove("loading");
    let box = document.getElementById("load-error");
    if (!box) {
        box = el("p", { id: "load-error", class: "card down" });
        document.getElementById("app").insertBefore(box, document.getElementById("summary"));
    }
    box.textContent = text;
    box.hidden = false;
    document.getElementById("app").hidden = false;
}

function showLogin() {
    document.getElementById("app").hidden = true;
    if (!sessionStorage.getItem("loginTried")) {
        sessionStorage.setItem("loginTried", "1");
        location.replace(`${API}/login`);
        return;
    }
    document.getElementById("login").hidden = false;
    document.getElementById("login-link").href = `${API}/login`;
}

async function load() {
    const tab = state.tab;
    const panel = document.getElementById(`tab-${tab}`);
    panel.classList.add("loading");
    const query = tab === "ga4" ? ga4Path() : tab === "ab" ? `/api/ab?app=${state.product}` : `/api/${tab}?${rangeQuery()}${tab === "sales" ? salesQuery() : ""}`;
    state.pending = query;
    const data = await api(query);
    if (state.pending !== query) return;
    panel.classList.remove("loading");
    if (!data) return;
    state[tab] = data;
    document.getElementById("login").hidden = true;
    document.getElementById("app").hidden = false;
    document.getElementById("user").textContent = data.user;
    loadSummary();
    if (tab !== state.tab) return;
    RENDER[tab]();
    if (tab === "live") scheduleLive();
}

function isoDay(d) {
    return d.toISOString().slice(0, 10);
}

/* ---------- период, шаг, сравнение (живут в адресе: #tab?preset=…&from=…&to=…&grain=…&compare=…) ---------- */

function dayDiff(a, b) {
    return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

function presetRange(preset) {
    const today = isoDay(new Date());
    const last = (n) => ({ from: shiftDay(today, -(n - 1)), to: today });
    const month = today.slice(0, 8) + "01";
    switch (preset) {
        case "7d": return last(7);
        case "90d": return last(90);
        case "365d": return last(365);
        case "mtd": return { from: month, to: today };
        case "last-month": return { from: shiftDay(month, -1).slice(0, 8) + "01", to: shiftDay(month, -1) };
        case "ytd": return { from: today.slice(0, 4) + "-01-01", to: today };
        default: return last(30);
    }
}

function readRange() {
    const q = new URLSearchParams(location.hash.split("?")[1] || "");
    const saved = JSON.parse(localStorage.getItem("dashRange") || "{}");
    const pick = (k, def) => q.get(k) || saved[k] || def;
    const preset = pick("preset", "30d");
    const r = { preset, grain: pick("grain", "auto"), compare: pick("compare", "prev") };
    Object.assign(r, preset === "custom" ? { from: pick("from", presetRange("30d").from), to: pick("to", presetRange("30d").to) } : presetRange(preset));
    return r;
}

function writeRange() {
    const r = state.range;
    localStorage.setItem("dashRange", JSON.stringify(r));
    const q = new URLSearchParams({ app: state.product, preset: r.preset, grain: r.grain, compare: r.compare });
    if (r.preset === "custom") { q.set("from", r.from); q.set("to", r.to); }
    history.replaceState(null, "", `#${state.tab}?${q}`);
    for (const k of ["preset", "from", "to", "grain", "compare"]) document.getElementById(`range-${k}`).value = r[k];
}

function rangeQuery() {
    const r = state.range;
    return new URLSearchParams({ from: r.from, to: r.to, compare: r.compare, app: state.product }).toString();
}

function readProduct() {
    const q = new URLSearchParams(location.hash.split("?")[1] || "");
    const p = q.get("app") || localStorage.getItem("dashProduct");
    return PRODUCTS[p] ? p : "livesubs";
}

function applyProduct(p) {
    state.product = p;
    localStorage.setItem("dashProduct", p);
    const cfg = product();
    PLATFORMS = ALL_PLATFORMS.filter((x) => cfg.platforms.includes(x.id));
    STORES = PLATFORMS.filter((x) => x.id !== "paddle");
    document.title = `${cfg.name} · Dashboard`;
    document.querySelectorAll("#product-toggle button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.product === p)));
    document.querySelectorAll("#f-platform option").forEach((o) => { o.hidden = !!o.value && !cfg.platforms.includes(o.value); });
    document.getElementById("ga4-app").hidden = p === "captions";
    document.getElementById("retention-card").hidden = !RETENTION_APPS().length;
    document.getElementById("ratings-block").hidden = p === "captions";
    document.getElementById("funnel-title").textContent = `Funnel: ${cfg.funnel.start} to purchase`;
    state.salesFilter.platform = "";
    state.asoSel.store = "msstore";
    state.healthSel.app = cfg.apps[0];
    state.funnelSel.retentionApp = RETENTION_APPS()[0]?.id;
    state.ga4Sel.app = "all";
    document.getElementById("ga4-app").value = "all";
    for (const name of Object.keys(RENDER)) state[name] = null;
    summaryLoaded = false;
}

function salesQuery() {
    const f = state.salesFilter;
    return (f.platform ? `&platforms=${f.platform}` : "") + (f.country ? `&country=${f.country}` : "");
}

function periodLen() {
    return dayDiff(state.range.from, state.range.to) + 1;
}

function grain() {
    const g = state.range.grain;
    if (g !== "auto") return g;
    const n = periodLen();
    return n <= 92 ? "day" : n <= 400 ? "week" : "month";
}

function bucketKey(day) {
    const g = grain();
    if (g === "month") return day.slice(0, 8) + "01";
    if (g === "day") return day;
    const d = new Date(day + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return isoDay(d);
}

function bucketTitle(label) {
    const g = grain();
    if (g === "month") return new Date(label + "T00:00:00Z").toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
    return g === "week" ? `Week of ${label}` : label;
}

function series(rows, keyOf, valueOf) {
    const labels = [...new Set(rows.map((r) => bucketKey(r.day)))].sort();
    const by = {};
    for (const r of rows) {
        const k = `${keyOf(r)}|${bucketKey(r.day)}`;
        by[k] = (by[k] || 0) + valueOf(r);
    }
    return { labels, value: (key, label) => by[`${key}|${label}`] ?? 0 };
}

/* ---------- country flags ---------- */

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const flagCache = {};

function countryName(code) {
    if (!code || code === "??") return "Unknown";
    try {
        return regionNames.of(code.toUpperCase()) || code;
    } catch {
        return code;
    }
}

function flagImg(code) {
    if (!code || code.length !== 2 || code === "??") return null;
    return el("img", { class: "flag", src: `flags/${code.toLowerCase()}.png`, alt: "", width: "20", height: "15", loading: "lazy" });
}

function withFlag(code, text = code) {
    return el("span", { class: "with-flag", title: countryName(code) }, flagImg(code), text);
}

function flagImage(code, chart) {
    const key = code.toLowerCase();
    if (!flagCache[key]) {
        const img = new Image();
        img.onload = () => chart.draw();
        img.src = `flags/${key}.png`;
        flagCache[key] = img;
    }
    return flagCache[key];
}

// Флаги слева от подписей оси Y у горизонтальных графиков стран: подписи — ISO-коды, отступ под флаг даёт ticks.padding
const FLAG_GAP = 28;
Chart.register({
    id: "countryFlags",
    afterDraw(chart, args, opts) {
        if (!opts || !opts.enabled) return;
        const axis = chart.scales.y;
        const { ctx } = chart;
        axis.ticks.forEach((tick, i) => {
            const code = chart.data.labels[tick.value ?? i];
            if (!code || code.length !== 2) return;
            const img = flagImage(code, chart);
            if (!img.complete || !img.naturalWidth) return;
            const y = axis.getPixelForTick(i);
            ctx.drawImage(img, axis.right - FLAG_GAP + 4, y - 7, 18, 13.5);
        });
    },
});

function countryAxis(extra = {}) {
    return { stacked: true, grid: { display: false }, ticks: { padding: FLAG_GAP }, ...extra };
}

const countryTooltipTitle = (items) => countryName(items[0].label);

/* ---------- Sales ---------- */

function shiftDay(day, n) {
    const d = new Date(day + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return isoDay(d);
}

// Окна сравнения по площадке заканчиваются на последнем дне, за который у неё есть данные:
// иначе отставшая выгрузка (MS Store) выглядит как падение продаж
// Сравнение: те же дни периода сравнения (предыдущий такой же длины или год назад), обрезанные по последнему дню,
// за который у площадки есть данные: иначе отставшая выгрузка (MS Store) выглядит как падение продаж
function aligned(platform) {
    const R = state.sales.range;
    const today = isoDay(new Date());
    const src = state.sales.sources.find((s) => s.name === platform);
    const end = src && src.covered_to < R.to ? src.covered_to : R.to;
    const offset = dayDiff(R.cFrom, R.from);
    return {
        end,
        lagging: end < shiftDay(R.to, -2) && end < shiftDay(today, -2),
        cur: state.sales.daily.filter((r) => r.platform === platform && r.day <= end),
        prev: (state.sales.prev || []).filter((r) => r.platform === platform && shiftDay(r.day, offset) <= end),
    };
}

function renderSales() {
    const { daily } = state.sales;
    document.querySelectorAll("#metric-toggle button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.metric === M())));
    const cur = daily;
    const R = state.sales.range;
    const countrySel = document.getElementById("f-country");
    const codes = [...new Set(state.sales.countries.map((c) => c.country))].filter((c) => /^[A-Z]{2}$/.test(c)).sort();
    if (state.salesFilter.country && !codes.includes(state.salesFilter.country)) codes.unshift(state.salesFilter.country);
    countrySel.replaceChildren(el("option", { value: "" }, "All countries"), ...codes.map((c) => el("option", { value: c }, `${countryName(c)} (${c})`)));
    countrySel.value = state.salesFilter.country;
    document.getElementById("f-platform").value = state.salesFilter.platform;
    const windows = Object.fromEntries(PLATFORMS.map((p) => [p.id, aligned(p.id)]));
    const lagging = PLATFORMS.filter((p) => windows[p.id].lagging);
    const note = document.getElementById("lag-note");
    // сборщик идёт раз в сутки с компьютера: если он не запускался дольше полутора суток, цифры устарели
    const lastRun = state.sales.sources.reduce((m, s) => (s.updated_at > m ? s.updated_at : m), "");
    const staleHours = lastRun ? (Date.now() - Date.parse(lastRun)) / 3600000 : 0;
    const parts = lagging.map((p) => `${p.name} data until ${windows[p.id].end}`);
    if (parts.length) parts[parts.length - 1] += " — comparisons use the same days of the other period up to that date.";
    if (R.compare !== "none") parts.push(`Compared with ${R.cFrom} — ${R.cTo}`);
    if (staleHours > 36) parts.unshift(`⚠ The daily collector last ran ${Math.round(staleHours / 24)} days ago — numbers are stale.`);
    note.hidden = !parts.length;
    note.textContent = parts.join(" · ");
    renderTiles(cur, windows);
    renderDaily(cur);
    renderPlatforms(cur, windows);
    renderChannels();
    renderTags();
    renderAcquisition();
    renderCountries();
    renderProducts();
    renderSources("tbl-sources", state.sales.sources);
}

// Среднее в день — по дням, за которые данные уже есть: у года данные начинаются с февраля, а не 365 дней назад
function coveredDays(rows) {
    const first = rows.reduce((m, r) => (m && m < r.day ? m : r.day), null);
    const end = state.range.to < isoDay(new Date()) ? state.range.to : isoDay(new Date());
    if (!first) return periodLen();
    return Math.max(1, Math.min(periodLen(), dayDiff(first, end) + 1));
}

function alignedSum(windows, key, f) {
    return sum(PLATFORMS, (p) => sum(windows[p.id][key], f));
}

function renderTiles(cur, windows) {
    const net = series(cur, () => "all", (r) => r[M()]);
    const units = series(cur, () => "all", (r) => r.units);
    const netTotal = sum(cur, (r) => r[M()]);
    const unitsTotal = sum(cur, (r) => r.units);
    const refunds = sum(cur, (r) => r.refunds);
    const netOnly = sum(cur, (r) => r.net);
    renderTileRow("tiles", [
        { label: M() === "net" ? "Net revenue" : "Gross revenue", value: netTotal, fmt: usd,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r[M()]), alignedSum(windows, "prev", (r) => r[M()])),
          spark: net.labels.map((l) => net.value("all", l)) },
        { label: "Units sold", value: unitsTotal, fmt: int,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r.units), alignedSum(windows, "prev", (r) => r.units)),
          spark: units.labels.map((l) => units.value("all", l)) },
        { label: "Daily average", value: netTotal / coveredDays(cur), fmt: usd,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r[M()]), alignedSum(windows, "prev", (r) => r[M()])) },
        // средний чек и доля возвратов — всегда по нетто: в gross возвраты не входят, вычитать их там нельзя
        { label: "Average order", value: unitsTotal ? (netOnly - refunds) / unitsTotal : 0, fmt: (v) => `$${v.toFixed(2)}`,
          delta: el("span", { class: "muted" }, "net before refunds ÷ units") },
        { label: "Refunds", value: refunds, fmt: usd,
          delta: el("span", { class: "muted" }, netOnly - refunds ? `${(Math.abs(refunds) / (netOnly - refunds) * 100).toFixed(1)}% of net revenue` : "") },
    ]);
}

function renderTileRow(target, tiles) {
    document.getElementById(target).replaceChildren(...tiles.map((t, i) => {
        const valueNode = el("div", { class: "value" }, t.fmt(0));
        const node = el("div", { class: "tile" },
            el("div", { class: "label" }, t.label), valueNode, el("div", { class: "delta" }, t.delta ?? ""),
            t.spark ? el("canvas", { class: "spark", id: `${target}-spark-${i}` }) : null);
        countUp(valueNode, t.value, t.fmt);
        return node;
    }));
    tiles.forEach((t, i) => {
        if (!t.spark) return;
        const c = css("--series-1");
        draw(`${target}-spark-${i}`, {
            type: "line",
            data: { labels: t.spark.map((_, j) => j),
                datasets: [{ data: t.spark, borderColor: c, backgroundColor: gradient(c, 0.3, 0), fill: "origin", borderWidth: 2, pointRadius: 0, tension: 0.35 }] },
            options: { maintainAspectRatio: false, events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false, beginAtZero: true } } },
        });
    });
}

// Неделя/месяц обрезаны началом или концом периода (или ещё не закончились) — помечаем, чтобы провал на краю
// не читался как падение продаж
function bucketPartial(label) {
    const g = grain();
    if (g === "day") return false;
    const end = g === "week" ? shiftDay(label, 6) : shiftDay(shiftDay(label, 32).slice(0, 8) + "01", -1);
    const today = isoDay(new Date());
    return label < state.range.from || end > (state.range.to < today ? state.range.to : today);
}

function bucketLabel(label) {
    const g = grain();
    const text = g === "month" ? new Date(label + "T00:00:00Z").toLocaleString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }) : label;
    return bucketPartial(label) ? `${text}*` : text;
}

// Последний полный день: сегодня ещё идёт, App Store и Play приходят с задержкой. MS Store отстаёт на недели —
// это подписано над графиком, иначе пунктиром был бы почти весь период
function dayLagging(day) {
    const missing = PLATFORMS.filter((p) => p.id !== "msstore").filter((p) => {
        const src = state.sales.sources.find((s) => s.name === p.id);
        return src && src.covered_to < day;
    }).map((p) => p.name);
    const notes = day >= isoDay(new Date()) ? ["day not over"] : [];
    if (missing.length) notes.push(`no ${missing.join(", ")} report yet`);
    return notes;
}

function renderDaily(cur) {
    const { labels, value } = series(cur, (r) => r.platform, (r) => r[M()]);
    const byDay = grain() === "day";
    const lagging = (i) => byDay && dayLagging(labels[i]).length > 0;
    const partial = labels.some(bucketPartial);
    document.getElementById("daily-note").textContent =
        `${byDay ? "daily" : grain() === "week" ? "weekly" : "monthly"} · ${state.range.from} — ${state.range.to}` +
        (partial ? " · * incomplete week/month" : "");
    const datasets = PLATFORMS.map((p, i) => byDay ? {
        label: p.name,
        data: labels.map((l) => value(p.id, l)),
        borderColor: color(p.id),
        backgroundColor: gradient(color(p.id), 0.55, 0.08),
        fill: i === 0 ? "origin" : "-1",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderColor: css("--surface-1"),
        pointHoverBorderWidth: 2,
        tension: 0.35,
        segment: { borderDash: (ctx) => (lagging(ctx.p1DataIndex) ? [5, 4] : undefined) },
    } : {
        label: p.name,
        data: labels.map((l) => value(p.id, l)),
        backgroundColor: labels.map((l) => (bucketPartial(l) ? alpha(color(p.id), 0.45) : color(p.id))),
        borderColor: css("--surface-1"),
        borderWidth: { top: 2 },
        borderRadius: 4,
        borderSkipped: "bottom",
        maxBarThickness: 48,
    });
    draw("chart-daily", {
        type: byDay ? "line" : "bar",
        data: { labels, datasets },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: {
                x: { ...timeX, stacked: !byDay, ticks: { ...timeX.ticks, callback(v) { return bucketLabel(this.getLabelForValue(v)); } } },
                y: { stacked: true, ticks: { callback: (v) => usd(v) } },
            },
            plugins: {
                legend,
                tooltip: {
                    callbacks: {
                        title: (items) => {
                            const lag = byDay ? dayLagging(items[0].label) : [];
                            return bucketTitle(items[0].label) + (bucketPartial(items[0].label) ? " (incomplete)" : "")
                                + (lag.length ? ` (incomplete: ${lag.join("; ")})` : "");
                        },
                        label: (c) => `${c.dataset.label}: ${usd(c.parsed.y)}`,
                        footer: (items) => `Total: ${usd(items.reduce((a, i) => a + i.parsed.y, 0))}`,
                    },
                },
            },
        },
    });
}

function renderPlatforms(cur, windows) {
    const total = sum(cur, (r) => r[M()]);
    const nets = PLATFORMS.map((p) => sum(cur.filter((r) => r.platform === p.id), (r) => r[M()]));
    draw("chart-platforms", {
        type: "doughnut",
        data: {
            labels: PLATFORMS.map((p) => p.name),
            datasets: [{ data: nets.map((n) => Math.max(n, 0)), backgroundColor: PLATFORMS.map((p) => color(p.id)),
                borderColor: css("--surface-1"), borderWidth: 2, borderRadius: 4, hoverOffset: 6 }],
        },
        options: {
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: { position: isPhone() ? "bottom" : "right", labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "rectRounded" } },
                tooltip: { callbacks: { label: (c) => `${c.label}: ${usd(c.parsed)} (${total ? (c.parsed / total * 100).toFixed(0) : 0}%)` } },
            },
        },
    });
    const rows = PLATFORMS.map((p, i) => {
        const c = cur.filter((r) => r.platform === p.id);
        const w = windows[p.id];
        return el("tr", {},
            td([swatch(p.id), p.name + (c.some((r) => r.estimated) ? " *" : "")]),
            td(usd(nets[i]), true),
            td(total ? `${(nets[i] / total * 100).toFixed(0)}%` : "—", true),
            td(int(sum(c, (r) => r.units)), true),
            td(usd(sum(c, (r) => r.refunds)), true),
            td(deltaPct(sum(w.cur, (r) => r[M()]), sum(w.prev, (r) => r[M()])), true),
            td(w.lagging ? w.end : "", false, "muted"));
    });
    table("tbl-platforms", [["Platform"], [M() === "net" ? "Net" : "Gross", 1], ["Share", 1], ["Units", 1], ["Refunds", 1], ["vs prev.", 1], ["Data until"]], rows);
}

function renderChannels() {
    const rows = state.sales.channels;
    const { labels, value } = series(rows, (r) => r.channel, (r) => r.net);
    draw("chart-channels", {
        type: "bar",
        data: {
            labels,
            datasets: CHANNELS.filter((ch) => rows.some((r) => r.channel === ch.id)).map((ch) => ({
                label: ch.name,
                data: labels.map((l) => value(ch.id, l)),
                backgroundColor: css(ch.color),
                borderColor: css("--surface-1"),
                borderWidth: { top: 2 },
                borderRadius: 4,
                borderSkipped: "bottom",
                maxBarThickness: 22,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, ticks: { callback: (v) => usd(v) } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${usd(c.parsed.y)}` } } },
        },
    });
}

// Метку кампании оплате Paddle ставит страница /buy/: из адреса (приложение передаёт campaign id установки
// из Microsoft Store) или из сессии сайта; gclid/fbc — клик по рекламе без utm. Продления метку не несут.
function renderTags() {
    const totals = {};
    const units = {};
    for (const r of state.sales.campaigns) {
        const key = r.campaign || "No UTM tag";
        totals[key] = (totals[key] || 0) + r.net;
        units[key] = (units[key] || 0) + r.units;
    }
    const keys = Object.keys(totals).filter((k) => totals[k] > 0).sort((a, b) => totals[b] - totals[a]).slice(0, 10);
    const all = sum(Object.values(totals), (v) => v);
    const tagged = all - (totals["No UTM tag"] || 0);
    document.getElementById("tags-note").textContent = all ? `${(tagged / all * 100).toFixed(1)}% of Paddle revenue is tagged` : "";
    draw("chart-tags", {
        type: "bar",
        data: {
            labels: keys,
            datasets: [{ data: keys.map((k) => totals[k]), backgroundColor: keys.map((k) => (k === "No UTM tag" ? css("--neutral") : css("--series-1"))),
                borderRadius: 4, borderSkipped: "left", maxBarThickness: 26 }],
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            scales: { x: { ticks: { callback: (v) => usd(v) } }, y: { grid: { display: false } } },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${usd(ctx.parsed.x)} · ${all ? (ctx.parsed.x / all * 100).toFixed(1) : 0}% · ${int(units[ctx.label])} purchases` } },
            },
        },
    });
}

function sourceLabel(source, campaign) {
    const tagged = campaign && !/^\(.*\)$/.test(campaign);
    return tagged ? `${source} · ${campaign}` : source;
}

function renderAcquisition() {
    const apps = state.product === "captions" ? [["captions", "Live Captions"]] : [["windows", "Windows"], ["android", "Android"], ["apple", "iOS / Mac"]];
    const by = {};
    for (const r of state.sales.acquisition) {
        const key = sourceLabel(r.source, r.campaign);
        by[key] ??= { total: 0 };
        by[key][r.app] = (by[key][r.app] || 0) + r.value;
        by[key].total += r.value;
    }
    const total = sum(Object.values(by), (v) => v.total);
    const rows = Object.entries(by).sort((a, b) => b[1].total - a[1].total).slice(0, 30);
    table("tbl-acq-users", [["Source"], ...apps.map(([, n]) => [n, 1]), ["Total", 1], ["Share", 1]], rows.map(([k, v]) => el("tr", {},
        td(k),
        apps.map(([id]) => td(v[id] ? int(v[id]) : "", true)),
        td(int(v.total), true),
        td(total ? `${(v.total / total * 100).toFixed(1)}%` : "", true))));
}

function renderCountries() {
    const rows = state.sales.countries;
    const totals = {};
    for (const r of rows) totals[r.country] = (totals[r.country] || 0) + r[M()];
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([c]) => c);
    draw("chart-countries", {
        type: "bar",
        data: {
            labels: top,
            datasets: PLATFORMS.map((p) => ({
                label: p.name,
                data: top.map((c) => sum(rows.filter((r) => r.country === c && r.platform === p.id), (r) => r[M()])),
                backgroundColor: color(p.id),
                borderColor: css("--surface-1"),
                borderWidth: { right: 2 },
                borderRadius: 4,
                borderSkipped: "left",
                maxBarThickness: 18,
            })),
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false, axis: "y" },
            scales: { x: { stacked: true, ticks: { callback: (v) => usd(v) } }, y: countryAxis() },
            plugins: {
                legend,
                countryFlags: { enabled: true },
                tooltip: {
                    callbacks: {
                        title: countryTooltipTitle,
                        label: (c) => `${c.dataset.label}: ${usd(c.parsed.x)}`,
                        footer: (items) => `Total: ${usd(items.reduce((a, i) => a + i.parsed.x, 0))}`,
                    },
                },
            },
        },
    });
}

function renderProducts() {
    table("tbl-products", [["Product"], ["Store"], [M() === "net" ? "Net" : "Gross", 1], ["Units", 1], ["Refunded", 1]], state.sales.products.map((r) => el("tr", {},
        td([swatch(r.platform), r.product]), td(byId[r.platform].name, false, "muted"),
        td(usd(r[M()]), true),
        td(int(r.units), true),
        td(r.refunded ? int(r.refunded) : "", true))));
}

function renderSources(target, sources) {
    const names = { ...Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])), aso: "ASO", ga4: "GA4 traffic sources",
        funnel: "GA4 funnel", health: "Health (logs, store stats)", subs: "Subscriptions", checkouts: "Paddle checkouts",
        ads_google: "Google Ads spend", ads_meta: "Meta Ads spend" };
    table(target, [["Source"], ["Updated"], ["Covers"], ["Note"]], sources.map((s) => el("tr", {},
        td(names[s.name] ?? s.name),
        td(new Date(s.updated_at).toLocaleString("en-GB")),
        td(s.covered_from === s.covered_to ? s.covered_from : `${s.covered_from} — ${s.covered_to}`),
        td(s.note ?? ""))));
}

/* ---------- ASO ---------- */

const RANK_BUCKETS = [
    { label: "Top 3", test: (r) => r !== null && r <= 3, cls: "r1", color: "--rank-1" },
    { label: "4–10", test: (r) => r !== null && r > 3 && r <= 10, cls: "r2", color: "--rank-2" },
    { label: "11–20", test: (r) => r !== null && r > 10 && r <= 20, cls: "r3", color: "--rank-3" },
    { label: "21+", test: (r) => r !== null && r > 20, cls: "r4", color: "--rank-4" },
    { label: "Not ranked", test: (r) => r === null, cls: "r0", color: "--neutral" },
];
const compact = (v) => v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : String(v);

function renderAso() {
    const { aso, asoTrend } = state.aso;
    const visibility = {};
    for (const r of asoTrend) visibility[r.day] = (visibility[r.day] || 0) + r.visibility;
    const visDays = Object.keys(visibility).sort();
    const tiles = STORES.map((s) => {
        const rows = aso.filter((r) => r.store === s.id);
        const top10 = rows.filter((r) => r.rank !== null && r.rank <= 10).length;
        const hasBefore = rows.some((r) => r.rank_7d !== null);
        const before = rows.filter((r) => r.rank_7d !== null && r.rank_7d !== -1 && r.rank_7d <= 10).length;
        return {
            label: `${s.name}: in top 10`,
            value: top10,
            fmt: int,
            delta: hasBefore ? deltaPct(top10, before) : el("span", { class: "muted" }, `of ${rows.length} keywords`),
            spark: asoTrend.filter((r) => r.store === s.id).map((r) => r.top10),
        };
    });
    const visNow = visibility[visDays[visDays.length - 1]] ?? 0;
    const visWeekAgo = visDays.length > 7 ? visibility[visDays[visDays.length - 8]] : 0;
    tiles.push({
        label: "Visibility index, all stores",
        value: visNow,
        fmt: (v) => compact(Math.round(v)),
        delta: visWeekAgo ? deltaPct(visNow, visWeekAgo) : el("span", { class: "muted" }, "weekly change after 7 days"),
        spark: visDays.map((d) => visibility[d]),
    });
    renderTileRow("aso-tiles", tiles);
    document.getElementById("aso-trend-note").textContent =
        visDays.length < 7 ? `History started ${visDays[0] ?? "today"}, one point per day` : "";
    renderVisibility();
    renderDistribution();
    renderAsoFilters();
    renderAsoSelection();
}

function renderAsoSelection() {
    renderAsoTable();
    renderOpportunities();
    renderHeatmap();
    renderCompetitors();
}

function renderVisibility() {
    const rows = state.aso.asoTrend;
    const labels = [...new Set(rows.map((r) => r.day))].sort();
    draw("chart-aso-visibility", {
        type: "line",
        data: {
            labels,
            datasets: STORES.map((s) => {
                const map = Object.fromEntries(rows.filter((r) => r.store === s.id).map((r) => [r.day, r.visibility]));
                return {
                    label: s.name,
                    data: labels.map((d) => map[d] ?? null),
                    borderColor: color(s.id),
                    backgroundColor: gradient(color(s.id), 0.25, 0),
                    fill: "origin",
                    borderWidth: 2,
                    pointRadius: labels.length > 40 ? 0 : 4,
                    pointHoverRadius: 5,
                    pointBorderColor: css("--surface-1"),
                    pointBorderWidth: 2,
                    tension: 0.35,
                };
            }),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { callback: (v) => compact(v) } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${compact(Math.round(c.parsed.y))}` } } },
        },
    });
}

function renderDistribution() {
    const aso = state.aso.aso;
    draw("chart-aso-dist", {
        type: "bar",
        data: {
            labels: STORES.map((s) => s.name),
            datasets: RANK_BUCKETS.map((b) => ({
                label: b.label,
                data: STORES.map((s) => aso.filter((r) => r.store === s.id && b.test(r.rank)).length),
                backgroundColor: css(b.color),
                borderColor: css("--surface-1"),
                borderWidth: { right: 2 },
                borderRadius: 4,
                borderSkipped: false,
                maxBarThickness: 34,
            })),
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false, axis: "y" },
            scales: { x: { stacked: true, ticks: { precision: 0 } }, y: { stacked: true, grid: { display: false } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.x} keywords` } } },
        },
    });
}

function renderAsoFilters() {
    const aso = state.aso.aso;
    const storeSel = document.getElementById("aso-store");
    const countrySel = document.getElementById("aso-country");
    storeSel.replaceChildren(...STORES.map((s) => el("option", { value: s.id }, s.name)));
    storeSel.value = state.asoSel.store;
    const countries = [...new Set(aso.map((r) => r.country))];
    if (!countries.includes(state.asoSel.country)) state.asoSel.country = countries.includes("US") ? "US" : countries[0] ?? null;
    countrySel.replaceChildren(...countries.map((c) => el("option", { value: c }, `${countryName(c)} (${c})`)));
    countrySel.value = state.asoSel.country ?? "";
}

function rankText(rank, depth) {
    return rank ?? `>${depth}`;
}

function rankDelta(now, before, depth) {
    if (before === null || (before === -1 && now === null)) return el("span", { class: "muted" }, "");
    const a = now ?? depth + 1;
    const b = before === -1 ? depth + 1 : before;
    if (a === b) return el("span", { class: "muted" }, "=");
    return el("span", { class: a < b ? "up" : "down" }, `${a < b ? "▲" : "▼"} ${Math.abs(b - a)}`);
}

function renderAsoTable() {
    const rows = state.aso.aso
        .filter((r) => r.store === state.asoSel.store && r.country === state.asoSel.country)
        .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999) || (b.volume ?? 0) - (a.volume ?? 0));
    table("tbl-aso", [["Keyword"], ["Searches/mo", 1], ["Rank", 1], ["7d", 1], ["30d", 1]], rows.map((r) =>
        el("tr", { class: "clickable", onclick: (e) => selectKeyword(r, e.currentTarget) },
            td(r.keyword),
            td(r.volume ? compact(r.volume) : "", true),
            td(rankText(r.rank, r.depth), true),
            td(rankDelta(r.rank, r.rank_7d, r.depth), true),
            td(rankDelta(r.rank, r.rank_30d, r.depth), true))));
}

function renderOpportunities() {
    const store = state.asoSel.store;
    const rows = state.aso.aso.filter((r) => r.store === store && r.volume);
    document.getElementById("opp-store").textContent = `${byId[store].name}, all countries`;
    const point = (r) => ({ x: r.volume, y: r.rank ?? r.depth + 5, r });
    const good = rows.filter((r) => r.rank !== null && r.rank <= 10);
    const weak = rows.filter((r) => r.rank === null || r.rank > 10);
    const dot = { borderColor: css("--surface-1"), borderWidth: 2, pointRadius: 6, pointHoverRadius: 8 };
    draw("chart-aso-opps", {
        type: "scatter",
        data: {
            datasets: [
                { label: "Top 10", data: good.map(point), backgroundColor: color(store), ...dot },
                { label: "Below top 10 / not ranked", data: weak.map(point), backgroundColor: css("--neutral"), ...dot },
            ],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "logarithmic",
                    title: { display: true, text: "Google searches / month" },
                    ticks: { callback: (v) => [10, 100, 1000, 10000, 100000].includes(v) ? compact(v) : "" },
                },
                y: { reverse: true, min: 0, title: { display: true, text: "our rank (bottom = not ranked)" }, ticks: { precision: 0 } },
            },
            plugins: {
                legend,
                tooltip: {
                    callbacks: {
                        label: (c) => {
                            const r = c.raw.r;
                            return `${r.keyword} (${r.country}): ${compact(r.volume)}/mo, rank ${rankText(r.rank, r.depth)}`;
                        },
                    },
                },
            },
        },
    });
    const opps = [...weak].sort((a, b) => b.volume - a.volume).slice(0, 15);
    table("tbl-aso-opps", [["Keyword"], ["Country"], ["Searches/mo", 1], ["Rank", 1]], opps.map((r) => el("tr", {},
        td(r.keyword), td(withFlag(r.country)), td(compact(r.volume), true), td(rankText(r.rank, r.depth), true))),
        "Every keyword with known volume is already in the top 10");
}

function renderHeatmap() {
    const rows = state.aso.aso.filter((r) => r.store === state.asoSel.store);
    const countries = [...new Set(rows.map((r) => r.country))];
    const at = Object.fromEntries(rows.map((r) => [`${r.keyword}|${r.country}`, r]));
    const best = (k) => Math.min(...countries.map((c) => at[`${k}|${c}`]?.rank ?? 999));
    const keywords = [...new Set(rows.map((r) => r.keyword))].sort((a, b) => best(a) - best(b));
    table("tbl-aso-heat", [["Keyword"], ...countries.map((c) => [withFlag(c), 1])], keywords.map((k) => el("tr", {},
        td(k),
        countries.map((c) => {
            const r = at[`${k}|${c}`];
            if (!r) return el("td", {});
            const bucket = RANK_BUCKETS.find((b) => b.test(r.rank));
            return el("td", { class: `cell ${bucket.cls}`, title: `${k} · ${c} · rank ${rankText(r.rank, r.depth)}` }, r.rank ?? "—");
        }))));
}

function renderCompetitors() {
    const store = state.asoSel.store;
    const rows = state.aso.competitors.filter((r) => r.store === store);
    draw("chart-aso-comp", {
        type: "bar",
        data: {
            labels: rows.map((r) => r.name.length > 34 ? `${r.name.slice(0, 33)}…` : r.name),
            datasets: [{
                label: "Appearances in top 5",
                data: rows.map((r) => r.hits),
                backgroundColor: rows.map((r) => r.app_id === product().ids[store] ? color(store) : css("--neutral")),
                borderRadius: 4,
                borderSkipped: "left",
                maxBarThickness: 20,
            }],
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { precision: 0 }, title: { display: true, text: `top-5 slots across all keywords and countries, ${byId[store].name}` } },
                y: { grid: { display: false } },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (c) => {
                            const r = rows[c.dataIndex];
                            return `${r.hits} times in top 5, #1 ${r.firsts} times, avg position ${r.avg_pos.toFixed(1)}`;
                        },
                    },
                },
            },
        },
    });
}

async function selectKeyword(r, row) {
    document.querySelectorAll("#tbl-aso tr.active").forEach((x) => x.classList.remove("active"));
    row.classList.add("active");
    const q = new URLSearchParams({ store: r.store, country: r.country, keyword: r.keyword });
    const hist = await api(`/api/aso/history?${q}&${rangeQuery()}`);
    if (!hist) return;
    document.getElementById("aso-history-title").textContent = `"${r.keyword}" — ${byId[r.store].name}, ${r.country}`;
    const c = color(r.store);
    draw("chart-aso-history", {
        type: "line",
        data: {
            labels: hist.map((h) => h.day),
            datasets: [{
                label: r.keyword,
                data: hist.map((h) => h.rank),
                borderColor: c,
                backgroundColor: c,
                borderWidth: 2,
                pointRadius: hist.length > 40 ? 0 : 4,
                pointBorderColor: css("--surface-1"),
                pointBorderWidth: 2,
                tension: 0.3,
            }],
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: {
                x: timeX,
                y: { reverse: true, min: 1, suggestedMax: 20, ticks: { precision: 0 }, title: { display: true, text: "rank" } },
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `rank ${rankText(hist[ctx.dataIndex].rank, hist[ctx.dataIndex].depth)}` } },
            },
        },
    });
}

/* ---------- Google: позиции сайта и карточек в выдаче ---------- */

state.searchSel = { country: "" };

// rank NULL — не на первой странице; before: null — замера не было, 0 — был, но не в топ-10
function serpCell(rank, before) {
    const shown = rank ? String(rank) : el("span", { class: "muted" }, ">10");
    let move = null;
    if (before === 0 && rank) move = el("span", { class: "up" }, " new");
    else if (before > 0 && !rank) move = el("span", { class: "down" }, " out");
    else if (before > 0 && rank && before !== rank) move = el("span", { class: rank < before ? "up" : "down" }, ` ${rank < before ? "▲" : "▼"}${Math.abs(before - rank)}`);
    return td([shown, move], true);
}

function renderSearch() {
    const { ranks, trend, top, sources } = state.search;
    const targets = product().serp;
    const rows = {};
    for (const r of ranks) (rows[`${r.country}|${r.keyword}`] ??= { country: r.country, keyword: r.keyword })[r.target] = r;
    const list = Object.values(rows);
    const best = (x) => Math.min(...targets.map(([t]) => x[t]?.rank || 99));
    const last = trend[trend.length - 1] || {};
    const weekAgo = trend.length > 7 ? trend[trend.length - 8] : null;
    renderTileRow("search-tiles", [
        { label: "Keywords with us in top 10", value: last.top10 || 0, fmt: int, spark: trend.map((t) => t.top10),
          delta: weekAgo ? deltaPct(last.top10, weekAgo.top10) : el("span", { class: "muted" }, `of ${int(last.total || 0)} keywords`) },
        { label: "Cited in Google's AI answer", value: last.ai || 0, fmt: int,
          delta: el("span", { class: "muted" }, `of ${int(last.with_ai || 0)} queries with an AI answer`) },
        ...targets.map(([t, name]) => ({ label: `${name}: in top 10`, value: list.filter((x) => x[t]?.rank).length, fmt: int })),
    ]);
    const src = sources[0];
    document.getElementById("search-note").textContent = src
        ? `Google via Bright Data, checked ${new Date(src.updated_at).toLocaleString("en-GB")} (${src.note}). Main keywords daily, the rest weekly.`
        : "No checks yet.";
    document.getElementById("search-trend-note").textContent =
        trend.length < 7 ? `History started ${trend[0]?.day ?? "today"}, one point per day` : "keywords per day";
    const days = trend.map((t) => t.day);
    draw("chart-search-trend", {
        type: "line",
        data: { labels: days, datasets: [
            lineDataset("In top 10", trend.map((t) => t.top10), css("--series-1"), true),
            lineDataset("In top 3", trend.map((t) => t.top3), css("--series-6")),
            lineDataset("Cited in AI answer", trend.map((t) => t.ai), css("--series-7")),
        ] },
        options: { maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend } },
    });

    const countrySel = document.getElementById("search-country");
    const countries = [...new Set(list.map((x) => x.country))].sort();
    if (!countries.includes(state.searchSel.country)) state.searchSel.country = "";
    countrySel.replaceChildren(el("option", { value: "" }, "All countries"), ...countries.map((c) => el("option", { value: c }, `${countryName(c)} (${c})`)));
    countrySel.value = state.searchSel.country;
    const shown = list.filter((x) => !state.searchSel.country || x.country === state.searchSel.country)
        .sort((a, b) => best(a) - best(b) || a.country.localeCompare(b.country) || a.keyword.localeCompare(b.keyword));
    const aiCell = (r) => (!r || r.rank === -1 ? td(el("span", { class: "muted" }, "·"), true)
        : r.rank === 1 ? td(el("span", { class: "up" }, "✓"), true) : td(el("span", { class: "muted" }, "✗"), true));
    table("tbl-search", [["Keyword"], ["Country"], ...targets.map(([, name]) => [name, 1]), ["AI answer", 1], ["Google top 3"]],
        shown.map((x) => el("tr", {},
            td(x.keyword), td(withFlag(x.country)),
            targets.map(([t]) => serpCell(x[t]?.rank, x[t]?.rank_7d)),
            aiCell(x.ai),
            td(top.filter((t) => t.country === x.country && t.keyword === x.keyword).slice(0, 3).map((t) => t.domain).join(", "), false, "muted"))),
        "No checks yet");
}

/* ---------- shared for app-level tabs ---------- */

const APPS = [
    { id: "windows", name: "Windows", color: "--series-1" },
    { id: "android", name: "Android", color: "--series-3" },
    { id: "apple", name: "iOS", color: "--series-2" },
    { id: "mac", name: "Mac", color: "--series-7" },
    { id: "captions", name: "Live Captions", color: "--series-1" },
];
const appById = Object.fromEntries(APPS.map((a) => [a.id, a]));
const productApps = () => APPS.filter((a) => product().apps.includes(a.id));
const appColor = (id) => css(appById[id].color);
const pct = (v, digits = 1) => `${(v * 100).toFixed(digits)}%`;

function appSelect(id, apps, selected, onChange) {
    const sel = document.getElementById(id);
    sel.replaceChildren(...apps.map((a) => el("option", { value: a.id }, a.name)));
    sel.value = selected;
    sel.onchange = (e) => onChange(e.target.value);
}

function lineDataset(label, data, hex, fill = false) {
    return {
        label, data, borderColor: hex, backgroundColor: fill ? gradient(hex, 0.3, 0.02) : hex, fill: fill ? "origin" : false,
        borderWidth: 2, pointRadius: data.length > 40 ? 0 : 3, pointHoverRadius: 5,
        pointBorderColor: css("--surface-1"), pointBorderWidth: 2, tension: 0.35, spanGaps: true,
    };
}

/* ---------- Funnel ---------- */

// GA4 не делит когорты по параметру события, поэтому у Live Captions (поток Windows) удержания нет
const RETENTION_APPS = () => productApps().filter((a) => a.id === "android" || a.id === "apple");
state.funnelSel = { retentionApp: "android" };

function renderFunnel() {
    const { latest, trend, window } = state.funnel;
    const apps = APPS.filter((a) => latest.some((r) => r.app === a.id));
    const steps = [...new Map(latest.map((r) => [r.step, r.name])).entries()].sort((a, b) => a[0] - b[0]);
    const users = (app, step) => latest.find((r) => r.app === app && r.step === step)?.users ?? 0;
    const last = steps.length ? steps[steps.length - 1][0] : 0;
    document.getElementById("funnel-window").textContent = `last ${window} days`;

    renderTileRow("funnel-tiles", apps.map((a) => ({
        label: `${a.name}: ${product().funnel.start} → purchase`,
        value: users(a.id, 1) ? users(a.id, last) / users(a.id, 1) : 0,
        fmt: (v) => pct(v, 2),
        delta: el("span", { class: "muted" }, `${int(users(a.id, last))} of ${int(users(a.id, 1))}`),
    })));

    draw("chart-funnel", {
        type: "bar",
        data: {
            labels: steps.map(([, name]) => name),
            datasets: apps.map((a) => ({
                label: a.name,
                data: steps.map(([s]) => users(a.id, 1) ? users(a.id, s) / users(a.id, 1) * 100 : 0),
                backgroundColor: appColor(a.id),
                borderRadius: 4,
                borderSkipped: "left",
                maxBarThickness: 16,
            })),
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false, axis: "y" },
            scales: { x: { max: 100, ticks: { callback: (v) => `${v}%` } }, y: { grid: { display: false } } },
            plugins: {
                legend,
                tooltip: {
                    callbacks: {
                        label: (c) => {
                            const a = apps[c.datasetIndex];
                            const s = steps[c.dataIndex][0];
                            const prev = s > 1 ? users(a.id, s - 1) : 0;
                            const step = prev ? ` · ${pct(users(a.id, s) / prev)} of previous step` : "";
                            return `${a.name}: ${int(users(a.id, s))} (${c.parsed.x.toFixed(1)}% of start)${step}`;
                        },
                    },
                },
            },
        },
    });

    // реальные покупки из отчётов магазинов: Windows = Paddle + Microsoft Store, Android = Play, iOS = App Store
    const STORES_OF = { windows: ["paddle", "msstore"], android: ["play"], apple: ["appstore"], captions: ["paddle", "msstore"] };
    const storeUnits = (app, key) => sum((state.funnel.storeSales || []).filter((r) => STORES_OF[app]?.includes(r.platform)), (r) => r[key]);
    const rows = steps.map(([s, name]) => el("tr", {},
        td(s === last ? `${name} (new users only)` : name),
        apps.flatMap((a) => {
            const prev = s > 1 ? users(a.id, s - 1) : 0;
            return [td(int(users(a.id, s)), true), td(prev ? pct(users(a.id, s) / prev) : "", true, "muted")];
        })));
    rows.push(el("tr", { class: "store-row" },
        td("All purchases in the stores, same days"),
        apps.flatMap((a) => [td(int(storeUnits(a.id, "units")), true),
            td(`${int(storeUnits(a.id, "new_units"))} new`, true, "muted")])));
    table("tbl-funnel", [["Step"], ...apps.flatMap((a) => [[a.name, 1], ["→", 1]])], rows);

    const days = [...new Set(trend.map((r) => r.day))].sort();
    document.getElementById("funnel-trend-note").textContent =
        days.length < 7 ? `History started ${days[0] ?? "today"}, one point per day` : `${window}-day rolling window`;
    const conv = (app, day) => {
        const first = trend.find((r) => r.app === app && r.day === day && r.step === 1)?.users;
        const lastStep = trend.find((r) => r.app === app && r.day === day && r.step === last)?.users;
        return first ? lastStep / first * 100 : null;
    };
    draw("chart-funnel-trend", {
        type: "line",
        data: { labels: days, datasets: apps.map((a) => lineDataset(a.name, days.map((d) => conv(a.id, d)), appColor(a.id))) },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { callback: (v) => `${v}%` } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y?.toFixed(2)}%` } } },
        },
    });
    renderCheckout();
    appSelect("retention-app", RETENTION_APPS(), state.funnelSel.retentionApp, (v) => {
        state.funnelSel.retentionApp = v;
        renderRetention();
    });
    renderRetention();
}

function renderRetention() {
    const rows = state.funnel.retention.filter((r) => r.app === state.funnelSel.retentionApp);
    const cohorts = [...new Set(rows.map((r) => r.cohort))].sort().reverse();
    const weeks = [...new Set(rows.map((r) => r.week))].sort((a, b) => a - b);
    const at = Object.fromEntries(rows.map((r) => [`${r.cohort}|${r.week}`, r.users]));
    const bucket = (share) => share >= 0.2 ? "r1" : share >= 0.1 ? "r2" : share >= 0.05 ? "r3" : share > 0 ? "r4" : "r0";
    table("tbl-retention", [["Cohort (week of)"], ["Users", 1], ...weeks.filter((w) => w > 0).map((w) => [`W${w}`, 1])],
        cohorts.map((c) => {
            const base = at[`${c}|0`] || 0;
            return el("tr", {},
                td(c), td(int(base), true),
                weeks.filter((w) => w > 0).map((w) => {
                    const v = at[`${c}|${w}`];
                    if (v === undefined) return el("td", {});
                    const share = base ? v / base : 0;
                    return el("td", { class: `cell ${bucket(share)}`, title: `${int(v)} users` }, pct(share, 1));
                }));
        }));
}

/* ---------- Subscriptions ---------- */

function latestPerPlatform(rows) {
    const out = {};
    for (const r of rows) {
        if (!out[r.platform] || r.day > out[r.platform].day) out[r.platform] = r;
    }
    return out;
}

function renderSubs() {
    const { daily, products } = state.subs;
    const latest = latestPerPlatform(daily);
    const plats = PLATFORMS.filter((p) => daily.some((r) => r.platform === p.id));
    const mrr = sum(Object.values(latest), (r) => r.mrr);
    const active = sum(Object.values(latest), (r) => r.active);
    const cut = shiftDay(state.subs.range.to, -30);
    const recent = daily.filter((r) => r.day > cut);
    const newSubs = sum(recent, (r) => r.new);
    const cancelled = sum(recent, (r) => r.cancelled);
    const filled = carryForward(daily, plats);
    const firstDay = filled.days.find((d) => d > cut) ?? filled.days[0];
    const baseActive = sum(plats, (p) => filled.get(p.id, firstDay, "active"));
    const baseMrr = sum(plats, (p) => filled.get(p.id, firstDay, "mrr"));
    // как в сводке: среднее по каждой площадке за дни, где у неё есть данные (Play отстаёт), потом сумма
    const avgMonthly = sum(plats, (p) => {
        const rows = recent.filter((r) => r.platform === p.id);
        return rows.length ? sum(rows, (r) => r.active_monthly) / rows.length : 0;
    });
    const cancelledMonthly = sum(recent, (r) => r.cancelled_monthly);
    const lastDay = filled.days[filled.days.length - 1];
    const mrrMonthly = sum(plats, (p) => filled.get(p.id, lastDay, "mrr_monthly"));
    const activeMonthly = sum(plats, (p) => filled.get(p.id, lastDay, "active_monthly"));
    const churnMonthly = avgMonthly ? cancelledMonthly / avgMonthly : 0;
    const ltvMonthly = churnMonthly && activeMonthly ? mrrMonthly / activeMonthly / churnMonthly : 0;
    renderTileRow("subs-tiles", [
        { label: "MRR, net", value: mrr, fmt: usd, delta: deltaPct(mrr, baseMrr), spark: filled.days.map((d) => sum(plats, (p) => filled.get(p.id, d, "mrr"))) },
        { label: "Active paid subscriptions", value: active, fmt: int, delta: deltaPct(active, baseActive), spark: filled.days.map((d) => sum(plats, (p) => filled.get(p.id, d, "active"))) },
        { label: "New, last 30 days", value: newSubs, fmt: int, delta: el("span", { class: "muted" }, `${int(cancelled)} cancelled`) },
        { label: "Monthly churn, monthly plans", value: avgMonthly ? cancelledMonthly / avgMonthly : 0, fmt: (v) => pct(v),
          delta: el("span", { class: "muted" }, `${int(cancelledMonthly)} cancelled ÷ ${int(avgMonthly)} average active, 30 days`) },
        { label: "Revenue per subscriber, month", value: active ? mrr / active : 0, fmt: (v) => `$${v.toFixed(2)}`,
          delta: el("span", { class: "muted" }, "MRR ÷ paid subscriptions") },
        { label: "LTV, monthly plans", value: ltvMonthly, fmt: usd,
          delta: el("span", { class: "muted" }, "net per month ÷ monthly churn") },
    ]);
    document.getElementById("subs-note").textContent = plats.map((p) => `${p.name} data until ${latest[p.id].day}`).join(" · ");

    const days = filled.days;
    const val = (p, d, k) => filled.get(p, d, k);
    draw("chart-mrr", {
        type: "line",
        data: {
            labels: days,
            datasets: plats.map((p, i) => ({ ...lineDataset(p.name, days.map((d) => val(p.id, d, "mrr")), color(p.id), true), fill: i === 0 ? "origin" : "-1" })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { stacked: true, ticks: { callback: (v) => usd(v) } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${usd(c.parsed.y ?? 0)}`, footer: (items) => `Total: ${usd(items.reduce((a, i) => a + (i.parsed.y ?? 0), 0))}` } } },
        },
    });
    draw("chart-subs-active", {
        type: "line",
        data: { labels: days, datasets: plats.map((p) => lineDataset(p.name, days.map((d) => val(p.id, d, "active")), color(p.id))) },
        options: { maintainAspectRatio: false, interaction: { mode: "index", intersect: false }, scales: { x: timeX, y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend } },
    });
    const weekly = grain() !== "day";
    const flow = series(daily, () => "x", (r) => r.new);
    const lost = series(daily, () => "x", (r) => r.cancelled);
    draw("chart-subs-flow", {
        type: "bar",
        data: {
            labels: flow.labels,
            datasets: [
                { label: "New", data: flow.labels.map((l) => flow.value("x", l)), backgroundColor: css("--series-6"), borderRadius: 3, maxBarThickness: 16 },
                { label: "Cancelled", data: lost.labels.map((l) => -lost.value("x", l)), backgroundColor: css("--neutral"), borderRadius: 3, maxBarThickness: 16 },
            ],
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, ticks: { precision: 0, callback: (v) => Math.abs(v) } } },
            plugins: { legend, tooltip: { callbacks: { title: (items) => (weekly ? bucketTitle(items[0].label) : items[0].label), label: (c) => `${c.dataset.label}: ${Math.abs(c.parsed.y)}` } } },
        },
    });
    table("tbl-subs-products", [["Plan"], ["Store"], ["Billing"], ["Active", 1], ["MRR", 1], ["As of"]], products.filter((r) => r.active > 0).map((r) => el("tr", {},
        td([swatch(r.platform), r.product]), td(byId[r.platform].name, false, "muted"),
        td(r.period_months === 12 ? "yearly" : r.period_months === 1 ? "monthly" : `${r.period_months} months`),
        td(int(r.active), true), td(usd(r.mrr), true), td(r.day, false, "muted"))));
}

// Площадки отдают данные с разной задержкой (Play ~2 недели): после последнего дня держим последнее значение,
// иначе сумма MRR «проваливается» в конце графика
function carryForward(rows, plats) {
    const days = [...new Set(rows.map((r) => r.day))].sort();
    const by = {};
    for (const r of rows) by[`${r.platform}|${r.day}`] = r;
    const filled = {};
    for (const p of plats) {
        let last = null;
        for (const d of days) {
            last = by[`${p.id}|${d}`] ?? last;
            filled[`${p.id}|${d}`] = last;
        }
    }
    return { days, get: (p, d, k) => filled[`${p}|${d}`]?.[k] ?? 0 };
}

/* ---------- Health ---------- */

const HEALTH = {
    windows: {
        base: "sessions",
        rates: [
            { metric: "sessions_no_subtitles", label: "Sessions: audio but no subtitles", color: "--series-5" },
            { metric: "sessions_stalled", label: "Sessions with an STT stall", color: "--series-7" },
            { metric: "start_failures", label: "Recording start failures", color: "--series-2" },
        ],
        perSession: [
            { metric: "ui_freezes", label: "UI freezes per session" },
            { metric: "errors", label: "Errors per session" },
        ],
        adoption: "sessions",
    },
    android: {
        base: "sessions",
        rates: [
            { metric: "start_blocked", label: "Start blocked (no minutes / offline)", color: "--series-5" },
            { metric: "crashes_logged", label: "Crashes in logs", color: "--series-2" },
            { metric: "stt_errors", label: "STT reconnect failures", color: "--series-7" },
        ],
        perSession: [],
        adoption: "active_users",
        extra: [{ metric: "crashes", label: "Play crashes" }, { metric: "anrs", label: "Play ANRs" }],
    },
    apple: { base: "sessions", rates: [{ metric: "stt_errors", label: "STT errors", color: "--series-2" }], perSession: [], adoption: "active_users" },
    mac: { base: "sessions", rates: [{ metric: "errors", label: "Errors", color: "--series-2" }], perSession: [], adoption: "sessions" },
};
HEALTH.captions = HEALTH.windows;
state.healthSel = { app: "windows" };

function healthSum(rows, app, metric, days) {
    return sum(rows.filter((r) => r.app === app && r.metric === metric && days.includes(r.day)), (r) => r.value);
}

function renderHealth() {
    const rows = state.health.rows;
    appSelect("health-app", productApps(), state.healthSel.app, (v) => {
        state.healthSel.app = v;
        renderHealth();
    });
    const app = state.healthSel.app;
    const cfg = HEALTH[app];
    const days = [...new Set(rows.filter((r) => r.app === app && r.metric === cfg.base).map((r) => r.day))].sort();
    const lastDay = days[days.length - 1];
    const week = days.slice(-8, -1);
    document.getElementById("health-note").textContent = lastDay ? `per ${cfg.base === "sessions" ? "100 sessions" : "day"}, last full day ${lastDay}` : "no data yet";

    const rate = (metric, ds) => {
        const base = healthSum(rows, app, cfg.base, ds);
        return base ? healthSum(rows, app, metric, ds) / base : 0;
    };
    const tiles = [{
        label: "Sessions, last day", value: healthSum(rows, app, cfg.base, [lastDay]), fmt: int,
        delta: week.length ? deltaPct(healthSum(rows, app, cfg.base, [lastDay]), healthSum(rows, app, cfg.base, week) / week.length) : null,
        spark: days.map((d) => healthSum(rows, app, cfg.base, [d])),
    }];
    for (const r of [...cfg.rates, ...cfg.perSession]) {
        const now = rate(r.metric, [lastDay]);
        const before = rate(r.metric, week);
        const perSession = cfg.perSession.includes(r);
        tiles.push({
            label: perSession ? r.label : `${r.label}, per 100 sessions`, value: perSession ? now : now * 100, fmt: (v) => perSession ? v.toFixed(2) : v.toFixed(1),
            delta: before ? deltaPct(now, before, false) : null,
        });
    }
    for (const x of cfg.extra || []) {
        tiles.push({ label: `${x.label}, 7 days`, value: healthSum(rows, app, x.metric, days.slice(-7)), fmt: int });
    }
    renderTileRow("health-tiles", tiles.slice(0, 6));

    draw("chart-health", {
        type: "line",
        data: { labels: days, datasets: cfg.rates.map((r) => lineDataset(r.label, days.map((d) => rate(r.metric, [d]) * 100), css(r.color))) },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y.toFixed(2)} per 100 sessions` } } },
        },
    });
    renderVersions(app, cfg);
    renderVersionTable(app, cfg, days.slice(-7));
    renderRatings();
}

function renderVersions(app, cfg) {
    const rows = state.health.rows.filter((r) => r.app === app && r.metric === cfg.adoption && r.version !== "(not set)");
    const days = [...new Set(rows.map((r) => r.day))].sort().slice(-30);
    const totals = {};
    const recent = days.slice(-7);
    for (const r of rows) {
        if (recent.includes(r.day)) totals[r.version] = (totals[r.version] || 0) + r.value;
    }
    const top = Object.keys(totals).sort((a, b) => totals[b] - totals[a]).slice(0, 4);
    const ramp = ["--rank-1", "--rank-2", "--rank-3", "--rank-4"];
    const share = (v, d) => {
        const all = sum(rows.filter((r) => r.day === d), (r) => r.value);
        const mine = v === "other" ? sum(rows.filter((r) => r.day === d && !chosen.includes(r.version)), (r) => r.value)
            : sum(rows.filter((r) => r.day === d && r.version === v), (r) => r.value);
        return all ? mine / all * 100 : 0;
    };
    const chosen = [...top].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })).slice(0, 4);
    const labels = [...chosen, ...(new Set(rows.map((r) => r.version)).size > chosen.length ? ["other"] : [])];
    draw("chart-versions", {
        type: "bar",
        data: {
            labels: days,
            datasets: labels.map((v, i) => ({
                label: v === "other" ? "Older / other" : v,
                data: days.map((d) => share(v, d)),
                backgroundColor: v === "other" ? css("--neutral") : css(ramp[i] ?? "--rank-4"),
                borderColor: css("--surface-1"), borderWidth: { top: 1 }, maxBarThickness: 18,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, max: 100, ticks: { callback: (v) => `${v}%` } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y.toFixed(1)}%` } } },
        },
    });
}

function renderVersionTable(app, cfg, days) {
    const rows = state.health.rows.filter((r) => r.app === app && days.includes(r.day));
    const versions = [...new Set(rows.filter((r) => r.metric === cfg.base).map((r) => r.version))]
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    const v = (version, metric) => sum(rows.filter((r) => r.version === version && r.metric === metric), (r) => r.value);
    const cols = [...cfg.rates, ...cfg.perSession];
    table("tbl-health-versions", [["Version"], ["Sessions", 1], ...cols.map((c) => [`${c.label.replace(/^Sessions: /, "")}${cfg.perSession.includes(c) ? "" : " /100"}`, 1])],
        versions.filter((x) => v(x, cfg.base) >= 5).map((x) => {
            const base = v(x, cfg.base);
            return el("tr", {}, td(x), td(int(base), true), cols.map((c) =>
                td(cfg.perSession.includes(c) ? (v(x, c.metric) / base).toFixed(2) : (v(x, c.metric) / base * 100).toFixed(1), true)));
        }));
}

function renderRatings() {
    const { ratings, reviews } = state.health;
    const days = [...new Set(ratings.map((r) => r.day))].sort();
    const appleByDay = {};
    for (const r of reviews.filter((x) => x.store === "appstore")) (appleByDay[r.day] ??= []).push(r.rating);
    draw("chart-ratings", {
        type: "line",
        data: {
            labels: days,
            datasets: [
                lineDataset("Google Play, overall", days.map((d) => ratings.find((r) => r.day === d && r.store === "play")?.total_avg ?? null), css("--series-3")),
                { ...lineDataset("Google Play, that day", days.map((d) => ratings.find((r) => r.day === d && r.store === "play")?.daily_avg ?? null), css("--series-3")), showLine: false, pointRadius: 4 },
                { ...lineDataset("App Store reviews, that day", days.map((d) => appleByDay[d] ? sum(appleByDay[d], (x) => x) / appleByDay[d].length : null), css("--series-2")), showLine: false, pointRadius: 4 },
            ],
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { min: 1, max: 5, ticks: { stepSize: 1 } } },
            plugins: { legend },
        },
    });
    table("tbl-reviews", [["Stars"], ["Store"], ["Date"], ["Review"]], reviews.slice(0, 40).map((r) => el("tr", {},
        td("★".repeat(r.rating) + "☆".repeat(5 - r.rating), false, "stars"),
        td(r.store === "play" ? "Google Play" : "App Store"),
        td([r.day, r.version ? el("div", { class: "muted" }, r.version) : null]),
        td([r.title ? el("strong", {}, r.title) : null, r.title && r.body ? el("br") : null, r.body || el("span", { class: "muted" }, "(no text)")]))));
}

/* ---------- Live ---------- */

let liveTimer = null;

function renderLive() {
    const unsupported = !!state.live.unsupported;
    document.querySelectorAll("#tab-live > :not(#live-note)").forEach((n) => { n.hidden = unsupported; });
    if (unsupported) {
        document.getElementById("live-note").textContent =
            "Not available for Live Captions: it shares the Windows GA4 stream, and GA4 realtime cannot tell the two apps apart.";
        return;
    }
    const { byMinute, byCountry, byEvent, byVersion, at } = state.live;
    const apps = APPS.filter((a) => byCountry.some((r) => r.app === a.id));
    const activeNow = (app) => sum(byCountry.filter((r) => r.app === app), (r) => r.value);
    renderTileRow("live-tiles", [
        { label: "Active users, last 30 min", value: sum(byCountry, (r) => r.value), fmt: int },
        ...apps.map((a) => ({ label: a.name, value: activeNow(a.id), fmt: int })),
    ]);
    document.getElementById("live-note").replaceChildren(el("span", { class: "pulse", "aria-hidden": "true" }),
        `GA4 realtime, updated ${new Date(at).toLocaleTimeString("en-GB")}, refreshes every 30 s while this tab is open. Windows sends events server-side, so GA4 has no country or version for it. Windows here also includes Live Captions users (same GA4 stream).`);

    const minutes = [...Array(30).keys()].reverse();
    draw("chart-live", {
        type: "line",
        data: {
            labels: minutes.map((m) => m === 0 ? "now" : `-${m}m`),
            datasets: apps.map((a, i) => ({
                ...lineDataset(a.name, minutes.map((m) => byMinute.find((r) => r.app === a.id && Number(r.key) === m)?.value ?? 0), appColor(a.id), true),
                fill: i === 0 ? "origin" : "-1",
            })),
        },
        options: {
            animation: false,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, ticks: { maxRotation: 0, autoSkipPadding: 20 } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } },
            plugins: { legend },
        },
    });
    const events = ["onboarding_start", "recording_start", "first_subtitle_shown", "paywall_view", "purchase_start", "web_checkout_opened", "purchase", "purchase_web"];
    const ev = (name, app) => byEvent.find((r) => r.key === name && r.app === app)?.value ?? 0;
    table("tbl-live-events", [["Event"], ...apps.map((a) => [a.name, 1])],
        events.filter((e) => apps.some((a) => ev(e, a.id))).map((e) => el("tr", {}, td(e), apps.map((a) => td(ev(e, a.id) ? int(ev(e, a.id)) : "", true)))),
        "No tracked events in the last 30 minutes");

    const countries = {};
    for (const r of byCountry) countries[r.key] = (countries[r.key] || 0) + r.value;

    const top = Object.keys(countries).sort((a, b) => countries[b] - countries[a]).slice(0, 12);
    draw("chart-live-countries", {
        type: "bar",
        data: {
            labels: top.map((c) => c || "Unknown"),
            datasets: apps.map((a) => ({
                label: a.name,
                data: top.map((c) => byCountry.find((r) => r.key === c && r.app === a.id)?.value ?? 0),
                backgroundColor: appColor(a.id), borderColor: css("--surface-1"), borderWidth: { right: 2 }, borderRadius: 4, borderSkipped: "left", maxBarThickness: 18,
            })),
        },
        options: {
            animation: false,
            indexAxis: "y",
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false, axis: "y" },
            scales: { x: { stacked: true, ticks: { precision: 0 } }, y: countryAxis() },
            plugins: { legend, countryFlags: { enabled: true }, tooltip: { callbacks: { title: countryTooltipTitle } } },
        },
    });
    table("tbl-live-versions", [["App"], ["Version"], ["Active users", 1]],
        [...byVersion].sort((a, b) => b.value - a.value).slice(0, 15).map((r) => el("tr", {}, td(appById[r.app].name), td(r.key || "Unknown"), td(int(r.value), true))));
}

function scheduleLive() {
    clearTimeout(liveTimer);
    if (state.tab !== "live") return;
    liveTimer = setTimeout(async () => {
        if (state.tab !== "live") return;
        if (!document.hidden) {
            state.live = null;
            await load();
        }
        scheduleLive();
    }, 30000);
}

/* ---------- Summary strip (always last 30 days) ---------- */

let summaryLoaded = false;

async function loadSummary() {
    if (summaryLoaded) return;
    summaryLoaded = true;
    const s = await api(`/api/summary?app=${state.product}`, { quiet: true });
    if (!s) return;
    const box = document.getElementById("summary");
    const item = (label, value, sub, warn = false) => el("div", { class: `s-item${warn ? " s-warn" : ""}` },
        el("div", { class: "s-label" }, label), el("div", { class: "s-value" }, value), sub ? el("div", { class: "s-sub" }, sub) : null);
    const rev = s.revenue || {};
    const churn = s.churn?.avg_active ? s.churn.cancelled / s.churn.avg_active : null;
    const conv = s.funnel?.started ? s.funnel.purchased / s.funnel.started : null;
    const checkout = s.checkout?.opened ? s.checkout.paid / s.checkout.opened : null;
    // Сбор раз в сутки в GitHub Actions (и по кнопке Update now). MS Store — ручной CSV.
    const LIMITS = { paddle: 30, play: 30, appstore: 30, checkouts: 30, ga4: 30, funnel: 30, subs: 30, health: 30, aso: 30,
        ads_google: 30, ads_meta: 30, serp: 30 };
    const NAMES = { paddle: "Paddle", play: "Google Play", appstore: "App Store", checkouts: "Paddle checkouts", ga4: "GA4",
        funnel: "Funnel", subs: "Subscriptions", health: "Health", aso: "ASO", ads_google: "Google Ads spend", ads_meta: "Meta Ads spend",
        serp: "Google positions" };
    const warnings = [];
    for (const src of s.sources || []) {
        const hours = (Date.now() - Date.parse(src.updated_at)) / 3600000;
        if (LIMITS[src.name] && hours > LIMITS[src.name]) warnings.push(`${NAMES[src.name]}: not updated for ${hours < 48 ? `${Math.round(hours)} h` : `${Math.round(hours / 24)} days`}`);
        if (src.name === "msstore") {
            const age = (Date.now() - Date.parse(src.covered_to)) / 86400000;
            if (age > 10) warnings.push(`Microsoft Store: data until ${src.covered_to} — download a fresh Earnings CSV into docs/`);
        }
    }
    const change = rev.prev ? (rev.cur - rev.prev) / Math.abs(rev.prev) * 100 : null;
    box.replaceChildren(
        item("Net revenue, 30 days", usd(rev.cur || 0), change === null ? null : `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(0)}% vs previous 30`),
        item("MRR", usd(s.mrr?.mrr || 0), `${int(s.mrr?.active || 0)} paid subscriptions`),
        item("Monthly churn", churn === null ? "—" : pct(churn), "monthly plans"),
        item(`${product().funnel.start.replace(/^./, (c) => c.toUpperCase())} → purchase`, conv === null ? "—" : pct(conv, 2), `${product().name}, 30 days`),
        item("Paddle checkout → paid", checkout === null ? "—" : pct(checkout), `${int(s.checkout?.opened || 0)} checkouts opened`),
        item("Active right now", s.activeNow === null ? "—" : int(s.activeNow), s.activeNow === null && state.product === "captions" ? "not in GA4 realtime" : "last 30 minutes"),
        ...warnings.map((w) => item("Needs attention", w.split(":")[0], w.slice(w.indexOf(":") + 2), true)),
    );
    box.hidden = false;
}

/* ---------- Funnel: Paddle checkout ---------- */

const UPLIFT_LABELS = ["No tax on top", "Tax on top 1–10%", "Tax on top 10–20%", "Tax on top over 20%"];

function renderCheckout() {
    const { checkout, uplift, checkoutProducts } = state.funnel;
    const n = (status) => checkout.find((r) => r.status === status)?.n ?? 0;
    const opened = sum(checkout, (r) => r.n);
    const details = n("left_after_details") + n("paid");
    const paid = n("paid");
    draw("chart-checkout", {
        type: "bar",
        data: {
            labels: ["Opened checkout", "Entered details", "Paid"],
            datasets: [{ data: [opened, details, paid], backgroundColor: [css("--rank-3"), css("--rank-2"), css("--rank-1")], borderRadius: 4, maxBarThickness: 56 }],
        },
        options: {
            maintainAspectRatio: false,
            scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (c) => `${int(c.parsed.y)} · ${opened ? pct(c.parsed.y / opened) : ""} of opened` } },
            },
        },
    });
    table("tbl-checkout-uplift", [["Price at checkout"], ["Opened", 1], ["Left at first screen", 1], ["Paid", 1]],
        uplift.map((r) => el("tr", {}, td(UPLIFT_LABELS[r.bucket]), td(int(r.opened), true),
            td(pct(r.left_first / r.opened, 0), true), td(pct(r.paid / r.opened), true))));
    table("tbl-checkout-products", [["Product"], ["Opened", 1], ["Paid", 1], ["Conversion", 1], ["Avg. tax on top", 1]],
        checkoutProducts.map((r) => el("tr", {}, td(r.product), td(int(r.opened), true), td(int(r.paid), true),
            td(pct(r.paid / r.opened), true, r.opened >= 20 && r.paid / r.opened < 0.05 ? "down" : ""), td(`${r.uplift.toFixed(1)}%`, true))));
}

/* ---------- GA4 explorer ---------- */

state.ga4Sel = { range: "7d", app: "all", country: "all" };

function ga4Path() {
    const { range, app, country } = state.ga4Sel;
    const q = new URLSearchParams({ range, stream: app, country, app: state.product });
    return `/api/ga4?${q}`;
}

function ga4Label(t) {
    // dateHour = YYYYMMDDHH, date = YYYYMMDD (часовой пояс ресурса GA4)
    return t.length === 10 ? `${t.slice(8)}:00` : `${t.slice(4, 6)}-${t.slice(6)}`;
}

function renderGa4() {
    const g = state.ga4;
    const apps = APPS.filter((a) => g.series.some((r) => r.app === a.id));
    const times = [...new Set(g.series.map((r) => r.t))].sort();
    const val = (app, t, k) => g.series.find((r) => r.app === app && r.t === t)?.[k] ?? 0;
    const total = (k) => sum(g.series, (r) => r[k]);

    document.getElementById("ga4-note").textContent =
        `Straight from GA4 (cached 5 min, updated ${new Date(g.at).toLocaleTimeString("en-GB")}). Today's numbers keep filling in for a few hours. ` +
        (state.product === "captions"
            ? "Live Captions shares the Windows GA4 stream and is split out by its events, so new users show as 0 here (count them on the Sales tab). " +
              "No country in GA4 (shown as Unknown). Real money is on the Sales tab."
            : "GA4 purchases and revenue are overcounted: Android up to 1.0.37 re-sends purchases on every launch, iOS test (sandbox) renewals are counted, " +
              "Windows web checkouts are partly lost. Real money is on the Sales tab. Windows has no country in GA4 (shown as Unknown). " +
              "Windows new users here still include Live Captions installs: GA4 can't split first visits (the Sales tab subtracts them).");

    const countrySel = document.getElementById("ga4-country");
    const keep = state.ga4Sel.country;
    const isCode = (c) => /^[A-Z]{2}$/.test(c || "");
    const codes = g.countries.map((c) => c.code).filter(isCode);
    if (keep !== "all" && !codes.includes(keep)) codes.unshift(keep);
    countrySel.replaceChildren(el("option", { value: "all" }, "All countries"),
        ...codes.map((c) => el("option", { value: c }, `${countryName(c)} (${c})`)));
    countrySel.value = keep;

    renderTileRow("ga4-tiles", [
        { label: "Active users", value: sum(g.countries, (c) => c.active), fmt: int },
        { label: "New users", value: total("new"), fmt: int },
        { label: "Purchases (GA4)", value: total("purchases"), fmt: int },
        { label: "Revenue (GA4)", value: total("revenue"), fmt: usd, delta: el("span", { class: "muted" }, "overcounted") },
    ]);

    draw("chart-ga4-users", {
        type: "line",
        data: { labels: times.map(ga4Label), datasets: apps.map((a) => lineDataset(a.name, times.map((t) => val(a.id, t, "active")), appColor(a.id), true)) },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { precision: 0 } } },
            plugins: { legend },
        },
    });
    draw("chart-ga4-purchases", {
        type: "bar",
        data: {
            labels: times.map(ga4Label),
            datasets: apps.map((a) => ({
                label: a.name, data: times.map((t) => val(a.id, t, "purchases")), backgroundColor: appColor(a.id),
                borderColor: css("--surface-1"), borderWidth: { top: 2 }, borderRadius: 4, borderSkipped: "bottom", maxBarThickness: 22,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } },
            plugins: {
                legend,
                tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y} purchases, ${usd(val(apps[c.datasetIndex].id, times[c.dataIndex], "revenue"))}` } },
            },
        },
    });
    table("tbl-ga4-events", [["Event"], ["Users", 1], ["Count", 1]],
        g.events.map((e) => el("tr", {}, td(e.name), td(int(e.users), true), td(int(e.count), true))));
    table("tbl-ga4-countries", [["Country"], ["Active", 1], ["New", 1], ["Purchases", 1], ["Revenue", 1]],
        g.countries.map((c) => el("tr", { class: "clickable", onclick: () => setGa4({ country: isCode(c.code) ? c.code : "all" }) },
            td(isCode(c.code) ? withFlag(c.code, countryName(c.code)) : "Unknown (Windows / not set)"), td(int(c.active), true), td(int(c.new), true),
            td(int(c.purchases), true), td(usd(c.revenue), true))));
    table("tbl-ga4-sources", [["Source"], ["New users", 1], ["Purchases", 1]],
        g.sources.map((x) => el("tr", {}, td(x.source), td(int(x.new), true), td(int(x.purchases), true))));
    table("tbl-ga4-items", [["Item"], ["Units", 1], ["Revenue", 1]],
        g.items.map((x) => el("tr", {}, td(x.name), td(int(x.units), true), td(usd(x.revenue), true))),
        "No item data in GA4 for this filter");
}

function setGa4(change) {
    Object.assign(state.ga4Sel, change);
    for (const [k, v] of Object.entries(state.ga4Sel)) document.getElementById(`ga4-${k}`).value = v;
    state.ga4 = null;
    load();
}

for (const key of ["range", "app", "country"]) {
    document.getElementById(`ga4-${key}`).addEventListener("change", (e) => setGa4({ [key]: e.target.value }));
}

/* ---------- A/B tests ---------- */

// Тесты и их описание приходят из Worker'а (AB_TESTS в cloudflare/dash-api) — здесь только счёт и отрисовка
state.abSel = { test: null, app: "all" };
const ARM_COLOR = { A: "--series-1", B: "--series-3" };
const STORE_NAMES = { "android-host": "Google Play", "ios-host": "App Store" };
const AB_APP_NAMES = { all: "All platforms", android: "Android", apple: "iOS", windows: "Windows" };
const abPct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(v < 0.1 ? 2 : 1)}%` : "—");
const money = (v) => (Number.isFinite(v) ? `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(2)}` : "—");
const signedUsd = (v) => (Number.isFinite(v) ? `${v > 0 ? "+" : v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—");
const signedPct = (v) => (Number.isFinite(v) ? `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%` : "—");

// Φ(z), Абрамовиц–Стиган 7.1.26: точности 1e-7 для p-value хватает
function normCdf(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

// Две доли: z-тест с общей долей (p-value), P(B > A) — нормальное приближение апостериорной разницы
function abCompare(xa, na, xb, nb) {
    const pa = na ? xa / na : NaN;
    const pb = nb ? xb / nb : NaN;
    const pool = (xa + xb) / (na + nb);
    const se = Math.sqrt(pool * (1 - pool) * (1 / na + 1 / nb));
    const z = se ? (pb - pa) / se : 0;
    const seU = Math.sqrt(pa * (1 - pa) / na + pb * (1 - pb) / nb);
    return {
        pa, pb, lift: pa ? pb / pa - 1 : NaN,
        p: na && nb && se ? 2 * (1 - normCdf(Math.abs(z))) : NaN,
        probB: na && nb ? (seU ? normCdf((pb - pa) / seU) : pb > pa ? 1 : pb < pa ? 0 : 0.5) : NaN,
    };
}

// Пользователей на плечо, чтобы поймать изменение конверсии на rel (α = 0.05 двусторонний, мощность 80%)
function abSampleNeeded(p, rel = 0.2) {
    if (!(p > 0 && p < 1)) return NaN;
    const p2 = Math.min(p * (1 + rel), 0.999);
    return Math.ceil((1.96 + 0.8416) ** 2 * (p * (1 - p) + p2 * (1 - p2)) / (p2 - p) ** 2);
}

function abDays(t) {
    return dayDiff(t.start, t.end || isoDay(new Date())) + 1;
}

// Пользователи шага по плечу; шаг "a|b" — сумма событий (у теста установщика клик — это одно из двух)
function abUsers(t, arm, step, app = state.abSel.app, key = "users") {
    const events = step.split("|");
    return sum(t.rows.filter((r) => r.arm === arm && events.includes(r.event) && (app === "all" || r.app === app)), (r) => r[key]);
}

function abStats(t, app) {
    const first = t.steps[0][0];
    const n = { A: abUsers(t, "A", t.base, app), B: abUsers(t, "B", t.base, app) };
    const x = { A: abUsers(t, "A", t.goal, app), B: abUsers(t, "B", t.goal, app) };
    const entered = { A: abUsers(t, "A", first, app), B: abUsers(t, "B", first, app) };
    const cmp = abCompare(x.A, n.A, x.B, n.B);
    const need = abSampleNeeded(cmp.pa);
    const days = abDays(t);
    const srmZ = (entered.A - entered.B) / Math.sqrt(entered.A + entered.B || 1);
    const pace = (n.A + n.B) / 2 / days;
    return { n, x, entered, cmp, need, days, pace, money: abMoney(t, app, n, pace), srmP: 2 * (1 - normCdf(Math.abs(srmZ))) };
}

// Деньги на пользователя знаменателя. Покупка — транзакция (у Android без transaction_id — n покупок по средней цене),
// у не купивших 0. Сравнение средних — z-тест Уэлча по этим значениям; ДИ 95% — для разницы $ на пользователя
function abMoney(t, app, n, pace) {
    const arm = (a) => {
        const list = t.purchases.filter((p) => p.arm === a && (app === "all" || p.app === app));
        const rev = sum(list, (p) => p.value * p.n);
        const sq = sum(list, (p) => p.value * p.value * p.n);
        const count = sum(list, (p) => p.n);
        const mean = n[a] ? rev / n[a] : NaN;
        const v = n[a] ? Math.max(sq / n[a] - mean * mean, 0) / n[a] : NaN;
        return { rev, count, mean, v, avg: count ? rev / count : NaN };
    };
    const A = arm("A");
    const B = arm("B");
    const diff = B.mean - A.mean;
    const se = Math.sqrt(A.v + B.v);
    return {
        A, B, diff, lift: A.mean ? B.mean / A.mean - 1 : NaN,
        p: se ? 2 * (1 - normCdf(Math.abs(diff / se))) : NaN,
        probB: se ? normCdf(diff / se) : NaN,
        lo: diff - 1.96 * se, hi: diff + 1.96 * se,
        // если оставить B всем: разница на пользователя × сколько людей за 30 дней доходит до знаменателя (оба плеча)
        monthly: diff * pace * 2 * 30,
        lost: sum(t.purchases.filter((p) => !p.arm && (app === "all" || p.app === app)), (p) => p.value * p.n),
        noTxn: t.purchases.some((p) => p.tx === false && (app === "all" || p.app === app)),
    };
}

// Реальные деньги: установки из бэкенда, выплаты Paddle (tools/dash/sources/abserver.py). Знаменатель — все новые
// установки плеча за окно теста, у не купивших $0. Уверенность (p, интервалы, SRM, победа по договору) считает
// Worker — abConfidence в cloudflare/dash-api, поле stats; здесь только суммы для показа
const abServerCache = new WeakMap();

function abServer(t) {
    if (!t.server || !t.stats) return null;
    if (abServerCache.has(t)) return abServerCache.get(t);
    const out = abServerCalc(t);
    abServerCache.set(t, out);
    return out;
}

function abServerCalc(t) {
    const st = t.stats;
    const num = (v) => v ?? NaN;
    const get = (arm, metric, key = "") => t.server.find((r) => r.arm === arm && r.metric === metric && r.key === key)?.value || 0;
    const arm = (a) => {
        const n = get(a, "users");
        const net = get(a, "net");
        const mean = n ? net / n : NaN;
        const v = n ? Math.max(get(a, "net_sq") / n - mean * mean, 0) / n : NaN;
        return { n, net, mean, v, buyers: get(a, "buyers"), purchases: get(a, "purchases"), avg: get(a, "purchases") ? net / get(a, "purchases") : NaN };
    };
    const A = arm("A");
    const B = arm("B");
    const days = st.contract.days;
    const products = new Map();
    for (const r of t.server.filter((x) => x.metric === "product_net" || x.metric === "product_n")) {
        const row = products.get(r.key) || { A: { n: 0, net: 0 }, B: { n: 0, net: 0 } };
        row[r.arm][r.metric === "product_n" ? "n" : "net"] = r.value;
        products.set(r.key, row);
    }
    const diff = num(st.diff);
    return {
        A, B, diff, days, products,
        lift: num(st.delta), liftLo: num(st.ci_low), liftHi: num(st.ci_high),
        p: num(st.p_revenue),
        probB: num(st.prob_b_better),
        lo: num(st.diff_low), hi: num(st.diff_high),
        conv: { ...abCompare(A.buyers, A.n, B.buyers, B.n), p: num(st.p_conv) },
        contract: st.contract, contractWin: st.contract_win, daysLeft: num(st.days_left), srm: st.srm,
        // если раскатить B: разница на установку × новые установки за 30 дней в темпе окна теста
        monthly: diff * ((A.n + B.n) / days) * 30,
        outside: get("", "outside_net"),
        // Android Pro Weekly (abplay.py): знаменатель — видевшие пейволл, деньги — заказы Play, сшитые с событиями GA4
        play: t.server.some((x) => x.metric === "unit" && x.key === "paywall_android"),
        // Мобильные покупки, привязанные к установке (abmobile.py): платформы из строк source, деньги из сторов
        stores: t.server.filter((x) => x.metric === "source" && x.key.startsWith("store_orders:")).map((x) => x.key.split(":")[1]),
        unattributed: sum(t.server.filter((x) => x.metric === "unattributed_net"), (x) => x.value),
        fake: { A: get("A", "fake_purchases"), B: get("B", "fake_purchases") },
        need: abMoneyNeed(A, B),
        computed: t.server.find((x) => x.metric === "computed")?.key || "",
        fewBuyers: Math.min(A.buyers, B.buyers) < st.contract.min_buyers,
        series: ["A", "B"].map((a) => t.server.filter((r) => r.arm === a && (r.metric === "day_users" || r.metric === "day_net"))),
    };
}

// Сколько установок на плечо нужно, чтобы различить ±20% денег на установку (α 0.05, мощность 80%)
function abMoneyNeed(A, B) {
    const sd2 = ((A.v * A.n) + (B.v * B.n)) / 2;
    const delta = 0.2 * A.mean;
    return delta > 0 && sd2 > 0 ? Math.ceil(2 * (1.96 + 0.8416) ** 2 * sd2 / (delta * delta)) : NaN;
}

// Окно теста задаётся в двух местах (AB_TESTS Worker'а и TESTS сборщика) — расхождение видно сразу
function winMismatch(t) {
    const key = t.server?.find((r) => r.metric === "window")?.key;
    // У мобильных денег окно начинается с выхода версии, привязывающей покупку к установке, — позже начала теста
    if (!key || t.server.some((r) => r.metric === "source")) return "";
    const [from, to] = key.split("..");
    const expectTo = t.end || isoDay(new Date());
    return from !== t.start || (t.end && to !== expectTo) ? key : "";
}

// Победа по договору LS-01 (п. 3.2): условия и что из них ещё не выполнено — Worker отдаёт список в contract.missing
function abContractLine(t, r) {
    const c = r.contract;
    if (r.contractWin) {
        return { cls: "up", text: `Contract LS-01: B wins — ${signedPct(r.lift)} net per install (95%: ${signedPct(r.liftLo)} … ${signedPct(r.liftHi)}), p = ${r.p.toFixed(3)}, ${c.days} days.` };
    }
    const pLeft = r.daysLeft > 0 ? `, ~${int(r.daysLeft)} more days at the current difference` : "";
    const needs = {
        exact_money: "exact store money (Play numbers here are an estimate)",
        delta: `net per user B vs A ≥ ${signedPct(c.min_delta)} (now ${signedPct(r.lift)})`,
        p_value: `p < ${c.alpha} (now ${Number.isFinite(r.p) ? r.p.toFixed(3) : "—"}${pLeft})`,
        days: `${c.min_days}+ days (now ${c.days})`,
        buyers: `${c.min_buyers}+ buyers per arm (now ${int(r.A.buyers)} / ${int(r.B.buyers)})`,
    };
    const list = c.missing.map((k) => needs[k]).join("; ");
    return { cls: "muted", text: `Contract LS-01: ${t.status === "ended" ? "no win" : "not a win yet"} — needs ${list}.` };
}

function renderAbReal(t) {
    const card = document.getElementById("ab-real");
    const r = abServer(t);
    card.hidden = !r;
    if (!r) return;
    const sig = r.p < 0.05 && !r.fewBuyers;
    const tone = sig ? (r.diff > 0 ? "up" : "down") : "muted";
    const enough = Math.min(r.A.n, r.B.n) >= r.need;
    const pace = (r.A.n + r.B.n) / 2 / r.days;
    const eta = pace > 0 ? Math.ceil(Math.max(0, r.need - Math.min(r.A.n, r.B.n)) / pace) : Infinity;
    const per = r.play ? "paywall viewer" : "install";
    const head = sig && enough ? `B ${r.diff > 0 ? "earns more" : "earns less"}: ${signedPct(r.lift)} per ${per} — proven.`
        : sig ? `B ${r.diff > 0 ? "earns more" : "earns less"} (${signedPct(r.lift)}), significant but below the planned sample.`
        : r.fewBuyers ? `Too few buyers to judge yet (${int(r.A.buyers)} / ${int(r.B.buyers)}, need ${r.contract.min_buyers}+ in each arm).`
        : "No proven difference in real money.";
    document.getElementById("ab-real-head").replaceChildren(el("span", { class: sig ? tone : "" }, head));
    const contract = abContractLine(t, r);
    document.getElementById("ab-real-contract").replaceChildren(el("span", { class: contract.cls }, contract.text));
    renderTileRow("ab-real-tiles", [
        { label: r.play ? "Saw paywall (Android) · A / B" : "New installs · A / B", value: r.A.n + r.B.n, fmt: int,
          delta: el("span", { class: r.srm.alarm ? "down" : "muted" }, `${int(r.A.n)} / ${int(r.B.n)}${r.srm.alarm ? " · split is off 50/50, check the assignment" : ""}`) },
        { label: "Net revenue · A / B", value: r.B.net, fmt: (v) => `${usd(r.A.net)} / ${usd(v)}`,
          delta: el("span", { class: "muted" }, `${int(r.A.purchases)} / ${int(r.B.purchases)} payments`) },
        { label: `Per ${per} · A → B`, value: r.B.mean || 0, fmt: (v) => `${money(r.A.mean)} → ${money(v)}`,
          delta: el("span", { class: tone }, `${signedPct(r.lift)} (95%: ${signedPct(r.liftLo)} … ${signedPct(r.liftHi)}) · ` +
              (r.fewBuyers ? "too few buyers" : `p = ${Number.isFinite(r.p) ? r.p.toFixed(3) : "—"}`)) },
        { label: "Buyers · A → B", value: (r.conv.pb || 0) * 100, fmt: (v) => `${abPct(r.conv.pa)} → ${v.toFixed(2)}%`,
          delta: el("span", { class: r.conv.p < 0.05 ? (r.conv.lift > 0 ? "up" : "down") : "muted" },
              `${int(r.A.buyers)} / ${int(r.B.buyers)} people · p = ${Number.isFinite(r.conv.p) ? r.conv.p.toFixed(3) : "—"}`) },
        { label: "Chance B earns more", value: (r.probB || 0) * 100, fmt: (v) => `${v.toFixed(0)}%`,
          delta: el("span", { class: "muted" }, `B − A, 95%: ${money(r.lo)} … ${money(r.hi)} per ${per}`) },
        { label: "If B for everyone", value: r.monthly || 0, fmt: (v) => `${signedUsd(v)}/mo`,
          delta: el("span", { class: "muted" }, sig ? `net, at the current ${per}s` : `net, at the current ${per}s · not proven`) },
    ]);
    document.getElementById("ab-real-plan").textContent = Number.isFinite(r.need)
        ? `To tell a ±20% difference in money per ${per}: ~${int(r.need)} ${per}s per arm, now ${int(Math.min(r.A.n, r.B.n))}` +
          (enough ? " — reached." : t.status === "ended" ? " — the test ended before that." : ` — about ${Number.isFinite(eta) ? eta : "∞"} more days at the current pace.`)
        : "";

    const share = (v, total) => (total ? `${Math.round((v / total) * 100)}%` : "—");
    table("tbl-ab-real-products", [["Plan"], ["A payments", 1], ["A net", 1], ["A share", 1], ["B payments", 1], ["B net", 1], ["B share", 1]],
        [...r.products].sort((a, b) => (b[1].A.net + b[1].B.net) - (a[1].A.net + a[1].B.net)).map(([name, x]) => el("tr", {},
            td(name), td(int(x.A.n), true), td(usd(x.A.net), true), td(share(x.A.net, r.A.net), true),
            td(int(x.B.n), true), td(usd(x.B.net), true), td(share(x.B.net, r.B.net), true))), "No payments yet");

    // Накопленные $ на установку по дням
    const days = [];
    const win = t.server.find((x) => x.metric === "window")?.key.split("..") || [t.start, isoDay(new Date())];
    for (let d = win[0]; d <= isoDay(new Date()); d = shiftDay(d, 1)) days.push(d);
    draw("chart-ab-real", {
        type: "line",
        data: {
            labels: days.map((d) => d.slice(5)),
            datasets: ["A", "B"].map((a, i) => {
                const rows = r.series[i];
                let users = 0;
                let net = 0;
                const data = days.map((d) => {
                    users += rows.find((x) => x.metric === "day_users" && x.key === d)?.value || 0;
                    net += rows.find((x) => x.metric === "day_net" && x.key === d)?.value || 0;
                    return users ? net / users : null;
                });
                return { ...lineDataset(`${a} · ${t.arms[a]}`, data, css(ARM_COLOR[a])), tension: 0 };
            }),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { callback: (v) => `$${v.toFixed(2)}` } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: $${c.parsed.y?.toFixed(3)} per ${per}` } } },
        },
    });
    document.getElementById("ab-real-title").textContent = r.play ? "Real money · Google Play orders (estimate)"
        : r.stores.length ? `Real money · backend + ${r.stores.map((p) => STORE_NAMES[p] || p).join(" + ")}` : "Real money · backend + Paddle";
    const ageH = r.computed ? (Date.now() - Date.parse(r.computed.replace("Z", ":00Z"))) / 3600000 : Infinity;
    const fresh = document.getElementById("ab-real-fresh");
    fresh.className = ageH > 36 ? "down" : "muted";
    fresh.textContent = r.computed
        ? `computed ${r.computed.slice(0, 10)} ${r.computed.slice(11, 16)} UTC${ageH > 36 ? " — stale, the daily collection isn't updating it" : ""}`
        : "computed: unknown";
    document.getElementById("ab-real-chart-title").textContent = `Net $ per ${per}, cumulative`;
    document.getElementById("ab-real-note").textContent = r.play
        ? "Android only. Who is in the test: people who saw the paywall in each arm (GA4). Money: Google Play sales report, net estimated as 85% of the price, " +
          "renewals and refunds follow the first order. A GA4 purchase counts only if Play has an order for the same product from the same country within 10 minutes — " +
          `the rest are fake purchases from cracked apps or billing spoofers (A ${int(r.fake.A)}, B ${int(r.fake.B)}), not counted. One buyer = one first order. iOS isn't included. Updated daily.`
        : r.stores.length
        ? `${r.stores.map((p) => STORE_NAMES[p] || p).join(" and ")}. Who is in the test: every new install of these platforms since the app version that ties a purchase to the install ` +
          "(Android 1.0.61, iOS 1.6.10), from backend trial records, split by the same fingerprint hash as the app. " +
          "Money: Google Play — developer payout after Google's fee from the Orders API; App Store — price from App Store server notifications × the payout share for that currency in the App Store sales report. " +
          "Renewals follow the first purchase, refunds count as $0. Only real store orders — fake purchases from cracked apps never get here. " +
          `Store purchases not tied to an install (older app versions): ${usd(r.unattributed)}; from people who are not new installs of the window: ${usd(r.outside)} — in neither arm. Updated daily.`
        : "Who is in the test: every new install of the platform in the test window (backend trial records), split by the same fingerprint hash as the app — " +
        "whether or not they reached the paywall, so nothing can be cherry-picked. Money: Paddle payouts after fees and tax, minus refunds, " +
        "from the test start to today (renewals included). Microsoft Store purchases aren't in the backend and are not counted — on Windows almost all payments go through Paddle, " +
        "except RU and BY, where the Store is the main button (both arms alike, but a plan that sells better through the Store is undercounted there). " +
        `Payments from people who are not new installs of the test window: ${usd(r.outside)} (not in either arm). Updated daily with the dashboard collection.` +
        (winMismatch(t) ? ` ⚠ The collector's window (${winMismatch(t)}) differs from this test's dates — update TESTS in tools/dash/sources/abserver.py.` : "");
}

function stepLabel(t, event) {
    return t.steps.find(([e]) => e === event)?.[1] || event;
}

// Заголовок + строки пояснения. Решение принимается по конверсии (у неё есть p-value), выручка — проверка, что B
// не перетягивает покупателей на дешёвый план: если они расходятся, это пишется отдельной строкой
function abVerdict(t, s) {
    const { cmp, n, need } = s;
    const better = cmp.pb > cmp.pa ? "B" : "A";
    const what = `${stepLabel(t, t.goal)} / ${stepLabel(t, t.base).toLowerCase()}`;
    const lines = [`${what}: A ${abPct(cmp.pa)} vs B ${abPct(cmp.pb)}, ${signedPct(cmp.lift)} (p = ${Number.isFinite(cmp.p) ? cmp.p.toFixed(3) : "—"}, P(B better) ${abPct(cmp.probB)}).`];
    const m = s.money;
    const real = abServer(t);
    if (real) {
        lines.push(`Real money per ${real.play ? "paywall viewer (Play orders)" : "new install (backend + Paddle)"}: A ${money(real.A.mean)} vs B ${money(real.B.mean)}, ${signedPct(real.lift)} ` +
            (real.fewBuyers ? `(too few buyers to judge: ${int(real.A.buyers)} / ${int(real.B.buyers)}).`
                : `(p = ${Number.isFinite(real.p) ? real.p.toFixed(3) : "—"}, P(B earns more) ${abPct(real.probB)}).`));
    } else if (m.A.rev || m.B.rev) {
        const diverge = Number.isFinite(cmp.lift) && Number.isFinite(m.lift) && Math.sign(cmp.lift) !== Math.sign(m.lift) && Math.abs(m.lift) >= 0.05;
        lines.push(`Money per ${stepLabel(t, t.base).toLowerCase()} user in GA4 (rough): A ${money(m.A.mean)} vs B ${money(m.B.mean)}, ${signedPct(m.lift)}.` +
            (diverge ? ` Conversion and money point in opposite directions — ${cmp.lift > 0 ? "more people buy in B, but cheaper plans" : "fewer people buy in B, but bigger plans"}.` : ""));
    }
    if (t.status === "ended") {
        return { cls: "", head: `Ended ${t.end}. ${t.winner ? `Rolled out ${t.winner}: ${t.arms[t.winner]}.` : "No winner rolled out."}`, lines };
    }
    if (!n.A || !n.B) return { cls: "", head: real ? "No GA4 data for this test — see real money below." : "No users in the test yet.", lines };
    const enough = Math.min(n.A, n.B) >= need;
    const left = Math.max(0, need - Math.min(n.A, n.B));
    const eta = s.pace > 0 ? Math.ceil(left / s.pace) : Infinity;
    lines.push(Number.isFinite(need)
        ? `To detect a ±20% change in conversion: ~${int(need)} users per arm, now ${int(Math.min(n.A, n.B))}` +
          (enough ? " — reached." : ` — about ${Number.isFinite(eta) ? `${eta} more days` : "forever"} at the current pace.`)
        : "No conversions yet, so the required sample can't be estimated.");
    if (cmp.p < 0.05 && enough) return { cls: better === "B" ? "up" : "down", head: `${better} wins: ${t.arms[better]}.`, lines };
    if (cmp.p < 0.05) return { cls: "", head: `Leaning ${better}, but the planned sample isn't reached — keep it running.`, lines };
    return { cls: "", head: "No significant difference yet.", lines };
}

function abTestApps(t) {
    return [...new Set(t.rows.map((r) => r.app))].filter(Boolean);
}

function renderAb() {
    const d = state.ab;
    const tests = d.tests;
    document.getElementById("ab-note").textContent = tests.length
        ? `from GA4, cached 5 min, updated ${new Date(d.at).toLocaleTimeString("en-GB")}` : "";
    if (!tests.some((t) => t.id === state.abSel.test)) state.abSel.test = (tests.find((t) => t.status === "running") || tests[0])?.id;

    // Сводка в ширину экрана: по каждому тесту конверсия и деньги рядом, A → B и прирост с p в одной ячейке
    const liftCell = (lift, p, show = true) => td(show ? `${signedPct(lift)} · ${Number.isFinite(p) ? `p ${p.toFixed(2)}` : "rough"}` : "—", true,
        show && p < 0.05 ? (lift > 0 ? "up" : "down") : "");
    table("tbl-ab-tests", [["Test"], ["Status"], ["In test A / B", 1], ["Main metric"], ["A → B", 1], ["B vs A", 1], ["$ per user A → B", 1], ["$ B vs A", 1]],
        tests.map((t) => {
            const s = abStats(t, "all");
            const real = abServer(t);
            const hasMoney = !!(real || s.money.A.rev || s.money.B.rev);
            const m = real ? { a: real.A.mean, b: real.B.mean, lift: real.lift, p: real.fewBuyers ? NaN : real.p } : { a: s.money.A.mean, b: s.money.B.mean, lift: s.money.lift, p: NaN };
            const status = t.status === "ended" ? `Ended · ${t.winner || "—"} rolled out` : `Running · ${s.days} d`;
            return el("tr", { class: `clickable${t.id === state.abSel.test ? " active" : ""}`, onclick: () => setAb({ test: t.id, app: "all" }) },
                td([t.name, el("span", { class: "muted small" }, ` · ${t.app}`)]), td(status), td(`${int(s.entered.A)} / ${int(s.entered.B)}`, true),
                td(`${stepLabel(t, t.goal)} / ${stepLabel(t, t.base).toLowerCase()}`), td(`${abPct(s.cmp.pa)} → ${abPct(s.cmp.pb)}`, true),
                liftCell(s.cmp.lift, s.cmp.p),
                td(hasMoney ? [`${money(m.a)} → ${money(m.b)}`, el("span", { class: "muted small" }, real ? " real" : " GA4")] : "no purchases", true),
                liftCell(m.lift, m.p, hasMoney));
        }), state.product === "captions" ? "No A/B tests in Live Captions" : "No tests");
    table("tbl-ab-archive", [["Test"], ["App"], ["Ran"], ["Result"]],
        d.archive.map((a) => el("tr", {}, td(a.name), td(a.app), td(`${a.start} — ${a.end}`), td(a.result))), "—");

    const detail = ["ab-test", "ab-about", "ab-tiles", "ab-verdict"].map((id) => document.getElementById(id));
    const t = tests.find((x) => x.id === state.abSel.test);
    for (const node of detail) node.hidden = !t;
    for (const id of ["tbl-ab-funnel", "chart-ab-conv", "chart-ab-base"]) document.getElementById(id).closest(".card").hidden = !t;
    for (const id of ["ab-real", "ab-money", "ab-app"]) if (!t) document.getElementById(id).hidden = true;
    if (!t) return;

    const testSel = document.getElementById("ab-test");
    testSel.replaceChildren(...tests.map((x) => el("option", { value: x.id }, `${x.name}${x.status === "ended" ? " (ended)" : ""}`)));
    testSel.value = t.id;
    const apps = abTestApps(t);
    const appSel = document.getElementById("ab-app");
    appSel.hidden = apps.length < 2;
    appSel.replaceChildren(...["all", ...apps].map((a) => el("option", { value: a }, AB_APP_NAMES[a] || a)));
    if (state.abSel.app !== "all" && !apps.includes(state.abSel.app)) state.abSel.app = "all";
    appSel.value = state.abSel.app;

    const s = abStats(t, state.abSel.app);
    renderAbReal(t);
    document.getElementById("ab-about").textContent =
        `${t.about} A: ${t.arms.A}. B: ${t.arms.B}. Since ${t.start}${t.end ? ` to ${t.end}` : ""} (${s.days} days).` +
        (t.error ? ` ⚠ ${t.error} — funnel and GA4 money are empty.` : "");

    const srmBad = t.srm !== false && s.srmP < 0.001;
    const convLabel = `${stepLabel(t, t.goal).toLowerCase()} / ${stepLabel(t, t.base).toLowerCase()}`;
    const sig = s.cmp.p < 0.05;
    renderTileRow("ab-tiles", [
        { label: "In test · A / B", value: s.entered.A + s.entered.B, fmt: int,
          delta: el("span", { class: srmBad ? "down" : "muted" }, `${int(s.entered.A)} / ${int(s.entered.B)}${srmBad ? " · split is off 50/50, check the assignment" : ""}`) },
        { label: `A · ${convLabel}`, value: s.cmp.pa * 100 || 0, fmt: (v) => `${v.toFixed(2)}%`,
          delta: el("span", { class: "muted" }, `${int(s.x.A)} of ${int(s.n.A)}`) },
        { label: `B · ${convLabel}`, value: s.cmp.pb * 100 || 0, fmt: (v) => `${v.toFixed(2)}%`,
          delta: el("span", { class: "muted" }, `${int(s.x.B)} of ${int(s.n.B)}`) },
        { label: "Conversion, B vs A", value: (s.cmp.lift || 0) * 100, fmt: (v) => signedPct(v / 100),
          delta: el("span", { class: sig ? (s.cmp.lift > 0 ? "up" : "down") : "muted" },
              `p = ${Number.isFinite(s.cmp.p) ? s.cmp.p.toFixed(3) : "—"} · P(B better) ${abPct(s.cmp.probB)}`) },
    ]);

    const v = abVerdict(t, s);
    // Покупатели без плеча: если их заметная доля, сравнение плеч опирается на неполные данные — показываем красным
    const lost = t.dim.startsWith("customUser:")
        ? sum(t.unassigned.filter((r) => r.event === t.goal && (state.abSel.app === "all" || r.app === state.abSel.app)), (r) => r.users) : 0;
    const lostShare = lost / (lost + s.x.A + s.x.B || 1);
    const verdict = document.getElementById("ab-verdict");
    verdict.className = "card verdict";
    verdict.replaceChildren(el("h2", { class: v.cls }, v.head), ...v.lines.map((line) => el("p", {}, line)),
        lost ? el("p", { class: lostShare > 0.2 ? "down" : "muted" },
            `${int(lost)} of ${int(lost + s.x.A + s.x.B)} users with “${stepLabel(t, t.goal).toLowerCase()}” on these platforms have no arm and are left out ` +
            "(older app versions, or purchases GA4 didn't tie to the user's arm).") : "");

    const first = { A: s.entered.A, B: s.entered.B };
    renderAbMoney(t, s);

    const ofFirst = `% of ${t.steps[0][1].toLowerCase()}`;
    table("tbl-ab-funnel", [["Step"], ["A users", 1], [`A ${ofFirst}`, 1], ["B users", 1], [`B ${ofFirst}`, 1], ["B vs A", 1], ["p", 1]],
        t.steps.map(([event, label], i) => {
            const a = abUsers(t, "A", event);
            const b = abUsers(t, "B", event);
            const c = abCompare(a, first.A, b, first.B);
            const sig = i > 0 && c.p < 0.05;
            return el("tr", {}, td(label), td(int(a), true), td(i ? abPct(c.pa) : "100%", true), td(int(b), true), td(i ? abPct(c.pb) : "100%", true),
                td(i ? signedPct(c.lift) : "", true, sig ? (c.lift > 0 ? "up" : "down") : ""), td(i && Number.isFinite(c.p) ? c.p.toFixed(3) : "", true));
        }));

    // Накопленная конверсия по дням: дневные уникальные пользователи суммируются, повторы между днями считаются дважды
    const inApp = (r) => state.abSel.app === "all" || r.app === state.abSel.app;
    const baseEvents = t.base.split("|");
    const dates = [];
    for (let day = t.start; day <= (t.end || isoDay(new Date())); day = shiftDay(day, 1)) dates.push(day.replaceAll("-", ""));
    const perDay = (arm, events) => dates.map((dt) => sum(t.daily.filter((r) => r.date === dt && r.arm === arm && events.includes(r.event) && inApp(r)), (r) => r.users));
    const running = (arr) => arr.reduce((acc, x, i) => (acc.push((acc[i - 1] || 0) + x), acc), []);
    const labels = dates.map((dt) => `${dt.slice(4, 6)}-${dt.slice(6)}`);
    const series = Object.fromEntries(["A", "B"].map((arm) => [arm, { base: perDay(arm, baseEvents), goal: perDay(arm, [t.goal]) }]));
    document.getElementById("ab-conv-title").textContent = `${stepLabel(t, t.goal)} / ${stepLabel(t, t.base).toLowerCase()}, cumulative`;
    document.getElementById("ab-base-title").textContent = `${stepLabel(t, t.base)} per day`;
    draw("chart-ab-conv", {
        type: "line",
        data: {
            labels,
            datasets: ["A", "B"].map((arm) => {
                const cb = running(series[arm].base);
                const cg = running(series[arm].goal);
                // Без сглаживания: сплайн между точками рисует конверсию, которой не было
                return { ...lineDataset(`${arm} · ${t.arms[arm]}`, cb.map((n, i) => (n ? (cg[i] / n) * 100 : null)), css(ARM_COLOR[arm])), tension: 0 };
            }),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { callback: (x) => `${x}%` } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y?.toFixed(2)}%` } } },
        },
    });
    draw("chart-ab-base", {
        type: "bar",
        data: {
            labels,
            datasets: ["A", "B"].map((arm) => ({
                label: arm, data: series[arm].base, backgroundColor: css(ARM_COLOR[arm]), borderRadius: 4, maxBarThickness: 18,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { beginAtZero: true, ticks: { precision: 0 } } },
            plugins: { legend },
        },
    });
}

function renderAbMoney(t, s) {
    const m = s.money;
    const card = document.getElementById("ab-money");
    card.hidden = false;
    const empty = !(m.A.rev || m.B.rev);
    for (const id of ["ab-money-tiles", "tbl-ab-products"]) document.getElementById(id).hidden = empty;
    if (empty) {
        // Деньги сравниваются в каждом тесте; нет покупок с плечом — так и пишем, а не прячем блок
        document.getElementById("ab-money-verdict").replaceChildren(el("span", { class: "muted" },
            "No purchases tied to an arm yet, so money can't be compared."));
        document.getElementById("ab-money-note").textContent = "";
        return;
    }
    const per = stepLabel(t, t.base).toLowerCase();
    // GA4 не отдаёт деньги по людям: несколько покупок одного человека считаются как разные люди, разброс занижен,
    // p слишком оптимистичен. Поэтому по GA4 «доказано» не пишем никогда — для этого блок реальных денег
    const sig = false;
    const tone = sig ? (m.diff > 0 ? "up" : "down") : "muted";
    renderTileRow("ab-money-tiles", [
        { label: "A · revenue", value: m.A.rev, fmt: usd, delta: el("span", { class: "muted" }, `${int(m.A.count)} purchases · avg ${money(m.A.avg)}`) },
        { label: "B · revenue", value: m.B.rev, fmt: usd, delta: el("span", { class: "muted" }, `${int(m.B.count)} purchases · avg ${money(m.B.avg)}`) },
        { label: `Per ${per} user · A → B`, value: m.B.mean || 0, fmt: (v) => `${money(m.A.mean)} → ${money(v)}`,
          delta: el("span", { class: tone }, `${signedPct(m.lift)} · p = ${Number.isFinite(m.p) ? m.p.toFixed(3) : "—"}`) },
        { label: "Chance B earns more", value: (m.probB || 0) * 100, fmt: (v) => `${v.toFixed(0)}%`,
          delta: el("span", { class: "muted" }, `B − A, 95%: ${money(m.lo)} … ${money(m.hi)} per user`) },
        { label: "If B for everyone", value: m.monthly || 0, fmt: (v) => `${signedUsd(v)}/mo`,
          delta: el("span", { class: "muted" }, sig ? "at the current traffic" : "at the current traffic · not proven yet") },
    ]);
    document.getElementById("ab-money-verdict").replaceChildren(el("span", { class: tone },
        sig ? `B ${m.diff > 0 ? "earns more" : "earns less"}: ${signedPct(m.lift)} per user, the difference is real (p = ${m.p.toFixed(3)}).`
            : m.p < 0.05 ? `B looks like it earns ${m.diff > 0 ? "more" : "less"} (${signedPct(m.lift)}), but GA4 can't prove it: repeat purchases of one buyer count as separate people, so its p (${m.p.toFixed(3)}) is too optimistic${m.noTxn ? ", and Android re-sent purchases count twice" : ""}. Check real money or the store console.`
            : `No proven difference in money yet: B − A is somewhere between ${money(m.lo)} and ${money(m.hi)} per ${per} user, so either arm can still win.`));

    // Что покупают: планы по плечам — видно, перетягивает ли B покупателей на дешёвый или дорогой план
    const inApp = (p) => state.abSel.app === "all" || p.app === state.abSel.app;
    const plans = new Map();
    for (const p of t.purchases.filter((x) => x.arm && inApp(x))) {
        const row = plans.get(p.product) || { A: { n: 0, rev: 0 }, B: { n: 0, rev: 0 } };
        row[p.arm].n += p.n;
        row[p.arm].rev += p.value * p.n;
        plans.set(p.product, row);
    }
    const share = (v, total) => (total ? `${Math.round((v / total) * 100)}%` : "—");
    table("tbl-ab-products", [["Plan"], ["A buys", 1], ["A $", 1], ["A share of $", 1], ["B buys", 1], ["B $", 1], ["B share of $", 1]],
        [...plans].sort((a, b) => (b[1].A.rev + b[1].B.rev) - (a[1].A.rev + a[1].B.rev)).map(([name, r]) => el("tr", {},
            td(name || "(no product id)"), td(int(r.A.n), true), td(usd(r.A.rev), true), td(share(r.A.rev, m.A.rev), true),
            td(int(r.B.n), true), td(usd(r.B.rev), true), td(share(r.B.rev, m.B.rev), true))), "No purchases yet");
    document.getElementById("ab-money-note").textContent =
        "GA4 purchase events, one per transaction (re-sent duplicates dropped); everyone in the arm who didn't buy counts as $0. " +
        "Includes web checkouts (Paddle) that GA4 tied to the arm. " +
        (m.noTxn ? "Android sends no transaction id, so a re-sent purchase there counts twice, and iOS sandbox purchases are included — treat mobile money as rough. " : "") +
        (m.lost ? `${usd(m.lost)} of purchases on these platforms have no arm and are in neither column.` : "");
}

function setAb(change) {
    Object.assign(state.abSel, change);
    renderAb();
}

document.getElementById("ab-test").addEventListener("change", (e) => setAb({ test: e.target.value, app: "all" }));
document.getElementById("ab-app").addEventListener("change", (e) => setAb({ app: e.target.value }));

/* ---------- Weekly ---------- */

function renderWeekly() {
    const w = state.weekly;
    const weeks = [...new Set(w.sales.map((r) => r.week))].sort().slice(-12);
    const current = shiftDay(isoDay(new Date()), -((new Date().getUTCDay() + 6) % 7));
    const at = (rows, week, f, filter = () => true) => sum(rows.filter((r) => r.week === week && filter(r)), f);

    draw("chart-weekly", {
        type: "bar",
        data: {
            labels: weeks.map((x) => (x === current ? `${x} (now)` : x)),
            datasets: PLATFORMS.map((p) => ({
                label: p.name, data: weeks.map((wk) => at(w.sales, wk, (r) => r.net, (r) => r.platform === p.id)),
                backgroundColor: color(p.id), borderColor: css("--surface-1"), borderWidth: { top: 2 },
                borderRadius: 4, borderSkipped: "bottom", maxBarThickness: 36,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, ticks: { callback: (v) => usd(v) } } },
            plugins: { legend, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${usd(c.parsed.y)}`,
                footer: (items) => `Total: ${usd(items.reduce((a, i) => a + i.parsed.y, 0))}` } } },
        },
    });

    const coveredTo = (name) => w.sources.find((s) => s.name === name)?.covered_to;
    const funnelRate = (wk, app, num, den) => {
        const a = w.funnel.find((r) => r.week === wk && r.app === app && r.step === den)?.users;
        const b = w.funnel.find((r) => r.week === wk && r.app === app && r.step === num)?.users;
        return a ? b / a : null;
    };
    // MRR на конец недели: у площадки, чья статистика ещё не пришла (Play), берём последнее известное
    const mrrAt = (wk, key) => sum(PLATFORMS, (p) => {
        const rows = w.mrr.filter((r) => r.platform === p.id && r.week <= wk).sort((a, b) => a.week.localeCompare(b.week));
        return rows.length ? rows[rows.length - 1][key] : 0;
    });
    const checkoutRate = (wk) => {
        const c = w.checkouts.find((r) => r.week === wk);
        return c && c.opened ? c.paid / c.opened : null;
    };
    const money = (v) => usd(v);
    const count = (v) => int(v);
    const share = (v) => (v === null ? "—" : pct(v, 1));
    const gaApps = productApps().filter((a) => a.id !== "mac");
    const marks = product().funnel;
    const start = marks.start.replace(/^./, (ch) => ch.toUpperCase());
    const ROWS = [
        { group: "Money" },
        { label: "Net revenue, all stores", value: (wk) => at(w.sales, wk, (r) => r.net), fmt: money },
        // неделя после последнего дня с данными площадки (выгрузка MS Store) — прочерк, а не ложный ноль
        ...PLATFORMS.map((p) => ({ label: `  ${p.name}`, fmt: money, sub: true,
            value: (wk) => (coveredTo(p.id) && wk > coveredTo(p.id) ? null : at(w.sales, wk, (r) => r.net, (r) => r.platform === p.id)) })),
        { label: "Gross (before store fees)", value: (wk) => at(w.sales, wk, (r) => r.gross), fmt: money },
        { label: "Refunds", value: (wk) => at(w.sales, wk, (r) => r.refunds), fmt: money, good: "down" },
        { label: "Purchases", value: (wk) => at(w.sales, wk, (r) => r.units), fmt: count },
        { label: "  of them new (not renewals)", value: (wk) => at(w.sales, wk, (r) => r.new_units), fmt: count, sub: true },
        { group: "Subscriptions" },
        { label: "MRR at week end", value: (wk) => mrrAt(wk, "mrr"), fmt: money },
        { label: "Active paid subscriptions", value: (wk) => mrrAt(wk, "active"), fmt: count },
        { label: "New subscriptions", value: (wk) => at(w.subs, wk, (r) => r.new), fmt: count },
        { label: "Cancelled", value: (wk) => at(w.subs, wk, (r) => r.cancelled), fmt: count, good: "down" },
        { group: "Paddle checkout" },
        { label: "Checkouts opened", value: (wk) => at(w.checkouts, wk, (r) => r.opened), fmt: count },
        { label: "Paid", value: (wk) => at(w.checkouts, wk, (r) => r.paid), fmt: count },
        { label: "Checkout → paid", value: checkoutRate, fmt: share },
        { group: "Users (GA4)" },
        ...gaApps.map((a) => ({ label: `New users, ${a.name}`, value: (wk) => at(w.acquisition, wk, (r) => r.new_users, (r) => r.app === a.id), fmt: count })),
        ...gaApps.map((a) => ({ label: `${start} → recording, ${a.name}`, value: (wk) => funnelRate(wk, a.id, marks.recording, 1), fmt: share })),
        ...gaApps.map((a) => ({ label: `${start} → purchase, ${a.name}`, value: (wk) => funnelRate(wk, a.id, marks.purchase, 1), fmt: (v) => (v === null ? "—" : pct(v, 2)) })),
        { group: "Ads" },
        { label: "Ad spend", value: (wk) => at(w.spend, wk, (r) => r.spend), fmt: money, good: "down" },
        { label: "Ad clicks", value: (wk) => at(w.spend, wk, (r) => r.clicks), fmt: count },
    ];
    const full = weeks.filter((x) => x !== current);
    const [prevWk, lastWk] = full.slice(-2);
    const head = [["Metric"], ...weeks.map((x) => [x === current ? `${x.slice(5)} now` : x.slice(5), 1]), ["Δ last week", 1]];
    table("tbl-weekly", head, ROWS.map((row) => {
        if (row.group) return el("tr", { class: "group" }, el("td", { colspan: String(weeks.length + 2) }, row.group));
        const vals = weeks.map((wk) => row.value(wk));
        const a = row.value(lastWk);
        const b = row.value(prevWk);
        return el("tr", { class: row.sub ? "sub" : "" },
            td(row.label.trim()),
            vals.map((v, i) => td(v === null ? "—" : row.fmt(v), true, weeks[i] === current ? "muted" : "")),
            td(a !== null && b ? deltaPct(a, b, row.good !== "down") : "", true));
    }));
}

/* ---------- Campaigns ---------- */

const NOT_CAMPAIGN = /^\(.*\)$/;

// The installer A/B (cid-tracker.js) appends _wi / _st to the Microsoft cid, so
// the app and Paddle report "gads_x_wi" while Google Ads spends on "gads_x".
// Folding the arm back in keeps revenue on the campaign row its spend is on.
function campaignKey(name) {
    return (name || "").trim().toLowerCase().replace(/_(wi|st)$/, "");
}

// Meta app-install ads open Google Play with Meta's own referrer: utm_source=apps.facebook.com
// (apps.instagram.com), utm_campaign=fb4a / ig4a. The real campaign is in the encrypted part GA4
// doesn't decode, so these users can only be credited to Meta as a whole.
const META_INSTALL_REFERRER = /^apps\.(facebook|instagram)\.com\b/i;

function renderCampaigns() {
    const c = state.campaigns;
    const rows = {};
    const row = (key, label) => (rows[key] ??= { label, network: new Set(), spend: 0, clicks: 0, impressions: 0, conversions: 0, newUsers: 0, buyers: 0, ga4Revenue: 0, paddleNet: 0, paddleUnits: 0, approx: false });
    for (const s of c.spend) {
        const r = row(campaignKey(s.campaign), s.campaign);
        r.network.add(s.network === "google-ads" ? "Google Ads" : "Meta");
        r.spend += s.spend;
        r.clicks += s.clicks;
        r.impressions += s.impressions || 0;
        r.conversions += s.conversions || 0;
    }
    // одна кампания Meta с расходом — её пользователи из Play-реферера Meta; несколько — общая строка Meta
    const metaSpend = [...new Set(c.spend.filter((s) => s.network === "meta").map((s) => campaignKey(s.campaign)))];
    for (const a of c.acquisition) {
        if (a.app === "android" && META_INSTALL_REFERRER.test(a.source)) {
            const r = metaSpend.length === 1 ? rows[metaSpend[0]] : row("meta-app-installs", "Meta app installs (all campaigns)");
            r.network.add(`${a.source.replace(/\s*\/\s*$/, "")} / ${a.campaign}`);
            r.approx = true;
            r.newUsers += a.new_users;
            r.buyers += a.purchasers;
            r.ga4Revenue += a.revenue;
            continue;
        }
        const paid = /cpc|paid|ads/i.test(a.source);
        if (NOT_CAMPAIGN.test(a.campaign) && !paid) continue;
        const name = NOT_CAMPAIGN.test(a.campaign) ? `${a.source} (no campaign name)` : a.campaign;
        const r = row(campaignKey(name), name);
        r.network.add(a.source);
        r.newUsers += a.new_users;
        r.buyers += a.purchasers;
        // Windows-покупки в GA4 — те же оплаты Paddle (их досылает вебхук): с Paddle net они бы задвоились
        if (a.app !== "windows") r.ga4Revenue += a.revenue;
    }
    for (const p of c.paddle) {
        const name = p.campaign.includes(" / ") ? p.campaign.split(" / ").slice(1).join(" / ") : p.campaign;
        const r = row(campaignKey(name), name);
        r.network.add(p.campaign.includes(" / ") ? p.campaign.split(" / ")[0] : "site / app");
        r.paddleNet += p.net;
        r.paddleUnits += p.units;
    }
    const list = Object.values(rows).sort((a, b) => b.spend - a.spend || b.paddleNet - a.paddleNet || b.newUsers - a.newUsers);
    // ROAS — только по кампаниям с расходом: выручка органики и рассылок к рекламному бюджету отношения не имеет
    const paid = list.filter((r) => r.spend > 0);
    const spend = sum(paid, (r) => r.spend);
    const paddle = sum(list, (r) => r.paddleNet);
    const ga4Rev = sum(paid, (r) => r.ga4Revenue);
    const paidRevenue = sum(paid, (r) => r.paddleNet + r.ga4Revenue);
    renderTileRow("campaign-tiles", [
        { label: "Ad spend", value: spend, fmt: usd },
        { label: "Paddle revenue from campaigns (exact)", value: paddle, fmt: usd },
        { label: "Buyers from campaigns (GA4)", value: sum(list, (r) => r.buyers), fmt: int },
        { label: "ROAS, estimate", value: spend ? paidRevenue / spend : 0, fmt: (v) => (spend ? `${v.toFixed(2)}×` : "no spend"),
          delta: el("span", { class: "muted" }, "(Paddle + GA4 mobile revenue of paid campaigns) ÷ spend; GA4 part is approximate") },
    ]);
    const days = [...new Set(c.daily.map((r) => r.day))].sort();
    const canvas = document.getElementById("chart-campaign-spend");
    canvas.parentElement.hidden = !days.length;
    let empty = document.getElementById("campaign-spend-empty");
    if (!empty) {
        empty = el("p", { id: "campaign-spend-empty", class: "muted" });
        canvas.parentElement.after(empty);
    }
    empty.textContent = state.product === "captions" ? "Live Captions has no ad campaigns."
        : "No ad spend in this period: Google Ads and Meta campaigns are paused.";
    empty.hidden = !!days.length;
    draw("chart-campaign-spend", {
        type: "bar",
        data: {
            labels: days,
            datasets: [["google-ads", "Google Ads", "--series-1"], ["meta", "Meta", "--series-7"]].map(([id, name, col]) => ({
                label: name, data: days.map((d) => sum(c.daily.filter((r) => r.day === d && r.network === id), (r) => r.spend)),
                backgroundColor: css(col), borderRadius: 4, maxBarThickness: 20,
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { ...timeX, stacked: true }, y: { stacked: true, ticks: { callback: (v) => usd(v) } } },
            plugins: { legend },
        },
    });
    table("tbl-campaigns-all", [["Campaign"], ["Source"], ["Spend", 1], ["Impressions", 1], ["Clicks", 1], ["Conversions (ad network)", 1],
        ["New users", 1], ["Buyers", 1], ["GA4 mobile revenue ≈", 1], ["Paddle net", 1], ["Cost / buyer", 1], ["ROAS", 1]],
        list.map((r) => {
            const revenue = r.paddleNet + r.ga4Revenue;
            const approx = (v) => (r.approx ? `≈ ${v}` : v);
            return el("tr", {},
                td(r.label), td([...r.network].join(", "), false, "muted"),
                td(r.spend ? usd(r.spend) : "", true), td(r.impressions ? int(r.impressions) : "", true),
                td(r.clicks ? int(r.clicks) : "", true),
                td(r.spend ? int(r.conversions) : "", true, r.spend && !r.conversions ? "down" : ""),
                td(r.newUsers ? approx(int(r.newUsers)) : "", true), td(r.buyers ? approx(int(r.buyers)) : "", true),
                td(r.ga4Revenue ? usd(r.ga4Revenue) : "", true), td(r.paddleNet ? usd(r.paddleNet) : "", true),
                td(r.spend && r.buyers ? usd(r.spend / r.buyers) : "", true),
                td(r.spend ? `${(revenue / r.spend).toFixed(2)}×` : "", true, r.spend && revenue < r.spend ? "down" : r.spend ? "up" : ""));
        }),
        "No campaign traffic, tagged purchases or ad spend in this period");
}

/* ---------- Update now: запуск сборщика (GitHub Actions) ---------- */

let refreshTimer = null;
let refreshRunning = false;

function ago(iso) {
    const min = Math.round((Date.now() - Date.parse(iso)) / 60000);
    return min < 60 ? `${min} min ago` : min < 48 * 60 ? `${Math.round(min / 60)} h ago` : `${Math.round(min / 1440)} days ago`;
}

function showRefresh(st) {
    const btn = document.getElementById("refresh-btn");
    const note = document.getElementById("refresh-note");
    btn.disabled = !st.canStart;
    btn.textContent = st.running ? "Updating…" : "Update now";
    const failed = st.run && st.run.status === "completed" && st.run.conclusion !== "success";
    note.textContent = st.running ? `started ${ago(st.run?.startedAt ?? new Date().toISOString())}, takes ~40 min`
        : `${st.lastUpdate ? `Updated ${ago(st.lastUpdate)}` : "Never updated"}${failed ? " · last run had errors" : ""}`;
    btn.title = st.running ? "Collecting data from all sources" : st.canStart ? "Collect fresh data from all sources now"
        : "Available an hour after the last update";
    clearTimeout(refreshTimer);
    if (st.running) refreshTimer = setTimeout(pollRefresh, 60000);
    // сбор закончился, пока страница открыта — перечитать данные открытой вкладки и сводку
    if (refreshRunning && !st.running) {
        for (const name of Object.keys(RENDER)) state[name] = null;
        summaryLoaded = false;
        load();
    }
    refreshRunning = st.running;
}

async function pollRefresh() {
    const st = await api("/api/refresh", { quiet: true });
    if (st) showRefresh(st);
}

document.getElementById("refresh-btn").addEventListener("click", async () => {
    const btn = document.getElementById("refresh-btn");
    btn.disabled = true;
    const res = await fetch(`${API}/api/refresh`, { method: "POST", credentials: "include" }).catch(() => null);
    const st = res && res.ok ? await res.json() : null;
    if (!st) {
        document.getElementById("refresh-note").textContent = "Couldn't start the update";
        btn.disabled = false;
        return;
    }
    showRefresh(st);
});

/* ---------- wiring ---------- */

const RENDER = { sales: renderSales, aso: renderAso, search: renderSearch, weekly: renderWeekly, funnel: renderFunnel, subs: renderSubs, health: renderHealth,
    campaigns: renderCampaigns, live: renderLive, ga4: renderGa4, ab: renderAb };

function switchTab(tab) {
    state.tab = RENDER[tab] ? tab : "sales";
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
    for (const name of Object.keys(RENDER)) document.getElementById(`tab-${name}`).hidden = name !== state.tab;
    document.getElementById("range-bar").hidden = ["live", "ga4", "weekly", "ab"].includes(state.tab);
    writeRange();
    if (state.tab === "live" || !state[state.tab]) {
        load();
    } else {
        RENDER[state.tab]();
    }
}

function isPhone() {
    return window.matchMedia("(max-width: 600px)").matches;
}

function chartDefaults() {
    Chart.defaults.font.family = getComputedStyle(root).fontFamily;
    Chart.defaults.color = css("--text-secondary");
    Chart.defaults.borderColor = css("--grid");
    Chart.defaults.animation.duration = 700;
    Chart.defaults.animation.easing = "easeOutCubic";
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.font.size = isPhone() ? 11 : 12;
    Chart.defaults.locale = "en-US";
}

document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
document.querySelectorAll("#product-toggle button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.product === state.product) return;
    applyProduct(b.dataset.product);
    switchTab(state.tab);
}));
document.querySelectorAll("#metric-toggle button").forEach((b) => b.addEventListener("click", () => {
    state.salesMetric = b.dataset.metric;
    localStorage.setItem("salesMetric", state.salesMetric);
    if (state.sales) renderSales();
}));
function applyRange(change) {
    Object.assign(state.range, change);
    if (change.preset && change.preset !== "custom") Object.assign(state.range, presetRange(change.preset));
    if (state.range.from > state.range.to) [state.range.from, state.range.to] = [state.range.to, state.range.from];
    writeRange();
    dropRangeData();
    load();
}

function dropRangeData() {
    for (const name of Object.keys(RENDER)) if (!["weekly", "live", "ga4", "ab"].includes(name)) state[name] = null;
}

document.getElementById("range-preset").addEventListener("change", (e) => applyRange({ preset: e.target.value }));
for (const k of ["from", "to"]) {
    document.getElementById(`range-${k}`).addEventListener("change", (e) => {
        if (e.target.value) applyRange({ preset: "custom", [k]: e.target.value });
    });
}
document.getElementById("range-grain").addEventListener("change", (e) => {
    state.range.grain = e.target.value;
    writeRange();
    if (state[state.tab]) RENDER[state.tab]();
});
document.getElementById("range-compare").addEventListener("change", (e) => applyRange({ compare: e.target.value }));
for (const [id, key] of [["f-platform", "platform"], ["f-country", "country"]]) {
    document.getElementById(id).addEventListener("change", (e) => {
        state.salesFilter[key] = e.target.value;
        state.sales = null;
        load();
    });
}
document.getElementById("aso-store").addEventListener("change", (e) => {
    state.asoSel.store = e.target.value;
    renderAsoSelection();
});
document.getElementById("search-country").addEventListener("change", (e) => {
    state.searchSel.country = e.target.value;
    renderSearch();
});
document.getElementById("aso-country").addEventListener("change", (e) => {
    state.asoSel.country = e.target.value;
    renderAsoTable();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    chartDefaults();
    switchTab(state.tab);
});

// Вставленная в открытую вкладку ссылка с другим периодом должна его применить, а не только сменить вкладку
window.addEventListener("hashchange", () => {
    const tab = location.hash.slice(1).split("?")[0];
    const next = location.hash.includes("?") ? readRange() : null;
    const nextProduct = location.hash.includes("?") ? readProduct() : state.product;
    const changed = (next && ["preset", "from", "to", "grain", "compare"].some((k) => next[k] !== state.range[k]))
        || nextProduct !== state.product;
    if (changed) {
        if (next) state.range = next;
        dropRangeData();
        if (nextProduct !== state.product) applyProduct(nextProduct);
    }
    if (tab !== state.tab) switchTab(tab);
    else if (changed) {
        writeRange();
        load();
    }
});

chartDefaults();
state.range = readRange();
applyProduct(readProduct());
switchTab(location.hash.slice(1).split("?")[0]);
api("/api/refresh", { quiet: true }).then((st) => st && showRefresh(st));
