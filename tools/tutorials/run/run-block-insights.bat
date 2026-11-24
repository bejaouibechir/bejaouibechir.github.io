@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-insights.log"
> "%LOG%" echo === block insights %DATE% %TIME% ===
set "WS=C:\Users\DELL\hydra-workspace-ins"
set "FIRST=0"
if not exist "%WS%\insights-demo" (
  xcopy /E /I /Q insights-demo "%WS%\insights-demo" >> "%LOG%" 2>&1
  set "FIRST=1"
)
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5681 --workspace C:\Users\DELL\hydra-workspace-ins > serve-ins.log 2>&1'"
ping -n 30 127.0.0.1 >nul
set "H=Content-Type: application/json"
curl.exe -s -X POST -H "%H%" -d @insights-bodies\open.json http://127.0.0.1:5681/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
curl.exe -s -X POST -H "%H%" -d @insights-bodies\b1.json http://127.0.0.1:5681/api/runs >> "%LOG%" 2>&1
ping -n 12 127.0.0.1 >nul
curl.exe -s -X POST -H "%H%" -d @insights-bodies\b2.json http://127.0.0.1:5681/api/runs >> "%LOG%" 2>&1
ping -n 8 127.0.0.1 >nul
curl.exe -s -X POST -H "%H%" -d @insights-bodies\b3.json http://127.0.0.1:5681/api/runs >> "%LOG%" 2>&1
ping -n 8 127.0.0.1 >nul
curl.exe -s http://127.0.0.1:5681/api/runs > runs-insights.json 2>> "%LOG%"
py capture_studio.py lessons\insights\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\insights\captures.json --channel msedge --out ..\..\public\tutorials\studio-insights >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5681" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
