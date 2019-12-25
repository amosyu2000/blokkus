// ===========
//  CONSTANTS
// ===========

// In this file, coordinates will be an array
// the first value is the X position
const X = 0;
// and the second value is the Y position
const Y = 1;


// ===========
//  FUNCTIONS
// ===========

// Random Integer (min inclusive, max exclusive)
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Called when the "amount of players" buttons are pressed
function playerSelect(players) {
	// Opens the player-select div
	$('#player-select').css('flex', '1 1 0');
	$('#player-select-title').css('background-color', 'transparent');
	$('#player-select-start').css('background-color', 'transparent');
	// Shrinks the blokus title
	$('#title').css('transform','scale(0.7)');

	// Fills the player-select div based on which button was pressed
	switch(players) {
		case 2:
			$('#player-select-title').text("2 Players");
			break;
		case 3:
			$('#player-select-title').text("3 Players");
			break;
		case 4:
			$('#player-select-title').text("4 Players");
			break;
	}
}

// Rotates the blokus pieces in the background
// Takes a duration (in seconds) and an angle (in degrees) as parameters
$.fn.rotate = function(duration, angle) {

	// Get the current angle from the piece
	let currentAngle = parseInt($(this).attr('angle'));
	// Increase/decrease the current angle
	let newAngle = currentAngle + angle;
	// Set the new angle
	$(this).attr('angle', newAngle);
	
	// Rotate the piece
	$(this).css('transition', 'transform '+duration+'s');
	$(this).css('transform', 'rotate('+newAngle+'deg)');

	// Add a class to indicate that the piece is moving
	// This class is removed after the specified duration
	$(this).attr('inMotion', true);
	setTimeout(() => {$(this).removeAttr('inMotion')}, duration*1000);

}

// Randomly rotates the pieces (this function runs recursively forever)
function rotatePieces() {

	setTimeout(function() {
		let odds = 50;
		$('svg').each(function() {
			if (!$(this).attr('inMotion') && randInt(0,odds) == 0) {
				let duration = randInt(25,40);
				let angle = [-270, -180, -90, 90, 180, 270][randInt(0,6)];
				$(this).rotate(duration, angle);
			}
		});
		rotatePieces();
	}, 500);

}
rotatePieces();


// ================
//	DOCUMENT READY
// ================

$(document).ready(function() {

	// Assign each piece a random color and a random position
	let fillColors = ['limegreen', 'red', 'yellow', 'slateblue'];
	let strokeColors = ['green', 'darkred', 'darkkhaki', 'darkslateblue'];
	let positions = [
		['150px','290px'],
		['650px', '190px'],
		['1150px', '90px'],
		['350px', '590px'],
		['850px', '590px'],
		['1350px', '490px']];
	$('svg').each(function() {
		let i = randInt(0,4);
		let pos = positions.splice(randInt(0,positions.length),1);
		$(this).css({
			'fill' : fillColors[i], 
			'stroke' : strokeColors[i],
			'left' : pos[0][X],
			'top' : pos[0][Y]
		});
	});

	// Listener for when the user moves the mouse cursor
	$(document).mousemove(function(event) {
		let ratio = 20;
		let dx = event.pageX/ratio;
		let dy = event.pageY/ratio;
		$('#bg-pieces').css({
			left: dx,
			top: dy
		})
	});

	// Listener for when the blokus title is clicked
	$('#title').click(function() {
		$('#player-select').css('flex', '0 1 0');
		$('#title').css('transform','scale(1)');
		$('#player-select-title').css('background-color', 'white');
		$('#player-select-start').css('background-color', 'white');
	});

});