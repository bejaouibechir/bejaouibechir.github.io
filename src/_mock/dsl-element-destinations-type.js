/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"csv","label":"a CSV writer","yaml":"destinations:\n  output:\n    type: csv\n    connection: {base_path: out}\n    load: {table: result.csv, mode: replace}","notes":["<code>csv</code> selects the CSV writer","the connection resolves the output directory","load names one target file"],"status":"✓ CSV writer selected"},{"value":"normalized","label":"normalized spelling","yaml":"destinations:\n  output:\n    type: CSV\n    connection: {base_path: out}\n    load: {table: result.csv, mode: replace}","notes":["the parser trims and lower-cases the value","<code>CSV</code> becomes <code>csv</code>","the same writer is built"],"status":"✓ CSV normalized to csv"},{"value":"archive","label":"another CSV target","yaml":"destinations:\n  archive:\n    type: csv\n    connection: {base_path: out}\n    load: {table: archive.csv, mode: append}","notes":["the identifier changes independently of type","the connector family stays CSV","append becomes the target policy"],"status":"✓ archive writer declared"}],"tour":[{"key":"root","title":"destinations","match":["destinations:"],"bubble":"The catalogue of possible writers.","context":"pipeline.to chooses one declaration from this mapping."},{"key":"id","title":"identifier","match":["output:","archive:"],"bubble":"A local name for the target declaration.","context":"The identifier is what pipeline.to stores; it is not the table name."},{"key":"type","title":"type","match":["type:"],"bubble":"The connector discriminator.","context":"It is normalized before Hydra asks the connector registry for a writer."},{"key":"contract","title":"writer contract","match":["connection:","load:"],"bubble":"The blocks interpreted by that writer.","context":"Connection reaches the target system; load names the object and policy."}]};
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
