"""Lesson 'Declare a fallback workflow' (n 46): copy fallbackproject into the Studio workspace, remove the
fallback of wf_load, hide Data/orders.csv, register the project, write the capture spec. Usage: py prepare_fallback.py"""
import json, pathlib, shutil, urllib.request
B = "http://127.0.0.1:5678"
src = pathlib.Path(r"C:\data\fallbackproject")
dst = pathlib.Path.home() / "hydra-workspace" / "fallback-demo"
if dst.exists():
    shutil.rmtree(dst)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".hydra", "__pycache__", ".git"))
(dst / "workflows" / "thread.yaml").write_text(
    'version: "1.0"\nthread:\n  - mode: sequential\n    workflows:\n      - name: wf_load\n        active: true\nloops: []\n',
    encoding="utf-8")
orders = dst / "Data" / "orders.csv"
if orders.exists():
    orders.rename(dst / "Data" / "orders.csv.off")
req = urllib.request.Request(B + "/api/projects/open", method="POST",
                             data=json.dumps({"path": str(dst)}).encode(), headers={"Content-Type": "application/json"})
pid = json.load(urllib.request.urlopen(req, timeout=30))["id"]
print("project", pid, dst)
base = json.load(open("lessons/14-use-parameters/captures-demo.json"))
base["replace_text"].update({"fallback-demo": "orders-fallback-demo"})
PJ = f"/projects/{pid}"
FULL = {"x": 208, "y": 56, "width": 1232, "height": 844}
OPEN = [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_text": "Project settings"}, {"wait_ms": 1500}]
TE = "[data-testid=thread-editor]"
LB = "button[aria-label='wf_load fallback']"
SEL = "select[aria-label='Add a fallback for wf_load']"
COND = "[aria-label='wf_load fallback condition']"
DECL = OPEN + [{"click": LB}, {"wait_ms": 700}, {"select_option": SEL, "value": "wf_load_backup"},
               {"wait_ms": 500}, {"fill": COND, "value": "not file_exists('Data/orders.csv')"}, {"wait_ms": 900}]
def S(n, steps, alt, clip=FULL): return {"name": n, "path": PJ, "theme": "auto", "steps": steps, "clip": clip, "alt": alt}
shots = [
 S("execution-order-before-fallback", OPEN, "The Execution order panel of Project settings with wf_load alone in Stage 1 and the lifebuoy button on its row."),
 S("fallback-editor-open", OPEN + [{"click": LB}, {"wait_ms": 700}], "The fallback editor opened under wf_load, with the replacement list still empty."),
 S("fallback-condition-valid", DECL, "The fallback editor for wf_load with wf_load_backup as replacement and the condition not file_exists('Data/orders.csv') marked valid."),
 S("fallback-preview-tab", DECL + [{"click": TE + " button:has-text('Preview')"}, {"wait_ms": 1000}], "The Preview tab drawing wf_load with a dashed fallback block for wf_load_backup and the condition on the link."),
 S("fallback-check-ready", DECL + [{"click": TE + " button:has-text('Save')"}, {"wait_ms": 1500}, {"click": TE + " button:has-text('Check')"}, {"wait_ms": 3000}], "The Check result of the Execution order panel after saving the fallback."),
 S("run-project-fallback-badge", OPEN + [{"click_text": "Run project"}, {"wait_ms": 9000}, {"goto": "/runs"}, {"wait_ms": 1500}, {"click": "a[href*='/runs/']"}, {"wait_ms": 2500}], "The run detail page where wf_load_backup ran in place of wf_load with a fallback badge."),
]
base["shots"] = shots
json.dump(base, open("lessons/46-declare-a-fallback-workflow/captures.json", "w"), indent=2)
print(len(shots), "shots")
