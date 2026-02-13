// ===============================
// LOAD PINNED & ALL POSTS (WITHOUT LATEST)
// ===============================

async function loadLetters() {
  try {
    // ---- Load pinned ----
    const pinned = await fetch("/modules/letter/pinned.json").then(r => r.json());

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

    // --------------------------
    // 3. RENDER ALL LETTERS (FULL FORMAT)
    // --------------------------
    const list = document.getElementById("letter-list");

    if (!list) {
      console.error("❌ Element #letter-list not found in DOM");
      return;
    }

    list.innerHTML = posts.map(post => createFullEntry(post)).join("");

    // --------------------------
    // 4. AUTO-SCROLL TO SPECIFIC POST
    // --------------------------
    const params = new URLSearchParams(window.location.search);
    const target = params.get("post");

    if (target) {
      const el = document.getElementById(`post-${target}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 300); // Wait until DOM finishes rendering
      }
    }

  } catch (err) {
    console.error("❌ Error loading letters:", err);
  }
}

// ===============================
// LOAD ALL JSON FILES IN /posts/
// ===============================
async function loadAllPosts() {
  const files = ["001.json", "002.json", "003.json"]; // Add future posts here: "002.json", "003.json", ...

  const loaded = [];

  for (const file of files) {
    try {
      const res = await fetch(`/modules/letter/posts/${file}`);

      if (!res.ok) {
        console.error(`❌ File not found: ${file}`);
        continue;
      }

      const data = await res.json();

      if (!data.content || !Array.isArray(data.content)) {
        console.error(`❌ Invalid or missing 'content' in ${file}`);
        continue;
      }

      loaded.push({
        id: file.replace(".json", ""), // ← ADDED ID
        title: data.title,
        date: data.date,
        content: data.content
      });

    } catch (err) {
      console.error(`❌ Error loading file ${file}:`, err);
    }
  }

  // Sort newest first
  return loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ===============================
// TEMPLATE FOR FULL POST
// (WITH ID FOR AUTO-SCROLL)
// ===============================
function createFullEntry(post) {
  return `
    <article class="letter__entry" id="post-${post.id}">
      <h3 class="letter__entry-title">${post.title}</h3>
      <p class="letter__date">${post.date}</p>
      <div class="letter__content">
        ${post.content.map(p => `<p>${p}</p>`).join("")}
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadLetters);
