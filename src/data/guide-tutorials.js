/*
 * Workshops published from the /guide catalogue.
 *
 * The catalogue is deliberately data-driven: the narrative and examples stay
 * specific to each Hydra element, while the page structure and interaction are
 * shared with the original CSV workshop.
 */

const baseDestination = `version: "1.0"
destinations:
  result:
    type: csv
    connection:
      base_path: "out"
    load:
      table: result.csv
      mode: replace`;

const baseSource = `version: "1.0"
sources:
  input:
    type: csv
    connection:
      base_path: "data"
    extract:
      table: input.csv`;

const basePipeline = (from = 'input', to = 'result') => `version: "1.0"
pipeline:
  from: ${from}
  to: ${to}`;

const SOURCE_SEEDS = [
  {
    name: 'json', title: 'Turning application events into rows', duration: 18,
    scenario: 'an application exports nested events as JSON',
    intro: 'The support team receives a JSON export containing one object per event. They need a flat, reproducible CSV for incident analysis.',
    question: 'How do you read JSON records in batches without writing a one-off conversion script?',
    constraints: ['Keep the original JSON untouched', 'Read large files in bounded batches', 'Make nested-field handling explicit', 'Produce a regenerable CSV'],
    inputFile: 'data/events.json', input: `[
  {"id": 101, "kind": "login", "user": {"id": "U-7"}},
  {"id": 102, "kind": "purchase", "user": {"id": "U-9"}}
]`,
    source: `version: "1.0"
sources:
  events:
    type: json
    connection:
      base_path: "data"
    extract:
      table: events.json
      batch_size: 1000
      flatten_depth: 1`,
    result: `id,kind,user.id
101,login,U-7
102,purchase,U-9`, rows: '2 rows read · 2 written',
    trap: '`flatten_depth: 1` flattens one object level; arrays remain values and may need a later transform.'
  },
  {
    name: 'parquet', title: 'Reading an analytics extract efficiently', duration: 16,
    scenario: 'analytics delivers a typed Parquet snapshot',
    intro: 'A reporting job produces a compact Parquet file every night. The downstream team needs selected rows without losing the column types.',
    question: 'How do you ingest a Parquet snapshot while preserving its typed, columnar data?',
    constraints: ['Preserve numeric and date types', 'Avoid converting the source to CSV first', 'Read by batches', 'Keep the output reproducible'],
    inputFile: 'data/orders.parquet', input: `Parquet schema
order_id: string
amount: double
ordered_at: timestamp

row groups: 2 · rows: 12,480`,
    source: `version: "1.0"
sources:
  orders:
    type: parquet
    connection:
      base_path: "data"
    extract:
      table: orders.parquet
      batch_size: 5000`,
    result: `Rows read   : 12480
Rows written: 12480
Types kept  : string, float, datetime`, rows: '12,480 rows read · types preserved',
    trap: 'Parquet already carries a schema. Add a `cast` only when the business type must differ from the stored type.'
  },
  {
    name: 'postgresql', title: 'Extracting paid orders from PostgreSQL', duration: 24,
    scenario: 'orders live in a production PostgreSQL database',
    intro: 'Finance needs a daily extract of paid orders. Credentials must stay outside YAML and the database should do the filtering.',
    question: 'How do you connect safely and extract only the useful rows from PostgreSQL?',
    constraints: ['Keep credentials in environment variables', 'Push the predicate to PostgreSQL', 'Stream rows in batches', 'Write a traceable snapshot'],
    inputFile: '.env.example', input: `PG_HOST=localhost
PG_PORT=5432
PG_USER=hydra_reader
PG_PASSWORD=replace-me
PG_DATABASE=shop`,
    source: `version: "1.0"
sources:
  paid_orders:
    type: postgresql
    connection:
      host: \${ENV:PG_HOST}
      port: \${ENV:PG_PORT}
      user: \${ENV:PG_USER}
      password: \${ENV:PG_PASSWORD}
      database: \${ENV:PG_DATABASE}
    extract:
      query: "SELECT order_id, amount, paid_at FROM orders WHERE status = 'paid'"
      batch_size: 5000`,
    result: `Rows read   : 842
Rows written: 842
Query        : executed by PostgreSQL`, rows: '842 paid orders exported',
    trap: 'Use a read-only database account. Hydra resolves `${ENV:…}` before opening the connection.'
  },
  {
    name: 'mysql', title: 'Exporting the customer table from MySQL', duration: 22,
    scenario: 'a customer directory is stored in MySQL',
    intro: 'The CRM team needs a daily customer snapshot. The table is too large to load into memory in one pass.',
    question: 'How do you stream a MySQL table through Hydra with no password in the manifest?',
    constraints: ['Use environment-backed credentials', 'Read a bounded batch at a time', 'Select a stable table', 'Produce a replaceable snapshot'],
    inputFile: '.env.example', input: `MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=hydra_reader
MYSQL_PASSWORD=replace-me
MYSQL_DATABASE=crm`,
    source: `version: "1.0"
sources:
  customers:
    type: mysql
    connection:
      host: \${ENV:MYSQL_HOST}
      port: \${ENV:MYSQL_PORT}
      user: \${ENV:MYSQL_USER}
      password: \${ENV:MYSQL_PASSWORD}
      database: \${ENV:MYSQL_DATABASE}
    extract:
      table: customers
      batch_size: 5000`,
    result: `Rows read   : 15320
Rows written: 15320
Batches      : 4`, rows: '15,320 customers · four batches',
    trap: '`batch_size` controls memory pressure; it does not add a SQL `LIMIT` to the full extraction.'
  },
  {
    name: 'mongodb', title: 'Flattening customer documents from MongoDB', duration: 26,
    scenario: 'customer profiles are nested MongoDB documents',
    intro: 'Operations needs a tabular customer list, but addresses are nested and documents can drift over time.',
    question: 'How do you read a MongoDB collection and make the expected fields explicit?',
    constraints: ['Keep the URI outside source control', 'Select one collection', 'Flatten named nested fields', 'Warn when documents drift'],
    inputFile: 'sample document', input: `{
  "customer_id": "C-14",
  "name": "Amina Diallo",
  "address": {"city": "Lille"},
  "active": true
}`,
    source: `version: "1.0"
sources:
  customers:
    type: mongodb
    connection:
      uri: \${ENV:MONGODB_URI}
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
      drift_policy: warn`,
    result: `customer_id,city
C-14,Lille
C-18,Paris`, rows: '2 active profiles flattened',
    trap: 'A manual schema is a contract: unknown fields follow `drift_policy`, while required missing fields are validation events.'
  },
  {
    name: 'web_api', title: 'Collecting every page of a REST API', duration: 28,
    scenario: 'a partner exposes paginated orders over HTTPS',
    intro: 'A partner API returns one hundred orders at a time and protects the endpoint with a bearer token.',
    question: 'How do you authenticate, paginate and turn API responses into Hydra batches?',
    constraints: ['Never write the token in YAML', 'Follow pagination until completion', 'Bound request and batch sizes', 'Extract only the records array'],
    inputFile: 'HTTP response', input: `GET /v1/orders?offset=0&limit=100

{
  "items": [{"id": "O-1", "amount": 72.5}],
  "next_offset": 100
}`,
    source: `version: "1.0"
sources:
  partner_orders:
    type: web_api
    connection:
      base_url: "https://api.partner.example"
      timeout_read: 30
      auth:
        type: bearer
        token: \${ENV:PARTNER_API_TOKEN}
      pagination:
        strategy: offset
        page_size: 100
    extract:
      table: /v1/orders
      batch_size: 100`,
    result: `Requests      : 4
Rows read     : 327
Rows written  : 327
Last page     : 27 records`, rows: '327 orders · four requests',
    trap: 'Pagination belongs to the connector. A transform never needs to know which HTTP page produced a row.'
  }
];

