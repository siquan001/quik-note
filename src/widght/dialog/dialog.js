function createDialog(dt){
    let d=el(".dialog");
    let dg=el(".dialog-bg");
    let dc=el(".dialog-c");
    d.append(dg);
    d.append(dc);
    document.body.append(d);
    dc.innerHTML=dt.content;
    if(dt.ctor){
        dg.onclick=function(){
            d.removeClass("show");
        }
    }
    return {
        getD:()=>dc,
        show(){
            d.addClass("show");
        },
        hide(){
            d.removeClass("show");
        }
    }
}

let alertDialog=createDialog({
    content:`<div class='alert-alt'>提示</div>
    <div class='alert-text'></div>
    <div class="pp-input"><input type="text"/></div>
    <div class="btns">
        <div class="btn cancel">取消</div>
        <div class="btn ok">确定</div>
    </div>`
})

function alert(text,ok=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").hide();
    d.$(".pp-input").hide();
    d.$(".alert-text").text(text);
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        ok();
    }
    alertDialog.show();
}

function confirm(text,ok=()=>{},cancel=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").show("inline-block");
    d.$(".pp-input").hide();
    d.$(".alert-text").text(text);
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        ok();
    }
    d.$(".cancel").onclick=function(){
        alertDialog.hide();
        cancel();
    }
    alertDialog.show();
}

function prompt(text,cb=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").show("inline-block");
    d.$(".pp-input").show();
    d.$(".alert-text").text(text);
    d.$("input").val('');
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        cb(d.$("input").val());
    }
    d.$(".cancel").onclick=function(){
        alertDialog.hide();
        cb('');
    }
    alertDialog.show();
    d.$("input").focus();
    d.$("input").onkeydown=function(e){
        if(e.key=="Enter"){
            d.$(".ok").onclick();
        }
    }
}

require("./dialog.css");
module.exports={
    createDialog,
    alert,
    confirm,
    prompt
};