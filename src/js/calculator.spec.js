import fs from 'fs';
import path from 'path';

import { Calculator } from './calculator';

describe('init', () => {
  let calculator = null;
  let html = null;

  beforeAll(done => {
    // eslint-disable-next-line no-undef
    fs.readFile(
      path.resolve(__dirname, '../index.html'),
      'utf8',
      (err, htmlFile) => {
        html = htmlFile.toString();
        done();
      }
    );
  });

  beforeEach(() => {
    document.documentElement.innerHTML = html;
    calculator = new Calculator();
  });

  describe('#constructor', () => {
    it('should initialize references to needed DOM elements', () => {
      expect(calculator.$display).toBe(null);
      expect(calculator.$keyboard).toBe(null);
    });
  });

  describe('#init', () => {
    it('should call resetCalculator method', () => {
      const resetCalculatorFn = jest.spyOn(calculator, 'resetCalculator');

      calculator.init();

      expect(resetCalculatorFn).toHaveBeenCalled();
    });

    it('should get DOMElement references for display and keyboard DOMElements', () => {
      calculator.init();

      expect(calculator.$display).toMatchSnapshot();
      expect(calculator.$keyboard).toMatchSnapshot();
    });

    it('should call initKeyboard method', () => {
      const initKeyboardFn = jest.spyOn(calculator, 'initKeyboard');

      calculator.init();

      expect(initKeyboardFn).toHaveBeenCalled();
    });
  });

  describe('#initKeyboard', () => {
    beforeEach(() => {
      calculator.init();
    });

    it('should call addOperator & updateDisplay methods if button is type operator', () => {
      const addOperatorFn = jest.spyOn(calculator, 'addOperator');
      const updateDisplayFn = jest.spyOn(calculator, 'updateDisplay');
      const $button = document.querySelector('[data-key="operator"]');

      triggerClick($button);

      expect(addOperatorFn).toHaveBeenCalledWith($button.value);
      expect(updateDisplayFn).toHaveBeenCalled();
    });

    it('should call addDecimal & updateDisplay methods if button is type decimal', () => {
      const addDecimalFn = jest.spyOn(calculator, 'addDecimal');
      const updateDisplayFn = jest.spyOn(calculator, 'updateDisplay');
      const $button = document.querySelector('[data-key="decimal"]');

      triggerClick($button);

      expect(addDecimalFn).toHaveBeenCalled();
      expect(updateDisplayFn).toHaveBeenCalled();
    });

    it('should call resetCalculator & updateDisplay methods if button is type clear', () => {
      const resetCalculatorFn = jest.spyOn(calculator, 'resetCalculator');
      const updateDisplayFn = jest.spyOn(calculator, 'updateDisplay');
      const $button = document.querySelector('[data-key="clear"]');

      triggerClick($button);

      expect(resetCalculatorFn).toHaveBeenCalled();
      expect(updateDisplayFn).toHaveBeenCalled();
    });

    it('should call updateDisplayValue & updateDisplay methods if its a numeric button', () => {
      const updateDisplayValueFn = jest.spyOn(calculator, 'updateDisplayValue');
      const updateDisplayFn = jest.spyOn(calculator, 'updateDisplay');
      const $button = document.querySelector('[value="9"]');

      triggerClick($button);

      expect(updateDisplayValueFn).toHaveBeenCalledWith($button.value);
      expect(updateDisplayFn).toHaveBeenCalled();
    });

    it('should not call any of the above methods if clicked on an element that is not a button', () => {
      const addOperatorFn = jest.spyOn(calculator, 'addOperator');
      const updateDisplayFn = jest.spyOn(calculator, 'updateDisplay');
      const addDecimalFn = jest.spyOn(calculator, 'addDecimal');
      const resetCalculatorFn = jest.spyOn(calculator, 'resetCalculator');
      const updateDisplayValueFn = jest.spyOn(calculator, 'updateDisplayValue');
      const $element = document.querySelector('.keyboard-grid__li');

      triggerClick($element);

      expect(addOperatorFn).not.toHaveBeenCalled();
      expect(updateDisplayFn).not.toHaveBeenCalled();
      expect(addDecimalFn).not.toHaveBeenCalled();
      expect(resetCalculatorFn).not.toHaveBeenCalled();
      expect(updateDisplayValueFn).not.toHaveBeenCalled();
    });
  });

  describe('#updateDisplayValue', () => {
    beforeEach(() => {
      calculator.init();
    });

    describe('waitingForSecondOperand is true', () => {
      it('should set display value and waitingForSecondOperand to false if waitingForSecondOperand is true', () => {
        calculator.waitingForSecondOperand = true;
        const newValue = '30';

        calculator.updateDisplayValue(newValue);

        expect(calculator.displayValue).toBe(newValue);
        expect(calculator.waitingForSecondOperand).toBe(false);
      });
    });

    describe('waitingForSecondOperand is false', () => {
      it('should set new display value equal to input if previous displayValue is 0', () => {
        calculator.displayValue = '0';
        const newValue = '30';

        calculator.updateDisplayValue(newValue);

        expect(calculator.displayValue).toBe(newValue);
      });

      it('should append new display value if previous displayValue is not 0', () => {
        const previousValue = '3';
        const newValue = '4';
        calculator.displayValue = previousValue;

        calculator.updateDisplayValue(newValue);

        expect(calculator.displayValue).toBe(`${previousValue}${newValue}`);
      });
    });
  });

  describe('#updateDisplay', () => {
    beforeEach(() => {
      calculator.init();
    });

    it('should display current displayValue on display DOMElement with proper decimal separator', () => {
      const displayValue = '3.4';
      calculator.displayValue = displayValue;

      calculator.updateDisplay();

      // NOTE: I rather use toMatchSnapshot but innerText is not implemented in jsdom, which is used by jest
      // see: https://github.com/jsdom/jsdom/issues/1245
      expect(calculator.$display.innerText).toBe(
        displayValue.replace('.', ',')
      );
    });
  });

  describe('#addDecimal', () => {
    beforeEach(() => {
      calculator.init();
    });

    describe('waitingForSecondOperand is true', () => {
      it('should set displayValue to 0,', () => {
        calculator.waitingForSecondOperand = true;

        calculator.addDecimal();

        expect(calculator.displayValue).toBe(`0${calculator.dot}`);
        expect(calculator.waitingForSecondOperand).toBe(false);
      });
    });

    describe('waitingForSecondOperand is false', () => {
      it('should append decimal separator to current displayValue', () => {
        const displayValue = '3';
        calculator.displayValue = displayValue;

        calculator.addDecimal();

        expect(calculator.displayValue).toBe(
          `${displayValue}${calculator.dot}`
        );
      });

      it('should not append decimal separator if current displayValue already has one', () => {
        const displayValue = '3,';
        calculator.displayValue = displayValue;

        calculator.addDecimal();

        expect(calculator.displayValue).toBe(displayValue);
      });
    });
  });

  describe('#addOperator', () => {
    beforeEach(() => {
      calculator.init();
    });

    describe('operator is null and displayValue is a number (when hitting an operator button for first time)', () => {
      it('should save displayValue in firstOperand and set waitingForSecondOperand to true', () => {
        calculator.displayValue = '3';

        calculator.addOperator(null);

        expect(calculator.firstOperand).toBe(
          parseFloat(calculator.displayValue)
        );
        expect(calculator.waitingForSecondOperand).toBe(true);
      });
    });

    describe('operator is not null (when hitting an operator for second or more times)', () => {
      it('should call calculate method and store result in displayValue, update displayValue, save operator and set waitingForSecondOperand to true', () => {
        const firstOperand = 3;
        const result = 30;
        const operator = '+';
        calculator.operator = operator;
        calculator.displayValue = `${firstOperand}`;
        calculator.firstOperand = firstOperand;
        const calculateFn = jest
          .spyOn(calculator, 'calculate')
          .mockReturnValue(result);

        calculator.addOperator(operator);

        expect(calculateFn).toHaveBeenCalledWith(
          firstOperand,
          firstOperand,
          operator
        );
        expect(calculator.displayValue).toBe(`${result}`);
        expect(calculator.firstOperand).toBe(result);
        expect(calculator.operator).toBe(operator);
        expect(calculator.waitingForSecondOperand).toBe(true);
      });
    });

    describe('#addOperator', () => {
      beforeEach(() => {
        calculator.init();
      });

      it('should add numbers if operator is +', () => {
        const a = 3;
        const b = 2;

        expect(calculator.calculate(a, b, '+')).toBe(a + b);
      });

      it('should substract numbers if operator is -', () => {
        const a = 3;
        const b = 2;

        expect(calculator.calculate(a, b, '-')).toBe(a - b);
      });

      it('should multiply numbers if operator is *', () => {
        const a = 3;
        const b = 2;

        expect(calculator.calculate(a, b, '*')).toBe(a * b);
      });

      it('should divide numbers if operator is /', () => {
        const a = 6;
        const b = 2;

        expect(calculator.calculate(a, b, '/')).toBe(a / b);
      });

      it('should return second operator if no operator is given', () => {
        const a = 3;
        const b = 2;

        expect(calculator.calculate(a, b)).toBe(b);
      });
    });

    describe('#resetCalculator', () => {
      beforeEach(() => {
        calculator.init();
      });

      it('should reset calculator values', () => {
        calculator.resetCalculator();

        expect(calculator.displayValue).toBe('0');
        expect(calculator.dot).toBe(',');
        expect(calculator.operator).toBe(null);
        expect(calculator.firstOperand).toBe(null);
        expect(calculator.waitingForSecondOperand).toBe(false);
      });
    });
  });

  function triggerClick($element) {
    $element.dispatchEvent(new Event('click', { bubbles: true }));
  }
});
