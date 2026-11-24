@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-launch.log"
> "%LOG%" echo === probe launch %DATE% %TIME% ===
if exist launch-demo rmdir /S /Q launch-demo
xcopy /E /I /Q /H anatomy-probe\anatomy-demo launch-demo >> "%LOG%" 2>&1
del launch-demo\jobs\job1\data\output.csv
cd launch-demo
echo ##### cli job >> "%LOG%"
hdrctl run jobs\job1 >> "%LOG%" 2>&1
del jobs\job1\data\output.csv
echo ##### cli project >> "%LOG%"
hdrctl run . >> "%LOG%" 2>&1
del jobs\job1\data\output.csv
cd ..
echo ##### serve >> "%LOG%"
powershell -NoProfile -Command "Start-Process -WindowStyle Minimized -FilePath cmd.exe -ArgumentList '/c','hdrctl serve --port 5683 --workspace C:\Users\DELL\hydra-workspace-launch > serve-launch.log 2>&1'"
ping -n 30 127.0.0.1 >nul
echo ##### health >> "%LOG%"
curl.exe -s http://127.0.0.1:5683/api/health >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### runs before >> "%LOG%"
curl.exe -s http://127.0.0.1:5683/api/runs >> "%LOG%" 2>&1
echo. >> "%LOG%"
echo ##### post run >> "%LOG%"
curl.exe -s -i -X POST -H "Content-Type: application/json" -d @launch-bodies\run.json http://127.0.0.1:5683/api/runs >> "%LOG%" 2>&1
echo. >> "%LOG%"
ping -n 10 127.0.0.1 >nul
echo ##### runs after >> "%LOG%"
curl.exe -s http://127.0.0.1:5683/api/runs > launch-runs.json 2>> "%LOG%"
type launch-runs.json >> "%LOG%"
echo. >> "%LOG%"
echo ##### output file >> "%LOG%"
dir launch-demo\jobs\job1\data >> "%LOG%" 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5683" ^| findstr LISTENING') do taskkill /F /T /PID %%p >nul 2>&1
echo Done. >> "%LOG%"
