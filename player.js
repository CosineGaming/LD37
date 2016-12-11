function Player(portalUp, portalDown)
{

	this.portalUpHold = 0;
	this.portalDownHold = 0;
	this.bulletCountdown = 0;
	this.portalUp = portalUp;
	this.portalDown = portalDown;

	Phaser.Sprite.call(this, game, 0, 0, "player");
	game.physics.arcade.enable(this);
	this.body.offset = new Phaser.Point(0, 17);
	var entrance = this.portalDown;
	if (!entrance)
	{
		entrance = this.portalUp;
	}
	// Place at just below portal
	this.x = entrance.body.center.x - this.body.width / 2;
	this.y = entrance.body.bottom - this.body.height + 3;
	this.body.width = 20;
	this.body.height = 4;

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{

	var speed = 18;
	var friction = .85;
	if (cursors.left.isDown || actions.left.isDown)
	{
		this.body.velocity.x -= speed;
	}
	if (cursors.right.isDown || actions.right.isDown)
	{
		this.body.velocity.x += speed;
	}
	if (cursors.up.isDown || actions.up.isDown)
	{
		this.body.velocity.y -= speed * perspective;
	}
	if (cursors.down.isDown || actions.down.isDown)
	{
		this.body.velocity.y += speed * perspective;
	}
	if (cursors.down.isDown && actions.down.isDown && this.portalDownHold == 0)
	{
		this.portalDownHold = 60;
		setLevel(level - 1);
	}
	this.body.velocity.x *= friction;
	this.body.velocity.y *= friction;

	// Bullets
	var rate = 10;
	var start = 20;
	var speed = 150;
	if (game.input.activePointer.isDown)
	{
		if (this.bulletCountdown <= 0)
		{
			this.bulletCountdown = rate;
			var bullet = game.stage.addChild(game.make.sprite(this.x + 3, this.y + 26, "bullet"));
			bullet.outOfBoundsKill = true;
			game.physics.arcade.enable(bullet);
			var direction = game.physics.arcade.moveToPointer(bullet, speed);
			// console.log(direction + Math.PI);
			// this.body.moveTo(1, 1, direction);
		}
		else
		{
			this.bulletCountdown -= 1;
		}
	}
	else
	{
		this.bulletCountdown = start;
	}

	var distance = 27;
	var holdFrames = 100;
	var withinDecreaseSpeed = 1;
	var decreaseSpeed = 2;
	var goingDown = false;
	var chargeKeep = 0.5;
	if (actions.chargePortal.isDown)
	{
		if (Phaser.Point.distance(this.body.center, this.portalUp.body.center) < distance)
		{
			this.portalUpHold++;
			if (this.portalUpHold > holdFrames)
			{
				this.portalUpHold *= chargeKeep;
				entropy += 1;
				setLevel(level + 1);
			}
		}
		else if (this.portalDown && Phaser.Point.distance(this.body.center, this.portalDown.body.center) < distance)
		{
			this.portalDownHold++;
			if (this.portalDownHold > holdFrames)
			{
				this.portalDownHold *= chargeKeep;
				entropy += 1;
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

	game.physics.arcade.collide(this, this.walls);

}
