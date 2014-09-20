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
    },
    'textSpeed': 150,
    'animationSpeed': 150,
};

var Map = {
    width: 15,
    height: 15,
    tiles: [],
    fog: []
};

var createMap = function() {
    // Fill the map with a two-dimensional array of tiles. Pre-populate
    
    for (x = 0; x < Map.width; x++) {
        var tileRow = [];
        var fogRow = [];
        
        for (y = 0; y < Map.height; y++) {
            var tile = _.sample(_.pairs(TileTypes));
            
            tileRow.push({
                type: tile[0]
            });
            
            game.add.sprite(x * Config.squareSide, y * Config.squareSide, tile[1].sprite);
            var tileFog = game.add.sprite(x * Config.squareSide, y * Config.squareSide, 'tileFog');
            
            fogRow.push(tileFog);
        }
        
        Map.tiles.push(tileRow);
        Map.fog.push(fogRow);
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
        
        State.changeLocation(0,0);
    },
    
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        
        if ( !State.keysLocked ) {

            if (this.cursors.right.isDown) {
                if (Config.keyState.right) {
                    Config.keyState.right = false;
                    State.changeLocation(1,0);
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
                    State.changeLocation(-1,0);
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
                    State.changeLocation(0,-1);
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
                    State.changeLocation(0,1);
                }
            }
            
            if (this.cursors.down.isUp) {
                if (!Config.keyState.down) {
                    Config.keyState.down = true;
                }
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
    level: 1,
    keysLocked: false,

    errors: [],

    turn: function() {

        State.changeCaffeine(-1)

        if ( State.caffeine < 1 ) {
            UI.gameOver()
        }

    },

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
        tileX = newX / Config.squareSide;
        tileY = newY / Config.squareSide;
        moved = false;

        if (modx && newX > -1 && newX < Config.windowSize.width) {
            State.playerX += modx;
            moved = true;
        }

        if (mody && newY > -1 && newY < Config.windowSize.height) {
            State.playerY += mody;
            moved = true;
        }

        // fire tile event
        
        var unfog = function(baseX, baseY) {
            if (Map.fog[baseX] !== undefined) {
                if (Map.fog[baseX][baseY] !== undefined) {
                    tween = game.add.tween(Map.fog[baseX][baseY]).to( { alpha: 0 }, Config.animationSpeed, Phaser.Easing.Linear.None, true, 0, 0, false)
                    tween.onComplete.add(function(){
                        Map.fog[baseX][baseY].destroy();
                    }, this);
                }
            }
        };
        
        _.each([tileX - 1, tileX, tileX + 1], function(element, index, list) {
            var cx = element;
            _.each([tileY - 1, tileY, tileY + 1], function(element, index, list) {
                var cy = element;
                unfog(cx, cy);
            });
        });
        
        if (moved) {
            
            State.keysLocked = true;

            tween = game.add.tween(main.player).to( { y: newY, x: newX }, Config.animationSpeed, Phaser.Easing.Linear.None, true, 0, 0, false)
            tween.onComplete.add(function(){
                State.keysLocked = false;
            }, this);


            if (newX === (Config.windowSize.height - Config.squareSide) &&
                newY === (Config.windowSize.width - Config.squareSide)) {
                console.log('Next!');
            }

            State.turn()
            return Event.create( _.sample(TileTypes[Map.tiles[State.playerX][State.playerY].type].events) );
        }
    }
};

var Event = {

    events: {
        coffee: {
            name: "Coffee",
            run: function() {
                State.changeMoney(-2);
                State.changeCaffeine(10);
                return "Bought a coffee! - $2 , +10 caffeine";
            }
        },
        sale: {
            name: "Sale",
            run: function() {
                State.changeMoney(50);
                State.changeCaffeine(-2);
                return "Made a sale! + $50 , - 2 caffeine";
            }
        },
        street: {
            name: "Street",
            run: function() { return "Walked down the street"; }
        },
    },

    create: function(name) {
        
        var ev = this.events[name];
        if (!ev) { return false; }
        
        var msg = ev.run();
        UI.update();

        var err = [];

        if (State.errors.length) {
            _.each(State.errors, function(i, e) {
                UI.message(i, 'error', ev.name);
                err.push(i);
                State.errors.pop(i);
            });
            return err;
        }

        UI.message(msg, '', ev.name);
        

    },

};

var Tile = {

    sprites: {
        tileStreet: "img/tile-street.png",
        tileBuilding: "img/tile-building.png",
        tileFog: "img/tile-fog.png"
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
        'events': ['coffee']
    }
};

var UI = {

    message: function(msg, type, title) {

        var li = $('<li></li>').text(msg);
        if (title) {
            li.prepend('<span>'+ title +'</span>')
        }
        if (type) {
            li.addClass(type);
        }
        $('#messages ul').prepend(li);
        li.slideUp(0).slideDown(Config.textSpeed);
    },

    gameOver: function() {
        $('#gameOver').fadeIn()
    },

    update: function() {
        Effects.updateValue('#moneyValue', State.money)
        Effects.updateValue('#caffeineValue', State.caffeine)
        Effects.updateValue('#levelValue', State.level)
    },

    updateFast: function() {
        $('#moneyValue').text(State.money);
        $('#caffeineValue').text(State.caffeine);
        $('#levelValue').text(State.level);
    }

}

var game = new Phaser.Game(Config.windowSize.width, Config.windowSize.height, Phaser.AUTO, 'coffee');

$(function() {
    
    game.state.add('main', main);
    game.state.start('main');
    UI.updateFast();

});
