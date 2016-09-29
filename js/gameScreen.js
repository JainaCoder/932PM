"use strict";

window.GameScreen = (function() {
  function GameScreen(mapData){

    this.level = new Level(mapData);

  }


  // GameScreen is a subclass of Screen
  GameScreen.prototype = Object.create(Screen.prototype);

  GameScreen.prototype.update = function(dt) {
    this.level.update(dt);
  };

  GameScreen.prototype.render = function(stage) {
    this.level.render(stage);
    // UI rendering could happen here? Or maybe it should be in the level?
  };

  return GameScreen;
}());
