async function loadFuture() {
  try {
    const data = await fetch('/modules/future/future.json').then(r => r.json());
    const items = data.items.slice(0, 2);

    const container = document.querySelector('#future .grid--2');
    if (!container) return;

    container.innerHTML = items.map(item => `
      <article class="card">
        
        <img src="${item.image}" alt="${item.title}" class="card__image">

        <h3 class="card__title">${item.title}</h3>

        <p class="card_date">${item.date}</p>

        <p class="card__text">${item.excerpt}</p>

        <a class="card__link">${item.coming}</a>

      </article>
    `).join('');

  } catch (e) {
    console.error('Error loading future:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadFuture);
