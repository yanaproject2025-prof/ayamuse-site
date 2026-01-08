async function loadCollaborations() {
  const res = await fetch('/modules/collaborations/collaborations.json');
  const data = await res.json();

  const box = document.getElementById('collaborations-content');
  if (!box) return;

  let html = `<p class="card__eyebrow">${data.eyebrow}</p>`;

  data.sections.forEach(s => {
    if (s.title) html += `<h3>${s.title}</h3>`;

    if (s.paragraphs) {
      s.paragraphs.forEach(p => {
        html += `<p>${p}</p>`;
      });
    }

    if (s.list) {
      html += `<ul>`;
      s.list.forEach(i => html += `<li>${i}</li>`);
      html += `</ul>`;
    }

    if (s.email) {
      html += `<p class="card__email">${s.email}</p>`;
    }
  });

  box.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadCollaborations);
