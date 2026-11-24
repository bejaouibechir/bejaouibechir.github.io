@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-set.log"
> "%LOG%" echo === block 04 %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve > serve.log 2>&1'"
  set "STARTED=1"
  ping -n 40 127.0.0.1 >nul
)
py capture_studio.py lessons\settings\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\settings\captures.json --channel msedge --out ..\..\public\tutorials\studio-settings >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
)
echo Done. >> "%LOG%"
