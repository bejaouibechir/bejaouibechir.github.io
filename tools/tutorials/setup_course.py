"""Build the content of the course project studio-course (jobs first-job and second-job, sample data) with hdrctl, then validate it.
Run via run-priority.bat. Safe to re-run."""
import argparse, json, pathlib, subprocess, sys, urllib.request
ap=argparse.ArgumentParser(); ap.add_argument("--stage",choices=["empty","one-job","two-jobs"],default="two-jobs"); A=ap.parse_args()
B="http://127.0.0.1:5678"
ps=json.load(urllib.request.urlopen(B+"/api/projects",timeout=20))
root=pathlib.Path(next(p["path"] for p in ps if p["name"]=="studio-course"))
print("project",root)
def sh(*a):
    r=subprocess.run(list(a),cwd=root,capture_output=True,text=True); print("$"," ".join(a)); print((r.stdout+r.stderr).strip()[-600:]); return r.returncode
if not (root/"workflows"/"first-workflow.yaml").exists(): sh("hdrctl","workflow","add","first-workflow")
for j in (() if A.stage=="empty" else ("first-job","second-job")):
    if not (root/"jobs"/j).exists(): sh("hdrctl","job","add",j,"first-workflow")
if A.stage=="empty":
    import shutil
    for p in (root/"jobs").glob("*"):
        if p.is_dir(): shutil.rmtree(p,ignore_errors=True)
    (root/"jobs").mkdir(exist_ok=True)
    (root/"workflows"/"first-workflow.yaml").write_text('version: "1.0"\nworkflow:\n  name: first-workflow\n  description: ""\n  trigger:\n    type: manual\n  steps: []\n',encoding="utf-8")
    print("stage empty"); sh("hdrctl","workflow","validate","first-workflow"); sys.exit(0)
sys.path.insert(0,str(pathlib.Path(__file__).parent))
import datagen
data=root/"jobs"/"first-job"/"data"; data.mkdir(parents=True,exist_ok=True)
subprocess.run([sys.executable,str(pathlib.Path(__file__).parent/"datagen.py"),"orders",str(data/"orders.csv"),"--rows","20"],check=True)
(root/"jobs"/"first-job"/"sources.yaml").write_text("sources:\n  src_orders:\n    type: csv\n    extract:\n      table: data/orders.csv\n      batch_size: 50000\n",encoding="utf-8")
(root/"jobs"/"first-job"/"transformations.yaml").write_text("steps:\n  - select:\n      columns: [order_id, customer, country, amount, status]\n  - filter:\n      expr: \"status == 'paid'\"\n",encoding="utf-8")
(root/"jobs"/"first-job"/"destinations.yaml").write_text("destinations:\n  dest_paid:\n    type: csv\n    load:\n      table: ../../outputs/paid_orders.csv\n      mode: replace\n",encoding="utf-8")
(root/"jobs"/"first-job"/"pipeline.yaml").write_text("pipeline:\n  from: src_orders\n  to: dest_paid\n",encoding="utf-8")
sj=root/"jobs"/"second-job"
(sj/"sources.yaml").write_text("sources:\n  src_paid_orders:\n    type: csv\n    extract:\n      table: ../../outputs/paid_orders.csv\n      batch_size: 50000\n",encoding="utf-8")
(sj/"transformations.yaml").write_text("steps:\n  - select:\n      columns: [order_id, customer, amount]\n",encoding="utf-8")
(sj/"destinations.yaml").write_text("destinations:\n  dest_summary:\n    type: csv\n    load:\n      table: ../../outputs/paid_summary.csv\n      mode: replace\n",encoding="utf-8")
(sj/"pipeline.yaml").write_text("pipeline:\n  from: src_paid_orders\n  to: dest_summary\n",encoding="utf-8")
wf=root/"workflows"/"first-workflow.yaml"
steps="    - name: first-job\n      type: job\n      job: ../jobs/first-job\n      depends_on: []\n      on_failure: fail\n"
if A.stage=="two-jobs": steps+="    - name: second-job\n      type: job\n      job: ../jobs/second-job\n      depends_on:\n        - first-job\n      on_failure: fail\n"
wf.write_text('version: "1.0"\nworkflow:\n  name: first-workflow\n  description: ""\n  trigger:\n    type: manual\n  steps:\n'+steps,encoding="utf-8")
print("stage",A.stage)
sh("hdrctl","validate","jobs/first-job")
sh("hdrctl","workflow","validate","first-workflow")
sh("hdrctl","run","jobs/first-job","--dry-run")
sh("hdrctl","workflow","validate","first-workflow")
