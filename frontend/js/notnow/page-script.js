/* Loading Screen */
window.onload = function () {
    var intervalLoadingScreen = setInterval(function () {
        $("body").css('overflow-y','auto');
        $(".app-cloack").fadeOut(500);

        clearInterval(intervalLoadingScreen);
    },500);
}
/* Nav Bar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos < 20) {
        $("#navigation-bar-hide").removeClass('blur');
    } else {
        $("#navigation-bar-hide").addClass('blur');
    }
    prevScrollpos = currentScrollPos;
    //console.log(currentScrollPos);
}

if (typeof $_GET['pesan'] !== 'undefined'){
    console.log($_GET['pesan']);
    $('.pesan_get').html($_GET['pesan']);
}
$(document).on('click','.to-page',function(e){
    var destination = $(this).attr("to-page");        
    window.location.replace(destination);
});
$(document).on('click','.halamanMundur',function(e){
    history.back()
});
function sliderChange(icon) {
    $(document).find(".slider-input").each(function() {
        $(this).siblings('.slider-input-effect').css('width', 'calc(' + (44 - (($(this).val()/$(this).attr('max'))*44)) + 'px + '+(($(this).val()/$(this).attr('max'))*100+'%)') );
        if (is_exists(icon) == true){
            $(this).siblings('.slider-input-effect').html(icon[0]);
        }
    });
}
$(document).on('input','.slider-input',function(e){
    sliderChange(); 
});
sliderChange();
/* Buttons Action */
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