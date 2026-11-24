# Hydra Studio lessons — part 1

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## Create a project in Hydra Studio and add its first workflow — slug: /studio/01-open-a-project/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons02 · Create a project▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 2

Lesson 2 of 65 · Create a project

### Create a project in Hydra Studio and add its first workflow

Create the course project, add first-workflow to it, choose how that workflow is triggered, and open it on an empty canvas.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 on Windows, Python 3.13

Overviewabout 15 minutesAPI and Studio running

Quick answer
To create a project in Hydra Studio, open Overview, select Create a project, type a name and select Create project. Hydra ETL creates a folder on disk with Data, jobs, workflows, outputs and scripts subfolders. Then select New workflow, keep the Manual trigger and open the workflow in the editor.

#### What is a project in Hydra Studio?

##### Goal

Create studio-course from the real New project dialog, add a workflow named first-workflow to it, and open that workflow in the editor. Read the project name, disk path and workflow count without confusing those summaries with validation.

##### Why this matters

A project is a folder on disk; a workflow is a file inside it. Studio never runs a project — it runs a workflow. Creating both in the same sitting makes that hierarchy concrete, and the trigger you pick here is written into the workflow file, workflows/first-workflow.yaml.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

Nothing from an earlier lesson — this one opens the course.

#### How do I create a project and a workflow in Hydra Studio?

##### 01Open the start page

###### Objective

Reach the page that lists projects and exposes the supported workspace actions.

###### Actions

Open http://127.0.0.1:5678.

Select Overview in the sidebar if another page is active.

Find the Get started card on the right.

Studio → Overview

What you should see
The page identifies Hydra Studio and shows the three start actions. Clone a repository is dimmed: it is announced, not implemented.

Hydra Studio
Get started
Clone a repository
Open a project
Create a project

[image: The Hydra Studio Overview page of a fresh workspace, with the Create a project card and a Statistics panel counting one project.]

The Statistics panel counts projects and runs across the whole workspace, not inside one project.

##### 02Create the cumulative project

###### Objective

Generate a Studio project: a folder with the standard Hydra structure.

###### Actions

Select Create a project.

Enter studio-course in Project name.

Leave Parent folder empty to use the default workspace, then select Create project.

Create a project → Project name: studio-course → Create project

What you should see
Only the name is required. An empty parent folder puts the project under the default workspace, ~/hydra-workspace unless you started hdrctl serve --workspace with another folder.

New project
Project name *
Description
Parent folder (optional)
Create project

[image: The New project dialog with the project name studio-course typed in, an optional description and an optional parent folder.]

The Create project button needs a name; the description and the parent folder are optional.

##### 03Find the project in the list

###### Objective

Use the indexed project row instead of creating a second workspace.

###### Actions

Look under All projects on the Overview.

Read the disk path printed under the project name.

Select the studio-course row.

Overview → All projects → studio-course

What you should see
The project is listed with its path on disk, and the Projects statistic has gone up by one.

ALL PROJECTS
studio-course
<workspace>\studio-course
Projects 2

[image: The Overview project list showing studio-course above the sample project hydra-demo, with its disk path.]

studio-course now sits in the list, with the path of its folder on disk.

##### 04Read the empty project

###### Objective

Recognize what a project holds before anything has been designed in it.

###### Actions

Read the breadcrumb, the project name and its path.

Read the workflow count under the path.

Note the two ways in: Import workflow and New workflow.

Overview / studio-course

What you should see
A project with no workflow is not an error state — it is the normal starting point. Nothing here can be run yet.

Overview / studio-course
<project path>
0 workflow
No workflows

[image: The studio-course project page with 0 workflows, an Environment bar and a New workflow button.]

Import workflow reads an existing workflow.yaml; New workflow writes a fresh one.

##### 05Create the first workflow

###### Objective

Add a workflow to the project and choose what will start it.

###### Actions

Select New workflow.

Enter first-workflow in Workflow name.

Open the Trigger list, keep Manual, then confirm.

New workflow → Workflow name: first-workflow → Trigger: Manual

The Trigger list holds three modes, and the one you pick becomes trigger.type in the workflow file. The choice is not final — the workflow card lets you change it later.

TriggerWhat starts the runWhen to use it

ManualYou do, from Studio or with hdrctl workflow run.While designing. The only mode that needs no extra configuration, and the right one for this course.

Schedule (cron)A cron expression, evaluated by the scheduler.Recurring loads — a nightly extract, a quarter-hourly sync. Requires a cron value; without it the workflow will not validate.

WebhookAn incoming HTTP call to the API.Runs driven by an external system: a file landing, a job finishing elsewhere. Requires the API to be reachable by that caller.

What you should see
The name is required; the trigger defaults to Manual.

New Workflow
Workflow name *
Trigger
Manual
Schedule (cron)
Webhook

[image: The New Workflow dialog with the name first-workflow and the Trigger set to Manual.]

Name and trigger: Manual is the default.

##### 06Read the workflow card

###### Objective

Separate what the card states about the file from what it states about execution.

###### Actions

Read the workflow name and the trigger printed under it.

Read the Draft badge and the run history beside it.

Open the Trigger selector on the card to confirm the mode can still be changed.

studio-course → first-workflow

What you should see
The count moves to 1 workflow. Draft describes the file — it has no nodes yet — while never run describes its history. Neither means the workflow is invalid.

1 workflow
first-workflow
Manual
Draft never run
Open in editor

[image: The first-workflow card on the project page, with the Draft badge, never run, Trigger Manual and Open in editor.]

The card states the file (Draft) and its history (never run), and lets you change the trigger.

##### 07Open the workflow in the editor

###### Objective

Reach the canvas where the following lessons will place nodes.

###### Actions

Select Open in editor on the card.

Read the node and edge counters beside the workflow name.

Look at the Node palette and the two configuration tabs.

first-workflow → Open in editor

What you should see
An empty canvas, and a palette whose Jobs group is empty because no job exists yet. The URL carries both the workflow and the project it belongs to.

first-workflow 0 nodes · 0 edges
Jobs configuration Workflow configuration
NODE PALETTE
Actions (9) Control Flow (2) Containers (3) Jobs (0)

[image: The Hydra Studio editor opened on first-workflow: an empty canvas and a palette whose Jobs group reads No jobs defined.]

The palette says it plainly: No jobs defined — create one in the Jobs configuration tab.

###### Tips and tricks

A fresh workspace already contains a sample project named hydra-demo. That is why the Projects statistic reads 2 after you create studio-course.

Name projects and workflows with lowercase letters and hyphens, such as first-workflow. The name becomes the file name, workflows/first-workflow.yaml.

Start hdrctl serve --workspace D:\hydra-projects to keep every project in a folder of your choice instead of the default workspace.

A new project also gets a workflows/thread.yaml file once it has a workflow. It orders the project's workflows and is explained in the Orchestration block.

A project is a folder and a workflow is a file. The files are the source of truth: open workflows/first-workflow.yaml on disk if you doubt what Studio shows.

Draft describes the workflow file (no nodes yet), and never run describes its history. Neither means the workflow is invalid.

#### What should I have at the end?

VerificationExpected result

Project listContains studio-course

Project detailShows its disk path

Workflow countReads 1 workflow

Workflow cardfirst-workflow, trigger Manual, badge Draft

EditorOpens on 0 nodes · 0 edges

Overview statisticsRead as live workspace values, not constants

#### What if something goes wrong?

SymptomCauseFix

Create button stays disabledThe required name is emptyEnter a non-blank project or workflow name

Project path is unexpectedNo parent directory was selectedUse Browse when a specific parent is required

Opening an arbitrary folder failsOpen a project requires Hydra structureCreate the project in Studio or open a folder already containing jobs/workflows

New workflow does nothingThe API is unreachable, so nothing can be written to diskCheck the top-bar indicator reads API online, and see the next lesson

The palette shows Jobs (0)No job exists in the project yetExpected at this point — jobs arrive in lesson 9

#### Frequently asked questions

##### Where does Hydra Studio store a new project?

In the default workspace folder, ~/hydra-workspace, unless you chose a parent folder in the dialog or started hdrctl serve --workspace with another one. A project created with the name studio-course holds .hydra, Data, environments, jobs, outputs, scripts and workflows.

##### What is the difference between a project and a workflow?

A project is a folder that groups everything for one data topic. A workflow is a YAML file inside workflows/ that orders jobs and actions. Studio runs a workflow, never a whole project.

##### Which trigger should I choose for a new workflow?

Manual while you design. Choose Schedule (cron) for recurring loads (a cron value is then required) and Webhook when another system must start the run. You can change the trigger later from the workflow card.

##### Can I use a project created outside Studio?

Open a project accepts a folder that already follows the Hydra structure, so a project you built outside Studio opens too. The Hydra CLI then runs it from the terminal. The Hydra Playground lets you explore a job without installing anything, and crontab.guru helps you write the cron expression of a scheduled workflow.

#### Related lessons

Check the Hydra Studio API connection

Recognize nodes, ports and edges

Turn your jobs into an ordered workflow

Serve the Hydra API

#### Next lesson

The workspace exists, holds a workflow and opens on a canvas. Before designing anything on it, the next lesson verifies the top-bar connection indicator and the backend health route that supplies every value you have just read.

Check the API →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Check the Hydra Studio API connection (API online or offline) — slug: /studio/02-check-the-api/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons03 · Check the API▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 3

Lesson 3 of 65 · Check the API

### Check the Hydra Studio API connection (API online or offline)

Read the API indicator in the Hydra Studio top bar, prove the Hydra ETL backend is answering, and know what to do when it is not.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 on Linux and Windows, Python 3.13

API onlineabout 7 minutesneeds Hydra ETL 0.22 with the server extra

Quick answer
Hydra Studio shows API online in the top bar when the Hydra ETL backend answers its health check, which Studio repeats every 5 seconds. To check it yourself, open http://127.0.0.1:5678/api/health: a running backend returns HTTP 200 and JSON with "status":"ok". If the label says API offline, start the backend with hdrctl serve.

#### What does the API indicator in Hydra Studio mean?

Hydra Studio is a browser application. Project lists, workflow files, runs, node metadata and folder pickers all come from the Hydra ETL backend, a FastAPI service started by hdrctl serve. The indicator at the right of the top bar reports whether that service answers.

LabelMeaning

…The first health check has not finished yet.

API online (green)The last health check succeeded.

API offline (red)The last health check failed: the backend is stopped or unreachable.

Hydra ETL here means the open-source declarative ETL engine (hydra-etl on PyPI, command hdrctl), not Meta's Hydra configuration library or the PostgreSQL extension of the same name.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra: pip install "hydra-etl[server]" (on Windows, py -m pip install "hydra-etl[server]"). Without the extra, hdrctl serve stops with uvicorn is not installed.

The project from lesson 2, Create a project.

#### How do I check the Hydra Studio API connection?

##### 01Start the backend and Studio with one command

###### Actions

Open a terminal.

Run hdrctl serve.

Open the address it prints.

hdrctl serve

What you should see
The banner ends with the address of Studio, the API and the interactive API documentation. Hydra ETL 0.22.0 serves the visual editor and the API from the same port, so there is a single process to run.

Hydra Studio is ready. Open this address in your browser:

http://127.0.0.1:5678

API http://127.0.0.1:5678/api
Docs http://127.0.0.1:5678/docs

Press CTRL+C to stop.

##### 02Read the top-bar indicator

###### Actions

Look at the right side of the top bar.

Wait a moment for the ellipsis to resolve.

What you should see
A successful health check renders the green label; a failed one renders the red label. The two states differ by more than a word: compare what the page still holds in each case.

[image: Hydra Studio top bar in the light theme with the API online indicator in green, next to the theme switcher and the notification bell.]

API online (light theme). The green label means the last health check succeeded.

[image: Hydra Studio top bar in the dark theme with the API offline indicator in red after the backend stopped answering.]

API offline (dark theme). The red label means the last health check failed.

[image: Hydra Studio Overview page in the dark theme with the API online: the project list is loaded and the statistics panel shows the number of projects.]

Online. The Overview lists the projects and the statistics come from the backend.

[image: Hydra Studio Overview page in the light theme with the API offline: the sidebar still renders, but the project list shows only a spinner and the statistics read zero.]

Offline. Same sidebar, but no project data: the list never loads and the statistics read 0.

Note what survives an outage: the sidebar and the routes are part of the page already loaded in your browser, so they keep working. Everything that needs data (the canvas, the project list, the runs) does not. A page that renders is not a page that is connected.

##### 03Call the health route yourself

###### Actions

Open a second terminal while hdrctl serve is running.

Pick the command for your shell.

Read the response.

###### Linux · macOS bash

curl -s http://127.0.0.1:5678/api/health

-s hides the progress meter. Use curl -i to print the status line and headers, or pipe the body into jq to format it.

###### Windows Command Prompt

curl http://127.0.0.1:5678/api/health

curl.exe ships with Windows 10 and later. Only the body is printed; add -i to see the status line.

###### Windows PowerShell

Invoke-RestMethod http://127.0.0.1:5678/api/health | Format-List

message : Hydra ETL API is running
status : ok
version : 0.22.0
dsl_version : 1.0
studio : bundled
studio_build : index-DCU4tAca.js

In PowerShell, curl is an alias of Invoke-WebRequest, so it does not behave like the Unix tool. Invoke-RestMethod parses the JSON for you; call curl.exe explicitly if you want the Unix behavior.

What you should see
HTTP 200 and a JSON object. Hydra ETL 0.22.0 returned exactly this body in our test; the version and studio_build values change with your installation.

