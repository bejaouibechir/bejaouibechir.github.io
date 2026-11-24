# Questions already published on hydraetl.com

This file is the exclusion list. Every question below is ALREADY answered on
the page named above it. Do not propose any of them as a new question.

Total: 541 questions across 118 pages.

## Hydra ETL changelog — slug: /changelog/
- - steps.1: Step 'b': unknown key 'depend_on' — did you mean 'depends_on'?

## What a Hydra job is made of: four YAML files — slug: /cli/guides/anatomy-of-a-job/
- What files make up a Hydra job?
- Which manifest is optional?
- How does pipeline.yaml connect the other files?
- Where are the paths in a job resolved from?
- How do I check a job without running it?

## Call a Hydra project from another project — slug: /cli/guides/call-a-project-from-a-project/
- How does a Hydra project call another project?
- What does the calling project print?
- Can a project call itself?
- What happens if the project folder does not exist?
- Does a dry run run the called project?

## Clean, split, window, pivot and script transformations — slug: /cli/guides/clean-split-window-pivot-and-script/
- How do I clean spaces and letter case in Hydra ETL?
- How do I split a value into several rows?
- How do I number rows or compute a running total?
- What do pivot and unpivot do?
- Can I write my own Python step?

## Advanced sources: Snowflake, BigQuery and CDC — slug: /cli/guides/configure-snowflake-bigquery-and-cdc-sources/
- How do I check a Snowflake, BigQuery or CDC source without a server?
- What does a run say when the server or the account is missing?
- Is the password shown in the error?
- What do the CDC sources need on the database side?
- Does Hydra ETL read MongoDB with this configuration?

## Connect Claude Code to Hydra ETL with the MCP server — slug: /cli/guides/connect-claude-code-to-hydra-etl-with-mcp/
- What is the Hydra ETL MCP server?
- Does hdrctl mcp setup change my global Claude Code settings?
- Can the assistant read files outside my project?
- Can the assistant run a job without asking me?
- Can I use it with a client other than Claude Code?

## Declare project triggers in triggers.yaml — slug: /cli/guides/declare-project-triggers/
- What is a trigger in Hydra ETL?
- Which trigger types exist?
- Who runs the triggers?
- How do I check triggers.yaml before using it?
- Where do I see what a trigger started?

## Launch a Hydra job from the CLI and the API — slug: /cli/guides/launch-a-job-from-the-cli-and-the-api/
- How do I run a Hydra job without Studio?
- What is the difference between running a job and running a project?
- How do I start a run from the API?
- How do I read the result of an API run?
- Can an AI assistant launch a job?

## Manage the jobs and parameters of a Hydra project — slug: /cli/guides/manage-jobs-and-parameters-from-the-cli/
- How do I add a job to a workflow from the command line?
- What does detaching a job do?
- Where is a project parameter stored?
- How do I use a parameter in a job?
- How do I run a job with an environment?

## Pass parameters to a Hydra sub-project and read results back — slug: /cli/guides/pass-parameters-to-a-sub-project/
- How do I pass a value to a sub-project?
- How do I read a result from a sub-project?
- What else can I read after the step?
- What if the sub-project does not publish an output?
- What if I pass a parameter the sub-project does not declare?

## Read from and write to a SQLite database in a Hydra ETL job — slug: /cli/guides/read-and-write-sqlite-databases/
- How do I read a SQLite database with Hydra ETL?
- Should I read a table or a query?
- Can Hydra ETL write to SQLite?
- What does upsert do?
- What error do I get when the file or the table is missing?

## Read CSV, JSON and Parquet files in a Hydra job — slug: /cli/guides/read-csv-json-and-parquet-files/
- How do I read a CSV, JSON or Parquet file in Hydra ETL?
- Is the path relative to something?
- What shape must a JSON file have?
- Does Parquet need an extra package?
- Can I read a CSV that uses semicolons?

## Run Hydra ETL in production with hdrctl serve — slug: /cli/guides/run-hydra-in-production-with-hdrctl-serve/
- How do I run Hydra ETL workflows on a schedule without opening Studio?
- What does --no-studio change?
- Where do I see the scheduled runs?
- Do the runs survive a restart of the server?
- Is the server safe to expose to the internet?
- Does the schedule restart on its own after a reboot?

## Start a Hydra project with interval, marker, file and source triggers — slug: /cli/guides/run-triggers-with-hdrctl-watch/
- What runs the triggers of a Hydra project?
- What is the difference between a marker and a file trigger?
- Why did my file trigger never fire?
- Do the files that already exist start a run?
- How does a source_change trigger work?

