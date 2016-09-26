"use strict"

var app = app || {}

window.LoadingScreen = (function() {
  function LoadingScreen(){

    // documentation for the loader is pretty poor :(
    var loader = PIXI.loader

    // called once per file, regardless of if it loaded successfully
    //loader.on('progress', function(loader, resource){ })

    // called once per errored file
    loader.on('error', function(error, loader, resource){
      console.log("ERROR loading " + resource.name + " from " + resource.url)
    })

    // called once per loaded file
    loader.on('load', function(loader, resource){
      console.log("Loaded " + resource.name + " from " + resource.url)
    })

    // called once when all resources have loaded
    // this function could alternatively be passed to loader.load()
    loader.on('complete', function(loader, resources){
      console.log("loading complete. Resources: ")
      console.dir(resources)
      app.assets = {}
      app.assets.resources = resources
      formSprites()
      app.core.switchScreen(new GameScreen(10, 7))
    })

    queueAssets(loader)

    loader.load()

  }

  // NOTE: You don't have to add something here to make it load, you can just add your own call to
  // `loader.add()` in `queueAssets()`. This is just here for convenience.
  var textures = [
    'ground',
    'solid'
  ]

  function queueAssets(loader){

    // first arguement is the name the asset will have in the final `resources`
    // object, and does not have to match the filename
    // loader.add(name, path)

    // this loops through the above 'textures' array to load them, setting their name
    // as the same as their file name, and assuming all are under the `assets` directory
    // and are png
    for (var i = 0; i < textures.length; i++) {
      console.log("adding " + textures[i] + " to loading queue")
      loader.add(textures[i], 'assets/' + textures[i] + '.png')
    }

  }

  // called after assets have been loaded, use this to form sprites from the loaded textures
  // This may not be needed for every texture, but could be convenient for some
  function formSprites(){
    var resources = app.assets.resources
    var sprites = {}

    sprites.ground = new PIXI.Sprite(resources.ground.texture)
    sprites.ground.width = 1
    sprites.ground.height = 1

    app.assets.sprites = sprites
  }

  // GameScreen is a subclass of Screen
  LoadingScreen.prototype = Object.create(Screen.prototype)

  LoadingScreen.prototype.update = function(dt) {
  }

  LoadingScreen.prototype.render = function(stage) {
    // If loading was gonna take a while, we'd want to render some kinda loading icon or something
    // here, but loading is probs gonna be pretty much instant
  }

  return LoadingScreen
}())
