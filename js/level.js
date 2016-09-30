"use strict";

var app = app || {};

window.Level = (function() {

  // width and height are in tiles
  function Level(mapData){

    console.log("creating level");
    console.dir(mapData);

    var height = mapData.height;
    var width = mapData.width;
    this.width = width;
    this.height = height;

    this.intangibles = [];
    this.tangibles = [];
    this.player = new Player(4, height/2, this);
    this.tangibles.push(this.player);

    // TODO: delete this, its just for testing
    var playerClone = new Player(width/2 + 2, height/2 + 2, this);
    playerClone.update = function(dt){
      var keyMap = app.input.keyMap;
      if (keyMap[37]) { // left arrow
        this.pos.x -= this.speed * dt;
      } else if (keyMap[39]) { // right arrow
        this.pos.x += this.speed * dt;
      }
      if (keyMap[38]) { // up arrow
        this.pos.y -= this.speed * dt;
      } else if (keyMap[40]) { // down arrow
        this.pos.y += this.speed * dt;
      }
    };

    this.tangibles.push(playerClone);

    // container for use in `render()`
    this.container = new PIXI.Container();

    // using this to track total time the level has been running
    this.time = 0;

    this.camera = {
      zoom: 100, // on-screen-pixels per tile
      x: this.player.pos.x,
      y: this.player.pos.y,
    };

    // terrain is an array of arrays
    this.terrain = [];
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain[x] = [];
      for (var y = 0; y < height; y++){
        var t = null;
        if (mapData.terrain[x][y] !== null) {
          t = new TerrainTile(x, y, {texture: 'solid'});
        }
        this.terrain[x][y] = t;
      }
    }

  //  populateLevel.bind(this)();
  }


  function populateLevel(){
    for (var i = 0; i < 20; i++){
      this.intangibles.push(
        new DemoEntity(
          this,
          Math.random() * this.width,
          Math.random() * this.height
        )
      );
    }
  }

  Level.prototype.update = function(dt) {
    this.time += dt;

    // Update camera
    var camera = this.camera;
    var player = this.player;
    // zooming in and out just to show that it works
    camera.zoom = 70 + Math.sin(this.time/3) * 15;
    var zoom = camera.zoom;
    // Move camera 90% towards player every second on each axis
    // TODO: deadzone?
    camera.x += (player.pos.x - camera.x)  * 0.90 * dt;
    camera.y += (player.pos.y - camera.y) * 0.90 * dt;

    tickThrough(this.tangibles, dt);
    tickThrough(this.intangibles, dt);

    // collision detection

    for (var i = 0, l = this.tangibles.length; i < l; i++){
      var t1 = this.tangibles[i];
      for (var j = i + 1; j < l; j++){
        var t2 = this.tangibles[j];

        var collision = t1.testCollision(t2.pos.x, t2.pos.y, t2.width, t2.height);
        if (collision){
          t1.onCollide(t2);
          t2.onCollide(t1);
          var w1 = t1.weight;
          var w2 = t2.weight;
          t1.pos.add(collision.scaled(w2/(w1 + w2)));
          t2.pos.add(collision.scaled(-w1/(w1 + w2)));
        }
      }

      var x1 = t1.pos.x;
      var y1 = t1.pos.y;

      // against terrain
      var minGridX = Math.max(0, Math.floor(x1 - t1.width/2 + 0.5));
      var minGridY = Math.max(0, Math.floor(y1 - t1.height/2 + 0.5));
      var maxGridX = Math.min(this.width - 1, Math.floor(x1 + t1.width/2 + 0.5));
      var maxGridY = Math.min(this.height -1, Math.floor(y1 + t1.height/2 + 0.5));

      for (var x = minGridX; x <= maxGridX; x++){
        for (var y = minGridY; y <= maxGridY; y++){
          var ter = this.terrain[x][y];
          if (ter && ter.solid){
            // TODO: WIP
            var colVert = t1.testCollisionVert(x, y, 1, 1, t1.maxVel * dt);
            var colHoriz = t1.testCollisionHoriz(x, y, 1, 1, t1.maxVel * dt);
            if (colHoriz || colVert)
            if (colVert){
              t1.onCollideTerrain(ter, true);
              ter.onCollide(t1, true);
              t1.pos.y += colVert;
            }
            if (colHoriz){
              t1.onCollideTerrain(ter, false);
              ter.onCollide(t1, false);
              t1.pos.x += colHoriz;
            }
          }
        }
      }
    }
  };

  function tickThrough(entities, dt){
    for (var i = 0; i < entities.length; i++) {
      entities[i].update(dt);
      // if the entity is inactive, remove it
      if (!entities[i].alive()){
        entities.splice(i,1);
        i--;
      }
    }
  }

  // we're putting all PIXI.DisplayObject's into a PIXI.Container so that we can apply
  // a matrix to all of them, seperate from any potential UI
  Level.prototype.render = function(stage) {
    var container = this.container;
    container.removeChildren();

    for (var i = 0, l = this.tangibles.length; i < l; i++) {
      this.tangibles[i].render(container);
    }

    for (i = 0, l = this.intangibles.length; i < l; i++) {
      this.intangibles[i].render(container);
    }

    // TODO: cull offscreen?
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.terrain[x][y]){
          this.terrain[x][y].render(container);
        }
      }
    }

    // TODO: camera tracking should probably happen in GameScreen, not Level
    var zoom = this.camera.zoom;
    container.setTransform(-this.camera.x * zoom + window.innerWidth/2, -this.camera.y * zoom + window.innerHeight/2, zoom, zoom);

    stage.addChild(container);
  };

  Level.prototype.save = function(){
    console.log("Saving level");
    var data = {
      width: this.width,
      height: this.height,
    };
    data.terrain = [];
    for (var x = 0; x < this.width; x++) {
      data.terrain[x] = [];
      for (var y = 0; y < this.height; y++) {
        data.terrain[x][y] = this.terrain[x][y] === null ? null : this.terrain[x][y].save();
      }
    }

    console.dir(data);

    downloadJSON(data, "save_" + Date.now() + ".json");
  };

  return Level;
}());
