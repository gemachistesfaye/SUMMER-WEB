const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const digitalTime = document.getElementById('digitalTime');
const digitalDate = document.getElementById('digitalDate');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function setDate() {
    const now = new Date();

    const seconds = now.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360);
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    const minutes = now.getMinutes();
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;

    const hours = now.getHours() % 12;
    const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30);
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

    // Digital time
    const h24 = now.getHours();
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    digitalTime.textContent = `${padZero(h12)}:${padZero(minutes)}:${padZero(seconds)} ${ampm}`;

    // Digital date
    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    digitalDate.textContent = `${dayName}, ${month} ${date}, ${year}`;
}

setInterval(setDate, 1000);
setDate();
