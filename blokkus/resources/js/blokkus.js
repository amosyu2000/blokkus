import * as THREE from '../../vendors/three/build/three.module.js'

import { Board } from './board.js'
import { Player } from './player.js'
import { toRadians } from './math.js'

// ===========
//  CONSTANTS
// ===========

const RED = 0x880011
const GREEN = 0x117722
const BLUE = 0x003388
const YELLOW = 0x999900


// ==================
//  GLOBAL VARIABLES
// ==================

// Scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0,14.5,17)
const renderer = new THREE.WebGLRenderer({ antialias:true , alpha:true })
renderer.setClearColor(0xffffff, 0.0)
renderer.setSize(window.innerWidth, window.innerHeight)

// Camera cameraControls
const clock = new THREE.Clock()
CameraControls.install( { THREE: THREE } )
const cameraControls = new CameraControls(camera, renderer.domElement)
cameraControls.setTarget(0,-15,0)
cameraControls.minDistance = 25
cameraControls.maxDistance = 40
cameraControls.mouseButtons.left = CameraControls.ACTION.NONE
cameraControls.mouseButtons.right = CameraControls.ACTION.NONE

// Used to track the angles of the camera (azimuthal is side-to-side and polar is up-down)
// In degrees
var currentAzimuthalAngle = 0
var currentPolarAngle = 30

// For raycasting
const raycaster = new THREE.Raycaster()

// For storing the mouse position on a scale from -1 to +1
var mouse = new THREE.Vector2()

// For storing the board
var board = new Board(scene)

// For storing the stud that is currently being hovered over
var currentStud

// For storing the currently selected piece
var currentPiece

// Array from storing the players
var players = []

// For storing the current player
var currentPlayerIndex = 0
var currentPlayer, totalPlayers, remainingPlayers

var mainAnimationFrame


// ===========
//  FUNCTIONS
// ===========

// Retrieves all the passed parameters from the URL and puts them in a dictionary
function parseURL() {
	let urlp = []
	let s = location.toString().split('?')
	s = s[1].split('&')
	for(let i = 0; i < s.length; i++) {
		let u = s[i].split('=')
		u[0] = u[0].split('+').join(' ')
		urlp[u[0]] = u[1]
	}
	for (const key in urlp) {
		if (urlp[key] == '') {
			urlp[key] = key
		}
	}
	return urlp
}

// Moves the camera an angle of 90 degrees to the right
function rotate(enableTransition) {
	cameraControls.dampingFactor = 0.02
	
	while ( currentAzimuthalAngle % 360 != currentPlayer.angle ) {
		currentAzimuthalAngle += 45
	}

	cameraControls.rotateTo( toRadians(currentAzimuthalAngle) , toRadians(currentPolarAngle) , enableTransition)
}

// Moves the camera to an angle of 45 degrees to the hroizontal
function viewFromSide() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo( toRadians(currentAzimuthalAngle) , toRadians(currentPolarAngle=30) , true)
	$('#toggleView').text('View from Above')
}

// Moves the camera to( an angle of 45 degrees to the hroizontal
function viewFromAbove() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo( toRadians(currentAzimuthalAngle) , toRadians(currentPolarAngle=0) , true)
	$('#toggleView').text('View from Side')
}

// Moves the camera to the top (bird's eye view)
window.toggleView = function() {
	if (currentPolarAngle == 0) {
		viewFromSide()
	}
	else {
		viewFromAbove()
	}
}

function addPieceSetToScene(pieces) {
	for (const piece of pieces)
		scene.add(piece.mesh)
}

function addPlayers() {
	let urlp = parseURL()
	// If 2 players
	if (Object.keys(urlp).length == 2) {
		players.push(new Player(urlp['Player Blue'], BLUE, 45))
		players[0].addNewPieceSet(0).then( (pieces) => addPieceSetToScene(pieces))
		players[0].addNewPieceSet(90).then( (pieces) => addPieceSetToScene(pieces))
		players.push(new Player(urlp['Player Red'], RED, 225))
		players[1].addNewPieceSet(180).then( (pieces) => addPieceSetToScene(pieces))
		players[1].addNewPieceSet(270).then( (pieces) => addPieceSetToScene(pieces))

		totalPlayers = 2
		remainingPlayers = totalPlayers
	}
	// If 3 players
	else {
		players.push(new Player(urlp['Player Blue'], BLUE, 0))
		players[0].addNewPieceSet(0).then( (pieces) => addPieceSetToScene(pieces))
		players.push(new Player(urlp['Player Red'], RED, 90))
		players[1].addNewPieceSet(90).then( (pieces) => addPieceSetToScene(pieces))
		players.push(new Player(urlp['Player Green'], GREEN, 180))
		players[2].addNewPieceSet(180).then( (pieces) => addPieceSetToScene(pieces))

		totalPlayers = 3
		remainingPlayers = totalPlayers
	}	
	// If 4 players
	if (Object.keys(urlp).length == 4) {
		players.push(new Player(urlp['Player Yellow'], YELLOW, 270))
		players[3].addNewPieceSet(270).then( (pieces) => addPieceSetToScene(pieces))

		totalPlayers = 4
		remainingPlayers = totalPlayers
	}
}