## Basics — slug: /dsl/01-basics/
- Step 'notify': unknown action 'webhok'. Valid actions: assign_param, bash, condition, delay, email, log, powershell, python, set_param, ssh, webhook — did you mean 'webhook'?

## Jobs: sources and destinations — slug: /dsl/02-jobs-part1/
- sources.yamlYesWhere does the data come from?
- destinations.yamlYesWhere does the data go?
- pipeline.yamlYesWhich source feeds which destination?
- transformations.yamlNoWhat happens to the data on the way?
- Example 5: what if key is missing?

## Jobs: transformations — slug: /dsl/02-jobs-part2/
- aggregate or window?

## The connection block changes shape with the type — slug: /dsl/sources/
- No data is read. The parser answers one question: is this block well formed?

## From raw data to a repeatable pipeline — slug: /get-started/
- What is Hydra?

## Publishing a regenerable CSV export — slug: /guide/destinations/csv/
- How do you load records into csv with explicit, testable rerun semantics?

## Publishing records as JSON — slug: /guide/destinations/json/
- How do you load records into json with explicit, testable rerun semantics?

## Loading product documents into MongoDB — slug: /guide/destinations/mongodb/
- How do you load records into mongodb with explicit, testable rerun semantics?

## Loading inventory into MySQL — slug: /guide/destinations/mysql/
- How do you load records into mysql with explicit, testable rerun semantics?

## Writing a compact Parquet snapshot — slug: /guide/destinations/parquet/
- How do you load records into parquet with explicit, testable rerun semantics?

## Upserting customers into PostgreSQL — slug: /guide/destinations/postgresql/
- How do you load records into postgresql with explicit, testable rerun semantics?

## Delivering records to a Web API — slug: /guide/destinations/web_api/
- How do you load records into web_api with explicit, testable rerun semantics?

## Retrying a transiently failing step — slug: /guide/policies/retry/
- How do you make retry explicit in workflow.yaml and verify the resulting execution states?

## Ingesting the daily sales export — slug: /guide/sources/csv/
- without opening a spreadsheet, and in a way that runs the same tomorrow?
- Why seven and three?
- What would happen without the cast?

## Turning application events into rows — slug: /guide/sources/json/
- How do you read JSON records in batches without writing a one-off conversion script?

## Flattening customer documents from MongoDB — slug: /guide/sources/mongodb/
- How do you read a MongoDB collection and make the expected fields explicit?

## Exporting the customer table from MySQL — slug: /guide/sources/mysql/
- How do you stream a MySQL table through Hydra with no password in the manifest?

## Reading an analytics extract efficiently — slug: /guide/sources/parquet/
- How do you ingest a Parquet snapshot while preserving its typed, columnar data?

## Extracting paid orders from PostgreSQL — slug: /guide/sources/postgresql/
- How do you connect safely and extract only the useful rows from PostgreSQL?

## Collecting every page of a REST API — slug: /guide/sources/web_api/
- How do you authenticate, paginate and turn API responses into Hydra batches?

## Summarising revenue by city — slug: /guide/transforms/aggregate/
- How do you express this rule with Hydra’s aggregate operation and prove exactly what it changes?

## Computing line totals — slug: /guide/transforms/calculate/
- How do you express this rule with Hydra’s calculate operation and prove exactly what it changes?

## Giving text values real types — slug: /guide/transforms/cast/
- How do you express this rule with Hydra’s cast operation and prove exactly what it changes?

## Normalising messy customer names — slug: /guide/transforms/clean/
- How do you express this rule with Hydra’s clean operation and prove exactly what it changes?

## Keeping one event per identifier — slug: /guide/transforms/deduplicate/
- How do you express this rule with Hydra’s deduplicate operation and prove exactly what it changes?

## Providing defaults for missing values — slug: /guide/transforms/fill_null/
- How do you express this rule with Hydra’s fill_null operation and prove exactly what it changes?

## Keeping only actionable orders — slug: /guide/transforms/filter/
- How do you express this rule with Hydra’s filter operation and prove exactly what it changes?

## Enriching orders with customer segments — slug: /guide/transforms/join/
- How do you express this rule with Hydra’s join operation and prove exactly what it changes?

## Synchronising a master customer set — slug: /guide/transforms/merge/
- How do you express this rule with Hydra’s merge operation and prove exactly what it changes?

## Turning monthly rows into report columns — slug: /guide/transforms/pivot/
- How do you express this rule with Hydra’s pivot operation and prove exactly what it changes?

