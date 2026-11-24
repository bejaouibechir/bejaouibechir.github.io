import json,os
base={"base_url":"http://127.0.0.1:5678","viewport":{"width":1440,"height":900},"scale":2,"theme_cycle":["light","dark"],
 "replace_text":{"C:\\Users\\DELL":"C:\\Users\\you","essai012":"orders-demo","fallbackproject":"backup-demo","env-project":"env-demo","hydra-cdc-mirror-demo":"cdc-demo","snwoflake":"warehouse-demo"}}
ED="/workflows/a991cb22?projectId=e84ae443"; PJ="/projects/e84ae443"
J=[{"wait_for":"header"},{"wait_ms":1200}]
W=[{"click_text":"Workflow configuration"},{"wait_ms":1000}]
FULL={"x":208,"y":56,"width":1232,"height":844}
def S(n,path,steps,clip,alt,theme="auto"): return {"name":n,"path":path,"theme":theme,"steps":steps,"clip":clip,"alt":alt}
L={}
L["03-read-the-canvas"]=("studio-03-read-the-canvas",[
 S("job-canvas-four-nodes",ED,J,FULL,"Jobs configuration canvas for first-job: a CSV source, a select, a filter and a CSV destination joined by three edges, with the Valid badge in the header."),
 S("workflow-canvas-two-jobs",ED,J+W,FULL,"Workflow configuration canvas with two job nodes, first-job and second-job, joined by one edge."),
 S("job-canvas-second-job",ED,J+[{"click_text":"second-job"},{"wait_ms":1500}],FULL,"Jobs configuration canvas for second-job: a CSV source reading the output of first-job, a select and a CSV destination."),
 S("job-tab-bar-two-jobs",ED,J,{"x":208,"y":860,"width":560,"height":40},"Tab bar at the bottom of the editor with the first-job and second-job tabs and the plus button.")])
L["08-see-the-yaml"]=("studio-09-see-the-yaml",[
 S("job-dsl-sources-tab",ED,J+[{"click_text":"Hydra DSL"},{"wait_ms":1200}],FULL,"Hydra DSL panel open beside the job canvas, showing sources.yaml for first-job with tabs Sources, Transformations, Destinations and Pipeline."),
 S("job-dsl-pipeline-tab",ED,J+[{"click_text":"Hydra DSL"},{"wait_ms":900},{"click_last_text":"Pipeline"},{"wait_ms":900}],FULL,"The Pipeline tab of the Hydra DSL panel showing which source feeds which destination."),
 S("job-dsl-transformations-tab",ED,J+[{"click_text":"Hydra DSL"},{"wait_ms":900},{"click_last_text":"Transformations"},{"wait_ms":900}],FULL,"The Transformations tab of the Hydra DSL panel showing the select and filter steps of first-job."),
 S("job-dsl-destinations-tab",ED,J+[{"click_text":"Hydra DSL"},{"wait_ms":900},{"click_last_text":"Destinations"},{"wait_ms":900}],FULL,"The Destinations tab of the Hydra DSL panel showing the csv destination of first-job with its load table and replace mode."),
 S("workflow-dsl-panel-open",ED,J+W+[{"click_text":"Hydra DSL"},{"wait_ms":1200}],FULL,"Hydra DSL panel in the Workflow configuration tab, showing workflow.yaml with the two job steps.")])
L["09-reach-valid"]=("studio-09-reach-valid",[
 S("header-valid-badge-job",ED,J,{"x":208,"y":56,"width":760,"height":60},"Editor header for first-job with the green Valid badge next to the node and edge count."),
 S("header-valid-badge-workflow",ED,J+W,{"x":208,"y":56,"width":760,"height":60},"Editor header in the workflow scene with the Valid badge and a count of two nodes and one edge.")])
L["10-run-the-job"]=("studio-10-run-the-job",[
 S("run-job-logs-success",ED,J+[{"click_text":"Run Job"},{"wait_ms":6000}],FULL,"After Run Job, the logs panel reports a successful run of first-job with rows in and rows out, and a toast says Run completed."),
 S("run-workflow-logs-success",ED,J+W+[{"click_text":"Run Workflow"},{"wait_ms":7000}],{"x":208,"y":56,"width":1232,"height":560},"After Run Workflow, both job nodes of first-workflow are outlined in green, the sign that each step succeeded.")])
