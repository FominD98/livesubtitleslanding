param()

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$targetLangs = @('ar','de','es','fr','hi','it','ja','ko','nl','pl','pt','tr','uk','zh')
$allLangs = @('en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')

$articleSpecs = @(
    @{
        Name = 'article-19.html'
        Title = 'Game Mode Subtitles for Competitive Games: Setup Guide 2026'
        Description = 'Practical setup guide for Game Mode subtitles in competitive games: lock behavior, borderless fullscreen, and voice callout clarity.'
        Date = 'March 5, 2026'
    },
    @{
        Name = 'article-20.html'
        Title = 'Fullscreen Subtitle Overlay Troubleshooting for Games'
        Description = 'Troubleshooting checklist for subtitle overlays in games: fullscreen visibility, borderless setup, focus issues, and quick recovery steps.'
        Date = 'March 5, 2026'
    },
    @{
        Name = 'article-21.html'
        Title = 'Discord Voice Chat Subtitles for International Squads'
        Description = 'Practical Discord subtitle workflow for multilingual squads with fast callouts and stable in-match coordination.'
        Date = 'March 5, 2026'
    },
    @{
        Name = 'article-22.html'
        Title = 'Best Subtitle Overlay Settings for FPS and MOBA'
        Description = 'Practical settings for subtitle overlay placement, density, and contrast without visual distraction in ranked games.'
        Date = 'March 5, 2026'
    }
)

