var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);   



var background = document.getElementById('background');

//initialize new starfield beep beep boop
var starfield = new Starfield();

//run initialize on initialized starfield
starfield.initialize(background);

//begin starfield loop
starfield.start();

//identify game canvas
var canvas = document.getElementById("gameCanvas")


  //initialize renderer machinery *wa wa wa wa*
  render = new Renderer(canvas);

      ws.onmessage = function (event) {
        console.log(event)
        var snapshot = JSON.parse(event.data);
        render.objectsArray = snapshot.items;
        render.id = snapshot.id;
        state = JSON.parse(event.data).state;
        render.showState(state);
      };

      render.tickTock();

//----------------------------------------------
function sendMessage(msg) {
  ws.send(JSON.stringify(msg))
};


function keyStrokeListeners(uuid) {
  //json package ready for editing
  var keys = {uuid: uuid, keys: {up: false, down: false, left: false, right: false}}

  //document event listener for keydown
  document.addEventListener('keydown', function(event){
    //listening for up
    if(event.keyCode === 38 && keys.keys.up === false) {
      keys.keys.up = true;
      // send json to server controller
      sendMessage(keys)
    }
    //listening for down
    if(event.keyCode === 40 && keys.keys.down === false ) {
      keys.keys.down = true;
      // send json to server controller
      sendMessage(keys)
    }

    //listening for left
    if(event.keyCode === 37 && keys.keys.left === false) {
      keys.keys.left = true;
      // send json to server controller
      sendMessage(keys)
    }

    // listening for right
    if(event.keyCode === 39 && keys.keys.right === false ) {
      keys.keys.right = true;
      // send json to server controller
      sendMessage(keys)
    }
  });

  //document event listener for keydown to reset keys to false
  document.addEventListener('keyup', function(event){
    if(event.keyCode === 38) {
      keys.keys.up = false;
      sendMessage(keys)
    }
    if(event.keyCode === 40) {
      keys.keys.down = false;
      sendMessage(keys)
    }
    if(event.keyCode === 37) {
      keys.keys.left = false;
      sendMessage(keys)
    }
    if(event.keyCode === 39) {
      keys.keys.right = false;
      sendMessage(keys)
    }
    if(event.keyCode === 32) {
      sendMessage({uuid: uuid, fire: true})
    }
    if(event.keyCode === 13) {
      sendMessage({uuid: uuid, start: true})
    }
  });
}

setTimeout(function(){
  keyStrokeListeners(render.id)
}, 1000)
