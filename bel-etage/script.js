/* Le Bel Étage — interactions */
(() => {
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Opening curtain ---------- */
  const heroImg = document.querySelector('.cover-photo img');
  const ready = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    heroImg && !heroImg.complete ? new Promise(r => { heroImg.addEventListener('load', r, { once: true }); heroImg.addEventListener('error', r, { once: true }); }) : Promise.resolve(),
  ]);
  const minShow = new Promise(r => setTimeout(r, reduce ? 0 : 1100));
  const failSafe = new Promise(r => setTimeout(r, 3200));
  Promise.race([Promise.all([ready, minShow]), failSafe]).then(() => body.classList.remove('is-loading'));

  /* ---------- Reveal on scroll ---------- */
  // Stagger siblings that share a parent.
  document.querySelectorAll('.swatches, .materials, .invitation-text, .offer-lines, .map-places').forEach(group => {
    [...group.querySelectorAll(':scope > [data-reveal]')].forEach((el, i) => el.style.setProperty('--d', `${i * 0.09}s`));
  });
  document.querySelectorAll('.house-bar span').forEach((el, i) => el.style.transitionDelay = `${i * 0.09}s`);

  const revealables = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    revealables.forEach(el => io.observe(el));
  }

  /* ---------- Top bar ---------- */
  const topbar = document.querySelector('.topbar');
  const hero = document.querySelector('.cover');

  /* ---------- Whereabouts: which room you are in ---------- */
  const where = document.querySelector('.whereabouts');
  const whereRoom = where.querySelector('.whereabouts-room');
  const rooms = [...document.querySelectorAll('[data-room]')];
  let current = null;
  const setRoom = el => {
    if (el === current) return;
    current = el;
    where.style.setProperty('--tone', el.dataset.tone);
    whereRoom.classList.add('is-swapping');
    setTimeout(() => { whereRoom.textContent = el.dataset.room; whereRoom.classList.remove('is-swapping'); }, 260);
  };

  /* ---------- Parallax ---------- */
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const desktop = window.matchMedia('(min-width: 761px)');

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const heroEnd = hero.offsetHeight * 0.55;

    topbar.classList.toggle('is-solid', y > heroEnd);

    // The room whose block crosses the middle of the screen.
    const mid = vh * 0.5;
    for (let i = rooms.length - 1; i >= 0; i--) {
      const r = rooms[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid * 0.4) { setRoom(rooms[i]); break; }
    }

    if (!reduce && desktop.matches) {
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  desktop.addEventListener('change', () => { if (!desktop.matches) parallax.forEach(el => el.style.transform = ''); onScroll(); });
  onScroll();

  /* ---------- Map: on phones it scrolls sideways, opened on the house ---------- */
  const mapEl = document.querySelector('.map-scroll');
  const centreMap = () => { if (mapEl && mapEl.scrollWidth > mapEl.clientWidth) mapEl.scrollLeft = mapEl.scrollWidth * 0.455 - mapEl.clientWidth / 2; };
  window.addEventListener('load', centreMap);
  centreMap();

  /* ---------- The imaginary auction ---------- */
  const form = document.getElementById('offer-form');
  const input = document.getElementById('offer-amount');
  const field = input.closest('.offer-field');
  const result = document.getElementById('offer-result');
  const sum = document.getElementById('offer-sum');
  const again = document.getElementById('offer-again');
  const fmt = n => new Intl.NumberFormat('fr-FR').format(n);

  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 12);
    input.value = digits ? fmt(Number(digits)) : '';
    field.classList.remove('is-error');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const amount = Number(input.value.replace(/\D/g, ''));
    if (!amount) {
      field.classList.remove('is-error'); void field.offsetWidth; field.classList.add('is-error');
      input.focus();
      return;
    }
    // Count up to the offer, then reveal her reply. Nothing is stored or sent.
    form.hidden = true;
    result.hidden = false;
    if (reduce) { sum.textContent = `€ ${fmt(amount)}`; return; }
    const start = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      sum.textContent = `€ ${fmt(Math.round(amount * eased))}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  again.addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    input.focus();
  });

  /* ---------- Year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
