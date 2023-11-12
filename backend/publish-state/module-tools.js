/*
    Module untuk penanganan generate random number dan lainnya di masa mendatang
    Daftar Function : 
    numberGen( jumlahDigit ); return angka
*/

let tools = {};

// Number Gen (Hanya jarak 2-Sekian)
tools.numberGen = function (antara=6){
    let digit = '';
    for (let index = 1; index < antara; index++) {
        digit += '0';
    }
    return Math.floor( parseInt('1' + digit) + ( Math.random() * parseInt('9' + digit) ) );
}

tools.webGo = function (urlMe='https://google.com') {
    const Xray = require('x-ray');
    const x = Xray()

    x(urlMe, {})((err, result) => {
        // console.log(result);
    });
}

module.exports = tools;