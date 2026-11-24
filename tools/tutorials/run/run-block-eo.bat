@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-eo-cap.log"
> "%LOG%" echo === block eo %DATE% %TIME% ===
set "SPEC=captures-trial.json"
set "OUT=..\..\public\tutorials\_trial-eo"
if exist eo-spec.txt (
  < eo-spec.txt (set /p SPEC=& set /p OUT=)
)
set "WS=C:\Users\DELL\hydra-workspace-eo"
if not exist "%WS%\eo-bad" (
  for %%d in (eo-demo eo-full eo-bad) do xcopy /E /I /Q %%d "%WS%\%%d" >> "%LOG%" 2>&1
  set "ADOPT=1"
)
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5680 --workspace C:\Users\DELL\hydra-workspace-eo > serve-eo.log 2>&1'"
ping -n 30 127.0.0.1 >nul
if "%ADOPT%"=="1" for %%d in (eo-demo eo-full eo-bad) do (
  curl.exe -s -X POST -H "Content-Type: application/json" -d "{\"path\":\"C:\\\\Users\\\\DELL\\\\hydra-workspace-eo\\\\%%d\",\"adopt\":true}" http://127.0.0.1:5680/api/projects/open >> "%LOG%" 2>&1
  echo. >> "%LOG%"
)
py capture_studio.py lessons\execution-order\%SPEC% --check >> "%LOG%" 2>&1
py capture_studio.py lessons\execution-order\%SPEC% --channel msedge --out %OUT% >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5680" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
