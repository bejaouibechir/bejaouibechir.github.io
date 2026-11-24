# Hydra ETL CLI guides

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## What a Hydra job is made of: four YAML files — slug: /cli/guides/anatomy-of-a-job/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Create a job

Guide · Create a job

### What a Hydra job is made of: four YAML files

A Hydra job is a folder of four YAML manifests. Create a project, read each file, break one on purpose and see what validate says.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl initabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
A Hydra job is a folder with sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. pipeline.yaml links the other files by id, and hdrctl validate checks the links before any data moves.

#### What will you learn in this lesson?

##### Goal

Create a project, read the four manifests of its first job, run it, and see what validate reports when a file or an id is missing.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### What is a job made of?

##### 01Create a project

###### Objective

Let Hydra write a first job.

###### Actions

Open a terminal in an empty folder.

Run the command below.

hdrctl init anatomy-demo

The command creates the project folder and lists every file it writes. The job is jobs/job1. The default template is csv, a small CSV to CSV job with sample data.

What you should see
A list of ok lines ending with Project 'anatomy-demo' created (workflow1 with job1).

ok jobs/job1/sources.yaml
ok jobs/job1/destinations.yaml
ok jobs/job1/pipeline.yaml
ok jobs/job1/transformations.yaml
ok jobs/job1/data/input.csv
ok jobs/job1/README.md
ok workflows/workflow1.yaml
ok workflows/thread.yaml
...

##### 02Read the source and the destination

###### Objective

Two files declare where data comes from and goes.

###### Actions

Open jobs/job1/sources.yaml.

Open jobs/job1/destinations.yaml.

jobs/job1/sources.yaml
jobs/job1/destinations.yaml

Each file declares one or more entries under an id you choose: src_csv and dest_csv. An entry has a type and the place to read or write, here a file path. The paths are relative to the job folder.

sources:
src_csv:
type: csv
extract:
table: data/input.csv
batch_size: 50000

destinations:
dest_csv:
type: csv
load:
table: data/output.csv
mode: replace

What you should see
src_csv reads data/input.csv. dest_csv writes data/output.csv and replaces it at each run.

##### 03Read the transformations

###### Objective

The steps applied between the two.

###### Actions

Open jobs/job1/transformations.yaml.

jobs/job1/transformations.yaml

The file is an ordered list of steps. This one keeps three columns, casts value to a float and keeps the rows where value is above zero.

steps:
- select:
columns: [id, name, value]
- cast:
mapping:
value: float
- filter:
expr: "value > 0"

What you should see
Three steps: select, cast, filter.

##### 04Read the pipeline

###### Objective

The file that ties the others together.

###### Actions

Open jobs/job1/pipeline.yaml.

jobs/job1/pipeline.yaml

The pipeline holds no data details. It names a source id and a destination id, and nothing else. It does not mention transformations.yaml: in our test the file was applied anyway because it sits in the job folder.

pipeline:
from: src_csv
to: dest_csv

What you should see
Two lines: from and to.

##### 05Validate and run the job

###### Objective

Check the links, then move the data.

###### Actions

Run hdrctl validate jobs/job1.

Run hdrctl run jobs/job1.

hdrctl validate jobs/job1
hdrctl run jobs/job1

validate checks each file and resolves pipeline.from and pipeline.to against the ids. The run reads three rows and writes two: the row with a negative value is filtered out. The result is jobs/job1/data/output.csv.

What you should see
DSL valid, then Pipeline completed successfully with 3 rows read and 2 written.

ok sources.yaml — Pydantic valid
ok destinations.yaml — Pydantic valid
ok transformations.yaml — Pydantic valid
ok pipeline.from — resolved: src_csv
ok pipeline.to — resolved: dest_csv
DSL valid — no errors detected.

Pipeline completed successfully in 3.0s
Rows read : 3
Rows written: 2

##### 06Break it on purpose

###### Objective

Read the errors you will meet.

###### Actions

Move transformations.yaml out of the folder and run the job again.

Put it back. In pipeline.yaml, change src_csv to src_missing and validate.

Restore it. Move destinations.yaml away and validate.

hdrctl validate jobs/job1

Without transformations.yaml the job still runs and writes all three rows. A pipeline that names an unknown id is reported with the file where Hydra looked. A missing destinations.yaml gives two errors: the file is missing, and pipeline.to cannot be resolved.

What you should see
1 error(s) detected for the unknown source, 2 error(s) detected for the missing destinations file.

err pipeline.from='src_missing' not found in sources.yaml
1 error(s) detected.

err destinations.yaml — MISSING
err pipeline.to='dest_csv' not found in destinations.yaml
2 error(s) detected.

###### Tips and tricks

Read pipeline.yaml first. It is two lines and shows which source feeds which destination.

Run hdrctl validate after each edit. It costs nothing and reports the file and the id at fault.

Do not leave an old transformations.yaml in a job folder. In our test it was applied even though pipeline.yaml did not mention it.

Ids are free text. If you rename src_csv in sources.yaml, change pipeline.from too.

#### What should I have at the end?

VerificationExpected result

Filessources, transformations, destinations, pipeline

Linkpipeline.from and pipeline.to name ids

Optionaltransformations.yaml only

Checkhdrctl validate jobs/job1

#### What if something goes wrong?

SymptomCauseFix

destinations.yaml MISSINGThe file is not in the job folderRestore it or recreate the job

pipeline.from not foundThe id is not declared in sources.yamlAlign the id in both files

Rows read equals rows writtenNo transformations.yaml in the folderCheck the file name and place

Not a job folderThe command ran from the wrong folderPass the job folder to the command

#### Frequently asked questions

##### What files make up a Hydra job?

A job is a folder with four YAML manifests: sources.yaml, transformations.yaml, destinations.yaml and pipeline.yaml. In the project created by hdrctl init 0.22 the folder is jobs/job1, and it also holds a README.md and a data folder with a sample input.csv.

##### Which manifest is optional?

transformations.yaml. In our test a job without it validated and ran, and wrote all 3 rows read, where the job with it wrote 2. We removed destinations.yaml in a test and validate reported it as MISSING; we did not test removing the other files.

##### How does pipeline.yaml connect the other files?

Through ids. pipeline.from names a source declared in sources.yaml, and pipeline.to names a destination declared in destinations.yaml. validate reports an id that is not found and tells you in which file it looked.

##### Where are the paths in a job resolved from?

In the generated job, the source reads data/input.csv and the destination writes data/output.csv. After a run, output.csv appeared in jobs/job1/data, next to input.csv, so these relative paths start from the job folder.

##### How do I check a job without running it?

Run hdrctl validate jobs/job1. It checks that each file is present and valid and that pipeline.from and pipeline.to resolve. hdrctl run . --dry-run validates the whole project and runs nothing.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Create a job, then give it a source

Read the manifests Studio generates

Resolve what the validity badge reports

#### Next lesson

A job is four files and two ids. Next, see how Studio writes them from the canvas.

See the YAML →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Call a Hydra project from another project — slug: /cli/guides/call-a-project-from-a-project/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sub-projects

Guide · Sub-projects

### Call a Hydra project from another project

A workflow step of type project runs another project. Build a master and a child, run the master, and read what happens when the path is wrong.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

type: projectabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A workflow step with type: project and project: ../child runs another project after the steps it depends on. The calling project prints the called project's steps under the step, and refuses a missing folder or a project that calls itself.

#### What will you learn in this lesson?

##### Goal

Create two projects side by side, call the second from the first, run the first and read the two errors you will meet.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

Basics of workflows and jobs: Manage the jobs and parameters of a project.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I call a project from a project?

##### 01Create two projects

###### Objective

A child and a master, in the same folder.

###### Actions

Open a terminal in an empty folder.

Run the two commands below.

hdrctl init child
hdrctl init master

Each command creates a full project with job1 and workflow1. The two folders sit side by side, so the master reaches the child with ../child.

What you should see
Two lines, Project 'child' created and Project 'master' created.

Project 'child' created (workflow1 with job1).
Project 'master' created (workflow1 with job1).

##### 02Run the child alone

###### Objective

Check that it works before you call it.

###### Actions

Open a terminal in the child folder.

Run the command below.

hdrctl run .

The child is a normal project. Calling it from another project adds nothing to the child.

What you should see
Project 'child' completed with 1/1 workflow OK.

Project 'child' completed in 2.1s — 1/1 workflow(s) OK

##### 03Add a project step to the master

###### Objective

A step that runs another project.

###### Actions

Open master/workflows/workflow1.yaml.

Add the second step below, after job1.

master/workflows/workflow1.yaml

The step has no job and no action: its type is project and project holds the path of the folder. depends_on works as for any step.

steps:
- name: job1
type: job
job: ../jobs/job1
depends_on: []
on_failure: fail
- name: call_child
type: project
project: ../child
depends_on: [job1]

What you should see
A workflow with two steps.

##### 04Run the master

###### Objective

Read the called project under its step.

###### Actions

Open a terminal in the master folder.

Run the command below.

hdrctl run .

The master runs job1, then call_child. The workflow and the job of the child are listed under the step. The dry run, hdrctl run . --dry-run, answers Dry run OK.

What you should see
Both steps OK and Project 'master' completed.

Workflow workflow1
Step 'job1' OK (1.4s)
Step 'call_child' OK (0.1s)
✓ workflow1 (0.0s)
✓ job1
Workflow 'workflow1' OK (1.5s)
Project 'master' completed in 1.5s — 1/1 workflow(s) OK

##### 05Read the two errors

###### Objective

A wrong path and a loop.

###### Actions

Change project to ../nothing and run hdrctl run ..

Change it to . and run again.

hdrctl run .

Both errors stop the run before any step starts. The first gives the path you wrote and the folder it resolved to. The second shows that a project cannot call itself.

What you should see
Two Project 'master' cannot run boxes.

step 'call_child': project folder not found: ../nothing (resolved from the project root: ...\nothing)

step 'call_self': the project calls itself

###### Tips and tricks

Run the child alone first. A failure is easier to read there than under the step of the master.

Keep related projects in sibling folders and use relative paths such as ../child.

The path is read from the root of the calling project, not from the workflow file. ../child works from master/.

Each project keeps its own .hydra folder and its own parameters and secrets.

#### What should I have at the end?

VerificationExpected result

Steptype: project, project: ../child

Orderdepends_on, as for any step

OutputChild steps listed under the step

ErrorsFolder not found, project calls itself

#### What if something goes wrong?

SymptomCauseFix

project folder not foundThe path does not resolve from the project rootCheck the path against the master folder

the project calls itselfproject points to the current projectPoint to another project

Step type errorA job or action key was mixed inKeep only project keys in a project step

Child failsA step of the child failedRun the child alone and read its error

#### Frequently asked questions

##### How does a Hydra project call another project?

With a workflow step of type project. The step has a name and a project path, for example project: ../child. The path is read from the root of the calling project. Both projects are ordinary Hydra projects, each with its own .hydra folder.

##### What does the calling project print?

