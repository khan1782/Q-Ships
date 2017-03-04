(function(){
  //constructor definition - Client side render model
  function Renderer(canvas){

    //grab given html canvas object
    this.canvas = canvas;
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth

    //start lawn mower
    this.ctx = this.canvas.getContext("2d");

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

  Renderer.prototype.bodyImage = function(state,id){
    var image = new Image()
    if(state === "medium" || state === "low" || state === "spawning") {
      image.src= Renderer.images.ships[(id%=5)][state]
    } else {
      image.src = Renderer.images.ships[(id%=5)]["full"] 
    }
    return image
  }

  Renderer.prototype.shieldImage = function(state){
    var image = new Image()
    image.src = Renderer.images.shields[state][this.ticker]
    this.ticker === 4 ? this.ticker = 0 : this.ticker += 1
    return image
  }
  
  Renderer.prototype.thrustImage = function(thrustStatus,ticker){
    var image = new Image()
    var ticker = ticker || 0;
    if(thrustStatus === "pumpYourBrakes"){
      image.src = Renderer.images.pumpYourBrakes  
    } else{
      image.src = Renderer.images.thrusters[thrustStatus][ticker]
    }
    this.ticker === 4 ? this.ticker = 0 : this.ticker += 1
    return image
  }

  Renderer.prototype.extraImages = function(type){
    var image = new Image();
    if(type === "astroid"){
      image.src = Renderer.images.astroid
    } else if(type === "pew"){
      image.src = Renderer.images.pew
    }
    return image
  }

  // for an individual asset, run canvas methods to place on canvas


  Renderer.prototype.draw = function(object){
    // get the dimensions of the object
    var dims = this.dimensions(object);
    var ship;
    var thrusters;
    var shields;
    // for testing purpose only
    this.ctx.fillStyle = "white";

    // translate the object center point
    this.ctx.translate(dims.midpointX, dims.midpointY);

    // rotate at the object's center point
    this.ctx.rotate(dims.rad - (Math.PI/2));

    if(object.type === "ship"){
      if(object.state === "spawning") {
        this.ctx.globalAlpha = 0.3
      }

        ship = this.bodyImage(object.state,object.id) 
        this.ctx.drawImage(ship, dims.width/(-2), dims.height/(-2))

        if(object.thrustStatus){
         thrusters = this.thrustImage(object.thrustStatus,this.ticker)  
          this.ctx.drawImage(thrusters, dims.width/(-2), dims.height/(-2))
        }
        if(object.state === "high" || object.state === "fuller"){
          shields = this.shieldImage(object.state)
          this.ctx.drawImage(shields, dims.width/(-2), dims.height/(-2)) 
        }
      
      
      this.ctx.globalAlpha = 1.0

    } else if (object.type === "astroid" || object.type === "pew"){
        img = this.extraImages(object.type)
        this.ctx.drawImage(img, dims.width/(-2), dims.height/(-2))
    } else {
        this.ctx.fillRect(dims.width/(-2),dims.height/(-2), dims.width, dims.height);
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

  // welcome the users
  Renderer.prototype.showState = function(state) {
    var welcome = document.getElementById("welcome");
    var score = document.getElementById("score");
    if (state !== 0) {
      welcome.setAttribute("class", "hidden");
      score.setAttribute("style", "opacity: 0.4");
    } else {
      welcome.removeAttribute("class");
      // score.removeAttribute("class");
    }
  }

  // rendering the scores to the screen
  Renderer.prototype.showScores = function(scoresArray) {
    var scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = '';
    var scoresDisplay = document.createElement('ol');
    var newHTML = '';
    for (var i = 0; i < scoresArray.length; i++){
      var score = scoresArray[i].score
      var dots = 40 - (scoresArray[i].name.length + score.toString().length)
      var dotString = '';
      for (var j = 0; j < dots; j++) {
        dotString += "."
      }
      newHTML += "<li>" + scoresArray[i].name + dotString + scoresArray[i].score + "</li>";
    }
    scoresDisplay.innerHTML = newHTML;
    scoreDiv.appendChild(scoresDisplay);
  }


  // item keys to identify their dimensions
  var itemKey = {

    ship:     {width: 65, height: 59},
    rocket:   {width:20, height: 60},
    pew:      {width: 4, height: 10},
    astroid:  {width: 45, height: 49},
    debris:  {width: 7, height: 7},
    shrapnel: {width: 3, height: 3},
    star_one: {width: 2, height: 2},
    star_two: {width: 4, height: 4},
    star_three: {width: 6, height: 6}
  }
//---------------------images----------------------------

  Renderer.images = {
    thrusters:{
      upShip:["http://i.imgur.com/ELduYCu.png","http://i.imgur.com/2n5Y91F.png","http://i.imgur.com/y4tf3vr.png","http://i.imgur.com/bM9ITV0.png","http://i.imgur.com/vgByS8t.png"],
      rightShip:["http://i.imgur.com/SBTJui7.png","http://i.imgur.com/KnT9Mkb.png","http://i.imgur.com/r71idEc.png","http://i.imgur.com/nor0HkE.png","http://i.imgur.com/sFNvYbi.png"],
      leftShip:["http://i.imgur.com/feXJn3N.png","http://i.imgur.com/iqIaoEj.png","http://i.imgur.com/MKto5Wk.png","http://i.imgur.com/8Fc3d0f.png","http://i.imgur.com/l2Qh6Fk.png"],
      upLeftShip:["http://i.imgur.com/6aX9ZDY.png","http://i.imgur.com/ny9KLCp.png","http://i.imgur.com/HmVECLy.png","http://i.imgur.com/kDYxr1W.png","http://i.imgur.com/SZX0yw0.png"],
      upRightShip:["http://i.imgur.com/IDWy8rT.png","http://i.imgur.com/ALj9wfK.png","http://i.imgur.com/quwqQnH.png","http://i.imgur.com/2ue1Ypy.png","http://i.imgur.com/e978j5U.png"]
    },
    shields:{
      fuller:["http://i.imgur.com/stQcDyZ.png","http://i.imgur.com/I9XLZDC.png","http://i.imgur.com/xxcyELi.png","http://i.imgur.com/stQcDyZ.png","http://i.imgur.com/I9XLZDC.png"],
      high:["http://i.imgur.com/ve8pwH9.png","http://i.imgur.com/wd6yp4W.png","http://i.imgur.com/ve8pwH9.png","http://i.imgur.com/uOoyGS5.png","http://i.imgur.com/DVr2Z1X.png"]
    },
    pumpYourBrakes:"http://i.imgur.com/rKZH11y.png",

    astroid: "http://i.imgur.com/8i5gG51.png",
    pew: "http://i.imgur.com/VioerDV.png",
    ships:[{
      spawning:"http://i.imgur.com/78UG0pv.png",
      // high:"http://i.imgur.com/78UG0pv.png",
      full:"http://i.imgur.com/E9Ln1by.png",
      medium:"http://i.imgur.com/glDm22T.png",
      low:"http://i.imgur.com/kcJdnch.png"
    },
    {
      spawning:"http://i.imgur.com/s1gmp8k.png",
      // high:"http://i.imgur.com/s1gmp8k.png",
      full:"http://i.imgur.com/8YWAA4n.png",
      medium:"http://i.imgur.com/QTvRdzI.png",
      low:"http://i.imgur.com/rbd2ErY.png"
    },
    {
      spawning:"http://i.imgur.com/vKz3aqq.png",
      // high:"http://i.imgur.com/vKz3aqq.png",
      full:"http://i.imgur.com/ynOA7pa.png",
      medium:"http://i.imgur.com/yVLT2Aq.png",
      low:"http://i.imgur.com/2LQfvfn.png"
    },
    {
      spawning:"http://i.imgur.com/vKz3aqq.png",
      // high:"http://i.imgur.com/xNeuvuA.png",
      full:"http://i.imgur.com/yfSJ8a1.png",
      medium:"http://i.imgur.com/hQYd7VQ.png",
      low:"http://i.imgur.com/No1QhZX.png"
    },
    {
      spawning:"http://i.imgur.com/mHhT0kd.png",
      // high:"http://i.imgur.com/mHhT0kd.png",
      full:"http://i.imgur.com/7QH7ZbX.png",
      medium:"http://i.imgur.com/YTZXTjO.png",
      low:"http://i.imgur.com/L1VHlP2.pnga"
    },
    {
      spawning:"http://i.imgur.com/lAaqCT0.png",
      // high:"http://i.imgur.com/lAaqCT0.png",
      full:"http://i.imgur.com/ig22rDQ.png",
      medium:"http://i.imgur.com/QFcyWnA.png",
      low:"http://i.imgur.com/BczFMuV.png"
    }]
      
  }


  window.Renderer = Renderer;
})()




// ["http://i.imgur.com/ve8pwH9.png","http://i.imgur.com/wd6yp4W.png","http://i.imgur.com/ve8pwH9.png","http://i.imgur.com/uOoyGS5.png","http://i.imgur.com/DVr2Z1X.png"]
// ["http://i.imgur.com/stQcDyZ.png","http://i.imgur.com/I9XLZDC.png","http://i.imgur.com/xxcyELi.png","http://i.imgur.com/stQcDyZ.png","http://i.imgur.com/I9XLZDC.png"]