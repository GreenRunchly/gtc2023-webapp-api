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
function itsSortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
///Acak Array
function itsRandomArray(arra1) {
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
function itsIntToDay(angkaHari){
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

function itsRound(vval,vmax) {
    return Math.round( ( (vval) / vmax )*(vmax/100) );
}