## Aligning columns with a target contract — slug: /guide/transforms/rename/
- How do you express this rule with Hydra’s rename operation and prove exactly what it changes?

## Implementing a reviewed custom rule — slug: /guide/transforms/script/
- How do you express this rule with Hydra’s script operation and prove exactly what it changes?

## Publishing only approved columns — slug: /guide/transforms/select/
- How do you express this rule with Hydra’s select operation and prove exactly what it changes?

## Ranking products by revenue — slug: /guide/transforms/sort/
- How do you express this rule with Hydra’s sort operation and prove exactly what it changes?

## Rotating a compact metric table — slug: /guide/transforms/transpose/
- How do you express this rule with Hydra’s transpose operation and prove exactly what it changes?

## Removing invisible whitespace — slug: /guide/transforms/trim/
- How do you express this rule with Hydra’s trim operation and prove exactly what it changes?

## Combining regional order feeds — slug: /guide/transforms/union/
- How do you express this rule with Hydra’s union operation and prove exactly what it changes?

## Turning month columns into rows — slug: /guide/transforms/unpivot/
- How do you express this rule with Hydra’s unpivot operation and prove exactly what it changes?

## Running a workflow on demand — slug: /guide/triggers/manual/
- How do you make manual explicit in workflow.yaml and verify the resulting execution states?

## Scheduling a workflow every morning — slug: /guide/triggers/schedule/
- How do you make schedule explicit in workflow.yaml and verify the resulting execution states?

## Starting a workflow from a webhook — slug: /guide/triggers/webhook/
- How do you make webhook explicit in workflow.yaml and verify the resulting execution states?

## Sending a notification action — slug: /guide/workflows/action/
- How do you make action explicit in workflow.yaml and verify the resulting execution states?

## Running independent jobs in parallel — slug: /guide/workflows/depends_on/
- How do you make depends_on explicit in workflow.yaml and verify the resulting execution states?

## Running a Hydra job as a workflow step — slug: /guide/workflows/job/
- How do you make job explicit in workflow.yaml and verify the resulting execution states?

## Choosing what happens after a failed step — slug: /guide/workflows/on_failure/
- How do you make on_failure explicit in workflow.yaml and verify the resulting execution states?

## Guarding a workflow step with an expression — slug: /guide/workflows/when/
- How do you make when explicit in workflow.yaml and verify the resulting execution states?

## Hydra ETL vs Airbyte — slug: /migrate/airbyte/
- Should you replace Airbyte with Hydra ETL?
- Can Hydra replace an Airbyte connector?
- Can Airbyte feed Hydra?
- Is Hydra upsert the same as Airbyte incremental sync?
- What should be done with CDC streams?
- How do I prevent duplicate loads?
- Should Hydra read an Airbyte raw table?
- Can Airbyte and dbt remain alongside Hydra?
- How should schema changes be evaluated?
- Does the simulator compare connector performance?
- What is the rollback path?
- How do Airbyte and Hydra ETL integrate?
- What connector checks are needed before moving an Airbyte sync to Hydra?
- Does Hydra support Airbyte CDC behavior?
- How does Airbyte incremental sync compare with Hydra upsert?
- Should I replace Airbyte with Hydra ETL?
- How do you move an Airbyte sync to a Hydra job?
- Can Hydra transform Airbyte raw tables?
- Who should own retries when Airbyte and Hydra are chained?
- What metrics should an Airbyte-to-Hydra pilot compare?
- How do you roll back an Airbyte replacement?

## Hydra ETL vs Airflow — slug: /migrate/airflow/
- Should you replace Airflow with Hydra ETL?
- Is Airflow an ETL engine?
- Can Airflow orchestrate Hydra?
- When should a DAG be replaced by a Hydra workflow?
- How does Airflow backfill affect migration?
- What happens to Airflow operators and sensors?
- How should Airflow retries be configured around Hydra?
- Can both Airflow and Hydra schedules be enabled?
- Does a shorter Hydra YAML prove lower operating cost?
- What does the browser simulator execute?
- What is the safest Airflow rollback?
- Can Hydra ETL replace Apache Airflow?
- How do you run Hydra ETL from an Airflow DAG?
- How do Airflow DAG dependencies map to Hydra workflows?
- Does Hydra support Airflow backfill and catchup?
- How do Airflow XCom values map to Hydra parameters?
- What is the difference between Airflow orchestration and Hydra ETL?
- Can Airflow schedule a Hydra YAML pipeline?
- How do you migrate Airflow retries and failure policies?
- When should Airflow remain the orchestrator?
- How do you roll back an Airflow-to-Hydra workflow migration?

