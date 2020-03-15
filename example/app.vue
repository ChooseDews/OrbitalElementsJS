<template lang="html">

<div class="container-fluid m-0 p-0">


<div class="sidebar">

  <div class="entry">
    <a class="btn btn-outline-dark btn-sm" href="https://github.com/ChooseDews/OrbitalElementsJS">Github</a> <a class="btn btn-outline-dark btn-sm" @click="random()">Random Orbit</a>
  </div>


  <div class="entry">
    <h5>Orbital Elements</h5>
    <form @submit.prevent="toPosition">


    <table class="vars">
      <tr>
        <td class="title">Ω</td>
        <td ><input v-model="elements['Ω']" type="number" step="any"  required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">ω</td>
        <td ><input v-model="elements['ω']" type="number" step="any"  required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">i</td>
        <td ><input v-model="elements['i']" type="number" step="any"  required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">ν</td>
        <td ><input v-model="elements['ν']" type="number" step="any"  required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">e</td>
        <td><input v-model="elements['e']" type="number" step="any"  required></td>
      </tr>
      <tr>
        <td class="title">a</td>
        <td><input v-model="elements['a']" type="number" step="any"  required></td>
        <td class="unit">km</td>
      </tr>
    </table>

    <button type="submit" class="m-3 btn btn-primary btn-sm">Update</button>
  </form>
  </div>
  <div class="entry">
    <h5>Position & Velocity</h5>
    <form @submit.prevent="toElements">


    <table class="vars">
      <tr>
        <td class="title">R<sub>x</sub></td>
        <td ><input v-model="r.x" type="number" step="any"  required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">R<sub>y</sub></td>
        <td ><input v-model="r.y" type="number" step="any"  required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">R<sub>z</sub></td>
        <td ><input v-model="r.z" type="number" step="any"  required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">V<sub>x</sub></td>
        <td ><input v-model="v.x" type="number" step="any"  required></td>
        <td class="unit">km/s</td>
      </tr>
      <tr>
        <td class="title">V<sub>y</sub></td>
        <td ><input v-model="v.y" type="number" step="any"  required></td>
        <td class="unit">km/s</td>
      </tr>
      <tr>
        <td class="title">V<sub>z</sub></td>
        <td ><input v-model="v.z" type="number" step="any"  required></td>
        <td class="unit">km/s</td>
      </tr>
    </table>
    <button type="submit" class="m-3 btn btn-primary btn-sm">Update</button>
      </form>
  </div>


  <div class="entry">
    <table class="vars">
      <tr>
        <td class="title">μ</td>
        <td><input v-model="mu" type="number" step="any"  required></td>
        <td style="width: auto" class="unit">km<sup>3</sup>/s<sup>2</sup></td>
      </tr>
    </table>
  </div>

  <div class="entry">
    <h5 class="p-2 m-0">John Dews-Flick</h5>
    <h6>March, 2020</h6>  
    <h6>University of Florida</h6>

  </div>



  </div>


  <div class="mainbar" id="mainbar" v-if="loaded">
    <div class="panel-tabs">
      <div @click="groundTrack=false" :class="{active:!groundTrack}">Orbit View</div>
      <div @click="groundTrack=true" :class="{active:groundTrack}">Map View</div>
    </div>
    <div class="crash alert alert-danger" v-if="crash">
        Orbit Collides With Earth
    </div>
     <div class="float-credit">
        John Dews-Flick
    </div>
    <map-display v-show="groundTrack" :r="r" :v="v" :mu="mu"></map-display>
    <orbit-view v-show="!groundTrack" :positions="positions" :stats="stats"></orbit-view>
  </div>

</div>

</template>

<script>
const $ = require('mathjs')
import orbitView from './orbitDisplay.vue'
import mapDisplay from './mapDisplay.vue'

import library from './../src/lib.js';
console.log('here', library);

let vectToObject = (v) => ({x: v[0], y: v[1], z: v[2] });
let objectToVec = (v) => ([v.x, v.y, v.z]);
let roundVec = (v) => v.map(x=>$.round(x,6));

//let r_p = [4249.24395473, -2054.84062287, 2446.99585787];
//let v_p = [0.01436795, 0.00921151, -0.00442301];

let r_p = [5634.297397, -2522.807863, -5037.930889]; //mini-project 1 - Molniya orbit
let v_p = [8.286176, 1.815144, 3.624759]; //mini-project 1 - Molniya orbit