const DESTINATION_SEEDS = [
  {name:'csv', title:'Publishing a regenerable CSV export', scenario:'a finance extract must open everywhere', type:'csv', connection:'      base_path: "out"', load:'      table: paid_orders.csv\n      mode: replace', result:'order_id,amount\nO-101,120.5\nO-104,83.0', note:'`replace` makes reruns idempotent; choose `append` only for a deliberately growing history.'},
  {name:'json', title:'Publishing records as JSON', scenario:'an application consumes structured records', type:'json', connection:'      base_path: "out"', load:'      table: customers.json\n      mode: replace', result:'[{"customer_id":"C-1","active":true},{"customer_id":"C-2","active":false}]', note:'JSON keeps booleans and numbers as values instead of formatting every cell as text.'},
  {name:'parquet', title:'Writing a compact Parquet snapshot', scenario:'analytics needs a typed columnar snapshot', type:'parquet', connection:'      base_path: "out"', load:'      table: orders.parquet\n      mode: replace', result:'orders.parquet\nrows: 25,000\namount: double · ordered_at: timestamp', note:'Parquet append requires compatible schemas. Use `replace` for a full daily snapshot.'},
  {name:'postgresql', title:'Upserting customers into PostgreSQL', scenario:'a warehouse table must reflect the latest customer state', type:'postgresql', connection:'      host: ${ENV:PG_HOST}\n      port: ${ENV:PG_PORT}\n      user: ${ENV:PG_USER}\n      password: ${ENV:PG_PASSWORD}\n      database: warehouse', load:'      table: dim_customer\n      mode: upsert\n      key: [customer_id]', result:'Inserted: 18\nUpdated : 73\nUnchanged keys preserved: yes', note:'`upsert` requires a key present in every batch and a matching unique constraint is recommended on the target.'},
  {name:'mysql', title:'Loading inventory into MySQL', scenario:'the operational inventory table needs current quantities', type:'mysql', connection:'      host: ${ENV:MYSQL_HOST}\n      port: ${ENV:MYSQL_PORT}\n      user: ${ENV:MYSQL_USER}\n      password: ${ENV:MYSQL_PASSWORD}\n      database: operations', load:'      table: inventory\n      mode: upsert\n      key: [sku]', result:'Inserted: 12\nUpdated : 418\nRows in inventory: 430', note:'Use a dedicated writer account and grant only the target table permissions it needs.'},
  {name:'mongodb', title:'Loading product documents into MongoDB', scenario:'a catalogue service consumes product documents', type:'mongodb', connection:'      uri: ${ENV:MONGODB_URI}\n      database: catalogue', load:'      collection: products\n      mode: upsert\n      key: [sku]', result:'{"sku":"SKU-10","name":"Desk lamp","price":39.9}\n{"sku":"SKU-11","name":"Chair","price":129.0}', note:'For repeatable loads, make the upsert key unique in the collection.'},
  {name:'web_api', title:'Delivering records to a Web API', scenario:'a partner accepts completed orders through an API', type:'web_api', connection:'      base_url: "https://api.partner.example"\n      timeout_read: 30', load:'      table: /v1/completed-orders\n      mode: append\n      batch_size: 100', result:'POST requests : 3\nAccepted rows : 243\nRejected rows : 0', note:'The Web API destination is beta: confirm that its writer plugin is installed before relying on this load.'}
];

