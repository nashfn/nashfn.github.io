/* NASH / FLIGHT LOG — small, dependency-free behaviours */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- theme toggle ---------- */
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  });

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- category filter (home) ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var entries = document.querySelectorAll(".entry[data-cat]");
  var empty = document.querySelector(".empty");
  if (chips.length) {
    chips.forEach(function (chip) {
      var f = chip.getAttribute("data-filter");
      var n = f === "all" ? entries.length : document.querySelectorAll('.entry[data-cat~="' + f + '"]').length;
      var sup = chip.querySelector("sup");
      if (sup) sup.textContent = n;
    });
    function apply(filter) {
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === filter)); });
      entries.forEach(function (e) {
        var match = filter === "all" || (" " + e.getAttribute("data-cat") + " ").indexOf(" " + filter + " ") > -1;
        e.hidden = !match;
        if (match) shown++;
      });
      if (empty) {
        empty.classList.toggle("show", shown === 0);
        var name = empty.querySelector("[data-channel]");
        var chip = document.querySelector('.chip[data-filter="' + filter + '"]');
        if (name && chip) name.textContent = chip.getAttribute("data-label") || filter;
      }
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        apply(f);
        history.replaceState(null, "", f === "all" ? location.pathname : "#c=" + f);
      });
    });
    var m = location.hash.match(/^#c=([\w-]+)/);
    var start = m && document.querySelector('.chip[data-filter="' + m[1] + '"]') ? m[1] : "all";
    apply(start);
    if (m) {
      var log = document.getElementById("log");
      if (log) log.scrollIntoView();
    }
  }

  /* ---------- reading progress + toc (article) ---------- */
  var bar = document.querySelector(".progress");
  var article = document.querySelector(".prose");
  if (bar && article) {
    var tick = false;
    function onScroll() {
      var r = article.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.width = (p * 100).toFixed(2) + "%";
      tick = false;
    }
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length) {
    var pairs = [];
    tocLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) pairs.push([t, a]);
    });
    var pending = false;
    function markToc() {
      pending = false;
      var line = window.innerHeight * 0.3, current = null;
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i][0].getBoundingClientRect().top <= line) current = pairs[i][1]; else break;
      }
      tocLinks.forEach(function (a) { a.classList.toggle("on", a === current); });
    }
    window.addEventListener("scroll", function () { if (!pending) { pending = true; requestAnimationFrame(markToc); } }, { passive: true });
    markToc();
  }
})();
