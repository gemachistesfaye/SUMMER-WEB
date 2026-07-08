const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const scoreBoardDiv = document.querySelector('.score-board');
const resultP = document.querySelector('.resultp');
const rockDiv = document.getElementById('r');
const paperDiv = document.getElementById('p');
const scissorsDiv = document.getElementById('s');

let userScore = 0;
let computerScore = 0;

function getComputerChoice(){
    const choices = ['r', 'p' ,'s'];
    const randomNumber = Math.floor(Math.random() * 3);
    
    return choices[randomNumber];
}

function convertToWord(letter){
    if (letter === 'r') return 'Rock';
    if (letter === 'p') return 'Paper';
    if (letter === 's') return 'Scissors';
}

function win(userChoice,computerChoice) {
    userScore++
    userScoreSpan.textContent = userScore;
    resultP.innerHTML =`${convertToWord(userChoice)} beats ${convertToWord(computerChoice)}. You win!!! 🎉`;

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('green-glow');
    setTimeout(() => userChoiceDiv.classList.remove('green-glow'), 600);
}

function lose(userChoice, computerChoice) {
    computerScore++
    computerScoreSpan.textContent = computerScore;
    resultP.innerHTML =`${convertToWord(computerChoice)} beats ${convertToWord(userChoice)}. You lose!!! 😭`;

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('red-glow');
    setTimeout(() => userChoiceDiv.classList.remove('red-glow'), 600);
}

function draw(userChoice, computerChoice) {
    resultP.innerHTML =`${convertToWord(userChoice)} equals ${convertToWord(computerChoice)}. It's Draw!!! 🤝`;

    const userChoiceDiv = document.getElementById(userChoice);
    userChoiceDiv.classList.add('gray-glow');
    setTimeout(() => userChoiceDiv.classList.remove('gray-glow'), 600);
}

function game(userChoice) {
    const computerChoice = getComputerChoice();
    switch (userChoice + computerChoice) {
        case 'rs':
        case 'pr':
        case 'sp':
        win(userChoice, computerChoice);  break;
        case 'rp':
        case 'ps':
        case 'sr':
        lose(userChoice, computerChoice);  break;
        case 'rr':
        case 'pp':
        case 'ss':
        draw(userChoice, computerChoice);  break;
    }

}

rockDiv.addEventListener('click', () => game('r'));
paperDiv.addEventListener('click', () => game('p'));
scissorsDiv.addEventListener('click', () => game('s'));