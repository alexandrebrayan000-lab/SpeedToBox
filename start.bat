@echo off
title SpeedToBox Cyberpunk Neon Dashboard
echo ========================================================
echo   Iniciando SpeedToBox - Dashboard Cyberpunk Neon
echo ========================================================
start "" http://localhost:3000

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  node server.js
) else (
  if exist "C:\Users\mylenna.5925\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe" (
    "C:\Users\mylenna.5925\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe" server.js
  ) else (
    echo [AVISO] Node.js nao encontrado no PATH do sistema.
    echo Abrindo index.html diretamente no navegador...
    start "" index.html
  )
)
pause
