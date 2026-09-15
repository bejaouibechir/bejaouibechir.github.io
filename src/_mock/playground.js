var ORDERS=[
 {order_id:1001,customer_id:"C-01",amount:45,status:"paid"},{order_id:1002,customer_id:"C-02",amount:120,status:"paid"},
 {order_id:1003,customer_id:"C-01",amount:300,status:"refunded"},{order_id:1004,customer_id:"C-03",amount:89,status:"paid"},
 {order_id:1005,customer_id:"C-02",amount:250,status:"pending"},{order_id:1006,customer_id:"C-04",amount:170,status:"paid"},
 {order_id:1007,customer_id:"C-05",amount:60,status:"paid"},{order_id:1008,customer_id:"C-03",amount:420,status:"paid"},
 {order_id:1009,customer_id:"C-01",amount:15,status:"refunded"},{order_id:1010,customer_id:"C-04",amount:210,status:"pending"},
 {order_id:1011,customer_id:"C-02",amount:95,status:"paid"},{order_id:1012,customer_id:"C-05",amount:330,status:"paid"},
 {order_id:1013,customer_id:"C-03",amount:78,status:"refunded"},{order_id:1014,customer_id:"C-01",amount:145,status:"pending"}];
var COLS=["order_id","customer_id","amount","status"];
var lastN=0;
function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function tbl(el,rows,cols){el.innerHTML=rows.length?
  "<tr>"+cols.map(function(c){return "<th>"+c+"</th>";}).join("")+"</tr>"+
  rows.map(function(r){return "<tr>"+cols.map(function(c){return "<td>"+esc(r[c])+"</td>";}).join("")+"</tr>";}).join("")
  :"<tr><td style='color:var(--text-mut)'>—</td></tr>";}

/* per-source sample data (for hover/double-click preview) */
var SRC_DATA={
 orders:{cols:COLS,rows:ORDERS},
 products:{cols:["product_id","name","category","price"],rows:[
  {product_id:"P-01",name:"Mug",category:"home",price:12},{product_id:"P-02",name:"Tee",category:"apparel",price:24},
  {product_id:"P-03",name:"Cap",category:"apparel",price:18},{product_id:"P-04",name:"Bottle",category:"home",price:22},
  {product_id:"P-05",name:"Hoodie",category:"apparel",price:48},{product_id:"P-06",name:"Notebook",category:"office",price:9},
  {product_id:"P-07",name:"Pen set",category:"office",price:14},{product_id:"P-08",name:"Lamp",category:"home",price:39},
  {product_id:"P-09",name:"Socks",category:"apparel",price:8},{product_id:"P-10",name:"Desk pad",category:"office",price:27},
  {product_id:"P-11",name:"Poster",category:"home",price:16},{product_id:"P-12",name:"Sticker",category:"office",price:4}]},
 events:{cols:["event_id","user","type","ts"],rows:[
  {event_id:"e01",user:"C-01",type:"view",ts:"10:01"},{event_id:"e02",user:"C-02",type:"buy",ts:"10:04"},
  {event_id:"e03",user:"C-01",type:"buy",ts:"10:09"},{event_id:"e04",user:"C-03",type:"view",ts:"10:12"},
  {event_id:"e05",user:"C-02",type:"cart",ts:"10:15"},{event_id:"e06",user:"C-04",type:"view",ts:"10:19"},
  {event_id:"e07",user:"C-01",type:"cart",ts:"10:22"},{event_id:"e08",user:"C-05",type:"buy",ts:"10:26"},
  {event_id:"e09",user:"C-03",type:"buy",ts:"10:30"},{event_id:"e10",user:"C-02",type:"view",ts:"10:33"},
  {event_id:"e11",user:"C-04",type:"cart",ts:"10:37"},{event_id:"e12",user:"C-05",type:"view",ts:"10:41"}]},
 warehouse:{cols:["id","region","revenue","updated_at"],rows:[
  {id:1,region:"EU",revenue:8200,updated_at:"07-24"},{id:2,region:"US",revenue:14100,updated_at:"07-24"},
  {id:3,region:"APAC",revenue:5300,updated_at:"07-23"},{id:4,region:"EU",revenue:6700,updated_at:"07-22"},
  {id:5,region:"US",revenue:9800,updated_at:"07-24"},{id:6,region:"APAC",revenue:4100,updated_at:"07-21"},
  {id:7,region:"LATAM",revenue:3600,updated_at:"07-20"},{id:8,region:"EU",revenue:11200,updated_at:"07-24"},
  {id:9,region:"US",revenue:15400,updated_at:"07-23"},{id:10,region:"APAC",revenue:6900,updated_at:"07-22"},
  {id:11,region:"LATAM",revenue:2800,updated_at:"07-19"},{id:12,region:"EU",revenue:7300,updated_at:"07-24"}]},
 billing:{cols:["invoice_id","customer","amount","paid"],rows:[
  {invoice_id:"INV-01",customer:"C-01",amount:120,paid:"yes"},{invoice_id:"INV-02",customer:"C-02",amount:250,paid:"no"},
  {invoice_id:"INV-03",customer:"C-01",amount:300,paid:"yes"},{invoice_id:"INV-04",customer:"C-03",amount:89,paid:"no"},
  {invoice_id:"INV-05",customer:"C-02",amount:170,paid:"yes"},{invoice_id:"INV-06",customer:"C-04",amount:60,paid:"no"},
  {invoice_id:"INV-07",customer:"C-05",amount:420,paid:"yes"},{invoice_id:"INV-08",customer:"C-03",amount:210,paid:"yes"},
  {invoice_id:"INV-09",customer:"C-01",amount:95,paid:"no"},{invoice_id:"INV-10",customer:"C-04",amount:330,paid:"yes"},
  {invoice_id:"INV-11",customer:"C-02",amount:145,paid:"no"},{invoice_id:"INV-12",customer:"C-05",amount:78,paid:"yes"}]},
 catalog:{cols:["_id","sku","tags","stock"],rows:[
  {_id:"a01",sku:"SKU-01",tags:"[new,hot]",stock:42},{_id:"a02",sku:"SKU-02",tags:"[sale]",stock:7},
  {_id:"a03",sku:"SKU-03",tags:"[new]",stock:0},{_id:"a04",sku:"SKU-04",tags:"[clearance]",stock:120},
  {_id:"a05",sku:"SKU-05",tags:"[hot]",stock:15},{_id:"a06",sku:"SKU-06",tags:"[new,sale]",stock:3},
  {_id:"a07",sku:"SKU-07",tags:"[]",stock:58},{_id:"a08",sku:"SKU-08",tags:"[hot]",stock:9},
  {_id:"a09",sku:"SKU-09",tags:"[sale]",stock:0},{_id:"a10",sku:"SKU-10",tags:"[new]",stock:33},
  {_id:"a11",sku:"SKU-11",tags:"[clearance]",stock:6},{_id:"a12",sku:"SKU-12",tags:"[hot,new]",stock:21}]},
 crm:{cols:["contact_id","company","country","tier"],rows:[
  {contact_id:"K-01",company:"Acme",country:"FR",tier:"gold"},{contact_id:"K-02",company:"Globex",country:"US",tier:"silver"},
  {contact_id:"K-03",company:"Initech",country:"FR",tier:"bronze"},{contact_id:"K-04",company:"Umbrella",country:"UK",tier:"gold"},
  {contact_id:"K-05",company:"Hooli",country:"US",tier:"gold"},{contact_id:"K-06",company:"Stark",country:"FR",tier:"silver"},
  {contact_id:"K-07",company:"Wayne",country:"UK",tier:"bronze"},{contact_id:"K-08",company:"Wonka",country:"DE",tier:"silver"},
  {contact_id:"K-09",company:"Cyberdyne",country:"US",tier:"gold"},{contact_id:"K-10",company:"Soylent",country:"DE",tier:"bronze"},
  {contact_id:"K-11",company:"Tyrell",country:"FR",tier:"gold"},{contact_id:"K-12",company:"Oscorp",country:"UK",tier:"silver"}]}};

/* source catalog */
var CATALOG=[
 {g:"Files",k:"file",items:[["orders","csv"],["products","json"],["events","parquet"]]},
 {g:"Databases",k:"db",items:[["warehouse","postgresql"],["billing","mysql"],["catalog","mongodb"]]},
 {g:"APIs",k:"api",items:[["crm","web_api"]]}];
