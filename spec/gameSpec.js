describe("Game Model", function() {
  function uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  var game;
  var uniqueID = uuid();

  beforeEach(function() {
    // instantiate a new game...
    game = new Game();
    // instantiate a new player with an unique ID...
    game.addPlayer(uniqueID);
  });

  it("can add a player with an unique ID.", function() {
    expect(game.players[0].uuid).toEqual(uniqueID);
  });

  it("can collect snapshots of objects inside the game.", function() {
    var ship = game.players[0].ship;

    // the ship shots 10 pews...
    for (var i = 0; i < 10; i++) { ship.sayPew(); }

    // the game has eleven snapshots
    expect(game.items().length).toEqual(11);

    // ship.x
    expect(game.items()[0].x).toEqual(100);
    // ship.y
    expect(game.items()[0].y).toEqual(125);
    // ship.rad
    expect(game.items()[0].rad).toEqual(-(Math.PI/2));
    // ship.type
    expect(game.items()[0].type).toEqual("ship");

    // ship's first pew.x
    expect(game.items()[1].x).toEqual(110);
    // ship's first pew.y
    expect(game.items()[1].y).toEqual(70);
    // ship's first pew.rad
    expect(game.items()[1].rad).toEqual(-(Math.PI/2));
    // pew.type
    expect(game.items()[1].type).toEqual("pew");
  });

  it("can find a player's index within this.players array.", function(){
    game.findPlayerIndex(uniqueID);
    expect(game.findPlayerIndex(uniqueID)).toEqual(0);
  });

  it("can remove a player from a game.", function(){
    game.removePlayer(uniqueID);
    expect(game.players.length).toEqual(0);
  });

  it("is capable of making all objects move both actively and passively.", function(){
    // accelerate the ship
    game.players[0].ship.dx = 100;
    game.players[0].ship.dy = 100;

    // game moves on for one tick...
    game.makeTheWorldMove();

    var ship = game.players[0].ship;
    // ship's new coordinates
    expect(ship.x).toEqual(200);
    expect(ship.y).toEqual(200);
  });

  it("can collect every existing collidable objects.", function(){
    var uniqueID = uuid();
    game.addPlayer(uniqueID);

    var collidableObjects = game.collidableObjects();
    expect(collidableObjects.length).toEqual(2);
  });

  it("can check whether two objects are colliding or not.", function(){
    var uniqueID = uuid();
    game.addPlayer(uniqueID);

    var first_ship = game.players[0].ship;
    var second_ship = game.players[1].ship;

    expect(game.isColliding(first_ship, second_ship)).toEqual(true);
  });

  it("checks for collision and updates objects' hp.", function(){
    var uniqueID = uuid();
    game.addPlayer(uniqueID);

    var first_ship = game.players[0].ship;
    var second_ship = game.players[1].ship;

    // ships' hp before collision detection and update
    expect(first_ship.hp).toEqual(5);
    expect(second_ship.hp).toEqual(5);

    // game checks for collision
    game.ouch()

    // each ship loses one hp
    expect(first_ship.hp).toEqual(4);
    expect(second_ship.hp).toEqual(4);
  });

});
