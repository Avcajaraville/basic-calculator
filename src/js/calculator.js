export class Calculator {
  constructor() {
    this.$display = null;
    this.$keyboard = null;
  }

  init() {
    this.resetCalculator();
    this.$display = document.getElementById('display');
    this.$keyboard = document.getElementById('keyboard');
    this.initKeyboard();
  }

  initKeyboard() {
    this.$keyboard.addEventListener('click', event => {
      const { target } = event;

      if (!target.matches('button')) {
        return;
      }

      const keyType = target.getAttribute('data-key');

      if (keyType === 'operator') {
        this.addOperator(target.value);
        this.updateDisplay();
        return;
      }

      if (keyType === 'decimal') {
        this.addDecimal();
        this.updateDisplay();
        return;
      }

      if (keyType === 'clear') {
        this.resetCalculator();
        this.updateDisplay();
        return;
      }

      this.updateDisplayValue(target.value);
      this.updateDisplay();
    });
  }

  updateDisplayValue(value) {
    if (this.waitingForSecondOperand) {
      this.displayValue = '0';
      this.waitingForSecondOperand = false;
    }
    this.displayValue =
      this.displayValue === '0' ? value : this.displayValue + value;
  }

  updateDisplay() {
    this.$display.innerText = this.displayValue.replace('.', this.dot);
  }

  addDecimal() {
    if (this.waitingForSecondOperand === true) {
      this.displayValue = `0${this.dot}`;
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.displayValue.includes(this.dot)) {
      this.displayValue += this.dot;
    }
  }

  addOperator(operator) {
    const inputValue = parseFloat(this.displayValue.replace(this.dot, '.'));
    if (this.operator === null && !isNaN(inputValue)) {
      this.firstOperand = inputValue;
    } else if (operator) {
      const result = this.calculate(
        this.firstOperand,
        inputValue,
        this.operator
      );
      this.displayValue = String(result);
      this.firstOperand = result;
    }
    this.operator = operator;
    this.waitingForSecondOperand = true;
  }

  calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
      return firstOperand + secondOperand;
    } else if (operator === '-') {
      return firstOperand - secondOperand;
    } else if (operator === '*') {
      return firstOperand * secondOperand;
    } else if (operator === '/') {
      return firstOperand / secondOperand;
    }

    return secondOperand;
  }

  resetCalculator() {
    this.displayValue = '0';
    this.dot = ',';
    this.operator = null;
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
  }
}
