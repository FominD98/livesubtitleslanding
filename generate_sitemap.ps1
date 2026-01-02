# Скрипт для генерации sitemap.xml для всех статей
param(
    [string]$Domain = "https://2sub.ru"
)

$currentDate = Get-Date -Format "yyyy-MM-dd"

# Все языки в проекте
$languages = @("ru", "en", "fr", "es", "de", "it", "pt", "ja", "ko", "zh", "hi", "ar", "nl", "pl", "tr", "uk")

# Создаем начало XML файла
$xmlContent = @"
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
        <loc>$Domain/articles/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

"@

# Функция для создания hreflang ссылок
function Get-HrefLangLinks {
    param([string]$PagePath)
    
    $links = ""
    foreach ($lang in $languages) {
        $links += "        <xhtml:link rel=`"alternate`" hreflang=`"$lang`" href=`"$Domain/articles/$lang/$PagePath`" />`n"
    }
    return $links
}

# Добавляем индексные страницы для всех языков
foreach ($lang in $languages) {
    if (Test-Path "articles/$lang/index.html") {
        $hrefLinks = Get-HrefLangLinks ""
        $hrefLinks = $hrefLinks.Replace("/$PagePath", "/")
        
        $xmlContent += @"
    <url>
        <loc>$Domain/articles/$lang/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
$hrefLinks    </url>

"@
    }
}

# Собираем все уникальные имена статей
$allArticles = @()
foreach ($lang in $languages) {
    if (Test-Path "articles/$lang") {
        $articles = Get-ChildItem -Path "articles/$lang" -Filter "article-*.html" | ForEach-Object { $_.Name }
        $allArticles += $articles
    }
}
$uniqueArticles = $allArticles | Sort-Object | Get-Unique

# Для каждой уникальной статьи создаем записи для всех языков, где она существует
foreach ($article in $uniqueArticles) {
    $xmlContent += "`n    <!-- $article -->`n"
    
    foreach ($lang in $languages) {
        $articlePath = "articles/$lang/$article"
        if (Test-Path $articlePath) {
            $hrefLinks = Get-HrefLangLinks $article
            
            $xmlContent += @"
    <url>
        <loc>$Domain/articles/$lang/$article</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
$hrefLinks    </url>

"@
        }
    }
}

# Закрываем XML
$xmlContent += "</urlset>"

# Записываем в файл
$xmlContent | Out-File -FilePath "sitemap.xml" -Encoding UTF8 -NoNewline

Write-Host "Sitemap успешно сгенерирован!" -ForegroundColor Green
Write-Host "Добавлено языков: $($languages.Count)" -ForegroundColor Yellow
Write-Host "Добавлено уникальных статей: $($uniqueArticles.Count)" -ForegroundColor Yellow

# Подсчет общего количества URL
$totalUrls = ($xmlContent -split "<url>").Count - 1
Write-Host "Общее количество URL в sitemap: $totalUrls" -ForegroundColor Cyan 