"""Per-language unique content blocks for thin language-pair pages."""

# Each entry: file -> dict with unique content fields
PAGES = {

    'dutch-to-english-live-captions.html': {
        'lang': 'Dutch',
        'native_name': 'Nederlands',
        'recognition_challenges': [
            'The guttural G sound (zacht/hard) varies between Hollandic and Flemish speech, and many transcription tools confuse it with H or even silence.',
            'Dutch packs words together: contractions like "kheb" (ik heb) and "kweet" (ik weet) are pervasive in casual speech.',
            'Word order in subordinate clauses moves the verb to the end, which generic translators often re-order incorrectly when translating live audio.',
        ],
        'idioms': [
            ('Het regent pijpenstelen', 'It rains pipe stems', 'It is pouring (raining cats and dogs)'),
            ('Niet op zijn mondje gevallen', 'Not fallen on his little mouth', 'Quick-witted, never short on words'),
            ('De kat uit de boom kijken', 'To watch the cat from the tree', 'To wait and see how things develop'),
            ('Iets onder de knie hebben', 'To have something under the knee', 'To have mastered something'),
            ('Met de deur in huis vallen', 'To fall with the door into the house', 'To get straight to the point'),
        ],
        'dialects': 'Standard Netherlands Dutch (ABN), Hollandic (Randstad), Brabantian, Limburgish, and Belgian Flemish (Vlaams) including West-Flemish.',
        'use_contexts': 'Amsterdam fintech startups, Eindhoven hardware engineering teams, NPO and VRT broadcasts, Belgian-Dutch business meetings.',
    },

    'turkish-to-english-live-captions.html': {
        'lang': 'Turkish',
        'native_name': 'Türkçe',
        'recognition_challenges': [
            'Turkish is agglutinative — a single word like "evlerimizden" packs five English words ("from our houses") into seven suffixes that translators often mis-segment.',
            'Vowel harmony shifts the same suffix between four phonetic forms, which acoustic models can confuse with separate words.',
            'Subject-Object-Verb word order means the verb arrives last, so naive sentence-level translation often produces a partial English caption with the action missing.',
        ],
        'idioms': [
            ('Kafayı yemek', 'To eat the head', 'To go crazy / lose it'),
            ('Etekleri zil çalmak', 'Skirts ringing like bells', 'To be over the moon with joy'),
            ('Pabucu dama atılmak', 'Shoe thrown onto the roof', 'To be replaced or fall out of favor'),
            ('Kulak misafiri olmak', 'To be the guest of an ear', 'To accidentally overhear a conversation'),
            ('Ağzından bal damlamak', 'Honey dripping from the mouth', 'To speak very sweetly'),
        ],
        'dialects': 'Istanbul standard, Anatolian Turkish, Cypriot Turkish, and Azerbaijani-influenced Eastern Anatolian variants.',
        'use_contexts': 'Istanbul SaaS and e-commerce, Turkish drama on Netflix and Disney+, Bosphorus tourism content, Turkish-language YouTube finance and gaming channels.',
    },

    'polish-to-english-live-subtitles.html': {
        'lang': 'Polish',
        'native_name': 'Polski',
        'recognition_challenges': [
            'Polish has consonant clusters like "bezwzględny" or "źdźbło" that often confuse generic speech-to-text engines built primarily on English data.',
            'Seven grammatical cases mean the same noun appears in many different surface forms — without case-aware translation, English output drifts.',
            'Free word order is grammatically valid in Polish, so the right English structure depends on prosody and context, not just on word sequence.',
        ],
        'idioms': [
            ('Nie mój cyrk, nie moje małpy', 'Not my circus, not my monkeys', 'Not my problem'),
            ('Bułka z masłem', 'A bun with butter', 'A piece of cake / very easy'),
            ('Mieć muchy w nosie', 'To have flies in your nose', 'To be in a bad mood'),
            ('Rzucać grochem o ścianę', 'To throw peas at a wall', 'To talk to someone who is not listening'),
            ('Z deszczu pod rynnę', 'From the rain under the gutter', 'Out of the frying pan into the fire'),
        ],
        'dialects': 'Standard Polish (Warsaw/Cracow), Silesian, Greater Polish, Lesser Polish, and Mazovian regional accents.',
        'use_contexts': 'Polish IT outsourcing meetings, Warsaw fintech earnings, Polish gaming and esports streams, TVP and Netflix Polska originals.',
    },

    'ukrainian-to-english-live-subtitles.html': {
        'lang': 'Ukrainian',
        'native_name': 'Українська',
        'recognition_challenges': [
            'Ukrainian has a distinct phoneme inventory from Russian (the soft "ї", "є", and "ґ") — engines built around Russian audio routinely mistranscribe it as Russian.',
            'Code-switching between Ukrainian and Russian (surzhyk) inside the same sentence is common in everyday speech and trips up monolingual recognizers.',
            'Cyrillic homographs across Ukrainian and Russian look identical but pronounce differently, which forces the model to disambiguate from acoustic context.',
        ],
        'idioms': [
            ('Як корова язиком злизала', 'As if a cow licked it off with its tongue', 'Disappeared without a trace'),
            ('Брати бика за роги', 'To take the bull by the horns', 'To deal with a problem head-on'),
            ('На городі бузина, а в Києві дядько', 'Elder in the garden, an uncle in Kyiv', 'Two completely unrelated things'),
            ('Не мала баба клопоту, купила порося', 'Granny had no troubles, so she bought a piglet', 'Asked for trouble unnecessarily'),
            ('Тримати язика за зубами', 'To keep your tongue behind your teeth', 'To stay silent / keep a secret'),
        ],
        'dialects': 'Standard Ukrainian (literary), Western (Galician/Bukovynian), Central, and Southeastern dialects, plus surzhyk mixed speech.',
        'use_contexts': 'Ukrainian war reporting, Kyiv tech sector calls, Ukrainian-language YouTube journalism, Suspilne and 1+1 broadcasts.',
    },

    'english-to-spanish-live-subtitles.html': {
        'lang_from': 'English',
        'lang_to': 'Spanish',
        'native_name': 'Español',
        'recognition_challenges': [
            'English uses heavy phrasal verbs ("look up", "put off", "carry out") that map to single, register-specific Spanish verbs — picking the wrong one shifts tone from casual to formal.',
            'Spanish has formal/informal "you" (tú/usted) plus regional vosotros — direction of conversation has to inform pronoun choice, which generic translators usually skip.',
            'Numbers, dates, and units use different conventions: 1,000.50 in English equals 1.000,50 in Spanish — live translators that miss this generate confusing financial captions.',
        ],
        'idioms': [
            ('It is raining cats and dogs', 'Está lloviendo gatos y perros', 'Está lloviendo a cántaros'),
            ('Break a leg', 'Rómpete una pierna', 'Mucha mierda / Mucha suerte'),
            ('Spill the beans', 'Derramar los frijoles', 'Soltar la sopa / Irse de la lengua'),
            ('Cost an arm and a leg', 'Costar un brazo y una pierna', 'Costar un ojo de la cara'),
            ('Hit the nail on the head', 'Golpear el clavo en la cabeza', 'Dar en el clavo'),
        ],
        'dialects': 'Castilian (Spain), Mexican, Rioplatense (Argentina/Uruguay), Caribbean (Cuba/PR/DR), Andean, and Chilean Spanish — vocabulary and verb conjugation differ enough to warrant region selection.',
        'use_contexts': 'US-LATAM business calls, Spanish-language Netflix dubs, US Hispanic market podcasts, Spanish university lecture content.',
    },

    'italian-to-english-live-translation.html': {
        'lang': 'Italian',
        'native_name': 'Italiano',
        'recognition_challenges': [
            'Italian elision ("d\'accordo", "l\'amico") joins words at vowel boundaries, and weaker recognizers treat the result as one undefined token.',
            'Doubled consonants ("anno" vs "ano") completely change meaning but are barely audible to non-native ears or generic models.',
            'Regional dialects (Sicilian, Neapolitan, Venetian) carry vocabulary and grammar so different from standard Italian that they need separate language profiles.',
        ],
        'idioms': [
            ('In bocca al lupo', 'In the mouth of the wolf', 'Good luck (theatrical use)'),
            ('Non avere peli sulla lingua', 'To not have hair on your tongue', 'To speak bluntly'),
            ('Avere le mani in pasta', 'To have hands in the dough', 'To be deeply involved in something'),
            ('Stare con le mani in mano', 'To stand with hands in hand', 'To do nothing / stand idle'),
            ('Prendere due piccioni con una fava', 'To take two pigeons with one bean', 'Kill two birds with one stone'),
        ],
        'dialects': 'Standard Italian, Tuscan, Roman, Milanese, Neapolitan, Sicilian, Venetian — many are partly mutually unintelligible.',
        'use_contexts': 'Milan fashion and finance, Italian football broadcasts, RAI documentaries, Italian YouTube cooking and travel.',
    },

    'russian-to-english-live-captions.html': {
        'lang': 'Russian',
        'native_name': 'Русский',
        'recognition_challenges': [
            'Russian palatalized consonants (мь, ть, нь) mark grammatical case — missing them shifts a noun\'s function in the sentence.',
            'Six grammatical cases reshape nouns, adjectives, and pronouns; word-order is flexible and semantics are case-driven.',
            'Aspect pairs (perfective/imperfective verbs) carry meaning English handles with tense and time adverbs — direct word-by-word translation gets it wrong.',
        ],
        'idioms': [
            ('Вешать лапшу на уши', 'To hang noodles on someone\'s ears', 'To deceive with elaborate stories'),
            ('Делать из мухи слона', 'To make an elephant out of a fly', 'To make a mountain out of a molehill'),
            ('Без царя в голове', 'Without a tsar in the head', 'Reckless, lacking judgement'),
            ('Когда рак на горе свистнет', 'When the crawfish whistles on a hill', 'When pigs fly / never'),
            ('Ни рыба, ни мясо', 'Neither fish nor meat', 'Neither one thing nor the other / wishy-washy'),
        ],
        'dialects': 'Standard Russian, Northern (Vologda/Arkhangelsk), Central (Moscow), Southern dialects, plus Russian as spoken in Belarus, Kazakhstan, and the Baltics.',
        'use_contexts': 'Russian-language news streams, Russian YouTube tech and gaming, Eastern European business meetings, Russian-language Netflix originals.',
    },

    'portuguese-to-english-translation.html': {
        'lang': 'Portuguese',
        'native_name': 'Português',
        'recognition_challenges': [
            'European Portuguese (PT-PT) and Brazilian Portuguese (PT-BR) differ in vowel reduction, sibilants, and even basic vocabulary ("autocarro" vs "ônibus") — a generic engine slurs PT-PT badly.',
            'Nasal vowels (ã, õ, ões) are core to meaning but barely present in English, so non-Portuguese speech models drop them.',
            'Mesoclisis (verb-pronoun-verb constructions like "dir-lhe-ei") only happens in Portuguese — it confuses any translator trained primarily on Spanish.',
        ],
        'idioms': [
            ('Quebrar o galho', 'To break the branch', 'To improvise a quick fix (PT-BR)'),
            ('Pagar o pato', 'To pay for the duck', 'To take the blame for someone else'),
            ('Dar com a língua nos dentes', 'To strike one\'s tongue against one\'s teeth', 'To accidentally spill a secret'),
            ('Engolir sapos', 'To swallow frogs', 'To put up with unpleasant things in silence'),
            ('De pequenino se torce o pepino', 'A cucumber is twisted while small', 'Habits are formed in childhood'),
        ],
        'dialects': 'European Portuguese (Lisbon, northern, Azorean), Brazilian Portuguese (Carioca, Paulista, Nordestino, Gaúcho), African Portuguese (Angolan, Mozambican).',
        'use_contexts': 'São Paulo fintech, Portuguese-language news streams (Globo, RTP, SIC), Portuguese YouTube creators, lusophone Africa business meetings.',
    },

    'arabic-to-english-live-subtitles.html': {
        'lang': 'Arabic',
        'native_name': 'العربية',
        'recognition_challenges': [
            'Modern Standard Arabic (MSA) is rarely spoken outside news and formal contexts; everyday speech is dialectal — the gap forces models to support Egyptian, Gulf, Levantine, and Maghrebi separately.',
            'Arabic lacks vowels in standard text but they are essential in speech, so live transcription has to predict vowels from context.',
            'Right-to-left script and the broken-plural noun system mean live captions need careful rendering and lemmatization to align with English subtitles.',
        ],
        'idioms': [
            ('على عيني', 'On my eye', 'Gladly / I will gladly do it'),
            ('يضرب عصفورين بحجر واحد', 'To hit two birds with one stone', 'Kill two birds with one stone'),
            ('من قلبه أبيض', 'His heart is white', 'He is genuinely kind-hearted'),
            ('إن غاب القط العب يا فأر', 'If the cat is gone, play, mouse', 'When the cat\'s away, the mice will play'),
            ('الجار قبل الدار', 'The neighbor before the house', 'Choose your neighbor before choosing your home'),
        ],
        'dialects': 'Modern Standard Arabic (MSA), Egyptian, Gulf (Saudi/UAE/Qatar), Levantine (Syria/Lebanon/Jordan/Palestine), Maghrebi (Morocco/Algeria/Tunisia), Iraqi, Sudanese, Yemeni.',
        'use_contexts': 'Al Jazeera and Al Arabiya broadcasts, MENA business calls, Khaleeji drama and Egyptian films, Arabic-language YouTube tech and finance.',
    },

    'english-to-chinese-live-captions.html': {
        'lang_from': 'English',
        'lang_to': 'Chinese',
        'native_name': '中文',
        'recognition_challenges': [
            'Mandarin is tonal — the same syllable "ma" carries four totally different meanings depending on tone, and English-trained translators routinely pick the wrong character.',
            'Chinese has no inflection: tense, plurality, and gender are inferred from context, so an English source has to be parsed for those clues before generating a clean Mandarin caption.',
            'Simplified versus Traditional script is a hard switch: a learner in Taipei needs Traditional, a colleague in Shanghai needs Simplified, and getting it wrong looks unprofessional.',
        ],
        'idioms': [
            ('It is raining cats and dogs', 'It is raining cats and dogs (literal)', '倾盆大雨 (qīng pén dà yǔ) — pouring like an upturned basin'),
            ('Break a leg', 'Break a leg (literal)', '祝你好运 (zhù nǐ hǎo yùn) — wishing you luck'),
            ('Hit the nail on the head', 'Hit the nail on the head (literal)', '一针见血 (yī zhēn jiàn xiě) — one needle draws blood'),
            ('When pigs fly', 'When pigs fly (literal)', '太阳从西边出来 (tài yáng cóng xī biān chū lái) — when the sun rises in the west'),
            ('Spill the beans', 'Spill the beans (literal)', '泄露秘密 (xiè lù mì mì) — leak the secret'),
        ],
        'dialects': 'Mandarin (Putonghua, the standard) plus regional accents from Beijing, Sichuan, and Shanghai; written output in Simplified (mainland China, Singapore) or Traditional (Taiwan, Hong Kong).',
        'use_contexts': 'US-China business calls, English-language tech content for Chinese learners, Chinese subtitles for Hollywood film releases, English presentations for Mandarin-speaking audiences.',
    },

    'hindi-to-english-live-captions.html': {
        'lang': 'Hindi',
        'native_name': 'हिन्दी',
        'recognition_challenges': [
            'Real-world Hindi is hybrid — Hinglish code-switches between Hindi and English mid-sentence in business, media, and casual speech.',
            'Devanagari has aspirated/unaspirated consonant pairs (क/ख, त/थ) that generic ASR models built on English audio merge.',
            'Hindi shares many Persian and Sanskrit-derived synonyms; tone and register changes which one is correct in the English translation.',
        ],
        'idioms': [
            ('नाक में दम करना', 'To put life in someone\'s nose', 'To irritate someone severely'),
            ('आसमान सिर पर उठाना', 'To lift the sky onto your head', 'To make a huge fuss'),
            ('दाल में काला होना', 'There is something black in the lentils', 'Something is suspicious'),
            ('ऊंट के मुंह में जीरा', 'A cumin seed in a camel\'s mouth', 'Far too little for the need'),
            ('अपने मुंह मियाँ मिट्ठू बनना', 'To call yourself a sweet parrot', 'To brag about oneself'),
        ],
        'dialects': 'Standard Hindi (Khariboli), Awadhi, Bhojpuri, Braj Bhasha, Haryanvi, plus Hinglish (Hindi-English code mixing) in urban India.',
        'use_contexts': 'Indian SaaS and IT services calls, Bollywood films and OTT (Netflix India, Hotstar, Sony LIV), Hindi YouTube finance and tech, NDTV/Aaj Tak broadcasts.',
    },
}
