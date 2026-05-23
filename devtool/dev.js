const fs=require("fs");
const path=require("path");
const ws=require("ws");
const httpServer=require("http-server");
httpServer.createServer({
    root:path.join(__dirname,"../"),
}).listen(5500,()=>{
    console.log("Run at http://localhost:5500");
});
fs.watch(path.join(__dirname,"../src/"),{recursive:true},(eventType,filename)=>{
    toSendChange(filename,eventType=="rename");
});


const wsS=new ws.Server({port:8080});
let dws=[];
wsS.on("connection",(ws)=>{ 
    dws.push(ws);
    let index=dws.length-1;
    ws.on("close",()=>{
        dws[index]=null;
    });
});
function toSendChange(filename,isdelete=false){
    //send to client
    dws.forEach((ws)=>{
        ws&&ws.send(JSON.stringify({filename,isdelete}));
    })
}