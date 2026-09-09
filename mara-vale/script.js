/* ============================================================
   MARA VALE — motion engine
   GSAP + ScrollTrigger + Lenis
   One directed experience · a distinct motion language per section
   Degrades gracefully: if GSAP is absent or reduced-motion is on,
   the page stays fully visible and static (html.is-ready is not set).
   ============================================================ */
(function () {
  "use strict";

  var body = document.body;
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- smooth-scroll buttons (always) ---------- */
  document.querySelectorAll("[data-scroll]").forEach(function (el) {
    el.addEventListener("click", function () {
      var t = document.querySelector(el.getAttribute("data-scroll"));
      if (!t) return;
      if (window.__lenis) window.__lenis.scrollTo(t, { offset: 0 });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- filmstrip: native scroll + drag (always) ---------- */
  var strip = document.getElementById("filmstrip");
  var track = document.getElementById("filmstripTrack");
  var bar = document.getElementById("filmstripBar");
  var advance = document.getElementById("filmstripAdvance");
  var frames = strip ? Array.prototype.slice.call(strip.querySelectorAll(".frame")) : [];

  function setupFilmstrip(gsapReady) {
    if (!strip || !track) return;
    var down = false, startX = 0, startScroll = 0, moved = false;
    var scrollTween = null;
    var wheelTarget = strip.scrollLeft;
    if (finePointer) {
      strip.addEventListener("pointerdown", function (e) {
        if (scrollTween && scrollTween.kill) scrollTween.kill();
        wheelTarget = strip.scrollLeft;
        down = true; moved = false; startX = e.clientX; startScroll = strip.scrollLeft;
        strip.classList.add("dragging"); strip.setPointerCapture(e.pointerId);
      });
      strip.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        strip.scrollLeft = startScroll - dx;
      });
      function up() { down = false; wheelTarget = strip.scrollLeft; strip.classList.remove("dragging"); }
      strip.addEventListener("pointerup", up);
      strip.addEventListener("pointercancel", up);
      strip.addEventListener("click", function (e) { if (moved) e.preventDefault(); }, true);
      strip.addEventListener("dragstart", function (e) { e.preventDefault(); });
      strip.addEventListener("wheel", function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          var max = track.scrollWidth - strip.clientWidth;
          if ((wheelTarget > 0 && e.deltaY < 0) || (wheelTarget < max && e.deltaY > 0)) {
            e.preventDefault();
            wheelTarget = Math.max(0, Math.min(max, wheelTarget + e.deltaY * 1.25));
            if (scrollTween && scrollTween.kill) scrollTween.kill();
            if (gsapReady) scrollTween = window.gsap.to(strip, { scrollLeft: wheelTarget, duration: 0.72, ease: "power3.out", overwrite: true });
            else strip.scrollTo({ left: wheelTarget, behavior: reduce ? "auto" : "smooth" });
          }
        }
      }, { passive: false });
    }

    function update() {
      var max = track.scrollWidth - strip.clientWidth;
      var progress = max > 0 ? Math.max(0, Math.min(1, strip.scrollLeft / max)) : 0;
      if (bar) {
        if (gsapReady) window.gsap.set(bar, { scaleX: progress });
        else bar.style.transform = "scaleX(" + progress + ")";
      }
      if (advance) advance.disabled = max <= 0 || strip.scrollLeft >= max - 2;
      var center = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      var best = Infinity, bestEl = null;
      frames.forEach(function (f) {
        var r = f.getBoundingClientRect();
        var signedDistance = r.left + r.width / 2 - center;
        var d = Math.abs(signedDistance);
        if (d < best) { best = d; bestEl = f; }
        if (gsapReady && !reduce) {
          var image = f.querySelector(".frame-img img");
          if (image) window.gsap.set(image, { x: Math.max(-6, Math.min(6, -signedDistance / Math.max(1, strip.clientWidth) * 12)) });
        }
      });
      frames.forEach(function (f) { f.classList.toggle("is-active", f === bestEl); });
    }
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (advance) {
      advance.addEventListener("click", function () {
        var max = Math.max(0, track.scrollWidth - strip.clientWidth);
        if (strip.scrollLeft >= max - 2) return;
        var stripRect = strip.getBoundingClientRect();
        var viewportCenter = stripRect.left + stripRect.width / 2;
        var activeIndex = frames.findIndex(function (frame) { return frame.classList.contains("is-active"); });
        var next = frames[Math.min(frames.length - 1, Math.max(0, activeIndex + 1))];
        if (!next) return;
        var nextRect = next.getBoundingClientRect();
        var target = Math.min(max, Math.max(0, strip.scrollLeft + nextRect.left + nextRect.width / 2 - viewportCenter));
        if (scrollTween && scrollTween.kill) scrollTween.kill();
        if (gsapReady) {
          wheelTarget = target;
          scrollTween = window.gsap.to(strip, { scrollLeft: target, duration: 1.15, ease: "power3.inOut", overwrite: true });
        } else {
          strip.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
        }
      });
    }
    update();
  }

  /* ---------- worlds hover reveal (curtain) ---------- */
  function setupWorlds(gsapReady) {
    var section = document.querySelector(".worlds");
    if (!section) return;
    var worlds = Array.prototype.slice.call(section.querySelectorAll(".world"));
    var images = Array.prototype.slice.call(section.querySelectorAll(".worlds-reveal-img"));
    if (!finePointer || !gsapReady || reduce) return; // mobile uses stacked thumbs
    var g = window.gsap, current = -1;
    function show(i) {
      if (i === current) return;
      current = i;
      section.classList.add("has-active");
      worlds.forEach(function (world, idx) { world.classList.toggle("is-active", idx === i); });
      images.forEach(function (image, idx) {
        if (idx === i) {
          g.fromTo(image, { opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out", overwrite: true });
        } else {
          g.to(image, { opacity: 0, duration: 0.45, ease: "power2.out", overwrite: true });
        }
      });
    }
    worlds.forEach(function (world) {
      world.addEventListener("mouseenter", function () { show(parseInt(world.getAttribute("data-world"), 10)); });
    });
    show(0);
  }

  /* ============================================================
     STATIC FALLBACK  (no GSAP or reduced motion)
     ============================================================ */
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    setupFilmstrip(false);
    setupWorlds(false);
    // cursor light stays hidden; everything visible via CSS (no .is-ready)
    return;
  }

  /* ============================================================
     FULL MOTION
     ============================================================ */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("is-ready");

  /* ---- Lenis smooth scroll ---- */
  var lenis = new window.Lenis({ duration: 1.1, wheelMultiplier: 1, smoothWheel: true, smoothTouch: false });
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* ---- atmospheric cursor light ---- */
  var light = document.querySelector(".cursor-light");
  if (finePointer) {
    var lx = gsap.quickTo(light, "x", { duration: 0.5, ease: "power3" });
    var ly = gsap.quickTo(light, "y", { duration: 0.5, ease: "power3" });
    window.addEventListener("mousemove", function (e) {
      body.classList.add("has-cursor");
      lx(e.clientX); ly(e.clientY);
    });
  }

  /* ---- nav: hide on scroll-down, light over milk ---- */
  ScrollTrigger.create({
    onUpdate: function (self) {
      if (self.direction === 1 && self.scroll() > 240) body.classList.add("nav-hidden");
      else body.classList.remove("nav-hidden");
    }
  });
  document.querySelectorAll(".section-milk").forEach(function (s) {
    ScrollTrigger.create({
      trigger: s, start: "top 46px", end: "bottom 46px",
      onToggle: function (self) { body.classList.toggle("nav-light", self.isActive); }
    });
  });

  /* ---- gentle reveal (labels / body) ---- */
  gsap.utils.toArray(".reveal").forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });
  gsap.utils.toArray(".reveal-lines").forEach(function (el) {
    gsap.to(el.querySelectorAll("span"), {
      opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.14,
      scrollTrigger: { trigger: el, start: "top 86%" }
    });
  });

  /* ---- 1 · HERO name drift on scroll ---- */
  gsap.utils.toArray(".hero-line").forEach(function (el, i) {
    gsap.to(el, {
      y: i === 0 ? -24 : 24, opacity: 0.62, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 }
    });
  });

  /* ---- 2 · SPLAY choreography ---- */
  var splay = document.getElementById("splay");
  if (splay) {
    var wordL = splay.querySelector('[data-drift="left"]');
    var wordR = splay.querySelector('[data-drift="right"]');
    var stmt = splay.querySelector(".splay-statement");
    var drift = function () { return Math.min(170, window.innerWidth * (window.innerWidth < 640 ? 0.075 : 0.12)); };
    var tlS = gsap.timeline({ scrollTrigger: { trigger: splay, start: "top 75%", end: "bottom 40%", scrub: 0.6, invalidateOnRefresh: true } });
    tlS.fromTo(wordL, { x: 0 }, { x: function () { return -drift(); }, ease: "none" }, 0)
       .fromTo(wordR, { x: 0 }, { x: drift, ease: "none" }, 0)
       .to([wordL, wordR], { color: "#120e09", ease: "none" }, 0)
       .fromTo(stmt, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 }, 0.2);
  }

  /* ---- 4 · EDITORIAL SPREAD mask ---- */
  var spreadMask = document.querySelector(".spread-mask");
  if (spreadMask) {
    gsap.to(spreadMask, {
      clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power4.out",
      scrollTrigger: { trigger: ".spread", start: "top 68%" }
    });
  }

  /* ---- 5 · FILMSTRIP ---- */
  setupFilmstrip(true);

  /* ---- 3 · WORLDS ---- */
  setupWorlds(true);

  /* ---- 6 · MEMORY cinematic sequence ---- */
  var memory = document.getElementById("memory");
  if (memory) {
    var mImg = memory.querySelector(".memory-img");
    var mShade = memory.querySelector(".memory-shade");
    var mQ = memory.querySelector(".memory-q");
    var mA = memory.querySelector(".memory-a");
    var tlM = gsap.timeline({ scrollTrigger: { trigger: memory, start: "top top", end: "bottom bottom", scrub: 0.7 } });
    tlM.fromTo(mImg, { scale: 1 }, { scale: 1.045, ease: "none", duration: 2.4 }, 0)
       .fromTo(mQ, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 1.05, ease: "none" }, 0.85)
       .to(mShade, { opacity: 0.46, duration: 1.4, ease: "none" }, 1.9)
       .to(mQ, { opacity: 0, y: -5, duration: 0.55, ease: "sine.inOut" }, 3)
       .to(mShade, { opacity: 0.96, duration: 1, ease: "none" }, 3.1)
       .fromTo(mA, { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: 0.7, ease: "sine.inOut" }, 4.25);
  }

  /* ---- 7 · PHILOSOPHY mask ---- */
  var philoMask = document.querySelector(".philosophy-mask");
  if (philoMask) {
    var tlP = gsap.timeline({ scrollTrigger: { trigger: ".philosophy", start: "top 70%" } });
    tlP.to(philoMask, { clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "power4.out" }, 0)
       .to(".philosophy-label", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.18)
       .to(".philosophy-lead", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.34)
       .to(".philosophy-body", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.52);
  }

  /* ---- 9 · INQUIRY hero echo emerges ---- */
  var iPortrait = document.querySelector(".inquiry-portrait");
  if (iPortrait) {
    gsap.fromTo(iPortrait, { opacity: 0, scale: 1 }, {
      opacity: 0.23, scale: 1.025, ease: "none",
      scrollTrigger: { trigger: ".inquiry", start: "top bottom", end: "center center", scrub: 1.1 }
    });

    var tlI = gsap.timeline({ scrollTrigger: { trigger: ".inquiry", start: "top 72%", toggleActions: "play none none reverse" } });
    tlI.to(".inquiry-label", { opacity: 1, y: 0, duration: 0.9, ease: "sine.out" }, 0)
       .to(".inquiry-title", { opacity: 1, y: 0, duration: 1.8, ease: "sine.out" }, 0.18)
       .to(".inquiry-sub", { opacity: 1, y: 0, duration: 1.25, ease: "sine.out" }, 0.72)
       .to(".inquiry-link", { opacity: 1, y: 0, duration: 1.15, ease: "sine.out" }, 1.02);
  }

  /* ---- refresh after fonts / images settle ---- */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  var refreshCall;
  window.addEventListener("resize", function () {
    if (refreshCall) refreshCall.kill();
    refreshCall = gsap.delayedCall(0.2, function () { ScrollTrigger.refresh(); });
  });
  Promise.all(Array.prototype.slice.call(document.images).map(function (img) {
    return img.complete ? Promise.resolve() : new Promise(function (resolve) {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  })).then(function () { ScrollTrigger.refresh(); });
})();
