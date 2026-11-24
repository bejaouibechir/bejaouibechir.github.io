"""Windows evidence for lessons 60-61."""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import pathlib, shutil, subprocess, re
from scenarios_common import build, FLAKY_OK
d = pathlib.Path.home() / "hydra-workspace" / "resilient-evidence"
KEEP = re.compile(r"↪|↯|↩|Step|Workflow|Project|⛔|⚠|•|Dry|│|Stage|err ", re.I)
def run(*a):
    r = subprocess.run(["hdrctl", *a], cwd=d, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print("$ hdrctl", *a)
    for l in (r.stdout + r.stderr).splitlines():
        if KEEP.search(l): print("  ", l.strip()[:260])
for stage, title in [("ok", "dry run + nominal"), ("a", "A orders missing"), ("b", "B service down"), ("c", "C finalize missing")]:
    build(d, stage); (d / ".hydra").mkdir(exist_ok=True); print("==", title)
    if stage == "ok": run("run", ".", "--dry-run")
    run("run", ".")
build(d, "ok"); (d / ".hydra").mkdir(exist_ok=True); print("== D timeout 3s, delay 4")
w = d / "workflows"; (w / "wf_flaky.yaml").write_text(FLAKY_OK.replace("delay: 1", "delay: 4")); t = w / "thread.yaml"; t.write_text(t.read_text().replace("timeout: 20s", "timeout: 3s")); run("run", ".")
