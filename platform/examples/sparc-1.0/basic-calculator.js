/**
 * SPARC 1.0 Example: Basic Calculator
 * Demonstrates the original SPARC methodology
 * Author: SPARC Evolution Team
 */

// SPARC Step 1: SPECIFICATIONS
/*
REQUIREMENTS:
- Create a calculator that can perform basic arithmetic operations
- Support operations: addition, subtraction, multiplication, division
- Handle edge cases like division by zero
- Provide a clean, user-friendly interface
- Input validation for numeric values

CONSTRAINTS:
- Must use vanilla JavaScript (no external libraries)
- Should work in any modern browser
- Error handling for invalid inputs
- Clear display of results

EXPECTED INPUTS:
- Two numeric values (integers or floats)
- Operation type (+, -, *, /)

EXPECTED OUTPUTS:
- Calculated result as a number
- Error messages for invalid operations
*/

// SPARC Step 2: PSEUDOCODE
/*
BEGIN Calculator
  INITIALIZE display = "0"
  INITIALIZE currentValue = 0
  INITIALIZE operator = null
  INITIALIZE previousValue = 0
  
  FUNCTION updateDisplay(value)
    SET display = value
    OUTPUT display to screen
  END FUNCTION
  
  FUNCTION inputNumber(num)
    IF display == "0" OR operator was just pressed
      SET display = num
    ELSE
      SET display = display + num
    END IF
    CALL updateDisplay(display)
  END FUNCTION
  
  FUNCTION inputOperator(op)
    IF operator exists AND display != previousValue
      CALL calculate()
    END IF
    SET previousValue = parseFloat(display)
    SET operator = op
    SET operatorPressed = true
  END FUNCTION
  
  FUNCTION calculate()
    SET current = parseFloat(display)
    SET previous = previousValue
    
    SWITCH operator
      CASE "+":
        SET result = previous + current
      CASE "-":
        SET result = previous - current
      CASE "*":
        SET result = previous * current
      CASE "/":
        IF current == 0
          RETURN "Error: Division by zero"
        ELSE
          SET result = previous / current
        END IF
      DEFAULT:
        RETURN "Error: Invalid operator"
    END SWITCH
    
    CALL updateDisplay(result)
    SET operator = null
    SET previousValue = result
  END FUNCTION
  
  FUNCTION clear()
    SET display = "0"
    SET currentValue = 0
    SET operator = null
    SET previousValue = 0
    CALL updateDisplay("0")
  END FUNCTION
END Calculator
*/

// SPARC Step 3: ARCHITECTURE
/*
COMPONENTS:
1. Calculator Class - Main logic controller
2. Display Component - Shows current value/result
3. Button Component - Input interface
4. Error Handler - Manages error states

DATA FLOW:
User Input → Button Component → Calculator Class → Display Component

STRUCTURE:
Calculator/
├── src/
│   ├── Calculator.js (main logic)
│   ├── Display.js (display management)
│   ├── Button.js (input handling)
│   └── ErrorHandler.js (error management)
├── styles/
│   └── calculator.css
└── index.html
*/

// SPARC Step 4: REFINEMENT
/*
IMPROVEMENTS IDENTIFIED:
1. Add keyboard support for better UX
2. Implement memory functions (M+, M-, MR, MC)
3. Add history of calculations
4. Support for parentheses in expressions
5. Scientific calculator functions

OPTIMIZATIONS:
1. Debounce rapid button clicks
2. Optimize display updates
3. Add visual feedback for button presses
4. Implement responsive design

ERROR HANDLING:
1. Validate all numeric inputs
2. Handle overflow/underflow scenarios
3. Graceful degradation for unsupported operations
4. User-friendly error messages
*/

// SPARC Step 5: COMPLETION
class Calculator {
  constructor() {
    this.display = "0";
    this.currentValue = 0;
    this.operator = null;
    this.previousValue = 0;
    this.operatorPressed = false;
    this.history = [];
    
    this.initializeDOM();
    this.attachEventListeners();
  }
  
  initializeDOM() {
    // Create calculator HTML structure
    const container = document.createElement('div');
    container.className = 'calculator';
    container.innerHTML = `
      <div class="calculator-display">
        <div class="history"></div>
        <div class="current-display">${this.display}</div>
      </div>
      <div class="calculator-buttons">
        <button class="btn btn-clear" data-action="clear">C</button>
        <button class="btn btn-clear" data-action="clear-entry">CE</button>
        <button class="btn btn-operator" data-action="delete">⌫</button>
        <button class="btn btn-operator" data-operation="/">/</button>
        
        <button class="btn btn-number" data-number="7">7</button>
        <button class="btn btn-number" data-number="8">8</button>
        <button class="btn btn-number" data-number="9">9</button>
        <button class="btn btn-operator" data-operation="*">×</button>
        
        <button class="btn btn-number" data-number="4">4</button>
        <button class="btn btn-number" data-number="5">5</button>
        <button class="btn btn-number" data-number="6">6</button>
        <button class="btn btn-operator" data-operation="-">-</button>
        
        <button class="btn btn-number" data-number="1">1</button>
        <button class="btn btn-number" data-number="2">2</button>
        <button class="btn btn-number" data-number="3">3</button>
        <button class="btn btn-operator" data-operation="+">+</button>
        
        <button class="btn btn-number btn-zero" data-number="0">0</button>
        <button class="btn btn-number" data-action="decimal">.</button>
        <button class="btn btn-equals" data-action="calculate">=</button>
      </div>
    `;
    
    document.body.appendChild(container);
    this.displayElement = container.querySelector('.current-display');
    this.historyElement = container.querySelector('.history');
  }
  
