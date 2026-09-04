// Генератор страниц-приглашений /<locale>/i/index.html из единого шаблона.
//
//   node _build_invite_pages.js
//
// Страница инвайта живёт ВНЕ пайплайна translations.js / bake-i18n-defaults.js:
// её строки нужны и в <head> (превью в мессенджерах читают статику), и внутри
// инлайнового JS, а сама страница noindex — hreflang/sitemap ей не нужны.
// Поэтому отдельный генератор: правим STRINGS -> перегенерируем все локали.
// Скрипт идемпотентен.
//
// en -> ./i/index.html, остальные -> ./<dir>/i/index.html

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORIGIN = 'https://live-subtitles.com';
const STORE_ID = '9ph1r9djg47s';
const OG_IMAGE = ORIGIN + '/img/invite-og.jpg';
const OG_W = '2400';
const OG_H = '1260';
const YM_ID = '101009280';
const GTAG_ID = 'AW-17344614830';

const STRINGS = {
    en: {
        dir: 'ltr', lang: 'en', ogLocale: 'en_US',
        title: 'Understand any language on your screen',
        description: 'Live Subtitles puts real-time captions and translation over any app - calls, meetings, videos, streams, games. 60+ languages, nothing to install in the app you are watching. This invite comes with free minutes.',
        imgAlt: 'Real-time captions and translation over a video call',
        lead: 'Live Subtitles shows subtitles and instant translation on top of any app — video calls, lectures, streams, films, games. The app you are watching needs no plugins, no accounts and no setup.',
        usp: [
            ['Two lines at once', 'the original and the translation, one above the other.'],
            ['Works over any window', 'Zoom, Teams, YouTube, Netflix, Steam, anything.'],
            ['60+ languages', 'speech recognition and translation in real time.'],
        ],
        giftTitle: 'Your friend’s invite includes free minutes',
        giftSub: 'Use the code below — both of you get them.',
        copyCode: 'Copy invite code',
        install: 'Get it free for Windows',
        note: 'After installing, the code is usually applied on its own. If it is not, open Settings in the app, choose “Invite friends” and enter the code above.',
        shareLabel: 'Know someone who needs this? Pass it on:',
        copyLink: 'Copy link',
        copied: 'Copied',
        errorTitle: 'This invite link is incomplete',
        errorText: 'Ask your friend to send the link again, or install the app and enter the invite code manually.',
        errorButton: 'Open Microsoft Store',
        pitch: 'Subtitles and instant translation over any app - calls, videos, streams, games.',
    },
    ru: {
        dir: 'ltr', lang: 'ru', ogLocale: 'ru_RU',
        title: 'Понимай любой язык на экране',
        description: 'Live Subtitles показывает субтитры и перевод в реальном времени поверх любого приложения: звонки, встречи, видео, стримы, игры. 60+ языков, в самом приложении ничего устанавливать не нужно. По этому приглашению — бесплатные минуты.',
        imgAlt: 'Субтитры и перевод в реальном времени поверх видеозвонка',
        lead: 'Live Subtitles показывает субтитры и мгновенный перевод поверх любого приложения: видеозвонки, лекции, стримы, фильмы, игры. В самом приложении не нужно ни плагинов, ни аккаунтов, ни настройки.',
        usp: [
            ['Две строки сразу', 'оригинал и перевод, одна строка под другой.'],
            ['Поверх любого окна', 'Zoom, Teams, YouTube, Netflix, Steam и что угодно.'],
            ['60+ языков', 'распознавание речи и перевод в реальном времени.'],
        ],
        giftTitle: 'Приглашение друга даёт бесплатные минуты',
        giftSub: 'Введите код ниже — минуты получите оба.',
        copyCode: 'Скопировать код',
        install: 'Скачать бесплатно для Windows',
        note: 'После установки код обычно применяется сам. Если нет — откройте настройки приложения, выберите «Пригласить друзей» и введите код выше.',
        shareLabel: 'Кому-то это нужно? Передайте дальше:',
        copyLink: 'Скопировать ссылку',
        copied: 'Скопировано',
        errorTitle: 'Ссылка-приглашение неполная',
        errorText: 'Попросите друга отправить ссылку заново или установите приложение и введите код вручную.',
        errorButton: 'Открыть Microsoft Store',
        pitch: 'Субтитры и мгновенный перевод поверх любого приложения: звонки, видео, стримы, игры.',
    },
    uk: {
        dir: 'ltr', lang: 'uk', ogLocale: 'uk_UA',
        title: 'Розумій будь-яку мову на екрані',
        description: 'Live Subtitles показує субтитри й переклад у реальному часі поверх будь-якого застосунку: дзвінки, зустрічі, відео, стріми, ігри. 60+ мов, у самому застосунку нічого встановлювати не потрібно. Це запрошення дає безкоштовні хвилини.',
        imgAlt: 'Субтитри й переклад у реальному часі поверх відеодзвінка',
        lead: 'Live Subtitles показує субтитри й миттєвий переклад поверх будь-якого застосунку: відеодзвінки, лекції, стріми, фільми, ігри. Самому застосунку не потрібні ні плагіни, ні акаунти, ні налаштування.',
        usp: [
            ['Два рядки одразу', 'оригінал і переклад, один під одним.'],
            ['Поверх будь-якого вікна', 'Zoom, Teams, YouTube, Netflix, Steam і будь-що інше.'],
            ['60+ мов', 'розпізнавання мовлення та переклад у реальному часі.'],
        ],
        giftTitle: 'Запрошення друга дає безкоштовні хвилини',
        giftSub: 'Введіть код нижче — хвилини отримаєте обидва.',
        copyCode: 'Скопіювати код',
        install: 'Завантажити безкоштовно для Windows',
        note: 'Після встановлення код зазвичай застосовується сам. Якщо ні — відкрийте налаштування застосунку, виберіть «Запросити друзів» і введіть код вище.',
        shareLabel: 'Комусь це потрібно? Передайте далі:',
        copyLink: 'Скопіювати посилання',
        copied: 'Скопійовано',
        errorTitle: 'Посилання-запрошення неповне',
        errorText: 'Попросіть друга надіслати посилання ще раз або встановіть застосунок і введіть код вручну.',
        errorButton: 'Відкрити Microsoft Store',
        pitch: 'Субтитри й миттєвий переклад поверх будь-якого застосунку: дзвінки, відео, стріми, ігри.',
    },
    de: {
        dir: 'ltr', lang: 'de', ogLocale: 'de_DE',
        title: 'Verstehe jede Sprache auf deinem Bildschirm',
        description: 'Live Subtitles zeigt Untertitel und Übersetzung in Echtzeit über jeder App - Anrufe, Meetings, Videos, Streams, Spiele. 60+ Sprachen, in der App, die du schaust, muss nichts installiert werden. Diese Einladung bringt Gratisminuten mit.',
        imgAlt: 'Untertitel und Übersetzung in Echtzeit über einem Videoanruf',
        lead: 'Live Subtitles zeigt Untertitel und Sofortübersetzung über jeder App — Videoanrufe, Vorlesungen, Streams, Filme, Spiele. Die App, die du schaust, braucht keine Plug-ins, keine Konten und keine Einrichtung.',
        usp: [
            ['Zwei Zeilen gleichzeitig', 'das Original und die Übersetzung, eine über der anderen.'],
            ['Über jedem Fenster', 'Zoom, Teams, YouTube, Netflix, Steam — einfach überall.'],
            ['60+ Sprachen', 'Spracherkennung und Übersetzung in Echtzeit.'],
        ],
        giftTitle: 'Die Einladung deines Freundes enthält Gratisminuten',
        giftSub: 'Nutze den Code unten — ihr bekommt sie beide.',
        copyCode: 'Einladungscode kopieren',
        install: 'Kostenlos für Windows holen',
        note: 'Nach der Installation wird der Code meist automatisch angewendet. Falls nicht, öffne die Einstellungen in der App, wähle „Freunde einladen“ und gib den Code oben ein.',
        shareLabel: 'Kennst du jemanden, der das braucht? Gib es weiter:',
        copyLink: 'Link kopieren',
        copied: 'Kopiert',
        errorTitle: 'Dieser Einladungslink ist unvollständig',
        errorText: 'Bitte deinen Freund, den Link noch einmal zu senden, oder installiere die App und gib den Einladungscode manuell ein.',
        errorButton: 'Microsoft Store öffnen',
        pitch: 'Untertitel und Sofortübersetzung über jeder App - Anrufe, Videos, Streams, Spiele.',
    },
    fr: {
        dir: 'ltr', lang: 'fr', ogLocale: 'fr_FR',
        title: 'Comprenez toutes les langues sur votre écran',
        description: 'Live Subtitles affiche des sous-titres et une traduction en temps réel par-dessus n’importe quelle application : appels, réunions, vidéos, streams, jeux. Plus de 60 langues, rien à installer dans l’application que vous regardez. Cette invitation offre des minutes gratuites.',
        imgAlt: 'Sous-titres et traduction en temps réel par-dessus un appel vidéo',
        lead: 'Live Subtitles affiche des sous-titres et une traduction instantanée par-dessus n’importe quelle application — appels vidéo, cours, streams, films, jeux. L’application que vous regardez n’a besoin d’aucun plug-in, d’aucun compte et d’aucun réglage.',
        usp: [
            ['Deux lignes à la fois', 'l’original et la traduction, l’une au-dessus de l’autre.'],
            ['Par-dessus n’importe quelle fenêtre', 'Zoom, Teams, YouTube, Netflix, Steam, tout.'],
            ['Plus de 60 langues', 'reconnaissance vocale et traduction en temps réel.'],
        ],
        giftTitle: 'L’invitation de votre ami inclut des minutes gratuites',
        giftSub: 'Utilisez le code ci-dessous — vous les recevez tous les deux.',
        copyCode: 'Copier le code d’invitation',
        install: 'Télécharger gratuitement pour Windows',
        note: 'Après l’installation, le code s’applique généralement tout seul. Sinon, ouvrez les paramètres de l’application, choisissez « Inviter des amis » et saisissez le code ci-dessus.',
        shareLabel: 'Quelqu’un autour de vous en a besoin ? Transmettez :',
        copyLink: 'Copier le lien',
        copied: 'Copié',
        errorTitle: 'Ce lien d’invitation est incomplet',
        errorText: 'Demandez à votre ami de renvoyer le lien, ou installez l’application et saisissez le code d’invitation manuellement.',
        errorButton: 'Ouvrir le Microsoft Store',
        pitch: 'Sous-titres et traduction instantanée par-dessus n’importe quelle application : appels, vidéos, streams, jeux.',
    },
    es: {
        dir: 'ltr', lang: 'es', ogLocale: 'es_ES',
        title: 'Entiende cualquier idioma en tu pantalla',
        description: 'Live Subtitles muestra subtítulos y traducción en tiempo real sobre cualquier aplicación: llamadas, reuniones, vídeos, directos, juegos. Más de 60 idiomas y nada que instalar en la app que estás viendo. Esta invitación incluye minutos gratis.',
        imgAlt: 'Subtítulos y traducción en tiempo real sobre una videollamada',
        lead: 'Live Subtitles muestra subtítulos y traducción instantánea encima de cualquier aplicación: videollamadas, clases, directos, películas, juegos. La app que estás viendo no necesita complementos, ni cuentas, ni configuración.',
        usp: [
            ['Dos líneas a la vez', 'el original y la traducción, una encima de la otra.'],
            ['Sobre cualquier ventana', 'Zoom, Teams, YouTube, Netflix, Steam, lo que sea.'],
            ['Más de 60 idiomas', 'reconocimiento de voz y traducción en tiempo real.'],
        ],
        giftTitle: 'La invitación de tu amigo incluye minutos gratis',
        giftSub: 'Usa el código de abajo: los recibís los dos.',
        copyCode: 'Copiar código de invitación',
        install: 'Descárgalo gratis para Windows',
        note: 'Después de instalar, el código suele aplicarse solo. Si no ocurre, abre los ajustes de la app, elige «Invitar amigos» e introduce el código de arriba.',
        shareLabel: '¿Conoces a alguien que lo necesite? Pásalo:',
        copyLink: 'Copiar enlace',
        copied: 'Copiado',
        errorTitle: 'Este enlace de invitación está incompleto',
        errorText: 'Pide a tu amigo que te envíe el enlace otra vez, o instala la app e introduce el código de invitación manualmente.',
        errorButton: 'Abrir Microsoft Store',
        pitch: 'Subtítulos y traducción instantánea sobre cualquier aplicación: llamadas, vídeos, directos, juegos.',
    },
    it: {
        dir: 'ltr', lang: 'it', ogLocale: 'it_IT',
        title: 'Capisci qualsiasi lingua sul tuo schermo',
        description: 'Live Subtitles mostra sottotitoli e traduzione in tempo reale sopra qualsiasi app: chiamate, riunioni, video, stream, giochi. Oltre 60 lingue e nulla da installare nell’app che stai guardando. Questo invito include minuti gratis.',
        imgAlt: 'Sottotitoli e traduzione in tempo reale sopra una videochiamata',
        lead: 'Live Subtitles mostra sottotitoli e traduzione istantanea sopra qualsiasi app: videochiamate, lezioni, stream, film, giochi. L’app che stai guardando non ha bisogno di plug-in, account o configurazioni.',
        usp: [
            ['Due righe insieme', 'l’originale e la traduzione, una sopra l’altra.'],
            ['Sopra qualsiasi finestra', 'Zoom, Teams, YouTube, Netflix, Steam, qualsiasi cosa.'],
            ['Oltre 60 lingue', 'riconoscimento vocale e traduzione in tempo reale.'],
        ],
        giftTitle: 'L’invito del tuo amico include minuti gratis',
        giftSub: 'Usa il codice qui sotto: li ricevete entrambi.',
        copyCode: 'Copia il codice invito',
        install: 'Scaricalo gratis per Windows',
        note: 'Dopo l’installazione il codice di solito si applica da solo. Se non succede, apri le impostazioni dell’app, scegli «Invita amici» e inserisci il codice qui sopra.',
        shareLabel: 'Conosci qualcuno a cui serve? Passa parola:',
        copyLink: 'Copia link',
        copied: 'Copiato',
        errorTitle: 'Questo link di invito è incompleto',
        errorText: 'Chiedi al tuo amico di inviare di nuovo il link, oppure installa l’app e inserisci il codice invito a mano.',
        errorButton: 'Apri Microsoft Store',
        pitch: 'Sottotitoli e traduzione istantanea sopra qualsiasi app: chiamate, video, stream, giochi.',
    },
    pt: {
        dir: 'ltr', lang: 'pt', ogLocale: 'pt_BR',
        title: 'Entenda qualquer idioma na sua tela',
        description: 'O Live Subtitles mostra legendas e tradução em tempo real sobre qualquer aplicativo: chamadas, reuniões, vídeos, lives, jogos. Mais de 60 idiomas e nada para instalar no aplicativo que você está assistindo. Este convite vem com minutos grátis.',
        imgAlt: 'Legendas e tradução em tempo real sobre uma chamada de vídeo',
        lead: 'O Live Subtitles mostra legendas e tradução instantânea sobre qualquer aplicativo: chamadas de vídeo, aulas, lives, filmes, jogos. O aplicativo que você está assistindo não precisa de plug-ins, contas nem configuração.',
        usp: [
            ['Duas linhas ao mesmo tempo', 'o original e a tradução, uma acima da outra.'],
            ['Sobre qualquer janela', 'Zoom, Teams, YouTube, Netflix, Steam, qualquer coisa.'],
            ['Mais de 60 idiomas', 'reconhecimento de fala e tradução em tempo real.'],
        ],
        giftTitle: 'O convite do seu amigo inclui minutos grátis',
        giftSub: 'Use o código abaixo — vocês dois recebem.',
        copyCode: 'Copiar código do convite',
        install: 'Baixar grátis para Windows',
        note: 'Depois de instalar, o código normalmente é aplicado sozinho. Se não for, abra as configurações do aplicativo, escolha “Convidar amigos” e digite o código acima.',
        shareLabel: 'Conhece alguém que precisa disso? Repasse:',
        copyLink: 'Copiar link',
        copied: 'Copiado',
        errorTitle: 'Este link de convite está incompleto',
        errorText: 'Peça ao seu amigo para enviar o link novamente, ou instale o aplicativo e digite o código do convite manualmente.',
        errorButton: 'Abrir a Microsoft Store',
        pitch: 'Legendas e tradução instantânea sobre qualquer aplicativo: chamadas, vídeos, lives, jogos.',
    },
    nl: {
        dir: 'ltr', lang: 'nl', ogLocale: 'nl_NL',
        title: 'Begrijp elke taal op je scherm',
        description: 'Live Subtitles toont ondertitels en vertaling in realtime over elke app: gesprekken, vergaderingen, video’s, streams, games. 60+ talen en je hoeft niets te installeren in de app die je bekijkt. Deze uitnodiging bevat gratis minuten.',
        imgAlt: 'Ondertitels en vertaling in realtime over een videogesprek',
        lead: 'Live Subtitles toont ondertitels en directe vertaling over elke app: videogesprekken, lessen, streams, films, games. De app die je bekijkt heeft geen plug-ins, accounts of instellingen nodig.',
        usp: [
            ['Twee regels tegelijk', 'het origineel en de vertaling, boven elkaar.'],
            ['Over elk venster', 'Zoom, Teams, YouTube, Netflix, Steam, alles.'],
            ['60+ talen', 'spraakherkenning en vertaling in realtime.'],
        ],
        giftTitle: 'De uitnodiging van je vriend bevat gratis minuten',
        giftSub: 'Gebruik de code hieronder — jullie krijgen ze beiden.',
        copyCode: 'Uitnodigingscode kopiëren',
        install: 'Gratis ophalen voor Windows',
        note: 'Na het installeren wordt de code meestal automatisch toegepast. Zo niet, open de instellingen in de app, kies „Vrienden uitnodigen” en voer de code hierboven in.',
        shareLabel: 'Ken je iemand die dit nodig heeft? Stuur het door:',
        copyLink: 'Link kopiëren',
        copied: 'Gekopieerd',
        errorTitle: 'Deze uitnodigingslink is niet compleet',
        errorText: 'Vraag je vriend om de link opnieuw te sturen, of installeer de app en voer de uitnodigingscode handmatig in.',
        errorButton: 'Microsoft Store openen',
        pitch: 'Ondertitels en directe vertaling over elke app: gesprekken, video’s, streams, games.',
    },
    pl: {
        dir: 'ltr', lang: 'pl', ogLocale: 'pl_PL',
        title: 'Zrozum każdy język na swoim ekranie',
        description: 'Live Subtitles pokazuje napisy i tłumaczenie w czasie rzeczywistym na dowolnej aplikacji: rozmowy, spotkania, filmy, streamy, gry. Ponad 60 języków, a w aplikacji, którą oglądasz, nie trzeba nic instalować. To zaproszenie daje darmowe minuty.',
        imgAlt: 'Napisy i tłumaczenie w czasie rzeczywistym na rozmowie wideo',
        lead: 'Live Subtitles pokazuje napisy i natychmiastowe tłumaczenie na dowolnej aplikacji: rozmowy wideo, wykłady, streamy, filmy, gry. Aplikacja, którą oglądasz, nie potrzebuje wtyczek, kont ani konfiguracji.',
        usp: [
            ['Dwie linie naraz', 'oryginał i tłumaczenie, jedna nad drugą.'],
            ['Na każdym oknie', 'Zoom, Teams, YouTube, Netflix, Steam i cokolwiek innego.'],
            ['Ponad 60 języków', 'rozpoznawanie mowy i tłumaczenie w czasie rzeczywistym.'],
        ],
        giftTitle: 'Zaproszenie od znajomego zawiera darmowe minuty',
        giftSub: 'Użyj kodu poniżej — dostaniecie je oboje.',
        copyCode: 'Kopiuj kod zaproszenia',
        install: 'Pobierz bezpłatnie na Windows',
        note: 'Po instalacji kod zwykle zastosuje się sam. Jeśli nie, otwórz ustawienia aplikacji, wybierz „Zaproś znajomych” i wpisz kod powyżej.',
        shareLabel: 'Znasz kogoś, komu to się przyda? Przekaż dalej:',
        copyLink: 'Kopiuj link',
        copied: 'Skopiowano',
        errorTitle: 'Ten link z zaproszeniem jest niepełny',
        errorText: 'Poproś znajomego, żeby wysłał link jeszcze raz, albo zainstaluj aplikację i wpisz kod zaproszenia ręcznie.',
        errorButton: 'Otwórz Microsoft Store',
        pitch: 'Napisy i natychmiastowe tłumaczenie na dowolnej aplikacji: rozmowy, filmy, streamy, gry.',
    },
    tr: {
        dir: 'ltr', lang: 'tr', ogLocale: 'tr_TR',
        title: 'Ekranındaki her dili anla',
        description: 'Live Subtitles herhangi bir uygulamanın üzerinde gerçek zamanlı altyazı ve çeviri gösterir: aramalar, toplantılar, videolar, yayınlar, oyunlar. 60+ dil ve izlediğin uygulamaya hiçbir şey kurmana gerek yok. Bu davet ücretsiz dakikalarla geliyor.',
        imgAlt: 'Görüntülü aramanın üzerinde gerçek zamanlı altyazı ve çeviri',
        lead: 'Live Subtitles herhangi bir uygulamanın üzerinde altyazı ve anında çeviri gösterir: görüntülü aramalar, dersler, yayınlar, filmler, oyunlar. İzlediğin uygulamaya eklenti, hesap ya da ayar gerekmez.',
        usp: [
            ['Aynı anda iki satır', 'orijinal ve çeviri, biri diğerinin üstünde.'],
            ['Her pencerenin üzerinde', 'Zoom, Teams, YouTube, Netflix, Steam, ne olursa.'],
            ['60+ dil', 'gerçek zamanlı konuşma tanıma ve çeviri.'],
        ],
        giftTitle: 'Arkadaşının daveti ücretsiz dakikalar içeriyor',
        giftSub: 'Aşağıdaki kodu kullan — ikiniz de alıyorsunuz.',
        copyCode: 'Davet kodunu kopyala',
        install: 'Windows için ücretsiz indir',
        note: 'Kurulumdan sonra kod genellikle kendiliğinden uygulanır. Uygulanmazsa uygulamada ayarları aç, “Arkadaşlarını davet et” seçeneğini seç ve yukarıdaki kodu gir.',
        shareLabel: 'Buna ihtiyacı olan biri var mı? İlet:',
        copyLink: 'Bağlantıyı kopyala',
        copied: 'Kopyalandı',
        errorTitle: 'Bu davet bağlantısı eksik',
        errorText: 'Arkadaşından bağlantıyı yeniden göndermesini iste ya da uygulamayı kur ve davet kodunu elle gir.',
        errorButton: 'Microsoft Store’u aç',
        pitch: 'Herhangi bir uygulamanın üzerinde altyazı ve anında çeviri: aramalar, videolar, yayınlar, oyunlar.',
    },
    ja: {
        dir: 'ltr', lang: 'ja', ogLocale: 'ja_JP',
        title: '画面のどんな言語も、その場で理解できる',
        description: 'Live Subtitles はあらゆるアプリの上にリアルタイムの字幕と翻訳を表示します。通話、会議、動画、配信、ゲーム。60以上の言語に対応し、見ている側のアプリには何もインストールする必要がありません。この招待には無料の分数が付いています。',
        imgAlt: 'ビデオ通話の上に表示されるリアルタイムの字幕と翻訳',
        lead: 'Live Subtitles はあらゆるアプリの上に字幕と即時翻訳を表示します。ビデオ通話、講義、配信、映画、ゲーム。見ているアプリ側には、プラグインもアカウントも設定も必要ありません。',
        usp: [
            ['2行を同時に', '原文と訳文を上下に並べて表示。'],
            ['どのウィンドウの上でも', 'Zoom、Teams、YouTube、Netflix、Steam、どれでも。'],
            ['60以上の言語', 'リアルタイムの音声認識と翻訳。'],
        ],
        giftTitle: '友だちの招待には無料の分数が付いています',
        giftSub: '下のコードを使うと、2人とももらえます。',
        copyCode: '招待コードをコピー',
        install: 'Windows 版を無料で入手',
        note: 'インストール後、コードは通常そのまま自動で適用されます。適用されない場合は、アプリの設定を開いて「友だちを招待」を選び、上のコードを入力してください。',
        shareLabel: '必要そうな人がいますか？ 教えてあげてください：',
        copyLink: 'リンクをコピー',
        copied: 'コピーしました',
        errorTitle: 'この招待リンクは不完全です',
        errorText: '友だちにリンクをもう一度送ってもらうか、アプリをインストールして招待コードを手入力してください。',
        errorButton: 'Microsoft Store を開く',
        pitch: 'あらゆるアプリの上にリアルタイムの字幕と翻訳。通話、動画、配信、ゲーム。',
    },
    ko: {
        dir: 'ltr', lang: 'ko', ogLocale: 'ko_KR',
        title: '화면 속 모든 언어를 바로 이해하세요',
        description: 'Live Subtitles는 어떤 앱 위에서든 실시간 자막과 번역을 보여줍니다. 통화, 회의, 동영상, 스트리밍, 게임. 60개 이상의 언어를 지원하고, 보고 있는 앱에는 아무것도 설치할 필요가 없습니다. 이 초대에는 무료 사용 시간이 포함됩니다.',
        imgAlt: '영상 통화 위에 표시되는 실시간 자막과 번역',
        lead: 'Live Subtitles는 어떤 앱 위에서든 자막과 즉시 번역을 표시합니다. 영상 통화, 강의, 스트리밍, 영화, 게임. 보고 있는 앱에는 플러그인도, 계정도, 설정도 필요하지 않습니다.',
        usp: [
            ['두 줄을 동시에', '원문과 번역을 위아래로 나란히.'],
            ['어떤 창 위에서도', 'Zoom, Teams, YouTube, Netflix, Steam 등 무엇이든.'],
            ['60개 이상의 언어', '실시간 음성 인식과 번역.'],
        ],
        giftTitle: '친구의 초대에는 무료 사용 시간이 포함되어 있어요',
        giftSub: '아래 코드를 사용하면 두 사람 모두 받습니다.',
        copyCode: '초대 코드 복사',
        install: 'Windows용 무료로 받기',
        note: '설치한 뒤 코드는 보통 자동으로 적용됩니다. 적용되지 않으면 앱 설정을 열고 ‘친구 초대’를 선택해 위 코드를 입력하세요.',
        shareLabel: '필요한 사람이 있나요? 전달해 주세요:',
        copyLink: '링크 복사',
        copied: '복사됨',
        errorTitle: '초대 링크가 완전하지 않습니다',
        errorText: '친구에게 링크를 다시 보내 달라고 하거나, 앱을 설치한 뒤 초대 코드를 직접 입력하세요.',
        errorButton: 'Microsoft Store 열기',
        pitch: '어떤 앱 위에서든 실시간 자막과 번역. 통화, 동영상, 스트리밍, 게임.',
    },
    zh: {
        dir: 'ltr', lang: 'zh', ogLocale: 'zh_CN',
        title: '让屏幕上的任何语言都能看懂',
        description: 'Live Subtitles 在任何应用之上实时显示字幕和翻译：通话、会议、视频、直播、游戏。支持 60+ 种语言，被观看的应用无需安装任何插件。此邀请附赠免费分钟数。',
        imgAlt: '视频通话之上的实时字幕和翻译',
        lead: 'Live Subtitles 在任何应用窗口之上显示字幕和即时翻译：视频通话、网课、直播、影片、游戏。被观看的应用无需插件、无需账号、无需设置。',
        usp: [
            ['双行字幕', '原文与译文上下对照，同时显示。'],
            ['适用于任何窗口', 'Zoom、Teams、YouTube、Netflix、Steam，皆可。'],
            ['60+ 种语言', '实时语音识别与翻译。'],
        ],
        giftTitle: '朋友的邀请附赠免费分钟数',
        giftSub: '使用下方邀请码，你和朋友都能获得。',
        copyCode: '复制邀请码',
        install: '免费下载 Windows 版',
        note: '安装后邀请码通常会自动生效。如果没有生效，请在应用的设置中选择“邀请好友”并输入上方的邀请码。',
        shareLabel: '觉得有用？分享给需要的人：',
        copyLink: '复制链接',
        copied: '已复制',
        errorTitle: '邀请链接不完整',
        errorText: '请让朋友重新发送链接，或先安装应用再手动输入邀请码。',
        errorButton: '打开 Microsoft Store',
        pitch: '任何应用之上的实时字幕与翻译：通话、视频、直播、游戏。',
    },
    // У лендинга нет локали zh-TW, но у приложения есть: отдавать традиционному
    // читателю упрощённую страницу нельзя, поэтому у инвайта своя папка.
    'zh-tw': {
        dir: 'ltr', lang: 'zh-TW', ogLocale: 'zh_TW',
        title: '讓螢幕上的任何語言都能看懂',
        description: 'Live Subtitles 在任何應用程式之上即時顯示字幕和翻譯：通話、會議、影片、直播、遊戲。支援 60+ 種語言，被觀看的應用程式無需安裝任何外掛。此邀請附贈免費分鐘數。',
        imgAlt: '視訊通話之上的即時字幕和翻譯',
        lead: 'Live Subtitles 在任何應用程式視窗之上顯示字幕和即時翻譯：視訊通話、線上課程、直播、電影、遊戲。被觀看的應用程式無需外掛、無需帳號、無需設定。',
        usp: [
            ['雙行字幕', '原文與譯文上下對照，同時顯示。'],
            ['適用於任何視窗', 'Zoom、Teams、YouTube、Netflix、Steam，皆可。'],
            ['60+ 種語言', '即時語音辨識與翻譯。'],
        ],
        giftTitle: '朋友的邀請附贈免費分鐘數',
        giftSub: '使用下方邀請碼，你和朋友都能獲得。',
        copyCode: '複製邀請碼',
        install: '免費下載 Windows 版',
        note: '安裝後邀請碼通常會自動生效。如果沒有生效，請在應用程式的設定中選擇「邀請好友」並輸入上方的邀請碼。',
        shareLabel: '覺得有用？分享給需要的人：',
        copyLink: '複製連結',
        copied: '已複製',
        errorTitle: '邀請連結不完整',
        errorText: '請讓朋友重新傳送連結，或先安裝應用程式再手動輸入邀請碼。',
        errorButton: '開啟 Microsoft Store',
        pitch: '任何應用程式之上的即時字幕與翻譯：通話、影片、直播、遊戲。',
    },
    hi: {
        dir: 'ltr', lang: 'hi', ogLocale: 'hi_IN',
        title: 'अपनी स्क्रीन पर हर भाषा समझें',
        description: 'Live Subtitles किसी भी ऐप के ऊपर रियल-टाइम सबटाइटल और अनुवाद दिखाता है: कॉल, मीटिंग, वीडियो, स्ट्रीम, गेम। 60+ भाषाएँ, और जो ऐप आप देख रहे हैं उसमें कुछ भी इंस्टॉल करने की ज़रूरत नहीं। इस निमंत्रण के साथ मुफ़्त मिनट मिलते हैं।',
        imgAlt: 'वीडियो कॉल के ऊपर रियल-टाइम सबटाइटल और अनुवाद',
        lead: 'Live Subtitles किसी भी ऐप के ऊपर सबटाइटल और तुरंत अनुवाद दिखाता है: वीडियो कॉल, लेक्चर, स्ट्रीम, फ़िल्में, गेम। जो ऐप आप देख रहे हैं उसमें कोई प्लगिन, कोई अकाउंट और कोई सेटअप नहीं चाहिए।',
        usp: [
            ['एक साथ दो लाइनें', 'मूल भाषा और अनुवाद, एक के नीचे दूसरी।'],
            ['किसी भी विंडो के ऊपर', 'Zoom, Teams, YouTube, Netflix, Steam — कुछ भी।'],
            ['60+ भाषाएँ', 'रियल टाइम में वाक् पहचान और अनुवाद।'],
        ],
        giftTitle: 'आपके दोस्त के निमंत्रण में मुफ़्त मिनट शामिल हैं',
        giftSub: 'नीचे दिया कोड इस्तेमाल करें — दोनों को मिलेंगे।',
        copyCode: 'निमंत्रण कोड कॉपी करें',
        install: 'Windows के लिए मुफ़्त पाएँ',
        note: 'इंस्टॉल करने के बाद कोड आमतौर पर अपने आप लग जाता है। अगर नहीं, तो ऐप की सेटिंग खोलें, “दोस्तों को आमंत्रित करें” चुनें और ऊपर दिया कोड डालें।',
        shareLabel: 'किसी को इसकी ज़रूरत है? आगे भेजें:',
        copyLink: 'लिंक कॉपी करें',
        copied: 'कॉपी हो गया',
        errorTitle: 'यह निमंत्रण लिंक अधूरा है',
        errorText: 'अपने दोस्त से लिंक फिर भेजने के लिए कहें, या ऐप इंस्टॉल करके निमंत्रण कोड खुद डालें।',
        errorButton: 'Microsoft Store खोलें',
        pitch: 'किसी भी ऐप के ऊपर सबटाइटल और तुरंत अनुवाद: कॉल, वीडियो, स्ट्रीम, गेम।',
    },
    ar: {
        dir: 'rtl', lang: 'ar', ogLocale: 'ar_AR',
        title: 'افهم أي لغة على شاشتك',
        description: 'يعرض Live Subtitles تعليقات وترجمة فورية فوق أي تطبيق: المكالمات والاجتماعات والفيديو والبث والألعاب. أكثر من 60 لغة، ولا حاجة إلى تثبيت أي شيء داخل التطبيق الذي تشاهده. هذه الدعوة تمنحك دقائق مجانية.',
        imgAlt: 'تعليقات وترجمة فورية فوق مكالمة فيديو',
        lead: 'يعرض Live Subtitles التعليقات والترجمة الفورية فوق أي تطبيق: مكالمات الفيديو والمحاضرات والبث المباشر والأفلام والألعاب. التطبيق الذي تشاهده لا يحتاج إلى إضافات ولا حسابات ولا أي إعداد.',
        usp: [
            ['سطران في الوقت نفسه', 'النص الأصلي والترجمة، أحدهما فوق الآخر.'],
            ['فوق أي نافذة', 'Zoom وTeams وYouTube وNetflix وSteam وأي تطبيق آخر.'],
            ['أكثر من 60 لغة', 'التعرف على الكلام وترجمته في الوقت الفعلي.'],
        ],
        giftTitle: 'دعوة صديقك تتضمن دقائق مجانية',
        giftSub: 'استخدم الرمز أدناه — وستحصلان عليها كلاكما.',
        copyCode: 'نسخ رمز الدعوة',
        install: 'احصل عليه مجانًا لـ Windows',
        note: 'بعد التثبيت يُطبَّق الرمز تلقائيًا في الغالب. وإن لم يحدث ذلك، افتح الإعدادات في التطبيق واختر «دعوة الأصدقاء» وأدخل الرمز أعلاه.',
        shareLabel: 'تعرف شخصًا يحتاج إلى هذا؟ شاركه معه:',
        copyLink: 'نسخ الرابط',
        copied: 'تم النسخ',
        errorTitle: 'رابط الدعوة غير مكتمل',
        errorText: 'اطلب من صديقك إرسال الرابط مرة أخرى، أو ثبّت التطبيق وأدخل رمز الدعوة يدويًا.',
        errorButton: 'فتح Microsoft Store',
        pitch: 'تعليقات وترجمة فورية فوق أي تطبيق: المكالمات والفيديو والبث والألعاب.',
    },
};

