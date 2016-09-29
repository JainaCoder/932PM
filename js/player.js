"use strict";

window.Player = (function() {

  function Player(xLoc, yLoc, level){
    Tangible.call(this, xLoc, yLoc, 1, 1, 1, level);

    // woo, placeholder
    var body = new PIXI.Sprite(app.assets.ground.texture);
    this.body = body;
    body.width = this.width;
    body.height = this.height;
    // sprite coordinates are based off their upper left corner, so if we want their center
    // to be on the player's center, we have to move them up and to the left
    body.x = -body.width/2;
    body.y = -body.height/2;

    this.img.addChild(body);

    this.speed = 2;

    this.keyMap = {};

  }

  // Player is a subclass of Tangible
  Player.prototype = Object.create(Tangible.prototype);

  Player.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);
    var keyMap = app.input.keyMap;
    // TODO: magic numbers are probably not the way to go :/
    // Also this is shitty placeholder code to demonstrate input
    if (keyMap[65]) { // A
      this.pos.x -= this.speed * dt;
    } else if (keyMap[68]) { // D
      this.pos.x += this.speed * dt;
    }
    // NOTE: movement axes should not be independent! This is just set up as a shitty placeholder!
    if (keyMap[87]) { // W
      this.pos.y -= this.speed * dt;
    } else if (keyMap[83]) { // S
      this.pos.y += this.speed * dt;
    }
  };

  // NOTE: this is used by `level` to determine if an entity should be removed from the level,
  // which may not be how we want to determine player death, so that should be handled elsewhere
  Player.prototype.alive = function(renderer) {
    return true;
  };

  return Player;
}());
