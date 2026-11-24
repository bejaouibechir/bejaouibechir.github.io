# Hydra Studio lessons — part 2

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback — slug: /studio/dry-run-and-use-fallback/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons42 · Dry run▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 49

Lesson 49 of 65 · Dry run

### Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback

You should not have to delete a file to find out whether your backup works. Print the plan, then force the switch.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

hdrctl run --dry-run · --use-fallbackabout 15 minutesa project with fallbacks

Quick answer
Run hdrctl run . --dry-run to print the execution plan, with a ↪ fallback line under each workflow that has one, and write nothing. Run hdrctl run . --use-fallback wf_load to force the backup of wf_load without changing any file. The option applies to a project, not to a single job.

#### What will you learn in this lesson?

##### Goal

Print the plan of a project with fallbacks, read its warnings, force a fallback on demand and recognize the two refusals. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The fallback-demo copy of fallbackproject with its three fallbacks, Data/orders.csv present and Data/stamp.txt absent.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I rehearse a fallback in Hydra ETL?

##### 01Print the plan with --dry-run

###### Objective

See every fallback of the project before anything runs.

###### Actions

Open a terminal in the project folder.

Run the command below.

Read the plan.

hdrctl run . --dry-run

A dry run validates the project and prints the plan. Each fallback appears under its workflow, with its condition. A warning appears when the backup publishes somewhere else than the workflow it replaces.

What you should see
A plan with three ↪ fallback lines, one warning, and Dry run OK.

Stage 1/2 — sequential
• wf_load (1: load_orders)
↪ fallback: wf_load_backup (if not file_exists('Data/orders.csv') or file_size('Data/orders.csv') < 100)
• wf_report (3: build_report, share, finalize)
↪ fallback: wf_report_quarantine (if previous.rows < 10; on failure)
Stage 2/2 — sequential
• wf_archive (1: archive)
↪ fallback: wf_archive_alt (if file_age('Data/stamp.txt') > 30s)
⚠ workflows/thread.yaml: workflow 'wf_report' fallback: 'wf_report_quarantine' writes to ['csv:../../outputs/quarantine.csv'] instead of [...] (fine for a quarantine workflow; otherwise check it)

✅ Dry run OK: the project is valid. Nothing was executed.

[image: The Studio terminal after hdrctl run . --dry-run, ending with Dry run OK.]

The terminal built into Studio runs the same command.

##### 02Check the project in Studio

###### Objective

Get the same validation from the interface.

###### Actions

Open Project settings → Execution order.

Select Check.

Execution order → Check

Check validates the project like a dry run, and shows the same warning.

What you should see
A green line Ready: wf_load → wf_report → wf_archive followed by the warning about wf_report_quarantine.

[image: The Execution order panel after Check, with a Ready line and a warning about wf_report_quarantine.]

Check and --dry-run report the same things.

##### 03Force a fallback with --use-fallback

###### Objective

Switch to a backup without touching the data.

###### Actions

Name the workflow that declares the fallback.

Run the command.

Read the switch line.

hdrctl run . --use-fallback wf_load

Data/orders.csv is still there. The switch line says why the backup ran:

What you should see
forced (--use-fallback) in the first line, then the backup under its own name. The Studio terminal shows only the end of a long output: scroll up to read the first lines.

↪ Fallback: wf_load → wf_load_backup — forced (--use-fallback)
▶ Workflow wf_load_backup (fallback, in place of wf_load)
✓ Step 'load_orders_backup' OK (<duration>)
✓ Workflow 'wf_load_backup' OK (<duration>)

[image: The Studio terminal after hdrctl run . --use-fallback wf_load, showing the forced switch.]

The end of the forced run. The first lines, with the switch itself, scroll above.

##### 04Read the chain reaction

###### Objective

Understand why a second fallback ran.

###### Actions

Read the lines after the first switch.

hdrctl run . --use-fallback wf_load

The backup of wf_load loads 8 rows, not 20. The condition of wf_report is previous.rows < 10, so it is now true:

What you should see
A second switch for wf_report, caused by the rows the backup wrote.

↪ Fallback: wf_report → wf_report_quarantine — previous.rows = 8
▶ Workflow wf_report_quarantine (fallback, in place of wf_report)
✓ Workflow 'wf_report_quarantine' OK
✅ Project completed — 3/3 workflow(s) OK

##### 05Recognize the refusals

###### Objective

Know the two errors you will meet.

###### Actions

Force a backup by its own name.

Pass a job folder instead of a project.

hdrctl run . --use-fallback wf_archive_alt

Hydra ETL refuses both before running anything:

What you should see
An error, and no run.

❌ Project cannot run:
err — --use-fallback wf_archive_alt: workflow 'wf_archive_alt' has no fallback in workflows/thread.yaml

hdrctl run jobs/load_orders --use-fallback wf_load
❌ --use-fallback applies to a project (hdrctl run <project>), not to a single job: jobs/load_orders

###### Tips and tricks

Run --dry-run after every change to thread.yaml.

-v prints a line for each fallback that was not needed, with the value that was measured.

--use-fallback forces one workflow only. Later conditions are still tested and can switch too.

A dry run validates and plans. It does not test that the backup's data exists.

#### What should I have at the end?

VerificationExpected result

PlanA ↪ fallback line under each workflow with a fallback

WarningA warning when a backup writes elsewhere

Forcedforced (--use-fallback) in the switch line

RefusalsTwo clear errors, no run

#### What if something goes wrong?

SymptomCauseFix

has no fallback in workflows/thread.yamlThe name is not a workflow that declares a fallbackUse the main workflow's name, not the backup's

applies to a project … not to a single jobA job folder was givenGive the project folder: hdrctl run .

No ↪ fallback line in the planThe fallback block is not in thread.yamlDeclare it in Execution order and save

#### Frequently asked questions

##### What does hdrctl run --dry-run do with fallbacks?

It prints the execution plan with a fallback line under each workflow that has one, validates the project and writes nothing.

##### How do I force a fallback in Hydra ETL?

Run hdrctl run . --use-fallback followed by the name of the workflow that declares it, for example wf_load.

##### Can I use --use-fallback on a single job?

No. Hydra ETL refuses it: the option applies to a project, hdrctl run followed by a project folder.

##### Why did a second fallback run after I forced the first?

Conditions are tested in order. After wf_load_backup loaded 8 rows, previous.rows < 10 was true for wf_report, so its own fallback ran too.

#### Related lessons

Declare a fallback workflow

Fallback conditions

Set a timeout on a workflow

The hdrctl command line

#### Next lesson

This block is complete. The next lessons of the course cover the Condition and Delay nodes inside a workflow.

Back to the course map →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Fallback conditions in Hydra ETL: when, on_failure and on_probe_error — slug: /studio/fallback-conditions-when-on-failure/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons40 · Fallback conditions▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 47

Lesson 47 of 65 · Fallback conditions

### Fallback conditions in Hydra ETL: when, on_failure and on_probe_error

A fallback is only as good as its condition. Write the test, decide what a failed test means, and choose whether a failure also calls the backup.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

Execution order → Fallback editorabout 20 minutesa project with fallbacks

Quick answer
A Hydra ETL fallback has three settings. when is the condition tested just before the workflow starts, built from file_exists(), file_size(), file_age(), previous.rows and similar. on_probe_error says what to do when a check cannot answer. on_failure: true also calls the backup after a failure that published nothing.

#### What will you learn in this lesson?

##### Goal

Write a valid when condition, read the error when it is not valid, decide what a check that cannot answer means, and let a failed workflow call its backup. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The fallback-demo copy of fallbackproject from lesson 46, with its three fallbacks: wf_load (backup wf_load_backup, when the file is missing or under 100 bytes), wf_report (backup wf_report_quarantine, when previous.rows < 10, also after a failure) and wf_archive (backup wf_archive_alt, when file_age('Data/stamp.txt') > 30s).

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I write the condition of a fallback in Hydra ETL?

##### 01Read what a condition can test

###### Objective

Know the closed list of functions before you write one.

###### Actions

Open the fallback editor of wf_load (the lifebuoy button).

Open the function list of the assistant under the when field.

Read the help shown for each function.

when: not file_exists('Data/orders.csv')

A condition is a small language, read by Hydra ETL itself: never Python. Operators are and, or, not, parentheses and the comparisons == != < <= > >=. Durations are written 500ms, 30s, 5m, 24h, 7d and sizes 10KB, 5MB, 1GB. These are the functions a project can use without a database:

FunctionTrue or measured

file_exists('path')the file exists

file_size('path')size of the file, for example file_size('in.csv') < 1MB

file_age('path')time since the last change, for example file_age('in.csv') > 24h

source_available('name')the source answers (connection test, or the file is there)

destination_available('name')the destination answers (or its folder is writable)

url_ok('url')the URL answers with HTTP 2xx or 3xx

secret_defined('name')the secret is set in .hydra/secrets or in the environment

previous.rowsrows written by the previous workflow

previous.statussuccess, failed, skipped, inactive or none

Database and change-data-capture functions (db.load, cdc.lag, cdc.status and others) exist as well; they need a database source.

What you should see
The assistant shows a join, a not box, a function list, an argument field and an Insert button.

[image: The fallback editor of wf_load with the assistant row open on the file_size function.]

The assistant builds the condition piece by piece.

##### 02Write a condition with the assistant

###### Objective

Build a condition without typing the syntax.

###### Actions

Pick a function in the Condition function list.

Type its argument.

Select Insert.

file_size('Data/orders.csv') < 100

The assistant completes the when field and keeps what you already wrote. Select the not box to negate the test, and the or or and list to join it to the previous one. The field checks as you type.

What you should see
The field is updated and ends with a green check mark.

##### 03Read the error of an invalid condition

###### Objective

Recognize a condition that Hydra ETL refuses.

###### Actions

Replace file_exists with file_exist in the when field.

Read the red mark and the message.

file_exist('Data/orders.csv')

Studio shows the message in red. The same condition in thread.yaml stops hdrctl run before anything runs:

What you should see
A red cross, and a message that names the unknown function and lists the valid ones.

❌ Project cannot run:
err — workflows/thread.yaml: thread.0.workflows.0.fallback.when: unknown function file_exist() — use one of: source_available(), destination_available(), file_exists(), file_size(), file_age(), url_ok(), secret_defined(), db.load(), …

err — workflows/thread.yaml: thread.1.workflows.0.fallback.when: file_age() takes 1 argument(s), got 0

[image: The fallback editor of wf_load with the condition file_exist marked with a red cross and an error message.]

A misspelled function is refused as you type.

##### 04Decide what a check that cannot answer means

###### Objective

Choose between keeping the workflow and calling the backup when the test itself fails.

###### Actions

Open the fallback editor of wf_archive.

Open the list if a check cannot answer.

Choose keep wf_archive or use the fallback.

on_probe_error: keep | replace

The condition of wf_archive reads Data/stamp.txt, which does not exist, so the check cannot answer. With keep (the default) the workflow runs and Hydra ETL warns you. With replace the backup runs, and the reason is printed.

What you should see
A list with two choices, keep wf_archive and use the fallback.

keep:
⚠ wf_archive: fallback check failed (file_age('Data/stamp.txt'): file not found (…/Data/stamp.txt)); keeping wf_archive

replace:
↪ Fallback: wf_archive → wf_archive_alt — check failed: file_age('Data/stamp.txt'): file not found (…/Data/stamp.txt)

[image: The fallback editor of wf_archive with the if a check cannot answer list set to use the fallback.]

The setting sits at the end of the editor.

##### 05Call the backup after a failure

###### Objective

Let a workflow that fails without publishing anything be replaced.

###### Actions

Open the fallback editor of wf_report.

Check also after a failure.

Save and run the project.

on_failure: true

The checkbox reads also after a failure (only if nothing was published). Its tooltip is precise: the first replacement runs if the workflow fails, or exceeds its max time, without leaving anything published. That means nothing loaded and nothing done outside Hydra ETL, or everything undone by rollback: true. If the workflow had already published data, the project stops and says why. In the project of this lesson, wf_report has rollback: true; with Data/finalize.csv missing, its last step fails:

What you should see
The box is checked on wf_report. After the failure, Hydra ETL undoes the steps, then runs the backup and carries on.

✓ Step 'build_report' OK
✓ Step 'share' OK
✗ Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.
↩ Step 'share' undone
↩ Step 'build_report' undone
↯ Workflow 'wf_report' failed (<duration>), nothing published — replaced by wf_report_quarantine
↪ Fallback: wf_report → wf_report_quarantine — wf_report failed without publishing anything
▶ Workflow wf_report_quarantine (fallback, in place of wf_report)
✓ Workflow 'wf_report_quarantine' OK
✅ Project completed — 3/4 workflow(s) OK

[image: The fallback editor of wf_report with the also after a failure box checked.]

The failure option is a checkbox, saved as on_failure: true.

###### Tips and tricks

Write the condition as the situation in which the main workflow must not run.

Paths are relative to the project folder, not to the job folder.

file_exist() is not file_exists(): an unknown function stops the project before it runs.

A fallback that publishes to a different file is allowed. Hydra ETL warns you, so check that it is intended.

#### What should I have at the end?

VerificationExpected result

ConditionA green check mark after the when field

ErrorA red message that names the function you misspelled

Probe errorkeep prints a warning, replace runs the backup

After a failureA failed wf_report is replaced by wf_report_quarantine

#### What if something goes wrong?

SymptomCauseFix

Red cross after the conditionUnknown function or wrong number of argumentsRead the message under the field, then pick the function from the assistant

The backup never runsThe condition is false, or the check cannot answer and on_probe_error is keepRun with hdrctl run . -v and read the fallback not needed line

The project stops after a failureThe failed workflow had already published dataAdd rollback: true to the workflow so everything is undone first

#### Frequently asked questions

##### Which functions can a fallback condition use?

file_exists, file_size, file_age, source_available, destination_available, url_ok, secret_defined, db.load and the four cdc functions, plus the values previous.rows and previous.status. Conditions combine them with and, or, not and comparisons.

##### What happens when a fallback check cannot answer?

By default the workflow is kept and Hydra ETL prints a warning. Set on_probe_error to replace, shown in Studio as use the fallback, to run the backup instead.

##### Does a fallback run after a failure?

Only with on_failure: true, and only if the failed workflow published nothing, either because nothing was loaded or because rollback undid everything.

##### Which units can a condition use?

Durations such as 500ms, 30s, 5m, 24h and 7d, and sizes such as 10KB, 5MB and 1GB.

#### Related lessons

Declare a fallback workflow

Set a timeout on a workflow

Dry run and --use-fallback

workflow.yaml reference

#### Next lesson

The next lesson sets a maximum duration on a workflow, which also counts as a failure that a fallback can answer.

Set a timeout →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra Studio settings: global preferences and project settings — slug: /studio/global-and-project-settings/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons24 · Settings▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 31

Lesson 31 of 65 · Settings

### Hydra Studio settings: global preferences and project settings

Studio keeps its settings in two places. Learn which ones apply everywhere, which belong to a project, and which file each of them ends up in.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Settingsabout 15 minutesa project in Studio

Quick answer
Hydra Studio has Global settings for every project and Project settings for one project. Global settings hold the data viewer, the environments and the job sync interval. Project settings hold the execution order, parameters, secrets and triggers, each saved in its own file.

#### What will you learn in this lesson?

##### Goal

Visit the two Settings tabs, tell which setting is global and which is per project, and know the file each project setting writes.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

Studio running with the studio-course project. The pictures of the project settings come from it.

#### Where do I change a setting in Hydra Studio?

##### 01Open Global settings

###### Objective

See what applies to every project.

###### Actions

Select Settings at the bottom of the sidebar.

Stay on the Global settings tab.

Sidebar → Settings → Global settings

Three things live here. The data viewer row count (10 by default) sets how many rows View data shows when you right-click a destination. The Environments card holds variables shared by every project on the machine. The job files sync interval sets how often an open job is compared with its files on disk. The editor preferences stay in this browser, while the environments are saved on this machine.

What you should see
A page with the data viewer field, the Environments card and the sync interval.

Data viewer: 10 rows (default: 10)
Environments: Common · dev · prod
Job files sync: 5 seconds

[image: The Global settings tab of Hydra Studio in the light theme: the data viewer row count, the Common, dev and prod environments with a variable table, and the job files sync interval.]

Global settings.

##### 02Read the Environments card

###### Objective

Understand how shared variables are organized.

###### Actions

Select Common, then dev, and compare the variable tables.

Select New environment to see the name box, then cancel.

Global settings → Environments

Variables in Common apply to every environment, saved in ~/.hydra/env. Each other tab, such as dev, adds variables saved in ~/.hydra/env.<name>. A run loads the common variables first, then those of the active environment. Use a variable as ${ENV:NAME} in a field. Names accept letters, digits and underscores and cannot start with a digit; Studio flags duplicates. A later lesson builds an environment from scratch.

What you should see
Tabs for Common and each environment, a table of names and values, and a New environment button that opens a name box.

Common ~/.hydra/env
dev ~/.hydra/env.dev

[image: The Environments card of Hydra Studio Global settings in the dark theme, with the Common tab selected, a name box open after New environment and the variable table below.]

The name box after New environment, before anything is saved.

##### 03Open Project settings

###### Objective

Reach the settings of one project.

###### Actions

Select the Project settings tab.

Choose studio-course in the list.

Settings → Project settings

Without a project, the tab only offers a list and a Projects button. Once a project is chosen, the header shows its name and folder, the active environment with a Manage link, a project list and Back to the project. Four tabs follow: Execution order, Parameters, Secrets and Triggers. The address /settings/project/<project id> opens a project directly.

What you should see
A list reading Choose a project, then the four tabs once a project is selected.

Project settings
Choose a project…

[image: The Project settings tab of Hydra Studio in the light theme with no project open: a Choose a project list and a Projects button.]

Project settings before a project is chosen.

##### 04Read the Execution order tab

###### Objective

See where the order of workflows is set for the whole project.

###### Actions

Stay on Execution order.

Read the stage line, then the workflow line.

Project settings → Execution order

The order is saved in workflows/thread.yaml for everyone who opens the project. Workflows are grouped in stages: inside a stage they run one after the other or in parallel, and each workflow can wait before it starts or be given a longest running time. Define edits the order, Preview shows it, Check validates it and the button shows Saved once written. Loops can replay a part of the thread. A later lesson covers the execution order in detail.

What you should see
One stage, sequential, holding first-workflow, with wait and max fields.

Stage 1 sequential then wait 0
☑ first-workflow wait 0 max none

[image: The Execution order tab of the Project settings of studio-course in the dark theme: Stage 1, sequential, holding first-workflow, with Define, Preview, Check and Saved buttons and a Loops section.]

Execution order of studio-course.

##### 05Read Parameters, Secrets and Triggers

###### Objective

Know what each remaining tab writes, and for whom.

###### Actions

Select Parameters, then Secrets, then Triggers.

Read the grey note under the project name each time.

Project settings → Parameters · Secrets · Triggers

The note under the project name says where a tab saves. Parameters go to parameters.yaml and environments/<env>.yaml, for everyone who opens the project. Secrets go to .hydra/secrets and .hydra/secrets.<env>, ignored by Git: this machine only. Triggers go to triggers.yaml: what starts the whole project, by time, file, data change, webhook or the end of another project. They run under hdrctl serve or hdrctl watch. The Parameters and Secrets tabs are the same panels as in the bottom panel of the editor.

What you should see
Three tabs, each with a note, and empty lists on a new project.

Parameters → parameters.yaml, environments/.yaml
Secrets → .hydra/secrets (git-ignored)
Triggers → triggers.yaml

[image: The Parameters tab of the Project settings of studio-course in the light theme, with an empty table and the Add parameter and Save buttons.]

Parameters.

[image: The Secrets tab of the Project settings of studio-course in the dark theme: scope list, explanation of the .hydra/secrets file, an empty list and the name and value fields.]

Secrets.

[image: The Triggers tab of the Project settings of studio-course in the light theme, with Refresh and Add a trigger buttons, an empty list and the History section.]

Triggers.

###### Tips and tricks

Read the grey note under the project name: it tells where the current tab writes and who receives the change.

Open /settings/project/<project id>?tab=triggers to land on a tab directly.

Secrets do not travel with the project. A colleague who opens the project from Git has to add their own.

Environment variables of Global settings are shared by every project on this machine: keep names specific.

#### What should I have at the end?

VerificationExpected result

Global settingsData viewer rows, Environments, job files sync interval

Project settingsFour tabs: Execution order, Parameters, Secrets, Triggers

Filesthread.yaml, parameters.yaml, environments/.yaml, .hydra/secrets, triggers.yaml

SecretsGit ignores them: this machine only

#### What if something goes wrong?

SymptomCauseFix

Project settings shows only a listNo project is chosenChoose one in the list, or open it from the Overview

The page says the project is not openStudio has not opened that projectOpen it from the Overview first

A variable name is refusedNames accept letters, digits and underscores onlyRename it, without a leading digit

A colleague lacks a secretSecrets are not committedEach machine adds its own secret values

#### Frequently asked questions

##### What is the difference between Global settings and Project settings in Hydra Studio?

Global settings apply to every project: the data viewer row count, the environments saved on your machine and the job sync interval. Project settings belong to one project and are written in its files: execution order, parameters, secrets and triggers.

##### Where does Studio save each setting?

The editor preferences are kept in this browser. Environment variables go to ~/.hydra on your machine. The execution order goes to workflows/thread.yaml, parameters to parameters.yaml and environments/.yaml, secrets to .hydra/secrets and triggers to triggers.yaml.

##### Are secrets shared with my team through Git?

No. Secrets are saved in .hydra/secrets and .hydra/secrets., which Git ignores, so they stay on this machine. Parameters, the execution order and triggers are project files that everyone who opens the project receives.

##### How do I open the settings of a project?

Select Settings in the sidebar, then the Project settings tab, and choose a project in the list. You can also open the address /settings/project/, and append ?tab=parameters, secrets or triggers.

##### When do triggers run?

Triggers run while hdrctl serve is running, which is Studio itself, or while hdrctl watch runs. The Studio panel states that they do not run in both on the same project.

#### Related lessons

Tour the Studio pages

Use the bottom panel

Use parameters

Set timeouts on workflows

#### Next lesson

You know where every setting lives. The next lessons build parameters and environments in a real project.

Use parameters →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Handle a failing step with on_failure — slug: /studio/handle-step-failures-with-on-failure/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons33 · Error Scope▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 52

Lesson 52 of 65 · Error Scope

### Handle a failing step with on_failure

Set on_failure to fail, skip or continue on a workflow step and read what each one does to the steps around it.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

on_failureabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
on_failure is a key of a workflow step. fail stops the workflow, skip skips the steps that depend on the failed step, and continue runs them anyway. The Error Scope container of Studio writes the same key. In Studio, the Containers group of the palette has an Error Scope.

#### What will you learn in this lesson?

##### Goal

Run one workflow three times with a failing step, change on_failure each time, and compare the steps that run. Then find the Error Scope in the palette of Studio.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project: hdrctl init scope-demo. Work in its workflows folder.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I keep a Hydra ETL workflow going after a step fails?

##### 01Write a workflow with a failing step

###### Objective

Four steps, one that fails.

###### Actions

Save the file below as workflows/scope-fail.yaml.

Run it from the project folder.

hdrctl workflow run workflows\scope-fail.yaml

The step boom ends the Python script with a non-zero code, so it fails. after_boom depends on it, later depends on independent, and independent depends on nothing. With no on_failure the default is fail.

