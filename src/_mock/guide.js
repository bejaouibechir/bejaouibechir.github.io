var EL=[
 {n:"csv",c:"Sources",d:"Read rows from a CSV file.",b:["stable","batch","pushdown"]},
 {n:"json",c:"Sources",d:"Read records from JSON / NDJSON.",b:["stable","batch"]},
 {n:"parquet",c:"Sources",d:"Read columnar Parquet files.",b:["beta","batch","pushdown"]},
 {n:"postgresql",c:"Sources",d:"Read from a PostgreSQL table or query.",b:["stable","batch","pushdown"]},
 {n:"mysql",c:"Sources",d:"Read from MySQL / MariaDB.",b:["stable","batch","pushdown"]},
 {n:"mongodb",c:"Sources",d:"Read documents from MongoDB.",b:["beta","batch"]},
 {n:"web_api",c:"Sources",d:"Read from a REST API with pagination.",b:["beta","batch"]},
 {n:"csv",c:"Destinations",d:"Write rows to CSV with append or replace.",b:["stable","batch"]},
 {n:"json",c:"Destinations",d:"Write records to JSON with append or replace.",b:["stable","batch"]},
 {n:"parquet",c:"Destinations",d:"Write columnar Parquet output.",b:["beta","batch"]},
 {n:"postgresql",c:"Destinations",d:"Write with append, replace or upsert.",b:["stable","batch"]},
 {n:"mysql",c:"Destinations",d:"Write with append, replace or upsert.",b:["stable","batch"]},
 {n:"mongodb",c:"Destinations",d:"Write documents with append, replace or upsert.",b:["beta","batch"]},
 {n:"web_api",c:"Destinations",d:"Send output records to a Web API.",b:["beta","batch"]},
 {n:"filter",c:"Transforms",d:"Keep rows matching a boolean expression.",b:["stable","batch","pushdown"]},
 {n:"select",c:"Transforms",d:"Keep only some columns.",b:["stable","batch"]},
 {n:"rename",c:"Transforms",d:"Rename columns.",b:["stable","batch"]},
 {n:"cast",c:"Transforms",d:"Change column types.",b:["stable","batch"]},
 {n:"calculate",c:"Transforms",d:"Add a derived column.",b:["stable","batch"]},
 {n:"sort",c:"Transforms",d:"Order rows by columns.",b:["stable","batch"]},
 {n:"deduplicate",c:"Transforms",d:"Drop duplicate rows.",b:["stable","batch"]},
 {n:"aggregate",c:"Transforms",d:"Group and summarize.",b:["stable","batch"]},
 {n:"join",c:"Transforms",d:"Join another flow on a key.",b:["stable","batch"]},
 {n:"clean",c:"Transforms",d:"Trim, normalize, fix values.",b:["stable","batch"]},
 {n:"fill_null",c:"Transforms",d:"Replace null values.",b:["stable","batch"]},
 {n:"trim",c:"Transforms",d:"Strip whitespace from text.",b:["stable","batch"]},
 {n:"pivot",c:"Transforms",d:"Long to wide reshape.",b:["stable","batch"]},
 {n:"unpivot",c:"Transforms",d:"Wide to long reshape.",b:["stable","batch"]},
 {n:"transpose",c:"Transforms",d:"Swap rows and columns.",b:["stable","batch"]},
 {n:"merge",c:"Transforms",d:"Merge another source by key.",b:["stable","batch"]},
 {n:"union",c:"Transforms",d:"Append rows from multiple inputs.",b:["stable","batch"]},
 {n:"script",c:"Transforms",d:"Custom Python transform (sandboxed).",b:["beta","batch"]},
 {n:"job",c:"Workflows",d:"Execute a Hydra job as a workflow step.",b:["stable"]},
 {n:"action",c:"Workflows",d:"Execute a webhook, log or notification action.",b:["stable"]},
 {n:"depends_on",c:"Workflows",d:"Declare dependencies and parallel DAG branches.",b:["stable"]},
 {n:"when",c:"Workflows",d:"Run a step only when an expression is true.",b:["stable"]},
 {n:"on_failure",c:"Workflows",d:"Choose fail, skip or continue on failure.",b:["stable"]},
 {n:"manual",c:"Triggers",d:"Run a job on demand.",b:["stable"]},
 {n:"schedule",c:"Triggers",d:"Run on a cron schedule.",b:["stable"]},
 {n:"webhook",c:"Triggers",d:"Run when a webhook fires.",b:["stable"]},
 {n:"retry",c:"Policies",d:"Retry a failed step with fixed or exponential backoff.",b:["stable"]}];
