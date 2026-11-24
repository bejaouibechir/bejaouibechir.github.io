@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-prod.log"
> "%LOG%" echo === probe prod %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist prod-probe rmdir /S /Q prod-probe
mkdir prod-probe
cd prod-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init nightly-demo >nul 2>&1
echo ##### workflow before >> "%LOG%"
type nightly-demo\workflows\workflow1.yaml >> "%LOG%"
copy /Y ..\prod-gen\workflow1.yaml nightly-demo\workflows\workflow1.yaml >nul
echo ##### workflow after >> "%LOG%"
type nightly-demo\workflows\workflow1.yaml >> "%LOG%"
echo ##### validate >> "%LOG%"
cd nightly-demo
hdrctl workflow validate workflows\workflow1.yaml >> "%LOG%" 2>&1
cd ..
powershell -NoProfile -Command "@{path=(Resolve-Path nightly-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii open.json"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --no-studio --port 5689 --workspace %CD%\ws > serve-prod.log 2>&1'"
ping -n 30 127.0.0.1 >nul
echo ##### open >> "%LOG%"
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5689/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### root >> "%LOG%"
curl.exe -s -i http://127.0.0.1:5689/ >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### wait 150s >> "%LOG%"
ping -n 152 127.0.0.1 >nul
echo ##### runs >> "%LOG%"
curl.exe -s http://127.0.0.1:5689/api/runs >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### health >> "%LOG%"
curl.exe -s http://127.0.0.1:5689/api/health >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### serve log >> "%LOG%"
type serve-prod.log >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5689" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