{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0","studio":"bundled","studio_build":"index-CxM6JVFV.js"}

The green label in the top bar is only the rendering of this response.

##### 04Stop the backend and watch the label change

###### Actions

Press Ctrl+C in the terminal running hdrctl serve.

Run the same curl command again.

Look at the top bar after a few seconds, then start hdrctl serve again.

What you should see
The request is refused (the message below is the Linux one), and within about five seconds Studio switches to API offline. When the backend is back, the label returns to API online by itself; no reload is needed.

curl: (7) Failed to connect to 127.0.0.1 port 5678 after 0 ms: Couldn't connect to server

##### 05Know the "New Studio version" button

When you upgrade Hydra ETL while a Studio tab is open, the tab keeps running the old interface. Studio compares the build it is running with the one reported by studio_build in the health response. If they differ, a yellow New Studio version — reload button appears in the top bar. Click it, or press Ctrl+F5.

###### Tips and tricks

http://127.0.0.1:5678/docs opens the interactive API documentation generated by the backend. It lists every route Studio calls, including /api/health.

Use hdrctl serve --port 5679 to run a second instance next to the first. Studio and the API always share the port you choose.

hdrctl serve --no-studio starts the API only. The health response then reports "studio":"disabled".

Keep the address 127.0.0.1 unless you must reach Studio from another machine: --host changes the listen address, and the API then answers on the network.

A page that renders is not a connected page. Check the label, not the layout.

If you work on the Studio sources themselves, the development server runs on port 5173 and proxies /api to 5678. Test port 5678 first: if it answers and 5173 does not, the problem is the development server, not Hydra ETL.

#### What does the checklist look like?

VerificationExpected result

Top barShows API online

/api/healthHTTP 200 and "status":"ok"

VersionThe version field matches the one you installed

Backend stoppedcurl exits with code 7 and the label turns red within about 5 seconds

#### What if Hydra Studio says API offline?

SymptomCauseFix

API offline in the top barThe backend process is stopped or unreachableStart hdrctl serve and check that the terminal still runs it

uvicorn is not installed. Run: pip install "hydra-etl[server]"Hydra ETL was installed without the server extraRun pip install "hydra-etl[server]" (Windows: py -m pip install "hydra-etl[server]")

curl: (7) Failed to connectNothing listens on that portStart hdrctl serve, or use the port you passed with --port

The page loads but shows no dataThe page comes from your browser; only the data comes from the backendRead the top-bar label, then call /api/health

curl prints an object, not JSON (PowerShell)curl is an alias of Invoke-WebRequestCall curl.exe explicitly, or use Invoke-RestMethod

Yellow New Studio version — reload buttonThe tab runs an older interface than the one servedClick the button or press Ctrl+F5

#### Frequently asked questions

##### What port does Hydra Studio use?

Hydra ETL 0.22.0 serves Studio and the API on port 5678 by default, at http://127.0.0.1:5678. Change it with hdrctl serve --port. See the serve command reference.

##### How often does Studio check the API?

Studio repeats the health check every 5 seconds and does not retry a failed request inside a cycle, so the label follows the backend within about five seconds.

##### Why is the Studio page blank or empty while the sidebar works?

The sidebar belongs to the page already loaded in the browser. Data comes from the backend, so an offline API leaves the shell visible and the canvas empty. Start hdrctl serve, then refresh.

##### Can I check the API without opening Studio?

Yes. curl http://127.0.0.1:5678/api/health works from any terminal. The interactive documentation at /docs is generated by FastAPI; the curl manual lists its options, and Invoke-RestMethod is the PowerShell equivalent.

#### Related lessons

Create a project and its first workflow

Recognize nodes, ports and edges

Four ways to run a job

Serve the Hydra API

#### Next lesson

Studio and the backend now agree, and you can tell a rendering problem from a connection problem. The tour of the Studio pages is coming soon; the next written lesson reads the canvas: the node and edge counts, the ports and their direction.

Read the canvas →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Read the Hydra Studio canvas: nodes, ports and edges — slug: /studio/03-read-the-canvas/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons05 · Read the canvas▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 5

Lesson 5 of 65 · Read the canvas

### Read the Hydra Studio canvas: nodes, ports and edges

Take a guided tour of first-workflow without changing anything: two jobs, the line each one draws from source to destination, and the YAML behind them.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Jobs configurationabout 15 minutesAPI online

Quick answer
The Hydra Studio canvas has two scenes: Jobs configuration, where one job runs from source to destination, and Workflow configuration, where jobs and actions form a graph. Edges leave a right handle and enter a left one, and the counters beside the name tell you how many nodes and edges the open scene holds.

#### What will you learn in this lesson?

##### Goal

Open first-workflow and read everything it holds without editing it: the two scenes, the two jobs, the dialog of a node, and the YAML each scene produces.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Why this matters

One screen hosts two different graphs. Confusing them is the most common beginner mistake: connector nodes belong inside a job, while Job and Action nodes belong to orchestration. Reading before editing makes the next lessons quick.

##### What you are looking at

PieceWhere it livesWhat it does

first-jobJobs configurationReads orders.csv, keeps five columns and the paid rows, writes paid_orders.csv

second-jobJobs configurationReads that output, keeps three columns, writes paid_summary.csv

first-workflowWorkflow configurationRuns first-job, then second-job

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A studio-course project holding first-workflow with first-job and second-job, the state reached in lesson 12. Reading it now is a preview of what lessons 5 to 7 build.

#### How do I read the Hydra Studio canvas?

##### 01Read the workflow graph

###### Objective

Identify the two nodes, the edge between them, and what the toolbar offers.

###### Actions

Open first-workflow and select the Workflow configuration tab.

Read the counters beside the workflow name.

Read the palette categories on the left.

Workflow configuration

Each node is a step of the workflow, here a Job node. The edge runs from the right handle of first-job to the left handle of second-job: the second job waits for the first. The toolbar is that of orchestration: Import, Rollback, Hydra DSL and Run Workflow.

What you should see
Two nodes, one edge, Valid. The palette lists Actions (9), Control Flow (2), Containers (3) and Jobs (2).

first-workflow 2 nodes · 1 edge Valid
first-job → second-job

[image: The Workflow configuration scene of Hydra Studio: first-job connected to second-job, with the palette of Actions, Control Flow, Containers and Jobs on the left.]

The workflow scene: orchestration, not data.

##### 02Open the first job

###### Objective

Switch scenes and read a job as a straight line from source to destination.

###### Actions

Select the Jobs configuration tab.

Pick first-job in the tab bar at the bottom.

Read the counters, then the node labels from left to right.

Jobs configuration → first-job

The palette changes with the scene: Sources, Transformations and Destinations replace Actions and Jobs, because those have no meaning inside a job. The line reads src_orders (a CSV source), select, filter and dest_paid (a CSV destination).

What you should see
Four nodes in a row and three edges. The tab bar lists the jobs of the project, one tab each.

first-workflow / first-job 4 nodes · 3 edges Valid
src_orders → select → filter → dest_paid

[image: The Jobs configuration scene of Hydra Studio showing first-job: src_orders, select, filter and dest_paid connected from left to right.]

first-job: four nodes, three edges.

[image: The bottom tab bar of Hydra Studio with two tabs, first-job and second-job, and the plus button.]

One tab per job.

##### 03Open the second job

###### Objective

Confirm the shape repeats, and see how the jobs connect.

###### Actions

Select second-job in the tab bar.

Read the three nodes and the two edges.

Jobs configuration → second-job

The same source, transformation, destination line. Its source src_paid_orders reads the file the first job wrote, paid_orders.csv. That shared file, and the edge in the workflow, are what tie the two jobs together.

What you should see
Three nodes and two edges. Each job is independent: its own folder, manifests and canvas.

first-workflow / second-job 3 nodes · 2 edges Valid
src_paid_orders → select → dest_summary

[image: The Jobs configuration scene showing second-job: src_paid_orders, select and dest_summary connected from left to right.]

second-job: three nodes, two edges.

##### 04Read what a node is configured with

###### Objective

Open nodes of each kind and see that each holds only what its role needs.

###### Actions

Double-click the select node of first-job, read it, then close the dialog.

Do the same with filter and with the destination dest_paid.

Close each dialog without saving.

double-click a node → read → Cancel

Every dialog shows the same frame: a step name you choose, the fields its node type requires, and a node ID. The name is what appears in the YAML. The dialog changes nothing until you save.

What you should see
No dialog asks for anything it does not need: the form is the contract.

SELECT step name · columns · node ID
FILTER step name · expression · node ID
CSV DESTINATION step name · file path · location · node ID

[image: The Select dialog of Hydra Studio with its step name, columns and node ID.]

Select: the columns kept.

[image: The Filter dialog of Hydra Studio with its step name and expression.]

Filter: one expression.

[image: The CSV destination dialog of Hydra Studio with its step name, file path, location and node ID.]

CSV destination: a path.

##### 05Read the DSL a job produces

###### Objective

Connect what you read on screen to the four files on disk.

###### Actions

With a job open, select Hydra DSL in the top bar.

Walk through the tabs in order: Sources, Transformations, Destinations, Pipeline.

Close the panel.

Jobs configuration → Hydra DSL

A job is not one file but four, and the panel gives one tab to each. Read in this order, the job explains itself: where the data comes from, what happens to it, where it goes, and how the three are wired. In first-job the pipeline names identifiers, not paths: from: src_orders, to: dest_paid.

What you should see
One tab per manifest, with the YAML of the open job.

sources: src_orders → type csv, extract table
transformations: steps → select, then filter
destinations: dest_paid → type csv, load table
pipeline: from: src_orders to: dest_paid

[image: The Sources tab of the Hydra DSL panel.]

Sources.

[image: The Transformations tab of the Hydra DSL panel.]

Transformations.

[image: The Destinations tab of the Hydra DSL panel.]

Destinations.

[image: The Pipeline tab of the Hydra DSL panel.]

Pipeline.

##### 06Read the workflow the canvas describes

###### Objective

See the whole orchestration as one file, and find each thing you read on screen inside it.

###### Actions

Switch to Workflow configuration and select Hydra DSL.

Compare each name with a node on the canvas.

Compare depends_on with the edge.

hdrctl workflow validate first-workflow

Two steps, in the order the graph imposes: first-job starts alone and second-job waits for it.

version: "1.0"
workflow:
name: first-workflow
trigger:
type: manual
steps:
- name: first-job
type: job
job: ../jobs/first-job
depends_on: []
on_failure: fail
- name: second-job
type: job
job: ../jobs/second-job
depends_on:
- first-job
on_failure: fail

On the canvasIn the file

A nodean entry under steps

An edgea name inside depends_on

A Job nodetype: job and a job path

An Action nodetype: action, its action and its params

Containers
The palette also offers three containers (Sequence, Error Scope and Retry Scope). They group nodes on screen and apply a policy to their children; lesson 13 covers them.

What you should see
The step count matches the number of nodes. The command confirms the file.

Workflow valid — no errors detected.

[image: The Hydra DSL panel open on the workflow scene, showing workflow.yaml.]

Hydra DSL in the workflow scene.

###### Tips and tricks

Sources and transformations live in Jobs configuration. Jobs and actions live in Workflow configuration. Only Containers appear in both palettes.

An edge leaves a right handle and enters a left handle, so direction is never ambiguous.

Read before you edit: double-click a node, read it and press Cancel. The dialog changes nothing until you save.

Counters count nodes, not steps: containers are nodes on the canvas but never steps of the workflow.

#### What should I have at the end?

VerificationExpected result

Workflow counters2 nodes · 1 edge for two job steps

Scene switchThe palette changes with the tab

Job countersfirst-job reads 4 nodes · 3 edges and second-job 3 nodes · 2 edges

Workflow filehdrctl workflow validate first-workflow reports Workflow valid

#### What if something goes wrong?

SymptomCauseFix

The palette has no SourcesYou are on Workflow configurationSwitch to Jobs configuration

No Actions in the paletteYou are inside a jobActions belong to orchestration; switch scenes

An edge refuses to connectYou started from a left handleDrag from a right handle to a left one

The top bar does not say API onlinehdrctl serve is not runningSee lesson 3, Check the API

#### Frequently asked questions

##### What is the difference between Jobs configuration and Workflow configuration?

Jobs configuration shows one job as a line from source to destination, with the palette of Sources, Transformations and Destinations. Workflow configuration shows the orchestration graph of jobs and actions, with the palette of Actions, Control Flow, Containers and Jobs.

##### Which way do edges point in Hydra Studio?

An edge leaves the right handle of one node and enters the left handle of another, so a graph reads from left to right. In workflow.yaml an edge becomes a name inside depends_on.

##### What do the counters beside the name mean?

They count the nodes and the edges of the open scene, and a Valid or error status follows. In our course project the workflow reads 2 nodes · 1 edge, first-job reads 4 nodes · 3 edges and second-job 3 nodes · 2 edges.

##### Where do I see the YAML behind the canvas?

Select Hydra DSL in the top bar. It shows workflow.yaml in the workflow scene and the four manifests of the job in the job scene.

#### Related lessons

Create a project in Hydra Studio

Use the palette

Read the YAML Studio generates

Compose jobs in a workflow

#### Next lesson

You can now read a workflow without touching it. The next lesson opens the node palette properly: what each category holds, what the counts mean, and how to find the node you need.

Use the palette →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra Studio node palette: sources, transformations, destinations and actions — slug: /studio/04-use-the-palette/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons06 · Use the palette▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 6

Lesson 6 of 65 · Use the palette

### Hydra Studio node palette: sources, transformations, destinations and actions

The palette is not a list of icons. It is the complete vocabulary of the product: thirteen sources, twenty transformations, ten destinations, nine actions, two control-flow nodes, three containers — and your own jobs.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 on Windows

Node paletteabout 20 minuteseditor open

Quick answer
The Hydra Studio palette follows the scene. Jobs configuration offers 13 sources, 20 transformations and 10 destinations; Workflow configuration offers 9 actions, 2 control-flow nodes and your own jobs. Containers appear in both. If a task has a node, this panel lists it.

#### What will you learn in this lesson?

##### Goal

Open both palettes, read every category, and leave knowing what Hydra can do without writing a line of YAML. By the end you should be able to answer one question for any task: is there a node for this, and in which scene does it live?

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A workflow open in the editor.

#### How do I read the Hydra Studio node palette?

##### 01Discover the palette

###### Objective

See that there are two catalogues, not one, and read what each offers.

###### Actions

Open the Workflow configuration tab and read the four categories.

Switch to Jobs configuration and read them again.

Note the number beside each category name.

Workflow configuration ⇄ Jobs configuration

The palette follows the scene. Orchestration offers what a workflow can do; a job offers what data can go through. Nothing is hidden — what a scene does not show, it cannot do.

[image: The node palette in the workflow scene, showing four collapsed categories: Actions, Control Flow, Containers and Jobs, each with a count.]

Workflow scene. Actions, Control Flow, Containers, Jobs.

[image: The node palette in the job scene, showing four collapsed categories: Sources, Transformations, Destinations and Containers.]

Job scene. Sources, Transformations, Destinations, Containers.

What you should see
Only Containers appears in both. Every other category belongs to one scene and one only.

Workflow Actions (9) Control Flow (2) Containers (3) Jobs (2)
Job Sources (13) Transformations (20) Destinations (10) Containers (3)

##### 02Read what a workflow can do

###### Objective

Discover that a workflow is not limited to running jobs.

###### Actions

Expand Actions.

Read the nine entries from top to bottom.

Leave it expanded for the next steps.

Actions (9)

This is where a data pipeline becomes an operational one. A job moves rows; an action tells someone, calls something, runs a command, or remembers a value.

ActionWhat it does

LogWrites a message to the run log. Always succeeds.

WebhookSends an HTTP request — notify a service, trigger a build.

EmailSends a message when a load finishes or fails.

Bash · PowerShellRuns a shell command on the host that carries Hydra.

PythonRuns Python — inline or a .py file. Works on every platform.

SSHRuns a command on another machine.

Set Param · Assign ParamCreate and update values that later steps can read.

What you should see
Nine entries, one of them dimmed. That dimming is the subject of the next step.

[image: The Actions category expanded in the workflow palette (light theme): Log, Webhook, Email, Bash (Unix, dimmed on Windows), PowerShell (Win), Python, SSH, Set Param and Assign Param.]

Nine actions. Bash is greyed out here, and it carries a badge.

##### 03Tell someone, or tell something

###### Objective

Meet the three actions that carry news out of the workflow.

###### Actions

Open Log and read its subtitle.

Open Webhook and read the method list.

Open Email and note which fields carry a red asterisk.

Actions → Log · Webhook · Email

These three answer the same question — who needs to know? — at three distances. Log speaks to whoever reads the run afterwards. Webhook speaks to another system. Email speaks to a person who is not watching.

ActionRequiredWorth knowing

LognothingThe only action that always succeeds. Safe to place anywhere, including after a failure.

Webhooka URLPOST by default, with a JSON body. Choose another method from the list when the service expects one.

Emailrecipient and subjectSends over SMTP. The server, port and credentials belong to the step, so each workflow can use its own.

[image: The Log action dialog, whose subtitle states that it writes a message to the run logs and always succeeds, with a free-text message field.]

Log. Even the message is optional — the step is a marker as much as a sentence.

[image: The Webhook action dialog, described as an outgoing HTTP call, with a required URL, a method list set to POST and a JSON body field.]

Webhook is the outgoing HTTP call — not to be confused with the incoming webhook trigger.

[image: The Email action dialog, with required recipient and subject fields and a body.]

Email. Recipient and subject are required; the body is not.

What you should see
Three subtitles that say exactly what each one does, and no more.

Log ACTION Writes a message to the run logs (always succeeds)
Webhook ACTION Outgoing HTTP call
Email ACTION Send email

##### 04The palette knows which machine it runs on

###### Objective

Read the platform badges, and understand why one shell is always unavailable.

###### Actions

Find Bash and PowerShell in the list.

Read the badge on the right of each: Unix or Win.

Note which of the two is dimmed.

Actions → Bash · PowerShell

Hydra runs the command on the machine that hosts it, so only one of the two shells can ever work. The palette does not hide the other — it shows it, dimmed, with the platform it needs. You always know the whole vocabulary, and what your host is missing.

[image: The Actions category expanded in the workflow palette (light theme): Log, Webhook, Email, Bash (Unix, dimmed on Windows), PowerShell (Win), Python, SSH, Set Param and Assign Param.]

Hydra on Windows. PowerShell is available, Bash is dimmed.

Trap
Hydra never substitutes one shell for the other. A workflow carrying a PowerShell step fails on Linux, and a Bash step fails on Windows. If a workflow must run on both, use Python instead: it is the only interpreter available everywhere.

What you should see
On Windows, Bash is dimmed and cannot be dragged, while PowerShell is active. On Linux or macOS the pair is reversed. Every other action shares the same frame: on failure, run condition and a step name.

##### 05Run Python, on any host

###### Objective

Find the one interpreter that never depends on the platform, and its two ways of receiving code.

###### Actions

Open the Python action.

Select Inline script and read the editor.

Select .py file and read the fields that replace it.

Actions → Python → Inline script | .py file

Python carries no platform badge, because there is nothing to warn about: it runs on Windows, Linux and macOS alike. Where a shell action ties a workflow to one host, this one keeps it portable — which is why it is the answer whenever a workflow has to travel.

ModeWhat you provideWhen to choose it

Inline scriptThe code, typed in the dialogA few lines that belong to this workflow and nowhere else. Everything stays in one file.

.py fileA path, plus a working directoryReal code — one you test, review and version separately. The workflow references it instead of copying it.

[image: The Python action dialog in Inline script mode, with a code editor holding an import of sys and a print of the version.]

Inline script. The code lives in the workflow file itself.

[image: The same Python action switched to .py file mode, showing a required file path with a Browse button and a working directory.]

.py file. The editor gives way to a path and a working directory.

What you should see
One toggle, two shapes, the same action. Parameters set earlier reach the script as environment variables, so you rarely need to hard-code a value.

Python ACTION Runs a Python script
Inline script → PYTHON SCRIPT *
.py file → .PY FILE PATH * WORKING DIRECTORY

##### 06Reach outside the machine, and carry values across steps

###### Objective

Meet the three actions that make a workflow more than a sequence of loads.

###### Actions

Open SSH and read the fields it requires.

Open Set Param, then Assign Param.

Compare the two subtitles word for word.

Actions → SSH · Set Param · Assign Param

SSH runs a command on another machine — restart a service, move a file, trigger a job on a server Hydra does not live on.

Set Param creates a value; Assign Param changes one that already exists. The distinction is deliberate: creating twice is a mistake, and Hydra refuses it rather than overwriting something you forgot about. Later steps read the value with {{ param:name }}, and shell and Python actions also receive it as an environment variable.

[image: The SSH action dialog, requiring a host, a port defaulting to 22 and a user.]

SSH. Host and user are required; the port defaults to 22.

[image: The Set Param dialog, whose subtitle reads that it creates a runtime parameter and fails if it already exists, with a parameter name, a value and a type.]

Set Param creates — and fails if the name already exists.

[image: The Assign Param dialog, whose subtitle reads that it assigns a value to an existing runtime parameter.]

Assign Param updates a parameter that already exists.

What you should see
Two dialogs that look alike and mean the opposite. Read the subtitle, not the shape.

Set Param Creates a runtime parameter (fails if it already exists)
Assign Param Assigns a value to an existing runtime parameter

##### 07Steer the graph, and group what it holds

###### Objective

Find the two categories that shape execution rather than perform it.

###### Actions

Expand Control Flow and read its two entries.

Expand Containers in the workflow scene.

Switch to Jobs configuration and expand Containers there too.

Control Flow (2) · Containers (3)

Condition evaluates an expression and lets downstream steps decide whether to run; Delay simply waits. Containers do not execute at all — they group nodes and hand a policy down to whatever they enclose.

[image: The Control Flow category expanded, showing Condition and Delay.]

Control Flow. Two entries, and both change when things run rather than what runs.

[image: The Containers category expanded in the workflow palette (dark theme): Sequence Container, Error Scope and Retry Scope.]

Containers, workflow scene. Sequence, Error Scope, Retry Scope.

[image: The same three containers offered in the job scene, below Sources, Transformations and Destinations.]

Containers, job scene. The same three — this is the only category shared by both.

What you should see
Three containers in both scenes, and the same names. Their effect differs: in a workflow they write a policy onto steps, in a job they only tidy the canvas.

Control Flow Condition Delay
Containers Sequence Container Error Scope Retry Scope

##### 08Your own jobs become palette entries

###### Objective

See that the palette is not fixed — it grows with the project.

###### Actions

Expand Jobs in the workflow scene.

Read the names listed there.

Look at the tab bar at the bottom of the job scene.

Jobs (2)

Every job you design in this project appears here, ready to be dropped into any workflow. That is what makes a job reusable: written once in Jobs configuration, orchestrated as many times as needed. The count is the size of your own library, not a product limit.

[image: The Jobs category expanded in the workflow palette, listing first-job and second-job.]

The two jobs of the project, offered as nodes.

[image: The job tab bar at the bottom of the editor, with a tab per job and a plus button to add one.]

The tab bar switches between jobs. + creates one, and it joins the palette.

What you should see
The job names you created, nothing else. An empty project shows Jobs (0) and says so in plain words.

Jobs (2)
first-job
second-job

##### 09Read the connectors, in and out

###### Objective

Learn what Hydra can read from and write to, and spot the one asymmetry.

###### Actions

In Jobs configuration, expand Sources.

Expand Destinations.

Compare the two lists entry by entry.

Sources (13) · Destinations (10)

Ten connectors work in both directions: three file formats and seven databases or warehouses. Three sources read only: Web API, PostgreSQL CDC and MySQL CDC. Hydra pulls from an HTTP endpoint but does not push to one. To send data out over HTTP, use the Webhook action in the workflow scene instead.

[image: The Sources category expanded in the Jobs configuration palette (light theme), listing the thirteen sources from CSV to Web API.]

Sources. Three file formats, three databases, one HTTP API.

[image: The Destinations category expanded, listing CSV, JSON, Parquet, MySQL, PostgreSQL and MongoDB.]

Destinations. The same six, without Web API.

What you should see
Thirteen on the way in, ten on the way out. The three missing ones are not an oversight.

Sources CSV JSON Parquet MySQL PostgreSQL SQL Server SQLite PostgreSQL CDC MySQL CDC Snowflake BigQuery MongoDB Web API
Destinations CSV JSON Parquet MySQL PostgreSQL SQL Server SQLite Snowflake BigQuery MongoDB

##### 10Twenty ways to reshape data

###### Objective

Read the full transformation list once, so you stop reinventing what already exists.

###### Actions

Expand Transformations.

Scroll to the end of the list.

Note the last entry, Script.

Transformations (20)

They fall into four families. Knowing which family you need is usually faster than remembering a name.

FamilyOperations

ChooseFilter · Select · Deduplicate

ChangeRename · Cast · Derive · Fill Null · Trim · Clean · Window

ReshapeSort · Aggregate · Pivot · Unpivot · Transpose · Text to Rows

CombineJoin · Merge · Union

[image: The Transformations category expanded, showing Filter, Select, Rename, Cast, Aggregate, Sort, Deduplicate, Derive and Join.]

The first nine.

[image: The rest of the transformation list, showing Fill Null, Trim, Clean, Pivot, Unpivot, Transpose, Merge, Union and Script.]

And the last nine, ending on Script.

What you should see
Nineteen named operations, then one that is not an operation at all.

Filter Select Rename Cast Aggregate Sort Deduplicate Derive Join Fill Null
Trim Clean Pivot Unpivot Transpose Merge Union Text to Rows Window Script

##### 11Write the transformation that does not exist

###### Objective

Find the way out when none of the nineteen operations fits.

###### Actions

Drop a Script node onto the job canvas.

Read the two execution modes.

Use Preview to run it against real rows before saving.

Transformations → Script

Every declarative tool eventually meets a rule its authors did not foresee. Hydra answers with Script: you declare which columns come in and which go out, then write Python between the two. The contract stays readable in the YAML even though the logic is code.

Execution modeWhat your code receivesWhen to choose it

VectorizedEach input column as a pandas SeriesThe default. Operates on whole columns, so it stays fast on large volumes.

Row-by-rowEach input column as a single valueEasier to reason about, much slower. Keep it for genuinely per-row logic.

What you should see
np, pd, math and re are available, and Ctrl Space completes as you type. Preview runs the code on real rows so you find out here, not during a run.

[image: The Script transformation dialog, offering a Vectorized or Row-by-row execution mode, a Python code editor with Preview and Expand buttons, and a note listing the available libraries.]

A custom transformation, declared like any other node — and testable before it is saved.

##### 12Give the canvas room

###### Objective

Recover screen space once you know where everything is.

###### Actions

Select the < control at the top right of the palette.

Work on the canvas with the palette collapsed.

Select it again to bring the panel back.

NODE PALETTE → ‹

Collapsed, the palette keeps its icons: you can still drag a node onto the canvas without giving up the width. The vertical toolbar beside it stays put in both states — pan, select, undo, redo, minimap and terminal.

What you should see
The panel narrows to a strip of icons. Nothing is lost, and the canvas gains a third of the window.

[image: The vertical canvas toolbar beside the palette, with pan, select, undo, redo, minimap and terminal controls (dark theme).]

The toolbar beside the palette belongs to the canvas, not to the palette — it stays whatever the panel does.

###### Tips and tricks

Sources and transformations live in Jobs configuration. Jobs and actions live in Workflow configuration.

Collapse the palette to a column of icons: they stay draggable and give the canvas more room.

To send data out over HTTP, use the Webhook action. Web API is a source only.

A dimmed shell action is a platform badge, not a bug: Bash is for Linux and macOS, PowerShell for Windows. Use Python for a portable step.

Set Param fails when the parameter already exists. Use Assign Param to change an existing value.

#### What should I have at the end?

VerificationExpected result

Workflow paletteActions, Control Flow, Containers, Jobs

Job paletteSources, Transformations, Destinations, Containers

Shared categoryContainers, and it alone

Platform badgesOne shell active, the other dimmed

ConnectorsThirteen in, ten out — Web API and the two CDC sources read only

TransformationsTwenty, the last one being Script

Jobs categoryLists the jobs of this project

CollapseIcons remain, and stay draggable

#### What if something goes wrong?

SymptomCauseFix

No Sources in the paletteYou are in the workflow sceneSwitch to Jobs configuration

No Actions in the paletteYou are inside a jobActions orchestrate; switch to Workflow configuration

Bash or PowerShell cannot be draggedYour host does not provide that shellUse the other one, or Python for portability

Jobs (0) in the paletteThe project has no job yetCreate one from the tab bar in Jobs configuration

No HTTP destinationWeb API is a source onlySend data out with the Webhook action

Set Param fails at runtimeThe parameter already existsUse Assign Param to change an existing value

#### Frequently asked questions

##### How many sources, transformations and destinations does Hydra Studio offer?

In Hydra ETL 0.22 the job palette lists 13 sources, 20 transformations and 10 destinations. The workflow palette lists 9 actions, 2 control-flow nodes, 3 containers and the jobs of the project.

##### Which sources have no matching destination?

Web API, PostgreSQL CDC and MySQL CDC are sources only. The other ten connectors work in both directions.

##### Why is Bash or PowerShell dimmed in the palette?

Each shell action is tied to an operating system. Bash runs on Linux and macOS, PowerShell on Windows, and the other one is dimmed on your host.

##### What if no transformation fits my rule?

Use the Script transformation: you declare the input and output columns and write the Python in between. It can run vectorized on whole columns or row by row.

#### Related lessons

Read the Hydra Studio canvas

Create a job and add a source

Add a transformation

Add a destination

#### Next lesson

You now know the whole vocabulary and where each word lives. The next lesson puts it to use: dragging a source onto the canvas and pointing it at a real file.

Add a source →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Create a job in Hydra Studio and add its source — slug: /studio/05-add-a-source/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons08 · Create a job▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 9

Lesson 9 of 65 · Add a source

### Create a job in Hydra Studio and add its source

A job is four manifests in a folder. Studio writes them for you from the canvas, and the first node you place is the source.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Sourcesabout 20 minutesan open workflow with no job yet

Quick answer
To create a job in Hydra Studio, open Jobs configuration and press + at the bottom left of the canvas. Studio adds a job named job1 and an empty canvas; rename it, then drag a source such as CSV onto the canvas and fill its required fields until the red badge clears.

#### What will you learn in this lesson?

##### Goal

Create a job named first-job, see it appear in the workflow palette, place a CSV source and configure it, then read how a database source and a Web API source differ.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### What a job is

A job is not a file: it is a folder holding four manifests, and it is complete only when all four exist.

ManifestAnswers

sources.yamlWhere does the data come from?

transformations.yamlWhat happens to it along the way?

destinations.yamlWhere does it go?

pipeline.yamlWhich source feeds which destination?

You can write the four by hand and hdrctl will run them; Studio offers the other route and writes the same files. Neither is more legitimate.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A studio-course project with first-workflow open and no job yet. If you start from a project that already holds jobs, the steps are the same: your new tab sits next to the existing ones.

#### How do I create a job and add a source in Hydra Studio?

##### 01Create a job

###### Objective

Add a job to the project without leaving the canvas.

###### Actions

Open the Jobs configuration tab.

Find the + button at the bottom left, in the tab bar.

Press it. Studio creates a job named job1; there is no name prompt.

Jobs configuration → +

The new job opens on an empty canvas and the counter reads 0 nodes · 0 edges. At this point the job lives in the Studio editor: it is written to disk when you save. A job with no node is a valid, if idle, job.

What you should see
A new tab at the bottom, already selected, and an empty canvas beside the source palette.

job1 0 nodes · 0 edges

[image: Jobs configuration of a workflow with no job yet: an empty canvas, the source palette on the left and the tab bar with the plus button at the bottom.]

Before: no job yet.

[image: The bottom tab bar of Hydra Studio after pressing the plus button: a job1 tab is selected.]

After: a job1 tab.

##### 02Rename it, and know Archive from Delete

###### Objective

Give the job its real name, and learn how a job leaves the project.

###### Actions

Open the options menu of the tab, or double-click the tab.

Choose Rename, type first-job and press Enter.

Read the other two entries without choosing them.

Tab → options → Rename · Archive · Delete

Archive and Delete look alike and are not. This is what Studio 0.22.0 does, read from its code:

ActionWhat happensReversible

RenameThe tab takes the new name.—

ArchiveThe job folder is renamed <name>.backup, with a timestamp suffix if that name already exists. Every manifest survives.Yes: rename the folder back.

DeleteA confirmation asks whether to also delete the folder from disk (OK), or only remove the job from Studio (Cancel).Only if the folder was kept.

Trap
A job still placed on the workflow canvas cannot be archived or deleted. Studio shows Unable to archive…: remove it from the Workflow configuration canvas first. Remove the node, then archive.

What you should see
The tab and the breadcrumb both read first-job.

first-workflow / first-job 0 nodes · 0 edges

[image: The options menu of a job tab in Hydra Studio, listing Rename, Archive and Delete.]

The options menu: Rename, Archive, Delete.

[image: The job tab in rename mode with first-job typed in.]

Rename mode, before Enter.

[image: The job tab after renaming, now reading first-job.]

Renamed.

##### 03Find the job in the workflow palette

###### Objective

See that a job needs no registration to be reusable.

###### Actions

Switch to Workflow configuration.

Read the Jobs category of the palette.

Workflow configuration → Jobs

Every job you create joins the Jobs category by itself. Nothing registers it: the category lists what the project contains. That is what makes a job reusable, since you design it once and orchestrate it in as many workflows as you like.

What you should see
Jobs (1) with first-job under it.

Jobs (1)
first-job

[image: The workflow palette of Hydra Studio showing Jobs (1) with first-job listed under Actions, Control Flow and Containers.]

Jobs (1): first-job.

##### 04Drop a source, and read its warning

###### Objective

Place a node, and learn what Studio says about a node it cannot use yet.

###### Actions

Go back to Jobs configuration and keep first-job open.

Drag CSV from Sources onto the canvas.

Look at the top right corner of the node.

Sources → CSV → drag onto the canvas

A freshly dropped node carries a small red exclamation mark. It is not an error but an unanswered question: the type is chosen and the file to read is still missing. A single click opens a side panel on the node; a double-click opens its dialog.

What you should see
A node named after its type, a red badge, and the counter at 1 node · 0 edges.

source_csv_1
CSV (!)

[image: A CSV node dropped on the job canvas of Hydra Studio, with a red badge in its corner and its side panel open on the right.]

The badge stays until the required field is filled.

##### 05Configure the CSV source

###### Objective

Answer the only question a CSV asks.

###### Actions

Double-click the node.

Type data/orders.csv in the file path field, or use Browse.

Set Step name to src_orders, the name the next lessons use, then press Save.

double-click → file path → Save

One required field, and a Location set to local. The path is relative to the job folder. Prefer Browse to typing: it writes a path that exists, which removes the most common cause of a first run failing. Saved, the node becomes this entry of sources.yaml:

What you should see
The badge disappears and the node takes the step name you gave it. That name is the identifier pipeline.yaml will refer to.

sources:
src_orders:
type: csv
extract:
table: data/orders.csv
batch_size: 50000

[image: The CSV source dialog of Hydra Studio with the path data/orders.csv, Location set to local and the Node ID.]

The CSV dialog, before renaming the step.

##### 06Read a database source

###### Objective

Read a connection form, and learn where a password belongs.

###### Actions

Drag PostgreSQL onto a canvas, or use MySQL or MongoDB.

Double-click the node.

Read the Data source choice and the required fields.

Sources → PostgreSQL → Table | SQL query

A database asks more than a file, and the first choice shapes the rest. Table reads a whole table. SQL query lets the server filter and join before a row reaches Hydra, usually faster on a large table.

Never type a password here
Write ${ENV:MY_SECRET} and define the real value under Environments, in a .env file kept out of Git. A manifest is a file you commit, share and paste into a ticket.

What you should see
Required fields marked with a red asterisk: the table, the host, the database and the user. The host and port show the usual values as hints.

PostgreSQL SOURCE
DATA SOURCE Table | SQL query
TABLE * HOST * PORT 5432 DATABASE * USER * PASSWORD

[image: The PostgreSQL source dialog of Hydra Studio with the Table and SQL query choice, and the table, host, port, database and user fields.]

A database source: a connection and a table or a query.

##### 07Read an HTTP source

###### Objective

Read from a service instead of a file or a table.

###### Actions

Drag Web API onto a canvas.

Double-click the node.

Read the URL field and the Method list.

Sources → Web API → URL · Method

The URL is the only required field. The method defaults to GET, and the list also offers POST, PUT and DELETE: some services expect a POST to return a result, a search endpoint taking its criteria in the body for instance.

Web API reads, it never writes
There is no HTTP destination in the palette. To send data out over HTTP, use the Webhook action in the workflow scene.

What you should see
A short form, and a method list holding four entries.

Web API SOURCE
URL *
METHOD GET POST PUT DELETE

[image: The Web API source dialog of Hydra Studio with the URL field and the Method set to GET.]

The Web API source: a URL and a method.

###### Tips and tricks

Every job you create joins the Jobs category of the workflow palette by itself. You never register it anywhere.

Hydra ETL 0.22 offers 13 sources. Start with CSV: it needs only a path.

A node wears a red badge until its required fields are filled. A drawn node is not a configured node.

The new job lives in the editor until you save. Save before you close the tab.

Writing the four files by hand and designing them on the canvas produce the same folder.

#### What should I have at the end?

VerificationExpected result

JobA first-job tab, and Jobs (1) in the workflow palette

Source nodeA CSV node named src_orders with no red badge

Manifestsources.yaml holds src_orders of type csv

MenuRename, Archive, then Delete below a separator

#### What if something goes wrong?

SymptomCauseFix

No + buttonYou are in the workflow sceneSwitch to Jobs configuration; the button is at the bottom left

The badge stays after savingA required field is still emptyReopen the node and look for the red asterisk

Archive or Delete is refusedThe job is placed on the workflow canvasRemove the node from the canvas, then retry

A password ended up in the manifestThe value was typed into the fieldReplace it with ${ENV:NAME} and rotate the secret

No HTTP destination in the paletteWeb API is a source onlyUse the Webhook action in the workflow scene

#### Frequently asked questions

##### What is a Hydra job made of?

A job is a folder holding four manifests: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. Studio writes them from the canvas when you save, and hdrctl runs the same files whether you wrote them by hand or designed them.

##### How do I create a job in Hydra Studio?

Open Jobs configuration and press the plus button in the tab bar at the bottom left. Studio adds a job named job1 and opens an empty canvas; double-click its tab, or use Rename in its options menu, to give it your name.

##### What is the difference between Archive and Delete for a job?

Archive renames the job folder to name.backup, with a timestamp suffix if that name is taken, so nothing is lost. Delete asks whether to also remove the folder from disk. Both are refused while the job is still placed on the workflow canvas.

##### Which sources can I add to a job?

CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, PostgreSQL CDC, MySQL CDC, Snowflake, BigQuery, MongoDB and Web API: thirteen in Hydra ETL 0.22.

##### Which HTTP methods does the Web API source offer?

GET, POST, PUT and DELETE, with GET selected by default.

#### Related lessons

Use the palette

Add a transformation

Read the YAML Studio generates

Hydra DSL reference

#### Next lesson

The job exists and knows where its data comes from. The next lesson places what comes after it: the transformations that reshape the data on its way through.

Add a transformation →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Add a transformation in Hydra Studio: the 20 operations — slug: /studio/06-add-a-transformation/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons17 · Transformations 1▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 23

Lesson 23 of 65 · Add a transformation

### Add a transformation in Hydra Studio: the 20 operations

Twenty operations sit between where data comes from and where it goes. Read the catalog, open the two already on your canvas, and learn why their order is their meaning.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Transformationsabout 20 minutesa job with a source and a destination

Quick answer
In Hydra Studio, a transformation sits between a source and a destination in Jobs configuration. The palette offers twenty operations, from Filter to Script. They run in the order of the chain, top to bottom, so the order of the nodes is part of the job: dropping a column before filtering on it makes the run fail.

#### What will you learn in this lesson?

##### Goal

Read the twenty operations, open the Select and Filter nodes of first-job, see the chain become an ordered list in the manifest, and learn what Studio refuses when you connect nodes.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A first-job that reads src_orders and writes dest_paid, as built in lesson 5, Create a job and add a source. Lessons 6 and 7 add the middle and the end of it.

#### How do I add and chain transformations in Hydra Studio?

##### 01Read the twenty operations

###### Objective

See the whole catalog once, so you stop writing by hand what already exists.

###### Actions

Open Jobs configuration of first-job.

In the palette, collapse Sources and expand Transformations.

Read the list from Filter to Script.

Jobs configuration → Transformations (20)

Nineteen named operations, then one escape hatch. Grouping them by intent is faster than memorizing twenty names: when you know the family you need, the name follows.

FamilyOperationsWhat it does to the table

ChooseFilter · Select · DeduplicateKeeps fewer rows, or fewer columns.

ChangeRename · Cast · Derive · Fill Null · Trim · Clean · WindowSame rows, new values or new headers.

ReshapeSort · Aggregate · Pivot · Unpivot · Transpose · Text to RowsThe shape moves: order, grouping, rows becoming columns.

CombineJoin · Merge · UnionBring a second flow into the first.

EscapeScriptYour own Python.

What you should see
The palette lists the operations in this order, with the count in brackets.

Transformations (20)
Filter Select Rename Cast Aggregate Sort Deduplicate Derive Join
Fill Null Trim Clean Pivot Unpivot Transpose Merge Union Text to Rows Window Script

[image: The job palette of Hydra Studio with Sources collapsed and Transformations expanded, listing Filter, Select, Rename, Cast, Aggregate, Sort, Deduplicate, Derive, Join, Fill Null, Trim and Clean, above a canvas with four connected nodes.]

Transformations (20) expanded. Collapse Sources first, or the list sits below the fold.

##### 02Open the Select and Filter nodes

###### Objective

Read what a configured transformation looks like, before you place your own.

###### Actions

On the canvas, double-click the select node.

Read its fields, then close the dialog.

Do the same on the filter node.

double-click a node → dialog

The two nodes between src_orders and dest_paid were created for you. Select keeps five columns: order_id, customer, country, amount and status. Filter keeps the rows where status == 'paid'. Each dialog holds a Step name, the operation's own fields and a Node ID.

What you should see
Two dialogs with the same frame and different fields. Closing them without saving changes nothing.

SELECT Step name: transform_select Columns: order_id, customer, country, amount, status
FILTER Step name: transform_filter Expression: status == 'paid'

[image: The Select dialog of Hydra Studio over the job canvas, showing the Step name transform_select, the Columns field and the Node ID.]

The Select dialog: the columns the job keeps.

[image: The Filter dialog of Hydra Studio over the job canvas, showing the Step name transform_filter and the expression status == 'paid'.]

The Filter dialog: one expression, evaluated row by row.

##### 03Chain them: the order is the meaning

###### Objective

See that the chain on the canvas is an ordered list in the manifest.

###### Actions

Look at the canvas from left to right.

Open Hydra DSL and select the Transformations tab.

Match each node to its entry.

Hydra DSL → Transformations

The canvas reads src_orders → select → filter → dest_paid: four nodes, three edges. The engine runs the steps top to bottom, so the order is part of the job. Filtering on status after a Select that kept it works. Dropping status from the Select and keeping the same Filter does not: hdrctl validate still passes, but the run stops on the second step.

Trap
Validation does not read your column names. When we dropped status in the Select, the job validated, then the run failed with Step 2/2: filter: invalid expression 'status == 'paid''. Error: name 'status' is not defined (Hydra ETL 0.22.0, Windows). Check the order of the chain when a Filter or a Derive cannot find a column.

What you should see
One entry per node, in the order the edges describe. On the 20-row sample the nominal job reads 20 rows and writes 14.

steps:
- select:
columns: [order_id, customer, country, amount, status]
- filter:
expr: "status == 'paid'"

Rows read : 20
Rows written: 14

[image: The Hydra Studio canvas of first-job showing four connected nodes: src_orders, select, filter and dest_paid, with the counter reading 4 nodes and 3 edges.]

4 nodes · 3 edges: the chain is the order.

[image: The Transformations tab of the Hydra DSL panel showing the ordered select and filter steps of first-job.]

The same chain in the Transformations tab of Hydra DSL.

##### 04Add one, and connect it

###### Objective

Insert a transformation between two nodes, and know what Studio refuses.

###### Actions

Drag an operation from the palette onto the canvas, between two nodes.

Drag from the first node's right handle to the new node's left handle, then from its right handle to the next node.

Double-click the new node and answer its required fields.

Transformations → drag → connect → configure

A transformation reads what enters its left handle and passes the result out of its right one. Studio checks every connection and, when it refuses one, shows a Connection rejected warning with the reason. These are the reasons in Studio 0.22.0:

MessageMeaning

This connection already existsThe two nodes are already linked.

This connection would create a cycleThe edge would let a node feed itself, through other nodes.

“CSV” cannot have an outputA destination ends the job; nothing leaves it.

“CSV” cannot have an inputA source starts the job; nothing enters it.

… has reached its maximum number of inputs (or outputs)The node type accepts a limited number of edges.

What you should see
A refused edge does not appear; the warning names the reason. A new node keeps its badge until its required fields are filled.

Connection rejected
“CSV” cannot have an output

##### 05Bring a second flow in

###### Objective

Know which nodes combine flows, and what each one does.

###### Actions

Pick Join, Merge or Union in the palette.

Read the description Studio gives for each when you hover its entry.

Connect the flows that must meet.

Join · Merge · Union

Three operations bring a second flow into the first. The Studio node catalog describes them this way:

OperationWhat the catalog says

JoinJoins two flows on a key, or every row against every row (cross).

MergeUpserts a source into a target, like a SQL MERGE.

UnionAppends a source, as UNION or UNION ALL.

None of the three sets a maximum number of inputs in the catalog, unlike the nodes in the table above that do. We did not build a two-source job in this lesson: lesson 12 composes jobs in a workflow, which is the other way to bring flows together.

What you should see
The three entries are in the palette under Transformations, in the positions shown in step 1.

Join Merge Union

###### Tips and tricks

Think in families before names: choose, change, reshape, combine. When you know the family, the name follows.

Collapse Sources in the palette before you look for a transformation: the list is long and opens below the fold.

Steps run in the order of the chain, and validation does not check column names. If a step cannot find a column, read the Transformations tab of Hydra DSL and check what an earlier step dropped.

A refused edge is a rule, not a bug: read the Connection rejected warning, it names the reason.

#### What should I have at the end?

VerificationExpected result

PaletteTwenty transformations, Script last

Nodesselect and filter open and show the fields of step 2

Chain4 nodes · 3 edges, and the order matches the list in the Transformations tab

Run20 rows read, 14 written with the sample data

#### What if something goes wrong?

SymptomCauseFix

An edge will not connectStudio refuses it for a stated reasonRead the Connection rejected warning and apply what it says

A transformation keeps its badgeA required field is emptyDouble-click it and fill the field marked with a red asterisk

A run fails on a column the job should haveAn earlier step dropped itReorder the nodes, or keep the column in Select

No Transformations in the paletteYou are in the workflow sceneSwitch to Jobs configuration

#### Frequently asked questions

##### How many transformations does Hydra Studio have?

Twenty in Hydra ETL 0.22, from Filter to Script. Script closes the list and holds your own Python for what the other nineteen do not cover.

##### Does the order of transformations matter?

Yes. The engine runs them top to bottom. In our test on the course job, a Select that dropped the status column before a Filter on status made the run fail with: name 'status' is not defined.

##### Which transformations combine two streams?

Join, Merge and Union. According to the Studio node catalog, Join combines two flows on a key or as a cross product, Merge upserts a source into a target, and Union appends a source.

##### Why does Studio refuse an edge between two nodes?

Studio checks every connection and shows a Connection rejected warning with the reason: the edge already exists, it would create a cycle, a node cannot have an input or an output, or a node has reached its maximum number of inputs or outputs.

#### Related lessons

Create a job and add a source

Add a destination

Read the YAML Studio generates

Transformations YAML reference

#### Next lesson

The data enters and is reshaped. One node is still to read closely, the one that makes the job write: the destination.

Add a destination →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Add a destination in Hydra Studio: one job, one place to write — slug: /studio/07-add-a-destination/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons18 · Destinations▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 25

Lesson 25 of 65 · Add a destination

### Add a destination in Hydra Studio: one job, one place to write

A destination ends the job. Read the ten Hydra can write to, open the one in your canvas, and learn the rule that sets it apart: a pipeline names exactly one.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Destinationsabout 10 minutesa job with a source and transformations

Quick answer
A destination ends a Hydra job. Drag one from Destinations, connect the last transformation to it and fill its path or connection. Hydra ETL 0.22 offers ten destinations. The pipeline names exactly one of them in to: to write elsewhere too, create a second job and orchestrate both in the workflow.

#### What will you learn in this lesson?

##### Goal

Read the ten destinations, open the CSV destination of first-job, and see how the pipeline manifest ties one source to one destination.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

The first-job of the previous lesson, with its select and filter nodes in place.

#### How do I add a destination to a job in Hydra Studio?

##### 01Read the ten destinations

###### Objective

See what Hydra can write to, and notice what is missing.

###### Actions

In the job palette, collapse Sources.

Read Destinations.

Compare with the thirteen sources.

Jobs configuration → Destinations (10)

Ten connectors: three file formats and seven databases or warehouses. Three of the thirteen sources have no counterpart: PostgreSQL CDC, MySQL CDC and Web API. Hydra reads from an HTTP endpoint but never writes to one.

DestinationWhat the catalog says

CSV · JSON · ParquetWrites a file.

MySQL · PostgreSQL · SQL Server · MongoDBInserts into the database.

SQLiteWrites a table, built in.

Snowflake · BigQueryWrites a table: append, replace or upsert.

What you should see
Ten entries on the way out, thirteen on the way in. The three missing ones are deliberate.

Sources CSV JSON Parquet MySQL PostgreSQL SQL Server SQLite PostgreSQL CDC MySQL CDC Snowflake BigQuery MongoDB Web API
Destinations CSV JSON Parquet MySQL PostgreSQL SQL Server SQLite Snowflake BigQuery MongoDB

[image: The job palette of Hydra Studio with Sources collapsed and Destinations expanded, listing CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, Snowflake, BigQuery and MongoDB.]

Destinations (10), with Sources collapsed.

##### 02Open the CSV destination

###### Objective

Read a configured destination, and recognize its dialog.

###### Actions

On the canvas, double-click the dest_paid node at the right end of the chain.

Read its fields.

Close the dialog.

double-click dest_paid → dialog

The dialog follows the shape of the source dialog: a Step name, the connector's own fields and a Node ID. A file destination asks for a path. A database destination asks for a connection and a target table; write ${ENV:MY_SECRET} for a password and keep the value under Environments.

What you should see
The same frame as a source, with a file path. Nothing here is a connection to a server.

CSV DESTINATION Writes a CSV file
STEP NAME dest_csv
FILE PATH ../../outputs/paid_orders.csv
LOCATION local

[image: The CSV destination dialog of Hydra Studio over the job canvas, showing the Step name, the File path, the Location set to local and the Node ID.]

The CSV destination: a path, nothing more.

##### 03One destination, and only one

###### Objective

Learn the rule that separates destinations from every other node.

###### Actions

Open Hydra DSL and select the Pipeline tab.

Read the from and to keys.

Select the Destinations tab and read the declared destination.

Hydra DSL → Pipeline

The pipeline ties a source to a destination by identifier. We tested three shapes on the course job with Hydra ETL 0.22.0:

What we wroteResult

One destination, to: dest_paidValid; the run read 20 rows and wrote 14.

A second destination declared, but to still names oneValid; the second one is ignored.

to: [dest_paid, dest_copy]Refused: Input should be a valid string, then pipeline.to is missing or empty.

If you need the same data in two places, write two jobs and orchestrate them in the workflow, which the next lessons build towards.

What you should see
One from, one to, and identifiers rather than paths.

pipeline:
from: src_orders
to: dest_paid

destinations:
dest_paid:
type: csv
load:
table: ../../outputs/paid_orders.csv
mode: replace

[image: The Pipeline tab of the Hydra DSL panel showing from src_orders and to dest_paid.]

The Pipeline tab: one from, one to.

[image: The Destinations tab of the Hydra DSL panel showing the dest_paid CSV destination with its load settings.]

The Destinations tab: what to points at.

###### Tips and tricks

The destination dialogs follow the source dialogs: if you configured a source, you can configure its matching destination.

For a database, never type a real password in the node: write a reference such as ${ENV:MY_SECRET} and keep the value outside the manifest.

Web API, PostgreSQL CDC and MySQL CDC have no destination. To send data out over HTTP, use the Webhook action in the workflow scene.

Do not list two destinations in to: the engine expects a single identifier. Use two jobs.

#### What should I have at the end?

VerificationExpected result

PaletteTen destinations, no Web API

Dialogdest_paid opens with a file path and a Node ID

Pipeline tabOne from, one to

Validationhdrctl validate jobs/first-job reports DSL valid

#### What if something goes wrong?

SymptomCauseFix

No HTTP destination in the listWeb API is a source onlyUse the Webhook action in the workflow scene

Input should be a valid string on pipeline.toto holds a listName one destination, and create a second job for the second place

Nothing connects after the destinationIt has no outputExpected: the destination ends the job

The badge stays after savingThe output path or table is emptyReopen the node and fill the field marked with a red asterisk

#### Frequently asked questions

##### Which destinations does Hydra Studio offer?

CSV, JSON, Parquet, MySQL, PostgreSQL, SQL Server, SQLite, Snowflake, BigQuery and MongoDB: ten in Hydra ETL 0.22.

##### Can a Hydra job write to two destinations?

No. The pipeline names a single destination in its to key. We declared a second destination without referencing it and it was ignored; we wrote to as a list and hdrctl validate rejected it. To write to two places, use two jobs in a workflow.

##### Why is there no Web API destination?

Web API is a source only in Hydra ETL 0.22, like PostgreSQL CDC and MySQL CDC. To send data out over HTTP, use the Webhook action in the workflow scene.

##### How do I keep a password out of a destination?

Write a reference such as ${ENV:MY_SECRET} in the field and keep the value under Environments, never in the manifest.

#### Related lessons

Add a transformation

Read the YAML Studio generates

Destinations YAML reference

Hydra Playground

#### Next lesson

The job is complete: it reads, reshapes and writes. The next lesson opens the manifests Studio has been writing all along, and checks that they say what you meant.

See the YAML →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Read the YAML Hydra Studio generates (Hydra DSL panel) — slug: /studio/08-see-the-yaml/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons11 · See the YAML▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 12

Lesson 12 of 65 · See the YAML

### Read the YAML Hydra Studio generates (Hydra DSL panel)

The canvas shows what you drew. The YAML shows what will run. This lesson is about reading the second one, because that is where you find what the first one leaves out.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Hydra DSLabout 15 minutesa job with source and destination

Quick answer
The Hydra DSL button in the Hydra Studio top bar shows the YAML written for what you drew. In the workflow scene it shows one file, workflow.yaml. In the job scene it shows the job's four manifests in four tabs. Read it critically: a node drawn is not a node configured.

#### What will you learn in this lesson?

##### Goal

Open the Hydra DSL panel in both scenes, walk through the four job tabs, and learn to read them critically. A node drawn is not a node configured, and the YAML is where the difference shows.

Course project
Keep one cumulative Studio project named studio-course, one manual workflow named first-workflow, and one job named first-job. Each lesson builds on the state saved by the previous one.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A job holding at least a source.

#### How do I read the YAML that Hydra Studio generates?

##### 01Open the panel

###### Objective

Find the DSL view, and notice that it follows the scene.

###### Actions

Select Hydra DSL in the top bar.

Read the label at the top left of the panel.

Switch scenes and watch the label change.

Top bar → Hydra DSL

One button, two views. In Workflow configuration the panel shows a single file, workflow.yaml, marked synced when it matches the canvas. In Jobs configuration it shows the job, marked multi-section because a job is four files, not one.

What you should see
The panel opens beside the canvas, and both stay visible. You can select a node and read its YAML at the same time.

YAML synced ← workflow scene
JOB multi-section ← job scene

##### 02Read the workflow file

###### Objective

Match every node on the canvas with an entry under steps.

###### Actions

Stay in Workflow configuration.

Read name, trigger, then each step.

Compare each depends_on with an arrow on the canvas.

Workflow configuration → Hydra DSL

The file opens with what the workflow is — its name and its trigger — then lists the steps in the order the graph imposes. Each depends_on is an edge, written as a name rather than drawn as an arrow.

version: "1.0"
workflow:
name: first-workflow
trigger:
type: manual
steps:
- name: first-job
type: job
job: ../jobs/first-job
- name: second-job
type: job
job: ../jobs/second-job
depends_on:
- first-job

Two steps for two nodes, and the chain reads correctly: the second step waits for the first. The first has no depends_on, so it starts immediately.

How a job step is written
Each job node becomes a step with type: job and a job path to its folder, here ../jobs/first-job. The step name is the node's step name; here it is the job's name. An action node, such as a Log, becomes type: action with an action name.

What you should see
One entry per node, in dependency order, and a depends_on for every arrow.

[image: The workflow scene with the Hydra DSL panel open on the right, showing workflow.yaml with its name, manual trigger and two job steps, the second depending on the first.]

The workflow scene: YAML marked synced, two steps, one depends_on.

##### 03Read a job, section by section

###### Objective

Walk the four tabs in the order a job runs.

###### Actions

Switch to Jobs configuration and open Hydra DSL.

Select Sources, and read the connector block.

Note the identifier on the first indented line.

Jobs configuration → Hydra DSL → Sources

A job is four files, and the panel gives one tab to each. Read them in order and the job explains itself: where the data comes from, what happens to it, where it goes, and how the three are wired.

version: '1.0'
sources:
src_orders:
type: csv
connection: {}
extract:
table: data/orders.csv
batch_size: 50000

src_orders is the identifier, not the file. It is what pipeline.yaml will point at. connection: {} is empty because a CSV needs no connection — the path alone is enough, and it is relative to the job's folder. batch_size sets how many rows are read at a time; 50000 is simply the value this job carries.

What you should see
Four tabs, and the source block matching the node you configured.

Sources Transformations Destinations Pipeline

[image: The job scene with the Hydra DSL panel open on the Sources tab, showing a csv source named src_orders with its extract table data/orders.csv and batch size 50000.]

The Sources tab of first-job.

##### 04Read the transformations and the destination

###### Objective

Read the two middle tabs, and learn what an empty section looks like.

###### Actions

Select the Transformations tab.

Select the Destinations tab.

Match each entry with a node on the canvas.

Hydra DSL → Transformations · Destinations

The canvas draws a node whether or not it is complete; the YAML writes exactly what that node holds, and nothing more. That is why the panel is the quickest way to catch an empty field.

version: '1.0'
transformations:
steps:
- select:
columns:
- order_id
- customer
- country
- amount
- status
- filter:
expr: status == 'paid'

version: '1.0'
destinations:
dest_paid:
type: csv
connection: {}
load:
table: ../../outputs/paid_orders.csv
mode: replace

[image: The Hydra DSL panel on the Transformations tab, listing the select and filter steps of first-job.]

Transformations. One entry per node between the source and the destination.

[image: The Hydra DSL panel on the Destinations tab, showing the csv destination dest_paid with its load table and replace mode.]

Destinations. The identifier, the file written, and the load mode.

What you readWhat it meansWhat to do

steps: []No transformation was placed, or none was connected.Add one, or accept a job that only copies.

table: ''The destination exists but has no output path.Open the node and fill the field marked with a red asterisk.

connection: {}Normal for a file connector.Nothing — a path is all a CSV needs.

The engine is stricter than the canvas
Both empty values in the table are refused by hdrctl validate: a destination table must hold at least one character, and a transformation list at least one entry. So a job can look finished on screen and still not run. Tested with Hydra ETL 0.22.0 on a job whose destination table is '' and whose steps is []:

destinations.dest_paid.load.table
String should have at least 1 character [type=string_too_short, input_value='', input_type=str]
steps
List should have at least 1 item after validation, not 0 [type=too_short, input_value=[], input_type=list]

What you should see
One entry per node, and no empty value: a non-empty table and at least one transformation step.

##### 05Read the wiring

###### Objective

Confirm the two ends of the job refer to the identifiers you just read.

###### Actions

Select the Pipeline tab.

Compare from with the identifier in Sources.

Compare to with the identifier in Destinations.

Hydra DSL → Pipeline

The shortest file of the four, and the one that ties the others together. It holds identifiers, never paths — which is what lets you repoint a source at another file without touching the wiring.

version: '1.0'
pipeline:
name: first-workflow
from: src_orders
to: dest_paid
transformations: transformations

One from, one to — a job reads from one place and writes to one place. Studio also writes a name line and a transformations line beside them.

What you should see
Both identifiers resolving to blocks you have already read. If one does not, the job will fail before reading a single row.

from: src_orders → sources.src_orders
to: dest_paid → destinations.dest_paid

[image: The Hydra DSL panel on the Pipeline tab, showing from src_orders and to dest_paid, the two identifiers declared in the other tabs.]

The Pipeline tab: two identifiers, no paths.

###### Tips and tricks

The panel follows the scene: one file in the workflow scene, four tabs in the job scene.

pipeline.yaml holds identifiers, not paths. That indirection lets you repoint a source without touching the wiring.

The Valid badge means the manifest parses. Only a run proves the job works.

Studio can be ahead of the disk. Open the file on disk to be sure what a run will read.

#### What should I have at the end?

VerificationExpected result

Workflow panelOne file, marked synced

Job panelFour tabs, marked multi-section

StepsOne entry per node, in dependency order

Source blockIts identifier matches pipeline.from

Destination blockIts identifier matches pipeline.to, and table is not empty

TransformationsOne entry per node on the chain

#### What if something goes wrong?

SymptomCauseFix

steps: [] although nodes existThe transformations are not connected to the chainDraw the edges from the source through to the destination

table: ''The destination has no output pathOpen the node and fill the required field

from resolves to nothingThe source was renamed after the wiringReopen the source and align the identifiers

The panel disagrees with the diskThe workflow was not savedPress Save, then read the file itself

#### Frequently asked questions

##### Where do I see the YAML in Hydra Studio?

Select Hydra DSL in the top bar. In Workflow configuration it shows workflow.yaml, marked synced when it matches the canvas. In Jobs configuration it shows the job's manifests in four tabs.

##### What does a job step look like in workflow.yaml?

A job step has type: job and a job: path, for example job: ../jobs/first-job. An action step has type: action and an action name such as log.

##### Does a container appear in workflow.yaml?

No. Containers are purely visual. They only copy their failure or retry policy onto the steps they enclose.

##### Can I write the YAML by hand instead?

Studio writes the same YAML files that hdrctl runs, so you can also write them by hand. See the Hydra DSL reference for the full syntax.

#### Related lessons

Read the Hydra Studio canvas

Reach Valid

workflow.yaml reference

pipeline.yaml reference

#### Next lesson

You can now read what Studio writes, and spot what it leaves empty. The next lesson turns that reading into a verdict: what Valid covers, what it does not, and how to reach a job that actually runs.

Reach a valid design →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra Studio Valid badge: what it checks and what it does not — slug: /studio/09-reach-valid/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons12 · Reach Valid▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 13

Lesson 13 of 65 · Reach Valid

### Hydra Studio Valid badge: what it checks and what it does not

Finish the job graph, configure each required field, and distinguish the header's DAG validity from node-level readiness.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Validabout 15 minutessource YAML verified

Quick answer
The Valid badge in the Hydra Studio header reports that the job graph is sound: no duplicated IDs, no unknown dependencies and no cycle. It does not prove that each node is configured, which the red badges on nodes show, and only a run proves the job works. This lesson clears both.

#### What will you learn in this lesson?

##### Goal

Build CSV source → Cast → Filter → CSV destination. Configure Cast and Filter with fields defined in NodeConfigDialog, choose a destination file, connect the four nodes, and verify both graph validity and node configuration.

##### Why this matters

The header's Valid state comes from DAG validation: no duplicated IDs, unknown dependencies, or cycle. Individual node badges use isNodeConfigured. A trustworthy job needs both; a green DAG badge alone does not prove required connector fields are filled.

Course project
Continue with studio-course, the manual first-workflow, and the first-job canvas saved by the preceding lesson. Do not create a parallel replacement project.

##### Prerequisites

The top bar shows API online.

The cumulative workflow is open in the editor.

The preceding lesson checklist is complete.

#### How do I get a valid job in Hydra Studio?

##### 01Add and configure Cast

###### Objective

Give numeric CSV columns explicit types before comparison.

###### Actions

Drag Cast from Transformations.

Double-click it.

Enter {"price":"float","qty":"int"} in Types (JSON), then save.

Transformations → Cast → Types (JSON)

What you should see
The Cast node has the required mapping used by the real dialog schema.

Cast
Types (JSON) *
{"price":"float","qty":"int"}
Save

##### 02Add and configure Filter

###### Objective

Remove the fixture row whose price is zero.

###### Actions

Drag Filter after Cast.

Double-click it.

Enter price > 0 in Expression, then save.

Transformations → Filter → Expression: price > 0

What you should see
The Filter node has the required non-empty expression.

Filter
Expression *
price > 0
Save

##### 03Add the CSV destination

###### Objective

Choose the physical target the completed job will write.

###### Actions

Drag CSV from Destinations to the right of Filter.

Double-click the destination node.

Use Browse to choose a save path ending in studio-output.csv, then save.

Destinations → CSV → Browse → studio-output.csv

What you should see
Destination CSV requires one File path and accepts a save-file picker.

CSV
File path *
./output/file.csv
Browse
Save

##### 04Connect and verify both layers

###### Objective

Build one acyclic source-to-destination chain and check every node.

###### Actions

Connect Source to Cast, Cast to Filter, and Filter to Destination.

Read the toolbar counter and Valid badge.

Inspect every node for configured state before saving.

CSV source → Cast → Filter → CSV destination → Save

What you should see
The designed chain has four nodes, three directed edges, no DAG error, and all required fields saved.

4 nodes · 3 edges
Valid
Saved ✓

[image: Editor header for a job with the counter reading 4 nodes and 3 edges and a green Valid badge, next to the environment selector.]

The header of a job whose graph is valid: four nodes, three edges, and the green Valid badge.

###### Tips and tricks

Give numeric CSV columns explicit types with a Cast before you compare them in a Filter.

A trustworthy job needs two greens: the header badge for the graph, and no red badge on any node.

The Valid badge means the manifest parses. Only a run proves the job works.

A green header with a red node badge is normal while a required field is still empty.

#### What should I have at the end?

VerificationExpected result

GraphSource → Cast → Filter → Destination

Required mappingsprice float and qty int

Filterprice > 0

ReadinessDAG Valid plus every node configured

#### What if something goes wrong?

SymptomCauseFix

Valid appears while a node is incompleteHeader validity checks the DAGOpen each node and satisfy its required fields

An edge is rejectedDirection, capacity, duplicate, or cycle rule is violatedConnect left to right once and keep destination last

Cast remains incompleteMapping JSON is blank or malformedUse the exact JSON object and save

#### Frequently asked questions

##### What does the Valid badge mean in Hydra Studio?

It comes from graph validation: no duplicated IDs, no unknown dependencies and no cycle. It says nothing about whether each node has its required fields.

##### Why is my job valid but a node still has a red badge?

Node badges check that the node is configured, which the header badge does not. Open the node and fill the field marked with a red asterisk.

##### Does a valid job always run successfully?

No. Valid is a design-time check before any data moves. Run the job to prove it works, then read the result on the Runs page.

##### What does a Cast node need?

A Types (JSON) mapping from column to type, for example {"price":"float","qty":"int"}.

#### Related lessons

Read the YAML Studio generates

Add a transformation

Run a job

Hydra DSL reference

#### Next lesson

The visual job is complete and serialized. The next lesson selects Run Job, opens the Logs panel automatically, and follows the status produced by the inline job execution path.

Run the job →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Run a Hydra job from Studio: four ways, one engine — slug: /studio/10-run-the-job/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons13 · Run a job▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 14

Lesson 14 of 65 · Run the job

### Run a Hydra job from Studio: four ways, one engine

From the canvas, from the workflow, from the terminal inside Studio, or from your own shell. The button changes; what executes does not.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Run Jobabout 25 minutesa complete job

Quick answer
You can run a Hydra job four ways: Run Job on the canvas, Run Workflow from the workflow editor, the terminal built into Studio, or your own shell. The button changes but the same engine executes. This lesson brings first-job into the workflow, checks it and runs it each way, then reads the results.

#### What will you learn in this lesson?

##### Goal

Bring an existing job into a workflow, check what it holds, then run it four different ways. By the end you should know which one to reach for, and be able to read the numbers each returns.

Course project
Keep one cumulative Studio project named studio-course with one manual workflow, first-workflow. Its job first-job reads data/orders.csv (20 orders), keeps the paid ones and writes outputs/paid_orders.csv. At this point the workflow holds only that job.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

The first-job folder of the course project, with its sample file data/orders.csv.

#### How do I run a Hydra job from Hydra Studio?

##### 01Import a job you already have

###### Objective

Reuse a job written elsewhere instead of rebuilding it.

###### Actions

Open Workflow configuration.

Select Import in the top bar, then Import a job.

Pick a folder holding the four job manifests.

Workflow configuration → Import → Import a job

This is a third route into a project, and the most direct. Open a project takes a whole workspace, Import workflow takes a workflow and its jobs — Import a job takes one job folder and drops it straight onto the canvas as a node.

What you should see
A job node appears on the canvas and the job joins the Jobs category of the palette.

Import a job
Select a job folder (4 YAML files) → add a node to the canvas

[image: The workflow canvas with the Import menu open on the Import a job entry.]

Import a job. One job folder becomes one node on the workflow canvas.

##### 02Check the job before running it

###### Objective

Read what the job holds, so the numbers at the end mean something.

###### Actions

Double-click the job node to enter Jobs configuration.

Follow the chain from the source to the destination.

Read the counters and the badge in the header.

double-click first-job → Jobs configuration

Importing brings the manifests, not your intent, so look before you run. first-job has four nodes: a CSV source, a Select that keeps five columns, a Filter that keeps the paid orders, and a CSV destination. Without the filter the job would copy its input unchanged, and the numbers at the end would tell you nothing.

What you should see
Four nodes, three edges, and the header reading Valid.

first-workflow / first-job 4 nodes · 3 edges Valid
src_orders → select → filter → dest_paid

[image: The Jobs configuration canvas of first-job: a CSV source, a select, a filter and a CSV destination joined by three edges, with the Valid badge in the header.]

The job first-job, ready to run.

##### 03Read the three nodes that decide the result

###### Objective

Know which path, which condition and which output the run will use.

###### Actions

Open the source and read the input file.

Open the filter and read its expression.

Read the output file in the Hydra DSL panel, under Destinations.

double-click the source and the filter → read → close

Paths inside a job are relative to the job's own folder: data/orders.csv resolves inside jobs/first-job, and ../../outputs/paid_orders.csv climbs back to the project's outputs folder. That is why the project keeps working wherever its folder lives. A path copied from another machine is the usual reason a run reads nothing.

[image: The CSV source dialog of first-job, with its step name and the file path data/orders.csv.]

Source. The file the job reads.

[image: The Filter dialog of first-job, with the expression status == 'paid'.]

Filter. The condition a row must meet to be kept.

What you should see
Every required field filled in. A badge left anywhere means a required field is still empty, and the run will stop there.

FILE PATH data/orders.csv
EXPRESSION status == 'paid'
FILE PATH ../../outputs/paid_orders.csv ← Hydra DSL → Destinations

##### 04Run the job on its own

###### Objective

Execute one job, without the workflow around it.

###### Actions

Stay in Jobs configuration.

Select Run Job — in the top bar or in the middle of the canvas.

Wait for the panel to open at the bottom.

Jobs configuration → Run Job

Two buttons, one action. The green one in the top bar and the floating one on the canvas do the same thing; the second is simply closer to where your eyes already are. This is the loop you use while designing — one job, immediate feedback, no orchestration in the way.

What you should see
The run panel opens with three tabs and a status. Logs holds the trace, Parameters the values in play, Terminal a shell.

LOGS PARAMETERS TERMINAL SUCCESS

##### 05Read the numbers, not the colour

###### Objective

Take from the log the two figures that tell you whether the job did what you meant.

###### Actions

Open the Logs tab.

Find the rows_in and rows_out line.

Compare it with what your filter should have kept.

LOGS → rows_in · rows_out

Green means the job finished, not that it was right. The pair of counters is the real verdict: twenty rows read, fourteen written, and the difference is exactly what the filter removed. Had it written twenty, the filter would not have been applied; had it written zero, the expression matched nothing.

What you should see
A short trace, ending on the row counts and the duration.

Run <run id> — first-job [SUCCESS]
Total duration: <observed>s
- step first-job : ✓ success (<observed>s)
rows_in=20 rows_out=14

[image: The Logs panel after Run Job: the run of first-job is marked SUCCESS, with the duration, the step line, and rows_in=20 rows_out=14.]

The panel after Run Job: the verdict is in the two counters.

##### 06Run the parent workflow

###### Objective

Execute the job through the orchestration that contains it.

###### Actions

Switch to Workflow configuration.

Select Run Workflow.

Read the summary line at the end of the log.

Workflow configuration → Run Workflow

Same engine, wider scope. Run Job executes one job; Run Workflow walks the whole graph — every job, every action, in dependency order, applying the policies your containers wrote. Use the first while building, the second to check the design as a whole.

ButtonRunsReach for it when

Run JobThe open job, aloneYou are iterating on one transformation.

Run WorkflowEvery step of the graphYou want to know the whole thing holds together.

What you should see
A run identifier, the trigger, the number of steps and the duration — the workflow-level summary rather than one job's counters.

Run <run id> — first-workflow [SUCCESS]
Total duration: <observed>s
first-workflow succeeded · manual · 1/1 steps · <observed>s

[image: The workflow canvas after Run Workflow on a workflow that holds only first-job: the single job node is outlined in green.]

Run Workflow on the workflow that holds first-job: the node turns green.

##### 07Let the notifications keep the history

###### Objective

Find the runs you launched while looking elsewhere.

###### Actions

Select the bell in the top bar.

Read the entries, newest first.

Use Clear all once you have read them.

Top bar → notifications

Each finished run leaves a line: what ran, how it was triggered, how many steps and how long ago. The toast in the corner disappears on its own — the bell keeps it. That matters once a run takes longer than your attention.

What you should see
One entry per run, job runs and workflow runs together, each with its age.

Run completed first-job succeeded · manual · 1/1 steps

[image: The notifications panel open from the top bar, listing the run completed a moment ago, above the logs panel showing 20 rows in and 14 out.]

The bell is the short history. The Runs page is the long one.

##### 08Run from the terminal, without leaving Studio

###### Objective

Reach the same job through the CLI, in the panel you already have open.

###### Actions

Open the Terminal tab of the run panel.

Type hdrctl run followed by the job folder.

Read the summary the CLI prints.

cd ~/hydra-workspace/studio-course
hdrctl run jobs/first-job

The terminal is a real shell inside Studio, so nothing is simulated. hdrctl run takes the folder of a job — the one holding the four manifests. It reports the same work in its own words: rows read, rows written, duration.

What you should see
The banner, then the pipeline line, then the two counters. Same engine as the button, different presentation.

▶ Pipeline first-job

✅ Pipeline completed successfully in <duration>
Rows read : 20
Rows written: 14

[image: The Terminal tab inside Studio after hdrctl run jobs/first-job, with the Hydra banner, the pipeline line, 20 rows read and 14 rows written.]

Move to the project folder first, then run the job folder. Always read the path before the numbers.

##### 09Run the whole workflow from the CLI

###### Objective

Launch the orchestration the way a scheduler would.

###### Actions

Stay in the terminal.

Run hdrctl workflow run on the workflow name.

Read one line per step.

hdrctl workflow run first-workflow

Note the difference in what each command expects: hdrctl run takes a job folder, hdrctl workflow run takes a workflow name (workflows/<name>.yaml) or a file path. Both are resolved from the project folder, so run them from there.

This is also the command a scheduler, a CI pipeline or a colleague without Studio will use. That the same design runs identically from a button and from a shell is the whole point of keeping the manifests plain files.

What you should see
One line per step, in dependency order, each with its duration — one per job here.

Workflow first-workflow
✓ Step 'first-job' OK (<duration>)
✓ Step 'second-job' OK (<duration>)
Workflow 'first-workflow' completed in <duration> — 2/2 steps OK

[image: The Terminal tab after hdrctl workflow run first-workflow, listing the two job steps OK and the line 2/2 steps OK.]

Two steps, one per job, in dependency order.

###### Tips and tricks

Import a job folder with Import → Import a job instead of rebuilding a job written elsewhere.

Run Job opens the Logs panel automatically: read the status there before opening the Runs page.

An animation is not an outcome. Wait for a terminal state on the Runs page.

The Valid badge means the manifest parses. Only a run proves the job works.

#### What should I have at the end?

VerificationExpected result

ImportThe job appears as a node and in the palette

ConfigurationNo red badge on any of the three nodes

Run JobThe panel opens on SUCCESS

Countersrows_out matches what the filter should keep

Run WorkflowA summary line with the step count

NotificationsOne entry per completed run

CLIThe same work, reported as rows read and written

#### What if something goes wrong?

SymptomCauseFix

Run Job does nothingA node still carries a red badgeOpen each node and fill the fields marked with a red asterisk

rows_in=0The source path does not point at your fileReopen the source and check the path, which is relative to the job's folder

rows_out=0The filter expression matches nothingCheck the column name and the exact spelling of the value

rows_out equals rows_inThe transformation is not on the chainReconnect it between the source and the destination

The CLI reports no workflow fileA folder was passed instead of the fileAppend \workflow.yaml to the path

Two runs report different countsThey ran different job foldersCompare the job_path line of each

#### Frequently asked questions

##### How do I run a job in Hydra Studio?

Select Run Job on the job canvas. Studio opens the Logs panel and follows the status of the run.

##### Is running from Studio different from running from the command line?

No. The button changes, but the same engine runs underneath, whether you start it from the canvas, the workflow, the Studio terminal or your own shell.

##### What is the difference between Open a project, Import workflow and Import a job?

Open a project takes a whole workspace, Import workflow takes a workflow and its jobs, and Import a job takes one job folder and drops it into the current project.

##### Where do I find the result of a finished run?

On the Runs page, covered in the next lesson. Each run keeps its status, duration and logs.

#### Related lessons

Reach Valid

Review a past run

Compose jobs into a workflow

Hydra CLI reference

#### Next lesson

The job runs, and you can read its verdict. The next lesson opens the Runs page, where those verdicts are kept — and where a failure explains itself.

Review a run →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Review a past run in Hydra Studio: Runs page, filters and logs — slug: /studio/11-review-a-run/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons14 · Review a run▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 16

Lesson 16 of 65 · Review a run

### Review a past run in Hydra Studio: Runs page, filters and logs

Move from the live canvas to durable run history, filter the list, and inspect the execution one step at a time.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Runsabout 9 minutescompleted Studio run

Quick answer
Open Runs in the Hydra Studio sidebar to find past executions. Filter the list by All, Running, Success, Failed or Pending, open a run, then read its Started, Finished, Duration and Steps cards and the captured logs of each executed step. The history is saved by the API, not by the canvas.

#### What will you learn in this lesson?

##### Goal

Open Runs from the sidebar, locate a completed execution, and open its detail page. Read the Started, Finished, Duration, and Steps cards, then inspect the captured logs for the executed step.

Course project
Continue with studio-course, the manual first-workflow, and the first-job canvas saved by the preceding lesson. Do not create a parallel replacement project.

##### Prerequisites

The top bar shows API online.

The run started in the preceding lesson has reached a terminal state.

The cumulative project and workflow are still available in Studio.

#### How do I review a past run in Hydra Studio?

##### 01Open run history

###### Objective

Move from the workflow editor to the history of executions saved by the API.

###### Actions

Wait until the terminal state of the current run is visible.

Find Runs in the left sidebar.

Select Runs.

Sidebar → Runs

What you should see
The Runs entry is available from the editor and opens the execution history without changing the saved canvas.

[image: Hydra Studio editor with the Runs entry highlighted in the left sidebar.]

Open the history. Select Runs in the left sidebar after the execution reaches a terminal state.

##### 02Read the run history

###### Objective

Identify the execution you want to review from its workflow, status, step count, start time, and duration.

###### Actions

Read the totals in the upper-right corner.

Use All, Running, Success, Failed, or Pending to narrow the list when needed.

Find a successful first-workflow row. A run of Run Job appears as its own row, named after the job.

Select its workflow name to open the run.

Runs → Success → first-workflow

What you should see
Each row exposes the workflow, short run identifier, status, completed steps, start time, and observed duration.

Workflow Status Steps Started Duration
first-workflow Success 2/2 <observed time> <observed>
first-job Success 1/1 <observed time> <observed>

[image: The Hydra Studio Runs page with the status filters All, Running, Success, Failed and Pending above a table of executions, each with workflow, status, steps, start time and duration.]

Read before opening. The history table gives enough evidence to choose the correct execution; identifiers and durations vary between runs.

##### 03Inspect one execution

###### Objective

Connect the run-level result to the exact engine step and the rows it processed.

###### Actions

Confirm the workflow name, short run identifier, and terminal status at the top of the page.

Read Started, Finished, Duration, and Steps.

Expand the step card if it is collapsed.

Read each step's status, duration, and number of log lines, then open the first-job step to read its row counters.

Run detail → Steps → job log

What you should see
The run is successful, both steps are marked ok, and the log of first-job confirms that it read twenty rows and wrote fourteen.

Success
Steps: 2 ok / 2
Job 'first-job' completed successfully: 20 rows in, 14 rows out, <observed>s

[image: The run detail page of first-workflow: a Success badge, cards for Started, Finished, Duration and Steps, an execution timeline with one bar per job, and one row per step.]

Inspect the evidence. The summary describes the whole run; each step row opens to its own log, with the row counts of the job.

###### Tips and tricks

The Runs entry is reachable from the editor and does not change the saved canvas.

Narrow a long list with the status filters before you scroll.

Counts and durations are live values. Never quote them as thresholds.

An animation is not an outcome. Wait for a terminal state before you read the verdict.

#### What should I have at the end?

VerificationExpected result

Runs pageStatus filters and execution rows are visible

Selected entryMatches first-workflow and shows Success

Summary cardsStarted, Finished, Duration, and Steps are readable

Step detailTwo successful steps, first-job then second-job, each with its log lines

Row evidenceThe first-job log reports 20 rows in and 14 rows out

#### What if something goes wrong?

SymptomCauseFix

The run is still RunningPolling has not reached a terminal stateWait and refresh the API-backed list

No run is listedThe job submission did not succeed or another workspace is activeReturn to the editor and confirm the completed run

Logs are emptyThe engine captured no lines for that stepUse status, duration, and output artifact as the remaining evidence

#### Frequently asked questions

##### Where are past runs in Hydra Studio?

On the Runs page, opened from the sidebar or from the editor. It lists each execution with its workflow, status, step count, start time and duration.

##### How do I filter runs by status?

Use the All, Running, Success, Failed and Pending filters above the list.

##### Where do I read the logs of one step?

Open the run to reach its detail page, then inspect the captured logs of the executed step.

##### Does the run history survive closing Studio?

Yes. Runs are saved by the API, so the history is still there when you reopen Studio.

#### Related lessons

Run a job

Compose jobs into a workflow

Read the Hydra Studio canvas

Hydra CLI reference

#### Next lesson

You can now trace a job beyond the editor. The next lesson adds a second job tab, places both saved jobs on Workflow configuration, and connects them into an ordered dependency graph.

Compose jobs →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Compose jobs into an ordered workflow in Hydra Studio — slug: /studio/12-compose-jobs/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons25 · Compose jobs▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 32

Lesson 32 of 65 · Compose jobs

### Compose jobs into an ordered workflow in Hydra Studio

Two jobs, one arrow. The workflow decides when each runs — never what data passes between them.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Workflow configurationabout 15 minutesa job that runs

Quick answer
To order two jobs in a Hydra workflow, import both into Workflow configuration and draw an edge from the first to the second. The edge is written as a depends_on line: it decides when each job runs, never what data passes between them. Run the pair and read the log to confirm the order.

#### What will you learn in this lesson?

##### Goal

Bring a second job into the workflow, order the two with an edge, run the pair, and read the log closely enough to learn what an arrow does — and what it does not.

Course project
Keep one cumulative Studio project named studio-course with one manual workflow, first-workflow. first-job reads orders.csv, keeps the paid orders and writes outputs/paid_orders.csv. This lesson adds second-job, which reads that file and writes outputs/paid_summary.csv.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A first job that already runs.

#### How do I order jobs in a Hydra Studio workflow?

##### 01Bring in a second job

###### Objective

Add a job to a workflow that already holds one.

###### Actions

Open Workflow configuration.

Select Import, then Import a job.

Pick the folder of the job you want to add.

Workflow configuration → Import → Import a job

Nothing distinguishes the second job from the first: same gesture, same four manifests, same result. A workflow does not care how many jobs it holds, only how they are ordered.

What you should see
The canvas still shows one node and the palette still counts one job — until the import completes.

first-workflow 1 nodes · 0 edges Valid
Jobs (1)
first-job

[image: The workflow canvas holding a single first-job node, with the Import menu open on the Import a job entry.]

One job on the canvas, and the menu that will bring the second.

##### 02Order the two with an edge

###### Objective

Say which job waits for which.

###### Actions

Place the second node to the right of the first, if it is not already there.

Drag from the right handle of first-job to the left handle of second-job.

Read the counters in the header.

first-job → second-job

That single arrow is the whole composition. It becomes a depends_on in the manifest, and it means one thing only: second-job starts after first-job has finished. Without it, the two would be independent and could run at the same time.

What you should see
Two nodes, one edge, and the workflow still reading Valid.

first-workflow 2 nodes · 1 edges Valid
first-job → second-job

[image: The workflow canvas with first-job and second-job joined by one edge, and the palette listing both jobs under Jobs.]

Two jobs, one arrow. Run Workflow now covers both.

##### 03Run the pair

###### Objective

Execute the whole graph and confirm the order was respected.

###### Actions

Select Run Workflow.

Open the Logs tab.

Read the two step blocks from top to bottom.

Workflow configuration → Run Workflow

One run, two steps, in the order the edge imposed. Each step reports its own counters and its own job_path — a workflow log is a stack of job logs with a summary on top.

What you should see
Two blocks, each ending on OK, and a total duration greater than either step alone.

Run <run id> — first-workflow [SUCCESS]
Total duration: <observed>s
- step first-job : ✓ success (<observed>s)
rows_in=20 rows_out=14
- step second-job : ✓ success (<observed>s)
rows_in=14 rows_out=14

[image: The workflow canvas after Run Workflow: the first-job and second-job nodes are both outlined in green, the sign that each step succeeded.]

Both job nodes are outlined in green once the run succeeds.

##### 04Read what the arrow did, and what it did not do

###### Objective

Learn the single most important thing about composing jobs.

###### Actions

Compare rows_out of the first step with rows_in of the second.

Open Jobs configuration, then the second-job tab, and open its source.

Read the file path it reads.

rows_out=14 → rows_in=14

The first job wrote 14 rows and the second read 14. That match is not the arrow's doing. The source of second-job points at ../../outputs/paid_orders.csv, the very file first-job writes. The arrow only guarantees that the file is finished before the second job opens it.

An edge orders, it does not connect
A workflow edge is a dependency, not a pipe. It says run this one after that one and nothing more. No data travels along it, and no column is passed. To chain two jobs on data, the second must read the file the first wrote — you declare that in its source, not on the canvas.

What you wantWhere you declare it

Run B after AAn edge on the workflow canvas

B reads what A wroteThe source of B, pointing at the destination of A

Both at onceBoth — they are independent decisions

What you should see
Two job_path lines naming two different folders, and the second job reading exactly as many rows as the first wrote.

job_path=…\studio-course\jobs\first-job rows_in=20 rows_out=14
job_path=…\studio-course\jobs\second-job rows_in=14 rows_out=14

##### 05Read the composition as YAML

###### Objective

Find the arrow in the file, and confirm it is the only trace of it.

###### Actions

Select Hydra DSL in the top bar.

Read the two entries under steps.

Find depends_on on the second one.

Workflow configuration → Hydra DSL

Two steps, and one depends_on. The first has none, so it starts immediately; the second names the first, so it waits. Add a third job with the same dependency and the two would run in parallel — order comes from the names, never from the positions on the canvas.

version: "1.0"
workflow:
name: first-workflow
trigger:
type: manual
steps:
- name: first-job
type: job
job: ../jobs/first-job
- name: second-job
type: job
job: ../jobs/second-job
depends_on:
- first-job

How a job step is written
Each job node becomes a step with type: job and a job path to its folder, here ../jobs/first-job. The step name is the node's step name; here it is the job's name. An action node becomes type: action with an action name.

What you should see
One depends_on for one arrow. Nothing else in the file describes the relationship.

[image: The workflow scene with the Hydra DSL panel open, showing two steps and a depends_on linking second-job to first-job.]

The panel is marked synced: the arrow you drew is the depends_on you read.

###### Tips and tricks

Import → Import a job adds a second job with the same gesture as the first.

An edge leaves a right handle and enters a left handle.

An arrow orders jobs. It does not pass rows: the first job must write a file or table that the second job reads.

A container never runs. Five nodes on screen can mean four steps in the YAML.

#### What should I have at the end?

VerificationExpected result

ImportThe second job appears as a node and in the palette

EdgeThe header reads 2 nodes · 1 edges

RunTwo steps, in the order of the arrow

CountersEach step reports its own rows_in and rows_out

PathsTwo different job_path lines

YAMLOne depends_on for one arrow

#### What if something goes wrong?

SymptomCauseFix

The second step ignores the first's outputAn edge orders, it does not pass dataPoint the source of the second job at the destination of the first

Both steps start togetherNo edge between themDraw one from the right handle to the left handle

The edge refuses to connectWrong handle, or wrong directionAlways leave a right handle and enter a left one

The second job reads nothingThe first has not written yet, or wrote elsewhereCheck the destination path of the first against the source of the second

#### Frequently asked questions

##### Does an edge between two jobs pass data?

No. It only orders the jobs. If the second job needs the first job's output, the first job must write it to a file or table that the second job reads.

##### How is an edge written in workflow.yaml?

As a depends_on list on the later step, naming the earlier step.

##### How is a job step written in workflow.yaml?

As a step with type: job and a job: path, such as job: ../jobs/first-job.

##### Can a workflow hold more than two jobs?

Yes. A workflow does not care how many jobs it holds, only how they are ordered.

#### Related lessons

Run a job

Read the YAML Studio generates

Organize steps with containers

workflow.yaml reference

#### Next lesson

Two jobs now run in order. The last lesson asks what happens when one of them fails — and how a container decides whether the rest carries on.

Use containers →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra Studio containers: Sequence, Error Scope and Retry Scope — slug: /studio/13-handle-failure/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons32 · Use containers▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 39

Lesson 39 of 65 · Use containers

### Hydra Studio containers: Sequence, Error Scope and Retry Scope

Use Sequence, Error, and Retry containers to group workflow steps, control failure behavior, and keep the canvas readable.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Containersabout 15 minutesworkflow configuration open

Quick answer
Hydra Studio has three containers: Sequence, Error Scope and Retry Scope. They group workflow steps and keep the canvas readable. A container never runs: Error Scope and Retry Scope copy their failure or retry policy onto the steps inside them when the YAML is written, and Sequence only groups.

#### What will you learn in this lesson?

##### Goal

Find the Containers category, compare its three container types, place first-job inside each relevant scope, and learn how to collapse, detach, and configure the container from the workflow canvas.

Course project
Continue with studio-course, the manual first-workflow, and the saved first-job from the preceding lessons. Do not create a parallel replacement project.

##### Prerequisites

The top bar shows API online.

first-workflow is open in the editor.

first-job is available under Jobs in the node palette.

#### How do I use containers in a Hydra Studio workflow?

##### 01Find the Containers category

###### Objective

Locate the grouping tools in the node palette.

###### Actions

Open first-workflow.

Stay on the current canvas while you scan the node palette.

Find Containers (3) below Destinations.

NODE PALETTE → Containers

What you should see
The orange Containers (3) category appears below the workflow actions and control-flow nodes.

[image: Hydra Studio canvas with the Containers category highlighted in the node palette]

Find the category. It appears in the palette while you are still looking at the current job canvas.

##### 02Compare the three container types

###### Objective

Choose a container from the behavior you need rather than from its appearance.

###### Actions

Expand Containers (3).

Read Sequence Container, Error Scope, and Retry Scope.

Keep the category open for the next steps.

Containers (3) → expand

What you should see
Sequence Container — group ordered steps
Error Scope — choose behavior after child failure
Retry Scope — retry a failed child

[image: Expanded Containers category showing Sequence Container, Error Scope, and Retry Scope]

Three containers, three purposes. Sequence organizes; Error and Retry add failure behavior.

##### 03Group a job in a Sequence

###### Objective

Make first-job a child of a Sequence container and use its compact view.

###### Actions

Select Workflow configuration.

Drag Sequence Container onto empty canvas space.

Drag first-job inside the orange frame.

Release the job only when it is visibly contained.

Select the chevron in the container header to collapse it, then expand it again.

Sequence Container ← first-job → collapse / expand

What you should see
The expanded container shows the job on the canvas. The collapsed container keeps a compact child list and displays a count of 1.

[image: Expanded Sequence container with first-job placed inside it]

Expanded Sequence. The job is visibly positioned inside the orange parent frame.

[image: Collapsed Sequence container listing first-job and showing one child]

Collapsed Sequence. The child remains attached and is listed in the compact container.

##### 04Detach a step from its container

###### Objective

Remove the parent relationship without deleting either the job or the container.

###### Actions

Expand the Sequence container.

Open the context menu on first-job.

Select Remove from container.

Move the detached job to empty canvas space if needed.

first-job → More → Remove from container

What you should see
The job remains on the workflow canvas as an independent node. The Sequence container remains available and becomes empty.

[image: Context menu for first-job with Remove from container highlighted]

Detach, do not delete. Remove from container preserves the workflow step while removing its parent relationship.

##### 05Choose an Error Scope policy

###### Objective

Control what the workflow does when a child inside the scope fails.

###### Actions

Drag Error Scope onto the canvas.

Move first-job inside the red frame.

Open On child failure in the container header.

Compare skip, continue, and fail, then select the behavior required by the workflow.

Error Scope ← first-job → On child failure

What you should see
The selected behavior appears in the container header and in the inspector's On failure field.

skip — skip the failed child path
continue — continue after the failure
fail — fail the workflow

[image: An Error Scope on the workflow canvas, with its On child failure policy set to skip.]

The policy sits in the scope header: On child failure.

[image: Error Scope containing first-job with the skip, continue, and fail policy menu open]

Choose explicitly. The Error Scope exposes the failure policy directly above its child.

##### 06Configure a Retry Scope

###### Objective

Retry a failed child a limited number of times with a delay between attempts.

###### Actions

Drag Retry Scope onto empty canvas space.

Move first-job inside the cyan frame.

Set Retries to 3.

Set delay to 5 seconds.

Retry Scope ← first-job → 3 retries × 5 s

What you should see
The Retry Scope header displays both values and the job remains visibly inside the scope.

Retries 3 ×, delay 5 s

[image: Retry Scope containing first-job and configured for three retries with a five-second delay]

Bound the retries. Both the attempt count and delay belong to the container that owns the child step.

###### Tips and tricks

Set the policy once on the container instead of on every step.

A policy reaches only what sits inside the container. A node beside it gets nothing.

A child that sets its own value keeps it: the container fills the blanks, it does not overrule.

Collapse a container to keep a long workflow readable, and detach a step to take it out safely.

#### What should I have at the end?

VerificationExpected result

PaletteSequence Container, Error Scope, and Retry Scope are visible

Sequencefirst-job stays attached in expanded and collapsed views

DetachmentThe job remains on the canvas after Remove from container

Error Scopeskip, continue, and fail are available

Retry ScopeThree retries and a five-second delay are visible

#### What if something goes wrong?

SymptomCauseFix

The job does not collapse with the SequenceIt overlaps the frame but is not a childDrag it out, then drop it again inside the expanded container

The job disappears after an actionDelete was selected instead of Remove from containerUndo the deletion, then use the job context menu to detach it

Error behavior is unexpectedThe wrong On child failure option is selectedOpen the Error Scope menu and confirm skip, continue, or fail

The retry takes too longThe retry count or delay is too highReduce the values in the Retry Scope header

#### Frequently asked questions

##### What are the containers in Hydra Studio?

Sequence, which only groups; Error Scope, which sets what happens when a child fails (skip, continue or fail); and Retry Scope, which sets the number of retries and the delay.

##### Do containers appear in workflow.yaml?

No. Containers are visual. Their policy is copied onto the enclosed steps, as on_failure or retry, when the YAML is written.

##### What are the on_failure values?

fail stops the workflow, skip marks the step skipped and continue carries on.

##### Can a step override its container?

Yes. A child that sets its own value keeps it.

#### Related lessons

Read the Hydra Studio canvas

Order jobs in a workflow

Use parameters

workflow.yaml reference

#### Next lesson

The workflow now survives a failing step. One thing is still fixed in stone: every value it uses is written into a manifest. The last lesson moves those values onto the canvas, where a run can change them as it goes.

Use parameters →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Use parameters in Hydra Studio: Set Param and Assign Param — slug: /studio/14-use-parameters/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons21 · Parameters▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 28

Lesson 28 of 65 · Use parameters

### Use parameters in Hydra Studio: Set Param and Assign Param

Two jobs contain the same line. They produce different files, because the workflow changed a value between them.

By Bechir Bejaoui (LinkedIn) · Published 4 November 2026 · Last verified 22 November 2026 · Tested with Hydra ETL 0.22.0 (Studio source and API checks on Linux)

Set Param · Assign Paramabout 25 minutesa workflow that runs

Quick answer
To use a parameter in Hydra Studio, write {{ param:region }} in a manifest, create the value with a Set Param action and change it later with an Assign Param action. Jobs that run after the change read the new value, so one manifest produces two different results in a single workflow run.

#### What will you learn in this lesson?

##### Goal

Stop hard-coding values into manifests. Write {{ param:region }} once, let the workflow decide what it means, and change that meaning halfway through a run.

A ready-made workflow
This lesson uses parameters_demo, a project that ships with the engine under test_scenarios. Open it with Open a project — everything below is already wired, so you can read rather than type. Rebuild it any time with python build_demo.py.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A workflow you have already run once.

#### How do I use parameters in a Hydra Studio workflow?

##### 01Read the shape of the workflow

###### Objective

See where the parameter actions sit among the jobs.

###### Actions

Open Workflow configuration.

Read the seven nodes from left to right.

Check the counters and the validity badge.

Workflow configuration → parameters-workflow

Seven steps, one line. Two of them are jobs; the other five are actions, and three of those exist only to handle a parameter. A parameter action is an ordinary step: it takes its turn in the graph like any other.

What you should see
A single chain, no branches, and the workflow reading Valid.

parameters-workflow 7 nodes · 6 edges Valid

set_label → set_region → announce → filter-orders
→ switch_region → summarize-orders → report

[image: The workflow canvas showing seven nodes in one chain: set_label, set_region, announce, filter-orders, switch_region, summarize-orders and report.]

Seven nodes, six edges. The order is the whole point — a parameter only exists for the steps that follow it.

##### 02Separate the jobs from the actions

###### Objective

Know which nodes do the work and which only set the stage.

###### Actions

Expand Jobs in the palette.

Count the entries.

Match them against the nodes on the canvas.

Node palette → Jobs (2)

Only two of the seven nodes are jobs. Everything else is an action, and actions never move data — they announce, they wait, they decide. Here, three of them do nothing but manage one value.

NodeKindWhat it contributes

set_label, set_regionSet ParamCreates a value

switch_regionAssign ParamChanges a value

announce, reportLogPrints the values back

filter-orders, summarize-ordersJobReads the values and moves data

What you should see
Two jobs in the palette, five actions on the canvas.

Jobs (2)
filter-orders
summarize-orders

[image: The node palette with the Jobs category expanded, listing filter-orders and summarize-orders.]

Two jobs among seven nodes. The rest are actions.

##### 03Create the first parameter

###### Objective

Fill in a Set Param and understand its three fields.

###### Actions

Double-click set_label.

Read Parameter name, Value and Type.

Close the dialog.

Set Param → run_label = demo-run

A name, a value, a type. Set Param creates: it fails if the name is already in the run, which makes it safe to place at the top of a graph and nowhere else. The value lands in a store that lives for the length of one run, and disappears with it.

What you should see
The dialog header states the rule, and the two required fields carry a red asterisk.

Set Param ACTION
Creates a runtime parameter (fails if it already exists)
STEP NAME set_label
PARAMETER NAME * run_label
VALUE * demo-run

[image: The Set Param dialog for the step set_label, with parameter name run_label and value demo-run.]

Three fields, and a sentence in the header that tells you exactly when this action fails.

##### 04Create the parameter the jobs will read

###### Objective

Add the second value, the one this whole lesson turns on.

###### Actions

Double-click set_region.

Read the name and the value.

Note the Type menu below the value.

Set Param → region = north (type: str)

Same dialog, different name. Type matters more than it looks: str, int, float, bool and json decide what the value is, not just how it prints. A parameter typed int can be compared with a number; the same value typed str cannot.

What you should see
A second Set Param, identical in shape, holding the value the first job will use.

Set Param ACTION
STEP NAME set_region
PARAMETER NAME * region
VALUE * north
TYPE str

[image: The Set Param dialog for the step set_region, with parameter name region and value north.]

The value that filter-orders is about to read, written on the canvas rather than in a manifest.

##### 05Read a parameter back

###### Objective

Learn the one syntax you need, and where it works.

###### Actions

Double-click announce.

Read the Message field.

Find the two placeholders.

{{ param:run_label }} {{ param:region }}

One syntax, everywhere: {{ param:NAME }}. It works in a message, in a file path, in a filter expression, in a connection string. Its sibling {{ env:NAME }} reads an environment variable instead — same braces, different source.

A placeholder alone keeps its type
When a field holds nothing but a placeholder, the value arrives with its declared type intact — a number stays a number. Surround it with text and the result is a string, because you asked for a sentence.

What you should see
Two placeholders inside one sentence, unresolved on screen and resolved at run time.

Log ACTION
Writes a message to the run logs (always succeeds)
MESSAGE Starting {{ param:run_label }} on region {{ param:region }}

[image: The Log dialog for the step announce, whose message contains the placeholders param run_label and param region.]

The editor shows the placeholder. The log will show the value.

##### 06Change a value mid-run

###### Objective

Use the second parameter action, and learn how it differs from the first.

###### Actions

Double-click switch_region.

Compare the header with the one from step 03.

Read the new value.

Assign Param → region = south

The dialog is identical; the rule is the opposite. Assign Param changes: it fails if the parameter does not exist yet. Together the two actions cover the whole lifecycle, and neither can silently do the other's job — the failure is the feature.

ActionDoesFails when

Set ParamCreates the parameterThe name already exists in this run

Assign ParamReplaces its valueThe name does not exist yet

What you should see
The same three fields, under a header that announces a different contract.

Assign Param ACTION
Assigns a value to an existing runtime parameter
STEP NAME switch_region
PARAMETER NAME * region
VALUE * south

[image: The Assign Param dialog for the step switch_region, changing region to south.]

Same fields as Set Param. Read the second line of the header — that is the whole difference.

##### 07Read it back after the change

###### Objective

Confirm that the placeholder is resolved late, not once.

###### Actions

Double-click report.

Compare its message with the one in announce.

Note that the placeholder is written identically.

Finished {{ param:run_label }} - last region was {{ param:region }}

The two Log steps contain the same placeholder, and will print different regions. A placeholder is resolved when its step runs, against the store as it stands at that moment — not when the workflow is saved.

What you should see
An identical placeholder in a step that sits after the change.

Log ACTION
STEP NAME report
MESSAGE Finished {{ param:run_label }} - last region was {{ param:region }}

[image: The Log dialog for the step report, containing the same two placeholders as the announce step.]

Same text as announce. Position in the graph is what makes the answer differ.

##### 08Run it and read the timeline

###### Objective

Watch the seven steps take their turn.

###### Actions

Select Run Workflow.

Open the run from Runs.

Read the execution timeline top to bottom.

Run Workflow → Runs → parameters-workflow

Three parameter actions cost about three milliseconds together, against roughly fifty for each job. Managing a value is free; the work is elsewhere. The timeline also proves the order was respected, which is what makes the whole thing predictable.

What you should see
Seven steps, all green, and two visibly longer bars.

parameters-workflow #91fca442 Success
Duration 0.102s Steps 7 ok / 7

set_label 0.001s
set_region 0.002s
announce 0.001s
job_…_0 0.048s
switch_region 0.000s
job_…_1 0.048s
report 0.000s

[image: The run detail page showing a successful workflow with seven steps and an execution timeline.]

Seven bars. The two long ones are the jobs; everything else is bookkeeping.

##### 09Watch the value change in the log

###### Objective

Find the two lines that prove the whole lesson.

###### Actions

Expand step #2 set_region.

Expand step #5 switch_region.

Read one line in each.

region: 'north' -> 'south'

Every write to the store is logged, with the old value and the new one. That single arrow is where you debug a parameter: if a job behaves unexpectedly, read the last write before it and you have your answer.

What you should see
One creation, one replacement, both named and timestamped.

#2 set_region
INFO [set_region] START type=action
INFO [set_region] set_param region='north' (type=str)

#5 switch_region
INFO [switch_region] START type=action
INFO [switch_region] assign_param region: 'north' -> 'south'

[image: The run log with the set_region and switch_region steps expanded, showing the parameter being created as north and then reassigned to south.]

The two lines the whole lesson turns on. filter-orders ran between them.

##### 10Look at what the jobs wrote

###### Objective

See the consequence outside Studio.

###### Actions

Open the output folder of the project.

Read the two file names.

Open transformations.yaml of either job.

output/demo-run_orders_north.csv
output/demo-run_summary_south.csv

Neither job knows the word north or south. Both contain region == '{{ param:region }}' and a destination path built from the same two placeholders. The names differ because the value did — and a parameter that builds a path is as useful as one that filters rows.

Two layers, one syntax
Values also come from parameters.yaml and environments/<env>.yaml, edited in the Parameters tab. Those are the project layer: declared once, fixed for the whole run. What Set Param writes is the runtime layer, and it wins. In this workflow min_amount comes from the project layer and is never touched.

What you should see
Two files, two names, one manifest each.

demo-run_orders_north.csv
id,order_date,region,customer,amount
1006,2026-01-08,north,Farid,220.4
1001,2026-01-04,north,Alice,120.5

demo-run_summary_south.csv
region,orders,revenue,average_order
south,4,597.2,149.3

###### Tips and tricks

Write the placeholder once and let the workflow decide what it means.

Set Param fails when the parameter already exists. Use Assign Param to change an existing value.

Run the workflow once before you change values, so you know the baseline result.

Use Assign Param between two jobs to make the second one answer differently from the first.

#### What should I have at the end?

VerificationExpected result

CanvasSeven nodes, six edges, Valid

PaletteTwo jobs among seven nodes

Set ParamName, value and type filled in

Assign ParamThe same fields, a different header

Run7 ok / 7

LogA set_param line and an assign_param line

OutputTwo files whose names carry the parameter values

#### What if something goes wrong?

SymptomCauseFix

The parameter already existsTwo Set Param on the same nameKeep one, turn the other into an Assign Param

The parameter does not existAssign Param with no Set Param upstreamAdd a Set Param and connect it before

The placeholder prints as writtenThe syntax is not exactly {{ param:NAME }}Check the braces, the colon and the spelling

A job ignores the valueThe parameter action runs after itMove it upstream and redraw the edge

A numeric comparison misbehavesThe value is typed strSet the Type menu to int or float

The value is not what the log saidA later Assign Param changed itRead the writes in order and find the last one

#### Frequently asked questions

##### What is the syntax of a parameter in Hydra?

{{ param:name }}, for example {{ param:region }}.

##### What is the difference between Set Param and Assign Param?

Set Param creates a runtime parameter and fails if it already exists. Assign Param changes the value of an existing one.

##### Can a value change in the middle of a run?

Yes. The workflow can assign a new value between two jobs, and the second job then reads the new value.

##### Where do I learn about environments and secrets?

They are covered in the lessons on environments and secrets, coming soon in the Settings block.

#### Related lessons

Order jobs in a workflow

Run a job

Use the palette

workflow.yaml reference

#### Next lesson

The Studio track is complete. You opened a workspace, built and ran a job, reviewed its execution, composed a workflow, organized it with containers, and made it react to values decided at run time. Return to the course map or open the DSL reference.

Return to the course map →Back to the previous lesson

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Make a load all-or-nothing in Hydra ETL Studio — slug: /studio/all-or-nothing-load/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons35 · All-or-nothing load▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 42

Lesson 42 of 65 · All-or-nothing load

### Make a load all-or-nothing in Hydra ETL Studio

A load that fails at batch three should not leave you with two batches of new data and a broken file. Make it all or nothing.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

destinations.yaml → atomicabout 20 minutesthe resilience-demo project

Quick answer
A Hydra ETL load is all-or-nothing when the destination setting atomic is on. If one batch fails, the destination keeps its previous content. In replace mode it is on by default; atomic: false turns it off, and the batches already written then stay in the file.

#### What will you learn in this lesson?

##### Goal

Load a file in batches, make one batch fail, check that the destination still holds its previous content, then turn the protection off to see the difference. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilience-demo copy of fallbackproject. The job atomic_demo reads Data/big.csv in batches of 1,000 rows, casts amount to an integer and replaces outputs/atomic_demo.csv, which holds one line, OLD,0. Row 2,200 of big.csv contains abc instead of a number.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I make a load all-or-nothing in Hydra ETL?

##### 01Find the atomic setting

###### Objective

Find where all-or-nothing is set for this destination.

###### Actions

Open a terminal in the project folder.

Print the destination file of the job.

Get-Content jobs\atomic_demo\destinations.yaml

The setting is called atomic. Here it is absent, so the default applies: in replace mode, all-or-nothing. In Studio, the dialog of a database destination (MySQL, PostgreSQL and the others that support it) has a list All-or-nothing with the choices default, yes and no. A CSV destination has no such list: you write atomic: in the YAML file, under load:.

What you should see
The destination dst of type csv, with mode: replace and no atomic line.

version: '1.0'
destinations:
dst:
type: csv
connection: {}
load:
table: ../../outputs/atomic_demo.csv
mode: replace

[image: The Studio terminal showing jobs/atomic_demo/destinations.yaml, a CSV destination in replace mode without an atomic line.]

No atomic line: the default applies.

##### 02Run a load that fails

###### Objective

See the destination protected from a failure in the middle of a load.

###### Actions

Open a terminal in the project folder.

Run the workflow.

Print the destination file.

hdrctl workflow run wf_atomic_demo

Two batches of 1,000 rows are valid. The third fails when it reaches row 2,200. Without protection the first two batches would already be in the file.

What you should see
A failed workflow, and a file that still holds its single old line.

✗ Step 'atomic_demo' FAILED: ValueError: Step 1/1: cast: cannot convert column='amount' to type='int': Unable to parse string "abc" at position 199
❌ Workflow 'wf_atomic_demo' FAILED in <duration> — Step 'atomic_demo' failed: ValueError: Step 1/1: cast: cannot convert column='amount' to type='int': Unable to parse string "abc" at position 199

id,amount
OLD,0

[image: The Studio terminal after a failed load of wf_atomic_demo, followed by the content of outputs/atomic_demo.csv.]

The run fails, and the old file is intact.

##### 03Turn all-or-nothing off

###### Objective

Measure what the protection saves you.

###### Actions

Add atomic: false under load: in jobs/atomic_demo/destinations.yaml.

Run the workflow again.

Count the lines of the file.

atomic: false

The workflow fails on the same row, but the destination now holds what the first two batches wrote:

What you should see
The same error, and a file that is no longer the old one.

❌ Workflow 'wf_atomic_demo' FAILED in <duration> — Step 'atomic_demo' failed: ValueError: …

lines in outputs/atomic_demo.csv: 2001

##### 04Fix the data and load again

###### Objective

Finish with a clean load.

###### Actions

Remove the atomic: false line.

Replace Data/big.csv with the valid file.

Run the workflow.

hdrctl workflow run wf_atomic_demo

With 2,500 valid rows, the workflow completes and replaces the file in one piece.

What you should see
A completed workflow and a file of 2,501 lines.

✓ Step 'atomic_demo' OK (<duration>)
✅ Workflow 'wf_atomic_demo' completed in <duration> — 1/1 steps OK

lines in outputs/atomic_demo.csv: 2501

###### Tips and tricks

Keep the default for replace mode. Turn atomic off only when partial progress is useful and you can restart from it.

Set batch_size on the source: smaller batches fail earlier and waste less work.

All-or-nothing protects one destination. A workflow that wrote other files before the failure needs a rollback, the subject of the next lesson.

Remove atomic: false after the experiment: leaving it off in a shared project hides the problem.

#### What should I have at the end?

VerificationExpected result

Failed runThe workflow fails on cast and names the column and the value

Protected fileoutputs/atomic_demo.csv still holds OLD,0

Unprotected fileWith atomic: false the file has 2,001 lines

Clean loadWith a valid file, the destination has 2,501 lines

#### What if something goes wrong?

SymptomCauseFix

The file changed although the run failedatomic: false is set on the destinationRemove the line, or set atomic: true

The run does not failData/big.csv is the valid fileCopy Data/big_bad.csv over it

Nothing about batches in the logThe source has no batch_sizeAdd batch_size: 1000 to the source extract settings

#### Frequently asked questions

##### What does all-or-nothing mean in Hydra ETL?

If a batch fails during a load, the destination keeps exactly what it had before the run. Nothing from the batches already processed is published.

##### Is all-or-nothing on by default?

In replace mode, yes. In our test of a CSV destination in replace mode, the file kept its previous content after a failure in the third batch. The default differs by destination type, and the dialog states it in the label of the setting.

##### What happens with atomic set to false?

The batches that succeeded stay in the destination. In our test the file held 2,001 lines, the header and the 2,000 rows of the first two batches.

##### Which batch failed in the test?

The third. With batches of 1,000 rows, row 2,200 is the 200th row of the third batch, and the error message points at position 199 of that batch.

#### Related lessons

Roll back a failed workflow

Declare the undo of an action

Resolve conflicts and recover

workflow.yaml reference

The hdrctl command line

#### Next lesson

The next lesson goes one level up: it undoes the steps of a whole workflow when one of them fails.

Roll back a failed workflow →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Branch a Hydra Studio workflow with the Condition node — slug: /studio/branch-with-the-condition-node/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons43 · Condition▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 50

Lesson 50 of 65 · Condition

### Branch a Hydra Studio workflow with the Condition node

The Condition node turns a comparison into a true or false variable. Steps that follow read it in their run condition, so one workflow can take two paths.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Conditionabout 15 minutesHydra ETL 0.22

Quick answer
The Condition node of Hydra Studio evaluates a comparison and stores the result in a variable. A later step reads it with when: "{{ param:big }}" and runs only if it is true. In our test, a count of 15 above 10 ran the big path and skipped the other.

#### What will you learn in this lesson?

##### Goal

Read the Condition dialog, write a workflow with two branches, run it, and see which step runs and which is skipped.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A terminal: PowerShell on Windows.

#### How do I branch a workflow with a Condition?

##### 01Open the Condition dialog

###### Objective

Read what the node asks for.

###### Actions

Open a workflow in Workflow configuration.

Expand Control Flow, drag Condition onto the canvas and double-click it.

Select Structured.

Palette → Control Flow → Condition

The dialog says it evaluates a condition into a variable (used by downstream when). The result variable name is the name later steps use, as {{ param:<name> }}. Two modes follow: Expression for a free boolean expression, and Structured for a left value, an operator and a right value.

What you should see
A dialog with a CONTROL_FLOW badge, the result variable name, the two mode buttons, and the three structured fields.

Condition CONTROL_FLOW
Result variable name: check
[ Expression ] [ Structured ] {{ param:count }} == 10

[image: The Condition node dialog of Hydra Studio in the light theme, Structured mode selected: a step name, a result variable name field, Expression and Structured buttons, and left, operator and right fields.]

The Condition dialog in Structured mode.

##### 02Write a workflow with two branches

###### Objective

See the same logic as YAML.

###### Actions

Create a folder cond-demo with a workflows folder inside.

Save the YAML below as workflows\wf_branch.yaml.

workflows\wf_branch.yaml

set_count creates a runtime parameter count with the value 15. check compares it with 10 and stores the result in big. The two log steps both depend on check and carry opposite when guards.

version: "1.0"
workflow:
name: wf_branch
trigger:
type: manual
steps:
- name: set_count
type: action
action: set_param
params:
name: count
value: 15
type: int
- name: check
type: action
action: condition
params:
name: big
mode: structured
left: "{{ param:count }}"
op: ">"
right: "10"
depends_on: [set_count]
- name: big_batch
type: action
action: log
params:
message: "Big batch path"
when: "{{ param:big }}"
depends_on: [check]
- name: small_batch
type: action
action: log
params:
message: "Small batch path"
when: "not {{ param:big }}"
depends_on: [check]

What you should see
A file of 37 lines.

##### 03Validate the workflow

###### Objective

Check the file before you run it.

###### Actions

Open a terminal in the cond-demo folder.

Run the command below.

hdrctl workflow validate workflows\wf_branch.yaml

Validation checks the actions, keys, parameters and dependencies without running anything.

What you should see
A confirmation line.

Workflow valid — no errors detected.

##### 04Run it and read the two branches

###### Objective

See one path run and the other skipped.

###### Actions

Run the command below.

Find the skipped step.

hdrctl workflow run workflows\wf_branch.yaml

Because 15 is greater than 10, big is true: big_batch runs and logs its message, and small_batch is skipped. Change value: 15 to 5 and run again to take the other path.

What you should see
Four steps OK, one of them reported as skipped.

✓ Step 'set_count' OK (0.0s)
✓ Step 'check' OK (0.0s)
⏭ Step 'small_batch' skipped
✓ Step 'big_batch' OK (0.0s)
| Big batch path

Workflow 'wf_branch' completed in 0.0s — 4/4 steps OK

[image: The Hydra Studio terminal in the dark theme after running the wf_branch workflow: set_count and check are OK, small_batch is skipped, big_batch is OK with the message Big batch path, and the workflow completed with 4 of 4 steps OK.]

The same run, from the Studio terminal.

###### Tips and tricks

Name the result variable after the question it answers, for example big or file_ready.

Write the opposite branch with not {{ param:name }}.

A skipped step counts as a normal outcome. The workflow still ends with all steps OK, so check the skipped lines when you read a run.

Keep the depends_on of both branches on the Condition step, so they only start after it has decided.

#### What should I have at the end?

VerificationExpected result

DialogResult variable name, Expression and Structured modes

Validationhdrctl workflow validate prints Workflow valid

Run with count 15big_batch runs, small_batch is skipped

Run with count 5small_batch runs, big_batch is skipped

#### What if something goes wrong?

SymptomCauseFix

Both branches runA step has no when guardAdd a when to every step that depends on the condition

Neither branch runsThe variable name in when differs from the result variable nameUse the same name in both places

One step shows skippedIts when guard is falseThis is the expected outcome on the branch not taken

Workflow file not foundThe path is wrongRun the command from the folder that holds workflows

#### Frequently asked questions

##### What does the Condition node do in Hydra Studio?

It evaluates a condition and stores the true or false result in a variable. Steps that come after it read that variable in their run condition, written when in YAML, so a step runs only on the matching branch.

##### How do I make a step run only when a condition is true?

Give the Condition node a result variable name, such as big, then set the Run condition (when) of the downstream step to {{ param:big }}. For the opposite branch, use not {{ param:big }}.

##### What is the difference between Expression and Structured mode?

Structured mode compares a left value and a right value with an operator such as ==, !=, <, <=, > or >=, or contains. Expression mode takes a free boolean expression with comparisons, and, or and not, evaluated without running any code.

##### What happens to the step on the other branch?

It is skipped. In our test the run reported Step 'small_batch' skipped, and the workflow still completed with all steps OK.

##### Where does the value being compared come from?

From a project parameter, an environment variable or a runtime parameter, written as {{ param:name }}. In our test a set_param step created count with the value 15 before the condition ran.

#### Related lessons

Wait with the Delay node

Use the node palette

Use parameters

Hydra DSL reference

#### Next lesson

You can branch a workflow. Next, learn how to group steps and run them in stages.

Compose jobs →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Break a Hydra ETL pipeline on purpose, then recover — slug: /studio/break-it-then-recover/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons49 · Scenario 2▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 61

Lesson 61 of 65 · Scenario

### Break a Hydra ETL pipeline on purpose, then recover

You only know that a protection works when you have seen it trigger. Break the pipeline four ways, and read what each protection does.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

hdrctl run · Runs pageabout 30 minutesthe resilient-pipeline project

Quick answer
Break the resilient project on purpose: delete the input, so a fallback loads the backup; make the service fail beyond its retries, so the project stops; break the last step of the report, so it is rolled back and replaced by a quarantine workflow; shorten the timeout, so the workflow is stopped. Each case prints a different line.

#### What will you learn in this lesson?

##### Goal

Cause four failures, read the line that tells which protection reacted, and put the project back in its working state. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilient-pipeline project of lesson 60. Each failure is created by renaming a file or editing one value, and undone afterwards.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I test the failure handling of a Hydra ETL project?

##### 01Delete the input file

###### Objective

Make the load fallback trigger.

###### Actions

Rename Data/orders.csv to orders.csv.off.

Run the project.

Open the run.

hdrctl run .

The condition of wf_load is true, so the backup runs. It loads 8 rows, which makes the condition of wf_report true as well: the two fallbacks chain.

What you should see
Two fallback lines, and a project that completes.

↪ Fallback: wf_load → wf_load_backup — file_exists('Data/orders.csv') = false (not found)
▶ Workflow wf_load_backup (fallback, in place of wf_load)
↪ Fallback: wf_report → wf_report_quarantine — previous.rows = 8
▶ Workflow wf_report_quarantine (fallback, in place of wf_report)
✅ Project 'resilient-pipeline' completed in <duration> — 4/4 workflow(s) OK

[image: The run detail page of the resilient pipeline with wf_load and wf_report replaced by their fallbacks.]

Two workflows were replaced by their backups.

##### 02Make the service fail beyond its retries

###### Objective

See what a retry cannot save.

###### Actions

Put orders.csv back.

Replace the script of call_service with raise SystemExit('service unavailable').

Run the project.

hdrctl run .

The step is tried again three times, then fails. wf_flaky has no fallback, so the project stops, and wf_archive, in the same stage, does not run.

What you should see
A failed step, a failed workflow and a failed project. In the step log of the run page, three WARNING lines [call_service] failed, retry 1/3 in 1s, 2/3 and 3/3 come before the failure.

▶ Workflow wf_flaky
✗ Step 'call_service' FAILED: Python script exited with code 1: service unavailable
✗ Workflow 'wf_flaky' failed (<duration>): Step 'call_service' failed: …
⏭ wf_archive — not run (a previous workflow failed)
❌ Project 'resilient-pipeline' failed after <duration> — failed: wf_flaky

[image: The run detail page of the resilient pipeline with wf_flaky failed and the project stopped.]

A failure without a fallback stops the project.

##### 03Break the last step of the report

###### Objective

See rollback and the failure fallback work together.

###### Actions

Restore the script of call_service.

Rename Data/finalize.csv to finalize.csv.off.

Run the project.

hdrctl run .

finalize cannot read its file. Hydra ETL undoes share and build_report, sees that nothing is published, and calls the quarantine workflow. The project goes on.

What you should see
Two undo lines, a ↯ line and a completed project.

✗ Step 'finalize' FAILED: ValueError: CSVConnector [src]: source file not found.
↩ Step 'share' undone
↩ Step 'build_report' undone
↯ Workflow 'wf_report' failed (<duration>), nothing published — replaced by wf_report_quarantine: Step 'finalize' failed: …
✅ Project 'resilient-pipeline' completed in <duration> — 4/5 workflow(s) OK

[image: The run detail page of the resilient pipeline with wf_report failed, undone and replaced by the quarantine workflow.]

The failed report was undone, then replaced.

##### 04Make a workflow exceed its timeout

###### Objective

See the limit stop a slow workflow.

###### Actions

Put finalize.csv back.

Set delay: 4 in the retry of call_service, and timeout: 3s on wf_flaky.

Run the project.

timeout: 3s

The first attempt fails, the retry waits four seconds, and the limit of three seconds is exceeded.

What you should see
A failure that mentions the timeout.

⏳ wf_flaky: timed out after 3s — stopping at the next step or batch
✗ Workflow 'wf_flaky' failed (4.1s): timed out after 3s (timeout in workflows/thread.yaml): Step 'call_service' failed: Python script exited with code 1: service unavailable (attempt 2)
❌ Project 'resilient-pipeline' failed after <duration> — failed: wf_flaky

##### 05Put the project back

###### Objective

Leave a working project.

###### Actions

Restore every file you renamed.

Set delay: 1 and timeout: 20s again.

Run hdrctl run . --dry-run and then the project.

hdrctl run . --dry-run

If a run was interrupted during a rollback, hdrctl workflow undo and the journal in .hydra/undo are covered in the lesson on conflicts and recovery.

What you should see
Dry run OK, then four workflows completed.

✅ Dry run OK: the project is valid. Nothing was executed.
✅ Project 'resilient-pipeline' completed in <duration> — 4/4 workflow(s) OK

###### Tips and tricks

Break one thing at a time and put it back before the next test.

Read the arrows: ↪ is a fallback, ↩ an undo, ↯ a failure answered by a backup.

A fallback that works in the dry run can still fail at run time if its own data is missing.

Do not leave a file renamed after a test: the next run starts from a broken state.

#### What should I have at the end?

VerificationExpected result

Missing input↪ Fallback: wf_load → wf_load_backup, then a second switch on wf_report

Failing serviceProject failed — failed: wf_flaky

Broken last stepTwo ↩ lines, then ↯ and a quarantine workflow

Timeouttimed out after 3s on wf_flaky

#### What if something goes wrong?

SymptomCauseFix

Nothing changed after the renameThe file name has another case or folderCheck the path in the condition: it is relative to the project

The project keeps failing after the testsA file is still renamed, or the timeout is still shortUndo each change from the last step of this lesson

a previous run … stopped before undoingA rollback was interruptedSee the lesson on conflicts and recovery

#### Frequently asked questions

##### How do I test a Hydra ETL fallback?

Make its condition true on purpose, for example by renaming the input file, run the project and look for the line starting with a fallback arrow. A dry run alone does not test it.

##### What happens when a retried step still fails?

The workflow fails, and the project stops. In our test wf_archive, which follows wf_flaky, did not run, and the project ended as failed.

##### Why did the report fallback run after I deleted the input?

The backup of wf_load loads 8 rows, and the condition of wf_report is previous.rows < 10. The two fallbacks chain.

##### Is the failed report published?

No. In our test the share was deleted and the report restored before the quarantine workflow ran, so nothing was left published.

#### Related lessons

Build a resilient pipeline

Dry run and --use-fallback

Resolve conflicts and recover

Set a timeout on a workflow

The hdrctl command line

#### Next lesson

You have reached the end of the orchestration and resilience block. The course continues with AI and MCP.

Back to the course map →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Build a resilient ETL pipeline in Hydra ETL Studio — slug: /studio/build-a-resilient-pipeline/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons48 · Scenario 1▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 60

Lesson 60 of 65 · Scenario

### Build a resilient ETL pipeline in Hydra ETL Studio

One protection is a feature. Five protections that fit together are a pipeline you can leave running. Build one, and prove it with a dry run.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

Execution order · hdrctl runabout 30 minutesthe resilient-pipeline project

Quick answer
A resilient Hydra ETL project protects each failure where it happens: a fallback for a missing input, a retry for a flaky call, rollback: true with undo for a workflow that publishes in several steps, and a timeout for a workflow that can hang. hdrctl run . --dry-run checks them all before anything runs.

#### What will you learn in this lesson?

##### Goal

Assemble four workflows into a project with a fallback, a retry, a rollback with an undo and a timeout, check the whole plan without running it, then run it. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilient-pipeline copy of fallbackproject, plus one workflow, wf_flaky, whose python step fails twice before it answers. Stage 1 runs wf_load then wf_report. Stage 2 runs wf_flaky then wf_archive.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I make a Hydra ETL pipeline resilient?

##### 01Match each failure to a protection

###### Objective

Decide what protects what, before touching a file.

###### Actions

Read the table.

Note which workflow each row concerns.

failure → protection

Each protection answers one kind of failure:

What can go wrongProtectionWhere it is setLesson

The input file is missing or too smallfallback on wf_loadExecution order, lifebuoy button46, 47

A call to a service fails now and thenretry on the stepRetry Scope, or retry: in the workflow—

A late step fails after earlier ones publishedrollback: true and undoWorkflow toolbar, action dialog43, 44

A workflow never endstimeoutmax field in Execution order48

A load stops in the middleatomicDestination42

What you should see
A plan that you can read at a glance. Nothing to run yet.

##### 02Add a fallback to the load

###### Objective

Switch to a backup when the input is not usable.

###### Actions

Open Project settings → Execution order.

Select the lifebuoy of wf_load.

Choose wf_load_backup and type the condition.

when: not file_exists('Data/orders.csv') or file_size('Data/orders.csv') < 100

This is lesson 46 in one line. The backup loads 8 rows from Data/orders_backup.csv. The same lifebuoy on wf_report sets on_failure: true and the condition previous.rows < 10, and on wf_archive the condition file_age('Data/stamp.txt') > 30s.

What you should see
A lifebuoy button on wf_load, wf_report and wf_archive.

[image: The Execution order panel with two stages and the protections of the resilient pipeline.]

Four workflows, three fallbacks and one timeout in the thread.

##### 03Add a retry to the flaky call

###### Objective

Let a step try again before failing the workflow.

###### Actions

Open wf_flaky.

Add retry to the step, or drop a Retry Scope around it.

Save.

retry: {max: 3, delay: 1}

max is the number of retries after the first failure, delay is the wait in seconds. A Retry Scope created in Studio starts with max: 3 and delay: 5. The step of this scenario fails twice and answers on the third attempt:

- name: call_service
type: action
action: python
retry:
max: 3
delay: 1
params:
script: …

What you should see
A retry block on the step.

##### 04Make the report safe to undo

###### Objective

Undo a half-published report if a later step fails.

###### Actions

Open wf_report and check that Rollback reads on.

Check that the share action has an undo.

rollback: true

This is lessons 43 and 44. wf_report builds a report, shares a copy, then runs finalize. If finalize fails, the copy is deleted and the report is restored.

What you should see
Rollback on in the toolbar, and a python undo on share.

##### 05Limit the duration of the flaky workflow

###### Objective

Stop a call that never answers.

###### Actions

Type 20s in the max field of wf_flaky.

Save.

timeout: 20s

Twenty seconds leaves room for the three attempts and their delays (about 2 seconds) with a wide margin.

thread:
- mode: sequential
workflows:
- name: wf_flaky
active: true
timeout: 20s

What you should see
20s in the max field, with a normal border.

##### 06Check the whole project

###### Objective

Validate every protection without running anything.

###### Actions

Select Check in Execution order.

Open a terminal in the project folder and run the dry run.

hdrctl run . --dry-run

The plan lists each workflow with its fallback. The warning is expected: the quarantine workflow writes to its own file.

What you should see
A plan with three fallbacks, one warning and Dry run OK.

Stage 1/2 — sequential
• wf_load (1: load_orders)
↪ fallback: wf_load_backup (if not file_exists('Data/orders.csv') or file_size('Data/orders.csv') < 100)
• wf_report (3: build_report, share, finalize)
↪ fallback: wf_report_quarantine (if previous.rows < 10; on failure)
Stage 2/2 — sequential
• wf_flaky (1: call_service)
• wf_archive (1: archive)
↪ fallback: wf_archive_alt (if file_age('Data/stamp.txt') > 30s)
⚠ workflows/thread.yaml: workflow 'wf_report' fallback: 'wf_report_quarantine' writes to ['csv:../../outputs/quarantine.csv'] instead of […] (fine for a quarantine workflow; otherwise check it)
✅ Dry run OK: the project is valid. Nothing was executed.

[image: The Execution order panel after Check, with the Ready line.]

Check validates the whole project.

##### 07Run the project

###### Objective

See every protection stay quiet when nothing is wrong.

###### Actions

Go back to the project.

Select Run project.

Open the run.

hdrctl run .

With good data, no fallback is used. If a step needed a retry, the run page shows a WARNING line for it in the step log. The only warning concerns wf_archive: its condition reads Data/stamp.txt, which does not exist, so Hydra ETL keeps the workflow (on_probe_error: keep).

What you should see
Four workflows OK, and a run page with no fallback badge.

▶ Workflow wf_load
✓ Step 'load_orders' OK (<duration>)
▶ Workflow wf_report
✓ Step 'build_report' OK
✓ Step 'share' OK
✓ Step 'finalize' OK
▶ Workflow wf_flaky
✓ Step 'call_service' OK
⚠ wf_archive: fallback check failed (file_age('Data/stamp.txt'): file not found (…)); keeping wf_archive
▶ Workflow wf_archive
✓ Step 'archive' OK
✅ Project 'resilient-pipeline' completed in <duration> — 4/4 workflow(s) OK

[image: The run detail page of the resilient pipeline, with four workflows succeeded.]

A clean run: no protection was needed.

###### Tips and tricks

Add one protection at a time and run --dry-run after each: the plan shows what changed.

Put a workflow that writes no rows after the workflows that a previous.rows condition watches.

A retry cannot fix a wrong input: it only repeats the call. Keep retries for failures that pass by themselves.

The timeout counts the retry delays. A short limit with long delays stops the workflow before the last attempt.

#### What should I have at the end?

VerificationExpected result

PlanA ↪ fallback line under wf_load, wf_report and wf_archive

Dry runDry run OK: the project is valid. Nothing was executed.

RunProject completed — 4/4 workflow(s) OK

RetryThe flaky call answers on its third attempt

#### What if something goes wrong?

SymptomCauseFix

A fallback runs although nothing failedA previous.rows condition sees a workflow that writes no rowsMove that workflow elsewhere, or test another value

The dry run warns about wf_report_quarantineThe backup writes to another fileExpected for a quarantine workflow; otherwise check the destination

The flaky workflow fails with a timeoutAttempts and delays exceed the limitRaise timeout or shorten the delays

#### Frequently asked questions

##### How do I make a Hydra ETL project resilient?

Protect each failure at the place where it happens: a fallback for a missing or empty input, retry for a call that sometimes fails, rollback with undo for a workflow that publishes in several steps, and a timeout for a workflow that can hang. Then check the plan with hdrctl run . --dry-run.

##### Does a retry show up in the log?

In the Studio run page, yes: the step log has a WARNING line for each retry, such as retry 1/3 in 1s. The command line output of hdrctl run prints only the final result of the step. In our test the step failed twice and answered on the third attempt, one second apart, and the workflow lasted about two seconds.

##### What does a dry run check in a project with protections?

It validates the project, prints each workflow with its fallback and condition, and warns when a backup writes somewhere else than the workflow it replaces. It runs nothing.

##### Why is wf_flaky not before wf_report?

The condition previous.rows refers to the workflow just before. A workflow that writes no rows between the load and the report would make previous.rows equal 0 and trigger the report fallback by mistake.

#### Related lessons

All-or-nothing loads

Roll back a failed workflow

Declare a fallback workflow

Break it, then recover

workflow.yaml reference

#### Next lesson

The next scenario breaks this project on purpose, one failure at a time, and reads how each protection reacts.

Break it, then recover →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Check the execution order of a Hydra project for errors — slug: /studio/check-the-execution-order/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons29 · Execution order: Check▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 36

Lesson 36 of 65 · Execution order: Check

### Check the execution order of a Hydra project for errors

The Check button of Execution order validates workflows/thread.yaml before a run. See the green Ready line and the red message for a missing workflow.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Checkabout 5 minutesHydra ETL 0.22 on Windows

Quick answer
Check validates the execution order before any workflow runs. A valid thread gets a green Ready line that lists the workflows in order. A thread that names a workflow without a file gets a red line with the exact file path that is missing.

#### What will you learn in this lesson?

##### Goal

Press Check on a valid thread, then on a broken one, and read each message.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I check the execution order?

##### 01Check a valid thread

###### Objective

See what a good result looks like.

###### Actions

Open Settings → Project settings → Execution order.

Click Check at the top right.

Execution order → Check

A green line appears under the Loops box. It lists the active workflows in order and counts the loops.

What you should see
A green line starting with a check mark.

✓ Ready: prepare → load_sales → load_stock → report (+ 1 loop)

[image: The Execution order tab after pressing Check on a valid thread: a green line says Ready, then lists the workflows in order and the number of loops.]

Check on a valid thread.

##### 02Break the thread on purpose

###### Objective

Name a workflow that has no file.

###### Actions

Use a thread like the one below, where ghost has no workflows/ghost.yaml and load_sales falls back to a missing backup.

Open it in Define: ghost carries a red file missing tag.

thread.yaml

Studio already flags the missing file in Define. The thread is:

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- name: ghost
- mode: parallel
workflows:
- name: load_sales
fallback:
use: [backup]
on_failure: true
- name: load_stock
- mode: sequential
workflows:
- name: report

What you should see
A red file missing tag next to ghost.

[x] ghost ⚠ file missing

##### 03Press Check

###### Objective

Read the error.

###### Actions

Click Check.

Execution order → Check

The result turns red and gives the file and the problem. In our test only the missing ghost file was reported, although backup is missing too: the check stopped at the first problem. Fix it, then check again to see the next one.

What you should see
A red line with a cross and the path of the missing file.

✗ workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml

[image: The Execution order tab after pressing Check on a thread that names a missing workflow file and a missing fallback file: red lines give the exact messages.]

Check on a broken thread: the missing file is named.

##### 04Fix and check again

###### Objective

Get back to Ready.

###### Actions

Remove ghost from the thread with its cross, or create workflows/ghost.yaml.

Press Check again until the line is green.

Execution order → Check

Removing a workflow from the thread keeps its file. Repeat until the green Ready line appears; then run the project with hdrctl run ..

What you should see
A green line again.

✓ Ready: …

###### Tips and tricks

Press Check before every run of a project, especially after renaming or deleting a workflow file.

An orange warning line can appear under the result. It does not block the run; read it, for example when a fallback writes somewhere different.

Check validates files, not data. A workflow can pass and still fail on its first row.

The check stops at the first problem found: a green result needs a second pass after each fix.

#### What should I have at the end?

VerificationExpected result

ValidA green Ready line lists the workflows and loops

InvalidA red line names the missing file

OrderThe check stops at the first problem

NextRun the project with hdrctl run .

#### What if something goes wrong?

SymptomCauseFix

Check is disabledA wait, max or loop value is invalidFix the red field

Workflow has no fileThe name in the thread does not match a fileCreate the file or remove the workflow from the thread

Fallback has no fileA fallback names a missing workflowCreate it or edit the fallback

Ready but the run failsCheck does not run workflowsRead the run logs and use a dry run

#### Frequently asked questions

##### What does Check do in Execution order?

Check validates the project before any run. It reports a green Ready line when the thread is usable, or red lines naming the problem. According to the Hydra source, it looks for missing workflow files, workflows that cannot be loaded, missing job folders and missing fallback files.

##### What does the Ready line mean?

It lists the active workflows in order and the number of loops, for example prepare, load_sales, load_stock, report and one loop. In our test it appeared in green under the Loops box.

##### How is a missing workflow reported?

As a red line: workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml. In the Define tab the workflow is also tagged file missing.

##### Does Check run my workflows?

No. It validates the files before a run and runs nothing. A dry run from the terminal, hdrctl run --dry-run, gives the same safety with a printed plan.

##### Does Check save my changes?

Yes, when there are unsaved changes. According to the Studio source, Check saves first and then validates. The button is disabled while a wait or loop value is invalid.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Define the execution order

Preview the execution order

Dry run and --use-fallback

#### Next lesson

You can validate an execution order before a run. Next, rehearse the whole project with a dry run.

Dry run →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Create a workflow in a Hydra project with hdrctl — slug: /studio/create-a-workflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons26 · Create a workflow▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 33

Lesson 33 of 65 · Create a workflow

### Create a workflow in a Hydra project with hdrctl

hdrctl workflow add creates an empty workflow and puts it in thread.yaml for you. Add one, read the file, run it and remove it.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

workflow addabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl workflow add archive creates workflows/archive.yaml with no steps and adds it to the last stage of thread.yaml. hdrctl workflow list shows every workflow in thread order, and hdrctl workflow remove deletes one.

#### What will you learn in this lesson?

##### Goal

List the workflows of a project, add one, read the file it creates, check it, and remove it.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project with a few workflows, such as the one built in Stages.

#### How do I create a workflow?

##### 01List the workflows

###### Objective

See the order the project follows.

###### Actions

Open a terminal in the project folder.

Run the command below.

hdrctl workflow list

The list follows the thread. Each line gives the stage number, its mode, the workflow, its status and its number of steps.

What you should see
Four workflows, three stages.

1·sequential prepare ✓ active 1 step(s)
2·parallel load_sales ✓ active 1 step(s)
2·parallel load_stock ✓ active 1 step(s)
3·sequential report ✓ active 1 step(s)

4 workflow(s) found

##### 02Add a workflow

###### Objective

Create archive.

###### Actions

Run the command below.

hdrctl workflow add archive

Hydra creates the file and adds the workflow at the end of the last stage. In our project that is stage 3, which is sequential, so archive runs after report. The command also rewrites thread.yaml: it adds explanatory comments at the top and an active: true line to every workflow.

What you should see
A green line saying the workflow was created, the stage it joined, and a hint for the next step.

✔ Workflow 'archive' created — workflows\archive.yaml
Added to workflows/thread.yaml, stage 3 (sequential).
Next: attach jobs with hdrctl job attach archive, then check with hdrctl run . --dry-run

[image: The Studio terminal after hdrctl workflow add archive: a message says the workflow archive was created in workflows, that it was added to thread.yaml in stage 3, and suggests attaching jobs.]

workflow add in the Studio terminal.

##### 03Read the new file

###### Objective

Know what an empty workflow looks like.

###### Actions

Open workflows\archive.yaml.

workflows\archive.yaml

The file holds a name, an empty description, a manual trigger and an empty list of steps. Add steps by hand, or open the workflow in Studio.

version: "1.0"
workflow:
name: archive
description: ""
trigger:
type: manual
steps: []

What you should see
A file of seven lines with steps: [].

##### 04Check it and list again

###### Objective

Confirm the project still holds together.

###### Actions

Run hdrctl workflow validate workflows\archive.yaml.

Run hdrctl run . --dry-run.

Run hdrctl workflow list again.

hdrctl workflow validate workflows\archive.yaml
hdrctl run . --dry-run
hdrctl workflow list

An empty workflow is valid. The dry run lists it with (0), its number of steps, and running it alone completes with 0/0 steps OK. In the list, archive comes last with 0 step(s).

What you should see
Workflow valid, a plan that ends with archive (0), and five workflows in the list.

Workflow valid — no errors detected.

Stage 3/3 — sequential
• report (1: say_report)
• archive (0)
Dry run OK: the project is valid. Nothing was executed.

3·sequential archive ✓ active 0 step(s)
5 workflow(s) found

[image: The Studio terminal after hdrctl workflow list: five workflows listed with their stage, mode, active status and step count, the new archive workflow last with zero steps.]

workflow list after the add.

##### 05Let Hydra name it, then remove one

###### Objective

See the unnamed form and the cleanup.

###### Actions

Run hdrctl workflow add without a name.

Run hdrctl workflow remove archive -y.

hdrctl workflow add
hdrctl workflow remove archive -y

Without a name, Hydra generates one, here workflow-109f7411. Yours will differ. remove deletes the file and the thread entry; without -y it asks for confirmation first.

What you should see
A generated name, then two ok lines for the removal.

✔ Workflow 'workflow-109f7411' created — workflows\workflow-109f7411.yaml

ok Deleted workflows\archive.yaml
ok Removed from workflows/thread.yaml
✔ Workflow 'archive' removed.

###### Tips and tricks

Pass a clear name: it becomes the file name and appears in thread.yaml, the plan and the run logs.

After adding, check the project with hdrctl run . --dry-run, as the command itself suggests.

A new workflow lands in the last stage. If that stage is parallel, the new workflow starts with the others. Move it in the Define tab.

workflow remove deletes the file for good. Use -y only when you are sure.

#### What should I have at the end?

VerificationExpected result

Createworkflow add writes workflows/.yaml

OrderThe workflow joins the last stage of thread.yaml

CheckValid, listed with zero steps, runs 0/0

RemoveThe file and the thread entry disappear

#### What if something goes wrong?

SymptomCauseFix

No project foundThe command ran outside a project folderRun it from the folder that holds .hydra

Name already existsA workflow file has this nameChoose another name

The workflow runs too earlyIt joined a parallel last stageMove it in Execution order

Dry run shows (0)The workflow has no steps yetAdd steps in the YAML or in Studio

#### Frequently asked questions

##### How do I create a workflow in a Hydra project?

Run hdrctl workflow add in the project folder. It creates workflows/.yaml with no steps and a manual trigger, and adds the workflow at the end of the last stage of workflows/thread.yaml.

##### What happens if I give no name?

Hydra invents one. In our test the name was workflow- followed by eight characters, workflow-109f7411, and the workflow was added like any other.

##### Does the new workflow run in the project?

Yes, as soon as it is in the thread. A workflow with no steps runs in 0.0 seconds and counts 0 of 0 steps. The dry run lists it with a zero between parentheses.

##### How do I delete a workflow?

Run hdrctl workflow remove . It asks for confirmation unless you add -y. It deletes the file and removes the workflow from workflows/thread.yaml. Jobs are not deleted.

##### Can I import an existing workflow file?

According to the Studio source, a workflow file that sits in the workflows folder but not in thread.yaml is listed under Not in the thread in Execution order, where one click adds it. We did not test this with a file copied from elsewhere. The Studio Import button, which brings in a job, has its own lesson.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Define the execution order

Orchestrate from thread.yaml

Compose jobs in a workflow

#### Next lesson

You can create, check and remove workflows from the command line. Next, put jobs in them.

Compose jobs →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Declare a fallback workflow in Hydra ETL Studio — slug: /studio/declare-a-fallback-workflow/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons39 · Fallback workflow▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 46

Lesson 46 of 65 · Fallback workflow

### Declare a fallback workflow in Hydra ETL Studio

Name a backup workflow and the condition that calls it. Hydra ETL tests the condition just before the main workflow starts.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux; Studio screens on Windows)

