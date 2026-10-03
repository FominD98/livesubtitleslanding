"use strict";

const API = "https://dash-api.live-subtitles.com";
const PLATFORMS = [
    { id: "paddle", name: "Paddle (web)", slot: 1 },
    { id: "appstore", name: "App Store", slot: 2 },
    { id: "play", name: "Google Play", slot: 3 },
    { id: "msstore", name: "Microsoft Store", slot: 4 },
];
const STORES = PLATFORMS.filter((p) => p.id !== "paddle");
const byId = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const css = (name) => getComputedStyle(document.querySelector(".viz-root")).getPropertyValue(name).trim();
const color = (platform) => css(`--series-${byId[platform].slot}`);
const usd = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });
const int = (v) => Math.round(v).toLocaleString("en-US");
const sum = (rows, f) => rows.reduce((a, r) => a + (f(r) || 0), 0);

let state = { days: 30, data: null, charts: {}, aso: { store: "msstore", country: null } };

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

function table(target, head, rows) {
    const t = document.getElementById(target);
    t.replaceChildren(
        el("thead", {}, el("tr", {}, head.map(([label, num]) => el("th", num ? { class: "num" } : {}, label)))),
        el("tbody", {}, rows));
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

async function load() {
    let res;
    try {
        res = await fetch(`${API}/api/data?days=${state.days}`, { credentials: "include" });
    } catch {
        res = null;
    }
    if (!res || !res.ok) {
        showLogin();
        return;
    }
    state.data = await res.json();
    sessionStorage.removeItem("loginTried");
    document.getElementById("login").hidden = true;
    document.getElementById("app").hidden = false;
    document.getElementById("user").textContent = state.data.user;
    render();
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

function isoDay(d) {
    return d.toISOString().slice(0, 10);
}

function render() {
    const { daily } = state.data;
    const cutoff = isoDay(new Date(Date.now() - state.days * 86400000));
    const cur = daily.filter((r) => r.day > cutoff);
    const prev = daily.filter((r) => r.day <= cutoff);
    renderTiles(cur, prev);
    renderDaily(cur);
    renderPlatforms(cur, prev);
    renderCountries();
    renderProducts();
    renderAsoTrend();
    renderAsoTable();
    renderSources();
}

function renderTiles(cur, prev) {
    const net = sum(cur, (r) => r.net);
    const tiles = [
        ["Net revenue", usd(net), deltaPct(net, sum(prev, (r) => r.net))],
        ["Units sold", int(sum(cur, (r) => r.units)), deltaPct(sum(cur, (r) => r.units), sum(prev, (r) => r.units))],
        ["Daily average", usd(net / state.days), null],
        ["Refunds", usd(sum(cur, (r) => r.refunds)), el("span", { class: "muted" },
            net ? `${(Math.abs(sum(cur, (r) => r.refunds)) / (net - sum(cur, (r) => r.refunds)) * 100).toFixed(1)}% of revenue` : "")],
    ];
    document.getElementById("tiles").replaceChildren(...tiles.map(([label, value, delta]) =>
        el("div", { class: "tile" },
            el("div", { class: "label" }, label),
            el("div", { class: "value" }, value),
            el("div", { class: "delta" }, delta ?? ""))));
}

function bucketKey(day) {
    if (state.days <= 90) return day;
    const d = new Date(day + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return isoDay(d);
}

function chartDefaults() {
    Chart.defaults.font.family = getComputedStyle(document.querySelector(".viz-root")).fontFamily;
    Chart.defaults.color = css("--text-secondary");
    Chart.defaults.borderColor = css("--grid");
}

function draw(id, config) {
    state.charts[id]?.destroy();
    state.charts[id] = new Chart(document.getElementById(id), config);
}

function renderDaily(cur) {
    const labels = [...new Set(cur.map((r) => bucketKey(r.day)))].sort();
    const datasets = PLATFORMS.map((p) => {
        const map = {};
        for (const r of cur.filter((x) => x.platform === p.id)) {
            const k = bucketKey(r.day);
            map[k] = (map[k] || 0) + r.net;
        }
        return {
            label: p.name,
            data: labels.map((l) => map[l] ?? 0),
            backgroundColor: color(p.id),
            borderColor: css("--surface-1"),
            borderWidth: { top: 2 },
            borderRadius: 4,
            borderSkipped: "bottom",
            maxBarThickness: 28,
        };
    });
    draw("chart-daily", {
        type: "bar",
        data: { labels, datasets },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: {
                x: { stacked: true, grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
                y: { stacked: true, ticks: { callback: (v) => usd(v) } },
            },
            plugins: {
                legend: { position: "top", align: "start", labels: { boxWidth: 10, boxHeight: 10 } },
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
    const rows = PLATFORMS.map((p) => {
        const c = cur.filter((r) => r.platform === p.id);
        const pr = prev.filter((r) => r.platform === p.id);
        const net = sum(c, (r) => r.net);
        const estimated = c.some((r) => r.estimated);
        return el("tr", {},
            td([swatch(p.id), p.name + (estimated ? " *" : "")]),
            td(usd(net), true),
            td(total ? `${(net / total * 100).toFixed(0)}%` : "—", true),
            td(int(sum(c, (r) => r.units)), true),
            td(usd(sum(c, (r) => r.refunds)), true),
            td(deltaPct(net, sum(pr, (r) => r.net)), true));
    });
    table("tbl-platforms", [["Platform"], ["Net", 1], ["Share", 1], ["Units", 1], ["Refunds", 1],
        ["vs previous period", 1]], rows);
}

function renderCountries() {
    const totals = {};
    for (const r of state.data.countries) totals[r.country] = (totals[r.country] || 0) + r.net;
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([c]) => c);
    const datasets = PLATFORMS.map((p) => ({
        label: p.name,
        data: top.map((c) => sum(state.data.countries.filter((r) => r.country === c && r.platform === p.id), (r) => r.net)),
        backgroundColor: color(p.id),
        borderColor: css("--surface-1"),
        borderWidth: { right: 2 },
        borderRadius: 4,
        borderSkipped: "left",
        maxBarThickness: 18,
    }));
    draw("chart-countries", {
        type: "bar",
        data: { labels: top, datasets },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false, axis: "y" },
            scales: {
                x: { stacked: true, ticks: { callback: (v) => usd(v) } },
                y: { stacked: true, grid: { display: false } },
            },
            plugins: {
                legend: { position: "top", align: "start", labels: { boxWidth: 10, boxHeight: 10 } },
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
    const rows = state.data.products.map((r) => el("tr", {},
        td([swatch(r.platform), r.product]),
        td(usd(r.net), true),
        td(int(r.units), true),
        td(r.refunded ? int(r.refunded) : "", true)));
    table("tbl-products", [["Product"], ["Net", 1], ["Units", 1], ["Refunded", 1]], rows);
}

function renderAsoTrend() {
    const rows = state.data.asoTrend;
    const labels = [...new Set(rows.map((r) => r.day))].sort();
    const byStoreDay = {};
    const datasets = STORES.map((s) => {
        const map = Object.fromEntries(rows.filter((r) => r.store === s.id).map((r) => [r.day, r]));
        byStoreDay[s.name] = map;
        return {
            label: s.name,
            data: labels.map((d) => map[d]?.top10 ?? null),
            borderColor: color(s.id),
            backgroundColor: color(s.id),
            borderWidth: 2,
            pointRadius: labels.length > 40 ? 0 : 4,
            pointHoverRadius: 5,
            pointBorderColor: css("--surface-1"),
            pointBorderWidth: 2,
            tension: 0.2,
        };
    });
    draw("chart-aso-trend", {
        type: "line",
        data: { labels, datasets },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } }, y: { beginAtZero: true } },
            plugins: {
                legend: { position: "top", align: "start", labels: { boxWidth: 10, boxHeight: 10 } },
                tooltip: {
                    callbacks: {
                        label: (c) => {
                            const r = byStoreDay[c.dataset.label][c.label];
                            return r ? `${c.dataset.label}: top 10 ${r.top10}, top 3 ${r.top3}, ranked ${r.found} of ${r.total}` : "";
                        },
                    },
                },
            },
        },
    });
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
    const aso = state.data.aso;
    const storeSel = document.getElementById("aso-store");
    const countrySel = document.getElementById("aso-country");
    storeSel.replaceChildren(...STORES.map((s) => el("option", { value: s.id }, s.name)));
    storeSel.value = state.aso.store;
    const countries = [...new Set(aso.map((r) => r.country))];
    if (!countries.includes(state.aso.country)) state.aso.country = countries[0] ?? null;
    countrySel.replaceChildren(...countries.map((c) => el("option", { value: c }, c)));
    countrySel.value = state.aso.country ?? "";

    const rows = aso
        .filter((r) => r.store === state.aso.store && r.country === state.aso.country)
        .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    table("tbl-aso", [["Keyword"], ["Rank", 1], ["7d", 1], ["30d", 1]], rows.map((r) =>
        el("tr", { class: "clickable", onclick: (e) => selectKeyword(r, e.currentTarget) },
            td(r.keyword),
            td(rankText(r.rank, r.depth), true),
            td(rankDelta(r.rank, r.rank_7d, r.depth), true),
            td(rankDelta(r.rank, r.rank_30d, r.depth), true))));
    if (!rows.length) {
        document.getElementById("tbl-aso").append(el("tr", {}, el("td", { colspan: "4", class: "muted" }, "No data")));
    }
}

async function selectKeyword(r, row) {
    document.querySelectorAll("#tbl-aso tr.active").forEach((x) => x.classList.remove("active"));
    row.classList.add("active");
    const q = new URLSearchParams({ store: r.store, country: r.country, keyword: r.keyword, days: Math.max(state.days, 90) });
    const res = await fetch(`${API}/api/aso/history?${q}`, { credentials: "include" });
    if (!res.ok) return;
    const hist = await res.json();
    document.getElementById("aso-history-title").textContent = `"${r.keyword}" — ${byId[r.store].name}, ${r.country}`;
    draw("chart-aso-history", {
        type: "line",
        data: {
            labels: hist.map((h) => h.day),
            datasets: [{
                label: r.keyword,
                data: hist.map((h) => h.rank),
                borderColor: color(r.store),
                backgroundColor: color(r.store),
                borderWidth: 2,
                pointRadius: hist.length > 40 ? 0 : 4,
                pointBorderColor: css("--surface-1"),
                pointBorderWidth: 2,
                spanGaps: false,
            }],
        },
        options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            scales: {
                x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
                y: { reverse: true, min: 1, suggestedMax: 20, ticks: { precision: 0 }, title: { display: true, text: "rank" } },
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (c) => `rank ${rankText(hist[c.dataIndex].rank, hist[c.dataIndex].depth)}` } },
            },
        },
    });
}

function renderSources() {
    const names = { ...Object.fromEntries(PLATFORMS.map((p) => [p.id, p.name])), aso: "ASO" };
    table("tbl-sources", [["Source"], ["Updated"], ["Covers"], ["Note"]], state.data.sources.map((s) =>
        el("tr", {},
            td(names[s.name] ?? s.name),
            td(new Date(s.updated_at).toLocaleString("en-GB")),
            td(s.covered_from === s.covered_to ? s.covered_from : `${s.covered_from} — ${s.covered_to}`),
            td(s.note ?? ""))));
}

document.querySelectorAll(".top .filters button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".top .filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state.days = Number(b.dataset.days);
    load();
}));
document.getElementById("aso-store").addEventListener("change", (e) => {
    state.aso.store = e.target.value;
    renderAsoTable();
});
document.getElementById("aso-country").addEventListener("change", (e) => {
    state.aso.country = e.target.value;
    renderAsoTable();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    chartDefaults();
    if (state.data) render();
});

chartDefaults();
load();
