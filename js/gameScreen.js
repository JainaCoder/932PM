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
    // UI rendering could happen here? Or maybe it should be in the level?
  }

  GameScreen.prototype.onKeyUp = function(event) {
    this.level.onKeyUp(event)
  }

  GameScreen.prototype.onKeyDown = function(event) {
    this.level.onKeyDown(event)
  }

  Screen.prototype.onMouseUp = function(event) {
    this.level.onMouseUp(event)
  }

  Screen.prototype.onMouseDown = function(event) {
    this.level.onMouseDown(event)
  }
  Screen.prototype.onMouseMove = function(event) {
    this.level.onMouseMove(event)
  }

  return GameScreen
}())
