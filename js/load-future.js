async function loadNews() {
  try {
    const data = await fetch('/modules/news/news.json').then(r => r.json());
    const items = data.items.slice(0, 2);

    const container = document.querySelector('#news .grid--2');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <article class="card">
        
        ${item.image ? `
          <img src="${item.image}" alt="${item.title}" class="card__image">
        ` : ''}

        <h3 class="card__title">${item.title}</h3>

        <p class="card_date">${item.date}</p>

        <p class="card__text">${item.excerpt}</p>

        <a href="${item.link}" target="_blank" rel="noopener" class="card__link">
          ${item.link_text}
        </a>

      </article>
    `).join('');

  } catch (e) {
    console.error('Error loading news:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
