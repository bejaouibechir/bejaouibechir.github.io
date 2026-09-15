/* Fichier sources.yaml — page de documentation.
   Tous les exemples montres sont corrects. Cette page ne valide rien et ne simule aucun echec :
   ce que le moteur exige est dit en prose, jamais mis en scene.
   Chiffres verifies sur examples/tutorial/01-first-job. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function row(state, text) { return '<div class="vrow"><span class="vdot ' + state + '" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'root', title: 'sources',
      bubble: 'The single root key of the file. Everything lives under it.',
      context: 'The file holds one mapping. Its keys are identifiers you invent, its values are declarations. Nothing else is read at this level.' },
    { key: 'id', title: 'an identifier',
      bubble: 'A name local to the job. You choose it.',
      context: 'It is what <code>pipeline.from</code> points to, and what <code>join.right</code> may reference. Nothing outside the job depends on it.' },
    { key: 'decl', title: 'a declaration',
      bubble: 'Four keys: type, connection, extract, schema.',
      context: 'This is the shape covered by the connectors page. Here we only care that a declaration is an entry in a catalogue — inert until something calls it.' },
    { key: 'second', title: 'a second entry',
      bubble: 'Declared is not opened. Only what is referenced is instantiated.',
      context: 'A source nobody references is never built. Its type is never checked, its file is never looked for. Only the entries something points at are ever built.' }
  ];

  var CASES = {
    one: {
      lines: function () {
        return [
          L('root', K('sources:')),
          L('id', '  ' + K('src_orders:')),
          L('decl', '    ' + K('type:') + ' ' + S('csv')),
          L('decl', '    ' + K('extract:')),
          L('decl', '      ' + K('table:') + ' ' + S('orders.csv'))
        ];
      },
      verdict: [
        ['ok', 'one source declared, and it is the one <code>pipeline.from</code> names'],
        ['ok', 'the connector is built, the file is opened'],
        ['ok', 'run: 30 rows read, 6 written']
      ],
      status: ['ok', '✓ 30 rows read · 6 written']
    },
    two: {
      lines: function () {
        return CASES.one.lines().concat([
          L('second', '  ' + K('src_customers:')),
          L('second', '    ' + K('type:') + ' ' + S('csv')),
          L('second', '    ' + K('extract:')),
          L('second', '      ' + K('table:') + ' ' + S('customers.csv'))
        ]);
      },
      verdict: [
        ['ok', 'two sources declared — the file is a catalogue'],
        ['ok', 'only <code>src_orders</code> is referenced, so only it is built'],
        ['ok', '<code>src_customers</code> is never opened — no connector, no file access'],
        ['ok', 'run: 30 rows read, 6 written']
      ],
      status: ['ok', '✓ 30 rows read · 6 written']
    },
    both: {
      lines: function () {
        return CASES.two.lines();
      },
      verdict: [
        ['ok', 'both entries are referenced: <code>pipeline.from</code> and <code>join.right</code>'],
        ['ok', 'two connectors are built, two files are opened'],
        ['ok', 'the catalogue is fully used — which is the exception, not the rule']
      ],
      status: ['ok', '✓ two sources opened']
    }
  };

  var step = 0;

  function render() {
    var c = CASES[$('selCase').value] || CASES.one;
    $('yaml').innerHTML = c.lines().join('\n');
    $('verdict').innerHTML = c.verdict.map(function (v) { return row(v[0], v[1]); }).join('');
    $('status').className = 'status ' + c.status[0];
    $('status').textContent = c.status[1];
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
      var mid = (first.top + last.bottom) / 2 - wrap.top + $('codewrap').scrollTop;
      bubble.style.top = Math.max(8, mid - bubble.offsetHeight / 2) + 'px';
    }

    $('tourContext').innerHTML = '<b>' + s.title + '</b><p>' + s.context + '</p>';
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + TOUR.length;
    $('tourTitle').textContent = s.title;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === TOUR.length - 1;
    $('tourNext').textContent = step === TOUR.length - 1 ? 'End of walkthrough' : 'Next ›';
  }

  $('selCase').addEventListener('change', function () {
    /* la 4e etape parle de la seconde entree : inutile quand il n'y en a pas */
    if (this.value === 'one' && step === 3) step = 2;
    render();
  });
  $('resetBtn').addEventListener('click', function () { $('selCase').value = 'one'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () {
    /* montrer la seconde entree quand la visite y arrive */
    if (step === 2 && $('selCase').value === 'one') { $('selCase').value = 'two'; render(); }
    showStep(step + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });

  render();
})();
