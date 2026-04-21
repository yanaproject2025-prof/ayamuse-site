const db = window.db;

const form = document.getElementById('ayaForm');
const input = document.getElementById('ayaEmail');
const success = document.getElementById('ayaSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();

    try {
      await window.firebase.firestore().collection('email_signups').add({
        email: email,
        source: 'website',
        page: 'index',
        createdAt: new Date()
      });

      form.style.display = "none";
      success.style.display = "block";

    } catch (err) {
      console.log(err);
    }
  });
}