The step is reported like any other, and the steps of the called project appear under it. In our test: Step 'call_child' OK, then the called workflow and its job.

##### Can a project call itself?

No. With project: . the run stops before it starts with the message the project calls itself. The same check applies to a loop through several projects, according to the source; we tested only the direct case.

##### What happens if the project folder does not exist?

The run stops with project folder not found, followed by the path as given and the folder it resolved to. The dry run reports the same error.

##### Does a dry run run the called project?

In our test the dry run printed Dry run OK for the calling project and did not list the steps of the called project.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Pass parameters to a sub-project

Launch a job from the CLI and the API

Create a workflow

#### Next lesson

A project can be a step of another project. Next, hand values to the called project and read results back.

Pass parameters →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Clean, split, window, pivot and script transformations — slug: /cli/guides/clean-split-window-pivot-and-script/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sources and transformations

Guide · Sources and transformations

### Clean, split, window, pivot and script transformations

Six transformations that the first lesson did not cover. Each one runs in a tiny job on three or four rows, and you see the rows before and after.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

clean · text_to_rows · window · pivot · unpivot · scriptabout 20 minutesHydra ETL 0.22 on Windows

Quick answer
Six more steps for transformations.yaml: clean tidies text, text_to_rows splits one value into rows, window numbers and accumulates, pivot and unpivot turn rows into columns and back, and script runs your own Python.

#### What will you learn in this lesson?

##### Goal

Run six tiny jobs, one transformation each, and read the rows they produce.

##### Prerequisites

Hydra ETL 0.22 installed, and the first transformations lesson, Reshape the data. See Install and start.

A job folder with a CSV source and a CSV destination, as in Read CSV, JSON and Parquet files. Only transformations.yaml changes below.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I clean, split, pivot and script data?

##### 01Clean spaces and case

###### Objective

Make text comparable.

###### Actions

Use orders.csv, whose first row has spaces around north and Apple.

Put the step below in transformations.yaml and run the job.

steps:
- clean:
columns: [region, product]
case: lower

hdrctl run jobs\t-clean

Input and output, three rows each. case accepts none, lower and upper.

id,region,product,qty,price,tags
1, north , Apple ,10,2.5,a;b
2,SOUTH,Pear,5,4,c
3,north,apple,7,2.5,a;c

id,region,product,qty,price,tags
1,north,apple,10,2.5,a;b
2,south,pear,5,4,c
3,north,apple,7,2.5,a;c

What you should see
3 rows read, 3 written, with north, south and apple in lower case and without spaces.

Rows read : 3
Rows written: 3

##### 02Split a value into rows

###### Objective

One row per tag.

###### Actions

Use the same file.

Put the step below in transformations.yaml and run the job.

steps:
- text_to_rows:
column: tags
sep: ";"

hdrctl run jobs\t-split

The tags value a;b becomes two rows, and every other column is copied. The step does not clean the other columns: the spaces around north are still there.

1, north , Apple ,10,2.5,a
1, north , Apple ,10,2.5,b
2,SOUTH,Pear,5,4,c
3,north,apple,7,2.5,a
3,north,apple,7,2.5,c

What you should see
3 rows read, 5 written.

Rows read : 3
Rows written: 5

##### 03Number rows and add a running total

###### Objective

Window functions keep every row.

###### Actions

Use sales.csv: region, month, amount, four rows.

Put the steps below in transformations.yaml and run the job.

steps:
- cast:
mapping:
amount: int
month: int
- window:
partition_by: [region]
order_by: [month]
columns:
step: {func: row_number}
running: {func: cumsum, col: amount}
previous: {func: lag, col: amount, default: 0}

hdrctl run jobs\t-window

Each region is its own partition. window adds three columns and keeps the four rows. The cast comes first because a CSV has no types and cumsum needs numbers.

region,month,amount,step,running,previous
north,1,10,1,10,0
north,2,20,2,30,10
south,1,5,1,5,0
south,2,15,2,20,5

What you should see
4 rows read, 4 written, with three new columns.

Rows read : 4
Rows written: 4

##### 04Turn rows into columns

###### Objective

Pivot the months.

###### Actions

Use the same sales.csv.

Put the steps below in transformations.yaml and run the job.

steps:
- cast:
mapping:
amount: int
- pivot:
index: [region]
column: month
values: amount
aggfunc: sum

hdrctl run jobs\t-pivot

One row per region and one column per month. The columns are named 1 and 2, after the month values.

region,1,2
north,10,20
south,5,15

What you should see
4 rows read, 2 written.

Rows read : 4
Rows written: 2

##### 05Turn columns into rows

###### Objective

Unpivot the months back.

###### Actions

Use wide.csv: region, m1, m2, two rows.

Put the step below in transformations.yaml and run the job.

steps:
- unpivot:
id_vars: [region]
var_name: month
value_name: amount

hdrctl run jobs\t-unpivot

Every column that is not in id_vars becomes a row. The output lists m1 for both regions first, then m2.

region,month,amount
north,m1,10
south,m1,5
north,m2,20
south,m2,15

What you should see
2 rows read, 4 written.

Rows read : 2
Rows written: 4

##### 06Write your own step

###### Objective

Compute a column with Python.

###### Actions

Use orders.csv.

Put the steps below in transformations.yaml and run the job.

Add import os on the first line of code and run it again.

steps:
- cast:
mapping:
qty: int
price: float
- script:
inputs: [qty, price]
outputs:
total: float
code: |
total = qty * price

hdrctl run jobs\t-script

The code assigns each output column. By default it works on whole columns (vectorized). The new total column holds 25.0, 20.0 and 17.5. With import os added, the run fails: the restricted environment refuses imports.

What you should see
A total column, then a failed run with the message below.

id,region,product,qty,price,tags,total
1, north , Apple ,10,2.5,a;b,25.0

Job 't-script-bad' failed: ValueError: Step 2/2: script: 'import' interdit dans le code

###### Tips and tricks

Test a transformation on three or four rows first. You can read the whole output by eye.

Put cast before window, pivot and script when they compute on numbers.

text_to_rows keeps the other columns as they are. Run clean first if their spaces matter.

The script error is in French in Hydra ETL 0.22. interdit means forbidden.

#### What should I have at the end?

VerificationExpected result

Textclean, text_to_rows

Orderwindow with partition_by and order_by

Shapepivot and unpivot

Codescript with typed outputs

#### What if something goes wrong?

SymptomCauseFix

unknown columnsThe column name changed in an earlier stepCheck the order of the steps

script: import forbiddenThe restricted environment refuses importsWrite the code with the inputs only

window needs order_byRank, offset and running functions need an orderAdd order_by

Wrong numeric resultThe CSV column is textAdd a cast step first

#### Frequently asked questions

##### How do I clean spaces and letter case in Hydra ETL?

Use the clean transformation: clean with columns and case set to lower or upper. It removed the spaces around values and lowered the case in our test. According to the source, without columns it applies to all text columns; we did not test that.

##### How do I split a value into several rows?

Use text_to_rows with the column and a separator. In our test a tags value a;b became two rows, and the other columns were copied. 3 rows in, 5 rows out.

##### How do I number rows or compute a running total?

Use window with partition_by, order_by and columns. row_number, cumsum and lag worked in our test. cumsum needs a numeric column, so cast a CSV column first.

##### What do pivot and unpivot do?

pivot turns the values of a column into columns, with an aggregate such as sum. unpivot does the reverse and turns columns back into rows. Both ran on two small files in our test.

##### Can I write my own Python step?

Yes, with the script transformation: you declare input columns, typed output columns and the code. It runs in a restricted environment: an import was refused in our test. The error message is in French in Hydra ETL 0.22.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Reshape the data between source and destination

Read CSV, JSON and Parquet files

What a Hydra job is made of

#### Next lesson

Six more transformations, tested on tiny files. Merge, Union, Trim and Transpose are not covered here. Next, close the job with a destination.

Destinations →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Advanced sources: Snowflake, BigQuery and CDC — slug: /cli/guides/configure-snowflake-bigquery-and-cdc-sources/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sources and transformations

Guide · Sources and transformations

### Advanced sources: Snowflake, BigQuery and CDC

Write a Snowflake, BigQuery, PostgreSQL CDC or MySQL CDC source, validate it without any server, and read what a run says when nothing answers.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl validateabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
Snowflake, BigQuery and the two CDC sources need an account or a server. hdrctl validate checks their YAML without one, and a run tells you which part is missing.

#### What will you learn in this lesson?

##### Goal

Write four sources, validate them offline, run them against nothing, and read the four messages.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

No account and no server: this lesson uses made-up values on purpose.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I configure a Snowflake or CDC source in Hydra ETL?

##### 01Write the Snowflake source

###### Objective

One job folder, three files.

###### Actions

Create the folder jobs/snowflake.

Save the three files below in it. The source is the one that changes; pipeline.yaml and destinations.yaml stay the same for every source in this lesson.

hdrctl validate jobs\snowflake

sources.yaml:

sources:
src:
type: snowflake
connection:
account: xy12345.example
user: demo_user
password: demo-password
warehouse: COMPUTE_WH
database: SALES
schema: PUBLIC
role: ANALYST
column_case: lower
extract:
table: ORDERS

pipeline.yaml:

pipeline:
from: src
to: dest

destinations.yaml:

destinations:
dest:
type: csv
load:
table: data/out.csv
mode: replace

What you should see
Every line ok, then DSL valid.

ok sources.yaml — Pydantic valid
ok destinations.yaml — Pydantic valid
ok pipeline.from — resolved: src
ok pipeline.to — resolved: dest

✅ DSL valid — no errors detected.

##### 02Run it against nothing

###### Objective

Validate is not a connection test.

###### Actions

Run the job.

Read the message: it names the connector, the source and the address.

hdrctl run jobs\snowflake

The account is made up, but the run still reaches for the network and fails after about 13 seconds. Use an account that you own when you test for real. The long certificate text is cut here.

What you should see
A failure that starts with connection failed.

ValueError: SnowflakeConnector [src]: connection failed.
DSN : snowflake://demo_user@xy12345.example/SALES/PUBLIC
Error: DatabaseError: 250001 (08001): Failed to login: HTTP request failed after retries: login request. invalid peer certificate: …

❌ Pipeline FAILED in 13.4s

##### 03Swap in BigQuery

###### Objective

A driver can be missing.

###### Actions

Create jobs/bigquery with the same pipeline.yaml and destinations.yaml.

Use the source below, validate it, then run it.

hdrctl run jobs\bigquery

sources.yaml:

sources:
src:
type: bigquery
connection:
project: my-project
dataset: sales
location: EU
credentials_file: ../../keys/sa.json
extract:
table: orders

Validation passed here too. The run stops in 1.6 seconds because the BigQuery driver was not installed on our machine.

What you should see
A failure that names the driver and the install command.

ValueError: BigQueryConnector [src]: query failed.
Error: ValueError: BigQueryConnector [src]: the BigQuery driver is not installed. Install it with 'pip install "hydra-etl[bigquery]"'.

❌ Pipeline FAILED in 1.6s

