"""Lesson 'Insights' (plan n. 18): slug read-the-insights-statistics."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
FI = "studio-insights"
BOOM = esc((R/"tools/tutorials/insights-demo/workflows/boom.yaml").read_text(encoding="utf-8").rstrip())
faq = [
 ("What does the Insights page show in Hydra Studio?", "Insights shows four counters, for total, successful, failed and running runs, and one card with the average duration in seconds. The numbers are computed in the browser from the list of runs."),
 ("How is the average duration computed?", "As the mean of the durations of all the runs that have one, failed runs included. In our test, runs of 3.1, 0.1 and 0.0 seconds gave 1.1 seconds."),
 ("Why are my Insights counters back to zero?", "The server keeps the list of runs in memory. After you restart hdrctl serve, the Runs page and Insights start empty again. We saw this after restarting Studio."),
 ("Does Insights count runs started from the terminal?", "No. It counts the runs that the Studio server knows about, such as runs started from the Run buttons or the API. A run started with hdrctl run in a terminal is not in the list."),
 ("Can I see statistics per workflow?", "Not in Hydra ETL 0.22. Insights shows project-wide totals only. The Runs page lists each run with its workflow, status, steps and duration, and its filter tabs narrow the list by status."),
]
s = common(18, "Insights", "Read the Insights statistics of Hydra Studio",
 "The Insights page of Hydra Studio gives four run counters and an average duration. See what they count, how they match the Runs page, and what they leave out.",
 '<span class="mono">Insights</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<b>Insights</b> shows four counters (total, successful, failed and running runs) and the average duration of the runs, in seconds. In our test, three runs gave 3 total, 2 successful, 1 failed, 0 running and an average of 1.1 seconds. The server keeps these runs in memory only.",
 "Start a few runs, read the Insights counters, match them with the Runs page, and learn what the page does not tell you.",
 "What do the Insights statistics measure?")
s = s.replace('<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>. The screenshots use that project plus a <code>cleanup</code> workflow that is not in the thread.</li>', '<li>A project with a few workflows, such as the one built in <a href="/studio/run-steps-in-sequence-or-in-parallel">Stages</a>, and a workflow that fails on purpose.</li>')
s += step(1, "Start a few runs", "Give Insights something to count.",
 ["Add a workflow that fails: save the file below as <code>workflows\\boom.yaml</code>.", "Run the project, then one workflow, then <code>boom</code>, from Studio."],
 "Run Workflow",
 "<p>In our test the three runs were started through the Studio API (<code>POST /api/runs</code>): the project, then <code>prepare</code>, then <code>boom</code>. The same runs start from the run buttons of Studio.</p><pre class=\"cmd\">" + BOOM + "</pre>",
 "Three entries on the Runs page, one of them Failed.",
 "project:insights-demo   Success   4/4   3.1s\nprepare                 Success   1/1   0.0s\nboom                    Failed    0/1   0.1s")
s += step(2, "Open Insights", "Read the counters.",
 ["Click <b>Insights</b> in the sidebar."],
 "Insights",
 "<p>Four cards give <b>Total runs</b>, <b>Successful</b>, <b>Failed</b> and <b>Running</b>. A card below gives the <b>Average duration</b> in seconds. The page needs no setting and has no filter.</p>",
 "3 total, 2 successful, 1 failed, 0 running, and an average of 1.1 s.",
 "3 Total runs   2 ✓ Successful   1 ✗ Failed   0 ⟳ Running\nAverage duration: 1.1 s",
 fig(FI, "insights-run-counters-and-average-light", "The Insights page of Hydra Studio in the light theme: four counters for total, successful, failed and running runs, and a card with the average duration in seconds.", "The Insights page after three runs."))
s += step(3, "Match them with the Runs page", "See where the numbers come from.",
 ["Click <b>Runs</b> in the sidebar.", "Compare the list with the counters, and the summary at the top right."],
 "Runs",
 "<p>The Runs page lists the same three runs and says <i>3 total · 0 running · 2 success · 1 failed</i>. The average is the mean of the three durations (3.1, 0.1 and 0.0 seconds), which is 1.1 seconds. Failed runs count in the average.</p>",
 "Three rows, and the same totals as Insights.",
 "3 total · 0 running · 2 success · 1 failed",
 fig(FI, "insights-runs-list-same-numbers-dark", "The Runs page of Hydra Studio in the dark theme, listing the executions whose statuses and durations feed the Insights counters.", "The Runs page behind the numbers."))
s += step(4, "Know the limits", "Avoid reading too much into it.",
 ["Restart <code>hdrctl serve</code> and open <b>Insights</b> again.", "Run a workflow from the terminal and compare."],
 "hdrctl serve",
 "<p>After a restart the counters were back to zero, because the server holds its runs in memory. Runs started with <code>hdrctl run</code> in a terminal do not appear, and the page has no history, chart or per-workflow view.</p>",
 "Zero everywhere after a restart.",
 "0 Total runs   0 ✓ Successful   0 ✗ Failed   0 ⟳ Running\nAverage duration: — s")
s += rules([("TIP", "Use the Runs page to find which run failed, and Insights only for a quick health count."),
 ("TIP", "Open a failed run from the Runs page to read its logs: see <a href=\"/studio/11-review-a-run\">Review a run</a>."),
 ("TRAP", "A zero on Insights after a restart does not mean nothing ran: the list of runs lives in memory."),
 ("TRAP", "The average includes failed runs, which are often very short. A failing workflow lowers it.")])
s += tail([["Counters", "Total, successful, failed and running runs"], ["Average", "Mean duration of the runs, in seconds"], ["Match", "The Runs page shows the same totals"], ["Limit", "Counters reset when the server restarts"]],
 [["Everything shows 0", "No run since the server started, or a restart", "Run a workflow from Studio"], ["A terminal run is missing", "It was not started through the server", "Start it from Studio or the API"], ["Average is —", "No run has a duration yet", "Wait for a run to finish"], ["Total is more than the other three", "A run is pending", "Wait or open the Runs page, Pending tab"]],
 faq, '<li><a href="/studio/11-review-a-run">Review a run</a></li><li><a href="/studio/tour-the-pages">Tour the Studio pages</a></li><li><a href="/studio/wait-with-the-delay-node">Wait with the Delay node</a></li>',
 "You can read the Insights page and know its limits. Next, diagnose a failed run.",
 '<a class="primary" href="/studio/11-review-a-run">Review a run <span aria-hidden="true">→</span></a>') + CTA
publish(18, "read-the-insights-statistics", "Insights", s,
 "Read the Insights statistics of Hydra Studio", "Read the Insights statistics of Hydra Studio", "Hydra Studio Insights: Run Counters Explained | Hydra ETL",
 "What the Hydra Studio Insights page counts: total, successful, failed and running runs and the average duration, and why it resets. Tested with Hydra ETL 0.22.",
 ["Start a few runs", "Open Insights", "Match them with the Runs page", "Know the limits"], faq,
 "Read the Insights statistics", "What the Insights page measures across your runs, and what it does not.")
