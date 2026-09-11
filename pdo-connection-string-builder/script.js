(function () {
  function quotePhp(value) {
    return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
  }

  function buildPdoCode(values) {
    const driver = values.driver;
    let dsn;

    if (driver === 'sqlite') {
      dsn = `sqlite:${values.sqlitePath}`;
    } else if (driver === 'pgsql') {
      dsn = `pgsql:host=${values.host};port=${values.port};dbname=${values.database}`;
    } else {
      dsn = `mysql:host=${values.host};port=${values.port};dbname=${values.database};charset=${values.charset}`;
    }

    const options = '[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]';
    if (driver === 'sqlite') return `$dsn = ${quotePhp(dsn)};\n\n$pdo = new PDO($dsn, null, null, ${options});`;
    return `$dsn = ${quotePhp(dsn)};\n$username = ${quotePhp(values.username)};\n$password = ${quotePhp(values.password)};\n\n$pdo = new PDO($dsn, $username, $password, ${options});`;
  }

  function initialize() {
    const driver = document.getElementById('driver');
    const output = document.getElementById('php-output');
    const copyButton = document.getElementById('copy-output');
    const networkFields = document.querySelectorAll('.network-field');
    const credentialFields = document.querySelectorAll('.credentials-field');
    const charsetField = document.getElementById('charset-field');
    const sqlitePathField = document.getElementById('sqlite-path-field');
    const fields = ['host', 'port', 'database', 'charset', 'sqlite-path', 'username', 'password'];

    function values() {
      return {
        driver: driver.value,
        host: document.getElementById('host').value.trim(),
        port: document.getElementById('port').value.trim(),
        database: document.getElementById('database').value.trim(),
        charset: document.getElementById('charset').value.trim(),
        sqlitePath: document.getElementById('sqlite-path').value.trim(),
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      };
    }

    function updateOutput() {
      const isSqlite = driver.value === 'sqlite';
      const isMysql = driver.value === 'mysql';
      networkFields.forEach((field) => { field.hidden = isSqlite; });
      credentialFields.forEach((field) => { field.hidden = isSqlite; });
      charsetField.hidden = !isMysql;
      sqlitePathField.hidden = !isSqlite;
      output.value = buildPdoCode(values());
    }

    driver.addEventListener('change', () => {
      if (driver.value === 'mysql') document.getElementById('port').value = '3306';
      if (driver.value === 'pgsql') document.getElementById('port').value = '5432';
      updateOutput();
    });
    fields.forEach((field) => document.getElementById(field).addEventListener('input', updateOutput));
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy PHP'; }, 1500);
    });
    updateOutput();
  }

  window.pdoConnectionBuilder = { buildPdoCode };
  document.addEventListener('DOMContentLoaded', initialize);
}());