var activeSrc="orders";
var activeSourceType="csv";
var activeSourceKind="file";
var acItems=[],acIndex=0,acRange={from:0,to:0};
function yamlValueHtml(v){
  var out="",last=0,re=/(["'][^"']*["']|\b(?:true|false|null)\b|\b\d+(?:\.\d+)?\b|>=|<=|==|!=|>|<|[\[\]{},])/g,m;
  while((m=re.exec(v))){
    out+=esc(v.slice(last,m.index));var x=m[0],cl=/^["']/.test(x)?"yt-string":/^(true|false|null)$/.test(x)?"yt-bool":/^\d/.test(x)?"yt-number":/^[\[\]{},]$/.test(x)?"yt-punc":"yt-op";
    out+="<span class='"+cl+"'>"+esc(x)+"</span>";last=m.index+x.length;
  }
  return out+esc(v.slice(last));
}
function yamlLineHtml(line){
  var ci=line.indexOf("#"),code=ci<0?line:line.slice(0,ci),comment=ci<0?"":line.slice(ci),m=code.match(/^(\s*(?:-\s*)?)([\w-]+)(:)(.*)$/);
  var html=m?esc(m[1])+"<span class='yt-key'>"+esc(m[2])+"</span><span class='yt-punc'>:</span>"+yamlValueHtml(m[4]):yamlValueHtml(code);
  return html+(comment?"<span class='yt-comment'>"+esc(comment)+"</span>":"");
}
function updateYamlEditor(){
  var ta=$("fTransform"),lines=ta.value.split("\n");
  $("yamlHighlight").innerHTML=lines.map(yamlLineHtml).join("\n")+"\n";
  $("yamlGutter").innerHTML=lines.map(function(_,i){return "<div>"+(i+1)+"</div>";}).join("");
  var schema=SRC_DATA[activeSrc]||SRC_DATA.orders;
  $("editorSource").textContent=activeSrc+" · "+schema.cols.length+" source columns";
  syncYamlScroll();
}
function syncYamlScroll(){
  var ta=$("fTransform");$("yamlHighlight").scrollTop=ta.scrollTop;$("yamlHighlight").scrollLeft=ta.scrollLeft;$("yamlGutter").scrollTop=ta.scrollTop;
}
function completionContext(){
  var ta=$("fTransform"),pos=ta.selectionStart,before=ta.value.slice(0,pos),line=before.slice(before.lastIndexOf("\n")+1),word=(line.match(/[\w-]*$/)||[""])[0],items=[],kind="key",from=pos-word.length;
  var data=SRC_DATA[activeSrc]||SRC_DATA.orders,cols=data.cols,em;
  if((em=line.match(/\bexpr:\s*([\w-]+)\s+(>=|<=|==|!=|>|<)\s+([^ ]*)$/))){
    kind="value";word=em[3];from=pos-word.length;
    var vals=[];data.rows.forEach(function(r){var v=r[em[1]];if(v!==undefined&&vals.indexOf(v)<0)vals.push(v);});
    items=vals.slice(0,8).map(function(v){var label=typeof v==="number"?String(v):'"'+String(v)+'"';return {label:label,kind:"VAL",detail:"value observed in "+activeSrc+"."+em[1]};});
  }else if((em=line.match(/\bexpr:\s*([\w-]+)\s+([!<>=]*)$/))){
    kind="operator";word=em[2];from=pos-word.length;
    var opDefs=colType(activeSrc,em[1])==="text"
      ?[["==","equals · recommended for text"],["!=","not equal"],[">","alphabetically after"],["<","alphabetically before"]]
      :[[">","greater than"],[">=","greater than or equal"],["<","less than"],["<=","less than or equal"],["==","equals"],["!=","not equal"]];
    items=opDefs.map(function(x){return {label:x[0],kind:"OP",detail:x[1]};});
  }else if(/\b(?:expr|by|col|columns|subset):[^#]*[\w-]*$/.test(line)){
    kind="column";items=cols.map(function(c){return {label:c,kind:"COL",detail:colType(activeSrc,c)+" column from "+activeSrc};});
  }else if(/\bfunc:\s*[\w-]*$/.test(line)){
    kind="function";items=["sum","count","avg","min","max"].map(function(x){return {label:x,kind:"FN",detail:"aggregate function"};});
  }else if(/\bascending:\s*[\w-]*$/.test(line)){
    kind="boolean";items=["true","false"].map(function(x){return {label:x,kind:"VAL",detail:x==="true"?"ascending order":"descending order"};});
  }else if(/^\s*-\s*[\w-]*$/.test(line)){
    kind="transformation";
    var indent=(line.match(/^\s*/)||[""])[0],pad=indent+"    ";
    items=[
      {label:"filter",kind:"STEP",detail:"Keep rows matching an expression",insert:"filter:\n"+pad+"expr: |"},
      {label:"aggregate",kind:"STEP",detail:"Group rows and calculate metrics",insert:"aggregate:\n"+pad+"by: [|]\n"+pad+"agg:\n"+pad+"  result: { func: sum, col: amount }"},
      {label:"sort",kind:"STEP",detail:"Order rows by one or more columns",insert:"sort:\n"+pad+"by: [|]\n"+pad+"ascending: true"},
      {label:"select",kind:"STEP",detail:"Keep selected columns",insert:"select:\n"+pad+"columns: [|]"},
      {label:"deduplicate",kind:"STEP",detail:"Remove duplicate rows",insert:"deduplicate:\n"+pad+"columns: [|]"}
    ];
  }else{
    items=[
      {label:"transformations",kind:"ROOT",detail:"Transformation document root"},
      {label:"steps",kind:"KEY",detail:"Ordered list of transformations"},
      {label:"expr",kind:"KEY",detail:"Boolean filter expression"},
      {label:"by",kind:"KEY",detail:"Columns used for grouping or sorting"},
      {label:"agg",kind:"KEY",detail:"Named aggregate calculations"},
      {label:"columns",kind:"KEY",detail:"List of source columns"},
      {label:"ascending",kind:"KEY",detail:"Sort direction: true or false"}
    ];
  }
  var filtered=items.filter(function(x){return !word||x.label.toLowerCase().indexOf(word.toLowerCase())===0;});
  return {items:filtered,from:from,to:pos,auto:kind!=="key",title:kind==="column"?"Columns from "+activeSrc:kind==="value"?"Values from "+activeSrc:kind+" suggestions"};
}
function closeAutocomplete(){$("acPanel").classList.remove("open");acItems=[];}
function showAutocomplete(force){
  var ctx=completionContext();if(!ctx.items.length||(!force&&ctx.to===ctx.from&&!ctx.auto)){closeAutocomplete();return;}
  acItems=ctx.items;acIndex=0;acRange={from:ctx.from,to:ctx.to};
  $("acPanel").innerHTML="<div class='ac-title'>"+esc(ctx.title)+"</div>"+acItems.map(function(x,i){return "<button type='button' class='ac-item"+(i===0?" on":"")+"' role='option' aria-selected='"+(i===0)+"' data-i='"+i+"'><span class='ac-kind'>"+x.kind+"</span><span class='ac-name'>"+esc(x.label)+"</span><span class='ac-detail'>"+esc(x.detail)+"</span></button>";}).join("");
  $("acPanel").classList.add("open");
  document.querySelectorAll("#acPanel .ac-item").forEach(function(b){b.onmousedown=function(e){e.preventDefault();applyCompletion(+b.dataset.i);};});
}
function moveAutocomplete(step){
  if(!acItems.length)return;acIndex=(acIndex+step+acItems.length)%acItems.length;
  document.querySelectorAll("#acPanel .ac-item").forEach(function(b,i){b.classList.toggle("on",i===acIndex);b.setAttribute("aria-selected",String(i===acIndex));});
  var on=$("acPanel").querySelector(".ac-item.on");if(on)on.scrollIntoView({block:"nearest"});
}
function applyCompletion(i){
  var item=acItems[i],ta=$("fTransform");if(!item)return;var ins=item.insert||item.label,mark=ins.indexOf("|");if(mark>=0)ins=ins.slice(0,mark)+ins.slice(mark+1);
  ta.setRangeText(ins,acRange.from,acRange.to,"end");if(mark>=0)ta.setSelectionRange(acRange.from+mark,acRange.from+mark);
  closeAutocomplete();onTransformChanged();ta.focus();
}
function onTransformChanged(){
  updateYamlEditor();validate();markStale("Transformations changed — run to update");scheduleYamlHistory();
}
var yamlHistory=[],yamlHistoryIndex=-1,yamlHistoryTimer=null;
function pushYamlHistory(){
  clearTimeout(yamlHistoryTimer);var v=$("fTransform").value;
  if(yamlHistory[yamlHistoryIndex]===v){updateHistoryActions();return;}
  yamlHistory=yamlHistory.slice(0,yamlHistoryIndex+1);yamlHistory.push(v);
  if(yamlHistory.length>60)yamlHistory.shift();yamlHistoryIndex=yamlHistory.length-1;updateHistoryActions();
}
function scheduleYamlHistory(){clearTimeout(yamlHistoryTimer);yamlHistoryTimer=setTimeout(pushYamlHistory,280);}
function resetYamlHistory(){clearTimeout(yamlHistoryTimer);yamlHistory=[$("fTransform").value];yamlHistoryIndex=0;updateHistoryActions();}
function applyHistory(index){
  if(index<0||index>=yamlHistory.length)return;yamlHistoryIndex=index;$("fTransform").value=yamlHistory[index];
  updateYamlEditor();validate();markStale("Transformations changed — run to update");updateHistoryActions();$("fTransform").focus();
}
function yamlUndo(){clearTimeout(yamlHistoryTimer);if(yamlHistory[yamlHistoryIndex]!==$("fTransform").value)pushYamlHistory();if(yamlHistoryIndex>0)applyHistory(yamlHistoryIndex-1);}
function yamlRedo(){clearTimeout(yamlHistoryTimer);if(yamlHistoryIndex<yamlHistory.length-1)applyHistory(yamlHistoryIndex+1);}
function updateHistoryActions(){
  var u=document.querySelector('[data-action="undo"]'),r=document.querySelector('[data-action="redo"]');if(!u||!r)return;
  u.disabled=yamlHistoryIndex<=0;r.disabled=yamlHistoryIndex>=yamlHistory.length-1;
}
function formatYamlValue(){
  var ta=$("fTransform"),v=ta.value.replace(/\t/g,"  ").split("\n").map(function(line){
    return line.replace(/\s+$/,"").replace(/:\s{2,}\{/g,": {").replace(/,\s{2,}/g,", ");
  }).join("\n").replace(/\n{3,}/g,"\n\n").trim();
  var structure=validateYamlStructure(v);
  if(!structure.ok){
    validate();var invalidMsg=$("validationMsg");invalidMsg.className="validation-msg err";
    invalidMsg.textContent="Cannot format invalid YAML — line "+structure.line+": "+structure.error+".";ta.focus();return false;
  }
  ta.value=v;updateYamlEditor();validate();markStale("YAML formatted — run to update");pushYamlHistory();ta.focus();
  return true;
}
function fixYaml(){
  var ta=$("fTransform"),v=ta.value.replace(/\t/g,"  ").replace(/<>/g,"!=")
    .replace(/^(\s*)order:\s*desc\s*$/gm,"$1ascending: false")
    .replace(/^(\s*)order:\s*asc\s*$/gm,"$1ascending: true");
  var cols=(SRC_DATA[activeSrc]||SRC_DATA.orders).cols;
  cols.forEach(function(c){if(colType(activeSrc,c)==="text"){var re=new RegExp("(expr:\\s*"+c+"\\s*)[<>](?!=)","g");v=v.replace(re,"$1==");}});
  if(!/^\s*transformations:/m.test(v))v="transformations:\n  steps:\n"+v.split("\n").map(function(x){return "    "+x;}).join("\n");
  ta.value=v;updateYamlEditor();
  if(!formatYamlValue()){var check=validateYamlStructure(ta.value),bad=$("validationMsg");bad.className="validation-msg err";bad.textContent="Automatic fix could not repair the YAML structure — line "+check.line+": "+check.error+".";return;}
  var ok=validate(),msg=$("validationMsg");
  if(ok){msg.className="validation-msg ok";msg.textContent="Fixes applied — document is valid.";}
}
function validateDocument(){
  var ok=validate(),msg=$("validationMsg");
  if(ok){var n=parseSteps($("fTransform").value).length;msg.className="validation-msg ok";msg.textContent="Document valid — "+n+" transformation step"+(n===1?"":"s")+".";}
}
function renderCatalog(){
  var h="";CATALOG.forEach(function(grp){h+="<div class='srcgroup'><h5>"+grp.g+"</h5>";
    grp.items.forEach(function(it){var on=it[0]===activeSrc?" on":"";
      h+="<div class='sitem"+on+"' data-src='"+it[0]+"' data-type='"+it[1]+"' data-kind='"+grp.k+"' title='Double-click to preview "+it[0]+" data'>"+
        "<span class='si "+grp.k+"'>"+it[1].slice(0,3).toUpperCase()+"</span><span class='snm'>"+it[0]+"</span><span class='sty'>"+it[1]+"</span></div>";});
    h+="</div>";});
  h+="<div><div class='preview-head'><div class='dcap' id='inCap'>Input preview · orders</div><button class='preview-all' id='previewAll' type='button'>View all</button></div><table class='mini' id='srcPreview'></table></div>";
  $("srcCatalog").innerHTML=h;
  document.querySelectorAll('.sitem').forEach(function(el){
    el.onclick=function(){selectSource(el.dataset.src,el.dataset.type,el.dataset.kind);};
    el.ondblclick=function(){openModal(el.dataset.src,el.dataset.type);};
  });
  $("previewAll").onclick=function(){openModal(activeSrc,activeSourceType);};
  updatePreview(activeSrc);
}
function selectSource(name,type,kind,opts){
  opts=opts||{};
  activeSrc=name;activeSourceType=type;activeSourceKind=kind;
  document.querySelectorAll('.sitem').forEach(function(x){x.classList.toggle('on',x.dataset.src===name);});
  var target=kind==='db'?(type==="mongodb"?"collection: "+name:"table: "+name):kind==='api'?"table: /"+name:"table: ./data/"+name+"."+type;
  var connection=kind==='file'?"{}":kind==='api'?"{ base_url: https://api.example.com }":"{ profile: playground_demo }";
  $("fSources").value="sources:\n  "+name+":\n    type: "+type+"\n    connection: "+connection+"\n    extract:\n      "+target+"\n      batch_size: 100";
  var d=DEST_BY_SRC[name]||DEST_BY_SRC.orders;
  $("fPipeline").value='version: "1.0"\npipeline:\n  name: '+name+'_pipeline\n  from: '+name+'\n  to: '+d.name+'\n  transformations: transformations';
  applyDest(d);
  updatePreview(name);
  renderExamples();
  updateYamlEditor();

  if(opts.keepDsl){validate();markStale("Source changed — run the pipeline");return;}

  /* le DSL doit parler des colonnes de CETTE source, sinon on charge son exemple */
  var swapped=null;
  if(!validate()&&CASES[name]&&CASES[name].length){
    swapped=CASES[name][0];
    $("fTransform").value=swapped[1];
    updateYamlEditor();resetYamlHistory();
  }
  run();                                   /* sources, DSL et résultat alignés */
  if(swapped){
    var msg=$("validationMsg");
    msg.className="validation-msg warn";
    msg.textContent='Loaded the "'+swapped[0]+'" example — the previous steps used columns that '+name+' does not have ('+srcCols().join(', ')+').';
  }
}
function updatePreview(name){var d=SRC_DATA[name]||SRC_DATA.orders;
  $("inCap").textContent="Input preview · "+name+" (5 of "+d.rows.length+")";
  tbl($("srcPreview"),d.rows.slice(0,5),d.cols.slice(0,3));}
function openModal(name,type){var d=SRC_DATA[name]||SRC_DATA.orders;
  $("modalTitle").innerHTML="<span class='si "+(CATALOG.reduce(function(a,g){g.items.forEach(function(i){if(i[0]===name)a=g.k;});return a;},'file'))+"' style='width:26px;height:22px'>"+(type||'').slice(0,3).toUpperCase()+"</span> "+name+" <span style='color:var(--text-mut);font-weight:400;font-size:12px'>"+(type||'')+" · "+d.rows.length+" rows</span>";
  tbl($("modalTable"),d.rows,d.cols);$("modal").classList.add('open');document.querySelector(".modal-box").focus();}
function closeModal(){$("modal").classList.remove('open');}
$("modalX").onclick=closeModal;
$("modal").onclick=function(e){if(e.target===this)closeModal();};
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;if($("modal").classList.contains("open"))closeModal();else if($("chatWrap").classList.contains("open"))closeChat();});

/* examples: dropdown, 5-10 cases PER source */
var SRC_META={orders:["csv","file"],products:["json","file"],events:["parquet","file"],warehouse:["postgresql","db"],billing:["mysql","db"],catalog:["mongodb","db"],crm:["web_api","api"]};
function TF(){return "transformations:\n  steps:\n"+[].slice.call(arguments).join("\n");}
function F(e){return "    - filter:\n        expr: "+e;}
function AG(by,out,fn,col){return "    - aggregate:\n        by: ["+by+"]\n        agg:\n          "+out+": { func: "+fn+", col: "+col+" }";}
function SO(by,o){return "    - sort:\n        by: ["+by+"]\n        ascending: "+(o==="desc"?"false":"true");}
function SEL(c){return "    - select:\n        columns: ["+c+"]";}
function DE(c){return "    - deduplicate:\n        columns: ["+c+"]";}
var CASES={
 orders:[
  ["Total revenue by status",TF(F("amount > 0"),AG("status","total","sum","amount"),SO("total","desc"))],
  ["High-value orders only",TF(F("amount > 100"))],
  ["Revenue by customer",TF(F("status == 'paid'"),AG("customer_id","revenue","sum","amount"),SO("revenue","desc"))],
  ["Order count by status",TF(AG("status","orders","count","amount"),SO("orders","desc"))],
  ["Refunded orders",TF(F("status == 'refunded'"))],
  ["Avg order value by customer",TF(AG("customer_id","avg_amt","avg","amount"),SO("avg_amt","desc"))]],
 products:[
  ["Catalog cleanup",TF(SEL("product_id, name, price"),DE("product_id"),SO("price","desc"))],
  ["Revenue by category",TF(AG("category","total","sum","price"),SO("total","desc"))],
  ["Premium products (price > 20)",TF(F("price > 20"))],
  ["Cheapest first",TF(SO("price","asc"))],
  ["Count per category",TF(AG("category","n","count","price"))]],
 events:[
  ["Buys only",TF(F("type == 'buy'"))],
  ["Events per user",TF(AG("user","n","count","event_id"),SO("n","desc"))],
  ["Events per type",TF(AG("type","n","count","event_id"))],
  ["Dedup by user",TF(DE("user"))],
  ["Most recent first",TF(SO("ts","desc"))]],
 warehouse:[
  ["Revenue by region",TF(AG("region","total","sum","revenue"),SO("total","desc"))],
  ["Top regions (revenue > 6000)",TF(F("revenue > 6000"))],
  ["Max revenue per region",TF(AG("region","max_rev","max","revenue"))],
  ["Sort by revenue",TF(SO("revenue","desc"))],
  ["Count per region",TF(AG("region","n","count","id"))]],
 billing:[
  ["Unpaid invoices",TF(F("paid == 'no'"))],
  ["Amount by customer",TF(AG("customer","total","sum","amount"),SO("total","desc"))],
  ["Paid only",TF(F("paid == 'yes'"))],
  ["Invoice count by customer",TF(AG("customer","n","count","invoice_id"))],
  ["Largest invoices",TF(SO("amount","desc"))]],
 catalog:[
  ["Low stock (stock < 10)",TF(F("stock < 10"))],
  ["Stock by sku",TF(SO("stock","desc"))],
  ["Dedup by sku",TF(DE("sku"))],
  ["In-stock only",TF(F("stock > 0"))],
  ["Total stock by sku",TF(AG("sku","total","sum","stock"))]],
 crm:[
  ["French contacts",TF(F("country == 'FR'"))],
  ["Gold tier",TF(F("tier == 'gold'"))],
  ["Contacts by country",TF(AG("country","n","count","contact_id"),SO("n","desc"))],
  ["Dedup by company",TF(DE("company"))],
  ["Contacts by tier",TF(AG("tier","n","count","contact_id"))]]};
function renderExamples(){
  var srcs=activeSrc?[activeSrc]:Object.keys(CASES);
  var h="<option value=''>"+(activeSrc?"Load a "+activeSrc+" example…":"Load an example…")+"</option>";
  srcs.forEach(function(src){var m=SRC_META[src];
    h+="<optgroup label='"+src+" · "+m[0]+"'>";
    CASES[src].forEach(function(c,i){h+="<option value='"+src+"|"+i+"'>"+c[0]+"</option>";});
    h+="</optgroup>";});
  $("exSel").innerHTML=h;
  $("exSel").onchange=function(){if(!this.value)return;var p=this.value.split("|"),src=p[0],i=+p[1],m=SRC_META[src];
    selectSource(src,m[0],m[1],{keepDsl:true});$("fTransform").value=CASES[src][i][1];updateYamlEditor();pushYamlHistory();validate();run();};}

/* destinations: varied per example + guided preset picker */
var DEST_BY_SRC={
 orders:{name:"orders_out",type:"csv",loc:"./out/orders.csv",mode:"replace"},
 products:{name:"catalog_clean",type:"json",loc:"./out/products.json",mode:"replace"},
 events:{name:"events_daily",type:"parquet",loc:"./out/events.parquet",mode:"append"},
 warehouse:{name:"region_rollup",type:"postgresql",loc:"analytics.region_rollup",mode:"upsert",key:["region"]},
 billing:{name:"ar_ledger",type:"mysql",loc:"finance.ar_ledger",mode:"upsert",key:["invoice_id"]},
 catalog:{name:"catalog_docs",type:"mongodb",loc:"shop.catalog",mode:"replace"},
 crm:{name:"crm_sync",type:"web_api",loc:"contacts",mode:"append"}};
var DEST_ORDER=["csv","json","parquet","postgresql","mysql","mongodb","web_api"];
var DEST_PRESETS={
 csv:{label:"CSV file",loc:"./out/result.csv"},json:{label:"JSON file",loc:"./out/result.json"},
 parquet:{label:"Parquet file",loc:"./out/result.parquet"},postgresql:{label:"PostgreSQL",loc:"analytics.result"},
 mysql:{label:"MySQL",loc:"analytics.result"},mongodb:{label:"MongoDB",loc:"shop.result"},
 web_api:{label:"Web API",loc:"out"}};
var DEST_CAPS={csv:["append","replace"],json:["append","replace"],parquet:["append","replace"],
 postgresql:["append","replace","upsert"],mysql:["append","replace","upsert"],
 mongodb:["append","replace","upsert"],web_api:["append","replace"]};
var ALL_MODES=["append","replace","upsert"];
function renderDestSel(){
  $("destSel").innerHTML=DEST_ORDER.map(function(t){return "<option value='"+t+"'>"+DEST_PRESETS[t].label+"</option>";}).join("");
  $("destSel").onchange=function(){renderModeSel(this.value);applyDest({name:"out",type:this.value,loc:DEST_PRESETS[this.value].loc,mode:$("modeSel").value});};
  $("modeSel").onchange=function(){var t=$("destSel").value;applyDest({name:"out",type:t,loc:DEST_PRESETS[t].loc,mode:this.value});};}
function renderModeSel(type){var caps=DEST_CAPS[type]||["replace"];
  $("modeSel").innerHTML=ALL_MODES.map(function(m){var ok=caps.indexOf(m)>=0;return "<option value='"+m+"'"+(ok?"":" disabled")+">"+m+(ok?"":" — unsupported by "+type)+"</option>";}).join("");
  if(caps.indexOf($("modeSel").value)<0)$("modeSel").value=caps[0];}
function applyDest(spec){
  var tableKey=spec.type==="mongodb"?"collection":"table";
  var connection=/csv|json|parquet/.test(spec.type)?"{}":spec.type==="web_api"?"{ base_url: https://api.example.com }":"{ profile: playground_demo }";
  var keyLine=spec.mode==="upsert"?"\n      key: ["+((spec.key&&spec.key.length)?spec.key:["id"]).join(", ")+"]":"";
  $("fDest").value="destinations:\n  "+spec.name+":\n    type: "+spec.type+"\n    connection: "+connection+"\n    load:\n      "+tableKey+": "+spec.loc+"\n      mode: "+spec.mode+keyLine;
  $("fPipeline").value=$("fPipeline").value.replace(/(\n  to: )[^\n]*/,"$1"+spec.name);
  if($("destSel")){$("destSel").value=spec.type;renderModeSel(spec.type);var caps=DEST_CAPS[spec.type]||[];$("modeSel").value=caps.indexOf(spec.mode)>=0?spec.mode:(caps[0]||spec.mode);}
  parseDest();renderFlow();}
/* destinations live */
function parseDest(){var t=$("fDest").value;
  var type=(t.match(/type:\s*([\w-]+)/)||[])[1]||"csv";var mode=(t.match(/mode:\s*(\w+)/)||[])[1]||"";
  var name=(t.match(/^\s{2}([\w-]+):/m)||[])[1]||"out";var loc=(t.match(/(?:table|collection):\s*(\S+)/)||[])[1]||"";
  var kind=/csv|json|parquet/.test(type)?"file":/postgres|mysql|maria|mongo/.test(type)?"db":"api";
  var supported=DEST_CAPS[type]||[];
  var caps="";ALL_MODES.forEach(function(m){var sup=supported.indexOf(m)>=0;caps+="<span class='cap"+(m===mode?" hi":sup?"":" off")+"' title='"+(sup?"supported":"not supported by "+type)+"'>"+m+"</span>";});
  var hasKey=/key:\s*\[[^\]]+\]/.test(t);
  var hint=mode==="upsert"&&!hasKey?"<div class='dcap' style='margin-top:6px;color:var(--err)'>✗ upsert requires a key column</div>":mode==="upsert"?"<div class='dcap' style='margin-top:6px;color:var(--ok)'>✓ upsert key configured</div>":"";
  $("dstCard").innerHTML="<div class='conn'><span class='ic "+kind+"'>"+type.slice(0,3).toUpperCase()+"</span><div><div class='nm'>"+name+"</div><div class='ty'>"+type+(loc?" · "+loc.split('/').pop():"")+"</div></div></div><div class='caps'>"+caps+"</div>"+hint;}

