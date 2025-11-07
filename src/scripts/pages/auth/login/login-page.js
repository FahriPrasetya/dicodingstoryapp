import CONFIG from "../../../config.js";
export default class LoginPage {
  async render() {
    return `
      <section class="login-page-container">
        <h1 class="login-page-title">Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter Your Email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter Your Password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const registerLink = document.getElementById('register-link');
      const loginLink = document.getElementById('login-link');
      const logoutLink = document.getElementById('logout-link');

      try {
        const response = await fetch(`${CONFIG.BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        localStorage.setItem('token', result.loginResult.token);
        localStorage.setItem('userId', result.loginResult.userId);
        localStorage.setItem('name', result.loginResult.name);

        alert('Login Success');

        setTimeout(() => {
          window.location.hash = '/';
          registerLink.style.display = 'none';
          loginLink.style.display = 'none';
          logoutLink.style.display = 'block';
        }, 1500);

      } catch (error) {
        alert(error.message)
      }
    });
  }

}