/* =====================================================================
   WefieHome — Skyline Embassy owner page (showcase motion, v2.2)
   GSAP 3.13: ScrollTrigger, SplitText, ScrollSmoother (desktop only).
   Runs before motion.js so ScrollSmoother exists before other triggers.
   No GSAP / reduced motion / script failure → html.se-static (everything
   visible in its finished state). Phones: native scroll, lighter effects.
   ===================================================================== */
(function () {
  var root = document.documentElement;
  var page = document.querySelector(".se-hero");
  if (!page) return;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function lang() { return root.dataset.lang === "zh" ? "zh" : "en"; }

  /* ---------- 1. Unit explorer tabs (works with or without GSAP) ---------- */
  var explorer = $(".se-explorer");
  if (explorer) {
    explorer.classList.add("is-tabs");
    var tabs = $$(".se-tab", explorer), panels = $$(".se-type", explorer);
    var show = function (k, focus) {
      tabs.forEach(function (t) {
        var on = t.dataset.type === k;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p) {
        var on = p.dataset.type === k;
        if (on) p.removeAttribute("data-inactive"); else p.setAttribute("data-inactive", "");
        if (on && window.gsap && !root.classList.contains("se-static")) {
          gsap.fromTo(p, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "transform,opacity" });
        }
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { show(t.dataset.type); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        show(tabs[(i + d + tabs.length) % tabs.length].dataset.type, true);
      });
    });
    show("A");
  }

  /* ---------- 2. Decide: animated or static ---------- */
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ok = window.gsap && window.ScrollTrigger && !reduced && root.classList.contains("motion");
  if (!ok) {
    root.classList.add("se-static");
    root.classList.remove("se-pre");
    return;
  }
  var plugins = [ScrollTrigger];
  if (window.SplitText) plugins.push(SplitText);
  if (window.ScrollSmoother) plugins.push(ScrollSmoother);
  gsap.registerPlugin.apply(gsap, plugins);
  root.classList.add("se-anim");

  /* ---------- 3. ScrollSmoother — desktop with a mouse only ---------- */
  var smoother = null;
  var desktop = matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
  if (window.ScrollSmoother && desktop) {
    try {
      var wrap = document.createElement("div"), content = document.createElement("div");
      wrap.id = "smooth-wrapper"; content.id = "smooth-content";
      var header = $(".site-header");
      // everything except the header, fixed buttons and scripts scrolls inside the smoother
      $$("body > *").forEach(function (el) {
        if (el === header || el.tagName === "SCRIPT" || el.classList.contains("wa-float") || el.classList.contains("mr-sticky")) return;
        content.appendChild(el);
      });
      wrap.appendChild(content);
      document.body.insertBefore(wrap, header ? header.nextSibling : document.body.firstChild);
      root.classList.add("se-smooth");
      var setPad = function () { content.style.paddingTop = (header ? header.offsetHeight : 0) + "px"; };
      setPad(); window.addEventListener("resize", setPad);
      smoother = ScrollSmoother.create({ wrapper: wrap, content: content, smooth: 0.9, effects: false, smoothTouch: false });
      // in-page anchors go through the smoother
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute("href").length < 2) return;
        var t = document.getElementById(a.getAttribute("href").slice(1));
        if (!t) return;
        e.preventDefault();
        smoother.scrollTo(t, true, "top " + ((header ? header.offsetHeight : 0) + 56) + "px");
      });
      // keep the section menu stuck under the header
      var jump = $(".se-jump");
      if (jump) ScrollTrigger.create({ trigger: jump, start: "top top+=" + (header ? header.offsetHeight : 0), endTrigger: "#faq", end: "bottom top", pin: true, pinSpacing: false });
    } catch (err) { smoother = null; }
  }

  var mm = gsap.matchMedia();
  var BIG = "(min-width: 761px)", SMALL = "(max-width: 760px)";

  /* ---------- 4. Hero: letter-by-letter headline + slow zoom ---------- */
  var h1b = $(".se-h1 ." + lang() + " .se-h1-b");
  var heroBits = $$(".se-hero-in > :not(.breadcrumb):not(.se-h1)").concat($$(".se-h1 ." + lang() + " .se-h1-a"));
  var intro = gsap.timeline({ delay: 0.15 });
  intro.from(heroBits.slice(-1).concat(heroBits.slice(0, 1)), { opacity: 0, y: 18, duration: 0.6, ease: "power2.out", stagger: 0.08 });
  if (h1b && window.SplitText) {
    var split = SplitText.create(h1b, { type: "chars,words", charsClass: "se-ch" });
    intro.from(split.chars, { opacity: 0, yPercent: 60, rotateX: -50, duration: 0.7, ease: "power3.out", stagger: 0.016 }, "-=0.3");
  } else if (h1b) {
    intro.from(h1b, { opacity: 0, y: 24, duration: 0.8, ease: "power3.out" }, "-=0.3");
  }
  intro.from(heroBits.slice(1, -1), { opacity: 0, y: 18, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.4");
  root.classList.remove("se-pre");
  gsap.to(".se-hero-bg img", { scale: 1.16, yPercent: 5, ease: "none", scrollTrigger: { trigger: ".se-hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".se-hero-in", { yPercent: -10, opacity: 0.25, ease: "none", scrollTrigger: { trigger: ".se-hero", start: "center center", end: "bottom top", scrub: true } });

  /* ---------- 5. Section heads: split-line reveal (desktop), fade (phone) ---------- */
  $$(".se-head").forEach(function (head) {
    head.setAttribute("data-no-reveal", "");
    var kids = [].slice.call(head.children);
    var h2 = head.querySelector("h2");
    var st = { trigger: head, start: "top 82%", once: true };
    mm.add({ big: BIG, small: SMALL }, function (ctx) {
      var target = h2 && h2.querySelector("." + lang()) || h2;
      if (ctx.conditions.big && window.SplitText && target) {
        var s = SplitText.create(target, { type: "words,lines", mask: "lines" });
        var tl = gsap.timeline({ scrollTrigger: st });
        tl.from(kids.filter(function (k) { return k !== h2; }), { opacity: 0, y: 16, duration: 0.6, ease: "power2.out", stagger: 0.12 }, 0)
          .from(s.words, { yPercent: 110, duration: 0.8, ease: "power3.out", stagger: 0.035 }, 0.05);
        return function () { s.revert(); };
      }
      gsap.from(kids, { opacity: 0, y: 14, duration: 0.6, ease: "power2.out", stagger: 0.1, scrollTrigger: st });
    });
  });

  /* ---------- 6. Signature: "Whose unit gets the booking?" (pinned) ---------- */
  var grid = $(".se-grid"), you = $(".se-lc.is-you");
  if (grid && you) {
    mm.add({ big: BIG, small: SMALL }, function (ctx) {
      root.classList.add("se-booking-anim");
      var others = $$(".se-lc:not(.is-you)", grid), tag = $(".se-lc-tag", you);
      var origin = function () {
        var x = (you.offsetLeft + you.offsetWidth / 2) / grid.offsetWidth * 100;
        var y = (you.offsetTop + you.offsetHeight / 2) / grid.offsetHeight * 100;
        return x.toFixed(2) + "% " + y.toFixed(2) + "%";
      };
      gsap.set(grid, { transformOrigin: origin() });
      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".se-booking", pin: ".se-pin", start: "top top", end: ctx.conditions.small ? "+=130%" : "+=200%", scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
                         onRefresh: function () { gsap.set(grid, { transformOrigin: origin() }); } }
      });
      tl.fromTo(grid, { scale: ctx.conditions.small ? 2.6 : 3.4 }, { scale: 1, duration: 1.2, ease: "power2.inOut" })
        .to(you, { "--glow": 0, duration: 0.4 }, 0.8)
        .to(tag, { opacity: 0, duration: 0.3 }, 0.8)
        .fromTo(".se-cap-1", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 }, 0.9)
        .to(".se-cap-1", { opacity: 0, y: -20, duration: 0.3 }, 1.8)
        .to(others, { opacity: 0.07, scale: 0.92, duration: 0.6, stagger: { each: 0.01, from: "random" } }, 1.8)
        .to(you, { "--glow": 1, duration: 0.4 }, 2.2)
        .to(tag, { opacity: 1, duration: 0.3 }, 2.3)
        .to(grid, { scale: ctx.conditions.small ? 1.5 : 1.7, duration: 0.8, ease: "power2.inOut" }, 2.2)
        .fromTo(".se-cap-2", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 }, 2.6)
        .to({}, { duration: 0.4 });
      return function () { root.classList.remove("se-booking-anim"); };
    });
  }

  /* ---------- 7. WhatsApp chains build as you scroll ---------- */
  var chains = $(".se-chains");
  if (chains) {
    var tlc = gsap.timeline({ scrollTrigger: { trigger: chains, start: "top 88%", end: "top 35%", scrub: 0.4 } });
    tlc.from(".se-chain.is-big .se-node", { opacity: 0, x: -24, duration: 1, stagger: 0.6 })
       .from(".se-chain.is-small .se-node", { opacity: 0, x: -24, duration: 1, stagger: 0.4 }, 0.6)
       .from(".se-node.is-ivan", { scale: 0.6, duration: 0.8, ease: "back.out(2)" }, 1.2)
       .from(".se-chain-note", { opacity: 0, y: 12, duration: 0.8 }, 2.2);
  }

  /* ---------- 8. "Inspected by Ivan" signature draws itself ---------- */
  var sig = $(".se-sig");
  if (sig) {
    var paths = $$("path", sig);
    paths.forEach(function (p) { p.setAttribute("pathLength", "1"); });
    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(paths, { strokeDashoffset: 0, duration: function (i) { return [0.35, 0.45, 1.1, 0.5][i] || 0.5; }, ease: "power1.inOut", stagger: { each: 0.4 },
      scrollTrigger: { trigger: ".se-card-check", start: "top 65%", once: true } });
  }

  /* ---------- 9. Keys-to-first-guest: horizontal pin on desktop, vertical on phones ---------- */
  var track = $(".se-tl-track");
  if (track) {
    mm.add("(min-width: 901px)", function () {
      root.classList.add("se-hscroll");
      var dist = function () { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth + 48); };
      gsap.to(track, { x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: ".se-timeline", pin: ".se-tl-pin", start: "top top", end: function () { return "+=" + dist(); }, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
      return function () { root.classList.remove("se-hscroll"); };
    });
    mm.add("(max-width: 900px)", function () {
      $$(".se-tl-panel").forEach(function (p) {
        gsap.from(p, { opacity: 0, y: 24, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: p, start: "top 85%", once: true } });
      });
    });
  }

  /* ---------- 10. KLCC map: routes draw, places pop ---------- */
  var map = $(".se-map");
  if (map) {
    var routes = $$(".se-route", map);
    routes.forEach(function (r) { r.setAttribute("pathLength", "1"); });
    gsap.set(routes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.timeline({ scrollTrigger: { trigger: map, start: "top 70%", once: true } })
      .from(".se-home", { scale: 0, duration: 0.5, ease: "back.out(2)" })
      .to(routes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.18 }, 0.2)
      .from(".se-place", { opacity: 0, scale: 0.6, duration: 0.45, ease: "back.out(1.8)", stagger: 0.18 }, 0.6);
  }

  /* ---------- 11. Gallery images ease in as they slide into view ---------- */
  if ($(".se-gallery")) gsap.from(".se-g", { opacity: 0, x: 60, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".se-gallery", start: "top 82%", once: true } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
