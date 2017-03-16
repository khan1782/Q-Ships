//pew class (missiles) and associated functions
function Nuke(uuid, x, y, dx, dy, rad) {

  this.x = x;
  this.y = y;
  this.width = 80;
  this.height = 80;
  this.dx = dx/2;
  this.dy = dy/2;
  this.rad = rad;
  this.uuid = uuid;
  this.isExpired = false;
  this.destructionTimer();
  this.hp = 60;
  this.damage = 20;
}

Nuke.prototype.move = function(width, height) {
  this.x -= this.dx;
  this.y -= this.dy;
  this.rad += (Math.PI/48)
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

Nuke.prototype.destructionTimer = function() {
  var that = this;
  setTimeout(function() {
    that.isExpired = true
  }, 8000);
};

Nuke.prototype.snapshot = function() {
  if (!this.isExpired){
    return {
      x: this.x,
      y: this.y,
      rad: this.rad,
      type: "nuke",
      id: this.uuid
    }
  } else {
    return {
      x: this.x,
      y: this.y,
      rad: this.rad,
      type: "shrapnel",
      id: this.uuid
    }
  }
}

module.exports = Nuke;
