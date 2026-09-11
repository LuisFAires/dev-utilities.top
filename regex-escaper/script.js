(function () {
  function escapeRegexLiteral(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function initialize() {
    const input = document.getElementById('literal-input');
    const output = document.getElementById('regex-output');
    const copyButton = document.getElementById('copy-output');

    function updateOutput() {
      output.value = input.value ? escapeRegexLiteral(input.value) : '';
      copyButton.disabled = !input.value;
    }

    input.addEventListener('input', updateOutput);
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy Regex'; }, 1500);
    });
    updateOutput();
  }

  window.regexEscaper = { escapeRegexLiteral };
  document.addEventListener('DOMContentLoaded', initialize);
}());