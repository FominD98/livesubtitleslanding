// Meta pixel. Набор LiveSubtitles Web, id 2479887015853166 — тот же, куда бэкенд шлёт
// серверный Purchase через Conversions API, поэтому браузер и сервер видят одну воронку.
// Прежний набор с тем же именем (2867436680278739) создавался вне бизнес-портфолио: токен
// Conversions API его не видит (Graph API отвечает "(#100) Missing perms"), поэтому серверные
// события туда не доходят и склейки с браузерными не было бы.
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

fbq('init', '2479887015853166');
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

// Пиксель ставит _fbp сам, но делает это внутри fbevents.js, который грузится асинхронно.
// Страница оплаты открывает чекаут синхронно при разборе и читает куки раньше, поэтому до
// сервера куку доносили только те, кто раньше бывал на сайте: 21 покупка из 182 за
// 16.08-14.09. Ставим её сами — в документированном формате Meta
// fb.<индекс поддомена>.<время создания, мс>.<случайное число>. Пиксель существующую куку
// не перезаписывает, а принимает как свою, так что состав данных не меняется: меняется
// только момент записи.
function ensureMetaBrowserId() {
    if (readMetaCookie('_fbp')) return;

    // Домен регистрации, а не текущий хост: иначе кука, поставленная на live-subtitles.com,
    // не была бы видна на www и наоборот, а пиксель пишет именно на eTLD+1.
    var host = location.hostname || '';
    var labels = host.split('.');
    var domain = labels.length >= 2 ? '; domain=.' + labels.slice(-2).join('.') : '';

    var value = 'fb.1.' + Date.now() + '.' + Math.floor(Math.random() * 2147483647);
    try {
        // 90 дней — столько же живёт кука пикселя и окно атрибуции Meta.
        document.cookie = '_fbp=' + value + '; max-age=7776000; path=/; SameSite=Lax' + domain;
    } catch (e) { /* куки запрещены — остаёмся без fbp, оплата от этого не зависит */ }
}

ensureMetaBrowserId();

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
