var Config = {
    'squareSide': 42,
    'keyState': {
        'up': true,
        'down': true,
        'left': true,
        'right': true
    }
};


var createMap = function() {
    // Fill the map with a two-dimensional array of tiles. Pre-populate
    
    for (x = 0; x < Map.width; x++) {
        for (y = 0; y < Map.height; y++) {
            var tileRow = [];
            
            tileRow.push({
                type: 'road'
            });
        }
        
        Map.tiles.push(tileRow);
    }
};

var Map = {
    width: 15,
    height: 15,
    tiles: []
};


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
            if (Config.keyState.right) {
                Config.keyState.right = false;
                this.player.position.x += this.player.width;
            }
        }
        
        if (this.cursors.right.isUp) {
            if (!Config.keyState.right) {
                Config.keyState.right = true;
            }
        }
        
        if (this.cursors.left.isDown) {
            if (Config.keyState.left) {
                Config.keyState.left = false;
                this.player.position.x -= this.player.width;
            }
        }
        
        if (this.cursors.left.isUp) {
            if (!Config.keyState.left) {
                Config.keyState.left = true;
            }
        }
        
        if (this.cursors.up.isDown) {
            if (Config.keyState.up) {
                Config.keyState.up = false;
                this.player.position.y -= this.player.width;
            }
        }
        
        if (this.cursors.up.isUp) {
            if (!Config.keyState.up) {
                Config.keyState.up = true;
            }
        }
        
        if (this.cursors.down.isDown) {
            if (Config.keyState.down) {
                Config.keyState.down = false;
                this.player.position.y += this.player.width;
            }
        }
        
        if (this.cursors.down.isUp) {
            if (!Config.keyState.down) {
                Config.keyState.down = true;
            }
        }
    },
};



var Messages = {
    notEnoughMoney: "You can't afford it!",
    notEnoughCaffeine: "You're out of caffeine!",
};



var State = {

    money: 10,
    caffeine: 100,

    errors: [],

    changeMoney: function(mod) {
        if (this.errors.length) return
        if (this.money + mod < 0) this.errors.push(Messages.notEnoughMoney);
        else this.money += mod;
    },


    changeCaffeine: function(mod) {
        if (this.errors.length) return
        if (this.caffeine + mod < 0) this.errors.push(Messages.notEnoughCaffeine);
        else this.caffeine += mod;
    },

    changeLocation: function(modx, mody) {
        main.player.position.x += squareSide*modx;
        main.player.position.y += squareSide*mody;
    }

};

var Event = {

    events: {
        coffee: {
            name: "Coffee",
            desc: "A much-needed coffee break.",
            run: function() {
                State.changeMoney(-2);
                State.changeCaffeine(10);
            }
        },
        sale: {
            name: "Sale",
            desc: "You sold it!",
            run: function() {
                State.changeMoney(50);
                State.changeCaffeine(-2);
            }
        }
    },

    create: function(name) {
        
        var ev = this.events[name]
        ev.run();

        if (State.errors.length) {
            $.each(State.errors, function(i, e) {
                console.log(e);
                State.errors.pop(i);
            });
        }
        else {
            console.log(ev.name +" : "+ ev.desc)
        }

    }
};

var Tile = {

    sprites: {
        street: "img/tile-street.png",
        building: "img/tile-building.png",
    },

    create: function(name, x, y) {
        
    }


}

var game = new Phaser.Game(400, 450, Phaser.AUTO, 'coffee');
game.state.add('main', main);
game.state.start('main');

