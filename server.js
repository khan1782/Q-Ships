'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const Game = require('./src/models/game.js')

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const app = express();
app.use('/css', express.static('css'));
app.use('/js', express.static('src'));
app.use((req, res) => res.sendFile(INDEX));

const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

var game = new Game()

game.gameLoop()


var CLIENTS = [];

//in some situation, receive on close, and trying to remove form client, set interval and interupts it.
wss.on('connection', (ws) => {
  CLIENTS.push(ws);
  var playerIndex = CLIENTS.indexOf(ws);
  console.log('Client connected');
  game.addPlayer(playerIndex)
  ws.on('message', (ws) => {
    var playerKeyStrokes =  ws;
    game.updateEntity(playerKeyStrokes)
  });
  ws.on('close', (client) => {
    //loop through clients and find the client that quit and remove them
    CLIENTS.splice(CLIENTS.indexOf(client),1);
    console.log('Client disconnected');
})
});

setInterval(() => {
  //what if this contains a disconnected client
  for (var j = 0; j < CLIENTS.length; j++) {
    CLIENTS[j].send(game.snapshot(j))
  }
}, 1000/60);
