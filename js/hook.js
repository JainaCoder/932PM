/*global PIXI Tangible Vector app */
"use strict";

window.Hook = (function() {

  function Hook(player, level) {
    Tangible.call(this, player.pos, 1, 1, .5, level);

    var body = new PIXI.Sprite(app.assets.hook.texture);
    body.pivot.set(body.width/2, body.height/2);

    this.body = body;
    this.body.width = this.width;
    this.body.height = this.height;

    this.player = player;

    this.pos = this.player.pos.clone();

    //this.body.pivot(body.width/2, body.height/2);

    body.x = -body.width/2;
    body.y = -body.height/4;

    this.img.addChild(body);

    this.player = player;

    this.maxVel = 1;

    this.type = "hook";

    //check if it should be drawn
    this.on = false;

    //check if it's colliding.
    this.collided = false;

    //velocity
    this.vel = new Vector();

    //acceleration
    this.acc = new Vector();

    this.firePos = new Vector();

    //hook length when grappling
    this.len = 2.5;

    this.maxLen = 2.5;

    //how far the hook will grapple
    this.hookMax = 12;
  }

  //hook is a subclass of tangible
  Hook.prototype = Object.create(Tangible.prototype);

  Hook.prototype.fire = function(pos) {
    this.on = true;
    this.collided = false;

    this.pos = this.player.pos.clone();
    console.log("fire");
    this.firePos = pos.clone();
  };

  Hook.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);

    if(!this.on) {
      this.pos = this.player.pos.clone();
    }

    //is the player grappling?
    if(this.on) {

      this.acc = this.player.pos.diff(this.firePos).normal();

      //rotate body
      this.body.rotation = Math.min(1, Math.max(-1, this.player.pos.diff(this.pos).clone().direction()));

      //has it hit anything?
      if(!this.collided) {
        //if not, move
        this.pos.add(this.acc.scaled(this.maxVel));

        //if too far from anything, stop moving and vanish.
        if(this.pos.diff(this.player.pos).magnitude() > this.hookMax) {
          this.on = false;
        }
      }

      //if it has hit something
      if(this.collided) {

      }
    }
  };

  Hook.prototype.onCollideTerrain = function(terrain, x, y, verticalHit, horizontalHit) {
    if(terrain.type !== "spikes" && this.on && !this.collided) {
      this.collided = true;
      this.pos.add(this.acc.scaled(this.maxVel/4));
    }
  };

  Hook.prototype.testCollision = function(otherX, otherY, otherWidth, otherHeight) {
    console.log("top");
    if(!this.on) {
      console.log("in");
      return false;
    }

    else {
      Tangible.prototype.testCollision.call(this, otherX, otherY, otherWidth, otherHeight);
    }
  };

  Hook.prototype.alive = function() {
    return true;
  };

  return Hook;
}());