## Hydra ETL vs Dagster — slug: /migrate/dagster/
- Should you replace Dagster with Hydra ETL?
- Can Hydra replace a Dagster asset?
- Can Dagster run a Hydra job?
- What happens to Dagster lineage?
- How should partitions be passed to Hydra?
- Should sensors move to Hydra triggers?
- Can I consolidate intermediate Dagster assets?
- How do asset checks interact with Hydra?
- Is Hydra simpler than Dagster for every pipeline?
- Does the simulator model asset lineage?
- What is a safe rollback after a hybrid pilot?
- How do you run a Hydra ETL job from Dagster?
- Can Hydra ETL replace Dagster?
- How do Dagster assets map to Hydra jobs?
- Can Dagster orchestrate Hydra YAML pipelines?
- How do Dagster schedules and sensors compare with Hydra triggers?
- What happens to Dagster lineage if a pipeline moves to Hydra?
- Should Dagster remain in a Hydra ETL architecture?
- How do Dagster partitions affect a Hydra migration?
- What should a Dagster-to-Hydra pilot verify?
- How do you roll back from a Hydra-owned Dagster asset?

## Hydra ETL vs dbt — slug: /migrate/dbt/
- Should you replace dbt with Hydra ETL?
- Is Hydra ETL a replacement for dbt?
- Where should Hydra hand data to dbt?
- Can Hydra execute dbt models directly?
- Should I remove dbt tests when moving ingestion to Hydra?
- What happens to dbt ref() dependencies?
- Does Hydra upsert equal a dbt incremental model?
- Can dbt still own transformations after Hydra is added?
- How do I avoid duplicate schedules?
- Can the browser simulator benchmark dbt against Hydra?
- What is the safe rollback if the new ingestion fails?
- How do Hydra ETL and dbt work together?
- Should Hydra replace dbt models?
- Can Hydra ETL run before dbt build?
- What is the difference between dbt incremental models and Hydra upsert?
- How do you map dbt tests to a Hydra migration?
- Can dbt transform data from a Hydra ETL pipeline?
- Is Hydra ETL an alternative to dbt for cross-system data movement?
- How do you migrate a dbt model to Hydra YAML?
- What are the main risks of replacing dbt with Hydra?
- How do you roll back a Hydra and dbt integration?

## Hydra ETL vs dlt — slug: /migrate/dlt/
- Should you replace dlt with Hydra ETL?
- What is the main difference between dlt and Hydra ETL?
- Can Hydra replace a dlt REST API source?
- Does a Hydra upsert replace dlt incremental loading?
- How should schema drift be compared?
- Can dlt and Hydra run in the same project?
- Should I migrate nested JSON normalization to Hydra first?
- What should be compared after the first successful run?
- Which tool is better for a Python-heavy team?
- Can the browser simulator measure dlt performance?
- What is the safest rollback after a dlt migration pilot?
- How do you migrate a dlt pipeline to Hydra ETL?
- Can Hydra ETL replace dlt incremental cursors?
- How do dlt schema contracts compare with Hydra schema drift policies?
- Can Hydra transform data loaded by dlt?
- Is dlt or Hydra better for a custom paginated API?
- How do you compare dlt merge with Hydra upsert?
- What should a dlt-to-Hydra proof of concept include?
- Can a dlt pipeline and a Hydra workflow share a schedule?
- Does Hydra automatically normalize nested JSON like dlt?
- How do you roll back from Hydra to dlt?

## Hydra ETL vs Flowman — slug: /migrate/flowman/
- Should you replace Flowman with Hydra ETL?
- How are Flowman and Hydra similar?
- Can Hydra replace a Spark-scale Flowman job?
- What is a Flowman relation?
- Do Flowman mappings map one-to-one to Hydra steps?
- How should Flowman job parameters be migrated?
- Can Flowman and Hydra coexist?
- What happens to Flowman-managed schemas?
- What metrics matter in a Flowman comparison?
- Does the simulator execute Spark?
- How can a Flowman migration be rolled back?
- How do you migrate a Flowman job to Hydra ETL?
- Can Hydra replace Flowman Spark execution?
- How do Flowman relations map to Hydra sources and destinations?
- How do Flowman mappings compare with Hydra transformations?
- Is Flowman or Hydra better for large data volumes?
- What is a practical Flowman-to-Hydra handoff?
- Does Hydra understand Flowman YAML files?
- What is a safe first Flowman-to-Hydra pilot?
- How should Flowman partitioning be handled in Hydra?
- How do you roll back a Flowman migration?

