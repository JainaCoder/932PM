// Entity represents objects with a location, an image, and an update step

"use strict";

window.Entity = (function() {
  function Entity(xLoc, yLoc){
    this.img = new PIXI.Container();
    this.img.position.x = xLoc;
    this.img.position.y = yLoc;
  }

  // we can probably think of these as abstract functions.
  // if eventually we need them to have real functionality, we'll
  // want to make sure to add calls to them from all subclasses
  // The only time these functions should actually be called otherwise
  // is if we have a subclass which does not need to implement one of
  // them
  Entity.prototype.update = function(dt) { };
  Entity.prototype.render = function(stage) {
    stage.addChild(this.img);
  };

  // subclasses can override this to signal when they should
  // be removed from the level
  Entity.prototype.alive = function(renderer) {
    return true;
  };

  Entity.prototype.getX = function() {
    return this.img.position.x;
  };
  Entity.prototype.getY = function() {
    return this.img.position.y;
  };

  Entity.prototype.getPos = function() {
    return new Vector(this.img.position.x, this.img.position.y);
  };

  Entity.prototype.setPos = function(pos) {
    this.img.position.x = pos.x;
    this.img.position.y = pos.y;
  };

  Entity.prototype.moveBy = function(displacement) {
    this.img.position.x += displacement.x;
    this.img.position.y += displacement.y;
  };

  return Entity;
}());
