var assert = require('assert');
const convert = require('./lib');

let μ = 1;
let Ω = convert.d2Rad(194);
let i = convert.d2Rad(39);
let ω = convert.d2Rad(85);
let a = 15307.548;
let e = 0.7;
let ν = convert.d2Rad(48);

let values = convert.computeECI(ω, i, Ω, a, e, ν, μ)


describe('Orbital Library', function() {
  describe('computeECI', function() {
    it('Should Have Correct results',()=>{
      let diffs = [];
      diffs.push(values.r[0]-4249.243954734818)
      diffs.push(values.v[0]-0.014367954791263458)
      diffs.push(values.v[1]-0.009211508056892382)
      diffs.push(values.v[2]+0.004423011270422156)
      diffs.push(values.p-7806.849480000001)
      diffs = diffs.map(Math.abs);
      max = Math.max(...diffs);
      if(max > 0.00001) throw "Max difference too large: "+max;
      return true;
    });
  });
});
