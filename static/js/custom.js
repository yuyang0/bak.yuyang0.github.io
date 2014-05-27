// addEvent/removeEvent: a better solution to bind and remove event handler
var addEvent = function(){
  var guid = 1;
  return function (element, type, handler){
    if (!handler.$$guid){
      handler.$$guid = guid++;
    }
    if (!element.events){
      element.events = {};
    }
    type = type.replace(/^on/, ''); //strip the "on" prefix
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
}();

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

// make IE support preventDefault, stopPropagation, target attribute.
var fixEvent = function(event){
  event.preventDefault = function(){
    this.returnValue = false;
  };
  event.stopPropagation = function(){
    this.cancelBubble = true;
  };
  event.target = event.srcElement;

  // mouse event
  if (event.clientX !== undefined){
    var ret = getScrollOffsets();
    event.pageX = event.clientX + ret.x;
    event.pageY = event.clientY + ret.y;
  }
  return event;
};


//get css attribute
function getStyle(elem, name){
  if(elem.style[name])
    return elem.style[name];
  else if(elem.currentStyle)
    return elem.currentStyle[name];
  else if (document.defaultView && document.defaultView.getComputedStyle){
    name = name.replace(/([A-Z])/g, "-$1");
    name = name.toLowerCase();

    var s = document.defaultView.getComputedStyle(elem, "");
    return s && s.getPropertyValue(name);
  }else
    return null;
}

// Return the current scrollbar offsets as the x and y properties of an object
function getScrollOffsets(w) {
  // Use the specified window or the current window if no argument
  w = w || window;
  // This works for all browsers except IE versions 8 and before
  if (w.pageXOffset != null) return {x: w.pageXOffset, y:w.pageYOffset};
  // For IE (or any browser) in Standards mode
  var d = w.document;
  if (document.compatMode == "CSS1Compat")
    return {x:d.documentElement.scrollLeft, y:d.documentElement.scrollTop};

  // For browsers in Quirks mode
  return { x: d.body.scrollLeft, y: d.body.scrollTop };
}

// Return the viewport size as w and h properties of an object
function getViewportSize(w) {
  // Use the specified window or the current window if no argument
  w = w || window;
  // This works for all browsers except IE8 and before
  if (w.innerWidth != null) return {w: w.innerWidth, h:w.innerHeight};
  // For IE (or any browser) in Standards mode
  var d = w.document;
  if (document.compatMode == "CSS1Compat")
    return { w: d.documentElement.clientWidth,
             h: d.documentElement.clientHeight };
  // For browsers in Quirks mode
  return { w: d.body.clientWidth, h: d.body.clientWidth };
}


// get document coordinates(viewpoint coordinates add scroll offsets)
function getDocumentCoordinates(obj){
  scrollOffsets = getScrollOffsets();
  viewCoordinates = obj.getBoundingClientRect();
  return {x: scrollOffsets.x + viewCoordinates.left,
         y: scrollOffsets.y + viewCoordinates.top};
}

addEvent(window, 'load',  function(){
  var tb = document.getElementById("table-of-contents");
  var cont = document.getElementById("content");
  if (!! tb){
    var initial_doc_top = getDocumentCoordinates(tb).y;

    addEvent(window, 'scroll', function(){
      var viewpoint_top = tb.getBoundingClientRect().top;
      var doc_top = getDocumentCoordinates(tb).y;
      if(viewpoint_top < 30){
        tb.style.position = "fixed";
        tb.style.top = "30px";
      }else if(doc_top < initial_doc_top){
        tb.style = '';
      }
    });
  }
});


addEvent(window, 'load', function(){
  var get_height = function (ele){
    var box = ele.getBoundingClientRect();
    var height = box.height || (box.bottom - box.top);
    return height;
  };

  var ttb_lis = document.querySelectorAll("#text-table-of-contents li");
  for (var i = 0; i < ttb_lis.length; ++i){
    var li = ttb_lis[i];

    addEvent(li, 'mouseover', function(evt){
      var inner_ul = this.lastElementChild;
      if (inner_ul.nodeName === 'UL' &&  get_height(inner_ul) > 500){
        inner_ul.style.overflow = 'scroll';
        inner_ul.style.overflowX = 'hidden';
        inner_ul.style.overflowY = 'scroll';
        inner_ul.style.maxHeight = '525px';
      }
    });
  }
});

var toggleClass = function(ele, classAttr){
  var className = ele.className;
  if (className.search(classAttr) === -1){
    className = className + ' ' + classAttr;
  }else{
    className = className.replace(classAttr, '');
  }
  ele.className = className;
};

var addClass = function(ele, classAttr){
  var className = ele.className;
  if (!!!className){            //undefined
    className = classAttr;
  } else if(className.search(classAttr) === -1){
    className = className + ' ' + classAttr;
  }
  ele.className = className;
};

// mobile menu
addEvent(window, 'load', function(){
  var siteNavBtn = document.getElementById('site-nav-btn');
  var siteNav = document.getElementById('site-nav');

  addEvent(siteNavBtn, 'click', function(evt){
    toggleClass(siteNav, 'mobi-hid');

    evt.stopPropagation();
    return false;
  });

  addEvent(document.body, 'click', function(){
    addClass(siteNav, 'mobi-hid');
  });
});

// add current-page class to menu item
addEvent(window, 'load', function(){
  var pathname = location.pathname;
  var currentPage = pathname.substring(pathname.lastIndexOf('/') + 1);

  var siteNav = document.getElementById('site-nav');
  if (currentPage === '' || currentPage === "index.html"){
    var homeLi = document.querySelectorAll('#site-nav > li')[0];
    addClass(homeLi, 'current-page');
  } else if (currentPage === 'about.html'){
    var aboutLi = document.querySelectorAll('#site-nav > li')[1];
    addClass(aboutLi, 'current-page');
  } else if(currentPage === 'tags.html'){
    var tagsLi = document.querySelectorAll('#site-nav > li')[2];
    addClass(tagsLi, 'current-page');
  } else{
    var homeLi = document.querySelectorAll('#site-nav > li')[0];
    addClass(homeLi, 'current-page');
  }
});

// scroll to top
var animateScrollToTop = function(duration){
  if (duration <= 0) {
    return;
  }
  var difference = getScrollOffsets().y - 0;
  var perTick = difference/duration * 10;
  // set minimize value of perTick, because  when difference is
  // samll, the window scrolls slowly.
  if (Math.abs(perTick) < 15){
    perTick = 15;
  }
  setTimeout(function(){
    var scrollTop = getScrollOffsets().y;
    var newScrollTop = scrollTop - perTick;
    if (newScrollTop < 0){
      newScrollTop = 0;
    }
    window.scrollTo(0, newScrollTop);
    // ele.scrollTop += perTick;
    if (newScrollTop === 0){
      return;
    }
    animateScrollToTop(duration - 10);
  }, 10);
};

addEvent(window, 'load', function(){
  var topLinks = document.querySelectorAll('a.back-to-top');
  for(var i = 0; i < topLinks.length; ++i){
    var alink = topLinks[i];
    addEvent(alink, 'click', function(evt){
      animateScrollToTop(1000);
      return false;
    });
  }

  addEvent(window, 'scroll', function(){
    var scrollTop = getScrollOffsets().y;
    if (scrollTop > 400){
      document.getElementById('fixed-back-to-top').style.display = 'block';
    } else{
      document.getElementById('fixed-back-to-top').style.display = 'none';
    }
  });
});

