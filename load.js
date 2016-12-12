function Load()
{

}

Load.prototype.preload = function()
{

	game.load.image("floor", "assets/floor.png");
	game.load.image("frontWall", "assets/frontWall.png");
	game.load.image("test", "assets/test.png");
	game.load.image("portalUp", "assets/portalUp.png");
	game.load.image("portalDown", "assets/portalDown.png");
	game.load.image("cracks0", "assets/cracks0.png");
	game.load.image("cracks1", "assets/cracks1.png");
	game.load.image("cracks2", "assets/cracks2.png");
	game.load.image("cracks3", "assets/cracks3.png");
	game.load.image("bullet", "assets/bullet.png");
	game.load.image("enemyBullet", "assets/enemyBullet.png");
	game.load.image("arabic", "assets/adobe-arabic-font.png");
	game.load.image("monster0", "assets/monster0.png");
	game.load.image("monster1", "assets/monster1.png");
	game.load.image("monster2", "assets/monster2.png");
	game.load.image("monster3", "assets/monster3.png");

	game.load.spritesheet("player", "assets/player.png", 22, 35);

}

Load.prototype.create = function()
{
	setLevel(1);
}