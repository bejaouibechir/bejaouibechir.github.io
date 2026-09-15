/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"none","label":"no retries","yaml":"workflow:\n  name: notes\n  steps:\n    - {name: note, type: action, action: log, params: {message: \"Ready.\"}}","notes":["omitting retry means zero re-attempts","the first success completes the node","the verified action runs once"],"status":"✓ one successful attempt"},{"value":"fixed","label":"two fixed retries","yaml":"workflow:\n  name: notes\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}\n      retry: {max: 2, delay: 1, backoff: fixed}","notes":["max counts re-attempts after the first failure","fixed keeps the same delay","success ends the loop before retries are used"],"status":"✓ fixed policy parsed"},{"value":"exponential","label":"three exponential retries","yaml":"workflow:\n  name: notes\n  steps:\n    - name: note\n      type: action\n      action: log\n      params: {message: \"Ready.\"}\n      retry: {max: 3, delay: 2, backoff: exponential}","notes":["the first retry waits two seconds","later waits double from the base delay","at most four total attempts occur"],"status":"✓ exponential policy parsed"}],"tour":[{"key":"root","title":"retry","match":["retry:"],"bubble":"The attempt policy attached to one step.","context":"Different steps may carry different policies."},{"key":"max","title":"max","match":["max:"],"bubble":"Re-attempts after the first failure.","context":"A max of two permits three total attempts."},{"key":"delay","title":"delay","match":["delay:"],"bubble":"Base seconds between attempts.","context":"Zero is allowed and performs immediate re-attempts."},{"key":"backoff","title":"backoff","match":["backoff:"],"bubble":"Fixed or exponential waiting.","context":"Exponential multiplies the base delay by powers of two."}]};
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
