const $ = require('mathjs')
let norm = (v) => $.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
let r2Deg = (r) => $.round(180 * r / $.pi, 4);

let μ = 1;
let r_p = [4249.24395473, -2054.84062287, 2446.99585787];
let v_p = [0.01436795, 0.00921151, -0.00442301];

//let r_p = [5249.24, -2054.84, 2446.99];
//let v_p = [0.0143, 0.00921, -0.0044];


let orbitVectors = (r_p, v_p, μ) => {

  let h_p = $.cross(r_p, v_p);
  let h = norm(h_p, 3);
  let r = norm(r_p, 3);
  let p = h * h / μ

  let vxh = $.cross(v_p, h_p)
  let rr = $.multiply(-1 / r, r_p)
  let e_p = $.add($.multiply(1 / μ, vxh), rr);
  let e = norm(e_p);
  let a = p / (1 - e * e);

  let r_min = p/(1+e)
  let r_max = p/(1-e)

  let n = {
    h_p,
    e_p,
    e,
    h,
    a,
    p,
    r_min,
    r_max
  }
  console.log('orbit vectors: ', n)
  return n;

}

let getElements = (r_p, v_p, μ) => {

    let h_p = $.cross(r_p, v_p);
    let h = norm(h_p, 3);
    let r = norm(r_p, 3);
    let p = h * h / μ

    let vxh = $.cross(v_p, h_p)
    let rr = $.multiply(-1 / r, r_p)
    let e_p = $.add($.multiply(1 / μ, vxh), rr);
    let e = norm(e_p);
    let a = p / (1 - e * e);

    //define for use in dot products
    let i_x = [1, 0, 0];
    let i_y = [0, 1, 0];
    let i_z = [0, 0, 1];

    //handle Ω
    let n_p = $.cross(i_z, h_p);
    let Ω = $.atan2($.dot(n_p, i_y), $.dot(n_p, i_x));
    if (Ω < 0) Ω += $.pi * 2;

    //handle i
    let n = norm(n_p);
    let y = $.dot(h_p, $.cross(n_p, i_z))
    let x = $.multiply(n, $.dot(h_p, i_z))
    let i = $.atan2(y, x);

    //handle ω
    let xx = $.dot(e_p, $.cross(h_p, n_p))
    let yy = $.multiply(h, $.dot(e_p, n_p))
    let ω = $.atan2(xx, yy);
    if (ω < 0) ω += $.pi * 2;

  //handle ν
    let aa = $.dot(r_p, $.cross(h_p, e_p))
    let bb = $.multiply(h, $.dot(r_p, e_p))
    let ν = $.atan2(-aa, -bb) + $.pi;

    return {
        Ω,
        ω,
        i,
        ν,
        e,
        a,
        p,
        h_p,
        e_p,
        h
    }

}



module.exports = {
    getElements,
    orbitVectors,
    r2Deg,
    norm
}
