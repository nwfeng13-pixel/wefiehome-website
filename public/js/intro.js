/* WefieHome — /intro/ app: tabs, swipe, stories, flip card, carousel, share */
(function () {
  window.__motionReady = true;
  var app = document.getElementById("ix-app");
  if (!app) return;
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var screensEl = document.getElementById("ix-screens");
  var screens = $$(".ix-screen", screensEl);
  var tabs = $$(".ix-tab", app);
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = -1;

  /* ---------- navigation ---------- */
  function go(id, smooth) {
    var i = screens.findIndex(function (s) { return s.id === id; });
    if (i < 0) return;
    screensEl.scrollTo({ left: i * screensEl.clientWidth, behavior: smooth === false || reduced ? "auto" : "smooth" });
  }
  function setActive(i) {
    if (i === current) return;
    current = i;
    screens.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    tabs.forEach(function (t, k) { t.classList.toggle("is-on", k === i); t.setAttribute("aria-current", k === i ? "page" : "false"); });
    var id = screens[i].id;
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    if (id === "what") startStories(); else stopStories();
    if (id === "work") countUp();
  }
  $$("[data-go]", app).forEach(function (b) { b.addEventListener("click", function () { go(b.dataset.go); }); });
  var raf = 0;
  screensEl.addEventListener("scroll", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { setActive(Math.round(screensEl.scrollLeft / screensEl.clientWidth)); });
  }, { passive: true });
  window.addEventListener("resize", function () { if (current >= 0) screensEl.scrollLeft = current * screensEl.clientWidth; });

  /* ---------- stories ---------- */
  var stories = $$(".ix-story"), bars = $$(".ix-bar"), si = 0, timer = null, DUR = 5200;
  function showStory(n) {
    si = (n + stories.length) % stories.length;
    stories.forEach(function (s, k) { s.classList.toggle("is-on", k === si); });
    bars.forEach(function (b, k) {
      var fill = b.firstElementChild;
      b.classList.toggle("is-done", k < si);
      fill.style.transition = "none"; fill.style.width = k < si ? "100%" : "0";
    });
    if (timer !== null && !reduced) {
      var f = bars[si].firstElementChild;
      void f.offsetWidth;
      f.style.transition = "width " + DUR + "ms linear"; f.style.width = "100%";
      clearTimeout(timer); timer = setTimeout(function () { showStory(si + 1); }, DUR);
    }
  }
  function startStories() { if (timer === null) { timer = 0; showStory(si); } }
  function stopStories() { clearTimeout(timer); timer = null; showStory(si); }
  var prev = app.querySelector(".ix-tap-prev"), next = app.querySelector(".ix-tap-next");
  if (prev) prev.addEventListener("click", function () { showStory(si - 1); });
  if (next) next.addEventListener("click", function () { showStory(si + 1); });

  /* ---------- flip card ---------- */
  var flip = app.querySelector(".ix-flip");
  if (flip) flip.addEventListener("click", function () { flip.classList.toggle("is-flipped"); });

  /* ---------- carousel dots ---------- */
  var car = app.querySelector(".ix-carousel"), dots = $$(".ix-dot", app);
  if (car) car.addEventListener("scroll", function () {
    var slides = car.children, mid = car.scrollLeft + car.clientWidth / 2, best = 0, bd = 1e9;
    for (var k = 0; k < slides.length; k++) {
      var c = slides[k].offsetLeft + slides[k].offsetWidth / 2, d = Math.abs(c - mid);
      if (d < bd) { bd = d; best = k; }
    }
    dots.forEach(function (d, k) { d.classList.toggle("is-on", k === best); });
  }, { passive: true });

  /* ---------- count-up ---------- */
  var counted = false;
  function countUp() {
    if (counted) return; counted = true;
    $$("[data-count]", app).forEach(function (el) {
      var to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
      var pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      if (reduced) return;
      var t0 = performance.now();
      (function tick(now) {
        var k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + (to * e).toFixed(dec) + suf;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------- share ---------- */
  var toast = app.querySelector(".ix-toast");
  function say(msg) { toast.textContent = msg; toast.classList.add("is-on"); setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  var share = app.querySelector(".ix-share");
  if (share) share.addEventListener("click", function () {
    var zh = document.documentElement.dataset.lang === "zh";
    var data = { title: "WefieHome", text: zh ? "WefieHome——吉隆坡 Airbnb 托管，创办人亲自管理。" : "WefieHome — Airbnb management in Kuala Lumpur, personally run by the founder.", url: location.origin + location.pathname };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { say(zh ? "链接已复制" : "Link copied"); };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done, function () { say(data.url); });
    else say(data.url);
  });

  /* ---------- start ---------- */
  var start = (location.hash || "#home").slice(1);
  var startIdx = Math.max(0, screens.findIndex(function (s) { return s.id === start; }));
  screensEl.scrollLeft = startIdx * screensEl.clientWidth;
  setActive(startIdx);
})();