/* intellisense */
var OPS={filter:"Keep rows matching an expression",select:"Keep only some columns",sort:"Order rows",deduplicate:"Drop duplicate rows",aggregate:"Group and summarize"};
var SNIP={};
/* colonnes de la source active — les extraits ne doivent jamais citer une colonne absente */
function srcCols(){return (SRC_DATA[activeSrc]||SRC_DATA.orders).cols.slice();}
function pickCol(kind){
  var cs=srcCols(),src=activeSrc||'orders';
  for(var i=0;i<cs.length;i++)if(colType(src,cs[i])===kind)return cs[i];
  return cs[0];}
function snipFor(op){
  var num=pickCol('number'),txt=pickCol('text'),first=srcCols()[0];
  return {
    filter:"\n    - filter:\n        expr: "+num+" > 0",
    select:"\n    - select:\n        columns: ["+srcCols().slice(0,2).join(", ")+"]",
    sort:"\n    - sort:\n        by: ["+num+"]\n        ascending: false",
    deduplicate:"\n    - deduplicate:\n        columns: ["+first+"]",
    aggregate:"\n    - aggregate:\n        by: ["+txt+"]\n        agg:\n          total: { func: sum, col: "+num+" }"
  }[op]||"";}
function stripYamlComment(line){
  var quote=null;for(var i=0;i<line.length;i++){var c=line[i];if((c==="'"||c==='"\"')&&line[i-1]!=="\\"){quote=quote===c?null:quote||c;}if(c==="#"&&!quote)return line.slice(0,i);}return line;
}
function validateYamlStructure(dsl){
  var lines=dsl.split(/\r?\n/),root=false,stepsRoot=false,currentStep=null,stepIndex=0,containers=[],seen={};
  for(var i=0;i<lines.length;i++){
    var raw=lines[i],lineNo=i+1;if(/\t/.test(raw))return {ok:false,line:lineNo,error:"tabs are not allowed for YAML indentation"};
    var code=stripYamlComment(raw).replace(/\s+$/,"");if(!code.trim())continue;
    var indent=(code.match(/^ */)||[""])[0].length,content=code.slice(indent);
    if(indent%2)return {ok:false,line:lineNo,error:"indentation must use an even number of spaces"};
    if(!root){
      if(indent!==0||content!=="transformations:")return {ok:false,line:lineNo,error:"expected 'transformations:' at the document root"};
      root=true;containers=[{indent:0,key:"transformations",path:"transformations"}];continue;
    }
    if(!stepsRoot){
      if(indent!==2||content!=="steps:")return {ok:false,line:lineNo,error:"expected '  steps:' below transformations"};
      stepsRoot=true;containers.push({indent:2,key:"steps",path:"transformations/steps"});continue;
    }
    var step=content.match(/^-\s+([A-Za-z_]\w*):\s*$/);
    if(step){
      if(indent!==4)return {ok:false,line:lineNo,error:"transformation steps must be indented 4 spaces"};
      currentStep=step[1];stepIndex++;containers=containers.slice(0,2);containers.push({indent:4,key:currentStep,path:"transformations/steps/"+stepIndex});continue;
    }
    if(/^-\s+/.test(content))return {ok:false,line:lineNo,error:"invalid transformation step syntax; expected '- filter:'"};
    var entry=content.match(/^([A-Za-z_]\w*):(?:\s*(.*))?$/);
    if(!entry)return {ok:false,line:lineNo,error:"invalid YAML mapping syntax"};
    if(indent<=4)return {ok:false,line:lineNo,error:indent===4?"each transformation must start with '- '":"properties must be nested below a transformation step"};
    if(!currentStep)return {ok:false,line:lineNo,error:"property found before the first transformation step"};
    if(indent<8)return {ok:false,line:lineNo,error:"step properties must be indented at least 8 spaces"};
    while(containers.length&&containers[containers.length-1].indent>=indent)containers.pop();
    var parent=containers[containers.length-1];
    if(indent>8&&(!parent||parent.indent<8))return {ok:false,line:lineNo,error:"unexpected indentation; no parent mapping exists at this level"};
    var key=entry[1],value=(entry[2]||"").trim(),parentPath=parent?parent.path:"step",seenKey=parentPath+"|"+indent+"|"+key;
    if(seen[seenKey])return {ok:false,line:lineNo,error:"duplicate key '"+key+"' in the same mapping"};
    seen[seenKey]=true;
    if(value&&/:$/.test(value)&&!/^(['\"]).*\1$/.test(value))return {ok:false,line:lineNo,error:"unexpected ':' at the end of the value for '"+key+"'"};
    if((value.match(/\[/g)||[]).length!==(value.match(/\]/g)||[]).length)return {ok:false,line:lineNo,error:"unbalanced brackets in '"+key+"'"};
    if((value.match(/\{/g)||[]).length!==(value.match(/\}/g)||[]).length)return {ok:false,line:lineNo,error:"unbalanced braces in '"+key+"'"};
    if(key==="ascending"&&!/^(true|false)$/.test(value))return {ok:false,line:lineNo,error:"'ascending' must be true or false"};
    if(/^(expr|by|columns|subset|ascending|func|col)$/.test(key)&&!value)return {ok:false,line:lineNo,error:"missing value for '"+key+"'"};
    if(!value)containers.push({indent:indent,key:key,path:parentPath+"/"+key});
  }
  if(!root)return {ok:false,line:1,error:"document is empty"};
  if(!stepsRoot)return {ok:false,line:lines.length,error:"missing 'steps:' mapping"};
  if(!stepIndex)return {ok:false,line:lines.length,error:"at least one transformation step is required"};
  return {ok:true};
}
function parseSteps(dsl){
  var lines=dsl.split(/\r?\n/),steps=[],current=null;
  lines.forEach(function(line){
    var m=line.match(/^\s*-\s+([a-zA-Z_]\w*):\s*$/);
    if(m){current={op:m[1],raw:""};steps.push(current);}
    else if(current){current.raw+=line+"\n";}
  });
  steps.forEach(function(s){
    var b=s.raw,m;
    if(s.op==="filter"){m=b.match(/^\s*expr:\s*(.+)$/m);s.expr=m?m[1].trim():"";}
    if(s.op==="aggregate"){
      m=b.match(/^\s*by:\s*\[([^\]]*)\]/m);s.by=m?m[1].split(",").map(function(x){return x.trim();}).filter(Boolean):[];
      s.agg=[];var re=/^\s+(\w+):\s*\{\s*func:\s*(\w+),\s*col:\s*(\w+)\s*\}/gm,mm;while((mm=re.exec(b)))s.agg.push({out:mm[1],func:mm[2],col:mm[3]});
    }
    if(s.op==="sort"){m=b.match(/^\s*by:\s*\[([^\]]*)\]/m);s.by=m?m[1].split(",").map(function(x){return x.trim();}).filter(Boolean):[];var a=b.match(/^\s*ascending:\s*(true|false)/m);s.ascending=!a||a[1]==="true";}
    if(s.op==="select"||s.op==="deduplicate"){m=b.match(/^\s*columns:\s*\[([^\]]*)\]/m);s.columns=m?m[1].split(",").map(function(x){return x.trim();}).filter(Boolean):[];}
    delete s.raw;
  });
  return steps;
}
function colType(src,col){var r=(SRC_DATA[src]||SRC_DATA.orders).rows[0]||{};return typeof r[col]==='number'?'number':'text';}
function renderFlow(){
  var steps=parseSteps($("fTransform").value),dest=$("fDest").value;
  var dtype=(dest.match(/type:\s*([\w-]+)/)||[])[1]||"csv",mode=(dest.match(/mode:\s*(\w+)/)||[])[1]||"append",dname=(dest.match(/^\s{2}([\w-]+):/m)||[])[1]||"out";
  $("flowSource").textContent=activeSrc||"orders";
  $("flowSource").nextElementSibling.textContent=(activeSourceType||"csv").replace("_"," ")+" source";
  $("flowSteps").textContent=steps.length?steps.map(function(s){return s.op;}).join(" → "):"No transformations";
  $("flowStepCount").textContent=steps.length+" transformation"+(steps.length===1?"":"s");
  $("flowDest").textContent=dname;$("flowDestMeta").textContent=dtype.replace("_"," ")+" · "+mode;
}
function setRunState(kind,text){var s=$("runState");s.className="runstate "+kind;s.textContent=text;}
function markStale(text){if($("wrote").textContent){$("wrote").className="wrote";$("wrote").style.color="var(--warn)";$("wrote").textContent="⚠ Previous result is stale";}setRunState("stale",text||"Changes not run");}
function validate(){
  var dsl=$("fTransform").value,structure=validateYamlStructure(dsl),steps=parseSteps(dsl),src=(SRC_DATA[activeSrc]||SRC_DATA.orders),known=src.cols.slice(),prob=structure.ok?null:"line "+structure.line+": "+structure.error,warn=null;
  if(!prob&&!steps.length)prob="No valid transformation step found. Use '- filter:' rather than the internal op/params format.";
  if(!prob)steps.forEach(function(s){if(s.op==='aggregate'&&s.agg)s.agg.forEach(function(a){known.push(a.out);});});
  if(!prob)steps.forEach(function(s,i){
    if(!OPS[s.op]&&!prob)prob="step "+(i+1)+": unknown op '"+(s.op||"?")+"'";
    if(s.op==="filter"&&!s.expr&&!prob)prob="step "+(i+1)+": filter requires 'expr'";
    if(s.op==="sort"&&(!s.by||!s.by.length)&&!prob)prob="step "+(i+1)+": sort requires 'by'";
    if(s.op==="aggregate"&&(!s.by||!s.by.length||!s.agg||!s.agg.length)&&!prob)prob="step "+(i+1)+": aggregate requires 'by' and at least one 'agg' calculation";
    if((s.op==="select"||s.op==="deduplicate")&&(!s.columns||!s.columns.length)&&!prob)prob="step "+(i+1)+": "+s.op+" requires 'columns'";
    /* toute colonne citée doit exister dans la source — pas seulement dans les filtres */
    if(!prob){
      var refs=[];
      if(s.columns&&s.columns.length)s.columns.forEach(function(c){refs.push([c,"'"+s.op+"' columns"]);});
      if(s.by&&s.by.length)s.by.forEach(function(c){refs.push([c,"'"+s.op+"' by"]);});
      if(s.agg&&s.agg.length)s.agg.forEach(function(a){if(a.col)refs.push([a.col,"'"+s.op+"' col"]);});
      refs.forEach(function(r){
        if(!prob&&known.indexOf(r[0])<0)
          prob="step "+(i+1)+": unknown column '"+r[0]+"' in "+r[1]+" — "+(activeSrc||'orders')+" has "+known.join(", ");
      });
    }
    if(s.op==='filter'&&s.expr){s.expr.split(/\s+and\s+/i).forEach(function(cl){
      var m=cl.trim().match(/^([a-zA-Z_]\w*)\s*(>=|<=|==|!=|>|<)\s*(.+)$/);if(!m){if(!prob)prob="step "+(i+1)+": invalid filter expression";return;}
      var col=m[1],op=m[2];
      if(known.indexOf(col)<0){if(!prob)prob="unknown column '"+col+"'";return;}
      if(/^[<>]=?$/.test(op)&&colType(activeSrc||'orders',col)==='text'&&!warn)warn="'"+col+"' is text — did you mean "+col+" == …?  ( < >  compare alphabetically )";
    });}});
  var v=$("vstat");
  var msg=$("validationMsg");
  if(prob){v.className="vchip err";v.textContent="✗";v.title=prob;msg.className="validation-msg err";msg.textContent="Validation error — "+prob;}
  else if(warn){v.className="vchip warn";v.textContent="⚠";v.title=warn;msg.className="validation-msg warn";msg.textContent="Warning — "+warn;}
  else{v.className="vchip ok";v.textContent="✓";v.title="valid · "+steps.length+" steps";msg.className="validation-msg";msg.textContent="";}
  renderFlow();
  return !prob;}
