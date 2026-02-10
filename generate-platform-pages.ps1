param(
    [string[]]$Pages = @(
        "netflix-subtitles.html",
        "google-meet-live-captions.html",
        "zoom-live-captions.html",
        "youtube-dual-subtitles.html",
        "teams-live-captions.html",
        "discord-twitch-subtitles.html"
    ),
    [string[]]$Languages = @("ru", "fr", "es", "de", "it", "ja", "ko", "zh", "ar", "hi", "pt", "pl", "nl", "tr", "uk")
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$allLangs = @("en") + $Languages

function New-HreflangBlock {
    param(
        [string]$PageName
    )

    $lines = @()
    $lines += "    <link rel=`"alternate`" hreflang=`"x-default`" href=`"https://live-subtitles.com/$PageName`" />"
    $lines += "    <link rel=`"alternate`" hreflang=`"en`" href=`"https://live-subtitles.com/$PageName`" />"

    foreach ($lang in $Languages) {
        $lines += "    <link rel=`"alternate`" hreflang=`"$lang`" href=`"https://live-subtitles.com/$lang/$PageName`" />"
    }

    return ($lines -join "`r`n") + "`r`n"
}

foreach ($page in $Pages) {
    if (-not (Test-Path $page)) {
        Write-Warning "Source page not found: $page"
        continue
    }

    $sourcePath = (Resolve-Path $page).Path
    $source = [System.IO.File]::ReadAllText($sourcePath, $utf8NoBom)

    $hreflangBlock = New-HreflangBlock -PageName $page
    $variants = @("en") + $Languages

    foreach ($variant in $variants) {
        $content = $source
        $url = if ($variant -eq "en") {
            "https://live-subtitles.com/$page"
        } else {
            "https://live-subtitles.com/$variant/$page"
        }

        $langCode = if ($variant -eq "en") { "en" } else { $variant }
        $homeUrl = if ($variant -eq "en") { "/" } else { "/$variant/" }

        $content = [regex]::Replace($content, '<html lang="[^"]+">', "<html lang=`"$langCode`">")
        $content = [regex]::Replace($content, '<link rel="canonical" href="https://live-subtitles\.com[^"]*" />', "<link rel=`"canonical`" href=`"$url`" />")
        $content = [regex]::Replace($content, '<meta property="og:url" content="https://live-subtitles\.com[^"]*">', "<meta property=`"og:url`" content=`"$url`">")

        # Keep JSON-LD URLs aligned with the localized page URL.
        $content = $content.Replace("https://live-subtitles.com/$page", $url)
        if ($variant -ne "en") {
            $content = $content.Replace('"item": "https://live-subtitles.com/"', '"item": "https://live-subtitles.com/' + $variant + '/"')
        }

        $content = [regex]::Replace(
            $content,
            '(?ms)(\s*<link rel="canonical" href="https://live-subtitles\.com[^"]*" />\r?\n)(?:\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" />\r?\n)*',
            "`$1$hreflangBlock"
        )

        # Localized breadcrumb home link and platform cross-links.
        $content = $content.Replace('href="/"', "href=`"$homeUrl`"")
        if ($variant -ne "en") {
            foreach ($targetPage in $Pages) {
                $content = $content.Replace("href=`"/$targetPage`"", "href=`"/$variant/$targetPage`"")
            }
        }

        $outPath = if ($variant -eq "en") {
            (Resolve-Path $page).Path
        } else {
            $langDir = Join-Path (Get-Location) $variant
            if (-not (Test-Path $langDir)) {
                New-Item -Path $langDir -ItemType Directory | Out-Null
            }
            Join-Path $langDir $page
        }

        [System.IO.File]::WriteAllText($outPath, $content, $utf8NoBom)
    }

    Write-Host "Updated platform page family: $page"
}

Write-Host "Done. Generated/updated localized platform pages for $($Pages.Count) pages and $($Languages.Count) languages."
