@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-trig.log"
> "%LOG%" echo === probe trig %DATE% %TIME% ===
if exist triggers-demo rmdir /S /Q triggers-demo
xcopy /E /I /Q /H anatomy-probe\anatomy-demo triggers-demo >> "%LOG%" 2>&1
del triggers-demo\jobs\job1\data\output.csv
cd triggers-demo
echo ##### list none >> "%LOG%"
hdrctl trigger list >> "%LOG%" 2>&1
copy /Y ..\trig-bodies\triggers-ok.yaml triggers.yaml >nul
echo ##### list >> "%LOG%"
hdrctl trigger list >> "%LOG%" 2>&1
echo ##### validate >> "%LOG%"
hdrctl trigger validate >> "%LOG%" 2>&1
echo ##### fire nightly >> "%LOG%"
hdrctl trigger fire nightly >> "%LOG%" 2>&1
echo ##### history >> "%LOG%"
hdrctl trigger history >> "%LOG%" 2>&1
echo ##### list after >> "%LOG%"
hdrctl trigger list >> "%LOG%" 2>&1
echo ##### fire unknown >> "%LOG%"
hdrctl trigger fire nope >> "%LOG%" 2>&1
for %%b in (bad1 bad2 bad3 bad4) do (
  copy /Y ..\trig-bodies\%%b.yaml triggers.yaml >nul
  echo ##### %%b >> "%LOG%"
  hdrctl trigger validate >> "%LOG%" 2>&1
)
echo ##### yaml tree >> "%LOG%"
dir /b .hydra >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
