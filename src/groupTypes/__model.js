const modelGroup={
    name:"默认",
    icon:"book",
    id:"def",
    navbarBtns:[{
        icon:"add",
        text:"新文档",
        click:async (g,grouper)=>{
            
        }
    }],
    groupConfigs:{
        title:"string require",
        desc:"string",
    },
    async info(g){
        return g;
    },
    async create(dt){
        
    },
    async getList(g){
        
    },
    async get(g,id){
        return {
            content:await localforage.getItem(id),
        };
    },
    async save(g,id,dt){

    },
    async remove(g,id){

    },
    async add(g,dt){

    },
    async destroy(g){

    }
}

module.exports = modelGroup;