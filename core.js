
var palette = {
  primary: [
    '#4E1950', '#79457B', '#5F2C61', '#380A39', '#210023'
  ],
  secondary: [
    '#2E2154', '#5C4E82', '#423466', '#1C103C', '#0D0424'
  ],
  tertiary: [
    '#75252E', '#B5656E', '#8F414A', '#540F17', '#330006'
  ],
}

function init() {
  //Create the renderer
  var renderer = PIXI.autoDetectRenderer(256, 256);

  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  //Create a container object called the `stage`
  var stage = new PIXI.Container();

  //Tell the `renderer` to `render` the `stage`
  renderer.render(stage);
}
