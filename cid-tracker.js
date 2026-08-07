(function () {
    var YM_COUNTER = 101009280;
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

    function reachGoal(name) {
        if (typeof window.ym === 'function') {
            try { window.ym(YM_COUNTER, 'reachGoal', name); } catch (e) { /* counter not ready */ }
        }
    }

    function instrument() {
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
                });
            } catch (e) { /* malformed URL — skip */ }
        }

        var appleLinks = document.querySelectorAll('a[href*="apps.apple.com"]');
        for (var j = 0; j < appleLinks.length; j++) {
            var b = appleLinks[j];
            try {
                if (campaign) {
                    var v = new URL(b.href, location.origin);
                    if (!v.searchParams.has('ct')) {
                        v.searchParams.set('ct', campaign);
                        b.href = v.toString();
                    }
                }
                if (typeof gtag_report_conversion === 'function' && !b.getAttribute('onclick')) {
                    b.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
                }
                b.addEventListener('click', function () {
                    var isMac = this.href.indexOf('platform=mac') !== -1;
                    reachGoal('store_click_any');
                    reachGoal(isMac ? 'store_click_mac' : 'store_click_ios');
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
