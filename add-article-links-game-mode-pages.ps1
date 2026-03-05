param()

$ErrorActionPreference = "Stop"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$langs = @('en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')
$pattern = '(?s)(<div class="links">\s*)(.*?)(\s*</div>)'

foreach ($lang in $langs) {
    $path = if ($lang -eq 'en') { 'game-mode-subtitles.html' } else { "$lang/game-mode-subtitles.html" }
    if (-not (Test-Path $path)) { continue }

    $fullPath = (Resolve-Path $path).Path
    $content = [System.IO.File]::ReadAllText($fullPath, $utf8NoBom)

    $article21Url = "/articles/$lang/article-21.html"
    $article22Url = "/articles/$lang/article-22.html"

    $toAdd = New-Object System.Collections.Generic.List[string]
    if (-not $content.Contains($article21Url)) {
        if ($lang -eq 'ru') {
            $toAdd.Add("                <p><a href=`"$article21Url`">Субтитры Discord Voice Chat для международных сквадов (статья)</a></p>") | Out-Null
        } else {
            $toAdd.Add("                <p><a href=`"$article21Url`">Discord voice chat subtitles for international squads (article)</a></p>") | Out-Null
        }
    }
    if (-not $content.Contains($article22Url)) {
        if ($lang -eq 'ru') {
            $toAdd.Add("                <p><a href=`"$article22Url`">Лучшие настройки subtitle overlay для FPS и MOBA (статья)</a></p>") | Out-Null
        } else {
            $toAdd.Add("                <p><a href=`"$article22Url`">Best subtitle overlay settings for FPS and MOBA (article)</a></p>") | Out-Null
        }
    }

    if ($toAdd.Count -eq 0) { continue }

    $match = [regex]::Match($content, $pattern)
    if (-not $match.Success) { continue }

    $insert = ($toAdd -join "`r`n")
    $inner = $match.Groups[2].Value.TrimEnd()
    $replacement = $match.Groups[1].Value + $inner + "`r`n" + $insert + $match.Groups[3].Value
    $updated = $content.Substring(0, $match.Index) + $replacement + $content.Substring($match.Index + $match.Length)

    if ($updated -ne $content) {
        [System.IO.File]::WriteAllText($fullPath, $updated, $utf8NoBom)
        Write-Host "Updated $path"
    }
}

Write-Host "Added article-21/article-22 links to game-mode pages."
