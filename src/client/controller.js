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

//build array of local object
var itemsNearby = function(snapshot) {
  var x = snapshot.player.x;
  var y = snapshot.player.y;
  var xtoEdge = window.innerWidth / 2;
  var ytoEdge = window.innerHeight / 2;
  var xoffset = xtoEdge - x;
  var yoffset = ytoEdge - y;
  var width = 2500;
  var height = 2500;
  var items = snapshot.items;
  var neighbors = [];
  for (var i = 0; i < items.length; i++) {
    if (x < xtoEdge && (width - items[i].x + x) < xtoEdge) {
      items[i].x -= width;
    }
    if (x > width - xtoEdge && (width + items[i].x - x ) < xtoEdge) {
      items[i].x += width;
    }
    if(y < ytoEdge && (height - items[i].y + y) < ytoEdge){
      items[i].y -= height
    }
    if (y > width - ytoEdge && (height + items[i].y - y ) < ytoEdge) {
      items[i].y += height;
    }
    if (Math.abs(items[i].x-x) < xtoEdge && Math.abs(items[i].y-y) < ytoEdge) {
      items[i].x += xoffset;
      items[i].y += yoffset;
      neighbors.push(items[i]);
    }
  }
  return neighbors;
}

//initialize renderer machinery *wa wa wa wa*
render = new Renderer(canvas);

ws.onmessage = function (event) {
  // parse the package from the server
  var snapshot = JSON.parse(event.data);

  // get all the stars from starfield
  var stars = starfield.stars;

  var starObjects = [];
  for(var i = 0 ;i < stars.length; i++){
    var starObject = {
      x: stars[i].x,
      y: stars[i].y,
      rad: 0,
      type: stars[i].type
    }
    snapshot.items.push(starObject);
  }

  render.objectsArray = itemsNearby(snapshot);
  render.player = snapshot.player;
  render.showState(snapshot.player.state);
  render.showScores(snapshot.scores);
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

//TODO: fix this hack
setTimeout(function(){
  keyStrokeListeners(render.player.id)
}, 1000)
