export type Editorial = {
  objective: string;
  example: string;
  explanation: string;
  tip: string;
  pitfall: string;
};

// A single example project, `shop`, is used throughout this reference.
export const cliEditorial: Record<string, Editorial> = {
  clear: {
    objective: 'Clear the terminal display before reading fresh CLI output.',
    example: 'hdrctl clear', explanation: 'The screen is cleared; the shop project and its run history are untouched.',
    tip: 'Use this before a long validation or run log.', pitfall: 'Clearing the screen does not reset a failed run or remove project files.'
  },
  init: {
    objective: 'Create a Hydra project with its first job, workflow and configuration files.',
    example: 'hdrctl init shop', explanation: 'Creates the shop project with jobs/job1, workflows/workflow1.yaml, thread.yaml and parameters.yaml.',
    tip: 'Use hdrctl init . inside an empty folder to make that folder the project root.', pitfall: 'An unrelated nonempty folder is rejected; init does not overwrite it.'
  },
  list: {
    objective: 'List jobs found in a folder or project.',
    example: 'hdrctl list shop', explanation: 'Shows the jobs in shop and the workflows that use them.',
    tip: 'Inside a project, hdrctl list and hdrctl job list provide the same project inventory.', pitfall: 'This is an inventory command; it does not validate a job or run it.'
  },
  run: {
    objective: 'Execute a single job or all workflows of a project.',
    example: 'hdrctl run shop --env dev -P min_amount=50', explanation: 'Runs the shop project in thread order using dev values and a one-run override for min_amount.',
    tip: 'Start with --dry-run, then use -vv or --profile when you need more detail.', pitfall: 'A project path runs the project; a job path runs only that job. Triggers are ignored during a direct run.'
  },
  test: {
    objective: 'Check a job’s files, sources, destinations and transformations.',
    example: 'hdrctl test shop/jobs/job1 --only-sources', explanation: 'Checks the source side of job1 without executing its pipeline.',
    tip: 'Use --only-sources, --only-destinations or --only-transform to isolate a failure.', pitfall: 'test can inspect access to external systems; use validate when you only want to check YAML without reading data.'
  },
  validate: {
    objective: 'Validate a job’s YAML declarations without reading data.',
    example: 'hdrctl validate shop/jobs/job1 --strict', explanation: 'Checks job1 and applies stricter column, type and expression checks.',
    tip: 'Run this before test and run to catch declaration errors early.', pitfall: 'A valid manifest does not prove a database is reachable; use test for connection checks.'
  },
  serve: {
    objective: 'Start the Hydra API and bundled Studio.',
    example: 'hdrctl serve --workspace . --open', explanation: 'From the parent folder of shop, serves Studio and the API, then opens the browser.',
    tip: 'Use --no-studio when you only need the API; the default bind address is local.', pitfall: 'Installing the basic CLI alone may not provide server dependencies; install hydra-etl[server] first.'
  },
  watch: {
    objective: 'Keep one or more projects running under their file, interval and schedule triggers.',
    example: 'hdrctl watch shop --env prod', explanation: 'Watches the triggers in shop/triggers.yaml and supplies prod as the default environment.',
    tip: 'The watcher reloads changes to triggers.yaml without a restart.', pitfall: 'watch stays active until interrupted; a direct hdrctl run does not wait for triggers.'
  },
  job: {
    objective: 'Create jobs and manage their membership in project workflows.',
    example: 'hdrctl job list shop', explanation: 'Lists shop jobs and identifies which workflows reference each one.',
    tip: 'Use job add for a new job; use job attach for one that already exists.', pitfall: 'Detaching a job removes its workflow reference, not the job files.'
  },
  'job add': {
    objective: 'Create a job and optionally place it in a workflow.',
    example: 'hdrctl job add archive_orders daily_sales --project shop', explanation: 'Creates a new archive_orders job inside shop and attaches it to the existing daily_sales workflow.',
    tip: 'Omit the workflow name to create an independently runnable job.', pitfall: 'The workflow must exist before the job can be attached to it.'
  },
  'job attach': {
    objective: 'Add an existing job to a workflow.',
    example: 'hdrctl job attach job1 daily_sales --project shop', explanation: 'Adds the existing job1 job to daily_sales without creating another job.',
    tip: 'Use -p to choose its position in the workflow.', pitfall: 'Attaching a job does not create or validate its YAML files.'
  },
  'job detach': {
    objective: 'Remove a job from one workflow or from every workflow.',
    example: 'hdrctl job detach load_orders daily_sales --project shop', explanation: 'Removes load_orders from daily_sales while keeping its job folder in shop.',
    tip: 'Omit the workflow name only when you intend to detach the job everywhere.', pitfall: 'A detached job can still run directly with hdrctl run.'
  },
  'job list': {
    objective: 'Show project jobs and the workflows that use them.',
    example: 'hdrctl job list shop', explanation: 'Displays the jobs in shop together with their workflow membership.',
    tip: 'Use this after attach or detach to confirm the relationship.', pitfall: 'It does not show the success or failure of a previous run.'
  },
  workflow: {
    objective: 'Create, inspect, validate, run and recover project workflows.',
    example: 'hdrctl workflow list shop', explanation: 'Lists shop workflows in their thread order.',
    tip: 'Validate a workflow before running it, especially after changing dependencies.', pitfall: 'Running one workflow differs from running the whole project thread.'
  },
  'workflow add': {
    objective: 'Create a workflow and register it in thread.yaml.',
    example: 'hdrctl workflow add weekly_report --project shop', explanation: 'Creates shop/workflows/weekly_report.yaml and adds it to the project thread.',
    tip: 'Use --fallback-for when creating a recovery workflow for another workflow.', pitfall: 'An empty workflow still needs jobs or actions before it produces useful work.'
  },
  'workflow list': {
    objective: 'List workflows in project execution order.',
    example: 'hdrctl workflow list shop', explanation: 'Shows the workflows registered for shop in thread order.',
    tip: 'Use this after workflow add or remove to inspect thread.yaml indirectly.', pitfall: 'Listing does not validate step dependencies.'
  },
  'workflow remove': {
    objective: 'Remove a workflow from the project while retaining its jobs.',
    example: 'hdrctl workflow remove daily_sales --project shop', explanation: 'Removes daily_sales and its thread entry; its job directories remain available.',
    tip: 'List workflows first when unsure which name is registered.', pitfall: 'This changes project configuration; the jobs are kept but their orchestration is not.'
  },
  'workflow run': {
    objective: 'Run one workflow immediately, regardless of its trigger.',
    example: 'hdrctl workflow run daily_sales --project shop --env dev', explanation: 'Runs only daily_sales in shop with dev parameter values.',
    tip: 'Use hdrctl run shop when you want every workflow in the project thread.', pitfall: 'A direct workflow run ignores the trigger that normally starts it.'
  },
  'workflow undo': {
    objective: 'Finish a rollback that was interrupted or could not complete.',
    example: 'hdrctl workflow undo daily_sales --project shop', explanation: 'Resumes pending undo actions for daily_sales in reverse completion order.',
    tip: 'Inspect the failed run and its undo state before retrying the workflow.', pitfall: 'This applies to a workflow configured with rollback: true and a pending undo record.'
  },
  'workflow validate': {
    objective: 'Check a workflow manifest and its dependencies without running it.',
    example: 'hdrctl workflow validate daily_sales --project shop', explanation: 'Validates the daily_sales graph before any step executes.',
    tip: 'Run it after adding or reordering workflow steps.', pitfall: 'A valid graph does not prove every external job connection will work at run time.'
  },
  env: {
    objective: 'Manage global variables and named parameter environments.',
    example: 'hdrctl env list --project shop', explanation: 'Lists environments visible to shop, including their project-specific values.',
    tip: 'Keep environment names consistent across projects when they represent the same deployment stage.', pitfall: 'Global variables, project parameters and secrets have different storage and precedence rules.'
  },
  'env create': {
    objective: 'Create a named environment for global values and project parameter overrides.',
    example: 'hdrctl env create staging --project shop', explanation: 'Creates staging for shop and its corresponding global environment record.',
    tip: 'Use --global-only when there is no project environment file to create.', pitfall: 'Creating an environment does not automatically fill in required parameters or secrets.'
  },
  'env delete': {
    objective: 'Delete a named environment and its stored overrides.',
    example: 'hdrctl env delete test --project shop', explanation: 'Removes the test environment from shop after its files are backed up.',
    tip: 'Check env list and env show before deleting a shared name.', pitfall: 'Existing jobs or triggers that still name the deleted environment may fail.'
  },
  'env list': {
    objective: 'List common and named environments available to a project.',
    example: 'hdrctl env list --project shop', explanation: 'Shows shop environments alongside their global and project-specific values.',
    tip: 'Run this after creating or renaming an environment.', pitfall: 'The list is configuration inventory, not proof that external services are reachable.'
  },
  'env rename': {
    objective: 'Rename an environment and its associated values.',
    example: 'hdrctl env rename test qa --project shop', explanation: 'Renames the existing test environment to qa, including its variable, parameter and secret files.',
    tip: 'Search workflow and trigger references to the old name after renaming.', pitfall: 'A YAML file that still specifies staging does not automatically follow the rename.'
  },
  'env set': {
    objective: 'Set a global environment variable for all environments or one named environment.',
    example: 'hdrctl env set DB_HOST db.prod.local --env prod', explanation: 'Sets DB_HOST for the prod environment, available to Hydra when prod is active.',
    tip: 'Omit --env only for values that should apply everywhere.', pitfall: 'Use secret set for credentials; env set is for ordinary configuration values.'
  },
  'env show': {
    objective: 'Show the global variables of one environment.',
    example: 'hdrctl env show prod', explanation: 'Displays the global values associated with prod.',
    tip: 'Run without a name to inspect values shared by all environments.', pitfall: 'This does not display project parameter values; use param list for those.'
  },
  'env unset': {
    objective: 'Remove a global environment variable.',
    example: 'hdrctl env unset DB_HOST --env prod', explanation: 'Removes the prod-specific DB_HOST value while leaving other environments untouched.',
    tip: 'Use env show prod afterwards to verify the resulting configuration.', pitfall: 'A common value may still apply after a prod-specific override is removed.'
  },
  param: {
    objective: 'Declare project parameters and set their default or environment-specific values.',
    example: 'hdrctl param list --project shop', explanation: 'Shows shop parameters, their types, defaults and environment overrides.',
    tip: 'Use parameters for values referenced by {{ param:... }} in project manifests.', pitfall: 'A run-time -P override can replace the stored value for one execution.'
  },
  'param list': {
    objective: 'Display project parameters with their types and values by environment.',
    example: 'hdrctl param list --project shop', explanation: 'Displays each parameter defined for shop and its available overrides.',
    tip: 'Check this before using -P to distinguish defaults from environment values.', pitfall: 'Secrets are deliberately managed separately and do not belong in parameters.yaml.'
  },
  'param set': {
    objective: 'Declare a parameter or change its default or environment value.',
    example: 'hdrctl param set min_amount 50 --type int --project shop', explanation: 'Declares min_amount as an integer with a default of 50 in shop.',
    tip: 'Add --env prod to set only the prod override after declaring the parameter.', pitfall: 'A value that cannot be converted to the declared type is invalid.'
  },
  'param unset': {
    objective: 'Remove an environment override or remove an entire parameter.',
    example: 'hdrctl param unset min_amount --env prod --project shop', explanation: 'Removes only the prod override; the project default remains.',
    tip: 'Use param list afterwards to confirm which value will now be used.', pitfall: 'Without --env, the parameter declaration itself is removed.'
  },
  secret: {
    objective: 'Store and manage project secrets without showing their values.',
    example: 'hdrctl secret list --project shop', explanation: 'Lists secret names configured for shop while hiding their values.',
    tip: 'Use separate environment values for dev and prod credentials.', pitfall: 'Do not put passwords in shell arguments, YAML parameter defaults or committed files.'
  },
  'secret delete': {
    objective: 'Remove a stored secret from the project or a named environment.',
    example: 'hdrctl secret delete DB_PASSWORD --env test --project shop', explanation: 'Deletes the test value of DB_PASSWORD in shop.',
    tip: 'Use secret list --env test to verify the name is gone.', pitfall: 'Jobs using that secret will fail to resolve it unless another source provides it.'
  },
  'secret list': {
    objective: 'List secret names without revealing secret values.',
    example: 'hdrctl secret list --env prod --project shop', explanation: 'Shows which secret names are present for the prod environment of shop.',
    tip: 'Use it to check setup before a production run.', pitfall: 'A listed name does not prove its credential is valid at the destination.'
  },
  'secret set': {
    objective: 'Set a secret through hidden input or standard input.',
    example: 'hdrctl secret set DB_PASSWORD --env prod --project shop', explanation: 'Prompts for the prod database password without placing it in the command line.',
    tip: 'Use --stdin when a trusted automation supplies the value securely.', pitfall: 'Never append the secret value as an argument; this command intentionally does not accept one.'
  },
  trigger: {
    objective: 'Inspect, validate and invoke triggers defined in a project’s triggers.yaml.',
    example: 'hdrctl trigger list --project shop', explanation: 'Shows the triggers configured for shop and their last run.',
    tip: 'Validate trigger definitions before starting watch or serve.', pitfall: 'Adding a trigger to YAML does not itself start a watcher.'
  },
  'trigger fire': {
    objective: 'Run a project immediately using one trigger’s settings.',
    example: 'hdrctl trigger fire nightly --project shop --env prod', explanation: 'Starts shop as nightly would, applying its workflow, parameter and retry settings.',
    tip: 'Use --no-retry when you need one diagnostic attempt.', pitfall: 'This performs a real project run; it is not a dry-run validator.'
  },
  'trigger history': {
    objective: 'Read runs started by project triggers.',
    example: 'hdrctl trigger history nightly --project shop', explanation: 'Displays recent runs recorded for the nightly trigger in shop.',
    tip: 'Omit the trigger name to see history across all triggers.', pitfall: 'Direct hdrctl run invocations are not the same as runs recorded under a trigger.'
  },
  'trigger list': {
    objective: 'List project triggers and their most recent run.',
    example: 'hdrctl trigger list --project shop', explanation: 'Displays the trigger names in shop/triggers.yaml and last-run information.',
    tip: 'Use this to confirm a new trigger is visible before firing it.', pitfall: 'A listed trigger can still be invalid; run trigger validate.'
  },
  'trigger token': {
    objective: 'Create a webhook token and save it as a project secret.',
    example: 'hdrctl trigger token on_push --project shop --env prod', explanation: 'Creates the prod token for the on_push webhook and prints its value once.',
    tip: 'Store the displayed value immediately in the webhook caller’s secret store.', pitfall: '--rotate invalidates the old token; update the caller before relying on the webhook again.'
  },
  'trigger validate': {
    objective: 'Check triggers.yaml, including schedules and referenced workflows.',
    example: 'hdrctl trigger validate --project shop', explanation: 'Validates shop trigger definitions without starting a watcher.',
    tip: 'Run this after changing cron expressions or workflow names.', pitfall: 'Validation does not start a scheduler or prove that a webhook caller can reach the API.'
  },
  mcp: {
    objective: 'Connect an AI assistant to a Hydra project through its MCP server.',
    example: 'hdrctl mcp setup --path shop', explanation: 'Configures the supported Claude Code connection for shop.',
    tip: 'Review the generated configuration before launching the assistant.', pitfall: 'The current CLI exposes setup for Claude Code; do not assume other clients are configured by this command.'
  },
  'mcp setup': {
    objective: 'Write a project .mcp.json configuration for Claude Code.',
    example: 'hdrctl mcp setup --path shop', explanation: 'Finds the root of shop and writes the MCP connection using the Python that runs hdrctl.',
    tip: 'Start Claude Code from the project root and inspect /mcp there.', pitfall: 'The configuration is project-specific; running setup in another folder targets a different project.'
  },
};
