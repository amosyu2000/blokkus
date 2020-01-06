import * as BLOKKUS from './blokkus.js'

// ===========
//  CONSTANTS
// ===========

const WHITE = 0xaaaaaa
const RED = 0x880011
const GREEN = 0x117722
const BLUE = 0x003388
const YELLOW = 0x999900
const VALID_COLOR = 0x779977
const INVALID_COLOR = 0x777777


// ==================
//  GLOBAL VARIABLES
// ==================

// Scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(0,14.5,17)
const renderer = new THREE.WebGLRenderer({ antialias: true })

// Camera cameraControls
const clock = new THREE.Clock()
CameraControls.install( { THREE: THREE } );
const cameraControls = new CameraControls(camera, renderer.domElement)
cameraControls.enabled = false
cameraControls.setTarget(0,-15,0)

// Used to track the angles of the camera (azimuthal is side-to-side and polar is up-down)
var currentAzimuthalAngle = 0
var currentPolarAngle = Math.PI/6

// GLTF loader (for importing 3D models)
const loader = new THREE.GLTFLoader()
loader.setPath('resources/static/')

// For raycasting
const raycaster = new THREE.Raycaster()

// For storing the mouse position on a scale from -1 to +1
var mouse = new THREE.Vector2()

// For storing the board
var boardMesh

// A 2-dimensional array for storing the game board studs (20x20)
var studs = []

// For storing the stud that is currently being hovered over
var currentStud

// For storing the currently selected piece
var currentPiece

// Array from storing the players
var players = []

// For storing the current player
var currentPlayerIndex = 0
var currentPlayer, totalPlayers, remainingPlayers


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
		urlp[u[0]] = u[1]
	}
	return urlp
}

function showAxis() {
	let blue = new THREE.LineBasicMaterial({ color:0xaaaaff })
	let green = new THREE.LineBasicMaterial({ color:0xaaffaa })
	let red = new THREE.LineBasicMaterial({ color:0xffaaaa })

	let l = 15

	let x = new THREE.Geometry()
	x.vertices.push(new THREE.Vector3(-l,0,0), new THREE.Vector3(l,0,0))
	scene.add(new THREE.Line(x, red))
	let z = new THREE.Geometry()
	z.vertices.push(new THREE.Vector3(0,0,-l), new THREE.Vector3(0,0,l))
	scene.add(new THREE.Line(z, blue))
	let y = new THREE.Geometry()
	y.vertices.push(new THREE.Vector3(0,l,0), new THREE.Vector3(0,-l,0))
	scene.add(new THREE.Line(y, green))
}

// Moves the camera an angle of 90 degrees to the right
function rotate() {
	cameraControls.dampingFactor = 0.02
	while ( Math.round(2*currentAzimuthalAngle/Math.PI) %4 != currentPlayer.rotation ) {
		currentAzimuthalAngle += Math.PI/2
	}
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle, true)
}

// Moves the camera to an angle of 45 degrees to the hroizontal
function viewFromSide() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=Math.PI/6, true)
	$('#toggleView').text('View from Above')
}

// Moves the camera to( an angle of 45 degrees to the hroizontal
function viewFromAbove() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=0, true)
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

function addPlayers() {
	let urlp = parseURL()
	// If 2 players
	if (Object.keys(urlp).length == 2) {
		players.push(new BLOKKUS.Player(urlp['Player+Blue'], BLUE, 0))
		layPlayerPieces(players[0])
		players.push(new BLOKKUS.Player(urlp['Player+Red'], RED, 2))
		layPlayerPieces(players[1])

		totalPlayers = 2
		remainingPlayers = totalPlayers
	}
	// If 3 players
	else {
		players.push(new BLOKKUS.Player(urlp['Player+Blue'], BLUE, 0))
		layPlayerPieces(players[0])
		players.push(new BLOKKUS.Player(urlp['Player+Red'], RED, 1))
		layPlayerPieces(players[1])
		players.push(new BLOKKUS.Player(urlp['Player+Green'], GREEN, 2))
		layPlayerPieces(players[2])

		totalPlayers = 3
		remainingPlayers = totalPlayers
	}	
	// If 4 players
	if (Object.keys(urlp).length == 4) {
		players.push(new BLOKKUS.Player(urlp['Player+Yellow'], YELLOW, 3))
		layPlayerPieces(players[3])

		totalPlayers = 4
		remainingPlayers = totalPlayers
	}
}

function loadGLTF(filename){	
	return new Promise( (resolve, reject) => {	
		loader.load(filename, (gltf) => {
			gltf.scene.traverse( (child) => {
				if (child.type == 'Mesh') {
					resolve(child)
				}
			})
		})
	})
}

