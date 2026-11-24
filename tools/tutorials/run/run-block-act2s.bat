@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-act2s.log"
> "%LOG%" echo === act2s %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist act2s-probe rmdir /S /Q act2s-probe
mkdir act2s-probe
cd act2s-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init act2-demo >> "%LOG%" 2>&1
copy /Y ..\act2-gen\wf-hook.yaml act2-demo\workflows\wf-hook.yaml >nul
copy /Y ..\act2-gen\wf-mail.yaml act2-demo\workflows\wf-mail.yaml >nul
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content act2-demo\.hydra\project.json -Raw | ConvertFrom-Json).id"') do set "PID2=%%i"
echo project id !PID2! >> "%LOG%"
powershell -NoProfile -Command "@{path=(Resolve-Path act2-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii open.json"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5693 --workspace %CD%\ws > serve.log 2>&1'"
ping -n 40 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5693/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
curl.exe -s "http://127.0.0.1:5693/api/workflows?project_id=!PID2!" > wfs.json
echo ##### wfs >> "%LOG%"
type wfs.json >> "%LOG%"
cd ..
py act2s-gen\make_spec.py 5693 act2s-probe\wfs.json !PID2! > lessons\act2s\captures.json 2>> "%LOG%"
py capture_studio.py lessons\act2s\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\act2s\captures.json --channel msedge --out act2s-gen\shots >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5693" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
