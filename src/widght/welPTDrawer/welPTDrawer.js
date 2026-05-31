const { getConfig } = require("../setting/setting.js")

let replacers={
    "$saying":async function(){
        try{
            return (await(await fetch("https://v1.hitokoto.cn/")).json()).hitokoto
        }catch(e){
            let nz=["海内存知己，天涯若比邻。","木受绳则直，金就砺则利。"]
            return nz[Math.floor(Math.random()*nz.length)];
        }
    }
}

async function getText(){
    let wlp=getConfig("welcomeText");
    for(let i in replacers){
        if(wlp.indexOf(i)!==-1){
            wlp=wlp.replaceAll(i,await replacers[i]());
        }
    }
    return wlp;
}

module.exports={
    getText
}