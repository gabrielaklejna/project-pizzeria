/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
import {settings, select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


  const app = {
    initPages: function(){
      const thisApp = this; 

      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelector(select.nav.links).children;

      thisApp.activedPage(thisApp.pages[0].id);
      
      for(let link of thisApp.navLinks){
        link.addEventListener('click', function(event){
          const clickedElement = this;
          event.preventDefault();
          /* get page id from href attribute */
          const id = clickedElement.getAttribute('href').replace('#', '');

          /* run thisApp.activatePage with that id  */
          thisApp.activedPage(id);
        });
      }
    },
    activedPage: function(pageId){
      const thisApp = this;
      /* add class "active" to matching pages, remove from non-matching */
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id==pageId )
      }
      /* add class "active" to matching links, remove from non-matching */
      for(let link of thisApp.navLinks){
        link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
      };
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initCart();
      thisApp.initPages();
      thisApp.initBooking(); 
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

      thisApp.productList=document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail)
      });

    },
    initBooking: function(){
      const thisApp = this; 
      const bookingElem = element.querySelector(select.containerOf.booking);
      thisApp.booking = new Booking(bookingElem);
      


    }
  }

  app.init();
  


