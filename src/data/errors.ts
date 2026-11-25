/* Messages d'erreur de Hydra ETL, reproduits a l'identique depuis les lecons.
   Chaque entree a ete verifiee mot pour mot contre la page citee : ne jamais
   reecrire un `error` de memoire, le recopier depuis la lecon.
   `anchor` est stable : des liens externes pointent dessus. Ne pas le changer. */

export type ErrorEntry = {
  anchor: string;
  error: string;          // la chaine exacte, telle que l'utilisateur la voit
  cause: string;
  fix: string;
  sourceTitle: string;
  sourceSlug: string;
  note?: string;
};

export type ErrorSection = {
  id: string;
  title: string;
  blurb: string;
  entries: ErrorEntry[];
};

export const errorSections: ErrorSection[] = [
  {
    id: 'start',
    title: 'Installing and starting',
    blurb: 'Before a single row moves: the package, the interpreter, the server.',
    entries: [
      {
        anchor: 'curl-failed-to-connect-5678',
        error: "curl: (7) Failed to connect to 127.0.0.1 port 5678 after 0 ms: Couldn't connect to server",
        cause: 'Nothing listens on that port because the API server is stopped or unreachable.',
        fix: 'Start `hdrctl serve`, or use the port you passed with `--port`.',
        sourceTitle: 'Check the Hydra Studio API connection (API online or offline)',
        sourceSlug: '/studio/02-check-the-api/',
      },
      {
        anchor: 'modulenotfounderror-hdrctl',
        error: 'ModuleNotFoundError when hdrctl starts',
        cause: 'An older Hydra is installed in your system Python and its launcher shadows the new one.',
        fix: 'Remove the global install, then open a fresh terminal with the virtual environment active.',
        sourceTitle: 'Install Hydra',
        sourceSlug: '/install/',
      },
      {
        anchor: 'bigquery-driver-not-installed',
        error: 'ValueError: BigQueryConnector [src]: query failed. Error: ValueError: BigQueryConnector [src]: the BigQuery driver is not installed. Install it with \'pip install "hydra-etl[bigquery]"\'.',
        cause: 'The BigQuery driver is an optional extra and is not installed in this environment.',
        fix: 'Run `pip install "hydra-etl[bigquery]"`.',
        sourceTitle: 'Advanced sources: Snowflake, BigQuery and CDC',
        sourceSlug: '/cli/guides/configure-snowflake-bigquery-and-cdc-sources/',
      },
    ],
  },

  {
    id: 'manifests',
    title: 'Job manifests',
    blurb: 'The four YAML files of a job disagree with each other, or one is missing.',
    entries: [
      {
        anchor: 'pipeline-from-not-found-in-sources',
        error: "err pipeline.from='src_missing' not found in sources.yaml",
        cause: 'The source id named in `pipeline.yaml` is not declared in `sources.yaml`.',
        fix: 'Align the id in both files.',
        sourceTitle: 'What a Hydra job is made of: four YAML files',
        sourceSlug: '/cli/guides/anatomy-of-a-job/',
      },
      {
        anchor: 'destinations-yaml-missing',
        error: 'err destinations.yaml — MISSING',
        cause: 'The `destinations.yaml` file is not in the job folder.',
        fix: 'Restore it, or recreate the job.',
        sourceTitle: 'What a Hydra job is made of: four YAML files',
        sourceSlug: '/cli/guides/anatomy-of-a-job/',
      },
      {
        anchor: 'pipeline-to-should-be-a-string',
        error: 'Input should be a valid string on pipeline.to',
        cause: '`pipeline.to` holds a list of destination ids instead of a single one. A job writes to one place.',
        fix: 'Name one destination, and create a second job for the second destination.',
        sourceTitle: 'Add a destination in Hydra Studio: one job, one place to write',
        sourceSlug: '/studio/07-add-a-destination/',
      },
      {
        anchor: 'steps-empty-although-nodes-exist',
        error: 'steps: [] although nodes exist on the canvas',
        cause: 'The transformation nodes are placed but not wired into the chain, so the pipeline has no steps.',
        fix: 'Draw the edges from the source, through the transformations, to the destination.',
        sourceTitle: 'Read the YAML Hydra Studio generates (Hydra DSL panel)',
        sourceSlug: '/studio/08-see-the-yaml/',
      },
    ],
  },

  {
    id: 'sources',
    title: 'Reading a source',
    blurb: 'The file or the table is not where the job expects it.',
    entries: [
      {
        anchor: 'csvconnector-source-file-not-found',
        error: "Job 'missing-file' failed: ValueError: CSVConnector [src_missing_file]: source file not found. Pipeline FAILED in 1.7s",
        cause: 'The path in `extract.table` is wrong, or the file sits in another folder. Paths are read from the job folder.',
        fix: 'Check `extract.table` against the job folder.',
        sourceTitle: 'Read CSV, JSON and Parquet files in a Hydra job',
        sourceSlug: '/cli/guides/read-csv-json-and-parquet-files/',
        note: 'The same error appears as `ValueError: CSVConnector [src]: source file not found.` when a file disappears between two runs — see Break a Hydra ETL pipeline on purpose, then recover.',
      },
      {
        anchor: 'sqliteconnector-database-file-not-found',
        error: 'ValueError: SQLiteConnector [src_app]: database file not found: C:…\\data\\nope.db',
        cause: 'The database path is wrong, or relative to the wrong folder.',
        fix: 'Count from the job folder, for example `../../data/app.db`.',
        sourceTitle: 'Read from and write to a SQLite database in a Hydra ETL job',
        sourceSlug: '/cli/guides/read-and-write-sqlite-databases/',
      },
      {
        anchor: 'operationalerror-no-such-table',
        error: 'OperationalError: no such table: nothing',
        cause: 'The name in `extract.table` does not exist in that database file.',
        fix: 'List the tables with a SQLite client, then fix `extract.table`.',
        sourceTitle: 'Read from and write to a SQLite database in a Hydra ETL job',
        sourceSlug: '/cli/guides/read-and-write-sqlite-databases/',
      },
      {
        anchor: 'parquet-needs-pyarrow',
        error: 'Parquet cannot be read: pyarrow is missing',
        cause: 'Parquet support is an optional extra.',
        fix: 'Run `pip install "hydra-etl[parquet]"`.',
        sourceTitle: 'Read CSV, JSON and Parquet files in a Hydra job',
        sourceSlug: '/cli/guides/read-csv-json-and-parquet-files/',
        note: 'The lesson describes this case without reproducing the engine message verbatim.',
      },
    ],
  },

  {
    id: 'transformations',
    title: 'Transformations',
    blurb: 'A step receives something it cannot work with.',
    entries: [
      {
        anchor: 'filter-name-is-not-defined',
        error: "Step 2/2: filter: invalid expression 'status == 'paid''. Error: name 'status' is not defined",
        cause: 'An earlier step dropped the column the expression needs.',
        fix: 'Reorder the nodes, or keep the column in the Select step.',
        sourceTitle: 'Add a transformation in Hydra Studio: the 20 operations',
        sourceSlug: '/studio/06-add-a-transformation/',
      },
      {
        anchor: 'cast-cannot-convert-column',
        error: 'Step 1/1: cast: cannot convert column=\'amount\' to type=\'int\': Unable to parse string "abc" at position 199',
        cause: 'A value in the source column cannot be parsed into the target type.',
        fix: 'Fix the value at the source, or cast to a type that accepts it.',
        sourceTitle: 'Make a load all-or-nothing in Hydra ETL Studio',
        sourceSlug: '/studio/all-or-nothing-load/',
      },
      {
        anchor: 'script-import-refused',
        error: "Job 't-script-bad' failed: ValueError: Step 2/2: script: 'import' interdit dans le code",
        cause: 'The Script transformation runs in a restricted environment that refuses imports.',
        fix: 'Write the step with its declared inputs only, without importing a module.',
        sourceTitle: 'Clean, split, window, pivot and script transformations',
        sourceSlug: '/cli/guides/clean-split-window-pivot-and-script/',
        note: 'This engine message is in French. It is reproduced here exactly as the engine prints it, so that searching for it leads here.',
      },
      {
        anchor: 'connection-rejected',
        error: 'Connection rejected — "CSV" cannot have an output',
        cause: 'Studio refuses the edge: it already exists, it would make a cycle, that node cannot take an input or an output, or it reached its maximum number of edges.',
        fix: 'Read the Connection rejected warning and apply what it says.',
        sourceTitle: 'Add a transformation in Hydra Studio: the 20 operations',
        sourceSlug: '/studio/06-add-a-transformation/',
      },
    ],
  },

  {
    id: 'parameters',
    title: 'Parameters and secrets',
    blurb: 'A value is asked for and nothing provides it.',
    entries: [
      {
        anchor: 'missing-environment-variable',
        error: 'SecretResolutionError: Missing environment variable: REGION',
        cause: 'The name is in no environment file and not in the shell.',
        fix: 'Run `hdrctl env show`, then `hdrctl env set`.',
        sourceTitle: 'Switch environments in Hydra ETL with hdrctl env',
        sourceSlug: '/studio/switch-environments-with-hdrctl-env/',
      },
      {
        anchor: 'missing-secret',
        error: 'SecretResolutionError: Missing secret: not.defined — not in the environment (NOT_DEFINED) nor in the project secrets files (.hydra/secrets or HYDRA_SECRETS_FILE)',
        cause: 'The secret name is in no environment variable and in no secrets file.',
        fix: 'Run `hdrctl secret list`, then `hdrctl secret set`.',
        sourceTitle: 'Store and use secrets in a Hydra ETL project',
        sourceSlug: '/studio/store-and-use-secrets-with-hdrctl/',
      },
      {
        anchor: 'secret-not-found-in-secrets',
        error: "secret 'api.token' not found in secrets",
        cause: 'The name is not in the secrets file of that scope.',
        fix: 'Check the name, and check the `--env` option.',
        sourceTitle: 'Store and use secrets in a Hydra ETL project',
        sourceSlug: '/studio/store-and-use-secrets-with-hdrctl/',
      },
      {
        anchor: 'value-is-empty-nothing-saved',
        error: 'The value is empty: nothing saved.',
        cause: 'The input line was empty.',
        fix: 'Pipe a value, or type one at the prompt.',
        sourceTitle: 'Store and use secrets in a Hydra ETL project',
        sourceSlug: '/studio/store-and-use-secrets-with-hdrctl/',
      },
      {
        anchor: 'parametererror-unresolved-parameter',
        error: "Step 'show' failed: ParameterError: unresolved parameter: 'result_rows'",
        cause: 'A plain `{{ param:… }}` placeholder was used where the value comes from a sub-project step.',
        fix: 'Read it as `{{ project:STEP.param.NAME }}`.',
        sourceTitle: 'Pass parameters to a Hydra sub-project and read results back',
        sourceSlug: '/cli/guides/pass-parameters-to-a-sub-project/',
      },
    ],
  },

  {
    id: 'triggers',
    title: 'Triggers',
    blurb: 'The project will not start on its own, and validation says why.',
    entries: [
      {
        anchor: 'cron-minute-out-of-range',
        error: "trigger 'nightly': cron '99 2 * * *': minute: 99 is out of range (0-59)",
        cause: 'A cron field is outside its range.',
        fix: 'Fix the field named in the message.',
        sourceTitle: 'Declare project triggers in triggers.yaml',
        sourceSlug: '/cli/guides/declare-project-triggers/',
        note: 'Studio reports the same thing as `Invalid triggers file: …\\triggers.yaml err — trigger \'t\': cron \'61 * * * *\': minute: 61 is out of range (0-59)`.',
      },
      {
        anchor: 'extra-inputs-are-not-permitted',
        error: 'triggers[0].evry: Extra inputs are not permitted',
        cause: 'A trigger key is misspelled, so the schema does not know it.',
        fix: 'Fix the key named in the message.',
        sourceTitle: 'Declare project triggers in triggers.yaml',
        sourceSlug: '/cli/guides/declare-project-triggers/',
      },
      {
        anchor: 'cron-does-not-apply-to-type-interval',
        error: "trigger 'every-15-min': cron does not apply to type interval",
        cause: 'A key was given to a trigger type that has no use for it.',
        fix: 'Remove the key, or change the trigger type.',
        sourceTitle: 'Declare project triggers in triggers.yaml',
        sourceSlug: '/cli/guides/declare-project-triggers/',
      },
      {
        anchor: 'trigger-workflows-not-found',
        error: "trigger 'nightly': workflow(s) not found: missing-wf (workflows/.yaml)",
        cause: 'A workflow listed in `triggers.yaml` has no file in `workflows/`.',
        fix: 'Create the file, or fix the name in `triggers.yaml`.',
        sourceTitle: 'Declare project triggers in triggers.yaml',
        sourceSlug: '/cli/guides/declare-project-triggers/',
      },
    ],
  },

  {
    id: 'webhook',
    title: 'Webhook and API',
    blurb: 'A request reaches the server and is turned away.',
    entries: [
      {
        anchor: 'token-required',
        error: 'HTTP/1.1 401 Unauthorized {"detail":"token required (X-Hydra-Token or Authorization: Bearer)"}',
        cause: 'The request carried no token.',
        fix: 'Send the token in the `X-Hydra-Token` header, or as a Bearer token in `Authorization`.',
        sourceTitle: 'Start a Hydra ETL project from a webhook',
        sourceSlug: '/studio/start-a-project-with-a-webhook/',
      },
      {
        anchor: 'invalid-token',
        error: 'HTTP/1.1 401 Unauthorized {"detail":"invalid token"}',
        cause: 'The token does not match the one held for that trigger.',
        fix: 'Copy the token again, or rotate it with `hdrctl trigger token <NAME> --rotate`.',
        sourceTitle: 'Start a Hydra ETL project from a webhook',
        sourceSlug: '/studio/start-a-project-with-a-webhook/',
      },
      {
        anchor: 'no-webhook-trigger',
        error: 'HTTP/1.1 404 Not Found {"detail":"no webhook trigger \'nope\'"}',
        cause: 'The name is wrong, the trigger is not of type webhook, or it is disabled.',
        fix: 'Check the names with `hdrctl trigger list`.',
        sourceTitle: 'Start a Hydra ETL project from a webhook',
        sourceSlug: '/studio/start-a-project-with-a-webhook/',
      },
      {
        anchor: 'secret-is-already-set',
        error: "Secret 'hooks.deploy' is already set",
        cause: 'A token already exists for that webhook trigger.',
        fix: 'Replace it with `hdrctl trigger token <NAME> --rotate`.',
        sourceTitle: 'Start a Hydra ETL project from a webhook',
        sourceSlug: '/studio/start-a-project-with-a-webhook/',
      },
      {
        anchor: 'webhook-headers-not-valid-json',
        error: "ValueError: Action webhook 'notify': 'headers' is not valid JSON (Expecting property name enclosed in double quotes",
        cause: 'The headers field is not valid JSON — usually property names without double quotes.',
        fix: 'Put every property name in double quotes.',
        sourceTitle: 'Send a webhook and an email from a Hydra ETL workflow',
        sourceSlug: '/studio/notify-with-webhook-and-email-actions/',
      },
      {
        anchor: 'http-error-404',
        error: 'HTTPError: HTTP Error 404: Not Found',
        cause: 'The path does not exist on the server the action calls.',
        fix: 'Check the URL, and that the target server is up.',
        sourceTitle: 'Send a webhook and an email from a Hydra ETL workflow',
        sourceSlug: '/studio/notify-with-webhook-and-email-actions/',
      },
    ],
  },

  {
    id: 'subprojects',
    title: 'Sub-projects',
    blurb: 'A project calls another project, and the call does not land.',
    entries: [
      {
        anchor: 'project-folder-not-found',
        error: "step 'call_child': project folder not found: ../nothing (resolved from the project root: …\\nothing)",
        cause: 'The path on the project step does not resolve from the calling project root.',
        fix: 'Check the path against the master folder.',
        sourceTitle: 'Call a Hydra project from another project',
        sourceSlug: '/cli/guides/call-a-project-from-a-project/',
      },
      {
        anchor: 'child-did-not-publish',
        error: "Step 'call_child' failed: project child did not publish nope (outputs: set them with set_param / assign_param, or declare them)",
        cause: 'The called project never published the output the caller reads.',
        fix: 'Add a `set_param` step in the child.',
        sourceTitle: 'Pass parameters to a Hydra sub-project and read results back',
        sourceSlug: '/cli/guides/pass-parameters-to-a-sub-project/',
      },
    ],
  },

  {
    id: 'reliability',
    title: 'Failure, rollback and timeouts',
    blurb: 'The run stopped, and the question is what state the data is in.',
    entries: [
      {
        anchor: 'rollback-steps-cannot-be-undone',
        error: 'Invalid workflow: rollback: true, but some steps cannot be undone:',
        cause: '`rollback: true` is set, but an action step has no undo.',
        fix: 'Declare an undo on every action, or set `undo: none`, then validate again.',
        sourceTitle: 'Declare the undo of an action in Hydra ETL Studio',
        sourceSlug: '/studio/declare-undo-actions/',
      },
      {
        anchor: 'rollback-stopped-file-changed',
        error: 'rollback stopped: …/outputs/report.csv changed after this run wrote it (size or date): not restored, to keep the other changes.',
        cause: 'A file the run wrote was modified afterwards, so Hydra refuses to overwrite someone else\'s change.',
        fix: 'Finish the undo with `hdrctl workflow undo <workflow>`.',
        sourceTitle: 'Resolve a rollback conflict and recover in Hydra ETL',
        sourceSlug: '/studio/resolve-conflicts-and-recover/',
      },
      {
        anchor: 'previous-run-stopped-before-undoing',
        error: "a previous run of 'wf_conflict' stopped before undoing its changes (…/.hydra/undo/wf_conflict.json).",
        cause: 'An interrupted rollback left its journal behind, and the workflow will not start again until it is finished.',
        fix: 'Finish it with `hdrctl workflow undo <workflow>`, or delete that file if the data is already as you want it.',
        sourceTitle: 'Resolve a rollback conflict and recover in Hydra ETL',
        sourceSlug: '/studio/resolve-conflicts-and-recover/',
      },
      {
        anchor: 'timed-out',
        error: 'timed out after 5s (timeout in workflows/thread.yaml)',
        cause: 'The workflow ran longer than the timeout set for it.',
        fix: 'Raise the timeout, or shorten what the steps wait for.',
        sourceTitle: 'Set a timeout on a workflow in Hydra ETL Studio',
        sourceSlug: '/studio/set-timeouts-on-workflows/',
      },
      {
        anchor: 'on-failure-invalid-value',
        error: "Workflow validation error: Input should be 'fail', 'skip' or 'continue'",
        cause: 'An invalid value was written for `on_failure`.',
        fix: 'Use one of the three.',
        sourceTitle: 'Handle a failing step with on_failure',
        sourceSlug: '/studio/handle-step-failures-with-on-failure/',
      },
      {
        anchor: 'unknown-function-in-fallback',
        error: 'unknown function file_exist() — use one of: source_available(), destination_available(), file_exists(), file_size(), file_age(), url_ok(), secret_defined(), db.load(), …',
        cause: 'The fallback condition calls a function that does not exist, or passes the wrong number of arguments.',
        fix: 'Pick the function from the list in the message.',
        sourceTitle: 'Fallback conditions in Hydra ETL: when, on_failure and on_probe_error',
        sourceSlug: '/studio/fallback-conditions-when-on-failure/',
      },
      {
        anchor: 'use-fallback-applies-to-a-project',
        error: '--use-fallback applies to a project (hdrctl run <project>), not to a single job: jobs/load_orders',
        cause: 'A job folder was given where a project folder is expected.',
        fix: 'Give the project folder, for example `hdrctl run .`',
        sourceTitle: 'Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback',
        sourceSlug: '/studio/dry-run-and-use-fallback/',
      },
      {
        anchor: 'workflow-has-no-fallback',
        error: "workflow 'wf_archive_alt' has no fallback in workflows/thread.yaml",
        cause: 'The name given to `--use-fallback` is the backup workflow, not the one that declares a fallback.',
        fix: 'Use the main workflow\'s name.',
        sourceTitle: 'Rehearse fallbacks in Hydra ETL: --dry-run and --use-fallback',
        sourceSlug: '/studio/dry-run-and-use-fallback/',
      },
    ],
  },

  {
    id: 'orchestration',
    title: 'Project orchestration',
    blurb: 'thread.yaml and the order the workflows run in.',
    entries: [
      {
        anchor: 'workflow-has-no-file',
        error: "workflows/thread.yaml: workflow 'ghost' has no file workflows/ghost.yaml",
        cause: 'A workflow named in the thread has no file on disk.',
        fix: 'Create the file, or remove the entry from the thread.',
        sourceTitle: 'Check the execution order of a Hydra project for errors',
        sourceSlug: '/studio/check-the-execution-order/',
      },
      {
        anchor: 'loop-goes-back',
        error: "workflows/thread.yaml: loop prepare -> report: 'report' must come before 'prepare' in the thread (a loop goes back)",
        cause: 'A loop names a workflow that is not in the thread, or `to` comes after `from`.',
        fix: 'Use names from the thread, and put `to` before `from`.',
        sourceTitle: 'Orchestrate a Hydra project from thread.yaml',
        sourceSlug: '/studio/orchestrate-from-thread-yaml/',
      },
    ],
  },

  {
    id: 'remote',
    title: 'Remote connections',
    blurb: 'The engine reaches out to a server and does not get in.',
    entries: [
      {
        anchor: 'snowflake-connection-failed',
        error: 'ValueError: SnowflakeConnector [src]: connection failed. DSN : snowflake://demo_user@xy12345.example/SALES/PUBLIC Error: DatabaseError: 250001 (08001): Failed to login: HTTP request failed after retries: login request. invalid peer certificate:',
        cause: 'The account, the user or the address is wrong, so the login never reaches a real Snowflake account.',
        fix: 'Read the DSN line in the message, and test with an account you own.',
        sourceTitle: 'Advanced sources: Snowflake, BigQuery and CDC',
        sourceSlug: '/cli/guides/configure-snowflake-bigquery-and-cdc-sources/',
      },
      {
        anchor: 'postgres-cdc-connection-refused',
        error: 'ValueError: PostgreSQLCDCConnector [src]: database connection failed. DSN : postgresql://demo_user:***@127.0.0.1:5499/shop?slot=hydra_orders&publication=hydra_orders Error: OperationalError: connection to server at "127.0.0.1", port 5499 failed: Connection refused …',
        cause: 'Nothing listens on that host and port.',
        fix: 'Start the server, or fix the port.',
        sourceTitle: 'Advanced sources: Snowflake, BigQuery and CDC',
        sourceSlug: '/cli/guides/configure-snowflake-bigquery-and-cdc-sources/',
        note: 'The password is masked in the DSN that Hydra prints.',
      },
    ],
  },

  {
    id: 'mcp',
    title: 'MCP server',
    blurb: 'An AI assistant drives Hydra and is refused.',
    entries: [
      {
        anchor: 'mcp-folder-not-found',
        error: '❌ Folder not found: nope',
        cause: 'The `--path` given is not an existing folder.',
        fix: 'Give an existing project folder.',
        sourceTitle: 'Connect Claude Code to Hydra ETL with the MCP server',
        sourceSlug: '/cli/guides/connect-claude-code-to-hydra-etl-with-mcp/',
      },
      {
        anchor: 'mcp-absolute-path-refused',
        error: "REFUSED — Absolute path refused: 'C:/Windows'. Give a path relative to",
        cause: 'The assistant asked for a path outside the project. The server refuses it by design.',
        fix: 'Give a path relative to the project.',
        sourceTitle: 'Connect Claude Code to Hydra ETL with the MCP server',
        sourceSlug: '/cli/guides/connect-claude-code-to-hydra-etl-with-mcp/',
      },
    ],
  },

  {
    id: 'studio-ui',
    title: 'Studio says no, without a message',
    blurb: 'A badge, a dimmed node, a field that turns red. No error line to search for.',
    entries: [
      {
        anchor: 'valid-badge-but-red-node',
        error: 'The job reads Valid, but a node carries a red badge',
        cause: 'The badge checks the graph, not each node\'s configuration. A required field inside the node is empty.',
        fix: 'Double-click the node and fill the field marked with a red asterisk.',
        sourceTitle: 'Hydra Studio Valid badge: what it checks and what it does not',
        sourceSlug: '/studio/09-reach-valid/',
      },
      {
        anchor: 'edge-refuses-to-connect',
        error: 'An edge refuses to connect',
        cause: 'The drag started from a left handle.',
        fix: 'Drag from a right handle to a left handle.',
        sourceTitle: 'Read the Hydra Studio canvas: nodes, ports and edges',
        sourceSlug: '/studio/03-read-the-canvas/',
      },
      {
        anchor: 'shell-action-dimmed',
        error: 'Bash or PowerShell cannot be dragged from the palette',
        cause: 'A shell action is tied to an operating system, and Studio dims the one the host does not provide.',
        fix: 'Use the other shell action, or the Python action for something portable.',
        sourceTitle: 'Hydra Studio node palette: sources, transformations, destinations and actions',
        sourceSlug: '/studio/04-use-the-palette/',
      },
      {
        anchor: 'unable-to-archive',
        error: 'Unable to archive…: remove it from the Workflow configuration canvas first',
        cause: 'The job is still placed on the workflow canvas.',
        fix: 'Remove the node, then archive.',
        sourceTitle: 'Create a job in Hydra Studio and add its source',
        sourceSlug: '/studio/05-add-a-source/',
      },
      {
        anchor: 'wait-field-turns-red',
        error: 'The wait field turns red',
        cause: 'The value is not a number or a duration.',
        fix: 'Use a duration such as `500ms`, `30s`, `5m` or `1h`.',
        sourceTitle: 'Define the execution order of a Hydra project in Studio',
        sourceSlug: '/studio/define-the-execution-order/',
      },
      {
        anchor: 'set-param-fails-at-runtime',
        error: 'Set Param fails at run time',
        cause: 'The parameter already exists in the project.',
        fix: 'Use Assign Param to change a value that exists.',
        sourceTitle: 'Hydra Studio node palette: sources, transformations, destinations and actions',
        sourceSlug: '/studio/04-use-the-palette/',
      },
    ],
  },
];

export const errorCount = errorSections.reduce((n, s) => n + s.entries.length, 0);
