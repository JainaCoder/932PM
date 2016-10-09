/*global PIXI Tangible app Vector*/
"use strict";

window.Player = (function() {

  function Player(xLoc, yLoc, level) {
    Tangible.call(this, xLoc, yLoc, 1, 1, 1, level);

    // woo, placeholder
    var body = new PIXI.Sprite(app.assets.avatar_torso.texture);
    this.body = body;
    body.width = this.width;
    body.height = this.height;

    // sprite coordinates are based off their upper left corner, so if we want their center
    // to be on the player's center, we have to move them up and to the left
    body.x = -body.width/2;
    body.y = -body.height/2;

    this.img.addChild(body);

    var neck = new PIXI.Sprite(app.assets.avatar_neck.texture);
    this.neck = neck;
    neck.width = this.width;
    neck.height = this.height;
    neck.x = -neck.width/2;
    neck.y = -neck.height/1.9;
    this.img.addChild(neck);

    var head = new PIXI.Sprite(app.assets.avatar_head.texture);
    this.head = head;
    head.width = this.width;
    head.height = this.height;


    // sprite coordinates are based off their upper left corner, so if we want their center
    // to be on the player's center, we have to move them up and to the left
  //  head.x = -head.width/5;
    head.y = -head.height/4.5;

    head.pivot = new PIXI.Point(135, 80);

    this.img.addChild(head);


    this.horizMoveForce = 25;

    this.vel = new Vector();
    this.acc = new Vector();
    this.hookLen = 2;
    this.grappling = false;
    this.prevUpHeld = false;

    // This determines how long after jumping we'll care if the user is still pressing the up button
    this.jumpTimerMax = 0.5;

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
    var acc = this.acc;
    var vel = this.vel;
    var grav = true;

    var lookDiff = this.pos.diff(this.level.mouseLoc);
    this.img.scale.x = lookDiff.x < 0 ? -1 : 1;
    lookDiff.x = Math.abs(lookDiff.x);
    var lookAngle = Math.min(1, Math.max(-1, lookDiff.direction()));

    this.head.rotation = lookAngle;

    if (rightHeld) {
      acc.x += this.horizMoveForce;
      // Else means right will always override. If we want whichever was hit last to win, we'd
      // have to update the inputManager somehow to account for key hit order or something
    } else if (leftHeld) {
      acc.x -= this.horizMoveForce;
    }

    // slowdown percent per second
    // TODO: maybe split this into x and y directions, based on if you're against a wall or something
    var drag = 3;

    if(app.input.isKeyDown('W') && this.onWall && !this.grappling && !this.prevUpHeld) {
        var jumpMult = 1 - this.jumpTimer / this.jumpTimerMax;
        jumpMult *= jumpMult * jumpMult;

        console.log('in');
        this.acc.y -= 250 * jumpMult;
        this.vel.x *= -2
      }

    else if (upHeld && !this.grappling && !this.onWall) {
      if (this.jumpTimer < this.jumpTimerMax) {
        // this determines the relationship between the jump timer and how much the character
        // actually goes up
        var jumpMult = 1 - this.jumpTimer / this.jumpTimerMax;
        jumpMult *= jumpMult * jumpMult;

        acc.y -= 250 * jumpMult;
      }
      this.jumpTimer += dt;
    }

    else {
      this.jumpTimer = this.jumpTimerMax;
    }

    if (app.input.mouseMap[0] && this.level.primaryMouseClick) {
      var clone = this.level.primaryMouseClick.clone().floor();
      var x = clone.x;
      var y = clone.y;
      if (x >= 0 && x < this.level.width && y >= 0 && y < this.level.height) {

        for(var i = this.pos.x; i < this.level.width; i += Math.cos(lookAngle)) {
          for(var h = this.pos.y; h < this.level.height; h += Math.sin(lookAngle)) {
            var testI = Math.floor(i);
            var testH = Math.floor(h);


            if(this.level.terrain[testI][testH] !== null && this.level.terrain[testI][testH].solid) {
              this.grappling = true;
              grav = false;
              acc.add(this.level.mouseLoc.clone().subtract(this.pos).multiply(15));
              break;
            }
          }
        }

        /*if(this.level.terrain[x][y] !== null && this.level.terrain[x][y].solid) {
          this.grappling = true;
          grav = false;
          var grapVec = new Vector(Math.cos(lookAngle), Math.sin(lookAngle))
          acc.add(this.level.primaryMouseClick.clone().subtract(this.pos).multiply(15));
        }*/
      }


    }

    if (!app.input.mouseMap[0]) {
      this.grappling = false;
    }

    // TODO: move some of this logic to `Tangible`
    vel.multiply(1 - drag * dt);

    // gravity
    if(grav) {
      acc.y += app.core.GRAV;
    }

    vel.add(acc.scaled(dt));


    // clamp to max velocity
    if (vel.magSqrd() > this.maxVel * this.maxVel) {
      vel.normalize().multiply(this.maxVel);
    }

    this.pos.add(vel.scaled(dt));

    this.acc = new Vector();

    // these are determined each frame, these are the defaults, they are potentially
    // changed to true during collision detection
    this.onWall = false;
    this.prevUpHeld = upHeld;

  };

  // NOTE: this is used by `level` to determine if an entity should be removed from the level,
  // which may not be how we want to determine player death, so that should be handled elsewhere
  Player.prototype.alive = function() {
    return true;
  };

  Player.prototype.onCollideTerrain = function(terrain, x, y, verticalHit, horizontalHit) {
    if (verticalHit) {
      if (y > this.pos.y) {
        this.jumpTimer = 0;
        this.vel.y = 0;
      }

      if ( y < this.pos.y) {
        this.vel.y = 0;
      }

    }

    if (horizontalHit) {
      this.onWall = true;
    }

  };

  return Player;
}());
