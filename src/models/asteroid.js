function Asteroid(){
  this.x = Math.random() * 2500;
  this.y = Math.random() * 2500;
  this.dx = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.dy = (Math.floor(Math.random()*7)) * (Math.round(Math.random()) * 2 - 1);
  this.originalDx = this.dx;
  this.originalDy = this.dy;
  this.rad = 0;
  this.type = ["asteroidOne","asteroidTwo","asteroidThree"][Math.floor(Math.random()*3)]
  this.hp = Asteroid.sizes[this.type].hp;
  this.height = Asteroid.sizes[this.type].height;
  this.width = Asteroid.sizes[this.type].width;
  this.hitBuffer = Asteroid.sizes[this.type].hitBuffer;
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
    type: this.type
  }
}

Asteroid.sizes = {
  asteroidOne:{
      hp:10,
      height: 40,
      width:40,
      hitBuffer: 25
    },
  asteroidTwo:{
      hp:15,
      height:70,
      width:70,
      hitBuffer:40
    },
  asteroidThree:{
      hp:20,
      height:90,
      width:90,
      hitBuffer:50
    }
}

module.exports = Asteroid;
