// ===== Elements =====
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const greetButton = document.getElementById('greetButton');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const emojiBig = document.getElementById('emojiBig');
const formGroup = document.getElementById('formGroup');
const ageGroup = document.getElementById('ageGroup');
const actions = document.getElementById('actions');
const blowBtn = document.getElementById('blowBtn');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');
const cake = document.getElementById('cake');
const flame = document.getElementById('flame');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
const themes = document.getElementById('themes');

let confettiParticles = [];
let confettiAnim = null;
let balloons = [];

// ===== Confetti =====
function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createConfetti() {
    const colors = ['#e91e63', '#9c27b0', '#2196f3', '#ff9800', '#4caf50', '#ffeb3b', '#ff5722'];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 20);
    if (confettiParticles.length > 0) {
        confettiAnim = requestAnimationFrame(animateConfetti);
    }
}

function launchConfetti() {
    confettiParticles = [];
    createConfetti();
    animateConfetti();
}

// ===== Balloons =====
function launchBalloons() {
    const container = document.getElementById('balloons');
    const emojis = ['🎈', '🎀', '🎁', '🎉', '🎊'];
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            balloon.style.left = Math.random() * 100 + '%';
            balloon.style.animationDuration = (Math.random() * 4 + 5) + 's';
            balloon.style.fontSize = (Math.random() * 2 + 2) + 'em';
            container.appendChild(balloon);
            setTimeout(() => balloon.remove(), 10000);
        }, i * 300);
    }
}

// ===== Greeting =====
function makeGreeting() {
    const name = nameInput.value.trim();
    const age = ageInput.value;

    if (!name) {
        nameInput.style.borderColor = '#e74c3c';
        nameInput.focus();
        setTimeout(() => nameInput.style.borderColor = '#e0e0e0', 2000);
        return;
    }

    // Hide form, show results
    formGroup.style.display = 'none';
    ageGroup.style.display = 'none';
    greetButton.style.display = 'none';
    actions.classList.remove('hidden');

    // Update greeting
    const ageText = age ? `, you're turning ${age}!` : '!';
    title.textContent = `Happy Birthday${ageText}`;
    title.classList.add('animate');

    subtitle.textContent = age
        ? `${age} years of being amazing! Make a wish! 🌟`
        : 'Make a wish and blow out the candles! 🌟';
    subtitle.classList.add('animate');

    // Show age emoji
    if (age) {
        const ageNum = parseInt(age);
        if (ageNum <= 5) emojiBig.textContent = '👶';
        else if (ageNum <= 12) emojiBig.textContent = '🎂';
        else if (ageNum <= 18) emojiBig.textContent = '🎉';
        else if (ageNum <= 30) emojiBig.textContent = '🥳';
        else if (ageNum <= 50) emojiBig.textContent = '🎂';
        else emojiBig.textContent = '🌟';
    } else {
        emojiBig.textContent = '🎂';
    }

    // Launch effects
    launchConfetti();
    launchBalloons();
}

// ===== Blow Candles =====
function blowCandles() {
    cake.classList.add('blow-out');
    subtitle.textContent = 'You blew out the candles! Your wish will come true! ✨';

    // Small confetti burst
    for (let i = 0; i < 50; i++) {
        confettiParticles.push({
            x: confettiCanvas.width / 2,
            y: confettiCanvas.height / 2 - 100,
            w: Math.random() * 8 + 4,
            h: Math.random() * 4 + 2,
            color: ['#ffeb3b', '#ff9800', '#f44336'][Math.floor(Math.random() * 3)],
            speed: Math.random() * 5 + 3,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.3,
            drift: (Math.random() - 0.5) * 6
        });
    }
    animateConfetti();
}

// ===== Share =====
function shareCard() {
    const name = nameInput.value.trim() || 'Friend';
    const text = `🎂 Happy Birthday ${name}! 🎉\nWishing you an amazing day filled with joy and love! 🎁🎈`;

    if (navigator.share) {
        navigator.share({ title: 'Happy Birthday!', text: text });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        subtitle.textContent = 'Birthday message copied! Share it! 📋';
    }
}

// ===== Reset =====
function resetCard() {
    formGroup.style.display = '';
    ageGroup.style.display = '';
    greetButton.style.display = '';
    actions.classList.add('hidden');
    nameInput.value = '';
    ageInput.value = '';
    title.textContent = 'Happy Birthday!';
    title.classList.remove('animate');
    subtitle.textContent = 'Make a wish and blow out the candles!';
    subtitle.classList.remove('animate');
    emojiBig.textContent = '';
    cake.classList.remove('blow-out');
    flame.style.display = '';
}

// ===== Themes =====
themes.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.className = btn.dataset.theme !== 'pink' ? `theme-${btn.dataset.theme}` : '';
});

// ===== Event Listeners =====
greetButton.addEventListener('click', makeGreeting);
nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeGreeting(); });
ageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeGreeting(); });
blowBtn.addEventListener('click', blowCandles);
shareBtn.addEventListener('click', shareCard);
resetBtn.addEventListener('click', resetCard);

// ===== Init =====
setTimeout(() => {
    title.classList.add('animate');
    subtitle.classList.add('animate');
}, 300);
