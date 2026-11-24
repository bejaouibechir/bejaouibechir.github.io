# Hydra ETL — CLI and DSL reference

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## The — slug: /cli/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI referenceDownload shop project ↓Watch Hydra Academy ↗

HYDRA CLI · VERSION 0.20.0

### The hdrctl command reference

Find the purpose, exact syntax and a practical example for every command. All examples use a single project named shop.

Download the shop project (.zip) ↓Explore hdrctl init →Learn by video in Hydra Academy ↗

#### Example context

The downloadable shop project contains two small CSV jobs, their workflows, three environments and sample triggers. No database or credentials are needed for the basic commands. Extract the ZIP, then run these commands from its parent folder:

hdrctl list shop
hdrctl validate shop/jobs/load_orders --strict
hdrctl run shop --env dev

COMMAND TREE

#### All commands

15 commands · 29 subcommands

hdrctl init→
Create a Hydra project with its first job, workflow and configuration files.

hdrctl validate→
Validate a job’s YAML declarations without reading data.

hdrctl test→
Check a job’s files, sources, destinations and transformations.

hdrctl run→
Execute a single job or all workflows of a project.

hdrctl list→
List jobs found in a folder or project.

hdrctl job→
Create jobs and manage their membership in project workflows.

addattachdetachlist

hdrctl workflow→
Create, inspect, validate, run and recover project workflows.

addlistremoverunundovalidate

hdrctl env→
Manage global variables and named parameter environments.

createdeletelistrenamesetshowunset

hdrctl param→
Declare project parameters and set their default or environment-specific values.

listsetunset

hdrctl secret→
Store and manage project secrets without showing their values.

deletelistset

hdrctl trigger→
Inspect, validate and invoke triggers defined in a project’s triggers.yaml.

firehistorylisttokenvalidate

hdrctl watch→
Keep one or more projects running under their file, interval and schedule triggers.

hdrctl serve→
Start the Hydra API and bundled Studio.

hdrctl mcp→
Connect an AI assistant to a Hydra project through its MCP server.

setup

hdrctl clear→
Clear the terminal display before reading fresh CLI output.

GUIDES

#### Step-by-step guides

All guides →

Create a job→
Anatomy of a job

Run and launch→
Other launches

Jobs and parameters→
Manage projects

Sources and transformations→
File sourcesDatabase sourcesAdvanced sourcesTransformations 2

Sub-projects→
Sub-projectsSub-project parameters

Triggers→
Triggers

Watch→
Other triggers

Production→
Production

MCP server→
MCP server

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl clear — slug: /cli/clear/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl clearDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl clear

Clear the terminal display before reading fresh CLI output.

#### 01 Objective

Clear the terminal display before reading fresh CLI output.

#### 02 Syntax

