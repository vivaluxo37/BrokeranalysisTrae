$(".share__item").on("click",function(){
    var fbpopup = window.open($(this)[0].dataset.href, "pop", "width=600, height=400, scrollbars=no");
    return false;
});