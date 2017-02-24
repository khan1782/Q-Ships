///////////////////////contoller////////////////////////////////
document.addEventListener("DOMContentLoaded", function(event) {

  //identify starfield div container
  var background = document.getElementById('background');

  //initialize new starfield beep beep boop
  var starfield = new Starfield();

  //run initialize on initialized starfield
  starfield.initialize(background);
  starfield.start();


  //identify game canvas
  var canvas = document.getElementById("gameCanvas")

  //initialize renderer machinery *wa wa wa wa*
  render = new Renderer(canvas, assets)
  render.initialize()

  //draw canvas
  render.draw()
})



///////////////////////models//////////////////////////////////


//constructor definition
function Renderer(canvas, snapshotAssets){

  //grab given html canvas object
  this.canvas = canvas;

  //start lawn mower
  this.ctx = this.canvas.getContext("2d");

  //pipeline assets saved in renderer
  this.gameSettings = snapshotAssets[0];
  this.assets = snapshotAssets[1]

  //fetch canvas dimensions from pipeline *schwoooooooo*
  this.width = this.gameSettings.width;
  this.height = this.gameSettings.height;

}




//define canvas dimensions (grabbed from pipeline in definition)
Renderer.prototype.initialize = function() {
  this.canvas.height = this.height;
  this.canvas.width = this.width
};




//draw each pipeline object
Renderer.prototype.draw = function(){
  for(var i = 0; i < this.assets.length; i++){
    var currentAsset = this.assets[i];

    var currentAssetWidth = itemKey[currentAsset.type].width;
    var currentAssetHeight = itemKey[currentAsset.type].height;

    this.ctx.fillStyle ="white";
    this.ctx.fillRect(currentAsset.x,currentAsset.y,currentAssetWidth,currentAssetHeight);
  }
};

// itemKey[currentAsset.type].width
// itemKey[currentAsset.type].height




//////////////////////////keys////////////////////////////////
var itemKey = {
  ship: {width: 10, height: 20},
  merg: {width: 15, height: 25}
}
/////////////////////////////////input///////////////////////////
var assets =
  [ {width: 1000, height: 1000, state:""},
    [
      {x:400, y:600, rad:0, type:"ship"},
      {x:400, y:300, rad:0, type:"merg"}
    ]
  ]






