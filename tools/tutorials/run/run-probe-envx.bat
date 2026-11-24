@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-envx.log"
> "%LOG%" echo === probe envx %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist envx-probe rmdir /S /Q envx-probe
mkdir envx-probe
cd envx-probe
set "HYDRA_HOME=%CD%\fake-home"
hdrctl init envx-demo >nul 2>&1
cd envx-demo
copy /Y ..\..\envx-gen\wf-env.yaml workflows\wf-env.yaml >nul
echo ##### list empty >> "%LOG%"
hdrctl env list >> "%LOG%" 2>&1
echo ##### set common >> "%LOG%"
hdrctl env set REGION eu-west >> "%LOG%" 2>&1
hdrctl env set API_URL https://dev.example.test >> "%LOG%" 2>&1
echo ##### create prod >> "%LOG%"
hdrctl env create prod >> "%LOG%" 2>&1
hdrctl env set API_URL https://api.example.test --env prod >> "%LOG%" 2>&1
echo ##### list >> "%LOG%"
hdrctl env list >> "%LOG%" 2>&1
echo ##### show >> "%LOG%"
hdrctl env show >> "%LOG%" 2>&1
hdrctl env show prod >> "%LOG%" 2>&1
echo ##### run default >> "%LOG%"
hdrctl workflow run workflows\wf-env.yaml >> "%LOG%" 2>&1
echo ##### run prod >> "%LOG%"
hdrctl workflow run workflows\wf-env.yaml --env prod >> "%LOG%" 2>&1
echo ##### run unknown env >> "%LOG%"
hdrctl workflow run workflows\wf-env.yaml --env staging >> "%LOG%" 2>&1
echo ##### unset >> "%LOG%"
hdrctl env unset REGION >> "%LOG%" 2>&1
hdrctl env unset REGION >> "%LOG%" 2>&1
hdrctl workflow run workflows\wf-env.yaml >> "%LOG%" 2>&1
echo ##### rename >> "%LOG%"
hdrctl env rename prod production >> "%LOG%" 2>&1
hdrctl env list >> "%LOG%" 2>&1
echo ##### delete >> "%LOG%"
hdrctl env delete production -y >> "%LOG%" 2>&1
hdrctl env list >> "%LOG%" 2>&1
echo ##### files >> "%LOG%"
dir /B /S "%HYDRA_HOME%" >> "%LOG%" 2>&1
dir /B environments >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
