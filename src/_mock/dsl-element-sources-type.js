/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"csv","label":"CSV rows","yaml":"sources:\n  input:\n    type: csv\n    connection: {base_path: data/canonical}\n    extract: {table: orders.csv}","notes":["<code>csv</code> selects the CSV connector","<code>table</code> is interpreted as a file name","the declaration runs against the canonical orders"],"status":"✓ CSV connector selected"},{"value":"json","label":"JSON objects","yaml":"sources:\n  input:\n    type: json\n    connection: {}\n    extract: {table: data/canonical/products.json}","notes":["<code>json</code> selects the JSON connector","the same outer declaration keeps its shape","the target now contains JSON objects"],"status":"✓ JSON connector selected"},{"value":"normalized","label":"normalized CSV spelling","yaml":"sources:\n  input:\n    type: CSV\n    connection: {base_path: data/canonical}\n    extract: {table: orders.csv}","notes":["type values are trimmed and lower-cased","<code>CSV</code> becomes <code>csv</code>","the resulting connector is the same"],"status":"✓ CSV normalized to csv"}],"tour":[{"key":"root","title":"sources","match":["sources:"],"bubble":"The catalogue that owns the declaration.","context":"Every source identifier maps to exactly one connector declaration."},{"key":"id","title":"identifier","match":["input:"],"bubble":"The name used by pipeline.from.","context":"Changing this name changes the reference, not the connector type."},{"key":"type","title":"type","match":["type:"],"bubble":"The connector discriminator.","context":"Hydra normalizes it, then asks the connector registry to build that type."},{"key":"contract","title":"connector contract","match":["connection:","extract:"],"bubble":"The selected type gives these blocks their meaning.","context":"A table means a file to CSV and a table or query to a database connector."}]};
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
