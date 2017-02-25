//pew class (missiles) and associated functions
function Pew(uuid, x, y, dx, dy, rad) {
  var pewThrust = 10;
  this.x = x;
  this.y = y;
  this.dx = dx + pewThrust * Math.cos(rad);
  this.dy = dy + pewThrust * Math.sin(rad);
  this.rad = rad;
  this.uuid = uuid;
}

Pew.prototype.move() {
  this.x += dx;
  this.y += dy;
}

Pew.prototype.snapshot = function() {
  return {
       x: this.x,
       y: this.y,
     rad: this.rad,
    type: "pew"
  }
}