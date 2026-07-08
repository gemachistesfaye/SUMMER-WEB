document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calculator-display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    // Update the display
    function updateDisplay() {
        display.value = currentInput;
    }

    // Handle number button clicks
    function inputDigit(digit) {
        if (waitingForSecondOperand === true) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    // Handle decimal point
    function inputDecimal(dot) {
        if (waitingForSecondOperand === true) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    // Handle clear button
    function clearCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    // Perform calculation
    function performCalculation() {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            // This handles cases like 5 + = (should repeat the last operation)
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            currentInput = String(result);
            firstOperand = result; // Set result as the new first operand for chaining operations
        }
        waitingForSecondOperand = true;
        updateDisplay();
    }

    function calculate(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') {
            if (second === 0) {
                alert("Cannot divide by zero!");
                clearCalculator();
                return 0;
            }
            return first / second;
        }
        return second; // Should not happen with valid operators
    }

    // Handle operator button clicks
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) { // Ensure input value is a number
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    // Event Listener for all button clicks
    buttons.addEventListener('click', (event) => {
        const target = event.target;

        if (!target.matches('button')) {
            return; // Exit if the clicked element is not a button
        }

        if (target.classList.contains('number')) {
            inputDigit(target.textContent);
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.dataset.action); // Use data-action for operator type
            return;
        }

        if (target.classList.contains('decimal')) {
            inputDecimal(target.textContent);
            return;
        }

        if (target.classList.contains('clear')) {
            clearCalculator();
            return;
        }

        if (target.classList.contains('equal')) {
            performCalculation();
            return;
        }
    });

    // Initialize display with 0
    updateDisplay();
});