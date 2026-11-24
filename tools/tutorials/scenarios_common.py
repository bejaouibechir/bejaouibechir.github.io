"""Shared by prepare_scenarios_block.py and evidence_scenarios.py: builds the resilient-pipeline project."""
import pathlib, shutil
FLAKY_OK = """version: "1.0"
workflow:
  name: wf_flaky
  trigger:
    type: manual
  steps:
    - name: call_service
      type: action
      action: python
      retry:
        max: 3
        delay: 1
      params:
        script: |
          import pathlib
          p = pathlib.Path('outputs/attempts.txt')
          n = int(p.read_text()) + 1 if p.exists() else 1
          p.write_text(str(n))
          if n < 3:
              raise SystemExit('service unavailable (attempt %d)' % n)
          print('service answered on attempt', n)
          p.unlink()
"""
FLAKY_DOWN = FLAKY_OK.split("        script: |")[0] + "        script: raise SystemExit('service unavailable')\n"
THREAD = """version: "1.0"
thread:
  - mode: sequential
    workflows:
      - name: wf_load
        active: true
        fallback:
          use: [wf_load_backup]
          when: "not file_exists('Data/orders.csv') or file_size('Data/orders.csv') < 100"
      - name: wf_report
        active: true
        fallback:
          use: [wf_report_quarantine]
          when: "previous.rows < 10"
          on_failure: true
  - mode: sequential
    workflows:
      - name: wf_flaky
        active: true
        timeout: 20s
      - name: wf_archive
        active: true
        fallback:
          use: [wf_archive_alt]
          when: "file_age('Data/stamp.txt') > 30s"
loops: []
"""
def build(dst, stage):
    if dst.exists(): shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(pathlib.Path(r"C:\data\fallbackproject"), dst, ignore=shutil.ignore_patterns(".hydra", "__pycache__", ".git"))
    (dst / "workflows" / "thread.yaml").write_text(THREAD, encoding="utf-8")
    (dst / "workflows" / "wf_flaky.yaml").write_text(FLAKY_DOWN if stage == "b" else FLAKY_OK, encoding="utf-8")
    for f in ("outputs/attempts.txt", "Data/stamp.txt"):
        if (dst / f).exists(): (dst / f).unlink()
    if stage == "a": (dst / "Data" / "orders.csv").rename(dst / "Data" / "orders.csv.off")
    if stage == "c": (dst / "Data" / "finalize.csv").rename(dst / "Data" / "finalize.csv.off")
