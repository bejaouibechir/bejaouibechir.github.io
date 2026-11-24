@echo off
cd /d "%~dp0"
echo Hydra tutorials watcher - keep this window open. Close it to stop.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0watch.ps1"
pause
