/**
 * Orderdetail model events
 */

'use strict';

import {EventEmitter} from 'events';
var OrderdetailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrderdetailEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Orderdetail) {
  for(var e in events) {
    let event = events[e];
    Orderdetail.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    OrderdetailEvents.emit(event + ':' + doc._id, doc);
    OrderdetailEvents.emit(event, doc);
  };
}

export {registerEvents};
export default OrderdetailEvents;
