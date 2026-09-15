const fs=require("fs"),path=require("path");
const D=process.argv[2];
let pass=0,fail=0;
function check(name,cond,got){ if(cond){pass++;console.log("  ok   "+name)} else {fail++;console.log("  FAIL "+name+"  ->  "+got)} }
function load(file,seed){
  for(const k of Object.keys(require.cache)) delete require.cache[k];
  const {store}=require("./domstub.cjs");
  for(const k of Object.keys(store)) delete store[k];
  const {El}=require("./domstub.cjs");
  Object.entries(seed||{}).forEach(([k,v])=>{store[k]=El(k);store[k].value=v});
  eval(fs.readFileSync(path.join(D,file),"utf8"));
  return store;
}
console.log("\n[C] dsl-pipeline");
let s=load("dsl-pipeline.js",{selFrom:"src_input",selTo:"dest_output"});
check("etat initial : resout", /Manifest resolves/.test(s.status.textContent), s.status.textContent);
s.selTo.value="src_input"; s.selTo.fire("change");
check("to = une source -> erreur", /is a source, not a destination/.test(s.verdict.innerHTML), s.status.textContent);
check("statut bloquant", /does not resolve/.test(s.status.textContent), s.status.textContent);
s.selFrom.value="src_typo"; s.selFrom.fire("change");
check("from inconnu signale", /no source named src_typo/.test(s.verdict.innerHTML), "");
s.resetBtn.fire("click");
check("reset revient a l'etat valide", /Manifest resolves/.test(s.status.textContent), s.status.textContent);

console.log("\n[B] dsl-sources");
s=load("dsl-sources.js",{selType:"csv"});
check("csv : bloc valide", /Block is valid$/.test(s.status.textContent), s.status.textContent);
check("csv : cles listees", /base_path/.test(s.yaml.innerHTML), "");
s.selType.value="parquet"; s.selType.fire("change");
check("parquet : dependance optionnelle affichee", /pyarrow/.test(s.verdict.innerHTML), "");
s.selType.value="postgresql"; s.selType.fire("change");
check("postgresql : schema present", /schema/.test(s.yaml.innerHTML), "");
check("postgresql : secret reference, pas de valeur", /SECRET:DB_PASSWORD/.test(s.yaml.innerHTML), "");
s.chkUnknown.checked=true; s.chkUnknown.fire("change");
check("cle non lue : signalee, pas tue", /sslmode is not read/.test(s.verdict.innerHTML), "");
s.selType.value="web_api"; s.selType.fire("change");
check("web_api : auth et pagination", /auth/.test(s.yaml.innerHTML)&&/pagination/.test(s.yaml.innerHTML), "");
check("visite : etape 1 sur 7 annoncee en clair", /Step 1 of 7/.test(s.tourCount.textContent), s.tourCount.textContent);
check("visite : le titre de l etape est affiche", /sources/.test(s.tourTitle.textContent), s.tourTitle.textContent);
check("visite : bulle remplie", /sources/.test(s.bubble.innerHTML), "");
check("visite : contexte detaille rempli", /pipeline/.test(s.tourContext.innerHTML), "");
check("visite : precedent desactive au depart", s.tourPrev.disabled === true, String(s.tourPrev.disabled));
s.tourNext.fire("click");
check("visite : suivant avance a l etape 2", /Step 2 of 7/.test(s.tourCount.textContent), s.tourCount.textContent);
check("visite : precedent reactive", s.tourPrev.disabled === false, String(s.tourPrev.disabled));
for (var i=0;i<8;i++) s.tourNext.fire("click");
check("visite : bornee a la derniere etape", /Step 7 of 7/.test(s.tourCount.textContent) && s.tourNext.disabled === true, s.tourCount.textContent);
check("visite : la fin est dite, pas devinee", /End of walkthrough/.test(s.tourNext.textContent), s.tourNext.textContent);
s.selType.value="mongodb"; s.selType.fire("change");
check("mongodb : port 27017", /27017/.test(s.yaml.innerHTML) && !/5432/.test(s.yaml.innerHTML), "");
s.selType.value="postgresql"; s.selType.fire("change");
check("postgresql : port 5432", /5432/.test(s.yaml.innerHTML), "");
s.selType.value="mysql"; s.selType.fire("change");
check("mysql : port 3306", /3306/.test(s.yaml.innerHTML), "");
check("lignes adressables pour la visite", /data-key="type"/.test(s.yaml.innerHTML), "");

