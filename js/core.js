"use strict"

var app = app || {}

app.core = {
  // https://pixijs.github.io/docs/PIXI.WebGLRenderer.html
  renderer: null,

  // https://pixijs.github.io/docs/PIXI.Container.html
  // see `render` below for more
  stage: null,

  screen: null,


  lastTime: 0, // Used to calculate delta time

  // TODO use bind() or something to clean up all these `app.core`s
  init: function () {
    //Create the renderer
    var renderer = new PIXI.WebGLRenderer(256, 256)
    app.core.renderer = renderer


    app.core.mspfText = new PIXI.Text('[no mspf data yet]',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
    app.core.mspfText.x = 50
    app.core.mspfText.y = window.innerHeight - 50
    app.core.mspfTick = 0

    app.core.stage = new PIXI.Container()

    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view)

    renderer.view.style.position = 'absolute'
    renderer.view.style.display = 'block'
    renderer.autoResize = true

    // TODO: resize when window resizes
    renderer.resize(window.innerWidth, window.innerHeight)

    renderer.backgroundColor = app.palette.primary[0]

    app.core.screen = new LoadingScreen()
    // app.core.screen = new GameScreen(10, 7)

    document.addEventListener('keydown', function(event) {
      app.core.onKeyDown(event)
    }, false)

    document.addEventListener('keyup', function(event) {
      app.core.onKeyUp(event)
    }, false)

    // TODO convert event to x,y ?
    document.addEventListener('mousedown', function(event) {
      app.core.onMouseDown(event)
    }, false)

    document.addEventListener('mousemove', function(event) {
      app.core.onMouseMove(event)
    }, false)

    document.addEventListener('mouseup', function(event) {
      app.core.onMouseUp(event)
    }, false)

    app.core.lastTime = Date.now()
    app.core.gameLoop()
  },

  // in case we ever want to add onMount and onUnmount callbacks to screens, we should
  // do screen changes through here instead of doing it manually
  switchScreen: function (newScreen) {
    app.core.screen = newScreen
  },

  onKeyUp: function (event) {
    app.core.screen.onKeyUp(event)
  },

  onKeyDown: function (event) {
    app.core.screen.onKeyDown(event)
  },

  onMouseUp: function (event) {
    app.core.screen.onMouseUp(event)
  },

  onMouseDown: function (event) {
    app.core.screen.onMouseDown(event)
  },

  onMouseMove: function (event) {
    app.core.screen.onMouseMove(event)
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
    app.core.screen.render(app.core.stage)

    app.core.stage.addChild(app.core.mspfText)

    // this is when everything is actually rendered to the screen
    app.core.renderer.render(app.core.stage)
  },

  update: function(dt) {
    app.core.screen.update(dt)

    app.core.mspfTick += dt
    if (app.core.mspfTick > 1.0) {
      app.core.mspfTick = 0
      app.core.mspfText.text = dt + " mspf"
    }
  }
}
