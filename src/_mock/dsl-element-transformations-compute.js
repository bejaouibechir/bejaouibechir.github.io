/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"calculate","label":"a calculate expression","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - calculate:\n        column: amount_with_tax\n        expr: \"amount * 1.2\"","notes":["the output column is explicit","the expression uses the current frame","30 rows gain one value"],"status":"✓ amount_with_tax calculated"},{"value":"row-script","label":"a row script","yaml":"transformations:\n  steps:\n    - script:\n        inputs: [quantity]\n        outputs: {double_quantity: int}\n        mode: row\n        code: |\n          double_quantity = quantity * 2","notes":["inputs and outputs form a contract","row mode receives scalar values","the code assigns the declared output"],"status":"✓ row script declared"},{"value":"vectorized","label":"a vectorized script","yaml":"transformations:\n  steps:\n    - cast: {mapping: {amount: float}}\n    - script:\n        inputs: [amount]\n        outputs: {amount_with_tax: float}\n        mode: vectorized\n        code: |\n          amount_with_tax = amount * 1.2","notes":["vectorized mode receives column series","one expression handles every row","the declared output is still required"],"status":"✓ vectorized script declared"}],"tour":[{"key":"root","title":"compute step","match":["- calculate:","- script:"],"bubble":"The operation that creates values.","context":"Calculate and script are separate because their contracts and execution models differ."},{"key":"inputs","title":"inputs","match":["inputs:","expr:"],"bubble":"Values read from the current frame.","context":"Calculate names them in an expression; script can declare an explicit input list."},{"key":"outputs","title":"outputs","match":["column:","outputs:"],"bubble":"The new columns are named before execution.","context":"A script also declares each output type."},{"key":"code","title":"execution","match":["code:","mode:"],"bubble":"How a script evaluates its contract.","context":"Row mode uses scalars; vectorized mode uses pandas Series in a restricted environment."}]};
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
