param()

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$langs = @('en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')

foreach ($lang in $langs) {
    $path = if ($lang -eq 'en') { 'game-mode-subtitles.html' } else { Join-Path $lang 'game-mode-subtitles.html' }
    if (-not (Test-Path $path)) { continue }

    $content = [System.IO.File]::ReadAllText($path, $utf8NoBom)
    $url = if ($lang -eq 'en') {
        'https://live-subtitles.com/game-mode-subtitles.html'
    } else {
        "https://live-subtitles.com/$lang/game-mode-subtitles.html"
    }

    $content = [regex]::Replace($content, '<html lang="[^"]+">', "<html lang=`"$lang`">", 1)
    $content = [regex]::Replace($content, '<meta name="robots" content="[^"]+">', '<meta name="robots" content="index, follow">', 1)
    $content = [regex]::Replace($content, '<link rel="canonical" href="[^"]+" />', "<link rel=`"canonical`" href=`"$url`" />", 1)
    $content = [regex]::Replace($content, '<meta property="og:url" content="[^"]+">', "<meta property=`"og:url`" content=`"$url`">", 1)

    # Ensure local article links for each locale.
    $content = [regex]::Replace($content, 'href="/articles/en/article-19\.html"', "href=`"/articles/$lang/article-19.html`"")
    $content = [regex]::Replace($content, 'href="/articles/en/article-20\.html"', "href=`"/articles/$lang/article-20.html`"")
    $content = [regex]::Replace($content, 'href="/articles/en/article-21\.html"', "href=`"/articles/$lang/article-21.html`"")
    $content = [regex]::Replace($content, 'href="/articles/en/article-22\.html"', "href=`"/articles/$lang/article-22.html`"")
    $content = [regex]::Replace($content, 'href="/articles/ru/article-19\.html"', "href=`"/articles/$lang/article-19.html`"")
    $content = [regex]::Replace($content, 'href="/articles/ru/article-20\.html"', "href=`"/articles/$lang/article-20.html`"")
    $content = [regex]::Replace($content, 'href="/articles/ru/article-21\.html"', "href=`"/articles/$lang/article-21.html`"")
    $content = [regex]::Replace($content, 'href="/articles/ru/article-22\.html"', "href=`"/articles/$lang/article-22.html`"")

    # Add ru hreflang if missing.
    if (-not $content.Contains('hreflang="ru"')) {
        $content = $content.Replace(
            '<link rel="alternate" hreflang="en" href="https://live-subtitles.com/game-mode-subtitles.html" />',
            "<link rel=`"alternate`" hreflang=`"en`" href=`"https://live-subtitles.com/game-mode-subtitles.html`" />`r`n    <link rel=`"alternate`" hreflang=`"ru`" href=`"https://live-subtitles.com/ru/game-mode-subtitles.html`" />"
        )
    }

    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

Write-Host "Stabilized game-mode SEO rules by locale."
