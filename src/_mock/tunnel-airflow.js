var $=function(i){return document.getElementById(i)};
(function(){var t=localStorage.getItem('hydra-theme');if(t)document.documentElement.setAttribute('data-theme',t);
$("themeBtn").onclick=function(){var d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);localStorage.setItem('hydra-theme',n)};
var b=$("burger"),dr=$("drawer");b.onclick=function(){var o=dr.classList.toggle('open');b.setAttribute('aria-expanded',o)};
document.addEventListener('click',function(e){if(dr.classList.contains('open')&&!dr.contains(e.target)&&!b.contains(e.target)){dr.classList.remove('open');b.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open')){dr.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}});})();
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

var EX=[
{n:'Daily orders → Parquet',f:'daily_orders.py',s:
'from airflow import DAG\n'+
'from airflow.operators.python import PythonOperator\n'+
'from airflow.providers.mysql.hooks.mysql import MySqlHook\n'+
'from datetime import datetime, timedelta\n'+
'import pandas as pd\n'+
'\n'+
'default_args = {"retries": 3, "retry_delay": timedelta(minutes=5)}\n'+
'\n'+
'def extract(**ctx):\n'+
'    conn = MySqlHook(mysql_conn_id="prod").get_conn()\n'+
'    df = pd.read_sql("SELECT * FROM orders", conn)\n'+
'    return df.to_json()\n'+
'\n'+
'def transform(**ctx):\n'+
'    df = pd.read_json(ctx["ti"].xcom_pull("extract"))\n'+
'    df = df[df.amount > 0]\n'+
'    df = df.groupby("region").amount.sum().reset_index()\n'+
'    return df.to_json()\n'+
'\n'+
'def load(**ctx):\n'+
'    df = pd.read_json(ctx["ti"].xcom_pull("transform"))\n'+
'    df.to_parquet("s3://warehouse/orders.parquet")\n'+
'\n'+
'with DAG("daily_orders", start_date=datetime(2026, 1, 1),\n'+
'         schedule="0 2 * * *", catchup=False,\n'+
'         default_args=default_args) as dag:\n'+
'    t1 = PythonOperator(task_id="extract", python_callable=extract)\n'+
'    t2 = PythonOperator(task_id="transform", python_callable=transform)\n'+
'    t3 = PythonOperator(task_id="load", python_callable=load)\n'+
'    t1 >> t2 >> t3\n'},
{n:'CSV → Postgres, cleaned',f:'load_signups.py',s:
'from airflow import DAG\n'+
'from airflow.operators.python import PythonOperator\n'+
'from airflow.providers.postgres.hooks.postgres import PostgresHook\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def run(**ctx):\n'+
'    df = pd.read_csv("/data/landing/signups.csv")\n'+
'    df = df.rename(columns={"e_mail": "email", "ts": "signed_up_at"})\n'+
'    df = df.fillna({"country": "unknown"})\n'+
'    df = df.drop_duplicates(subset=["email"])\n'+
'    df = df[df.email.notnull()]\n'+
'    engine = PostgresHook(postgres_conn_id="dwh").get_sqlalchemy_engine()\n'+
'    df.to_sql("signups", engine, if_exists="append", index=False)\n'+
'\n'+
'with DAG("load_signups", start_date=datetime(2025, 6, 1),\n'+
'         schedule="@hourly", catchup=True) as dag:\n'+
'    PythonOperator(task_id="run", python_callable=run)\n'},
{n:'REST API → Parquet',f:'sync_products.py',s:
'from airflow import DAG\n'+
'from airflow.decorators import task\n'+
'from datetime import datetime\n'+
'import pandas as pd, requests\n'+
'\n'+
'with DAG("sync_products", start_date=datetime(2026, 3, 1),\n'+
'         schedule="@daily", catchup=False) as dag:\n'+
'\n'+
'    @task\n'+
'    def pull():\n'+
'        r = requests.get("https://api.shop.io/v2/products", timeout=30)\n'+
'        df = pd.json_normalize(r.json()["items"])\n'+
'        df = df[["sku", "title", "price", "stock"]]\n'+
'        df = df.astype({"price": "float64", "stock": "int64"})\n'+
'        df = df[df.stock > 0]\n'+
'        df.to_parquet("/warehouse/products.parquet")\n'+
'\n'+
'    pull()\n'},
{n:'Dedupe + sort → CSV',f:'clean_customers.py',s:
'from airflow import DAG\n'+
'from airflow.operators.python import PythonOperator\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def clean(**ctx):\n'+
'    df = pd.read_parquet("/lake/raw/customers.parquet")\n'+
'    df = df.drop_duplicates(subset=["customer_id"])\n'+
'    df = df.sort_values("created_at", ascending=False)\n'+
'    df = df[["customer_id", "email", "country", "created_at"]]\n'+
'    df.to_csv("/exports/customers.csv", index=False)\n'+
'\n'+
'with DAG("clean_customers", start_date=datetime(2026, 1, 1),\n'+
'         schedule="0 6 * * 1", catchup=False) as dag:\n'+
'    PythonOperator(task_id="clean", python_callable=clean)\n'},
{n:'Bash step + Python step',f:'nightly_export.py',s:
'from airflow import DAG\n'+
'from airflow.operators.bash import BashOperator\n'+
'from airflow.operators.python import PythonOperator\n'+
'from airflow.operators.empty import EmptyOperator\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def summarise(**ctx):\n'+
'    df = pd.read_csv("/tmp/dump.csv")\n'+
'    df = df.groupby("status").id.count().reset_index()\n'+
'    df.to_parquet("/reports/status.parquet")\n'+
'\n'+
'with DAG("nightly_export", start_date=datetime(2026, 2, 1),\n'+
'         schedule="0 1 * * *", catchup=False) as dag:\n'+
'    start = EmptyOperator(task_id="start")\n'+
'    dump = BashOperator(task_id="dump", bash_command="pg_dump -t orders > /tmp/dump.csv")\n'+
'    agg = PythonOperator(task_id="summarise", python_callable=summarise)\n'+
'    notify = BashOperator(task_id="notify", bash_command="curl -X POST $SLACK_HOOK")\n'+
'    start >> dump >> agg >> notify\n'},
{n:'Waits on an S3 sensor',f:'wait_then_load.py',s:
'from airflow import DAG\n'+
'from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor\n'+
'from airflow.operators.python import PythonOperator\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def load(**ctx):\n'+
'    df = pd.read_csv("s3://drop/inbound/{{ ds }}.csv")\n'+
'    df = df[df.total >= 1]\n'+
'    df.to_parquet("/lake/inbound.parquet")\n'+
'\n'+
'with DAG("wait_then_load", start_date=datetime(2026, 4, 1),\n'+
'         schedule="@daily", catchup=False) as dag:\n'+
'    wait = S3KeySensor(task_id="wait", bucket_key="inbound/{{ ds }}.csv",\n'+
'                       bucket_name="drop", deferrable=True, poke_interval=300)\n'+
'    go = PythonOperator(task_id="load", python_callable=load)\n'+
'    wait >> go\n'},
{n:'In-house custom operator',f:'crm_sync.py',s:
'from airflow import DAG\n'+
'from acme.operators import SalesforceBulkOperator\n'+
'from airflow.operators.python import PythonOperator\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def shape(**ctx):\n'+
'    df = pd.read_json("/tmp/sf_dump.json")\n'+
'    df = df.rename(columns={"Id": "crm_id", "Email__c": "email"})\n'+
'    df = df[df.crm_id.notnull()]\n'+
'    df.to_parquet("/lake/crm/contacts.parquet")\n'+
'\n'+
'with DAG("crm_sync", start_date=datetime(2026, 1, 15),\n'+
'         schedule="0 */4 * * *", catchup=False) as dag:\n'+
'    pull = SalesforceBulkOperator(task_id="pull", soql="SELECT Id, Email__c FROM Contact",\n'+
'                                  out_path="/tmp/sf_dump.json")\n'+
'    shape_t = PythonOperator(task_id="shape", python_callable=shape)\n'+
'    pull >> shape_t\n'},
{n:'TaskFlow API style',f:'sales_rollup.py',s:
'from airflow.decorators import dag, task\n'+
'from datetime import datetime, timedelta\n'+
'import pandas as pd\n'+
'\n'+
'@dag(dag_id="sales_rollup", start_date=datetime(2026, 5, 1),\n'+
'     schedule=timedelta(days=1), catchup=False,\n'+
'     default_args={"retries": 2, "retry_delay": timedelta(minutes=10)})\n'+
'def pipeline():\n'+
'\n'+
'    @task\n'+
'    def extract():\n'+
'        return pd.read_parquet("/lake/sales.parquet")\n'+
'\n'+
'    @task\n'+
'    def rollup(df):\n'+
'        df = df[df.channel != "test"]\n'+
'        df = df.groupby(["region", "channel"]).agg({"net": "sum"}).reset_index()\n'+
'        df.to_parquet("/marts/sales_rollup.parquet")\n'+
'\n'+
'    rollup(extract())\n'+
'\n'+
'pipeline()\n'},
{n:'Joins two sources',f:'enrich_orders.py',s:
'from airflow import DAG\n'+
'from airflow.operators.python import PythonOperator\n'+
'from airflow.providers.postgres.hooks.postgres import PostgresHook\n'+
'from datetime import datetime\n'+
'import pandas as pd\n'+
'\n'+
'def enrich(**ctx):\n'+
'    pg = PostgresHook(postgres_conn_id="dwh").get_conn()\n'+
'    orders = pd.read_sql("SELECT * FROM orders", pg)\n'+
'    users = pd.read_csv("/ref/users.csv")\n'+
'    df = orders.merge(users, on="user_id", how="left")\n'+
'    df = df[df.status == "paid"]\n'+
'    df.to_parquet("/marts/orders_enriched.parquet")\n'+
'\n'+
'with DAG("enrich_orders", start_date=datetime(2026, 2, 10),\n'+
'         schedule="30 3 * * *", catchup=False) as dag:\n'+
'    PythonOperator(task_id="enrich", python_callable=enrich)\n'},
{n:'Pure SQL operator',f:'refresh_mart.py',s:
'from airflow import DAG\n'+
'from airflow.providers.common.sql.operators.sql import SQLExecuteQueryOperator\n'+
'from datetime import datetime\n'+
'\n'+
'with DAG("refresh_mart", start_date=datetime(2026, 1, 1),\n'+
'         schedule="0 5 * * *", catchup=False) as dag:\n'+
'    SQLExecuteQueryOperator(\n'+
'        task_id="refresh",\n'+
'        conn_id="dwh",\n'+
'        sql="INSERT INTO mart.daily SELECT day, sum(net) FROM sales GROUP BY day",\n'+
'    )\n'}];
/* ================= TRANSLATOR ================= */
var PRESET={'@daily':'0 0 * * *','@hourly':'0 * * * *','@weekly':'0 0 * * 0','@monthly':'0 0 1 * *','@yearly':'0 0 1 1 *','@once':null,'None':null,'@continuous':null};
var KNOWN=/^(Python|Bash|Empty|Dummy|SQLExecuteQuery|Postgres|MySql|Trigger|Branch|Short|Docker|Kubernetes|Email|S3ToRedshift|GCSToBigQuery)Operator$/;
function delta(s){var d=/days\s*=\s*(\d+)/.exec(s),h=/hours\s*=\s*(\d+)/.exec(s),m=/minutes\s*=\s*(\d+)/.exec(s);
  if(d)return +d[1]===1?'0 0 * * *':'0 0 */'+d[1]+' * *';if(h)return '0 */'+h[1]+' * * *';if(m)return '*/'+m[1]+' * * * *';return null}
function q(s){return '"'+String(s).replace(/"/g,'\\"')+'"'}
function cols(s){return s.split(',').map(function(x){return x.replace(/["'\s]/g,'')}).filter(Boolean)}

function translate(text){
  var L=text.split('\n'),N=[],tf=[],srcs=[],dsts=[],acts=[],name=null,cron=null,manual=false,retries=null,backoff=null,startD=null,catchup=false;
  function note(k,l,w,t){N.push({k:k,l:l,w:w,t:t})}
  function first(re){for(var i=0;i<L.length;i++){var m=re.exec(L[i]);if(m)return{m:m,l:i+1}}return null}
  var hookPg=/PostgresHook|postgres_conn_id|psycopg2/.test(text),hookMy=/MySqlHook|mysql_conn_id/.test(text);
  var connId=(/(?:postgres|mysql)_conn_id\s*=\s*["']([\w.\-]+)["']/.exec(text)||/conn_id\s*=\s*["']([\w.\-]+)["']/.exec(text)||[])[1];

  var r=first(/DAG\(\s*["']([\w.\-]+)["']/)||first(/dag_id\s*=\s*["']([\w.\-]+)["']/);
  var lName=null,lCron=null,lRetry=null;
  if(r){name=r.m[1];lName=r.l;note('map',r.l,'dag_id','name: '+name)}

  r=first(/schedule(?:_interval)?\s*=\s*["']([^"']+)["']/);
  if(r){var v=r.m[1];cron=(v in PRESET)?PRESET[v]:v;manual=cron===null;lCron=r.l;
    note('map',r.l,'schedule='+v,manual?'no cron — trigger.type: manual':'trigger.cron: '+q(cron));}
  else{r=first(/schedule(?:_interval)?\s*=\s*timedelta\(([^)]*)\)/);
    if(r){cron=delta(r.m[1]);lCron=r.l;note('map',r.l,'schedule=timedelta','trigger.cron: '+q(cron))}}

  r=first(/start_date\s*=\s*datetime\(\s*(\d{4})\s*,\s*(\d+)\s*,\s*(\d+)/);
  if(r)startD=r.m[1]+'-'+('0'+r.m[2]).slice(-2)+'-'+('0'+r.m[3]).slice(-2);
  var rc=first(/catchup\s*=\s*(True|False)/);
  if(rc){catchup=rc.m[1]==='True';
    if(catchup)note('care',rc.l,'catchup=True','Hydra never replays on its own. Reprocess once, on purpose: hdrctl run --from '+(startD||'<start_date>')+' --to today');
    else note('drop',rc.l,'catchup=False','Already the only behaviour — nothing to write.');}
  if(r&&!catchup)note('drop',r.l,'start_date','Schedules only run forward; no anchor needed.');

  r=first(/["']?retries["']?\s*[:=]\s*(\d+)/);
  if(r){retries=+r.m[1];lRetry=r.l;var rd=first(/retry_delay\s*[:=]\s*timedelta\(([^)]*)\)/);
    if(rd){var mm=/minutes\s*=\s*(\d+)/.exec(rd.m[1]),hh=/hours\s*=\s*(\d+)/.exec(rd.m[1]);backoff=mm?mm[1]+'m':(hh?hh[1]+'h':null)}
    note('map',r.l,'default_args.retries','retry.attempts: '+retries+(backoff?', backoff: '+backoff:''));}

  var imps=[],xc=[];
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1;
    if(/^\s*(from|import)\s+/.test(ln)){imps.push(no);continue}
    if(/xcom_push|xcom_pull|ti\.xcom|^\s*return\s+\w+\.to_json\(\s*\)\s*$/.test(ln)){xc.push(no);continue}
    var m;
    if(m=/(\w*Sensor)\(/.exec(ln)){note('care',no,m[1],'No sensor in v1. Keep this DAG in Airflow and let it call hdrctl run when the file lands.');continue}
    if(m=/(\w+Operator)\(/.exec(ln)){
      if(/^(Empty|Dummy)Operator$/.test(m[1])){note('drop',no,m[1],'Structural only — no counterpart needed.');continue}
      if(m[1]==='BashOperator'){var bc=/bash_command\s*=\s*["']([^"']+)["']/.exec(ln),tid=/task_id\s*=\s*["']([\w.\-]+)["']/.exec(ln);
        acts.push({id:tid?tid[1]:'step'+acts.length,cmd:bc?bc[1]:'…',l:no});
        note('map',no,'BashOperator','Shell work is a workflow action, not a job step.');continue}
      if(m[1]==='PythonOperator'){note('drop',no,'PythonOperator','Wiring only — the body below is what moves.');continue}
      if(/^(Branch\w*|ShortCircuit)Operator$/.test(m[1])){note('care',no,m[1],'Routing is a workflow step (type: condition) — a job cannot branch.');continue}
      if(m[1]==='TriggerDagRunOperator'){note('care',no,m[1],'Calls another DAG → a workflow step of type: job.');continue}
      if(/^(SQLExecuteQuery|Postgres|MySql)Operator$/.test(m[1])){continue}
      if(!KNOWN.test(m[1])){note('care',no,m[1],'Custom operator → Hydra plugin. Budget a day, not an hour.');continue}
    }
    if(/^\s*\w+(\s*>>\s*\w+)+/.test(ln)){note('drop',no,'task dependencies','Inside a job, order is list order.');continue}
    /* ---- sources ---- */
    if(m=/pd\.read_sql\(\s*f?["']([^"']+)["']/.exec(ln)){srcs.push({t:hookPg?'postgres':(hookMy?'mysql':'sql'),q:m[1],l:no});
      note('map',no,'read_sql','source.type: '+(hookPg?'postgres':(hookMy?'mysql':'sql'))+(connId?', conn: '+connId:''));continue}
    if(m=/pd\.read_csv\(\s*["']([^"']+)["']/.exec(ln)){srcs.push({t:'csv',p:m[1],l:no});note('map',no,'read_csv','source.type: csv');continue}
    if(m=/pd\.read_parquet\(\s*["']([^"']+)["']/.exec(ln)){srcs.push({t:'parquet',p:m[1],l:no});note('map',no,'read_parquet','source.type: parquet');continue}
    if(m=/pd\.read_json\(\s*["']([^"']+)["']/.exec(ln)){srcs.push({t:'json',p:m[1],l:no});note('map',no,'read_json','source.type: json');continue}
    if(m=/requests\.(?:get|post)\(\s*["']([^"']+)["']/.exec(ln)){srcs.push({t:'webapi',p:m[1],l:no});note('map',no,'requests.get','source.type: webapi');continue}
    if(m=/\bsql\s*=\s*["']([^"']+)["']/.exec(ln)){srcs.push({t:'sql',q:m[1],l:no,pure:1});note('map',no,'sql=','source.query + destination from the statement');continue}
    if(/pd\.json_normalize\(/.test(ln)){tf.push({op:'flatten',p:'{}',l:no});note('map',no,'json_normalize','op: flatten');continue}
    /* ---- destinations ---- */
    if(m=/\.to_parquet\(\s*["']([^"']+)["']/.exec(ln)){dsts.push({t:'parquet',p:m[1],l:no});note('map',no,'to_parquet','destination.type: parquet');continue}
    if(m=/\.to_csv\(\s*["']([^"']+)["']/.exec(ln)){dsts.push({t:'csv',p:m[1],l:no});note('map',no,'to_csv','destination.type: csv');continue}
    if(m=/\.to_sql\(\s*["']([^"']+)["']/.exec(ln)){var md=/if_exists\s*=\s*["'](\w+)["']/.exec(ln);
      dsts.push({t:hookPg?'postgres':(hookMy?'mysql':'sql'),tb:m[1],mode:md?(md[1]==='append'?'append':'replace'):'append',l:no});
      note('map',no,'to_sql','destination.type: '+(hookPg?'postgres':'sql')+', mode: '+(md?md[1]:'append'));continue}
    if(m=/\.to_json\(\s*["']([^"']+)["']/.exec(ln)){dsts.push({t:'json',p:m[1],l:no});note('map',no,'to_json','destination.type: json');continue}
    /* ---- transformations ---- */
    if(m=/=\s*\w+\[\[([^\]]+)\]\]/.exec(ln)){tf.push({op:'select',p:'{columns: ['+cols(m[1]).join(', ')+']}',l:no});note('map',no,'column subset','op: select');continue}
    if(m=/\.rename\(\s*columns\s*=\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'rename',p:'{map: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'rename','op: rename');continue}
    if(m=/\.astype\(\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'cast',p:'{types: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'astype','op: cast');continue}
    if(m=/\.fillna\(\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'fill_null',p:'{values: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'fillna','op: fill_null');continue}
    if(/\.fillna\(/.test(ln)){tf.push({op:'fill_null',p:'{}',l:no});note('map',no,'fillna','op: fill_null');continue}
    if(m=/\.drop_duplicates\(\s*(?:subset\s*=\s*\[([^\]]*)\])?/.exec(ln)){tf.push({op:'deduplicate',p:m[1]?'{keys: ['+cols(m[1]).join(', ')+']}':'{}',l:no});note('map',no,'drop_duplicates','op: deduplicate');continue}
    if(m=/\.sort_values\(\s*(?:by\s*=\s*)?["'](\w+)["']([^)]*)\)/.exec(ln)){var asc=!/ascending\s*=\s*False/.test(m[2]);
      tf.push({op:'sort',p:'{by: ['+m[1]+'], order: '+(asc?'asc':'desc')+'}',l:no});note('map',no,'sort_values','op: sort');continue}
    if(m=/\.groupby\(\s*(\[[^\]]*\]|["']\w+["'])\s*\)/.exec(ln)){
      var keys=cols(m[1].replace(/[\[\]]/g,'')),ag=/\.agg\(\s*\{([^}]*)\}/.exec(ln),p;
      if(ag){p='{by: ['+keys.join(', ')+'], agg: {'+ag[1].replace(/["']/g,'').trim()+'}}'}
      else{var cf=/\.(\w+)\.(sum|mean|count|min|max)\(/.exec(ln)||/\]\.(sum|mean|count|min|max)\(/.exec(ln);
        p=cf?(cf.length>2?'{by: ['+keys.join(', ')+'], agg: {'+cf[1]+': '+cf[2]+'}}':'{by: ['+keys.join(', ')+'], agg: {'+cf[1]+'}}'):'{by: ['+keys.join(', ')+']}'}
      tf.push({op:'aggregate',p:p,l:no});note('map',no,'groupby','op: aggregate');continue}
    if(/\.merge\(|pd\.merge\(/.test(ln)){note('care',no,'merge','Two inputs = two jobs plus a workflow join. Split before you translate.');continue}
    if(/\.apply\(|lambda\s/.test(ln)){note('care',no,'apply / lambda','Arbitrary Python has no declarative form — this becomes a plugin.');continue}
    if(m=/\w+\[\s*\w+\.(\w+)\.notnull\(\)\s*\]/.exec(ln)){tf.push({op:'filter',p:'{expr: '+q(m[1]+' is not null')+'}',l:no});note('map',no,'notnull filter','op: filter');continue}
    if(m=/\[\s*\w+[.\[]["']?(\w+)["']?\]?\s*(==|!=|>=|<=|>|<)\s*([^\]]+?)\s*\]/.exec(ln)){
      tf.push({op:'filter',p:'{expr: '+q(m[1]+' '+m[2]+' '+m[3].trim())+'}',l:no});note('map',no,'boolean mask','op: filter');continue}
    if(m=/\.query\(\s*(["'])((?:(?!\1)[\s\S])*)\1/.exec(ln)){tf.push({op:'filter',p:'{expr: '+q(m[2].replace(/'/g,'"'))+'}',l:no});note('map',no,'query()','op: filter');continue}
    var um=/\b\w*df\w*\s*\.\s*(\w+)\s*\(/.exec(ln);
    if(um&&['reset_index','copy','head','tail','info','describe','to_dict','set_index','shape'].indexOf(um[1])<0)
      note('care',no,'.'+um[1]+'() not translated','No built-in op matches this call, so this line produced nothing. Either it becomes a plugin, or the manifest is quietly missing a step.');
  }
  if(imps.length)note('drop',imps[0],imps.length+' import'+(imps.length>1?'s':''),'A manifest is data — there is nothing to import.');
  if(xc.length)note('drop',xc[0],xc.length+' XCom line'+(xc.length>1?'s':''),'Steps hand the frame over in process. No serialize, no size limit.');
  if(srcs.length>1)note('care',srcs[1].l,'second source','A job reads one source. Split into 2 jobs joined by a workflow.');
  if(dsts.length>1)note('care',dsts[1].l,'second destination','A job writes one destination. The extra one becomes its own job.');
  if(!srcs.length)note('care',1,'no source found','Nothing readable was detected — fill source: by hand.');
  if(!dsts.length&&!(srcs[0]&&srcs[0].pure))note('care',1,'no destination found','Nothing writable was detected — fill destination: by hand.');
  return {name:name||'untitled',cron:cron,manual:manual,tf:tf,src:srcs[0]||null,dst:dsts[0]||null,acts:acts,
          retries:retries,backoff:backoff,notes:N,lName:lName,lCron:lCron,lRetry:lRetry,srcs:srcs,dsts:dsts,
          grp:{imp:imps,xcom:xc}};
}
/* ---------- YAML (avec provenance ligne source) ---------- */
function buildYaml(t){
  var job=[],o=[],wf=t.acts.length>0;
  function J(s,l){job.push([s,l==null?null:l])}
  function O(s,l){o.push([s,l==null?null:l])}
  J('name: '+t.name,t.lName);J('');
  J('trigger:',t.lCron);
  if(t.manual||!t.cron)J('  type: manual',t.lCron);else{J('  type: schedule',t.lCron);J('  cron: '+q(t.cron),t.lCron)}
  J('');
  var s=t.src,dstFromSql=null;
  J('source:',s?s.l:null);
  if(!s){J('  type: ???        # nothing detected — fill this in',null)}
  else if(s.t==='sql'||s.t==='mysql'||s.t==='postgres'){
    var query=s.q,ins=/INSERT\s+INTO\s+([\w.]+)\s+(SELECT[\s\S]+)/i.exec(s.q||'');
    if(ins){dstFromSql=ins[1];query=ins[2]}
    J('  type: '+(s.t==='sql'?'sql':s.t),s.l);
    J('  conn: '+(/conn/.test(String(s.conn))?s.conn:'${SECRET.DWH}'),s.l);
    J('  query: '+q(query),s.l);
  } else if(s.t==='webapi'){J('  type: webapi',s.l);J('  url: '+q(s.p),s.l);J('  method: GET',s.l)}
  else{J('  type: '+s.t,s.l);J('  path: '+q(s.p),s.l)}
  J('');
  J('transformations:',null);
  if(!t.tf.length)J('  []               # pass-through',null);
  else t.tf.forEach(function(x){J('  - op: '+x.op,x.l);if(x.p&&x.p!=='{}')J('    params: '+x.p,x.l)});
  J('');
  J('destination:',t.dst?t.dst.l:null);
  var d=t.dst;
  if(dstFromSql&&!d){J('  type: postgres',s?s.l:null);J('  table: '+dstFromSql,s?s.l:null);J('  mode: append',null)}
  else if(!d){J('  type: ???        # nothing detected — fill this in',null)}
  else if(d.tb){J('  type: '+d.t,d.l);J('  table: '+q(d.tb),d.l);J('  mode: '+d.mode,d.l)}
  else{J('  type: '+d.t,d.l);J('  path: '+q(d.p),d.l);J('  mode: replace',d.l)}
  if(t.retries!=null){J('');J('retry:',t.lRetry);J('  attempts: '+t.retries,t.lRetry);if(t.backoff)J('  backoff: '+t.backoff,t.lRetry)}
  if(!wf)return job;
  O('# ─────────  jobs/'+t.name+'.yaml  ─────────',null);O('',null);
  o=o.concat(job);
  O('',null);O('# ─────────  workflows/'+t.name+'.yaml  ─────────',null);O('',null);
  O('version: "1.0"',null);O('workflow:',null);O('  name: '+t.name,t.lName);O('  trigger:',t.lCron);
  if(t.manual||!t.cron)O('    type: manual',t.lCron);else{O('    type: schedule',t.lCron);O('    cron: '+q(t.cron),t.lCron)}
  O('  steps:',null);
  var prev=null;
  t.acts.forEach(function(a,i){
    O('    - name: '+a.id,a.l);O('      type: action',a.l);O('      action: shell',a.l);O('      params:',a.l);O('        command: '+q(a.cmd),a.l);
    if(prev)O('      depends_on: ['+q(prev)+']',a.l);
    prev=a.id;
    if(i===0){O('    - name: '+t.name,null);O('      type: job',null);O('      job: "./jobs/'+t.name+'.yaml"',null);O('      depends_on: ['+q(a.id)+']',null);prev=t.name}
  });
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
  if(!text.trim()){$("yml").innerHTML='<span class="yc"># paste an Airflow DAG on the left —\n# or pick a sample above.</span>';$("yml").dataset.raw='';
    $("fnB").textContent='job.yaml';$("cMap").textContent='0';$("cDrop").textContent='0';$("cCare").textContent='0';
    $("gut").innerHTML='<i>1</i>';$("rl").innerHTML='<li class="empty">Waiting for a DAG.</li>';CUR=null;ROWS=[];return}
  var t=translate(SEL!=null?SEL.text:effective(text));CUR=t;
  ROWS=buildYaml(t);
  var y=ROWS.map(function(r){return r[0]}).join('\n');
  $("yml").innerHTML=colorYaml(ROWS);
  $("yml").dataset.raw=y;
  $("fnB").textContent=(SEL!=null?'selection · ':'')+(t.acts.length?'workflows/':'jobs/')+t.name+'.yaml';
  $("fnA").textContent=(t.name==='untitled'?'dag':t.name)+'.py'+(ignCount()?'  ('+ignCount()+' ignored)':'');
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
$("src").addEventListener('input',function(){$("ex").selectedIndex=-1;$("exTag").textContent='your DAG';clearTimeout(deb);deb=setTimeout(run,120)});
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
function load(i){var e=EX[i];$("src").value=e.s;$("fnA").textContent=e.f;$("ex").value=i;$("exTag").textContent=e.f;run();$("src").scrollTop=0;$("gut").scrollTop=0}
$("ex").onchange=function(){load(+$("ex").value)};
$("rand").onclick=function(){var i;do{i=Math.floor(Math.random()*EX.length)}while(EX.length>1&&i===+$("ex").value);load(i)};
$("blank").onclick=function(){$("src").value='';$("fnA").textContent='dag.py';$("exTag").textContent='';run();$("src").focus()};
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
    return 'conn = '+(s.t==='postgres'?'PostgresHook(postgres_conn_id="dwh")':'MySqlHook(mysql_conn_id="prod")')+'.get_conn()\ndf = pd.read_sql('+JSON.stringify(s.q||'')+', conn)'}
  if(block==='transformations')return t.tf.length?t.tf.map(toPandas).join('\n'):'# pass-through';
  if(block==='destination'){var d=t.dst;if(!d)return '# no destination detected';
    if(d.tb)return 'engine = PostgresHook(postgres_conn_id="dwh").get_sqlalchemy_engine()\ndf.to_sql('+JSON.stringify(d.tb)+', engine, if_exists='+JSON.stringify(d.mode)+', index=False)';
    if(d.t==='parquet')return 'df.to_parquet('+JSON.stringify(d.p)+')';
    if(d.t==='csv')return 'df.to_csv('+JSON.stringify(d.p)+', index=False)';
    return 'df.to_json('+JSON.stringify(d.p)+')'}
  if(block==='trigger'||block==='name'){
    return 'with DAG('+JSON.stringify(t.name)+',\n         start_date=datetime(2026, 1, 1),\n         schedule='+(t.cron?JSON.stringify(t.cron):'None')+',\n         catchup=False) as dag:'}
  if(block==='retry')return 'default_args = {"retries": '+t.retries+(t.backoff?', "retry_delay": timedelta(minutes='+parseInt(t.backoff,10)+')':'')+'}';
  return '# '+block+' has no Airflow counterpart';
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
    {t:'Paste a DAG',k:'⌘V',f:function(){
      if(navigator.clipboard&&navigator.clipboard.readText)
        navigator.clipboard.readText().then(function(txt){if(!txt)return;IGN={};SEL=null;ta.value=txt;$("ex").selectedIndex=-1;$("exTag").textContent='your DAG';run();toast('Pasted')})
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
    {t:'Reveal the Airflow line',off:!src,f:function(){gotoLine(src);toast('Line '+src)}},
    '-',
    {t:'Back to Airflow (this block)',off:!b,f:function(){
      pop('reverse',b.name+': → Python','<p>The same block, expressed back as Airflow. Nothing here is a one-way door.</p><pre>'+esc(reverse(b.name))+'</pre>',e.clientX,e.clientY)}},
    {t:'Preview on sample data',f:function(){preview(e.clientX,e.clientY)}},
    '-',
    {t:'Copy the whole manifest',f:function(){cpy($("yml").dataset.raw||'');toast('Manifest copied')}},
    {t:'Download',f:function(){$("dl").click()}}
  ]};
});

/* ================= BARRES D'ICONES ================= */
function loadText(txt,label){IGN={};MUTE={};SEL=null;$("src").value=txt;
  $("ex").selectedIndex=-1;$("exTag").textContent=label||'your DAG';run();
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
  pop('reverse',CUR.name+' → Airflow','<p>The whole manifest, back as a DAG. Round-tripping is not a one-way door.</p><pre>'+esc(out.join('\n'))+'</pre>',r.left-340,r.bottom+8)};
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
function lintPy(text){
  var L=text.split('\n'),out=[];
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']');
  var NBSP=new RegExp(String.fromCharCode(160));
  /* --- 1. tokenizer : chaines, triples quotes, commentaires --- */
  var st=null,depth=0,dl=0,bs=false,info=[];
  for(var i=0;i<L.length;i++){
    var raw=L[i],no=i+1,code='',cont=(depth>0)||st!==null||bs,j=0;
    while(j<raw.length){
      var ch=raw.charAt(j),two=raw.substr(j,3);
      if(st){
        if(st.length===3){if(two===st){st=null;j+=3;continue}}
        else{if(ch==='\\'){j+=2;continue}if(ch===st){st=null;j++;continue}}
        code+=' ';j++;continue;
      }
      if(ch==='#')break;
      if(two==='"""'||two==="'''"){st=two;code+='  ';j+=3;continue}
      if(ch==='"'||ch==="'"){st=ch;code+=' ';j++;continue}
      if('([{'.indexOf(ch)>=0){depth++;dl=no}
      else if(')]}'.indexOf(ch)>=0){depth--;if(depth<0){add('err',no,'unbalanced bracket','A closing bracket has no opener.');depth=0}}
      code+=ch;j++;
    }
    if(st&&st.length===1)st=null;
    bs=/\\$/.test(raw.replace(/\s+$/,''));
    info.push({no:no,code:code,raw:raw,cont:cont,ind:/^[ \t]*/.exec(raw)[0].length,blank:!raw.trim()});
  }
  if(st)add('err',L.length,'unterminated string','A triple-quoted string is never closed.');
  if(depth>0)add('err',dl,'unclosed bracket',depth+' bracket'+(depth>1?'s':'')+' opened and never closed — the paste is probably truncated.');
  /* --- 2. lignes logiques : une instruction peut occuper plusieurs lignes --- */
  var lg=[],cur=null;
  info.forEach(function(x){
    if(x.blank)return;
    if(x.cont&&cur){cur.code+=' '+x.code.replace(/^[ \t]+/,'');return}
    cur={no:x.no,code:x.code,ind:x.ind};lg.push(cur);
  });
  /* --- 3. structure --- */
  var KW=/^(def|class|if|elif|else|for|while|with|try|except|finally|match|case|async|lambda)\b/;
  var prev=null;
  lg.forEach(function(x){
    var c=x.code.replace(/\s+$/,''),head=c.replace(/^[ \t]*/,'');
    if(/:$/.test(c)&&!KW.test(head)&&!/^@/.test(head))
      add('err',x.no,'statement ends with ":"','Python cannot parse this — a colon only closes a block header. A def, if, for or with is missing.');
    if(prev&&x.ind>prev.ind&&!/:$/.test(prev.code.replace(/\s+$/,'')))
      add('err',x.no,'unexpected indent','This line is indented, but line '+prev.no+' opens no block.');
    prev=x;
  });
  /* --- 4. copier-coller et pieges de version --- */
  info.forEach(function(x){
    var ln=x.raw,no=x.no;
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes from a word processor — Python will not parse this line.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line — the classic copy-paste from a web page.');
    if(/^\t+/.test(ln))add('warn',no,'tab indent','Tabs mixed into Python indentation. Convert to spaces before running.');
    if(/airflow\.operators\.\w+_operator|airflow\.contrib\./.test(x.code))add('warn',no,'Airflow 1.x import','This module path was removed in Airflow 2. The DAG will not import on a modern install.');
    if(/provide_context/.test(ln))add('warn',no,'provide_context','Removed in Airflow 2 — the context is always passed now.');
    if(/schedule_interval\s*=/.test(x.code))add('info',no,'schedule_interval','Renamed to schedule in 2.4. Still read, but deprecated.');
    if(/days_ago\s*\(/.test(x.code))add('err',no,'days_ago()','Removed in Airflow 3, and it makes start_date move on every parse. Pin a fixed datetime.');
    if(/start_date\s*=\s*(datetime|pendulum)\.now\(/.test(x.code))add('err',no,'moving start_date','Re-evaluated on every parse — the DAG may never trigger.');
    if(!x.cont&&x.ind===0&&!/^\s*(from|import)\s/.test(x.code)&&/(Variable\.get|\.get_records|read_sql|read_csv|requests\.(get|post))\s*\(/.test(x.code))
      add('warn',no,'top-level I/O','This runs on every parse — every 30 s by default, not once per run.');
  });
  if(!/with\s+DAG\s*\(|@dag\b|DAG\s*\(/.test(text)){
    out=out.filter(function(x){return x.w!=='top-level I/O'});
    add('info',1,'no DAG object','Parsed as a plain pandas script — the trigger falls back to manual.');}
  else if(!/catchup\s*=/.test(text))add('info',1,'catchup not set','Airflow 2 defaults it to True, Airflow 3 to False. This DAG behaves differently depending on your version.');
  out.sort(function(a,b){return a.l-b.l});
  return out;
}
function lintYaml(rows,t){
  var out=[];function add(s,i,w,tx){out.push({s:s,i:i,w:w,t:tx})}
  var seen={};
  rows.forEach(function(r,i){
    var l=r[0];
    if(/\?\?\?/.test(l))add('err',i,'unresolved field','The parser found nothing here. Fill it in before running.');
    if(/\$\{SECRET\./.test(l))add('info',i,'secret placeholder','Wire this to your secret store — a manifest never holds credentials.');
    if(/\{\{/.test(l))add('warn',i,'Jinja template','Airflow macros are not evaluated by Hydra. Use ${run.date} instead of {{ ds }}.');
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
  pop(sev(it)==='ok'?'clean':sev(it),'DAG check',lintHTML(it,'py'),r.left-40,r.bottom+8)};
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
  paint($("icLint"),$("src").value.trim()?lintPy($("src").value):[],'Check the DAG');
  paint($("icVal"),ROWS.length?lintYaml(ROWS,CUR):[],'Validate the manifest')};
run();