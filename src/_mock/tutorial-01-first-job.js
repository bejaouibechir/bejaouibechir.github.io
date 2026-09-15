/* Leçon 1 — visite guidée des quatre fichiers du projet examples/tutorial/01-first-job.
   Les blocs YAML sont ceux du dépôt ; la sortie affichée est celle que le moteur a produite. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };

  /* les quatre fichiers, ligne par ligne, adressables par la visite */
  var FILES = {
    sources: [
      L('version', K('version:') + ' ' + S('"1.0"')),
      L('sources', K('sources:')),
      L('id', '  ' + K('src_orders:')),
      L('type', '    ' + K('type:') + ' ' + S('csv')),
      L('connection', '    ' + K('connection:')),
      L('connection', '      ' + K('base_path:') + ' ' + S('"data/canonical"')),
      L('extract', '    ' + K('extract:')),
      L('extract', '      ' + K('table:') + ' ' + S('orders.csv')),
      L('batch', '      ' + K('batch_size:') + ' ' + S('10000'))
    ],
    transformations: [
      L('version', K('version:') + ' ' + S('"1.0"')),
      L('steps', K('transformations:')),
      L('steps', '  ' + K('steps:')),
      L('cast', '    - ' + K('cast:')),
      L('cast', '        ' + K('mapping:')),
      L('cast', '          ' + K('amount:') + ' ' + S('float')),
      L('filter', '    - ' + K('filter:')),
      L('filter', '        ' + K('expr:') + ' ' + S('"amount &gt; 50"')),
      L('select', '    - ' + K('select:')),
      L('select', '        ' + K('columns:') + ' ' + S('[order_id, customer_id, amount, status]'))
    ],
    destinations: [
      L('version', K('version:') + ' ' + S('"1.0"')),
      L('destinations', K('destinations:')),
      L('destinations', '  ' + K('dest_big_orders:')),
      L('destinations', '    ' + K('type:') + ' ' + S('csv')),
      L('destinations', '    ' + K('connection:')),
      L('destinations', '      ' + K('base_path:') + ' ' + S('"examples/tutorial/01-first-job/out"')),
      L('load', '    ' + K('load:')),
      L('load', '      ' + K('table:') + ' ' + S('big_orders.csv')),
      L('mode', '      ' + K('mode:') + ' ' + S('replace'))
    ],
    pipeline: [
      L('version', K('version:') + ' ' + S('"1.0"')),
      L('pipeline', K('pipeline:')),
      L('pipeline', '  ' + K('from:') + ' ' + S('src_orders')),
      L('pipeline', '  ' + K('to:') + ' ' + S('dest_big_orders'))
    ]
  };

  var TOUR = [
    { file: 'sources', key: 'sources', title: 'sources',
      bubble: 'Every input the job may read is declared here.',
      context: 'A job reads from exactly one source. Declaring several is only useful when an operation pulls a second stream, as <code>join</code> does.' },
    { file: 'sources', key: 'type', title: 'type',
      bubble: 'Which connector reads the data. Nine are registered.',
      context: 'The type decides which keys <code>connection</code> accepts. Change it and the block changes shape — that is the subject of the connectors page.' },
    { file: 'sources', key: 'extract', title: 'extract',
      bubble: 'What to read once connected: here, a file name.',
      context: 'The key changes with the connector — <code>table</code> for files and SQL, <code>collection</code> for MongoDB, an endpoint for the web API.' },
    { file: 'transformations', key: 'steps', title: 'steps',
      bubble: 'An ordered list. Each step receives the rows the previous one produced.',
      context: 'Order matters and the engine never reorders anything. A step that expects numbers must come after the step that produces them.' },
    { file: 'transformations', key: 'cast', title: 'cast',
      bubble: 'A CSV holds text. Nothing is a number until you say so.',
      context: 'Without this step the next one compares text to a number and the run stops. <code>hdrctl validate</code> does not catch it — it does not type-check expressions.' },
    { file: 'transformations', key: 'filter', title: 'filter',
      bubble: 'Keeps the rows for which the expression is true.',
      context: 'A row whose <code>amount</code> is empty never matches: a comparison against a missing value is false, not an error. Two such rows exist here, and both are dropped.' },
    { file: 'transformations', key: 'select', title: 'select',
      bubble: 'Keeps four columns of the seven, in this order.',
      context: 'Selecting late rather than early is deliberate: the earlier steps still need <code>quantity</code> and <code>order_date</code>.' },
    { file: 'destinations', key: 'load', title: 'load',
      bubble: 'Where the rows go, and under which name.',
      context: 'The destination mirrors the source: a type, a connection, and what to write. The same nine types are available on both sides.' },
    { file: 'destinations', key: 'mode', title: 'mode',
      bubble: 'replace empties the target first. append adds. upsert needs a key.',
      context: 'Default is <code>append</code>. A tutorial that runs twice would double its output, which is why this project writes in <code>replace</code>.' },
    { file: 'pipeline', key: 'pipeline', title: 'pipeline',
      bubble: 'Which source feeds which destination. Two names, nothing else.',
      context: 'These are declared identifiers, not paths. The path lives in <code>extract.table</code> and <code>load.table</code>.' }
  ];

  /* sortie réelle du moteur — examples/tutorial/01-first-job/out/big_orders.csv */
  var OUT = [
    ['O1011', 'C006', '58.0', 'paid'],
    ['O1012', 'C007', '72.0', 'paid'],
    ['O1017', 'C002', '60.0', 'paid'],
    ['O1019', 'C005', '79.8', 'paid'],
    ['O1020', 'C007', '54.0', 'paid'],
    ['O1022', 'C002', '54.0', 'refunded']
  ];

  var step = 0;

  function showFile(name) {
    $('yaml').innerHTML = FILES[name].join('\n');
    $('fileName').textContent = name + '.yaml';
    document.querySelectorAll('.ftab').forEach(function (t) {
      t.classList.toggle('on', t.dataset.file === name);
      t.setAttribute('aria-selected', t.dataset.file === name ? 'true' : 'false');
    });
  }

  function showStep(i) {
    step = Math.max(0, Math.min(TOUR.length - 1, i));
    var s = TOUR[step];
    showFile(s.file);

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
      var mid = (first.top + last.bottom) / 2 - wrap.top + $('codewrap').scrollTop;
      bubble.style.top = Math.max(8, mid - bubble.offsetHeight / 2) + 'px';
    }

    $('tourContext').innerHTML = '<b>' + s.title + '</b><p>' + s.context + '</p>';
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + TOUR.length;
    $('tourTitle').textContent = s.file + '.yaml · ' + s.title;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === TOUR.length - 1;
    $('tourNext').textContent = step === TOUR.length - 1 ? 'End of walkthrough' : 'Next ›';
  }

  $('outRows').innerHTML = OUT.map(function (r) {
    return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
  }).join('');

  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.querySelectorAll('.ftab').forEach(function (t) {
    t.addEventListener('click', function () {
      for (var i = 0; i < TOUR.length; i++) if (TOUR[i].file === t.dataset.file) { showStep(i); return; }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  $('yaml').addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('.yl') : null;
    if (!el) return;
    for (var i = 0; i < TOUR.length; i++) if (TOUR[i].key === el.dataset.key) { showStep(i); return; }
  });

  showStep(0);
})();
