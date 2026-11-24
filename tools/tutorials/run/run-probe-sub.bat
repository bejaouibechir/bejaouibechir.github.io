@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-sub.log"
> "%LOG%" echo === probe sub %DATE% %TIME% ===
if exist sub-probe rmdir /S /Q sub-probe
mkdir sub-probe
cd sub-probe
hdrctl init child >> "%LOG%" 2>&1
hdrctl init master >> "%LOG%" 2>&1
cd child
hdrctl param set min_value 0 --type int >> "%LOG%" 2>&1
powershell -NoProfile -Command "(Get-Content jobs\job1\transformations.yaml) -replace 'value > 0','value > {{ param:min_value }}' | Set-Content jobs\job1\transformations.yaml"
copy /Y ..\..\sub-gen\child-workflow1.yaml workflows\workflow1.yaml >nul
echo ##### child alone >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
cd ..\master
for %%v in (wf-ok wf-noparams wf-missing wf-cycle wf-noout wf-badparam) do (
  copy /Y ..\..\sub-gen\%%v.yaml workflows\workflow1.yaml >nul
  echo ##### %%v dry >> "%LOG%"
  hdrctl run . --dry-run >> "%LOG%" 2>&1
  echo ##### %%v run >> "%LOG%"
  hdrctl run . >> "%LOG%" 2>&1
  echo ##### %%v child output >> "%LOG%"
  type ..\child\jobs\job1\data\output.csv >> "%LOG%" 2>&1
  del ..\child\jobs\job1\data\output.csv >nul 2>&1
)
echo Done. >> "%LOG%"
