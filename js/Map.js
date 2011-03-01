//==================================================================================================
// Map class
function Map(w, h) {
	this.width = w;
	this.height = h;
	this.tiles = [];
	
	var x, y;
	for (y = 0; y < this.height; y++) {
		this.tiles[y] = [];
		for (x = 0; x < this.height; x++) {
			this.tiles[y][x] = null;
		}
	}
}

Map.prototype.generate = function() {
	for (y = 0; y < 9; y++) {
		map[y] = [];
		for (x = 0; x < 9; x++) {
			map[y][x] = new MapTile();
			map[y][x].apply(Templates.MapTiles.street);
		}
	}
};


Map.prototype.draw = function(camvas) {
	var c = canvas.getContext('2d');
	
	var width = 42;
	var height = 42;
	
	var r, g, b = 0;
	
	for (var i = 0; i < 9; i++)
	{
		for (var j = 0; j < 9; j++)
		{
			var m = map[i][j];
			
			c.strokeStyle = "rgb(30,110,210)";
			
			if (m.revealed) {
				c.fillStyle = "rgb(" + m.color.r + ", " + m.color.g + ", " + m.color.b + ")";
			} else {
				c.fillStyle = "rgb(10, 10, 10)";
			}
			c.fillRect(j * width, i * height, width, height);
			c.strokeRect(j * width, i * height, width, height);
		}
	}
	
	c.drawImage(player.sprite, player.x * width, player.y * height);
};



//==================================================================================================
// MapTile class
function MapTile() {
	this.color = { r:128, g:128, b:128 };
	this.revealed = false;
	
	this.description = '';
	this.actions = {};
}

MapTile.prototype.apply = function(template) {
	var bp = template;
	if (typeof template == "function")
		bp = template();
	
	for (key in bp) {
		this[key] = bp[key];
	}
};

//==================================================================================================

console.log("Map.js fully loaded.");