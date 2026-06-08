const core = require("../../core.js");
const { icons } = require("../../icon.js");
const state = require("../../state.js");
const { confirm, alert } = require("../dialog/dialog.js");

function drawTextItem(t,TL) {
    let li=geneLi(t);
    if(!t.nodel){
        li.append(delIcon(t,TL));
    }
    li.on("click",()=>{
        TL.openText(t.id);
    })
    // and if actived
    if(state.text==t.id){
        li.addClass("active");
    }
    return li;
}

function geneLi(text){
    let li=el(".bli.text-item");
    let ti=el(".ti");
    let dsc=el(".dsc");
    li.append(ti);
    li.append(dsc);
    ti.text(text.meta.title);
    dsc.text(text.meta.desc);
    li.data("id",text.id);
    return li;
}

function delIcon(text,TL){
    let delicon=el(".delicon.m-icon",{},icons["delete"]);
    delicon.on("click",(e)=>{
        e.stopPropagation();
        confirm("确定要删除该笔记吗？该操作不可恢复！",async ()=>{
            if(state.text==text.id){
                TL.closeText();
            }
            TL.listRemove(text.id);
            await core.removeItem(text.id);
            alert("已删除");
        })
    })
    return delicon;
}

module.exports={
    drawTextItem
}