var CATS=["Sources","Destinations","Transforms","Workflows","Triggers","Policies"];
var CATCOLOR={Sources:"#14b8a6",Destinations:"#22c55e",Transforms:"#8b5cf6",Workflows:"#f59e0b",Triggers:"#3b82f6",Policies:"#94a3b8"};
var STATUS=[["stable","Stable"],["beta","Beta"]];
var CAPS=[["batch","Batch"],["pushdown","Pushdown"]];
var BADGE={stable:["ok","Stable"],beta:["beta","Beta"],deprecated:["dep","Deprecated"],batch:["","Batch"],streaming:["","Streaming"],pushdown:["ac","Pushdown"]};
var INTENTS=[
 {q:"Read a CSV then filter rows",els:["csv","filter"],href:"/playground?intent=csv-filter"},
 {q:"Write to PostgreSQL with upsert",els:["postgresql","mode: upsert"],href:"/playground?intent=postgres-upsert"},
 {q:"Join two sources on a key",els:["join","right","on"],href:"/playground?intent=join"},
 {q:"Aggregate then sort the result",els:["aggregate","sort"],href:"/playground?intent=aggregate-sort"},
 {q:"Run two jobs in parallel",els:["depends_on","DAG"],href:"/playground?intent=parallel-jobs"},
 {q:"Schedule a job every morning",els:["schedule","cron"],href:"/playground?intent=schedule"},
 {q:"Retry a step on failure",els:["retry","backoff"],href:"/playground?intent=retry"},
 {q:"Clean and deduplicate messy data",els:["clean","deduplicate"],href:"/playground?intent=clean"},
 {q:"Reshape long data to wide",els:["pivot"],href:"/playground?intent=pivot"}];

var state={mode:"groups",q:"",cats:{},statuses:{},caps:{},closed:{}};
function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
/* Every catalogue card is now backed by a complete Guide workshop. */
var ROUTE_CATEGORY={Sources:"sources",Destinations:"destinations",Transforms:"transforms",Workflows:"workflows",Triggers:"triggers",Policies:"policies"};
function cardHref(e){return "/guide/"+ROUTE_CATEGORY[e.c]+"/"+e.n;}

