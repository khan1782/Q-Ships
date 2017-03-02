//starfield constructor
function Starfield() {
  this.canvas = null;
  this.width = 0
  this.height = 0
  this.stars = 200;
};

//take in div#stars-background and set div to window size
//add canvas underneath div. set canvas width and height
Starfield.prototype.initialize = function(div) {
  //store the div
  this.containerDiv = div;
  this.width = 2500;
  this.height = 2500;

  // set canvas dimension to div dimensions
  var canvas = document.getElementById("starField");
  this.canvas = canvas;
  this.canvas.width = 2500;
  this.canvas.height = 2500;
};

Starfield.prototype.start = function() {
  //Initiate starsArray, shovel given amount of initialized stars into starsarray
  var starsArray = [];
  for(var i=0; i < this.stars; i++) {
    starsArray[i] = new Star(Math.random()*this.width, Math.random()*this.height, 8, 8);
  };
  // create all the stars in the universe
  this.stars = starsArray;

  var ctx = this.canvas.getContext("2d");
  //draw the black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, this.width, this.height);
};

//create star constructor
function Star(x, y, width, height) {
  this.starType = ["star_one", "star_two", "star_three"];
  this.x = x;
  this.y = y;
  this.type = this.starType[Math.floor(Math.random()*3)];
};


