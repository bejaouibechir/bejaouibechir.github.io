(function () {
  var theme = document.getElementById('themeBtn');
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');

  if (theme) theme.addEventListener('click', function () {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('hydra-theme', next); } catch (_) {}
  });

  if (burger && drawer) burger.addEventListener('click', function () {
    var open = drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  /* Copie d'une commande : le bouton porte data-copy avec le texte a copier. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });

  /* Selecteur de manifeste : un onglet par fichier, tout le contenu est deja
     dans le DOM. Aucun appel reseau, navigation clavier fleches + Home/End. */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.demo-pick button'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.demo-view [data-panel]'));
  var fileLabel = document.getElementById('demoFile');
  var noteLabel = document.getElementById('demoNote');

  function show(index, focus) {
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, i) { p.hidden = i !== index; });
    if (fileLabel) fileLabel.textContent = tabs[index].getAttribute('data-file') || '';
    if (noteLabel) noteLabel.innerHTML = tabs[index].getAttribute('data-note') || '';
    if (focus) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { show(i, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); show(next, true); }
    });
  });

  if (tabs.length) show(0, false);
})();
