/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"one","label":"one cast","yaml":"transformations:\n  steps:\n    - cast:\n        mapping: {amount: float}","notes":["one list entry becomes one operation","cast receives the source rows","all 30 rows continue"],"status":"✓ 1 ordered step"},{"value":"two","label":"cast then filter","yaml":"transformations:\n  steps:\n    - cast:\n        mapping: {amount: float}\n    - filter:\n        expr: \"amount > 50\"","notes":["cast runs first","filter receives numeric amounts","six rows continue"],"status":"✓ 2 ordered steps · 6 rows"},{"value":"three","label":"cast, filter, select","yaml":"transformations:\n  steps:\n    - cast:\n        mapping: {amount: float}\n    - filter:\n        expr: \"amount > 50\"\n    - select:\n        columns: [order_id, amount]","notes":["three mappings form one list","each entry has exactly one operation key","select receives only the filtered rows"],"status":"✓ 3 ordered steps · 6 rows"}],"tour":[{"key":"root","title":"steps","match":["steps:"],"bubble":"The list read by the transformation parser.","context":"It may sit under transformations or directly at the file root."},{"key":"entry","title":"list entry","match":["- cast:","- filter:","- select:"],"bubble":"One operation per mapping.","context":"An entry with several operation keys is not a step; the list makes boundaries explicit."},{"key":"params","title":"parameters","match":["mapping:","expr:","columns:"],"bubble":"The block validated for that operation.","context":"Each operation has its own model and required keys."},{"key":"order","title":"order","match":["- cast:","- filter:"],"bubble":"Top to bottom is runtime order.","context":"The engine never reorders steps and each receives the previous output."}]};
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
