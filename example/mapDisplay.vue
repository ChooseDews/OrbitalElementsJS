<template>
  <div id="map-view">
    <div
      class="ground-info"
      v-if="period"
    >Ground Track covers 2 orbital periods: ({{period.toFixed(4)}} hours). Assumes t=0 at inital position</div>
  </div>
</template>

<script>
import * as THREE from "three";
const $ = require("mathjs");

import lib from "./../src/lib.js";
let computeECIFOverTime = lib.computeECIFOverTime;
let getElements = lib.getElements;

let objectToVec = v => [v.x, v.y, v.z];

const PI = $.pi;
const d2r = PI / 180;
const r2d = 180 / PI;

export default {
  props: ["mu", "r", "v"],
  data() {
    return {
      scene: null,
      period: null,
      dots: []
    };
  },
  watch: {
    r() {
      this.updateTrack();
    }
  },
  methods: {
    updateTrack() {
      var t0 = performance.now();

      let r = [-1217.39430415697, -3091.41210822807, -6173.40732877317];
      let v = [9.88635815507896, -0.446121737099303, -0.890884522967222];
      if (this.r) r = objectToVec(this.r);
      if (this.v) v = objectToVec(this.v);
      let mu = this.mu || 398600.4418;
      let oe = getElements(r, v, mu);
      console.log(oe);
      let t_0 = 0;
      let period = 2 * $.pi * $.sqrt($.pow(oe.a, 3) / mu) * 2;
      this.period = period / 60 / 60;
      let { coords } = computeECIFOverTime(r, v, mu, t_0, period + t_0, 5 * 60);
      console.log(coords.length);

      this.clearDots();
      for (let coord of coords) {
        this.addLatLng(coord.lat, coord.lon);
      }

      var t1 = performance.now();
      console.log("Map Updated Took" + (t1 - t0) + " milliseconds.");

      this.animate();
    },
    clearDots() {
      for (let dot of this.dots) {
        this.scene.remove(dot);
      }
    },
    deleteObject(objName) {
      var selectedObject = this.scene.getObjectByName(objName);
      this.scene.remove(selectedObject);
    },
    addLatLng(lat, long) {
      //expected in degrees

      let mapWidth = 10;
      let mapHeight = 5;
      let x = (long + 180) * (mapWidth / 360);
      let y = mapHeight - (lat + 90) * (mapHeight / 180);
      let dotGeometry = new THREE.Geometry();

      x = x - 5;
      y = 2.5 - y;
      if (y > 2.5) y = y - 5;
      if (y < -2.5) y = y + 5;

      dotGeometry.vertices.push(new THREE.Vector3(x, y, 0));
      let dotMaterial = new THREE.PointsMaterial({
        size: 3,
        sizeAttenuation: false,
        color: 0xff0000
      });
      let dot = new THREE.Points(dotGeometry, dotMaterial);

      this.dots.push(dot);
      this.scene.add(dot);

      return { x, y };
    }
  },
  mounted() {
    // Create the scene and a camera to view it
    var scene = new THREE.Scene();

    /**
     * Renderer
     **/

    // Create the canvas with a renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });

    // Specify the size of the canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add the canvas to the DOM
    let container = document.getElementById("map-view");
    container.appendChild(renderer.domElement);

    let width =
      container.offsetWidth || document.getElementById("mainbar").offsetWidth;
    renderer.setSize(width, window.innerHeight);

    // Specify the portion of the scene visiable at any time (in degrees)
    var fieldOfView = 75;

    if (window.innerWidth < 700) fieldOfView = 110;

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
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
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
      map: loader.load("./earth.jpg")
    });

    // create a plane geometry for the image with a width of 10
    // and a height that preserves the image's aspect ratio
    var geometry = new THREE.PlaneGeometry(10, 10 * 0.5);

    // combine our image geometry and material into a mesh
    var mesh = new THREE.Mesh(geometry, material);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(0, 0, 0);

    // add the image to the scene
    scene.add(mesh);

    /**
     * Lights
     **/

    // Add a point light with #fff color, .7 intensity, and 0 distance
    var light = new THREE.PointLight(0xffffff, 1, 0);

    // Specify the light's position
    light.position.set(1, 1, 100);

    // Add the light to the scene
    scene.add(light);

    /**
     * Render!
     **/

    // The main animation function that re-renders the scene each animation frame
    function animate() {
      renderer.render(scene, camera);

      setTimeout(function() {
        requestAnimationFrame(animate);
      }, 1000);
    }
    animate();

    this.animate = () => {
      renderer.render(scene, camera);
    };

    this.scene = scene;

    this.updateTrack();
  }
};
</script>

<style>
.ground-info {
  position: absolute;
  color: white;
  bottom: 0;
  padding: 10px;
}
</style>