L["10-run-the-job"][1].extend([
 S("job-source-dialog-open",ED,J+[{"dblclick_node":0},{"wait_ms":1000}],FULL,"The CSV source dialog of first-job with its step name and file path."),
 S("job-filter-dialog-open",ED,J+[{"dblclick_node":2},{"wait_ms":1000}],FULL,"The Filter dialog of first-job with the expression status equals paid."),
 S("job-destination-dialog-open",ED,J+[{"dblclick_node":3},{"wait_ms":1000}],FULL,"The CSV destination dialog of first-job with its output file path."),
 S("notifications-panel-open",ED,J+[{"click":"button[title='Notifications']"},{"wait_ms":1000}],FULL,"The notifications panel opened from the top bar, listing completed runs."),
 S("terminal-run-first-job",ED,J+[{"click":"button[title='Logs panel']"},{"wait_ms":800},{"click_text":"Terminal"},{"wait_ms":2500},{"click":".xterm"},{"type":"hdrctl run jobs\\first-job"},{"press":"Enter"},{"wait_ms":9000}],FULL,"The Terminal tab inside Studio after running hdrctl run on the first-job folder."),
 S("terminal-run-first-workflow",ED,J+[{"click":"button[title='Logs panel']"},{"wait_ms":800},{"click_text":"Terminal"},{"wait_ms":2500},{"click":".xterm"},{"type":"hdrctl workflow run workflows\\first-workflow.yaml"},{"press":"Enter"},{"wait_ms":9000}],FULL,"The Terminal tab after running hdrctl workflow run on first-workflow.yaml.")])
L["11-review-a-run"]=("studio-11-review-a-run",[
 dict(S("sidebar-runs-entry-highlighted",ED,J,{"x":0,"y":56,"width":420,"height":300},"Hydra Studio editor with the Runs entry highlighted in the left sidebar."),highlight="a[href='/runs']"),
 S("runs-page-list","/runs",[{"wait_ms":1800}],FULL,"The Runs page listing past executions with their status."),
 S("run-detail-timeline","/runs",[{"wait_ms":1500},{"click":"a[href*='/runs/']"},{"wait_ms":2000}],FULL,"A run detail page with the execution timeline, duration, step count and one row per step.")])
L["12-compose-jobs"]=("studio-12-compose-jobs",[
 S("workflow-two-jobs-linked",ED,J+W,FULL,"Workflow scene with first-job linked to second-job."),
 S("execution-order-define-tab",PJ,[{"click_text":"Project settings"},{"wait_ms":1500}],FULL,"Execution order panel of Project settings with Stage 1 running first-workflow sequentially.")])
L["14-use-parameters"]=("studio-14-use-parameters",[
 S("settings-parameters-tab",PJ,[{"click_text":"Project settings"},{"wait_ms":1200},{"click_text":"Parameters"},{"wait_ms":1000}],FULL,"The Parameters tab of Project settings."),
 S("settings-secrets-tab",PJ,[{"click_text":"Project settings"},{"wait_ms":1200},{"click_text":"Secrets"},{"wait_ms":1000}],FULL,"The Secrets tab of Project settings."),
 S("settings-triggers-tab",PJ,[{"click_text":"Project settings"},{"wait_ms":1200},{"click_text":"Triggers"},{"wait_ms":1000}],FULL,"The Triggers tab of Project settings.")])
ONE={"10-run-the-job":("studio-10-run-the-job",[
 S("workflow-one-job-run-success",ED,J+W+[{"click_text":"Run Workflow"},{"wait_ms":6000}],{"x":208,"y":56,"width":1232,"height":560},"After Run Workflow on a workflow that holds only first-job, the single job node is outlined in green.")]),
 "12-compose-jobs":("studio-12-compose-jobs",[
 S("workflow-one-job-import-menu",ED,J+W+[{"click_text":"Import"},{"wait_ms":900}],FULL,"The workflow canvas holding only first-job, with the Import menu open on the Import a job entry."),
 S("workflow-one-job-canvas",ED,J+W,FULL,"The workflow canvas holding a single first-job node.")])}
