/*global PIXI Tangible app Vector*/
"use strict";

window.Player = (function() {

  function Player(loc, level) {
    Tangible.call(this, loc, 1, 1, 1, level);

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

    //ground speed
    this.horizMoveForce = 25;
    
    //the hook object when it's working.
    //this.hook = new Hook(this, this.level);
    //level.tangibles.push(this.hook);
    
    //hook length when grappling
    this.hookLen = 2.5;
      
    this.maxLen = 2.5;
    
    //how far the hook will grapple
    this.hookMax = 12;
    
    this.hookPos = new Vector();
    
    //velocity
    this.vel = new Vector();
    
    //acceleration
    this.acc = new Vector();
    
    //is it grappling?
    this.grappling = false;
    
    //was mouse pressed down last frame? (for grappling)
    this.prevMouseDown = false;

    // This determines how long after jumping we'll care if the user is still pressing the up button
    this.jumpTimerMax = 0.5;
  }

  // Player is a subclass of Tangible
  Player.prototype = Object.create(Tangible.prototype);
  
  //do things
  Player.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);
    var leftHeld = app.input.isKeyDown('a');
    var rightHeld = app.input.isKeyDown('d');
    var upHeld = app.input.isKeyDown('w');
    var downHeld = app.input.isKeyDown('s');
    var acc = this.acc;
    var vel = this.vel;
    var grav = true;

    var lookDiff = this.pos.diff(this.level.mouseLoc);
    var headLookDiff = lookDiff.clone();
    this.img.scale.x = headLookDiff.x < 0 ? -1 : 1;
    headLookDiff.x = Math.abs(headLookDiff.x);
    var lookAngle = Math.min(1, Math.max(-1, headLookDiff.direction()));

    this.head.rotation = lookAngle;

    // slowdown percent per second
    // TODO: maybe split this into x and y directions, based on if you're against a wall or something
    var drag = 5;

    
    if(upHeld && this.onWall && !this.grappling) {
      if (this.jumpTimer < this.jumpTimerMax) {
        var jumpMult = 1 - this.jumpTimer / this.jumpTimerMax;
        jumpMult *= jumpMult * jumpMult;
        acc.y -= 250 * jumpMult;
        this.vel.x *= -4
      }
      this.jumpTimer += dt;
      
    }

    else if (upHeld && !this.grappling && !this.onWall) {
      if (this.jumpTimer < this.jumpTimerMax) {
        // this determines the relationship between the jump timer and how much the character
        // actually goes up
        var jumpMult = 1 - this.jumpTimer / this.jumpTimerMax;
        jumpMult *= jumpMult * jumpMult;
        
        console.log(acc.y);
        acc.y -= 250 * jumpMult;
        console.log(acc.y);

      }
      this.jumpTimer += dt;
    }

    else {
      this.jumpTimer = this.jumpTimerMax;
    }

    if (app.input.mouseMap[0] && this.level.primaryMouseClick && !this.prevMouseDown) {
      
      /*var tempVec = this.level.mouseLoc.diff(this.pos);
      tempVec.normalize();
      this.hook.fire(tempVec);*/
      
      var hit = this.level.firstTerrainHitInLine(this.pos, this.level.mouseLoc);
      if (hit && hit.diff(this.pos).magSqrd() <= this.hookMax * this.hookMax) {
        console.log("latched " + hit.x + ", " + hit.y)
        console.log(hit)
        this.grappling = true;
        grav = false;
        this.hookPos = hit;
        console.log("hitPos: " + this.hookPos.x + ", " + this.hookPos.y);
      } else {
        console.log("missed")
      }

    }

    if(this.grappling) {
    //if(this.hook.collided) {
      var testVec = (this.hookPos.diff(this.pos));
      //var testVec = (this.hook.pos.diff(this.pos));

      if(app.input.mouseMap[2]) {
        this.hookLen -= .1;
        //this.hook.len -= .1;
      }
        
      if(!app.input.mouseMap[2] && this.hookLen < this.maxLen) {
        this.hookLen += .1;
        //this.hook.len += .1;
      }

      if(testVec.magnitude() > this.hookLen) {
        acc.add(this.pos.diff(this.hookPos).multiply(60));
        //acc.add(this.pos.diff(this.hook.pos).multiply(60));
      }
    }

    if (!app.input.mouseMap[0]) {
      this.grappling = false;
      this.hookLen = this.maxLen;
      //this.hook.on = false;
      //this.hook.len = this.hook.maxLen;
    }

    if (rightHeld) {
      acc.x += this.horizMoveForce;
      // Else means right will always override. If we want whichever was hit last to win, we'd
      // have to update the inputManager somehow to account for key hit order or something
    } else if (leftHeld) {
      acc.x -= this.horizMoveForce;
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
      this.jumpTimer = 0;
    }

    if (terrain.type === 'spikes') {
      this.respawn();
    }

  };

  Player.prototype.respawn = function() {
    this.pos = this.level.spawnPoint.clone();
  };

  return Player;
}());