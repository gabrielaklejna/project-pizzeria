import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
class Booking{
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
        thisBooking.getData();

        thisBooking.tableSelected = null;
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
          thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
          thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
          thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
          thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
      }
      initWidgets(){
          const thisBooking = this;
        
          thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
          thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
          thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
          thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
          thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.updateDOM();
          });

          thisBooking.dom.floorPlan.addEventListener('click', function(event) {
            event.preventDefault();
            if(event.target.classList.contains(classNames.booking.table)){
              thisBooking.handleTableClick(event.target);
            }
          });
          
          thisBooking.dom.wrapper.addEventListener('submit', function (e){
            e.preventDefault();
            thisBooking.sendBooking();
          });

        
      }

      handleTableClick(table){
        const thisBooking = this;
        const tableId = table.getAttribute(settings.booking.tableIdAttribute);

        if(table.classList.contains(classNames.booking.booked)) {
          alert("stolik zajęty");
          return;
        }

        if (thisBooking.tableSelected && thisBooking.tableSelected != tableId) {
          const activeTable = thisBooking.dom.floorPlan.querySelector(select.booking.tableSelected);
          activeTable.classList.remove(classNames.booking.tableSelected);
        }

        table.classList.toggle(classNames.booking.tableSelected);
        if (thisBooking.tableSelected !== tableId) {
          thisBooking.tableSelected = tableId;
        }
        else {
          thisBooking.tableSelected = null;
        }
      }

      getData(){
        const thisBooking = this; 
        const startDateParam = settings.db.dateStartParamsKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateStartParamsKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
        const params = {
            bookings: [
                startDateParam, endDateParam,
            ],
            eventsCurrent:[
                settings.db.notRepeatParams, startDateParam, endDateParam
            ],
            eventsRepeat: [
                settings.db.repeatParams
            ],
        };
        const urls = {
            booking: settings.db.url + '/' + settings.db.bookings + '?' + params.bookings.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'), 
            eventsRepeat: settings.db.url + '/' + settings.db.events+ '?' + params.eventsRepeat.join('&'),
        };
        Promise.all([
          fetch(urls.booking),
          fetch(urls.eventsCurrent),
          fetch(urls.eventsRepeat),
        ])
          .then(function(allResponses){
            const bookingsResponse = allResponses[0];
            const eventsCurrentResponse = allResponses[1];
            const eventsRepeatResponse = allResponses[2];
            return Promise.all([
                bookingsResponse.json(),
                eventsCurrentResponse.json(),
                eventsRepeatResponse.json(),
            ]);
          })
          .then(function([bookings, eventsCurrent, eventsRepeat]){
            thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });
      }
      parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this; 

        thisBooking.booked = {};
        for ( let item of bookings){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table,);
        }

        for ( let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table,);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;
  
        for ( let item of eventsRepeat){
          if (item.repeat == 'daily'){
            for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
            thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table,);
            }
          }
        }
        thisBooking.updateDOM();
      }
      makeBooked(date, hour, duration, table){
        const thisBooking = this; 

        if (typeof thisBooking.booked[date] == 'undefined'){
          thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        //thisBooking.booked[date][hour].push(table);

        for (let hourBlock = startHour; hourBlock < startHour + duration ; hourBlock += 0.5){
          //console.log('loop', hourBlock);
          if (typeof thisBooking.booked[date][hourBlock] == 'undefined'){
            thisBooking.booked[date][hourBlock] = [];
          }
          thisBooking.booked[date][hourBlock].push(table);
        }

      }
      updateDOM(){
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false; 

        if (
          typeof thisBooking.booked[thisBooking.date] == 'undefined'
          ||
          typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ){
          allAvailable = true;
        }
        for (let table of thisBooking.dom.tables){
          let tableId = table.getAttribute(settings.booking.tableIdAttribute);
          if(!isNaN(tableId)){
            tableId= parseInt (tableId);
          }
          
          if( !allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1 
          ){
            table.classList.add(classNames.booking.tableBooked);
          }
          else{
            table.classList.remove(classNames.booking.tableBooked);
          }
        }
      }
      sendBooking() {
        const thisBooking = this;
  
        const url = settings.db.url + '/' + settings.db.bookings; //http://localhost:3131/bookings
        const payload = {
          date: thisBooking.date,
          hour: thisBooking.hourPicker,
          table: thisBooking.tableSelected,
          duration: thisBooking.hoursAmount,
          ppl: thisBooking.peopleAmount.value,
          starters: [],
          phone: thisBooking.phone,
          address: thisBooking.address,
        }
  
        for(const starter of payload.starters) {
          payload.starters.push(starter.getData());
        }
  
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
      }


};
export default Booking;