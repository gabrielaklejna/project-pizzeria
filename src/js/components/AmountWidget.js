import { settings,select} from '../settings.js';

class AmountWidget{ 
    constructor(element){
      const thisWidget = this; 
      thisWidget.getElements(element);
      thisWidget.initActions();
      thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue);

      
    }
    getElements(element){
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
   
    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(e) {
        e.preventDefault();
        thisWidget.setValue(e.target.value);
      });

      thisWidget.linkIncrease.addEventListener('click', function(e) {
        e.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });

      thisWidget.linkDecrease.addEventListener('click', function(e) {
        e.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);
  
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }
      
      thisWidget.input.value = thisWidget.value;
    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  export default AmountWidget;