// Tangible extends Entity and gives AABB

"use strict";

window.Tangible = (function() {
  function Tangible(xLoc, yLoc, width, height, level){
    Entity.call(this, xLoc, yLoc);
    this.width = width;
    this.height = height;
    this.level = level;
    if (width === undefined) {
      console.log("error: no width passed to Tangible");
    }
    if (height === undefined) {
      console.log("error: no height passed to Tangible");
    }
    // So technically we could get level from app.core.screen.level, but that'd be really bad
    // practice, and decoupling this from the screens is the way to go
    if (level === undefined) {
      console.log("error: no level passed to Tangible");
    }
  }

  // Tangible is a subclass of Entity
  Tangible.prototype = Object.create(Entity.prototype);

  // Returns true if the given point is within the bounds of this Tangible
  Tangible.prototype.intersectsPoint = function(point){
    var x = this.getX();
    var y = this.getY();
    return (point.x >= x - this.width / 2 &&
        point.x <= x + this.width / 2 &&
        point.y >= y - this.height / 2 &&
        point.y <= y + this.height / 2);
  };


  Tangible.prototype.update = function(dt) {
    Entity.prototype.update.call(this, dt);


  };

  // copied this code over from the game I made first year in C#
  Tangible.prototype.testCollision = function(otherTangible){
    var x = this.getX();
    var y = this.getY();
    var otherX = otherTangible.getX();
    var otherY = otherTangible.getY();
    var width = this.width;
    var height = this.height;
    var otherWidth = otherTangible.width;
    var otherHeight = otherTangible.height;

    // Check if there's a collision at all
    if (!(
      x - width/2 < otherX + otherWidth/2 &&
      x + width/2 > otherX - otherWidth/2 &&
      y - height / 2 < otherY + otherHeight/2 &&
      y + height / 2 > otherY - otherHeight / 2
    )){
      return false;
    }

    var depthX = otherX + otherWidth / 2 - (x - width / 2); // From the right
    var depthX2 = x + width/2 - (otherX - otherWidth /2); // From the left

    var right = true;
    if (Math.abs(depthX2) < Math.abs(depthX))
    {
      right = false;
      depthX = depthX2;
    }

    var depthY = otherY + otherHeight / 2 - (y - height / 2); // Bottom
    var depthY2 = y + height / 2 - (otherY - otherHeight / 2); // Top

    var top = true;
    if (Math.abs(depthY2) < Math.abs(depthY))
    {
      top = false;
      depthY = depthY2;
    }

    if (Math.abs(depthY) > Math.abs(depthX) || depthY == 0 )
    {
        // Intersecting from the left or right
      return new Vector(right? depthX : -depthX, 0);
    }
    else if (Math.abs(depthX) > Math.abs(depthY) || depthX == 0)
    {
        // Intersectiong from top or bottom
      //  return new Vector2(bTop ? -fDepthY : fDepthY, 0.0f);
      return new Vector(0, top ? depthY : -depthY);
    }

    return null;
  };


  Tangible.prototype.onCollide = function(otherTangible) {
    // called when this tangible collides with another tangible
  };

  return Tangible;
}());