function renderAddMenu(){$("addMenu").innerHTML=Object.keys(OPS).map(function(op){return "<button type='button' class='ai' role='menuitem' data-op='"+op+"'><div class='n'>"+op+"</div><div class='d'>"+OPS[op]+"</div></button>";}).join("");
  document.querySelectorAll('#addMenu .ai').forEach(function(a){a.onclick=function(){var op=a.dataset.op,ta=$("fTransform");ta.value=ta.value.replace(/\s*$/,"")+snipFor(op);$("addMenu").classList.remove('open');$("hAddStep").setAttribute("aria-expanded","false");onTransformChanged();};});}

/* run */
function aggregate(rows,by,specs){var g={};rows.forEach(function(r){var k=by.map(function(c){return r[c];}).join('|');(g[k]=g[k]||[]).push(r);});
  return Object.keys(g).map(function(k){var grp=g[k],o={};by.forEach(function(c,i){o[c]=k.split('|')[i];});
    specs.forEach(function(sp){var vals=grp.map(function(r){return Number(r[sp.col]);}),v;
      if(sp.func==='sum')v=vals.reduce(function(a,b){return a+b;},0);else if(sp.func==='count')v=grp.length;
      else if(sp.func==='avg')v=Math.round(vals.reduce(function(a,b){return a+b;},0)/grp.length);
      else if(sp.func==='min')v=Math.min.apply(null,vals);else if(sp.func==='max')v=Math.max.apply(null,vals);o[sp.out]=v;});return o;});}
