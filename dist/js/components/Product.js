import utils from '../utils.js';
import { templates, select} from '../settings.js';
class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id; 
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      thisProduct.getElements();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
    }  

    renderInMenu(){
      const thisProduct = this; 
      /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*create element using utilscreateElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu*/
      menuContainer.appendChild(thisProduct.element);
    }
  
    initAccordion() {
      const thisProduct = this; 
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      clickableTrigger.addEventListener('click', function(e) {
        e.preventDefault();

        thisProduct.element.classList.toggle('active');
        
        const activeProducts = document.querySelectorAll('.product.active');
        for(const activeProduct of activeProducts) {
          if (activeProduct !== thisProduct.element) {
            activeProduct.classList.remove('active');
          }
        }
      });
    }

    initOrderForm(){
      const thisProduct = this;
      
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder(){
      const thisProduct = this;
      
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      
      // set price to default price
      let price = thisProduct.data.price;
      
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);
      
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          console.log(optionId, option);

          if(formData[paramId].includes(optionId) && !option.default) {
            price += option.price;
          }

          if(!formData[paramId].includes(optionId) && option.default) {
            price -= option.price;
          }

          const imageElem = document.querySelector('.' + paramId + '-' + optionId);
          if(imageElem) {
            if(formData[paramId].includes(optionId)) {
              imageElem.classList.add('active');
            } else {
              imageElem.classList.remove('active');
            }
          }

        }
      }
      
      thisProduct.priceSingle = price;
      thisProduct.price = price * thisProduct.amountWidget.value;
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = thisProduct.price;
    }

    getElements(){
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      });
    }

    addToCart(){
      const thisProduct = this;
      //app.cart.add(thisProduct.prepareCartProduct());
      
      const event =new CustomEvent('add-to-cart',{
        bubbles: true,
        detail: thisProduct.prepareCartProduct()
      });

      thisProduct.element.dispatchEvent(event);

    }

    prepareCartProduct(){
      const thisProduct = this;
      
      const productSummary = {};
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name;
      productSummary.amount = thisProduct.amountWidget.value;
      productSummary.priceSingle = thisProduct.priceSingle;
      productSummary.price = thisProduct.price;
      productSummary.params = thisProduct.prepareCartProductParams();

      return productSummary;
    
    }

    prepareCartProductParams() {
      const thisProduct = this;

      const formData = utils.serializeFormToObject(thisProduct.form);
      const paramsSummary = {};

      for(const paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        paramsSummary[paramId] = {
          label: param.label,
          options: {}
        };

        for(const optionId in param.options) {
          const option = param.options[optionId];
          if(formData[paramId].includes(optionId)) {
            paramsSummary[paramId].options[optionId] = option.label;
          }
        }

      }

      return paramsSummary;

    }
  }
  export default Product;