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

  //start of the game loop (running draw at 50fps)
  render.gameLoop();
})


//sets up event listeners for up, down, left, right
function keyStrokeListeners(game) {

  var self = game
  //document event listener for keydown
  document.addEventListener('keydown', function(event){

    // listening for right
    if(event.keyCode === 39) {
      //this is where we will send information to the game engine
      game.keys.right = true
    }

    //listening for left
    if(event.keyCode === 37) {
      //this is where we will send information to the game engine
      game.keys.left = true
    }

    //listening for up
    if(event.keyCode === 38) {
      //this is where we will send information to the game engine
      game.keys.up = true
    }

    //listening for down
    if(event.keyCode === 40) {
      //this is where we will send information to the game engine
      game.keys.down = true
    }
  });
}
