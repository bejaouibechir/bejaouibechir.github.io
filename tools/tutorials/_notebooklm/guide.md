# Hydra ETL — guide section

Chaque section est une page du site. L'en-tete porte le titre exact et
l'URL : cite-les tels quels comme source.


## Publishing a regenerable CSV export — slug: /guide/destinations/csv/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›csv

Workshop 8 · 20 minutes

### Publishing a regenerable CSV export

A practical workshop for a finance extract must open everywhere. Build the smallest manifest, validate it, run it and read the result.

#### Context — a finance extract must open everywhere

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into csv with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra csv destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the csv destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: csv
connection:
base_path: "out"
load:
table: paid_orders.csv
mode: replace

Check — target identifier ready

Trap — `replace` makes reruns idempotent; choose `append` only for a deliberately growing history.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test csv-destination

ok sources.yaml — csv
ok destinations.yaml — csv
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run csv-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

order_id,amount
O-101,120.5
O-104,83.0

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`replace` makes reruns idempotent; choose `append` only for a deliberately growing history.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a finance extract must open everywhere requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Publishing records as JSON — slug: /guide/destinations/json/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›json

Workshop 9 · 20 minutes

### Publishing records as JSON

A practical workshop for an application consumes structured records. Build the smallest manifest, validate it, run it and read the result.

#### Context — an application consumes structured records

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into json with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra json destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the json destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: json
connection:
base_path: "out"
load:
table: customers.json
mode: replace

Check — target identifier ready

Trap — JSON keeps booleans and numbers as values instead of formatting every cell as text.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test json-destination

ok sources.yaml — csv
ok destinations.yaml — json
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run json-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

[{"customer_id":"C-1","active":true},{"customer_id":"C-2","active":false}]

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

JSON keeps booleans and numbers as values instead of formatting every cell as text.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — an application consumes structured records requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Loading product documents into MongoDB — slug: /guide/destinations/mongodb/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›mongodb

Workshop 13 · 20 minutes

### Loading product documents into MongoDB

A practical workshop for a catalogue service consumes product documents. Build the smallest manifest, validate it, run it and read the result.

#### Context — a catalogue service consumes product documents

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into mongodb with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra mongodb destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the mongodb destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: mongodb
connection:
uri: ${ENV:MONGODB_URI}
database: catalogue
load:
collection: products
mode: upsert
key: [sku]

Check — target identifier ready

Trap — For repeatable loads, make the upsert key unique in the collection.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test mongodb-destination

ok sources.yaml — csv
ok destinations.yaml — mongodb
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run mongodb-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

{"sku":"SKU-10","name":"Desk lamp","price":39.9}
{"sku":"SKU-11","name":"Chair","price":129.0}

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

For repeatable loads, make the upsert key unique in the collection.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a catalogue service consumes product documents requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Loading inventory into MySQL — slug: /guide/destinations/mysql/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›mysql

Workshop 12 · 20 minutes

### Loading inventory into MySQL

A practical workshop for the operational inventory table needs current quantities. Build the smallest manifest, validate it, run it and read the result.

#### Context — the operational inventory table needs current quantities

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into mysql with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra mysql destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the mysql destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: mysql
connection:
host: ${ENV:MYSQL_HOST}
port: ${ENV:MYSQL_PORT}
user: ${ENV:MYSQL_USER}
password: ${ENV:MYSQL_PASSWORD}
database: operations
load:
table: inventory
mode: upsert
key: [sku]

Check — target identifier ready

Trap — Use a dedicated writer account and grant only the target table permissions it needs.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test mysql-destination

ok sources.yaml — csv
ok destinations.yaml — mysql
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run mysql-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

Inserted: 12
Updated : 418
Rows in inventory: 430

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Use a dedicated writer account and grant only the target table permissions it needs.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — the operational inventory table needs current quantities requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Writing a compact Parquet snapshot — slug: /guide/destinations/parquet/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›parquet

Workshop 10 · 20 minutes

### Writing a compact Parquet snapshot

A practical workshop for analytics needs a typed columnar snapshot. Build the smallest manifest, validate it, run it and read the result.

#### Context — analytics needs a typed columnar snapshot

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into parquet with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra parquet destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the parquet destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: parquet
connection:
base_path: "out"
load:
table: orders.parquet
mode: replace

Check — target identifier ready

Trap — Parquet append requires compatible schemas. Use `replace` for a full daily snapshot.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test parquet-destination

ok sources.yaml — csv
ok destinations.yaml — parquet
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run parquet-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

orders.parquet
rows: 25,000
amount: double · ordered_at: timestamp

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Parquet append requires compatible schemas. Use `replace` for a full daily snapshot.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — analytics needs a typed columnar snapshot requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Upserting customers into PostgreSQL — slug: /guide/destinations/postgresql/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›postgresql

Workshop 11 · 20 minutes

### Upserting customers into PostgreSQL

A practical workshop for a warehouse table must reflect the latest customer state. Build the smallest manifest, validate it, run it and read the result.

#### Context — a warehouse table must reflect the latest customer state

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into postgresql with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra postgresql destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the postgresql destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: postgresql
connection:
host: ${ENV:PG_HOST}
port: ${ENV:PG_PORT}
user: ${ENV:PG_USER}
password: ${ENV:PG_PASSWORD}
database: warehouse
load:
table: dim_customer
mode: upsert
key: [customer_id]

Check — target identifier ready

Trap — `upsert` requires a key present in every batch and a matching unique constraint is recommended on the target.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test postgresql-destination

ok sources.yaml — csv
ok destinations.yaml — postgresql
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run postgresql-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

Inserted: 18
Updated : 73
Unchanged keys preserved: yes

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`upsert` requires a key present in every batch and a matching unique constraint is recommended on the target.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a warehouse table must reflect the latest customer state requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Delivering records to a Web API — slug: /guide/destinations/web_api/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Destinations›web_api

Workshop 14 · 20 minutes

### Delivering records to a Web API

A practical workshop for a partner accepts completed orders through an API. Build the smallest manifest, validate it, run it and read the result.

#### Context — a partner accepts completed orders through an API

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you load records into web_api with explicit, testable rerun semantics?

Keep credentials outside YAML

Choose append, replace or upsert deliberately

Validate before touching the target

Verify the target after a second run

##### The solution in one line

A Hydra web_api destination wired to a deterministic three-row fixture.

data/input.csv6 steps

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

‹ Back Next ›

1

What you do
Start from three known records.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. prepare a deterministic input

Start from three known records.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,name,amount
1,Amina,120.5
2,Lucas,83.0
3,Sofia,49.9

Check — three input records

##### 2. declare the input

Read the fixture as CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input is local and deterministic

##### 3. declare the web_api destination

Describe the target and write mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
target:
type: web_api
connection:
base_url: "https://api.partner.example"
timeout_read: 30
load:
table: /v1/completed-orders
mode: append
batch_size: 100

Check — target identifier ready

Trap — The Web API destination is beta: confirm that its writer plugin is installed before relying on this load.

##### 4. wire the load

Connect input to target.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: input
to: target

Check — the three rows will reach the target

##### 5. validate the manifest

Catch shape and identifier mistakes.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test web_api-destination

ok sources.yaml — csv
ok destinations.yaml — web_api
ok pipeline.yaml — input → target

