/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"embedded-param","label":"an embedded parameter","yaml":"transformations:\n  steps:\n    - filter:\n        expr: \"amount > {{ param:MIN_AMOUNT }}\"","notes":["the parameter is resolved before transform parsing","embedded substitution produces expression text","MIN_AMOUNT=50 yields <code>amount &gt; 50</code>"],"status":"✓ parameter substituted · 6 rows"},{"value":"full-param","label":"a full typed parameter","yaml":"sources:\n  input:\n    type: csv\n    extract:\n      table: orders.csv\n      batch_size: \"{{ param:BATCH_SIZE }}\"","notes":["the whole YAML value is one placeholder","an integer parameter remains an integer","the source model receives a typed batch size"],"status":"✓ integer type preserved"},{"value":"embedded-env","label":"an environment value","yaml":"transformations:\n  steps:\n    - filter:\n        expr: \"amount > {{ env:MIN_AMOUNT }}\"","notes":["the OS environment supplies the value","embedded substitution produces text","MIN_AMOUNT=50 yields the same six rows"],"status":"✓ environment substituted · 6 rows"}],"tour":[{"key":"root","title":"placeholder","match":["{{ param:","{{ env:"],"bubble":"A value resolved before Pydantic models see YAML.","context":"Parameter names and environment names use the same placeholder grammar."},{"key":"kind","title":"param or env","match":["param:","env:"],"bubble":"Where the value comes from.","context":"Parameters follow Hydra's layered precedence; env reads the process environment."},{"key":"type","title":"full-value typing","match":["batch_size:"],"bubble":"A placeholder occupying the whole value preserves type.","context":"An integer can therefore reach an integer model field without string coercion."},{"key":"embedded","title":"embedded text","match":["expr:"],"bubble":"A placeholder inside larger text becomes a string substitution.","context":"This is how numeric thresholds become part of filter expressions."}]};
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
