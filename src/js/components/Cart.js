import utils from '../utils.js';
import { settings, templates, select, classNames } from '../settings.js'; 
import CartProduct from '.CartProduct.js';

class Cart{
    constructor(element){
      const thisCart = this; 
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productsList = element.querySelector(select.cart.productList);
      thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
      thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
      thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
      thisCart.dom.form = element.querySelector(select.cart.form);
      thisCart.dom.phone = element.querySelector(select.cart.phone);
      thisCart.dom.address = element.querySelector(select.cart.address);
    }

    initActions(){
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productsList.addEventListener('remove', function(e) {
        e.preventDefault();
        const productToRemove = e.detail.cartProduct;
        thisCart.remove(productToRemove);
      });

      thisCart.dom.form.addEventListener('submit', function (e){
        e.preventDefault();
        thisCart.sendOrder();
      })
    }

    update() {
      const thisCart = this;

      thisCart.totalNumber = 0;
      thisCart.subTotalPrice = 0;
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;

      for(const prod of thisCart.products) {
        thisCart.totalNumber += prod.amount;
        thisCart.subTotalPrice += prod.price;
      }

      if (thisCart.totalNumber > 0) {
        thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
        thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
      }

      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

      for(const elem of thisCart.dom.totalPrice) {
        elem.innerHTML = thisCart.totalPrice;
      }
    }

    remove(productToRemove) {
      const thisCart = this;
      productToRemove.dom.wrapper.remove();

      const index = thisCart.products.indexOf(productToRemove);
      thisCart.products.splice(index, 1);
      thisCart.update();
    }

    add(menuProduct){
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      /*create element using utilscreateElementFromHTML*/
      const element = utils.createDOMFromHTML(generatedHTML);
     
      /*add element to menu*/
      thisCart.dom.productsList.appendChild(element);

      thisCart.products.push(new CartProduct(menuProduct, element));
      thisCart.update();
    }

    sendOrder() {
      const thisCart = this;

      const url = settings.db.url + '/' + settings.db.orders; //http://localhost:3131/api/orders
      const payload = {
        phone: thisCart.dom.phone.value,
        address: thisCart.dom.address.value,
        totalPrice: thisCart.totalPrice,
        subTotalPrice: thisCart.subTotalPrice,
        totalNumber: thisCart.totalNumber,
        products: []
      }

      for(const prod of thisCart.products) {
        payload.products.push(prod.getData());
      }

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    }
  }
  export default Cart;