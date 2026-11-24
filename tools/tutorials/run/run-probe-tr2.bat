@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-tr2.log"
> "%LOG%" echo === probe tr2 %DATE% %TIME% ===
if exist tr2-probe rmdir /S /Q tr2-probe
xcopy /E /I /Q /H tr2-gen tr2-probe >> "%LOG%" 2>&1
cd tr2-probe
for %%j in (t-clean t-split t-window t-pivot t-unpivot t-script t-script-bad) do (
  echo ##### run %%j >> "%LOG%"
  hdrctl run jobs\%%j >> "%LOG%" 2>&1
  echo ##### out %%j >> "%LOG%"
  type jobs\%%j\data\out.csv >> "%LOG%" 2>&1
)
echo Done. >> "%LOG%"
