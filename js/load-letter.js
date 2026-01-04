// ===============================
// LOAD PINNED, LATEST & ALL POSTS
// ===============================

async function loadLetters() {
  try {
    // ---- Load pinned & latest ----
    const pinned = await fetch("/modules/letter/pinned.json").then(r => r.json());
    const latest = await fetch("/modules/letter/latest.json").then(r => r.json());

    // --------------------------
    // 1. RENDER PINNED POST
    // --------------------------
    document.getElementById("pinned-title").textContent = pinned.title;
    document.getElementById("pinned-date").textContent = pinned.date;

    document.getElementById("pinned-content").innerHTML = pinned.content
      .map(p => `<p>${p}</p>`)
      .join("");

    // --------------------------
    // 2. LOAD ALL POSTS FROM /posts/
    // --------------------------
    const posts = await loadAllPosts();

    // Add the latest.json as the "most recent"
    posts.unshift({
      title: latest.title,
      date: latest.date,
      excerpt: latest.excerpt,
      url: latest.url
    });

    // --------------------------
    // 3. RENDER LIST OF ALL LETTERS
    // --------------------------
    const list = document.getElementById("letter-list");
    list.innerHTML = posts
      .map(post => createCard(post))
      .join("");

  } catch (err) {
    console.error("Error loading letters:", err);
  }
}

// ===============================
// LOAD ALL JSON FILES IN /posts/
// ===============================
async function loadAllPosts() {
  try {
    // GitHub Pages cannot list directories,
    // so you MUST manually list files here.
    const files = [
      "001.json"
    ];

    const loaded = [];

    for (const file of files) {
      const data = await fetch(`/modules/letter/posts/${file}`).then(r => r.json());
      loaded.push({
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        url: `/letter.html?post=${file.replace(".json", "")}`
      });
    }

    // Sort newest first
    return loaded.sort((a, b) => new Date(b.date) - new Date(a.date));

  } catch (e) {
    console.error("Error loading posts:", e);
    return [];
  }
}

// ===============================
// CARD TEMPLATE
// ===============================
function createCard(post) {
  return `
    <article class="letter__card">
      <h3 class="letter__card-title">${post.title}</h3>
      <p class="letter__date">${post.date}</p>
      <p class="letter__excerpt">${post.excerpt}</p>
      <a href="${post.url}" class="letter__link">Open →</a>
    </article>
  `;
}

// Run loader
document.addEventListener("DOMContentLoaded", loadLetters);
