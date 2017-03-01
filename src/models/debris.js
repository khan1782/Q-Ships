function Debris(x,y){
  this.x = x + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
  this.y = y + (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1);
  this.dx = (Math.floor(Math.random()*5)) * (Math.round(Math.random()) * 2 - 1)
  this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1)
  this.isExpired = false;
  this.persistenceFactor = (Math.floor(Math.random()*3))
  this.destructionTimer();
  this.height = 7;
  this.width = 7;
  this.rad = 0;
};

Debris.prototype.destructionTimer = function() {
  var that = this
  setTimeout(function() {
    that.isExpired = true
  }, 500*this.persistenceFactor);
}

Debris.prototype.move = function(width, height) {
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

Debris.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "debris"
  }
}

module.exports = Debris;
