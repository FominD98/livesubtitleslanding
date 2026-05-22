(function () {
    var params = new URLSearchParams(location.search);
    var incoming = params.get('utm_campaign') || params.get('cid');
    if (incoming) {
        try { sessionStorage.setItem('lsCid', incoming); } catch (e) { /* private mode */ }
    }
    var campaign = '';
    try { campaign = sessionStorage.getItem('lsCid') || ''; } catch (e) { campaign = incoming || ''; }
    if (!campaign) return;

    function instrument() {
        var links = document.querySelectorAll('a[href*="apps.microsoft.com"], a[href*="apps.apple.com"]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            try {
                var u = new URL(a.href, location.origin);
                if (!u.searchParams.has('cid')) {
                    u.searchParams.set('cid', campaign);
                    a.href = u.toString();
                }
                if (typeof gtag_report_conversion === 'function') {
                    a.setAttribute('onclick', 'return gtag_report_conversion(this.href);');
                }
            } catch (e) { /* malformed URL — skip */ }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', instrument);
    } else {
        instrument();
    }
})();
