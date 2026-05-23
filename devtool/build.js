const path=require('path')
const root=path.join(__dirname,'../src/index.js');

const fs=require('fs');
const htmlMinifier = require('./minihtml.js');
const cleanCSS = require('clean-css');
const uglifyJs= require('./minijs.js')
const _redirects={};
const _indexs={};
const _codes=[];

let csscode='';

function queryJs(p){
    if(_redirects[p])p=_redirects[p];
    if(typeof _indexs[p]!="undefined")return _indexs[p];
    let c=readJs(p);
    if(path.extname(p)===".js"){
        c=removeComments(c);
        const requireRegex = /(?<!\.)\brequire\s*\(\s*(["'`])(.*?)\1\s*\)/g;
        const requireMatches = c.matchAll(requireRegex);
        for (const match of requireMatches) {
            const mp = match[2];
            const fullPath = path.join(path.dirname(p), mp);
            let pdi=queryJs(fullPath);
            console.log(fullPath,pdi);
            c=c.replace(match[0],typeof pdi=="undefined"?'':`require(${pdi})`);
            if(_redirects[fullPath])fullPath=_redirects[fullPath];
        }
        const onUpdateRegex = /(?<![.\w])(onUnmounted|onUpdate)\s*\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
        c=c.replaceAll(onUpdateRegex,'');
        _indexs[p]=_codes.length;
        _codes.push(`(require,module)=>{${c}}`);
    }else if(path.extname(p)===".css"){
        csscode+='\n'+c;
    }else{
        _indexs[p]=_codes.length;
        _codes.push(`(require,module)=>{${parserCode(p,c)}}`);
    }
    return _indexs[p];
}

let id=queryJs(root);

function readJs(p){
    if(p[p.length-1]==='/'){
        let rp=p+'index.js';
        _redirects[p]=rp;
        return fs.readFileSync(rp,'utf-8');
    }
    try {
        return fs.readFileSync(p,'utf-8');
    } catch (error) {
        let rp=p+"/index.js";
        _redirects[p]=rp;
        return fs.readFileSync(rp,'utf-8');
    }
}
function parserCode(p,code){
    if(path.extname(p)===".json"){
        return `module.exports=${code};`
    }else if(path.extname(p)===".html"||path.extname(p)===".htm"){
        return `module.exports="${htmlMinifier.minify(code, {
            collapseWhitespace: true,
            removeComments: true
          }).replaceAll("\"","\\\"")}";`
    }else{
        return "module.exports=`"+code.replaceAll('`','\\`')+"`;";
    }
}

function removeComments(code) {
    return code+'\n';
}


let jscode=`((p)=>{
    let m=[];
    let q=(i)=>typeof m[i]=="undefined";
    let _=(i)=>{
        if(!q(i))return m[i];
        let b={};p[i](_,b);
        m[i]=b.exports;
        if(q(i))m[i]=0;
        return m[i];
    }
    _(${id});
})([${_codes.join(",")}])`

fs.writeFileSync(path.join(__dirname,'../docs/index.js'),jscode);

uglifyJs.minify(jscode, {
    compress: {
        drop_console: false
    }
}).then(function (result) {
    fs.writeFileSync(path.join(__dirname,'../docs/index.bundle.js'),result.code);
})
fs.writeFileSync(path.join(__dirname,'../docs/index.bundle.css'),new cleanCSS().minify(csscode).styles);

let htmlcode=fs.readFileSync(path.join(__dirname,'../index.html'),'utf-8');
htmlcode=htmlcode.replace(/<!--\s*dev-start\s*-->[\s\S]*?<!--\s*dev-end\s*-->/g,'').replace("</body>","<script src=\"index.bundle.js\"></script>\n</body>").replace("</head>","<link rel=\"stylesheet\" href=\"index.bundle.css\">\n</head>");
fs.writeFileSync(path.join(__dirname,'../docs/index.html'),htmlMinifier.minify(htmlcode,{
    collapseWhitespace: true,
    removeComments: true
}));
