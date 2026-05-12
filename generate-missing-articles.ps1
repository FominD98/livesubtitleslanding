param(
    [string]$ArticlesRoot = "articles"
)

# DEPRECATED 2026-05-12: This legacy generator emits an Organization-author
# JSON-LD block ("name": "Live Subtitles", "@type": "Organization") which
# conflicts with the per-article Person authors (Sofia Almeida, Mei Lin Chen,
# Aarav Sharma, Lukas Bergström, Hiroshi Tanaka, Daniel Formind) that the
# articles now ship with. Re-running this script will silently downgrade
# E-E-A-T signals across the locale set.
#
# Do not run without first updating the author + publisher hashtables in this
# file (see line ~433) and re-checking against _assign_article_authors.py.
throw "generate-missing-articles.ps1 is deprecated. See header comment for the migration to per-article Person authors before re-enabling."

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ArticlesRoot)) {
    throw "Articles root not found: $ArticlesRoot"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Escape-Html {
    param([string]$Text)
    if ($null -eq $Text) { return "" }
    $escaped = $Text
    $escaped = $escaped -replace '&', '&amp;'
    $escaped = $escaped -replace '<', '&lt;'
    $escaped = $escaped -replace '>', '&gt;'
    $escaped = $escaped -replace '"', '&quot;'
    $escaped = $escaped -replace "'", '&#39;'
    return $escaped
}

function Strip-AndDecode {
    param([string]$Html)
    if ([string]::IsNullOrWhiteSpace($Html)) { return "" }
    $stripped = [regex]::Replace($Html, "<.*?>", "")
    $decoded = [System.Net.WebUtility]::HtmlDecode($stripped)
    return [regex]::Replace($decoded, "\s+", " ").Trim()
}

function Fmt {
    param(
        [string]$Template,
        [string]$Value
    )
    if ($null -eq $Template) { return "" }
    if ($null -eq $Value) { $Value = "" }
    return [string]::Format($Template, $Value)
}

function Build-Snippet {
    param(
        [string]$Text,
        [int]$MaxLen = 170
    )
    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    $clean = [regex]::Replace($Text, "\s+", " ").Trim()
    if ($clean.Length -le $MaxLen) { return $clean }
    return ($clean.Substring(0, $MaxLen).TrimEnd([char[]]" ,;:") + "...")
}

function Get-TopTerms {
    param(
        [string]$Text,
        [int]$MaxCount = 6
    )
    if ([string]::IsNullOrWhiteSpace($Text)) { return @() }

    $counts = @{}
    $matches = [regex]::Matches($Text.ToLowerInvariant(), '\p{L}[\p{L}\p{M}\p{Nd}\-]{2,}')
    foreach ($m in $matches) {
        $token = $m.Value
        if ([string]::IsNullOrWhiteSpace($token)) { continue }
        if ($counts.ContainsKey($token)) {
            $counts[$token]++
        } else {
            $counts[$token] = 1
        }
    }

    if ($counts.Count -eq 0) { return @() }
    return @(
        $counts.GetEnumerator() |
            Sort-Object -Property Value -Descending |
            Select-Object -ExpandProperty Key -First $MaxCount
    )
}

function New-ArticleHints {
    param(
        [string]$Title,
        [string]$Description,
        [int]$ArticleNumber
    )

    $terms = Get-TopTerms -Text "$Title $Description" -MaxCount 8
    $titleFallback = if ([string]::IsNullOrWhiteSpace($Title)) { "topic" } else { $Title }

    $primary = if ($terms.Count -ge 1) { $terms[0] } else { $titleFallback }
    $secondary = if ($terms.Count -ge 2) { $terms[1] } else { $primary }
    $tertiary = if ($terms.Count -ge 3) { $terms[2] } else { $secondary }
    $termLine = if ($terms.Count -gt 0) { ($terms | Select-Object -First 5) -join ", " } else { $titleFallback }

    $snippet = Build-Snippet -Text $Description -MaxLen 170
    if ([string]::IsNullOrWhiteSpace($snippet)) {
        $snippet = Build-Snippet -Text $Title -MaxLen 170
    }

    return [pscustomobject]@{
        Number = $ArticleNumber
        Primary = $primary
        Secondary = $secondary
        Tertiary = $tertiary
        TermLine = $termLine
        Snippet = $snippet
    }
}

$localeMap = @{
    ar = "ar_SA"; de = "de_DE"; en = "en_US"; es = "es_ES"; fr = "fr_FR"; hi = "hi_IN"; it = "it_IT"; ja = "ja_JP";
    ko = "ko_KR"; nl = "nl_NL"; pl = "pl_PL"; pt = "pt_PT"; ru = "ru_RU"; tr = "tr_TR"; uk = "uk_UA"; zh = "zh_CN"
}

# Pages missing before: rewrite them with localized SEO content.
$rewritePlan = @{
    hi = @(8, 9, 10)
    it = @(4, 5, 6, 7, 8, 9, 10)
    ja = @(4, 5, 6, 7, 8, 9, 10)
    ko = @(4, 5, 6, 7, 8, 9, 10)
    nl = @(4, 5, 6, 7, 8, 9, 10)
    pl = @(4, 5, 6, 7, 8, 9, 10)
    pt = @(4, 5, 6, 7, 8, 9, 10)
    tr = @(4, 5, 6, 7, 8, 9, 10)
    uk = @(4, 5, 6, 7, 8, 9, 10)
}

$packs = @{
    default = @{
        ArticlesLabel = "Articles"
        Main = "Back to main site"
        Back = "Back to articles"
        Pub = "Published"
        Keywords = "live subtitles, dual subtitles, language learning, real time captions"
        IntroA = "This page expands the topic: {0}."
        IntroB = "Core summary: {0}"
        HIntent = "Search intent and user problem"
        IntentA = "Most users want to understand fast speech better, reduce rewinds, and keep useful phrases."
        IntentB = "The best results come from combining watching with active phrase practice."
        HPlan = "Practical workflow"
        Plan = @(
            "Select content aligned with your current objective.",
            "Save 5 to 10 key phrases after each session.",
            "Reuse these phrases in writing or speaking within 24 hours."
        )
        HPractice = "Practice and retention"
        Practice = @(
            "Keep sessions short and consistent.",
            "Review difficult vocabulary every week.",
            "Train with full sentence patterns, not isolated words."
        )
        HSeo = "SEO checklist"
        Seo = @(
            "Use the main query in title, intro, and one H2.",
            "Answer user questions with concrete short blocks.",
            "Add relevant internal links and one clear CTA."
        )
        HFaq = "FAQ"
        Faq = @(
            @{ Q = "How often should I practice?"; A = "Four to five short sessions per week usually work best." },
            @{ Q = "How do I track progress?"; A = "Track comprehension, rewinds, and active use of new phrases." }
        )
        HConclusion = "Conclusion"
        Conclusion = "Consistency is the key. A repeatable process gives stronger long term results."
        HRelated = "Related articles"
        CtaTitle = "Try Live Subtitles"
        CtaText = "Use dual subtitles, real time speech recognition, and translation across videos and meetings."
        CtaButton = "Download from Microsoft Store"
    }
    pl = @{
        ArticlesLabel = "Artykuły"; Main = "Powrót do strony głównej"; Back = "Powrót do artykułów"; Pub = "Opublikowano";
        Keywords = "podwójne napisy, live subtitles, nauka języków, napisy na żywo";
        IntroA = "Ten materiał rozwija temat: {0}."; IntroB = "Krótki opis: {0}";
        HIntent = "Intencja wyszukiwania i problem"; IntentA = "Użytkownik chce szybciej rozumieć mowę i mniej przewijać.";
        IntentB = "Najlepszy efekt daje połączenie oglądania i aktywnej pracy na frazach.";
        HPlan = "Plan działania"; Plan = @("Wybierz materiał zgodny z celem.", "Po sesji zapisz 5-10 fraz.", "Użyj zapisanych fraz w ciągu 24 godzin.");
        HPractice = "Praktyka i utrwalanie"; Practice = @("Pracuj krótko, ale regularnie.", "Powtarzaj trudne słowa co kilka dni.", "Ćwicz całe zdania i kontekst.");
        HSeo = "Checklist SEO"; Seo = @("Fraza główna w title, intro i H2.", "Odpowiedzi na realne pytania użytkownika.", "Linki wewnętrzne i jasne CTA.");
        HFaq = "FAQ"; Faq = @(@{ Q = "Jak często ćwiczyć?"; A = "Najczęściej działa 4-5 krótkich sesji tygodniowo."; }, @{ Q = "Jak mierzyć postęp?"; A = "Sprawdzaj zrozumienie, przewinięcia i aktywne użycie nowych fraz."; });
        HConclusion = "Wnioski"; Conclusion = "Najważniejsza jest regularność. Powtarzalny proces daje stabilny wzrost.";
        HRelated = "Powiązane artykuły"; CtaTitle = "Wypróbuj Live Subtitles"; CtaText = "Podwójne napisy i rozpoznawanie mowy pomagają szybciej się uczyć."; CtaButton = "Pobierz z Microsoft Store";
    }
    tr = @{
        ArticlesLabel = "Makaleler"; Main = "Ana siteye dön"; Back = "Makalelere dön"; Pub = "Yayın tarihi";
        Keywords = "çift altyazı, live subtitles, dil öğrenme, gerçek zamanlı altyazı";
        IntroA = "Bu içerik şu konuyu genişletir: {0}."; IntroB = "Kısa özet: {0}";
        HIntent = "Arama niyeti ve sorun"; IntentA = "Kullanıcılar hızlı konuşmayı daha iyi anlamak ve geri sarmayı azaltmak ister.";
        IntentB = "En etkili yöntem izleme ile aktif ifade tekrarını birleştirmektir.";
        HPlan = "Uygulanabilir plan"; Plan = @("Hedefine uygun içerik seç.", "Her oturumdan sonra 5-10 ifade yaz.", "İfadeleri 24 saat içinde kullan.");
        HPractice = "Pratik ve kalıcılık"; Practice = @("Kısa ama düzenli çalış.", "Zor kelimeleri haftalık gözden geçir.", "Tek kelime değil cümle kalıpları çalış.");
        HSeo = "SEO kontrol listesi"; Seo = @("Ana sorgu title, giriş ve H2 içinde olmalı.", "Sorulara kısa ve uygulanabilir cevap ver.", "İç link ve net CTA ekle.");
        HFaq = "Sık sorulan sorular"; Faq = @(@{ Q = "Ne sıklıkla çalışmalıyım?"; A = "Haftada 4-5 kısa oturum genelde en iyi sonucu verir."; }, @{ Q = "İlerlemeyi nasıl ölçerim?"; A = "Anlama oranı, geri sarma sayısı ve kullanılan yeni ifadeleri takip et."; });
        HConclusion = "Sonuç"; Conclusion = "Düzenli uygulama en kritik etkendir. Basit rutinler uzun vadede daha iyi sonuç verir.";
        HRelated = "İlgili makaleler"; CtaTitle = "Live Subtitles dene"; CtaText = "Çift altyazı ve gerçek zamanlı konuşma tanıma öğrenmeyi hızlandırır."; CtaButton = "Microsoft Store üzerinden indir";
    }
    uk = @{
        ArticlesLabel = "Статті"; Main = "Повернутися на головний сайт"; Back = "Повернутися до статей"; Pub = "Опубліковано";
        Keywords = "подвійні субтитри, live subtitles, вивчення мов, субтитри у реальному часі";
        IntroA = "Цей матеріал розкриває тему: {0}."; IntroB = "Короткий опис: {0}";
        HIntent = "Пошуковий намір і проблема"; IntentA = "Користувач хоче краще розуміти швидке мовлення та менше перемотувати.";
        IntentB = "Найкращий ефект дає поєднання перегляду і активного повторення фраз.";
        HPlan = "Практичний план"; Plan = @("Оберіть контент під свою ціль.", "Після сесії зафіксуйте 5-10 фраз.", "Використайте нові фрази протягом 24 годин.");
        HPractice = "Практика і закріплення"; Practice = @("Працюйте регулярно короткими сесіями.", "Повторюйте складну лексику щотижня.", "Тренуйте цілі речення у контексті.");
        HSeo = "SEO чеклист"; Seo = @("Головний запит у title, intro та H2.", "Короткі відповіді на реальні питання.", "Внутрішні посилання і чіткий CTA.");
        HFaq = "Поширені запитання"; Faq = @(@{ Q = "Як часто тренуватися?"; A = "Зазвичай найкраще працюють 4-5 коротких сесій на тиждень."; }, @{ Q = "Як вимірювати прогрес?"; A = "Відстежуйте розуміння, перемотування і активне використання нових фраз."; });
        HConclusion = "Висновок"; Conclusion = "Регулярність важливіша за ривки. Повторюваний процес дає стабільний результат.";
        HRelated = "Схожі статті"; CtaTitle = "Спробуйте Live Subtitles"; CtaText = "Подвійні субтитри та розпізнавання мовлення допомагають вчитися швидше."; CtaButton = "Завантажити з Microsoft Store";
    }
    ja = @{
        ArticlesLabel = "記事"; Main = "メインサイトに戻る"; Back = "記事一覧に戻る"; Pub = "公開日";
        Keywords = "二重字幕, live subtitles, 言語学習, リアルタイム字幕";
        IntroA = "この記事は次のテーマを実践的に解説します: {0}。"; IntroB = "要点: {0}";
        HIntent = "検索意図と課題"; IntentA = "読者は速い会話の理解を高め、巻き戻しを減らしたいと考えています。";
        IntentB = "視聴とフレーズの能動練習を組み合わせると効果が上がります。";
        HPlan = "実行プラン"; Plan = @("目的に合う素材を選ぶ。", "各セッション後に5〜10フレーズを記録する。", "24時間以内に自分の発話で再利用する。");
        HPractice = "練習と定着"; Practice = @("短時間でも継続する。", "難しい語彙を週単位で復習する。", "単語ではなく文型で練習する。");
        HSeo = "SEOチェック"; Seo = @("主要クエリをタイトル、導入、H2に入れる。", "実際の質問へ短く具体的に答える。", "内部リンクと明確なCTAを置く。");
        HFaq = "よくある質問"; Faq = @(@{ Q = "どのくらい学習すれば良いですか"; A = "目安は週4〜5回の短いセッションです。"; }, @{ Q = "進捗はどう測定しますか"; A = "理解率、巻き戻し回数、新フレーズの実使用数を記録します。"; });
        HConclusion = "まとめ"; Conclusion = "重要なのは継続です。再現可能な学習サイクルが成果を安定させます。";
        HRelated = "関連記事"; CtaTitle = "Live Subtitles を試す"; CtaText = "二重字幕とリアルタイム音声認識で学習効率を高めましょう。"; CtaButton = "Microsoft Store からダウンロード";
    }
    it = @{
        ArticlesLabel = "Articoli"; Main = "Torna al sito principale"; Back = "Torna agli articoli"; Pub = "Pubblicato";
        Keywords = "sottotitoli doppi, live subtitles, apprendimento lingue, sottotitoli in tempo reale";
        IntroA = "Questo articolo approfondisce il tema: {0}."; IntroB = "Sintesi: {0}";
        HIntent = "Intento di ricerca e problema"; IntentA = "Lutente vuole capire meglio il parlato veloce e ridurre i rewind.";
        IntentB = "La resa migliore arriva quando visione e pratica attiva vengono unite.";
        HPlan = "Piano pratico"; Plan = @("Scegli contenuti coerenti con il tuo obiettivo.", "Dopo ogni sessione salva 5-10 frasi.", "Riusa le frasi entro 24 ore.");
        HPractice = "Pratica e consolidamento"; Practice = @("Meglio sessioni brevi ma regolari.", "Rivedi lessico difficile ogni settimana.", "Allena frasi complete con contesto.");
        HSeo = "Checklist SEO"; Seo = @("Query principale in title, intro e H2.", "Risposte brevi a domande reali.", "Link interni pertinenti e CTA chiara.");
        HFaq = "Domande frequenti"; Faq = @(@{ Q = "Con quale frequenza allenarsi"; A = "In genere 4-5 sessioni brevi a settimana funzionano molto bene."; }, @{ Q = "Come misurare i risultati"; A = "Monitora comprensione, rewind e uso attivo delle nuove frasi."; });
        HConclusion = "Conclusione"; Conclusion = "La costanza fa la differenza. Un processo semplice e ripetibile porta risultati migliori.";
        HRelated = "Articoli correlati"; CtaTitle = "Prova Live Subtitles"; CtaText = "Sottotitoli doppi e riconoscimento vocale in tempo reale accelerano lapprendimento."; CtaButton = "Scarica da Microsoft Store";
    }
    ko = @{
        ArticlesLabel = "글"; Main = "메인 사이트로 돌아가기"; Back = "글 목록으로 돌아가기"; Pub = "게시일";
        Keywords = "이중 자막, live subtitles, 언어 학습, 실시간 자막";
        IntroA = "이 글은 다음 주제를 실전 중심으로 설명합니다: {0}."; IntroB = "요약: {0}";
        HIntent = "검색 의도와 문제"; IntentA = "사용자는 빠른 말하기 이해를 높이고 되감기를 줄이려 합니다.";
        IntentB = "시청과 능동적인 표현 연습을 함께 하면 효과가 커집니다.";
        HPlan = "실행 계획"; Plan = @("목표에 맞는 콘텐츠를 선택합니다.", "세션 후 핵심 표현 5-10개를 기록합니다.", "24시간 안에 말하기나 쓰기에 재사용합니다.");
        HPractice = "연습과 정착"; Practice = @("짧고 규칙적인 학습을 유지합니다.", "어려운 어휘를 주간 단위로 복습합니다.", "단어보다 문장 패턴 중심으로 연습합니다.");
        HSeo = "SEO 체크리스트"; Seo = @("핵심 쿼리를 제목, 도입, H2에 배치합니다.", "실제 질문에 짧고 명확하게 답합니다.", "관련 내부 링크와 CTA를 추가합니다.");
        HFaq = "자주 묻는 질문"; Faq = @(@{ Q = "학습 빈도는 어느 정도가 좋나요"; A = "보통 주 4-5회 짧은 세션이 가장 효과적입니다."; }, @{ Q = "진행 상황은 어떻게 측정하나요"; A = "이해율, 되감기 횟수, 새 표현의 실제 사용 횟수를 기록하세요."; });
        HConclusion = "결론"; Conclusion = "핵심은 꾸준함입니다. 반복 가능한 루틴이 장기 성과를 만듭니다.";
        HRelated = "관련 글"; CtaTitle = "Live Subtitles 시작하기"; CtaText = "이중 자막과 실시간 음성 인식으로 학습 속도를 높이세요."; CtaButton = "Microsoft Store에서 다운로드";
    }
    nl = @{
        ArticlesLabel = "Artikelen"; Main = "Terug naar de hoofdpagina"; Back = "Terug naar artikelen"; Pub = "Gepubliceerd";
        Keywords = "dubbele ondertitels, live subtitles, taal leren, realtime ondertitels";
        IntroA = "Dit artikel werkt het onderwerp uit: {0}."; IntroB = "Samenvatting: {0}";
        HIntent = "Zoekintentie en probleem"; IntentA = "Gebruikers willen snelle spraak beter begrijpen en minder terugspoelen.";
        IntentB = "De beste resultaten ontstaan door kijken te combineren met actieve herhaling.";
        HPlan = "Praktisch plan"; Plan = @("Kies content passend bij je doel.", "Noteer na elke sessie 5-10 kernzinnen.", "Gebruik die zinnen binnen 24 uur.");
        HPractice = "Oefenen en vasthouden"; Practice = @("Werk met korte regelmatige sessies.", "Herhaal moeilijke woorden wekelijks.", "Train complete zinnen in context.");
        HSeo = "SEO checklist"; Seo = @("Hoofdquery in title, intro en H2.", "Korte antwoorden op echte vragen.", "Interne links en duidelijke CTA.");
        HFaq = "Veelgestelde vragen"; Faq = @(@{ Q = "Hoe vaak moet ik oefenen"; A = "Meestal geven 4-5 korte sessies per week de beste resultaten."; }, @{ Q = "Hoe meet ik vooruitgang"; A = "Volg begrip, terugspoelingen en actief gebruik van nieuwe zinnen."; });
        HConclusion = "Conclusie"; Conclusion = "Consistentie is doorslaggevend. Een herhaalbaar proces levert stabiele groei op.";
        HRelated = "Gerelateerde artikelen"; CtaTitle = "Probeer Live Subtitles"; CtaText = "Dubbele ondertiteling en realtime spraakherkenning versnellen leren."; CtaButton = "Download in Microsoft Store";
    }
    pt = @{
        ArticlesLabel = "Artigos"; Main = "Voltar ao site principal"; Back = "Voltar para artigos"; Pub = "Publicado em";
        Keywords = "legendas duplas, live subtitles, aprender idiomas, legendas em tempo real";
        IntroA = "Este artigo aprofunda o tema: {0}."; IntroB = "Resumo: {0}";
        HIntent = "Intenção de busca e problema"; IntentA = "Quem pesquisa este tema quer entender fala rápida com mais clareza e reduzir retrocessos.";
        IntentB = "A melhor estratégia combina consumo de conteúdo com prática ativa de frases.";
        HPlan = "Plano prático"; Plan = @("Escolha conteúdo alinhado ao objetivo.", "Após cada sessão registre 5-10 frases.", "Reutilize as frases em até 24 horas.");
        HPractice = "Prática e retenção"; Practice = @("Sessões curtas e frequentes funcionam melhor.", "Revise vocabulário difícil toda semana.", "Treine estruturas completas de frase.");
        HSeo = "Checklist SEO"; Seo = @("Query principal no título, introdução e H2.", "Respostas curtas para perguntas reais.", "Links internos relevantes e CTA claro.");
        HFaq = "Perguntas frequentes"; Faq = @(@{ Q = "Com que frequência praticar"; A = "Em geral, 4-5 sessões curtas por semana trazem ótimos resultados."; }, @{ Q = "Como medir evolução"; A = "Acompanhe compreensão, retrocessos e uso ativo de novas frases."; });
        HConclusion = "Conclusão"; Conclusion = "Consistência gera resultado. Um processo simples e repetível acelera o progresso.";
        HRelated = "Artigos relacionados"; CtaTitle = "Experimente o Live Subtitles"; CtaText = "Legendas duplas e reconhecimento de fala em tempo real tornam o estudo mais eficiente."; CtaButton = "Baixar na Microsoft Store";
    }
    hi = @{
        ArticlesLabel = "लेख"; Main = "मुख्य साइट पर वापस जाएँ"; Back = "लेख सूची पर वापस जाएँ"; Pub = "प्रकाशित";
        Keywords = "डुअल सबटाइटल, live subtitles, भाषा सीखना, रियल टाइम कैप्शन";
        IntroA = "यह लेख इस विषय को विस्तार से समझाता है: {0}।"; IntroB = "संक्षेप: {0}";
        HIntent = "सर्च इंटेंट और समस्या"; IntentA = "यूजर तेज स्पीच को बेहतर समझना और बार बार रिवाइंड कम करना चाहते हैं।";
        IntentB = "सबसे अच्छा परिणाम तब मिलता है जब देखने के साथ सक्रिय अभ्यास किया जाए।";
        HPlan = "व्यावहारिक योजना"; Plan = @("लक्ष्य के अनुसार सही कंटेंट चुनें।", "हर सत्र के बाद 5-10 प्रमुख वाक्यांश लिखें।", "इन वाक्यांशों का 24 घंटे में उपयोग करें।");
        HPractice = "प्रैक्टिस और रिटेंशन"; Practice = @("छोटे लेकिन नियमित सत्र रखें।", "कठिन शब्दों की साप्ताहिक पुनरावृत्ति करें।", "पूरा वाक्य और संदर्भ पर अभ्यास करें।");
        HSeo = "SEO चेकलिस्ट"; Seo = @("मुख्य क्वेरी title, intro और H2 में रखें।", "वास्तविक सवालों के स्पष्ट उत्तर दें।", "आंतरिक लिंक और स्पष्ट CTA जोड़ें।");
        HFaq = "अक्सर पूछे जाने वाले प्रश्न"; Faq = @(@{ Q = "कितनी बार अभ्यास करना चाहिए"; A = "आमतौर पर सप्ताह में 4-5 छोटे सत्र सबसे प्रभावी होते हैं।"; }, @{ Q = "प्रगति कैसे मापें"; A = "समझ, रिवाइंड की संख्या और नए वाक्यांशों के सक्रिय उपयोग को ट्रैक करें।"; });
        HConclusion = "निष्कर्ष"; Conclusion = "नियमितता सबसे महत्वपूर्ण है। सरल और दोहराने योग्य प्रक्रिया से बेहतर परिणाम मिलते हैं।";
        HRelated = "संबंधित लेख"; CtaTitle = "Live Subtitles आजमाएँ"; CtaText = "डुअल सबटाइटल और रियल टाइम स्पीच रिकग्निशन से सीखना तेज होता है।"; CtaButton = "Microsoft Store से डाउनलोड करें";
    }
}

function Get-Pack {
    param([string]$Lang)
    if ($packs.ContainsKey($Lang)) { return $packs[$Lang] }
    return $packs["default"]
}

$articleMeta = @{}
$langDirs = Get-ChildItem -Path $ArticlesRoot -Directory | Where-Object { $_.Name -match '^[a-z]{2}$' } | Sort-Object Name
$cardRegex = [regex]::new('(?is)<div class="article-card"[^>]*>.*?<a href="(?<href>article-\d+\.html)"[^>]*>(?<title>.*?)</a>.*?<div class="article-date"[^>]*content="(?<date>[^"]+)"[^>]*>.*?</div>.*?<div class="article-desc"[^>]*>(?<desc>.*?)</div>')

foreach ($dir in $langDirs) {
    $lang = $dir.Name
    $indexPath = Join-Path $dir.FullName "index.html"
    if (-not (Test-Path $indexPath)) { continue }

    $html = [System.IO.File]::ReadAllText($indexPath)
    foreach ($m in $cardRegex.Matches($html)) {
        $articleFile = $m.Groups["href"].Value.Trim()
        $key = "$lang/$articleFile"
        $articleMeta[$key] = [pscustomobject]@{
            Lang = $lang
            ArticleFile = $articleFile
            Title = Strip-AndDecode $m.Groups["title"].Value
            DatePublished = $m.Groups["date"].Value.Trim()
            Description = Strip-AndDecode $m.Groups["desc"].Value
        }
    }
}

function Build-HreflangLinks {
    param([string]$ArticleFile, [string]$Domain, [string]$ArticlesRoot, [hashtable]$Meta)
    $langs = @($Meta.Values | Where-Object { $_.ArticleFile -eq $ArticleFile } | Select-Object -ExpandProperty Lang -Unique | Sort-Object)
    if ($langs.Count -eq 0) { return "" }

    $lines = New-Object System.Collections.Generic.List[string]
    $xDefaultLang = if ($langs -contains "en") { "en" } else { $langs[0] }
    $lines.Add("    <link rel=`"alternate`" hreflang=`"x-default`" href=`"$Domain/$ArticlesRoot/$xDefaultLang/$ArticleFile`" />") | Out-Null
    foreach ($lang in $langs) {
        $lines.Add("    <link rel=`"alternate`" hreflang=`"$lang`" href=`"$Domain/$ArticlesRoot/$lang/$ArticleFile`" />") | Out-Null
    }
    return ($lines -join "`r`n")
}

function Build-RelatedLinks {
    param([string]$Lang, [string]$CurrentFile, [hashtable]$Meta)
    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($n in @(1, 2, 3)) {
        $f = "article-$n.html"
        if ($f -eq $CurrentFile) { continue }
        $key = "$Lang/$f"
        if ($Meta.ContainsKey($key)) {
            $title = Escape-Html $Meta[$key].Title
            $lines.Add("                    <li><a href=`"$f`">$title</a></li>") | Out-Null
        }
    }
    if ($lines.Count -eq 0) {
        $lines.Add("                    <li><a href=`"index.html`">index.html</a></li>") | Out-Null
    }
    return ($lines -join "`r`n")
}

$domain = "https://live-subtitles.com"
$created = 0
$rewritten = 0
$skipped = 0

foreach ($lang in ($rewritePlan.Keys | Sort-Object)) {
    $pack = Get-Pack $lang
    $targetDir = Join-Path $ArticlesRoot $lang
    if (-not (Test-Path $targetDir)) { New-Item -Path $targetDir -ItemType Directory | Out-Null }

    foreach ($num in $rewritePlan[$lang]) {
        $articleFile = "article-$num.html"
        $key = "$lang/$articleFile"
        if (-not $articleMeta.ContainsKey($key)) {
            Write-Warning "Skipped ${key}: metadata not found"
            $skipped++
            continue
        }

        $meta = $articleMeta[$key]
        $targetPath = Join-Path $targetDir $articleFile
        $wasExisting = Test-Path $targetPath
        $title = $meta.Title
        $desc = $meta.Description
        $date = $meta.DatePublished
        $url = "$domain/$ArticlesRoot/$lang/$articleFile"
        $locale = if ($localeMap.ContainsKey($lang)) { $localeMap[$lang] } else { "en_US" }

        $titleEsc = Escape-Html $title
        $descEsc = Escape-Html $desc
        $dateEsc = Escape-Html $date
        $keywordsEsc = Escape-Html "$title, $($pack.Keywords)"
        $hreflang = Build-HreflangLinks -ArticleFile $articleFile -Domain $domain -ArticlesRoot $ArticlesRoot -Meta $articleMeta
        $relatedHtml = Build-RelatedLinks -Lang $lang -CurrentFile $articleFile -Meta $articleMeta

        $hints = New-ArticleHints -Title $title -Description $desc -ArticleNumber $num

        $intentA = "$($pack.IntentA) $title"
        $intentB = "$($pack.IntentB) $($hints.Snippet)"
        $intentAEsc = Escape-Html $intentA
        $intentBEsc = Escape-Html $intentB

        $planItems = @(
            "$($pack.Plan[0]) $title",
            "$($pack.Plan[1]) $($hints.TermLine)",
            "$($pack.Plan[2]) $($hints.Primary)"
        )
        $practiceItems = @(
            "$($pack.Practice[0]) $($hints.Primary)",
            "$($pack.Practice[1]) $($hints.Secondary)",
            "$($pack.Practice[2]) $($hints.Snippet)"
        )
        $seoItems = @(
            "$($pack.Seo[0]) `"$title`"",
            "$($pack.Seo[1]) $($hints.TermLine)",
            "$($pack.Seo[2]) `"$desc`""
        )

        $faqItems = New-Object System.Collections.Generic.List[hashtable]
        foreach ($faqItem in $pack.Faq) {
            $faqItems.Add(@{
                Q = [string]$faqItem.Q
                A = [string]$faqItem.A
            }) | Out-Null
        }
        $faqItems.Add(@{
            Q = ("{0}?" -f $title)
            A = "$desc"
        }) | Out-Null

        $planHtml = ($planItems | ForEach-Object { "                <li>$(Escape-Html $_)</li>" }) -join "`r`n"
        $practiceHtml = ($practiceItems | ForEach-Object { "                <li>$(Escape-Html $_)</li>" }) -join "`r`n"
        $seoHtml = ($seoItems | ForEach-Object { "                <li>$(Escape-Html $_)</li>" }) -join "`r`n"
        $faqHtml = ($faqItems | ForEach-Object { "            <div class=`"faq-item`"><h3>$(Escape-Html $_.Q)</h3><p>$(Escape-Html $_.A)</p></div>" }) -join "`r`n"

        $articleSchema = @{
            "@context" = "https://schema.org"
            "@type" = "Article"
            headline = $title
            description = $desc
            datePublished = $date
            inLanguage = $lang
            # NOTE: Article-level author must be a Person, not an Organization.
            # See _assign_article_authors.py for the canonical article-N -> author mapping.
            author = @{ "@type" = "Person"; name = "Daniel Formind"; url = "https://live-subtitles.com/about/team/daniel-formind.html"; jobTitle = "Founder & Engineer, Live Subtitles" }
            publisher = @{ "@type" = "Organization"; name = "Live Subtitles" }
            mainEntityOfPage = $url
        }
        $articleSchemaJson = ($articleSchema | ConvertTo-Json -Depth 10)

        $breadcrumbSchema = @{
            "@context" = "https://schema.org"
            "@type" = "BreadcrumbList"
            itemListElement = @(
                @{ "@type" = "ListItem"; position = 1; name = "Home"; item = "$domain/" },
                @{ "@type" = "ListItem"; position = 2; name = $pack.ArticlesLabel; item = "$domain/$ArticlesRoot/$lang/" },
                @{ "@type" = "ListItem"; position = 3; name = $title; item = $url }
            )
        }
        $breadcrumbSchemaJson = ($breadcrumbSchema | ConvertTo-Json -Depth 10)

        $faqSchema = @{
            "@context" = "https://schema.org"
            "@type" = "FAQPage"
            mainEntity = @($faqItems | ForEach-Object { @{ "@type" = "Question"; name = $_.Q; acceptedAnswer = @{ "@type" = "Answer"; text = $_.A } } })
        }
        $faqSchemaJson = ($faqSchema | ConvertTo-Json -Depth 10)

        $introA = Escape-Html (Fmt -Template $pack.IntroA -Value $title)
        $introB = Escape-Html (Fmt -Template $pack.IntroB -Value $desc)
        $topicSnippetEsc = Escape-Html $hints.Snippet
        $termLineEsc = Escape-Html $hints.TermLine

        $output = @"
<!DOCTYPE html>
<html lang="$lang">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$titleEsc - Live Subtitles</title>
    <meta name="description" content="$descEsc">
    <meta name="keywords" content="$keywordsEsc">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="$url" />
$hreflang
    <meta property="og:type" content="article">
    <meta property="og:title" content="$titleEsc - Live Subtitles">
    <meta property="og:description" content="$descEsc">
    <meta property="og:url" content="$url">
    <meta property="og:image" content="https://live-subtitles.com/preview.png">
    <meta property="og:locale" content="$locale">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$titleEsc - Live Subtitles">
    <meta name="twitter:description" content="$descEsc">
    <meta name="twitter:image" content="https://live-subtitles.com/preview.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body { background: #0a0a0a; color: #fff; font-family: 'Fira Code', monospace; }
        .article-container { max-width: 900px; margin: 40px auto; background: rgba(255,255,255,0.04); border-radius: 10px; padding: 2.3rem; border: 1px solid rgba(255,255,255,0.08); }
        .article-title { color: #00ff9d; font-size: 2rem; margin-bottom: 1rem; line-height: 1.3; }
        .article-date { color: #bbb; font-size: 0.95rem; margin-bottom: 1.5rem; }
        .back-link { color: #00b8ff; text-decoration: none; margin-bottom: 1.5rem; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        h2 { color: #00ff9d; margin-top: 2rem; }
        h3 { color: #00d4ff; margin-top: 1rem; font-size: 1.1rem; }
        p, li { color: #eee; line-height: 1.8; }
        .lang-switch { margin-bottom: 1rem; }
        .faq-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem; margin-bottom: 0.8rem; }
        .related { background: rgba(0,184,255,0.08); border-left: 4px solid #00b8ff; padding: 1.2rem; border-radius: 0 8px 8px 0; margin: 2rem 0; }
        .related a { color: #00b8ff; text-decoration: none; }
        .related a:hover { text-decoration: underline; }
        .cta { background: linear-gradient(135deg, rgba(0,255,157,0.1), rgba(0,184,255,0.1)); border: 1px solid rgba(0,255,157,0.3); border-radius: 12px; padding: 1.6rem; margin-top: 2rem; text-align: center; }
        .cta h3 { color: #00ff9d; margin-top: 0; }
        .cta a { display: inline-block; margin-top: 0.8rem; padding: 0.8rem 1.8rem; background: linear-gradient(135deg, #00ff9d, #00b8ff); color: #0a0a0a; text-decoration: none; border-radius: 8px; font-weight: 700; }
    </style>
    <script type="application/ld+json">
$articleSchemaJson
    </script>
    <script type="application/ld+json">
$breadcrumbSchemaJson
    </script>
    <script type="application/ld+json">
$faqSchemaJson
    </script>
</head>
<body>
    <div class="container article-container" itemscope itemtype="https://schema.org/Article">
        <div class="lang-switch">
            <a href="/" style="color:#00b8ff;">$(Escape-Html $pack.Main)</a>
        </div>
        <a href="index.html" class="back-link">&larr; $(Escape-Html $pack.Back)</a>
        <h1 class="article-title" itemprop="headline">$titleEsc</h1>
        <div class="article-date" itemprop="datePublished" content="$dateEsc">$(Escape-Html $pack.Pub): $dateEsc</div>
        <div itemprop="articleBody">
            <p>$introA</p>
            <p>$introB</p>
            <p>$topicSnippetEsc</p>
            <p>$termLineEsc</p>

            <h2>$(Escape-Html $pack.HIntent)</h2>
            <p>$intentAEsc</p>
            <p>$intentBEsc</p>

            <h2>$(Escape-Html $pack.HPlan)</h2>
            <ol>
$planHtml
            </ol>

            <h2>$(Escape-Html $pack.HPractice)</h2>
            <ul>
$practiceHtml
            </ul>

            <h2>$(Escape-Html $pack.HSeo)</h2>
            <ul>
$seoHtml
            </ul>

            <h2>$(Escape-Html $pack.HFaq)</h2>
$faqHtml

            <h2>$(Escape-Html $pack.HConclusion)</h2>
            <p>$(Escape-Html $pack.Conclusion)</p>

            <div class="related">
                <h3 style="color:#00b8ff; margin-top:0;">$(Escape-Html $pack.HRelated)</h3>
                <ul style="list-style:none; padding-left:0; margin-bottom:0;">
$relatedHtml
                </ul>
            </div>

            <div class="cta">
                <h3>$(Escape-Html $pack.CtaTitle)</h3>
                <p>$(Escape-Html $pack.CtaText)</p>
                <a href="https://apps.microsoft.com/store/detail/9PH1R9DJG47S?cid=DevShareMCLPCS" target="_blank">$(Escape-Html $pack.CtaButton)</a>
            </div>
        </div>
    </div>
</body>
</html>
"@

        [System.IO.File]::WriteAllText($targetPath, $output, $utf8NoBom)
        if ($wasExisting) { $rewritten++; Write-Host "Rewritten: $targetPath" } else { $created++; Write-Host "Created: $targetPath" }
    }
}

Write-Host "Done. Created: $created; Rewritten: $rewritten; Skipped: $skipped"
