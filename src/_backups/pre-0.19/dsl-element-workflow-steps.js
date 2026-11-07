/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"action","label":"one action node","yaml":"workflow:\n  name: one_note\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}","notes":["action selects a built-in side effect","params configure that action","one node forms one execution group"],"status":"✓ 1 action node"},{"value":"job","label":"one job node","yaml":"workflow:\n  name: one_job\n  steps:\n    - name: load_orders\n      type: job\n      job: ../../minimal_csv","notes":["job points to a Hydra job directory","the node delegates row processing to that job","one node forms one execution group"],"status":"✓ 1 job node"},{"value":"dependency","label":"two dependent actions","yaml":"workflow:\n  name: two_notes\n  steps:\n    - {name: prepare, type: action, action: log, params: {message: \"Ready.\"}}\n    - name: publish\n      type: action\n      action: log\n      params: {message: \"Published.\"}\n      depends_on: [prepare]","notes":["both nodes have unique names","publish names prepare as a dependency","the runner builds two sequential groups"],"status":"✓ 2 nodes · 2 groups"}],"tour":[{"key":"root","title":"steps","match":["steps:"],"bubble":"The node list for one workflow.","context":"Unlike transformation steps, vertical position alone does not establish runtime order."},{"key":"identity","title":"node identity","match":["name:"],"bubble":"A unique name inside the graph.","context":"Dependencies reference this exact string."},{"key":"kind","title":"node kind","match":["type:","job:","action:"],"bubble":"Job or action, with its matching target.","context":"A job needs a job path; an action needs an action name."},{"key":"edges","title":"depends_on","match":["depends_on:"],"bubble":"The incoming edges of this node.","context":"Every listed predecessor must complete before the node becomes ready."}]};
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
