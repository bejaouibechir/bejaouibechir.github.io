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

  /* ── Agrandissement : survol = affordance loupe, clic = plein ecran ──────── */
  var overlay = document.getElementById('zoomOverlay');
  var stage = document.getElementById('zoomStage');
  var zoomClose = document.getElementById('zoomClose');
  var lastZoomTrigger = null;

  function openZoom(id, trigger) {
    var src = document.getElementById(id);
    if (!src || !overlay || !stage) return;
    var copy = src.cloneNode(true);
    copy.removeAttribute('id');
    /* Les commandes de zoom n'ont plus de sens une fois la vue agrandie. */
    Array.prototype.forEach.call(copy.querySelectorAll('.zoom-btn,.zoom-hint'), function (n) {
      n.parentNode.removeChild(n);
    });
    /* Reprefixer les id clones pour ne pas dupliquer ceux du document. */
    Array.prototype.forEach.call(copy.querySelectorAll('[id]'), function (n) {
      n.setAttribute('id', 'zoom-' + n.getAttribute('id'));
    });
    var refs = [copy].concat(Array.prototype.slice.call(copy.querySelectorAll('[marker-end],[aria-labelledby]')));
    refs.forEach(function (n) {
      var me = n.getAttribute && n.getAttribute('marker-end');
      if (me) n.setAttribute('marker-end', me.replace('url(#', 'url(#zoom-'));
      var al = n.getAttribute && n.getAttribute('aria-labelledby');
      if (al) n.setAttribute('aria-labelledby', al.replace(/(\S+)/g, 'zoom-$1'));
    });
    stage.innerHTML = '';
    stage.appendChild(copy);
    overlay.hidden = false;
    document.body.classList.add('zoom-open');
    lastZoomTrigger = trigger || null;
    if (zoomClose) zoomClose.focus();
  }

  function closeZoom() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    stage.innerHTML = '';
    document.body.classList.remove('zoom-open');
    if (lastZoomTrigger && typeof lastZoomTrigger.focus === 'function') lastZoomTrigger.focus();
    lastZoomTrigger = null;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-zoom]'), function (el) {
    el.addEventListener('click', function (e) {
      /* Un lien interne a la carte doit rester cliquable. */
      if (!el.classList.contains('zoom-btn') && e.target.closest && e.target.closest('a')) return;
      e.preventDefault();
      e.stopPropagation();
      openZoom(el.getAttribute('data-zoom'), el);
    });
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openZoom(el.getAttribute('data-zoom'), el);
        }
      });
    }
  });

  if (zoomClose) zoomClose.addEventListener('click', closeZoom);
  if (overlay) overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeZoom();
  });

  /* ── Popovers de termes : survol, clic et clavier ────────────────────────── */
  var pop = document.getElementById('termPop');
  var openTerm = null;
  var pinned = false;
  var showTimer = null;
  var hideTimer = null;

  function place(btn) {
    if (!pop) return;
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth;
    var h = pop.offsetHeight;
    var gap = 10;
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
    var top = r.bottom + gap;
    if (top + h > window.innerHeight - 12) {
      var above = r.top - gap - h;
      top = above > 12 ? above : Math.max(12, window.innerHeight - h - 12);
    }
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }

  function showTerm(btn) {
    if (!pop) return;
    var tpl = document.getElementById('term-' + btn.getAttribute('data-term'));
    if (!tpl) return;
    if (openTerm && openTerm !== btn) openTerm.setAttribute('aria-expanded', 'false');
    pop.innerHTML = '';
    pop.appendChild(tpl.content.cloneNode(true));
    pop.hidden = false;
    openTerm = btn;
    btn.setAttribute('aria-expanded', 'true');
    place(btn);
  }

  function hideTerm() {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    pop.innerHTML = '';
    if (openTerm) openTerm.setAttribute('aria-expanded', 'false');
    openTerm = null;
    pinned = false;
  }

  function scheduleShow(btn) {
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { showTerm(btn); }, 120);
  }

  function scheduleHide() {
    if (pinned) return;
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideTerm, 220);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.term[data-term]'), function (btn) {
    btn.addEventListener('mouseenter', function () { scheduleShow(btn); });
    btn.addEventListener('mouseleave', scheduleHide);
    btn.addEventListener('focus', function () { pinned = true; showTerm(btn); });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (openTerm === btn && pinned) { hideTerm(); return; }
      pinned = true;
      showTerm(btn);
    });
  });

  if (pop) {
    pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('mouseleave', scheduleHide);
  }

  document.addEventListener('click', function (e) {
    if (!openTerm) return;
    if (e.target.closest && (e.target.closest('.term-pop') || e.target.closest('.term'))) return;
    hideTerm();
  });

  window.addEventListener('scroll', function () {
    if (openTerm) place(openTerm);
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (openTerm) place(openTerm);
  });

  /* ── Carrousel de captures : survol = affordance, clic = modale ─────────── */
  var galleries = {};
  try {
    var raw = document.getElementById('galleryData');
    if (raw) galleries = JSON.parse(raw.textContent || '{}');
  } catch (_) {}

  var shots = document.getElementById('shots');
  var shotsImg = document.getElementById('shotsImg');
  var shotsTitle = document.getElementById('shotsTitle');
  var shotsEyebrow = document.getElementById('shotsEyebrow');
  var shotsCaption = document.getElementById('shotsCaption');
  var shotsCount = document.getElementById('shotsCount');
  var shotsDots = document.getElementById('shotsDots');
  var shotsLink = document.getElementById('shotsLink');
  var shotsPrev = document.getElementById('shotsPrev');
  var shotsNext = document.getElementById('shotsNext');
  var shotsClose = document.getElementById('shotsClose');

  var current = null;
  var index = 0;
  var lastShotsTrigger = null;

  function preload(src) { if (src) { var i = new Image(); i.src = src; } }

  function renderShot() {
    if (!current) return;
    var list = current.shots;
    var shot = list[index];
    if (!shot) return;

    shotsImg.src = shot.src;
    shotsImg.alt = shot.caption || (current.eyebrow + ' screenshot ' + (index + 1));
    /* Les captures n'ont pas le meme ratio : on fixe les dimensions natives
       et le CSS contient l'image dans la scene sans la deformer. */
    if (shot.w && shot.h) {
      shotsImg.setAttribute('width', shot.w);
      shotsImg.setAttribute('height', shot.h);
      shotsImg.style.aspectRatio = shot.w + ' / ' + shot.h;
    } else {
      shotsImg.removeAttribute('width');
      shotsImg.removeAttribute('height');
      shotsImg.style.aspectRatio = '';
    }

    shotsCaption.textContent = shot.caption || '';
    shotsCaption.hidden = !shot.caption;
    shotsCount.textContent = (index + 1) + ' / ' + list.length;

    Array.prototype.forEach.call(shotsDots.children, function (d, i) {
      d.classList.toggle('on', i === index);
      d.setAttribute('aria-selected', String(i === index));
    });

    var single = list.length < 2;
    shotsPrev.hidden = single;
    shotsNext.hidden = single;
    shotsDots.hidden = single;

    preload((list[index + 1] || {}).src);
    preload((list[index - 1] || {}).src);
  }

  function go(step) {
    if (!current) return;
    var n = current.shots.length;
    index = (index + step + n) % n;
    renderShot();
  }

  function openShots(key, trigger) {
    var g = galleries[key];
    if (!g || !g.shots || !g.shots.length || !shots) return;
    current = g;
    index = 0;

    shotsEyebrow.textContent = g.eyebrow || '';
    shotsTitle.textContent = g.title || '';
    if (g.link) {
      shotsLink.href = g.link.href;
      shotsLink.textContent = g.link.label + ' →';
      shotsLink.hidden = false;
    } else {
      shotsLink.hidden = true;
    }

    shotsDots.innerHTML = '';
    g.shots.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'shots-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Screenshot ' + (i + 1));
      dot.addEventListener('click', function () { index = i; renderShot(); });
      shotsDots.appendChild(dot);
    });

    renderShot();
    shots.hidden = false;
    document.body.classList.add('zoom-open');
    lastShotsTrigger = trigger || null;
    shotsClose.focus();
  }

  function closeShots() {
    if (!shots || shots.hidden) return;
    shots.hidden = true;
    shotsImg.removeAttribute('src');
    current = null;
    document.body.classList.remove('zoom-open');
    if (lastShotsTrigger && typeof lastShotsTrigger.focus === 'function') lastShotsTrigger.focus();
    lastShotsTrigger = null;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-gallery]'), function (el) {
    var key = el.getAttribute('data-gallery');
    if (!galleries[key] || !galleries[key].shots || !galleries[key].shots.length) {
      el.classList.add('shot-empty');
      return;
    }
    el.addEventListener('click', function (e) {
      /* Les liens internes a la carte restent cliquables. */
      if (e.target.closest && e.target.closest('a')) return;
      e.preventDefault();
      openShots(key, el);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target !== el) return;
      e.preventDefault();
      openShots(key, el);
    });
  });

  if (shotsPrev) shotsPrev.addEventListener('click', function () { go(-1); });
  if (shotsNext) shotsNext.addEventListener('click', function () { go(1); });
  if (shotsClose) shotsClose.addEventListener('click', closeShots);
  if (shots) shots.addEventListener('click', function (e) {
    if (e.target === shots) closeShots();
  });

  /* Balayage tactile. */
  var touchX = null;
  if (shots) {
    shots.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    shots.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  document.addEventListener('keydown', function (e) {
    if (shots && !shots.hidden) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape') { e.preventDefault(); closeShots(); }
      return;
    }
    if (e.key !== 'Escape') return;
    if (overlay && !overlay.hidden) closeZoom();
    else hideTerm();
  });
})();
