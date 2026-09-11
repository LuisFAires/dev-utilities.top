document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject the Sidebar
  const sidebarHtml = `
        <div class="sidebar-header">Dev Utilities</div>
        <nav class="sidebar-nav">
            <a href="/" class="${window.location.pathname === '/' ? 'active' : ''}">Home</a>
            <a href="/uniqid-decoder/" class="${window.location.pathname.includes('/uniqid-decoder') ? 'active' : ''}">PHP uniqid() Decoder</a>
        </nav>
    `;

  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHtml;
  }
});
