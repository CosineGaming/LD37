function Load()
{

}

Load.prototype.preload = function()
{

	game.load.image("floor", "assets/floor.png");
	game.load.image("frontWall", "assets/frontWall.png");
	game.load.image("player", "assets/player.png");
	game.load.image("test", "assets/test.png");
	game.load.image("portalUp", "assets/portalUp.png");
	game.load.image("portalDown", "assets/portalDown.png");
	game.load.image("cracks0", "assets/cracks0.png");
	game.load.image("cracks1", "assets/cracks1.png");
	game.load.image("cracks2", "assets/cracks2.png");
	game.load.image("cracks3", "assets/cracks3.png");
	game.load.image("bullet", "assets/bullet.png");
	game.load.image("arabic", "assets/adobe-arabic-font.png");
	game.load.image("monster0", "assets/monster0.png");
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