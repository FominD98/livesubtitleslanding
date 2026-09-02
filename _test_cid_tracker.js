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

// `preset` заполняет sessionStorage до прогона — так проверяется переход
// внутри сайта, где метка приезжает не из URL, а из предыдущей страницы.
function run(pathname, search, os, ctaText, preset) {
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
    const store = Object.assign({}, preset || {});
    const goals = [];
    const ga4 = [];
    const sandbox = {
        URL, URLSearchParams, console,
        navigator: { userAgent: UA[os].ua, platform: UA[os].platform, maxTouchPoints: UA[os].touch },
        location: { search, pathname, origin: 'https://live-subtitles.com' },
        sessionStorage: {
            getItem: k => store[k] || null,
            setItem: (k, v) => { store[k] = v; },
            removeItem: k => { delete store[k]; },
        },
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
        window: {
            ym: (id, action, name) => { if (action === 'reachGoal') goals.push(name); },
            gtag: (kind, name, params) => ga4.push({ kind, name, params }),
        },
    };
    vm.runInNewContext(SRC, sandbox);
    return { links, tv, cta, prose, goals, ga4, store };
}

// Клик по ссылке. _listeners хранит пары [тип, обработчик]; вызываем как браузер —
// с this, указывающим на саму ссылку.
function click(link) {
    (link._listeners || [])
        .filter(([type]) => type === 'click')
        .forEach(([, fn]) => fn.call(link));
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

console.log('\n— платный переход: source/medium едут в Play из ссылки —');
r = run('/', '?utm_source=google&utm_medium=cpc&utm_campaign=gads_us_captions');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=google&utm_medium=cpc&utm_campaign=gads_us_captions', 'Play referrer');
eq(param(r.links.ms.href, 'cid'), 'gads_us_captions', 'MS берёт только кампанию');
eq(param(r.links.ios.href, 'ct'), 'gads_us_captions', 'Apple берёт только кампанию');
eq(JSON.stringify(r.store),
    '{"lsCid":"gads_us_captions","lsUtmSource":"google","lsUtmMedium":"cpc"}', 'вся тройка в сессии');

console.log('\n— метка держится при переходе на другую страницу сайта —');
r = run('/pricing.html', '', 'win', null,
    { lsCid: 'gads_us_captions', lsUtmSource: 'google', lsUtmMedium: 'cpc' });
eq(param(r.links.play.href, 'referrer'),
    'utm_source=google&utm_medium=cpc&utm_campaign=gads_us_captions', 'Play referrer из сессии');

console.log('\n— source без кампании: канал известен, кампания органическая —');
r = run('/', '?utm_source=reddit&utm_medium=social');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=reddit&utm_medium=social&utm_campaign=site_organic', 'Play referrer');

console.log('\n— новая кампания без source не наследует прежний канал —');
r = run('/', '?utm_campaign=newsletter_sep', 'win', null,
    { lsCid: 'gads_us_captions', lsUtmSource: 'google', lsUtmMedium: 'cpc' });
eq(param(r.links.play.href, 'referrer'),
    'utm_source=live-subtitles.com&utm_medium=referral&utm_campaign=newsletter_sep', 'Play referrer');

console.log('\n— грязные значения нормализуются, а не уезжают в отчёты как есть —');
r = run('/', '?utm_source=Yandex%20Ads&utm_medium=%7Bsource_type%7D&utm_campaign=promo%20sale');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=yandex_ads&utm_medium=source_type&utm_campaign=promo_sale', 'Play referrer');
eq(param(r.links.ms.href, 'cid'), 'promo_sale', 'MS cid без пробела');

console.log('\n— & в кампании не подделывает лишние utm-ключи —');
r = run('/', '?utm_source=partner&utm_medium=email&utm_campaign=a%26utm_source%3Dhacked');
eq(param(r.links.play.href, 'referrer'),
    'utm_source=partner&utm_medium=email&utm_campaign=a_utm_source_hacked', 'Play referrer');

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
// pt/mt ride along with the Apple ct: App Analytics ignores a campaign token
// that arrives without the provider token.
function withoutCampaign(href) {
    const u = new URL(href);
    ['cid', 'ct', 'referrer', 'pt', 'mt'].forEach(k => u.searchParams.delete(k));
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
eq(param(r.cta.href, 'pt'), '128624979', 'mac: pt проставлен');
eq(param(r.cta.href, 'mt'), '8', 'mac: mt проставлен');
r = run('/zoom-live-captions.html', '', 'ios');
eq(param(r.cta.href, 'pt'), '128624979', 'ios: pt проставлен');
eq(param(r.cta.href, 'cid'), null, 'ios: cid не прилип к Apple-ссылке');
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

console.log('\n— клик шлёт цель Метрики и событие GA4 —');
r = run('/zoom-live-captions.html', '', 'win');
click(r.links.ms);
eq(String(r.goals.includes('store_click_any') && r.goals.includes('store_click_windows')),
    'true', 'win: цели Метрики отправлены');
const ev = r.ga4.find(e => e.name === 'store_click');
eq(String(!!ev), 'true', 'win: событие GA4 store_click отправлено');
eq(ev && ev.params.store, 'microsoft', 'win: GA4 знает стор');
eq(ev && ev.params.campaign_id, 'site_organic_zoom_live_captions', 'win: GA4 несёт campaign_id');

r = run('/', '', 'win');
click(r.links.play);
eq((r.ga4.find(e => e.name === 'store_click') || {}).params.store, 'google_play', 'play: GA4 знает стор');
r = run('/', '', 'win');
click(r.links.mac);
eq((r.ga4.find(e => e.name === 'store_click') || {}).params.store, 'mac_app_store', 'mac: GA4 знает стор');

console.log(fail ? `\n${fail} проверок провалено` : '\nВсе проверки прошли.');
process.exit(fail ? 1 : 0);
