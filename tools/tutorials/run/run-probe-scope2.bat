@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-scope2.log"
> "%LOG%" echo === probe scope2 %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
cd scope-probe\scope-demo
if exist attempts.txt del attempts.txt
powershell -NoProfile -Command "@{workflow_path=(Resolve-Path workflows\retry-ok.yaml).Path} | ConvertTo-Json | Set-Content -Encoding ascii ..\run.json"
cd ..
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --no-studio --port 5690 --workspace %CD%\ws2 > serve-scope.log 2>&1'"
ping -n 25 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d @run.json http://127.0.0.1:5690/api/runs >> "%LOG%" 2>&1
echo. >> "%LOG%"
ping -n 12 127.0.0.1 >nul
echo ##### runs >> "%LOG%"
curl.exe -s http://127.0.0.1:5690/api/runs >> "%LOG%" 2>&1
echo. >> "%LOG%"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5690" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
