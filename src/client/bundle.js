(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Game = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Asteroid(){
  this.x = Math.random() * 1000;
  this.y = Math.random() * 1000;
  this.dx = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.originalDx = this.dx;
  this.originalDy = this.dy;
  this.rad = 0;
  this.hp = 10;
  this.height = 40;
  this.width = 40;
  this.hitBuffer = 20;
  this.drad = (Math.random() - .5) * Math.PI/16
};

Asteroid.prototype.move = function(width, height) {
  if (this.dx !== this.originalDx) {
    this.dx = this.originalDx;
  }
  if (this.dy !== this.originalDy) {
    this.dy = this.originalDy;
  }

  this.x += this.dx;
  this.y += this.dy;
  this.rad += this.drad;

  // endless sky
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Asteroid.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "astroid"
  }
}

module.exports = Asteroid;

},{}],2:[function(require,module,exports){
function Debris(x,y){
  this.x = x + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
  this.y = y + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
  this.dx = (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1)
  this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1)
  this.isExpired = false;
  this.persistenceFactor = (Math.floor(Math.random()*3))
  this.destructionTimer();
  this.height = 7;
  this.width = 7;
  this.rad = 0;
};

Debris.prototype.destructionTimer = function() {
  var that = this
  setTimeout(function() {
    that.isExpired = true
  }, 500*this.persistenceFactor);
}

Debris.prototype.move = function(width, height) {
  this.x += this.dx;
  this.y += this.dy;
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Debris.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "debris"
  }
}

