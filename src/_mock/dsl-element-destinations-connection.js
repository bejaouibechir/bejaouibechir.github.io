/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"explicit","label":"an explicit directory","yaml":"destinations:\n  output:\n    type: csv\n    connection:\n      base_path: examples/tutorial/dsl-elements/out\n    load: {table: result.csv, mode: replace}","notes":["the CSV writer resolves one base directory","the file name remains in <code>load.table</code>","the directory must already exist"],"status":"✓ output directory resolved"},{"value":"default","label":"the job directory","yaml":"destinations:\n  output:\n    type: csv\n    connection: {}\n    load: {table: result.csv, mode: replace}","notes":["an empty mapping is valid for CSV","the connector falls back to the job directory","load still names the target file"],"status":"✓ job directory used"},{"value":"archive","label":"an archive directory","yaml":"destinations:\n  archive:\n    type: csv\n    connection: {base_path: examples/tutorial/dsl-elements/out}\n    load: {table: archive.csv, mode: append}","notes":["the connection remains reusable","the target name and mode change in load","no source setting appears here"],"status":"✓ archive connection resolved"}],"tour":[{"key":"root","title":"connection","match":["connection:"],"bubble":"Connector-specific reachability settings.","context":"The mapping is interpreted only after destination type selects a connector."},{"key":"location","title":"location","match":["base_path:"],"bubble":"Where the CSV writer operates.","context":"Other connector types use their own host, port, database, or authentication keys."},{"key":"target","title":"target stays in load","match":["table:"],"bubble":"The object to write is not connection data.","context":"Keeping it in load lets one connection serve several targets."},{"key":"policy","title":"policy stays in load","match":["mode:"],"bubble":"Reachability does not decide append or replace.","context":"The write policy belongs to the target declaration in load."}]};
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
