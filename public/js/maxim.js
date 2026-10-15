/* =====================================================================
   WefieHome — Maxim Risen owner page (showcase motion, v2.3 "Daylight Cheras")
   GSAP 3.13: ScrollTrigger, SplitText, ScrollSmoother (desktop only).
   Runs before motion.js. No GSAP / reduced motion → html.mrx-static and every
   scene shows its finished state. Phones: native scroll, lighter scenes.
   ===================================================================== */
(function () {
  var root = document.documentElement;
  if (!document.body.classList.contains("mrx-page")) return;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function lang() { return root.dataset.lang === "zh" ? "zh" : "en"; }

  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!(window.gsap && window.ScrollTrigger) || reduced || !root.classList.contains("motion")) {
    root.classList.add("mrx-static");
    return;
  }
  var plugins = [ScrollTrigger];
  if (window.SplitText) plugins.push(SplitText);
  if (window.ScrollSmoother) plugins.push(ScrollSmoother);
  gsap.registerPlugin.apply(gsap, plugins);
  root.classList.add("mrx-anim");

  var header = $(".site-header");
  var hdr = function () { return header ? header.offsetHeight : 0; };

  /* ---------- 1. ScrollSmoother — desktop with a mouse only ---------- */
  var smoother = null;
  if (window.ScrollSmoother && matchMedia("(min-width: 1024px) and (pointer: fine)").matches) {
    try {
      var wrap = document.createElement("div"), content = document.createElement("div");
      wrap.id = "smooth-wrapper"; content.id = "smooth-content";
      $$("body > *").forEach(function (el) {
        if (el === header || el.tagName === "SCRIPT" || el.classList.contains("wa-float")) return;
        content.appendChild(el);
      });
      wrap.appendChild(content);
      document.body.insertBefore(wrap, header ? header.nextSibling : document.body.firstChild);
      root.classList.add("mrx-smooth");
      var pad = function () { content.style.paddingTop = hdr() + "px"; };
      pad(); window.addEventListener("resize", pad);
      smoother = ScrollSmoother.create({ wrapper: wrap, content: content, smooth: 0.9, effects: false, smoothTouch: false });
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute("href").length < 2) return;
        var t = document.getElementById(a.getAttribute("href").slice(1));
        if (!t) return;
        e.preventDefault();
        smoother.scrollTo(t, true, "top " + (hdr() + 56) + "px");
      });
      var jump = $(".mr-jump");
      if (jump) ScrollTrigger.create({ trigger: jump, start: "top top+=" + hdr(), endTrigger: "#faq", end: "bottom top", pin: true, pinSpacing: false });
      // the checklist PDF card stays beside the list (CSS sticky can't work inside the smoother)
      if ($(".mr-pdf") && matchMedia("(min-width: 961px)").matches) {
        ScrollTrigger.create({ trigger: ".mr-check-grid", start: "top top+=" + (hdr() + 70), end: function () { return "bottom top+=" + (hdr() + 70 + $(".mr-pdf").offsetHeight); }, pin: ".mr-pdf", pinSpacing: false });
      }
    } catch (err) { smoother = null; }
  }

  var mm = gsap.matchMedia();
  var BIG = "(min-width: 761px)", SMALL = "(max-width: 760px)";

  /* ---------- 2. Hero: tower drifts, the giant 12 floats the other way ---------- */
  gsap.to(".mr-hero-fig", { y: 70, ease: "none", scrollTrigger: { trigger: ".mr-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".mrx-12", { y: -110, ease: "none", scrollTrigger: { trigger: ".mr-hero", start: "top top", end: "bottom top", scrub: true } });

  /* ---------- 3. Section headings: words rise out of a soft blur ---------- */
  $$("main .section h2").forEach(function (h2) {
    if (h2.closest(".mr-why-grid")) return;
    h2.setAttribute("data-no-reveal", "");
    var target = h2.querySelector("." + lang()) || h2;
    var st = { trigger: h2, start: "top 85%", once: true };
    mm.add({ big: BIG, small: SMALL }, function (ctx) {
      if (ctx.conditions.big && window.SplitText) {
        var s = SplitText.create(target, { type: "words" });
        gsap.from(s.words, { opacity: 0, y: 26, filter: "blur(8px)", duration: 0.8, ease: "power3.out", stagger: 0.05, clearProps: "filter", scrollTrigger: st });
        return function () { s.revert(); };
      }
      gsap.from(h2, { opacity: 0, y: 16, duration: 0.6, ease: "power2.out", scrollTrigger: st });
    });
  });

  /* ---------- 4. Handover journey: a line travels across the 4 stages ---------- */
  var stages = $$(".mr-stage"), fill = $(".mrx-journey-fill");
  if (fill && stages.length) {
    mm.add({ big: BIG, small: SMALL }, function (ctx) {
      var prop = ctx.conditions.big ? "scaleX" : "scaleY", from = {}, to = {};
      from[prop] = 0; to[prop] = 1; to.ease = "none";
      to.scrollTrigger = { trigger: ".mr-stages", start: ctx.conditions.big ? "top 75%" : "top 70%", end: ctx.conditions.big ? "bottom 55%" : "bottom 60%", scrub: 0.6,
        onUpdate: function (self) { stages.forEach(function (s, i) { s.classList.toggle("is-on", self.progress >= i / stages.length + 0.02); }); } };
      gsap.fromTo(fill, from, to);
      return function () { stages.forEach(function (s) { s.classList.remove("is-on"); }); };
    });
  }

  /* ---------- 5. Layouts: plans wipe in, "Most flexible" stamps, cards tilt ---------- */
  $$(".mr-layout").forEach(function (card, i) {
    var img = $(".mr-plan img", card);
    if (img) gsap.from(img, { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power3.inOut", delay: i * 0.15, scrollTrigger: { trigger: ".mr-layouts", start: "top 75%", once: true } });
  });
  if ($(".mr-flag")) gsap.from(".mr-flag", { scale: 1.8, rotate: -14, opacity: 0, duration: 0.6, ease: "back.out(2.6)", delay: 0.8, scrollTrigger: { trigger: ".mr-layouts", start: "top 75%", once: true } });
  if (matchMedia("(pointer: fine)").matches) {
    $$(".mr-layout").forEach(function (card) {
      var rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 6); rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
      });
      card.addEventListener("pointerleave", function () { rx(0); ry(0); });
    });
  }

  /* ---------- 6. Checklist: progress ring fills as you read the 6 steps ---------- */
  var ring = $(".mrx-ring-fg"), ringN = $(".mrx-ring-n");
  if (ring && $(".mr-check")) {
    gsap.set(ring, { strokeDasharray: 1, strokeDashoffset: 1 });
    if (ringN) ringN.textContent = "0%";
    gsap.to(ring, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".mr-check", start: "top 70%", end: "bottom 60%", scrub: 0.4,
      onUpdate: function (self) { if (ringN) ringN.textContent = Math.round(self.progress * 100) + "%"; } } });
  }

  /* ---------- 7. Comparison: column by column, then a turquoise sweep on Airbnb ---------- */
  var table = $(".mr-compare");
  if (table) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: table, start: "top 78%", once: true } });
    [2, 3, 4].forEach(function (c, i) {
      tl.from($$("tr > :nth-child(" + c + ")", table), { opacity: 0, y: 14, duration: 0.45, ease: "power2.out", stagger: 0.05 }, i * 0.3);
    });
    tl.fromTo($$("tbody td.is-str", table), { "--sweep": "0%" }, { "--sweep": "100%", duration: 0.7, ease: "power2.inOut", stagger: 0.08 }, 0.9);
  }

  /* ---------- 8. Workload: tasks fly into their groups ---------- */
  $$(".mr-work-group").forEach(function (g, gi) {
    gsap.from($$("li", g), { opacity: 0, x: gi === 1 ? 0 : (gi === 0 ? -36 : 36), y: gi === 1 ? 30 : 0, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: 0.25 + gi * 0.12,
      scrollTrigger: { trigger: ".mr-work-groups", start: "top 78%", once: true } });
  });

  /* ---------- 9. Signature: 1,236 → 12 (pinned on screens where it fits) ---------- */
  var why = $("#why-12"), cn = $(".mrx-cn");
  if (why && cn) {
    $(".mr-why-grid").setAttribute("data-no-reveal", "");
    mm.add({ big: BIG, small: SMALL }, function (ctx) {
      root.classList.add("mrx-why-anim");
      var fits = why.offsetHeight <= window.innerHeight - hdr();
      var counter = { v: 1236 };
      var ones = $$(".mr-on"), reasons = $$(".mr-why > li"), lbl = $(".mrx-cl");
      var tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: fits
        ? { trigger: why, pin: true, start: "top top+=" + hdr(), end: ctx.conditions.small ? "+=110%" : "+=160%", scrub: 0.6, anticipatePin: 1 }
        : { trigger: why, start: "top 65%", end: "bottom 70%", scrub: 0.6 } });
      var grid = $(".mr-dots-grid");
      var units = lang() === "zh" ? "个单位" : "units", partners = lang() === "zh" ? "位业主伙伴" : "owner partners";
      tl.fromTo(grid, { "--dotA": 0.7 }, { "--dotA": 0.7, duration: 0.2 })
        .to(counter, { v: 12, duration: 1, ease: "power2.inOut", onUpdate: function () {
            cn.textContent = Math.round(counter.v).toLocaleString("en-US");
            if (lbl) lbl.textContent = counter.v > 100 ? units : partners;
          } }, 0.2)
        .to(grid, { "--dotA": 0.14, duration: 0.8 }, 0.4)
        .fromTo(ones, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.04, ease: "back.out(2)" }, 0.9)
        .fromTo(reasons, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.18, ease: "power2.out" }, 1.1)
        .fromTo(".mr-why-close, #why-12 .mr-why-grid .btn", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, 1.8);
      return function () { root.classList.remove("mrx-why-anim"); cn.textContent = "1,236"; };
    });
  }

  /* ---------- 10. Meet Ivan: portrait depth + quote line reveal ---------- */
  var ivan = $(".mr-ivan-fig");
  if (ivan) {
    ivan.setAttribute("data-no-reveal", "");
    gsap.from(".mr-ivan-fig picture", { clipPath: "inset(100% 0 0 0)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: ivan, start: "top 78%", once: true } });
    gsap.fromTo(".mr-ivan-fig img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ivan, start: "top bottom", end: "bottom top", scrub: true } });
    var q = $(".mrx-quote ." + lang());
    if (q && window.SplitText) {
      var qs = SplitText.create(q, { type: "lines", mask: "lines" });
      gsap.from(qs.lines, { yPercent: 105, duration: 0.8, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".mrx-quote", start: "top 82%", once: true } });
    }
  }

  /* ---------- 11. Monthly statement: a scan line passes over the sample ---------- */
  var scan = $(".mrx-scan");
  if (scan) {
    gsap.timeline({ scrollTrigger: { trigger: ".mr-stmt-fig", start: "top 65%", once: true }, delay: 0.7 })
      .fromTo(scan, { top: "0%", opacity: 0 }, { opacity: 1, duration: 0.2 })
      .to(scan, { top: "100%", duration: 1.6, ease: "power1.inOut" })
      .to(scan, { opacity: 0, duration: 0.3 });
  }

  /* ---------- 12. How it works: a vertical line draws through the 6 steps ---------- */
  var steps = $(".mr-steps");
  if (steps) {
    steps.classList.add("mrx-steps");
    gsap.fromTo(steps, { "--fill": 0 }, { "--fill": 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 65%", end: "bottom 65%", scrub: 0.4 } });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
