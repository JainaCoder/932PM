"use strict"

window.GameScreen = (function() {
  function GameScreen(width, height){
    console.log("GameScreen constructor called")
    this.level = new Level(width, height)
  }

  // GameScreen is a subclass of Screen
  GameScreen.prototype = Object.create(Screen.prototype)

  GameScreen.prototype.update = function(dt) {
    this.level.update(dt)
  }

  GameScreen.prototype.render = function(stage) {
    this.level.render(stage)
  }

  return GameScreen
}())