const TRANSFORM_SEEDS = [
  {name:'filter', title:'Keeping only actionable orders', scenario:'support only needs overdue orders', yaml:'  - filter:\n      expr: "status == \'open\' and days_overdue > 7"', before:'id,status,days_overdue\n1,open,12\n2,paid,20\n3,open,3', after:'id,status,days_overdue\n1,open,12', lesson:'The expression is boolean. Rows for which it evaluates to false do not reach later steps.'},
  {name:'select', title:'Publishing only approved columns', scenario:'a partner must not receive internal fields', yaml:'  - select:\n      columns: [customer_id, city, segment]', before:'customer_id,email,city,segment,internal_score\nC-1,a@example.test,Paris,A,91', after:'customer_id,city,segment\nC-1,Paris,A', lesson:'`select` is an allow-list. A new source column stays private until explicitly added.'},
  {name:'rename', title:'Aligning columns with a target contract', scenario:'a target expects canonical column names', yaml:'  - rename:\n      mapping:\n        customerId: customer_id\n        orderTotal: order_total', before:'customerId,orderTotal\nC-1,140.5', after:'customer_id,order_total\nC-1,140.5', lesson:'The mapping reads old name → new name. Later steps must use the new names.'},
  {name:'cast', title:'Giving text values real types', scenario:'a CSV contains numbers and dates as text', yaml:'  - cast:\n      mapping:\n        quantity: int\n        amount: float\n        ordered_at: datetime', before:'quantity,amount,ordered_at\n"2","19.95","2026-08-01T09:30:00"', after:'quantity:int,amount:float,ordered_at:datetime\n2,19.95,2026-08-01 09:30:00', lesson:'Cast before comparing, sorting or calculating with a text column.'},
  {name:'calculate', title:'Computing line totals', scenario:'order lines contain price and quantity but no total', yaml:'  - calculate:\n      column: line_total\n      expr: "unit_price * quantity"', before:'sku,unit_price,quantity\nA-1,12.5,3', after:'sku,unit_price,quantity,line_total\nA-1,12.5,3,37.5', lesson:'The expression sees the current row columns and adds one named output column.'},
  {name:'sort', title:'Ranking products by revenue', scenario:'a report must show the highest revenue first', yaml:'  - sort:\n      by: [revenue, sku]\n      ascending: false', before:'sku,revenue\nB,80\nA,120\nC,95', after:'sku,revenue\nA,120\nC,95\nB,80', lesson:'All named sort keys use the declared direction; add a stable tie-breaker such as `sku`.'},
  {name:'deduplicate', title:'Keeping one event per identifier', scenario:'an export repeats events after retries', yaml:'  - deduplicate:\n      columns: [event_id]\n      keep: last', before:'event_id,status\nE-1,pending\nE-1,complete\nE-2,complete', after:'event_id,status\nE-1,complete\nE-2,complete', lesson:'Sort first when “last” depends on time; otherwise last means current row order.'},
  {name:'aggregate', title:'Summarising revenue by city', scenario:'management needs totals, not order lines', yaml:'  - aggregate:\n      by: [city]\n      agg:\n        revenue: {func: sum, col: amount}\n        orders: {func: count, col: order_id}', before:'order_id,city,amount\n1,Paris,80\n2,Lyon,50\n3,Paris,40', after:'city,revenue,orders\nLyon,50,1\nParis,120,2', lesson:'Every output metric names both its function and its source column.'},
  {name:'join', title:'Enriching orders with customer segments', scenario:'orders and customer reference data live separately', yaml:'  - join:\n      right: customers\n      key: customer_id\n      how: left', before:'orders: order_id,customer_id,amount\nO-1,C-7,90\ncustomers: customer_id,segment\nC-7,Gold', after:'order_id,customer_id,amount,segment\nO-1,C-7,90,Gold', lesson:'A left join preserves every order; unmatched reference fields become null.'},
  {name:'clean', title:'Normalising messy customer names', scenario:'names contain mixed case and repeated spaces', yaml:'  - clean:\n      columns: [name, city]\n      case: lower', before:'name,city\n"  AMINA   DIALLO "," PARIS "', after:'name,city\n"amina diallo","paris"', lesson:'`clean` trims, collapses repeated whitespace and optionally normalises case.'},
  {name:'fill_null', title:'Providing defaults for missing values', scenario:'a report cannot display blank regions', yaml:'  - fill_null:\n      columns:\n        region: Unknown\n        quantity: 0', before:'sku,region,quantity\nA-1,,3\nA-2,West,', after:'sku,region,quantity\nA-1,Unknown,3\nA-2,West,0', lesson:'Column-specific defaults preserve meaning better than one global replacement.'},
  {name:'trim', title:'Removing invisible whitespace', scenario:'identifiers arrive padded with spaces', yaml:'  - trim:\n      columns: [customer_id, postal_code]', before:'customer_id,postal_code\n" C-17 "," 75010"', after:'customer_id,postal_code\nC-17,75010', lesson:'Trim changes text boundaries only; it does not alter case or internal spaces.'},
  {name:'pivot', title:'Turning monthly rows into report columns', scenario:'a spreadsheet expects one column per month', yaml:'  - pivot:\n      index: [product]\n      column: month\n      values: revenue\n      aggfunc: sum', before:'product,month,revenue\nLamp,Jan,20\nLamp,Feb,30\nChair,Jan,50', after:'product,Jan,Feb\nChair,50,\nLamp,20,30', lesson:'Duplicate product/month pairs are combined with `aggfunc`.'},
  {name:'unpivot', title:'Turning month columns into rows', scenario:'analytics expects tidy long-form data', yaml:'  - unpivot:\n      id_vars: [product]\n      value_vars: [Jan, Feb]\n      var_name: month\n      value_name: revenue', before:'product,Jan,Feb\nLamp,20,30\nChair,50,40', after:'product,month,revenue\nLamp,Jan,20\nChair,Jan,50\nLamp,Feb,30\nChair,Feb,40', lesson:'Identifier columns are repeated; every selected value column becomes a row.'},
  {name:'transpose', title:'Rotating a compact metric table', scenario:'metrics arrive vertically but a consumer expects columns', yaml:'  - transpose:\n      index_col: metric\n      header_name: field', before:'metric,value\nrevenue,120\norders,8', after:'field,revenue,orders\nvalue,120,8', lesson:'Transposition changes the whole table shape; use it on small, deliberate matrices.'},
  {name:'merge', title:'Synchronising a master customer set', scenario:'a current master must absorb a corrected feed', yaml:'  - merge:\n      right: corrections\n      key: customer_id\n      delete_unmatched: false', before:'master: C-1,Paris · C-2,Lyon\ncorrections: C-2,Lille · C-3,Nantes', after:'customer_id,city\nC-1,Paris\nC-2,Lille\nC-3,Nantes', lesson:'Matching rows update, new keys insert, and unmatched left rows stay unless explicitly deleted.'},
  {name:'union', title:'Combining regional order feeds', scenario:'North and South export the same columns separately', yaml:'  - union:\n      right: south_orders\n      distinct: true', before:'north: O-1,North · O-2,North\nsouth: O-2,North · O-3,South', after:'order_id,region\nO-1,North\nO-2,North\nO-3,South', lesson:'`distinct: false` is UNION ALL; `true` removes fully duplicated rows after stacking.'},
  {name:'script', title:'Implementing a reviewed custom rule', scenario:'a classification rule is too specific for built-in operations', yaml:'  - script:\n      inputs: [amount, country]\n      outputs:\n        risk_band: str\n      mode: row\n      code: |\n        risk_band = "high" if amount > 500 and country != "FR" else "standard"', before:'amount,country\n720,DE\n90,FR', after:'amount,country,risk_band\n720,DE,high\n90,FR,standard', lesson:'Declare the input/output contract; the restricted runtime exposes only those values.'}
];

