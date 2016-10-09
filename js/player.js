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
    this.hookPos = new Vector();
    this.prevMouseDown = false;

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
    var headLookDiff = lookDiff.clone();
    this.img.scale.x = headLookDiff.x < 0 ? -1 : 1;
    headLookDiff.x = Math.abs(headLookDiff.x);
    var lookAngle = Math.min(1, Math.max(-1, headLookDiff.direction()));

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

    if (app.input.mouseMap[0] && this.level.primaryMouseClick && !this.prevMouseDown) {

      var hit = this.level.firstTerrainHitInLine(this.pos, this.level.mouseLoc);
      if (hit) {
        console.log("latched " + hit.x + ", " + hit.y)
        console.log(hit)
        this.grappling = true;
        grav = false;
        this.hookPos = hit;
        console.log("hitPos: " + this.hookPos.x + ", " + this.hookPos.y);
      } else {
        console.log("missed")
      }

      // console.log(this.pos.x);
      // console.log(this.pos.y);




        /*if(this.level.terrain[x][y] !== null && this.level.terrain[x][y].solid) {
          this.grappling = true;
          grav = false;
          var grapVec = new Vector(Math.cos(lookAngle), Math.sin(lookAngle))
          acc.add(this.level.primaryMouseClick.clone().subtract(this.pos).multiply(15));
        }*/


    }

    if(this.grappling) {
      acc.add(this.pos.diff(this.hookPos).multiply(15));
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
    this.prevMouseDown = app.input.mouseMap[0];

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
