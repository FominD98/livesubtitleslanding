// _fix_false_claims.js
// Corrects claims in translations.js that the product does not back:
//
//   1. "60+ languages" -> "50 languages".
//      Deepgram recognition covers 50 unique languages
//      (src/LiveSubtitles.Infrastructure/AI/Online/DeepgramSTTService.cs:105 — 86 codes, 50 base
//      languages). Some locales already said 50, so the claim was also inconsistent.
//
//   2. "3-day free trial" -> "20 minutes free".
//      Release builds grant 20 trial minutes
//      (src/LiveSubtitles.Infrastructure/Store/MinutePackageService.cs:534; 12.0 is DEBUG only).
//      Prod funnel data confirms users stop dead at exactly 20 minutes.
//
//   3. Drops the "$5/month" price claims — monetisation is minute packs first, and the
//      subscription framing does not match how the product is actually bought.
//
//   4. Makes the connectivity answer honest: recognition and translation are cloud-side.
//      Wording stays consistent with privacy.html ("streamed while a session is active,
//      not recorded by us").
//
// Usage:  node _fix_false_claims.js [--check]
// After running:  node bake-i18n-defaults.js

const fs = require('fs');
const path = require('path');
const { loadTranslations } = require('./_tr_util.js');

const CHECK_ONLY = process.argv.includes('--check');
const FILE = path.join(__dirname, 'translations.js');

