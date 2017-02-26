document.addEventListener("DOMContentLoaded", function(event) {

  // initialize a game
  game = new Game()

  // hard coded dummy
  // game.players.push(new Player)
  // game.players[0].ship.y = 300

  //  game starts its internal universe loop
  game.gameLoop();

  // establishing the socket
  function Websocket(){}
  websock = new Websocket

  setInterval(function(){
    if (websock.sent === true){
      game.updateEntity(websock.package);
      websock.sent = false
    }
  },1000/50)
});





 //document event listener for keydown
    document.addEventListener('keyup', function(event){
    //listening for up
    if(event.keyCode === 13) {
      console.log("you added a player!")
    //we are pretending that this is a ws.onConnection - {
      // onOpen = function(){
        game.addPlayer(12345);

      // }
      //ws.onMessage()
        // game.updateEntity(msg.data)
    }
  });





// wss.on('connection', function(ws){
  //game.addPlayer(ws.uuid)
//   ws.on('message', function(message){
 //     wss.clients.forEach(function(conn){
  // broadcast
//       conn.send(message);
//     })
//   })
// });




