var map, state, player, default_actions, preload_assets, key_bindings, canvas;

$(document).ready(function(){
	$LAB
		.script("js/Map.js")
		.wait(function() {
			const KEY_DOWN = 40;
			const KEY_UP = 38;
			const KEY_LEFT = 37;
			const KEY_RIGHT = 39;
			
			map = new Map(9, 9);
			key_bindings = [];
			canvas = document.getElementById("map");
			
			default_actions = {
				'Inventory': function() {
					logMessage('Looking at your inventory.');
				}
			};
			
			state = {
				'level': ''
			};
			
			player = {
				'name': '',
				'energy': '',
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
			
			$(document).keydown(handleKeyPress);
			bindKey(KEY_DOWN, function() { movePlayerTo(player.x, wrapValue(player.y + 1, 0, 8)); });
			bindKey(KEY_UP, function() { movePlayerTo(player.x, wrapValue(player.y - 1, 0, 8)); });
			bindKey(KEY_RIGHT, function() { movePlayerTo(wrapValue(player.x + 1, 0, 8), player.y); });
			bindKey(KEY_LEFT, function() { movePlayerTo(wrapValue(player.x - 1, 0, 8), player.y); });
			
			init();
		});
});

function init() {
	map.generate();
	movePlayerTo(0, 0);
}

function bindKey(k, f) {
	key_bindings[k] = f;
}

function unbindKey(k) {
	key_bindings[k] = null;
}

function handleKeyPress(event) {
	var k = event.keyCode;
	if (key_bindings[k]) {
		key_bindings[k]();
		event.preventDefault;
	}
}

function movePlayerTo(x,y) {
	var m = map[y][x];
	
	player.x = x;
	player.y = y;
	map[y][x].revealed = true;
	logMessage(map[y][x].description);
	
	var action_menu = $('#action_menu');
	var btn = null;
	action_menu.empty();
	
	for (action in default_actions) {
		btn = $('<p id="' + action + '">' + action + '</p>');
		action_menu.append(btn);
		btn.click(default_actions[action]);
	}
	
	for (action in m.actions) {
		btn = $('<p id="' + action + '">' + action + '</p>');
		action_menu.append(btn);
		btn.click(m.actions[action]);
	}
	
	map.draw(canvas);
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
	
	//init();
}

function logMessage(str) {
	var log = $('#log');
	log.append($('<p>' + str + '</p>'));
	log.stop().animate({ scrollTop: log.attr('scrollHeight') }, 500);
}

function makeDescription() {
	if (Math.random() < 0.1) {
		return "The worst room.";
	} else {
		return "The best room.";
	}
}



function randBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function wrapValue(v, min, max) {
	if (max < min) {
		var tmp = min;
		min = max;
		max = tmp;
	}
	
	console.log("Wrapping value " + v + " to (" + min + "," + max + ")")
	var d = max - min + 1;
	
	while (v < min) v += d;
	while (v > max) v -= d;
	
	console.log(" >> Got " + v);
	
	return v;
}