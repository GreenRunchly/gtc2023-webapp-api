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
    let tiny = require('tiny-json-http');
    let url = urlMe;

    tiny.get({url}, function _get(err, result) {
        if (err) {
            return err;
        }
        else {
            return result;
        }
    })
}

module.exports = tools;