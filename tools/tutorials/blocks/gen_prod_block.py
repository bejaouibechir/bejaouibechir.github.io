"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("How do I run Hydra ETL workflows on a schedule without opening Studio?", "Put a trigger of type schedule with a cron expression in the workflow file, start hdrctl serve with --no-studio, and register the project once. In our test on Hydra ETL 0.22, a workflow with the cron * * * * * ran at the start of three consecutive minutes and each run ended in success."),
 ("What does --no-studio change?", "The server starts the API only. The home page answers with a short notice that Studio is disabled, and /api/health reports studio as disabled. The scheduler and the API worked the same in our test."),
 ("Where do I see the scheduled runs?", "At GET /api/runs. Each run has a run_id, the workflow name, a status, the start time in UTC and the field trigger, set to schedule for a scheduled run. Per the source, you can add ?workflow_name=NAME to filter; we did not test the filter."),
 ("Do the runs survive a restart of the server?", "No, according to our earlier tests: the runs are kept in memory, so the list is empty after a restart. The output files written by the jobs stay on disk."),
 ("Is the server safe to expose to the internet?", "We did not test any protection. The server listens on 127.0.0.1 by default. Put a proxy that you control in front of it before you change --host."),
 ("Does the schedule restart on its own after a reboot?", "We did not test it. Plan a service or a task that starts hdrctl serve at boot, and check the runs after the first expected time."),
]
s = common(65, "Production", "Run Hydra ETL in production with hdrctl serve",
 "Run hdrctl serve without Studio, schedule a workflow with a cron trigger and read the scheduled runs from the API.",
 '<span class="mono">hdrctl serve</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl serve --no-studio</code> starts the API and the scheduler without the visual editor. A workflow with a trigger of type <code>schedule</code> then runs by itself, and <code>GET /api/runs</code> lists what ran.",
 "Declare a cron trigger in a workflow, validate it, start the server without Studio, register the project, check the server and read the scheduled runs.",
 "How do I run Hydra ETL workflows on a schedule?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed with the server extra. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init nightly-demo</code>. It holds a job and a workflow named <code>workflow1</code>.</li><li><code>curl.exe</code> (Windows) or <code>curl</code>, to call the API.</li>')
s += step(1, "Put a cron in the workflow", "Change the trigger of workflow1.",
 ["Open <code>workflows/workflow1.yaml</code> in the project.", "Replace <code>type: manual</code> with the two lines below.", "Run the validation from the project folder."],
 "hdrctl workflow validate workflows\\workflow1.yaml",
 "<p>The cron has five fields. <code>* * * * *</code> means every minute, which suits a test; use <code>0 2 * * *</code> for 02:00 every day. See <a href=\"/studio/run-a-project-on-a-cron-schedule\">Run a project on a cron schedule</a> for the fields. The trigger part of the file:</p><pre class=\"cmd\">  trigger:\n    type: schedule\n    cron: \"* * * * *\"</pre>",
 "<code>Workflow valid</code>.",
 "✅ Workflow valid — no errors detected.")
s += step(2, "Start the server without Studio", "Keep the terminal open.",
 ["Go to the folder that holds the project.", "Run the command below. The server stays in the foreground."],
 "hdrctl serve --no-studio --port 5689 --workspace .\\ws",
 "<p><code>--no-studio</code> serves the API only. <code>--workspace</code> is the folder where the server keeps the projects it knows (<code>~/hydra-workspace</code> by default). The port is 5678 by default; we used 5689 in our test. The server listens on <code>127.0.0.1</code> unless you pass <code>--host</code>. Stop it with CTRL+C.</p>",
 "A banner that says Studio is disabled, then the addresses.",
 "  Studio disabled — started with --no-studio\n\n  API       http://127.0.0.1:5689/api\n  Docs      http://127.0.0.1:5689/docs\n  Workdir   C:\\...\\prod-probe\n\n  Press CTRL+C to stop.\n\nINFO:     Application startup complete.\nINFO:     Uvicorn running on http://127.0.0.1:5689 (Press CTRL+C to quit)")
s += step(3, "Register the project", "The scheduler reads the projects the server knows.",
 ["Save <code>open.json</code> as shown below, with the full path of your project (backslashes doubled).", "In a second terminal, run the command below."],
 "curl.exe -s -X POST -H \"Content-Type: application/json\" -d @open.json http://127.0.0.1:5689/api/projects/open",
 "<p>The call registers the folder and answers with the project id. In our test, the first run started at the next full minute after this call.</p><pre class=\"cmd\">{\"path\": \"C:\\\\path\\\\to\\\\nightly-demo\", \"adopt\": true}</pre>",
 "A JSON answer with the id, the name and the path.",
 "{\"id\":\"0db43970\",\"name\":\"nightly-demo\",\"description\":\"\",\"path\":\"C:\\\\...\\\\nightly-demo\",\"created_at\":\"2026-11-24T07:31:21.317913+00:00\"}")
s += step(4, "Check the server", "One call tells you it is alive.",
 ["Run the command below."],
 "curl.exe -s http://127.0.0.1:5689/api/health",
 "<p>Use this call for any monitor that needs to know whether the server answers. The field <code>studio</code> says <code>disabled</code> because of <code>--no-studio</code>.</p>",
 "<code>status</code> is <code>ok</code> and the version is 0.22.0.",
 "{\"message\":\"Hydra ETL API is running\",\"status\":\"ok\",\"version\":\"0.22.0\",\"dsl_version\":\"1.0\",\"studio\":\"disabled\",\"studio_build\":\"index-DCU4tAca.js\"}")
s += step(5, "Read the scheduled runs", "Wait for the next minutes, then list the runs.",
 ["Wait two or three minutes.", "Run the command below."],
 "curl.exe -s http://127.0.0.1:5689/api/runs",
 "<p>The answer is a JSON list, newest first, with the logs of every step. Each scheduled run has <code>\"trigger\":\"schedule\"</code>. In our test, three runs started at 07:32:00, 07:33:00 and 07:34:00 UTC, one per minute, and each lasted under a second. This excerpt keeps four fields of the first run:</p>",
 "One run per elapsed minute, all in <code>success</code>.",
 "[{\"run_id\":\"32f6e600\",\"workflow_name\":\"workflow1\",\"status\":\"success\",\"started_at\":\"2026-11-24T07:34:00.010654+00:00\",\"trigger\":\"schedule\", ...},\n {\"run_id\":\"331eaeef\", ... \"started_at\":\"2026-11-24T07:33:00.010929+00:00\", ...},\n {\"run_id\":\"e1627f8c\", ... \"started_at\":\"2026-11-24T07:32:00.010698+00:00\", ...}]")
s += rules([("TIP", "Switch the cron from <code>* * * * *</code> to the real schedule only after you have seen one run in the list."),
 ("TIP", "Watch <code>/api/health</code> and the last run time from your monitor: a server that answers can still have an empty list of runs."),
 ("TRAP", "The runs are in memory. After a restart of the server the list is empty, so keep what you need from the job outputs and the logs of your own system."),
 ("TRAP", "Times in the run list are UTC. Our Windows clock was one hour ahead, so a run shown at 07:32 started at 08:32 local time."),
 ("TRAP", "The server stays in the foreground. Closing its terminal stops the schedule.")])
s += tail([["Server", "hdrctl serve --no-studio --port N --workspace DIR"], ["Register", "POST /api/projects/open with {path, adopt: true}"], ["Schedule", "trigger: type: schedule, cron: \"* * * * *\""], ["Health", "GET /api/health"], ["Runs", "GET /api/runs (trigger: schedule)"]],
 [["Empty list of runs", "The project was not registered, or the next minute has not come yet", "Call /api/projects/open, then wait for the next cron time"], ["Connection refused", "The server is stopped, or the port differs", "Check the terminal and the port in the URL"]],
 faq, REL + '<li><a href="/studio/run-a-project-on-a-cron-schedule">Run a project on a cron schedule</a></li><li><a href="/studio/start-a-project-with-a-webhook">Start a project with a webhook</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li>',
 "One server, one cron, one list of runs. Not covered here: authentication, a proxy, running as a service, and restarting after a reboot.",
 '<a class="primary" href="/studio/run-a-project-on-a-cron-schedule">Back to the cron schedule <span aria-hidden="true">→</span></a>') + CTA
publish(65, "run-hydra-in-production-with-hdrctl-serve", "Production", s,
 "Run Hydra ETL in production with hdrctl serve", "Run Hydra ETL in production with hdrctl serve", "Hydra ETL in Production: hdrctl serve and Cron | Hydra ETL",
 "Start hdrctl serve without Studio, schedule a workflow with a cron trigger and read the scheduled runs from the API. Tested with Hydra ETL 0.22.",
 ["Put a cron in the workflow", "Start the server without Studio", "Register the project", "Check the server", "Read the scheduled runs"], faq,
 "Production", "Serve the API without Studio, run a cron workflow and read the scheduled runs.")