for k,(folder,shots) in ONE.items():
    json.dump(dict(base,shots=shots),open("lessons/"+k+"/captures-one-job.json","w"),indent=2)
L["13-handle-failure"]=("studio-13-handle-failure",[
 S("error-scope-dropped-canvas",ED,J+W+[{"drag":"Error Scope","x":330,"y":110},{"wait_ms":900}],FULL,"The workflow canvas with an Error Scope container just dropped from the palette."),
 S("error-scope-settings-open",ED,J+W+[{"drag":"Error Scope","x":330,"y":110},{"dblclick_last_node":1},{"wait_ms":1000}],FULL,"The Error Scope container selected, with its On child failure setting."),
 S("retry-scope-settings-open",ED,J+W+[{"drag":"Retry Scope","x":330,"y":110},{"dblclick_last_node":1},{"wait_ms":1000}],FULL,"The Retry Scope container selected, with its retry settings."),
 S("sequence-container-dropped-canvas",ED,J+W+[{"drag":"Sequence Container","x":330,"y":110},{"wait_ms":900}],FULL,"The workflow canvas with a Sequence Container just dropped from the palette.")])
L["14-use-parameters"][1].extend([
 S("set-param-dialog-open",ED,J+W+[{"click_text":"Actions"},{"wait_ms":500},{"drag":"Set Param","x":330,"y":110},{"dblclick_last_node":1},{"wait_ms":1000}],FULL,"The Set Param dialog opened from a node dropped on the workflow canvas."),
 S("assign-param-dialog-open",ED,J+W+[{"click_text":"Actions"},{"wait_ms":500},{"drag":"Assign Param","x":330,"y":110},{"dblclick_last_node":1},{"wait_ms":1000}],FULL,"The Assign Param dialog opened from a node dropped on the workflow canvas.")])
bat=['@echo off','setlocal','cd /d "%~dp0"','set "LOG=%~dp0captures-priority.log"','> "%LOG%" echo === captures priority %DATE% %TIME% ===',
'curl.exe -s -o nul -w "%%{http_code}" http://127.0.0.1:5678/api/health > "%TEMP%\\hc.txt" 2>nul','set "HC=000"','set /p HC=<"%TEMP%\\hc.txt"','set "STARTED=0"',
'if not "%HC%"=="200" (','  start "hydra-serve" /MIN cmd /c "hdrctl serve > serve.log 2>&1"','  set "STARTED=1"','  timeout /t 12 /nobreak >nul',')']
bat+=['>> "%LOG%" echo --- stage one-job','py setup_course.py --stage one-job >> "%LOG%" 2>&1']
for k,(folder,shots) in ONE.items():
    win="lessons\\"+k
    bat+=['py capture_studio.py '+win+'\\captures-one-job.json --channel msedge --out ..\\..\\public\\tutorials\\'+folder+' >> "%LOG%" 2>&1']
bat+=['>> "%LOG%" echo --- stage two-jobs','py setup_course.py --stage two-jobs >> "%LOG%" 2>&1']
for k,(folder,shots) in L.items():
    d="lessons/"+k; os.makedirs(d,exist_ok=True)
    json.dump(dict(base,shots=shots),open(d+"/captures.json","w"),indent=2)
    win=d.replace("/","\\")
    bat+=['>> "%LOG%" echo --- '+k,'py capture_studio.py '+win+'\\captures.json --check >> "%LOG%" 2>&1','py capture_studio.py '+win+'\\captures.json --channel msedge --out ..\\..\\public\\tutorials\\'+folder+' >> "%LOG%" 2>&1']
bat+=['if "%STARTED%"=="1" (','  for /f "tokens=5" %%p in (\'netstat -ano ^| findstr ":5678" ^| findstr LISTENING\') do taskkill /F /PID %%p >nul 2>&1',')','echo Done. Log: tools\\tutorials\\captures-priority.log','pause']
open("run-captures-priority.bat","w").write("\r\n".join(bat)+"\r\n")
