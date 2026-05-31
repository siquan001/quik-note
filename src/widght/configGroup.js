const core = require("../core.js");
const state = require("../state.js");
const editor = require("./editor.js");
const { getConfig, setConfig } = require("./setting/setting.js");

let textlist=[
    {
        title:"关于我们",
        desc:"关于QUIK笔记夹，以及开发感想",
        readonly:true,
        content(){
            return require("../docs/aboutus.md")
        },
        id:"aboutus"
    },
    {
        title:"帮助",
        desc:"QUIK笔记夹使用说明",
        readonly:true,
        content(){
            return require("../docs/help.md")
        },
        id:"help"
    },
    {
        title:"首页文字设置",
        desc:"设置打开QUIK笔记夹时编辑器显示的欢迎文字",
        readonly:false,
        content(){
            return getConfig("welcomeText");
        },
        async save(txt){
            setConfig("welcomeText",txt);
        },
        id:"welcomeText"
    },
]

function drawConfigTexts(){
    let g=$(".textList .texts");
    g.html(''); // clear the list
    for(let i=0;i<textlist.length;i++){
        let text=textlist[i];
        // --create item--
        let li=el(".bli.text-item");
        let ti=el(".ti");
        let dsc=el(".dsc");
        li.append(ti);
        li.append(dsc);
        ti.text(text.title);
        dsc.text(text.desc);
        g.append(li);
        li.data("id",text.id);
        li.on("click",function(){
            openText(text.id);
        })
    }
}

async function openText(id,isgpc){
    // save Text first
    if(state.text&&(!isgpc)&&state.group!="config-group"){
        await core.setContent(state.group,state.text,editor.getValue());
        foot("已自动保存上一个打开的笔记",3000);
    }

    // actived li
    $$(".text-item.active").removeClass("active");
    let li=$(".text-item[data-id='"+id+"']");
    li.addClass("active");

    state.text=id; // change global state 
    let t=textlist.find(t=>t.id==id);
    editor.setValue(t.content());
    editor.focus();
    if(t.readonly){
        editor.setOption("readOnly",true);
    }else{
        editor.setOption("readOnly",false);
    }
}

async function saveText(){
    let t=textlist.find(t=>t.id==state.text);
    await t.save(editor.getValue());
}

module.exports={
    drawConfigTexts,
    saveText
}