version: "1.0"
workflow:
name: scope-fail
trigger:
type: manual
steps:
- name: boom
type: action
action: python
params:
script: |
raise SystemExit(1)
- name: after_boom
type: action
action: log
params:
message: "runs after boom"
depends_on: [boom]
- name: independent
type: action
action: log
params:
message: "independent step"
- name: later
type: action
action: log
params:
message: "later step"
depends_on: [independent]

What you should see
boom fails, the two later steps are skipped, and the workflow fails.

✓ Step 'independent' OK (0.0s)
│ independent step
✗ Step 'boom' FAILED: Python script exited with code 1
⏭ Step 'after_boom' skipped
⏭ Step 'later' skipped

❌ Workflow 'scope-fail' FAILED in 0.1s — Step 'boom' failed: Python script exited with code 1

##### 02Try skip

###### Objective

Add one line to boom.

###### Actions

Copy the file to workflows/scope-skip.yaml and change the name to scope-skip.

Add on_failure: skip under the boom step, at the same level as action.

Run it.

hdrctl workflow run workflows\scope-skip.yaml

later now runs, because it does not depend on boom. after_boom is still skipped, because it does.

What you should see
later runs, after_boom is skipped.

✓ Step 'independent' OK (0.0s)
│ independent step
✗ Step 'boom' FAILED: Python script exited with code 1
⏭ Step 'after_boom' skipped
✓ Step 'later' OK (0.0s)
│ later step

❌ Workflow 'scope-skip' FAILED in 0.1s — None

##### 03Try continue

###### Objective

Let the dependent step run.

###### Actions

Copy the file to workflows/scope-continue.yaml and change the name to scope-continue.

Use on_failure: continue on boom.

Run it.

hdrctl workflow run workflows\scope-continue.yaml

Now after_boom runs although the step it depends on failed. Use this for a step that must run whatever happened before, such as a cleanup or a notification.

What you should see
All steps but boom run.

✓ Step 'independent' OK (0.0s)
│ independent step
✗ Step 'boom' FAILED: Python script exited with code 1
✓ Step 'after_boom' OK (0.0s)
│ runs after boom
✓ Step 'later' OK (0.0s)
│ later step

❌ Workflow 'scope-continue' FAILED in 0.1s — None

##### 04Read the end of the run

###### Objective

The workflow still failed.

###### Actions

Look at the last line of the skip and continue runs.

Check the exit code in your shell: echo %ERRORLEVEL% in cmd.

echo %ERRORLEVEL%

In our test, both runs ended with FAILED … — None and exit code 1, although the steps after boom ran. The workflow counts as successful only when every step succeeded. A scheduler or a script that reads the exit code sees a failure.

What you should see
1.

1

##### 05Check a wrong value

###### Objective

Validation names the three values.

###### Actions

Save a copy of the file with on_failure: ignore on a step.

Run the validation.

hdrctl workflow validate workflows\bad-onfail.yaml

The check runs before any step.

What you should see
A refusal that lists fail, skip and continue.

❌ Invalid workflow: Workflow validation error in '...\workflows\bad-onfail.yaml':
- steps.0.on_failure: Input should be 'fail', 'skip' or 'continue'

###### Tips and tricks

Use continue only for steps that must run after a failure, such as a cleanup, and put the check in the step itself.

Use skip when later steps are independent: the rest of the work still gets done.

skip and continue do not make the workflow succeed. The run ends as failed with exit code 1 and an empty reason (None).

With the default fail, steps that do not depend on the failed step can already have run, because steps without dependencies start together. In our test, independent ran before boom was reported.

Retrying is a different key. See Retry a failing step.

##### 06Find the Error Scope in Studio

###### Objective

Drop the container on the canvas.

###### Actions

Open a workflow in Hydra Studio, in the Workflow configuration tab.

In the node palette, open Containers and drag Error Scope onto the canvas.

Read the box that appears and the panel on the right.

palette → Containers → Error Scope

The palette has three containers: Sequence Container, Error Scope and Retry Scope. The Error Scope is a red dashed box with the line On child failure and a list, set to skip in our test. The panel on the right gives the box a step name (container_2 here) and an On failure list like the one of any other step.

What you should see
A red box named Error Scope with its On child failure list.

[image: The Hydra Studio workflow editor with an Error Scope container dropped on the canvas, showing the line On child failure set to skip, and the container panel on the right.]

The Error Scope container on the canvas.

#### What should I have at the end?

VerificationExpected result

Keyon_failure on a step

Valuesfail (default), skip, continue

failstops the workflow, the rest is not run

skipskips the steps that depend on it

continueruns them anyway

Resultany failed step makes the workflow fail

#### What if something goes wrong?

SymptomCauseFix

Input should be 'fail', 'skip' or 'continue'Another value was writtenUse one of the three values

FAILED … — NoneA step failed under skip or continueRead the failed step above it

#### Frequently asked questions

##### What does on_failure do in a Hydra ETL workflow?

It sets what happens to the rest of the workflow when this step fails. The values are fail (the default), skip and continue. In our test on Hydra ETL 0.22, fail stopped the workflow and left the steps after it unrun, skip ran the steps that did not depend on the failed step, and continue also ran the steps that did.

##### What is the difference between skip and continue?

With skip, the steps that depend on the failed step are skipped. With continue, they run anyway. In both cases the steps that do not depend on it run, in our test.

##### Does the workflow succeed when I use skip or continue?

Not in our test. With skip and with continue the run still ended as FAILED, with exit code 1 and an empty reason (None), because one step had failed. According to the source, the workflow succeeds only if every step succeeded.

##### How does the Error Scope container of Studio relate to this?

According to the Studio source (workflowSerializer.ts), an Error Scope copies its on_failure value onto each step it contains, so the YAML carries the same key. We did not test dragging steps into the container.

##### What does Hydra ETL say when the value is wrong?

Validation refuses it and lists the three values: Input should be 'fail', 'skip' or 'continue'.

##### Is there an Error Scope in Hydra Studio?

Yes. The Containers group of the node palette has an Error Scope; dropped on the canvas, it shows an On child failure list, set to skip in our test.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Retry a failing step

Branch with the Condition node

Diagnose a failed run

#### Next lesson

One key, three values. Not covered here: dragging steps into an Error Scope in Studio, and failures inside a job step.

Next: retry a failing step →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Import a job into a Hydra ETL workflow — slug: /studio/import-a-job-into-a-workflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons10 · Import a job▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 22

Lesson 22 of 65 · Import a job

### Import a job into a Hydra ETL workflow

Import a job folder into a workflow from the Import menu, save it into the project, and run it.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Importabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
The Import menu of the workflow editor takes a folder with four YAML files and adds a job node to the canvas. Save then writes the job into the jobs folder of the project and a step into the workflow file.

#### What will you learn in this lesson?

##### Goal

Check a job folder, import it, save the workflow, read what Save wrote, run it, and read the alert for a folder with a missing file.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a workflow open in the editor. The screenshots use the course project; the save and run tests used a new project from hdrctl init.

A job folder written elsewhere, with four YAML files at its root. The one below is called refunds-job.

#### How do I import a job into a workflow?

##### 01Check the job folder

###### Objective

Four files at the root.

###### Actions

Create a folder refunds-job with the four files below.

Run the validation on it.

hdrctl validate refunds-job

sources.yaml:

sources:
src_orders:
type: csv
extract:
table: data/orders.csv
batch_size: 50000

transformations.yaml:

steps:
- select:
columns: [order_id, customer, amount, status]
- filter:
expr: "status == 'refunded'"

destinations.yaml:

destinations:
dest_refunds:
type: csv
load:
table: ../../outputs/refunds.csv
mode: replace

pipeline.yaml:

pipeline:
from: src_orders
to: dest_refunds

What you should see
DSL valid, with no error.

ok sources.yaml — Pydantic valid
ok destinations.yaml — Pydantic valid
ok transformations.yaml — Pydantic valid
ok pipeline.from — resolved: src_orders
ok pipeline.to — resolved: dest_refunds

✅ DSL valid — no errors detected.

##### 02Open the Import menu

###### Objective

It lives in the workflow tab.

###### Actions

Open your workflow in Studio.

Select the Workflow configuration tab.

Select Import, then Import a job.

Import → Import a job

The menu has one entry. It opens the folder picker of your system, which no screenshot can show: choose the job folder itself, not its parent.

What you should see
The folder picker opens.

[image: The Import menu of the workflow editor, open under the toolbar, with one entry named Import a job and the hint Select a job folder (4 YAML files) and add a node to the canvas.]

The Import menu.

##### 03Read the new node

###### Objective

The folder name becomes the label.

###### Actions

Pick the refunds-job folder.

Look at the right of the canvas.

refunds-job

A job node named after the folder appears, and the job joins the Jobs list of the palette. The grey line under the name is an internal id, job_ followed by a number. A small red alert icon sits on the node. Nothing is saved yet: according to the source, the import only builds the job in the editor until you save.

What you should see
A third node on the canvas.

[image: The workflow canvas after importing the folder refunds-job: a third job node named refunds-job sits to the right of first-job and second-job, with a small red alert icon, and refunds-job is listed under Jobs in the palette.]

The imported job, next to the two jobs of the course project.

##### 04Save and read what was written

###### Objective

Test it in a new project.

###### Actions

Select Save (we did this in a new project, not in the course project).

Open the project folder.

Save

Save wrote the job into jobs/refunds-job. Studio rewrites the four files rather than copying them: in our test they start with version: '1.0', the source and the destination gain connection: {}, and pipeline.yaml gains a name and transformations: transformations. Save also added a step to the workflow file, with a generated name. The data folder of the original job is not copied.

steps:
- name: job1
type: job
job: ../jobs/job1
- name: job_1795508669807
type: job
job: ../jobs/refunds-job

What you should see
jobs/refunds-job with four files, and a second step in the workflow.

jobs\job1
jobs\refunds-job
destinations.yaml
pipeline.yaml
sources.yaml
transformations.yaml

##### 05Add the data and run it

###### Objective

The job needs its input file.

###### Actions

Put an orders.csv in jobs/refunds-job/data.

Run the workflow from the project folder.

hdrctl workflow run workflows\workflow1.yaml

Both steps ran. The new job wrote outputs/refunds.csv, the path of its destination, relative to the job folder.

What you should see
Both steps OK.

✓ Step 'job1' OK (1.9s)
✓ Step 'job_1795508669807' OK (2.0s)

✅ Workflow 'workflow1' completed in 2.0s — 2/2 steps OK

##### 06Read the alert for a missing file

###### Objective

Try a folder with three files.

###### Actions

Copy the folder without transformations.yaml.

Import it.

Import → Import a job

Studio shows a browser alert, not a message in the page, and imports nothing. Close it and fix the folder.

What you should see
An alert that lists the missing file.

Missing files at the folder root:
transformations.yaml

###### Tips and tricks

Run hdrctl validate on the folder first: Import reads the four files, so a valid folder avoids surprises.

Copy the data folder yourself when you import a job into another project.

Only the four files at the root of the folder are read. Files in sub-folders are ignored, according to the source.

The step name is generated (job_ and a number), so a log that names it does not name your job. Rename it in the workflow file if you want a readable log.

The red alert icon stayed on the node after Save in our test, although the workflow validated and ran. Trust the validation and the run, not the icon.

#### What should I have at the end?

VerificationExpected result

MenuWorkflow configuration → Import → Import a job

Foldersources, transformations, destinations, pipeline (.yaml) at its root

Resulta node named after the folder, not saved yet

Savewrites jobs/NAME and a step job: ../jobs/NAME

Not copiedthe data folder

#### What if something goes wrong?

SymptomCauseFix

Missing files at the folder root: transformations.yamlA required file is not at the root of the chosen folderAdd the file, or choose the job folder itself

Small red icon on the imported nodeStudio does not see a job path on the nodeIt stayed after Save in our test; validate and run to be sure

#### Frequently asked questions

##### How do I bring a job written elsewhere into a Hydra ETL workflow?

Open the workflow in Studio, choose the Workflow configuration tab, then Import and Import a job, and pick the job folder. In our test on Hydra ETL 0.22, the folder refunds-job, with four YAML files at its root, added a node of the same name to the canvas.

##### Which files does the folder need?

Four files at its root: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. With transformations.yaml missing, Studio showed an alert that lists the missing file and added nothing.

##### What does Save write?

In our test, Save created the folder jobs/refunds-job in the project with the four files, rewritten by Studio (they start with version: '1.0' and the source and destination gain connection: {}), and added a step to the workflow file that points to ../jobs/refunds-job. The data folder of the original job is not copied.

##### What is the name of the step that Import creates?

A generated name, job_ followed by a number (job_1795508669807 in our test), not the name of the folder. The node label shows the folder name.

##### Does the imported job run?

Yes, once its data is in place. We copied an orders.csv into jobs/refunds-job/data and ran the workflow: both steps were OK in 2.0 seconds and the output file refunds.csv was written.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Compose jobs

Handle a failing step with on_failure

Manage projects

#### Next lesson

One menu entry, four files, one Save. Not covered here: renaming the generated step, and what a close without Save does.

Back to Create a workflow →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Install Hydra ETL and start Hydra Studio with hdrctl serve — slug: /studio/install-and-start/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons01 · Install and start▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 1

Lesson 1 of 65 · Install and start

### Install Hydra ETL and start Hydra Studio with hdrctl serve

Two commands install Hydra ETL with its server extra and start Studio. Check the version, read the banner, then open the address it prints.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl serveabout 10 minutesPython 3.9 or newer

Quick answer
Install Hydra ETL with pip install "hydra-etl[server]", then run hdrctl serve. Studio starts at http://127.0.0.1:5678. The server extra adds the API and the web interface; without it the command line works but Studio does not start.

#### What will you learn in this lesson?

##### Goal

Create a virtual environment, install Hydra ETL 0.22 with its server extra, start Studio and confirm it is up.

##### Prerequisites

Python 3.9 or newer, available as py on Windows.

A terminal: PowerShell on Windows.

An internet connection to download the package from PyPI.

#### How do I install Hydra ETL and open Studio?

##### 01Check Python

###### Objective

Know which Python the next commands will use.

###### Actions

Open PowerShell.

Run the command below.

py --version

Hydra ETL needs Python 3.9 or newer. On Windows, the py launcher picks the installed Python. On Linux and macOS the same commands use python3 and a bin/ folder in place of Scripts\; this lesson was run on Windows only.

What you should see
A version number of 3.9 or higher.

Python 3.13.7

##### 02Create a virtual environment

###### Objective

Keep Hydra ETL and its dependencies apart from the rest of your Python.

###### Actions

Choose a folder for the environment.

Run the command below.

py -m venv hydra-env

A virtual environment is a folder that holds its own Python packages. Removing the folder removes the installation, which makes a clean start easy.

What you should see
No output. A hydra-env folder now exists.

##### 03Install Hydra ETL with the server extra

###### Objective

Get the engine, the command line, the API and Studio in one install.

###### Actions

Run the command below and wait for pip to finish.

hydra-env\Scripts\python.exe -m pip install "hydra-etl[server]"

The quotes protect the square brackets. pip downloads hydra-etl and its dependencies, among them pandas, FastAPI and uvicorn. Without [server] you get the engine and the hdrctl command only.

What you should see
pip ends with a line that lists the installed packages, including hydra-etl.

Installing collected packages: … hydra-etl, fastapi
Successfully installed … hydra-etl-0.22.0 …

##### 04Check the installation

###### Objective

Confirm which version answers.

###### Actions

Run the command below.

hydra-env\Scripts\hdrctl.exe --version

The command prints the version of Hydra ETL, the name of the framework and the Python it runs on.

What you should see
The version, then the Python version, on one line.

hydra 0.22.0 | Hydra ETL Framework | Python 3.13.7

[image: The terminal of Hydra Studio in the dark theme showing hdrctl --version and its result, Hydra ETL 0.22.0 on Python 3.13.7.]

The same command, run from the Studio terminal.

##### 05Start Studio

###### Objective

Start the API and the web interface with one command.

###### Actions

Run the command below.

Leave the window open: closing it stops Studio.

hydra-env\Scripts\hdrctl.exe serve

hdrctl serve starts the Hydra API and Studio on one port. The default port is 5678, on 127.0.0.1, and the projects live in ~/hydra-workspace. Add --port 5679 to use another port, --workspace to choose the projects folder, --open to open your browser and --no-studio to serve the API alone.

What you should see
An ASCII banner, then the address to open and the API and docs addresses. Press Ctrl+C to stop.

Hydra Studio is ready. Open this address in your browser:

http://127.0.0.1:5678

API http://127.0.0.1:5678/api
Docs http://127.0.0.1:5678/docs

Press CTRL+C to stop.

##### 06Open Studio and check the API

###### Objective

Confirm that the page and the API both answer.

###### Actions

Open http://127.0.0.1:5678 in your browser.

In another PowerShell window, run the command below.

curl.exe http://127.0.0.1:5678/api/health

Studio opens on the Overview page. The top bar shows API online when the backend answers. The health route returns a small JSON document with the version and the build of the bundled Studio. Check the API explains the indicator in detail.

What you should see
The Overview page with a project list, and a JSON answer with status set to ok.

