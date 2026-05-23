$(".tofull").on("click",()=>{
    if(document.fullscreenElement){
        document.exitFullscreen();
    }else{
        document.documentElement.requestFullscreen();
    }
})

window.on("fullscreenchange",()=>{
    if(document.fullscreenElement){
        $(".tofull .f").hide();
        $(".tofull .u").show();
        $(".navbar").addClass("hid");
    }else{
        $(".tofull .u").hide();
        $(".tofull .f").show();
        $(".navbar").removeClass("hid");
    }
})

window.on("keydown",(e)=>{
    if(e.key=="F11"){
        e.preventDefault();
        $(".tofull").click();
    }
})