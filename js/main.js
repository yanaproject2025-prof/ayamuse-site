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

/* ----------------------------------
   МОДУЛЬНАЯ ПОДГРУЗКА РАЗДЕЛОВ
---------------------------------- */

async function loadSection(id, url) {
  try {
    const container = document.getElementById(id);
    if (!container) return;

    const response = await fetch(url);
    const html = await response.text();

    container.innerHTML = html;
  } catch (error) {
    console.error("Error loading section:", id, error);
  }
}
   /* ----------------------------------
   FIX ANCHOR SCROLL FOR DYNAMIC SECTIONS
  ---------------------------------- */
  (function () {
    const hash = window.location.hash;
    if (!hash) return;

    let tries = 0;
    const maxTries = 60;

    function scrollWhenReady() {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else if (tries < maxTries) {
        tries++;
        setTimeout(scrollWhenReady, 50);
      }
    }

    window.addEventListener("DOMContentLoaded", scrollWhenReady);
  })();
