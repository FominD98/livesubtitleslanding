param(
    [string]$Domain = "https://live-subtitles.com"
)

# Compatibility wrapper. Use the primary generator script.
& "$PSScriptRoot\generate-sitemap.ps1" -Domain $Domain -ArticlesPath "articles" -OutputFile "sitemap.xml"
