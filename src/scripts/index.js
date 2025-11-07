// CSS imports
import '../styles/styles.css';
import App from './pages/app';
import { registerServiceWorker } from './utils/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  handleAuthState();

  await app.renderPage();
  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

function handleAuthState() {
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  if (!loginLink || !registerLink || !logoutLink) return;

  const token = localStorage.getItem('token');

  if (token) {
    // Jika user sudah login
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'block';
  } else {
    // Jika user belum login
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';
  }

  logoutLink.onclick = () => {
    localStorage.clear();
    alert('Logout berhasil');
    window.location.hash = '/login';
    handleAuthState();
  };
}