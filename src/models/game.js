(function() {
  if (typeof require !== "undefined") {
    var Player = require("./player.js")
  }
  if (typeof require !== "undefined") {
    var Shrapnel = require("./shrapnel.js")
  }
  if (typeof require !== "undefined") {
    var Asteroid = require("./asteroid.js")
  }
  if (typeof require !== "undefined") {
    var Debris = require("./debris.js")
  }

  //Game Class and associated functions
  function Game() {
   this.width = 1000;
   this.height = 1000;
   this.players = [];
   this.shrapnel =[];
   this.asteroids = [];
   this.debris = [];

   for (var i = 0; i < 7; i++){
      var rock = new Asteroid();
      this.asteroids.push(rock);
   }
  }

  //Create collection of snapshots of all objects in game packaged for renderer.
  Game.prototype.items = function() {
    var gameItems = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].ship){
        if (this.players[i].state === 1 || this.players[i].state === 2) {
          gameItems.push(this.players[i].ship.snapshot());
        }
        for (var j = 0; j < this.players[i].ship.pewBay.length; j++) {
          gameItems.push(this.players[i].ship.pewBay[j].snapshot())
        }
      }

      for (var k = 0; k < this.shrapnel.length; k++) {
        gameItems.push(this.shrapnel[k].snapshot())
      }
    }

    for (var l = 0; l < this.asteroids.length; l++) {
      gameItems.push(this.asteroids[l].snapshot())
    }

    for (var m = 0; m < this.debris.length; m++) {
      gameItems.push(this.debris[m].snapshot())
    }
    return gameItems;
  }

  Game.prototype.snapshot = function(clientID) {
    gameAssets = []
    gameAssets.push({
      id: clientID,
      state: this.players[this.findPlayerIndex(clientID)].state,
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

  Game.prototype.addPlayer = function(uuid) {
    //ws connection created
    var noob = new Player(uuid);
    this.players.push(noob);
    return noob.uuid;
  }

  Game.prototype.removePlayer = function(uuid) {
    //when ws connection broken
    var quitter = this.findPlayerIndex(uuid);
    this.players.splice(quitter, 1);
  }

  //Master function to make all objects move (active and passive).
  Game.prototype.makeTheWorldMove = function() {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].state === 1 || this.players[i].state === 2) {
        this.players[i].ship.navigateTheStars();
        this.players[i].ship.move(this.width, this.height);
      }
      for (var j = 0; j < this.players[i].ship.pewBay.length; j++) {
        this.players[i].ship.pewBay[j].move(this.width, this.height)
        console.log(this.players[i].ship.hp)
      };
    }

    for(var k = 0; k < this.shrapnel.length; k++){
      this.shrapnel[k].move(this.width, this.height)
    };

    for(var l = 0; l < this.asteroids.length; l++){
      this.asteroids[l].move(this.width, this.height)
    };

    for(var l = 0; l < this.debris.length; l++){
      this.debris[l].move(this.width, this.height)
    };
  }

  //game loop will run 50 fps and run new frame and checkers
  Game.prototype.gameLoop = function() {
    var that = this;
    setInterval(function(){
      that.makeTheWorldMove();
      that.checkers();
    },1000/50);
  }


  //will check for any pews that need to be removed
  //will eventually check for any collisions
  Game.prototype.checkers = function() {

    // invoke ouch() to check for collisions and update objects
    this.ouch();

    //  remove all shrapnels & debris
    this.removeShrapnel();
    this.removeDebris();

    // go through each player...
    for (var i = 0; i < this.players.length; i++) {
      // collect all the pews that exploded...
      var explodingPews = this.players[i].ship.removePew();
      for (var j = 0; j < explodingPews.length; j++) {
        // invoke explodePew() to create shrapnels...
        this.explodePew(explodingPews[j]);
      }
      if (this.players[i].state === 2 && this.players[i].ship.hp < 1) {
        this.explodeShip(this.players[i].ship.x, this.players[i].ship.y);
        // reseting player state
        this.players[i].state = 0;
      }
    }

    for (var i = 0; i < this.asteroids.length; i++){
        if (this.asteroids[i].hp < 1) {
        this.explodeRock(this.asteroids[i].x, this.asteroids[i].y);
        this.asteroids[i].hp = 20;
      }
    }
  };

  Game.prototype.explodePew = function(coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;
    this.shrapnelMaker(8, x, y);
  }

  Game.prototype.explodeShip = function(x, y) {
    this.shrapnelMaker(40, x, y);
  }


  Game.prototype.shrapnelMaker = function(amount, x, y) {
    for (var i = 0; i < amount; i++) {
      this.shrapnel.push(new Shrapnel(x, y));
    }
  }

  Game.prototype.explodeRock = function(x, y) {
    this.debrisMaker(15, x, y);
  }

  Game.prototype.debrisMaker = function(amount, x, y) {
    for (var i = 0; i < amount; i++) {
      this.debris.push(new Debris(x, y));
    }
  }

  // collision detection for all objects
  Game.prototype.ouch = function() {
    allCollidableObjects = this.collidableObjects();

    for (var i = 0; i < allCollidableObjects.length; i++) {
      var ufo1 = allCollidableObjects[i];

      for (var j = i + 1; j < allCollidableObjects.length; j++) {
        var ufo2 = allCollidableObjects[j];
        if (this.isColliding(ufo1, ufo2)) {
          ufo1.hp -= 1;
          ufo2.hp -= 1;

          ufo1.dx *= (1/2);
          ufo1.dy *= (1/2);

          ufo2.dx *= (1/2);
          ufo2.dy *= (1/2);
        }
      }
    }
  }

  // collect every existing object with hp
  Game.prototype.collidableObjects = function() {
    var collidableObjects = [];

    // collect all the astroids
    for (var k = 0; k < this.asteroids.length; k++) {
      collidableObjects.push(this.asteroids[k]);
    }

    // collect all the spaceships and pews
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].state === 2) {
        collidableObjects.push(this.players[i].ship);
        for (var j = 0; j < this.players[i].ship.pewBay.length; j++) {
          collidableObjects.push(this.players[i].ship.pewBay[j]);
        }
      }
    }
    return collidableObjects;
  }

  // check whether two objects are colliding
  Game.prototype.isColliding = function(ufo1, ufo2){
    var xcenter = function(ufo) {
      return ufo.x + (ufo.width/2);
    }
    var ycenter = function(ufo) {
      return ufo.y + (ufo.height/2);
    }
    var totalBuffer = ufo1.hitBuffer + ufo2.hitBuffer
    if ( (Math.abs(xcenter(ufo1) - xcenter(ufo2)) <= totalBuffer) && (Math.abs(ycenter(ufo1) - ycenter(ufo2)) <= totalBuffer) ) {
      return true;
    } else {
      return false;
    }
  }

  Game.prototype.updateEntity = function(package){
    var package = JSON.parse(package)

    // find the index of the player
    var index = this.findPlayerIndex(package.uuid);
    if (this.players[index].state === 1 || this.players[index].state === 2) {
    // update that specific player's ship's movements
      if(package.keys){
        //TODO update w/ find by id
        this.players[index].ship.keys.up = package.keys.up;
        this.players[index].ship.keys.down = package.keys.down;
        this.players[index].ship.keys.left = package.keys.left;
        this.players[index].ship.keys.right = package.keys.right;
      }
    }
    // update that specific player's pew's movements
    if (this.players[index].state === 2) {
      if (package.fire) {
        this.players[index].ship.sayPew();
      }
    }
    if (this.players[index].state === 0) {
      if (package.start) {
        this.players[index].state = 1;
        this.players[index].spawn();
      }
    }
  };


  Game.prototype.removeShrapnel = function() {
    for(var j = 0; j < this.shrapnel.length; j++){
      if(this.shrapnel[j].isExpired === true){
        this.shrapnel.splice(j,1);
      }
    }
  };

  Game.prototype.removeDebris = function() {
    for(var j = 0; j < this.debris.length; j++){
      if(this.debris[j].isExpired === true){
        this.debris.splice(j,1);
      }
    }
  };

  if (typeof module !== "undefined") {
    module.exports = Game;
  } else {
    window.Game = Game;
  }
})()
