var main = {
	preload: function() {
		// This function will be executed at the beginning
		// That's where we load the game's assets
	},
	
	create: function() { 
		// This function is called after the preload function
		// Here we set up the game, display sprites, etc.
	},
	
	update: function() {
		// This function is called 60 times per second
		// It contains the game's logic
	},
};

var game = new Phaser.Game(400, 450, Phaser.AUTO, 'gameDiv');
game.state.add('main', main);
game.state.start('main');