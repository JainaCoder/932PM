"use strict"

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
      console.log("loading complete")
      app.core.switchScreen(new GameScreen(10, 7))
    })

    queueAssets(loader)

    loader.load()

  }

  function queueAssets(loader){

    // first arguement is the name the asset will have in the final `resources`
    // object, and is not related to the filename
    loader.add('ground', 'assets/ground.png')
    loader.add('solid', 'assets/solid.png')

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