console.log("\n[D] dsl-interpolation");
s=load("dsl-interpolation.js",{pwd:"${SECRET:DB_PASSWORD}",selEnv:"dev"});
check("etat initial : aucune valeur en clair", /No value in clear/.test(s.status.textContent), s.status.textContent);
check("4 formes resolues", /param:TABLE/.test(s.substRows.innerHTML)&&/env:BATCH/.test(s.substRows.innerHTML), "");
s.selEnv.value="prod"; s.selEnv.fire("change");
check("bascule prod change les valeurs", /db\.internal/.test(s.substRows.innerHTML), "");
s.pwd.value="hunter2pass"; s.pwd.fire("input");
check("secret en clair : erreur bloquante", /Secret in clear/.test(s.status.textContent), s.status.textContent);
check("secret en clair : signale dans le verdict", /literal value — refused/.test(s.verdict.innerHTML), "");
s.pwd.value="${SECRET:DB_PASSWORD}"; s.pwd.fire("input");
check("retour a un placeholder : ok", /No value in clear/.test(s.status.textContent), s.status.textContent);

console.log("\n[atelier] guide-csv — ingerer l export de ventes");
{
  s = load("guide-csv.js", {});
  check("etape 1 sur 9", /Step 1 of 9/.test(s.tourCount.textContent), s.tourCount.textContent);
  check("etape 1 : l export du jour", /sales_2025-03-04.csv/.test(s.fileName.textContent), s.fileName.textContent);
  var files = [];
  for (var i = 0; i < 8; i++) { s.tourNext.fire("click"); files.push(s.fileName.textContent); }
  check("les 4 fichiers du job sont parcourus",
        /sources.yaml/.test(files[0]) && /destinations.yaml/.test(files[1]) &&
        /pipeline.yaml/.test(files[2]) && /transformations.yaml/.test(files[3]), files.join(" | "));
  check("etape 7 : hdrctl test", /hdrctl test/.test(files[5]), files[5]);
  check("etape 8 : hdrctl run", /hdrctl run/.test(files[6]), files[6]);
  check("etape 9 : le fichier produit", /large_orders.csv/.test(files[7]), files[7]);
  check("chiffres reels : 7 lues, 3 ecrites", /7 rows read/.test(s.status.textContent) && /3 written/.test(s.status.textContent), s.status.textContent);
  check("fin de l atelier annoncee", /Done/.test(s.tourNext.textContent), s.tourNext.textContent);
  check("aucun etat d echec", !/status err/.test(s.status.className), s.status.className);
  s.resetBtn.fire("click");
  check("start over : retour a l etape 1", /Step 1 of 9/.test(s.tourCount.textContent), s.tourCount.textContent);
}

console.log("\n[transformations.yaml] dsl-transformations-yaml");
{
  s = load("dsl-transformations-yaml.js", { selCase: "two" });
  check("deux etapes : 6 lignes ecrites", /6 written/.test(s.status.textContent), s.status.textContent);
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selCase.value = "three"; s.selCase.fire("change");
  check("trois etapes : select en dernier", /selecting last is deliberate/.test(s.verdict.innerHTML), "");
  s.selCase.value = "short"; s.selCase.fire("change");
  check("forme courte : effet identique", /identical in effect/.test(s.verdict.innerHTML), "");
  s.selCase.value = "missing"; s.selCase.fire("change");
  check("fichier absent : 30 lignes recopiees", /30 written/.test(s.status.textContent), s.status.textContent);
  check("aucun etat d echec sur la page", !/status err/.test(s.status.className), s.status.className);
  check("aucun YAML souligne comme fautif", !/c-bad/.test(s.yaml.innerHTML), "");
  s.resetBtn.fire("click");
  check("reset : retour aux deux etapes", /6 written/.test(s.status.textContent), s.status.textContent);
}

