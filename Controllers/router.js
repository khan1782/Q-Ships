document.addEventListener("DOMContentLoaded", function(event) {

  game = new Game()
  game.players.push(new Player)
  game.players.push(new Player)
  game.players[0].ship.y = 300


  game.gameLoop();
  websock = new Websocket

	setInterval(function(){
		if (websock.sent === true){
			game.updateEntity(websock.package);
			websock.sent = false
		}
	},1000/50)


});




function Websocket(){

}
