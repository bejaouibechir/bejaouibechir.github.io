@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-api.log"
> "%LOG%" echo === probe api %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
if exist api-probe rmdir /S /Q api-probe
xcopy /E /I /Q /H api-gen api-probe >> "%LOG%" 2>&1
cd api-probe
powershell -NoProfile -Command "$p = Start-Process -FilePath py -ArgumentList 'mock_api.py' -PassThru -WindowStyle Hidden; $p.Id | Out-File mock.pid -Encoding ascii"
ping -n 4 127.0.0.1 >nul
curl.exe -s http://127.0.0.1:8099/products >> "%LOG%" 2>&1
for %%j in (a b) do (
  echo ##### validate %%j >> "%LOG%"
  hdrctl validate jobs\%%j >> "%LOG%" 2>&1
  echo ##### run %%j >> "%LOG%"
  hdrctl run jobs\%%j -v >> "%LOG%" 2>&1
  echo ##### out %%j >> "%LOG%"
  type jobs\%%j\data\out.csv >> "%LOG%" 2>&1
)
powershell -NoProfile -Command "Stop-Process -Id (Get-Content mock.pid) -Force"
echo Done. >> "%LOG%"
