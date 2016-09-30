"use strict";

var app = app || {};

app.input = {

  keyMap: {},

  keyCodes: {
    'A': 65,
    'S': 83,
    'W': 87,
    'D': 68,
  },

  isKeyDown: function(char){
    return this.keyMap[this.keyCodes[char]];
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

  mouseLoc: {},

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
    this.keyMap[event.keyCode] = false;
  },

  onKeyDown: function(event) {
    this.keyMap[event.keyCode] = true;
  },

  onMouseUp: function(event) {
    this.mouseMap[event.button] = false;
  },

  onMouseDown: function(event) {
    this.mouseMap[event.button] = true;
  },

  onMouseMove: function(event) {
    this.mouseLoc.x = event.offsetX;
    this.mouseLoc.y = event.offsetY;
  },
};
