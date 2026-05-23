const { on, emit } = require("./bus.js");
const state = require("./state.js");
const { getConfig } = require("./widght/setting/setting.js");
const { foot } = require("./widght/toast.js");

let autoSaver=null;
function initAutoSave(){
    let isautosave=getConfig("autoSave")
    if(isautosave){
        console.log("set auto save");
        autoSaver=autoSaver||setInterval(save,30000)
    }else{
        clearInterval(autoSaver);
        autoSaver=null;
    }
}

const b0=a=>a<10?"0"+a:a;
function save(){
    if(state.text){
        emit("savenow");
        let d=new Date();
        foot("自动保存于 "+d.getHours()+":"+b0(d.getMinutes())+":"+b0(d.getSeconds()),3000);
    }
}

initAutoSave();
on("config-autoSave",(nv)=>{
    initAutoSave();
})