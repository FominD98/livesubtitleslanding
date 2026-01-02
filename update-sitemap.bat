@echo off
echo ========================================
echo        ОБНОВЛЕНИЕ SITEMAP
echo ========================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\generate-sitemap.ps1"

echo.
echo ========================================
echo        ОБНОВЛЕНИЕ ЗАВЕРШЕНО
echo ========================================
echo Sitemap обновлен: %date% %time%
echo.
pause 