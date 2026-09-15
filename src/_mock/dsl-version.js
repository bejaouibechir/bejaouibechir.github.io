/* Element version — page de documentation.
   Les deux exemples montres sont corrects : la cle presente, la cle absente.
   Cette page ne valide rien et ne simule aucun echec.
   Verifie en retirant version des quatre fichiers de examples/tutorial/01-first-job :
   30 lignes lues, 6 ecrites, identique. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function row(state, text) { return '<div class="vrow"><span class="vdot ' + state + '" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'version', title: 'version',
      bubble: 'A single key, first line, in every manifest file.',
      context: 'It states which shape of the language the file was written for. Hydra has published one shape so far, so every example you will see says <code>"1.0"</code>.' },
    { key: 'sources', title: 'the rest of the file',
      bubble: 'Everything below is what the parser actually reads.',
      context: 'The parser builds its model from <code>sources</code>, <code>transformations</code>, <code>destinations</code> and <code>pipeline</code>. <code>version</code> is not part of any of those models.' },
    { key: 'version', title: 'omitting it',
      bubble: 'Switch the selector: the manifest without the line is just as valid.',
      context: 'Removing it from all four files of a working job changes nothing — the same thirty rows are read and the same six are written. Writing it remains the better habit: it dates the file for whoever opens it next.' },
    { key: 'version', title: 'where it is read',
      bubble: 'In workflow.yaml only — and even there, only stored.',
      context: 'The workflow model has a <code>version</code> field defaulting to <code>"1.0"</code>. It is kept with the definition and never compared to anything. No migration, no refusal, no warning.' }
  ];

  var step = 0;

  function render() {
    var v = $('selVersion').value;
    var lines = [];
    if (v === '') lines.push(L('version', '<span class="c-comment"># the version line is omitted</span>'));
    else lines.push(L('version', K('version:') + ' ' + S('"' + v + '"')));
    lines.push(L('sources', K('sources:')));
    lines.push(L('sources', '  ' + K('src_orders:')));
    lines.push(L('sources', '    ' + K('type:') + ' ' + S('csv')));
    lines.push(L('sources', '    ' + K('extract:')));
    lines.push(L('sources', '      ' + K('table:') + ' ' + S('orders.csv')));
    $('yaml').innerHTML = lines.join('\n');

    var h = '';
    h += row('ok', v === '' ? 'the line is omitted — a valid manifest, and the common shorthand'
                            : 'the line states which shape of the language the file targets');
    h += row('ok', 'no job parser reads this key, so both files behave the same');
    h += row('ok', 'in workflow.yaml the key is stored on the definition, and compared to nothing');
    h += row('ok', 'run: 30 rows read, 6 written');
    $('verdict').innerHTML = h;

    $('status').className = 'status ok';
    $('status').textContent = '✓ 30 rows read · 6 written';

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

  $('selVersion').addEventListener('change', render);
  $('resetBtn').addEventListener('click', function () { $('selVersion').value = '1.0'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });

  render();
})();
