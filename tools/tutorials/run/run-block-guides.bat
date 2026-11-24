@echo off
setlocal
cd /d "%~dp0..\..\.."
set "LOG=%CD%\tools\tutorials\block-guides.log"
> "%LOG%" echo === guides check %DATE% %TIME% ===
call npx astro build --outDir "%TEMP%\hydra-dist-check" >> "%LOG%" 2>&1
cd /d "%TEMP%\hydra-dist-check"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath py -ArgumentList '-m','http.server','4398'"
ping -n 6 127.0.0.1 >nul
cd /d "%~dp0.."
py guides-shot.py >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":4398" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
