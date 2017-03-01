describe("Game Model", function() {

  beforeEach(function() {
    game = new Game();
    game.addPlayer(3000);
    game.players[0].state = 2;
    ship = game.players[0].ship;
    ship.type = "ship";
  });

  it("can add a player with an unique ID.", function() {
    expect(game.players[0].uuid).toEqual(3000);
  });

  it("can collect snapshots of objects inside the game.", function() {
    // the ship shots 10 pews...
    for (var i = 0; i < 10; i++) { ship.sayPew(); }

    // the game has forteen snapshots
    expect(game.items().length).toEqual(14);

    expect(game.items()[0].type).toEqual("ship");
    expect(game.items()[1].type).toEqual("pew");
  });

  it("can find a player's index within this.players array.", function(){
    game.findPlayerIndex(3000);
    expect(game.findPlayerIndex(3000)).toEqual(0);
  });

  it("can remove a player from a game.", function(){
    game.removePlayer(3000);
    expect(game.players.length).toEqual(0);
  });

  it("is capable of making all objects move both actively and passively.", function(){
    ship.x = 100;
    ship.y = 100;

    // accelerate the ship
    ship.dx = 100;
    ship.dy = 100;

    // game moves on for one tick...
    game.makeTheWorldMove();

    // ship's new coordinates
    expect(ship.x).toEqual(200);
    expect(ship.y).toEqual(200);
  });

  it("can collect every existing collidable objects.", function(){
    var collidableObjects = game.collidableObjects();
    expect(collidableObjects.length).toEqual(4);
  });

  it("can check whether two objects are colliding or not.", function(){
    game.addPlayer(8000);
    var player_two = game.players[1];
    player_two.state = 2;
    var second_ship = player_two.ship;
    second_ship.type = "ship"
    var first_ship = ship;

    first_ship.x = 100;
    first_ship.y = 100;

    second_ship.x = 100;
    second_ship.y = 100;

    expect(game.isColliding(first_ship, second_ship)).toEqual(true);
  });

  it("checks for collision and updates objects' hp.", function(){
    game.addPlayer(8000);
    var player_two = game.players[1];
    player_two.state = 2;
    var second_ship = player_two.ship;
    second_ship.type = "ship"
    var first_ship = ship;

    first_ship.x = 100;
    first_ship.y = 100;

    second_ship.x = 100;
    second_ship.y = 100;

    // ships' hp before collision detection and update
    expect(first_ship.hp).toEqual(5);
    expect(second_ship.hp).toEqual(5);

    // game checks for collision
    game.ouch()

    // each ship loses one hp
    expect(first_ship.hp).toEqual(4);
    expect(second_ship.hp).toEqual(4);
  });

  it("can spawn asteroids.",function(){
    // initially spawned asteroids
    expect(game.asteroids.length).toEqual(3);

    // manually spawning a new asteroid
    game.spawnAsteroid();
    expect(game.asteroids.length).toEqual(4);
  });

  it("can explode pews and create shrapnel from the explosion.",function(){
    // the ship shots 10 pews...
    for (var i = 0; i < 10; i++) { ship.sayPew(); }
    // manually making them hitting a target
    for (var j = 0; j < ship.pewBay.length; j++) {
      ship.pewBay[j].hp = 0;
      ship.pewBay[j].isExpired = false;
    }
    var explodingPews = ship.removePew();
    for (var k = 0; k < explodingPews.length; k++){
      game.explodePew(explodingPews[k]);
    }
    expect(game.shrapnel.length).toEqual(80);
  });

  it("can explode ships and create shrapnel from the explosion.",function(){
    game.explodeShip(ship.x, ship.y);
    expect(game.shrapnel.length).toEqual(40);
  });

  it("can explode asteroids and create debris.",function(){
    var explodingAsteroid = game.asteroids[0];
    explodingAsteroid.hp = 0;
    game.explodeRock(explodingAsteroid.x, explodingAsteroid.y);
    expect(game.debris.length).toEqual(28);
  });

  it("is capable of cleaning up shrapnel from explosions.",function(){
    game.explodeShip(ship.x, ship.y);
    expect(game.shrapnel.length).toEqual(40);
    for(var i = 0; i < game.shrapnel.length; i++){
      game.shrapnel[i].isExpired = true;
    }

    for(var j = 0; j < 6; j++){
      game.removeShrapnel();
    }
    expect(game.shrapnel.length).toEqual(0);
  });

  it("is capable of cleaning up debris from a asteroid explosions.",function(){
    var explodingAsteroid = game.asteroids[0];
    explodingAsteroid.hp = 0;
    game.explodeRock(explodingAsteroid.x, explodingAsteroid.y);
    expect(game.debris.length).toEqual(28);

    for(var i = 0; i < game.debris.length; i++){
      game.debris[i].isExpired = true;
    }

    for(var j = 0; j < 5; j++){
      game.removeDebris();
    }
    expect(game.debris.length).toEqual(0);
  });
});
















