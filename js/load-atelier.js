async function loadAtelierProjects() {
  try {
    const response = await fetch('modules/atelier/projects.json');
    const data = await response.json();
    const container = document.getElementById('atelier-projects');

    if (!container) return;

    const worldsSection = container.closest('.atelier-worlds');
    if (worldsSection) worldsSection.removeAttribute('hidden');

    const categories = data.categories || [];
    const items = data.items || [];
    let projectIndex = 0;

    container.innerHTML = categories.map(category => {
      const categoryItems = items.filter(item => item.category === category);

      if (!categoryItems.length) return '';

      return `
        <section class="atelier-category" aria-labelledby="${slugify(category)}">
          <div class="section-divider atelier-category__divider">
            <span id="${slugify(category)}">${category}</span>
          </div>

          <div class="atelier-category__projects">
            ${categoryItems.map(item => createAtelierProject(item, projectIndex++)).join('')}
          </div>
        </section>
      `;
    }).join('');

    initAtelierFeatureVideos(container);

  } catch (error) {
    console.error('Error loading atelier projects:', error);
    const failedSection = document.querySelector('.atelier-worlds');
    if (failedSection) failedSection.setAttribute('hidden', '');
  }
}

function createAtelierProject(item, index) {
  if (item.layout === 'featured') {
    return createAtelierFeaturedProject(item);
  }

  const isReversed = index % 2 === 1 ? ' atelier-project--reverse' : '';
  const status = item.status || (item.url ? 'Live Demonstration' : 'Independent Concept');
  const linkLabel = item.linkLabel || 'View live demonstration';
  const media = `<img src="${item.image}" alt="${item.title}" loading="lazy">`;
  const linkedMedia = item.url
    ? `<a class="atelier-project__media-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${linkLabel}: ${item.title}">${media}</a>`
    : media;
  const liveLink = item.url
    ? `<a class="atelier-project__live-link" href="${item.url}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>`
    : '';

  return `
    <article class="atelier-project${isReversed}">
      <div class="atelier-project__media">
        ${linkedMedia}
      </div>

      <div class="atelier-project__content">
        <p class="atelier-status">${status}</p>
        <p class="atelier-project__eyebrow">${item.eyebrow || item.category}</p>
        <h2 class="atelier-project__title">${item.title}</h2>

        <dl class="atelier-project__meta">
          <div>
            <dt>Type</dt>
            <dd>${item.type}</dd>
          </div>
          <div>
            <dt>World</dt>
            <dd>${item.world}</dd>
          </div>
          <div>
            <dt>Mood</dt>
            <dd>${item.mood}</dd>
          </div>
        </dl>

        <p class="atelier-project__description">${item.description}</p>
        ${liveLink}
      </div>
    </article>
  `;
}

function createAtelierFeaturedProject(item) {
  const linkLabel = item.linkLabel || `Enter ${item.title}`;

  return `
    <article class="section atelier-rubedo atelier-fauve" aria-labelledby="fauve-feature-title">
      <div class="atelier-rubedo__watermark" aria-hidden="true">${item.title}</div>

      <div class="container atelier-rubedo__inner">
        <div class="atelier-rubedo__content">
          <p class="atelier-rubedo__eyebrow">${item.eyebrow}</p>
          <h2 id="fauve-feature-title">${item.title}</h2>
          <p class="atelier-rubedo__subtitle">${item.subtitle}</p>
          <p class="atelier-rubedo__description">${item.description}</p>
          <a class="atelier-rubedo__link" href="${item.url}" target="_blank" rel="noopener noreferrer">
            ${linkLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="atelier-rubedo__film">
          <video class="atelier-rubedo__video" muted loop playsinline preload="metadata" poster="${item.poster}" aria-hidden="true" data-feature-video>
            <source src="${item.video}" type="video/mp4">
          </video>
        </div>
      </div>
    </article>
  `;
}

function initAtelierFeatureVideos(scope) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  scope.querySelectorAll('[data-feature-video]').forEach(video => {
    if (reduceMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.25 });

    observer.observe(video);
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

document.addEventListener('DOMContentLoaded', loadAtelierProjects);
