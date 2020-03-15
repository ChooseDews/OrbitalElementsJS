<template lang="html">

  <div id="container">


    <div id="inset">
       </div>

  </div>

</template>

<script>

import * as THREE from "three";
import * as j from "jquery";
let $ = j.default;
import library from './../src/lib.js';


import {
  TrackballControls
} from "three/examples/jsm/controls/TrackballControls.js";


//config
let CANVAS_WIDTH = 100,
  CANVAS_HEIGHT = 100,
  CAM_DISTANCE = 200,
  earthColor = 0x6aa84f,
  craftColor = 0xadd8e6,
  OrbitColor = 0xffffff,
  backgroundColor = 0x000000,
  earthRadius = 6371, //km
  craftRadius = 300, //km
  mu = 398600,
  accelerationVectorColor = 0xff0000,
  velocityVectorColor = 0xffff00,
  eccentricityVectorColor = 0x008000,
  momentumVectorColor = 0xffff00;

  let scaleFactor = 0.01; //this converts km to 3d units within the browser. To big and things wont render
  let scale = x => x.map(i => i * scaleFactor);
  let scaleFix = x => [x[1] * scaleFactor, x[2] * scaleFactor, x[0] * scaleFactor]
  let norm = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  let objectToVec = (v) => ([v.x, v.y, v.z]);


//define vars
let container,
  container2,
  camera,
  controls,
  scene,
  renderer,
  camera2,
  scene2,
  renderer2,
  axes2,
  addPoint,
  updateCraft,
  updateArrow;


