"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("What runs the triggers of a Hydra project?", "hdrctl watch runs the triggers of one or more projects until you stop it with Ctrl+C. According to its help, hdrctl serve runs them too. We tested hdrctl watch only."),
 ("What is the difference between a marker and a file trigger?", "A marker trigger watches one file and, by default, removes it after the run: go.flag was gone when the run ended in our test. A file trigger watches a pattern such as Data/incoming/*.csv and starts a run for each new file."),
 ("Why did my file trigger never fire?", "The path is a pattern for files. In our first test we wrote path: Data/incoming, which names a folder, and nothing happened. With Data/incoming/*.csv the run started a few seconds after the file appeared."),
 ("Do the files that already exist start a run?", "According to the source, files present when watch starts are the starting state and start nothing. We did not test this."),
 ("How does a source_change trigger work?", "It reads the source of a job at an interval and compares a value: count, max of a column or checksum. watch printed a reference value at the start, then the old and new value when we added a row to the CSV. The check ran every 60 seconds in our test."),
]
s = common(57, "Other triggers", "Start a Hydra project with interval, marker, file and source triggers",
 "hdrctl watch runs your triggers.yaml. Declare an interval, a marker, a file and a source trigger, start watch, make each one fire, and read what it prints.",
 '<span class="mono">hdrctl watch</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl watch</code> keeps running and starts the project when a trigger fires: <code>interval</code> every so often, <code>marker</code> when a flag file appears, <code>file</code> when a file matching a pattern arrives and <code>source_change</code> when the data of a source changes.",
 "Declare four triggers, start hdrctl watch, drop a flag file and a CSV, change the source, and read the log of each run.",
 "How do interval, file and marker triggers work?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and the project of <a href="/studio/declare-project-triggers">Declare project triggers</a> (create a new one with <code>hdrctl init watch-demo</code>). See <a href="/studio/install-and-start">Install and start</a>.</li><li>A second terminal: <code>hdrctl watch</code> stays open while you test.</li>')
s += step(1, "Declare four triggers", "One per kind of start.",
 ["Create the folder <code>Data/incoming</code> in the project.", "Write <code>triggers.yaml</code> at the project root with the content below.", "Run <code>hdrctl trigger validate</code>."],
 "triggers.yaml",
 "<p>The <code>path</code> of a <code>file</code> trigger is a pattern for files: <code>*.csv</code> matches the CSV files of the folder. A <code>source_change</code> trigger names a job, a source id and what to compare: <code>count</code>, <code>max</code> of a column, or <code>checksum</code>.</p><pre class=\"cmd\">version: \"1.0\"\ntriggers:\n  - name: every-30s\n    type: interval\n    every: 30s\n    overlap: skip\n  - name: flag-file\n    type: marker\n    path: go.flag\n  - name: new-files\n    type: file\n    path: Data/incoming/*.csv\n    events: [added]\n    debounce: 2s\n  - name: data-changed\n    type: source_change\n    source:\n      job: jobs/job1\n      id: src_csv\n      check: checksum</pre>",
 "<code>Triggers valid — 4 trigger(s)</code>.",
 "Triggers valid — 4 trigger(s)")
s += step(2, "Start hdrctl watch", "Keep it open in a second terminal.",
 ["Open a second terminal in the project folder.", "Run the command below and leave it open."],
 "hdrctl watch",
 "<p>The command lists each trigger and how often it is checked. <code>interval</code> shows its next run. Markers and file triggers are checked every 5 seconds, and the source trigger every 60 seconds. It also reads the starting value of the source.</p>",
 "Four triggers with a green dot, then <code>Waiting for events</code>.",
 "Project watch-demo\n  ● every-30s          every 30s  next: 2026-11-24 07:26\n  ● flag-file          marker file go.flag (removed)  checked every 5s\n  ● new-files          added: Data/incoming/*.csv  checked every 5s\n  ● data-changed       source src_csv of jobs/job1 changes (checksum)  checked every 60s\n\nWaiting for events. Ctrl+C to stop.\n· watch-demo/data-changed  reference value: f3412128ace2406b")
s += step(3, "Fire the marker", "Create a flag file.",
 ["In the first terminal, run the command below."],
 "echo go> go.flag",
 "<p>Within five seconds the trigger starts the project. When the run ends, <code>go.flag</code> has been removed: the trigger consumed it.</p>",
 "A <code>▶</code> line, then a <code>✓</code> line with the duration.",
 "▶ watch-demo/flag-file  files: go.flag  env: none\n✓ watch-demo/flag-file  2.4s")
s += step(4, "Fire the file trigger", "Drop a CSV in the folder.",
 ["Copy any CSV, for example the input of the job, into <code>Data/incoming</code>."],
 "copy jobs\\job1\\data\\input.csv Data\\incoming\\batch1.csv",
 "<p>The trigger names the file that made it fire. According to the source, files already in the folder when <code>watch</code> starts do not fire it. We did not test this.</p>",
 "A <code>▶</code> line naming <code>Data/incoming/batch1.csv</code>.",
 "▶ watch-demo/new-files  files: Data/incoming/batch1.csv  env: none\n✓ watch-demo/new-files  2.8s")
s += step(5, "Change the source", "Add a row to the input CSV.",
 ["Run the command below."],
 "echo 4,Dana,50>> jobs\\job1\\data\\input.csv",
 "<p>Within a minute, <code>watch</code> compares the checksum of the source with its starting value, prints both and starts the project. In our test the interval trigger was running at the same moment: the source trigger was reported as skipped, with no reason on the line.</p>",
 "A <code>▶</code> line with the old and the new value.",
 "▶ watch-demo/data-changed  source src_csv: f3412128ace2406b → 7134ac50dd7e63e1  env: none\n⏭ watch-demo/data-changed")
s += step(6, "Read the interval and the history", "See every run in one place.",
 ["Wait for a run of <code>every-30s</code>.", "Stop <code>watch</code> with Ctrl+C.", "Run <code>hdrctl trigger history</code>."],
 "hdrctl trigger history",
 "<p>The interval trigger runs every 30 seconds, with <code>overlap: skip</code> so that a run is not started while the previous one is still going. The history lists the five runs of our test. We stopped the process from a script, so we did not read the message that Ctrl+C prints.</p>",
 "Five lines, four with ✓ and one with ⏭.",
 "✓ 2026-11-24T06:26:28+00:00  flag-file        watch  2.39s\n✓ 2026-11-24T06:26:43+00:00  every-30s        watch  2.45s\n✓ 2026-11-24T06:26:49+00:00  new-files        watch  2.76s\n⏭ 2026-11-24T06:27:12+00:00  data-changed     watch  0.0s\n✓ 2026-11-24T06:27:14+00:00  every-30s        watch  2.86s")
s += rules([("TIP", "Test with <code>hdrctl trigger fire NAME</code> first, then let <code>hdrctl watch</code> do the waiting."),
 ("TIP", "Use <code>overlap: skip</code> on an interval shorter than the run, so runs do not pile up."),
 ("TRAP", "A <code>file</code> trigger needs a file pattern: <code>Data/incoming</code> alone matched nothing in our test, and no error was printed. Write <code>Data/incoming/*.csv</code>."),
 ("TRAP", "Closing the terminal stops <code>hdrctl watch</code>, and triggers stop with it. Run it where it can stay open.")])
s += tail([["Run", "hdrctl watch"], ["Types tested", "interval, marker, file, source_change"], ["Pattern", "file path = glob, such as Data/incoming/*.csv"], ["History", "hdrctl trigger history"]],
 [["File trigger never fires", "The path names a folder, not files", "Add a pattern such as /*.csv"], ["Marker fires only once", "The flag is removed after the run", "Create the file again"], ["source_change skipped", "Another run of the project was in progress", "Wait and change the source again"], ["Nothing at all", "watch is not running, or runs in another folder", "Start it in the project folder"]],
 faq, REL + '<li><a href="/studio/declare-project-triggers">Declare project triggers</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li><li><a href="/studio/orchestrate-from-thread-yaml">Orchestrate from thread.yaml</a></li>',
 "Four triggers, one command that waits for them. Not covered here: after_project, cron, webhook.",
 '<a class="primary" href="/studio/declare-project-triggers">Back to Triggers <span aria-hidden="true">→</span></a>') + CTA
publish(57, "run-triggers-with-hdrctl-watch", "Other triggers", s,
 "Start a Hydra project with interval, marker, file and source triggers", "Interval, marker, file and source triggers with hdrctl watch", "Hydra hdrctl watch: File and Interval Triggers | Hydra ETL",
 "Run interval, marker, file and source_change triggers with hdrctl watch, make each one fire, and read the history. Tested with Hydra ETL 0.22.",
 ["Declare four triggers", "Start hdrctl watch", "Fire the marker", "Fire the file trigger", "Change the source", "Read the interval and the history"], faq,
 "Other triggers", "Run interval, marker, file and source triggers with hdrctl watch and read what each one prints.")
