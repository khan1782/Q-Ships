document.addEventListener("DOMContentLoaded", function(event) {

  //identify starfield div container
  var background = document.getElementById('background');
  //initialize new starfield beep beep boop
  var starfield = new Starfield();
  //run initialize on initialized starfield
  starfield.initialize(background);
  //begin starfield loop
  starfield.start();


//-----------------Server Side----------------------
  var game = new Game()
  game.ship = new Ship()
//--------------------------------------------------


  //identify game canvas
  var canvas = document.getElementById("gameCanvas")
  //initialize renderer machinery *wa wa wa wa*
  render = new Renderer(canvas, assets)
  //set game bounds
  render.initialize()
  //start of the game loop (running draw at 50fps)
  //update the assets per loop
  


  //snapshot is captured
  var currentSnapshot = JSON.parse(game.snapshot())
  render.gameLoop(currentSnapshot);
  //add listeners for key strokes for initialized game
  keyStrokeListeners(game)

})




//sets up event listeners for up, down, left, right
function keyStrokeListeners(game) {

  var self = game
  //document event listener for keydown
  document.addEventListener('keydown', function(event){

    // listening for right
    if(event.keyCode === 39) {
      //this is where we will send information to the game engine
      console.log("right")
      game.ship.keys.right = true
    }

    //listening for left
    if(event.keyCode === 37) {
      //this is where we will send information to the game engine
      console.log("left")
      game.ship.keys.left = true
    }

    //listening for up
    if(event.keyCode === 38) {
      //this is where we will send information to the game engine
      console.log("up")
      game.ship.keys.up = true
    }

    //listening for down
    if(event.keyCode === 40) {
      //this is where we will send information to the game engine
      console.log("down")
      game.ship.keys.down = true
    }
  });
}
