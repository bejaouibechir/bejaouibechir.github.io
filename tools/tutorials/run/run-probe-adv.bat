@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-adv2.log"
> "%LOG%" echo === probe adv %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist adv-probe rmdir /S /Q adv-probe
xcopy /E /I /Q /H adv-gen adv-probe >nul
cd adv-probe
echo ##### pip list >> "%LOG%"
py -m pip list 2>nul | findstr /I "snowflake bigquery pymongo psycopg mysql pyarrow" >> "%LOG%"
for %%j in (mongodb) do (
  echo ##### validate %%j >> "%LOG%"
  hdrctl validate jobs\%%j >> "%LOG%" 2>&1
  echo ##### run %%j >> "%LOG%"
  powershell -NoProfile -Command "$p=Start-Process hdrctl -ArgumentList 'run','jobs\%%j' -RedirectStandardOutput out.txt -RedirectStandardError err.txt -PassThru -WindowStyle Hidden; if(-not $p.WaitForExit(30000)){ $p.Kill(); Add-Content out.txt 'TIMEOUT 30s' }"
  type out.txt >> "%LOG%" 2>&1
  type err.txt >> "%LOG%" 2>&1
)
echo Done. >> "%LOG%"