✅ All tests pass — ready to execute.

Check — load configuration valid

##### 6. run and inspect the target

Execute once, then verify rows and mode.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run web_api-destination

✅ Pipeline completed successfully
Rows read : 3
Rows written: 3

POST requests : 3
Accepted rows : 243
Rejected rows : 0

Check — three rows written

Trap — rerun behaviour matches the declared mode

#### Expected result

Three rows reach the target.

The chosen mode defines the second run.

Credentials remain outside the manifest.

#### Reading the results

Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

The Web API destination is beta: confirm that its writer plugin is installed before relying on this load.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a partner accepts completed orders through an API requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Retrying a transiently failing step — slug: /guide/policies/retry/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Policies›retry

Workshop 41 · 20 minutes

### Retrying a transiently failing step

A practical workshop for a partner endpoint sometimes returns a temporary error. Build the smallest manifest, validate it, run it and read the result.

#### Context — a partner endpoint sometimes returns a temporary error

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make retry explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare retry

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: retry_workshop
description: "Retrying a transiently failing step"
trigger:
type: manual
steps:
- name: fetch_partner
type: job
job: ./jobs/partner
retry:
max: 2
delay: 5
backoff: exponential

Check — workflow contract declared

Trap — `max` counts retries after the first attempt. Success stops the policy immediately.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: retry_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

attempt 1 failed
wait 5 s
attempt 2 succeeded
workflow succeeded

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

attempt 1 failed
wait 5 s
attempt 2 succeeded
workflow succeeded

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

attempt 1 failed

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. `max` counts retries after the first attempt. Success stops the policy immediately.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`max` counts retries after the first attempt. Success stops the policy immediately.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a partner endpoint sometimes returns a temporary error requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Ingesting the daily sales export — slug: /guide/sources/csv/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›csv

Workshop 1 · 20 minutes

### Ingesting the daily sales export

A shop receives one CSV a day and opens it by hand. Nine steps to automate the reading, the typing and the filtering — then read what the run tells you.

#### Context — a shop that closes its day in Excel

A retailer exports its orders every evening from the point-of-sale software. The file lands in a
folder, someone opens it in a spreadsheet, converts the amounts, keeps the large orders and mails
the result to the sales manager. Fifteen minutes a day, every day, done by hand.

##### Where things stand

One file a day — sales_2025-03-04.csv, seven orders, six columns.

Everything is text. A CSV has no types: 120.50 is a string until someone converts it.

No trace. Nobody can say afterwards which file produced which figure.

Manual filtering. The rule — keep orders of 100 and above — lives in a person's head.

##### The question

How do you read that file automatically, type its columns, apply the rule and write the result —
without opening a spreadsheet, and in a way that runs the same tomorrow?

Read the file where it sits, without copying or moving it

Turn the amounts into numbers before comparing them

Keep only the orders of 100 and above

Write a file that can be regenerated without piling up

##### The solution in one line

A Hydra job: four small YAML files in one folder, one command to check them, one command to run.

data/sales_2025-03-04.csv9 steps

‹ Back Next ›

1

What you do
Create the folder and drop the export inside it.

Step 1 · nothing to run yet ↺ Start over

#### Steps

##### 1. Create the folder and drop the export

Create a folder sales/ wherever you work.

Inside it, create data/ and out/.

Put the export in sales/data/sales_2025-03-04.csv.

mkdir -p sales/data sales/out

Check — the file is at sales/data/sales_2025-03-04.csv and has a header line.

Tip — Hydra never moves or copies your file. It reads it where it sits, so the layout is yours to choose.

##### 2. Declare the source

Create sales/sources.yaml.

Name the entry src_sales — you choose this name.

Set type: csv, then base_path to the folder and extract.table to the file.

version: "1.0"
sources:
src_sales:
type: csv
connection:
base_path: "sales/data"
extract:
table: sales_2025-03-04.csv
batch_size: 10000

Trap — base_path is resolved from the folder you run the command in, not from the job folder. Run everything from the folder that contains sales/, or write an absolute path.

##### 3. Declare the destination

Create sales/destinations.yaml.

Name the entry dest_large_orders.

Set mode: replace.

version: "1.0"
destinations:
dest_large_orders:
type: csv
connection:
base_path: "sales/out"
load:
table: large_orders.csv
mode: replace

Tip — the default is append. With replace the output stays at three rows however many times you run; with append it would grow every evening.

##### 4. Wire the two ends

Create sales/pipeline.yaml.

Write the two identifiers declared above — not paths.

version: "1.0"
pipeline:
from: src_sales
to: dest_large_orders

Check — three files now, and the job is already runnable. It would copy the seven rows unchanged.

##### 5. Type the amounts

Create sales/transformations.yaml.

Write steps at the root, then one cast entry.

version: "1.0"
steps:
- cast:
mapping:
amount: float

Trap — hdrctl test only counts the steps of this short shape. Written under a transformations key it reports 0 step(s) valid and says nothing about it.

##### 6. Apply the business rule

Add a second entry after the cast: keep the orders of 100 and above.

- filter:
expr: "amount >= 100"

Trap — the order of the two steps is the whole point. A CSV holds text, so the comparison only makes sense after the cast has produced numbers.

##### 7. Check the manifest

Run hdrctl test from the folder containing sales/.

hdrctl test sales

Sources
ok sources.yaml — DSL valid
ok src_sales — csv (local file)

Destinations
ok destinations.yaml — DSL valid
ok dest_large_orders — mode replace

Transformations
ok transformations.yaml — 2 step(s) valid
Operations: cast, filter

✅ All tests pass — ready to execute.

Check — 2 step(s) valid and the two operations named. No data has been read at this point.

##### 8. Run the job

Run hdrctl run on the same folder.

hdrctl run sales

✅ Pipeline completed successfully
Rows read : 7
Rows written: 3

##### 9. Read the result

Open sales/out/large_orders.csv.

order_id,customer,city,amount,status,order_date
A-1001,Alice Martin,Paris,120.5,paid,2025-03-04
A-1003,Chloe Ruiz,Madrid,310.75,paid,2025-03-04
A-1006,Farid Ziani,Nantes,260.0,paid,2025-03-04

#### Expected result

Seven rows read, three written. The four orders below 100 were dropped by the filter.

The amounts are numbers. 120.50 is written 120.5 and 260.00 becomes 260.0 — the trailing zero is a text artefact, not a value.

The file can be regenerated. Run it twice: still three rows.

#### Reading the results

##### Why seven and three?

The two counters bracket the job. Rows read is what the source produced, Rows written
what reached the destination. The gap is the work of the steps — here a filter that kept 3 of 7,
or 43 % of the orders, which is the share of the day above 100.

##### What would happen without the cast?

The filter would compare text to a number and the run would stop at step 1 of 2, before writing
anything. Nothing would be lost — the destination is only touched once every step has passed.

##### What the manifest does not know

Nothing here says today's file. The name is written in extract.table, so the
job reads that one file. Making the date a parameter is the subject of the next workshop.

#### Did we answer the question?

objectiveresultwhere

Read without copyingyesbase_path points at the folder in place

Type the amountsyescast, first step

Keep orders ≥ 100yesfilter, second step

Regenerable outputyesmode: replace

Read today's file automaticallynot yetthe date is written in the manifest

#### Before and after

