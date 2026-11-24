@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-files.log"
> "%LOG%" echo === probe files %DATE% %TIME% ===
if exist files-probe rmdir /S /Q files-probe
xcopy /E /I /Q /H files-gen files-probe >> "%LOG%" 2>&1
cd files-probe
py make_parquet.py >> "%LOG%" 2>&1
for %%j in (csv-job json-job parquet-job semicolon-conn semicolon-flat semicolon-none missing-file) do (
  echo ##### validate %%j >> "%LOG%"
  hdrctl validate jobs\%%j >> "%LOG%" 2>&1
  echo ##### run %%j >> "%LOG%"
  hdrctl run jobs\%%j >> "%LOG%" 2>&1
  echo ##### out %%j >> "%LOG%"
  type jobs\%%j\data\out_%%j.csv >> "%LOG%" 2>&1
)
echo Done. >> "%LOG%"
