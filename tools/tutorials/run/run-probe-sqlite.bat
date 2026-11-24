@echo off
setlocal
cd /d "%~dp0.."
set "LOG=%~dp0..\block-sqlite.log"
> "%LOG%" echo === probe sqlite %DATE% %TIME% ===
set HYDRA_NO_BANNER=1
set PYTHONIOENCODING=utf-8
if exist sqlite-probe rmdir /S /Q sqlite-probe
xcopy /E /I /Q /H sqlite-gen sqlite-probe >> "%LOG%" 2>&1
cd sqlite-probe
py make_db.py >> "%LOG%" 2>&1
for %%j in (read-table read-query missing-db missing-table) do (
  echo ##### validate %%j >> "%LOG%"
  hdrctl validate jobs\%%j >> "%LOG%" 2>&1
  echo ##### run %%j >> "%LOG%"
  hdrctl run jobs\%%j >> "%LOG%" 2>&1
  echo ##### out %%j >> "%LOG%"
  type jobs\%%j\data\out_%%j.csv >> "%LOG%" 2>&1
)
echo ##### load 1 >> "%LOG%"
hdrctl run jobs\load-sqlite >> "%LOG%" 2>&1
py dump.py data\warehouse.db "SELECT * FROM orders ORDER BY order_id" >> "%LOG%" 2>&1
py dump.py data\warehouse.db "SELECT sql FROM sqlite_master WHERE name='orders'" >> "%LOG%" 2>&1
py change_db.py >> "%LOG%" 2>&1
echo ##### load 2 >> "%LOG%"
hdrctl run jobs\load-sqlite >> "%LOG%" 2>&1
py dump.py data\warehouse.db "SELECT * FROM orders ORDER BY order_id" >> "%LOG%" 2>&1
echo ##### load 3 >> "%LOG%"
hdrctl run jobs\load-sqlite >> "%LOG%" 2>&1
py dump.py data\warehouse.db "SELECT count(*) FROM orders" >> "%LOG%" 2>&1
echo Done. >> "%LOG%"