Before — open the file, convert a column, sort, filter by hand, copy the result out. Around
fifteen minutes, every evening, and the rule exists only in the head of whoever does it.

After — one command. The rule is written in transformations.yaml, readable by
anyone, versioned with the rest, and it produces the same result every time.

What is really gained is not the fifteen minutes. It is that the rule left the spreadsheet
and became text a colleague can read, review and correct.

##### Close by

The connection block — all nine types

transformations.yaml — the ordered list

Tutorial — the same four files, explained line by line

Playground — a full job on real data

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Turning application events into rows — slug: /guide/sources/json/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›json

Workshop 2 · 18 minutes

### Turning application events into rows

The support team receives a JSON export containing one object per event. They need a flat, reproducible CSV for incident analysis.

#### Context — an application exports nested events as JSON

The support team receives a JSON export containing one object per event. They need a flat, reproducible CSV for incident analysis.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you read JSON records in batches without writing a one-off conversion script?

Keep the original JSON untouched

Read large files in bounded batches

Make nested-field handling explicit

Produce a regenerable CSV

##### The solution in one line

A Hydra json source, a local inspection destination and one pipeline command.

data/events.json6 steps

[
{"id": 101, "kind": "login", "user": {"id": "U-7"}},
{"id": 102, "kind": "purchase", "user": {"id": "U-9"}}
]

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

[
{"id": 101, "kind": "login", "user": {"id": "U-7"}},
{"id": 102, "kind": "purchase", "user": {"id": "U-9"}}
]

Check — input shape identified

##### 2. declare the json source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
events:
type: json
connection:
base_path: "data"
extract:
table: events.json
batch_size: 1000
flatten_depth: 1

Check — events is the pipeline-facing identifier

Trap — `flatten_depth: 1` flattens one object level; arrays remain values and may need a later transform.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: events
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test json-source

ok sources.yaml — json
ok destinations.yaml — csv, replace
ok pipeline.yaml — events → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run json-source

✅ Pipeline completed successfully
id,kind,user.id
101,login,U-7
102,purchase,U-9

Check — 2 rows read · 2 written

#### Expected result

2 rows read · 2 written

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`flatten_depth: 1` flattens one object level; arrays remain values and may need a later transform.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — an application exports nested events as JSON requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Flattening customer documents from MongoDB — slug: /guide/sources/mongodb/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›mongodb

Workshop 6 · 26 minutes

### Flattening customer documents from MongoDB

Operations needs a tabular customer list, but addresses are nested and documents can drift over time.

#### Context — customer profiles are nested MongoDB documents

Operations needs a tabular customer list, but addresses are nested and documents can drift over time.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you read a MongoDB collection and make the expected fields explicit?

Keep the URI outside source control

Select one collection

Flatten named nested fields

Warn when documents drift

##### The solution in one line

A Hydra mongodb source, a local inspection destination and one pipeline command.

sample document6 steps

{
"customer_id": "C-14",
"name": "Amina Diallo",
"address": {"city": "Lille"},
"active": true
}

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

{
"customer_id": "C-14",
"name": "Amina Diallo",
"address": {"city": "Lille"},
"active": true
}

Check — input shape identified

##### 2. declare the mongodb source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
customers:
type: mongodb
connection:
uri: ${ENV:MONGODB_URI}
database: crm
extract:
collection: customers
filter:
active: true
batch_size: 1000
schema:
mode: manual
fields:
- {name: customer_id, path: customer_id, type: string, required: true}
- {name: city, path: address.city, type: string}
drift_policy: warn

Check — customers is the pipeline-facing identifier

Trap — A manual schema is a contract: unknown fields follow `drift_policy`, while required missing fields are validation events.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: customers
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test mongodb-source

ok sources.yaml — mongodb
ok destinations.yaml — csv, replace
ok pipeline.yaml — customers → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run mongodb-source

✅ Pipeline completed successfully
customer_id,city
C-14,Lille
C-18,Paris

Check — 2 active profiles flattened

#### Expected result

2 active profiles flattened

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

A manual schema is a contract: unknown fields follow `drift_policy`, while required missing fields are validation events.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — customer profiles are nested MongoDB documents requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Exporting the customer table from MySQL — slug: /guide/sources/mysql/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›mysql

Workshop 5 · 22 minutes

### Exporting the customer table from MySQL

The CRM team needs a daily customer snapshot. The table is too large to load into memory in one pass.

#### Context — a customer directory is stored in MySQL

The CRM team needs a daily customer snapshot. The table is too large to load into memory in one pass.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you stream a MySQL table through Hydra with no password in the manifest?

Use environment-backed credentials

Read a bounded batch at a time

Select a stable table

Produce a replaceable snapshot

##### The solution in one line

A Hydra mysql source, a local inspection destination and one pipeline command.

.env.example6 steps

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=hydra_reader
MYSQL_PASSWORD=replace-me
MYSQL_DATABASE=crm

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=hydra_reader
MYSQL_PASSWORD=replace-me
MYSQL_DATABASE=crm

Check — input shape identified

##### 2. declare the mysql source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
customers:
type: mysql
connection:
host: ${ENV:MYSQL_HOST}
port: ${ENV:MYSQL_PORT}
user: ${ENV:MYSQL_USER}
password: ${ENV:MYSQL_PASSWORD}
database: ${ENV:MYSQL_DATABASE}
extract:
table: customers
batch_size: 5000

Check — customers is the pipeline-facing identifier

Trap — `batch_size` controls memory pressure; it does not add a SQL `LIMIT` to the full extraction.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: customers
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test mysql-source

ok sources.yaml — mysql
ok destinations.yaml — csv, replace
ok pipeline.yaml — customers → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run mysql-source

✅ Pipeline completed successfully
Rows read : 15320
Rows written: 15320
Batches : 4

Check — 15,320 customers · four batches

#### Expected result

15,320 customers · four batches

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`batch_size` controls memory pressure; it does not add a SQL `LIMIT` to the full extraction.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a customer directory is stored in MySQL requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Reading an analytics extract efficiently — slug: /guide/sources/parquet/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›parquet

Workshop 3 · 16 minutes

### Reading an analytics extract efficiently

A reporting job produces a compact Parquet file every night. The downstream team needs selected rows without losing the column types.

#### Context — analytics delivers a typed Parquet snapshot

A reporting job produces a compact Parquet file every night. The downstream team needs selected rows without losing the column types.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you ingest a Parquet snapshot while preserving its typed, columnar data?

Preserve numeric and date types

Avoid converting the source to CSV first

Read by batches

Keep the output reproducible

##### The solution in one line

A Hydra parquet source, a local inspection destination and one pipeline command.

data/orders.parquet6 steps

Parquet schema
order_id: string
amount: double
ordered_at: timestamp

row groups: 2 · rows: 12,480

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

Parquet schema
order_id: string
amount: double
ordered_at: timestamp

row groups: 2 · rows: 12,480

Check — input shape identified

##### 2. declare the parquet source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
orders:
type: parquet
connection:
base_path: "data"
extract:
table: orders.parquet
batch_size: 5000

Check — orders is the pipeline-facing identifier

Trap — Parquet already carries a schema. Add a `cast` only when the business type must differ from the stored type.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: orders
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test parquet-source

ok sources.yaml — parquet
ok destinations.yaml — csv, replace
ok pipeline.yaml — orders → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run parquet-source

