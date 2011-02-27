Templates = {
    MapTiles: {
        'street': function() {
            var t = {
                color: { r:200, g:200, b:200 }
            };
            
            if (Math.random() < .8) {
                t.description = "This is a quiet side-street.";
            } else {
                t.description = "This is a busy street.";
            }

            return t;
        }
    }
};

console.log("Templates.js fully loaded.");