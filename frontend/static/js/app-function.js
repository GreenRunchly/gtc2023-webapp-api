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

/* Functions */
///Check variable
function is_exists(variable) {
    /*if (typeof variable === 'undefined'){
        return false;
    }else{
        return true;
    }*/
    if (variable !== null){
        if (variable !== undefined){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
    ///if (typeof userDataNeed === 'undefined'){
    ///if (variable !== null) || (variable !== undefined){
}
///Urut key array
function appFuncSortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
///Acak Array
function appFuncRandomArray(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
///Angka jadi hari
function appFuncIntToDay(angkaHari){
    switch (angkaHari) {
        case 6:
            formatHari = "Sabtu";
            break;
        case 0:
            formatHari = "Minggu";
            break;
        case 1:
            formatHari = "Senin";
            break;
        case 2:
            formatHari = "Selasa";
            break;
        case 3:
            formatHari = "Rabu";
            break;
        case 4:
            formatHari = "Kamis";
            break;
        case 5:
            formatHari = "Jumat";
            break;
        default:
            formatHari = "Unknow";
    }
    return formatHari;
}
function appFuncMathRound(vval,vmax) {
    return Math.round( ( (vval) / vmax )*(vmax/100) );
}
// Membuat format waktu 00:00
function appFuncTimeFormat(num) {
    return (num < 10) ? '0' + num : num;
}
// Menyembunyikan splashscreen
function appSplashHide() {
    // Remove Splash Screen
    let procSplashHideClass = setInterval(() => {
        $(".splashscreen").addClass('hide');
        let procSplashHide = setInterval(() => {
            $(".splashscreen").hide();
            clearInterval(procSplashHide);
        }, 1000);
        clearInterval(procSplashHideClass);
    }, 1000);
    
}
// Menampilkan Splashscreen
function appSplashShow() {
    // Remove Splash Screen
    $(".splashscreen").removeClass('hide');
    $(".splashscreen").show();
}
// Control Display Page
function appLoadPage(selectedPage) {
    appSplashShow();
    $.ajax({
        url: appServer + `/app-pages/${selectedPage}.html`,
        dataType: "html",
        success: function( response ) {
            appSplashHide();
            $(".app").html(response);
            console.log(response);
        },
        error: function() {
            appSplashShow();
        }
    });
}
// Control Display Content
function appLoadContent(target, contentSource) {
    $.ajax({
        url: appServer + `/app-pages/${contentSource}`,
        dataType: "html",
        success: function( response ) {
            $(target).html(response);
        },
        error: function() {
            $(target).html(`
                <p>Error Fetch Content</p>
            `);
        }
    });
}