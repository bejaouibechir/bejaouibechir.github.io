@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-03.log"
> "%LOG%" echo === block jobs 05 %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
py setup_course.py --stage two-jobs >> "%LOG%" 2>&1
py warm_up.py >> "%LOG%" 2>&1
py capture_studio.py lessons\03-read-the-canvas\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\03-read-the-canvas\captures.json --channel msedge --out ..\..\public\tutorials\studio-03-read-the-canvas >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done.
