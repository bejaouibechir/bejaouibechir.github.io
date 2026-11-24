"""Lesson 'Triggers' : slug declare-project-triggers."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])
faq = [
 ("What is a trigger in Hydra ETL?", "A trigger is an entry in triggers.yaml, at the project root, that says when to run the project: at a time, every so often, when a file shows up, and so on. Each trigger has a name and a type."),
 ("Which trigger types exist?", "The Hydra ETL 0.22 source lists seven: cron, interval, file, marker, source_change, webhook and after_project. We tested cron, interval, file and marker; the others have their own lessons."),
 ("Who runs the triggers?", "According to the help of hdrctl trigger, they run inside hdrctl watch and hdrctl serve. We did not leave either running in this lesson. hdrctl trigger fire NAME runs one trigger right away, and that is what we tested."),
 ("How do I check triggers.yaml before using it?", "Run hdrctl trigger validate. It reports unknown keys, keys that do not suit the trigger type, impossible cron expressions and workflows that do not exist. A valid file answers Triggers valid, with the number of triggers."),
 ("Where do I see what a trigger started?", "Run hdrctl trigger history. It reads .hydra/triggers/history.jsonl in the project and prints one line per run, with the trigger name, how it started (manual for fire) and the duration."),
]
s = common(56, "Triggers", "Declare project triggers in triggers.yaml",
 "A trigger says when a project starts. Write four triggers in triggers.yaml, list and check them with hdrctl trigger, start one by hand and read its history.",
 '<span class="mono">hdrctl trigger</span><span>about 15 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "Triggers are declared in <code>triggers.yaml</code> at the project root. <code>hdrctl trigger list</code> shows them, <code>validate</code> checks them, <code>fire NAME</code> starts one now and <code>history</code> lists what ran.",
 "Declare four triggers, list and validate them, fire one by hand, read the history and read the errors of a broken file.",
 "How do I declare a trigger?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed, and the project built in <a href="/studio/anatomy-of-a-job">Anatomy of a job</a>. See <a href="/studio/install-and-start">Install and start</a>.</li>')
s += step(1, "Write triggers.yaml", "Four triggers, one per kind of start.",
 ["Open the project folder.", "Create <code>triggers.yaml</code> at its root with the content below."],
 "triggers.yaml",
 "<p>Each trigger has a <code>name</code> and a <code>type</code>. A <code>cron</code> trigger holds a cron expression and optionally a time zone. An <code>interval</code> trigger holds an <code>every</code> delay. A <code>file</code> trigger watches a path inside the project and a <code>marker</code> trigger waits for a flag file. <code>workflows</code> lists what the trigger runs. Without it, the whole thread runs. <code>enabled: false</code> keeps a trigger in the file but switched off.</p><pre class=\"cmd\">version: \"1.0\"\ntriggers:\n  - name: nightly\n    type: cron\n    cron: \"0 2 * * *\"\n    timezone: UTC\n    workflows: [workflow1]\n  - name: every-15-min\n    type: interval\n    every: 15m\n    overlap: skip\n  - name: new-files\n    type: file\n    path: Data/incoming\n    events: [added]\n  - name: go-flag\n    type: marker\n    path: go.flag\n    enabled: false</pre>",
 "A file with four triggers.",
 "")
s += step(2, "List the triggers", "See what the project declares.",
 ["Run the command below in the project folder."],
 "hdrctl trigger list",
 "<p>Each line gives the state, <code>on</code> or <code>off</code>, the name and a plain-language summary of when the trigger fires. Before you create the file, the command answers <code>No trigger</code>.</p>",
 "Four lines, three <code>on</code> and one <code>off</code>.",
 "on  nightly            cron 0 2 * * * (UTC)\non  every-15-min       every 15m\non  new-files          added: Data/incoming\noff go-flag            marker file go.flag (removed)")
s += step(3, "Validate the file", "Catch mistakes before anything runs.",
 ["Run the command below."],
 "hdrctl trigger validate",
 "<p>The command reads the file and checks each trigger against its type.</p>",
 "<code>Triggers valid</code> with the number of triggers.",
 "Triggers valid — 4 trigger(s)")
s += step(4, "Fire one trigger by hand", "Start the project as the trigger would.",
 ["Run the command below."],
 "hdrctl trigger fire nightly",
 "<p><code>fire</code> runs the project now, with the workflows, environment and parameters of the trigger. In our test the run took 2.8 seconds. Naming a trigger that does not exist stops with <code>Trigger 'nope' not found in triggers.yaml</code> and lists the known names.</p>",
 "A line naming the trigger and its schedule, then <code>project run</code> with the duration.",
 "Trigger nightly — cron 0 2 * * * (UTC) — env: none\nTrigger 'nightly' — project run in 2.8s")
s += step(5, "Read the history", "See what the triggers started.",
 ["Run the command below."],
 "hdrctl trigger history",
 "<p>The history lives in <code>.hydra/triggers/history.jsonl</code>, inside the project. The line shows the date in UTC, the trigger, <code>manual</code> because we used <code>fire</code>, and the duration.</p>",
 "One line with a green mark.",
 "Trigger history  ...\\.hydra\\triggers\\history.jsonl\n✓ 2026-11-24T05:46:40+00:00  nightly          manual  2.76s")
s += step(6, "Break the file on purpose", "Read the four errors you will meet.",
 ["Change <code>cron</code> to <code>\"99 2 * * *\"</code> and validate.", "Rename <code>every</code> to <code>evry</code> and validate.", "Give the interval trigger a <code>cron</code> key and remove it from the cron trigger, then validate.", "Set <code>workflows: [missing-wf]</code> and validate."],
 "hdrctl trigger validate",
 "<p>The messages name the trigger and the key at fault. Several errors in one file are reported together.</p>",
 "A red <code>err</code> line for each problem.",
 "trigger 'nightly': cron '99 2 * * *': minute: 99 is out of range (0-59)\ntriggers[0].evry: Extra inputs are not permitted\ntrigger 'every-15-min': cron does not apply to type interval\ntrigger 'nightly': type cron requires 'cron'\ntrigger 'nightly': workflow(s) not found: missing-wf (workflows/<name>.yaml)")
s += rules([("TIP", "Keep <code>enabled: false</code> on a trigger you are still writing: it stays in the file without starting anything."),
 ("TIP", "Test a trigger with <code>hdrctl trigger fire</code> before you rely on its schedule."),
 ("TRAP", "A <code>file</code> or <code>marker</code> path must stay inside the project: relative, without <code>..</code>. The Hydra source rejects absolute paths."),
 ("TRAP", "<code>fire</code> really runs the project and writes its data. Use <code>hdrctl run . --dry-run</code> first if you only want to check the plan.")])
s += tail([["File", "triggers.yaml at the project root"], ["Types", "cron, interval, file, marker, and three more"], ["Check", "hdrctl trigger validate"], ["Test", "hdrctl trigger fire NAME"]],
 [["Extra inputs are not permitted", "A key is misspelled", "Fix the key named in the message"], ["does not apply to type", "A key belongs to another trigger type", "Remove it or change the type"], ["workflow(s) not found", "A workflow in the list has no file", "Create it or fix the name"], ["Trigger not found", "The name is not in triggers.yaml", "Read the list of known names"]],
 faq, REL + '<li><a href="/studio/orchestrate-from-thread-yaml">Orchestrate from thread.yaml</a></li><li><a href="/studio/launch-a-job-from-the-cli-and-the-api">Launch a job from the CLI and the API</a></li><li><a href="/studio/create-a-workflow">Create a workflow</a></li>',
 "A trigger is one entry in one file. Next, see the other ways to launch a project without Studio.",
 '<a class="primary" href="/studio/launch-a-job-from-the-cli-and-the-api">Launch from the CLI <span aria-hidden="true">→</span></a>') + CTA
publish(56, "declare-project-triggers", "Triggers", s,
 "Declare project triggers in triggers.yaml", "Declare project triggers in triggers.yaml", "Hydra Triggers: triggers.yaml and hdrctl trigger | Hydra ETL",
 "Declare cron, interval, file and marker triggers in triggers.yaml, then list, validate and fire them with hdrctl trigger. Tested with Hydra ETL 0.22.",
 ["Write triggers.yaml", "List the triggers", "Validate the file", "Fire one trigger by hand", "Read the history", "Break the file on purpose"], faq,
 "Triggers: what starts a workflow", "Declare triggers in triggers.yaml, check them, fire one by hand and read the history.")