Project settings → Execution orderabout 15 minutesa project with two workflows

Quick answer
To declare a fallback workflow in Hydra ETL, open Project settings → Execution order, select the lifebuoy button on the workflow, pick a replacement workflow and write a condition such as not file_exists('Data/orders.csv'). Save, then Check. Before the workflow starts, Hydra ETL tests the condition and, if it is true, runs the replacement in its place.

#### What will you learn in this lesson?

##### Goal

Give a workflow a backup, write the condition that switches to it, check the declaration, and see the switch happen in a run. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
A copy of the fallbackproject example, registered in Studio as fallback-demo. wf_load reads Data/orders.csv (20 orders) and writes outputs/orders_clean.csv. wf_load_backup reads Data/orders_backup.csv (8 orders) and writes the same destination. In the copy, wf_load is the only workflow in the thread and orders.csv is renamed to orders.csv.off, so the main file is missing.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

Two workflows that write the same destination: a main one and a backup. The backup stays outside the thread, so it runs only when it replaces another workflow.

#### How do I declare a fallback workflow in Hydra ETL?

##### 01Open the execution order

###### Objective

Reach the panel that decides which workflows run, and in what order.

###### Actions

Open the project from the Projects page.

Select Project settings.

Stay on Execution order, on the Define tab.

Project → Project settings → Execution order → Define

