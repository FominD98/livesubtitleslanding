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

// Rough stand-ins for the four platforms detectOS() distinguishes.
const UA = {
    win: { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32', touch: 0 },
    mac: { ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', platform: 'MacIntel', touch: 0 },
    ios: { ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', platform: 'iPhone', touch: 5 },
    android: { ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)', platform: 'Linux armv8l', touch: 5 },
};

function run(pathname, search, os, ctaText) {
    os = os || 'win';
    const links = {
        ms: makeLink('https://apps.microsoft.com/detail/9ph1r9djg47s'),
        mac: makeLink('https://apps.apple.com/app/live-captions-translator/id6760197210?platform=mac'),
        ios: makeLink('https://apps.apple.com/app/live-captions-translator/id6760197210'),
        play: makeLink('https://play.google.com/store/apps/details?id=com.livesubtitles.android'),
    };
    // The platform pages' primary CTA, hardcoded to the Microsoft Store.
    const cta = makeLink('https://apps.microsoft.com/store/detail/9PH1R9DJG47S');
    cta.textContent = ctaText || 'Download Live Subtitles — Free Trial';
    // A store name mentioned in body copy — must never be rewritten.
    const prose = makeLink('https://apps.microsoft.com/store/detail/9PH1R9DJG47S');
    prose.textContent = 'Microsoft Store';

    const tv = makeLink('#');
    const store = {};
    const sandbox = {
        URL, URLSearchParams, console,
        navigator: { userAgent: UA[os].ua, platform: UA[os].platform, maxTouchPoints: UA[os].touch },
        location: { search, pathname, origin: 'https://live-subtitles.com' },
        sessionStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; } },
        document: {
            readyState: 'complete',
            addEventListener() {},
            querySelectorAll(sel) {
                if (sel.indexOf('a.cta') === 0) {
                    return [cta, prose].filter(l => l === cta && l.href.includes('apps.microsoft.com'));
                }
                if (sel.includes('apps.microsoft.com')) {
                    return [links.ms, cta, prose].filter(l => l.href.includes('apps.microsoft.com'));
                }
                if (sel.includes('apps.apple.com')) {
                    return [links.mac, links.ios, cta].filter(l => l.href.includes('apps.apple.com'));
                }
                if (sel.includes('play.google.com')) {
                    return [links.play, cta].filter(l => l.href.includes('play.google.com'));
                }
                if (sel.includes('#tvModal')) return [tv];
                return [];
            },
        },
        window: {},
    };
    vm.runInNewContext(SRC, sandbox);
    return { links, tv, cta, prose };
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

console.log('\n— маршрутизация главной кнопки платформенных страниц —');
const EXPECT = {
    win: 'https://apps.microsoft.com/store/detail/9PH1R9DJG47S',
    mac: 'https://apps.apple.com/app/live-captions-translator/id6760197210?platform=mac',
    ios: 'https://apps.apple.com/app/live-captions-translator/id6760197210',
    android: 'https://play.google.com/store/apps/details?id=com.livesubtitles.android',
};
// Compare the link with the campaign params stripped — those are asserted below.
function withoutCampaign(href) {
    const u = new URL(href);
    ['cid', 'ct', 'referrer'].forEach(k => u.searchParams.delete(k));
    return u.toString().replace(/\?$/, '');
}
for (const os of ['win', 'mac', 'ios', 'android']) {
    r = run('/zoom-live-captions.html', '', os);
    eq(withoutCampaign(r.cta.href), EXPECT[os], `${os}: кнопка ведёт в свой стор`);
}

console.log('\n— кнопка получает разметку кампании того стора, куда её перенаправили —');
r = run('/zoom-live-captions.html', '', 'android');
eq(param(r.cta.href, 'referrer'),
    'utm_source=live-subtitles.com&utm_medium=referral&utm_campaign=site_organic_zoom_live_captions',
    'android: referrer, а не cid');
eq(param(r.cta.href, 'cid'), null, 'android: чужой cid не прилип');
r = run('/zoom-live-captions.html', '', 'mac');
eq(param(r.cta.href, 'ct'), 'org_zoom_live_captions', 'mac: ct проставлен');
r = run('/zoom-live-captions.html', '', 'win');
eq(param(r.cta.href, 'cid'), 'site_organic_zoom_live_captions', 'win: cid проставлен');

console.log('\n— подпись со стором переписывается, текст в статье — нет —');
r = run('/zoom-live-captions.html', '', 'mac', 'Start free trial — Microsoft Store');
eq(r.cta.textContent, 'Start free trial — Mac App Store', 'mac: подпись обновлена');
r = run('/zoom-live-captions.html', '', 'android', 'Start free trial — Microsoft Store');
eq(r.cta.textContent, 'Start free trial — Google Play', 'android: подпись обновлена');
r = run('/zoom-live-captions.html', '', 'ios', 'Скачать Live Subtitles');
eq(r.cta.textContent, 'Скачать Live Subtitles', 'нейтральная подпись не тронута');
r = run('/zoom-live-captions.html', '', 'mac');
eq(r.prose.textContent, 'Microsoft Store', 'упоминание стора в тексте не тронуто');
eq(r.prose.href.indexOf('apps.microsoft.com') > -1 ? 'ms' : 'изменена', 'ms', 'ссылка в тексте осталась на MS');

console.log(fail ? `\n${fail} проверок провалено` : '\nВсе проверки прошли.');
process.exit(fail ? 1 : 0);
