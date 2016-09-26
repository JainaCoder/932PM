"use strict"

var app = app || {}


app.core = {
  // https://pixijs.github.io/docs/PIXI.WebGLRenderer.html
  renderer: null,

  // https://pixijs.github.io/docs/PIXI.Container.html
  // see `render` below for more
  stage: null,

  level: null,

  lastTime: 0, // Used to calculate delta time

  // TODO use bind() or something to clean up all these `app.core`s
  init: function () {
    console.log("init called " + app.core.level)
    //Create the renderer
    app.core.renderer = new PIXI.WebGLRenderer(256, 256)

    app.core.stage = new PIXI.Container()

    //Add the canvas to the HTML document
    document.body.appendChild(app.core.renderer.view)

    app.core.renderer.view.style.position = 'absolute'
    app.core.renderer.view.style.display = 'block'
    app.core.renderer.autoResize = true

    // TODO: resize when window resizes
    app.core.renderer.resize(window.innerWidth, window.innerHeight)

    app.core.renderer.backgroundColor = app.palette.primary[0]

    app.core.level = new Level(10, 7)

    app.core.lastTime = Date.now()
    app.core.gameLoop()
  },

  gameLoop: function () {
    //Loop this function at 60 frames per second
    requestAnimationFrame(app.core.gameLoop)

    // We're using a variable timestep, so we'll just
    // multiply all movement by the time since
    // the last frame. This is actually a pretty sloppy
    // way of doing things, since it's non-deterministic
    // and can easily break physics and stuff if the computer
    // freezes for a second, but it should be totally fine
    // for this project. If you're curious, this is a really
    // good article on fixed time step, though I don't think
    // we should bother with it for this game.
    // http://gafferongames.com/game-physics/fix-your-timestep/
    var now = Date.now()
    var dt = now - app.core.lastTime
    app.core.lastTime = now

    // Date.now() is in miliseconds, so convert to seconds
    app.core.update(dt/1000)

    app.core.render()

  },

  render: function(renderer) {
    // So right now how this works is that we have a PIXI.Container called
    // `stage` and each frame we're filling it with everything we want to
    // draw, and then calling renderer.render() a single time with it. This
    // is probbaly kinda inefficient, most examples keep everything in the
    // container at all times, instead of clearing it every frame. I think
    // that could be really obnixious to manage for anything other than
    // trivial demos, so I'm going for this more stateless implementation.
    // If it turns out to be too slow we can reconsider this approach. - Ben
    app.core.stage.removeChildren()
    app.core.level.render(app.core.stage)
    app.core.renderer.render(app.core.stage)
  },

  update: function(dt) {
    app.core.level.update(dt)
  }
}