{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0","studio":"bundled","studio_build":"index-CxM6JVFV.js"}

[image: The Overview page of Hydra Studio in the light theme, with the project list showing the sample project hydra-demo, the Get started card and the API online indicator in the top bar.]

Studio on a new workspace: the sample project hydra-demo is listed.

###### Tips and tricks

Use --workspace to keep course projects apart from your other work, for example hdrctl serve --workspace C:\data\studio.

Run hdrctl serve --help to list every option.

Closing the window that runs hdrctl serve stops Studio. The browser page stays open but its data stops loading.

Port 5678 busy? Start Studio on another port with --port and open that address instead.

#### What should I have at the end?

VerificationExpected result

Python3.9 or newer

Installpip finishes without an error and lists hydra-etl 0.22.0

Versionhdrctl --version prints 0.22.0

StudioThe Overview opens at http://127.0.0.1:5678 and the health route returns status ok

#### What if something goes wrong?

SymptomCauseFix

hdrctl is not recognizedThe environment is not on the pathCall it with its full path, hydra-env\Scripts\hdrctl.exe

The page does not loadThe server is not running or uses another portRead the address in the banner, and keep the window open

Studio does not start after installThe package was installed without the server extraInstall "hydra-etl[server]"

pip cannot find the packageNo internet access or an old pipCheck the connection, then run python -m pip install --upgrade pip

#### Frequently asked questions

##### How do I install Hydra ETL and start Studio?

Create a virtual environment, install the package with its server extra using pip install "hydra-etl[server]", then run hdrctl serve. Studio opens at http://127.0.0.1:5678. On Windows, use py -m venv to create the environment.

##### Which Python version does Hydra ETL need?

Python 3.9 or newer, according to the package metadata. In our test of Hydra ETL 0.22.0 we used Python 3.13.7 on Windows.

##### Why install the server extra?

The base package gives you the engine and the hdrctl command line. The server extra adds the API and the web interface that hdrctl serve starts, so Studio needs it.

##### How do I start Studio on another port?

Add --port to the command, for example hdrctl serve --port 5679. Other options are --host, --open to open the browser, --no-studio for the API alone, --workspace for the projects folder and --lang for the interface language.

##### Where does Studio keep my projects?

In the workspace folder, ~/hydra-workspace by default. Pass --workspace to choose another folder. A new workspace gets a sample project named hydra-demo.

#### Related lessons

Check the Studio API connection

Tour the Studio pages

Get started with Hydra ETL

The hdrctl command line

#### Next lesson

Studio is running. The next lessons create a project and read the interface.

Create a project →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Run Log, Python and shell actions in a Hydra Studio workflow — slug: /studio/log-python-and-shell-actions/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons19 · Actions 1▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 26

Lesson 26 of 65 · Actions 1

### Run Log, Python and shell actions in a Hydra Studio workflow

Actions run work that is not a job: write a log line, run Python, or call PowerShell. Build a three step workflow and read each message in the run.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Actionsabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A Hydra workflow runs an action as a step: log writes a message, python runs a script on any system, powershell runs a command on Windows and bash on Linux or macOS. In our test, a log, a Python and a PowerShell step ran in 0.6 seconds.

#### What will you learn in this lesson?

##### Goal

Read three action dialogs, write a workflow that chains a log, a Python and a PowerShell step, and run it.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

PowerShell on Windows. Bash steps need Linux or macOS and were not run in this lesson.

#### How do I run actions in a Hydra workflow?

##### 01Open the Log action

###### Objective

Start with the simplest action.

###### Actions

Open a workflow in Workflow configuration.

In the palette, expand Actions.

Drag Log onto the canvas and double-click it.

Palette → Actions → Log

The Log action writes one message to the run. Its dialog has a step name, an On failure list, a Run condition (when) and the Message. Every action shares this frame.

What you should see
A dialog whose subtitle says it writes a message to the run logs.

Log ACTION Writes a message to the run logs

[image: The Log action dialog of Hydra Studio in the light theme, with a step name, an on-failure list, a run condition and a message field.]

The Log dialog.

##### 02Open the Python action

###### Objective

See the one action that runs on every system.

###### Actions

Drag Python onto the canvas and double-click it.

Select Inline script, then .py file.

Palette → Actions → Python

Python takes an inline script or the path of a .py file, plus an optional working directory and a timeout of 60 seconds by default. It has no platform badge: it runs on Windows, Linux and macOS.

What you should see
A code editor for the inline script, and a path field for the file.

Python ACTION Inline script · .py file

[image: The Python action dialog of Hydra Studio in the dark theme, in Inline script mode, with a code editor, a working directory and a timeout.]

The Python dialog, inline mode.

##### 03Open the PowerShell action

###### Objective

Know what a shell action asks for, and when it is dimmed.

###### Actions

Drag PowerShell onto the canvas and double-click it.

Read the PowerShell command, Working directory and Timeout fields.

Palette → Actions → PowerShell

On Windows, PowerShell is active and Bash is dimmed in the palette; on Linux or macOS the pair is reversed. The dialog says Runs a PowerShell script (Windows). The Bash action takes a Bash command in the same way but was not run here, because this lesson was tested on Windows.

What you should see
A dialog with a required command field, a working directory with a Browse button, and a timeout.

PowerShell ACTION Runs a PowerShell script (Windows)

[image: The PowerShell action dialog of Hydra Studio in the light theme: step name, on failure list, run condition, the required PowerShell command field, working directory with a Browse button, timeout, and the Undo section.]

The PowerShell dialog.

##### 04Write a workflow with three actions

###### Objective

See the three actions as YAML.

###### Actions

Create a folder actions-demo with a workflows folder inside.

Save the YAML below as workflows\wf_actions.yaml.

workflows\wf_actions.yaml

Each step has type: action, an action name and a params block, and depends on the previous step. The Python script uses a YAML block (|) so that it can span lines.

version: "1.0"
workflow:
name: wf_actions
trigger:
type: manual
steps:
- name: say_hello
type: action
action: log
params:
message: "Hello from the log action"
- name: run_python
type: action
action: python
params:
script: |
import sys
print("Python", sys.version.split()[0])
depends_on: [say_hello]
- name: run_powershell
type: action
action: powershell
params:
command: Write-Output "Hello from PowerShell"
depends_on: [run_python]

What you should see
A file of 25 lines.

##### 05Validate and run

###### Objective

See the three messages in the run.

###### Actions

Open a terminal in the actions-demo folder.

Run the two commands below, one after the other.

hdrctl workflow validate workflows\wf_actions.yaml
hdrctl workflow run workflows\wf_actions.yaml

Validation prints a confirmation. The run then executes the three steps in order and shows each message under its step.

What you should see
Three steps OK, each followed by its message, and a summary line.

Workflow valid — no errors detected.

Workflow wf_actions

✓ Step 'say_hello' OK (0.0s)
| Hello from the log action
✓ Step 'run_python' OK (0.1s)
| Python 3.13.7
✓ Step 'run_powershell' OK (0.4s)
| Hello from PowerShell

Workflow 'wf_actions' completed in 0.6s — 3/3 steps OK

[image: The Hydra Studio terminal in the dark theme after running wf_actions: the log, Python and PowerShell steps are OK, each followed by its message, and the workflow completed in 0.6s with 3 of 3 steps OK.]

The same run, from the Studio terminal.

###### Tips and tricks

Use Python when a workflow must run on several systems: it is the only script action that does not depend on the host.

Keep long scripts in a .py file and point file_path at it.

A shell action fails on the wrong system: PowerShell needs Windows, Bash needs Linux or macOS.

Chain steps with depends_on, otherwise they may run side by side.

#### What should I have at the end?

VerificationExpected result

DialogsLog, Python and PowerShell share the same frame

Validationhdrctl workflow validate prints Workflow valid

RunThree steps OK, each with its message

TotalThe workflow completes with 3/3 steps OK

#### What if something goes wrong?

SymptomCauseFix

The Bash action is dimmedYou are on WindowsUse PowerShell, or Python for a portable step

The Python step failsThe script raises an error or exceeds the timeoutRun the script alone, then raise timeout if needed

No message under a stepThe step printed nothingPrint or write a log message from the step

Workflow file not foundThe path is wrongRun the command from the folder that holds workflows

#### Frequently asked questions

##### What actions can a Hydra workflow run?

Hydra ETL 0.22 has eleven actions: bash, powershell, python, ssh, webhook, email, log, delay, condition, set_param and assign_param. A step runs one of them with type action, an action name and a params block.

##### How do I run a Python script in a workflow?

Use the python action with an inline script in params.script, or a .py file in params.file_path. Optional keys are working_dir and timeout, which defaults to 60 seconds.

##### Why is the Bash action unavailable on Windows?

Each shell action is tied to an operating system: Bash runs on Linux and macOS, PowerShell on Windows. The palette shows the other one dimmed. Use Python when a step must run everywhere.

##### Where does the output of a step go?

The log action writes its message to the run, and a Python or PowerShell step shows what it prints under the step. In our test each message appeared right below its step.

##### What does On failure do?

Every action dialog has an On failure list whose default is fail. It decides what the workflow does when the step fails. The Resolve conflicts and recover lessons cover the other choices.

#### Related lessons

Use the node palette

Wait with the Delay node

Branch with the Condition node

Compose jobs in a workflow

#### Next lesson

You can run scripts and log messages from a workflow. Next, call a service or reach another machine with the Webhook, Email and SSH actions.

Compose jobs →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Send a webhook and an email from a Hydra ETL workflow — slug: /studio/notify-with-webhook-and-email-actions/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons20 · Actions 2▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 27

Lesson 27 of 65 · Actions 2

### Send a webhook and an email from a Hydra ETL workflow

Two actions tell the outside world that a workflow ran: webhook calls a URL, email sends a message. Test both against a local server.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

webhook, emailabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
The webhook action sends an HTTP request to a URL, and the email action sends a message through an SMTP server. Both are steps of type action, and a refused call or a closed port fails the step. In Studio, double-click the node to edit the same parameters in a dialog.

#### What will you learn in this lesson?

##### Goal

Start a local test server, send a webhook with a header and a JSON body, send an email, and read what each failure looks like. Then open both nodes in Studio to see the same parameters as forms.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project: hdrctl init act2-demo. Workflow files go in act2-demo/workflows.

Python, for the local test server. Nothing leaves your machine.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I send a webhook and an email from a workflow?

##### 01Start a local test server

###### Objective

Something to call.

###### Actions

Save the script below as mock_services.py, next to the project folder.

Run it in a second terminal and leave it open.

py mock_services.py

The script listens for HTTP on port 8099 and for SMTP on port 1025. It writes each HTTP request to requests.log and each email to mail.txt. It answers 404 on any path that starts with /missing.

import json, socketserver, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
class H(BaseHTTPRequestHandler):
def do_POST(self):
n = int(self.headers.get("Content-Length") or 0)
body = self.rfile.read(n).decode("utf-8")
with open("requests.log", "a", encoding="utf-8") as f:
f.write(f"{self.command} {self.path} | X-Demo={self.headers.get('X-Demo')} | Content-Type={self.headers.get('Content-Type')} | body={body}\n")
code = 404 if self.path.startswith("/missing") else 200
out = b'{"ok": true}' if code == 200 else b'{"error": "not found"}'
self.send_response(code); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(out)
def log_message(self, *a): pass
class S(socketserver.StreamRequestHandler):
def handle(self):
w = lambda s: (self.wfile.write((s + "\r\n").encode()), self.wfile.flush())
w("220 mock ready")
data, indata = [], False
while True:
line = self.rfile.readline()
if not line: return
t = line.decode("utf-8", "replace").rstrip("\r\n")
if indata:
if t == ".":
open("mail.txt", "a", encoding="utf-8").write("\n".join(data) + "\n=====\n"); data, indata = [], False; w("250 queued")
else: data.append(t)
continue
u = t.upper()
if u.startswith(("EHLO", "HELO")): w("250 mock")
elif u.startswith(("MAIL", "RCPT")): w("250 ok"); data.append("## " + t)
elif u == "DATA": w("354 go"); indata = True
elif u == "QUIT": w("221 bye"); return
else: w("250 ok")
class T(socketserver.ThreadingMixIn, socketserver.TCPServer): allow_reuse_address = True
threading.Thread(target=lambda: T(("127.0.0.1", 1025), S).serve_forever(), daemon=True).start()
HTTPServer(("127.0.0.1", 8099), H).serve_forever()

What you should see
No output: the script waits.

(nothing printed)

##### 02Send a webhook

###### Objective

Write the step.

###### Actions

Create workflows/wf-hook.yaml with the content below.

Run it.

hdrctl workflow run workflows\wf-hook.yaml

headers and body are text that holds JSON. The method is POST unless you set another one.

version: "1.0"
workflow:
name: wf-hook
trigger:
type: manual
steps:
- name: notify
type: action
action: webhook
params:
url: http://127.0.0.1:8099/hook
method: POST
headers: "{\"X-Demo\": \"yes\"}"
body: "{\"event\": \"load_done\", \"rows\": 14}"

What you should see
The step is OK. The success line has no message from the server.

✓ Step 'notify' OK (0.1s)

✅ Workflow 'wf-hook' completed in 0.1s — 1/1 steps OK

##### 03Check what the server received

###### Objective

Read requests.log.

###### Actions

Open requests.log, written by the test server.

type requests.log

The server received the header and the body, and the content type is JSON.

What you should see
One line with the header and the body.

POST /hook | X-Demo=yes | Content-Type=application/json | body={"event": "load_done", "rows": 14}

##### 04Read the webhook errors

###### Objective

Four cases.

###### Actions

Change url to http://127.0.0.1:8099/missing and run it.

Change it to a port nobody listens on, 8097.

Set headers to "{not json".

Remove url.

hdrctl workflow run workflows\wf-hook.yaml

The first three fail during the run. The last one is refused before the run starts. The text of the connection error is in the language of your Windows: ours was French, so we show only its first part.

What you should see
Four different messages.

✗ Step 'notify' FAILED: HTTPError: HTTP Error 404: Not Found
✗ Step 'notify' FAILED: URLError:
✗ Step 'notify' FAILED: ValueError: Action webhook 'notify': 'headers' is not valid JSON (Expecting property name enclosed in double quotes: line 1 column 2 (char 1))

❌ Invalid workflow: ...
- steps.0: Step 'notify': action 'webhook' requires parameter 'url'

##### 05Send an email

###### Objective

Same shape, other action.

###### Actions

Create workflows/wf-mail.yaml with the content below.

Run it.

hdrctl workflow run workflows\wf-mail.yaml

Without smtp_host and smtp_port, the action uses localhost and port 1025, according to the source. Add username, password and use_tls: true for a real server: we did not test them.

version: "1.0"
workflow:
name: wf-mail
trigger:
type: manual
steps:
- name: send_mail
type: action
action: email
params:
smtp_host: 127.0.0.1
smtp_port: 1025
from_addr: hydra@example.test
to: team@example.test
subject: "Load finished"
body: "14 rows were written."

What you should see
The step is OK in about 1.5 seconds.

✓ Step 'send_mail' OK (1.5s)

##### 06Check the email and its failures

###### Objective

Read mail.txt.

###### Actions

Open mail.txt.

Run a workflow without to, then one with a closed port.

type mail.txt

The test server saved the sender, the recipient and the subject. The text of the body is encoded in base64, which is normal for an email in UTF-8. A missing to is refused before the run. A closed port fails the step.

What you should see
Sender, recipient, subject, then the error cases.

## mail from:
## rcpt to:
From: hydra@example.test
To: team@example.test
Subject: Load finished

❌ Invalid workflow: ...
- steps.0: Step 'send_mail': action 'email' requires parameter 'to'

✗ Step 'send_mail' FAILED: ConnectionRefusedError: [WinError 10061] ...

###### Tips and tricks

Put a webhook or an email at the end of a workflow, or on a failure branch, so that you hear about a run without opening Studio.

Use ${SECRET:name} for a token in headers and for an SMTP password: see Store and use secrets. We did not test a secret in these two parameters.

A webhook step succeeds on any 2xx answer, and the answer is not shown. A failing business result behind a 200 is not detected.

headers must be valid JSON text: one missing quote fails the step with is not valid JSON.

The SSH action needs a remote machine. This lesson does not cover it.

##### 07Open the Webhook action in Studio

###### Objective

See the same parameters as a form.

###### Actions

Open the workflow in Hydra Studio and double-click its Webhook node.

double-click the Webhook node

The dialog is titled Webhook, Outgoing HTTP call. The first three fields are common to every action: step name, On failure (default fail) and a run condition. Below them come the four parameters of the YAML: URL (marked required), Method (a list starting with POST), Body (JSON) and Headers (JSON). Each text field has an {x} button to insert a parameter or a secret reference.

What you should see
The URL http://127.0.0.1:8099/hook and the body of the YAML, in the fields.

[image: The Webhook action dialog of Hydra Studio with the step name notify, the URL, the POST method and the JSON body filled in.]

The Webhook dialog.

##### 08Open the Email action in Studio

###### Objective

Same idea for the email.

###### Actions

Open the workflow with the Email node and double-click the node.

double-click the Email node

The dialog is titled Email, Send email. Recipient and Subject are required; then come Body, Sender (From), SMTP server, SMTP port, SMTP user, SMTP password and a TLS (STARTTLS) list set to false by default. Scroll the dialog to reach the SMTP fields.

What you should see
Recipient team@example.test and subject Load finished.

[image: The Email action dialog of Hydra Studio with the step name send_mail, the recipient, the subject and the body filled in.]

The Email dialog.

#### What should I have at the end?

VerificationExpected result

Webhookaction: webhook, params: url, method, headers, body

Emailaction: email, params: smtp_host, smtp_port, to, subject, body

Requiredurl (webhook), to (email)

Testlocal server on 8099 (HTTP) and 1025 (SMTP)

#### What if something goes wrong?

SymptomCauseFix

HTTPError: HTTP Error 404: Not FoundThe server has no such pathCheck the url

URLError / ConnectionRefusedErrorNothing listens on that host and portStart the server, or fix host and port

'headers' is not valid JSONThe text is not a JSON objectWrite it as {"Name": "value"}

requires parameter 'url' / 'to'A required parameter is missingAdd it in params

#### Frequently asked questions

##### How do I call a URL from a Hydra ETL workflow?

Add a step of type action with action webhook and the params url, method, headers and body. The step sends the request and succeeds when the server answers with a 2xx status. In our test on Hydra ETL 0.22 on Windows, a POST with a JSON body reached a local server in 0.1 seconds.

##### How do I write headers and body in the YAML?

As text that holds JSON, for example headers: "{\"X-Demo\": \"yes\"}". Studio saves them that way. According to the source, a YAML object is accepted too, but we tested the text form only. The request always carries Content-Type: application/json.

##### What happens when the server answers 404 or is down?

The step fails with the error of the HTTP client: HTTPError: HTTP Error 404: Not Found, or URLError with the connection error. The text of a connection error follows the language of your system.

##### How do I send an email from a workflow?

Use action email with smtp_host, smtp_port, to, subject and body. It sends through an SMTP server. We tested it against a local test server on port 1025, and the message arrived with the right sender, recipient and subject.

##### Which parameters are required?

url for a webhook and to for an email. Without them, hdrctl workflow run stops before the run with: action 'webhook' requires parameter 'url', or action 'email' requires parameter 'to'.

##### Can I configure the webhook and email actions in Hydra Studio?

Yes. Double-clicking the node opens a dialog with the same parameters as the YAML: URL, method, body and headers for the webhook; recipient, subject, body and SMTP settings for the email.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Log, Python and shell actions

Start a project from a webhook

Resolve conflicts and recover

#### Next lesson

Two actions that reach outside the workflow. Not covered here: SSH, and a real SMTP server with a login.

Back to Actions 1 →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Orchestrate a Hydra project from thread.yaml — slug: /studio/orchestrate-from-thread-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons47 · thread.yaml▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 59

Lesson 59 of 65 · thread.yaml

### Orchestrate a Hydra project from thread.yaml

thread.yaml orders the workflows of a Hydra project. Read every key, validate the file with a dry run, and learn the four messages you will meet when it is wrong.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

thread.yamlabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
workflows/thread.yaml is the orchestration file of a Hydra project: a list of stages, each with a mode and its workflows, plus optional loops. Validate it with hdrctl run . --dry-run, which prints the plan and runs nothing.

#### What will you learn in this lesson?

##### Goal

Read the keys of thread.yaml, validate a full example with a dry run, and read four error messages.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I orchestrate a project from thread.yaml?

##### 01Read the keys

###### Objective

Know what the file can say.

###### Actions

Open workflows/thread.yaml of a project.

Match each line with the table below.

workflows\thread.yaml

LevelKeys

Fileversion, thread, loops

Stagemode (sequential or parallel), delay_after, workflows

Workflowname, active, delay_before, timeout, fallback

Fallbackuse, when, on_failure, on_probe_error

Loopfrom, to, times, delay

The keys come from the thread model of Hydra ETL 0.22. This example uses most of them; each name is a file of workflows:

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- mode: parallel
delay_after: 1s
workflows:
- name: load_sales
timeout: 30s
fallback:
use: [cleanup]
on_failure: true
- name: load_stock
delay_before: 2s
- mode: sequential
workflows:
- name: report

What you should see
A file with three stages, a timeout, a fallback and a wait.

##### 02Validate with a dry run

###### Objective

See the plan before anything runs.

###### Actions

Open a terminal in the project folder.

Run the command below.

hdrctl run . --dry-run

A dry run loads thread.yaml and every workflow it names, then prints the plan. Waits, timeouts and fallbacks appear under their workflow. For stages see Stages, for loops Repeat workflows with loops.

What you should see
The three stages, a timeout line, a fallback line, a wait line, and Dry run OK.

Execution plan
Stage 1/3 — sequential
• prepare (1: say_prepare)
Stage 2/3 — parallel then wait 1s
• load_sales (1: work_load_sales)
⌛ timeout 30s: beyond it, the workflow fails
↪ fallback: cleanup (on failure)
• load_stock (1: work_load_stock)
◷ waits 2s before starting (after the stage starts)
Stage 3/3 — sequential
• report (1: say_report)

Dry run OK: the project is valid. Nothing was executed.

[image: The Studio terminal after hdrctl run with the dry-run option on a project with three stages: the plan lists each workflow, a timeout of 30s, a fallback named cleanup on failure, and a wait of 2s before a workflow starts.]

The plan printed by the dry run.

##### 03Read the error messages

###### Objective

Recognize the four common mistakes.

###### Actions

Break the file on purpose, one change at a time, and run the dry run again.

Compare each message with the table below.

hdrctl run . --dry-run

Each message starts with workflows/thread.yaml and a position. Positions count from zero: thread.1 is the second stage and workflows.1 the second workflow of that stage.

ChangeMessage

modee instead of modethread.1.modee: Extra inputs are not permitted

delay_before: 5xthread.1.workflows.1.delay_before: invalid delay '5x' (use a number of seconds or 30s, 5m, 1h)

A loop that goes forwardloop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)

times: 0loops.0.times: Input should be greater than or equal to 1

What you should see
A red line Project … cannot run followed by an err line with the message.

Project 'thread-demo-loop' cannot run:
err — workflows/thread.yaml: loop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)

[image: The Studio terminal after hdrctl run with the dry-run option on a thread whose loop goes forward: a message says the project cannot run because report must come before prepare in the thread.]

A loop that goes forward is refused.

##### 04Edit it in Studio instead

###### Objective

Use the visual editor for the same file.

###### Actions

Open Settings → Project settings → Execution order.

Use Define, Preview and Check.

Execution order

The Execution order tab edits this same file. See Define, Preview and Check.

What you should see
The tab header shows workflows/thread.yaml.

Execution order workflows/thread.yaml

###### Tips and tricks

Run hdrctl run . --dry-run before the first real run and after every edit of the file.

Read the position in a message from zero: thread.1.workflows.1 is the second workflow of the second stage.

hdrctl workflow validate rejects thread.yaml with unknown key 'thread': it validates workflow files only.

A typo in a key is an error, not a silent default: keys that the model does not know are refused.

#### What should I have at the end?

VerificationExpected result

PlanThe dry run prints stages, waits, timeouts and fallbacks

ValidDry run OK says nothing was executed

InvalidProject cannot run, then one err line per problem

StudioExecution order edits the same file

#### What if something goes wrong?

SymptomCauseFix

Extra inputs are not permittedA key is misspelled or misplacedCompare with the key table above

invalid delayThe value is not a number or 500ms, 30s, 5m, 1hRewrite the delay

must come beforeA loop goes forwardSwap from and to

Workflow has no fileA name does not match a file in workflowsCreate the file or fix the name

#### Frequently asked questions

##### What is thread.yaml in a Hydra project?

thread.yaml is the file workflows/thread.yaml. It lists the workflows of a project in stages, each sequential or parallel, with optional waits, timeouts, fallbacks and loops. hdrctl run reads it, and so does the Execution order tab of Studio.

##### How do I validate thread.yaml?

Run hdrctl run . --dry-run in the project folder. It validates the thread and every workflow it names, prints the execution plan, and runs nothing. hdrctl workflow validate does not accept thread.yaml: it expects a workflow file.

##### What formats do delays and timeouts accept?

A number of seconds, or a duration written as 500ms, 30s, 5m or 1h. In our test 1s, 2s and 30s were accepted and 5x was rejected with a message listing the valid formats.

##### Which keys does a stage accept?

A stage accepts mode, delay_after and workflows. A workflow accepts name, active, delay_before, timeout and fallback. Any other key is rejected: our typo modee was reported as an extra input that is not permitted.

##### What happens if workflows/thread.yaml does not exist?

Studio says that no thread.yaml exists yet and that the workflows run in alphabetical order until you save. This lesson did not test that case from the command line.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Define the execution order

Check the execution order

Dry run and --use-fallback

#### Next lesson

You can read, validate and fix thread.yaml. Next, see what starts a project with triggers.

Dry run →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Preview the execution order of a Hydra project — slug: /studio/preview-the-execution-order/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons28 · Execution order: Preview▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 35

Lesson 35 of 65 · Execution order: Preview

### Preview the execution order of a Hydra project

The Preview tab draws workflows/thread.yaml as a diagram: stages, parallel blocks, waits, loops and fallbacks. Read it before you run anything.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Previewabout 5 minutesHydra ETL 0.22 on Windows

Quick answer
Preview turns the execution order into a diagram that reads from left to right. Stages are columns, parallel workflows are stacked, a diamond is a wait, a dashed blue arrow is a loop and a dashed orange block is a fallback. Nothing is run.

#### What will you learn in this lesson?

##### Goal

Open Preview, read each symbol, and compare a plain thread with one that has a wait, a maximum duration and a fallback.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I preview the execution order?

##### 01Open Preview

###### Objective

See the thread as a diagram.

###### Actions

Open Settings → Project settings → Execution order.

Click Preview next to Define.

Execution order → Preview

The diagram follows the stages left to right: prepare, then load_sales and load_stock stacked, then report. A diamond labeled 1s sits between stage 2 and stage 3, and a dashed arrow goes back from report to prepare with the label ×2 and its own 1s pause.

What you should see
Four blocks, a diamond, and a dashed loop arrow.

prepare → [ load_sales / load_stock ] → ◇ 1s → report
╰─ loop ×2 · 1s ─ back to prepare

[image: The Preview tab of Execution order: boxes for prepare, load_sales, load_stock and report from left to right, the two loads stacked, a one second wait marker and a dashed loop arrow.]

The diagram of the Stages project, with a loop.

##### 02Read the legend

###### Objective

Learn the symbols.

###### Actions

Read the text under the diagram.

Match each symbol with the YAML key behind it.

thread.yaml

The legend says: stages run in order from left to right, stacked blocks run in parallel, a diamond is a wait before the next stage, a dashed blue arrow is a loop, and a dashed orange block under a workflow is its fallback. A clock on a block is a wait before it starts and an hourglass is its maximum duration. Behind them are delay_after, loops, fallback, delay_before and timeout.

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- mode: parallel
delay_after: 1s
workflows:
- name: load_sales
- name: load_stock
- mode: sequential
workflows:
- name: report
loops:
- from: report
to: prepare
times: 2
delay: 1s

What you should see
The same thread as the diagram.

##### 03See a wait, a timeout and a fallback

###### Objective

Compare with a richer thread.

###### Actions

Open the Preview of a thread like the one below.

Find the orange block under load_sales, the 30s badge and the 2s clock on load_stock.

Execution order → Preview

load_sales has timeout: 30s and a fallback that runs cleanup on failure. load_stock waits 2s before it starts. The diagram marks each one on its block.

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- mode: parallel
delay_after: 1s
workflows:
- name: load_sales
timeout: 30s
fallback:
use: [cleanup]
on_failure: true
- name: load_stock
delay_before: 2s
- mode: sequential
workflows:
- name: report

What you should see
A dashed orange block named cleanup labeled on failure, a 30s badge and a 2s badge.

load_sales ⌛ 30s
└ on failure → cleanup
load_stock ◷ 2s

[image: The Preview tab of a thread with a wait before a workflow, a maximum duration and a fallback workflow shown as a dashed orange block below load_sales.]

Wait, timeout and fallback in the diagram.

###### Tips and tricks

Open Preview after every structural change: a misplaced stage is obvious in a diagram and easy to miss in a list.

Use Preview to explain a project to someone else before sharing the YAML.

Preview draws the thread in the editor, saved or not. Save before you rely on it for a run.

A diagram cannot tell whether a workflow succeeds. Use Check for the files and --dry-run for the plan.

#### What should I have at the end?

VerificationExpected result

DiagramStages left to right, parallel blocks stacked

WaitsA diamond between stages, a clock on a block

LoopA dashed arrow with its passes and pause

