/* Comportement partagé du châssis /dsl : thème, tiroir, accordéon, toast.
   Une seule copie pour les 31 pages. Chaque page ne garde que son propre render(). */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* toast — exposé aux scripts de page */
  window.dslToast = function (message) {
    var t = $("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2300);
  };

  /* accordéon du menu */
  document.querySelectorAll(".ch-head").forEach(function (h) {
    h.addEventListener("click", function () {
      var section = h.parentElement;
      var list = document.getElementById(h.getAttribute("aria-controls"));
      var open = !section.classList.contains("open");
      section.classList.toggle("open", open);
      h.setAttribute("aria-expanded", String(open));
      if (list) list.hidden = !open;
    });
  });

  /* sous-menus des fichiers manifeste */
  document.querySelectorAll(".sub-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var list = document.getElementById(toggle.getAttribute("aria-controls"));
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.closest(".manifest-group").classList.toggle("open", open);
      if (list) list.hidden = !open;
    });
  });

  /* entrées non publiées — jamais de silence */
  document.querySelectorAll(".lsn.soon").forEach(function (l) {
    l.addEventListener("click", function () { window.dslToast("This element is not published yet."); });
  });

  /* tiroir mobile */
  function setDrawer(open) {
    var d = $("drawer"), b = $("burger");
    if (!d || !b) return;
    d.classList.toggle("open", open);
    b.setAttribute("aria-expanded", String(open));
    b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if ($("burger")) {
    $("burger").addEventListener("click", function () {
      setDrawer(!$("drawer").classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if ($("drawer").classList.contains("open") && !$("drawer").contains(e.target) && !$("burger").contains(e.target)) setDrawer(false);
    });
  }

  /* thème */
  var saved;
  try { saved = localStorage.getItem("hydra-theme"); } catch (e) { /* stockage indisponible */ }
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  if ($("themeBtn")) {
    $("themeBtn").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("hydra-theme", next); } catch (e) { /* stockage indisponible */ }
    });
  }

  /* La recherche est desormais globale : voir src/components/SiteSearch.astro. */

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if ($("drawer") && $("drawer").classList.contains("open")) { setDrawer(false); $("burger").focus(); }
    }
  });
})();
