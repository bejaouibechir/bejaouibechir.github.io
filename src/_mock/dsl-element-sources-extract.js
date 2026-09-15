/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"table","label":"a CSV table","yaml":"sources:\n  input:\n    type: csv\n    connection: {base_path: data/canonical}\n    extract:\n      table: orders.csv\n      batch_size: 10000","notes":["<code>table</code> names the file for this connector","batches contain at most 10,000 rows","the canonical file yields 30 rows"],"status":"✓ 30 rows extracted"},{"value":"small-batch","label":"smaller batches","yaml":"sources:\n  input:\n    type: csv\n    connection: {base_path: data/canonical}\n    extract:\n      table: orders.csv\n      batch_size: 10","notes":["the target is unchanged","the connector may yield several batches","batching does not change the rows"],"status":"✓ same 30 rows, smaller batches"},{"value":"json","label":"a JSON table","yaml":"sources:\n  input:\n    type: json\n    connection: {}\n    extract:\n      table: data/canonical/products.json\n      limit: 100","notes":["the JSON connector receives a file target","<code>limit</code> belongs to the extraction request","the declaration remains connector-specific"],"status":"✓ valid JSON extraction"}],"tour":[{"key":"root","title":"extract","match":["extract:"],"bubble":"The request passed to the source connector.","context":"It sits inside one source declaration, below type and connection."},{"key":"target","title":"target","match":["table:","query:","collection:"],"bubble":"One of three target forms.","context":"Files and tables use table, SQL can use query, and MongoDB can use collection."},{"key":"limit","title":"limit","match":["limit:"],"bubble":"An optional upper bound.","context":"Limits narrow a read when the selected connector supports that option."},{"key":"batch","title":"batch_size","match":["batch_size:"],"bubble":"The maximum batch requested from the connector.","context":"The default is 10,000; batching changes delivery, not row meaning."}]};
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
