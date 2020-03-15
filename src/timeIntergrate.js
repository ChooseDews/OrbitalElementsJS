//library
const $ = require('mathjs')
let d2Rad = (d) => d * $.pi / 180;

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


let getTrueAnomoly = (nu0, p , e , mu, deltaT, percision) => {
    if(!percision) percision = 0.000000001;
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


let timeAnomoly = (from, to, interval){ //all in secs

    




}

let p = 12129.185341394155;
let e = 0.738;
let mu = 398600;


let t = computeInterval(0, 2*$.pi, p, e, mu)/3600;
console.log('Period Calculated:', t, 'hours')

let vo2 = getTrueAnomoly(0, p, e, mu, 5*60)
console.log(vo2);



module.exports = {

};
