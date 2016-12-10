function Load()
{

}

Load.prototype.preload = function()
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

	game.renderer.renderSession.roundPixels = true;
	// TODO: Make work
	// Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	// Phaser.Canvas.setSmoothingEnabled(game.context, false);
	game.physics.startSystem(Phaser.Physics.ARCADE);

}

Load.prototype.create = function()
{
	setLevel(1);
}