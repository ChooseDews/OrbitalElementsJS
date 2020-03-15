
## OrbitalElementsJS
This is a simple javascript library which allows you to solve for the [orbital elements](https://en.wikipedia.org/wiki/Orbital_elements) from the position and velocity or vice versa.

## [Demo](https://choosedews.github.io/OrbitalElementsJS/)

![demo](/example/example.gif)

## Library Usage

### Install
    npm i https://github.com/ChooseDews/OrbitalElementsJS
### Usage
    const OrbitElement = require('./orbitalelements');

##### Get position & velocity from elements:
    let μ = 1; //GM = μ = 398600 for earth 
    let Ω = OrbitElement.d2Rad(194);
    let i = OrbitElement.d2Rad(39);
    let ω = OrbitElement.d2Rad(85);
    
    let a = 15307.548;
    let e = 0.7;
    let ν = OrbitElement.d2Rad(48);
   
    let values = OrbitElement.computeECI(ω, i, Ω, a, e, ν, μ)
    console.log(values);
##### Get elements from position & velocity:

    let μ = 1;
    let r_p = [4249.24395473, -2054.84062287, 2446.99585787];
    let v_p = [0.01436795, 0.00921151, -0.00442301];
    let elements = OrbitElement.getElements(r_p,v_p, μ);
    console.log(elements)
    
    
    




