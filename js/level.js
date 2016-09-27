"use strict"

var app = app || {}

window.Level = (function() {

  // width and height are in tiles
  function Level(width, height){
    this.entities = []

    // container for use in `render()`
    this.container = new PIXI.Container()

    this.width = width
    this.height = height

    // on-screen-pixels per tile
    this.scale = 100

    this.matrix = new PIXI.Matrix()

    // terrain is an array of arrays
    this.terrain = []
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain.push([])
      for (var y = 0; y < height; y++){
        var t = null
        // edge tiles are solid
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          t = new TerrainTile(x, y, app.assets.ground.texture)
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
          Math.random() * this.width,
          Math.random() * this.height
        )
      )
    }
  }

  Level.prototype.onKeyUp = function(event) {

  }

  Level.prototype.onKeyDown = function(event) {

  }

  Level.prototype.onMouseUp = function(event) {
    // convert event coordinates to level coordinates
    // TODO
    this.entities.push(new DemoEntity(event.offsetX / this.scale, event.offsetY / this.scale))
  }

  Level.prototype.onMouseDown = function(event) {

  }

  Level.prototype.onMouseMove = function(event) {

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

  // we're putting all PIXI.DisplayObject's into a PIXI.Container so that we can apply
  // a matrix to all of them, seperate from any potential UI
  Level.prototype.render = function(stage) {
    var container = this.container
    container.removeChildren()

    for (var i = 0, l = this.entities.length; i < l; i++) {
      this.entities[i].render(container)
    }

    // TODO: cull offscreen?
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
      //  console.log("render at " + x + " " + y)
        if (this.terrain[x][y]){
          this.terrain[x][y].render(container)
        }
      }
    }
    container.setTransform(0,0,this.scale,this.scale)

    // TODO if this is by reference, this doesn't need to be set every frame. Investigate.
    // PIXI docs says its read-only
    this.matrix = container.localTransform
    stage.addChild(container)
  }

  return Level
}())
