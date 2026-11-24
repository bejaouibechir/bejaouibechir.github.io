@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-secenv.log"
> "%LOG%" echo === secenv %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist secenv-probe rmdir /S /Q secenv-probe
mkdir secenv-probe
cd secenv-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init secenv-demo --template csv >> "%LOG%" 2>&1
hdrctl env set REGION eu-west >> "%LOG%" 2>&1
hdrctl env set API_URL https://dev.example.test >> "%LOG%" 2>&1
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content secenv-demo\.hydra\project.json -Raw | ConvertFrom-Json).id"') do set "PID2=%%i"
echo project id !PID2! >> "%LOG%"
cd ..
py secenv-gen\make_spec.py !PID2! 5693 > lessons\secenv\captures.json 2>> "%LOG%"
powershell -NoProfile -Command "@{path=(Resolve-Path secenv-probe\secenv-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii secenv-probe\open.json"
cd secenv-probe
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5693 --workspace %CD%\ws > serve.log 2>&1'"
ping -n 40 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5693/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### global-env home >> "%LOG%"
curl.exe -s http://127.0.0.1:5693/api/global-env >> "%LOG%" 2>&1
echo. >> "%LOG%"
cd ..
py capture_studio.py lessons\secenv\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\secenv\captures.json --channel msedge --out secenv-gen\shots >> "%LOG%" 2>&1
echo ##### files >> "%LOG%"
dir /b secenv-probe\fake-home >> "%LOG%" 2>&1
type secenv-probe\fake-home\env.prod >> "%LOG%" 2>&1
echo ##### secrets >> "%LOG%"
type secenv-probe\secenv-demo\.hydra\secrets | findstr /v "^#" >> "%LOG%" 2>&1
dir /b secenv-probe\secenv-demo\.hydra >> "%LOG%" 2>&1
type secenv-probe\secenv-demo\.hydra\secrets.prod | findstr /v "^#" >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5693" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
