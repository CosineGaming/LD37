// Game size is 320x180, upscales as much as it can in even increments
var game = new Phaser.Game(320, 180, Phaser.AUTO);

// Constants n shit
var perspective = 4/5;

// State machine (the part that's not in Phaser)
var level = 1;
var levels = ["levels begin at 1"]; // Levels start at 1, ironically for technical reasons

// Across-state variables
var entropy = 0;
var cursors;
var actions;

// Add game states (EXCEPT LEVEL) here
game.state.add("boot", new Boot());
game.state.add("load", new Load());
game.state.start("boot");

// The level gamestate
function setLevel(to)
{
	level = to;
	if (level >= levels.length)
	{
		levels.push(new Phaser.Stage(game));
		game.state.add(level, new Level());
	}
	game.state.start(level);
}

function resize()
{
}
