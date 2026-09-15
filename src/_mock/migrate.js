var ORDERS=[
 {order_id:1001,customer_id:"C-01",amount:45,status:"paid"},{order_id:1002,customer_id:"C-02",amount:120,status:"paid"},
 {order_id:1003,customer_id:"C-01",amount:300,status:"refunded"},{order_id:1004,customer_id:"C-03",amount:89,status:"paid"},
 {order_id:1005,customer_id:"C-02",amount:250,status:"pending"},{order_id:1006,customer_id:"C-04",amount:170,status:"paid"},
 {order_id:1007,customer_id:"C-05",amount:60,status:"paid"},{order_id:1008,customer_id:"C-03",amount:420,status:"paid"},
 {order_id:1009,customer_id:"C-01",amount:15,status:"refunded"},{order_id:1010,customer_id:"C-04",amount:210,status:"pending"},
 {order_id:1011,customer_id:"C-02",amount:95,status:"paid"},{order_id:1012,customer_id:"C-05",amount:330,status:"paid"},
 {order_id:1013,customer_id:"C-03",amount:78,status:"refunded"},{order_id:1014,customer_id:"C-01",amount:145,status:"pending"}];
var HYDRA_JOB='version: "1.0"\npipeline:\n  name: orders_by_status\n  from: orders\n  to: report\n  schedule: "0 6 * * *"\n  steps:\n    - filter:\n        expr: amount > 50\n    - aggregate:\n        by: [status]\n        agg:\n          total: { func: sum, col: amount }\n    - sort:\n        by: [total]\n        ascending: false';
var HY={files:1,svc:1,dep:0,concepts:3};
var METRICS=[
 {k:"loc",nm:"Lines of code",u:"",h:"Comments excluded, formatted per each tool's docs."},
 {k:"files",nm:"Files to maintain",u:"",h:"Every file needed for the job to run on a schedule."},
 {k:"svc",nm:"Services to operate",u:"",h:"Long-running processes you deploy, monitor, upgrade."},
 {k:"dep",nm:"Library imports",u:"",h:"Dependencies the pipeline file pulls in."},
 {k:"concepts",nm:"Concepts to learn",u:"",h:"Framework abstractions needed to read the file."}];