✅ Pipeline completed successfully
Rows read : 12480
Rows written: 12480
Types kept : string, float, datetime

Check — 12,480 rows read · types preserved

#### Expected result

12,480 rows read · types preserved

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Parquet already carries a schema. Add a `cast` only when the business type must differ from the stored type.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — analytics delivers a typed Parquet snapshot requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Extracting paid orders from PostgreSQL — slug: /guide/sources/postgresql/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›postgresql

Workshop 4 · 24 minutes

### Extracting paid orders from PostgreSQL

Finance needs a daily extract of paid orders. Credentials must stay outside YAML and the database should do the filtering.

#### Context — orders live in a production PostgreSQL database

Finance needs a daily extract of paid orders. Credentials must stay outside YAML and the database should do the filtering.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you connect safely and extract only the useful rows from PostgreSQL?

Keep credentials in environment variables

Push the predicate to PostgreSQL

Stream rows in batches

Write a traceable snapshot

##### The solution in one line

A Hydra postgresql source, a local inspection destination and one pipeline command.

.env.example6 steps

PG_HOST=localhost
PG_PORT=5432
PG_USER=hydra_reader
PG_PASSWORD=replace-me
PG_DATABASE=shop

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

PG_HOST=localhost
PG_PORT=5432
PG_USER=hydra_reader
PG_PASSWORD=replace-me
PG_DATABASE=shop

Check — input shape identified

##### 2. declare the postgresql source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
paid_orders:
type: postgresql
connection:
host: ${ENV:PG_HOST}
port: ${ENV:PG_PORT}
user: ${ENV:PG_USER}
password: ${ENV:PG_PASSWORD}
database: ${ENV:PG_DATABASE}
extract:
query: "SELECT order_id, amount, paid_at FROM orders WHERE status = 'paid'"
batch_size: 5000

Check — paid_orders is the pipeline-facing identifier

Trap — Use a read-only database account. Hydra resolves `${ENV:…}` before opening the connection.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: paid_orders
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test postgresql-source

ok sources.yaml — postgresql
ok destinations.yaml — csv, replace
ok pipeline.yaml — paid_orders → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run postgresql-source

✅ Pipeline completed successfully
Rows read : 842
Rows written: 842
Query : executed by PostgreSQL

Check — 842 paid orders exported

#### Expected result

842 paid orders exported

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Use a read-only database account. Hydra resolves `${ENV:…}` before opening the connection.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — orders live in a production PostgreSQL database requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Collecting every page of a REST API — slug: /guide/sources/web_api/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Sources›web_api

Workshop 7 · 28 minutes

### Collecting every page of a REST API

A partner API returns one hundred orders at a time and protects the endpoint with a bearer token.

#### Context — a partner exposes paginated orders over HTTPS

A partner API returns one hundred orders at a time and protects the endpoint with a bearer token.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you authenticate, paginate and turn API responses into Hydra batches?

Never write the token in YAML

Follow pagination until completion

Bound request and batch sizes

Extract only the records array

##### The solution in one line

A Hydra web_api source, a local inspection destination and one pipeline command.

HTTP response6 steps

GET /v1/orders?offset=0&limit=100

{
"items": [{"id": "O-1", "amount": 72.5}],
"next_offset": 100
}

‹ Back Next ›

1

What you do
Identify the records and the contract you need.

Step 1 · input understood ↺ Start over

#### Steps

##### 1. inspect the input

Identify the records and the contract you need.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

GET /v1/orders?offset=0&limit=100

{
"items": [{"id": "O-1", "amount": 72.5}],
"next_offset": 100
}

Check — input shape identified

##### 2. declare the web_api source

Describe the connection and extraction.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
partner_orders:
type: web_api
connection:
base_url: "https://api.partner.example"
timeout_read: 30
auth:
type: bearer
token: ${ENV:PARTNER_API_TOKEN}
pagination:
strategy: offset
page_size: 100
extract:
table: /v1/orders
batch_size: 100

Check — partner_orders is the pipeline-facing identifier

Trap — Pagination belongs to the connector. A transform never needs to know which HTTP page produced a row.

##### 3. declare a reviewable output

Write the extracted rows to a local CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

Check — replace keeps the inspection file stable

##### 4. wire source to destination

Connect the two identifiers.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
pipeline:
from: partner_orders
to: result

Check — the job now has one input and one output

##### 5. validate without reading data

Check the four manifest files.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test web_api-source

ok sources.yaml — web_api
ok destinations.yaml — csv, replace
ok pipeline.yaml — partner_orders → result

✅ All tests pass — ready to execute.

Check — manifest valid; source not consumed yet

##### 6. run and read the counters

Execute the extraction once.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run web_api-source

✅ Pipeline completed successfully
Requests : 4
Rows read : 327
Rows written : 327
Last page : 27 records

Check — 327 orders · four requests

#### Expected result

327 orders · four requests

The source remains unchanged.

The connection and extraction contract are versioned.

#### Reading the results

The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Pagination belongs to the connector. A transform never needs to know which HTTP page produced a row.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a partner exposes paginated orders over HTTPS requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Summarising revenue by city — slug: /guide/transforms/aggregate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›aggregate

Workshop 22 · 18 minutes

### Summarising revenue by city

A practical workshop for management needs totals, not order lines. Build the smallest manifest, validate it, run it and read the result.

#### Context — management needs totals, not order lines

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s aggregate operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One aggregate step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

order_id,city,amount
1,Paris,80
2,Lyon,50
3,Paris,40

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

order_id,city,amount
1,Paris,80
2,Lyon,50
3,Paris,40

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the aggregate step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- aggregate:
by: [city]
agg:
revenue: {func: sum, col: amount}
orders: {func: count, col: order_id}

Check — one aggregate operation declared

Trap — Every output metric names both its function and its source column.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test aggregate-workshop

ok transformations.yaml — 1 step(s) valid
Operations: aggregate

✅ All tests pass — ready to execute.

Check — one step counted: aggregate

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run aggregate-workshop

✅ Pipeline completed successfully

city,revenue,orders
Lyon,50,1
Paris,120,2

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Every output metric names both its function and its source column.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Every output metric names both its function and its source column.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — management needs totals, not order lines requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Computing line totals — slug: /guide/transforms/calculate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›calculate

Workshop 19 · 18 minutes

### Computing line totals

A practical workshop for order lines contain price and quantity but no total. Build the smallest manifest, validate it, run it and read the result.

#### Context — order lines contain price and quantity but no total

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s calculate operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One calculate step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

sku,unit_price,quantity
A-1,12.5,3

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

sku,unit_price,quantity
A-1,12.5,3

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the calculate step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- calculate:
column: line_total
expr: "unit_price * quantity"

Check — one calculate operation declared

Trap — The expression sees the current row columns and adds one named output column.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test calculate-workshop

ok transformations.yaml — 1 step(s) valid
Operations: calculate

✅ All tests pass — ready to execute.

Check — one step counted: calculate

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run calculate-workshop

✅ Pipeline completed successfully

sku,unit_price,quantity,line_total
A-1,12.5,3,37.5

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. The expression sees the current row columns and adds one named output column.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

The expression sees the current row columns and adds one named output column.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — order lines contain price and quantity but no total requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Giving text values real types — slug: /guide/transforms/cast/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›cast

Workshop 18 · 18 minutes

### Giving text values real types

