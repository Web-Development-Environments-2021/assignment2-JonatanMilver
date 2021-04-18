var context;

var board;
var score;

var start_time;
var time_elapsed;
var interval;
var users = {};

//pacman settings
var pacman = new Object();
var pac_color;
var currentDirection;
var pac_life = 3;

//monsters setting
var move_monsters = 0;
var n_monsters = 4;
var mon_speed = 6;
var monsters;

// game settings
var food_remain = 90;
var food_arr;

// player settings
var current_logged_in;



/*
user :
{
	username: string,
	password: string,
	full_name: string,
	email: string,
	birth_date: Date,
}
*/

$(document).ready(function() {
	initialize();

	// context = canvas.getContext("2d");
	// Start();
});

logginHandle = () => {
	let username = $('#username').val();
	let password = $('#password').val();
	let response = loginValidation(username, password);
	if(response){
		context = canvas.getContext("2d");
		current_logged_in = username;
		Start();
	}
	return false;
}

initialize = () => {
	user = {
		username: "k",
		password: "k"
	}
	users[user.username] = user;
	$('#mainGamePage').hide();
	$('#registerPage').hide();
	$('#loginPage').hide();
	$('#loginAlert').hide();
	closeBtns();
	$('#registerBtn').click(function(){
		$('#welcomePage').toggle();
		$('#registerPage').toggle();

		// part of validation
		addRules();
		validate();
	});
	$('#loginBtn').click(function(){
		$('#welcomePage').toggle();
		$('#loginPage').toggle();

	});
}

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	food_arr = [
					['black', Math.round(0.6 * food_remain)],
					['red', Math.round(0.3 * food_remain)],
					['blue', Math.round(0.1 * food_remain)]
				];
	alert("dfgdf");
	

	var pacman_remain = 1;
	var walls_remain = 4;
	start_time = new Date();

	//createMonsters
	buildMonsters();

	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			){
				board[i][j] = 4;
			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					let x = chooseFood();
					board[i][j] = x;
				}
				else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					pacman.x = i;
					pacman.y = j;
					pacman_remain--;
					board[i][j] = 2;
				}
				else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}

	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = chooseFood();
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(main, 70);
}

function gotCaught(){
	// alert("you got caught!!!!!!")
	buildMonsters();
	let emptyCell = findRandomEmptyCell(board);
	board[pacman.x][pacman.y] = 0;
	pacman.x = emptyCell[0];
	pacman.y = emptyCell[1];
	board[pacman.x][pacman.y] = 2;

}

function buildMonsters(){
	monsters = [];
	for(let a=0; a<n_monsters; a++){
		var m = new Object();
		switch(a) {
			case 0:
				m.x = 0;
				m.y = 0;
				m.color = "rm";
				m.type = -1;
				monsters.push(m);
				break;
			case 1:
				m.x = 0;
				m.y = 9;
				m.color = "bm";
				m.type = -2;
				monsters.push(m);
				break;
			case 2:
				m.x = 9;
				m.y = 9;
				m.color = "ym";
				m.type = -3;
				monsters.push(m);
				break;
			case 3:
				m.x = 9;
				m.y = 0;
				m.color = "gm";
				m.type = -4;
				monsters.push(m);
				break;
		}
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function chooseFood(){
	let r = Math.floor(Math.random() * food_arr.length);
	let kind = food_arr[r][0];
	let kind_ball = 0;
	if(kind == "black"){
		kind_ball = 5;
	}
	else if(kind == "red"){
		kind_ball = 15;
	}
	else{
		kind_ball = 25;
	}

	food_arr[r][1]--;
	if(food_arr[r][1] == 0){
		food_arr.splice(r,1);
	}
	return kind_ball;
}

function GetKeyPressed() {
	if (keysDown[38]) {
		currentDirection = 1;
		return 1;
	}
	if (keysDown[40]) {
		currentDirection = 2;
		return 2;
	}
	if (keysDown[37]) {
		currentDirection = 3;
		return 3;
	}
	if (keysDown[39]) {
		currentDirection = 4;
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblname.value = current_logged_in;
	life.value = pac_life;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				pacman_draw(center);
			}
			else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("5", center.x, center.y + 3);
			}
			else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "red"; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("15", center.x, center.y + 3);
			}
			else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = "blue"; //color
				context.fill();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("25", center.x, center.y + 3);
			}
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
	//draw monsters
	for(let i=0; i<monsters.length; i++){
		let m = monsters[i];
		var img = document.getElementById(m.color);
		context.drawImage(img, m.x * 60, m.y * 60, 60, 60);
	}
}

function pacman_draw(center){
	if(currentDirection == 1){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(currentDirection == 2){
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(currentDirection == 3){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else{
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
}

function possibleMove(x, y){
	try{
		// board[x][y];
		if(board[x][y] != 4){
			for(let i=0; i<monsters.length; i++){
				if(monsters[i].x == x && monsters[i].y == y){
					return false;
				}
			}
		}
		else{
			return false;
		}
		return true;
	}
	catch{
		return false;
	}
}

function UpdatePosition() {
	// monsters movement
	if(move_monsters == 0){
		for(let i = 0; i < monsters.length; i++){
			let m = monsters[i];
			let dx = m.x - pacman.x;
			let dy = m.y - pacman.y;
	
			let dir = null;
			Math.abs(dx) > Math.abs(dy) ? dir="x" : dir="y";
	
			if(dir == "x"){
				if(dx > 0){
					if(possibleMove(m.x-1, m.y)){
						m.x--;
					}
				}
				else{
					if(possibleMove(m.x+1, m.y)){
						m.x++;
					}
				}
			}
			else{
				if(dy > 0){
					if(possibleMove(m.x, m.y-1)){
						m.y--;
					}
				}
				else{
					if(possibleMove(m.x, m.y+1)){
						m.y++;
					}
				}
			}
		}
	}
	
	move_monsters = (move_monsters+1) % mon_speed;

	// pacman movement
	var x = GetKeyPressed();
	board[pacman.x][pacman.y] = 0;
	if (x == 1) {
		if (pacman.y > 0 && board[pacman.x][pacman.y - 1] != 4) {
			pacman.y--;
		}
	}
	if (x == 2) {
		if (pacman.y < 9 && board[pacman.x][pacman.y + 1] != 4) {
			pacman.y++;
		}
	}
	if (x == 3) {
		if (pacman.x > 0 && board[pacman.x - 1][pacman.y] != 4) {
			pacman.x--;
		}
	}
	if (x == 4) {
		if (pacman.x < 9 && board[pacman.x + 1][pacman.y] != 4) {
			pacman.x++;
		}
	}

	//update score
	if([5,15,25].includes(board[pacman.x][pacman.y])){
		score+= board[pacman.x][pacman.y];
	}
	for(let i=0; i<monsters.length; i++){
		if(monsters[i].x == pacman.x && monsters[i].y == pacman.y){
			score -= 10;
			pac_life -= 1;

			gotCaught();
		}
	}
	board[pacman.x][pacman.y] = 2;

	// 
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
}

function main() {
	UpdatePosition();
	Draw();
	isFinished();
}

function isFinished(){
	if (score == 500 || time_elapsed >= 3000 || pac_life == 0) {
		window.clearInterval(interval);
		window.alert("Game completed");
		// console.log("Game completed");
	}
}