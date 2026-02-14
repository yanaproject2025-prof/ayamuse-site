async function loadNews() {
  try {
    const data = await fetch('/modules/news/news.json').then(r => r.json());
    const items = data.items;

    // --- 🏠 Главная страница ---
    const homeContainer = document.querySelector('#news .grid--2');

    if (homeContainer) {
      const latestTwo = items.slice(0, 2);

      homeContainer.innerHTML = latestTwo.map(item => `
        <article class="card">
          ${item.image ? `
            <img src="${item.image}" alt="${item.title}" class="card__image">
          ` : ''}

          <h3 class="card__title">${item.title}</h3>
          <p class="card_date">${item.date}</p>
          <p class="card__text">${item.excerpt}</p>

          <a href="${item.link}" target="_blank" class="card__link">
            ${item.link_text}
          </a>
        </article>
      `).join('');
    }

    // --- 📰 Страница news.html ---
    const newsPageContainer = document.getElementById('news-digest');

    if (newsPageContainer) {
      const archive = items.slice(2); // ВСЕ кроме двух первых

      newsPageContainer.innerHTML = archive.map(item => `
        <article class="card">
          ${item.image ? `
            <img src="${item.image}" alt="${item.title}" class="card__image">
          ` : ''}

          <h3 class="card__title">${item.title}</h3>
          <p class="card_date">${item.date}</p>
          <p class="card__text">${item.excerpt}</p>

          ${item.link ? `
            <a href="${item.link}" target="_blank" class="card__link">
              ${item.link_text}
            </a>
          ` : ''}
        </article>
      `).join('');
    }

  } catch (e) {
    console.error('Error loading news:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