The panel edits workflows/thread.yaml, the file hdrctl run reads. A workflow that is not in the thread is not run by hdrctl run: it appears in the list Not in the thread (not run) below the stages.

What you should see
One stage holding wf_load, with a lifebuoy button on its row.

[image: The Execution order panel of Project settings with wf_load alone in Stage 1 and the lifebuoy button on its row.]

Stage 1 holds wf_load. The lifebuoy button adds a fallback.

##### 02Add a fallback to the workflow

###### Objective

Open the fallback editor of wf_load.

###### Actions

Select the lifebuoy button on the wf_load row.

Read the editor that opens under the row.

wf_load → lifebuoy → Fallback

The button's tooltip reads Add a fallback: another workflow that runs in its place. The editor is a dashed box with a replacement list, a when field and two options.

What you should see
A box titled Fallback, a replace with list that is still empty, a when field showing an example, and a red message: choose at least one replacement workflow. The message goes away once you pick one.

[image: The fallback editor opened under wf_load, with the replacement list still empty.]

The fallback editor, before anything is chosen.

##### 03Choose the replacement and write the condition

###### Objective

Say which workflow replaces wf_load, and when.

###### Actions

Open the + add a workflow… list and choose wf_load_backup.

In the when field, type the condition below.

Wait for the mark at the end of the field.