##### 04Swap in a CDC source

###### Objective

Same job, a server that is not there.

###### Actions

Create jobs/pgcdc with the same two other files.

Use the source below, validate it, then run it.

hdrctl run jobs\pgcdc

sources.yaml:

sources:
src:
type: postgresql_cdc
connection:
host: 127.0.0.1
port: 5499
user: demo_user
password: demo-password
database: shop
slot: hydra_orders
publication: hydra_orders
extract:
table: public.orders

Nothing listens on port 5499, so the run fails. The address in the message shows the password as three stars. A mysql_cdc source with state and server_id instead of slot and publication failed the same way in 4 seconds; its message follows the language of Windows.

What you should see
A failure that starts with database connection failed.

ValueError: PostgreSQLCDCConnector [src]: database connection failed.
DSN : postgresql://demo_user:***@127.0.0.1:5499/shop?slot=hydra_orders&publication=hydra_orders
Error: OperationalError: connection to server at "127.0.0.1", port 5499 failed: Connection refused …

❌ Pipeline FAILED in 3.6s

###### Tips and tricks

Validate first, on every machine: it is the only step that needs nothing outside the YAML.

Read the first line of a failure: it names the connector and the source, so you know which of several sources failed.

validate passing does not mean the account, the driver or the server exists. All four sources passed it and none could run.

A made-up Snowflake account still makes the run call the network for about 13 seconds. Do not leave a real-looking host name in a test file.

Keep real passwords out of sources.yaml. See Store and use secrets.

#### What should I have at the end?

VerificationExpected result

Snowflaketype: snowflake, connection: account, user, password, warehouse, database, schema

BigQuerytype: bigquery, connection: project, dataset, credentials_file

PostgreSQL CDCtype: postgresql_cdc, connection: slot, publication

MySQL CDCtype: mysql_cdc, connection: state, server_id

Checkhdrctl validate jobs\NAME

#### What if something goes wrong?

SymptomCauseFix

connection failedThe account, user or address is wrongCheck the DSN line in the message

driver is not installedThe optional package is missingRun the pip command in the message

database connection failedNothing answers on that host and portStart the server or fix the port

#### Frequently asked questions

##### How do I check a Snowflake, BigQuery or CDC source without a server?

Run hdrctl validate on the job folder. In our test on Hydra ETL 0.22, validate accepted a Snowflake, a BigQuery, a PostgreSQL CDC and a MySQL CDC source with made-up values and no server. It checks the shape of the YAML only, not the connection.

##### What does a run say when the server or the account is missing?

It stops with a message that names the connector and the source. A PostgreSQL CDC run on a closed port answered Connection refused after 3.6 seconds, a BigQuery run without the driver answered that the driver is not installed after 1.6 seconds, and a Snowflake run with a made-up account failed after 13 seconds.

##### Is the password shown in the error?

Not in our test. The PostgreSQL CDC and MySQL CDC messages print the connection address with the password replaced by three stars, and the Snowflake message prints the user without the password.

##### What do the CDC sources need on the database side?

According to the connector documentation in the source, PostgreSQL needs a role with the REPLICATION attribute, and MySQL needs the binary log on in ROW format with full row images. We did not test either, because it needs a database server.

##### Does Hydra ETL read MongoDB with this configuration?

We did not cover it. In our test, validate accepted a MongoDB source with extract.table, but a run asked for a collection name, and with extract.collection alone the engine asked for a table or a query. Check the current documentation before you rely on it.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Read and write SQLite databases

Store and use secrets

Switch environments

#### Next lesson

Four sources, one validation, four honest failures. Not covered here: a real account, a real server, and MongoDB.

Back to Database sources →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Connect Claude Code to Hydra ETL with the MCP server — slug: /cli/guides/connect-claude-code-to-hydra-etl-with-mcp/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›MCP server

Guide · MCP server

### Connect Claude Code to Hydra ETL with the MCP server

Install the mcp extra, run hdrctl mcp setup to write .mcp.json, then check the 21 tools of the Hydra ETL MCP server and its guardrails from a small client.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl mcp setupabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl mcp setup writes a .mcp.json file at the root of your project. It tells Claude Code to start the Hydra ETL MCP server, which gives the assistant 21 tools limited to that project folder.

#### What will you learn in this lesson?

##### Goal

Install the extra, write .mcp.json, run setup again, then talk to the server from a short Python client to see its tools and its refusals.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

Python 3.10 or later: the MCP SDK needs it.

A project: hdrctl init mcp-demo --template csv. Work in its folder.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I connect Claude Code to Hydra ETL with MCP?

##### 01Install the MCP extra

###### Objective

The server needs the MCP SDK.

###### Actions

Run the command below in the environment where hdrctl lives.

Check the SDK with py -m pip show mcp.

py -m pip install "hydra-etl[mcp]"

The extra installs the mcp package, for Python 3.10 or later. In our test, a clean environment got Hydra ETL 0.22.0 and mcp 2.3.0. Without the extra, hdrctl mcp setup stops and asks for it.

What you should see
pip show mcp prints a name and a version.

Name: mcp
Version: 2.3.0
Summary: Model Context Protocol SDK

##### 02Run the setup

###### Objective

One command, in the project.

###### Actions

Go to the project folder.

Run the command below.

hdrctl mcp setup

The command finds the root of the project from where you are, writes .mcp.json there, and prints the Python it will use and the folder the server may read and write. The project made by hdrctl init does not list .mcp.json in its .gitignore, so the command reminds you to add it if the project is shared.

What you should see
A green line saying the file was created, then the notes.

✅ Claude Code: ...\mcp-demo\.mcp.json created (server "hydra-etl").
Python: ...\venv\Scripts\python.exe
Workspace: ...\mcp-demo (the server reads and writes only there)
.mcp.json holds paths of this computer: add it to .gitignore if the project is shared; each person runs `hdrctl mcp setup` once.

Next: open a terminal in the project, run `claude`, approve the hydra-etl server,
then type /mcp to see its tools, and ask for a pipeline in a sentence.

##### 03Read .mcp.json

###### Objective

It starts the server with the Python that ran hdrctl.

###### Actions

Open the file.

type .mcp.json

The command is the full path of the Python that runs hdrctl, so the server uses the Hydra ETL you installed, whatever is on the PATH. --workspace is the folder the server may touch. Because the file holds paths of your computer, each person of a team runs the setup once.

What you should see
One server named hydra-etl.

{
"mcpServers": {
"hydra-etl": {
"type": "stdio",
"command": "...\\venv\\Scripts\\python.exe",
"args": [
"-m",
"hydra_etl.mcp",
"--workspace",
"...\\mcp-demo"
]
}
}
}

##### 04Run it again

###### Objective

Setup is safe to repeat.

###### Actions

Run hdrctl mcp setup a second time, then once from the jobs folder.

Try hdrctl mcp setup --path nope.

hdrctl mcp setup --path nope

Run again, even from a subfolder, the command finds the same project root and reports the file as unchanged. If the file already holds other servers, they are kept. According to the source, a .mcp.json that is not valid JSON is never overwritten: the command refuses and changes nothing. We tested the repeat and the wrong folder, not the invalid file.

What you should see
unchanged on the repeats, and an error for the wrong folder.

✅ Claude Code: ...\mcp-demo\.mcp.json unchanged (server "hydra-etl").

❌ Folder not found: nope

##### 05Talk to the server

###### Objective

A short client, as Claude Code would.

###### Actions

Save the script below as check_mcp.py.

Run it with the Python of .mcp.json, giving the project folder and that Python.

py check_mcp.py "%CD%" ""

The script starts the server over stdio, as Claude Code does, and lists its tools with the two flags a client reads before it asks you to confirm an action. It then reads a job and two paths that must be refused.

import asyncio, sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

WORKSPACE, PYTHON = sys.argv[1], sys.argv[2]

async def main():
params = StdioServerParameters(
command=PYTHON, args=["-m", "hydra_etl.mcp", "--workspace", WORKSPACE])
async with stdio_client(params) as (read, write):
async with ClientSession(read, write) as session:
await session.initialize()
tools = await session.list_tools()
print(len(tools.tools), "tools")
for t in tools.tools:
a = t.annotations
print(t.name, "| readOnly =", a.read_only_hint, "| destructive =", a.destructive_hint)
for path in ("jobs/job1", "../outside", "C:/Windows"):
result = await session.call_tool("hydra_read_job", {"job_path": path})
print("#", path)
print(result.content[0].text[:120])

asyncio.run(main())

What you should see
21 tools, with the read-only ones flagged as such.

21 tools
hydra_list_operations | readOnly = True | destructive = False
hydra_list_connectors | readOnly = True | destructive = False
hydra_list_jobs | readOnly = True | destructive = False
hydra_read_job | readOnly = True | destructive = False
hydra_validate_job | readOnly = True | destructive = False
hydra_write_job | readOnly = False | destructive = False
hydra_delete_job | readOnly = False | destructive = True
hydra_run_job | readOnly = False | destructive = True
hydra_write_workflow | readOnly = False | destructive = False
hydra_run_workflow | readOnly = False | destructive = True
... (11 more, all read-only)

##### 06Read the refusals

###### Objective

The server stays inside the project.

###### Actions

Look at the last lines of the output of the script.

py check_mcp.py ...

The first path is a real job and is read. The two others are refused before any file is touched. In our test the server also refused a job written with invalid YAML (REFUSED — sources.yaml is not valid YAML), and refused to delete a job that a workflow still runs (REFUSED — nothing was moved). Deleting a job moves it to .hydra/trash, according to the source.

What you should see
REFUSED for both bad paths.

# jobs/job1
### sources.yaml
sources:
src_csv:
type: csv
...
# ../outside
REFUSED — Path outside the workspace: '../outside'. Allowed root: ...\mcp-demo
# C:/Windows
REFUSED — Absolute path refused: 'C:/Windows'. Give a path relative to ...\mcp-demo

###### Tips and tricks

Open Claude Code in the project folder, approve the hydra-etl server when asked, then type /mcp. We did not run Claude Code in this test: the steps above check the server it will start.

Ask the assistant to read and validate before it writes. The tool hydra_write_job validates first and writes nothing if the job is invalid, according to the source.

hydra_run_job writes real data to the destination. In our test, running job1 through the server read 3 rows and wrote 2 to data/output.csv. Run only what you asked for.

Without the extra, setup stops. Install hydra-etl[mcp] in the same environment as hdrctl, because .mcp.json points to that Python.

Move the project or recreate the virtual environment and the paths in .mcp.json are wrong. Run hdrctl mcp setup again: it updates the entry.

#### What should I have at the end?

VerificationExpected result

Commandhdrctl mcp setup [claude-code] [--path FOLDER]

Writes.mcp.json at the project root (other servers kept)

Serverpython -m hydra_etl.mcp --workspace FOLDER (stdio)

Tools21, with read-only and destructive flags

Scopefiles inside the workspace folder only

#### What if something goes wrong?

SymptomCauseFix

