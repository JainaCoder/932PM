"use strict"

window.Player = (function() {
  function Player(xLoc, yLoc){

    // https://pixijs.github.io/docs/PIXI.Graphics.html

    this.body = new PIXI.Sprite(app.assets.ground.texture)

    this.img = new PIXI.Container()
    this.img.addChild(this.body)

    this.img.position.x = xLoc
    this.img.position.y = yLoc
    this.img.rotation = Math.random() * Math.PI * 2

    this.rotSpeed = Math.random() * Math.random() * 1.5 + 0.2
    this.speed = Math.random() * 1 + 0.1
    this.dir = Math.random() * Math.PI * 2

  }

  // Player is a subclass of Entity
  Player.prototype = Object.create(Entity.prototype)

  Player.prototype.update = function(dt) {
    this.img.rotation += this.rotSpeed * dt
    this.img.position.x += this.speed * dt * Math.cos(this.dir)
    this.img.position.y += this.speed * dt * Math.sin(this.dir)
  }

  Player.prototype.render = function(stage) {
    stage.addChild(this.img)
  }

  // NOTE: this is actually only called on stuff in the level.entities array, so we don't even
  // need it here, its never caled, I'm just leaving it for now
  Player.prototype.alive = function(renderer) {
    return true
  }

  return Player
}())
