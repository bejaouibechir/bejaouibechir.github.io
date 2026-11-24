@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-createwf-cap.log"
> "%LOG%" echo === block createwf %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve > serve.log 2>&1'"
  set "STARTED=1"
  ping -n 40 127.0.0.1 >nul
)
for %%c in (cap1 cap2) do (
  if exist %%c rmdir /S /Q %%c
  xcopy /E /I /Q stages-demo %%c\wf-demo >> "%LOG%" 2>&1
)
py capture_studio.py lessons\createwf\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\createwf\captures.json --channel msedge --out ..\..\public\tutorials\studio-createwf >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
)
echo Done. >> "%LOG%"
