function createSwitcher(cb){
    let E=el(".switcher",{},'<div class="sw-bar"></div><div class="sw-er"></div>');
    E.onclick=function(){
        E.toggleClass("on");
        cb(E.hasClass("on"));
    }
    E.set=function(value){
        value?E.addClass("on"):E.removeClass("on");
    }
    E.get=function(){
        return E.hasClass("on");
    }
    return E;
}

module.exports=createSwitcher;