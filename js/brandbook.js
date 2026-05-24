(function () {
  const viewers = document.querySelectorAll('[data-brandbook-viewer]');
  if (!viewers.length) return;

  viewers.forEach((viewer) => {
    const totalPages = Number(viewer.dataset.totalPages || 20);
    const pagePattern = viewer.dataset.pagePattern || 'assets/images/brandbook/aya-muse-brandbook-{page2}.jpg';
    const brandbookTitle = viewer.dataset.brandbookTitle || 'Brandbook';
    const stack = viewer.querySelector('[data-brandbook-stack]');
    const previousButton = viewer.querySelector('[data-brandbook-prev]');
    const nextButton = viewer.querySelector('[data-brandbook-next]');
    const counter = viewer.querySelector('[data-brandbook-counter]');
    const thumbs = viewer.querySelector('[data-brandbook-thumbs]');
    const pageCount = 5;

    if (!stack || !previousButton || !nextButton || !counter) return;

    let currentPage = 1;
    let zoomedPage = null;

    function pagePath(page) {
      return pagePattern
        .replace('{page}', String(page))
        .replace('{page2}', String(page).padStart(2, '0'));
    }

    function pageWindow() {
      const maxStart = Math.max(1, totalPages - pageCount + 1);
      const start = Math.min(currentPage, maxStart);
      const end = Math.min(totalPages, start + pageCount - 1);
      return { start, end };
    }

    function updateStack() {
      const { start, end } = pageWindow();
      const pages = [];

      for (let page = start; page <= end; page++) pages.push(page);

      stack.innerHTML = pages.map((page, index) => `
        <button class="brandbook-stack__page brandbook-stack__page--${index + 1}${page === zoomedPage ? ' is-zoomed' : ''}" type="button" data-page="${page}" aria-label="Preview ${brandbookTitle} page ${page}">
          <img src="${pagePath(page)}" alt="${brandbookTitle} page ${page}">
          <span>${String(page).padStart(2, '0')}</span>
        </button>
      `).join('');

      counter.textContent = `Pages ${start}-${end} / ${totalPages}`;
      previousButton.disabled = start <= 1;
      nextButton.disabled = end >= totalPages;
      updateThumbs();
    }

    function updateThumbs() {
      if (!thumbs) return;

      const { start, end } = pageWindow();
      const activePage = zoomedPage || start;

      thumbs.querySelectorAll('button').forEach((button) => {
        const page = Number(button.dataset.page);
        const active = page === activePage;
        const visible = page >= start && page <= end;
        button.classList.toggle('is-active', active);
        button.classList.toggle('is-in-view', visible);
        button.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function goToPage(page) {
      currentPage = Math.max(1, Math.min(totalPages, page));
      updateStack();
    }

    function keepPageVisible(page) {
      const { start, end } = pageWindow();

      if (page < start || page > end) {
        goToPage(page);
        return;
      }

      updateStack();
    }

    function buildThumbs() {
      if (!thumbs) return;

      thumbs.innerHTML = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return `
          <button type="button" data-page="${page}" aria-label="Show ${brandbookTitle} pages from ${page}">
            <img src="${pagePath(page)}" alt="">
          </button>
        `;
      }).join('');

      thumbs.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-page]');
        if (!button) return;
        zoomedPage = Number(button.dataset.page);
        keepPageVisible(zoomedPage);
      });
    }

    stack.addEventListener('click', (event) => {
      const pageButton = event.target.closest('button[data-page]');
      if (!pageButton) return;

      const page = Number(pageButton.dataset.page);
      zoomedPage = zoomedPage === page ? (page >= totalPages ? 1 : page + 1) : page;
      keepPageVisible(zoomedPage);
    });

    previousButton.addEventListener('click', () => {
      zoomedPage = null;
      goToPage(currentPage - pageCount);
    });

    nextButton.addEventListener('click', () => {
      zoomedPage = null;
      goToPage(currentPage + pageCount);
    });

    buildThumbs();
    updateStack();
  });
})();
