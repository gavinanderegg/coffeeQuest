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

var Messages = {
    notEnoughMoney: "You can't afford it!",
    notEnoughCaffeine: "You're out of caffeine!",
}

var State = {

    money: 10,
    caffeine: 100,

    errors: [],

    changeMoney: function(mod) {
        
        if (this.money + mod < 0) this.errors.push(Messages.notEnoughMoney);
        else this.money += mod;
    },


    changeCaffeine: function(mod) {
        if (this.caffeine + mod < 0) this.errors.push(Messages.notEnoughCaffeine);
        else this.caffeine += mod;
    }



}

var Event = {

    events: {
        coffee: {
            name: "Coffee",
            desc: "A much-needed coffee break.",
            run: function() {
                State.changeMoney(-2);
                State.changeCaffeine(10);
            }
        }
    },

    create: function(name) {
        
        var ev = this.events[name]
        ev.run();

        if (State.errors) {
            $.each(State.errors, function(i, e) {
                console.log(e);
                State.errors.pop(i);
            });
        }
        else {
            console.log(ev.name +" : "+ ev.desc)
        }

    }
}


var game = new Phaser.Game(400, 450, Phaser.AUTO, 'coffee');
game.state.add('main', main);
game.state.start('main');

