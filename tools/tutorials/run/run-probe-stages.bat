@echo off
setlocal
cd /d "%~dp0..\probe-stages"
set "LOG=%~dp0..\block-stages.log"
> "%LOG%" echo === probe stages %DATE% %TIME% ===
hdrctl workflow validate workflows\prepare.yaml >> "%LOG%" 2>&1
echo --- run . >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
echo Done. >> "%LOG%"
