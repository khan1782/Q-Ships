//ship class with all of the ships associated functions
var shipDefaults = {
  x: 100,
  y: 100,
  height: 10,
  width: 10,
  rad: -(Math.PI/2),
  initialDx: 0, 
  initialDy: 0,
  thrust: .25,
  rotate: (Math.PI/6),
};

function Ship() {
  this.x = shipDefaults.x;
  this.y = shipDefaults.y;
  this.height = shipDefaults.height;
  this.width = shipDefaults.width;
  this.rad = shipDefaults.rad;
  this.class = "ship";
  this.keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.dx = shipDefaults.initialDx;
  this.dy = shipDefaults.initialDy;
  this.thrust = shipDefaults.thrust;
  this.rotate = shipDefaults.rotate;
};

Ship.prototype.navigateTheStars = function() {
  if (this.keys.up === true) {
    this.dx += this.thrust * Math.cos(this.rad);
    this.dy += this.thrust * Math.sin(this.rad);  
  }
  if (this.keys.down === true) {
    this.dx -= this.thrust / 2 * Math.cos(this.rad);
    this.dy -= this.thrust / 2 * Math.sin(this.rad);  
  }
  if (this.keys.left === true) {
    this.angle -= this.rotate;
  }
  if (this.keys.right === true) {
    this.angle += this.rotate; 
  }
};

Ship.prototype.speed = function() {
  
};