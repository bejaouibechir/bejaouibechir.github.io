@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-scenarios-60-61.log"
> "%LOG%" echo === block scenarios 60-61 %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
for %%S in (build:60-build-a-resilient-pipeline:studio-build-a-resilient-pipeline a:61-break-it-then-recover:studio-break-it-then-recover b:61-break-it-then-recover:studio-break-it-then-recover c:61-break-it-then-recover:studio-break-it-then-recover) do for /f "tokens=1,2,3 delims=:" %%a in ("%%S") do (
  >> "%LOG%" echo --- %%b stage %%a
  py prepare_scenarios_block.py --stage %%a >> "%LOG%" 2>&1
  py capture_studio.py lessons\%%b\captures-%%a.json --check >> "%LOG%" 2>&1
  py capture_studio.py lessons\%%b\captures-%%a.json --channel msedge --out ..\..\public\tutorials\%%c >> "%LOG%" 2>&1
)
>> "%LOG%" echo --- evidence (Windows CLI)
py evidence_scenarios.py >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done.
