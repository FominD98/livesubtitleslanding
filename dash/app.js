"use strict";

const API = "https://dash-api.live-subtitles.com";
const PLATFORMS = [
    { id: "paddle", name: "Paddle (web)", slot: 1 },
    { id: "appstore", name: "App Store", slot: 2 },
    { id: "play", name: "Google Play", slot: 3 },
    { id: "msstore", name: "Microsoft Store", slot: 4 },
];
const STORES = PLATFORMS.filter((p) => p.id !== "paddle");
const CHANNELS = [
    { id: "new", name: "New purchase", color: "--series-5" },
    { id: "renewal", name: "Renewal", color: "--series-6" },
    { id: "upgrade", name: "Plan change", color: "--series-7" },
    { id: "unknown", name: "Not reported", color: "--neutral" },
];
const ENTRIES = {
    "app-windows": "In-app checkout (Windows)",
    "app-android": "In-app checkout (Android)",
    "app-captions": "In-app checkout (Live Captions)",
    website: "Website /buy/ page",
    unknown: "Unknown",
};
const byId = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const root = document.querySelector(".viz-root");
const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();
const color = (platform) => css(`--series-${byId[platform].slot}`);
const usd = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });
const int = (v) => Math.round(v).toLocaleString("en-US");
const sum = (rows, f) => rows.reduce((a, r) => a + (f(r) || 0), 0);

const state = { tab: "sales", days: 30, sales: null, aso: null, funnel: null, subs: null, health: null, live: null, charts: {}, asoSel: { store: "msstore", country: null } };

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
    const days = state.days;
    const data = await api(`/api/${tab}?days=${days}`);
    if (days !== state.days) return;
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

function bucketKey(day) {
    if (state.days <= 90) return day;
    const d = new Date(day + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return isoDay(d);
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
function aligned(platform) {
    const today = isoDay(new Date());
    const src = state.sales.sources.find((s) => s.name === platform);
    const end = src && src.covered_to < today ? src.covered_to : today;
    const rows = state.sales.daily.filter((r) => r.platform === platform);
    const from = shiftDay(end, -state.days);
    const prevFrom = shiftDay(end, -2 * state.days);
    return {
        end,
        lagging: end < shiftDay(today, -2),
        cur: rows.filter((r) => r.day > from && r.day <= end),
        prev: rows.filter((r) => r.day > prevFrom && r.day <= from),
    };
}

function renderSales() {
    const { daily } = state.sales;
    const cutoff = shiftDay(isoDay(new Date()), -state.days);
    const cur = daily.filter((r) => r.day > cutoff);
    const windows = Object.fromEntries(PLATFORMS.map((p) => [p.id, aligned(p.id)]));
    const lagging = PLATFORMS.filter((p) => windows[p.id].lagging);
    const note = document.getElementById("lag-note");
    // сборщик идёт раз в сутки с компьютера: если он не запускался дольше полутора суток, цифры устарели
    const lastRun = state.sales.sources.reduce((m, s) => (s.updated_at > m ? s.updated_at : m), "");
    const staleHours = lastRun ? (Date.now() - Date.parse(lastRun)) / 3600000 : 0;
    const parts = lagging.map((p) => `${p.name} data until ${windows[p.id].end}`);
    if (parts.length) parts[parts.length - 1] += " — changes vs previous period compare windows ending on that date.";
    if (staleHours > 36) parts.unshift(`⚠ The daily collector last ran ${Math.round(staleHours / 24)} days ago — numbers are stale.`);
    note.hidden = !parts.length;
    note.textContent = parts.join(" · ");
    renderTiles(cur, windows);
    renderDaily(cur);
    renderPlatforms(cur, windows);
    renderChannels();
    renderEntries();
    renderAcquisition();
    renderCountries();
    renderProducts();
    renderSources("tbl-sources", state.sales.sources);
}

// Среднее в день — по дням, за которые данные уже есть: у года данные начинаются с февраля, а не 365 дней назад
function coveredDays(rows) {
    const first = rows.reduce((m, r) => (m && m < r.day ? m : r.day), null);
    if (!first) return state.days;
    const span = Math.round((Date.parse(isoDay(new Date())) - Date.parse(first)) / 86400000) + 1;
    return Math.max(1, Math.min(state.days, span));
}

function alignedSum(windows, key, f) {
    return sum(PLATFORMS, (p) => sum(windows[p.id][key], f));
}

function renderTiles(cur, windows) {
    const net = series(cur, () => "all", (r) => r.net);
    const units = series(cur, () => "all", (r) => r.units);
    const netTotal = sum(cur, (r) => r.net);
    const unitsTotal = sum(cur, (r) => r.units);
    const refunds = sum(cur, (r) => r.refunds);
    renderTileRow("tiles", [
        { label: "Net revenue", value: netTotal, fmt: usd,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r.net), alignedSum(windows, "prev", (r) => r.net)),
          spark: net.labels.map((l) => net.value("all", l)) },
        { label: "Units sold", value: unitsTotal, fmt: int,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r.units), alignedSum(windows, "prev", (r) => r.units)),
          spark: units.labels.map((l) => units.value("all", l)) },
        { label: "Daily average", value: netTotal / coveredDays(cur), fmt: usd,
          delta: deltaPct(alignedSum(windows, "cur", (r) => r.net), alignedSum(windows, "prev", (r) => r.net)) },
        { label: "Average order", value: unitsTotal ? (netTotal - refunds) / unitsTotal : 0, fmt: (v) => `$${v.toFixed(2)}`,
          delta: el("span", { class: "muted" }, "net before refunds ÷ units") },
        { label: "Refunds", value: refunds, fmt: usd,
          delta: el("span", { class: "muted" }, netTotal ? `${(Math.abs(refunds) / (netTotal - refunds) * 100).toFixed(1)}% of revenue` : "") },
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

function renderDaily(cur) {
    const { labels, value } = series(cur, (r) => r.platform, (r) => r.net);
    document.getElementById("daily-note").textContent = state.days > 90 ? "weekly · the last week is still in progress" : "daily";
    draw("chart-daily", {
        type: "line",
        data: {
            labels,
            datasets: PLATFORMS.map((p, i) => ({
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
            })),
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: timeX, y: { stacked: true, ticks: { callback: (v) => usd(v) } } },
            plugins: {
                legend,
                tooltip: {
                    callbacks: {
                        title: (items) => state.days > 90 ? `Week of ${items[0].label}` : items[0].label,
                        label: (c) => `${c.dataset.label}: ${usd(c.parsed.y)}`,
                        footer: (items) => `Total: ${usd(items.reduce((a, i) => a + i.parsed.y, 0))}`,
                    },
                },
            },
        },
    });
}

