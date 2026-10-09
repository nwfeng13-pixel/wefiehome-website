/* =====================================================================
   WefieHome — Motion (scroll reveals, count-up, process highlighting)
   Uses GSAP + ScrollTrigger when available; falls back to the browser's
   IntersectionObserver so every animation still works without GSAP.
   All tokens mirror css/motion.css.
   ===================================================================== */
(function () {
  window.__motionReady = true;
  var root = document.documentElement;
  if (!root.classList.contains("motion")) return; // failsafe tripped

  var T = { base: 600, slow: 850, stagger: 80, staggerMax: 480, count: 1.2, start: "top 85%" };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. Tag elements (one consistent vocabulary site-wide) ---------- */
  var FADE = [
    "main .section .eyebrow", "main .section h2", "main .section .lead", "main .section .method-note",
    "main .cta-band h2", "main .cta-band p", "main .cta-band .btn-row",
    "main .card", "main .stat", "main .listing", "main .route", "main .prop-list > a",
    "main .steps > li", "main .perf-text", "main details", "main .mr-points > li",
    "main .mr-close", "main .jump", "main .building-head", "main .table-wrap", "main .contact-list",
    "main .mr-stage", "main .mr-layout", "main .mr-check > li", "main .mr-pdf", "main .mr-note",
    "main .mr-work > li", "main .mr-proof-item", "main .mr-stats", "main .mr-assess", "main .owner-card"
  ].join(",");
  var IMAGES = "main .mr-media, main .building-photo, main .hiw-media, main .perf-img";

  var fades = [].slice.call(document.querySelectorAll(FADE)).filter(function (el) {
    // skip nested matches (e.g. a .card inside a .card) — the parent reveals it
    return !el.parentElement.closest("[data-reveal]") && !el.closest(".page-hero, .hero-photo, [data-no-reveal]");
  });
  fades.forEach(function (el) { el.setAttribute("data-reveal", ""); });
  var imgs = [].slice.call(document.querySelectorAll(IMAGES));
  imgs.forEach(function (el) { el.setAttribute("data-reveal-img", ""); });

  /* ---------- 2. Count-up for statistics ---------- */
  var COUNTERS = "main .stat .num, main .perf-big strong";
  function parseNum(text) {
    var m = text.trim().match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return null;
    var raw = m[2], val = parseFloat(raw.replace(/,/g, ""));
    if (/^(19|20)\d\d$/.test(raw) && !m[1] && !m[3]) return null; // years stay still
    return { pre: m[1], val: val, post: m[3], dec: (raw.split(".")[1] || "").length, comma: raw.indexOf(",") > -1 };
  }
  function fmt(n, p) {
    var s = n.toFixed(p.dec);
    if (p.comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return p.pre + s + p.post;
  }
  var counters = [].slice.call(document.querySelectorAll(COUNTERS)).map(function (el) {
    var p = parseNum(el.textContent);
    if (!p) return null;
    el.setAttribute("aria-label", el.textContent.trim()); // screen readers get the final value
    return { el: el, p: p, done: false };
  }).filter(Boolean);

  function runCount(c) {
    if (c.done) return; c.done = true;
    var dur = T.count, from = { v: 0 };
    if (reduced) { c.el.textContent = fmt(c.p.val, c.p); return; }
    if (hasGSAP) {
      gsap.to(from, { v: c.p.val, duration: dur, ease: "power2.out", onUpdate: function () { c.el.textContent = fmt(from.v, c.p); } });
    } else {
      var t0 = performance.now();
      (function tick(now) {
        var k = Math.min(1, (now - t0) / (dur * 1000)), e = 1 - Math.pow(1 - k, 3);
        c.el.textContent = fmt(c.p.val * e, c.p);
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    }
  }
  function countersWithin(el) {
    counters.forEach(function (c) { if (el === c.el || el.contains(c.el)) runCount(c); });
  }

  /* ---------- 3. Reveal (batched → staggered) ---------- */
  function reveal(batch) {
    batch.forEach(function (el, i) {
      var d = Math.min(i * T.stagger, T.staggerMax);
      el.style.setProperty("--d", d + "ms");
      el.classList.add("rv-run");
      // force style flush so the transition runs from the hidden state
      void el.offsetWidth;
      el.classList.add("is-in");
      countersWithin(el);
      var total = (el.hasAttribute("data-reveal-img") ? T.slow * 1.4 : T.base) + d + 50;
      setTimeout(function () { el.classList.remove("rv-run"); el.style.removeProperty("--d"); }, total);
    });
  }

  var all = fades.concat(imgs);
  if (hasGSAP) {
    ScrollTrigger.batch(all, { start: T.start, once: true, interval: 0.1, onEnter: reveal });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { io.unobserve(e.target); return e.target; });
      if (batch.length) reveal(batch);
    }, { rootMargin: "0px 0px -15% 0px" });
    all.forEach(function (el) { io.observe(el); });
  } else {
    reveal(all);
  }

  /* Counters that sit outside any revealed element */
  counters.forEach(function (c) {
    if (c.el.closest("[data-reveal], [data-reveal-img]")) return;
    if (hasGSAP) ScrollTrigger.create({ trigger: c.el, start: T.start, once: true, onEnter: function () { runCount(c); } });
    else runCount(c);
  });

  /* ---------- 4. Management process: sequential highlighting ---------- */
  [].slice.call(document.querySelectorAll("main .steps")).forEach(function (list) {
    list.setAttribute("data-steps", "");
    var items = [].slice.call(list.children);
    if (reduced) { items.forEach(function (li) { li.classList.add("is-active"); }); return; }
    if (hasGSAP) {
      items.forEach(function (li) {
        ScrollTrigger.create({
          trigger: li, start: "top 65%",
          onEnter: function () { li.classList.add("is-active"); },
          onLeaveBack: function () { li.classList.remove("is-active"); }
        });
      });
    } else if ("IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var passed = e.boundingClientRect.top < window.innerHeight * 0.65;
          e.target.classList.toggle("is-active", e.isIntersecting || passed);
        });
      }, { rootMargin: "0px 0px -35% 0px" });
      items.forEach(function (li) { so.observe(li); });
    } else {
      items.forEach(function (li) { li.classList.add("is-active"); });
    }
  });

  /* Recalculate trigger positions once images/fonts settle */
  if (hasGSAP) window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
