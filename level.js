function Level()
{

	this.portalUpHold = 0;
	this.portalDownHold = 0;
	this.bulletCountdown = 0;
	this.isNew = true;
	this.crackTypes = 4;
	this.monsterTypes = 1;
	this.lastEntropy = 0;

}

Level.prototype.makeCracksAndMonsters = function(cracks, monsters)
{
	if (typeof monsters == "undefined")
	{
		monsters = cracks;
	}
	for (var i=0; i<cracks; i++)
	{
		var type = "cracks" + Math.floor(Math.random() * this.crackTypes);
		var crack = this.cracks.create(0, 0, type);
		crack.x = Math.random() * (320 - 64 - 3 - 3) + 3;
		crack.y = Math.random() * (180 - 64 - 52) + 52;
	}
	for (var i=0; i<monsters; i++)
	{
		var type = "monster" + Math.floor(Math.random() * this.monsterTypes);
		var monster = this.monsters.create(0, 0, type);
		monster.x = Math.random() * (320 - 64 - 3 - 3) + 3;
		monster.y = Math.random() * (180 - 64 - 52) + 52;
	}
}

Level.prototype.create = function()
{

	game.stage = levels[level];

	var cracks = 0.5;

	if (this.isNew)
	{

		game.stage.addChild(game.make.sprite(0, 0, "floor"));

		this.walls = game.stage.addChild(game.make.group());
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

		this.cracks = game.stage.addChild(game.make.group());
		this.monsters = game.stage.addChild(game.make.group());

		this.makeCracksAndMonsters(Math.random() * level * cracks - 1);

		var portalLocations = [[80, 60],  [160, 60],  [240, 60],
		                       [80, 120], [160, 120], [240, 120]];
		// Pick a portal and remove it from the list
		var up = portalLocations.splice(Math.floor(Math.random() * 6), 1)[0];
		var portalUp = game.stage.addChild(game.make.sprite(up[0], up[1] - 24, "portalUp"));
		game.physics.arcade.enable(portalUp);
		// Prevent from going to levels[0]
		if (level != 1)
		{
			// Pick a portal from the reduced list
			var down = portalLocations[Math.floor(Math.random() * 5)];
			var portalDown = game.stage.addChild(game.make.sprite(down[0], down[1] - 24, "portalDown"));
			game.physics.arcade.enable(portalDown);
		}

		this.player = game.stage.addChild(new Player(portalUp, portalDown));

		game.stage.addChild(game.make.sprite(0, 180 - 26, "frontWall"));

		this.font = game.make.retroFont("arabic", 12, 16, Phaser.RetroFont.TEXT_SET1);
		game.stage.addChild(game.make.image(5, 180 - 22, this.font));

	}

	this.makeCracksAndMonsters(Math.random() * cracks * (entropy - this.lastEntropy) - 1);
	this.lastEntropy = entropy;

	this.font.text = "Entropy: " + entropy;

	this.isNew = false;

}

Level.prototype.update = function()
{

}
