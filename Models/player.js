var PLAYER_STATE = {
  start: 0,
  alive: 1,
  dead: 2
}

function Player() {
  this.state = PLAYER_STATE.start;
  this.ship;
  this.uuid = uuid();
}

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}