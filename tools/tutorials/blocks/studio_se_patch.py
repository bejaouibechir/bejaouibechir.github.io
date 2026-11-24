"""24/11/2026 : adds a Studio part (Settings) to the Secrets and Environments lessons."""
import pathlib
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/studio_trig_patch.py").read_text(encoding="utf-8").split("def sched(")[0])

def secrets(n, fw):
    s = step(n, "Add a secret in Studio", "Store a value from the Secrets tab.",
     ["Click <b>Settings</b>, then <b>Project settings</b>, then the <b>Secrets</b> tab.", "Type the name <code>db.password</code> and a value. The value box hides what you type.", "Click <b>Add</b>."],
     "Settings → Project settings → Secrets → Add",
     "<p>A name takes letters, digits, dots, underscores and hyphens, and Studio says so in red if you type anything else. The page says where the values go: the file <code>.hydra/secrets</code> of the project, ignored by git. The button reads <b>Replace</b> instead of <b>Add</b> when the name already exists in the list.</p>",
     "The form, filled in, with the value hidden.", "",
     fig(fw, "secrets-form-filled-light", "The Secrets tab of the project settings with the name db.password typed and a hidden value, above an Add button, and the note that the file is ignored by git.", "The <b>Secrets</b> tab, before <b>Add</b>."))
    s += step(n + 1, "Read the list", "See what Studio shows, and what it never shows.",
     ["Read the new row: name, value, source and reference.", "Open <code>.hydra/secrets</code> to see what was written."],
     "type .hydra\\secrets | findstr /v \"^#\"",
     "<p>The value column shows six dots whatever the length of the secret: according to the page, values are never displayed, and you type a new value to replace one. The <b>From</b> column says <b>common</b>. The last button copies the reference to paste in a field, <code>${SECRET:db.password}</code>.</p>",
     "One row, six dots, and one line in the file.",
     "db.password=change-me-demo",
     fig(fw, "secrets-row-added-dark", "The Secrets tab after adding db.password: one row with the name, six dots instead of the value, the source common, and a button copying the reference SECRET:db.password.", "The secret in the list, without its value."))
    s += step(n + 2, "Give a secret to one environment", "Use the scope list.",
     ["In <b>Secrets for</b>, choose <b>prod</b>. The environment must exist: create it as shown in the <a href=\"/studio/switch-environments-with-hdrctl-env\">Environments</a> lesson.", "Add <code>api.token</code> with a value: the button now reads <b>Add to prod</b>."],
     "Secrets for → prod → Add to prod",
     "<p>Studio creates <code>.hydra/secrets.prod</code> beside the common file; in our test it held one line, <code>api.token=prod-token-demo</code>. The list then shows both secrets with their source, <b>common</b> or <b>prod</b>. According to the text of the page, a secret of an environment wins over the common one when a run uses that environment.</p>",
     "<code>api.token</code> from <b>prod</b> and <code>db.password</code> from <b>common</b>.",
     "api.token=prod-token-demo",
     fig(fw, "secrets-prod-scope-light", "The Secrets tab with the scope set to prod: the list shows db.password from common and api.token from prod, and the file name .hydra/secrets.prod.", "Two secrets, from two scopes."))
    return s
def envs(n, fw):
    s = step(n, "Open the Environments card", "Find the global variables in Studio.",
     ["Click <b>Settings</b>, then <b>Global settings</b>.", "Find the <b>Environments</b> card and stay on the <b>Common</b> tab."],
     "Settings → Global settings → Environments",
     "<p>The card says where it saves: in the settings folder of this machine, not in the browser, so every project sees the same variables. The Common tab lists the values every run gets. In our test it held <code>REGION</code> and <code>API_URL</code>, set earlier with <code>hdrctl env set</code>.</p>",
     "A Common tab with two variables.", "",
     fig(fw, "env-common-tab-light", "The Environments card of Global settings on the Common tab, with the variables REGION and API_URL, an Add variable button and a Save common variables button.", "The <b>Common</b> tab."))
    s += step(n + 1, "Create the prod environment", "One click, one name.",
     ["Click <b>New environment</b>.", "Type <code>prod</code> and press Enter, or click the check mark."],
     "New environment → prod",
     "<p>A new tab named <code>prod</code> appears and is selected. It starts with the line <b>No variable.</b>. The tab also gets <b>Rename</b> and <b>Delete</b> buttons; according to the text of the page, Delete keeps a copy of the file in the <code>_backups</code> folder.</p>",
     "The name box beside the Common tab.", "",
     fig(fw, "env-new-box-dark", "The Environments card with the New environment box open and the name prod typed, next to the Common tab.", "The name box of the new environment."))
    s += step(n + 2, "Set a variable and save", "Write a value for prod.",
     ["Click <b>Add variable</b>.", "Type <code>API_URL</code> as the name and <code>https://api.example.test</code> as the value.", "Click <b>Save prod</b>."],
     "Add variable → Save prod",
     "<p>A name takes letters, digits and underscores, and cannot start with a digit; a duplicate name is flagged in red. The message <b>Saved</b> appears for two seconds, and the file shown above the table is the one Studio wrote: <code>env.prod</code> in the settings folder.</p>",
     "<b>Saved</b>, and a file with one line of variable.",
     "API_URL=https://api.example.test",
     fig(fw, "env-prod-saved-light", "The Environments card on the prod tab after Save: one variable API_URL with the value https://api.example.test, the file name env.prod and the message Saved.", "The <b>prod</b> tab after <b>Save prod</b>."))
    s += step(n + 3, "Choose the active environment", "Pick it where you run.",
     ["Open the project page.", "In the <b>Environment</b> list, choose <b>prod</b>. The <b>Manage</b> link opens the card you just used."],
     "Project page → Environment → prod",
     "<p>The list starts on <b>default (no environment)</b>. According to the text of the card, runs started from Studio then load the common variables, then those of the chosen environment, which is what <code>--env prod</code> does on the command line. The editor has the same list.</p>",
     "The list, with the Manage link beside it.", "",
     fig(fw, "env-active-selector-dark", "The Environment list on the project page, set to default (no environment), next to a Manage link that opens the Environments card.", "The environment list of the project page."))
    return s

patch("store-and-use-secrets-with-hdrctl", 30, "studio-secrets-panel", secrets,
 ["Add a secret in Studio", "Read the list", "Give a secret to one environment"],
 ("Can I manage secrets in Hydra Studio?", "Yes. The Secrets tab of the project settings adds, replaces and deletes secrets. In our test it wrote db.password to .hydra/secrets, showed six dots in place of the value, and the scope list created .hydra/secrets.prod for an environment."),
 "In Studio, the <b>Secrets</b> tab of the project settings does the same and never shows a value.", "Then add secrets from the Secrets tab of Studio, for all environments or for one.")
patch("switch-environments-with-hdrctl-env", 29, "studio-environments-panel", envs,
 ["Open the Environments card", "Create the prod environment", "Set a variable and save", "Choose the active environment"],
 ("Can I manage environments in Hydra Studio?", "Yes. The Environments card of Global settings creates, renames and deletes environments and edits their variables. In our test it wrote env.prod in the settings folder, and the project page has a list to choose the active environment."),
 "In Studio, the <b>Environments</b> card of Global settings does the same.", "Then create the same environment in Studio and choose it as the active one.")
