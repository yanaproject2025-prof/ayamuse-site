import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const db = window.db;

  const form = document.getElementById('ayaForm');
  const input = document.getElementById('ayaEmail');
  const success = document.getElementById('ayaSuccess');

  if (!form || !db) {
    console.error("Form or DB not found");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();

    if (!email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    try {
      await addDoc(collection(db, 'email_signups'), {
        email: email,
        source: 'website',
        page: 'index',
        createdAt: serverTimestamp(),
      });

      form.style.display = "none";
      success.style.display = "block";

    } catch (err) {
      console.error("ERROR:", err);
    }
  });
});
