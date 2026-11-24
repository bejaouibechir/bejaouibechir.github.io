# Evidence: Install Hydra ETL and start Studio (lesson 1, slug install-and-start)
Verified 2026-11-23 on Windows by `run/run-install-probe.bat` (log `install-probe.log`): new venv `C:\Users\DELL\hydra-venv-probe`, Python 3.13.7, PyPI.

| Item | Type | Proof |
|---|---|---|
| `py --version` -> Python 3.13.7 | EXPERIENCE | install-probe.log |
| `py -m venv`, `python.exe -m pip install "hydra-etl[server]"` succeeds, installs hydra_etl-0.22.0 | EXPERIENCE | install-probe.log (no ERROR) |
| `pip show`: Summary "Declarative ETL engine with a CLI, a REST API and a visual studio.", AGPL-3.0-or-later | FACT | install-probe.log |
| `hdrctl --version` -> `hydra 0.22.0  |  Hydra ETL Framework  |  Python 3.13.7` | EXPERIENCE | log |
| `hdrctl serve` options: --lang, --host, --port (5678), --reload, --open, --no-studio, --workspace | FACT | `serve --help` in log |
| Banner "Hydra Studio is ready", API/Docs addresses, "Press CTRL+C to stop." | EXPERIENCE | serve-probe.log (run on 5680; lesson shows default 5678) |
| `/api/health` JSON (status ok, version 0.22.0, dsl_version 1.0, studio bundled) | EXPERIENCE | log |
| Python >= 3.9 | FACT | `Hydra/pyproject.toml` requires-python |
| New workspace has sample project hydra-demo | EXPERIENCE | tour captures |
| Linux/macOS commands | UNVERIFIED | stated as not tested; see registry point 14 (WSL) |
| Common-errors table messages | not quoted verbatim | generic causes, not reproduced |
| pip warning about the hdrctl-not-on-PATH case | not reproduced | |

Leftovers on the author's machine: `C:\Users\DELL\hydra-venv-probe`, `hydra-workspace-probe`, `hydra-workspace-tour`.
Build: 179 pages. Generator: `blocks/gen_install_block.py`.