console.log("\n[sources.yaml] dsl-sources-yaml");
{
  s = load("dsl-sources-yaml.js", { selCase: "one" });
  check("une source : le job tourne", /30 rows read/.test(s.status.textContent), s.status.textContent);
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selCase.value = "two"; s.selCase.fire("change");
  check("deux sources : la seconde n est jamais ouverte", /never opened/.test(s.verdict.innerHTML), "");
  s.selCase.value = "both"; s.selCase.fire("change");
  check("les deux referencees : deux connecteurs", /two connectors are built/.test(s.verdict.innerHTML), "");
  check("aucun etat d echec sur la page", !/status err/.test(s.status.className), s.status.className);
  check("aucun YAML souligne comme fautif", !/c-bad/.test(s.yaml.innerHTML), "");
  s.resetBtn.fire("click");
  check("reset : retour au cas nominal", /30 rows read/.test(s.status.textContent), s.status.textContent);
}

console.log("\n[version] dsl-version");
{
  s = load("dsl-version.js", { selVersion: "1.0" });
  check("exemple avec la ligne : valide", /which shape of the language/.test(s.verdict.innerHTML), "");
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selVersion.value = ""; s.selVersion.fire("change");
  check("exemple sans la ligne : valide aussi", /a valid manifest/.test(s.verdict.innerHTML), "");
  check("aucun etat d echec sur la page", !/status err/.test(s.status.className), s.status.className);
  check("aucun YAML souligne comme fautif", !/c-bad/.test(s.yaml.innerHTML), "");
  s.resetBtn.fire("click");
  check("reset : retour a 1.0", /"1.0"/.test(s.yaml.innerHTML), "");
}

console.log("\n[destinations.yaml] dsl-destinations-yaml");
{
  s = load("dsl-destinations-yaml.js", { selCase: "replace" });
  check("replace : 6 lignes ecrites", /6 written/.test(s.status.textContent), s.status.textContent);
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selCase.value = "append"; s.selCase.fire("change");
  check("append : conserve puis ajoute", /keeps existing rows/.test(s.verdict.innerHTML), "");
  s.selCase.value = "two"; s.selCase.fire("change");
  check("deux destinations : une seule selectionnee", /only that connector writes/.test(s.verdict.innerHTML), "");
  check("aucun etat d echec", !/status err/.test(s.status.className), s.status.className);
  s.resetBtn.fire("click");
  check("reset : retour a replace", /replace/.test(s.yaml.innerHTML), "");
}

console.log("\n[pipeline.yaml] dsl-pipeline-yaml");
{
  s = load("dsl-pipeline-yaml.js", { selCase: "canonical" });
  check("forme canonique : deux extremites resolues", /src_orders/.test(s.verdict.innerHTML) && /dest_big_orders/.test(s.verdict.innerHTML), "");
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selCase.value = "noversion"; s.selCase.fire("change");
  check("sans version : comportement identique", /optional version line changes nothing/.test(s.verdict.innerHTML), "");
  s.selCase.value = "flow"; s.selCase.fire("change");
  check("forme compacte : meme mapping", /same mapping/.test(s.verdict.innerHTML), "");
  check("aucun etat d echec", !/status err/.test(s.status.className), s.status.className);
  s.resetBtn.fire("click");
  check("reset : retour a la forme canonique", /pipeline/.test(s.yaml.innerHTML), "");
}

