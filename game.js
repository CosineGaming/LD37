// Offer to mobile people to add this nice web app to home screen full screen
//var x = addToHomescreen();

//var scream = require("scream");
//var brim = require("brim");

// Game size is 320x180, upscales as much as it can in even increments
var game = new Phaser.Game(320, 180, Phaser.CANVAS, "game", null, false, false);

// Constants n shit
var perspective = 4/5;

// State machine (the part that's not in Phaser)
var level = 1;
var levels = ["levels begin at 1"]; // Levels start at 1, ironically for technical reasons

// Across-state variables
var entropy = 5;
var health = 100;
var cursors;
var actions;
var positioned = false;

// Add game states (EXCEPT LEVEL) here
game.state.add("boot", new Boot());
game.state.add("load", new Load());
game.state.add("lose", new Lose());
game.state.start("boot");

// Create and store a level, given index `to`
// If view is true (default), also switch to it
function setLevel(to, view)
{
	if (typeof view == "undefined")
	{
		view = true;
	}
	while (to >= levels.length)
	{
		levels.push(new Phaser.Stage(game));
		var state = new Level(to);
		game.state.add(levels.length-1, state);
		state.draw();
	}
	if (view)
	{
		level = to;
		game.state.start(level);
	}
}

function resize(scale, parentBounds)
{
	if (parentBounds.width != 0)
	{
		// Biggest thing that fits into the screen
		// Add 2 to avoid fencepost / misreporting / scrollbar errors
		var scale = Math.min((window.innerWidth + 2) / 320, (window.innerHeight + 2) / 180);
		if (scale >= 3 && !game.device.touch)
		{
			// If we have room, make it even pixel size
			scale = Math.floor(scale);
			var parent = document.getElementById("container");
			parent.style.maxWidth = scale * 320 + 100 + "px";
		}
		else if (!positioned)
		{
			document.body.innerHTML = "";
			document.body.appendChild(game.canvas);
			document.body.style.background = "black";
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.refresh();
			positioned = true;
		}
		game.scale.setUserScale(scale, scale);
	}
}
