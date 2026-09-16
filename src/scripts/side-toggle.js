/* Ouvre ou ferme le sommaire lateral replie sur mobile (voir mobile-fixes.css). */
(function () {
  document.querySelectorAll('[data-side-toggle]').forEach(function (btn) {
    var side = btn.parentElement;
    btn.addEventListener('click', function () {
      var open = side.classList.toggle('side-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();
