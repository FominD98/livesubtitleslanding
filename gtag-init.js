window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-17344614830');

window.gtag_report_conversion = window.gtag_report_conversion || function (url) {
    var callback = function () {
        if (typeof (url) != 'undefined') {
            window.open(url, '_blank');
        }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-17344614830/S1iQCJL32KMcEK6jx85A',
        'event_callback': callback
    });
    return false;
};