FallbackA dashed orange block under its workflow

#### What if something goes wrong?

SymptomCauseFix

The diagram is emptyThe thread has no workflowAdd workflows in the Define tab

A block has no badgeNo wait or timeout is set on itSet wait or max in Define

The loop arrow is missingThe thread has no loopsAdd a loop in Define

Preview disagrees with the fileChanges are not savedSave, then reopen Preview

#### Frequently asked questions

##### What does the Preview tab show?

Preview draws the thread as a diagram, from left to right: one column per stage, parallel workflows stacked, waits as diamonds, loops as a dashed arrow and fallbacks as dashed blocks. It draws what is in the editor.

##### How do I see which workflows run in parallel?

Parallel workflows are stacked in the same column. In our project, load_sales sits above load_stock, between prepare and report.

##### What do the clock and hourglass mean?

The clock marks a wait before a workflow starts, and the hourglass its maximum duration. In our test the diagram showed 2s on load_stock and 30s on load_sales.

##### Does Preview run anything?

No. It only draws the thread. To rehearse the order from a terminal without running workflows, use hdrctl run with --dry-run.

##### Can I open a workflow from the diagram?

Yes, according to the legend under the diagram and the Studio source: a click on a block opens that workflow. This lesson did not click a block.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Define the execution order

Check the execution order

#### Next lesson

You can read an execution order at a glance. Next, check that every workflow in it exists.

Check the order →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Read the Insights statistics of Hydra Studio — slug: /studio/read-the-insights-statistics/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons16 · Insights▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 18

Lesson 18 of 65 · Insights

### Read the Insights statistics of Hydra Studio

The Insights page of Hydra Studio gives four run counters and an average duration. See what they count, how they match the Runs page, and what they leave out.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Insightsabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
Insights shows four counters (total, successful, failed and running runs) and the average duration of the runs, in seconds. In our test, three runs gave 3 total, 2 successful, 1 failed, 0 running and an average of 1.1 seconds. The server keeps these runs in memory only.

#### What will you learn in this lesson?

##### Goal

Start a few runs, read the Insights counters, match them with the Runs page, and learn what the page does not tell you.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages, and a workflow that fails on purpose.

#### What do the Insights statistics measure?

##### 01Start a few runs

###### Objective

Give Insights something to count.

###### Actions

Add a workflow that fails: save the file below as workflows\boom.yaml.

Run the project, then one workflow, then boom, from Studio.

Run Workflow

In our test the three runs were started through the Studio API (POST /api/runs): the project, then prepare, then boom. The same runs start from the run buttons of Studio.

version: "1.0"
workflow:
name: boom
trigger:
type: manual
steps:
- name: fail_on_purpose
type: action
action: python
params:
script: |
raise RuntimeError("boom")

What you should see
Three entries on the Runs page, one of them Failed.

project:insights-demo Success 4/4 3.1s
prepare Success 1/1 0.0s
boom Failed 0/1 0.1s

##### 02Open Insights

###### Objective

Read the counters.

###### Actions

Click Insights in the sidebar.

Insights

Four cards give Total runs, Successful, Failed and Running. A card below gives the Average duration in seconds. The page needs no setting and has no filter.

What you should see
3 total, 2 successful, 1 failed, 0 running, and an average of 1.1 s.

3 Total runs 2 ✓ Successful 1 ✗ Failed 0 ⟳ Running
Average duration: 1.1 s

[image: The Insights page of Hydra Studio in the light theme: four counters for total, successful, failed and running runs, and a card with the average duration in seconds.]

The Insights page after three runs.

##### 03Match them with the Runs page

###### Objective

See where the numbers come from.

###### Actions

Click Runs in the sidebar.

Compare the list with the counters, and the summary at the top right.

Runs

The Runs page lists the same three runs and says 3 total · 0 running · 2 success · 1 failed. The average is the mean of the three durations (3.1, 0.1 and 0.0 seconds), which is 1.1 seconds. Failed runs count in the average.

What you should see
Three rows, and the same totals as Insights.

3 total · 0 running · 2 success · 1 failed

[image: The Runs page of Hydra Studio in the dark theme, listing the executions whose statuses and durations feed the Insights counters.]

The Runs page behind the numbers.

##### 04Know the limits

###### Objective

Avoid reading too much into it.

###### Actions

Restart hdrctl serve and open Insights again.

Run a workflow from the terminal and compare.

hdrctl serve

After a restart the counters were back to zero, because the server holds its runs in memory. Runs started with hdrctl run in a terminal do not appear, and the page has no history, chart or per-workflow view.

What you should see
Zero everywhere after a restart.

0 Total runs 0 ✓ Successful 0 ✗ Failed 0 ⟳ Running
Average duration: — s

###### Tips and tricks

Use the Runs page to find which run failed, and Insights only for a quick health count.

Open a failed run from the Runs page to read its logs: see Review a run.

A zero on Insights after a restart does not mean nothing ran: the list of runs lives in memory.

The average includes failed runs, which are often very short. A failing workflow lowers it.

#### What should I have at the end?

VerificationExpected result

CountersTotal, successful, failed and running runs

AverageMean duration of the runs, in seconds

MatchThe Runs page shows the same totals

LimitCounters reset when the server restarts

#### What if something goes wrong?

SymptomCauseFix

Everything shows 0No run since the server started, or a restartRun a workflow from Studio

A terminal run is missingIt was not started through the serverStart it from Studio or the API

Average is —No run has a duration yetWait for a run to finish

Total is more than the other threeA run is pendingWait or open the Runs page, Pending tab

#### Frequently asked questions

##### What does the Insights page show in Hydra Studio?

Insights shows four counters, for total, successful, failed and running runs, and one card with the average duration in seconds. The numbers are computed in the browser from the list of runs.

##### How is the average duration computed?

As the mean of the durations of all the runs that have one, failed runs included. In our test, runs of 3.1, 0.1 and 0.0 seconds gave 1.1 seconds.

##### Why are my Insights counters back to zero?

The server keeps the list of runs in memory. After you restart hdrctl serve, the Runs page and Insights start empty again. We saw this after restarting Studio.

##### Does Insights count runs started from the terminal?

No. It counts the runs that the Studio server knows about, such as runs started from the Run buttons or the API. A run started with hdrctl run in a terminal is not in the list.

##### Can I see statistics per workflow?

Not in Hydra ETL 0.22. Insights shows project-wide totals only. The Runs page lists each run with its workflow, status, steps and duration, and its filter tabs narrow the list by status.

#### Related lessons

Review a run

Tour the Studio pages

Wait with the Delay node

#### Next lesson

You can read the Insights page and know its limits. Next, diagnose a failed run.

Review a run →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Repeat Hydra workflows with loops in thread.yaml — slug: /studio/repeat-workflows-with-loops/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons31 · Stages▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 38

Lesson 38 of 65 · Loops and pauses

### Repeat Hydra workflows with loops in thread.yaml

A loop in thread.yaml replays part of a project several times, with a pause before each new pass. Add one, preview it with a dry run, and run it.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

loopsabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
A loop in workflows/thread.yaml replays a run of workflows times times, in total, and waits delay before each new pass. In our test, two workflows with times: 2 and delay: 1s ran four times in 1.6 seconds.

#### What will you learn in this lesson?

##### Goal

Add a loop to a project, read it in a dry run, run it, and see how times and delay behave.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project folder (a folder with a .hydra subfolder) and the stages of the Stages lesson.

#### How do I repeat workflows with a loop?

##### 01Write two small workflows

###### Objective

Have a portion to repeat.

###### Actions

In the workflows folder, create fetch.yaml and check.yaml.

Give each one a single Python step that does nothing, so that the output stays short.

workflows\fetch.yaml

check.yaml is the same file with check in place of fetch.

version: "1.0"
workflow:
name: fetch
trigger:
type: manual
steps:
- name: fetch
type: action
action: python
params:
script: |
pass

What you should see
Two files in workflows.

##### 02Add a loop

###### Objective

Say which portion repeats, how often, and how long to wait.

###### Actions

Create workflows\thread.yaml with the content below.

Read the loops block: from is the last workflow of the repeated portion and to the first.

workflows\thread.yaml

One stage runs fetch then check. The loop replays the portion from fetch to check for 2 passes in all, and waits 1s before the second one. to must come before from in the thread, or be the same workflow.

version: "1.0"
thread:
- mode: sequential
workflows:
- name: fetch
- name: check
loops:
- from: check
to: fetch
times: 2
delay: 1s

What you should see
A file of 11 lines.

##### 03Preview the plan

###### Objective

Check the loop before running anything.

###### Actions

Open a terminal in the project folder.

Run the command below.

hdrctl run . --dry-run

A dry run prints the execution plan and runs nothing. A loop appears as one line under the stage it belongs to.

What you should see
The stage, its two workflows, a loop line, and a confirmation.

Project loops-demo — 2 workflow(s) in 1 stage(s)

DRY-RUN mode — no data will be written

Execution plan
Stage 1/1 — sequential
• fetch (1: fetch)
• check (1: check)
↻ loop check → fetch, 2 pass(es), waiting 1s

Dry run OK: the project is valid. Nothing was executed.

[image: The Studio terminal after hdrctl run with the dry-run option: the execution plan lists stage 1 with the workflows fetch and check, then a loop line with 2 passes and a one second wait, and says the project is valid and nothing was executed.]

The dry run lists the loop under its stage.

##### 04Run the project

###### Objective

See the passes and the pause.

###### Actions

Run the command below.

hdrctl run .

The stage runs once, a loop line announces the next pass and its wait, then the stage runs again. Each workflow header shows its pass, such as pass 1/2.

What you should see
Two passes, a loop line between them, and a summary of four workflow runs.

Stage 1/1 — sequential
▶ Workflow fetch (pass 1/2)
✓ Step 'fetch' OK (0.2s)
✓ Workflow 'fetch' OK (0.2s)
▶ Workflow check (pass 1/2)
✓ Step 'check' OK (0.2s)
✓ Workflow 'check' OK (0.2s)

↻ Loop check → fetch: pass 2/2 — waiting 1s

Stage 1/1 — sequential
▶ Workflow fetch (pass 2/2)
…
Project 'loops-demo' completed in 1.6s — 4/4 workflow(s) OK

[image: The Studio terminal after hdrctl run in a project whose thread.yaml repeats two workflows: pass 1 of 2, a loop line announcing a one second wait, then pass 2 of 2, and a project summary with 4 of 4 workflows OK.]

The run, with the loop line between the passes.

##### 05Change the number of passes

###### Objective

See that times counts every pass.

###### Actions

Set times: 3 in thread.yaml.

Run hdrctl run . again.

times: 3
hdrctl run .

times is the total number of passes, the first included. With 3, the loop line appears twice, and each wait adds one second.

What you should see
Three passes and a summary of six workflow runs.

Loop check → fetch: pass 2/3 — waiting 1s
…
Loop check → fetch: pass 3/3 — waiting 1s
…
Project 'loops-demo' completed in 2.0s — 6/6 workflow(s) OK

###### Tips and tricks

Run hdrctl run . --dry-run after every change to loops: the plan shows the passes and the wait without running anything.

Use delay to give a system time to settle between two passes. It accepts 500ms, 30s, 5m or 1h.

times: 1 means no repeat: it counts the first pass. To run a portion twice, write times: 2.

to must come before from in the thread. A loop that goes forward is refused with a loop goes back in the message; see the thread.yaml lesson.

#### What should I have at the end?

VerificationExpected result

PlanThe dry run shows a loop line with its passes and wait

RunWorkflow headers show pass 1/2 and pass 2/2

WaitA loop line says waiting 1s before each new pass

TotalFour workflow runs for times 2, six for times 3

#### What if something goes wrong?

SymptomCauseFix

The workflows run only onceThe loops block is missing, or times is 1Add the loop and set times to the total number of passes

The project is reported invalidA loop names a workflow that is not in the thread, or to comes after fromUse workflow names from the thread and put to before from

The loop never seems to waitdelay is missingAdd delay to the loop

#### Frequently asked questions

##### How do I repeat a workflow in Hydra?

Add a loops list to workflows/thread.yaml. Each loop has a from workflow, a to workflow, times and an optional delay. Hydra replays the workflows from to up to from, in thread order.

##### Does times count the first run?

Yes. times is the total number of passes. In our test, times: 2 over two workflows ran four workflows in all, and times: 3 ran six.

##### How do I pause between passes?

Set delay on the loop, for example delay: 1s. The run prints a line saying it is waiting before the next pass. delay accepts seconds or durations such as 500ms, 30s, 5m or 1h.

##### Can I check a loop without running it?

Yes. hdrctl run with --dry-run prints the execution plan, including a line for each loop with its passes and its wait, and runs nothing. It also confirms that the project is valid.

##### What happens if a workflow fails inside a loop?

The engine's thread documentation says a failure stops the project, loops included. This lesson only ran successful workflows, so it did not reproduce a failure.

#### Related lessons

Run workflows in sequence or in parallel

Wait with the Delay node

Dry run and --use-fallback

Compose jobs in a workflow

#### Next lesson

You can repeat part of a project and pause between passes. Next, set a timeout so that a stuck workflow cannot block a loop.

Set timeouts →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Resolve a rollback conflict and recover in Hydra ETL — slug: /studio/resolve-conflicts-and-recover/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons38 · Conflict and recovery▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 45

Lesson 45 of 65 · Conflict and recovery

### Resolve a rollback conflict and recover in Hydra ETL

What if someone edits the file while your workflow runs, and then the workflow fails? Hydra ETL will not overwrite their change. It stops, and tells you how to continue.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

hdrctl workflow undo · .hydra/undoabout 25 minutesthe resilience-demo project

Quick answer
If a rollback finds that a file changed after the run wrote it, Hydra ETL does not restore it, keeps a journal in .hydra/undo/<workflow>.json and refuses to run the workflow again. Review the file, then run hdrctl workflow undo <workflow>, or delete the journal if the data is fine.

#### What will you learn in this lesson?

##### Goal

Provoke a rollback conflict, read the three messages Hydra ETL prints, and leave the project in a state where the workflow runs again. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilience-demo project and wf_conflict: build_report, a 30-second delay action named wait, then finalize, which fails because Data/finalize.csv is missing. The workflow has rollback: true. This lesson adds one line, MANUAL,1, to outputs/report.csv during the wait.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I recover from a rollback conflict in Hydra ETL?

##### 01Run the workflow and edit the file during the wait

###### Objective

Create the conflict on purpose.

###### Actions

Run wf_conflict.

While it waits, add a line to outputs/report.csv.

Wait for the failure.

hdrctl workflow run wf_conflict

The report is built, then the workflow sleeps for 30 seconds. You have time to change the file. Then finalize fails, and the rollback starts.

What you should see
A step that succeeded, a wait of 30 seconds, and a failure on finalize.

##### 02Read the failed rollback

###### Objective

Understand why the report was not restored.

###### Actions

Read the lines after the failure.

hdrctl workflow run wf_conflict

The build_report job would restore the previous report, but the file no longer matches what the run wrote. Hydra ETL keeps your change.

What you should see
A not undone line with the reason, and a failed workflow that tells you how to continue.

✓ Step 'build_report' OK (<duration>)
✓ Step 'wait' OK (30.0s)
✗ Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.
✗ Step 'build_report' not undone: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes
❌ Workflow 'wf_conflict' FAILED in <duration> — … rollback stopped: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes. Finish it with: hdrctl workflow undo wf_conflict

##### 03Try to run the workflow again

###### Objective

See that Hydra ETL protects the half-undone state.

###### Actions

Run the workflow again.

hdrctl workflow run wf_conflict

Every step is skipped, and the message names the journal and the command to use:

What you should see
A failed workflow, with the path of the journal.

⏭ Step 'build_report' skipped
⏭ Step 'wait' skipped
⏭ Step 'finalize' skipped
❌ Workflow 'wf_conflict' FAILED in <duration> — a previous run of 'wf_conflict' stopped before undoing its changes (…/.hydra/undo/wf_conflict.json). Finish it with: hdrctl workflow undo wf_conflict — or delete that file if the data is fine.

[image: The Studio terminal after a second run of wf_conflict, refused because of the undo journal.]

The second run is refused until the journal is dealt with.

##### 04Try to finish the undo

###### Objective

Use the command that the message gave you.

###### Actions

Run hdrctl workflow undo.

Read the answer.

hdrctl workflow undo wf_conflict

The file is still different from what the run wrote, so the undo stops again and keeps the journal. This is the right answer: the command never overwrites a change.

What you should see
The same not undone line, and a message saying that the rest is kept in the journal.

✗ Step 'build_report' not undone: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes
❌ Workflow 'wf_conflict': undo stopped at 'build_report': … The rest is kept in …/.hydra/undo/wf_conflict.json.

[image: The Studio terminal after hdrctl workflow undo wf_conflict, which stops at build_report.]

The undo stops again: the file is still not the one the run wrote.

##### 05Recover

###### Objective

Decide which version you keep and leave the project clean.

###### Actions

Compare outputs/report.csv with the backup .report.csv.hydra-bak-….

Keep the version you want.

Delete .hydra/undo/wf_conflict.json.

.hydra/undo/wf_conflict.json

The journal is a small file that lists the steps waiting to be undone. Once you delete it, the workflow is free to run again. Validate it to check:

What you should see
The workflow validates, and the next run starts normally.

✅ Workflow valid — no errors detected.

###### Tips and tricks

Read the journal before deleting it: it names every step that is still waiting to be undone.

The leftover .report.csv.hydra-bak-… file in outputs is the backup of the previous report. Keep it until you have decided.

Deleting the journal tells Hydra ETL the data is fine. If it is not, the old version is lost.

A manual change and a rollback do not mix. Do not edit the destination of a running workflow.

#### What should I have at the end?

VerificationExpected result

Failure✗ Step 'build_report' not undone with the reason

JournalA file .hydra/undo/wf_conflict.json

RefusalThe workflow refuses to run and names the command to finish the undo

RecoveryAfter you delete the journal, the workflow validates and runs again

#### What if something goes wrong?

SymptomCauseFix

The workflow refuses to runA journal is waiting in .hydra/undoRun hdrctl workflow undo, or delete the journal if the data is fine

hdrctl workflow undo stops at the same stepThe file is still different from what the run wroteDecide which version you keep, then delete the journal

You want your manual line and the old reportThe undo keeps the changed file and the backup next to itMerge them by hand, then delete the journal

#### Frequently asked questions

##### Why did Hydra ETL not undo my step?

The file it would restore changed after the run wrote it, by size or by date. Restoring the old version would destroy that change, so Hydra ETL leaves the file as it is.

##### Where does Hydra ETL keep what is left to undo?

In .hydra/undo/ followed by the workflow name and .json, inside the project. The file lists each step still to undo.

##### Why can I not run the workflow again?

Because a previous run stopped before undoing its changes. Running again could build on a half-undone state, so Hydra ETL asks you to finish the undo first.

##### Does putting the file back as it was fix the conflict?

Not in our test. After removing our added line by hand, the undo still stopped, because the date of the file had changed as well.

#### Related lessons

Roll back a failed workflow

Declare the undo of an action

All-or-nothing loads

Dry run and --use-fallback

The hdrctl command line

#### Next lesson

This block is complete. The next lessons of the course combine fallback, retry and undo in two scenarios.

Back to the course map →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Retry a failing step with retry — slug: /studio/retry-a-failing-step-with-retry/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons34 · Retry Scope▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 53

Lesson 53 of 65 · Retry Scope

### Retry a failing step with retry

Add a retry policy with max, delay and backoff to a workflow step, then read how many times it runs and how long the workflow waits.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

retryabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
retry is a key of a workflow step with three fields: max retries after the first failure, delay in seconds between tries, and backoff, fixed or exponential. The Retry Scope container of Studio writes the same key. In Studio, the Containers group of the palette has a Retry Scope.

#### What will you learn in this lesson?

##### Goal

Run a step that fails twice and passes on the third run, then a step that always fails, then compare fixed and exponential waits. Then find the Retry Scope in the palette of Studio.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project: hdrctl init scope-demo. Work in its workflows folder.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I retry a failing step in a Hydra ETL workflow?

##### 01Retry a step that passes the third time

###### Objective

A script that fails twice.

###### Actions

Save the file below as workflows/retry-ok.yaml.

Run it from the project folder.

hdrctl workflow run workflows\retry-ok.yaml

The script counts its runs in attempts.txt and fails while the count is 2 or less. max: 3 allows three retries, and delay: 1 waits one second before each one. Delete attempts.txt before you run it again.

version: "1.0"
workflow:
name: retry-ok
trigger:
type: manual
steps:
- name: flaky
type: action
action: python
params:
script: |
import pathlib
p = pathlib.Path("attempts.txt")
n = int(p.read_text()) + 1 if p.exists() else 1
p.write_text(str(n))
print("attempt", n)
raise SystemExit(1 if n <= 2 else 0)
retry:
max: 3
delay: 1

What you should see
The step is OK, and the workflow lasted about two seconds.

✓ Step 'flaky' OK (0.2s)
│ attempt 3

✅ Workflow 'retry-ok' completed in 2.6s — 1/1 steps OK

##### 02Read every attempt

###### Objective

The command line shows only the last one.

###### Actions

Delete attempts.txt.

Start the server in a second terminal: hdrctl serve --no-studio --port 5690.

Save run.json as shown below, run the workflow through the API, wait three seconds, then list the runs.

curl.exe -s -X POST -H "Content-Type: application/json" -d @run.json http://127.0.0.1:5690/api/runs

Save this as run.json, with the full path of the workflow (backslashes doubled):

{"workflow_path": "C:\\path\\to\\scope-demo\\workflows\\retry-ok.yaml"}

Then curl.exe -s http://127.0.0.1:5690/api/runs returns the run with the logs of each step. The retry lines, in order (the script lines are cut):

What you should see
The lines failed, retry 1/3 in 1s and succeeded after 2 retry(ies) in the logs of flaky.

INFO attempt 1
ERROR [flaky] FAILED Python script exited with code 1
WARNING [flaky] failed, retry 1/3 in 1s
INFO attempt 2
ERROR [flaky] FAILED Python script exited with code 1
WARNING [flaky] failed, retry 2/3 in 1s
INFO attempt 3
INFO [flaky] succeeded after 2 retry(ies)

##### 03Let the retries run out

###### Objective

A step that never passes.

###### Actions

Save workflows/retry-giveup.yaml with the step below and retry: {max: 2, delay: 1}.

Run it.

hdrctl workflow run workflows\retry-giveup.yaml

The step is always_fails, a Python action whose script is raise SystemExit(1). After two retries the step fails for good, and the failure follows its on_failure value, fail by default.

What you should see
A failed step and a failed workflow after about two seconds.

✗ Step 'always_fails' FAILED: Python script exited with code 1

❌ Workflow 'retry-giveup' FAILED in 2.4s — Step 'always_fails' failed: Python script exited with code 1

##### 04Double the wait

###### Objective

Add exponential backoff.

###### Actions

Copy the file to workflows/retry-backoff.yaml.

Add backoff: exponential to the retry block, next to delay: 1.

Run it.

hdrctl workflow run workflows\retry-backoff.yaml

The waits are one second, then two. The run lasts a second longer than with a fixed delay.

What you should see
The same failure after about three seconds.

✗ Step 'always_fails' FAILED: Python script exited with code 1

❌ Workflow 'retry-backoff' FAILED in 3.3s — Step 'always_fails' failed: Python script exited with code 1

##### 05Check a typo

###### Objective

Validation suggests the key.

