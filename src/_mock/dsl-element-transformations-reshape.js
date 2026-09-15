/* Generated documentation interaction — every case is valid. */
(function () {
  var DATA = {"cases":[{"value":"unpivot","label":"wide to long","yaml":"transformations:\n  steps:\n    - unpivot:\n        id_vars: [region]\n        value_vars: [q1, q2, q3, q4]\n        var_name: quarter\n        value_name: revenue","notes":["region remains an identifier","four quarter columns become observations","5 wide rows become 20 long rows"],"status":"✓ 5 wide rows → 20 long rows"},{"value":"pivot","label":"long to wide","yaml":"transformations:\n  steps:\n    - pivot:\n        index: [customer_id]\n        column: status\n        values: amount\n        aggfunc: first","notes":["customer_id remains the row identity","status values become columns","amount supplies the cell values"],"status":"✓ pivot declaration valid"},{"value":"transpose","label":"rows and columns exchange","yaml":"transformations:\n  steps:\n    - transpose:\n        index_col: region\n        header_name: metric","notes":["region values become output headers","old headers become row labels","header_name names that label column"],"status":"✓ transpose declaration valid"}],"tour":[{"key":"root","title":"reshape operation","match":["- unpivot:","- pivot:","- transpose:"],"bubble":"The chosen layout transformation.","context":"Each operation changes axes in a different direction."},{"key":"identity","title":"identity","match":["id_vars:","index:","index_col:"],"bubble":"What remains stable while layout moves.","context":"Read these keys first to understand the output row identity."},{"key":"values","title":"values","match":["value_vars:","values:"],"bubble":"Which cells move into the new layout.","context":"Unpivot gathers columns; pivot distributes one values column."},{"key":"names","title":"output names","match":["var_name:","value_name:","header_name:"],"bubble":"Names for newly created axes.","context":"Explicit names keep the reshaped table readable downstream."}]};
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
