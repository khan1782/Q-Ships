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
  //TODO
  var currentSnapshot = function() {
    return JSON.parse(render.objectsArray)
  }


  // render.gameLoop(currentSnapshot());
  render.gameLoop(render.objectsArray);
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
      //TODO send person's key -
      //game.update entity that takes command
      //in game code turn this into an action
      //get the idea of time going, on the server it has a sense of time where it updates people.
      //will tell server, left thruster is on, then the server will see that change
      //the way that comes in may be a method
      //game engine method, if you tell me some stuff about how it should update ill do it
      //i can imagine an update method taking a js object that has a player ID, and list of Keys that are currently on.
      //client is getting snapshot of its state going to the game engine
      //the game engine can be runnign on either side
      //hit a key go to the server, game state updates get back snapshot back
      //then you'll see a thruster turn on. but a place to start
      //CLIENT PREDICTION AFTER
      //dont send an update unless a change occured.
      // game.updateEntity({id: "jf9324j32", keys: [true, true, false, false]})

      // ws.sendMessage(JSON.stringify({messageType: "entityUpdate", update: {id: "jf9324j32", keys: [true, true, false, false]}})

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
