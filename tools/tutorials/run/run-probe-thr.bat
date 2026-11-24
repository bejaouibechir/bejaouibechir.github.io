@echo off
setlocal
set "LOG=%~dp0..\block-thr.log"
> "%LOG%" echo === probe thr %DATE% %TIME% ===
for %%v in (a b c d e) do (
  echo ##### thr-%%v >> "%LOG%"
  cd /d "%~dp0..\thr-%%v"
  hdrctl run . --dry-run >> "%LOG%" 2>&1
  echo exit=%ERRORLEVEL% >> "%LOG%"
)
echo Done. >> "%LOG%"
