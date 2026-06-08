const groupTypes = require("../../groupTypes/index.js");
const { icons } = require("../../icon.js");
const { createDialog } = require("../dialog/dialog.js");
require("./selector.css")

let groupEditor=createDialog({
    content:require("./gped.html")
})

let d=groupEditor.getD();
d.$(".btn.cancel").on("click",()=>{
    groupEditor.hide();
})
function editGroup(type,dt,cb){
    groupEditor.show();
    d.$('.type_selector').hide();
    d.$(".alert-alt").text("修改分组");
    h='';
    let f=groupTypes[type||"def"].groupConfigs;
    for(let p in f){
        h+=`<div class='alert-text'>${f[p].label}：</div>
        <div class="pp-input"><input type="${f[p].type}" name="${p}" ${f[p].required?"required":""}/></div>`
    }
    d.$(".ff").html(h)
    for(let p in f){
        d.$("input[name='"+p+"']").val(dt[p])
    }
    d.$("form").onsubmit=function(e){
        e.preventDefault();
        for(let p in f){
            dt[p]=d.$("input[name='"+p+"']").val();
        }
        cb(dt);
        groupEditor.hide();
    }
}

function drawSelector(){
    let g=d.$('.type_selector');
    g.html('');
    for(let k in groupTypes){
        if(groupTypes[k].notCreated)continue;
        let ti=el(".gt-item");
        let t=groupTypes[k];
        ti.html(`<div class="m-icon">${icons[t.icon]||''}</div><div class="gt-text">${t.name}</div>`);
        ti.on("click",()=>{
            drawDTer(k);
            $$(".gt-item.active").removeClass("active");
            ti.addClass("active");
        })
        ti.data("type",k);
        g.append(ti);
    }
}

drawSelector();

function drawDTer(type){
    h='';
    let f=groupTypes[type||"def"].groupConfigs;
    for(let p in f){
        h+=`<div class='alert-text'>${f[p].label}：</div>
        <div class="pp-input"><input type="${f[p].type}" name="${p}" ${f[p].required?"required":""}/></div>`
    }
    d.$(".ff").html(h);
}

function createGroup(cb){
    groupEditor.show();
    d.$('.type_selector').show();
    d.$('.gt-item[data-type=def]').click();
    d.$(".alert-alt").text("创建分组");
    d.$("form").onsubmit=function(e){
        e.preventDefault();
        let dt={};
        dt.type=d.$(".gt-item.active").data("type");
        let f=groupTypes[dt.type].groupConfigs;
        for(let p in f){
            dt[p]=d.$("input[name='"+p+"']").val();
        }
        cb(dt);
        groupEditor.hide();
    }
}

module.exports={
    editGroup,
    createGroup
}