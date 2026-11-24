@echo off
cd /d "%~dp0..\probe-actions"
set "L=%~dp0..\probe-actions.log"
> "%L%" echo === probe actions %DATE% %TIME% ===
hdrctl workflow validate workflows\wf_actions.yaml >> "%L%" 2>&1
hdrctl workflow run workflows\wf_actions.yaml >> "%L%" 2>&1
echo exit=%ERRORLEVEL% >> "%L%"
