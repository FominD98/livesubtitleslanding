const translations = {
    'en-US': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Features',
            comparison: 'Comparison',
            download: 'Download'
        },
        header: {
            title: 'Watch movies, learn languages — easily understand live speech',
            lead: 'Live Subtitles is your assistant with dual subtitles, speech recognition and real-time translation'
        },
        downloadBtn: 'Download from Microsoft Store',
        macBtn: 'Want a Mac version',
        platforms: {
            title: 'Works with any app — no limits'
        },
        mediaExamples: {
            title: 'Examples of the App',
            home: 'Main Interface',
            settings: 'Application Settings',
            action: 'Subtitles in Action',
            store: 'App Features'
        },
        features: {
            title: 'Features',
            dualSubtitles: 'Dual Subtitles',
            dualSubtitlesDesc: 'On computer, in any browser and player.',
            speechRecognition: 'Speech Recognition',
            speechRecognitionDesc: 'Without any platform or app limitations.',
            realTimeTranslation: 'Real-time Translation',
            realTimeTranslationDesc: 'Watch movies and participate in calls understanding everything immediately, without asking again.',
            allApps: 'Works with All Apps'
        },
        comparison: {
            title: 'Comparison',
            noSubtitles: {
                title: 'No Subtitles',
                desc: 'Audio only',
                point1: '❌ Hard to catch unfamiliar words',
                point2: '❌ Frequent repetitions',
                point3: '❌ Lots of missed information',
                point4: '❌ Hard to understand the speaker\'s accent'
            },
            oneLanguage: {
                title: 'One Language',
                desc: 'Regular subtitles',
                point1: '✅ Text is visible',
                point2: '✅ Helps understand the accent',
                point3: '❌ Subtitles may not be available in the app',
                point4: '❌ No translation',
                point5: '❌ Hard to learn new words'
            },
            twoLanguages: {
                title: 'Two Languages',
                desc: 'Dual subtitles with Live Subtitles',
                point1: '✅ Instant translation',
                point2: '✅ Easy to understand any accent',
                point3: '✅ Works with all applications',
                point4: '✅ Understand the first time — no need to ask again',
                point5: '✅ Fast learning of new words'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. All rights reserved.',
            contact: 'For all questions: ',
            email: 'help@2sub.ru',
            articles: 'Articles'
        },
        title: 'Live Subtitles - Dual Subtitles for Language Learning',
        description: 'Live Subtitles — an application with dual subtitles, speech recognition and real-time translation. Learn languages, watch movies and understand foreign speech effortlessly.',
        download: 'Download Now',
        meta: {
            description: 'Live Subtitles — an application with dual subtitles, speech recognition and real-time translation. Learn languages, watch movies and understand foreign speech effortlessly.',
            keywords: 'dual subtitles, language learning subtitles, speech translation, speech recognition, online subtitles, Live Subtitles, English learning, language learning, real-time subtitles, speech understanding, movie translator'
        },
        downloadModal: {
            title: 'Download Notice',
            warning: 'When downloading the file, Windows may show a security warning. This is normal for new applications.',
            howToInstall: 'How to install the application:',
            step1: '1. Click "Save" when downloading',
            step2: '2. After downloading, click "Run anyway"',
            step3: '3. Follow the installer instructions',
            virusCheck: 'You can check the file for viruses before installing:',
            checkVirus: 'Check on VirusTotal',
            download: 'Download',
            cancel: 'Cancel'
        },
        macModal: {
            title: 'Mac Version',
            desc: 'We are working on a Mac version. Leave your email and we will notify you when it is ready.',
            send: 'Send'
        },
        successModal: {
            title: 'Thank you!',
            desc: 'We will notify you when the Mac version is ready.',
            close: 'Close'
        },
        faq: {
            title: 'Frequently Asked Questions',
            q1: 'How much does the app cost?',
            a1: 'Live Subtitles works on a subscription basis starting from $7. A free trial period is available so you can test all the app features.',
            q2: 'Does it work with all applications?',
            a2: 'Yes! Live Subtitles works with absolutely any applications: YouTube, Netflix, Zoom, Teams, Discord, browsers and even games. The app captures audio at the system level.',
            q3: 'What languages are supported?',
            a3: 'Supports 16+ languages with dual subtitle display: English, French, Spanish, German, Italian, Japanese, Korean, Chinese (Simplified/Traditional), Arabic, Hindi, Portuguese, Polish, Dutch, Turkish, Russian, Ukrainian.',
            q4: 'Is an internet connection required?',
            a4: 'Yes, a stable internet connection is required for speech recognition and translation. The app uses cloud services to ensure high accuracy.',
            q5: 'Can I customize the appearance of subtitles?',
            a5: 'Of course! You can adjust font size, color, subtitle position on screen, background transparency and choose which languages to display.',
            q6: 'Is there a version for Mac or mobile devices?',
            a6: 'Currently only the Windows version is available. We are actively working on versions for Mac, iOS and Android. Leave your email and we will notify you of the release.'
        },
        testimonials: {
            title: 'User Reviews',
            review1: '"Finally I can watch Korean dramas without constant pauses! The app accurately translates even fast speech."',
            author1: 'Anna K.',
            role1: 'Learning Korean',
            review2: '"A revolution for international meetings! No more need to ask colleagues from India and China to repeat."',
            author2: 'Michael R.',
            role2: 'IT Manager',
            review3: '"I use it to learn English through YouTube. My vocabulary has grown tremendously in a month!"',
            author3: 'Elena S.',
            role3: 'Student',
            review4: '"I learn English wherever I want - on any platform! I watch Netflix in browser, listen to podcasts on phone, attend work meetings in Teams. The app works absolutely everywhere!"',
            author4: 'Alex M.',
            role4: 'Learning English',
            review5: '"Simple to set up and works perfectly. From $7 subscription paid for itself after the first work meeting."',
            author5: 'David P.',
            role5: 'Translator'
        },
        download: {
            title: 'Try it free right now',
            subtitle: 'Free trial period, then from $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", ru: "Добро пожаловать в мир двойных субтитров", es: "Bienvenido al mundo de subtítulos duales", de: "Willkommen in der Welt der doppelten Untertitel", it: "Benvenuti nel mondo dei sottotitoli doppi", ja: "二重字幕の世界へようこそ", ko: "이중 자막의 세계에 오신 것을 환영합니다", zh: "欢迎来到双字幕的世界", ar: "مرحباً بك في عالم الترجمة المزدوجة", hi: "दोहरे सबटाइटल की दुनिया में आपका स्वागत है", pt: "Bem-vindo ao mundo das duplas legendas", pl: "Witaj w świecie podwójnych napisów", nl: "Welkom in de wereld van dubbele ondertitels", tr: "Çift altyazı dünyasına hoş geldiniz", uk: "Ласкаво просимо у світ подвійних субтитрів" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", ru: "Два языка, один экран", es: "Dos idiomas, una pantalla", de: "Zwei Sprachen, ein Bildschirm", it: "Due lingue, uno schermo", ja: "二言語、一画面", ko: "두 언어, 하나의 화면", zh: "两种语言，一个屏幕", ar: "لغتان، شاشة واحدة", hi: "दो भाषाएं, एक स्क्रीन", pt: "Dois idiomas, uma tela", pl: "Dwa języki, jeden ekran", nl: "Twee talen, één scherm", tr: "İki dil, bir ekran", uk: "Дві мови, один екран" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", ru: "Изучайте языки во время просмотра фильмов", es: "Aprende idiomas viendo películas", de: "Sprachen lernen beim Filme schauen", it: "Impara le lingue guardando film", ja: "映画を見ながら言語を学ぶ", ko: "영화를 보며 언어 배우기", zh: "看电影学语言", ar: "تعلم اللغات أثناء مشاهدة الأفلام", hi: "फिल्में देखते हुए भाषाएं सीखें", pt: "Aprenda idiomas assistindo filmes", pl: "Ucz się języków oglądając filmy", nl: "Leer talen terwijl je films kijkt", tr: "Film izlerken dil öğrenin", uk: "Вивчайте мови під час перегляду фільмів" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", ru: "Лучше понимайте иностранную речь", es: "Comprende mejor el habla extranjera", de: "Verstehe fremde Sprache besser", it: "Comprendi meglio il discorso straniero", ja: "外国語をより良く理解する", ko: "외국어를 더 잘 이해하기", zh: "更好地理解外语", ar: "افهم الكلام الأجنبي بشكل أفضل", hi: "विदेशी भाषा को बेहतर समझें", pt: "Entenda melhor o idioma estrangeiro", pl: "Lepiej rozumiej język obcy", nl: "Begrijp vreemde taal beter", tr: "Yabancı dili daha iyi anlayın", uk: "Краще розумійте іноземну мову" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", ru: "Улавливайте каждое слово без переспрашиваний", es: "Capta cada palabra sin preguntar de nuevo", de: "Erfasse jedes Wort ohne nochmal fragen", it: "Cattura ogni parola senza chiedere di nuovo", ja: "再度尋ねることなく全ての単語をキャッチ", ko: "다시 묻지 않고 모든 단어 포착", zh: "无需重复即可捕获每个单词", ar: "التقط كل كلمة دون إعادة السؤال", hi: "दोबारा पूछे बिना हर शब्द पकड़ें", pt: "Capture cada palavra sem perguntar novamente", pl: "Łap każde słowo bez ponownego pytania", nl: "Vang elk woord zonder opnieuw te vragen", tr: "Tekrar sormadan her kelimeyi yakalayın", uk: "Ловіть кожне слово без повторного запитування" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", ru: "Понимайте с первого раза — без повторов", es: "Entiende a la primera — no se necesitan repeticiones", de: "Verstehe beim ersten Mal — keine Wiederholungen nötig", it: "Capisci al primo colpo — non serve ripetere", ja: "一度で理解 — 繰り返し不要", ko: "첫 번째로 이해 — 반복 불필요", zh: "一次理解 — 无需重复", ar: "افهم من المرة الأولى — لا حاجة للتكرار", hi: "पहली बार में समझें — दोहराने की जरूरत नहीं", pt: "Entenda de primeira — sem repetição", pl: "Zrozum za pierwszym razem — bez powtarzania", nl: "Begrijp de eerste keer — geen herhaling nodig", tr: "İlk seferde anlayın — tekrar gereksiz", uk: "Розумійте з першого разу — без повторення" }
        ]
    },
    'ru-RU': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Возможности',
            comparison: 'Сравнение',
            download: 'Скачать'
        },
        header: {
            title: 'Смотрите фильмы, учите языки — легко понимайте живую речь',
            lead: 'Live Subtitles - ваш помощник с двойными субтитрами, распознаванием и переводом речи в реальном времени'
        },
        downloadBtn: 'Скачать в Microsoft Store',
        macBtn: 'Хочу версию для Mac',
        platforms: {
            title: 'Работает вообще с любым приложением — без ограничений'
        },
        mediaExamples: {
            title: 'Примеры работы',
            home: 'Главный интерфейс',
            settings: 'Настройки приложения',
            action: 'Субтитры в действии',
            store: 'Функции приложения'
        },
        features: {
            title: 'Возможности',
            dualSubtitles: 'Двойные субтитры',
            dualSubtitlesDesc: 'На компьютере, в любом браузере и проигрывателе.',
            speechRecognition: 'Распознавание речи',
            speechRecognitionDesc: 'Без ограничений по платформам и приложениям.',
            realTimeTranslation: 'Перевод в реальном времени',
            realTimeTranslationDesc: 'Смотрите фильмы и участвуйте в звонках, понимая сразу, без переспрашиваний.',
            allApps: 'Работает со всеми приложениями'
        },
        comparison: {
            title: 'Сравнение способов',
            noSubtitles: {
                title: 'Без субтитров',
                desc: 'Только звук',
                point1: '❌ Сложно уловить незнакомые слова',
                point2: '❌ Частые переспрашивания',
                point3: '❌ Много пропущенной информации',
                point4: '❌ Сложно понять акцент говорящего'
            },
            oneLanguage: {
                title: 'Один язык',
                desc: 'Обычные субтитры',
                point1: '✅ Видно текст',
                point2: '✅ Помогает понять акцент',
                point3: '❌ Субтитров может не быть в приложении',
                point4: '❌ Нет перевода',
                point5: '❌ Сложно учить новые слова'
            },
            twoLanguages: {
                title: 'Два языка',
                desc: 'Двойные субтитры с Live Subtitles',
                point1: '✅ Мгновенный перевод',
                point2: '✅ Легко понимать любой акцент',
                point3: '✅ Работает со всеми приложениями',
                point4: '✅ Понимание с первого раза — не нужно переспрашивать',
                point5: '✅ Быстрое изучение новых слов'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Все права защищены.',
            contact: 'По всем вопросам: ',
            email: 'help@2sub.ru',
            articles: 'Статьи'
        },
        title: 'Live Subtitles - Двойные субтитры для изучения языков',
        description: 'Live Subtitles — приложение с двойными субтитрами, распознаванием и переводом речи в реальном времени. Учите языки, смотрите фильмы и понимайте иностранную речь без усилий.',
        download: 'Скачать сейчас',
        meta: {
            description: 'Live Subtitles — приложение с двойными субтитрами, распознаванием и переводом речи в реальном времени. Учите языки, смотрите фильмы и понимайте иностранную речь без усилий.',
            keywords: 'двойные субтитры, субтитры для изучения языков, перевод речи, распознавание речи, субтитры онлайн, Live Subtitles, изучение английского, изучение языков, субтитры в реальном времени, понимание речи, переводчик для фильмов'
        },
        downloadModal: {
            title: 'Внимание при скачивании',
            warning: 'При скачивании файла Windows может показать предупреждение о безопасности. Это нормально для новых приложений.',
            howToInstall: 'Чтобы установить приложение:',
            step1: '1. Нажмите "Сохранить" при скачивании',
            step2: '2. После скачивания нажмите "Выполнить в любом случае"',
            step3: '3. Следуйте инструкциям установщика',
            virusCheck: 'Вы можете проверить файл на вирусы перед установкой:',
            checkVirus: 'Проверить на VirusTotal',
            download: 'Скачать',
            cancel: 'Отмена'
        },
        macModal: {
            title: 'Версия для Mac',
            desc: 'Мы работаем над версией для Mac. Оставьте свой email, и мы сообщим вам, когда она будет готова.',
            send: 'Отправить'
        },
        successModal: {
            title: 'Спасибо!',
            desc: 'Мы сообщим вам, когда версия для Mac будет готова.',
            close: 'Закрыть'
        },
        faq: {
            title: 'Часто задаваемые вопросы',
            q1: 'Сколько стоит приложение?',
            a1: 'Live Subtitles работает по подписке от $7. Доступен бесплатный пробный период, чтобы вы могли протестировать все функции приложения.',
            q2: 'Работает ли с любыми приложениями?',
            a2: 'Да! Live Subtitles работает с абсолютно любыми приложениями: YouTube, Netflix, Zoom, Teams, Discord, браузерами и даже играми. Приложение захватывает звук на системном уровне.',
            q3: 'Какие языки поддерживаются?',
            a3: 'Поддерживается 16+ языков с отображением двойных субтитров: английский, французский, испанский, немецкий, итальянский, японский, корейский, китайский (упрощенный/традиционный), арабский, хинди, португальский, польский, нидерландский, турецкий, русский, украинский.',
            q4: 'Нужно ли подключение к интернету?',
            a4: 'Да, для работы распознавания и перевода речи требуется стабильное подключение к интернету. Приложение использует облачные сервисы для обеспечения высокой точности.',
            q5: 'Можно ли настроить внешний вид субтитров?',
            a5: 'Конечно! Вы можете настроить размер шрифта, цвет, позицию субтитров на экране, прозрачность фона и выбрать, какие языки отображать.',
            q6: 'Есть ли версия для Mac или мобильных устройств?',
            a6: 'Сейчас доступна только версия для Windows. Мы активно работаем над версиями для Mac, iOS и Android. Оставьте свой email, и мы сообщим о выходе.'
        },
        testimonials: {
            title: 'Отзывы пользователей',
            review1: '"Наконец-то могу смотреть корейские дорамы без постоянных пауз! Приложение точно переводит даже быструю речь."',
            author1: 'Anna K.',
            role1: 'Изучает корейский язык',
            review2: '"Революция для международных встреч! Больше не нужно переспрашивать коллег из Индии и Китая."',
            author2: 'Michael R.',
            role2: 'IT-менеджер',
            review3: '"Использую для изучения английского через YouTube. За месяц словарный запас вырос в разы!"',
            author3: 'Elena S.',
            role3: 'Студентка',
            review4: '"Изучаю английский везде где хочу - на любой платформе! В браузере смотрю Netflix, на телефоне слушаю подкасты, в Teams рабочие встречи. Приложение работает абсолютно везде!"',
            author4: 'Alex M.',
            role4: 'Изучает английский',
            review5: '"Простое в настройке и работает идеально. Подписка от $7 окупилась уже на первой рабочей встрече."',
            author5: 'David P.',
            role5: 'Переводчик'
        },
        download: {
            title: 'Попробуйте бесплатно прямо сейчас',
            subtitle: 'Бесплатный пробный период, затем от $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", ru: "Добро пожаловать в мир двойных субтитров" },
            { en: "Two languages, one screen", ru: "Два языка, один экран" },
            { en: "Learn languages while watching movies", ru: "Изучайте языки во время просмотра фильмов" },
            { en: "Understand foreign speech better", ru: "Лучше понимайте иностранную речь" },
            { en: "Catch every word without asking again", ru: "Улавливайте каждое слово без переспрашиваний" },
            { en: "Understand the first time — no repeats needed", ru: "Понимайте с первого раза — без повторов" }
        ]
    },
    'fr-FR': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Fonctionnalités',
            comparison: 'Comparaison',
            download: 'Télécharger'
        },
        header: {
            title: 'Regardez des films, apprenez des langues — comprenez facilement la parole en direct',
            lead: 'Live Subtitles - votre assistant avec sous-titres doubles, reconnaissance et traduction de la parole en temps réel'
        },
        downloadBtn: 'Télécharger depuis Microsoft Store',
        macBtn: 'Je veux la version Mac',
        platforms: {
            title: 'Fonctionne avec n\'importe quelle application — sans limites'
        },
        features: {
            title: 'Fonctionnalités',
            dualSubtitles: 'Sous-titres doubles',
            dualSubtitlesDesc: 'Sur l\'ordinateur, dans n\'importe quel navigateur et lecteur.',
            speechRecognition: 'Reconnaissance vocale',
            speechRecognitionDesc: 'Sans aucune limitation de plateforme ou d\'application.',
            realTimeTranslation: 'Traduction en temps réel',
            realTimeTranslationDesc: 'Regardez des films et participez à des appels en comprenant tout de suite, sans avoir à redemander.',
            allApps: 'Fonctionne avec toutes les applications'
        },
        comparison: {
            title: 'Comparaison',
            noSubtitles: {
                title: 'Sans sous-titres',
                desc: 'Audio seulement',
                point1: '❌ Difficile de saisir les mots inconnus',
                point2: '❌ Répétitions fréquentes',
                point3: '❌ Beaucoup d\'informations manquées',
                point4: '❌ Difficile de comprendre l\'accent du locuteur'
            },
            oneLanguage: {
                title: 'Une langue',
                desc: 'Sous-titres classiques',
                point1: '✅ Le texte est visible',
                point2: '✅ Aide à comprendre l\'accent',
                point3: '❌ Les sous-titres peuvent ne pas être disponibles dans l\'application',
                point4: '❌ Pas de traduction',
                point5: '❌ Difficile d\'apprendre de nouveaux mots'
            },
            twoLanguages: {
                title: 'Deux langues',
                desc: 'Sous-titres doubles avec Live Subtitles',
                point1: '✅ Traduction instantanée',
                point2: '✅ Facile de comprendre n\'importe quel accent',
                point3: '✅ Fonctionne avec toutes les applications',
                point4: '✅ Compréhension du premier coup — pas besoin de redemander',
                point5: '✅ Apprentissage rapide de nouveaux mots'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Tous droits réservés.',
            contact: 'Pour toute question : ',
            email: 'help@2sub.ru',
            articles: 'Articles'
        },
        title: 'Live Subtitles - Sous-titres doubles pour l\'apprentissage des langues',
        description: 'Live Subtitles — une application avec sous-titres doubles, reconnaissance vocale et traduction en temps réel. Apprenez les langues, regardez des films et comprenez la parole étrangère sans effort.',
        download: 'Télécharger maintenant',
        meta: {
            description: 'Live Subtitles — une application avec sous-titres doubles, reconnaissance vocale et traduction en temps réel. Apprenez les langues, regardez des films et comprenez la parole étrangère sans effort.',
            keywords: 'sous-titres doubles, sous-titres pour l\'apprentissage des langues, traduction vocale, reconnaissance vocale, sous-titres en ligne, Live Subtitles, apprentissage de l\'anglais, apprentissage des langues, sous-titres en temps réel, compréhension de la parole, traducteur de films'
        },
        downloadModal: {
            title: 'Avis de téléchargement',
            warning: 'Lors du téléchargement du fichier, Windows peut afficher un avertissement de sécurité. C\'est normal pour les nouvelles applications.',
            howToInstall: 'Comment installer l\'application :',
            step1: '1. Cliquez sur "Enregistrer" lors du téléchargement',
            step2: '2. Après le téléchargement, cliquez sur "Exécuter quand même"',
            step3: '3. Suivez les instructions de l\'installateur',
            virusCheck: 'Vous pouvez vérifier le fichier pour les virus avant l\'installation :',
            checkVirus: 'Vérifier sur VirusTotal',
            download: 'Télécharger',
            cancel: 'Annuler'
        },
        macModal: {
            title: 'Version Mac',
            desc: 'Nous travaillons sur une version Mac. Laissez votre email et nous vous informerons lorsqu\'elle sera prête.',
            send: 'Envoyer'
        },
        successModal: {
            title: 'Merci !',
            desc: 'Nous vous informerons lorsque la version Mac sera prête.',
            close: 'Fermer'
        },
        faq: {
            title: 'Questions fréquemment posées',
            q1: 'Combien coûte l\'application ?',
            a1: 'Live Subtitles fonctionne sur la base d\'un abonnement à partir de 7 $. Une période d\'essai gratuite est disponible pour tester toutes les fonctionnalités de l\'application.',
            q2: 'Fonctionne-t-elle avec toutes les applications ?',
            a2: 'Oui ! Live Subtitles fonctionne avec absolument toutes les applications : YouTube, Netflix, Zoom, Teams, Discord, navigateurs et même jeux. L\'application capture l\'audio au niveau système.',
            q3: 'Quelles langues sont prises en charge ?',
            a3: 'Prend en charge 16+ langues avec affichage de sous-titres doubles : anglais, français, espagnol, allemand, italien, japonais, coréen, chinois (simplifié/traditionnel), arabe, hindi, portugais, polonais, néerlandais, turc, russe, ukrainien.',
            q4: 'Une connexion Internet est-elle requise ?',
            a4: 'Oui, une connexion Internet stable est requise pour la reconnaissance et la traduction vocales. L\'application utilise des services cloud pour assurer une haute précision.',
            q5: 'Puis-je personnaliser l\'apparence des sous-titres ?',
            a5: 'Bien sûr ! Vous pouvez ajuster la taille de police, la couleur, la position des sous-titres à l\'écran, la transparence de l\'arrière-plan et choisir les langues à afficher.',
            q6: 'Y a-t-il une version pour Mac ou appareils mobiles ?',
            a6: 'Actuellement, seule la version Windows est disponible. Nous travaillons activement sur les versions pour Mac, iOS et Android. Laissez votre email et nous vous informerons de la sortie.'
        },
        testimonials: {
            title: 'Avis des utilisateurs',
            review1: '"Enfin je peux regarder les dramas coréens sans pauses constantes ! L\'app traduit précisément même la parole rapide."',
            author1: 'Anna K.',
            role1: 'Apprend le coréen',
            review2: '"Une révolution pour les réunions internationales ! Plus besoin de demander aux collègues d\'Inde et de Chine de répéter."',
            author2: 'Michael R.',
            role2: 'Gestionnaire IT',
            review3: '"Je l\'utilise pour apprendre l\'anglais via YouTube. ¡Mi vocabulaire a énormément grandi en un mois !"',
            author3: 'Elena S.',
            role3: 'Étudiante',
            review4: '"J\'apprends l\'anglais où je veux - sur n\'importe quelle plateforme ! Je regarde Netflix dans le navigateur, j\'écoute des podcasts sur téléphone, je participe aux réunions dans Teams. L\'app fonctionne absolument partout !"',
            author4: 'Alex M.',
            role4: 'Apprend l\'anglais',
            review5: '"Simple à configurer et fonctionne parfaitement. Abonnement à partir de 7 $ rentabilisé dès la première réunion de travail."',
            author5: 'David P.',
            role5: 'Traducteur'
        },
        download: {
            title: 'Essayez gratuitement dès maintenant',
            subtitle: 'Période d\'essai gratuite, puis à partir de 7 $'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", fr: "Bienvenue dans le monde des sous-titres doubles" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", fr: "Deux langues, un écran" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", fr: "Apprenez des langues en regardant des films" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", fr: "Comprenez mieux la parole étrangère" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", fr: "Attrapez chaque mot sans avoir à redemander" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", fr: "Comprenez du premier coup — pas besoin de répéter" }
        ]
    },
    'es-ES': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Características',
            comparison: 'Comparación',
            download: 'Descargar'
        },
        header: {
            title: 'Mira películas, aprende idiomas — comprende fácilmente el habla en vivo',
            lead: 'Live Subtitles: tu asistente con subtítulos dobles, reconocimiento y traducción de voz en tiempo real'
        },
        downloadBtn: 'Descargar desde Microsoft Store',
        macBtn: 'Quiero la versión para Mac',
        platforms: {
            title: 'Funciona con cualquier aplicación — sin límites'
        },
        features: {
            title: 'Características',
            dualSubtitles: 'Subtítulos dobles',
            dualSubtitlesDesc: 'En el ordenador, en cualquier navegador y reproductor.',
            speechRecognition: 'Reconocimiento de voz',
            speechRecognitionDesc: 'Sin ninguna limitación de plataforma o aplicación.',
            realTimeTranslation: 'Traducción en tiempo real',
            realTimeTranslationDesc: 'Mira películas y participa en llamadas entendiendo todo de inmediato, sin tener que preguntar de nuevo.',
            allApps: 'Funciona con todas las aplicaciones'
        },
        comparison: {
            title: 'Comparación',
            noSubtitles: {
                title: 'Sin subtítulos',
                desc: 'Solo audio',
                point1: '❌ Difícil captar palabras desconocidas',
                point2: '❌ Repeticiones frecuentes',
                point3: '❌ Mucha información perdida',
                point4: '❌ Difícil entender el acento del hablante'
            },
            oneLanguage: {
                title: 'Un idioma',
                desc: 'Subtítulos normales',
                point1: '✅ El texto es visible',
                point2: '✅ Ayuda a entender el acento',
                point3: '❌ Los subtítulos pueden no estar disponibles en la aplicación',
                point4: '❌ Sin traducción',
                point5: '❌ Difícil aprender palabras nuevas'
            },
            twoLanguages: {
                title: 'Dos idiomas',
                desc: 'Subtítulos dobles con Live Subtitles',
                point1: '✅ Traducción instantánea',
                point2: '✅ Fácil de entender cualquier acento',
                point3: '✅ Funciona con todas las aplicaciones',
                point4: '✅ Comprensión a la primera — no es necesario preguntar de nuevo',
                point5: '✅ Aprendizaje rápido de palabras nuevas'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Todos los derechos reservados.',
            contact: 'Para cualquier consulta: ',
            email: 'help@2sub.ru',
            articles: 'Artículos'
        },
        title: 'Live Subtitles - Subtítulos dobles para el aprendizaje de idiomas',
        description: 'Live Subtitles — una aplicación con subtítulos dobles, reconocimiento de voz y traducción en tiempo real. Aprende idiomas, mira películas y comprende el habla extranjera sin esfuerzo.',
        download: 'Descargar ahora',
        meta: {
            description: 'Live Subtitles — una aplicación con subtítulos dobles, reconocimiento de voz y traducción en tiempo real. Aprende idiomas, mira películas y comprende el habla extranjera sin esfuerzo.',
            keywords: 'subtítulos dobles, subtítulos para aprendizaje de idiomas, traducción de voz, reconocimiento de voz, subtítulos en línea, Live Subtitles, aprender inglés, aprendizaje de idiomas, subtítulos en tiempo real, comprensión del habla, traductor de películas'
        },
        downloadModal: {
            title: 'Aviso de descarga',
            warning: 'Al descargar el archivo, Windows puede mostrar una advertencia de seguridad. Esto es normal para nuevas aplicaciones.',
            howToInstall: 'Cómo instalar la aplicación:',
            step1: '1. Haz clic en "Guardar" al descargar',
            step2: '2. Después de descargar, haz clic en "Ejecutar de todos modos"',
            step3: '3. Sigue las instrucciones del instalador',
            virusCheck: 'Puedes comprobar el archivo en busca de virus antes de instalar:',
            checkVirus: 'Comprobar en VirusTotal',
            download: 'Descargar',
            cancel: 'Cancelar'
        },
        macModal: {
            title: 'Versión para Mac',
            desc: 'Estamos trabajando en una versión para Mac. Deja tu correo electrónico y te avisaremos cuando esté lista.',
            send: 'Enviar'
        },
        successModal: {
            title: '¡Gracias!',
            desc: 'Te avisaremos cuando la versión para Mac esté lista.',
            close: 'Cerrar'
        },
        faq: {
            title: 'Preguntas frecuentes',
            q1: '¿Cuánto cuesta la aplicación?',
            a1: 'Live Subtitles funciona con suscripción desde $7. Hay un período de prueba gratuito disponible para que puedas probar todas las funciones de la aplicación.',
            q2: '¿Funciona con todas las aplicaciones?',
            a2: '¡Sí! Live Subtitles funciona con absolutamente cualquier aplicación: YouTube, Netflix, Zoom, Teams, Discord, navegadores e incluso juegos. La aplicación captura el audio a nivel del sistema.',
            q3: '¿Qué idiomas son compatibles?',
            a3: 'Admite 16+ idiomas con visualización de subtítulos dobles: inglés, francés, español, alemán, italiano, japonés, coreano, chino (simplificado/tradicional), árabe, hindi, portugués, polaco, holandés, turco, ruso, ucraniano.',
            q4: '¿Se requiere conexión a Internet?',
            a4: 'Sí, se requiere una conexión estable a Internet para el reconocimiento y traducción de voz. La aplicación utiliza servicios en la nube para garantizar alta precisión.',
            q5: '¿Puedo personalizar la apariencia de los subtítulos?',
            a5: '¡Por supuesto! Puedes ajustar el tamaño de fuente, color, posición de subtítulos en pantalla, transparencia del fondo y elegir qué idiomas mostrar.',
            q6: '¿Hay versión para Mac o dispositivos móviles?',
            a6: 'Actualmente solo está disponible la versión para Windows. Estamos trabajando activamente en versiones para Mac, iOS y Android. Deja tu email y te notificaremos del lanzamiento.'
        },
        testimonials: {
            title: 'Reseñas de usuarios',
            review1: '"¡Por fin puedo ver dramas coreanos sin pausas constantes! La app traduce con precisión incluso el habla rápida."',
            author1: 'Anna K.',
            role1: 'Aprende coreano',
            review2: '"¡Una revolución para reuniones internacionales! Ya no necesito pedir a colegas de India y China que repitan."',
            author2: 'Michael R.',
            role2: 'Gerente de TI',
            review3: '"Lo uso para aprender inglés a través de YouTube. ¡Mi vocabulario ha crecido enormemente en un mes!"',
            author3: 'Elena S.',
            role3: 'Estudiante',
            review4: '"¡Aprendo inglés donde quiero - en cualquier plataforma! Veo Netflix en navegador, escucho podcasts en teléfono, asisto a reuniones en Teams. ¡La app funciona absolutamente en todas partes!"',
            author4: 'Alex M.',
            role4: 'Aprende inglés',
            review5: '"Fácil de configurar y funciona perfectamente. Suscripción desde $7 se pagó solo después de la primera reunión de trabajo."',
            author5: 'David P.',
            role5: 'Traductor'
        },
        download: {
            title: 'Pruébalo gratis ahora mismo',
            subtitle: 'Período de prueba gratuito, luego desde $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", es: "Bienvenido al mundo de los subtítulos dobles" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", es: "Dos idiomas, una pantalla" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", es: "Aprende idiomas viendo películas" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", es: "Comprende mejor el habla extranjera" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", es: "Captura cada palabra sin tener que preguntar de nuevo" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", es: "Entiende a la primera — no hace falta repetir" }
        ]
    },
    'de-DE': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Funktionen',
            comparison: 'Vergleich',
            download: 'Herunterladen'
        },
        header: {
            title: 'Filme anschauen, Sprachen lernen — leicht verstehen Sie die Live-Sprache',
            lead: 'Live Subtitles: Ihr Assistent mit Doppel-Untertiteln, Spracherkennung und Real-Time-Übersetzung'
        },
        downloadBtn: 'Aus dem Microsoft Store herunterladen',
        macBtn: 'Ich möchte die Mac-Version',
        platforms: {
            title: 'Funktioniert mit jeder Anwendung — ohne Grenzen'
        },
        features: {
            title: 'Funktionen',
            dualSubtitles: 'Doppelte Untertitel',
            dualSubtitlesDesc: 'Auf dem Computer, in jedem Browser und Player.',
            speechRecognition: 'Spracherkennung',
            speechRecognitionDesc: 'Ohne Beschränkungen für Plattformen oder Anwendungen.',
            realTimeTranslation: 'Real-Time-Übersetzung',
            realTimeTranslationDesc: 'Filme anschauen und bei Anrufen mitverstehen, ohne jedes Mal nachfragen zu müssen.',
            allApps: 'Funktioniert mit allen Anwendungen'
        },
        comparison: {
            title: 'Vergleich der Methoden',
            noSubtitles: {
                title: 'Ohne Untertitel',
                desc: 'Nur Audio',
                point1: '❌ Schwer, unbekannte Wörter zu erkennen',
                point2: '❌ Häufige Wiederholungen',
                point3: '❌ Viel verpasster Information',
                point4: '❌ Schwer, den Akzent des Sprechers zu verstehen'
            },
            oneLanguage: {
                title: 'Eine Sprache',
                desc: 'Normale Untertitel',
                point1: '✅ Text ist sichtbar',
                point2: '✅ Hilft, den Akzent zu verstehen',
                point3: '❌ Untertitel können in der Anwendung nicht verfügbar sein',
                point4: '❌ Keine Übersetzung',
                point5: '❌ Schwer, neue Wörter zu lernen'
            },
            twoLanguages: {
                title: 'Zwei Sprachen',
                desc: 'Doppelte Untertitel mit Live Subtitles',
                point1: '✅ Instantübersetzung',
                point2: '✅ Leicht verstehen Sie jeden Akzent',
                point3: '✅ Funktioniert mit allen Anwendungen',
                point4: '✅ Verständnis vom ersten Mal — keine weitere Nachfrage',
                point5: '✅ Schnelles Lernen neuer Wörter'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Alle Rechte vorbehalten.',
            contact: 'Für alle Fragen: ',
            email: 'help@2sub.ru',
            articles: 'Artikel'
        },
        title: 'Live Subtitles - Doppelte Untertitel für das Lernen von Sprachen',
        description: 'Live Subtitles — eine Anwendung mit Doppel-Untertiteln, Spracherkennung und Real-Time-Übersetzung. Sprachen lernen, Filme anschauen und fremde Sprache verstehen ohne Mühe.',
        download: 'Jetzt herunterladen',
        meta: {
            description: 'Live Subtitles — eine Anwendung mit Doppel-Untertiteln, Spracherkennung und Real-Time-Übersetzung. Sprachen lernen, Filme anschauen und fremde Sprache verstehen ohne Mühe.',
            keywords: 'Doppelte Untertitel, Untertitel für das Lernen von Sprachen, Sprachübersetzung, Spracherkennung, Online-Untertitel, Live Subtitles, Englisch lernen, Sprachen lernen, Untertitel im Zeitverlauf, Sprachverständnis, Filmübersetzer'
        },
        downloadModal: {
            title: 'Download-Warnung',
            warning: 'Beim Herunterladen der Datei kann Windows eine Sicherheitswarnung anzeigen. Das ist normal für neue Anwendungen.',
            howToInstall: 'Wie installiere ich die Anwendung:',
            step1: '1. Klicken Sie auf "Speichern", wenn Sie herunterladen',
            step2: '2. Klicken Sie nach dem Herunterladen auf "Trotzdem ausführen"',
            step3: '3. Befolgen Sie die Installationsanweisungen',
            virusCheck: 'Sie können die Datei auf Viren überprüfen, bevor Sie installieren:',
            checkVirus: 'Überprüfen auf VirusTotal',
            download: 'Herunterladen',
            cancel: 'Abbrechen'
        },
        macModal: {
            title: 'Mac-Version',
            desc: 'Wir arbeiten an einer Mac-Version. Lassen Sie Ihre E-Mail und wir werden Sie informieren, wenn sie fertig ist.',
            send: 'Senden'
        },
        successModal: {
            title: 'Danke!',
            desc: 'Wir werden Sie informieren, wenn die Mac-Version fertig ist.',
            close: 'Schließen'
        },
        faq: {
            title: 'Häufig gestellte Fragen',
            q1: 'Wie viel kostet die Anwendung?',
            a1: 'Live Subtitles funktioniert auf Abonnementbasis ab $7. Eine kostenlose Testphase ist verfügbar, damit Sie alle Funktionen der Anwendung testen können.',
            q2: 'Funktioniert es mit allen Anwendungen?',
            a2: 'Ja! Live Subtitles funktioniert mit absolut allen Anwendungen: YouTube, Netflix, Zoom, Teams, Discord, Browsern und sogar Spielen. Die Anwendung erfasst Audio auf Systemebene.',
            q3: 'Welche Sprachen werden unterstützt?',
            a3: 'Unterstützt 16+ Sprachen mit doppelter Untertitel-Anzeige: Englisch, Französisch, Spanisch, Deutsch, Italienisch, Japanisch, Koreanisch, Chinesisch (Vereinfacht/Traditionell), Arabisch, Hindi, Portugiesisch, Polnisch, Niederländisch, Türkisch, Russisch, Ukrainisch.',
            q4: 'Ist eine Internetverbindung erforderlich?',
            a4: 'Ja, eine stabile Internetverbindung ist für Spracherkennung und -übersetzung erforderlich. Die Anwendung verwendet Cloud-Services, um hohe Genauigkeit zu gewährleisten.',
            q5: 'Kann ich das Aussehen der Untertitel anpassen?',
            a5: 'Natürlich! Sie können Schriftgröße, Farbe, Untertitel-Position auf dem Bildschirm, Hintergrund-Transparenz anpassen und wählen, welche Sprachen angezeigt werden sollen.',
            q6: 'Gibt es eine Version für Mac oder mobile Geräte?',
            a6: 'Derzeit ist nur die Windows-Version verfügbar. Wir arbeiten aktiv an Versionen für Mac, iOS und Android. Hinterlassen Sie Ihre E-Mail und wir werden Sie über die Veröffentlichung informieren.'
        },
        testimonials: {
            title: 'Nutzerbewertungen',
            review1: '"Endlich kann ich koreanische Dramen ohne ständige Pausen schauen! Die App übersetzt sogar schnelle Sprache genau."',
            author1: 'Anna K.',
            role1: 'Lernt Koreanisch',
            review2: '"Eine Revolution für internationale Meetings! Ich muss Kollegen aus Indien und China nicht mehr bitten zu wiederholen."',
            author2: 'Michael R.',
            role2: 'IT-Manager',
            review3: '"Ich verwende es, um Englisch über YouTube zu lernen. Mein Wortschatz ist in einem Monat enorm gewachsen!"',
            author3: 'Elena S.',
            role3: 'Studentin',
            review4: '"Ich lerne Englisch, wo ich will - auf jeder Plattform! Ich schaue Netflix im Browser, höre Podcasts am Telefon, nehme an Meetings in Teams teil. Die App funktioniert absolut überall!"',
            author4: 'Alex M.',
            role4: 'Lernt Englisch',
            review5: '"Einfach einzurichten und funktioniert perfekt. Abonnement ab $7 hat sich nach dem ersten Arbeitsmeeting bezahlt gemacht."',
            author5: 'David P.',
            role5: 'Übersetzer'
        },
        download: {
            title: 'Probieren Sie es jetzt kostenlos aus',
            subtitle: 'Kostenlose Testphase, dann ab $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", de: "Willkommen in der Welt der doppelten Untertitel" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", de: "Zwei Sprachen, ein Bildschirm" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", de: "Lernen Sie Sprachen beim Filmeschauen" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", de: "Verstehen Sie fremde Sprache besser" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", de: "Erfassen Sie jedes Wort, ohne nachfragen zu müssen" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", de: "Verstehen Sie beim ersten Mal – kein Wiederholen nötig" }
        ]
    },
    'it-IT': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Funzioni',
            comparison: 'Confronto',
            download: 'Scaricare'
        },
        header: {
            title: 'Guarda i film, impara i linguaggi — capisci facilmente la parlata in diretta',
            lead: 'Live Subtitles: il tuo assistente con sottotitoli doppi, riconoscimento e traduzione vocale in tempo reale'
        },
        downloadBtn: 'Scarica da Microsoft Store',
        macBtn: 'Voglio la versione per Mac',
        platforms: {
            title: 'Funziona con qualsiasi applicazione — senza limiti'
        },
        features: {
            title: 'Funzioni',
            dualSubtitles: 'Sottotitoli doppi',
            dualSubtitlesDesc: 'Sul computer, in qualsiasi browser e lettore.',
            speechRecognition: 'Riconoscimento vocale',
            speechRecognitionDesc: 'Senza alcuna limitazione di piattaforma o applicazione.',
            realTimeTranslation: 'Traduzione in tempo reale',
            realTimeTranslationDesc: 'Guarda i film e partecipa alle chiamate capendo tutto immediatamente, senza dover chiedere di nuovo.',
            allApps: 'Funziona con tutte le applicazioni'
        },
        comparison: {
            title: 'Confronto',
            noSubtitles: {
                title: 'Senza sottotitoli',
                desc: 'Solo audio',
                point1: '❌ Difficile di cogliere parole sconosciute',
                point2: '❌ Ripetizioni frequenti',
                point3: '❌ Molta informazione persa',
                point4: '❌ Difficile capire l\'accento del locutore'
            },
            oneLanguage: {
                title: 'Una lingua',
                desc: 'Sottotitoli normali',
                point1: '✅ Il testo è visibile',
                point2: '✅ Aiuta a capire l\'accento',
                point3: '❌ I sottotitoli potrebbero non essere disponibili nell\'applicazione',
                point4: '❌ Nessuna traduzione',
                point5: '❌ Difficile imparare nuove parole'
            },
            twoLanguages: {
                title: 'Due lingue',
                desc: 'Sottotitoli doppi con Live Subtitles',
                point1: '✅ Traduzione istantanea',
                point2: '✅ Facile da capire qualsiasi accento',
                point3: '✅ Funziona con tutte le applicazioni',
                point4: '✅ Comprendimento al primo colpo — non è necessario chiedere di nuovo',
                point5: '✅ Rapido apprendimento di nuove parole'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Tutti i diritti riservati.',
            contact: 'Per qualsiasi domanda: ',
            email: 'help@2sub.ru',
            articles: 'Articoli'
        },
        title: 'Live Subtitles - Sottotitoli doppi per l\'apprendimento dei linguaggi',
        description: 'Live Subtitles — un\'applicazione con sottotitoli doppi, riconoscimento vocale e traduzione in tempo reale. Impara i linguaggi, guarda i film e capisci la parlata straniera senza sforzo.',
        download: 'Scaricare adesso',
        meta: {
            description: 'Live Subtitles — un\'applicazione con sottotitoli doppi, riconoscimento vocale e traduzione in tempo reale. Impara i linguaggi, guarda i film e capisci la parlata straniera senza sforzo.',
            keywords: 'sottotitoli doppi, sottotitoli per l\'apprendimento dei linguaggi, traduzione vocale, riconoscimento vocale, sottotitoli online, Live Subtitles, apprendimento dell\'inglese, apprendimento dei linguaggi, sottotitoli nel tempo, comprensione della parlata, traduttore di film'
        },
        downloadModal: {
            title: 'Avviso di download',
            warning: 'Durante il download del file, Windows potrebbe mostrare una finestra di dialogo di sicurezza. Questo è normale per le nuove applicazioni.',
            howToInstall: 'Come installare l\'applicazione:',
            step1: '1. Clicca su "Salva" durante il download',
            step2: '2. Dopo aver scaricato, clicca su "Esegui comunque"',
            step3: '3. Segui le istruzioni dell\'installatore',
            virusCheck: 'Puoi controllare il file per virus prima di installare:',
            checkVirus: 'Controlla su VirusTotal',
            download: 'Scaricare',
            cancel: 'Annullare'
        },
        macModal: {
            title: 'Versione per Mac',
            desc: 'Stiamo lavorando su una versione per Mac. Lascia il tuo indirizzo email e ti informeremo quando sarà pronta.',
            send: 'Invia'
        },
        successModal: {
            title: 'Grazie!',
            desc: 'Ti informeremo quando la versione per Mac sarà pronta.',
            close: 'Chiudere'
        },
        faq: {
            title: 'Domande frequenti',
            q1: 'Quanto costa l\'applicazione?',
            a1: 'Live Subtitles funziona in abbonamento a partire da $7. È disponibile un periodo di prova gratuito per testare tutte le funzionalità dell\'applicazione.',
            q2: 'Funziona con tutte le applicazioni?',
            a2: 'Sì! Live Subtitles funziona con assolutamente qualsiasi applicazione: YouTube, Netflix, Zoom, Teams, Discord, browser e persino giochi. L\'applicazione cattura l\'audio a livello di sistema.',
            q3: 'Quali lingue sono supportate?',
            a3: 'Supporta 16+ lingue con visualizzazione di sottotitoli doppi: inglese, francese, spagnolo, tedesco, italiano, giapponese, coreano, cinese (semplificato/tradizionale), arabo, hindi, portoghese, polacco, olandese, turco, russo, ucraino.',
            q4: 'È richiesta una connessione Internet?',
            a4: 'Sì, è richiesta una connessione Internet stabile per il riconoscimento e la traduzione vocale. L\'applicazione utilizza servizi cloud per garantire alta precisione.',
            q5: 'Posso personalizzare l\'aspetto dei sottotitoli?',
            a5: 'Certo! Puoi regolare la dimensione del carattere, il colore, la posizione dei sottotitoli sullo schermo, la trasparenza dello sfondo e scegliere quali lingue visualizzare.',
            q6: 'C\'è una versione per Mac o dispositivi mobili?',
            a6: 'Attualmente è disponibile solo la versione per Windows. Stiamo lavorando attivamente su versioni per Mac, iOS e Android. Lascia la tua email e ti avviseremo del rilascio.'
        },
        testimonials: {
            title: 'Recensioni degli utenti',
            review1: '"Finalmente posso guardare drama coreani senza pause costanti! L\'app traduce accuratamente anche il parlato veloce."',
            author1: 'Anna K.',
            role1: 'Impara il coreano',
            review2: '"Una rivoluzione per le riunioni internazionali! Non devo più chiedere ai colleghi di India e Cina di ripetere."',
            author2: 'Michael R.',
            role2: 'Manager IT',
            review3: '"Lo uso per imparare l\'inglese tramite YouTube. Il mio vocabolario è cresciuto enormemente in un mese!"',
            author3: 'Elena S.',
            role3: 'Studentessa',
            review4: '"Imparo l\'inglese dove voglio - su qualsiasi piattaforma! Guardo Netflix nel browser, ascolto podcast al telefono, partecipo a riunioni su Teams. L\'app funziona assolutamente ovunque!"',
            author4: 'Alex M.',
            role4: 'Impara l\'inglese',
            review5: '"Facile da configurare e funziona perfettamente. Abbonamento da $7 si è ripagato dopo la prima riunione di lavoro."',
            author5: 'David P.',
            role5: 'Traduttore'
        },
        download: {
            title: 'Provalo gratis ora',
            subtitle: 'Periodo di prova gratuito, poi da $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", it: "Benvenuto nel mondo dei sottotitoli doppi" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", it: "Due lingue, uno schermo" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", it: "Impara le lingue guardando film" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", it: "Comprendi meglio la lingua straniera" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", it: "Cattura ogni parola senza dover chiedere di nuovo" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", it: "Capisci al primo colpo — non serve ripetere" }
        ]
    },
    'ja-JP': {
        navbar: {
            brand: 'Live Subtitles',
            features: '機能',
            comparison: '比較',
            download: 'ダウンロード'
        },
        header: {
            title: '映画を見て、言語を学ぼう — ライブ音声を簡単に理解',
            lead: 'Live Subtitles - 二重字幕、音声認識、リアルタイム翻訳のアシスタント'
        },
        downloadBtn: 'Microsoft Storeからダウンロード',
        macBtn: 'Mac版が欲しい',
        platforms: {
            title: 'あらゆるアプリで動作 — 制限なし'
        },
        features: {
            title: '機能',
            dualSubtitles: '二重字幕',
            dualSubtitlesDesc: 'コンピューター上の任意のブラウザーとプレーヤーで。',
            speechRecognition: '音声認識',
            speechRecognitionDesc: 'プラットフォームやアプリケーションの制限なし。',
            realTimeTranslation: 'リアルタイム翻訳',
            realTimeTranslationDesc: '映画を見て通話に参加し、再度尋ねることなくすべてをすぐに理解。',
            allApps: 'すべてのアプリで動作'
        },
        comparison: {
            title: '比較',
            noSubtitles: {
                title: '字幕なし',
                desc: '音声のみ',
                point1: '❌ 知らない単語を聞き取るのが困難',
                point2: '❌ 頻繁な繰り返し',
                point3: '❌ 多くの情報を見逃す',
                point4: '❌ 話者のアクセントを理解するのが困難'
            },
            oneLanguage: {
                title: '一言語',
                desc: '通常の字幕',
                point1: '✅ テキストが見える',
                point2: '✅ アクセントの理解に役立つ',
                point3: '❌ アプリで字幕が利用できない場合がある',
                point4: '❌ 翻訳なし',
                point5: '❌ 新しい単語を学ぶのが困難'
            },
            twoLanguages: {
                title: '二言語',
                desc: 'Live Subtitlesによる二重字幕',
                point1: '✅ 瞬時翻訳',
                point2: '✅ あらゆるアクセントを簡単に理解',
                point3: '✅ すべてのアプリケーションで動作',
                point4: '✅ 一度で理解 — 再度尋ねる必要なし',
                point5: '✅ 新しい単語の高速学習'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. 無断転載禁止。',
            contact: 'お問い合わせ: ',
            email: 'help@2sub.ru',
            articles: '記事'
        },
        title: 'Live Subtitles - 語学学習のための二重字幕',
        description: 'Live Subtitles — 二重字幕、音声認識、リアルタイム翻訳を備えたアプリケーション。言語を学び、映画を見て、外国語を簡単に理解。',
        download: '今すぐダウンロード',
        meta: {
            description: 'Live Subtitles — 二重字幕、音声認識、リアルタイム翻訳を備えたアプリケーション。言語を学び、映画を見て、外国語を簡単に理解。',
            keywords: '二重字幕, 語学学習字幕, 音声翻訳, 音声認識, オンライン字幕, Live Subtitles, 英語学習, 語学学習, リアルタイム字幕, 音声理解, 映画翻訳者'
        },
        downloadModal: {
            title: 'ダウンロード通知',
            warning: 'ファイルをダウンロードする際、Windowsがセキュリティ警告を表示する場合があります。これは新しいアプリケーションでは正常です。',
            howToInstall: 'アプリケーションのインストール方法：',
            step1: '1. ダウンロード時に「保存」をクリック',
            step2: '2. ダウンロード後、「実行」をクリック',
            step3: '3. インストーラーの指示に従う',
            virusCheck: 'インストール前にファイルのウイルスチェックができます：',
            checkVirus: 'VirusTotalでチェック',
            download: 'ダウンロード',
            cancel: 'キャンセル'
        },
        macModal: {
            title: 'Mac版',
            desc: 'Mac版を開発中です。メールアドレスを残していただければ、準備ができ次第お知らせします。',
            send: '送信'
        },
        successModal: {
            title: 'ありがとうございます！',
            desc: 'Mac版の準備ができ次第お知らせします。',
            close: '閉じる'
        },
        faq: {
            title: 'よくある質問',
            q1: 'アプリの料金はいくらですか？',
            a1: 'Live Subtitlesはサブスクリプション方式で$7からです。すべての機能をテストできる無料トライアル期間があります。',
            q2: 'すべてのアプリケーションで動作しますか？',
            a2: 'はい！Live Subtitlesは絶対にすべてのアプリケーションで動作します：YouTube、Netflix、Zoom、Teams、Discord、ブラウザー、ゲームまで。アプリはシステムレベルで音声をキャプチャします。',
            q3: 'どの言語がサポートされていますか？',
            a3: '二重字幕表示で16+言語をサポート：英語、フランス語、スペイン語、ドイツ語、イタリア語、日本語、韓国語、中国語（簡体字/繁体字）、アラビア語、ヒンディー語、ポルトガル語、ポーランド語、オランダ語、トルコ語、ロシア語、ウクライナ語。',
            q4: 'インターネット接続は必要ですか？',
            a4: 'はい、音声認識と翻訳には安定したインターネット接続が必要です。アプリは高精度を保証するためにクラウドサービスを使用します。',
            q5: '字幕の外観をカスタマイズできますか？',
            a5: 'もちろんです！フォントサイズ、色、画面上の字幕位置、背景の透明度を調整し、表示する言語を選択できます。',
            q6: 'Macやモバイルデバイス版はありますか？',
            a6: '現在はWindows版のみ利用可能です。Mac、iOS、Android版を積極的に開発中です。メールアドレスを残していただければ、リリース時にお知らせします。'
        },
        testimonials: {
            title: 'ユーザーレビュー',
            review1: '"ついに韓国ドラマを一時停止なしで見られます！アプリは高速な会話も正確に翻訳します。"',
            author1: 'Anna K.',
            role1: '韓国語学習中',
            review2: '"国際会議の革命！インドや中国の同僚に繰り返しを求める必要がなくなりました。"',
            author2: 'Michael R.',
            role2: 'ITマネージャー',
            review3: '"YouTubeで英語学習に使用しています。1ヶ月で語彙が大幅に増えました！"',
            author3: 'Elena S.',
            role3: '学生',
            review4: '"どこでも英語学習 - あらゆるプラットフォームで！ブラウザーでNetflix、電話でポッドキャスト、Teamsで会議。アプリは本当にどこでも動作します！"',
            author4: 'Alex M.',
            role4: '英語学習中',
            review5: '"設定が簡単で完璧に動作。$7からのサブスクリプション - 最初の会議で元を取りました。"',
            author5: 'David P.',
            role5: '翻訳者'
        },
        download: {
            title: '今すぐ無料でお試し',
            subtitle: '無料トライアル期間、その後$7から'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", ja: "二重字幕の世界へようこそ" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", ja: "2つの言語、1つの画面" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", ja: "映画を見ながら言語を学ぶ" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", ja: "外国語をよりよく理解する" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", ja: "聞き返さずにすべての言葉をキャッチ" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", ja: "一度で理解—繰り返し不要" }
        ]
    },
    'ko-KR': {
        navbar: {
            brand: 'Live Subtitles',
            features: '기능',
            comparison: '비교',
            download: '다운로드'
        },
        header: {
            title: '영화 보기, 언어 배우기 — 실시간 음성을 쉽게 이해',
            lead: 'Live Subtitles - 이중 자막, 음성 인식 및 실시간 번역 어시스턴트'
        },
        downloadBtn: 'Microsoft Store에서 다운로드',
        macBtn: 'Mac 버전 원함',
        platforms: {
            title: '모든 앱에서 작동 — 제한 없음'
        },
        features: {
            title: '기능',
            dualSubtitles: '이중 자막',
            dualSubtitlesDesc: '컴퓨터에서 모든 브라우저와 플레이어에서.',
            speechRecognition: '음성 인식',
            speechRecognitionDesc: '플랫폼이나 앱 제한 없음.',
            realTimeTranslation: '실시간 번역',
            realTimeTranslationDesc: '영화를 보고 통화에 참여하여 다시 묻지 않고 모든 것을 즉시 이해.',
            allApps: '모든 앱에서 작동'
        },
        comparison: {
            title: '비교',
            noSubtitles: {
                title: '자막 없음',
                desc: '오디오만',
                point1: '❌ 익숙하지 않은 단어 듣기 어려움',
                point2: '❌ 빈번한 반복',
                point3: '❌ 많은 정보 놓침',
                point4: '❌ 화자의 억양 이해하기 어려움'
            },
            oneLanguage: {
                title: '한 언어',
                desc: '일반 자막',
                point1: '✅ 텍스트 보임',
                point2: '✅ 억양 이해에 도움',
                point3: '❌ 앱에서 자막을 사용할 수 없을 수 있음',
                point4: '❌ 번역 없음',
                point5: '❌ 새 단어 배우기 어려움'
            },
            twoLanguages: {
                title: '두 언어',
                desc: 'Live Subtitles로 이중 자막',
                point1: '✅ 즉시 번역',
                point2: '✅ 모든 억양 쉽게 이해',
                point3: '✅ 모든 애플리케이션에서 작동',
                point4: '✅ 첫 번째로 이해 — 다시 묻지 않아도 됨',
                point5: '✅ 새 단어 빠른 학습'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. 모든 권리 보유.',
            contact: '모든 질문: ',
            email: 'help@2sub.ru',
            articles: '기사'
        },
        title: 'Live Subtitles - 언어 학습을 위한 이중 자막',
        description: 'Live Subtitles — 이중 자막, 음성 인식 및 실시간 번역이 있는 애플리케이션. 언어를 배우고, 영화를 보고, 외국어를 쉽게 이해하세요.',
        download: '지금 다운로드',
        meta: {
            description: 'Live Subtitles — 이중 자막, 음성 인식 및 실시간 번역이 있는 애플리케이션. 언어를 배우고, 영화를 보고, 외국어를 쉽게 이해하세요.',
            keywords: '이중 자막, 언어 학습 자막, 음성 번역, 음성 인식, 온라인 자막, Live Subtitles, 영어 학습, 언어 학습, 실시간 자막, 음성 이해, 영화 번역기'
        },
        downloadModal: {
            title: '다운로드 알림',
            warning: '파일을 다운로드할 때 Windows가 보안 경고를 표시할 수 있습니다. 이는 새로운 애플리케이션에서 정상입니다.',
            howToInstall: '애플리케이션 설치 방법:',
            step1: '1. 다운로드할 때 "저장" 클릭',
            step2: '2. 다운로드 후 "실행" 클릭',
            step3: '3. 설치 관리자 지침 따르기',
            virusCheck: '설치하기 전에 바이러스 검사를 할 수 있습니다:',
            checkVirus: 'VirusTotal에서 확인',
            download: '다운로드',
            cancel: '취소'
        },
        macModal: {
            title: 'Mac 버전',
            desc: 'Mac 버전을 작업 중입니다. 이메일을 남겨주시면 준비되면 알려드리겠습니다.',
            send: '보내기'
        },
        successModal: {
            title: '감사합니다!',
            desc: 'Mac 버전이 준비되면 알려드리겠습니다.',
            close: '닫기'
        },
        faq: {
            title: '자주 묻는 질문',
            q1: '앱 비용은 얼마인가요?',
            a1: 'Live Subtitles는 구독 방식으로 $7부터 시작합니다. 모든 기능을 테스트할 수 있는 무료 평가판 기간이 있습니다.',
            q2: '모든 애플리케이션에서 작동하나요?',
            a2: '예! Live Subtitles는 절대적으로 모든 애플리케이션에서 작동합니다: YouTube, Netflix, Zoom, Teams, Discord, 브라우저 및 게임까지. 앱은 시스템 수준에서 오디오를 캡처합니다.',
            q3: '어떤 언어가 지원되나요?',
            a3: '이중 자막 표시로 16+ 언어 지원: 영어, 프랑스어, 스페인어, 독일어, 이탈리아어, 일본어, 한국어, 중국어(간체/번체), 아랍어, 힌디어, 포르투갈어, 폴란드어, 네덜란드어, 터키어, 러시아어, 우크라이나어.',
            q4: '인터넷 연결이 필요한가요?',
            a4: '예, 음성 인식 및 번역을 위해 안정적인 인터넷 연결이 필요합니다. 앱은 높은 정확도를 보장하기 위해 클라우드 서비스를 사용합니다.',
            q5: '자막 모양을 사용자 정의할 수 있나요?',
            a5: '물론입니다! 글꼴 크기, 색상, 화면의 자막 위치, 배경 투명도를 조정하고 표시할 언어를 선택할 수 있습니다.',
            q6: 'Mac이나 모바일 기기용 버전이 있나요?',
            a6: '현재 Windows 버전만 사용할 수 있습니다. Mac, iOS 및 Android 버전을 적극적으로 작업하고 있습니다. 이메일을 남겨주시면 출시를 알려드리겠습니다.'
        },
        testimonials: {
            title: '사용자 리뷰',
            review1: '"드디어 한국 드라마를 일시 정지 없이 볼 수 있습니다! 앱이 빠른 말도 정확하게 번역합니다."',
            author1: 'Anna K.',
            role1: '한국어 학습 중',
            review2: '"국제 회의의 혁명! 인도와 중국 동료들에게 반복을 요청할 필요가 없어졌습니다."',
            author2: 'Michael R.',
            role2: 'IT 매니저',
            review3: '"YouTube를 통해 영어를 배우는 데 사용합니다. 한 달 만에 어휘가 엄청나게 늘었습니다!"',
            author3: 'Elena S.',
            role3: '학생',
            review4: '"원하는 곳 어디서든 영어 학습 - 모든 플랫폼에서! 브라우저에서 Netflix 시청, 휴대폰에서 팟캐스트 청취, Teams에서 회의 참석. 앱이 정말 어디서든 작동합니다!"',
            author4: 'Alex M.',
            role4: '영어 학습 중',
            review5: '"설정이 간단하고 완벽하게 작동합니다. $7부터 구독 - 첫 번째 회의 후 바로 원가 회수했습니다."',
            author5: 'David P.',
            role5: '번역가'
        },
        download: {
            title: '지금 무료로 사용해보세요',
            subtitle: '무료 평가판 기간, 그 후 $7부터'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", ko: "이중 자막의 세계에 오신 것을 환영합니다" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", ko: "두 언어, 하나의 화면" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", ko: "영화를 보며 언어를 배우세요" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", ko: "외국어를 더 잘 이해하세요" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", ko: "다시 묻지 않고 모든 단어를 포착하세요" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", ko: "한 번에 이해—반복 불필요" }
        ]
    },
    'zh-CN': {
        navbar: {
            brand: 'Live Subtitles',
            features: '功能',
            comparison: '对比',
            download: '下载'
        },
        header: {
            title: '看电影，学语言 — 轻松理解实时语音',
            lead: 'Live Subtitles - 您的双字幕、语音识别和实时翻译助手'
        },
        downloadBtn: '从微软商店下载',
        macBtn: '需要Mac版本',
        platforms: {
            title: '适用于任何应用 — 无限制'
        },
        features: {
            title: '功能',
            dualSubtitles: '双字幕',
            dualSubtitlesDesc: '在电脑上任何浏览器和播放器中。',
            speechRecognition: '语音识别',
            speechRecognitionDesc: '无平台或应用限制。',
            realTimeTranslation: '实时翻译',
            realTimeTranslationDesc: '观看电影和参与通话，立即理解一切，无需重复询问。',
            allApps: '适用于所有应用'
        },
        comparison: {
            title: '对比',
            noSubtitles: {
                title: '无字幕',
                desc: '仅音频',
                point1: '❌ 难以听懂陌生词汇',
                point2: '❌ 频繁重复',
                point3: '❌ 大量信息遗漏',
                point4: '❌ 难以理解说话者口音'
            },
            oneLanguage: {
                title: '单语言',
                desc: '普通字幕',
                point1: '✅ 文本可见',
                point2: '✅ 有助于理解口音',
                point3: '❌ 应用中可能没有字幕',
                point4: '❌ 无翻译',
                point5: '❌ 难以学习新词汇'
            },
            twoLanguages: {
                title: '双语言',
                desc: 'Live Subtitles双字幕',
                point1: '✅ 即时翻译',
                point2: '✅ 轻松理解任何口音',
                point3: '✅ 适用于所有应用程序',
                point4: '✅ 一次理解 — 无需重复询问',
                point5: '✅ 快速学习新词汇'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. 保留所有权利。',
            contact: '有任何问题：',
            email: 'help@2sub.ru',
            articles: '文章'
        },
        title: 'Live Subtitles - 语言学习双字幕',
        description: 'Live Subtitles — 配备双字幕、语音识别和实时翻译的应用程序。学习语言，观看电影，轻松理解外语。',
        download: '立即下载',
        meta: {
            description: 'Live Subtitles — 配备双字幕、语音识别和实时翻译的应用程序。学习语言，观看电影，轻松理解外语。',
            keywords: '双字幕, 语言学习字幕, 语音翻译, 语音识别, 在线字幕, Live Subtitles, 英语学习, 语言学习, 实时字幕, 语音理解, 电影翻译器'
        },
        downloadModal: {
            title: '下载提醒',
            warning: '下载文件时，Windows可能会显示安全警告。这对于新应用程序是正常的。',
            howToInstall: '如何安装应用程序：',
            step1: '1. 下载时点击"保存"',
            step2: '2. 下载后点击"运行"',
            step3: '3. 按照安装程序说明操作',
            virusCheck: '安装前可以检查文件是否有病毒：',
            checkVirus: '在VirusTotal上检查',
            download: '下载',
            cancel: '取消'
        },
        macModal: {
            title: 'Mac版本',
            desc: '我们正在开发Mac版本。请留下您的邮箱，准备好后我们会通知您。',
            send: '发送'
        },
        successModal: {
            title: '谢谢！',
            desc: 'Mac版本准备好后我们会通知您。',
            close: '关闭'
        },
        faq: {
            title: '常见问题',
            q1: '应用程序的费用是多少？',
            a1: 'Live Subtitles订阅制从$7起。提供免费试用期，供您测试所有应用功能。',
            q2: '是否适用于所有应用程序？',
            a2: '是的！Live Subtitles绝对适用于所有应用程序：YouTube、Netflix、Zoom、Teams、Discord、浏览器甚至游戏。应用程序在系统级别捕获音频。',
            q3: '支持哪些语言？',
            a3: '支持16+种语言的双字幕显示：英语、法语、西班牙语、德语、意大利语、日语、韩语、中文（简体/繁体）、阿拉伯语、印地语、葡萄牙语、波兰语、荷兰语、土耳其语、俄语、乌克兰语。',
            q4: '是否需要互联网连接？',
            a4: '是的，语音识别和翻译需要稳定的互联网连接。应用程序使用云服务确保高准确性。',
            q5: '我可以自定义字幕外观吗？',
            a5: '当然可以！您可以调整字体大小、颜色、屏幕上的字幕位置、背景透明度并选择要显示的语言。',
            q6: '有Mac或移动设备版本吗？',
            a6: '目前仅提供Windows版本。我们正在积极开发Mac、iOS和Android版本。请留下您的邮箱，我们会通知您发布消息。'
        },
        testimonials: {
            title: '用户评价',
            review1: '"终于可以不暂停地看韩剧了！应用程序能准确翻译快速对话。"',
            author1: 'Anna K.',
            role1: '正在学习韩语',
            review2: '"国际会议的革命！不再需要要求印度和中国同事重复。"',
            author2: 'Michael R.',
            role2: 'IT经理',
            review3: '"我用它通过YouTube学习英语。一个月内词汇量大幅增长！"',
            author3: 'Elena S.',
            role3: '学生',
            review4: '"我随时随地学习英语 - 在任何平台上！在浏览器看Netflix，手机听播客，Teams参加会议。应用程序真的到处都能用！"',
            author4: 'Alex M.',
            role4: '正在学习英语',
            review5: '"设置简单，运行完美。从$7订阅 - 第一次工作会议后就回本了。"',
            author5: 'David P.',
            role5: '翻译员'
        },
        download: {
            title: '立即免费试用',
            subtitle: '免费试用期，然后从$7起'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", zh: "欢迎来到双字幕的世界" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", zh: "两种语言，一块屏幕" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", zh: "通过看电影学习语言" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", zh: "更好地理解外语" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", zh: "无需重复即可捕捉每个单词" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", zh: "一次就能理解—无需重复" }
        ]
    },
    'ar-SA': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'الميزات',
            comparison: 'مقارنة',
            download: 'تحميل'
        },
        header: {
            title: 'شاهد الأفلام، تعلم اللغات — افهم الكلام المباشر بسهولة',
            lead: 'Live Subtitles - مساعدك مع الترجمة المزدوجة، التعرف على الكلام والترجمة الفورية'
        },
        downloadBtn: 'تحميل من متجر مايكروسوفت',
        macBtn: 'أريد إصدار Mac',
        platforms: {
            title: 'يعمل مع أي تطبيق — بلا حدود'
        },
        features: {
            title: 'الميزات',
            dualSubtitles: 'ترجمة مزدوجة',
            dualSubtitlesDesc: 'على الكمبيوتر، في أي متصفح ومشغل.',
            speechRecognition: 'التعرف على الكلام',
            speechRecognitionDesc: 'بدون قيود على النظام أو التطبيق.',
            realTimeTranslation: 'ترجمة فورية',
            realTimeTranslationDesc: 'شاهد الأفلام وشارك في المكالمات مع فهم فوري لكل شيء، بدون إعادة السؤال.',
            allApps: 'يعمل مع جميع التطبيقات'
        },
        comparison: {
            title: 'مقارنة',
            noSubtitles: {
                title: 'بدون ترجمة',
                desc: 'صوت فقط',
                point1: '❌ صعوبة في فهم الكلمات غير المألوفة',
                point2: '❌ تكرار متكرر',
                point3: '❌ فقدان الكثير من المعلومات',
                point4: '❌ صعوبة في فهم لهجة المتحدث'
            },
            oneLanguage: {
                title: 'لغة واحدة',
                desc: 'ترجمة عادية',
                point1: '✅ النص مرئي',
                point2: '✅ يساعد في فهم اللهجة',
                point3: '❌ قد لا تكون الترجمة متاحة في التطبيق',
                point4: '❌ لا توجد ترجمة',
                point5: '❌ صعوبة في تعلم كلمات جديدة'
            },
            twoLanguages: {
                title: 'لغتان',
                desc: 'ترجمة مزدوجة مع Live Subtitles',
                point1: '✅ ترجمة فورية',
                point2: '✅ فهم سهل لأي لهجة',
                point3: '✅ يعمل مع جميع التطبيقات',
                point4: '✅ فهم من المرة الأولى — لا حاجة لإعادة السؤال',
                point5: '✅ تعلم سريع للكلمات الجديدة'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. جميع الحقوق محفوظة.',
            contact: 'لأي أسئلة: ',
            email: 'help@2sub.ru',
            articles: 'مقالات'
        },
        title: 'Live Subtitles - ترجمة مزدوجة لتعلم اللغات',
        description: 'Live Subtitles — تطبيق مع ترجمة مزدوجة، التعرف على الكلام والترجمة الفورية. تعلم اللغات، شاهد الأفلام وافهم اللغات الأجنبية بسهولة.',
        download: 'حمل الآن',
        meta: {
            description: 'Live Subtitles — تطبيق مع ترجمة مزدوجة، التعرف على الكلام والترجمة الفورية. تعلم اللغات، شاهد الأفلام وافهم اللغات الأجنبية بسهولة.',
            keywords: 'ترجمة مزدوجة, ترجمة لتعلم اللغات, ترجمة الكلام, التعرف على الكلام, ترجمة أونلاين, Live Subtitles, تعلم الإنجليزية, تعلم اللغات, ترجمة فورية, فهم الكلام, مترجم أفلام'
        },
        downloadModal: {
            title: 'تنبيه التحميل',
            warning: 'عند تحميل الملف، قد يعرض Windows تحذير أمني. هذا طبيعي للتطبيقات الجديدة.',
            howToInstall: 'كيفية تثبيت التطبيق:',
            step1: '1. انقر "حفظ" عند التحميل',
            step2: '2. بعد التحميل، انقر "تشغيل"',
            step3: '3. اتبع تعليمات المثبت',
            virusCheck: 'يمكنك فحص الملف للفيروسات قبل التثبيت:',
            checkVirus: 'فحص على VirusTotal',
            download: 'تحميل',
            cancel: 'إلغاء'
        },
        macModal: {
            title: 'إصدار Mac',
            desc: 'نحن نعمل على إصدار Mac. اترك بريدك الإلكتروني وسنخبرك عندما يصبح جاهزاً.',
            send: 'إرسال'
        },
        successModal: {
            title: 'شكراً لك!',
            desc: 'سنخبرك عندما يصبح إصدار Mac جاهزاً.',
            close: 'إغلاق'
        },
        faq: {
            title: 'الأسئلة الشائعة',
            q1: 'كم تكلفة التطبيق؟',
            a1: 'Live Subtitles يعمل على أساس الاشتراك من $7. تتوفر فترة تجريبية مجانية حتى تتمكن من اختبار جميع ميزات التطبيق.',
            q2: 'هل يعمل مع جميع التطبيقات؟',
            a2: 'نعم! Live Subtitles يعمل مع جميع التطبيقات تماماً: YouTube، Netflix، Zoom، Teams، Discord، المتصفحات وحتى الألعاب. التطبيق يلتقط الصوت على مستوى النظام.',
            q3: 'ما هي اللغات المدعومة؟',
            a3: 'يدعم 16+ لغة مع عرض ترجمة مزدوجة: الإنجليزية، الفرنسية، الإسبانية، الألمانية، الإيطالية، اليابانية، الكورية، الصينية (المبسطة/التقليدية)، العربية، الهندية، البرتغالية، البولندية، الهولندية، التركية، الروسية، الأوكرانية.',
            q4: 'هل يتطلب اتصال بالإنترنت؟',
            a4: 'نعم، يتطلب اتصال مستقر بالإنترنت للتعرف على الكلام والترجمة. التطبيق يستخدم خدمات سحابية لضمان الدقة العالية.',
            q5: 'هل يمكنني تخصيص مظهر الترجمة؟',
            a5: 'بالطبع! يمكنك ضبط حجم الخط، اللون، موضع الترجمة على الشاشة، شفافية الخلفية واختيار اللغات المراد عرضها.',
            q6: 'هل يوجد إصدار لـ Mac أو الأجهزة المحمولة؟',
            a6: 'حالياً متوفر إصدار Windows فقط. نحن نعمل بنشاط على إصدارات Mac و iOS و Android. اترك بريدك الإلكتروني وسنخبرك بالإطلاق.'
        },
        testimonials: {
            title: 'تقييمات المستخدمين',
            review1: '"أخيراً يمكنني مشاهدة الدراما الكورية بدون توقف مستمر! التطبيق يترجم حتى الكلام السريع بدقة."',
            author1: 'Anna K.',
            role1: 'تتعلم الكورية',
            review2: '"ثورة في الاجتماعات الدولية! لم أعد بحاجة لطلب الإعادة من زملائي من الهند والصين."',
            author2: 'Michael R.',
            role2: 'مدير تقنية المعلومات',
            review3: '"أستخدمه لتعلم الإنجليزية من خلال YouTube. مفرداتي نمت بشكل هائل في شهر واحد!"',
            author3: 'Elena S.',
            role3: 'طالبة',
            review4: '"أتعلم الإنجليزية حيث أريد - على أي منصة! أشاهد Netflix في المتصفح، أستمع للبودكاست على الهاتف، أحضر اجتماعات في Teams. التطبيق يعمل فعلاً في كل مكان!"',
            author4: 'Alex M.',
            role4: 'يتعلم الإنجليزية',
            review5: '"سهل الإعداد ويعمل بشكل مثالي. الاشتراك من $7 استرد قيمته بعد أول اجتماع عمل."',
            author5: 'David P.',
            role5: 'مترجم'
        },
        download: {
            title: 'جرب مجاناً الآن',
            subtitle: 'فترة تجريبية مجانية، ثم من $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", ar: "مرحبًا بك في عالم الترجمة المزدوجة" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", ar: "لغتان، شاشة واحدة" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", ar: "تعلم اللغات أثناء مشاهدة الأفلام" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", ar: "افهم الكلام الأجنبي بشكل أفضل" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", ar: "التقط كل كلمة دون الحاجة للسؤال مرة أخرى" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", ar: "افهم من المرة الأولى — لا حاجة للتكرار" }
        ]
    },
    'hi-IN': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'सुविधाएं',
            comparison: 'तुलना',
            download: 'डाउनलोड'
        },
        header: {
            title: 'फिल्में देखें, भाषाएं सीखें — लाइव स्पीच को आसानी से समझें',
            lead: 'Live Subtitles - दोहरे सबटाइटल, स्पीच रिकग्निशन और रियल-टाइम ट्रांसलेशन के साथ आपका सहायक'
        },
        downloadBtn: 'Microsoft Store से डाउनलोड करें',
        macBtn: 'Mac संस्करण चाहिए',
        platforms: {
            title: 'किसी भी ऐप के साथ काम करता है — कोई सीमा नहीं'
        },
        features: {
            title: 'सुविधाएं',
            dualSubtitles: 'दोहरे सबटाइटल',
            dualSubtitlesDesc: 'कंप्यूटर पर, किसी भी ब्राउज़र और प्लेयर में।',
            speechRecognition: 'स्पीच रिकग्निशन',
            speechRecognitionDesc: 'प्लेटफॉर्म या ऐप की कोई सीमा नहीं।',
            realTimeTranslation: 'रियल-टाइम ट्रांसलेशन',
            realTimeTranslationDesc: 'फिल्में देखें और कॉल में भाग लें, बिना दोबारा पूछे सब कुछ तुरंत समझें।',
            allApps: 'सभी ऐप्स के साथ काम करता है'
        },
        comparison: {
            title: 'तुलना',
            noSubtitles: {
                title: 'बिना सबटाइटल',
                desc: 'केवल ऑडियो',
                point1: '❌ अपरिचित शब्दों को सुनना कठिन',
                point2: '❌ बार-बार दोहराना',
                point3: '❌ बहुत सी जानकारी छूट जाना',
                point4: '❌ बोलने वाले के उच्चारण को समझना कठिन'
            },
            oneLanguage: {
                title: 'एक भाषा',
                desc: 'सामान्य सबटाइटल',
                point1: '✅ टेक्स्ट दिखाई देता है',
                point2: '✅ उच्चारण समझने में मदद मिलती है',
                point3: '❌ ऐप में सबटाइटल उपलब्ध नहीं हो सकते',
                point4: '❌ कोई अनुवाद नहीं',
                point5: '❌ नए शब्द सीखना कठिन'
            },
            twoLanguages: {
                title: 'दो भाषाएं',
                desc: 'Live Subtitles के साथ दोहरे सबटाइटल',
                point1: '✅ तुरंत अनुवाद',
                point2: '✅ किसी भी उच्चारण को आसानी से समझना',
                point3: '✅ सभी एप्लिकेशन के साथ काम करता है',
                point4: '✅ पहली बार में समझना — दोबारा पूछने की जरूरत नहीं',
                point5: '✅ नए शब्दों की तेज़ सीखना'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. सभी अधिकार सुरक्षित।',
            contact: 'किसी भी प्रश्न के लिए: ',
            email: 'help@2sub.ru',
            articles: 'लेख'
        },
        title: 'Live Subtitles - भाषा सीखने के लिए दोहरे सबटाइटल',
        description: 'Live Subtitles — दोहरे सबटाइटल, स्पीच रिकग्निशन और रियल-टाइम ट्रांसलेशन के साथ एप्लिकेशन। भाषाएं सीखें, फिल्में देखें और विदेशी भाषा को आसानी से समझें।',
        download: 'अभी डाउनलोड करें',
        meta: {
            description: 'Live Subtitles — दोहरे सबटाइटल, स्पीच रिकग्निशन और रियल-टाइम ट्रांसलेशन के साथ एप्लिकेशन। भाषाएं सीखें, फिल्में देखें और विदेशी भाषा को आसानी से समझें।',
            keywords: 'दोहरे सबटाइटल, भाषा सीखने के लिए सबटाइटल, स्पीच ट्रांसलेशन, स्पीच रिकग्निशन, ऑनलाइन सबटाइटल, Live Subtitles, अंग्रेजी सीखना, भाषा सीखना, रियल-टाइम सबटाइटल, स्पीच समझना, मूवी ट्रांसलेटर'
        },
        downloadModal: {
            title: 'डाउनलोड सूचना',
            warning: 'फ़ाइल डाउनलोड करते समय, Windows सुरक्षा चेतावनी दिखा सकता है। यह नए एप्लिकेशन के लिए सामान्य है।',
            howToInstall: 'एप्लिकेशन कैसे इंस्टॉल करें:',
            step1: '1. डाउनलोड करते समय "सेव" पर क्लिक करें',
            step2: '2. डाउनलोड के बाद "रन" पर क्लिक करें',
            step3: '3. इंस्टॉलर निर्देशों का पालन करें',
            virusCheck: 'इंस्टॉल करने से पहले आप फ़ाइल को वायरस के लिए चेक कर सकते हैं:',
            checkVirus: 'VirusTotal पर चेक करें',
            download: 'डाउनलोड',
            cancel: 'रद्द करें'
        },
        macModal: {
            title: 'Mac संस्करण',
            desc: 'हम Mac संस्करण पर काम कर रहे हैं। अपना ईमेल छोड़ें और जब तैयार हो जाएगा तो हम आपको बताएंगे।',
            send: 'भेजें'
        },
        successModal: {
            title: 'धन्यवाद!',
            desc: 'Mac संस्करण तैयार होने पर हम आपको बताएंगे।',
            close: 'बंद करें'
        },
        faq: {
            title: 'अक्सर पूछे जाने वाले प्रश्न',
            q1: 'ऐप की लागत कितनी है?',
            a1: 'Live Subtitles सदस्यता आधार पर $7 से काम करता है। सभी ऐप सुविधाओं का परीक्षण करने के लिए एक निःशुल्क परीक्षण अवधि उपलब्ध है।',
            q2: 'क्या यह सभी एप्लिकेशन के साथ काम करता है?',
            a2: 'हां! Live Subtitles बिल्कुल सभी एप्लिकेशन के साथ काम करता है: YouTube, Netflix, Zoom, Teams, Discord, ब्राउज़र और यहां तक कि गेम भी। ऐप सिस्टम स्तर पर ऑडियो कैप्चर करता है।',
            q3: 'कौन सी भाषाएं समर्थित हैं?',
            a3: 'दोहरे सबटाइटल डिस्प्ले के साथ 16+ भाषाओं का समर्थन: अंग्रेजी, फ्रेंच, स्पेनिश, जर्मन, इतालवी, जापानी, कोरियाई, चीनी (सरलीकृत/पारंपरिक), अरबी, हिंदी, पुर्तगाली, पोलिश, डच, तुर्की, रूसी, यूक्रेनी।',
            q4: 'क्या इंटरनेट कनेक्शन आवश्यक है?',
            a4: 'हां, स्पीच रिकग्निशन और ट्रांसलेशन के लिए स्थिर इंटरनेट कनेक्शन आवश्यक है। ऐप उच्च सटीकता सुनिश्चित करने के लिए क्लाउड सेवाओं का उपयोग करता है।',
            q5: 'क्या मैं सबटाइटल की उपस्थिति को कस्टमाइज़ कर सकता हूं?',
            a5: 'बिल्कुल! आप फ़ॉन्ट साइज़, रंग, स्क्रीन पर सबटाइटल की स्थिति, बैकग्राउंड पारदर्शिता समायोजित कर सकते हैं और प्रदर्शित करने के लिए भाषाएं चुन सकते हैं।',
            q6: 'क्या Mac या मोबाइल डिवाइस के लिए संस्करण है?',
            a6: 'वर्तमान में केवल Windows संस्करण उपलब्ध है। हम Mac, iOS और Android संस्करणों पर सक्रिय रूप से काम कर रहे हैं। अपना ईमेल छोड़ें और हम रिलीज़ की सूचना देंगे।'
        },
        testimonials: {
            title: 'उपयोगकर्ता समीक्षाएं',
            review1: '"आखिरकार मैं कोरियाई ड्रामा बिना रुके देख सकता हूं! ऐप तेज़ बातचीत का भी सटीक अनुवाद करता है।"',
            author1: 'Anna K.',
            role1: 'कोरियाई सीख रही है',
            review2: '"अंतरराष्ट्रीय मीटिंग्स में क्रांति! अब मुझे भारत और चीन के सहयोगियों से दोहराने को नहीं कहना पड़ता।"',
            author2: 'Michael R.',
            role2: 'IT मैनेजर',
            review3: '"मैं YouTube के माध्यम से अंग्रेजी सीखने के लिए इसका उपयोग करता हूं। एक महीने में मेरी शब्दावली बेहद बढ़ गई!"',
            author3: 'Elena S.',
            role3: 'छात्रा',
            review4: '"मैं जहां चाहूं अंग्रेजी सीखता हूं - किसी भी प्लेटफॉर्म पर! ब्राउज़र में Netflix देखता हूं, फोन पर पॉडकास्ट सुनता हूं, Teams में मीटिंग्स अटेंड करता हूं। ऐप वाकई हर जगह काम करता है!"',
            author4: 'Alex M.',
            role4: 'अंग्रेजी सीख रहा है',
            review5: '"सेटअप आसान है और बिल्कुल सही काम करता है। $7 से सदस्यता - पहली कार्य मीटिंग के बाद ही वसूल हो गया।"',
            author5: 'David P.',
            role5: 'अनुवादक'
        },
        download: {
            title: 'अभी मुफ्त में आज़माएं',
            subtitle: 'निःशुल्क परीक्षण अवधि, फिर $7 से'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", hi: "ड्यूल सबटाइटल्स की दुनिया में आपका स्वागत है" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", hi: "दो भाषाएँ, एक स्क्रीन" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", hi: "फिल्में देखते हुए भाषाएँ सीखें" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", hi: "विदेशी भाषा को बेहतर समझें" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", hi: "बिना दोहराए हर शब्द पकड़ें" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", hi: "पहली बार में समझें — दोहराने की जरूरत नहीं" }
        ]
    },
    'pt-BR': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Recursos',
            comparison: 'Comparação',
            download: 'Download'
        },
        header: {
            title: 'Assista filmes, aprenda idiomas — entenda a fala ao vivo facilmente',
            lead: 'Live Subtitles - seu assistente com duplas legendas, reconhecimento de fala e tradução em tempo real'
        },
        downloadBtn: 'Baixar da Microsoft Store',
        macBtn: 'Quero versão Mac',
        platforms: {
            title: 'Funciona com qualquer app — sem limitações'
        },
        features: {
            title: 'Recursos',
            dualSubtitles: 'Duplas legendas',
            dualSubtitlesDesc: 'No computador, em qualquer navegador e player.',
            speechRecognition: 'Reconhecimento de fala',
            speechRecognitionDesc: 'Sem limitações de plataforma ou aplicativo.',
            realTimeTranslation: 'Tradução em tempo real',
            realTimeTranslationDesc: 'Assista filmes e participe de chamadas com compreensão instantânea de tudo, sem precisar perguntar novamente.',
            allApps: 'Funciona com todos os apps'
        },
        comparison: {
            title: 'Comparação',
            noSubtitles: {
                title: 'Sem legendas',
                desc: 'Apenas áudio',
                point1: '❌ Difícil ouvir palavras desconhecidas',
                point2: '❌ Repetição frequente',
                point3: '❌ Perda de muita informação',
                point4: '❌ Difícil entender o sotaque do falante'
            },
            oneLanguage: {
                title: 'Um idioma',
                desc: 'Legendas normais',
                point1: '✅ Texto visível',
                point2: '✅ Ajuda a entender sotaque',
                point3: '❌ Legendas podem não estar disponíveis no app',
                point4: '❌ Sem tradução',
                point5: '❌ Difícil aprender palavras novas'
            },
            twoLanguages: {
                title: 'Dois idiomas',
                desc: 'Duplas legendas com Live Subtitles',
                point1: '✅ Tradução instantânea',
                point2: '✅ Entenda qualquer sotaque facilmente',
                point3: '✅ Funciona com todas as aplicações',
                point4: '✅ Entenda de primeira — sem precisar perguntar novamente',
                point5: '✅ Aprendizado rápido de palavras novas'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Todos os direitos reservados.',
            contact: 'Para qualquer dúvida: ',
            email: 'help@2sub.ru',
            articles: 'Artigos'
        },
        title: 'Live Subtitles - duplas legendas para aprendizado de idiomas',
        description: 'Live Subtitles — aplicativo com duplas legendas, reconhecimento de fala e tradução em tempo real. Aprenda idiomas, assista filmes e entenda idiomas estrangeiros facilmente.',
        download: 'Baixar agora',
        meta: {
            description: 'Live Subtitles — aplicativo com duplas legendas, reconhecimento de fala e tradução em tempo real. Aprenda idiomas, assista filmes e entenda idiomas estrangeiros facilmente.',
            keywords: 'duplas legendas, legendas para aprendizado de idiomas, tradução de fala, reconhecimento de fala, legendas online, Live Subtitles, aprender inglês, aprendizado de idiomas, legendas em tempo real, compreensão da fala, tradutor de filmes'
        },
        downloadModal: {
            title: 'Alerta de Download',
            warning: 'Ao baixar o arquivo, o Windows pode mostrar um aviso de segurança. Isso é normal para aplicações novas.',
            howToInstall: 'Como instalar a aplicação:',
            step1: '1. Clique em "Salvar" ao baixar',
            step2: '2. Após o download, clique em "Executar"',
            step3: '3. Siga as instruções do instalador',
            virusCheck: 'Você pode verificar o arquivo em busca de vírus antes de instalar:',
            checkVirus: 'Verificar no VirusTotal',
            download: 'Download',
            cancel: 'Cancelar'
        },
        macModal: {
            title: 'Versão Mac',
            desc: 'Estamos trabalhando na versão Mac. Deixe seu email e avisaremos quando estiver pronta.',
            send: 'Enviar'
        },
        successModal: {
            title: 'Obrigado!',
            desc: 'Avisaremos quando a versão Mac estiver pronta.',
            close: 'Fechar'
        },
        faq: {
            title: 'Perguntas Frequentes',
            q1: 'Quanto custa o app?',
            a1: 'Live Subtitles funciona em assinatura a partir de $7. Um período de avaliação gratuito está disponível para que você possa testar todos os recursos do app.',
            q2: 'Funciona com todas as aplicações?',
            a2: 'Sim! Live Subtitles funciona absolutamente com todas as aplicações: YouTube, Netflix, Zoom, Teams, Discord, navegadores e até jogos. O app captura áudio no nível do sistema.',
            q3: 'Quais idiomas são suportados?',
            a3: 'Suporte a 16+ idiomas com exibição de duplas legendas: inglês, francês, espanhol, alemão, italiano, japonês, coreano, chinês (simplificado/tradicional), árabe, hindi, português, polonês, holandês, turco, russo, ucraniano.',
            q4: 'É necessária conexão com a internet?',
            a4: 'Sim, é necessária uma conexão estável com a internet para reconhecimento de fala e tradução. O app usa serviços na nuvem para garantir alta precisão.',
            q5: 'Posso personalizar a aparência das legendas?',
            a5: 'Claro! Você pode ajustar o tamanho da fonte, cor, posição das legendas na tela, transparência do fundo e escolher quais idiomas exibir.',
            q6: 'Há versão para Mac ou dispositivos móveis?',
            a6: 'Atualmente apenas a versão Windows está disponível. Estamos trabalhando ativamente nas versões Mac, iOS e Android. Deixe seu email e avisaremos sobre o lançamento.'
        },
        testimonials: {
            title: 'Avaliações dos Usuários',
            review1: '"Finalmente posso assistir doramas coreanos sem pausar constantemente! O app traduz até falas rápidas com precisão."',
            author1: 'Anna K.',
            role1: 'Aprendendo coreano',
            review2: '"Revolução em reuniões internacionais! Não preciso mais pedir repetição aos colegas da Índia e China."',
            author2: 'Michael R.',
            role2: 'Gerente de TI',
            review3: '"Uso para aprender inglês através do YouTube. Meu vocabulário cresceu enormemente em um mês!"',
            author3: 'Elena S.',
            role3: 'Estudante',
            review4: '"Aprendo inglês onde quero - em qualquer plataforma! Assisto Netflix no navegador, escuto podcasts no telefone, participo de reuniões no Teams. O app realmente funciona em todos os lugares!"',
            author4: 'Alex M.',
            role4: 'Aprendendo inglês',
            review5: '"Configuração simples e funciona perfeitamente. Assinatura a partir de $7 recuperei o valor após a primeira reunião de trabalho."',
            author5: 'David P.',
            role5: 'Tradutor'
        },
        download: {
            title: 'Experimente grátis agora',
            subtitle: 'Período de avaliação gratuito, depois a partir de $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", pt: "Bem-vindo ao mundo das legendas duplas" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", pt: "Dois idiomas, uma tela" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", pt: "Aprenda idiomas assistindo a filmes" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", pt: "Compreenda melhor a fala estrangeira" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", pt: "Capte cada palavra sem precisar perguntar novamente" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", pt: "Entenda de primeira — não precisa repetir" }
        ]
    },
    'pl-PL': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Funkcje',
            comparison: 'Porównanie',
            download: 'Pobierz'
        },
        header: {
            title: 'Oglądaj filmy, ucz się języków — łatwo rozumiej żywą mowę',
            lead: 'Live Subtitles - twój asystent z podwójnymi napisami, rozpoznawaniem mowy i tłumaczeniem w czasie rzeczywistym'
        },
        downloadBtn: 'Pobierz z Microsoft Store',
        macBtn: 'Chcę wersję na Mac',
        platforms: {
            title: 'Działa z każdą aplikacją — bez ograniczeń'
        },
        features: {
            title: 'Funkcje',
            dualSubtitles: 'Podwójne napisy',
            dualSubtitlesDesc: 'Na komputerze, w każdej przeglądarce i odtwarzaczu.',
            speechRecognition: 'Rozpoznawanie mowy',
            speechRecognitionDesc: 'Bez ograniczeń platformy czy aplikacji.',
            realTimeTranslation: 'Tłumaczenie w czasie rzeczywistym',
            realTimeTranslationDesc: 'Oglądaj filmy i uczestnicz w rozmowach z natychmiastowym zrozumieniem wszystkiego, bez ponownego pytania.',
            allApps: 'Działa ze wszystkimi aplikacjami'
        },
        comparison: {
            title: 'Porównanie',
            noSubtitles: {
                title: 'Bez napisów',
                desc: 'Tylko dźwięk',
                point1: '❌ Trudno słyszeć nieznane słowa',
                point2: '❌ Częste powtarzanie',
                point3: '❌ Utrata wielu informacji',
                point4: '❌ Trudno zrozumieć akcent mówiącego'
            },
            oneLanguage: {
                title: 'Jeden język',
                desc: 'Zwykłe napisy',
                point1: '✅ Tekst jest widoczny',
                point2: '✅ Pomaga zrozumieć akcent',
                point3: '❌ Napisy mogą być niedostępne w aplikacji',
                point4: '❌ Brak tłumaczenia',
                point5: '❌ Trudno uczyć się nowych słów'
            },
            twoLanguages: {
                title: 'Dwa języki',
                desc: 'Podwójne napisy z Live Subtitles',
                point1: '✅ Natychmiastowe tłumaczenie',
                point2: '✅ Łatwo zrozumieć każdy akcent',
                point3: '✅ Działa ze wszystkimi aplikacjami',
                point4: '✅ Zrozumienie za pierwszym razem — bez ponownego pytania',
                point5: '✅ Szybka nauka nowych słów'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Wszystkie prawa zastrzeżone.',
            contact: 'W przypadku pytań: ',
            email: 'help@2sub.ru',
            articles: 'Artykuły'
        },
        title: 'Live Subtitles - podwójne napisy do nauki języków',
        description: 'Live Subtitles — aplikacja z podwójnymi napisami, rozpoznawaniem mowy i tłumaczeniem w czasie rzeczywistym. Ucz się języków, oglądaj filmy i łatwo rozumiej język obcy.',
        download: 'Pobierz teraz',
        meta: {
            description: 'Live Subtitles — aplikacja z podwójnymi napisami, rozpoznawaniem mowy i tłumaczeniem w czasie rzeczywistym. Ucz się języków, oglądaj filmy i łatwo rozumiej język obcy.',
            keywords: 'podwójne napisy, napisy do nauki języków, tłumaczenie mowy, rozpoznawanie mowy, napisy online, Live Subtitles, nauka angielskiego, nauka języków, napisy w czasie rzeczywistym, rozumienie mowy, tłumacz filmów'
        },
        downloadModal: {
            title: 'Alert pobierania',
            warning: 'Podczas pobierania pliku Windows może wyświetlić ostrzeżenie bezpieczeństwa. To normalne dla nowych aplikacji.',
            howToInstall: 'Jak zainstalować aplikację:',
            step1: '1. Kliknij "Zapisz" podczas pobierania',
            step2: '2. Po pobraniu kliknij "Uruchom"',
            step3: '3. Postępuj zgodnie z instrukcjami instalatora',
            virusCheck: 'Możesz sprawdzić plik pod kątem wirusów przed instalacją:',
            checkVirus: 'Sprawdź na VirusTotal',
            download: 'Pobierz',
            cancel: 'Anuluj'
        },
        macModal: {
            title: 'Wersja Mac',
            desc: 'Pracujemy nad wersją Mac. Zostaw swój email, a powiadomimy, gdy będzie gotowa.',
            send: 'Wyślij'
        },
        successModal: {
            title: 'Dziękujemy!',
            desc: 'Powiadomimy, gdy wersja Mac będzie gotowa.',
            close: 'Zamknij'
        },
        faq: {
            title: 'Często zadawane pytania',
            q1: 'Ile kosztuje aplikacja?',
            a1: 'Live Subtitles działa na zasadzie subskrypcji od $7. Dostępny jest bezpłatny okres próbny, abyś mógł przetestować wszystkie funkcje aplikacji.',
            q2: 'Czy działa ze wszystkimi aplikacjami?',
            a2: 'Tak! Live Subtitles działa absolutnie ze wszystkimi aplikacjami: YouTube, Netflix, Zoom, Teams, Discord, przeglądarkami, a nawet grami. Aplikacja przechwytuje dźwięk na poziomie systemu.',
            q3: 'Jakie języki są obsługiwane?',
            a3: 'Obsługa 16+ języków z wyświetlaniem podwójnych napisów: angielski, francuski, hiszpański, niemiecki, włoski, japoński, koreański, chiński (uproszczony/tradycyjny), arabski, hindi, portugalski, polski, holenderski, turecki, rosyjski, ukraiński.',
            q4: 'Czy potrzebne jest połączenie internetowe?',
            a4: 'Tak, stabilne połączenie internetowe jest potrzebne do rozpoznawania mowy i tłumaczenia. Aplikacja używa usług chmurowych, aby zapewnić wysoką dokładność.',
            q5: 'Czy mogę dostosować wygląd napisów?',
            a5: 'Oczywiście! Możesz dostosować rozmiar czcionki, kolor, pozycję napisów na ekranie, przezroczystość tła i wybrać języki do wyświetlania.',
            q6: 'Czy jest wersja na Mac lub urządzenia mobilne?',
            a6: 'Obecnie dostępna jest tylko wersja na Windows. Aktywnie pracujemy nad wersjami na Mac, iOS i Android. Zostaw swój email, a powiadomimy o wydaniu.'
        },
        testimonials: {
            title: 'Opinie użytkowników',
            review1: '"W końcu mogę oglądać koreańskie dramaty bez ciągłego pauzowania! Aplikacja dokładnie tłumaczy nawet szybkie rozmowy."',
            author1: 'Anna K.',
            role1: 'Uczy się koreańskiego',
            review2: '"Rewolucja w międzynarodowych spotkaniach! Nie muszę już prosić kolegów z Indii i Chin o powtórzenie."',
            author2: 'Michael R.',
            role2: 'Menedżer IT',
            review3: '"Używam do nauki angielskiego przez YouTube. Moje słownictwo wzrosło ogromnie w ciągu miesiąca!"',
            author3: 'Elena S.',
            role3: 'Studentka',
            review4: '"Uczę się angielskiego, gdzie chcę - na każdej platformie! Oglądam Netflix w przeglądarce, słucham podcastów na telefonie, uczestniczę w spotkaniach w Teams. Aplikacja naprawdę działa wszędzie!"',
            author4: 'Alex M.',
            role4: 'Uczy się angielskiego',
            review5: '"Łatwa konfiguracja i działa perfekcyjnie. Subskrypcja od $7 zwróciła się po pierwszym spotkaniu roboczym."',
            author5: 'David P.',
            role5: 'Tłumacz'
        },
        download: {
            title: 'Wypróbuj za darmo teraz',
            subtitle: 'Bezpłatny okres próbny, potem od $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", pl: "Witamy w świecie podwójnych napisów" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", pl: "Dwa języki, jeden ekran" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", pl: "Ucz się języków oglądając filmy" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", pl: "Lepiej rozumiej mowę obcą" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", pl: "Wyłap każde słowo bez konieczności powtarzania" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", pl: "Zrozum za pierwszym razem — bez powtarzania" }
        ]
    },
    'nl-NL': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Functies',
            comparison: 'Vergelijking',
            download: 'Download'
        },
        header: {
            title: 'Kijk films, leer talen — begrijp live spraak gemakkelijk',
            lead: 'Live Subtitles - je assistent met dubbele ondertitels, spraakherkenning en realtime vertaling'
        },
        downloadBtn: 'Download van Microsoft Store',
        macBtn: 'Wil Mac versie',
        platforms: {
            title: 'Werkt met elke app — geen beperkingen'
        },
        features: {
            title: 'Functies',
            dualSubtitles: 'Dubbele ondertitels',
            dualSubtitlesDesc: 'Op computer, in elke browser en speler.',
            speechRecognition: 'Spraakherkenning',
            speechRecognitionDesc: 'Geen platform- of app-beperkingen.',
            realTimeTranslation: 'Realtime vertaling',
            realTimeTranslationDesc: 'Kijk films en neem deel aan gesprekken met onmiddellijk begrip van alles, zonder opnieuw te vragen.',
            allApps: 'Werkt met alle apps'
        },
        comparison: {
            title: 'Vergelijking',
            noSubtitles: {
                title: 'Geen ondertitels',
                desc: 'Alleen audio',
                point1: '❌ Moeilijk onbekende woorden horen',
                point2: '❌ Frequent herhalen',
                point3: '❌ Veel informatie missen',
                point4: '❌ Moeilijk spreker accent begrijpen'
            },
            oneLanguage: {
                title: 'Één taal',
                desc: 'Gewone ondertitels',
                point1: '✅ Tekst is zichtbaar',
                point2: '✅ Helpt accent begrijpen',
                point3: '❌ Ondertitels mogelijk niet beschikbaar in app',
                point4: '❌ Geen vertaling',
                point5: '❌ Moeilijk nieuwe woorden leren'
            },
            twoLanguages: {
                title: 'Twee talen',
                desc: 'Dubbele ondertitels met Live Subtitles',
                point1: '✅ Onmiddellijke vertaling',
                point2: '✅ Begrijp elk accent gemakkelijk',
                point3: '✅ Werkt met alle applicaties',
                point4: '✅ Begrijp de eerste keer — geen opnieuw vragen nodig',
                point5: '✅ Snel nieuwe woorden leren'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Alle rechten voorbehouden.',
            contact: 'Voor vragen: ',
            email: 'help@2sub.ru',
            articles: 'Artikelen'
        },
        title: 'Live Subtitles - dubbele ondertitels voor taal leren',
        description: 'Live Subtitles — applicatie met dubbele ondertitels, spraakherkenning en realtime vertaling. Leer talen, kijk films en begrijp gemakkelijk vreemde talen.',
        download: 'Nu downloaden',
        meta: {
            description: 'Live Subtitles — applicatie met dubbele ondertitels, spraakherkenning en realtime vertaling. Leer talen, kijk films en begrijp gemakkelijk vreemde talen.',
            keywords: 'dubbele ondertitels, ondertitels voor taal leren, spraak vertaling, spraakherkenning, online ondertitels, Live Subtitles, Engels leren, taal leren, realtime ondertitels, spraak begrip, film vertaler'
        },
        downloadModal: {
            title: 'Download waarschuwing',
            warning: 'Bij het downloaden van het bestand kan Windows een beveiligingswaarschuwing tonen. Dit is normaal voor nieuwe applicaties.',
            howToInstall: 'Hoe de applicatie installeren:',
            step1: '1. Klik "Opslaan" bij downloaden',
            step2: '2. Na download, klik "Uitvoeren"',
            step3: '3. Volg de installatie instructies',
            virusCheck: 'Je kunt het bestand controleren op virussen voor installatie:',
            checkVirus: 'Controleer op VirusTotal',
            download: 'Download',
            cancel: 'Annuleren'
        },
        macModal: {
            title: 'Mac versie',
            desc: 'We werken aan de Mac versie. Laat je email achter en we informeren je wanneer het klaar is.',
            send: 'Versturen'
        },
        successModal: {
            title: 'Bedankt!',
            desc: 'We informeren je wanneer de Mac versie klaar is.',
            close: 'Sluiten'
        },
        faq: {
            title: 'Veelgestelde vragen',
            q1: 'Hoeveel kost de app?',
            a1: 'Live Subtitles werkt op abonnementsbasis vanaf $7. Er is een gratis proefperiode beschikbaar zodat je alle functies van de app kunt testen.',
            q2: 'Werkt het met alle applicaties?',
            a2: 'Ja! Live Subtitles werkt absoluut met alle applicaties: YouTube, Netflix, Zoom, Teams, Discord, browsers en zelfs games. De app vangt audio op systeemniveau.',
            q3: 'Welke talen worden ondersteund?',
            a3: 'Ondersteunt 16+ talen met dubbele ondertitel weergave: Engels, Frans, Spaans, Duits, Italiaans, Japans, Koreaans, Chinees (vereenvoudigd/traditioneel), Arabisch, Hindi, Portugees, Pools, Nederlands, Turks, Russisch, Oekraïens.',
            q4: 'Is internetverbinding vereist?',
            a4: 'Ja, stabiele internetverbinding is vereist voor spraakherkenning en vertaling. De app gebruikt cloudservices om hoge nauwkeurigheid te garanderen.',
            q5: 'Kan ik het uiterlijk van ondertitels aanpassen?',
            a5: 'Natuurlijk! Je kunt lettergrootte, kleur, positie van ondertitels op scherm, achtergrond transparantie aanpassen en talen kiezen om weer te geven.',
            q6: 'Is er een versie voor Mac of mobiele apparaten?',
            a6: 'Momenteel is alleen Windows versie beschikbaar. We werken actief aan Mac, iOS en Android versies. Laat je email achter en we informeren over de release.'
        },
        testimonials: {
            title: 'Gebruikersbeoordelingen',
            review1: '"Eindelijk kan ik Koreaanse drama\'s kijken zonder constant te pauzeren! De app vertaalt zelfs snelle gesprekken accuraat."',
            author1: 'Anna K.',
            role1: 'Leert Koreaans',
            review2: '"Revolutie in internationale vergaderingen! Ik hoef niet meer om herhaling te vragen aan collega\'s uit India en China."',
            author2: 'Michael R.',
            role2: 'IT Manager',
            review3: '"Ik gebruik het om Engels te leren via YouTube. Mijn woordenschat groeide enorm in een maand!"',
            author3: 'Elena S.',
            role3: 'Student',
            review4: '"Ik leer Engels waar ik wil - op elk platform! Kijk Netflix in browser, luister podcasts op telefoon, volg vergaderingen in Teams. De app werkt echt overal!"',
            author4: 'Alex M.',
            role4: 'Leert Engels',
            review5: '"Eenvoudige setup en werkt perfect. Abonnement vanaf $7 terugverdiend na eerste werkvergadering."',
            author5: 'David P.',
            role5: 'Vertaler'
        },
        download: {
            title: 'Probeer nu gratis',
            subtitle: 'Gratis proefperiode, daarna vanaf $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", nl: "Welkom in de wereld van dubbele ondertitels" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", nl: "Twee talen, één scherm" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", nl: "Leer talen door naar films te kijken" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", nl: "Begrijp vreemde talen beter" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", nl: "Vang elk woord zonder opnieuw te hoeven vragen" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", nl: "Begrijp het in één keer — herhalen niet nodig" }
        ]
    },
    'tr-TR': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Özellikler',
            comparison: 'Karşılaştırma',
            download: 'İndir'
        },
        header: {
            title: 'Film izle, dil öğren — canlı konuşmayı kolayca anla',
            lead: 'Live Subtitles - çift altyazı, konuşma tanıma ve gerçek zamanlı çeviri asistanınız'
        },
        downloadBtn: 'Microsoft Store\'dan İndir',
        macBtn: 'Mac sürümü istiyorum',
        platforms: {
            title: 'Her uygulamayla çalışır — sınır yok'
        },
        features: {
            title: 'Özellikler',
            dualSubtitles: 'Çift altyazı',
            dualSubtitlesDesc: 'Bilgisayarda, herhangi bir tarayıcı ve oynatıcıda.',
            speechRecognition: 'Konuşma tanıma',
            speechRecognitionDesc: 'Platform veya uygulama sınırı yok.',
            realTimeTranslation: 'Gerçek zamanlı çeviri',
            realTimeTranslationDesc: 'Film izle ve aramalara katıl, tekrar sormadan her şeyi anında anla.',
            allApps: 'Tüm uygulamalarla çalışır'
        },
        comparison: {
            title: 'Karşılaştırma',
            noSubtitles: {
                title: 'Altyazı yok',
                desc: 'Sadece ses',
                point1: '❌ Bilinmeyen kelimeleri duymak zor',
                point2: '❌ Sık tekrar',
                point3: '❌ Çok bilgi kaçırma',
                point4: '❌ Konuşanın aksanını anlamak zor'
            },
            oneLanguage: {
                title: 'Tek dil',
                desc: 'Normal altyazı',
                point1: '✅ Metin görünür',
                point2: '✅ Aksanı anlamaya yardımcı olur',
                point3: '❌ Uygulamada altyazı mevcut olmayabilir',
                point4: '❌ Çeviri yok',
                point5: '❌ Yeni kelimeleri öğrenmek zor'
            },
            twoLanguages: {
                title: 'İki dil',
                desc: 'Live Subtitles ile çift altyazı',
                point1: '✅ Anında çeviri',
                point2: '✅ Her aksanı kolayca anlama',
                point3: '✅ Tüm uygulamalarla çalışır',
                point4: '✅ İlk seferde anlama — tekrar sormaya gerek yok',
                point5: '✅ Yeni kelimeleri hızlı öğrenme'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Tüm hakları saklıdır.',
            contact: 'Herhangi bir soru için: ',
            email: 'help@2sub.ru',
            articles: 'Makaleler'
        },
        title: 'Live Subtitles - dil öğrenimi için çift altyazı',
        description: 'Live Subtitles — çift altyazı, konuşma tanıma ve gerçek zamanlı çeviri ile uygulama. Dil öğren, film izle ve yabancı dili kolayca anla.',
        download: 'Şimdi indir',
        meta: {
            description: 'Live Subtitles — çift altyazı, konuşma tanıma ve gerçek zamanlı çeviri ile uygulama. Dil öğren, film izle ve yabancı dili kolayca anla.',
            keywords: 'çift altyazı, dil öğrenme altyazısı, konuşma çevirisi, konuşma tanıma, çevrimiçi altyazı, Live Subtitles, İngilizce öğrenme, dil öğrenimi, gerçek zamanlı altyazı, konuşma anlama, film çevirmen'
        },
        downloadModal: {
            title: 'İndirme uyarısı',
            warning: 'Dosyayı indirirken Windows güvenlik uyarısı gösterebilir. Bu yeni uygulamalar için normaldir.',
            howToInstall: 'Uygulamayı nasıl kurar:',
            step1: '1. İndirirken "Kaydet"e tıklayın',
            step2: '2. İndirme sonrası "Çalıştır"a tıklayın',
            step3: '3. Yükleyici talimatlarını takip edin',
            virusCheck: 'Kurmadan önce dosyayı virüse karşı kontrol edebilirsiniz:',
            checkVirus: 'VirusTotal\'da kontrol et',
            download: 'İndir',
            cancel: 'İptal'
        },
        macModal: {
            title: 'Mac sürümü',
            desc: 'Mac sürümü üzerinde çalışıyoruz. E-postanızı bırakın, hazır olduğunda size haber verelim.',
            send: 'Gönder'
        },
        successModal: {
            title: 'Teşekkürler!',
            desc: 'Mac sürümü hazır olduğunda size haber vereceğiz.',
            close: 'Kapat'
        },
        faq: {
            title: 'Sıkça Sorulan Sorular',
            q1: 'Uygulamanın maliyeti nedir?',
            a1: 'Live Subtitles abonelik esasına göre $7\'den başlar. Uygulamanın tüm özelliklerini test edebilmeniz için ücretsiz deneme süresi mevcuttur.',
            q2: 'Tüm uygulamalarla çalışır mı?',
            a2: 'Evet! Live Subtitles kesinlikle tüm uygulamalarla çalışır: YouTube, Netflix, Zoom, Teams, Discord, tarayıcılar ve hatta oyunlar. Uygulama sistem seviyesinde ses yakalar.',
            q3: 'Hangi diller destekleniyor?',
            a3: 'Çift altyazı gösterimi ile 16+ dil desteği: İngilizce, Fransızca, İspanyolca, Almanca, İtalyanca, Japonca, Korece, Çince (Basitleştirilmiş/Geleneksel), Arapça, Hintçe, Portekizce, Lehçe, Hollandaca, Türkçe, Rusça, Ukraynaca.',
            q4: 'İnternet bağlantısı gerekli mi?',
            a4: 'Evet, konuşma tanıma ve çeviri için kararlı internet bağlantısı gerekli. Uygulama yüksek doğruluk sağlamak için bulut hizmetleri kullanır.',
            q5: 'Altyazı görünümünü özelleştirebilir miyim?',
            a5: 'Elbette! Yazı tipi boyutu, renk, ekrandaki altyazı pozisyonu, arka plan saydamlığını ayarlayabilir ve gösterilecek dilleri seçebilirsiniz.',
            q6: 'Mac veya mobil cihazlar için sürüm var mı?',
            a6: 'Şu anda sadece Windows sürümü mevcut. Mac, iOS ve Android sürümleri üzerinde aktif olarak çalışıyoruz. E-postanızı bırakın, çıkışı haber verelim.'
        },
        testimonials: {
            title: 'Kullanıcı Değerlendirmeleri',
            review1: '"Sonunda Kore dizilerini sürekli duraklatmadan izleyebiliyorum! Uygulama hızlı konuşmaları bile doğru çeviriyor."',
            author1: 'Anna K.',
            role1: 'Korece öğreniyor',
            review2: '"Uluslararası toplantılarda devrim! Artık Hindistan ve Çin\'deki meslektaşlarımdan tekrar etmelerini istemek zorunda değilim."',
            author2: 'Michael R.',
            role2: 'BT Müdürü',
            review3: '"YouTube üzerinden İngilizce öğrenmek için kullanıyorum. Bir ayda kelime dağarcığım muazzam arttı!"',
            author3: 'Elena S.',
            role3: 'Öğrenci',
            review4: '"İstediğim yerde İngilizce öğreniyorum - her platformda! Tarayıcıda Netflix izliyorum, telefonda podcast dinliyorum, Teams\'te toplantılara katılıyorum. Uygulama gerçekten her yerde çalışıyor!"',
            author4: 'Alex M.',
            role4: 'İngilizce öğreniyor',
            review5: '"Kurulumu kolay ve mükemmel çalışıyor. $7\'den başlayan abonelik - ilk iş toplantısından sonra kendini amorti etti."',
            author5: 'David P.',
            role5: 'Çevirmen'
        },
        download: {
            title: 'Şimdi ücretsiz dene',
            subtitle: 'Ücretsiz deneme süresi, sonra $7\'den başlar'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", tr: "Çift altyazı dünyasına hoş geldiniz" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", tr: "İki dil, bir ekran" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", tr: "Film izlerken dil öğrenin" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", tr: "Yabancı konuşmayı daha iyi anlayın" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", tr: "Tekrar sormadan her kelimeyi yakalayın" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", tr: "İlk seferde anlayın — tekrar gerekmez" }
        ]
    },
    'uk-UA': {
        navbar: {
            brand: 'Live Subtitles',
            features: 'Функції',
            comparison: 'Порівняння',
            download: 'Завантажити'
        },
        header: {
            title: 'Дивіться фільми, вивчайте мови — легко розумійте живе мовлення',
            lead: 'Live Subtitles - ваш помічник з подвійними субтитрами, розпізнаванням мовлення та перекладом у реальному часі'
        },
        downloadBtn: 'Завантажити з Microsoft Store',
        macBtn: 'Хочу версію для Mac',
        platforms: {
            title: 'Працює з будь-яким додатком — без обмежень'
        },
        features: {
            title: 'Функції',
            dualSubtitles: 'Подвійні субтитри',
            dualSubtitlesDesc: 'На комп\'ютері, в будь-якому браузері та програвачі.',
            speechRecognition: 'Розпізнавання мовлення',
            speechRecognitionDesc: 'Без обмежень платформи чи додатку.',
            realTimeTranslation: 'Переклад у реальному часі',
            realTimeTranslationDesc: 'Дивіться фільми та беріть участь у дзвінках з миттєвим розумінням усього, без повторного запитування.',
            allApps: 'Працює з усіма додатками'
        },
        comparison: {
            title: 'Порівняння',
            noSubtitles: {
                title: 'Без субтитрів',
                desc: 'Тільки аудіо',
                point1: '❌ Важко чути незнайомі слова',
                point2: '❌ Часте повторення',
                point3: '❌ Втрата багато інформації',
                point4: '❌ Важко зрозуміти акцент мовця'
            },
            oneLanguage: {
                title: 'Одна мова',
                desc: 'Звичайні субтитри',
                point1: '✅ Текст видно',
                point2: '✅ Допомагає зрозуміти акцент',
                point3: '❌ Субтитри можуть бути недоступні в додатку',
                point4: '❌ Немає перекладу',
                point5: '❌ Важко вивчати нові слова'
            },
            twoLanguages: {
                title: 'Дві мови',
                desc: 'Подвійні субтитри з Live Subtitles',
                point1: '✅ Миттєвий переклад',
                point2: '✅ Легко зрозуміти будь-який акцент',
                point3: '✅ Працює з усіма додатками',
                point4: '✅ Розуміння з першого разу — без повторного запитування',
                point5: '✅ Швидке вивчення нових слів'
            }
        },
        footer: {
            copyright: '© 2024 Live Subtitles. Усі права захищені.',
            contact: 'З будь-яких питань: ',
            email: 'help@2sub.ru',
            articles: 'Статті'
        },
        title: 'Live Subtitles - подвійні субтитри для вивчення мов',
        description: 'Live Subtitles — додаток з подвійними субтитрами, розпізнаванням мовлення та перекладом у реальному часі. Вивчайте мови, дивіться фільми та легко розумійте іноземні мови.',
        download: 'Завантажити зараз',
        meta: {
            description: 'Live Subtitles — додаток з подвійними субтитрами, розпізнаванням мовлення та перекладом у реальному часі. Вивчайте мови, дивіться фільми та легко розумійте іноземні мови.',
            keywords: 'подвійні субтитри, субтитри для вивчення мов, переклад мовлення, розпізнавання мовлення, онлайн субтитри, Live Subtitles, вивчення англійської, вивчення мов, субтитри в реальному часі, розуміння мовлення, перекладач фільмів'
        },
        downloadModal: {
            title: 'Попередження завантаження',
            warning: 'При завантаженні файлу Windows може показати попередження безпеки. Це нормально для нових додатків.',
            howToInstall: 'Як встановити додаток:',
            step1: '1. Натисніть "Зберегти" при завантаженні',
            step2: '2. Після завантаження натисніть "Запустити"',
            step3: '3. Дотримуйтесь інструкцій встановлювача',
            virusCheck: 'Ви можете перевірити файл на віруси перед встановленням:',
            checkVirus: 'Перевірити на VirusTotal',
            download: 'Завантажити',
            cancel: 'Скасувати'
        },
        macModal: {
            title: 'Версія для Mac',
            desc: 'Ми працюємо над версією для Mac. Залиште свою електронну адресу, і ми повідомимо, коли буде готово.',
            send: 'Надіслати'
        },
        successModal: {
            title: 'Дякуємо!',
            desc: 'Ми повідомимо, коли версія для Mac буде готова.',
            close: 'Закрити'
        },
        faq: {
            title: 'Часті запитання',
            q1: 'Скільки коштує додаток?',
            a1: 'Live Subtitles працює за підпискою від $7. Доступний безкоштовний пробний період, щоб ви могли протестувати всі функції додатку.',
            q2: 'Чи працює з усіма додатками?',
            a2: 'Так! Live Subtitles абсолютно працює з усіма додатками: YouTube, Netflix, Zoom, Teams, Discord, браузерами та навіть іграми. Додаток захоплює аудіо на системному рівні.',
            q3: 'Які мови підтримуються?',
            a3: 'Підтримка 16+ мов з відображенням подвійних субтитрів: англійська, французька, іспанська, німецька, італійська, японська, корейська, китайська (спрощена/традиційна), арабська, хінді, португальська, польська, голландська, турецька, російська, українська.',
            q4: 'Чи потрібне підключення до інтернету?',
            a4: 'Так, стабільне підключення до інтернету потрібне для розпізнавання мовлення та перекладу. Додаток використовує хмарні сервіси для забезпечення високої точності.',
            q5: 'Чи можу я налаштувати зовнішній вигляд субтитрів?',
            a5: 'Звичайно! Ви можете налаштувати розмір шрифту, колір, позицію субтитрів на екрані, прозорість фону та вибрати мови для відображення.',
            q6: 'Чи є версія для Mac або мобільних пристроїв?',
            a6: 'Наразі доступна тільки версія для Windows. Ми активно працюємо над версіями для Mac, iOS та Android. Залиште свою електронну адресу, і ми повідомимо про випуск.'
        },
        testimonials: {
            title: 'Відгуки користувачів',
            review1: '"Нарешті можу дивитися корейські дорами без постійних зупинок! Додаток точно перекладає навіть швидкі розмови."',
            author1: 'Anna K.',
            role1: 'Вивчає корейську',
            review2: '"Революція в міжнародних зустрічах! Більше не потрібно просити колег з Індії та Китаю повторювати."',
            author2: 'Michael R.',
            role2: 'IT-менеджер',
            review3: '"Використовую для вивчення англійської через YouTube. Мій словниковий запас зріс величезно за місяць!"',
            author3: 'Elena S.',
            role3: 'Студентка',
            review4: '"Вивчаю англійську де хочу - на будь-якій платформі! Дивлюся Netflix в браузері, слухаю подкасти на телефоні, беру участь у зустрічах в Teams. Додаток справді працює скрізь!"',
            author4: 'Alex M.',
            role4: 'Вивчає англійську',
            review5: '"Просте налаштування та ідеальна робота. Підписка від $7 окупилася після першої робочої зустрічі."',
            author5: 'David P.',
            role5: 'Перекладач'
        },
        download: {
            title: 'Спробуйте безкоштовно зараз',
            subtitle: 'Безкоштовний пробний період, потім від $7'
        },
        examples: [
            { en: "Welcome to the world of dual subtitles", fr: "Bienvenue dans le monde des sous-titres doubles", uk: "Ласкаво просимо у світ подвійних субтитрів" },
            { en: "Two languages, one screen", fr: "Deux langues, un écran", uk: "Дві мови, один екран" },
            { en: "Learn languages while watching movies", fr: "Apprenez des langues en regardant des films", uk: "Вивчайте мови, дивлячись фільми" },
            { en: "Understand foreign speech better", fr: "Comprenez mieux la parole étrangère", uk: "Краще розумійте іноземну мову" },
            { en: "Catch every word without asking again", fr: "Attrapez chaque mot sans avoir à redemander", uk: "Вловлюйте кожне слово без перепитувань" },
            { en: "Understand the first time — no repeats needed", fr: "Comprenez du premier coup — pas besoin de répéter", uk: "Розумійте з першого разу — без повторів" }
        ]
    }
};

