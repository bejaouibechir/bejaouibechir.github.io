var $=function(i){return document.getElementById(i)};
(function(){var t=localStorage.getItem('hydra-theme');if(t)document.documentElement.setAttribute('data-theme',t);
$("themeBtn").onclick=function(){var d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);localStorage.setItem('hydra-theme',n)};
var b=$("burger"),dr=$("drawer");b.onclick=function(){var o=dr.classList.toggle('open');b.setAttribute('aria-expanded',o)};
document.addEventListener('click',function(e){if(dr.classList.contains('open')&&!dr.contains(e.target)&&!b.contains(e.target)){dr.classList.remove('open');b.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open')){dr.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}});})();
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

var EX=[
{n:'Notebook — Delta → Delta',f:'orders_daily.py',s:
'# Databricks notebook source\n'+
'from pyspark.sql import functions as F\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'df = spark.read.table("analytics.raw.orders")\n'+
'df = df.filter(F.col("amount") > 0)\n'+
'df = df.groupBy("region").agg(F.sum("amount").alias("net"))\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'(df.write.format("delta")\n'+
'   .mode("overwrite")\n'+
'   .saveAsTable("analytics.marts.orders_daily"))\n'+
'\n'+
'display(df)\n'},
{n:'Widgets + secrets',f:'load_signups.py',s:
'# Databricks notebook source\n'+
'from pyspark.sql import functions as F\n'+
'\n'+
'run_date = dbutils.widgets.get("run_date")\n'+
'token = dbutils.secrets.get(scope="prod", key="dwh_token")\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'df = spark.read.format("csv").option("header", True).load("/Volumes/raw/landing/signups.csv")\n'+
'df = df.withColumnRenamed("e_mail", "email").withColumnRenamed("ts", "signed_up_at")\n'+
'df = df.na.fill({"country": "unknown"})\n'+
'df = df.dropDuplicates(["email"])\n'+
'df = df.filter(F.col("email").isNotNull())\n'+
'\n'+
'df.write.format("delta").mode("append").saveAsTable("analytics.core.signups")\n'},
{n:'Autoloader — streaming ingest',f:'stream_events.py',s:
'# Databricks notebook source\n'+
'\n'+
'stream = (spark.readStream\n'+
'    .format("cloudFiles")\n'+
'    .option("cloudFiles.format", "json")\n'+
'    .option("cloudFiles.schemaLocation", "/Volumes/chk/events_schema")\n'+
'    .load("s3://drop/events/"))\n'+
'\n'+
'stream = stream.filter("kind != \'debug\'")\n'+
'\n'+
'(stream.writeStream\n'+
'    .option("checkpointLocation", "/Volumes/chk/events")\n'+
'    .trigger(availableNow=True)\n'+
'    .toTable("analytics.raw.events"))\n'},
{n:'Delta Live Tables',f:'dlt_pipeline.py',s:
'import dlt\n'+
'from pyspark.sql import functions as F\n'+
'\n'+
'@dlt.table(name="clean_orders", comment="Validated orders")\n'+
'@dlt.expect_or_drop("valid_amount", "amount > 0")\n'+
'@dlt.expect("has_region", "region IS NOT NULL")\n'+
'def clean_orders():\n'+
'    df = dlt.read("raw_orders")\n'+
'    df = df.dropDuplicates(["order_id"])\n'+
'    return df.select("order_id", "region", "amount")\n'},
{n:'Asset bundle (databricks.yml)',f:'databricks.yml',s:
'bundle:\n'+
'  name: acme_analytics\n'+
'\n'+
'resources:\n'+
'  jobs:\n'+
'    orders_daily:\n'+
'      name: orders_daily\n'+
'      schedule:\n'+
'        quartz_cron_expression: "0 0 2 * * ?"\n'+
'        timezone_id: "Europe/Paris"\n'+
'      tasks:\n'+
'        - task_key: transform\n'+
'          notebook_task:\n'+
'            notebook_path: ./orders_daily.py\n'+
'          new_cluster:\n'+
'            spark_version: "15.4.x-scala2.12"\n'+
'            node_type_id: i3.xlarge\n'+
'            num_workers: 4\n'},
{n:'MERGE INTO via spark.sql',f:'upsert_customers.py',s:
'# Databricks notebook source\n'+
'\n'+
'df = spark.read.table("analytics.raw.customers")\n'+
'df = df.dropDuplicates(["customer_id"])\n'+
'df.createOrReplaceTempView("staged")\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'spark.sql("""\n'+
'MERGE INTO analytics.core.customers t\n'+
'USING staged s ON t.customer_id = s.customer_id\n'+
'WHEN MATCHED THEN UPDATE SET *\n'+
'WHEN NOT MATCHED THEN INSERT *\n'+
'""")\n'},
{n:'Small job on a big cluster',f:'tiny_rollup.py',s:
'# Databricks notebook source\n'+
'from pyspark.sql import functions as F\n'+
'\n'+
'df = spark.read.table("analytics.raw.fx_rates")\n'+
'df = df.repartition(200)\n'+
'df.cache()\n'+
'df = df.filter(F.col("day") >= "2026-01-01")\n'+
'df = df.groupBy("currency").agg(F.avg("rate").alias("avg_rate"))\n'+
'pdf = df.toPandas()\n'+
'pdf.to_parquet("/Volumes/marts/fx_avg.parquet")\n'},
{n:'Delta maintenance',f:'maintenance.py',s:
'# Databricks notebook source\n'+
'\n'+
'spark.sql("OPTIMIZE analytics.core.orders ZORDER BY (customer_id)")\n'+
'spark.sql("VACUUM analytics.core.orders RETAIN 168 HOURS")\n'+
'\n'+
'df = spark.read.option("versionAsOf", 42).table("analytics.core.orders")\n'+
'df = df.select("order_id", "amount")\n'+
'df.write.format("parquet").mode("overwrite").save("/Volumes/exports/orders_v42")\n'},
{n:'Legacy notebook (mounts + %run)',f:'legacy_etl.py',s:
'# Databricks notebook source\n'+
'# MAGIC %run ./common/helpers\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'dbutils.fs.mount(source="s3a://legacy-bucket", mount_point="/mnt/legacy")\n'+
'\n'+
'df = sqlContext.sql("SELECT * FROM legacy_orders")\n'+
'df = df.dropDuplicates(["id"])\n'+
'rows = df.collect()\n'+
'df.write.mode("overwrite").parquet("/mnt/legacy/out")\n'},
{n:'SQL magic cell',f:'daily_sql.py',s:
'# Databricks notebook source\n'+
'# MAGIC %md\n'+
'# MAGIC ## Daily revenue rollup\n'+
'\n'+
'# COMMAND ----------\n'+
'\n'+
'# MAGIC %sql\n'+
'# MAGIC CREATE OR REPLACE TABLE analytics.marts.revenue_daily AS\n'+
'# MAGIC SELECT day, region, sum(net) AS net\n'+
'# MAGIC FROM analytics.core.orders\n'+
'# MAGIC WHERE status = \'paid\'\n'+
'# MAGIC GROUP BY day, region\n'}];

var PRESET={'@daily':'0 0 * * *','@hourly':'0 * * * *','@weekly':'0 0 * * 0','@monthly':'0 0 1 * *','@yearly':'0 0 1 1 *','@once':null,'None':null,'@continuous':null};
var KNOWN=/^(Python|Bash|Empty|Dummy|SQLExecuteQuery|Postgres|MySql|Trigger|Branch|Short|Docker|Kubernetes|Email|S3ToRedshift|GCSToBigQuery)Operator$/;
function delta(s){var d=/days\s*=\s*(\d+)/.exec(s),h=/hours\s*=\s*(\d+)/.exec(s),m=/minutes\s*=\s*(\d+)/.exec(s);
  if(d)return +d[1]===1?'0 0 * * *':'0 0 */'+d[1]+' * *';if(h)return '0 */'+h[1]+' * * *';if(m)return '*/'+m[1]+' * * * *';return null}
function q(s){return '"'+String(s).replace(/"/g,'\\"')+'"'}
function cols(s){return s.split(',').map(function(x){return x.replace(/["'\s]/g,'')}).filter(Boolean)}

function secretName(s){return '${SECRET.'+String(s).toUpperCase().replace(/[^A-Z0-9]+/g,'_')+'}'}
function quartz(s){
  var f=String(s).trim().split(/\s+/);
  if(f.length<6)return {cron:null,err:'Quartz expects 6 or 7 fields (seconds first) — this has '+f.length+'.'};
  var c=f.slice(1,6).map(function(x){return x==='?'?'*':x});
  return {cron:c.join(' '),sec:f[0]};
}
function translate(text){
  var L=text.split('\n'),N=[],tf=[],srcs=[],dsts=[],acts=[],name=null,cron=null,manual=true,
      retries=null,backoff=null,lName=null,lCron=null,lRetry=null,heavy=[],sqlCells=[];
  function note(k,l,w,t){N.push({k:k,l:l,w:w,t:t})}
  function first(re){for(var i=0;i<L.length;i++){var m=re.exec(L[i]);if(m)return{m:m,l:i+1}}return null}
  var isBundle=/^\s*bundle:/m.test(text)||/quartz_cron_expression/.test(text);
  var isDLT=/@dlt\.|import\s+dlt\b/.test(text);
  var isStream=/readStream|writeStream|cloudFiles/.test(text);

  /* ---------- asset bundle : le planificateur ---------- */
  if(isBundle){
    var r=first(/quartz_cron_expression:\s*["']([^"']+)["']/);
    if(r){var qz=quartz(r.m[1]);lCron=r.l;
      if(qz.cron){cron=qz.cron;manual=false;
        note('map',r.l,'quartz_cron_expression','trigger.cron: '+q(cron)+' — the leading seconds field is dropped, "?" becomes "*"');
        if(qz.sec&&qz.sec!=='0')note('care',r.l,'sub-minute seconds','Quartz fires at second '+qz.sec+'. Cron has no seconds field — that precision is lost.');}
      else note('care',r.l,'malformed quartz',qz.err);}
    var tz=first(/timezone_id:\s*["']([^"']+)["']/);
    if(tz)note('care',tz.l,'timezone_id','Cron in Hydra runs in the runner’s timezone. Set TZ on the node or the schedule drifts by an hour twice a year.');
    var nm=first(/^\s*name:\s*([\w.\-]+)/);if(nm){name=nm.m[1];lName=nm.l;note('map',nm.l,'job name','name: '+name)}
    var nb=first(/notebook_path:\s*\.?\/?([\w./\-]+)/);
    if(nb)note('map',nb.l,'notebook_task','The notebook becomes the job manifest — paste it to translate the logic.');
    var cl=first(/new_cluster:/);
    if(cl){var nw=(/num_workers:\s*(\d+)/.exec(text)||[])[1],nt=(/node_type_id:\s*([\w.]+)/.exec(text)||[])[1];
      note('care',cl.l,'cluster definition','A '+(nw||'?')+'-worker '+(nt||'')+' cluster spins up for this run. If the job moves to Hydra, that line and its bill disappear — check first that the data really needs it.');}
    var tasks=[];L.forEach(function(ln,i){var m=/task_key:\s*([\w.\-]+)/.exec(ln);if(m)tasks.push({k:m[1],l:i+1})});
    if(tasks.length>1)note('care',tasks[1].l,tasks.length+' tasks','A multi-task job is a workflow: one step per task, wired with depends_on.');
    note('drop',1,'bundle metadata','Targets, permissions, cluster policies — none of it has a Hydra equivalent.');
    return {name:name||'databricks_job',cron:cron,manual:manual,tf:[],src:null,dst:null,acts:[],retries:null,backoff:null,cache:null,
            notes:N,lName:lName,lCron:lCron,lRetry:null,lCache:null,srcs:[],dsts:[],grp:{imp:[],xcom:[]},bundle:1};
  }

  var imps=[],cells=[],mags=[],disp=[],gDlt=[],gStr=[],gMrg=[],gMnt=[],gMnt2=[];
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1,m;
    if(/^#\s*Databricks notebook source|^#\s*COMMAND\s*-+/.test(ln)){cells.push(no);continue}
    if(/^#\s*MAGIC\s+%md/.test(ln)||/^#\s*MAGIC\s*$/.test(ln)){mags.push(no);continue}
    if(/^#\s*MAGIC\s+%sql/.test(ln)){sqlCells.push(no);continue}
    if(/^#\s*MAGIC\s+/.test(ln)){if(sqlCells.length){sqlCells.push(no);continue}mags.push(no);continue}
    if(/^\s*(from|import)\s+/.test(ln)){imps.push(no);continue}
    if(/^\s*display\(|^\s*%pip\s|^\s*spark\.conf\.set/.test(ln)){disp.push(no);continue}

    /* ---- ce qui reste chez Databricks ---- */
    if(/@dlt\.|dlt\.read\(|dlt\.expect/.test(ln)){gDlt.push(no);continue}
    if(/readStream|writeStream|cloudFiles|checkpointLocation|trigger\(availableNow/.test(ln)){gStr.push(no);continue}
    if(/MERGE\s+INTO|WHEN\s+MATCHED/i.test(ln)){gMrg.push(no);continue}
    if(/OPTIMIZE\s|VACUUM\s|ZORDER|versionAsOf|RESTORE\s+TABLE/i.test(ln)){gMnt.push(no);
      if(!/\.(table|load|save|saveAsTable|parquet|csv|json)\(/.test(ln))continue}
    if(/\.repartition\(|broadcast\(|\.cache\(\)|\.persist\(|coalesce\(\d/.test(ln)){heavy.push(no);continue}
    if(/createOrReplaceTempView|createGlobalTempView/.test(ln)){note('care',no,'temp view','A view exists only inside a Spark session. In Hydra the intermediate frame is simply the next step.');continue}
    if(/dbutils\.fs\.mount|\/mnt\//.test(ln)){gMnt2.push(no);
      if(!/\.(table|load|save|saveAsTable|parquet|csv|json)\(/.test(ln))continue}
    if(/%run\b/.test(ln)){note('care',no,'%run','A notebook including another notebook. That shared code becomes a plugin or a job of its own — it will not follow you implicitly.');continue}

    /* ---- parametres et secrets ---- */
    if(m=/dbutils\.widgets\.get\(\s*["']([\w.\- ]+)["']/.exec(ln)){
      note('map',no,'widget '+m[1],/date|day|ds/i.test(m[1])?'${run.date} — the run date is built in':'${env.'+m[1].toUpperCase()+'}');continue}
    if(m=/dbutils\.secrets\.get\([^)]*key\s*=\s*["']([\w.\- ]+)["']/.exec(ln)){
      note('map',no,'secret '+m[1],'Resolved as '+secretName(m[1])+' from your secret store.');continue}

    /* ---- sources ---- */
    if(m=/spark\.read(?:Stream)?[^\n]*\.table\(\s*["']([\w.]+)["']/.exec(ln)||/spark\.table\(\s*["']([\w.]+)["']/.exec(ln)){
      srcs.push({t:'delta',tb:m[1],l:no});note('map',no,'read.table','source.type: delta, table: '+m[1]);continue}
    if(m=/spark\.read[^\n]*\.format\(\s*["'](\w+)["']/.exec(ln)){
      var fmt=m[1],pth=(/\.load\(\s*["']([^"']+)["']/.exec(ln)||[])[1];
      srcs.push({t:fmt==='delta'?'delta':fmt,p:pth||null,l:no});note('map',no,'read.format('+fmt+')','source.type: '+fmt);continue}
    if(m=/\.load\(\s*["']([^"']+)["']/.exec(ln)){if(srcs.length&&!srcs[srcs.length-1].p){srcs[srcs.length-1].p=m[1];note('map',no,'load path','source.path: '+m[1]);continue}}
    if(m=/sqlContext\.sql\(\s*["']([^"']+)["']|spark\.sql\(\s*["']SELECT([^"']+)["']/i.exec(ln)){
      srcs.push({t:'sql',q:(m[1]||('SELECT'+m[2])),l:no});note('map',no,'spark.sql','source.type: sql');continue}
    /* ---- destinations ---- */
    if(m=/\.saveAsTable\(\s*["']([\w.]+)["']|\.toTable\(\s*["']([\w.]+)["']/.exec(ln)){
      var md=(/\.mode\(\s*["'](\w+)["']/.exec(text)||[])[1];
      dsts.push({t:'delta',tb:m[1]||m[2],mode:md==='append'?'append':'replace',l:no});
      note('map',no,'saveAsTable','destination.type: delta, mode: '+(md==='append'?'append':'replace'));continue}
    if(m=/\.(save|parquet|csv|json)\(\s*["']([^"']+)["']/.exec(ln)){
      var f2=(/\.format\(\s*["'](\w+)["']/.exec(ln)||[])[1]||(m[1]==='save'?'delta':m[1]);
      var md2=(/\.mode\(\s*["'](\w+)["']/.exec(ln)||/\.mode\(\s*["'](\w+)["']/.exec(text)||[])[1];
      dsts.push({t:f2,p:m[2],mode:md2==='append'?'append':'replace',l:no});note('map',no,'write','destination.type: '+f2);continue}
    if(m=/\.to_parquet\(\s*["']([^"']+)["']/.exec(ln)){dsts.push({t:'parquet',p:m[1],l:no});note('map',no,'to_parquet','destination.type: parquet');continue}
    /* ---- transformations PySpark ---- */
    if(/\.toPandas\(\)/.test(ln)){note('care',no,'toPandas()','This is where the cluster stops helping — everything lands on the driver. If it fits in the driver, it fits in Hydra without a cluster at all.');continue}
    if(/\.collect\(\)/.test(ln)){note('care',no,'collect()','Pulls the whole frame to the driver. Same question: does this workload need distribution?');continue}
    if(m=/\.filter\(\s*["']([^"']+)["']\)|\.where\(\s*["']([^"']+)["']\)/.exec(ln)){
      tf.push({op:'filter',p:'{expr: '+q((m[1]||m[2]).replace(/'/g,'"'))+'}',l:no});note('map',no,'filter','op: filter');continue}
    if(m=/\.(?:filter|where)\(\s*F\.col\(\s*["'](\w+)["']\s*\)\s*(==|!=|>=|<=|>|<)\s*([^)]+)\)/.exec(ln)){
      tf.push({op:'filter',p:'{expr: '+q(m[1]+' '+m[2]+' '+m[3].trim())+'}',l:no});note('map',no,'filter','op: filter');continue}
    if(m=/\.(?:filter|where)\(\s*F\.col\(\s*["'](\w+)["']\s*\)\.isNotNull\(\)/.exec(ln)){
      tf.push({op:'filter',p:'{expr: '+q(m[1]+' is not null')+'}',l:no});note('map',no,'isNotNull','op: filter');continue}
    if(m=/\.select\(([^)]*)\)/.exec(ln)){var cl2=cols(m[1]);
      if(cl2.length&&!/F\.|alias|when|lit/.test(m[1])){tf.push({op:'select',p:'{columns: ['+cl2.join(', ')+']}',l:no});note('map',no,'select','op: select');continue}}
    if(/\.withColumnRenamed\(/.test(ln)){var mm=[],re=/\.withColumnRenamed\(\s*["'](\w+)["']\s*,\s*["'](\w+)["']/g,x;
      while(x=re.exec(ln))mm.push(x[1]+': '+x[2]);
      if(mm.length){tf.push({op:'rename',p:'{map: {'+mm.join(', ')+'}}',l:no});note('map',no,'withColumnRenamed','op: rename');continue}}
    if(m=/\.na\.fill\(\s*\{([^}]*)\}/.exec(ln)){tf.push({op:'fill_null',p:'{values: {'+m[1].replace(/["']/g,'').trim()+'}}',l:no});note('map',no,'na.fill','op: fill_null');continue}
    if(m=/\.dropDuplicates\(\s*\[([^\]]*)\]/.exec(ln)){tf.push({op:'deduplicate',p:'{keys: ['+cols(m[1]).join(', ')+']}',l:no});note('map',no,'dropDuplicates','op: deduplicate');continue}
    if(/\.dropDuplicates\(/.test(ln)){tf.push({op:'deduplicate',p:'{}',l:no});note('map',no,'dropDuplicates','op: deduplicate');continue}
    if(m=/\.orderBy\(\s*(?:F\.)?(?:col\()?["'](\w+)["']/.exec(ln)){var de=/\.desc\(\)|ascending\s*=\s*False/.test(ln);
      tf.push({op:'sort',p:'{by: ['+m[1]+'], order: '+(de?'desc':'asc')+'}',l:no});note('map',no,'orderBy','op: sort');continue}
    if(m=/\.groupBy\(([^)]*)\)\s*\.agg\(([^\n]*)/.exec(ln)){
      var keys=cols(m[1]),ags=[],re2=/F\.(sum|avg|mean|count|min|max)\(\s*["'](\w+)["']\s*\)(?:\.alias\(\s*["'](\w+)["']\s*\))?/g,y;
      while(y=re2.exec(m[2]))ags.push((y[3]||y[2])+': '+(y[1]==='avg'?'mean':y[1]));
      tf.push({op:'aggregate',p:'{by: ['+keys.join(', ')+']'+(ags.length?', agg: {'+ags.join(', ')+'}':'')+'}',l:no});
      note('map',no,'groupBy().agg()','op: aggregate');continue}
    if(/\.withColumn\(/.test(ln)){note('care',no,'withColumn','A computed column is a derive op — check the expression survives without Spark functions.');continue}
    if(/\.join\(/.test(ln)){note('care',no,'join','Two inputs = two jobs plus a workflow join. Split before you translate.');continue}
    if(/\.rdd\b|udf\(|pandas_udf/.test(ln)){note('care',no,'UDF / RDD','Arbitrary code — this becomes a plugin, or a reason to stay on Spark.');continue}
  }
  if(sqlCells.length){
    var sql=L.slice(sqlCells[0],sqlCells[sqlCells.length-1]+1).map(function(s){return s.replace(/^#\s*MAGIC\s?/,'')}).join(' ').trim();
    var tbl=(/CREATE\s+(?:OR\s+REPLACE\s+)?TABLE\s+([\w.]+)/i.exec(sql)||[])[1];
    var frm=(/FROM\s+([\w.]+)/i.exec(sql)||[])[1];
    if(frm&&!srcs.length)srcs.push({t:'sql',q:sql.replace(/^[\s\S]*?(SELECT)/i,'$1'),l:sqlCells[0]});
    if(tbl&&!dsts.length)dsts.push({t:'delta',tb:tbl,mode:'replace',l:sqlCells[0]});
    note('map',sqlCells[0],'%sql cell','A SQL cell is the easiest case: the statement becomes source.query and the target table becomes the destination.');
  }
  if(gStr.length)note('care',gStr[0],'structured streaming','No streaming engine in v1. Autoloader keeps landing the raw table; Hydra runs the batch jobs beside it.');
  if(gDlt.length)note('care',gDlt[0],'Delta Live Tables','DLT owns declaration, expectations and incremental state. Hydra has none of that — keep the pipeline, and let Hydra feed the table it reads.');
  if(gMrg.length)note('care',gMrg[0],'MERGE INTO','Upserts are a Delta feature. Hydra writes append or replace — an upsert stays as a workflow action running this statement.');
  if(gMnt2.length)note('care',gMnt2[0],'DBFS mount','Mounts are deprecated in favour of Unity Catalog volumes. Whatever you move to, the path has to be reachable from the Hydra node.');
  if(gMnt.length)note('care',gMnt[0],'Delta maintenance','Compaction, retention and time travel belong to the table format. Run them as a workflow action, not as a job step.');
  if(cells.length)note('drop',cells[0],cells.length+' cell marker'+(cells.length>1?'s':''),'Notebook cell boundaries are an editing convention. A manifest has steps instead.');
  if(mags.length)note('drop',mags[0],mags.length+' markdown line'+(mags.length>1?'s':''),'Prose in the notebook. Put it in the job description field if it matters.');
  if(imps.length)note('drop',imps[0],imps.length+' import'+(imps.length>1?'s':''),'A manifest is data — there is nothing to import.');
  if(disp.length)note('drop',disp[0],disp.length+' display / config line'+(disp.length>1?'s':''),'display() is an interactive convenience; cluster config has no equivalent.');
  if(heavy.length)note('care',heavy[0],heavy.length+' tuning call'+(heavy.length>1?'s':''),'repartition, cache and broadcast are written for a cluster. Before translating, measure the data: most Databricks jobs move less than a gigabyte, and a gigabyte does not need a cluster.');
  if(srcs.length>1)note('care',srcs[1].l,'second source','A job reads one source. Split into 2 jobs joined by a workflow.');
  if(dsts.length>1)note('care',dsts[1].l,'second destination','A job writes one destination. The extra one becomes its own job.');
  if(!srcs.length)note('care',1,'no source found','Nothing readable was detected — fill source: by hand.');
  if(!dsts.length)note('care',1,'no destination found','Nothing writable was detected — fill destination: by hand.');
  var nm2=String(dsts[0]&&(dsts[0].tb||dsts[0].p)||'').replace(/\.(parquet|csv|json|delta)$/,'').split(/[./]/).pop()||'notebook_job';
  return {name:name||nm2,cron:cron,manual:manual,tf:tf,src:srcs[0]||null,dst:dsts[0]||null,acts:acts,
          retries:retries,backoff:backoff,cache:null,notes:N,lName:lName,lCron:lCron,lRetry:lRetry,lCache:null,
          srcs:srcs,dsts:dsts,grp:{imp:imps,xcom:cells.concat(mags,disp)}};
}

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
    J('  conn: '+(s.conn||'${SECRET.DWH}'),s.l);
    J('  query: '+q(query),s.l);
  } else if(s.t==='webapi'){J('  type: webapi',s.l);J('  url: '+q(s.p),s.l);J('  method: GET',s.l)}
  else if(s.tb){J('  type: '+s.t,s.l);J('  table: '+q(s.tb),s.l)}
  else if(!s.p){J('  type: '+s.t,s.l);J('  path: ???        # the load() path was not a literal',s.l)}
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
  if(t.cache){J('');J('cache:',t.lCache);J('  enabled: true',t.lCache);if(t.cache.ttl)J('  ttl: '+t.cache.ttl,t.lCache)}
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
  if(!text.trim()){$("yml").innerHTML='<span class="yc"># paste a Databricks notebook or bundle on the left —\n# or pick a sample above.</span>';$("yml").dataset.raw='';
    $("fnB").textContent='job.yaml';$("cMap").textContent='0';$("cDrop").textContent='0';$("cCare").textContent='0';
    $("gut").innerHTML='<i>1</i>';$("rl").innerHTML='<li class="empty">Waiting for a notebook.</li>';CUR=null;ROWS=[];return}
  var t=translate(SEL!=null?SEL.text:effective(text));CUR=t;
  ROWS=buildYaml(t);
  var y=ROWS.map(function(r){return r[0]}).join('\n');
  $("yml").innerHTML=colorYaml(ROWS);
  $("yml").dataset.raw=y;
  $("fnB").textContent=(SEL!=null?'selection · ':'')+(t.acts.length?'workflows/':'jobs/')+t.name+'.yaml';
  $("fnA").textContent=(t.name==='untitled'?'notebook':t.name)+'.py'+(ignCount()?'  ('+ignCount()+' ignored)':'');
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
$("src").addEventListener('input',function(){$("ex").selectedIndex=-1;$("exTag").textContent='your notebook';clearTimeout(deb);deb=setTimeout(run,120)});
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
$("blank").onclick=function(){$("src").value='';$("fnA").textContent='notebook.py';$("exTag").textContent='';run();$("src").focus()};
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
  function J(s){return JSON.stringify(s)}
  if(x.op==='filter'){var e=(pv(p,'expr')||'""').replace(/^"|"$/g,'');return 'df = df.filter('+J(e)+')'}
  if(x.op==='select')return 'df = df.select('+lst(pv(p,'columns')).map(J).join(', ')+')';
  if(x.op==='rename')return dic(pv(p,'map')).map(function(kv){return 'df = df.withColumnRenamed('+J(kv[0])+', '+J(kv[1])+')'}).join('\n');
  if(x.op==='cast')return dic(pv(p,'types')).map(function(kv){return 'df = df.withColumn('+J(kv[0])+', F.col('+J(kv[0])+').cast('+J(kv[1])+'))'}).join('\n');
  if(x.op==='fill_null')return 'df = df.na.fill({'+dic(pv(p,'values')).map(function(kv){return J(kv[0])+': '+J(kv[1])}).join(', ')+'})';
  if(x.op==='deduplicate'){var k=lst(pv(p,'keys'));return 'df = df.dropDuplicates('+(k.length?'['+k.map(J).join(', ')+']':'')+')'}
  if(x.op==='sort'){var b=lst(pv(p,'by'))[0]||'col',o=pv(p,'order');return 'df = df.orderBy(F.col('+J(b)+')'+(o==='desc'?'.desc()':'')+')'}
  if(x.op==='aggregate'){var by=lst(pv(p,'by')),ag=dic(pv(p,'agg'));
    return 'df = df.groupBy('+by.map(J).join(', ')+').agg('+ag.map(function(kv){
      return 'F.'+(kv[1]==='mean'?'avg':kv[1])+'('+J(kv[0])+').alias('+J(kv[0])+')'}).join(', ')+')'}
  if(x.op==='flatten')return '# flatten: use F.explode / select on the nested struct';
  return '# '+x.op;
}
function reverse(block){
  var t=CUR;if(!t)return '# nothing to reverse';
  if(block==='source'){var s=t.src;if(!s)return '# no source detected';
    if(s.tb)return 'df = spark.read.table('+JSON.stringify(s.tb)+')';
    if(s.t==='sql')return 'df = spark.sql('+JSON.stringify(s.q||'')+')';
    if(s.t==='csv'||s.t==='parquet'||s.t==='json'||s.t==='delta')return 'df = spark.read.format('+JSON.stringify(s.t)+').load('+JSON.stringify(s.p||'')+')';
    if(s.t==='webapi')return 'r = requests.get('+JSON.stringify(s.p)+')\npayload = r.json()';
    return 'df = spark.sql('+JSON.stringify(s.q||'')+')'}
  if(block==='transformations')return t.tf.length?t.tf.map(toPandas).join('\n'):'# pass-through';
  if(block==='destination'){var d=t.dst;if(!d)return '# no destination detected';
    if(d.tb)return 'df.write.format("delta").mode('+JSON.stringify(d.mode==='append'?'append':'overwrite')+').saveAsTable('+JSON.stringify(d.tb)+')';
    if(false)return 'x'; if(d.tb)return 'engine.to_sql('+JSON.stringify(d.tb)+', engine, if_exists='+JSON.stringify(d.mode)+', index=False)';
    return 'df.write.format('+JSON.stringify(d.t)+').mode('+JSON.stringify(d.mode==='append'?'append':'overwrite')+').save('+JSON.stringify(d.p)+')'}
  if(block==='trigger'||block==='name'){
    return '# Databricks notebook source\n# '+t.name+
      (t.cron?'\n# databricks.yml → quartz_cron_expression: "0 '+t.cron+'"':'\n# no schedule — triggered by hand or by another job')+
      '\n\nfrom pyspark.sql import functions as F'}
  if(block==='retry')return '# databricks.yml → max_retries: '+t.retries+(t.backoff?', min_retry_interval_millis: '+(parseInt(t.backoff,10)*60000):'');
  return '# '+block+' has no PySpark counterpart';
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
    {t:'Paste a notebook',k:'⌘V',f:function(){
      if(navigator.clipboard&&navigator.clipboard.readText)
        navigator.clipboard.readText().then(function(txt){if(!txt)return;IGN={};SEL=null;ta.value=txt;$("ex").selectedIndex=-1;$("exTag").textContent='your notebook';run();toast('Pasted')})
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
    {t:'Reveal the notebook line',off:!src,f:function(){gotoLine(src);toast('Line '+src)}},
    '-',
    {t:'Back to PySpark (this block)',off:!b,f:function(){
      pop('reverse',b.name+': → Python','<p>The same block, expressed back as PySpark. Nothing here is a one-way door.</p><pre>'+esc(reverse(b.name))+'</pre>',e.clientX,e.clientY)}},
    {t:'Preview on sample data',f:function(){preview(e.clientX,e.clientY)}},
    '-',
    {t:'Copy the whole manifest',f:function(){cpy($("yml").dataset.raw||'');toast('Manifest copied')}},
    {t:'Download',f:function(){$("dl").click()}}
  ]};
});

/* ================= BARRES D'ICONES ================= */
function loadText(txt,label){IGN={};MUTE={};SEL=null;$("src").value=txt;
  $("ex").selectedIndex=-1;$("exTag").textContent=label||'your notebook';run();
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
  pop('reverse',CUR.name+' → PySpark','<p>The whole manifest, back as a notebook. Round-tripping is not a one-way door.</p><pre>'+esc(out.join('\n'))+'</pre>',r.left-340,r.bottom+8)};
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
function lintYamlFile(text){
  var L=text.split('\n'),out=[],seen={};
  function add(s,l,w,t){out.push({s:s,l:l,w:w,t:t})}
  var SMART=new RegExp('['+String.fromCharCode(8220,8221,8216,8217)+']'),NBSP=new RegExp(String.fromCharCode(160));
  for(var i=0;i<L.length;i++){
    var ln=L[i],no=i+1;
    if(/^\s*#/.test(ln)||!ln.trim())continue;
    if(/\t/.test(ln))add('err',no,'tab character','YAML forbids tabs for indentation — the bundle will not load.');
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes — YAML reads them as part of the value.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line.');
    var ind=/^ */.exec(ln)[0].length;
    if(ind%2)add('warn',no,'odd indentation',ind+' spaces. Bundles indent by two — mixed widths are the usual cause of a silently ignored block.');
    var m=/^([\w.\-]+):/.exec(ln);
    if(m){if(seen[m[1]])add('err',no,'duplicate key','"'+m[1]+'" is declared twice at the top level — the second one silently wins.');seen[m[1]]=1}
    var qz=/quartz_cron_expression:\s*["']([^"']*)["']/.exec(ln);
    if(qz){var f=qz[1].trim().split(/\s+/);
      if(f.length<6)add('err',no,'quartz needs 6 fields','Databricks uses Quartz: seconds first, then minute, hour, day, month, day-of-week. This has '+f.length+'.');
      else if(f[0]!=='0')add('warn',no,'sub-minute schedule','Quartz fires at second '+f[0]+'. Standard cron has no seconds field — that precision cannot survive the move.');}
    var nw=/num_workers:\s*(\d+)/.exec(ln);
    if(nw&&+nw[1]>=4)add('info',no,nw[1]+'-worker cluster','Sized for volume. Measure the input before assuming it is needed — this is the biggest cost line in most workspaces.');
    if(/spark_version:\s*["']?(\d+)/.test(ln)){var v=+/spark_version:\s*["']?(\d+)/.exec(ln)[1];
      if(v<13)add('warn',no,'old runtime','Runtime '+v+'.x is past its support window on most workspaces.');}
  }
  if(/^\s*resources:/m.test(text)&&!/^\s*bundle:/m.test(text))
    add('warn',1,'no bundle block','A bundle file needs a top-level bundle: with a name, or the CLI refuses it.');
  out.sort(function(a,b){return a.l-b.l});return out;
}
function lintPyRaw(text){
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
  /* --- 4. copier-coller et pieges Databricks --- */
  var isBundleF=/^\s*bundle:/m.test(text)||/quartz_cron_expression/.test(text);
  info.forEach(function(x){
    var ln=x.raw,no=x.no;
    if(SMART.test(ln))add('err',no,'smart quotes','Curly quotes from a word processor — Python will not parse this line.');
    if(NBSP.test(ln))add('err',no,'non-breaking space','An invisible U+00A0 sits in this line — the classic copy-paste from a web page.');
    if(/^\t+/.test(ln))add(isBundleF?'err':'warn',no,'tab character',isBundleF?'YAML forbids tabs for indentation — the bundle will not load.':'Tabs mixed into Python indentation.');
    if(/\bsqlContext\b/.test(x.code))add('err',no,'sqlContext','Removed years ago. Use spark.sql() — sqlContext will raise NameError on any current runtime.');
    if(/dbutils\.fs\.mount\(|["']\/mnt\//.test(x.code))add('warn',no,'DBFS mount','Mounts are deprecated in favour of Unity Catalog volumes and external locations.');
    if(/^#\s*MAGIC\s+%run|^\s*%run\b/.test(ln))add('warn',no,'%run','A hidden dependency on another notebook. Nothing in the job definition records it.');
    if(/%pip\s+install/.test(ln)&&no>3)add('warn',no,'%pip mid-notebook','Installing a package restarts the Python interpreter and clears every variable defined above.');
    if(/\.collect\(\)/.test(x.code))add('warn',no,'collect()','Pulls the entire frame onto the driver — the usual cause of a driver OOM on a job that "used to work".');
    if(/\.toPandas\(\)/.test(x.code))add('info',no,'toPandas()','From here on the cluster is not helping. Worth asking whether the whole job needs one.');
    if(/display\(/.test(x.code))add('info',no,'display()','Interactive output. In a scheduled job it renders nothing and costs a collect.');
    if(/spark\.read[^\n]*\.table\(\s*["'][\w]+\.[\w]+["']\s*\)/.test(x.code))
      add('info',no,'two-level table name','Unity Catalog expects catalog.schema.table. A two-level name resolves against the default catalog, which differs between workspaces.');
    if(/mode\(\s*["']overwrite["']\s*\)/.test(x.code)&&!/overwriteSchema/.test(text))
      add('info',no,'overwrite without schema change','If the upstream schema drifts, the write fails rather than adapting. Intentional or not, worth knowing before it runs at 02:00.');
    if(/quartz_cron_expression:\s*["']([^"']*)["']/.test(ln)){
      var f=(/quartz_cron_expression:\s*["']([^"']*)["']/.exec(ln)[1]||'').trim().split(/\s+/);
      if(f.length<6)add('err',no,'quartz needs 6 fields','Databricks uses Quartz syntax: seconds first, then minute, hour, day, month, day-of-week. This has '+f.length+'.');
    }
    if(/num_workers:\s*(\d+)/.test(ln)){var nw=+/num_workers:\s*(\d+)/.exec(ln)[1];
      if(nw>=4)add('info',no,nw+'-worker cluster','Sized for volume. Measure the input before assuming it is needed — this is the single biggest cost line in most workspaces.');}
  });
  if(/@dlt\./.test(text)&&!/import\s+dlt/.test(text))add('err',1,'dlt not imported','@dlt decorators are used but dlt is never imported.');
  if(/readStream/.test(text)&&!/checkpointLocation/.test(text))add('err',1,'stream without a checkpoint','A structured stream with no checkpointLocation cannot recover — it reprocesses everything on restart.');
  if(/dbutils\.widgets\.get/.test(text)&&!/dbutils\.widgets\.(text|dropdown|combobox)\(/.test(text))
    add('warn',1,'widget never declared','widgets.get() reads a widget that this notebook never creates. It works when the job passes the parameter and fails silently the moment someone runs it by hand.');
  if(!/spark\.|dbutils\.|@dlt\.|^\s*bundle:/m.test(text)){
    out=out.filter(function(x){return x.w!=='top-level I/O'});
    add('info',1,'no Spark found','Parsed as a plain script — the trigger falls back to manual.');}
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
    if(/\{\{/.test(l))add('warn',i,'template left in place','Databricks widgets are not evaluated by Hydra. Use ${run.date} or ${env.X}.');
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
function lintPy(text){return (/^\s*bundle:|quartz_cron_expression|^\s*resources:\s*$/m.test(text)&&!/spark\./.test(text))?lintYamlFile(text):lintPyRaw(text)}
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