function evalExpr(row,expr){var ok=true;expr.split(/\s+and\s+/i).forEach(function(cl){
  var m=cl.trim().match(/^([a-zA-Z_]\w*)\s*(>=|<=|==|!=|>|<)\s*(.+)$/);if(!m)return;
  var col=m[1],op=m[2],raw=m[3].trim().replace(/^['"]|['"]$/g,''),a=row[col],b=isNaN(Number(raw))?raw:Number(raw);
  var r={'>':a>b,'<':a<b,'>=':a>=b,'<=':a<=b,'==':a==b,'!=':a!=b}[op];if(!r)ok=false;});return ok;}
function run(){
  if(!validate()){setRunState("err","Validation failed");$("wrote").className="wrote";$("wrote").style.color="var(--err)";$("wrote").textContent="✗ Run blocked — previous preview is stale";$("cliOut").innerHTML="";cliPrint("$ hdrctl run pipeline.yaml");cliPrint("<span class='er'>✗ validation failed — fix transformations.yaml before running</span>");return;}
  setRunState("","Running…");
  var steps=parseSteps($("fTransform").value),rows=(SRC_DATA[activeSrc]||SRC_DATA.orders).rows.slice(),cols=(SRC_DATA[activeSrc]||SRC_DATA.orders).cols.slice(),log=["<span class='ok'>✓</span> source    "+activeSrc+" → "+rows.length+" rows"];
  steps.forEach(function(s){
    if(s.op==='filter'){rows=rows.filter(function(r){return evalExpr(r,s.expr);});log.push("<span class='ok'>✓</span> filter    "+esc(s.expr)+" → "+rows.length+" rows");}
    else if(s.op==='aggregate'){rows=aggregate(rows,s.by,s.agg);cols=s.by.concat(s.agg.map(function(a){return a.out;}));log.push("<span class='ok'>✓</span> aggregate by "+s.by.join(",")+" → "+rows.length+" groups");}
    else if(s.op==='sort'){var k=s.by[0],d=s.ascending?1:-1;rows.sort(function(a,b){return a[k]>b[k]?d:a[k]<b[k]?-d:0;});log.push("<span class='ok'>✓</span> sort      "+k+" "+(s.ascending?"asc":"desc"));}
    else if(s.op==='select'){cols=s.columns&&s.columns.length?s.columns:cols;log.push("<span class='ok'>✓</span> select    "+cols.join(", "));}
    else if(s.op==='deduplicate'){var dedupCols=s.columns&&s.columns.length?s.columns:cols,seen={},out=[];rows.forEach(function(r){var kk=JSON.stringify(dedupCols.map(function(c){return r[c];}));if(!seen[kk]){seen[kk]=1;out.push(r);}});rows=out;log.push("<span class='ok'>✓</span> deduplicate by "+dedupCols.join(", ")+" → "+rows.length+" rows");}
  });
  lastN=rows.length;tbl($("dstPreview"),rows,cols);$("wrote").className="wrote";$("wrote").style.color="";$("wrote").innerHTML="✓ wrote "+lastN+" rows";parseDest();
  cliOut.innerHTML="";cliPrint("<span class='cmd'>$ hdrctl run pipeline.yaml</span>");log.forEach(function(l){cliPrint(l);});
  cliPrint("<span class='ok'>✓</span> destination ← "+lastN+" rows   <span class='mut'>done in "+(3+steps.length)+" ms</span>");
  if(lastN===0)cliPrint("<span class='mut'># 0 rows — tip: text columns compare with ==  (e.g. type == 'view'), not &lt; &gt;</span>");
  setRunState("ok","Success · "+lastN+" rows");renderFlow();apiSend();
}

/* interactive CLI */
var CLI_CMDS=[["hdrctl run pipeline.yaml","execute the job"],["hdrctl validate","check the DSL"],["hdrctl test-connection orders","ping a source"],["hdrctl ls sources","list sources"],["hdrctl --help","show commands"],["clear","clear the screen"]];
var cliOut;
function cliPrint(html){cliOut.insertAdjacentHTML("beforeend",html+"\n");cliOut.scrollTop=cliOut.scrollHeight;}
function cliRun(cmd){cliPrint("<span class='cmd'>$ "+esc(cmd)+"</span>");var c=cmd.trim();
  if(!c)return;if(c==="clear"){cliOut.innerHTML="";return;}
  if(/^hdrctl\s+run/.test(c)){run();return;}
  if(/^hdrctl\s+validate/.test(c)){cliPrint(validate()?"<span class='ok'>✓ DSL is valid</span>":"<span class='er'>✗ see the assistant above</span>");return;}
  if(/^hdrctl\s+test-connection/.test(c)){cliPrint("<span class='ok'>✓</span> connection ok  <span class='mut'>(simulated)</span>");return;}
  if(/^hdrctl\s+ls\s+sources/.test(c)){cliPrint("orders(csv) products(json) events(parquet) warehouse(postgresql) billing(mysql) catalog(mongodb) crm(web_api)");return;}
  if(/--help|^help/.test(c)){CLI_CMDS.forEach(function(x){cliPrint("  <span class='cmd'>"+x[0]+"</span>  <span class='mut'>"+x[1]+"</span>");});return;}
  cliPrint("<span class='er'>command not found: "+esc(c)+"</span>  <span class='mut'>try: hdrctl --help</span>");}
function cliSuggest(){var v=$("cliIn").value.trim(),box=$("cliSugg");if(!v){box.innerHTML="";return;}
  var ms=CLI_CMDS.filter(function(x){return x[0].indexOf(v)===0&&x[0]!==v;}).slice(0,5);
  box.innerHTML=ms.map(function(x){return "<span class='s' data-c=\""+x[0]+"\"><b>"+esc(v)+"</b>"+esc(x[0].slice(v.length))+"</span>";}).join("");
  document.querySelectorAll('#cliSugg .s').forEach(function(s){s.onclick=function(){$("cliIn").value=s.dataset.c;$("cliIn").focus();cliSuggest();};});}

/* interactive API */
var API_BODIES={"/api/run":"# body: pipeline.yaml\nsource: orders\ntransform: transformations.yaml\ndestination: out"};
function apiHint(){var ep=$("apiEp").value;
  $("apiHint").textContent=ep==="/api/run"?"POST a pipeline, get a run_id back.":ep.indexOf("/api/status")===0?"GET the status of a run.":ep==="/api/workflows"?"GET the list of workflows.":ep==="/api/sources"?"GET the available sources.":"";
  $("apiBody").style.display=$("apiMethod").value==="POST"?"":"none";$("apiBody").value=API_BODIES[ep]||"";}
function apiSend(){var ep=$("apiEp").value,m=$("apiMethod").value,r;
  if(ep==="/api/run")r={run_id:"r_8f3a21",status:"success",rows_out:lastN,destination:"out"};
  else if(ep.indexOf("/api/status")===0)r={run_id:"r_8f3a21",status:"success",rows_out:lastN,started_at:"12:00:01",finished_at:"12:00:01"};
  else if(ep==="/api/workflows")r=[{name:"orders_by_status",steps:3,trigger:"manual"}];
  else if(ep==="/api/sources")r=["orders(csv)","products(json)","warehouse(postgresql)","crm(web_api)"];
  else r={error:"unknown endpoint"};
  $("apiResp").textContent=m+" "+ep+"\n\n200 OK\n"+JSON.stringify(r,null,2);}

/* wiring */
document.querySelectorAll('.btab').forEach(function(t){t.onclick=function(){document.querySelectorAll('.btab').forEach(function(x){x.classList.remove('on');x.setAttribute("aria-selected","false");});t.classList.add('on');t.setAttribute("aria-selected","true");
  var id=t.getAttribute('data-b');document.querySelectorAll('[data-bb]').forEach(function(b){b.style.display=b.getAttribute('data-bb')===id?'':'none';});};});
$("themeBtn").onclick=function(){var h=document.documentElement,next=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',next);localStorage.setItem("hydra-theme",next);};
$("hAddStep").onclick=function(e){e.stopPropagation();$("editorActions").classList.remove("open");$("editorActionsBtn").setAttribute("aria-expanded","false");var open=$("addMenu").classList.toggle('open');this.setAttribute("aria-expanded",String(open));};
$("editorActionsBtn").onclick=function(e){e.stopPropagation();pushYamlHistory();$("addMenu").classList.remove("open");$("hAddStep").setAttribute("aria-expanded","false");var open=$("editorActions").classList.toggle("open");this.setAttribute("aria-expanded",String(open));updateHistoryActions();};
document.addEventListener('click',function(){$("addMenu").classList.remove('open');$("hAddStep").setAttribute("aria-expanded","false");$("editorActions").classList.remove("open");$("editorActionsBtn").setAttribute("aria-expanded","false");$("editorContext").classList.remove("open");});
$("addMenu").onclick=function(e){e.stopPropagation();};
$("editorActions").onclick=function(e){e.stopPropagation();};
document.querySelectorAll("#editorActions [data-action]").forEach(function(b){b.onclick=function(){
  var a=b.dataset.action;if(a==="undo")yamlUndo();else if(a==="redo")yamlRedo();else if(a==="validate")validateDocument();else if(a==="fix")fixYaml();else if(a==="studio")alert("Mock: opening this job in Hydra Studio.");
  $("editorActions").classList.remove("open");$("editorActionsBtn").setAttribute("aria-expanded","false");
};});
$("fTransform").addEventListener("contextmenu",function(e){
  e.preventDefault();pushYamlHistory();closeAutocomplete();var m=$("editorContext"),w=220,h=214;
  m.style.left=Math.max(8,Math.min(e.clientX,innerWidth-w-8))+"px";m.style.top=Math.max(8,Math.min(e.clientY,innerHeight-h-8))+"px";m.classList.add("open");
});
function selectedOrLine(){
  var ta=$("fTransform"),a=ta.selectionStart,b=ta.selectionEnd;if(a!==b)return {text:ta.value.slice(a,b),from:a,to:b};
  var from=ta.value.lastIndexOf("\n",a-1)+1,to=ta.value.indexOf("\n",a);if(to<0)to=ta.value.length;return {text:ta.value.slice(from,to),from:from,to:to};
}
function writeClipboard(text){if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(text).catch(function(){});return Promise.resolve();}
document.querySelectorAll("#editorContext [data-context]").forEach(function(b){b.onclick=async function(e){
  e.stopPropagation();var a=b.dataset.context,ta=$("fTransform"),sel=selectedOrLine();
  if(a==="copy")await writeClipboard(sel.text);
  else if(a==="cut"){await writeClipboard(sel.text);ta.setRangeText("",sel.from,sel.to,"start");onTransformChanged();ta.focus();}
  else if(a==="paste"){try{var text=await navigator.clipboard.readText();ta.setRangeText(text,ta.selectionStart,ta.selectionEnd,"end");onTransformChanged();ta.focus();}catch(_){alert("Clipboard access is unavailable in this static mock.");}}
  else if(a==="format")formatYamlValue();
  else if(a==="suggest"){ta.focus();showAutocomplete(true);}
  $("editorContext").classList.remove("open");
};});
$("fTransform").addEventListener('input',function(){onTransformChanged();showAutocomplete(false);});
$("fTransform").addEventListener('scroll',syncYamlScroll);
$("fTransform").addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?yamlRedo():yamlUndo();return;}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();yamlRedo();return;}
  if((e.ctrlKey||e.metaKey)&&e.code==="Space"){e.preventDefault();showAutocomplete(true);return;}
  if($("acPanel").classList.contains("open")){
    if(e.key==="ArrowDown"){e.preventDefault();moveAutocomplete(1);}
    else if(e.key==="ArrowUp"){e.preventDefault();moveAutocomplete(-1);}
    else if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();applyCompletion(acIndex);}
    else if(e.key==="Escape"){e.preventDefault();closeAutocomplete();}
  }
});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){$("editorActions").classList.remove("open");$("editorActionsBtn").setAttribute("aria-expanded","false");$("editorContext").classList.remove("open");}});
$("fTransform").addEventListener('blur',function(){setTimeout(closeAutocomplete,120);});
$("fDest").addEventListener('input',parseDest);
$("runBtn").onclick=run;
$("cliIn").addEventListener('input',cliSuggest);
$("cliIn").addEventListener('keydown',function(e){if(e.key==='Enter'){cliRun(this.value);this.value="";cliSuggest();}});
$("apiEp").addEventListener('input',apiHint);$("apiMethod").addEventListener('change',apiHint);$("apiSend").onclick=apiSend;
$("shareBtn").onclick=function(){alert("Mock: shareable link to this job.");};
$("exportBtn").onclick=function(){alert("Mock: export the job folder.");};
$("studioBtn").onclick=function(){alert("Mock: Studio simulator — designed later.");};
document.querySelectorAll(".modebtn").forEach(function(b){b.onclick=function(){
  var guided=b.dataset.mode==="guided";$("stageWrap").classList.toggle("guided",guided);
  document.querySelectorAll(".modebtn").forEach(function(x){var on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-pressed",String(on));});
};});

document.querySelectorAll('.chev').forEach(function(c){c.onclick=function(){
  var t=$(c.dataset.target),hide=t.style.display!=='none';
  t.style.display=hide?'none':'';c.classList.toggle("collapsed",hide);c.querySelector(".chev-label").textContent=hide?"Show":"Hide";
  var label=c.parentElement.querySelector(".st").textContent.trim();c.setAttribute("aria-label",(hide?"Show ":"Hide ")+label);c.setAttribute("aria-expanded",String(!hide));};c.setAttribute("aria-expanded","true");});
/* chatbot (simulated) */
function setChat(open){
  $("chatWrap").classList.toggle("open",open);
  $("chatWrap").setAttribute("aria-hidden",String(!open));
  $("chatLauncher").setAttribute("aria-expanded",String(open));
  if(open)setTimeout(function(){$("chatIn").focus();},80);else $("chatLauncher").focus();
}
function closeChat(){setChat(false);}
$("chatLauncher").onclick=function(){setChat(!$("chatWrap").classList.contains("open"));};
$("chatClose").onclick=closeChat;
function currentChatOperation(){var steps=parseSteps($("fTransform").value);return steps.length?steps[0].op:undefined;}
function currentChatFiles(){return {"sources.yaml":$("fSources").value,"transformations.yaml":$("fTransform").value,"destinations.yaml":$("fDest").value,"pipeline.yaml":$("fPipeline").value};}
function botReply(q){
  if(!window.hydraChat)return {answer:"The local Hydra DSL engine is not ready. Reload the page once.",actions:[]};
  var msg=$("validationMsg"),errors=[];
  if(msg.classList.contains("err")&&msg.textContent)errors.push({message:msg.textContent,path:"transformations.yaml"});
  var response=window.hydraChat.answerHydraDsl({
    contractVersion:"1.0",requestId:"playground-"+Date.now(),locale:"en",question:q,assistanceLevel:"explanation",
    context:{hydraVersion:"1.2.0",dslVersion:"1.1",selectedOperation:currentChatOperation(),currentDsl:$("fTransform").value,currentFiles:currentChatFiles(),inputRows:(SRC_DATA[activeSrc]||SRC_DATA.orders).rows.slice(0,50),validationErrors:errors,executionMode:"local_simulation"}
  });
  return response;
}
function chatAdd(who,html){var d=document.createElement('div');d.className="msg "+who;
  d.innerHTML="<div class='av'>"+(who==='bot'?'Hy':'you')+"</div><div class='bub'>"+html+"</div>";
  $("chatMsgs").appendChild(d);$("chatMsgs").scrollTop=$("chatMsgs").scrollHeight;return d.querySelector(".bub");}
function chatAddResponse(response){
  var bubble=chatAdd('bot',esc(response.answer));
  if(response.actions&&response.actions.length){var resources=document.createElement("div");resources.className="chat-resources";
    var seen={};response.actions.slice(0,3).forEach(function(action){if(!action.href||seen[action.href])return;seen[action.href]=true;var link=document.createElement("a");link.href=action.href;link.textContent=action.label;resources.appendChild(link);});
    if(resources.children.length)bubble.appendChild(resources);}
}
function chatSend(q){q=(q||$("chatIn").value).trim();if(!q)return;chatAdd('user',esc(q));$("chatIn").value="";setTimeout(function(){try{chatAddResponse(botReply(q));}catch(error){console.error(error);chatAdd('bot',"I could not process that question locally.");}},120);}
var CHAT_Q=["How do I filter text columns?","filter vs join?","Which destinations support upsert?","How do I group and sum?"];
function renderChat(){$("chatSugg").innerHTML=CHAT_Q.map(function(q){return "<button class='q' type='button'>"+q+"</button>";}).join("");
  document.querySelectorAll('#chatSugg .q').forEach(function(el){el.onclick=function(){chatSend(el.textContent);};});
  chatAdd('bot',"Hi! Ask me anything about the Hydra DSL — sources, transformations, destinations.");}
$("chatSend").onclick=function(){chatSend();};
$("chatIn").addEventListener('keydown',function(e){if(e.key==='Enter')chatSend();});
/* comments (giscus-style, simulated) */
function bindReacts(scope){scope.querySelectorAll('.react').forEach(function(r){if(r.dataset.b)return;r.dataset.b="1";
  r.onclick=function(){var n=+r.getAttribute('data-n'),on=r.classList.toggle('on');n=on?n+1:n-1;r.setAttribute('data-n',n);r.querySelector('b').textContent=n;};});}
$("cmtBtn").onclick=function(){var t=$("cmtIn").value.trim();if(!t)return;var d=document.createElement('div');d.className="cmt";
  d.innerHTML="<div class='avatar' style='background:var(--bg-soft);color:var(--text-mut)'>you</div><div class='cmt-main'><div class='cmt-top'><span class='nm'>you</span><span class='tm'>just now</span></div><div class='cmt-body'>"+esc(t).replace(/`([^`]+)`/g,"<code>$1</code>")+"</div><div class='cmt-actions'><span class='react' data-n='0'>👍 <b>0</b></span></div></div>";
  $("cmtList").appendChild(d);bindReacts(d);$("cmtIn").value="";var c=$("cmtCount");c.textContent=+c.textContent+1;};
$("ghSignin").onclick=function(){alert("Mock: sign in with GitHub (giscus).");};
cliOut=$("cliOut");
var savedTheme=localStorage.getItem("hydra-theme");if(savedTheme)document.documentElement.setAttribute("data-theme",savedTheme);
renderCatalog();renderAddMenu();renderDestSel();selectSource("orders","csv","file");apiHint();validate();
cliPrint("<span class='mut'>Hydra CLI (simulated). This prompt is live — type a command and press Enter.</span>");
renderChat();bindReacts(document);
run();resetYamlHistory();

/* ---------------------------------------------------------------------------
   Poignee de redimensionnement du panneau Destinations.
   Fait varier --pgDestW sur .stage. Souris, tactile et clavier ; la largeur est
   memorisee pour la session, et un double-clic revient a la valeur par defaut.
--------------------------------------------------------------------------- */
(function(){
  var split = $("destSplit"); if(!split) return;
  var stage = document.getElementById("stageWrap"); if(!stage) return;
  var MIN = 190, MAX = 720, DEFAULT = 224, STEP = 24;

  function current(){
    var v = parseInt(getComputedStyle(stage).getPropertyValue("--pgDestW"), 10);
    return isNaN(v) ? DEFAULT : v;
  }
  function apply(w){
    w = Math.max(MIN, Math.min(MAX, Math.round(w)));
    stage.style.setProperty("--pgDestW", w + "px");
    split.setAttribute("aria-valuenow", String(w));
    try{ sessionStorage.setItem("hydra-pg-destw", String(w)); }catch(e){}
    return w;
  }

  var saved = null;
  try{ saved = sessionStorage.getItem("hydra-pg-destw"); }catch(e){}
  if(saved) apply(parseInt(saved, 10));

  split.setAttribute("aria-valuemin", String(MIN));
  split.setAttribute("aria-valuemax", String(MAX));
  split.setAttribute("aria-valuenow", String(current()));

  var startX = 0, startW = 0, pid = null;

  function onMove(e){ apply(startW + (startX - e.clientX)); }
  function onUp(){
    split.classList.remove("dragging");
    document.body.classList.remove("pg-resizing");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    if(pid !== null && split.releasePointerCapture){
      try{ split.releasePointerCapture(pid); }catch(e){}
    }
    pid = null;
  }

  split.addEventListener("pointerdown", function(e){
    e.preventDefault();
    startX = e.clientX; startW = current(); pid = e.pointerId;
    if(split.setPointerCapture){ try{ split.setPointerCapture(pid); }catch(err){} }
    split.classList.add("dragging");
    document.body.classList.add("pg-resizing");
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  split.addEventListener("dblclick", function(){ apply(DEFAULT); });

  split.addEventListener("keydown", function(e){
    if(e.key === "ArrowLeft"){ e.preventDefault(); apply(current() + STEP); }
    else if(e.key === "ArrowRight"){ e.preventDefault(); apply(current() - STEP); }
    else if(e.key === "Home"){ e.preventDefault(); apply(DEFAULT); }
  });
})();
