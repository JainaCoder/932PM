/*global Vector*/
"use strict";

var app = app || {};

app.input = {

  //set up all keys now
  keyMap: {
    'a': false,
    's': false,
    'w': false,
    'd': false,
    'o': false,
    'p': false,
    'k': false,
    'l': false,
    'h': false,
    'q': false,
    'e': false, // ( ͡° ͜ʖ ͡°)
    'm': false,
    'Shift': false,
  },

  keyUpListeners: [],

  isKeyDown: function(char) {
    return this.keyMap[char];
  },

  // this makes mouse clicks a little harder to detect, as you have to track if the button
  // is down or not and then if its been released, every `update()`. This could be the desired
  // approach for the `player`, but for menus it could be annoying. We can reassess then.
  mouseMap: {},
  mouseButtons: {
    MAIN: 0, // Left click
    AUX: 1, // Mouse wheel
    SECOND: 2, // Right click
    THIRD: 3, // Usually back button
    FOURTH: 4, // Usuually forward button
  },

  mouseLoc: new Vector(),

  mouseButtonUpListeners: [],
  mouseButtonDownListeners: [],

  registerListener: function() {

    document.addEventListener('keydown', function(event) {
      app.input.onKeyDown(event);
    }, false);

    document.addEventListener('keyup', function(event) {
      app.input.onKeyUp(event);
    }, false);

    // TODO convert event to x,y ?
    document.addEventListener('mousedown', function(event) {
      app.input.onMouseDown(event);
    }, false);

    document.addEventListener('mousemove', function(event) {
      app.input.onMouseMove(event);
    }, false);

    document.addEventListener('mouseup', function(event) {
      app.input.onMouseUp(event);
    }, false);

  },

  // NOTE: soooo, keyCode is actually deprecated, but there's not really a good alternative yet,
  // and it still works. Something to keep in mind if we run into issues on other browsers though,
  // might be something to look into later (TODO). If/when we redo that, we'll have to
  // update anywhere where keyMap is used :/

  onKeyUp: function(event) {
    //event.key is case sensitive, but we don't want different functionality depending upon 
    //whether or not shift is being held- for now, at least.
    this.keyMap[event.key.toLowerCase()] = false;
    for (var i = 0, l = this.keyUpListeners.length; i < l; i++) {
      if (this.keyUpListeners[i].key === event.key) {
        this.keyUpListeners[i].callback(event);
      }
    }
  },

  onKeyDown: function(event) {
    this.keyMap[event.key.toLowerCase()] = true;
    console.log(event.key);
  },

  onMouseUp: function(event) {
    this.mouseMap[event.button] = false;
    for (var i = 0, l = this.mouseButtonUpListeners.length; i < l; i++) {
      if (this.mouseButtonUpListeners[i].mouseButton === event.button) {
        this.mouseButtonUpListeners[i].callback(event);
      }
    }
  },

  onMouseDown: function(event) {
    this.mouseMap[event.button] = true;
    for (var i = 0, l = this.mouseButtonUpListeners.length; i < l; i++) {
      if(this.mouseButtonDownListeners[i].mouseButton === event.button) {
        this.mouseButtonDownListeners[i].callback(event);
      }
    }
  },

  onMouseMove: function(event) {
    this.mouseLoc = new Vector(event.offsetX, event.offsetY);
  },

  registerKeyUpListener: function(key, callback) {
    this.keyUpListeners.push({ key: key, callback: callback });
  },

  registerMouseButtonUpListener: function(mouseButton, callback) {
    this.mouseButtonUpListeners.push({ mouseButton: mouseButton, callback: callback });
  },

  registerMouseButtonDownListener: function(mouseButton, callback) {
    this.mouseButtonDownListeners.push({ mouseButton: mouseButton, callback: callback });
  }
};
