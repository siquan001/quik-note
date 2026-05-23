require("./setting.css");
const sto=require("../../storage.js");
const { InputDrawers } = require("./inputs.js");
const { settingList, settingStructure } = require("./settingList.js");
const bus=require("../../bus.js")

$(".opensetting").on("click",()=>{
    $(".setting-container").addClass("show");
    reGetAll();
})

$(".setting-container").on("click",()=>{
    $(".setting-container").removeClass("show");
})

$(".setting-container .setting-box").on("click",e=>e.stopPropagation());

if(!sto.get().config){
    sto.get().config={};
    sto.set();
}

const pageConfig=sto.get().config;

function getConfig(key){
    let y=pageConfig[key];
    if(!settingList[key])return y;
    if(isUd(y)){
        return settingList[key].default;
    }else{
        return y;
    }
}

function drawSetting(){
    const settingBox=$(".setting-box");
    settingBox.html(`<h1 class="t-t">设置</h1>`);
    settingStructure.forEach(sgroup=>{
        el("h2.t-t",{},sgroup.title,settingBox);
        sgroup.list.forEach(key=>{
            let setting=settingList[key];
            let stb=el(".si",{"data-key":key},`<div class="si-m"><div class="si-t"></div><div class="si-d"></div></div><div class="si-input"></div>`,settingBox);
            stb.$(".si-t").html(setting.title);
            stb.$(".si-d").html(setting.desc);

            if(!InputDrawers[setting.type])return;            
            let v=getConfig(key);
            let inputer=InputDrawers[setting.type](setting,stb.$(".si-input"),(nv)=>{
                pageConfig[key]=nv;
                sto.set();
                bus.emit("config-"+key,nv);
            });

            inputer.setValue(v);
            setting.inputer=inputer;
        })
    })
}

function reGetAll(){
    for(let key in settingList)reGet(key);
}

function reGet(key){
    let inpt=settingList[key];
    inpt&&inpt.inputer.setValue(getConfig(key));
}

module.exports={
    reGetAll,
    reGet,
    getConfig,
    drawSetting,
    settingList,
    settingStructure
}