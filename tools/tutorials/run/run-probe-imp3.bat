@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-imp3.log"
> "%LOG%" echo === probe imp3 %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
cd imp-probe\imp-demo
mkdir jobs\refunds-job\data >nul 2>&1
py ..\..\datagen.py orders jobs\refunds-job\data\orders.csv --rows 20 >> "%LOG%" 2>&1
echo ##### validate job >> "%LOG%"
hdrctl validate jobs\refunds-job >> "%LOG%" 2>&1
echo ##### workflow validate >> "%LOG%"
hdrctl workflow validate workflows\workflow1.yaml >> "%LOG%" 2>&1
echo ##### run >> "%LOG%"
hdrctl workflow run workflows\workflow1.yaml >> "%LOG%" 2>&1
dir /b ..\..\imp-probe\imp-demo\outputs >> "%LOG%" 2>&1
dir /b outputs >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
