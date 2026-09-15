/* Bloc sources.<id>.connection — archétype B, avec visite guidée du manifeste.
   Chaque ligne du YAML est adressable par data-key : la visite s'y accroche. */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* clés et valeurs d'exemple réellement lues par chaque connecteur */
  var T = {
    csv:        { conn: ["base_path", "delimiter", "encoding", "quotechar"], ex: "table", val: "orders.csv",   opt: 0 },
    json:       { conn: ["file", "table"],                                   ex: "table", val: "orders.json",  opt: 0 },
    parquet:    { conn: ["file", "table"],                                   ex: "table", val: "orders.parquet", opt: "pyarrow" },
    mysql:      { conn: ["host", "port", "user", "password", "database"],    ex: "table", val: "orders",       opt: 0 },
    mariadb:    { conn: ["host", "port", "user", "password", "database"],    ex: "table", val: "orders",       opt: 0 },
    postgresql: { conn: ["host", "port", "user", "password", "database", "schema"], ex: "table", val: "orders", opt: 0 },
    postgres:   { conn: ["host", "port", "user", "password", "database", "schema"], ex: "table", val: "orders", opt: 0 },
    mongodb:    { conn: ["host", "port", "database", "collection"],          ex: "collection", val: "orders",  opt: "pymongo" },
    web_api:    { conn: ["base_url", "auth", "pagination"],                  ex: "table", val: "/v1/orders",   opt: "the web api extra" }
  };

  /* le port dépend du connecteur — une valeur générique serait une erreur */
  var PORT = { mysql: "3306", mariadb: "3306", postgresql: "5432", postgres: "5432", mongodb: "27017" };

  var SAMPLE = {
    base_path: '"data/"', delimiter: '","', encoding: '"utf-8"', quotechar: '"\\""',
    file: '"data/orders"', table: '"orders"',
    host: "${ENV:DB_HOST}", user: "${ENV:DB_USER}", password: "${SECRET:DB_PASSWORD}",
    database: "${ENV:DB_NAME}", schema: '"public"', collection: '"orders"',
    base_url: "${ENV:API_BASE_URL}"
  };

  var K = function (t) { return '<span class="c-key">' + t + "</span>"; };
  var S = function (t) { return '<span class="c-str">' + t + "</span>"; };
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function line(key, html) { return '<span class="yl" data-key="' + key + '">' + html + "</span>"; }
  function row(state, text) { return '<div class="vrow"><span class="vdot ' + state + '" aria-hidden="true"></span><span>' + text + "</span></div>"; }

  /* ─────────── visite guidée : une étape par élément de la grammaire ─────────── */
  var TOUR = [
    { key: "sources", title: "sources",
      bubble: "Every input the job can read is declared here.",
      context: "A job reads from exactly one of them — <code>pipeline.yaml</code> names which. Declaring several is useful for <code>join</code>, which pulls a second stream." },
    { key: "id", title: "the identifier",
      bubble: "You choose this name. It is what <code>pipeline.from</code> points to.",
      context: "The identifier is local to the job. Nothing outside depends on it, so it can be renamed freely — as long as every reference follows." },
    { key: "type", title: "type",
      bubble: "Which connector reads the data. Nine are registered.",
      context: "Three of them — parquet, mongodb, web_api — are registered only when their optional dependency is installed. A manifest naming them can load here and fail elsewhere." },
    { key: "connection", title: "connection",
      bubble: "Where the data lives, and how to reach it. Its shape follows the type.",
      context: "The parser accepts any mapping here; the connector decides what it reads. A key it does not know is ignored, never rejected — which is how a typo goes unnoticed." },
    { key: "conn-keys", title: "the connection keys",
      bubble: "These keys change with every type. Switch the selector and watch.",
      context: "Values shown are examples, never real credentials. A secret is a reference — never a literal, here or in a healthy repository." },
    { key: "extract", title: "extract",
      bubble: "What to read once connected: a table, a collection, a query, an endpoint.",
      context: "File connectors read a path, SQL connectors a table or a raw query, MongoDB a collection, the web API an endpoint. The key changes, the intent does not." },
    { key: "batch_size", title: "batch_size",
      bubble: "How many rows per round trip. Default 10000, minimum 1.",
      context: "It changes nothing to the result, only to memory and to the number of round trips. It is the first knob to turn when a job runs out of memory." }
  ];

  var step = 0;

  function render() {
    var t = $("selType").value || "csv", d = T[t] || T.csv, bad = $("chkUnknown").checked;

    var L = [];
    L.push(line("sources", K("sources:")));
    L.push(line("id", "  " + K("src_data:")));
    L.push(line("type", "    " + K("type:") + " " + S(t)));
    L.push(line("connection", "    " + K("connection:")));
    d.conn.forEach(function (k) {
      if (k === "auth") {
        L.push(line("conn-keys", "      " + K("auth:")));
        L.push(line("conn-keys", "        " + K("type:") + " " + S("bearer")));
        L.push(line("conn-keys", "        " + K("token:") + " " + S("${ENV:API_TOKEN}")));
        return;
      }
      if (k === "pagination") {
        L.push(line("conn-keys", "      " + K("pagination:")));
        L.push(line("conn-keys", "        " + K("strategy:") + " " + S("cursor")));
        L.push(line("conn-keys", "        " + K("page_size:") + " " + S("100")));
        return;
      }
      var v = k === "port" ? (PORT[t] || "0") : (SAMPLE[k] !== undefined ? SAMPLE[k] : '"…"');
      L.push(line("conn-keys", "      " + K(k + ":") + " " + S(esc(v))));
    });
    if (bad) L.push(line("conn-keys", '      <span class="c-bad">sslmode: require</span>'));
    L.push(line("extract", "    " + K("extract:")));
    L.push(line("extract", "      " + K(d.ex + ":") + " " + S('"' + d.val + '"')));
    L.push(line("batch_size", "      " + K("batch_size:") + " " + S("10000")));
    $("yaml").innerHTML = L.join("\n");

    var h = "";
    h += row("ok", "type: " + t + " is a registered connector");
    h += d.opt ? row("warn", "optional dependency — " + t + " is registered only if " + d.opt + " is installed")
               : row("ok", "no optional dependency, always registered");
    h += bad ? row("warn", "connection.sslmode is not read for type " + t + " — it is ignored, never rejected")
             : row("ok", "every connection key is read by " + t);
    h += row("ok", "extract." + d.ex + " designates what to read");
    h += row("ok", "batch_size 10000 is within range — minimum 1");
    h += /\$\{SECRET:|\$\{ENV:/.test($("yaml").textContent) ? row("ok", "secrets are referenced, no value in clear")
                                                           : row("ok", "no secret in this block");
    $("verdict").innerHTML = h;

    var st = $("status");
    if (bad || d.opt) { st.className = "status warn"; st.textContent = "⚠ Block is valid, with " + (bad && d.opt ? "2 warnings" : "1 warning"); }
    else { st.className = "status ok"; st.textContent = "✓ Block is valid"; }

    showStep(step);
  }

  /* ─────────── affichage d'une étape ─────────── */
  function showStep(i) {
    step = Math.max(0, Math.min(TOUR.length - 1, i));
    var s = TOUR[step];

    document.querySelectorAll(".yl").forEach(function (el) { el.classList.remove("lit"); });
    var targets = document.querySelectorAll('.yl[data-key="' + s.key + '"]');
    targets.forEach(function (el) { el.classList.add("lit"); });

    var bubble = $("bubble");
    bubble.innerHTML = "<b>" + s.title + "</b><span>" + s.bubble + "</span>";
    bubble.classList.add("show");
    if (targets.length && bubble.getBoundingClientRect) {
      var wrap = $("codewrap").getBoundingClientRect();
      var first = targets[0].getBoundingClientRect();
      var last = targets[targets.length - 1].getBoundingClientRect();
      var mid = (first.top + last.bottom) / 2 - wrap.top + $("codewrap").scrollTop;
      bubble.style.top = Math.max(8, mid - bubble.offsetHeight / 2) + "px";
    }

    $("tourContext").innerHTML = "<b>" + s.title + "</b><p>" + s.context + "</p>";
    $("tourCount").textContent = "Step " + (step + 1) + " of " + TOUR.length;
    $("tourTitle").textContent = s.title;
    $("tourPrev").disabled = step === 0;
    $("tourNext").disabled = step === TOUR.length - 1;
    $("tourNext").textContent = step === TOUR.length - 1 ? "End of walkthrough" : "Next \u203a";
  }

  /* ─────────── liaisons ─────────── */
  $("selType").addEventListener("change", render);
  $("chkUnknown").addEventListener("change", render);
  $("resetBtn").addEventListener("click", function () {
    $("selType").value = "csv"; $("chkUnknown").checked = false; step = 0; render();
  });
  $("tourPrev").addEventListener("click", function () { showStep(step - 1); });
  $("tourNext").addEventListener("click", function () { showStep(step + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === "ArrowLeft") showStep(step - 1);
    if (e.key === "ArrowRight") showStep(step + 1);
  });
  $("yaml").addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest(".yl") : null;
    if (!el) return;
    for (var i = 0; i < TOUR.length; i++) if (TOUR[i].key === el.dataset.key) { showStep(i); return; }
  });

  render();
})();
