"use strict"

window.Level = (function() {

  function Level(){
    this.entities = []
    populateLevel.bind(this)()
  }

  function populateLevel(){
    console.log("populatin da level")
    for (var i = 0; i < 20; i++){
      this.entities.push(
        new DemoEntity(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        )
      )
    }
    console.log("level got dem " + this.entities.length + " entities")
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
