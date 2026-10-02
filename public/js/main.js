(function () {
  var C = window.WEFIE_CONFIG || {};
  var root = document.documentElement;
  var audience = document.body.dataset.audience || "owner";

  /* ---------- Language switch (EN / 中文) ---------- */
  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-Hans" : "en";
    try { localStorage.setItem("wefie-lang", lang); } catch (e) {}
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.textContent = lang === "zh" ? "EN" : "中文";
      b.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    });
  }
  setLang(root.dataset.lang === "zh" ? "zh" : "en");
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { setLang(root.dataset.lang === "zh" ? "en" : "zh"); });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Highlight current section in menu ---------- */
  var path = location.pathname;
  document.querySelectorAll(".nav-links a[data-section]").forEach(function (a) {
    if (path.indexOf(a.dataset.section) === 0) a.classList.add("active");
  });

  /* ---------- Contact links from config.js ---------- */
  function ext(a) { a.target = "_blank"; a.rel = "noopener"; }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var who = a.dataset.wa || audience;
    var msg = (C.messages || {})[who] || "";
    a.href = "https://wa.me/" + C.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");
    ext(a);
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + C.phone; });
  document.querySelectorAll("[data-email]").forEach(function (a) { a.href = "mailto:" + C.email; });
  document.querySelectorAll("[data-airbnb]").forEach(function (a) { a.href = C.airbnbProfile; ext(a); });
  document.querySelectorAll("[data-facebook]").forEach(function (a) { a.href = C.facebook; ext(a); });
  document.querySelectorAll("[data-instagram]").forEach(function (a) { a.href = C.instagram; ext(a); });
  document.querySelectorAll("[data-listing]").forEach(function (a) {
    a.href = ((C.listings || {})[a.dataset.listing]) || C.airbnbProfile;
    ext(a);
  });

  /* ---------- Tap-to-enlarge images ---------- */
  document.querySelectorAll("a.zoom").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      var img = document.createElement("img");
      img.src = a.getAttribute("href");
      var src = a.querySelector("img");
      img.alt = src ? src.alt : "";
      var btn = document.createElement("button");
      btn.type = "button"; btn.setAttribute("aria-label", "Close"); btn.innerHTML = "&times;";
      box.appendChild(img); box.appendChild(btn);
      function close() { box.remove(); document.removeEventListener("keydown", onKey); }
      function onKey(ev) { if (ev.key === "Escape") close(); }
      box.addEventListener("click", function (ev) { if (ev.target !== img) close(); });
      document.addEventListener("keydown", onKey);
      document.body.appendChild(box);
      btn.focus();
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
