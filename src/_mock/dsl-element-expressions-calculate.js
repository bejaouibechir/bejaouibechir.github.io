/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"tax","label":"tax-inclusive amount","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - calculate:\n        column: amount_with_tax\n        expr: \"amount * 1.2\"","notes":["column names the output","expr reads numeric amount","all 30 rows receive a value"],"status":"✓ 30 values calculated"},{"value":"line","label":"line total","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float, quantity: int}}\n    - calculate:\n        column: line_weight\n        expr: \"amount * quantity\"","notes":["two current columns feed the expression","their casts happen first","one output column is added"],"status":"✓ two-column formula valid"},{"value":"replace","label":"replace amount","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - calculate:\n        column: amount\n        expr: \"amount * 1.2\"","notes":["an existing column name may be the output","the expression reads its pre-step values","later steps see only the replacement"],"status":"✓ amount replaced"}],"tour":[{"key":"root","title":"calculate","match":["- calculate:","calculate:"],"bubble":"The one-column compute operation.","context":"Each calculate step has one output name and one expression."},{"key":"output","title":"column","match":["column:"],"bubble":"Where the result is stored.","context":"A new name adds a column; an existing name replaces it."},{"key":"expr","title":"expr","match":["expr:"],"bubble":"The required pandas-eval formula.","context":"It is evaluated against columns in the current transformation frame."},{"key":"order","title":"prepared inputs","match":["- cast:","mapping:"],"bubble":"Types must be ready before evaluation.","context":"Validation checks manifest shape, not the runtime compatibility of the formula."}]};
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
