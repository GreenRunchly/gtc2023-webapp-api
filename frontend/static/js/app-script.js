// Button Toggle Action
$(document).on('click','.toggle',function(e){
    let idnya = $(this).attr("toggle-id");
    let has = $("#"+idnya).hasClass("on");
    appClassToggle(idnya, has);
});