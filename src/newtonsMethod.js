var precision = 0.001;
var prevGuess = 0;

function f(x) {
    return Math.sin(x);
}


function derivative(f) {
    var h = 0.001;
    return function(x) { return (f(x + h) - f(x - h)) / (2 * h); };
}

function newtonsMethod(guess) {
    if (guess === null || guess === undefined)
        guess = 0;

    if (Math.abs(prevGuess - guess) > precision) {
        prevGuess = guess;
        var approx = guess - (f(guess) / derivative(f)(guess));

        console.log(guess);
        // console.log(f(guess));
        // console.log(derivative(f)(guess));
        // console.log(approx);
        console.log('\n');

        return newtonsMethod(approx);
    } else {
        return guess;
    }
}