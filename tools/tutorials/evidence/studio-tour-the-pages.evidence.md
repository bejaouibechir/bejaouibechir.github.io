# Evidence: Tour the Hydra Studio pages (lesson 4, slug tour-the-pages)
Verified 2026-11-23, Hydra ETL 0.22.0, Windows, clean Studio on :5679 (workspace `C:\Users\DELL\hydra-workspace-tour`, sample project `hydra-demo`).

| Item | Type | Proof |
|---|---|---|
| Sidebar: Overview, Runs, Templates, Insights; Settings, Help | FACT | `components/layout/Sidebar.tsx`; captures |
| + (to Overview), Search (no handler), collapse; collapsed state in localStorage `hydra-sidebar-collapsed` | FACT | Sidebar.tsx |
| Overview: project list, Get started (Clone disabled "coming soon", Open, Create), Links, Statistics (Projects, Active runs, Success rate) | EXPERIENCE | capture + Overview.tsx |
| Runs: tabs All/Running/Success/Failed/Pending; empty state "No runs" | EXPERIENCE | capture |
| Templates: 3 cards CSV→CSV, API→Database, Parallel ETL; View YAML / Copy YAML | EXPERIENCE | capture |
| Insights: 4 counters + average duration, reads `api.runs.list()` | FACT | Insights.tsx, capture |
| Settings: Global/Project tabs; data viewer 10 rows; environments Common/dev/prod; job sync 5 s | EXPERIENCE | capture |
| Help is a placeholder | FACT | Help.tsx, capture |
| Top bar icons (search, bell, avatar) | NOT DOCUMENTED | not claimed |

Plan label said "Jobs" is a page: false in 0.22 (no Jobs entry); the lesson says so.
Captures: `lessons/tour-the-pages/captures.json`, `run/run-block-tour.bat`. Generator: `blocks/gen_tour_block.py`. Build: 177 pages.