not file_exists('Data/orders.csv')

The field's tooltip says what the condition is for: Checked just before the workflow starts. If true, the first replacement runs instead. So the sentence to write is the situation in which the main workflow must not run. Paths are relative to the project folder.

What you should see
The replacement as a dashed chip, and a green check mark after the condition. A red cross with a message means Hydra ETL cannot read the condition.

[image: The fallback editor for wf_load with wf_load_backup as replacement and the condition not file_exists('Data/orders.csv') marked valid.]

Replacement chosen, condition accepted.

##### 04Preview the result

###### Objective

See the declaration as a diagram before you save it.

###### Actions

Select the Preview tab.

Find the dashed block under wf_load.

Execution order → Preview

The preview draws the replacement as a dashed block under the workflow it replaces, with the start of the condition on the link between them. Select a block to jump back to the editor.

What you should see
wf_load in the stage, wf_load_backup in a dashed block under it.

[image: The Preview tab drawing wf_load with a dashed fallback block for wf_load_backup and the condition on the link.]

The backup is drawn under the workflow it replaces.

##### 05Save, then check the project

###### Objective

Write the declaration to thread.yaml and have Hydra ETL validate it.

###### Actions

Select Save (it reads Saved once written).

Select Check.

Read the result under the panel.

Save → Check