const WORKFLOW_SEEDS = [
  {category:'workflows', name:'job', title:'Running a Hydra job as a workflow step', scenario:'a daily flow must execute the sales job', yaml:'    - name: load_sales\n      type: job\n      job: ./jobs/sales', result:'load_sales  succeeded  842 rows', lesson:'A job step points to a job folder. The workflow records its status and duration.'},
  {category:'workflows', name:'action', title:'Sending a notification action', scenario:'operations needs a completion message', yaml:'    - name: load_sales\n      type: job\n      job: ./jobs/sales\n    - name: announce\n      type: action\n      action: log\n      params:\n        message: "Daily load completed"\n      depends_on: [load_sales]', result:'load_sales  succeeded\nannounce    succeeded  Daily load completed', lesson:'Actions perform side effects around jobs; dependencies prevent early notification.'},
  {category:'workflows', name:'depends_on', title:'Running independent jobs in parallel', scenario:'sales and inventory can load at the same time', yaml:'    - name: sales\n      type: job\n      job: ./jobs/sales\n    - name: inventory\n      type: job\n      job: ./jobs/inventory\n    - name: publish\n      type: job\n      job: ./jobs/publish\n      depends_on: [sales, inventory]', result:'sales      succeeded ┐\ninventory  succeeded ├─ parallel\npublish    succeeded ┘ after both', lesson:'Dependencies form a DAG. Steps with no unmet dependency are eligible to run together.'},
  {category:'workflows', name:'when', title:'Guarding a workflow step with an expression', scenario:'a costly export should run only in production', yaml:'    - name: publish\n      type: job\n      job: ./jobs/publish\n      when: "params.environment == \'production\'"', result:'environment=staging    publish skipped\nenvironment=production publish succeeded', lesson:'A false guard is a controlled skip, not a failure.'},
  {category:'workflows', name:'on_failure', title:'Choosing what happens after a failed step', scenario:'a non-critical notification must not block the load', yaml:'    - name: notify\n      type: action\n      action: webhook\n      params:\n        url: ${ENV:OPS_WEBHOOK_URL}\n      on_failure: continue\n    - name: load_sales\n      type: job\n      job: ./jobs/sales\n      depends_on: [notify]', result:'notify      failed · continued\nload_sales  succeeded', lesson:'Use `continue` only when downstream work remains valid without the failed step.'},
  {category:'triggers', name:'manual', title:'Running a workflow on demand', scenario:'an operator controls when a recovery flow starts', trigger:'  trigger:\n    type: manual', result:'Trigger: manual\nRun: started by operator\nStatus: succeeded', lesson:'Manual is the default and safest trigger while a workflow is being developed.'},
  {category:'triggers', name:'schedule', title:'Scheduling a workflow every morning', scenario:'the warehouse refresh must start at 06:00 daily', trigger:'  trigger:\n    type: schedule\n    cron: "0 6 * * *"', result:'Schedule: 0 6 * * *\nNext run: 06:00\nTimezone: scheduler configuration', lesson:'Cron says when; the scheduler timezone decides which 06:00 it means.'},
  {category:'triggers', name:'webhook', title:'Starting a workflow from a webhook', scenario:'a source system announces when an export is ready', trigger:'  trigger:\n    type: webhook', result:'POST /workflow/run\nworkflow: import_partner\nstatus: accepted', lesson:'Validate and authenticate the incoming request at the API boundary before starting work.'},
  {category:'policies', name:'retry', title:'Retrying a transiently failing step', scenario:'a partner endpoint sometimes returns a temporary error', yaml:'    - name: fetch_partner\n      type: job\n      job: ./jobs/partner\n      retry:\n        max: 2\n        delay: 5\n        backoff: exponential', result:'attempt 1  failed\nwait 5 s\nattempt 2  succeeded\nworkflow    succeeded', lesson:'`max` counts retries after the first attempt. Success stops the policy immediately.'}
];

