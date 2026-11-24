@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."
set "LOG=%~dp0..\block-mcp.log"
> "%LOG%" echo === probe mcp %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist mcp-probe rmdir /S /Q mcp-probe
mkdir mcp-probe
cd mcp-probe
py --version >> "%LOG%" 2>&1
py -m venv venv >> "%LOG%" 2>&1
venv\Scripts\python.exe -m pip install -q "hydra-etl[mcp]" >> "%LOG%" 2>&1
echo ##### pip show >> "%LOG%"
venv\Scripts\python.exe -m pip show hydra-etl mcp >> "%LOG%" 2>&1
set "HYDRA_HOME=%CD%\fake-home"
venv\Scripts\hdrctl.exe init mcp-demo --template csv >> "%LOG%" 2>&1
echo ##### project files >> "%LOG%"
dir /s /b mcp-demo | findstr /v "\.hydra" >> "%LOG%" 2>&1
cd mcp-demo
echo ##### setup >> "%LOG%"
..\venv\Scripts\hdrctl.exe mcp setup >> "%LOG%" 2>&1
echo ##### setup again >> "%LOG%"
..\venv\Scripts\hdrctl.exe mcp setup >> "%LOG%" 2>&1
echo ##### .mcp.json >> "%LOG%"
type .mcp.json >> "%LOG%" 2>&1
echo ##### setup from subfolder >> "%LOG%"
cd jobs
..\..\venv\Scripts\hdrctl.exe mcp setup >> "%LOG%" 2>&1
cd ..
echo ##### setup bad path >> "%LOG%"
..\venv\Scripts\hdrctl.exe mcp setup --path nope >> "%LOG%" 2>&1
echo ##### client >> "%LOG%"
..\venv\Scripts\python.exe ..\..\mcp-gen\mcp_client.py "%CD%" "%CD%\..\venv\Scripts\python.exe" >> "%LOG%" 2>&1
echo ##### after >> "%LOG%"
dir /s /b .hydra\trash >> "%LOG%" 2>&1
echo ##### help >> "%LOG%"
..\venv\Scripts\hydra-mcp.exe --help >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