module.exports = Debris;

},{}],3:[function(require,module,exports){
var Player = require("./player.js")
var Shrapnel = require("./shrapnel.js")
var Asteroid = require("./asteroid.js")
var Debris = require("./debris.js")

//Game Class and associated functions
function Game() {
  this.width = 1000;
  this.height = 1000;
  this.players = [];
  this.shrapnel =[];
  this.asteroids = [];
  this.debris = [];
  for (var i = 0; i < 3; i++) {
    this.spawnAsteroid();
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
      this.asteroids.splice(i, 1);
      this.spawnAsteroid();
    }
  }
};

Game.prototype.spawnAsteroid = function() {
  this.asteroids.push(new Asteroid());
}

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
  this.debrisMaker(28, x, y);
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

module.exports = Game;

},{"./asteroid.js":1,"./debris.js":2,"./player.js":5,"./shrapnel.js":7}],4:[function(require,module,exports){
//pew class (missiles) and associated functions
function Pew(uuid, x, y, dx, dy, rad) {
  var pewThrust = 10;
  this.x = x;
  this.y = y;
  this.width = 4;
  this.height = 10;
  this.dx = dx + pewThrust * Math.cos(rad);
  this.dy = dy + pewThrust * Math.sin(rad);
  this.rad = rad;
  this.uuid = uuid;
  this.isExpired = false;
  this.destructionTimer();
  this.hp = 1;
  this.hitBuffer = 5;
}

Pew.prototype.move = function(width, height) {
  this.x += this.dx;
  this.y += this.dy;
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Pew.prototype.destructionTimer = function() {
  var that = this
  setTimeout(function() {
    that.isExpired = true
  }, 900);
};

Pew.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "pew"
  }
}

module.exports = Pew;

},{}],5:[function(require,module,exports){
var Ship = require("./ship.js")

function Player(uuid) {
  this.state = PLAYER_STATE.start;
  this.uuid = uuid;
  this.ship = new Ship(uuid);
}

var PLAYER_STATE = {
  start: 0,
  spawn: 1,
  alive: 2
}


Player.prototype.spawn = function() {
  var spawner = this
  spawner.ship = new Ship(spawner.uuid)
  setTimeout(function() {
    spawner.state = PLAYER_STATE.alive;
    spawner.ship.type = "ship"
  }, 5000);
}

module.exports = Player;

},{"./ship.js":6}],6:[function(require,module,exports){
var Pew = require("./pew.js")

function Ship(uuid) {
  this.x = Math.random() * 800 + 100;
  this.y = Math.random() * 800 + 100;
  this.height = Ship.defaults.height;
  this.width = Ship.defaults.width;
  this.rad = Ship.defaults.rad;
  this.type = "spawnship";
  this.keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.dx = Ship.defaults.initialDx;
  this.dy = Ship.defaults.initialDy;
  this.thrust = Ship.defaults.thrust;
  this.rotate = Ship.defaults.rotate;
  this.maxSpeed = Ship.defaults.maxSpeed;
  this.pewBay = [];
  this.uuid = uuid;
  this.hp = Ship.defaults.hp;
  this.hitBuffer = Ship.defaults.hitBuffer;
};

Ship.defaults = {
  height: 40,
  width: 20,
  rad: -(Math.PI/2),
  initialDx: 0,
  initialDy: 0,
  thrust: .25,
  rotate: (Math.PI/45),
  maxSpeed: 10,
  hp: 5,
  hitBuffer: 20
}

//function responds to booleans set by player keystrokes. Controls thrust, brake, and rotation of ship.
Ship.prototype.navigateTheStars = function() {
  if (this.keys.up === true) {
    this.dx += this.thrust * Math.cos(this.rad);
    this.dy += this.thrust * Math.sin(this.rad);

    if (this.speed() > this.maxSpeed) {
      var newdx = this.dx + this.thrust * Math.cos(this.rad);
      var newdy = this.dy + this.thrust * Math.sin(this.rad);
      var newRad = Math.atan2(newdy, newdx);

      this.dx = this.maxSpeed * Math.cos(newRad);
      this.dy = this.maxSpeed * Math.sin(newRad);
    }
  }

//Down to apply brakes
  if (this.keys.down === true) {
    if (this.dx < 0) {
      this.dx += .5;
    } else if (this.dx > 0) {
      this.dx -= .5;
    }
    if (this.dy < 0) {
      this.dy += .5;
    } else if (this.dy > 0) {
      this.dy -= .5;
    }
  }

//Logic for 1/2 speed reverse acceleration
    // if (this.speed() < this.maxSpeed) {
    //   this.dx -= this.thrust / 2 * Math.cos(this.rad);
    //   this.dy -= this.thrust / 2 * Math.sin(this.rad);
    // } else {
      // newdx = this.dx + this.thrust / 2 * Math.cos(this.rad);
      // newdy = this.dy + this.thrust / 2 * Math.sin(this.rad);
      // newRad = Math.atan2(newdy, newdx);
      // this.dx = this.maxSpeed * Math.cos(newRad);
      // this.dy = this.maxSpeed * Math.sin(newRad);
    // }


  if (this.keys.left === true) {
    this.rad -= this.rotate;
  }

  if (this.keys.right === true) {
    this.rad += this.rotate;
  }
};




//Passive movement of ship based on dx and dy. Function called for each unit of time (frame).
Ship.prototype.move = function(width, height) {
  this.x += this.dx;
  this.y += this.dy;
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Ship.prototype.speed = function() {
  return (Math.sqrt(this.dx * this.dx + this.dy * this.dy));
}

//Fire a missle. creates new missle(pew) in ship's array.
//TODO review initial position of pew. should be outside of hit boxes infront of center of ship.
Ship.prototype.sayPew = function() {
  var recoil = 2.5;
  this.pewBay.push(new Pew(this.uuid, this.x + this.width/2 + (2.5*Math.sin(this.rad + (Math.PI/2))*(this.width/2)), this.y + this.height/2 - (2.5*Math.cos(this.rad+ (Math.PI/2))*(this.height/2)), this.dx, this.dy, this.rad));
  this.x -= recoil * Math.cos(this.rad);
  this.y -= recoil * Math.sin(this.rad);
}

// Find all pews without hp and set them to expired and queue them for explosion.
// Remove all expired pews from ship's pewBay (missile array)
// Return array of objects with coordinates of exploding pews.
Ship.prototype.removePew = function() {
  var explodingPews = [];
  var alivePews = [];
  for (var i = 0; i < this.pewBay.length; i++) {
    if (this.pewBay[i].hp < 1) {
      var explodingPew = {
        x: this.pewBay[i].x,
        y: this.pewBay[i].y
      }
      explodingPews.push(explodingPew);
    } else if (!this.pewBay[i].isExpired) {
      alivePews.push(this.pewBay[i]);
    }
  }
  this.pewBay = alivePews;
  return explodingPews;
};

Ship.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: this.type
  }
}

module.exports = Ship;

},{"./pew.js":4}],7:[function(require,module,exports){
function Shrapnel(x,y){
	this.x = x + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
	this.y = y + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
	this.dx = (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1)
	this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1)
	this.isExpired = false;
	this.persistenceFactor = (Math.floor(Math.random()*3))
	this.destructionTimer();
	this.rad = 0;
};

Shrapnel.prototype.destructionTimer = function() {
  var that = this
  setTimeout(function() {
    that.isExpired = true
  }, 500*this.persistenceFactor);
}

Shrapnel.prototype.move = function(width, height) {
  this.x += this.dx;
  this.y += this.dy;
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Shrapnel.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "shrapnel"
  }
}

module.exports = Shrapnel;

},{}]},{},[3])(3)
});