A practical workshop for a CSV contains numbers and dates as text. Build the smallest manifest, validate it, run it and read the result.

#### Context — a CSV contains numbers and dates as text

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s cast operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One cast step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

quantity,amount,ordered_at
"2","19.95","2026-08-01T09:30:00"

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

quantity,amount,ordered_at
"2","19.95","2026-08-01T09:30:00"

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the cast step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- cast:
mapping:
quantity: int
amount: float
ordered_at: datetime

Check — one cast operation declared

Trap — Cast before comparing, sorting or calculating with a text column.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test cast-workshop

ok transformations.yaml — 1 step(s) valid
Operations: cast

✅ All tests pass — ready to execute.

Check — one step counted: cast

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run cast-workshop

✅ Pipeline completed successfully

quantity:int,amount:float,ordered_at:datetime
2,19.95,2026-08-01 09:30:00

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Cast before comparing, sorting or calculating with a text column.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Cast before comparing, sorting or calculating with a text column.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a CSV contains numbers and dates as text requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Normalising messy customer names — slug: /guide/transforms/clean/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›clean

Workshop 24 · 18 minutes

### Normalising messy customer names

A practical workshop for names contain mixed case and repeated spaces. Build the smallest manifest, validate it, run it and read the result.

#### Context — names contain mixed case and repeated spaces

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s clean operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One clean step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

name,city
" AMINA DIALLO "," PARIS "

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

name,city
" AMINA DIALLO "," PARIS "

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the clean step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- clean:
columns: [name, city]
case: lower

Check — one clean operation declared

Trap — `clean` trims, collapses repeated whitespace and optionally normalises case.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test clean-workshop

ok transformations.yaml — 1 step(s) valid
Operations: clean

✅ All tests pass — ready to execute.

Check — one step counted: clean

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run clean-workshop

✅ Pipeline completed successfully

name,city
"amina diallo","paris"

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. `clean` trims, collapses repeated whitespace and optionally normalises case.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`clean` trims, collapses repeated whitespace and optionally normalises case.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — names contain mixed case and repeated spaces requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Keeping one event per identifier — slug: /guide/transforms/deduplicate/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›deduplicate

Workshop 21 · 18 minutes

### Keeping one event per identifier

A practical workshop for an export repeats events after retries. Build the smallest manifest, validate it, run it and read the result.

#### Context — an export repeats events after retries

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s deduplicate operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One deduplicate step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

event_id,status
E-1,pending
E-1,complete
E-2,complete

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

event_id,status
E-1,pending
E-1,complete
E-2,complete

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the deduplicate step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- deduplicate:
columns: [event_id]
keep: last

Check — one deduplicate operation declared

Trap — Sort first when “last” depends on time; otherwise last means current row order.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test deduplicate-workshop

ok transformations.yaml — 1 step(s) valid
Operations: deduplicate

✅ All tests pass — ready to execute.

Check — one step counted: deduplicate

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run deduplicate-workshop

✅ Pipeline completed successfully

event_id,status
E-1,complete
E-2,complete

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Sort first when “last” depends on time; otherwise last means current row order.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Sort first when “last” depends on time; otherwise last means current row order.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — an export repeats events after retries requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Providing defaults for missing values — slug: /guide/transforms/fill_null/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›fill_null

Workshop 25 · 18 minutes

### Providing defaults for missing values

A practical workshop for a report cannot display blank regions. Build the smallest manifest, validate it, run it and read the result.

#### Context — a report cannot display blank regions

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s fill_null operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One fill_null step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

sku,region,quantity
A-1,,3
A-2,West,

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

sku,region,quantity
A-1,,3
A-2,West,

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the fill_null step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- fill_null:
columns:
region: Unknown
quantity: 0

Check — one fill_null operation declared

Trap — Column-specific defaults preserve meaning better than one global replacement.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test fill_null-workshop

ok transformations.yaml — 1 step(s) valid
Operations: fill_null

✅ All tests pass — ready to execute.

Check — one step counted: fill_null

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run fill_null-workshop

✅ Pipeline completed successfully

sku,region,quantity
A-1,Unknown,3
A-2,West,0

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Column-specific defaults preserve meaning better than one global replacement.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Column-specific defaults preserve meaning better than one global replacement.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a report cannot display blank regions requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Keeping only actionable orders — slug: /guide/transforms/filter/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›filter

Workshop 15 · 18 minutes

### Keeping only actionable orders

A practical workshop for support only needs overdue orders. Build the smallest manifest, validate it, run it and read the result.

#### Context — support only needs overdue orders

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s filter operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One filter step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

id,status,days_overdue
1,open,12
2,paid,20
3,open,3

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

id,status,days_overdue
1,open,12
2,paid,20
3,open,3

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the filter step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- filter:
expr: "status == 'open' and days_overdue > 7"

Check — one filter operation declared

Trap — The expression is boolean. Rows for which it evaluates to false do not reach later steps.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test filter-workshop

ok transformations.yaml — 1 step(s) valid
Operations: filter

✅ All tests pass — ready to execute.

Check — one step counted: filter

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run filter-workshop

✅ Pipeline completed successfully

id,status,days_overdue
1,open,12

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. The expression is boolean. Rows for which it evaluates to false do not reach later steps.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

The expression is boolean. Rows for which it evaluates to false do not reach later steps.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — support only needs overdue orders requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Enriching orders with customer segments — slug: /guide/transforms/join/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›join

Workshop 23 · 18 minutes

### Enriching orders with customer segments

A practical workshop for orders and customer reference data live separately. Build the smallest manifest, validate it, run it and read the result.

#### Context — orders and customer reference data live separately

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s join operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One join step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

orders: order_id,customer_id,amount
O-1,C-7,90
customers: customer_id,segment
C-7,Gold

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

orders: order_id,customer_id,amount
O-1,C-7,90
customers: customer_id,segment
C-7,Gold

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the join step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- join:
right: customers
key: customer_id
how: left

Check — one join operation declared

Trap — A left join preserves every order; unmatched reference fields become null.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test join-workshop

ok transformations.yaml — 1 step(s) valid
Operations: join

✅ All tests pass — ready to execute.

Check — one step counted: join

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run join-workshop

✅ Pipeline completed successfully

order_id,customer_id,amount,segment
O-1,C-7,90,Gold

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. A left join preserves every order; unmatched reference fields become null.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

A left join preserves every order; unmatched reference fields become null.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — orders and customer reference data live separately requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Synchronising a master customer set — slug: /guide/transforms/merge/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›merge

Workshop 30 · 18 minutes

### Synchronising a master customer set

A practical workshop for a current master must absorb a corrected feed. Build the smallest manifest, validate it, run it and read the result.

#### Context — a current master must absorb a corrected feed

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s merge operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One merge step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

master: C-1,Paris · C-2,Lyon
corrections: C-2,Lille · C-3,Nantes

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

master: C-1,Paris · C-2,Lyon
corrections: C-2,Lille · C-3,Nantes

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the merge step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- merge:
right: corrections
key: customer_id
delete_unmatched: false

Check — one merge operation declared

Trap — Matching rows update, new keys insert, and unmatched left rows stay unless explicitly deleted.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test merge-workshop

ok transformations.yaml — 1 step(s) valid
Operations: merge

✅ All tests pass — ready to execute.

Check — one step counted: merge

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run merge-workshop

✅ Pipeline completed successfully

