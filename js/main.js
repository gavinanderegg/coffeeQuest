var Config = {
    'squareSide': 42,
    'keyState': {
        'up': true,
        'down': true,
        'left': true,
        'right': true
    },
    'windowSize': {
        'width': 504,
        'height': 504 
    }
};

var Map = {
    width: 15,
    height: 15,
    tiles: []
};

var createMap = function() {
    // Fill the map with a two-dimensional array of tiles. Pre-populate
    
    for (x = 0; x < Map.width; x++) {
        var tileRow = [];
        
        for (y = 0; y < Map.height; y++) {
            var tile = _.sample(_.pairs(TileTypes));
            
            tileRow.push({
                type: tile[0]
            });
            game.add.sprite(x * Config.squareSide, y * Config.squareSide, tile[1].sprite);
        }
        
        Map.tiles.push(tileRow);
    }
    
    
};


var main = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the game's assets
        
        game.load.image('player', '/img/player.png');
        Tile.preload(game);
    },
    
    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        
        createMap();
        
        this.cursors = game.input.keyboard.createCursorKeys();
        this.player = game.add.sprite(0, 0, 'player');
    },
    
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        
        if (this.cursors.right.isDown) {
            if (Config.keyState.right) {
                Config.keyState.right = false;
                State.changeLocation(1,0)
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
                State.changeLocation(-1,0)
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
                State.changeLocation(0,-1)
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
                State.changeLocation(0,1)
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
    playerX: 0,
    playerY: 0,

    errors: [],

    changeMoney: function(mod) {
        if (this.errors.length) {
            return;
        }
        
        if (this.money + mod < 0) {
            this.errors.push(Messages.notEnoughMoney);
        } else {
            this.money += mod;
        }
    },

    changeCaffeine: function(mod) {
        if (this.errors.length) {
            return;
        }
        
        if (this.caffeine + mod < 0) {
            this.errors.push(Messages.notEnoughCaffeine);
        } else {
            this.caffeine += mod;
        }
    },

    changeLocation: function(modx, mody) {
        if (this.errors.length) {
            return;
        }
    
        newX = main.player.position.x + Config.squareSide*modx;
        newY = main.player.position.y + Config.squareSide*mody;

        if (newX > -1 && newX < Config.windowSize.width) {
            main.player.position.x = newX
            State.playerX += modx;
        }

        if (newY > -1 && newY < Config.windowSize.height) {
            main.player.position.y = newY
            State.playerY += mody;
        }

        // fire tile event
        
        console.log( TileTypes[Map.tiles[0][0]).type].events )

        //var eventResult = Event.create(
            
        
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
        },
        street: {
            name: "Street",
            desc: "You walk down the street",
            run: function() {}
        },
    },

    create: function(name) {
        
        var ev = this.events[name];
        if (!ev) return false;
        ev.run();

        var err = [];

        if (State.errors.length) {
            _.each(State.errors, function(i, e) {
                message(i, 'error');
                err.push(i);
                State.errors.pop(i);
            });
            return err;
        }
        else {
            message(ev.name +" : "+ ev.desc);
        }

    },

};

var Tile = {

    sprites: {
        tileStreet: "img/tile-street.png",
        tileBuilding: "img/tile-building.png",
    },

    preload: function(game) {
        _.each(this.sprites, function(i, e) {
            game.load.image(e, i);
        });
    }

};


var TileTypes = {
    'street': {
        'sprite': 'tileStreet',
        'events': ['street']
    },
    'building': {
        'sprite': 'tileBuilding',
        'events': []
    }
};

function message(msg, type) {

    var li = $('<li></li>').text(msg);
    if (type) {
        li.addClass(type);
    }
    $('#messages ul').append(li);

}

var game = new Phaser.Game(Config.windowSize.width, Config.windowSize.height, Phaser.AUTO, 'coffee');
game.state.add('main', main);
game.state.start('main');

