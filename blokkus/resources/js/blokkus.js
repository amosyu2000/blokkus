// Class for piece 
class Piece { 

	constructor(rows, columns, anchor_row, anchor_column, value, grid){ // Takes 5 arguments (length, height, index_x, index_y, values)
		this.rows = rows; // Row size of piece
		this.columns = columns; // Column size of piece
		this.anchor_point = [anchor_row, anchor_column]; // Rotational point of piece 
		this.top = 1; // Top position
		this.bottom = (rows - 2); // Bottom position
		this.left = 1; // Left position
		this.right = (columns - 2); // Right position
		this.value = value; // Number of tiles within piece
		this.grid = grid; // Actual piece as nested array

		this.mesh = new THREE.Mesh(); // The 3D mesh associated with the piece
		this.isPlaced = false; // If piece is currently on or off the board
		this.animationFrame = null; // For storing the current animation of the piece (Ex. https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame )
	}

	// Function to rotate the piece clockwise 90 degrees a given number of times
	rotate(numberOfRotations) {
		for (let rotation = 0; rotation < numberOfRotations; rotation++) {
			let new_grid = []; // New grid for new piece grid
			for (let i = 0; i < this.columns; i++) {
				let temp = [];
				for (let j = (this.rows - 1); 0 <= j; j--) {
					temp.push(this.grid[j][i]);
				}
				new_grid.push(temp);
			}

			let old_anchor_point_0 = this.anchor_point[0];
			// New anchor point
			this.anchor_point[0] = this.anchor_point[1];
			this.anchor_point[1] = this.rows - old_anchor_point_0 - 1; 

			// Switch rows and columns
			let old_rows = this.rows;
			this.rows = this.columns;
			this.columns = old_rows;

			this.grid = new_grid; // New grid
		}
	}

	// Function to flip piece to the other side
	flip() {
		let new_grid = []; // New grid for new piece grid
		for (let i = (this.rows - 1); 0 <= i; i--) {
			new_grid.push(this.grid[i]);
		}

		let old_anchor_point_0 = this.anchor_point[0];
		// New anchor point
		this.anchor_point[0] = this.rows - 1 - old_anchor_point_0;

		this.grid = new_grid; // New grid
	}

}

// Class for player 
export class Player { 
	constructor(name, color, rotation) { // Takes three arguments (name, color, angle)
		this.name = name; // Player name
		this.color = color; // Color of player's tiles
		this.rotation = rotation; // Where the player is sitting around the table
		this.score = 0; // Player score
		this.continue = true; // Forfeit status
		// Blokus pieces
		// Grid goes down and right
		// 1 = Tile
		// 0 = Space beside a tile
		// -1 = Corner tile
		// -2 = Non connected tile
		this.pieces = [
			new Piece(3, 3, 1, 1, 1, [[-1, 0, -1], [0, 1, 0], [-1, 0, -1]]),
			new Piece(3, 4, 1, 1, 2, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(4, 4, 1, 2, 3, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 1, 0], [-2, -1, 0, -1]]),
			new Piece(3, 5, 1, 2, 3, [[-1, 0, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 4, 2, 1, 4, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(3, 6, 1, 2, 4, [[-1, 0, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
			new Piece(4, 5, 2, 3, 4, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 5, 2, 2, 4, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 0, -1, -2]]),
			new Piece(4, 6, 2, 1, 5, [[-1, 0, -1, -2, -2, -2], [0, 1, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
			new Piece(5, 5, 3, 2, 5, [[-2, -1, 0, -1, -2], [-2, 0, 1, 0, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(5, 5, 3, 1, 5, [[-1, 0, -1, -2, -2], [0, 1, 0, -2, -2], [0, 1, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]),
			new Piece(4, 6, 1, 2, 5, [[-2, -1, 0, 0, 0, -1], [-1, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, -1], [-1, 0, 0, -1, -2, -2]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, -1], [-1, 0, -1, -2, -2]]),
			new Piece(7, 3, 3, 1, 5, [[-1, 0, -1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, -1]]),
			new Piece(5, 4, 2, 1, 5, [[-1, 0, -1, -2], [0, 1, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [0, 1, 0, -1, -2], [-1, 0, -1, -2, -2]]),
			new Piece(5, 4, 2, 1, 5, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 1, 0, -2], [-2, -1, 0, -1, -2]]),
			new Piece(5, 5, 2, 2, 5, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 1, 0, -1], [-2, -1, 0, -1, -2]]),
			new Piece(4, 6, 2, 2, 5, [[-2, -1, 0, -1, -2, -2], [-1, 0, 1, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]),
		]
	}
}

// Function to check wether piece placement is in bounds
function in_bounds(a_piece, row, column, grid) {
	state = true; // State to be returned false if any of the tests fail
	if ((row - (a_piece.index_point[0] - a_piece.top)) < 0) { // If the piece is not greater than 0 (rows)
		state = false;
	}
	if (19 < (row + (a_piece.bottom - a_piece.index_point[0]))) { // If the piece is not greater than 0 (columns)
		state = false;
	}
	if ((column - (a_piece.index_point[1] - a_piece.left)) < 0) { // If the piece is not less than or equal to 19 (rows)
		state = false;
	}
	if (19 < (column + (a_piece.right - a_piece.index_point[1]))) { // If the piece is not less than or equal to 19 (columns)
		state = false;
	}
	return state;
}

// Function to place the first piece in a corner of the grid
function first_piece(a_piece, row, column, grid) {
	let filled_corner = false; // Boolean to check if corner piece touches corner and has tile value 1
	if (in_bounds(a_piece, row, column, grid)) { // If the piece is in bounds
		if ((a_piece.index_point[0] - a_piece.top) == row) { 
			if ((a_piece.index_point[1] - a_piece.left) == column) { // If the piece is in the top left corner
				if (a_piece.grid[a_piece.top][a_piece.left] == 1) {
					filled_corner = true;
				}
			}
			else if ((a_piece.right - a_piece.index_point[1]) == (19 - column)) { // If the piece is in the bottom left corner
				if (a_piece.grid[a_piece.top][a_piece.right] == 1) {
					filled_corner = true;
				}
			}
		}
		else if ((a_piece.bottom - a_piece.index_point[0]) == (19 - row)) { // If the piece is in the top right corner
			if ((a_piece.index_point[1] - a_piece.left) == column) {
				if (a_piece.grid[a_piece.bottom][a_piece.left] == 1) {
					filled_corner = true;
				}
			}
			else if ((a_piece.right - a_piece.index_point[1]) == (19 - column)) { // If the piece is in the bottom right corner
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
	let row_start = row - a_piece.index_point[0]; // Distance from piece index and top of piece
	let column_start = column - a_piece.index_point[1]; // Distance from piece index and left side of piece
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
	let row_start = row - a_piece.index_point[0]; // Distance from piece index and top of piece
	let column_start = column - a_piece.index_point[1]; // Distance from piece index and left side of piece
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


// Main function for game
function blokkus() {
	let grid = []; //Create 20 by 20 grid
	let row = 0;
	let column = 0;
	let player_list = []
	let piece_num = 0;
	let pass = true;
	let game_state = true
	for (let i = 0; i < 20; i++) {
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