// TODO: Implement function that checks if valid position
function isValidPosition() {
	let piece = currentPiece
	let row = 10 + currentStud.position.x - 0.5
	let column = 10 + currentStud.position.z - 0.5
	console.log(row, column)

	if ((row - (piece.anchor_point[0] - piece.top)) < 0) { // If the piece is not greater than 0 (rows)
		return false
	}
	if (19 < (row + (piece.bottom - piece.anchor_point[0]))) { // If the piece is not greater than 0 (columns)
		return false
	}
	if ((column - (piece.anchor_point[1] - piece.left)) < 0) { // If the piece is not less than or equal to 19 (rows)
		return false
	}
	if (19 < (column + (piece.right - piece.anchor_point[1]))) { // If the piece is not less than or equal to 19 (columns)
		return false
	}
	return true
}

// Casts a shadow of the currentPiece on the studs
// References the global variable mouseCoordinates
function castPieceShadow() {
	let color = board.INVALID_COLOR
	if(isValidPosition()) {
		color = board.VALID_COLOR
		$('body').css('cursor', 'pointer')
	}

	for (const [k, row] of currentPiece.grid.entries()) {
		for (const [i, stud] of row.entries()) {

			let posX = i + 10 + currentStud.position.x - 0.5 - currentPiece.anchor_point[1]
			let posZ = k + 10 + currentStud.position.z - 0.5 - currentPiece.anchor_point[0]

			if (stud == 1) {
				try {
					board.studs[posZ][posX].material.color.set(color)
				}
				catch(e){}
			}
		}
	}
}

// Place the piece on the board (essentially deletes the mesh and creates a new one)
function placePiece() {
	scene.remove(currentPiece.mesh)
	currentPiece.mesh.geometry.dispose()

	currentPiece.isPlaced = true

	// Return a promise with the dropPieceAnimation promise chained to it
	return currentPiece.createPieceMesh(currentPlayer.color).then( (mesh) => {
		scene.add(currentPiece.mesh)
		currentPiece.mesh.position.set(currentStud.position.x, 2, currentStud.position.z)
	}).then ( () => {
		let p = currentPiece
		currentPiece = null
		return dropPieceAnimation(p, 0)
	})
}

function nextPlayer() {
	do {
		// Next player
		currentPlayerIndex = ++currentPlayerIndex % totalPlayers
		currentPlayer = players[currentPlayerIndex]
		viewFromSide()
		rotate(true)
	} while (currentPlayer.continue != true && remainingPlayers > 0)
}

function gameEnd() {
	// TODO: What to do when the game is over

	currentPlayer = null
	currentAzimuthalAngle -= currentAzimuthalAngle % 90
	cameraControls.dampingFactor = 0.02
	cameraControls.rotateTo( toRadians(currentAzimuthalAngle) , 0, true)
}

function raisePieceAnimation(piece, height) {
	let mesh = piece.mesh
	
	return new Promise( (resolve,reject) => {		
		let animationFrame = function() {	
			mesh.position.y = (height+0.01)-(((height+0.01)-mesh.position.y)*0.95)
			if (mesh.position.y < height)
				piece.animationFrame = requestAnimationFrame(animationFrame)
			else {
				resolve()
			}
		}
		animationFrame()
	})
}

function dropPieceAnimation(piece, height) {
	let mesh = piece.mesh

	return new Promise( (resolve,reject) => {
		let animationFrame = function() {
			mesh.position.y = height+((mesh.position.y-height)*0.95)-0.001
			if (mesh.position.y > height)
				piece.animationFrame = requestAnimationFrame(animationFrame)
			else {
				resolve()
			}
		}
		animationFrame()
	})
}

