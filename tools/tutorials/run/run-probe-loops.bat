@echo off
setlocal
set "LOG=%~dp0..\block-loops.log"
> "%LOG%" echo === probe loops %DATE% %TIME% ===
cd /d "%~dp0..\probe-loops"
hdrctl run . >> "%LOG%" 2>&1
echo exit=%ERRORLEVEL% >> "%LOG%"
echo Done. >> "%LOG%"