function workshopBase({category, name, title, duration = 20, scenario, intro, question, constraints, solution, steps, expected, reading, lesson}) {
  const route = `/guide/${category}/${name}`;
  return {
    key: `${category}-${name}`, category, name, route, title, duration,
    lead: intro || `A practical workshop for ${scenario}. Build the smallest manifest, validate it, run it and read the result.`,
    contextTitle: `Context — ${scenario}`,
    context: intro || `The task is currently manual and its assumptions are not recorded. Hydra turns it into files that can be reviewed and rerun.`,
    question, constraints, solution, steps, expected, reading,
    answer: [
      ['Configuration explicit', 'yes', 'the relevant YAML block'],
      ['Safe rerun', 'yes', 'the destination or workflow policy'],
      ['Observable result', 'yes', 'the command output and counters'],
      ['Hidden manual rule', 'removed', 'the rule now lives in versioned text']
    ],
    before: `Before — ${scenario} requires a person to remember the order, options and checks.`,
    after: `After — one reviewed manifest and one command produce the same observable result.`,
    gain: `The durable gain is the contract: a colleague can read the configuration, reproduce the run and challenge the assumptions.`,
    lesson,
    related: [
      {label:'sources.yaml', href:'/dsl/sources-yaml', note:'declare inputs'},
      {label:'transformations.yaml', href:'/dsl/transformations-yaml', note:'order the operations'},
      {label:'destinations.yaml', href:'/dsl/destinations-yaml', note:'declare outputs'},
      {label:'workflow.yaml', href:'/dsl/workflow-yaml', note:'orchestrate jobs'},
      {label:'Tutorial — your first job', href:'/dsl/tutorial/01-first-job', note:'four files, line by line'}
    ]
  };
}

