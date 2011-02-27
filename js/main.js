var map, state, player, preload_assets;

$(document).ready(function(){
	const DOWN = 40;
	const UP = 38;
	const LEFT = 37;
	const RIGHT = 39;
	
	map = [];
	
	state = {
		'level': ''
	};
	
	player = {
		'name': '',
		'caffination': '',
		'level': '',
		'xp': '',
		'str': '',
		'x': 0,
		'y': 0,
		'sprite': loadImage("./img/player.png")
	};
	
	// $('#map').click(function() {
	// 		document.addEventListener("click", function() {
	// 			console.log(event.offsetX);
	// 		}, true);
	// 		
	// 		console.log();
	// 	});
	
	$(document).keydown(function(event){
		switch (event.keyCode) {
		case DOWN:
			if (player.y >= 8) {
				movePlayerTo(player.x, 0);
			} else {
				movePlayerTo(player.x, player.y + 1);
			}
			
			drawMap();
			event.preventDefault();
			break;
		case UP:
			if (player.y <= 0) {
				movePlayerTo(player.x, 8);
			} else {
				movePlayerTo(player.x, player.y - 1);
			}
			
			drawMap();
			event.preventDefault();
			break;
		case RIGHT:
			if (player.x >= 8) {
				movePlayerTo(0, player.y);
			} else {
				movePlayerTo(player.x + 1, player.y);
			}
			
			drawMap();
			event.preventDefault();
			break;
		case LEFT:
			if (player.x <= 0) {
				movePlayerTo(8, player.y);
			} else {
				movePlayerTo(player.x - 1, player.y);
			}
			
			drawMap();
			event.preventDefault();
			break;
		}
	});
	
	init();
});

function init() {
	for (y = 0; y < 9; y++) {
		map[y] = [];
		for (x = 0; x < 9; x++) {
			map[y][x] = new MapTile();
		}
	}
	
	map[0][0].revealed = true;
}

function movePlayerTo(x,y) {
	player.x = x;
	player.y = y;
	map[y][x].revealed = true;
}

function loadImage(uri) {
	var img = new Image();
	preload_assets++;
	img.src = uri;
	img.onload = doneLoading;
	return img;
}

function doneLoading() {
	preload_assets--;
	if (preload_assets > 0) return;
	
	drawMap();
}

function logMessage(str) {
	var log = $('#log');
	log.append($('<p>'+str+'</p>'));
	log.animate({ scrollTop: log.attr('scrollHeight') }, 500);
}

function MapTile() {
	this.color = { r:128, g:128, b:128 };
	this.revealed = false;
}

function drawMap() {
	var canvas = document.getElementById("map");
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
			
			if (i == 0 && j == 0) console.log(m.revealed);
			if ( m.revealed ) {
				c.fillStyle = "rgb(" + m.color.r + ", " + m.color.g + ", " + m.color.b + ")";
			} else {
				c.fillStyle = "rgb(10, 10, 10)";
			}
			c.fillRect(j * width, i * height, width, height);
			c.strokeRect(j * width, i * height, width, height);
		}
	}
	
	console.log('player.sprite');
	
	c.drawImage(player.sprite, player.x * width, player.y * height);
}



function randBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}