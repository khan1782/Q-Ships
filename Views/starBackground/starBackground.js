//starfield constructor
function Starfield() {
  this.fps = 30;
  this.canvas = null;
  this.width = 0
  this.height = 0
  this.minVelocity = 15;
  this.maxVelocity = 85;
  this.intervalId = 0;
  this.stars = 100;
  this.warpFactor = 1;
};

//take in div#stars-background and set div to window size
//add canvas underneath div. set canvas width and height
Starfield.prototype.initialize = function(div) {

  //store the div
  this.containerDiv = div;
  this.width = window.innerWidth;
  this.height = window.innerHeight;

  //save starfield scope as self
  var self = this;
  //create listener for the resize
  window.addEventListener('resize', function(event){
    self.width = window.innerWidth;
    self.height = window.innerHeight;
    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.draw();
  });

  // set canvas dimension to div dimensions
  var canvas = document.getElementById("starField");
  this.canvas = canvas;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
};


Starfield.prototype.start = function() {

  //Initiate starsArray, shovel given amount of initialized stars into starsarray
  var starsArray = [];
  for(var i=0; i<this.stars; i++) {
    starsArray[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1, (Math.random()*(this.maxVelocity - this.minVelocity)) + this.minVelocity);
  };
  //reset stars attribute to same number of initialized stars.
  this.stars = starsArray;

  //save starfield scope as self
  var self = this;
//start a timer
  
  this.intervalId = setInterval(function() {
    self.update();
    self.draw();
  }, 1000 / this.fps);
};

//create star constructor
function Star(x,y,size,velocity) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.tail = size;
  this.hyperspeed = size;
  this.velocity = velocity;
};

//create update function to move star by its velocity
Starfield.prototype.update = function() {
  // calculate change in distance given fps and update star y coordinate with that time and its velocity
  var dt = 1 / this.fps;
  for(var i=0; i<this.stars.length; i++) {
    var star = this.stars[i];
    star.y += dt * star.velocity;
    //if the star has moved from the bottom of the screen, spawn it at the top
    if(star.y > this.height) {
      this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1, (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);   }
  };
};


Starfield.prototype.draw = function() {

  //get the drawing context
  var ctx = this.canvas.getContext("2d");

  //draw the background black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, this.width, this.height);

  //draw stars
  ctx.fillStyle = "#ffffff";
  for(var i=0; i<this.stars.length;i++) {
    var star = this.stars[i];
    ctx.fillRect(star.x, star.y, star.size, star.tail)
  }
};