function sourceWorkshop(s) {
  const sourceId = s.name === 'postgresql' ? 'paid_orders' : s.name === 'web_api' ? 'partner_orders' : s.name === 'parquet' ? 'orders' : s.name === 'mongodb' || s.name === 'mysql' ? 'customers' : 'events';
  const steps = [
    {file:s.inputFile,title:'inspect the input',goal:'Identify the records and the contract you need.',bubble:'Start from a concrete sample, table or response.',context:'The source stays authoritative. This workshop reads it in place and records every assumption beside the job.',code:s.input,notes:[['ok','input shape identified']],status:'Step 1 · input understood'},
    {file:'sources.yaml',title:`declare the ${s.name} source`,goal:'Describe the connection and extraction.',bubble:'Connection says where; extract says what.',context:'The source identifier is yours. Pipeline wiring will refer to it by name, never by a duplicated connection block.',code:s.source,notes:[['ok',`<code>${sourceId}</code> is the pipeline-facing identifier`],['warn',s.trap]],status:'Step 2 · source declared'},
    {file:'destinations.yaml',title:'declare a reviewable output',goal:'Write the extracted rows to a local CSV.',bubble:'A simple destination makes source behaviour visible.',context:'During connector development, a local replaceable file is the shortest path from configuration to evidence.',code:baseDestination,notes:[['ok','replace keeps the inspection file stable']],status:'Step 3 · destination declared'},
    {file:'pipeline.yaml',title:'wire source to destination',goal:'Connect the two identifiers.',bubble:'No connection detail is repeated here.',context:'The pipeline stays small even when the connector configuration is detailed.',code:basePipeline(sourceId),notes:[['ok','the job now has one input and one output']],status:'Step 4 · job wired'},
    {file:'hdrctl test',title:'validate without reading data',goal:'Check the four manifest files.',bubble:'Configuration first, I/O second.',context:'Validation catches missing identifiers and malformed DSL before a remote system is contacted.',code:`$ hdrctl test ${s.name}-source\n\nok  sources.yaml      — ${s.name}\nok  destinations.yaml — csv, replace\nok  pipeline.yaml     — ${sourceId} → result\n\n✅ All tests pass — ready to execute.`,notes:[['ok','manifest valid; source not consumed yet']],status:'Step 5 · manifest valid'},
    {file:'hdrctl run',title:'run and read the counters',goal:'Execute the extraction once.',bubble:s.rows,context:'Rows read come from the connector. Rows written are what reached the destination after every step.',code:`$ hdrctl run ${s.name}-source\n\n✅ Pipeline completed successfully\n${s.result}`,notes:[['ok',s.rows]],status:`Done · ${s.rows}`}
  ];
  return workshopBase({category:'sources',name:s.name,title:s.title,duration:s.duration,scenario:s.scenario,intro:s.intro,question:s.question,constraints:s.constraints,solution:`A Hydra ${s.name} source, a local inspection destination and one pipeline command.`,steps,expected:[s.rows,'The source remains unchanged.','The connection and extraction contract are versioned.'],reading:`The source counter proves what the connector emitted. Compare it with the expected table, file or API count before adding business transforms.`,lesson:s.trap});
}

