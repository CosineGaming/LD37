// Game size is 320x180, upscales as much as it can in even increments
var game = new Phaser.Game(320, 180, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var cursors;
var wasd;

function preload()
{
	game.load.image("floor", "assets/floor.png");
	game.load.image("player", "assets/player.png");
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(4, 4);
	cursors = game.input.keyboard.createCursorKeys();
	wasd = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
	}
}

function create()
{
	game.renderer.renderSession.roundPixels = true;

	game.add.sprite(0, 0, "floor");
	player = game.add.sprite(0, 0, "player");
	game.physics.arcade.enable(player);
	game.camera.roundPx = true;

}

function update()
{
	var speed = 25;
	var friction = .85;
	if (cursors.left.isDown || wasd.left.isDown)
	{
		player.body.velocity.x -= speed;
	}
	if (cursors.right.isDown || wasd.right.isDown)
	{
		player.body.velocity.x += speed;
	}
	if (cursors.up.isDown || wasd.up.isDown)
	{
		player.body.velocity.y -= speed;
	}
	if (cursors.down.isDown || wasd.down.isDown)
	{
		player.body.velocity.y += speed;
	}
	player.body.velocity.x *= friction;
	player.body.velocity.y *= friction;
}

function resize()
{
}
