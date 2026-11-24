@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-diag.log"
> "%LOG%" echo === block diag %DATE% %TIME% ===
set "WS=C:\Users\DELL\hydra-workspace-diag"
if not exist "%WS%\diag-demo" xcopy /E /I /Q diag-demo "%WS%\diag-demo" >> "%LOG%" 2>&1
set "SPEC=captures-trial.json"
set "OUT=..\..\public\tutorials\_trial-diag"
if exist diag-spec.txt (
  < diag-spec.txt (set /p SPEC=& set /p OUT=)
)
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5682 --workspace C:\Users\DELL\hydra-workspace-diag > serve-diag.log 2>&1'"
ping -n 30 127.0.0.1 >nul
set "H=Content-Type: application/json"
curl.exe -s -X POST -H "%H%" -d @diag-bodies\open.json http://127.0.0.1:5682/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
curl.exe -s -X POST -H "%H%" -d @diag-bodies\b1.json http://127.0.0.1:5682/api/runs >> "%LOG%" 2>&1
ping -n 10 127.0.0.1 >nul
curl.exe -s http://127.0.0.1:5682/api/runs > runs-diag.json 2>> "%LOG%"
py capture_studio.py lessons\diagnose\%SPEC% --check >> "%LOG%" 2>&1
py capture_studio.py lessons\diagnose\%SPEC% --channel msedge --out %OUT% >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5682" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
cd /d "%~dp0..\diag-demo"
echo ##### cli run >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
