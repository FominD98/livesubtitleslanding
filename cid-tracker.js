// Store-link instrumentation. Routes the primary CTA to the visitor's own
// store, stamps every store link with a campaign id so the store consoles can
// attribute the install back to the page it came from, and fires Yandex Metrika
// goals for the click itself.
//
// Campaign id (`cidToSet`): incoming ?utm_campaign / ?cid if present, otherwise
// derived from the pathname -> `site_organic_<page_slug>`.
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
    if (incoming) {
        try { sessionStorage.setItem('lsCid', incoming); } catch (e) { /* private mode */ }
    }
    var campaign = '';
    try { campaign = sessionStorage.getItem('lsCid') || ''; } catch (e) { campaign = incoming || ''; }

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

    var cidToSet = campaign || pathToCid();

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

    function instrument() {
        // Must run first: the loops below stamp campaign params per store, so the
        // CTA has to already point at its final store.
        routeStoreCta();

        var msLinks = document.querySelectorAll('a[href*="apps.microsoft.com"]');
        for (var i = 0; i < msLinks.length; i++) {
            var a = msLinks[i];
            try {
                var u = new URL(a.href, location.origin);
                u.searchParams.set('cid', cidToSet);
                a.href = u.toString();
                if (typeof gtag_report_conversion === 'function' && !a.getAttribute('onclick')) {
                    a.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
                }
                a.addEventListener('click', function () {
                    reachGoal('store_click_any');
                    reachGoal('store_click_windows');
                    ga4StoreClick('microsoft', this.href);
                });
            } catch (e) { /* malformed URL — skip */ }
        }

        var appleLinks = document.querySelectorAll('a[href*="apps.apple.com"]');
        for (var j = 0; j < appleLinks.length; j++) {
            var b = appleLinks[j];
            try {
                // Tag organic traffic too, not just links arrived at with a
                // ?utm_campaign — otherwise App Store Connect attributes every
                // organic install to "unknown", unlike MS and Play.
                var v = new URL(b.href, location.origin);
                if (!v.searchParams.has('ct')) {
                    v.searchParams.set('ct', appleCt);
                }
                // Без pt (Provider Token из App Store Connect) кампания в App
                // Analytics не регистрируется — один ct сам по себе не считается.
                if (!v.searchParams.has('pt')) {
                    v.searchParams.set('pt', APPLE_PT);
                    v.searchParams.set('mt', '8');
                }
                b.href = v.toString();
                if (typeof gtag_report_conversion === 'function' && !b.getAttribute('onclick')) {
                    b.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
                }
                b.addEventListener('click', function () {
                    var isMac = this.href.indexOf('platform=mac') !== -1;
                    reachGoal('store_click_any');
                    reachGoal(isMac ? 'store_click_mac' : 'store_click_ios');
                    ga4StoreClick(isMac ? 'mac_app_store' : 'app_store', this.href);
                });
            } catch (e) { /* malformed URL — skip */ }
        }

        var playLinks = document.querySelectorAll('a[href*="play.google.com/store/apps"]');
        for (var k = 0; k < playLinks.length; k++) {
            var g = playLinks[k];
            try {
                // Play Store install attribution rides on a single `referrer`
                // param holding a urlencoded utm string. Play Console needs
                // utm_source + utm_medium to attribute the install at all;
                // utm_campaign carries our per-page cid.
                var w = new URL(g.href, location.origin);
                if (!w.searchParams.has('referrer')) {
                    w.searchParams.set('referrer',
                        'utm_source=live-subtitles.com&utm_medium=referral&utm_campaign=' + cidToSet);
                    g.href = w.toString();
                }
                if (typeof gtag_report_conversion === 'function' && !g.getAttribute('onclick')) {
                    g.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
                }
                g.addEventListener('click', function () {
                    reachGoal('store_click_any');
                    reachGoal('store_click_android');
                    ga4StoreClick('google_play', this.href);
                });
            } catch (e) { /* malformed URL — skip */ }
        }

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