$localizedCardData = @{
    'fr' = @{
        'article-19.html' = @{ Title = 'Sous-titres Game Mode pour jeux compétitifs : guide 2026'; Description = 'Guide pratique pour configurer les sous-titres Game Mode en compétitif : mode verrouillage, borderless fullscreen et clarté des callouts vocaux.'; Date = '5 mars 2026' }
        'article-20.html' = @{ Title = 'Diagnostic de l''overlay de sous-titres fullscreen pour les jeux'; Description = 'Checklist rapide pour diagnostiquer les problèmes d''overlay de sous-titres en fullscreen dans les jeux.'; Date = '5 mars 2026' }
        'article-21.html' = @{ Title = 'Sous-titres Discord Voice Chat pour escouades internationales'; Description = 'Workflow pratique de sous-titres Discord pour escouades multilingues avec callouts rapides.'; Date = '5 mars 2026' }
        'article-22.html' = @{ Title = 'Meilleurs réglages d''overlay de sous-titres pour FPS et MOBA'; Description = 'Réglages pratiques de position, densité et contraste de l''overlay de sous-titres pour FPS et MOBA.'; Date = '5 mars 2026' }
    }
    'es' = @{
        'article-19.html' = @{ Title = 'Subtítulos Game Mode para juegos competitivos: guía 2026'; Description = 'Guía práctica para configurar subtítulos Game Mode en competitivo: modo bloqueo, borderless fullscreen y claridad de callouts de voz.'; Date = '5 de marzo de 2026' }
        'article-20.html' = @{ Title = 'Diagnóstico del overlay de subtítulos fullscreen para juegos'; Description = 'Checklist rápida para diagnosticar problemas del overlay de subtítulos fullscreen en juegos.'; Date = '5 de marzo de 2026' }
        'article-21.html' = @{ Title = 'Subtítulos de Discord Voice Chat para escuadras internacionales'; Description = 'Flujo práctico de subtítulos en Discord para escuadras multilingües con callouts rápidos.'; Date = '5 de marzo de 2026' }
        'article-22.html' = @{ Title = 'Mejores ajustes de overlay de subtítulos para FPS y MOBA'; Description = 'Ajustes prácticos de posición, densidad y contraste del overlay de subtítulos para FPS y MOBA.'; Date = '5 de marzo de 2026' }
    }
    'de' = @{
        'article-19.html' = @{ Title = 'Game-Mode-Untertitel für kompetitive Spiele: Setup-Guide 2026'; Description = 'Praxisleitfaden für Game-Mode-Untertitel im Wettkampf: Sperrmodus, Borderless Fullscreen und klare Voice-Callouts.'; Date = '5. März 2026' }
        'article-20.html' = @{ Title = 'Fehlerbehebung für Fullscreen-Untertitel-Overlay in Spielen'; Description = 'Schnelle Checkliste zur Diagnose von Fullscreen-Untertitel-Overlay-Problemen in Spielen.'; Date = '5. März 2026' }
        'article-21.html' = @{ Title = 'Discord-Voice-Chat-Untertitel für internationale Squads'; Description = 'Praktischer Discord-Untertitel-Workflow für mehrsprachige Squads mit schnellen Callouts.'; Date = '5. März 2026' }
        'article-22.html' = @{ Title = 'Beste Untertitel-Overlay-Einstellungen für FPS und MOBA'; Description = 'Praxiswerte für Position, Dichte und Kontrast des Untertitel-Overlays in FPS und MOBA.'; Date = '5. März 2026' }
    }
    'it' = @{
        'article-19.html' = @{ Title = 'Sottotitoli Game Mode per giochi competitivi: guida 2026'; Description = 'Guida pratica per configurare i sottotitoli Game Mode nel competitivo: lock mode, borderless fullscreen e callout vocali più chiari.'; Date = '5 marzo 2026' }
        'article-20.html' = @{ Title = 'Diagnostica dell''overlay sottotitoli fullscreen nei giochi'; Description = 'Checklist rapida per diagnosticare i problemi dell''overlay sottotitoli fullscreen nei giochi.'; Date = '5 marzo 2026' }
        'article-21.html' = @{ Title = 'Sottotitoli Discord Voice Chat per squad internazionali'; Description = 'Workflow pratico di sottotitoli Discord per squad multilingue con callout rapidi.'; Date = '5 marzo 2026' }
        'article-22.html' = @{ Title = 'Migliori impostazioni overlay sottotitoli per FPS e MOBA'; Description = 'Impostazioni pratiche di posizione, densità e contrasto dell''overlay sottotitoli per FPS e MOBA.'; Date = '5 marzo 2026' }
    }
    'ja' = @{
        'article-19.html' = @{ Title = '競技ゲーム向けGame Mode字幕: 設定ガイド2026'; Description = '競技向けにGame Mode字幕を設定する実践ガイド。ロック動作、ボーダーレス全画面、ボイスコールアウトの明瞭化を解説。'; Date = '2026年3月5日' }
        'article-20.html' = @{ Title = 'ゲーム向けフルスクリーン字幕オーバーレイのトラブルシューティング'; Description = 'ゲームで発生するフルスクリーン字幕オーバーレイ問題を素早く診断するチェックリスト。'; Date = '2026年3月5日' }
        'article-21.html' = @{ Title = '国際スクワッド向けDiscord Voice Chat字幕'; Description = '多言語スクワッド向けのDiscord字幕ワークフロー。高速コールアウトでも理解しやすく。'; Date = '2026年3月5日' }
        'article-22.html' = @{ Title = 'FPSとMOBA向け字幕オーバーレイ最適設定'; Description = 'FPSとMOBAで見やすさを保つ字幕オーバーレイの位置・密度・コントラスト設定。'; Date = '2026年3月5日' }
    }
    'ko' = @{
        'article-19.html' = @{ Title = '경쟁 게임용 Game Mode 자막: 설정 가이드 2026'; Description = '경쟁전에서 Game Mode 자막을 안정적으로 설정하는 실전 가이드: 잠금 모드, 보더리스 전체화면, 음성 콜아웃 가독성.'; Date = '2026년 3월 5일' }
        'article-20.html' = @{ Title = '게임용 전체화면 자막 오버레이 문제 해결'; Description = '게임에서 전체화면 자막 오버레이 문제를 빠르게 진단하는 체크리스트.'; Date = '2026년 3월 5일' }
        'article-21.html' = @{ Title = '국제 스쿼드를 위한 Discord 음성 채팅 자막'; Description = '빠른 콜아웃 환경을 위한 다국어 스쿼드 Discord 자막 워크플로.'; Date = '2026년 3월 5일' }
        'article-22.html' = @{ Title = 'FPS와 MOBA를 위한 최적 자막 오버레이 설정'; Description = 'FPS/MOBA용 자막 오버레이 위치·밀도·대비 실전 설정.'; Date = '2026년 3월 5일' }
    }
    'zh' = @{
        'article-19.html' = @{ Title = '竞技游戏的 Game Mode 字幕：2026 设置指南'; Description = '面向竞技对局的 Game Mode 字幕实用设置指南：锁定模式、无边框全屏与语音报点清晰度。'; Date = '2026年3月5日' }
        'article-20.html' = @{ Title = '游戏全屏字幕覆盖层故障排查'; Description = '快速排查游戏全屏字幕覆盖层可见性与交互问题的清单。'; Date = '2026年3月5日' }
        'article-21.html' = @{ Title = '国际战队的 Discord 语音聊天字幕'; Description = '面向多语言战队的 Discord 字幕实战流程，适配高频语音报点。'; Date = '2026年3月5日' }
        'article-22.html' = @{ Title = 'FPS 与 MOBA 的最佳字幕覆盖层设置'; Description = 'FPS 与 MOBA 场景下字幕覆盖层的位置、密度与对比度最佳设置。'; Date = '2026年3月5日' }
    }
    'ar' = @{
        'article-19.html' = @{ Title = 'ترجمة وضع اللعب للألعاب التنافسية: دليل الإعداد 2026'; Description = 'دليل عملي لإعداد ترجمة Game Mode في اللعب التنافسي: وضع القفل، ملء الشاشة بلا حدود، ووضوح نداءات الصوت.'; Date = '5 مارس 2026' }
        'article-20.html' = @{ Title = 'استكشاف أخطاء طبقة الترجمة بملء الشاشة في الألعاب'; Description = 'قائمة فحص سريعة لتشخيص مشاكل طبقة الترجمة بملء الشاشة داخل الألعاب.'; Date = '5 مارس 2026' }
        'article-21.html' = @{ Title = 'ترجمة دردشة Discord الصوتية للفرق الدولية'; Description = 'سير عمل عملي لترجمة Discord للفرق متعددة اللغات مع نداءات سريعة.'; Date = '5 مارس 2026' }
        'article-22.html' = @{ Title = 'أفضل إعدادات طبقة الترجمة لألعاب FPS وMOBA'; Description = 'أفضل إعدادات الموضع والكثافة والتباين لطبقة الترجمة في FPS وMOBA.'; Date = '5 مارس 2026' }
    }
    'hi' = @{
        'article-19.html' = @{ Title = 'प्रतिस्पर्धी गेम्स के लिए Game Mode सबटाइटल: सेटअप गाइड 2026'; Description = 'प्रतिस्पर्धी मैचों के लिए Game Mode सबटाइटल सेट करने की व्यावहारिक गाइड: लॉक मोड, बॉर्डरलेस फुलस्क्रीन और वॉइस कॉलआउट स्पष्टता।'; Date = '5 मार्च 2026' }
        'article-20.html' = @{ Title = 'गेम्स में फुलस्क्रीन सबटाइटल ओवरले की समस्या-समाधान'; Description = 'गेम्स में फुलस्क्रीन सबटाइटल ओवरले समस्याओं के तेज़ निदान के लिए चेकलिस्ट।'; Date = '5 मार्च 2026' }
        'article-21.html' = @{ Title = 'अंतरराष्ट्रीय स्क्वाड्स के लिए Discord वॉइस चैट सबटाइटल'; Description = 'तेज़ कॉलआउट वाले बहुभाषी स्क्वाड्स के लिए Discord सबटाइटल वर्कफ़्लो।'; Date = '5 मार्च 2026' }
        'article-22.html' = @{ Title = 'FPS और MOBA के लिए सबसे अच्छे सबटाइटल ओवरले सेटिंग्स'; Description = 'FPS और MOBA के लिए सबटाइटल ओवरले की पोज़िशन, डेंसिटी और कॉन्ट्रास्ट की सर्वोत्तम सेटिंग्स।'; Date = '5 मार्च 2026' }
    }
    'pt' = @{
        'article-19.html' = @{ Title = 'Legendas Game Mode para jogos competitivos: guia de configuração 2026'; Description = 'Guia prático para configurar legendas Game Mode no competitivo: modo travado, borderless fullscreen e clareza dos callouts de voz.'; Date = '5 de março de 2026' }
        'article-20.html' = @{ Title = 'Diagnóstico do overlay de legendas em tela cheia para jogos'; Description = 'Checklist rápida para diagnosticar problemas do overlay de legendas em tela cheia nos jogos.'; Date = '5 de março de 2026' }
        'article-21.html' = @{ Title = 'Legendas no Discord Voice Chat para squads internacionais'; Description = 'Fluxo prático de legendas no Discord para squads multilíngues com callouts rápidos.'; Date = '5 de março de 2026' }
        'article-22.html' = @{ Title = 'Melhores configurações de overlay de legendas para FPS e MOBA'; Description = 'Ajustes práticos de posição, densidade e contraste do overlay de legendas para FPS e MOBA.'; Date = '5 de março de 2026' }
    }
    'pl' = @{
        'article-19.html' = @{ Title = 'Napisy Game Mode do gier rankingowych: poradnik konfiguracji 2026'; Description = 'Praktyczny poradnik konfiguracji napisów Game Mode w grach rankingowych: tryb blokady, borderless fullscreen i czytelne callouty głosowe.'; Date = '5 marca 2026' }
        'article-20.html' = @{ Title = 'Diagnostyka pełnoekranowej nakładki napisów w grach'; Description = 'Szybka checklista diagnozy problemów pełnoekranowej nakładki napisów w grach.'; Date = '5 marca 2026' }
        'article-21.html' = @{ Title = 'Napisy czatu głosowego Discord dla międzynarodowych składów'; Description = 'Praktyczny workflow napisów Discord dla wielojęzycznych składów z szybkimi calloutami.'; Date = '5 marca 2026' }
        'article-22.html' = @{ Title = 'Najlepsze ustawienia nakładki napisów dla FPS i MOBA'; Description = 'Najlepsze ustawienia pozycji, gęstości i kontrastu nakładki napisów dla FPS i MOBA.'; Date = '5 marca 2026' }
    }
    'nl' = @{
        'article-19.html' = @{ Title = 'Game Mode-ondertitels voor competitieve games: setupgids 2026'; Description = 'Praktische setupgids voor Game Mode-ondertitels in competitieve matches: lock-modus, borderless fullscreen en duidelijkere voice-callouts.'; Date = '5 maart 2026' }
        'article-20.html' = @{ Title = 'Probleemoplossing voor fullscreen-ondertiteloverlay in games'; Description = 'Snelle checklist voor het oplossen van fullscreen-ondertiteloverlayproblemen in games.'; Date = '5 maart 2026' }
        'article-21.html' = @{ Title = 'Discord voicechat-ondertitels voor internationale squads'; Description = 'Praktische Discord-ondertitelworkflow voor meertalige squads met snelle callouts.'; Date = '5 maart 2026' }
        'article-22.html' = @{ Title = 'Beste instellingen voor ondertiteloverlay in FPS en MOBA'; Description = 'Beste instellingen voor positie, dichtheid en contrast van ondertiteloverlay in FPS en MOBA.'; Date = '5 maart 2026' }
    }
    'tr' = @{
        'article-19.html' = @{ Title = 'Rekabetçi oyunlar için Game Mode altyazıları: kurulum rehberi 2026'; Description = 'Rekabetçi maçlar için Game Mode altyazılarını ayarlama rehberi: kilit modu, borderless fullscreen ve net sesli calloutlar.'; Date = '5 Mart 2026' }
        'article-20.html' = @{ Title = 'Oyunlar için tam ekran altyazı kaplaması sorun giderme'; Description = 'Oyunlarda tam ekran altyazı kaplaması sorunlarını hızlı teşhis etmek için kontrol listesi.'; Date = '5 Mart 2026' }
        'article-21.html' = @{ Title = 'Uluslararası takımlar için Discord sesli sohbet altyazıları'; Description = 'Hızlı callout yapılan çok dilli takımlar için pratik Discord altyazı iş akışı.'; Date = '5 Mart 2026' }
        'article-22.html' = @{ Title = 'FPS ve MOBA için en iyi altyazı kaplama ayarları'; Description = 'FPS ve MOBA için altyazı kaplamasında konum, yoğunluk ve kontrast ayarları.'; Date = '5 Mart 2026' }
    }
    'uk' = @{
        'article-19.html' = @{ Title = 'Субтитри Game Mode для змагальних ігор: гайд з налаштування 2026'; Description = 'Практичний гайд з налаштування субтитрів Game Mode у змагальних матчах: lock-режим, borderless fullscreen і чіткі голосові колаути.'; Date = '5 березня 2026' }
        'article-20.html' = @{ Title = 'Діагностика fullscreen-оверлею субтитрів в іграх'; Description = 'Швидкий чекліст діагностики проблем fullscreen-оверлею субтитрів в іграх.'; Date = '5 березня 2026' }
        'article-21.html' = @{ Title = 'Субтитри Discord Voice Chat для міжнародних сквадів'; Description = 'Практичний workflow субтитрів Discord для міжнародних сквадів із швидкими колаутами.'; Date = '5 березня 2026' }
        'article-22.html' = @{ Title = 'Найкращі налаштування subtitle overlay для FPS і MOBA'; Description = 'Найкращі налаштування позиції, щільності та контрасту subtitle overlay для FPS і MOBA.'; Date = '5 березня 2026' }
    }
}