The same declaration is plain YAML. This is the form hdrctl reads, validated with Hydra ETL 0.22.0:

thread:
- mode: sequential
workflows:
- name: wf_load
active: true
fallback:
use: [wf_load_backup]
when: "not file_exists('Data/orders.csv')"

From a terminal, hdrctl run . --dry-run shows the plan without writing anything. The fallback appears under its workflow:

Execution plan
Stage 1/1 — sequential
• wf_load (1: load_orders)
↪ fallback: wf_load_backup (if not file_exists('Data/orders.csv'))

✅ Dry run OK: the project is valid. Nothing was executed.

What you should see
The button reads Saved and a green line under the panel reads Ready: wf_load.

[image: The Check result of the Execution order panel after saving the fallback.]

Check validates the project, including the fallback.

##### 06Run it and read the switch

###### Objective

Watch the backup take over when the main file is missing.

###### Actions

Make sure Data/orders.csv is absent (in this project it is renamed to orders.csv.off).

Select Run project and open the run it creates.

Look for the line that says which workflow ran.

hdrctl run .

In a terminal the same switch is one line, then the backup runs under its own name:

↪ Fallback: wf_load → wf_load_backup — file_exists('Data/orders.csv') = false (not found)
▶ Workflow wf_load_backup (fallback, in place of wf_load)
✓ Step 'load_orders_backup' OK (<duration>)
✓ Workflow 'wf_load_backup' OK (<duration>)

