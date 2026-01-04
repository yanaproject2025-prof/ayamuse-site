// ------------------------------
// LOAD PINNED + LATEST LETTERS
// ------------------------------

async function loadLetters() {
  try {
    // Load pinned & latest JSON
    const pinned = await fetch("/modules/letter/pinned.json").then(r => r.json());
    const latest = await fetch("/modules/letter/latest.json").then(r => r.json());

    // ---- Render PINNED ----
    document.getElementById("pinned-title").textContent = pinned.title;
    document.getElementById("pinned-date").textContent = pinned.date;

    const pinnedBlock = document.getElementById("pinned-content");
    pinnedBlock.innerHTML = pinned.content
      .map(p => `<p>${p}</p>`)
      .join("");

    // ---- Render LIST OF LETTERS (only latest for now) ----
    const list = document.getElementById("letter-list");

    const latestCard = `
      <article class="letter__card">
        <h3 class="letter__card-title">${latest.title}</h3>
        <p class="letter__date">${latest.date}</p>
        <p class="letter__excerpt">${latest.excerpt}</p>
        <a href="${latest.url}" class="letter__link">Open →</a>
      </article>
    `;

    list.innerHTML = latestCard;

  } catch (err) {
    console.error("Error loading letters:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadLetters);
