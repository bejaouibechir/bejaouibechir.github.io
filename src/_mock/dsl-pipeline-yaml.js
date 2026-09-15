/* pipeline.yaml — all three representations resolve the same two identifiers. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function row(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'root', title: 'pipeline', bubble: 'The canonical root key of the file.', context: 'The runner reads this mapping directly. Unlike the other job manifests, <code>pipeline</code> has no dedicated Pydantic model.' },
    { key: 'from', title: 'from', bubble: 'The identifier of one declared source.', context: 'The runner looks up this exact string in the <code>sources</code> catalogue, then builds that source connector.' },
    { key: 'to', title: 'to', bubble: 'The identifier of one declared destination.', context: 'The runner looks up this exact string in <code>destinations</code>, then builds that destination connector.' },
    { key: 'link', title: 'the link', bubble: 'Two names establish the complete direction of one job.', context: 'Transformations need no reference here. When present, their ordered steps run automatically between the selected source and destination.' }
  ];
  var step = 0;

  function render() {
    var choice = $('selCase').value;
    var lines;
    if (choice === 'flow') {
      lines = [L('root', K('version:') + ' ' + S('"1.0"')), L('link', K('pipeline:') + ' { ' + K('from:') + ' ' + S('src_orders') + ', ' + K('to:') + ' ' + S('dest_big_orders') + ' }')];
    } else {
      lines = [];
      if (choice !== 'noversion') lines.push(L('root', K('version:') + ' ' + S('"1.0"')));
      lines.push(L('root', K('pipeline:')));
      lines.push(L('from', '  ' + K('from:') + ' ' + S('src_orders')));
      lines.push(L('to', '  ' + K('to:') + ' ' + S('dest_big_orders')));
    }
    $('yaml').innerHTML = lines.join('\n');
    var shape = choice === 'flow' ? 'compact YAML and block YAML decode to the same mapping' : choice === 'noversion' ? 'the optional version line changes nothing' : 'the canonical mapping is read directly by the runner';
    $('verdict').innerHTML = [shape, '<code>src_orders</code> resolves in sources.yaml', '<code>dest_big_orders</code> resolves in destinations.yaml', 'run: 30 rows read, 6 written'].map(row).join('');
    $('status').className = 'status ok';
    $('status').textContent = '✓ 30 rows read · 6 written';
    showStep(step);
  }

  function showStep(i) {
    step = Math.max(0, Math.min(TOUR.length - 1, i));
    var s = TOUR[step];
    document.querySelectorAll('.yl').forEach(function (el) { el.classList.remove('lit'); });
    var targets = document.querySelectorAll('.yl[data-key="' + s.key + '"]');
    if (!targets.length && s.key === 'link') targets = document.querySelectorAll('.yl[data-key="from"], .yl[data-key="to"]');
    if (!targets.length && (s.key === 'from' || s.key === 'to')) targets = document.querySelectorAll('.yl[data-key="link"]');
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
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + TOUR.length;
    $('tourTitle').textContent = s.title;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === TOUR.length - 1;
    $('tourNext').textContent = step === TOUR.length - 1 ? 'End of walkthrough' : 'Next ›';
  }

  $('selCase').addEventListener('change', render);
  $('resetBtn').addEventListener('click', function () { $('selCase').value = 'canonical'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  render();
})();