// Locale-by-locale replacements. Keys are dotted paths into translations.js.
const COPY = {
    'en-US': {
        'download.subtitle': 'Install it, choose two languages, press start.',
        'download.guarantee': '20 minutes free · No credit card required',
        'faq.a1': 'The first 20 minutes are free and no card is needed. After that you can top up minutes or take a subscription right inside the app — the current options are shown there and in your app store.',
        'faq.a4': 'Yes. Speech recognition and translation run in the cloud, so a stable internet connection is required. Audio is streamed only while a session is running and is not recorded by us.',
    },
    'ru-RU': {
        'download.subtitle': 'Установите, выберите два языка и нажмите старт.',
        'download.guarantee': '20 минут бесплатно · Без банковской карты',
        'faq.a1': 'Первые 20 минут бесплатны, карта не нужна. Дальше можно докупить минуты или оформить подписку прямо в приложении — актуальные варианты видны там же и в магазине приложений.',
        'faq.a4': 'Да. Распознавание речи и перевод работают в облаке, поэтому нужно стабильное интернет-соединение. Звук передаётся только во время сеанса и не записывается нами.',
    },
    'fr-FR': {
        'download.subtitle': 'Installez, choisissez deux langues et appuyez sur démarrer.',
        'download.guarantee': '20 minutes gratuites · Sans carte bancaire',
        'faq.a1': 'Les 20 premières minutes sont gratuites, sans carte bancaire. Ensuite, vous pouvez recharger des minutes ou prendre un abonnement directement dans l’application — les options actuelles y sont affichées, ainsi que dans votre magasin d’applications.',
        'faq.a4': 'Oui. La reconnaissance vocale et la traduction fonctionnent dans le cloud, une connexion internet stable est donc nécessaire. L’audio est transmis uniquement pendant une session et n’est pas enregistré par nous.',
    },
    'es-ES': {
        'download.subtitle': 'Instálalo, elige dos idiomas y pulsa iniciar.',
        'download.guarantee': '20 minutos gratis · Sin tarjeta de crédito',
        'faq.a1': 'Los primeros 20 minutos son gratis y no hace falta tarjeta. Después puedes recargar minutos o contratar una suscripción dentro de la propia app — las opciones actuales se muestran allí y en tu tienda de aplicaciones.',
        'faq.a4': 'Sí. El reconocimiento de voz y la traducción funcionan en la nube, por lo que se necesita una conexión a internet estable. El audio se transmite solo mientras la sesión está activa y nosotros no lo grabamos.',
    },
    'de-DE': {
        'download.subtitle': 'Installieren, zwei Sprachen wählen, starten.',
        'download.guarantee': '20 Minuten kostenlos · Ohne Kreditkarte',
        'faq.a1': 'Die ersten 20 Minuten sind kostenlos, ohne Kreditkarte. Danach können Sie Minuten direkt in der App aufladen oder ein Abo abschließen — die aktuellen Optionen sehen Sie dort und in Ihrem App-Store.',
        'faq.a4': 'Ja. Spracherkennung und Übersetzung laufen in der Cloud, daher ist eine stabile Internetverbindung nötig. Audio wird nur während einer laufenden Sitzung übertragen und von uns nicht aufgezeichnet.',
    },
    'it-IT': {
        'download.subtitle': 'Installa, scegli due lingue e premi avvia.',
        'download.guarantee': '20 minuti gratis · Senza carta di credito',
        'faq.a1': 'I primi 20 minuti sono gratuiti e non serve la carta. Poi puoi ricaricare minuti o attivare un abbonamento direttamente nell’app — le opzioni attuali sono mostrate lì e nel tuo store.',
        'faq.a4': 'Sì. Il riconoscimento vocale e la traduzione funzionano nel cloud, quindi serve una connessione internet stabile. L’audio viene trasmesso solo durante una sessione attiva e non viene registrato da noi.',
    },
    'ja-JP': {
        'download.subtitle': 'インストールして、2つの言語を選び、開始を押すだけ。',
        'download.guarantee': '20分無料 · クレジットカード不要',
        'faq.a1': '最初の20分は無料で、カード登録は不要です。その後はアプリ内で分数を追加購入するか、サブスクリプションを利用できます。現在の選択肢はアプリ内とアプリストアで確認できます。',
        'faq.a4': 'はい。音声認識と翻訳はクラウドで動作するため、安定したインターネット接続が必要です。音声はセッション中のみ送信され、当社が録音することはありません。',
    },
    'ko-KR': {
        'download.subtitle': '설치하고 두 가지 언어를 선택한 뒤 시작을 누르세요.',
        'download.guarantee': '20분 무료 · 신용카드 불필요',
        'faq.a1': '처음 20분은 무료이며 카드가 필요하지 않습니다. 이후에는 앱 안에서 시간을 충전하거나 구독을 이용할 수 있습니다. 현재 옵션은 앱과 앱 스토어에서 확인할 수 있습니다.',
        'faq.a4': '네. 음성 인식과 번역은 클라우드에서 실행되므로 안정적인 인터넷 연결이 필요합니다. 오디오는 세션이 실행되는 동안에만 전송되며 저희가 녹음하지 않습니다.',
    },
    'zh-CN': {
        'download.subtitle': '安装后选择两种语言，点击开始即可。',
        'download.guarantee': '20 分钟免费 · 无需信用卡',
        'faq.a1': '前 20 分钟免费，无需绑定银行卡。之后可以在应用内充值分钟数或订阅，当前可选方案会显示在应用内和应用商店中。',
        'faq.a4': '是的。语音识别和翻译在云端运行，因此需要稳定的网络连接。音频仅在会话进行时传输，我们不会录制。',
    },
    'ar-SA': {
        'download.subtitle': 'ثبّت التطبيق، اختر لغتين، واضغط على البدء.',
        'download.guarantee': '20 دقيقة مجانًا · بدون بطاقة ائتمان',
        'faq.a1': 'أول 20 دقيقة مجانية ولا تحتاج إلى بطاقة. بعد ذلك يمكنك شراء دقائق إضافية أو الاشتراك من داخل التطبيق — الخيارات الحالية معروضة هناك وفي متجر التطبيقات.',
        'faq.a4': 'نعم. يعمل التعرف على الكلام والترجمة في السحابة، لذا يلزم اتصال إنترنت مستقر. يُنقل الصوت فقط أثناء الجلسة ولا نقوم بتسجيله.',
    },
    'hi-IN': {
        'download.subtitle': 'इंस्टॉल करें, दो भाषाएँ चुनें और स्टार्ट दबाएँ।',
        'download.guarantee': '20 मिनट मुफ़्त · क्रेडिट कार्ड की ज़रूरत नहीं',
        'faq.a1': 'पहले 20 मिनट मुफ़्त हैं और कार्ड की ज़रूरत नहीं। इसके बाद आप ऐप में ही मिनट खरीद सकते हैं या सब्सक्रिप्शन ले सकते हैं — मौजूदा विकल्प वहीं और आपके ऐप स्टोर में दिखते हैं।',
        'faq.a4': 'हाँ। स्पीच रिकग्निशन और अनुवाद क्लाउड में चलते हैं, इसलिए स्थिर इंटरनेट कनेक्शन ज़रूरी है। ऑडियो केवल सेशन चलने के दौरान भेजा जाता है और हम उसे रिकॉर्ड नहीं करते।',
    },
    'pt-BR': {
        'download.subtitle': 'Instale, escolha dois idiomas e clique em iniciar.',
        'download.guarantee': '20 minutos grátis · Sem cartão de crédito',
        'faq.a1': 'Os primeiros 20 minutos são gratuitos e não é preciso cartão. Depois você pode recarregar minutos ou assinar dentro do próprio app — as opções atuais aparecem lá e na sua loja de aplicativos.',
        'faq.a4': 'Sim. O reconhecimento de fala e a tradução funcionam na nuvem, por isso é necessária uma conexão de internet estável. O áudio é transmitido apenas enquanto a sessão está ativa e não é gravado por nós.',
    },
    'pl-PL': {
        'download.subtitle': 'Zainstaluj, wybierz dwa języki i naciśnij start.',
        'download.guarantee': '20 minut bezpłatnie · Bez karty kredytowej',
        'faq.a1': 'Pierwsze 20 minut jest bezpłatne i nie trzeba podawać karty. Później możesz doładować minuty lub wykupić subskrypcję w samej aplikacji — aktualne opcje są widoczne tam i w sklepie z aplikacjami.',
        'faq.a4': 'Tak. Rozpoznawanie mowy i tłumaczenie działają w chmurze, więc potrzebne jest stabilne połączenie internetowe. Dźwięk jest przesyłany tylko podczas trwania sesji i nie jest przez nas nagrywany.',
    },
    'nl-NL': {
        'download.subtitle': 'Installeer, kies twee talen en druk op start.',
        'download.guarantee': '20 minuten gratis · Geen creditcard nodig',
        'faq.a1': 'De eerste 20 minuten zijn gratis en je hebt geen creditcard nodig. Daarna kun je minuten bijkopen of een abonnement nemen in de app zelf — de huidige opties staan daar en in je app store.',
        'faq.a4': 'Ja. Spraakherkenning en vertaling werken in de cloud, dus een stabiele internetverbinding is nodig. Audio wordt alleen tijdens een actieve sessie verstuurd en wordt door ons niet opgenomen.',
    },
    'tr-TR': {
        'download.subtitle': 'Kurun, iki dil seçin ve başlat’a basın.',
        'download.guarantee': '20 dakika ücretsiz · Kredi kartı gerekmez',
        'faq.a1': 'İlk 20 dakika ücretsiz ve kart gerekmiyor. Sonrasında uygulamanın içinden dakika yükleyebilir veya abonelik alabilirsiniz — güncel seçenekler orada ve uygulama mağazanızda görünür.',
        'faq.a4': 'Evet. Konuşma tanıma ve çeviri bulutta çalışır, bu yüzden istikrarlı bir internet bağlantısı gerekir. Ses yalnızca oturum sürerken iletilir ve tarafımızca kaydedilmez.',
    },
    'uk-UA': {
        'download.subtitle': 'Встановіть, виберіть дві мови та натисніть старт.',
        'download.guarantee': '20 хвилин безкоштовно · Без банківської картки',
        'faq.a1': 'Перші 20 хвилин безкоштовні, картка не потрібна. Далі можна докупити хвилини або оформити підписку просто в застосунку — актуальні варіанти видно там і в магазині застосунків.',
        'faq.a4': 'Так. Розпізнавання мовлення й переклад працюють у хмарі, тому потрібне стабільне інтернет-зʼєднання. Звук передається лише під час сеансу і не записується нами.',
    },
};