## Hydra ETL vs Kestra — slug: /migrate/kestra/
- Should you replace Kestra with Hydra ETL?
- Are Kestra and Hydra direct competitors?
- Can a Kestra flow run Hydra?
- Can Hydra replace Kestra triggers?
- What happens to Kestra plugin tasks?
- How should files be passed between Kestra and Hydra?
- Does a Hydra job replace a Kestra flow?
- How do retries interact?
- Can both schedules run during a parallel test?
- Does the simulator run a Kestra worker?
- What is the rollback plan?
- How do you integrate Hydra ETL with Kestra?
- Can Hydra replace a Kestra flow?
- How do Kestra tasks map to Hydra workflow steps?
- How do Kestra triggers compare with Hydra triggers?
- Can Kestra orchestrate a Hydra ETL project?
- Should Kestra stay in a Hydra migration?
- How do you compare Kestra YAML and Hydra YAML?
- What should a Kestra-to-Hydra proof of concept test?
- Can Hydra run inside a Kestra Docker task?
- How do you roll back after migrating a Kestra flow?

## Hydra ETL vs Meltano — slug: /migrate/meltano/
- Should you replace Meltano with Hydra ETL?
- What is the main difference between Meltano and Hydra?
- Can Hydra replace a Singer tap?
- Can a Meltano target feed a Hydra job?
- What happens to Meltano state IDs?
- Can I use dbt, Meltano and Hydra together?
- Does a Hydra environment map directly to a Meltano environment?
- Which Meltano pipeline should migrate first?
- How do I retry only the Hydra step?
- Can the simulator benchmark Meltano plugins?
- What is a safe rollback?
- How do you integrate Hydra ETL with Meltano?
- Can Hydra replace Meltano taps and targets?
- How does Singer state compare with a Hydra upsert?
- How do Meltano environments map to Hydra environments?
- Can Meltano run a Hydra ETL job?
- Should Meltano or Hydra own data extraction?
- How do you migrate a Meltano pipeline to Hydra YAML?
- What should be tested before replacing a Meltano target?
- Can Meltano and Hydra share the same destination?
- How do you roll back a Meltano-to-Hydra migration?

## Hydra ETL vs Talend — slug: /migrate/talend/
- Should you replace Talend with Hydra ETL?
- Can Hydra import a Talend Studio Job automatically?
- What is the closest Hydra equivalent of tMap?
- Can Talend call Hydra without replacing the Job?
- How do Talend contexts map to Hydra environments?
- What happens to Talend reject rows?
- Is YAML easier to review than a Talend Job?
- Can Hydra replace Talend’s connector catalog?
- Which Talend Job should migrate first?
- How should numeric and date fields be tested?
- What is a safe Talend rollback plan?
- How do you migrate a Talend Studio Job to Hydra ETL?
- Which Talend components map to Hydra transformations?
- Can Hydra import a Talend Job automatically?
- How do Talend context variables map to Hydra parameters and secrets?
- What happens to Talend reject rows during migration?
- Is Hydra ETL a replacement for Talend Data Integration?
- Can Talend and Hydra run side by side?
- How do you compare Talend tMap with a Hydra job?
- How should a Talend-to-Hydra cutover be tested?
- What is the rollback plan after replacing a Talend Job?

## Create a project in Hydra Studio and add its first workflow — slug: /studio/01-open-a-project/
- Where does Hydra Studio store a new project?
- What is the difference between a project and a workflow?
- Which trigger should I choose for a new workflow?
- Can I use a project created outside Studio?

## Check the Hydra Studio API connection (API online or offline) — slug: /studio/02-check-the-api/
- What port does Hydra Studio use?
- How often does Studio check the API?
- Why is the Studio page blank or empty while the sidebar works?
- Can I check the API without opening Studio?

## Read the Hydra Studio canvas: nodes, ports and edges — slug: /studio/03-read-the-canvas/
- What is the difference between Jobs configuration and Workflow configuration?
- Which way do edges point in Hydra Studio?
- What do the counters beside the name mean?
- Where do I see the YAML behind the canvas?

## Hydra Studio node palette: sources, transformations, destinations and actions — slug: /studio/04-use-the-palette/
- How many sources, transformations and destinations does Hydra Studio offer?
- Which sources have no matching destination?
- Why is Bash or PowerShell dimmed in the palette?
- What if no transformation fits my rule?

