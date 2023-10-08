/* Meta Data Aplikasi */
var appVersion = '1.0.0'; /// versi aplikasi
var appDeviceID = '';
var appServer = 'https://app.ieu.link/psyhealth'; /// tanpa slash di akhir 'http://localhost','https://greenrunchly.github.io'
var appConnected = true;
var appSettingsDebugMode = true;

///Apply Theme Settings
if (is_exists(loadData('app_settings_theme')) == true){}else{
    setData('light-theme','app_settings_theme');
}

var appSettingsTheme = loadData('app_settings_theme');
$("#app-theme").attr("href","css/" + appSettingsTheme + ".css");
if (appSettingsTheme == 'dark-theme'){
    $(".app-cloack-id").css("background-color","#73a3ce");
    appSettingsThemeOther = 'light-theme';
    $(".appSettingsTheme").html('<i class="fas fa-moon"></i>');
}else{
    appSettingsThemeOther = 'dark-theme';
    $(".appSettingsTheme").html('<i class="far fa-moon"></i>');
}
$(".appSettingsTheme").attr('href','settings-apply.html?theme='+appSettingsThemeOther);


/* Penyetelan Tanggal dan Waktu */
var appDate = new Date();
var appDateDay = appDate.getDay();
var appDateHour = appDate.getHours();
var appDateMinute = appDate.getMinutes();
var appDateSecond = appDate.getSeconds();
var appDateFormat = appDate.getHours() + ":" + appDate.getMinutes() + ":" + appDate.getSeconds();
var appDateDayFormat = intToDays(appDateDay);
var appDateTimestamp = Math.floor(Date.now() / 1000);

/* Storage Functions */
function setData(input,pada){
    /* simpan data */
    localStorage.setItem(pada, input);
    console.log('Set Data "'+pada+'"');
}  
function loadData(pada){
    /* load data */
    return localStorage.getItem(pada);
    console.log('Load Data "'+pada+'"');
}
function deleteData(pada){
    /* load data */
    return localStorage.removeItem(pada);
    console.log('Delete Data "'+pada+'"');
}
//Reset App Data Function
function appDeleteStorage(tipe){
    if (tipe == 'all'){
        localStorage.clear();
        console.log('App Delete All Success!');
    }else{
        deleteData(tipe);
        console.log('Data "'+tipe+'" Delete Success!');
    }
}