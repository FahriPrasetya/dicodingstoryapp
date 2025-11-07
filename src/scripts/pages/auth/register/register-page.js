import CONFIG from "../../../config.js";
export default class RegisterPage {
    async render() {
        return `
      <section class="register-page-container">
        <h1 class="register-page-title">Register Page</h1>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </section>
    `;
    }

    async afterRender() {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${CONFIG.BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                alert('Register success! You can now login.');
                window.location.hash = '#/login';
            } catch (error) {
                alert(`Register failed: ${error.message}`);
            }
        });
    }

}