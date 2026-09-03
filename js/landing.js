// landing.js — homepage behaviour for all 16 locales.
//
// Loaded with defer AFTER translations.js so getUserLanguage/applyTranslations exist.
// (An inline <script defer> would have run BEFORE the deferred translations.js and
// thrown, which is why this lives in its own file.)

// ── Locale routing ────────────────────────────────────────────────
const LANG_PATH_MAP = {
'en-US': '', 'fr-FR': 'fr', 'es-ES': 'es', 'de-DE': 'de', 'it-IT': 'it', 'ja-JP': 'ja',
'ko-KR': 'ko', 'zh-CN': 'zh', 'ar-SA': 'ar', 'hi-IN': 'hi', 'pt-BR': 'pt', 'pl-PL': 'pl',
'nl-NL': 'nl', 'tr-TR': 'tr', 'uk-UA': 'uk', 'ru-RU': 'ru',
};
const PATH_LANG_MAP = Object.fromEntries(
Object.entries(LANG_PATH_MAP).filter(([, p]) => p).map(([l, p]) => [p, l])
);

function getPathSegments(pathname = window.location.pathname) {
return pathname.split('/').filter(Boolean);
}
function getSitePrefixSegments(pathname = window.location.pathname) {
const segments = getPathSegments(pathname);
if (segments.length && segments[segments.length - 1].toLowerCase() === 'index.html') segments.pop();
if (segments.length && PATH_LANG_MAP[segments[segments.length - 1]]) segments.pop();
return segments;
}
function getPathSegmentsWithoutBase(pathname = window.location.pathname) {
const segments = getPathSegments(pathname);
if (segments.length && segments[segments.length - 1].toLowerCase() === 'index.html') segments.pop();
return segments;
}
function getPathLanguageCode(pathname = window.location.pathname) {
const segments = getPathSegmentsWithoutBase(pathname);
if (!segments.length) return null;
const last = segments[segments.length - 1];
if (PATH_LANG_MAP[last]) return PATH_LANG_MAP[last];
return PATH_LANG_MAP[segments[0]] || null;
}
function getSitePrefixPath() {
const p = getSitePrefixSegments();
return p.length ? `/${p.join('/')}` : '';
}
function buildLocalizedLandingUrl(lang) {
const pathCode = LANG_PATH_MAP[lang] ?? '';
const prefix = getSitePrefixSegments();
if (pathCode) prefix.push(pathCode);
let target = `/${prefix.length ? `${prefix.join('/')}/` : ''}`;
if (window.location.protocol === 'file:') target += 'index.html';
return target;
}

// ── Typing subtitle demo — mirrors the app's onboarding ───────────
let currentIndex = 0;
let subtitles = [];
const subtitle1 = document.getElementById('subtitle1');
const subtitle2 = document.getElementById('subtitle2');
let typingTimer;

const TYPE_MS = 32;
const HOLD_MS = 1400;
const PAUSE_MS = 450;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// EN visitors see a foreign line translated into English; everyone else sees
// English translated into their own language.
function currentPair(item) {
const lang = localStorage.getItem('preferredLanguage') || getUserLanguage();
const code = lang.split('-')[0];
if (lang === 'en-US') return { original: item.fr, translation: item.en };
return { original: item.en, translation: item[code] || item.en };
}
function scheduleNext() {
typingTimer = setTimeout(() => {
    currentIndex = (currentIndex + 1) % subtitles.length;
    typePhrase();
}, HOLD_MS + PAUSE_MS);
}
function typePhrase() {
if (!subtitles.length) return;
const { original, translation } = currentPair(subtitles[currentIndex]);

if (prefersReduced) {
    subtitle1.textContent = original;
    subtitle2.textContent = translation;
    scheduleNext();
    return;
}

const steps = Math.max(original.length, translation.length);
let i = 0;
subtitle1.classList.add('typing');
subtitle2.classList.add('typing');

(function step() {
    i++;
    subtitle1.textContent = original.slice(0, Math.min(i, original.length));
    subtitle2.textContent = translation.slice(0, Math.min(i, translation.length));
    if (i < steps) {
        typingTimer = setTimeout(step, TYPE_MS);
    } else {
        subtitle1.classList.remove('typing');
        subtitle2.classList.remove('typing');
        scheduleNext();
    }
})();
}
function startSubtitles(lang) {
subtitles = (translations[lang] && translations[lang].examples) || [];
currentIndex = 0;
if (typingTimer) clearTimeout(typingTimer);
subtitle1.textContent = '';
subtitle2.textContent = '';
typePhrase();
}