var TOOLS={
 airflow:{nm:"Airflow",col:"#17b3c3",file:"dags/orders_daily.py",unit:"DAG",rel:"replace",
  relText:"Replacement path",relNote:"Hydra can take over orchestration entirely — the tunnel decides whether your project actually qualifies.",
  loc:47,files:3,svc:4,dep:5,concepts:6,logic:8,
  conceptList:"DAG, PythonOperator, default_args, catchup, XCom, Hook",svcList:"scheduler, metadata DB, worker, broker",
  code:'<span class="c"># dags/orders_daily.py</span>\nfrom airflow import DAG\nfrom airflow.operators.python import PythonOperator\nfrom airflow.providers.postgres.hooks.postgres import PostgresHook\nfrom datetime import datetime, timedelta\nimport pandas as pd\n\ndefault_args = {\n    <span class="s">"owner"</span>: <span class="s">"data-eng"</span>,\n    <span class="s">"retries"</span>: 2,\n    <span class="s">"retry_delay"</span>: timedelta(minutes=5),\n}\n\n<span class="k">def</span> extract(**context):\n    df = pd.read_csv(<span class="s">"./data/orders.csv"</span>)\n    df.to_parquet(<span class="s">"/tmp/raw.parquet"</span>)\n\n<span class="k">def</span> transform(**context):\n    df = pd.read_parquet(<span class="s">"/tmp/raw.parquet"</span>)\n    df = df[df[<span class="s">"amount"</span>] &gt; <span class="hl">50</span>]\n    out = (df.groupby(<span class="s">"status"</span>, as_index=False)\n             .agg(total=(<span class="s">"amount"</span>, <span class="s">"sum"</span>)))\n    out = out.sort_values(<span class="s">"total"</span>, ascending=False)\n    out.to_parquet(<span class="s">"/tmp/agg.parquet"</span>)\n\n<span class="k">def</span> load(**context):\n    df = pd.read_parquet(<span class="s">"/tmp/agg.parquet"</span>)\n    df.to_csv(<span class="s">"./out/by_status.csv"</span>, index=False)\n\n<span class="k">with</span> DAG(\n    dag_id=<span class="s">"orders_daily"</span>,\n    start_date=datetime(2024, 1, 1),\n    schedule=<span class="s">"0 6 * * *"</span>,\n    catchup=False,\n    default_args=default_args,\n) <span class="k">as</span> dag:\n    t1 = PythonOperator(task_id=<span class="s">"extract"</span>, python_callable=extract)\n    t2 = PythonOperator(task_id=<span class="s">"transform"</span>, python_callable=transform)\n    t3 = PythonOperator(task_id=<span class="s">"load"</span>, python_callable=load)\n    t1 &gt;&gt; t2 &gt;&gt; t3\n\n<span class="c"># + airflow.cfg, a metadata DB, a scheduler and workers</span>',
  pain:["3 operators and 2 temp files to express one linear flow.","The transform is pandas you own, test and debug yourself.","4 long-running services keep the schedule alive.","6 framework concepts before you can read the file."],
  fix:["Steps replace operators; no temp files between them.","<code>filter</code> / <code>aggregate</code> / <code>sort</code> are engine steps, already tested.","One process — same YAML from CLI, API or Studio.","3 concepts total: source, steps, destination."]},
 dagster:{nm:"Dagster",col:"#8b5cf6",file:"assets/orders.py",unit:"assets",rel:"replace",
  relText:"Replacement path",relNote:"Hydra can take over orchestration — but keep Dagster if asset lineage is central to your work.",
  loc:38,files:2,svc:3,dep:4,concepts:5,logic:7,
  conceptList:"asset, Definitions, define_asset_job, ScheduleDefinition, AssetExecutionContext",svcList:"daemon, web server, code location",
  code:'<span class="c"># assets/orders.py</span>\nimport pandas as pd\nfrom dagster import (asset, AssetExecutionContext, Definitions,\n                     ScheduleDefinition, define_asset_job)\n\n<span class="k">@asset</span>(group_name=<span class="s">"orders"</span>)\n<span class="k">def</span> raw_orders(context: AssetExecutionContext) -&gt; pd.DataFrame:\n    df = pd.read_csv(<span class="s">"./data/orders.csv"</span>)\n    context.add_output_metadata({<span class="s">"rows"</span>: len(df)})\n    <span class="k">return</span> df\n\n<span class="k">@asset</span>(group_name=<span class="s">"orders"</span>)\n<span class="k">def</span> big_orders(raw_orders: pd.DataFrame) -&gt; pd.DataFrame:\n    <span class="k">return</span> raw_orders[raw_orders[<span class="s">"amount"</span>] &gt; <span class="hl">50</span>]\n\n<span class="k">@asset</span>(group_name=<span class="s">"orders"</span>)\n<span class="k">def</span> orders_by_status(big_orders: pd.DataFrame) -&gt; pd.DataFrame:\n    out = (big_orders.groupby(<span class="s">"status"</span>, as_index=False)\n                     .agg(total=(<span class="s">"amount"</span>, <span class="s">"sum"</span>)))\n    <span class="k">return</span> out.sort_values(<span class="s">"total"</span>, ascending=False)\n\n<span class="k">@asset</span>(group_name=<span class="s">"orders"</span>)\n<span class="k">def</span> status_report(orders_by_status: pd.DataFrame) -&gt; None:\n    orders_by_status.to_csv(<span class="s">"./out/by_status.csv"</span>, index=False)\n\norders_job = define_asset_job(<span class="s">"orders_job"</span>, selection=<span class="s">"*"</span>)\n\ndefs = Definitions(\n    assets=[raw_orders, big_orders, orders_by_status, status_report],\n    schedules=[ScheduleDefinition(job=orders_job, cron_schedule=<span class="s">"0 6 * * *"</span>)],\n)\n\n<span class="c"># + a Definitions registry, a daemon and the web server</span>',
  pain:["4 assets + a Definitions registry for a 4-step linear job.","Every intermediate frame becomes a materialised asset to track.","The asset graph is right for ML lineage — overhead for plain ETL.","Several features you'd reach for next sit in Dagster+."],
  fix:["Steps inside one job — no asset per intermediate frame.","The lineage you get is the pipeline itself.","Python only where you actually need it.","Everything shown here is in the open-source engine."]},
 prefect:{nm:"Prefect",col:"#2563eb",file:"flows/orders.py",unit:"flow",rel:"replace",
  relText:"Replacement path",relNote:"Hydra can take over orchestration entirely — the tunnel decides whether your project actually qualifies.",
  loc:34,files:2,svc:3,dep:4,concepts:5,logic:6,
  conceptList:"flow, task, deployment, work pool, cache_key_fn",svcList:"server/cloud, work pool, agent",
  code:'<span class="c"># flows/orders.py</span>\nimport pandas as pd\nfrom prefect import flow, task\nfrom prefect.tasks import task_input_hash\nfrom datetime import timedelta\n\n<span class="k">@task</span>(retries=2, retry_delay_seconds=300,\n      cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=1))\n<span class="k">def</span> extract() -&gt; pd.DataFrame:\n    <span class="k">return</span> pd.read_csv(<span class="s">"./data/orders.csv"</span>)\n\n<span class="k">@task</span>\n<span class="k">def</span> keep_big(df: pd.DataFrame) -&gt; pd.DataFrame:\n    <span class="k">return</span> df[df[<span class="s">"amount"</span>] &gt; <span class="hl">50</span>]\n\n<span class="k">@task</span>\n<span class="k">def</span> by_status(df: pd.DataFrame) -&gt; pd.DataFrame:\n    out = (df.groupby(<span class="s">"status"</span>, as_index=False)\n             .agg(total=(<span class="s">"amount"</span>, <span class="s">"sum"</span>)))\n    <span class="k">return</span> out.sort_values(<span class="s">"total"</span>, ascending=False)\n\n<span class="k">@task</span>\n<span class="k">def</span> load(df: pd.DataFrame) -&gt; None:\n    df.to_csv(<span class="s">"./out/by_status.csv"</span>, index=False)\n\n<span class="k">@flow</span>(name=<span class="s">"orders-daily"</span>, log_prints=True)\n<span class="k">def</span> orders_daily():\n    load(by_status(keep_big(extract())))\n\n<span class="k">if</span> __name__ == <span class="s">"__main__"</span>:\n    orders_daily.serve(name=<span class="s">"orders-daily"</span>, cron=<span class="s">"0 6 * * *"</span>)\n\n<span class="c"># + a deployment, a work pool and an agent</span>',
  pain:["4 task wrappers around pandas one-liners, plus a deployment.","The schedule and work pool live in Prefect, not in the file you review.","Billing follows flow runs, so cost tracks volume.","Much of the polish you'd want next is in Prefect Cloud."],
  fix:["4 tasks collapse into 3 declared steps.","<code>schedule</code> is a line in the manifest — Git is the source of truth.","No per-run metering: you pay for the machine.","Engine, API and Studio ship together, open source."]},
 dbt:{nm:"dbt",col:"#ff694a",file:"models/*.sql + schema.yml + project.yml + dag",unit:"project",rel:"complement",
  relText:"Complement — keep dbt",relNote:"Hydra replaces the orchestration half only. Keep dbt for tests, exposures and freshness contracts.",
  loc:41,files:4,svc:3,dep:3,concepts:6,logic:9,
  conceptList:"model, ref, materialized, profile, schema.yml tests, + orchestrator",svcList:"warehouse, dbt runner, orchestrator",
  code:'<span class="c">-- models/orders_by_status.sql</span>\n{{ config(materialized=<span class="s">"table"</span>) }}\n\n<span class="k">with</span> big_orders <span class="k">as</span> (\n    <span class="k">select</span> * <span class="k">from</span> {{ ref(<span class="s">"stg_orders"</span>) }}\n    <span class="k">where</span> amount &gt; <span class="hl">50</span>\n)\n<span class="k">select</span> status, sum(amount) <span class="k">as</span> total\n<span class="k">from</span> big_orders\n<span class="k">group by</span> status\n<span class="k">order by</span> total <span class="k">desc</span>\n\n<span class="c"># models/schema.yml</span>\nversion: 2\nmodels:\n  - name: orders_by_status\n    columns:\n      - name: status\n        tests: [not_null]\n\n<span class="c"># dbt_project.yml</span>\nname: analytics\nprofile: warehouse\nmodels:\n  analytics:\n    +materialized: view\n\n<span class="c"># dags/run_dbt.py — the scheduling half</span>\nfrom airflow import DAG\nfrom airflow.operators.bash import BashOperator\n<span class="k">with</span> DAG(<span class="s">"dbt_daily"</span>, schedule=<span class="s">"0 6 * * *"</span>, start_date=...) <span class="k">as</span> dag:\n    BashOperator(task_id=<span class="s">"dbt_run"</span>,\n                 bash_command=<span class="s">"dbt run --select orders_by_status"</span>)\n\n<span class="c"># two dependency graphs to keep in sync</span>',
  pain:["4 files: the model, its schema, the project config, and a DAG to schedule it.","Two dependency graphs — dbt's and the orchestrator's — to keep in sync.","Failures arrive as a <code>dbt run</code> stderr dump inside a Bash task.","Everything must land in a warehouse first, even for file-to-file work."],
  fix:["One manifest holds schedule and steps — a single graph.","Errors name the step, the column and the row count.","Declare a source once, reuse it across the workflow.","<strong>Keep dbt for tests, exposures and freshness. Hydra replaces the orchestration half.</strong>"]},
 databricks:{nm:"Databricks",col:"#e8542f",file:"orders_job.json + notebook",unit:"job",rel:"complement",
  relText:"Complement — orchestrate from outside",relNote:"Hydra schedules and sequences your jobs. Keep Databricks for Spark-scale compute and notebooks.",
  loc:44,files:2,svc:2,dep:3,concepts:6,logic:6,
  conceptList:"job JSON, job_cluster, notebook_task, widgets, dbutils, mounts",svcList:"workspace, job cluster",
  code:'<span class="c">// orders_job.json — Databricks Workflows</span>\n{\n  <span class="s">"name"</span>: <span class="s">"orders_daily"</span>,\n  <span class="s">"schedule"</span>: { <span class="s">"quartz_cron_expression"</span>: <span class="s">"0 0 6 * * ?"</span>,\n                 <span class="s">"timezone_id"</span>: <span class="s">"UTC"</span> },\n  <span class="s">"job_clusters"</span>: [{\n    <span class="s">"job_cluster_key"</span>: <span class="s">"etl"</span>,\n    <span class="s">"new_cluster"</span>: {\n      <span class="s">"spark_version"</span>: <span class="s">"14.3.x-scala2.12"</span>,\n      <span class="s">"node_type_id"</span>: <span class="s">"i3.xlarge"</span>,\n      <span class="s">"num_workers"</span>: 2,\n      <span class="s">"autotermination_minutes"</span>: 20\n    }\n  }],\n  <span class="s">"tasks"</span>: [\n    { <span class="s">"task_key"</span>: <span class="s">"transform"</span>,\n      <span class="s">"job_cluster_key"</span>: <span class="s">"etl"</span>,\n      <span class="s">"notebook_task"</span>: {\n        <span class="s">"notebook_path"</span>: <span class="s">"/Repos/data/orders_by_status"</span>,\n        <span class="s">"base_parameters"</span>: { <span class="s">"min_amount"</span>: <span class="s">"<span class="hl">50</span>"</span> }\n      }\n    }\n  ]\n}\n\n<span class="c"># /Repos/data/orders_by_status — the notebook</span>\ndf = spark.read.csv(<span class="s">"/mnt/raw/orders.csv"</span>, header=<span class="k">True</span>, inferSchema=<span class="k">True</span>)\ndf = df.filter(df.amount &gt; int(dbutils.widgets.get(<span class="s">"min_amount"</span>)))\nagg = df.groupBy(<span class="s">"status"</span>).sum(<span class="s">"amount"</span>) \\\n        .withColumnRenamed(<span class="s">"sum(amount)"</span>, <span class="s">"total"</span>)\nagg.orderBy(agg.total.desc()) \\\n   .write.mode(<span class="s">"overwrite"</span>).csv(<span class="s">"/mnt/out/by_status"</span>)\n\n<span class="c"># logic lives in a notebook — awkward to diff and review</span>',
  pain:["Split across job JSON and a notebook that resists code review.","A cluster bills for uptime, not for useful work.","6 platform concepts (widgets, dbutils, mounts…) before you can read it.","The config doesn't travel — cross-workspace is a one-way door."],
  fix:["One YAML file — diffable, reviewable, portable.","Small jobs run in-process; call Spark only when data demands it.","3 concepts: source, steps, destination.","<strong>Keep Databricks for Spark-scale work and notebooks. Hydra orchestrates from outside.</strong>"]},
 airbyte:{nm:"Airbyte",col:"#615eff",file:"connection.yaml + orchestration dag",unit:"pipeline",rel:"complement",
  relText:"Complement — keep Airbyte",relNote:"Hydra sequences the pipeline around your syncs. Keep Airbyte for its connector catalogue.",
  loc:36,files:3,svc:2,dep:2,concepts:6,logic:5,
  conceptList:"source, destination, connection, syncCatalog, syncMode, + orchestrator",svcList:"Airbyte platform, orchestrator",
  code:'<span class="c"># Airbyte handles the ingest half</span>\nsource:\n  name: orders-csv\n  sourceType: file\n  connectionConfiguration:\n    url: ./data/orders.csv\n    format: csv\n    provider: { storage: local }\n\ndestination:\n  name: warehouse\n  destinationType: postgres\n  connectionConfiguration:\n    host: db.internal\n    database: analytics\n    schema: raw\n\nconnection:\n  name: orders-sync\n  schedule: { scheduleType: cron, cronExpression: <span class="s">"0 6 * * * ?"</span> }\n  syncCatalog:\n    streams:\n      - stream: { name: orders }\n        config: { syncMode: full_refresh, destinationSyncMode: overwrite }\n\n<span class="c"># …then something else transforms, and waits for the sync</span>\n<span class="c"># dags/after_sync.py</span>\nfrom airflow.providers.airbyte.operators.airbyte <span class="k">import</span> AirbyteTriggerSyncOperator\nsync = AirbyteTriggerSyncOperator(task_id=<span class="s">"sync"</span>, connection_id=<span class="s">"..."</span>, wait_for_completion=<span class="k">True</span>)\ntransform = PostgresOperator(task_id=<span class="s">"agg"</span>, sql=<span class="s">"""\n    create table by_status as\n    select status, sum(amount) total from raw.orders\n    where amount &gt; <span class="hl">50</span> group by status order by total desc"""</span>)\nsync &gt;&gt; transform\n\n<span class="c"># two retry policies, two UIs, one logical pipeline</span>',
  pain:["Airbyte ingests; a second tool must transform and wait on the sync.","2 control planes and 2 retry policies for one logical pipeline.","Data must land in a warehouse before you can aggregate it.","3 files for what is conceptually one job."],
  fix:["Sync, transform and load are steps in one workflow.","One retry and SLA policy owns the whole job.","Aggregate in flight — no landing table for simple cases.","<strong>Keep Airbyte for its connector catalogue. Hydra sequences the pipeline around it.</strong>"]},
 flowman:{nm:"Flowman",col:"#db2777",file:"project.yml + model/ + mapping/ + target/ + job/ + cron",unit:"project",rel:"replace",deep:false,
  relText:"Replacement path",relNote:"The closest neighbour on this page — declarative YAML on both sides. Hydra covers the same ground without a Spark runtime or a second scheduler.",
  loc:50,files:6,svc:2,dep:0,concepts:7,logic:10,
  conceptList:"project, module, relation, mapping, target, job, + external scheduler",svcList:"Spark runtime, external scheduler",
  code:"<span class=\"c\"># project.yml</span>\nname: <span class=\"s\">\"orders\"</span>\nversion: <span class=\"s\">\"1.0\"</span>\nmodules:\n  - model\n  - mapping\n  - target\n  - job\n\n<span class=\"c\"># model/orders.yml \u2014 sources and sinks are both \"relations\"</span>\nrelations:\n  orders:\n    kind: file\n    format: csv\n    location: <span class=\"s\">\"file:///data/orders\"</span>\n    options:\n      header: <span class=\"s\">\"true\"</span>\n      inferSchema: <span class=\"s\">\"true\"</span>\n  report:\n    kind: file\n    format: csv\n    location: <span class=\"s\">\"file:///data/report\"</span>\n    options:\n      header: <span class=\"s\">\"true\"</span>\n\n<span class=\"c\"># mapping/orders_by_status.yml \u2014 one named mapping per operation</span>\nmappings:\n  orders_raw:\n    kind: relation\n    relation: orders\n  big_orders:\n    kind: filter\n    input: orders_raw\n    condition: <span class=\"s\">\"amount &gt; <span class=\"hl\">50</span>\"</span>\n  by_status:\n    kind: aggregate\n    input: big_orders\n    dimensions: [status]\n    aggregations:\n      total: <span class=\"s\">\"sum(amount)\"</span>\n  by_status_sorted:\n    kind: sort\n    input: by_status\n    columns:\n      - total: desc\n\n<span class=\"c\"># target/report.yml \u2014 plug a mapping into a relation</span>\ntargets:\n  report:\n    kind: relation\n    mapping: by_status_sorted\n    relation: report\n\n<span class=\"c\"># job/main.yml \u2014 the build unit</span>\njobs:\n  main:\n    targets:\n      - report\n\n<span class=\"c\"># crontab \u2014 Flowman builds, it does not schedule</span>\n0 6 * * * bin/flowexec -f projects/orders job build main",
  pain:["Five entity types across five directories to express one linear flow.","No scheduler. <code>flowexec</code> is a build command, so cron or Airflow still owns the timing.","A working Spark and Hadoop install is a prerequisite, even for one CSV file.","filter, aggregate and sort become four named mappings chained by <code>input</code>."],
  fix:["Source, steps, destination and schedule live in one manifest.","<code>trigger</code> belongs to the workflow — no second scheduler to operate.","Runs on Python 3.9+. Nothing to provision for file-to-file work.","Same four operations, three concepts: source, steps, destination."]},
 nifi:{nm:"NiFi",col:"#ca8a04",file:"NiFi_Flow.json (exported flow definition)",unit:"process group",rel:"complement",deep:false,
  relText:"Complement — keep NiFi",relNote:"Hydra takes the declarative batch half. Keep NiFi for streaming ingest, conditional routing, back-pressure and provenance — it has no equivalent here.",
  loc:55,files:2,svc:3,dep:0,concepts:7,logic:5,
  conceptList:"FlowFile, processor, relationship, connection, controller service, process group, scheduling strategy",svcList:"NiFi node, NiFi Registry, ZooKeeper",
  code:"<span class=\"c\">// NiFi_Flow.json \u2014 exported flow definition.</span>\n<span class=\"c\">// Drawn on the canvas, never typed: the real export repeats identifiers,</span>\n<span class=\"c\">// positions and bundle coordinates for every element (~600 lines).</span>\n{\n  <span class=\"s\">\"flowContents\"</span>: {\n    <span class=\"s\">\"name\"</span>: <span class=\"s\">\"orders_by_status\"</span>,\n    <span class=\"s\">\"processors\"</span>: [\n      {\n        <span class=\"s\">\"name\"</span>: <span class=\"s\">\"GetFile\"</span>,\n        <span class=\"s\">\"type\"</span>: <span class=\"s\">\"org.apache.nifi.processors.standard.GetFile\"</span>,\n        <span class=\"s\">\"schedulingStrategy\"</span>: <span class=\"s\">\"CRON_DRIVEN\"</span>,\n        <span class=\"s\">\"schedulingPeriod\"</span>: <span class=\"s\">\"0 0 6 * * ?\"</span>,\n        <span class=\"s\">\"properties\"</span>: {\n          <span class=\"s\">\"Input Directory\"</span>: <span class=\"s\">\"./data\"</span>,\n          <span class=\"s\">\"File Filter\"</span>: <span class=\"s\">\"orders.csv\"</span>,\n          <span class=\"s\">\"Keep Source File\"</span>: <span class=\"s\">\"true\"</span>\n        }\n      },\n      {\n        <span class=\"s\">\"name\"</span>: <span class=\"s\">\"QueryRecord\"</span>,\n        <span class=\"s\">\"type\"</span>: <span class=\"s\">\"org.apache.nifi.processors.standard.QueryRecord\"</span>,\n        <span class=\"s\">\"schedulingStrategy\"</span>: <span class=\"s\">\"TIMER_DRIVEN\"</span>,\n        <span class=\"s\">\"properties\"</span>: {\n          <span class=\"s\">\"Record Reader\"</span>: <span class=\"s\">\"csv-reader\"</span>,\n          <span class=\"s\">\"Record Writer\"</span>: <span class=\"s\">\"csv-writer\"</span>,\n          <span class=\"s\">\"report\"</span>: <span class=\"s\">\"SELECT status, sum(amount) AS total FROM FLOWFILE WHERE amount &gt; <span class=\"hl\">50</span> GROUP BY status ORDER BY total desc\"</span>\n        },\n        <span class=\"s\">\"autoTerminatedRelationships\"</span>: [<span class=\"s\">\"original\"</span>, <span class=\"s\">\"failure\"</span>]\n      },\n      {\n        <span class=\"s\">\"name\"</span>: <span class=\"s\">\"PutFile\"</span>,\n        <span class=\"s\">\"type\"</span>: <span class=\"s\">\"org.apache.nifi.processors.standard.PutFile\"</span>,\n        <span class=\"s\">\"schedulingStrategy\"</span>: <span class=\"s\">\"TIMER_DRIVEN\"</span>,\n        <span class=\"s\">\"properties\"</span>: {\n          <span class=\"s\">\"Directory\"</span>: <span class=\"s\">\"./out\"</span>,\n          <span class=\"s\">\"Conflict Resolution Strategy\"</span>: <span class=\"s\">\"replace\"</span>\n        },\n        <span class=\"s\">\"autoTerminatedRelationships\"</span>: [<span class=\"s\">\"success\"</span>, <span class=\"s\">\"failure\"</span>]\n      }\n    ],\n    <span class=\"s\">\"connections\"</span>: [\n      { <span class=\"s\">\"source\"</span>: <span class=\"s\">\"GetFile\"</span>, <span class=\"s\">\"destination\"</span>: <span class=\"s\">\"QueryRecord\"</span>, <span class=\"s\">\"selectedRelationships\"</span>: [<span class=\"s\">\"success\"</span>] },\n      { <span class=\"s\">\"source\"</span>: <span class=\"s\">\"QueryRecord\"</span>, <span class=\"s\">\"destination\"</span>: <span class=\"s\">\"PutFile\"</span>, <span class=\"s\">\"selectedRelationships\"</span>: [<span class=\"s\">\"report\"</span>] }\n    ],\n    <span class=\"s\">\"controllerServices\"</span>: [\n      {\n        <span class=\"s\">\"name\"</span>: <span class=\"s\">\"csv-reader\"</span>,\n        <span class=\"s\">\"type\"</span>: <span class=\"s\">\"org.apache.nifi.csv.CSVReader\"</span>,\n        <span class=\"s\">\"properties\"</span>: { <span class=\"s\">\"Schema Access Strategy\"</span>: <span class=\"s\">\"Infer Schema\"</span> }\n      },\n      {\n        <span class=\"s\">\"name\"</span>: <span class=\"s\">\"csv-writer\"</span>,\n        <span class=\"s\">\"type\"</span>: <span class=\"s\">\"org.apache.nifi.csv.CSVRecordSetWriter\"</span>,\n        <span class=\"s\">\"properties\"</span>: { <span class=\"s\">\"Schema Write Strategy\"</span>: <span class=\"s\">\"Do Not Write Schema\"</span>, <span class=\"s\">\"Include Header Line\"</span>: <span class=\"s\">\"true\"</span> }\n      }\n    ]\n  }\n}",
  pain:["The flow is drawn, not written. The versioned artefact is generated JSON you review but never edit.","3 processors, 2 connections and 2 controller services for one linear batch job.","Every relationship must be wired or auto-terminated, including the ones you do not care about.","A JVM estate to operate — node, Registry, ZooKeeper — before the first row moves."],
  fix:["A text manifest you write, diff and review like any other source file.","Source, steps and destination in one file — no relationships to wire.","<code>trigger</code> takes standard 5-field cron, not 6-field Quartz.","<strong>Keep NiFi for streaming, routing and provenance. Hydra takes the declarative batch half.</strong>"]}};

