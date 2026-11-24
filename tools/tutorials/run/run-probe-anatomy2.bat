@echo off
setlocal
set "LOG=%~dp0..\block-anatomy2.log"
> "%LOG%" echo === probe anatomy2 %DATE% %TIME% ===
cd /d "%~dp0.."
if exist anatomy-probe2 rmdir /S /Q anatomy-probe2
xcopy /E /I /Q /H anatomy-probe\anatomy-demo anatomy-probe2\anatomy-demo >> "%LOG%" 2>&1
cd anatomy-probe2\anatomy-demo
del jobs\job1\data\output.csv
echo ##### no transformations >> "%LOG%"
move jobs\job1\transformations.yaml jobs\job1\transformations.off >> "%LOG%" 2>&1
hdrctl validate jobs\job1 >> "%LOG%" 2>&1
hdrctl run jobs\job1 >> "%LOG%" 2>&1
move jobs\job1\transformations.off jobs\job1\transformations.yaml >> "%LOG%" 2>&1
echo ##### bad from >> "%LOG%"
powershell -NoProfile -Command "(Get-Content jobs\job1\pipeline.yaml) -replace 'from: src_csv','from: src_missing' | Set-Content jobs\job1\pipeline.yaml"
hdrctl validate jobs\job1 >> "%LOG%" 2>&1
echo ##### no destinations >> "%LOG%"
powershell -NoProfile -Command "(Get-Content jobs\job1\pipeline.yaml) -replace 'src_missing','src_csv' | Set-Content jobs\job1\pipeline.yaml"
move jobs\job1\destinations.yaml jobs\job1\destinations.off >> "%LOG%" 2>&1
hdrctl validate jobs\job1 >> "%LOG%" 2>&1
echo ##### dry-run project >> "%LOG%"
move jobs\job1\destinations.off jobs\job1\destinations.yaml >> "%LOG%" 2>&1
hdrctl run . --dry-run >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
