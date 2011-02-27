var map, state, player, default_actions, preload_assets, key_bindings, canvas;

$(document).ready(function(){
	$LAB
		.script("js/Map.js")
		.script("js/Assets.js")
		.wait(function() {
			console.log("Setting up...");
			
			const KEY_DOWN = 40;
			const KEY_UP = 38;
			const KEY_LEFT = 37;
			const KEY_RIGHT = 39;
			
			canvas = document.getElementById("map");
			map = new Map(9, 9);
			
			default_actions = {
				'Inventory': function() {
					logMessage('Looking at your inventory.');
				}
			};
			
			
			// $('#map').click(function() {
			// 		document.addEventListener("click", function() {
			// 			console.log(event.offsetX);
			// 		}, true);
			// 		
			// 		console.log();
			// 	});
			
			key_bindings = [];
			$(document).keydown(handleKeyPress);
			bindKey(KEY_DOWN, function() { movePlayerTo(player.x, wrapValue(player.y + 1, 0, 8)); });
			bindKey(KEY_UP, function() { movePlayerTo(player.x, wrapValue(player.y - 1, 0, 8)); });
			bindKey(KEY_RIGHT, function() { movePlayerTo(wrapValue(player.x + 1, 0, 8), player.y); });
			bindKey(KEY_LEFT, function() { movePlayerTo(wrapValue(player.x - 1, 0, 8), player.y); });
			
			Assets.load(init);
		});
});

function init() {
	console.log("Initializing...");
	
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
		'sprite': Assets.lib['player']
	};
			
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
function logMessage(str) {
	var log = $('#log');
	log.append($('<p>' + str + '</p>'));
	log.stop().animate({ scrollTop: log.attr('scrollHeight') }, 500);
}

function randBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function wrapValue(v, min, max) {
	if (max < min) { return wrapValue(v, max, min); }
	
	var d = max - min + 1;
	while (v < min) v += d;
	while (v > max) v -= d;
	return v;
}

function clampValue(v, min, max) {
	if (max < min) { return clampValue(v, max, min); }
	if (v < min) return min;
	if (v > max) return max;
	return v;
}