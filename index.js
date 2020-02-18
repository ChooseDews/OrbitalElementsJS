//library
const convert = require('./lib');

//library example usage;
//orbital elements to convert
let μ = 1;
let Ω = convert.d2Rad(194);
let i = convert.d2Rad(39);
let ω = convert.d2Rad(85);

let a = 15307.548;
let e = 0.7;
let ν = convert.d2Rad(48);


let values = convert.computeECI(ω, i, Ω, a, e, ν, μ)
console.log(values);
