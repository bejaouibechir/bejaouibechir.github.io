/* Atelier 1 — ingerer l'export de ventes quotidien. Neuf etapes.
   Le projet existe dans le depot : examples/workshops/01-daily-sales-csv.
   Execute de bout en bout avant redaction : 7 lignes lues, 3 ecrites. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var C = function (t) { return '<span class="c-comment">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function note(state, text) { return '<div class="vrow"><span class="vdot ' + state + '" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var STEPS = [
    { file: 'data/sales_2025-03-04.csv', title: 'the export', goal: 'Create the folder and drop the export inside it.',
      bubble: 'Seven orders, six columns, everything stored as text.',
      context: 'Hydra never moves or copies your file — it reads it where it sits. The <code>data/</code> and <code>out/</code> folders are a convention, not a requirement.',
      lines: [
        L('csv', C('# sales/data/sales_2025-03-04.csv')),
        L('csv', 'order_id,customer,city,amount,status,order_date'),
        L('csv', 'A-1001,Alice Martin,Paris,120.50,paid,2025-03-04'),
        L('csv', 'A-1002,Bob Dupont,Lyon,45.00,pending,2025-03-04'),
        L('csv', 'A-1003,Chloe Ruiz,Madrid,310.75,paid,2025-03-04'),
        L('csv', 'A-1004,Driss Benali,Marseille,18.20,refunded,2025-03-04'),
        L('csv', 'A-1005,Emma Gomez,Barcelona,95.00,paid,2025-03-04'),
        L('csv', 'A-1006,Farid Ziani,Nantes,260.00,paid,2025-03-04'),
        L('csv', 'A-1007,Greta Muller,Berlin,72.40,pending,2025-03-04')
      ],
      notes: [['ok','seven orders — four of them below 100']],
      status: ['ok','Step 1 · nothing to run yet'] },

    { file: 'sources.yaml', title: 'declare the source', goal: 'Say where the file is and what reads it.',
      bubble: 'The folder and the file name are two separate keys.',
      context: 'Splitting them lets you point at another folder — a test copy, another environment — by changing one line, without touching the file name.',
      lines: [
        L('src', K('version:') + ' ' + S('"1.0"')),
        L('src', K('sources:')),
        L('src', '  ' + K('src_sales:')),
        L('src', '    ' + K('type:') + ' ' + S('csv')),
        L('src', '    ' + K('connection:')),
        L('src', '      ' + K('base_path:') + ' ' + S('"sales/data"')),
        L('src', '    ' + K('extract:')),
        L('src', '      ' + K('table:') + ' ' + S('sales_2025-03-04.csv')),
        L('src', '      ' + K('batch_size:') + ' ' + S('10000'))
      ],
      notes: [
        ['ok','<code>src_sales</code> is a name you choose'],
        ['warn','<code>base_path</code> is resolved from where you run the command']
      ],
      status: ['ok','Step 2 · nothing to run yet'] },

    { file: 'destinations.yaml', title: 'declare the destination', goal: 'Say where the result goes.',
      bubble: 'Same shape as a source: a type, a place, a name.',
      context: 'The default write mode is <code>append</code>, which would grow the file every evening. <code>replace</code> keeps the output regenerable.',
      lines: [
        L('dest', K('version:') + ' ' + S('"1.0"')),
        L('dest', K('destinations:')),
        L('dest', '  ' + K('dest_large_orders:')),
        L('dest', '    ' + K('type:') + ' ' + S('csv')),
        L('dest', '    ' + K('connection:')),
        L('dest', '      ' + K('base_path:') + ' ' + S('"sales/out"')),
        L('dest', '    ' + K('load:')),
        L('dest', '      ' + K('table:') + ' ' + S('large_orders.csv')),
        L('dest', '      ' + K('mode:') + ' ' + S('replace'))
      ],
      notes: [['ok','<code>replace</code> empties the target before writing']],
      status: ['ok','Step 3 · nothing to run yet'] },

    { file: 'pipeline.yaml', title: 'wire the two ends', goal: 'Name the source and the destination.',
      bubble: 'Two identifiers. This is the whole file.',
      context: 'These are the names declared above, not paths. At this point the job is already runnable — it would copy the seven rows unchanged.',
      lines: [
        L('pipe', K('version:') + ' ' + S('"1.0"')),
        L('pipe', K('pipeline:')),
        L('pipe', '  ' + K('from:') + ' ' + S('src_sales')),
        L('pipe', '  ' + K('to:') + ' ' + S('dest_large_orders'))
      ],
      notes: [['ok','three files, and a working job']],
      status: ['ok','Step 4 · the job would already run'] },

    { file: 'transformations.yaml', title: 'type the amounts', goal: 'Turn the amount column into numbers.',
      bubble: 'Write steps at the root — the shape hdrctl test understands.',
      context: 'A CSV holds text. Nothing is a number until an operation says so, and the comparison in the next step depends on it.',
      lines: [
        L('tf', K('version:') + ' ' + S('"1.0"')),
        L('tf', K('steps:')),
        L('tf', '  - ' + K('cast:')),
        L('tf', '      ' + K('mapping:')),
        L('tf', '        ' + K('amount:') + ' ' + S('float'))
      ],
      notes: [['warn','under a <code>transformations</code> key, <code>hdrctl test</code> counts zero steps']],
      status: ['ok','Step 5 · one step declared'] },

    { file: 'transformations.yaml', title: 'apply the rule', goal: 'Keep the orders of 100 and above.',
      bubble: 'Second entry, after the cast. Order is the whole point.',
      context: 'Each step receives what the previous one produced. Placed first, this comparison would run against text and stop the job.',
      lines: [
        L('tf', K('version:') + ' ' + S('"1.0"')),
        L('tf', K('steps:')),
        L('tf', '  - ' + K('cast:')),
        L('tf', '      ' + K('mapping:')),
        L('tf', '        ' + K('amount:') + ' ' + S('float')),
        L('tf2', '  - ' + K('filter:')),
        L('tf2', '      ' + K('expr:') + ' ' + S('"amount &gt;= 100"'))
      ],
      notes: [['ok','the business rule now lives in a file, not in someone head']],
      status: ['ok','Step 6 · ready to check'] },

    { file: 'hdrctl test', title: 'check the manifest', goal: 'Validate the four files without touching data.',
      bubble: 'Reads the manifest, opens nothing, writes nothing.',
      context: 'It confirms the shape and names the operations it found. It does not type-check expressions, so it cannot tell you that a comparison will fail.',
      lines: [
        L('cmd', C('$ hdrctl test sales')),
        L('cmd', ''),
        L('cmd', '  ok  sources.yaml         — DSL valid'),
        L('cmd', '  ok  src_sales            — csv (local file)'),
        L('cmd', '  ok  destinations.yaml    — DSL valid'),
        L('cmd', '  ok  dest_large_orders    — mode replace'),
        L('cmd', '  ok  transformations.yaml — 2 step(s) valid'),
        L('cmd', '  Operations: cast, filter'),
        L('cmd', ''),
        L('cmd', '  ✅ All tests pass — ready to execute.')
      ],
      notes: [['ok','two steps counted, both operations named']],
      status: ['ok','Step 7 · manifest valid'] },

    { file: 'hdrctl run', title: 'run the job', goal: 'Execute it.',
      bubble: 'Seven rows in, three out.',
      context: 'The two counters bracket the job: what the source produced, and what reached the destination. The gap is the work of the steps.',
      lines: [
        L('cmd', C('$ hdrctl run sales')),
        L('cmd', ''),
        L('cmd', '  ✅ Pipeline completed successfully'),
        L('cmd', '  Rows read   : 7'),
        L('cmd', '  Rows written: 3')
      ],
      notes: [['ok','the four orders below 100 were dropped by the filter']],
      status: ['ok','Step 8 · 7 rows read · 3 written'] },

    { file: 'out/large_orders.csv', title: 'read the result', goal: 'Open the file the job produced.',
      bubble: '120.50 is written 120.5 — the trailing zero was text, not value.',
      context: 'Run the job again and the file still holds three rows: <code>mode: replace</code> empties the target first. With <code>append</code> it would grow every evening.',
      lines: [
        L('out', 'order_id,customer,city,amount,status,order_date'),
        L('out', 'A-1001,Alice Martin,Paris,120.5,paid,2025-03-04'),
        L('out', 'A-1003,Chloe Ruiz,Madrid,310.75,paid,2025-03-04'),
        L('out', 'A-1006,Farid Ziani,Nantes,260.0,paid,2025-03-04')
      ],
      notes: [
        ['ok','three orders of 100 and above'],
        ['ok','the rule is now readable, reviewable and versioned']
      ],
      status: ['ok','Done · 7 rows read · 3 written'] }
  ];

  var step = 0;

  function show(i) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    var s = STEPS[step];

    $('fileName').textContent = s.file;
    $('yaml').innerHTML = s.lines.join('\n');
    $('stepNum').textContent = String(step + 1);
    $('goalText').textContent = s.goal;
    $('tourContext').innerHTML = '<b>' + s.title + '</b><p>' + s.context + '</p>';
    $('verdict').innerHTML = s.notes.map(function (n) { return note(n[0], n[1]); }).join('');
    $('status').className = 'status ' + s.status[0];
    $('status').textContent = s.status[1];

    document.querySelectorAll('.yl').forEach(function (el) { el.classList.add('lit'); });

    var bubble = $('bubble');
    bubble.innerHTML = '<b>' + s.title + '</b><span>' + s.bubble + '</span>';
    bubble.classList.add('show');
    bubble.style.top = '10px';

    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + STEPS.length;
    $('tourTitle').textContent = s.file;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === STEPS.length - 1;
    $('tourNext').textContent = step === STEPS.length - 1 ? 'Done' : 'Next ›';
  }

  $('tourPrev').addEventListener('click', function () { show(step - 1); });
  $('tourNext').addEventListener('click', function () { show(step + 1); });
  $('resetBtn').addEventListener('click', function () { show(0); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') show(step - 1);
    if (e.key === 'ArrowRight') show(step + 1);
  });

  show(0);
})();
