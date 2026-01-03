// Load data for LETTER section
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
  document.getElementById('letter-latest-link').href = latest.url;
}

document.addEventListener('DOMContentLoaded', loadLetterModules);
