/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
import {settings, select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from '.components/Cart.js';


  const app = {
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initCart();
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;

      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          thisApp.data.products = parsedResponse;
          thisApp.initMenu();
        });
    },

    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      for(let productData of thisApp.data.products){
        new Product(productData.id, productData);
      }
    },

    initCart: function(){
      const thisApp = this; 
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
  }

  app.init();


