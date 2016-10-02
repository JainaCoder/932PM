"use strict";

var app = app || {};

window.Level = (function() {

  // width and height are in tiles
  function Level(mapData) {

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

    // using this to track total time the level has been running
    this.time = 0;

    // terrain is an array of arrays
    this.terrain = [];
    // fill terrain with air
    for (var x = 0; x < width; x++) {
      this.terrain[x] = [];
      for (var y = 0; y < height; y++) {
        var t = null;
        if (mapData.terrain[x][y] !== null) {
          t = new TerrainTile(x, y, {texture: 'solid'});
        }
        this.terrain[x][y] = t;
      }
    }

  //  populateLevel.bind(this)();

  }


  function populateLevel() {
    for (var i = 0; i < 20; i++) {
      this.intangibles.push(
        new DemoEntity(
          this,
          Math.random() * this.width,
          Math.random() * this.height
        )
      );
    }
  }

  Level.prototype.increaseWidth = function() {
    var col = [];
    this.width++;
    this.terrain.push(col);
    for (var y = 0; y < this.height; y++) {
      col[y] = new TerrainTile(this.width-1, y, {texture: 'solid'});
      if (y !== 0 && y !== this.height - 1) {
        this.terrain[this.width-2][y] = null;
      }
    }
    console.log("level width increased to " + this.width);
  };

  Level.prototype.increaseHeight = function() {
    this.height++;
    for (var x = 0; x < this.width; x++) {
      this.terrain[x].push(new TerrainTile(x, this.height-1, {texture: 'solid'}));
      if (x !== 0 && x !== this.width - 1) {
        this.terrain[x][this.height-2] = null;
      }
    }
    console.log("level height increased to " + this.height);
  };

  Level.prototype.decreaseWidth = function() {
    this.width--;
    this.terrain.pop();
    for (var y = 0; y < this.height; y++) {
      this.terrain[this.width-1][y] = new TerrainTile(this.width-1, y, {texture: 'solid'});
    }
    console.log("level width decreased to " + this.width);
  };

  Level.prototype.decreaseHeight = function() {
    this.height--;
    for (var x = 0; x < this.width; x++) {
      this.terrain[x].pop();
      this.terrain[x][this.height - 1] = new TerrainTile(x, this.height - 1, {texture: 'solid'});
    }
    console.log("level height increased to " + this.height);
  };

  Level.prototype.update = function(dt) {

    // Using flags to do these instead of having the keyboard events directly resize
    // stuff so that it cant resize the level in the middle of a loop through it
    if (this.widthChangeFlag === 1) {
      this.widthChangeFlag = 0;
      this.increaseWidth();
    } else if (this.widthChangeFlag === -1) {
      this.widthChangeFlag = 0;
      this.decreaseWidth();
    }
    if (this.heightChangeFlag === 1) {
      this.heightChangeFlag = 0;
      this.increaseHeight();
    } else if (this.heightChangeFlag === -1) {
      this.heightChangeFlag = 0;
      this.decreaseHeight();
    }

    if (app.debug && this.primaryMouseClick) {
      this.primaryMouseClick.floor();
      var x = this.primaryMouseClick.x;
      var y = this.primaryMouseClick.y;
      console.log(x + ", " + y);
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        if (this.terrain[x][y] === null) {
          this.terrain[x][y] = new TerrainTile(x, y, {texture: 'solid'}); // TODO: ugh, Im using this everywhere, bad practice
        } else {
          this.terrain[x][y] = null;
        }
      }
      this.primaryMouseClick = null;
    }

    this.time += dt;


    tickThrough(this.tangibles, dt);
    tickThrough(this.intangibles, dt);

    // collision detection

    for (var i = 0, l = this.tangibles.length; i < l; i++) {
      var t1 = this.tangibles[i];
      for (var j = i + 1; j < l; j++) {
        var t2 = this.tangibles[j];

        var collision = t1.testCollision(t2.pos.x, t2.pos.y, t2.width, t2.height);
        if (collision) {
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

      for (var x = minGridX; x <= maxGridX; x++) {
        for (var y = minGridY; y <= maxGridY; y++) {
          var ter = this.terrain[x][y];
          if (ter && ter.solid) {
            var colVert = t1.testCollisionVert(x, y, 1, 1, t1.maxVel * dt);
            var colHoriz = t1.testCollisionHoriz(x, y, 1, 1, t1.maxVel * dt);
            if (colVert) {
              t1.onCollideTerrain(ter, x, y, true, false);
              ter.onCollide(t1, true);
              t1.pos.y += colVert;
            }
            if (colHoriz) {
              t1.onCollideTerrain(ter, x, y, false, true);
              ter.onCollide(t1, false);
              t1.pos.x += colHoriz;
            }

            //dectect both at once?
            /*t1.onCollideTerrain(ter, x, y, colVert, colHoriz);
            ter.onCollide(t1, true);
            t1.pos.y += colVert;
            t1.pos.x += colHoriz;*/
          }
        }
      }
    }
  };

  function tickThrough(entities, dt) {
    for (var i = 0; i < entities.length; i++) {
      entities[i].update(dt);
      // if the entity is inactive, remove it
      if (!entities[i].alive()) {
        entities.splice(i,1);
        i--;
      }
    }
  }

  // we're putting all PIXI.DisplayObject's into a PIXI.Container so that we can apply
  // a matrix to all of them, seperate from any potential UI
  Level.prototype.render = function(stage) {

    for (var i = 0, l = this.tangibles.length; i < l; i++) {
      this.tangibles[i].render(stage);
    }

    for (i = 0, l = this.intangibles.length; i < l; i++) {
      this.intangibles[i].render(stage);
    }

    // TODO: cull offscreen?
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        if (this.terrain[x][y]) {
          this.terrain[x][y].render(stage);
        }
      }
    }
    
    stage.addChild(new PIXI.Graphics())
    
    stage.addChild(stage);
  };


  Level.prototype.save = function() {
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
