"""24/11/2026 : adds a 'In Studio' part (Triggers tab) to the Schedule trigger and Webhook trigger lessons."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

def patch(slug, num, fw, steps_fn, titles, faq_pair, quick_add, goal_add):
    mp = next((R/"src/_mock").glob("studio-lesson-%02d-%s.main.html" % (num, slug)))
    t = mp.read_text(encoding="utf-8")
    if titles[0] in t: print("already", slug); return
    n0 = len(re.findall(r'<h3><i>\d\d</i>', t))
    new = steps_fn(n0 + 1, fw)
    marker = "  <h2>What should I have at the end?</h2>"
    assert marker in t, slug
    t = t.replace(marker, new + marker, 1)
    t = re.sub(r"(<div class=\"callout\"><b>Quick answer</b><p>.*?)(</p></div>)", lambda m: m.group(1) + " " + quick_add + m.group(2), t, 1, flags=re.S)
    t = re.sub(r"(<h3>Goal</h3><p>.*?)(</p>)", lambda m: m.group(1) + " " + goal_add + m.group(2), t, 1, flags=re.S)
    q, a = faq_pair
    t = t.replace("  <h2>Related lessons</h2>", "  <h3>%s</h3>\n  <p>%s</p>\n\n  <h2>Related lessons</h2>" % (q, a), 1)
    mp.write_text(t, encoding="utf-8")
    ap = R/"src/pages/studio"/(slug+".astro"); a_ = ap.read_text(encoding="utf-8")
    m = re.search(r"steps: (\[.*?\]),\n", a_, re.S)
    cur = json.loads(m.group(1))
    a_ = a_.replace(m.group(0), "steps: " + json.dumps(cur + titles, ensure_ascii=False) + ",\n", 1)
    ap.write_text(a_, encoding="utf-8")
    print("patched", slug, n0, "->", n0 + len(titles))

def sched(n, fw):
    s = step(n, "Add the cron trigger in Studio", "Make the same trigger from the Triggers tab.",
     ["Click <b>Settings</b>, then <b>Project settings</b>, then the <b>Triggers</b> tab.", "Click <b>Add a trigger</b>.", "Keep <b>At given times</b>, type the name <code>nightly</code>, keep the cron <code>0 2 * * *</code> and type <code>Europe/Paris</code> as the time zone.", "Click <b>Add</b>."],
     "Settings → Project settings → Triggers → Add a trigger",
     "<p>The Cron box is the same five-field expression as in the file, and the Preset list fills it for you with a common schedule. If you check no workflow under <b>Workflows to run</b>, the trigger starts the whole project, as <code>thread.yaml</code> orders it. The trigger runs while <code>hdrctl serve</code> runs, which is the server of this Studio, or while <code>hdrctl watch</code> runs, but not both on the same project.</p>",
     "The New trigger box, filled in.", "",
     fig(fw, "trigger-cron-dialog-light", "The New trigger box of the Triggers tab with the type At given times selected, the name nightly, the cron 0 2 * * * and the time zone Europe/Paris.", "The <b>New trigger</b> box for a cron trigger."))
    s += step(n + 1, "Read the row and the file", "See the next run and what Studio wrote.",
     ["Read the <b>nightly</b> row: its <b>When</b> column, its <b>Next</b> run and its enabled checkbox.", "Open <code>triggers.yaml</code> at the root of the project."],
     "type triggers.yaml",
     "<p>The Next column shows the next time the expression fires, in your time zone: <code>25/11/2026 02:00</code> in our test. Each change is written to <code>triggers.yaml</code>; according to the text of the page, comments in the file are not kept and the previous file is copied to <code>~/.hydra/_backups</code>.</p>",
     "A row with the next run, and a file with the same three keys as in the CLI steps.",
     "version: \"1.0\"\ntriggers:\n  - name: nightly\n    type: cron\n    cron: 0 2 * * *\n    timezone: Europe/Paris",
     fig(fw, "trigger-cron-saved-dark", "The Triggers tab with one row, nightly, of type cron, showing the expression and the time zone, the next run 25/11/2026 02:00 and an enabled checkbox.", "The <b>nightly</b> row, with its next run."))
    s += step(n + 2, "Run it now", "Start the trigger without waiting for 02:00.",
     ["Click the green play button of the <b>nightly</b> row.", "Wait a few seconds: the Next column says <b>running</b>, then the Last run column shows a check mark.", "Read the <b>History</b> list under the table."],
     "▶ Run now",
     "<p>The run starts the project as the trigger would. In our test it lasted 4.79 seconds and the history line says <code>api</code> as its origin: the button calls the server, so it is not recorded as <code>manual</code> as <code>hdrctl trigger fire</code> is. The panel refreshes every five seconds.</p>",
     "A green check, <b>just now</b>, and one History line for <code>nightly</code>.", "",
     fig(fw, "trigger-run-now-light", "The Triggers tab after Run now on nightly: the last run column shows a green check and the origin api, and the History list has a nightly line with its duration.", "After <b>Run now</b>: last run and history."))
    return s
def hook(n, fw):
    s = step(n, "Add the webhook trigger in Studio", "Declare the trigger from the Triggers tab.",
     ["Click <b>Settings</b>, <b>Project settings</b>, then the <b>Triggers</b> tab, and click <b>Add a trigger</b>.", "Choose <b>An HTTP call</b>, and type the name <code>deploy</code>.", "Leave the <b>Token</b> field as Studio filled it, then click <b>Add</b>."],
     "Settings → Project settings → Triggers → Add a trigger → An HTTP call",
     "<p>The Token field does not hold a value. It holds a reference to a secret, <code>${SECRET:trigger.deploy.token}</code> in our test, and the box says to create the value after saving. This is the same line as in the file of the CLI steps.</p>",
     "The box with the type <b>An HTTP call</b> selected.", "",
     fig(fw, "trigger-webhook-dialog-light", "The New trigger box with the type An HTTP call selected, the name deploy and the token field holding a secret reference.", "The <b>New trigger</b> box for a webhook."))
    s += step(n + 1, "Read the missing token", "Studio tells you the secret does not exist yet.",
     ["Read the <b>deploy</b> row: its <b>When</b> column says <b>HTTP call with token</b> and, under it, <b>no token yet</b>.", "Read the orange line above the table."],
     "⚠ trigger 'deploy': secret 'trigger.deploy.token' is not set yet",
     "<p>The warning is the same one that <code>hdrctl trigger validate</code> printed in the CLI steps, and it names the command that fixes it. In Studio, the key button of the row fixes it too.</p>",
     "A row with an orange <b>no token yet</b> and a key button.", "",
     fig(fw, "trigger-webhook-saved-dark", "The Triggers tab with the rows nightly and deploy: the deploy row says no token yet, a warning line names the missing secret, and the row has a key button.", "The <b>deploy</b> row before its token exists."))
    s += step(n + 2, "Create the token", "Generate it once, and copy it.",
     ["Click the key button of the <b>deploy</b> row.", "Read the explanation, then click <b>Create the token</b>.", "Copy the token with <b>Copy the token</b>, or from the box."],
     "🔑 → Create the token",
     "<p>The token is a random value saved as the project secret <code>trigger.deploy.token</code> in <code>.hydra/secrets</code>, a file git ignores. The box shows it once, with a PowerShell command and a curl command for the URL of the webhook, <code>/api/projects/&lt;id&gt;/triggers/deploy/webhook</code>. Once it exists, the row says <b>token set</b> and the box offers <b>Replace the token</b>, whose value cannot be shown again.</p>",
     "A box with the token, the two commands and the line saying where the secret was saved.", "",
     fig(fw, "trigger-token-before-light", "The Token of deploy box before the token exists, with the explanation that it is saved as a project secret and a Create the token button.", "The box, before you create the token.") +
     fig(fw, "trigger-token-created-dark", "The Token of deploy box after creation: the token value shown once, a Copy the token button, and PowerShell and curl commands with the webhook URL.", "The token, shown once, with the commands to call the webhook."))
    return s

patch("run-a-project-on-a-cron-schedule", 58, "studio-schedule-trigger", sched,
 ["Add the cron trigger in Studio", "Read the row and the file", "Run it now"],
 ("Can I add a cron trigger in Hydra Studio?", "Yes. Open Settings, Project settings and the Triggers tab, click Add a trigger and keep the type At given times. Studio writes the same keys to triggers.yaml. In our test the new row showed the next run, 25/11/2026 02:00, and the Run now button started the project in 4.79 seconds."),
 "In Studio, the <b>Triggers</b> tab of the project settings does the same.", "Then make the same trigger in the Triggers tab of Studio and run it with one click.")
patch("start-a-project-with-a-webhook", 55, "studio-webhook-trigger", hook,
 ["Add the webhook trigger in Studio", "Read the missing token", "Create the token"],
 ("Can I create the webhook token in Hydra Studio?", "Yes. In the Triggers tab, the key button of a webhook row opens a box with a Create the token button. The token is shown once, with a PowerShell and a curl command, and it is saved as a project secret in .hydra/secrets."),
 "In Studio, the <b>Triggers</b> tab declares the trigger and creates the token.", "Then do the same in the Triggers tab of Studio, including the token.")