function destinationWorkshop(d) {
  const destination = `version: "1.0"
destinations:
  target:
    type: ${d.type}
    connection:
${d.connection}
    load:
${d.load}`;
  const steps = [
    {file:'data/input.csv',title:'prepare a deterministic input',goal:'Start from three known records.',bubble:'A tiny fixture makes load behaviour observable.',context:'Keep the fixture stable while choosing append, replace or upsert.',code:'id,name,amount\n1,Amina,120.5\n2,Lucas,83.0\n3,Sofia,49.9',notes:[['ok','three input records']],status:'Step 1 · fixture ready'},
    {file:'sources.yaml',title:'declare the input',goal:'Read the fixture as CSV.',bubble:'The source side stays deliberately simple.',context:'This workshop isolates destination behaviour: the same three rows feed every run.',code:baseSource,notes:[['ok','input is local and deterministic']],status:'Step 2 · source declared'},
    {file:'destinations.yaml',title:`declare the ${d.name} destination`,goal:'Describe the target and write mode.',bubble:'Load says where records land and how reruns behave.',context:'Secrets remain environment references. The YAML records only names, modes and public connection coordinates.',code:destination,notes:[['ok','target identifier ready'],['warn',d.note]],status:'Step 3 · destination declared'},
    {file:'pipeline.yaml',title:'wire the load',goal:'Connect input to target.',bubble:'Two identifiers make the executable path.',context:'No transform is needed to observe the connector contract.',code:basePipeline('input','target'),notes:[['ok','the three rows will reach the target']],status:'Step 4 · job wired'},
    {file:'hdrctl test',title:'validate the manifest',goal:'Catch shape and identifier mistakes.',bubble:'No target is changed during validation.',context:'A successful test is permission to attempt I/O, not proof that remote credentials work.',code:`$ hdrctl test ${d.name}-destination\n\nok  sources.yaml      — csv\nok  destinations.yaml — ${d.name}\nok  pipeline.yaml     — input → target\n\n✅ All tests pass — ready to execute.`,notes:[['ok','load configuration valid']],status:'Step 5 · manifest valid'},
    {file:'target result',title:'run and inspect the target',goal:'Execute once, then verify rows and mode.',bubble:'Three rows accepted by the destination.',context:'Run a second time to prove the chosen write mode has the intended effect.',code:`$ hdrctl run ${d.name}-destination\n\n✅ Pipeline completed successfully\nRows read   : 3\nRows written: 3\n\n${d.result}`,notes:[['ok','three rows written'],['ok','rerun behaviour matches the declared mode']],status:'Done · 3 rows written'}
  ];
  return workshopBase({category:'destinations',name:d.name,title:d.title,duration:20,scenario:d.scenario,question:`How do you load records into ${d.name} with explicit, testable rerun semantics?`,constraints:['Keep credentials outside YAML','Choose append, replace or upsert deliberately','Validate before touching the target','Verify the target after a second run'],solution:`A Hydra ${d.name} destination wired to a deterministic three-row fixture.`,steps,expected:['Three rows reach the target.','The chosen mode defines the second run.','Credentials remain outside the manifest.'],reading:'Rows written is the connector acceptance count. Confirm the physical target as well: files, tables, collections and APIs can impose constraints beyond the DSL.',lesson:d.note});
}

function transformWorkshop(t) {
  const transformations = `version: "1.0"
steps:
${t.yaml}`;
  const steps = [
    {file:'data/input.csv',title:'capture the before state',goal:'Use a minimal fixture that exposes the rule.',bubble:'Every row exists to prove one behaviour.',context:'A small counter-example is more useful than a large anonymous dataset while designing a transform.',code:t.before,notes:[['ok','before state recorded']],status:'Step 1 · fixture ready'},
    {file:'sources.yaml',title:'declare the fixture',goal:'Read the known input.',bubble:'Keep I/O boring while testing logic.',context:'The local CSV source makes the transformation the only moving part.',code:baseSource,notes:[['ok','input identifier is <code>input</code>']],status:'Step 2 · source declared'},
    {file:'transformations.yaml',title:`add the ${t.name} step`,goal:'Write one operation with explicit parameters.',bubble:'One mapping, expression or shape contract.',context:t.lesson,code:transformations,notes:[['ok',`one <code>${t.name}</code> operation declared`],['warn',t.lesson]],status:'Step 3 · transformation declared'},
    {file:'destinations.yaml + pipeline.yaml',title:'make the result observable',goal:'Write a replaceable CSV.',bubble:'The destination turns the rule into evidence.',context:'The pipeline uses the known source and a local output that can be regenerated.',code:`${baseDestination}\n\n---\n${basePipeline()}`,notes:[['ok','result.csv will contain the after state']],status:'Step 4 · job wired'},
    {file:'hdrctl test',title:'validate the operation',goal:'Ask Hydra to parse the step.',bubble:'The operation name and count must match.',context:'Validation checks the DSL contract. The run checks the rule against actual values.',code:`$ hdrctl test ${t.name}-workshop\n\nok  transformations.yaml — 1 step(s) valid\nOperations: ${t.name}\n\n✅ All tests pass — ready to execute.`,notes:[['ok',`one step counted: ${t.name}`]],status:'Step 5 · operation valid'},
    {file:'out/result.csv',title:'run and compare after to before',goal:'Inspect the exact output.',bubble:'The output demonstrates the transformation contract.',context:'If the result surprises you, reduce the fixture further before combining this operation with others.',code:`$ hdrctl run ${t.name}-workshop\n\n✅ Pipeline completed successfully\n\n${t.after}`,notes:[['ok','expected after state reproduced']],status:'Done · expected result reproduced'}
  ];
  return workshopBase({category:'transforms',name:t.name,title:t.title,duration:18,scenario:t.scenario,question:`How do you express this rule with Hydra’s ${t.name} operation and prove exactly what it changes?`,constraints:['Use one minimal input fixture','Declare one operation per step','Validate the DSL before running','Compare the complete before and after states'],solution:`One ${t.name} step between a deterministic CSV source and a replaceable CSV destination.`,steps,expected:['The after state matches the stated rule.','One operation is counted by `hdrctl test`.','The fixture can be rerun without accumulating rows.'],reading:`Compare columns, row count and ordering—not just one visible value. ${t.lesson}`,lesson:t.lesson});
}

