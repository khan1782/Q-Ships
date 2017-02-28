var Pew = require("./pew.js")

function Ship(uuid) {
  this.x = Math.random() * 800 + 100;
  this.y = Math.random() * 800 + 100;
  this.height = Ship.defaults.height;
  this.width = Ship.defaults.width;
  this.rad = Ship.defaults.rad;
  this.type = "spawnship";
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
  height: 40,
  width: 20,
  rad: -(Math.PI/2),
  initialDx: 0,
  initialDy: 0,
  thrust: .25,
  rotate: (Math.PI/45),
  maxSpeed: 10,
  hp: 5,
  hitBuffer: 20
}

//function responds to booleans set by player keystrokes. Controls thrust, brake, and rotation of ship.
Ship.prototype.navigateTheStars = function() {
  if (this.keys.up === true) {
    this.dx += this.thrust * Math.cos(this.rad);
    this.dy += this.thrust * Math.sin(this.rad);

    if (this.speed() > this.maxSpeed) {
      var newdx = this.dx + this.thrust * Math.cos(this.rad);
      var newdy = this.dy + this.thrust * Math.sin(this.rad);
      var newRad = Math.atan2(newdy, newdx);

      this.dx = this.maxSpeed * Math.cos(newRad);
      this.dy = this.maxSpeed * Math.sin(newRad);
    }
  }

//Down to apply brakes
  if (this.keys.down === true) {
    if (this.dx < 0) {
      this.dx += .5;
    } else if (this.dx > 0) {
      this.dx -= .5;
    }
    if (this.dy < 0) {
      this.dy += .5;
    } else if (this.dy > 0) {
      this.dy -= .5;
    }
  }

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


  if (this.keys.left === true) {
    this.rad -= this.rotate;
  }

  if (this.keys.right === true) {
    this.rad += this.rotate;
  }
};




//Passive movement of ship based on dx and dy. Function called for each unit of time (frame).
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
  return (Math.sqrt(this.dx * this.dx + this.dy * this.dy));
}

//Fire a missle. creates new missle(pew) in ship's array.
//TODO review initial position of pew. should be outside of hit boxes infront of center of ship.
Ship.prototype.sayPew = function() {
  var recoil = 2.5;
  this.pewBay.push(new Pew(this.uuid, this.x + this.width/2 + (2.5*Math.sin(this.rad + (Math.PI/2))*(this.width/2)), this.y + this.height/2 - (2.5*Math.cos(this.rad+ (Math.PI/2))*(this.height/2)), this.dx, this.dy, this.rad));
  this.x -= recoil * Math.cos(this.rad);
  this.y -= recoil * Math.sin(this.rad);
}

// Find all pews without hp and set them to expired and queue them for explosion.
// Remove all expired pews from ship's pewBay (missile array)
// Return array of objects with coordinates of exploding pews.
Ship.prototype.removePew = function() {
  var explodingPews = [];
  var alivePews = [];
  for (var i = 0; i < this.pewBay.length; i++) {
    if (this.pewBay[i].hp < 1) {
      var explodingPew = {
        x: this.pewBay[i].x,
        y: this.pewBay[i].y
      }
      explodingPews.push(explodingPew);
    } else if (!this.pewBay[i].isExpired) {
      alivePews.push(this.pewBay[i]);
    }
  }
  this.pewBay = alivePews;
  return explodingPews;
};

Ship.prototype.snapshot = function() {
  return {
    x: this.x,
    y: this.y,
    rad: this.rad,
    type: this.type
  }
}

module.exports = Ship;
