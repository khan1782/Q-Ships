var HOST = location.origin.replace(/^http/, "ws");
var ws = new WebSocket(HOST);

var background = document.getElementById("background-container");

// initialize new starfield beep beep boop
var starfield = new Starfield();

// run initialize on initialized starfield
starfield.initialize(background);

// begin starfield loop
starfield.start();

// identify game canvas
var canvas = document.getElementById("gameCanvas");
var render = new Renderer(canvas);

var localPlayerId;
var inputsInitialized = false;

function sendSocketMessage(msg) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  }
}

function viewportSize() {
  if (render && render.viewportWidth && render.viewportHeight) {
    return { width: render.viewportWidth, height: render.viewportHeight };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

// build array of local object
var itemsNearby = function(snapshot) {
  var x = snapshot.player.x;
  var y = snapshot.player.y;
  var viewport = viewportSize();
  var xtoEdge = viewport.width / 2;
  var ytoEdge = viewport.height / 2;
  var xoffset = xtoEdge - x;
  var yoffset = ytoEdge - y;
  var width = 2500;
  var height = 2500;
  var items = snapshot.items;
  var neighbors = [];

  for (var i = 0; i < items.length; i++) {
    if (x < xtoEdge && width - items[i].x + x < xtoEdge) {
      items[i].x -= width;
    }
    if (x > width - xtoEdge && width + items[i].x - x < xtoEdge) {
      items[i].x += width;
    }
    if (y < ytoEdge && height - items[i].y + y < ytoEdge) {
      items[i].y -= height;
    }
    if (y > height - ytoEdge && height + items[i].y - y < ytoEdge) {
      items[i].y += height;
    }
    if (Math.abs(items[i].x - x) < xtoEdge && Math.abs(items[i].y - y) < ytoEdge) {
      items[i].x += xoffset;
      items[i].y += yoffset;
      neighbors.push(items[i]);
    }
  }
  return neighbors;
};

ws.onmessage = function(event) {
  // parse the package from the server
  var snapshot = JSON.parse(event.data);

  localPlayerId = snapshot.player.id;
  if (!inputsInitialized && localPlayerId !== undefined) {
    keyStrokeListeners(localPlayerId);
    inputsInitialized = true;
  }

  // get all the stars from starfield
  var stars = starfield.stars;
  for (var i = 0; i < stars.length; i++) {
    var starObject = {
      x: stars[i].x,
      y: stars[i].y,
      rad: 0,
      type: stars[i].type
    };
    snapshot.items.unshift(starObject);
  }

  render.objectsArray = itemsNearby(snapshot);
  render.player = snapshot.player;
  if (render.player.canNuke) {
    render.announceNuke();
  }
  render.showState(snapshot.player.state);
  render.showScores(snapshot.scores);
  syncMobileActionButtons(snapshot.player);
};

render.tickTock();

function syncMobileActionButtons(player) {
  var fireButton = document.getElementById("action-fire");
  var rocketButton = document.getElementById("action-rocket");
  var nukeButton = document.getElementById("action-nuke");

  var alive = !!(player && player.state === 2);
  var rocketReady = !!(alive && player.arsenal);
  var nukeReady = !!(alive && player.canNuke);

  if (fireButton) {
    fireButton.disabled = !alive;
  }
  if (rocketButton) {
    rocketButton.disabled = !rocketReady;
    rocketButton.classList.toggle("is-ready", rocketReady);
  }
  if (nukeButton) {
    nukeButton.disabled = !nukeReady;
    nukeButton.classList.toggle("is-ready", nukeReady);
  }
}

//----------------------------------------------

function keyStrokeListeners(uuid) {
  var keys = { uuid: uuid, keys: { up: false, down: false, left: false, right: false } };

  function sendMovementKeys(nextKeys) {
    var changed = false;
    if (keys.keys.up !== nextKeys.up) {
      keys.keys.up = nextKeys.up;
      changed = true;
    }
    if (keys.keys.down !== nextKeys.down) {
      keys.keys.down = nextKeys.down;
      changed = true;
    }
    if (keys.keys.left !== nextKeys.left) {
      keys.keys.left = nextKeys.left;
      changed = true;
    }
    if (keys.keys.right !== nextKeys.right) {
      keys.keys.right = nextKeys.right;
      changed = true;
    }
    if (changed) {
      sendSocketMessage(keys);
    }
  }

  function setSingleKey(keyName, value) {
    if (keys.keys[keyName] !== value) {
      keys.keys[keyName] = value;
      sendSocketMessage(keys);
    }
  }

  function sendAction(actionName) {
    var action = { uuid: uuid };
    action[actionName] = true;
    sendSocketMessage(action);
  }

  document.addEventListener("keydown", function(event) {
    if (event.keyCode === 38) {
      event.preventDefault();
      setSingleKey("up", true);
    }
    if (event.keyCode === 40) {
      event.preventDefault();
      setSingleKey("down", true);
    }
    if (event.keyCode === 37) {
      event.preventDefault();
      setSingleKey("left", true);
    }
    if (event.keyCode === 39) {
      event.preventDefault();
      setSingleKey("right", true);
    }
  });

  document.addEventListener("keyup", function(event) {
    if (event.keyCode === 38) {
      setSingleKey("up", false);
    }
    if (event.keyCode === 40) {
      setSingleKey("down", false);
    }
    if (event.keyCode === 37) {
      setSingleKey("left", false);
    }
    if (event.keyCode === 39) {
      setSingleKey("right", false);
    }
    if (event.keyCode === 32) {
      sendAction("fire");
    }
    if (event.keyCode === 78 && render.player && render.player.canNuke) {
      sendAction("nuke");
    }
    if (event.keyCode === 88) {
      sendAction("launch");
    }
    if (event.keyCode === 13) {
      updateName();
    }
  });

  setupMobileControls(sendMovementKeys, sendAction);
}

function setupMobileControls(sendMovementKeys, sendAction) {
  var movementPad = document.getElementById("movement-pad");
  var movementKnob = document.getElementById("movement-knob");
  var fireButton = document.getElementById("action-fire");
  var rocketButton = document.getElementById("action-rocket");
  var nukeButton = document.getElementById("action-nuke");

  if (!movementPad || !movementKnob) {
    return;
  }

  var activePointerId = null;
  var centerX = 0;
  var centerY = 0;
  var maxDistance = 1;

  function updatePadMetrics() {
    var rect = movementPad.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    maxDistance = rect.width * 0.38;
  }

  function resetStick() {
    movementKnob.style.transform = "translate(-50%, -50%)";
    sendMovementKeys({ up: false, down: false, left: false, right: false });
  }

  function updateMovement(dx, dy) {
    var distance = Math.sqrt(dx * dx + dy * dy);
    var scale = distance > maxDistance ? maxDistance / distance : 1;
    var clampedX = dx * scale;
    var clampedY = dy * scale;
    var threshold = 0.35;
    var normalizedX = clampedX / maxDistance;
    var normalizedY = clampedY / maxDistance;

    movementKnob.style.transform =
      "translate(calc(-50% + " + clampedX + "px), calc(-50% + " + clampedY + "px))";

    sendMovementKeys({
      up: normalizedY < -threshold,
      down: normalizedY > threshold,
      left: normalizedX < -threshold,
      right: normalizedX > threshold
    });
  }

  function onPointerDown(event) {
    if (activePointerId !== null) {
      return;
    }
    event.preventDefault();
    updatePadMetrics();
    activePointerId = event.pointerId;
    movementPad.setPointerCapture(activePointerId);
    updateMovement(event.clientX - centerX, event.clientY - centerY);
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }
    event.preventDefault();
    updateMovement(event.clientX - centerX, event.clientY - centerY);
  }

  function onPointerEnd(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }
    event.preventDefault();
    activePointerId = null;
    resetStick();
  }

  function bindActionButton(button, actionName, guardFn) {
    if (!button) {
      return;
    }

    button.addEventListener("pointerdown", function(event) {
      event.preventDefault();
      if (!guardFn || guardFn()) {
        sendAction(actionName);
      }
    });

    button.addEventListener("contextmenu", function(event) {
      event.preventDefault();
    });
  }

  movementPad.addEventListener("pointerdown", onPointerDown);
  movementPad.addEventListener("pointermove", onPointerMove);
  movementPad.addEventListener("pointerup", onPointerEnd);
  movementPad.addEventListener("pointercancel", onPointerEnd);
  movementPad.addEventListener("lostpointercapture", function() {
    activePointerId = null;
    resetStick();
  });
  movementPad.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });

  window.addEventListener("resize", updatePadMetrics);
  window.addEventListener("orientationchange", updatePadMetrics);

  bindActionButton(fireButton, "fire", function() {
    return !!(render.player && render.player.state === 2);
  });
  bindActionButton(rocketButton, "launch", function() {
    return !!(render.player && render.player.state === 2 && render.player.arsenal);
  });
  bindActionButton(nukeButton, "nuke", function() {
    return !!(render.player && render.player.state === 2 && render.player.canNuke);
  });

  updatePadMetrics();
  resetStick();
}

var updateName = function() {
  var nameForm = document.getElementById("player-name");
  var clientName = nameForm.value;
  var playerId = localPlayerId;

  if (playerId === undefined && render.player) {
    playerId = render.player.id;
  }
  if (playerId === undefined) {
    return;
  }

  sendSocketMessage({ uuid: playerId, start: true, name: clientName });
  var playerNameDiv = document.getElementById("player-name-div");
  playerNameDiv.setAttribute("class", "hidden");
};
