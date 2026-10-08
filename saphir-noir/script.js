/* SAPHIR NOIR · interaction · Aya Muse Atelier */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · entrance */
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 120));

  /* nav background after hero */
  const nav = document.querySelector('.nav');

  /* 2 · scroll progress for pinned scenes (--p 0→1) */
  const scenes = [...document.querySelectorAll('.stone, .turn, .ritual')];
  const progress = el => {
    const r = el.getBoundingClientRect();
    const pin = el.querySelector('.stone-pin, .turn-pin');
    const total = el.classList.contains('ritual') ? r.height + innerHeight : Math.max(1, r.height - pin.offsetHeight);
    const done = el.classList.contains('ritual') ? innerHeight - r.top : -r.top;
    return Math.min(1, Math.max(0, done / total));
  };

  /* stone specs light up one by one */
  const specs = [...document.querySelectorAll('.spec')];

  /* 4 · ring turning on scroll */
  const canvas = document.querySelector('.turn-canvas');
  const ctx = canvas.getContext('2d');
  const FRAMES = 63;
  const frames = [];
  let lastFrame = -1;
  let requestedFrame = 0;
  const src = i => `assets/frames/r${String(i + 1).padStart(3, '0')}.jpg`;
  const draw = i => {
    const img = frames[i];
    if (!img || !img.complete || !img.naturalWidth || i === lastFrame) return;
    lastFrame = i;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  const loadFrames = () => {
    for (let i = 0; i < (reduce ? 1 : FRAMES); i++) {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => {
        if (i === requestedFrame) draw(i);
        else if (lastFrame === -1) draw(i);
      };
      frames.push(im);
      im.src = src(i);
    }
  };
  // load frames when the section approaches
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) { loadFrames(); o.disconnect(); }
  }, { rootMargin: '150% 0px' }).observe(canvas);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', scrollY > 40);
      scenes.forEach(s => {
        const p = reduce ? 0 : progress(s);
        s.style.setProperty('--p', p.toFixed(4));
        if (s.classList.contains('stone')) specs.forEach((el, i) => el.classList.toggle('on', p > .28 + i * .12));
        if (s.classList.contains('turn') && frames.length) {
          requestedFrame = Math.round(p * (FRAMES - 1));
          draw(requestedFrame);
        }
      });
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
  if (reduce) document.querySelector('.turn-line').textContent = 'A closer look at the ring.';

  /* videos play only while visible */
  const vids = document.querySelectorAll('video');
  const vo = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { v.preload = 'auto'; v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: .25 });
  vids.forEach(v => vo.observe(v));
  if (reduce) document.querySelector('.hero-video')?.pause();

  /* scroll reveal */
  const rv = document.querySelectorAll('.sec-head, .step, .d, .ritual-copy > *, .reserve-inner > *');
  rv.forEach(el => el.classList.add('rv'));
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const sibs = [...e.target.parentElement.children].filter(c => c.classList.contains('rv'));
      e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 4) * 80}ms`;
      e.target.classList.add('in');
      ro.unobserve(e.target);
    }
  }), { threshold: .15 });
  rv.forEach(el => ro.observe(el));

  /* 7 · request form — concept: no data leaves the page */
  const form = document.querySelector('.form');
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      note.textContent = 'Please leave your name and a valid email.';
      return;
    }
    note.textContent = 'This is a concept preview. No request was sent and your details were not stored.';
    form.reset();
  });
})();

/* back to top / wordmark: scroll to the very top (the fixed nav can't be an anchor target) */
document.querySelectorAll('a[href="#top"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}));
