import {select, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking{
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
    }
  
    render(element){
      const thisBooking = this; 
      const generatedHTML = templates.bookingWidget(thisBooking.data);
        thisBooking.element = utils.createDOMFromHTML(generatedHTML);
        element.appendChild(thisBooking.element);
        thisBooking.dom = {};
        thisBooking.dom.wrapper = thisBooking.element;
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }
    initWidgets(){
        const thisBooking = this;
      
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
      
        };
    
};
export default Booking 