function workflowWorkshop(w) {
  const trigger = w.trigger || '  trigger:\n    type: manual';
  const body = w.yaml || '    - name: load_sales\n      type: job\n      job: ./jobs/sales';
  const workflow = `workflow:
  version: "1.0"
  name: ${w.name}_workshop
  description: "${w.title}"
${trigger}
  steps:
${body}`;
  const steps = [
    {file:'workspace tree',title:'prepare the jobs and boundary',goal:'Name the work the workflow will coordinate.',bubble:'A workflow orchestrates jobs; it does not duplicate them.',context:'Each referenced job remains independently testable with `hdrctl test` and `hdrctl run`.',code:'workflow.yaml\njobs/\n  sales/\n  inventory/\n  publish/',notes:[['ok','job boundaries identified']],status:'Step 1 · workspace ready'},
    {file:'workflow.yaml',title:`declare ${w.name}`,goal:'Write the trigger, steps and policy.',bubble:'Names create the execution graph.',context:w.lesson,code:workflow,notes:[['ok','workflow contract declared'],['warn',w.lesson]],status:'Step 2 · workflow declared'},
    {file:'hdrctl workflow validate',title:'validate the graph',goal:'Catch missing jobs, duplicate names and invalid dependencies.',bubble:'Graph errors are cheaper before execution.',context:'Validation parses the workflow and checks its dependency structure.',code:`$ hdrctl workflow validate workflow.yaml\n\n✅ Workflow valid: ${w.name}_workshop\nSteps: ${w.name === 'depends_on' ? 3 : 1}`,notes:[['ok','workflow and dependency graph valid']],status:'Step 3 · workflow valid'},
    {file:'hdrctl workflow run',title:'run the workflow',goal:'Execute and follow step states.',bubble:'Every step receives a terminal status.',context:'The runner schedules ready steps and applies guards, dependencies and failure policies.',code:`$ hdrctl workflow run workflow.yaml\n\n${w.result}`,notes:[['ok','terminal states recorded']],status:'Step 4 · run complete'},
    {file:'run summary',title:'read the orchestration result',goal:'Distinguish success, skip, retry and continuation.',bubble:'The summary explains why each step ran—or did not.',context:'A workflow is answered by step-level evidence, not only one final green status.',code:w.result,notes:[['ok','result matches the declared orchestration rule']],status:'Done · behaviour verified'}
  ];
  return workshopBase({category:w.category,name:w.name,title:w.title,duration:20,scenario:w.scenario,question:`How do you make ${w.name} explicit in workflow.yaml and verify the resulting execution states?`,constraints:['Keep jobs independently runnable','Give every workflow step a unique name','Validate the graph before execution','Read every step status in the summary'],solution:'A small workflow.yaml, one validation command and one run with observable step states.',steps,expected:['The workflow validates before execution.',w.result.split('\n')[0],'The run summary explains every terminal state.'],reading:`Read the summary as a graph, not a flat log. ${w.lesson}`,lesson:w.lesson});
}

export const guideTutorials = [
  ...SOURCE_SEEDS.map(sourceWorkshop),
  ...DESTINATION_SEEDS.map(destinationWorkshop),
  ...TRANSFORM_SEEDS.map(transformWorkshop),
  ...WORKFLOW_SEEDS.map(workflowWorkshop)
];

export const guideTutorialByRoute = new Map(guideTutorials.map((tutorial) => [tutorial.route, tutorial]));
