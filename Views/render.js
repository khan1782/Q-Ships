// ----------------------MODELS-----------------------------

//constructor definition
function Renderer(canvas, snapshotAssets){

  //grab given html canvas object
  this.canvas = canvas;

  //start lawn mower
  this.ctx = this.canvas.getContext("2d");

  //pipeline assets saved in renderer
  this.objectsArray = snapshotAssets.items;
  delete(snapshotAssets["items"]);
  this.gameSetting = snapshotAssets;
}


//define canvas dimensions (grabbed from pipeline in definition)
Renderer.prototype.initialize = function() {
  this.canvas.height = this.gameSetting.height;
  this.canvas.width = this.gameSetting.width
};


//iterate through all of the snapshot assets and run draw and each one
Renderer.prototype.populateUniverse = function(){
  for(var i = 0; i < this.objectsArray.length; i++){
    var currentObject = this.objectsArray[i];
    this.draw(currentObject);
  }
};

// for an individual asset, run canvas methods to place on canvas
Renderer.prototype.draw = function(object){

  //get dimensions from earlier function
  var dims = this.dimensions(object)

  // paste object accounting for it's angle using canvas rotate function
  this.ctx.fillStyle ="white";
  this.ctx.translate(dims.midpointX, dims.midpointY);
  this.ctx.rotate(dims.rad);
  this.ctx.fillRect(dims.width/(-2),dims.height/(-2), dims.width, dims.height);
  this.ctx.rotate(dims.rad/-1);
  this.ctx.translate(dims.midpointX/-1, dims.midpointY/-1);
}

// takes in a snapshot asset (each asset has an x, y, rad - width and height are accessed from itemKey object literal)
Renderer.prototype.dimensions = function(currentAsset){
  return {
    width: itemKey[currentAsset.type].width,
    height: itemKey[currentAsset.type].height,
    rad: currentAsset.rad,
    x: currentAsset.x,
    y: currentAsset.y,
    midpointX: currentAsset.x + (itemKey[currentAsset.type].width/2),
    midpointY: currentAsset.y + (itemKey[currentAsset.type].height/2)
  }
}

//runs populateUniverse in a repeated loop
//takes in a snapshotAssetArray to update itself
Renderer.prototype.gameLoop = function(snapshotAssets){
  var self = this;
  function execute(){
  window.requestAnimationFrame(execute);
    self.objectsArray = snapshotAssets;
    self.populateUniverse();
  }
  execute();
}





// ----------------------KEYS-----------------------------
var itemKey = {
  ship: {width: 10, height: 20},
  merg: {width: 15, height: 25}
}


// ----------------------INPUTS-----------------------------
var assets =
  {
    width:1000,
    height:1000,
    state:0,
    items: [
      {x:400, y:600, rad:0, type:"ship"},
      {x:400, y:300, rad:3.14, type:"merg"}
    ]
  }




