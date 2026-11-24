@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-sub3.log"
> "%LOG%" echo === probe sub3 %DATE% %TIME% ===
if exist sub-probe3 rmdir /S /Q sub-probe3
mkdir sub-probe3
cd sub-probe3
hdrctl init child >> "%LOG%" 2>&1
hdrctl init master >> "%LOG%" 2>&1
cd child
echo ##### child alone >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
cd ..\master
copy /Y ..\..\sub-gen\wf-plain.yaml workflows\workflow1.yaml >nul
echo ##### master dry >> "%LOG%"
hdrctl run . --dry-run >> "%LOG%" 2>&1
echo ##### master run >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
echo ##### master run -v >> "%LOG%"
hdrctl run . -v >> "%LOG%" 2>&1
echo ##### job list >> "%LOG%"
hdrctl job list >> "%LOG%" 2>&1
echo ##### workflow list >> "%LOG%"
hdrctl workflow list >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
