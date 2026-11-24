@echo off
setlocal
set "LOG=%~dp0..\block-wfadd.log"
> "%LOG%" echo === probe wfadd %DATE% %TIME% ===
cd /d "%~dp0..\wf-demo"
echo ##### list >> "%LOG%"
hdrctl workflow list >> "%LOG%" 2>&1
echo ##### add archive >> "%LOG%"
hdrctl workflow add archive >> "%LOG%" 2>&1
echo ##### add noname >> "%LOG%"
hdrctl workflow add >> "%LOG%" 2>&1
echo ##### list2 >> "%LOG%"
hdrctl workflow list >> "%LOG%" 2>&1
echo ##### file >> "%LOG%"
type workflows\archive.yaml >> "%LOG%" 2>&1
echo ##### thread >> "%LOG%"
type workflows\thread.yaml >> "%LOG%" 2>&1
echo ##### validate >> "%LOG%"
hdrctl workflow validate workflows\archive.yaml >> "%LOG%" 2>&1
echo ##### run >> "%LOG%"
hdrctl workflow run workflows\archive.yaml >> "%LOG%" 2>&1
echo ##### dry >> "%LOG%"
hdrctl run . --dry-run >> "%LOG%" 2>&1
echo ##### remove >> "%LOG%"
hdrctl workflow remove archive -y >> "%LOG%" 2>&1
echo ##### list3 >> "%LOG%"
hdrctl workflow list >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
