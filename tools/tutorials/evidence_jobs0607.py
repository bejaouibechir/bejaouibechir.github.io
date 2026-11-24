"""Windows evidence for lessons 06-07 (transformations chain, one destination)."""
import sys; sys.stdout.reconfigure(encoding="utf-8")
import pathlib, shutil, subprocess
d = pathlib.Path.home() / "hydra-workspace" / "jobs-evidence"
shutil.rmtree(d, ignore_errors=True)
def run(*a):
    r = subprocess.run(["hdrctl", *a], cwd=d, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print("$ hdrctl", *a, "-> exit", r.returncode)
    for l in (r.stdout + r.stderr).strip().splitlines()[-14:]: print("  ", l.strip()[:240])
subprocess.run(["hdrctl", "init", str(d)] if False else ["hdrctl", "job", "add", "first-job"], cwd=d.parent, capture_output=True) if False else None
d.mkdir(parents=True)
subprocess.run(["hdrctl", "project", "init", "."], cwd=d, capture_output=True) if False else None
j = d / "jobs" / "first-job"; (j / "data").mkdir(parents=True)
sys.path.insert(0, str(pathlib.Path(__file__).parent))
subprocess.run([sys.executable, str(pathlib.Path(__file__).parent / "datagen.py"), "orders", str(j / "data" / "orders.csv"), "--rows", "20"], check=True)
(j / "sources.yaml").write_text("sources:\n  src_orders:\n    type: csv\n    extract:\n      table: data/orders.csv\n      batch_size: 50000\n")
(j / "transformations.yaml").write_text("steps:\n  - select:\n      columns: [order_id, customer, country, amount, status]\n  - filter:\n      expr: \"status == 'paid'\"\n")
D1 = "destinations:\n  dest_paid:\n    type: csv\n    load:\n      table: ../../outputs/paid_orders.csv\n      mode: replace\n"
(j / "destinations.yaml").write_text(D1)
(j / "pipeline.yaml").write_text("pipeline:\n  from: src_orders\n  to: dest_paid\n")
print("== A. nominal job"); run("validate", "jobs/first-job"); run("run", "jobs/first-job")
out = d / "outputs" / "paid_orders.csv"; print("rows written:", len(out.read_text().splitlines()) - 1 if out.exists() else "none")
print("== B. a second destination declared, pipeline keeps one `to`")
(j / "destinations.yaml").write_text(D1 + "  dest_copy:\n    type: csv\n    load:\n      table: ../../outputs/copy.csv\n      mode: replace\n")
run("validate", "jobs/first-job"); run("run", "jobs/first-job", "--dry-run")
print("== C. pipeline lists two destinations")
(j / "pipeline.yaml").write_text("pipeline:\n  from: src_orders\n  to: [dest_paid, dest_copy]\n")
run("validate", "jobs/first-job"); run("run", "jobs/first-job", "--dry-run")
print("== D. filter before select on a dropped column")
(j / "destinations.yaml").write_text(D1); (j / "pipeline.yaml").write_text("pipeline:\n  from: src_orders\n  to: dest_paid\n")
(j / "transformations.yaml").write_text("steps:\n  - select:\n      columns: [order_id, customer, country, amount]\n  - filter:\n      expr: \"status == 'paid'\"\n")
run("validate", "jobs/first-job"); run("run", "jobs/first-job")