// The language pair on the mocked control row has to agree with the pair the demo is
// actually typing: EN visitors see fr -> en, everyone else en -> their own language.
function applyFrameLanguages(lang) {
    const from = document.getElementById('frameLangFrom');
    const to = document.getElementById('frameLangTo');
    if (!from || !to) return;
    const nativeName = (code) => {
        const opt = languageSelector && languageSelector.querySelector(`option[value="${code}"]`);
        return opt ? opt.textContent.trim() : null;
    };
    if (lang === 'en-US') {
        from.textContent = nativeName('fr-FR') || 'Français';
        to.textContent = 'English';
    } else {
        from.textContent = 'English';
        to.textContent = nativeName(lang) || to.textContent;
    }
}

// ── Store-listing gallery: phones only, per platform ──────────────
// Both sets sit in <template>s and one is cloned into the page when the
// viewport is a phone. Templates rather than markup + display:none, because
// Chrome downloads a loading="lazy" image inside a hidden block anyway — the
// strip in the document cost every desktop visitor ~400KB of phone screenshots
// for a band that is never shown. Googlebot crawls with a phone viewport, so it
// still gets the gallery.
// Apple visitors get the iOS shots, everyone else the Android ones. Mac counts
// as Apple: someone on a Mac is likelier to also carry an iPhone.
const SHOTS_MQ = '(max-width: 720px)';
function mountShots() {
const holder = document.getElementById('shotsHolder');
if (!holder || holder.firstElementChild) return;
const os = detectOS();
const tpl = document.getElementById(os === 'ios' || os === 'mac' ? 'shotsIos' : 'shotsAndroid');
if (tpl) holder.appendChild(tpl.content.cloneNode(true));
}
function watchShots() {
if (!window.matchMedia) return;
const mq = window.matchMedia(SHOTS_MQ);
if (mq.matches) { mountShots(); return; }
// Resized into phone width later (or a desktop window dragged narrow): mount
// it then, once. addListener is the Safari-13-and-older spelling; without it an
// iPhone on iOS 13 that starts in landscape never gets the band on rotation.
function onNarrow(e) { if (e.matches) mountShots(); }
if (mq.addEventListener) mq.addEventListener('change', onNarrow);
else if (mq.addListener) mq.addListener(onNarrow);
}

// Route the navbar + hero CTAs to the visitor's own store. The pre-JS href stays
// on the Microsoft Store, which is correct for the majority and for crawlers.
// No campaign params here: cid-tracker.js owns those and re-stamps the link
// below, so a ?utm_campaign visit keeps its attribution through the reroute.
const TRYFREE_STORES = {
win: 'https://apps.microsoft.com/detail/9ph1r9djg47s',
mac: 'https://apps.apple.com/app/live-captions-translator/id6760197210?platform=mac',
ios: 'https://apps.apple.com/app/live-captions-translator/id6760197210',
android: 'https://play.google.com/store/apps/details?id=com.livesubtitles.android'
};
function detectOS() {
const ua = navigator.userAgent || '';
const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
if (/iPhone|iPad|iPod/.test(ua) || (/Mac/.test(p) && navigator.maxTouchPoints > 1)) return 'ios';
if (/Android/.test(ua)) return 'android';
if (/Mac/.test(p) || /Macintosh/.test(ua)) return 'mac';
return 'win';
}
function routeTryFree() {
const store = TRYFREE_STORES[detectOS()];
['navTryFree', 'heroTryFree', 'stickyTryFree'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!store) {
        el.setAttribute('href', '#download');
        el.removeAttribute('target');
        el.removeAttribute('onclick');
    } else {
        el.setAttribute('href',
            typeof window.lsStampStoreUrl === 'function' ? window.lsStampStoreUrl(store) : store);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
    }
});
}

