@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-act2.log"
> "%LOG%" echo === probe act2 %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist act2-probe rmdir /S /Q act2-probe
mkdir act2-probe
cd act2-probe
hdrctl init act2-demo >nul 2>&1
copy /Y ..\act2-gen\mock_services.py . >nul
powershell -NoProfile -Command "$p = Start-Process -FilePath py -ArgumentList 'mock_services.py' -PassThru -WindowStyle Hidden; $p.Id | Out-File mock.pid -Encoding ascii"
ping -n 5 127.0.0.1 >nul
cd act2-demo
for %%w in (wf-hook wf-hook-404 wf-hook-down wf-hook-nourl wf-hook-badjson wf-mail wf-mail-noto wf-mail-down) do (
  copy /Y ..\..\act2-gen\%%w.yaml workflows\%%w.yaml >nul
  echo ##### %%w >> "%LOG%"
  hdrctl workflow run workflows\%%w.yaml >> "%LOG%" 2>&1
)
cd ..
echo ##### requests.log >> "%LOG%"
type requests.log >> "%LOG%" 2>&1
echo ##### mail.txt >> "%LOG%"
type mail.txt >> "%LOG%" 2>&1
powershell -NoProfile -Command "Stop-Process -Id (Get-Content mock.pid) -Force"
echo Done. >> "%LOG%"
