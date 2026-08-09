// _add_android_and_tv.js
//
// Android is live on Google Play -> link to it everywhere the other store
// badges appear. The email-capture waitlist that used to collect "notify me
// about Android" is repurposed to collect interest in a TV version.
//
// Usage: node _add_android_and_tv.js [--dry]
//
// Touches:
//   translations.js                  androidBtn/androidModal -> tvBtn/tvModal, faq.a6, header.lead, descriptions
//   index.html + <locale>/index.html Play badge in #download, new TV card, modal + form ids, CTA routing
//   <520 pages>                      Play badge next to the Mac/iOS badges
//   articles/**                      STORES.android -> Play Store instead of the homepage
//   llms.txt, misc prose             platform list now includes Android
//
// Idempotent: re-running after a successful run is a no-op (every pattern is
// matched on its pre-change form).

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRY = process.argv.includes('--dry');
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.livesubtitles.android';
const PLAY_BADGE = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

const LOCALES = ['ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt', 'pl', 'nl', 'tr', 'uk'];
// Order of the locale blocks in translations.js (used to zip old -> new values).
const TR_ORDER = ['en-US', 'ru-RU', 'fr-FR', 'es-ES', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'pt-BR', 'pl-PL', 'nl-NL', 'tr-TR', 'uk-UA'];

let changed = 0, skipped = 0;

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
function write(p, s) {
    if (DRY) return;
    fs.writeFileSync(path.join(ROOT, p), s, 'utf8');
}
function save(p, before, after, label) {
    if (before === after) { skipped++; console.log(`  --    ${p}  (${label}: no match / already done)`); return false; }
    write(p, after);
    changed++;
    console.log(`  ok    ${p}  (${label})`);
    return true;
}

// ---------------------------------------------------------------------------
// 1. translations.js
// ---------------------------------------------------------------------------

