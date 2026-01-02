# ========================================
# SITEMAP AUTO-GENERATION SCRIPT
# Created: 10.06.2025
# Purpose: Automatic sitemap.xml generation with multi-language support
# ========================================

param(
    [string]$Domain = "https://2sub.ru",
    [string]$ArticlesPath = "articles",
    [string]$OutputFile = "sitemap.xml"
)

Write-Host "=== SITEMAP GENERATOR ===" -ForegroundColor Green
Write-Host "Domain: $Domain" -ForegroundColor Cyan
Write-Host "Articles Path: $ArticlesPath" -ForegroundColor Cyan
Write-Host "Output File: $OutputFile" -ForegroundColor Cyan
Write-Host ""

# Get current date in ISO format
$currentDate = (Get-Date).ToString("yyyy-MM-dd")

# Find all language folders
$languageFolders = Get-ChildItem -Path $ArticlesPath -Directory | Where-Object { $_.Name -match '^[a-z]{2}$' }
Write-Host "Languages found: $($languageFolders.Count)" -ForegroundColor Yellow

# Create list of all languages for hreflang
$allLanguages = $languageFolders | ForEach-Object { $_.Name } | Sort-Object

# Find all unique articles
$allArticles = @()
foreach ($langFolder in $languageFolders) {
    $articles = Get-ChildItem -Path $langFolder.FullName -Filter "*.html"
    foreach ($article in $articles) {
        if ($allArticles -notcontains $article.Name) {
            $allArticles += $article.Name
        }
    }
}

Write-Host "Unique articles found: $($allArticles.Count)" -ForegroundColor Yellow
Write-Host "Languages: $($allLanguages -join ', ')" -ForegroundColor Yellow
Write-Host ""

# Start creating XML
$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>$Domain/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Main articles index -->
    <url>
        <loc>$Domain/$ArticlesPath/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
"@

# Create hreflang links for all languages
function Create-HreflangLinks {
    param([string]$ArticleName = "")
    
    $links = ""
    foreach ($lang in $allLanguages) {
        if ($ArticleName) {
            $links += "        <xhtml:link rel=`"alternate`" hreflang=`"$lang`" href=`"$Domain/$ArticlesPath/$lang/$ArticleName`" />`r`n"
        } else {
            $links += "        <xhtml:link rel=`"alternate`" hreflang=`"$lang`" href=`"$Domain/$ArticlesPath/$lang/`" />`r`n"
        }
    }
    return $links
}

# Add language indexes
foreach ($lang in $allLanguages) {
    $hreflangLinks = Create-HreflangLinks
    $xml += @"
    <url>
        <loc>$Domain/$ArticlesPath/$lang/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
$hreflangLinks    </url>
"@
}

# Add all articles
foreach ($article in $allArticles) {
    $xml += "`r`n    <!-- $article -->"
    
    foreach ($lang in $allLanguages) {
        $articlePath = "$ArticlesPath\$lang\$article"
        if (Test-Path $articlePath) {
            $hreflangLinks = Create-HreflangLinks -ArticleName $article
            $xml += @"
`r`n    <url>
        <loc>$Domain/$ArticlesPath/$lang/$article</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
$hreflangLinks    </url>
"@
        }
    }
}

# Close XML
$xml += @"
`r`n</urlset>
"@

# Save file
$xml | Out-File -FilePath $OutputFile -Encoding UTF8

# Statistics
$urlCount = ($xml | Select-String "<loc>").Count
$hreflangCount = ($xml | Select-String "hreflang=").Count

Write-Host "=== RESULT ===" -ForegroundColor Green
Write-Host "File created: $OutputFile" -ForegroundColor Yellow
Write-Host "Total URLs: $urlCount" -ForegroundColor Yellow
Write-Host "Total hreflang links: $hreflangCount" -ForegroundColor Yellow
Write-Host "Last updated: $currentDate" -ForegroundColor Yellow
Write-Host ""
Write-Host "Sitemap successfully created!" -ForegroundColor Green

# Check file size
$fileSize = (Get-Item $OutputFile).Length
$fileSizeKB = [math]::Round($fileSize / 1024, 2)
Write-Host "File size: $fileSizeKB KB" -ForegroundColor Cyan 