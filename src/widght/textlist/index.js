const bus = require("../../bus.js");
const core = require("../../core.js");
const groupTypes = require("../../groupTypes/index.js");
const { icons } = require("../../icon.js");
const state = require("../../state.js");
const editor = require("../editor/editor.js");
const { toast } = require("../toast/toast.js");
const { editGroup, createGroup } = require("./groupEdit.js");
const { drawGroupItem } = require("./grouper.js");
const { drawTextItem } = require("./texter.js");

const TL={
    drawGroupList(){
        let gl=core.getGroupList();
        let g=$(".groupList .groups");
        g.html(''); // clear the list
        for(let i=0;i<gl.length;i++){
            g.append(drawGroupItem(gl[i],this));
        }
    },
    async openGroup(gid){
        state.group=gid;
        let g=core.getGroup(gid);
        state.group_type=g.type||"def";
        this.switchPage(2);
        let gdt=await core.getGroupDT(gid);
        $(".textList .group-name").text(gdt.name);
        state.gdt=gdt;
        this.refreshList();
        this.drawNavBarIcon(g.type||"def");
    },
    editGroup(gid){
        let g=core.getGroup(gid);
        editGroup(g.type,g,(newone)=>{
            core.changeGroup(gid,newone);
            toast("修改成功",2000);
            TL.drawGroupList();
        })
    },
    addGroup(){
        createGroup((dt)=>{
            core.addGroup(dt);
            toast("新建成功",2000);
            TL.drawGroupList();
        })
    },
    drawNavBarIcon(type){
        $$(".navbar .icon-btn.gper").remove();
        let t=groupTypes[type];
        if(!t)return;
        for(let b of t.navbarBtns){
            let btn=el(".icon-btn.gper");
            btn.html(`<div class="m-icon">${icons[b.icon]}</div><div class="tx">${b.text}</div>`);
            btn.on("click",()=>{
                b.click(core.getGroup(state.group),TL);
            })
            $(".navbar").append(btn);
        }
    },
    async save(){
        if(!state.group||!state.text)return;
        await core.saveContent(state.group,state.text,editor.getValue());
        TL.listUpdate(state.text);
    },
    async refreshList(){
        if(!state.group)return;
        let texts=await core.getList(state.group);
        let g=$(".textList .texts");
        g.html(''); // clear the list
        for(let i=0;i<texts.length;i++){
            g.append(drawTextItem(texts[i],this));
        }
    },
    async listUnshift(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        g.prepend(drawTextItem(text,this));
    },
    async listRemove(tid){
        $$(".textList .texts .text-item[data-id='"+tid+"']").remove();
    },
    async listPush(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        g.append(drawTextItem(text,this));
    },
    async listUpdate(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        $(".textList .texts .text-item[data-id='"+tid+"']").addClass("readyReplace");
        g.insertBefore(drawTextItem(text,this),$(".textList .readyReplace"));
        $(".textList .readyReplace").remove();
    },
    async closeGroup(){
        this.closeText();
        $$(".navbar .icon-btn.gper").remove();
        let gc=groupTypes[state.group_type].close;
        gc&&(await gc(core.getGroup(state.group),TL));
        state.group=null;
        state.group_type=null;
        state.gdt=null;
    },
    switchPage(p){
        if(p==1){
            $(".left").addClass("ongroup");
        }else if(p==2){
            $(".left").removeClass("ongroup");
        }
    },
    async openText(id){
        await this.save();
        state.text=id;
        let ct=await core.getContent(state.group,state.text);
        editor.setValue(ct.content);
        this.setEditorConfig(ct.editor);
        $$(".textList .texts .text-item.active").removeClass("active");
        $$(".textList .texts .text-item[data-id='"+id+"']").addClass("active");
        $(".exportbtn").show();
    },
    closeText(){
        if(!state.text)return;
        state.text=null;
        editor.setValue("");
        editor.setOption("readOnly",true);
        $$(".textList .texts .text-item.active").removeClass("active");
        $(".exportbtn").hide();
    },
    setEditorConfig(cf={}){
        let defOption={
            readOnly: false,
            mode: "markdown"
        };
        for(let k in defOption){
            if(isUd(cf[k])){
                editor.setOption(k,defOption[k]);
            }else{
                editor.setOption(k,cf[k]);
            }
        }
    },
    exportText(){
        if(groupTypes[state.group_type].export){
            groupTypes[state.group_type].export(core.getGroup(state.group),TL);
        }else{
            downloadTxt(editor.getValue(),$(".text-item.active .ti").text()+".md");
        }
    }
}

TL.drawGroupList();
$(".textList .group-name").on('click',async ()=>{
    await TL.save();
    await TL.closeGroup();
    TL.switchPage(1);
})

bus.on("savenow",()=>{
    TL.save();
})

$(".exportbtn").hide();
$(".exportbtn").on("click",()=>{
    TL.exportText();
})


const b0=a=>a<10?"0"+a:a;

// create the flash text
$(".flashbtn").on("click",async ()=>{
    // just open the flash group
    let fid=core.getGroupList().find(g=>g.sp=="flash").id;
    let id=await core.addItem(fid,{});
    await core.saveContent(fid,id,`# 闪念 ${formatDate()}\n\nTyping here...`); // for the special flash text
    await TL.openGroup(fid);
    await TL.openText(id);
})

function formatDate(){
    let date=new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${b0(date.getMinutes())}:${b0(date.getSeconds())}`
}

function downloadTxt(content, fileName="sth.md") {
    // 创建 Blob（使用 UTF-8 编码，支持中文）
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;
    // 避免在页面上显示
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放对象 URL
    URL.revokeObjectURL(url);
}

$(".add-group").on("click",()=>{
    TL.addGroup();
})