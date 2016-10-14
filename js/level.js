/*global PIXI TerrainTile Player downloadJSON Vector*/
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

    this.levelBackground = new PIXI.Graphics();
    this.levelBackground.beginFill(app.palette.primary[0]);
    this.levelBackground.drawRect(-0.5, -0.5, this.width, this.height);
    this.levelBackground.endFill();

    this.intangibles = [];
    this.tangibles = [];

    this.spawnPoint = new Vector(4, height - 4);
    this.player = new Player(this.spawnPoint, this);
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
          t = new TerrainTile(x, y, mapData.terrain[x][y]);
        }
        this.terrain[x][y] = t;
      }
    }

    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        this.checkAdjacentTiles(x, y);
      }
    }

  }

  Level.prototype.updateAdjacentTiles = function(x, y) {
    this.checkAdjacentTiles(x-1, y-1);
    this.checkAdjacentTiles(x-1, y);
    this.checkAdjacentTiles(x-1, y+1);
    this.checkAdjacentTiles(x, y-1);
    this.checkAdjacentTiles(x, y);
    this.checkAdjacentTiles(x, y+1);
    this.checkAdjacentTiles(x+1, y-1);
    this.checkAdjacentTiles(x+1, y);
    this.checkAdjacentTiles(x+1, y+1);
  };

  Level.prototype.checkAdjacentTiles = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height || !this.terrain[x][y] || !this.terrain[x][y].isStandardTile()) return;
    var n = y === 0               || (this.terrain[x][y-1] && this.terrain[x][y-1].isStandardTile());
    var s = y === this.height - 1 || (this.terrain[x][y+1] && this.terrain[x][y+1].isStandardTile());
    var w = x === 0               || (this.terrain[x-1][y] && this.terrain[x-1][y].isStandardTile());
    var e = x === this.width - 1  || (this.terrain[x+1][y] && this.terrain[x+1][y].isStandardTile());
    var mult = Math.floor(Math.random() * 3);
    var tileImgId = (w ? 0 : 1) + (s ? 0 : 2) + (e ? 0 : 4) + (n ? 0 : 8);
    this.terrain[x][y].setSprite('tile'+(tileImgId+16*mult));
  };

  Level.prototype.increaseWidth = function() {
    var col = [];
    this.width++;
    this.terrain.push(col);
    for (var y = 0; y < this.height; y++) {
      col[y] = new TerrainTile(this.width-1, y);
      if (y !== 0 && y !== this.height - 1) {
        this.terrain[this.width-2][y] = null;
      }
    }
    for (y = 0; y < this.height; y++) {
      this.updateAdjacentTiles(this.width-2, y);
    }
    this.onSizeChange();
  };

  Level.prototype.increaseHeight = function() {
    this.height++;
    for (var x = 0; x < this.width; x++) {
      this.terrain[x].push(new TerrainTile(x, this.height-1));
      if (x !== 0 && x !== this.width - 1) {
        this.terrain[x][this.height-2] = null;
      }
    }
    for (x = 0; x < this.width; x++) {
      this.updateAdjacentTiles(x, this.height-2);
    }
    this.onSizeChange();
  };

  Level.prototype.decreaseWidth = function() {
    this.width--;
    this.terrain.pop();
    for (var y = 0; y < this.height; y++) {
      this.terrain[this.width-1][y] = new TerrainTile(this.width-1, y);
    }
    for (y = 0; y < this.height; y++) {
      this.updateAdjacentTiles(this.width-1, y);
    }
    this.onSizeChange();
  };

  Level.prototype.decreaseHeight = function() {
    this.height--;
    for (var x = 0; x < this.width; x++) {
      this.terrain[x].pop();
      this.terrain[x][this.height - 1] = new TerrainTile(x, this.height - 1);
    }
    for (x = 0; x < this.width; x++) {
      this.updateAdjacentTiles(x, this.height-1);
    }
    this.onSizeChange();
  };

  Level.prototype.toggleTile = function(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      if (this.terrain[x][y] === null) {
        this.terrain[x][y] = new TerrainTile(x, y);
      } else if (this.terrain[x][y].isStandardTile()) {
        this.terrain[x][y] = new TerrainTile(x, y, { type: 'spikes'});
      } else {
        this.terrain[x][y] = null;
      }
      this.updateAdjacentTiles(x,y);
    }
  };

  Level.prototype.onSizeChange = function() {
    this.levelBackground = new PIXI.Graphics();
    this.levelBackground.beginFill(app.palette.primary[0]);
    this.levelBackground.drawRect(-0.5, -0.5, this.width, this.height);
    this.levelBackground.endFill();
  };

  Level.prototype.update = function(dt, mouseLoc) {
    this.mouseLoc = mouseLoc;
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

    if (app.debug && !app.input.mouseMap[0] && this.primaryMouseClick) {
      this.primaryMouseClick.floor();
      var x = this.primaryMouseClick.x;
      var y = this.primaryMouseClick.y;
      this.toggleTile(x,y);
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
          if (ter) {
            var colVert = t1.testCollisionVert(x + ter.offsetX, y + ter.offsetY, ter.width, ter.height, t1.maxVel * dt);
            var colHoriz = t1.testCollisionHoriz(x + ter.offsetX, y + ter.offsetY, ter.width, ter.height, t1.maxVel * dt);
            if (colVert) {
              t1.onCollideTerrain(ter, x, y, true, false);
              ter.onCollide(t1, true);
              if (ter.solid) t1.pos.y += colVert;
            }
            if (colHoriz) {
              t1.onCollideTerrain(ter, x, y, false, true);
              ter.onCollide(t1, false);
              if (ter.solid) t1.pos.x += colHoriz;
            }
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

  /**
   * Finds the first terrain found in a line, and optionally its intersection point.
   * @param p1 the starting point of the search
   * @param p2 the end point of the search
   * @return a hit object containing the first hit object found, and, if findPoint is true, the intersection point. Returns null if no terrain was found.
   */
  Level.prototype.firstTerrainHitInLine = function(p1, p2) {
    var slope = (p2.y-p1.y)/(p2.x-p1.x);
    var intercept = p1.y-slope*p1.x;

    // hacky way of changing it from a line segment to practically a line
    p2 = p2.clone().subtract(p1).multiply(1000);

    var firstGridX = Math.floor(p2.x);
    var lastGridX = Math.floor(p1.x);
    // probs can simplify this
    var maxX = Math.max(0, Math.min( Math.max(firstGridX, lastGridX), this.width - 1));
    var minX = Math.max(0, Math.min( Math.min(firstGridX, lastGridX), this.width - 1));

    var goingRight = p2.x>p1.x;

    var t;

    var subP1 = new Vector();
    var subP2 = new Vector();


    if (goingRight) {

      if (minX === maxX) {
        t = this.checkColumn(minX, p1, p2);
      }else{
        subP2.x = (minX + 1);
        subP2.y = slope*(minX + 1) + intercept;
        t = this.checkColumn(minX, p1,subP2);
      }
      if (t !== null) return t;

      for(var gridX = minX + 1; gridX < maxX; gridX++) {

        subP1.x = gridX;
        subP1.y = slope*(gridX) + intercept;
        subP2.x = (gridX+1);
        subP2.y = slope*(gridX + 1) + intercept;
        t = this.checkColumn(gridX, subP1, subP2);
        if (t !== null) return t;

      }

      if (minX !== maxX) {
        subP1.x = maxX;
        subP1.y = slope*(maxX) + intercept;
        t = this.checkColumn(maxX, subP1, p2);
        if (t !== null) return t;
      }

    }else{

      if (minX === maxX) {
        t = this.checkColumn(maxX, p1, p2);
      }else{
        subP2.x = maxX;
        subP2.y = slope*(maxX) + intercept;
        t = this.checkColumn(maxX, p1, subP2);
      }

      if (t !== null) return t;

      for(var gridX = maxX - 1; gridX > minX; gridX--) {

        subP1.x = (gridX+1);
        subP1.y = slope*(gridX + 1) + intercept;
        subP2.x = gridX;
        subP2.y = slope*(gridX) + intercept;
        t = this.checkColumn(gridX, subP1, subP2);
        if (t !== null) return t;

      }

      if (minX !== maxX) {
        subP1.x = (minX + 1)-1;
        subP1.y = slope*(minX + 1) + intercept;
        subP2.x =  Math.max(0, p2.x);
        subP2.y = slope*(subP2.x) + intercept;
        t = this.checkColumn(minX, subP1, subP2);
        if (t !== null) return t;
      }

    }

    return null;
  };

  /**
    * Finds the first terrain in a line, and optionally its point of intersection
    * @param p1 the starting point of the search. Must be within gridX for valid results
    * @param p2 the end point of the search. Must be within gridX for valid results
    * @param findPoint if true, the intersection point will be found
    * @return a hit object containing the first hit object found, and, if findPoint is true, the intersection point. Returns null if no terrain was found.
    */
  Level.prototype.checkColumn = function(gridX, p1, p2) {

    var startY = Math.floor(p1.y);
    var endY = Math.floor(p2.y);
    var goingUp = p2.y>p1.y;
    var maxY = Math.min(Math.max(startY, endY), this.height-1);
    var minY = Math.max(Math.min(startY, endY), 0);
    var t;
    if (goingUp) {
      for (var gridY = minY; gridY <= maxY; gridY++) {
        t = this.terrain[gridX][gridY];
        if (t !== null && t.solid) {
          return new Vector(gridX, gridY);
          // var point = t.intersectionPoint(p1,p2);
          // if (point !== null) {
          //   return point;
          // }
        }
      }
    }else{
      for (var gridY = maxY; gridY >= minY; gridY--) {
        t = this.terrain[gridX][gridY];
        if (t !== null && t.solid) {
          // var point = t.intersectionPoint(p1,p2);
          // if (point !== null) {
          //   return point;
          // }
          return new Vector(gridX, gridY);
        }
      }
    }
    return null;
  };


  // we're putting all PIXI.DisplayObject's into a PIXI.Container so that we can apply
  // a matrix to all of them, seperate from any potential UI
  Level.prototype.render = function(stage) {

    stage.addChild(this.levelBackground);

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

    var graphics = new PIXI.Graphics();

    if(this.player.grappling) {
      graphics.beginFill(0x000000);
      graphics.lineStyle(0.1, 0x000000);

      graphics.moveTo(this.player.pos.x, this.player.pos.y);
      graphics.lineTo(this.player.hookPos.x, this.player.hookPos.y);
      graphics.endFill();
    }

    stage.addChild(graphics);

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
