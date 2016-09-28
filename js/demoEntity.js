"use strict";

window.DemoEntity = (function() {
  function DemoEntity(level, xLoc, yLoc){

    this.level = level;

    // https://pixijs.github.io/docs/PIXI.Graphics.html
    var graphics = new PIXI.Graphics();
    this.points = Math.floor(Math.random() * 5) + 3;
    this.radius = Math.random() * 1 + 0.2;

    graphics.beginFill(app.palette.tertiary[Math.floor(Math.random() * app.palette.tertiary.length)]);
    graphics.moveTo(this.radius, 0);
    for (var i = 0; i < this.points; i++){
      var theta = Math.PI * 2 / this.points * i;
      graphics.lineTo(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius);
    }
    graphics.endFill();

    this.img = new PIXI.Container();
    this.img.addChild(graphics);

    this.img.position.x = xLoc;
    this.img.position.y = yLoc;
    this.img.rotation = Math.random() * Math.PI * 2;

    this.rotSpeed = Math.random() * Math.random() * 1.5 + 0.2;
    this.speed = Math.random() * 1 + 0.1;
    this.dir = Math.random() * Math.PI * 2;

  }

  // DemoEntity is a subclass of Entity
  DemoEntity.prototype = Object.create(Entity.prototype);

  DemoEntity.prototype.update = function(dt) {
    this.img.rotation += this.rotSpeed * dt;
    this.img.position.x += this.speed * dt * Math.cos(this.dir);
    this.img.position.y += this.speed * dt * Math.sin(this.dir);
  };

  DemoEntity.prototype.render = function(stage) {
    stage.addChild(this.img);
  };

  Entity.prototype.alive = function(renderer) {
    var position = this.img.position;
    var radius = this.radius;
    return position.x > -radius && position.x < this.level.width + radius &&
      position.y > -radius && position.y <this.level.height + radius;
  };

  return DemoEntity;
}());
