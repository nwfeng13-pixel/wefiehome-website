/* WefieHome — /stewardship/ app: tabs, swipe, segmented panels, lifecycle, WhatsApp, share */
(function () {
  window.__motionReady = true;
  var app = document.getElementById("sw-app");
  if (!app) return;
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var screensEl = document.getElementById("sw-screens");
  var screens = $$(".sw-screen", screensEl);
  var tabs = $$(".sw-tab", app);
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = -1;

  /* navigation */
  function go(id) {
    var i = screens.findIndex(function (s) { return s.id === id; });
    if (i < 0) return;
    screensEl.scrollTo({ left: i * screensEl.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }
  function setActive(i) {
    if (i === current || !screens[i]) return;
    current = i;
    screens.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    tabs.forEach(function (t, k) { t.classList.toggle("is-on", k === i); t.setAttribute("aria-current", k === i ? "page" : "false"); });
    if (history.replaceState) history.replaceState(null, "", "#" + screens[i].id);
  }
  $$("[data-go]", app).forEach(function (b) { b.addEventListener("click", function () { go(b.dataset.go); }); });
  var raf = 0;
  screensEl.addEventListener("scroll", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { setActive(Math.round(screensEl.scrollLeft / screensEl.clientWidth)); });
  }, { passive: true });
  window.addEventListener("resize", function () { if (current >= 0) screensEl.scrollLeft = current * screensEl.clientWidth; });

  /* Care / Operate / Ready and lifecycle switchers */
  function switcher(btnSel, paneSel, key) {
    var btns = $$(btnSel, app), panes = $$(paneSel, app);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.dataset[key];
        btns.forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
        panes.forEach(function (p) { p.classList.toggle("is-on", p.dataset[key] === v); });
      });
    });
  }
  switcher(".sw-seg-b", ".sw-panel", "panel");
  switcher(".sw-life-b", ".sw-life-p", "life");

  /* WhatsApp: short pre-filled message in the current language */
  var MSG = {
    en: "Hi Ivan, I'd like to know more about WefieHome Property Stewardship. My property is at ______",
    zh: "你好 Ivan，我想了解更多 WefieHome 物业照护方案。我的物业在______"
  };
  var wa = document.getElementById("sw-wa");
  function setWa() { if (wa) wa.href = "https://wa.me/60194824292?text=" + encodeURIComponent(MSG[root.dataset.lang === "zh" ? "zh" : "en"]); }
  setWa();
  $$(".lang-btn").forEach(function (b) { b.addEventListener("click", function () { setTimeout(setWa, 0); }); });

  /* share — PREVIEW_V makes WhatsApp fetch a fresh link preview; bump it when assets/og.jpg changes */
  var PREVIEW_V = "?v=2";
  var toast = app.querySelector(".sw-toast");
  function say(msg) { toast.textContent = msg; toast.classList.add("is-on"); setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  var share = app.querySelector(".sw-share");
  if (share) share.addEventListener("click", function () {
    var zh = root.dataset.lang === "zh";
    var data = { title: "WefieHome Property Stewardship", text: zh ? "WefieHome 物业照护方案：专业短租管理，结合长期物业照护。" : "WefieHome Property Stewardship: short-term rental management with long-term property care.", url: location.origin + location.pathname + PREVIEW_V };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { say(zh ? "链接已复制" : "Link copied"); };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done, function () { say(data.url); });
    else say(data.url);
  });

  /* start */
  var start = (location.hash || "#home").slice(1);
  var startIdx = Math.max(0, screens.findIndex(function (s) { return s.id === start; }));
  screensEl.scrollLeft = startIdx * screensEl.clientWidth;
  setActive(startIdx);
})();
