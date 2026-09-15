/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"full","label":"name, version, description","yaml":"workflow:\n  version: \"1.0\"\n  name: docs_workflow\n  description: Two actions used by the docs.\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["name identifies results and logs","version is stored with the definition","description explains intent without changing execution"],"status":"✓ workflow identity complete"},{"value":"default-version","label":"the default version","yaml":"workflow:\n  name: docs_workflow\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["name remains required","version defaults to <code>1.0</code>","the action graph is unchanged"],"status":"✓ version defaults to 1.0"},{"value":"minimal","label":"a minimal identity","yaml":"workflow:\n  name: one_note\n  trigger: {type: manual}\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["one required name labels the workflow","description may be omitted","manual trigger is explicit here"],"status":"✓ minimal identity parsed"}],"tour":[{"key":"root","title":"workflow","match":["workflow:"],"bubble":"The root mapping for one orchestration graph.","context":"Identity, trigger, and steps all live below this key."},{"key":"name","title":"name","match":["name:"],"bubble":"The required workflow identifier.","context":"It appears in runner logs and the WorkflowResult object."},{"key":"version","title":"version","match":["version:"],"bubble":"The declared manifest shape.","context":"It defaults to 1.0 and is stored; no alternate workflow grammar is selected today."},{"key":"description","title":"description","match":["description:"],"bubble":"Optional human context.","context":"It explains the purpose of the graph and does not affect scheduling."}]};
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
