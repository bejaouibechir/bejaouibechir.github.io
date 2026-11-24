@echo off
cd /d "%~dp0..\probe-cond"
set "L=%~dp0..\probe-cond.log"
> "%L%" echo === probe cond %DATE% %TIME% ===
echo --- validate >> "%L%"
hdrctl workflow validate workflows\wf_branch.yaml >> "%L%" 2>&1
echo --- run >> "%L%"
hdrctl workflow run workflows\wf_branch.yaml >> "%L%" 2>&1
echo exit=%ERRORLEVEL% >> "%L%"