With Data/orders.csv present, the same command runs wf_load and prints no fallback line. outputs/orders_clean.csv then holds 20 orders; after the switch it holds the 8 orders of the backup.

What you should see
One step, wf_load_backup — fallback of wf_load, with an orange badge fallback · condition true. wf_load itself does not run, and the run counts 1 ok / 1.

[image: The run detail page where wf_load_backup ran in place of wf_load with a fallback badge.]

The run page names the replacement, the workflow it replaced and why.

###### Tips and tricks

Keep the backup outside the thread. hdrctl workflow list then marks it fallback of wf_load (runs only in its place).

Run hdrctl run . --dry-run after every change: the ↪ fallback line proves the declaration was read.

A fallback tests a condition before the workflow starts. It does not catch a failure inside the workflow unless you tick also after a failure (on_failure: true).

A backup that writes somewhere else is allowed, but Hydra ETL warns you: fallback … writes to … instead of ….

#### What should I have at the end?

VerificationExpected result

Panelwf_load has a fallback to wf_load_backup and a green condition

YAMLA fallback block with use and when in thread.yaml

Dry runA ↪ fallback line under wf_load

Run, file missing↪ Fallback: wf_load → wf_load_backup, then the backup runs

Run, file presentwf_load runs and no fallback line appears

#### What if something goes wrong?