// New copy per locale. `btn` = download-grid button, `modalTitle`/`modalDesc` =
// waitlist modal, `succDesc` = thank-you modal, `a6` = FAQ answer, `lead` = hero
// paragraph, `desc` = meta description (also used for og/twitter).
const COPY = {
    'en-US': {
        btn: 'Want a TV version',
        modalTitle: 'Live Subtitles for TV',
        modalDesc: 'We are working on a TV version. Leave your email and we will notify you when it is ready.',
        succDesc: 'We will notify you when the TV version is ready.',
        a6: 'Live Subtitles is available on Windows, macOS, iOS, and Android. A TV version is currently in development — leave your email and we will notify you when it is ready.',
        lead: 'Translates speech in real time into 60+ languages. Works with Zoom, Teams, Skype, Google Meet and any app — no microphone. Available for Windows, macOS, iOS and Android.',
        desc: 'Live captions & dual subtitles for any app on Windows, Mac, iOS & Android. Real-time AI translation in 60+ languages for Zoom, Teams & Netflix. Free trial.',
    },
    'ru-RU': {
        btn: 'Хочу версию для ТВ',
        modalTitle: 'Версия для телевизора',
        modalDesc: 'Мы работаем над версией для телевизоров. Оставьте свой email, и мы сообщим вам, когда она будет готова.',
        succDesc: 'Мы сообщим вам, когда версия для телевизоров будет готова.',
        a6: 'Live Subtitles доступен на Windows, macOS, iOS и Android. Версия для телевизоров находится в разработке — оставьте свой email, и мы сообщим о выходе.',
        lead: 'Переводит речь в реальном времени на 60+ языков. Работает с Zoom, Teams, Skype, Google Meet и любым приложением — без микрофона. Доступно для Windows, macOS, iOS и Android.',
        desc: 'Живые и двойные субтитры поверх любого приложения: Windows, Mac, iOS, Android. ИИ-перевод на 60+ языков для Zoom, Teams, Netflix. Пробный период, без микрофона.',
    },
    'fr-FR': {
        btn: 'Je veux la version TV',
        modalTitle: 'Live Subtitles pour TV',
        modalDesc: "Nous travaillons sur une version TV. Laissez votre email et nous vous informerons lorsqu'elle sera prête.",
        succDesc: 'Nous vous informerons lorsque la version TV sera prête.',
        a6: 'Live Subtitles est disponible sur Windows, macOS, iOS et Android. Une version TV est en cours de développement — laissez votre email et nous vous informerons de sa sortie.',
        lead: "Traduit la parole en temps réel dans plus de 50 langues. Fonctionne avec Zoom, Teams, Skype, Google Meet et n'importe quelle application — sans microphone. Disponible pour Windows, macOS, iOS et Android.",
        desc: 'Sous-titres en direct et doubles pour toute app sur Windows, Mac, iOS et Android. Traduction IA en 60+ langues pour Zoom, Teams et Netflix. Essai gratuit.',
    },
    'es-ES': {
        btn: 'Quiero la versión para TV',
        modalTitle: 'Live Subtitles para TV',
        modalDesc: 'Estamos trabajando en una versión para TV. Deja tu correo electrónico y te avisaremos cuando esté lista.',
        succDesc: 'Te avisaremos cuando la versión para TV esté lista.',
        a6: 'Live Subtitles está disponible en Windows, macOS, iOS y Android. La versión para TV está en desarrollo: deja tu email y te notificaremos cuando esté lista.',
        lead: 'Traduce voz en tiempo real a más de 50 idiomas. Funciona con Zoom, Teams, Skype, Google Meet y cualquier app — sin micrófono. Disponible para Windows, macOS, iOS y Android.',
        desc: 'Subtítulos en vivo y duales para cualquier app en Windows, Mac, iOS y Android. Traducción IA en tiempo real a 60+ idiomas en Zoom, Teams y Netflix. Prueba gratis.',
    },
    'de-DE': {
        btn: 'Ich möchte die TV-Version',
        modalTitle: 'Live Subtitles für TV',
        modalDesc: 'Wir arbeiten an einer TV-Version. Lassen Sie Ihre E-Mail und wir werden Sie informieren, wenn sie fertig ist.',
        succDesc: 'Wir werden Sie informieren, wenn die TV-Version fertig ist.',
        a6: 'Live Subtitles ist auf Windows, macOS, iOS und Android verfügbar. Eine TV-Version ist derzeit in Entwicklung — hinterlassen Sie Ihre E-Mail und wir informieren Sie, wenn sie fertig ist.',
        lead: 'Übersetzt Sprache in Echtzeit in 60+ Sprachen. Funktioniert mit Zoom, Teams, Skype, Google Meet und jeder Anwendung — ohne Mikrofon. Verfügbar für Windows, macOS, iOS und Android.',
        desc: 'Live-Untertitel & duale Untertitel für jede App auf Windows, Mac, iOS & Android. KI-Übersetzung in 60+ Sprachen für Zoom, Teams & Netflix. Kostenlos testen.',
    },
    'it-IT': {
        btn: 'Voglio la versione per TV',
        modalTitle: 'Live Subtitles per TV',
        modalDesc: 'Stiamo lavorando su una versione per TV. Lascia il tuo indirizzo email e ti informeremo quando sarà pronta.',
        succDesc: 'Ti informeremo quando la versione per TV sarà pronta.',
        a6: 'Live Subtitles è disponibile su Windows, macOS, iOS e Android. La versione per TV è attualmente in fase di sviluppo: lascia la tua email e ti avviseremo quando sarà pronta.',
        lead: 'Traduce la voce in tempo reale in oltre 50 lingue. Funziona con Zoom, Teams, Skype, Google Meet e qualsiasi app — senza microfono. Disponibile per Windows, macOS, iOS e Android.',
        desc: 'Sottotitoli live e doppi per ogni app su Windows, Mac, iOS e Android. Traduzione AI in tempo reale in 60+ lingue per Zoom, Teams e Netflix. Prova gratis.',
    },
    'ja-JP': {
        btn: 'テレビ版が欲しい',
        modalTitle: 'テレビ版',
        modalDesc: 'テレビ版を開発中です。メールアドレスを残していただければ、準備ができ次第お知らせします。',
        succDesc: 'テレビ版の準備ができ次第お知らせします。',
        a6: 'Live SubtitlesはWindows、macOS、iOS、Androidで利用可能です。テレビ版は現在開発中です。メールアドレスを残していただければ、準備ができ次第お知らせします。',
        lead: '音声を50以上の言語にリアルタイムで翻訳。Zoom、Teams、Skype、Google Meet などあらゆるアプリに対応 — マイク不要。 Windows・macOS・iOS・Android対応。',
        desc: 'Windows・Mac・iOS・Androidのあらゆるアプリの画面に、リアルタイム字幕と二重字幕を重ねて表示します。Zoom・Teams・YouTube・Netflix・ゲームに対応し、50以上の言語をAIでリアルタイムに即時翻訳。マイク不要で、まずは無料トライアルからお気軽にお試しください。',
    },
    'ko-KR': {
        btn: 'TV 버전 원함',
        modalTitle: 'TV 버전',
        modalDesc: 'TV 버전을 작업 중입니다. 이메일을 남겨주시면 준비되면 알려드리겠습니다.',
        succDesc: 'TV 버전이 준비되면 알려드리겠습니다.',
        a6: 'Live Subtitles는 Windows, macOS, iOS, Android에서 사용할 수 있습니다. TV 버전은 현재 개발 중입니다. 이메일을 남겨주시면 준비되면 알려드리겠습니다.',
        lead: '음성을 50개 이상의 언어로 실시간 번역. Zoom, Teams, Skype, Google Meet 등 모든 앱에서 작동 — 마이크 불필요. Windows, macOS, iOS, Android 지원.',
        desc: 'Windows, Mac, iOS, Android의 모든 앱 위에 실시간 자막과 이중 자막을 표시합니다. Zoom, Teams, Netflix, YouTube, 게임까지 50개 이상 언어로 실시간 AI 번역을 제공합니다. 마이크 불필요, 무료 체험으로 지금 시작하세요.',
    },
    'zh-CN': {
        btn: '需要电视版本',
        modalTitle: '电视版本',
        modalDesc: '我们正在开发电视版本。请留下您的邮箱，准备好后我们会通知您。',
        succDesc: '电视版本准备好后我们会通知您。',
        a6: 'Live Subtitles目前支持Windows、macOS、iOS和Android。电视版本正在开发中。请留下您的邮箱，准备好后我们会通知您。',
        lead: '将语音实时翻译成 50 多种语言。支持 Zoom、Teams、Skype、Google Meet 等任何应用 — 无需麦克风。 支持 Windows、macOS、iOS 和 Android。',
        desc: 'Live Subtitles 在 Windows、Mac、iOS 和 Android 上为任意应用叠加实时 AI 字幕与双语对照字幕。支持 60+ 种语言实时翻译，适用于 Zoom、Teams、Netflix、YouTube 视频通话、电影与游戏，无需麦克风。免费试用，立即体验无障碍沟通。',
    },
    'ar-SA': {
        btn: 'أريد إصدار التلفزيون',
        modalTitle: 'إصدار التلفزيون',
        modalDesc: 'نحن نعمل على إصدار للتلفزيون. اترك بريدك الإلكتروني وسنخبرك عندما يصبح جاهزاً.',
        succDesc: 'سنخبرك عندما يصبح إصدار التلفزيون جاهزاً.',
        a6: 'Live Subtitles متوفر على Windows و macOS و iOS و Android. إصدار التلفزيون قيد التطوير حالياً. اترك بريدك الإلكتروني وسنخبرك عندما يصبح جاهزاً.',
        lead: 'يترجم الكلام فوريًا إلى أكثر من 50 لغة. يعمل مع Zoom وTeams وSkype وGoogle Meet وأي تطبيق — بدون ميكروفون. متوفر لأنظمة Windows وmacOS وiOS وAndroid.',
        desc: 'ترجمة حية وترجمة مزدوجة لأي تطبيق على ويندوز وماك وiOS وأندرويد. ترجمة فورية بالذكاء الاصطناعي بأكثر من 50 لغة لزووم وتيمز ونتفليكس. تجربة مجانية بدون ميكروفون.',
    },
    'hi-IN': {
        btn: 'टीवी संस्करण चाहिए',
        modalTitle: 'टीवी संस्करण',
        modalDesc: 'हम टीवी संस्करण पर काम कर रहे हैं। अपना ईमेल छोड़ें और जब तैयार हो जाएगा तो हम आपको बताएंगे।',
        succDesc: 'टीवी संस्करण तैयार होने पर हम आपको बताएंगे।',
        a6: 'Live Subtitles Windows, macOS, iOS और Android पर उपलब्ध है। टीवी संस्करण वर्तमान में विकास में है। अपना ईमेल छोड़ें और तैयार होने पर हम आपको सूचित करेंगे।',
        lead: 'भाषण का 60+ भाषाओं में रियल-टाइम अनुवाद। Zoom, Teams, Skype, Google Meet और किसी भी ऐप के साथ काम करता है — माइक्रोफ़ोन की ज़रूरत नहीं। Windows, macOS, iOS और Android के लिए उपलब्ध।',
        desc: 'किसी भी ऐप पर लाइव कैप्शन और डुअल सबटाइटल — Windows, Mac, iOS व Android पर। Zoom, Teams, Netflix के लिए 60+ भाषाओं में रियल-टाइम AI अनुवाद। बिना माइक, फ्री ट्रायल।',
    },
    'pt-BR': {
        btn: 'Quero versão para TV',
        modalTitle: 'Versão para TV',
        modalDesc: 'Estamos trabalhando na versão para TV. Deixe seu email e avisaremos quando estiver pronta.',
        succDesc: 'Avisaremos quando a versão para TV estiver pronta.',
        a6: 'O Live Subtitles está disponível no Windows, macOS, iOS e Android. A versão para TV está em desenvolvimento. Deixe seu email e avisaremos quando estiver pronta.',
        lead: 'Traduz a fala em tempo real para mais de 50 idiomas. Funciona com Zoom, Teams, Skype, Google Meet e qualquer app — sem microfone. Disponível para Windows, macOS, iOS e Android.',
        desc: 'Legendas ao vivo e duplas em qualquer app no Windows, Mac, iOS e Android. Tradução por IA em tempo real em mais de 50 idiomas para Zoom, Teams e Netflix. Teste grátis.',
    },
    'pl-PL': {
        btn: 'Chcę wersję na TV',
        modalTitle: 'Wersja na TV',
        modalDesc: 'Pracujemy nad wersją na TV. Zostaw swój email, a powiadomimy, gdy będzie gotowa.',
        succDesc: 'Powiadomimy, gdy wersja na TV będzie gotowa.',
        a6: 'Live Subtitles jest dostępny na Windows, macOS, iOS i Android. Wersja na TV jest obecnie w fazie rozwoju. Zostaw swój email, a powiadomimy, gdy będzie gotowa.',
        lead: 'Tłumaczy mowę w czasie rzeczywistym na ponad 50 języków. Działa z Zoom, Teams, Skype, Google Meet i każdą aplikacją — bez mikrofonu. Dostępne dla Windows, macOS, iOS i Android.',
        desc: 'Napisy na żywo i podwójne napisy do każdej aplikacji na Windows, Mac, iOS, Android. Tłumaczenie AI w 60+ językach dla Zoom, Teams, Netflix. Darmowy start.',
    },
    'nl-NL': {
        btn: 'Wil tv-versie',
        modalTitle: 'Tv-versie',
        modalDesc: 'We werken aan de tv-versie. Laat je email achter en we informeren je wanneer het klaar is.',
        succDesc: 'We informeren je wanneer de tv-versie klaar is.',
        a6: 'Live Subtitles is beschikbaar op Windows, macOS, iOS en Android. Een tv-versie is momenteel in ontwikkeling. Laat je email achter en we informeren je wanneer het klaar is.',
        lead: 'Vertaalt spraak in realtime naar 60+ talen. Werkt met Zoom, Teams, Skype, Google Meet en elke app — zonder microfoon. Beschikbaar voor Windows, macOS, iOS en Android.',
        desc: 'Live ondertiteling & duale ondertitels voor elke app op Windows, Mac, iOS & Android. AI-vertaling in 60+ talen voor Zoom, Teams en Netflix. Gratis proef.',
    },
    'tr-TR': {
        btn: 'TV sürümü istiyorum',
        modalTitle: 'TV sürümü',
        modalDesc: 'TV sürümü üzerinde çalışıyoruz. E-postanızı bırakın, hazır olduğunda size haber verelim.',
        succDesc: 'TV sürümü hazır olduğunda size haber vereceğiz.',
        a6: "Live Subtitles Windows, macOS, iOS ve Android'de kullanılabilir. TV sürümü şu anda geliştirme aşamasındadır. E-postanızı bırakın, hazır olduğunda size haber verelim.",
        lead: "Konuşmayı gerçek zamanlı olarak 50'den fazla dile çevirir. Zoom, Teams, Skype, Google Meet ve her uygulamayla çalışır — mikrofon gerekmez. Windows, macOS, iOS ve Android için mevcut.",
        desc: 'Tüm uygulamalar için canlı ve çift altyazı: Windows, Mac, iOS, Android. Zoom, Teams, Netflix için 60+ dilde gerçek zamanlı AI çeviri. Ücretsiz deneme.',
    },
    'uk-UA': {
        btn: 'Хочу версію для ТВ',
        modalTitle: 'Версія для телевізора',
        modalDesc: 'Ми працюємо над версією для телевізорів. Залиште свою електронну адресу, і ми повідомимо, коли буде готово.',
        succDesc: 'Ми повідомимо, коли версія для телевізорів буде готова.',
        a6: 'Live Subtitles доступний на Windows, macOS, iOS та Android. Версія для телевізорів наразі в розробці. Залиште свою електронну адресу, і ми повідомимо, коли буде готово.',
        lead: 'Перекладає мовлення в реальному часі на 60+ мов. Працює із Zoom, Teams, Skype, Google Meet і будь-яким додатком — без мікрофона. Доступно для Windows, macOS, iOS та Android.',
        desc: 'Живі та подвійні субтитри для будь-якого застосунку на Windows, Mac, iOS та Android. AI-переклад у реальному часі 60+ мовами для Zoom, Teams і Netflix. Пробний доступ.',
    },
};

