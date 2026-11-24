@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-watch.log"
> "%LOG%" echo === probe watch %DATE% %TIME% ===
if exist watch-probe rmdir /S /Q watch-probe
mkdir watch-probe
cd watch-probe
hdrctl init watch-demo >> "%LOG%" 2>&1
cd watch-demo
mkdir Data\incoming
copy /Y ..\..\watch-gen\triggers.yaml triggers.yaml >nul
echo ##### validate >> "%LOG%"
hdrctl trigger validate >> "%LOG%" 2>&1
set PYTHONIOENCODING=utf-8
set HYDRA_NO_BANNER=1
powershell -NoProfile -Command "$p = Start-Process -FilePath hdrctl -ArgumentList 'watch' -RedirectStandardOutput '..\watch.log' -RedirectStandardError '..\watch.err' -PassThru -WindowStyle Hidden; $p.Id | Out-File ..\watch.pid -Encoding ascii"
ping -n 12 127.0.0.1 >nul
echo go> go.flag
ping -n 18 127.0.0.1 >nul
copy /Y jobs\job1\data\input.csv Data\incoming\batch1.csv >nul
ping -n 18 127.0.0.1 >nul
echo 4,Dana,50>> jobs\job1\data\input.csv
ping -n 40 127.0.0.1 >nul
powershell -NoProfile -Command "Stop-Process -Id (Get-Content ..\watch.pid) -Force"
echo ##### flag still there? >> "%LOG%"
if exist go.flag (echo go.flag still exists >> "%LOG%") else (echo go.flag removed >> "%LOG%")
echo ##### history >> "%LOG%"
hdrctl trigger history >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
