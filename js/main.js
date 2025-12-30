(function () {
  const burger = document.querySelector('.burger');
  const drawer = document.getElementById('mobileMenu');

  if (!burger || !drawer) return;

  function openDrawer() {
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    expanded ? closeDrawer() : openDrawer();
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeDrawer());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
})();