customer_id,city
C-1,Paris
C-2,Lille
C-3,Nantes

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Matching rows update, new keys insert, and unmatched left rows stay unless explicitly deleted.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Matching rows update, new keys insert, and unmatched left rows stay unless explicitly deleted.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a current master must absorb a corrected feed requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Turning monthly rows into report columns — slug: /guide/transforms/pivot/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›pivot

Workshop 27 · 18 minutes

### Turning monthly rows into report columns

A practical workshop for a spreadsheet expects one column per month. Build the smallest manifest, validate it, run it and read the result.

#### Context — a spreadsheet expects one column per month

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s pivot operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One pivot step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

product,month,revenue
Lamp,Jan,20
Lamp,Feb,30
Chair,Jan,50

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

product,month,revenue
Lamp,Jan,20
Lamp,Feb,30
Chair,Jan,50

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the pivot step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- pivot:
index: [product]
column: month
values: revenue
aggfunc: sum

Check — one pivot operation declared

Trap — Duplicate product/month pairs are combined with `aggfunc`.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test pivot-workshop

ok transformations.yaml — 1 step(s) valid
Operations: pivot

✅ All tests pass — ready to execute.

Check — one step counted: pivot

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run pivot-workshop

✅ Pipeline completed successfully

product,Jan,Feb
Chair,50,
Lamp,20,30

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Duplicate product/month pairs are combined with `aggfunc`.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Duplicate product/month pairs are combined with `aggfunc`.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a spreadsheet expects one column per month requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Aligning columns with a target contract — slug: /guide/transforms/rename/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›rename

Workshop 17 · 18 minutes

### Aligning columns with a target contract

A practical workshop for a target expects canonical column names. Build the smallest manifest, validate it, run it and read the result.

#### Context — a target expects canonical column names

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s rename operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One rename step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

customerId,orderTotal
C-1,140.5

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

customerId,orderTotal
C-1,140.5

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the rename step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- rename:
mapping:
customerId: customer_id
orderTotal: order_total

Check — one rename operation declared

Trap — The mapping reads old name → new name. Later steps must use the new names.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test rename-workshop

ok transformations.yaml — 1 step(s) valid
Operations: rename

✅ All tests pass — ready to execute.

Check — one step counted: rename

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run rename-workshop

✅ Pipeline completed successfully

customer_id,order_total
C-1,140.5

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. The mapping reads old name → new name. Later steps must use the new names.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

The mapping reads old name → new name. Later steps must use the new names.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a target expects canonical column names requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Implementing a reviewed custom rule — slug: /guide/transforms/script/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›script

Workshop 32 · 18 minutes

### Implementing a reviewed custom rule

A practical workshop for a classification rule is too specific for built-in operations. Build the smallest manifest, validate it, run it and read the result.

#### Context — a classification rule is too specific for built-in operations

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s script operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One script step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

amount,country
720,DE
90,FR

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

amount,country
720,DE
90,FR

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the script step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- script:
inputs: [amount, country]
outputs:
risk_band: str
mode: row
code: |
risk_band = "high" if amount > 500 and country != "FR" else "standard"

Check — one script operation declared

Trap — Declare the input/output contract; the restricted runtime exposes only those values.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test script-workshop

ok transformations.yaml — 1 step(s) valid
Operations: script

✅ All tests pass — ready to execute.

Check — one step counted: script

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run script-workshop

✅ Pipeline completed successfully

amount,country,risk_band
720,DE,high
90,FR,standard

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Declare the input/output contract; the restricted runtime exposes only those values.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Declare the input/output contract; the restricted runtime exposes only those values.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a classification rule is too specific for built-in operations requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Publishing only approved columns — slug: /guide/transforms/select/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›select

Workshop 16 · 18 minutes

### Publishing only approved columns

A practical workshop for a partner must not receive internal fields. Build the smallest manifest, validate it, run it and read the result.

#### Context — a partner must not receive internal fields

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s select operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One select step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

customer_id,email,city,segment,internal_score
C-1,a@example.test,Paris,A,91

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

customer_id,email,city,segment,internal_score
C-1,a@example.test,Paris,A,91

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the select step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- select:
columns: [customer_id, city, segment]

Check — one select operation declared

Trap — `select` is an allow-list. A new source column stays private until explicitly added.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test select-workshop

ok transformations.yaml — 1 step(s) valid
Operations: select

✅ All tests pass — ready to execute.

Check — one step counted: select

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run select-workshop

✅ Pipeline completed successfully

customer_id,city,segment
C-1,Paris,A

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. `select` is an allow-list. A new source column stays private until explicitly added.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`select` is an allow-list. A new source column stays private until explicitly added.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a partner must not receive internal fields requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Ranking products by revenue — slug: /guide/transforms/sort/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›sort

Workshop 20 · 18 minutes

### Ranking products by revenue

A practical workshop for a report must show the highest revenue first. Build the smallest manifest, validate it, run it and read the result.

#### Context — a report must show the highest revenue first

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s sort operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One sort step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

sku,revenue
B,80
A,120
C,95

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

sku,revenue
B,80
A,120
C,95

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the sort step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- sort:
by: [revenue, sku]
ascending: false

Check — one sort operation declared

Trap — All named sort keys use the declared direction; add a stable tie-breaker such as `sku`.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test sort-workshop

ok transformations.yaml — 1 step(s) valid
Operations: sort

✅ All tests pass — ready to execute.

Check — one step counted: sort

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run sort-workshop

✅ Pipeline completed successfully

sku,revenue
A,120
C,95
B,80

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. All named sort keys use the declared direction; add a stable tie-breaker such as `sku`.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

All named sort keys use the declared direction; add a stable tie-breaker such as `sku`.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a report must show the highest revenue first requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Rotating a compact metric table — slug: /guide/transforms/transpose/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›transpose

Workshop 29 · 18 minutes

### Rotating a compact metric table

A practical workshop for metrics arrive vertically but a consumer expects columns. Build the smallest manifest, validate it, run it and read the result.

#### Context — metrics arrive vertically but a consumer expects columns

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s transpose operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One transpose step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

metric,value
revenue,120
orders,8

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

metric,value
revenue,120
orders,8

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the transpose step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- transpose:
index_col: metric
header_name: field

Check — one transpose operation declared

Trap — Transposition changes the whole table shape; use it on small, deliberate matrices.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test transpose-workshop

ok transformations.yaml — 1 step(s) valid
Operations: transpose

✅ All tests pass — ready to execute.

Check — one step counted: transpose

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run transpose-workshop

✅ Pipeline completed successfully

field,revenue,orders
value,120,8

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Transposition changes the whole table shape; use it on small, deliberate matrices.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Transposition changes the whole table shape; use it on small, deliberate matrices.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — metrics arrive vertically but a consumer expects columns requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Removing invisible whitespace — slug: /guide/transforms/trim/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›trim

Workshop 26 · 18 minutes

### Removing invisible whitespace

A practical workshop for identifiers arrive padded with spaces. Build the smallest manifest, validate it, run it and read the result.

#### Context — identifiers arrive padded with spaces

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s trim operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One trim step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

customer_id,postal_code
" C-17 "," 75010"

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

customer_id,postal_code
" C-17 "," 75010"

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the trim step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- trim:
columns: [customer_id, postal_code]

Check — one trim operation declared