/* practical transition advice, per tool */
var TIPS={
 flowman:{reco:"partial",
  intro:"You already write declarative YAML, so this is a translation rather than a rewrite. The real question is not syntax — it is which of your projects genuinely needs Spark underneath.",
  partial:{nm:"Partial — move the projects that never needed a cluster",when:"Recommended first, and where a lot of estates should stop.",
   steps:["Inventory your projects by relation kind. The ones reading <code>file</code> or a single JDBC table are the candidates.","Translate each <code>relation</code> into a Hydra <strong>source</strong> or <strong>destination</strong> — same fields, one block instead of a directory.","Collapse the mapping chain into ordered <code>steps</code>, in the order <code>flowexec</code> already resolves for you.","Run <code>hdrctl run</code> beside <code>flowexec job build main</code> for a few cycles and diff the outputs — row counts and checksums, not eyeballs.","Move the crontab line into a <code>trigger</code> only once the two agree."],
   eff:"An hour or two per project once you have translated the first one."},
  full:{nm:"Full — retire the Spark installation",when:"Only after the Spark-dependent minority has been identified and handled.",
   steps:["Sort every project into \"needs distributed Spark\" and \"does not\". Be honest; the second list is usually longer.","Port the second list by family: file-to-file first, then single-database jobs.","Handle schema migrations explicitly — if Flowman creates and migrates your Hive or JDBC tables, decide who owns that afterwards.","Remove the external scheduler entries as each workflow takes over its own trigger.","Decommission Spark and Hadoop last. That is the payoff, not the first step."],
   eff:"Weeks, and paced by the audit rather than by the porting."},
  map:[["relation (read)","source"],["relation (write)","destination"],["mapping: filter","filter step"],["mapping: aggregate","aggregate step"],["mapping: sort","sort step"],["target","destination + load"],["job","workflow"],["job parameters","params"],["flowexec job build","hdrctl run"],["cron / Airflow","trigger"]],
  pitfalls:["<strong>Don't port the Spark-scale projects first.</strong> If a job only completes because it is distributed, it is not a Hydra candidate — leave it and come back to it.","<strong>Don't recreate the mapping chain one-to-one.</strong> Four named mappings usually collapse into three steps; keep a name only where another job reads it.","<strong>Don't forget the crontab.</strong> The schedule lives outside Flowman, so it does not travel with the YAML.","<strong>Don't drop schema migrations silently.</strong> If Flowman creates and migrates your Hive or JDBC tables, that responsibility has to land somewhere explicit."]},
 nifi:{reco:"partial",
  intro:"A large share of NiFi canvases are batch jobs wearing a dataflow costume: one CRON-driven fetch, one QueryRecord, one write. Those port cleanly. Everything that listens, routes or replays should stay exactly where it is.",
  partial:{nm:"Partial — move the CRON-driven process groups",when:"Recommended, and where most estates should stop.",
   steps:["List the process groups whose first processor is <code>GetFile</code>, <code>ListFile</code> or <code>QueryDatabaseTable</code> on a <code>CRON_DRIVEN</code> schedule. Those are batch jobs, not dataflows.","Read the <code>QueryRecord</code> SQL — it is usually the entire transformation, and it maps almost line for line onto Hydra steps.","Rebuild one as a Hydra job pointing at a <strong>staging destination</strong>, and leave the NiFi group running.","Diff the two outputs for a few cycles — row counts and checksums, not eyeballs.","Stop the NiFi process group rather than deleting it, then move on to the next family."],
   eff:"An hour per group once the first one is done. The SQL does most of the work."},
  full:{nm:"Full — retire the cluster",when:"Only if NiFi is, in practice, a batch scheduler for you.",
   steps:["Audit for listeners, back-pressure tuning and provenance queries. Any of those in real use means stop here.","Port the remaining groups by family: file-to-file first, then the database extracts.","Replace NiFi Registry with plain git once every flow is a text manifest.","Keep one node alive until the last <code>CRON_DRIVEN</code> group is retired.","Decommission the cluster and ZooKeeper last."],
   eff:"Weeks, and paced by the audit rather than by the porting."},
  map:[["GetFile / ListFile","source"],["PutFile / PutDatabaseRecord","destination"],["QueryRecord SQL","filter + aggregate + sort steps"],["CSVReader service","source schema"],["connection + relationship","step order"],["process group","workflow"],["CRON_DRIVEN schedule","trigger"],["auto-terminated failure","(handled by the engine)"],["NiFi Registry","git"],["provenance","(keep in NiFi)"]],
  pitfalls:["<strong>Don't port streaming flows.</strong> <code>ListenHTTP</code>, <code>ConsumeKafka</code> or anything reacting to files as they land is NiFi's job, and Hydra does not do it.","<strong>Don't port conditional fan-outs.</strong> A <code>RouteOnAttribute</code> with five outgoing relationships has no direct equivalent — you would be rebuilding it as five jobs.","<strong>Don't lose provenance silently.</strong> If an audit relies on NiFi's lineage view, decide who owns that before the flow moves.","<strong>Don't hand-translate the exported JSON.</strong> Read the canvas — the export carries positions and identifiers that mean nothing in a manifest."]},
 airflow:{reco:"partial",
  intro:"Nobody moves 200 DAGs in a weekend. Both routes below are real; the partial one is how almost every successful migration starts.",
  partial:{nm:"Partial — run side by side",when:"Recommended first. Airflow keeps running; Hydra takes a slice you can verify.",
   steps:["Pick <strong>one boring DAG</strong>: linear, batch, no custom operator. A daily aggregation is ideal.","Rebuild it as a Hydra job. Point it at a <strong>staging destination</strong>, not production.","Run both for a week and diff the outputs. Row counts and checksums, not eyeballs.","When they match, flip the DAG to <code>schedule=None</code> and let Hydra own it.","Repeat by family — all your CSV-to-warehouse loads, then all your API pulls."],
   eff:"A few hours for the first job, then far less per job."},
  full:{nm:"Full — replace the scheduler",when:"Only once a decent share of your DAGs already run in Hydra and no operator is missing.",
   steps:["Inventory your operators. Anything without a Hydra equivalent stays behind a <code>script</code> step — count those honestly.","Port DAG by DAG, keeping names identical so dashboards and alerts still line up.","Move <code>Connection</code> and <code>Variable</code> entries to Hydra secrets and env files.","Re-point monitoring at the Hydra API before you turn the scheduler off.","Decommission scheduler, workers, broker and metadata DB — in that order, one week apart."],
   eff:"Weeks to months depending on DAG count. Not a sprint task."},
  map:[["DAG","workflow"],["Operator / task","step"],["Task dependency","depends_on"],["schedule / cron","trigger"],["default_args retries","retry policy"],["Connection","source / destination"],["Variable","env / secret"],["XCom","step output"]],
  pitfalls:["<strong>Don't port your busiest DAG first.</strong> Pick the one nobody would notice breaking.","<strong>Don't lift-and-shift Python into <code>script</code> steps.</strong> If everything ends up in scripts, you've kept the maintenance and lost the benefit.","<strong>Don't skip the parallel-run week.</strong> It's the only cheap way to catch semantic differences.","<strong>Don't delete the metadata DB early</strong> — you'll want the run history for comparison."]},
 dagster:{reco:"partial",
  intro:"If your value comes from the asset graph, keep Dagster. If most of your assets are really just pipeline stages, they map cleanly onto Hydra steps.",
  partial:{nm:"Partial — move the plain pipelines",when:"Recommended. Keep Dagster where lineage matters; move linear ETL out.",
   steps:["Separate assets that are <strong>genuine data products</strong> from those that are just intermediate frames.","Take one chain of intermediate assets and collapse it into a single Hydra job.","Keep the final asset in Dagster if downstream code depends on it materialising there.","Verify against Dagster's own materialisation records for a few cycles.","Move the next chain once the pattern is proven."],
   eff:"Half a day per asset chain."},
  full:{nm:"Full — leave Dagster",when:"Only if you rarely use lineage, partitions or the asset catalogue.",
   steps:["List what you actually use: partitions, sensors, IO managers, the asset catalogue. Be honest about it.","Anything on that list without a Hydra equivalent is a blocker — resolve it before going further.","Port assets in dependency order, from sources downstream.","Replace sensors with Hydra triggers; replace IO managers with declared destinations.","Retire the daemon and web server last."],
   eff:"Weeks. Reconsider if partitions or sensors are central to your setup."},
  map:[["@asset","step or job"],["Asset dependency","depends_on"],["define_asset_job","workflow"],["ScheduleDefinition","trigger"],["Sensor","webhook trigger"],["Resource","connection"],["IO manager","destination"],["Partition","incremental mode"]],
  pitfalls:["<strong>Don't migrate a true asset graph.</strong> If lineage is your product, Dagster is the better tool — say so internally.","<strong>Don't lose materialisation history</strong> before you've exported what auditors might ask for.","<strong>Don't recreate every intermediate asset as a Hydra job.</strong> That's the mistake — they become steps, not jobs.","<strong>Don't assume sensors map one-to-one.</strong> Event semantics differ; test them."]},
 prefect:{reco:"partial",
  intro:"Prefect flows are usually thin wrappers around pandas. Those convert quickly. The work is in deployments and infrastructure, not the logic.",
  partial:{nm:"Partial — one flow at a time",when:"Recommended. Keep the Prefect deployment until Hydra has run clean for a cycle.",
   steps:["Take a flow whose tasks are mostly read / filter / aggregate / write.","Map each task to a step. Tasks that only pass DataFrames around simply disappear.","Move the cron out of <code>.serve()</code> and into the manifest's <code>schedule</code>.","Run both, compare outputs, then pause the Prefect deployment (don't delete it).","Delete the deployment after a full billing cycle of quiet."],
   eff:"An hour or two per flow."},
  full:{nm:"Full — drop the work pool",when:"Once your flows run in Hydra and nothing depends on Prefect's UI or blocks.",
   steps:["Port remaining flows, keeping any genuinely custom Python in a <code>script</code> step.","Replace Prefect Blocks with Hydra secrets and connections.","Move alerting from Prefect notifications to your own channel via a workflow action.","Point dashboards at the Hydra API.","Shut down the agent and work pool; cancel the plan at the period boundary."],
   eff:"Days to weeks for a typical small-team setup."},
  map:[["@flow","workflow"],["@task","step"],["Deployment","manifest + trigger"],["cron in serve()","schedule"],["retries=","retry policy"],["Block","connection / secret"],["cache_key_fn","cache policy"],["Work pool / agent","the Hydra process"]],
  pitfalls:["<strong>Don't cancel your plan mid-cycle.</strong> Keep the deployment paused until you're certain.","<strong>Don't wrap every task in <code>script</code>.</strong> Most of them are a filter or an aggregate — use the real step.","<strong>Don't forget the notifications.</strong> Silent failures are worse than loud migrations.","<strong>Don't migrate flows with heavy custom Python first.</strong> They're the least favourable case."]},
 dbt:{reco:"partial",
  intro:"This is not a dbt replacement. Hydra takes over the scheduling half so you stop maintaining two dependency graphs — your models stay where they are.",
  partial:{nm:"Partial — Hydra orchestrates dbt",when:"Strongly recommended, and where most teams should stop.",
   steps:["Leave every model, test and exposure exactly as it is.","Replace the <code>BashOperator</code> that calls <code>dbt run</code> with a Hydra workflow step.","Declare your sources once in Hydra and pass them through instead of duplicating config.","Let Hydra own the schedule, retries and alerting for the dbt invocation.","Add pre-dbt ingestion steps to the same workflow so it's one graph again."],
   eff:"An afternoon. This is the cheapest win on this page."},
  full:{nm:"Full — move simple models into Hydra",when:"Only for file-to-file or single-source models that never needed the warehouse.",
   steps:["Find models that are a <code>where</code> plus a <code>group by</code> over one source — nothing more.","Rewrite those as Hydra steps and drop the intermediate warehouse table.","Keep anything with tests, exposures or freshness contracts in dbt. Don't fight this.","Compare outputs for a few cycles before deleting the model.","Accept that most of your project stays in dbt — that's the correct outcome."],
   eff:"Per-model, small. But the honest scope here is narrow."},
  map:[["model","job or step"],["ref()","depends_on"],["source","source"],["materialized: table","destination mode"],["dbt run schedule","trigger"],["profiles.yml","connections"],["tests","(keep in dbt)"],["exposures","(keep in dbt)"]],
  pitfalls:["<strong>Don't try to replace dbt.</strong> Its testing and documentation layer has no equivalent here — losing it is a real regression.","<strong>Don't move models that other models <code>ref()</code>.</strong> You'll break the graph you were trying to simplify.","<strong>Don't drop the warehouse table</strong> if a BI tool reads it directly.","<strong>Don't duplicate source definitions</strong> in both tools — that's the problem you came here to fix."]},
 databricks:{reco:"partial",
  intro:"Keep your compute. This is about moving the scheduling and sequencing out of the workspace so your pipeline definition is reviewable and portable.",
  partial:{nm:"Partial — orchestrate from outside",when:"Recommended. Notebooks and clusters stay exactly where they are.",
   steps:["Pick a job whose schedule you'd like in Git rather than in the workspace UI.","Declare it as a Hydra workflow step that triggers the Databricks job via its API.","Keep the notebook untouched — Hydra passes parameters in, waits, reads the status.","Add the surrounding steps (pre-checks, post-load, notification) to the same workflow.","Turn off the workspace schedule once Hydra has driven it successfully."],
   eff:"A morning for the first job."},
  full:{nm:"Full — move small jobs off Spark",when:"Only for jobs whose data volume never justified a cluster.",
   steps:["Measure real row counts. Anything comfortably under a few million rows is a candidate.","Rewrite those notebooks as Hydra jobs — the pandas-scale ones convert almost directly.","Leave everything genuinely Spark-scale in Databricks. Don't force it.","Compare outputs and, just as importantly, compare cost for a full month.","Reduce cluster autoscaling limits once the small jobs have left."],
   eff:"Days per job family. The savings come from cluster uptime, not developer time."},
  map:[["Job","workflow"],["Task","step"],["task depends_on","depends_on"],["quartz cron","schedule"],["job_cluster","(stays in Databricks)"],["widgets / parameters","step params"],["mount path","source / destination"],["notebook_task","script step or API call"]],
  pitfalls:["<strong>Don't migrate Spark-scale work.</strong> If the cluster is justified, keep it — Hydra orchestrates, it doesn't replace Spark.","<strong>Don't rewrite notebooks that data scientists actively edit.</strong> Orchestrate them instead.","<strong>Don't ignore egress</strong> if you move processing outside the cloud where the data lives.","<strong>Don't cut cluster limits early</strong> — verify a full month of runs first."]},
 airbyte:{reco:"partial",
  intro:"Airbyte's connector catalogue is its strength and Hydra doesn't match it. The gain here is having one graph and one retry policy instead of two control planes.",
  partial:{nm:"Partial — Hydra sequences your syncs",when:"Recommended. Keep every connector you have.",
   steps:["Leave your Airbyte sources, destinations and connections alone.","Turn off the schedule <em>inside</em> Airbyte for one connection.","Add a Hydra workflow step that triggers that sync and waits for completion.","Chain your transformation steps after it — one graph, one retry policy, one alert.","Repeat per connection, starting with the least critical."],
   eff:"An hour per connection."},
  full:{nm:"Full — native connectors for simple stacks",when:"Only if your sources are files, common databases or plain REST APIs.",
   steps:["List your connections. Anything exotic (SaaS APIs, niche warehouses) stays in Airbyte — permanently.","For the simple ones, declare the source directly in Hydra and skip the landing table.","Compare row counts and null rates against the Airbyte sync for several cycles.","Retire that Airbyte connection only after the comparison is clean.","Keep Airbyte installed for the connectors you didn't move."],
   eff:"Depends entirely on how exotic your sources are."},
  map:[["Source","source"],["Destination","destination"],["Connection","job"],["syncMode: full_refresh","mode: replace"],["incremental append","mode: append"],["incremental dedup","mode: upsert"],["cron schedule","trigger"],["normalization","transformation steps"]],
  pitfalls:["<strong>Don't try to replace the connector catalogue.</strong> For anything non-trivial, Airbyte wins and should stay.","<strong>Don't leave both schedules on.</strong> Double-syncing is the classic first-day mistake.","<strong>Don't drop the landing table</strong> if other consumers read the raw layer.","<strong>Don't skip null-rate comparison</strong> — connector semantics differ in the details."]}};

