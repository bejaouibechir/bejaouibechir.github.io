/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"long","label":"named sum and count","yaml":"transformations:\n  steps:\n    - aggregate:\n        by: [status]\n        agg:\n          total_amount: {func: sum, col: amount}\n          order_count: {func: count, col: order_id}","notes":["<code>status</code> defines the groups","each output names its source column and function","three statuses produce three rows"],"status":"✓ 30 rows → 3 groups"},{"value":"short","label":"short sum form","yaml":"transformations:\n  steps:\n    - aggregate:\n        by: [status]\n        agg:\n          amount: sum","notes":["the output keeps the source column name","the function is the mapping value","the same three groups are produced"],"status":"✓ short form · 3 groups"},{"value":"average","label":"average per status","yaml":"transformations:\n  steps:\n    - aggregate:\n        by: [status]\n        agg:\n          average_amount: {func: avg, col: amount}","notes":["<code>avg</code> is Hydra's alias for mean","the output column is explicit","group grain remains one row per status"],"status":"✓ average declared for 3 groups"}],"tour":[{"key":"root","title":"aggregate","match":["- aggregate:"],"bubble":"The grouped summary operation.","context":"It consumes the current frame and returns a new frame at a different grain."},{"key":"groups","title":"by","match":["by:"],"bubble":"The non-empty list of grouping columns.","context":"Every distinct combination becomes one output row."},{"key":"outputs","title":"agg","match":["agg:"],"bubble":"A non-empty mapping of output columns.","context":"Each entry chooses a function and, in long form, a source column."},{"key":"function","title":"function","match":["func:","sum","avg"],"bubble":"The reducer applied inside each group.","context":"Documented reducers include sum, count, mean/avg, min, max, first, and last."}]};
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
