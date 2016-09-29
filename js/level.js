"use strict";

var app = app || {};

window.Level = (function() {

  // width and height are in tiles
  function Level(width, height){
    this.intangibles = [];
    this.tangibles = [];
    this.player = new Player(width/2, height/2, this);
    this.tangibles.push(this.player);

    // TODO: delete this, its just for testing
    var playerClone = new Player(width/2 + 2, height/2 + 2, this);
    playerClone.update = function(dt){
      var keyMap = app.input.keyMap;
      if (keyMap[37]) { // A
        this.img.position.x -= this.speed * dt;
      } else if (keyMap[39]) { // D
        this.img.position.x += this.speed * dt;
      }
      if (keyMap[38]) { // W
        this.img.position.y -= this.speed * dt;
      } else if (keyMap[40]) { // S
        this.img.position.y += this.speed * dt;
      }
    };

    this.tangibles.push(playerClone);

    // container for use in `render()`
    this.container = new PIXI.Container();

    this.width = width;
    this.height = height;

    // using this to track total time the level has been running
    this.time = 0;

    // on-screen-pixels per tile
    // NOTE: camera work is still in progress, expect this to change
    this.camera = {
      zoom: 100,
      x: this.player.getX(),
      y: this.player.getY(),
    };

    // terrain is an array of arrays
    this.terrain = [];
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain.push([]);
      for (var y = 0; y < height; y++){
        // empty tiles are null
        var t = null;
        // edge tiles are solid
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          t = new TerrainTile(x, y, app.assets.solid.texture);
        }
        this.terrain[x][y] = t;
      }
    }

    populateLevel.bind(this)();
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
    camera.x += (player.getX() - camera.x)  * 0.90 * dt;
    camera.y += (player.getY() - camera.y) * 0.90 * dt;

    tickThrough(this.tangibles, dt);
    tickThrough(this.intangibles, dt);

    // collision detection

    for (var i = 0, l = this.tangibles.length; i < l; i++){
      var t1 = this.tangibles[i];
      for (var j = i + 1; j < l; j++){
        var t2 = this.tangibles[j];

        var collision = t1.testCollision(t2);
        if (collision){
          t1.onCollide(t2);
          t2.onCollide(t1);
          t1.moveBy(collision);
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
      //  console.log("render at " + x + " " + y)
        if (this.terrain[x][y]){
          this.terrain[x][y].render(container);
        }
      }
    }

    // TODO this is totally wrong
    var zoom = this.camera.zoom;
    container.setTransform(-this.camera.x * zoom + window.innerWidth/2, -this.camera.y * zoom + window.innerHeight/2, zoom, zoom);

    // TODO if this is by reference, this doesn't need to be set every frame. Investigate.
    // PIXI docs says its read-only
    // Also, we arent actually doing anything with this yet.
    this.matrix = container.localTransform;
    stage.addChild(container);
  };

  return Level;
}());
