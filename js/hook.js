window.Hook = (function() {
  
  function Hook(player, level) {
    Tangible.call(this, player.pos, 1, 1, 1, level);
    
    var body = new PIXI.sprite(app.assets.hook.texture);
    this.body = body;
    body.width = this.width;
    body.height = this.height;
    
    body.x = -body.width/2;
    body.y = -body.height/2;
    
    this.img.addChild(body);
    
    this.player = player;
    
    //check if it should be drawn
    this.on = false;
    
    //check if it's colliding.
    this.collided = false;
    
    //velocity
    this.vel = new Vector();
    
    //acceleration
    this.acc = new Vector();
    
    //hook length when grappling
    this.hookLen = 2.5;
      
    this.maxLen = 2.5;
    
    //how far the hook will grapple
    this.hookMax = 12;
    
  }
  
  Hook.prototype.fire = function(dir) {
    this.on = true;
    
    this.pos = this.player.pos;
    
    this.acc = dir;
  }
  
  Hook.prototype.update = function(dt) {
    Tangible.prototype.update.call(this, dt);
    
    
  }

  
  return Hook;
}())