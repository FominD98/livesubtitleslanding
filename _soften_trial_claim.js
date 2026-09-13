// _soften_trial_claim.js
// Drops the exact trial length ("20 minutes") from the homepage copy in all 16 locales.
//
// Why: the grant is a product setting, not a promise. It is expected to move
// (20 -> 10 minutes is already planned), and every number baked into the landing —
// proof bar, FAQ answer, download guarantee, plus the FAQPage JSON-LD that mirrors
// the FAQ — has to be re-translated and re-baked whenever it does. The pages now say
// "free to try, no card", which stays true at any grant size.
//
// The "no card" half is kept: that is the part users actually weigh, and it does not
// depend on the minute count.
//
// Out of scope: pricing.html, which states the grant deliberately (including the
// 30-day top-up) and is not driven by translations.js.
//
// Keys: proof.trial, faq.a1, download.guarantee.
//
// Usage:  node _soften_trial_claim.js [--check]
// After:  node bake-i18n-defaults.js

const fs = require('fs');
const path = require('path');
const { loadTranslations } = require('./_tr_util.js');

const CHECK_ONLY = process.argv.includes('--check');
const FILE = path.join(__dirname, 'translations.js');
const LOCALES = ['en-US', 'ru-RU', 'fr-FR', 'es-ES', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'pt-BR', 'pl-PL', 'nl-NL', 'tr-TR', 'uk-UA'];

