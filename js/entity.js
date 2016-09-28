// Entity represents anything which has to update and has to be drawn

"use strict"

window.Entity = (function() {
  // if we ever add arguments to this constructor, we'll want to
  // update any subclasses and add `Entity.call(this, ...args)`
  // to their constructors. I think.
  function Entity(){  }

  // we can probably think of these as abstract functions.
  // if eventually we need them to have real functionality, we'll
  // want to make sure to add calls to them from all subclasses
  // The only time these functions should actually be called otherwise
  // is if we have a subclass which does not need to implement one of
  // them
  Entity.prototype.update = function(dt) { }
  Entity.prototype.render = function(stage) { }

  // subclasses can override this to signal when they should
  // be removed from the level
  Entity.prototype.alive = function(renderer) {
    return true
  }

  return Entity
}())
