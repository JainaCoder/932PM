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

    this.horizMoveForce = 6;

    this.vel = new Vector();
    this.acc = new Vector();

    this.keyMap = {};

  }

  // Player is a subclass of Tangible
  Player.prototype = Object.create(Tangible.prototype);


  Player.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);
    var leftHeld = app.input.isKeyDown('A');
    var rightHeld = app.input.isKeyDown('D');
    var upHeld = app.input.isKeyDown('W');
    var downHeld = app.input.isKeyDown('S');
    var vel = this.vel;

    if (rightHeld) {
      vel.x += this.horizMoveForce * dt;
      // Else means right will always override. If we want whichever was hit last to win, we'd
      // have to update the inputManager somehow to account for key hit order or something
    } else if (leftHeld) {
      vel.x -= this.horizMoveForce * dt;
    }

    if (upHeld) {
      vel.y -= 20 * dt;
    }

    // TODO: move some of this logic to `Tangible`

    // slowdown percent per second
    var drag = 1.5;

    vel.multiply(1 - drag * dt);

    // gravity
    vel.y += 5.0 * dt;

    // clamp to max velocity
    if (vel.magSqrd() > this.maxVel * this.maxVel * dt * dt) {
      vel.normalize().multiply(this.maxVel * dt);
    }

    this.pos.add(vel);

    this.vel = new Vector();

  };

  // NOTE: this is used by `level` to determine if an entity should be removed from the level,
  // which may not be how we want to determine player death, so that should be handled elsewhere
  Player.prototype.alive = function(renderer) {
    return true;
  };

  return Player;
}());
