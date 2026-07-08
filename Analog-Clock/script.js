const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const digitalTime = document.getElementById('digitalTime');
const digitalDate = document.getElementById('digitalDate');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function padZero(num) {
    return num.toString().padStart(2, '0');
}

// ===== Generate Clock Elements =====
function generateTicks() {
    const minuteTicks = document.getElementById('minuteTicks');
    const hourTicks = document.getElementById('hourTicks');
    const numbers = document.getElementById('numbers');

    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = 'minute-tick';
        tick.style.setProperty('--i', i);
        minuteTicks.appendChild(tick);
    }

    for (let i = 0; i < 12; i++) {
        const tick = document.createElement('div');
        tick.className = 'hour-tick';
        tick.style.setProperty('--i', i);
        hourTicks.appendChild(tick);

        const num = document.createElement('div');
        num.className = 'number';
        num.style.setProperty('--i', i);
        num.innerHTML = `<span>${i === 0 ? 12 : i}</span>`;
        numbers.appendChild(num);
    }
}

// ===== Clock Update =====
function updateClock() {
    const now = new Date();

    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    secondHand.style.transform = `rotate(${(seconds / 60) * 360}deg)`;
    minuteHand.style.transform = `rotate(${(minutes / 60) * 360}deg)`;
    hourHand.style.transform = `rotate(${(hours / 12) * 360}deg)`;

    const h24 = now.getHours();
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    digitalTime.textContent = `${padZero(h12)}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())} ${ampm}`;

    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    digitalDate.textContent = `${dayName}, ${month} ${now.getDate()}, ${now.getFullYear()}`;
}

// ===== World Clock =====
const worldCities = [
    { name: 'New York', tz: 'America/New_York', flag: '\u{1F1FA}\u{1F1F8}' },
    { name: 'London', tz: 'Europe/London', flag: '\u{1F1EC}\u{1F1E7}' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', flag: '\u{1F1EF}\u{1F1F5}' },
    { name: 'Dubai', tz: 'Asia/Dubai', flag: '\u{1F1E6}\u{1F1EA}' },
    { name: 'Sydney', tz: 'Australia/Sydney', flag: '\u{1F1E6}\u{1F1FA}' },
    { name: 'Addis Ababa', tz: 'Africa/Addis_Ababa', flag: '\u{1F1EA}\u{1F1F9}' },
];

function initWorldClocks() {
    const container = document.getElementById('worldClocks');
    worldCities.forEach(city => {
        const div = document.createElement('div');
        div.className = 'world-city';
        div.innerHTML = `
            <div class="city-flag">${city.flag}</div>
            <div class="city-name">${city.name}</div>
            <div class="city-time" data-tz="${city.tz}">--:--</div>
        `;
        container.appendChild(div);
    });
}

function updateWorldClocks() {
    document.querySelectorAll('.city-time').forEach(el => {
        const tz = el.dataset.tz;
        const time = new Date().toLocaleTimeString('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        el.textContent = time;
    });
}

// ===== Stopwatch =====
let swInterval = null;
let swStartTime = 0;
let swElapsed = 0;
let swRunning = false;
let lapCount = 0;
let lastLapTime = 0;

const swDisplay = document.getElementById('stopwatchDisplay');
const swStart = document.getElementById('swStart');
const swLap = document.getElementById('swLap');
const swReset = document.getElementById('swReset');
const lapsContainer = document.getElementById('laps');

function formatStopwatch(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${padZero(minutes)}:${padZero(seconds)}.${padZero(millis).padStart(3, '0')}`;
}

function updateStopwatch() {
    const now = performance.now();
    const total = swElapsed + (now - swStartTime);
    swDisplay.textContent = formatStopwatch(total);
}

swStart.addEventListener('click', () => {
    if (!swRunning) {
        swStartTime = performance.now();
        swRunning = true;
        swInterval = setInterval(updateStopwatch, 10);
        swStart.innerHTML = '<i class="fas fa-pause"></i>';
        swStart.style.background = 'linear-gradient(135deg, #e67e22, #f39c12)';
        swLap.disabled = false;
        swReset.disabled = false;
    } else {
        swElapsed += performance.now() - swStartTime;
        swRunning = false;
        clearInterval(swInterval);
        swStart.innerHTML = '<i class="fas fa-play"></i>';
        swStart.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    }
});

swLap.addEventListener('click', () => {
    if (!swRunning) return;
    lapCount++;
    const current = swElapsed + (performance.now() - swStartTime);
    const lapTime = current - lastLapTime;
    lastLapTime = current;

    const lap = document.createElement('div');
    lap.className = 'lap-item';
    lap.innerHTML = `<span class="lap-num">Lap ${lapCount}</span><span class="lap-time">${formatStopwatch(lapTime)}</span>`;
    lapsContainer.prepend(lap);
});

swReset.addEventListener('click', () => {
    swRunning = false;
    clearInterval(swInterval);
    swElapsed = 0;
    swStartTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    swDisplay.textContent = '00:00:00.000';
    swStart.innerHTML = '<i class="fas fa-play"></i>';
    swStart.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    swLap.disabled = true;
    swReset.disabled = true;
    lapsContainer.innerHTML = '';
});

// ===== Tabs =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.getElementById('worldPanel').classList.toggle('hidden', tab.dataset.tab !== 'world');
        document.getElementById('stopwatchPanel').classList.toggle('hidden', tab.dataset.tab !== 'stopwatch');
    });
});

// ===== Init =====
generateTicks();
initWorldClocks();

function mainLoop() {
    updateClock();
    updateWorldClocks();
    requestAnimationFrame(mainLoop);
}

mainLoop();
