"use strict"

var app = app || {}

// right now we're storing terrain in level just as enum values, so they cannot have their own
// individual state, which is probs fine

app.terrain = {

  // basicallly just an enum for level terrain
  types: {
    AIR: 0,
    SOLID: 1,
  },

  render: function(terrainEnum, xLoc, yLoc, stage) {
    switch(terrainEnum) {
    case app.terrain.types.AIR:
      return // we dont draw air :S
    case app.terrain.types.SOLID:
      var ground = app.assets.sprites.ground
      ground.x = xLoc
      ground.y = yLoc
      stage.addChild(ground)
      return
    }
  }

}
