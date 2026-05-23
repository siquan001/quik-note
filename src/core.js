const sto=require("./storage.js");
const bus=require("./bus.js");
function init(){
    // to init storage
    // with a grouplist and textlists
    // groups will be [{info},{info}] with every group has a id
    // texts will be {id:[{info},{info}],...} to match every group 
    //  with each the group's specific id
    //  and every text has a id to match the localforage id 
    //  to store the content
    if(!sto.get().groups){
        sto.get().groups=[];
    }
    if(!sto.get().texts){
        sto.get().texts={};
    }
    sto.set(); // the sto usage ,seeing the storage.js
}
init();
const core={
    geneId(){
        return Math.random().toString(36).slice(2)+Date.now().toString(36).slice(4);
    },
    getGroupList(){
        return sto.get().groups||[];
    },
    addGroup(group){
        let id=this.geneId();
        group.id=id;
        sto.get().groups.push(group);
        sto.get().texts[id]=[];
        sto.set();
        bus.emit("groupChange");
        return id;
    },
    changeGroup(id,group){
        let index=sto.get().groups.findIndex(g=>g.id==id);
        if(index==-1)return false;
        sto.get().groups[index]=group;
        sto.set();
        bus.emit("groupChange");
        return true;
    },
    getGroup(id){
        // I think it's useless
        return sto.get().groups.find(g=>g.id==id);
    },
    removeGroup(id){
        let index=sto.get().groups.findIndex(g=>g.id==id);
        if(index==-1)return false;
        sto.get().groups.splice(index,1);
        // remove all the texts' contents in this group
        sto.get().texts[id].forEach(t=>localforage.removeItem(t.id));
        delete sto.get().texts[id];
        sto.set();
        bus.emit("groupChange");
        return true;
    },
    getTextList(id){
        return sto.get().texts[id]||[];
    },
    async addText(id,text){
        if(!sto.get().texts[id])return;
        if(!text)text={};
        // the initial meta must be added,
        // because the list-drawing need it,
        // and missing it will cause error
        if(!text.meta)text.meta={
            title:"",
            desc:""
        }; 
        
        let id2=this.geneId();
        text.id=id2;
        sto.get().texts[id].unshift(text);
        sto.set();
        bus.emit("textsChange",id);
        
        await this.setContent(id,id2,`# 新的笔记\n\n海内存知己，天涯若比邻。`);
        return id2;
    },
    async getContent(textId){
        return await localforage.getItem(textId);
    },
    async setContent(groupId,textId,content){
        // the text meta is conducted by the content dynamically
        let meta=this.getMeta(content);
        let d=sto.get().texts[groupId];
        d[d.findIndex(t=>t.id==textId)].meta=meta;
        sto.set();
        bus.emit("textsChange",groupId);
        // we need the time when the content is actually set
        // EX: when create first,we must know the create time to 
        //     decide when to get and fill the editor.
        return await localforage.setItem(textId,content);
    },
    getMeta(content){
        let title;
        let desc;
        // filter the empty line
        let cl=content.split("\n").filter(a=>a);
        let ti=0;

        // to find the first header
        yy:for(let i=0;i<cl.length;i++){
            if(cl[i][0]=="#"){
                for(let j=0;j<cl[i].length;j++){
                    if(cl[i][j]=='#')continue;
                    if(cl[i][j]==' '){
                        // it tells us the line has a format
                        // like "#..# " (n * "#" & " ")
                        // set the line content as the title
                        ti=i; // mark the title pos
                        title=cl[i].slice(j+1);
                        break yy; // stop main while
                    }else{
                        // the line is "#..#R" , not the title
                        continue yy;
                    }
                }
            }
        }

        // if not have title,use first not empty line
        if(!title){
            title=cl[0];
        }
        title=title.slice(0,50);

        // cut content before title
        cl.splice(0,ti+1);
        // desc is following content
        desc=cl.join("\n").slice(0,100);
        return {title,desc}
    },
    removeText(id,id2){
        if(!sto.get().texts[id])return false;
        let index=sto.get().texts[id].findIndex(t=>t.id==id2);
        if(index==-1)return false;
        sto.get().texts[id].splice(index,1);
        sto.set();
        // it's unnecessary to ensure the text has been deleted
        // so the func isn't a async func
        localforage.removeItem(id2);
        bus.emit("textsChange",id);
        return true;
    }

}

module.exports=core;