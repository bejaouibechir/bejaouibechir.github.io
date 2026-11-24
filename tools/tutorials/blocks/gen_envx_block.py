"""Lesson 'Other triggers' : slug run-triggers-with-hdrctl-watch."""
import re, pathlib, json
R = pathlib.Path(__file__).resolve().parents[3]
exec((R/"tools/tutorials/blocks/gen_eo_block.py").read_text(encoding="utf-8").split("# ---------- DEFINE")[0])

faq = [
 ("What is an environment in Hydra ETL?", "A named set of values, such as dev or prod, that a run picks with --env. In our test on Hydra ETL 0.22, an environment held global variables (one file per environment in the Hydra home folder) and, inside the project, a file of parameter values."),
 ("How do I read an environment variable in a job or workflow?", "Write ${ENV:NAME}. In our test, a log step with ${ENV:API_URL} printed the dev URL in a normal run and the prod URL with --env prod. A name that is defined in no file fails the step: Missing environment variable."),
 ("What happens if I give --env a name that does not exist?", "Nothing fails. In our test --env staging ran with the common values, with no warning. Check the name with hdrctl env list."),
 ("Does an environment replace the common variables?", "It adds to them and wins on a clash. In our test prod defined API_URL only, and REGION still came from the common file."),
 ("How do I try environments without touching my own settings?", "Set HYDRA_HOME to an empty folder before you run the commands. The global files go there instead of the .hydra folder of your user. All the tests of this lesson used it."),
]
s = common(29, "Environments", "Switch environments in Hydra ETL with hdrctl env",
 "Create dev and prod environments with hdrctl env, read their variables with ${ENV:NAME}, and pick one for a run with --env.",
 '<span class="mono">hdrctl env</span><span>about 10 minutes</span><span>Hydra ETL 0.22 on Windows</span>',
 "<code>hdrctl env</code> manages environments: common variables, one file per environment, and a parameter file in the project. A run picks one with <code>--env NAME</code>, and a job or workflow reads a variable with <code>${ENV:NAME}</code>.",
 "Redirect the settings folder, set common and prod variables, run a workflow with and without <code>--env</code>, then unset, rename and delete.",
 "How do I switch environments in Hydra ETL?")
s = s.replace('<li>Hydra ETL 0.22 with Studio running: <code>hdrctl serve</code>. See <a href="/studio/install-and-start">Install and start</a>.</li>', '<li>Hydra ETL 0.22 installed. See <a href="/studio/install-and-start">Install and start</a>.</li><li>A project: <code>hdrctl init envx-demo</code>, then <code>cd envx-demo</code>.</li><li>An empty folder for the settings, so that nothing is written in your own settings: <code>set HYDRA_HOME=C:\\temp\\fake-home</code> on Windows. Skip this line to use your real ones.</li>')
s += step(1, "Set common variables", "Values every run gets.",
 ["Run the two commands below."],
 "hdrctl env set REGION eu-west\nhdrctl env set API_URL https://dev.example.test",
 "<p>Without <code>--env</code>, <code>env set</code> writes the common file, named <code>env</code>, in the settings folder.</p>",
 "Two <code>ok</code> lines that name the file <code>env</code>.",
 "ok  REGION set for (common) (...\\fake-home\\env)\nok  API_URL set for (common) (...\\fake-home\\env)")
s += step(2, "Create the prod environment", "One command, two files.",
 ["Create the environment.", "Give it its own <code>API_URL</code>."],
 "hdrctl env create prod\nhdrctl env set API_URL https://api.example.test --env prod",
 "<p><code>env create</code> makes <code>env.prod</code> in the settings folder and <code>environments/prod.yaml</code> in the project. The project file holds parameter values, as in <a href=\"/studio/manage-jobs-and-parameters-from-the-cli\">Manage projects from the CLI</a>. Add <code>--global-only</code> to skip it.</p>",
 "A box that says <code>Environment 'prod' created</code> and two <code>created</code> lines.",
 "✅ Environment 'prod' created\n  created ...\\fake-home\\env.prod\n  created ...\\envx-demo\\environments\\prod.yaml\n\nok  API_URL set for prod (...\\fake-home\\env.prod)")
s += step(3, "List and show", "See what each scope holds.",
 ["Run the two commands below."],
 "hdrctl env list\nhdrctl env show prod",
 "<p><code>list</code> counts variables, parameter values and secrets for each environment. <code>show</code> prints the variables of one scope. Run <code>env show</code> with no name for the common ones.</p>",
 "A count per scope, then the names and values.",
 "(common)          2 variable(s)\nprod              1 variable(s) · 0 parameter value(s) · no secrets\n\nGlobal variables — prod\n  API_URL  https://api.example.test")