var ORDER=["airflow","dagster","prefect","dbt","databricks","airbyte","flowman","nifi"];
var cur="airflow",metric="loc";
var CTA_D="";
function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function hyLines(){return $("hyCode").value.split("\n").filter(function(l){return l.trim()&&l.trim()[0]!=="#";}).length;}
function hyVal(k){return k==="loc"?hyLines():HY[k];}

function renderTabs(){
  $("tabs").innerHTML=ORDER.map(function(k){var t=TOOLS[k];
    return "<button class='tab"+(k===cur?" on":"")+"' role='tab' aria-selected='"+(k===cur)+"' data-k='"+k+"'><span class='sq' style='background:"+t.col+"'></span>"+t.nm+"</button>";}).join("");
  document.querySelectorAll('.tab').forEach(function(b){b.onclick=function(){cur=b.dataset.k;renderAll();window.scrollTo({top:0,behavior:'smooth'});};});
}
/* DUEL stats — only rival vs Hydra */
function renderStats(){
  var t=TOOLS[cur];
  $("statsT").textContent=t.nm+" vs Hydra — head to head";
  $("statRows").innerHTML=METRICS.map(function(m){
    var a=t[m.k],b=hyVal(m.k),max=Math.max(a,b,1);
    var pct=a>0?Math.round((1-b/a)*100):0;
    var gain=b<a?"<div class='g'>−"+pct+"%</div><div class='gl'>"+(a-b)+" fewer</div>":
             b===a?"<div class='g flat'>same</div><div class='gl'>no change</div>":
                   "<div class='g flat'>+"+Math.abs(pct)+"%</div><div class='gl'>"+(b-a)+" more</div>";
    return "<div class='srow'><div class='lab'><div class='n'>"+m.nm+"</div><div class='h'>"+esc(m.h)+"</div></div>"+
      "<div class='barbox'>"+
        "<div class='bar r'><span class='who'>"+esc(t.nm)+"</span><span class='tr'><span class='fi' style='width:"+Math.max(a/max*100,7)+"%'>"+a+"</span></span></div>"+
        "<div class='bar h'><span class='who'>Hydra</span><span class='tr'><span class='fi' style='width:"+Math.max(b/max*100,7)+"%'>"+b+"</span></span></div>"+
      "</div><div class='gain'>"+gain+"</div></div>";}).join("");
  var sig=Math.round(t.logic/t.loc*100),h=hyLines();
  $("sigR").textContent=sig+"%";$("sigRd").innerHTML=esc(t.nm)+"<br>"+t.logic+" of "+t.loc+" lines";
  $("sigH").textContent="100%";$("sigHd").innerHTML="Hydra<br>"+h+" of "+h+" lines";
}
/* global chart — secondary, at the bottom */
function renderChart(){
  $("metricPick").innerHTML=METRICS.map(function(m){
    return "<button class='mp"+(m.k===metric?" on":"")+"' data-m='"+m.k+"'>"+m.nm+"</button>";}).join("");
  document.querySelectorAll('.mp').forEach(function(b){b.onclick=function(){metric=b.dataset.m;renderChart();};});
  var rows=ORDER.map(function(k){return {k:k,nm:TOOLS[k].nm,v:TOOLS[k][metric],col:TOOLS[k].col};});
  rows.push({k:"hydra",nm:"Hydra",v:hyVal(metric),col:"var(--accent)"});
  var max=Math.max.apply(null,rows.map(function(r){return r.v;}))||1;
  $("chartRows").innerHTML=rows.map(function(r){
    return "<div class='crow"+(r.k===cur?" me":"")+"'><span class='cn'><span class='sq' style='background:"+r.col+"'></span>"+r.nm+"</span>"+
      "<span class='ctr'><span class='cfi' style='width:"+Math.max(r.v/max*100,7)+"%;background:"+(r.k==="hydra"?"var(--accent)":"var(--rival)")+"'>"+r.v+"</span></span></div>";}).join("");
}
function renderOthers(){
  $("ocards").innerHTML=ORDER.filter(function(k){return k!==cur;}).map(function(k){var t=TOOLS[k];
    return "<button class='ocard' data-k='"+k+"' aria-label='Compare "+t.nm+" with Hydra'><span class='sq' style='background:"+t.col+"' aria-hidden='true'></span>"+
      "<span><span class='on'>"+t.nm+"</span><br><span class='ov'>"+t.loc+" lines → "+hyVal("loc")+" · "+(t.rel==="replace"?"replacement":"complement")+"</span></span><span class='oa' aria-hidden='true'>→</span></button>";}).join("");
  document.querySelectorAll('.ocard').forEach(function(b){b.onclick=function(){cur=b.dataset.k;renderAll();window.scrollTo({top:0,behavior:'smooth'});};});
}
function renderAll(){
  var t=TOOLS[cur];
  if(!CTA_D)CTA_D=$("ctaD").textContent;
  renderTabs();
  $("heroH").textContent=t.nm+" vs Hydra — the same pipeline";
  $("dRival").textContent=t.nm;$("dRivalDot").style.background=t.col;
  $("srcTitle").textContent=t.nm;$("srcFile").textContent=t.file;$("srcLoc").textContent=t.loc+" lines";
  $("srcCode").innerHTML=t.code;
  $("hyCode").value=HYDRA_JOB;$("hyLoc").textContent=hyLines()+" lines";
  $("ctaT").textContent="Now do it with your own "+t.nm+" "+t.unit;
  $("ctaBtnTool").textContent=t.nm;
  var hasDeep=t.deep!==false,hint=document.querySelector('.ctahint');
  $("deepBtn").hidden=!hasDeep;if(hint)hint.hidden=!hasDeep;
  $("ctaRoute").textContent=hasDeep?("/migrate/"+cur):"Guided tunnel — not published yet";
  $("ctaD").textContent=hasDeep?CTA_D:("The head-to-head above is complete for "+t.nm+". The guided tunnel that reads your own project is not published yet \u2014 \"Show me the transition\" already maps every entity.");
  $("deepBtn").setAttribute("aria-label","Assess my "+t.nm+" project — opens the "+t.nm+" to Hydra migration tunnel");
  $("relBadge").className="rel "+t.rel;$("relText").textContent=t.relText;$("relNote").textContent=t.relNote;
  $("painLab").textContent="Why the numbers look like that in "+t.nm;
  $("painList").innerHTML=t.pain.map(function(p){return "<li>"+p+"</li>";}).join("");
  $("fixList").innerHTML=t.fix.map(function(p){return "<li>"+p+"</li>";}).join("");
  renderStats();renderChart();renderOthers();
}
var runTrap;
function openModal(){var m=$("modal");m.classList.add('open');$("modalTitle").focus();
  if(!runTrap)runTrap=trap(m);m.addEventListener('keydown',runTrap);}
function closeModal(){var m=$("modal");if(!m.classList.contains('open'))return;
  m.classList.remove('open');if(runTrap)m.removeEventListener('keydown',runTrap);$("runBtn").focus();}
/* transition tips */
function stratHTML(s,n,reco){
  return "<div class='strat"+(reco?" reco":"")+"'><div class='ph'>Phase "+n+"</div>"+
    "<div class='sh'><span class='sn'>"+s.nm+"</span></div>"+
    (reco?"<span class='rb'>Recommended starting point</span>":"<span class='later'>After Phase 1 is validated</span>")+
    "<div class='sw'>"+s.when+"</div>"+
    "<ol>"+s.steps.map(function(x){return "<li>"+x+"</li>";}).join("")+"</ol>"+
    "<div class='eff'><strong>Effort:</strong> "+s.eff+"</div></div>";
}
function renderTips(){
  var t=TOOLS[cur],p=TIPS[cur];
  $("tipsTitle").textContent=t.nm+" → Hydra — how to transition";
  $("tipsIntro").textContent=p.intro;
  $("strats").innerHTML=stratHTML(p.partial,1,p.reco==="partial")+
    "<div class='progarrow' aria-hidden='true'><span class='ln'></span><span class='ar'>→</span><span class='tx'>then, if it holds</span><span class='ln'></span></div>"+
    stratHTML(p.full,2,p.reco==="full");
  $("mapCount").textContent="("+p.map.length+" concepts)";
  $("mapTbl").innerHTML="<tr><th>"+t.nm+"</th><th>Hydra</th></tr>"+
    p.map.map(function(r){return "<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>";}).join("");
  $("pitfalls").innerHTML=p.pitfalls.map(function(x){return "<li>"+x+"</li>";}).join("");
}
/* scroll shadow: only when content remains below */
function syncCue(body,foot){
  var more=body.scrollHeight-body.scrollTop-body.clientHeight>8;
  foot.classList.toggle('more',more);
}
/* focus trap */
var FOCUSABLE='button,[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
function trap(modal){return function(e){
  if(e.key!=='Tab')return;
  var f=Array.prototype.filter.call(modal.querySelectorAll(FOCUSABLE),function(el){return el.offsetParent!==null;});
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};}
var tipsTrap=trap($("tipsModal"));
function openTips(){
  renderTips();
  var m=$("tipsModal"),b=m.querySelector('.modal-b'),f=$("tipsFoot");
  m.classList.add('open');
  $("tipsTitle").focus();
  b.scrollTop=0;syncCue(b,f);
  b.addEventListener('scroll',function(){syncCue(b,f);});
  m.addEventListener('keydown',tipsTrap);
}
function closeTips(){var m=$("tipsModal");m.classList.remove('open');m.removeEventListener('keydown',tipsTrap);$("tipsBtn").focus();}
/* simulated engine */
function parse(dsl){var steps=[];dsl.split(/-\s+(?=\w+:)/).slice(1).forEach(function(b){
  var op=(b.match(/^(\w+):/)||[])[1];if(!op)return;var s={op:op};
  if(op==="filter"){var e=b.match(/expr:\s*([^\n]+)/);s.expr=e?e[1].trim():"";}
  if(op==="aggregate"){var by=b.match(/by:\s*\[([^\]]*)\]/);s.by=by?by[1].split(",").map(function(x){return x.trim();}).filter(Boolean):[];
    s.agg=[];var r=/(\w+):\s*\{\s*func:\s*(\w+),\s*col:\s*(\w+)\s*\}/g,mm;while(mm=r.exec(b))s.agg.push({out:mm[1],func:mm[2],col:mm[3]});}
  if(op==="sort"){var b2=b.match(/by:\s*\[([^\]]*)\]/);s.by=b2?b2[1].split(",").map(function(x){return x.trim();}).filter(Boolean):[];s.asc=/ascending:\s*true/.test(b);}
  steps.push(s);});return steps;}
