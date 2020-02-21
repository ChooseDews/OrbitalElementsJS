<template lang="html">

<div class="container-fluid m-0 p-0">


<div class="sidebar">
  <div class="entry">
    <h5>Orbital Elements</h5>
    <form @submit.prevent="toPosition">


    <table class="vars">
      <tr>
        <td class="title">Ω</td>
        <td ><input v-model="elements['Ω']" type="number" step="any" name="" value="" required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">ω</td>
        <td ><input v-model="elements['ω']" type="number" step="any" name="" value="" required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">i</td>
        <td ><input v-model="elements['i']" type="number" step="any" name="" value="" required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">ν</td>
        <td ><input v-model="elements['ν']" type="number" step="any" name="" value="" required></td>
        <td class="unit">°</td>
      </tr>
      <tr>
        <td class="title">e</td>
        <td><input v-model="elements['e']" type="number" step="any" name="" value="" required></td>
      </tr>
      <tr>
        <td class="title">a</td>
        <td><input v-model="elements['a']" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
    </table>

    <button type="submit" class="m-3 btn btn-primary btn-sm">Convert</button>
  </form>
  </div>
  <div class="entry">
    <h5>Position & Velocity</h5>
    <form @submit.prevent="toElements">


    <table class="vars">
      <tr>
        <td class="title">R<sub>x</sub></td>
        <td ><input v-model="r.x" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">R<sub>y</sub></td>
        <td ><input v-model="r.y" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">R<sub>z</sub></td>
        <td ><input v-model="r.z" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">V<sub>x</sub></td>
        <td ><input v-model="v.x" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">V<sub>y</sub></td>
        <td ><input v-model="v.y" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
      <tr>
        <td class="title">V<sub>z</sub></td>
        <td ><input v-model="v.z" type="number" step="any" name="" value="" required></td>
        <td class="unit">km</td>
      </tr>
    </table>
    <button type="submit" class="m-3 btn btn-primary btn-sm">Convert</button>
      </form>
  </div>


  <div class="entry">
    <table class="vars">
      <tr>
        <td class="title">μ</td>
        <td><input v-model="mu" type="number" step="any" name="" value="" required></td>
        <td style="width: auto" class="unit">km<sup>3</sup>s<sup>-2</sup></td>
      </tr>
    </table>
  </div>


  </div>


  <div class="mainbar">
    <orbit-view :positions="positions" :stats="stats"></orbit-view>
  </div>

</div>

</template>

<script>
const $ = require('mathjs')
import orbitView from './orbitDisplay.vue'
import library from './../src/lib.js';
console.log('here', library);

let vectToObject = (v) => ({x: v[0], y: v[1], z: v[2] });
let objectToVec = (v) => ([v.x, v.y, v.z]);

//let r_p = [4249.24395473, -2054.84062287, 2446.99585787];
//let v_p = [0.01436795, 0.00921151, -0.00442301];

let r_p = [5634.297397, -2522.807863, -5037.930889]; //mini-project 1 - Molniya orbit
let v_p = [8.286176, 1.815144, 3.624759]; //mini-project 1 - Molniya orbit

let gatherPoint = function(n, mu){
  let angle = [];
  for(let i = 0; i < 360; i++){
    angle[i] = library.computeECI(n.ω, n.i, n.Ω, n.a, n.e, i, mu, true);
  }
  return angle;
}

export default {
  components: {orbitView},
  data(){
    return {
      elements: {},
      v: vectToObject(v_p) || {},
      r: vectToObject(r_p) || {},
      mu: 398600,
      stats: {}
    }
  },
  methods: {
    updateChart(){

      let mu = this.mu
      let elements = this.elements;
      let angleStats = gatherPoint(elements, mu);
      let positions = angleStats.map(x=>x.r);
      this.positions = positions;

      this.stats = {
        r: this.r,
        v: this.v
      }

    },
    toPosition(){
      let n = this.elements;
      let mu = this.mu;
      let res = library.computeECI(n.ω, n.i, n.Ω, n.a, n.e, n.ν, mu, true);
      console.log(res);
      this.v = vectToObject(res.v)
      this.r = vectToObject(res.r)

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

.sidebar{
  width: 300px;
  float: left;
}

.mainbar{
  width: calc(100vw - 300px);
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


.entry{
  border: 1px dashed grey;
  max-width: 300px;
  text-align: center;
  padding: 10px;
  border-top: none;
}


@media only screen and (max-width: 700px) {
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




</style>
