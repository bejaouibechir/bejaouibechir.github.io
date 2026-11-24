"""Block 'Fallback' (lessons 47, 48, 49). Usage: py prepare_fallback_block.py --stage conditions|timeout|dryrun
Prepares the fallback-demo project in the Studio workspace for the stage, registers it and writes the capture spec."""
import argparse, json, pathlib, shutil, urllib.request
B = "http://127.0.0.1:5678"
ap = argparse.ArgumentParser(); ap.add_argument("--stage", required=True); stage = ap.parse_args().stage
src = pathlib.Path(r"C:\data\fallbackproject"); dst = pathlib.Path.home() / "hydra-workspace" / "fallback-demo"
if stage == "conditions" and dst.exists():
    shutil.rmtree(dst)
if not dst.exists():
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".hydra", "__pycache__", ".git"))
thread = dst / "workflows" / "thread.yaml"
if stage == "timeout":
    thread.write_text('version: "1.0"\nthread:\n  - mode: sequential\n    workflows:\n      - name: wf_conflict\n        active: true\nloops: []\n', encoding="utf-8")
else:   # conditions, dryrun: the project's own thread (three fallbacks)
    thread.write_text((src / "workflows" / "thread.yaml").read_text(encoding="utf-8"), encoding="utf-8")
stamp = dst / "Data" / "stamp.txt"
if stamp.exists(): stamp.unlink()
for f in ("orders.csv", "finalize.csv"):          # earlier states may have hidden them
    off = dst / "Data" / (f + ".off")
    if off.exists() and not (dst / "Data" / f).exists(): off.rename(dst / "Data" / f)
req = urllib.request.Request(B + "/api/projects/open", method="POST", data=json.dumps({"path": str(dst)}).encode(), headers={"Content-Type": "application/json"})
pid = json.load(urllib.request.urlopen(req, timeout=30))["id"]; print("project", pid, stage)
base = json.load(open("lessons/14-use-parameters/captures-demo.json")); base["replace_text"].update({"fallback-demo": "orders-fallback-demo"})
PJ = f"/projects/{pid}"; FULL = {"x": 208, "y": 56, "width": 1232, "height": 844}
OPEN = [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_text": "Project settings"}, {"wait_ms": 1500}]
TE = "[data-testid=thread-editor]"; LB = lambda w: f"button[aria-label='{w} fallback']"
def S(n, steps, alt, path=PJ): return {"name": n, "path": path, "theme": "auto", "steps": steps, "clip": FULL, "alt": alt}
def TERM(cmd): return [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_text": "Open in editor"}, {"wait_ms": 2500}, {"click": "button[title='Logs panel']"}, {"wait_ms": 800}, {"click_text": "Terminal"}, {"wait_ms": 2500}, {"click": ".xterm"}, {"type": "cd ~/hydra-workspace/fallback-demo"}, {"press": "Enter"}, {"wait_ms": 800}, {"type": "cls"}, {"press": "Enter"}, {"wait_ms": 500}, {"type": cmd}, {"press": "Enter"}, {"wait_ms": 9000}]
if stage == "conditions":
    out, shots = "47-fallback-conditions-when-on-failure", [
     S("condition-assistant-insert-row", OPEN + [{"click": LB("wf_load")}, {"wait_ms": 700}, {"select_option": "[aria-label='Condition function']", "value": "file_size"}, {"wait_ms": 600}], "The fallback editor of wf_load with the assistant row open on the file_size function."),
     S("condition-error-message-red", OPEN + [{"click": LB("wf_load")}, {"wait_ms": 700}, {"fill": "[aria-label='wf_load fallback condition']", "value": "file_exist('Data/orders.csv')"}, {"wait_ms": 900}], "The fallback editor of wf_load with the condition file_exist marked with a red cross and an error message."),
     S("on-probe-error-replace-menu", OPEN + [{"click": LB("wf_archive")}, {"wait_ms": 700}, {"select_option": "[aria-label='wf_archive on probe error']", "value": "replace"}, {"wait_ms": 600}], "The fallback editor of wf_archive with the if a check cannot answer list set to use the fallback."),
     S("on-failure-checkbox-wf-report", OPEN + [{"click": LB("wf_report")}, {"wait_ms": 900}], "The fallback editor of wf_report with the also after a failure box checked.")]
elif stage == "timeout":
    out, shots = "48-set-timeouts-on-workflows", [
     S("workflow-timeout-field-filled", OPEN + [{"fill": "[aria-label='wf_conflict timeout']", "value": "5s"}, {"wait_ms": 700}], "The Execution order panel with the max field of wf_conflict set to 5s."),
     S("run-timeout-failed-detail", OPEN + [{"fill": "[aria-label='wf_conflict timeout']", "value": "5s"}, {"wait_ms": 500}, {"click": TE + " button:has-text('Save')"}, {"wait_ms": 1500}, {"click_text": "Back to the project"}, {"wait_ms": 1500}, {"click_text": "Run project"}, {"wait_ms": 42000}, {"goto": "/runs"}, {"wait_ms": 1500}, {"click": "a[href*='/runs/']"}, {"wait_ms": 2500}], "The run detail page of a project whose workflow wf_conflict failed after exceeding its 5 second timeout.")]
else:
    out, shots = "49-dry-run-and-use-fallback", [
     S("terminal-dry-run-fallback-plan", TERM("hdrctl run . --dry-run"), "The Studio terminal after hdrctl run . --dry-run, ending with Dry run OK."),
     S("project-check-quarantine-warning", OPEN + [{"click": TE + " button:has-text('Check')"}, {"wait_ms": 3000}], "The Execution order panel after Check, with a Ready line and a warning about wf_report_quarantine."),
     S("terminal-use-fallback-forced-run", TERM("hdrctl run . --use-fallback wf_load"), "The Studio terminal after hdrctl run . --use-fallback wf_load, showing the forced switch.")]
base["shots"] = shots; d = pathlib.Path("lessons") / out; d.mkdir(parents=True, exist_ok=True)
json.dump(base, open(d / "captures.json", "w"), indent=2); print(len(shots), "shots ->", d)
