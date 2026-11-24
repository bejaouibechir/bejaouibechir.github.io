@echo off
setlocal
set "LOG=%~dp0..\block-loops2.log"
> "%LOG%" echo === probe loops2 %DATE% %TIME% ===
cd /d "%~dp0..\loops-demo"
hdrctl run . --dry-run >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
hdrctl workflow list >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
echo Done. >> "%LOG%"
