async function loadCollections() {
  try {
    const data = await fetch('/modules/collections/collections.json').then(r => r.json());
    const items = data.items.slice(0, 2);

    const container = document.querySelector('#collections .grid--2');
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
    console.error("Error loading collections:", e);
  }
}

document.addEventListener('DOMContentLoaded', loadCollections);
