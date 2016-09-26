"use strict"

window.Level = (function() {

  // width and height are in tiles
  function Level(width, height){
    this.entities = []
    // terrain is an array of arrays
    this.width = width
    this.height = height
    this.terrain = []
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain.push([])
      for (var y = 0; y < height; y++){
        var t = app.terrainEnums.AIR
        // edge tiles are solid
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          t = app.terrainEnums.SOLID
        }
        this.terrain[x][y] = t
      }
    }

    populateLevel.bind(this)()
  }

  function populateLevel(){
    for (var i = 0; i < 20; i++){
      this.entities.push(
        new DemoEntity(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        )
      )
    }
  }

  Level.prototype.onKeyUp = function(event) {

  }

  Level.prototype.onKeyDown = function(event) {

  }

  Level.prototype.update = function(dt) {
    var entities = this.entities
    for (var i = 0; i < entities.length; i++) {
      entities[i].update(dt)
      // if the entity is inactive, remove it
      if (!entities[i].alive()){
        entities.splice(i,1)
        i--
      }
    }
  }

  Level.prototype.render = function(stage) {
    for (var i = 0, l = this.entities.length; i < l; i++) {
      this.entities[i].render(stage)
    }
    // TODO: if we have a camera, we could cull the terrain off screen so it isn't
    // rendered. Might not want to do that though, and might not be needed
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        app.terrain.render(this.terrain[x][y], x, y, stage)
      }
    }
  }

  return Level
}())