## Create a job in Hydra Studio and add its source — slug: /studio/05-add-a-source/
- sources.yamlWhere does the data come from?
- transformations.yamlWhat happens to it along the way?
- destinations.yamlWhere does it go?
- pipeline.yamlWhich source feeds which destination?
- What is a Hydra job made of?
- How do I create a job in Hydra Studio?
- What is the difference between Archive and Delete for a job?
- Which sources can I add to a job?
- Which HTTP methods does the Web API source offer?

## Add a transformation in Hydra Studio: the 20 operations — slug: /studio/06-add-a-transformation/
- How many transformations does Hydra Studio have?
- Does the order of transformations matter?
- Which transformations combine two streams?
- Why does Studio refuse an edge between two nodes?

## Add a destination in Hydra Studio: one job, one place to write — slug: /studio/07-add-a-destination/
- Which destinations does Hydra Studio offer?
- Can a Hydra job write to two destinations?
- Why is there no Web API destination?
- How do I keep a password out of a destination?

## Read the YAML Hydra Studio generates (Hydra DSL panel) — slug: /studio/08-see-the-yaml/
- Where do I see the YAML in Hydra Studio?
- What does a job step look like in workflow.yaml?
- Does a container appear in workflow.yaml?
- Can I write the YAML by hand instead?

## Hydra Studio Valid badge: what it checks and what it does not — slug: /studio/09-reach-valid/
- What does the Valid badge mean in Hydra Studio?
- Why is my job valid but a node still has a red badge?
- Does a valid job always run successfully?
- What does a Cast node need?

## Run a Hydra job from Studio: four ways, one engine — slug: /studio/10-run-the-job/
- How do I run a job in Hydra Studio?
- Is running from Studio different from running from the command line?
- What is the difference between Open a project, Import workflow and Import a job?
- Where do I find the result of a finished run?

## Review a past run in Hydra Studio: Runs page, filters and logs — slug: /studio/11-review-a-run/
- Where are past runs in Hydra Studio?
- How do I filter runs by status?
- Where do I read the logs of one step?
- Does the run history survive closing Studio?

## Compose jobs into an ordered workflow in Hydra Studio — slug: /studio/12-compose-jobs/
- Does an edge between two jobs pass data?
- How is an edge written in workflow.yaml?
- How is a job step written in workflow.yaml?
- Can a workflow hold more than two jobs?

## Hydra Studio containers: Sequence, Error Scope and Retry Scope — slug: /studio/13-handle-failure/
- What are the containers in Hydra Studio?
- Do containers appear in workflow.yaml?
- What are the on_failure values?
- Can a step override its container?

## Use parameters in Hydra Studio: Set Param and Assign Param — slug: /studio/14-use-parameters/
- What is the syntax of a parameter in Hydra?
- What is the difference between Set Param and Assign Param?
- Can a value change in the middle of a run?
- Where do I learn about environments and secrets?

## Make a load all-or-nothing in Hydra ETL Studio — slug: /studio/all-or-nothing-load/
- What does all-or-nothing mean in Hydra ETL?
- Is all-or-nothing on by default?
- What happens with atomic set to false?
- Which batch failed in the test?

## Branch a Hydra Studio workflow with the Condition node — slug: /studio/branch-with-the-condition-node/
- What does the Condition node do in Hydra Studio?
- How do I make a step run only when a condition is true?
- What is the difference between Expression and Structured mode?
- What happens to the step on the other branch?
- Where does the value being compared come from?

## Break a Hydra ETL pipeline on purpose, then recover — slug: /studio/break-it-then-recover/
- How do I test a Hydra ETL fallback?
- What happens when a retried step still fails?
- Why did the report fallback run after I deleted the input?
- Is the failed report published?

## Build a resilient ETL pipeline in Hydra ETL Studio — slug: /studio/build-a-resilient-pipeline/
- How do I make a Hydra ETL project resilient?
- Does a retry show up in the log?
- What does a dry run check in a project with protections?
- Why is wf_flaky not before wf_report?

## Check the execution order of a Hydra project for errors — slug: /studio/check-the-execution-order/
- What does Check do in Execution order?
- What does the Ready line mean?
- How is a missing workflow reported?
- Does Check run my workflows?
- Does Check save my changes?

## Create a workflow in a Hydra project with hdrctl — slug: /studio/create-a-workflow/
- How do I create a workflow in a Hydra project?
- What happens if I give no name?
- Does the new workflow run in the project?
- How do I delete a workflow?
- Can I import an existing workflow file?

