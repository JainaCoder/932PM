// put vars used in other scripts here to inform eslint they are exported
/* exported palette init */
/* global PIXI */

var palette = {
  //          0           1          2          3          4
  primary:   [ 0x4E1950, 0x79457B, 0x5F2C61, 0x380A39, 0x210023],
  secondary: [ 0x2E2154, 0x5C4E82, 0x423466, 0x1C103C, 0x0D0424],
  tertiary:  [ 0x75252E, 0xB5656E, 0x8F414A, 0x540F17, 0x330006],
}

var renderer

// used for calculating elapsed time
var lastTime;

var stage

function init() {
  //Create the renderer
  renderer = PIXI.autoDetectRenderer(256, 256)

  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view)

  renderer.view.style.position = 'absolute'
  renderer.view.style.display = 'block'
  renderer.autoResize = true
  // TODO: resize when window resizes
  renderer.resize(window.innerWidth, window.innerHeight)

  renderer.backgroundColor = palette.primary[0]

  //Create a container object called the `stage`
  stage = new PIXI.Container()

  lastTime = Date.now()
  gameLoop()
}

function gameLoop() {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop)

  var now = Date.now()
  var dt = now - lastTime
  lastTime = now

  //Update the current game state:
  update(dt)

  //Render the stage to see the animation
  renderer.render(stage)
}

function update(dt) {
  // Do cool stuff here!
}
