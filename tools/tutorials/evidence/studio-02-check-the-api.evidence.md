# Evidence: Check the Hydra Studio API connection (lesson 3, slug 02-check-the-api)
Verified 2026-11-22 on Linux, Python 3.13.18, hydra-etl[server] 0.22.0 (hdrctl serve --workspace /tmp/ws).

| ID | Statement | Type | Evidence | Status |
|---|---|---|---|---|
| E1 | `hdrctl serve` banner: ready address 127.0.0.1:5678, API /api, Docs /docs | FACT | command output | VERIFIED |
| E2 | `/api/health` returns 200 and `{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0","studio":"bundled","studio_build":"index-CxM6JVFV.js"}` | FACT | curl -i | VERIFIED |
| E3 | Backend stopped: `curl: (7) Failed to connect to 127.0.0.1 port 5678 after 0 ms: Couldn't connect to server` | FACT | curl output | VERIFIED |
| E4 | Without the server extra: `uvicorn is not installed. Run: pip install "hydra-etl[server]"` | FACT | command output | VERIFIED |
| E5 | `--no-studio` reports `"studio":"disabled"`; `--port` changes the port | FACT | curl on 5679 | VERIFIED |
| E6 | Health check every 5 s, retry 0; labels "API online/offline/…"; "New Studio version — reload" button | FACT | studio/src/components/layout/Topbar.tsx | VERIFIED (source) |
| E7 | Windows commands (`py -m pip ...`, `curl.exe`, `Invoke-RestMethod`) | EXPERIENCE | not run on Windows | MANUAL, to confirm |
| E8 | Screenshots api-online/offline top bar and overview page (4 files, light and dark) | EXPERIENCE | capture_studio.py with Edge on Windows, 22 Nov 2026, Studio bundle index-DCU4tAca.js | VERIFIED |
| E10 | Windows: `curl.exe -i` returns the same JSON; `Invoke-RestMethod | Format-List` prints message, status, version, dsl_version, studio, studio_build; `Invoke-WebRequest` prints StatusCode 200 and Content | EXPERIENCE | tools/tutorials/claude-run.log, Windows, Python 3.13.7 | VERIFIED |
| E9 | Publication date 2026-11-22 = this revision, not the original release | FACT | author decision | OK |
