/*global Entity Vector*/
// Tangible extends Entity and gives AABB

"use strict";

window.Tangible = (function() {
  function Tangible(loc, width, height, weight, level) {
    Entity.call(this, loc);
    this.width = width;
    this.height = height;
    this.level = level;
    // weight affects which tangible is pushed more in collision resolution
    this.weight = weight;
    this.maxVel = 20.0;
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
  Tangible.prototype.intersectsPoint = function(point) {
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
  Tangible.prototype.testCollision = function(otherX, otherY, otherWidth, otherHeight, vert, cornerCut) {
    var x = this.pos.x;
    var y = this.pos.y;
    var width = this.width;
    var height = this.height;

    if (vert !== undefined) {
      if (vert) {
        width -= cornerCut * 3;
      } else {
        height -= cornerCut * 3;
      }
    }

    // Check if there's a collision at all
    if (!(
      x - width/2 < otherX + otherWidth/2 &&
      x + width/2 > otherX - otherWidth/2 &&
      y - height / 2 < otherY + otherHeight/2 &&
      y + height / 2 > otherY - otherHeight / 2
    )) {
      return false;
    }

    var depthX = otherX + otherWidth / 2 - (x - width / 2); // From the right
    var depthX2 = x + width/2 - (otherX - otherWidth /2); // From the left

    var right = true;
    // find the more shallow
    if (Math.abs(depthX2) < Math.abs(depthX)) {
      right = false;
      depthX = depthX2;
    }

    var depthY = otherY + otherHeight / 2 - (y - height / 2); // Bottom
    var depthY2 = y + height / 2 - (otherY - otherHeight / 2); // Top

    var top = true;
    if (Math.abs(depthY2) < Math.abs(depthY)) {
      top = false;
      depthY = depthY2;
    }

    if (Math.abs(depthY) > Math.abs(depthX) || depthY === 0 ) {
        // Intersecting from the left or right
      return new Vector(right? depthX : -depthX, 0);
    } else if (Math.abs(depthX) > Math.abs(depthY) || depthX === 0) {
      // Intersectiong from top or bottom
      //  return new Vector2(bTop ? -fDepthY : fDepthY, 0.0f);
      return new Vector(0, top ? depthY : -depthY);
    }

    return null;
  };

  // TODO: document what are for (just ask if you need to know -ben)
  Tangible.prototype.testCollisionVert = function(otherX, otherY, otherWidth, otherHeight, cornerCut) {
    var x = this.pos.x;
    var y = this.pos.y;
    var width = this.width - cornerCut * 2.1;
    var height = this.height;

    // Check if there's a collision at all
    if (!(
      x - width/2 < otherX + otherWidth/2 &&
      x + width/2 > otherX - otherWidth/2 &&
      y - height / 2 < otherY + otherHeight/2 &&
      y + height / 2 > otherY - otherHeight / 2
    )) {
      return false;
    }

    var depthY = otherY + otherHeight / 2 - (y - height / 2); // Bottom
    var depthY2 = y + height / 2 - (otherY - otherHeight / 2); // Top

    return Math.abs(depthY2) < Math.abs(depthY) ? -depthY2 : depthY;

  };

  Tangible.prototype.testCollisionHoriz = function(otherX, otherY, otherWidth, otherHeight, cornerCut) {
    var x = this.pos.x;
    var y = this.pos.y;
    var width = this.width;
    var height = this.height - cornerCut * 2.1;

    // Check if there's a collision at all
    if (!(
      x - width/2 < otherX + otherWidth/2 &&
      x + width/2 > otherX - otherWidth/2 &&
      y - height / 2 < otherY + otherHeight/2 &&
      y + height / 2 > otherY - otherHeight / 2
    )) {
      return false;
    }

    var depthX = otherX + otherWidth / 2 - (x - width / 2); // From the right
    var depthX2 = x + width/2 - (otherX - otherWidth /2); // From the left

    return Math.abs(depthX2) < Math.abs(depthX) ? -depthX2 : depthX;

  };


  Tangible.prototype.onCollide = function(otherTangible) {
    // called when this tangible collides with another tangible
  };

  Tangible.prototype.onCollideTerrain = function(terrain, x, y, verticalHit) {
    // called when this tangible collides with terrain
  };

  return Tangible;
}());
