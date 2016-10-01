"use strict";

window.GameScreen = (function() {
  function GameScreen(mapData){
    Screen.call(this); // not actually needed until there are args :/
    this.level = new Level(mapData);
    this.levelContainer = new PIXI.Container();

    this.camera = {
      zoom: 100, // on-screen-pixels per tile
      x: this.level.player.pos.x,
      y: this.level.player.pos.y,
    };

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

    // Update camera
    var camera = this.camera;
    var player = this.level.player;
    // zooming in and out just to show that it works
    camera.zoom = 70 + Math.sin(this.level.time/3) * 15;
    var zoom = camera.zoom;
    // Move camera 90% towards player every second on each axis
    // TODO: deadzone?
    camera.x += (player.pos.x - camera.x)  * 0.90 * dt;
    camera.y += (player.pos.y - camera.y) * 0.90 * dt;

    //console.dir(camera)

    // Save level
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
    this.levelContainer.removeChildren();
    var zoom = this.camera.zoom;
    this.levelContainer.setTransform(-this.camera.x * zoom + window.innerWidth/2, -this.camera.y * zoom + window.innerHeight/2, zoom, zoom);

    this.level.render(this.levelContainer);
    stage.addChild(this.levelContainer);
    // UI rendering could happen here?
  };

  return GameScreen;
}());
