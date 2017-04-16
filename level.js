function Level(storedLevel)
{

	this.isNew = true;
	this.crackTypes = 2;
	this.monsterTypes = 1;
	this.lastEntropy = 0;
	this.bullets;
	if (typeof storedLevel == "undefined")
		storedLevel = 0;
	this.storedLevel = storedLevel;

}

Level.prototype.makeCracks = function(cracks)
{
	for (var i=0; i<cracks; i++)
	{
		var type = "cracks" + Math.floor(Math.random() * this.crackTypes);
		var crack = this.cracks.create(0, 0, type);
		crack.x = Math.random() * (320 - 64 - 3 - 3) + 3;
		crack.y = Math.random() * (180 - 64 - 52) + 52;
	}
}

Level.prototype.draw = function()
{
	var storedStage = levels[this.storedLevel];

	var cracks = 0.2;

	if (this.isNew)
	{

		storedStage.addChild(game.make.sprite(0, 0, "floor"));

		this.walls = storedStage.addChild(game.make.group());
		this.walls.enableBody = true;
		var wall = this.walls.create(0, 0);
		wall.body.width = 320;
		wall.body.height = 26;
		wall.body.immovable = true;
		wall = this.walls.create(0, 0);
		wall.body.width = 3;
		wall.body.height = 200;
		wall.body.immovable = true;
		wall = this.walls.create(317, 0);
		wall.body.width = 3;
		wall.body.height = 200;
		wall.body.immovable = true;
		wall = this.walls.create(0, 180 - 3);
		wall.body.width = 320;
		wall.body.height = 3;
		wall.body.immovable = true;

		this.cracks = storedStage.addChild(game.make.group());

		this.sorted = storedStage.addChild(game.make.group());

		this.monsters = storedStage.addChild(game.make.group());
		this.monsters.enableBody = true;
		this.monsters.classType = Monster;

		this.makeCracks(Math.random() * this.storedLevel * cracks - 1);

		for (var i=0; i<Math.random() * this.storedLevel * cracks; i++)
		{
			var monster = this.monsters.create(0, 0);
		}

		var portalLocations = [[80, 60],  [160, 60],  [240, 60],
			[80, 120], [160, 120], [240, 120]];
		// Pick a portal and remove it from the list
		var up = portalLocations.splice(Math.floor(Math.random() * 6), 1)[0];
		this.portalUp = storedStage.addChild(game.make.sprite(up[0], up[1] - 24, "portalUp"));
		game.physics.arcade.enable(this.portalUp);
		this.portalUp.body.offset = new Phaser.Point(0, 17);
		this.portalUp.body.width = 25;
		this.portalUp.body.height = 15;
		this.portalUp.body.immovable = true;
		// Prevent from going to levels[0]
		if (this.storedLevel != 1)
		{
			// Pick a portal from the reduced list
			var down = portalLocations[Math.floor(Math.random() * 5)];
			this.portalDown = storedStage.addChild(game.make.sprite(down[0], down[1] - 24, "portalDown"));
			game.physics.arcade.enable(this.portalDown);
			this.portalDown.body.offset = new Phaser.Point(0, 17);
			this.portalDown.body.width = 25;
			this.portalDown.body.height = 15;
			this.portalDown.body.immovable = true;
		}

		this.player = storedStage.addChild(new Player(this.portalUp, this.portalDown));

		this.bullets = storedStage.addChild(game.make.group());
		this.enemyBullets = storedStage.addChild(game.make.group());

		storedStage.addChild(game.make.sprite(0, 180 - 26, "frontWall"));

		this.font = game.make.retroFont("arabic", 12, 16, Phaser.RetroFont.TEXT_SET1);
		storedStage.addChild(game.make.image(5, 180 - 22, this.font));

		// Add objects that exist in isometric space to a group that gets sorted
		this.sorted.add(this.monsters);
		this.sorted.add(this.player);
		this.sorted.add(this.portalUp);
		if (this.portalDown)
		{
			this.sorted.add(this.portalDown);
		}

		if (game.device.touch)
		{
			storedStage.addChild(game.make.sprite(25,  110, "dpad"));
			storedStage.addChild(game.make.sprite(250, 110, "dpad"));
		}

	}

	this.makeCracks(Math.random() * cracks * (entropy - this.lastEntropy) - 1);
	this.lastEntropy = entropy;

	this.entropyText();

	this.isNew = false;

}

Level.prototype.create = function()
{
	game.stage = levels[this.storedLevel];
}

// Default direction is 50/50 -1, 1
// Default toShift is random monster
Level.prototype.levelShift = function(to, direction, toShift)
{

	var fromIndex;
	var at;
	if (typeof direction == "undefined")
	{
		if (Math.random() < 0.5 && to != 1)
		{
			direction = -1;
		}
		else
		{
			direction = 1;
		}
	}
	if (direction == -1)
	{
		if (to == 1)
		{
			// We were requested to take from below level 1.
			// This is impossible, there are no monsters below the player.
			// Instead, then, we will make the shift downwards from somewhere above the player.
			this.levelShift(to, 1);
			return;
		}
		fromIndex = to - 1;
		at = this.portalDown;
	}
	if (direction == 1)
	{
		if (levels.length <= to + 1)
		{
			// We are the top level, and a shift is supposed to come from above
			// First we must make the level above us, then we can shift from it
			setLevel(to + 1, false);
		}
		fromIndex = to + 1;
		at = this.portalUp;
	}
	if (fromIndex != level)
	{
		var monster;
		var fromLevel = game.state.states[fromIndex];
		if (typeof toShift == "undefined")
		{
			var from = fromLevel.monsters;
			monster = from.getRandom();
		}
		else
		{
			monster = toShift;
		}
		if (monster)
		{
			// Phase shifts increase entropy, making a hectic (fun) exponential effect
			// However, we only do it for phase shifts the player sees
			if (this.storedLevel == level || fromIndex == level)
			{
				entropy += 1;
			}
			if (Math.random() < 0.3)
			{
				this.makeCracks(1);
			}
			this.entropyText(true);
 			// this.storedLevel, not `to`, which is used for recursion
			// TODO: We can probably merge `to` and `direction` into `levelFrom`
			monster.moveToLevel(this);
			monster.x = at.body.center.x - monster.width / 2;
			monster.y = at.body.bottom - monster.height + 5;
		}
		// We no longer recursively look for monsters because each level
		// generates its own shifts. It's no longer necessary. This way we
		// don't get chains leading to huge numbers of generated levels.
	}

}

Level.prototype.entropyText = function(phase)
{
	// Update the entropy text at the bottom
	var seenState = game.state.getCurrentState();
	if (seenState && seenState.font)
	{
		game.state.getCurrentState().font.text = "Entropy:" + entropy;
	}
	this.font.text = "Entropy:" + entropy + (phase ? " Phase detected" : "");
}

Level.prototype.update = function()
{

	// For each level, except the last one (unless we ARE the last one)
	// Rationale: If we update the top level all the time, we'll run out of memory
	// as we keep searching through higher and higher levels.
	// However, we do need at least one higher so that monsters can shift down.
	for (var l=1; l<levels.length - 1 + (level == levels.length-1); l++)
	{
		var monsterTeleports = 100;
		if (Math.random() < entropy / 60 / monsterTeleports)
		{
			game.state.states[l].levelShift(l);
		}
	}

}
