/*global PIXI app loadJSON GameScreen*/
"use strict";

window.LoadingScreen = (function() {
  function LoadingScreen() {
    Screen.call(this); // not actually needed until there are args :/

    // documentation for the loader is pretty poor :(
    var loader = PIXI.loader;

    this.titleImg = PIXI.Sprite.fromImage("assets/TitleScreen.png");
    var scale = Math.min(window.innerWidth, window.innerHeight);
    this.titleImg.width = scale;
    this.titleImg.height = scale;
    this.titleImg.x = window.innerWidth/2 - scale/2;
    this.titleImg.y = window.innerHeight/2 - scale/2;

    // This makes textures load with their scale mode set to `nearest`
    // which means that when scaled, they will stay pixilated instead of turning blury
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

    // called once per file, regardless of if it loaded successfully
    //loader.on('progress', function(loader, resource){ })

    // called once per errored file
    loader.on('error', function(error, loader, resource) {
      console.log("ERROR loading " + resource.name + " from " + resource.url);
    });

    // called once per loaded file
    loader.on('load', function(loader, resource) {
      console.log("Loaded " + resource.name + " from " + resource.url);
    });

    // called once when all resources have loaded
    // this function could alternatively be passed to loader.load()
    loader.on('complete', function(loader, resources) {
      console.log("loading complete");
      app.assets = resources;
      app.core.onLoad();
      console.log("loading map");
      loadJSON("maps/this_is_a_map.json", function(response) {
        console.log("map data loaded");
        app.core.switchScreen(new GameScreen(JSON.parse(response)));
      });


    });

    queueAssets(loader);

    loader.load();

  }

  // NOTE: You don't have to add something here to make it load, you can just add your own call to
  // `loader.add()` in `queueAssets()`. This is just here for convenience.
  var textures = [
    'solid',
    'debug',
  ];

  function queueAssets(loader) {

    // first arguement is the name the asset will have in the final `resources`
    // object, and does not have to match the filename
    // loader.add(name, path)

    // so (if this was a real file) you'd get the texture from this at app.assets.dumbTextureThing.texture
    //loader.add('dumbTextureThing', 'assets/whatever.png');

    // this loops through the above 'textures' array to load them, setting their name
    // as the same as their file name, and assuming all are under the `assets` directory
    // and are png
    for (var i = 0; i < textures.length; i++) {
      loader.add(textures[i], 'assets/' + textures[i] + '.png');
    }

    // load tiles
    for (i = 0; i < 48; i++) {
      loader.add('tile'+i, "assets/tiles/" + i + ".png");
    }



    addAvatarItem(loader, 'head');
    addAvatarItem(loader, 'neck');
    addAvatarItem(loader, 'torso');

    loader.add('hookRope', 'assets/hook/Rope.png');
    loader.add('hook', 'assets/hook/Hook.png');

    loader.add('spikesBottom', 'assets/spikes/bottom.png');
    loader.add('deathWall', 'assets/deathWall/DeathWall.png');
    loader.add('instructions', 'assets/Controls.png');

    for (i = 1; i <= 6; i++) {
      loader.add('anim' + i, "assets/Animavatar" + i + ".png");
    }

  }

  function addAvatarItem(loader, name) {
    loader.add('avatar_' + name, "assets/avatar/" + name + ".png");
  }

  // GameScreen is a subclass of Screen
  LoadingScreen.prototype = Object.create(Screen.prototype);

  // TODO: if we never use this (or `render()`) we can safely remove them from here
  LoadingScreen.prototype.update = function(dt) {
  };

  LoadingScreen.prototype.render = function(stage) {
    // If loading was gonna take a while, we'd want to render some kinda loading icon or something
    // here, but loading is probs gonna be pretty much instant
    stage.addChild(this.titleImg);
  };

  return LoadingScreen;
}());
