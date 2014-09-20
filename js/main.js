var main = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the game's assets
        
        game.load.image('player', '/img/player.png');
    },
    
    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        
        this.cursors = game.input.keyboard.createCursorKeys();
        this.player = game.add.sprite(42, 42, 'player');
    },
    
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        
        if (this.cursors.right.isDown) {
            this.player.position.x += this.player.width;
        }
        
        if (this.cursors.left.isDown) {
            this.player.position.x -= this.player.width;
        }
        
        if (this.cursors.up.isDown) {
            this.player.position.y -= this.player.height;
        }
        
        if (this.cursors.down.isDown) {
            this.player.position.y += this.player.height;
        }
    },
};

var game = new Phaser.Game(400, 450, Phaser.AUTO, 'coffee');
game.state.add('main', main);
game.state.start('main');

