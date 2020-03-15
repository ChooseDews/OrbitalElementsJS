//library
const $ = require('mathjs')
let d2Rad = (d) => d * $.pi / 180;
let r2d = 180/$.pi;
let createTransform = (t,OmegaE) => {

    if(!OmegaE) OmegaE = 0.00007292115; //rad/sec

    q = t*OmegaE;
    const transfer = [ [$.sin(q), -$.cos(q), 0], 
                      [$.cos(q), $.sin(q), 0], 
                      [0, 0, 1] ]


    return (b) => {
        return $.multiply(transfer, b) //#3
    };

};

let getLatLon = (r) => {
    lon = $.atan2(r[1], r[0])*r2d;
    k = $.sqrt(r[1]*r[1] + r[0]*r[0]);
    lat = $.atan2(r[2], k)*r2d;
    return {lon, lat}
}

let computeECIF = (r, t, OmegaE) => {
    let T = createTransform(t,OmegaE);
    return T(r);
}

module.exports = {
    createTransform,
    computeECIF,
    d2Rad,
    getLatLon
};
