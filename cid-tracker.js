(function () {
    var params = new URLSearchParams(location.search);
    var incoming = params.get('utm_campaign') || params.get('cid');
    if (incoming) {
        try { sessionStorage.setItem('lsCid', incoming); } catch (e) { /* private mode */ }
    }
    var campaign = '';
    try { campaign = sessionStorage.getItem('lsCid') || ''; } catch (e) { campaign = incoming || ''; }

    var cidToSet = campaign || 'site_organic';

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
            } catch (e) { /* malformed URL — skip */ }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', instrument);
    } else {
        instrument();
    }
})();
