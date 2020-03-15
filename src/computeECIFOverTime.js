//library
const $ = require('mathjs')
let d2Rad = (d) => d * $.pi / 180;
const PI = $.pi;
let toElements = require('./elements').getElements;
let toPositionVelocity = require('./positionVelocity').computeECI;
let toEarthFixed = require('./toEarthFixed').computeECIF;
let getLatLon = require('./toEarthFixed').getLatLon;

let intergrate = (a,b,n,k,f)=>(g=i=>i--&&g(i)+f(a+k++/n)/n)(n,k^=a>b,n/=b-a);


let intergrand = (nu , p , e ,mu) => {
    let ee = (1+e*$.cos(nu))
    return $.pow(p, 1.5)/($.sqrt(mu)*ee*ee);
}

let computeInterval = (nu0,nu1, p , e ,mu) => {
    let f = (nu) => intergrand(nu, p, e, mu);
    let time = intergrate(nu0, nu1, 100, 1, f);
    return time;
}


let getTrueAnomaly = (nu0, p , e , mu, deltaT, percision) => {
    if(!percision) percision = 0.00000001;
    let G = (nu1) => computeInterval(nu0, nu1, p , e , mu) - deltaT;
    let G_prime = (nu1) => intergrand(nu1, p, e, mu);
    let guess = nu0+0.09;
    let nu1 = 0;
    let n = 0;
    while(n < 100){
        nu1 = guess - G(guess)/G_prime(guess);
        let error = $.abs(nu1 - guess);
        if(error < percision) return nu1;
        guess = nu1;
        n++;
    }
    console.error('Newton Method Failed')
    return null;
}


let getTimes = (from, to, interval) =>{ //all in secs
    let times = [];
    let t = from;
    while(t < to){
        times.push(t);
        t+=interval;
    }
    return times;
};

let computeAnomaly = (times, nu0, p , e , mu) => {
    let nuList = [nu0];
    for(let i = 1; i<(times.length); i++){
        let last = times[i-1];
        let time = times[i];
        let interval = time-last;
        let nextNu =  getTrueAnomaly(nuList[i-1], p , e , mu, interval);
        nuList.push(nextNu);
    }
    return {times, nuList}
}


let computeECIFOverTime = (r, v, mu, t0, t1, interval) => {
    if(!mu) mu = 398600.4418;
    let oe = toElements(r,v,mu);
    console.log(oe);
    let times = getTimes(t0, t1, interval || 5*60);
    let nu0 = oe.ν;
    let {nuList} = computeAnomaly(times, nu0, oe.p, oe.e, mu);

    let positions = [];
    let coords = [];

    for(let i in nuList){
        let nu = nuList[i];
        if(nu > 2*PI) nu = nu - $.floor(nu/2*PI)*2*PI;
        let time = times[i];
        let {r} = toPositionVelocity(oe.ω, oe.i, oe.Ω, oe.a, oe.e, nu, mu);
        r.time = time;

        let earthFixed = toEarthFixed(r, time);
        coords.push(getLatLon(earthFixed))
        positions.push(earthFixed);
    }

    return {positions, coords};
    
}

module.exports = computeECIFOverTime;
