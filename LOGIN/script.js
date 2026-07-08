document.addEventListener('DOMContentLoaded', () => {
    const animationArea = document.getElementById('animationArea');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const characterPlaceholder = document.getElementById('characterPlaceholder');
    const closeFormBtn = document.getElementById('closeFormBtn');

    // Detect which page we're on
    const isRegisterPage = window.location.pathname.includes('register');
    const formContainer = document.getElementById(isRegisterPage ? 'registerFormContainer' : 'loginFormContainer');
    const form = document.getElementById(isRegisterPage ? 'registrationForm' : 'loginForm');

    // ===== Animation Sequence =====
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        characterPlaceholder.classList.add('visible');

        setTimeout(() => {
            animationArea.style.opacity = '0';
            setTimeout(() => {
                animationArea.style.display = 'none';
                formContainer.classList.remove('hidden');
                formContainer.classList.add('visible');
            }, 500);
        }, 2500);
    }, 1200);

    // ===== Close Button =====
    closeFormBtn.addEventListener('click', () => {
        formContainer.classList.remove('visible');
        formContainer.classList.add('hidden');
    });

    // ===== Form Submission =====
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (isRegisterPage) {
            handleRegistration();
        } else {
            handleLogin();
        }
    });

    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (email && password) {
            showSuccess('Login Successful!', `Welcome back, ${email}`);
            form.reset();
        } else {
            showMessage('Please fill in all fields.', 'error');
        }
    }

    function handleRegistration() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        showSuccess('Registration Successful!', `Account created for ${name}`);
        form.reset();
    }

    function showSuccess(title, message) {
        const formBox = formContainer.querySelector('.form-box');
        formBox.innerHTML = `
            <div class="success-message show">
                <i class="fas fa-check-circle"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function showMessage(text, type) {
        // Remove existing message
        const existing = formContainer.querySelector('.message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = 'message';
        msg.style.cssText = `
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            font-size: 0.85em;
            animation: fadeInScale 0.3s ease-out;
            ${type === 'error'
                ? 'background: #fee; color: #e74c3c; border: 1px solid #fcc;'
                : 'background: #efe; color: #27ae60; border: 1px solid #cfc;'}
        `;
        msg.textContent = text;

        const formEl = formContainer.querySelector('form');
        formEl.insertBefore(msg, formEl.firstChild);

        setTimeout(() => msg.remove(), 3000);
    }
});