$sourceArticles = @{}
foreach ($spec in $articleSpecs) {
    $sourcePath = Join-Path 'articles/en' $spec.Name
    if (-not (Test-Path $sourcePath)) {
        throw "Missing source article: $sourcePath"
    }
    $sourceArticles[$spec.Name] = [System.IO.File]::ReadAllText($sourcePath, $utf8NoBom)
}

function New-HreflangBlock {
    param([string]$ArticleName)

    $lines = @()
    $lines += "    <link rel=`"alternate`" hreflang=`"x-default`" href=`"https://live-subtitles.com/articles/en/$ArticleName`" />"
    foreach ($lang in $allLangs) {
        $lines += "    <link rel=`"alternate`" hreflang=`"$lang`" href=`"https://live-subtitles.com/articles/$lang/$ArticleName`" />"
    }
    return ($lines -join "`r`n")
}

function Get-LocalizedCardData {
    param(
        [string]$Lang,
        [hashtable]$Spec
    )

    if ($localizedCardData.ContainsKey($Lang) -and $localizedCardData[$Lang].ContainsKey($Spec.Name)) {
        return $localizedCardData[$Lang][$Spec.Name]
    }

    return @{
        Title = $Spec.Title
        Description = $Spec.Description
        Date = $Spec.Date
    }
}

