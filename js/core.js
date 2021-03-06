/*global PIXI LoadingScreen*/
"use strict";

var app = app || {};

app.core = {
  // https://pixijs.github.io/docs/PIXI.WebGLRenderer.html
  renderer: null,

  //gravity
  GRAV: 50.0,

  // https://pixijs.github.io/docs/PIXI.Container.html
  // see `render` below for more
  stage: null,

  screen: null,

  lastTime: 0, // Used to calculate delta time
  dt: 0,
  timeStep: 1/60,

  init: function() {
    app.input.registerListener();

    //Create the renderer
    var renderer = new PIXI.WebGLRenderer(256, 256);
    app.core.renderer = renderer;

    app.input.registerKeyUpListener(
      'h',
      function() { app.debug = !app.debug; console.log("toggle debug"); }
    );

    app.core.stage = new PIXI.Container();

    //Add the canvas to the HTML document
    document.body.appendChild(renderer.view);

    renderer.view.style.position = 'absolute';
    renderer.view.style.display = 'block';
    renderer.autoResize = true;

    // TODO: resize when window resizes
    renderer.resize(window.innerWidth, window.innerHeight);

    renderer.backgroundColor = '0xCD0000'; //app.palette.primary[0];

    app.core.screen = new LoadingScreen();

    app.core.lastTime = Date.now();
    app.core.gameLoop();
  },

  onLoad: function() {
    var debugLabel = new PIXI.Sprite(app.assets.debug.texture);
    app.core.debugLabel = debugLabel;
    debugLabel.scale = new PIXI.Point(20, 20);
    debugLabel.y = window.innerHeight - 150;
    debugLabel.x = 50;
  },

  // in case we ever want to add onMount and onUnmount callbacks to screens, we should
  // do screen changes through here instead of doing it manually
  switchScreen: function(newScreen) {
    app.core.screen = newScreen;
  },

  gameLoop: function() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(app.core.gameLoop);

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
    var now = Date.now();
    var delta = now - app.core.lastTime;
    app.core.lastTime = now;

    // Date.now() is in miliseconds, so convert to seconds
    delta /= 1000;

    app.core.dt += delta;

    while (app.core.dt > app.core.timeStep) {
      app.core.update(app.core.timeStep);
      app.core.dt -= app.core.timeStep;
    }

    app.core.render();

  },

  render: function() {
    // So right now how this works is that we have a PIXI.Container called
    // `stage` and each frame we're filling it with everything we want to
    // draw, and then calling renderer.render() a single time with it. This
    // is probbaly kinda inefficient, most examples keep everything in the
    // container at all times, instead of clearing it every frame. I think
    // that could be really obnixious to manage for anything other than
    // trivial demos, so I'm going for this more stateless implementation.
    // If it turns out to be too slow we can reconsider this approach. - Ben
    app.core.stage.removeChildren();
    app.core.screen.render(app.core.stage);

    if (app.debug) {
      app.core.stage.addChild(app.core.debugLabel);
    }

    // this is when everything is actually rendered to the screen
    app.core.renderer.render(app.core.stage);
  },

  update: function(dt) {
    app.core.screen.update(dt);
  }
};
