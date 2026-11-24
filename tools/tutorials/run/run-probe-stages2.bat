@echo off
setlocal
set "LOG=%~dp0..\block-stages2.log"
> "%LOG%" echo === probe stages2 %DATE% %TIME% ===
cd /d "%~dp0..\probe-stages-seq"
hdrctl run . >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
cd /d "%~dp0..\probe-stages-off"
hdrctl run . >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
echo Done. >> "%LOG%"
