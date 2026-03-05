# ========================================
# SITEMAP AUTO-GENERATION SCRIPT
# Purpose: Generate sitemap.xml with localized pages and articles
# ========================================

param(
    [string]$Domain = "https://live-subtitles.com",
    [string]$ArticlesPath = "articles",
    [string]$OutputFile = "sitemap.xml",
    [string[]]$StaticPages = @(
        "netflix-subtitles.html",
        "google-meet-live-captions.html",
        "zoom-live-captions.html",
        "youtube-dual-subtitles.html",
        "teams-live-captions.html",
        "discord-twitch-subtitles.html",
        "game-mode-subtitles.html",
        "privacy.html"
    )
)

Write-Host "=== SITEMAP GENERATOR ===" -ForegroundColor Green
Write-Host "Domain: $Domain" -ForegroundColor Cyan
Write-Host "Articles path: $ArticlesPath" -ForegroundColor Cyan
Write-Host "Output file: $OutputFile" -ForegroundColor Cyan

$currentDate = (Get-Date).ToString("yyyy-MM-dd")

$languageFolders = Get-ChildItem -Path $ArticlesPath -Directory | Where-Object { $_.Name -match '^[a-z]{2}$' }
$allLanguages = @($languageFolders | ForEach-Object { $_.Name } | Sort-Object)

if ($allLanguages.Count -eq 0) {
    throw "No language folders found in '$ArticlesPath'."
}

$landingLanguages = @($allLanguages | Where-Object { $_ -ne 'en' })

function New-HreflangLinks {
    param(
        [hashtable]$LanguageToHref,
        [string]$XDefaultHref = ""
    )

    $links = ""

    if ($XDefaultHref) {
        $links += "        <xhtml:link rel=`"alternate`" hreflang=`"x-default`" href=`"$XDefaultHref`" />`r`n"
    }

    foreach ($lang in ($LanguageToHref.Keys | Sort-Object)) {
        $href = $LanguageToHref[$lang]
        $links += "        <xhtml:link rel=`"alternate`" hreflang=`"$lang`" href=`"$href`" />`r`n"
    }

    return $links
}

function Get-IsoLastMod {
    param(
        [string]$Path,
        [string]$FallbackDate
    )

    if ([string]::IsNullOrWhiteSpace($Path)) { return $FallbackDate }
    if (Test-Path $Path) {
        return (Get-Item $Path).LastWriteTime.ToString("yyyy-MM-dd")
    }
    return $FallbackDate
}

function Test-IsIndexable {
    param(
        [string]$Path
    )

    if ([string]::IsNullOrWhiteSpace($Path)) { return $false }
    if (-not (Test-Path $Path)) { return $false }

    $fullPath = (Resolve-Path $Path).Path
    $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    $hasNoIndex = [regex]::IsMatch(
        $content,
        '(?is)<meta\s+name=["'']robots["'']\s+content=["''][^"''>]*\bnoindex\b'
    )

    return (-not $hasNoIndex)
}

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
"@

# Landing pages with hreflang
$landingHrefMap = @{}
$landingHrefMap['en'] = "$Domain/"
foreach ($lang in $landingLanguages) {
    $landingHrefMap[$lang] = "$Domain/$lang/"
}
$landingHreflang = New-HreflangLinks -LanguageToHref $landingHrefMap -XDefaultHref "$Domain/"
$rootLastMod = Get-IsoLastMod -Path "index.html" -FallbackDate $currentDate

$xml += @"
    <url>
        <loc>$Domain/</loc>
        <lastmod>$rootLastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
$landingHreflang    </url>
"@

foreach ($lang in $landingLanguages) {
    $landingPath = Join-Path -Path $lang -ChildPath "index.html"
    $landingLastMod = Get-IsoLastMod -Path $landingPath -FallbackDate $currentDate
    $xml += @"
    <url>
        <loc>$Domain/$lang/</loc>
        <lastmod>$landingLastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
$landingHreflang    </url>
"@
}

# Static SEO pages (root + localized variants when available)
foreach ($page in $StaticPages) {
    $cleanPage = $page.TrimStart('/')
    $staticHrefMap = @{}

    if (Test-IsIndexable -Path $cleanPage) {
        $staticHrefMap['en'] = "$Domain/$cleanPage"
    }

    foreach ($lang in $landingLanguages) {
        $localizedPath = Join-Path -Path $lang -ChildPath $cleanPage
        if (Test-IsIndexable -Path $localizedPath) {
            $staticHrefMap[$lang] = "$Domain/$lang/$cleanPage"
        }
    }

    if ($staticHrefMap.Count -eq 0) { continue }

    $staticXDefaultHref = if ($staticHrefMap.ContainsKey('en')) {
        $staticHrefMap['en']
    } else {
        $firstLang = ($staticHrefMap.Keys | Sort-Object | Select-Object -First 1)
        $staticHrefMap[$firstLang]
    }
    $staticHreflang = New-HreflangLinks -LanguageToHref $staticHrefMap -XDefaultHref $staticXDefaultHref

    foreach ($lang in ($staticHrefMap.Keys | Sort-Object)) {
        $loc = $staticHrefMap[$lang]
        $priority = if ($lang -eq 'en') { '0.85' } else { '0.75' }
        $pagePath = if ($lang -eq 'en') { $cleanPage } else { Join-Path -Path $lang -ChildPath $cleanPage }
        $staticLastMod = Get-IsoLastMod -Path $pagePath -FallbackDate $currentDate
        $xml += @"
    <url>
        <loc>$loc</loc>
        <lastmod>$staticLastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>$priority</priority>
$staticHreflang    </url>
"@
    }
}

