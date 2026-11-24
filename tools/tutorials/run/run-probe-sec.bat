@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-sec.log"
> "%LOG%" echo === probe sec %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist sec-probe rmdir /S /Q sec-probe
mkdir sec-probe
cd sec-probe
hdrctl init secrets-demo >nul 2>&1
cd secrets-demo
copy /Y ..\..\sec-gen\wf-secret.yaml workflows\wf-secret.yaml >nul
copy /Y ..\..\sec-gen\wf-missing.yaml workflows\wf-missing.yaml >nul
echo ##### gitignore >> "%LOG%"
type .gitignore >> "%LOG%" 2>&1
echo ##### list empty >> "%LOG%"
hdrctl secret list >> "%LOG%" 2>&1
echo ##### set >> "%LOG%"
echo abc123-demo-token| hdrctl secret set api.token --stdin >> "%LOG%" 2>&1
echo ##### list >> "%LOG%"
hdrctl secret list >> "%LOG%" 2>&1
echo ##### file >> "%LOG%"
findstr /V /B "#" .hydra\secrets >> "%LOG%" 2>&1
echo ##### run masked >> "%LOG%"
hdrctl workflow run workflows\wf-secret.yaml >> "%LOG%" 2>&1
echo ##### run hidden >> "%LOG%"
hdrctl workflow run workflows\wf-secret.yaml --secrets-visibility hidden >> "%LOG%" 2>&1
echo ##### run plain >> "%LOG%"
hdrctl workflow run workflows\wf-secret.yaml --secrets-visibility plain >> "%LOG%" 2>&1
echo ##### run missing >> "%LOG%"
hdrctl workflow run workflows\wf-missing.yaml >> "%LOG%" 2>&1
echo ##### run env var wins >> "%LOG%"
set API_TOKEN=from-the-shell
hdrctl workflow run workflows\wf-secret.yaml --secrets-visibility plain >> "%LOG%" 2>&1
set API_TOKEN=
echo ##### set prod >> "%LOG%"
echo prod-token-999| hdrctl secret set api.token --env prod --stdin >> "%LOG%" 2>&1
hdrctl secret list --env prod >> "%LOG%" 2>&1
dir /B .hydra >> "%LOG%" 2>&1
echo ##### run prod >> "%LOG%"
hdrctl workflow run workflows\wf-secret.yaml --env prod --secrets-visibility plain >> "%LOG%" 2>&1
echo ##### delete >> "%LOG%"
hdrctl secret delete api.token >> "%LOG%" 2>&1
hdrctl secret delete api.token >> "%LOG%" 2>&1
echo ##### short >> "%LOG%"
echo abc| hdrctl secret set short.one --stdin >> "%LOG%" 2>&1
echo ##### empty >> "%LOG%"
echo.| hdrctl secret set empty.one --stdin >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
