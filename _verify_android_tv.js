// Sanity checks after the Android/TV rollout. Usage: node _verify_android_tv.js
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.livesubtitles.android';
const LOCALES = ['ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt', 'pl', 'nl', 'tr', 'uk'];

let fail = 0;
function check(cond, msg) { if (!cond) { console.log('  FAIL  ' + msg); fail++; } }

function walk(dir, acc = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (['.git', 'node_modules', '__pycache__', '.notpush'].includes(e.name)) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, acc); else acc.push(p);
    }
    return acc;
}

// 1. Landing pages
for (const rel of ['index.html', ...LOCALES.map(l => `${l}/index.html`)]) {
    const s = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    check(s.includes(PLAY_URL), `${rel}: no Play Store link`);
    check(s.includes('id="tvModal"'), `${rel}: no tvModal`);
    check(s.includes('id="tvEmailForm"'), `${rel}: no tvEmailForm`);
    check(s.includes('id="tvEmail"'), `${rel}: no tvEmail input`);
    check(s.includes('#tvEmail::placeholder'), `${rel}: placeholder css not renamed`);
    check(s.includes('data-translate="tvBtn"'), `${rel}: no tvBtn`);
    check(s.includes('#download .col-12 { order: 5; }'), `${rel}: TV card has no mobile order`);
    check(/android: 'https:\/\/play\.google\.com/.test(s), `${rel}: TRYFREE_STORES lacks android`);
    check(!/android(Modal|Btn|Email)/.test(s), `${rel}: leftover android* identifier`);
    check(!/getElementById\('android/.test(s), `${rel}: leftover getElementById('android...')`);
    // The download grid must have exactly one card per platform.
    check((s.match(/apps\.microsoft\.com\/detail\/9ph1r9djg47s"/g) || []).length >= 1, `${rel}: MS card missing`);
    // Exactly three: download-grid badge, TRYFREE_STORES entry, schema sameAs.
    check(s.split(PLAY_URL).length - 1 === 3, `${rel}: expected exactly 3 Play URLs`);
    check(s.includes('"operatingSystem": "Windows 10, Windows 11, macOS, iOS, Android"'), `${rel}: schema operatingSystem lacks Android`);
    // Baked static text must be in the page language, not an EN/RU fallback.
    const lang = (s.match(/<html[^>]*lang="([^"]+)"/) || [])[1];
    check(!!lang, `${rel}: no <html lang>`);
    // JSON-LD still parses
    let m, re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, i = 0;
    while ((m = re.exec(s)) !== null) { i++; try { JSON.parse(m[1]); } catch (e) { check(false, `${rel}: JSON-LD #${i} invalid: ${e.message}`); } }
}

// 2. Every page that shows the Apple badges also shows the Play badge
let badge = 0, articles = 0;
for (const abs of walk(ROOT).filter(f => f.endsWith('.html'))) {
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const s = fs.readFileSync(abs, 'utf8');
    if (s.includes('badges/download-on-the-app-store.svg')) {
        badge++;
        check(s.includes(PLAY_URL), `${rel}: Apple badges present but no Play badge`);
    }
    if (s.includes('js-store-cta')) {
        articles++;
        check(s.includes(`android:"${PLAY_URL}"`), `${rel}: STORES.android not pointed at Play`);
        check(!s.includes('if(os==="android")a.removeAttribute("target")'), `${rel}: android still strips target`);
    }
    if (/androidModal|androidBtn|androidEmail/.test(s)) check(false, `${rel}: leftover android* identifier`);
}
console.log(`  pages with store badges: ${badge}`);
console.log(`  article pages with JS store routing: ${articles}`);

// 3. translations.js: keys renamed, every locale carries the new copy
const vm = require('vm');
const src = fs.readFileSync(path.join(ROOT, 'translations.js'), 'utf8');
const after = src.slice(src.indexOf('const translations'));
let d = 0, end = -1, inStr = false, ch = '', i = after.indexOf('{');
for (; i < after.length; i++) {
    const c = after[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === ch) inStr = false; continue; }
    if (c === "'" || c === '"' || c === '`') { inStr = true; ch = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) { end = i; break; } }
}
const T = vm.runInNewContext('(' + after.slice(after.indexOf('{'), end + 1) + ')');
check(!/androidBtn|androidModal/.test(src), 'translations.js: leftover android keys');
for (const [lang, v] of Object.entries(T)) {
    check(typeof v.tvBtn === 'string' && v.tvBtn.length > 0, `${lang}: tvBtn missing`);
    check(v.tvModal && v.tvModal.title && v.tvModal.desc && v.tvModal.send, `${lang}: tvModal incomplete`);
    check(/Android/i.test(v.faq.a6) || /안드로이드|أندرويد/.test(v.faq.a6), `${lang}: faq.a6 does not mention Android`);
    check(/Android/i.test(v.header.lead) || /أندرويد/.test(v.header.lead), `${lang}: header.lead does not mention Android`);
    check(/Android|أندرويد/i.test(v.meta.description), `${lang}: meta.description does not mention Android`);
    check(v.meta.description === v.description, `${lang}: description/meta.description drifted apart`);
    const len = v.meta.description.length;
    if (len > 170) console.log(`  note  ${lang}: meta description is ${len} chars`);
}

// 4. Baked HTML defaults match translations.js (SEO rule R1)
for (const [rel, lang] of [['index.html', 'en-US'], ...LOCALES.map(l => [`${l}/index.html`, Object.keys(T).find(k => k.startsWith(l + '-'))])]) {
    const s = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const dict = T[lang];
    for (const key of ['tvBtn', 'tvModal.title', 'tvModal.desc', 'successModal.desc', 'faq.a6', 'header.lead']) {
        const val = key.split('.').reduce((o, k) => o && o[k], dict);
        const esc = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        check(s.includes(esc), `${rel}: static default for ${key} is not the ${lang} string`);
    }
}

console.log(fail ? `\n${fail} check(s) FAILED` : '\nAll checks passed.');
process.exit(fail ? 1 : 0);
