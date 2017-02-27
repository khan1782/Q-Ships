function Ship(uuid) {
  this.x = Ship.defaults.x;
  this.y = Ship.defaults.y;
  this.height = Ship.defaults.height;
  this.width = Ship.defaults.width;
  this.rad = Ship.defaults.rad;
  this.type = "ship";
  this.keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.dx = Ship.defaults.initialDx;
  this.dy = Ship.defaults.initialDy;
  this.thrust = Ship.defaults.thrust;
  this.rotate = Ship.defaults.rotate;
  this.maxSpeed = Ship.defaults.maxSpeed;
  this.pewBay = [];
  this.uuid = uuid;
  this.hp = Ship.defaults.hp;
  this.hitBuffer = Ship.defaults.hitBuffer;
};

Ship.defaults = {
  x: 100,
  y: 100,
  height: 40,
  width: 20,
  rad: -(Math.PI/2),
  initialDx: 0,
  initialDy: 0,
  thrust: .25,
  rotate: (Math.PI/45),
  maxSpeed: 10,
  hp: 5,
  hitBuffer: 25
}

Ship.prototype.navigateTheStars = function() {
  if (this.keys.up === true) {
    if (this.speed() < this.maxSpeed) {
      this.dx += this.thrust * Math.cos(this.rad);
      this.dy += this.thrust * Math.sin(this.rad);
    } else {
      newdx = this.dx + this.thrust * Math.cos(this.rad);
      newdy = this.dy + this.thrust * Math.sin(this.rad);
      newRad = Math.atan2(newdy, newdx);
      this.dx = this.maxSpeed * Math.cos(newRad);
      this.dy = this.maxSpeed * Math.sin(newRad);
    }
  }
  if (this.keys.down === true) {
//Logic for 1/2 speed reverse acceleration
    // if (this.speed() < this.maxSpeed) {
    //   this.dx -= this.thrust / 2 * Math.cos(this.rad);
    //   this.dy -= this.thrust / 2 * Math.sin(this.rad);
    // } else {
      // newdx = this.dx + this.thrust / 2 * Math.cos(this.rad);
      // newdy = this.dy + this.thrust / 2 * Math.sin(this.rad);
      // newRad = Math.atan2(newdy, newdx);
      // this.dx = this.maxSpeed * Math.cos(newRad);
      // this.dy = this.maxSpeed * Math.sin(newRad);
    // }
//Down to apply brakes
    if (this.dx < 0) {
      this.dx += .2;
    } else if (this.dx > 0) {
      this.dx -= .2;
    }
    if (this.dy < 0) {
      this.dy += .2;
    } else if (this.dy > 0) {
      this.dy -= .2;
    }
  }
  if (this.keys.left === true) {
    this.rad -= this.rotate;
  }
  if (this.keys.right === true) {
    this.rad += this.rotate;
  }
};

Ship.prototype.move = function(width, height) {
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

Ship.prototype.speed = function() {
  return (Math.sqrt(this.dx**2 + this.dy**2));
}

Ship.prototype.sayPew = function() {
  var recoil = 2.5;
  this.pewBay.push(new Pew(this.uuid, this.x + this.width/2 + (1.5*Math.sin(this.rad + (Math.PI/2))*(this.width/2)), this.y + this.height/2 - (1.5*Math.cos(this.rad+ (Math.PI/2))*(this.height/2)), this.dx, this.dy, this.rad));  this.x -= recoil * Math.cos(this.rad);
  this.y -= recoil * Math.sin(this.rad);
}

Ship.prototype.removePew = function() {
  var self = this;
  var explodingPews;
  for (var i = 0; i < this.pewBay.length; i++) {
    if (this.pewBay[i].hp < 1 ) {
      this.pewBay[i].isExpired = true;

      explodingPew = {
        x: this.pewBay[i].x,
        y: this.pewBay[i].y
      }
      explodingPews.push(explodingPew);

    } else if (this.pewBay[i].isExpired === true ){
      self.pewBay.splice(i,1);
    }
  }
  return explodingPews;
};

Ship.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: "ship"
  }
}
