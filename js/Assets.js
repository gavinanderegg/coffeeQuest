Assets = {
    "count": 0,
    "loaded": 0,
    "ready": false,
    "callback": null,
    "lib": {},
    
    "load": function(cb) {
        console.log("Loading assets...");
        Assets.callback = cb;
        
        // Start assets loading; should we be pulling this from somewhere else?
        Assets.addImage("player", "./img/player.png");
        
        Assets.ready = true;
        console.log("All assets are now loading.");
        
        // Do a check here just in case the assets have all loaded before we get here.
        if (Assets.loaded >= Assets.count) {
            console.log("Assets loaded, firing callback.")
            if (Assets.callback) Assets.callback();
        }
    },
    
    "addImage": function(name, uri) {
        console.log(" >> Loading image at '" + uri + "' with identifier " + name);
        var img = new Image();
        Assets.count++;
        img.src = uri;
        img.onload = Assets.onFinish;
        Assets.lib[name] = img;
    },
    
    "onFinish": function() {
        Assets.loaded++;
        console.log(" ! Finished loading something (" + Assets.loaded + "/" + Assets.count + ")");
        if (Assets.ready && Assets.loaded >= Assets.count) {
            console.log("Assets loaded, firing callback.")
            if (Assets.callback) Assets.callback();
        }
    }
};

console.log("Assets.js fully loaded.");