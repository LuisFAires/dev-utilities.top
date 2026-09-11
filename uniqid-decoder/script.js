document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('uniqid-input');
  const resTimestamp = document.getElementById('res-timestamp');
  const resUtc = document.getElementById('res-utc');
  const resLocal = document.getElementById('res-local');
  const errorMsg = document.getElementById('error-message');

  // Listen for real-time input
  input.addEventListener('input', (e) => {
    const val = e.target.value.trim();

    if (!val) {
      resetUI();
      return;
    }

    // Clean the ID (removes prefixes if separated by hyphen)
    let cleanId = val.replace(/^.*-/, '');

    // A valid standard uniqid has at least 13 chars. 
    // If it's more (true parameter), it has 23 chars and a dot.
    // We only care about the first 8 hex characters.
    if (cleanId.length < 8) {
      showError();
      return;
    }

    // Extract first 8 chars and parse as Hex
    const hexPart = cleanId.substring(0, 8);
    const timestamp = parseInt(hexPart, 16);

    // Validation
    if (isNaN(timestamp) || timestamp < 0) {
      showError();
      return;
    }

    // JS Date uses milliseconds, so multiply by 1000
    const date = new Date(timestamp * 1000);

    // Update UI successfully
    errorMsg.style.display = 'none';
    resTimestamp.textContent = timestamp;
    resUtc.textContent = date.toISOString().replace('.000Z', 'Z');
    resLocal.textContent = date.toLocaleString(undefined, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  });

  function resetUI() {
    errorMsg.style.display = 'none';
    resTimestamp.textContent = '-';
    resUtc.textContent = '-';
    resLocal.textContent = '-';
  }

  function showError() {
    errorMsg.style.display = 'block';
    resTimestamp.textContent = '-';
    resUtc.textContent = '-';
    resLocal.textContent = '-';
  }
});