console.log("\n[workflow.yaml] dsl-workflow-yaml");
{
  s = load("dsl-workflow-yaml.js", { selCase: "sequence" });
  check("sequence : 2 steps termines", /2 of 2/.test(s.status.textContent), s.status.textContent);
  check("visite : 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  s.selCase.value = "fanout"; s.selCase.fire("change");
  check("fan-out : deux actions dans le groupe 2", /notify.*audit/.test(s.verdict.innerHTML), "");
  s.selCase.value = "scheduled"; s.selCase.fire("change");
  check("planifie : cron et job presents", /cron/.test(s.yaml.innerHTML) && /extract_csv/.test(s.yaml.innerHTML), "");
  check("aucun etat d echec", !/status err/.test(s.status.className), s.status.className);
  s.resetBtn.fire("click");
  check("reset : retour a la sequence", /notify/.test(s.yaml.innerHTML), "");
}

console.log("\n[generated elements] 21 pages");
{
  const generated = require("../src/data/dsl-generated-pages.json");
  for (const page of generated) {
    s = load(page.js, { selCase: page.defaultCase });
    check(page.key + " : YAML rendu", s.yaml.innerHTML.length > 20, s.yaml.innerHTML);
    check(page.key + " : statut correct", /status ok/.test(s.status.className), s.status.className);
    check(page.key + " : visite en 4 etapes", /Step 1 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
    s.tourNext.fire("click");
    check(page.key + " : visite avance", /Step 2 of 4/.test(s.tourCount.textContent), s.tourCount.textContent);
  }
}

console.log("\n[A] dsl (Rows) — branche sur le moteur");
{
  const engineSrc = fs.readFileSync(path.join(D, "..", "scripts", "dsl-engine.js"), "utf8");
  const m = { exports: {} };
  new Function("module", "exports", engineSrc)(m, m.exports);
  const DATA = JSON.stringify([
    {order_id:"O1001",amount:"13.50",status:"paid"},{order_id:"O1003",amount:"48.00",status:"pending"},
    {order_id:"O1005",amount:"29.00",status:"refunded"},{order_id:"O1007",amount:null,status:"pending"},
    {order_id:"O1012",amount:"72.00",status:"paid"},{order_id:"O1014",amount:"4.50",status:"paid"},
    {order_id:"O1019",amount:"79.80",status:"paid"},{order_id:"O1020",amount:"54.00",status:"paid"}]);
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  const { store, El } = require("./domstub.cjs");
  for (const k of Object.keys(store)) delete store[k];
  global.window.HydraEngine = m.exports;
  store.rowsData = El("rowsData"); store.rowsData.textContent = DATA;
  store.amount = El("amount"); store.amount.value = "20";
  eval(fs.readFileSync(path.join(D, "dsl.js"), "utf8"));
  const s = store;
  check("8 lignes rendues au chargement", (s.dataRows.innerHTML.match(/<tr/g) || []).length === 8, s.rowCount.textContent);
  check("montant vide affiche un tiret", /—/.test(s.dataRows.innerHTML), "");
  s.amount.value = "20"; s.runBtn.fire("click");
  // le moteur tourne dans un setTimeout
  var done = false;
  setTimeout(() => {
    check("seuil 20 : 5 lignes au-dessus de 20", /5 of 8 rows/.test(s.rowCount.textContent), s.rowCount.textContent);
    check("la ligne au montant vide est ecartee", /filtered/.test(s.dataRows.innerHTML), "");
    s.amount.value = "50"; s.runBtn.fire("click");
    setTimeout(() => {
      check("seuil 50 : 3 lignes conservees", /3 of 8 rows/.test(s.rowCount.textContent), s.rowCount.textContent);
      check("objectif atteint : retour affiche", s.feedback.classList.contains("show"), "");
      check("progression mise a jour", s.sidePercent.textContent === "6%", s.sidePercent.textContent);
      s.resetBtn.fire("click");
      check("reset : retour a 8 lignes", /8 input rows/.test(s.rowCount.textContent), s.rowCount.textContent);
      console.log("\n" + pass + " verifications passees, " + fail + " echouees");
      process.exit(fail ? 1 : 0);
    }, 500);
  }, 500);
}
