(function() {
  var PLAYER_STATE = {
    start: 0,
    alive: 1,
    dead: 2
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