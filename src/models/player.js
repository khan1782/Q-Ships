(function() {
  if (typeof require !== "undefined") {
    var Ship = require("./ship.js")
  }

  var PLAYER_STATE = {
    start: 0,
    spawn: 1,
    alive: 2
  }

  function Player(uuid) {
    this.state = PLAYER_STATE.start;
    this.uuid = uuid;
    this.ship = new Ship(uuid);
  }

  Player.prototype.spawn = function() {
    var spawner = this
    spawner.ship = new Ship(spawner.uuid)  
    setTimeout(function() {
      spawner.state = PLAYER_STATE.alive;
      spawner.ship.type = "ship"
    }, 5000);
  }

  if (typeof module !== "undefined") {
    module.exports = Player;
  } else {
    window.Player = Player;
  }
})()