Trap — Trim changes text boundaries only; it does not alter case or internal spaces.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test trim-workshop

ok transformations.yaml — 1 step(s) valid
Operations: trim

✅ All tests pass — ready to execute.

Check — one step counted: trim

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run trim-workshop

✅ Pipeline completed successfully

customer_id,postal_code
C-17,75010

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Trim changes text boundaries only; it does not alter case or internal spaces.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Trim changes text boundaries only; it does not alter case or internal spaces.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — identifiers arrive padded with spaces requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Combining regional order feeds — slug: /guide/transforms/union/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›union

Workshop 31 · 18 minutes

### Combining regional order feeds

A practical workshop for North and South export the same columns separately. Build the smallest manifest, validate it, run it and read the result.

#### Context — North and South export the same columns separately

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s union operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One union step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

north: O-1,North · O-2,North
south: O-2,North · O-3,South

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

north: O-1,North · O-2,North
south: O-2,North · O-3,South

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the union step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- union:
right: south_orders
distinct: true

Check — one union operation declared

Trap — `distinct: false` is UNION ALL; `true` removes fully duplicated rows after stacking.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test union-workshop

ok transformations.yaml — 1 step(s) valid
Operations: union

✅ All tests pass — ready to execute.

Check — one step counted: union

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run union-workshop

✅ Pipeline completed successfully

order_id,region
O-1,North
O-2,North
O-3,South

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. `distinct: false` is UNION ALL; `true` removes fully duplicated rows after stacking.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

`distinct: false` is UNION ALL; `true` removes fully duplicated rows after stacking.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — North and South export the same columns separately requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Turning month columns into rows — slug: /guide/transforms/unpivot/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Transforms›unpivot

Workshop 28 · 18 minutes

### Turning month columns into rows

A practical workshop for analytics expects tidy long-form data. Build the smallest manifest, validate it, run it and read the result.

#### Context — analytics expects tidy long-form data

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you express this rule with Hydra’s unpivot operation and prove exactly what it changes?

Use one minimal input fixture

Declare one operation per step

Validate the DSL before running

Compare the complete before and after states

##### The solution in one line

One unpivot step between a deterministic CSV source and a replaceable CSV destination.

data/input.csv6 steps

product,Jan,Feb
Lamp,20,30
Chair,50,40

‹ Back Next ›

1

What you do
Use a minimal fixture that exposes the rule.

Step 1 · fixture ready ↺ Start over

#### Steps

##### 1. capture the before state

Use a minimal fixture that exposes the rule.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

product,Jan,Feb
Lamp,20,30
Chair,50,40

Check — before state recorded

##### 2. declare the fixture

Read the known input.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
sources:
input:
type: csv
connection:
base_path: "data"
extract:
table: input.csv

Check — input identifier is input

##### 3. add the unpivot step

Write one operation with explicit parameters.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
steps:
- unpivot:
id_vars: [product]
value_vars: [Jan, Feb]
var_name: month
value_name: revenue

Check — one unpivot operation declared

Trap — Identifier columns are repeated; every selected value column becomes a row.

##### 4. make the result observable

Write a replaceable CSV.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

version: "1.0"
destinations:
result:
type: csv
connection:
base_path: "out"
load:
table: result.csv
mode: replace

---
version: "1.0"
pipeline:
from: input
to: result

Check — result.csv will contain the after state

##### 5. validate the operation

Ask Hydra to parse the step.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl test unpivot-workshop

ok transformations.yaml — 1 step(s) valid
Operations: unpivot

✅ All tests pass — ready to execute.

Check — one step counted: unpivot

##### 6. run and compare after to before

Inspect the exact output.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl run unpivot-workshop

✅ Pipeline completed successfully

product,month,revenue
Lamp,Jan,20
Chair,Jan,50
Lamp,Feb,30
Chair,Feb,40

Check — expected after state reproduced

#### Expected result

The after state matches the stated rule.

One operation is counted by `hdrctl test`.

The fixture can be rerun without accumulating rows.

#### Reading the results

Compare columns, row count and ordering—not just one visible value. Identifier columns are repeated; every selected value column becomes a row.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Identifier columns are repeated; every selected value column becomes a row.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — analytics expects tidy long-form data requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Running a workflow on demand — slug: /guide/triggers/manual/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Triggers›manual

Workshop 38 · 20 minutes

### Running a workflow on demand

A practical workshop for an operator controls when a recovery flow starts. Build the smallest manifest, validate it, run it and read the result.

#### Context — an operator controls when a recovery flow starts

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make manual explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare manual

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: manual_workshop
description: "Running a workflow on demand"
trigger:
type: manual
steps:
- name: load_sales
type: job
job: ./jobs/sales

Check — workflow contract declared

Trap — Manual is the default and safest trigger while a workflow is being developed.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: manual_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

Trigger: manual
Run: started by operator
Status: succeeded

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

Trigger: manual
Run: started by operator
Status: succeeded

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

Trigger: manual

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Manual is the default and safest trigger while a workflow is being developed.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Manual is the default and safest trigger while a workflow is being developed.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — an operator controls when a recovery flow starts requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Scheduling a workflow every morning — slug: /guide/triggers/schedule/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Triggers›schedule

Workshop 39 · 20 minutes

### Scheduling a workflow every morning

A practical workshop for the warehouse refresh must start at 06:00 daily. Build the smallest manifest, validate it, run it and read the result.

#### Context — the warehouse refresh must start at 06:00 daily

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make schedule explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare schedule

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: schedule_workshop
description: "Scheduling a workflow every morning"
trigger:
type: schedule
cron: "0 6 * * *"
steps:
- name: load_sales
type: job
job: ./jobs/sales

Check — workflow contract declared

Trap — Cron says when; the scheduler timezone decides which 06:00 it means.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: schedule_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

Schedule: 0 6 * * *
Next run: 06:00
Timezone: scheduler configuration

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

Schedule: 0 6 * * *
Next run: 06:00
Timezone: scheduler configuration

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

Schedule: 0 6 * * *

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Cron says when; the scheduler timezone decides which 06:00 it means.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Cron says when; the scheduler timezone decides which 06:00 it means.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — the warehouse refresh must start at 06:00 daily requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Starting a workflow from a webhook — slug: /guide/triggers/webhook/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Triggers›webhook

Workshop 40 · 20 minutes

### Starting a workflow from a webhook

A practical workshop for a source system announces when an export is ready. Build the smallest manifest, validate it, run it and read the result.

#### Context — a source system announces when an export is ready

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make webhook explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare webhook

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: webhook_workshop
description: "Starting a workflow from a webhook"
trigger:
type: webhook
steps:
- name: load_sales
type: job
job: ./jobs/sales

Check — workflow contract declared

Trap — Validate and authenticate the incoming request at the API boundary before starting work.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: webhook_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

POST /workflow/run
workflow: import_partner
status: accepted

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

POST /workflow/run
workflow: import_partner
status: accepted

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

POST /workflow/run

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Validate and authenticate the incoming request at the API boundary before starting work.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Validate and authenticate the incoming request at the API boundary before starting work.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a source system announces when an export is ready requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Sending a notification action — slug: /guide/workflows/action/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Workflows›action

Workshop 34 · 20 minutes

### Sending a notification action

A practical workshop for operations needs a completion message. Build the smallest manifest, validate it, run it and read the result.

