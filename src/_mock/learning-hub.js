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

  /* ── Agrandissement des captures ────────────────────────────────────────
     Les captures sont affichees tres reduites, parfois a deux par ligne. Un
     clic ouvre l'image a sa taille reelle dans un <dialog> modal : le piege du
     focus, la fermeture par Echap et la restitution du focus sont natifs, donc
     rien a reimplementer. Aucun appel reseau : l'image est deja chargee.
     Sans <dialog> (navigateur ancien), les images restent simplement inertes. */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot img'));
  if (shots.length && typeof HTMLDialogElement === 'function') {
    var box = document.createElement('dialog');
    box.className = 'lightbox';
    box.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close the enlarged view">Close</button>' +
      '<img alt="" /><p class="lightbox-cap"></p>';
    document.body.appendChild(box);

    var full = box.querySelector('img');
    var cap = box.querySelector('.lightbox-cap');

    function open(img) {
      full.src = img.currentSrc || img.src;
      full.alt = img.alt || '';
      var fig = img.closest('figure');
      var legend = fig ? fig.querySelector('figcaption') : null;
      cap.textContent = legend ? legend.textContent : '';
      box.showModal();
    }

    shots.forEach(function (img) {
      /* L'image devient un controle a part entiere : atteignable au clavier,
         annoncee comme un bouton, activable par Entree comme par Espace. */
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge this screenshot' + (img.alt ? ': ' + img.alt : ''));
      img.addEventListener('click', function () { open(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          open(img);
        }
      });
    });

    box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
    /* Un clic hors de l'image ferme : la cible est alors le dialog lui-meme. */
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  }

  /* ── Sommaire : l'atelier visible s'allume dans le menu de gauche ───────── */
  var links = Array.prototype.slice.call(document.querySelectorAll('a.outline-item[data-lesson]'));
  if (!links.length) return;

  var cards = links.map(function (a) { return document.getElementById(a.getAttribute('data-lesson')); });

  function markCurrent(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('data-lesson') === id;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null;
      var bestRatio = 0;
      cards.forEach(function (c) {
        if (!c) return;
        var r = visible[c.id] || 0;
        if (r > bestRatio) { bestRatio = r; best = c.id; }
      });
      if (best) markCurrent(best);
    }, { rootMargin: '-70px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });
    cards.forEach(function (c) { if (c) io.observe(c); });
  }

  /* Le clic allume immediatement, sans attendre la fin du defilement. */
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('data-lesson');
      markCurrent(id);
      var card = document.getElementById(id);
      if (!card) return;
      card.classList.add('lit');
      setTimeout(function () { card.classList.remove('lit'); }, 1400);
    });
  });

})();

