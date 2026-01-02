# Цвета для вывода
$Green = "`e[32m"
$Red = "`e[31m"

# Конфигурация
$SshUser = "user1"
$SshHost = "82.202.139.19"
$RemotePath = "/var/www/landing"  # Новый путь для лендинга

Write-Host "${Green}Starting deployment...${Red}"

# Создаем директорию и устанавливаем права
Write-Host "${Green}Creating directory and setting permissions...${Red}"
ssh "${SshUser}@${SshHost}" "sudo mkdir -p ${RemotePath} && sudo chown -R ${SshUser}:${SshUser} ${RemotePath} && sudo chmod -R 755 ${RemotePath}"

# Копируем файлы на сервер
Write-Host "${Green}Copying files to server...${Red}"
$scpCommand = "scp -r index.html iconCC.ico 2sub.ico preview.png sitemap.xml translations.js privacy.html privacy_en.html articles img ${SshUser}@${SshHost}:${RemotePath}/"
Invoke-Expression $scpCommand

Write-Host "${Green}Deployment completed!${Red}"
Write-Host "${Green}Site available at: https://2sub.ru${Red}" 