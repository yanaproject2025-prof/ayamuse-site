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

    // Insert latest.json as FIRST full post
    posts.unshift({
      title: latest.title,
      date: latest.date,
      content: latest.content
    });

    // --------------------------
    // 3. RENDER FULL POSTS LENTA
    // --------------------------
    const list = document.getElementById("letter-list");
    list.innerHTML = posts.map(post => createFullEntry(post)).join("");

  } catch (err) {
    console.error("Error loading letters:", err);
  }
}

// ===============================
// LOAD ALL JSON FILES IN /posts/
// ===============================
async function loadAllPosts() {
  try {
    // manually list post files:
    const files = [
      "001.json"
    ];

    const loaded = [];

    for (const file of files) {
      const data = await fetch(`/modules/letter/posts/${file}`).then(r => r.json());
      loaded.push({
        title: data.title,
        date: data.date,
        content: data.content
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
// TEMPLATE FOR FULL LETTER ENTRY
// ===============================
function createFullEntry(post) {
  return `
    <article class="letter__entry">
      <h3 class="letter__entry-title">${post.title}</h3>
      <p class="letter__date">${post.date}</p>
      <div class="letter__content">
        ${post.content.map(p => `<p>${p}</p>`).join("")}
      </div>
    </article>
  `;
}

// Run loader
document.addEventListener("DOMContentLoaded", loadLetters);
