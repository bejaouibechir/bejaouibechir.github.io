/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"literal","label":"a numeric comparison","yaml":"workflow:\n  name: guarded_note\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}\n      when: \"1 == 1\"","notes":["the expression is parsed as a safe AST","the comparison is true","the action runs once"],"status":"✓ guard true · step runs"},{"value":"membership","label":"membership","yaml":"workflow:\n  name: guarded_note\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}\n      when: \"'prod' in ['dev', 'prod']\"","notes":["literal list membership is allowed","no arbitrary function call is available","the guard evaluates true"],"status":"✓ membership guard true"},{"value":"placeholder","label":"an environment placeholder","yaml":"workflow:\n  name: guarded_note\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}\n      when: \"{{ env:HYDRA_ENV }} == 'prod'\"","notes":["the placeholder is resolved before comparison","numeric-looking values are coerced when both sides are numeric","the AST still contains only allowed nodes"],"status":"✓ environment guard parsed"}],"tour":[{"key":"root","title":"step","match":["- name:","name:"],"bubble":"The workflow node being gated.","context":"Dependencies are checked before its when expression."},{"key":"when","title":"when","match":["when:"],"bubble":"A boolean expression string.","context":"Empty or omitted means the ready step runs normally."},{"key":"values","title":"operands","match":["env:","=="," in "],"bubble":"Literals or parameter/environment placeholders.","context":"Arbitrary variable names, calls, attributes, and indexing are not allowed."},{"key":"decision","title":"decision","match":["action:","job:"],"bubble":"True runs; false skips.","context":"A skipped node also prevents dependent nodes from becoming runnable."}]};
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
