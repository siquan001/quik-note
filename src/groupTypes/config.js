const { getConfig, setConfig } = require("../widght/setting/setting.js");

let textlist=[
    {
        meta:{
            title:"关于我们",
            desc:"关于QUIK笔记夹，以及开发感想",
        },        
        readonly:true,
        content(){
            return require("../docs/aboutus.md")
        },
        id:"aboutus"
    },
    {
        meta:{
            title:"帮助",
            desc:"QUIK笔记夹使用说明",
        },
        readonly:true,
        content(){
            return require("../docs/help.md")
        },
        id:"help"
    },
    {
        meta:{
            title:"首页文字设置",
            desc:"设置打开QUIK笔记夹时编辑器显示的欢迎文字",
        },
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


const configGroup={
    name:"笔记夹配置",
    notCreated:true,
    icon:"config",
    id:"config",
    navbarBtns:[],
    async info(g){
        return {
            name:"笔记夹配置",
            desc:"笔记夹配置",
            type:"config"
        };
    },
    async create(){},
    async getList(){
        return textlist;
    },
    async get(g,id){
        let t=textlist.find(e=>e.id==id);
        return {
            content:t.content(),
            editor:{
                readonly:t.readonly
            }
        };
    },
    async getDT(g,id){
        return textlist.find(e=>e.id==id);
    },
    async save(g,id,dt){
        let t=textlist.find(e=>e.id==id);
        if(t.save){
            await t.save(dt);
        }
    },
    async remove(){},
    async add(){},
}

module.exports = configGroup;