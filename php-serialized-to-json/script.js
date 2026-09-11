(function () {
  function parseSerialized(source) {
    const bytes = new TextEncoder().encode(source);
    const decoder = new TextDecoder();
    let position = 0;

    function readByte(expected) {
      if (bytes[position] !== expected.charCodeAt(0)) {
        throw new Error(`Expected "${expected}" at position ${position}`);
      }
      position += 1;
    }

    function readUntil(terminator) {
      const start = position;
      while (position < bytes.length && bytes[position] !== terminator.charCodeAt(0)) position += 1;
      if (position === bytes.length) throw new Error(`Expected "${terminator}" before the end of the value`);
      const value = decoder.decode(bytes.slice(start, position));
      position += 1;
      return value;
    }

    function readLength() {
      const length = Number(readUntil(':'));
      if (!Number.isInteger(length) || length < 0) throw new Error('Invalid string length');
      return length;
    }

    function readString(terminator) {
      const length = readLength();
      readByte('"');
      const value = decoder.decode(bytes.slice(position, position + length));
      if (new TextEncoder().encode(value).length !== length) throw new Error('String length exceeds the input');
      position += length;
      readByte('"');
      readByte(terminator || ';');
      return value;
    }

    function toContainer(entries) {
      const isList = entries.every(([key], index) => key === index);
      if (isList) return entries.map(([, value]) => value);
      return Object.fromEntries(entries.map(([key, value]) => [String(key), value]));
    }

    function readEntries(count) {
      const entries = [];
      for (let index = 0; index < count; index += 1) entries.push([readValue(), readValue()]);
      readByte('}');
      return entries;
    }

    function readValue() {
      const type = String.fromCharCode(bytes[position]);
      position += 1;
      switch (type) {
        case 'N':
          readByte(';');
          return null;
        case 'b': {
          readByte(':');
          const value = readUntil(';');
          if (value !== '0' && value !== '1') throw new Error('Invalid boolean value');
          return value === '1';
        }
        case 'i':
        case 'd': {
          readByte(':');
          const value = Number(readUntil(';'));
          if (!Number.isFinite(value)) throw new Error(`Invalid ${type === 'i' ? 'integer' : 'number'} value`);
          return value;
        }
        case 's':
          readByte(':');
          return readString();
        case 'a': {
          readByte(':');
          const count = readLength();
          readByte('{');
          return toContainer(readEntries(count));
        }
        case 'O': {
          readByte(':');
          readString(':');
          const count = readLength();
          readByte('{');
          return toContainer(readEntries(count));
        }
        case 'r':
        case 'R':
          throw new Error('PHP references are not supported');
        default:
          throw new Error(`Unsupported serialized type "${type || 'end of input'}"`);
      }
    }

    const result = readValue();
    if (position !== bytes.length) throw new Error(`Unexpected content at position ${position}`);
    return result;
  }

  function initialize() {
    const input = document.getElementById('serialized-input');
    const output = document.getElementById('json-output');
    const errorMessage = document.getElementById('error-message');
    const copyButton = document.getElementById('copy-output');

    function updateOutput() {
      if (!input.value.trim()) {
        output.value = '';
        errorMessage.style.display = 'none';
        copyButton.disabled = true;
        return;
      }

      try {
        output.value = JSON.stringify(parseSerialized(input.value.trim()), null, 2);
        errorMessage.style.display = 'none';
        copyButton.disabled = false;
      } catch (error) {
        output.value = '';
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        copyButton.disabled = true;
      }
    }

    input.addEventListener('input', updateOutput);
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy JSON'; }, 1500);
    });
  }

  window.phpSerializedConverter = { parseSerialized };
  document.addEventListener('DOMContentLoaded', initialize);
}());