export default {


  props: ['positions', 'stats'],

  watch: {
    positions(){
      console.log('Positions changed!')
      this.addPoints();
    },
    stats(){
      this.updateCraft()
    }
  },

  methods: {
    addPoints(){
      let points = this.positions;
      if(!points || points.length == 0) return;
      if(addPoint) addPoint(points);

    },
    updateCraft(){
      console.log(this.stats.r)

      if(this.stats && this.stats.r){
         updateCraft(this.stats.r)
         updateArrow(this.stats.r, this.stats.v, this.stats.orbitVectors)
       }

    }
  },


  mounted(){


    //setup main canvas
    container = document.getElementById("container");
    renderer = new THREE.WebGLRenderer();
    let width = container.offsetWidth;
    renderer.setClearColor(backgroundColor, 1);
    renderer.setSize(width, window.innerHeight);
    container.appendChild(renderer.domElement);


    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(
      50,
      width / window.innerHeight,
      1,
      10000
    );
    camera.position.y = 500; //set camera inital position
    camera.position.z = 500;
    camera.position.x = 500;

    //setup orbit controls for scene camera
    controls = new TrackballControls(camera, renderer.domElement);




    //setup earth

    let earthMaterial = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('./map.jpg')
    });



    let earth = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * scaleFactor, 30, 30),
      earthMaterial
    );
    scene.add(earth);
    let earthAxes = new THREE.AxisHelper(100);
    scene.add(earthAxes);


    //setup spacecraft
    let spacecraft = new THREE.Mesh(
      new THREE.SphereGeometry(craftRadius * scaleFactor, 32, 32),
      new THREE.MeshBasicMaterial({
        color: craftColor
      })
    );
    scene.add(spacecraft);
    spacecraft.position.set(0,0,0);

    updateCraft = (r,v) => {
      r = objectToVec(r);
      spacecraft.position.set(...scaleFix(r))
    }





    //setup velocity and acceleration vector
    let accelerationVector = spacecraft.position.clone().negate(); //points toward the planet
    accelerationVector.normalize();
    let accelerationArrow = new THREE.ArrowHelper(
      accelerationVector,
      spacecraft.position.clone(),
      30,
      accelerationVectorColor
    );
    scene.add(accelerationArrow);


    let velocityVector = new THREE.Vector3(4, 1, 0);
    velocityVector.normalize();
    let velocityArrow = new THREE.ArrowHelper(
      velocityVector,
      spacecraft.position.clone(),
      60,
      velocityVectorColor
    );
    scene.add(velocityArrow);


    //setup momentum Vector
    let momentumVector = spacecraft.position.clone().negate(); //points toward the planet
    momentumVector.normalize();
    let momentumArrow = new THREE.ArrowHelper(
      momentumVector,
      earth.position.clone(),
      200,
      momentumVectorColor
    );
    scene.add(momentumArrow);


    //setup eccentricity vector
    let eccentricityVector = spacecraft.position.clone().negate(); //points toward the planet
    eccentricityVector.normalize();
    let eccentricityArrow = new THREE.ArrowHelper(
      eccentricityVector,
      earth.position.clone(),
      150,
      eccentricityVectorColor
    );
    //scene.add(eccentricityArrow);




    updateArrow = function (r, v, vecs) { //handles craft acceleration and velocity vector position and direction
      r = objectToVec(r);
      v = objectToVec(v);

      console.log(vecs);
      let h_p = vecs.h_p;

      let mPos = new THREE.Vector3(...scaleFix(h_p)).normalize();;
      momentumArrow.setDirection(mPos);

      console.log('updating arrows' , vecs.e_p)

      let ePos = new THREE.Vector3(...scaleFix(vecs.e_p)).normalize();;
      eccentricityArrow.setDirection(ePos);






      velocityArrow.position.set(...scaleFix(r));
      accelerationArrow.position.set(...scaleFix(r));

      //accelerationArrow.setLength(stats.radius.current*scaleFactor)

      let aPos = new THREE.Vector3(...scaleFix(r)).negate().normalize();
      let vPos = new THREE.Vector3(...scaleFix(v)).normalize();

      accelerationArrow.setDirection(aPos);
      velocityArrow.setDirection(vPos);
    };


    let createCrossRose = function () {
      container2 = document.getElementById("inset");
      renderer2 = new THREE.WebGLRenderer();
      renderer2.setClearColor(0x000000, 1);
      renderer2.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
      container2.appendChild(renderer2.domElement);
      scene2 = new THREE.Scene();
      camera2 = new THREE.PerspectiveCamera(
        50,
        CANVAS_WIDTH / CANVAS_HEIGHT,
        1,
        1000
      );
      camera2.up = camera.up; // important!
      axes2 = new THREE.AxisHelper(100);
      scene2.add(axes2);
    };

    let arrowMin = 0;
    let arrowMax = 200;
    let arrowLength = (stat) => {
      let j = (stat.current - 0) / (stat.max - 0);
      let out = j * (arrowMax - arrowMin) + arrowMin;
      return out || arrowMin;
    }


    addPoint = function (points) {
        deleteObject('orbit-line')
        var geometry = new THREE.Geometry();
        points.map(x=>{
            let vec = new THREE.Vector3(...scaleFix(x))
            geometry.vertices.push(vec);
            return vec;
        })
        var material = new THREE.LineBasicMaterial({
        	color: 0x0000ff
        });
        var line = new THREE.Line( geometry, material );
        line.name = 'orbit-line'
        scene.add( line );
    };

    function deleteObject(objName){
        var selectedObject = scene.getObjectByName(objName);
        scene.remove( selectedObject );
    }

    //addPoint([[30000, 0, 0]])


    //init position & velocity
    //let position = [30000, 0, 0];
    //let velocity = [2, 3, 0];

    let position = [5634.297397, -2522.807863, -5037.930889]; //mini-project 1 - Molniya orbit
    let velocity = [8.286176, 1.815144, 3.624759]; //mini-project 1 - Molniya orbit
    let time = 0; //in minutes
    let timeStep = 0.0006;


    let steps = 500000;







    //handle orbit calculations
    (function () {
      setInterval(function () { //update craft location every 80ms



      }, 100);







    })();

    function render() {
      renderer.render(scene, camera);
      renderer2.render(scene2, camera2);
    }

    //drawing & animations
    createCrossRose();
    (function animate() {
      requestAnimationFrame(animate);
      controls.update();

      time++;

      earth.rotation.y = (2 * Math.PI) * time / 60 / 24;

      camera2.position.copy(camera.position);
      camera2.position.sub(controls.target);
      camera2.position.setLength(CAM_DISTANCE);
      camera2.lookAt(scene2.position);
      render();
    })();


     this.addPoints();



  }







}
</script>

<style lang="css">

#inset {
  width: 100px;
  height: 100px;
  background-color: #fff; /* or transparent; will show through only if renderer alpha: true */
  border: 1px solid black; /* or none; */
  margin: 15px;
  padding: 0px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 100;
}

</style>
