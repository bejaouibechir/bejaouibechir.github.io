@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-sched.log"
> "%LOG%" echo === probe sched %DATE% %TIME% ===
if exist sched-probe rmdir /S /Q sched-probe
mkdir sched-probe
cd sched-probe
hdrctl init sched-demo >> "%LOG%" 2>&1
cd sched-demo
copy /Y ..\..\sched-gen\triggers.yaml triggers.yaml >nul
echo ##### validate >> "%LOG%"
hdrctl trigger validate >> "%LOG%" 2>&1
echo ##### list >> "%LOG%"
hdrctl trigger list >> "%LOG%" 2>&1
for %%B in (bad1 bad2 bad3 bad4 bad5) do (
  echo ##### %%B >> "%LOG%"
  type ..\..\sched-gen\%%B.yaml >> "%LOG%"
  copy /Y ..\..\sched-gen\%%B.yaml triggers.yaml >nul
  hdrctl trigger validate >> "%LOG%" 2>&1
)
copy /Y ..\..\sched-gen\triggers.yaml triggers.yaml >nul
set PYTHONIOENCODING=utf-8
set HYDRA_NO_BANNER=1
echo ##### start %TIME% >> "%LOG%"
powershell -NoProfile -Command "$p = Start-Process -FilePath hdrctl -ArgumentList 'watch' -RedirectStandardOutput '..\watch.log' -RedirectStandardError '..\watch.err' -PassThru -WindowStyle Hidden; $p.Id | Out-File ..\watch.pid -Encoding ascii"
ping -n 150 127.0.0.1 >nul
powershell -NoProfile -Command "Stop-Process -Id (Get-Content ..\watch.pid) -Force"
echo ##### watch.log >> "%LOG%"
type ..\watch.log >> "%LOG%"
echo ##### watch.err >> "%LOG%"
type ..\watch.err >> "%LOG%"
echo ##### history >> "%LOG%"
hdrctl trigger history >> "%LOG%" 2>&1
echo ##### end %TIME% >> "%LOG%"
echo Done. >> "%LOG%"
