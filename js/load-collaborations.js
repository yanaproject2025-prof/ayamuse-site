async function loadCollaborationsModule() {
  try {
    const data = await fetch('/modules/collaborations/collaborations.json')
      .then(r => r.json());

    const container = document.getElementById('collab-content');
    if (!container) return;

    let html = `<p class="card__eyebrow">${data.eyebrow}</p>`;

    data.sections.forEach(section => {
      html += `<h3 class="card__title">${section.title}</h3>`;

      if (section.paragraphs) {
        section.paragraphs.forEach(p => {
          html += `<p class="card__text">${p}</p>`;
        });
      }

      if (section.list) {
        html += `<ul class="card__list">`;
        section.list.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul>`;
      }

      if (section.email) {
        html += `<p class="card__email">${section.email}</p>`;
      }
    });

    container.innerHTML = html;

  } catch (e) {
    console.error('Error loading collaborations module:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadCollaborationsModule);
