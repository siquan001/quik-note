const bus = require('../bus.js');
const sto=require('../storage.js');
const { getConfig } = require('./setting/setting.js');
let leftWidth=sto.get().leftW||300;

function setLeftWidth(width){
    $(".left").css("width",width+'px');
    $(".right").css("width",`calc(100% - ${width+10}px)`);
    $(".lr-hr").css("left",width-2+'px');
    $(".hidelbtn").css("left",width-15+'px');
}

setLeftWidth(leftWidth);

$(".lr-hr").on("mousedown",(e)=>{
    let x=e.pageX;
    document.onmousemove=(e2)=>{
        let x2=e2.pageX;
        let w=x2-x+leftWidth;
        if(w<150)w=150;
        if(w>600)w=600;
        setLeftWidth(w);
    }
    document.onmouseup=(e2)=>{
        let x2=e2.pageX;
        let w=x2-x+leftWidth;
        if(w<150)w=150;
        if(w>600)w=600;
        leftWidth=w;
        sto.get().leftW=w;
        sto.set();
        document.onmousemove=null;
        document.onmouseup=null;
    }
})

$(".hidelbtn").on("click",()=>{
    $(".main").toggleClass("hidel");
})

let nativeThemes=["def-light","def-dark","mild-light","mild-dark"];
let themes=sto.get().themes||{};

function initTheme(){
    let th=getConfig("theme");
    let clss=gbcl(th);
    function gbcl(th){
        let r=[th];
        if(nativeThemes.includes(th))return r;
        if(!themes[th]||(!themes[th].baseon))return r;
        themes[th].baseon.forEach(i=>{
            r.push.apply(r,gbcl(i));
        })
        return r;
    }
    $("body").className=clss.join(" ");
}

initTheme();
bus.on("config-theme",()=>{
    initTheme();
})

function initEyeCare(){
    let ec=getConfig("eyeCare");
    let bl={
        no:0,
        l1:0.06,
        l2:0.12,
        l3:0.24,
        l4:0.4,
    }
    $(".eyeCare").css("opacity",bl[ec]);
    if(bl[ec]>0){
        $(".eyeCare").show();
    }else{
        $(".eyeCare").hide();
    }
}

initEyeCare();
bus.on("config-eyeCare",()=>{
    initEyeCare();
})

function initFonts(){
    let fs=getConfig("fonts");
    let bl={
        "def":"",
        "cla":"'Clear Sans',Iosevka,sans-serif",
        "mono":"monospace,sans-serif",
        "cons":"Consolas,monospace,sans-serif",
        "kaiti":"'楷体'",
    }
    $("body").css("font-family",bl[fs]);
}

initFonts();
bus.on("config-fonts",()=>{
    initFonts();
})