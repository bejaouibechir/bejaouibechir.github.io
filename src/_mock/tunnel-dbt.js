var $=function(i){return document.getElementById(i)};
(function(){var t=localStorage.getItem('hydra-theme');if(t)document.documentElement.setAttribute('data-theme',t);
$("themeBtn").onclick=function(){var d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);localStorage.setItem('hydra-theme',n)};
var b=$("burger"),dr=$("drawer");b.onclick=function(){var o=dr.classList.toggle('open');b.setAttribute('aria-expanded',o)};
document.addEventListener('click',function(e){if(dr.classList.contains('open')&&!dr.contains(e.target)&&!b.contains(e.target)){dr.classList.remove('open');b.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open')){dr.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}});})();
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

var EX=[
{n:'sources.yml — what dbt assumes exists',f:'models/staging/sources.yml',s:
'version: 2\n'+
'\n'+
'sources:\n'+
'  - name: raw\n'+
'    database: analytics\n'+
'    schema: raw\n'+
'    loaded_at_field: _ingested_at\n'+
'    freshness:\n'+
'      warn_after: {count: 6, period: hour}\n'+
'      error_after: {count: 24, period: hour}\n'+
'    tables:\n'+
'      - name: orders\n'+
'        description: "One row per order, loaded nightly"\n'+
'      - name: customers\n'+
'        description: "CRM export"\n'+
'      - name: products\n'},
{n:'Staging model (.sql)',f:'models/staging/stg_orders.sql',s:
'{{ config(materialized=\'view\') }}\n'+
'\n'+
'with source as (\n'+
'    select * from {{ source(\'raw\', \'orders\') }}\n'+
'),\n'+
'\n'+
'renamed as (\n'+
'    select\n'+
'        order_id,\n'+
'        customer_id,\n'+
'        amount_cents / 100.0 as amount,\n'+
'        region,\n'+
'        status,\n'+
'        created_at\n'+
'    from source\n'+
'    where status != \'test\'\n'+
')\n'+
'\n'+
'select * from renamed\n'},
{n:'Incremental mart (.sql)',f:'models/marts/orders_daily.sql',s:
'{{ config(\n'+
'    materialized=\'incremental\',\n'+
'    unique_key=\'day_region\',\n'+
'    incremental_strategy=\'merge\'\n'+
') }}\n'+
'\n'+
'select\n'+
'    date_trunc(\'day\', created_at) as day,\n'+
'    region,\n'+
'    sum(amount) as net\n'+
'from {{ ref(\'stg_orders\') }}\n'+
'{% if is_incremental() %}\n'+
'where created_at > (select max(day) from {{ this }})\n'+
'{% endif %}\n'+
'group by 1, 2\n'},
{n:'Python model (pandas)',f:'models/marts/rollup.py',s:
'import pandas as pd\n'+
'\n'+
'def model(dbt, session):\n'+
'    dbt.config(materialized="table")\n'+
'    df = dbt.ref("stg_orders").to_pandas()\n'+
'    df = df[df.status == "paid"]\n'+
'    df = df.drop_duplicates(subset=["order_id"])\n'+
'    df = df.groupby(["region"]).agg({"amount": "sum"}).reset_index()\n'+
'    df = df.rename(columns={"amount": "net"})\n'+
'    return df\n'},
{n:'schema.yml — tests',f:'models/marts/schema.yml',s:
'version: 2\n'+
'\n'+
'models:\n'+
'  - name: orders_daily\n'+
'    description: "Net revenue per day and region"\n'+
'    columns:\n'+
'      - name: day\n'+
'        tests:\n'+
'          - not_null\n'+
'      - name: region\n'+
'        tests:\n'+
'          - not_null\n'+
'          - accepted_values:\n'+
'              values: [EU, US, APAC]\n'+
'      - name: net\n'+
'        tests:\n'+
'          - dbt_utils.accepted_range:\n'+
'              min_value: 0\n'},
{n:'dbt_project.yml',f:'dbt_project.yml',s:
'name: acme_analytics\n'+
'version: 1.0.0\n'+
'config-version: 2\n'+
'profile: acme\n'+
'\n'+
'model-paths: ["models"]\n'+
'seed-paths: ["seeds"]\n'+
'\n'+
'models:\n'+
'  acme_analytics:\n'+
'    staging:\n'+
'      +materialized: view\n'+
'    marts:\n'+
'      +materialized: table\n'+
'\n'+
'seeds:\n'+
'  acme_analytics:\n'+
'    country_codes:\n'+
'      +column_types:\n'+
'        code: varchar(2)\n'},
{n:'Seed configuration',f:'seeds/properties.yml',s:
'version: 2\n'+
'\n'+
'seeds:\n'+
'  - name: country_codes\n'+
'    description: "ISO codes, 249 rows, updated by hand twice a year"\n'+
'    config:\n'+
'      schema: reference\n'+
'      column_types:\n'+
'        code: varchar(2)\n'+
'        name: varchar(80)\n'+
'  - name: fx_rates\n'+
'    description: "Refreshed monthly from an API"\n'},
{n:'Snapshot',f:'snapshots/customers_snapshot.sql',s:
'{% snapshot customers_snapshot %}\n'+
'{{ config(\n'+
'    target_schema=\'snapshots\',\n'+
'    unique_key=\'customer_id\',\n'+
'    strategy=\'timestamp\',\n'+
'    updated_at=\'updated_at\'\n'+
') }}\n'+
'\n'+
'select * from {{ source(\'raw\', \'customers\') }}\n'+
'\n'+
'{% endsnapshot %}\n'},
{n:'Model with a hardcoded table',f:'models/marts/leaky.sql',s:
'{{ config(materialized=\'table\') }}\n'+
'\n'+
'select\n'+
'    o.order_id,\n'+
'    c.country\n'+
'from analytics.raw.orders o\n'+
'left join {{ ref(\'stg_customers\') }} c\n'+
'  on c.customer_id = o.customer_id\n'+
'where o.status = \'paid\'\n'},
{n:'exposures.yml',f:'models/exposures.yml',s:
'version: 2\n'+
'\n'+
'exposures:\n'+
'  - name: weekly_board_deck\n'+
'    type: dashboard\n'+
'    maturity: high\n'+
'    url: https://bi.acme.io/dash/12\n'+
'    depends_on:\n'+
'      - ref(\'orders_daily\')\n'+
'      - ref(\'stg_customers\')\n'+
'    owner:\n'+
'      name: Data Team\n'+
'      email: data@acme.io\n'}];

var PRESET={'@daily':'0 0 * * *','@hourly':'0 * * * *','@weekly':'0 0 * * 0','@monthly':'0 0 1 * *','@yearly':'0 0 1 1 *','@once':null,'None':null,'@continuous':null};
var KNOWN=/^(Python|Bash|Empty|Dummy|SQLExecuteQuery|Postgres|MySql|Trigger|Branch|Short|Docker|Kubernetes|Email|S3ToRedshift|GCSToBigQuery)Operator$/;
function delta(s){var d=/days\s*=\s*(\d+)/.exec(s),h=/hours\s*=\s*(\d+)/.exec(s),m=/minutes\s*=\s*(\d+)/.exec(s);
  if(d)return +d[1]===1?'0 0 * * *':'0 0 */'+d[1]+' * *';if(h)return '0 */'+h[1]+' * * *';if(m)return '*/'+m[1]+' * * * *';return null}
function q(s){return '"'+String(s).replace(/"/g,'\\"')+'"'}
function cols(s){return s.split(',').map(function(x){return x.replace(/["'\s]/g,'')}).filter(Boolean)}

function secretName(s){return '${SECRET.'+String(s).toUpperCase().replace(/[^A-Z0-9]+/g,'_')+'}'}
var FNAME='';
function baseName(f){return String(f||'').split(/[\\/]/).pop().replace(/\.(sql|yml|yaml|py|txt)$/i,'')}
function detectKind(t){
  if(/def\s+model\s*\(\s*dbt\s*,/.test(t))return 'pymodel';
  if(/\{%\s*snapshot\b/.test(t))return 'snapshot';
  if(/\{%\s*macro\b/.test(t))return 'macro';
  if(/^\s*sources:/m.test(t))return 'sources';
  if(/^\s*exposures:/m.test(t))return 'exposures';
  if(/^\s*seeds:\s*$/m.test(t)&&/-\s*name:/.test(t))return 'seeds';
  if(/^\s*models:/m.test(t)&&/tests:/.test(t))return 'schema';
  if(/^\s*profile:/m.test(t)||/config-version:/.test(t))return 'project';
  if(/\{\{\s*(config|ref|source)\s*\(/.test(t)||/^\s*select\b/mi.test(t))return 'sqlmodel';
  if(/^\s*models:/m.test(t))return 'schema';
  return 'pymodel';
}
function yamlLines(L){/* petit lecteur : renvoie [{ind,key,val,l}] */
  return L.map(function(s,i){var m=/^(\s*)(?:-\s*)?([\w.\-]+)?\s*:\s*(.*)$/.exec(s);
    return m?{ind:m[1].length,key:m[2]||null,val:(m[3]||'').trim(),dash:/^\s*-/.test(s),l:i+1,raw:s}:{ind:0,key:null,val:null,dash:/^\s*-/.test(s),l:i+1,raw:s}})
}
function translate(text){
  var L=text.split('\n'),N=[],kind=detectKind(text);
  function note(k,l,w,t){N.push({k:k,l:l,w:w,t:t})}
  var base={name:'untitled',cron:null,manual:true,tf:[],src:null,dst:null,acts:[],retries:null,backoff:null,cache:null,
            notes:N,lName:null,lCron:null,lRetry:null,lCache:null,srcs:[],dsts:[],grp:{imp:[],xcom:[]},kind:kind,jobs:[],dbt:null};

  /* ============ sources.yml : ce que dbt suppose deja charge ============ */
  if(kind==='sources'){
    var Y=yamlLines(L),cur=null,tables=[],db=null,sch=null,srcName=null,fresh=null;
    Y.forEach(function(y){
      if(y.key==='name'&&y.dash&&srcName===null){srcName=y.val;note('map',y.l,'source '+y.val,'One ingestion job per table below.');return}
      if(y.key==='database'){db=y.val;return}
      if(y.key==='schema'){sch=y.val;return}
      if(y.key==='loaded_at_field'){note('care',y.l,'loaded_at_field','dbt checks freshness on this column — your ingestion job has to write it. Add it as a derived column.');return}
      if(y.key==='freshness'){fresh=y.l;note('care',y.l,'freshness thresholds','dbt raises the alarm when data is stale; it never loads it. These thresholds are a contract your Hydra job has to honour.');return}
      if(y.key==='tables'){return}
      if(y.key==='name'&&y.dash&&srcName!==null){tables.push({t:y.val,l:y.l});return}
      if(y.key==='description'){return}
    });
    if(!tables.length&&srcName)tables.push({t:srcName,l:1});
    tables.forEach(function(x,i){
      if(i>0)note('map',x.l,'table '+x.t,'jobs/load_'+(sch||'raw')+'_'+x.t+'.yaml');
      base.jobs.push({name:'load_'+(sch?sch+'_':'')+x.t,table:(sch?sch+'.':'')+x.t,src:x.t,l:x.l})});
    base.name=(srcName||'raw')+'_ingestion';
    base.dbt={cmd:'dbt build --select source:'+(srcName||'raw')+'+',db:db,schema:sch,tables:tables.length};
    note('map',1,'sources block','dbt declares these tables; it never creates them. This is exactly the layer Hydra fills.');
    note('care',1,'no loader in your project','Whatever loads '+tables.length+' table'+(tables.length>1?'s':'')+' today — a script, a vendor tool — becomes '+tables.length+' manifest'+(tables.length>1?'s':'')+' plus one workflow. Point the source at your real system before running.');
    return base;
  }

  /* ============ modeles SQL, snapshots, macros : ca reste chez dbt ============ */
  if(kind==='sqlmodel'||kind==='snapshot'||kind==='macro'){
    var mat=(/materialized\s*=\s*['"](\w+)['"]/.exec(text)||[])[1]||null;
    var refs=[],srcs2=[],hard=[];
    for(var i=0;i<L.length;i++){var ln=L[i],no=i+1,m,re;
      re=/\{\{\s*ref\(\s*['"]([\w.]+)['"]/g;while(m=re.exec(ln))refs.push({n:m[1],l:no});
      re=/\{\{\s*source\(\s*['"]([\w.]+)['"]\s*,\s*['"]([\w.]+)['"]/g;while(m=re.exec(ln))srcs2.push({n:m[1]+'.'+m[2],l:no});
      if(m=/\bfrom\s+([a-z_][\w]*\.[\w.]+)/i.exec(ln))if(!/\{\{/.test(ln))hard.push({n:m[1],l:no});
      if(/is_incremental\(\)/.test(ln))note('care',no,'incremental model','dbt keeps the merge logic. Hydra only guarantees the upstream source is fresh before dbt runs.');
      if(/\{%\s*snapshot/.test(ln))note('care',no,'snapshot','Slowly-changing dimensions stay in dbt — Hydra has no snapshot strategy. It feeds the source the snapshot reads.');
      if(/\{%\s*macro/.test(ln))note('care',no,'macro','Macros are dbt-only. Nothing to translate, nothing to replace.');
    }
    base.name=(/\{%\s*snapshot\s+(\w+)/.exec(text)||/\{%\s*macro\s+(\w+)/.exec(text)||[])[1]||baseName(FNAME)||'model';
    base.dbt={mat:mat,refs:refs,srcs:srcs2,hard:hard,cmd:'dbt build --select '+base.name};
    note('drop',1,'the SQL itself','Hydra does not translate models. Rewriting working SQL into YAML would be a downgrade — dbt is better at this than any declarative op list.');
    if(mat)note('map',1,'materialized: '+mat,'Stays a dbt config. Hydra never decides how your warehouse stores a model.');
    srcs2.forEach(function(s,i){if(i===0)note('map',s.l,'source('+s.n+')','This is the seam: Hydra can own loading '+s.n+', dbt owns everything after it.');
      base.jobs.push({name:'load_'+s.n.replace(/\./g,'_'),table:s.n.replace('.','.') ,src:s.n.split('.').pop(),l:s.l})});
    refs.forEach(function(rf,i){if(i===0)note('drop',rf.l,refs.length+' ref()'+(refs.length>1?'s':''),'The model graph is dbt’s job. Hydra does not rebuild a lineage engine.')});
    hard.forEach(function(hd){note('care',hd.l,'hardcoded table '+hd.n,'Not a ref() and not a source() — dbt cannot see this dependency, so it cannot order or test it. Declare it as a source, then let Hydra load it.')});
    return base;
  }

  /* ============ modele Python : la seule chose qui se traduit vraiment ============ */
  if(kind==='pymodel'){
    var tf=[],dst=null,srcRef=null;
    for(var i=0;i<L.length;i++){var ln=L[i],no=i+1,m;
      if(/^\s*(from|import)\s+/.test(ln)){note('drop',no,'import','A manifest is data — nothing to import.');continue}
      if(/^\s*def\s+model\s*\(/.test(ln)){note('drop',no,'def model(dbt, session)','The entry point disappears; the manifest is the entry point.');continue}
      if(m=/dbt\.config\(\s*materialized\s*=\s*["'](\w+)["']/.exec(ln)){note('map',no,'dbt.config','destination.mode: '+(m[1]==='incremental'?'append':'replace'));continue}
      if(m=/dbt\.ref\(\s*["']([\w.]+)["']/.exec(ln)){srcRef=m[1];note('care',no,'dbt.ref('+m[1]+')','This model reads another dbt model. Moving it to Hydra breaks the lineage graph — only do it if the logic is ingestion, not modelling.');continue}
      if(m=/dbt\.source\(\s*["']([\w.]+)["']\s*,\s*["']([\w.]+)["']/.exec(ln)){srcRef=m[1]+'.'+m[2];note('map',no,'dbt.source','source.table: '+srcRef);continue}
      if(/^\s*return\s+\w+\s*$/.test(ln)){note('care',no,'returned frame','dbt writes the return value to the warehouse. Hydra has no implicit sink — name the destination table.');continue}
      if(m=/=\s*\w+\[\[([^\]]+)\]\]/.exec(ln)){tf.push({op:'select',p:'{columns: ['+cols(m[1]).join(', ')+']}',l:no});note('map',no,'column subset','op: select');continue}
      if(m=/\.rename\(\s*columns\s*=\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'rename',p:'{map: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'rename','op: rename');continue}
      if(m=/\.astype\(\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'cast',p:'{types: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'astype','op: cast');continue}
      if(m=/\.fillna\(\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'fill_null',p:'{values: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'fillna','op: fill_null');continue}
      if(m=/\.drop_duplicates\(\s*(?:subset\s*=\s*\[([^\]]*)\])?/.exec(ln)){tf.push({op:'deduplicate',p:m[1]?'{keys: ['+cols(m[1]).join(', ')+']}':'{}',l:no});note('map',no,'drop_duplicates','op: deduplicate');continue}
      if(m=/\.sort_values\(\s*(?:by\s*=\s*)?["'](\w+)["']([^)]*)\)/.exec(ln)){var asc=!/ascending\s*=\s*False/.test(m[2]);
        tf.push({op:'sort',p:'{by: ['+m[1]+'], order: '+(asc?'asc':'desc')+'}',l:no});note('map',no,'sort_values','op: sort');continue}
      if(m=/\.groupby\(\s*(\[[^\]]*\]|["']\w+["'])\s*\)/.exec(ln)){
        var keys=cols(m[1].replace(/[\[\]]/g,'')),ag=/\.agg\(\s*\{([^}]*)\}/.exec(ln),p;
        if(ag){p='{by: ['+keys.join(', ')+'], agg: {'+ag[1].replace(/["']/g,'').trim()+'}}'}
        else{var cf=/\.(\w+)\.(sum|mean|count|min|max)\(/.exec(ln);p=cf?'{by: ['+keys.join(', ')+'], agg: {'+cf[1]+': '+cf[2]+'}}':'{by: ['+keys.join(', ')+']}'}
        tf.push({op:'aggregate',p:p,l:no});note('map',no,'groupby','op: aggregate');continue}
      if(m=/\[\s*\w+[.\[]["']?(\w+)["']?\]?\s*(==|!=|>=|<=|>|<)\s*([^\]]+?)\s*\]/.exec(ln)){
        tf.push({op:'filter',p:'{expr: '+q(m[1]+' '+m[2]+' '+m[3].trim())+'}',l:no});note('map',no,'boolean mask','op: filter');continue}
      if(/\.apply\(|lambda\s/.test(ln))note('care',no,'apply / lambda','Arbitrary Python has no declarative form — this becomes a plugin.');
    }
    base.name=(/dbt\.ref\(\s*["']([\w.]+)/.exec(text)||[,'py_model'])[1].replace(/^stg_/,'')+'_job';
    base.tf=tf;base.manual=true;
    base.src=srcRef?{t:'sql',q:'SELECT * FROM '+srcRef,l:1,conn:'${SECRET.DWH}'}:null;
    base.dst=null;base.dbt={cmd:null,py:true};
    if(!srcRef)note('care',1,'no source found','Nothing readable was detected — fill source: by hand.');
    note('care',1,'no destination found','A dbt Python model writes itself. A Hydra job has to say where.');
    return base;
  }

  /* ============ tests, projet, seeds, exposures ============ */
  if(kind==='schema'){
    var tcount=(text.match(/^\s*-\s*[\w.]+\s*$/gm)||[]).length,tl=[];
    L.forEach(function(ln,i){if(/tests:/.test(ln))tl.push(i+1)});
    base.name=(/-\s*name:\s*([\w.]+)/.exec(text)||[,'model'])[1];
    base.dbt={tests:tl.length,cmd:'dbt test --select '+base.name};
    note('care',tl.length?tl[0]:1,'dbt tests','Hydra v1 has no data-quality layer. Every test here stays in dbt — and that is a reason to keep dbt, not a gap to paper over.');
    note('map',1,'the contract','What Hydra can do is run dbt test as a workflow step and stop the pipeline when it fails.');
    return base;
  }
  if(kind==='project'){
    base.name=(/^\s*name:\s*([\w.\-]+)/m.exec(text)||[,'dbt_project'])[1];
    base.dbt={cmd:'dbt build',project:true};
    note('drop',1,'the whole file','Project config, paths, materialization defaults — none of it has a Hydra equivalent, and none of it needs one.');
    note('map',1,'what Hydra adds','A workflow that loads the sources, runs dbt build, then exports the marts — with one schedule instead of three tools.');
    var sd=/^\s*seed-paths:/m.exec(text);
    if(sd)note('care',text.slice(0,sd.index).split('\n').length,'seeds','A seed is a CSV loaded into the warehouse — that is a Hydra job with two lines. Worth moving if your seeds are refreshed by anything other than a human.');
    return base;
  }
  if(kind==='seeds'){
    var names=[];L.forEach(function(ln,i){var m=/^\s*-\s*name:\s*([\w.]+)/.exec(ln);if(m)names.push({t:m[1],l:i+1})});
    names.forEach(function(x){base.jobs.push({name:'load_'+x.t,table:'reference.'+x.t,src:x.t+'.csv',l:x.l,seed:1});
      note('map',x.l,'seed '+x.t,'jobs/load_'+x.t+'.yaml — a CSV into a table is the simplest job there is.')});
    base.name='seeds_ingestion';base.dbt={cmd:'dbt seed',seeds:names.length};
    note('care',1,'is it really a seed?','dbt seed is for small static files committed to git. Anything refreshed on a schedule belongs in a Hydra job, not in your repository.');
    return base;
  }
  if(kind==='exposures'){
    var deps=[];L.forEach(function(ln,i){var m=/ref\(\s*['"]([\w.]+)['"]/.exec(ln);if(m)deps.push({n:m[1],l:i+1})});
    base.name=(/-\s*name:\s*([\w.]+)/.exec(text)||[,'exposure'])[1];
    base.dbt={exposure:1,deps:deps,cmd:'dbt build --select +exposure:'+base.name};
    note('drop',1,'the exposure itself','Documentation of a downstream consumer. Hydra has no catalog to register it in.');
    note('map',1,'the useful half','If that dashboard reads a file rather than the warehouse, the export becomes a Hydra job chained after dbt build.');
    deps.forEach(function(d,i){if(i===0)note('care',d.l,deps.length+' upstream model'+(deps.length>1?'s':''),'These must be fresh before the dashboard is read — that ordering is exactly what a workflow expresses.')});
    return base;
  }
  return base;
}

function buildYaml(t){
  var o=[],d=t.dbt||{};
  function O(s,l){o.push([s,l==null?null:l])}
  function hdr(s){O('# ─────────  '+s+'  ─────────',null);O('',null)}
  var cron=t.cron||'0 2 * * *';

  /* --- modele Python : le seul cas ou un job complet sort --- */
  if(t.kind==='pymodel'){
    O('name: '+t.name,t.lName);O('',null);
    O('trigger:',null);O('  type: manual        # dbt run drives it today',null);O('',null);
    O('source:',t.src?t.src.l:null);
    if(t.src){O('  type: sql',t.src.l);O('  conn: ${SECRET.DWH}',t.src.l);O('  query: '+q(t.src.q),t.src.l)}
    else O('  type: ???        # nothing detected — fill this in',null);
    O('',null);O('transformations:',null);
    if(!t.tf.length)O('  []               # pass-through',null);
    else t.tf.forEach(function(x){O('  - op: '+x.op,x.l);if(x.p&&x.p!=='{}')O('    params: '+x.p,x.l)});
    O('',null);O('destination:',null);
    O('  type: ???        # dbt wrote the return value for you — name the table',null);
    return o;
  }

  /* --- ce qui reste chez dbt : on le dit, on ne le traduit pas --- */
  if(t.kind==='sqlmodel'||t.kind==='snapshot'||t.kind==='macro'){
    hdr('this stays in dbt');
    O('# '+t.name+(d.mat?'   ·   materialized: '+d.mat:''),null);
    if(d.refs&&d.refs.length)O('# reads '+d.refs.length+' model'+(d.refs.length>1?'s':'')+': '+d.refs.map(function(r){return r.n}).join(', '),null);
    if(d.srcs&&d.srcs.length)O('# reads '+d.srcs.length+' source'+(d.srcs.length>1?'s':'')+': '+d.srcs.map(function(r){return r.n}).join(', '),null);
    if(d.hard&&d.hard.length)O('# '+d.hard.length+' hardcoded table'+(d.hard.length>1?'s':'')+' — invisible to dbt: '+d.hard.map(function(r){return r.n}).join(', '),null);
    O('#',null);
    O('# Hydra does not rewrite SQL. It guarantees what the model reads',null);
    O('# is there and fresh, then runs dbt, then ships the result.',null);
    O('',null);
  }
  if(t.kind==='schema'){
    hdr('tests stay in dbt');
    O('# '+(d.tests||0)+' test block'+((d.tests||0)>1?'s':'')+' on '+t.name,null);
    O('# Hydra v1 has no data-quality layer. What a workflow adds is',null);
    O('# ordering: load, build, test — and a stop when the test fails.',null);O('',null);
  }
  if(t.kind==='project'){
    hdr('dbt_project.yml has no counterpart');
    O('# Paths, profiles, materialization defaults — all dbt-only.',null);
    O('# What follows is the missing half: the schedule and the loading.',null);O('',null);
  }
  if(t.kind==='exposures'){
    hdr('exposures stay in dbt');
    O('# '+((d.deps||[]).length)+' upstream model'+(((d.deps||[]).length)>1?'s':'')+' must be fresh before this is read.',null);O('',null);
  }

  /* --- les jobs d'ingestion : ce que dbt suppose deja charge --- */
  (t.jobs||[]).forEach(function(j){
    hdr('jobs/'+j.name+'.yaml');
    O('name: '+j.name,j.l);O('',null);
    O('trigger:',null);O('  type: manual        # the workflow drives it',null);O('',null);
    O('source:',j.l);
    if(j.seed){O('  type: csv',j.l);O('  path: "seeds/'+j.src+'"',j.l)}
    else{O('  type: ???           # your real system: Postgres, an API, a file drop',j.l);
         O('  query: '+q('SELECT * FROM '+j.src),j.l)}
    O('',null);
    O('destination:',j.l);O('  type: postgres',j.l);O('  table: '+q(j.table),j.l);O('  mode: replace',j.l);O('',null);
  });

  /* --- le workflow : la piece que dbt n'a pas --- */
  var steps=(t.jobs||[]).map(function(j){return j.name});
  hdr('workflows/'+t.name+'.yaml');
  O('version: "1.0"',null);O('workflow:',null);O('  name: '+t.name,t.lName);
  O('  trigger:',null);O('    type: schedule',null);
  O('    cron: '+q(cron)+'        # dbt has no scheduler — this is it',null);
  O('  steps:',null);
  (t.jobs||[]).forEach(function(j){
    O('    - name: '+j.name,j.l);O('      type: job',j.l);O('      job: "./jobs/'+j.name+'.yaml"',j.l)});
  var build=d.cmd||'dbt build';
  O('    - name: dbt_build',null);O('      type: action',null);O('      action: shell',null);
  O('      params:',null);O('        command: '+q(build),null);
  if(steps.length)O('      depends_on: ['+steps.map(function(s){return q(s)}).join(', ')+']',null);
  if(t.kind==='schema'){
    O('    - name: dbt_test',null);O('      type: action',null);O('      action: shell',null);
    O('      params:',null);O('        command: '+q('dbt test --select '+t.name),null);
    O('      depends_on: ["dbt_build"]',null);O('      on_failure: stop',null);
  }
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
  if(!text.trim()){$("yml").innerHTML='<span class="yc"># paste a dbt file on the left — sources.yml, a model, schema.yml —\n# or pick a sample above.</span>';$("yml").dataset.raw='';
    $("fnB").textContent='job.yaml';$("cMap").textContent='0';$("cDrop").textContent='0';$("cCare").textContent='0';
    $("gut").innerHTML='<i>1</i>';$("rl").innerHTML='<li class="empty">Waiting for a dbt file.</li>';CUR=null;ROWS=[];return}
  var t=translate(SEL!=null?SEL.text:effective(text));CUR=t;
  ROWS=buildYaml(t);
  var y=ROWS.map(function(r){return r[0]}).join('\n');
  $("yml").innerHTML=colorYaml(ROWS);
  $("yml").dataset.raw=y;
  $("fnB").textContent=(SEL!=null?'selection · ':'')+((t.jobs&&t.jobs.length)||t.kind!=='pymodel'?'workflows/':'jobs/')+t.name+'.yaml';
  $("fnA").textContent=(t.name==='untitled'?'model':t.name)+({sources:'.yml',schema:'.yml',project:'.yml',seeds:'.yml',exposures:'.yml',pymodel:'.py'}[t.kind]||'.sql')+(ignCount()?'  ('+ignCount()+' ignored)':'');
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
$("blank").onclick=function(){FNAME='';$("src").value='';$("fnA").textContent='dbt file';$("exTag").textContent='';run();$("src").focus()};
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
  return '# '+block+' has no dbt counterpart';
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
    {t:'Paste a dbt file',k:'⌘V',f:function(){
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
    {t:'Reveal the dbt line',off:!src,f:function(){gotoLine(src);toast('Line '+src)}},
    '-',
    {t:'What stays in dbt',off:!b,f:function(){
      pop('reverse',b.name+': → Python','<p>The same block, kept on the dbt side. Nothing here is a one-way door.</p><pre>'+esc(reverse(b.name))+'</pre>',e.clientX,e.clientY)}},
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
  pop('reverse',CUR.name+' · what dbt keeps','<p>The division of labour, written out. Round-tripping is not a one-way door.</p><pre>'+esc(out.join('\n'))+'</pre>',r.left-340,r.bottom+8)};
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
function pyScan(text){
  var L=text.split('\n'),out=[],st=null,depth=0,dl=0,bs=false,info=[];
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  for(var i=0;i<L.length;i++){
    var raw=L[i],no=i+1,code='',cont=(depth>0)||st!==null||bs,j=0;
    while(j<raw.length){
      var ch=raw.charAt(j),two=raw.substr(j,3);
      if(st){if(st.length===3){if(two===st){st=null;j+=3;continue}}
        else{if(ch==='\\'){j+=2;continue}if(ch===st){st=null;j++;continue}}
        code+=' ';j++;continue}
      if(ch==='#')break;
      if(two==='"""'||two==="'''"){st=two;code+='  ';j+=3;continue}
      if(ch==='"'||ch==="'"){st=ch;code+=' ';j++;continue}
      if('([{'.indexOf(ch)>=0){depth++;dl=no}
      else if(')]}'.indexOf(ch)>=0){depth--;if(depth<0){add('err',no,'unbalanced bracket','A closing bracket has no opener.');depth=0}}
      code+=ch;j++;}
    if(st&&st.length===1)st=null;
    bs=/\\$/.test(raw.replace(/\s+$/,''));
    info.push({no:no,code:code,raw:raw,cont:cont,ind:/^[ \t]*/.exec(raw)[0].length,blank:!raw.trim()});}
  if(st)add('err',L.length,'unterminated string','A triple-quoted string is never closed.');
  if(depth>0)add('err',dl,'unclosed bracket',depth+' bracket'+(depth>1?'s':'')+' opened and never closed — the paste is probably truncated.');
  return {out:out,info:info,add:add};
}
function lintPython(text){
  var S=pyScan(text),out=S.out,info=S.info,add=S.add;
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  var lg=[],cur=null;
  info.forEach(function(x){if(x.blank)return;
    if(x.cont&&cur){cur.code+=' '+x.code.replace(/^[ \t]+/,'');return}
    cur={no:x.no,code:x.code,ind:x.ind};lg.push(cur)});
  var KW=/^(def|class|if|elif|else|for|while|with|try|except|finally|match|case|async|lambda)\b/,prev=null;
  lg.forEach(function(x){var c=x.code.replace(/\s+$/,''),head=c.replace(/^[ \t]*/,'');
    if(/:$/.test(c)&&!KW.test(head)&&!/^@/.test(head))add('err',x.no,'statement ends with ":"','Python cannot parse this — a colon only closes a block header.');
    if(prev&&x.ind>prev.ind&&!/:$/.test(prev.code.replace(/\s+$/,'')))add('err',x.no,'unexpected indent','This line is indented, but line '+prev.no+' opens no block.');
    prev=x});
  info.forEach(function(x){
    if(SMART.test(x.raw))add('err',x.no,'smart quotes','Curly quotes from a word processor — Python will not parse this line.');
    if(NBSP.test(x.raw))add('err',x.no,'non-breaking space','An invisible U+00A0 sits in this line.');
    if(/^\t+/.test(x.raw))add('warn',x.no,'tab indent','Tabs mixed into Python indentation.');
    if(/dbt\.config\(/.test(x.code)&&x.ind===0)add('warn',x.no,'dbt.config outside model','dbt.config only works inside def model(dbt, session).');
  });
  if(!/def\s+model\s*\(\s*dbt\s*,\s*session/.test(text))
    add('err',1,'no model(dbt, session)','A dbt Python model must define exactly def model(dbt, session). Without it dbt will not pick the file up.');
  if(/def\s+model\s*\(/.test(text)&&!/^\s*return\s/m.test(text))
    add('err',1,'model returns nothing','dbt writes the returned frame. A model with no return produces no table.');
  if(!/dbt\.(ref|source)\(/.test(text))
    add('warn',1,'no ref() or source()','Reading a table directly makes the dependency invisible to dbt — it cannot order or test it.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintSql(text){
  var L=text.split('\n'),out=[];
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  var par=0,pl=0,jj=0,jl=0,blk=0,bl=0;
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1,code=ln.replace(/--.*$/,'');
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes — the warehouse will reject this string literal.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line.');
    if(/\t/.test(ln))add('info',no,'tab character','Harmless in SQL, but it breaks alignment for everyone else.');
    jj+=(code.match(/\{\{/g)||[]).length-(code.match(/\}\}/g)||[]).length;if(jj!==0&&!jl)jl=no;
    blk+=(code.match(/\{%/g)||[]).length-(code.match(/%\}/g)||[]).length;if(blk!==0&&!bl)bl=no;
    var clean=code.replace(/'[^']*'/g,"''").replace(/\{\{[^}]*\}\}/g,'X');
    par+=(clean.match(/\(/g)||[]).length-(clean.match(/\)/g)||[]).length;if(par>0&&!pl)pl=no;
    if(/\{\{\s*(ref|source)\s*\(\s*[^'"]/.test(code))add('err',no,'unquoted ref/source','ref() and source() take quoted strings.');
    if(/\bfrom\s+[a-z_]\w*\.\w+/i.test(code)&&!/\{\{/.test(code))add('warn',no,'hardcoded table','Not a ref() or source() — dbt cannot see this dependency, so it cannot order, test or document it.');
    if(/^\s*select\s+\*/i.test(code)&&/materialized\s*=\s*['"]table/.test(text))add('info',no,'select *','A materialized table built on select * changes shape silently when upstream does.');
  }
  if(jj!==0)add('err',jl||L.length,'unbalanced {{ }}',Math.abs(jj)+' Jinja expression delimiter'+(Math.abs(jj)>1?'s':'')+' unmatched.');
  if(blk!==0)add('err',bl||L.length,'unbalanced {% %}',Math.abs(blk)+' Jinja block delimiter'+(Math.abs(blk)>1?'s':'')+' unmatched — an {% if %} without its {% endif %}?');
  if(par!==0)add('err',pl||L.length,'unbalanced parenthesis',Math.abs(par)+' parenthesis unmatched.');
  if(!/\{\{\s*config\s*\(/.test(text)&&!/\{%\s*(snapshot|macro)/.test(text))
    add('info',1,'no config block','The model falls back to the default materialization from dbt_project.yml.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintYamlFile(text){
  var L=text.split('\n'),out=[],seen={};
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1;
    if(/^\s*#/.test(ln)||!ln.trim())continue;
    if(/^\s*\t|\t/.test(ln))add('err',no,'tab character','YAML forbids tabs for indentation. The parser will refuse the file outright.');
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes — YAML will read them as part of the value.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line.');
    var ind=/^ */.exec(ln)[0].length;
    if(ind%2)add('warn',no,'odd indentation',ind+' spaces. dbt projects conventionally indent by two — mixed widths are the usual cause of a silently ignored block.');
    var m=/^(\s*)([\w.\-]+):\s*(.*)$/.exec(ln);
    if(m&&+m[1].length===0){if(seen[m[2]])add('err',no,'duplicate key','"'+m[2]+'" is declared twice at the top level — the second one silently wins.');seen[m[2]]=1}
    if(/:\s*$/.test(ln)&&/^\s*-\s*$/.test(L[i+1]||''))add('warn',no,'empty list item','The item below has no key.');
    if(/^\s*-\s+\w+:.*:\s*\S/.test(ln)&&!/["']/.test(ln))add('info',no,'unquoted colon','A value containing ": " needs quoting or YAML splits it into a mapping.');
  }
  if(!/^\s*version:\s*2/m.test(text)&&!/^\s*config-version:/m.test(text)&&!/^\s*profile:/m.test(text))
    add('warn',1,'no version: 2','Property files need version: 2 at the top or dbt ignores them without a word.');
  if(/^\s*sources:/m.test(text)&&!/^\s*tables:/m.test(text))
    add('warn',1,'source without tables','A source block with no tables: declares nothing dbt can reference.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintPy(text){
  var k=detectKind(text);
  if(k==='pymodel')return lintPython(text);
  if(k==='sqlmodel'||k==='snapshot'||k==='macro')return lintSql(text);
  return lintYamlFile(text);
}

function lintYaml(rows,t){
  var out=[];function add(s,i,w,tx){out.push({s:s,i:i,w:w,t:tx})}
  var seen={};
  rows.forEach(function(r,i){
    var l=r[0];
    if(/\?\?\?/.test(l))add('err',i,'unresolved field','The parser found nothing here. Fill it in before running.');
    if(/\$\{SECRET\./.test(l))add('info',i,'secret placeholder','Wire this to your secret store — a manifest never holds credentials.');
    if(/\{\{/.test(l))add('warn',i,'template left in place','dbt Jinja is not evaluated by Hydra. Use ${run.date} or ${env.X}.');
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