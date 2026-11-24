@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-scopes.log"
> "%LOG%" echo === scopes %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist scopes-probe rmdir /S /Q scopes-probe
mkdir scopes-probe
cd scopes-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init scope-demo >> "%LOG%" 2>&1
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content scope-demo\.hydra\project.json -Raw | ConvertFrom-Json).id"') do set "PID2=%%i"
echo project id !PID2! >> "%LOG%"
powershell -NoProfile -Command "@{path=(Resolve-Path scope-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii open.json"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5694 --workspace %CD%\ws > serve.log 2>&1'"
ping -n 40 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5694/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
curl.exe -s "http://127.0.0.1:5694/api/workflows?project_id=!PID2!" > wfs.json
echo ##### wfs >> "%LOG%"
type wfs.json >> "%LOG%"
cd ..
py scope-gen\make_spec.py 5694 scopes-probe\wfs.json !PID2! > lessons\scopes\captures.json 2>> "%LOG%"
py capture_studio.py lessons\scopes\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\scopes\captures.json --channel msedge --out scope-gen\shots-retry >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5694" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