function evalExpr(row,expr){var m=expr.match(/^([a-zA-Z_]\w*)\s*(>=|<=|==|!=|>|<)\s*(.+)$/);if(!m)return true;
  var a=row[m[1]],raw=m[3].trim().replace(/^['"]|['"]$/g,""),b=isNaN(Number(raw))?raw:Number(raw);
  return {">":a>b,"<":a<b,">=":a>=b,"<=":a<=b,"==":a==b,"!=":a!=b}[m[2]];}
function run(){
  var steps=parse($("hyCode").value),rows=ORDERS.slice(),cols=["order_id","customer_id","amount","status"],log=[],bad=null;
  log.push("<span class='cmd'>$ hdrctl run job.yaml</span>");
  log.push("<span class='ok'>✓</span> source     orders (csv) → "+rows.length+" rows");
  steps.forEach(function(s){if(bad)return;
    if(s.op==="filter"){var col=(s.expr.match(/^([a-zA-Z_]\w*)/)||[])[1];
      if(col&&cols.indexOf(col)<0){bad="unknown column '"+col+"' in filter";return;}
      rows=rows.filter(function(r){return evalExpr(r,s.expr);});
      log.push("<span class='ok'>✓</span> filter     "+esc(s.expr)+" → "+rows.length+" rows");}
    else if(s.op==="aggregate"){var b2=s.by.filter(function(c){return cols.indexOf(c)<0;});
      if(b2.length){bad="unknown group column '"+b2[0]+"'";return;}
      var g={};rows.forEach(function(r){var k=s.by.map(function(c){return r[c];}).join("|");(g[k]=g[k]||[]).push(r);});
      rows=Object.keys(g).map(function(k){var grp=g[k],o={};s.by.forEach(function(c,i){o[c]=k.split("|")[i];});
        s.agg.forEach(function(a){var v=grp.map(function(r){return Number(r[a.col]);});
          o[a.out]=a.func==="sum"?v.reduce(function(x,y){return x+y;},0):a.func==="count"?grp.length:
                   a.func==="avg"?Math.round(v.reduce(function(x,y){return x+y;},0)/grp.length):
                   a.func==="min"?Math.min.apply(null,v):Math.max.apply(null,v);});return o;});
      cols=s.by.concat(s.agg.map(function(a){return a.out;}));
      log.push("<span class='ok'>✓</span> aggregate  by "+s.by.join(", ")+" → "+rows.length+" groups");}
    else if(s.op==="sort"){var k=s.by[0],d=s.asc?1:-1;rows.sort(function(a,b){return a[k]>b[k]?d:a[k]<b[k]?-d:0;});
      log.push("<span class='ok'>✓</span> sort       "+k+(s.asc?" asc":" desc"));}});
  var t=TOOLS[cur];
  $("modalTitle").textContent="Hydra job — run result";
  if(bad){
    $("state").className="state err";$("state").textContent="validation failed";
    $("term").innerHTML=log.join("\n")+"\n<span class='er'>✗ "+esc(bad)+"</span>\n<span class='mut'># available: order_id, customer_id, amount, status</span>";
    $("resLab").textContent="Result set — none";
    $("resTable").innerHTML="<tr><td style='color:var(--text-mut);font-family:var(--sans)'>The job did not run. Fix the step above and try again.</td></tr>";
    $("modalFoot").innerHTML="Validation caught this <strong>before</strong> any row was read — in "+t.nm+" this would surface at runtime.";
    openModal();return;}
  log.push("<span class='ok'>✓</span> destination report (csv, replace) ← "+rows.length+" rows   <span class='mut'>"+(3+steps.length)+" ms</span>");
  $("state").className="state ok";$("state").textContent="success · "+rows.length+" rows";
  $("term").innerHTML=log.join("\n");
  $("resLab").textContent="Result set — "+rows.length+" row"+(rows.length===1?"":"s")+" written";
  $("resTable").innerHTML="<tr>"+cols.map(function(c){return "<th>"+c+"</th>";}).join("")+"</tr>"+
    rows.map(function(r){return "<tr>"+cols.map(function(c){return "<td>"+esc(r[c])+"</td>";}).join("")+"</tr>";}).join("");
  $("modalFoot").innerHTML="Ran in your browser on 14 sample rows — nothing uploaded. Same job would run unchanged from the CLI, the API or Studio.";
  openModal();
}
$("runBtn").onclick=run;
$("resetBtn").onclick=function(){$("hyCode").value=HYDRA_JOB;$("hyLoc").textContent=hyLines()+" lines";renderStats();renderChart();};
$("hyCode").addEventListener('input',function(){$("hyLoc").textContent=hyLines()+" lines";renderStats();renderChart();});
$("modalX").onclick=closeModal;$("modalClose2").onclick=closeModal;
$("modal").onclick=function(e){if(e.target===this)closeModal();};
$("modalDeep").onclick=function(){closeModal();$("deepBtn").click();};
$("tipsBtn").onclick=openTips;
$("tipsX").onclick=closeTips;$("tipsClose2").onclick=closeTips;
$("tipsModal").onclick=function(e){if(e.target===this)closeTips();};
$("tipsDeep").onclick=function(){closeTips();$("deepBtn").click();};
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;
  if($("tipsModal").classList.contains('open'))closeTips();else closeModal();});
$("deepBtn").onclick=function(){window.location.href="/migrate/"+cur;};
/* mobile nav: open, close, focus restore */
function setDrawer(open){var d=$("drawer");d.classList.toggle('open',open);$("burger").setAttribute('aria-expanded',open);
  if(open){var a=d.querySelector('a');if(a)a.focus();}else{$("burger").focus();}}
$("burger").onclick=function(){setDrawer(!$("drawer").classList.contains('open'));};
$("drawer").querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setDrawer(false);});});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$("drawer").classList.contains('open'))setDrawer(false);},true);
document.addEventListener('click',function(e){var d=$("drawer");
  if(d.classList.contains('open')&&!d.contains(e.target)&&e.target!==$("burger")&&!$("burger").contains(e.target))setDrawer(false);});
/* theme, persisted like the other pages */
$("themeBtn").onclick=function(){var h=document.documentElement,next=h.getAttribute('data-theme')==='dark'?'light':'dark';
  h.setAttribute('data-theme',next);localStorage.setItem("hydra-theme",next);};
var savedTheme=localStorage.getItem("hydra-theme");if(savedTheme)document.documentElement.setAttribute("data-theme",savedTheme);
renderAll();
/* seconde mesure une fois les polices posées, pour une hauteur exacte */
if(window.requestAnimationFrame)requestAnimationFrame(function(){autoSize('srcCode');autoSize('hyCode');});
/* ================= NOYAU : ICONES DE VOLET + DEUX MENUS CONTEXTUELS =================
   Portés des tunnels /migrate/*. Charte r.9 : les icônes agissent sur le volet
   entier, le menu contextuel agit sur ce qui est sous le curseur.
   Charte r.3 : ce qui n'est pas traduit est affiché, jamais omis. */

var OPDOC={
 filter:'Keeps the rows matching params.expr. Column names are used bare — validate checks they exist before the run.',
 aggregate:'Groups by the listed columns and applies the agg functions.',
 sort:'Orders rows — kept explicit because it decides what any downstream limit returns.',
 select:'Keeps only the listed columns, in that order.',
 rename:'Renames columns. A missing source column fails validate, not the run.',
 cast:'Changes dtypes. A bad cast fails loudly instead of turning into NaN.',
 deduplicate:'Drops duplicate rows. keys narrows what counts as duplicate.',
 fill_null:'Replaces nulls, per column or across the frame.'};

/* rôle de chaque ligne YAML, pour l'explication */
var YROLE={1:'manifest version',2:'pipeline block',3:'job name',4:'source connector',5:'destination connector',
 6:'trigger',7:'steps block',8:'filter step',9:'filter expression',10:'aggregate step',11:'group keys',
 12:'agg block',13:'aggregation',14:'sort step',15:'sort keys',16:'sort direction'};

var MENU=$("menu"),POP=$("pop"),MI=[],LASTF=null,TOASTT=null,IGN={},SEL=null,PROVON=false;

function toast(msg,isErr){var t=$("toast");t.textContent=msg;t.className="toast show"+(isErr?" err":"");
  clearTimeout(TOASTT);TOASTT=setTimeout(function(){t.className="toast";},2400);}
function trunc(s,n){s=String(s||'').trim();return s.length>n?s.slice(0,n-1)+'…':s;}
function srcText(){var e=$("srcCode");return (e.value!==undefined&&e.value!==null)?e.value:(e.textContent||'');}
function srcLines(){return srcText().split('\n');}
function baseYaml(){return HYDRA_JOB.split('\n');}

/* ---------------- menu : moteur ---------------- */
function closeMenu(back){MENU.classList.remove('open');MENU.innerHTML='';MI=[];
  if(back&&LASTF&&LASTF.focus)LASTF.focus();}
function openMenu(x,y,items,head){
  LASTF=document.activeElement;MI=items;
  MENU.innerHTML=(head?'<div class="hd">'+esc(head)+'</div>':'')+items.map(function(it,i){
    return it==='-'?'<hr>':'<button role="menuitem" data-i="'+i+'"'+(it.off?' disabled':'')+
      (it.why?' title="'+esc(it.why)+'"':'')+'>'+esc(it.t)+(it.k?'<span class="k">'+esc(it.k)+'</span>':'')+'</button>';}).join('');
  MENU.classList.add('open');MENU.style.left='0px';MENU.style.top='0px';
  var r=MENU.getBoundingClientRect();
  MENU.style.left=Math.max(6,Math.min(x,innerWidth-r.width-8))+'px';
  MENU.style.top=Math.max(6,Math.min(y,innerHeight-r.height-8))+'px';
  var f=MENU.querySelector('button:not([disabled])');if(f)f.focus();}
MENU.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('button[data-i]'):null;
  if(!b)return;var it=MI[+b.getAttribute('data-i')];closeMenu();if(it&&it.f)it.f();});
MENU.addEventListener('keydown',function(e){
  var bs=[].slice.call(MENU.querySelectorAll('button:not([disabled])')),i=bs.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){e.preventDefault();bs[(i+1)%bs.length].focus();}
  else if(e.key==='ArrowUp'){e.preventDefault();bs[(i-1+bs.length)%bs.length].focus();}
  else if(e.key==='Escape'){e.preventDefault();closeMenu(1);}});
document.addEventListener('mousedown',function(e){
  if(MENU.classList.contains('open')&&!MENU.contains(e.target))closeMenu();
  if(POP.classList.contains('open')&&!POP.contains(e.target)&&!MENU.contains(e.target))closePop();});
window.addEventListener('scroll',function(){if(MENU.classList.contains('open'))closeMenu();},true);
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;
  if(MENU.classList.contains('open')){e.preventDefault();closeMenu(1);}
  else if(POP.classList.contains('open')){e.preventDefault();closePop();}});

/* ---------------- popover ---------------- */
function closePop(){POP.classList.remove('open');if(LASTF&&LASTF.focus)LASTF.focus();}
$("popX").onclick=closePop;
function pop(tag,title,html,x,y){
  $("popTag").textContent=tag;$("popT").textContent=title;$("popB").innerHTML=html;
  POP.classList.add('open');POP.style.left='0px';POP.style.top='0px';
  var r=POP.getBoundingClientRect();
  POP.style.left=Math.max(8,Math.min((x||120),innerWidth-r.width-10))+'px';
  POP.style.top=Math.max(8,Math.min((y||120),innerHeight-r.height-10))+'px';
  $("popX").focus();}

/* ---------------- sélection native = surlignage ---------------- */
function selectTaLines(from,to){
  var ta=$("hyCode"),ls=ta.value.split('\n'),a=0,b=0;
  ls.forEach(function(l,i){var n=i+1;if(n<from)a+=l.length+1;if(n<=to)b+=l.length+(n<ls.length?1:0);});
  ta.focus();ta.setSelectionRange(a,Math.max(a,b));}
function selectSrcLine(n){
  var ta=$("srcCode"),ls=ta.value.split('\n');
  if(n<1||n>ls.length)return false;
  var a=0;for(var i=0;i<n-1;i++)a+=ls[i].length+1;
  ta.focus();ta.setSelectionRange(a,a+ls[n-1].length);
  var cs=getComputedStyle(ta),lh=parseFloat(cs.lineHeight)||19;
  var r=ta.getBoundingClientRect(),y=r.top+window.pageYOffset+(n-1)*lh;
  if(y<window.pageYOffset||y>window.pageYOffset+window.innerHeight-80)
    window.scrollTo({top:Math.max(0,y-window.innerHeight/2),behavior:'smooth'});
  markGut('gutA',n);
  return true;}
function markGut(gid,n){
  var g=$(gid);[].forEach.call(g.children,function(b,i){b.className=(i+1===n)?'on':'';});
  setTimeout(function(){[].forEach.call(g.children,function(b){b.className='';});},2200);}
/* ---------------- provenance ---------------- */
function yamlFrom(srcLine){var m=provMap(),out=[];
  for(var y in m)if(m[y]===srcLine)out.push(+y);
  return out.sort(function(a,b){return a-b;});}
function srcFrom(yLine){return provMap()[yLine]||null;}
function mappedSrcLines(){var m=provMap(),o={};for(var y in m)o[m[y]]=1;
  return Object.keys(o).map(Number).sort(function(a,b){return a-b;});}

