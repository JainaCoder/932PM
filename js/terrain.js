"use strict"

var app = app || {}

// basicallly just an enum for level terrain
app.terrainEnums = {
  AIR: 0,
  SOLID: 1,
}

// right now we're storing terrain in level just as enum values, so they cannot have their own
// individual state, which is probs fine

app.terrain = {

  render: function(terrainEnum, xLoc, yLoc, stage) {
    // TODO
  }


}