The MCP server needs its extra: pip install "hydra-etl[mcp]"The mcp package is missing, or Python is older than 3.10Install hydra-etl[mcp] with Python 3.10 or later

Folder not found: nope--path is not a folderGive an existing folder of the project

REFUSED — Path outside the workspaceThe assistant asked for a path with ..Give a path relative to the project

#### Frequently asked questions

##### What is the Hydra ETL MCP server?

A local program, started with python -m hydra_etl.mcp, that lets an AI assistant call 21 Hydra ETL tools: list the vocabulary, read, validate, write and run jobs and workflows. In our test on Hydra ETL 0.22 with the MCP SDK 2.3.0, a client listed all 21 tools over stdio.

##### Does hdrctl mcp setup change my global Claude Code settings?

No. According to the source and to our test, it writes a file named .mcp.json at the root of the project and nothing else. Existing servers of that file are kept, and a file that is not valid JSON is never overwritten.

##### Can the assistant read files outside my project?

In our test, a path with .. and an absolute path were both refused with a message naming the allowed root. The server works inside the folder given by --workspace.

##### Can the assistant run a job without asking me?

The tools that run or delete are flagged destructive, so a client can ask you first. The server description also tells the assistant to run a job only when you ask. Whether your client asks is a setting of the client, which we did not test.

##### Can I use it with a client other than Claude Code?

The server speaks standard MCP over stdio, and hdrctl mcp setup supports only claude-code. According to the source, there is also an HTTP mode with no authentication, meant for your own machine. We did not test other clients or the HTTP mode.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Manage jobs and parameters from the CLI

Anatomy of a job

Run Hydra ETL in production

#### Next lesson

Setup, the file it writes, and the server seen from a client. Not covered here: Claude Code itself, other clients, and the HTTP mode.

Back to all lessons →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Declare project triggers in triggers.yaml — slug: /cli/guides/declare-project-triggers/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Triggers

Guide · Triggers

### Declare project triggers in triggers.yaml

A trigger says when a project starts. Write four triggers in triggers.yaml, list and check them with hdrctl trigger, start one by hand and read its history.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl triggerabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
Triggers are declared in triggers.yaml at the project root. hdrctl trigger list shows them, validate checks them, fire NAME starts one now and history lists what ran.

#### What will you learn in this lesson?

##### Goal

Declare four triggers, list and validate them, fire one by hand, read the history and read the errors of a broken file.

##### Prerequisites

Hydra ETL 0.22 installed, and the project built in Anatomy of a job. See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I declare a trigger?

##### 01Write triggers.yaml

###### Objective

Four triggers, one per kind of start.

###### Actions

Open the project folder.

Create triggers.yaml at its root with the content below.

triggers.yaml

Each trigger has a name and a type. A cron trigger holds a cron expression and optionally a time zone. An interval trigger holds an every delay. A file trigger watches a path inside the project and a marker trigger waits for a flag file. workflows lists what the trigger runs. Without it, the whole thread runs. enabled: false keeps a trigger in the file but switched off.

version: "1.0"
triggers:
- name: nightly
type: cron
cron: "0 2 * * *"
timezone: UTC
workflows: [workflow1]
- name: every-15-min
type: interval
every: 15m
overlap: skip
- name: new-files
type: file
path: Data/incoming
events: [added]
- name: go-flag
type: marker
path: go.flag
enabled: false

What you should see
A file with four triggers.

##### 02List the triggers

###### Objective

See what the project declares.

###### Actions

Run the command below in the project folder.

hdrctl trigger list

Each line gives the state, on or off, the name and a plain-language summary of when the trigger fires. Before you create the file, the command answers No trigger.

What you should see
Four lines, three on and one off.

on nightly cron 0 2 * * * (UTC)
on every-15-min every 15m
on new-files added: Data/incoming
off go-flag marker file go.flag (removed)

##### 03Validate the file

###### Objective

Catch mistakes before anything runs.

###### Actions

Run the command below.

hdrctl trigger validate

The command reads the file and checks each trigger against its type.

What you should see
Triggers valid with the number of triggers.

Triggers valid — 4 trigger(s)

##### 04Fire one trigger by hand

###### Objective

Start the project as the trigger would.

###### Actions

Run the command below.

hdrctl trigger fire nightly

fire runs the project now, with the workflows, environment and parameters of the trigger. In our test the run took 2.8 seconds. Naming a trigger that does not exist stops with Trigger 'nope' not found in triggers.yaml and lists the known names.

What you should see
A line naming the trigger and its schedule, then project run with the duration.

Trigger nightly — cron 0 2 * * * (UTC) — env: none
Trigger 'nightly' — project run in 2.8s

##### 05Read the history

###### Objective

See what the triggers started.

###### Actions

Run the command below.

hdrctl trigger history

The history lives in .hydra/triggers/history.jsonl, inside the project. The line shows the date in UTC, the trigger, manual because we used fire, and the duration.

What you should see
One line with a green mark.

Trigger history ...\.hydra\triggers\history.jsonl
✓ 2026-11-24T05:46:40+00:00 nightly manual 2.76s

##### 06Break the file on purpose

###### Objective

Read the four errors you will meet.

###### Actions

Change cron to "99 2 * * *" and validate.

Rename every to evry and validate.

Give the interval trigger a cron key and remove it from the cron trigger, then validate.

Set workflows: [missing-wf] and validate.

hdrctl trigger validate

The messages name the trigger and the key at fault. Several errors in one file are reported together.

What you should see
A red err line for each problem.

trigger 'nightly': cron '99 2 * * *': minute: 99 is out of range (0-59)
triggers[0].evry: Extra inputs are not permitted
trigger 'every-15-min': cron does not apply to type interval
trigger 'nightly': type cron requires 'cron'
trigger 'nightly': workflow(s) not found: missing-wf (workflows/.yaml)

###### Tips and tricks

Keep enabled: false on a trigger you are still writing: it stays in the file without starting anything.

Test a trigger with hdrctl trigger fire before you rely on its schedule.

A file or marker path must stay inside the project: relative, without ... The Hydra source rejects absolute paths.

fire really runs the project and writes its data. Use hdrctl run . --dry-run first if you only want to check the plan.

#### What should I have at the end?

VerificationExpected result

Filetriggers.yaml at the project root

Typescron, interval, file, marker, and three more

Checkhdrctl trigger validate

Testhdrctl trigger fire NAME

#### What if something goes wrong?

SymptomCauseFix

Extra inputs are not permittedA key is misspelledFix the key named in the message

does not apply to typeA key belongs to another trigger typeRemove it or change the type

workflow(s) not foundA workflow in the list has no fileCreate it or fix the name

Trigger not foundThe name is not in triggers.yamlRead the list of known names

#### Frequently asked questions

##### What is a trigger in Hydra ETL?

A trigger is an entry in triggers.yaml, at the project root, that says when to run the project: at a time, every so often, when a file shows up, and so on. Each trigger has a name and a type.

##### Which trigger types exist?

The Hydra ETL 0.22 source lists seven: cron, interval, file, marker, source_change, webhook and after_project. We tested cron, interval, file and marker; the others have their own lessons.

##### Who runs the triggers?

According to the help of hdrctl trigger, they run inside hdrctl watch and hdrctl serve. We did not leave either running in this lesson. hdrctl trigger fire NAME runs one trigger right away, and that is what we tested.

##### How do I check triggers.yaml before using it?

Run hdrctl trigger validate. It reports unknown keys, keys that do not suit the trigger type, impossible cron expressions and workflows that do not exist. A valid file answers Triggers valid, with the number of triggers.

##### Where do I see what a trigger started?

Run hdrctl trigger history. It reads .hydra/triggers/history.jsonl in the project and prints one line per run, with the trigger name, how it started (manual for fire) and the duration.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Orchestrate from thread.yaml

Launch a job from the CLI and the API

Create a workflow

#### Next lesson

A trigger is one entry in one file. Next, see the other ways to launch a project without Studio.

Launch from the CLI →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Hydra CLI guides — slug: /cli/guides/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

HYDRA CLI · GUIDES

### Hydra CLI guides

13 tested, step-by-step guides. Each one sits under the command it teaches; topics with no command of their own have their own heading.

HDRCTL INIT

#### Create a job

hdrctl init reference →

Anatomy of a jobThe four manifests of a job folder, how they link, and what validate says when one breaks.→

HDRCTL RUN

#### Run and launch

hdrctl run reference →

Other launchesRun the same job without Studio from the command line and the API, and see where each launch shows up.→

HDRCTL JOB

#### Jobs and parameters

hdrctl job reference →

Manage projectsAdd, attach and detach jobs, and set project parameters per environment, from the command line.→

TOPIC

#### Sources and transformations

File sourcesDeclare a CSV, JSON or Parquet source, run it and read the error of a missing file.→Database sourcesRead a table or a query from SQLite and write to SQLite with append, replace or upsert, with no server.→Advanced sourcesWrite a Snowflake, BigQuery or CDC source, validate it offline and read the failures.→Transformations 2Clean, split, window, pivot, unpivot and script steps, each run on a tiny file.→

TOPIC

#### Sub-projects

Sub-projectsRun another project from a workflow step, and read what a wrong path or a loop gives.→Sub-project parametersHand values down with params, publish a result with set_param and read it back.→

HDRCTL TRIGGER

#### Triggers

hdrctl trigger reference →

TriggersDeclare triggers in triggers.yaml, check them, fire one by hand and read the history.→

HDRCTL WATCH

#### Watch

hdrctl watch reference →

Other triggersRun interval, marker, file and source triggers with hdrctl watch and read what each one prints.→

HDRCTL SERVE

#### Production

hdrctl serve reference →

ProductionServe the API without Studio, run a cron workflow and read the scheduled runs.→

HDRCTL MCP

#### MCP server

hdrctl mcp reference →

MCP serverWrite .mcp.json with hdrctl mcp setup and check the 21 tools and the path guardrails.→

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Launch a Hydra job from the CLI and the API — slug: /cli/guides/launch-a-job-from-the-cli-and-the-api/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Run and launch

Guide · Run and launch

### Launch a Hydra job from the CLI and the API

Run the same job without Studio: from the command line for one job or a whole project, and from the API with one POST request.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl runabout 10 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl run jobs/job1 runs one job. hdrctl run . runs a whole project, and POST /api/runs starts the same project through the API of hdrctl serve. The engine underneath is the same.

#### What will you learn in this lesson?

##### Goal

Run a job and a project from the command line, then start the project from the API and read the run back.

##### Prerequisites

Hydra ETL 0.22 installed, and the project built in Anatomy of a job (a folder created by hdrctl init). See Install and start.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I launch a job without Studio?

##### 01Run one job

###### Objective

Launch a job folder from the command line.

###### Actions

Open a terminal in the project folder.

Run the command below.

hdrctl run jobs\job1

The command runs the job alone: its source, its transformations and its destination. The workflow and the thread are not involved.

What you should see
Pipeline completed successfully with the rows read and written.

Pipeline job1 — jobs\job1
Pipeline completed successfully in 2.3s
Rows read : 3
Rows written: 2

