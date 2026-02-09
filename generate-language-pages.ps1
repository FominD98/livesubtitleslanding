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

    $langDir = Join-Path (Get-Location) $lang
    if (-not (Test-Path $langDir)) {
        New-Item -Path $langDir -ItemType Directory | Out-Null
    }

    $outputFile = Join-Path $langDir "index.html"
    [System.IO.File]::WriteAllText($outputFile, $content, $utf8)
    Write-Host "Generated: $outputFile"
}

Write-Host "Done. Generated $($Languages.Count) localized landing pages from $SourceFile."
