//Game Class and associated functions
var STATES = {
  run: 0
}

function Game() {
 this.width = 1000;
 this.height = 1000;
 this.state = STATES.run;
 this.items = [];
}

Game.prototype.snapshot = function() {
  return JSON.stringify(this);
}