##### 02Run the whole project

###### Objective

Launch every workflow of the thread.

###### Actions

Run the command below from the project folder.

hdrctl run .

A project is a folder that holds .hydra. hdrctl run . runs its workflows in the order of workflows/thread.yaml. This project has one workflow, workflow1, which runs job1.

What you should see
A stage line, one workflow line and Project ... completed with 1/1 workflow(s) OK.

Project launch-demo — 1 workflow(s) in 1 stage(s)
Stage 1/1 — sequential
Workflow workflow1
Workflow 'workflow1' OK (1.6s)
Project 'launch-demo' completed in 1.6s — 1/1 workflow(s) OK

##### 03Start the API server

###### Objective

Serve the API that Studio itself uses.

###### Actions

Open a second terminal.

Run the command below and leave it open.

Check the server from the first terminal with curl.exe http://127.0.0.1:5678/api/health.

hdrctl serve

The server listens on port 5678 by default. The health answer gives the version of the engine.

What you should see
A JSON answer with "status":"ok" and "version":"0.22.0".

{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0",...}

##### 04Start a run with a POST

###### Objective

Send the project to the engine.

###### Actions

Create a file run.json that holds the path of the project folder, with doubled backslashes.

Run the curl.exe command below from the first terminal.

run.json:
{"workflow_path": "C:\\Users\\you\\launch-demo"}

curl.exe -s -i -X POST -H "Content-Type: application/json" -d @run.json http://127.0.0.1:5678/api/runs

The server answers 202 Accepted at once, without waiting for the end of the run. The body gives a run_id, which is different on each call, and the status pending. Because the path is a project folder, the run is named project: followed by the folder name.

What you should see
HTTP/1.1 202 Accepted and a JSON body with "status":"pending".

HTTP/1.1 202 Accepted
{"run_id":"692f87f4","workflow_name":"project:launch-demo",...,"status":"pending",...,"trigger":"manual"}

##### 05Read the run

###### Objective

Follow the run to its end.

###### Actions

Wait a few seconds.

Run the command below.

curl.exe -s http://127.0.0.1:5678/api/runs

The list holds one entry per run, with its status, its duration and one item per step. In our test the run was success after 0.6 seconds, with one step, workflow1, and the log line OK job1. output.csv was written in jobs/job1/data.

What you should see
A run with "status":"success" and one step.

[{"run_id":"692f87f4","workflow_name":"project:launch-demo","status":"success","duration":0.62,...,"steps":[{"step_name":"workflow1","success":true,...,"logs":["OK job1"]}],"trigger":"manual"}]

###### Tips and tricks

Use hdrctl run jobs/job1 while you write a job, and hdrctl run . when the thread matters.

Add --dry-run to hdrctl run . to validate the project without running anything.

In our test the run list of a freshly started server was empty, although two command-line runs had completed before. Runs started from the terminal were not in it. Start a run from the API or from Studio to see it listed.

A run is not saved on disk by the server: the list is lost when hdrctl serve stops, so read a run before you close the server.

#### What should I have at the end?

VerificationExpected result

One jobhdrctl run jobs/job1

Projecthdrctl run .

APIPOST /api/runs with workflow_path

ReadGET /api/runs

#### What if something goes wrong?

SymptomCauseFix

Path not found (404)workflow_path does not existCheck the path and the doubled backslashes

The list is emptyThe run was started outside this serverStart it with the POST

Status stays pendingThe run has not finishedWait, then read the list again

Connection refusedhdrctl serve is not runningStart the server and check the port

#### Frequently asked questions

##### How do I run a Hydra job without Studio?

Run hdrctl run , for example hdrctl run jobs/job1. It runs that one job and prints the rows read and written.

##### What is the difference between running a job and running a project?

hdrctl run on a job folder runs that job only. hdrctl run on a project folder, a folder with .hydra, runs the workflows of workflows/thread.yaml in order. In our test the project run took 1.6 seconds and reported 1/1 workflow(s) OK.

##### How do I start a run from the API?

Start hdrctl serve, then send POST /api/runs with a JSON body that holds workflow_path, the path of a workflow file or a project folder. The server answers 202 Accepted with a run_id and the status pending, and the run goes on in the background.

##### How do I read the result of an API run?

Call GET /api/runs. Each run lists its status, its duration and its steps. In our test the run went from pending to success in under a second.

##### Can an AI assistant launch a job?

Hydra ETL ships an MCP server with a hydra_run_job tool. According to its source, it runs hdrctl run on the job folder and returns the log. We did not test it here: the MCP server has its own lesson.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Four ways to run, one engine underneath

Find a past execution and its result

What a Hydra job is made of

#### Next lesson

One engine, three doors: the terminal, the API and, later, an assistant. Next, review what a run produced.

Review a run →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Manage the jobs and parameters of a Hydra project — slug: /cli/guides/manage-jobs-and-parameters-from-the-cli/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Jobs and parameters

Guide · Jobs and parameters

### Manage the jobs and parameters of a Hydra project

Add, attach and detach jobs in a workflow, and give a parameter a default value and a value per environment, all with hdrctl.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl job · hdrctl paramabout 20 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl job adds, attaches, detaches and lists the jobs of a project. hdrctl param declares parameters in parameters.yaml and gives them a value per environment. A job reads a parameter with {{ param:NAME }}.

#### What will you learn in this lesson?

##### Goal

Create a project, add a job to its workflow, move and detach it, then declare a parameter and run a job with two values of it.

##### Prerequisites

Hydra ETL 0.22 installed. Create a project with hdrctl init manage-demo and open a terminal in it. See Install and start and Anatomy of a job.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I manage the jobs and parameters of a project?

##### 01List the jobs

###### Objective

See each job and the workflows that use it.

###### Actions

Run the command below in the project folder.

hdrctl job list

A new project has one job, job1, used by workflow1. A job that no workflow uses is shown as free.

What you should see
One job, in workflow1.

job1 ✓ in: workflow1

1 job(s), 0 free

##### 02Add a job to a workflow

###### Objective

Create it and attach it in one command.

###### Actions

Run the command below.

Open workflows/workflow1.yaml.

hdrctl job add extra workflow1

The job extra is created in jobs/extra with the default template, and attached at the end of the workflow. The workflow file now has a second step that depends on the first.

steps:
- name: job1
type: job
job: ../jobs/job1
depends_on: []
on_failure: fail
- name: extra
type: job
job: ../jobs/extra
depends_on: [job1]
on_failure: fail

What you should see
A message saying the job was attached at position 2, after job1.

Job 'extra' created — jobs\extra
Job 'extra' attached to workflow 'workflow1', position 2.
Runs after step 'job1'.

##### 03Detach and attach at a position

###### Objective

Move a job without editing YAML.

###### Actions

Run hdrctl job detach extra workflow1.

Run hdrctl job attach extra workflow1 -p 1.

Read workflows/workflow1.yaml again.

hdrctl job detach extra workflow1
hdrctl job attach extra workflow1 -p 1

Detaching keeps the folder: extra becomes free. Attaching at position 1 puts it first, and job1 now depends on it (depends_on: [extra]).

What you should see
extra free, then attached as the first step.

Job 'extra' is now free: its folder is kept in jobs/.

Job 'extra' attached to workflow 'workflow1', position 1.
First step of the workflow.
Step 'job1' now runs after 'extra'.

##### 04Declare a parameter

###### Objective

A name, a type and a default.

###### Actions

Run the command below.

Run hdrctl param list.

Open parameters.yaml.

hdrctl param set min_value 0 --type int --description "Smallest value kept"

The parameter is written in parameters.yaml. Before this command, param list answers No parameters.

version: '1.0'
parameters:
min_value:
type: int
default: 0
description: Smallest value kept

What you should see
A table with min_value, int and 0.

NAME TYPE DEFAULT
min_value int 0

##### 05Use the parameter in a job

###### Objective

Replace a fixed value by a placeholder.

###### Actions

In jobs/job1/transformations.yaml, change the filter to the line below.

Run the job.

expr: "value > {{ param:min_value }}"

hdrctl run jobs\job1

The sample data has three rows, one of them with a negative value. With the default 0 the job reads three rows and writes two.

What you should see
Pipeline completed successfully, 3 rows read and 2 written.

Rows read : 3
Rows written: 2

##### 06Give the parameter a value per environment

###### Objective

Run the same job with another value.

###### Actions

Run the command below.

Run the job with --env prod.

Run hdrctl param unset min_value --env prod to remove the value.

hdrctl param set min_value 150 --env prod
hdrctl run jobs\job1 --env prod

The value goes to environments/prod.yaml. With 150 only the row with 200 stays: one row written. The param list table gets a prod column, and after unset the cell shows that the default is inherited.

What you should see
1 row written, 2,Bob,200.0.

NAME TYPE DEFAULT prod
min_value int 0 150

Rows read : 3
Rows written: 1

id,name,value
2,Bob,200.0

###### Tips and tricks

Run hdrctl job list after each change. A job that is free is not run by any workflow.

After attaching or detaching, check the project with hdrctl run . --dry-run, as the command itself suggests.

job detach keeps the folder and job add creates one from a template. Neither deletes your work.

Cast a CSV column before you compare it to a parameter, as in the first transformations lesson. The text of a CSV is not a number.

#### What should I have at the end?

VerificationExpected result

Jobshdrctl job list | add | attach | detach

Parametershdrctl param list | set | unset

Placeholder{{ param:NAME }}

Environmenthdrctl run ... --env NAME

#### What if something goes wrong?

SymptomCauseFix

Job not foundThe job folder does not existRun hdrctl job list

Workflow not foundThe workflow name is wrongRun hdrctl workflow list

Parameter not replacedThe name differs from parameters.yamlRun hdrctl param list

Same result with --envThe environment has no valueRun hdrctl param list and read its column

#### Frequently asked questions

##### How do I add a job to a workflow from the command line?

Run hdrctl job add . It creates jobs// from a template and adds a step of type job at the end of the workflow, after the previous step. Add -p N to choose the position.

##### What does detaching a job do?

hdrctl job detach removes the step and keeps the job folder in jobs/. The steps that ran after it now run after its own predecessors. hdrctl job list then shows the job as free.

##### Where is a project parameter stored?

Its type, default value and description are in parameters.yaml at the project root. The value for an environment is in environments/.yaml. Both are written by hdrctl param set.

##### How do I use a parameter in a job?

Write {{ param:NAME }} where the value goes, for example in a filter expression. In our test a job with value > {{ param:min_value }} wrote 2 rows with the default 0, and 1 row with the value 150 of the prod environment.

##### How do I run a job with an environment?

Add --env NAME to hdrctl run. We ran hdrctl run jobs\job1 --env prod, and the job used the prod value of the parameter.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Create a workflow

One placeholder, two values, two results

Project settings and Global settings

#### Next lesson

You can manage jobs and parameters without opening Studio. Next, see how triggers start a project.

Triggers →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Pass parameters to a Hydra sub-project and read results back — slug: /cli/guides/pass-parameters-to-a-sub-project/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sub-projects

Guide · Sub-projects

### Pass parameters to a Hydra sub-project and read results back

Send a value to a called project with params, publish a result from it with set_param, and read the result in the calling project.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

params · outputsabout 20 minutesHydra ETL 0.22 on Windows

Quick answer
params on a project step hand values down to the called project. outputs names the parameters it must publish, and {{ project:STEP.param.NAME }} reads them in the calling project after the step.

#### What will you learn in this lesson?

##### Goal

Give the child a parameter, pass a value from the master, publish a result from the child and read it back.

##### Prerequisites

The child and master projects of Call a project from a project.

Parameters in a job: Manage the jobs and parameters of a project.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I pass parameters to a sub-project?

##### 01Give the child a parameter

###### Objective

A value the master will set.

###### Actions

Open a terminal in the child folder.

Run the command below.

In jobs/job1/transformations.yaml, change the filter expression to the line below.

hdrctl param set min_value 0 --type int

expr: "value > {{ param:min_value }}"

With the default 0, the sample job keeps the rows above zero: two of the three.

What you should see
The message saying the default value was saved in parameters.yaml.

min_value: the default value saved in parameters.yaml

##### 02Publish a result from the child

###### Objective

A set_param step at the end of the child workflow.

###### Actions

Open child/workflows/workflow1.yaml.

Add the step below after job1.

child/workflows/workflow1.yaml

The set_param action creates a parameter at run time. Here it is named result_rows. A caller can ask for it by name.

- name: publish
type: action
action: set_param
params:
name: result_rows
value: 2
type: int
depends_on: [job1]

What you should see
A child workflow with two steps, job1 and publish.

##### 03Pass a value and ask for the result

###### Objective

params down, outputs up.

###### Actions

Open master/workflows/workflow1.yaml.

Replace the project step with the two steps below.

master/workflows/workflow1.yaml

params sets min_value in the child. outputs asks the child to publish result_rows. The log step reads three values of the project step, named after it.

- name: call_child
type: project
project: ../child
params:
min_value: 150
outputs: [result_rows]
depends_on: [job1]
- name: show
type: action
action: log
params:
message: "child {{ project:call_child.status }}, {{ project:call_child.rows }} row(s), published {{ project:call_child.param.result_rows }}"
depends_on: [call_child]

What you should see
Two new steps in the master workflow.

##### 04Run the master

###### Objective

See the value go down and the result come back.

###### Actions

Open a terminal in the master folder.

Run the command below.

Open child/jobs/job1/data/output.csv.

hdrctl run .

The log line shows the status of the child, the rows it wrote and the published value. The output file of the child holds only the row above 150.

id,name,value
2,Bob,200.0

What you should see
A log line starting with child success.

Step 'call_child' OK (0.1s)
Step 'show' OK (0.0s)
child success, 1 row(s), published 2
Project 'master' completed in 1.5s — 1/1 workflow(s) OK

##### 05Read the failures

###### Objective

An output that is not published, and a wrong name.

###### Actions

Change outputs to [nope] and run again.

In another test, replace {{ project:call_child.param.result_rows }} by {{ param:result_rows }}.

hdrctl run .

An output that the child does not publish fails the step. A plain {{ param:... }} does not see the result of a project step: use the project: form.

What you should see
Two failed runs with the messages below.

Step 'call_child' failed: project child did not publish nope (outputs: set them with set_param / assign_param, or declare them)

Step 'show' failed: ParameterError: unresolved parameter: 'result_rows'

###### Tips and tricks

Name project steps clearly: the step name is part of the placeholder, as in project:call_child.status.

Pass only what the child declares. Check its names with hdrctl param list in the child folder.

A value that you pass and the child does not declare is accepted without a message. A typo then keeps the default.

According to the source, params and variables may not carry secrets: a project keeps its own. We did not test this.

#### What should I have at the end?

VerificationExpected result

Downparams on the project step

Upoutputs plus set_param in the child

Read{{ project:STEP.param.NAME }}

AlsoSTEP.status and STEP.rows

#### What if something goes wrong?

SymptomCauseFix

did not publishThe child never set the outputAdd a set_param step in the child

unresolved parameterA plain param placeholder was usedUse project:STEP.param.NAME

Default value usedThe parameter name does not matchRun hdrctl param list in the child

Step fails on secretsA secret was passed in paramsLet the child use its own secrets

#### Frequently asked questions

##### How do I pass a value to a sub-project?

Add params to the project step, for example params: {min_value: 150}. The called project reads it as its parameter min_value. In our test the called job kept only the row above 150.

##### How do I read a result from a sub-project?

List the parameter names in outputs on the step. The called project must publish them, for example with a set_param action. After the step, read them with {{ project:STEP.param.NAME }}.

##### What else can I read after the step?

{{ project:STEP.status }} and {{ project:STEP.rows }}. In our test they gave success and 1 row for a step named call_child.

##### What if the sub-project does not publish an output?

The step fails with project child did not publish nope, and tells you to set the output with set_param or assign_param.

##### What if I pass a parameter the sub-project does not declare?

In our test nothing happened: the run succeeded and the value was not used. Check the name with hdrctl param list in the called project.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Call a project from a project

One placeholder, two values, two results

Manage the jobs and parameters of a project

#### Next lesson

Values go down with params and results come back with outputs. Next, see what starts a project.

Triggers →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Read from and write to a SQLite database in a Hydra ETL job — slug: /cli/guides/read-and-write-sqlite-databases/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sources and transformations

Guide · Sources and transformations

### Read from and write to a SQLite database in a Hydra ETL job

A sqlite source reads a table or a query from a local file, and a sqlite destination writes it back with append, replace or upsert. No server, no install.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

type: sqliteabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A source of type sqlite reads a table or a SQL query from a local database file. A destination of type sqlite writes to a table with append, replace or upsert. SQLite needs no server.

#### What will you learn in this lesson?

##### Goal

Create a small SQLite file, read a table and a query into CSV files, upsert the table into a second database, run it again after a change, and read the two errors.

##### Prerequisites

Hydra ETL 0.22 installed. See Install and start.

Python, to create the test database (py on Windows, python3 elsewhere). SQLite is part of Python.

A job folder, for example from Anatomy of a job. Paths below are relative to the job folder.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I read from and write to SQLite?

##### 01Create a test database

###### Objective

Five orders in a file.

###### Actions

Create the folder data at the root of the project.

Save the script below as make_db.py and run it.

py make_db.py

The script creates data/app.db with one table, orders.

import sqlite3
c = sqlite3.connect("data/app.db")
c.execute("CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT)")
c.executemany("INSERT INTO orders VALUES (?,?,?,?)", [
(1,"Alice",120.5,"paid"),(2,"Bob",35.0,"pending"),(3,"Carla",80.0,"paid"),
(4,"Dan",15.25,"paid"),(5,"Eve",60.0,"pending")])
c.commit(); c.close()

What you should see
The file data/app.db exists.

app.db created: 5 rows

##### 02Read a table

###### Objective

One source, one CSV destination.

###### Actions

In a job folder, write sources.yaml, destinations.yaml and pipeline.yaml as below.

Run hdrctl run on the job.

hdrctl run jobs\read-table

connection.path is relative to the job folder, so a job in jobs/read-table reaches the database with ../../data/app.db.

# sources.yaml
sources:
src_app:
type: sqlite
connection:
path: ../../data/app.db
extract:
table: orders

# destinations.yaml
destinations:
dest:
type: csv
load:
table: data/out_read-table.csv
mode: replace

# pipeline.yaml
pipeline:
from: src_app
to: dest

What you should see
Rows read : 5 and Rows written: 5.

Pipeline completed successfully in 1.9s
Rows read : 5
Rows written: 5

##### 03Read a query

###### Objective

Filter in SQL.

###### Actions

In the source, replace table: orders with the query below.

Run the job again.

hdrctl run jobs\read-query

Use query instead of table to choose the columns and the rows in SQL.

extract:
query: "SELECT order_id, customer, amount FROM orders WHERE amount >= 50"

What you should see
3 rows read, and a CSV with 3 columns.

Rows read : 3
Rows written: 3

order_id,customer,amount
1,Alice,120.5
3,Carla,80.0
5,Eve,60.0

##### 04Write to SQLite with upsert

###### Objective

Create the warehouse.

###### Actions

Keep the table source of step 2.

Replace the destination with the one below.

Run the job.

hdrctl run jobs\load-sqlite

The database data/warehouse.db and the table orders do not exist yet: the first run creates them. With mode: upsert and key, the key becomes the primary key of the new table.

destinations:
dest:
type: sqlite
connection:
path: ../../data/warehouse.db
load:
table: orders
mode: upsert
key: [order_id]

What you should see
5 rows read and written. The table definition ends with PRIMARY KEY ("order_id").

Rows read : 5
Rows written: 5

CREATE TABLE "orders" ("order_id" INTEGER, "customer" TEXT, "amount" REAL, "status" TEXT, PRIMARY KEY ("order_id"))

##### 05Change the source and run again

###### Objective

Watch the upsert.

###### Actions

Mark order 2 as paid and add order 6 in app.db.

Run the same job.

hdrctl run jobs\load-sqlite

The existing keys are updated and the new key is inserted. Our script ran UPDATE orders SET status='paid' WHERE order_id=2 and added order 6. The warehouse then held six rows, and order 2 was paid. A third run, with no change, left six rows.

What you should see
6 rows read, 6 rows in the warehouse, no duplicate.

Rows read : 6
Rows written: 6

(2, 'Bob', 35.0, 'paid')
(6, 'Fay', 200.0, 'paid')

SELECT count(*) after a third run: (6,)

##### 06Read the two errors

###### Objective

Break the source on purpose.

###### Actions

Set path to ../../data/nope.db and run the job.

Set the file back and set table to nothing, then run it.

hdrctl run jobs\missing-db

hdrctl validate passes in both cases: it does not open the database. Only the run fails, and the message names the file or the table.

What you should see
A Pipeline FAILED block with the cause.

ValueError: SQLiteConnector [src_app]: database file not found: C:\...\data\nope.db

OperationalError: no such table: nothing

###### Tips and tricks

Use query to filter early: fewer rows leave the database and reach the next step.

Give an upsert a key that is unique in the source, so that each key lands on one row.

connection.path is relative to the job folder, not to the project: data/app.db alone looks inside jobs/<job>/data.

hdrctl validate does not check that the file or the table exists. Run the job to find out.

#### What should I have at the end?

VerificationExpected result

Sourcetype: sqlite, connection.path, extract.table or extract.query

Destinationtype: sqlite, connection.path, load.table, load.mode, load.key

Modesappend, replace, upsert

Installnone: sqlite3 is part of Python

#### What if something goes wrong?

SymptomCauseFix

database file not found: ...The path is wrong or relative to the wrong folderCount from the job folder, for example ../../data/app.db

no such table: nothingThe table name does not exist in the fileList the tables with a SQLite client and fix extract.table

Two rows for one keymode append or replace, or no key on the upsertUse mode: upsert with key

#### Frequently asked questions

##### How do I read a SQLite database with Hydra ETL?

Declare a source of type sqlite with connection.path, the database file relative to the job folder, and extract.table or extract.query. SQLite is part of Python: there is no server and nothing to install. We tested it with Hydra ETL 0.22 on Windows.

##### Should I read a table or a query?

Use table to read everything, and query to filter or select columns in SQL. In our test the query SELECT order_id, customer, amount FROM orders WHERE amount >= 50 read 3 rows out of 5, with only 3 columns.

##### Can Hydra ETL write to SQLite?

Yes. A destination of type sqlite takes connection.path, load.table and load.mode: append, replace or upsert. The database and the table are created at the first run.

##### What does upsert do?

With mode upsert and key: [order_id], a row whose key exists is updated and a new key is inserted. In our test the second run updated order 2, added order 6 and the table held 6 rows. A third run kept 6 rows. The key became the primary key of the new table.

##### What error do I get when the file or the table is missing?

A missing file gives SQLiteConnector [src_app]: database file not found, followed by the full path. A missing table gives OperationalError: no such table. hdrctl validate passes in both cases: only the run fails.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Anatomy of a job

File sources

Transformations 2

#### Next lesson

A local database as a source and as a destination, with no server. Not covered here: PostgreSQL, MySQL, SQL Server and MongoDB.

Back to File sources →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Read CSV, JSON and Parquet files in a Hydra job — slug: /cli/guides/read-csv-json-and-parquet-files/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Sources and transformations

Guide · Sources and transformations

### Read CSV, JSON and Parquet files in a Hydra job

CSV, JSON and Parquet sources are declared the same way: a type and a path. Build three jobs, run them, and read the error of a missing file.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

type: csv | json | parquetabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
A file source is a type (csv, json or parquet) and a path in extract.table. The path is read from the job folder. A missing file stops the job with source file not found.

#### What will you learn in this lesson?

##### Goal

Prepare one small file in each format, declare three sources, run the jobs, and read what a missing file gives.

##### Prerequisites

Hydra ETL 0.22 installed, and a project folder such as the one built in Anatomy of a job. See Install and start.

For Parquet: pyarrow (pip install "hydra-etl[parquet]"), which pandas needs to write the file.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I read a CSV, JSON or Parquet file?

##### 01Prepare one file per format

###### Objective

The same three rows in three formats.

###### Actions

Create the folders jobs/csv-job/data, jobs/json-job/data and jobs/parquet-job/data.

Save the CSV and the JSON content below in them.

Create the Parquet file with the command below.

jobs/csv-job/data/people.csv
jobs/json-job/data/people.json
py -c "import pandas as pd; pd.DataFrame({'id':[1,2,3],'name':['Alice','Bob','Charlie'],'value':[100,200,-5]}).to_parquet('jobs/parquet-job/data/people.parquet')"

The CSV has a header and commas. The JSON file is a list of objects.

id,name,value
1,Alice,100
2,Bob,200
3,Charlie,-5

[
{"id": 1, "name": "Alice", "value": 100},
{"id": 2, "name": "Bob", "value": 200},
{"id": 3, "name": "Charlie", "value": -5}
]

What you should see
Three people files, one per job folder.

##### 02Declare the three sources

###### Objective

Only the type and the path change.

###### Actions

In each job folder, create sources.yaml, destinations.yaml and pipeline.yaml as below.

Change type, the source id and the file name for the JSON and Parquet jobs.

jobs/csv-job/sources.yaml
jobs/csv-job/destinations.yaml
jobs/csv-job/pipeline.yaml

The destination is a CSV file in every job, so the three results can be compared. The pipeline links the ids, as in Anatomy of a job. These jobs have no transformations.yaml, which is allowed.

sources:
src_csv_job:
type: csv # json, parquet
extract:
table: data/people.csv # people.json, people.parquet

destinations:
dest_csv:
type: csv
load:
table: data/out_csv-job.csv
mode: replace

pipeline:
from: src_csv_job
to: dest_csv

What you should see
Three job folders with three manifests each.

##### 03Validate and run each job

###### Objective

Same result from three formats.

###### Actions

Run the two commands below for csv-job.

Repeat for json-job and parquet-job.

hdrctl validate jobs\csv-job
hdrctl run jobs\csv-job

Each job reads three rows and writes three: nothing filters them. The output file is the same for the three formats.

id,name,value
1,Alice,100
2,Bob,200
3,Charlie,-5

What you should see
Pipeline completed successfully three times, with 3 rows read and 3 written.

Pipeline completed successfully in 1.6s
Rows read : 3
Rows written: 3

##### 04Read the error of a missing file

###### Objective

Know the message when the path is wrong.

###### Actions

Copy csv-job to missing-file and set table: data/nothing.csv.

Run the job.

hdrctl run jobs\missing-file

Hydra does not mention the folder. It names the connector and the source id. Check the path against the job folder, as the path is read from there.

What you should see
A failed run with source file not found.

Job 'missing-file' failed: ValueError: CSVConnector [src_missing_file]: source file not found.
Pipeline FAILED in 1.7s

###### Tips and tricks

Keep one small sample file next to each job. A three-row file makes every run take seconds.

Add a select step in transformations.yaml when you need to prove the columns were split: it fails with the list of the columns that Hydra found.

On Hydra ETL 0.22 we could not read a semicolon-separated CSV into columns. The file loaded as one column named id;name;value, and a select of name failed. The run itself still reported success, so check the columns.

A CSV has no types: every value is text until you cast it. Cast before you compare numbers.

#### What should I have at the end?

VerificationExpected result

Typecsv, json or parquet

Pathextract.table, read from the job folder

Parquetneeds pyarrow

Checkselect a column to prove the split

#### What if something goes wrong?

SymptomCauseFix

source file not foundThe path is wrong or the file is in another folderCheck extract.table against the job folder

select: unknown columnsThe file was not split as you expectLook at the Available columns list

Parquet cannot be readpyarrow is missingpip install "hydra-etl[parquet]"

Not a job folderThe command ran from the wrong placePass the job folder to the command

#### Frequently asked questions

##### How do I read a CSV, JSON or Parquet file in Hydra ETL?

Declare a source in sources.yaml with type csv, json or parquet, and put the file path in extract.table. Nothing else changes between the three. In our test each job read 3 rows and wrote 3.

##### Is the path relative to something?

In our test, a path such as data/people.csv was read from the job folder, so the files sat in jobs//data.

##### What shape must a JSON file have?

We tested a file that holds a list of objects, one object per row, with the same keys in each. Other shapes were not tested.

##### Does Parquet need an extra package?

According to pyproject.toml, Parquet support comes with the optional parquet extra, which installs pyarrow. Install it with pip install "hydra-etl[parquet]" if Hydra ETL complains. We created our Parquet file with pandas.

##### Can I read a CSV that uses semicolons?

Not in our test on Hydra ETL 0.22. We set delimiter under connection and next to extract, and each time the file loaded as one column named id;name;value. Until this changes, convert the file to commas, or check the release notes of your version.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

What a Hydra job is made of

Create a job, then give it a source

Reshape the data between source and destination

#### Next lesson

A file source is a type and a path. Next, reshape the rows between source and destination.

Transformations →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Run Hydra ETL in production with hdrctl serve — slug: /cli/guides/run-hydra-in-production-with-hdrctl-serve/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Production

Guide · Production

### Run Hydra ETL in production with hdrctl serve

Run hdrctl serve without Studio, schedule a workflow with a cron trigger and read the scheduled runs from the API.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl serveabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl serve --no-studio starts the API and the scheduler without the visual editor. A workflow with a trigger of type schedule then runs by itself, and GET /api/runs lists what ran.

#### What will you learn in this lesson?

##### Goal

Declare a cron trigger in a workflow, validate it, start the server without Studio, register the project, check the server and read the scheduled runs.

##### Prerequisites

Hydra ETL 0.22 installed with the server extra. See Install and start.

A project: hdrctl init nightly-demo. It holds a job and a workflow named workflow1.

curl.exe (Windows) or curl, to call the API.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do I run Hydra ETL workflows on a schedule?

##### 01Put a cron in the workflow

###### Objective

Change the trigger of workflow1.

###### Actions

Open workflows/workflow1.yaml in the project.

Replace type: manual with the two lines below.

Run the validation from the project folder.

hdrctl workflow validate workflows\workflow1.yaml

The cron has five fields. * * * * * means every minute, which suits a test; use 0 2 * * * for 02:00 every day. See Run a project on a cron schedule for the fields. The trigger part of the file:

trigger:
type: schedule
cron: "* * * * *"

What you should see
Workflow valid.

✅ Workflow valid — no errors detected.

##### 02Start the server without Studio

###### Objective

Keep the terminal open.

###### Actions

Go to the folder that holds the project.

Run the command below. The server stays in the foreground.

hdrctl serve --no-studio --port 5689 --workspace .\ws

--no-studio serves the API only. --workspace is the folder where the server keeps the projects it knows (~/hydra-workspace by default). The port is 5678 by default; we used 5689 in our test. The server listens on 127.0.0.1 unless you pass --host. Stop it with CTRL+C.

What you should see
A banner that says Studio is disabled, then the addresses.

Studio disabled — started with --no-studio

API http://127.0.0.1:5689/api
Docs http://127.0.0.1:5689/docs
Workdir C:\...\prod-probe

Press CTRL+C to stop.

INFO: Application startup complete.
INFO: Uvicorn running on http://127.0.0.1:5689 (Press CTRL+C to quit)

##### 03Register the project

###### Objective

The scheduler reads the projects the server knows.

###### Actions

Save open.json as shown below, with the full path of your project (backslashes doubled).

In a second terminal, run the command below.

curl.exe -s -X POST -H "Content-Type: application/json" -d @open.json http://127.0.0.1:5689/api/projects/open

The call registers the folder and answers with the project id. In our test, the first run started at the next full minute after this call.

{"path": "C:\\path\\to\\nightly-demo", "adopt": true}

What you should see
A JSON answer with the id, the name and the path.

{"id":"0db43970","name":"nightly-demo","description":"","path":"C:\\...\\nightly-demo","created_at":"2026-11-24T07:31:21.317913+00:00"}

##### 04Check the server

###### Objective

One call tells you it is alive.

###### Actions

Run the command below.

curl.exe -s http://127.0.0.1:5689/api/health

Use this call for any monitor that needs to know whether the server answers. The field studio says disabled because of --no-studio.

What you should see
status is ok and the version is 0.22.0.

{"message":"Hydra ETL API is running","status":"ok","version":"0.22.0","dsl_version":"1.0","studio":"disabled","studio_build":"index-DCU4tAca.js"}

##### 05Read the scheduled runs

###### Objective

Wait for the next minutes, then list the runs.

###### Actions

Wait two or three minutes.

Run the command below.

curl.exe -s http://127.0.0.1:5689/api/runs

The answer is a JSON list, newest first, with the logs of every step. Each scheduled run has "trigger":"schedule". In our test, three runs started at 07:32:00, 07:33:00 and 07:34:00 UTC, one per minute, and each lasted under a second. This excerpt keeps four fields of the first run:

What you should see
One run per elapsed minute, all in success.

[{"run_id":"32f6e600","workflow_name":"workflow1","status":"success","started_at":"2026-11-24T07:34:00.010654+00:00","trigger":"schedule", ...},
{"run_id":"331eaeef", ... "started_at":"2026-11-24T07:33:00.010929+00:00", ...},
{"run_id":"e1627f8c", ... "started_at":"2026-11-24T07:32:00.010698+00:00", ...}]

###### Tips and tricks

Switch the cron from * * * * * to the real schedule only after you have seen one run in the list.

Watch /api/health and the last run time from your monitor: a server that answers can still have an empty list of runs.

The runs are in memory. After a restart of the server the list is empty, so keep what you need from the job outputs and the logs of your own system.

Times in the run list are UTC. Our Windows clock was one hour ahead, so a run shown at 07:32 started at 08:32 local time.

The server stays in the foreground. Closing its terminal stops the schedule.

#### What should I have at the end?

VerificationExpected result

Serverhdrctl serve --no-studio --port N --workspace DIR

RegisterPOST /api/projects/open with {path, adopt: true}

Scheduletrigger: type: schedule, cron: "* * * * *"

HealthGET /api/health

RunsGET /api/runs (trigger: schedule)

#### What if something goes wrong?

SymptomCauseFix

Empty list of runsThe project was not registered, or the next minute has not come yetCall /api/projects/open, then wait for the next cron time

Connection refusedThe server is stopped, or the port differsCheck the terminal and the port in the URL

#### Frequently asked questions

##### How do I run Hydra ETL workflows on a schedule without opening Studio?

Put a trigger of type schedule with a cron expression in the workflow file, start hdrctl serve with --no-studio, and register the project once. In our test on Hydra ETL 0.22, a workflow with the cron * * * * * ran at the start of three consecutive minutes and each run ended in success.

##### What does --no-studio change?

The server starts the API only. The home page answers with a short notice that Studio is disabled, and /api/health reports studio as disabled. The scheduler and the API worked the same in our test.

##### Where do I see the scheduled runs?

At GET /api/runs. Each run has a run_id, the workflow name, a status, the start time in UTC and the field trigger, set to schedule for a scheduled run. Per the source, you can add ?workflow_name=NAME to filter; we did not test the filter.

##### Do the runs survive a restart of the server?

No, according to our earlier tests: the runs are kept in memory, so the list is empty after a restart. The output files written by the jobs stay on disk.

##### Is the server safe to expose to the internet?

We did not test any protection. The server listens on 127.0.0.1 by default. Put a proxy that you control in front of it before you change --host.

##### Does the schedule restart on its own after a reboot?

We did not test it. Plan a service or a task that starts hdrctl serve at boot, and check the runs after the first expected time.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Run a project on a cron schedule

Start a project with a webhook

Launch a job from the CLI and the API

#### Next lesson

One server, one cron, one list of runs. Not covered here: authentication, a proxy, running as a service, and restarting after a reboot.

Back to the cron schedule →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Start a Hydra project with interval, marker, file and source triggers — slug: /cli/guides/run-triggers-with-hdrctl-watch/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

>_Hydra CLICommand reference · 0.20.0 ↓ Download the shop projectComplete CLI example · ZIP

CLI reference / GuidesDownload shop project ↓Watch Hydra Academy ↗

Get started›Hydra CLI›Guides›Watch

Guide · Watch

### Start a Hydra project with interval, marker, file and source triggers

hdrctl watch runs your triggers.yaml. Declare an interval, a marker, a file and a source trigger, start watch, make each one fire, and read what it prints.

By Bechir Bejaoui (LinkedIn) · Published 23 November 2026 · Last verified 23 November 2026 · Tested with Hydra ETL 0.22.0 (Studio on Windows, engine checks with hdrctl)

hdrctl watchabout 15 minutesHydra ETL 0.22 on Windows

Quick answer
hdrctl watch keeps running and starts the project when a trigger fires: interval every so often, marker when a flag file appears, file when a file matching a pattern arrives and source_change when the data of a source changes.

#### What will you learn in this lesson?

##### Goal

Declare four triggers, start hdrctl watch, drop a flag file and a CSV, change the source, and read the log of each run.

##### Prerequisites

Hydra ETL 0.22 installed, and the project of Declare project triggers (create a new one with hdrctl init watch-demo). See Install and start.

A second terminal: hdrctl watch stays open while you test.

A project with a few workflows, such as the one built in Stages. The screenshots use that project plus a cleanup workflow that is not in the thread.

#### How do interval, file and marker triggers work?

##### 01Declare four triggers

###### Objective

One per kind of start.

###### Actions

Create the folder Data/incoming in the project.

Write triggers.yaml at the project root with the content below.

Run hdrctl trigger validate.

triggers.yaml

The path of a file trigger is a pattern for files: *.csv matches the CSV files of the folder. A source_change trigger names a job, a source id and what to compare: count, max of a column, or checksum.

version: "1.0"
triggers:
- name: every-30s
type: interval
every: 30s
overlap: skip
- name: flag-file
type: marker
path: go.flag
- name: new-files
type: file
path: Data/incoming/*.csv
events: [added]
debounce: 2s
- name: data-changed
type: source_change
source:
job: jobs/job1
id: src_csv
check: checksum

What you should see
Triggers valid — 4 trigger(s).

Triggers valid — 4 trigger(s)

##### 02Start hdrctl watch

###### Objective

Keep it open in a second terminal.

###### Actions

Open a second terminal in the project folder.

Run the command below and leave it open.

hdrctl watch

The command lists each trigger and how often it is checked. interval shows its next run. Markers and file triggers are checked every 5 seconds, and the source trigger every 60 seconds. It also reads the starting value of the source.

What you should see
Four triggers with a green dot, then Waiting for events.

Project watch-demo
● every-30s every 30s next: 2026-11-24 07:26
● flag-file marker file go.flag (removed) checked every 5s
● new-files added: Data/incoming/*.csv checked every 5s
● data-changed source src_csv of jobs/job1 changes (checksum) checked every 60s

Waiting for events. Ctrl+C to stop.
· watch-demo/data-changed reference value: f3412128ace2406b

##### 03Fire the marker

###### Objective

Create a flag file.

###### Actions

In the first terminal, run the command below.

echo go> go.flag

Within five seconds the trigger starts the project. When the run ends, go.flag has been removed: the trigger consumed it.

What you should see
A ▶ line, then a ✓ line with the duration.

▶ watch-demo/flag-file files: go.flag env: none
✓ watch-demo/flag-file 2.4s

##### 04Fire the file trigger

###### Objective

Drop a CSV in the folder.

###### Actions

Copy any CSV, for example the input of the job, into Data/incoming.

copy jobs\job1\data\input.csv Data\incoming\batch1.csv

The trigger names the file that made it fire. According to the source, files already in the folder when watch starts do not fire it. We did not test this.

What you should see
A ▶ line naming Data/incoming/batch1.csv.

▶ watch-demo/new-files files: Data/incoming/batch1.csv env: none
✓ watch-demo/new-files 2.8s

##### 05Change the source

###### Objective

Add a row to the input CSV.

###### Actions

Run the command below.

echo 4,Dana,50>> jobs\job1\data\input.csv

Within a minute, watch compares the checksum of the source with its starting value, prints both and starts the project. In our test the interval trigger was running at the same moment: the source trigger was reported as skipped, with no reason on the line.

What you should see
A ▶ line with the old and the new value.

▶ watch-demo/data-changed source src_csv: f3412128ace2406b → 7134ac50dd7e63e1 env: none
⏭ watch-demo/data-changed

##### 06Read the interval and the history

###### Objective

See every run in one place.

###### Actions

Wait for a run of every-30s.

Stop watch with Ctrl+C.

Run hdrctl trigger history.

hdrctl trigger history

The interval trigger runs every 30 seconds, with overlap: skip so that a run is not started while the previous one is still going. The history lists the five runs of our test. We stopped the process from a script, so we did not read the message that Ctrl+C prints.

What you should see
Five lines, four with ✓ and one with ⏭.

✓ 2026-11-24T06:26:28+00:00 flag-file watch 2.39s
✓ 2026-11-24T06:26:43+00:00 every-30s watch 2.45s
✓ 2026-11-24T06:26:49+00:00 new-files watch 2.76s
⏭ 2026-11-24T06:27:12+00:00 data-changed watch 0.0s
✓ 2026-11-24T06:27:14+00:00 every-30s watch 2.86s

###### Tips and tricks

Test with hdrctl trigger fire NAME first, then let hdrctl watch do the waiting.

Use overlap: skip on an interval shorter than the run, so runs do not pile up.

A file trigger needs a file pattern: Data/incoming alone matched nothing in our test, and no error was printed. Write Data/incoming/*.csv.

Closing the terminal stops hdrctl watch, and triggers stop with it. Run it where it can stay open.

#### What should I have at the end?

VerificationExpected result

Runhdrctl watch

Types testedinterval, marker, file, source_change

Patternfile path = glob, such as Data/incoming/*.csv

Historyhdrctl trigger history

#### What if something goes wrong?

SymptomCauseFix

File trigger never firesThe path names a folder, not filesAdd a pattern such as /*.csv

Marker fires only onceThe flag is removed after the runCreate the file again

source_change skippedAnother run of the project was in progressWait and change the source again

Nothing at allwatch is not running, or runs in another folderStart it in the project folder

#### Frequently asked questions

##### What runs the triggers of a Hydra project?

hdrctl watch runs the triggers of one or more projects until you stop it with Ctrl+C. According to its help, hdrctl serve runs them too. We tested hdrctl watch only.

##### What is the difference between a marker and a file trigger?

A marker trigger watches one file and, by default, removes it after the run: go.flag was gone when the run ended in our test. A file trigger watches a pattern such as Data/incoming/*.csv and starts a run for each new file.

##### Why did my file trigger never fire?

The path is a pattern for files. In our first test we wrote path: Data/incoming, which names a folder, and nothing happened. With Data/incoming/*.csv the run started a few seconds after the file appeared.

##### Do the files that already exist start a run?

According to the source, files present when watch starts are the starting state and start nothing. We did not test this.

##### How does a source_change trigger work?

It reads the source of a job at an interval and compares a value: count, max of a column or checksum. watch printed a reference value at the start, then the old and new value when we added a row to the CSV. The check ran every 60 seconds in our test.

#### Related lessons

Run workflows in sequence or in parallel

Repeat workflows with loops

Project settings and Global settings

Declare project triggers

Launch a job from the CLI and the API

Orchestrate from thread.yaml

#### Next lesson

Four triggers, one command that waits for them. Not covered here: after_project, cron, webhook.

Back to Triggers →Back to all guides

Try Hydra ETL
Install it in a minute, or explore a job in your browser first.
Get startedOpen the PlaygroundCommercial license

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
