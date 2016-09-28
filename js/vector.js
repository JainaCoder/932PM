// 2D vector class object for further use in js.
// Assuming initial point is the origin
// for use only with translations
function Vector(x, y) {
    "use strict";
    //standard x and y coordinates.
    this.x = x;
    this.y = y;
    
    //Returns magnitude
    this.magnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    
    //Returns direction (in rads)
    this.direction = function() {
        return Math.atan((this.x / this.y));
    };
    
    //Add a vector to this one
    this.add = function(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
    };
    
    //Subtract a vector from this one
    this.subtract = function(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
    };
    
    //Multiply this vector by a scalar
    this.multiply = function(multInt) {
        this.x *= multInt;
        this.y *= multInt;
    };
    
    //Divide this vector by a scalar
    this.divide = function(divInt) {
        this.x /= divInt;
        this.y /= divInt;
        console.log(this.x + " " + this.y);
    };
    
    //dot product
    this.dot = function(dotVec) {
        return ((this.x * dotVec.x) + (this.y * dotVec.y));
    };
    
    //turn this vector into a unit vector
    this.normalize = function() {
        this.divScalar(this.magnitude());
    };
    
    //copy this vector
    this.clone = function() {
        return new Vector(this.x, this.y);
    };
    
    //return a unit vector with the same direction as this vector
    this.normal = function() {
        return this.clone.normalize();
    };

}