// Функция для определения языка пользователя
function getUserLanguage() {
    // Проверяем сохраненный язык пользователя (приоритет 1)
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }

    // Проверяем URL параметр языка (приоритет 2)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
        const langMapping = {
            'ru': 'ru-RU',
            'en': 'en-US', 
            'fr': 'fr-FR',
            'es': 'es-ES',
            'de': 'de-DE',
            'it': 'it-IT',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'pt': 'pt-BR',
            'pl': 'pl-PL',
            'nl': 'nl-NL',
            'tr': 'tr-TR',
            'uk': 'uk-UA'
        };
        
        const mappedLang = langMapping[urlLang] || urlLang;
        if (translations[mappedLang]) {
            return mappedLang;
        }
    }

    // Проверяем язык браузера (приоритет 3)
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Проверяем, поддерживается ли язык браузера точно
    if (translations[browserLang]) {
        return browserLang;
    }
    
    // Если точное совпадение не найдено, попробуем найти по коду языка
    const langCode = browserLang.split('-')[0];
    const langMapping = {
        'ru': 'ru-RU',
        'en': 'en-US', 
        'fr': 'fr-FR',
        'es': 'es-ES',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'pt': 'pt-BR',
        'pl': 'pl-PL',
        'nl': 'nl-NL',
        'tr': 'tr-TR',
        'uk': 'uk-UA'
    };
    
    // Возвращаем соответствующий язык или английский по умолчанию
    return langMapping[langCode] || 'en-US';
}

