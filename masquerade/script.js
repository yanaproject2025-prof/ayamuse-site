/* THE MIDNIGHT MASQUERADE · interaction layer */
(function () {
  "use strict";
  var C = window.MASQUERADE || {};
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- film grain texture (generated once) ---------- */
  try {
    var g = document.createElement("canvas"); g.width = g.height = 220;
    var gx = g.getContext("2d"), id = gx.createImageData(220, 220);
    for (var i = 0; i < id.data.length; i += 4) {
      var v = Math.random() * 255 | 0;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
    }
    gx.putImageData(id, 0, 0);
    doc.style.setProperty("--grain", "url(" + g.toDataURL("image/png") + ")");
  } catch (e) {}

  /* ---------- render content from config ---------- */
  var ink = $("[data-ink]");
  if (ink && C.invitationLines) {
    ink.innerHTML = C.invitationLines.map(function (l) {
      var isName = /midnight masquerade/i.test(l);
      return '<span class="ink-line' + (isName ? " is-name" : "") + '">' + esc(l) + "</span>";
    }).join("");
  }

  var swatches = { noir: "#0d0a0b", crimson: "#7a1826", ivory: "#efe5d2", sapphire: "#1d2b57", gold: "#b8935a" };
  var looksEl = $("[data-looks]");
  if (looksEl && C.looks) {
    looksEl.innerHTML = C.looks.map(function (l) {
      return '<figure class="look reveal" role="listitem" tabindex="0" style="--sw:' + (swatches[l.id] || "#b8935a") + '">' +
        '<div class="look-media">' +
          '<video class="lazy-video" muted playsinline preload="none" poster="' + esc(l.poster) + '" aria-label="' + esc(l.alt) + '">' +
            '<source data-src="' + esc(l.video) + '" type="video/mp4"></video>' +
          '<span class="look-swatch" aria-hidden="true"></span>' +
          '</div><figcaption class="look-head"><span class="look-chapter">' + esc(l.chapter) + '</span>' +
            '<h3 class="look-name">' + esc(l.name) + '</h3>' +
            '<p class="look-text">' + esc(l.text) + "</p></figcaption>" +
        "</figure>";
    }).join("");
  }

  var prog = $("[data-programme]");
  if (prog && C.programme) {
    prog.innerHTML = C.programme.map(function (p) {
      return '<li class="tl reveal"><span class="tl-time">' + esc(p.time) + '</span>' +
        '<h3 class="tl-title">' + esc(p.title) + '</h3><p class="tl-text">' + esc(p.text) + "</p></li>";
    }).join("");
  }

  var occ = $("[data-occasions]");
  if (occ && C.atelier) occ.innerHTML = C.atelier.occasions.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");

  /* ---------- traffic source + CTA ---------- */
  var params = new URLSearchParams(location.search), utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (k) {
    var v = params.get(k);
    try { if (v) sessionStorage.setItem("mm_" + k, v); else v = sessionStorage.getItem("mm_" + k); } catch (e) {}
    if (v) utm[k] = v;
  });
  function track(name, data) {
    data = Object.assign({ page: "midnight-masquerade" }, utm, data || {});
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, data));
    if (typeof window.gtag === "function") window.gtag("event", name, data);
    if (typeof window.plausible === "function") window.plausible(name, { props: data });
    if (window.zaraz && typeof window.zaraz.track === "function") window.zaraz.track(name, data);
  }
  var cta = $("[data-cta]");
  if (cta && C.atelier) {
    cta.textContent = C.atelier.ctaLabel;
    var u = new URL(C.atelier.ctaUrl, location.href);
    u.searchParams.set("ref", "midnight-masquerade");
    Object.keys(utm).forEach(function (k) { u.searchParams.set(k, utm[k]); });
    cta.href = u.toString();
    cta.addEventListener("click", function () { track("event_world_cta_click"); });
  }
  var pf = $("[data-portfolio]");
  if (pf && C.atelier) pf.href = C.atelier.portfolioUrl;
  track("masquerade_view");

  /* ---------- curtain ---------- */
  requestAnimationFrame(function () { setTimeout(function () { doc.classList.add("is-ready"); }, 120); });

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  $$(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- lazy videos: load near view, play only in view ---------- */
  var vio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      v.dataset.inView = e.isIntersecting ? "1" : "0";
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          $$("source[data-src]", v).forEach(function (s) { s.src = s.dataset.src; });
          v.load(); v.dataset.loaded = "1";
        }
        if (!reduce && !document.hidden) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      } else { v.pause(); }
    });
  }, { rootMargin: "0px", threshold: 0.01 });
  $$("video.lazy-video").forEach(function (v) { vio.observe(v); });
  document.addEventListener("visibilitychange", function () {
    $$("video.lazy-video").forEach(function (v) {
      if (!reduce && !document.hidden && v.dataset.inView === "1") v.play().catch(function () {});
      else v.pause();
    });
  });

  var hero = $(".arrival-video");
  if (hero) {
    hero.removeAttribute("autoplay");
    var heroVisible = false;
    function syncHero() { if (!reduce && heroVisible && !document.hidden) hero.play().catch(function () {}); else hero.pause(); }
    new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; syncHero(); }, { threshold: .01 }).observe(hero);
    document.addEventListener("visibilitychange", syncHero);
    if (reduce) hero.pause();
  }

  /* ---------- tap to open look text on touch ---------- */
  $$(".look").forEach(function (l) {
    l.addEventListener("click", function () { l.classList.toggle("is-open"); });
    l.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); l.classList.toggle("is-open"); } });
  });

  /* ---------- scroll-driven: ink lines + parallax ---------- */
  var letter = $("#letter"), lines = $$(".ink-line"), par = $("[data-parallax]");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    if (letter && lines.length && !reduce) {
      var r = letter.getBoundingClientRect();
      var total = letter.offsetHeight - vh;
      var p = Math.min(1, Math.max(0, (-r.top + vh * 0.35) / (total + vh * 0.2)));
      var n = lines.length, span = 0.8 / n;
      lines.forEach(function (ln, i) {
        var start = 0.06 + i * span;
        var t = Math.min(1, Math.max(0, (p - start) / (span * 0.95)));
        ln.style.setProperty("--r", t.toFixed(3));
      });
    }
    if (par && !reduce) {
      var pr = par.parentElement.getBoundingClientRect();
      if (pr.bottom > 0 && pr.top < vh) {
        var k = (pr.top + pr.height / 2 - vh / 2) / vh;
        par.style.transform = "translate3d(0," + (k * -9).toFixed(2) + "%,0)";
      }
    }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  if (reduce) lines.forEach(function (ln) { ln.style.setProperty("--r", 1); });
  onScroll();

  /* ---------- chapter indicator ---------- */
  var links = $$(".chapters a");
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) links.forEach(function (a) { a.setAttribute("aria-current", a.dataset.chapter === e.target.id ? "true" : "false"); });
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$("main > .scene").forEach(function (s) { cio.observe(s); });

  /* ---------- RSVP demo card ---------- */
  var form = $("[data-rsvp]"), card = $("[data-card]"), nameEl = $("[data-card-name]"), save = $("[data-save]"), note = $(".form-note");
  var guest = "";
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var val = form.elements.namedItem("guest").value.replace(/\s+/g, " ").trim();
    if (!val) { note.textContent = "Kindly write a name first."; form.elements.namedItem("guest").focus(); return; }
    guest = val;
    nameEl.textContent = val;
    card.classList.remove("is-revealed"); void card.offsetWidth; card.classList.add("is-revealed");
    note.textContent = "Your invitation has been written, " + val.split(" ")[0] + ".";
    save.hidden = false;
    track("invitation_revealed");
    if (window.innerWidth < 900) { if (lenis) lenis.scrollTo(card, { offset: -90 }); else card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
  });

  function drawCard() {
    var W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var x = cv.getContext("2d");
    var bg = x.createRadialGradient(W * .3, H * .2, 50, W * .5, H * .5, H * .8);
    bg.addColorStop(0, "#f6eedd"); bg.addColorStop(.6, "#e9dcc2"); bg.addColorStop(1, "#d8c8a9");
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 26000; i++) { x.fillStyle = "rgba(90,60,30," + (Math.random() * .05) + ")"; x.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4); }
    x.strokeStyle = "#a8844c"; x.lineWidth = 2; x.strokeRect(40, 40, W - 80, H - 80);
    x.strokeStyle = "rgba(168,132,76,.5)"; x.lineWidth = 1.5; x.strokeRect(54, 54, W - 108, H - 108);
    x.textAlign = "center"; x.textBaseline = "middle";
    function spaced(t, y, font, color, sp) {
      x.font = font; x.fillStyle = color;
      if ("letterSpacing" in x) { x.letterSpacing = sp + "px"; x.fillText(t, W / 2 + sp / 2, y); x.letterSpacing = "0px"; }
      else x.fillText(t.split("").join(String.fromCharCode(8202)), W / 2, y);
    }
    spaced("THE MIDNIGHT MASQUERADE", 330, "500 34px Cinzel, Georgia, serif", "#6e1826", 10);
    x.font = "italic 300 34px Spectral, Georgia, serif"; x.fillStyle = "#4a2f2a";
    x.fillText("requests the pleasure of the company of", W / 2, 440);
    var size = 128; x.font = size + "px 'Pinyon Script', cursive";
    while (x.measureText(guest).width > W - 240 && size > 20) { size -= 4; x.font = size + "px 'Pinyon Script', cursive"; }
    x.fillStyle = "#5a1220"; x.fillText(guest, W / 2, 590);
    x.font = "italic 300 34px Spectral, Georgia, serif"; x.fillStyle = "#4a2f2a";
    x.fillText("at the palazzo, as the clock strikes midnight", W / 2, 740);
    var sg = x.createRadialGradient(W / 2 - 18, 900 - 20, 6, W / 2, 900, 72);
    sg.addColorStop(0, "#8e2a37"); sg.addColorStop(.6, "#5a1220"); sg.addColorStop(1, "#3d0a14");
    x.beginPath(); x.arc(W / 2, 900, 70, 0, Math.PI * 2); x.fillStyle = sg; x.fill();
    x.beginPath(); x.arc(W / 2, 900, 58, 0, Math.PI * 2); x.strokeStyle = "rgba(0,0,0,.2)"; x.lineWidth = 4; x.stroke();
    x.font = "500 52px Cinzel, Georgia, serif"; x.fillStyle = "rgba(255,220,200,.78)"; x.fillText("M", W / 2, 904);
    spaced("MASKS · BLACK TIE · COUTURE WELCOME", 1040, "500 22px Cinzel, Georgia, serif", "#7d5f45", 6);
    x.font = "italic 300 24px Spectral, Georgia, serif"; x.fillStyle = "rgba(74,47,42,.7)";
    x.fillText("A concept experience by Aya Muse Atelier · ayamuse.com", W / 2, 1220);
    return cv;
  }
  if (save) save.addEventListener("click", function () {
    var go = function () {
      var cv = drawCard();
      var a = document.createElement("a");
      a.download = "midnight-masquerade-invitation.png";
      a.href = cv.toDataURL("image/png");
      document.body.appendChild(a); a.click(); a.remove();
      track("invitation_saved");
    };
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load("64px 'Pinyon Script'"), document.fonts.load("500 34px Cinzel"), document.fonts.load("italic 300 34px Spectral")]).then(go, go);
    } else go();
  });

  /* ================= MOTION LAYER ================= */

  /* split headings into letters (script words keep their joined letters and get an ink wipe) */
  $$("[data-split]").forEach(function (el) {
    var label = el.textContent.replace(/\s+/g, " ").trim(), idx = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) return;
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            part.split("").forEach(function (c) {
              var s = document.createElement("span"); s.className = "ch"; s.textContent = c;
              s.style.setProperty("--i", idx++); w.appendChild(s);
            });
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains("script") && n.tagName !== "BR") walk(n);
      });
    })(el);
    var sr = document.createElement("span"); sr.className = "visually-hidden"; sr.textContent = label;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) { if (n.nodeType === 1) n.setAttribute("aria-hidden", "true"); });
    el.appendChild(sr);
    if (el.dataset.split !== "hero") { el.classList.add("is-split"); io.observe(el); }
  });
  /* doors are clipped shut, so watch their parent (a clipped box never "intersects") */
  var dio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$(".door", e.target).forEach(function (d) { d.classList.add("is-in"); });
      dio.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
  $$(".door").forEach(function (el) { dio.observe(el.parentElement); });
  var hall = $(".palace-hall");
  if (hall) new IntersectionObserver(function (es, o) {
    es.forEach(function (e) { if (e.isIntersecting) { hall.classList.add("is-open"); o.disconnect(); } });
  }, { threshold: 0.25 }).observe(hall);

  /* smooth inertial scroll */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.35, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    lenis.on("scroll", onScroll);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var t = $(a.getAttribute("href")); if (!t) return;
        ev.preventDefault(); lenis.scrollTo(t, { duration: 1.8, onComplete: function () { if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); } });
        if (a.hasAttribute("data-scroll")) track("enter_masquerade_click");
      });
    });
  } else {
    $$("[data-scroll]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var t = $(a.getAttribute("href")); if (!t) return;
        ev.preventDefault(); t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        track("enter_masquerade_click");
      });
    });
  }

  /* film band grows to full width with scroll */
  var band = $("[data-grow]");
  function grow() {
    if (!band || reduce) return;
    var r = band.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
    band.style.setProperty("--g", (1 - p).toFixed(3));
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(grow); }, { passive: true });
  if (lenis) lenis.on("scroll", grow);
  grow();

  /* custom cursor + magnetic buttons (fine pointers only) */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cur = $(".cursor");
  if (fine && !reduce && cur) {
    doc.classList.add("has-cursor");
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      cur.style.setProperty("--x", mx + "px"); cur.style.setProperty("--y", my + "px");
      var t = e.target;
      cur.classList.toggle("is-view", !!(t.closest && t.closest(".look")));
      cur.classList.toggle("is-link", !!(t.closest && t.closest("a,button,input")) && !t.closest(".look"));
    }, { passive: true });
    document.addEventListener("pointerleave", function () { cur.classList.add("is-hidden"); });
    document.addEventListener("pointerenter", function () { cur.classList.remove("is-hidden"); });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      cur.style.setProperty("--rx", rx.toFixed(1) + "px"); cur.style.setProperty("--ry", ry.toFixed(1) + "px");
      requestAnimationFrame(loop);
    })();
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.25, dy = (e.clientY - r.top - r.height / 2) * 0.35;
        b.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }
})();
