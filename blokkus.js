// Class for tile which takes an argument (tile type)
class Tile {
	constructor(type){
		this.type = type;
		this.thickness = 5; // Initialized thickness (y) as 5
	}
}

// Class for piece which takes 5 arguments (length, height, index_x, index_y, values)
class Piece {
	constructor(rows, columns, index_row, index_column, grid){
		this.rows = rows;
		this.columns = columns;
		this.index_row = index_row;
		this.index_column = index_column;
		this.grid = grid;
	}
}

// Blokus pieces
// Grid goes down and right
// 1 = Tile
// 0 = Space beside a tile
// -1 = Corner tile
// -2 = Non connected tile
var piece_1 = new Piece(3, 3, 1, 1, [[-1, 0, -1], [0, 1, 0], [-1, 0, -1]]);
var piece_2 = new Piece(3, 4, 1, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_3 = new Piece(4, 4, 1, 2, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 1, 0], [-2, -1, 0, -1]]);
var piece_4 = new Piece(3, 5, 1, 2, [[-1, 0, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_5 = new Piece(4, 4, 2, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_6 = new Piece(4, 5, 2, 2, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_7 = new Piece(3, 6, 1, 2, [[-1, 0, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_8 = new Piece(4, 5, 2, 3, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_9 = new Piece(4, 5, 2, 2, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 0, -1, -2]]);
var piece_10 = new Piece(4, 6, 2, 1, [[-1, 0, -1, -2, -2, -2], [0, 1, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_11 = new Piece(5, 5, 3, 2, [[-2, -1, 0, -1, -2], [-2, 0, 1, 0, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_12 = new Piece(5, 5, 3, 1, [[-1, 0, -1, -2, -2], [0, 1, 0, -2, -2], [0, 1, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_13 = new Piece(4, 6, 1, 2, [[-2, -1, 0, 0, 0, -1], [-1, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, -1], [-1, 0, 0, -1, -2, -2]]);
var piece_14 = new Piece(5, 5, 2, 2, [[-2, -2, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, -1], [-1, 0, -1, -2, -2]]);
var piece_15 = new Piece(7, 3, 3, 1, [[-1, 0, -1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, -1]]);
var piece_16 = new Piece(5, 4, 2, 1, [[-1, 0, -1, -2], [0, 1, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_17 = new Piece(5, 5, 2, 2, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [0, 1, 0, -1, -2], [-1, 0, -1, -2, -2]]);
var piece_18 = new Piece(5, 4, 2, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_19 = new Piece(5, 5, 2, 2, [[-2, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 1, 0, -2], [-2, -1, 0, -1, -2]]);
var piece_20 = new Piece(5, 5, 2, 2, [[-2, -1, 0, -1, -2], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 1, 0, -1], [-2, -1, 0, -1, -2]]);
var piece_21 = new Piece(4, 6, 2, 2, [[-2, -1, 0, -1, -2, -2], [-1, 0, 1, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);

// Function to check if the area is a valid area to put a piece
// To pass, the piece must:
// - Touch another piece's corner of the same player
// - Not overlap another piece
// - Not touch another piece's side
function area_check(a_piece, row, column, grid) {
	var row_start = row - a_piece.index_row;
	var column_start = column - a_piece.index_column;
	var is_corner = false;
	var is_zero = true;
	var not_touching = true;
	for (i = 0; i < a_piece.rows; i++) {
		for (j = 0; j < a_piece.columns; j++) {
			if ((a_piece.grid[i][j] == 0) && (grid[row_start + i][column_start + j] == 1)) {
				not_touching = false;
			}
			if ((a_piece.grid[i][j] == -1) && (grid[row_start + i][column_start + j] == 1)) {
				is_corner = true;
			}
			if ((a_piece.grid[i][j] == 1) && (grid[row_start + i][column_start + j] == 1)) {
				is_zero = false;
			}
		}
	}
	return ((is_corner) && (is_zero) && (not_touching));
}

// Function to place piece into grid
function place_piece(a_piece, row, column, grid) {
	var row_start = row - a_piece.index_row;
	var column_start = column - a_piece.index_column;
	if (area_check(a_piece, row, column)) {
		for (i = 0; i < a_piece.rows; i++) {
			for (j = 0; j < a_piece.columns; j++) {
				if (a_piece.grid[i][j] == 1) {
					grid[row_start + i][column_start + j] = a_piece.grid[i][j];
				}
			}
		}
		console.log(grid);
	}
	else {
		console.log("This piece does not fit.");
	}
}


// Function to check wether piece placement is in bounds
function in_bounds(a_piece, row, column, grid) {
	var row_start = row - a_piece.index_row + 1;
	var column_start = column - a_piece.index_column + 1;
	var row_end = row + a_piece.rows - a_piece.index_row - 2;
	var column_end = column + a_piece.columns - a_piece.index_column - 2;
	if ((0 <= row_start) && (0 <= column_start) && (row_end < 20) && (column_end < 20)) {
		return true
	}
	else {
		return false
	}
}

// Function to place the first piece in the corner of the grid
function first_piece(a_piece, row, column, grid) {
	var row_start = row - a_piece.index_row; //Row to start input (top)
	var column_start = column - a_piece.index_column; //Column to start input (left)
	var row_end = row + a_piece.rows - a_piece.index_row - 2; //Bottom row of input piece
	var bottom_right = a_piece.grid[a_piece.rows - 2][1]; //Bottom left value
	if (in_bounds(a_piece, row, column, grid)) {
		if ((bottom_right == 1) && (row_end == 19) && ((column_start + 1) == 0)){
			for (i = 0; i < a_piece.rows; i++) {
				for (j = 0; j < a_piece.columns; j++) {
					if (a_piece.grid[i][j] == 1) {
						grid[row_start + i][column_start + j] = a_piece.grid[i][j];
					}
				}
			}

		}
		else {
			console.log("This piece is invalid.");
		}
	}	
	else {
		console.log("This piece does not fit.");
	}
}

// Main function for game
function blokkus() {
	//All grid related numbers are measured by index 
	// Blokus grid (20 x 20)
	var grid = [];
	for (i = 0; i < 20; i++) {
		grid[i] = [];
		for (j = 0; j < 20; j++) {
			grid[i][j] = 0;
		}
	}
	first_piece(piece_18, 18, 0, grid);
	console.log(grid);
}

blokkus();