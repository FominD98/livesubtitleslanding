param()

$ErrorActionPreference = "Stop"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$langs = @('en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')
$articleNames = @('article-19.html','article-20.html','article-21.html','article-22.html')
$platformPages = @(
    'netflix-subtitles.html',
    'google-meet-live-captions.html',
    'zoom-live-captions.html',
    'youtube-dual-subtitles.html',
    'teams-live-captions.html',
    'discord-twitch-subtitles.html'
)

$downloadByLang = @{
    'en' = 'Download from Microsoft Store'
    'ru' = 'Скачать в Microsoft Store'
    'fr' = 'Télécharger depuis Microsoft Store'
    'es' = 'Descargar desde Microsoft Store'
    'de' = 'Aus dem Microsoft Store herunterladen'
    'it' = 'Scarica da Microsoft Store'
    'ja' = 'Microsoft Storeからダウンロード'
    'ko' = 'Microsoft Store에서 다운로드'
    'zh' = '从微软商店下载'
    'ar' = 'تحميل من متجر مايكروسوفت'
    'hi' = 'Microsoft Store से डाउनलोड करें'
    'pt' = 'Baixar da Microsoft Store'
    'pl' = 'Pobierz z Microsoft Store'
    'nl' = 'Download van Microsoft Store'
    'tr' = "Microsoft Store'dan İndir"
    'uk' = 'Завантажити з Microsoft Store'
}

function Set-FirstRegex {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Replacement
    )

    return [regex]::Replace($Content, $Pattern, $Replacement, 1)
}

function Normalize-DownloadButtonText {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$TargetText
    )

    foreach ($candidate in $downloadByLang.Values) {
        if ($candidate -ne $TargetText) {
            $Content = $Content.Replace($candidate, $TargetText)
        }
    }

    return $Content.Replace('Download from Microsoft Store', $TargetText)
}

function Get-ArticleHeadlineText {
    param(
        [Parameter(Mandatory = $true)][string]$Lang,
        [Parameter(Mandatory = $true)][string]$ArticleName
    )

    $path = Join-Path $PSScriptRoot "articles\$Lang\$ArticleName"
    if (-not (Test-Path $path)) { return $null }

    $content = [System.IO.File]::ReadAllText($path, $utf8NoBom)
    $match = [regex]::Match(
        $content,
        '(?is)<h1 class="article-title" itemprop="headline">\s*(?<headline>.*?)\s*</h1>'
    )

    if (-not $match.Success) { return $null }

    $headline = $match.Groups['headline'].Value
    $headline = [regex]::Replace($headline, '\s+', ' ').Trim()
    return [System.Net.WebUtility]::HtmlDecode($headline)
}

function Get-GameModeHeadlineText {
    param(
        [Parameter(Mandatory = $true)][string]$Lang
    )

    $path = if ($Lang -eq 'en') {
        Join-Path $PSScriptRoot 'game-mode-subtitles.html'
    } else {
        Join-Path $PSScriptRoot "$Lang\game-mode-subtitles.html"
    }
    if (-not (Test-Path $path)) { return $null }

    $content = [System.IO.File]::ReadAllText($path, $utf8NoBom)
    $match = [regex]::Match($content, '(?is)<h1>\s*(?<headline>.*?)\s*</h1>')
    if (-not $match.Success) { return $null }

    $headline = $match.Groups['headline'].Value
    $headline = [regex]::Replace($headline, '\s+', ' ').Trim()
    return [System.Net.WebUtility]::HtmlDecode($headline)
}

