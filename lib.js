//library
const $ = require('mathjs')
let d2Rad = (d) => d * $.pi / 180;

let createTransform = (ω, i, Ω) => {

    const t_1 = [
        [$.cos(ω), -$.sin(ω), 0],
        [$.sin(ω), $.cos(ω), 0],
        [0, 0, 1]
    ];

    const t_2 = [
        [1, 0, 0],
        [0, $.cos(i), -$.sin(i)],
        [0, $.sin(i), $.cos(i)]
    ];

    const t_3 = [
        [$.cos(Ω), -$.sin(Ω), 0],
        [$.sin(Ω), $.cos(Ω), 0],
        [0, 0, 1]
    ];

    return (b) => {
        b = $.multiply(t_1, b) //#3 Eular
        b = $.multiply(t_2, b) //#1
        return $.multiply(t_3, b) //#3
    };

};

let computeECI = (ω, i, Ω, a, e, ν, μ, isDegree) => {

    if (isDegree || $.max(ω, i, Ω, ν) > 7) {
        ω = d2Rad(ω);
        i = d2Rad(i);
        Ω = d2Rad(Ω);
        ν = d2Rad(ν);
    }

    //start the calculations
    let p = a * (1 - e * e);
    let r = p / (1 + e * $.cos(ν));
    let G = $.sqrt(μ / p);
    let T = createTransform(ω, i, Ω);

    let r_vec = [r * $.cos(ν), r * $.sin(ν), 0];
    let v_vec = [-$.sin(ν) * G, ($.cos(ν) + e) * G, 0];

    return {
        r: T(r_vec),
        v: T(v_vec),
        p,
        a
    }

}

module.exports = {
    createTransform,
    computeECI,
    d2Rad
};
