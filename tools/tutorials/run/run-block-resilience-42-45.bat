@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-resilience-42-45.log"
> "%LOG%" echo === block resilience 42-45 %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
for %%S in (atomic:42-all-or-nothing-load:studio-all-or-nothing-load rollback:43-roll-back-a-failed-workflow:studio-roll-back-a-failed-workflow undo:44-declare-undo-actions:studio-declare-undo-actions conflict:45-resolve-conflicts-and-recover:studio-resolve-conflicts-and-recover) do for /f "tokens=1,2,3 delims=:" %%a in ("%%S") do (
  >> "%LOG%" echo --- %%b
  py prepare_resilience_block.py --stage %%a >> "%LOG%" 2>&1
  py capture_studio.py lessons\%%b\captures.json --check >> "%LOG%" 2>&1
  py capture_studio.py lessons\%%b\captures.json --channel msedge --out ..\..\public\tutorials\%%c >> "%LOG%" 2>&1
)
>> "%LOG%" echo --- evidence (Windows CLI)
py evidence_resilience.py >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done.
