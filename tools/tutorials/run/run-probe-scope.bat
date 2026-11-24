@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-scope3.log"
> "%LOG%" echo === probe scope %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist scope-probe rmdir /S /Q scope-probe
mkdir scope-probe
cd scope-probe
hdrctl init scope-demo >nul 2>&1
cd scope-demo
copy /Y ..\..\scope-gen\wf\*.yaml workflows\ >nul
for %%w in (bad-onfail) do (
  echo ##### validate %%w >> "%LOG%"
  hdrctl workflow validate workflows\%%w.yaml >> "%LOG%" 2>&1
)
for %%w in (scope-fail scope-skip scope-continue) do (
  if exist attempts.txt del attempts.txt
  echo ##### run %%w >> "%LOG%"
  powershell -NoProfile -Command "$s=Get-Date; hdrctl workflow run workflows\%%w.yaml *>&1 | Out-File -Append -Encoding utf8 '%LOG%'; $e=$LASTEXITCODE; Add-Content -Encoding utf8 '%LOG%' ('exit code: '+$e+' ('+[math]::Round(((Get-Date)-$s).TotalSeconds,1)+' s)')"
)
echo Done. >> "%LOG%"
