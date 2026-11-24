@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-imp2.log"
> "%LOG%" echo === probe imp2 %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
if exist imp-probe rmdir /S /Q imp-probe
mkdir imp-probe
cd imp-probe
hdrctl init imp-demo >nul 2>&1
type imp-demo\workflows\thread.yaml >> "%LOG%" 2>&1
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5691 --workspace %CD%\ws > serve-imp.log 2>&1'"
ping -n 30 127.0.0.1 >nul
cd ..
py imp-gen\imp_save.py >> "%LOG%" 2>&1
type imp-gen\imp-save.json >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5691" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