SymptomCauseFix

A red cross after the conditionThe condition is not validRead the message under the field and fix the function name or the quotes

The backup never runsThe condition is false, for example the file existsRun with hdrctl run . -v and read the fallback not needed line

The backup is not in the replacement listThe workflow does not exist in workflows/Create it, then reopen the list

The backup also runs on its ownIt is still in the threadRemove it from the stage with the × button; it stays on disk

#### Frequently asked questions

##### What is a fallback workflow in Hydra ETL?

A workflow that runs only in place of another one, when a condition written in thread.yaml is true just before the main workflow would start.

##### Where is a fallback declared?

In workflows/thread.yaml, as a fallback block with use (the replacement workflows) and when (the condition) under the workflow it protects.

##### Does a fallback run when a workflow fails?

Only if the fallback sets on_failure: true, which Studio shows as the also after a failure checkbox. Without it, the condition is the only trigger.

##### Can I test a fallback without running anything?

Yes. hdrctl run . --dry-run prints the plan, including a ↪ fallback line under each workflow that has one, and writes nothing.

#### Related lessons

Compose jobs into a workflow

Organize steps with containers

Run a job

workflow.yaml reference

#### Next lesson

The condition used here is one line. The next lesson goes through the other functions you can test, and the options on_failure and on_probe_error.

Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Declare the undo of an action in Hydra ETL Studio — slug: /studio/declare-undo-actions/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons37 · Undo actions▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 44

Lesson 44 of 65 · Undo actions

### Declare the undo of an action in Hydra ETL Studio

Hydra ETL can restore a file it wrote. It cannot guess how to reverse a command you ran. You must say it, or say there is nothing to say.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (CLI outputs on Linux and Windows; Studio screens on Windows)

Action dialog → Undoabout 20 minutesthe resilience-demo project

Quick answer
With rollback: true, every action needs an undo: either the action that reverses it, or undo: none when there is nothing to reverse. Without it, hdrctl workflow validate refuses the workflow and names the step.

#### What will you learn in this lesson?

##### Goal

Read the refusal of a workflow whose action has no undo, set the undo in the Studio dialog, and see the validation pass. Hydra ETL is unrelated to Meta's Hydra configuration library and to the PostgreSQL extension of the same name.

Project used here
The resilience-demo project and its workflow wf_bad_rollback: build_report (a job) then notify, a python action that prints done. The workflow has rollback: true.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra, and hdrctl serve running: Studio is then at http://127.0.0.1:5678. See lesson 3, Check the API if the top bar does not say API online.

A project with a fallback declared. See lesson 46, Declare a fallback workflow.

#### How do I declare the undo of an action in Hydra ETL?

##### 01Read the refusal

###### Objective

Know what Hydra ETL says when an action has no undo.

###### Actions

Open a terminal in the project folder.

Validate the workflow.

hdrctl workflow validate wf_bad_rollback

The check happens before any run, so nothing is executed and nothing needs to be repaired.

What you should see
An invalid workflow, with the name of the step and what to add.

❌ Invalid workflow: rollback: true, but some steps cannot be undone:
- step 'notify': the 'python' action acts outside Hydra; with rollback: true add undo: (the action that reverses it) or undo: none (nothing to reverse)

[image: The Studio terminal after hdrctl workflow validate wf_bad_rollback, showing the refusal for the step notify.]

The refusal names the step and the two ways out.

##### 02Open the action dialog

###### Objective

Find the Undo section of the action.

###### Actions

Open wf_bad_rollback in the editor.

Double-click the notify node.

Scroll to Undo (if the workflow rolls back).

Undo (if the workflow rolls back)

The list reads Not set (required when the workflow has rollback on). That is the state that triggers the refusal.

What you should see
A dashed frame with the Undo action list set to Not set.

[image: The dialog of the notify action with the Undo list showing Not set.]

Not set is the state that the validation refuses.

##### 03Choose its undo

###### Objective

Say that there is nothing to reverse.

###### Actions

Open the Undo action list.

Choose Nothing to undo.

Save the workflow.

undo: none

The notify action only prints a line, so there is nothing to reverse. If it created a file, you would choose Run an action, then the action and its settings, as share does in the previous lesson.

What you should see
Nothing to undo shown in the list.

[image: The dialog of the notify action with the Undo list set to Nothing to undo.]

Nothing to undo is an explicit choice.

##### 04Read the undo in the workflow file

###### Objective

See the same choice as text.

###### Actions

Open Hydra DSL or workflows/wf_bad_rollback.yaml.

undo: none

The line sits at the level of the step, after params:

- name: notify
type: action
action: python
params:
script: print('done')
undo: none
depends_on:
- build_report

What you should see
An undo: none line under notify.

##### 05Validate again

###### Objective

Confirm that the workflow is accepted, and see what the undo command answers.

###### Actions

Validate the workflow.

Run hdrctl workflow undo on a workflow that finished normally.

hdrctl workflow validate wf_bad_rollback

The command hdrctl workflow undo finishes an interrupted rollback. With nothing pending, it says so:

What you should see
A valid workflow, and the answer Nothing to undo.

✅ Workflow valid — no errors detected.

$ hdrctl workflow undo wf_report
Nothing to undo for 'wf_report'.

###### Tips and tricks

The undo of an action should be safe to run twice.

Write the undo when you write the action, while you still remember what it changes.

undo: none is a statement, not a default. Use it only when it is true.

hdrctl workflow undo does not reverse a workflow that finished: it only completes a rollback that was interrupted.

#### What should I have at the end?

VerificationExpected result

RefusalInvalid workflow: rollback: true, but some steps cannot be undone

DialogThe Undo list shows Nothing to undo or an action

FileA line undo: none or an undo block under the action

ValidationWorkflow valid — no errors detected

#### What if something goes wrong?

SymptomCauseFix

The refusal still appears after you set the undoThe workflow was not savedSave it, then validate again

The Undo list is missing in the dialogThe node is a job, which is undone automaticallyOpen an action node

Nothing to undo for 'wf_report'No rollback was interruptedThis is the expected answer: nothing is pending

#### Frequently asked questions

##### Why does Hydra ETL refuse my workflow with rollback on?

Because an action acts outside Hydra ETL. The message names the step and says to add undo with the action that reverses it, or undo: none when there is nothing to reverse.

##### When should I use undo: none?

When the action has no effect to reverse, for example a notification that only prints a line. If it does change something, write the action that reverses it.

##### Which actions can serve as an undo?

The Studio list offers bash, powershell, python, webhook, ssh, email and log.

##### What does hdrctl workflow undo do?

It finishes an interrupted rollback. When nothing is pending, it answers that there is nothing to undo; it does not undo a workflow that completed.

#### Related lessons

Roll back a failed workflow

Resolve conflicts and recover

All-or-nothing loads

workflow.yaml reference

The hdrctl command line

#### Next lesson

The last lesson of this block covers the case where the undo itself cannot run, because someone changed a file by hand.

Resolve conflicts and recover →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Define the execution order of a Hydra project in Studio — slug: /studio/define-the-execution-order/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons27 · Execution order: Define▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 34

Lesson 34 of 65 · Execution order: Define

### Define the execution order of a Hydra project in Studio

The Define tab of Execution order edits workflows/thread.yaml: stages, modes, waits, skipped workflows and loops. Read it, add a workflow and see what Save means.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Execution orderabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
Execution order is a tab of Project settings that edits workflows/thread.yaml. Its Define view lists the stages of the project; each stage has a mode, a wait and its workflows, and a Loops box repeats part of the thread.

#### What will you learn in this lesson?

##### Goal

Open Define, read a stage, add a workflow that is not yet in the thread, and see how Studio flags a change that is not saved.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I define the execution order in Studio?

##### 01Open Execution order

###### Objective

Find the editor of thread.yaml.

###### Actions

Click Settings in the sidebar, then Project settings.

Stay on the Execution order tab and select Define.

Settings → Project settings → Execution order → Define

The header repeats the file name, workflows/thread.yaml, and the project page says the order is saved there for everyone who opens the project. The button at the top right reads Saved while nothing has changed.

What you should see
One box per stage, a Loops box at the bottom, and a Saved button.

Execution order workflows/thread.yaml [Define] [Preview] Check Saved
Stage 1 sequential then wait 0
Stage 2 parallel then wait 1s
Stage 3 sequential then wait 0

[image: The Define tab of Execution order in Hydra Studio Project settings: three stages with their mode, wait fields and workflows, an Add stage button, a Not in the thread list, and a Loops box with one loop.]

The Define tab of a project with three stages and one loop.

##### 02Read a stage

###### Objective

Know every control on a row.

###### Actions

Read Stage 2: its mode list says parallel and then wait says 1s.

Read a workflow row: checkbox, name, wait, max, then the lifebuoy, arrows and cross buttons.

thread.yaml

The stage mode and the wait after the stage are mode and delay_after in the file. On a row, wait pauses before that workflow starts, max is its maximum duration and the lifebuoy adds a fallback workflow. The arrows move a workflow up or down and the cross removes it from the thread without deleting its file. This is the thread behind the screenshot:

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
The same three stages as the YAML above.

##### 03Add a workflow

###### Objective

Put a workflow that is not run yet into the thread.

###### Actions

Under the stages, find Not in the thread (not run).

Click + cleanup.

+ cleanup

The workflow joins the list and the button at the top right changes from Saved to Save: the change exists only in the editor until you save it. Our click added cleanup after report, in stage 3.

What you should see
cleanup appears in a stage, and Save is enabled.

Stage 3 sequential then wait 0
[x] report
[x] cleanup
Save

[image: The Define tab after adding the cleanup workflow to the thread: the workflow joins the list and the Save button is enabled because the change is not saved yet.]

cleanup added to stage 3, not saved yet.

##### 04Repeat part of the thread

###### Objective

Use the Loops box.

###### Actions

In the Loops box, read the sentence: After a workflow, go back to another, for a number of passes in total, with a pause before each repeat.

Click Add loop to create a new one.

Loops → Add loop

The box in the screenshot reads: after report go back to prepare, 2 passes in total, pause 1s. It is the loops entry of thread.yaml covered in Repeat workflows with loops. Studio offers the last workflow as the starting point and the first one as the destination; change both lists to fit.

What you should see
A loop row with two lists, a number and a pause field.

After [report] go back to [prepare] — passes in total [2] pause before each repeat [1s]

##### 05Save, then check

###### Objective

Write the file.

###### Actions

Click Save.

Continue with the Preview and Check lessons to see the result before running.

Save

Save writes workflows/thread.yaml. Pressing Check while there are unsaved changes saves them first, according to the Studio source.

What you should see
The button goes back to Saved.

Saved

###### Tips and tricks

Untick a workflow instead of removing it while you debug: its place in the order is kept.

Type waits as 500ms, 30s, 5m or 1h. Studio outlines a wrong value in red and shows the accepted formats.

Fallback workflows do not appear under Not in the thread: they run only in place of the workflow that declares them.

Changes stay in the editor until you press Save. Reloading the page can lose them.

#### What should I have at the end?

VerificationExpected result

LocationSettings → Project settings → Execution order

StagesEach stage shows its mode, wait and workflows

EditAdding a workflow enables Save

SavedThe button reads Saved when the file is written

#### What if something goes wrong?

SymptomCauseFix

A workflow is missing from the listIt is not in the thread, or it is a fallbackLook under Not in the thread, or open its owner's fallback

The wait field turns redThe value is not a number or a durationUse 500ms, 30s, 5m or 1h

Save stays disabledNo change, or a field is invalidFix the red field, then save

The tab shows no workflowsThe project has no workflows folderCreate workflows first, see the Stages lesson

#### Frequently asked questions

##### Where do I edit the execution order in Hydra Studio?

Open Settings, then Project settings, then the Execution order tab, and keep Define selected. The tab edits the file workflows/thread.yaml of the project, which hdrctl run reads.

##### How do I add a workflow to the thread in Studio?

Workflows that exist in the project but are not in the thread are listed after the words Not in the thread. Click one to add it at the end. The Save button then becomes active.

##### How do I skip a workflow without deleting it?

Untick the checkbox in front of its name. Studio treats an unticked workflow as skipped. The cross at the end of its row removes it from the thread and keeps the workflow file.

##### Does the execution order apply to a single workflow?

No. It orders the workflows of a whole project. A workflow run on its own from the canvas, or with hdrctl workflow run, does not use thread.yaml.

##### What happens if I leave the page with unsaved changes?

Studio asks for confirmation before you leave or reload the tab, according to the Studio source. This lesson did not trigger that prompt.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Preview the execution order

#### Next lesson

You can set the order of a project. Next, read it as a diagram.

Preview the order →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Diagnose a failed Hydra run in Studio — slug: /studio/diagnose-a-failed-run/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

Lessons15 · Diagnose a failure▾ ←All learning tracksreturn to Get started
StudioHydra Studio tutorials49 lessons · about 90 minutes

Get started›Hydra Studio›Lesson 17

Lesson 17 of 65 · Diagnose a failure

### Diagnose a failed Hydra run in Studio

When a Hydra run fails, Studio opens the failing step for you. Read the run error, the timeline and the traceback, then decide between fixing the cause and running again.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

Runsabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
A failed run in Studio shows a red Run error, a timeline, and the failing step already open with its traceback. The workflows after it are marked skipped. Read the message, then fix the cause, or use Run again only if the failure may be temporary.

#### What will you learn in this lesson?

##### Goal

Make a run fail on purpose, find the failing step in the terminal and in Studio, and decide what to do.

##### Prerequisites

Hydra ETL 0.22 with Studio running: hdrctl serve. See Install and start.

A project with a few workflows, such as the one built in Stages.

#### How do I diagnose a failed run?

##### 01Make a run fail on purpose

###### Objective

Have a failure to read.

###### Actions

Save the file below as workflows\boom.yaml.

Put it between two workflows in workflows\thread.yaml.

In a terminal, run hdrctl run . from the project folder.

hdrctl run .

The boom workflow has one Python step that raises an error.

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

The thread runs prepare, boom, then report:

version: "1.0"
thread:
- mode: sequential
workflows:
- name: prepare
- name: boom
- name: report

What you should see
prepare succeeds, boom fails with its traceback, and report does not run.

Workflow prepare
✓ Step 'say_prepare' OK (0.0s)
Workflow boom
✗ Step 'fail_on_purpose' FAILED: Python script exited with code 1: RuntimeError: boom
| Traceback (most recent call last):
| File "", line 1, in
| raise RuntimeError("boom")
| RuntimeError: boom
Workflow 'boom' failed (0.2s): Step 'fail_on_purpose' failed: Python script exited with code 1: RuntimeError: boom
report — not run (a previous workflow failed)
Project 'diag-demo' failed after 0.2s — failed: boom

##### 02Open the failed run in Studio

###### Objective

Let Studio point at the failing step.

###### Actions

Click Runs in the sidebar.

Click the run named after your project, with the Failed badge.

Runs → the failed run

The page opens on the failing step. From top to bottom: the Failed badge, four cards (started, finished, duration, steps), a red Run error with the short reason, an execution timeline with the failing workflow in red, then the steps. In our test the run was 1 ok · 1 skip / 3.

What you should see
The step boom is open, with a red message and five log lines.

Run error failed: boom
#2 boom 0.145s 5 lines
Step 'fail_on_purpose' failed: Python script exited with code 1: RuntimeError: boom
#3 report skipped

[image: The detail page of a failed project run in Hydra Studio: a Failed badge, the run error, an execution timeline, and the failing step opened with its traceback while the next workflow is marked as skipped.]

The failed run: the failing step is open and the next one is skipped.

##### 03Read the three clues

###### Objective

Turn the screen into a diagnosis.

###### Actions

Read the red message of the step: it names the step and the cause.

Read the traceback below it: the last line is the exception, here RuntimeError: boom.

Open the skipped step: its only line says that a previous workflow failed.

boom

The message tells what failed (fail_on_purpose), the traceback tells where (line 1 of the script) and the skipped step tells what did not happen because of it (report). Fix a problem in the script, the file or the data, not in the steps that were skipped.

What you should see
The same three facts in Studio and in the terminal.

what: Step 'fail_on_purpose' failed
where: File "", line 1
why: RuntimeError: boom

##### 04Find it again, then decide

###### Objective

Filter the list and choose between fixing and running again.

###### Actions

On Runs, click the Failed tab.

After fixing the cause, click the replay button of the row (Run again).

Runs → Failed

The Failed tab keeps only failed runs. The replay button at the end of the row starts a new run of the same path. Use it after a fix, or when the cause may be temporary. If the message names your script, a file or a column, running again changes nothing: fix the cause first.

What you should see
One row with a Failed badge and a replay icon.

project:diag-demo Failed 2/3 0.2s ↻

[image: The Runs page of Hydra Studio filtered on Failed: one failed project run with its steps count, start time, duration and the replay button at the end of the row.]

The Failed filter and the replay button.

###### Tips and tricks

Start at the failing step, never at the last step: the later ones are only skipped.

Copy the red message with its step name into your notes before fixing; it is the quickest search term later.

Do not run again in a loop. A deterministic failure, such as a script error, repeats exactly.

After a restart of hdrctl serve the runs list is empty: copy what you need first. See Read the Insights statistics.

#### What should I have at the end?

VerificationExpected result

TerminalStep ... FAILED, then the traceback, then report not run

StudioRun error, timeline and the failing step open

SkippedLater workflows say a previous workflow failed

FilterThe Failed tab lists failed runs only

#### What if something goes wrong?

SymptomCauseFix

The run list is emptyThe server restarted, or the run was started in a terminalStart the run again from Studio

No traceback appearsThe step failed before running a scriptRead the message of the step

Run again fails the same wayThe cause was not temporaryFix the script, file or data first

A later step looks brokenIt was skippedFix the first failure

#### Frequently asked questions

##### How do I find out why a Hydra run failed?

Open the run in Studio: Runs, then the run itself. The failing step opens by itself and shows a red error message and its log lines. In a terminal, the same message appears on the Step ... FAILED line of hdrctl run.

##### What happens to the workflows after the one that failed?

They do not run. In our test, report came after boom in the thread, and Studio marked it skipped with the log line not run: a previous workflow failed. hdrctl run printed the same reason.

##### Where is the Python traceback?

In the log of the failing step. Our script raised RuntimeError, and the log shows the traceback with the line of the script and the exception name, in the Studio run and in the terminal.

##### Should I run again or fix the cause?

Run again only when the cause may disappear by itself, such as a busy service. When the message names your script, a file or a column, a second run fails the same way: fix the cause first. This is our recommendation, not a Hydra rule.

##### How do I run a failed workflow again from Studio?

The Runs page has a replay button at the end of each row, titled Run again. It starts a new run of the same workflow or project. The old run stays in the list.

#### Related lessons

Review a run

Declare a fallback workflow

Set timeouts on workflows

Read the Insights statistics

#### Next lesson

You can read a failure from the message to the cause. Next, let a project recover by itself with a fallback workflow.

Declare a fallback →Back to the course map

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
