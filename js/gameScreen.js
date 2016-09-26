"use strict"

window.GameScreen = (function() {
  function GameScreen(width, height){
    this.level = new Level(width, height)
  }

  // GameScreen is a subclass of Screen
  GameScreen.prototype = Object.create(Screen.prototype)

  GameScreen.prototype.update = function(dt) {
    this.level.update(dt)
  }

  GameScreen.prototype.render = function(stage) {
    this.level.render(stage)

    stage.setTransform(0, 0, 1, 1) // TODO
  }

  GameScreen.prototype.onKeyUp = function(event) {
    this.level.onKeyUp(event)
  }

  GameScreen.prototype.onKeyDown = function(event) {
    this.level.onKeyDown(event)
  }

  Screen.prototype.onMouseUp = function(event) {
    this.level.entities.push(new DemoEntity(event.offsetX, event.offsetY))
  }

  Screen.prototype.onMouseDown = function(event) { }
  Screen.prototype.onMouseMove = function(event) { }

  return GameScreen
}())
