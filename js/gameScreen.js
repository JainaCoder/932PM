/*global PIXI Level app Vector*/
"use strict";

window.GameScreen = (function() {
  function GameScreen(mapData) {
    Screen.call(this); // not actually needed until there are args :/
    this.level = new Level(mapData);
    this.levelContainer = new PIXI.Container();

    this.camera = {
      zoom: 100, // on-screen-pixels per tile
      offset: this.level.player.pos.clone()
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
    app.input.registerMouseButtonUpListener(
      app.input.mouseButtons.MAIN,
      function(mouseEvent) {
        this.level.primaryMouseClick = this.convertCoords(new Vector(mouseEvent.offsetX, mouseEvent.offsetY));
      }.bind(this)
    );

    app.input.registerMouseButtonDownListener(
    app.input.mouseButtons.MAIN,
      function(mouseEvent) {
        this.level.primaryMouseClick = this.convertCoords(new Vector(mouseEvent.offsetX, mouseEvent.offsetY));
      }.bind(this)
    );

    console.log("gameScreen created");
  }


  // GameScreen is a subclass of Screen
  GameScreen.prototype = Object.create(Screen.prototype);

  GameScreen.prototype.convertCoords = function(coords) {
    return coords.add(this.camera.offset.scaled(this.camera.zoom))
      .addScalars(-window.innerWidth/2, -window.innerHeight/2)
      .multiply(1/this.camera.zoom)
    //  .addScalars(0.5, 0.5);
  };


  GameScreen.prototype.update = function(dt) {
    this.gameMouseLoc = this.convertCoords(app.input.mouseLoc.clone());
    this.level.update(app.debug ? 0 : dt, this.gameMouseLoc);

    // Update camera
    var camera = this.camera;
    var player = this.level.player;

    if (app.debug) {
      var leftHeld = app.input.isKeyDown('A');
      var rightHeld = app.input.isKeyDown('D');
      var upHeld = app.input.isKeyDown('W');
      var downHeld = app.input.isKeyDown('S');
      var zoomInHeld = app.input.isKeyDown('E');
      var zoomOutHeld = app.input.isKeyDown('Q');
      var scrollSpeed = 500 / camera.zoom * dt;
      if (leftHeld) {
        camera.offset.x -= scrollSpeed;
      } else if (rightHeld) {
        camera.offset.x += scrollSpeed;
      }
      if (upHeld) {
        camera.offset.y -= scrollSpeed;
      } else if (downHeld) {
        camera.offset.y += scrollSpeed;
      }
      if (zoomInHeld) {
        camera.zoom += 1.5 * dt * camera.zoom;
      } else if (zoomOutHeld) {
        camera.zoom -= 1.5 * dt * camera.zoom;
      }
    } else {
      var zoomGoal = Math.max(40, 60 - player.pos.diff(this.gameMouseLoc).magnitude() * 1);
      camera.zoom += (zoomGoal - camera.zoom) * 2.0 * dt;

      var currentX = player.pos.x;
      var camAllowance = window.innerWidth/camera.zoom / 6;
      var wallOffset = -(window.innerWidth*0.5 - app.input.mouseLoc.x)/camera.zoom;
      var leftWall = currentX - camAllowance + wallOffset;
      var rightWall = currentX + camAllowance + wallOffset;

      var goalOffset = new Vector(
        Math.min (rightWall, Math.max(camera.offset.x, leftWall)),
        Math.min (
          this.level.height - window.innerHeight/2/camera.zoom,
          Math.max(
            0 + window.innerHeight/2/camera.zoom,
            player.pos.y
          )
        )
      );

      camera.offset.add(camera.offset.diff(goalOffset).multiply(10.00 * dt));

    }

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
    this.levelContainer.setTransform(-this.camera.offset.x * zoom + window.innerWidth/2, -this.camera.offset.y * zoom + window.innerHeight/2, zoom, zoom);

    this.level.render(this.levelContainer);
    stage.addChild(this.levelContainer);

    // UI rendering could happen here?
  };

  return GameScreen;
}());
