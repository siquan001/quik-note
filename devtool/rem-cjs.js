function require(p){
    if(typeof REM._modules[p]!="undefined"){
        return REM._modules_torefs[p];
    }
    const module={exports:{}};
    function onUnmounted(fn){
        REM._onUnmounted[p]=fn;
    }
    function onUpdate(mo,fn){
        if(!REM._onUpdate[p])REM._onUpdate[p]=[];
        mo=REM.pathJoin(REM.pathFolder(p),mo);
        REM._onUpdate[p].push({mo,fn});
    }
    eval(REM._codes[p])(require,module,onUnmounted,onUpdate);
    REM._modules[p]=module.exports;
    if(typeof REM._modules[p]=="undefined"){
        REM._modules[p]=0;
    }
    if(typeof REM._modules[p]=="object"||typeof REM._modules[p]=="function"){
        REM._modules_torefs[p]=REM._modules[p];
    }else{
        REM._modules_torefs[p]=module.exports;
    }
    return REM._modules_torefs[p];
}

function createDymaicObj(obj,p){
    return new Proxy(function(){},{
        get(_t,key){
            let a=obj[p][key];
            if(typeof a=="object"||typeof a=="function"){
                return new Proxy(function(){},{
                    get(_t,key){
                        return obj[p][key];
                    },
                    apply(_t,_c,args){
                        return obj[p][key].apply(_c,args);
                    },
                    construct(_t,args){
                        return new obj[p][key](...args);
                    }
                })
            }else{
                return a;
            }
        },
        apply(_t,_c,args){
            return obj[p].apply(_c,args);
        },
        construct(_t,args){
            return new obj[p](...args);
        }
    })
}
const REM={
    config:{},
    init(config){
        this.config=config;
        this.initWs();
        this.parseModules();
    },
    chdl:[],
    _chdlt:null,
    initWs(){
        const ws = new WebSocket(this.config.wsServer);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            data.filename=data.filename.replaceAll("\\","/");
            let i=this.chdl.findIndex(e=>e.filename===data.filename);
            if(i!=-1){
                this.chdl.splice(i,1);
            }
            this.chdl.push(data);
            clearTimeout(this._chdlt);
            this._chdlt=setTimeout(()=>{
                for(let i=0;i<this.chdl.length;i++){
                    this.changeFile(this.chdl[i]);
                }
                this.chdl=[];
            },100);
        }
    },
    changeFile(data){
        let p=this.pathJoin(this.pathFolder(this.config.root),data.filename);
        if(!this._codes[p])return;
        let _quote=this.cloneObj(this._quotes[p])||[];
        let _bequoted=this.cloneObj(this._beQuoteds[p])||[];
        if(data.isdelete){
            this.removeModule(p);
            for(q of _quote){
                this._beQuoteds[q].filter(e=>e!==p);
                if(this._beQuoteds[q].length===0){
                    this.removeModule(q);
                }
            }
            if(_bequoted.length!=0){
                throw new Error("Something went wrong when HMR: "+JSON.stringify(data, null, 4));
            }
            console.log(`[HMR] UPDATE DELETE ${p}`);
        }else{
            delete this._codes[p];
            delete this._quotes[p];
            let un=this._onUnmounted[p];
            un&&un();
            delete this._onUnmounted[p];
            this.queryJs(p).then(()=>{
                for(q of _quote){
                    if(this._quotes[p].indexOf(q)==-1){
                        console.log(`[HMR] Unmount ${q}`);
                        this._beQuoteds[q]=this._beQuoteds[q].filter(e=>e!==p);
                        if(this._beQuoteds[q].length===0){
                            this.removeModule(q);
                        }
                    }
                }
                delete this._modules[p];
                require(p);
                for(let b in this._onUpdate){
                    for(let it of this._onUpdate[b]){
                        if(it.mo===p){
                            it.fn();
                        }
                    }
                }
                console.log(`[HMR] UPDATE ${p}`);
            });

        }
    },
    removeModule(p){
        delete this._codes[p];
        delete this._modules[p];
        delete this._quotes[p];
        delete this._beQuoteds[p];
        let un=this._onUnmounted[p];
        un&&un();
        delete this._onUnmounted[p];
        delete this._onUpdate[p];
    },
    cloneObj(obj){
        if(!obj)return obj;
        return JSON.parse(JSON.stringify(obj));
    },
    _modules:{},
    _modules_torefs:{},
    _onUnmounted:{},
    _onUpdate:{},
    _codes:{},
    _redirect:{},
    _quotes:{},
    _beQuoteds:{},
    async parseModules(){
        let root=this.config.root;
        await this.queryJs(root);
        if(this._redirect[root])root=this._redirect[root];
        require(root);
    },
    async queryJs(p){
        if(this._redirect[p])p=this._redirect[p];
        if(this._codes[p])return;
        let jscode=await this.readJs(p)
        if(this._redirect[p])p=this._redirect[p];
        if(p.endsWith(".js")){
            const isBasic=jscode.indexOf("@hmr")==-1;
            jscode=this.removeComments(jscode);
            const requireRegex = /(?<!\.)\brequire\s*\(\s*(["'`])(.*?)\1\s*\)/g;
            const requireMatches = jscode.matchAll(requireRegex);
            this._quotes[p]=[];
            for (const match of requireMatches) {
                const path = match[2];
                const fullPath = this.pathJoin(this.pathFolder(p), path);
                jscode=jscode.replace(match[0],`require("${fullPath}")`);
                await this.queryJs(fullPath);
                if(this._redirect[fullPath])fullPath=this._redirect[fullPath];
                this._quotes[p].push(fullPath);
                if(this._beQuoteds[fullPath]){
                    if(this._beQuoteds[fullPath].indexOf(p)===-1){
                        this._beQuoteds[fullPath].push(p);
                    }
                }else{
                    this._beQuoteds[fullPath]=[p];
                }
            }
            if(isBasic){
                jscode+=';onUnmounted(()=>{location.reload();});'
            }
            this._codes[p]=jscode;
        }else{
            this._codes[p]=this.parserCode(p,jscode);
        }
        this._codes[p]=`(function(require,module,onUnmounted,onUpdate){
            ${this._codes[p]}
        })`
    },
    parserCode(p,code){
        if(p.endsWith(".json")){
            return `module.exports=${code};`
        }else if(p.endsWith(".css")){
            return `
                let s=document.createElement('style');
                s.innerHTML=\`${code.replaceAll('`','\\`')}\`;
                document.head.appendChild(s);
                onUnmounted(()=>{
                    s.remove();
                })
            `
        }else{
            return "module.exports=`"+code.replaceAll('`','\\`')+"`;";
        }
    },
    removeComments(code) {
        // const stringRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
        // const singleLineCommentRegex = /\/\/.*$/gm;
        // const multiLineCommentRegex = /\/\*[\s\S]*?\*\//g;
      
        // // 先替换字符串为占位符，避免误删
        // const strings = [];
        // code = code.replace(stringRegex, (match) => {
        //   strings.push(match);
        //   return `__STRING_${strings.length - 1}__`;
        // });
      
        // // 移除注释
        // code = code
        //   .replace(singleLineCommentRegex, '')
        //   .replace(multiLineCommentRegex, '');
      
        // // 恢复字符串
        // code = code.replace(/__STRING_(\d+)__/g, (_, index) => strings[index]);
      
        return code;
    },
    async readJs(p){
        if(p.endsWith('/')){
            let rp=p+'index.js';
            this._redirect[p]=rp;
            let q=await fetch(rp);
            q=await q.text();
            return q;
        }
        try {
            let q=await fetch(p);
            q=await q.text();
            return q;
        } catch (error) {
            let rp=p+"/index.js";
            this._redirect[p]=rp;
            let q=await fetch(rp);
            q=await q.text();
            return q;
        }
    },
    pathJoin(path1, path2) {
        // 1. 处理空字符串情况
        if (!path1) return path2;
        if (!path2) return path1;
    
        // 2. 合并路径，并在中间添加一个斜杠
        // 注意：这里简单拼接，后续通过 split 来处理多余的斜杠
        let combined = path1 + '/' + path2;
    
        // 3. 将路径按斜杠分割成数组
        // filter(Boolean) 用于移除因连续斜杠产生的空字符串
        const parts = combined.split('/').filter(Boolean);
    
        // 4. 使用栈处理路径片段
        const stack = [];
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part === '.') {
                // 遇到当前目录标记，直接跳过
                continue;
            } else if (part === '..') {
                // 遇到上级目录标记
                if (stack.length > 0) {
                    // 如果栈不为空（且栈顶不是 ..），则弹出栈顶元素（即回到上一级）
                    // 注意：根据样例 a/b + ../../../d = ../d，如果栈顶已经是 ..，则继续压入 ..
                    if (stack[stack.length - 1] !== '..') {
                        stack.pop();
                    } else {
                        stack.push(part);
                    }
                } else {
                    // 如果栈为空，说明已经到达根目录之外，压入 ..
                    stack.push(part);
                }
            } else {
                // 普通目录名，压入栈
                stack.push(part);
            }
        }
    
        // 5. 将栈中的元素重新组合成字符串
        let result = stack.join('/');
    
        // 6. 特殊处理：保留原始路径的尾部斜杠
        // 如果 path2 以 / 结尾，结果也应该以 / 结尾
        if (path2.endsWith('/')) {
            result += '/';
        }
    
        return result;
    },
    pathFolder(p){
        if(p.endsWith('/')){
            return p;
        }else{
            return p.slice(0,p.lastIndexOf('/'))+'/';
        }
    }
}