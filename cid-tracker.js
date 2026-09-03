// Store-link instrumentation. Routes the primary CTA to the visitor's own
// store, stamps every store link with a campaign id so the store consoles can
// attribute the install back to the page it came from, and fires Yandex Metrika
// goals for the click itself.
//
// Campaign id (`cidToSet`): incoming ?utm_campaign / ?cid if present, otherwise
// derived from the pathname -> `site_organic_<page_slug>`.
// Source/medium (`playSource` / `playMedium`): incoming ?utm_source /
// ?utm_medium if present, otherwise the organic `live-subtitles.com` /
// `referral` pair. Only Play carries them; MS and Apple take a campaign only.
//
// Per store:
//   Microsoft Store  ?cid=<id>        -> Partner Center > Acquisitions > Custom campaign
//   App Store        ?ct=<id>         -> App Store Connect > App Analytics > Campaigns
//                                        (shortened to Apple's 40-char cap, see toAppleCt)
//   Google Play      ?referrer=utm_source=...&utm_medium=...&utm_campaign=<id>
//                                     -> Play Console > Acquisition reports > User acquisition,
//                                        and the app can read it via the Install Referrer API
//
// Metrika goals fired here (create them in the counter or they record nothing):
//   store_click_any, store_click_windows, store_click_mac, store_click_ios,
//   store_click_android, tv_interest
(function () {
    var YM_COUNTER = 101009280;
    var APPLE_PT = '128624979';
    var params = new URLSearchParams(location.search);
    var incoming = params.get('utm_campaign') || params.get('cid');
    var incomingSource = params.get('utm_source');
    var incomingMedium = params.get('utm_medium');
    // Any utm-bearing entry is a fresh touch, so the whole triple is rewritten
    // at once: pairing a new campaign with the previous visit's source would
    // file the install under a channel it did not come from.
    if (incoming || incomingSource || incomingMedium) {
        try {
            setOrClear('lsCid', incoming);
            setOrClear('lsUtmSource', incomingSource);
            setOrClear('lsUtmMedium', incomingMedium);
        } catch (e) { /* private mode */ }
    }
    function setOrClear(key, value) {
        if (value) sessionStorage.setItem(key, value);
        else sessionStorage.removeItem(key);
    }

    var campaign = '';
    var utmSource = '';
    var utmMedium = '';
    try {
        campaign = sessionStorage.getItem('lsCid') || '';
        utmSource = sessionStorage.getItem('lsUtmSource') || '';
        utmMedium = sessionStorage.getItem('lsUtmMedium') || '';
    } catch (e) {
        campaign = incoming || '';
        utmSource = incomingSource || '';
        utmMedium = incomingMedium || '';
    }

    function pathToCid() {
        var p = location.pathname || '/';
        p = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '');
        p = p.replace(/^\/+|\/+$/g, '');
        if (!p) return 'site_organic';
        var slug = p.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
        if (!slug) return 'site_organic';
        var cid = 'site_organic_' + slug;
        return cid.length > 64 ? cid.slice(0, 64).replace(/_+$/, '') : cid;
    }

    // The incoming campaign reaches three store consoles verbatim, so the same
    // charset rule as the organic ids applies to it: a space, cyrillic or an
    // unexpanded ad-platform macro would otherwise show up percent-encoded in
    // the reports, and a bare `&` inside it would forge extra utm keys in the
    // Play referrer. Case is preserved — live campaigns are already named.
    var CID_MAX = 64;
    function toCampaignId(raw) {
        if (!raw) return '';
        var v = String(raw).trim()
            .replace(/[^A-Za-z0-9._-]+/g, '_')
            .replace(/^[._-]+|[._-]+$/g, '');
        if (!v) return '';
        return v.length > CID_MAX ? v.slice(0, CID_MAX).replace(/[._-]+$/, '') : v;
    }

    var cidToSet = toCampaignId(campaign) || pathToCid();

    // Apple's App Analytics campaign token is capped at 40 chars; our ids run up
    // to 49. Trading the `site_organic_` prefix for `org_` fits every current
    // page (max 40, no collisions across 908 pages). A future page with a very
    // long slug would get truncated on an underscore boundary.
    var APPLE_CT_MAX = 40;
    function toAppleCt(id) {
        if (id === 'site_organic') return 'org';
        var t = id.indexOf('site_organic_') === 0 ? 'org_' + id.slice(13) : id;
        return t.length > APPLE_CT_MAX ? t.slice(0, APPLE_CT_MAX).replace(/_+$/, '') : t;
    }
    var appleCt = toAppleCt(cidToSet);

    // Play Console shows source/medium verbatim, so an unsanitised value from
    // the ad link (spaces, cyrillic, an unexpanded {source_type} macro) would
    // land in the report as percent-encoded noise and split one channel across
    // several rows. Anything outside the utm charset collapses to `_`.
    var UTM_VALUE_MAX = 64;
    function toUtmValue(raw, fallback) {
        if (!raw) return fallback;
        var v = String(raw).trim().toLowerCase()
            .replace(/[^a-z0-9._-]+/g, '_')
            .replace(/^[._-]+|[._-]+$/g, '');
        if (!v) return fallback;
        return v.length > UTM_VALUE_MAX ? v.slice(0, UTM_VALUE_MAX).replace(/[._-]+$/, '') : v;
    }
    var playSource = toUtmValue(utmSource, 'live-subtitles.com');
    var playMedium = toUtmValue(utmMedium, 'referral');

    function reachGoal(name) {
        if (typeof window.ym === 'function') {
            try { window.ym(YM_COUNTER, 'reachGoal', name); } catch (e) { /* counter not ready */ }
        }
    }

    // GA4 получает одно событие store_click с параметрами вместо пяти отдельных
    // целей: в отчётах GA4 разрез по параметру удобнее, чем зоопарк имён.
    function ga4StoreClick(store, url) {
        if (typeof window.gtag !== 'function') return;
        try {
            window.gtag('event', 'store_click', {
                store: store,
                campaign_id: cidToSet,
                page_path: location.pathname,
                link_url: url || ''
            });
        } catch (e) { /* gtag not ready */ }
    }

    var STORES = {
        win: 'https://apps.microsoft.com/detail/9ph1r9djg47s',
        mac: 'https://apps.apple.com/app/live-captions-translator/id6760197210?platform=mac',
        ios: 'https://apps.apple.com/app/live-captions-translator/id6760197210',
        android: 'https://play.google.com/store/apps/details?id=com.livesubtitles.android'
    };
    var STORE_LABEL = {
        win: 'Microsoft Store', mac: 'Mac App Store', ios: 'App Store', android: 'Google Play'
    };

    function detectOS() {
        var ua = navigator.userAgent || '';
        var p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
        if (/iPhone|iPad|iPod/.test(ua) || (/Mac/.test(p) && navigator.maxTouchPoints > 1)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        if (/Mac/.test(p) || /Macintosh/.test(ua)) return 'mac';
        return 'win';
    }

    // The platform/language pages hardcode their primary CTA to the Microsoft
    // Store, so a Mac/iPhone/Android visitor is sent to a store they cannot
    // install from. Point it at their own store instead. Windows is left alone,
    // which keeps the pre-JS href correct for the majority and for crawlers.
    // index.html and the articles route their own CTAs inline; this only touches
    // `a.cta`, never the store names mentioned in body copy.
    function routeStoreCta() {
        var os = detectOS();
        if (os === 'win') return;
        var href = STORES[os];
        if (!href) return;
        var ctas = document.querySelectorAll('a.cta[href*="apps.microsoft.com"]');
        for (var i = 0; i < ctas.length; i++) {
            var a = ctas[i];
            a.href = href;
            a.setAttribute('rel', 'noopener');
            // "Start free trial — Microsoft Store" would now be a lie.
            if (a.textContent && a.textContent.indexOf('Microsoft Store') !== -1) {
                a.textContent = a.textContent.replace('Microsoft Store', STORE_LABEL[os]);
            }
        }
    }

    function storeKind(href) {
        if (href.indexOf('apps.microsoft.com') !== -1) return 'ms';
        if (href.indexOf('apps.apple.com') !== -1) {
            return href.indexOf('platform=mac') !== -1 ? 'mac' : 'ios';
        }
        if (href.indexOf('play.google.com/store/apps') !== -1) return 'play';
        return '';
    }

    // Adds the store's own campaign params to a store URL. Exported below,
    // because js/landing.js re-points the homepage CTAs to the visitor's store
    // after this script has run — it has to re-stamp what it rewrites, or the
    // main button on the site loses its attribution entirely.
    function stampStoreUrl(href) {
        var kind = storeKind(href || '');
        if (!kind) return href;
        try {
            var u = new URL(href, location.origin);
            if (kind === 'ms') {
                u.searchParams.set('cid', cidToSet);
            } else if (kind === 'play') {
                // Play Store install attribution rides on a single `referrer`
                // param holding a urlencoded utm string. Play Console needs
                // utm_source + utm_medium to attribute the install at all;
                // utm_campaign carries our per-page cid. Paid traffic passes
                // its own source/medium through so Play Console separates the
                // ad networks instead of filing them all as our referral.
                // Built through URLSearchParams: a raw `&` or `=` inside a
                // campaign name would otherwise forge extra utm keys.
                if (!u.searchParams.has('referrer')) {
                    var ref = new URLSearchParams();
                    ref.set('utm_source', playSource);
                    ref.set('utm_medium', playMedium);
                    ref.set('utm_campaign', cidToSet);
                    u.searchParams.set('referrer', ref.toString());
                }
            } else {
                // Tag organic traffic too, not just links arrived at with a
                // ?utm_campaign — otherwise App Store Connect attributes every
                // organic install to "unknown", unlike MS and Play.
                if (!u.searchParams.has('ct')) {
                    u.searchParams.set('ct', appleCt);
                }
                // Без pt (Provider Token из App Store Connect) кампания в App
                // Analytics не регистрируется — один ct сам по себе не считается.
                if (!u.searchParams.has('pt')) {
                    u.searchParams.set('pt', APPLE_PT);
                    u.searchParams.set('mt', '8');
                }
            }
            return u.toString();
        } catch (e) {
            return href; /* malformed URL — leave it alone */
        }
    }
    window.lsStampStoreUrl = stampStoreUrl;

    // The download grid is authored Windows-first — right for the crawler and
    // for most visitors, but it leaves an Android visitor scanning past three
    // badges they cannot install from. Put their own store first, using CSS
    // `order` rather than moving nodes: the DOM stays as authored, so the
    // reading order and what a crawler sees do not change. Runs on the 16
    // homepages and on pricing.html, which share this markup.
    var OS_KIND = { win: 'ms', mac: 'mac', ios: 'ios', android: 'play' };
    // Same vendor, same account: on either Apple platform the other one is the
    // likeliest second choice.
    var KIND_SIBLING = { ios: 'mac', mac: 'ios' };
    function orderStoreCards() {
        var want = OS_KIND[detectOS()];
        var cards = document.querySelectorAll('.stores .store');
        for (var i = 0; i < cards.length; i++) {
            var link = cards[i].querySelector('a[href]');
            if (!link) continue;
            var kind = storeKind(link.getAttribute('href') || '');
            if (!kind) continue;
            cards[i].style.order = kind === want ? '-2'
                : (kind === KIND_SIBLING[want] ? '-1' : '0');
        }
    }

    var CLICK_GOAL = {
        ms: 'store_click_windows', mac: 'store_click_mac',
        ios: 'store_click_ios', play: 'store_click_android'
    };
    var GA4_STORE = {
        ms: 'microsoft', mac: 'mac_app_store', ios: 'app_store', play: 'google_play'
    };
    // The store is read off the href at click time, not at bind time: a link
    // bound as Microsoft may since have been re-pointed at another store.
    function onStoreClick() {
        var kind = storeKind(this.href || '');
        if (!kind) return;
        reachGoal('store_click_any');
        reachGoal(CLICK_GOAL[kind]);
        ga4StoreClick(GA4_STORE[kind], this.href);
    }

    function instrumentLinks(selector) {
        var links = document.querySelectorAll(selector);
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            a.href = stampStoreUrl(a.href);
            if (typeof gtag_report_conversion === 'function' && !a.getAttribute('onclick')) {
                a.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
            }
            a.addEventListener('click', onStoreClick);
        }
    }

    function instrument() {
        // Must run first: the stamping below is per store, so the CTA has to
        // already point at its final store.
        routeStoreCta();

        instrumentLinks('a[href*="apps.microsoft.com"]');
        instrumentLinks('a[href*="apps.apple.com"]');
        instrumentLinks('a[href*="play.google.com/store/apps"]');

        orderStoreCards();

        var tvTriggers = document.querySelectorAll('[data-bs-target="#tvModal"]');
        for (var m = 0; m < tvTriggers.length; m++) {
            tvTriggers[m].addEventListener('click', function () {
                reachGoal('tv_interest');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', instrument);
    } else {
        instrument();
    }
})();