s += step(4, "Read a variable in a workflow", "Use ${ENV:NAME}.",
 ["Create <code>workflows/wf-env.yaml</code> with the content below.", "Run it with and without <code>--env prod</code>."],
 "hdrctl workflow run workflows\\wf-env.yaml\nhdrctl workflow run workflows\\wf-env.yaml --env prod",
 "<p>The environment overrides the common value where both define a name. Here <code>prod</code> sets <code>API_URL</code> only: <code>REGION</code> still comes from the common file.</p><pre class=\"cmd\">version: \"1.0\"\nworkflow:\n  name: wf-env\n  trigger:\n    type: manual\n  steps:\n    - name: show_env\n      type: action\n      action: log\n      params:\n        message: \"Target: ${ENV:API_URL} (region ${ENV:REGION})\"</pre>",
 "The dev URL first, the prod URL second, the same region.",
 "│ Target: https://dev.example.test (region eu-west)\n│ Target: https://api.example.test (region eu-west)")
s += step(5, "Try a name that does not exist", "No error.",
 ["Run the workflow with <code>--env staging</code>."],
 "hdrctl workflow run workflows\\wf-env.yaml --env staging",
 "<p>The run uses the common values and prints no warning. A typo in <code>--env</code> therefore looks like a success: check the name with <code>hdrctl env list</code>.</p>",
 "The dev URL again.",
 "│ Target: https://dev.example.test (region eu-west)")
s += step(6, "Unset, rename, delete", "Change an environment safely.",
 ["Remove <code>REGION</code> and run the workflow.", "Rename <code>prod</code> to <code>production</code>.", "Delete it with <code>-y</code>."],
 "hdrctl env unset REGION\nhdrctl env rename prod production\nhdrctl env delete production -y",
 "<p>A variable defined nowhere stops the step. <code>rename</code> and <code>delete</code> move both files, and each one keeps a copy in a <code>_backups</code> folder of the settings folder first. After a rename, update the scripts that pass the old name to <code>--env</code>.</p>",
 "A failed step, a rename box, a delete box with a backup path.",
 "✗  Step 'show_env' FAILED: SecretResolutionError: Missing environment variable: REGION\n\n✅ Environment 'prod' renamed to 'production'\n  Update the scripts and schedules that pass --env with the old name.\n\n✅ Environment 'production' deleted\n  Backup: ...\\fake-home\\_backups\\20261124-075240-delete-production")
s += rules([("TIP", "Set <code>HYDRA_ENV=prod</code> in the shell once, instead of repeating <code>--env prod</code> on every command."),
 ("TIP", "Keep tokens in <a href=\"/studio/store-and-use-secrets-with-hdrctl\">secrets</a>, not in environment variables: the files of <code>hdrctl env</code> are plain text."),
 ("TRAP", "An unknown <code>--env</code> name falls back to the common values and prints nothing."),
 ("TRAP", "The global files are in the settings folder of your user, shared by all your projects. A variable you set for one project reaches the others.")])
s += tail([["Set", "hdrctl env set NAME VALUE [--env E]"], ["Create / delete", "hdrctl env create E, hdrctl env delete E -y"], ["Inspect", "hdrctl env list, hdrctl env show [E]"], ["Rename", "hdrctl env rename OLD NEW"], ["Use", "${ENV:NAME}, --env E, HYDRA_ENV"], ["Redirect", "HYDRA_HOME=<folder>"]],
 [["Missing environment variable: NAME", "The name is in no environment file and not in the shell", "Run hdrctl env show, then hdrctl env set"], ["NAME is not defined for (common)", "env unset on a name that is not there", "Check the scope with hdrctl env show"]],
 faq, REL + '<li><a href="/studio/store-and-use-secrets-with-hdrctl">Store and use secrets</a></li><li><a href="/studio/manage-jobs-and-parameters-from-the-cli">Manage projects from the CLI</a></li><li><a href="/studio/global-and-project-settings">Project settings and Global settings</a></li>',
 "Common values, one environment per target, one option to choose. Not covered here: the Environments panel of Studio.",
 '<a class="primary" href="/studio/store-and-use-secrets-with-hdrctl">Next: Secrets <span aria-hidden="true">→</span></a>') + CTA
publish(29, "switch-environments-with-hdrctl-env", "Environments", s,
 "Switch environments in Hydra ETL with hdrctl env", "Switch environments in Hydra ETL with hdrctl env", "Hydra Environments: hdrctl env Command | Hydra ETL",
 "Create dev and prod environments with hdrctl env, read variables with ENV placeholders and pick one with --env. Tested with Hydra ETL 0.22.",
 ["Set common variables", "Create the prod environment", "List and show", "Read a variable in a workflow", "Try a name that does not exist", "Unset, rename, delete"], faq,
 "Environments", "Create environments with hdrctl env, read their variables in a workflow and pick one with --env.")
