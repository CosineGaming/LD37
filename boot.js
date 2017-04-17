function Boot()
{

}

Boot.prototype.create = function()
{

	//var Scream = scream.Scream();
	//var Brim = brim.Brim({ viewport: Scream });

	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

	game.scale.setResizeCallback(resize);

	cursors = game.input.keyboard.createCursorKeys();
	actions = {
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		chargePortal: game.input.keyboard.addKey(Phaser.Keyboard.E)
	}

	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.state.start("load");

}
