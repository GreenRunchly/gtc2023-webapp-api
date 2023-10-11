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

// Button Toggle Action
$(document).on('click','.toggle',function(e){
    var idnya = $(this).attr("toggle-id");
    var has = $("#"+idnya).hasClass("on");

    if (has == true){
        $("#"+idnya).addClass("off");
        $("#"+idnya).removeClass("on");
    }else{
        $("#"+idnya).addClass("on");
        $("#"+idnya).removeClass("off");
    }
});