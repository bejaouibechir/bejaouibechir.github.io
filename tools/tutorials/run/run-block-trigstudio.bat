@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-trigstudio.log"
> "%LOG%" echo === trigstudio %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist tstud-probe rmdir /S /Q tstud-probe
mkdir tstud-probe
cd tstud-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init nightly-demo --template csv >> "%LOG%" 2>&1
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content nightly-demo\.hydra\project.json -Raw | ConvertFrom-Json).id"') do set "PID2=%%i"
echo project id !PID2! >> "%LOG%"
cd ..
py tstud-gen\make_spec.py !PID2! 5692 > lessons\trigstudio\captures.json 2>> "%LOG%"
powershell -NoProfile -Command "@{path=(Resolve-Path tstud-probe\nightly-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii tstud-probe\open.json"
cd tstud-probe
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5692 --workspace %CD%\ws > serve.log 2>&1'"
ping -n 40 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5692/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
cd ..
py capture_studio.py lessons\trigstudio\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\trigstudio\captures.json --channel msedge --out tstud-gen\shots >> "%LOG%" 2>&1
echo ##### triggers.yaml >> "%LOG%"
type tstud-probe\nightly-demo\triggers.yaml >> "%LOG%" 2>&1
echo ##### secrets >> "%LOG%"
type tstud-probe\nightly-demo\.hydra\secrets >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5692" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
