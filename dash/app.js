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

const state = { tab: "sales", days: 30, sales: null, aso: null, charts: {}, asoSel: { store: "msstore", country: null } };

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

function deltaPct(cur, prev) {
    if (!prev) return el("span", { class: "muted" }, "—");
    const d = (cur - prev) / Math.abs(prev) * 100;
    return el("span", { class: d >= 0 ? "up" : "down" }, `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(0)}%`);
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

async function api(path) {
    let res;
    try {
        res = await fetch(`${API}${path}`, { credentials: "include" });
    } catch {
        res = null;
    }
    if (!res || !res.ok) {
        showLogin();
        return null;
    }
    sessionStorage.removeItem("loginTried");
    return res.json();
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
    const data = await api(`/api/${tab}?days=${state.days}`);
    if (!data) return;
    state[tab] = data;
    document.getElementById("login").hidden = true;
    document.getElementById("app").hidden = false;
    document.getElementById("user").textContent = data.user;
    if (tab !== state.tab) return;
    if (tab === "sales") renderSales();
    else renderAso();
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

/* ---------- Sales ---------- */

function renderSales() {
    const { daily } = state.sales;
    const cutoff = isoDay(new Date(Date.now() - state.days * 86400000));
    const cur = daily.filter((r) => r.day > cutoff);
    const prev = daily.filter((r) => r.day <= cutoff);
    renderTiles(cur, prev);
    renderDaily(cur);
    renderPlatforms(cur, prev);
    renderChannels();
    renderEntries();
    renderAcquisition();
    renderCountries();
    renderProducts();
    renderSources("tbl-sources", state.sales.sources);
}

function renderTiles(cur, prev) {
    const net = series(cur, () => "all", (r) => r.net);
    const units = series(cur, () => "all", (r) => r.units);
    const netTotal = sum(cur, (r) => r.net);
    const unitsTotal = sum(cur, (r) => r.units);
    const refunds = sum(cur, (r) => r.refunds);
    renderTileRow("tiles", [
        { label: "Net revenue", value: netTotal, fmt: usd, delta: deltaPct(netTotal, sum(prev, (r) => r.net)),
          spark: net.labels.map((l) => net.value("all", l)) },
        { label: "Units sold", value: unitsTotal, fmt: int, delta: deltaPct(unitsTotal, sum(prev, (r) => r.units)),
          spark: units.labels.map((l) => units.value("all", l)) },
        { label: "Daily average", value: netTotal / state.days, fmt: usd, delta: deltaPct(netTotal, sum(prev, (r) => r.net)) },
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
    document.getElementById("daily-note").textContent = state.days > 90 ? "weekly" : "daily";
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

function renderPlatforms(cur, prev) {
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
                legend: { position: "right", labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "rectRounded" } },
                tooltip: { callbacks: { label: (c) => `${c.label}: ${usd(c.parsed)} (${total ? (c.parsed / total * 100).toFixed(0) : 0}%)` } },
            },
        },
    });
    const rows = PLATFORMS.map((p, i) => {
        const c = cur.filter((r) => r.platform === p.id);
        const pr = prev.filter((r) => r.platform === p.id);
        return el("tr", {},
            td([swatch(p.id), p.name + (c.some((r) => r.estimated) ? " *" : "")]),
            td(usd(nets[i]), true),
            td(total ? `${(nets[i] / total * 100).toFixed(0)}%` : "—", true),
            td(int(sum(c, (r) => r.units)), true),
            td(usd(sum(c, (r) => r.refunds)), true),
            td(deltaPct(nets[i], sum(pr, (r) => r.net)), true));
    });
    table("tbl-platforms", [["Platform"], ["Net", 1], ["Share", 1], ["Units", 1], ["Refunds", 1], ["vs prev.", 1]], rows);
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
    const acq = state.sales.acquisition;
    const block = (metric, target, title) => {
        const rows = acq.filter((r) => r.metric === metric);
        const total = sum(rows, (r) => r.value);
        table(target, [[title], ["Count", 1], ["Share", 1]], rows.slice(0, 25).map((r) => el("tr", {},
            td(sourceLabel(r.source, r.campaign)),
            td(int(r.value), true),
            td(total ? `${(r.value / total * 100).toFixed(1)}%` : "", true))));
    };
    block("new_users", "tbl-acq-users", "New users by first source");
    block("purchases", "tbl-acq-purchases", "Purchases by session source");
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
            scales: { x: { stacked: true, ticks: { callback: (v) => usd(v) } }, y: { stacked: true, grid: { display: false } } },
            plugins: {
                legend,
                tooltip: {
                    callbacks: {
                        label: (c) => `${c.dataset.label}: ${usd(c.parsed.x)}`,
                        footer: (items) => `Total: ${usd(items.reduce((a, i) => a + i.parsed.x, 0))}`,
                    },
                },
            },
        },
    });
}

function renderProducts() {
    table("tbl-products", [["Product"], ["Net", 1], ["Units", 1], ["Refunded", 1]], state.sales.products.map((r) => el("tr", {},
        td([swatch(r.platform), r.product]),
        td(usd(r.net), true),
        td(int(r.units), true),
        td(r.refunded ? int(r.refunded) : "", true))));
}

function renderSources(target, sources) {
    const names = { ...Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])), aso: "ASO", ga4: "GA4" };
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
    countrySel.replaceChildren(...countries.map((c) => el("option", { value: c }, c)));
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
        td(r.keyword), td(r.country), td(compact(r.volume), true), td(rankText(r.rank, r.depth), true))),
        "Every keyword with known volume is already in the top 10");
}

function renderHeatmap() {
    const rows = state.aso.aso.filter((r) => r.store === state.asoSel.store);
    const countries = [...new Set(rows.map((r) => r.country))];
    const at = Object.fromEntries(rows.map((r) => [`${r.keyword}|${r.country}`, r]));
    const best = (k) => Math.min(...countries.map((c) => at[`${k}|${c}`]?.rank ?? 999));
    const keywords = [...new Set(rows.map((r) => r.keyword))].sort((a, b) => best(a) - best(b));
    table("tbl-aso-heat", [["Keyword"], ...countries.map((c) => [c, 1])], keywords.map((k) => el("tr", {},
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

/* ---------- wiring ---------- */

function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    document.getElementById("tab-sales").hidden = tab !== "sales";
    document.getElementById("tab-aso").hidden = tab !== "aso";
    history.replaceState(null, "", `#${tab}`);
    if (!state[tab]) {
        load();
    } else if (tab === "sales") {
        renderSales();
    } else {
        renderAso();
    }
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
}

document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
document.querySelectorAll(".top .filters button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".top .filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state.days = Number(b.dataset.days);
    state.sales = null;
    state.aso = null;
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

chartDefaults();
switchTab(location.hash === "#aso" ? "aso" : "sales");
