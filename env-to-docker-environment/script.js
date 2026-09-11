(function () {
  function unquoteEnvValue(value) {
    if (value.length < 2) return value;
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.at(-1) === quote) return value.slice(1, -1);
    return value;
  }

  function quoteYaml(value) {
    return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  }

  function convertEnvToYaml(source) {
    const lines = source.replace(/\r/g, '').split('\n');
    const output = ['environment:'];
    let count = 0;

    for (const sourceLine of lines) {
      const line = sourceLine.trim();
      if (!line) continue;
      if (line.startsWith('#')) {
        output.push(`  ${line}`);
        continue;
      }

      const normalizedLine = line.startsWith('export ') ? line.slice(7).trim() : line;
      const separator = normalizedLine.indexOf('=');
      if (separator <= 0) continue;
      const key = normalizedLine.slice(0, separator).trim();
      const value = unquoteEnvValue(normalizedLine.slice(separator + 1).trim());
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      output.push(`  - ${quoteYaml(`${key}=${value}`)}`);
      count += 1;
    }

    return { yaml: count ? output.join('\n') : '', count };
  }

  function initialize() {
    const input = document.getElementById('env-input');
    const output = document.getElementById('yaml-output');
    const copyButton = document.getElementById('copy-output');
    const count = document.getElementById('variable-count');

    function updateOutput() {
      const result = convertEnvToYaml(input.value);
      output.value = result.yaml;
      count.textContent = `${result.count} ${result.count === 1 ? 'variable' : 'variables'}`;
      copyButton.disabled = result.count === 0;
    }

    input.addEventListener('input', updateOutput);
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy YAML'; }, 1500);
    });
    updateOutput();
  }

  window.envToDockerConverter = { convertEnvToYaml };
  document.addEventListener('DOMContentLoaded', initialize);
}());