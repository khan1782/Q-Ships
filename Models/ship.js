//ship class with all of the ships associated functions
var shipDefaults = {
  x: 100,
  y: 100,
  height: 10,
  width: 10,
  rad: -(Math.PI/2),
}

function Ship() {
  this.x = shipDefaults.x;
  this.y = shipDefaults.y;
  this.height = shipDefaults.height;
  this.width = shipDefaults.width;
  this.rad = shipDefaults.rad;
  this.class = "ship";
}