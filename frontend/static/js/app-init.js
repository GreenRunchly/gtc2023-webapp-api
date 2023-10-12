// Penyetelan Aplikasi
let appServer = 'http://localhost:61878';
let appAPIServer = 'http://localhost:62000';

// Penyetelan Tanggal dan Waktu
let appDate = new Date();
let appDateTime = appDate.getTime();
let appDateDay = appDate.getDay();
let appDateHour = appDate.getHours();
let appDateMinute = appDate.getMinutes();
let appDateSecond = appDate.getSeconds();
let appDateFormat = appDate.getHours() + ":" + appDate.getMinutes() + ":" + appDate.getSeconds();
let appDateDayFormat = itsIntToDay(appDateDay);
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
    appDateDayFormat = itsIntToDay(appDateDay);
    appDateTimestamp = Math.floor(Date.now() / 1000);
}, 1000);

// Load App Data
$.ajax({
    url: `${appAPIServer}/app-data`, dataType: "json",
    success: function( response ) {
        
    },
    error: function() {
        appSplashHide();
    }
});