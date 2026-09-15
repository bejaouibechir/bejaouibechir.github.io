/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"union-all","label":"UNION ALL semantics","yaml":"transformations:\n  steps:\n    - union:\n        right: src_orders_extra\n        distinct: false","notes":["the right side is a declared source id","all four extra rows are appended","30 primary rows become 34 output rows"],"status":"✓ 30 + 4 → 34 rows"},{"value":"union","label":"distinct union","yaml":"transformations:\n  steps:\n    - union:\n        right: src_orders_extra\n        distinct: true","notes":["the same right source is resolved","combined duplicates are removed","column sets must align"],"status":"✓ distinct union declared"},{"value":"inline","label":"an inline right source","yaml":"transformations:\n  steps:\n    - union:\n        right:\n          type: csv\n          connection: {base_path: data/canonical}\n          extract: {table: orders_extra.csv}\n        distinct: false","notes":["right may be a complete inline source","the runner builds it before union","the operation still receives ready rows"],"status":"✓ inline right source declared"}],"tour":[{"key":"root","title":"combine operation","match":["- union:","- join:","- merge:"],"bubble":"One of three two-frame operations.","context":"Join matches columns, merge reconciles by key, and union stacks rows."},{"key":"right","title":"right","match":["right:"],"bubble":"The second input.","context":"Use a declared source identifier or a complete inline source declaration."},{"key":"keys","title":"matching","match":["key:","left_key:","right_key:"],"bubble":"How join and merge align rows.","context":"Join accepts a common key or separate left and right keys; merge requires a key."},{"key":"policy","title":"combination policy","match":["distinct:","how:","delete_unmatched:"],"bubble":"How the two frames are reconciled.","context":"Each operation exposes only the policy relevant to its semantics."}]};
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
