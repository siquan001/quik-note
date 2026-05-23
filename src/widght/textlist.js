const core=require("../core.js");
const bus=require("../bus.js");
const state=require("../state.js");
const editor = require("./editor.js");
const { icons } = require("../icon.js");
const { confirm,alert, prompt, createDialog } = require("./dialog.js");
const {toast, foot}=require("./toast.js");
let groups=core.getGroupList();
if(groups.length==0){
    // create default group,
    // which can't be deleted(nodel:true)
    // the "sp" define the special icon(see line 76)
    core.addGroup({
        name:"默认笔记夹",
        desc:"默认的笔记存放处",
        nodel:true,
        sp:"def"
    })
    core.addGroup({
        name:"闪念",
        desc:"存放临时笔记的地方",
        nodel:true,
        sp:"flash"
    })
}
const b0=a=>a<10?"0"+a:a;
// listen change and draw timely
bus.on("groupChange",drawGroup);
bus.on("textsChange",(id)=>{
    if(state.group==id){// re-draw when is now opened one
        drawTexts();
    }
})

let groupEditor=createDialog({
    content:require("./gped.html")
})

function drawGroup(){
    groups=core.getGroupList();
    let g=$(".groupList .groups");
    g.html(''); // clear the list
    for(let i=0;i<groups.length;i++){
        let group=groups[i];
        // --create item--
        let li=el(".bli.group-item");
        let ti=el(".ti");
        let dsc=el(".dsc");
        li.append(ti);
        li.append(dsc);
        ti.text(group.name);
        dsc.text(group.desc);
        g.append(li);
        li.data("id",group.id);
        li.on("click",()=>{
            openGroup(group.id);
        })

        // for delete-icon
        if(!group.nodel){
            let delicon=el(".delicon.m-icon",{},icons["delete"]);
            li.append(delicon);
            delicon.on("click",(e)=>{
                e.stopPropagation();
                confirm("确定要删除该笔记夹吗？该操作不可恢复！",()=>{
                    core.removeGroup(group.id);
                    alert("已删除");
                    if(state.group==group.id){
                        state.group=null;
                        $(".left").addClass("ongroup");
                    }
                })
            })
        }

        // draw special icon
        if(group.sp=="def"){
            let delicon=el(".delicon.m-icon.sp",{title:"默认笔记夹"},icons["book"]);
            li.append(delicon);
        }else if(group.sp=="flash"){
            let delicon=el(".delicon.m-icon.sp",{title:"闪念"},icons["flash"]);
            li.append(delicon);
        }

        // for edit-icon
        let editicon=el(".editicon.m-icon",{},icons["edit"]);
        li.append(editicon);
        editicon.on("click",(e)=>{
            e.stopPropagation();
            groupEditor.show();
            let d=groupEditor.getD();
            // to edit the group info, first fill the form with original info
            d.$(".alert-alt").text("修改分组");
            d.$(".g-name").val(group.name);
            d.$(".g-desc").val(group.desc);
            d.$(".btn.ok").onclick=function(){
                let name=d.$(".g-name").val();
                let desc=d.$(".g-desc").val();
                if(name){ // name can't be empty,desc not required
                    group.name=name;
                    group.desc=desc;
                    core.changeGroup(group.id,group);
                    toast("修改成功",1000);
                }
                groupEditor.hide();
            }
            d.$(".btn.cancel").onclick=function(){
                groupEditor.hide(); // ah... I write it a bit more...
            }
        })

        // if actived
        if(state.group==group.id){
            li.addClass("active");
        }
    }
}

async function openGroup(id){
    // save Text first
    if(state.text){
        await core.setContent(state.group,state.text,editor.getValue());
        foot("已自动保存上一个打开的笔记",3000);
    }
    // if don't do that, when switch group,
    // the state.text will be not in the state.group 
    // causing error when switch-autosave
    state.text=null;
    editor.setValue("");
    $$(".group-item.active").removeClass("active");
    let li=$(".group-item[data-id='"+id+"']");
    li.addClass("active");
    state.group=id;
    $(".left").removeClass("ongroup");
    $(".textList .group-name").text(groups.find(g=>g.id==id).name);
    drawTexts();
}

function drawTexts(){
    let g=$(".textList .texts");
    g.html(''); // clear the list
    let texts=core.getTextList(state.group);
    for(let i=0;i<texts.length;i++){
        let text=texts[i];
        // --create item--
        let li=el(".bli.text-item");
        let ti=el(".ti");
        let dsc=el(".dsc");
        li.append(ti);
        li.append(dsc);
        ti.text(text.meta.title);
        dsc.text(text.meta.desc);
        g.append(li);
        li.data("id",text.id);

        // for delete-icon
        let delicon=el(".delicon.m-icon",{},icons["delete"]);
        li.append(delicon);
        delicon.on("click",(e)=>{
            e.stopPropagation();
            confirm("确定要删除该笔记吗？该操作不可恢复！",()=>{
                core.removeText(state.group,text.id);
                alert("已删除");
                if(state.text==text.id){
                    state.text=null;
                    editor.setValue("");
                }
            })
        })

        // open 
        li.on("click",()=>{
            openText(text.id);
        })
        // and if actived
        if(state.text==text.id){
            li.addClass("active");
        }
    }
}

async function openText(id,isgpc){
    // save Text first
    if(state.text&&(!isgpc)){
        await core.setContent(state.group,state.text,editor.getValue());
        foot("已自动保存上一个打开的笔记",3000);
    }
    // actived li
    $$(".text-item.active").removeClass("active");
    let li=$(".text-item[data-id='"+id+"']");
    li.addClass("active");

    state.text=id; // change global state 

    let ct=await core.getContent(id);
    editor.setValue(ct);
}

drawGroup();

// click the groupTitle in the textslist to redirect to the grouplist page
$(".textList .group-name").on("click",()=>{
    $(".left").addClass("ongroup");
})

// create the new text
$(".newdocbtn").on("click",async ()=>{
    // if no group was actived, first open the default group
    // if flash group actived, open the default group,too
    // because flash group has flash text only in principle 
    if((!state.group)||groups.find(g=>g.id==state.group).sp=="flash"){
        await openGroup(groups.find(g=>g.sp=="def").id);
    }else{
        // ensure the textlist was shown instead of the grouplist
        await openGroup(state.group);
    }

    // create and start
    let id=await core.addText(state.group);
    await openText(id,true);
})

// create the flash text
$(".flashbtn").on("click",async ()=>{
    // just open the flash group
    await openGroup(groups.find(g=>g.sp=="flash").id);
    let id=await core.addText(state.group);
    await core.setContent(state.group,id,`# 闪念 ${formatDate()}\n\nTyping here...`); // for the special flash text
    await openText(id,true);
})

function formatDate(){
    let date=new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${b0(date.getMinutes())}:${b0(date.getSeconds())}`
}

$(".add-group").on("click",()=>{
    groupEditor.show();
    let d=groupEditor.getD();
    // to add a new group, clear the input
    d.$(".alert-alt").text("新建分组");
    d.$(".g-name").val("");
    d.$(".g-desc").val("");
    d.$(".btn.ok").onclick=function(){
        let name=d.$(".g-name").val();
        let desc=d.$(".g-desc").val();
        if(name){ // name is required,and desc isnt
            let id=core.addGroup({name,desc});
            toast("新建成功",1000);
            openGroup(id);
        }
        groupEditor.hide(); 
    }
    d.$(".btn.cancel").onclick=function(){
        groupEditor.hide(); // why i should write it twice?
    }
})