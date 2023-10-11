///Check App Device ID
if (typeof loadData('app_storage_deviceid') !== 'undefined'){
    appDeviceID = loadData('app_storage_deviceid');
    console.log(appDeviceID);
}else{
    window.location.replace('error.html?pesan='+'Harap hapus data aplikasi, dan coba lagi!');
}

///Cek kebutuhan data
if (typeof userDataNeed === 'undefined'){
    userDataNeed = btoa(JSON.stringify([]));
}
///Cek apa sudah login atau belum dan mengambil data user
if (is_exists(loadData('app_storage_login_session')) == true){
    $.post(appServer + '/get-data', {
        user_session:loadData('app_storage_login_session'),
        option_data:userDataNeed
    }).done(function(data, status){
        if (data.result == 0){
            userData = data.user_data;
            console.log(userData);
        }else{
            appDeleteStorage('app_storage_login_session');
            window.location.replace('error.html?pesan='+data.pesan+'['+data.result+']');
        }
        //console.log(data);
    }).fail(function(xhr, status, error) {
        window.location.replace('error.html?pesan='+'Periksa Koneksi Internet Anda!['+error+']');
    });
}else{
    window.location.replace('portal.html');
}
