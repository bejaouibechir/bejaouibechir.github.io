(function(){
  var $=function(id){return document.getElementById(id)};
  var SOURCES={src_input:1,src_orders:1}, DESTS={dest_output:1,dest_archive:1};
  var selF=$("selFrom"), selT=$("selTo");
  function row(state,text){return '<div class="vrow"><span class="vdot '+state+'" aria-hidden="true"></span><span>'+text+'</span></div>'}
  function render(){
    var f=selF.value, t=selT.value;
    $("codeFrom").textContent=f; $("codeTo").textContent=t;
    $("nFrom").querySelector("b").textContent=f;
    $("nTo").querySelector("b").textContent=t;
    var okF=!!SOURCES[f], okT=!!DESTS[t], dir=okF&&okT;
    var html="";
    html+=row(okF?"ok":"err", okF?"from resolves to a declared source":"from: no source named "+f+" in sources.yaml");
    if(okT) html+=row("ok","to resolves to a declared destination");
    else if(SOURCES[t]) html+=row("err","to: "+t+" is a source, not a destination");
    else html+=row("err","to: no destination named "+t+" in destinations.yaml");
    html+=row(dir?"ok":"warn", dir?"direction is source → destination":"direction cannot be checked until both ends resolve");
    $("verdict").innerHTML=html;
    $("nFrom").className="gnode"+(okF?"":" bad");
    $("nTo").className="gnode"+(okT?"":" bad");
    var st=$("status");
    if(dir){st.className="status ok";st.textContent="✓ Manifest resolves"}
    else{st.className="status err";st.textContent="✕ Manifest does not resolve — the run stops before reading any data"}
  }
  selF.addEventListener("change",render); selT.addEventListener("change",render);
  $("resetBtn").addEventListener("click",function(){selF.value="src_input";selT.value="dest_output";render()});
  render();
})();
