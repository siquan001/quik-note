const groupTypes = require("./groupTypes/index.js");
const sto = require("./storage.js");

if(!sto.get().groupList){
    sto.get().groupList={};
    sto.set();
}

if(sto.get().groups){
    sto.get().groups.forEach(g=>{
        sto.get().groupList[g.id]=g;
    })
    sto.set();
}

const core={
    geneId(){
        return Math.random().toString(36).slice(2)+Date.now().toString(36).slice(4);
    },
    async addGroup(dt){
        let id=this.geneId();
        dt.id=id;
        sto.get().groupList[id]=dt;
        await groupTypes[dt.type||"def"].create(dt);
        sto.set();
        return id;
    },
    getGroupList(){
        return Object.keys(sto.get().groupList).map(id=>sto.get().groupList[id]);
    },
    getGroup(gid){
        return sto.get().groupList[gid];
    },
    async getGroupDT(gid){
        let g=this.getGroup(gid);
        if(!g)return null;
        return await groupTypes[g.type||"def"].info(g);
    },
    changeGroup(id,dt){
        dt.id=id;
        sto.get().groupList[id]=cloneObj(dt);
        sto.set();
    },
    async getList(gid){
        let g=sto.get().groupList[gid];
        if(!g)return [];
        return await groupTypes[g.type||"def"].getList(g)
    },
    async getContent(gid,id){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        return await groupTypes[g.type||"def"].get(g,id)
    },
    async saveContent(gid,id,dt){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        return await groupTypes[g.type||"def"].save(g,id,dt)
    },
    async removeItem(gid,id){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        return await groupTypes[g.type||"def"].remove(g,id)
    },
    async getItem(gid,id){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        return await groupTypes[g.type||"def"].getDT(g,id)
    },
    async removeGroup(gid){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        let t=groupTypes[g.type||"def"];
        if(t.destroy){
            await t.destroy(g)
        }
        delete sto.get().groupList[gid];
        sto.set();
        return true;
    },
    async addItem(gid,dt){
        let g=sto.get().groupList[gid];
        if(!g)return null;
        return await groupTypes[g.type||"def"].add(g,dt)
    }
}

let gs=core.getGroupList();
if(!gs.find(g=>g.sp=="def")){
    core.addGroup({
        name:"默认笔记夹",
        desc:"默认的笔记存放处",
        nodel:true,
        sp:"def"
    })
}

if(!gs.find(g=>g.sp=="flash")){
    core.addGroup({
        name:"闪念笔记",
        desc:"临时存放闪念笔记",
        nodel:true,
        sp:"flash"
    })
}

if(!gs.find(g=>g.sp=="config")){
    core.addGroup({
        type:"config",
        name:"笔记夹配置",
        desc:"编辑QUIK笔记夹的各种信息",
        nodel:true,
        noedit:true,
        sp:"config",
        id:"config-group"
    });
}

module.exports=core;