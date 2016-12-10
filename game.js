// Game size is 320x180, upscales as much as it can in even increments
var game = new Phaser.Game(320, 180, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var perspective = 4./5;

var cursors;
var actions;

var player;
var walls;
var portalUp;
var portalDown;
var portalUpHold = 0;
var portalDownHold = 0;

var level = 0;
var levels = [];

function setLevel(to)
{

	var create = false;

	if (to >= levels.length)
	{
		levels.push(new Phaser.Stage(game));
		create = true;
	}
	game.stage = levels[to];
	level = to

	if (create)
	{

		game.stage.addChild(game.make.sprite(0, 0, "floor"));

		walls = game.stage.addChild(game.make.group());
		walls.enableBody = true;
		var top = walls.create(0, 0);
		top.body.width = 320;
		top.body.height = 26;
		top.body.immovable = true;
		var top = walls.create(0, 0);
		top.body.width = 3;
		top.body.height = 180;
		top.body.immovable = true;
		var top = walls.create(317, 0);
		top.body.width = 3;
		top.body.height = 180;
		top.body.immovable = true;

		var portalLocations = [[80, 60],  [160, 60],  [240, 60],
		                       [80, 120], [160, 120], [240, 120]];
		// Pick a portal and remove it from the list
		var up = portalLocations.splice(Math.floor(Math.random() * 6), 1)[0];
		// Pick a portal from the reduced list
		var down = portalLocations[Math.floor(Math.random() * 5)];
		portalUp = game.stage.addChild(game.make.sprite(up[0], up[1], "portal"));
		game.physics.arcade.enable(portalUp);
		portalDown = game.stage.addChild(game.make.sprite(down[0], down[1], "portal"));
		game.physics.arcade.enable(portalDown);

		player = game.stage.addChild(game.make.sprite(0, 0, "player"));
		game.physics.arcade.enable(player);
		player.body.offset = new Phaser.Point(0, 17)
		player.body.width = 20;
		player.body.height = 0;

	}

}

function preload()
{

	game.load.image("floor", "assets/floor.png");
	game.load.image("player", "assets/player.png");
	game.load.image("test", "assets/test.png");
	game.load.image("portal", "assets/portal.png");
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(4, 4);

	cursors = game.input.keyboard.createCursorKeys();
	actions = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		chargePortal: game.input.keyboard.addKey(Phaser.Keyboard.E)
	}

}

function create()
{
	game.renderer.renderSession.roundPixels = true;
	// TODO: Make work
	// Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	// Phaser.Canvas.setSmoothingEnabled(game.context, false);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	setLevel(0);

}

function update()
{
	console.log("Hello")
	var speed = 25;
	var friction = .85;
	if (cursors.left.isDown || actions.left.isDown)
	{
		player.body.velocity.x -= speed;
	}
	if (cursors.right.isDown || actions.right.isDown)
	{
		player.body.velocity.x += speed;
	}
	if (cursors.up.isDown || actions.up.isDown)
	{
		player.body.velocity.y -= speed * perspective;
	}
	if (cursors.down.isDown || actions.down.isDown)
	{
		player.body.velocity.y += speed * perspective;
	}
	if (cursors.down.isDown && actions.down.isDown && portalDownHold == 0)
	{
		portalDownHold = 60;
		setLevel(level - 1);
	}
	player.body.velocity.x *= friction;
	player.body.velocity.y *= friction;

	var distance = 27;
	var holdFrames = 100;
	var decreaseSpeed = 2;
	var goingDown = false;
	if (actions.chargePortal.isDown)
	{
		if (Phaser.Point.distance(player.body.center, portalUp.body.center) < distance)
		{
			portalUpHold++;
			if (portalUpHold > holdFrames)
			{
				setLevel(level + 1);
			}
		}
		else if (Phaser.Point.distance(player.body.center, portalDown.body.center) < distance)
		{
			portalDownHold++;
			if (portalDownHold > holdFrames)
			{
				setLevel(level + 1);
			}
		}
		else
		{
			goingDown = true;
		}
	}
	else
	{
		goingDown = true;
	}
	if (goingDown)
	{
		if (portalUpHold > 0)
		{
			portalUpHold -= decreaseSpeed;
		}
		if (portalUpHold < 0)
		{
			portalUpHold = 0;
		}
		if (portalDownHold > 0)
		{
			portalDownHold -= decreaseSpeed;
		}
		if (portalDownHold < 0)
		{
			portalDownHold = 0;
		}
	}
	portalUp.tint = Phaser.Color.getColor(255, 255 * (1 - portalUpHold / holdFrames), 255 * (1 - portalUpHold / holdFrames));
	portalDown.tint = Phaser.Color.getColor(255, 255 * (1 - portalDownHold / holdFrames), 255 * (1 - portalDownHold / holdFrames));

	game.physics.arcade.collide(player, walls);

}

function resize()
{
}