// key -> locale -> string.
const COPY = {
    'proof.trial': {
        'en-US': "Free to try, no card",
        'ru-RU': "Попробовать бесплатно, без карты",
        'fr-FR': "Essai gratuit, sans carte",
        'es-ES': "Pruébalo gratis, sin tarjeta",
        'de-DE': "Kostenlos testen, ohne Karte",
        'it-IT': "Prova gratis, senza carta",
        'ja-JP': "無料でお試し、カード不要",
        'ko-KR': "무료로 체험, 카드 불필요",
        'zh-CN': "免费试用，无需银行卡",
        'ar-SA': "جرّبه مجانًا، بدون بطاقة",
        'hi-IN': "मुफ़्त आज़माएँ, कार्ड नहीं चाहिए",
        'pt-BR': "Experimente grátis, sem cartão",
        'pl-PL': "Wypróbuj bezpłatnie, bez karty",
        'nl-NL': "Gratis uitproberen, geen kaart",
        'tr-TR': "Ücretsiz deneyin, kart gerekmez",
        'uk-UA': "Спробувати безкоштовно, без картки",
    },
    'faq.a1': {
        'en-US': "You can try it for free, and no card is needed to start. After that you can top up minutes or take a subscription right inside the app — the current options are shown there and in your app store.",
        'ru-RU': "Попробовать можно бесплатно, карта для старта не нужна. Дальше можно докупить минуты или оформить подписку прямо в приложении — актуальные варианты видны там же и в магазине приложений.",
        'fr-FR': "Vous pouvez l’essayer gratuitement, sans carte bancaire pour démarrer. Ensuite, vous pouvez recharger des minutes ou prendre un abonnement directement dans l’application — les options actuelles y sont affichées, ainsi que dans votre magasin d’applications.",
        'es-ES': "Puedes probarla gratis y no hace falta tarjeta para empezar. Después puedes recargar minutos o contratar una suscripción dentro de la propia app — las opciones actuales se muestran allí y en tu tienda de aplicaciones.",
        'de-DE': "Sie können die App kostenlos testen, für den Start ist keine Karte nötig. Danach können Sie Minuten direkt in der App aufladen oder ein Abo abschließen — die aktuellen Optionen sehen Sie dort und in Ihrem App-Store.",
        'it-IT': "Puoi provarla gratis e per iniziare non serve la carta. Poi puoi ricaricare minuti o attivare un abbonamento direttamente nell’app — le opzioni attuali sono mostrate lì e nel tuo store.",
        'ja-JP': "無料でお試しいただけます。開始にカード登録は不要です。その後はアプリ内で分数を追加購入するか、サブスクリプションを利用できます。現在の選択肢はアプリ内とアプリストアで確認できます。",
        'ko-KR': "무료로 사용해 볼 수 있고, 시작할 때 카드가 필요하지 않습니다. 이후에는 앱 안에서 시간을 충전하거나 구독을 이용할 수 있습니다. 현재 옵션은 앱과 앱 스토어에서 확인할 수 있습니다.",
        'zh-CN': "可以先免费试用，开始时无需绑定银行卡。之后可以在应用内充值分钟数或订阅，当前可选方案会显示在应用内和应用商店中。",
        'ar-SA': "يمكنك تجربته مجانًا، ولا تحتاج إلى بطاقة للبدء. بعد ذلك يمكنك شراء دقائق إضافية أو الاشتراك من داخل التطبيق — الخيارات الحالية معروضة هناك وفي متجر التطبيقات.",
        'hi-IN': "आप इसे मुफ़्त आज़मा सकते हैं और शुरू करने के लिए कार्ड की ज़रूरत नहीं। इसके बाद आप ऐप में ही मिनट खरीद सकते हैं या सब्सक्रिप्शन ले सकते हैं — मौजूदा विकल्प वहीं और आपके ऐप स्टोर में दिखते हैं।",
        'pt-BR': "Você pode experimentar de graça e não é preciso cartão para começar. Depois você pode recarregar minutos ou assinar dentro do próprio app — as opções atuais aparecem lá e na sua loja de aplicativos.",
        'pl-PL': "Możesz wypróbować ją bezpłatnie, a do startu nie trzeba podawać karty. Później możesz doładować minuty lub wykupić subskrypcję w samej aplikacji — aktualne opcje są widoczne tam i w sklepie z aplikacjami.",
        'nl-NL': "Je kunt het gratis uitproberen en je hebt geen creditcard nodig om te beginnen. Daarna kun je minuten bijkopen of een abonnement nemen in de app zelf — de huidige opties staan daar en in je app store.",
        'tr-TR': "Uygulamayı ücretsiz deneyebilirsiniz, başlamak için kart gerekmiyor. Sonrasında uygulamanın içinden dakika yükleyebilir veya abonelik alabilirsiniz — güncel seçenekler orada ve uygulama mağazanızda görünür.",
        'uk-UA': "Спробувати можна безкоштовно, картка для старту не потрібна. Далі можна докупити хвилини або оформити підписку просто в застосунку — актуальні варіанти видно там і в магазині застосунків.",
    },
    'download.guarantee': {
        'en-US': "Free to try · No credit card required",
        'ru-RU': "Попробовать бесплатно · Без банковской карты",
        'fr-FR': "Essai gratuit · Sans carte bancaire",
        'es-ES': "Prueba gratis · Sin tarjeta de crédito",
        'de-DE': "Kostenlos testen · Ohne Kreditkarte",
        'it-IT': "Prova gratis · Senza carta di credito",
        'ja-JP': "無料でお試し · クレジットカード不要",
        'ko-KR': "무료 체험 · 신용카드 불필요",
        'zh-CN': "免费试用 · 无需信用卡",
        'ar-SA': "جرّبه مجانًا · بدون بطاقة ائتمان",
        'hi-IN': "मुफ़्त आज़माएँ · क्रेडिट कार्ड की ज़रूरत नहीं",
        'pt-BR': "Experimente grátis · Sem cartão de crédito",
        'pl-PL': "Wypróbuj bezpłatnie · Bez karty kredytowej",
        'nl-NL': "Gratis uitproberen · Geen creditcard nodig",
        'tr-TR': "Ücretsiz deneyin · Kredi kartı gerekmez",
        'uk-UA': "Спробувати безкоштовно · Без банківської картки",
    },
};

