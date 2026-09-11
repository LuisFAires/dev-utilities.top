(function () {
  function parseCsvRow(row) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let index = 0; index < row.length; index += 1) {
      const character = row[index];
      if (character === '"') {
        if (inQuotes && row[index + 1] === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (character === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += character;
      }
    }

    values.push(currentValue);
    return values;
  }

  function extractValues(source) {
    const rows = source.replace(/\r/g, '').split('\n').filter((row) => row.trim());
    if (rows.length === 1 && !rows[0].includes('\t')) {
      return parseCsvRow(rows[0]).map((value) => value.trim()).filter(Boolean);
    }

    return rows.map((row) => {
      const firstCell = row.includes('\t') ? row.split('\t')[0] : parseCsvRow(row)[0];
      return firstCell.trim();
    }).filter(Boolean);
  }

  function formatSql(values, quoteStyle) {
    const quote = quoteStyle === 'single' ? "'" : quoteStyle === 'double' ? '"' : '';
    const formattedValues = values.map((value) => {
      if (!quote) return value;
      return `${quote}${value.replaceAll(quote, quote + quote)}${quote}`;
    });
    return `IN (${formattedValues.join(', ')})`;
  }

  function initialize() {
    const input = document.getElementById('values-input');
    const quoteStyle = document.getElementById('quote-style');
    const output = document.getElementById('sql-output');
    const copyButton = document.getElementById('copy-output');
    const valueCount = document.getElementById('value-count');

    function updateOutput() {
      const values = extractValues(input.value);
      output.value = values.length ? formatSql(values, quoteStyle.value) : '';
      valueCount.textContent = `${values.length} ${values.length === 1 ? 'value' : 'values'}`;
      copyButton.disabled = values.length === 0;
    }

    input.addEventListener('input', updateOutput);
    quoteStyle.addEventListener('change', updateOutput);
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy SQL'; }, 1500);
    });

    updateOutput();
  }

  window.sqlInGenerator = { extractValues, formatSql };
  document.addEventListener('DOMContentLoaded', initialize);
}());