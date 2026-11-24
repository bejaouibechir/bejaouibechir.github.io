@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\install-probe.log"
> "%LOG%" echo === install probe %DATE% %TIME% ===
set "V=C:\Users\DELL\hydra-venv-probe"
if exist "%V%" rmdir /s /q "%V%"
py --version >> "%LOG%" 2>&1
py -m venv "%V%" >> "%LOG%" 2>&1
"%V%\Scripts\python.exe" -m pip install --upgrade pip >> "%LOG%" 2>&1
echo --- pip install hydra-etl[server] >> "%LOG%"
"%V%\Scripts\python.exe" -m pip install "hydra-etl[server]" >> "%LOG%" 2>&1
echo --- pip show >> "%LOG%"
"%V%\Scripts\python.exe" -m pip show hydra-etl >> "%LOG%" 2>&1
echo --- hdrctl --version >> "%LOG%"
"%V%\Scripts\hdrctl.exe" --version >> "%LOG%" 2>&1
echo --- hdrctl serve --help >> "%LOG%"
"%V%\Scripts\hdrctl.exe" serve --help >> "%LOG%" 2>&1
if not exist "C:\Users\DELL\hydra-workspace-probe" mkdir "C:\Users\DELL\hydra-workspace-probe"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','%V%\Scripts\hdrctl.exe serve --port 5680 --workspace C:\Users\DELL\hydra-workspace-probe > serve-probe.log 2>&1'"
ping -n 26 127.0.0.1 >nul
echo --- health >> "%LOG%"
curl.exe -s -i http://127.0.0.1:5680/api/health >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo --- serve log >> "%LOG%"
type serve-probe.log >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5680" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
