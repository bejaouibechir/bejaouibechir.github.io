(function(){
  var $=function(id){return document.getElementById(id)};
  var ENVV={dev:{DB_HOST:"localhost",DB_NAME:"hydra_dev",BATCH:"1000"},prod:{DB_HOST:"db.internal",DB_NAME:"hydra",BATCH:"10000"}};
  var K=function(t){return '<span class="c-key">'+t+'</span>'}, S=function(t){return '<span class="c-str">'+t+'</span>'};
  function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  function row(state,text){return '<div class="vrow"><span class="vdot '+state+'" aria-hidden="true"></span><span>'+text+'</span></div>'}
  var PH=/^\s*(\$\{(ENV|SECRET):[A-Za-z0-9_.-]+\}|\{\{\s*(param|env)\s*:\s*[A-Za-z0-9_.-]+\s*\}\})\s*$/;
  function render(){
    var pwd=$("pwd").value, env=$("selEnv").value, E=ENVV[env];
    var literal=pwd.length>0 && !PH.test(pwd);
    var L=[K("sources:"),"  "+K("src_db:"),"    "+K("type:")+" "+S("postgresql"),"    "+K("connection:"),
      "      "+K("host:")+" "+S("${ENV:DB_HOST}"),
      "      "+K("database:")+" "+S("${ENV:DB_NAME}"),
      "      "+K("password:")+" "+(literal?'<span class="c-bad">'+esc(pwd)+'</span>':S(esc(pwd))),
      "    "+K("extract:"),
      "      "+K("table:")+" "+S("{{ param:TABLE }}"),
      "      "+K("batch_size:")+" "+S("{{ env:BATCH }}")];
    $("yaml").innerHTML=L.join("\n");
    var rows=[["${ENV:DB_HOST}","environment · "+env,E.DB_HOST],
              ["${ENV:DB_NAME}","environment · "+env,E.DB_NAME],
              ["{{ param:TABLE }}","job parameter","orders"],
              ["{{ env:BATCH }}","environment · "+env,E.BATCH]];
    if(!literal&&pwd) rows.splice(2,0,[pwd, /SECRET/.test(pwd)?"secret store":"environment · "+env, /SECRET/.test(pwd)?"•••••••• never printed":"(resolved)"]);
    $("substRows").innerHTML=rows.map(function(r){
      return "<tr><td><code>"+esc(r[0])+"</code></td><td>"+esc(r[1])+"</td><td>"+esc(r[2])+"</td></tr>"}).join("");
    $("resCount").textContent=rows.length+" placeholders";
    var h="";
    h+=row("ok","${ENV:…} and ${SECRET:…} resolved by the secret resolver");
    h+=row("ok","{{ param:… }} is strict — a missing parameter stops the run");
    h+=row("warn","{{ env:… }} is non-strict — a missing variable is left as is");
    h+=literal?row("err","password holds a literal value — refused, use ${SECRET:NAME}")
              :row("ok","password references a secret, no value in clear");
    $("verdict").innerHTML=h;
    var st=$("status");
    if(literal){st.className="status err";st.textContent="✕ Secret in clear — blocking error"}
    else{st.className="status ok";st.textContent="✓ No value in clear"}
  }
  $("pwd").addEventListener("input",render);
  $("selEnv").addEventListener("change",render);
  $("resetBtn").addEventListener("click",function(){$("pwd").value="${SECRET:DB_PASSWORD}";$("selEnv").value="dev";render()});
  render();
})();
