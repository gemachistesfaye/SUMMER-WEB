document.addEventListener('DOMContentLoaded', () => {
    // ===== Detect Page =====
    const isRegisterPage = window.location.pathname.includes('register');
    const formContainer = document.getElementById(isRegisterPage ? 'registerFormContainer' : 'loginFormContainer');
    const form = document.getElementById(isRegisterPage ? 'registrationForm' : 'loginForm');
    const animationArea = document.getElementById('animationArea');
    const character = document.getElementById('character');
    const closeFormBtn = document.getElementById('closeFormBtn');

    // ===== Create Particles =====
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (6 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        particlesContainer.appendChild(p);
    }

    // ===== Eye Tracking =====
    const leftPupil = document.getElementById('leftPupil');
    const rightPupil = document.getElementById('rightPupil');
    const mouth = document.getElementById('mouth');

    document.addEventListener('mousemove', (e) => {
        if (!character) return;
        const rect = character.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 3;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxMove = 4;
        const moveX = (dx / Math.max(dist, 1)) * maxMove;
        const moveY = (dy / Math.max(dist, 1)) * maxMove;

        if (leftPupil) leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if (rightPupil) rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // Mouth reacts to mouse
        if (mouth) {
            if (e.clientY < cy - 60) {
                mouth.className = 'mouth surprised';
            } else if (e.clientY > cy + 40) {
                mouth.className = 'mouth';
            } else {
                mouth.className = 'mouth happy';
            }
        }
    });

    // ===== Animation Sequence =====
    setTimeout(() => {
        if (character) character.classList.add('visible');

        setTimeout(() => {
            animationArea.style.opacity = '0';
            setTimeout(() => {
                animationArea.style.display = 'none';
                formContainer.classList.remove('hidden');
                formContainer.classList.add('visible');
            }, 600);
        }, 2200);
    }, 800);

    // ===== Close Button =====
    closeFormBtn.addEventListener('click', () => {
        formContainer.classList.remove('visible');
        formContainer.classList.add('hidden');
        animationArea.style.display = 'flex';
        animationArea.style.opacity = '1';
        if (character) character.classList.remove('visible');
        setTimeout(() => {
            if (character) character.classList.add('visible');
        }, 100);
    });

    // ===== Toggle Password Visibility =====
    function setupToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (!toggle || !input) return;
        toggle.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            toggle.innerHTML = isPass
                ? '<i class="fas fa-eye-slash"></i>'
                : '<i class="fas fa-eye"></i>';
        });
    }

    setupToggle('toggleLoginPass', 'loginPassword');
    setupToggle('toggleRegPass', 'regPassword');
    setupToggle('toggleConfirmPass', 'regConfirmPassword');

    // ===== Password Strength (Register) =====
    const regPassword = document.getElementById('regPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.getElementById('passwordStrength');

    if (regPassword) {
        regPassword.addEventListener('input', () => {
            const val = regPassword.value;
            if (val.length === 0) {
                passwordStrength.classList.remove('visible');
                return;
            }
            passwordStrength.classList.add('visible');

            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            const levels = [
                { width: '20%', color: '#e74c3c', text: 'Very weak' },
                { width: '40%', color: '#e67e22', text: 'Weak' },
                { width: '60%', color: '#f1c40f', text: 'Fair' },
                { width: '80%', color: '#2ecc71', text: 'Strong' },
                { width: '100%', color: '#27ae60', text: 'Very strong' }
            ];
            const lvl = levels[Math.min(score, levels.length) - 1] || levels[0];
            strengthFill.style.width = lvl.width;
            strengthFill.style.background = lvl.color;
            strengthText.textContent = lvl.text;
            strengthText.style.color = lvl.color;
        });
    }

    // ===== Ripple Effect =====
    document.querySelectorAll('.submit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.opacity = '0.5';
                void ripple.offsetWidth;
                ripple.style.width = '300px';
                ripple.style.height = '300px';
                ripple.style.opacity = '0';
            }
        });
    });

    // ===== Form Submission =====
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isRegisterPage) {
            handleRegistration();
        } else {
            handleLogin();
        }
    });

    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = document.getElementById('loginBtn');

        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 400);
            return;
        }

        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showSuccess('Login Successful!', `Welcome back, ${email.split('@')[0]}`);
        }, 1500);
    }

    function handleRegistration() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        const btn = document.getElementById('registerBtn');

        if (!name || !email || !password || !confirm) {
            showMessage('Please fill in all fields.', 'error');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 400);
            return;
        }

        if (password !== confirm) {
            showMessage('Passwords do not match!', 'error');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 400);
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 400);
            return;
        }

        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showSuccess('Registration Successful!', `Account created for ${name}`);
        }, 1500);
    }

    function showSuccess(title, message) {
        const formBox = formContainer.querySelector('.form-box');
        formBox.innerHTML = `
            <div class="success-message">
                <div class="success-icon"><i class="fas fa-check"></i></div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function showMessage(text, type) {
        const existing = formContainer.querySelector('.message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${text}`;

        const formEl = formContainer.querySelector('form');
        formEl.insertBefore(msg, formEl.firstChild);

        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            msg.style.transition = 'all 0.3s';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }

    // ===== Social Button Hover Effects =====
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});