#### Context — operations needs a completion message

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make action explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare action

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: action_workshop
description: "Sending a notification action"
trigger:
type: manual
steps:
- name: load_sales
type: job
job: ./jobs/sales
- name: announce
type: action
action: log
params:
message: "Daily load completed"
depends_on: [load_sales]

Check — workflow contract declared

Trap — Actions perform side effects around jobs; dependencies prevent early notification.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: action_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

load_sales succeeded
announce succeeded Daily load completed

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

load_sales succeeded
announce succeeded Daily load completed

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

load_sales succeeded

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Actions perform side effects around jobs; dependencies prevent early notification.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Actions perform side effects around jobs; dependencies prevent early notification.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — operations needs a completion message requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Running independent jobs in parallel — slug: /guide/workflows/depends_on/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Workflows›depends_on

Workshop 35 · 20 minutes

### Running independent jobs in parallel

A practical workshop for sales and inventory can load at the same time. Build the smallest manifest, validate it, run it and read the result.

#### Context — sales and inventory can load at the same time

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make depends_on explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare depends_on

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: depends_on_workshop
description: "Running independent jobs in parallel"
trigger:
type: manual
steps:
- name: sales
type: job
job: ./jobs/sales
- name: inventory
type: job
job: ./jobs/inventory
- name: publish
type: job
job: ./jobs/publish
depends_on: [sales, inventory]

Check — workflow contract declared

Trap — Dependencies form a DAG. Steps with no unmet dependency are eligible to run together.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: depends_on_workshop
Steps: 3

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

sales succeeded ┐
inventory succeeded ├─ parallel
publish succeeded ┘ after both

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

sales succeeded ┐
inventory succeeded ├─ parallel
publish succeeded ┘ after both

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

sales succeeded ┐

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Dependencies form a DAG. Steps with no unmet dependency are eligible to run together.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Dependencies form a DAG. Steps with no unmet dependency are eligible to run together.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — sales and inventory can load at the same time requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Running a Hydra job as a workflow step — slug: /guide/workflows/job/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Workflows›job

Workshop 33 · 20 minutes

### Running a Hydra job as a workflow step

A practical workshop for a daily flow must execute the sales job. Build the smallest manifest, validate it, run it and read the result.

#### Context — a daily flow must execute the sales job

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make job explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare job

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: job_workshop
description: "Running a Hydra job as a workflow step"
trigger:
type: manual
steps:
- name: load_sales
type: job
job: ./jobs/sales

Check — workflow contract declared

Trap — A job step points to a job folder. The workflow records its status and duration.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: job_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

load_sales succeeded 842 rows

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

load_sales succeeded 842 rows

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

load_sales succeeded 842 rows

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. A job step points to a job folder. The workflow records its status and duration.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

A job step points to a job folder. The workflow records its status and duration.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a daily flow must execute the sales job requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Choosing what happens after a failed step — slug: /guide/workflows/on_failure/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Workflows›on_failure

Workshop 37 · 20 minutes

### Choosing what happens after a failed step

A practical workshop for a non-critical notification must not block the load. Build the smallest manifest, validate it, run it and read the result.

#### Context — a non-critical notification must not block the load

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make on_failure explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare on_failure

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: on_failure_workshop
description: "Choosing what happens after a failed step"
trigger:
type: manual
steps:
- name: notify
type: action
action: webhook
params:
url: ${ENV:OPS_WEBHOOK_URL}
on_failure: continue
- name: load_sales
type: job
job: ./jobs/sales
depends_on: [notify]

Check — workflow contract declared

Trap — Use `continue` only when downstream work remains valid without the failed step.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: on_failure_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

notify failed · continued
load_sales succeeded

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

notify failed · continued
load_sales succeeded

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

notify failed · continued

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. Use `continue` only when downstream work remains valid without the failed step.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

Use `continue` only when downstream work remains valid without the failed step.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a non-critical notification must not block the load requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---

## Guarding a workflow step with an expression — slug: /guide/workflows/when/

Hydra ETL
Search Ctrl K
[image: Hydra ETL on SaaSHub]

← All guidesbrowse the catalogue

Guide›Workflows›when

Workshop 36 · 20 minutes

### Guarding a workflow step with an expression

A practical workshop for a costly export should run only in production. Build the smallest manifest, validate it, run it and read the result.

#### Context — a costly export should run only in production

The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.

##### Where things stand

The current result is fragile. Its assumptions are split between tools, clicks and memory.

Reruns are uncertain. The write mode or orchestration rule is not visible beside the data.

Evidence is missing. A colleague cannot compare a declared rule with a concrete before and after state.

##### The question

How do you make when explicit in workflow.yaml and verify the resulting execution states?

Keep jobs independently runnable

Give every workflow step a unique name

Validate the graph before execution

Read every step status in the summary

##### The solution in one line

A small workflow.yaml, one validation command and one run with observable step states.

workspace tree5 steps

workflow.yaml
jobs/
sales/
inventory/
publish/

‹ Back Next ›

1

What you do
Name the work the workflow will coordinate.

Step 1 · workspace ready ↺ Start over

#### Steps

##### 1. prepare the jobs and boundary

Name the work the workflow will coordinate.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow.yaml
jobs/
sales/
inventory/
publish/

Check — job boundaries identified

##### 2. declare when

Write the trigger, steps and policy.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

workflow:
version: "1.0"
name: when_workshop
description: "Guarding a workflow step with an expression"
trigger:
type: manual
steps:
- name: publish
type: job
job: ./jobs/publish
when: "params.environment == 'production'"

Check — workflow contract declared

Trap — A false guard is a controlled skip, not a failure.

##### 3. validate the graph

Catch missing jobs, duplicate names and invalid dependencies.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow validate workflow.yaml

✅ Workflow valid: when_workshop
Steps: 1

Check — workflow and dependency graph valid

##### 4. run the workflow

Execute and follow step states.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

$ hdrctl workflow run workflow.yaml

environment=staging publish skipped
environment=production publish succeeded

Check — terminal states recorded

##### 5. read the orchestration result

Distinguish success, skip, retry and continuation.

Compare the file with the explanation in the workbench.

Record the shown check before moving to the next step.

environment=staging publish skipped
environment=production publish succeeded

Check — result matches the declared orchestration rule

#### Expected result

The workflow validates before execution.

environment=staging publish skipped

The run summary explains every terminal state.

#### Reading the results

Read the summary as a graph, not a flat log. A false guard is a controlled skip, not a failure.

##### What the counters do—and do not—prove

They prove how many records entered and left this run. They do not replace checking the target schema, the business meaning of values or the reason a workflow step was skipped.

##### The rule to carry forward

A false guard is a controlled skip, not a failure.

#### Did we answer the question?

objectiveresultwhere

Configuration explicityesthe relevant YAML block

Safe rerunyesthe destination or workflow policy

Observable resultyesthe command output and counters

Hidden manual ruleremovedthe rule now lives in versioned text

#### Before and after

Before — a costly export should run only in production requires a person to remember the order, options and checks.

After — one reviewed manifest and one command produce the same observable result.

What is really gained — The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.

##### Close by

sources.yaml

transformations.yaml

destinations.yaml

workflow.yaml

Tutorial — your first job

All Guide workshops

Esc

↑ ↓ navigate↵ open

‹ 0 / 0 on this page › ✕

---
