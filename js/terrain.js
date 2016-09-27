"use strict"

var app = app || {}

window.TerrainTile = (function() {
  function TerrainTile(xLoc, yLoc, texture){
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.x = xLoc
    this.sprite.y = yLoc
    this.sprite.width = 1
    this.sprite.height = 1

     // NOTE: collision detection should check for this
    this.solid = true
  }

  TerrainTile.prototype.render = function(stage) { stage.addChild(this.sprite) }

  return TerrainTile
}())
