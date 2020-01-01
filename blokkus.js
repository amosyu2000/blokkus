// Class for piece 
class Piece { 
	constructor(rows, columns, index_row, index_column, value, grid){ // Takes 5 arguments (length, height, index_x, index_y, values)
		this.rows = rows; // Row size of piece
		this.columns = columns; // Column size of piece
		this.anchor_point = [index_row, index_column]; // Rotational point of piece 
		this.top = 1; // Top position
		this.bottom = (rows - 2); // Bottom position
		this.left = 1; // Left position
		this.right = (columns - 2); // Right position
		this.value = value; // Number of tiles within piece
		this.grid = grid; // Actual piece as nested array
	}
}

// Class for player 
class Player { 
	constructor(color) { // Takes one argument (color)
		this.pieces = player_pieces; // List of player's pieces
		this.color = color; // Color of player's tiles
		this.score = 0; // Player score
		this.continue = true; // Forfeit status
	}
}

// Blokus pieces
// Grid goes down and right
// 1 = Tile
// 0 = Space beside a tile
// -1 = Corner tile
// -2 = Non connected tile
var piece_1 = new Piece(3, 3, 1, 1, 1, [[-1, 0, -1], [0, 1, 0], [-1, 0, -1]]);
var piece_2 = new Piece(3, 4, 1, 1, 2, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_3 = new Piece(4, 4, 1, 2, 3, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 1, 0], [-2, -1, 0, -1]]);
var piece_4 = new Piece(3, 5, 1, 2, 3, [[-1, 0, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_5 = new Piece(4, 4, 2, 1, 4, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_6 = new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_7 = new Piece(3, 6, 1, 2, 4, [[-1, 0, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_8 = new Piece(4, 5, 2, 3, 4, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_9 = new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 0, -1, -2]]);
var piece_10 = new Piece(4, 6, 2, 1, 5, [[-1, 0, -1, -2, -2, -2], [0, 1, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_11 = new Piece(5, 5, 3, 2, 5, [[-2, -1, 0, -1, -2], [-2, 0, 1, 0, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_12 = new Piece(5, 5, 3, 1, 5, [[-1, 0, -1, -2, -2], [0, 1, 0, -2, -2], [0, 1, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_13 = new Piece(4, 6, 1, 2, 5, [[-2, -1, 0, 0, 0, -1], [-1, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, -1], [-1, 0, 0, -1, -2, -2]]);
var piece_14 = new Piece(5, 5, 2, 2, 5, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, -1], [-1, 0, -1, -2, -2]]);
var piece_15 = new Piece(7, 3, 3, 1, 5, [[-1, 0, -1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, -1]]);
var piece_16 = new Piece(5, 4, 2, 1, 5, [[-1, 0, -1, -2], [0, 1, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_17 = new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [0, 1, 0, -1, -2], [-1, 0, -1, -2, -2]]);
var piece_18 = new Piece(5, 4, 2, 1, 5, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_19 = new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 1, 0, -2], [-2, -1, 0, -1, -2]]);
var piece_20 = new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 1, 0, -1], [-2, -1, 0, -1, -2]]);
var piece_21 = new Piece(4, 6, 2, 2, 5, [[-2, -1, 0, -1, -2, -2], [-1, 0, 1, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var player_pieces = [piece_1, piece_2, piece_3, piece_4, piece_5, piece_6, piece_7, piece_8, piece_9, piece_10, piece_11, piece_12, piece_13, piece_14, piece_15, piece_16, piece_17, piece_18, piece_19, piece_20, piece_21];

// Function to check wether piece placement is in bounds
function in_bounds(a_piece, row, column, grid) {
	state = true; // State to be returned false if any of the tests fail
	if ((row - (a_piece.anchor_point[0] - a_piece.top)) < 0) { // If the piece is not greater than 0 (rows)
		state = false;
	}
	if (19 < (row + (a_piece.bottom - a_piece.anchor_point[0]))) { // If the piece is not greater than 0 (columns)
		state = false;
	}
	if ((column - (a_piece.anchor_point[1] - a_piece.left)) < 0) { // If the piece is not less than or equal to 19 (rows)
		state = false;
	}
	if (19 < (column + (a_piece.right - a_piece.anchor_point[1]))) { // If the piece is not less than or equal to 19 (columns)
		state = false;
	}
	return state;
}

// Function to place the first piece in a corner of the grid
function first_piece(a_piece, row, column, grid) {
	let filled_corner = false; // Boolean to check if corner piece touches corner and has tile value 1
	if (in_bounds(a_piece, row, column, grid)) { // If the piece is in bounds
		if ((a_piece.anchor_point[0] - a_piece.top) == row) { 
			if ((a_piece.anchor_point[1] - a_piece.left) == column) { // If the piece is in the top left corner
				if (a_piece.grid[a_piece.top][a_piece.left] == 1) {
					filled_corner = true;
				}
			}
			else if ((a_piece.right - a_piece.anchor_point[1]) == (19 - column)) { // If the piece is in the bottom left corner
				if (a_piece.grid[a_piece.top][a_piece.right] == 1) {
					filled_corner = true;
				}
			}
		}
		else if ((a_piece.bottom - a_piece.anchor_point[0]) == (19 - row)) { // If the piece is in the top right corner
			if ((a_piece.anchor_point[1] - a_piece.left) == column) {
				if (a_piece.grid[a_piece.bottom][a_piece.left] == 1) {
					filled_corner = true;
				}
			}
			else if ((a_piece.right - a_piece.anchor_point[1]) == (19 - column)) { // If the piece is in the bottom right corner
				if (a_piece.grid[a_piece.bottom][a_piece.right] == 1) {
					filled_corner = true;
				}
			}
		}
	}
	return filled_corner;
}

// Function to build the first pieces
function place_piece(a_piece, row, column, grid, player) {
	let row_start = row - a_piece.anchor_point[0]; // Distance from piece index and top of piece
	let column_start = column - a_piece.anchor_point[1]; // Distance from piece index and left side of piece
	for (let i = 0; i < a_piece.rows; i++) {
		for (let j = 0; j < a_piece.columns; j++) {
			if (a_piece.grid[i][j] == 1) { // If tile of piece is a filled tile
				grid[row_start + i][column_start + j] = player.color; // Replace grid 0 with letter of player color
			}
		}
	}
}

// Function to check if the area is a valid area to put a piece
function area_check(a_piece, row, column, grid, player) {
	let row_start = row - a_piece.anchor_point[0]; // Distance from piece index and top of piece
	let column_start = column - a_piece.anchor_point[1]; // Distance from piece index and left side of piece
	let not_touching = true; // Boolean if piece is touching another piece on its side of the same color 
	let is_corner = false; // Boolean if piece's corner is touching another piece's corner of the same color
	let is_zero = true; // Boolean if the piece is not covering an occupied tile of the grid
	for (let i = 0; i < a_piece.rows; i++) {
		for (j = 0; j < a_piece.columns; j++) {
			if ((a_piece.grid[i][j] == 0) && (grid[row_start + i][column_start + j] == player.color)) {
				not_touching = false;
			}
			if ((a_piece.grid[i][j] == -1) && (grid[row_start + i][column_start + j] == player.color)) {
				is_corner = true;
			}
			if ((a_piece.grid[i][j] == 1) && (grid[row_start + i][column_start + j] != 0)) {
				is_zero = false;
			}
		}
	}
	return ((is_corner) && (is_zero) && (not_touching));
}

// Function to rotate a piece of a player clockwise 90 degrees
function rotate(a_player, piece_num) {
	let old = a_player.pieces[piece_num]; // Variable for old piece
	let new_grid = []; // New grid for new piece grid
	for (let i = 0; i < old.columns; i++) {
		let temp = [];
		for (let j = (old.rows - 1); 0 <= j; j--) {
			temp.push(old.grid[j][i]);
		}
		new_grid.push(temp);
	}
	a_player.pieces[piece_num] = new Piece(old.columns, old.rows, old.anchor_point[1], (old.rows - 1 - old.anchor_point[0]), old.value, new_grid); // Create new Piece object
}

// Function to flip piece to the other side
function flip(a_player, piece_num) {
	let old = a_player.pieces[piece_num]; // Variable for old piece
	let new_grid = []; // New grid for new piece grid
	for (let i = (old.rows - 1); 0 <= i; i--) {
		new_grid.push(old.grid[i]);
	}
	a_player.pieces[piece_num] = new Piece(old.rows, old.columns, (old.rows - 1 - old.anchor_point[0]), old.anchor_point[1], old.value, new_grid); // Create new Piece object
	console.log(a_player.pieces[piece_num]);
}

// Main function for game
function blokkus() {
	let grid = []; // Initialize grid 
	let row = 0; // Initialize row variable
	let column = 0; // Initialize column variable
	let player_list = [] // Initialize player list
	let piece_num = 0; // Initilaize piece number
	let pass = true; // Initliaze pass variable
	let game_state = true; // Initilize game state
	for (let i = 0; i < 20; i++) { // Create 20 x 20 grid
		grid[i] = [];
		for (let j = 0; j < 20; j++) {
			grid[i][j] = 0;
		}
	}
	let num_players = window.prompt("How many players are there?: "); //Get the number of players
	if (num_players == 2) {	
		let player_1 = new Player("B"); // Creater player 1
		let player_2 = new Player("R"); // Creater player 2
		player_1.pieces = player_1.pieces.concat(player_1.pieces); // Add extra pieces (since only 2 players)
		player_2.pieces = player_2.pieces.concat(player_2.pieces); // Add extra pieces (since only 2 players)
		player_list = [player_1, player_2]; // Create player list
		game_state = (player_1.continue || player_2.continue); // Create boolean for game state
	}
	else if (num_players == 3) {
		let player_1 = new Player("B"); // Creater player 1
		let player_2 = new Player("R"); // Creater player 2
		let player_3 = new Player("Y"); // Creater player 3
		player_list = [player_1, player_2, player_3]; // Create player list
		game_state = (player_1.continue || player_2.continue || player_3.continue); // Create boolean for game state
	}
	else if (num_players == 4) {
		let player_1 = new Player("B"); // Creater player 1
		let player_2 = new Player("R"); // Creater player 2
		let player_3 = new Player("Y"); // Creater player 3
		let player_4 = new Player("G"); // Creater player 4
		player_list = [player_1, player_2, player_3, player_4]; // Create player list
		game_state = (player_1.continue || player_2.continue || player_3.continue || player_4.continue); // Create boolean for game state
	}
	for (let i = 0; i < player_list.length; i++) { // For loop for each player to place their first piece
		do {
			row = parseInt(window.prompt("Player " + i.toString() + ": Row [0 - 19]: "), 10);
			column = parseInt(window.prompt("Player " + i.toString() + ": Column [0 - 19]: "), 10);
			piece_num = window.prompt("Which piece number you want to put: ");
			pass = first_piece(player_list[i].pieces[piece_num - 1], row, column, grid);
			if (pass == false) {
				console.log("Invalid first piece, please try again.");
			}
		}
		while (pass == false);
		place_piece(player_list[i].pieces[piece_num - 1], row, column, grid, player_list[i]);
		player_list[i].pieces[piece_num - 1] = 0;
		console.log(grid);
		console.log(player_list[i].pieces);
		pass = true;
	}
	do {
		for (let i = 0; i < player_list.length; i++) {
			if (player_list[i].continue == true) {
				turn_input = window.prompt("Player " + i.toString() + " please make a decision (place a piece: 1 or concede: 2)");
				if (turn_input == 1) {
					do {
						row = parseInt(window.prompt("Player " + i.toString() + ": Row [0 - 19]: "), 10);
						column = parseInt(window.prompt("Player " + i.toString() + ": Column [0 - 19]: "), 10);
						piece_num = window.prompt("Which piece number you want to put: ");
						pass = area_check(player_list[i].pieces[piece_num - 1], row, column, grid, player_list[i]);
						if (pass == false) {
							console.log("Invalid piece placement, please try again.");
						}
					}
					while (pass == false);
					place_piece(player_list[i].pieces[piece_num - 1], row, column, grid, player_list[i]);
					player_list[i].pieces[piece_num - 1] = 0;
					console.log(grid);
					console.log(player_list[i].pieces);
					pass = true;
				}
				else {
					player_list[i].continue = false;
				}
			}
		}
	}
	while (game_state == true);
}
