(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ayaForm');
    const input = document.getElementById('ayaEmail');
    const success = document.getElementById('ayaSuccess');

    if (!form || !input) return;

    function waitForSubmitter() {
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const timer = window.setInterval(() => {
          if (typeof window.ayaSubmitEmail === 'function') {
            window.clearInterval(timer);
            resolve(window.ayaSubmitEmail);
            return;
          }

          if (Date.now() - startedAt > 6000) {
            window.clearInterval(timer);
            reject(new Error('Email service is not ready'));
          }
        }, 120);
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = input.value.trim();
      const submitButton = form.querySelector('button[type="submit"]');

      if (!email.includes('@')) {
        alert('Enter a valid email');
        return;
      }

      try {
        if (submitButton) submitButton.disabled = true;
        const submitEmail = await waitForSubmitter();
        await submitEmail(email);

        form.style.display = 'none';
        const note = document.querySelector('.aya-note');
        if (note) note.style.display = 'none';
        if (success) success.style.display = 'block';
      } catch (error) {
        console.error('ERROR:', error);
        alert('Something went wrong. Please try again.');
        if (submitButton) submitButton.disabled = false;
      }
    });
  });
})();
