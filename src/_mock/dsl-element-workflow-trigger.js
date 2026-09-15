/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"manual","label":"manual","yaml":"workflow:\n  name: manual_notes\n  trigger: {type: manual}\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["manual is the default trigger type","no cron expression is needed","the CLI can start the graph directly"],"status":"✓ manual trigger parsed"},{"value":"schedule","label":"daily schedule","yaml":"workflow:\n  name: daily_notes\n  trigger:\n    type: schedule\n    cron: \"0 6 * * *\"\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["schedule requires a cron string","the expression declares 06:00 daily","steps remain independent of timing"],"status":"✓ schedule trigger parsed"},{"value":"webhook","label":"webhook","yaml":"workflow:\n  name: webhook_notes\n  trigger: {type: webhook}\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["webhook is an accepted trigger type","no cron is attached","the manifest describes entry, not HTTP deployment"],"status":"✓ webhook trigger parsed"}],"tour":[{"key":"root","title":"trigger","match":["trigger:"],"bubble":"The entry policy attached to the workflow.","context":"It defaults to a manual trigger when the block is omitted."},{"key":"type","title":"type","match":["type:"],"bubble":"One of manual, schedule, or webhook.","context":"The value is validated by the workflow model before execution."},{"key":"cron","title":"cron","match":["cron:"],"bubble":"The schedule expression.","context":"It is required only when trigger type is schedule."},{"key":"steps","title":"graph remains separate","match":["steps:"],"bubble":"Trigger does not reorder work.","context":"The same dependency graph can be started through different entry policies."}]};
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
