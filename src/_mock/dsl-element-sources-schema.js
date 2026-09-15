/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"manual","label":"manual fields","yaml":"sources:\n  input:\n    type: csv\n    extract: {table: data/canonical/orders.csv}\n    schema:\n      mode: manual\n      fields:\n        - {name: order_id, type: string, required: true}\n        - {name: amount, type: float}","notes":["two expected fields are declared","field types are normalized","the block does not cast the CSV rows"],"status":"✓ manual schema parsed"},{"value":"auto","label":"automatic description","yaml":"sources:\n  input:\n    type: csv\n    extract: {table: data/canonical/orders.csv}\n    schema:\n      mode: auto\n      drift_policy: warn\n      sample_size: 100","notes":["<code>auto</code> needs no field list","drift policy is recorded as <code>warn</code>","sample size must be at least one"],"status":"✓ auto schema parsed"},{"value":"hybrid","label":"hybrid expectations","yaml":"sources:\n  input:\n    type: json\n    extract: {table: data/canonical/products.json}\n    schema:\n      mode: hybrid\n      fields:\n        - {name: product_id, type: string}\n      validation_policy: best_effort","notes":["declared fields and inferred shape may coexist","the policy is accepted by the source model","rows still flow to transformations unchanged"],"status":"✓ hybrid schema parsed"}],"tour":[{"key":"root","title":"schema","match":["schema:"],"bubble":"An optional block inside a source.","context":"Omit it when the source needs no declared expectations."},{"key":"mode","title":"mode","match":["mode:"],"bubble":"How explicit the declaration is.","context":"Accepted modes are auto, manual, infer_strict, and hybrid."},{"key":"fields","title":"fields","match":["fields:","name:","type:"],"bubble":"Named field descriptions.","context":"Each field has a name and type, plus optional path, required, default, array handling, and description."},{"key":"policies","title":"policies","match":["drift_policy:","validation_policy:","sample_size:"],"bubble":"How schema observations are classified.","context":"These values are validated and stored with the source definition."}]};
  var $ = function (id) { return document.getElementById(id); };
  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function paint(line) {
    var safe = escapeHtml(line);
    return safe.replace(/^(s*(?:-s*)?)([A-Za-z_][A-Za-z0-9_.-]*:)/, '$1<span class="c-key">$2</span>');
  }
  function row(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }
  var step = 0;
  function currentCase() { return DATA.cases.find(function (c) { return c.value === $('selCase').value; }) || DATA.cases[0]; }
  function render() {
    var c = currentCase();
    $('yaml').innerHTML = c.yaml.split('\n').map(function (line) {
      var keys = DATA.tour.filter(function (t) { return t.match.some(function (m) { return line.indexOf(m) >= 0; }); }).map(function (t) { return t.key; });
      return '<span class="yl" data-key="' + keys.join(' ') + '">' + paint(line) + '</span>';
    }).join('\n');
    $('verdict').innerHTML = c.notes.map(row).join('');
    $('status').className = 'status ok';
    $('status').textContent = c.status;
    showStep(step);
  }
  function showStep(i) {
    step = Math.max(0, Math.min(DATA.tour.length - 1, i));
    var s = DATA.tour[step];
    document.querySelectorAll('.yl').forEach(function (el) { el.classList.remove('lit'); });
    var targets = Array.prototype.filter.call(document.querySelectorAll('.yl'), function (el) {
      return (' ' + el.getAttribute('data-key') + ' ').indexOf(' ' + s.key + ' ') >= 0;
    });
    targets.forEach(function (el) { el.classList.add('lit'); });
    var bubble = $('bubble');
    bubble.innerHTML = '<b>' + s.title + '</b><span>' + s.bubble + '</span>';
    bubble.classList.add('show');
    if (targets.length && bubble.getBoundingClientRect) {
      var wrap = $('codewrap').getBoundingClientRect();
      var first = targets[0].getBoundingClientRect();
      var last = targets[targets.length - 1].getBoundingClientRect();
      bubble.style.top = Math.max(8, (first.top + last.bottom) / 2 - wrap.top + $('codewrap').scrollTop - bubble.offsetHeight / 2) + 'px';
    }
    $('tourContext').innerHTML = '<b>' + s.title + '</b><p>' + s.context + '</p>';
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + DATA.tour.length;
    $('tourTitle').textContent = s.title;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === DATA.tour.length - 1;
    $('tourNext').textContent = step === DATA.tour.length - 1 ? 'End of walkthrough' : 'Next ›';
  }
  $('selCase').addEventListener('change', render);
  $('resetBtn').addEventListener('click', function () { $('selCase').value = DATA.cases[0].value; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  render();
})();