hdrctl clear [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl clear --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli clear [OPTIONS]

Clear the terminal screen.
Examples:
hdrctl clear

Options:
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl clear

The screen is cleared; the shop project and its run history are untouched.

#### 04 Tips and pitfalls

Tip
Use this before a long validation or run log.

Avoid this pitfall
Clearing the screen does not reset a failed run or remove project files.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env — slug: /cli/env/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl envDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env

Manage global variables and named parameter environments.

#### 01 Objective

Manage global variables and named parameter environments.

#### 02 Syntax

hdrctl env [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl env --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env [OPTIONS] COMMAND [ARGS]...

Manage environments and the global environment variables.
Global variables are shared by every project on this machine:
~/.hydra/env (all environments) and ~/.hydra/env.<name>. Inside a project,
an environment also has its parameter values (environments/<name>.yaml) and
its secrets (.hydra/secrets.<name>). Select one with --env or HYDRA_ENV.

Examples:
hdrctl env list
hdrctl env create prod
hdrctl env set DB_HOST db.prod.local --env prod
hdrctl env show prod

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
create Create an environment: ~/.hydra/env.<NAME>, and...
delete Delete an environment.
list List the environments: global variables, and in a project its...
rename Rename an environment (global variables, parameter values and...
set Set a global environment variable (KEY VALUE).
show Show the global variables of an environment (without NAME: the...
unset Remove a global environment variable.

#### 03 Explained example

hdrctl env list --project shop

Lists environments visible to shop, including their project-specific values.

#### 04 Tips and pitfalls

Tip
Keep environment names consistent across projects when they represent the same deployment stage.

Avoid this pitfall
Global variables, project parameters and secrets have different storage and precedence rules.

#### 05 Related subcommands

hdrctl env createCreate a named environment for global values and project parameter overrides.→hdrctl env deleteDelete a named environment and its stored overrides.→hdrctl env listList common and named environments available to a project.→hdrctl env renameRename an environment and its associated values.→hdrctl env setSet a global environment variable for all environments or one named environment.→hdrctl env showShow the global variables of one environment.→hdrctl env unsetRemove a global environment variable.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env create — slug: /cli/env/create/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env createDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env create

Create a named environment for global values and project parameter overrides.
← All hdrctl env subcommands

#### 01 Objective

Create a named environment for global values and project parameter overrides.

#### 02 Syntax

hdrctl env create [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl env create --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env create [OPTIONS] NAME

Create an environment: ~/.hydra/env.<NAME>, and environments/<NAME>.yaml in a project.

Examples:
hdrctl env create dev
hdrctl env create prod --global-only

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--global-only Only create the global file, not environments/<NAME>.yaml
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env create staging --project shop

Creates staging for shop and its corresponding global environment record.

#### 04 Tips and pitfalls

Tip
Use --global-only when there is no project environment file to create.

Avoid this pitfall
Creating an environment does not automatically fill in required parameters or secrets.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env delete — slug: /cli/env/delete/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env deleteDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env delete

Delete a named environment and its stored overrides.
← All hdrctl env subcommands

#### 01 Objective

Delete a named environment and its stored overrides.

#### 02 Syntax

hdrctl env delete [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl env delete --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env delete [OPTIONS] NAME

Delete an environment. Its files are first copied to ~/.hydra/_backups/.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--keep-secrets Keep .hydra/secrets.<NAME>
-y, --yes Do not ask for confirmation
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env delete test --project shop

Removes the test environment from shop after its files are backed up.

#### 04 Tips and pitfalls

Tip
Check env list and env show before deleting a shared name.

Avoid this pitfall
Existing jobs or triggers that still name the deleted environment may fail.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env list — slug: /cli/env/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env list

List common and named environments available to a project.
← All hdrctl env subcommands

#### 01 Objective

List common and named environments available to a project.

#### 02 Syntax

hdrctl env list [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl env list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env list [OPTIONS]

List the environments: global variables, and in a project its parameters and
secrets.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env list --project shop

Shows shop environments alongside their global and project-specific values.

#### 04 Tips and pitfalls

Tip
Run this after creating or renaming an environment.

Avoid this pitfall
The list is configuration inventory, not proof that external services are reachable.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env rename — slug: /cli/env/rename/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env renameDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env rename

Rename an environment and its associated values.
← All hdrctl env subcommands

#### 01 Objective

Rename an environment and its associated values.

#### 02 Syntax

hdrctl env rename [OPTIONS] OLD NEW

[OPTIONS] represents optional flags. Run hdrctl env rename --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env rename [OPTIONS] OLD NEW

Rename an environment (global variables, parameter values and secrets).

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env rename test qa --project shop

Renames the existing test environment to qa, including its variable, parameter and secret files.

#### 04 Tips and pitfalls

Tip
Search workflow and trigger references to the old name after renaming.

Avoid this pitfall
A YAML file that still specifies staging does not automatically follow the rename.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env set — slug: /cli/env/set/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env setDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env set

Set a global environment variable for all environments or one named environment.
← All hdrctl env subcommands

#### 01 Objective

Set a global environment variable for all environments or one named environment.

#### 02 Syntax

hdrctl env set [OPTIONS] KEY VALUE

[OPTIONS] represents optional flags. Run hdrctl env set --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env set [OPTIONS] KEY VALUE

Set a global environment variable (KEY VALUE).
Without --env, the variable applies to every environment.

Examples:
hdrctl env set LOG_DIR /var/log/hydra
hdrctl env set DB_HOST db.prod.local --env prod

Options:
--lang LANG Interface language (en, es)
--env NAME Environment (default: common to all environments)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env set DB_HOST db.prod.local --env prod

Sets DB_HOST for the prod environment, available to Hydra when prod is active.

#### 04 Tips and pitfalls

Tip
Omit --env only for values that should apply everywhere.

Avoid this pitfall
Use secret set for credentials; env set is for ordinary configuration values.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env show — slug: /cli/env/show/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env showDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env show

Show the global variables of one environment.
← All hdrctl env subcommands

#### 01 Objective

Show the global variables of one environment.

#### 02 Syntax

hdrctl env show [OPTIONS] [NAME]

[OPTIONS] represents optional flags. Run hdrctl env show --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env show [OPTIONS] [NAME]

Show the global variables of an environment (without NAME: the common ones).

Examples:
hdrctl env show
hdrctl env show prod

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env show prod

Displays the global values associated with prod.

#### 04 Tips and pitfalls

Tip
Run without a name to inspect values shared by all environments.

Avoid this pitfall
This does not display project parameter values; use param list for those.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl env unset — slug: /cli/env/unset/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl env unsetDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl env unset

Remove a global environment variable.
← All hdrctl env subcommands

#### 01 Objective

Remove a global environment variable.

#### 02 Syntax

hdrctl env unset [OPTIONS] KEY

[OPTIONS] represents optional flags. Run hdrctl env unset --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli env unset [OPTIONS] KEY

Remove a global environment variable.

Options:
--lang LANG Interface language (en, es)
--env NAME Environment (default: common to all environments)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl env unset DB_HOST --env prod

Removes the prod-specific DB_HOST value while leaving other environments untouched.

#### 04 Tips and pitfalls

Tip
Use env show prod afterwards to verify the resulting configuration.

Avoid this pitfall
A common value may still apply after a prod-specific override is removed.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl init — slug: /cli/init/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl initDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl init

Create a Hydra project with its first job, workflow and configuration files.

#### 01 Objective

Create a Hydra project with its first job, workflow and configuration files.

#### 02 Syntax

hdrctl init [OPTIONS] [PATH]

[OPTIONS] represents optional flags. Run hdrctl init --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli init [OPTIONS] [PATH]

Create a Hydra project.

hdrctl init <path> create the project in <path> (name or full path)
hdrctl init . create the project in the current folder

Project structure:
.hydra/ project marker, Studio data, secrets file (git-ignored)
Data/ input data
environments/ parameter values per environment
jobs/job1/ first job: sources, destinations, pipeline, transformations
outputs/ files produced by the jobs
parameters.yaml project parameters
README.md
scripts/ scripts called by workflow actions
workflows/ workflow1.yaml + thread.yaml (execution order)

- Empty or missing folder: creates the full project.
- Folder holding a job (sources/destinations/pipeline YAML): only adds .hydra.
- Any other non-empty folder: stops with a warning.

Templates for job1:
basic — Simple CSV
csv — CSV with sample data (default)
mysql — MySQL/MariaDB with upsert
postgres — PostgreSQL with ON CONFLICT
api — REST Web API with pagination
mongodb — MongoDB with schema auto-detection

Examples:
hdrctl init my_project
hdrctl init C:\data\my_project
hdrctl init .
hdrctl init my_project --template mysql

Options:
--lang LANG Interface language (en, es)
-t, --template [api|basic|csv|mongodb|mysql|postgres]
Template to use [default: csv]
-q, --quiet Quiet mode (fewer messages)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl init shop

Creates the shop project with jobs/job1, workflows/workflow1.yaml, thread.yaml and parameters.yaml.

#### 04 Tips and pitfalls

Tip
Use hdrctl init . inside an empty folder to make that folder the project root.

Avoid this pitfall
An unrelated nonempty folder is rejected; init does not overwrite it.

#### 06 Guides

Anatomy of a jobThe four manifests of a job folder, how they link, and what validate says when one breaks.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl job — slug: /cli/job/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl jobDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl job

Create jobs and manage their membership in project workflows.

#### 01 Objective

Create jobs and manage their membership in project workflows.

#### 02 Syntax

hdrctl job [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl job --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli job [OPTIONS] COMMAND [ARGS]...

Manage the jobs of a Hydra project and their place in workflows.
A job is a folder jobs/<name>/; a workflow runs it through a step of type job.
In a workflow, steps form a chain: each one runs after the previous one.

Examples:
hdrctl job add load_orders
hdrctl job add load_orders daily_sales
hdrctl job attach clean_orders daily_sales -p 1
hdrctl job detach clean_orders daily_sales

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
add Create a job and, optionally, attach it to a workflow.
attach Attach an existing job to a workflow.
detach Detach a job from a workflow, or from every workflow.
list List the jobs of a project and the workflows that use them.

#### 03 Explained example

hdrctl job list shop

Lists shop jobs and identifies which workflows reference each one.

#### 04 Tips and pitfalls

Tip
Use job add for a new job; use job attach for one that already exists.

Avoid this pitfall
Detaching a job removes its workflow reference, not the job files.

#### 05 Related subcommands

hdrctl job addCreate a job and optionally place it in a workflow.→hdrctl job attachAdd an existing job to a workflow.→hdrctl job detachRemove a job from one workflow or from every workflow.→hdrctl job listShow project jobs and the workflows that use them.→

#### 06 Guides

Manage projectsAdd, attach and detach jobs, and set project parameters per environment, from the command line.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl job add — slug: /cli/job/add/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl job addDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl job add

Create a job and optionally place it in a workflow.
← All hdrctl job subcommands

#### 01 Objective

Create a job and optionally place it in a workflow.

#### 02 Syntax

hdrctl job add [OPTIONS] NAME [WORKFLOW]

[OPTIONS] represents optional flags. Run hdrctl job add --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli job add [OPTIONS] NAME [WORKFLOW]

Create a job and, optionally, attach it to a workflow.
Creates jobs/<NAME>/ from a template (same templates as hdrctl init). With
WORKFLOW, the job is attached at the end of the workflow, or at position N
with -p N. Run it inside a Hydra project, or give the project with --project.

Examples:
hdrctl job add load_orders
hdrctl job add load_orders daily_sales
hdrctl job add load_orders daily_sales -p 2 --template postgres

Options:
--lang LANG Interface language (en, es)
-p, --position N Position in the workflow, 1 = first step
(default: at the end)
-t, --template [api|basic|csv|mongodb|mysql|postgres]
Template to use [default: csv]
--project PATH Hydra project folder (default: the project
that contains the current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl job add archive_orders daily_sales --project shop

Creates a new archive_orders job inside shop and attaches it to the existing daily_sales workflow.

#### 04 Tips and pitfalls

Tip
Omit the workflow name to create an independently runnable job.

Avoid this pitfall
The workflow must exist before the job can be attached to it.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl job attach — slug: /cli/job/attach/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl job attachDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl job attach

Add an existing job to a workflow.
← All hdrctl job subcommands

#### 01 Objective

Add an existing job to a workflow.

#### 02 Syntax

hdrctl job attach [OPTIONS] NAME WORKFLOW

[OPTIONS] represents optional flags. Run hdrctl job attach --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli job attach [OPTIONS] NAME WORKFLOW

Attach an existing job to a workflow.
At the end by default: the job runs after the last step. With -p N it becomes
step N: it runs after step N-1, and the step that was at position N now runs
after it.

Examples:
hdrctl job attach load_orders daily_sales
hdrctl job attach clean_orders daily_sales -p 1

Options:
--lang LANG Interface language (en, es)
-p, --position N Position in the workflow, 1 = first step (default: at the
end)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl job attach job1 daily_sales --project shop

Adds the existing job1 job to daily_sales without creating another job.

#### 04 Tips and pitfalls

Tip
Use -p to choose its position in the workflow.

Avoid this pitfall
Attaching a job does not create or validate its YAML files.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl job detach — slug: /cli/job/detach/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl job detachDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl job detach

Remove a job from one workflow or from every workflow.
← All hdrctl job subcommands

#### 01 Objective

Remove a job from one workflow or from every workflow.

#### 02 Syntax

hdrctl job detach [OPTIONS] NAME [WORKFLOW]

[OPTIONS] represents optional flags. Run hdrctl job detach --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli job detach [OPTIONS] NAME [WORKFLOW]

Detach a job from a workflow, or from every workflow.
The steps that ran after it now run after its own predecessors, so the chain
stays connected. The job folder is kept in jobs/.

Examples:
hdrctl job detach load_orders daily_sales
hdrctl job detach load_orders

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl job detach load_orders daily_sales --project shop

Removes load_orders from daily_sales while keeping its job folder in shop.

#### 04 Tips and pitfalls

Tip
Omit the workflow name only when you intend to detach the job everywhere.

Avoid this pitfall
A detached job can still run directly with hdrctl run.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl job list — slug: /cli/job/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl job listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl job list

Show project jobs and the workflows that use them.
← All hdrctl job subcommands

#### 01 Objective

Show project jobs and the workflows that use them.

#### 02 Syntax

hdrctl job list [OPTIONS] [PROJECT]

[OPTIONS] represents optional flags. Run hdrctl job list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli job list [OPTIONS] [PROJECT]

List the jobs of a project and the workflows that use them.
Shows each folder of jobs/ (free, or the workflows it is in, or the files it
lacks), and the job folders a workflow refers to but that do not exist.

Examples:
hdrctl job list
hdrctl job list C:\data\my_project

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl job list shop

Displays the jobs in shop together with their workflow membership.

#### 04 Tips and pitfalls

Tip
Use this after attach or detach to confirm the relationship.

Avoid this pitfall
It does not show the success or failure of a previous run.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl list — slug: /cli/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl list

List jobs found in a folder or project.

#### 01 Objective

List jobs found in a folder or project.

#### 02 Syntax

hdrctl list [OPTIONS] [PATH]

[OPTIONS] represents optional flags. Run hdrctl list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli list [OPTIONS] [PATH]

List the jobs found in a folder.
On a project folder, lists the project's jobs and the workflows that use them
(same as hdrctl job list).

Examples:
hdrctl list
hdrctl list my_project
hdrctl list jobs/

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl list shop

Shows the jobs in shop and the workflows that use them.

#### 04 Tips and pitfalls

Tip
Inside a project, hdrctl list and hdrctl job list provide the same project inventory.

Avoid this pitfall
This is an inventory command; it does not validate a job or run it.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl mcp — slug: /cli/mcp/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl mcpDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl mcp

Connect an AI assistant to a Hydra project through its MCP server.

#### 01 Objective

Connect an AI assistant to a Hydra project through its MCP server.

#### 02 Syntax

hdrctl mcp [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl mcp --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli mcp [OPTIONS] COMMAND [ARGS]...

Connect an AI assistant to the Hydra ETL MCP server of a project.

Options:
-h, --help Show this message and exit.

Commands:
setup Connect Claude Code to this project: writes .mcp.json at the...

#### 03 Explained example

hdrctl mcp setup --path shop

Configures the supported Claude Code connection for shop.

#### 04 Tips and pitfalls

Tip
Review the generated configuration before launching the assistant.

Avoid this pitfall
The current CLI exposes setup for Claude Code; do not assume other clients are configured by this command.

#### 05 Related subcommands

hdrctl mcp setupWrite a project .mcp.json configuration for Claude Code.→

#### 06 Guides

MCP serverWrite .mcp.json with hdrctl mcp setup and check the 21 tools and the path guardrails.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl mcp setup — slug: /cli/mcp/setup/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl mcp setupDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl mcp setup

Write a project .mcp.json configuration for Claude Code.
← All hdrctl mcp subcommands

#### 01 Objective

Write a project .mcp.json configuration for Claude Code.

#### 02 Syntax

hdrctl mcp setup [OPTIONS] [[claude-code]]

[OPTIONS] represents optional flags. Run hdrctl mcp setup --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli mcp setup [OPTIONS] [[claude-code]]

Connect Claude Code to this project: writes .mcp.json at the project root,
with the Python that runs hdrctl. Then start `claude` in the project and type
/mcp.

Options:
--path TEXT A folder of the project (its root is found from there).
[default: .]
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl mcp setup --path shop

Finds the root of shop and writes the MCP connection using the Python that runs hdrctl.

#### 04 Tips and pitfalls

Tip
Start Claude Code from the project root and inspect /mcp there.

Avoid this pitfall
The configuration is project-specific; running setup in another folder targets a different project.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl param — slug: /cli/param/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl paramDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl param

Declare project parameters and set their default or environment-specific values.

#### 01 Objective

Declare project parameters and set their default or environment-specific values.

#### 02 Syntax

hdrctl param [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl param --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli param [OPTIONS] COMMAND [ARGS]...

Manage the parameters of a project.
parameters.yaml declares them (type, default value); environments/<env>.yaml
gives their value per environment. Use them in the DSL as {{ param:NAME }}.

Examples:
hdrctl param list
hdrctl param set batch_size 500 --type int
hdrctl param set batch_size 5000 --env prod
hdrctl param unset batch_size --env prod

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
list List the parameters: type, default value and value per environment.
set Declare a parameter or change its value.
unset Remove a parameter value for an environment, or (without --env)...

#### 03 Explained example

hdrctl param list --project shop

Shows shop parameters, their types, defaults and environment overrides.

#### 04 Tips and pitfalls

Tip
Use parameters for values referenced by {{ param:... }} in project manifests.

Avoid this pitfall
A run-time -P override can replace the stored value for one execution.

#### 05 Related subcommands

hdrctl param listDisplay project parameters with their types and values by environment.→hdrctl param setDeclare a parameter or change its default or environment value.→hdrctl param unsetRemove an environment override or remove an entire parameter.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl param list — slug: /cli/param/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl param listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl param list

Display project parameters with their types and values by environment.
← All hdrctl param subcommands

#### 01 Objective

Display project parameters with their types and values by environment.

#### 02 Syntax

hdrctl param list [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl param list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli param list [OPTIONS]

List the parameters: type, default value and value per environment.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Show only this environment
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl param list --project shop

Displays each parameter defined for shop and its available overrides.

#### 04 Tips and pitfalls

Tip
Check this before using -P to distinguish defaults from environment values.

Avoid this pitfall
Secrets are deliberately managed separately and do not belong in parameters.yaml.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl param set — slug: /cli/param/set/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl param setDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl param set

Declare a parameter or change its default or environment value.
← All hdrctl param subcommands

#### 01 Objective

Declare a parameter or change its default or environment value.

#### 02 Syntax

hdrctl param set [OPTIONS] NAME [VALUE]

[OPTIONS] represents optional flags. Run hdrctl param set --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli param set [OPTIONS] NAME [VALUE]

Declare a parameter or change its value.
Without --env: the default value in parameters.yaml. With --env: the value for
that environment in environments/<env>.yaml.

Examples:
hdrctl param set region eu-west --description "Cloud region"
hdrctl param set region us-east --env prod

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project
that contains the current folder)
--env NAME Environment whose value is set (default: the
default value)
--type [string|int|float|bool|json|any]
Parameter type
--description TEXT Description shown in Studio
--required / --optional The parameter must have a value at run time
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl param set min_amount 50 --type int --project shop

Declares min_amount as an integer with a default of 50 in shop.

#### 04 Tips and pitfalls

Tip
Add --env prod to set only the prod override after declaring the parameter.

Avoid this pitfall
A value that cannot be converted to the declared type is invalid.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl param unset — slug: /cli/param/unset/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl param unsetDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl param unset

Remove an environment override or remove an entire parameter.
← All hdrctl param subcommands

#### 01 Objective

Remove an environment override or remove an entire parameter.

#### 02 Syntax

hdrctl param unset [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl param unset --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli param unset [OPTIONS] NAME

Remove a parameter value for an environment, or (without --env) the parameter
everywhere.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Only remove the value of this environment
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl param unset min_amount --env prod --project shop

Removes only the prod override; the project default remains.

#### 04 Tips and pitfalls

Tip
Use param list afterwards to confirm which value will now be used.

Avoid this pitfall
Without --env, the parameter declaration itself is removed.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl run — slug: /cli/run/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl runDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl run

Execute a single job or all workflows of a project.

#### 01 Objective

Execute a single job or all workflows of a project.

#### 02 Syntax

hdrctl run [OPTIONS] [PATH]

[OPTIONS] represents optional flags. Run hdrctl run --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli run [OPTIONS] [PATH]

Run a Hydra project, or a single job.

hdrctl run <project> run every workflow of the project, in the order of
workflows/thread.yaml
hdrctl run . same, from the project folder
hdrctl run <job> run one job (folder holding sources/destinations/pipeline.yaml)

thread.yaml: stages run one after the other; each stage is sequential or
parallel, with an optional delay_after; active: false skips a workflow.
Without thread.yaml, every workflows/*.yaml runs in alphabetical order.
The project's parameters.yaml and environments/<env>.yaml are read (--env).
${SECRET:name} reads the environment, then .hydra/secrets (or --secrets-file).
Workflow triggers (schedule, webhook) are ignored: they apply under hdrctl serve.
loops (optional): from/to/times/delay replay a part of the thread.
fallback (optional, on a workflow): use/when/on_failure; 'when' is checked just
before the workflow starts (--use-fallback WORKFLOW forces it).
A failed workflow stops the project.
-s, -d, -p, -t and --profile apply to a single job only.

Examples:
hdrctl run .
hdrctl run C:\data\my_project --env prod
hdrctl run . --dry-run
hdrctl run . -P min_amount=100
hdrctl run . --on-failure "curl https://hooks.slack.com/..."
hdrctl run my_project/jobs/job1 -vv

Options:
--lang LANG Interface language (en, es)
-v Verbosity level 1
-vv Verbosity level 2 (metrics)
-vvv Verbosity level 3 (full logs)
--dry-run Validate configuration without writing data
-s, --sources FILE Explicit path to sources.yaml
-d, --destinations FILE Explicit path to destinations.yaml
-p, --pipeline FILE Explicit path to pipeline.yaml
-t, --transformations FILE Explicit path to transformations.yaml
--on-success CMD Command to execute on success
--on-failure CMD Command to execute on failure
--on-finish CMD Command always executed at end of pipeline
--env NAME Active environment (loads
environments/<name>.yaml)
-P, --param KEY=VALUE Override a parameter (KEY=VALUE), repeatable
--profile Show a per-step timing profile at the end of
the run
--secrets-file FILE Secrets file to use instead of .hydra/secrets
(name=value per line)
--secrets-visibility [plain|masked|hidden]
How secret values appear in logs and messages:
plain (debugging), masked (default) or hidden;
overrides .hydra/secrets.yaml
--env-file FILE Extra environment variables for this run
(name=value per line); wins over every other
layer
--use-fallback WORKFLOW Force the fallback of WORKFLOW (a workflow of
the thread that declares a fallback), to
rehearse a recovery scenario. Repeatable.
-w, --workflow WORKFLOW Run only these workflows of the project, one
after the other (repeat -w)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl run shop --env dev -P min_amount=50

Runs the shop project in thread order using dev values and a one-run override for min_amount.

#### 04 Tips and pitfalls

Tip
Start with --dry-run, then use -vv or --profile when you need more detail.

Avoid this pitfall
A project path runs the project; a job path runs only that job. Triggers are ignored during a direct run.

#### 06 Guides

Other launchesRun the same job without Studio from the command line and the API, and see where each launch shows up.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl secret — slug: /cli/secret/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl secretDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl secret

Store and manage project secrets without showing their values.

#### 01 Objective

Store and manage project secrets without showing their values.

#### 02 Syntax

hdrctl secret [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl secret --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli secret [OPTIONS] COMMAND [ARGS]...

Manage the secrets of a project. Values are never displayed.
.hydra/secrets holds the common secrets (ignored by git); .hydra/secrets.<env>
the secrets of one environment, which take precedence with --env.
Use them in the DSL as ${SECRET:NAME}.

Examples:
hdrctl secret list --env prod
hdrctl secret set DB_PASSWORD --env prod
echo $PW | hdrctl secret set DB_PASSWORD --stdin

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
delete Delete a secret.
list List the secret names (never the values).
set Set a secret.

#### 03 Explained example

hdrctl secret list --project shop

Lists secret names configured for shop while hiding their values.

#### 04 Tips and pitfalls

Tip
Use separate environment values for dev and prod credentials.

Avoid this pitfall
Do not put passwords in shell arguments, YAML parameter defaults or committed files.

#### 05 Related subcommands

hdrctl secret deleteRemove a stored secret from the project or a named environment.→hdrctl secret listList secret names without revealing secret values.→hdrctl secret setSet a secret through hidden input or standard input.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl secret delete — slug: /cli/secret/delete/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl secret deleteDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl secret delete

Remove a stored secret from the project or a named environment.
← All hdrctl secret subcommands

#### 01 Objective

Remove a stored secret from the project or a named environment.

#### 02 Syntax

hdrctl secret delete [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl secret delete --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli secret delete [OPTIONS] NAME

Delete a secret.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Environment (default: common secrets)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl secret delete DB_PASSWORD --env test --project shop

Deletes the test value of DB_PASSWORD in shop.

#### 04 Tips and pitfalls

Tip
Use secret list --env test to verify the name is gone.

Avoid this pitfall
Jobs using that secret will fail to resolve it unless another source provides it.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl secret list — slug: /cli/secret/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl secret listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl secret list

List secret names without revealing secret values.
← All hdrctl secret subcommands

#### 01 Objective

List secret names without revealing secret values.

#### 02 Syntax

hdrctl secret list [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl secret list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli secret list [OPTIONS]

List the secret names (never the values).

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Also show the secrets of this environment
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl secret list --env prod --project shop

Shows which secret names are present for the prod environment of shop.

#### 04 Tips and pitfalls

Tip
Use it to check setup before a production run.

Avoid this pitfall
A listed name does not prove its credential is valid at the destination.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl secret set — slug: /cli/secret/set/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl secret setDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl secret set

Set a secret through hidden input or standard input.
← All hdrctl secret subcommands

#### 01 Objective

Set a secret through hidden input or standard input.

#### 02 Syntax

hdrctl secret set [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl secret set --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli secret set [OPTIONS] NAME

Set a secret. The value is typed hidden, or read from stdin with --stdin; it
is never an argument.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Environment (default: common secrets)
--stdin Read the value from the first line of stdin
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl secret set DB_PASSWORD --env prod --project shop

Prompts for the prod database password without placing it in the command line.

#### 04 Tips and pitfalls

Tip
Use --stdin when a trusted automation supplies the value securely.

Avoid this pitfall
Never append the secret value as an argument; this command intentionally does not accept one.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl serve — slug: /cli/serve/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl serveDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl serve

Start the Hydra API and bundled Studio.

#### 01 Objective

Start the Hydra API and bundled Studio.

#### 02 Syntax

hdrctl serve [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl serve --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli serve [OPTIONS]

Start the Hydra API and the Studio.

Options:
--lang LANG Interface language (en, es)
--host TEXT Listen address. [default: 127.0.0.1]
--port INTEGER Listen port. [default: 5678]
--reload Hot reload (development only).
--open Open the Studio in your browser once the server is up.
--no-studio Serve the API only, without the visual editor.
--workspace TEXT Root folder for Studio projects (default: ~/hydra-
workspace).
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl serve --workspace . --open

From the parent folder of shop, serves Studio and the API, then opens the browser.

#### 04 Tips and pitfalls

Tip
Use --no-studio when you only need the API; the default bind address is local.

Avoid this pitfall
Installing the basic CLI alone may not provide server dependencies; install hydra-etl[server] first.

#### 06 Guides

ProductionServe the API without Studio, run a cron workflow and read the scheduled runs.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl test — slug: /cli/test/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl testDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl test

Check a job’s files, sources, destinations and transformations.

#### 01 Objective

Check a job’s files, sources, destinations and transformations.

#### 02 Syntax

hdrctl test [OPTIONS] [PATH]

[OPTIONS] represents optional flags. Run hdrctl test --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli test [OPTIONS] [PATH]

Check a job: files present, sources, destinations, transformations.
Examples:
hdrctl test .
hdrctl test jobs/daily_revenue
hdrctl test . --only-sources
hdrctl test . --only-transform
hdrctl test . -s sources_alt.yaml -d conf/destinations_prod.yaml

Options:
--lang LANG Interface language (en, es)
--only-sources Validate sources only
--only-destinations Validate destinations only
--only-transform Validate transformations only
-s, --sources FILE Explicit path to sources file
-d, --destinations FILE Explicit path to destinations file
-p, --pipeline FILE Explicit path to pipeline file
-t, --transformations FILE Explicit path to transformations file
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl test shop/jobs/job1 --only-sources

Checks the source side of job1 without executing its pipeline.

#### 04 Tips and pitfalls

Tip
Use --only-sources, --only-destinations or --only-transform to isolate a failure.

Avoid this pitfall
test can inspect access to external systems; use validate when you only want to check YAML without reading data.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger — slug: /cli/trigger/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl triggerDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger

Inspect, validate and invoke triggers defined in a project’s triggers.yaml.

#### 01 Objective

Inspect, validate and invoke triggers defined in a project’s triggers.yaml.

#### 02 Syntax

hdrctl trigger [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl trigger --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger [OPTIONS] COMMAND [ARGS]...

Project triggers (triggers.yaml at the project root): run the project
at a time, every N minutes, when a file arrives, when a source changes, on a
webhook call or after another project. They run inside `hdrctl watch` and
`hdrctl serve`; `fire` runs one now.

Examples:
hdrctl trigger list
hdrctl trigger validate
hdrctl trigger fire nightly --env prod
hdrctl trigger history nightly

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
fire Run the project now, as trigger NAME would (its environment,...
history Show the last runs started by the triggers (all, or trigger NAME).
list List the triggers of the project, with their last run.
token Create the token of webhook trigger NAME: a random value saved...
validate Check triggers.yaml: keys, cron expressions, workflows, called...

#### 03 Explained example

hdrctl trigger list --project shop

Shows the triggers configured for shop and their last run.

#### 04 Tips and pitfalls

Tip
Validate trigger definitions before starting watch or serve.

Avoid this pitfall
Adding a trigger to YAML does not itself start a watcher.

#### 05 Related subcommands

hdrctl trigger fireRun a project immediately using one trigger’s settings.→hdrctl trigger historyRead runs started by project triggers.→hdrctl trigger listList project triggers and their most recent run.→hdrctl trigger tokenCreate a webhook token and save it as a project secret.→hdrctl trigger validateCheck triggers.yaml, including schedules and referenced workflows.→

#### 06 Guides

TriggersDeclare triggers in triggers.yaml, check them, fire one by hand and read the history.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger fire — slug: /cli/trigger/fire/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl trigger fireDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger fire

Run a project immediately using one trigger’s settings.
← All hdrctl trigger subcommands

#### 01 Objective

Run a project immediately using one trigger’s settings.

#### 02 Syntax

hdrctl trigger fire [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl trigger fire --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger fire [OPTIONS] NAME

Run the project now, as trigger NAME would (its environment, workflows,
parameters, overlap, timeout and retry). Recorded in the trigger history.

Examples:
hdrctl trigger fire nightly
hdrctl trigger fire nightly --env prod --no-retry

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Environment when the trigger has no env: (default: HYDRA_ENV,
else none)
--no-retry Do not retry after a failure, even if the trigger has retry:
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl trigger fire nightly --project shop --env prod

Starts shop as nightly would, applying its workflow, parameter and retry settings.

#### 04 Tips and pitfalls

Tip
Use --no-retry when you need one diagnostic attempt.

Avoid this pitfall
This performs a real project run; it is not a dry-run validator.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger history — slug: /cli/trigger/history/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl trigger historyDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger history

Read runs started by project triggers.
← All hdrctl trigger subcommands

#### 01 Objective

Read runs started by project triggers.

#### 02 Syntax

hdrctl trigger history [OPTIONS] [NAME]

[OPTIONS] represents optional flags. Run hdrctl trigger history --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger history [OPTIONS] [NAME]

Show the last runs started by the triggers (all, or trigger NAME).

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-n INTEGER Number of runs shown [default: 20]
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl trigger history nightly --project shop

Displays recent runs recorded for the nightly trigger in shop.

#### 04 Tips and pitfalls

Tip
Omit the trigger name to see history across all triggers.

Avoid this pitfall
Direct hdrctl run invocations are not the same as runs recorded under a trigger.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger list — slug: /cli/trigger/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl trigger listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger list

List project triggers and their most recent run.
← All hdrctl trigger subcommands

#### 01 Objective

List project triggers and their most recent run.

#### 02 Syntax

hdrctl trigger list [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl trigger list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger list [OPTIONS]

List the triggers of the project, with their last run.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl trigger list --project shop

Displays the trigger names in shop/triggers.yaml and last-run information.

#### 04 Tips and pitfalls

Tip
Use this to confirm a new trigger is visible before firing it.

Avoid this pitfall
A listed trigger can still be invalid; run trigger validate.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger token — slug: /cli/trigger/token/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl trigger tokenDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger token

Create a webhook token and save it as a project secret.
← All hdrctl trigger subcommands

#### 01 Objective

Create a webhook token and save it as a project secret.

#### 02 Syntax

hdrctl trigger token [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl trigger token --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger token [OPTIONS] NAME

Create the token of webhook trigger NAME: a random value saved as the secret
named by its token: (.hydra/secrets, or .hydra/secrets.<env> with --env).
The value is shown once, to give to the caller.

Examples:
hdrctl trigger token on_push
hdrctl trigger token on_push --env prod --rotate

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
--env NAME Save it in the secrets of this environment (default: the
trigger's env, else common)
--rotate Replace an existing token (the old one stops working)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl trigger token on_push --project shop --env prod

Creates the prod token for the on_push webhook and prints its value once.

#### 04 Tips and pitfalls

Tip
Store the displayed value immediately in the webhook caller’s secret store.

Avoid this pitfall
--rotate invalidates the old token; update the caller before relying on the webhook again.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl trigger validate — slug: /cli/trigger/validate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl trigger validateDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl trigger validate

Check triggers.yaml, including schedules and referenced workflows.
← All hdrctl trigger subcommands

#### 01 Objective

Check triggers.yaml, including schedules and referenced workflows.

#### 02 Syntax

hdrctl trigger validate [OPTIONS]

[OPTIONS] represents optional flags. Run hdrctl trigger validate --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli trigger validate [OPTIONS]

Check triggers.yaml: keys, cron expressions, workflows, called projects,
secrets, after_project loops.

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl trigger validate --project shop

Validates shop trigger definitions without starting a watcher.

#### 04 Tips and pitfalls

Tip
Run this after changing cron expressions or workflow names.

Avoid this pitfall
Validation does not start a scheduler or prove that a webhook caller can reach the API.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl validate — slug: /cli/validate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl validateDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl validate

Validate a job’s YAML declarations without reading data.

#### 01 Objective

Validate a job’s YAML declarations without reading data.

#### 02 Syntax

hdrctl validate [OPTIONS] [PATH]

[OPTIONS] represents optional flags. Run hdrctl validate --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli validate [OPTIONS] [PATH]

Validate a job's YAML files without reading any data.
Examples:
hdrctl validate .
hdrctl validate jobs/daily_revenue --strict
hdrctl validate . -s sources_alt.yaml -p conf/pipeline_prod.yaml

Options:
--lang LANG Interface language (en, es)
--strict Strict validation: check columns, types,
expressions
-s, --sources FILE Explicit path to sources file
-d, --destinations FILE Explicit path to destinations file
-p, --pipeline FILE Explicit path to pipeline file
-t, --transformations FILE Explicit path to transformations file
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl validate shop/jobs/job1 --strict

Checks job1 and applies stricter column, type and expression checks.

#### 04 Tips and pitfalls

Tip
Run this before test and run to catch declaration errors early.

Avoid this pitfall
A valid manifest does not prove a database is reachable; use test for connection checks.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl watch — slug: /cli/watch/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl watchDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl watch

Keep one or more projects running under their file, interval and schedule triggers.

#### 01 Objective

Keep one or more projects running under their file, interval and schedule triggers.

#### 02 Syntax

hdrctl watch [OPTIONS] [PROJECT]...

[OPTIONS] represents optional flags. Run hdrctl watch --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli watch [OPTIONS] [PROJECT]...

Run the triggers of one or more projects (triggers.yaml): the project is
started when its time comes (cron, interval) or when a file arrives (file,
marker) or when a source changes (source_change). Runs until Ctrl+C; a
first Ctrl+C waits for the running projects, a second one stops at once. Changes to triggers.yaml are picked up without
restarting.

Examples:
hdrctl watch
hdrctl watch D:\data\shop D:\data\crm --env prod

Options:
--lang LANG Interface language (en, es)
--env NAME Environment of the triggers without env: (default: HYDRA_ENV,
else none)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl watch shop --env prod

Watches the triggers in shop/triggers.yaml and supplies prod as the default environment.

#### 04 Tips and pitfalls

Tip
The watcher reloads changes to triggers.yaml without a restart.

Avoid this pitfall
watch stays active until interrupted; a direct hdrctl run does not wait for triggers.

#### 06 Guides

Other triggersRun interval, marker, file and source triggers with hdrctl watch and read what each one prints.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow — slug: /cli/workflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflowDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow

Create, inspect, validate, run and recover project workflows.

#### 01 Objective

Create, inspect, validate, run and recover project workflows.

#### 02 Syntax

hdrctl workflow [OPTIONS] COMMAND [ARGS]...

[OPTIONS] represents optional flags. Run hdrctl workflow --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow [OPTIONS] COMMAND [ARGS]...

Manage the workflows of a Hydra project.
A project is a set of workflows; a workflow is a set of jobs and actions.
The order in which hdrctl run starts them is in workflows/thread.yaml.

Examples:
hdrctl workflow add daily_sales
hdrctl workflow list
hdrctl workflow run daily_sales
hdrctl workflow remove daily_sales
hdrctl workflow undo daily_sales

Options:
--lang LANG Interface language (en, es)
-h, --help Show this message and exit.

Commands:
add Create a workflow and add it to thread.yaml.
list List the workflows in thread order.
remove Delete a workflow (its jobs are kept).
run Run one workflow, now (its trigger is ignored).
undo Finish undoing a workflow (rollback: true).
validate Check a workflow manifest without running it.

#### 03 Explained example

hdrctl workflow list shop

Lists shop workflows in their thread order.

#### 04 Tips and pitfalls

Tip
Validate a workflow before running it, especially after changing dependencies.

Avoid this pitfall
Running one workflow differs from running the whole project thread.

#### 05 Related subcommands

hdrctl workflow addCreate a workflow and register it in thread.yaml.→hdrctl workflow listList workflows in project execution order.→hdrctl workflow removeRemove a workflow from the project while retaining its jobs.→hdrctl workflow runRun one workflow immediately, regardless of its trigger.→hdrctl workflow undoFinish a rollback that was interrupted or could not complete.→hdrctl workflow validateCheck a workflow manifest and its dependencies without running it.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow add — slug: /cli/workflow/add/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow addDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow add

Create a workflow and register it in thread.yaml.
← All hdrctl workflow subcommands

#### 01 Objective

Create a workflow and register it in thread.yaml.

#### 02 Syntax

hdrctl workflow add [OPTIONS] [NAME]

[OPTIONS] represents optional flags. Run hdrctl workflow add --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow add [OPTIONS] [NAME]

Create a workflow and add it to thread.yaml.
Create workflows/<NAME>.yaml, with no step, and add it at the end of
workflows/thread.yaml (in the last stage if it is sequential, otherwise in a
new sequential stage). Without NAME, the name is workflow-<8 hex characters>.
Run it inside a Hydra project, or give the project with --project.

Examples:
hdrctl workflow add daily_sales
hdrctl workflow add
hdrctl workflow add daily_sales --project C:\data\my_project
hdrctl workflow add daily_sales_backup --fallback-for daily_sales

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that
contains the current folder)
--fallback-for WORKFLOW Create the workflow as a fallback of WORKFLOW (a
workflow of the thread): it is added to WORKFLOW's
fallback in thread.yaml, not to the thread
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow add weekly_report --project shop

Creates shop/workflows/weekly_report.yaml and adds it to the project thread.

#### 04 Tips and pitfalls

Tip
Use --fallback-for when creating a recovery workflow for another workflow.

Avoid this pitfall
An empty workflow still needs jobs or actions before it produces useful work.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow list — slug: /cli/workflow/list/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow listDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow list

List workflows in project execution order.
← All hdrctl workflow subcommands

#### 01 Objective

List workflows in project execution order.

#### 02 Syntax

hdrctl workflow list [OPTIONS] [PROJECT]

[OPTIONS] represents optional flags. Run hdrctl workflow list --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow list [OPTIONS] [PROJECT]

List the workflows in thread order.
List the workflows of a project in the order of workflows/thread.yaml:
stage and mode, active or inactive, number of steps. Workflows that are not
in thread.yaml, and thread entries without a file, are shown too.

Examples:
hdrctl workflow list
hdrctl workflow list C:\data\my_project

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow list shop

Shows the workflows registered for shop in thread order.

#### 04 Tips and pitfalls

Tip
Use this after workflow add or remove to inspect thread.yaml indirectly.

Avoid this pitfall
Listing does not validate step dependencies.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow remove — slug: /cli/workflow/remove/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow removeDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow remove

Remove a workflow from the project while retaining its jobs.
← All hdrctl workflow subcommands

#### 01 Objective

Remove a workflow from the project while retaining its jobs.

#### 02 Syntax

hdrctl workflow remove [OPTIONS] NAME

[OPTIONS] represents optional flags. Run hdrctl workflow remove --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow remove [OPTIONS] NAME

Delete a workflow (its jobs are kept).
Delete workflows/<NAME>.yaml and remove it from workflows/thread.yaml.
The jobs it used are kept in jobs/. Asks for confirmation unless -y is given.

Examples:
hdrctl workflow remove daily_sales
hdrctl workflow remove daily_sales -y --project C:\data\my_project

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-y, --yes Do not ask for confirmation
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow remove daily_sales --project shop

Removes daily_sales and its thread entry; its job directories remain available.

#### 04 Tips and pitfalls

Tip
List workflows first when unsure which name is registered.

Avoid this pitfall
This changes project configuration; the jobs are kept but their orchestration is not.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow run — slug: /cli/workflow/run/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow runDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow run

Run one workflow immediately, regardless of its trigger.
← All hdrctl workflow subcommands

#### 01 Objective

Run one workflow immediately, regardless of its trigger.

#### 02 Syntax

hdrctl workflow run [OPTIONS] NAME|PATH

[OPTIONS] represents optional flags. Run hdrctl workflow run --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow run [OPTIONS] NAME|PATH

Run one workflow, now (its trigger is ignored).
NAME is a workflow of the current project (workflows/NAME.yaml); PATH is a file.

Examples:
hdrctl workflow run daily_sales
hdrctl workflow run workflows/daily_sales.yaml
hdrctl run . # every workflow of the project

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project
that contains the current folder)
--secrets-file FILE Secrets file to use instead of .hydra/secrets
(name=value per line)
--secrets-visibility [plain|masked|hidden]
How secret values appear in logs and messages:
plain (debugging), masked (default) or hidden;
overrides .hydra/secrets.yaml
--env NAME Active environment (loads
environments/<name>.yaml)
-P, --param KEY=VALUE Override a parameter (KEY=VALUE), repeatable
--env-file FILE Extra environment variables for this run
(name=value per line); wins over every other
layer
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow run daily_sales --project shop --env dev

Runs only daily_sales in shop with dev parameter values.

#### 04 Tips and pitfalls

Tip
Use hdrctl run shop when you want every workflow in the project thread.

Avoid this pitfall
A direct workflow run ignores the trigger that normally starts it.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow undo — slug: /cli/workflow/undo/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow undoDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow undo

Finish a rollback that was interrupted or could not complete.
← All hdrctl workflow subcommands

#### 01 Objective

Finish a rollback that was interrupted or could not complete.

#### 02 Syntax

hdrctl workflow undo [OPTIONS] NAME|PATH

[OPTIONS] represents optional flags. Run hdrctl workflow undo --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow undo [OPTIONS] NAME|PATH

Finish undoing a workflow (rollback: true).
A run of a workflow with rollback: true that stopped before undoing its
changes (crash, an undo that failed) leaves .hydra/undo/<NAME>.json; the
workflow refuses to run until it is finished. This command undoes the
remaining steps, the last one first.

Examples:
hdrctl workflow undo daily_sales
hdrctl workflow undo daily_sales --project C:\data\my_project

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow undo daily_sales --project shop

Resumes pending undo actions for daily_sales in reverse completion order.

#### 04 Tips and pitfalls

Tip
Inspect the failed run and its undo state before retrying the workflow.

Avoid this pitfall
This applies to a workflow configured with rollback: true and a pending undo record.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## hdrctl workflow validate — slug: /cli/workflow/validate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / hdrctl workflow validateDownload shop project ↓Watch Hydra Academy ↗

COMMAND REFERENCE · HYDRA CLI 0.20.0

### hdrctl workflow validate

Check a workflow manifest and its dependencies without running it.
← All hdrctl workflow subcommands

#### 01 Objective

Check a workflow manifest and its dependencies without running it.

#### 02 Syntax

hdrctl workflow validate [OPTIONS] NAME|PATH

[OPTIONS] represents optional flags. Run hdrctl workflow validate --help to see every flag and argument.
Show complete CLI help for version 0.20.0
Usage: cli workflow validate [OPTIONS] NAME|PATH

Check a workflow manifest without running it.
NAME is a workflow of the current project (workflows/NAME.yaml); PATH is a file.

Examples:
hdrctl workflow validate daily_sales
hdrctl workflow validate workflows/daily_sales.yaml

Options:
--lang LANG Interface language (en, es)
--project PATH Hydra project folder (default: the project that contains the
current folder)
-h, --help Show this message and exit.

#### 03 Explained example

hdrctl workflow validate daily_sales --project shop

Validates the daily_sales graph before any step executes.

#### 04 Tips and pitfalls

Tip
Run it after adding or reordering workflow steps.

Avoid this pitfall
A valid graph does not prove every external job connection will work at run time.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Build data pipelines you can read. — slug: /dsl/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL Download PDF English · White Book

THE COMPLETE GUIDE · HYDRA DSL 1.0

### Build data pipelines you can read.

Learn the Hydra DSL from its first YAML file to complete projects. Follow six articles with diagrams, hands-on Killercoda labs, runnable GitHub examples and downloadable ZIP files.

Start reading → Explore jobs

#### Read the White Book

01 / CHAPTER

##### Basics

The four job files, projects, workflows, validation and your first run.
02A / CHAPTER

##### Jobs: sources and destinations

Connectors, schemas, loading modes and complete job examples.
02B / CHAPTER

##### Jobs: transformations

Clean, combine, aggregate and reshape data with the Hydra DSL.
03 / CHAPTER

##### Workflows

Dependencies, failure handling, rollback, threads and triggers.
04 / CHAPTER

##### Actions

Flow control, notifications, scripts, parameters and undo actions.
05 / CHAPTER

##### Parameters and secrets

Environments, overrides, secret lookup and safe configuration.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Basics — slug: /dsl/01-basics/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Basics Download PDF English · White Book

CHAPTER 01 / HYDRA DSL WHITE BOOK

### Basics

The four job files, projects, workflows, validation and your first run.

### Hydra DSL - Introduction

Hydra DSL is the language used to describe data pipelines in Hydra ETL. It is written in YAML: no code to compile, only files that describe what to move and how.

The language has three building blocks:

Job:

Reads data from a source, transforms it, writes it to a destination

A folder of YAML files:

Workflow:

Runs jobs and actions in a given order, with conditions, retries and rollback

Workflow are defined in workflows/.yaml:

Action:

Does something outside the workflow

A Hydra workflow supports 11 action types:

ActionPurpose

logWrite a message to the execution log.

delayWait for a specified duration.

conditionEvaluate a condition and store its Boolean result in a runtime parameter.

webhookSend an HTTP request.

emailSend an email through SMTP.

bashRun a Bash command on Linux or macOS.

powershellRun a PowerShell command on Windows.

sshRun a command on a remote machine through SSH.

pythonRun an inline Python script or call a Python file.

set_paramCreate a runtime parameter. Fails if it already exists.

assign_paramUpdate an existing runtime parameter. Fails if it does not exist.

Declare an action using type: action, followed by its name in action::

- name: announce_start type: action action: log params: message: "Workflow started."

#### How Workflows are structured:

Workflows are grouped in a project. The order in which the workflows of a project run is set by a thread (workflows/thread.yaml).

thread.yaml organises how workflows are called, bellow are thread.yaml example

#### A first look how job do

In this example a job reads a CSV file, keeps the rows with a positive price, computes a total and writes the result into the destination:

# sources.yaml version: "1.0" sources: source_csv: type: csv connection: {} extract: table: data/input.csv

# transformations.yaml version: "1.0" transformations: steps: - filter: expr: "price > 0" - calculate: column: total expr: "price * qty"

# destinations.yaml version: "1.0" destinations: dest_csv: type: csv connection: {} load: table: data/output.csv mode: replace

# pipeline.yaml version: "1.0" pipeline: from: source_csv to: dest_csv

Four short files, and the job is complete. The next chapters explain each of them.

### Hydra DSL - Basics

#### Rules for writing Hydra DSL files

When you write Hydra DSL files, remember the following rules:

Hydra DSL files are YAML files. Use spaces for indentation, never tabs.

Job files may use the .yaml or .yml extension.

Each file starts with version: "1.0". This is the version of the DSL format, not the version of Hydra.

Keys are fixed by the language. In a workflow, an unknown or misspelled key is rejected, with a suggestion.

Names you choose yourself (source ids, destination ids, step names) are free, but must be unique in their file.

#### Mistakes are reported, not ignored

A misspelled key is not silently skipped. For example, in a workflow:

steps: - name: notify type: action action: webhok # typo to provoque error params: url: https://example.com/hook

Hydra stops before running anything and reports:

Step 'notify': unknown action 'webhok'. Valid actions: assign_param, bash, condition, delay, email, log, powershell, python, set_param, ssh, webhook — did you mean 'webhook'?

To practice that case here is the lab on killercoda

Hands-on lab: Read Hydra’s error messages

About the lab: Practice in your browser with a guided Killercoda lab. Use hdrctl run . --dry-run to diagnose and fix an unknown action (webhok), a misspelled key (depend_on) and a missing required action field. Then check why omitting version is accepted. No workflow action is executed.

Duration: about 12 minutes. Prerequisite: basic YAML indentation.

The same applies to a misplaced key such as depend_on instead of depends_on.

### Hydra DSL - Project Structure

#### A job folder

A job is a folder. Hydra recognises a job by its files:

FileRequiredRole

sources.yamlYesWhere the data comes from

destinations.yamlYesWhere the data goes

pipeline.yamlYesWhich source feeds which destination

transformations.yamlNoWhat happens to the data on the way

.envNoEnvironment variables for this job

#### A project folder

hdrctl init creates a full project:

In the bellow example a project called myproject defines a single job called job1

PathRule

workflows/thread.yamlOptional. Without it, every workflows/*.yaml runs one after another, in alphabetical order

parameters.yamlValues available everywhere as {{ param:NAME }}

environments/<env>.yamlOverrides the parameters for one environment, selected with --env

#### Example: a job inside a workflow

# workflows/daily.yaml version: "1.0" workflow: name: daily description: Load the orders, then log a message trigger: type: manual steps: - name: load_orders # A job type: job job: ../jobs/job1 - name: notify # An action type: action action: log params: message: "Orders loaded." depends_on: [load_orders]

The step load_orders runs the job folder jobs/job1. The path is relative to the workflow file, which lives in workflows/: hence ../jobs/job1.

The step notify is an action. It runs only after load_orders, because of depends_on.

A complete Job example on github: The code

Browse the code on GitHub · Download the ZIP

#### Running it

hdrctl run jobs/job1 # run one job alone hdrctl run . --dry-run # validate the whole project, run nothing hdrctl run . # run every workflow, in the order of thread.yaml hdrctl run . --env prod # same, with environments/prod.yaml

###

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Jobs: sources and destinations — slug: /dsl/02-jobs-part1/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Jobs: sources and destinations Download PDF English · White Book

CHAPTER 02A / HYDRA DSL WHITE BOOK

### Jobs: sources and destinations

Connectors, schemas, loading modes and complete job examples.

### Hydra DSL - Jobs

A job moves data from one place to another and applies transformations when it needs before loading data into their destinations. A job simply a folder with up to four files:

FileRequiredAnswers the question

sources.yamlYesWhere does the data come from?

destinations.yamlYesWhere does the data go?

pipeline.yamlYesWhich source feeds which destination?

transformations.yamlNoWhat happens to the data on the way?

[FIGURE fig-02-01 · diagram] Anatomy of a job: source (sources.yaml) → extract → transformations (transformations.yaml) → load → destination (destinations.yaml), with pipeline.yaml drawn as the bracket that links from to to.

#### Rules for jobs

A job folder must contain sources.yaml, destinations.yaml and pipeline.yaml. .yml is also accepted.

Without transformations.yaml, the data is copied as is.

Each source and destination has an id (the key under sources: or destinations:). pipeline.yaml uses these ids.

A job reads one main source and writes to one destination. Other declared sources can be used by join, merge or union.

Relative file paths are resolved from the job folder.

### Hydra DSL - Sources

A source tells Hydra what to read and how to connect.

#### Syntax

version: "1.0" sources: <source_id>: type: <connector type> connection: <connection keys> extract: <what to read>

KeyRequiredDescription

typeYesConnector type (see the table below)

connectionNoHow to connect. {} for local files

extractYesWhat to read

schemaNoExpected structure of the documents (MongoDB)

#### Rules for sources

sources.yaml must declare at least one source.

type is not case sensitive: CSV and csv are the same.

extract must define table, query or collection.

extract.batch_size is the number of rows read at a time. Default 10000, minimum 10.

#### Connector types

[image: Hydra connectors grouped into Files (CSV, JSON, Parquet) and Databases (MySQL, MariaDB, PostgreSQL, SQL Server, MongoDB).]

typeReadWriteInstall

csv✔✔built in

json✔–built in

parquet✔✔pip install "hydra-etl[parquet]"

mysql, mariadb✔✔pip install "hydra-etl[mysql]"

postgresql, postgres✔✔pip install "hydra-etl[postgres]"

sqlserver, mssql✔✔pip install "hydra-etl[mssql]"

mongodb✔✔pip install "hydra-etl[mongodb]"

sqlite✔✔built in (Hydra 0.20+)

An unknown type stops the job with the list of supported types:

Connector 'src': unknown type 'excel'. Supported types: csv, json, mariadb, ...

#### The extract block

KeyUsed withDescription

tableallFile path, SQL table name

querySQL databasesA SQL SELECT statement

collectionMongoDBCollection name

filterMongoDBQuery filter, as a mapping

limitMongoDBMaximum number of documents to read

batch_sizeallRows per batch. Default 10000, minimum 10

#### CSV source

##### Connection keys

KeyDefaultDescription

base_paththe job folderFolder used to resolve table

delimiter,One character

quotechar"One character

encodingutf-8File encoding

lineterminator\nEnd of line

strict_schemafalseCheck the columns strictly

##### Example 1: minimal

version: "1.0" sources: orders: type: csv connection: {} extract: table: data/orders.csv

connection: {} means: all defaults. The file is read from <job folder>/data/orders.csv.

Hands on lab: Read CSV files of all shapes | Killercoda

##### Example 2: semicolon-separated, Latin-1 file

version: "1.0" sources: orders_fr: type: csv connection: delimiter: ";" encoding: latin-1 extract: table: data/commandes.csv batch_size: 50000

#### JSON source

Reads .json (an array or an object) and JSON Lines files (.jsonl, .ndjson). Nested objects are flattened into columns.

version: "1.0" sources: users: type: json connection: {} extract: table: data/users.json

# JSON Lines: one object per line sources: events: type: json connection: {} extract: table: logs/events.jsonl

JSON is read-only. To write JSON, use another destination type.

#### Parquet source

version: "1.0" sources: sales: type: parquet connection: {} extract: table: data/sales.parquet

#### SQL database sources

MySQL, MariaDB, PostgreSQL and SQL Server share the same shape.

##### Connection keys

KeyMySQL / MariaDBPostgreSQLSQL Server

host✔✔✔

port✔✔✔

user✔✔✔

password✔✔✔

database✔✔✔

schema–✔✔

instance––✔ named instance, e.g. SQLEXPRESS

tds_version––✔ protocol version

login_timeout, timeout––✔ seconds

##### Example 1: read a whole table (MySQL)

version: "1.0" sources: customers: type: mysql connection: host: localhost port: 3306 user: etl password: ${SECRET:MYSQL_PASSWORD} database: shop extract: table: customers

Never write a password in clear. ${SECRET:NAME} is explained in Parameters and Secrets.

##### Example 2: read with a SQL query (PostgreSQL)

version: "1.0" sources: recent_orders: type: postgresql connection: host: db.internal port: 5432 user: etl password: ${SECRET:PG_PASSWORD} database: sales schema: public extract: query: | SELECT id, customer_id, amount, created_at FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'

query and table are alternatives: use one or the other.

##### Example 3: SQL Server named instance

version: "1.0" sources: erp: type: sqlserver connection: host: SRV-ERP instance: SQLEXPRESS user: etl password: ${SECRET:MSSQL_PASSWORD} database: ERP schema: dbo extract: table: Invoices

host: SRV-ERP\SQLEXPRESS is accepted too.

[LAB lab-02-02 · Killercoda] Read from a SQL database

A MySQL and a PostgreSQL server are running. Read a whole table with table, then only the last 7 days with query.

#### SQLite source and destination

Hydra 0.20+. SQLite is part of Python: nothing to install, no server. connection.path is the database file, relative to the job folder.

sources: app: type: sqlite connection: path: ../../data/app.db extract: table: orders # or query: "SELECT ..."

destinations: warehouse: type: sqlite connection: path: ../../outputs/warehouse.db load: table: orders mode: upsert # append | replace | upsert key: [order_id]

A source file that does not exist is an error; it is never created by a read.

A destination file and table are created at the first batch, with types taken from the data (INTEGER, REAL, TEXT, BLOB). In upsert, the key becomes the primary key.

upsert on an existing table needs a primary key or a unique index on exactly the key columns; the error gives the CREATE UNIQUE INDEX to run.

All-or-nothing by default in the three modes: one transaction for the job, table creation included. load.atomic: false commits batch by batch.

rollback: true undoes a SQLite load like the other databases.

The database uses the WAL journal, so a job can read one table while it writes another in the same file.

#### MongoDB source

version: "1.0" sources: paid_orders: type: mongodb connection: uri: mongodb://localhost:27017 database: shop extract: collection: orders filter: status: paid limit: 1000

Instead of uri, you can give host, port, username and password.

[GITHUB gh-02-01 · example] mongodb_schema

Browse the code on GitHub · Download the ZIP

erreur du moteur à corriger ici

Défaut — Politiques de dérive MongoDB inopérantes

Version testée : Hydra ETL 0.16.0
Impact : perte silencieuse des nouveaux champs et absence d’arrêt avec drift_policy: fail.

#### Reproduction

La collection contient 102 documents :

Les 100 premiers : _id, customer, amount.

Les deux suivants ajoutent sales_channel, avec les valeurs web et store.

Configuration : mode: infer_strict, sample_size: 100. Répéter avec drift_policy: warn, fail, puis adapt.

PolitiqueRésultat attenduRésultat constaté

warnContinuer avec un avertissement de dérive102 lignes, aucun avertissement

failArrêter avec une erreur de dérive102 lignes, aucune erreur

adaptÉtendre le schéma et conserver sales_channel102 lignes, nouveau champ perdu

Le champ **sales_channel** est perdu dans les trois cas.

#### Deux causes identifiées

Le schéma n’atteint pas le connecteur.

Dans hydra_etl/internal/runner/executor.py, JobExecutor._build_connector() transmet connection et extract, mais omet definition.schema.

L’extraction ne gère pas la dérive.

Dans hydra_etl/plugins/connectors/mongodb/connector.py, extract_batches() normalise les documents sans déclencher leur validation ni adapter le schéma. Les champs inconnus disparaissent pendant la normalisation. Fournir directement le schéma au connecteur reproduit donc encore le défaut.

#### Correction nécessaire

Transmettre intégralement le bloc schema au connecteur.

Détecter les changements avant la normalisation.

Appliquer réellement warn, fail et adapt.

Pour adapt, actualiser le schéma, le normaliseur et la sortie afin de conserver les nouveaux champs.

Ajouter un test de régression vérifiant les trois comportements et les valeurs conservées.

Limite de la vérification : défaut reproduit avec le vrai moteur installé et un curseur MongoDB en mémoire. Le transfert complet avec un serveur MongoDB reste à tester. Aucun fichier du moteur n’a été modifié.

|

v

[LAB lab-02-03 · Killercoda] MongoDB documents and schema drift — Read a collection whose documents differ, then compare drift_policy: warn, fail and adapt.

Open the Killercoda lab

##### The schema block

MongoDB documents have no fixed structure. The optional schema block tells Hydra which fields to expect and what to do when the data differs.

sources: orders: type: mongodb connection: uri: mongodb://localhost:27017 database: shop extract: collection: orders schema: mode: hybrid drift_policy: warn validation_policy: best_effort sample_size: 200 fields: - name: order_id path: _id type: string required: true - name: customer_name path: customer.name type: string - name: items type: array array_handling: explode

KeyValuesDefault

modeauto (infer everything) · manual (only the declared fields) · infer_strict (infer from a sample, then enforce) · hybrid (declared fields + inference for the rest)auto

drift_policyfail · warn · ignore · adaptwarn

validation_policystrict · best_effort · permissivebest_effort

sample_sizeDocuments read to infer the structure, ≥ 1100

fields[]name, type, path, required, default, array_handling, description–

fields[].typestring · integer · float · decimal · boolean · date · datetime · array · object · json

[image: Four array_handling representations of the same document: keep preserves an array in one row; flatten creates items_0 and items_1 columns; explode creates two rows with id 1; json stores the array as JSON-encoded text.]

array_handlingResult

keepThe array stays in one column

flattenOne column per element

explodeOne row per element

jsonThe array becomes a JSON string

### Hydra DSL - Destinations

A destination tells Hydra where to write and how.

#### Syntax

version: "1.0" destinations: <destination_id>: type: <connector type> connection: <connection keys> load: table: <file or table> mode: append | replace | upsert

type and connection work exactly as for sources.

#### The load block

KeyDefaultDescription

table–Target file or table. Required

collection–Alias of table for MongoDB

modeappendappend · replace · upsert

key–Key columns. Required with upsert

batch_size10000Rows written at a time, from 10 to 100000

atomicdependsAll or nothing (see below)

#### Rules for destinations

destinations.yaml must declare at least one destination.

mode: upsert requires key.

key is always a list: [id] or [region, product_id].

CSV and Parquet files accept append and replace only.

#### Load modes

[image: Before and after loading the same incoming rows: append preserves existing rows and adds both incoming rows; replace clears the target then inserts the incoming rows; upsert matches on id, updates id 2, inserts id 3, and preserves id 1. Append assumes duplicate IDs are allowed.]

ModeWhat happensCSV · ParquetSQL databases

appendAdds the rows✔✔

replaceEmpties the target, then writes✔✔

upsertUpdates rows whose key exists, inserts the others–✔

##### Example 1: replace a CSV file

version: "1.0" destinations: report: type: csv connection: {} load: table: output/report.csv mode: replace

The parent folder output/ is created if needed.

##### Example 2: append to a PostgreSQL table

version: "1.0" destinations: dwh_orders: type: postgresql connection: host: dwh.internal port: 5432 user: etl password: ${SECRET:DWH_PASSWORD} database: dwh schema: staging load: table: orders mode: append batch_size: 5000

##### Example 3: upsert with a simple key

load: table: customers mode: upsert key: [customer_id]

##### Example 4: upsert with a composite key

load: table: sales mode: upsert key: [region, product_id]

##### Example 5: what if key is missing?

load: table: customers mode: upsert

The job is refused before it starts:

mode 'upsert' requires 'key' parameter. Specify primary key or unique key columns. Examples: key: [id] # Simple key key: [region, product_id] # Composite key

#### Atomic load: all or nothing

[image: SQL append timelines starting with 100 rows and loading 10 rows per batch: batch 3 fails before committing. With atomic: false, batches 1 and 2 remain and the destination contains 120 rows. With atomic: true, pending changes are rolled back and the original 100 rows remain unchanged.]

With atomic: true, nothing is visible in the destination before the end of the job. If the job fails, the destination is left as it was.

DestinationDefault

CSV, Parquetatomic

SQL database, replaceatomic

SQL database, append or upsertnot atomic

load: table: orders mode: append atomic: true # one transaction for the whole load

[LAB lab-02-04 · Killercoda] Load modes and atomicity

### Hydra DSL - Pipeline

pipeline.yaml connects one source to one destination.

#### Syntax

version: "1.0" pipeline: from: <source_id> to: <destination_id>

#### Rules for the pipeline

from must be an id declared in sources.yaml.

to must be an id declared in destinations.yaml.

If transformations.yaml exists, it is applied between from and to.

#### Example: one file, several sources

# sources.yaml version: "1.0" sources: orders: type: csv connection: {} extract: table: data/orders.csv customers: type: csv connection: {} extract: table: data/customers.csv

# pipeline.yaml version: "1.0" pipeline: from: orders to: dwh_orders

[image: The orders source selected by pipeline.from flows through a join to dwh_orders. The additional customers source enters the join as a side input.]

Job declaring two sources (orders, customers), one used by the pipeline and one by a join, with sample data.

[GITHUB gh-02-03 · example] multi_source_job —

Browse the code on GitHub · Download the ZIP

orders is the main flow. customers is not read by the pipeline itself: it is available to a join, merge or union in transformations.yaml.

#### Example: a complete job, CSV to MySQL

# sources.yaml version: "1.0" sources: src_products: type: csv connection: delimiter: ";" extract: table: data/products.csv

# destinations.yaml version: "1.0" destinations: db_products: type: mysql connection: host: localhost port: 3306 user: etl password: ${SECRET:MYSQL_PASSWORD} database: shop load: table: products mode: upsert key: [sku]

# pipeline.yaml version: "1.0" pipeline: from: src_products to: db_products

hdrctl run jobs/products

Every run updates the products whose sku already exists and inserts the new ones.

[GITHUB gh-02-02 · example] — Complete job of this page

Browse the code on GitHub · Download the ZIP

[LAB lab-02-05 · Killercoda] Build a complete job

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Jobs: transformations — slug: /dsl/02-jobs-part2/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Jobs: transformations Download PDF English · White Book

CHAPTER 02B / HYDRA DSL WHITE BOOK

### Jobs: transformations

Clean, combine, aggregate and reshape data with the Hydra DSL.

### Hydra DSL - Transformations

transformations.yaml lists the operations applied to the data between the source and the destination, in order.

#### Syntax

version: "1.0" transformations: engine: auto # optional: auto | pandas | duckdb steps: - <operation>: <parameters> - <operation>: <parameters>

[image: Transformations run in order: select removes the note column, filter keeps rows with amount >= 100, and calculate adds amount_ttc.]

#### Rules for transformations

steps is a list with at least one step.

Each step has exactly one key: the name of the operation.

The parameters of an operation are always a mapping, even when there is only one.

Steps run from top to bottom. Each step receives the result of the previous one.

An unknown operation is refused before the job starts.

A column that does not exist is reported with the list of available columns.

#### The 20 operations

FamilyOperations

Columnsselect · rename · cast

Rowsfilter · sort · deduplicate · fill_null · trim · clean

Calculationcalculate · script

Aggregationaggregate

Analyticswindow

Combiningjoin · merge · union

Reshapingpivot · unpivot · transpose · text_to_rows

No other operation exists. window, text_to_rows and join with how: cross were added in Hydra 0.17.0.

All the examples of this chapter start from this table, orders:

idcustomer_idcountryamountstatus

1100FR120.0paid

2101BE80.0cancelled

3100FR45.5paid

4102DEpaid

[GITHUB gh-02-04 · example] transformations_playground — One job folder per operation of this chapter, all reading the same orders.csv, each with its expected output, to run and compare.

Browse the code on GitHub · Download the ZIP

#### Three ways to look at an operation

Each operation can be read from three angles. Knowing all three avoids most surprises.

AngleQuestionPossible answers

ShapeWhat does it change in the table?Columns only · rows only · both · the whole layout

ScopeDoes it need to see all the rows at once?Row by row (runs batch by batch) · Global (needs the whole table)

CardinalityHow many rows come out for one row in?1 → 1 · 1 → 0 or 1 · 1 → n · n → 1 · n × m

OperationShapeScopeCardinality

selectColumnsRow by row1 → 1

renameColumnsRow by row1 → 1

castColumn typesRow by row1 → 1

filterRowsRow by row1 → 0 or 1

sortRow orderGlobal1 → 1

deduplicateRowsGlobaln → 1

fill_nullValuesRow by row1 → 1

trimValuesRow by row1 → 1

cleanValuesRow by row1 → 1

calculateAdds / replaces a columnRow by row1 → 1

scriptAdds / replaces columnsrow: row by row · vectorized: Global1 → 1

aggregateRows and columnsGlobaln → 1 per group

windowAdds columnsGlobal1 → 1 (every row is kept)

joinAdds columnsinner / left / cross: row by row · right / outer: Global1 → 0..n · cross: n × m

mergeRowsGlobalReplaces, adds, removes rows

unionRowsGlobalAdds rows

pivotLayout (long → wide)Globaln → 1 per index

unpivotLayout (wide → long)Global1 → n

transposeLayout (rows ↔ columns)GlobalRows become columns

text_to_rowsRowsRow by row1 → n (never 0)

##### Why the scope matters

Hydra reads the source in batches. Row-by-row operations run on each batch as it arrives, so memory stays flat whatever the size of the source. From the first global step, Hydra gathers the rows and runs that step and every step after it on the whole table.

Rule of thumb: put filter, select and cast before the first global step. Fewer rows and columns are gathered, the job uses less memory and runs faster, and the result is the same.

# Good: rows and columns are reduced batch by batch, then aggregated steps: - filter: { expr: "status == 'paid'" } - select: { columns: [country, amount] } - cast: { mapping: { amount: float } } - aggregate: { by: [country], agg: { amount: sum } }

# Same result, but every row and every column is gathered before the filter steps: - aggregate: { by: [country, status], agg: { amount: sum } } - filter: { expr: "status == 'paid'" }

[image: Three batches pass separately through filter, select and cast; the remaining rows are gathered before aggregate, and every later step runs on that gathered table.]

#### Choosing the operation from the question

You want to…Use

Keep some columns / change their names / their typesselect · rename · cast

Keep some rowsfilter

Remove duplicatesdeduplicate

Clean text (spaces, case) or replace empty valuestrim · clean · fill_null

Compute a new column from the same rowcalculate (expression) · script (Python)

One row per group (totals, counts…)aggregate

Keep every row and add a rank, a running total, the previous value, the group totalwindow

Add columns from another sourcejoin

Every combination of two listsjoin with how: cross

Apply updates from another source by keymerge

Stack two sourcesunion

Values of a column become columns (and back)pivot · unpivot

Swap rows and columnstranspose

A cell holds a list ("a;b;c"): one row per valuetext_to_rows

### Hydra DSL - Column Operations

#### select

Keeps only the listed columns, in the given order.

ParameterRequiredDescription

columnsYesList of columns to keep

- select: columns: [id, country, amount]

idcountryamount

1FR120.0

2BE80.0

………

select also reorders: the output columns follow the list.

A name listed twice is kept once.

An unknown column stops the job with the list of available columns.

#### rename

ParameterRequiredDescription

mappingYesold_name: new_name

- rename: mapping: customer_id: client_id amount: total_eur

Columns not listed keep their name. The steps after rename must use the new names.

#### cast

Converts the type of columns.

ParameterRequiredDescription

mappingYescolumn: type

TypeResult

intInteger. Empty values stay empty

floatDecimal number

strText

boolTrue / false. Accepted: true 1 yes oui on / false 0 no non off (any case)

datetimeDate and time

- cast: mapping: id: int amount: float created_at: datetime

A value that cannot be converted stops the job, with the column, the type and the reason.

Why cast matters. A CSV column is read as text. Comparisons, sums and window functions on numbers need a cast first: "9" > "10" is true for text, false for numbers. Since Hydra 0.19.1, aggregate (sum, mean) and window (cumsum, cummin, cummax, sum, mean) refuse a text column and tell you which cast to add.

### Hydra DSL - Row Operations

#### filter

Keeps the rows for which the expression is true.

ParameterRequiredDescription

exprYesA condition (see Expressions)

##### Example 1: a simple condition

- filter: expr: "amount > 50"

idcustomer_idcountryamountstatus

1100FR120.0paid

2101BE80.0cancelled

Row 4 has no amount: a comparison with an empty value is false, so the row is not kept.

##### Example 2: several conditions

- filter: expr: "status == 'paid' and country in ['FR', 'DE']"

idcustomer_idcountryamountstatus

1100FR120.0paid

3100FR45.5paid

4102DEpaid

##### Example 3: exclude

- filter: expr: "not (status == 'cancelled')"

##### Example 4: keep the first row of each group (with window)

- window: partition_by: customer_id order_by: [{ col: amount, desc: true }] columns: rn: { func: row_number } - filter: expr: "rn == 1"

filter can test any column computed before it. See Recipes.

#### sort

ParameterDefaultDescription

by–Columns to sort by. Required

ascendingtruetrue, false, or one value per column

- sort: by: [amount] ascending: false

# country A→Z, then amount from highest to lowest - sort: by: [country, amount] ascending: [true, false]

Rows with equal values keep their original order (stable sort): the result is the same at each run, and the same with DuckDB.

Empty values go last.

sort is global: place it as late as possible, after the filters.

#### deduplicate

ParameterDefaultDescription

columnsall columnsColumns that define a duplicate

keepfirstfirst or last occurrence

# one row per customer, the last one seen - deduplicate: columns: [customer_id] keep: last

idcustomer_idcountryamountstatus

2101BE80.0cancelled

3100FR45.5paid

4102DEpaid

“First” and “last” follow the order of the rows. To keep “the most recent” or “the biggest”, sort first, or use window + filter (see Recipes).

#### fill_null

Replaces empty values.

ParameterDescription

valueOne value for every column

columnsA different value per column: column: value

One of the two is required.

- fill_null: value: 0

- fill_null: columns: amount: 0 country: "UNKNOWN"

Prefer columns: a single value also fills text columns with 0.

#### trim

Removes the spaces at the start and end of text values.

ParameterDefaultDescription

columnsall text columnsColumns to trim

- trim: columns: [country, status]

#### clean

Normalises text: removes the spaces at the start and end, replaces repeated spaces with one, and optionally changes the case.

ParameterDefaultDescription

columnsall text columnsColumns to clean

casenonenone · lower · upper

- clean: columns: [status] case: upper

BeforeAfter

" paid ""PAID"

"can celled""CAN CELLED"

Any other value of case is refused.

Clean before you compare. clean before deduplicate, join or aggregate: "Paid " and "paid" are two different keys until they are cleaned.

[LAB lab-02-06 · Killercoda] Clean a messy file — Take a CSV with spaces, mixed case, duplicates and empty cells, and make it clean with trim, clean, deduplicate and fill_null, checking the file after each step.

Open the Killercoda lab

### Hydra DSL - Calculation

#### calculate

Adds a column (or replaces an existing one) computed from an expression.

ParameterRequiredDescription

columnYesName of the column to create

exprYesExpression (see Expressions)

##### Example 1: arithmetic

- calculate: column: amount_ttc expr: "amount * 1.2"

##### Example 2: from several columns

- calculate: column: total expr: "price * qty - discount"

##### Example 3: a true/false flag

- calculate: column: is_big expr: "amount > 100"

idamountis_big

1120.0True

280.0False

##### Example 4: from a column computed by window

- window: partition_by: country columns: country_total: { func: sum, col: amount } - calculate: column: share expr: "amount / country_total"

calculate reads only the current row. To use other rows (previous row, group total, rank), compute them with window first.

#### script

Runs a short piece of Python when an expression is not enough. You declare what the code reads (inputs) and what it produces (outputs).

ParameterDefaultDescription

inputs[]Columns given to the code

outputs–Columns produced, with their type. Required

code–Python code. Required

modevectorizedvectorized (whole columns) or row (one row at a time)

Output types: int · float · str · bool · date · datetime · any.

##### Example 1: row mode

Each input is a single value. Each output must be assigned.

- script: mode: row inputs: [amount, country] outputs: segment: str code: | if amount is None: segment = "unknown" elif country == "FR" and amount > 100: segment = "premium_fr" else: segment = "standard"

##### Example 2: vectorized mode

Each input is a whole column. Faster on large data.

- script: inputs: [price, qty] outputs: total: float code: | total = price * qty

##### Example 3: using a parameter

Job parameters are available, read-only, in params:

- script: mode: row inputs: [amount] outputs: above_threshold: bool code: | above_threshold = amount > params["min_amount"]

#### Rules for scripts

No import, no file or network access.

Only these built-in functions are available: abs round min max sum len int float str bool list dict tuple set sorted reversed zip range enumerate map filter any all divmod pow isinstance print format repr ord chr hex bin.

Every column listed in outputs must be assigned by the code.

print(...) output appears in the job log.

vectorized mode is global (the code may compute a mean or a rank over the whole column, so it receives every row at once). row mode runs batch by batch.

#### Which one: calculate, script or window?

NeedOperation

Arithmetic, comparison, logic on the current rowcalculate

if / elif / else, loops, text handling on the current rowscript in row mode

Rank, previous / next value, running total, group totalwindow

Anything else on whole columnsscript in vectorized mode

Prefer the first operation that fits: it is shorter, checked before the run, and faster.

[LAB lab-02-07 · Killercoda] From expression to script — Compute a customer segment first with calculate, then with script in row mode, then in vectorized mode, and compare.

### Hydra DSL - Aggregation

#### aggregate

Groups the rows and computes one value per group.

ParameterRequiredDescription

byYesGrouping columns

aggYesOutput columns and how to compute them

Functions: sum · count · mean · avg (same as mean) · min · max · first · last.

sum and mean need a numeric column. A column read from a CSV is text until it is cast: add a cast step before aggregate, otherwise the step fails with sum needs a numeric column ('amount' is object) (Hydra 0.19.1+; before, the values were silently concatenated).

##### Example 1: long form

- aggregate: by: [country] agg: total_amount: { func: sum, col: amount } nb_orders: { func: count, col: id }

countrytotal_amountnb_orders

BE80.01

DE0.01

FR165.52

Empty values are ignored: the sum of a group with no value is 0 (DE). count counts the non-empty values of col.

##### Example 2: short form

When the output column has the same name as the source column:

- aggregate: by: [country] agg: amount: sum

##### Example 3: several grouping columns

- aggregate: by: [country, status] agg: avg_amount: { func: avg, col: amount } max_amount: { func: max, col: amount }

##### aggregate or window?

Both use groups. aggregate replaces the rows with one row per group; window keeps every row and adds the group value on each one.

aggregate by country, sum(amount)window partition by country, sum(amount)

3 rows: BE 80 · DE 0 · FR 165.54 rows, each with its country total

[FIGURE fig-02-08 · diagram] Rows coloured by country, gathered into three groups, each group reduced to one row with sum(amount) and count(id).

### Hydra DSL - Window Functions

#### window

Adds columns computed over a group of rows, and keeps every row, in its input order. It answers the questions that need other rows than the current one: What is the rank of this order for its customer? What was the previous amount? What is the running total? What share of the country total is this order?

ParameterDefaultDescription

partition_bywhole tableColumn or list of columns splitting the rows into independent groups (partitions)

order_by–Order inside each partition: column names, or {col, desc} items

columns–Required. output_column: {func, col, offset, default}

##### Functions

FamilyFunctionsNeeds order_byOptions

Rankrow_number · rank · dense_rankYesnone

Offsetlag (previous row) · lead (next row)Yescol (required), offset (≥ 1, default 1), default

Runningcumsum · cumcount · cummin · cummaxYescol (optional for cumcount)

Whole partitionsum · mean · min · max · count · first · lastNocol (required)

##### Example 1: per customer, numbered, with the previous amount and the running total

- window: partition_by: customer_id order_by: [id] columns: order_no: { func: row_number } prev_amount: { func: lag, col: amount, default: 0 } running_total: { func: cumsum, col: amount } customer_total: { func: sum, col: amount }

idcustomer_idamountorder_noprev_amountrunning_totalcustomer_total

1100120.010.0120.0165.5

210180.010.080.080.0

310045.52120.0165.5165.5

410210.00.0

The rows stay in their input order: only columns are added.

prev_amount: the first order of each customer has no previous row, so it gets default (0).

running_total of order 4 is empty: no value has been seen yet in its partition.

customer_total of customer 102 is 0: the sum of a partition with no value is 0, as in aggregate.

##### Example 2: row_number, rank, dense_rank

On a scores table, ordered by score descending:

- window: order_by: [{ col: score, desc: true }] columns: row_number: { func: row_number } rank: { func: rank } dense_rank: { func: dense_rank }

playerscorerow_numberrankdense_rank

Ana90111

Ben85222

Chloé85322

Dan70443

row_number: always 1, 2, 3… Ties are broken by input order (Ben before Chloé), so the result is the same at each run.

rank: equal rows share a rank, and the next rank skips (4).

dense_rank: equal rows share a rank, no gap (3).

##### Example 3: share of the country total (no order_by)

- window: partition_by: country columns: country_total: { func: sum, col: amount } - calculate: column: share expr: "amount / country_total"

idcountryamountcountry_totalshare

1FR120.0165.50.725

2BE80.080.01.0

3FR45.5165.50.275

4DE0.0

##### Example 4: the two previous values, with a text default

- window: partition_by: customer_id order_by: [id] columns: prev_status: { func: lag, col: status, default: "none" } prev2_amount: { func: lag, col: amount, offset: 2 } next_amount: { func: lead, col: amount }

#### Rules for window

Every row is kept, in its input order. window adds columns; it never removes or moves a row.

order_by sorts inside each partition. Empty values go last, even with desc: true. Equal rows keep their input order.

Rank, offset and running functions require order_by. Whole-partition functions do not (first / last use it when given, the input order otherwise).

Without partition_by, the whole table is one partition.

lag / lead: default applies only when the offset leaves the partition. An empty value inside the partition stays empty.

Running functions skip empty values: the row keeps the running value reached so far (empty while no value has been seen).

Whole-partition functions ignore empty values, as aggregate. first / last return the first / last non-empty value.

cumsum, cummin, cummax, sum and mean need a numeric column: cast it first.

An output column that already exists is refused: choose another name.

An option that does not apply to the function (for example offset on sum) is refused, never ignored.

window is global. With the large-volume engine it runs in DuckDB (OVER (PARTITION BY … ORDER BY …)) with the same rows, values and types as pandas.

[image: Window functions partition orders by customer_id and sort by id: lag reads the preceding row, cumsum accumulates from the start, and sum covers the entire partition.]

[LAB lab-02-11 · Killercoda] Window functions — On a sales file, number the orders of each customer, keep the latest one, compute the running total per month and the share of each order in its country total.

Open the Killercoda lab

### Hydra DSL - Combining Data

join, merge and union combine the main flow with a second source, declared in sources.yaml and referenced by its id in right.

# sources.yaml sources: orders: # main flow (pipeline.from) type: csv connection: {} extract: { table: data/orders.csv } customers: # second source, used by right: type: csv connection: {} extract: { table: data/customers.csv }

The second source can be of any type: a CSV file can be joined with a MySQL table, a PostgreSQL table merged into a Parquet file.

customers:

customer_idname

100Alice

101Bob

103Chloé

#### join

ParameterDefaultDescription

right–Id of the second source. Required

key–Common column, or list of columns

left_key, right_key–When the key has a different name on each side

howinnerinner · left · right · outer · cross

max_rows10000000how: cross only. Maximum number of rows produced

key, or left_key + right_key, is required — except with how: cross, which takes no key.

[FIGURE fig-02-09 · diagram] The four how values as Venn diagrams on orders and customers, with the resulting rows listed under each.

##### Example 1: inner join

- join: right: customers key: customer_id

idcustomer_idcountryamountstatusname

1100FR120.0paidAlice

2101BE80.0cancelledBob

3100FR45.5paidAlice

Order 4 (customer 102) has no match and is dropped.

##### Example 2: left join

- join: right: customers key: customer_id how: left

All the orders are kept; name is empty for customer 102.

##### Example 3: keys with different names

- join: right: customers left_key: client_id right_key: customer_id

##### Example 4: composite key

- join: right: prices key: [country, product_id]

##### Example 5: cross join — every combination

how: cross pairs every row of the main flow with every row of right, in order. No key.

sizes:

size

S

M

L

colors (second source):

color

red

blue

- join: right: colors how: cross

sizecolor

Sred

Sblue

Mred

Mblue

Lred

Lblue

Typical uses: build a product catalogue (size × color), a calendar grid (stores × days) to find the days without sales, a test matrix.

Guard. A cross join grows fast (10 000 × 10 000 = 100 million rows). The job stops before producing the batch that would exceed max_rows (counted over all batches), with the number of rows it would have produced. Filter the inputs first, or raise max_rows if this size is intended:

- join: right: calendar how: cross max_rows: 50000000

#### Rules for join

When both sides have a column with the same name (other than the key), the column from right gets the suffix _r.

key, left_key or right_key with how: cross is refused. max_rows without how: cross is refused.

A key that appears several times on the right multiplies the rows: one order joined to a customer listed twice gives two rows. deduplicate the right source by its key if it is meant to be unique.

inner, left and cross run batch by batch. right and outer are global (the right rows without a match must be added once, not once per batch).

#### merge

Applies the rows of the second source onto the main flow, by key: rows with a known key are replaced, new keys are added.

ParameterDefaultDescription

right–Id of the second source. Required

key–Matching column or columns. Required

delete_unmatchedfalseAlso remove rows whose key is not in the second source

- merge: right: customer_updates key: customer_id

Main flowSecond sourceResult

100 Alice100 Alice Martin100 Alice Martin

101 Bob–101 Bob

–104 David104 David

With delete_unmatched: true, row 101 is removed: the flow is fully synchronised with the second source.

merge works on the data in the flow. To update rows in the destination table, use the load mode upsert (see Jobs, part 1).

#### union

Stacks the rows of the second source under the main flow. Columns are matched by name; a missing column is left empty.

ParameterDefaultDescription

right–Id of the second source. Required

distinctfalsetrue removes identical rows

- union: right: orders_2025 distinct: true

distinct: false is UNION ALL in SQL; distinct: true is UNION.

#### join, merge or union?

The second source brings…Operation

New columns for existing rowsjoin

New versions of rows, by keymerge

More rows of the same kindunion

A list to combine with every rowjoin with how: cross

[LAB lab-02-08 · Killercoda] Join, merge, union — Combine an orders file with a customers file in the three ways, and explain each result row.

Open the Killercoda lab

### Hydra DSL - Reshaping Data

#### pivot

Turns the values of one column into columns.

ParameterDefaultDescription

index–Columns kept as rows. Required

column–Column whose values become columns. Required

values–Column that fills the cells. Required

aggfuncfirstHow to combine several values for the same cell (sum, mean, min, max, count, first)

- pivot: index: [region] column: month values: sales aggfunc: sum

regionmonthsales

NorthJan10

NorthFeb12

SouthJan7

becomes

regionFebJan

North1210

South7

The new columns are found in the data: you do not list Jan, Feb… A month that appears next time becomes a new column. If the destination expects fixed columns, add a select after pivot.

#### unpivot

The opposite of pivot: turns columns into rows.

ParameterDefaultDescription

id_vars–Columns kept as they are. Required

value_varsall other columnsColumns turned into rows

var_namevariableName of the column receiving the old column names

value_namevalueName of the column receiving the values

- unpivot: id_vars: [region] value_vars: [Jan, Feb] var_name: month value_name: sales

regionJanFeb

North1012

becomes

regionmonthsales

NorthJan10

NorthFeb12

#### transpose

Swaps rows and columns.

ParameterDefaultDescription

index_col–Column whose values become the new column names

header_namecolumnName of the column receiving the old column names

- transpose: index_col: metric header_name: field

metric20242025

revenue100130

cost6070

becomes

fieldrevenuecost

202410060

202513070

#### text_to_rows

Splits a text column into one row per value: "a;b;c" gives three rows, the other columns are copied on each.

ParameterDefaultDescription

column–Column to split. Required

sep,Separator, plain text

regexfalsetrue: sep is a regular expression

trimtrueRemove the spaces around each value

keep_emptyfalseKeep the empty values ("a;;b" → a, "", b)

index_column–Optional: new column with the position of the value (1, 2, 3…)

products:

idnametags

1Mugkitchen; gift ;sale

2Penoffice

3Lamp

4Boxgift;;

##### Example 1: one row per tag, with its position

- text_to_rows: column: tags sep: ";" index_column: tag_pos

idnametagstag_pos

1Mugkitchen1

1Muggift2

1Mugsale3

2Penoffice1

3Lamp

4Boxgift1

Spaces around each value are removed (" gift " → gift).

Empty values are dropped ("gift;;" → one row).

Product 3 has no tag: it keeps one row, with an empty tag. A row is never lost.

index_column is placed right after column.

##### Example 2: several separators

- text_to_rows: column: emails sep: "[;,|]" regex: true

"a@x.com, b@x.com|c@x.com" gives three rows.

##### Example 3: count the products per tag

- text_to_rows: column: tags sep: ";" - aggregate: by: [tags] agg: nb_products: { func: count, col: id }

#### Rules for text_to_rows

A row with an empty value, or with no non-empty part, gives one row with an empty value (and an empty position). No input row is lost.

sep cannot be empty. With regex: true, an invalid expression is refused before the run.

index_column must be a new column name, different from column.

Unknown options are refused.

text_to_rows runs batch by batch: it can split a file of any size.

[image: The same sales values reshaped: pivot turns month values into columns, unpivot turns month columns into rows, and transpose swaps rows and columns.]

[image: text_to_rows splits Mug tags into kitchen, gift and sale with positions 1, 2 and 3; Lamp keeps one row with an empty tag and position.]

### Hydra DSL - Recipes

Common questions, answered by combining operations.

#### Latest order of each customer

- window: partition_by: customer_id order_by: [{ col: id, desc: true }] columns: rn: { func: row_number } - filter: expr: "rn == 1" - select: columns: [id, customer_id, amount, status]

Change rn == 1 to rn <= 3 for the top 3 per customer.

#### Change compared with the previous period

- cast: mapping: { revenue: float } - window: partition_by: store order_by: [month] columns: prev_revenue: { func: lag, col: revenue } - calculate: column: growth_pct expr: "(revenue - prev_revenue) / prev_revenue * 100"

#### Running total and cumulative share

- window: partition_by: country order_by: [id] columns: running: { func: cumsum, col: amount } country_total: { func: sum, col: amount } - calculate: column: cumulative_pct expr: "running / country_total * 100"

#### Days without sales

# stores × calendar, then the sales of each day - join: right: calendar how: cross - join: right: daily_sales key: [store_id, day] how: left - filter: expr: "amount != amount" # empty amount: no sale that day

#### Clean, deduplicate, enrich, aggregate

- clean: { columns: [email], case: lower } - deduplicate: columns: [email] - join: right: crm_accounts key: email how: left - fill_null: columns: { segment: "unknown" } - aggregate: by: [segment] agg: nb_contacts: { func: count, col: email }

[GITHUB gh-02-06 · example] transformation_recipes — One job per recipe of this page, each with its input files and expected output.

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Transformation Engines

The engine is what executes the steps. Hydra has two:

EngineStrengthInstall

pandasReference engine, every operationbuilt in

duckdbLarge volumes: aggregate, sort, window, and join with how: right or outer, computed on disk instead of in memorypip install "hydra-etl[duckdb]"

Both give the same result. Only the speed and the memory used change.

#### Choosing the engine

version: "1.0" transformations: engine: auto steps: - aggregate: by: [country] agg: amount: sum

engineWhat happens

auto (default)pandas, unless the job has a global operation and the CSV source is estimated above 2 000 000 rows: then duckdb

pandasAlways pandas

duckdbDuckDB for the global operations it can translate, pandas for the others

[image: Decision tree for engine auto: a global operation, a CSV estimate at or above the row threshold, and the DuckDB extra are all required; every no branch selects pandas.]

#### Rules for engines

engine is optional. Without it, auto is used.

The variable HYDRA_ENGINE overrides engine: for every job: HYDRA_ENGINE=pandas hdrctl run .

The threshold of auto is set by HYDRA_LARGE_VOLUME_ROWS (default 2000000).

auto estimates the size of CSV sources only. For a database source, write engine: duckdb to use DuckDB.

engine: duckdb without the DuckDB extra stops the job with the install command. auto falls back to pandas with a warning.

Row-by-row operations always run in pandas, batch by batch.

DuckDB runs aggregate, sort, window and join (right / outer). If it cannot guarantee the same result as pandas for a step (a column type, an option), the step is handed back to pandas, with a message in the log — never silently.

#### Example 1: let Hydra decide

transformations: steps: - filter: expr: "status == 'paid'" - aggregate: by: [country] agg: amount: sum

The job log tells which engine was chosen, and why:

Job 'sales': engine pandas (auto : ≈ 120 000 lignes estimées (< 2 000 000))

#### Example 2: force DuckDB on a database source

transformations: engine: duckdb steps: - sort: by: [created_at]

#### Example 3: force pandas for one run

HYDRA_ENGINE=pandas hdrctl run jobs/sales

#### Under the hood: two automatic accelerations

These need no DSL key. They are listed so that you recognise them in the logs.

AccelerationApplies toControlled by

numexprLarge filter and calculate on numeric columnsHYDRA_NUMEXPR (1 default: only where the result is bit-for-bit identical · all · 0 off)

Native CSV reader/writer (Rust)Reading and writing CSVpip install "hydra-etl[native]", then HYDRA_BACKEND=rust or a hydra.backends.yaml file

[LAB lab-02-09 · Killercoda] pandas vs DuckDB — Run the same aggregation on a 5-million-row CSV with engine: pandas, then engine: auto, and compare time and memory in the job report.

Open the Killercoda lab

[GITHUB gh-02-05 · example] large_volume_engine — Job with a data generator script for a large CSV, and three variants of transformations.yaml (auto, pandas, duckdb).

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Expressions

filter.expr and calculate.expr use the same small expression language. Column names are written as they are.

#### Rules for expressions

Write the whole expression between quotes in YAML: expr: "amount > 50".

Text values go between single quotes inside: "status == 'paid'".

A column name with spaces goes between backticks: "`unit price` > 10".

filter needs a condition (true/false). calculate accepts any value.

An expression reads the current row only. For other rows, use window first.

A comparison with an empty value is false.

#### Operators

KindOperatorsExample

Arithmetic+ - * / // % **"price * qty"

Comparison== != < <= > >="amount >= 100"

Logicand or not"paid and not refunded"

Membershipin not in"country in ['FR', 'BE']"

Grouping( )"(a + b) * 2"

#### Examples, from simple to complex

- filter: expr: "amount > 0"

- filter: expr: "country == 'FR' or (country == 'BE' and amount > 100)"

- filter: expr: "status not in ['cancelled', 'refunded']"

- calculate: column: margin_pct expr: "(price - cost) / price * 100"

- calculate: column: unit_price expr: "`total amount` / qty"

#### When the expression is wrong

- filter: expr: "amount >> 50"

The job stops on this step and shows the expression and the reason. hdrctl validate checks the syntax of every expression before the run.

[LAB lab-02-10 · Killercoda] Expression drills — Ten small filtering and calculation exercises on the orders table, each checked automatically.

#### Where expressions are used

PlaceLanguage

filter.expr, calculate.exprThis page

script.codeRestricted Python (see Calculation)

when: of a workflow stepSee Workflows

### Hydra DSL vs SQL

SQL is the language every data person knows. Hydra does not replace it: a database source can still push work to the database with extract.query. But for the transformation layer of a pipeline, the Hydra DSL is easier to read, to review and to move from one system to another. The same five questions, written both ways.

#### 1. Paid revenue per country

SQL

SELECT country, SUM(CAST(amount AS DECIMAL(12,2))) AS total_amount, COUNT(id) AS nb_orders FROM orders WHERE status = 'paid' GROUP BY country;

Hydra

- filter: { expr: "status == 'paid'" } - cast: { mapping: { amount: float } } - aggregate: by: [country] agg: total_amount: { func: sum, col: amount } nb_orders: { func: count, col: id }

SQL is written SELECT → FROM → WHERE → GROUP BY but executed FROM → WHERE → GROUP BY → SELECT. Hydra is written in the order it runs: read it from top to bottom and you know what happens to the data.

#### 2. Latest order of each customer

SQL

WITH ranked AS ( SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY id DESC) AS rn FROM orders o ) SELECT id, customer_id, amount, status FROM ranked WHERE rn = 1;

Hydra

- window: partition_by: customer_id order_by: [{ col: id, desc: true }] columns: rn: { func: row_number } - filter: { expr: "rn == 1" } - select: { columns: [id, customer_id, amount, status] }

No sub-query, no alias to carry, no nesting: three steps, one per idea. And the result is defined the same way everywhere — in SQL, ORDER BY amount DESC puts empty values first in PostgreSQL and last in MySQL and SQL Server; in Hydra, empty values are always last, and ties always keep the input order.

#### 3. One row per tag

SQL — one version per database:

-- PostgreSQL SELECT p.id, p.name, trim(t.tag) AS tag FROM products p CROSS JOIN LATERAL unnest(string_to_array(p.tags, ';')) AS t(tag); -- SQL Server SELECT p.id, p.name, TRIM(s.value) AS tag FROM products p CROSS APPLY STRING_SPLIT(p.tags, ';') AS s; -- MySQL 8: a recursive CTE or JSON_TABLE, about fifteen lines

Hydra — one version, for every source (CSV, Parquet, MySQL, PostgreSQL, SQL Server, MongoDB…):

- text_to_rows: column: tags sep: ";" index_column: tag_pos

The SQL versions also lose product 3 (no tag) unless you switch to an outer apply / left join; Hydra keeps it by default.

#### 4. Months as columns

SQL — the values must be known when the query is written:

SELECT region, SUM(CASE WHEN month = 'Jan' THEN sales END) AS "Jan", SUM(CASE WHEN month = 'Feb' THEN sales END) AS "Feb" -- one line per month, to update every month FROM sales GROUP BY region;

Hydra — the columns come from the data:

- pivot: index: [region] column: month values: sales aggfunc: sum

#### 5. Apply updates by key

SQL — MERGE in SQL Server and PostgreSQL 15+, INSERT … ON DUPLICATE KEY UPDATE in MySQL, INSERT … ON CONFLICT in PostgreSQL and SQLite, each with its own syntax. And both tables must be in the same database.

Hydra

- merge: right: customer_updates key: customer_id

customer_updates can be a CSV file and the main flow a database table.

#### Side by side

CriterionSQLHydra DSL

Reading orderDifferent from the execution orderTop to bottom = execution order

One idea per…Clause, often nested (sub-queries, CTEs)Step

DialectsOne per database (split, pivot, upsert, null order)One language, every source

Several sourcesSame database onlyAny source with any source (CSV × MySQL × Parquet…)

Text cleaningNested functions (UPPER(TRIM(REGEXP_REPLACE(…))))clean: { case: upper }

Checks before the runAt execution, by the databasehdrctl validate: unknown operation, wrong option, invalid expression

ErrorsDatabase messageStep number, column, list of available columns, fix to apply

Review in GitA changed query is often a rewritten blockA changed step is a changed line

DeterminismTies and empty values depend on the databaseStable order, empty values last, same result in pandas and DuckDB

Visual editing–Each step is a node in Hydra Studio, and back to YAML without loss

When SQL stays the right tool: filtering or joining large tables inside one database before the extraction. Write it in the source’s extract.query and let Hydra do the rest.

[image: Latest order per customer: SQL ROW_NUMBER in a ranked CTE maps to Hydra window, WHERE rn = 1 to filter, and the outer SELECT columns to select.]

### Hydra DSL vs Python

Python with pandas can do everything Hydra does — Hydra itself runs on pandas. The difference is what you have to write, know and maintain around the transformation. The same questions, written both ways.

#### 1. Paid revenue per country

Python (pandas)

import pandas as pd orders = pd.read_csv("data/orders.csv") orders["amount"] = pd.to_numeric(orders["amount"], errors="raise") paid = orders[orders["status"] == "paid"] result = ( paid.groupby("country", as_index=False) .agg(total_amount=("amount", "sum"), nb_orders=("id", "count")) ) result.to_csv("out/sales_by_country.csv", index=False)

Hydra

- filter: { expr: "status == 'paid'" } - cast: { mapping: { amount: float } } - aggregate: by: [country] agg: total_amount: { func: sum, col: amount } nb_orders: { func: count, col: id }

The reading and writing are in sources.yaml and destinations.yaml, which also give batching, upsert, all-or-nothing load and rollback without a line of code.

Read the CSV as text (dtype=str, the usual choice to keep codes such as 007 intact) and forget the to_numeric line, and France gets "120.045.5": pandas concatenates text when asked to sum it, without an error. Forget the cast in Hydra, and the job stops with sum needs a numeric column ('amount' is object). Add a cast step before aggregate.

#### 2. Previous amount, with 0 for the first order

Python (pandas)

orders = orders.sort_values(["customer_id", "id"], kind="stable") orders["prev_amount"] = ( orders.groupby("customer_id")["amount"].shift(1).fillna(0) ) orders = orders.sort_index() # back to the input order

Hydra

- window: partition_by: customer_id order_by: [id] columns: prev_amount: { func: lag, col: amount, default: 0 }

The pandas version has a hidden bug: fillna(0) also replaces a previous amount that was empty in the data. Hydra’s default applies only to the first row of each partition; a real empty value stays empty. And the rows stay in their input order without a re-sort.

#### 3. One row per tag, with its position

Python (pandas)

p = products.assign(tags=products["tags"].str.split(";")).explode("tags") p["tags"] = p["tags"].str.strip() p = p[p["tags"] != ""] p["tag_pos"] = p.groupby(level=0).cumcount() + 1 p = p.reset_index(drop=True)

Hydra

- text_to_rows: column: tags sep: ";" index_column: tag_pos

The pandas version drops a product whose tags are all empty ("gift;;" would be fine, ";;" disappears), and gives a position to products without a tag. Hydra keeps one row per product with no tag, and leaves its position empty.

#### 4. When Python is really needed

Hydra keeps Python for what an expression cannot say, inside a declared contract:

- script: mode: row inputs: [amount, country] outputs: { segment: str } code: | if amount is None: segment = "unknown" elif country == "FR" and amount > 100: segment = "premium_fr" else: segment = "standard"

The code sees only the declared columns, must produce the declared columns with their type, and cannot import, read files or open the network.

#### Side by side

CriterionPython (pandas)Hydra DSL

What you writeCode: imports, variables, method chains, index managementA list of named steps with parameters

Who can read itPython developersData engineers, analysts, reviewers, Studio users

Trapsreset_index, copy vs view, fillna too wide, text summed as textRefused before or during the run, with the fix

Large filesYour own chunking, memory to manageBatches by default; global steps moved to DuckDB above a threshold

EnvironmentPython version, libraries, virtualenvOne hdrctl install, the same YAML everywhere

SecurityThe code can do anything the user canNo code by default; script is sandboxed

Checks before the runNone (or tests you write)hdrctl validate, VS Code schema, Studio check, MCP check

ObservabilityYour own logsStep number in every error, engine chosen and why in the log

Visual editing–Each step is a node in Hydra Studio

When Python stays the right tool: algorithms (scoring, matching, ML), calls to libraries or APIs. Use script for a few lines inside a job, or a python action in a workflow for a full program.

[LAB lab-02-12 · Killercoda] Three ways —

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Workflows — slug: /dsl/03-workflows/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Workflows Download PDF English · White Book

CHAPTER 03 / HYDRA DSL WHITE BOOK

### Workflows

Dependencies, failure handling, rollback, threads and triggers.

### Hydra DSL - Workflows

A workflow runs steps in a given order. A step is a job, an action or, since Hydra 0.19, another project.

# workflows/daily_sales.yaml version: "1.0" workflow: name: daily_sales description: Load the sales, then notify the team trigger: type: schedule cron: "0 6 * * *" steps: - name: load_sales type: job job: ../jobs/sales - name: notify type: action action: webhook params: url: https://hooks.example.com/etl depends_on: [load_sales]

[image: The daily_sales workflow: a 06:00 schedule trigger starts the load_sales job, then the notify webhook action runs after load_sales completes.]

#### Syntax

KeyRequiredDefaultDescription

nameYes–Name of the workflow

descriptionNo–Free text

triggerNomanualWhen the workflow starts

rollbackNofalseUndo the steps already done if the workflow fails

stepsYes–List of steps

#### Rules for workflows

The file has a top-level workflow: key. Only version and workflow are allowed at the top level.

Every key is checked: an unknown or misspelled key is refused, with a suggestion.

Step names must be unique in the workflow.

The order of the steps in the file is not the execution order. The order comes from depends_on.

A workflow lives in workflows/<name>.yaml. Paths in it are relative to that folder.

#### Running a workflow

hdrctl workflow validate daily_sales # check, run nothing hdrctl workflow run daily_sales # run this workflow hdrctl run . # run all the workflows of the project (see Thread)

### Hydra DSL - Trigger

The trigger says when a workflow starts.

typeStartsExtra key

manual (default)When you run it–

scheduleOn a schedulecron (required)

webhookWhen an HTTP call is received–

trigger: type: manual

trigger: type: schedule cron: "30 2 * * 1-5" # 02:30, Monday to Friday

trigger: type: webhook

#### Rules for triggers

cron is a standard 5-field expression: minute, hour, day of month, month, day of week.

type: schedule without cron is refused.

schedule and webhook are used by the Hydra server (hdrctl serve). hdrctl run and hdrctl workflow run always start the workflow immediately.

cronMeaning

"0 * * * *"Every hour, on the hour

"0 6 * * *"Every day at 06:00

"*/15 * * * *"Every 15 minutes

"0 8 1 * *"The 1st of every month at 08:00

### Hydra DSL - Steps

#### Syntax

KeyApplies toDefaultDescription

nameall–Unique name. Required

typeall–job, action or project. Required

jobtype: job–Path to the job folder

actiontype: action–Name of the action

paramstype: action, type: project–Parameters of the action, or passed to the called project

projecttype: project–Called project (see Sub-projects)

depends_onall[]Steps that must finish first

on_failureallfailfail · skip · continue

enabledalltruefalse skips the step

whenall–Run the step only if the condition is true

retryall–Retry policy

undotype: action–How to reverse the action (rollback)

#### Rules for steps

type: job requires job; type: action requires action.

type: project requires project.

action and params are refused on a job step; job is refused on an action step; job, action and undo are refused on a project step; the project keys are refused on job and action steps.

An unknown action, an unknown parameter, or a missing required parameter is refused before the run.

#### A job step

- name: load_customers type: job job: ../jobs/customers

Before running, Hydra checks that the job folder exists and that its source and destination are configured.

#### An action step

- name: wait_for_replica type: action action: delay params: seconds: 30

The available actions are described in the Actions chapter.

#### A project step

- name: crm_sync type: project project: ../crm_sync

Runs another Hydra project. See Sub-projects below.

### Hydra DSL - Order and Parallelism

depends_on lists the steps that must be finished before a step starts. It is always a list, even with one element.

#### Rules for depends_on

Steps with no depends_on start at the beginning, in parallel.

Steps whose dependencies are all finished start together, in parallel.

A name in depends_on that does not exist is refused.

A cycle (a depends on b, b depends on a) is refused.

#### Example 1: a sequence

steps: - name: extract type: job job: ../jobs/extract - name: transform type: job job: ../jobs/transform depends_on: [extract] - name: publish type: job job: ../jobs/publish depends_on: [transform]

extract → transform → publish.

#### Example 2: fan-out and fan-in

steps: - name: load_orders type: job job: ../jobs/orders - name: load_customers type: job job: ../jobs/customers - name: load_products type: job job: ../jobs/products - name: build_report type: job job: ../jobs/report depends_on: [load_orders, load_customers, load_products]

The three loads run in parallel. build_report starts when all three are finished.

[image: Three jobs load orders, customers and products in parallel; build_report starts after all three have finished.]

#### Example 3: the classic mistake

steps: - name: create_table type: action action: bash params: { command: "./scripts/create_table.sh" } - name: load type: job job: ../jobs/load # no depends_on!

Both steps start at the same time. Add depends_on: [create_table] to load.

[LAB lab-03-01 · Killercoda] Draw your workflow — Run a workflow of five steps with different depends_on, read the start and end times in the run report, and redraw the graph.

Open the Killercoda lab

### Hydra DSL - Failure Handling

#### on_failure

ValueThe failed step…Steps depending on itThe workflow

fail (default)stops the workfloware skippedstops, failed

skipis recorded as failedare skippedgoes on with the other branches, ends completed with errors

continueis recorded as failedstill rungoes on, ends completed with errors

- name: notify_slack type: action action: webhook params: url: https://hooks.slack.com/services/XXX depends_on: [load_sales] on_failure: continue # a notification failure must not block the rest

[image: The same four-step graph under fail, skip, and continue: B fails in each case; fail stops C and D, skip lets the independent C run but skips D, and continue runs both C and D.]

#### enabled

- name: heavy_backfill type: job job: ../jobs/backfill enabled: false

The step is skipped and reported as DISABLED. Steps that depend on it still run.

#### retry

KeyDefaultDescription

max0Number of retries after the first failure

delay0Seconds to wait before a retry

backofffixedfixed (same delay) or exponential (delay doubles)

##### Example 1: fixed delay

- name: call_api type: action action: webhook params: url: https://api.example.com/refresh retry: max: 3 delay: 10

Up to 4 attempts, 10 s apart.

##### Example 2: exponential backoff

retry: max: 4 delay: 5 backoff: exponential

AttemptWait before it

1–

25 s

310 s

420 s

540 s

on_failure applies only after the last attempt.

[LAB lab-03-02 · Killercoda] When things go wrong — Make an action fail on purpose, then try on_failure: fail, skip and continue, and add a retry with exponential backoff.

Open the Killercoda lab

### Hydra DSL - Conditional Steps

when runs a step only if a condition is true.

- name: load_prod_only type: job job: ../jobs/sync when: "{{ param:env_name }} == 'prod'"

#### Rules for when

Values come from parameters {{ param:NAME }} and environment variables {{ env:NAME }}.

Allowed: comparisons (== != < <= > >=), in, not in, and, or, not, text, numbers, True, False, lists.

Not allowed: function calls, attributes, any other name. The expression is never executed as code.

Two values that look like numbers are compared as numbers: "10" > "9" is true.

If the condition is false, the step is skipped, and so are the steps that depend on it.

If the condition cannot be read, the step fails.

#### Examples

when: "{{ param:row_count }} > 0"

when: "{{ param:country }} in ['FR', 'BE', 'LU']"

when: "{{ env:HYDRA_ENV }} != 'dev' and {{ param:full_load }} == True"

#### Routing with a condition action

A condition action computes a true/false value and stores it as a parameter. Later steps use it in when:

steps: - name: check_volume type: action action: condition params: name: is_big expr: "{{ param:expected_rows }} > 1000000" - name: load_big type: job job: ../jobs/load_duckdb depends_on: [check_volume] when: "{{ param:is_big }} == True" - name: load_small type: job job: ../jobs/load_pandas depends_on: [check_volume] when: "{{ param:is_big }} == False"

[image: The check_volume condition routes a large input to load_big; load_small is skipped and greyed out.]

### Hydra DSL - Rollback and Undo

With rollback: true, a workflow that fails undoes the steps already done, from the last to the first.

workflow: name: monthly_close rollback: true steps: - name: load_invoices type: job job: ../jobs/invoices - name: load_payments type: job job: ../jobs/payments depends_on: [load_invoices]

If load_payments fails, the load of load_invoices is undone.

[image: Successful invoice and payment loads are pushed onto a stack; after a later step fails, rollback undoes payments first, then invoices.]

#### What can be undone

Jobs are undone automatically:

Destinationreplaceappendupsert

CSV / Parquetprevious file restoredfile cut back to its previous size (CSV) / previous file (Parquet)–

Databaseprevious table restoredrows of this run deleted (load.key required)previous rows restored, new rows deleted

Actions that act outside Hydra (webhook, email, bash, powershell, ssh, python) must say how to undo them, with undo::

- name: open_ticket type: action action: webhook params: url: https://tickets.example.com/api/open undo: action: webhook params: url: https://tickets.example.com/api/cancel - name: send_report type: action action: email params: to: finance@example.com undo: none # nothing to reverse, accepted

log, delay, condition, set_param and assign_param need no undo.

#### Rules for rollback

Everything is checked before the run. The run does not start if:

an action that acts outside Hydra has no undo:;

a job appends into a database without load.key;

a job uses a mode that cannot be undone for its destination.

undo: is allowed on action steps only. Jobs are undone automatically.

A type: project step cannot be undone: rollback: true refuses it.

Before undoing a load, Hydra checks that nobody else wrote to the destination since. If someone did, the undo is refused rather than erasing their work.

If an undo fails, the rest is kept in .hydra/undo/<workflow>.json. Finish it with:

hdrctl workflow undo monthly_close

While that file exists, the workflow refuses to start.

When the workflow succeeds, the backups are deleted.

[LAB lab-03-03 · Killercoda] Rollback in action — Load two tables, make the third step fail, and check that both tables are back to their previous state; then simulate an interrupted rollback and finish it with hdrctl workflow undo.

Open the Killercoda lab

[GITHUB gh-03-01 · example] workflow_rollback — Project with a 3-step workflow in rollback: true (two database jobs with load.key, one webhook with undo:), a docker-compose.yml for PostgreSQL and a script that makes the last step fail.

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Thread

A project usually has several workflows. workflows/thread.yaml says in which order hdrctl run . runs them.

# workflows/thread.yaml version: "1.0" thread: - mode: sequential workflows: - name: load_referentials - mode: parallel delay_after: 5m workflows: - name: load_sales - name: load_stock - mode: sequential workflows: - name: build_reports

[image: The thread runs load_referentials, then load_sales and load_stock in parallel, waits five minutes after both finish, and starts build_reports.]

#### Stages

KeyDefaultDescription

modesequentialsequential: one workflow after another · parallel: at the same time

delay_after–Pause before the next stage

workflows–Workflows of the stage. At least one

#### Workflows in a stage

KeyDefaultDescription

name–Runs workflows/<name>.yaml. Required

activetruefalse skips the workflow

delay_before–Wait before starting it

timeout–Maximum duration. Exceeded = failure

fallback–A replacement workflow (see below)

#### Rules for the thread

Stages run one after another, in the order of the file.

Durations are a number of seconds, or 500ms, 30s, 5m, 1h.

A failed workflow stops the project: the next workflows do not start. In a parallel stage, the workflows already started finish.

delay_before counts from the end of the previous workflow (sequential) or from the start of the stage (parallel).

When timeout is exceeded, the workflow stops at the next batch or step; an atomic load is cancelled; an action already started goes to its end.

Without thread.yaml, all workflows/*.yaml run one after another, in alphabetical order.

#### Loops

Replays a part of the thread several times.

loops: - from: load_stock # last workflow of the part to: load_sales # first workflow of the part times: 3 # total runs, 1 to 1000 delay: 10m # pause before each replay

to must come before from in the thread, or be the same workflow.

A loop starting or ending in a parallel stage takes the whole stage.

Several loops are allowed if they do not overlap.

#### Fallback

A replacement workflow, declared on the workflow it replaces:

- name: load_crm timeout: 30m fallback: use: [load_crm_from_backup] when: "not source_available('crm_db')" on_failure: true on_probe_error: keep

KeyDefaultDescription

use–Replacement workflows, tried in order. Required

when–Condition checked just before the start

on_failurefalsetrue: also replace after a failure or a timeout, if nothing was left published

on_probe_errorkeepIf the condition cannot be checked: keep the workflow, or replace it

Replacements are workflows/<name>.yaml files that are not in the thread.

A replacement has no fallback of its own.

An inactive workflow does not check its fallback.

##### The fallback condition language

Function / valueReturns

source_available('id')The source answers

destination_available('id')The destination answers

file_exists('path')The file exists (path relative to the project)

file_size('path')Size, compared with 10KB, 5MB, 1GB

file_age('path')Time since last change, compared with 30s, 5m, 24h, 7d

url_ok('url')HTTP answer 2xx or 3xx

secret_defined('NAME')The secret is set

db.load('id')Active queries on a database

previous.statussuccess · failed · skipped · inactive · none

previous.rowsRows written by the previous workflow

when: "file_size('Data/in.csv') < 1MB or file_age('Data/in.csv') > 24h"

when: "previous.status == 'failed' and previous.rows < 100"

[LAB lab-03-04 · Killercoda] Orchestrate a project — Build a thread of four workflows with a parallel stage, a loop and a fallback triggered by stopping a database container.

Open the Killercoda lab

[GITHUB gh-03-02 · example] project_thread — Project with five workflows, a thread.yaml using stages, delay_after, timeout, a loop and a fallback, and a README explaining each run.

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Sub-projects

Hydra 0.19.0+. A step of type: project runs another Hydra project: its thread.yaml, or only the workflows listed. The calling project is the master; the called projects are its sub-projects.

# master/workflows/nightly.yaml workflow: name: nightly steps: - name: crm_sync type: project project: ../crm_sync # folder relative to the master's root env: inherit # inherit | none | <environment> params: batch_date: "{{ param:run_date }}" variables: EXPORT_DIR: out/crm workflows: [ingest, report] outputs: [last_batch] timeout: 10m - name: report type: action action: log when: "{{ project:crm_sync.status }} == 'success'" params: message: "{{ project:crm_sync.rows }} rows, batch {{ project:crm_sync.param.last_batch }}" depends_on: [crm_sync]

[image: A master project calls CRM and billing projects, passing the environment name, parameters and variables; status, rows and selected outputs return, while secrets stay in each project.]

#### Syntax

KeyDefaultDescription

project–Called project: folder relative to the master’s root (ref: path) or Studio workspace name (ref: name). Required

refpathpath (portable with git) · name

envinheritEnvironment of the called project: inherit (same name, its own files) · none · a name

params–Parameters given to the called project, with the rank of -P

variables–Environment variables lent for this run only

workflowsthread.yamlWorkflows to run, in this order

outputs–Parameters of the called project read back with {{ project:STEP.param.NAME }}

isolationinprocessinprocess (same process, isolated environment) · subprocess (separate hdrctl)

timeout–Maximum duration: 30s, 5m, 1h or seconds

overlapwaitProject already running: wait · skip · fail

#### What passes, what does not

Environment: only its name. The called project applies its own environments/<env>.yaml, ~/.hydra/env.<env> and .hydra/secrets.<env>.

Parameters: only those listed in params. A required parameter of the called project without a value stops the step before anything runs.

Variables: only those listed in variables. The master’s .env, --env-file, --secrets-file and global variables do not leak.

Secrets: never. ${SECRET:…} in params or variables is refused; each project keeps its own .hydra/secrets.

#### Results

PlaceholderValue

{{ project:STEP.status }}success · failed · skipped

{{ project:STEP.rows }}Rows written by the called project

{{ project:STEP.duration }}Duration in seconds

{{ project:STEP.param.NAME }}A parameter listed in outputs (set_param, assign_param or declared). Missing = step failed

#### Rules for sub-projects

A project cannot call itself, directly or through others (cycle: master → crm_sync → master), and calls are limited to 5 levels. A node of the graph is a project and the workflows it runs: a project may call another of its own workflows.

These checks run in hdrctl run (and --dry-run), hdrctl workflow validate (which prints the tree of called projects), in Hydra Studio when a project is dropped on the canvas, and in the MCP tool hydra_project_calls. A project computed with {{ … }} is checked at run time.

A project runs once at a time (.hydra/run.lock, also between processes). overlap decides what a second call does.

Steps that run in parallel always use isolation: subprocess.

timeout: in the same process, the called project stops at its next checkpoint; in a separate process, the process is stopped.

The called project’s output (workflows, steps) appears in the log of the step, as a tree.

#### Running part of a project

hdrctl run ../crm_sync -w ingest -w report --env prod

-w (repeatable) runs only these workflows, in order.

[LAB lab-03-05 · Killercoda] Master and sub-projects — A master calls two projects in dev and prod, reads back a published parameter, then a cycle is introduced and refused by hdrctl workflow validate.

Open the Killercoda lab

### Hydra DSL - Project triggers

Hydra 0.19.0+. triggers.yaml, at the root of a project, starts the whole project — its thread.yaml, or the workflows listed — when an event happens. A workflow trigger: starts one workflow; a project trigger starts the project.

# triggers.yaml version: "1.0" triggers: - name: nightly type: cron cron: "0 2 * * *" timezone: Europe/Paris env: prod workflows: [ingest, report] retry: {max: 2, delay: 5m} - name: new_orders type: file path: inbox/*.csv events: [added, modified] - name: on_push type: webhook token: ${SECRET:trigger.on_push.token}

[image: Clock, file, database, HTTP and project-completion events feed triggers.yaml, which starts the project in its own process and records the run in history.]

#### Types

typeStarts the project when…Keys

cronthe time matches a cron expressioncron, timezone

intervalevery periodevery

filea file matching path is added (or modified)path, events, debounce, every

markera marker file appears (removed before the run)path, consume, every

source_changea source of a job changessource: {job, id, check, column}, every

webhookan HTTP call brings the trigger’s tokentoken

after_projectanother project endsproject, ref, on

#### Common keys

KeyDefaultDescription

name–Unique name. Required

enabledtruefalse keeps the trigger without running it

envwatch / serveEnvironment of the run; default: --env / HYDRA_ENV of hdrctl watch or serve

workflowsthread.yamlWorkflows to run, in this order

params–Parameters of the run (like -P); no secret

overlapskipProject already running: skip · wait · fail

timeout–Maximum duration: 30s, 5m, 1h

retry–{max: 1–10, delay}: run again after a failure

#### Values given to the run

ParameterSet by

{{ param:trigger.file }}, {{ param:trigger.files }}file, marker: the first file, all files (comma-separated)

{{ param:trigger.value }}, {{ param:trigger.previous }}source_change: the new and the previous measure

{{ param:trigger.project }}, {{ param:trigger.status }}after_project: the project that ended and how

#### Rules for project triggers

Time. cron has five fields (minute hour day month weekday), with *, lists, ranges, steps (*/15) and names (mon-fri, jan); 0 or 7 is Sunday. When both day-of-month and day-of-week are set, either one matches. Runs missed while nothing was watching are not replayed.

Files. path stays inside the project (** for subfolders). The folder is checked every every (default 5s); a file is taken once unchanged for debounce (default 2s). Files already there at start do not trigger. Files arriving together start one run; a file arriving during a run starts the next one.

Data. check: count (rows), max (largest value of column) or checksum, measured every every (default 1m). The first measure is the reference. On PostgreSQL, MySQL/MariaDB and SQL Server, count and max are a single SQL query.

Webhook. token is a ${SECRET:…} reference only. hdrctl trigger token <name> creates the value (shown once). The caller sends POST /api/projects/<id>/triggers/<name>/webhook with X-Hydra-Token: <token>; a wrong token gets 401. Nothing from the request reaches the project.

End of another project. Every project run notes its end in .hydra/triggers/ends.jsonl, whatever started it. on: success (default), failure or any. A loop (a → b → a) is refused.

Safety. The project always runs in its own process, under .hydra/run.lock; a trigger still running is not started again. Every run is recorded in .hydra/triggers/history.jsonl.

#### Commands

hdrctl trigger validate # checks keys, cron, workflows, sources, secrets, loops hdrctl trigger list # triggers and their last run hdrctl trigger fire nightly # run one now (any type) hdrctl trigger token on_push # create the webhook token hdrctl trigger history nightly hdrctl watch [PROJECT]... --env prod # run the triggers until Ctrl+C

hdrctl serve runs the same engine for every project of the Studio list.

A cron trigger, a file dropped in inbox/, a webhook called with curl, and a second project started at the end of the first, all followed in hdrctl watch.

[LAB lab-03-06 · Killercoda] A project that runs itself —

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Actions — slug: /dsl/04-actions/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Actions Download PDF English · White Book

CHAPTER 04 / HYDRA DSL WHITE BOOK

### Actions

Flow control, notifications, scripts, parameters and undo actions.

### Hydra DSL - Actions

An action is a workflow step that does something other than moving data: write a message, wait, call a URL, send an email, run a script, set a parameter, evaluate a condition.

- name: notify type: action action: log params: message: "Sales loaded." depends_on: [load_sales]

[image: A workflow mixing cylindrical data jobs with rounded action steps for log, delay, webhook, email, bash, Python, set_param and condition.]

#### The 11 actions

FamilyActionPurpose

FlowlogWrite a message in the run log

delayWait a number of seconds

conditionCompute true/false and store it as a parameter

NotificationwebhookCall a URL

emailSend an email

ScriptsbashRun a Bash command (Linux, macOS)

powershellRun a PowerShell command (Windows)

sshRun a command on a remote server

pythonRun a Python script

Parametersset_paramCreate a parameter during the run

assign_paramChange a parameter created during the run

#### Rules for actions

action must be one of the 11 names above. A typo is refused, with a suggestion.

params accepts only the parameters of that action. An unknown parameter is refused.

A required parameter that is missing or empty is refused.

All of this is checked before the run starts.

In params, you can use {{ param:NAME }}, {{ env:NAME }}, ${SECRET:NAME} and ${ENV:NAME}. They are replaced just before the action runs.

A {{ param:NAME }} that does not exist makes the action fail.

An action fails if its command returns a non-zero exit code, or its HTTP call returns an error.

### Hydra DSL - Flow Actions

#### log

ParameterRequiredDefault

messageNoStep '<name>' executed

- name: start type: action action: log params: message: "Starting the load for {{ param:country }}"

The message is shown under the step in hdrctl run and kept in the run result (Hydra 0.19.1+).

#### delay

ParameterRequiredDefaultDescription

secondsNo1Seconds to wait (a number)

durationNo–Same as seconds

- name: wait_replica type: action action: delay params: seconds: 120

#### condition

Evaluates a condition and stores the result (True or False) in a parameter. Other steps read it in when:.

ParameterDefaultDescription

namethe step nameName of the parameter that receives the result

modeexprexpr (an expression) or structured (left / op / right)

expr–The expression, in expr mode

left, op, right–The comparison, in structured mode

##### Example 1: expression mode

- name: check_env type: action action: condition params: name: is_prod expr: "{{ env:HYDRA_ENV }} == 'prod'"

The expression follows the rules of when (see Workflows).

##### Example 2: structured mode

- name: check_threshold type: action action: condition params: name: above_threshold mode: structured left: "{{ param:row_count }}" op: ">=" right: 1000

op: == · != · < · <= · > · >= · contains.

- name: check_recipients type: action action: condition params: name: finance_in_list mode: structured left: "{{ param:recipients }}" op: contains right: finance@example.com

##### Example 3: using the result

- name: publish type: job job: ../jobs/publish depends_on: [check_env] when: "{{ param:is_prod }} == True"

### Hydra DSL - Notification Actions

#### webhook

ParameterRequiredDefaultDescription

urlYes–Address to call

methodNoPOSTHTTP method

bodyNo–Body, as a mapping (sent as JSON) or as text

headersNo–Extra headers

The request is sent with Content-Type: application/json. It fails after 30 seconds without an answer, or if the server answers with an error status.

##### Example 1: simple notification

- name: ping type: action action: webhook params: url: https://hooks.example.com/hydra

##### Example 2: JSON body and authentication

- name: notify_api type: action action: webhook params: url: https://api.example.com/v1/events method: POST headers: Authorization: "Bearer ${SECRET:API_TOKEN}" body: event: load_finished workflow: daily_sales country: "{{ param:country }}"

##### Example 3: a chat notification that must never block

- name: notify_chat type: action action: webhook params: url: ${SECRET:CHAT_WEBHOOK_URL} body: text: "Daily sales loaded." depends_on: [load_sales] on_failure: continue retry: max: 2 delay: 10

#### email

ParameterRequiredDefaultDescription

toYes–Recipient

subjectNo–Subject

bodyNoemptyPlain-text body

from_addrNohydra@localhostSender

smtp_hostNolocalhostSMTP server

smtp_portNo1025SMTP port

username, passwordNo–SMTP login

use_tlsNofalseUse STARTTLS

The defaults point to a local test mail server. In production, set smtp_host, smtp_port, use_tls and the login.

- name: mail_finance type: action action: email params: to: finance@example.com subject: "Monthly close done" body: | The monthly close finished successfully. Environment: {{ env:HYDRA_ENV }} from_addr: etl@example.com smtp_host: smtp.example.com smtp_port: 587 use_tls: true username: etl@example.com password: ${SECRET:SMTP_PASSWORD}

[LAB lab-04-02 · Killercoda] Notify the team — Send a webhook to a local request inspector and an email to a test mail server at the end of a workflow, and read both.

### Hydra DSL - Script Actions

#### bash and powershell

ParameterRequiredDefaultDescription

commandYes–The command

working_dirNocurrent folderFolder in which it runs

timeoutNo60Seconds before it is stopped

bash runs on Linux and macOS only; powershell on Windows only. Using the other one fails with a clear message.

The output of the command is copied into the run log.

Parameters are available as environment variables: $NAME in Bash, $env:NAME in PowerShell. Booleans become true / false.

##### Example 1: Bash

- name: archive_input type: action action: bash params: command: "mv Data/in.csv Data/archive/in_$(date +%F).csv" working_dir: ..

##### Example 2: reading a parameter from the environment

- name: purge_old_files type: action action: bash params: command: 'find outputs/ -mtime +"$RETENTION_DAYS" -delete' timeout: 120

RETENTION_DAYS comes from parameters.yaml or from a set_param earlier in the run.

##### Example 3: PowerShell

- name: copy_to_share type: action action: powershell params: command: 'Copy-Item outputs\report.csv "\\fileserver\reports\report_$env:country.csv"'

#### ssh

ParameterRequiredDefaultDescription

hostYes–Remote server

usernameYes–Login

commandYes–Command to run

portNo22SSH port

key_pathNo–Private key file (used first)

passwordNo–Password, if no key

timeoutNo30Seconds

Requires pip install paramiko.

- name: refresh_cache type: action action: ssh params: host: app01.internal username: deploy key_path: ~/.ssh/hydra_deploy command: "sudo systemctl restart report-cache"

#### python

ParameterRequiredDefaultDescription

scriptone of the two–Python code, inline

file_pathone of the two–A .py file

working_dirNocurrent folderFolder in which it runs

timeoutNo60Seconds

The script runs with the same Python as Hydra, on any system.

A relative file_path is looked for next to the workflow, then from the project root.

Parameters are available in os.environ, and {{ param:NAME }} is replaced in the code before it runs.

##### Example 1: inline

- name: check_file type: action action: python params: script: | import os, sys size = os.path.getsize("Data/in.csv") print(f"in.csv: {size} bytes") sys.exit(0 if size > 0 else 1)

A non-zero exit code makes the step fail.

##### Example 2: a script file

- name: build_kpis type: action action: python params: file_path: scripts/build_kpis.py timeout: 600

##### Example 3: reading a parameter

- name: show_country type: action action: python params: script: | import os print("Country:", os.environ["country"]) print("Threshold:", {{ param:min_amount }})

The python action runs a full Python script, with imports and file access. The script transformation (see Jobs) runs restricted Python on columns. They are not the same thing.

[LAB lab-04-03 · Killercoda] Scripts around your jobs — Archive the input file with bash, compute a check with python, and run a remote command with ssh on a second machine of the lab.

Open the Killercoda lab

[GITHUB gh-04-01 · example] workflow_actions — Project with one workflow using every action at least once, the scripts/ it calls, a docker-compose.yml with a test mail server and a request inspector, and a README.

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Parameter Actions

Parameters created during a run live only for that run. They are shared by all its steps.

set_paramassign_param

Creates a parameter✔–

Changes an existing one–✔

Fails if the parameter…already existsdoes not exist

ParameterRequiredDefaultDescription

nameYes–Parameter name

valueYes–Value

typeNoanyint · float · str / string · bool / boolean · json · any

##### Example 1: create, then use

steps: - name: init_batch type: action action: set_param params: name: batch_label value: "nightly" type: str - name: announce type: action action: log params: message: "Batch {{ param:batch_label }} started" depends_on: [init_batch]

##### Example 2: change a value later

- name: mark_partial type: action action: assign_param params: name: batch_label value: "nightly-partial" depends_on: [load_optional]

##### Example 3: typed values

- name: set_limits type: action action: set_param params: name: max_rows value: "500000" type: int # stored as the number 500000

- name: set_flag type: action action: set_param params: name: full_load value: "true" type: bool # stored as True

A value that does not match type makes the step fail.

[image: Timeline showing set_param creating batch_label as nightly, log reading nightly, assign_param changing it to nightly-partial, and bash reading the updated value.]

### Hydra DSL - Actions and Rollback

With rollback: true on the workflow (see Workflows), actions that act outside Hydra must declare how to undo them.

ActionNeeds undo: with rollback: true

webhook, email, bash, powershell, ssh, pythonYes: an action, or none

log, delay, condition, set_param, assign_paramNo

- name: create_partition type: action action: bash params: command: "./scripts/create_partition.sh {{ param:month }}" undo: action: bash params: command: "./scripts/drop_partition.sh {{ param:month }}"

undo.action and undo.params follow the same rules as any action.

undo: none says “nothing to reverse” explicitly.

The undo actions run from the last step done to the first.

[LAB lab-04-04 · Killercoda] Reversible actions —

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Parameters and secrets — slug: /dsl/05-parameters-secrets/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

H Hydra DSLWhite Book · version 1.0
CONTENTS

Six complete articles, diagrams, runnable labs and downloadable examples.

Hydra DSL / Parameters and secrets Download PDF English · White Book

CHAPTER 05 / HYDRA DSL WHITE BOOK

### Parameters and secrets

Environments, overrides, secret lookup and safe configuration.

### Hydra DSL - Parameters and Secrets

The same job often runs with different values: another date, another country, a test database instead of production. Hydra gives you four kinds of values that you write once and fill at run time:

KindWritten asComes fromFor

Parameter{{ param:NAME }}parameters.yaml, environments/<env>.yaml, --param, set_paramBusiness values: dates, thresholds, table names

Environment variable{{ env:NAME }}~/.hydra/env, ~/.hydra/env.<env>, .env files, the systemMachine settings

Environment variable (required)${ENV:NAME}SameMachine settings that must exist

Secret${SECRET:NAME}Environment, .hydra/secrets.<env>, .hydra/secrets, SOPSPasswords, tokens, keys

An environment (dev, prod…) selects one set of each: parameter values, global variables and secrets. Each kind is managed from the command line (hdrctl param, hdrctl env, hdrctl secret) or from Hydra Studio.

[image: Hydra resolves the table parameter from parameters.yaml and environments/prod.yaml, the database host from the system environment, and the masked password from .hydra/secrets to produce a resolved sources.yaml.]

### Hydra DSL - Parameters

#### Declaring parameters

Parameters are declared in parameters.yaml, at the root of the project:

# parameters.yaml version: "1.0" parameters: min_amount: type: float default: 50 description: Orders below this amount are dropped. country: type: str required: true batch_size: type: int default: 10000

KeyDefaultDescription

typeanyint · float · str / string · bool / boolean · json · any

default–Value used when nothing else gives one

requiredfalsetrue: the run stops if no value is given

description–Free text

Short form: country: FR (a value instead of a mapping) declares a parameter of type any with that default.

From the command line, hdrctl param set writes the same file:

hdrctl param set min_amount 50 --type float --description "Orders below this amount are dropped." hdrctl param set country --type string --required hdrctl param list

#### Using parameters

# transformations.yaml version: "1.0" transformations: steps: - filter: expr: "amount >= {{ param:min_amount }} and country == '{{ param:country }}'"

# sources.yaml sources: orders: type: postgresql connection: { ... } extract: table: "orders_{{ param:country }}" batch_size: "{{ param:batch_size }}"

#### Rules for parameters

{{ param:NAME }} works in every job file and in the params and when of workflow steps.

Spaces inside the braces are allowed: {{param:x}} and {{ param:x }} are the same.

A placeholder alone in a value keeps the type: batch_size: "{{ param:batch_size }}" gives the number 10000.

A placeholder inside a text is replaced as text: "orders_{{ param:country }}" gives "orders_FR".

A {{ param:NAME }} naming an unknown parameter stops the run before anything is read or written. Use required: true to also stop when a declared parameter has no value.

A value that does not match type stops the run.

A value given for a parameter that is not declared is accepted, as any.

##### Booleans

For type: bool, these values are accepted:

TrueFalse

true 1 yes onfalse 0 no off

##### JSON

parameters: regions: type: json default: '["north", "south"]'

The value is read as a list or a mapping.

### Hydra DSL - Environments

An environment is a set of values for the parameters: dev, test, prod… Each one is a file in environments/.

# environments/dev.yaml parameters: country: FR min_amount: 0

# environments/prod.yaml parameters: country: FR min_amount: 50 batch_size: 50000

Select the environment when you run:

hdrctl run . --env dev hdrctl run . --env prod

Or with the variable HYDRA_ENV:

HYDRA_ENV=prod hdrctl run .

hdrctl workflow run <name> --env prod works the same way. In Hydra Studio, the Environment selector on the project page and in the editor header applies to every run started from Studio; Project settings › Parameters shows one column per environment.

The values of one environment can also be written from the command line:

hdrctl param set min_amount 0 --env dev # writes environments/dev.yaml hdrctl param unset min_amount --env dev # back to the default

An environment groups more than parameter values: its global variables (~/.hydra/env.<env>, next page) and its secrets (.hydra/secrets.<env>). hdrctl env create | rename | delete <name> handles all of them at once; rename and delete first copy the files to ~/.hydra/_backups/.

#### Overriding one value

--param (or -P) gives a value for one run. It can be repeated:

hdrctl run . --env prod --param min_amount=100 --param country=BE

#### Which value wins?

From the strongest to the weakest:

#Source

1Values set during the run: --param, and set_param / assign_param in a workflow

2environments/<env>.yaml of the selected environment

3default in parameters.yaml

[image: Three precedence layers for min_amount: the default of 50, the dev environment value of 0, and the run override of 100. The run value is used.]

#### Rules for environments

Without --env and without HYDRA_ENV, only the defaults and the run values are used.

parameters.yaml and environments/ can also be placed in a job folder or in workflows/. The file closest to the job wins.

A job run by a workflow receives the parameters created by set_param earlier in that workflow.

#### Example: one workflow, two environments

# workflows/daily.yaml version: "1.0" workflow: name: daily steps: - name: load type: job job: ../jobs/orders - name: publish type: job job: ../jobs/publish depends_on: [load] when: "{{ param:publish_enabled }} == True"

# environments/dev.yaml parameters: publish_enabled: false

# environments/prod.yaml parameters: publish_enabled: true

In dev, the publish step is skipped; in prod, it runs.

[LAB lab-05-01 · Killercoda] One project, three environments —

[GITHUB gh-05-01 · example] project_environments — Project with parameters.yaml, environments/dev.yaml and environments/prod.yaml, two jobs and one workflow using {{ param: }} in sources, transformations and when.

[GITHUB gh-05-01 · example] project_environments —

Browse the code on GitHub · Download the ZIP

### Hydra DSL - Environment Variables

#### Two notations

NotationIf the variable is missing

${ENV:NAME}The run stops: Missing environment variable: NAME

{{ env:NAME }}Not checked: no error, no value

Use ${ENV:NAME} for anything the job cannot work without.

sources: crm: type: mysql connection: host: ${ENV:CRM_HOST} port: ${ENV:CRM_PORT} user: etl password: ${SECRET:crm.password} database: crm

- name: log_host type: action action: log params: message: "Running on {{ env:HOSTNAME }}"

#### Global variables

Variables shared by every project of the machine live in your home folder:

FileApplies to

~/.hydra/envEvery environment

~/.hydra/env.<env>The selected environment only

hdrctl env set CRM_HOST crm.internal # ~/.hydra/env hdrctl env set CRM_DATABASE crm_prod --env prod # ~/.hydra/env.prod hdrctl env show prod

In Hydra Studio: Global settings › Environments. HYDRA_HOME moves the folder (default ~/.hydra). When a run switches environment (Studio, API), the variables of the previous environment are removed first.

#### .env files

Hydra also loads .env files before a job runs. All the layers, from the strongest to the weakest:

#Source

1--env-file <file> (or HYDRA_ENV_FILE), for one run

2.env in the job folder

3.env at the project root (the folder with .hydra/)

4~/.hydra/env.<env>

5~/.hydra/env

6Variables already set in the system

# jobs/crm/.env CRM_HOST=localhost CRM_PORT=3306

One NAME=value per line. Never put secrets in a .env file that is committed. A missing --env-file stops the run.

### Hydra DSL - Secrets

#### Using a secret

password: ${SECRET:db.password}

A secret can be used anywhere a value is written: in connection, in headers of a webhook, in the password of an email or SSH action…

#### Where Hydra looks for a secret

For ${SECRET:db.password}, in this order:

#Looks forExample

1An environment variable with the normalised name: . and - become _, upper caseDB_PASSWORD

2An environment variable with the exact namedb.password

3The secrets file of the selected environment.hydra/secrets.prod

4The project secrets file.hydra/secrets

5The provider of .hydra/secrets.yaml (SOPS)provider: sops

The environment always wins over the files. Locally you use the file; in production (CI, vault, container), you set the variable and change nothing in the YAML.

[image: Secret lookup order for db.password: normalized and exact environment variables, environment and project secret files, then the configured provider. Each found value ends the search; otherwise Hydra reports a missing secret.]

#### The secrets file

hdrctl init creates .hydra/secrets and adds it to .gitignore.

# .hydra/secrets # One per line: name=value. Lines starting with # are ignored. db.password=change-me api.token="abc 123" export smtp.password=s3cret

Secrets of one environment go in .hydra/secrets.<env>, same format, also ignored by git. With --env prod, a name found in .hydra/secrets.prod wins over .hydra/secrets; the other names still come from .hydra/secrets.

hdrctl secret set db.password # typed hidden, twice hdrctl secret set db.password --env prod # .hydra/secrets.prod echo "$PW" | hdrctl secret set api.token --stdin hdrctl secret list --env prod # names only

In Hydra Studio: Project settings › Secrets, common or per environment. No tool ever shows a value back: not the command line, Studio, the API or the MCP server.

#### Rules for secrets

One name=value per line. Names use letters, digits, ., _, -.

Quotes around the value are removed. A leading export is accepted.

A missing secret stops the run, naming the variable and the file it looked for. The message never shows a value.

To keep the file outside the project: HYDRA_SECRETS_FILE=/path/to/secrets, or hdrctl run . --secrets-file /path/to/secrets.

Never write a password, token or key in clear in a YAML file.

#### Secrets in logs

Every secret value Hydra reads is masked in what it displays or keeps: logs, error messages, the output of bash, powershell, python and ssh actions, webhook and email log lines, undo reports and the runs stored by the API. The value sent to the connector or the script is never changed.

visibilityWhat is displayed

plainThe value, in clear (debugging only)

masked[MASKED] in place of the value — default

hiddenThe line is left out and counted

Set it in .hydra/secrets.yaml (visibility: hidden), with HYDRA_SECRETS_VISIBILITY, or for one run with --secrets-visibility.

Limits: a value shorter than 4 characters is not masked (a warning names it); a secret that a script reads directly from the environment, or a transformed value (base64, split), is not masked.

#### Encrypted secrets (SOPS)

.hydra/secrets.yaml holds settings, never a value, and can be committed:

# .hydra/secrets.yaml visibility: masked provider: sops sops: file: .hydra/secrets.{env}.sops.yaml # {env} = the selected environment age_key_file: ~/.config/sops/age/keys.txt

The encrypted file is decrypted in memory only. sops and age must be installed.

#### Example: the same job, local and production

# jobs/sync/destinations.yaml destinations: dwh: type: postgresql connection: host: ${ENV:DWH_HOST} port: 5432 user: etl password: ${SECRET:dwh.password} database: dwh load: table: "sales_{{ param:country }}" mode: replace

Locally:

# jobs/sync/.env DWH_HOST=localhost

# .hydra/secrets dwh.password=local-dev-password

hdrctl run . --env dev

In production, either keep a .hydra/secrets.prod on the server, or let the platform set the variables — nothing changes in the files:

export DWH_HOST=dwh.prod.internal export DWH_PASSWORD=******** hdrctl run . --env prod

[LAB lab-05-02 · Killercoda] Secrets without leaks —

### Hydra DSL - Values in Scripts

Parameters reach the scripts of a workflow in two ways.

WhereHow

bash, powershell, ssh, python actionsAs environment variables with the parameter name: $country, $env:country, os.environ["country"]

script transformationIn the read-only mapping params: params["min_amount"]

Any action paramsAs {{ param:NAME }}, replaced before the action runs

Only names made of letters, digits and _ are passed as environment variables.

Booleans are passed as true / false.

- name: export_country type: action action: bash params: command: 'echo "Exporting $country with threshold $min_amount"'

### Hydra DSL - Placeholder Summary

PlaceholderResolved inMissing valueType kept

{{ param:NAME }}Job files, step params, when, action scriptsError if unknownYes, when alone

{{ env:NAME }}Job files, step params, whenNo error, no value–

${ENV:NAME}Job files, step paramsError– (text)

${SECRET:NAME}Job files, step paramsError– (text)

Where each value lives, and how to manage it:

KindFilesCommand lineHydra Studio

Parametersparameters.yaml, environments/<env>.yamlhdrctl paramProject settings › Parameters

Environment variables~/.hydra/env, ~/.hydra/env.<env>, .envhdrctl envGlobal settings › Environments

Secrets.hydra/secrets, .hydra/secrets.<env>, SOPShdrctl secretProject settings › Secrets

Order of resolution in a job file: ${ENV:…} and ${SECRET:…} first, then {{ param:… }} and {{ env:… }}.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## destinations.yaml decides how rows land — slug: /dsl/destinations-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › destinations.yaml▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›destinations.yaml

Grammar element · destinations.yaml

### destinations.yaml decides how rows land

Three correct declarations. Walk them, then see where the writing policy lives.

destinations.yaml4 steps

‹ Back Next ›

the catalogue contains one CSV target — replace its contents one CSV target — append this run two targets — only one is selected

1

What the engine prepares
The selected declaration supplies both the connector and its writing policy.

✓ 30 rows read · 6 written ↺ Reset

#### What destinations.yaml is

destinations.yaml declares the systems a job is allowed to write to. Its root destinations mapping gives each target a local identifier; pipeline.to selects one.

It does not choose the data or transform it. Sources read, transformations reshape, and a destination receives the final rows with the writing policy declared here.

#### What it contains

Identity — the identifier referenced by pipeline.to.

Reachability — type selects a connector and connection supplies its settings.

Writing policy — load names the table or file, the mode, optional upsert keys, and batch size.

#### The write policy belongs with the target

The same six rows can replace a reporting file, append to a history, or update matching database records. That choice belongs beside the target because it describes how that system accepts rows, not how the rows were produced.

The destination owns the last decision: how the target is written.

#### Run the complete declaration

This is the destination used by the tutorial job:

version: "1.0"
destinations:
dest_big_orders:
type: csv
connection:
base_path: "examples/tutorial/01-first-job/out"
load:
table: big_orders.csv
mode: replace

hdrctl run examples/tutorial/01-first-job -d examples/tutorial/01-first-job/destinations.yaml

✅ Pipeline completed successfully in 7.8s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-d, --destinations FILE explicit path to destinations.yaml
--dry-run validate configuration without writing data
-v, -vv, -vvv more detail, up to full logs

##### Close by

pipeline.yaml — selecting this destination

sources.yaml — where rows enter

transformations.yaml — shaping rows before the write

Lesson 1 — the complete job

Reference — every destination key

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## connection reaches the target system — slug: /dsl/destinations/connection/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsDestinations › connection▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›3 · Destinations›connection

Grammar element · destinations.<id>.connection

### connection reaches the target system

Three valid CSV connections. Location stays separate from the file and write mode.

destinations.yaml4 steps

‹ Back Next ›

the target directory is an explicit directory the job directory an archive directory

3

What connection resolves
The system or directory the selected writer can reach before loading begins.

✓ output directory resolved ↺ Reset

#### What destinations.<id>.connection is

Destination connection is the mapping used to reach the system that will receive rows.

It does not name the table or decide append, replace, or upsert. Those are loading concerns and remain in load.

#### What it contains

Connector-specific settings — CSV uses a base path; databases use network and database settings.

References, not embedded policy — Secrets belong in placeholders and load behavior belongs elsewhere.

A reusable boundary — One reachable system can host several target objects.

#### Reach the system before naming the object

Connection answers “where can this writer connect?” Load answers “what should it write there, and how?” Keeping those questions apart makes declarations portable.

Reachability is shared context, not a writing policy.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
destinations:
dest_output:
type: csv
connection:
base_path: "examples/tutorial/dsl-elements/out"
load:
table: result.csv
mode: replace
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

type — choosing the writer

load — target and policy

destinations.yaml — complete declaration

source connection — the read side

Reference — connector settings

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## load binds a target to a write policy — slug: /dsl/destinations/load/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsDestinations › load▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›3 · Destinations›load

Grammar element · destinations.<id>.load

### load binds a target to a write policy

Three executable CSV policies. The same writer can replace, append, or change batch size.

destinations.yaml4 steps

‹ Back Next ›

the write policy is replace the target append this run replace in smaller batches

3

What the writer receives
A target object, a mode, optional key columns, and a batch size.

✓ replace policy ready ↺ Reset

#### What destinations.<id>.load is

load is the concrete write request passed to a destination connector.

It does not establish the connection or choose which destination the pipeline uses. It starts after pipeline.to and connector construction have resolved.

#### What it contains

A target — table, or the collection alias for MongoDB.

A mode — append, replace, or upsert.

Delivery controls — Optional upsert keys and a batch size from 10 to 100,000.

#### The mode describes this run

Connection tells Hydra where a writer can reach. load says what this particular run must do there, making append, replace, and upsert explicit at the edge.

Target and policy travel together in one block.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
destinations:
dest_output:
type: csv
connection:
base_path: "examples/tutorial/dsl-elements/out"
load:
table: result.csv
mode: replace
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

type — writer selection

connection — target system

destinations.yaml — destination catalogue

pipeline.yaml — selecting one destination

Reference — load fields

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## type chooses the writer — slug: /dsl/destinations/type/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsDestinations › type▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›3 · Destinations›type

Grammar element · destinations.<id>.type

### type chooses the writer

Three correct CSV declarations. The discriminator selects who interprets connection and load.

destinations.yaml4 steps

‹ Back Next ›

the destination declaration is a CSV writer normalized spelling another CSV target

3

What type selects
The connector responsible for opening the target and loading final rows.

✓ CSV writer selected ↺ Reset

#### What destinations.<id>.type is

Destination type tells Hydra which connector must write the final rows.

It does not select the destination identifier or loading mode. Those remain separate so one connector family can serve many targets and policies.

#### What it contains

One normalized name — The value is stripped and lower-cased.

A registered writer — The registry builds the matching destination connector.

A contract boundary — That connector owns the meaning of connection and load.

#### Reading and writing share a vocabulary

Sources and destinations use the same type slot, but the selected connector is built for a direction. Here it must accept final rows and apply the declared load policy.

The discriminator chooses the writer; load chooses its target.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
destinations:
dest_output:
type: csv
connection:
base_path: "examples/tutorial/dsl-elements/out"
load:
table: result.csv
mode: replace
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

destinations.yaml — the catalogue

connection — reaching the target

load — writing policy

pipeline.yaml — selecting the writer

Reference — every destination key

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## calculate.expr produces one named column — slug: /dsl/expressions/calculate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsExpressions › calculate.expr▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›7 · Expressions›calculate.expr

Grammar element · calculate.expr

### calculate.expr produces one named column

Three valid pandas-eval expressions. The output name and the formula stay separate.

transformations.yaml4 steps

‹ Back Next ›

the formula computes tax-inclusive amount line total replace amount

7

What the expression produces
One new or replaced column, with one value for every current row.

✓ 30 values calculated ↺ Reset

#### What calculate.expr is

calculate.expr is the formula used to produce one named output column from the current frame.

It does not filter rows and it cannot declare several outputs at once. Use separate calculate steps or a script with an explicit output mapping.

#### What it contains

Current column references — Names available when the step begins.

Arithmetic expression — Evaluated by pandas eval with the Python engine.

One destination column — Declared separately by calculate.column.

#### Name the output outside the formula

Separating column from expr makes assignment explicit. A reader can identify what changes without parsing the expression text.

The formula computes; column names the destination.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- calculate:
column: amount_with_tax
expr: "amount * 1.2"

hdrctl run examples/tutorial/dsl-elements -t compute.yaml

✅ Pipeline completed successfully in 2.9s
Rows read : 30
Rows written: 30

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

Compute — calculate and script

filter.expr — boolean predicates

script.code — multiple outputs

Columns — prepare types

Reference — calculate keys

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## filter.expr decides which rows continue — slug: /dsl/expressions/filter/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsExpressions › filter.expr▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›7 · Expressions›filter.expr

Grammar element · filter.expr

### filter.expr decides which rows continue

Three valid pandas-query expressions. Each returns a boolean decision for every current row.

transformations.yaml4 steps

‹ Back Next ›

the predicate keeps amounts above 50 paid orders paid orders above 50

7

What the expression returns
A true or false decision per row, evaluated against columns in the current frame.

✓ 6 rows match ↺ Reset

#### What filter.expr is

filter.expr is a boolean expression evaluated once across the current table to decide which rows continue.

It is not validated against runtime column types by hdrctl validate. Earlier steps must prepare both names and types before the filter runs.

#### What it contains

Current column names — Resolved by pandas query at this step.

Literals and comparisons — Numbers, quoted strings, and comparison operators.

Boolean composition — Conditions combined with and, or, and parentheses.

#### The expression sees the current frame

A filter never reaches back to source columns. Rename or cast first, and the expression sees only those resulting names and values.

A filter changes membership, not the column contract.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping:
amount: float
- filter:
expr: "amount > 50"

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

Rows — filter and related operations

Columns — prepare names and types

calculate.expr — producing values

steps — expression order

Reference — filter contract

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## script.code runs inside a declared boundary — slug: /dsl/expressions/script/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsExpressions › script.code▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›7 · Expressions›script.code

Grammar element · script.code

### script.code runs inside a declared boundary

Row and vectorized scripts stay explicit about inputs, outputs, types, and mode.

transformations.yaml4 steps

‹ Back Next ›

the script mode is row mode vectorized mode two outputs

7

What the engine exposes
Only declared inputs, approved builtins, and assignments to declared outputs.

✓ row script · 30 rows ↺ Reset

#### What script.code is

script.code is restricted Python executed inside an explicit input/output contract.

It is not an escape to the host Python process. Imports are unavailable, builtins are allow-listed, and outputs must be declared before code runs.

#### What it contains

Assignments and expressions — Code that derives declared output variables.

Approved builtins — Common numeric, collection, iteration, formatting, and type helpers.

No ambient access — Inputs are declared columns; outputs are declared names and types.

#### The contract is larger than the code

Read inputs, outputs, and mode before reading the code block. They define what the script may consume, must produce, and how values appear during execution.

Custom logic remains reviewable because its boundary is YAML.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- script:
inputs: [amount]
outputs: {amount_with_tax: float}
mode: row
code: |
amount_with_tax = amount * 1.2

hdrctl run examples/tutorial/dsl-elements -t script.yaml

✅ Pipeline completed successfully in 2.4s
Rows read : 30
Rows written: 30

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

Compute — calculate and script

calculate.expr — one output

steps — execution order

Columns — input types

Reference — script contract

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## step.when gates one workflow node — slug: /dsl/expressions/when/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsExpressions › step.when▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›7 · Expressions›step.when

Grammar element · workflow.steps.when

### step.when gates one workflow node

Three safe boolean guards. A true guard runs the node; a false guard skips it and its dependants.

workflow.yaml4 steps

‹ Back Next ›

the guard checks a numeric comparison membership an environment placeholder

7

What the runner decides
Whether one ready node may execute after its dependencies have completed.

✓ guard true · step runs ↺ Reset

#### What workflow.steps.when is

step.when is a safe boolean guard evaluated after dependencies are complete and before one workflow node runs.

It is not Python eval. Hydra parses an allow-listed AST of comparisons, boolean operators, literals, lists, tuples, and parameter/environment placeholders.

#### What it contains

Comparisons — Equality and ordered comparisons, with numeric coercion when appropriate.

Boolean logic — and, or, and not.

Safe values — Literals plus {{ param:NAME }} and {{ env:NAME }} placeholders.

#### Ready does not always mean run

Dependencies decide when a node is ready. when makes the final admission decision for that node without changing the topology of the graph.

Dependency readiness and conditional admission are separate decisions.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

workflow:
version: "1.0"
name: docs_workflow
description: Two actions used by the DSL documentation.
trigger: {type: manual}
steps:
- name: prepare
type: action
action: log
params: {message: "Preparation complete."}
retry: {max: 2, delay: 0, backoff: fixed}
- name: publish
type: action
action: log
params: {message: "Publication complete."}
depends_on: [prepare]
when: "1 == 1"
on_failure: fail

hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml

✓ Step 'prepare' OK (0.0s)
✓ Step 'publish' OK (0.0s)

✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK

The relevant command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

workflow steps — graph nodes

retry — attempts after admission

parameters and environment

workflow.yaml — full context

Reference — when field

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Four placeholders, resolved before the manifest is read — slug: /dsl/interpolation/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsInterpolation › ${ENV} and ${SECRET}▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›8 · Interpolation›${ENV} and ${SECRET}

Grammar element · interpolation

### Four placeholders, resolved before the manifest is read

Hydra substitutes two syntaxes: ${'{'}...{'}'} for environment and secrets, {{ ... }} for job parameters.

sources.yamltype a value for password

password: environment devprod

8

Before and after
Substitution happens before parsing. What the parser sees is the right column.

Resolution4 placeholders

in the manifestsourcewhat the parser sees

✓ No value in clear ↺ Reset

#### interpolation

Written by hand: interpolation is handled by two regular expressions, not by a model.

4 forms

formresolved frommissing valuenote

${ENV:NAME}environment variables: ~/.hydra/env, ~/.hydra/env.<env>, project and job .env, --env-file, systemerrorsame resolver as SECRET

${SECRET:NAME}environment (DB_PASSWORD), .hydra/secrets.<env>, .hydra/secrets, SOPS providererrormasked in logs, errors and action output (visibility)

{{ param:NAME }}-P, environments/<env>.yaml, parameters.yaml defaulterror, stricta whole value can be replaced

{{ env:NAME }}environment variables (as ${ENV})toleratednon-strict resolver

#### Two syntaxes, not one

${'{'}...{'}'} and {{ ... }} are handled by two different resolvers. They are not interchangeable.

#### A literal secret is a blocking error

Typing a password directly is refused here, as it is refused everywhere on this site.

#### One environment, three kinds of values

--env prod (or HYDRA_ENV, or the Studio selector) picks environments/prod.yaml for parameters, ~/.hydra/env.prod for global variables shared by every project, and .hydra/secrets.prod for secrets. Manage them with hdrctl param, hdrctl env and hdrctl secret. Hydra 0.18.0+

#### Variables: the last layer wins

~/.hydra/env < ~/.hydra/env.<env> < project .env < job .env < --env-file. A file wins over a variable already set in the system.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Parameters and environment are substituted before parsing — slug: /dsl/interpolation/param-env/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsInterpolation › {{ param }} and {{ env }}▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›8 · Interpolation›{{ param }} and {{ env }}

Grammar element · {{ param:NAME }} + {{ env:NAME }}

### Parameters and environment are substituted before parsing

Full-value and embedded placeholders are both valid. Full values preserve their resolved type.

transformations.yaml4 steps

‹ Back Next ›

the placeholder is an embedded parameter a full typed parameter an environment value

8

What the parser receives
Resolved values, with types preserved when a placeholder occupies the whole YAML value.

✓ parameter substituted · 6 rows ↺ Reset

#### What {{ param:NAME }} + {{ env:NAME }} is

{{ param:NAME }} and {{ env:NAME }} are placeholders resolved before the YAML structure is validated by DSL models.

They are not runtime expression variables. After substitution, operations receive ordinary strings, numbers, booleans, lists, or mappings.

#### What it contains

Parameter lookup — Resolved from declarations and layered values, with CLI overrides strongest.

Environment lookup — Read from the environment variables of the run: ~/.hydra/env, ~/.hydra/env.<env>, the .env files, --env-file, then the system.

Two substitution modes — A full placeholder preserves type; an embedded placeholder produces text.

#### Whole values keep their type

Use a placeholder as the entire YAML value when the receiving key expects an integer, boolean, list, or mapping. Embed it in text only when text is the intended result.

Interpolation prepares the manifest; the DSL then validates the result.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- filter:
expr: "amount > {{ param:MIN_AMOUNT }}"

hdrctl run examples/tutorial/dsl-elements -t parameter-filter.yaml -P MIN_AMOUNT=50

✅ Pipeline completed successfully in 3.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

ENV and SECRET — external configuration

filter.expr — using substituted text

step.when — placeholders in guards

transformations.yaml — complete manifest

Reference — interpolation forms

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## pipeline.yaml names the two ends — slug: /dsl/pipeline-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › pipeline.yaml▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›pipeline.yaml

Grammar element · pipeline.yaml

### pipeline.yaml names the two ends

Three accepted forms of the same link. Walk them, then see what the file resolves.

pipeline.yaml4 steps

‹ Back Next ›

the file uses the canonical root mapping the same mapping without version the compact YAML form

1

What the runner resolves
One source identifier on the left, one destination identifier on the right.

✓ 30 rows read · 6 written ↺ Reset

#### What pipeline.yaml is

pipeline.yaml is the wiring diagram for one job. It selects one identifier from sources.yaml and one from destinations.yaml, establishing the direction from read to write.

It is not the transformation plan and it contains no connection details. Those responsibilities stay in their own files; this manifest only joins their names.

#### What it contains

The input end — from, an identifier declared under sources.

The output end — to, an identifier declared under destinations.

Optional context — the conventional version line, which the job runner does not use.

#### Names connect files

The file does not move rows. It resolves two names. After both endpoints resolve, the engine reads from the source, applies transformations.yaml when present, and writes to the destination.

Two identifiers are enough to give one job its direction.

#### Run the complete link

This manifest connects the source and destination already declared by the tutorial project:

version: "1.0"
pipeline:
from: src_orders
to: dest_big_orders

hdrctl run examples/tutorial/01-first-job -p examples/tutorial/01-first-job/pipeline.yaml

✅ Pipeline completed successfully in 7.8s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-p, --pipeline FILE explicit path to pipeline.yaml
--dry-run validate configuration without writing data
-v, -vv, -vvv more detail, up to full logs

##### Close by

sources.yaml — declaring the input end

destinations.yaml — declaring the output end

transformations.yaml — what happens between them

from and to — the two-key reference

Lesson 1 — run the complete link

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Wire one source to one destination — slug: /dsl/pipeline/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsPipeline › from and to▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›4 · Pipeline›from and to

Grammar element · pipeline

### Wire one source to one destination

A job reads from exactly one source and writes to exactly one destination. pipeline.yaml names them.

pipeline.yamlpick the two ends

1
2
3

pipeline: from: src_input to: dest_output

from src_input src_orders src_typo — not declared to dest_output dest_archive src_input — a source

4

What the runner sees
Both names must resolve to something declared, and in the right direction.

src_inputsources.yaml

→

transformationssteps[]

→

dest_outputdestinations.yaml

from resolves to a declared source

to resolves to a declared destination

direction is source → destination

✓ Manifest resolves ↺ Reset

#### pipeline

Written by hand: this block has no Pydantic model in the engine, it is parsed directly by the runner.

2 keys

keytyperequireddefaultconstraint

fromstringyes—an id declared in sources

tostringyes—an id declared in destinations

#### One in, one out

A job is atomic. Several sources or several destinations is the role of a workflow, not of pipeline.

#### Names, not paths

from and to hold declared identifiers. The file path lives in extract.table and load.table.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra DSL — slug: /dsl/reference/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsReference▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL

### Hydra DSL

A job is declared in YAML. No code, no API calls — the engine reads the manifest and runs it.

#### What is the Hydra DSL

The language in which a Hydra job is written. Four files declare where the data comes from,
what happens to it, and where it goes. The engine reads them; nothing else is needed.

#### What it is used for

Move data between files, databases and HTTP APIs.

Clean, reshape and aggregate tables along the way.

Order several jobs by dependency, on a schedule or on a webhook.

Start whole projects on a time, a file, a data change, a webhook or the end of another project (triggers.yaml).

#### Notable features

18 operations, one YAML key each. No expression language to learn first.

Nine connector types, same block shape — changing the source touches four lines.

Secrets by reference. ${SECRET:NAME}, never a literal value.

Explicit dependencies between jobs. depends_on is always a list.

Validation before execution — hdrctl validate reads the manifest without touching data.

Extendable through plugins: auth, cache, retry, pagination, circuit breaker.

#### Where to go from here

##### Follow the tutorial

One project, built lesson by lesson. Every block is copied from a job that runs.

Lesson 1 — Your first job

Lesson 2 — Transformationssoon

Lesson 3 — Connectorssoon

Lesson 4 — Joinssoon

Lesson 5 — Aggregatessoon

Lesson 6 — Workflowssoon

Lesson 7 — Parameters and secretssoon

##### Start with a job

One source, a few operations, one destination. That is the whole unit.

version

sources.yaml

transformations.yaml

destinations.yaml

pipeline.yaml

workflow.yaml

from and to

##### Transform the data

The 18 operations, grouped by what they change.

steps

Columns

Rows

Compute

Aggregate

Combine

Reshape

##### Connect to real data

The shape of a source and of a destination block.

type

connection

extract

schema

type

connection

load

##### Order several jobs

Dependencies, triggers, failures.

name and version

trigger

steps

retry

##### The fine print

Expressions, and what is substituted before parsing.

filter.expr

calculate.expr

step.when

script.code

${ENV} and ${SECRET}

{{ param }} and {{ env }}

##### Beyond the language

Installing, connecting, running and watching belong to the platform.

Guide — install, connect, run

Playground — a full job on real data

Build — the DSL written for you as you choose

MigrateVS Code extension — coming from Airflow, dbt, Dagster, Prefect, Databricks or Airbyte

31 of 31 pages are published. The rest are marked soon rather than hidden.

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## sources.yaml is a catalogue, not a build list — slug: /dsl/sources-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › sources.yaml▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›sources.yaml

Grammar element · sources.yaml

### sources.yaml is a catalogue, not a build list

Three correct shapes of the file. Walk them, then read what the engine builds from each.

sources.yaml4 steps

‹ Back Next ›

the file contains one source — the common case two sources — only one is referenced two sources — both are referenced

1

What the engine builds
The figures below come from running the real engine on this exact manifest.

✓ 30 rows read · 6 written ↺ Reset

#### What sources.yaml is

sources.yaml is the file that declares every input the job may read. One root key,
sources, holding a mapping: each key is an identifier you invent, each value is a
declaration of one system to read from.

It is one of the three required files of a job, next to destinations.yaml and
pipeline.yaml. Only transformations.yaml may be omitted.

#### What it contains

Identifiers — names local to the job. pipeline.from points to one of them;
join.right, merge.right and union.right may point to others.

Declarations — four keys each: type names the connector,
connection says how to reach the system, extract what to read,
schema how to type it. Their shape is the subject of
the connectors page.

#### Declared is not opened

This is the idea worth keeping. The file is a catalogue, not a build list. The engine
instantiates a connector only when something references its identifier — so a second source sitting
in the file untouched is never built, its type never checked, its file never looked for.

Declared on the left, referenced on the right. Only what is referenced is built.

#### What the engine requires

The file must exist and declare at least one entry. It is one of the three required files
of a job, next to destinations.yaml and pipeline.yaml.

Every referenced identifier must exist. That link is checked from
pipeline, which names the two ends of the job.

Unreferenced entries are not checked at all. Convenient while you draft, worth a second
look before you commit.

##### Close by

sources.<id>.connection — reaching the system

pipeline — which source feeds which destination

version — the first line of the file

Lesson 1 — the four files of a job

Reference — every key of every block

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## The connection block changes shape with the type — slug: /dsl/sources/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsSources › connection▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›2 · Sources›connection

Grammar element · sources.<id>.connection

### The connection block changes shape with the type

Walk the manifest line by line with Next, then switch the type and watch the block change shape.

sources.yaml7 steps

‹ Back Next ›

type csv json parquet mysql mariadb postgresql postgres mongodb web_api add a key this type does not accept

2

Manifest verdict
No data is read. The parser answers one question: is this block well formed?

✓ Block is valid ↺ Reset

#### What connection is

connection answers one question: how does the engine reach the data? It holds the
coordinates and the credentials of a system — a folder, a database server, an HTTP host — and nothing
else. It performs no reading, applies no operation, and never contains a row.

It sits inside a source or a destination, beside two other keys. type names the connector
that will read it. extract — or load on a destination — says what to
read once the connection is established. connection only says where and
with what rights.

Three keys, three decisions. Only the middle one is about reaching the system.

#### What it contains

The keys differ from one type to the next, but they always play one of five roles.

Location — where the system is.
base_path for CSV, file for JSON and Parquet,
host and port for databases, base_url for a web API.

Identity — who is asking.
user and password for databases,
the auth block — type, token — for a web API.
Always a reference such as ${SECRET:DB_PASSWORD}, never a literal.

Scope — which part of the system.
database, schema on PostgreSQL, collection on MongoDB.

Format — how to decode the bytes.
delimiter, encoding, quotechar for CSV.

Transport — how to fetch, in several trips.
The pagination block for a web API: strategy, cursor_field,
page_size.

Two consequences follow. A connector reads only the keys it knows, so a key meant for another type is
ignored rather than rejected — a misspelling has no effect and raises no error. And the block is never
correct on its own: it is correct for a type.

##### Close by

Lesson 1 — a source inside a job that runs

pipeline — which source feeds which destination

Interpolation — how a secret gets in

Reference — every key of every block

Guide — connecting to a real database

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## extract narrows what the connector reads — slug: /dsl/sources/extract/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsSources › extract▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›2 · Sources›extract

Grammar element · sources.<id>.extract

### extract narrows what the connector reads

Three complete source declarations. The connector stays local; the extraction request changes.

sources.yaml4 steps

‹ Back Next ›

the extraction uses a CSV table smaller batches a JSON table

2

What the connector receives
A target plus optional limits and batching, after the connector has been selected.

✓ 30 rows extracted ↺ Reset

#### What sources.<id>.extract is

extract is the read request handed to the selected source connector.

It does not identify the connector or describe credentials. Those belong to type and connection; extraction begins only after both are resolved.

#### What it contains

A target — Use table, query, or collection according to the connector.

Optional narrowing — filter and limit constrain supported reads.

Delivery size — batch_size defaults to 10,000 and must be at least 10 in the current parser.

#### Connection reaches; extract chooses

A connection can reach an entire system. extract makes one concrete request inside it: this file, table, query, or collection, delivered in these batches.

Reachability comes first; selection comes second.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
sources:
src_orders:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders.csv
batch_size: 10000
schema:
mode: manual
fields:
- name: order_id
type: string
required: true
- name: amount
type: float
drift_policy: warn
validation_policy: best_effort
sample_size: 100
src_orders_extra:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders_extra.csv
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

type — choosing the connector

connection — reaching the system

schema — describing expected fields

pipeline.yaml — selecting this source

Reference — all extract keys

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## schema records expectations, not transformations — slug: /dsl/sources/schema/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsSources › schema▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›2 · Sources›schema

Grammar element · sources.<id>.schema

### schema records expectations, not transformations

Three valid schema policies. They describe incoming fields without replacing cast or select.

sources.yaml4 steps

‹ Back Next ›

the schema mode is manual fields automatic description hybrid expectations

2

What the parser records
Field metadata and policies attached to the source declaration.

✓ manual schema parsed ↺ Reset

#### What sources.<id>.schema is

schema is optional metadata describing the shape a source is expected to expose.

It is not a transformation step. In the current executor the block is parsed and validated, but it does not cast, select, or reject runtime rows; use transformations for those effects.

#### What it contains

Declaration mode — auto, manual, infer_strict, or hybrid.

Field descriptions — Names, types, nested paths, required/default metadata, and array handling.

Policies — Drift, validation, and sampling settings validated by the source model.

#### Expected is not transformed

A schema tells readers what the source is meant to look like. Only transformation steps change the rows, so keep operational casts and selections in transformations.yaml.

Schema explains the boundary; transformations alter what crosses it.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
sources:
src_orders:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders.csv
batch_size: 10000
schema:
mode: manual
fields:
- name: order_id
type: string
required: true
- name: amount
type: float
drift_policy: warn
validation_policy: best_effort
sample_size: 100
src_orders_extra:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders_extra.csv
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

type — connector contract

extract — read request

Columns — cast and select

sources.yaml — the full declaration

Reference — schema fields and policies

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## type chooses the connector contract — slug: /dsl/sources/type/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsSources › type▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›2 · Sources›type

Grammar element · sources.<id>.type

### type chooses the connector contract

Three runnable local declarations. Change the type and the meaning of connection and extract changes with it.

sources.yaml4 steps

‹ Back Next ›

the source reads CSV rows JSON objects normalized CSV spelling

2

What type selects
A connector family, then the contract for the two blocks below it.

✓ CSV connector selected ↺ Reset

#### What sources.<id>.type is

type is the discriminator that tells Hydra which connector must interpret a source declaration.

It is not a file format hint applied after reading. Connector construction happens first; that connector owns the accepted connection settings and extraction behavior.

#### What it contains

One normalized string — Whitespace is trimmed and the value is lower-cased.

A registered connector name — CSV and JSON are built in; database and optional connectors use the same slot.

A downstream contract — The selected connector interprets connection and extract.

#### The type changes the contract

The outer YAML stays stable while the inner meaning changes. Choose type first, then fill the connection and extraction blocks that belong to that connector.

One word selects the code that reads the rest of the declaration.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
sources:
src_orders:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders.csv
batch_size: 10000
schema:
mode: manual
fields:
- name: order_id
type: string
required: true
- name: amount
type: float
drift_policy: warn
validation_policy: best_effort
sample_size: 100
src_orders_extra:
type: csv
connection:
base_path: "data/canonical"
extract:
table: orders_extra.csv
batch_size: 10000

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

sources.yaml — the catalogue

connection — connector settings

extract — what to read

schema — expected fields

Reference — every source key

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## An ordered list, and the only file you may omit — slug: /dsl/transformations-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › transformations.yaml▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›transformations.yaml

Grammar element · transformations.yaml

### An ordered list, and the only file you may omit

Four shapes this file takes, all correct. Walk them, then read what each one does.

transformations.yaml4 steps

‹ Back Next ›

the file contains two steps — cast, then filter three steps — and narrow the columns the short form — steps at the root no transformations.yaml — a copy job

1

What this example does
The figures below come from running the real engine on this exact manifest.

✓ 30 rows read · 6 written ↺ Reset

#### What transformations.yaml is

transformations.yaml holds the ordered list of operations applied between reading and
writing. One root key, transformations, containing one key, steps,
containing a list.

It is the only file of a job you may omit. Without it the rows travel from the source to the
destination unchanged — a copy job, which is a legitimate thing to want.

#### What it contains

A list, not a set. Position is meaning. Each entry receives what the previous one
produced, never the source.

One operation per entry — a mapping with a single key, the operation name, whose value
holds its parameters. Eighteen names are accepted; anything else stops the run.

An optional label. A step may carry a name, used in messages. It changes
nothing to the result.

#### Order is the whole idea

The list runs from top to bottom and the engine never reorders it. A CSV yields text in every column,
so a step that compares numbers belongs after the step that produces them — which is why the example
starts with cast. Note that hdrctl validate checks the shape of the
manifest, not the types flowing through it.

Each step sees what the previous one produced, never the source.

#### Two shapes, one file

The engine accepts two shapes for this file — the same manifest written two ways. Both are complete
below: copy either one and it works.

Long form — the transformations key wraps steps. Used throughout this documentation.

transformations:
steps:
- cast:
mapping:
amount: float
- filter:
expr: "amount > 50"

Short form — steps sits at the root. Used by the templates of hdrctl init.

steps:
- cast:
mapping:
amount: float
- filter:
expr: "amount > 50"

##### Run both, and compare

The tutorial project carries the long form. Save the short one as short-form.yaml and
point hdrctl run at it with -t: no file is modified.

hdrctl run examples/tutorial/01-first-job
hdrctl run examples/tutorial/01-first-job -t short-form.yaml

Both print the same three lines:

✅ Pipeline completed successfully
Rows read : 30
Rows written: 6

The full syntax of the command, with the options that matter here:

hdrctl run <job-directory>
-t, --transformations FILE read the steps from this file instead
--dry-run validate the manifest, write nothing
-v, -vv, -vvv more detail, up to full logs

Pick a shape per project and hold it. Nothing in the engine will tell you that you drifted, since
both are equally valid.

##### Close by

Rows — filter, sort, deduplicate

sources.yaml — where the rows come from

pipeline — which source feeds which destination

Lesson 1 — cast before filter, in a job that runs

Reference — the eighteen operations

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Aggregate changes the grain — slug: /dsl/transformations/aggregate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › Aggregate▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›Aggregate

Grammar element · op.aggregate

### Aggregate changes the grain

Three valid grouped summaries. The by list defines one output row per group.

transformations.yaml4 steps

‹ Back Next ›

the summary computes named sum and count short sum form average per status

5

What the engine groups
Thirty orders become one output row for each distinct status.

✓ 30 rows → 3 groups ↺ Reset

#### What op.aggregate is

aggregate groups the current rows and computes named summary values at a new grain.

It is not a window calculation: source rows are replaced by one row per distinct by combination.

#### What it contains

Grouping keys — A required, non-empty by list.

Output mapping — A required, non-empty agg mapping.

Reducers — Short form reuses a source name; long form separates output, function, and source column.

#### The by list defines the grain

Read by before reading the functions. It tells you what one output row means; the aggregate mapping then tells you which facts are attached to that row.

The output is a different table because its rows mean something different.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- aggregate:
by: [status]
agg:
total_amount: {func: sum, col: amount}
order_count: {func: count, col: order_id}

hdrctl run examples/tutorial/dsl-elements -t aggregate.yaml

✅ Pipeline completed successfully in 4.0s
Rows read : 30
Rows written: 3

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

steps — where aggregate runs

Compute — row-level values

Rows — row membership

Reshape — changing layout

Reference — aggregate keys

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Column operations change the table contract — slug: /dsl/transformations/columns/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › Columns▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›Columns

Grammar element · operations.columns

### Column operations change the table contract

Select, rename, and cast are three distinct moves. Each valid example changes one aspect only.

transformations.yaml4 steps

‹ Back Next ›

the column move is select membership rename one column cast one column

5

What changes
Membership, names, or types — one dimension of the column contract at a time.

✓ 4 columns selected ↺ Reset

#### What operations.columns is

Column operations are the three transformations that change which columns exist, what they are called, or what types they hold.

They do not filter rows or compute grouped results. Those effects belong to other operation families and should remain separate steps.

#### What it contains

select — Keeps an ordered, non-empty list of columns.

rename — Maps old names to new names.

cast — Maps columns to supported target types.

#### Membership, names, and types are different

Keeping the three moves separate makes a pipeline readable. A reviewer can see whether a step narrows the table, changes its vocabulary, or converts its values.

Each operation changes one dimension of the table.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- rename:
mapping: {amount: total_amount}
- select:
columns: [order_id, customer_id, total_amount, status]

hdrctl run examples/tutorial/dsl-elements -t columns.yaml

✅ Pipeline completed successfully in 2.4s
Rows read : 30
Rows written: 30

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

steps — execution order

Rows — filtering and sorting

Compute — creating values

schema — expected input fields

Reference — select, rename, cast

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Combine brings in a second declared source — slug: /dsl/transformations/combine/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › Combine▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›Combine

Grammar element · operations.combine

### Combine brings in a second declared source

Three valid union forms. Join, merge, and union all resolve right before the operation runs.

transformations.yaml4 steps

‹ Back Next ›

the combination uses UNION ALL semantics distinct union an inline right source

5

What the runner prepares
A second source is resolved and loaded before the transformation engine combines it.

✓ 30 + 4 → 34 rows ↺ Reset

#### What operations.combine is

Combine operations bring a second source into the current transformation frame.

The transformation engine does not open that source itself. The runner resolves right, loads its rows, and injects them before join, merge, or union executes.

#### What it contains

join — Matches rows with inner, left, right, or outer semantics.

merge — Reconciles rows by a required key, optionally deleting unmatched left rows.

union — Stacks compatible rows and optionally removes duplicates.

#### Right is prepared before the operation

A two-frame operation still has one transformation input. The runner turns right into ready rows first, so the engine receives two frames rather than a connector configuration.

Connector work finishes before combination begins.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- union:
right: src_orders_extra
distinct: false

hdrctl run examples/tutorial/dsl-elements -t combine.yaml

✅ Pipeline completed successfully in 2.7s
Rows read : 30
Rows written: 34

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

sources.yaml — declaring right

steps — current frame order

Aggregate — grouped summaries

Reshape — layout changes

Reference — join, merge, union

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Compute creates values without hiding the contract — slug: /dsl/transformations/compute/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › Compute▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›Compute

Grammar element · operations.compute

### Compute creates values without hiding the contract

Calculate handles expressions; script handles declared custom outputs. Both name what they add.

transformations.yaml4 steps

‹ Back Next ›

the computation uses a calculate expression a row script a vectorized script

5

What the step produces
Named output columns derived from values already present in the current frame.

✓ amount_with_tax calculated ↺ Reset

#### What operations.compute is

Compute operations create new values from columns in the current transformation frame.

They do not reach external systems. calculate evaluates one pandas expression; script executes declared Python code in a restricted environment.

#### What it contains

calculate — One output column and one expression.

script inputs — An optional list of columns made available to code.

script outputs and code — A typed output mapping, execution mode, and required code block.

#### Outputs are part of the declaration

Computation is easier to trust when every produced column is named up front. Calculate names one output; script declares an output mapping before any code runs.

A computation is a contract from inputs to named outputs.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping: {amount: float}
- calculate:
column: amount_with_tax
expr: "amount * 1.2"

hdrctl run examples/tutorial/dsl-elements -t compute.yaml

✅ Pipeline completed successfully in 2.9s
Rows read : 30
Rows written: 30

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

calculate.expr — expression rules

script.code — restricted Python

Columns — type preparation

steps — execution order

Reference — calculate and script

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Reshape changes where values live — slug: /dsl/transformations/reshape/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › Reshape▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›Reshape

Grammar element · operations.reshape

### Reshape changes where values live

Unpivot, pivot, and transpose alter layout without inventing a second data source.

transformations.yaml4 steps

‹ Back Next ›

the layout change is wide to long long to wide rows and columns exchange

5

What changes
Rows become columns, columns become rows, or repeated value columns become observations.

✓ 5 wide rows → 20 long rows ↺ Reset

#### What operations.reshape is

Reshape operations change the arrangement of values across rows and columns.

They do not join another source or summarize groups by themselves. Pivot may aggregate collisions, but its primary responsibility is layout.

#### What it contains

pivot — Turns values from one column into output columns.

unpivot — Turns several value columns into repeated rows.

transpose — Exchanges the row and column axes.

#### Name the identity before moving values

A reshape is understandable when the stable identity is explicit. Read index, id_vars, or index_col first; then follow the values that move around it.

Reshape changes layout, not the source of the values.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- unpivot:
id_vars: [region]
value_vars: [q1, q2, q3, q4]
var_name: quarter
value_name: revenue

hdrctl run examples/tutorial/dsl-elements -s sources-revenue.yaml -t reshape.yaml

✅ Pipeline completed successfully in 3.7s
Rows read : 5
Rows written: 20

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

Aggregate — changing grain

Columns — changing contract

steps — execution order

Combine — adding another frame

Reference — pivot, unpivot, transpose

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## steps is the ordered execution plan — slug: /dsl/transformations/steps/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTransformations › steps▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›5 · Transformations›steps

Grammar element · transformations.steps

### steps is the ordered execution plan

Three valid lists. Add one operation at a time and keep the order visible.

transformations.yaml4 steps

‹ Back Next ›

the plan contains one cast cast then filter cast, filter, select

5

What the engine applies
One normalized operation after another, each receiving the previous result.

✓ 1 ordered step ↺ Reset

#### What transformations.steps is

steps is the ordered list of operations inside a job.

It is not a set of desired outcomes. Every list position is observable because the next operation receives the rows produced by the previous one.

#### What it contains

List entries — Each is a mapping with exactly one operation name.

Operation parameters — The value is validated against that operation model.

Sequence — Position is the execution order; no optimizer rearranges it.

#### A step is one boundary

One list entry should answer one question: what operation runs next? The single-key shape makes the boundary visible and keeps ordering reviewable in plain YAML.

The list is the plan, and its order is the execution.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

version: "1.0"
transformations:
steps:
- cast:
mapping:
amount: float
- filter:
expr: "amount > 50"

hdrctl run examples/tutorial/dsl-elements

✅ Pipeline completed successfully in 2.6s
Rows read : 30
Rows written: 6

The relevant command syntax, copied from hdrctl run --help:

hdrctl run [PATH]
-s, --sources FILE explicit path to sources.yaml
-d, --destinations FILE explicit path to destinations.yaml
-t, --transformations FILE explicit path to transformations.yaml
-P, --param KEY=VALUE override a parameter, repeatable

##### Close by

transformations.yaml — file shapes

Columns — select, rename, cast

Rows — row operations

Compute — calculate and script

Reference — all 18 operations

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Your first job — slug: /dsl/tutorial/01-first-job/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsTutorial▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›Tutorial›Lesson 1

Lesson 1 of 7

### Your first job

Read a CSV, keep the large orders, write the result. Four files, one command.

#### 1. What to Expect

##### Objectives

You will see the four files that make up every Hydra job.

You will read a CSV, convert a column, filter rows and write the result.

You will run the job and read what the engine reports.

##### Description

We start from orders.csv, thirty rows of a small shop. Amounts are stored as text,
as they always are in a CSV. We convert them to numbers, keep the orders above fifty, drop the
columns we do not need, and write what remains.

This project exists in the repository under examples/tutorial/01-first-job. Every
block below is copied from it, and the output shown is the output it produced.

##### Processing Steps

Read orders.csv as a CSV source.

Cast amount from text to a number.

Keep the rows above fifty, then select four columns.

Write the result to big_orders.csv.

#### 2. Implementation

Walk the four files with Next. The highlighted line is the one being explained.

sources.yaml 10 steps

sources.yaml transformations.yaml destinations.yaml pipeline.yaml

‹ Back Next ›

1

What the engine produced
Thirty rows in, six out. These are the real rows, not an illustration.

big_orders.csv6 of 30 rows

order_idcustomer_idamountstatus

✓ Pipeline completed · 30 read · 6 written

#### 3. Execution

From the root of the repository:

hdrctl run examples/tutorial/01-first-job

The engine reports what it did:

▶ Pipeline 01-first-job — examples/tutorial/01-first-job

✅ Pipeline completed successfully in 3.3s
Rows read : 30
Rows written: 6

Before running anything, hdrctl validate reads the four files and reports what it
finds without touching the data. It does not type-check expressions, so a comparison between a
text column and a number passes validation and fails at run time — that is exactly why
cast comes before filter here.

#### 4. Next Lesson

Lesson 2 chains more operations on the same project: computing a column, renaming it, and
sorting the result.

Rows — filter, sort, deduplicate

sources.connection — the nine types

Lesson 2 — Transformationssoon

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## version declares an intent, not a contract — slug: /dsl/version/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › version▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›version

Grammar element · version

### version declares an intent, not a contract

Two correct manifests, with the line and without. Walk them, then read what the key is for.

sources.yaml4 steps

‹ Back Next ›

version: "1.0" — the shape published today omitted — also a valid manifest

1

What the engine does with it
The same run in both cases. That is the point of this page.

✓ 30 rows read · 6 written ↺ Reset

#### What version is

version is the first line of a manifest file. It states which shape of the language
the file was written for — a declaration of intent addressed to whoever reads the file next,
human or tool.

It is not a contract. Hydra has published one shape of the language so far, and the engine does not
branch on this key: no job parser reads it. Remove it from all four files of a working job and the
run is identical. Write "2.0" and nothing selects another grammar, because none exists.

One key, two readers, and neither one acts on it.

#### What to do with it

Write it anyway. A manifest without a version says nothing about its age. Cost: one line.

Write "1.0". It is the only shape published, and every example uses it.

Do not expect a check. Nothing verifies the value, so it cannot protect you from anything.

Do not use it as a feature flag. Nothing in the engine branches on it.

##### Close by

Lesson 1 — the four files of a job

sources.connection — reaching the data

pipeline — which source feeds which destination

Reference — every key of every block

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## workflow.yaml turns jobs into a graph — slug: /dsl/workflow-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsManifest › workflow.yaml▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›1 · Manifest›workflow.yaml

Grammar element · workflow.yaml

### workflow.yaml turns jobs into a graph

Three correct graphs. Walk them, then see how dependencies become an execution plan.

workflow.yaml4 steps

‹ Back Next ›

the graph is sequential — job, then notification fan-out — two actions after one job scheduled — one daily job

1

What the runner schedules
Dependencies form execution groups; independent steps in a group may run together.

✓ 2 of 2 steps completed ↺ Reset

#### What workflow.yaml is

workflow.yaml is an orchestration graph above individual Hydra jobs. Its steps can run job directories or actions, while dependencies determine which nodes must finish first.

It is not another job manifest. A job moves rows from one source to one destination; a workflow coordinates several jobs and side effects as one named run.

#### What it contains

Identity and entry — name, optional description and version, plus a manual, schedule, or webhook trigger.

Work nodes — job steps point to job directories; action steps name an action and its parameters.

Control edges — depends_on, when, enabled, failure policy, and retry policy govern scheduling.

#### Dependencies are the execution plan

List position makes the file readable; depends_on makes the graph. The runner groups every step whose dependencies are complete. One ready step runs alone; several ready steps run in parallel.

The graph, not the vertical order, determines what can run together.

#### Run a complete workflow

The repository carries this two-step workflow:

workflow:
name: "demo_pipeline"
description: "Workflow de démonstration — extraction + log"
trigger:
type: manual
steps:
- name: "extract_csv"
type: job
job: "../../examples/minimal_csv"
depends_on: []
on_failure: fail
- name: "notify"
type: action
action: log
params:
message: "Pipeline terminé avec succès."
depends_on: ["extract_csv"]
on_failure: skip

hdrctl workflow run examples/workflow_demo/workflow.yaml

✓ Step 'extract_csv' OK (3.2s)
✓ Step 'notify' OK (0.0s)

✅ Workflow 'demo_pipeline' completed in 3.2s — 2/2 steps OK

The command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

pipeline.yaml — the job each node may run

Lesson 1 — build the first job

transformations.yaml — ordered work inside a job

Interpolation — keep configuration outside manifests

Reference — every workflow key

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## A workflow needs an identity before it runs — slug: /dsl/workflow/name-version/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsWorkflow › name and version▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›6 · Workflow›name and version

Grammar element · workflow.name + version

### A workflow needs an identity before it runs

Three complete identities. Name labels the run; version records the manifest shape.

workflow.yaml4 steps

‹ Back Next ›

the identity contains name, version, description the default version a minimal identity

6

What the model stores
A required run name, an optional description, and a version defaulting to 1.0.

✓ workflow identity complete ↺ Reset

#### What workflow.name + version is

Workflow name is the required identity used in logs and results; version records the manifest shape the definition targets.

Neither field establishes dependencies. The graph comes from steps; identity makes that graph recognizable to people and tools.

#### What it contains

A required name — A string carried into workflow results.

A defaulted version — 1.0 when the key is omitted.

Optional context — Description documents purpose without changing the run.

#### Identity labels the graph; it does not build it

Choose a stable name that survives individual run IDs. Keep version as manifest context, then let trigger and steps carry the operational meaning.

Identity follows the graph from declaration to result.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

workflow:
version: "1.0"
name: docs_workflow
description: Two actions used by the DSL documentation.
trigger: {type: manual}
steps:
- name: prepare
type: action
action: log
params: {message: "Preparation complete."}
retry: {max: 2, delay: 0, backoff: fixed}
- name: publish
type: action
action: log
params: {message: "Publication complete."}
depends_on: [prepare]
when: "1 == 1"
on_failure: fail

hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml

✓ Step 'prepare' OK (0.0s)
✓ Step 'publish' OK (0.0s)

✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK

The relevant command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

workflow.yaml — the whole graph

trigger — entry policy

steps — graph nodes

retry — attempt policy

Reference — workflow fields

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## retry wraps one step in an attempt policy — slug: /dsl/workflow/retry/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsWorkflow › retry▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›6 · Workflow›retry

Grammar element · workflow.steps.retry

### retry wraps one step in an attempt policy

No retry, fixed delay, and exponential backoff are all valid. Success stops the loop immediately.

workflow.yaml4 steps

‹ Back Next ›

the attempt policy is no retries two fixed retries three exponential retries

6

What retry wraps
One step execution, repeated only after failure and only up to the declared maximum.

✓ one successful attempt ↺ Reset

#### What workflow.steps.retry is

retry is the re-attempt policy around one workflow step.

It is not a workflow-wide restart. Completed predecessor nodes stay complete, and the policy only repeats the step that failed.

#### What it contains

max — Number of retries after the initial attempt; default zero.

delay — Base wait in seconds; default zero.

backoff — fixed by default or exponential.

#### Max counts retries, not attempts

A policy with max: 2 allows the initial attempt plus two re-attempts. Reading max this way prevents an off-by-one expectation during incident review.

Retries are local and success short-circuits the policy.

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

workflow:
version: "1.0"
name: docs_workflow
description: Two actions used by the DSL documentation.
trigger: {type: manual}
steps:
- name: prepare
type: action
action: log
params: {message: "Preparation complete."}
retry: {max: 2, delay: 0, backoff: fixed}
- name: publish
type: action
action: log
params: {message: "Publication complete."}
depends_on: [prepare]
when: "1 == 1"
on_failure: fail

hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml

✓ Step 'prepare' OK (0.0s)
✓ Step 'publish' OK (0.0s)

✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK

The relevant command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

steps — the wrapped node

trigger — graph entry

step.when — conditional execution

workflow.yaml — full policy context

Reference — retry defaults

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Workflow steps are nodes, not a sequence — slug: /dsl/workflow/steps/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsWorkflow › steps▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›6 · Workflow›steps

Grammar element · workflow.steps

### Workflow steps are nodes, not a sequence

Job nodes, action nodes, and dependent nodes. The edges decide order and parallelism.

workflow.yaml4 steps

‹ Back Next ›

the graph contains one action node one job node two dependent actions a project node

6

What the runner builds
Named nodes grouped by dependency readiness, with independent nodes allowed to run together.

✓ 1 action node ↺ Reset

#### What workflow.steps is

Workflow steps is the list of named nodes in an orchestration graph.

It is not an ordered transformation list. Runtime groups come from depends_on; independent nodes may run in parallel even when written on different lines.

#### What it contains

Identity and kind — Unique name plus job, action or project type.

Work target — A job directory, an action name with parameters, or another project.

Control — Dependencies, condition, enabled flag, failure policy, and optional retry.

#### Edges make the schedule

List order keeps YAML readable. Dependency edges create the executable plan, so review depends_on whenever you need to understand sequencing or parallelism.

Names create nodes; depends_on creates order.

#### Project nodes (Hydra 0.19+)

A step of type: project runs another Hydra project — its thread.yaml, or only the workflows listed. The calling project is the master.

- name: crm_sync
type: project
project: ../crm_sync # folder relative to the master (ref: path, default) — or ref: name
env: inherit # inherit | none | <environment>
params: {batch_date: "{{ param:run_date }}"}
variables: {EXPORT_DIR: out/crm}
workflows: [ingest, report]
outputs: [last_batch]
isolation: inprocess # inprocess | subprocess
timeout: 10m
overlap: wait # wait | skip | fail

What passes — the environment name; params and variables only when listed. Secrets never: ${SECRET:…} there is refused.

Results — {{ project:STEP.status }}, .rows, .duration and .param.NAME for each name in outputs.

Cycles — master → crm_sync → master and more than 5 levels are refused by hdrctl workflow validate, hdrctl run, Studio and the MCP tool hydra_project_calls.

One at a time — a project already running makes the step wait, skip or fail (overlap).

hdrctl workflow validate nightly # prints the tree of called projects
hdrctl run ../crm_sync -w ingest -w report --env prod

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

workflow:
version: "1.0"
name: docs_workflow
description: Two actions used by the DSL documentation.
trigger: {type: manual}
steps:
- name: prepare
type: action
action: log
params: {message: "Preparation complete."}
retry: {max: 2, delay: 0, backoff: fixed}
- name: publish
type: action
action: log
params: {message: "Publication complete."}
depends_on: [prepare]
when: "1 == 1"
on_failure: fail

hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml

✓ Step 'prepare' OK (0.0s)
✓ Step 'publish' OK (0.0s)

✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK

The relevant command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

trigger — starting the graph

retry — attempts around one node

step.when — conditional readiness

workflow.yaml — complete graph

Reference — all step fields

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## trigger declares how a workflow may start — slug: /dsl/workflow/trigger/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

ContentsWorkflow › trigger▾
Hydra DSL The grammar · 31 elements

Grammar covered0%

0 / 31 elements31 of 31 published

Hydra DSL›6 · Workflow›trigger

Grammar element · workflow.trigger

### trigger declares how a workflow may start

Manual, schedule, and webhook are three valid entry policies. The graph below them stays the same.

workflow.yaml4 steps

‹ Back Next ›

the entry policy is manual daily schedule webhook

6

What trigger describes
The intended entry point for the graph, separate from its dependency structure.

✓ manual trigger parsed ↺ Reset

#### What workflow.trigger is

trigger declares the intended entry policy for a workflow graph: manual, schedule, or webhook.

It is not the scheduler or HTTP endpoint itself. Those platform concerns live outside the DSL; this block records the contract the platform should use.

#### What it contains

type — Manual by default, or schedule/webhook when declared.

cron — Required for a schedule trigger.

No graph logic — Dependencies and failure policies remain on steps.

#### Entry policy is not execution order

Trigger answers when or how the graph becomes eligible to start. Once started, depends_on still decides which nodes can run.

One graph can have one declared way in.

#### Project triggers (Hydra 0.19+)

workflow.trigger starts one workflow. triggers.yaml, at the root of a project, starts the whole project — its thread.yaml, or the workflows listed — and knows more events.

version: "1.0"
triggers:
- name: nightly
type: cron # cron | interval | file | marker | source_change | webhook | after_project
cron: "0 2 * * *"
timezone: Europe/Paris
env: prod
retry: {max: 2, delay: 5m}
- name: new_orders
type: file # {{ param:trigger.file }} in the run
path: inbox/*.csv
- name: on_push
type: webhook # hdrctl trigger token on_push
token: ${SECRET:trigger.on_push.token}
- name: after_crm
type: after_project # on: success | failure | any
project: ../crm

Time — cron (five fields, timezone) and interval (every: 15m).

Files — file (added or modified, stable for debounce) and marker (a READY file, removed before the run).

Data — source_change: count, max of a column or checksum of a job's source.

Calls — webhook with a token kept as a project secret; hdrctl trigger fire by hand.

Chains — after_project: the end of another project.

hdrctl trigger validate
hdrctl watch --env prod # runs the triggers; hdrctl serve runs the same engine

#### Run the complete example

Copy this manifest from the verified documentation project, then run it from the repository root.

workflow:
version: "1.0"
name: docs_workflow
description: Two actions used by the DSL documentation.
trigger: {type: manual}
steps:
- name: prepare
type: action
action: log
params: {message: "Preparation complete."}
retry: {max: 2, delay: 0, backoff: fixed}
- name: publish
type: action
action: log
params: {message: "Publication complete."}
depends_on: [prepare]
when: "1 == 1"
on_failure: fail

hdrctl workflow run examples/tutorial/dsl-elements/workflow.yaml

✓ Step 'prepare' OK (0.0s)
✓ Step 'publish' OK (0.0s)

✅ Workflow 'docs_workflow' completed in 0.0s — 2/2 steps OK

The relevant command syntax, copied from hdrctl workflow run --help:

hdrctl workflow run PATH
PATH path to workflow.yaml
--lang LANG interface language
-h, --help show command help

##### Close by

name and version — graph identity

steps — graph nodes

retry — failure attempts

workflow.yaml — complete manifest

Reference — trigger fields

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
