/*global PIXI */
"use strict";

var app = app || {};

window.TerrainTile = (function() {

  function TerrainTile(xLoc, yLoc, data) {
    this.x = xLoc;
    this.y = yLoc;
    var tex;
    if (data) {
      this.textureSource = data.texture;
      tex = data.texture;
      // NOTE: collision detection should check for this
      this.solid = data.solid || data.solid === undefined; //defaults to true
    } else {
      tex = 'tile0';
      this.solid = true;
    }
    this.setSprite(tex);
  }

  TerrainTile.prototype.setSprite = function(textureName) {
    var sprite = new PIXI.Sprite(app.assets[textureName].texture);
    this.sprite = sprite;

    sprite.width = 1;
    sprite.height = 1;
    // offset since sprite's origin is its upper left corner
    sprite.x = this.x - sprite.width/2;
    sprite.y = this.y - sprite.height/2;
  };

  TerrainTile.prototype.isStandardTile = function() {
    return this.textureSource === undefined;
  };

  TerrainTile.prototype.render = function(stage) { stage.addChild(this.sprite); };

  TerrainTile.prototype.onCollide = function(tangible, verticalHit) {
    // called when a `Tangible` collides with this tile
  };

  TerrainTile.prototype.save = function() {
    return {
      texture: this.textureSource,
      solid: this.solid,
    };
  };

  return TerrainTile;
}());