function New-ArticleCardHtml {
    param(
        [string]$Name,
        [string]$Title,
        [string]$Description,
        [string]$Date
    )

    return @"
        <div class="article-card" itemscope itemtype="https://schema.org/Article">
            <a href="$Name" class="article-title" itemprop="headline">$Title</a>
            <div class="article-date" itemprop="datePublished" content="2026-03-05">$Date</div>
            <div class="article-desc" itemprop="description">$Description</div>
        </div>
"@
}

foreach ($lang in $targetLangs) {
    $langDir = Join-Path 'articles' $lang
    if (-not (Test-Path $langDir)) {
        New-Item -Path $langDir -ItemType Directory | Out-Null
    }

    foreach ($spec in $articleSpecs) {
        $articleName = $spec.Name
        $content = $sourceArticles[$articleName]
        $hreflangBlock = New-HreflangBlock -ArticleName $articleName
        $localized = Get-LocalizedCardData -Lang $lang -Spec $spec

        $content = $content.Replace('<html lang="en">', "<html lang=`"$lang`">")
        $content = [regex]::Replace(
            $content,
            '<link rel="canonical" href="[^"]+" />',
            "<link rel=`"canonical`" href=`"https://live-subtitles.com/articles/$lang/$articleName`" />",
            1
        )
        $content = [regex]::Replace(
            $content,
            '(?ms)<link rel="alternate" hreflang="x-default".*?<link rel="alternate" hreflang="ru" href="[^"]+" />',
            $hreflangBlock
        )
        $content = [regex]::Replace(
            $content,
            '<meta property="og:url" content="[^"]+">',
            "<meta property=`"og:url`" content=`"https://live-subtitles.com/articles/$lang/$articleName`">",
            1
        )
        $content = $content.Replace('href="/game-mode-subtitles.html"', "href=`"/$lang/game-mode-subtitles.html`"")
        $content = $content.Replace('href="/discord-twitch-subtitles.html"', "href=`"/$lang/discord-twitch-subtitles.html`"")
        $content = [regex]::Replace(
            $content,
            '<meta name="robots" content="[^"]+">',
            '<meta name="robots" content="index, follow">',
            1
        )
        $content = [regex]::Replace(
            $content,
            '"mainEntityOfPage":\s*"[^"]+"',
            "`"mainEntityOfPage`": `"https://live-subtitles.com/articles/$lang/$articleName`"",
            1
        )

        # Localize core SEO-visible article content for non-en locales.
        $content = [regex]::Replace(
            $content,
            '<title>.*?</title>',
            "<title>$($localized.Title) | Live Subtitles</title>",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<meta name="description" content="[^"]*">',
            "<meta name=`"description`" content=`"$($localized.Description)`">",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<meta property="og:title" content="[^"]*">',
            "<meta property=`"og:title`" content=`"$($localized.Title)`">",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<meta property="og:description" content="[^"]*">',
            "<meta property=`"og:description`" content=`"$($localized.Description)`">",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<meta name="twitter:title" content="[^"]*">',
            "<meta name=`"twitter:title`" content=`"$($localized.Title)`">",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<meta name="twitter:description" content="[^"]*">',
            "<meta name=`"twitter:description`" content=`"$($localized.Description)`">",
            1
        )
        $content = [regex]::Replace(
            $content,
            '"headline": "[^"]+"',
            "`"headline`": `"$($localized.Title)`"",
            1
        )
        $content = [regex]::Replace(
            $content,
            '"description": "[^"]+"',
            "`"description`": `"$($localized.Description)`"",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<h1 class="article-title" itemprop="headline">.*?</h1>',
            "<h1 class=`"article-title`" itemprop=`"headline`">$($localized.Title)</h1>",
            1
        )
        $content = [regex]::Replace(
            $content,
            '<div class="article-date" itemprop="datePublished" content="2026-03-05">.*?</div>',
            "<div class=`"article-date`" itemprop=`"datePublished`" content=`"2026-03-05`">$($localized.Date)</div>",
            1
        )

        [System.IO.File]::WriteAllText((Join-Path $langDir $articleName), $content, $utf8NoBom)
    }

    $indexPath = Join-Path $langDir 'index.html'
    if (Test-Path $indexPath) {
        $indexContent = [System.IO.File]::ReadAllText($indexPath, $utf8NoBom)
        $cardsToAppend = ''

        foreach ($spec in $articleSpecs) {
            $cardData = Get-LocalizedCardData -Lang $lang -Spec $spec
            $newCard = New-ArticleCardHtml -Name $spec.Name -Title $cardData.Title -Description $cardData.Description -Date $cardData.Date
            $cardPattern = '(?s)<div class="article-card" itemscope itemtype="https://schema\.org/Article">\s*<a href="' + [regex]::Escape($spec.Name) + '" class="article-title" itemprop="headline">.*?</div>\s*</div>'

            if ([regex]::IsMatch($indexContent, $cardPattern)) {
                $indexContent = [regex]::Replace($indexContent, $cardPattern, $newCard, 1)
            } else {
                $cardsToAppend += $newCard
            }
        }

        if (-not [string]::IsNullOrWhiteSpace($cardsToAppend)) {
            $regex = [regex]::new(
                '</div>\s*</body>',
                [System.Text.RegularExpressions.RegexOptions]::Singleline `
                -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase `
                -bor [System.Text.RegularExpressions.RegexOptions]::RightToLeft
            )
            $indexContent = $regex.Replace($indexContent, "$cardsToAppend`r`n    </div>`r`n</body>", 1)
        }

        [System.IO.File]::WriteAllText($indexPath, $indexContent, $utf8NoBom)
    }
}

Write-Host "Expanded and localized article-19/article-20/article-21/article-22 across locales."
