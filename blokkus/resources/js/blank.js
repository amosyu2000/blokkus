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