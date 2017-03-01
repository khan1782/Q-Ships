(function(){
  // ----------------------MODELS-----------------------------

  //constructor definition
  function Renderer(canvas){

    //grab given html canvas object
    this.canvas = canvas;
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth

    //start lawn mower
    this.ctx = this.canvas.getContext("2d");

    this.colors = ["tomato","teal","red","white","violet","green","blue","yellow","tomato","grey","brown","orange","purple","palevioletred","palegreen","paleturquoise","darksalmon"]
    this.ticker = 0
  }

  //iterate through all of the snapshot assets and run draw and each one
  Renderer.prototype.populateUniverse = function(){
    //clear the canvas before very frame
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    //check if there is any input from WS
    if(this.objectsArray){
      //iterate through all the objects set in controller from on message WS
      for(var i = 0; i < this.objectsArray.length; i++){
        //run draw function for each individual object
        this.draw(this.objectsArray[i]);
      }
    }
  };


  Renderer.prototype.images = function(type,ticker){
    var image = new Image();
    var ticker = ticker || 0;

    if(type === "ship" || type === "spawnship"){
      // image.src = "http://i.imgur.com/2JndZdm.png";
      image.src = "http://i.imgur.com/wgbq0fh.png";

    } else if (type === "upShip") {
       image.src = ["http://i.imgur.com/VnPR2Dq.png", "http://i.imgur.com/ZYowoUc.png","http://i.imgur.com/R64ZG2I.png"][ticker]
    } else if (type === "upLeftShip") {
      image.src = "http://i.imgur.com/TpdKiZ3.png";
    } else if (type === "upRightShip") {
      image.src = "http://i.imgur.com/TpdKiZ3.png";
    } else if (type === "leftShip") {
      image.src = "http://i.imgur.com/TpdKiZ3.png";
    } else if (type === "rightShip") {
      image.src = "http://i.imgur.com/TpdKiZ3.png";
    } else if (type === "pumpYourBrakes") {
      image.src = "http://i.imgur.com/TpdKiZ3.png";
    } else if (type === "astroid") {
      image.src = "http://i.imgur.com/8i5gG51.png";
    }

    return image;
  };

  // for an individual asset, run canvas methods to place on canvas
  Renderer.prototype.draw = function(object){
    // get the dimensions of the object
    var dims = this.dimensions(object);

    // for testing purpose only
    this.ctx.fillStyle = "white";

    // translate the object center point
    this.ctx.translate(dims.midpointX, dims.midpointY);

    // rotate at the object's center point
    this.ctx.rotate(dims.rad - (Math.PI/2));




    if ( object.type === "debris" || object.type === "shrapnel" || object.type === "pew"){
        this.ctx.fillRect(dims.width/(-2),dims.height/(-2), dims.width, dims.height);
    } else {
      // get the correct image tag based off the type
      var img = this.images(object.type, this.ticker);

      if(object.state === "spawning"){
        this.ctx.globalAlpha = 0.3
        this.ctx.drawImage(img, dims.width/(-2), dims.height/(-2))
        this.ctx.globalAlpha = 1.0
      } else{
      // draw the image at its own center point
      this.ctx.drawImage(img, dims.width/(-2), dims.height/(-2))
      }

      // roll through ticker to reset its value ... 0, 1, 2
      this.ticker === 2 ? this.ticker = 0 : this.ticker += 1
    }


    // rotate the canvas back to its original state
    this.ctx.rotate((dims.rad-(Math.PI/2))/-1);

    // translate the canvas back to where the img is center is the center of the canvas
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
  Renderer.prototype.tickTock = function(){
    var that = this;
    function execute(){
      window.requestAnimationFrame(execute);
      that.populateUniverse();
    }
    execute();
  }

  Renderer.prototype.showState = function(state) {
    var welcome = document.getElementById("welcome");
    if (state !== 0) {
      welcome.setAttribute("class", "hidden");
    } else {
      welcome.removeAttribute("class")
    }
  }


  // ----------------------KEYS-----------------------------
  var itemKey = {
    ship:     {width: 60, height: 54},
    spawnship: {width: 60, height: 54},
    upShip:     {width: 60, height: 54},
    upLeftShip:     {width: 60, height: 54},
    upRightShip:     {width: 60, height: 54},
    leftShip:     {width: 60, height: 54},
    rightShip:     {width: 60, height: 54},
    pumpYourBrakes:     {width: 45, height: 33},
    pew:      {width: 4, height: 10},
    astroid:  {width: 45, height: 49},
    debris:  {width: 7, height: 7},
    shrapnel: {width: 3, height: 3}
  }

  window.Renderer = Renderer;
})()
