"use strict";

var app = app || {};

window.TerrainTile = (function() {
  function TerrainTile(xLoc, yLoc, texture){
    var sprite = new PIXI.Sprite(texture);
    this.sprite = sprite;
    sprite.width = 1;
    sprite.height = 1;
    // offset since sprite's origin is its upper left corner
    sprite.x = xLoc - sprite.width/2;
    sprite.y = yLoc - sprite.height/2;


     // NOTE: collision detection should check for this
    this.solid = true;
  }

  TerrainTile.prototype.render = function(stage) { stage.addChild(this.sprite); };

  TerrainTile.prototype.onCollide = function(tangible) {
    // called when a `Tangible` collides with this tile
  };

  return TerrainTile;
}());
