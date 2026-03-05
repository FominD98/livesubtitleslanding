param()

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$langs = @('en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')
$platformPages = @(
    'netflix-subtitles.html',
    'google-meet-live-captions.html',
    'zoom-live-captions.html',
    'youtube-dual-subtitles.html',
    'teams-live-captions.html',
    'discord-twitch-subtitles.html'
)

foreach ($lang in $langs) {
    foreach ($page in $platformPages) {
        $path = if ($lang -eq 'en') { $page } else { Join-Path $lang $page }
        if (-not (Test-Path $path)) { continue }

        $content = [System.IO.File]::ReadAllText($path, $utf8NoBom)
        $gameUrl = if ($lang -eq 'en') { '/game-mode-subtitles.html' } else { "/$lang/game-mode-subtitles.html" }
        $article19Url = "/articles/$lang/article-19.html"
        $article20Url = "/articles/$lang/article-20.html"
        $article21Url = "/articles/$lang/article-21.html"
        $article22Url = "/articles/$lang/article-22.html"

        $toAdd = New-Object System.Collections.Generic.List[string]
        if (-not $content.Contains($gameUrl)) {
            $toAdd.Add("                <p><a href=`"$gameUrl`">Game Mode subtitles for fullscreen games</a></p>") | Out-Null
        }
        if (-not $content.Contains($article19Url)) {
            $toAdd.Add("                <p><a href=`"$article19Url`">Game Mode subtitles setup guide (article)</a></p>") | Out-Null
        }
        if (-not $content.Contains($article20Url)) {
            $toAdd.Add("                <p><a href=`"$article20Url`">Fullscreen subtitle overlay troubleshooting (article)</a></p>") | Out-Null
        }
        if (-not $content.Contains($article21Url)) {
            $toAdd.Add("                <p><a href=`"$article21Url`">Discord voice chat subtitles for international squads (article)</a></p>") | Out-Null
        }
        if (-not $content.Contains($article22Url)) {
            $toAdd.Add("                <p><a href=`"$article22Url`">Best subtitle overlay settings for FPS and MOBA (article)</a></p>") | Out-Null
        }

        if ($toAdd.Count -eq 0) { continue }

        $insert = ($toAdd -join "`r`n")
        $updated = [regex]::Replace(
            $content,
            '(?s)(<div class="links">\s*)(.*?)(\s*</div>)',
            {
                param($m)
                $inner = $m.Groups[2].Value.TrimEnd()
                return $m.Groups[1].Value + $inner + "`r`n" + $insert + $m.Groups[3].Value
            },
            1
        )

        if ($updated -ne $content) {
            [System.IO.File]::WriteAllText($path, $updated, $utf8NoBom)
        }
    }
}

Write-Host "Added game/article internal links to platform pages."
