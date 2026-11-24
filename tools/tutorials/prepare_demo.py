"""Copy the engine's parameters_demo project into the Studio workspace, register it, and write lessons/14-use-parameters/captures-demo.json (lesson 'Use parameters')."""
import json, pathlib, shutil, urllib.request
B="http://127.0.0.1:5678"
src=pathlib.Path.home()/"Desktop"/"Hydra"/"test_scenarios"/"parameters_demo"
dst=pathlib.Path.home()/"hydra-workspace"/"parameters_demo"
if not dst.exists():
    shutil.copytree(src,dst,ignore=shutil.ignore_patterns("import_bundle","__pycache__","check_params.py"))
req=urllib.request.Request(B+"/api/projects/open",method="POST",data=json.dumps({"path":str(dst)}).encode(),headers={"Content-Type":"application/json"})
pid=json.load(urllib.request.urlopen(req,timeout=30))["id"]; print("project",pid,dst)
base=json.load(open("lessons/14-use-parameters/captures.json"))
shots=[]; PJ=f"/projects/{pid}"
OPEN=[{"click_text":"Open in editor"},{"wait_ms":2500},{"click_text":"Workflow configuration"},{"wait_ms":1200}]
FULL={"x":208,"y":56,"width":1232,"height":844}
def S(n,steps,alt,clip=FULL,path=PJ): shots.append({"name":n,"path":path,"theme":"auto","steps":steps,"clip":clip,"alt":alt})
S("parameters-workflow-seven-nodes",OPEN,"The workflow canvas of parameters-workflow: seven nodes in one chain, from set_label to report.")
for n,alt in [("set_label","The Set Param dialog for the step set_label, creating the parameter run_label."),("set_region","The Set Param dialog for the step set_region, creating the parameter region."),("announce","The Log dialog for the step announce, whose message contains two param placeholders."),("switch_region","The Assign Param dialog for the step switch_region, changing region."),("report","The Log dialog for the step report, with the same placeholders after the change.")]:
    S("dialog-"+n.replace("_","-")+"-open",OPEN+[{"dblclick_node":{"set_label":0,"set_region":1,"announce":2,"switch_region":4,"report":6}[n]},{"wait_ms":1000}],alt)
S("run-workflow-timeline-detail",OPEN+[{"click_text":"Run Workflow"},{"wait_ms":8000},{"goto":"/runs"},{"wait_ms":1500},{"click":"a[href*='/runs/']"},{"wait_ms":2500}],"The run detail page of parameters-workflow with its execution timeline and seven steps.")
spec=dict(base); spec["shots"]=shots
json.dump(spec,open("lessons/14-use-parameters/captures-demo.json","w"),indent=2); print(len(shots),"shots")
