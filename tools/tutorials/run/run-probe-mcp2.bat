@echo off
cd /d "%~dp0.."
set "LOG=%~dp0..\block-mcp2.log"
> "%LOG%" echo === probe mcp2 %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
cd mcp-probe\mcp-demo
..\venv\Scripts\python.exe ..\..\mcp-gen\mcp_client.py "%CD%" "%CD%\..\venv\Scripts\python.exe" >> "%LOG%" 2>&1
echo ##### after >> "%LOG%"
dir /s /b .hydra\trash >> "%LOG%" 2>&1
echo ##### git ignore >> "%LOG%"
type .gitignore >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