## Declare a fallback workflow in Hydra ETL Studio — slug: /studio/declare-a-fallback-workflow/
- What is a fallback workflow in Hydra ETL?
- Where is a fallback declared?
- Does a fallback run when a workflow fails?
- Can I test a fallback without running anything?

## Declare the undo of an action in Hydra ETL Studio — slug: /studio/declare-undo-actions/
- Why does Hydra ETL refuse my workflow with rollback on?
- When should I use undo: none?
- Which actions can serve as an undo?
- What does hdrctl workflow undo do?

## Define the execution order of a Hydra project in Studio — slug: /studio/define-the-execution-order/
- Where do I edit the execution order in Hydra Studio?
- How do I add a workflow to the thread in Studio?
- How do I skip a workflow without deleting it?
- Does the execution order apply to a single workflow?
- What happens if I leave the page with unsaved changes?

## Diagnose a failed Hydra run in Studio — slug: /studio/diagnose-a-failed-run/
- How do I find out why a Hydra run failed?
- What happens to the workflows after the one that failed?
- Where is the Python traceback?
- Should I run again or fix the cause?
- How do I run a failed workflow again from Studio?

## Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback — slug: /studio/dry-run-and-use-fallback/
- What does hdrctl run --dry-run do with fallbacks?
- How do I force a fallback in Hydra ETL?
- Can I use --use-fallback on a single job?
- Why did a second fallback run after I forced the first?

## Fallback conditions in Hydra ETL: when, on_failure and on_probe_error — slug: /studio/fallback-conditions-when-on-failure/
- Which functions can a fallback condition use?
- What happens when a fallback check cannot answer?
- Does a fallback run after a failure?
- Which units can a condition use?

## Hydra Studio settings: global preferences and project settings — slug: /studio/global-and-project-settings/
- What is the difference between Global settings and Project settings in Hydra Studio?
- Where does Studio save each setting?
- Are secrets shared with my team through Git?
- How do I open the settings of a project?
- When do triggers run?

## Handle a failing step with on_failure — slug: /studio/handle-step-failures-with-on-failure/
- What does on_failure do in a Hydra ETL workflow?
- What is the difference between skip and continue?
- Does the workflow succeed when I use skip or continue?
- How does the Error Scope container of Studio relate to this?
- What does Hydra ETL say when the value is wrong?
- Is there an Error Scope in Hydra Studio?

## Import a job into a Hydra ETL workflow — slug: /studio/import-a-job-into-a-workflow/
- How do I bring a job written elsewhere into a Hydra ETL workflow?
- Which files does the folder need?
- What does Save write?
- What is the name of the step that Import creates?
- Does the imported job run?

## Install Hydra ETL and start Hydra Studio with hdrctl serve — slug: /studio/install-and-start/
- How do I install Hydra ETL and start Studio?
- Which Python version does Hydra ETL need?
- Why install the server extra?
- How do I start Studio on another port?
- Where does Studio keep my projects?

## Run Log, Python and shell actions in a Hydra Studio workflow — slug: /studio/log-python-and-shell-actions/
- What actions can a Hydra workflow run?
- How do I run a Python script in a workflow?
- Why is the Bash action unavailable on Windows?
- Where does the output of a step go?
- What does On failure do?

## Send a webhook and an email from a Hydra ETL workflow — slug: /studio/notify-with-webhook-and-email-actions/
- How do I call a URL from a Hydra ETL workflow?
- How do I write headers and body in the YAML?
- What happens when the server answers 404 or is down?
- How do I send an email from a workflow?
- Which parameters are required?
- Can I configure the webhook and email actions in Hydra Studio?

## Orchestrate a Hydra project from thread.yaml — slug: /studio/orchestrate-from-thread-yaml/
- What is thread.yaml in a Hydra project?
- How do I validate thread.yaml?
- What formats do delays and timeouts accept?
- Which keys does a stage accept?
- What happens if workflows/thread.yaml does not exist?

## Preview the execution order of a Hydra project — slug: /studio/preview-the-execution-order/
- What does the Preview tab show?
- How do I see which workflows run in parallel?
- What do the clock and hourglass mean?
- Does Preview run anything?
- Can I open a workflow from the diagram?

## Read the Insights statistics of Hydra Studio — slug: /studio/read-the-insights-statistics/
- What does the Insights page show in Hydra Studio?
- How is the average duration computed?
- Why are my Insights counters back to zero?
- Does Insights count runs started from the terminal?
- Can I see statistics per workflow?

