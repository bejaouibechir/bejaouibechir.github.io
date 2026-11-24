@echo off
setlocal
set "LOG=%~dp0..\block-anatomy.log"
> "%LOG%" echo === probe anatomy %DATE% %TIME% ===
cd /d "%~dp0.."
if exist anatomy-probe rmdir /S /Q anatomy-probe
mkdir anatomy-probe
cd anatomy-probe
echo ##### version >> "%LOG%"
hdrctl --version >> "%LOG%" 2>&1
echo ##### init >> "%LOG%"
hdrctl init anatomy-demo >> "%LOG%" 2>&1
cd anatomy-demo
echo ##### tree >> "%LOG%"
tree /F /A >> "%LOG%" 2>&1
for %%f in (sources transformations destinations pipeline) do (
  echo ##### %%f >> "%LOG%"
  type jobs\job1\%%f.yaml >> "%LOG%" 2>&1
)
echo ##### workflow1 >> "%LOG%"
type workflows\workflow1.yaml >> "%LOG%" 2>&1
echo ##### validate >> "%LOG%"
hdrctl validate jobs\job1 >> "%LOG%" 2>&1
echo ##### run >> "%LOG%"
hdrctl run jobs\job1 >> "%LOG%" 2>&1
echo ##### tree2 >> "%LOG%"
tree /F /A >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
