// Calculator functionality
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForOperand = false;

// Update display
function updateDisplay() {
    if (previousInput && operator && !waitingForOperand) {
        display.textContent = `${previousInput} ${operator} ${currentInput}`;
    } else if (previousInput && operator && waitingForOperand) {
        display.textContent = `${previousInput} ${operator}`;
    } else {
        display.textContent = currentInput;
    }
}

// Clear all
function clear() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    updateDisplay();
}

// Clear current entry
function clearEntry() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Input digit
function inputDigit(digit) {
    if (waitingForOperand) {
        currentInput = digit;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

// Input decimal
function inputDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Perform calculation
function calculate(firstOperand, secondOperand, operator) {
    const first = parseFloat(firstOperand);
    const second = parseFloat(secondOperand);

    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case 'X':
        case '*':
            return first * second;
        case '/':
            return second !== 0 ? first / second : 'Error';
        case '%':
            return first % second;
        default:
            return second;
    }
}

// Perform operation
function performCalculation() {
    const result = calculate(previousInput, currentInput, operator);
    
    if (result === 'Error') {
        currentInput = 'Error';
    } else {
        currentInput = String(result);
    }
    
    previousInput = '';
    operator = '';
    waitingForOperand = true;
    updateDisplay();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === '') {
        previousInput = currentInput;
    } else if (operator) {
        const result = calculate(previousInput, currentInput, operator);
        
        if (result === 'Error') {
            currentInput = 'Error';
            updateDisplay();
            return;
        }
        
        currentInput = String(result);
        previousInput = currentInput;
        updateDisplay();
    }

    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay(); // Add this line to show the operator immediately
}

// Handle percentage
function inputPercentage() {
    const value = parseFloat(currentInput);
    currentInput = String(value / 100);
    updateDisplay();
}

// Handle button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;

        // Handle different button types
        switch (buttonText) {
            case 'AC':
                clear();
                break;
            case 'C':
                clearEntry();
                break;
            case '=':
                if (operator && previousInput !== '' && !waitingForOperand) {
                    performCalculation();
                }
                break;
            case '.':
                inputDecimal();
                break;
            case '%':
                inputPercentage();
                break;
            case '+':
            case '-':
            case 'X':
            case '/':
                inputOperator(buttonText);
                break;
            case '√':
                // Calculate square root
                const value = parseFloat(currentInput);
                if (value >= 0) {
                    currentInput = String(Math.sqrt(value));
                } else {
                    currentInput = 'Error';
                }
                updateDisplay();
                break;
            default:
                // Handle digits
                if (/\d/.test(buttonText)) {
                    inputDigit(buttonText);
                }
                break;
        }
    });
});

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/\d/.test(key)) {
        inputDigit(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+' || key === '-') {
        inputOperator(key);
    } else if (key === '*') {
        inputOperator('X');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        if (operator && previousInput !== '' && !waitingForOperand) {
            performCalculation();
        }
    } else if (key === 'Escape') {
        clear();
    } else if (key === 'Backspace') {
        clearEntry(); // Link Backspace to "C" button functionality
    }
});

// Initialize display
updateDisplay();