// Функция для применения переводов
function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    // Обновляем язык HTML документа
    document.documentElement.lang = lang.split('-')[0];
    
    // Обновляем мета-теги
    document.querySelector('meta[name="description"]').content = t.meta.description;
    document.querySelector('meta[name="keywords"]').content = t.meta.keywords;
    
    // Обновляем заголовок
    document.title = t.title;
    
    // Обновляем контент
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const keys = key.split('.');
        let value = t;
        for (const k of keys) {
            value = value[k];
        }
        if (value) {
            // Если элемент содержит только текст, заменяем textContent
            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                element.textContent = value;
            } else {
                // Если есть вложенные элементы, ищем первый текстовый узел и заменяем его
                let replaced = false;
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                        node.nodeValue = value;
                        replaced = true;
                        break;
                    }
                }
                // Если не нашли текстовый узел, добавим новый
                if (!replaced) {
                    element.appendChild(document.createTextNode(value));
                }
            }
        }
    });
}

// Функция для переключения языка
function switchLanguage(langCode) {
    const langMapping = {
        'ru': 'ru-RU',
        'en': 'en-US', 
        'fr': 'fr-FR',
        'es': 'es-ES',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'pt': 'pt-BR',
        'pl': 'pl-PL',
        'nl': 'nl-NL',
        'tr': 'tr-TR',
        'uk': 'uk-UA'
    };
    
    const fullLangCode = langMapping[langCode] || langCode;
    
    if (translations[fullLangCode]) {
        // Сохраняем выбор пользователя
        localStorage.setItem('preferredLanguage', fullLangCode);
        
        // Применяем переводы
        applyTranslations(fullLangCode);
        
        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location);
        url.searchParams.set('lang', langCode);
        window.history.replaceState({}, '', url);
        
        return true;
    }
    
    return false;
}

