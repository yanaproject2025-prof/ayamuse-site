(function () {
  const style = document.createElement('style');
  style.textContent = `
    .aya-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #222;
      color: #fff;
      padding: 12px 22px;
      border-radius: 4px;
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      letter-spacing: 0.05em;
      opacity: 0;
      pointer-events: none;
      transition: opacity .25s ease, transform .25s ease;
      z-index: 9999;
      box-shadow: 0 6px 24px rgba(0,0,0,0.18);
      max-width: 90vw;
      text-align: center;
    }
    .aya-toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  let toast = null;
  let toastTimer = null;

  function ensureToast() {
    if (toast) return toast;
    toast = document.createElement('div');
    toast.className = 'aya-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    return toast;
  }

  function showToast(msg) {
    const el = ensureToast();
    el.textContent = msg;
    el.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove('visible');
    }, 2400);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('click', async (event) => {
    const link = event.target.closest('a[href^="mailto:"]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const email = href.replace(/^mailto:/i, '').split('?')[0].trim();
    if (!email) return;
    const copied = await copyToClipboard(email);
    if (copied) {
      showToast(`Email copied: ${email}`);
    }
  });
})();
