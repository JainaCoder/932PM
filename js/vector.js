/*global PIXI*/
// 2D vector class object for further use in js.
// Assuming initial point is the origin
// for use only with translations

"use strict";

window.Vector = (function() {
  function Vector(x, y) {
    //standard x and y coordinates.
    this.x = x || 0;
    this.y = y || 0;
  }

  //Returns magnitude
  Vector.prototype.magnitude = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  Vector.prototype.magSqrd = function() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  };

  //Returns direction (in rads)
  Vector.prototype.direction = function() {
    return Math.atan2(this.y, this.x);
  };

  //Add a vector to this one
  Vector.prototype.add = function(otherVec) {
    this.x += otherVec.x;
    this.y += otherVec.y;
    return this;
  };

  Vector.prototype.addScalars = function(x, y) {
    this.x += x;
    this.y += y;
    return this;
  };

  //Subtract a vector from this one
  Vector.prototype.subtract = function(otherVec) {
    this.x -= otherVec.x;
    this.y -= otherVec.y;
    return this;
  };

  // returns the difference between this vector and another, or
  // the vector needed to get from this vector to another
  Vector.prototype.diff = function(otherVec) {
    return new Vector(otherVec.x - this.x, otherVec.y - this.y);
  };

  //Multiply this vector by a scalar
  Vector.prototype.multiply = function(mult) {
    this.x *= mult;
    this.y *= mult;
    return this;
  };

  //Return new vector scaled by a scalar  TODO: we cool with this name?
  Vector.prototype.scaled = function(mult) {
    return new Vector(this.x * mult, this.y * mult);
  };

  //Divide this vector by a scalar
  Vector.prototype.divide = function(div) {
    this.x /= div;
    this.y /= div;
    return this;
  };

  //dot product
  Vector.prototype.dot = function(dotVec) {
    return ((this.x * dotVec.x) + (this.y * dotVec.y));
  };

  //turn this vector into a unit vector
  Vector.prototype.normalize = function() {
    return this.divide(this.magnitude());
  };

  //copy this vector
  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  //return a unit vector with the same direction as this vector
  Vector.prototype.normal = function() {
    return this.clone().normalize();
  };

  //return a PIXI.Point with this vector's x and y
  Vector.prototype.toPixiPoint = function() {
    return new PIXI.Point(this.x, this.y);
  };

  Vector.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  };

  return Vector;
}());
