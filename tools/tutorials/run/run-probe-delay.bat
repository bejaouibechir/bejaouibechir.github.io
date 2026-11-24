@echo off
cd /d "%~dp0..\probe-delay"
> "%~dp0..\probe-delay.log" echo === probe delay %DATE% %TIME% ===
echo --- validate >> "%~dp0..\probe-delay.log"
hdrctl workflow validate workflows\wf_wait.yaml >> "%~dp0..\probe-delay.log" 2>&1
echo --- run >> "%~dp0..\probe-delay.log"
hdrctl workflow run workflows\wf_wait.yaml >> "%~dp0..\probe-delay.log" 2>&1
echo exit=%ERRORLEVEL% >> "%~dp0..\probe-delay.log"
