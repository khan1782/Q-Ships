//pew class (missiles) and associated functions
function Pew(uuid, x, y, dx, dy, rad) {
  var pewThrust = 10;
  this.x = x;
  this.y = y;
  this.dx = dx + pewThrust * Math.cos(rad);
  this.dy = dy + pewThrust * Math.sin(rad);
  this.rad = rad;
  this.uuid = uuid;
  this.isExpired = false;
  this.destructionTimer();
}

Pew.prototype.move = function(width, height) { 
  this.x += this.dx;
  this.y += this.dy;
  if (this.x > width) {
    this.x = this.x - width;
  } else if (this.x < 0) {
    this.x = this.x + width;
  }
  if (this.y > height) {
    this.y = this.y - height;
  } else if (this.y < 0) {
    this.y = this.y + height;
  }
}

Pew.prototype.destructionTimer = function() {
  var self = this
  setTimeout(function() {
    self.isExpired = true
  }, 2000);
};

Pew.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "pew"
  }
}