/* Fichier transformations.yaml — page de documentation.
   Tous les exemples montres sont corrects. Cette page ne valide rien et ne simule aucun echec :
   ce qui peut echouer est dit en prose, jamais mis en scene.
   Les chiffres annonces viennent d'executions reelles sur examples/tutorial/01-first-job. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var C = function (t) { return '<span class="c-comment">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function note(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'root', title: 'transformations',
      bubble: 'One root key holding one list. Nothing else is read here.',
      context: 'A shorter shape is also accepted: <code>steps</code> alone at the root. Both run identically — the templates shipped by <code>hdrctl init</code> use the short one.' },
    { key: 'steps', title: 'steps',
      bubble: 'An ordered list. Each entry names one operation.',
      context: 'An entry is a mapping with a single key: the operation name. Its value holds that operation parameters. Eighteen names are accepted.' },
    { key: 'first', title: 'the first step',
      bubble: 'It receives the rows exactly as the source produced them.',
      context: 'A CSV yields text in every column. That is why this example starts with <code>cast</code> — nothing is a number until an operation says so.' },
    { key: 'second', title: 'the next step',
      bubble: 'It receives what the previous step produced, never the source.',
      context: 'The engine runs the list in the order written and never reorders it. Reading the list from top to bottom tells you exactly what each step sees.' }
  ];

  var CASES = {
    two: {
      lines: function () {
        return [
          L('root', K('transformations:')),
          L('steps', '  ' + K('steps:')),
          L('first', '    - ' + K('cast:')),
          L('first', '        ' + K('mapping:')),
          L('first', '          ' + K('amount:') + ' ' + S('float')),
          L('second', '    - ' + K('filter:')),
          L('second', '        ' + K('expr:') + ' ' + S('"amount &gt; 50"'))
        ];
      },
      notes: [
        'two steps, run in the order written',
        '<code>cast</code> turns the text column into numbers',
        '<code>filter</code> then compares numbers to a number',
        '30 rows read, 6 written'
      ],
      status: '30 rows read · 6 written'
    },
    three: {
      lines: function () {
        return CASES.two.lines().concat([
          L('third', '    - ' + K('select:')),
          L('third', '        ' + K('columns:') + ' ' + S('[order_id, customer_id, amount, status]'))
        ]);
      },
      notes: [
        'a third step narrows the columns',
        'selecting last is deliberate: the earlier steps still need the other columns',
        '30 rows read, 6 written, 4 columns kept'
      ],
      status: '30 rows read · 6 written'
    },
    short: {
      lines: function () {
        return [
          L('steps', K('steps:')),
          L('first', '  - ' + K('cast:')),
          L('first', '      ' + K('mapping:')),
          L('first', '        ' + K('amount:') + ' ' + S('float')),
          L('second', '  - ' + K('filter:')),
          L('second', '      ' + K('expr:') + ' ' + S('"amount &gt; 50"'))
        ];
      },
      notes: [
        'the <code>transformations</code> key is omitted — <code>steps</code> sits at the root',
        'identical in effect to the long form',
        'the templates of <code>hdrctl init</code> are written this way',
        '30 rows read, 6 written'
      ],
      status: '30 rows read · 6 written'
    },
    missing: {
      lines: function () {
        return [
          L('root', C('# no transformations.yaml')),
          L('steps', C('# the rows travel from source to destination unchanged'))
        ];
      },
      notes: [
        'this is the only file of a job you may omit',
        'the source is copied to the destination, unchanged',
        'sources, destinations and pipeline remain required',
        '30 rows read, 30 written'
      ],
      status: '30 rows read · 30 written'
    }
  };

  var step = 0;

  function render() {
    var c = CASES[$('selCase').value] || CASES.two;
    $('yaml').innerHTML = c.lines().join('\n');
    $('verdict').innerHTML = c.notes.map(note).join('');
    $('status').className = 'status ok';
    $('status').textContent = '✓ ' + c.status;
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

  $('selCase').addEventListener('change', render);
  $('resetBtn').addEventListener('click', function () { $('selCase').value = 'two'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });

  render();
})();
