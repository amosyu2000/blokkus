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
$(document).keydown(function(e){
	if(e.keyCode == 32){
		cameraControls.enabled = true
	}
})
$(document).keyup(function(e){
	if(e.keyCode == 32){
		cameraControls.enabled = false
	}
})

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
var currentPlayer


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
window.rotate = function rotate() {
	cameraControls.dampingFactor = 0.02
	cameraControls.rotateTo(currentAzimuthalAngle+=Math.PI/2, currentPolarAngle, true)
}

// Moves the camera to the top (bird's eye view)
window.viewFromTop = function() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=0, true)
}

// Moves the camera to an angle of 45 degrees to the hroizontal
window.viewFromSide = function() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=Math.PI/6, true)
}

function addPlayers() {
	let urlp = parseURL()
	// If 2 players
	if (Object.keys(urlp).length == 2) {
		players.push(new BLOKKUS.Player(urlp['Player+Blue'], BLUE))
		layPlayerPieces(players[0], 0)
		players.push(new BLOKKUS.Player(urlp['Player+Red'], RED))
		layPlayerPieces(players[1], Math.PI)
	}
	// If 3 players
	else {
		players.push(new BLOKKUS.Player(urlp['Player+Blue'], BLUE))
		layPlayerPieces(players[0], 0)
		players.push(new BLOKKUS.Player(urlp['Player+Red'], RED))
		layPlayerPieces(players[1], Math.PI/2)
		players.push(new BLOKKUS.Player(urlp['Player+Green'], GREEN))
		layPlayerPieces(players[2], Math.PI)
	}	
	// If 4 players
	if (Object.keys(urlp).length == 4) {
		players.push(new BLOKKUS.Player(urlp['Player+Yellow'], YELLOW))
		layPlayerPieces(players[3], 3*Math.PI/2)
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

// Lays each piece is front of the player (beware: long, hard-coded function)
// Takes a rotation (which side of the board to put it on) - either 0, PI/2, PI, or 3PI/2
function layPlayerPieces(player, rotation) {

	let rotatedMatrix = new THREE.Matrix4().makeRotationY(rotation)

	createPieceMesh(player.pieces[0], player.color).then( (mesh) => {
		player.pieces[0].mesh = mesh
		player.pieces[0].mesh.position.set(5.5,-0.5,15).applyMatrix4(rotatedMatrix)
		player.pieces[0].mesh.rotation.y = rotation
		scene.add(player.pieces[0].mesh)
	})
	createPieceMesh(player.pieces[1], player.color).then( (mesh) => {
		player.pieces[1].mesh = mesh
		player.pieces[1].mesh.position.set(-6,-0.5,12).applyMatrix4(rotatedMatrix)
		player.pieces[1].mesh.rotation.y = rotation
		scene.add(player.pieces[1].mesh)
	})
	createPieceMesh(player.pieces[2], player.color).then( (mesh) => {
		player.pieces[2].mesh = mesh
		player.pieces[2].mesh.position.set(4,-0.5,15).applyMatrix4(rotatedMatrix)
		player.pieces[2].mesh.rotation.y = rotation
		scene.add(player.pieces[2].mesh)
	})
	createPieceMesh(player.pieces[3], player.color).then( (mesh) => {
		player.pieces[3].mesh = mesh
		player.pieces[3].mesh.position.set(3,-0.5,13.5).applyMatrix4(rotatedMatrix)
		player.pieces[3].mesh.rotation.y = rotation
		scene.add(player.pieces[3].mesh)
	})
	createPieceMesh(player.pieces[4], player.color).then( (mesh) => {
		player.pieces[4].mesh = mesh
		player.pieces[4].mesh.position.set(-2,-0.5,12).applyMatrix4(rotatedMatrix)
		player.pieces[4].mesh.rotation.y = rotation
		scene.add(player.pieces[4].mesh)
	})
	createPieceMesh(player.pieces[5], player.color).then( (mesh) => {
		player.pieces[5].mesh = mesh
		player.pieces[5].mesh.position.set(5.5,-0.5,17.5).applyMatrix4(rotatedMatrix)
		player.pieces[5].mesh.rotation.y = rotation
		scene.add(player.pieces[5].mesh)
	})
	createPieceMesh(player.pieces[6], player.color).then( (mesh) => {
		player.pieces[6].mesh = mesh
		player.pieces[6].mesh.position.set(-7.5,-0.5,10.5).applyMatrix4(rotatedMatrix)
		player.pieces[6].mesh.rotation.y = rotation
		scene.add(player.pieces[6].mesh)
	})
	createPieceMesh(player.pieces[7], player.color).then( (mesh) => {
		player.pieces[7].mesh = mesh
		player.pieces[7].mesh.position.set(2.5,-0.5,17.5).applyMatrix4(rotatedMatrix)
		player.pieces[7].mesh.rotation.y = rotation
		scene.add(player.pieces[7].mesh)
	})
	createPieceMesh(player.pieces[8], player.color).then( (mesh) => {
		player.pieces[8].mesh = mesh
		player.pieces[8].mesh.position.set(1.5,-0.5,11.5).applyMatrix4(rotatedMatrix)
		player.pieces[8].mesh.rotation.y = rotation
		scene.add(player.pieces[8].mesh)
	})
	createPieceMesh(player.pieces[9], player.color).then( (mesh) => {
		player.pieces[9].mesh = mesh
		player.pieces[9].mesh.position.set(-10.5,-0.5,12).applyMatrix4(rotatedMatrix)
		player.pieces[9].mesh.rotation.y = rotation
		scene.add(player.pieces[9].mesh)
	})
	createPieceMesh(player.pieces[10], player.color).then( (mesh) => {
		player.pieces[10].mesh = mesh
		player.pieces[10].mesh.position.set(8,-0.5,16).applyMatrix4(rotatedMatrix)
		player.pieces[10].mesh.rotation.y = rotation
		scene.add(player.pieces[10].mesh)
	})
	createPieceMesh(player.pieces[11], player.color).then( (mesh) => {
		player.pieces[11].mesh = mesh
		player.pieces[11].mesh.position.set(-3.5,-0.5,13.5).applyMatrix4(rotatedMatrix)
		player.pieces[11].mesh.rotation.y = rotation
		scene.add(player.pieces[11].mesh)
	})
	createPieceMesh(player.pieces[12], player.color).then( (mesh) => {
		player.pieces[12].mesh = mesh
		player.pieces[12].mesh.position.set(4,-0.5,11).applyMatrix4(rotatedMatrix)
		player.pieces[12].mesh.rotation.y = rotation
		scene.add(player.pieces[12].mesh)
	})
	createPieceMesh(player.pieces[13], player.color).then( (mesh) => {
		player.pieces[13].mesh = mesh
		player.pieces[13].mesh.position.set(6.5,-0.5,12.5).applyMatrix4(rotatedMatrix)
		player.pieces[13].mesh.rotation.y = rotation
		scene.add(player.pieces[13].mesh)
	})
	createPieceMesh(player.pieces[14], player.color).then( (mesh) => {
		player.pieces[14].mesh = mesh
		player.pieces[14].mesh.position.set(9.5,-0.5,12.5).applyMatrix4(rotatedMatrix)
		player.pieces[14].mesh.rotation.y = rotation
		scene.add(player.pieces[14].mesh)
	})
	createPieceMesh(player.pieces[15], player.color).then( (mesh) => {
		player.pieces[15].mesh = mesh
		player.pieces[15].mesh.position.set(-2,-0.5,16.5).applyMatrix4(rotatedMatrix)
		player.pieces[15].mesh.rotation.y = rotation
		scene.add(player.pieces[15].mesh)
	})
	createPieceMesh(player.pieces[16], player.color).then( (mesh) => {
		player.pieces[16].mesh = mesh
		player.pieces[16].mesh.position.set(-6,-0.5,14.5).applyMatrix4(rotatedMatrix)
		player.pieces[16].mesh.rotation.y = rotation
		scene.add(player.pieces[16].mesh)
	})
	createPieceMesh(player.pieces[17], player.color).then( (mesh) => {
		player.pieces[17].mesh = mesh
		player.pieces[17].mesh.position.set(-4.5,-0.5,16).applyMatrix4(rotatedMatrix)
		player.pieces[17].mesh.rotation.y = rotation
		scene.add(player.pieces[17].mesh)
	})
	createPieceMesh(player.pieces[18], player.color).then( (mesh) => {
		player.pieces[18].mesh = mesh
		player.pieces[18].mesh.position.set(-10,-0.5,14.5).applyMatrix4(rotatedMatrix)
		player.pieces[18].mesh.rotation.y = rotation
		scene.add(player.pieces[18].mesh)
	})
	createPieceMesh(player.pieces[19], player.color).then( (mesh) => {
		player.pieces[19].mesh = mesh
		player.pieces[19].mesh.position.set(0.5,-0.5,15).applyMatrix4(rotatedMatrix)
		player.pieces[19].mesh.rotation.y = rotation
		scene.add(player.pieces[19].mesh)
	})
	createPieceMesh(player.pieces[20], player.color).then( (mesh) => {
		player.pieces[20].mesh = mesh
		player.pieces[20].mesh.position.set(-8.5,-0.5,17).applyMatrix4(rotatedMatrix)
		player.pieces[20].mesh.rotation.y = rotation
		scene.add(player.pieces[20].mesh)
	})
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

			let posX = i + 10 + currentStud.position.x - currentPiece.anchor_point[1]
			let posZ = k + 10 + currentStud.position.z - currentPiece.anchor_point[0]

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
	currentPiece.mesh.position.set(currentStud.position.x, 2, currentStud.position.z)
	dropPieceAnimation(currentPiece, 0)
	currentPiece.isPlaced = true
}

function raisePieceAnimation(piece, height) {
	let mesh = piece.mesh
	mesh.position.y = (height+0.01)-(((height+0.01)-mesh.position.y)*0.95)
	if (mesh.position.y < height)
		requestAnimationFrame( () => {raisePieceAnimation(piece, height)})
}

function dropPieceAnimation(piece, height) {
	let mesh = piece.mesh
	mesh.position.y = height+((mesh.position.y-height)*0.95)-0.001
	if (mesh.position.y > height)
		requestAnimationFrame( () => {dropPieceAnimation(piece, height)})
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
	// For placing a piece
	if (isValidPosition() && currentPiece && currentStud) {
		placePiece()
		currentPiece = null
		setTimeout( () => {
			viewFromSide()
			rotate()
		}, 1500)
		currentPlayerIndex = ++currentPlayerIndex % 4
		currentPlayer = players[currentPlayerIndex]
	}

	// For selecting/deselecting a piece
	// Raycast the current player's pieces
	for (const piece of currentPlayer.pieces) {
		let intersected = raycaster.intersectObject(piece.mesh)[0]
		// Raycasting found no object or object is already placed
		if (!intersected || piece.isPlaced) {}
		else {
			if (currentPiece) {
				var p = currentPiece
				dropPieceAnimation(p, -0.5)
			}
			currentPiece = piece
			raisePieceAnimation(currentPiece, 1)
			break
		}
	}

	// For clicking on board (not the studs)
	if (raycaster.intersectObject(boardMesh)[0]) {} // Do nothing


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
			m.position.set(i,0,k)
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
	requestAnimationFrame(animate)

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
animate()


})