// Escape a plain string for a single-quoted JS literal, the way translations.js
// already stores its values.
function jsLit(s) {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function patchTranslations() {
    console.log('translations.js');
    const before = read('translations.js');
    let out = before;
    if (!before.includes('androidModal: {')) {
        console.log('  --    translations.js  (already migrated)');
        skipped++;
        return false;
    }

    // Rename the keys (16 locales each).
    for (const [from, to, expect] of [["androidBtn: '", "tvBtn: '", 16], ['androidModal: {', 'tvModal: {', 16]]) {
        const n = out.split(from).length - 1;
        if (n !== expect && n !== 0) throw new Error(`translations.js: expected ${expect} of "${from}", found ${n}`);
        out = out.split(from).join(to);
    }

    // Swap the values. Each old value is unique to its locale, so a plain
    // global replace is safe; `description` intentionally hits twice (top-level
    // + meta.description, which are identical strings).
    const dump = extractTranslations(before);
    for (const lang of TR_ORDER) {
        const old = dump[lang], nw = COPY[lang];
        if (!old || !nw) throw new Error(`translations.js: no copy for ${lang}`);
        const pairs = [
            [old.androidBtn, nw.btn, 1],
            [old.androidModal.title, nw.modalTitle, 1],
            [old.androidModal.desc, nw.modalDesc, 1],
            [old.successModal.desc, nw.succDesc, 1],
            [old.faq.a6, nw.a6, 1],
            [old.header.lead, nw.lead, 1],
            [old.description, nw.desc, 2],
        ];
        for (const [o, n, expect] of pairs) {
            const needle = "'" + jsLit(o) + "'";
            const found = out.split(needle).length - 1;
            if (found === 0) { console.log(`  --    ${lang}: already updated or no match for "${o.slice(0, 40)}..."`); continue; }
            if (found !== expect) throw new Error(`${lang}: expected ${expect} hits for "${o.slice(0, 50)}...", found ${found}`);
            out = out.split(needle).join("'" + jsLit(n) + "'");
        }
    }
    return save('translations.js', before, out, 'tvBtn/tvModal + Android in copy');
}

// Minimal evaluator for the `const translations = {...}` literal (same trick as
// bake-i18n-defaults.js).
function extractTranslations(src) {
    const vm = require('vm');
    const s = src.indexOf('const translations');
    const after = src.slice(s);
    let d = 0, end = -1, inStr = false, ch = '', i = after.indexOf('{');
    for (; i < after.length; i++) {
        const c = after[i];
        if (inStr) { if (c === '\\') { i++; continue; } if (c === ch) inStr = false; continue; }
        if (c === "'" || c === '"' || c === '`') { inStr = true; ch = c; continue; }
        if (c === '{') d++;
        else if (c === '}') { d--; if (d === 0) { end = i; break; } }
    }
    return vm.runInNewContext('(' + after.slice(after.indexOf('{'), end + 1) + ')');
}

// ---------------------------------------------------------------------------
// 2. index.html + <locale>/index.html
// ---------------------------------------------------------------------------

const ANDROID_BADGE_CARD = `<a href="${PLAY_URL}" target="_blank" rel="noopener"
                            onclick="return gtag_report_conversion(this.href);"
                            class="mt-auto d-flex align-items-center justify-content-center w-100"
                            style="min-height: 84px; transition: transform 0.3s ease;"
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                            <img src="${PLAY_BADGE}" width="646" height="250"
                                alt="Get it on Google Play" style="height: 88px; width: auto; max-width: 100%;">
                        </a>`;

const TV_CARD = `
                <!-- TV (waitlist) -->
                <div class="col-12 mb-3">
                    <div class="p-3 h-100 d-flex flex-column align-items-center justify-content-center platform-card"
                        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; transition: transform 0.3s ease, background 0.3s ease;"
                        onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.transform='translateY(-5px)'"
                        onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)'">
                        <h5 class="text-white mb-2" style="font-weight: 500; font-size: 1rem;">TV</h5>
                        <div class="mt-auto w-100 d-flex align-items-center justify-content-center"
                            style="min-height: 84px;">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#tvModal"
                                style="height: 80px; width: 100%; max-width: 320px; border-radius: 12px; border: 1px solid rgba(0,255,157,0.5); color: #00ff9d; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; background: rgba(0,255,157,0.05); font-size: 1.25rem; transition: all 0.3s ease;"
                                onmouseover="this.style.background='rgba(0,255,157,0.15)'; this.style.border='1px solid #00ff9d'"
                                onmouseout="this.style.background='rgba(0,255,157,0.05)'; this.style.border='1px solid rgba(0,255,157,0.5)'"
                                data-translate="tvBtn">
                                Want a TV version
                            </a>
                        </div>
                    </div>
                </div>`;

function patchLanding(rel) {
    const before = read(rel);
    let out = before;

    // a) Android card: waitlist button -> Google Play badge.
    out = out.replace(
        /<div class="mt-auto w-100 d-flex align-items-center justify-content-center"\s*\n\s*style="min-height: 84px;">\s*\n\s*<a href="#" data-bs-toggle="modal" data-bs-target="#androidModal"[\s\S]*?<\/a>\s*\n\s*<\/div>/,
        ANDROID_BADGE_CARD
    );

    // b) New full-width TV card right after the Android card.
    out = out.replace(
        /(<img src="https:\/\/play\.google\.com\/intl\/en_us[^>]*>\s*\n\s*<\/a>\s*\n\s*<\/div>\s*\n\s*<\/div>)(?!\s*\n\s*<!-- TV)/,
        '$1' + TV_CARD
    );

    // c) The mobile reorder rules only cover .col-6; without an explicit order
    //    the new .col-12 (default order 0) would jump to the top of the grid.
    //    NB: the working copy is CRLF (core.autocrlf=true) — match \r?\n.
    const eol = before.includes('\r\n') ? '\r\n' : '\n';
    if (!out.includes('#download .col-12')) {
        out = out.replace(
            /(#download \.col-6:nth-child\(4\) \{ order: 2; \} \/\* Android \*\/\r?\n)/,
            '$1            #download .col-12 { order: 5; } /* TV */' + eol
        );
    }

    // d) Waitlist modal + form: Android -> TV.
    out = out.replace('#androidEmail::placeholder', '#tvEmail::placeholder');
    out = out.replace('<!-- Модальное окно для Android -->', '<!-- Модальное окно: лист ожидания версии для ТВ -->');
    out = out.replace(/id="androidModal"/g, 'id="tvModal"');
    out = out.replace(/androidModalLabel/g, 'tvModalLabel');
    out = out.replace(/data-translate="androidModal\./g, 'data-translate="tvModal.');
    out = out.replace(/id="androidEmailForm"/g, 'id="tvEmailForm"');
    out = out.replace(/id="androidEmail"/g, 'id="tvEmail"');
    out = out.replace(/getElementById\('androidEmailForm'\)/g, "getElementById('tvEmailForm')");
    out = out.replace(/getElementById\('androidEmail'\)/g, "getElementById('tvEmail')");
    out = out.replace(/getElementById\('androidModal'\)/g, "getElementById('tvModal')");
    out = out.replace(/const androidModal = /, 'const tvModal = ');
    out = out.replace(/\bandroidModal\.hide\(\)/, 'tvModal.hide()');
    out = out.replace('// Обработка формы для Android', '// Обработка формы: лист ожидания версии для ТВ');
    out = out.replace("subject: 'Новый запрос на версию для Android'", "subject: 'Новый запрос на версию для ТВ'");
    out = out.replace('message: `Пользователь ${email} хочет получить версию для Android`', 'message: `Пользователь ${email} хочет получить версию для ТВ`');

    // e) "Try Free" CTA routing: Android now has a store to go to.
    out = out.replace(
        /\/\/ \(Win\/Mac\/iOS; Android has no app yet -> send to the #download section with the notify flow\)\./,
        '// (Win/Mac/iOS/Android; unknown platform falls back to the #download section).'
    );
    if (!/android: 'https:\/\/play\.google\.com/.test(out)) {
        out = out.replace(
            /(ios: 'https:\/\/apps\.apple\.com\/app\/live-captions-translator\/id6760197210')(\r?\n)(\s*)\};/,
            `$1,$2$3    android: '${PLAY_URL}'$2$3};`
        );
    }
    out = out.replace(
        /if \(os === 'android' \|\| !store\) \{/,
        'if (!store) {'
    );

    return save(rel, before, out, 'Play badge + TV waitlist');
}

// ---------------------------------------------------------------------------
// 3. Platform / language pages: third store badge
// ---------------------------------------------------------------------------

function patchBadgePages() {
    const files = walk(ROOT).filter(f => f.endsWith('.html'));
    let n = 0;
    for (const abs of files) {
        const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
        if (/(^|\/)index\.html$/.test(rel) && !rel.includes('/')) continue;   // root index handled above
        if (LOCALES.some(l => rel === `${l}/index.html`)) continue;
        const before = fs.readFileSync(abs, 'utf8');
        if (!before.includes('badges/download-on-the-app-store.svg')) continue;
        if (before.includes(PLAY_BADGE)) continue;
        const out = before.replace(
            /(<a href="https:\/\/apps\.apple\.com\/app\/live-captions-translator\/id6760197210" target="_blank" rel="noopener" style="display:inline-block;">\s*\n(\s*)<img src="https:\/\/developer\.apple\.com\/assets\/elements\/badges\/download-on-the-app-store\.svg" alt="(Download(?: Live Subtitles)? on the App Store)"([^>]*)>\s*\n(\s*)<\/a>)/,
            (m, whole, imgIndent, appleAlt, imgTail, closeIndent) => {
                const playAlt = appleAlt.includes('Live Subtitles') ? 'Get Live Subtitles on Google Play' : 'Get it on Google Play';
                const aIndent = closeIndent;
                return whole + '\n' + aIndent + `<a href="${PLAY_URL}" target="_blank" rel="noopener" style="display:inline-block;">\n`
                    + imgIndent + `<img src="${PLAY_BADGE}" alt="${playAlt}" width="646" height="250" style="height: 48px; width: auto;">\n`
                    + closeIndent + '</a>';
            }
        );
        if (out !== before) { if (!DRY) fs.writeFileSync(abs, out, 'utf8'); n++; }
    }
    console.log(`Store badges: ${n} pages got a Google Play badge`);
}

// ---------------------------------------------------------------------------
// 4. Articles: STORES.android pointed at the homepage
// ---------------------------------------------------------------------------

function patchArticleStores() {
    const files = walk(path.join(ROOT, 'articles')).filter(f => f.endsWith('.html'));
    let n = 0;
    for (const abs of files) {
        const before = fs.readFileSync(abs, 'utf8');
        let out = before.replace(/android:"\/(?:[a-z-]+\/)?"/, `android:"${PLAY_URL}"`);
        out = out.replace(
            'forEach(function(a){a.setAttribute("href",href);if(os==="android")a.removeAttribute("target");});',
            'forEach(function(a){a.setAttribute("href",href);});'
        );
        if (out !== before) { if (!DRY) fs.writeFileSync(abs, out, 'utf8'); n++; }
    }
    console.log(`Articles: ${n} pages now route Android CTAs to Google Play`);
}

// ---------------------------------------------------------------------------
// 5. Prose that still lists three platforms
// ---------------------------------------------------------------------------

function patchProse() {
    const files = walk(ROOT).filter(f => f.endsWith('.html'));
    let n = 0;
    for (const abs of files) {
        const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
        if (rel === 'index.html' || LOCALES.some(l => rel === `${l}/index.html`)) continue; // baked from translations.js
        const before = fs.readFileSync(abs, 'utf8');
        const out = before.replace(/Windows, macOS, and iOS/g, 'Windows, macOS, iOS, and Android');
        if (out !== before) { if (!DRY) fs.writeFileSync(abs, out, 'utf8'); n++; }
    }
    console.log(`Prose: ${n} pages now list Android in the platform list`);

    const llmsBefore = read('llms.txt');
    const llmsAfter = llmsBefore.includes('Google Play listing') ? llmsBefore : llmsBefore
        .replace(
            '- Platforms: Windows (Microsoft Store), macOS and iOS (App Store); Android in development',
            '- Platforms: Windows (Microsoft Store), macOS and iOS (App Store), Android (Google Play); a TV version is in development'
        )
        .replace(
            '- [Microsoft Store listing](https://apps.microsoft.com/detail/9ph1r9djg47s): Windows download',
            '- [Microsoft Store listing](https://apps.microsoft.com/detail/9ph1r9djg47s): Windows download\n- [Google Play listing](' + PLAY_URL + '): Android download'
        );
    save('llms.txt', llmsBefore, llmsAfter, 'platform list');
}

function walk(dir, acc = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === '.git' || e.name === 'node_modules' || e.name === '__pycache__' || e.name === '.notpush') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, acc);
        else acc.push(p);
    }
    return acc;
}

// ---------------------------------------------------------------------------

function main() {
    if (DRY) console.log('*** DRY RUN — nothing is written ***\n');
    patchTranslations();
    console.log('\nLandings');
    patchLanding('index.html');
    for (const l of LOCALES) patchLanding(`${l}/index.html`);
    console.log('');
    patchBadgePages();
    patchArticleStores();
    patchProse();
    console.log(`\nDone. ${changed} files written, ${skipped} untouched.`);
}

main();
