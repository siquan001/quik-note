require("./editor.css");

const bus=require("../bus.js");
const { toast } = require("./toast.js");
let editor=new CodeMirror($(".editor"),{
    value: `# QUIK 笔记夹\n\nTry to edit here...`,
    mode:  "markdown",
    lineWrapping: true,
    foldGutter: true,
    styleActiveLine: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
        "Ctrl-Q": function(cm){ 
            cm.foldCode(cm.getCursor()); 
        },
        "Ctrl-S": function(cm){
            console.log("saver");
            bus.emit("savenow");
            toast("保存成功",1000);
        }
    }
});

module.exports=editor;