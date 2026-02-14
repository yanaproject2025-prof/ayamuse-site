async function loadNews() {
  try {
    const data = await fetch('/modules/news/news.json').then(r => r.json());
    const items = data.items.slice(0, 2);

    const container = document.querySelector('#news .grid--2');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <article class="future-card">

        ${item.image ? `
          <img src="${item.image}" alt="${item.title}" class="future-card__image">
        ` : ''}

        <div class="future-card__content">
          <h3 class="future-card__title">${item.title}</h3>
          <p class="future-card__date">${item.date}</p>
          <p class="future-card__text">${item.excerpt}</p>
          <a href="${item.link}" target="_blank" class="future-card__link">
            ${item.link_text}
          </a>
        </div>

      </article>
    `).join('');

  } catch (e) {
    console.error('Error loading news:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
