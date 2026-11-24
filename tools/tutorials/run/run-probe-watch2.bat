@echo off
setlocal
cd /d "%~dp0..\watch-probe\watch-demo"
set "LOG=%~dp0..\block-watch2.log"
> "%LOG%" echo === probe watch2 %DATE% %TIME% ===
del Data\incoming\*.* /Q >nul 2>&1
copy /Y ..\..\watch-gen\triggers2.yaml triggers.yaml >nul
set PYTHONIOENCODING=utf-8
set HYDRA_NO_BANNER=1
powershell -NoProfile -Command "$p = Start-Process -FilePath hdrctl -ArgumentList 'watch' -RedirectStandardOutput '..\watch2.log' -RedirectStandardError '..\watch2.err' -PassThru -WindowStyle Hidden; $p.Id | Out-File ..\watch2.pid -Encoding ascii"
ping -n 12 127.0.0.1 >nul
echo id,name,value> Data\incoming\fresh.csv
echo 1,A,1>> Data\incoming\fresh.csv
ping -n 14 127.0.0.1 >nul
copy /Y jobs\job1\data\input.csv Data\incoming\copied.csv >nul
ping -n 14 127.0.0.1 >nul
powershell -NoProfile -Command "Stop-Process -Id (Get-Content ..\watch2.pid) -Force"
dir Data\incoming >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
