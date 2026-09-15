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
})();
