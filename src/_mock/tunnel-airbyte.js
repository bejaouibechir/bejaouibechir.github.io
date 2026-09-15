var $=function(i){return document.getElementById(i)};
(function(){var t=localStorage.getItem('hydra-theme');if(t)document.documentElement.setAttribute('data-theme',t);
$("themeBtn").onclick=function(){var d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);localStorage.setItem('hydra-theme',n)};
var b=$("burger"),dr=$("drawer");b.onclick=function(){var o=dr.classList.toggle('open');b.setAttribute('aria-expanded',o)};
document.addEventListener('click',function(e){if(dr.classList.contains('open')&&!dr.contains(e.target)&&!b.contains(e.target)){dr.classList.remove('open');b.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open')){dr.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}});})();
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

var EX=[
{n:'Connection — 2 streams',f:'connection.json',s:
'{\n'+
'  "name": "postgres_to_snowflake",\n'+
'  "namespaceDefinition": "customformat",\n'+
'  "namespaceFormat": "raw",\n'+
'  "prefix": "src_",\n'+
'  "scheduleType": "cron",\n'+
'  "scheduleData": { "cron": { "cronExpression": "0 0 2 * * ?", "cronTimeZone": "Europe/Paris" } },\n'+
'  "syncCatalog": {\n'+
'    "streams": [\n'+
'      {\n'+
'        "stream": { "name": "orders", "namespace": "public" },\n'+
'        "config": {\n'+
'          "syncMode": "full_refresh",\n'+
'          "destinationSyncMode": "overwrite",\n'+
'          "selected": true\n'+
'        }\n'+
'      },\n'+
'      {\n'+
'        "stream": { "name": "customers", "namespace": "public" },\n'+
'        "config": {\n'+
'          "syncMode": "incremental",\n'+
'          "destinationSyncMode": "append_dedup",\n'+
'          "cursorField": ["updated_at"],\n'+
'          "primaryKey": [["customer_id"]],\n'+
'          "selected": true\n'+
'        }\n'+
'      }\n'+
'    ]\n'+
'  }\n'+
'}\n'},
{n:'Incremental stream only',f:'stream_events.json',s:
'{\n'+
'  "name": "events_sync",\n'+
'  "scheduleType": "basic",\n'+
'  "scheduleData": { "basicSchedule": { "units": 6, "timeUnit": "hours" } },\n'+
'  "syncCatalog": {\n'+
'    "streams": [\n'+
'      {\n'+
'        "stream": { "name": "events", "namespace": "analytics" },\n'+
'        "config": {\n'+
'          "syncMode": "incremental",\n'+
'          "destinationSyncMode": "append",\n'+
'          "cursorField": ["emitted_at"],\n'+
'          "selected": true\n'+
'        }\n'+
'      }\n'+
'    ]\n'+
'  }\n'+
'}\n'},
{n:'Low-code connector manifest',f:'manifest.yaml',s:
'version: "4.3.2"\n'+
'type: DeclarativeSource\n'+
'\n'+
'definitions:\n'+
'  requester:\n'+
'    type: HttpRequester\n'+
'    url_base: "https://api.shop.io/v2"\n'+
'    http_method: GET\n'+
'    authenticator:\n'+
'      type: BearerAuthenticator\n'+
'      api_token: "{{ config[\'api_key\'] }}"\n'+
'\n'+
'streams:\n'+
'  - type: DeclarativeStream\n'+
'    name: products\n'+
'    retriever:\n'+
'      type: SimpleRetriever\n'+
'      requester:\n'+
'        $ref: "#/definitions/requester"\n'+
'        path: "/products"\n'+
'      record_selector:\n'+
'        type: RecordSelector\n'+
'        extractor:\n'+
'          field_path: ["items"]\n'+
'      paginator:\n'+
'        type: DefaultPaginator\n'+
'        page_size_option:\n'+
'          inject_into: request_parameter\n'+
'          field_name: limit\n'+
'        pagination_strategy:\n'+
'          type: OffsetIncrement\n'+
'          page_size: 100\n'},
{n:'Datetime cursor (low-code)',f:'manifest_incremental.yaml',s:
'version: "4.3.2"\n'+
'type: DeclarativeSource\n'+
'\n'+
'streams:\n'+
'  - type: DeclarativeStream\n'+
'    name: invoices\n'+
'    retriever:\n'+
'      requester:\n'+
'        url_base: "https://api.billing.io/v1"\n'+
'        path: "/invoices"\n'+
'      record_selector:\n'+
'        extractor:\n'+
'          field_path: ["data"]\n'+
'    incremental_sync:\n'+
'      type: DatetimeBasedCursor\n'+
'      cursor_field: "updated_at"\n'+
'      datetime_format: "%Y-%m-%dT%H:%M:%SZ"\n'+
'      start_datetime:\n'+
'        datetime: "{{ config[\'start_date\'] }}"\n'+
'      step: "P30D"\n'+
'      cursor_granularity: "PT1S"\n'},
{n:'Postgres CDC source',f:'source_postgres_cdc.json',s:
'{\n'+
'  "sourceType": "postgres",\n'+
'  "host": "db.internal",\n'+
'  "port": 5432,\n'+
'  "database": "prod",\n'+
'  "username": "airbyte",\n'+
'  "password": "hunter2",\n'+
'  "schemas": ["public"],\n'+
'  "ssl_mode": { "mode": "require" },\n'+
'  "replication_method": {\n'+
'    "method": "CDC",\n'+
'    "replication_slot": "airbyte_slot",\n'+
'    "publication": "airbyte_pub",\n'+
'    "initial_waiting_seconds": 300\n'+
'  }\n'+
'}\n'},
{n:'Destination + normalization',f:'destination_snowflake.json',s:
'{\n'+
'  "destinationType": "snowflake",\n'+
'  "host": "acme.snowflakecomputing.com",\n'+
'  "database": "ANALYTICS",\n'+
'  "schema": "RAW",\n'+
'  "warehouse": "LOADING",\n'+
'  "credentials": { "auth_type": "Username and Password", "password": "s3cr3t" },\n'+
'  "normalization": { "basic_normalization": true },\n'+
'  "loading_method": { "method": "Internal Staging" },\n'+
'  "raw_data_schema": "_airbyte_internal"\n'+
'}\n'},
{n:'SaaS connector (Stripe)',f:'source_stripe.json',s:
'{\n'+
'  "sourceType": "stripe",\n'+
'  "account_id": "acct_1A2B3C",\n'+
'  "client_secret": "sk_live_51H8kQ2eZvKYlo2CdRt",\n'+
'  "start_date": "2026-01-01T00:00:00Z",\n'+
'  "lookback_window_days": 7,\n'+
'  "slice_range": 365,\n'+
'  "streams": ["charges", "invoices", "customers", "subscriptions", "payouts"]\n'+
'}\n'},
{n:'Terraform connection resource',f:'main.tf',s:
'resource "airbyte_connection" "orders" {\n'+
'  name           = "postgres_to_bigquery"\n'+
'  source_id      = airbyte_source_postgres.prod.source_id\n'+
'  destination_id = airbyte_destination_bigquery.dwh.destination_id\n'+
'  schedule = {\n'+
'    schedule_type    = "cron"\n'+
'    cron_expression  = "0 15 3 * * ?"\n'+
'  }\n'+
'  configurations = {\n'+
'    streams = [\n'+
'      {\n'+
'        name                  = "orders"\n'+
'        sync_mode             = "incremental_deduped_history"\n'+
'        cursor_field          = ["updated_at"]\n'+
'        primary_key           = [["order_id"]]\n'+
'      }\n'+
'    ]\n'+
'  }\n'+
'}\n'},
{n:'Reading the raw tables downstream',f:'stg_orders.sql',s:
'-- the dbt model everyone writes after Airbyte\n'+
'select\n'+
'    _airbyte_raw_id,\n'+
'    _airbyte_extracted_at,\n'+
'    json_value(_airbyte_data, \'$.order_id\') as order_id,\n'+
'    json_value(_airbyte_data, \'$.amount\')::numeric as amount,\n'+
'    json_value(_airbyte_data, \'$.region\') as region\n'+
'from raw._airbyte_raw_orders\n'+
'where _airbyte_extracted_at > (select max(loaded_at) from stg_orders)\n'},
{n:'File source → local CSV',f:'source_file.json',s:
'{\n'+
'  "sourceType": "file",\n'+
'  "dataset_name": "country_codes",\n'+
'  "format": "csv",\n'+
'  "url": "https://raw.githubusercontent.com/acme/ref/main/countries.csv",\n'+
'  "provider": { "storage": "HTTPS", "user_agent": false },\n'+
'  "reader_options": "{\\"sep\\": \\",\\"}"\n'+
'}\n'}];

var PRESET={'@daily':'0 0 * * *','@hourly':'0 * * * *','@weekly':'0 0 * * 0','@monthly':'0 0 1 * *','@yearly':'0 0 1 1 *','@once':null,'None':null,'@continuous':null};
var KNOWN=/^(Python|Bash|Empty|Dummy|SQLExecuteQuery|Postgres|MySql|Trigger|Branch|Short|Docker|Kubernetes|Email|S3ToRedshift|GCSToBigQuery)Operator$/;
function delta(s){var d=/days\s*=\s*(\d+)/.exec(s),h=/hours\s*=\s*(\d+)/.exec(s),m=/minutes\s*=\s*(\d+)/.exec(s);
  if(d)return +d[1]===1?'0 0 * * *':'0 0 */'+d[1]+' * *';if(h)return '0 */'+h[1]+' * * *';if(m)return '*/'+m[1]+' * * * *';return null}
function q(s){return '"'+String(s).replace(/"/g,'\\"')+'"'}
function cols(s){return s.split(',').map(function(x){return x.replace(/["'\s]/g,'')}).filter(Boolean)}

function secretName(s){return '${SECRET.'+String(s).toUpperCase().replace(/[^A-Z0-9]+/g,'_')+'}'}
var FNAME='';
function quartz(s){var f=String(s).trim().split(/\s+/);
  if(f.length<6)return {cron:null,err:'Quartz expects 6 or 7 fields (seconds first) — this has '+f.length+'.'};
  return {cron:f.slice(1,6).map(function(x){return x==='?'?'*':x}).join(' '),sec:f[0]}}
function detectKind(t){
  if(/resource\s+"airbyte_/.test(t))return 'terraform';
  if(/_airbyte_raw|_airbyte_data|_airbyte_extracted_at/.test(t)&&/select/i.test(t))return 'rawsql';
  if(/type:\s*DeclarativeSource/.test(t))return 'lowcode';
  if(/"destinationType"/.test(t))return 'destination';
  if(/"sourceType"/.test(t))return 'source';
  if(/"syncCatalog"|"streams"\s*:\s*\[\s*\{/.test(t))return 'connection';
  if(/^\s*\{/.test(t))return 'connection';
  return 'lowcode';
}
function SECRETY(k){return /pass|secret|token|key|credential/i.test(k)}
function translate(text){
  var L=text.split('\n'),N=[],kind=detectKind(text),jobs=[],cron=null,manual=true,lCron=null,name=null,lName=null;
  function note(k,l,w,t){N.push({k:k,l:l,w:w,t:t})}
  function first(re){for(var i=0;i<L.length;i++){var m=re.exec(L[i]);if(m)return{m:m,l:i+1}}return null}
  var base={name:'untitled',cron:null,manual:true,tf:[],src:null,dst:null,acts:[],retries:null,backoff:null,cache:null,
            notes:N,lName:null,lCron:null,lRetry:null,lCache:null,srcs:[],dsts:[],grp:{imp:[],xcom:[]},kind:kind,jobs:[],ab:{}};

  /* --- planification, commune a plusieurs formats --- */
  var r=first(/cron(?:Expression|_expression)"?\s*[:=]\s*"([^"]+)"/);
  if(r){var qz=quartz(r.m[1]);lCron=r.l;
    if(qz.cron){cron=qz.cron;manual=false;note('map',r.l,'cron expression','trigger.cron: '+q(cron)+' — Quartz drops its leading seconds field, "?" becomes "*"');
      if(qz.sec&&qz.sec!=='0')note('care',r.l,'sub-minute schedule','Quartz fires at second '+qz.sec+'. Cron has no seconds field — that precision is lost.');}
    else note('care',r.l,'malformed cron',qz.err);}
  else{r=first(/"units"\s*:\s*(\d+)[\s\S]{0,60}?"timeUnit"\s*:\s*"(\w+)"/);
    if(r){var n2=+r.m[1],u=r.m[2];lCron=r.l;manual=false;
      cron=u==='hours'?('0 */'+n2+' * * *'):(u==='minutes'?('*/'+n2+' * * * *'):('0 0 */'+n2+' * *'));
      note('map',r.l,'basic schedule','trigger.cron: '+q(cron));}}
  var tz=first(/cronTimeZone"?\s*[:=]\s*"([^"]+)"/);
  if(tz)note('care',tz.l,'timezone','Cron runs in the runner’s timezone. Set TZ on the node or the schedule drifts twice a year.');

  /* --- secrets en clair : le controle le plus utile de la page --- */
  for(var i=0;i<L.length;i++){
    var m=/["']?([\w_]*(?:password|secret|token|api_key|client_secret|credential)[\w_]*)["']?\s*[:=]\s*["']([^"']{4,})["']/i.exec(L[i]);
    if(m&&!/\{\{|\$\{|<|xxx|\*\*\*/.test(m[2]))
      note('care',i+1,'secret in plain text','"'+m[1]+'" is readable in this file. In a manifest it becomes '+secretName(m[1])+', resolved at run time and never committed.');
  }

  /* ============ connexion : N streams = N jobs ============ */
  if(kind==='connection'){
    var nm=first(/"name"\s*:\s*"([\w.\- ]+)"/);if(nm){name=nm.m[1];lName=nm.l;note('map',nm.l,'connection name','name: '+name)}
    var pre=(/"prefix"\s*:\s*"([\w_]*)"/.exec(text)||[])[1]||'';
    var ns=(/"namespaceFormat"\s*:\s*"([\w_]*)"/.exec(text)||[])[1]||null;
    if(ns)note('map',1,'namespace','Becomes the destination schema: '+ns);
    var cur=null;
    for(var i=0;i<L.length;i++){
      var ln=L[i],no=i+1,m2;
      if(m2=/"name"\s*:\s*"([\w.\-]+)"[\s\S]{0,40}?"namespace"/.exec(ln)){cur={s:m2[1],l:no,mode:'replace',keys:null,cursor:null};jobs.push(cur);
        note('map',no,'stream '+m2[1],'jobs/load_'+m2[1]+'.yaml');continue}
      if(!cur)continue;
      if(m2=/"syncMode"\s*:\s*"(\w+)"/.exec(ln)){cur.sync=m2[1];
        if(m2[1]==='incremental')note('care',no,'incremental sync','Airbyte remembers the cursor for you. Hydra v1 has no state store — this becomes an explicit range or a watermark filter you write down.');continue}
      if(m2=/"destinationSyncMode"\s*:\s*"(\w+)"/.exec(ln)){
        var d=m2[1];cur.dmode=d;
        cur.mode=(d==='overwrite')?'replace':'append';
        note('map',no,'destinationSyncMode: '+d,'destination.mode: '+cur.mode+(d==='append_dedup'?' + op: deduplicate':''));continue}
      if(m2=/"cursorField"\s*:\s*\[\s*"([\w.]+)"/.exec(ln)){cur.cursor=m2[1];
        note('map',no,'cursorField','filter on '+m2[1]+' > ${run.previous} — written in the manifest instead of hidden in a state blob');continue}
      if(m2=/"primaryKey"\s*:\s*\[\s*\[\s*"([\w.]+)"/.exec(ln)){cur.keys=m2[1];note('map',no,'primaryKey','op: deduplicate keys: ['+m2[1]+']');continue}
      if(/"selected"\s*:\s*false/.test(ln)){note('drop',no,'unselected stream','Not synced — nothing to translate.');continue}
    }
    jobs.forEach(function(j){j.prefix=pre;j.ns=ns});
    base.jobs=jobs;base.name=name||'airbyte_connection';base.cron=cron;base.manual=manual;base.lCron=lCron;base.lName=lName;
    if(jobs.length>1)note('map',jobs[1].l,jobs.length+' streams',jobs.length+' manifests plus one workflow — each stream keeps its own sync mode instead of sharing one connection setting.');
    note('care',1,'the connectors themselves','Hydra ships CSV, JSON, Parquet, MySQL, Postgres, Mongo and REST. If your source is one of those, this replaces the connection and lets you transform on the way. If it is one of the 300+ SaaS connectors, keep Airbyte.');
    return base;
  }

  /* ============ manifeste low-code ============ */
  if(kind==='lowcode'){
    var url=(/url_base:\s*["']([^"']+)["']/.exec(text)||[])[1];
    var pth=(/path:\s*["']([^"']+)["']/.exec(text)||[])[1];
    var st=first(/^\s*name:\s*([\w.\-]+)/);if(st){name=st.m[1];lName=st.l;note('map',st.l,'stream name','name: '+name)}
    var ru=first(/url_base:/);
    if(url)note('map',ru?ru.l:1,'HttpRequester','source.type: webapi, url: '+url+(pth||''));
    var au=first(/authenticator:|api_token:|client_secret:/);
    if(au)note('map',au.l,'authenticator','Becomes ${SECRET.API_KEY} on the source — the auth plugin handles Bearer, Basic and OAuth.');
    var fp=first(/field_path:\s*\[\s*["']([\w.]+)["']/);
    if(fp)note('map',fp.l,'record_selector','op: flatten on '+fp.m[1]+' — the same unwrapping, written as a step.');
    var pg=first(/paginator:|pagination_strategy:/);
    if(pg){var ps=(/type:\s*(OffsetIncrement|PageIncrement|CursorPagination|DefaultPaginator)/.exec(text)||[])[1];
      note('map',pg.l,'paginator'+(ps?' ('+ps+')':''),'The pagination plugin covers offset, page and cursor strategies. Declared on the source, same idea.');}
    var inc=first(/DatetimeBasedCursor|cursor_field:/);
    if(inc)note('care',inc.l,'DatetimeBasedCursor','Airbyte slices time for you and remembers where it stopped. Hydra v1 has no state store: the window becomes hdrctl run --from … --to …, driven by the workflow.');
    var sr=first(/\$ref:/);
    if(sr)note('drop',sr.l,'$ref / definitions','Manifest reuse machinery. A Hydra source is declared once, in one place.');
    base.name=name||'lowcode_stream';base.cron=cron;base.manual=manual;base.lCron=lCron;base.lName=lName;
    base.src={t:'webapi',p:(url||'')+(pth||''),l:ru?ru.l:1};
    if(fp)base.tf=[{op:'flatten',p:'{path: '+q(fp.m[1])+'}',l:fp.l}];
    note('care',1,'no destination in a source manifest','A low-code manifest only describes extraction. Name where it lands.');
    return base;
  }

  /* ============ configs source / destination ============ */
  if(kind==='source'||kind==='destination'){
    var ty=(/"(?:source|destination)Type"\s*:\s*"([\w.\-]+)"/.exec(text)||[])[1]||'?';
    var known=/^(postgres|mysql|mssql|mongodb|file|s3|gcs|bigquery|snowflake|redshift|clickhouse)$/i.test(ty);
    base.name=ty+'_'+kind;
    var tl=first(/"(?:source|destination)Type"/);
    if(known)note('map',tl?tl.l:1,ty+' connector','Hydra speaks this one natively — the connection becomes a source block, and you gain transformations on the way through.');
    else note('care',tl?tl.l:1,ty+' connector','Not in Hydra’s connector set. Keep Airbyte for this one and let Hydra take the tables it lands.');
    if(/"method"\s*:\s*"CDC"/.test(text)){var cd=first(/"CDC"/);
      note('care',cd.l,'CDC replication','Log-based capture with a replication slot. Hydra reads tables, it does not tail a WAL — this is a clear reason to keep Airbyte.');}
    var nz=first(/"normalization"|basic_normalization|raw_data_schema/);
    if(nz)note('care',nz.l,'normalization / raw schema','Airbyte lands JSON in _airbyte_raw_* then types it in a second pass. A Hydra job writes the typed table directly — one hop, no raw layer to clean up.');
    var st2=first(/"streams"\s*:\s*\[\s*"/);
    if(st2){var lst2=(text.match(/"streams"\s*:\s*\[([^\]]*)\]/)||[,''])[1].split(',').length;
      note('map',st2.l,lst2+' streams selected',lst2+' manifests, one per stream — or one workflow if they must land together.');}
    var u=first(/"url"\s*:\s*"([^"]+)"/);
    if(u){base.src={t:/\.csv/i.test(u.m[1])?'csv':'webapi',p:u.m[1],l:u.l};note('map',u.l,'file url','source.type: '+base.src.t)}
    base.cron=cron;base.manual=manual;base.lCron=lCron;
    return base;
  }

  /* ============ terraform ============ */
  if(kind==='terraform'){
    var nm3=first(/name\s*=\s*"([\w.\- ]+)"/);if(nm3){base.name=nm3.m[1];base.lName=nm3.l;note('map',nm3.l,'connection name','name: '+nm3.m[1])}
    var sm=first(/sync_mode\s*=\s*"([\w]+)"/);
    if(sm){var v=sm.m[1];
      note('map',sm.l,'sync_mode: '+v,/dedup/.test(v)?'destination.mode: append + op: deduplicate':(/incremental/.test(v)?'destination.mode: append':'destination.mode: replace'));
      if(/incremental/.test(v))note('care',sm.l,'incremental state','Airbyte stores the cursor position server-side. A manifest in git has nowhere to hide state — the window becomes explicit.');}
    var pk=first(/primary_key\s*=\s*\[\s*\[\s*"([\w.]+)"/);
    if(pk)note('map',pk.l,'primary_key','op: deduplicate keys: ['+pk.m[1]+']');
    var sn=first(/streams\s*=\s*\[/);
    var names=[];L.forEach(function(ln,i){var m3=/^\s*name\s*=\s*"([\w.\-]+)"\s*$/.exec(ln);if(m3&&i>2)names.push({s:m3[1],l:i+1,mode:'append',keys:pk?pk.m[1]:null})});
    base.jobs=names;base.cron=cron;base.manual=manual;base.lCron=lCron;
    note('drop',1,'provider plumbing','source_id, destination_id, workspace wiring — a manifest points at a system directly.');
    return base;
  }

  /* ============ le SQL qui nettoie derriere Airbyte ============ */
  if(kind==='rawsql'){
    var cnt=(text.match(/json_value|json_extract|->>/g)||[]).length;
    base.name='the_cleanup_model';
    note('care',1,'this model exists because of the raw layer','Airbyte lands JSON in _airbyte_raw_*; every column has to be dug out and cast by hand afterwards. '+cnt+' extraction'+(cnt>1?'s':'')+' on this page alone.');
    note('map',1,'what a manifest does instead','Types are declared once, on the destination. The staging model disappears — there is no raw table to unpack.');
    var wm=first(/_airbyte_extracted_at\s*>/);
    if(wm)note('map',wm.l,'watermark filter','This is the incremental logic, written by hand because the state lives elsewhere. In a manifest it is one filter op on the source.');
    var idc=first(/_airbyte_raw_id|_airbyte_extracted_at/);
    if(idc)note('drop',idc.l,'_airbyte_ metadata columns','Bookkeeping columns that exist only to make the raw layer work.');
    return base;
  }
  return base;
}

function buildYaml(t){
  var o=[];function O(s,l){o.push([s,l==null?null:l])}
  function hdr(s){O('# ─────────  '+s+'  ─────────',null);O('',null)}
  var cron=t.cron||null;

  if(t.kind==='rawsql'){
    hdr('this model exists only because of the raw layer');
    O('# Airbyte lands JSON in _airbyte_raw_*, then you unpack it.',null);
    O('# A Hydra job writes the typed table directly — no raw hop,',null);
    O('# no metadata columns, no staging model to maintain.',null);O('',null);
    hdr('jobs/load_orders.yaml');
    O('name: load_orders',null);O('',null);
    O('source:',null);O('  type: postgres',null);O('  conn: ${SECRET.SRC}',null);
    O('  query: "SELECT * FROM orders WHERE updated_at > ${run.previous}"',null);O('',null);
    O('transformations:',null);O('  - op: cast',null);O('    params: {types: {amount: float64}}',null);O('',null);
    O('destination:',null);O('  type: postgres',null);O('  table: "analytics.orders"',null);O('  mode: append',null);
    return o;
  }

  var jobs=t.jobs||[];
  if(jobs.length){
    jobs.forEach(function(j){
      var nm='load_'+(j.prefix||'')+j.s;
      hdr('jobs/'+nm+'.yaml');
      O('name: '+nm,j.l);O('',null);
      O('trigger:',null);O('  type: manual        # the workflow drives it',null);O('',null);
      O('source:',j.l);O('  type: ???           # your real system — Postgres, MySQL, REST…',j.l);
      O('  query: '+q('SELECT * FROM '+j.s),j.l);
      if(j.cursor){O('  incremental:',j.l);O('    column: '+j.cursor,j.l);O('    since: ${run.previous}   # Airbyte kept this server-side',j.l)}
      O('',null);
      if(j.dmode==='append_dedup'&&j.keys){
        O('transformations:',j.l);O('  - op: deduplicate',j.l);O('    params: {keys: ['+j.keys+']}',j.l);O('',null);}
      O('destination:',j.l);O('  type: ???           # your warehouse',j.l);
      O('  table: '+q((j.ns?j.ns+'.':'')+(j.prefix||'')+j.s),j.l);
      O('  mode: '+(j.mode||'replace'),j.l);O('',null);
    });
    hdr('workflows/'+t.name+'.yaml');
    O('version: "1.0"',null);O('workflow:',null);O('  name: '+t.name,t.lName);
    O('  trigger:',null);
    if(cron){O('    type: schedule',t.lCron);O('    cron: '+q(cron),t.lCron)}else O('    type: manual',null);
    O('  steps:',null);
    jobs.forEach(function(j){var nm='load_'+(j.prefix||'')+j.s;
      O('    - name: '+nm,j.l);O('      type: job',j.l);O('      job: "./jobs/'+nm+'.yaml"',j.l)});
    O('  # no depends_on: the streams are independent, so they run in parallel',null);
    return o;
  }

  /* --- cas a un seul job (manifeste low-code, config source) --- */
  O('name: '+t.name,t.lName);O('',null);
  O('trigger:',null);
  if(cron){O('  type: schedule',t.lCron);O('  cron: '+q(cron),t.lCron)}else O('  type: manual',null);
  O('',null);O('source:',t.src?t.src.l:null);
  if(!t.src)O('  type: ???        # nothing readable was detected',null);
  else if(t.src.t==='webapi'){O('  type: webapi',t.src.l);O('  url: '+q(t.src.p),t.src.l);O('  method: GET',t.src.l);
    O('  auth: {type: bearer, token: ${SECRET.API_KEY}}',t.src.l);O('  paginate: {strategy: offset, size: 100}',t.src.l)}
  else{O('  type: '+t.src.t,t.src.l);O('  path: '+q(t.src.p),t.src.l)}
  O('',null);O('transformations:',null);
  if(!t.tf.length)O('  []               # pass-through',null);
  else t.tf.forEach(function(x){O('  - op: '+x.op,x.l);if(x.p&&x.p!=='{}')O('    params: '+x.p,x.l)});
  O('',null);O('destination:',null);O('  type: ???        # name where it lands',null);
  return o;
}

function colorLine(l){
  if(/^\s*#/.test(l))return '<span class="yc">'+l+'</span>';
  var st=[],cm=null;
  l=l.replace(/"[^"]*"/g,function(m){st.push(m);return '\u0001'+(st.length-1)+'\u0001'});
  l=l.replace(/#.*$/,function(m){cm=m;return '\u0002'});
  l=l.replace(/^(\s*(?:- )?)([\w_]+)(:)/,'$1<span class="yk">$2</span>$3');
  if(cm!==null)l=l.replace('\u0002','<span class="yc">'+cm+'</span>');
  return l.replace(/\u0001(\d+)\u0001/g,function(_,i){return '<span class="ys">'+st[+i]+'</span>'});
}
function colorYaml(rows){return rows.map(function(r,i){
  return '<span class="yl" data-i="'+i+'"'+(r[1]?' data-s="'+r[1]+'"':'')+'>'+colorLine(esc(r[0]))+'</span>'}).join('')}

/* ---------- render ---------- */
var FILT={map:1,drop:1,care:1},CUR=null,ROWS=[],IGN={},MUTE={},SEL=null;
function ignCount(){var n=0;for(var k in IGN)if(IGN[k])n++;return n}
function effective(text){
  if(!ignCount())return text;
  return text.split('\n').map(function(l,i){return IGN[i+1]?'':l}).join('\n');
}
function run(){
  var text=$("src").value;
  if(!text.trim()){$("yml").innerHTML='<span class="yc"># paste an Airbyte config on the left — connection, manifest, source —\n# or pick a sample above.</span>';$("yml").dataset.raw='';
    $("fnB").textContent='job.yaml';$("cMap").textContent='0';$("cDrop").textContent='0';$("cCare").textContent='0';
    $("gut").innerHTML='<i>1</i>';$("rl").innerHTML='<li class="empty">Waiting for a config.</li>';CUR=null;ROWS=[];return}
  var t=translate(SEL!=null?SEL.text:effective(text));CUR=t;
  ROWS=buildYaml(t);
  var y=ROWS.map(function(r){return r[0]}).join('\n');
  $("yml").innerHTML=colorYaml(ROWS);
  $("yml").dataset.raw=y;
  $("fnB").textContent=(SEL!=null?'selection · ':'')+((t.jobs&&t.jobs.length)||t.kind!=='pymodel'?'workflows/':'jobs/')+t.name+'.yaml';
  $("fnA").textContent=(t.name==='untitled'?'config':t.name)+({lowcode:'.yaml',terraform:'.tf',rawsql:'.sql'}[t.kind]||'.json')+(ignCount()?'  ('+ignCount()+' ignored)':'');
  var c={map:0,drop:0,care:0};t.notes.forEach(function(n){c[n.k]++});
  $("cMap").textContent=c.map;$("cDrop").textContent=c.drop;$("cCare").textContent=c.care;
  var hit={};t.notes.forEach(function(n){hit[n.l]=1});
  var nl=text.split('\n').length,g='';
  for(var i=1;i<=nl;i++)g+='<i class="'+(IGN[i]?'ign':(hit[i]?'hit':''))+'">'+i+'</i>';
  $("gut").innerHTML=g;
  var ns=t.notes.filter(function(n){return FILT[n.k]&&!MUTE[n.w]}).sort(function(a,b){return a.l-b.l});
  $("rl").innerHTML=ns.length?ns.map(function(n,i){
    return '<li class="'+n.k+'" data-l="'+n.l+'" data-w="'+esc(n.w)+'" data-k="'+n.k+'" tabindex="0"><span class="ln">'+n.l+'</span><span class="bd"></span><span><span class="w">'+esc(n.w)+'</span> — <span class="t">'+n.t+'</span></span></li>'}).join('')
    :'<li class="empty">Nothing to show with these filters.</li>';
  $("selBar").style.display=SEL!=null?'flex':'none';
}
var deb;
$("src").addEventListener('input',function(){$("ex").selectedIndex=-1;$("exTag").textContent='your file';clearTimeout(deb);deb=setTimeout(run,120)});
$("src").addEventListener('scroll',function(){$("gut").scrollTop=$("src").scrollTop});
function gotoLine(n){var ta=$("src"),L=ta.value.split('\n'),p=0;
  for(var i=0;i<n-1;i++)p+=L[i].length+1;
  ta.focus();ta.setSelectionRange(p,p+(L[n-1]||'').length);
  ta.scrollTop=Math.max(0,(n-6)*LH());$("gut").scrollTop=ta.scrollTop}
$("rl").addEventListener('click',function(e){var li=e.target.closest?e.target.closest('li[data-l]'):null;if(li)gotoLine(+li.getAttribute('data-l'))});
[].slice.call(document.querySelectorAll('.cnt')).forEach(function(b){b.onclick=function(){
  var f=b.getAttribute('data-f');FILT[f]=!FILT[f];b.classList.toggle('on',FILT[f]);run()}});
$("cp").onclick=function(){cpy($("yml").dataset.raw||'');toast('Manifest copied')};
$("dl").onclick=function(){var t=$("yml").dataset.raw||'',b=new Blob([t],{type:'text/yaml'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download=$("fnB").textContent.split('/').pop().replace('selection · ','');a.click();URL.revokeObjectURL(u)};
function cpy(s){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s)}
function LH(){var v=parseFloat(getComputedStyle($("src")).lineHeight);return isNaN(v)?19.3:v}

/* ---------- examples ---------- */
$("ex").innerHTML=EX.map(function(e,i){return '<option value="'+i+'">'+esc(e.n)+'</option>'}).join('');
$("exCount").textContent=EX.length+' samples here — 120+ in the full docs.';
function load(i){var e=EX[i];FNAME=e.f;$("src").value=e.s;$("fnA").textContent=e.f;$("ex").value=i;$("exTag").textContent=e.f;run();$("src").scrollTop=0;$("gut").scrollTop=0}
$("ex").onchange=function(){load(+$("ex").value)};
$("rand").onclick=function(){var i;do{i=Math.floor(Math.random()*EX.length)}while(EX.length>1&&i===+$("ex").value);load(i)};
$("blank").onclick=function(){FNAME='';$("src").value='';$("fnA").textContent='config';$("exTag").textContent='';run();$("src").focus()};
load(0);
/* ================= MENU CONTEXTUEL ================= */
var MENU=$("menu"),POP=$("pop"),MI=[],LASTF=null;
function toast(s){var t=$("toast");t.textContent=s;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},1600)}
function closeMenu(back){MENU.classList.remove('open');MENU.innerHTML='';MI=[];if(back&&LASTF&&LASTF.focus)LASTF.focus()}
function openMenu(x,y,items,head){
  LASTF=document.activeElement;MI=items;
  MENU.innerHTML=(head?'<div class="hd">'+esc(head)+'</div>':'')+items.map(function(it,i){
    return it==='-'?'<hr>':'<button role="menuitem" data-i="'+i+'"'+(it.off?' disabled':'')+'>'+esc(it.t)+(it.k?'<span class="k">'+it.k+'</span>':'')+'</button>'}).join('');
  MENU.classList.add('open');MENU.style.left='0px';MENU.style.top='0px';
  var r=MENU.getBoundingClientRect();
  MENU.style.left=Math.max(6,Math.min(x,innerWidth-r.width-8))+'px';
  MENU.style.top=Math.max(6,Math.min(y,innerHeight-r.height-8))+'px';
  var f=MENU.querySelector('button:not([disabled])');if(f)f.focus();
}
MENU.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('button[data-i]'):null;if(!b)return;
  var it=MI[+b.getAttribute('data-i')];closeMenu();if(it&&it.f)it.f()});
MENU.addEventListener('keydown',function(e){
  var bs=[].slice.call(MENU.querySelectorAll('button:not([disabled])')),i=bs.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){e.preventDefault();bs[(i+1)%bs.length].focus()}
  else if(e.key==='ArrowUp'){e.preventDefault();bs[(i-1+bs.length)%bs.length].focus()}
  else if(e.key==='Escape'){e.preventDefault();closeMenu(1)}});
document.addEventListener('mousedown',function(e){if(MENU.classList.contains('open')&&!MENU.contains(e.target))closeMenu()});
window.addEventListener('scroll',function(){if(MENU.classList.contains('open'))closeMenu()},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(MENU.classList.contains('open'))closeMenu(1);else if(POP.classList.contains('open'))closePop()}});
function ctx(el,build){
  el.addEventListener('contextmenu',function(e){
    if(e.shiftKey)return;
    var b=build(e);if(!b)return;e.preventDefault();openMenu(e.clientX,e.clientY,b.items,b.head)});
  el.addEventListener('keydown',function(e){
    if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){
      var b=build(e);if(!b)return;e.preventDefault();
      var r=(e.target.getBoundingClientRect?e.target:el).getBoundingClientRect();
      openMenu(r.left+24,r.top+22,b.items,b.head)}});
}
/* ---- popover ---- */
function closePop(){POP.classList.remove('open');if(LASTF&&LASTF.focus)LASTF.focus()}
$("popX").onclick=closePop;
document.addEventListener('mousedown',function(e){if(POP.classList.contains('open')&&!POP.contains(e.target)&&!MENU.contains(e.target))closePop()});
function pop(tag,title,html,x,y){
  $("popTag").textContent=tag;$("popT").textContent=title;$("popB").innerHTML=html;
  POP.classList.add('open');POP.style.left='0px';POP.style.top='0px';
  var r=POP.getBoundingClientRect();
  POP.style.left=Math.max(8,Math.min((x||120),innerWidth-r.width-10))+'px';
  POP.style.top=Math.max(8,Math.min((y||120),innerHeight-r.height-10))+'px';
  $("popX").focus();
}
/* ---- helpers ---- */
function LN(){return $("src").value.split('\n')}
function lineAt(e){var ta=$("src"),r=ta.getBoundingClientRect(),lh=LH(),pt=parseFloat(getComputedStyle(ta).paddingTop)||0;
  var n=Math.floor((e.clientY-r.top-pt+ta.scrollTop)/lh)+1;return Math.max(1,Math.min(LN().length,n))}
function caretLine(){var ta=$("src");return ta.value.slice(0,ta.selectionStart).split('\n').length}
function pulse(n){
  [].slice.call($("yml").querySelectorAll('.yl')).forEach(function(e){e.classList.remove('pulse')});
  var hit=[].slice.call($("yml").querySelectorAll('.yl[data-s="'+n+'"]'));
  hit.forEach(function(e){e.classList.add('pulse')});
  if(hit.length){hit[0].scrollIntoView({block:'center'});return hit.length}
  return 0;
}
function blockAt(i){
  if(!ROWS.length)return null;
  var a=i;while(a>0&&!/^[A-Za-z]/.test(ROWS[a][0]))a--;
  var b=a+1;while(b<ROWS.length&&!/^[A-Za-z#]/.test(ROWS[b][0]))b++;
  while(b>a+1&&!ROWS[b-1][0].trim())b--;
  return {a:a,b:b,name:(ROWS[a][0].split(':')[0]||'').trim(),txt:ROWS.slice(a,b).map(function(r){return r[0]}).join('\n')};
}
var OPDOC={filter:'Keeps the rows matching params.expr. Column names are used bare — validate checks they exist before the run.',
 select:'Keeps only the listed columns, in that order.',
 rename:'Renames columns. A missing source column fails validate, not the run.',
 cast:'Changes dtypes. A bad cast fails loudly instead of turning into NaN.',
 fill_null:'Replaces nulls, per column or across the frame.',
 deduplicate:'Drops duplicate rows. keys narrows what counts as duplicate.',
 sort:'Orders rows — kept explicit because it decides what any downstream limit returns.',
 aggregate:'Groups by the listed columns and applies the agg functions.',
 flatten:'Expands nested JSON into flat columns — the json_normalize equivalent.'};

/* ---- reverse : bloc YAML -> pandas ---- */
function pv(s,k){var m=new RegExp(k+':\\s*(\\{[^}]*\\}|\\[[^\\]]*\\]|"[^"]*"|[\\w.]+)').exec(s||'');return m?m[1]:null}
function lst(s){return (s||'').replace(/[\[\]]/g,'').split(',').map(function(x){return x.trim()}).filter(Boolean)}
function dic(s){return (s||'').replace(/[{}]/g,'').split(',').map(function(x){var kv=x.split(':');return kv.length<2?null:[kv[0].trim(),kv.slice(1).join(':').trim()]}).filter(Boolean)}
function toPandas(x){
  var p=x.p||'';
  if(x.op==='filter'){var e=(pv(p,'expr')||'""').replace(/^"|"$/g,'');return 'df = df.query('+JSON.stringify(e)+')'}
  if(x.op==='select')return 'df = df[['+lst(pv(p,'columns')).map(function(c){return JSON.stringify(c)}).join(', ')+']]';
  if(x.op==='rename')return 'df = df.rename(columns={'+dic(pv(p,'map')).map(function(kv){return JSON.stringify(kv[0])+': '+JSON.stringify(kv[1])}).join(', ')+'})';
  if(x.op==='cast')return 'df = df.astype({'+dic(pv(p,'types')).map(function(kv){return JSON.stringify(kv[0])+': '+JSON.stringify(kv[1])}).join(', ')+'})';
  if(x.op==='fill_null')return 'df = df.fillna({'+dic(pv(p,'values')).map(function(kv){return JSON.stringify(kv[0])+': '+kv[1]}).join(', ')+'})';
  if(x.op==='deduplicate'){var k=lst(pv(p,'keys'));return 'df = df.drop_duplicates('+(k.length?'subset=['+k.map(function(c){return JSON.stringify(c)}).join(', ')+']':'')+')'}
  if(x.op==='sort'){var b=lst(pv(p,'by'))[0]||'col',o=pv(p,'order');return 'df = df.sort_values('+JSON.stringify(b)+(o==='desc'?', ascending=False':'')+')'}
  if(x.op==='aggregate'){var by=lst(pv(p,'by')),ag=dic(pv(p,'agg'));
    return 'df = df.groupby(['+by.map(function(c){return JSON.stringify(c)}).join(', ')+']).agg({'+ag.map(function(kv){return JSON.stringify(kv[0])+': '+JSON.stringify(kv[1])}).join(', ')+'}).reset_index()'}
  if(x.op==='flatten')return 'df = pd.json_normalize(payload)';
  return '# '+x.op;
}
function reverse(block){
  var t=CUR;if(!t)return '# nothing to reverse';
  if(block==='source'){var s=t.src;if(!s)return '# no source detected';
    if(s.t==='csv')return 'df = pd.read_csv('+JSON.stringify(s.p)+')';
    if(s.t==='parquet')return 'df = pd.read_parquet('+JSON.stringify(s.p)+')';
    if(s.t==='json')return 'df = pd.read_json('+JSON.stringify(s.p)+')';
    if(s.t==='webapi')return 'r = requests.get('+JSON.stringify(s.p)+')\npayload = r.json()';
    return 'with warehouse.get_connection() as conn:\n    df = pd.read_sql('+JSON.stringify(s.q||'')+', conn)'}
  if(block==='transformations')return t.tf.length?t.tf.map(toPandas).join('\n'):'# pass-through';
  if(block==='destination'){var d=t.dst;if(!d)return '# no destination detected';
    if(d.tb)return 'engine = context.resources.dwh.get_engine()\ndf.to_sql('+JSON.stringify(d.tb)+', engine, if_exists='+JSON.stringify(d.mode)+', index=False)';
    if(d.t==='parquet')return 'df.to_parquet('+JSON.stringify(d.p)+')';
    if(d.t==='csv')return 'df.to_csv('+JSON.stringify(d.p)+', index=False)';
    return 'df.to_json('+JSON.stringify(d.p)+')'}
  if(block==='trigger'||block==='name'){var fn=String(t.name).replace(/[^\w]/g,'_');
    return '@asset\ndef '+fn+'(context) -> None:\n    ...\n\njob = define_asset_job('+JSON.stringify(fn+'_job')+', selection=['+fn+'])\n'+
      'defs = Definitions(assets=['+fn+']'+(t.cron?', schedules=[ScheduleDefinition(job=job, cron_schedule='+JSON.stringify(t.cron)+')]':'')+')'}
  if(block==='retry')return '@asset(retry_policy=RetryPolicy(max_retries='+t.retries+(t.backoff?', delay='+(parseInt(t.backoff,10)*(/h$/.test(t.backoff)?3600:(/m$/.test(t.backoff)?60:1))):'')+'))';
  return '# '+block+' has no Airbyte counterpart';
}
/* ---- apercu sur donnees d'exemple ---- */
function fake(col,i){
  var c=col.toLowerCase();
  if(/(^|_)id$/.test(c)||c==='id')return 1000+i;
  if(/region/.test(c))return ['EU','US','APAC','EU','US','APAC'][i%6];
  if(/country/.test(c))return ['FR','TN','ES','FR','DE','TN'][i%6];
  if(/channel|status|stage|grade|priority/.test(c))return ['paid','paid','open','paid','open','paid'][i%6];
  if(/email/.test(c))return 'user'+i+'@acme.io';
  if(/date|_at|day|created|observed/.test(c))return '2026-07-'+('0'+(10+i%18)).slice(-2);
  if(/amount|total|net|price|revenue|balance|sum/.test(c))return (120+i*37)%900+40;
  if(/count|stock|qty/.test(c))return (i*7)%40+1;
  return 'v'+i;
}
function inferCols(t){
  var c=[];
  t.tf.forEach(function(x){
    if(x.op==='select')c=lst(pv(x.p,'columns'));
    if(x.op==='aggregate'){var by=lst(pv(x.p,'by')),ag=dic(pv(x.p,'agg')).map(function(kv){return kv[0]});c=by.concat(ag)}
    if(x.op==='rename')dic(pv(x.p,'map')).forEach(function(kv){if(c.indexOf(kv[1])<0)c.push(kv[1])});
    if(x.op==='filter'){var e=(pv(x.p,'expr')||'').replace(/"/g,''),m=/^(\w+)/.exec(e.trim());if(m&&c.indexOf(m[1])<0)c.push(m[1])}
  });
  if(!c.length)c=['id','region','amount'];
  return c.slice(0,5);
}
function preview(x,y){
  var t=CUR;if(!t){toast('Nothing to preview');return}
  var n=12,steps=[{l:'source · '+(t.src?t.src.t:'?'),n:n,d:0}];
  t.tf.forEach(function(op){
    var d=0,before=n;
    if(op.op==='filter')d=Math.max(1,Math.round(n*0.28));
    else if(op.op==='deduplicate')d=Math.max(1,Math.round(n*0.12));
    else if(op.op==='aggregate'){n=3;steps.push({l:'aggregate',n:n,d:before-n});return}
    n=Math.max(1,n-d);steps.push({l:op.op,n:n,d:before-n});
  });
  var cols=inferCols(t),rows=[];
  for(var i=0;i<Math.min(n,4);i++)rows.push(cols.map(function(c){return fake(c,i)}));
  var html='<b>Row count through the pipeline</b>'+
    steps.map(function(s){return '<div class="step"><span class="n2">'+s.n+'</span><span>'+esc(s.l)+'</span>'+(s.d?'<span class="d">−'+s.d+'</span>':'')+'</div>'}).join('')+
    '<table><thead><tr>'+cols.map(function(c){return '<th>'+esc(c)+'</th>'}).join('')+'</tr></thead><tbody>'+
    rows.map(function(r){return '<tr>'+r.map(function(v){return '<td>'+esc(v)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>'+
    '<p style="margin:9px 0 0;font-size:12px;color:var(--text-mut)">Synthetic rows — shapes and counts only. Wire a real file in the playground to see actual values.</p>';
  pop('preview',t.name+' · dry run',html,x,y);
}

/* ================= LES TROIS MENUS ================= */
function trunc(s,n){s=String(s).trim();return s.length>n?s.slice(0,n-1)+'…':s}

/* --- 1. editeur --- */
ctx($("src"),function(e){
  var n=e.clientY!=null&&e.type==='contextmenu'?lineAt(e):caretLine();
  var ta=$("src"),line=LN()[n-1]||'',hasSel=ta.selectionStart!==ta.selectionEnd;
  var yl=CUR?$("yml").querySelectorAll('.yl[data-s="'+n+'"]').length:0;
  var items=[
    {t:'Explain this line',k:'?',f:function(){explainLine(n,e.clientX,e.clientY)}},
    {t:'Show the YAML it produced',off:!yl,f:function(){var c=pulse(n);toast(c+' line'+(c>1?'s':'')+' highlighted')}},
    '-',
    {t:'Translate the selection only',off:!hasSel,f:function(){
      SEL={text:ta.value.slice(ta.selectionStart,ta.selectionEnd)};run();toast('Selection only')}},
    {t:(IGN[n]?'Restore this line':'Ignore this line'),k:'⌥',f:function(){IGN[n]=!IGN[n];run();
      toast(IGN[n]?'Line '+n+' ignored — retranslated':'Line '+n+' restored')}},
    {t:'Clear all ignored lines',off:!ignCount(),f:function(){IGN={};run();toast('All lines restored')}},
    '-',
    {t:'Paste a config',k:'⌘V',f:function(){
      if(navigator.clipboard&&navigator.clipboard.readText)
        navigator.clipboard.readText().then(function(txt){if(!txt)return;IGN={};SEL=null;ta.value=txt;$("ex").selectedIndex=-1;$("exTag").textContent='your file';run();toast('Pasted')})
        .catch(function(){toast('Clipboard blocked — use ⌘V in the editor')});
      else toast('Clipboard blocked — use ⌘V in the editor')}},
    {t:'Load a random sample',k:'R',f:function(){$("rand").click()}}
  ];
  return {head:'L'+n+'  '+trunc(line||'(empty)',30),items:items};
});
function explainLine(n,x,y){
  var ns=CUR?CUR.notes.filter(function(z){return z.l===n}):[];
  if(!ns.length&&CUR&&CUR.grp){
    ['imp','xcom'].forEach(function(g){
      if(CUR.grp[g].indexOf(n)>=0){var anchor=CUR.grp[g][0];
        ns=CUR.notes.filter(function(z){return z.l===anchor&&/import|XCom/.test(z.w)})}});}
  var out=CUR?ROWS.filter(function(r){return r[1]===n}).map(function(r){return r[0]}):[];
  var line=LN()[n-1]||'';
  var html='<pre>'+esc(trunc(line,120))+'</pre>';
  if(ns.length)html+=ns.map(function(z){
    var lab=z.k==='map'?'maps':(z.k==='drop'?'no longer needed':'needs a decision');
    return '<p style="margin:10px 0 0"><b>'+esc(z.w)+'</b> — '+lab+'<br>'+z.t+'</p>'}).join('');
  else html+='<p style="margin:10px 0 0">The parser read nothing on this line. It is either scaffolding, a comment, or a construct that has no Hydra counterpart — in which case it appears nowhere in the manifest.</p>';
  if(out.length)html+='<p style="margin:10px 0 4px"><b>Produced:</b></p><pre>'+esc(out.join('\n'))+'</pre>';
  pop(ns.length?ns[0].k:'info','Line '+n,html,x,y);
}
$("selOut").onclick=function(){SEL=null;run();toast('Full file')};

/* --- 2. ligne de rapport --- */
ctx($("rl"),function(e){
  var li=e.target.closest?e.target.closest('li[data-l]'):null;
  if(!li)li=document.activeElement&&document.activeElement.matches&&document.activeElement.matches('li[data-l]')?document.activeElement:null;
  if(!li)return null;
  var n=+li.getAttribute('data-l'),w=li.getAttribute('data-w'),k=li.getAttribute('data-k');
  var note=CUR?CUR.notes.filter(function(z){return z.l===n&&z.w===w})[0]:null;
  var cmd=note?(/(hdrctl[^.]*)/.exec(note.t)||[])[1]:null;
  return {head:trunc(w,32),items:[
    {t:'Reveal in the source',k:'↵',f:function(){gotoLine(n)}},
    {t:'Copy the suggested command',off:!cmd,f:function(){cpy(cmd);toast('Copied: '+trunc(cmd,40))}},
    {t:'Explain this line',f:function(){explainLine(n,e.clientX||160,e.clientY||160)}},
    '-',
    {t:'Mute "'+trunc(w,18)+'"',f:function(){MUTE[w]=1;run();toast('Muted — '+trunc(w,24))}},
    {t:'Unmute everything',off:!Object.keys(MUTE).length,f:function(){MUTE={};run();toast('All warnings back')}}
  ]};
});

/* --- 3. volet YAML --- */
ctx($("yml"),function(e){
  if(!ROWS.length)return null;
  var el=e.target.closest?e.target.closest('.yl'):null;
  var i=el?+el.getAttribute('data-i'):0,b=blockAt(i);
  var txt=ROWS[i]?ROWS[i][0]:'',om=/-\s*op:\s*(\w+)/.exec(txt)||(b&&b.name==='transformations'?/op:\s*(\w+)/.exec(txt):null);
  if(!om&&b&&b.name==='transformations'){for(var j=i;j>=b.a;j--){var t2=/-\s*op:\s*(\w+)/.exec(ROWS[j][0]);if(t2){om=t2;break}}}
  var src=ROWS[i]?ROWS[i][1]:null;
  return {head:b?b.name+':':'yaml',items:[
    {t:'Copy this block',k:'⌘C',off:!b,f:function(){cpy(b.txt);toast('Copied '+b.name+': ('+(b.b-b.a)+' lines)')}},
    {t:om?'Explain op: '+om[1]:'Explain this op',off:!om,f:function(){
      pop('op','op: '+om[1],'<p>'+(OPDOC[om[1]]||'Built-in operation.')+'</p><pre>'+esc(ROWS.slice(Math.max(b.a,i-1),i+2).map(function(r){return r[0]}).join('\n'))+'</pre>',e.clientX,e.clientY)}},
    {t:'Reveal the config line',off:!src,f:function(){gotoLine(src);toast('Line '+src)}},
    '-',
    {t:'What stays in Airbyte',off:!b,f:function(){
      pop('reverse',b.name+': → Python','<p>The same block, kept on the Airbyte side. Nothing here is a one-way door.</p><pre>'+esc(reverse(b.name))+'</pre>',e.clientX,e.clientY)}},
    {t:'Preview on sample data',f:function(){preview(e.clientX,e.clientY)}},
    '-',
    {t:'Copy the whole manifest',f:function(){cpy($("yml").dataset.raw||'');toast('Manifest copied')}},
    {t:'Download',f:function(){$("dl").click()}}
  ]};
});

/* ================= BARRES D'ICONES ================= */
function loadText(txt,label){IGN={};MUTE={};SEL=null;FNAME=label||'';$("src").value=txt;
  $("ex").selectedIndex=-1;$("exTag").textContent=label||'your file';run();
  $("src").scrollTop=0;$("gut").scrollTop=0}
/* --- ouvrir un fichier (bouton + glisser-deposer) --- */
$("icOpen").onclick=function(){$("fileIn").click()};
$("fileIn").onchange=function(e){var f=e.target.files[0];if(!f)return;
  var r=new FileReader();r.onload=function(){loadText(String(r.result),f.name);toast(f.name+' loaded')};r.readAsText(f);e.target.value=''};
(function(){var z=$("src").parentNode;
 ['dragenter','dragover'].forEach(function(t){z.addEventListener(t,function(e){e.preventDefault();z.classList.add('drop')})});
 ['dragleave','drop'].forEach(function(t){z.addEventListener(t,function(e){e.preventDefault();z.classList.remove('drop')})});
 z.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(!f)return;
   var r=new FileReader();r.onload=function(){loadText(String(r.result),f.name);toast(f.name+' dropped')};r.readAsText(f)});})();
/* --- coller --- */
$("icPaste").onclick=function(){
  if(navigator.clipboard&&navigator.clipboard.readText)
    navigator.clipboard.readText().then(function(t){if(t){loadText(t);toast('Pasted')}})
    .catch(function(){toast('Clipboard blocked — click the editor and press Ctrl/Cmd+V')});
  else{$("src").focus();toast('Press Ctrl/Cmd+V in the editor')}};
/* --- retour a la ligne (la gouttiere se retire, les numeros ne suivraient plus) --- */
/* --- parcourir les points de decision --- */
var NEXTi=-1;
function careLines(){if(!CUR)return [];
  var seen={},out=[];
  CUR.notes.forEach(function(n){if(n.k==='care'&&!MUTE[n.w]&&!seen[n.l]){seen[n.l]=1;out.push(n)}});
  return out.sort(function(a,b){return a.l-b.l})}
function syncNext(){var b=$("icNext"),c=careLines().length;
  b.disabled=!c;
  b.setAttribute('data-tip',c?('Next decision point — '+c+' to review'):'No decision left to review');
  b.classList.toggle('on',!!c)}
$("icNext").onclick=function(){var c=careLines();if(!c.length)return;
  NEXTi=(NEXTi+1)%c.length;var n=c[NEXTi];
  gotoLine(n.l);pulse(n.l);
  var li=$("rl").querySelector('li[data-l="'+n.l+'"]');if(li)li.scrollIntoView({block:'nearest'});
  toast('L'+n.l+' · '+n.w+'  ('+(NEXTi+1)+'/'+c.length+')')};
/* --- agrandir un volet --- */
function expand(side){var t=document.querySelector('.two'),cl='exp'+side,on=t.classList.toggle(cl);
  t.classList.remove(side==='L'?'expR':'expL');
  [['L','icExpL'],['R','icExpR']].forEach(function(pair){var b=$(pair[1]);if(!b)return;
    var a=t.classList.contains('exp'+pair[0]);b.classList.toggle('on',a);b.setAttribute('aria-pressed',a);
    b.setAttribute('data-tip',a?'Restore both panes':'Expand this pane')});
  return on}
$("icExpL").onclick=function(){expand('L')};
$("icExpR").onclick=function(){expand('R')};
/* --- dry run / reverse / provenance --- */
$("icRun").onclick=function(){var r=this.getBoundingClientRect();preview(r.left-330,r.bottom+8)};
$("icRev").onclick=function(){
  if(!CUR){toast('Nothing to reverse');return}
  var out=[reverse('name'),'',reverse('source'),'',reverse('transformations'),'',reverse('destination')];
  if(CUR.retries!=null)out.unshift(reverse('retry'),'');
  var r=this.getBoundingClientRect();
  pop('reverse',CUR.name+' · what Airbyte keeps','<p>The division of labour, written out. Round-tripping is not a one-way door.</p><pre>'+esc(out.join('\n'))+'</pre>',r.left-340,r.bottom+8)};
$("icProv").onclick=function(){var on=$("yml").classList.toggle('prov');
  this.classList.toggle('on',on);this.setAttribute('aria-pressed',on);
  this.setAttribute('data-tip',on?'Hide provenance':'Show provenance');
  if(on)toast('Teal bar = traced back to a source line')};
$("yml").addEventListener('mouseover',function(e){
  if(!$("yml").classList.contains('prov'))return;
  var el=e.target.closest?e.target.closest('.yl[data-s]'):null;
  [].slice.call($("gut").children).forEach(function(i){i.classList.remove('hit2')});
  if(el){var g=$("gut").children[+el.getAttribute('data-s')-1];if(g)g.style.outline='2px solid var(--accent)'}
});
$("yml").addEventListener('mouseout',function(){[].slice.call($("gut").children).forEach(function(i){i.style.outline=''})});
/* --- pastille des lignes ignorees --- */
$("icIgn").onclick=function(){IGN={};run();toast('All lines restored')};
var _run=run;
run=function(){_run();NEXTi=-1;syncNext();var n=ignCount(),b=$("icIgn");
  b.style.display=n?'grid':'none';$("icIgnN").textContent=n;
  b.setAttribute('data-tip',n===1?'Restore 1 ignored line':'Restore '+n+' ignored lines')};
run();

/* ================= LINT ================= */
function lintJson(text){
  var L=text.split('\n'),out=[],depth=0,dl=0,st=false;
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1,code='',j=0;
    while(j<ln.length){var c=ln.charAt(j);
      if(st){if(c==='\\'){j+=2;continue}if(c==='"'){st=false}j++;continue}
      if(c==='"'){st=true;j++;continue}
      if('[{'.indexOf(c)>=0){depth++;dl=no}
      else if(']}'.indexOf(c)>=0){depth--;if(depth<0){add('err',no,'unbalanced bracket','A closing bracket has no opener.');depth=0}}
      code+=c;j++;}
    if(SMART.test(ln))add('err',no,'smart quotes','JSON only accepts straight quotes — this file will not parse.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line.');
    if(/,\s*$/.test(code)&&/^\s*[}\]]/.test((L[i+1]||'')))add('err',no,'trailing comma','JSON forbids a comma before a closing bracket.');
    if(/'\s*:/.test(code)||/:\s*'/.test(code))add('err',no,'single quotes','JSON requires double quotes for keys and string values.');
    if(/^\s*\/\//.test(ln))add('err',no,'comment','JSON has no comments — Airbyte will reject the file.');
  }
  if(depth>0)add('err',dl||L.length,'unclosed bracket',depth+' bracket'+(depth>1?'s':'')+' opened and never closed — the paste is probably truncated.');
  var m;
  if(/"syncMode"\s*:\s*"incremental"/.test(text)&&!/"cursorField"/.test(text))
    add('err',1,'incremental without a cursor','A stream in incremental mode needs cursorField, or the sync silently falls back to full refresh.');
  if(/"destinationSyncMode"\s*:\s*"append_dedup"/.test(text)&&!/"primaryKey"/.test(text))
    add('err',1,'append_dedup without a primary key','Deduplication has nothing to deduplicate on.');
  if(/basic_normalization|"normalization"/.test(text))
    add('info',1,'normalization block','Basic normalization was retired in favour of Typing and Deduping. If this config still carries it, it is older than the platform it runs on.');
  if(/"replication_method"[\s\S]*"CDC"/.test(text)&&!/replication_slot/.test(text))
    add('warn',1,'CDC without a slot','CDC needs a replication slot and a publication declared on the database.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintYamlFile(text){
  var L=text.split('\n'),out=[],seen={};
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1;
    if(/^\s*#/.test(ln)||!ln.trim())continue;
    if(/\t/.test(ln))add('err',no,'tab character','YAML forbids tabs for indentation — the manifest will not load.');
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes — YAML reads them as part of the value.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line.');
    var ind=/^ */.exec(ln)[0].length;
    if(ind%2)add('warn',no,'odd indentation',ind+' spaces. Low-code manifests indent by two.');
    var m=/^([\w.\-]+):/.exec(ln);
    if(m){if(seen[m[1]])add('err',no,'duplicate key','"'+m[1]+'" is declared twice at the top level — the second one silently wins.');seen[m[1]]=1}
  }
  if(/type:\s*DeclarativeSource/.test(text)&&!/^\s*version:/m.test(text))
    add('warn',1,'no version','A declarative source without version: pins nothing — the CDK behaviour changes under you.');
  if(/DatetimeBasedCursor/.test(text)&&!/datetime_format:/.test(text))
    add('err',1,'cursor without a format','DatetimeBasedCursor needs datetime_format or every slice fails to parse.');
  if(/paginator:/.test(text)&&!/pagination_strategy:/.test(text))
    add('warn',1,'paginator without a strategy','A DefaultPaginator with no strategy fetches the first page and stops.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintSecrets(text){
  var L=text.split('\n'),out=[];
  for(var i=0;i<L.length;i++){
    var m=/["']?([\w_]*(?:password|secret|token|api_key|client_secret|credential)[\w_]*)["']?\s*[:=]\s*["']([^"']{4,})["']/i.exec(L[i]);
    if(m&&!/\{\{|\$\{|<|xxx|\*\*\*/.test(m[2]))
      out.push({s:'err',l:i+1,w:'secret in plain text',t:'"'+m[1]+'" is readable here. Anything committed to git with this line in it is compromised — move it to a secret reference.'});
  }
  return out;
}
function lintPy(text){
  var k=detectKind(text),base;
  if(k==='lowcode')base=lintYamlFile(text);
  else if(k==='terraform'||k==='rawsql')base=[];
  else base=lintJson(text);
  return base.concat(lintSecrets(text)).sort(function(a,b){return a.l-b.l});
}

function lintYaml(rows,t){
  var out=[];function add(s,i,w,tx){out.push({s:s,i:i,w:w,t:tx})}
  var seen={};
  rows.forEach(function(r,i){
    var l=r[0];
    if(/\?\?\?/.test(l))add('err',i,'unresolved field','The parser found nothing here. Fill it in before running.');
    if(/\$\{SECRET\./.test(l))add('info',i,'secret placeholder','Wire this to your secret store — a manifest never holds credentials.');
    if(/\{\{/.test(l))add('warn',i,'template left in place','Airbyte templating is not evaluated by Hydra. Use ${run.date} or ${env.X}.');
    var k=/^([A-Za-z_]+):/.exec(l);
    if(k){if(seen[k[1]])add('err',i,'duplicate key','"'+k[1]+'" appears twice — the second one silently wins in most YAML parsers.');seen[k[1]]=1}
    var cm=/cron:\s*"([^"]*)"/.exec(l);
    if(cm&&cm[1].trim().split(/\s+/).length!==5)add('err',i,'malformed cron','"'+cm[1]+'" does not have 5 fields.');
    var om=/-\s*op:\s*(\w+)/.exec(l);
    if(om&&!OPDOC[om[1]])add('warn',i,'unknown op','"'+om[1]+'" is not a built-in operation — it needs a plugin.');
  });
  if(t){
    if(t.name==='untitled')add('warn',0,'no name','No dag_id was found, so the job is called "untitled".');
    if(!t.tf.length)add('info',0,'no transformation','A pass-through job — it copies the source to the destination unchanged.');
  }
  return out;
}
function lintHTML(items,mode){
  if(!items.length)return '<p style="color:var(--ok)"><b>Nothing to report.</b> No formatting problem, no version trap, no unresolved field.</p>';
  var c={err:0,warn:0,info:0};items.forEach(function(x){c[x.s]++});
  return '<p style="margin:0 0 8px">'+c.err+' blocking &middot; '+c.warn+' worth fixing &middot; '+c.info+' for information</p><ul class="lint">'+
    items.map(function(x){
      var ref=mode==='py'?(' data-goto="'+x.l+'"'):(x.i!=null?' data-yl="'+x.i+'"':'');
      return '<li'+ref+'><span class="sv '+x.s+'"></span><span class="ln2">'+(mode==='py'?x.l:(x.i!=null?x.i+1:''))+'</span>'+
        '<span><span class="w2">'+esc(x.w)+'</span><br><span class="t2">'+esc(x.t)+'</span></span></li>'}).join('')+'</ul>';
}
function sev(items){return items.some(function(x){return x.s==='err'})?'err':(items.some(function(x){return x.s==='warn'})?'warn':(items.length?'info':'ok'))}
function paint(btn,items,label){
  var s=sev(items);btn.classList.remove('sev-ok','sev-warn','sev-err');
  if(s==='err')btn.classList.add('sev-err');else if(s==='warn')btn.classList.add('sev-warn');else if(s==='ok')btn.classList.add('sev-ok');
  var n=items.length;
  btn.setAttribute('data-tip',n?(label+' — '+n+' finding'+(n>1?'s':'')):(label+' — all clear'));
}
$("icLint").onclick=function(){var it=lintPy($("src").value),r=this.getBoundingClientRect();
  pop(sev(it)==='ok'?'clean':sev(it),'Code check',lintHTML(it,'py'),r.left-40,r.bottom+8)};
$("icVal").onclick=function(){var it=lintYaml(ROWS,CUR),r=this.getBoundingClientRect();
  pop(sev(it)==='ok'?'clean':sev(it),'hdrctl validate',lintHTML(it,'yaml'),r.left-340,r.bottom+8)};
$("popB").addEventListener('click',function(e){
  var li=e.target.closest?e.target.closest('li[data-goto],li[data-yl]'):null;if(!li)return;
  if(li.hasAttribute('data-goto')){closePop();gotoLine(+li.getAttribute('data-goto'))}
  else{var el=$("yml").querySelector('.yl[data-i="'+li.getAttribute('data-yl')+'"]');
    if(el){[].slice.call($("yml").querySelectorAll('.yl')).forEach(function(x){x.classList.remove('pulse')});
      el.classList.add('pulse');el.scrollIntoView({block:'center'})}}});
var _run2=run;
run=function(){_run2();
  paint($("icLint"),$("src").value.trim()?lintPy($("src").value):[],'Check the code');
  paint($("icVal"),ROWS.length?lintYaml(ROWS,CUR):[],'Validate the manifest')};
run();