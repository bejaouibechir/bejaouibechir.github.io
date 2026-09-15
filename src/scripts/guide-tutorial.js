(function () {
  var dataNode = document.getElementById('guideTutorialData');
  if (!dataNode) return;
  var steps = JSON.parse(dataNode.textContent || '[]');
  var step = 0;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (value) {
    return String(value).replace(/[&<>]/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;'}[char];
    });
  };
  function highlighted(code) {
    return String(code).split('\n').map(function (line) {
      var safe = esc(line);
      safe = safe.replace(/^(\s*)([A-Za-z_][\w.-]*:)/, '$1<span class="c-key">$2</span>');
      safe = safe.replace(/(\$\{ENV:[A-Z0-9_]+\})/g, '<span class="c-str">$1</span>');
      return '<span class="yl lit">' + safe + '</span>';
    }).join('\n');
  }
  function note(item) {
    return '<div class="vrow"><span class="vdot ' + item[0] + '" aria-hidden="true"></span><span>' + item[1] + '</span></div>';
  }
  function show(index) {
    step = Math.max(0, Math.min(steps.length - 1, index));
    var current = steps[step];
    $('fileName').textContent = current.file;
    $('yaml').innerHTML = highlighted(current.code);
    $('stepNum').textContent = String(step + 1);
    $('goalText').textContent = current.goal;
    $('tourContext').innerHTML = '<b>' + esc(current.title) + '</b><p>' + current.context + '</p>';
    $('verdict').innerHTML = current.notes.map(note).join('');
    $('status').className = 'status ok';
    $('status').textContent = current.status;
    var bubble = $('bubble');
    bubble.innerHTML = '<b>' + esc(current.title) + '</b><span>' + current.bubble + '</span>';
    bubble.classList.add('show');
    bubble.style.top = '10px';
    $('tourCount').textContent = 'Step ' + (step + 1) + ' of ' + steps.length;
    $('tourTitle').textContent = current.file;
    $('tourPrev').disabled = step === 0;
    $('tourNext').disabled = step === steps.length - 1;
    $('tourNext').textContent = step === steps.length - 1 ? 'Done' : 'Next ›';
  }
  $('tourPrev').addEventListener('click', function () { show(step - 1); });
  $('tourNext').addEventListener('click', function () { show(step + 1); });
  $('resetBtn').addEventListener('click', function () { show(0); });
  document.addEventListener('keydown', function (event) {
    if (event.target && /INPUT|SELECT|TEXTAREA/.test(event.target.tagName || '')) return;
    if (event.key === 'ArrowLeft') show(step - 1);
    if (event.key === 'ArrowRight') show(step + 1);
  });
  show(0);
})();

