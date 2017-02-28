(function() {
  if (typeof require !== "undefined") {
    var Ship = require("./ship.js")
  }

  var PLAYER_STATE = {
    start: 0,
    spawn: 1,
    alive: 2,
    dead: 3
  }

  function Player(uuid) {
    this.state = PLAYER_STATE.start;
    this.uuid = uuid;
    this.ship = new Ship(uuid);
  }

  if (typeof module !== "undefined") {
    module.exports = Player;
  } else {
    window.Player = Player;
  }
})()