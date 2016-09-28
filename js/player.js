"use strict";

window.Player = (function() {

  function Player(xLoc, yLoc){

    // woo, placeholder
    this.body = new PIXI.Sprite(app.assets.ground.texture);
    this.body.width = 1;
    this.body.height = 1;
    // sprite coordinates are based off their upper left corner, so if we want their center
    // to be on the player's center, we have to move them up and to the left
    this.body.x = -this.body.width/2;
    this.body.y = -this.body.height/2;

    // by putting everything in a container, the player image could have multiple parts and
    // we should be able to apply transformations to all of them at once
    // maybe we won't end up using that, and we can remove this (TODO)
    this.img = new PIXI.Container();
    this.img.addChild(this.body);


    this.img.position.x = xLoc;
    this.img.position.y = yLoc;

    this.speed = 2;

    this.keyMap = {};

  }

  // Player is a subclass of Entity
  Player.prototype = Object.create(Entity.prototype);

  Player.prototype.update = function(dt) {
    var keyMap = app.input.keyMap;
    // TODO: magic numbers are probably not the way to go :/
    // Also this is shitty placeholder code to demonstrate input
    if (keyMap[65]) { // A
      this.img.position.x -= this.speed * dt;
    } else if (keyMap[68]) { // D
      this.img.position.x += this.speed * dt;
    }
    // NOTE: movement axes should not be independent! This is just set up as a shitty placeholder!
    if (keyMap[87]) { // W
      this.img.position.y -= this.speed * dt;
    } else if (keyMap[83]) { // S
      this.img.position.y += this.speed * dt;
    }
  };

  Player.prototype.render = function(stage) {
    stage.addChild(this.img);
  };

  // NOTE: this is used by `level` to determine if an entity should be removed from the level,
  // which may not be how we want to determine player death, so that should be handled elsewhere
  Player.prototype.alive = function(renderer) {
    return true;
  };

  // TODO: should these be properties of all `Entity`s?
  Player.prototype.getX = function() {
    return this.img.position.x;
  };
  Player.prototype.getY = function() {
    return this.img.position.y;
  };

  return Player;
}());