function Set-AnchorText {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Href,
        [Parameter(Mandatory = $true)][string]$Text
    )

    $pattern = '(?is)<a\s+href="' + [regex]::Escape($Href) + '">.*?</a>'
    $encodedText = [System.Net.WebUtility]::HtmlEncode($Text)
    $replacement = "<a href=`"$Href`">$encodedText</a>"

    return [regex]::Replace(
        $Content,
        $pattern,
        [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacement },
        1
    )
}

# Cache local article headlines once and reuse for game-mode link labels.
$headlineCache = @{}
foreach ($lang in $langs) {
    $headlineCache[$lang] = @{}
    foreach ($articleName in $articleNames) {
        $headlineCache[$lang][$articleName] = Get-ArticleHeadlineText -Lang $lang -ArticleName $articleName
    }
}

$gameHeadlineCache = @{}
foreach ($lang in $langs) {
    $gameHeadlineCache[$lang] = Get-GameModeHeadlineText -Lang $lang
}

foreach ($lang in $langs) {
    $downloadText = if ($downloadByLang.ContainsKey($lang)) { $downloadByLang[$lang] } else { $downloadByLang['en'] }

    $gamePath = if ($lang -eq 'en') {
        Join-Path $PSScriptRoot 'game-mode-subtitles.html'
    } else {
        Join-Path $PSScriptRoot "$lang\game-mode-subtitles.html"
    }

    if (Test-Path $gamePath) {
        $gameUrl = if ($lang -eq 'en') {
            'https://live-subtitles.com/game-mode-subtitles.html'
        } else {
            "https://live-subtitles.com/$lang/game-mode-subtitles.html"
        }

        $content = [System.IO.File]::ReadAllText($gamePath, $utf8NoBom)
        $content = Set-FirstRegex -Content $content -Pattern '<html lang="[^"]+">' -Replacement "<html lang=`"$lang`">"
        $content = Set-FirstRegex -Content $content -Pattern '<meta name="robots" content="[^"]+">' -Replacement '<meta name="robots" content="index, follow">'
        $content = Set-FirstRegex -Content $content -Pattern '<link rel="canonical" href="[^"]+" />' -Replacement "<link rel=`"canonical`" href=`"$gameUrl`" />"
        $content = Set-FirstRegex -Content $content -Pattern '<meta property="og:url" content="[^"]+">' -Replacement "<meta property=`"og:url`" content=`"$gameUrl`">"

        foreach ($articleName in $articleNames) {
            $localArticleUrl = "/articles/$lang/$articleName"
            $content = $content.Replace("/articles/en/$articleName", $localArticleUrl)
            $content = $content.Replace("/articles/ru/$articleName", $localArticleUrl)
        }

        if ($lang -eq 'en') {
            $content = $content.Replace('href="discord-twitch-subtitles.html"', 'href="/discord-twitch-subtitles.html"')
        } else {
            $content = $content.Replace('href="/"', "href=`"/$lang/`"")
            $content = $content.Replace('href="discord-twitch-subtitles.html"', "href=`"/$lang/discord-twitch-subtitles.html`"")
        }

        foreach ($articleName in $articleNames) {
            $localArticleUrl = "/articles/$lang/$articleName"
            $headline = $headlineCache[$lang][$articleName]
            if (-not [string]::IsNullOrWhiteSpace($headline)) {
                $content = Set-AnchorText -Content $content -Href $localArticleUrl -Text $headline
            }
        }

        $content = Normalize-DownloadButtonText -Content $content -TargetText $downloadText
        [System.IO.File]::WriteAllText($gamePath, $content, $utf8NoBom)
    }

    foreach ($articleName in $articleNames) {
        $articlePath = Join-Path $PSScriptRoot "articles\$lang\$articleName"
        if (-not (Test-Path $articlePath)) { continue }

        $articleUrl = "https://live-subtitles.com/articles/$lang/$articleName"
        $gameHref = if ($lang -eq 'en') { '/game-mode-subtitles.html' } else { "/$lang/game-mode-subtitles.html" }
        $discordHref = if ($lang -eq 'en') { '/discord-twitch-subtitles.html' } else { "/$lang/discord-twitch-subtitles.html" }

        $content = [System.IO.File]::ReadAllText($articlePath, $utf8NoBom)
        $content = Set-FirstRegex -Content $content -Pattern '<html lang="[^"]+">' -Replacement "<html lang=`"$lang`">"
        $content = Set-FirstRegex -Content $content -Pattern '<meta name="robots" content="[^"]+">' -Replacement '<meta name="robots" content="index, follow">'
        $content = Set-FirstRegex -Content $content -Pattern '<link rel="canonical" href="[^"]+" />' -Replacement "<link rel=`"canonical`" href=`"$articleUrl`" />"
        $content = Set-FirstRegex -Content $content -Pattern '<meta property="og:url" content="[^"]+">' -Replacement "<meta property=`"og:url`" content=`"$articleUrl`">"
        $content = Set-FirstRegex -Content $content -Pattern '"mainEntityOfPage":\s*"[^"]+"' -Replacement "`"mainEntityOfPage`": `"$articleUrl`""

        $content = $content.Replace('href="/game-mode-subtitles.html"', "href=`"$gameHref`"")
        $content = $content.Replace('href="/discord-twitch-subtitles.html"', "href=`"$discordHref`"")

        $content = Normalize-DownloadButtonText -Content $content -TargetText $downloadText
        [System.IO.File]::WriteAllText($articlePath, $content, $utf8NoBom)
    }

    foreach ($platformPage in $platformPages) {
        $platformPath = if ($lang -eq 'en') {
            Join-Path $PSScriptRoot $platformPage
        } else {
            Join-Path $PSScriptRoot "$lang\$platformPage"
        }
        if (-not (Test-Path $platformPath)) { continue }

        $platformUrl = if ($lang -eq 'en') {
            "https://live-subtitles.com/$platformPage"
        } else {
            "https://live-subtitles.com/$lang/$platformPage"
        }

        $platformContent = [System.IO.File]::ReadAllText($platformPath, $utf8NoBom)
        $platformContent = Set-FirstRegex -Content $platformContent -Pattern '<html lang="[^"]+">' -Replacement "<html lang=`"$lang`">"
        $platformContent = Set-FirstRegex -Content $platformContent -Pattern '<meta name="robots" content="[^"]+">' -Replacement '<meta name="robots" content="index, follow">'
        $platformContent = Set-FirstRegex -Content $platformContent -Pattern '<link rel="canonical" href="[^"]+" />' -Replacement "<link rel=`"canonical`" href=`"$platformUrl`" />"
        $platformContent = Set-FirstRegex -Content $platformContent -Pattern '<meta property="og:url" content="[^"]+">' -Replacement "<meta property=`"og:url`" content=`"$platformUrl`">"

        $gameLocalUrl = if ($lang -eq 'en') { '/game-mode-subtitles.html' } else { "/$lang/game-mode-subtitles.html" }
        $platformContent = [regex]::Replace(
            $platformContent,
            'href="/(?:[a-z]{2}/)*game-mode-subtitles\.html"',
            "href=`"$gameLocalUrl`""
        )

        foreach ($articleName in $articleNames) {
            $localArticleUrl = "/articles/$lang/$articleName"
            $platformContent = $platformContent.Replace("/articles/en/$articleName", $localArticleUrl)
            $platformContent = $platformContent.Replace("/articles/ru/$articleName", $localArticleUrl)
        }

        $gameHeadline = $gameHeadlineCache[$lang]
        if (-not [string]::IsNullOrWhiteSpace($gameHeadline)) {
            $platformContent = Set-AnchorText -Content $platformContent -Href $gameLocalUrl -Text $gameHeadline
        }
        foreach ($articleName in $articleNames) {
            $localArticleUrl = "/articles/$lang/$articleName"
            $headline = $headlineCache[$lang][$articleName]
            if (-not [string]::IsNullOrWhiteSpace($headline)) {
                $platformContent = Set-AnchorText -Content $platformContent -Href $localArticleUrl -Text $headline
            }
        }

        $platformContent = Normalize-DownloadButtonText -Content $platformContent -TargetText $downloadText
        [System.IO.File]::WriteAllText($platformPath, $platformContent, $utf8NoBom)
    }
}

Write-Host "Finalized game-cluster SEO and core localization across all locales."
