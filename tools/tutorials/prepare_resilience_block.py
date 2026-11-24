"""Block R2 (lessons 42-45). Usage: py prepare_resilience_block.py --stage atomic|rollback|undo|conflict
Recreates ~/hydra-workspace/resilience-demo from C:\\data\\fallbackproject for the stage, registers it and writes the capture spec."""
import argparse, json, pathlib, shutil, subprocess, sys, time, urllib.request
B = "http://127.0.0.1:5678"
ap = argparse.ArgumentParser(); ap.add_argument("--stage", required=True); stage = ap.parse_args().stage
src = pathlib.Path(r"C:\data\fallbackproject"); dst = pathlib.Path.home() / "hydra-workspace" / "resilience-demo"
if dst.exists(): shutil.rmtree(dst, ignore_errors=True)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".hydra", "__pycache__", ".git"))
WF = {"atomic": "wf_atomic_demo", "rollback": "wf_report", "undo": "wf_bad_rollback", "conflict": "wf_conflict"}[stage]
(dst / "workflows" / "thread.yaml").write_text(f'version: "1.0"\nthread:\n  - mode: sequential\n    workflows:\n      - name: {WF}\n        active: true\nloops: []\n', encoding="utf-8")
if stage in ("rollback", "conflict"):                       # make the last step fail
    f = dst / "Data" / "finalize.csv"
    if f.exists(): f.rename(dst / "Data" / "finalize.csv.off")
def call(path, data=None):
    req = urllib.request.Request(B + path, method="POST" if data is not None else "GET", data=None if data is None else json.dumps(data).encode(), headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=30))
pid = call("/api/projects/open", {"path": str(dst)})["id"]
wfs = call(f"/api/workflows?project_id={pid}"); wid = {w["name"]: w["id"] for w in wfs}[WF]
print("project", pid, "workflow", WF, wid)
if stage == "conflict":                                       # run wf_conflict, edit the report during its 30 s wait
    p = subprocess.Popen(["hdrctl", "workflow", "run", "wf_conflict"], cwd=dst, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(8)
    with open(dst / "outputs" / "report.csv", "a", encoding="utf-8") as fh: fh.write("MANUAL,1\n")
    p.wait(timeout=90); print("conflict prepared, journal:", (dst / ".hydra" / "undo" / "wf_conflict.json").exists())
base = json.load(open("lessons/14-use-parameters/captures-demo.json")); base["replace_text"].update({"resilience-demo": "orders-resilience-demo"})
PJ = f"/projects/{pid}"; WFP = f"/workflows/{wid}?projectId={pid}&scene=workflow"; FULL = {"x": 208, "y": 56, "width": 1232, "height": 844}
def S(n, path, steps, alt): return {"name": n, "path": path, "theme": "auto", "steps": steps, "clip": FULL, "alt": alt}
WFOPEN = [{"wait_for": "header"}, {"wait_ms": 2500}]
def TERM(cmd, wait=22000): return [{"wait_for": "header"}, {"wait_ms": 2500}, {"click": "button[title='Logs panel']"}, {"wait_ms": 800}, {"click_text": "Terminal"}, {"wait_ms": 2500}, {"click": ".xterm"}, {"type": "cd ~/hydra-workspace/resilience-demo"}, {"press": "Enter"}, {"wait_ms": 800}, {"type": "function prompt { 'PS C:\\Users\\you\\project> ' }"}, {"press": "Enter"}, {"wait_ms": 500}, {"type": "cls"}, {"press": "Enter"}, {"wait_ms": 500}, {"type": cmd}, {"press": "Enter"}, {"wait_ms": wait}]
if stage == "atomic":
    out, shots = "42-all-or-nothing-load", [
     S("terminal-destination-yaml-replace", WFP, TERM("Get-Content jobs\\atomic_demo\\destinations.yaml", 6000), "The Studio terminal showing jobs/atomic_demo/destinations.yaml, a CSV destination in replace mode without an atomic line."),
     S("terminal-atomic-load-failed", WFP, TERM("hdrctl workflow run wf_atomic_demo; Get-Content outputs\\atomic_demo.csv"), "The Studio terminal after a failed load of wf_atomic_demo, followed by the content of outputs/atomic_demo.csv.")]
elif stage == "rollback":
    out, shots = "43-roll-back-a-failed-workflow", [
     S("workflow-rollback-toolbar-on", WFP, WFOPEN, "The workflow editor of wf_report with the Rollback button on in the toolbar."),
     S("undo-editor-share-dialog", WFP, WFOPEN + [{"dblclick_node": 1}, {"wait_ms": 1200}, {"scroll_into_view": "[data-testid=undo-editor]"}, {"wait_ms": 500}], "The dialog of the share action with the Undo section set to run a python action."),
     S("terminal-rollback-failed-run", WFP, TERM("hdrctl workflow run wf_report"), "The Studio terminal after a failed run of wf_report, with the two undone steps.")]
elif stage == "undo":
    out, shots = "44-declare-undo-actions", [
     S("terminal-validate-undo-refused", WFP, TERM("hdrctl workflow validate wf_bad_rollback", 8000), "The Studio terminal after hdrctl workflow validate wf_bad_rollback, showing the refusal for the step notify."),
     S("undo-editor-not-set-dialog", WFP, WFOPEN + [{"dblclick_node": 1}, {"wait_ms": 1200}, {"scroll_into_view": "[data-testid=undo-editor]"}, {"wait_ms": 500}], "The dialog of the notify action with the Undo list showing Not set."),
     S("undo-editor-nothing-selected", WFP, WFOPEN + [{"dblclick_node": 1}, {"wait_ms": 1200}, {"select_option": "[aria-label='Undo action']", "value": "none"}, {"scroll_into_view": "[data-testid=undo-editor]"}, {"wait_ms": 600}], "The dialog of the notify action with the Undo list set to Nothing to undo.")]
else:
    out, shots = "45-resolve-conflicts-and-recover", [
     S("terminal-conflict-run-refused", WFP, TERM("hdrctl workflow run wf_conflict", 12000), "The Studio terminal after a second run of wf_conflict, refused because of the undo journal."),
     S("terminal-workflow-undo-stopped", WFP, TERM("hdrctl workflow undo wf_conflict", 12000), "The Studio terminal after hdrctl workflow undo wf_conflict, which stops at build_report.")]
base["shots"] = shots; d = pathlib.Path("lessons") / out; d.mkdir(parents=True, exist_ok=True)
json.dump(base, open(d / "captures.json", "w"), indent=2); print(len(shots), "shots ->", d)
