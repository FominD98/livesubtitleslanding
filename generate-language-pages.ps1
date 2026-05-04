param(
    [string]$SourceFile = "index.html",
    [string[]]$Languages = @("ru", "fr", "es", "de", "it", "ja", "ko", "zh", "ar", "hi", "pt", "pl", "nl", "tr", "uk")
)

if (-not (Test-Path $SourceFile)) {
    throw "Source file not found: $SourceFile"
}

$utf8 = [System.Text.UTF8Encoding]::new($false)
$sourceFullPath = (Resolve-Path $SourceFile).Path
$sourceContent = [System.IO.File]::ReadAllText($sourceFullPath, $utf8)

foreach ($lang in $Languages) {
    $content = $sourceContent
    $content = $content.Replace('<html lang="en">', '<html lang="' + $lang + '">')
    $content = $content.Replace('<link rel="canonical" href="https://live-subtitles.com/" />', '<link rel="canonical" href="https://live-subtitles.com/' + $lang + '/" />')
    $content = $content.Replace('<meta property="og:url" content="https://live-subtitles.com">', '<meta property="og:url" content="https://live-subtitles.com/' + $lang + '/">')

    # Locale pages are one folder deeper than root index.html.
    $content = $content.Replace('href="sitemap.xml"', 'href="../sitemap.xml"')
    $content = $content.Replace('href="2sub.ico"', 'href="../2sub.ico"')
    $content = $content.Replace('src="translations.js"', 'src="../translations.js"')
    $content = $content.Replace('src="img/', 'src="../img/')
    $content = $content.Replace('href="articles/ru/"', 'href="../articles/ru/"')

    # Keep platform solution links language-consistent.
    $content = $content.Replace('href="/netflix-subtitles.html"', 'href="/' + $lang + '/netflix-subtitles.html"')
    $content = $content.Replace('href="/google-meet-live-captions.html"', 'href="/' + $lang + '/google-meet-live-captions.html"')
    $content = $content.Replace('href="/zoom-live-captions.html"', 'href="/' + $lang + '/zoom-live-captions.html"')
    $content = $content.Replace('href="/youtube-dual-subtitles.html"', 'href="/' + $lang + '/youtube-dual-subtitles.html"')
    $content = $content.Replace('href="/teams-live-captions.html"', 'href="/' + $lang + '/teams-live-captions.html"')
    $content = $content.Replace('href="/discord-twitch-subtitles.html"', 'href="/' + $lang + '/discord-twitch-subtitles.html"')

    $langDir = Join-Path (Get-Location) $lang
    if (-not (Test-Path $langDir)) {
        New-Item -Path $langDir -ItemType Directory | Out-Null
    }

    $outputFile = Join-Path $langDir "index.html"
    [System.IO.File]::WriteAllText($outputFile, $content, $utf8)
    Write-Host "Generated: $outputFile"
}

Write-Host "Done. Generated $($Languages.Count) localized landing pages from $SourceFile."

# SEO rule R1: locale shells just generated above contain whatever
# language the source HTML happens to use as fallback (typically a mix of
# EN and RU). Bake the proper per-locale defaults from translations.js
# now so Googlebot never sees a /xx/ page in the wrong language.
Write-Host ""
Write-Host "Baking i18n defaults (R1)..." -ForegroundColor Cyan
$bakeScript = Join-Path (Get-Location) "bake-i18n-defaults.js"
if (Test-Path $bakeScript) {
    & node $bakeScript
    if ($LASTEXITCODE -ne 0) {
        throw "bake-i18n-defaults.js failed with exit code $LASTEXITCODE"
    }
} else {
    Write-Warning "bake-i18n-defaults.js not found - locale defaults left in source language."
    Write-Warning "Locale pages will fail SEO rule R1 until this is fixed."
}
