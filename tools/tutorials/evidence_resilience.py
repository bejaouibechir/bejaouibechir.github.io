"""Windows evidence for lessons 42-45: runs the scenarios on a scratch copy and prints the key lines."""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import pathlib, shutil, subprocess, time, re
src = pathlib.Path(r"C:\data\fallbackproject"); d = pathlib.Path.home() / "hydra-workspace" / "resilience-evidence"
if d.exists(): shutil.rmtree(d, ignore_errors=True)
shutil.copytree(src, d, ignore=shutil.ignore_patterns(".hydra", "__pycache__", ".git"))
(d / ".hydra").mkdir(exist_ok=True)
KEEP = re.compile(r"Step|Workflow|↩|⏭|✅|❌|Nothing|Invalid|step '|previous run|undo", re.I)
def hdr(*a):
    r = subprocess.run(["hdrctl", *a], cwd=d, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print("$ hdrctl", *a)
    for l in (r.stdout + r.stderr).splitlines():
        if KEEP.search(l): print("  ", l.strip()[:330])
def lines(p): return len((d / p).read_text(encoding="utf-8").splitlines())
print("== 42 atomic"); hdr("workflow", "run", "wf_atomic_demo"); print("   file:", (d/"outputs/atomic_demo.csv").read_text().splitlines())
y = d / "jobs/atomic_demo/destinations.yaml"; y.write_text(y.read_text() + "      atomic: false\n")
hdr("workflow", "run", "wf_atomic_demo"); print("   lines:", lines("outputs/atomic_demo.csv"))
y.write_text(y.read_text().replace("      atomic: false\n", "")); shutil.copy(d/"Data/big_ok.csv", d/"Data/big.csv")
hdr("workflow", "run", "wf_atomic_demo"); print("   lines:", lines("outputs/atomic_demo.csv"))
print("== 43 rollback"); (d/"Data/finalize.csv").rename(d/"Data/finalize.csv.off"); before = (d/"outputs/report.csv").read_text()
hdr("workflow", "run", "wf_report"); print("   report restored:", (d/"outputs/report.csv").read_text() == before, "| share:", [p.name for p in (d/"outputs/share").glob("*")])
print("== 44 undo"); hdr("workflow", "validate", "wf_bad_rollback")
w = d/"workflows/wf_bad_rollback.yaml"; w.write_text(w.read_text().replace("        script: print('done')\n", "        script: print('done')\n      undo: none\n")); hdr("workflow", "validate", "wf_bad_rollback"); hdr("workflow", "undo", "wf_report")
print("== 45 conflict"); p = subprocess.Popen(["hdrctl", "workflow", "run", "wf_conflict"], cwd=d, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(8)
with open(d/"outputs/report.csv", "a", encoding="utf-8") as f: f.write("MANUAL,1\n")
p.wait(timeout=90); print("   journal:", (d/".hydra/undo/wf_conflict.json").exists()); hdr("workflow", "run", "wf_conflict"); hdr("workflow", "undo", "wf_conflict")
(d/".hydra/undo/wf_conflict.json").unlink(); hdr("workflow", "validate", "wf_conflict")