function createPieceMesh(piece, color) {
	let material = new THREE.MeshPhongMaterial({ color:color , shininess:50 })
	material.transparent = true
	material.opacity = 0.95

	return loadGLTF('tile.glb').then(function(mesh) {
		let pieceGeometry = new THREE.Geometry()
		for (const [k, row] of piece.grid.entries()) {
			for (const [i, tile] of row.entries()) {
				if (tile == 1) {
					let posX = i - piece.anchor_point[1]
					let posZ = k - piece.anchor_point[0]

					let tileGeometry = new THREE.Geometry().fromBufferGeometry(mesh.clone().geometry)
					tileGeometry.translate(posX,0,posZ)
					pieceGeometry.merge(tileGeometry)
				}
			}
		}
		return new THREE.Mesh(pieceGeometry, material)
	})
}

// Lays each piece is front of the player
// Takes a rotation (which side of the board to put it on) - either 0, PI/2, PI, or 3PI/2
function layPlayerPieces(player) {

	let rotatedMatrix = new THREE.Matrix4().makeRotationY(player.rotation*Math.PI/2)

	// x- and z- coordinates for all the pieces
	let pos = {
		0  : { x:6    , z:15.5 },	// i1
		1  : { x:-5.5 , z:12.5 },	// i2
		2  : { x:4.5  , z:15.5 },	// v3
		3  : { x:3.5  , z:14   },	// I3
		4  : { x:-1.5 , z:12.5 },	// O4
		5  : { x:6    , z:18   },	// T4
		6  : { x:-7   , z:11   },	// I4
		7  : { x:3    , z:18   },	// L4
		8  : { x:2    , z:12   },	// Z4
		9  : { x:-10  , z:12.5 },	// L5
		10 : { x:8.5  , z:16.5 },	// T5
		11 : { x:-3   , z:14   },	// V5
		12 : { x:4.5  , z:11.5 },	// N
		13 : { x:7    , z:13   },	// Z5
		14 : { x:10   , z:13   },	// I5
		15 : { x:-1.5 , z:17   },	// P
		16 : { x:-5.5 , z:15   },	// W
		17 : { x:-4   , z:16.5 },	// U
		18 : { x:-9.5 , z:15   },	// F
		19 : { x:1    , z:15.5 },	// X
		20 : { x:-8   , z:17.5 }	// Y
	}

	for (const [i, piece] of player.pieces.entries()) {
		createPieceMesh(piece, player.color).then( (mesh) => {
			piece.mesh = mesh
			piece.mesh.position.set(pos[i].x,-0.5,pos[i].z).applyMatrix4(rotatedMatrix)
			scene.add(piece.mesh)
			
			// Rotate the piece mesh
			piece.mesh.rotation.y = player.rotation*Math.PI/2
			
			// Rotate the piece grid
			piece.rotate(4-player.rotation) // '4-rotations' is to rotate the piece CCW
		})
	}

}

// TODO: Implement function that checks if valid position
function isValidPosition() {
	return true
}

// Casts a shadow of the currentPiece on the studs
// References the global variable mouseCoordinates
function castPieceShadow() {
	let color = INVALID_COLOR
	if(isValidPosition()) {
		color = VALID_COLOR
		$('body').css('cursor', 'pointer')
	}

	for (const [k, row] of currentPiece.grid.entries()) {
		for (const [i, stud] of row.entries()) {

			let posX = i + 10 + currentStud.position.x - 0.5 - currentPiece.anchor_point[1]
			let posZ = k + 10 + currentStud.position.z - 0.5 - currentPiece.anchor_point[0]

			if (stud == 1) {
				try {
					studs[posZ][posX].material.color.set(color)
				}
				catch(e){}
			}
		}
	}
}

function placePiece() {
	scene.remove(currentPiece.mesh)
	createPieceMesh(currentPiece, currentPlayer.color).then( (mesh) => {
		currentPiece.mesh = mesh
		scene.add(currentPiece.mesh)
		currentPiece.mesh.position.set(currentStud.position.x, 2, currentStud.position.z)
		dropPieceAnimation(currentPiece, 0)
		currentPiece = null
	})
	currentPiece.isPlaced = true
}

function nextPlayer() {
	do {
		// Next player
		currentPlayerIndex = ++currentPlayerIndex % totalPlayers
		currentPlayer = players[currentPlayerIndex]
		viewFromSide()
		rotate()
	} while (currentPlayer.continue != true && remainingPlayers > 0)
}

function gameEnd() {
	// TODO: What to do when the game is over
	viewFromAbove()
}

