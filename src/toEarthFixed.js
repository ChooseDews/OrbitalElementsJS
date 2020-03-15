//library
const $ = require('mathjs')
let d2Rad = (d) => d * $.pi / 180;

let createTransform = (t,OmegaE) => {

    q = t*OmegaE;
    const transfer = [ [$.sin(q), -$.cos(q), 0], 
                      [$.cos(q), $.sin(q), 0], 
                      [0, 0, 1] ]


    return (b) => {
        return $.multiply(transfer, b) //#3
    };

};

let getLatLon = (r) => {
    lon = $.atan2(r(2), r(1));
    k = $.sqrt(r(2)*r(2) + r(1)*r(1));
    lat = $.atan2(r(3), k);
    return {lon, lat}
}

let computeECIF = (r, t, OmegaE) => {
    let T = createTransform(t,OmegaE);
    return T(r);
}

module.exports = {
    createTransform,
    computeECIF,
    d2Rad
};
