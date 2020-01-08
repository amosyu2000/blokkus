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