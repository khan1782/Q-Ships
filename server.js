'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const Game = require('./src/models/game.js')

const PORT = 80;
const INDEX = path.join(__dirname, 'index.html');

const app = express();
// app.use('/css', express.static('css'));
app.use('/js', express.static('src'));
app.use((req, res) => res.sendFile(INDEX));

const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ port: 80 });

var game = new Game()

game.gameLoop()



var CLIENTS = [];
//in some situation, receive on close, and trying to remove form client, set interval and interupts it.
wss.on('connection', (ws) => {
  console.log('Client connected');
  CLIENTS.push(ws)
  var playerID = CLIENTS.indexOf(ws)
  game.addPlayer(playerID);

  //example incoming message: {uuid: uuid, keys: {up: false, down: false, left: false, right: false}
  ws.on('message', (ws) => {
    game.updateEntity(ws)
  });
});

//outgoing snapshots of game loop

setInterval(() => {
  for(var i = 0; i<CLIENTS.length; i++){
    //calling readyState on client returns 0 1 2 3
      //0 means connection is not established
      //1 is connection established
      //2 is in closing handshake
      //3 connection closed or could not open
    if(CLIENTS[i] !== undefined && CLIENTS[i].readyState === 1){
      CLIENTS[i].send(game.snapshot(i))
    } else if(CLIENTS[i] !== undefined && CLIENTS[i].readyState === 3){
      game.removePlayer(i)
      delete CLIENTS[i]
      //when all players leave, reset the array of clients
      if(CLIENTS.join("").length === 0){
        CLIENTS = []
      }
    }
    // }
  }
}, 1000/50);