###### Actions

Write mx: 2 instead of max: 2 in a retry block.

Run the validation.

hdrctl workflow validate workflows\bad-retry.yaml

The three valid keys are listed.

What you should see
A refusal with a suggestion.

❌ Invalid workflow: Workflow validation error in '...\workflows\bad-retry.yaml':
- steps.0.retry: retry: unknown key 'mx' — did you mean 'max'? Valid keys: backoff, delay, max

###### Tips and tricks

Pick delay from the cause: a few seconds for a busy service, more for a service that restarts.

Put retry on the step that talks to the outside, not on every step.

Retrying a failure that always happens, such as a missing file or a wrong password, only delays the failure. In our test, a step that could never pass kept the workflow waiting for the whole delay.

A step that is not safe to run twice, such as one that sends a message, can act twice. Make it safe first, or do not retry it.

The command line shows only the last attempt. Read the logs of the run when you need to know how many tries it took.

##### 06Find the Retry Scope in Studio

###### Objective

Drop the container on the canvas.

###### Actions

Open a workflow in Hydra Studio, in the Workflow configuration tab.

In the node palette, open Containers and drag Retry Scope onto the canvas.

Read the two numbers at the top of the box.

palette → Containers → Retry Scope

The Retry Scope is a blue dashed box. Its first line holds two fields: Retries, set to 3 when we dropped it, and delay in seconds, set to 5. These are the two values this lesson sets with retry in the YAML.

What you should see
A blue box named Retry Scope with Retries and delay fields.

[image: The Hydra Studio workflow editor with a Retry Scope container dropped on the canvas, with its Retries field set to 3 and its delay field set to 5 seconds.]

The Retry Scope container on the canvas.

#### What should I have at the end?

VerificationExpected result

Keyretry on a step

maxretries after the first failure (0 = none)

delayseconds between tries

backofffixed (default) or exponential

After the last retrythe step follows its on_failure value

#### What if something goes wrong?

SymptomCauseFix

unknown key 'mx' — did you mean 'max'?A typo in the retry blockUse max, delay or backoff

Step still FAILEDEvery try failedRead the error of the step: retrying does not fix a permanent cause

#### Frequently asked questions

##### How do I retry a failing step in Hydra ETL?

Add a retry key to the step with max, delay and, optionally, backoff. In our test on Hydra ETL 0.22, a step that failed twice and then passed ended as OK with max: 3 and delay: 1, and the workflow took 2.6 seconds, two waits of one second.

##### Does max count the first try?

No. max is the number of retries after the first failure, according to the source. With max: 3 a step can run four times. Our flaky step passed on its third run.

##### What does exponential backoff do?

The wait doubles at each retry. With delay: 1 and max: 2, the waits were one second then two seconds: the failing workflow took 3.3 seconds, against 2.4 seconds with fixed waits.

##### Where do I see each attempt?

In the logs of the step, kept by the server. The command line printed only the output of the last attempt in our test. Through the API, the logs showed each failure and the lines failed, retry 1/3 in 1s and succeeded after 2 retry(ies).

##### How does the Retry Scope container of Studio relate to this?

According to the Studio source (workflowSerializer.ts), a Retry Scope copies its retry settings onto each step it contains, so the YAML carries the same key. We did not test dragging steps into the container.

##### Is there a Retry Scope in Hydra Studio?

Yes. The Containers group of the node palette has a Retry Scope; dropped on the canvas, it shows a Retries field set to 3 and a delay of 5 seconds in our test.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Handle a failing step with on_failure

Wait with the Delay node

Diagnose a failed run

#### Next lesson

One key, three fields. Not covered here: dragging steps into a Retry Scope in Studio, and retrying a job step.

Back to on_failure →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Roll back a failed workflow in Hydra ETL Studio — slug: /studio/roll-back-a-failed-workflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons36 · Rollback▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 43

Lesson 43 of 65 · Rollback

### Roll back a failed workflow in Hydra ETL Studio

When step three of three fails, steps one and two have already changed things. Rollback puts them back, last step first.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

Workflow toolbar → Rollbackabout 20 minutesthe resilience-demo project

Quick answer
Turn on Rollback in the workflow toolbar, or write rollback: true in the workflow file. If a step fails, Hydra ETL undoes the finished steps, the last one first. Jobs are undone automatically; an action must say how it is undone.

#### What will you learn in this lesson?

##### Goal

Turn rollback on, give an action its undo, make the last step fail and check that the files are back in their previous state. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilience-demo project with wf_report: build_report (a job that replaces outputs/report.csv), share (a python action that copies the report to outputs/share, with an undo that deletes the copy) and finalize (a job that fails because Data/finalize.csv is missing).

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I roll back a failed workflow in Hydra ETL?

##### 01Turn rollback on

###### Objective

Switch the protection on for one workflow.

###### Actions

Open the workflow wf_report in the editor.

Select Rollback in the toolbar until it reads Rollback on.

rollback: true

The button saves the workflow when you select it. Its tooltip says what it does: if the workflow fails, undo the steps already done, the last one first; jobs automatically, actions with their Undo setting.

What you should see
A highlighted button reading Rollback on.

[image: The workflow editor of wf_report with the Rollback button on in the toolbar.]

Rollback is one button in the workflow toolbar.

##### 02Give an action its undo

###### Objective

Say how to reverse the action that copies the report.

###### Actions

Double-click the share node.

Find the Undo (if the workflow rolls back) section.

Read the action chosen there.

undo: python

The share action copies the report into outputs/share. Its undo is a second python action that deletes the copy. Hydra ETL runs it only if a later step fails.

What you should see
A Run an action: python choice, with the script that removes the copy.

[image: The dialog of the share action with the Undo section set to run a python action.]

The undo is configured next to the action it reverses.

##### 03Make the last step fail

###### Objective

Provoke the failure that triggers the rollback.

###### Actions

Rename Data/finalize.csv so that the job cannot read it.

Run the workflow.

hdrctl workflow run wf_report

build_report and share succeed. finalize fails. Hydra ETL then undoes share, and build_report, in that order.

What you should see
Two checkmarks, a failure, two undo lines, and a failed workflow marked changes undone.

✓ Step 'build_report' OK (<duration>)
✓ Step 'share' OK (<duration>)
✗ Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.
↩ Step 'share' undone
↩ Step 'build_report' undone
❌ Workflow 'wf_report' FAILED in <duration> — Step 'finalize' failed: ValueError: CSVConnector [src]: source file not found. … (changes undone)

[image: The Studio terminal after a failed run of wf_report, with the two undone steps.]

The steps are undone in reverse order.

##### 04Check that everything is back

###### Objective

Verify the state instead of trusting the log.

###### Actions

List outputs/share.

Open outputs/report.csv.

Get-ChildItem outputs\share

The shared copy is gone, and the report holds what it held before the run. The temporary backup that the job used is removed.

What you should see
An empty outputs/share folder and a report identical to the one before the run.

##### 05Read rollback in the workflow file

###### Objective

See the same setting as text.

###### Actions

Open Hydra DSL or the file workflows/wf_report.yaml.

rollback: true

The setting is one line at the level of the workflow, next to trigger. The action carries its own undo:

workflow:
name: wf_report
rollback: true
steps:
- name: share
type: action
action: python
params:
script: …
undo:
action: python
params:
script: import os; os.remove('outputs/share/report.csv')

What you should see
A rollback: true line and an undo block under the action.

###### Tips and tricks

Run hdrctl workflow validate after turning rollback on: it lists every action that has no undo.

Rollback and a fallback work together: after a rollback, on_failure: true can start a backup, as in lesson 47.

Rollback undoes what Hydra ETL did. It cannot undo a side effect you did not declare, such as a message already sent.

The failed step is not undone, only the steps finished before it.

#### What should I have at the end?

VerificationExpected result

ToolbarThe button reads Rollback on

Run✗ Step 'finalize' FAILED followed by two ↩ … undone lines

Reportoutputs/report.csv has its previous content

Shareoutputs/share no longer holds a copy

#### What if something goes wrong?

SymptomCauseFix

The button reads Rollback offThe workflow has no rollback: trueSelect the button, it saves the workflow

Validation refuses the workflowAn action has no undoOpen the action and set its Undo, see the next lesson

The failed step is not undoneOnly the steps finished before it are undoneMake the failing step safe to retry instead

#### Frequently asked questions

##### What does rollback do in Hydra ETL?

When a step of the workflow fails, Hydra ETL undoes the steps already finished, the last one first. The workflow is then reported as failed with the mention that its changes were undone.

##### Are jobs undone automatically?

Yes. In our test, build_report restored the previous report file. A job that writes a file keeps a backup of the previous version, and rollback puts it back.

##### What about actions?

An action acts outside Hydra ETL, so Hydra ETL cannot guess how to reverse it. With rollback on, each action must declare an undo, or undo: none. The next lesson shows how.

##### Does rollback run when a step succeeds?

No. It runs when a step fails, and it undoes the steps that had finished before.

#### Related lessons

All-or-nothing loads

Declare the undo of an action

Resolve conflicts and recover

Declare a fallback workflow

workflow.yaml reference

#### Next lesson

The next lesson explains how to tell Hydra ETL how an action is undone, and what the validation says when you forget.

Declare the undo of an action →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Run a Hydra project on a schedule with a cron trigger — slug: /studio/run-a-project-on-a-cron-schedule/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons45 · Schedule trigger▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 58

Lesson 58 of 65 · Schedule trigger

### Run a Hydra project on a schedule with a cron trigger

A cron trigger starts a Hydra project at fixed times. Declare it in triggers.yaml, validate the expression, start hdrctl watch and read the runs.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl watchabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
A trigger of type cron starts the project at the times of a five-field expression, in the time zone you choose. hdrctl watch waits for those times and runs the project. In Studio, the Triggers tab of the project settings does the same.

#### What will you learn in this lesson?

##### Goal

Declare two cron triggers, validate them, read the next run of each, start hdrctl watch, and read the runs it starts. Then make the same trigger in the Triggers tab of Studio and run it with one click.

##### Prerequisites

Hydra ETL 0.22 installed, and a project created with hdrctl init sched-demo. See Install and start.

A second terminal: hdrctl watch stays open while it waits.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I run a Hydra project on a schedule?

##### 01Declare two cron triggers

###### Objective

Edit triggers.yaml.

###### Actions

Open triggers.yaml at the root of the project.

Write the content below.

Run hdrctl trigger validate.

triggers.yaml

The five fields are minute, hour, day of month, month and day of week. * * * * * means every minute. 0 2 * * mon-fri means 02:00 from Monday to Friday. timezone takes an IANA name.

version: "1.0"
triggers:
- name: every-minute
type: cron
cron: "* * * * *"
timezone: UTC
- name: nightly-paris
type: cron
cron: "0 2 * * mon-fri"
timezone: Europe/Paris

What you should see
Triggers valid — 2 trigger(s).

Triggers valid — 2 trigger(s)

##### 02List the triggers

###### Objective

Check what was read.

###### Actions

Run the command below.

hdrctl trigger list

Each trigger shows its expression and its time zone, and the file it runs. The list does not show the next run: hdrctl watch prints it in the next step.

What you should see
Two lines, each marked on.

on every-minute cron * * * * * (UTC)
runs thread.yaml · env: from watch/serve
on nightly-paris cron 0 2 * * mon-fri (Europe/Paris)
runs thread.yaml · env: from watch/serve

##### 03Start hdrctl watch

###### Objective

Keep it open.

###### Actions

Open a second terminal in the project folder.

Run the command below and leave it open.

hdrctl watch

The command prints the next run of each trigger. Times are those of your machine: ours was set to Paris time.

What you should see
Two triggers with next:, then Waiting for events.

Project sched-demo
● every-minute cron * * * * * (UTC) next: 2026-11-24 07:38
● nightly-paris cron 0 2 * * mon-fri (Europe/Paris) next: 2026-11-25 02:00

Waiting for events. Ctrl+C to stop.

##### 04Wait for the first runs

###### Objective

Read each start and end.

###### Actions

Wait for the next full minute.

Read the two lines of each run.

hdrctl watch

The run starts at second 00 of the minute. The ▶ line gives the start, the ✓ line gives the end and the duration. In our test the project ran twice in two minutes, in 2.4 s and 2.6 s.

What you should see
A ▶ line and a ✓ line at the start of each minute.

2026-11-24 07:38:00 ▶ sched-demo/every-minute cron * * * * * (UTC) env: none
2026-11-24 07:38:02 ✓ sched-demo/every-minute 2.4s
2026-11-24 07:39:00 ▶ sched-demo/every-minute cron * * * * * (UTC) env: none
2026-11-24 07:39:03 ✓ sched-demo/every-minute 2.6s

##### 05Read the history

###### Objective

See the runs in one place.

###### Actions

Stop watch with Ctrl+C.

Run the command below.

hdrctl trigger history

The history lists each run with its trigger, its origin and its duration. Dates are in UTC here, so they are one hour earlier than the lines of watch on our machine. The Paris trigger did not run: its time had not come.

What you should see
Two lines with ✓, both for every-minute.

✓ 2026-11-24T06:38:02+00:00 every-minute watch 2.42s
✓ 2026-11-24T06:39:03+00:00 every-minute watch 2.63s

##### 06Read a wrong expression

###### Objective

Break one on purpose.

###### Actions

Change the cron line to "61 * * * *".

Run hdrctl trigger validate.

hdrctl trigger validate

Validation names the field and the limit. Put the expression back before you start watch.

What you should see
An Invalid triggers file line, then the reason.

Invalid triggers file: ...\triggers.yaml
err — trigger 't': cron '61 * * * *': minute: 61 is out of range (0-59)

###### Tips and tricks

Validate before you wait: hdrctl trigger validate checks the expression and the time zone in a second.

Write timezone on every cron trigger, so that the schedule does not move with the machine.

timezone only belongs to cron triggers: on an interval trigger, validate answers timezone does not apply to type interval.

Cron triggers run only while hdrctl watch is open. If it is closed at 02:00, nothing starts.

##### 07Add the cron trigger in Studio

###### Objective

Make the same trigger from the Triggers tab.

###### Actions

Click Settings, then Project settings, then the Triggers tab.

Click Add a trigger.

Keep At given times, type the name nightly, keep the cron 0 2 * * * and type Europe/Paris as the time zone.

Click Add.

Settings → Project settings → Triggers → Add a trigger

The Cron box is the same five-field expression as in the file, and the Preset list fills it for you with a common schedule. If you check no workflow under Workflows to run, the trigger starts the whole project, as thread.yaml orders it. The trigger runs while hdrctl serve runs, which is the server of this Studio, or while hdrctl watch runs, but not both on the same project.

What you should see
The New trigger box, filled in.

[image: The New trigger box of the Triggers tab with the type At given times selected, the name nightly, the cron 0 2 * * * and the time zone Europe/Paris.]

The New trigger box for a cron trigger.

##### 08Read the row and the file

###### Objective

See the next run and what Studio wrote.

###### Actions

Read the nightly row: its When column, its Next run and its enabled checkbox.

Open triggers.yaml at the root of the project.

type triggers.yaml

The Next column shows the next time the expression fires, in your time zone: 25/11/2026 02:00 in our test. Each change is written to triggers.yaml; according to the text of the page, comments in the file are not kept and the previous file is copied to ~/.hydra/_backups.

What you should see
A row with the next run, and a file with the same three keys as in the CLI steps.

version: "1.0"
triggers:
- name: nightly
type: cron
cron: 0 2 * * *
timezone: Europe/Paris

[image: The Triggers tab with one row, nightly, of type cron, showing the expression and the time zone, the next run 25/11/2026 02:00 and an enabled checkbox.]

The nightly row, with its next run.

##### 09Run it now

###### Objective

Start the trigger without waiting for 02:00.

###### Actions

Click the green play button of the nightly row.

Wait a few seconds: the Next column says running, then the Last run column shows a check mark.

Read the History list under the table.

▶ Run now

The run starts the project as the trigger would. In our test it lasted 4.79 seconds and the history line says api as its origin: the button calls the server, so it is not recorded as manual as hdrctl trigger fire is. The panel refreshes every five seconds.

What you should see
A green check, just now, and one History line for nightly.

[image: The Triggers tab after Run now on nightly: the last run column shows a green check and the origin api, and the History list has a nightly line with its duration.]

After Run now: last run and history.

#### What should I have at the end?

VerificationExpected result

Typecron

Expressionminute hour day month weekday

Time zonetimezone: Europe/Paris, or UTC

Runhdrctl watch

Checkhdrctl trigger validate, hdrctl trigger history

#### What if something goes wrong?

SymptomCauseFix

minute: 61 is out of rangeA value is outside its field rangeUse 0-59 for the minute

5 fields expectedThe expression has fewer or more than five fieldsWrite minute hour day month weekday

unknown timezoneThe name is not an IANA zone, or tzdata is missing on WindowsCheck the name, or run pip install tzdata

every does not apply to type cronA key of another trigger type was addedRemove the key

#### Frequently asked questions

##### What does a cron trigger do in Hydra ETL?

A trigger of type cron starts the project at the times a five-field cron expression gives. Under hdrctl watch, it ran every minute at second 00 in our test on Hydra ETL 0.22 on Windows.

##### Which fields does the cron expression have?

Five fields: minute, hour, day of month, month, day of week. The source accepts lists, ranges, steps such as */15, and names such as mon-fri or jan-mar. When day of month and day of week are both restricted, either one is enough, as in classic cron.

##### How do I set the time zone of a cron trigger?

Add timezone with an IANA name such as Europe/Paris or UTC. Without it, the time zone of the machine is used, according to the source. On Windows an unknown name asks you to run pip install tzdata.

##### Does the cron trigger run without hdrctl serve?

Yes. hdrctl watch runs cron triggers and does not need the server extra. We tested hdrctl watch only. We did not test the scheduler of hdrctl serve.

##### What happens if the cron expression is wrong?

hdrctl trigger validate stops with the reason: a value out of range, a wrong number of fields, an unknown time zone, or a key that does not belong to the type.

##### Can I add a cron trigger in Hydra Studio?

Yes. Open Settings, Project settings and the Triggers tab, click Add a trigger and keep the type At given times. Studio writes the same keys to triggers.yaml. In our test the new row showed the next run, 25/11/2026 02:00, and the Run now button started the project in 4.79 seconds.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Declare project triggers

Other triggers

Launch a job from the CLI and the API

#### Next lesson

One expression, one time zone, one command that waits. Not covered here: the scheduler of hdrctl serve.

Next: Other triggers →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Run Hydra workflows in sequence or in parallel with stages — slug: /studio/run-steps-in-sequence-or-in-parallel/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons30 · Stages▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 37

Lesson 37 of 65 · Stages

### Run Hydra workflows in sequence or in parallel with stages

Stages in thread.yaml decide which workflows run one after another and which run together. Build four workflows, run them, and measure what parallel saves.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

thread.yamlabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A Hydra project runs its workflows in stages, declared in workflows/thread.yaml. A sequential stage runs its workflows one after the other and a parallel stage runs them together. In our test, two 2-second workflows took 3.3 seconds in a parallel stage and 5.4 seconds in a sequential one.

#### What will you learn in this lesson?

##### Goal

Write a project with three stages, run it with hdrctl run, compare parallel with sequential, and skip a workflow with active: false.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project folder: a folder that contains a .hydra subfolder. Create a project shows how to make one in Studio.

#### How do I run workflows in stages?

##### 01Write four small workflows

###### Objective

Have something to order.

###### Actions

In the workflows folder of the project, create prepare.yaml, load_sales.yaml, load_stock.yaml and report.yaml.

Give load_sales and load_stock a Python step that waits 2 seconds; give the other two a log step.

workflows\load_sales.yaml

The two loads stand for slow work. load_stock is identical except for its name and message. prepare and report each hold one log step.

version: "1.0"
workflow:
name: load_sales
trigger:
type: manual
steps:
- name: work_load_sales
type: action
action: python
params:
script: |
import time
time.sleep(2)
print("load_sales done")

What you should see
Four files in workflows.

##### 02Declare the stages

###### Objective

Say which workflows wait for which.

###### Actions

Create workflows\thread.yaml with the content below.

Read it from top to bottom: one stage per dash under thread.

workflows\thread.yaml

Three stages. Stage 1 runs prepare. Stage 2 is parallel: load_sales and load_stock start together, then the project waits 1s (delay_after). Stage 3 runs report. Each name is the file name in workflows, without .yaml.

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- mode: parallel
delay_after: 1s
workflows:
- name: load_sales
- name: load_stock
- mode: sequential
workflows:
- name: report

What you should see
A file of 13 lines.

##### 03Run the project

###### Objective

Watch the stages go by.

###### Actions

Open a terminal in the project folder.

Run the command below.

hdrctl run .

In a project folder, hdrctl run . runs every workflow in the order of thread.yaml. Each stage prints a header with its number and mode. In the parallel stage, both workflows start before either one finishes.

What you should see
Three stage headers, every workflow OK, a one second wait, and a final summary.

Stage 1/3 — sequential
▶ Workflow prepare
✓ Step 'say_prepare' OK (0.0s)
| Prepare: folders ready
✓ Workflow 'prepare' OK (0.0s)

Stage 2/3 — parallel
▶ Workflow load_sales
▶ Workflow load_stock
✓ Step 'work_load_sales' OK (2.2s)
| load_sales done
✓ Workflow 'load_sales' OK (2.2s)
✓ Step 'work_load_stock' OK (2.2s)
| load_stock done
✓ Workflow 'load_stock' OK (2.2s)
Waiting 1s before the next stage

Stage 3/3 — sequential
▶ Workflow report
✓ Step 'say_report' OK (0.0s)
| Report: all loads finished
✓ Workflow 'report' OK (0.0s)

Project 'stages-demo' completed in 3.3s — 4/4 workflow(s) OK

[image: The Hydra Studio terminal after hdrctl run in a project with three stages: a sequential stage, a parallel stage running two workflows at once, then a sequential stage, finishing in 3.3 seconds with 4 of 4 workflows OK.]

The run in the Studio terminal. The two loads start together.

##### 04Compare with a sequential stage

###### Objective

Measure what parallel saves.

###### Actions

In thread.yaml, change the second stage to mode: sequential.

Run hdrctl run . again.

mode: sequential
hdrctl run .

The two loads now run one after the other. Each still takes about 2 seconds, so the stage takes the sum instead of the longest.

What you should see
load_stock starts only after load_sales ends, and the total grows.

Stage 2/3 — sequential
▶ Workflow load_sales
✓ Step 'work_load_sales' OK (2.2s)
| load_sales done
✓ Workflow 'load_sales' OK (2.2s)
▶ Workflow load_stock
✓ Step 'work_load_stock' OK (2.1s)
| load_stock done
✓ Workflow 'load_stock' OK (2.1s)
Waiting 1s before the next stage
…
Project 'stages-demo' completed in 5.4s — 4/4 workflow(s) OK

[image: The Hydra Studio terminal in the dark theme after hdrctl run in a project where all three stages are sequential: load_sales ends before load_stock starts and the project completes in 5.4 seconds.]

The same project with the second stage sequential.

##### 05Skip a workflow

###### Objective

Keep a workflow in the file but leave it out of the run.

###### Actions

Set the second stage back to parallel.

Under load_stock, add active: false.

Run hdrctl run . again.

- name: load_stock
active: false
hdrctl run .

active: false is the way to leave a workflow out while debugging, without deleting its line. The run names it and does not count it.

What you should see
A line saying load_stock is inactive, and one workflow fewer in the summary.

