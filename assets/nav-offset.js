/* Keep .top sticky offset in sync with #rg-nav-host (portal nav).
   On iOS Safari with viewport-fit=cover, sticky top:0 is shifted by the safe-area,
   so a hard-coded top:40px lets the site header sit under the nav. */
(function () {
  var root = document.documentElement;
  var ro = null;
  function apply(h) {
    if (!h) {
      root.style.removeProperty("--rg-nav-h");
      return;
    }
    var r = h.getBoundingClientRect();
    /* Prefer the live bottom edge while stuck; fall back to layout height. */
    var px = r.height > 0 ? (r.top >= -1 ? r.bottom : r.height) : h.offsetHeight;
    if (!(px > 0)) px = 40;
    root.style.setProperty("--rg-nav-h", Math.ceil(px) + "px");
  }
  function sync() {
    apply(document.getElementById("rg-nav-host"));
  }
  function watch(h) {
    if (ro) {
      try { ro.disconnect(); } catch (e) {}
    }
    if (h && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(sync);
      ro.observe(h);
    }
  }
  function boot() {
    var h = document.getElementById("rg-nav-host");
    watch(h);
    sync();
  }
  boot();
  /* nav.js is defer; host may appear just after us */
  var n = 0, t = setInterval(function () {
    var h = document.getElementById("rg-nav-host");
    if (h) { watch(h); sync(); clearInterval(t); }
    else if (++n > 40) clearInterval(t);
  }, 50);
  window.addEventListener("resize", sync);
  window.addEventListener("orientationchange", sync);
  window.addEventListener("scroll", sync, { passive: true });
  if (typeof visualViewport !== "undefined" && visualViewport) {
    visualViewport.addEventListener("resize", sync);
    visualViewport.addEventListener("scroll", sync);
  }
})();
