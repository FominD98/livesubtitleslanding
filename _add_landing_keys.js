// _add_landing_keys.js
// Adds the copy the redesigned homepage needs to translations.js, in all 16 locales,
// and rewrites four existing strings that were too vague to convert.
//
// New groups:  proof.*  how.*  versus.*  privacy.*  apps.*
// New leaves:  navbar.howItWorks, faq.q7/a7 (microphone), faq.q8/a8 (vs built-in captions)
// Rewrites:    comparison.title, features.speechRecognition + the two weakest feature blurbs
//
// Numbers used here are the verified ones: 50 recognition languages, 20 trial minutes,
// sub-second delay, cloud processing. See _fix_false_claims.js for provenance.
//
// Usage:  node _add_landing_keys.js [--check]
// After:  node bake-i18n-defaults.js

const fs = require('fs');
const path = require('path');
const { loadTranslations } = require('./_tr_util.js');

const CHECK_ONLY = process.argv.includes('--check');
const FILE = path.join(__dirname, 'translations.js');
const LOCALES = ['en-US', 'ru-RU', 'fr-FR', 'es-ES', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA', 'hi-IN', 'pt-BR', 'pl-PL', 'nl-NL', 'tr-TR', 'uk-UA'];

// key -> locale -> string.
const COPY = {
    'navbar.howItWorks': {
        'en-US': "How it works", 'ru-RU': "Как это работает", 'fr-FR': "Comment ça marche",
        'es-ES': "Cómo funciona", 'de-DE': "So funktioniert es", 'it-IT': "Come funziona",
        'ja-JP': "使い方", 'ko-KR': "사용 방법", 'zh-CN': "工作原理", 'ar-SA': "كيف يعمل",
        'hi-IN': "यह कैसे काम करता है", 'pt-BR': "Como funciona", 'pl-PL': "Jak to działa",
        'nl-NL': "Hoe het werkt", 'tr-TR': "Nasıl çalışır", 'uk-UA': "Як це працює",
    },
    'proof.trial': {
        'en-US': "First 20 minutes free, no card", 'ru-RU': "Первые 20 минут бесплатно, без карты",
        'fr-FR': "20 premières minutes gratuites, sans carte", 'es-ES': "Primeros 20 minutos gratis, sin tarjeta",
        'de-DE': "Erste 20 Minuten kostenlos, ohne Karte", 'it-IT': "Primi 20 minuti gratis, senza carta",
        'ja-JP': "最初の20分は無料、カード不要", 'ko-KR': "처음 20분 무료, 카드 불필요",
        'zh-CN': "前 20 分钟免费，无需银行卡", 'ar-SA': "أول 20 دقيقة مجانًا، بدون بطاقة",
        'hi-IN': "पहले 20 मिनट मुफ़्त, कार्ड नहीं चाहिए", 'pt-BR': "Primeiros 20 minutos grátis, sem cartão",
        'pl-PL': "Pierwsze 20 minut bezpłatnie, bez karty", 'nl-NL': "Eerste 20 minuten gratis, geen kaart",
        'tr-TR': "İlk 20 dakika ücretsiz, kart gerekmez", 'uk-UA': "Перші 20 хвилин безкоштовно, без картки",
    },
    'proof.langs': {
        'en-US': "50 languages", 'ru-RU': "50 языков", 'fr-FR': "50 langues", 'es-ES': "50 idiomas",
        'de-DE': "50 Sprachen", 'it-IT': "50 lingue", 'ja-JP': "50言語", 'ko-KR': "50개 언어",
        'zh-CN': "50 种语言", 'ar-SA': "50 لغة", 'hi-IN': "50 भाषाएँ", 'pt-BR': "50 idiomas",
        'pl-PL': "50 języków", 'nl-NL': "50 talen", 'tr-TR': "50 dil", 'uk-UA': "50 мов",
    },
    'proof.latency': {
        'en-US': "Under a second of delay", 'ru-RU': "Задержка меньше секунды",
        'fr-FR': "Moins d’une seconde de latence", 'es-ES': "Menos de un segundo de retardo",
        'de-DE': "Weniger als eine Sekunde Verzögerung", 'it-IT': "Meno di un secondo di ritardo",
        'ja-JP': "遅延は1秒未満", 'ko-KR': "1초 미만의 지연", 'zh-CN': "延迟不到一秒",
        'ar-SA': "تأخير أقل من ثانية", 'hi-IN': "एक सेकंड से कम देरी",
        'pt-BR': "Menos de um segundo de atraso", 'pl-PL': "Opóźnienie poniżej sekundy",
        'nl-NL': "Minder dan een seconde vertraging", 'tr-TR': "Bir saniyeden az gecikme",
        'uk-UA': "Затримка менше секунди",
    },
    'how.step1': {
        'en-US': "Pick two languages", 'ru-RU': "Выберите два языка", 'fr-FR': "Choisissez deux langues",
        'es-ES': "Elige dos idiomas", 'de-DE': "Zwei Sprachen wählen", 'it-IT': "Scegli due lingue",
        'ja-JP': "2つの言語を選ぶ", 'ko-KR': "두 가지 언어 선택", 'zh-CN': "选择两种语言",
        'ar-SA': "اختر لغتين", 'hi-IN': "दो भाषाएँ चुनें", 'pt-BR': "Escolha dois idiomas",
        'pl-PL': "Wybierz dwa języki", 'nl-NL': "Kies twee talen", 'tr-TR': "İki dil seçin",
        'uk-UA': "Виберіть дві мови",
    },
    'how.step1desc': {
        'en-US': "Choose the language being spoken and the language you want to read. You can swap them mid-session without stopping.",
        'ru-RU': "Укажите язык, на котором говорят, и язык, на котором хотите читать. Их можно поменять посреди сеанса, не останавливая его.",
        'fr-FR': "Indiquez la langue parlée et celle que vous voulez lire. Vous pouvez les échanger en cours de session sans rien arrêter.",
        'es-ES': "Indica el idioma que se habla y el que quieres leer. Puedes intercambiarlos a mitad de sesión sin detener nada.",
        'de-DE': "Legen Sie fest, welche Sprache gesprochen wird und welche Sie lesen möchten. Beide lassen sich mitten in der Sitzung tauschen.",
        'it-IT': "Indica la lingua parlata e quella che vuoi leggere. Puoi scambiarle a metà sessione senza interrompere nulla.",
        'ja-JP': "話されている言語と、読みたい言語を指定します。セッション中に止めずに入れ替えられます。",
        'ko-KR': "말하는 언어와 읽고 싶은 언어를 고르세요. 세션 중에도 멈추지 않고 바꿀 수 있습니다.",
        'zh-CN': "指定正在说的语言和你想阅读的语言。会话进行中也可以随时互换，不用停下。",
        'ar-SA': "حدّد اللغة المنطوقة واللغة التي تريد قراءتها. يمكنك تبديلهما أثناء الجلسة دون إيقافها.",
        'hi-IN': "बताएँ कि कौन-सी भाषा बोली जा रही है और आप कौन-सी पढ़ना चाहते हैं। सेशन के बीच में भी इन्हें बदला जा सकता है।",
        'pt-BR': "Informe o idioma falado e o que você quer ler. Você pode trocá-los no meio da sessão sem parar nada.",
        'pl-PL': "Wskaż język, w którym się mówi, i ten, w którym chcesz czytać. Możesz je zamienić w trakcie sesji, bez przerywania.",
        'nl-NL': "Geef aan welke taal wordt gesproken en welke je wilt lezen. Je kunt ze midden in een sessie wisselen.",
        'tr-TR': "Konuşulan dili ve okumak istediğiniz dili seçin. Oturum sırasında durdurmadan yer değiştirebilirsiniz.",
        'uk-UA': "Укажіть мову, якою говорять, і мову, якою хочете читати. Їх можна поміняти посеред сеансу, не зупиняючи його.",
    },
    'how.step3': {
        'en-US': "Keep watching", 'ru-RU': "Смотрите дальше", 'fr-FR': "Continuez à regarder",
        'es-ES': "Sigue mirando", 'de-DE': "Weiterschauen", 'it-IT': "Continua a guardare",
        'ja-JP': "そのまま見る", 'ko-KR': "계속 시청하기", 'zh-CN': "继续观看",
        'ar-SA': "واصل المشاهدة", 'hi-IN': "देखते रहें", 'pt-BR': "Continue assistindo",
        'pl-PL': "Oglądaj dalej", 'nl-NL': "Blijf kijken", 'tr-TR': "İzlemeye devam edin",
        'uk-UA': "Дивіться далі",
    },
    'how.step3desc': {
        'en-US': "Captions float above whatever is on screen — a call, a film, a stream, a game. Drag them where you want and carry on.",
        'ru-RU': "Субтитры остаются поверх того, что на экране: звонка, фильма, стрима, игры. Перетащите их куда удобно и продолжайте.",
        'fr-FR': "Les sous-titres restent au-dessus de ce qui est à l’écran : appel, film, stream, jeu. Déplacez-les où vous voulez et continuez.",
        'es-ES': "Los subtítulos quedan sobre lo que haya en pantalla: una llamada, una película, un directo, un juego. Muévelos donde quieras y sigue.",
        'de-DE': "Die Untertitel bleiben über allem, was am Bildschirm läuft — Call, Film, Stream, Spiel. Ziehen Sie sie dorthin, wo sie passen.",
        'it-IT': "I sottotitoli restano sopra ciò che hai a schermo: una chiamata, un film, una diretta, un gioco. Spostali dove vuoi e continua.",
        'ja-JP': "字幕は画面上の何よりも前面に残ります。通話、映画、配信、ゲーム。好きな位置に動かして、そのまま続けられます。",
        'ko-KR': "자막은 화면에 있는 무엇보다 앞에 떠 있습니다. 통화, 영화, 방송, 게임 모두. 원하는 곳으로 끌어다 놓고 계속하세요.",
        'zh-CN': "字幕会浮在屏幕上任何内容之上：通话、电影、直播、游戏。拖到合适的位置，继续就好。",
        'ar-SA': "تبقى الترجمة فوق أي شيء على الشاشة: مكالمة أو فيلم أو بث أو لعبة. اسحبها إلى المكان المناسب وتابع.",
        'hi-IN': "सबटाइटल स्क्रीन पर चल रही किसी भी चीज़ के ऊपर रहते हैं — कॉल, फ़िल्म, स्ट्रीम, गेम। जहाँ चाहें खींच लें और देखते रहें।",
        'pt-BR': "As legendas ficam sobre o que estiver na tela: uma chamada, um filme, uma live, um jogo. Arraste para onde quiser e continue.",
        'pl-PL': "Napisy zostają nad tym, co jest na ekranie: rozmową, filmem, streamem, grą. Przeciągnij je tam, gdzie pasują, i oglądaj dalej.",
        'nl-NL': "De ondertitels blijven boven alles wat op je scherm staat: een gesprek, een film, een stream, een game. Sleep ze waar je wilt en ga door.",
        'tr-TR': "Altyazılar ekranda ne varsa onun üzerinde kalır: görüşme, film, yayın, oyun. İstediğiniz yere sürükleyip devam edin.",
        'uk-UA': "Субтитри залишаються поверх того, що на екрані: дзвінка, фільму, стриму, гри. Перетягніть їх куди зручно й дивіться далі.",
    },
    'versus.lead': {
        'en-US': "Most options solve one part of the problem. System captions cannot translate, browser extensions stop working outside the browser, and meeting assistants have to join the call as a participant.",
        'ru-RU': "Большинство решений закрывают только часть задачи. Системные субтитры не переводят, браузерные расширения не работают за пределами браузера, а помощники для встреч должны зайти в звонок как участник.",
        'fr-FR': "La plupart des solutions ne traitent qu’une partie du problème. Les sous-titres système ne traduisent pas, les extensions de navigateur s’arrêtent hors du navigateur, et les assistants de réunion doivent rejoindre l’appel comme participant.",
        'es-ES': "La mayoría de las opciones resuelve solo una parte. Los subtítulos del sistema no traducen, las extensiones de navegador dejan de funcionar fuera del navegador y los asistentes de reuniones tienen que entrar en la llamada como participantes.",
        'de-DE': "Die meisten Lösungen decken nur einen Teil ab. Systemuntertitel übersetzen nicht, Browser-Erweiterungen hören außerhalb des Browsers auf, und Meeting-Assistenten müssen als Teilnehmer in den Call.",
        'it-IT': "La maggior parte delle soluzioni copre solo una parte. I sottotitoli di sistema non traducono, le estensioni per browser si fermano fuori dal browser e gli assistenti per riunioni devono entrare in chiamata come partecipanti.",
        'ja-JP': "多くの選択肢は問題の一部しか解決しません。システム字幕は翻訳せず、ブラウザ拡張はブラウザの外では働かず、会議アシスタントは参加者として通話に入る必要があります。",
        'ko-KR': "대부분의 선택지는 문제의 일부만 해결합니다. 시스템 자막은 번역하지 않고, 브라우저 확장은 브라우저 밖에서 멈추며, 회의 도우미는 참가자로 통화에 들어가야 합니다.",
        'zh-CN': "多数方案只解决了一部分问题。系统字幕不做翻译，浏览器扩展离开浏览器就失效，会议助手必须作为参与者加入通话。",
        'ar-SA': "معظم الحلول تعالج جزءًا من المشكلة فقط. ترجمة النظام لا تترجم إلى لغة أخرى، وإضافات المتصفح تتوقف خارج المتصفح، ومساعدو الاجتماعات يجب أن ينضموا إلى المكالمة كمشارك.",
        'hi-IN': "ज़्यादातर विकल्प समस्या का एक ही हिस्सा हल करते हैं। सिस्टम कैप्शन अनुवाद नहीं करते, ब्राउज़र एक्सटेंशन ब्राउज़र के बाहर काम नहीं करते, और मीटिंग असिस्टेंट को कॉल में प्रतिभागी बनकर जुड़ना पड़ता है।",
        'pt-BR': "A maioria das opções resolve só uma parte. As legendas do sistema não traduzem, as extensões de navegador param de funcionar fora do navegador e os assistentes de reunião precisam entrar na chamada como participantes.",
        'pl-PL': "Większość rozwiązań zamyka tylko część problemu. Napisy systemowe nie tłumaczą, rozszerzenia przeglądarki przestają działać poza nią, a asystenci spotkań muszą wejść do rozmowy jako uczestnik.",
        'nl-NL': "De meeste opties lossen maar een deel op. Systeemondertitels vertalen niet, browserextensies stoppen buiten de browser, en vergaderassistenten moeten als deelnemer aan het gesprek meedoen.",
        'tr-TR': "Seçeneklerin çoğu sorunun yalnızca bir kısmını çözer. Sistem altyazıları çeviri yapmaz, tarayıcı eklentileri tarayıcı dışında durur ve toplantı asistanları görüşmeye katılımcı olarak girmek zorundadır.",
        'uk-UA': "Більшість рішень закривають лише частину задачі. Системні субтитри не перекладають, браузерні розширення не працюють за межами браузера, а помічники для зустрічей мусять зайти у дзвінок як учасник.",
    },
    'versus.colApp': {
        'en-US': "Works in any app, not only a browser", 'ru-RU': "Работает в любом приложении, не только в браузере",
        'fr-FR': "Fonctionne dans toute application, pas seulement le navigateur",
        'es-ES': "Funciona en cualquier app, no solo en el navegador",
        'de-DE': "Läuft in jeder App, nicht nur im Browser", 'it-IT': "Funziona in qualsiasi app, non solo nel browser",
        'ja-JP': "ブラウザだけでなく、あらゆるアプリで動く", 'ko-KR': "브라우저뿐 아니라 모든 앱에서 작동",
        'zh-CN': "在任何应用中都能用，不限于浏览器", 'ar-SA': "يعمل في أي تطبيق، وليس في المتصفح فقط",
        'hi-IN': "किसी भी ऐप में चलता है, सिर्फ़ ब्राउज़र में नहीं",
        'pt-BR': "Funciona em qualquer app, não só no navegador",
        'pl-PL': "Działa w każdej aplikacji, nie tylko w przeglądarce",
        'nl-NL': "Werkt in elke app, niet alleen in de browser",
        'tr-TR': "Yalnızca tarayıcıda değil, her uygulamada çalışır",
        'uk-UA': "Працює в будь-якому застосунку, не лише в браузері",
    },
    'versus.colTranslate': {
        'en-US': "Shows the original and the translation together",
        'ru-RU': "Показывает оригинал и перевод вместе",
        'fr-FR': "Affiche l’original et la traduction ensemble",
        'es-ES': "Muestra el original y la traducción juntos",
        'de-DE': "Zeigt Original und Übersetzung zusammen",
        'it-IT': "Mostra originale e traduzione insieme",
        'ja-JP': "原文と訳文を同時に表示", 'ko-KR': "원문과 번역을 함께 표시",
        'zh-CN': "同时显示原文和译文", 'ar-SA': "يعرض النص الأصلي والترجمة معًا",
        'hi-IN': "मूल और अनुवाद, दोनों साथ दिखाता है",
        'pt-BR': "Mostra o original e a tradução juntos",
        'pl-PL': "Pokazuje oryginał i tłumaczenie razem",
        'nl-NL': "Toont origineel en vertaling samen",
        'tr-TR': "Özgün metni ve çeviriyi birlikte gösterir",
        'uk-UA': "Показує оригінал і переклад разом",
    },
    'versus.colNoBot': {
        'en-US': "Nothing joins your call", 'ru-RU': "В звонок никто не заходит",
        'fr-FR': "Rien ne rejoint votre appel", 'es-ES': "Nada se une a tu llamada",
        'de-DE': "Nichts tritt Ihrem Call bei", 'it-IT': "Nessuno entra nella tua chiamata",
        'ja-JP': "通話に何も参加しない", 'ko-KR': "통화에 아무것도 참여하지 않음",
        'zh-CN': "不会有任何东西加入你的通话", 'ar-SA': "لا شيء ينضم إلى مكالمتك",
        'hi-IN': "आपकी कॉल में कोई नहीं जुड़ता", 'pt-BR': "Nada entra na sua chamada",
        'pl-PL': "Nic nie dołącza do twojej rozmowy", 'nl-NL': "Er sluit niets aan bij je gesprek",
        'tr-TR': "Görüşmenize hiçbir şey katılmaz", 'uk-UA': "У дзвінок ніхто не заходить",
    },
    'versus.rowBuiltin': {
        'en-US': "Built-in system captions", 'ru-RU': "Встроенные системные субтитры",
        'fr-FR': "Sous-titres système intégrés", 'es-ES': "Subtítulos del sistema",
        'de-DE': "Eingebaute Systemuntertitel", 'it-IT': "Sottotitoli di sistema integrati",
        'ja-JP': "OS標準の字幕", 'ko-KR': "운영체제 기본 자막", 'zh-CN': "系统自带字幕",
        'ar-SA': "ترجمة النظام المدمجة", 'hi-IN': "सिस्टम में पहले से मौजूद कैप्शन",
        'pt-BR': "Legendas nativas do sistema", 'pl-PL': "Wbudowane napisy systemowe",
        'nl-NL': "Ingebouwde systeemondertitels", 'tr-TR': "Sistemde yerleşik altyazılar",
        'uk-UA': "Вбудовані системні субтитри",
    },
    'versus.rowExt': {
        'en-US': "Browser extensions", 'ru-RU': "Браузерные расширения", 'fr-FR': "Extensions de navigateur",
        'es-ES': "Extensiones de navegador", 'de-DE': "Browser-Erweiterungen", 'it-IT': "Estensioni per browser",
        'ja-JP': "ブラウザ拡張機能", 'ko-KR': "브라우저 확장 프로그램", 'zh-CN': "浏览器扩展",
        'ar-SA': "إضافات المتصفح", 'hi-IN': "ब्राउज़र एक्सटेंशन", 'pt-BR': "Extensões de navegador",
        'pl-PL': "Rozszerzenia przeglądarki", 'nl-NL': "Browserextensies", 'tr-TR': "Tarayıcı eklentileri",
        'uk-UA': "Браузерні розширення",
    },
    'versus.rowBots': {
        'en-US': "Meeting assistants that join the call", 'ru-RU': "Помощники для встреч, которые заходят в звонок",
        'fr-FR': "Assistants de réunion qui rejoignent l’appel",
        'es-ES': "Asistentes de reuniones que entran en la llamada",
        'de-DE': "Meeting-Assistenten, die dem Call beitreten",
        'it-IT': "Assistenti per riunioni che entrano in chiamata",
        'ja-JP': "通話に参加する会議アシスタント", 'ko-KR': "통화에 참여하는 회의 도우미",
        'zh-CN': "需要加入通话的会议助手", 'ar-SA': "مساعدو الاجتماعات الذين ينضمون إلى المكالمة",
        'hi-IN': "कॉल में जुड़ने वाले मीटिंग असिस्टेंट",
        'pt-BR': "Assistentes de reunião que entram na chamada",
        'pl-PL': "Asystenci spotkań, którzy dołączają do rozmowy",
        'nl-NL': "Vergaderassistenten die aan het gesprek deelnemen",
        'tr-TR': "Görüşmeye katılan toplantı asistanları",
        'uk-UA': "Помічники для зустрічей, які заходять у дзвінок",
    },
    'versus.yes': {
        'en-US': "Yes", 'ru-RU': "Да", 'fr-FR': "Oui", 'es-ES': "Sí", 'de-DE': "Ja", 'it-IT': "Sì",
        'ja-JP': "はい", 'ko-KR': "예", 'zh-CN': "是", 'ar-SA': "نعم", 'hi-IN': "हाँ", 'pt-BR': "Sim",
        'pl-PL': "Tak", 'nl-NL': "Ja", 'tr-TR': "Evet", 'uk-UA': "Так",
    },
    'versus.no': {
        'en-US': "No", 'ru-RU': "Нет", 'fr-FR': "Non", 'es-ES': "No", 'de-DE': "Nein", 'it-IT': "No",
        'ja-JP': "いいえ", 'ko-KR': "아니요", 'zh-CN': "否", 'ar-SA': "لا", 'hi-IN': "नहीं", 'pt-BR': "Não",
        'pl-PL': "Nie", 'nl-NL': "Nee", 'tr-TR': "Hayır", 'uk-UA': "Ні",
    },
    'privacy.title': {
        'en-US': "What happens to your audio", 'ru-RU': "Что происходит с вашим звуком",
        'fr-FR': "Ce qui arrive à votre audio", 'es-ES': "Qué pasa con tu audio",
        'de-DE': "Was mit Ihrem Audio passiert", 'it-IT': "Cosa succede al tuo audio",
        'ja-JP': "音声はどう扱われるか", 'ko-KR': "오디오는 어떻게 처리되나요",
        'zh-CN': "你的音频会怎样处理", 'ar-SA': "ما يحدث للصوت الخاص بك",
        'hi-IN': "आपके ऑडियो के साथ क्या होता है", 'pt-BR': "O que acontece com o seu áudio",
        'pl-PL': "Co dzieje się z twoim dźwiękiem", 'nl-NL': "Wat er met je audio gebeurt",
        'tr-TR': "Sesinize ne oluyor", 'uk-UA': "Що відбувається з вашим звуком",
    },
    'privacy.body': {
        'en-US': "Recognition and translation run on our providers' servers, so the app needs an internet connection. Audio is streamed only while a session is running and we do not record it. Captions are drawn on your screen only — nobody else in the call sees them.",
        'ru-RU': "Распознавание и перевод выполняются на серверах наших провайдеров, поэтому приложению нужен интернет. Звук передаётся только во время сеанса, и мы его не записываем. Субтитры рисуются только на вашем экране — другие участники звонка их не видят.",
        'fr-FR': "La reconnaissance et la traduction s’exécutent sur les serveurs de nos prestataires, l’application a donc besoin d’une connexion internet. L’audio est transmis uniquement pendant une session et nous ne l’enregistrons pas. Les sous-titres ne s’affichent que sur votre écran — personne d’autre dans l’appel ne les voit.",
        'es-ES': "El reconocimiento y la traducción se ejecutan en los servidores de nuestros proveedores, así que la app necesita conexión a internet. El audio se transmite solo mientras la sesión está activa y no lo grabamos. Los subtítulos se dibujan solo en tu pantalla: nadie más en la llamada los ve.",
        'de-DE': "Erkennung und Übersetzung laufen auf den Servern unserer Anbieter, die App braucht daher eine Internetverbindung. Audio wird nur während einer laufenden Sitzung übertragen und von uns nicht aufgezeichnet. Die Untertitel erscheinen ausschließlich auf Ihrem Bildschirm — niemand sonst im Call sieht sie.",
        'it-IT': "Riconoscimento e traduzione girano sui server dei nostri fornitori, quindi l’app ha bisogno di una connessione internet. L’audio viene trasmesso solo mentre la sessione è attiva e non lo registriamo. I sottotitoli compaiono solo sul tuo schermo: nessun altro in chiamata li vede.",
        'ja-JP': "音声認識と翻訳は当社プロバイダーのサーバーで実行されるため、インターネット接続が必要です。音声はセッション中のみ送信され、当社が録音することはありません。字幕はあなたの画面にのみ描かれ、通話の他の参加者には見えません。",
        'ko-KR': "인식과 번역은 저희 제공업체 서버에서 실행되므로 인터넷 연결이 필요합니다. 오디오는 세션이 진행되는 동안에만 전송되며 저희가 녹음하지 않습니다. 자막은 여러분 화면에만 그려지고, 통화의 다른 참가자에게는 보이지 않습니다.",
        'zh-CN': "识别和翻译在我们服务商的服务器上运行，因此应用需要联网。音频仅在会话进行时传输，我们不会录制。字幕只画在你的屏幕上，通话中的其他人看不到。",
        'ar-SA': "يتم التعرف على الكلام والترجمة على خوادم مزوّدي الخدمة لدينا، لذا يحتاج التطبيق إلى اتصال بالإنترنت. يُنقل الصوت فقط أثناء الجلسة ولا نقوم بتسجيله. تُرسم الترجمة على شاشتك أنت فقط، ولا يراها بقية المشاركين في المكالمة.",
        'hi-IN': "पहचान और अनुवाद हमारे प्रदाताओं के सर्वर पर चलते हैं, इसलिए ऐप को इंटरनेट कनेक्शन चाहिए। ऑडियो केवल सेशन चलने के दौरान भेजा जाता है और हम उसे रिकॉर्ड नहीं करते। सबटाइटल सिर्फ़ आपकी स्क्रीन पर बनते हैं — कॉल में बाकी किसी को दिखाई नहीं देते।",
        'pt-BR': "Reconhecimento e tradução rodam nos servidores dos nossos provedores, então o app precisa de conexão com a internet. O áudio é transmitido apenas enquanto a sessão está ativa e não o gravamos. As legendas aparecem só na sua tela — mais ninguém na chamada as vê.",
        'pl-PL': "Rozpoznawanie i tłumaczenie działają na serwerach naszych dostawców, więc aplikacja potrzebuje internetu. Dźwięk jest przesyłany tylko w czasie trwania sesji i nie nagrywamy go. Napisy są rysowane wyłącznie na twoim ekranie — nikt inny w rozmowie ich nie widzi.",
        'nl-NL': "Herkenning en vertaling lopen op de servers van onze providers, dus de app heeft internet nodig. Audio wordt alleen verstuurd tijdens een actieve sessie en wij nemen het niet op. De ondertitels staan alleen op jouw scherm — niemand anders in het gesprek ziet ze.",
        'tr-TR': "Tanıma ve çeviri, sağlayıcılarımızın sunucularında çalışır; bu yüzden uygulama internet bağlantısı gerektirir. Ses yalnızca oturum sürerken iletilir ve tarafımızca kaydedilmez. Altyazılar yalnızca sizin ekranınıza çizilir — görüşmedeki başka kimse görmez.",
        'uk-UA': "Розпізнавання й переклад виконуються на серверах наших провайдерів, тому застосунку потрібен інтернет. Звук передається лише під час сеансу, і ми його не записуємо. Субтитри малюються тільки на вашому екрані — інші учасники дзвінка їх не бачать.",
    },
    'privacy.more': {
        'en-US': "Read the privacy policy", 'ru-RU': "Читать политику приватности",
        'fr-FR': "Lire la politique de confidentialité", 'es-ES': "Leer la política de privacidad",
        'de-DE': "Datenschutzerklärung lesen", 'it-IT': "Leggi l’informativa sulla privacy",
        'ja-JP': "プライバシーポリシーを読む", 'ko-KR': "개인정보 처리방침 보기",
        'zh-CN': "阅读隐私政策", 'ar-SA': "اقرأ سياسة الخصوصية",
        'hi-IN': "प्राइवेसी पॉलिसी पढ़ें", 'pt-BR': "Ler a política de privacidade",
        'pl-PL': "Przeczytaj politykę prywatności", 'nl-NL': "Lees het privacybeleid",
        'tr-TR': "Gizlilik politikasını okuyun", 'uk-UA': "Читати політику приватності",
    },
    'apps.note': {
        'en-US': "…and anything else that plays sound on your device.",
        'ru-RU': "…и всё остальное, что воспроизводит звук на вашем устройстве.",
        'fr-FR': "…et tout ce qui joue du son sur votre appareil.",
        'es-ES': "…y cualquier otra cosa que reproduzca sonido en tu dispositivo.",
        'de-DE': "…und alles andere, was auf Ihrem Gerät Ton abspielt.",
        'it-IT': "…e qualsiasi altra cosa che riproduca audio sul tuo dispositivo.",
        'ja-JP': "…そのほか、デバイスで音を再生するものすべて。",
        'ko-KR': "…그리고 기기에서 소리를 내는 그 밖의 모든 것.",
        'zh-CN': "……以及设备上任何会发出声音的内容。",
        'ar-SA': "…وأي شيء آخر يشغّل صوتًا على جهازك.",
        'hi-IN': "…और वह सब कुछ जो आपके डिवाइस पर आवाज़ चलाता है।",
        'pt-BR': "…e qualquer outra coisa que reproduza som no seu dispositivo.",
        'pl-PL': "…i wszystko inne, co odtwarza dźwięk na twoim urządzeniu.",
        'nl-NL': "…en al het andere dat geluid afspeelt op je apparaat.",
        'tr-TR': "…ve cihazınızda ses çalan her şey.",
        'uk-UA': "…і все інше, що відтворює звук на вашому пристрої.",
    },
    'faq.q7': {
        'en-US': "Do I need a microphone, and will other people hear anything?",
        'ru-RU': "Нужен ли микрофон и услышат ли что-нибудь другие участники?",
        'fr-FR': "Faut-il un micro, et les autres entendront-ils quelque chose ?",
        'es-ES': "¿Necesito micrófono y los demás oirán algo?",
        'de-DE': "Brauche ich ein Mikrofon, und hören die anderen etwas?",
        'it-IT': "Serve un microfono e gli altri sentiranno qualcosa?",
        'ja-JP': "マイクは必要ですか。ほかの参加者に何か聞こえますか。",
        'ko-KR': "마이크가 필요한가요? 다른 사람에게 무언가 들리나요?",
        'zh-CN': "需要麦克风吗？其他人会听到什么吗？",
        'ar-SA': "هل أحتاج إلى ميكروفون، وهل يسمع الآخرون شيئًا؟",
        'hi-IN': "क्या माइक्रोफ़ोन चाहिए, और क्या बाकी लोगों को कुछ सुनाई देगा?",
        'pt-BR': "Preciso de microfone e as outras pessoas vão ouvir algo?",
        'pl-PL': "Czy potrzebny jest mikrofon i czy inni coś usłyszą?",
        'nl-NL': "Heb ik een microfoon nodig en horen anderen iets?",
        'tr-TR': "Mikrofon gerekiyor mu, diğerleri bir şey duyar mı?",
        'uk-UA': "Чи потрібен мікрофон і чи почують щось інші учасники?",
    },
    'faq.a7': {
        'en-US': "For anything your device plays, no microphone is needed — the app reads that audio directly. If you want to caption someone speaking in the room, switch the source to Microphone. Either way nothing joins your call, and nobody else sees the captions: they are drawn on your screen only.",
        'ru-RU': "Для всего, что воспроизводит устройство, микрофон не нужен — приложение читает этот звук напрямую. А если нужно разобрать того, кто говорит рядом, переключите источник на микрофон. В любом случае в звонок ничего не заходит, и субтитры видите только вы: они рисуются на вашем экране.",
        'fr-FR': "Pour tout ce que joue votre appareil, aucun micro n’est nécessaire : l’application lit cet audio directement. Si vous voulez sous-titrer quelqu’un qui parle dans la pièce, basculez la source sur le microphone. Dans les deux cas rien ne rejoint l’appel et personne d’autre ne voit les sous-titres, ils s’affichent uniquement sur votre écran.",
        'es-ES': "Para todo lo que reproduce tu dispositivo no hace falta micrófono: la app lee ese audio directamente. Si quieres subtitular a alguien que habla en la sala, cambia la fuente a micrófono. En ambos casos nada se une a la llamada y nadie más ve los subtítulos, se dibujan solo en tu pantalla.",
        'de-DE': "Für alles, was Ihr Gerät abspielt, ist kein Mikrofon nötig — die App liest diesen Ton direkt. Wenn Sie jemanden im Raum mitlesen wollen, stellen Sie die Quelle auf Mikrofon. In beiden Fällen tritt dem Call nichts bei, und die Untertitel sieht nur Sie: Sie erscheinen allein auf Ihrem Bildschirm.",
        'it-IT': "Per tutto ciò che il dispositivo riproduce non serve il microfono: l’app legge quell’audio direttamente. Se vuoi sottotitolare qualcuno che parla nella stanza, passa la sorgente al microfono. In entrambi i casi nessuno entra in chiamata e nessun altro vede i sottotitoli, che compaiono solo sul tuo schermo.",
        'ja-JP': "デバイスが再生する音であればマイクは不要で、アプリがその音を直接読み取ります。目の前で話している人に字幕を付けたい場合は、入力をマイクに切り替えてください。どちらの場合も通話に何も参加せず、字幕はあなたの画面だけに描かれます。",
        'ko-KR': "기기가 재생하는 소리라면 마이크는 필요하지 않습니다. 앱이 그 오디오를 직접 읽습니다. 방 안에서 말하는 사람에게 자막을 붙이려면 입력을 마이크로 바꾸세요. 어느 쪽이든 통화에 아무것도 참여하지 않고, 자막은 여러분 화면에만 그려집니다.",
        'zh-CN': "只要是设备播放的声音，就不需要麦克风——应用会直接读取。如果想给房间里正在说话的人加字幕，把输入切换到麦克风即可。两种情况下都不会有东西加入通话，字幕也只画在你的屏幕上。",
        'ar-SA': "لكل ما يشغّله جهازك لا حاجة إلى ميكروفون؛ يقرأ التطبيق ذلك الصوت مباشرة. وإذا أردت ترجمة شخص يتحدث في الغرفة، حوّل المصدر إلى الميكروفون. في كلتا الحالتين لا شيء ينضم إلى المكالمة، ولا يرى الترجمة أحد غيرك لأنها تُرسم على شاشتك فقط.",
        'hi-IN': "जो कुछ आपका डिवाइस चला रहा है, उसके लिए माइक्रोफ़ोन की ज़रूरत नहीं — ऐप वह ऑडियो सीधे पढ़ता है। अगर कमरे में बोल रहे किसी व्यक्ति के सबटाइटल चाहिए, तो स्रोत को माइक्रोफ़ोन पर बदल दें। दोनों ही हालत में कॉल में कुछ नहीं जुड़ता और सबटाइटल सिर्फ़ आपकी स्क्रीन पर बनते हैं।",
        'pt-BR': "Para tudo o que seu dispositivo reproduz não precisa de microfone — o app lê esse áudio diretamente. Se quiser legendar alguém falando na sala, troque a fonte para microfone. Nos dois casos nada entra na chamada e mais ninguém vê as legendas: elas aparecem só na sua tela.",
        'pl-PL': "Do wszystkiego, co odtwarza urządzenie, mikrofon nie jest potrzebny — aplikacja czyta ten dźwięk bezpośrednio. Jeśli chcesz napisy do kogoś, kto mówi w pokoju, przełącz źródło na mikrofon. W obu przypadkach nic nie dołącza do rozmowy, a napisy widzisz tylko ty: są rysowane na twoim ekranie.",
        'nl-NL': "Voor alles wat je apparaat afspeelt is geen microfoon nodig — de app leest dat geluid direct. Wil je iemand ondertitelen die in de kamer praat, zet dan de bron op microfoon. In beide gevallen sluit er niets aan bij je gesprek en ziet niemand anders de ondertitels: die staan alleen op jouw scherm.",
        'tr-TR': "Cihazınızın çaldığı her şey için mikrofona gerek yok — uygulama o sesi doğrudan okur. Odada konuşan birini altyazılamak isterseniz kaynağı mikrofona alın. Her iki durumda da görüşmeye hiçbir şey katılmaz ve altyazıları yalnızca siz görürsünüz.",
        'uk-UA': "Для всього, що відтворює пристрій, мікрофон не потрібен — застосунок читає цей звук напряму. А якщо треба розібрати того, хто говорить поруч, перемкніть джерело на мікрофон. У будь-якому разі у дзвінок нічого не заходить, і субтитри бачите лише ви: вони малюються на вашому екрані.",
    },
    'faq.q8': {
        'en-US': "How is this different from the live captions built into Windows?",
        'ru-RU': "Чем это отличается от встроенных субтитров Windows?",
        'fr-FR': "En quoi est-ce différent des sous-titres intégrés à Windows ?",
        'es-ES': "¿En qué se diferencia de los subtítulos que ya trae Windows?",
        'de-DE': "Worin unterscheidet sich das von den Untertiteln in Windows?",
        'it-IT': "In cosa è diverso dai sottotitoli già presenti in Windows?",
        'ja-JP': "Windows標準のライブキャプションとの違いは何ですか。",
        'ko-KR': "Windows에 내장된 실시간 자막과 어떻게 다른가요?",
        'zh-CN': "这和 Windows 自带的实时字幕有什么区别？",
        'ar-SA': "ما الفرق بين هذا وبين الترجمة المدمجة في Windows؟",
        'hi-IN': "यह Windows में पहले से मौजूद लाइव कैप्शन से कैसे अलग है?",
        'pt-BR': "Qual a diferença em relação às legendas que já vêm no Windows?",
        'pl-PL': "Czym to różni się od napisów wbudowanych w Windows?",
        'nl-NL': "Wat is het verschil met de ondertitels die in Windows zitten?",
        'tr-TR': "Windows’ta yerleşik canlı altyazılardan farkı ne?",
        'uk-UA': "Чим це відрізняється від вбудованих субтитрів Windows?",
    },
    'faq.a8': {
        'en-US': "Built-in captions transcribe what is said in the same language. Live Subtitles shows the original line and a translation beneath it, in 50 languages, and keeps the pair in view so you can follow both at once.",
        'ru-RU': "Встроенные субтитры расшифровывают речь на том же языке. Live Subtitles показывает оригинальную строку и перевод под ней — на 50 языках — и держит обе строки на экране, чтобы вы следили сразу за двумя.",
        'fr-FR': "Les sous-titres intégrés transcrivent ce qui est dit dans la même langue. Live Subtitles affiche la ligne d’origine et sa traduction en dessous, dans 50 langues, et garde les deux visibles en même temps.",
        'es-ES': "Los subtítulos integrados transcriben lo que se dice en el mismo idioma. Live Subtitles muestra la línea original y la traducción debajo, en 50 idiomas, y mantiene las dos a la vista a la vez.",
        'de-DE': "Eingebaute Untertitel transkribieren das Gesagte in derselben Sprache. Live Subtitles zeigt die Originalzeile und darunter die Übersetzung — in 50 Sprachen — und hält beide gleichzeitig im Blick.",
        'it-IT': "I sottotitoli integrati trascrivono ciò che viene detto nella stessa lingua. Live Subtitles mostra la riga originale e sotto la traduzione, in 50 lingue, tenendo entrambe visibili insieme.",
        'ja-JP': "標準の字幕は話された内容を同じ言語で文字にします。Live Subtitles は原文の行とその下に訳文を50言語で表示し、両方を同時に見られる状態で保ちます。",
        'ko-KR': "내장 자막은 같은 언어로 말한 내용을 받아 적습니다. Live Subtitles는 원문 줄과 그 아래 번역을 50개 언어로 보여 주고, 두 줄을 함께 화면에 유지해 동시에 따라갈 수 있게 합니다.",
        'zh-CN': "自带字幕只是把说的话用同一种语言转成文字。Live Subtitles 会显示原文行，并在下面给出译文，支持 50 种语言，两行同时留在画面上，可以一起看。",
        'ar-SA': "الترجمة المدمجة تكتب ما يُقال باللغة نفسها. أما Live Subtitles فيعرض السطر الأصلي والترجمة تحته بـ 50 لغة، ويُبقي السطرين معًا على الشاشة لتتابعهما في الوقت نفسه.",
        'hi-IN': "पहले से मौजूद कैप्शन जो कहा गया उसे उसी भाषा में लिख देते हैं। Live Subtitles मूल पंक्ति दिखाता है और उसके नीचे 50 भाषाओं में अनुवाद, और दोनों को साथ स्क्रीन पर रखता है ताकि आप एक ही समय में दोनों पढ़ सकें।",
        'pt-BR': "As legendas nativas transcrevem o que é dito no mesmo idioma. O Live Subtitles mostra a linha original e a tradução abaixo, em 50 idiomas, e mantém as duas à vista ao mesmo tempo.",
        'pl-PL': "Wbudowane napisy zapisują to, co powiedziano, w tym samym języku. Live Subtitles pokazuje oryginalną linijkę i pod nią tłumaczenie w 50 językach, trzymając obie na ekranie jednocześnie.",
        'nl-NL': "Ingebouwde ondertitels zetten om wat er gezegd wordt, in dezelfde taal. Live Subtitles toont de originele regel met daaronder een vertaling in 50 talen, en houdt beide tegelijk in beeld.",
        'tr-TR': "Yerleşik altyazılar söyleneni aynı dilde yazıya çevirir. Live Subtitles özgün satırı ve altında 50 dilde çeviriyi gösterir, ikisini aynı anda ekranda tutar.",
        'uk-UA': "Вбудовані субтитри розшифровують мовлення тією ж мовою. Live Subtitles показує оригінальний рядок і переклад під ним — 50 мовами — і тримає обидва рядки на екрані, щоб ви бачили їх водночас.",
    },
    // ── Batch 2: audio sources + Live Voice ───────────────────────────────
    // The app has two audio sources, "System Audio" and "Microphone"
    // (Localization/Languages/en-US.json: SystemLoopback / Microphone). Selling it as
    // "no microphone" was half the story and dropped a real use case: captioning a
    // talk or a lecture happening in the room.
    //
    // Live Voice speaks the translation aloud while the original keeps playing
    // (LiveVoiceDriverInstallPrompt). Windows only in practice — macOS ships
    // NoOpLiveTranslationSpeechService — needs a one-time audio driver, and covers a
    // subset of languages (StoreVoiceLanguageFeature*), not all 50.
    'header.lead': {
        'en-US': "Translates speech in real time into 50 languages. Captions the sound your device plays — or the room in front of you. Works with Zoom, Teams, Google Meet and any app, on Windows, macOS, iOS and Android.",
        'ru-RU': "Переводит речь в реальном времени на 50 языков. Показывает субтитры к звуку, который играет на устройстве, — или к тому, что говорят рядом с вами. Работает с Zoom, Teams, Google Meet и любым приложением, на Windows, macOS, iOS и Android.",
        'fr-FR': "Traduit la parole en temps réel dans 50 langues. Sous-titre le son que joue votre appareil — ou ce qui se dit dans la pièce. Fonctionne avec Zoom, Teams, Google Meet et toute application, sur Windows, macOS, iOS et Android.",
        'es-ES': "Traduce el habla en tiempo real a 50 idiomas. Subtitula el sonido que reproduce tu dispositivo — o lo que se dice en la sala. Funciona con Zoom, Teams, Google Meet y cualquier app, en Windows, macOS, iOS y Android.",
        'de-DE': "Übersetzt Sprache in Echtzeit in 50 Sprachen. Untertitelt den Ton, den Ihr Gerät abspielt — oder das, was im Raum gesprochen wird. Funktioniert mit Zoom, Teams, Google Meet und jeder App, auf Windows, macOS, iOS und Android.",
        'it-IT': "Traduce il parlato in tempo reale in 50 lingue. Sottotitola l’audio che il dispositivo riproduce — o ciò che si dice nella stanza. Funziona con Zoom, Teams, Google Meet e qualsiasi app, su Windows, macOS, iOS e Android.",
        'ja-JP': "音声を50言語にリアルタイム翻訳します。デバイスが再生している音にも、目の前で話されている声にも字幕を付けられます。Zoom、Teams、Google Meet などあらゆるアプリに対応し、Windows、macOS、iOS、Android で使えます。",
        'ko-KR': "음성을 50개 언어로 실시간 번역합니다. 기기가 재생하는 소리에도, 바로 앞에서 말하는 사람에게도 자막을 붙일 수 있습니다. Zoom, Teams, Google Meet 등 모든 앱에서, Windows·macOS·iOS·Android로 사용할 수 있습니다.",
        'zh-CN': "把语音实时翻译成 50 种语言。既能给设备播放的声音加字幕，也能给身边正在说话的人加字幕。支持 Zoom、Teams、Google Meet 等任何应用，可在 Windows、macOS、iOS 和 Android 上使用。",
        'ar-SA': "يترجم الكلام فوريًا إلى 50 لغة. يضيف ترجمة للصوت الذي يشغّله جهازك — أو لما يُقال في الغرفة أمامك. يعمل مع Zoom وTeams وGoogle Meet وأي تطبيق، على Windows وmacOS وiOS وAndroid.",
        'hi-IN': "बोली को 50 भाषाओं में रीयल-टाइम अनुवाद करता है। जो आवाज़ आपका डिवाइस चला रहा है, उस पर भी और सामने कमरे में जो बोला जा रहा है, उस पर भी सबटाइटल देता है। Zoom, Teams, Google Meet और किसी भी ऐप के साथ, Windows, macOS, iOS और Android पर।",
        'pt-BR': "Traduz a fala em tempo real para 50 idiomas. Legenda o som que seu dispositivo reproduz — ou o que está sendo dito na sala. Funciona com Zoom, Teams, Google Meet e qualquer app, no Windows, macOS, iOS e Android.",
        'pl-PL': "Tłumaczy mowę w czasie rzeczywistym na 50 języków. Tworzy napisy do dźwięku, który odtwarza urządzenie — albo do tego, co mówi się w pokoju. Działa z Zoom, Teams, Google Meet i każdą aplikacją, na Windows, macOS, iOS i Android.",
        'nl-NL': "Vertaalt spraak in real time naar 50 talen. Ondertitelt het geluid dat je apparaat afspeelt — of wat er in de kamer gezegd wordt. Werkt met Zoom, Teams, Google Meet en elke app, op Windows, macOS, iOS en Android.",
        'tr-TR': "Konuşmayı 50 dile gerçek zamanlı çevirir. Cihazınızın çaldığı sese de, karşınızdaki odada konuşulana da altyazı ekler. Zoom, Teams, Google Meet ve her uygulamayla; Windows, macOS, iOS ve Android üzerinde çalışır.",
        'uk-UA': "Перекладає мовлення в реальному часі на 50 мов. Показує субтитри до звуку, який грає на пристрої, — або до того, що говорять поруч із вами. Працює з Zoom, Teams, Google Meet і будь-яким застосунком, на Windows, macOS, iOS та Android.",
    },
    // Batch 3. There is no separate "press start": recognition follows the sound. The STT
    // services carry a 3s silence timer (DeepgramSTTService.cs:29 SilenceTimeoutMs,
    // OnSilenceDetected) so silence does not consume minutes, and for calls the habit
    // engine starts the session on its own once it has learned the pattern
    // (HabitDecisionEngine.cs:9 AutoStartRate = 0.75 after 4+ samples) — learned, not
    // from the first launch, which is why the copy says "learns".
    'download.subtitle': {
        'en-US': "Install it and choose two languages — it takes it from there.",
        'ru-RU': "Установите и выберите два языка — дальше он сам.",
        'fr-FR': "Installez-le et choisissez deux langues — il prend le relais.",
        'es-ES': "Instálalo y elige dos idiomas: el resto lo hace él.",
        'de-DE': "Installieren und zwei Sprachen wählen — den Rest macht es selbst.",
        'it-IT': "Installalo e scegli due lingue: al resto pensa lui.",
        'ja-JP': "インストールして2つの言語を選ぶだけ。あとは自動です。",
        'ko-KR': "설치하고 두 가지 언어만 고르세요. 나머지는 알아서 합니다.",
        'zh-CN': "安装后选择两种语言，剩下的它自己来。",
        'ar-SA': "ثبّته واختر لغتين — والباقي يتولاه بنفسه.",
        'hi-IN': "इंस्टॉल करें और दो भाषाएँ चुनें — आगे यह खुद संभाल लेता है।",
        'pt-BR': "Instale e escolha dois idiomas — o resto ele faz sozinho.",
        'pl-PL': "Zainstaluj i wybierz dwa języki — dalej zajmie się tym sam.",
        'nl-NL': "Installeer en kies twee talen — de rest doet het zelf.",
        'tr-TR': "Kurun ve iki dil seçin — gerisini kendi yapar.",
        'uk-UA': "Встановіть і виберіть дві мови — далі він сам.",
    },
    'how.title': {
        'en-US': "Two steps, and it keeps up on its own",
        'ru-RU': "Два шага, дальше оно само",
        'fr-FR': "Deux étapes, ensuite il suit tout seul",
        'es-ES': "Dos pasos, y luego va solo",
        'de-DE': "Zwei Schritte, danach läuft es von selbst",
        'it-IT': "Due passaggi, poi va da sé",
        'ja-JP': "2ステップ、あとは自動でついてきます",
        'ko-KR': "두 단계, 그다음은 알아서 따라갑니다",
        'zh-CN': "两步，之后它自己跟上",
        'ar-SA': "خطوتان، وبعدها يتابع من تلقاء نفسه",
        'hi-IN': "दो कदम, आगे यह खुद संभाल लेता है",
        'pt-BR': "Dois passos, e depois ele acompanha sozinho",
        'pl-PL': "Dwa kroki, dalej radzi sobie sam",
        'nl-NL': "Twee stappen, daarna gaat het van zelf",
        'tr-TR': "İki adım, sonrasını kendi sürdürür",
        'uk-UA': "Два кроки, далі воно саме",
    },
    'how.step2': {
        'en-US': "It follows the sound", 'ru-RU': "Дальше он идёт за звуком",
        'fr-FR': "Il suit le son", 'es-ES': "Sigue el sonido",
        'de-DE': "Es folgt dem Ton", 'it-IT': "Segue l’audio",
        'ja-JP': "あとは音に合わせて動きます", 'ko-KR': "소리를 따라갑니다",
        'zh-CN': "它跟着声音走", 'ar-SA': "يتابع الصوت",
        'hi-IN': "यह आवाज़ के पीछे चलता है", 'pt-BR': "Ele acompanha o som",
        'pl-PL': "Idzie za dźwiękiem", 'nl-NL': "Het volgt het geluid",
        'tr-TR': "Sesin peşinden gider", 'uk-UA': "Далі він іде за звуком",
    },
    'how.step2desc': {
        'en-US': "Captions appear while there is speech and pause after a few seconds of silence, so quiet stretches do not eat your minutes. For the calls you use it in, it learns the pattern and starts the session by itself.",
        'ru-RU': "Субтитры идут, пока есть речь, и встают на паузу через несколько секунд тишины — так тихие участки не съедают минуты. А для звонков, в которых вы им пользуетесь, он запоминает привычку и запускает сеанс сам.",
        'fr-FR': "Les sous-titres défilent tant qu’il y a de la parole et se mettent en pause après quelques secondes de silence : les passages calmes ne consomment pas vos minutes. Pour les appels où vous l’utilisez, il apprend l’habitude et lance la session tout seul.",
        'es-ES': "Los subtítulos avanzan mientras hay voz y se pausan tras unos segundos de silencio, así los tramos callados no se comen tus minutos. En las llamadas donde lo usas, aprende la costumbre y arranca la sesión por su cuenta.",
        'de-DE': "Die Untertitel laufen, solange gesprochen wird, und pausieren nach einigen Sekunden Stille — ruhige Passagen fressen also keine Minuten. Bei den Calls, in denen Sie es nutzen, lernt es die Gewohnheit und startet die Sitzung selbst.",
        'it-IT': "I sottotitoli scorrono finché c’è parlato e si mettono in pausa dopo alcuni secondi di silenzio, così i tratti muti non consumano i tuoi minuti. Nelle chiamate in cui lo usi impara l’abitudine e avvia la sessione da solo.",
        'ja-JP': "発話がある間は字幕が流れ、数秒の無音でいったん止まります。静かな時間で分数が減ることはありません。よく使う通話では習慣を学習し、セッションを自動で開始します。",
        'ko-KR': "말소리가 있는 동안 자막이 흐르고, 몇 초 침묵이 지나면 잠시 멈춥니다. 조용한 구간이 분수를 잡아먹지 않습니다. 자주 쓰는 통화에서는 패턴을 익혀 세션을 스스로 시작합니다.",
        'zh-CN': "有人说话时字幕就走，安静几秒后自动暂停，所以静音时段不会消耗你的分钟数。对于你常用的通话，它会记住习惯并自动开始会话。",
        'ar-SA': "تظهر الترجمة أثناء الكلام وتتوقف مؤقتًا بعد ثوانٍ من الصمت، فلا تستهلك الفترات الهادئة دقائقك. وفي المكالمات التي تستخدمه فيها، يتعلّم العادة ويبدأ الجلسة من تلقاء نفسه.",
        'hi-IN': "जब तक बोला जा रहा है, सबटाइटल चलते हैं; कुछ सेकंड की चुप्पी के बाद रुक जाते हैं — इसलिए शांत हिस्से आपके मिनट नहीं खाते। जिन कॉल्स में आप इसे इस्तेमाल करते हैं, वहाँ यह आदत सीख लेता है और सेशन खुद शुरू कर देता है।",
        'pt-BR': "As legendas seguem enquanto há fala e pausam depois de alguns segundos de silêncio, então os trechos calados não consomem seus minutos. Nas chamadas em que você o usa, ele aprende o padrão e inicia a sessão sozinho.",
        'pl-PL': "Napisy idą, dopóki ktoś mówi, i zatrzymują się po kilku sekundach ciszy, więc ciche fragmenty nie zjadają twoich minut. W rozmowach, w których go używasz, uczy się nawyku i sam uruchamia sesję.",
        'nl-NL': "De ondertitels lopen zolang er gesproken wordt en pauzeren na een paar seconden stilte, dus stille stukken kosten je geen minuten. Bij de gesprekken waarin je het gebruikt, leert het het patroon en start het de sessie zelf.",
        'tr-TR': "Konuşma sürdükçe altyazılar akar, birkaç saniye sessizlikten sonra duraklar; yani sessiz bölümler dakikalarınızı yemez. Kullandığınız görüşmelerde alışkanlığı öğrenir ve oturumu kendi başlatır.",
        'uk-UA': "Субтитри йдуть, поки є мовлення, і стають на паузу через кілька секунд тишини — тихі ділянки не з’їдають ваші хвилини. А для дзвінків, у яких ви ним користуєтесь, він запам’ятовує звичку й запускає сеанс сам.",
    },
    'proof.noMic': {
        'en-US': "No bot joins your call", 'ru-RU': "В звонок не заходит бот",
        'fr-FR': "Aucun robot dans votre appel", 'es-ES': "Ningún bot entra en tu llamada",
        'de-DE': "Kein Bot in Ihrem Call", 'it-IT': "Nessun bot nella tua chiamata",
        'ja-JP': "通話にボットは入らない", 'ko-KR': "통화에 봇이 들어오지 않음",
        'zh-CN': "通话里不会出现机器人", 'ar-SA': "لا روبوت ينضم إلى مكالمتك",
        'hi-IN': "आपकी कॉल में कोई बॉट नहीं जुड़ता", 'pt-BR': "Nenhum bot entra na sua chamada",
        'pl-PL': "Do rozmowy nie dołącza bot", 'nl-NL': "Geen bot in je gesprek",
        'tr-TR': "Görüşmenize bot katılmaz", 'uk-UA': "У дзвінок не заходить бот",
    },
    'features.liveVoice': {
        'en-US': "Live Voice", 'ru-RU': "Live Voice — озвучка перевода", 'fr-FR': "Live Voice — traduction parlée",
        'es-ES': "Live Voice — traducción hablada", 'de-DE': "Live Voice — gesprochene Übersetzung",
        'it-IT': "Live Voice — traduzione parlata", 'ja-JP': "Live Voice（翻訳の音声読み上げ）",
        'ko-KR': "Live Voice — 번역 음성 출력", 'zh-CN': "Live Voice — 语音播报译文",
        'ar-SA': "Live Voice — ترجمة منطوقة", 'hi-IN': "Live Voice — अनुवाद की आवाज़",
        'pt-BR': "Live Voice — tradução falada", 'pl-PL': "Live Voice — mówione tłumaczenie",
        'nl-NL': "Live Voice — gesproken vertaling", 'tr-TR': "Live Voice — sesli çeviri",
        'uk-UA': "Live Voice — озвучення перекладу",
    },
    'features.liveVoiceDesc': {
        'en-US': "Hear the translation spoken out loud while the original audio keeps playing underneath. On Windows, for the languages Live Voice supports.",
        'ru-RU': "Перевод звучит голосом, а оригинал продолжает играть под ним. На Windows, для языков, которые поддерживает Live Voice.",
        'fr-FR': "La traduction est prononcée à voix haute pendant que l’audio d’origine continue en fond. Sur Windows, pour les langues prises en charge par Live Voice.",
        'es-ES': "La traducción se escucha en voz alta mientras el audio original sigue sonando de fondo. En Windows, para los idiomas que admite Live Voice.",
        'de-DE': "Die Übersetzung wird laut gesprochen, während der Originalton darunter weiterläuft. Unter Windows, für die von Live Voice unterstützten Sprachen.",
        'it-IT': "La traduzione viene pronunciata ad alta voce mentre l’audio originale continua sotto. Su Windows, per le lingue supportate da Live Voice.",
        'ja-JP': "元の音声が流れたまま、翻訳が声で読み上げられます。Windows で、Live Voice が対応する言語に利用できます。",
        'ko-KR': "원래 소리가 계속 흐르는 가운데 번역이 음성으로 들립니다. Windows에서, Live Voice가 지원하는 언어에 사용할 수 있습니다.",
        'zh-CN': "译文用语音读出来，同时原声继续在下面播放。支持 Windows，覆盖 Live Voice 支持的语言。",
        'ar-SA': "تُنطق الترجمة بصوت عالٍ بينما يستمر الصوت الأصلي في الخلفية. على Windows، وللغات التي يدعمها Live Voice.",
        'hi-IN': "अनुवाद आवाज़ में सुनाई देता है, और मूल ऑडियो नीचे चलता रहता है। Windows पर, उन भाषाओं के लिए जिन्हें Live Voice सपोर्ट करता है।",
        'pt-BR': "A tradução é falada em voz alta enquanto o áudio original continua ao fundo. No Windows, para os idiomas que o Live Voice suporta.",
        'pl-PL': "Tłumaczenie jest wypowiadane na głos, a oryginalny dźwięk leci dalej pod nim. Na Windows, dla języków obsługiwanych przez Live Voice.",
        'nl-NL': "De vertaling wordt hardop voorgelezen terwijl het originele geluid eronder doorloopt. Op Windows, voor de talen die Live Voice ondersteunt.",
        'tr-TR': "Özgün ses altta devam ederken çeviri sesli olarak okunur. Windows’ta, Live Voice’un desteklediği diller için.",
        'uk-UA': "Переклад звучить голосом, а оригінал продовжує грати під ним. На Windows, для мов, які підтримує Live Voice.",
    },
    'faq.q9': {
        'en-US': "Can it read the translation out loud?", 'ru-RU': "Может ли приложение озвучивать перевод?",
        'fr-FR': "Peut-il lire la traduction à voix haute ?", 'es-ES': "¿Puede leer la traducción en voz alta?",
        'de-DE': "Kann die Übersetzung laut vorgelesen werden?", 'it-IT': "Può leggere la traduzione ad alta voce?",
        'ja-JP': "翻訳を音声で読み上げられますか。", 'ko-KR': "번역을 소리로 읽어 줄 수 있나요?",
        'zh-CN': "可以把译文读出来吗？", 'ar-SA': "هل يمكنه قراءة الترجمة بصوت مسموع؟",
        'hi-IN': "क्या यह अनुवाद को बोलकर सुना सकता है?", 'pt-BR': "Ele pode ler a tradução em voz alta?",
        'pl-PL': "Czy może czytać tłumaczenie na głos?", 'nl-NL': "Kan het de vertaling voorlezen?",
        'tr-TR': "Çeviriyi sesli okuyabilir mi?", 'uk-UA': "Чи може застосунок озвучувати переклад?",
    },
    'faq.a9': {
        'en-US': "Yes — that is Live Voice. The translation is spoken out loud while the original audio keeps playing underneath, so you can follow a call or a video by ear. It is available on Windows, asks once to set up an audio driver, and covers the languages Live Voice supports rather than all 50.",
        'ru-RU': "Да, это Live Voice. Перевод звучит голосом, а оригинал продолжает играть под ним, так что созвон или видео можно слушать, а не читать. Доступно на Windows, один раз попросит установить аудиодрайвер и работает для языков, которые поддерживает Live Voice, а не для всех 50.",
        'fr-FR': "Oui, c’est Live Voice. La traduction est prononcée à voix haute pendant que l’audio d’origine continue en fond, vous pouvez donc suivre un appel ou une vidéo à l’oreille. Disponible sur Windows, avec une installation de pilote audio demandée une fois, et pour les langues prises en charge par Live Voice, pas les 50.",
        'es-ES': "Sí, eso es Live Voice. La traducción se pronuncia en voz alta mientras el audio original sigue de fondo, así puedes seguir una llamada o un vídeo de oído. Está en Windows, pide una vez instalar un controlador de audio y cubre los idiomas que admite Live Voice, no los 50.",
        'de-DE': "Ja, das ist Live Voice. Die Übersetzung wird laut gesprochen, während der Originalton darunter weiterläuft — Sie können einem Call oder Video also zuhören statt mitzulesen. Verfügbar unter Windows, richtet einmalig einen Audiotreiber ein und deckt die von Live Voice unterstützten Sprachen ab, nicht alle 50.",
        'it-IT': "Sì, si chiama Live Voice. La traduzione viene pronunciata ad alta voce mentre l’audio originale continua sotto, così puoi seguire una chiamata o un video ascoltando. È su Windows, chiede una volta di installare un driver audio e copre le lingue supportate da Live Voice, non tutte e 50.",
        'ja-JP': "はい、それが Live Voice です。元の音声が流れたまま翻訳が読み上げられるので、通話や動画を耳で追えます。Windows で利用でき、初回にオーディオドライバーの設定を求めます。対応言語は Live Voice がサポートするものに限られ、50言語すべてではありません。",
        'ko-KR': "예, 그것이 Live Voice입니다. 원래 소리가 아래에서 계속 흐르는 동안 번역이 음성으로 들려서 통화나 영상을 귀로 따라갈 수 있습니다. Windows에서 제공되며 처음 한 번 오디오 드라이버 설치를 요청하고, 50개 언어 전체가 아니라 Live Voice가 지원하는 언어를 다룹니다.",
        'zh-CN': "可以，这就是 Live Voice。原声继续在下面播放，同时译文被读出来，所以你可以用耳朵跟上通话或视频。它支持 Windows，会一次性请求安装音频驱动，覆盖的是 Live Voice 支持的语言，而不是全部 50 种。",
        'ar-SA': "نعم، هذه ميزة Live Voice. تُنطق الترجمة بصوت مسموع بينما يستمر الصوت الأصلي في الخلفية، فتستطيع متابعة مكالمة أو فيديو سمعًا. متاحة على Windows، وتطلب مرة واحدة تثبيت مشغّل صوت، وتغطي اللغات التي يدعمها Live Voice وليس الخمسين كلها.",
        'hi-IN': "हाँ, यही Live Voice है। मूल ऑडियो नीचे चलता रहता है और अनुवाद बोलकर सुनाया जाता है, तो कॉल या वीडियो को कान से फ़ॉलो किया जा सकता है। यह Windows पर उपलब्ध है, एक बार ऑडियो ड्राइवर सेटअप के लिए पूछता है, और सभी 50 नहीं बल्कि उन भाषाओं में काम करता है जिन्हें Live Voice सपोर्ट करता है।",
        'pt-BR': "Sim, isso é o Live Voice. A tradução é falada em voz alta enquanto o áudio original continua ao fundo, então você pode acompanhar uma chamada ou um vídeo de ouvido. Está disponível no Windows, pede uma vez a instalação de um driver de áudio e cobre os idiomas que o Live Voice suporta, não todos os 50.",
        'pl-PL': "Tak, to Live Voice. Tłumaczenie jest wypowiadane na głos, a oryginalny dźwięk leci dalej pod nim, więc rozmowę albo film można śledzić słuchem. Jest na Windows, raz poprosi o instalację sterownika audio i obsługuje języki wspierane przez Live Voice, a nie wszystkie 50.",
        'nl-NL': "Ja, dat is Live Voice. De vertaling wordt hardop voorgelezen terwijl het originele geluid eronder doorloopt, zodat je een gesprek of video op het gehoor kunt volgen. Het is er op Windows, vraagt eenmalig om een audiodriver in te stellen en dekt de talen die Live Voice ondersteunt, niet alle 50.",
        'tr-TR': "Evet, bu Live Voice. Özgün ses altta devam ederken çeviri sesli okunur; böylece bir görüşmeyi ya da videoyu kulakla takip edebilirsiniz. Windows’ta mevcuttur, bir kez ses sürücüsü kurulumu ister ve 50 dilin tamamı değil, Live Voice’un desteklediği diller için çalışır.",
        'uk-UA': "Так, це Live Voice. Переклад звучить голосом, а оригінал продовжує грати під ним, тож дзвінок або відео можна слухати, а не читати. Доступно на Windows, один раз попросить встановити аудіодрайвер і працює для мов, які підтримує Live Voice, а не для всіх 50.",
    },
    // Heading over the demo videos. Existed only in en-US and ru-RU, which would have
    // left 14 locales with English static text (SEO rule R1).
    'mediaExamples.title': {
        'en-US': "See it in action", 'ru-RU': "Как это выглядит", 'fr-FR': "Voir en action",
        'es-ES': "Míralo en acción", 'de-DE': "In Aktion sehen", 'it-IT': "Guardalo in azione",
        'ja-JP': "実際の動作を見る", 'ko-KR': "실제 작동 모습", 'zh-CN': "实际效果",
        'ar-SA': "شاهده أثناء العمل", 'hi-IN': "इसे चलते हुए देखें", 'pt-BR': "Veja em ação",
        'pl-PL': "Zobacz w działaniu", 'nl-NL': "Bekijk het in actie", 'tr-TR': "İş başında görün",
        'uk-UA': "Як це виглядає",
    },
    // ── Rewrites of existing keys ─────────────────────────────────────────
    'comparison.title': {
        'en-US': "Why not the tools you have already tried",
        'ru-RU': "Почему не подходит то, что вы уже пробовали",
        'fr-FR': "Pourquoi les outils déjà essayés ne suffisent pas",
        'es-ES': "Por qué no bastan las herramientas que ya has probado",
        'de-DE': "Warum die bisher probierten Tools nicht reichen",
        'it-IT': "Perché gli strumenti già provati non bastano",
        'ja-JP': "すでに試したツールでは足りない理由",
        'ko-KR': "이미 써 본 도구로는 부족한 이유",
        'zh-CN': "为什么你试过的工具还不够",
        'ar-SA': "لماذا لا تكفي الأدوات التي جربتها بالفعل",
        'hi-IN': "जो टूल आपने आज़माए हैं, वे क्यों काफ़ी नहीं",
        'pt-BR': "Por que as ferramentas que você já testou não bastam",
        'pl-PL': "Dlaczego narzędzia, które już próbowałeś, nie wystarczają",
        'nl-NL': "Waarom de tools die je al probeerde niet volstaan",
        'tr-TR': "Daha önce denediğiniz araçlar neden yetmiyor",
        'uk-UA': "Чому не підходить те, що ви вже пробували",
    },
    'features.speechRecognition': {
        'en-US': "System audio or microphone", 'ru-RU': "Системный звук или микрофон",
        'fr-FR': "Son système ou microphone", 'es-ES': "Audio del sistema o micrófono",
        'de-DE': "Systemton oder Mikrofon", 'it-IT': "Audio di sistema o microfono",
        'ja-JP': "システム音声かマイク", 'ko-KR': "시스템 오디오 또는 마이크",
        'zh-CN': "系统声音或麦克风", 'ar-SA': "صوت النظام أو الميكروفون",
        'hi-IN': "सिस्टम ऑडियो या माइक्रोफ़ोन", 'pt-BR': "Áudio do sistema ou microfone",
        'pl-PL': "Dźwięk systemowy albo mikrofon", 'nl-NL': "Systeemgeluid of microfoon",
        'tr-TR': "Sistem sesi ya da mikrofon", 'uk-UA': "Системний звук або мікрофон",
    },
    'features.dualSubtitlesDesc': {
        'en-US': "The original line and your translation stay on screen together, so you can check what was actually said.",
        'ru-RU': "Оригинальная строка и перевод остаются на экране вместе — всегда можно сверить, что именно было сказано.",
        'fr-FR': "La ligne d’origine et votre traduction restent affichées ensemble : vous pouvez vérifier ce qui a réellement été dit.",
        'es-ES': "La línea original y tu traducción permanecen juntas en pantalla, así puedes comprobar qué se dijo en realidad.",
        'de-DE': "Originalzeile und Übersetzung bleiben gemeinsam sichtbar, sodass Sie nachprüfen können, was wirklich gesagt wurde.",
        'it-IT': "La riga originale e la traduzione restano insieme sullo schermo, così puoi verificare cosa è stato detto davvero.",
        'ja-JP': "原文の行と訳文が画面に並んで残るので、実際に何と言われたのかを確認できます。",
        'ko-KR': "원문 줄과 번역이 화면에 함께 남아 있어, 실제로 무슨 말이 나왔는지 확인할 수 있습니다.",
        'zh-CN': "原文行和译文一起留在画面上，随时可以核对对方到底说了什么。",
        'ar-SA': "يبقى السطر الأصلي والترجمة معًا على الشاشة، فتستطيع التحقق مما قيل فعلًا.",
        'hi-IN': "मूल पंक्ति और अनुवाद स्क्रीन पर साथ रहते हैं, जिससे आप जाँच सकते हैं कि असल में क्या कहा गया।",
        'pt-BR': "A linha original e a sua tradução ficam juntas na tela, então você pode conferir o que foi realmente dito.",
        'pl-PL': "Oryginalna linijka i tłumaczenie zostają na ekranie razem, więc możesz sprawdzić, co naprawdę powiedziano.",
        'nl-NL': "De originele regel en je vertaling blijven samen in beeld, zodat je kunt nagaan wat er echt gezegd is.",
        'tr-TR': "Özgün satır ve çeviriniz ekranda birlikte kalır; böylece gerçekte ne söylendiğini kontrol edebilirsiniz.",
        'uk-UA': "Оригінальний рядок і переклад залишаються на екрані разом — завжди можна перевірити, що саме сказали.",
    },
    'features.speechRecognitionDesc': {
        'en-US': "Caption the audio your device is playing — no mic, no room noise, nothing drifting out of sync. Or switch the source to the microphone to caption a talk, a lecture or a conversation happening in front of you.",
        'ru-RU': "Субтитры к звуку, который воспроизводит устройство: без микрофона, без шума комнаты, ничего не расходится по времени. А можно переключить источник на микрофон и разбирать выступление, лекцию или разговор рядом с вами.",
        'fr-FR': "Sous-titrez l’audio que joue votre appareil : sans micro, sans bruit de la pièce, sans décalage. Ou basculez la source sur le microphone pour sous-titrer une conférence, un cours ou une conversation devant vous.",
        'es-ES': "Subtitula el audio que reproduce tu dispositivo: sin micrófono, sin ruido de la sala y sin desfase. O cambia la fuente al micrófono para subtitular una charla, una clase o una conversación delante de ti.",
        'de-DE': "Untertitelt den Ton, den Ihr Gerät abspielt: ohne Mikrofon, ohne Raumgeräusch, ohne Zeitversatz. Oder stellen Sie die Quelle auf das Mikrofon, um einen Vortrag, eine Vorlesung oder ein Gespräch vor Ort mitzulesen.",
        'it-IT': "Sottotitola l’audio che il dispositivo riproduce: senza microfono, senza rumore della stanza, senza sfasature. Oppure passa la sorgente al microfono per sottotitolare un intervento, una lezione o una conversazione davanti a te.",
        'ja-JP': "デバイスが再生している音に字幕を付けます。マイク不要で、部屋の雑音も入らず、タイミングもずれません。入力をマイクに切り替えれば、目の前の講演や授業、会話にも字幕を付けられます。",
        'ko-KR': "기기가 재생하는 소리에 자막을 붙입니다. 마이크가 필요 없고 실내 잡음도 없으며 시간도 어긋나지 않습니다. 입력을 마이크로 바꾸면 눈앞의 강연, 수업, 대화에도 자막을 붙일 수 있습니다.",
        'zh-CN': "给设备正在播放的声音加字幕：不用麦克风，没有环境噪音，也不会错位。也可以把输入切到麦克风，给眼前的演讲、课程或对话加字幕。",
        'ar-SA': "أضف ترجمة للصوت الذي يشغّله جهازك: بدون ميكروفون، وبدون ضجيج الغرفة، وبدون اختلاف في التوقيت. أو حوّل المصدر إلى الميكروفون لتترجم محاضرة أو كلمة أو حديثًا يجري أمامك.",
        'hi-IN': "जो ऑडियो आपका डिवाइस चला रहा है, उस पर सबटाइटल: माइक नहीं, कमरे का शोर नहीं, समय भी नहीं बिगड़ता। या स्रोत को माइक्रोफ़ोन पर बदलकर सामने हो रहे भाषण, लेक्चर या बातचीत के सबटाइटल पाएँ।",
        'pt-BR': "Legende o áudio que seu dispositivo reproduz: sem microfone, sem ruído do ambiente e sem perder a sincronia. Ou troque a fonte para o microfone e legende uma palestra, uma aula ou uma conversa na sua frente.",
        'pl-PL': "Napisy do dźwięku, który odtwarza urządzenie: bez mikrofonu, bez szumu pomieszczenia, bez rozjechanej synchronizacji. Albo przełącz źródło na mikrofon, żeby mieć napisy do wykładu, prelekcji czy rozmowy przed tobą.",
        'nl-NL': "Ondertitel het geluid dat je apparaat afspeelt: geen microfoon, geen omgevingsgeluid, niets loopt uit de pas. Of zet de bron op de microfoon om een lezing, les of gesprek vóór je te ondertitelen.",
        'tr-TR': "Cihazınızın çaldığı sese altyazı ekleyin: mikrofon yok, oda gürültüsü yok, kayma yok. Ya da kaynağı mikrofona alıp önünüzdeki konuşmayı, dersi veya sohbeti altyazılayın.",
        'uk-UA': "Субтитри до звуку, який відтворює пристрій: без мікрофона, без шуму кімнати, ніщо не розходиться в часі. А можна перемкнути джерело на мікрофон і розбирати виступ, лекцію чи розмову поруч із вами.",
    },
};

// Keys that create a new parent object in each locale.
const NEW_GROUPS = ['proof', 'how', 'versus', 'privacy', 'apps'];

function escapeForSingleQuoted(s) {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Start/end offsets of a locale's object block. */
function localeBlockRange(src, locale) {
    const start = src.indexOf(`'${locale}': {`);
    if (start === -1) throw new Error(`locale block not found: ${locale}`);
    const rest = src.slice(start + 1).search(/\n {4}'[a-z]{2}-[A-Z]{2}': \{/);
    return { start, end: rest === -1 ? src.length : start + 1 + rest };
}

/** Start/end offsets of `name: { ... }` inside [from, to), end being the closing brace index. */
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

function main() {
    let src = fs.readFileSync(FILE, 'utf8');
    const t = loadTranslations(FILE);
    const log = [];

    // Every key must cover every locale before anything is written.
    for (const [key, byLocale] of Object.entries(COPY)) {
        const missing = LOCALES.filter(l => !byLocale[l]);
        if (missing.length) throw new Error(`${key}: missing locales ${missing.join(', ')}`);
    }

    // Process locales bottom-up so earlier offsets stay valid.
    for (const locale of [...LOCALES].reverse()) {
        const { start, end } = localeBlockRange(src, locale);

        // 1. New nested groups. A group created here already carries its keys, so step 2
        //    must skip it; a group that already existed still needs its leaves processed.
        const createdGroups = new Set();
        for (const group of [...NEW_GROUPS].reverse()) {
            if (objectRange(src, group, start, end)) { log.push(`SKIP ${locale}.${group} — exists`); continue; }
            const entries = Object.entries(COPY)
                .filter(([k]) => k.startsWith(group + '.'))
                .map(([k, v]) => `                ${k.split('.')[1]}: '${escapeForSingleQuoted(v[locale])}'`);
            if (!entries.length) continue;
            const insertAt = src.indexOf('{', start) + 1;
            const block = `\n            ${group}: {\n${entries.join(',\n')}\n            },`;
            src = src.slice(0, insertAt) + block + src.slice(insertAt);
            createdGroups.add(group);
            log.push(`OK   ${locale}.${group} (${entries.length} keys)`);
        }

        // 2. New leaves inside existing parents + rewrites. Recompute the range: step 1 moved it.
        const range = localeBlockRange(src, locale);
        for (const [key, byLocale] of Object.entries(COPY)) {
            const parts = key.split('.');
            if (createdGroups.has(parts[0])) continue;

            const value = byLocale[locale];
            let scopeFrom = range.start, scopeTo = range.end;
            if (parts.length > 1) {
                const parent = objectRange(src, parts[0], scopeFrom, scopeTo);
                if (!parent) { log.push(`SKIP ${locale}.${key} — no parent`); continue; }
                scopeFrom = parent.start;
                scopeTo = parent.close + 1;
            }
            const leaf = parts[parts.length - 1];
            const scope = src.slice(scopeFrom, scopeTo);
            const re = new RegExp(`(\\b${leaf}\\s*:\\s*)('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")`);
            const m = scope.match(re);

            if (m) {
                const currentValue = m[2].slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\');
                if (currentValue === value) { log.push(`SKIP ${locale}.${key} — already set`); continue; }
                const replaced = scope.replace(re, `$1'${escapeForSingleQuoted(value)}'`);
                src = src.slice(0, scopeFrom) + replaced + src.slice(scopeTo);
                log.push(`OK   ${locale}.${key} (rewrite)`);
            } else {
                // Append before the parent object's closing brace.
                const parentClose = parts.length > 1
                    ? objectRange(src, parts[0], range.start, range.end).close
                    : null;
                if (parentClose == null) { log.push(`SKIP ${locale}.${key} — cannot place`); continue; }
                const before = src.slice(0, parentClose).replace(/\s*$/, '');
                const indent = '                ';
                src = before + `,\n${indent}${leaf}: '${escapeForSingleQuoted(value)}'\n            ` + src.slice(parentClose);
                log.push(`OK   ${locale}.${key} (insert)`);
            }
        }
    }

    const ok = log.filter(l => l.startsWith('OK')).length;
    console.log(`${ok} changes, ${log.length - ok} skipped`);

    if (CHECK_ONLY) {
        console.log(log.slice(0, 20).join('\n'));
        console.log('--check: nothing written');
        return;
    }

    fs.writeFileSync(FILE, src, 'utf8');

    // Verify: file parses, every key present in every locale with the intended value.
    const after = loadTranslations(FILE);
    const problems = [];
    for (const locale of LOCALES) {
        for (const [key, byLocale] of Object.entries(COPY)) {
            const got = key.split('.').reduce((o, k) => (o == null ? o : o[k]), after[locale]);
            if (got !== byLocale[locale]) problems.push(`${locale}.${key}: expected "${byLocale[locale]}", got "${got}"`);
        }
        // Nothing lost: the demo phrase array must survive.
        if (!Array.isArray(after[locale].examples)) problems.push(`${locale}.examples is no longer an array`);
    }
    if (problems.length) {
        console.log('VERIFY FAILED:\n' + problems.slice(0, 20).join('\n'));
        process.exitCode = 1;
    } else {
        console.log(`Verify OK: ${Object.keys(COPY).length} keys × ${LOCALES.length} locales.`);
    }
}

main();