function attr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function text(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Строка внутри одинарных кавычек в инлайновом <script>. </script> внутри данных
// закрыл бы тег раньше времени, поэтому \x3c для '<'.
function js(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/</g, '\\x3c')
        .replace(/\r?\n/g, '\\n');
}

function render(dir, s) {
    const pageUrl = dir === 'en' ? ORIGIN + '/i/' : ORIGIN + '/' + dir + '/i/';
    const usp = s.usp
        .map(pair => '        <li><b>' + text(pair[0]) + '</b> &mdash; ' + text(pair[1]) + '</li>')
        .join('\n');

    return `<!DOCTYPE html>
<html lang="${attr(s.lang)}"${s.dir === 'rtl' ? ' dir="rtl"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Meta pixel (LiveSubtitles Web) -->
    <script src="/meta-pixel.js" defer><\/script>
    <!-- Yandex.Metrika counter -->
    <script src="/yandex-metrika.js"><\/script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${YM_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}"><\/script>
    <script src="/gtag-init.js"><\/script>
  <title>${text(s.title)}</title>
  <meta name="description" content="${attr(s.description)}">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="${pageUrl}" />
  <link rel="icon" href="/2sub.ico">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${attr(s.title)}">
  <meta property="og:description" content="${attr(s.description)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="${OG_W}">
  <meta property="og:image:height" content="${OG_H}">
  <meta property="og:image:alt" content="${attr(s.imgAlt)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="Live Subtitles">
  <meta property="og:locale" content="${attr(s.ogLocale)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(s.title)}">
  <meta name="twitter:description" content="${attr(s.description)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <meta name="twitter:image:alt" content="${attr(s.imgAlt)}">

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      line-height: 1.6;
      background: #f7f9fb;
      color: #1c2733;
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      max-width: 460px;
      width: calc(100% - 2rem);
      margin: 1rem;
      padding: 2rem;
      text-align: center;
    }
    .card img { width: 56px; height: 56px; }
    h1 { font-size: 1.4em; margin: 0.75rem 0 0.5rem; }
    p { margin: 0.5rem 0; color: #45566a; }
    .code {
      display: inline-block;
      margin: 1rem 0 0.25rem;
      padding: 0.6rem 1.4rem;
      border: 1px dashed #b6c4d4;
      border-radius: 8px;
      background: #f2f6fa;
      font-size: 1.6em;
      font-weight: bold;
      letter-spacing: 0.18em;
      color: #1c2733;
      direction: ltr;
      unicode-bidi: isolate;
    }
    .btn {
      display: inline-block;
      margin-top: 1.25rem;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      background: #0077cc;
      color: #fff;
      font-size: 1em;
      cursor: pointer;
      text-decoration: none;
    }
    .btn:hover { background: #005fa3; }
    .link-btn {
      margin-top: 0.5rem;
      background: none;
      border: none;
      color: #0077cc;
      font-size: 0.9em;
      cursor: pointer;
      font-family: inherit;
    }
    .note { margin-top: 1.2rem; font-size: 0.85em; color: #8494a6; }
    .lead { font-size: 1.05em; color: #33475b; }
    .usp { text-align: left; margin: 1.4rem auto 0; padding: 0 0 0 1.1rem; max-width: 30rem; color: #33475b; }
    .usp li { margin-bottom: 0.5rem; }
    [dir="rtl"] .usp { text-align: right; padding: 0 1.1rem 0 0; }
    .gift { display: block; margin: 1.6rem 0 0.6rem; padding: 0.9rem 1rem; border-radius: 10px;
            background: #f2ecff; border: 1px solid #ddd0ff; }
    .gift-title { display: block; font-weight: 700; color: #4c1d95; }
    .gift-sub { display: block; font-size: 0.9em; color: #6b5b95; margin-top: 0.15rem; }
    .platforms { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
    .btn-alt { background: #fff; color: #4c1d95; border: 1px solid #cbb8ff; }
    .share { margin-top: 1.8rem; padding-top: 1.2rem; border-top: 1px solid #e6ecf2; }
    .share-label { display: block; font-size: 0.9em; color: #56697c; margin-bottom: 0.7rem; }
    .share-row { display: flex; gap: 0.45rem; justify-content: center; flex-wrap: wrap; }
    .share-btn { display: inline-block; padding: 0.45rem 0.8rem; border-radius: 999px; font-size: 0.85em;
                 text-decoration: none; color: #fff; border: 0; cursor: pointer; font-family: inherit; }
    .share-btn.tg { background: #229ED9; }
    .share-btn.wa { background: #25D366; }
    .share-btn.x  { background: #111; }
    .share-btn.copy { background: #eef2f7; color: #33475b; }
    .error { color: #c5221f; }
    .hidden { display: none; }
    a { color: #0077cc; }
  </style>
</head>
<body>
  <div class="card">
    <img src="/2sub.png" alt="Live Subtitles">

    <div id="state-ready" class="hidden">
      <h1>${text(s.title)}</h1>
      <p class="lead">${text(s.lead)}</p>

      <ul class="usp">
${usp}
      </ul>

      <div class="gift">
        <span class="gift-title">${text(s.giftTitle)}</span>
        <span class="gift-sub">${text(s.giftSub)}</span>
      </div>

      <div class="code" id="code">------</div>
      <div><button class="link-btn" id="copy">${text(s.copyCode)}</button></div>

      <div class="platforms">
        <a class="btn" id="install" href="#" rel="noopener">${text(s.install)}</a>
      </div>
      <p class="note">${text(s.note)}</p>

      <div class="share">
        <span class="share-label">${text(s.shareLabel)}</span>
        <div class="share-row">
          <a class="share-btn tg" id="share-tg" href="#" target="_blank" rel="noopener">Telegram</a>
          <a class="share-btn wa" id="share-wa" href="#" target="_blank" rel="noopener">WhatsApp</a>
          <a class="share-btn x" id="share-x" href="#" target="_blank" rel="noopener">X</a>
          <button class="share-btn copy" id="share-copy">${text(s.copyLink)}</button>
        </div>
      </div>
    </div>

    <div id="state-error" class="hidden">
      <h1 class="error">${text(s.errorTitle)}</h1>
      <p>${text(s.errorText)}</p>
      <a class="btn" href="https://apps.microsoft.com/detail/${STORE_ID}?cid=ref_invalid" rel="noopener">${text(s.errorButton)}</a>
    </div>
  </div>

  <script>
    (function () {
      var API = 'https://api.live-subtitles.com/v1/referral/click';
      var STORE = 'https://apps.microsoft.com/detail/${STORE_ID}';
      var COPIED = '${js(s.copied)}';
      var params = new URLSearchParams(window.location.search);
      var raw = (params.get('c') || params.get('code') || '').toUpperCase();
      var code = raw.replace(/[^0-9A-Z]/g, '').slice(0, 6);

      function show(id) {
        ['state-ready', 'state-error'].forEach(function (s) {
          document.getElementById(s).classList.toggle('hidden', s !== id);
        });
      }

      if (code.length !== 6) {
        show('state-error');
        return;
      }

      document.getElementById('code').textContent = code;
      document.getElementById('install').href = STORE + '?cid=ref_' + encodeURIComponent(code);
      show('state-ready');

      // Счётчик кликов по ссылке-приглашению: воронка code -> клик -> установка -> redeem.
      try {
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code }),
          keepalive: true,
          mode: 'cors'
        }).catch(function () { /* счётчик не критичен */ });
      } catch (e) { /* старые браузеры без fetch */ }

      if (typeof window.ym === 'function') {
        try { window.ym(${YM_ID}, 'reachGoal', 'referral_invite_open'); } catch (e) { /* counter not ready */ }
      }

      function copyTo(button, value) {
        function done() { button.textContent = COPIED; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, function () { /* denied */ });
          return;
        }
        var input = document.createElement('input');
        input.value = value;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* unsupported */ }
        document.body.removeChild(input);
      }

      document.getElementById('copy').addEventListener('click', function () {
        copyTo(this, code);
      });

      // Шаринг: передаём тот же URL с кодом, поэтому цепочка продолжает работать на
      // того же пригласившего. Текст — про приложение, а не про бонус: получатель ещё
      // не знает продукт, и «20 минут» без контекста ничего не значат.
      var pageUrl = window.location.origin + window.location.pathname + '?c=' + code;
      var pitch = '${js(s.pitch)}';
      var targets = {
        'share-tg': 'https://t.me/share/url?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(pitch),
        'share-wa': 'https://wa.me/?text=' + encodeURIComponent(pitch + ' ' + pageUrl),
        'share-x': 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pitch) + '&url=' + encodeURIComponent(pageUrl)
      };
      Object.keys(targets).forEach(function (id) {
        var node = document.getElementById(id);
        if (!node) return;
        node.href = targets[id];
        node.addEventListener('click', function () {
          if (typeof window.ym === 'function') {
            try { window.ym(${YM_ID}, 'reachGoal', 'referral_page_share'); } catch (e) { /* counter not ready */ }
          }
        });
      });

      var shareCopy = document.getElementById('share-copy');
      if (shareCopy) {
        shareCopy.addEventListener('click', function () {
          copyTo(this, pageUrl);
        });
      }

      document.getElementById('install').addEventListener('click', function () {
        if (typeof window.ym === 'function') {
          try { window.ym(${YM_ID}, 'reachGoal', 'referral_store_click'); } catch (e) { /* counter not ready */ }
        }
      });
    })();
  <\/script>
</body>
</html>
`;
}

let written = 0;
Object.keys(STRINGS).forEach(function (dir) {
    const outDir = dir === 'en' ? path.join(ROOT, 'i') : path.join(ROOT, dir, 'i');
    const outFile = path.join(outDir, 'index.html');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, render(dir, STRINGS[dir]), 'utf8');
    written++;
    console.log('wrote ' + path.relative(ROOT, outFile).replace(/\\/g, '/'));
});
console.log('invite pages: ' + written + ' locales');
