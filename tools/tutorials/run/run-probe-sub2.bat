@echo off
setlocal
cd /d "%~dp0..\sub-probe\master"
set "LOG=%~dp0..\block-sub2.log"
> "%LOG%" echo === probe sub2 %DATE% %TIME% ===
copy /Y ..\..\sub-gen\wf-ok2.yaml workflows\workflow1.yaml >nul
set HYDRA_NO_BANNER=1
echo ##### ok2 run >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
echo ##### ok2 run -v >> "%LOG%"
hdrctl run . -v >> "%LOG%" 2>&1
type ..\child\jobs\job1\data\output.csv >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
