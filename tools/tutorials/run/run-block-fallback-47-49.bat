@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-fallback-47-49.log"
> "%LOG%" echo === block fallback 47-49 %DATE% %TIME% ===
curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\hc.txt" 2>nul
set "HC=000"
set /p HC=<"%TEMP%\hc.txt"
set "STARTED=0"
if not "%HC%"=="200" (
  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"
  set "STARTED=1"
  timeout /t 12 /nobreak >nul
)
>> "%LOG%" echo --- 47 conditions
py prepare_fallback_block.py --stage conditions >> "%LOG%" 2>&1
py capture_studio.py lessons\47-fallback-conditions-when-on-failure\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\47-fallback-conditions-when-on-failure\captures.json --channel msedge --out ..\..\public\tutorials\studio-fallback-conditions-when-on-failure >> "%LOG%" 2>&1
>> "%LOG%" echo --- 48 timeout
py prepare_fallback_block.py --stage timeout >> "%LOG%" 2>&1
py capture_studio.py lessons\48-set-timeouts-on-workflows\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\48-set-timeouts-on-workflows\captures.json --channel msedge --out ..\..\public\tutorials\studio-set-timeouts-on-workflows >> "%LOG%" 2>&1
>> "%LOG%" echo --- 49 dry run
py prepare_fallback_block.py --stage dryrun >> "%LOG%" 2>&1
py capture_studio.py lessons\49-dry-run-and-use-fallback\captures.json --check >> "%LOG%" 2>&1
py capture_studio.py lessons\49-dry-run-and-use-fallback\captures.json --channel msedge --out ..\..\public\tutorials\studio-dry-run-and-use-fallback >> "%LOG%" 2>&1
>> "%LOG%" echo --- evidence (Windows CLI)
pushd "%USERPROFILE%\hydra-workspace\fallback-demo"
>> "%LOG%" echo $ hdrctl run . --dry-run
hdrctl run . --dry-run >> "%LOG%" 2>&1
>> "%LOG%" echo $ hdrctl run . --use-fallback wf_load
hdrctl run . --use-fallback wf_load >> "%LOG%" 2>&1
>> "%LOG%" echo $ hdrctl run . --use-fallback wf_archive_alt
hdrctl run . --use-fallback wf_archive_alt >> "%LOG%" 2>&1
>> "%LOG%" echo $ hdrctl run jobs\load_orders --use-fallback wf_load
hdrctl run jobs\load_orders --use-fallback wf_load >> "%LOG%" 2>&1
popd
if "%STARTED%"=="1" (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":5678" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
)
echo Done.
