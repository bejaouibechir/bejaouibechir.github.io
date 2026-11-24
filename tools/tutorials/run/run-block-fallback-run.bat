@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-fallback-run.log"
> "%LOG%" echo === fallback run shot + evidence %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
py capture_studio.py lessons\46-declare-a-fallback-workflow\captures-run.json --channel msedge --out ..\..\public\tutorials\studio-declare-a-fallback-workflow >> "%LOG%" 2>&1
>> "%LOG%" echo --- evidence (Windows CLI, fallback-demo)
pushd "%USERPROFILE%\hydra-workspace\fallback-demo"
>> "%LOG%" echo $ hdrctl workflow list
hdrctl workflow list >> "%LOG%" 2>&1
>> "%LOG%" echo $ hdrctl run . --dry-run
hdrctl run . --dry-run >> "%LOG%" 2>&1
>> "%LOG%" echo $ hdrctl run .
hdrctl run . >> "%LOG%" 2>&1
popd
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done.
pause