function get(obj, dotted) {
    return dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function escapeForSingleQuoted(s) {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function localeBlockRange(src, locale) {
    const start = src.indexOf(`'${locale}': {`);
    if (start === -1) throw new Error(`locale block not found: ${locale}`);
    const next = src.slice(start + 1).search(/\n {4}'[a-z]{2}-[A-Z]{2}': \{/);
    return { start, end: next === -1 ? src.length : start + 1 + next };
}

// Walks from the `name: {` inside [from, to) to its matching close brace.
function objectRange(src, name, from, to) {
    const scope = src.slice(from, to);
    const m = scope.match(new RegExp(`\\b${name}\\s*:\\s*\\{`));
    if (!m) return null;
    let i = from + m.index + m[0].length - 1;
    let depth = 0, inStr = false, strCh = '';
    for (; i < to; i++) {
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
    return { start: from + m.index, close: i };
}

/** Rewrites locale -> dotted in the raw source, scoped to that locale's own block. */
function replaceValue(src, locale, dotted, oldValue, newValue) {
    const range = localeBlockRange(src, locale);
    let scopeFrom = range.start, scopeTo = range.end;
    const parts = dotted.split('.');
    for (const parent of parts.slice(0, -1)) {
        const r = objectRange(src, parent, scopeFrom, scopeTo);
        if (!r) return { src, changed: false, reason: `parent ${parent} not found` };
        scopeFrom = r.start;
        scopeTo = r.close + 1;
    }

    const block = src.slice(scopeFrom, scopeTo);
    const leaf = parts[parts.length - 1];
    const re = new RegExp(`(\\b${leaf}\\s*:\\s*)('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")`);
    const m = block.match(re);
    if (!m) return { src, changed: false, reason: `key ${leaf} not found` };

    const currentValue = m[2].slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (currentValue === newValue) return { src, changed: false, reason: 'already set' };
    if (oldValue !== null && currentValue !== oldValue) return { src, changed: false, reason: 'value drift' };

    const newBlock = block.replace(re, `$1'${escapeForSingleQuoted(newValue)}'`);
    return { src: src.slice(0, scopeFrom) + newBlock + src.slice(scopeTo), changed: true };
}

// Any digit next to a minute word, in every script the site ships.
const MINUTE_CLAIM = /\d+\s*(minutes?|minut[aeiouy]*|minuten|minutos|min\.|мин[а-я]*|хвилин[а-я]*|dakika|دقيقة|دقائق|मिनट|분|分)/i;

function main() {
    const before = fs.readFileSync(FILE, 'utf8');
    let src = before;
    const t = loadTranslations(FILE);
    const log = [];

    for (const locale of LOCALES) {
        for (const [dotted, byLocale] of Object.entries(COPY)) {
            const r = replaceValue(src, locale, dotted, get(t[locale], dotted), byLocale[locale]);
            src = r.src;
            log.push(`${r.changed ? 'OK  ' : 'SKIP'} ${locale}.${dotted}${r.reason ? ' — ' + r.reason : ''}`);
        }
    }

    const ok = log.filter(l => l.startsWith('OK')).length;
    const skipped = log.filter(l => l.startsWith('SKIP'));
    if (skipped.length) console.log(skipped.join('\n'));
    console.log(`${ok} replacements, ${skipped.length} skipped`);

    if (CHECK_ONLY) {
        console.log('--check: nothing written');
        return;
    }
    if (src === before) {
        console.log('No changes needed.');
        return;
    }
    fs.writeFileSync(FILE, src, 'utf8');
    console.log(`Wrote ${FILE}`);

    // Verify: the file still parses, every value landed, and no minute count survives.
    const after = loadTranslations(FILE);
    const problems = [];
    for (const locale of LOCALES) {
        for (const [dotted, byLocale] of Object.entries(COPY)) {
            const got = get(after[locale], dotted);
            if (got !== byLocale[locale]) problems.push(`${locale}.${dotted}: expected "${byLocale[locale]}", got "${got}"`);
            else if (MINUTE_CLAIM.test(got)) problems.push(`${locale}.${dotted} still names a duration: ${got}`);
        }
        if (!Array.isArray(after[locale].examples)) problems.push(`${locale}.examples is no longer an array`);
    }
    if (problems.length) {
        console.log('VERIFY FAILED:\n' + problems.join('\n'));
        process.exitCode = 1;
    } else {
        console.log(`Verify OK: ${Object.keys(COPY).length} keys × ${LOCALES.length} locales, no duration named.`);
    }
}

main();
