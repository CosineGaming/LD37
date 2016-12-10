function Level()
{

	this.player = undefined;
	this.walls = undefined;
	this.portalUp = undefined;
	this.portalDown = undefined;
	this.portalUpHold = 0;
	this.portalDownHold = 0;
	this.isNew = true;

}

Level.prototype.create = function()
{

	game.stage = levels[level];

	if (this.isNew)
	{

		game.renderer.renderSession.roundPixels = true;
		// TODO: Make work
		// Phaser.Canvas.setImageRenderingCrisp(game.canvas);
		// Phaser.Canvas.setSmoothingEnabled(game.context, false);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.addChild(game.make.sprite(0, 0, "floor"));

		this.walls = game.stage.addChild(game.make.group());
		this.walls.enableBody = true;
		var top = this.walls.create(0, 0);
		top.body.width = 320;
		top.body.height = 26;
		top.body.immovable = true;
		var top = this.walls.create(0, 0);
		top.body.width = 3;
		top.body.height = 180;
		top.body.immovable = true;
		var top = this.walls.create(317, 0);
		top.body.width = 3;
		top.body.height = 180;
		top.body.immovable = true;

		var portalLocations = [[80, 60],  [160, 60],  [240, 60],
		                       [80, 120], [160, 120], [240, 120]];
		// Pick a portal and remove it from the list
		var up = portalLocations.splice(Math.floor(Math.random() * 6), 1)[0];
		this.portalUp = game.stage.addChild(game.make.sprite(up[0], up[1], "portal"));
		game.physics.arcade.enable(this.portalUp);
		// Prevent from going to levels[0]
		if (level != 1)
		{
			// Pick a portal from the reduced list
			var down = portalLocations[Math.floor(Math.random() * 5)];
			this.portalDown = game.stage.addChild(game.make.sprite(down[0], down[1], "portal"));
			game.physics.arcade.enable(this.portalDown);
		}

		this.player = game.stage.addChild(game.make.sprite(0, 0, "player"));
		game.physics.arcade.enable(this.player);
		this.player.body.offset = new Phaser.Point(0, 17)
		this.player.body.width = 20;
		this.player.body.height = 0;

	}

	this.isNew = false;

}

Level.prototype.update = function()
{
	console.log("Hello")
	var speed = 25;
	var friction = .85;
	if (cursors.left.isDown || actions.left.isDown)
	{
		this.player.body.velocity.x -= speed;
	}
	if (cursors.right.isDown || actions.right.isDown)
	{
		this.player.body.velocity.x += speed;
	}
	if (cursors.up.isDown || actions.up.isDown)
	{
		this.player.body.velocity.y -= speed * perspective;
	}
	if (cursors.down.isDown || actions.down.isDown)
	{
		this.player.body.velocity.y += speed * perspective;
	}
	if (cursors.down.isDown && actions.down.isDown && this.portalDownHold == 0)
	{
		this.portalDownHold = 60;
		setLevel(level - 1);
	}
	this.player.body.velocity.x *= friction;
	this.player.body.velocity.y *= friction;

	var distance = 27;
	var holdFrames = 100;
	var withinDecreaseSpeed = 1;
	var decreaseSpeed = 2;
	var goingDown = false;
	var chargeKeep = 0.5;
	if (actions.chargePortal.isDown)
	{
		if (Phaser.Point.distance(this.player.body.center, this.portalUp.body.center) < distance)
		{
			this.portalUpHold++;
			if (this.portalUpHold > holdFrames)
			{
				this.portalUpHold *= chargeKeep;
				setLevel(level + 1);
			}
		}
		else if (this.portalDown && Phaser.Point.distance(this.player.body.center, this.portalDown.body.center) < distance)
		{
			this.portalDownHold++;
			if (this.portalDownHold > holdFrames)
			{
				this.portalDownHold *= chargeKeep;
				setLevel(level - 1);
			}
		}
		else
		{
			goingDown = withinDecreaseSpeed;
		}
	}
	else
	{
		goingDown = decreaseSpeed;
	}
	if (goingDown)
	{
		if (this.portalUpHold > 0)
		{
			this.portalUpHold -= goingDown;
		}
		if (this.portalUpHold < 0)
		{
			this.portalUpHold = 0;
		}
		if (this.portalDownHold > 0)
		{
			this.portalDownHold -= goingDown;
		}
		if (this.portalDownHold < 0)
		{
			this.portalDownHold = 0;
		}
	}
	this.portalUp.tint = Phaser.Color.getColor(255, 255 * (1 - this.portalUpHold / holdFrames), 255 * (1 - this.portalUpHold / holdFrames));
	if (this.portalDown)
	{
		this.portalDown.tint = Phaser.Color.getColor(255, 255 * (1 - this.portalDownHold / holdFrames), 255 * (1 - this.portalDownHold / holdFrames));
	}

	game.physics.arcade.collide(this.player, this.walls);

}
