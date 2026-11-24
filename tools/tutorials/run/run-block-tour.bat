@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-tour.log"
> "%LOG%" echo === block tour %DATE% %TIME% ===
if not exist "C:\Users\DELL\hydra-workspace-tour" mkdir "C:\Users\DELL\hydra-workspace-tour"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5679 --workspace C:\Users\DELL\hydra-workspace-tour > serve-tour.log 2>&1'"
ping -n 26 127.0.0.1 >nul
py capture_studio.py lessons\tour-the-pages\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\tour-the-pages\captures.json --channel msedge --out ..\..\public\tutorials\studio-tour-the-pages >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5679" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
