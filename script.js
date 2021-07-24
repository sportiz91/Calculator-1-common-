//Calculator Class
//When the page is firstly loaded, a new calculator object is created through Calculator class.
class Calculator {
  constructor(currentOperandTextElement, previousOperandTextElement) { //Costructor class, takes currentOperandTextElement and previousOperandTextElement divs as arguments.
    this.currentOperandTextElement = currentOperandTextElement; //and then.. saves those divs in the properties "calculator.currentOperandTextElement" and "calculator.previousOperandTextElement"
    this.previousOperandTextElement = previousOperandTextElement;
    this.clear(); //Then, it executes calculator.clear method.
  }

  clear() { //calculator.clear method creates 3 new properties of calculator object: currentOperand, previousOperand (set both of them equals to '') and operator (sets it as undefined)
    this.currentOperand = '';
    this.previousOperand = '';
    this.operator = undefined;
  }

  appendNumber(number) { //apendNumber calculator method is only triggered when a number is pressed (number includes ".")
    if (number === '.' && this.currentOperand.includes('.')) return; //when we press a number button, we first ask if "." was pressed and if it was pressed before. If that is the case, break.
    this.currentOperand += number.toString(); //else, add to the calculator.currentOperand string property the freshly pressed button as a string.
  }

  updateDisplay() { //updateDisplay() calculator method is triggered every time an evenlListener is triggered, afther the main method of the button.
    this.currentOperandTextElement.innerText = this.formatDisplay(this.currentOperand);
    if (this.operator != null) {
      this.previousOperandTextElement.innerText = `${this.formatDisplay(this.previousOperand)} ${this.operator}`;
    } else {
      this.previousOperandTextElement.innerText = ''; //cause, if operand is yet undefined, there's no previousOperand.
    }
  }

  formatDisplay(stringFormat) { //formatDisplay() calculator method is used to set a proper format to the numbers shown in the display (both previousOperand and currentOperand)
    let integerString;
    let integerResult;
    const integerDigit = parseFloat(stringFormat.split('.')[0]);
    const decimalDigit = stringFormat.split('.')[1]; //no need to transform this string to number. Decimal parts not gonna be formatted with thousands separation.
    //we have thre possibilites: numer is "322" (integer without floating nor ".") -> integerDigit gets the number and decimalDigit is undefined; number is "322." -> integerDigit gets the number
    //and decimalDigit is ''; "322.3" -> integerDigit gets the integer and decimalDigit gets the decimal.

    integerString = integerDigit.toLocaleString('en', {maximumFractionDigits: 0});
    integerResult = `${integerString}.${decimalDigit}`; //322.undefined; 322.NaN // 322.3

     if(isNaN(integerDigit)) { //integerDigit is NaN when you press as first button the ".". In that case, you should return the number without format.
       //previously I put isNaN(integerString). That was not working because isNaN converts the string into a number first and then see if it's a number. Well, "1,000"
       // (for example) is not a number. So, you have to use the number without the format to evaluate this condition (integerDigit).
       return stringFormat;
     }

    if (decimalDigit == null) { //we use == (and not ===) because in some cases decimal will be undefined and in some other cases decimal will be ''.
      return integerString; //in that cases we only return the integerString, which is the previous string with the format.
    } else {
      return integerResult; //in case decimalDigit is not null, we have to return the integerResult, which considers the new format.
    }
  }

  operand(operand) { //operand method is triggered when + - * / is pressed. We have two scenarios: a scenario where previousOperand is empty, and a scenario where previousOperand is a number.
    if (this.currentOperand === '.' || this.currentOperand == '') return; //if currentOperand is only "." or empty, break.
    if (this.currentOperand !== '' && this.previousOperand !== '') { //if both current and previous operand are numbers, then, perform the calculations.
      this.perform(); //pressing + - * or / when you have both current and previos operand not empty, triggers the calculation.
    }

    //after the calculation is made (case where current and previous operand are not empty), or if you have only current operand not empty (and previous operand is empty)..
    this.operator = operand; //calculator.operator saves the operand string.
    this.previousOperand = this.currentOperand; //currentOperand now transforms into previousOperand.
    this.currentOperand = ''; //new currentOperand is ''.
  }

  perform() { //perform method is triggered under two scenarios: when a + - * / is pressed and both previous and current operand are not empty, and when equal button is pressed.
    const current = parseFloat(this.currentOperand); //first, store the numbers in variables (string get transformed into numbers)
    const previous = parseFloat(this.previousOperand);
    switch (this.operator) { //switch by case
      case '+':
        this.currentOperand = previous + current;
        this.currentOperand = this.currentOperand.toString(); //we have to transform it back to string in order to formatDisplay to make effect.
        this.previousOperand = ''; //calculator.previousOperand is now '' in order to display only the currentOperand.
        this.operator = undefined; //operator has to be undefined again, if not, is going to be shown in the previousOperand.
        break;
      case '-':
        this.currentOperand = previous - current;
        this.currentOperand = this.currentOperand.toString();
        this.previousOperand = '';
        this.operator = undefined;
        break;
      case '*':
        this.currentOperand = previous * current;
        this.currentOperand = this.currentOperand.toString();
        this.previousOperand = '';
        this.operator = undefined;
        break;
      case '÷':
        this.currentOperand = previous / current;
        this.currentOperand = this.currentOperand.toString();
        this.previousOperand = '';
        this.operator = undefined;
        break;
      default:
        return;
    }
  }

  equal() {
    if (this.currentOperand === '.') return; //if current operand is only ".", break.
    if (this.currentOperand !== '' && this.previousOperand !== '') { //current operand and previous operand both need to be not empty to perform the calculation.
      this.perform();
    }
  }

  delete() { //delete calculator method only slices the last character of the string.
    this.currentOperand = this.currentOperand.slice(0, -1);
  }

}

//Select all the relevant elements and save them in variables
const numberButtons = document.querySelectorAll("[data-number]"); // nodeList
const operandButtons = document.querySelectorAll("[data-operand]"); // nodeList
const allClearButton = document.querySelector("[data-ac]"); // selects a button
const deleteButton = document.querySelector("[data-del]"); // selects a button
const equalButton = document.querySelector("[data-equal]"); // selects a button
const previousOperandTextElement = document.querySelector("[data-previous-operand]"); // selects a div
const currentOperandTextElement = document.querySelector("[data-current-operand]"); // selects a div

//Construct new calculator object (with class template). As arguments we'll pass the div elements selected before.
const calculator = new Calculator(currentOperandTextElement, previousOperandTextElement);

//eventListeners
//Loops through the numbers buttons and add a click event listener. When number is clicked, appendNumber and updateDisplay class method are triggered.
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
});

//Loops through the operand buttons and add a click event listener. When operand is clicked, operand and updateDisplay class method are triggered.
operandButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.operand(button.innerText);
    calculator.updateDisplay();
  })
})

//Add event listener to equalButton. When it's pressed, equal method is triggerent and then display is updated.
equalButton.addEventListener('click', () => {
  calculator.equal();
  calculator.updateDisplay();
})

//Add event listener to deleteButton. When it's pressed, delete method is triggered and then display is updated.
deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
})

//Add event listener to allClearButton. When it's pressed, clear calculator is triggered and updateDisplay too.
allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});
