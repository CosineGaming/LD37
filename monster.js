function Monster(game, x, y, key, frame)
{

	var monsters = [
		{
			health: 100,
			touchDamage: 30,
			speed: 60,
			baseHeight: 8,
			consistency: 99.7,
			shoots: false
		},
		{
			health: 75,
			touchDamage: -100,
			speed: 20,
			baseHeight: 8,
			consistency: 99.4,
			shoots: true,
			firingRate: 10,
			bulletSpeed: 250,
			bulletStrength: 4,
			inaccuracy: 40
		},
		{
			health: 300,
			touchDamage: 100,
			speed: 5,
			baseHeight: 10,
			consistency: 99.7,
			shoots: false
		},
		{
			health: 200,
			touchDamage: -200,
			speed: 100,
			baseHeight: 12,
			consistency: 0,
			shoots: true,
			firingRate: 200,
			bulletSpeed: 40,
			bulletStrength: 20,
			inaccuracy: 10
		}
	];

	this.monsterType = Math.floor(Math.random() * monsters.length);
	Phaser.Sprite.call(this, game, 0, 0, "monster" + this.monsterType);

	var config = monsters[this.monsterType];
	this.initialHealth = config.health;
	this.health = this.initialHealth;
	this.touchDamage = config.touchDamage / 60;
	this.speed = config.speed;
	this.baseHeight = config.baseHeight;
	this.shoots = config.shoots;
	this.firingRate = config.firingRate;
	this.bulletCountdown = 0;
	this.bulletSpeed = config.bulletSpeed;
	this.bulletStrength = config.bulletStrength;
	this.inaccuracy = config.inaccuracy;

	// TODO: Do this more responsibly
	this.state = game.state.states[levels.length-1];

	this.x = Math.random() * (320 - 64 - 3 - 3) + 3;
	this.y = Math.random() * (180 - 64 - 52) + 52;
	
	// 0 moved away from portal
	// 1 still near spawn at portalUp
	// 2 still near spawn at portalDown
	this.portalPast = 0;

	this.aggressive = true;
	this.toPortal = false;
	this.confidence = 1 - (Math.random() * (1-config.consistency/100) + config.consistency/100);

}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Player;

Monster.prototype.moveToLevel = function(to)
{
	this.state.monsters.removeChild(this);
	if (this.healthBar)
	{
		this.healthBar.kill();
		// So it will be regenerated next time
		delete this.healthBar;
	}
	this.portalPast = (to.storedLevel < this.state.storedLevel ? 1 : 2);
	this.state = to;
	this.state.monsters.add(this);
}

Monster.prototype.update = function()
{

	// HealthBar works on the current stage, so we have to wait until
	// update indicates that this is an active state
	if (typeof this.healthBar == "undefined")
	{
		var healthBarConfig = {x: this.x, y: this.y - 6, width: this.width / 2, height: 1,
		color: "#666666", bg: {color: "#444444"}, bar: {color: "#666666"}};
		this.healthBar = new HealthBar(game, healthBarConfig);
	}

	if (typeof this.body != "undefined" && this.body.offset.y == 0 && this.baseHeight != 0)
	{
		this.body.offset.y = this.baseHeight;
		this.body.width = this.width;
		this.body.height = this.height - this.baseHeight;
	}

	if (Math.random() < this.confidence)
	{
		this.aggressive = !this.aggressive;
	}
	if (typeof this.player == "undefined")
	{
		this.player = this.state.player;
	}
	if (this.aggressive)
	{
		game.physics.arcade.moveToXY(this, this.player.x, this.player.body.y - this.body.offset.y, this.speed);
	}
	else
	{
		if (typeof this.target == "undefined")
		{
			//alert("hi");
		}
		if (Math.random() < this.confidence * 2)
		{
			// Only update sometimes
			// Either run from the player or towards a portal
			// Encourage towards a portal with a random chance
			if (!this.toPortal || Math.random() < 0.5)
			{
				// Move towards the portal we didn't come in. (Always trying to phase shift)
				if (this.portalPast == 0)
					this.toPortal = Math.random() < 0.5 && this.state.portalDown ? this.state.portalDown : this.state.portalUp;
				else if (this.portalPast == 1 && this.state.portalDown)
					this.toPortal = this.state.portalDown;
				else
					this.toPortal = this.state.portalUp;
				this.toPortal = this.toPortal.body.center;
			}
			else
			{
				this.toPortal = false;
			}
		}
		if (this.toPortal)
		{
			game.physics.arcade.moveToXY(this, this.toPortal.x - this.body.center.x, this.toPortal.y - this.body.center.y, this.speed);
		}
		else
		{
			// Move towards the opposite of the direction towards the player away from this.
			// AKA: Phaser hack.
			game.physics.arcade.moveToXY(this, 2 * this.x - this.player.x, 2 * this.y - this.player.y, this.speed);
		}
	}
	if (game.physics.arcade.collide(this, this.state.walls))
	{
		if (Math.random() < this.confidence * 10)
		{
			this.aggressive = true;
		}
	}
	if (this.shoots)
	{

		this.bulletCountdown -= 1;
		if (this.bulletCountdown <= 0)
		{
			this.bulletCountdown = this.firingRate;
			var bullet = this.state.enemyBullets.create(this.body.center.x, this.body.center.y, "enemyBullet");
			bullet.checkWorldBounds = true;
			bullet.outOfBoundsKill = true;
			game.physics.arcade.enable(bullet);
			var x = this.player.body.x + this.player.body.width/2 + Math.random() * this.inaccuracy - this.inaccuracy / 2;
			var y = this.player.body.y + this.player.body.height/2 + Math.random() * this.inaccuracy - this.inaccuracy / 2;
			bullet.rotation = game.physics.arcade.moveToXY(bullet, x, y, this.bulletSpeed);
			bullet.strength = this.bulletStrength;
		}

	}

	var distance = 27;
	var closePortalUp = Phaser.Point.distance(this.body.center, this.state.portalUp.body.center) < distance;
	var closePortalDown = false;
	// On the first level, there is no portal down
	if (this.state.portalDown)
	{
		closePortalDown = Phaser.Point.distance(this.body.center, this.state.portalDown.body.center) < distance;
	}
	// We are close to a portal that is not portalPast
	if ((closePortalUp && this.portalPast != 1) || (closePortalDown && this.portalPast != 2))
	{
		// We have wandered to a portal. Teleport?
		var graphicalShiftChance = 1; // Percent
		if (Math.random() < graphicalShiftChance / 100)
		{
			// Some shenanigans to be able to use the state's levelShift function
			// TODO: Probably make this better code
			var direction = closePortalDown ? -1 : 1;
			var levelTo = this.state.storedLevel + direction;
			setLevel(levelTo, false); // Ensure level exists
			var stateTo = game.state.states[levelTo];
			stateTo.levelShift(levelTo, direction, this);
			return;
		}
	}

	game.physics.arcade.collide(this, this.state.bullets, function(monster, bullet)
	{
		monster.health -= monster.player.bulletStrength;
		bullet.destroy();
		if (Math.random() < 0.5) // TODO: Make this based on this.confidence?
		{
			monster.aggressive = false;
		}
	});
	if (this.health <= 0)
	{
		// Entropy decreases on killing monsters
		entropy -= 1;
		this.state.entropyText();
		this.healthBar.kill();
		this.destroy();
	}
	this.healthBar.setPosition(this.x + this.width / 2, this.y - 6);
	this.healthBar.setPercent(100 * this.health / this.initialHealth);

}
