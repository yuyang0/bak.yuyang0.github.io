// addEvent/removeEvent: a better solution to bind and remove event handler
var addEvent = function (element, type, handler){
  if (!handler.$$guid){
    handler.$$guid = addEvent.guid++;
  }
  if (!element.events){
    element.events = {};
  }
  var handlers = element.events[type];
  if (!handlers){
    handlers = element.events[type] = {};
    if (element['on' + type]){
      handlers[0] = element['on' + type];
    }
  }
  handlers[handler.$$guid] = handler;
  element['on' + type] = handleEvent;
};

addEvent.guid = 1;

var removeEvent = function(element, type, handler){
  if (element.events && element.events[type]){
    delete element.events[type][handler.$$guid];
  }
};

var handleEvent = function (event){
  var returnValue = true;
  event = event || fixEvent(window.event);
  var handlers = this.events[event.type];
  for (var i in handlers){
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false){
      returnValue = false;
    }
  }
  return returnValue;
};

var fixEvent = function(event){
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  event.target = event.target || event.srcElement;
  return event;
};

fixEvent.preventDefault = function(){
  this.returnValue = false;
};
fixEvent.stopPropagation = function(){
  this.cancelBubble = true;
};
