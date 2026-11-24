"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("Where does Hydra ETL store secrets?", "In the file .hydra/secrets of the project, one name=value per line. hdrctl secret set writes it for you. The file is in clear text, and the .gitignore created by hdrctl init lists it, so that it is not committed."),
 ("How do I use a secret in a job or a workflow?", "Write ${SECRET:name} where the value goes, for example ${SECRET:api.token}. Hydra replaces it when the job or workflow runs. We tested it in a log step of a workflow."),
 ("Are secret values shown in the logs?", "By default they are replaced by [MASKED]. With --secrets-visibility hidden the line that contains a secret is removed and a message counts the removed lines. With plain the value is shown, and Hydra warns that it is for debugging only."),
 ("What wins when the secret is also an environment variable?", "The environment variable. ${SECRET:api.token} first reads API_TOKEN from the environment, then the file. In our test, API_TOKEN set in the shell replaced the value of the file."),
 ("How do I keep a different secret per environment?", "Add --env to the command: hdrctl secret set api.token --env prod writes .hydra/secrets.prod. A run with --env prod then reads that value first. We tested it with hdrctl workflow run."),
]
s = common(30, "Secrets", "Store and use secrets in a Hydra ETL project",
 "Keep a token out of your YAML: hdrctl secret set stores it in .hydra/secrets and ${SECRET:name} reads it at run time, masked in the logs.",
 '<span class="mono">hdrctl secret</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl secret set NAME</code> stores a value in <code>.hydra/secrets</code> of the project. A job or a workflow reads it with <code>${SECRET:NAME}</code>, and Hydra masks it in what it prints.",
 "Store a secret, use it in a workflow, read it masked, hidden and plain, make an environment variable and a per-environment file override it, then delete it.",
 "How do I store and use a secret in Hydra ETL?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init secrets-demo</code>, then <code>cd secrets-demo</code>. Use made-up values: never put a real password in a lesson.</li>')
s += step(1, "Store a secret", "One command, no value in the YAML.",
 ["Run the command below in the project folder.", "Check the list."],
 "echo abc123-demo-token| hdrctl secret set api.token --stdin\nhdrctl secret list",
 "<p>Without <code>--stdin</code>, the command asks for the value and hides what you type. The list shows names and scope, never values. The value is in clear text in <code>.hydra/secrets</code>, and <code>hdrctl init</code> adds that file to <code>.gitignore</code>.</p>",
 "<code>Secret api.token saved</code>, then the name with six dots.",
 "ok  Secret api.token saved in ...\\.hydra\\secrets\n\nSecrets of secrets-demo  ...\\.hydra\\secrets\n  api.token  common  ••••••")
s += step(2, "Use it in a workflow", "Write the placeholder.",
 ["Create <code>workflows/wf-secret.yaml</code> with the content below.", "Run it."],
 "hdrctl workflow run workflows\\wf-secret.yaml",
 "<p>The <code>log</code> step writes a message. The placeholder <code>${SECRET:api.token}</code> is replaced at run time.</p><pre class=\"cmd\">version: \"1.0\"\nworkflow:\n  name: wf-secret\n  trigger:\n    type: manual\n  steps:\n    - name: show_token\n      type: action\n      action: log\n      params:\n        message: \"Calling the API with token ${SECRET:api.token}\"</pre>",
 "The step is OK and the value is masked.",
 "✓  Step 'show_token' OK (0.0s)\n   │ Calling the API with token [MASKED]")
s += step(3, "Choose what the logs show", "masked, hidden or plain.",
 ["Run the workflow again with <code>--secrets-visibility hidden</code>.", "Then with <code>plain</code>."],
 "hdrctl workflow run workflows\\wf-secret.yaml --secrets-visibility hidden",
 "<p><code>masked</code> is the default. <code>hidden</code> removes the whole line and says how many lines it removed. <code>plain</code> shows the value after a warning: use it to debug, then go back.</p>",
 "A hidden line count, then the value in plain text with a warning.",
 "│ [1 line(s) hidden: they contain a secret]\n\nsecrets visibility is 'plain': secret values are shown in logs and messages (debugging only)\n│ Calling the API with token abc123-demo-token")
s += step(4, "Let an environment variable win", "Check the order.",
 ["In the terminal, set <code>API_TOKEN</code> (<code>set API_TOKEN=from-the-shell</code> on Windows).", "Run the workflow with <code>--secrets-visibility plain</code>."],
 "hdrctl workflow run workflows\\wf-secret.yaml --secrets-visibility plain",
 "<p><code>${SECRET:api.token}</code> reads <code>API_TOKEN</code> first. Use this in CI, where the value comes from the platform. Remove the variable when you are done.</p>",
 "The value of the shell, not the file.",
 "│ Calling the API with token from-the-shell")
s += step(5, "Keep one secret per environment", "Add --env.",
 ["Run the first command below.", "Run the workflow with <code>--env prod</code>."],
 "echo prod-token-999| hdrctl secret set api.token --env prod --stdin\nhdrctl workflow run workflows\\wf-secret.yaml --env prod --secrets-visibility plain",
 "<p>The value goes to <code>.hydra/secrets.prod</code>. The list says <code>prod</code> in the scope column. A run with <code>--env prod</code> reads that file before <code>.hydra/secrets</code>.</p>",
 "A new file in <code>.hydra</code>, and the prod value in the run.",
 "api.token  prod  ••••••\n\nproject.json\nsecrets\nsecrets.prod\n\n│ Calling the API with token prod-token-999")
s += step(6, "Read the errors, then delete", "Three cases.",
 ["Use <code>${SECRET:not.defined}</code> in a workflow and run it.", "Run <code>hdrctl secret delete api.token</code> twice.", "Try to store an empty value."],
 "hdrctl secret delete api.token",
 "<p>A missing secret fails the step, and the message lists where Hydra looked. Deleting a name that is gone fails too. An empty value is refused.</p>",
 "Three messages, one per case.",
 "✗  Step 'show_missing' FAILED: SecretResolutionError: Missing secret: not.defined — not in the environment (NOT_DEFINED) nor in the project secrets files (.hydra/secrets or HYDRA_SECRETS_FILE)\n\nok  Secret api.token deleted from ...\\.hydra\\secrets\n❌ secret 'api.token' not found in secrets\n\n❌ The value is empty: nothing saved.")
s += rules([("TIP", "Use <code>--stdin</code> in scripts: the value never appears on the screen of an interactive prompt."),
 ("TIP", "Name secrets with dots (<code>db.password</code>): the matching environment variable is the same name in capitals with an underscore (<code>DB_PASSWORD</code>)."),
 ("TRAP", "<code>.hydra/secrets</code> is plain text. Keep it out of Git: the <code>.gitignore</code> of <code>hdrctl init</code> does, but a project made by hand may not."),
 ("TRAP", "A value of three characters or fewer is stored, but it is too short to mask. Our test saved <code>abc</code> without error. Use real-length values."),
 ("TRAP", "Masking only changes what Hydra prints. The value is still sent, unchanged, to the connector, the script or the webhook that uses it.")])
s += tail([["Store", "hdrctl secret set NAME [--env E] [--stdin]"], ["List", "hdrctl secret list [--env E]"], ["Delete", "hdrctl secret delete NAME [--env E]"], ["Use", "${SECRET:NAME}"], ["Visibility", "--secrets-visibility plain|masked|hidden"]],
 [["Missing secret: NAME", "The name is in no environment variable and no secrets file", "Run hdrctl secret list, then hdrctl secret set"], ["secret 'NAME' not found in secrets", "The name is not in the file of that scope", "Check the name and the --env option"], ["The value is empty: nothing saved.", "The input line was empty", "Pipe a value, or type one at the prompt"]],
 faq, REL + '<li><a href="/studio/global-and-project-settings">Project settings and Global settings</a></li><li><a href="/studio/declare-project-triggers">Declare project triggers</a></li><li><a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage projects from the CLI</a></li>',
 "A secret lives in the project, is read by name, and is masked in what Hydra prints. Not covered here: SOPS files and external vaults.",
 '<a class="primary" href="/studio/global-and-project-settings">Back to Settings <span aria-hidden="true">→</span></a>') + CTA
publish(30, "store-and-use-secrets-with-hdrctl", "Secrets", s,
 "Store and use secrets in a Hydra ETL project", "Store and use secrets in a Hydra ETL project", "Hydra Secrets: hdrctl secret Command | Hydra ETL",
 "Store a token with hdrctl secret, read it with SECRET placeholders, and choose masked, hidden or plain logs. Tested with Hydra ETL 0.22.",
 ["Store a secret", "Use it in a workflow", "Choose what the logs show", "Let an environment variable win", "Keep one secret per environment", "Read the errors, then delete"], faq,
 "Secrets", "Store a token with hdrctl secret, use it in a workflow and choose what the logs show.")
