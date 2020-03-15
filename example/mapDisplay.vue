<template>
  <div id="map-view"></div>
</template>

<script>

import * as THREE from "three";
const $ = require('mathjs')

const PI = $.pi;
const d2r = PI/180;
const r2d = 180/PI



export default {
    data(){
        return {
            scene: null
        }
    },
    methods: {
        addLatLng(lat, long){ //expected in degrees


            let mapWidth = 10;
            let mapHeight = 5;
            let x = (long+180)*(mapWidth/360);
            let latRad = lat*d2r;
            let mercN = $.log($.tan((PI/4)+(latRad/2)));
            let y = (mapHeight/2)-(mapWidth*mercN/(2*PI));


            return {x,y}

        }
    },
    mounted(){


        // Create the scene and a camera to view it
var scene = new THREE.Scene();



/**
* Renderer
**/

// Create the canvas with a renderer
var renderer = new THREE.WebGLRenderer({antialias: true});

// Specify the size of the canvas
renderer.setSize( window.innerWidth, window.innerHeight );

// Add the canvas to the DOM
let container = document.getElementById("map-view");
container.appendChild(renderer.domElement);
    let width = container.offsetWidth;
    renderer.setSize(width, window.innerHeight);








// Specify the portion of the scene visiable at any time (in degrees)
var fieldOfView = 75;

// Specify the camera's aspect ratio
var aspectRatio = width / window.innerHeight;

// Specify the near and far clipping planes. Only objects
// between those planes will be rendered in the scene
// (these values help control the number of items rendered
// at any given time)
var nearPlane = 0.1;
var farPlane = 1000;

// Use the values specified above to create a camera
var camera = new THREE.PerspectiveCamera(
  fieldOfView, aspectRatio, nearPlane, farPlane
);

// Finally, set the camera's position in the z-dimension
camera.position.z = 5;









/**
* Image
**/

// Create a texture loader so we can load our image file
var loader = new THREE.TextureLoader();

// Load an image file into a custom material
var material = new THREE.MeshLambertMaterial({
  map: loader.load('./earth.jpg')
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometry = new THREE.PlaneGeometry(10, 10*.5);

// combine our image geometry and material into a mesh
var mesh = new THREE.Mesh(geometry, material);

// set the position of the image mesh in the x,y,z dimensions
mesh.position.set(0,0,0)

// add the image to the scene
scene.add(mesh);

/**
* Lights
**/

// Add a point light with #fff color, .7 intensity, and 0 distance
var light = new THREE.PointLight( 0xffffff, 1, 0 );

// Specify the light's position
light.position.set(1, 1, 100 );

// Add the light to the scene
scene.add(light)








var dotGeometry = new THREE.Geometry();
dotGeometry.vertices.push(new THREE.Vector3( -5, -2.5, 0));
var dotMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false } );
var dot = new THREE.Points( dotGeometry, dotMaterial );
scene.add( dot );







/**
* Render!
**/

// The main animation function that re-renders the scene each animation frame
function animate() {
requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();








this.scene = scene

console.log(this.addLatLng(50,50))





    }
}
</script>

<style>

</style>