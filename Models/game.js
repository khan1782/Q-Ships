//Game Class and associated functions
var GAME_STATE = {
  start: 0,
  run: 1
}

function Game() {
 this.width = 1000;
 this.height = 1000;
 this.state = GAME_STATE.run;
 this.ship;
}

Game.prototype.items = function() {
  var gameItems = [];
  gameItems.push(this.ship);

  return gameItems;
}


Game.prototype.snapshot = function() {
  gameAssets = []
  gameAssets.push({
    width: this.width,
    height: this.height,
    state: this.state,
    items: this.items()
  })

  return JSON.stringify(gameAssets[0]);
}