// ── Sticky CTA (phones) ───────────────────────────────────────────
// Raised once the hero's own button has scrolled off the top, so the page never
// shows two primary buttons at once, and nothing covers the hero. An
// IntersectionObserver rather than a scroll listener: no per-frame work.
// It is only ever visible below 860px — above that the CSS keeps it hidden.
(function () {
const bar = document.getElementById('stickyCta');
const heroCta = document.querySelector('.hero__cta');
if (!bar || !heroCta || !('IntersectionObserver' in window)) return;
const io = new IntersectionObserver(function (entries) {
    const e = entries[0];
    // Above the viewport, not merely out of it: without the top check the bar
    // would also appear when the hero button is still further down the page.
    const scrolledPast = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.hidden = !scrolledPast;
    document.body.classList.toggle('has-stickycta', scrolledPast);
}, { threshold: 0 });
io.observe(heroCta);
})();

// ── Mobile nav ────────────────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', function () {
const nav = document.getElementById('nav');
const open = nav.classList.toggle('is-open');
this.setAttribute('aria-expanded', String(open));
});

// ── YouTube facades: load the iframe only on click ────────────────
document.querySelectorAll('.video').forEach(function (btn) {
btn.addEventListener('click', function () {
    const id = btn.getAttribute('data-video');
    if (!id || btn.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    frame.title = btn.getAttribute('aria-label') || 'Live Subtitles demo';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    btn.innerHTML = '';
    btn.appendChild(frame);
});
});

// ── Dialogs ───────────────────────────────────────────────────────
const tvModal = document.getElementById('tvModal');
const successModal = document.getElementById('successModal');
document.getElementById('tvOpen').addEventListener('click', function () {
if (typeof applyTranslations === 'function') {
    applyTranslations(localStorage.getItem('preferredLanguage') || getUserLanguage());
}
tvModal.showModal();
});
document.querySelectorAll('dialog [data-close]').forEach(function (btn) {
btn.addEventListener('click', function () { btn.closest('dialog').close(); });
});

document.getElementById('tvEmailForm').addEventListener('submit', async function (e) {
e.preventDefault();
const email = document.getElementById('tvEmail').value;
const form = this;
const submit = form.querySelector('button[type="submit"]');
submit.disabled = true;

try {
    const response = await fetch('https://formspree.io/f/mjkylqjd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            subject: 'Новый запрос на версию для ТВ',
            message: `Пользователь ${email} хочет получить версию для ТВ`
        })
    });
    if (!response.ok) throw new Error('send failed');
    tvModal.close();
    document.getElementById('tvEmail').value = '';
    successModal.showModal();
} catch (error) {
    alert('Something went wrong. Please try again later or email help@live-subtitles.com');
} finally {
    submit.disabled = false;
}
});

// ── Language selector ─────────────────────────────────────────────
const languageSelector = document.getElementById('languageSelector');
languageSelector.addEventListener('change', function (e) {
const lang = e.target.value;
localStorage.setItem('preferredLanguage', lang);
window.location.href = buildLocalizedLandingUrl(lang);
});

function updateFooterArticlesLink() {
const lang = localStorage.getItem('preferredLanguage') || getUserLanguage();
const code = lang.split('-')[0];
const link = document.getElementById('footer-articles-link');
if (!link) return;
const supported = ['en', 'ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt', 'pl', 'nl', 'tr', 'uk'];
const articleLang = supported.includes(code) ? code : 'en';
link.href = `${getSitePrefixPath()}/articles/${articleLang}/`;
const label = translations[lang] && translations[lang].footer && translations[lang].footer.articles;
if (label) link.textContent = label;
}

// Pick up the locale from the URL so /ru/ does not need localStorage.
(function () {
const lang = getPathLanguageCode();
if (lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang.split('-')[0];
}
})();

(function init() {
    const lang = getUserLanguage();
    if (languageSelector) languageSelector.value = lang;
    startSubtitles(lang);
    applyFrameLanguages(lang);
    watchShots();
    routeTryFree();
    updateFooterArticlesLink();
})();
languageSelector.addEventListener('change', updateFooterArticlesLink);
