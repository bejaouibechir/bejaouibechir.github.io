@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-files2.log"
> "%LOG%" echo === probe files2 %DATE% %TIME% ===
for %%j in (semicolon-conn semicolon-flat semicolon-none) do (
  copy /Y files-gen\jobs\%%j\transformations.yaml files-probe\jobs\%%j\transformations.yaml >nul
  echo ##### run %%j >> "%LOG%"
  hdrctl run files-probe\jobs\%%j >> "%LOG%" 2>&1
  echo ##### out %%j >> "%LOG%"
  type files-probe\jobs\%%j\data\out_%%j.csv >> "%LOG%" 2>&1
)
echo Done. >> "%LOG%"
