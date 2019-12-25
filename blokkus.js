// Blokus grid (20 x 20)
var grid = [];
for (i = 0; i < 20; i++) {
	grid[i] = [];
	for (j = 0; j < 20; j++) {
		grid[i][j] = 0;
	}
}

// Class for tile which takes an argument (tile type)
class Tile {
	constructor(type){
		this.type = type;
		this.thickness = 5; // Initialized thickness (y) as 5
	}
}

// Class for piece which takes 3 arguments (length, width, values)
class Piece {
	constructor(width, height, index_x, index_y,  grid){
		this.x = length;
		this.y = width;
		this.index_x = index_x;
		this.index_y = index_y;
		this.piece = grid;
	}
}

// Blokus pieces
var piece_1 = new Piece(1, 1, 1, 1, [[-1, 0, -1], [0, 1, 0], [-1, 0, -1]]);
var piece_2 = new Piece(2, 1, 1, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_3 = new Piece(2, 2, 1, 2, [[-1, 0, 0, -1], [0, 1, 1, 0], [-1, 0, 1, 0], [0, -1, 0, -1]]);
var piece_4 = new Piece(3, 1, 1, 2, [[-1, 0, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_5 = new Piece(2, 2, 2, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_6 = new Piece(3, 2, 2, 2, [[0, -1, 0, -1, 0], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_7 = new Piece(4, 1, 1, 2, [[-1, 0, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_8 = new Piece(3, 2, 2, 3, [[0, 0, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_9 = new Piece(3, 2, 2, 2, [[0, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 0, -1, 0]]);
var piece_10 = new Piece(4, 2, 2, 1, [[-1, 0, -1, 0, 0, 0], [0, 1, 0, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);
var piece_11 = new Piece(3, 3, 3, 2, [[0, -1, 0, -1, 0], [0, 0, 1, 0, 0], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_12 = new Piece(3, 3, 3, 1, [[-1, 0, -1, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 0, 0, -1]]);
var piece_13 = new Piece(4, 2, 1, 2, [[0, -1, 0, 0, 0, -1], [-1, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, -1], [-1, 0, 0, -1, 0, 0]]);
var piece_14 = new Piece(3, 3, 2, 2, [[0, 0, -1, 0, -1], [-1, 0, 0, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, -1], [-1, 0, -1, 0, 0]]);
var piece_15 = new Piece(1, 5, 3, 1, [[-1, 0, -1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [-1, 0, -1]]);
var piece_16 = new Piece(2, 3, 2, 1, [[-1, 0, -1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_17 = new Piece(3, 3, 2, 2, [[0, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [0, 1, 0, -1, 0], [-1, 0, -1, 0, 0]]);
var piece_18 = new Piece(2, 3, 2, 1, [[-1, 0, 0, -1], [0, 1, 1, 0], [0, 1, 0, -1], [0, 1, 1, 0], [-1, 0, 0, -1]]);
var piece_19 = new Piece(3, 3, 2, 2, [[0, -1, 0, 0, -1], [-1, 0, 1, 1, 0], [0, 1, 1, 0, -1], [-1, 0, 1, 0, 0], [0, -1, 0, -1, 0]]);
var piece_20 = new Piece(3, 3, 2, 2, [[0, -1, 0, -1, 0], [-1, 0, 1, 0, -1], [0, 1, 1, 1, 0], [-1, 0, 1, 0, -1], [0, -1, 0, -1, 0]]);
var piece_21 = new Piece(4, 2, 2, 2, [[0, -1, 0, -1, 0, 0], [-1, 0, 1, 0, 0, -1], [0, 1, 1, 1, 1, 0], [-1, 0, 0, 0, 0, -1]]);


function place_piece(a_piece, x, y) {
	for (i = 0; i < 20; i++) {
		for (j = 0; j < 20; i++) {

		}
	}
}

console.log(grid);