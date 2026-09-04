// Meta pixel. Набор LiveSubtitles Web, id 2867436680278739 — тот же, куда бэкенд шлёт
// серверный Purchase через Conversions API, поэтому браузер и сервер видят одну воронку.
// Набор приложения (Live Subtitles, id 1705137643905426) — не он: у приложений другой
// эндпоинт и другой формат события, веб-события туда слать нельзя.
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '2867436680278739');
fbq('track', 'PageView');

function readMetaCookie(name) {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i++) {
        if (parts[i].indexOf(name + '=') === 0) {
            var raw = parts[i].slice(name.length + 1);
            // Битую куку (одиночный '%' от стороннего расширения) decodeURIComponent роняет
            // с URIError. Читалку вызывает страница оплаты — исключение отсюда оборвало бы
            // открытие чекаута, поэтому в худшем случае отдаём значение как есть.
            try { return decodeURIComponent(raw); } catch (e) { return raw; }
        }
    }
    return '';
}

// Куки клика для страницы оплаты. Десктопных SDK у Meta нет, покупку отправляет бэкенд по
// вебхуку Paddle, и связать её с объявлением он может только этими двумя значениями —
// без них у события остаётся отпечаток устройства, но не реклама, по которой пришли.
// Лимиты длины повторяют серверные (ReadCustomData в PaddleWebhookService): что длиннее,
// бэкенд считает мусором и выбрасывает, так что и слать не будем.
window.metaAttribution = function () {
    var out = {};

    var fbp = readMetaCookie('_fbp');
    if (fbp && fbp.length <= 200) out.fbp = fbp;

    // _fbc пиксель ставит сам, когда человек приходит по ссылке с fbclid. Если куки ещё нет,
    // а метка в адресе есть — собираем значение сами в формате Meta.
    var fbc = readMetaCookie('_fbc');
    if (!fbc) {
        var fbclid = new URLSearchParams(window.location.search).get('fbclid');
        if (fbclid) fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    }
    if (fbc && fbc.length <= 400) out.fbc = fbc;

    // Пустых ключей не отдаём: отсутствующий ключ лучше пустой строки.
    return out;
};