# Article index pages by language
$indexLanguages = @($allLanguages | Where-Object {
    Test-IsIndexable -Path (Join-Path -Path (Join-Path $ArticlesPath $_) -ChildPath "index.html")
})
$indexHrefMap = @{}
foreach ($lang in $indexLanguages) {
    $indexHrefMap[$lang] = "$Domain/$ArticlesPath/$lang/"
}
$indexXDefaultHref = if ($indexHrefMap.ContainsKey('en')) {
    $indexHrefMap['en']
} elseif ($indexHrefMap.Count -gt 0) {
    $firstIndexLang = ($indexHrefMap.Keys | Sort-Object | Select-Object -First 1)
    $indexHrefMap[$firstIndexLang]
} else {
    ''
}
$indexHreflang = if ($indexHrefMap.Count -gt 0) {
    New-HreflangLinks -LanguageToHref $indexHrefMap -XDefaultHref $indexXDefaultHref
} else {
    ''
}

foreach ($lang in $indexLanguages) {
    $indexPath = Join-Path -Path (Join-Path $ArticlesPath $lang) -ChildPath "index.html"
    $indexLastMod = Get-IsoLastMod -Path $indexPath -FallbackDate $currentDate
    $xml += @"
    <url>
        <loc>$Domain/$ArticlesPath/$lang/</loc>
        <lastmod>$indexLastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
$indexHreflang    </url>
"@
}

# Collect unique article files (article-*.html)
$allArticles = New-Object System.Collections.Generic.HashSet[string]
foreach ($lang in $allLanguages) {
    $langPath = Join-Path -Path $ArticlesPath -ChildPath $lang
    if (-not (Test-Path $langPath)) { continue }

    Get-ChildItem -Path $langPath -Filter "article-*.html" | ForEach-Object {
        [void]$allArticles.Add($_.Name)
    }
}

$sortedArticles = @($allArticles | Sort-Object)

foreach ($article in $sortedArticles) {
    $availableArticleLanguages = @()
    foreach ($lang in $allLanguages) {
        $articlePath = Join-Path -Path (Join-Path $ArticlesPath $lang) -ChildPath $article
        if (Test-IsIndexable -Path $articlePath) {
            $availableArticleLanguages += $lang
        }
    }

    if ($availableArticleLanguages.Count -eq 0) { continue }

    $articleHrefMap = @{}
    foreach ($lang in $availableArticleLanguages) {
        $articleHrefMap[$lang] = "$Domain/$ArticlesPath/$lang/$article"
    }

    $articleXDefaultHref = if ($articleHrefMap.ContainsKey('en')) {
        $articleHrefMap['en']
    } else {
        $firstArticleLang = ($articleHrefMap.Keys | Sort-Object | Select-Object -First 1)
        $articleHrefMap[$firstArticleLang]
    }
    $articleHreflang = New-HreflangLinks -LanguageToHref $articleHrefMap -XDefaultHref $articleXDefaultHref
    $xml += "`r`n    <!-- $article -->"

    foreach ($lang in $availableArticleLanguages) {
        $articlePath = Join-Path -Path (Join-Path $ArticlesPath $lang) -ChildPath $article
        $articleLastMod = Get-IsoLastMod -Path $articlePath -FallbackDate $currentDate
        $xml += @"

    <url>
        <loc>$Domain/$ArticlesPath/$lang/$article</loc>
        <lastmod>$articleLastMod</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
$articleHreflang    </url>
"@
    }
}

$xml += @"

</urlset>
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputFile)) {
    $OutputFile
} else {
    Join-Path -Path (Get-Location) -ChildPath $OutputFile
}
[System.IO.File]::WriteAllText($outputPath, $xml, $utf8NoBom)

$urlCount = ([regex]::Matches($xml, "<loc>")).Count
$hreflangCount = ([regex]::Matches($xml, "hreflang=")).Count

Write-Host "=== RESULT ===" -ForegroundColor Green
Write-Host "File created: $OutputFile" -ForegroundColor Yellow
Write-Host "Total URLs: $urlCount" -ForegroundColor Yellow
Write-Host "Total hreflang links: $hreflangCount" -ForegroundColor Yellow
Write-Host "Last updated: $currentDate" -ForegroundColor Yellow
Write-Host "Sitemap generated successfully." -ForegroundColor Green
