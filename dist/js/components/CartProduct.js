class CartProduct{ 
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.element = element;

      thisCartProduct.getElements();
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }

    getElements() {
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = thisCartProduct.element;
      thisCartProduct.dom.amountWidgetElem = thisCartProduct.element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.removeBtn = thisCartProduct.element.querySelector(select.cartProduct.remove);
    }

    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);
      thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function(e) {
        e.preventDefault();

        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }

    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        thisCartProduct.remove();
      });
    }

    remove(){
      const thisCartProduct = this; 
      const event = new CustomEvent ('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    getData() {
      const thisCartProduct = this;

      const productData = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        params: thisCartProduct.params,
      };

      return productData;
    }
  }
  export default CartProduct;