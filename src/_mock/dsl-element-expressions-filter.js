/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"amount","label":"amounts above 50","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - filter: {expr: \"amount > 50\"}","notes":["cast makes amount numeric first","the expression compares one current column","six of 30 rows continue"],"status":"✓ 6 rows match"},{"value":"paid","label":"paid orders","yaml":"transformations:\n  steps:\n    - filter: {expr: \"status == 'paid'\"}","notes":["string literals are quoted inside the expression","status is read from the current frame","22 orders have paid status"],"status":"✓ 22 rows match"},{"value":"combined","label":"paid orders above 50","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - filter: {expr: \"amount > 50 and status == 'paid'\"}","notes":["and combines two row predicates","both names must exist when this step runs","only rows satisfying both continue"],"status":"✓ combined predicate valid"}],"tour":[{"key":"root","title":"filter","match":["- filter:","filter:"],"bubble":"The row-selection operation.","context":"It preserves columns and removes rows whose predicate is false."},{"key":"expr","title":"expr","match":["expr:"],"bubble":"A required, non-empty string.","context":"Hydra passes it to pandas query using the Python expression engine."},{"key":"columns","title":"column names","match":["amount","status"],"bubble":"Names resolve in the current frame.","context":"Earlier cast, rename, and select steps determine which names and types exist here."},{"key":"logic","title":"boolean logic","match":["and","==",">"],"bubble":"Comparisons become a row predicate.","context":"Use explicit parentheses when a longer expression mixes boolean operators."}]};
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
