function Asteroid(){
  this.x = Math.random() * 1000;
  this.y = Math.random() * 1000;
  this.dx = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.originalDx = this.dx;
  this.originalDy = this.dy;
  this.rad = 0;
  this.hp = 10;
  this.height = 40;
  this.width = 40;
  this.hitBuffer = 20;
  this.drad = (Math.random() - .5) * Math.PI/16
};

Asteroid.prototype.move = function(width, height) {
  if (this.dx !== this.originalDx) {
    this.dx = this.originalDx;
  }
  if (this.dy !== this.originalDy) {
    this.dy = this.originalDy;
  }

  this.x += this.dx;
  this.y += this.dy;
  this.rad += this.drad;

  // endless sky
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

Asteroid.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "astroid"
  }
}

module.exports = Asteroid;
