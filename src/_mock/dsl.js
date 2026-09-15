/* Leçon « Rows » — archétype A.
   Le tableau de sortie est produit par le moteur du site (window.HydraEngine),
   dont la fidélité au moteur Python est vérifiée par scripts/test_engine.cjs. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var toast = function (m) { if (window.dslToast) window.dslToast(m); };

  var RAW = JSON.parse($("rowsData").textContent);
  var GOAL = 50;
  var completed = false;

  /* les montants arrivent en texte : le cast fait partie de la leçon */
  var ROWS = window.HydraEngine.applyOp(RAW, "cast", { mapping: { amount: "float" } });

  function money(v) { return v === null ? "—" : "€" + v.toFixed(2); }

  function render(kept) {
    $("dataRows").innerHTML = ROWS.map(function (r) {
      var shown = !kept || kept.some(function (k) { return k.order_id === r.order_id; });
      var cls = kept ? (shown ? "flash" : "filtered") : "";
      return '<tr class="' + cls + '"><td>' + r.order_id + "</td><td>" + money(r.amount) + "</td><td>" + r.status + "</td></tr>";
    }).join("");
  }

  function setStep(n) {
    document.querySelectorAll(".step").forEach(function (s) {
      var i = +s.dataset.step;
      s.classList.toggle("on", i === n);
      s.setAttribute("aria-selected", i === n ? "true" : "false");
    });
  }

  function unlock() {
    document.querySelectorAll(".step").forEach(function (s) {
      if (+s.dataset.step <= 4) { s.classList.remove("locked"); s.removeAttribute("aria-disabled"); }
    });
  }

  $("amount").addEventListener("input", function () {
    $("amountOut").textContent = "€" + this.value;
    $("codeAmount").textContent = this.value;
    $("status").className = "status";
    $("status").textContent = "Value changed · run to update the preview";
    $("feedback").classList.remove("show");
    $("rowCount").textContent = ROWS.length + " input rows";
    render(null);
    setStep(2);
  });

  $("runBtn").addEventListener("click", function () {
    var threshold = +$("amount").value;
    var btn = this;
    btn.disabled = true;
    $("status").className = "status";
    $("status").textContent = "Running the engine…";
    setTimeout(function () {
      var kept, error = null;
      try {
        kept = window.HydraEngine.applyOp(ROWS, "filter", { expr: "amount > " + threshold });
      } catch (e) { error = e.message; }

      if (error) {
        $("status").className = "status err";
        $("status").textContent = "✕ " + error;
        btn.disabled = false;
        return;
      }

      render(kept);
      $("rowCount").textContent = kept.length + " of " + ROWS.length + " rows";
      $("status").className = "status ok";
      $("status").textContent = "✓ " + kept.length + " rows kept · " + (ROWS.length - kept.length) + " dropped";
      btn.disabled = false;
      unlock();
      setStep(3);

      if (threshold === GOAL) {
        completed = true;
        $("feedback").classList.add("show");
        setStep(4);
        $("sidePercent").textContent = "6%";
        $("sideMeter").style.width = "6%";
        var foot = document.querySelector(".side-foot .row:last-child span");
        if (foot) foot.textContent = "1 / 31 elements";
      } else {
        $("feedback").classList.remove("show");
        toast("Close — set the threshold to exactly €" + GOAL + ".");
      }
    }, 380);
  });

  $("resetBtn").addEventListener("click", function () {
    $("amount").value = 20;
    $("amount").dispatchEvent(new Event("input"));
    completed = false;
  });

  $("nextBtn").addEventListener("click", function () {
    if (!completed) return;
    setStep(5);
    toast("Challenge unlocked: break it, then fix it.");
    this.textContent = "Challenge unlocked ✓";
    this.disabled = true;
  });

  document.querySelectorAll(".step").forEach(function (s) {
    s.addEventListener("click", function () {
      if (s.classList.contains("locked")) { toast("Complete the current action to unlock this step."); return; }
      setStep(+s.dataset.step);
    });
  });

  render(null);
  $("rowCount").textContent = ROWS.length + " input rows";
})();