// Функция для получения текущего языка
function getCurrentLanguage() {
    return getUserLanguage();
}

// Функция для автоопределения языка браузера (опциональная)
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    const langMapping = {
        'ru': 'ru-RU',
        'en': 'en-US', 
        'fr': 'fr-FR',
        'es': 'es-ES',
        'de': 'de-DE',
        'it': 'it-IT',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'ar': 'ar-SA',
        'hi': 'hi-IN',
        'pt': 'pt-BR',
        'pl': 'pl-PL',
        'nl': 'nl-NL',
        'tr': 'tr-TR',
        'uk': 'uk-UA'
    };
    
    return langMapping[langCode] || 'en-US';
}

// Экспорт функций для глобального использования
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.detectBrowserLanguage = detectBrowserLanguage;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const lang = getUserLanguage();
    applyTranslations(lang);
});

// Функция для обновления ссылки на статьи в футере в зависимости от языка
function updateFooterArticlesLink() {
    const lang = getCurrentLanguage();
    const langCode = lang.split('-')[0];
    const link = document.getElementById('footer-articles-link');
    if (link) {
        link.href = `/articles/${langCode}/`;
        link.textContent = translations[lang]?.footer?.articles || translations['ru-RU'].footer.articles;
    }
}
document.addEventListener('DOMContentLoaded', updateFooterArticlesLink);
document.getElementById('languageSelector').addEventListener('change', updateFooterArticlesLink); 