@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-hook.log"
> "%LOG%" echo === probe hook %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist hook-probe rmdir /S /Q hook-probe
mkdir hook-probe
cd hook-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init webhook-demo >nul 2>&1
cd webhook-demo
copy /Y ..\..\hook-gen\triggers.yaml triggers.yaml >nul
echo ##### validate >> "%LOG%"
hdrctl trigger validate >> "%LOG%" 2>&1
echo ##### list >> "%LOG%"
hdrctl trigger list >> "%LOG%" 2>&1
echo ##### token before >> "%LOG%"
hdrctl trigger fire deploy >> "%LOG%" 2>&1
echo ##### token >> "%LOG%"
hdrctl trigger token deploy > ..\tok.txt 2>&1
type ..\tok.txt >> "%LOG%"
for /f "delims=" %%t in ('powershell -NoProfile -Command "(Get-Content ..\tok.txt | Where-Object { $_.Trim() -match '^[A-Za-z0-9_\-]{16,}$' } | Select-Object -First 1).Trim()"') do set "TOK=%%t"
echo ##### token again >> "%LOG%"
hdrctl trigger token deploy >> "%LOG%" 2>&1
echo ##### project.json >> "%LOG%"
type .hydra\project.json >> "%LOG%" 2>&1
cd ..
powershell -NoProfile -Command "@{path=(Resolve-Path webhook-demo).Path; adopt=$true} | ConvertTo-Json | Set-Content -Encoding ascii open.json"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5688 --workspace %CD%\ws > serve-hook.log 2>&1'"
ping -n 30 127.0.0.1 >nul
echo ##### open >> "%LOG%"
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5688/api/projects/open > open-resp.json 2>> "%LOG%"
type open-resp.json >> "%LOG%"
echo. >> "%LOG%"
type webhook-demo\.hydra\project.json >> "%LOG%"
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content webhook-demo\.hydra\project.json -Raw | ConvertFrom-Json).id"') do set "PID2=%%i"
echo ##### project id !PID2! >> "%LOG%"
set "URL=http://127.0.0.1:5688/api/projects/!PID2!/triggers/deploy/webhook"
echo ##### no token >> "%LOG%"
curl.exe -s -i -X POST !URL! >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### wrong token >> "%LOG%"
curl.exe -s -i -X POST -H "X-Hydra-Token: wrong-token-value" !URL! >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### good token >> "%LOG%"
curl.exe -s -i -X POST -H "X-Hydra-Token: !TOK!" !URL! >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### bearer >> "%LOG%"
ping -n 8 127.0.0.1 >nul
curl.exe -s -i -X POST -H "Authorization: Bearer !TOK!" !URL! >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### unknown trigger >> "%LOG%"
curl.exe -s -i -X POST -H "X-Hydra-Token: !TOK!" http://127.0.0.1:5688/api/projects/!PID2!/triggers/nope/webhook >> "%LOG%" 2>&1
echo. >> "%LOG%"
ping -n 8 127.0.0.1 >nul
echo ##### history >> "%LOG%"
cd webhook-demo
hdrctl trigger history >> "%LOG%" 2>&1
cd ..
echo ##### list api >> "%LOG%"
curl.exe -s http://127.0.0.1:5688/api/projects/!PID2!/triggers >> "%LOG%" 2>&1
echo. >> "%LOG%"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5688" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
