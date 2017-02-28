(function() {
  if (typeof require !== "undefined") {
    var Ship = require("./ship.js")
  }

  function Player(uuid) {
    this.state = PLAYER_STATE.start;
    this.uuid = uuid;
    this.ship = new Ship(uuid);
  }

  var PLAYER_STATE = {
    start: 0,
    alive: 1,
    dead: 2
  }


  if (typeof module !== "undefined") {
    module.exports = Player;
  } else {
    window.Player = Player;
  }
})()
