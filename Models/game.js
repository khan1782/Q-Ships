//Game Class and associated functions
function Game() {
 this.width = 1000;
 this.height = 1000;
 this.players = [];
}

Game.prototype.items = function() {
  var gameItems = [];
  for (var i = 0; i < this.players.length; i++) {
    gameItems.push(this.players[i].ship.snapshot())
    for (var j = 0; j < this.players[i].ship.pewBay.length; j++) {
      gameItems.push(this.players[i].ship.pewBay[j].snapshot())
    }
  }
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

Game.prototype.findPlayerIndex = function(uuid) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].uuid === uuid) {
      return i;
    }
  }
}

Game.prototype.addPlayer = function() {
  //ws connection created
  var noob = new Player();
  this.players.push(noob);
  return noob.uuid;
}

Game.prototype.removePlayer = function(uuid) {
  //when ws connection broken
  var quitter = this.findPlayerIndex(uuid);
  this.players.splice(quitter, 1);
}

Game.prototype.makeTheWorldMove = function() {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].ship.navigateTheStars();
    this.players[i].ship.move(this.width, this.height);
    for (var j = 0; j < this.players[i].ship.pewBay.length; j++) {
      this.players[i].ship.pewBay[j].move(this.width, this.height)
    }
  }
}

//game loop will run 50 fps and run new frame and checkers

Game.prototype.gameLoop = function() {
  self = this;
  setInterval(function(){
    self.makeTheWorldMove();
    self.checkers();
  },1000/50);
}

//will check for any pews that need to be removed
//will eventually check for any collisions
Game.prototype.checkers = function() {
  for(var i=0;i< this.players.length;i++){
    this.players[i].ship.removePew()
  };
  this.ouch()
  //add other checkers
};

// checking every collision
Game.prototype.ouch = function () {
  for (var i = 0; i < this.players.length; i++) {
    var currentShip = this.players[i].ship

    for (var j = 0; j < currentShip.pewBay.length; j++) {
      var currentPew = currentShip.pewBay[j]

      for(var l = 0; l < this.players.length; l++){
        var anotherShip  = this.players[l].ship

        if (currentPew.x > anotherShip.x -10 && currentPew.x < anotherShip.x + anotherShip.width + 10 && currentPew.y > anotherShip.y - 10 && currentPew.y < anotherShip.y +this.players[l].ship.height + 10){
          console.log("OUCHHHH!");
          debugger
        }
      }

    }
  }
  // currentPew.y - 10 < this.players[1].ship.y +this.players[1].ship.height && currentPew.y + 10 > this.players[1].ship.y
};

Game.prototype.updateEntity = function(package){
  var package = JSON.parse(package)
  if(package.keys){
    //TODO update w/ find by id
    this.players[0].ship.keys.up = package.keys.up;
    this.players[0].ship.keys.down = package.keys.down;
    this.players[0].ship.keys.left = package.keys.left;
    this.players[0].ship.keys.right = package.keys.right;
  }
  if(package.fire){
    console.log("PEWED");
    this.players[0].ship.sayPew()
  }
};
