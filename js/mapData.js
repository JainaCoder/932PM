// Used for saving/loading, not meant for real-time game data

"use strict";

var mapDataValues = {
  air: 0,
  ground: 1,
  player: 2,
};

window.MapData = (function() {
  function MapData(width, height){
    this.width = width;
    this.height = height;
    this.terrain = [];
    for (var y = 0; y < height; i++){
      for (var x = 0; x < width; x++){
        this.terrain[x][y] = mapDataValues.air;
      }
    }
  }

  return MapData;
}());
