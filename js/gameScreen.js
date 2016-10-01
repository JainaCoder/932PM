"use strict";

window.GameScreen = (function() {
  function GameScreen(mapData){
    Screen.call(this); // not actually needed until there are args :/
    this.level = new Level(mapData);

    this.saveHeld = false;

    app.input.registerKeyUpListener(
      app.input.keyCodes['P'],
      function() { if(app.debug) this.level.widthChangeFlag = 1; }.bind(this)
    );
    app.input.registerKeyUpListener(
      app.input.keyCodes['L'],
      function() { if(app.debug) this.level.heightChangeFlag = 1; }.bind(this)
    );
    app.input.registerKeyUpListener(
      app.input.keyCodes['O'],
      function() { if(app.debug) this.level.widthChangeFlag = -1; }.bind(this)
    );
    app.input.registerKeyUpListener(
      app.input.keyCodes['K'],
      function() { if(app.debug) this.level.heightChangeFlag = -1; }.bind(this)
    );

  }


  // GameScreen is a subclass of Screen
  GameScreen.prototype = Object.create(Screen.prototype);

  GameScreen.prototype.update = function(dt) {
    this.level.update(dt);

    if (app.input.keyMap[16] && app.input.keyMap[83]) { // shift-s
      if (!this.saveHeld) {
        this.saveHeld = true;
        this.level.save();
      }
    } else {
      this.saveHeld = false;
    }
  };

  GameScreen.prototype.render = function(stage) {
    this.level.render(stage);
    // TODO: level camera movement should probably be moved here

    // UI rendering could happen here?
  };

  return GameScreen;
}());
