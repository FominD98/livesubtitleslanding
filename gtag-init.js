window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'AW-17344614830');

// GA4. Тег gtag.js подгружается с id рекламного аккаунта, но одна библиотека
// обслуживает несколько продуктов: второй config поднимает GA4 поверх той же
// загрузки, без отдельного скрипта на 908 страницах.
gtag('config', 'G-2NVMGPL64K');

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