/* classification honnête d'une ligne sans traduction — charte r.3 */
function noCounterpart(txt){
  var t=(txt||'').trim();
  if(!t)return 'Empty line — nothing to translate.';
  if(/^(#|--|\/\/)/.test(t))return 'Comment — kept out of the manifest on purpose.';
  if(/^(import|from)\s/.test(t))return 'Import — framework plumbing. Hydra ships the engine, so there is nothing to import.';
  if(/^@|^with\s+DAG|^def\s|dag\s*=|Definitions\(|serve\(|BashOperator|Operator\(|flow\(|task\(/.test(t))
    return 'Framework scaffolding — the engine provides this, so it has no counterpart in the manifest.';
  if(/^[\{\}\[\]\),]+$/.test(t))return 'Syntax only — closing punctuation.';
  return 'The mapper found nothing here. That is expected for configuration the engine already covers.';}

/* ---------------- manifeste dérivé des lignes ignorées ---------------- */
function ignCount(){return Object.keys(IGN).filter(function(k){return IGN[k];}).length;}
function buildYaml(){
  var base=baseYaml(),m=provMap(),keep=[];
  base.forEach(function(l,i){
    var y=i+1,s=m[y];
    if(s&&IGN[s])return;                                   /* ligne issue d'une source ignorée */
    if(SEL&&SEL.length&&s&&SEL.indexOf(s)<0)return;          /* traduction limitée à la sélection */
    keep.push(l);});
  return keep.join('\n');}
function retranslate(msg){
  $("hyCode").value=buildYaml();
  $("hyLoc").textContent=hyLines()+" lines";
  renderStats();renderChart();validate(1);refreshIgnBadge();
  if(msg)toast(msg);}
function refreshIgnBadge(){
  var n=ignCount(),b=$("icIgn");
  b.style.display=n?'grid':'none';$("icIgnN").textContent=n;
  b.setAttribute('data-tip',n+' ignored line'+(n>1?'s':'')+' — click to restore');}

/* ================= VALIDATION REELLE =================
   Analyseur structurel : indentation, tabulations, paires clef/valeur,
   étapes connues, paramètres requis, colonnes existantes. */

var OPREQ={filter:['expr'],aggregate:['by','agg'],sort:['by'],select:['columns'],
 rename:['columns'],cast:['columns'],deduplicate:[],fill_null:[],trim:[]};
var COLS=["order_id","customer_id","amount","status"];

function scopeOf(stack){
  return stack.map(function(f){return f.ind+'#'+(f.item||0);}).join('/');
}
function yamlLint(text){
  var out=[],lines=text.split('\n');
  var stack=[{ind:-1,child:true,key:'(root)',n:0,item:0}];
  var seen={},steps=[],inSteps=false,stepsInd=-1,firstStepInd=null;

  lines.forEach(function(raw,i){
    var n=i+1;
    if(!raw.trim())return;
    var lead=raw.match(/^[ \t]*/)[0];
    if(lead.indexOf('\t')>=0){out.push({n:n,s:'err',m:'tab in the indentation — YAML forbids tabs, use spaces'});return;}
    var ind=lead.length,body=raw.trim();
    if(body.charAt(0)==='#')return;

    var top=stack[stack.length-1];
    if(ind>top.ind){
      if(!top.child)
        out.push({n:n,s:'err',m:'unexpected indentation — "'+top.key+'" on line '+top.n+' already has a value'});
      stack.push({ind:ind,child:false,key:body.split(':')[0].replace(/^-\s*/,''),n:n,item:0});
    }else{
      while(stack.length>1&&ind<stack[stack.length-1].ind)stack.pop();
      if(ind!==stack[stack.length-1].ind){
        var open=stack.map(function(f){return f.ind;}).filter(function(x){return x>=0;});
        out.push({n:n,s:'err',m:'bad indentation ('+ind+' spaces) — does not line up with any open level ('+open.join(', ')+')'});
        stack.push({ind:ind,child:false,key:body.split(':')[0],n:n,item:0});
      }else{
        var t2=stack[stack.length-1];
        t2.key=body.split(':')[0].replace(/^-\s*/,'');t2.n=n;t2.child=false;
      }
    }
    if(ind%2)out.push({n:n,s:'warn',m:'odd indentation ('+ind+' spaces) — the manifest uses steps of 2'});

    var item=/^-\s/.test(body),kv=body.replace(/^-\s*/,'');
    var cur2=stack[stack.length-1];
    if(item)cur2.item=(cur2.item||0)+1;          /* chaque élément de liste = sa propre portée */

    if(kv&&kv.indexOf(':')<0){
      out.push({n:n,s:'err',m:'not a "key: value" pair — missing colon'});
    }else if(kv){
      var key=kv.slice(0,kv.indexOf(':')).trim(),val=kv.slice(kv.indexOf(':')+1).trim();
      if(!key)out.push({n:n,s:'err',m:'empty key before the colon'});
      if(key&&/\s/.test(key)&&key.charAt(0)!=='"')out.push({n:n,s:'warn',m:'key "'+key+'" contains a space'});
      cur2.child=(val==='');
      var path=scopeOf(stack)+':'+key;
      if(seen[path])out.push({n:n,s:'err',m:'duplicate key "'+key+'" — already set on line '+seen[path]});
      else seen[path]=n;

      if(key==='steps'){inSteps=true;stepsInd=ind;firstStepInd=null;}
      else if(inSteps&&item&&ind>stepsInd){
        if(firstStepInd===null)firstStepInd=ind;
        else if(ind!==firstStepInd)
          out.push({n:n,s:'err',m:'step list item is indented '+ind+' spaces — the first step uses '+firstStepInd});
        steps.push({n:n,op:key,ind:ind,params:{}});
      }
      else if(inSteps&&steps.length&&!item&&ind>steps[steps.length-1].ind)
        steps[steps.length-1].params[key]=(val===''?true:val);
      else if(inSteps&&!item&&ind<=stepsInd)inSteps=false;
    }
  });

  [['version','version: "1.0"'],['pipeline','pipeline:']].forEach(function(k){
    if(!new RegExp('^'+k[0]+'\\s*:','m').test(text))out.push({n:1,s:'err',m:'missing top-level "'+k[1]+'"'});});
  if(!/^\s*steps\s*:/m.test(text))out.push({n:1,s:'err',m:'missing "steps:" block'});
  else if(!steps.length)out.push({n:1,s:'err',m:'"steps:" is empty — nothing to run'});

  steps.forEach(function(st){
    if(!OPREQ.hasOwnProperty(st.op)){
      out.push({n:st.n,s:'err',m:'unknown step "'+st.op+'" — known: '+Object.keys(OPREQ).join(', ')});return;}
    OPREQ[st.op].forEach(function(p){
      if(!st.params.hasOwnProperty(p))out.push({n:st.n,s:'err',m:'"'+st.op+'" needs "'+p+':"'});});
    if(st.op==='filter'&&typeof st.params.expr==='string'){
      var c=(st.params.expr.match(/^([a-zA-Z_]\w*)/)||[])[1];
      if(c&&COLS.indexOf(c)<0)out.push({n:st.n,s:'err',m:'unknown column "'+c+'" — available: '+COLS.join(', ')});
      if(!/[<>=!]/.test(st.params.expr))out.push({n:st.n,s:'warn',m:'filter expression has no comparison operator'});}
    if(st.op==='aggregate'&&typeof st.params.by==='string'){
      var by=(st.params.by.match(/\[([^\]]*)\]/)||[,''])[1].split(',').map(function(x){return x.trim();}).filter(Boolean);
      if(!by.length)out.push({n:st.n,s:'err',m:'"aggregate" has an empty "by:" list'});
      by.forEach(function(c){if(COLS.indexOf(c)<0)out.push({n:st.n,s:'err',m:'unknown group column "'+c+'"'});});}
  });
  out.sort(function(a,b){return a.n-b.n;});
  return out;
}

function issueHTML(list,total){
  if(!list.length)return '<p>No problem found. '+total+' lines checked — indentation, key pairs, step names, required params and column names.</p>';
  return '<p>'+list.filter(function(x){return x.s==='err';}).length+' error(s), '+
    list.filter(function(x){return x.s==='warn';}).length+' warning(s) on '+total+' lines.</p><table>'+
    list.map(function(x){return '<tr><td class="k">L'+x.n+'</td><td class="k">'+
      (x.s==='err'?'error':'warning')+'</td><td>'+esc(x.m)+'</td></tr>';}).join('')+'</table>';
}

function validate(quiet,x,y){
  var ic=$("icVal"),v=$("hyCode").value,list=yamlLint(v);
  var errs=list.filter(function(i){return i.s==='err';});
  ic.className='ic2 '+(errs.length?'sev-err':(list.length?'sev-warn':'sev-ok'));
  ic.setAttribute('data-tip',errs.length?(errs.length+' error(s) — line '+errs[0].n):
    (list.length?(list.length+' warning(s)'):'Valid manifest'));
  if(!quiet){
    pop('validate','job.yaml — validation',issueHTML(list,v.split('\n').length),x,y);
    toast(errs.length?(errs.length+' error(s) — first on line '+errs[0].n):
      (list.length?(list.length+' warning(s)'):'Manifest is valid'),!!errs.length);
  }
  return !errs.length;
}

/* --------- validation de la source : scanner à état, chaînes et commentaires --------- */
function srcLint(){
  var lines=srcLines(),out=[],clean=[];
  var pairs={'(':')','[':']','{':'}'},close={')':'(',']':'[','}':'{'},stack=[];
  var triple=null,tripleStart=0;

  /* passe 1 : délimiteurs, chaînes, commentaires — et version « nettoyée » de chaque ligne */
  lines.forEach(function(l,i){
    var n=i+1,q=null,k=0,buf='';
    while(k<l.length){
      var c=l.charAt(k),three=l.substr(k,3),two=l.substr(k,2);
      if(triple){if(three===triple){triple=null;k+=3;}else k++;buf+=' ';continue;}
      if(q){if(c==='\\'){k+=2;buf+='  ';continue;}if(c===q)q=null;k++;buf+=' ';continue;}
      if(three==='"""'||three==="'''"){triple=three;tripleStart=n;k+=3;buf+='   ';continue;}
      if(c==='"'||c==="'"){q=c;k++;buf+=' ';continue;}
      if(c==='#'||two==='//'||two==='--')break;
      if(pairs[c])stack.push({c:c,n:n});
      else if(close[c]){
        if(!stack.length)out.push({n:n,s:'err',m:'closing "'+c+'" with nothing open'});
        else if(stack[stack.length-1].c!==close[c])
          out.push({n:n,s:'err',m:'"'+c+'" closes "'+stack[stack.length-1].c+'" opened on line '+stack[stack.length-1].n});
        else stack.pop();
      }
      buf+=c;k++;
    }
    if(q)out.push({n:n,s:'warn',m:'unterminated '+q+' string on this line'});
    if(/\t/.test(l.match(/^[ \t]*/)[0]))out.push({n:n,s:'warn',m:'tab in the indentation'});
    clean.push(buf);
  });
  if(triple)out.push({n:tripleStart,s:'err',m:'triple-quoted string opened here is never closed'});
  stack.forEach(function(o){out.push({n:o.n,s:'err',m:'"'+o.c+'" opened here is never closed'});});

  /* passe 2 : instructions Python — formes sans ambiguïté uniquement */
  var BLOCK=/^(def|class|if|elif|else|for|while|with|try|except|finally|match|case|async)\b/;
  var defs={};
  clean.forEach(function(c,i){
    var n=i+1,body=c.trim();
    if(!body)return;
    var dm=/^def\s+(\w+)\s*\(/.exec(body);if(dm)defs[dm[1]]=n;

    /* a) appel suivi de « : » sans mot-clé de bloc — le « def » oublié */
    if(/\)\s*:$/.test(body)&&!BLOCK.test(body)&&!/^[\[{]/.test(body)){
      var nm=(/^(\w+)\s*\(/.exec(body)||[])[1];
      out.push({n:n,s:'err',m:'"'+(nm||body.slice(0,18))+'(...)" ends with ":" but has no block keyword — missing "def"?'});
    }
    /* b) ouverture de bloc sans corps indenté */
    if(/:$/.test(body)&&BLOCK.test(body)){
      var ind=c.search(/\S/),j=i+1,found=false;
      while(j<clean.length){
        var nx=clean[j];
        if(nx.trim()){if(nx.search(/\S/)>ind)found=true;break;}
        j++;
      }
      if(!found)out.push({n:n,s:'err',m:'"'+body.split(/\s/)[0]+'" block on this line has no indented body'});
    }
  });

  /* c) référence à une fonction jamais définie */
  clean.forEach(function(c,i){
    var r=/python_callable\s*=\s*(\w+)/g,m2;
    while(m2=r.exec(c)){
      if(!defs[m2[1]])out.push({n:i+1,s:'err',m:'python_callable references "'+m2[1]+'", which is not defined in this file'});
    }
  });

  var need=[['source','from'],['filter','filter'],['group by','aggby'],['aggregation','agg'],
            ['sort','sort'],['destination','to'],['schedule','schedule']];
  var YL={from:[4],filter:[8,9],aggby:[10,11],agg:[12,13],sort:[14,15,16],to:[5],schedule:[6]};
  var m=provMap(),covered={};
  for(var yl in m)covered[m[yl]]=1;
  var found=[],missing=[];
  need.forEach(function(p){
    var sl=null;YL[p[1]].forEach(function(y){if(!sl&&m[y])sl=m[y];});
    if(sl)found.push([p[0],sl,lines[sl-1]]);else missing.push(p[0]);
  });
  out.sort(function(a,b){return a.n-b.n;});
  return {issues:out,found:found,missing:missing,total:lines.length,mapped:Object.keys(covered).length};
}
function runSrcLint(x,y){
  var r=srcLint(),errs=r.issues.filter(function(i){return i.s==='err';}),ic=$("icLint");
  ic.className='ic2 '+(errs.length?'sev-err':(r.issues.length?'sev-warn':'sev-ok'));
  ic.setAttribute('data-tip',errs.length?(errs.length+' syntax error(s)'):
    (r.issues.length?(r.issues.length+' warning(s)'):'Syntax and structure check out'));
  var html='<p><strong>Syntax</strong> — '+(errs.length?(errs.length+' error(s)'):'balanced delimiters, no unterminated string')+
    ' on '+r.total+' lines.</p>';
  if(r.issues.length)html+='<table>'+r.issues.slice(0,12).map(function(i){
    return '<tr><td class="k">L'+i.n+'</td><td class="k">'+(i.s==='err'?'error':'warning')+'</td><td>'+esc(i.m)+'</td></tr>';}).join('')+'</table>';
  html+='<p><strong>What the translator recognises</strong> — '+r.found.length+' of '+(r.found.length+r.missing.length)+' constructs.</p><table>'+
    r.found.map(function(f){return '<tr><td class="k">'+esc(f[0])+'</td><td class="k">L'+f[1]+'</td><td>'+esc(trunc(f[2],38))+'</td></tr>';}).join('')+
    r.missing.map(function(mm){return '<tr><td class="k">'+esc(mm)+'</td><td class="k">—</td><td class="none">not found</td></tr>';}).join('')+'</table>';
  html+='<p>'+r.mapped+' of '+r.total+' source lines carry the intent. The rest is scaffolding the engine already provides.</p>';
  pop('check',TOOLS[cur].file+' — check',html,x,y);
  toast(errs.length?(errs.length+' syntax error(s) — line '+errs[0].n):
    (r.missing.length?(r.missing.length+' construct(s) not recognised'):('Syntax valid — '+r.found.length+' constructs recognised')),!!errs.length);
}

/* ---------------- blocs YAML ---------------- */
function blockAt(n){
  var ls=$("hyCode").value.split('\n');if(n<1||n>ls.length)return null;
  var ind=function(l){return l.search(/\S/);};
  var i=n-1;while(i>0&&!/^\s*-\s+\w+:/.test(ls[i]))i--;
  if(!/^\s*-\s+\w+:/.test(ls[i]))return null;
  var name=(ls[i].match(/-\s+(\w+):/)||[])[1],base=ind(ls[i]),j=i+1;
  while(j<ls.length&&(ls[j].trim()===''||ind(ls[j])>base))j++;
  return {name:name,a:i+1,b:j,txt:ls.slice(i,j).join('\n')};}

/* ---------------- actions ---------------- */
function cpy(s,label){
  function ok(){toast((label||'Copied')+' copied');}function ko(){toast('Copy blocked by the browser',1);}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(ok,ko);
  else{try{var ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);ok();}catch(_){ko();}}}
function download(name,content){
  try{var b=new Blob([content],{type:'text/plain;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');
    a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(function(){URL.revokeObjectURL(u);},1500);toast(name+' downloaded');}
  catch(_){toast('Download blocked by the browser',1);}}

function explainLine(n,x,y){
  var ls=srcLines(),txt=ls[n-1]||'',ys=yamlFrom(n),base=baseYaml();
  var html='<p><strong>Line '+n+'</strong> — <code>'+esc(trunc(txt,64))+'</code></p>';
  if(ys.length){
    html+='<p>Produced '+ys.length+' manifest line'+(ys.length>1?'s':'')+':</p><pre>'+
      esc(ys.map(function(y){return String(y).padStart(2,' ')+'  '+base[y-1];}).join('\n'))+'</pre>'+
      '<p>Role: '+esc(ys.map(function(y){return YROLE[y];}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', '))+'.</p>';
  }else{
    html+='<p class="none">No counterpart in the manifest.</p><p>'+esc(noCounterpart(txt))+'</p>';}
  if(IGN[n])html+='<p class="none">This line is currently ignored.</p>';
  pop('line','L'+n+' — '+TOOLS[cur].nm,html,x,y);}

function showProduced(n){
  var ys=yamlFrom(n);
  if(!ys.length){toast('Line '+n+' produced nothing — '+trunc(noCounterpart(srcLines()[n-1]),46),1);return;}
  selectTaLines(ys[0],ys[ys.length-1]);
  toast(ys.length+' manifest line'+(ys.length>1?'s':'')+' highlighted (L'+ys[0]+'–L'+ys[ys.length-1]+')');}

function toggleProv(){
  PROVON=!PROVON;var b=$("icProv");
  b.classList.toggle('on',PROVON);b.setAttribute('aria-pressed',String(PROVON));
  if(PROVON){var m=mappedSrcLines();
    pop('provenance','Provenance — '+TOOLS[cur].nm,
      '<p>Each manifest line and the source line it came from.</p><table>'+
      Object.keys(provMap()).sort(function(a,b){return a-b;}).map(function(y){
        return '<tr><td class="k">yaml L'+y+'</td><td class="k">src L'+provMap()[y]+'</td><td>'+esc(trunc(srcLines()[provMap()[y]-1],40))+'</td></tr>';
      }).join('')+'</table><p>'+m.length+' source lines out of '+srcLines().length+
      ' carry the intent. The rest is scaffolding the engine already provides.</p>',null,90);
  }else closePop();}

function preview(x,y){
  var steps=parse($("hyCode").value),rows=ORDERS.slice(),cols=["order_id","customer_id","amount","status"],log=[];
  log.push(['source orders (csv)',rows.length]);
  steps.forEach(function(s){
    if(s.op==='filter'){rows=rows.filter(function(r){return evalExpr(r,s.expr);});log.push(['filter '+s.expr,rows.length]);}
    else if(s.op==='aggregate'){var g={};rows.forEach(function(r){var k=s.by.map(function(c){return r[c];}).join('|');(g[k]=g[k]||[]).push(r);});
      rows=Object.keys(g).map(function(k){return {};});log.push(['aggregate by '+s.by.join(', '),rows.length]);}
    else if(s.op==='sort')log.push(['sort by '+s.by.join(', '),rows.length]);});
  pop('preview','Preview on sample data',
    '<p>Row count after each step, on the '+ORDERS.length+' sample rows. Nothing leaves the browser.</p><table>'+
    log.map(function(l){return '<tr><td>'+esc(l[0])+'</td><td class="k">'+l[1]+' rows</td></tr>';}).join('')+
    '</table>',x,y);}

function reverseBlock(b,x,y){
  var s=null,ys=[];for(var y2=b.a;y2<=b.b;y2++){var sl=srcFrom(y2);if(sl){s=sl;ys.push(y2);}}
  var t=TOOLS[cur];
  if(!s){pop('reverse',b.name+': → '+t.nm,'<p class="none">This block has no source line on this example.</p>',x,y);return;}
  var ls=srcLines(),from=Math.max(1,s-1),to=Math.min(ls.length,s+1);
  pop('reverse',b.name+': → '+t.nm,
    '<p>The same block, expressed back in '+esc(t.nm)+'. Nothing here is a one-way door.</p><pre>'+
    esc(ls.slice(from-1,to).map(function(l,i){return String(from+i).padStart(2,' ')+'  '+l;}).join('\n'))+
    '</pre><p>Source line '+s+' in <code>'+esc(t.file)+'</code>.</p>',x,y);}

function revealSrc(n){
  if(selectSrcLine(n))toast('Source line '+n+' — '+trunc(srcLines()[n-1],40));
  else toast('Line '+n+' is not visible in this example',1);}

function loadRandomSample(){
  var others=ORDER.filter(function(k){return k!==cur;});
  var k=others[Math.floor(Math.random()*others.length)];
  cur=k;IGN={};SEL=null;renderAll();refreshIgnBadge();
  toast('Loaded the '+TOOLS[k].nm+' sample');}

function setExpand(side){
  var c=document.querySelector('.cmp'),want=side==='L'?'expL':'expR',on=!c.classList.contains(want);
  c.classList.remove('expL','expR');if(on)c.classList.add(want);
  [[$("icExpA"),'expL'],[$("icExpB"),'expR']].forEach(function(p){
    var act=on&&want===p[1];p[0].classList.toggle('on',act);p[0].setAttribute('aria-pressed',String(act));
    p[0].setAttribute('data-tip',act?'Restore both panes':'Expand this pane');});
  toast(on?(side==='L'?'Source pane expanded':'Hydra pane expanded'):'Both panes restored');}
function resetHy(){IGN={};SEL=null;$("hyCode").value=HYDRA_JOB;$("hyLoc").textContent=hyLines()+" lines";
  renderStats();renderChart();validate(1);refreshIgnBadge();toast('Manifest reset to the original');}

/* ---------------- icônes ---------------- */
$("icIgn").onclick=function(){IGN={};retranslate('All lines restored');};
$("icCopyA").onclick=function(){cpy(srcText(),TOOLS[cur].file);};
$("icDlA").onclick=function(){download(TOOLS[cur].file.split('/').pop(),srcText());};
$("icLint").onclick=function(e){runSrcLint(e.clientX,e.clientY);};
$("icExpA").onclick=function(){setExpand('L');};
$("icVal").onclick=function(e){validate(0,e.clientX,e.clientY);};
$("icRun").onclick=run;
$("icProv").onclick=toggleProv;
$("icCopyB").onclick=function(){cpy($("hyCode").value,'job.yaml');};
$("icExpB").onclick=function(){setExpand('R');};
$("dlBtn").onclick=function(){download('job.yaml',$("hyCode").value);};
$("resetBtn").onclick=resetHy;

/* ---------------- position de la ligne sous le curseur ---------------- */
function lineOf(el,e){
  var txt=el.value!==undefined?el.value:(el.textContent||''),ls=txt.split('\n'),n=1;
  if(el.value!==undefined&&(!e||e.clientY==null))n=txt.slice(0,el.selectionStart||0).split('\n').length;
  else if(e&&e.clientY!=null){
    var r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    var lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.5,pad=parseFloat(cs.paddingTop)||0;
    n=Math.floor((e.clientY-r.top-pad+el.scrollTop)/lh)+1;}
  return Math.max(1,Math.min(n,ls.length));}
function ctx(el,build){
  if(!el)return;
  el.addEventListener('contextmenu',function(e){
    if(e.shiftKey)return;                                  /* laisse le menu du navigateur */
    var b=build(e);if(!b)return;e.preventDefault();openMenu(e.clientX,e.clientY,b.items,b.head);});
  el.addEventListener('keydown',function(e){
    if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){
      var b=build(e);if(!b)return;e.preventDefault();
      var r=el.getBoundingClientRect();openMenu(r.left+24,r.top+22,b.items,b.head);}});}

/* ================= MENU 1 — éditeur source (DAG / config) ================= */
ctx($("srcCode"),function(e){
  var n=lineOf($("srcCode"),e),ls=srcLines(),line=ls[n-1]||'';
  var sel=String(window.getSelection?window.getSelection():'' ).trim(),hasSel=!!sel;
  var produced=yamlFrom(n).length;
  return {head:'L'+n+'  '+trunc(line||'(empty)',30),items:[
    {t:'Explain this line',k:'?',f:function(){explainLine(n,e.clientX,e.clientY);}},
    {t:'Show the YAML it produced',off:!produced,
     why:produced?'':'This line produced no manifest line',f:function(){showProduced(n);}},
    '-',
    {t:'Translate the selection only',off:!hasSel,
     why:hasSel?'':'Select some source text first',f:function(){
       var sl=[];ls.forEach(function(l,i){if(l.trim()&&sel.indexOf(l.trim())>=0)sl.push(i+1);});
       SEL=sl.length?sl:null;retranslate(SEL?('Selection only — '+SEL.length+' source lines kept'):'Nothing matched the selection');}},
    {t:(IGN[n]?'Restore this line':'Ignore this line'),k:'⌥',off:!produced,
     why:produced?'':'Nothing to ignore — this line produced no manifest line',
     f:function(){IGN[n]=!IGN[n];retranslate(IGN[n]?('Line '+n+' ignored — manifest rebuilt'):('Line '+n+' restored'));}},
    {t:'Clear all ignored lines',off:!ignCount(),f:function(){IGN={};SEL=null;retranslate('All lines restored');}},
    '-',
    {t:'Paste a DAG',k:'⌘V',off:true,
     why:'The source pane here is a fixed example. Pasting your own code needs the translator — open the tunnel.',
     f:function(){}},
    {t:'Load a random sample',k:'R',f:loadRandomSample}
  ]};
});

/* ================= MENU 2 — manifeste Hydra ================= */
ctx($("hyCode"),function(e){
  var n=lineOf($("hyCode"),e),ls=$("hyCode").value.split('\n'),txt=ls[n-1]||'';
  var b=blockAt(n),om=b?b.name:((txt.match(/-\s*(\w+):/)||[])[1]||null);
  var src=srcFrom(n),t=TOOLS[cur];
  return {head:(b?b.name+':':'job.yaml')+'  L'+n,items:[
    {t:'Copy this block',k:'⌘C',off:!b,why:b?'':'Put the cursor inside a step',
     f:function(){cpy(b.txt,b.name+': ('+(b.b-b.a+1)+' lines)');}},
    {t:om?('Explain op: '+om):'Explain this op',off:!om,f:function(){
      pop('op','op: '+om,'<p>'+esc(OPDOC[om]||'Built-in operation.')+'</p><pre>'+
        esc((b?b.txt:txt))+'</pre>',e.clientX,e.clientY);}},
    {t:'Reveal the '+t.nm+' line',off:!src,why:src?'':'This line has no source counterpart',
     f:function(){revealSrc(src);}},
    '-',
    {t:'Back to '+t.nm+' (this block)',off:!b,f:function(){reverseBlock(b,e.clientX,e.clientY);}},
    {t:'Preview on sample data',f:function(){preview(e.clientX,e.clientY);}},
    '-',
    {t:'Copy the whole manifest',f:function(){cpy($("hyCode").value,'job.yaml');}},
    {t:'Download',f:function(){download('job.yaml',$("hyCode").value);}}
  ]};
});

/* ================= DEUX EDITEURS SYNCHRONISES =================
   Le DAG est éditable. Quand il change et qu'il est valide, le manifeste
   suit ; quand le manifeste change et qu'il est valide, le DAG suit.
   La synchronisation porte sur les valeurs, pas sur la forme. */

/* motif par outil : où lire et où réécrire chaque valeur.
   g = index du groupe capturant qui porte la valeur. */
var PANDAS={
  thr:{re:/\["amount"\]\s*>\s*(\d+)/,g:1},
  groupCol:{re:/groupby\("(\w+)"/,g:1},
  aggOut:{re:/\.agg\((\w+)=\(/,g:1},
  aggCol:{re:/\.agg\(\w+=\("(\w+)"/,g:1},
  aggFunc:{re:/\.agg\(\w+=\("\w+",\s*"(\w+)"\)/,g:1},
  sortCol:{re:/sort_values\("(\w+)"/,g:1},
  sortAsc:{re:/ascending=(True|False)/,g:1,bool:'py'}
};
function withCron(base,cron){var o={};for(var k in base)o[k]=base[k];o.cron=cron;o.cronAt=cron;return o;}
var CONS={
 airflow:withCron(PANDAS,{re:/schedule="([^"]+)"/,g:1}),
 dagster:withCron(PANDAS,{re:/cron_schedule="([^"]+)"/,g:1}),
 prefect:withCron(PANDAS,{re:/\bcron="([^"]+)"/,g:1}),
 dbt:{
  thr:{re:/where amount > (\d+)/,g:1},
  groupCol:{re:/group by (\w+)/,g:1},
  aggOut:{re:/\)\s+as (\w+)/,g:1},
  aggCol:{re:/\w+\((\w+)\)\s+as/,g:1},
  aggFunc:{re:/select \w+,\s*(\w+)\(/,g:1},
  sortCol:{re:/order by (\w+)/,g:1},
  sortAsc:{re:/order by \w+ (desc|asc)/,g:1,bool:'sql'},
  cron:{re:/schedule="([^"]+)"/,g:1}
 },
 databricks:{
  thr:{re:/"min_amount":\s*"(\d+)"/,g:1},
  groupCol:{re:/groupBy\("(\w+)"\)/,g:1},
  aggCol:{re:/\.sum\("(\w+)"\)/,g:1},
  aggOut:{re:/,\s*"(\w+)"\)/,g:1},
  aggFunc:null,
  sortCol:{re:/orderBy\(agg\.(\w+)\./,g:1},
  sortAsc:{re:/orderBy\(agg\.\w+\.(desc|asc)\(\)/,g:1,bool:'sql'},
  cron:null,                                   /* quartz à 6 champs : non synchronisable */
  cronAt:{re:/"quartz_cron_expression":\s*"([^"]+)"/,g:1}
 },
 airbyte:{
  thr:{re:/where amount > (\d+)/,g:1},
  groupCol:{re:/group by (\w+)/,g:1},
  aggOut:{re:/\w+\(\w+\)\s+(\w+)\s+from/,g:1},
  aggCol:{re:/\w+\((\w+)\)\s+\w+\s+from/,g:1},
  aggFunc:{re:/select \w+,\s*(\w+)\(/,g:1},
  sortCol:{re:/order by (\w+)/,g:1},
  sortAsc:{re:/order by \w+ (desc|asc)/,g:1,bool:'sql'},
  cron:null,                                   /* cronExpression à 6 champs : non synchronisable */
  cronAt:{re:/cronExpression:\s*"([^"]+)"/,g:1}
 },
 flowman:{
  thr:{re:/condition:\s*"amount\s*>\s*(\d+)"/,g:1},
  groupCol:{re:/dimensions:\s*\[\s*(\w+)/,g:1},
  aggOut:{re:/^\s+(\w+):\s*"\w+\(\w+\)"/,g:1},
  aggCol:{re:/^\s+\w+:\s*"\w+\((\w+)\)"/,g:1},
  aggFunc:{re:/^\s+\w+:\s*"(\w+)\(\w+\)"/,g:1},
  sortCol:{re:/-\s*(\w+):\s*(?:desc|asc)\b/,g:1},
  sortAsc:{re:/-\s*\w+:\s*(desc|asc)\b/,g:1,bool:'sql'},
  cron:{re:/^(.+?)\s+bin\/flowexec/,g:1},
  fromRe:/location:\s*"file:\/\/\/data\/orders"/,
  toRe:/location:\s*"file:\/\/\/data\/report"/
 }
,
 nifi:{
  thr:{re:/WHERE amount > (\d+)/,g:1},
  groupCol:{re:/GROUP BY (\w+)/,g:1},
  aggOut:{re:/\w+\(\w+\) AS (\w+)/,g:1},
  aggCol:{re:/\w+\((\w+)\) AS /,g:1},
  aggFunc:{re:/SELECT \w+, (\w+)\(/,g:1},
  sortCol:{re:/ORDER BY (\w+)/,g:1},
  sortAsc:{re:/ORDER BY \w+ (desc|asc|DESC|ASC)/,g:1,bool:'sql'},
  cron:null,                                   /* quartz a 6 champs : non synchronisable */
  cronAt:{re:/"schedulingPeriod":\s*"([^"]+)"/,g:1},
  fromRe:/"Input Directory":\s*"/,
  toRe:/"Directory":\s*"\.\/out"/
 }
};
var VKEYS=['thr','groupCol','aggOut','aggCol','aggFunc','sortCol','sortAsc','cron'];

function stripTags(h){var d=document.createElement('div');d.innerHTML=h;return d.textContent||'';}
function findLine(lines,spec){
  if(!spec)return null;
  for(var i=0;i<lines.length;i++){var m=spec.re.exec(lines[i]);if(m)return {n:i+1,v:m[spec.g],m:m};}
  return null;}
function boolIn(v,kind){var t=String(v).toLowerCase();return kind==='py'?(t==='true'):(t!=='desc');}
function boolOut(b,kind){return kind==='py'?(b?'True':'False'):(b?'asc':'desc');}

/* --- lecture des valeurs dans la source --- */
function readSrc(){
  var lines=srcLines(),c=CONS[cur],out={},where={};
  VKEYS.forEach(function(k){
    var f=findLine(lines,c[k]);
    if(!f){out[k]=null;where[k]=null;return;}
    out[k]=c[k].bool?boolIn(f.v,c[k].bool):f.v;where[k]=f.n;});
  if(c.aggFunc===null)out.aggFunc='sum';          /* databricks : .sum() porte la fonction */
  return {v:out,at:where};}

/* --- lecture des valeurs dans le manifeste --- */
function readYaml(){
  var t=$("hyCode").value,o={};
  var m=/expr:\s*(\w+)\s*>\s*(\d+)/.exec(t);o.thr=m?m[2]:null;o.filterCol=m?m[1]:null;
  m=/by:\s*\[([^\]]*)\][\s\S]*?agg:/.exec(t);o.groupCol=m?m[1].trim():null;
  m=/(\w+):\s*\{\s*func:\s*(\w+),\s*col:\s*(\w+)\s*\}/.exec(t);
  o.aggOut=m?m[1]:null;o.aggFunc=m?m[2]:null;o.aggCol=m?m[3]:null;
  m=/-\s*sort:[\s\S]*?by:\s*\[([^\]]*)\]/.exec(t);o.sortCol=m?m[1].trim():null;
  m=/ascending:\s*(true|false)/.exec(t);o.sortAsc=m?(m[1]==='true'):null;
  m=/schedule:\s*"([^"]+)"/.exec(t);o.cron=m?m[1]:null;
  return o;}

/* --- écriture --- */
function writeYaml(v){
  var t=$("hyCode").value;
  if(v.thr!=null)t=t.replace(/(expr:\s*\w+\s*>\s*)\d+/,'$1'+v.thr);
  if(v.groupCol)t=t.replace(/(-\s*aggregate:[\s\S]*?by:\s*\[)[^\]]*(\])/,'$1'+v.groupCol+'$2');
  if(v.aggOut&&v.aggFunc&&v.aggCol)
    t=t.replace(/\w+:\s*\{\s*func:\s*\w+,\s*col:\s*\w+\s*\}/,
      v.aggOut+': { func: '+v.aggFunc+', col: '+v.aggCol+' }');
  if(v.sortCol)t=t.replace(/(-\s*sort:[\s\S]*?by:\s*\[)[^\]]*(\])/,'$1'+v.sortCol+'$2');
  if(v.sortAsc!=null)t=t.replace(/(ascending:\s*)(true|false)/,'$1'+(v.sortAsc?'true':'false'));
  if(v.cron)t=t.replace(/(schedule:\s*")[^"]*(")/,'$1'+v.cron+'$2');
  return t;}
function writeSrc(v){
  var lines=srcLines(),c=CONS[cur],changed=[];
  VKEYS.forEach(function(k){
    var spec=c[k];if(!spec)return;
    var val=v[k];if(val==null)return;
    if(spec.bool)val=boolOut(val,spec.bool);
    var f=findLine(lines,spec);if(!f)return;
    if(String(f.v)===String(val))return;
    var line=lines[f.n-1],m=spec.re.exec(line);
    if(!m)return;
    var start=m.index+m[0].indexOf(m[spec.g],0);
    /* remplacement précis du groupe capturant */
    var whole=m[0],rep=whole.replace(m[spec.g],String(val));
    lines[f.n-1]=line.slice(0,m.index)+rep+line.slice(m.index+whole.length);
    changed.push(k);});
  return {text:lines.join('\n'),changed:changed};}

/* --- provenance recalculée à chaque édition --- */
function provMap(){
  var lines=srcLines(),c=CONS[cur],m={};
  function at(k){var f=findLine(lines,c[k]);return f?f.n:null;}
  var thr=at('thr'),grp=at('groupCol'),agg=at('aggCol'),srt=at('sortCol'),cro=at('cronAt')||at('cron');
  var from=null,to=null;
  var fr=c.fromRe||/read_csv|spark\.read|url:\s*\S+\.csv|ref\("[^"]+"\)/;
  var tr=c.toRe||/to_csv|\.write\.mode|create table|materialized="table"/;
  lines.forEach(function(l,i){
    if(from===null&&fr.test(l))from=i+1;
    if(to===null&&tr.test(l))to=i+1;});
  if(from)m[4]=from; if(to)m[5]=to; if(cro)m[6]=cro;
  if(thr){m[8]=thr;m[9]=thr;}
  if(grp){m[10]=grp;m[11]=grp;}
  if(agg){m[12]=agg;m[13]=agg;}
  if(srt){m[14]=srt;m[15]=srt;m[16]=srt;}
  return m;}

/* --- gouttières de numéros de ligne --- */
function autoSize(tid){
  var ta=$(tid);
  ta.style.height='auto';
  var h=ta.scrollHeight;
  if(h>0)ta.style.height=h+'px';          /* pas de défilement interne : rien n'est caché */
}
function renderGut(gid,tid){
  var ta=$(tid),g=$(gid),n=ta.value.split('\n').length,h='';
  for(var i=1;i<=n;i++)h+='<b>'+i+'</b>';
  g.innerHTML=h;
  autoSize(tid);
}
function bindGut(gid,tid){
  var ta=$(tid);
  ta.addEventListener('input',function(){renderGut(gid,tid);});}
bindGut('gutA','srcCode');bindGut('gutB','hyCode');
window.addEventListener('resize',function(){autoSize('srcCode');autoSize('hyCode');});

/* --- synchronisation --- */
var SYNC=false,TSRC=null,TYML=null;
function syncBadge(where,msg){
  var p=$(where==='hy'?'hyLoc':'srcLoc');
  p.classList.add('sync');setTimeout(function(){p.classList.remove('sync');},900);
  if(msg)toast(msg);}

function srcChanged(){
  if(SYNC)return;
  $("srcLoc").textContent=srcLines().length+' lines';
  var r=srcLint(),errs=r.issues.filter(function(i){return i.s==='err';});
  runSrcLintQuiet(r);
  if(errs.length){toast('Source has '+errs.length+' syntax error(s) — Hydra not updated, line '+errs[0].n,1);return;}
  var got=readSrc(),before=$("hyCode").value;
  SYNC=true;
  $("hyCode").value=writeYaml(got.v);
  SYNC=false;
  if($("hyCode").value!==before){
    renderGut('gutB','hyCode');$("hyLoc").textContent=hyLines()+' lines';
    renderStats();renderChart();validate(1);refreshIgnBadge();
    syncBadge('hy','Hydra follows — manifest updated from the source');}
}
function ymlChanged(){
  if(SYNC)return;
  renderGut('gutB','hyCode');
  $("hyLoc").textContent=hyLines()+' lines';
  renderStats();renderChart();
  var ok=validate(1);
  if(!ok){toast('Manifest is invalid — source not updated',1);return;}
  var v=readYaml(),before=$("srcCode").value;
  if(v.cron&&!CONS[cur].cron){
    var cAt=findLine(srcLines(),CONS[cur].cronAt);
    if(cAt&&cAt.v!==v.cron)
      toast(TOOLS[cur].nm+' uses a 6-field schedule (line '+cAt.n+') — the cron is not synced, change it there',1);
  }
  var w=writeSrc(v);
  if(w.text!==before){
    SYNC=true;$("srcCode").value=w.text;SYNC=false;
    renderGut('gutA','srcCode');$("srcLoc").textContent=srcLines().length+' lines';
    runSrcLintQuiet(srcLint());
    syncBadge('src',TOOLS[cur].nm+' follows — '+w.changed.join(', ')+' updated');}
}
function runSrcLintQuiet(r){
  var errs=r.issues.filter(function(i){return i.s==='err';}),ic=$("icLint");
  ic.className='ic2 '+(errs.length?'sev-err':(r.issues.length?'sev-warn':'sev-ok'));
  ic.setAttribute('data-tip',errs.length?(errs.length+' syntax error(s) — line '+errs[0].n):
    (r.issues.length?(r.issues.length+' warning(s)'):'Syntax and structure check out'));}

$("srcCode").addEventListener('input',function(){clearTimeout(TSRC);TSRC=setTimeout(srcChanged,320);});
$("hyCode").addEventListener('input',function(){clearTimeout(TYML);TYML=setTimeout(ymlChanged,320);});

/* --- au chargement et au changement d'outil --- */
(function(){
  var prev=renderAll;
  renderAll=function(){
    SYNC=true;prev.apply(null,arguments);
    $("srcCode").value=stripTags(TOOLS[cur].code);
    SYNC=false;
    renderGut('gutA','srcCode');renderGut('gutB','hyCode');
    $("srcLoc").textContent=srcLines().length+' lines';
    IGN={};SEL=null;PROVON=false;
    $("icProv").classList.remove('on');$("icProv").setAttribute('aria-pressed','false');
    refreshIgnBadge();validate(1);runSrcLintQuiet(srcLint());
  };})();
renderAll();
/* seconde mesure une fois les polices posées, pour une hauteur exacte */
if(window.requestAnimationFrame)requestAnimationFrame(function(){autoSize('srcCode');autoSize('hyCode');});
