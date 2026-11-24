@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\captures-priority.log"
> "%LOG%" echo === captures priority %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
>> "%LOG%" echo --- stage one-job
py setup_course.py --stage one-job >> "%LOG%" 2>&1
py warm_up.py >> "%LOG%" 2>&1
py capture_studio.py lessons\10-run-the-job\captures-one-job.json --channel msedge --out ..\..\public\tutorials\studio-10-run-the-job >> "%LOG%" 2>&1
py capture_studio.py lessons\12-compose-jobs\captures-one-job.json --channel msedge --out ..\..\public\tutorials\studio-12-compose-jobs >> "%LOG%" 2>&1
>> "%LOG%" echo --- stage two-jobs
py setup_course.py --stage two-jobs >> "%LOG%" 2>&1
py warm_up.py >> "%LOG%" 2>&1
>> "%LOG%" echo --- 03-read-the-canvas
py capture_studio.py lessons\03-read-the-canvas\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\03-read-the-canvas\captures.json --channel msedge --out ..\..\public\tutorials\studio-03-read-the-canvas >> "%LOG%" 2>&1
>> "%LOG%" echo --- 08-see-the-yaml
py capture_studio.py lessons\08-see-the-yaml\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\08-see-the-yaml\captures.json --channel msedge --out ..\..\public\tutorials\studio-09-see-the-yaml >> "%LOG%" 2>&1
>> "%LOG%" echo --- 09-reach-valid
py capture_studio.py lessons\09-reach-valid\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\09-reach-valid\captures.json --channel msedge --out ..\..\public\tutorials\studio-09-reach-valid >> "%LOG%" 2>&1
>> "%LOG%" echo --- 10-run-the-job
py capture_studio.py lessons\10-run-the-job\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\10-run-the-job\captures.json --channel msedge --out ..\..\public\tutorials\studio-10-run-the-job >> "%LOG%" 2>&1
>> "%LOG%" echo --- 11-review-a-run
py capture_studio.py lessons\11-review-a-run\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\11-review-a-run\captures.json --channel msedge --out ..\..\public\tutorials\studio-11-review-a-run >> "%LOG%" 2>&1
>> "%LOG%" echo --- 12-compose-jobs
py capture_studio.py lessons\12-compose-jobs\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\12-compose-jobs\captures.json --channel msedge --out ..\..\public\tutorials\studio-12-compose-jobs >> "%LOG%" 2>&1
>> "%LOG%" echo --- 14-use-parameters
py capture_studio.py lessons\14-use-parameters\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\14-use-parameters\captures.json --channel msedge --out ..\..\public\tutorials\studio-14-use-parameters >> "%LOG%" 2>&1
>> "%LOG%" echo --- 13-handle-failure
py capture_studio.py lessons\13-handle-failure\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\13-handle-failure\captures.json --channel msedge --out ..\..\public\tutorials\studio-13-handle-failure >> "%LOG%" 2>&1
>> "%LOG%" echo --- parameters demo project (lesson 14)
py prepare_demo.py >> "%LOG%" 2>&1
py capture_studio.py lessons\14-use-parameters\captures-demo.json --channel msedge --out ..\..\public\tutorials\studio-14-use-parameters >> "%LOG%" 2>&1
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done. Log: tools\tutorials\captures-priority.log
pause
