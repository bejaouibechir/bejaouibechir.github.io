/* Recherche plein texte du site.
   1. Palette Ctrl/Cmd+K : interroge /search-index.json et classe les sections.
   2. A l'arrivee sur ?q=... : surligne le terme, defile jusqu'a lui, le selectionne. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var overlay = $('#hsOverlay');
  var input = $('#hsInput');
  var listEl = $('#hsResults');
  var countEl = $('#hsCount');
  var index = null, loading = null, rows = [], cursor = 0, query = '';

  /* ---------- index ---------- */

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('/search-index.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { index = d; return d; })
        .catch(function () { index = []; return index; });
    }
    return loading;
  }

  /* Minuscule seulement : les index doivent rester alignes sur le texte source. */
  function norm(s) { return s.toLowerCase(); }

  function termsOf(q) {
    return norm(q).split(/[^a-z0-9_.:-]+/).filter(function (t) { return t.length > 1; });
  }

  /* Un enregistrement marque des points sur le titre de page, le titre de
     section et le corps. Tous les termes doivent apparaitre quelque part. */
  function score(rec, terms, phrase) {
    var page = norm(rec.p), sec = norm(rec.s), body = norm(rec.t);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (sec.indexOf(t) >= 0) { hit += 14; if (new RegExp('\\b' + t).test(sec)) hit += 6; }
      if (page.indexOf(t) >= 0) hit += 8;
      var n = body.split(t).length - 1;
      if (n) hit += Math.min(n, 6) * 2;
      if (!hit) return 0;
      total += hit;
    }
    if (phrase.length > 2) {
      if (sec.indexOf(phrase) >= 0) total += 30;
      if (body.indexOf(phrase) >= 0) total += 12;
    }
    if (rec.n === 2) total += 2;
    return total;
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = esc(text), low = norm(out), marks = [];
    terms.forEach(function (t) {
      var from = 0, i;
      while ((i = low.indexOf(t, from)) >= 0) { marks.push([i, i + t.length]); from = i + t.length; }
    });
    if (!marks.length) return out;
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [marks[0]];
    for (var k = 1; k < marks.length; k++) {
      var last = merged[merged.length - 1];
      if (marks[k][0] <= last[1]) last[1] = Math.max(last[1], marks[k][1]);
      else merged.push(marks[k]);
    }
    var res = '', at = 0;
    merged.forEach(function (m) {
      res += out.slice(at, m[0]) + '<mark>' + out.slice(m[0], m[1]) + '</mark>';
      at = m[1];
    });
    return res + out.slice(at);
  }

  /* Extrait centre sur la premiere occurrence. */
  function snippet(rec, terms) {
    var body = rec.t, low = norm(body), at = -1;
    for (var i = 0; i < terms.length && at < 0; i++) at = low.indexOf(terms[i]);
    if (at < 0) at = 0;
    var start = Math.max(0, at - 70);
    var end = Math.min(body.length, start + 190);
    var cut = body.slice(start, end);
    return (start ? '… ' : '') + cut + (end < body.length ? ' …' : '');
  }

  /* ---------- rendu ---------- */

  function render() {
    if (!query.trim()) {
      listEl.innerHTML = '<li class="hs-empty">Type to search every page of this site.</li>';
      countEl.textContent = '';
      rows = [];
      return;
    }
    var terms = termsOf(query), phrase = norm(query.trim());
    if (!terms.length) { listEl.innerHTML = '<li class="hs-empty">Keep typing…</li>'; return; }

    rows = [];
    for (var i = 0; i < index.length; i++) {
      var s = score(index[i], terms, phrase);
      if (s > 0) rows.push({ r: index[i], s: s });
    }
    rows.sort(function (a, b) { return b.s - a.s; });
    rows = rows.slice(0, 40);

    if (!rows.length) {
      listEl.innerHTML = '<li class="hs-empty">No match for “' + esc(query) + '”.</li>';
      countEl.textContent = '';
      return;
    }
    cursor = 0;
    countEl.textContent = rows.length + (rows.length === 40 ? '+ results' : ' results');
    listEl.innerHTML = rows.map(function (row, i) {
      var r = row.r;
      var crumb = esc(r.p) + (r.s ? ' ›' : '');
      return '<li><a class="hs-item' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" href="' + linkFor(r) + '">' +
        '<span class="hs-crumb">' + crumb + '</span>' +
        '<span class="hs-title">' + (r.s ? highlight(r.s, terms) : esc(r.p)) + '</span>' +
        '<span class="hs-snip">' + highlight(snippet(r, terms), terms) + '</span></a></li>';
    }).join('');
  }

  function linkFor(r) {
    return r.u + '?q=' + encodeURIComponent(query.trim()) + (r.a ? '&s=' + encodeURIComponent(r.a) : '');
  }

  function move(step) {
    var items = listEl.querySelectorAll('.hs-item');
    if (!items.length) return;
    items[cursor] && items[cursor].classList.remove('on');
    cursor = (cursor + step + items.length) % items.length;
    items[cursor].classList.add('on');
    items[cursor].scrollIntoView({ block: 'nearest' });
  }

  /* ---------- ouverture ---------- */

  function open() {
    if (!overlay) return;
    overlay.classList.add('open');
    input.focus();
    input.select();
    load().then(function () { if (overlay.classList.contains('open')) render(); });
  }

  function close() {
    if (overlay) overlay.classList.remove('open');
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function () { query = this.value; if (index) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        var item = listEl.querySelectorAll('.hs-item')[cursor];
        if (item) { e.preventDefault(); location.href = item.getAttribute('href'); }
      }
    });
    listEl.addEventListener('mousemove', function (e) {
      var a = e.target.closest && e.target.closest('.hs-item');
      if (!a) return;
      var i = +a.getAttribute('data-i');
      if (i !== cursor) { listEl.querySelectorAll('.hs-item').forEach(function (n) { n.classList.remove('on'); }); a.classList.add('on'); cursor = i; }
    });
  }

  /* Tous les boutons de recherche du site ouvrent cette palette. */
  document.querySelectorAll('#searchBtn, button.search, [data-site-search]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(); }, true);
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'k') {
      e.preventDefault(); e.stopPropagation(); open();
    } else if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      e.stopPropagation(); close();
    }
  }, true);

  /* ---------- arrivee sur la page cible ---------- */

  var bar = $('#hsBar'), barCount = $('#hsBarCount');
  var hits = [], at = 0;

  /* Meme regle que l'indexeur : les balises internes valent un espace,
     sans quoi <h3><i>01</i>Declare…</h3> ne produirait pas le meme slug. */
  function slugify(el) {
    var text = typeof el === 'string' ? el : el.innerHTML.replace(/<[^>]+>/g, ' ');
    return text.replace(/\s+/g, ' ').trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  function textRoot() {
    return $('main') || $('.main-inner') || $('.doc') || document.body;
  }

  var SKIP = /^(script|style|noscript|textarea|mark|input|select)$/i;

  function collectTextNodes(root) {
    var out = [], walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        while (p && p !== root) {
          if (SKIP.test(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.closest && (p.classList.contains('hs-overlay') || p.classList.contains('hs-bar'))) return NodeFilter.FILTER_REJECT;
          if (/^(NAV|HEADER|ASIDE)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  function markAll(q) {
    var root = textRoot();
    var needle = norm(q);
    var nodes = collectTextNodes(root);
    var made = [];
    nodes.forEach(function (node) {
      var low = norm(node.nodeValue);
      if (low.indexOf(needle) < 0) return;
      var cur = node, offset = 0, i;
      while ((i = norm(cur.nodeValue).indexOf(needle, offset)) >= 0) {
        var after = cur.splitText(i);
        var rest = after.splitText(needle.length);
        var m = document.createElement('mark');
        m.className = 'hs-hit';
        m.textContent = after.nodeValue;
        after.parentNode.replaceChild(m, after);
        made.push(m);
        cur = rest;
        offset = 0;
        if (!cur.nodeValue) break;
      }
    });
    return made;
  }

  function focusHit(i) {
    if (!hits.length) return;
    hits[at] && hits[at].classList.remove('is-current');
    at = (i + hits.length) % hits.length;
    var m = hits[at];
    m.classList.add('is-current');
    m.scrollIntoView({ block: 'center', behavior: 'smooth' });
    try {
      var sel = window.getSelection(), range = document.createRange();
      range.selectNodeContents(m);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (err) { /* selection indisponible */ }
    if (barCount) barCount.textContent = (at + 1) + ' / ' + hits.length;
  }

  function clearHits() {
    hits.forEach(function (m) {
      var t = document.createTextNode(m.textContent);
      m.parentNode.replaceChild(t, m);
      t.parentNode.normalize();
    });
    hits = [];
    if (bar) bar.classList.remove('open');
    try { window.getSelection().removeAllRanges(); } catch (e) { /* ignore */ }
    var u = new URL(location.href);
    u.searchParams.delete('q'); u.searchParams.delete('s');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  }

  function arrive() {
    var params = new URLSearchParams(location.search);
    var q = params.get('q');
    if (!q) return;
    hits = markAll(q.trim());
    if (!hits.length) {
      var first = termsOf(q)[0];
      if (first) hits = markAll(first);
    }
    if (!hits.length) return;

    /* La section demandee sert de point de depart. */
    var start = 0, wanted = params.get('s');
    if (wanted) {
      var heads = textRoot().querySelectorAll('h1, h2, h3');
      for (var i = 0; i < heads.length; i++) {
        if (slugify(heads[i]) === wanted.replace(/-\d+$/, '')) {
          for (var j = 0; j < hits.length; j++) {
            if (heads[i].compareDocumentPosition(hits[j]) & Node.DOCUMENT_POSITION_FOLLOWING) { start = j; break; }
          }
          break;
        }
      }
    }
    if (bar) bar.classList.add('open');
    setTimeout(function () { focusHit(start); }, 60);
  }

  if (bar) {
    $('#hsPrev').addEventListener('click', function () { focusHit(at - 1); });
    $('#hsNext').addEventListener('click', function () { focusHit(at + 1); });
    $('#hsClear').addEventListener('click', clearHits);
    document.addEventListener('keydown', function (e) {
      if (!hits.length || (overlay && overlay.classList.contains('open'))) return;
      if (e.key === 'Escape') clearHits();
      else if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key === 'g')) { e.preventDefault(); focusHit(at + (e.shiftKey ? -1 : 1)); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrive);
  else arrive();
})();
