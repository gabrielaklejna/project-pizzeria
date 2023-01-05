import {select, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking{
    constructor(element){
        const thisBooking = this;

    }
    getElements(element){
        const thisBooking = this;
       
    }
    render(){
        const thisBooking = this; 
        const generatedHTML = templates.bookingWidget(thisBooking.data);
        thisBooking.element = utils.createDOMFromHTML(generatedHTML);
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.booking = element.querySelector(select.containerOf.booking);
        thisBooking.dom.wrapper.innerHTML = thisBooking.wrapper;
        thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    };
    initWidgets();
}
export default Booking 