function renderPlatforms(cur, windows) {
    const total = sum(cur, (r) => r.net);
    const nets = PLATFORMS.map((p) => sum(cur.filter((r) => r.platform === p.id), (r) => r.net));
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
            td(deltaPct(sum(w.cur, (r) => r.net), sum(w.prev, (r) => r.net)), true),
            td(w.lagging ? w.end : "", false, "muted"));
    });
    table("tbl-platforms", [["Platform"], ["Net", 1], ["Share", 1], ["Units", 1], ["Refunds", 1], ["vs prev.", 1], ["Data until"]], rows);
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

function renderEntries() {
    const totals = {};
    for (const r of state.sales.entries) {
        if (r.net > 0) totals[r.entry] = (totals[r.entry] || 0) + r.net;
    }
    const keys = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    const all = sum(keys, (k) => totals[k]);
    draw("chart-entries", {
        type: "bar",
        data: {
            labels: keys.map((k) => ENTRIES[k] ?? k),
            datasets: [{ data: keys.map((k) => totals[k]), backgroundColor: css("--series-1"), borderRadius: 4, borderSkipped: "left", maxBarThickness: 26 }],
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            scales: { x: { ticks: { callback: (v) => usd(v) } }, y: { grid: { display: false } } },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => `${usd(ctx.parsed.x)} · ${all ? (ctx.parsed.x / all * 100).toFixed(0) : 0}%` } },
            },
        },
    });
}

function sourceLabel(source, campaign) {
    const tagged = campaign && !/^\(.*\)$/.test(campaign);
    return tagged ? `${source} · ${campaign}` : source;
}

