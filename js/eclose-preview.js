(() => {
  const section = document.querySelector('.flagship--eclose');
  if (!section) return;
  const media = section.querySelector('.flagship-media');
  const canvas = section.querySelector('canvas'), ctx = canvas.getContext('2d');
  const button = section.querySelector('.eclose-replay');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const frameRoot = new URL('../eclose/frames/rose/', document.currentScript.src);
  const cache = new Map(), pending = new Map(), failed = new Set();
  let queue = [], pos = 0, target = 0, velocity = 0, drawn = -1;
  let raf = 0, active = false, seen = false, replaying = false, epoch = 0;
  canvas.width = innerWidth <= 680 ? 480 : 640;
  canvas.height = Math.round(canvas.width * 1608 / 1288);
  if (!ctx || !window.createImageBitmap) return;
  button.hidden = false;

  function request(index) {
    if (index < 0 || index > 60 || cache.has(index) || pending.has(index) || queue.includes(index) || failed.has(index)) return;
    queue.push(index); pump();
  }
  function pump() {
    while (pending.size < 3 && queue.length) {
      const index = queue.shift(), currentEpoch = epoch;
      const controller = new AbortController();
      pending.set(index, controller);
      (async () => {
        try {
          const response = await fetch(new URL(`f_${String(index + 1).padStart(2, '0')}.webp`, frameRoot), {signal:controller.signal});
          if (!response.ok) throw Error('Frame unavailable');
          const image = await createImageBitmap(await response.blob(), {resizeWidth:canvas.width, resizeHeight:canvas.height});
          if (currentEpoch !== epoch) { image.close(); return; }
          cache.set(index, image);
          if (index === Math.floor(pos) || index === Math.ceil(pos)) draw(pos);
          while (cache.size > 12) {
            const direction = target >= pos ? 1 : -1;
            const rank = i => Math.abs(i-pos) + ((i-pos)*direction < -2 ? 61 : 0);
            const drop = [...cache.keys()].sort((a,b) => rank(b)-rank(a))[0];
            cache.get(drop).close(); cache.delete(drop);
          }
        } catch (error) {
          if (currentEpoch === epoch && error.name !== 'AbortError') failed.add(index);
        } finally {
          if (currentEpoch === epoch) { pending.delete(index); pump(); }
        }
      })();
    }
  }
  function draw(value) {
    const low = Math.floor(value), high = Math.ceil(value);
    if (!cache.has(low) || !cache.has(high)) return false;
    if (value === drawn) return true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cache.get(low), 0, 0, canvas.width, canvas.height);
    if (high !== low) {
      ctx.globalAlpha = value-low;
      ctx.drawImage(cache.get(high), 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
    drawn = value; return true;
  }
  function frame(value) {
    const low = Math.floor(value), high = Math.ceil(value), direction = target >= pos ? 1 : -1;
    queue = []; request(low); request(high);
    const ready = draw(value);
    if (ready || motion.matches) pos = value;
    if (!motion.matches) for (let i=1; i<=8; i++) request((direction > 0 ? high : low) + i*direction);
    return ready;
  }
  function animate() {
    if (raf || !active || document.hidden || motion.matches) return;
    let last = performance.now();
    function tick(now) {
      if (!active || document.hidden || motion.matches) { raf=0; return; }
      const dt = Math.min(40,now-last)/1000; last=now;
      const gap=target-pos, speed=gap>=0 ? 60/4.6 : 60/3.6;
      const desired=Math.max(-speed,Math.min(speed,gap*4));
      velocity+=(desired-velocity)*(1-Math.exp(-dt/.16));
      let next=Math.max(0,Math.min(60,pos+velocity*dt));
      if ((target-next)*gap<=0 || Math.abs(gap)<.015) next=target;
      const ready=frame(next);
      if (!ready) velocity=0;
      if (failed.has(Math.floor(next)) || failed.has(Math.ceil(next))) { raf=0; velocity=0; return; }
      if (pos===target && ready) {
        velocity=0;
        if (replaying && target===0) { target=60; replaying=false; }
        else { raf=0; return; }
      }
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
  }
  function play() {
    if (raf) return;
    // Explicit taps still work when the visitor has scrolled past the autoplay threshold.
    const rect=media.getBoundingClientRect();
    active=rect.bottom>0 && rect.top<innerHeight;
    failed.clear();
    if (motion.matches) {
      target=pos>=30 ? 0 : 60;
      frame(target);
      button.textContent=target ? 'Show closed flowers' : 'Show open flowers';
      return;
    }
    replaying=pos>.1;
    target=replaying ? 0 : 60;
    animate();
  }
  function pause() { cancelAnimationFrame(raf); raf=0; velocity=0; }
  function release() {
    pause(); epoch++;
    pending.forEach(controller=>controller.abort()); pending.clear(); queue=[];
    cache.forEach(image=>image.close()); cache.clear(); failed.clear();
  }
  // Warm just this scene near the viewport; no film download at the top of the homepage.
  new IntersectionObserver(entries=>entries.forEach(entry=>{
    if (entry.isIntersecting) {
      if (motion.matches) { pos=target=60; request(60); }
      else frame(pos);
    } else release();
  }), {rootMargin:'400px 0px'}).observe(media);
  new IntersectionObserver(entries=>entries.forEach(entry=>{
    active=entry.isIntersecting && entry.intersectionRatio>=.55;
    if (!active) { pause(); return; }
    if (!seen) { seen=true; target=60; }
    if (!motion.matches && (pos!==target || replaying)) animate();
  }), {threshold:.55}).observe(media);
  media.addEventListener('pointerenter', event=>{
    if (event.pointerType==='mouse' && active && seen && pos>=59.99 && !motion.matches) play();
  });
  media.addEventListener('click', event=>{ if (event.button===0 && !event.target.closest('button')) play(); });
  button.addEventListener('click', play);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) pause(); else if(pos!==target || replaying) animate(); });
  motion.addEventListener('change',()=>{
    pause(); replaying=false;
    if (motion.matches) { pos=target=60; frame(60); }
    button.textContent=motion.matches ? 'Show closed flowers' : 'Replay the bloom';
  });
  if(motion.matches) button.textContent='Show closed flowers';
})();
