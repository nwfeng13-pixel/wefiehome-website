/* WefieHome — homepage only: owner chooser, KL map, count-up, reveals */
(function () {
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* generic selector: buttons with data-i switch panes with the same data-i */
  function selector(root, btnSel, paneSel, onPick) {
    if (!root) return;
    var btns = $$(btnSel, root), panes = $$(paneSel, root);
    function pick(i, focus) {
      btns.forEach(function (b) {
        var on = b.dataset.i === String(i);
        b.classList.toggle("is-on", on);
        if (b.getAttribute("role") === "tab") { b.setAttribute("aria-selected", on ? "true" : "false"); b.tabIndex = on ? 0 : -1; }
        else b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      panes.forEach(function (p) { p.classList.toggle("is-on", p.dataset.i === String(i)); });
      if (onPick) onPick(i);
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { pick(b.dataset.i); });
      b.addEventListener("keydown", function (e) {
        if (b.getAttribute("role") !== "tab") return;
        var tabs = btns.filter(function (x) { return x.getAttribute("role") === "tab"; });
        var k = tabs.indexOf(b), n = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (k + 1) % tabs.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (k - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); pick(tabs[n].dataset.i); tabs[n].focus(); }
      });
    });
    return pick;
  }
  selector(document.querySelector(".hp-paths"), ".hp-path-tab", ".hp-path-pane");
  var map = document.querySelector(".hp-map");
  selector(map, ".hp-pin, .hp-map-chip", ".hp-map-card", function (i) {
    var chip = map.querySelector('.hp-map-chip[data-i="' + i + '"]');
    if (chip && chip.scrollIntoView && window.innerWidth < 860) chip.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  });

  selector(document.querySelector(".mg-svc"), ".mg-svc-tab", ".mg-svc-pane");
  selector(document.querySelector(".ar-cut"), ".ar-spot, .ar-chip", ".ar-pane");

  /* steps timeline: fill the line as the list scrolls through the viewport */
  var steps = document.querySelector(".mg-steps");
  if (steps) {
    var lis = $$("li", steps);
    var upd = function () {
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height));
      steps.style.setProperty("--p", p.toFixed(3));
      lis.forEach(function (li) { var lr = li.getBoundingClientRect(); li.classList.toggle("is-done", lr.top < vh * 0.62); });
    };
    window.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
  }

  /* count-up for the proof bar */
  function countUp(el) {
    var t = el.textContent.trim(), m = t.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m || reduced) return;
    var raw = m[2], val = parseFloat(raw.replace(/,/g, "")), dec = (raw.split(".")[1] || "").length, comma = raw.indexOf(",") > -1;
    el.setAttribute("aria-label", t);
    var t0 = performance.now(), dur = 1300;
    (function tick(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3), s = (val * e).toFixed(dec);
      if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      el.textContent = m[1] + s + m[3];
      if (k < 1) requestAnimationFrame(tick); else el.textContent = t;
    })(t0);
  }

  /* reveals */
  if (!("IntersectionObserver" in window)) return;
  var groups = [".hp-hero-copy > *", ".hp-hero-fig", ".hp-stat", ".hp-path-tab", ".hp-map-stage", ".hp-map-side", ".hp-change-grid > div", ".hp-steps > li", ".hp-fee", ".hp-ivan-fig", ".hp-ivan-copy > *", ".hp-stay", ".mg-split > div", ".mg-svc-tab", ".mg-flow-card", ".mg-who", ".mg-chart", ".mg-note", ".mg-link", ".ar-cut-stage", ".ar-cut-side", ".ar-work", ".ar-listing", ".ar-fac figure", ".ar-sit", ".ld-diff-card", ".ld-pillar", ".ld-facts li"];
  var els = [];
  groups.forEach(function (sel) {
    $$(sel).forEach(function (el, k) { el.setAttribute("data-hp", ""); el.style.setProperty("--d", Math.min(k, 6) * 0.08 + "s"); els.push(el); });
  });
  document.documentElement.classList.add("hp-anim");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      var n = en.target.matches(".hp-stat") ? en.target.querySelector("strong") : null;
      if (n) countUp(n);
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  els.forEach(function (el) { io.observe(el); });
  /* failsafe: never leave content hidden */
  setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 4000);
})();