function renderAcquisition() {
    const apps = [["windows", "Windows"], ["android", "Android"], ["apple", "iOS / Mac"]];
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
    table("tbl-campaigns", [["UTM campaign (Paddle)"], ["Platform"], ["Net", 1], ["Units", 1]],
        state.sales.campaigns.map((r) => el("tr", {}, td(r.campaign), td([swatch(r.platform), byId[r.platform].name]),
            td(usd(r.net), true), td(int(r.units), true))),
        "No tagged campaigns in this period");
}

function renderCountries() {
    const rows = state.sales.countries;
    const totals = {};
    for (const r of rows) totals[r.country] = (totals[r.country] || 0) + r.net;
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([c]) => c);
    draw("chart-countries", {
        type: "bar",
        data: {
            labels: top,
            datasets: PLATFORMS.map((p) => ({
                label: p.name,
                data: top.map((c) => sum(rows.filter((r) => r.country === c && r.platform === p.id), (r) => r.net)),
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
    table("tbl-products", [["Product"], ["Store"], ["Net", 1], ["Units", 1], ["Refunded", 1]], state.sales.products.map((r) => el("tr", {},
        td([swatch(r.platform), r.product]), td(byId[r.platform].name, false, "muted"),
        td(usd(r.net), true),
        td(int(r.units), true),
        td(r.refunded ? int(r.refunded) : "", true))));
}

function renderSources(target, sources) {
    const names = { ...Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])), aso: "ASO", ga4: "GA4 traffic sources",
        funnel: "GA4 funnel", health: "Health (logs, store stats)", subs: "Subscriptions" };
    table(target, [["Source"], ["Updated"], ["Covers"], ["Note"]], sources.map((s) => el("tr", {},
        td(names[s.name] ?? s.name),
        td(new Date(s.updated_at).toLocaleString("en-GB")),
        td(s.covered_from === s.covered_to ? s.covered_from : `${s.covered_from} — ${s.covered_to}`),
        td(s.note ?? ""))));
}

/* ---------- ASO ---------- */

const OUR_IDS = { msstore: "9PH1R9DJG47S", appstore: "6760197210", play: "com.livesubtitles.android" };
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
                backgroundColor: rows.map((r) => r.app_id === OUR_IDS[store] ? color(store) : css("--neutral")),
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
    const q = new URLSearchParams({ store: r.store, country: r.country, keyword: r.keyword, days: Math.max(state.days, 90) });
    const hist = await api(`/api/aso/history?${q}`);
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

/* ---------- shared for app-level tabs ---------- */

const APPS = [
    { id: "windows", name: "Windows", color: "--series-1" },
    { id: "android", name: "Android", color: "--series-3" },
    { id: "apple", name: "iOS", color: "--series-2" },
    { id: "mac", name: "Mac", color: "--series-7" },
];
const appById = Object.fromEntries(APPS.map((a) => [a.id, a]));
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

const RETENTION_APPS = APPS.filter((a) => a.id === "android" || a.id === "apple");
state.funnelSel = { retentionApp: "android" };

function renderFunnel() {
    const { latest, trend, window } = state.funnel;
    const apps = APPS.filter((a) => latest.some((r) => r.app === a.id));
    const steps = [...new Map(latest.map((r) => [r.step, r.name])).entries()].sort((a, b) => a[0] - b[0]);
    const users = (app, step) => latest.find((r) => r.app === app && r.step === step)?.users ?? 0;
    const last = steps.length ? steps[steps.length - 1][0] : 0;
    document.getElementById("funnel-window").textContent = `last ${window} days`;

    renderTileRow("funnel-tiles", apps.map((a) => ({
        label: `${a.name}: onboarding → purchase`,
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

    table("tbl-funnel", [["Step"], ...apps.flatMap((a) => [[a.name, 1], ["→", 1]])], steps.map(([s, name]) => el("tr", {},
        td(name),
        apps.flatMap((a) => {
            const prev = s > 1 ? users(a.id, s - 1) : 0;
            return [td(int(users(a.id, s)), true), td(prev ? pct(users(a.id, s) / prev) : "", true, "muted")];
        }))));

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
    appSelect("retention-app", RETENTION_APPS, state.funnelSel.retentionApp, (v) => {
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
    const cut = shiftDay(isoDay(new Date()), -30);
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
    const weekly = state.days > 90;
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
            plugins: { legend, tooltip: { callbacks: { title: (items) => weekly ? `Week of ${items[0].label}` : items[0].label, label: (c) => `${c.dataset.label}: ${Math.abs(c.parsed.y)}` } } },
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
state.healthSel = { app: "windows" };

function healthSum(rows, app, metric, days) {
    return sum(rows.filter((r) => r.app === app && r.metric === metric && days.includes(r.day)), (r) => r.value);
}

function renderHealth() {
    const rows = state.health.rows;
    appSelect("health-app", APPS, state.healthSel.app, (v) => {
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
    const { byMinute, byCountry, byEvent, byVersion, at } = state.live;
    const apps = APPS.filter((a) => byCountry.some((r) => r.app === a.id));
    const activeNow = (app) => sum(byCountry.filter((r) => r.app === app), (r) => r.value);
    renderTileRow("live-tiles", [
        { label: "Active users, last 30 min", value: sum(byCountry, (r) => r.value), fmt: int },
        ...apps.map((a) => ({ label: a.name, value: activeNow(a.id), fmt: int })),
    ]);
    document.getElementById("live-note").replaceChildren(el("span", { class: "pulse", "aria-hidden": "true" }),
        `GA4 realtime, updated ${new Date(at).toLocaleTimeString("en-GB")}, refreshes every 30 s while this tab is open. Windows sends events server-side, so GA4 has no country or version for it.`);

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
    const s = await api("/api/summary", { quiet: true });
    if (!s) return;
    const box = document.getElementById("summary");
    const item = (label, value, sub, warn = false) => el("div", { class: `s-item${warn ? " s-warn" : ""}` },
        el("div", { class: "s-label" }, label), el("div", { class: "s-value" }, value), sub ? el("div", { class: "s-sub" }, sub) : null);
    const rev = s.revenue || {};
    const churn = s.churn?.avg_active ? s.churn.cancelled / s.churn.avg_active : null;
    const conv = s.funnel?.started ? s.funnel.purchased / s.funnel.started : null;
    const checkout = s.checkout?.opened ? s.checkout.paid / s.checkout.opened : null;
    const staleHours = s.lastRun ? (Date.now() - Date.parse(s.lastRun)) / 3600000 : 0;
    const change = rev.prev ? (rev.cur - rev.prev) / Math.abs(rev.prev) * 100 : null;
    box.replaceChildren(
        item("Net revenue, 30 days", usd(rev.cur || 0), change === null ? null : `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(0)}% vs previous 30`),
        item("MRR", usd(s.mrr?.mrr || 0), `${int(s.mrr?.active || 0)} paid subscriptions`),
        item("Monthly churn", churn === null ? "—" : pct(churn), "monthly plans"),
        item("Onboarding → purchase", conv === null ? "—" : pct(conv, 2), "all apps, 30 days"),
        item("Paddle checkout → paid", checkout === null ? "—" : pct(checkout), `${int(s.checkout?.opened || 0)} checkouts opened`),
        item("Active right now", s.activeNow === null ? "—" : int(s.activeNow), "last 30 minutes"),
        ...(staleHours > 36 ? [item("Data", `${Math.round(staleHours / 24)} days old`, "daily collector did not run", true)] : []),
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

/* ---------- wiring ---------- */

const RENDER = { sales: renderSales, aso: renderAso, funnel: renderFunnel, subs: renderSubs, health: renderHealth, live: renderLive };

function switchTab(tab) {
    state.tab = RENDER[tab] ? tab : "sales";
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
    for (const name of Object.keys(RENDER)) document.getElementById(`tab-${name}`).hidden = name !== state.tab;
    document.querySelector(".top .filters").hidden = state.tab === "live";
    history.replaceState(null, "", `#${state.tab}`);
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
document.querySelectorAll(".top .filters button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".top .filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state.days = Number(b.dataset.days);
    for (const name of Object.keys(RENDER)) state[name] = null;
    load();
}));
document.getElementById("aso-store").addEventListener("change", (e) => {
    state.asoSel.store = e.target.value;
    renderAsoSelection();
});
document.getElementById("aso-country").addEventListener("change", (e) => {
    state.asoSel.country = e.target.value;
    renderAsoTable();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    chartDefaults();
    switchTab(state.tab);
});

window.addEventListener("hashchange", () => {
    if (location.hash.slice(1) !== state.tab) switchTab(location.hash.slice(1));
});

chartDefaults();
switchTab(location.hash.slice(1));
