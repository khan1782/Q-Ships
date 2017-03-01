var Ship = require("./ship.js")

function Player(uuid) {
  this.state = PLAYER_STATE.start;
  this.uuid = uuid;
  this.ship = new Ship(uuid);
  this.score = 0;
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
  }, 3210); //GO! :D
}

module.exports = Player;
