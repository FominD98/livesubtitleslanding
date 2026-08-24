// Adds the Pricing entry to the navbar + footer across translations.js and the 16
// pre-baked locale homepages. pricing.html had no inbound internal link anywhere on
// the site (only a sitemap entry), so nothing could reach it but a direct URL.
//
// Run once: node _add_pricing_nav_link.js && node bake-i18n-defaults.js

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const LABEL = {
    'en-US': 'Pricing',
    'ru-RU': 'Цены',
    'fr-FR': 'Tarifs',
    'es-ES': 'Precios',
    'de-DE': 'Preise',
    'it-IT': 'Prezzi',
    'ja-JP': '料金',
    'ko-KR': '요금',
    'zh-CN': '价格',
    'ar-SA': 'الأسعار',
    'hi-IN': 'मूल्य',
    'pt-BR': 'Preços',
    'pl-PL': 'Cennik',
    'nl-NL': 'Prijzen',
    'tr-TR': 'Fiyatlar',
    'uk-UA': 'Ціни',
};

const LANG_MAP = {
    en: 'en-US', ru: 'ru-RU', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', it: 'it-IT',
    ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN', ar: 'ar-SA', hi: 'hi-IN', pt: 'pt-BR',
    pl: 'pl-PL', nl: 'nl-NL', tr: 'tr-TR', uk: 'uk-UA',
};

// ── translations.js: navbar.pricing per locale ─────────────────────────────
const tPath = path.join(ROOT, 'translations.js');
let src = fs.readFileSync(tPath, 'utf8');

for (const [locale, label] of Object.entries(LABEL)) {
    const localeAt = src.indexOf(`    '${locale}': {`);
    if (localeAt < 0) throw new Error(`locale block not found: ${locale}`);
    const navAt = src.indexOf('navbar: {', localeAt);
    const navEnd = src.indexOf('},', navAt);
    if (navAt < 0 || navEnd < 0) throw new Error(`navbar block not found: ${locale}`);
    if (src.slice(navAt, navEnd).includes('pricing:')) {
        console.log(`skip translations ${locale} (already present)`);
        continue;
    }
    const anchor = src.indexOf('download:', navAt);
    if (anchor < 0 || anchor > navEnd) throw new Error(`download key not found: ${locale}`);
    const lineEnd = src.indexOf('\n', anchor);
    src = src.slice(0, lineEnd + 1) + `            pricing: '${label}',\n` + src.slice(lineEnd + 1);
    console.log(`translations ${locale} -> ${label}`);
}
fs.writeFileSync(tPath, src);

// ── locale homepages: nav link + footer link ───────────────────────────────
const NAV_ANCHOR = /(\n(\s*)<a href="#comparison" data-translate="navbar\.comparison">[^<]*<\/a>)/;
const FOOTER_ANCHOR = /(\n(\s*)<a href="\/terms\.html">Terms<\/a>)/;

for (const [folder, locale] of Object.entries(LANG_MAP)) {
    const file = folder === 'en'
        ? path.join(ROOT, 'index.html')
        : path.join(ROOT, folder, 'index.html');
    if (!fs.existsSync(file)) { console.log(`skip ${folder} (no index.html)`); continue; }

    let html = fs.readFileSync(file, 'utf8');
    let touched = false;

    if (!html.includes('data-translate="navbar.pricing"')) {
        if (!NAV_ANCHOR.test(html)) throw new Error(`nav anchor not found: ${file}`);
        html = html.replace(NAV_ANCHOR,
            (m, whole, indent) => `${whole}\n${indent}<a href="/pricing.html" data-translate="navbar.pricing">${LABEL[locale]}</a>`);
        touched = true;
    }

    if (!html.includes('<a href="/pricing.html">Pricing</a>')) {
        if (!FOOTER_ANCHOR.test(html)) throw new Error(`footer anchor not found: ${file}`);
        html = html.replace(FOOTER_ANCHOR,
            (m, whole, indent) => `${whole}\n${indent}&nbsp;·&nbsp;\n${indent}<a href="/pricing.html">Pricing</a>`);
        touched = true;
    }

    if (touched) {
        fs.writeFileSync(file, html);
        console.log(`html ${folder} updated`);
    } else {
        console.log(`html ${folder} already up to date`);
    }
}
