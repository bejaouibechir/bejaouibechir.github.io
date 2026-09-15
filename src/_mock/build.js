var $=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function q(s){return '"'+String(s).replace(/"/g,'\\"')+'"'}
function toast(s){var t=$("toast");t.textContent=s;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},1700)}
var LOCK='<svg class="lk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>';

/* ================= LES TROIS PROJETS ================= */
var P=[
{
  id:'orders', nm:'Nightly orders', dc:'One database table, cleaned and rolled up into the warehouse every night.',
  meta:'1 workflow · 1 job · 6 settings',
  st:{cron:'0 2 * * *',src:'postgres',paid:true,dedup:false,rollup:true,dst:'postgres',notify:false,retry:false},
  ctl:[
    ['grp','Trigger'],
    ['sel','cron','Schedule',[['0 2 * * *','every night at 02:00'],['0 * * * *','every hour'],['','manual only']]],
    ['grp','Job — source'],
    ['sel','src','Read from',[['postgres','postgres'],['mysql','mysql'],['csv','a CSV file']]],
    ['grp','Job — transformations'],
    ['chk','paid','Keep paid orders only','op: filter'],
    ['chk','dedup','Drop duplicate order_id','op: deduplicate'],
    ['chk','rollup','Sum amounts per region','op: aggregate'],
    ['grp','Job — destination'],
    ['sel','dst','Write to',[['postgres','a warehouse table'],['parquet','a Parquet file']]],
    ['chk','retry','Retry 3 times on failure','retry block'],
    ['grp','Workflow'],
    ['chk','notify','Post to Slack when done','a second step, type: action'],
    ['lock','Branch on a condition'],
    ['lock','Fan out over a list']
  ]
},
{
  id:'streams', nm:'Three streams, one landing', dc:'Independent tables loaded in parallel, then handed to dbt.',
  meta:'1 workflow · up to 3 jobs · 5 settings',
  st:{cron:'0 2 * * *',orders:true,customers:true,products:false,incr:false,dbt:true},
  ctl:[
    ['grp','Trigger'],
    ['sel','cron','Schedule',[['0 2 * * *','every night at 02:00'],['0 */6 * * *','every 6 hours']]],
    ['grp','Streams — one job each'],
    ['chk','orders','orders','jobs/load_orders.yaml'],
    ['chk','customers','customers','jobs/load_customers.yaml'],
    ['chk','products','products','jobs/load_products.yaml'],
    ['grp','How they load'],
    ['chk','incr','Only rows changed since last run','incremental block'],
    ['grp','Afterwards'],
    ['chk','dbt','Run dbt build once loading is done','a step with depends_on'],
    ['lock','Wait for a file to land']
  ]
},
{
  id:'drop', nm:'CSV drop, cleaned', dc:'A file lands, gets tidied, and becomes a typed table.',
  meta:'1 workflow · 1 job · 6 settings',
  st:{cron:'',rename:true,fill:true,cast:false,drop:true,mode:'append',retry:true},
  ctl:[
    ['grp','Trigger'],
    ['sel','cron','Schedule',[['','manual only'],['*/15 * * * *','every 15 minutes']]],
    ['grp','Cleaning steps — order matters'],
    ['chk','rename','Rename e_mail → email','op: rename'],
    ['chk','fill','Replace missing country','op: fill_null'],
    ['chk','cast','Force amount to a number','op: cast'],
    ['chk','drop','Drop duplicate emails','op: deduplicate'],
    ['grp','Destination'],
    ['sel','mode','Write mode',[['append','add rows'],['replace','replace the table']]],
    ['chk','retry','Retry 3 times on failure','retry block'],
    ['lock','Split into two destinations']
  ]
}];
/* ================= CONSTRUCTION DU DSL ================= */
function L(a,k){return [a,k||null]}
function build(p,s){
  var files=[],steps=[];
  if(p.id==='orders'){
    var ops=[];
    if(s.paid)ops.push([L('  - op: filter','paid'),L('    params: {expr: "status == \\"paid\\""}','paid')]);
    if(s.dedup)ops.push([L('  - op: deduplicate','dedup'),L('    params: {keys: [order_id]}','dedup')]);
    if(s.rollup)ops.push([L('  - op: aggregate','rollup'),L('    params: {by: [region], agg: {amount: sum}}','rollup')]);
    var j=[L('name: nightly_orders'),L(''),L('source:')];
    if(s.src==='csv')j.push(L('  type: csv','src'),L('  path: "/data/landing/orders.csv"','src'));
    else j.push(L('  type: '+s.src,'src'),L('  conn: ${SECRET.DWH}','src'),L('  query: "SELECT * FROM orders"','src'));
    j.push(L(''),L('transformations:'));
    if(!ops.length)j.push(L('  []               # pass-through'));
    else ops.forEach(function(o){o.forEach(function(x){j.push(x)})});
    j.push(L(''),L('destination:'));
    if(s.dst==='postgres')j.push(L('  type: postgres','dst'),L('  table: "marts.orders_daily"','dst'),L('  mode: replace','dst'));
    else j.push(L('  type: parquet','dst'),L('  path: "lake/orders_daily.parquet"','dst'),L('  mode: replace','dst'));
    if(s.retry)j.push(L(''),L('retry:','retry'),L('  attempts: 3','retry'),L('  backoff: 5m','retry'));
    files.push({n:'jobs/nightly_orders.yaml',l:j});
    steps.push({n:'nightly_orders',t:'job',deps:[]});
    var w=[L('version: "1.0"'),L('workflow:'),L('  name: nightly_orders'),L('  trigger:','cron')];
    if(s.cron)w.push(L('    type: schedule','cron'),L('    cron: '+q(s.cron),'cron'));else w.push(L('    type: manual','cron'));
    w.push(L('  steps:'),L('    - name: nightly_orders'),L('      type: job'),L('      job: "./jobs/nightly_orders.yaml"'));
    if(s.notify){steps.push({n:'notify',t:'action',deps:['nightly_orders']});
      w.push(L('    - name: notify','notify'),L('      type: action','notify'),L('      action: shell','notify'),
             L('      params:','notify'),L('        command: "curl -X POST $SLACK_HOOK"','notify'),
             L('      depends_on: ["nightly_orders"]','notify'));}
    files.unshift({n:'workflows/nightly_orders.yaml',l:w});
  }
  if(p.id==='streams'){
    var on=['orders','customers','products'].filter(function(k){return s[k]});
    on.forEach(function(k){
      steps.push({n:'load_'+k,t:'job',deps:[]});
      var j=[L('name: load_'+k,k),L(''),L('source:',k),L('  type: postgres',k),L('  conn: ${SECRET.SRC}',k),
             L('  query: "SELECT * FROM '+k+'"',k)];
      if(s.incr)j.push(L('  incremental:','incr'),L('    column: updated_at','incr'),L('    since: ${run.previous}','incr'));
      j.push(L(''),L('transformations:',k),L('  []               # nothing to reshape on ingest',k),
             L(''),L('destination:',k),L('  type: postgres',k),L('  table: "raw.'+k+'"',k),
             L('  mode: '+(s.incr?'append':'replace'),'incr'));
      files.push({n:'jobs/load_'+k+'.yaml',l:j});
    });
    var w=[L('version: "1.0"'),L('workflow:'),L('  name: raw_ingestion'),L('  trigger:','cron'),
           L('    type: schedule','cron'),L('    cron: '+q(s.cron),'cron'),L('  steps:')];
    on.forEach(function(k){w.push(L('    - name: load_'+k,k),L('      type: job',k),L('      job: "./jobs/load_'+k+'.yaml"',k))});
    if(!on.length)w.push(L('    []               # no stream selected'));
    if(s.dbt&&on.length){
      steps.push({n:'dbt_build',t:'action',deps:on.map(function(k){return 'load_'+k})});
      w.push(L('    - name: dbt_build','dbt'),L('      type: action','dbt'),L('      action: shell','dbt'),
             L('      params:','dbt'),L('        command: "dbt build"','dbt'),
             L('      depends_on: ['+on.map(function(k){return q('load_'+k)}).join(', ')+']','dbt'));
    }
    if(!s.dbt&&on.length>1)w.push(L('  # no depends_on: the streams are independent, so they run in parallel'));
    files.unshift({n:'workflows/raw_ingestion.yaml',l:w});
  }
  if(p.id==='drop'){
    var j=[L('name: clean_signups'),L(''),L('source:'),L('  type: csv'),L('  path: "/drop/signups.csv"'),L(''),L('transformations:')];
    var any=false;
    if(s.rename){any=1;j.push(L('  - op: rename','rename'),L('    params: {map: {e_mail: email}}','rename'))}
    if(s.fill){any=1;j.push(L('  - op: fill_null','fill'),L('    params: {values: {country: unknown}}','fill'))}
    if(s.cast){any=1;j.push(L('  - op: cast','cast'),L('    params: {types: {amount: float64}}','cast'))}
    if(s.drop){any=1;j.push(L('  - op: deduplicate','drop'),L('    params: {keys: [email]}','drop'))}
    if(!any)j.push(L('  []               # pass-through'));
    j.push(L(''),L('destination:'),L('  type: postgres'),L('  table: "core.signups"'),L('  mode: '+s.mode,'mode'));
    if(s.retry)j.push(L(''),L('retry:','retry'),L('  attempts: 3','retry'),L('  backoff: 5m','retry'));
    files.push({n:'jobs/clean_signups.yaml',l:j});
    steps.push({n:'clean_signups',t:'job',deps:[]});
    var w=[L('version: "1.0"'),L('workflow:'),L('  name: clean_signups'),L('  trigger:','cron')];
    if(s.cron)w.push(L('    type: schedule','cron'),L('    cron: '+q(s.cron),'cron'));else w.push(L('    type: manual','cron'));
    w.push(L('  steps:'),L('    - name: clean_signups'),L('      type: job'),L('      job: "./jobs/clean_signups.yaml"'));
    files.unshift({n:'workflows/clean_signups.yaml',l:w});
  }
  return {files:files,steps:steps};
}
/* ================= GRAPHE (le même moteur que workflow-view) ================= */
var NW=150,NH=44,GX=54,GY=20,PAD=14;
function graph(steps){
  if(!steps.length)return {svg:'',w:200,h:60};
  var by={},seen={};steps.forEach(function(s){by[s.n]=s});
  function dep(s,st){if(seen[s.n]!=null)return seen[s.n];if(st[s.n])return 0;st[s.n]=1;
    var d=0;s.deps.forEach(function(p){if(by[p])d=Math.max(d,dep(by[p],st)+1)});delete st[s.n];return seen[s.n]=d}
  steps.forEach(function(s){s.d=dep(s,{})});
  var byd={};steps.forEach(function(s){(byd[s.d]=byd[s.d]||[]).push(s)});
  var cols=Object.keys(byd).sort(function(a,b){return a-b}).map(function(k){return byd[k]});
  cols.forEach(function(c,x){c.forEach(function(s,y){s.x=x;s.y=y;s.rows=c.length})});
  var rows=Math.max.apply(null,cols.map(function(c){return c.length}));
  var W=PAD*2+cols.length*NW+(cols.length-1)*GX,H=PAD*2+rows*NH+(rows-1)*GY;
  function cx(s){return PAD+s.x*(NW+GX)}
  function cy(s){return PAD+s.y*(NH+GY)+(rows-s.rows)*(NH+GY)/2}
  var C={job:'var(--accent)',action:'var(--rival)'},S={job:'var(--accent-soft)',action:'var(--rival-soft)'};
  var g='<defs><marker id="ga" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">'+
        '<path d="M0,0 L6,3 L0,6 z" fill="var(--border-strong)"/></marker></defs>';
  steps.forEach(function(t){t.deps.forEach(function(p){var f=by[p];if(!f)return;
    var x1=cx(f)+NW,y1=cy(f)+NH/2,x2=cx(t)-6,y2=cy(t)+NH/2,m=(x1+x2)/2;
    g+='<path d="M'+x1+','+y1+' C'+m+','+y1+' '+m+','+y2+' '+x2+','+y2+'" stroke="var(--border-strong)" stroke-width="1.6" fill="none" marker-end="url(#ga)"/>'})});
  steps.forEach(function(s){
    g+='<g><rect x="'+cx(s)+'" y="'+cy(s)+'" width="'+NW+'" height="'+NH+'" rx="9" fill="'+(S[s.t]||'var(--bg-soft)')+'" stroke="'+(C[s.t]||'var(--border-strong)')+'" stroke-width="1.6"/>'+
      '<rect x="'+cx(s)+'" y="'+cy(s)+'" width="4" height="'+NH+'" rx="2" fill="'+(C[s.t]||'var(--border-strong)')+'"/>'+
      '<text x="'+(cx(s)+12)+'" y="'+(cy(s)+18)+'" style="font-size:9px;font-family:var(--mono);fill:var(--text-mut);letter-spacing:.05em">'+s.t.toUpperCase()+'</text>'+
      '<text x="'+(cx(s)+12)+'" y="'+(cy(s)+33)+'" style="font-size:11.5px;font-weight:600">'+esc(s.n.length>17?s.n.slice(0,16)+'…':s.n)+'</text></g>';
  });
  return {svg:g,w:W,h:H};
}
/* ================= RENDU ================= */
var cur=0,ST={},tab=0,prev={},playing=false;
function colorLine(l){
  if(/^\s*#/.test(l))return '<span class="yc">'+l+'</span>';
  var st=[],cm=null,A=String.fromCharCode(1),B=String.fromCharCode(2);
  l=l.replace(/"[^"]*"/g,function(m){st.push(m);return A+(st.length-1)+A});
  l=l.replace(/#.*$/,function(m){cm=m;return B});
  l=l.replace(/^(\s*(?:- )?)([\w_]+)(:)/,'$1<span class="yk">$2</span>$3');
  if(cm!==null)l=l.replace(B,'<span class="yc">'+cm+'</span>');
  return l.replace(new RegExp(A+'(\\d+)'+A,'g'),function(_,i){return '<span class="ys">'+st[+i]+'</span>'});
}
function renderProjects(){
  $("projs").innerHTML=P.map(function(p,i){
    return '<button class="pj'+(i===cur?' on':'')+'" data-i="'+i+'"><b>'+esc(p.nm)+'</b><small>'+esc(p.dc)+'</small><span class="meta">'+esc(p.meta)+'</span></button>'}).join('');
}
function renderCtl(){
  var p=P[cur];
  $("ctl").innerHTML=p.ctl.map(function(c){
    if(c[0]==='grp')return '<div class="grp">'+esc(c[1])+'</div>';
    if(c[0]==='lock')return '<div class="row lockrow">'+LOCK+'<span class="lb">'+esc(c[1])+'<small>in the installed Studio</small></span></div>';
    if(c[0]==='chk')return '<label class="row" data-k="'+c[1]+'"><input type="checkbox" data-c="'+c[1]+'"'+(ST[c[1]]?' checked':'')+'>'+
      '<span class="lb">'+esc(c[2])+'<small>'+esc(c[3])+'</small></span></label>';
    return '<label class="row" data-k="'+c[1]+'"><span class="lb">'+esc(c[2])+'</span><select data-c="'+c[1]+'">'+
      c[3].map(function(o){return '<option value="'+esc(o[0])+'"'+(ST[c[1]]===o[0]?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select></label>';
  }).join('');
}
function currentFiles(){return build(P[cur],ST).files}
function renderYaml(anim){
  var f=currentFiles();if(tab>=f.length)tab=0;
  $("tabs").innerHTML=f.map(function(x,i){return '<button class="tab'+(i===tab?' on':'')+'" data-t="'+i+'">'+esc(x.n)+'</button>'}).join('');
  var lines=f[tab].l,key=P[cur].id+'|'+f[tab].n,old=prev[key]||[];
  var oldSet={};old.forEach(function(t){oldSet[t]=(oldSet[t]||0)+1});
  $("yml").innerHTML=lines.map(function(x,i){
    var isNew=anim&&old.length&&(!oldSet[x[0]]||oldSet[x[0]]--<=0);
    return '<span class="yl'+(isNew?' add':'')+'" data-k="'+(x[1]||'')+'" data-i="'+i+'">'+colorLine(esc(x[0]))+'</span>'}).join('');
  prev[key]=lines.map(function(x){return x[0]});
  var g=graph(build(P[cur],ST).steps);
  $("svg").setAttribute('viewBox','0 0 '+g.w+' '+g.h);
  $("svg").setAttribute('style','width:'+g.w+'px');
  $("svg").innerHTML=g.svg;
  if(anim)setTimeout(function(){[].slice.call($("yml").querySelectorAll('.add')).forEach(function(e){e.classList.remove('add')})},1400);
}
function caption(t){$("cap").innerHTML=t}
function draw(anim){renderProjects();renderCtl();renderYaml(anim)}

/* interactions */
$("projs").addEventListener('click',function(e){var b=e.target.closest('[data-i]');if(!b)return;
  cur=+b.dataset.i;ST=JSON.parse(JSON.stringify(P[cur].st));tab=0;prev={};
  draw(false);caption('<b>'+esc(P[cur].nm)+'.</b> Toggle a setting on the left and watch the lines light up.')});
$("ctl").addEventListener('change',function(e){
  var c=e.target.getAttribute('data-c');if(!c)return;
  ST[c]=e.target.type==='checkbox'?e.target.checked:e.target.value;
  var row=e.target.closest('.row'),lab=row?row.querySelector('.lb').firstChild.textContent:c;
  draw(true);
  var n=$("yml").querySelectorAll('.yl.add').length;
  caption(n?('<b>'+esc(lab.trim())+'</b> → '+n+' line'+(n>1?'s':'')+' changed in <code>'+esc(currentFiles()[tab].n)+'</code>.')
           :('<b>'+esc(lab.trim())+'</b> → nothing changed in this file. Check the other tab.'));
});
$("ctl").addEventListener('mouseover',function(e){
  var r=e.target.closest('[data-k]');if(!r)return;
  [].slice.call($("yml").querySelectorAll('.yl')).forEach(function(l){l.classList.toggle('hot',l.dataset.k===r.dataset.k)});
});
$("ctl").addEventListener('mouseout',function(){[].slice.call($("yml").querySelectorAll('.yl')).forEach(function(l){l.classList.remove('hot')})});
$("tabs").addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(b){tab=+b.dataset.t;renderYaml(false)}});
$("reset").onclick=function(){ST=JSON.parse(JSON.stringify(P[cur].st));prev={};draw(false);caption('Back to the original project.')};

/* ---------- « Watch it build » ---------- */
var CAP={version:'A workflow file starts with its version and a name.',trigger:'The trigger is the whole scheduler — one cron line.',
  steps:'Each step points at a job manifest, or is an action of its own.',name:'A job manifest names itself, then reads, transforms, writes.',
  source:'One source. Always exactly one — that is what makes a job atomic.',
  transformations:'The ops run top to bottom, in the order you see.',
  destination:'One destination, with the write mode written down.',
  retry:'Retries belong to the job, not to the scheduler.'};
$("build").onclick=function(){
  if(playing)return;playing=true;
  var f=currentFiles()[tab],lines=f.l,blocks=[],b=[];
  lines.forEach(function(x){if(!x[0].trim()){if(b.length){blocks.push(b);b=[]}}else b.push(x)});
  if(b.length)blocks.push(b);
  var els=[].slice.call($("yml").querySelectorAll('.yl'));
  els.forEach(function(e){e.classList.add('hid')});
  var i=0,li=0;
  (function step(){
    if(i>=blocks.length){playing=false;caption('<b>Done.</b> That is the whole manifest — '+lines.length+' lines, no hidden state.');return}
    var blk=blocks[i],head=(blk[0][0].match(/^\s*([\w_]+):/)||[])[1]||'';
    caption('<b>'+esc(f.n)+'</b> — '+(CAP[head]||'…'));
    blk.forEach(function(){var e=els[li++];while(e&&!e.textContent.trim()){e.classList.remove('hid');e=els[li++]}
      if(e){e.classList.remove('hid');e.classList.add('add');setTimeout(function(){e.classList.remove('add')},900)}});
    while(els[li]&&!els[li].textContent.trim()){els[li].classList.remove('hid');li++}
    i++;setTimeout(step,900);
  })();
};
/* ---------- porte de sortie ---------- */
function projectScript(){
  var f=currentFiles(),o=['mkdir -p hydra_demo/jobs hydra_demo/workflows && cd hydra_demo',''];
  f.forEach(function(x){o.push("cat > "+x.n+" <<'EOF'",x.l.map(function(y){return y[0]}).join('\n'),'EOF','')});
  o.push('pip install hydra-etl','hdrctl validate '+f[0].n,'hdrctl run '+f[0].n);
  return o.join('\n');
}
function gate(){
  $("gateT").textContent='Take this project with you';
  $("gateP").textContent='Everything you just assembled, as a folder. Paste the block in a terminal: it writes the manifests, installs Hydra and runs them on your machine. The designer stops here — the product starts there.';
  $("gateC").textContent=projectScript();$("gate").classList.add('on');$("gateX").focus();
}
$("take").onclick=gate;
$("gateX").onclick=$("gateBack").onclick=function(){$("gate").classList.remove('on')};
$("gate").onclick=function(e){if(e.target===this)this.classList.remove('on')};
document.addEventListener('keydown',function(e){if(e.key==='Escape')$("gate").classList.remove('on')});
function cp(t){if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t)}
$("gateCopy").onclick=function(){cp($("gateC").textContent);toast('Copied — paste it in a terminal')};
$("copy").onclick=function(){cp(currentFiles()[tab].l.map(function(x){return x[0]}).join('\n'));toast('Manifest copied')};

ST=JSON.parse(JSON.stringify(P[0].st));
draw(false);
caption('<b>'+P[0].nm+'.</b> Toggle a setting on the left and watch the lines light up.');