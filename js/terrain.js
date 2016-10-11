/*global PIXI */
"use strict";

var app = app || {};

window.TerrainTile = (function() {

  function TerrainTile(xLoc, yLoc, saveData) {
    this.x = xLoc;
    this.y = yLoc;
    if (saveData && saveData.type) {
      this.type = saveData.type;
    } else {
      this.type = 'tile';
    }

    var data = getTypeData(this.type);
    this.width = data.width;
    this.height = data.height;
    this.offsetX = data.offsetX;
    this.offsetY = data.offsetY;
    this.solid = data.solid;

    this.setSprite(data.tex);
  }

  function getTypeData(type) {
    switch(type) {
    default:
      console.log("erm, terrain doesn't recognize " + type);
    case 'tile':
      return {
        tex: 'tile0',
        width: 1,
        height: 1,
        offsetX: 0,
        offsetY: 0,
        solid: true,
      };
    case 'spikes':
      return {
        tex: 'spikesBottom',
        width: 1,
        height: 0.3,
        offsetX: 0,
        offsetY: 0.7,
        solid: false,
      };

    }
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
    return this.type === 'tile';
  };

  TerrainTile.prototype.render = function(stage) { stage.addChild(this.sprite); };

  TerrainTile.prototype.onCollide = function(tangible, verticalHit) {
    // called when a `Tangible` collides with this tile
  };

  TerrainTile.prototype.save = function() {
    return {
      type: this.type,
    };
  };

  return TerrainTile;
}());
