// ===== DOM Elements =====
const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const resultText = document.getElementById('resultText');
const resultIcon = document.getElementById('resultIcon');
const vsDisplay = document.getElementById('vsDisplay');
const vsUser = document.getElementById('vsUser');
const vsComp = document.getElementById('vsComp');
const streakEl = document.getElementById('streak');
const streakText = document.getElementById('streakText');
const actionMessage = document.getElementById('action-message');
const resetBtn = document.getElementById('resetBtn');

// ===== Game State =====
let userScore = 0;
let computerScore = 0;
let wins = 0;
let losses = 0;
let draws = 0;
let streak = 0;
let bestStreak = 0;
let mode = 'classic';
let maxRounds = Infinity;
let round = 0;
let gameOver = false;

// ===== Emojis =====
const choiceEmoji = { r: '🪨', p: '📄', s: '✂️' };

// ===== Mode Selector =====
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.mode;
        maxRounds = mode === 'best5' ? 5 : mode === 'best10' ? 10 : Infinity;
        resetGame();
    });
});

// ===== Get Computer Choice =====
function getComputerChoice() {
    const choices = ['r', 'p', 's'];
    return choices[Math.floor(Math.random() * 3)];
}

// ===== Convert to Word =====
function convertToWord(letter) {
    if (letter === 'r') return 'Rock';
    if (letter === 'p') return 'Paper';
    if (letter === 's') return 'Scissors';
}

// ===== Update Stats =====
function updateStats() {
    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('draws').textContent = draws;
    const total = wins + losses + draws;
    const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
    document.getElementById('winRate').textContent = rate + '%';
}

// ===== Update Streak =====
function updateStreak(isWin) {
    if (isWin) {
        streak++;
        if (streak > bestStreak) bestStreak = streak;
    } else {
        streak = 0;
    }

    if (streak >= 3) {
        streakEl.classList.remove('hidden');
        streakText.textContent = `${streak} win streak! Best: ${bestStreak}`;
    } else {
        streakEl.classList.add('hidden');
    }
}

// ===== Show VS =====
function showVS(userChoice, compChoice) {
    vsDisplay.classList.remove('hidden');
    vsUser.textContent = choiceEmoji[userChoice];
    vsComp.textContent = choiceEmoji[compChoice];
    // Re-trigger animation
    vsUser.style.animation = 'none';
    vsComp.style.animation = 'none';
    void vsUser.offsetWidth;
    vsUser.style.animation = '';
    vsComp.style.animation = '';
}

// ===== Win =====
function win(userChoice, computerChoice) {
    userScore++;
    userScoreSpan.textContent = userScore;
    wins++;
    updateStats();
    updateStreak(true);

    resultIcon.textContent = '🎉';
    resultText.textContent = `${convertToWord(userChoice)} beats ${convertToWord(computerChoice)}. You win!`;
    resultText.className = 'result-text win';

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('green-glow');
    setTimeout(() => userChoiceDiv.classList.remove('green-glow'), 800);

    showVS(userChoice, computerChoice);
    actionMessage.textContent = 'Nice one!';
}

// ===== Lose =====
function lose(userChoice, computerChoice) {
    computerScore++;
    computerScoreSpan.textContent = computerScore;
    losses++;
    updateStats();
    updateStreak(false);

    resultIcon.textContent = '😢';
    resultText.textContent = `${convertToWord(computerChoice)} beats ${convertToWord(userChoice)}. You lose!`;
    resultText.className = 'result-text lose';

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('red-glow');
    setTimeout(() => userChoiceDiv.classList.remove('red-glow'), 800);

    showVS(userChoice, computerChoice);
    actionMessage.textContent = 'Try again!';
}

// ===== Draw =====
function draw(userChoice, computerChoice) {
    draws++;
    updateStats();

    resultIcon.textContent = '🤝';
    resultText.textContent = `Both chose ${convertToWord(userChoice)}. It's a draw!`;
    resultText.className = 'result-text draw';

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('gray-glow');
    setTimeout(() => userChoiceDiv.classList.remove('gray-glow'), 800);

    showVS(userChoice, computerChoice);
    actionMessage.textContent = 'So close!';
}

// ===== Check Game Over =====
function checkGameOver() {
    if (mode === 'classic') return false;
    round++;

    if (round >= maxRounds) {
        gameOver = true;
        setTimeout(() => showGameOver(), 500);
        return true;
    }

    actionMessage.textContent = `Round ${round + 1} of ${maxRounds}`;
    return false;
}

// ===== Show Game Over =====
function showGameOver() {
    const winner = userScore > computerScore ? 'You Win!' : computerScore > userScore ? 'CPU Wins!' : "It's a Tie!";
    const emoji = userScore > computerScore ? '🏆' : computerScore > userScore ? '😞' : '🤝';
    const color = userScore > computerScore ? '#4caf50' : computerScore > userScore ? '#f44336' : '#ff9800';

    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = `
        <div class="game-over-box">
            <h2 style="color:${color}">${emoji} ${winner}</h2>
            <div class="final-score">${userScore} - ${computerScore}</div>
            <p>Win Rate: ${Math.round((wins / (wins + losses + draws)) * 100)}%</p>
            <p>Best Streak: ${bestStreak}</p>
            <button onclick="this.closest('.game-over').remove(); resetGame();">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ===== Game =====
function game(userChoice) {
    if (gameOver) return;

    const computerChoice = getComputerChoice();

    switch (userChoice + computerChoice) {
        case 'rs': case 'pr': case 'sp':
            win(userChoice, computerChoice);
            break;
        case 'rp': case 'ps': case 'sr':
            lose(userChoice, computerChoice);
            break;
        case 'rr': case 'pp': case 'ss':
            draw(userChoice, computerChoice);
            break;
    }

    checkGameOver();
}

// ===== Reset Game =====
function resetGame() {
    userScore = 0;
    computerScore = 0;
    wins = 0;
    losses = 0;
    draws = 0;
    streak = 0;
    round = 0;
    gameOver = false;
    userScoreSpan.textContent = '0';
    computerScoreSpan.textContent = '0';
    resultIcon.textContent = '⚔️';
    resultText.textContent = 'Make your move!';
    resultText.className = 'result-text';
    vsDisplay.classList.add('hidden');
    streakEl.classList.add('hidden');
    actionMessage.textContent = mode === 'classic' ? 'Choose your weapon!' : `Round 1 of ${maxRounds}`;
    updateStats();
}

// ===== Event Listeners =====
document.getElementById('r').addEventListener('click', () => game('r'));
document.getElementById('p').addEventListener('click', () => game('p'));
document.getElementById('s').addEventListener('click', () => game('s'));
resetBtn.addEventListener('click', resetGame);

// ===== Keyboard Support =====
document.addEventListener('keydown', (e) => {
    if (e.key === '1' || e.key === 'r') game('r');
    if (e.key === '2' || e.key === 'p') game('p');
    if (e.key === '3' || e.key === 's') game('s');
});

// ===== Init =====
updateStats();
