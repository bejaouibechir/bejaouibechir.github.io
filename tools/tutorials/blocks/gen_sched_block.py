"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("What does a cron trigger do in Hydra ETL?", "A trigger of type cron starts the project at the times a five-field cron expression gives. Under hdrctl watch, it ran every minute at second 00 in our test on Hydra ETL 0.22 on Windows."),
 ("Which fields does the cron expression have?", "Five fields: minute, hour, day of month, month, day of week. The source accepts lists, ranges, steps such as */15, and names such as mon-fri or jan-mar. When day of month and day of week are both restricted, either one is enough, as in classic cron."),
 ("How do I set the time zone of a cron trigger?", "Add timezone with an IANA name such as Europe/Paris or UTC. Without it, the time zone of the machine is used, according to the source. On Windows an unknown name asks you to run pip install tzdata."),
 ("Does the cron trigger run without hdrctl serve?", "Yes. hdrctl watch runs cron triggers and does not need the server extra. We tested hdrctl watch only. We did not test the scheduler of hdrctl serve."),
 ("What happens if the cron expression is wrong?", "hdrctl trigger validate stops with the reason: a value out of range, a wrong number of fields, an unknown time zone, or a key that does not belong to the type."),
]
s = common(58, "Schedule trigger", "Run a Hydra project on a schedule with a cron trigger",
 "A cron trigger starts a Hydra project at fixed times. Declare it in triggers.yaml, validate the expression, start hdrctl watch and read the runs.",
 '<span class="mono">hdrctl watch</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "A trigger of type <code>cron</code> starts the project at the times of a five-field expression, in the time zone you choose. <code>hdrctl watch</code> waits for those times and runs the project.",
 "Declare two cron triggers, validate them, read the next run of each, start hdrctl watch, and read the runs it starts.",
 "How do I run a Hydra project on a schedule?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and a project created with <code>hdrctl init sched-demo</code>. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A second terminal: <code>hdrctl watch</code> stays open while it waits.</li>')
s += step(1, "Declare two cron triggers", "Edit triggers.yaml.",
 ["Open <code>triggers.yaml</code> at the root of the project.", "Write the content below.", "Run <code>hdrctl trigger validate</code>."],
 "triggers.yaml",
 "<p>The five fields are minute, hour, day of month, month and day of week. <code>* * * * *</code> means every minute. <code>0 2 * * mon-fri</code> means 02:00 from Monday to Friday. <code>timezone</code> takes an IANA name.</p><pre class=\"cmd\">version: \"1.0\"\ntriggers:\n  - name: every-minute\n    type: cron\n    cron: \"* * * * *\"\n    timezone: UTC\n  - name: nightly-paris\n    type: cron\n    cron: \"0 2 * * mon-fri\"\n    timezone: Europe/Paris</pre>",
 "<code>Triggers valid — 2 trigger(s)</code>.",
 "Triggers valid — 2 trigger(s)")
s += step(2, "List the triggers", "Check what was read.",
 ["Run the command below."],
 "hdrctl trigger list",
 "<p>Each trigger shows its expression and its time zone, and the file it runs. The list does not show the next run: <code>hdrctl watch</code> prints it in the next step.</p>",
 "Two lines, each marked <code>on</code>.",
 "on  every-minute       cron * * * * * (UTC)\n    runs thread.yaml · env: from watch/serve\non  nightly-paris      cron 0 2 * * mon-fri (Europe/Paris)\n    runs thread.yaml · env: from watch/serve")
s += step(3, "Start hdrctl watch", "Keep it open.",
 ["Open a second terminal in the project folder.", "Run the command below and leave it open."],
 "hdrctl watch",
 "<p>The command prints the next run of each trigger. Times are those of your machine: ours was set to Paris time.</p>",
 "Two triggers with <code>next:</code>, then <code>Waiting for events</code>.",
 "Project sched-demo\n  ● every-minute       cron * * * * * (UTC)  next: 2026-11-24 07:38\n  ● nightly-paris      cron 0 2 * * mon-fri (Europe/Paris)  next: 2026-11-25 02:00\n\nWaiting for events. Ctrl+C to stop.")
s += step(4, "Wait for the first runs", "Read each start and end.",
 ["Wait for the next full minute.", "Read the two lines of each run."],
 "hdrctl watch",
 "<p>The run starts at second 00 of the minute. The <code>▶</code> line gives the start, the <code>✓</code> line gives the end and the duration. In our test the project ran twice in two minutes, in 2.4 s and 2.6 s.</p>",
 "A <code>▶</code> line and a <code>✓</code> line at the start of each minute.",
 "2026-11-24 07:38:00 ▶ sched-demo/every-minute  cron * * * * * (UTC)  env: none\n2026-11-24 07:38:02 ✓ sched-demo/every-minute  2.4s\n2026-11-24 07:39:00 ▶ sched-demo/every-minute  cron * * * * * (UTC)  env: none\n2026-11-24 07:39:03 ✓ sched-demo/every-minute  2.6s")
s += step(5, "Read the history", "See the runs in one place.",
 ["Stop <code>watch</code> with Ctrl+C.", "Run the command below."],
 "hdrctl trigger history",
 "<p>The history lists each run with its trigger, its origin and its duration. Dates are in UTC here, so they are one hour earlier than the lines of <code>watch</code> on our machine. The Paris trigger did not run: its time had not come.</p>",
 "Two lines with ✓, both for <code>every-minute</code>.",
 "✓ 2026-11-24T06:38:02+00:00  every-minute     watch  2.42s\n✓ 2026-11-24T06:39:03+00:00  every-minute     watch  2.63s")
s += step(6, "Read a wrong expression", "Break one on purpose.",
 ["Change the <code>cron</code> line to <code>\"61 * * * *\"</code>.", "Run <code>hdrctl trigger validate</code>."],
 "hdrctl trigger validate",
 "<p>Validation names the field and the limit. Put the expression back before you start <code>watch</code>.</p>",
 "An <code>Invalid triggers file</code> line, then the reason.",
 "Invalid triggers file: ...\\triggers.yaml\n  err   — trigger 't': cron '61 * * * *': minute: 61 is out of range (0-59)")
s += rules([("TIP", "Validate before you wait: <code>hdrctl trigger validate</code> checks the expression and the time zone in a second."),
 ("TIP", "Write <code>timezone</code> on every cron trigger, so that the schedule does not move with the machine."),
 ("TRAP", "<code>timezone</code> only belongs to cron triggers: on an interval trigger, validate answers <code>timezone does not apply to type interval</code>."),
 ("TRAP", "Cron triggers run only while <code>hdrctl watch</code> is open. If it is closed at 02:00, nothing starts.")])
s += tail([["Type", "cron"], ["Expression", "minute hour day month weekday"], ["Time zone", "timezone: Europe/Paris, or UTC"], ["Run", "hdrctl watch"], ["Check", "hdrctl trigger validate, hdrctl trigger history"]],
 [["minute: 61 is out of range", "A value is outside its field range", "Use 0-59 for the minute"], ["5 fields expected", "The expression has fewer or more than five fields", "Write minute hour day month weekday"], ["unknown timezone", "The name is not an IANA zone, or tzdata is missing on Windows", "Check the name, or run pip install tzdata"], ["every does not apply to type cron", "A key of another trigger type was added", "Remove the key"]],
 faq, REL + '<li><a href="/studio/declare-project-triggers">Declare project triggers</a></li><li><a href="/studio/run-triggers-with-hdrctl-watch">Other triggers</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li>',
 "One expression, one time zone, one command that waits. Not covered here: the scheduler of hdrctl serve.",
 '<a class="primary" href="/studio/run-triggers-with-hdrctl-watch">Next: Other triggers <span aria-hidden="true">→</span></a>') + CTA
publish(58, "run-a-project-on-a-cron-schedule", "Schedule trigger", s,
 "Run a Hydra project on a schedule with a cron trigger", "Run a Hydra project on a schedule with a cron trigger", "Hydra Cron Trigger: Schedule a Project | Hydra ETL",
 "Declare a cron trigger with a time zone, validate it, run hdrctl watch and read the runs it starts. Tested with Hydra ETL 0.22 on Windows.",
 ["Declare two cron triggers", "List the triggers", "Start hdrctl watch", "Wait for the first runs", "Read the history", "Read a wrong expression"], faq,
 "Schedule trigger", "Declare a cron trigger with a time zone, run hdrctl watch and read the runs it starts.")
