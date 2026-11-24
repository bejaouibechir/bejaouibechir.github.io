// Guides en ligne de commande, classes par commande (ou par theme sans commande).
export const cliGuideCategories = [
 {
  "id": "init",
  "title": "Create a job",
  "command": "init",
  "lessons": [
   {
    "slug": "anatomy-of-a-job",
    "label": "Anatomy of a job",
    "title": "Anatomy of a job",
    "description": "The four manifests of a job folder, how they link, and what validate says when one breaks."
   }
  ]
 },
 {
  "id": "run",
  "title": "Run and launch",
  "command": "run",
  "lessons": [
   {
    "slug": "launch-a-job-from-the-cli-and-the-api",
    "label": "Other launches",
    "title": "Launch a job from the CLI and the API",
    "description": "Run the same job without Studio from the command line and the API, and see where each launch shows up."
   }
  ]
 },
 {
  "id": "job",
  "title": "Jobs and parameters",
  "command": "job",
  "lessons": [
   {
    "slug": "manage-jobs-and-parameters-from-the-cli",
    "label": "Manage projects",
    "title": "Manage projects",
    "description": "Add, attach and detach jobs, and set project parameters per environment, from the command line."
   }
  ]
 },
 {
  "id": "sources",
  "title": "Sources and transformations",
  "command": null,
  "lessons": [
   {
    "slug": "read-csv-json-and-parquet-files",
    "label": "File sources",
    "title": "Configure CSV, JSON and Parquet sources",
    "description": "Declare a CSV, JSON or Parquet source, run it and read the error of a missing file."
   },
   {
    "slug": "read-and-write-sqlite-databases",
    "label": "Database sources",
    "title": "Database sources",
    "description": "Read a table or a query from SQLite and write to SQLite with append, replace or upsert, with no server."
   },
   {
    "slug": "configure-snowflake-bigquery-and-cdc-sources",
    "label": "Advanced sources",
    "title": "Advanced sources",
    "description": "Write a Snowflake, BigQuery or CDC source, validate it offline and read the failures."
   },
   {
    "slug": "clean-split-window-pivot-and-script",
    "label": "Transformations 2",
    "title": "Transformations, second half",
    "description": "Clean, split, window, pivot, unpivot and script steps, each run on a tiny file."
   }
  ]
 },
 {
  "id": "subprojects",
  "title": "Sub-projects",
  "command": null,
  "lessons": [
   {
    "slug": "call-a-project-from-a-project",
    "label": "Sub-projects",
    "title": "Call a project from a project",
    "description": "Run another project from a workflow step, and read what a wrong path or a loop gives."
   },
   {
    "slug": "pass-parameters-to-a-sub-project",
    "label": "Sub-project parameters",
    "title": "Pass parameters to a sub-project",
    "description": "Hand values down with params, publish a result with set_param and read it back."
   }
  ]
 },
 {
  "id": "trigger",
  "title": "Triggers",
  "command": "trigger",
  "lessons": [
   {
    "slug": "declare-project-triggers",
    "label": "Triggers",
    "title": "Triggers: what starts a workflow",
    "description": "Declare triggers in triggers.yaml, check them, fire one by hand and read the history."
   }
  ]
 },
 {
  "id": "watch",
  "title": "Watch",
  "command": "watch",
  "lessons": [
   {
    "slug": "run-triggers-with-hdrctl-watch",
    "label": "Other triggers",
    "title": "Other triggers",
    "description": "Run interval, marker, file and source triggers with hdrctl watch and read what each one prints."
   }
  ]
 },
 {
  "id": "serve",
  "title": "Production",
  "command": "serve",
  "lessons": [
   {
    "slug": "run-hydra-in-production-with-hdrctl-serve",
    "label": "Production",
    "title": "Production",
    "description": "Serve the API without Studio, run a cron workflow and read the scheduled runs."
   }
  ]
 },
 {
  "id": "mcp",
  "title": "MCP server",
  "command": "mcp",
  "lessons": [
   {
    "slug": "connect-claude-code-to-hydra-etl-with-mcp",
    "label": "MCP server",
    "title": "MCP server",
    "description": "Write .mcp.json with hdrctl mcp setup and check the 21 tools and the path guardrails."
   }
  ]
 }
];
export const cliGuidesFor = (command) => cliGuideCategories.filter((c) => c.command === command).flatMap((c) => c.lessons);
