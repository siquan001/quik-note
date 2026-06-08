const sto =require("../storage.js");

const defContent=`# 新的笔记

海内存知己，天涯若比邻。`;

const defgroup={
    name:"默认",
    icon:"book",
    id:"def",
    navbarBtns:[{
        icon:"add",
        text:"新文档",
        click:async (g,TL)=>{
            let id=await defgroup.add(g,{});
            TL.openText(id);
            TL.listUnshift(id);
        }
    }],
    groupConfigs:{
        name:{
            type:"text",
            label:"分组名称",
            required:true,
        },
        desc:{
            type:"text",
            label:"分组描述"
        }
    },
    async info(g){
        return g;
    },
    async create(dt){
        if(!sto.get().texts){
            sto.get().texts={};
        }
        sto.get().texts[dt.id]={};
        sto.set();
    },
    async getList(g){
        let t=sto.get().texts[g.id];
        return Object.keys(t).map(id=>t[id]);
    },
    async getDT(g,id){
        return sto.get().texts[g.id][id];
    },
    async get(g,id){
        return {
            content:await localforage.getItem(id),
        };
    },
    async save(g,id,dt){
        await localforage.setItem(id,dt);
        let meta=this.getMeta(dt);
        sto.get().texts[g.id][id].meta=meta;
        sto.set();
        return true;
    },
    getMeta(content){
        let title;
        let desc;
        // filter the empty line
        let cl=content.split("\n").filter(a=>a);
        if(cl.length==0)return {title:"[无标题]",desc:""};
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
    async remove(g,id){
        delete sto.get().texts[g.id][id];
        sto.set();
        await localforage.removeItem(id);
    },
    async add(g,dt){
        let id=this.geneId();
        dt.id=id;
        sto.get().texts[g.id][id]=cloneObj(dt);
        sto.set();
        await this.save(g,id,defContent);
        return id;
    },
    geneId(){
        return Math.random().toString(36).slice(2)+Date.now().toString(36).slice(4);
    },
    async destroy(g){
        for(let k in sto.get().texts[g.id]){
            await localforage.removeItem(k);
        }
        delete sto.get().texts[g.id];
        sto.set();
        return true;
    }
}

module.exports = defgroup;