@echo off
setlocal
cd /d "%~dp0..\manage-probe\manage-demo"
set "LOG=%~dp0..\block-manage2.log"
> "%LOG%" echo === probe manage2 %DATE% %TIME% ===
echo ##### attach nojob >> "%LOG%"
hdrctl job attach nojob workflow1 >> "%LOG%" 2>&1
echo ##### add noworkflow >> "%LOG%"
hdrctl job add other noworkflow >> "%LOG%" 2>&1
echo ##### detach nojob >> "%LOG%"
hdrctl job detach nojob workflow1 >> "%LOG%" 2>&1
echo ##### param unknown env run >> "%LOG%"
hdrctl run jobs\job1 --env staging >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