## Repeat Hydra workflows with loops in thread.yaml — slug: /studio/repeat-workflows-with-loops/
- How do I repeat a workflow in Hydra?
- Does times count the first run?
- How do I pause between passes?
- Can I check a loop without running it?
- What happens if a workflow fails inside a loop?

## Resolve a rollback conflict and recover in Hydra ETL — slug: /studio/resolve-conflicts-and-recover/
- Why did Hydra ETL not undo my step?
- Where does Hydra ETL keep what is left to undo?
- Why can I not run the workflow again?
- Does putting the file back as it was fix the conflict?

## Retry a failing step with retry — slug: /studio/retry-a-failing-step-with-retry/
- How do I retry a failing step in Hydra ETL?
- Does max count the first try?
- What does exponential backoff do?
- Where do I see each attempt?
- How does the Retry Scope container of Studio relate to this?
- Is there a Retry Scope in Hydra Studio?

## Roll back a failed workflow in Hydra ETL Studio — slug: /studio/roll-back-a-failed-workflow/
- What does rollback do in Hydra ETL?
- Are jobs undone automatically?
- What about actions?
- Does rollback run when a step succeeds?

## Run a Hydra project on a schedule with a cron trigger — slug: /studio/run-a-project-on-a-cron-schedule/
- What does a cron trigger do in Hydra ETL?
- Which fields does the cron expression have?
- How do I set the time zone of a cron trigger?
- Does the cron trigger run without hdrctl serve?
- What happens if the cron expression is wrong?
- Can I add a cron trigger in Hydra Studio?

## Run Hydra workflows in sequence or in parallel with stages — slug: /studio/run-steps-in-sequence-or-in-parallel/
- What is a stage in thread.yaml?
- How do I run two workflows at the same time in Hydra?
- What does delay_after do?
- How do I skip a workflow without deleting it?
- What happens when a workflow in a stage fails?

## Set a timeout on a workflow in Hydra ETL Studio — slug: /studio/set-timeouts-on-workflows/
- How do I set a timeout on a Hydra ETL workflow?
- Does the timeout stop a step in the middle?
- What happens to the workflow after a timeout?
- Does a fallback run have its own timeout?

## Start a Hydra ETL project from a webhook — slug: /studio/start-a-project-with-a-webhook/
- How do I start a Hydra ETL project from another system?
- Where do I put the token?
- What answers do I get when the call is wrong?
- Can I send data with the webhook?
- Does the webhook trigger work with hdrctl watch?
- Can I create the webhook token in Hydra Studio?

## Start from a Hydra Studio workflow template: View YAML and Copy YAML — slug: /studio/start-from-a-template/
- What templates does Hydra Studio include?
- Does a template create jobs for me?
- How do I copy a template?
- Which template runs on a schedule?
- What does depends_on do in a template?

## Store and use secrets in a Hydra ETL project — slug: /studio/store-and-use-secrets-with-hdrctl/
- Where does Hydra ETL store secrets?
- How do I use a secret in a job or a workflow?
- Are secret values shown in the logs?
- What wins when the secret is also an environment variable?
- How do I keep a different secret per environment?
- Can I manage secrets in Hydra Studio?

## Switch environments in Hydra ETL with hdrctl env — slug: /studio/switch-environments-with-hdrctl-env/
- What is an environment in Hydra ETL?
- How do I read an environment variable in a job or workflow?
- What happens if I give --env a name that does not exist?
- Does an environment replace the common variables?
- How do I try environments without touching my own settings?
- Can I manage environments in Hydra Studio?

## Tour the Hydra Studio pages: Overview, Runs, Templates, Insights and Settings — slug: /studio/tour-the-pages/
- What pages does Hydra Studio have?
- Where are my jobs if there is no Jobs page?
- Why is the Runs page empty?
- Why does Insights show only zeros?
- Is the Help page available?

## Use the Hydra Studio bottom panel: Logs, Parameters, Secrets and Terminal — slug: /studio/use-the-bottom-panel/
- How do I open the bottom panel in Hydra Studio?
- What are the four tabs of the bottom panel?
- Where does Studio store the parameters and the secrets?
- How do I use a parameter or a secret in a field?
- Can I resize the bottom panel?

## Wait with the Hydra Studio Delay node: pause a workflow for N seconds — slug: /studio/wait-with-the-delay-node/
- What does the Delay node do in Hydra Studio?
- What is the YAML of a Delay step?
- Can the delay be shorter than a second?
- What happens if seconds is not a number?
- Can I use a parameter for the delay?

