// Penyetelan Aplikasi
let appServer = '';
let appAPIServer = 'https://gtcapp.ieu.link';

// let appServer = '';
// let appAPIServer = 'http://localhost:62000';

// Penyetelan Tanggal dan Waktu
let appDate = new Date();
let appDateTime = appDate.getTime();
let appDateDay = appDate.getDay();
let appDateHour = appDate.getHours();
let appDateMinute = appDate.getMinutes();
let appDateSecond = appDate.getSeconds();
let appDateFormat = appDate.getHours() + ":" + appDate.getMinutes() + ":" + appDate.getSeconds();
let appDateDayFormat = appFuncIntToDay(appDateDay);
let appDateTimestamp = Math.floor(Date.now() / 1000);

// Memperbaharui value appTime
setInterval(() => {
    appDate = new Date();
    appDateTime = appDate.getTime();
    appDateDay = appDate.getDay();
    appDateHour = appDate.getHours();
    appDateMinute = appDate.getMinutes();
    appDateSecond = appDate.getSeconds();
    appDateFormat = appDate.getHours() + ":" + appDate.getMinutes() + ":" + appDate.getSeconds();
    appDateDayFormat = appFuncIntToDay(appDateDay);
    appDateTimestamp = Math.floor(Date.now() / 1000);
}, 1000);

var appData = [];
var appAccount = [];