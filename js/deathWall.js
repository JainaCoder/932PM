/*global Entity Vector PIXI app*/
// Tangible extends Entity and gives AABB

"use strict";

window.DeathWall = (function() {
  function DeathWall(level) {
    Entity.call(this, new Vector(0,0));

    this.height = level.height;
    this.width = this.height;
    this.level = level;
    this.timer = 0;

    var wall = new PIXI.Sprite(app.assets.deathWall.texture);
    wall.width = this.width;
    wall.height = this.height;

    // sprite coordinates are based off their upper left corner, so if we want their center
    // to be on the player's center, we have to move them up and to the left
    // wall.x = -wall.width/2;
    //this.pos.y = -wall.width;
    this.pos.x = -wall.width;

    this.img.addChild(wall);

  }

  // Deathwall is a subclass of Entity
  DeathWall.prototype = Object.create(Entity.prototype);

  DeathWall.prototype.update = function(dt) {
    Entity.prototype.update.call(this, dt);
    this.timer += dt;
    this.pos.x += (Math.sin(this.timer) + 0.5) * 0.7 * dt;
    var player = this.level.player;
    if (player.pos.x < this.pos.x + this.width * 0.9) {
      player.respawn();
    }
  };

  return DeathWall;
}());