function cardHTML(e){
  var badges=e.b.map(function(k){var m=BADGE[k];return m?"<span class='b "+m[0]+"'>"+m[1]+"</span>":"";}).join("");
  var href=cardHref(e);
  var inner="<div class='card-h'><span class='cname'>"+e.n+
    "</span><span class='ctag'><span class='dot' style='background:"+CATCOLOR[e.c]+"'></span>"+e.c+"</span></div>"+
    "<p class='cdesc'>"+esc(e.d)+"</p><div class='cbadges'>"+badges+
    "</div>";
  return "<a class='card' href='"+href+"' data-n='"+e.n+"' data-c='"+e.c+"'>"+inner+"</a>";
}
function match(e){
  if(Object.keys(state.cats).length&&!state.cats[e.c])return false;
  var statuses=Object.keys(state.statuses);
  if(statuses.length&&!statuses.some(function(k){return e.b.indexOf(k)>=0;}))return false;
  var caps=Object.keys(state.caps);
  if(caps.length&&!caps.some(function(k){return e.b.indexOf(k)>=0;}))return false;
  if(state.q){var q=state.q.toLowerCase();if((e.n+" "+e.d+" "+e.c).toLowerCase().indexOf(q)<0)return false;}
  return true;
}
function syncUrl(){
  var p=new URLSearchParams();if(state.mode!=="groups")p.set("view",state.mode);if(state.q)p.set("q",state.q);
  var cats=Object.keys(state.cats),statuses=Object.keys(state.statuses),caps=Object.keys(state.caps);
  if(cats.length)p.set("category",cats.join(","));if(statuses.length)p.set("status",statuses.join(","));if(caps.length)p.set("capability",caps.join(","));
  try{history.replaceState(null,"",location.pathname+(p.toString()?"?"+p.toString():""));}catch(_){}
}
function bindGroups(){
  document.querySelectorAll(".grouphead").forEach(function(h){h.onclick=function(){
    var cat=h.dataset.group,g=h.closest(".group"),closed=g.classList.toggle("collapsed");state.closed[cat]=closed;
    h.setAttribute("aria-expanded",String(!closed));
  };});
}
function render(){
  var host=$("catalog"),list=EL.filter(match);
  if(state.mode==="intent"){
    var q=state.q.toLowerCase();
    var its=INTENTS.filter(function(it){return !q||(it.q+" "+it.els.join(" ")).toLowerCase().indexOf(q)>=0;});
    host.innerHTML=its.length?"<div class='intentlist'>"+its.map(function(it){
      return "<a class='intentrow' href='"+it.href+"'><span class='q'>“"+esc(it.q)+"”</span><span class='els'>"+
        it.els.map(function(x){return "<span class='el'>"+x+"</span>";}).join("")+"</span><span class='intentgo'>Open in Playground →</span></a>";}).join("")+"</div>"
      :"<div class='empty'>No intent matches “"+esc(state.q)+"”.</div>";
    $("count").textContent=its.length+" intent"+(its.length===1?"":"s");
    syncUrl();
    return;
  }
  if(!list.length){host.innerHTML="<div class='empty'>No element matches your filters.</div>";$("count").textContent="0 elements";syncUrl();return;}
  var html="";
  if(state.mode==="groups"){
    CATS.forEach(function(cat){var g=list.filter(function(e){return e.c===cat;});if(!g.length)return;
      var closed=!!state.closed[cat];
      html+="<section class='group"+(closed?" collapsed":"")+"'><button class='grouphead' data-group='"+cat+"' aria-expanded='"+(!closed)+"'><span class='dot' style='background:"+CATCOLOR[cat]+"'></span>"+cat+" · "+g.length+"<span class='groupchev' aria-hidden='true'>⌄</span></button><div class='grid'>"+g.map(cardHTML).join("")+"</div></section>";});
  }else{
    var sorted=list.slice().sort(function(a,b){return a.n<b.n?-1:a.n>b.n?1:0;});
    var letter="";
    sorted.forEach(function(e){var l=e.n[0].toUpperCase();if(l!==letter){letter=l;html+="</div><div class='azletter'>"+letter+"</div><div class='grid'>";}html+=cardHTML(e);});
    html="<div class='grid'>"+html+"</div>";html=html.replace(/^<div class='grid'><\/div>/,"");
  }
  host.innerHTML=html;
  $("count").textContent=list.length+" element"+(list.length===1?"":"s");
  bindGroups();syncUrl();
}
function renderChips(){
  $("catFilters").innerHTML=CATS.map(function(c){return "<button type='button' class='fchip"+(state.cats[c]?" on":"")+"' data-cat='"+c+"' aria-pressed='"+!!state.cats[c]+"'>"+c+"</button>";}).join("");
  $("statusFilters").innerHTML=STATUS.map(function(c){return "<button type='button' class='fchip"+(state.statuses[c[0]]?" on":"")+"' data-status='"+c[0]+"' aria-pressed='"+!!state.statuses[c[0]]+"'>"+c[1]+"</button>";}).join("");
  $("capFilters").innerHTML=CAPS.map(function(c){return "<button type='button' class='fchip"+(state.caps[c[0]]?" on":"")+"' data-cap='"+c[0]+"' aria-pressed='"+!!state.caps[c[0]]+"'>"+c[1]+"</button>";}).join("");
  document.querySelectorAll('[data-cat]').forEach(function(el){el.onclick=function(){var c=el.dataset.cat;
    if(state.cats[c]){delete state.cats[c];el.classList.remove('on');}else{state.cats[c]=1;el.classList.add('on');}el.setAttribute("aria-pressed",String(!!state.cats[c]));render();};});
  document.querySelectorAll('[data-status]').forEach(function(el){el.onclick=function(){var c=el.dataset.status;
    if(state.statuses[c]){delete state.statuses[c];el.classList.remove('on');}else{state.statuses[c]=1;el.classList.add('on');}el.setAttribute("aria-pressed",String(!!state.statuses[c]));render();};});
  document.querySelectorAll('[data-cap]').forEach(function(el){el.onclick=function(){var c=el.dataset.cap;
    if(state.caps[c]){delete state.caps[c];el.classList.remove('on');}else{state.caps[c]=1;el.classList.add('on');}el.setAttribute("aria-pressed",String(!!state.caps[c]));render();};});
  $("intentChips").innerHTML=INTENTS.slice(0,4).map(function(it){return "<button type='button' class='ichip'><span class='a'>›</span> "+esc(it.q)+"</button>";}).join("");
  document.querySelectorAll('.ichip').forEach(function(el,i){el.onclick=function(){
    setMode('intent');$("search").value=INTENTS[i].q;state.q=INTENTS[i].q;render();$("search").focus();};});
}
function setMode(m){state.mode=m;document.querySelectorAll('.modes button').forEach(function(b){var on=b.dataset.mode===m;b.classList.toggle('on',on);b.setAttribute("aria-pressed",String(on));});
  document.querySelectorAll(".filtergroup").forEach(function(g){g.style.display=m==="intent"?"none":"";});}
document.querySelectorAll('.modes button').forEach(function(b){b.onclick=function(){setMode(b.dataset.mode);render();};});
$("search").addEventListener('input',function(){state.q=this.value;render();});
document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$("search").focus();}});
$("themeBtn").onclick=function(){var h=document.documentElement,next=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',next);localStorage.setItem("hydra-theme",next);};
function loadState(){
  var p=new URLSearchParams(location.search),view=p.get("view");if(["groups","az","intent"].indexOf(view)>=0)state.mode=view;
  state.q=p.get("q")||"";$("search").value=state.q;
  (p.get("category")||"").split(",").filter(Boolean).forEach(function(x){if(CATS.indexOf(x)>=0)state.cats[x]=1;});
  (p.get("status")||"").split(",").filter(Boolean).forEach(function(x){if(STATUS.some(function(s){return s[0]===x;}))state.statuses[x]=1;});
  (p.get("capability")||"").split(",").filter(Boolean).forEach(function(x){if(CAPS.some(function(s){return s[0]===x;}))state.caps[x]=1;});
  if(innerWidth<=720)CATS.slice(1).forEach(function(c){state.closed[c]=true;});
}
var savedTheme=localStorage.getItem("hydra-theme");if(savedTheme)document.documentElement.setAttribute("data-theme",savedTheme);
$("searchKey").textContent=/Mac|iPhone|iPad/.test(navigator.platform)?"⌘K":"Ctrl K";
loadState();setMode(state.mode);renderChips();render();
