//Game Class and associated functions
function Game() {
 this.width = 1000;
 this.height = 1000;
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

Game.prototype.addPlayer

Game.prototype.removePlayer