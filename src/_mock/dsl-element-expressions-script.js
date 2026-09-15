/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"row","label":"row mode","yaml":"transformations:\n  steps:\n    - script:\n        inputs: [amount]\n        outputs: {amount_with_tax: float}\n        mode: row\n        code: |\n          amount_with_tax = amount * 1.2","notes":["amount is a scalar for each row","the code assigns one declared output","30 rows produce 30 values"],"status":"✓ row script · 30 rows"},{"value":"vectorized","label":"vectorized mode","yaml":"transformations:\n  steps:\n    - script:\n        inputs: [amount]\n        outputs: {amount_with_tax: float}\n        mode: vectorized\n        code: |\n          amount_with_tax = amount * 1.2","notes":["amount is a pandas Series","one expression handles the whole column","the output contract is unchanged"],"status":"✓ vectorized script valid"},{"value":"two-outputs","label":"two outputs","yaml":"transformations:\n  steps:\n    - script:\n        inputs: [amount]\n        outputs:\n          amount_with_tax: float\n          doubled: float\n        mode: row\n        code: |\n          amount_with_tax = amount * 1.2\n          doubled = amount * 2","notes":["both outputs are declared with types","both are assigned by the code","input access remains explicit"],"status":"✓ 2 outputs declared"}],"tour":[{"key":"root","title":"script","match":["- script:","script:"],"bubble":"The custom compute operation.","context":"Its contract surrounds the code block."},{"key":"inputs","title":"inputs","match":["inputs:"],"bubble":"Columns made available to code.","context":"Duplicates are removed and names are normalized before execution."},{"key":"outputs","title":"outputs","match":["outputs:"],"bubble":"Required output names and types.","context":"Allowed types include int, float, str, bool, date, datetime, and any."},{"key":"code","title":"mode and code","match":["mode:","code:"],"bubble":"How values are exposed and what is executed.","context":"Row uses scalars; vectorized uses Series; the runtime restricts imports and builtins."}]};
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