window.forfeit = function() {
	currentPlayer.continue = false
	remainingPlayers--

	if (currentPiece) {
		cancelAnimationFrame(currentPiece.animationFrame)
		dropPieceAnimation(currentPiece, -0.5)
		currentPiece = null
	}

	if (remainingPlayers > 1)
		nextPlayer()
	else if (remainingPlayers == 1) {
		$('#forfeitBtn').text('Finish')
		nextPlayer()
	}
	else
		gameEnd()
}


// ===========
//  LISTENERS
// ===========

$(document).mousemove(function() {
	// Calculates and stores mouse position on a scale from -1 to +1
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
})

$(document).click(function() {
	raycasting: {

		// Do nothing if the user clicks when it isn't a player's turn
		if (!currentPlayer)
			break raycasting

		// For selecting/deselecting a piece
		// Raycast the current player's pieces
		for (const piece of currentPlayer.pieces) {

			let intersected = raycaster.intersectObject(piece.mesh)[0]
			// Raycasting found no piece or piece is already placed
			if (!intersected || piece.isPlaced) {}
			// Raycasting found an object
			else { 
				// If a piece is currently selected
				if (currentPiece) {
					// Deselect the currentPiece if it is the clicked object
					if (raycaster.intersectObject(currentPiece.mesh)[0]) {
						cancelAnimationFrame(currentPiece.animationFrame)
						dropPieceAnimation(currentPiece, -0.5)
						currentPiece = null
						break raycasting
					}
					// Drop the previous current piece
					cancelAnimationFrame(currentPiece.animationFrame)
					dropPieceAnimation(currentPiece, -0.5)
				}
				// Set the clicked piece to the new current piece
				currentPiece = piece
				// Raise the new current piece
				cancelAnimationFrame(currentPiece.animationFrame)
				currentPiece.animationFrame = raisePieceAnimation(currentPiece, 0.5)
				// Break (i.e. don't raycast any other pieces)
				break raycasting
			}
		}

		// If the player clicks on a stud
		if (currentPiece && currentStud && isValidPosition()) {
			currentPlayer.score += currentPiece.score
			if (remainingPlayers > 1) {
				placePiece().then(nextPlayer)
				currentPlayer = null
			}
			else {
				placePiece()
			}
		}

		// If the player clicks on the board (not the studs)
		else if (raycaster.intersectObject(board.mesh)[0]) {} // Do nothing

	}
})

$(document).keydown(function(e){
	if(e.keyCode == 90 && currentPiece){
		currentPiece.rotate(1)
	}
	if(e.keyCode == 88 && currentPiece){
		currentPiece.flip()
	}
})


// ================
//	DOCUMENT READY
// ================

$(document).ready(function() {


// Set the size of the renderer and add it to the HTML
renderer.setSize(window.innerWidth, window.innerHeight)
$('body').append(renderer.domElement)

//Scene lighting
var ambientLight = new THREE.AmbientLight (0xffffff, 1)
scene.add(ambientLight)
var pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(0,20,0)
scene.add(pointLight)

// Add players and players' pieces
addPlayers()
currentPlayer = players[currentPlayerIndex]
rotate(false)


// Render or animate loop
function animate() {
	mainAnimationFrame = requestAnimationFrame(animate)

	// Camera control and positioning
	const delta = clock.getDelta()
	cameraControls.update(delta)

	// Set every stud to white
	currentStud = null
	board.clean()

	// Reset mouse cursor type
	$('body').css('cursor', 'default')

	// Raycasting
	raycaster.setFromCamera(mouse,camera)

	// Raycast studs
	for (const row of board.studs) {
		// intersectObjects returns an array of intersected objects
		let intersected = raycaster.intersectObjects(row)[0]
		// Raycasting found no objects
		if (!intersected) {} 
		// Only display piece shadow if a piece is selected
		else if (currentPiece) {
			currentStud = intersected.object
			castPieceShadow()
		}
	}

	// Raycast the current player's pieces
	if (currentPlayer) {
		for (const piece of currentPlayer.pieces) {
			let intersected = raycaster.intersectObject(piece.mesh)[0]
			// Raycasting found no object or object is already placed
			if (!intersected || piece.isPlaced) {}
			else {
				$('body').css('cursor', 'pointer')
			}
		}
	}

	renderer.render(scene, camera)
}
mainAnimationFrame = animate()


})