Stage 2/3 — parallel
▶ Workflow load_sales
✓ Step 'work_load_sales' OK (2.2s)
| load_sales done
✓ Workflow 'load_sales' OK (2.2s)
load_stock — inactive, skipped
…
Project 'stages-demo' completed in 3.2s — 3/3 workflow(s) OK

###### Tips and tricks

Put workflows that do not depend on each other in a parallel stage, and keep ordered work in separate sequential stages.

Use delay_after to leave a system time to settle between two stages. It accepts 500ms, 30s, 5m or 1h.

Parallel only helps when the work waits. Two workflows that share one slow resource, such as the same database, can take as long as running them in sequence.

Edit the order in Studio instead of YAML: Project settings has an Execution order tab for this file.

#### What should I have at the end?

VerificationExpected result

Runhdrctl run . prints Stage 1/3, 2/3 and 3/3 with their modes

ParallelBoth workflows of the stage start before either one finishes

Time3.3 seconds in parallel against 5.4 sequentially

SkipAn inactive workflow is named and not counted

#### What if something goes wrong?

SymptomCauseFix

The project is treated as a single jobThe folder has no .hydra subfolder, or has job files at its rootRun the command from a project folder, with workflows in workflows

A workflow is not foundThe name does not match a file in workflowsUse the file name without .yaml

Parallel is not fasterThe workflows are short, or wait on the same resourceMeasure each workflow alone before choosing the mode

A workflow does not runIt has active: falseRemove the line or set it to true

#### Frequently asked questions

##### What is a stage in thread.yaml?

A stage is one entry of the thread list in workflows/thread.yaml. It has a mode, sequential or parallel, and a list of workflows. Stages run one after the other, and hdrctl run reads them in order.

##### How do I run two workflows at the same time in Hydra?

Put them in the same stage with mode: parallel. In our test, two workflows of 2.2 seconds each finished together, and the whole project took 3.3 seconds instead of 5.4 with the same stage set to sequential.

##### What does delay_after do?

delay_after pauses the project after a stage, before the next one starts. It takes a number of seconds or a duration such as 500ms, 30s, 5m or 1h. The run prints a line saying it is waiting.

##### How do I skip a workflow without deleting it?

Add active: false to the workflow in thread.yaml. The run prints that the workflow is inactive and skipped, and counts only the others. In our test, 3 of 3 remaining workflows ran.

##### What happens when a workflow in a stage fails?

The Studio Execution order page states that a failed workflow stops the project. This lesson only ran successful workflows, so it did not reproduce a failure.

#### Related lessons

Compose jobs in a workflow

Wait with the Delay node

Project settings and Global settings

Start from a workflow template

#### Next lesson

You can run workflows in order, in parallel, and leave one out. Next, repeat part of a project and pause between steps.

Back to the lessons →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Set a timeout on a workflow in Hydra ETL Studio — slug: /studio/set-timeouts-on-workflows/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons41 · Timeouts▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 48

Lesson 48 of 65 · Timeouts

### Set a timeout on a workflow in Hydra ETL Studio

A workflow that never ends is a failure you notice too late. Give it a maximum duration, and Hydra ETL stops it at the next safe point.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

Execution order → maxabout 15 minutesa project with a slow workflow

Quick answer
To set a timeout on a Hydra ETL workflow, type a duration such as 5s, 5m or 1h in the max field of the workflow in Execution order and save. It is written as timeout: in thread.yaml. Beyond it, the workflow is stopped at the next step or batch and counts as failed.

#### What will you learn in this lesson?

##### Goal

Set a maximum duration on one workflow, run it, and read exactly when and how it stops. A fallback can answer a timeout like any other failure. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The fallback-demo copy of fallbackproject, with wf_conflict alone in the thread. It runs build_report, waits 30 seconds with a delay action, then runs finalize. It has rollback: true.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I set a timeout on a workflow in Hydra ETL?

##### 01Find the max field

###### Objective

Locate where a workflow's duration limit is set.

###### Actions

Open Project settings → Execution order.

Find the max field on the row of the workflow.

Execution order → wf_conflict → max

The field sits on the workflow row, between wait and the lifebuoy. Its tooltip explains it: the maximum duration of the workflow and of each fallback run in its place, written 30s, 5m or 1h; empty means no limit.

What you should see
One stage with wf_conflict and an empty max field.

##### 02Type a duration

###### Objective

Give the workflow five seconds.

###### Actions

Select the max field.

Type 5s.

Check the border stays normal.

5s

A red border means the value cannot be read. Five seconds is deliberately short: wf_conflict waits 30 seconds, so the limit will be exceeded.

What you should see
5s in the field, with a normal border.

[image: The Execution order panel with the max field of wf_conflict set to 5s.]

The limit is one short field per workflow.

##### 03Save and run

###### Objective

Write the limit and start the project.

###### Actions

Select Save.

Go back to the project and select Run project.

Open the run.

hdrctl run .

The run lasts about 30 seconds because the delay step cannot be interrupted.

What you should see
A run that ends in Failed.

##### 04Read how it stopped

###### Objective

Understand when the stop happened and what was undone.

###### Actions

Read the failed run.

Open the failed step.

hdrctl run .

The timeout is announced at the moment it expires, then enforced at the next step. Because the workflow has rollback: true, the step that had finished is undone:

What you should see
The run page reads Failed with 0 ok / 1. The step carries a timed out badge and the message timed out after 5s (timeout in workflows/thread.yaml) (changes undone).

▶ Workflow wf_conflict
⏳ wf_conflict: timed out after 5s — stopping at the next step or batch
✓ Step 'build_report' OK (<duration>)
✓ Step 'wait' OK (30.0s)
↩ Step 'build_report' undone
✗ Workflow 'wf_conflict' failed (30.4s): timed out after 5s (timeout in workflows/thread.yaml) (changes undone)
❌ Project failed — failed: wf_conflict

[image: The run detail page of a project whose workflow wf_conflict failed after exceeding its 5 second timeout.]

The run shows the failure and its reason.

##### 05Read the timeout in thread.yaml

###### Objective

See the same limit as text.

###### Actions

Open Hydra DSL or the file workflows/thread.yaml.

timeout: 5s

This is the form written by Studio, validated with Hydra ETL 0.22.0:

thread:
- mode: sequential
workflows:
- name: wf_conflict
active: true
timeout: 5s

What you should see
A timeout line under the workflow it limits.

###### Tips and tricks

Pick a limit well above the normal duration, so it only stops a real problem.

An empty max field means no limit.

The stop happens at the next step or batch. A single long step runs to the end, as the 30-second wait does here.

A timeout in thread.yaml applies to the project run, not to hdrctl workflow run of a single workflow.

#### What should I have at the end?

VerificationExpected result

Fieldmax holds a duration such as 5s and is not red

YAMLA timeout: 5s line under the workflow

RunThe workflow fails with timed out after 5s

RollbackThe finished step is undone

#### What if something goes wrong?

SymptomCauseFix

The max field turns redThe duration is not validWrite a number and a unit: 30s, 5m or 1h

The run lasts longer than the limitA step was still running when the limit passedThe stop is applied at the next step or batch

The timeout is ignoredThe workflow was run aloneRun the project: hdrctl run .

#### Frequently asked questions

##### How do I set a timeout on a Hydra ETL workflow?

Type a duration such as 30s, 5m or 1h in the max field of the workflow in Execution order, or add a timeout line to the workflow in workflows/thread.yaml.

##### Does the timeout stop a step in the middle?

No. The workflow is stopped at the next step or batch. A long step finishes before the stop takes effect.

##### What happens to the workflow after a timeout?

It counts as failed. With rollback: true its finished steps are undone, and a fallback with on_failure: true can run in its place.

##### Does a fallback run have its own timeout?

The limit applies to the workflow and to each fallback run in its place, according to the tooltip of the max field in Studio.

#### Related lessons

Declare a fallback workflow

Fallback conditions

Dry run and --use-fallback

workflow.yaml reference

#### Next lesson

The last lesson of this block rehearses everything without running a workflow, and forces a fallback on demand.

Dry run and --use-fallback →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Start a Hydra ETL project from a webhook — slug: /studio/start-a-project-with-a-webhook/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons46 · Webhook trigger▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 55

Lesson 55 of 65 · Webhook trigger

### Start a Hydra ETL project from a webhook

A webhook trigger lets another system start your project with one HTTP call. Declare it, create a token, run hdrctl serve and call the URL.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl trigger tokenabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A trigger of type webhook starts the project when another system sends POST /api/projects/ID/triggers/NAME/webhook with the right token. hdrctl serve must be running. In Studio, the Triggers tab declares the trigger and creates the token.

#### What will you learn in this lesson?

##### Goal

Declare a webhook trigger, create its token, start the server, register the project, call the webhook with and without the right token, and read the history. Then do the same in the Triggers tab of Studio, including the token.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra. See Install and start.

A project: hdrctl init webhook-demo. The project id is in .hydra/project.json.

curl.exe (Windows) or curl, to make the calls.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I start a Hydra ETL project with a webhook?

##### 01Declare the trigger

###### Objective

Name a secret for the token.

###### Actions

Create triggers.yaml at the root of the project with the content below.

Run hdrctl trigger validate.

hdrctl trigger validate

The token line does not hold a value: it names a secret. Until the secret exists, validation passes with a warning.

version: "1.0"
triggers:
- name: deploy
type: webhook
token: ${SECRET:hooks.deploy}

What you should see
A warning, then Triggers valid.

⚠ trigger 'deploy': secret 'hooks.deploy' is not set yet (hdrctl trigger token deploy)

✅ Triggers valid — 1 trigger(s)

##### 02Create the token

###### Objective

Copy it once.

###### Actions

Run the command below.

Copy the token now: it is not shown again.

hdrctl trigger token deploy

The command generates a token, stores it in .hydra/secrets as hooks.deploy, prints it once, and prints the URL to call. A second run refuses to overwrite it: add --rotate to replace the token.

What you should see
The token on a line of its own, then the URL.

✅ Token saved as secret 'hooks.deploy' in ...\.hydra\secrets
Copy it now, it is not shown again:

Call (hdrctl serve running):
POST http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook
X-Hydra-Token:

❌ Secret 'hooks.deploy' is already set
To replace it: hdrctl trigger token deploy --rotate

##### 03Start the server and register the project

###### Objective

The webhook is served by hdrctl serve.

###### Actions

Start the server in a second terminal: hdrctl serve.

Save open.json as shown below, then register the project with the second command.

hdrctl serve
curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5678/api/projects/open

The server finds a project by its id. /api/projects/open registers an existing folder and returns its id: aa9187f9 in our test, the same as in .hydra/project.json. Save this as open.json first, with the full path of your project (backslashes doubled):

{"path": "C:\\path\\to\\webhook-demo", "adopt": true}

What you should see
A JSON answer with the id, the name and the path.

{"id":"aa9187f9","name":"webhook-demo","description":"","path":"C:\\...\\webhook-demo","created_at":"2026-11-24T06:56:37.880118+00:00"}

##### 04Call the webhook

###### Objective

Send the token in a header.

###### Actions

Replace the id and the token in the command below.

Run it.

curl.exe -i -X POST -H "X-Hydra-Token: " http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook

The server answers at once, before the run ends: 202 Accepted means the run started. You can also send Authorization: Bearer <token>; it worked the same in our test.

What you should see
HTTP/1.1 202 Accepted and a JSON body.

HTTP/1.1 202 Accepted

{"trigger":"deploy","status":"started","origin":"webhook"}

##### 05Read the refusals

###### Objective

Three wrong calls.

###### Actions

Call the URL with no header.

Call it with a wrong token.

Call it with the right token but another trigger name.

curl.exe -i -X POST -H "X-Hydra-Token: wrong-token-value" http://127.0.0.1:5678/api/projects/aa9187f9/triggers/deploy/webhook

Each refusal has its own status and message, and starts nothing.

What you should see
401, 401 and 404.

HTTP/1.1 401 Unauthorized
{"detail":"token required (X-Hydra-Token or Authorization: Bearer)"}

HTTP/1.1 401 Unauthorized
{"detail":"invalid token"}

HTTP/1.1 404 Not Found
{"detail":"no webhook trigger 'nope'"}

##### 06Read the history

###### Objective

See who started each run.

###### Actions

In the project folder, run the command below.

hdrctl trigger history

The last column is the origin. In our test, hdrctl trigger fire deploy gave manual and the two good calls gave webhook. Note that trigger fire needs no token: it is run from your own machine.

What you should see
Three runs, one manual and two webhook.

✓ 2026-11-24T06:56:43+00:00 deploy manual 2.5s
✓ 2026-11-24T06:57:19+00:00 deploy webhook 2.74s
✓ 2026-11-24T06:57:26+00:00 deploy webhook 2.39s

###### Tips and tricks

Rotate the token with --rotate when it may have leaked, then update the caller.

Keep the token in the secret store of the system that calls you, not in its code.

The token is shown once. If you lose it, run hdrctl trigger token NAME --rotate.

The call starts the run and returns 202 before it ends. A success answer does not mean the run succeeded: check hdrctl trigger history.

Anything on the network that reaches the server and has the token can start the project. Do not expose hdrctl serve to the internet without a proxy that you control.

##### 07Add the webhook trigger in Studio

###### Objective

Declare the trigger from the Triggers tab.

###### Actions

Click Settings, Project settings, then the Triggers tab, and click Add a trigger.

Choose An HTTP call, and type the name deploy.

Leave the Token field as Studio filled it, then click Add.

Settings → Project settings → Triggers → Add a trigger → An HTTP call

The Token field does not hold a value. It holds a reference to a secret, ${SECRET:trigger.deploy.token} in our test, and the box says to create the value after saving. It is the same kind of line as in the file of the CLI steps, where the secret was named hooks.deploy.

What you should see
The box with the type An HTTP call selected.

[image: The New trigger box with the type An HTTP call selected, the name deploy and the token field holding a secret reference.]

The New trigger box for a webhook.

##### 08Read the missing token

###### Objective

Studio tells you the secret does not exist yet.

###### Actions

Read the deploy row: its When column says HTTP call with token and, under it, no token yet.

Read the orange line above the table.

⚠ trigger 'deploy': secret 'trigger.deploy.token' is not set yet

The warning is the same one that hdrctl trigger validate printed in the CLI steps, and it names the command that fixes it. In Studio, the key button of the row fixes it too.

What you should see
A row with an orange no token yet and a key button.

[image: The Triggers tab with the rows nightly and deploy: the deploy row says no token yet, a warning line names the missing secret, and the row has a key button.]

The deploy row before its token exists.

##### 09Create the token

###### Objective

Generate it once, and copy it.

###### Actions

Click the key button of the deploy row.

Read the explanation, then click Create the token.

Copy the token with Copy the token, or from the box.

🔑 → Create the token

The token is a random value saved as the project secret trigger.deploy.token in .hydra/secrets, a file git ignores. The box shows it once, with a PowerShell command and a curl command for the URL of the webhook, /api/projects/<id>/triggers/deploy/webhook. Once it exists, the row says token set and the box offers Replace the token, whose value cannot be shown again.

What you should see
A box with the token, the two commands and the line saying where the secret was saved.

[image: The Token of deploy box before the token exists, with the explanation that it is saved as a project secret and a Create the token button.]

The box, before you create the token.

[image: The Token of deploy box after creation: the token value shown once, a Copy the token button, and PowerShell and curl commands with the webhook URL.]

The token, shown once, with the commands to call the webhook.

#### What should I have at the end?

VerificationExpected result

Triggertype: webhook, token: ${SECRET:name}

Tokenhdrctl trigger token NAME [--rotate]

CallPOST /api/projects/ID/triggers/NAME/webhook

HeaderX-Hydra-Token or Authorization: Bearer

Answers202 started, 401 token, 404 unknown

#### What if something goes wrong?

SymptomCauseFix

token requiredNo X-Hydra-Token or Bearer headerAdd the header

invalid tokenThe token does not match the secretCopy it again, or rotate it

no webhook trigger 'x'The name is wrong, the type is not webhook, or the trigger is disabledCheck hdrctl trigger list

Project 'id' not foundThe server does not know the projectRegister it with POST /api/projects/open

#### Frequently asked questions

##### How do I start a Hydra ETL project from another system?

Declare a trigger of type webhook, create its token with hdrctl trigger token NAME, run hdrctl serve, and call POST /api/projects/PROJECT_ID/triggers/NAME/webhook with the token in a header. In our test on Hydra ETL 0.22, a valid call answered 202 and the project ran in about 2.5 seconds.

##### Where do I put the token?

In the header X-Hydra-Token, or in Authorization: Bearer. Both worked in our test. The token is stored as a secret named in the trigger, in .hydra/secrets of the project.

##### What answers do I get when the call is wrong?

A call with no token answered 401, token required. A wrong token answered 401, invalid token. An unknown trigger name answered 404, no webhook trigger. We read the 503 answer, for a token that was never created, in the source and did not test it.

##### Can I send data with the webhook?

According to the source, nothing from the request is passed to the project: the call only starts the run. We did not test sending a body.

##### Does the webhook trigger work with hdrctl watch?

No. According to the list output, a webhook is called through hdrctl serve. hdrctl watch is for time, file and source triggers.

##### Can I create the webhook token in Hydra Studio?

Yes. In the Triggers tab, the key button of a webhook row opens a box with a Create the token button. The token is shown once, with a PowerShell and a curl command, and it is saved as a project secret in .hydra/secrets.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Declare project triggers

Store and use secrets

Launch a job from the CLI and the API

#### Next lesson

One trigger, one token, one URL. Not covered here: sending data with the call, and the 503 answer when the token was never created.

Back to Triggers →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Start from a Hydra Studio workflow template: View YAML and Copy YAML — slug: /studio/start-from-a-template/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons09 · Start from a template▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 10

Lesson 10 of 65 · Start from a template

### Start from a Hydra Studio workflow template: View YAML and Copy YAML

Studio ships three ready-made workflows. Open them, read their YAML, and copy the one closest to what you need instead of starting from a blank file.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Templatesabout 10 minutesStudio running

Quick answer
The Templates page of Hydra Studio lists three workflow templates: CSV → CSV, API → Database and Parallel ETL. Select View YAML to read one and Copy YAML to copy it. A template is a workflow file: the jobs it refers to are yours to create.

#### What will you learn in this lesson?

##### Goal

Open the Templates page, read the YAML of each template, tell the three apart, and copy one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra and hdrctl serve running. See Install and start.

#### How do I use a Hydra Studio template?

##### 01Open the Templates page

###### Objective

Find the ready-made workflows.

###### Actions

Select Templates in the sidebar.

Read the three cards.

Sidebar → Templates

The title reminds you of the count, 3 ready-to-use workflow templates. Every card carries a name, an ETL category badge and one line that says what the workflow does.

What you should see
Three cards, each with a View YAML button on the left and a Copy YAML button on the right.

CSV → CSV Reads a CSV file, applies a transformation, writes a CSV file.
API → Database Fetches data from a REST API and loads it into a database.
Parallel ETL Two extractions run in parallel, then a load that waits for both.

[image: The three template cards of Hydra Studio in the dark theme: CSV to CSV, API to Database and Parallel ETL, each with a View YAML button and a Copy YAML button.]

The three cards, with View YAML and Copy YAML.

##### 02Read the YAML of CSV → CSV

###### Objective

See the smallest workflow: two jobs in a row.

###### Actions

Select View YAML on the CSV → CSV card.

Read it, then select Hide YAML.

CSV → CSV → View YAML

The workflow starts manually and has two steps of type job. The second one names the first in depends_on, so it runs afterwards. The jobs are referenced by path and are not part of the template.

What you should see
The YAML opens under the card, in a scrollable block.

version: "1.0"
workflow:
name: csv_to_csv
trigger:
type: manual
steps:
- name: extract_csv
type: job
job: ./jobs/extract
- name: load_csv
type: job
job: ./jobs/load
depends_on: [extract_csv]

[image: The Templates page of Hydra Studio in the light theme with the YAML of the CSV to CSV template expanded under its card: a manual trigger, an extract_csv job and a load_csv job that depends on it.]

The YAML of CSV → CSV, expanded.

##### 03Tell the three templates apart

###### Objective

Pick the template whose shape matches your need.

###### Actions

Select View YAML on the two other cards.

Compare the trigger and the steps.

API → Database · Parallel ETL → View YAML

The three templates differ by their trigger and by the way steps depend on each other.

TemplateTriggerSteps

CSV → CSVmanualextract_csv then load_csv

API → Databaseschedule, cron 0 8 * * *fetch_api, load_db, then a webhook action notify that is skipped if it fails (on_failure: skip)

Parallel ETLmanualextract_a and extract_b side by side, then load which depends on both

A schedule trigger runs only while hdrctl serve is running.

What you should see
Each YAML starts with version: "1.0" and a workflow: block.

api_to_db trigger: schedule cron: "0 8 * * *"
parallel_etl load depends_on: [extract_a, extract_b]

##### 04Copy the template

###### Objective

Take the YAML to your own project.

###### Actions

Select Copy YAML on the card you chose.

Paste it into a new file in the workflows folder of your project.

Copy YAML

Studio copies the whole workflow to the clipboard and shows Copied for a moment. The pasted file refers to jobs such as ./jobs/extract and ./jobs/load, which you create in your project. In the API → Database template, replace the webhook URL, which the template writes as {{ env.WEBHOOK_URL }}, with your own. The lessons on jobs and workflows show how to build those jobs.

What you should see
The button label changes to Copied, then returns to Copy YAML.

Copied

###### Tips and tricks

Read the YAML before you copy it: the step names, the trigger and the job paths are what you will edit.

Start from CSV → CSV for a first workflow: it has two steps and no schedule.

A template does not include its jobs. A workflow that points to ./jobs/extract needs a job of that name in your project.

The schedule of API → Database only fires while hdrctl serve runs.

#### What should I have at the end?

VerificationExpected result

Templates pageThree cards: CSV → CSV, API → Database, Parallel ETL

View YAMLOpens the workflow under its card

Copy YAMLShows Copied, then Copy YAML again

ReadingYou can tell the trigger and the dependencies of each template

#### What if something goes wrong?

SymptomCauseFix

Copy YAML does nothingThe browser blocks clipboard accessSelect View YAML and copy the text by hand

The pasted workflow cannot find its jobsTemplates do not include jobsCreate the jobs the paths name

The Templates page is emptyNo template is availableThe page then shows No templates

The scheduled workflow does not startNo server is runningKeep hdrctl serve running

#### Frequently asked questions

##### What templates does Hydra Studio include?

Hydra ETL 0.22 lists three workflow templates in the ETL category: CSV → CSV, API → Database and Parallel ETL. Each card shows a short description, its YAML and a button that copies the YAML.

##### Does a template create jobs for me?

No. A template is a workflow file. It refers to jobs by path, for example ./jobs/extract and ./jobs/load, and does not include them: you create those jobs in your project.

##### How do I copy a template?

Select Copy YAML on its card. Studio copies the whole workflow to the clipboard and shows Copied for a moment. Paste it into a workflow file of your project.

##### Which template runs on a schedule?

API → Database. Its trigger is a schedule with the cron expression 0 8 * * *, and it ends with a webhook action that is skipped if it fails. The two other templates start manually.

##### What does depends_on do in a template?

It makes a step wait for the steps it names. In Parallel ETL, the load step depends on both extractions, so it starts only after both finish.

#### Related lessons

Tour the Studio pages

