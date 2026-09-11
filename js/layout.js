document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject the Sidebar
  const sidebarHtml = `
        <div class="sidebar-header">Dev Utilities</div>
        <nav class="sidebar-nav">
            <a href="/" class="${window.location.pathname === '/' ? 'active' : ''}">Home</a>
            <a href="/uniqid-decoder/" class="${window.location.pathname.includes('/uniqid-decoder') ? 'active' : ''}">PHP uniqid() Decoder</a>
          <a href="/csv-to-sql-in/" class="${window.location.pathname.includes('/csv-to-sql-in') ? 'active' : ''}">Excel/CSV to SQL IN</a>
            <a href="/php-serialized-to-json/" class="${window.location.pathname.includes('/php-serialized-to-json') ? 'active' : ''}">PHP Serialized to JSON</a>
            <a href="/pdo-connection-string-builder/" class="${window.location.pathname.includes('/pdo-connection-string-builder') ? 'active' : ''}">PDO Connection Builder</a>
            <a href="/env-to-docker-environment/" class="${window.location.pathname.includes('/env-to-docker-environment') ? 'active' : ''}">.env to Docker YAML</a>
        </nav>
    `;

  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHtml;
  }
});
