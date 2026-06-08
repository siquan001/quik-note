const core = require("../../core.js");
const { icons } = require("../../icon.js");
const state = require("../../state.js");
const { confirm, alert } = require("../dialog/dialog.js");

function drawGroupItem(group,TL){
    let li=geneLi(group,TL);
    if(!group.nodel){
        let delicon=delIcon(group);
        li.append(delicon);
    }
    let spicon=spIcon(group);
    if(spicon){
        li.append(spicon);
    }
    if(!group.noedit){
        let editicon=editIcon(group,TL);
        li.append(editicon);
    }
    if(state.group==group.id){
        li.addClass("active");
    }
    return li;
}

function geneLi(group,TL){
    let li=el(".bli.group-item");
    let ti=el(".ti");
    let dsc=el(".dsc");
    li.append(ti);
    li.append(dsc);
    ti.text(group.name);
    dsc.text(group.desc);
    li.data("id",group.id);
    li.on("click",()=>{
        TL.openGroup(group.id);
    })
    return li;
}

function delIcon(group){
    let delicon=el(".delicon.m-icon",{},icons["delete"]);
    delicon.on("click",(e)=>{
        e.stopPropagation();
        confirm("确定要删除该笔记夹吗？该操作不可恢复！",async ()=>{
            await core.removeGroup(group.id);
            alert("已删除");
        })
    })
    return delicon;
}

function spIcon(group){
    let sps={
        def:["默认笔记夹","book"],
        flash:["闪念","flash"],
        config:["配置","setting"]
    }
    if(group.sp&&sps[group.sp]){
        let [title,icon]=sps[group.sp];
        let spicon=el(".sp.m-icon.delicon",{title},icons[icon]);
        return spicon;
    }
}

function editIcon(group,TL){
    let editicon=el(".editicon.m-icon",{},icons["edit"]);
    editicon.on("click",(e)=>{
        e.stopPropagation();
        TL.editGroup(group.id);
    })
    return editicon;
}

module.exports= {
    drawGroupItem
}