// ----------------------------------------------------
// Load data for LETTER section
// ----------------------------------------------------

async function loadLetterModules() {
  const pinned = await fetch('/modules/letter/pinned.json').then(r => r.json());
  const latest = await fetch('/modules/letter/latest.json').then(r => r.json());

  // Fill pinned card
  document.getElementById('letter-pinned-title').textContent = pinned.title;
  document.getElementById('letter-pinned-excerpt').textContent = pinned.excerpt;
  document.getElementById('letter-pinned-date').textContent = pinned.date;
  document.getElementById('letter-pinned-link').href = pinned.url;

  // Fill latest card
  document.getElementById('letter-latest-title').textContent = latest.title;
  document.getElementById('letter-latest-excerpt').textContent = latest.excerpt;
  document.getElementById('letter-latest-date').textContent = latest.date;

  // Correct link to full publication
  document.getElementById('letter-latest-link').href = `/letter.html?post=${latest.url}`;
}



// ----------------------------------------------------
// Load data for NEWS section
// ----------------------------------------------------

async function loadNewsModules() {
  try {
    const data = await fetch('/modules/news/news.json').then(r => r.json());
    const items = data.items.slice(0, 2); // показываем 1–2 новости

    const container = document.querySelector('#news .grid--2');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <article class="card">
        <h3 class="card__title">${item.title}</h3>

        <p class="card_date">${item.date}</p>  <!-- ВОТ ОНА: ДАТА -->

        <p class="card__text">${item.excerpt}</p>

        <a href="${item.link}" target="_blank" rel="noopener" class="card__link">
          ${item.link_text}
        </a>
      </article>
    `).join('');

  } catch (e) {
    console.error('Error loading news:', e);
  }

  // ----------------------------------------------------
// Load data for FUTURE section
// ----------------------------------------------------

async function loadFutureModules() {
  try {
    const data = await fetch('/modules/future/future.json').then(r => r.json());
    const items = data.items.slice(0, 2);

    const container = document.querySelector('#future .grid--2');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <article class="card card--future">

        <img src="${item.image}" alt="${item.title}" class="card__image">

        <h3 class="card__title">${item.title}</h3>

        <p class="card_date">${item.date}</p>

        <p class="card__text">${item.excerpt}</p>

        <span class="card__soon">${item.coming}</span>

      </article>
    `).join('');

  } catch (e) {
    console.error('Error loading future section:', e);
  }
}



// ----------------------------------------------------
// INIT MODULES
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', loadLetterModules);
document.addEventListener('DOMContentLoaded', loadNewsModules);
document.addEventListener('DOMContentLoaded', loadFutureModules);
