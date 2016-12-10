// Game size is 320x180, upscales as much as it can in even increments
var game = new Phaser.Game(320, 180, Phaser.AUTO);

var perspective = 4./5;

var cursors;
var actions;

var level = 1;
var levels = ["levels begin at 1"]; // Levels start at 1, ironically for technical reasons

game.state.add("boot", new Boot())
game.state.add("load", new Load());
game.state.start("boot");

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
