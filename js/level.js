"use strict"

window.Level = (function() {

  // width and height are in tiles
  function Level(width, height){
    this.entities = []
    // terrain is an array of arrays
    this.terrain = []
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain.push([])
      for (var y = 0; y < height; y++){
        var t = app.terrain.AIR
        // edge tiles are solid
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          t = app.terrain.SOLID
        }
        this.terrain[x][y] = t
      }
    }

    populateLevel.bind(this)()
  }

  function populateLevel(){
    for (var i = 0; i < 200; i++){
      this.entities.push(
        new DemoEntity(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        )
      )
    }
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
  }

  return Level
}())
