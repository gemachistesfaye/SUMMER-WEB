document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calculator-display');
    const expression = document.getElementById('expression');
    const buttons = document.querySelector('.buttons');
    const historyToggle = document.getElementById('historyToggle');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const historyClear = document.getElementById('historyClear');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let history = [];

    function updateDisplay() {
        display.value = currentInput;
        // Auto-shrink font for long numbers
        display.style.fontSize = currentInput.length > 12 ? '1.6em' : currentInput.length > 8 ? '2em' : '2.4em';
    }

    function updateExpression(text) {
        expression.textContent = text || '';
    }

    // ===== Number Input =====
    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    // ===== Decimal =====
    function inputDecimal(dot) {
        if (waitingForSecondOperand) {
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

    // ===== Clear =====
    function clearCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateExpression('');
        document.querySelectorAll('.operator').forEach(b => b.classList.remove('active-op'));
        updateDisplay();
    }

    // ===== Backspace =====
    function backspace() {
        if (currentInput === 'Error') {
            clearCalculator();
            return;
        }
        if (waitingForSecondOperand) return;
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '-' || currentInput === '-0') currentInput = '0';
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    // ===== Negate =====
    function negate() {
        if (currentInput === '0') return;
        currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
        updateDisplay();
    }

    // ===== Percent =====
    function percent() {
        const value = parseFloat(currentInput);
        currentInput = String(value / 100);
        updateDisplay();
    }

    // ===== Calculate =====
    function calculate(first, second, op) {
        switch (op) {
            case 'add': return first + second;
            case 'subtract': return first - second;
            case 'multiply': return first * second;
            case 'divide':
                if (second === 0) {
                    currentInput = 'Error';
                    updateDisplay();
                    return null;
                }
                return first / second;
        }
        return second;
    }

    // ===== Operator =====
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        document.querySelectorAll('.operator').forEach(b => b.classList.remove('active-op'));
        document.querySelector(`[data-action="${nextOperator}"]`)?.classList.add('active-op');

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            updateExpression(`${firstOperand} ${getOpSymbol(nextOperator)}`);
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            if (result === null) return;
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateExpression(`${firstOperand} ${getOpSymbol(nextOperator)}`);
        updateDisplay();
    }

    function getOpSymbol(op) {
        const symbols = { add: '+', subtract: '\u2212', multiply: '\u00D7', divide: '\u00F7' };
        return symbols[op] || op;
    }

    // ===== Equals =====
    function performCalculation() {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) return;

        if (firstOperand !== null && operator) {
            const result = calculate(firstOperand, inputValue, operator);
            if (result === null) return;

            const fullExpr = `${firstOperand} ${getOpSymbol(operator)} ${inputValue} =`;
            updateExpression(fullExpr);

            addToHistory(fullExpr, result);

            currentInput = String(result);
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = true;
            document.querySelectorAll('.operator').forEach(b => b.classList.remove('active-op'));
            updateDisplay();
        }
    }

    // ===== History =====
    function addToHistory(expr, result) {
        history.unshift({ expr, result });
        if (history.length > 20) history.pop();
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }

        historyList.innerHTML = history.map((item, i) => `
            <div class="history-item" data-index="${i}">
                <div class="hist-expr">${item.expr}</div>
                <div class="hist-result">${item.result}</div>
            </div>
        `).join('');
    }

    historyToggle.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
        historyToggle.classList.toggle('active');
    });

    historyClear.addEventListener('click', () => {
        history = [];
        renderHistory();
    });

    historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) return;
        const idx = parseInt(item.dataset.index);
        currentInput = String(history[idx].result);
        updateDisplay();
        historyPanel.classList.add('hidden');
        historyToggle.classList.remove('active');
    });

    // ===== Button Clicks =====
    buttons.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        if (target.classList.contains('number')) {
            inputDigit(target.textContent);
        } else if (target.classList.contains('operator')) {
            handleOperator(target.dataset.action);
        } else if (target.classList.contains('decimal')) {
            inputDecimal(target.textContent);
        } else if (target.classList.contains('clear')) {
            clearCalculator();
        } else if (target.classList.contains('backspace')) {
            backspace();
        } else if (target.classList.contains('equal')) {
            performCalculation();
        } else if (target.classList.contains('negate')) {
            negate();
        } else if (target.classList.contains('percent')) {
            percent();
        }
    });

    // ===== Keyboard Support =====
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            inputDigit(e.key);
        } else if (e.key === '.') {
            inputDecimal(e.key);
        } else if (e.key === '+') {
            handleOperator('add');
        } else if (e.key === '-') {
            handleOperator('subtract');
        } else if (e.key === '*') {
            handleOperator('multiply');
        } else if (e.key === '/') {
            e.preventDefault();
            handleOperator('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            performCalculation();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            clearCalculator();
        } else if (e.key === '%') {
            percent();
        } else if (e.key === 'Backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }
    });

    updateDisplay();
});
