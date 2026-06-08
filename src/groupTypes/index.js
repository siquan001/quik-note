const configGroup = require("./config.js");
const defgroup = require("./def.js");

let qb=[defgroup,configGroup];
let groupTypes={};
for(let i=0;i<qb.length;i++){
    groupTypes[qb[i].id]=qb[i];
}
module.exports=groupTypes;