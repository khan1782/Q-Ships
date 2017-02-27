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

    // create 10 pews for the ship...
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



});