// "more than 60" style phrasings that the numeric regex below cannot reach.
const PHRASE_FIXES = [
    [/أكثر من\s*60/g, '50'],
    [/more than\s*60/gi, '50'],
    [/plus de\s*60/gi, '50'],
    [/más de\s*60/gi, '50'],
    [/mehr als\s*60/gi, '50'],
    [/più di\s*60/gi, '50'],
    [/mais de\s*60/gi, '50'],
    [/meer dan\s*60/gi, '50'],
    [/ponad\s*60/gi, '50'],
    [/більше\s*60|понад\s*60/gi, '50'],
    [/более\s*60|свыше\s*60/gi, '50'],
    [/60\s*(多种|种以上|以上)/g, '50 种'],
    [/60\s*개\s*이상/g, '50개'],
    [/60\s*(以上の|を超える)/g, '50 '],
    [/60\s*से\s*अधिक|60\s*से\s*ज़्यादा/g, '50'],
    [/60\s*dilden fazla/gi, '50 dil'],
    // Plain "60+" in every script.
    [/60\s*\+/g, '50'],
];

// Keys where a language count may appear.
const COUNT_KEYS = ['header.lead', 'description', 'meta.description', 'meta.keywords', 'faq.a3', 'faq.a2'];

function get(obj, dotted) {
    return dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function escapeForSingleQuoted(s) {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Replaces the value of `locale` -> `dotted` inside the raw translations.js text.
 * Scoped to the locale's own block so identical strings in other locales are untouched.
 */
function replaceValue(src, locale, dotted, oldValue, newValue) {
    const localeStart = src.indexOf(`'${locale}': {`);
    if (localeStart === -1) throw new Error(`locale block not found: ${locale}`);
    // The next locale block, or end of object.
    const nextLocale = src.slice(localeStart + 1).search(/\n {4}'[a-z]{2}-[A-Z]{2}': \{/);
    const localeEnd = nextLocale === -1 ? src.length : localeStart + 1 + nextLocale;

    // Narrow to the innermost ancestor object first, so `meta.description` is not
    // confused with the locale-level `description`.
    let blockStart = localeStart;
    let blockEnd = localeEnd;
    const parts = dotted.split('.');
    for (const parent of parts.slice(0, -1)) {
        const scope = src.slice(blockStart, blockEnd);
        const openRe = new RegExp(`\\b${parent}\\s*:\\s*\\{`);
        const om = scope.match(openRe);
        if (!om) return { src, changed: false, reason: `parent ${parent} not found in ${locale}` };
        // Walk to the matching close brace.
        let i = blockStart + om.index + om[0].length - 1;
        let depth = 0, inStr = false, strCh = '';
        for (; i < blockEnd; i++) {
            const ch = src[i];
            if (inStr) {
                if (ch === '\\') { i++; continue; }
                if (ch === strCh) inStr = false;
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; continue; }
            if (ch === '{') depth++;
            else if (ch === '}') { depth--; if (depth === 0) break; }
        }
        blockStart = blockStart + om.index;
        blockEnd = i + 1;
    }

    const block = src.slice(blockStart, blockEnd);
    const leaf = parts[parts.length - 1];

    // Match  leaf: '...'  /  leaf: "..."  allowing escaped quotes inside.
    const re = new RegExp(`(\\b${leaf}\\s*:\\s*)('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")`);
    const m = block.match(re);
    if (!m) return { src, changed: false, reason: `key ${leaf} not found in ${locale}` };

    const currentLiteral = m[2];
    const currentValue = currentLiteral.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (oldValue !== null && currentValue !== oldValue) {
        return { src, changed: false, reason: `value drift in ${locale}.${dotted}` };
    }
    if (currentValue === newValue) return { src, changed: false, reason: 'already correct' };

    const newBlock = block.replace(re, `$1'${escapeForSingleQuoted(newValue)}'`);
    return { src: src.slice(0, blockStart) + newBlock + src.slice(blockEnd), changed: true };
}

function main() {
    const before = fs.readFileSync(FILE, 'utf8');
    let src = before;
    const t = loadTranslations(FILE);
    const log = [];

    // 1–3. Explicit copy rewrites.
    for (const locale of Object.keys(COPY)) {
        for (const [dotted, newValue] of Object.entries(COPY[locale])) {
            const r = replaceValue(src, locale, dotted, get(t[locale], dotted), newValue);
            src = r.src;
            log.push(`${r.changed ? 'OK  ' : 'SKIP'} ${locale}.${dotted}${r.reason ? ' — ' + r.reason : ''}`);
        }
    }

    // 4. Language count, every locale, every key that could carry it.
    for (const locale of Object.keys(t)) {
        for (const dotted of COUNT_KEYS) {
            const current = get(t[locale], dotted);
            if (typeof current !== 'string') continue;
            let fixed = current;
            for (const [re, to] of PHRASE_FIXES) fixed = fixed.replace(re, to);
            fixed = fixed.replace(/\s{2,}/g, ' ').trim();
            if (fixed === current) continue;
            const r = replaceValue(src, locale, dotted, current, fixed);
            src = r.src;
            log.push(`${r.changed ? 'OK  ' : 'SKIP'} ${locale}.${dotted} (count)${r.reason ? ' — ' + r.reason : ''}`);
        }
    }

    console.log(log.join('\n'));
    console.log(`\n${log.filter(l => l.startsWith('OK')).length} replacements, ${log.filter(l => l.startsWith('SKIP')).length} skipped`);

    if (CHECK_ONLY) {
        console.log('\n--check: nothing written');
        return;
    }
    if (src === before) {
        console.log('\nNo changes needed.');
        return;
    }
    fs.writeFileSync(FILE, src, 'utf8');
    console.log(`\nWrote ${FILE}`);

    // Verify the file still parses and no stale claim survived.
    const after = loadTranslations(FILE);
    const problems = [];
    for (const locale of Object.keys(after)) {
        for (const dotted of COUNT_KEYS.concat(['download.guarantee', 'download.subtitle', 'faq.a1', 'faq.a4'])) {
            const v = get(after[locale], dotted);
            if (typeof v !== 'string') continue;
            if (/60\s*\+|أكثر من\s*60|more than\s*60|60\s*多种/.test(v)) problems.push(`${locale}.${dotted} still claims 60+: ${v}`);
            if (/\$\s*5|5\s*\$|5 دولار/.test(v)) problems.push(`${locale}.${dotted} still quotes a price: ${v}`);
            if (/3[\s-]*(day|дня|дней|jour|día|Tage|giorni|dni|dag|gün|日|일|天|أيام|दिन)/i.test(v)) problems.push(`${locale}.${dotted} still claims a 3-day trial: ${v}`);
        }
    }
    if (problems.length) {
        console.log('\nVERIFY FAILED:\n' + problems.join('\n'));
        process.exitCode = 1;
    } else {
        console.log('Verify OK: no "60+", no price, no 3-day trial in the touched keys.');
    }
}

main();
