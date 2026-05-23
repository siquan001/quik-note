require("./base.css");
require("./index.css");
require("./qui-core.js")
require("./icon.js");
require("./widght/full.js");
require("./widght/editor.js");
require("./widght/textlist.js");
require("./widght/pageManager.js");
require("./themes/themes.js")
const settingBox=require("./widght/setting/setting.js");
require("./autoSaver.js");
initResize();

const bus=require("./bus.js");
const core = require("./core.js");
const state = require("./state.js");
const editor = require("./widght/editor.js");

// I think it's bad to put it here, but idk where to put the fucking code
bus.on("savenow",()=>{
    console.log(state);
    if(!state.group) return;
    if(!state.text) return;
    core.setContent(state.group,state.text,editor.getValue());
    console.log("已保存");
})

// I must let you see the so graceful loading page :)
setTimeout(()=>{
    $(".loading-page").css("opacity",0);
},300)


settingBox.drawSetting();