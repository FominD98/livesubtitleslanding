// Exercise cid-tracker.js against a stub DOM: does every store link come out
// with the right campaign params for a given landing path?
// Usage: node _test_cid_tracker.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, 'cid-tracker.js'), 'utf8');

function makeLink(href) {
    const el = { href, _attrs: {}, _listeners: [] };
    el.getAttribute = k => (k === 'href' ? el.href : (el._attrs[k] || null));
    el.setAttribute = (k, v) => { if (k === 'href') el.href = v; else el._attrs[k] = v; };
    el.removeAttribute = k => { delete el._attrs[k]; };
    el.addEventListener = (t, f) => el._listeners.push([t, f]);
    return el;
}

function run(pathname, search) {
    const links = {
        ms: makeLink('https://apps.microsoft.com/detail/9ph1r9djg47s'),
        mac: makeLink('https://apps.apple.com/app/live-captions-translator/id6760197210?platform=mac'),
        ios: makeLink('https://apps.apple.com/app/live-captions-translator/id6760197210'),
        play: makeLink('https://play.google.com/store/apps/details?id=com.livesubtitles.android'),
    };
    const tv = makeLink('#');
    const store = {};
    const sandbox = {
        URL, URLSearchParams, console,
        location: { search, pathname, origin: 'https://live-subtitles.com' },
        sessionStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; } },
        document: {
            readyState: 'complete',
            addEventListener() {},
            querySelectorAll(sel) {
                if (sel.includes('apps.microsoft.com')) return [links.ms];
                if (sel.includes('apps.apple.com')) return [links.mac, links.ios];
                if (sel.includes('play.google.com')) return [links.play];
                if (sel.includes('#tvModal')) return [tv];
                return [];
            },
        },
        window: {},
    };
    vm.runInNewContext(SRC, sandbox);
    return { links, tv };
}

function param(href, key) {
    return new URL(href).searchParams.get(key);
}

let fail = 0;
function eq(actual, expected, label) {
    const ok = actual === expected;
    if (!ok) fail++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}\n         = ${actual}${ok ? '' : `\n    ожид = ${expected}`}`);
}

console.log('— органика, главная (/) —');
let r = run('/', '');
eq(param(r.links.ms.href, 'cid'), 'site_organic', 'MS cid');
eq(param(r.links.ios.href, 'ct'), 'org', 'Apple ct');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=live-subtitles.com&utm_medium=referral&utm_campaign=site_organic', 'Play referrer');

console.log('\n— органика, длинный слаг (/live-translation-software-comparison.html) —');
r = run('/live-translation-software-comparison.html', '');
eq(param(r.links.ms.href, 'cid'), 'site_organic_live_translation_software_comparison', 'MS cid');
const ct = param(r.links.ios.href, 'ct');
eq(ct, 'org_live_translation_software_comparison', 'Apple ct');
eq(String(ct.length <= 40), 'true', 'Apple ct <= 40 символов');
eq(param(r.links.mac.href, 'platform'), 'mac', 'Mac-ссылка сохранила platform=mac');

console.log('\n— органика, локаль (/ru/zoom-live-captions.html) —');
r = run('/ru/zoom-live-captions.html', '');
eq(param(r.links.ms.href, 'cid'), 'site_organic_ru_zoom_live_captions', 'MS cid');
eq(param(r.links.ios.href, 'ct'), 'org_ru_zoom_live_captions', 'Apple ct');

console.log('\n— размеченный переход (?utm_campaign=yt_review_jan) —');
r = run('/', '?utm_campaign=yt_review_jan');
eq(param(r.links.ms.href, 'cid'), 'yt_review_jan', 'MS cid');
eq(param(r.links.ios.href, 'ct'), 'yt_review_jan', 'Apple ct');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=live-subtitles.com&utm_medium=referral&utm_campaign=yt_review_jan', 'Play referrer');

console.log('\n— повторный прогон не должен дублировать параметры —');
r = run('/', '');
const before = r.links.play.href;
eq(before.split('referrer=').length - 1, 1, 'ровно один referrer');
eq(r.links.ios.href.split('ct=').length - 1, 1, 'ровно один ct');

console.log('\n— цели навешаны —');
eq(String(r.links.play._listeners.length), '1', 'Play: обработчик клика');
eq(String(r.tv._listeners.length), '1', 'TV: обработчик клика');
eq(r.links.play._attrs.onclick, undefined, 'Play: onclick не ставится без gtag_report_conversion');

console.log(fail ? `\n${fail} проверок провалено` : '\nВсе проверки прошли.');
process.exit(fail ? 1 : 0);