let gatherPoint = function(n, mu){
  let angle = [];
  for(let i = 0; i < 362; i++){
    angle[i] = library.computeECI(n.ω, n.i, n.Ω, n.a, n.e, i, mu, true);
  }
  return angle;
}

function rNumber(min, max) {
  return $.round(Math.random() * (max - min) + min, 4);
}

export default {
  components: {orbitView, mapDisplay},
  data(){
    return {
      elements: {},
      v: vectToObject(v_p) || {},
      r: vectToObject(r_p) || {},
      mu: 398600.4418,
      stats: {},
      crash: false,
      groundTrack: false,
      loaded: false
    }
  },
  mounted(){

    this.toElements();
    this.loaded = true;
  },
  methods: {
    random(){
      //random input some elements
      this.elements = {
        ω: rNumber(0, 360),
        i: rNumber(0, 360),
        e: rNumber(0, 0.95),
        Ω: rNumber(0, 360),
        ν: rNumber(0, 360),
        a: rNumber(20000, 80000)
      }
      this.toPosition();
    },
    updateChart(){

      let mu = this.mu
      let elements = this.elements;
      let angleStats = gatherPoint(elements, mu);
      let positions = angleStats.map(x=>x.r);
      this.positions = positions;

      let r = objectToVec(this.r);
      let v = objectToVec(this.v);
      console.log('here');
      let orbitVectors = library.orbitVectors(r, v, mu);
      console.log('here', orbitVectors);

      this.crash = false;

      if(orbitVectors.r_min < 6371){
        this.crash = true;
      }

      this.stats = {
        r: this.r,
        v: this.v,
        orbitVectors
      }

    },
    toPosition(){
      let n = this.elements;
      let mu = this.mu;
      let res = library.computeECI(n.ω, n.i, n.Ω, n.a, n.e, n.ν, mu, true);
      console.log(res);
      this.v = vectToObject(roundVec(res.v))
      this.r = vectToObject(roundVec(res.r))

      this.updateChart();


    },
    toElements(){

      let r_p = objectToVec(this.r);
      let v_p = objectToVec(this.v);
      let mu = this.mu;
      let res = library.getElements(r_p, v_p, mu);
      res['Ω'] = library.r2Deg(res['Ω'])
      res['i'] = library.r2Deg(res['i'])
      res['ν'] = library.r2Deg(res['ν'])
      res['ω'] = library.r2Deg(res['ω'])
      res.e = $.round(res.e, 4);
      res.a = $.round(res.a, 4);
      this.elements = res;
      this.updateChart();

    }
  }
}
</script>

<style lang="scss">

body{
    overscroll-behavior-y: none;
    height: 100vh;
    overflow: hidden;
}


.crash{
  position: absolute;
  padding: 15px;
  right: 0;
}

.sidebar{
  width: 300px;
  float: left;
}

.mainbar{
  width: calc(100% - 300px);
  float: left;
}


.vars{

  width: 100%;



input{
width: 100%;
}

.title{
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  width: 30px;
}


.unit{
  width: 30px;
  padding-left: 2px;
  font-size: 0.9em;
  color: grey;
  text-align: left;
}




}

.col-3{
  background: grey;
}

.float-credit{
  position: absolute;
  z-index: 1000;
  padding: 5px;
  bottom: 0;
  right: 0;
  color: white;
}


.entry{
  border: 1px dashed grey;
  max-width: 300px;
  text-align: center;
  padding: 10px;
  border-top: none;
}

.panel-tabs{
  position: absolute;
  top: 0;
  left: 50vw;
  color: white;

  div{
    float: left;
    padding: 3px 10px;
    border: 1px solid white;
  }

  div.active{
    color: black;
    background: white;
  }

}

@media only screen and (max-width: 700px) {

.panel-tabs{
  position: inherit;
  color: black;

  

}

.panel-tabs .active{
    background: black !important;
    color:white !important;
  }
  .ground-info{
    display: none;
  }


body{
    overscroll-behavior-y: inherit;
    height: inherit;
    overflow: inherit;
}


  .sidebar{
    float: none;
    width: 100vw;
  }
  .mainbar{
    float: none;
    width: 100vw;
  }
  .entry{
    max-width: 100%;
  }

  #inset{
    display: none;
  }
}



@media only screen and (min-width: 700px) {

  .sidebar{
    max-height: 100vh;
    overflow-y: auto;
  }


}



</style>
