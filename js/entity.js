// Entity represents objects with a location, an image, and an update step

"use strict";

window.Entity = (function() {
  function Entity(xLoc, yLoc){
    this.img = new PIXI.Container();
    this.pos = new Vector(xLoc, yLoc);
  }

  // we can probably think of these as abstract functions.
  // if eventually we need them to have real functionality, we'll
  // want to make sure to add calls to them from all subclasses
  // The only time these functions should actually be called otherwise
  // is if we have a subclass which does not need to implement one of
  // them
  Entity.prototype.update = function(dt) { };
  Entity.prototype.render = function(stage) {
    this.img.position.x = this.pos.x;
    this.img.position.y = this.pos.y;
    stage.addChild(this.img);
  };

  // subclasses can override this to signal when they should
  // be removed from the level
  Entity.prototype.alive = function(renderer) {
    return true;
  };

  return Entity;
}());
