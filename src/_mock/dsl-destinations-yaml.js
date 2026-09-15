/* destinations.yaml — every selector value is a valid declaration. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function row(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'root', title: 'destinations', bubble: 'The catalogue of places this job may write to.', context: 'The root mapping is required and holds at least one declaration. <code>pipeline.to</code> later chooses one identifier from it.' },
    { key: 'id', title: 'an identifier', bubble: 'A local name, chosen for this job.', context: 'The identifier is not a path or a table. It is the name used by <code>pipeline.to</code> to select the declaration.' },
    { key: 'connection', title: 'type and connection', bubble: 'These keys choose and configure the connector.', context: '<code>type</code> names the connector. <code>connection</code> holds what that connector needs to reach the target system.' },
    { key: 'load', title: 'load', bubble: 'The target and writing policy travel together.', context: '<code>table</code> names the target. <code>mode</code> says whether this run appends, replaces, or upserts; an upsert also names its key columns.' }
  ];

  function base(mode) {
    return [
      L('root', K('destinations:')),
      L('id', '  ' + K('dest_big_orders:')),
      L('connection', '    ' + K('type:') + ' ' + S('csv')),
      L('connection', '    ' + K('connection:')),
      L('connection', '      ' + K('base_path:') + ' ' + S('"examples/tutorial/01-first-job/out"')),
      L('load', '    ' + K('load:')),
      L('load', '      ' + K('table:') + ' ' + S('big_orders.csv')),
      L('load', '      ' + K('mode:') + ' ' + S(mode))
    ];
  }

  var step = 0;
  function render() {
    var choice = $('selCase').value;
    var lines = base(choice === 'append' ? 'append' : 'replace');
    var notes;
    if (choice === 'append') {
      notes = ['the CSV connector and target stay the same', '<code>append</code> keeps existing rows and adds the six produced by this run', 'run: 30 rows read, 6 written'];
    } else if (choice === 'two') {
      lines = lines.concat([
        L('second', '  ' + K('dest_archive:')),
        L('second', '    ' + K('type:') + ' ' + S('csv')),
        L('second', '    ' + K('connection:')),
        L('second', '      ' + K('base_path:') + ' ' + S('"examples/tutorial/01-first-job/out"')),
        L('second', '    ' + K('load:')),
        L('second', '      ' + K('table:') + ' ' + S('archive.csv')),
        L('second', '      ' + K('mode:') + ' ' + S('append'))
      ]);
      notes = ['two complete destinations are declared', '<code>pipeline.to</code> selects <code>dest_big_orders</code>', 'only that connector writes; the archive remains available for another pipeline'];
    } else {
      notes = ['<code>pipeline.to</code> selects <code>dest_big_orders</code>', '<code>replace</code> clears the target before the first batch is written', 'run: 30 rows read, 6 written'];
    }
    $('yaml').innerHTML = lines.join('\n');
    $('verdict').innerHTML = notes.map(row).join('');
    $('status').className = 'status ok';
    $('status').textContent = choice === 'two' ? '✓ one of two destinations selected' : '✓ 30 rows read · 6 written';
    showStep(step);
  }

  function showStep(i) {
    step = Math.max(0, Math.min(TOUR.length - 1, i));
    var s = TOUR[step];
    document.querySelectorAll('.yl').forEach(function (el) { el.classList.remove('lit'); });
    var targets = document.querySelectorAll('.yl[data-key="' + s.key + '"]');
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
  $('resetBtn').addEventListener('click', function () { $('selCase').value = 'replace'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  render();
})();
