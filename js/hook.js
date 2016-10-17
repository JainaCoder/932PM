"use strict";

window.Hook = (function() {
  
  function Hook(player, level) {
    Tangible.call(this, player.pos, 1, 1, 1, level);
    
    var body = new PIXI.Sprite(app.assets.hook.texture);
    this.body = body;
    this.body.width = this.width;
    this.body.height = this.height;
    
    this.player = player;
    
    this.pos = this.player.pos;
    
    body.x = -body.width/2;
    body.y = -body.height/2;
    
    this.img.addChild(body);
    
    this.player = player;
    
    this.maxVel = 30;
    
    //check if it should be drawn
    this.on = false;
    
    //check if it's colliding.
    this.collided = false;
    
    //velocity
    this.vel = new Vector();
    
    //acceleration
    this.acc = new Vector();
    
    //hook length when grappling
    this.len = 2.5;
      
    this.maxLen = 2.5;
    
    //how far the hook will grapple
    this.hookMax = 12;
    
  }
  
  Hook.prototype.fire = function(dir) {
    this.on = true;
    this.collided = false;
    
    this.pos = this.player.pos;
    
    this.acc = dir;
  }
  
  Hook.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);
    
    //is the player grappling?
    if(this.on) {
      
      //rotate body
      this.body.rotation = Math.min(1, Math.max(-1, this.pos.diff(this.player.pos).clone().direction()));

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
    
  }
  
  Hook.prototype.onCollideTerrain = function(terrain, x, y, verticalHit, horizontalHit) {
    this.collided = true;
    this.player.grappling = true;
  }
  
  Hook.prototype.alive = function() {
    return true;
  }
  
  return Hook;
}());