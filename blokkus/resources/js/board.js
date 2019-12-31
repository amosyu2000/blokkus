
// ===========
//  CONSTANTS
// ===========

const RIM_THICKNESS = 0.1
const THICKNESS = 0.5
const WHITE = 0xaaaaaa
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
camera.position.set(0,15,15)
const renderer = new THREE.WebGLRenderer({ antialias: true })

// Camera cameraControls
const clock = new THREE.Clock()
CameraControls.install( { THREE: THREE } );
const cameraControls = new CameraControls(camera, renderer.domElement)
cameraControls.enabled = false
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
var currentPolarAngle = Math.PI/4

// GLTF loader (for 3D models)
const loader = new THREE.GLTFLoader()
loader.setPath('resources/static/')

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
	cameraControls.rotateTo(currentAzimuthalAngle+=Math.PI/2, currentPolarAngle, true)
}

// Moves the camera to the top (bird's eye view)
function viewFromTop() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=0, true)
}

// Moves the camera to an angle of 45 degrees to the hroizontal
function viewFromSide() {
	cameraControls.dampingFactor = 0.1
	cameraControls.rotateTo(currentAzimuthalAngle, currentPolarAngle=Math.PI/4, true)
}

function createPieceMesh() {
	let mesh
	return new Promise(function(resolve, reject) {	
		loader.load('tile.glb', function(gltf) {
			gltf.scene.traverse( (child) => {
				if (child.type == 'Mesh') {
					mesh = child
					resolve()
				}
			})
		})
	}).then(function() {
		let material = new THREE.MeshPhongMaterial({ color:YELLOW })
		mesh.material = material
		mesh.position.set(0.5,0,0.5)
		return mesh
	})
}

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

showAxis()

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

// Studs
var stud = new THREE.Shape([
	new THREE.Vector2(RIM_THICKNESS, RIM_THICKNESS),
	new THREE.Vector2(RIM_THICKNESS, 1 - RIM_THICKNESS),
	new THREE.Vector2(1 - RIM_THICKNESS, 1 - RIM_THICKNESS),
	new THREE.Vector2(1 - RIM_THICKNESS, RIM_THICKNESS)
	])
var studExtrudeSettings = {
	steps:1, 
	depth:0, 
	bevelEnabled:true, 
	bevelThickness: 0.1,
	bevelSize:0.1,
	bevelOffset:-0.1,
	bevelSegments:1
}
for(let i = -10; i < 10; i++) {
	for(let j = -10; j < 10; j++) {
		let studGeometry = new THREE.ExtrudeGeometry(stud, studExtrudeSettings)
		studGeometry.rotateX(Math.PI/2).translate(i,0,j)
		let studMesh = new THREE.Mesh(studGeometry)
		// Add each stud to the geometry of the board
		boardGeometry.merge(studMesh.geometry, studMesh.matrix)
	}
}

// Create the board mesh
var boardMaterial = new THREE.MeshStandardMaterial({ color: WHITE })
var boardMesh = new THREE.Mesh(boardGeometry, boardMaterial)
scene.add(boardMesh)

// Render or animate loop
function animate() {
	requestAnimationFrame(animate)

	const delta = clock.getDelta()
	cameraControls.update(delta)

	renderer.render(scene,camera)
}
animate()


})