Read the YAML Studio generates

Compose jobs in a workflow

Hydra DSL reference

#### Next lesson

You can read and copy a workflow. The next lessons build the jobs it needs.

Create a job →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Store and use secrets in a Hydra ETL project — slug: /studio/store-and-use-secrets-with-hdrctl/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons23 · Secrets▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 30

Lesson 30 of 65 · Secrets

### Store and use secrets in a Hydra ETL project

Keep a token out of your YAML: hdrctl secret set stores it in .hydra/secrets and ${SECRET:name} reads it at run time, masked in the logs.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl secretabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl secret set NAME stores a value in .hydra/secrets of the project. A job or a workflow reads it with ${SECRET:NAME}, and Hydra masks it in what it prints. In Studio, the Secrets tab of the project settings does the same and never shows a value.

#### What will you learn in this lesson?

##### Goal

Store a secret, use it in a workflow, read it masked, hidden and plain, make an environment variable and a per-environment file override it, then delete it. Then add secrets from the Secrets tab of Studio, for all environments or for one.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project: hdrctl init secrets-demo, then cd secrets-demo. Use made-up values: never put a real password in a lesson.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I store and use a secret in Hydra ETL?

##### 01Store a secret

###### Objective

One command, no value in the YAML.

###### Actions

Run the command below in the project folder.

Check the list.

echo abc123-demo-token| hdrctl secret set api.token --stdin
hdrctl secret list

Without --stdin, the command asks for the value and hides what you type. The list shows names and scope, never values. The value is in clear text in .hydra/secrets, and hdrctl init adds that file to .gitignore.

What you should see
Secret api.token saved, then the name with six dots.

ok Secret api.token saved in ...\.hydra\secrets

Secrets of secrets-demo ...\.hydra\secrets
api.token common ••••••

##### 02Use it in a workflow

###### Objective

Write the placeholder.

###### Actions

Create workflows/wf-secret.yaml with the content below.

Run it.

hdrctl workflow run workflows\wf-secret.yaml

The log step writes a message. The placeholder ${SECRET:api.token} is replaced at run time.

version: "1.0"
workflow:
name: wf-secret
trigger:
type: manual
steps:
- name: show_token
type: action
action: log
params:
message: "Calling the API with token ${SECRET:api.token}"

What you should see
The step is OK and the value is masked.

✓ Step 'show_token' OK (0.0s)
│ Calling the API with token [MASKED]

##### 03Choose what the logs show

###### Objective

masked, hidden or plain.

###### Actions

Run the workflow again with --secrets-visibility hidden.

Then with plain.

hdrctl workflow run workflows\wf-secret.yaml --secrets-visibility hidden

masked is the default. hidden removes the whole line and says how many lines it removed. plain shows the value after a warning: use it to debug, then go back.

What you should see
A hidden line count, then the value in plain text with a warning.

│ [1 line(s) hidden: they contain a secret]

secrets visibility is 'plain': secret values are shown in logs and messages (debugging only)
│ Calling the API with token abc123-demo-token

##### 04Let an environment variable win

###### Objective

Check the order.

###### Actions

In the terminal, set API_TOKEN (set API_TOKEN=from-the-shell on Windows).

Run the workflow with --secrets-visibility plain.

hdrctl workflow run workflows\wf-secret.yaml --secrets-visibility plain

${SECRET:api.token} reads API_TOKEN first. Use this in CI, where the value comes from the platform. Remove the variable when you are done.

What you should see
The value of the shell, not the file.

│ Calling the API with token from-the-shell

##### 05Keep one secret per environment

###### Objective

Add --env.

###### Actions

Run the first command below.

Run the workflow with --env prod.

echo prod-token-999| hdrctl secret set api.token --env prod --stdin
hdrctl workflow run workflows\wf-secret.yaml --env prod --secrets-visibility plain

The value goes to .hydra/secrets.prod. The list says prod in the scope column. A run with --env prod reads that file before .hydra/secrets.

What you should see
A new file in .hydra, and the prod value in the run.

api.token prod ••••••

project.json
secrets
secrets.prod

│ Calling the API with token prod-token-999

##### 06Read the errors, then delete

###### Objective

Three cases.

###### Actions

Use ${SECRET:not.defined} in a workflow and run it.

Run hdrctl secret delete api.token twice.

Try to store an empty value.

hdrctl secret delete api.token

A missing secret fails the step, and the message lists where Hydra looked. Deleting a name that is gone fails too. An empty value is refused.

What you should see
Three messages, one per case.

✗ Step 'show_missing' FAILED: SecretResolutionError: Missing secret: not.defined — not in the environment (NOT_DEFINED) nor in the project secrets files (.hydra/secrets or HYDRA_SECRETS_FILE)

ok Secret api.token deleted from ...\.hydra\secrets
❌ secret 'api.token' not found in secrets

❌ The value is empty: nothing saved.

###### Tips and tricks

Use --stdin in scripts: the value never appears on the screen of an interactive prompt.

Name secrets with dots (db.password): the matching environment variable is the same name in capitals with an underscore (DB_PASSWORD).

.hydra/secrets is plain text. Keep it out of Git: the .gitignore of hdrctl init does, but a project made by hand may not.

A value of three characters or fewer is stored, but it is too short to mask. Our test saved abc without error. Use real-length values.

Masking only changes what Hydra prints. The value is still sent, unchanged, to the connector, the script or the webhook that uses it.

##### 07Add a secret in Studio

###### Objective

Store a value from the Secrets tab.

###### Actions

Click Settings, then Project settings, then the Secrets tab.

Type the name db.password and a value. The value box hides what you type.

Click Add.

Settings → Project settings → Secrets → Add

A name takes letters, digits, dots, underscores and hyphens, and Studio says so in red if you type anything else. The page says where the values go: the file .hydra/secrets of the project, ignored by git. The button reads Replace instead of Add when the name already exists in the list.

What you should see
The form, filled in, with the value hidden.

[image: The Secrets tab of the project settings with the name db.password typed and a hidden value, above an Add button, and the note that the file is ignored by git.]

The Secrets tab, before Add.

##### 08Read the list

###### Objective

See what Studio shows, and what it never shows.

###### Actions

Read the new row: name, value, source and reference.

Open .hydra/secrets to see what was written.

type .hydra\secrets | findstr /v "^#"

The value column shows six dots whatever the length of the secret: according to the page, values are never displayed, and you type a new value to replace one. The From column says common. The last button copies the reference to paste in a field, ${SECRET:db.password}.

What you should see
One row, six dots, and one line in the file.

db.password=change-me-demo

[image: The Secrets tab after adding db.password: one row with the name, six dots instead of the value, the source common, and a button copying the reference SECRET:db.password.]

The secret in the list, without its value.

##### 09Give a secret to one environment

###### Objective

Use the scope list.

###### Actions

In Secrets for, choose prod. The environment must exist: create it as shown in the Environments lesson.

Add api.token with a value: the button now reads Add to prod.

Secrets for → prod → Add to prod

Studio creates .hydra/secrets.prod beside the common file; in our test it held one line, api.token=prod-token-demo. The list then shows both secrets with their source, common or prod. According to the text of the page, a secret of an environment wins over the common one when a run uses that environment.

What you should see
api.token from prod and db.password from common.

api.token=prod-token-demo

[image: The Secrets tab with the scope set to prod: the list shows db.password from common and api.token from prod, and the file name .hydra/secrets.prod.]

Two secrets, from two scopes.

#### What should I have at the end?

VerificationExpected result

Storehdrctl secret set NAME [--env E] [--stdin]

Listhdrctl secret list [--env E]

Deletehdrctl secret delete NAME [--env E]

Use${SECRET:NAME}

Visibility--secrets-visibility plain|masked|hidden

#### What if something goes wrong?

SymptomCauseFix

Missing secret: NAMEThe name is in no environment variable and no secrets fileRun hdrctl secret list, then hdrctl secret set

secret 'NAME' not found in secretsThe name is not in the file of that scopeCheck the name and the --env option

The value is empty: nothing saved.The input line was emptyPipe a value, or type one at the prompt

#### Frequently asked questions

##### Where does Hydra ETL store secrets?

In the file .hydra/secrets of the project, one name=value per line. hdrctl secret set writes it for you. The file is in clear text, and the .gitignore created by hdrctl init lists it, so that it is not committed.

##### How do I use a secret in a job or a workflow?

Write ${SECRET:name} where the value goes, for example ${SECRET:api.token}. Hydra replaces it when the job or workflow runs. We tested it in a log step of a workflow.

##### Are secret values shown in the logs?

By default they are replaced by [MASKED]. With --secrets-visibility hidden the line that contains a secret is removed and a message counts the removed lines. With plain the value is shown, and Hydra warns that it is for debugging only.

##### What wins when the secret is also an environment variable?

The environment variable. ${SECRET:api.token} first reads API_TOKEN from the environment, then the file. In our test, API_TOKEN set in the shell replaced the value of the file.

##### How do I keep a different secret per environment?

Add --env to the command: hdrctl secret set api.token --env prod writes .hydra/secrets.prod. A run with --env prod then reads that value first. We tested it with hdrctl workflow run.

##### Can I manage secrets in Hydra Studio?

Yes. The Secrets tab of the project settings adds, replaces and deletes secrets. In our test it wrote db.password to .hydra/secrets, showed six dots in place of the value, and the scope list created .hydra/secrets.prod for an environment.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Project settings and Global settings

Declare project triggers

Manage projects from the CLI

#### Next lesson

A secret lives in the project, is read by name, and is masked in what Hydra prints. Not covered here: SOPS files and external vaults.

Back to Settings →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra Studio tutorials — slug: /studio/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

LessonsTutorials overview▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes for the lessons available today

Get started›Hydra Studio

Hydra Studio learning track

### Hydra Studio tutorials

Learn Hydra ETL Studio from first launch to orchestration and resilience: jobs, sources, transformations, actions, workflows, fallbacks, triggers, the MCP server and production.

49 lessonsabout 90 minutes for the lessons available todaybeginner to independent

Course map

#### All lessons

Follow them in order, or jump to the one you need.

##### Get started with Studio
01
Get started with Studio

##### Install Hydra ETL and start Studio

Install the hydra-etl package, start hdrctl serve and open Studio in your browser.
hdrctl serve
Start → 02
Get started with Studio

##### Create a project and its first workflow

Create the course workspace, add first-workflow to it, and choose how the workflow is triggered.
Overview
Start → 03
Get started with Studio

##### Confirm Studio is talking to the engine

Read the connection indicator and know what stops working when it goes silent.
API online
Start → 04
Get started with Studio

##### Tour the Studio pages

Overview, Jobs, Runs, Templates, Insights and Settings: what each page is for.
Pages
Start → 05
Get started with Studio

##### Recognize nodes, ports and edges

A guided tour of first-workflow: jobs, actions, containers and the YAML they produce.
Jobs configuration
Start → 06
Get started with Studio

##### Everything Hydra can do, in one panel

Thirteen sources, twenty transformations, ten destinations, the actions, control-flow nodes and containers.
Node palette
Start → 07
Get started with Studio

##### Use the bottom panel: Logs, Parameters, Secrets, Terminal

The panel under the canvas, and what each of its four tabs gives you.
Logs · Terminal
Start →

##### Jobs
08
Jobs

##### Create a job, then give it a source

A job is four manifests in a folder. Create one from the canvas, then configure a file, database or HTTP source.
Sources
Start → 09
Jobs

##### Start from a workflow template

Read the three ready-made workflows in Templates, and copy one.
Templates
Start → 10
Jobs

##### Import a job

Import a job folder from the Import menu, save it into the project and run it.
Import
Start → 11
Jobs

##### Read the manifests Studio generates

Open the generated DSL and read it critically. The YAML shows what the canvas leaves out, and keeps both in sync.
Hydra DSL
Start → 12
Jobs

##### Resolve what the validity badge reports

Complete an incomplete design until the header turns valid, before any data moves.
Valid
Start → 13
Jobs

##### Four ways to run, one engine underneath

Import a job, finish it, then run it from the canvas, the workflow, the built-in terminal and your own shell.
Run Job
Start → 14
Jobs

##### Find a past execution and its result

Locate a finished run, read what it produced and compare it with the previous one.
Runs
Start → 15
Jobs

##### Diagnose a failed run

Read the run error, find the failing step and decide between fixing and running again.
Logs
Start → 16
Jobs

##### Read the Insights statistics

What the Insights page measures across your runs, and what it does not.
Insights
Start →

##### Sources, transformations and destinations
17
Sources, transformations and destinations

##### Reshape the data between source and destination

The first ten transformations, the order the canvas imposes, and the engine selector (auto, pandas, duckdb).
Transformations
Start → 18
Sources, transformations and destinations

##### Close the job with a destination

The same dialogs as a source, one rule that differs: a job writes to exactly one place.
Destinations
Start →

##### Actions
19
Actions

##### Log, Python and shell actions

Write a log line or run a Python or PowerShell script from a workflow.
Actions
Start → 20
Actions

##### Webhook and email actions

Call a URL and send an email from a workflow, test both against a local server and read the errors.
Actions
Start →

##### Settings, parameters, environments and secrets
21
Settings, parameters, environments and secrets

##### One placeholder, two values, two results

Create a parameter mid-run, read it from a job, change it, and watch the second job answer differently.
Set Param
Start → 22
Settings, parameters, environments and secrets

##### Environments

Create environments with hdrctl env, read their variables in a workflow and pick one with --env.
Environments
Start → 23
Settings, parameters, environments and secrets

##### Secrets

Store a token with hdrctl secret, use it in a workflow and choose what the logs show.
Secrets
Start → 24
Settings, parameters, environments and secrets

##### Project settings and Global settings

Autosave, preview rows, disk sync and the environments manager.
Settings
Start →

##### Orchestration and resilience
25
Orchestration and resilience

##### Turn your jobs into an ordered workflow

Place jobs on the workflow canvas and declare which one waits for which.
Workflow configuration
Start → 26
Orchestration and resilience

##### Create a workflow

Add an empty workflow with hdrctl, see where it lands in thread.yaml, and remove it.
Workflows
Start → 27
Orchestration and resilience

##### Define the execution order

Set stages, modes, waits and loops in Project settings.
Execution order
Start → 28
Orchestration and resilience

##### Preview the execution order

Read the diagram of stages, waits, loops and fallbacks.
Preview
Start → 29
Orchestration and resilience

##### Check the execution order

Find missing workflows before a run.
Check
Start → 30
Orchestration and resilience

##### Run workflows in sequence or in parallel

Declare stages in thread.yaml, run workflows together and measure what parallel saves.
thread.yaml
Start → 31
Orchestration and resilience

##### Repeat workflows with loops

Replay part of a project several times, with a pause before each new pass.
delay_after
Start → 32
Orchestration and resilience

##### Organize workflow steps with containers

Group steps in a sequence, detach them safely, and apply error or retry behavior from the canvas.
Containers
Start → 33
Orchestration and resilience

##### Error Scope

Set on_failure to fail, skip or continue and see what each does to the steps after it.
Error Scope
Start → 34
Orchestration and resilience

##### Retry Scope

Add max, delay and backoff to a step and read how long the workflow waits.
Retry Scope
Start → 35
Orchestration and resilience

##### All-or-nothing loads

Make a load either complete or leave nothing behind.
Transaction
Start → 36
Orchestration and resilience

##### Roll back a failed workflow

Return to the previous state with rollback.
rollback
Start → 37
Orchestration and resilience

##### Declare the undo of an action

Say how each action is reversed with undo or undo: none, and finish an interrupted rollback.
undo
Start → 38
Orchestration and resilience

##### Resolve conflicts and recover

Interrupted runs, leftovers and how to restart safely.
Recovery
Start → 39
Orchestration and resilience

##### Declare a fallback workflow

Switch to a backup workflow when a probe or a step fails.
fallback
Start → 40
Orchestration and resilience

##### Fallback conditions: when, on_failure, on_probe_error

Choose exactly when the fallback takes over.
when
Start → 41
Orchestration and resilience

##### Set timeouts on workflow steps

Stop a step that runs too long.
timeout
Start → 42
Orchestration and resilience

##### Dry run and --use-fallback

Rehearse a workflow without side effects.
--dry-run
Start → 43
Orchestration and resilience

##### Branch with the Condition node

Choose a path from a parameter or a file test.
Condition
Start → 44
Orchestration and resilience

##### Wait with the Delay node

Pause a workflow for a fixed time.
Delay
Start → 45
Orchestration and resilience

##### Schedule trigger

Declare a cron trigger with a time zone, run hdrctl watch and read the runs it starts.
schedule
Start → 46
Orchestration and resilience

##### Webhook trigger

Declare a webhook trigger, create its token and start a project with one HTTP call.
webhook
Start → 47
Orchestration and resilience

##### Orchestrate from thread.yaml

Read, validate and fix the project-level orchestration file.
thread.yaml
Start → 48
Orchestration and resilience

##### Scenario: build a resilient pipeline

Combine fallback, retry and undo in one project.
Scenario
Start → 49
Orchestration and resilience

##### Scenario: break it, then recover

Cause failures on purpose and read how the project reacts.
Scenario
Start →

Explore a job without installing →Switch to Hydra CLI

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Switch environments in Hydra ETL with hdrctl env — slug: /studio/switch-environments-with-hdrctl-env/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons22 · Environments▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 29

Lesson 29 of 65 · Environments

### Switch environments in Hydra ETL with hdrctl env

Create dev and prod environments with hdrctl env, read their variables with ${ENV:NAME}, and pick one for a run with --env.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl envabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl env manages environments: common variables, one file per environment, and a parameter file in the project. A run picks one with --env NAME, and a job or workflow reads a variable with ${ENV:NAME}. In Studio, the Environments card of Global settings does the same.

#### What will you learn in this lesson?

##### Goal

Redirect the settings folder, set common and prod variables, run a workflow with and without --env, then unset, rename and delete. Then create the same environment in Studio and choose it as the active one.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project: hdrctl init envx-demo, then cd envx-demo.

An empty folder for the settings, so that nothing is written in your own settings: set HYDRA_HOME=C:\temp\fake-home on Windows. Skip this line to use your real ones.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I switch environments in Hydra ETL?

##### 01Set common variables

###### Objective

Values every run gets.

###### Actions

Run the two commands below.

hdrctl env set REGION eu-west
hdrctl env set API_URL https://dev.example.test

Without --env, env set writes the common file, named env, in the settings folder.

What you should see
Two ok lines that name the file env.

ok REGION set for (common) (...\fake-home\env)
ok API_URL set for (common) (...\fake-home\env)

##### 02Create the prod environment

###### Objective

One command, two files.

###### Actions

Create the environment.

Give it its own API_URL.

hdrctl env create prod
hdrctl env set API_URL https://api.example.test --env prod

env create makes env.prod in the settings folder and environments/prod.yaml in the project. The project file holds parameter values, as in Manage projects from the CLI. Add --global-only to skip it.

What you should see
A box that says Environment 'prod' created and two created lines.

✅ Environment 'prod' created
created ...\fake-home\env.prod
created ...\envx-demo\environments\prod.yaml

ok API_URL set for prod (...\fake-home\env.prod)

##### 03List and show

###### Objective

See what each scope holds.

###### Actions

Run the two commands below.

hdrctl env list
hdrctl env show prod

list counts variables, parameter values and secrets for each environment. show prints the variables of one scope. Run env show with no name for the common ones.

What you should see
A count per scope, then the names and values.

(common) 2 variable(s)
prod 1 variable(s) · 0 parameter value(s) · no secrets

Global variables — prod
API_URL https://api.example.test

##### 04Read a variable in a workflow

###### Objective

Use ${ENV:NAME}.

###### Actions

Create workflows/wf-env.yaml with the content below.

Run it with and without --env prod.

hdrctl workflow run workflows\wf-env.yaml
hdrctl workflow run workflows\wf-env.yaml --env prod

The environment overrides the common value where both define a name. Here prod sets API_URL only: REGION still comes from the common file.

version: "1.0"
workflow:
name: wf-env
trigger:
type: manual
steps:
- name: show_env
type: action
action: log
params:
message: "Target: ${ENV:API_URL} (region ${ENV:REGION})"

What you should see
The dev URL first, the prod URL second, the same region.

│ Target: https://dev.example.test (region eu-west)
│ Target: https://api.example.test (region eu-west)

##### 05Try a name that does not exist

###### Objective

No error.

###### Actions

Run the workflow with --env staging.

hdrctl workflow run workflows\wf-env.yaml --env staging

The run uses the common values and prints no warning. A typo in --env therefore looks like a success: check the name with hdrctl env list.

What you should see
The dev URL again.

│ Target: https://dev.example.test (region eu-west)

##### 06Unset, rename, delete

###### Objective

Change an environment safely.

###### Actions

Remove REGION and run the workflow.

Rename prod to production.

Delete it with -y.

hdrctl env unset REGION
hdrctl env rename prod production
hdrctl env delete production -y

A variable defined nowhere stops the step. rename and delete move both files, and each one keeps a copy in a _backups folder of the settings folder first. After a rename, update the scripts that pass the old name to --env.

What you should see
A failed step, a rename box, a delete box with a backup path.

✗ Step 'show_env' FAILED: SecretResolutionError: Missing environment variable: REGION

✅ Environment 'prod' renamed to 'production'
Update the scripts and schedules that pass --env with the old name.

✅ Environment 'production' deleted
Backup: ...\fake-home\_backups\20261124-075240-delete-production

###### Tips and tricks

Set HYDRA_ENV=prod in the shell once, instead of repeating --env prod on every command.

Keep tokens in secrets, not in environment variables: the files of hdrctl env are plain text.

An unknown --env name falls back to the common values and prints nothing.

The global files are in the settings folder of your user, shared by all your projects. A variable you set for one project reaches the others.

##### 07Open the Environments card

###### Objective

Find the global variables in Studio.

###### Actions

Click Settings, then Global settings.

Find the Environments card and stay on the Common tab.

Settings → Global settings → Environments

The card says where it saves: in the settings folder of this machine, not in the browser, so every project sees the same variables. The Common tab lists the values every run gets. In our test it held REGION and API_URL, set earlier with hdrctl env set.

What you should see
A Common tab with two variables.

[image: The Environments card of Global settings on the Common tab, with the variables REGION and API_URL, an Add variable button and a Save common variables button.]

The Common tab.

##### 08Create the prod environment

###### Objective

One click, one name.

###### Actions

Click New environment.

Type prod and press Enter, or click the check mark.

New environment → prod

A new tab named prod appears and is selected. It starts with the line No variable.. The tab also gets Rename and Delete buttons; according to the text of the page, Delete keeps a copy of the file in the _backups folder.

What you should see
The name box beside the Common tab.

[image: The Environments card with the New environment box open and the name prod typed, next to the Common tab.]

The name box of the new environment.

##### 09Set a variable and save

###### Objective

Write a value for prod.

###### Actions

Click Add variable.

Type API_URL as the name and https://api.example.test as the value.

Click Save prod.

Add variable → Save prod

A name takes letters, digits and underscores, and cannot start with a digit; a duplicate name is flagged in red. The message Saved appears for two seconds, and the file shown above the table is the one Studio wrote: env.prod in the settings folder.

What you should see
Saved, and a file with one line of variable.

API_URL=https://api.example.test

