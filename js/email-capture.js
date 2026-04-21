import { getFirestore, collection, addDoc, serverTimestamp } 
from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

const db = getFirestore();

const form = document.getElementById('ayaForm');
const input = document.getElementById('ayaEmail');
const success = document.getElementById('ayaSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = input.value.trim();

  try {
    await addDoc(collection(db, 'email_signups'), {
      email: email,
      createdAt: serverTimestamp(),
    });

    form.style.display = "none";
    success.style.display = "block";

  } catch (err) {
    console.log(err);
  }
});
