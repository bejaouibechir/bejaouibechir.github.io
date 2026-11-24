@echo off
cd /d "%~dp0..\probe-cond"
set "L=%~dp0..\probe-cond5.log"
> "%L%" echo === probe cond5 ===
hdrctl workflow run workflows\wf_small.yaml >> "%L%" 2>&1
echo exit=%ERRORLEVEL% >> "%L%"