  attachEventListeners() {
    // Button click handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-number]')) {
        this.inputNumber(e.target.dataset.number);
      }
      
      if (e.target.matches('[data-operation]')) {
        this.inputOperator(e.target.dataset.operation);
      }
      
      if (e.target.matches('[data-action="calculate"]')) {
        this.calculate();
      }
      
      if (e.target.matches('[data-action="clear"]')) {
        this.clear();
      }
      
      if (e.target.matches('[data-action="clear-entry"]')) {
        this.clearEntry();
      }
      
      if (e.target.matches('[data-action="delete"]')) {
        this.deleteDigit();
      }
      
      if (e.target.matches('[data-action="decimal"]')) {
        this.inputDecimal();
      }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        this.inputNumber(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        this.inputOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        this.calculate();
      } else if (e.key === 'Escape') {
        this.clear();
      } else if (e.key === 'Backspace') {
        this.deleteDigit();
      } else if (e.key === '.') {
        this.inputDecimal();
      }
    });
  }
  
  updateDisplay(value) {
    this.display = value.toString();
    this.displayElement.textContent = this.display;
  }
  
  inputNumber(num) {
    if (this.display === "0" || this.operatorPressed) {
      this.display = num;
      this.operatorPressed = false;
    } else {
      this.display += num;
    }
    this.updateDisplay(this.display);
  }
  
  inputOperator(op) {
    if (this.operator && !this.operatorPressed) {
      this.calculate();
    }
    
    this.previousValue = parseFloat(this.display);
    this.operator = op;
    this.operatorPressed = true;
    
    // Update history display
    this.historyElement.textContent = `${this.previousValue} ${op}`;
  }
  
  calculate() {
    if (!this.operator || this.operatorPressed) return;
    
    const current = parseFloat(this.display);
    const previous = this.previousValue;
    let result;
    
    try {
      switch (this.operator) {
        case "+":
          result = previous + current;
          break;
        case "-":
          result = previous - current;
          break;
        case "*":
          result = previous * current;
          break;
        case "/":
          if (current === 0) {
            throw new Error("Cannot divide by zero");
          }
          result = previous / current;
          break;
        default:
          throw new Error("Invalid operator");
      }
      
      // Handle floating point precision
      result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
      
      // Add to history
      this.history.push(`${previous} ${this.operator} ${current} = ${result}`);
      this.historyElement.textContent = `${previous} ${this.operator} ${current} =`;
      
      this.updateDisplay(result);
      this.operator = null;
      this.previousValue = result;
      this.operatorPressed = true;
      
    } catch (error) {
      this.updateDisplay("Error");
      this.operator = null;
      this.previousValue = 0;
      this.operatorPressed = true;
      console.error("Calculation error:", error.message);
    }
  }
  
  clear() {
    this.display = "0";
    this.currentValue = 0;
    this.operator = null;
    this.previousValue = 0;
    this.operatorPressed = false;
    this.updateDisplay("0");
    this.historyElement.textContent = "";
  }
  
  clearEntry() {
    this.display = "0";
    this.updateDisplay("0");
  }
  
  deleteDigit() {
    if (this.display.length > 1 && this.display !== "0") {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = "0";
    }
    this.updateDisplay(this.display);
  }
  
  inputDecimal() {
    if (this.operatorPressed) {
      this.display = "0.";
      this.operatorPressed = false;
    } else if (!this.display.includes(".")) {
      this.display += ".";
    }
    this.updateDisplay(this.display);
  }
  
  getHistory() {
    return this.history;
  }
  
  clearHistory() {
    this.history = [];
  }
}

// CSS Styles for the calculator
const styles = `
  .calculator {
    max-width: 400px;
    margin: 50px auto;
    background: #f0f0f0;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  
  .calculator-display {
    background: #000;
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: right;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .history {
    font-size: 14px;
    color: #888;
    min-height: 20px;
  }
  
  .current-display {
    font-size: 32px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .calculator-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .btn {
    padding: 20px;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  .btn-number {
    background: #e0e0e0;
    color: #333;
  }
  
  .btn-number:hover {
    background: #d0d0d0;
  }
  
  .btn-operator {
    background: #ff9500;
    color: white;
  }
  
  .btn-operator:hover {
    background: #e6820e;
  }
  
  .btn-equals {
    background: #ff9500;
    color: white;
    grid-column: span 2;
  }
  
  .btn-equals:hover {
    background: #e6820e;
  }
  
  .btn-clear {
    background: #a6a6a6;
    color: white;
  }
  
  .btn-clear:hover {
    background: #909090;
  }
  
  .btn-zero {
    grid-column: span 2;
  }
  
  @media (max-width: 480px) {
    .calculator {
      margin: 20px;
      max-width: none;
    }
    
    .btn {
      padding: 15px;
      font-size: 16px;
    }
    
    .current-display {
      font-size: 24px;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Calculator());
} else {
  new Calculator();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}

/**
 * SPARC 1.0 LEARNING OBJECTIVES:
 * 
 * 1. SPECIFICATIONS - Learn to define clear requirements
 * 2. PSEUDOCODE - Break down logic into steps
 * 3. ARCHITECTURE - Plan component structure
 * 4. REFINEMENT - Identify improvements
 * 5. COMPLETION - Implement working solution
 * 
 * KEY CONCEPTS DEMONSTRATED:
 * - Event-driven programming
 * - State management
 * - Error handling
 * - User interface design
 * - Code organization
 * - Documentation practices
 */