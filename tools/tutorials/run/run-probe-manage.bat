@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-manage.log"
> "%LOG%" echo === probe manage %DATE% %TIME% ===
if exist manage-probe rmdir /S /Q manage-probe
mkdir manage-probe
cd manage-probe
hdrctl init manage-demo >> "%LOG%" 2>&1
cd manage-demo
echo ##### job list >> "%LOG%"
hdrctl job list >> "%LOG%" 2>&1
echo ##### job add extra workflow1 >> "%LOG%"
hdrctl job add extra workflow1 >> "%LOG%" 2>&1
echo ##### job list 2 >> "%LOG%"
hdrctl job list >> "%LOG%" 2>&1
echo ##### workflow1 >> "%LOG%"
type workflows\workflow1.yaml >> "%LOG%" 2>&1
echo ##### detach >> "%LOG%"
hdrctl job detach extra workflow1 >> "%LOG%" 2>&1
hdrctl job list >> "%LOG%" 2>&1
echo ##### attach p1 >> "%LOG%"
hdrctl job attach extra workflow1 -p 1 >> "%LOG%" 2>&1
type workflows\workflow1.yaml >> "%LOG%" 2>&1
echo ##### param list empty >> "%LOG%"
hdrctl param list >> "%LOG%" 2>&1
echo ##### param set >> "%LOG%"
hdrctl param set min_value 0 --type int --description "Smallest value kept" >> "%LOG%" 2>&1
hdrctl param list >> "%LOG%" 2>&1
type parameters.yaml >> "%LOG%" 2>&1
powershell -NoProfile -Command "(Get-Content jobs\job1\transformations.yaml) -replace 'value > 0','value > {{ param:min_value }}' | Set-Content jobs\job1\transformations.yaml"
echo ##### transformations >> "%LOG%"
type jobs\job1\transformations.yaml >> "%LOG%" 2>&1
echo ##### run default >> "%LOG%"
hdrctl run jobs\job1 >> "%LOG%" 2>&1
echo ##### param set prod >> "%LOG%"
hdrctl param set min_value 150 --env prod >> "%LOG%" 2>&1
hdrctl param list >> "%LOG%" 2>&1
dir /b environments >> "%LOG%" 2>&1
echo ##### run prod >> "%LOG%"
hdrctl run jobs\job1 --env prod >> "%LOG%" 2>&1
type jobs\job1\data\output.csv >> "%LOG%" 2>&1
echo ##### unset prod >> "%LOG%"
hdrctl param unset min_value --env prod >> "%LOG%" 2>&1
hdrctl param list >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
