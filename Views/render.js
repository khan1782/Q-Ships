//example pipeline input
//

/////////////////////////////////input///////////////////////////
var assets =
[
  {game: {width: 1000, height: 1000, state:""}},
  {item1: {x:400, y:600, rad:0, type:"ship"}},
  {item2: {x:400, y:300, rad:0, type:"merg"}}
]





///////////////////////contoller////////////////////////////////
document.addEventListener("DOMContentLoaded", function(event) {

  var canvas = document.getElementById("gameCanvas")

  render = new Renderer(canvas, assets)
  render.initialize()
  render.draw()


})


///////////////////////models//////////////////////////////////


//constructor definition
function Renderer(canvas, pipelineAssets){
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");
  this.width = pipelineAssets[0].game.width;
  this.height = pipelineAssets[0].game.height;
}

Renderer.prototype.initialize = function() {
  this.canvas.height = this.height;
  this.canvas.width = this.width
};

Renderer.prototype.draw = function(){
  this.ctx.fillStyle ="white"
  this.ctx.fillRect(200,200,20,20)
};



//////////////////////////keys////////////////////////////////
var itemKey = {
  ship: {width: 10, height: 20},
  merg: {width: 15, height: 25}
}