[image: The Environments card on the prod tab after Save: one variable API_URL with the value https://api.example.test, the file name env.prod and the message Saved.]

The prod tab after Save prod.

##### 10Choose the active environment

###### Objective

Pick it where you run.

###### Actions

Open the project page.

In the Environment list, choose prod. The Manage link opens the card you just used.

Project page → Environment → prod

The list starts on default (no environment). According to the text of the card, runs started from Studio then load the common variables, then those of the chosen environment, which is what --env prod does on the command line. The editor has the same list.

What you should see
The list, with the Manage link beside it.

[image: The Environment list on the project page, set to default (no environment), next to a Manage link that opens the Environments card.]

The environment list of the project page.

#### What should I have at the end?

VerificationExpected result

Sethdrctl env set NAME VALUE [--env E]

Create / deletehdrctl env create E, hdrctl env delete E -y

Inspecthdrctl env list, hdrctl env show [E]

Renamehdrctl env rename OLD NEW

Use${ENV:NAME}, --env E, HYDRA_ENV

RedirectHYDRA_HOME=

#### What if something goes wrong?

SymptomCauseFix

Missing environment variable: NAMEThe name is in no environment file and not in the shellRun hdrctl env show, then hdrctl env set

NAME is not defined for (common)env unset on a name that is not thereCheck the scope with hdrctl env show

#### Frequently asked questions

##### What is an environment in Hydra ETL?

A named set of values, such as dev or prod, that a run picks with --env. In our test on Hydra ETL 0.22, an environment held global variables (one file per environment in the Hydra home folder) and, inside the project, a file of parameter values.

##### How do I read an environment variable in a job or workflow?

Write ${ENV:NAME}. In our test, a log step with ${ENV:API_URL} printed the dev URL in a normal run and the prod URL with --env prod. A name that is defined in no file fails the step: Missing environment variable.

##### What happens if I give --env a name that does not exist?

Nothing fails. In our test --env staging ran with the common values, with no warning. Check the name with hdrctl env list.

##### Does an environment replace the common variables?

It adds to them and wins on a clash. In our test prod defined API_URL only, and REGION still came from the common file.

##### How do I try environments without touching my own settings?

Set HYDRA_HOME to an empty folder before you run the commands. The global files go there instead of the .hydra folder of your user. All the tests of this lesson used it.

##### Can I manage environments in Hydra Studio?

Yes. The Environments card of Global settings creates, renames and deletes environments and edits their variables. In our test it wrote env.prod in the settings folder, and the project page has a list to choose the active environment.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Store and use secrets

Manage projects from the CLI

Project settings and Global settings

#### Next lesson

Common values, one environment per target, one option to choose. Not covered here: the Environments panel of Studio.

Next: Secrets →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Tour the Hydra Studio pages: Overview, Runs, Templates, Insights and Settings — slug: /studio/tour-the-pages/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons04 · Tour the pages▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 4

Lesson 4 of 65 · Tour the pages

### Tour the Hydra Studio pages: Overview, Runs, Templates, Insights and Settings

Studio has six pages in its sidebar. Visit each one once, learn what it is for and where your jobs really live, so you never hunt for a page that does not exist.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Pagesabout 10 minutesStudio running

Quick answer
Hydra Studio has six pages, all in its sidebar: Overview (your projects), Runs (run history), Templates (ready-made workflows), Insights (run counters), Settings and Help. There is no Jobs page: you edit jobs inside a project.

#### What will you learn in this lesson?

##### Goal

Open each sidebar page once, read what it shows, and know which one to use for which task.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

Hydra Studio running at http://127.0.0.1:5678. The pictures of this lesson come from a clean Studio with its sample project.

#### How do I find my way around Hydra Studio?

##### 01Start from the Overview

###### Objective

Know where every project begins.

###### Actions

Select Overview in the sidebar.

Read the project list on the left.

Read the Get started card on the right.

Sidebar → Overview

The Overview lists your projects, with a search box, and offers three starting actions: Clone a repository (disabled in 0.22, marked coming soon), Open a project for an existing folder, and Create a project. A Links card points to the documentation and GitHub, and a Statistics card counts projects, active runs and the success rate.

What you should see
A project list and a Get started card. A project you select opens its workflows and jobs.

Get started: Clone a repository (disabled) · Open a project · Create a project
Statistics: Projects · Active runs · Success rate

[image: The Overview page of Hydra Studio in the light theme: the project list with one sample project, and the Get started, Links and Statistics cards.]

The Overview: projects on the left, actions and statistics on the right.

##### 02Read the Runs page

###### Objective

Find where runs are recorded.

###### Actions

Select Runs.

Read the filter tabs above the list.

Sidebar → Runs

Runs shows the runs recorded by the server, with a summary count at the right of the title. Five tabs filter the list: All, Running, Success, Failed and Pending. Before any execution it shows an empty state.

What you should see
On a fresh Studio, the empty state tells you to execute a workflow.

0 total · 0 running · 0 success · 0 failed
No runs
Execute a workflow to see runs here.

[image: The Runs page of Hydra Studio in the dark theme: the All, Running, Success, Failed and Pending filter tabs above an empty state reading No runs.]

The Runs page before the first execution.

##### 03Browse the templates

###### Objective

Start from a ready-made workflow instead of a blank canvas.

###### Actions

Select Templates.

Select View YAML on a card to read it.

Select Copy YAML to copy it.

Sidebar → Templates

Hydra ETL 0.22 ships three templates: CSV → CSV (reads a CSV file, applies a transformation, writes a CSV file), API → Database (fetches data from a REST API and loads it into a database) and Parallel ETL (two extractions run in parallel, then a load that waits for both). Each card shows its YAML and copies it to the clipboard.

What you should see
Three cards, each with a View YAML and a Copy YAML button.

3 ready-to-use workflow templates
CSV → CSV · API → Database · Parallel ETL

[image: The Templates page of Hydra Studio: three cards named CSV to CSV, API to Database and Parallel ETL, each with View YAML and Copy YAML buttons.]

The Templates page and its three cards.

##### 04Check the Insights counters

###### Objective

Read what Insights actually measures.

###### Actions

Select Insights.

Read the four counters and the average duration.

Sidebar → Insights

Insights is a small summary of the run history: Total runs, Successful, Failed and Running, plus the average duration in seconds. It reads the same runs as the Runs page, so it stays at zero until something has run.

What you should see
Four counters and one line. On a fresh Studio, all counters read 0 and the average duration shows a dash.

0 Total runs · 0 Successful · 0 Failed · 0 Running
Average duration: — s

[image: The Insights page of Hydra Studio in the dark theme: four counters reading 0, for total, successful, failed and running runs, and the line Average duration.]

Insights: counters and average duration.

##### 05Open Settings

###### Objective

Know which settings are global and which belong to a project.

###### Actions

Select Settings at the bottom of the sidebar.

Compare the Global settings and Project settings tabs.

Sidebar → Settings

Global settings apply to every project: the number of rows of the data viewer (10 by default), the environments shared by every project on the machine, and the interval at which an open job is compared with its files on disk (5 seconds by default). Environment variables are saved on the machine, not in the browser. Project settings belong to the current project. A later lesson covers environments and secrets in detail.

What you should see
Two tabs. The first one shows the data viewer, the environments (Common, dev, prod) and the job sync interval.

Global settings · Project settings
Data viewer: 10 rows · Environments: Common, dev, prod · Job files sync: 5 seconds

[image: The Settings page of Hydra Studio, Global settings tab: the data viewer row count, the Common, dev and prod environments with a table of variables, and the job files sync interval.]

Settings, Global settings tab.

##### 06Notice Help, and shrink the sidebar

###### Objective

Know what is not there yet, and win some screen width.

###### Actions

Select Help: read the card.

Select the ‹ button at the top of the sidebar to collapse it.

Select the arrow that appears to expand it again.

Sidebar → Help · ‹

Help is a placeholder in 0.22: a single card says that help is coming in a future sprint. The sidebar collapses to a column of icons, and Studio remembers your choice in this browser. The + button next to it returns to the Overview, where you create a project.

What you should see
The collapsed sidebar keeps the same six entries as icons; hover an icon to read its name.

Help — coming in a future sprint

[image: The expanded sidebar of Hydra Studio: the Hydra logo with plus, search and collapse buttons, then Overview, Runs, Templates and Insights.]

The expanded sidebar.

[image: The collapsed sidebar of Hydra Studio in the dark theme: only icons remain, with an arrow at the top to expand it.]

The collapsed sidebar.

[image: The Help page of Hydra Studio in the dark theme: a single card reading Help, coming in a future sprint.]

The Help placeholder.

###### Tips and tricks

Jobs and workflows have no sidebar page: open a project from the Overview, then a workflow.

Collapse the sidebar when you work on a wide canvas. Studio remembers it for this browser.

Do not wait for the Runs or Insights page to fill by itself: both stay empty until a workflow or a job has been executed.

Templates are a quick way to read how a workflow is written: select View YAML before you copy it.

#### What should I have at the end?

VerificationExpected result

Sidebar entriesOverview, Runs, Templates, Insights, then Settings and Help

OverviewProject list and the Get started card

TemplatesThree cards: CSV → CSV, API → Database, Parallel ETL

InsightsFour counters and an average duration, all empty on a fresh Studio

#### What if something goes wrong?

SymptomCauseFix

No Jobs page in the sidebarJobs are edited inside a projectOpen a project from the Overview, then Jobs configuration

Runs and Insights show nothingNo run is recorded yetExecute a workflow, then reload the page

Clone a repository cannot be selectedThe action is disabled in 0.22Use Open a project on a cloned folder

The sidebar shows only iconsIt is collapsedSelect the arrow at its top to expand it

#### Frequently asked questions

##### What pages does Hydra Studio have?

Hydra ETL 0.22 has six entries in the sidebar: Overview, Runs, Templates and Insights at the top, then Settings and Help at the bottom. Jobs and workflows have no page of their own: you open them from a project on the Overview.

##### Where are my jobs if there is no Jobs page?

Inside a project. Open the project from the Overview, open a workflow, and use Jobs configuration to edit a job and Workflow configuration to orchestrate jobs.

##### Why is the Runs page empty?

Runs lists the runs the server has recorded. On a fresh Studio it shows No runs, with the filter tabs All, Running, Success, Failed and Pending, and fills in as soon as a workflow is executed.

##### Why does Insights show only zeros?

Insights counts the same runs as the Runs page. With no run recorded, Total runs, Successful, Failed and Running read 0 and the average duration shows a dash.

##### Is the Help page available?

Not yet. In Hydra ETL 0.22 the page holds a single card saying that help is coming in a future sprint. Use the Documentation link on the Overview instead.

#### Related lessons

Check the Studio API connection

Create a project and its first workflow

Read the Studio canvas

Get started with Hydra ETL

#### Next lesson

You know the six pages. The next lesson opens a project and reads its canvas: nodes, ports and edges.

Read the canvas →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Use the Hydra Studio bottom panel: Logs, Parameters, Secrets and Terminal — slug: /studio/use-the-bottom-panel/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons07 · Bottom panel▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 7

Lesson 7 of 65 · Use the bottom panel

### Use the Hydra Studio bottom panel: Logs, Parameters, Secrets and Terminal

Under the canvas sits one panel with four tabs. Open it, read what each tab does, and run a command without leaving Studio.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Logs · Terminalabout 10 minutesan open job

Quick answer
The Hydra Studio bottom panel has four tabs: LOGS for the last run, PARAMETERS for project parameters, SECRETS for secret values and TERMINAL for a shell. Open it with the Logs panel button in the canvas toolbar.

#### What will you learn in this lesson?

##### Goal

Open the bottom panel, visit its four tabs, and run hdrctl --version in the Studio terminal.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

An open job in Studio, for example first-job of studio-course. The lesson Review a run reads the logs of a real run in detail.

#### How do I use the bottom panel in Hydra Studio?

##### 01Open the panel

###### Objective

Find the one button that brings the panel up.

###### Actions

Open a job in the editor.

In the vertical toolbar beside the canvas, select the terminal icon: its title is Logs panel.

Read the four tab names.

Toolbar → Logs panel

The panel docks under the canvas and above the job tabs. Running a job or a workflow opens it as well, on the LOGS tab. The cross at the right of the tab row closes it; the thin line on its top edge resizes it by dragging.

What you should see
A panel with the tabs LOGS, PARAMETERS, SECRETS and TERMINAL. LOGS is selected.

LOGS PARAMETERS SECRETS TERMINAL

[image: The Hydra Studio job editor in the light theme with the bottom panel open under the canvas, showing the LOGS tab, and the Logs panel button in the vertical toolbar.]

The panel open under the canvas of first-job.

##### 02Read the Logs tab

###### Objective

Know where the output of a run appears.

###### Actions

Select the LOGS tab.

Read the message in the empty panel.

BOTTOM PANEL → LOGS

Before any run, the tab invites you to run something. After a run it shows the log of the last execution, titled with the workflow name, with a SUCCESS or FAILED badge beside the tabs.

What you should see
An empty panel with a single line.

Run a job or workflow to view logs.

[image: The LOGS tab of the Hydra Studio bottom panel in the light theme, empty, with the message Run a job or workflow to view logs.]

The LOGS tab before the first run.

##### 03Open the Parameters tab

###### Objective

See where project parameters are declared.

###### Actions

Select the PARAMETERS tab.

Read the columns: name, type, default, one per environment, required and description.

BOTTOM PANEL → PARAMETERS

A parameter is declared once and can take a different value per environment. The default is written to parameters.yaml, and each environment column to environments/<env>.yaml. An empty cell inherits the default. Use a parameter as {{ param:name }} in any field, or params["name"] in a Script node. Add parameter creates a row and Save writes the files. A later lesson builds a full example.

What you should see
On a project without parameters, the table is empty and offers Add parameter and Save.

No parameter yet.
[ + Add parameter ] [ Save ]

[image: The PARAMETERS tab of the Hydra Studio bottom panel in the dark theme, with an empty table and the Add parameter and Save buttons.]

The PARAMETERS tab of a project without parameters.

##### 04Open the Secrets tab

###### Objective

See where secret values live, and why they never show.

###### Actions

Select the SECRETS tab.

Read the explanation above the list.

Open the SECRETS FOR list to see the scopes.

BOTTOM PANEL → SECRETS

Secrets are stored in .hydra/secrets, a file ignored by Git. Use one as ${SECRET:name} in any field. An environment variable with the same name in upper case (db.password becomes DB_PASSWORD) wins over the file. Values are never displayed: typing a new value replaces the old one. A secret of an environment wins over the common one when a run uses that environment.

What you should see
An empty list and two fields, name and value, with an Add button.

SECRETS FOR Common (all environments) .hydra/secrets
No secret yet.

[image: The SECRETS tab of the Hydra Studio bottom panel in the light theme: the Common environment scope, the explanation of the .hydra/secrets file, an empty list and the name, value and Add controls.]

The SECRETS tab of a project without secrets.

##### 05Run a command in the Terminal

###### Objective

Use a shell without leaving the editor.

###### Actions

Select the TERMINAL tab.

Select inside the terminal and type hdrctl --version.

Press Enter.

hdrctl --version

The terminal opens a shell tab named after the shell, pwsh 1 on Windows. The + at the right of the tabs opens another terminal and the cross closes them all. A right-click offers Clear, Copy, Paste and Save. Selecting a single Bash, PowerShell or SSH action node on the workflow canvas also shows a shortcut that opens the terminal on that shell.

What you should see
The version of Hydra ETL, the Python version, then a new prompt. The prompt of the picture was shortened for the page.

hydra 0.22.0 | Hydra ETL Framework | Python 3.13.7

[image: The TERMINAL tab of the Hydra Studio bottom panel in the dark theme, a pwsh 1 tab showing the command hdrctl --version and its result, Hydra ETL 0.22.0 on Python 3.13.7.]

The TERMINAL tab after hdrctl --version.

###### Tips and tricks

Keep the panel open while you build a job: running it switches to the LOGS tab by itself.

Use the Terminal for quick checks such as hdrctl validate, so the log of the editor stays on the LOGS tab.

A secret value is never shown again once saved. Keep your own copy of the value, or type a new one to replace it.

The splitter on the top edge of the panel resizes it. Give the canvas the room when you do not need the panel.

#### What should I have at the end?

VerificationExpected result

Panel openedFour tabs: LOGS, PARAMETERS, SECRETS, TERMINAL

Logs tabEmpty message before the first run

Parameters and Secrets tabsBoth empty on a project without parameters or secrets

Terminalhdrctl --version prints 0.22.0

#### What if something goes wrong?

SymptomCauseFix

The panel does not openThe panel is closedSelect the Logs panel button in the vertical toolbar

The Terminal tab stays emptyThe shell has not started yetWait a few seconds, then select inside the terminal

A secret appears emptyValues are never displayedType a new value to replace it

No Logs panel button on the toolbarThe job editor is not openOpen a job from the workflow

#### Frequently asked questions

##### How do I open the bottom panel in Hydra Studio?

Select the Logs panel button, the terminal icon at the bottom of the vertical toolbar beside the canvas. The panel also opens by itself when you run a job or a workflow. The cross at its right edge closes it.

##### What are the four tabs of the bottom panel?

LOGS shows the log of the last run, PARAMETERS edits the project parameters, SECRETS stores secret values for the project, and TERMINAL opens a shell inside Studio.

##### Where does Studio store the parameters and the secrets?

Parameter defaults are written to parameters.yaml and each environment column to environments/.yaml. Secrets go to .hydra/secrets, a file that Git ignores, and their values are never displayed.

##### How do I use a parameter or a secret in a field?

Write {{ param:name }} for a parameter, or params["name"] in a Script node, and ${SECRET:name} for a secret. An environment variable named in upper case, such as DB_PASSWORD for db.password, wins over the file.

##### Can I resize the bottom panel?

Yes. Drag the thin splitter on its top edge. In Hydra ETL 0.22 the height stays between 120 and 520 pixels.

#### Related lessons

Tour the Studio pages

Read the Studio canvas

Review a run

Use parameters

#### Next lesson

You know the whole editor frame. The next lessons open a job and build it step by step.

Create a job →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Wait with the Hydra Studio Delay node: pause a workflow for N seconds — slug: /studio/wait-with-the-delay-node/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons44 · Delay▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 51

Lesson 51 of 65 · Delay

### Wait with the Hydra Studio Delay node: pause a workflow for N seconds

The Delay node makes a workflow wait a fixed number of seconds. Place it between two steps, set the seconds and watch the run take exactly that long.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Delayabout 10 minutesHydra ETL 0.22

Quick answer
The Delay node of Hydra Studio pauses a workflow for N seconds before the next step starts. In YAML it is an action: delay step with params.seconds. In our test, a three second delay between two log steps made the run last 3.0 seconds.

#### What will you learn in this lesson?

##### Goal

Find the Delay node, read its dialog, write the YAML of a delay step, and run a workflow to see the pause.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A terminal: PowerShell on Windows.

#### How do I add a delay to a workflow?

##### 01Find the Delay node

###### Objective

Know where the node lives and what it asks for.

###### Actions

Open a workflow in Workflow configuration.

In the palette, expand Control Flow.

Drag Delay onto the canvas and double-click it.

Palette → Control Flow → Delay

Delay sits in Control Flow, next to Condition. Its dialog states what it does, Waits N seconds before continuing, and asks for four things: a step name, an optional run condition (it runs only if the result of an upstream Condition node is true), the required Delay (seconds) and a read-only node ID. The {x} button beside the seconds inserts a parameter.

What you should see
A dialog with a CONTROL_FLOW badge and the Delay (seconds) field, marked as required.

Delay CONTROL_FLOW Waits N seconds before continuing
Delay (seconds) * 5

[image: The Delay node dialog of Hydra Studio in the light theme: the step name action_delay_1, an empty run condition, the required Delay in seconds field showing the placeholder 5, and the node ID.]

The Delay dialog.

##### 02Write a workflow with a pause

###### Objective

See the same node as YAML.

###### Actions

Create a folder delay-demo with a workflows folder inside.

Save the YAML below as workflows\wf_wait.yaml.

workflows\wf_wait.yaml

Three steps of type action: a log, a delay and a second log. Each step depends on the previous one with depends_on, so the delay really sits between the two messages.

version: "1.0"
workflow:
name: wf_wait
trigger:
type: manual
steps:
- name: before
type: action
action: log
params:
message: "Before the pause"
- name: pause
type: action
action: delay
params:
seconds: 3
depends_on: [before]
- name: after
type: action
action: log
params:
message: "After the pause"
depends_on: [pause]

What you should see
A file of 23 lines.

##### 03Validate the workflow

###### Objective

Check the file before you run it.

###### Actions

Open a terminal in the delay-demo folder.

Run the command below.

hdrctl workflow validate workflows\wf_wait.yaml

Validation checks the actions, the keys, the parameters and the dependencies without running anything.

What you should see
A confirmation line.

Workflow valid — no errors detected.

##### 04Run it and watch the pause

###### Objective

Measure the delay.

###### Actions

Run the command below.

Read the duration of each step.

hdrctl workflow run workflows\wf_wait.yaml

The first log appears at once, then the run waits for the delay, then the second log appears. The summary reports the total time, which matches the delay because the log steps take no measurable time.

What you should see
Three steps OK, the pause lasting 3.0 seconds, and a summary line.

Workflow wf_wait

✓ Step 'before' OK (0.0s)
| Before the pause
✓ Step 'pause' OK (3.0s)
✓ Step 'after' OK (0.0s)
| After the pause

Workflow 'wf_wait' completed in 3.0s — 3/3 steps OK

[image: The Hydra Studio terminal in the dark theme after running the wf_wait workflow: the steps before, pause and after are marked OK, the pause lasting 3.0 seconds, and the workflow completed in 3.0s with 3 of 3 steps OK.]

The same run, from the Studio terminal.

###### Tips and tricks

Use a delay to wait for something outside Hydra, such as a file that another system is still writing.

Put the seconds in a parameter with the {x} button to change the pause without editing the workflow.

A delay adds its full duration to every run. Keep it as short as the wait you really need.

Seconds can be decimal: 0.5 waits half a second.

#### What should I have at the end?

VerificationExpected result

DialogThe Delay node asks for Delay (seconds), marked required

Validationhdrctl workflow validate prints Workflow valid

RunThe pause step reports 3.0s

TotalThe workflow completes in 3.0s with 3/3 steps OK

#### What if something goes wrong?

SymptomCauseFix

The Delay dialog will not saveDelay (seconds) is emptyEnter a number, or a parameter reference

The run fails on the delay stepseconds is not a numberWrite a plain number such as 3 or 0.5

The pause does not happenThe step does not sit between the others in depends_onChain the steps with depends_on

Workflow file not foundThe path is wrongRun the command from the folder that holds workflows

#### Frequently asked questions

##### What does the Delay node do in Hydra Studio?

It pauses the workflow for a number of seconds before the steps that depend on it can start. Its only required setting is Delay (seconds).

##### What is the YAML of a Delay step?

A step with type action, action delay and a params block holding seconds. In our test a step named pause with seconds: 3 completed in 3.0s.

##### Can the delay be shorter than a second?

Yes. The engine reads the value as a decimal number, so 0.5 waits half a second. A negative value is treated as zero.

##### What happens if seconds is not a number?

The engine stops with an error that names the step and says seconds must be a number. Studio marks the field as required.

##### Can I use a parameter for the delay?

Yes. The field has a {x} button that inserts a parameter reference, so the pause can change from one run to the next.

#### Related lessons

Start from a workflow template

Use the node palette

Compose jobs in a workflow

Hydra DSL reference

#### Next lesson

You can pause a workflow. The next lesson branches it with the Condition node.

Compose jobs →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
