/* workflow.yaml — each selector value is a complete, valid workflow. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var K = function (t) { return '<span class="c-key">' + t + '</span>'; };
  var S = function (t) { return '<span class="c-str">' + t + '</span>'; };
  var L = function (key, html) { return '<span class="yl" data-key="' + key + '">' + html + '</span>'; };
  function row(text) { return '<div class="vrow"><span class="vdot ok" aria-hidden="true"></span><span>' + text + '</span></div>'; }

  var TOUR = [
    { key: 'identity', title: 'identity', bubble: 'A name for the graph, plus an optional description.', context: 'The workflow name appears in logs and results. Its version defaults to <code>"1.0"</code> when omitted.' },
    { key: 'trigger', title: 'trigger', bubble: 'How this graph is meant to start.', context: 'A trigger may be manual, scheduled with a cron expression, or exposed to a webhook. Running the CLI command starts it immediately.' },
    { key: 'step', title: 'steps', bubble: 'Each node is either a Hydra job or an action.', context: 'A job points to a job directory. An action names a built-in operation and supplies its parameters.' },
    { key: 'depends', title: 'depends_on', bubble: 'Edges, not list position, establish the graph.', context: 'Steps whose dependencies are complete share an execution group. If several are ready together, the runner executes them in parallel.' }
  ];
  var step = 0;

  function sequenceLines() {
    return [
      L('identity', K('workflow:')),
      L('identity', '  ' + K('name:') + ' ' + S('demo_pipeline')),
      L('trigger', '  ' + K('trigger:')),
      L('trigger', '    ' + K('type:') + ' ' + S('manual')),
      L('step', '  ' + K('steps:')),
      L('step', '    - ' + K('name:') + ' ' + S('extract_csv')),
      L('step', '      ' + K('type:') + ' ' + S('job')),
      L('step', '      ' + K('job:') + ' ' + S('"../../examples/minimal_csv"')),
      L('step', '    - ' + K('name:') + ' ' + S('notify')),
      L('step', '      ' + K('type:') + ' ' + S('action')),
      L('step', '      ' + K('action:') + ' ' + S('log')),
      L('step', '      ' + K('params:') + ' { ' + K('message:') + ' ' + S('"Pipeline complete."') + ' }'),
      L('depends', '      ' + K('depends_on:') + ' [' + S('extract_csv') + ']')
    ];
  }

  function render() {
    var choice = $('selCase').value;
    var lines = sequenceLines();
    var notes;
    if (choice === 'fanout') {
      lines = lines.concat([
        L('step', '    - ' + K('name:') + ' ' + S('audit')),
        L('step', '      ' + K('type:') + ' ' + S('action')),
        L('step', '      ' + K('action:') + ' ' + S('log')),
        L('step', '      ' + K('params:') + ' { ' + K('message:') + ' ' + S('"Audit complete."') + ' }'),
        L('depends', '      ' + K('depends_on:') + ' [' + S('extract_csv') + ']')
      ]);
      notes = ['group 1 contains <code>extract_csv</code>', 'group 2 contains <code>notify</code> and <code>audit</code>', 'the two actions are ready together and may run in parallel'];
      $('status').textContent = '✓ 3 steps · 2 execution groups';
    } else if (choice === 'scheduled') {
      lines = [
        L('identity', K('workflow:')),
        L('identity', '  ' + K('name:') + ' ' + S('daily_orders')),
        L('trigger', '  ' + K('trigger:')),
        L('trigger', '    ' + K('type:') + ' ' + S('schedule')),
        L('trigger', '    ' + K('cron:') + ' ' + S('"0 6 * * *"')),
        L('step', '  ' + K('steps:')),
        L('step', '    - ' + K('name:') + ' ' + S('extract_csv')),
        L('step', '      ' + K('type:') + ' ' + S('job')),
        L('step', '      ' + K('job:') + ' ' + S('"../../examples/minimal_csv"'))
      ];
      notes = ['the cron expression belongs to a <code>schedule</code> trigger', 'one job step forms one execution group', '<code>hdrctl workflow run</code> can still start it immediately'];
      $('status').textContent = '✓ 1 scheduled job · valid graph';
    } else {
      notes = ['group 1 runs <code>extract_csv</code>', '<code>notify</code> waits for that named step', 'the verified run completed 2 of 2 steps'];
      $('status').textContent = '✓ 2 of 2 steps completed';
    }
    $('yaml').innerHTML = lines.join('\n');
    $('verdict').innerHTML = notes.map(row).join('');
    $('status').className = 'status ok';
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
  $('resetBtn').addEventListener('click', function () { $('selCase').value = 'sequence'; step = 0; render(); });
  $('tourPrev').addEventListener('click', function () { showStep(step - 1); });
  $('tourNext').addEventListener('click', function () { showStep(step + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') showStep(step - 1);
    if (e.key === 'ArrowRight') showStep(step + 1);
  });
  render();
})();
