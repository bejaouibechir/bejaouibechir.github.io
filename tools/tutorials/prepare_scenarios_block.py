"""Block R3 (lessons 60-61). Usage: py prepare_scenarios_block.py --stage build|a|b|c"""
import argparse, json, pathlib, urllib.request
from scenarios_common import build
B = "http://127.0.0.1:5678"
ap = argparse.ArgumentParser(); ap.add_argument("--stage", required=True); stage = ap.parse_args().stage
dst = pathlib.Path.home() / "hydra-workspace" / "resilient-pipeline"; build(dst, {"build": "ok"}.get(stage, stage))
def call(path, data):
    req = urllib.request.Request(B + path, method="POST", data=json.dumps(data).encode(), headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=30))
pid = call("/api/projects/open", {"path": str(dst)})["id"]; print("project", pid, stage)
base = json.load(open("lessons/14-use-parameters/captures-demo.json")); base["replace_text"].update({"resilient-pipeline": "orders-pipeline"})
PJ = f"/projects/{pid}"; FULL = {"x": 208, "y": 56, "width": 1232, "height": 844}; TE = "[data-testid=thread-editor]"
OPEN = [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_text": "Project settings"}, {"wait_ms": 1800}]
RUN = [{"wait_for": "header"}, {"wait_ms": 1500}, {"click_text": "Run project"}, {"wait_ms": 14000}, {"goto": "/runs"}, {"wait_ms": 1500}, {"click": "a[href*='/runs/']"}, {"wait_ms": 2500}]
def S(n, steps, alt): return {"name": n, "path": PJ, "theme": "auto", "steps": steps, "clip": FULL, "alt": alt}
if stage == "build":
    out, shots = "60-build-a-resilient-pipeline", [
     S("execution-order-resilient-project", OPEN, "The Execution order panel with two stages and the protections of the resilient pipeline."),
     S("project-check-resilient-ready", OPEN + [{"click": TE + " button:has-text('Check')"}, {"wait_ms": 3000}], "The Execution order panel after Check, with the Ready line."),
     S("run-project-resilient-nominal-detail", RUN, "The run detail page of the resilient pipeline, with four workflows succeeded.")]
else:
    out, shots = {"a": ("61-break-it-then-recover", "run-project-orders-missing-fallback", "The run detail page of the resilient pipeline with wf_load and wf_report replaced by their fallbacks."),
                  "b": ("61-break-it-then-recover", "run-project-service-failed-stopped", "The run detail page of the resilient pipeline with wf_flaky failed and the project stopped."),
                  "c": ("61-break-it-then-recover", "run-project-finalize-undone-replaced", "The run detail page of the resilient pipeline with wf_report failed, undone and replaced by the quarantine workflow.")}[stage][0], \
        [S(*({"a": ("run-project-orders-missing-fallback", RUN, "The run detail page of the resilient pipeline with wf_load and wf_report replaced by their fallbacks."),
              "b": ("run-project-service-failed-stopped", RUN, "The run detail page of the resilient pipeline with wf_flaky failed and the project stopped."),
              "c": ("run-project-finalize-undone-replaced", RUN, "The run detail page of the resilient pipeline with wf_report failed, undone and replaced by the quarantine workflow.")}[stage]))]
base["shots"] = shots; d = pathlib.Path("lessons") / out; d.mkdir(parents=True, exist_ok=True)
json.dump(base, open(d / f"captures-{stage}.json", "w"), indent=2); print(len(shots), "shots ->", d / f"captures-{stage}.json")
