'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });


var game = new Game()
game.gameLoop()






var CLIENTS = [];

for (var i = 0; i < 50; i++) {
  console.log("asd");
}
wss.on('connection', (ws) => {
  CLIENTS.push(ws);
  var playerIndex = CLIENTS.indexOf(ws);
  console.log('Client connected');
  game.addPlayer(playerIndex)
  ws.on('message', (ws) => {
    var playerKeyStrokes =  ws;
    game.updateEntity(playerKeyStrokes)
  });
  ws.on('close', () => console.log('Client disconnected'));
});


setInterval(() => {
  for (var j = 0; j < CLIENTS.length; j++) {
    CLIENTS[j].send(game.snapshot(j))
  }
}, 1000/60);





















// document.addEventListener("DOMContentLoaded", function(event) {

//   // initialize a game
//   game = new Game()

//   // hard coded dummy
//   // game.players.push(new Player)
//   // game.players[0].ship.y = 300

//   //  game starts its internal universe loop
//   game.gameLoop();

//   // establishing the socket
//   function Websocket(){}
//   websock = new Websocket

//   setInterval(function(){
//     if (websock.sent === true){
//       game.updateEntity(websock.package);
//       websock.sent = false
//     }
//   },1000/50)
// });





//  //document event listener for keydown
//     document.addEventListener('keyup', function(event){
//     //listening for up
//     if(event.keyCode === 13) {
//       console.log("you added a player!")
//     //we are pretending that this is a ws.onConnection - {
//       // onOpen = function(){
//         game.addPlayer(12345);

//       // }
//       //ws.onMessage()
//         // game.updateEntity(msg.data)
//     }
//   });





// // wss.on('connection', function(ws){
//   //game.addPlayer(ws.uuid)
// //   ws.on('message', function(message){
//  //     wss.clients.forEach(function(conn){
//   // broadcast
// //       conn.send(message);
// //     })
// //   })
// // });




