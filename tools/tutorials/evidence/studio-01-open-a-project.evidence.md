# Evidence: Create a project in Hydra Studio (lesson 2, slug 01-open-a-project)
Verified 2026-11-22 on Linux, Python 3.13.18, hydra-etl[server] 0.22.0 (hdrctl serve --workspace /tmp/ws2 --port 5680).

| ID | Statement | Type | Evidence | Status |
|---|---|---|---|---|
| E1 | POST /api/projects {"name":"studio-course"} creates the folder with `.gitignore`, `.hydra/`, `Data`, `environments`, `jobs`, `outputs`, `scripts`, `workflows` | FACT | find on the workspace | VERIFIED |
| E2 | A fresh workspace is seeded with a `hydra-demo` project (explains "Projects 2") | FACT | workspace listing, `.demo_seeded` | VERIFIED |
| E3 | POST /api/workflows (trigger manual) writes `workflows/first-workflow.yaml` with `trigger: type: manual`, `steps: []`, and creates `workflows/thread.yaml` | FACT | file contents | VERIFIED |
| E4 | Trigger list = Manual, Schedule (cron), Webhook; badges Draft / never run; buttons New workflow, Import workflow, Open in editor; palette message "No jobs defined — create one in the Jobs configuration tab." | FACT | studio/src (ProjectDetail.tsx, NodePalette.tsx, Overview.tsx) | VERIFIED (source) |
| E5 | Workflow palette: Actions (9) = 10 actions minus Job; Control Flow 2; Containers 3 | FACT | NodePalette.tsx filter, nodeRegistry.ts | VERIFIED (source) |
| E6 | Default workspace `~/hydra-workspace`, `--workspace` option | FACT | `hdrctl serve --help` | VERIFIED |
| E7 | Screenshots screen1 to screen8 | EXPERIENCE | taken with an older Studio | TO REDO |
| E8 | "Clone a repository" is dimmed and labelled "coming soon" on the Overview | FACT | screenshot api-online-overview-page-dark.png, 22 Nov 2026 | VERIFIED |
