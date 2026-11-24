@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-eo.log"
> "%LOG%" echo === probe eo %DATE% %TIME% ===
if not exist "C:\Users\DELL\hydra-workspace-eo" mkdir "C:\Users\DELL\hydra-workspace-eo"
if not exist "C:\Users\DELL\hydra-workspace-eo\eo-demo" xcopy /E /I /Q eo-demo "C:\Users\DELL\hydra-workspace-eo\eo-demo" >> "%LOG%" 2>&1
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5680 --workspace C:\Users\DELL\hydra-workspace-eo > serve-eo.log 2>&1'"
ping -n 30 127.0.0.1 >nul
curl.exe -s -X POST -H "Content-Type: application/json" -d "{\"path\":\"C:\\\\Users\\\\DELL\\\\hydra-workspace-eo\\\\eo-demo\",\"adopt\":true}" http://127.0.0.1:5680/api/projects/open >> "%LOG%" 2>&1
echo. >> "%LOG%"
curl.exe -s http://127.0.0.1:5680/api/projects >> "%LOG%" 2>&1
echo. >> "%LOG%"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5680" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