window.forfeit = function() {
	currentPlayer.continue = false
	remainingPlayers--

	if (remainingPlayers > 1)
		nextPlayer()
	else if (remainingPlayers == 1) {
		$('#forfeitBtn').text('Finish')
		nextPlayer()
	}
	else
		gameEnd()
}

function raisePieceAnimation(piece, height) {
	let mesh = piece.mesh
	mesh.position.y = (height+0.01)-(((height+0.01)-mesh.position.y)*0.95)
	if (mesh.position.y < height)
		piece.animationFrame = requestAnimationFrame( () => raisePieceAnimation(piece, height))
}

function dropPieceAnimation(piece, height) {
	let mesh = piece.mesh
	mesh.position.y = height+((mesh.position.y-height)*0.95)-0.001
	if (mesh.position.y > height)
		piece.animationFrame = requestAnimationFrame( () => dropPieceAnimation(piece, height))
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
					// Break the loop if the clicked object is already the currentPiece
					if (raycaster.intersectObject(currentPiece.mesh)[0]) {
						break raycasting
					}
					// Cancel the animation of the previous current piece
					cancelAnimationFrame(currentPiece.animationFrame)
					// Drop the previous current piece
					dropPieceAnimation(currentPiece, -0.5)
				}
				// Set the clicked piece to the new current piece
				currentPiece = piece
				// Raise the new current piece
				currentPiece.animationFrame = requestAnimationFrame( () => raisePieceAnimation(currentPiece, 0.5))
				// Break (i.e. don't raycast any other pieces)
				break raycasting
			}
		}

		// If the player clicks on a stud
		if (isValidPosition() && currentPiece && currentStud) {
			placePiece()
			if (remainingPlayers > 1)
				setTimeout( () => nextPlayer(), 1500)
		}

		// If the player clicks on the board (not the studs)
		else if (raycaster.intersectObject(boardMesh)[0]) {} // Do nothing

		else if (currentPiece) {
			cancelAnimationFrame(currentPiece.animationFrame)
			dropPieceAnimation(currentPiece, -0.5)
			currentPiece = null
		}

	}
})

$(document).keydown(function(e){
	if(e.keyCode == 32){
		cameraControls.enabled = true
	}
	if(e.keyCode == 90 && currentPiece){
		currentPiece.rotate(1)
	}
	if(e.keyCode == 88 && currentPiece){
		currentPiece.flip()
	}
})
$(document).keyup(function(e){
	if(e.keyCode == 32){
		cameraControls.enabled = false
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

// Game board
var board = new THREE.Shape([
	new THREE.Vector2(-10,10),
	new THREE.Vector2(10,10),
	new THREE.Vector2(10,-10),
	new THREE.Vector2(-10,-10)
	])
var boardExtrudeSettings = {steps:1, depth:0.5 , bevelEnabled:false}
var boardGeometry = new THREE.ExtrudeGeometry(board, boardExtrudeSettings)
boardGeometry.rotateX(Math.PI/2)

// Create the board mesh
var boardMaterial = new THREE.MeshStandardMaterial({ color: WHITE })
boardMesh = new THREE.Mesh(boardGeometry, boardMaterial)
scene.add(boardMesh)

// Studs
loadGLTF('stud.glb').then((mesh) => {
	let material = new THREE.MeshStandardMaterial({ color: WHITE })
	for (let k = -10; k < 10; k++) {
		let row = []
		for (let i = -10; i < 10; i++) {
			let m = mesh.clone()
			m.material = material.clone()
			m.position.set(i+0.5,0,k+0.5)
			scene.add(m)
			row.push(m)
		}
		studs.push(row)
	}
})

// Add players and players' pieces
addPlayers()
currentPlayer = players[currentPlayerIndex]


// Render or animate loop
function animate() {
	mainAnimationFrame = requestAnimationFrame(animate)

	// Camera control and positioning
	const delta = clock.getDelta()
	cameraControls.update(delta)

	// Set every stud to white
	currentStud = null
	for (const row of studs) {
		for (const stud of row) {
			stud.material.color.set(WHITE)
		}
	}

	// Reset mouse cursor type
	$('body').css('cursor', 'default')

	// Raycasting
	raycaster.setFromCamera(mouse,camera)

	// Raycast studs
	for (const row of studs) {
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
	for (const piece of currentPlayer.pieces) {
		let intersected = raycaster.intersectObject(piece.mesh)[0]
		// Raycasting found no object or object is already placed
		if (!intersected || piece.isPlaced) {}
		else
			$('body').css('cursor', 'pointer')
	}

	renderer.render(scene,camera)
}
var mainAnimationFrame = animate()


})