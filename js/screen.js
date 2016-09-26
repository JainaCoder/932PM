// We probably don't actually need this code, it'd only really be needed if all screens
// need to share some functionality. That said, it gives us a clear description of what
// other screens should look like

"use strict"

window.Screen = (function() {
  function Screen(){ }

  Screen.prototype.update = function(dt) { }
  Screen.prototype.render = function(stage) { }

  return Screen
}())
