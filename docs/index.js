((p)=>{
    let m=[];
    let q=(i)=>typeof m[i]=="undefined";
    let _=(i)=>{
        if(!q(i))return m[i];
        let b={};p[i](_,b);
        m[i]=b.exports;
        if(q(i))m[i]=0;
        return m[i];
    }
    _(30);
})([(require,module)=>{/* qui-core 1.1.0 MIT License author:siquan001 */

(function (e) {
    if (!window.qui) {
        window.qui = e();
        qui.pushObj(qui, window);
    }
})(function () {

    var sq = {
        about: {
            name: "qui-core",
            version: "1.2.0",
            author: "siquan001",
            desc: "web开发辅助工具库"
        },
        initResize: function (fn = function () { }) {
            function resize() {
                var w = window.innerWidth;
                var h = window.innerHeight;
                document.body.css('width', w + "px");
                document.body.css('height', h + "px");
                fn(w, h);
            }

            window.onresize = resize;
            resize();
        },
        js(code, isurl) {
            if (isurl) {
                this.el('script', { src: code }, '', document.body);
            } else {
                this.el('script', {}, code, document.body);
            }
        },
        css(styles, isurl) {
            if (isurl) {
                this.el('link', { rel: "stylesheet", href: styles }, '', document.head);
            } else {
                this.el('style', {}, styles, document.head);
            }
        },
        $: function (selector) {
            return document.querySelector(selector);
        },
        $$: function (selector) {
            return document.querySelectorAll(selector);
        },
        el: function (ctag, attrs, inner, parent) {
            let tag = '', classes = [], id = '', lst = [0, 0];
            for (let i = 0; i < ctag.length; i++) {
                if (ctag[i] == '#' || ctag[i] == '.') {
                    if (tag == '') {
                        tag = ctag.slice(0, i) || "div";
                    }
                    if (lst[0] == 1) {
                        classes.push(ctag.slice(lst[1], i));
                    } else if (lst[0] == 2) {
                        id = ctag.slice(lst[1], i);
                    }
                    lst[1] = i + 1;
                    lst[0] = ctag[i] == '#' ? 2 : 1;
                }
            }
            if (lst[0] == 1) {
                classes.push(ctag.slice(lst[1]));
            } else if (lst[0] == 2) {
                id = ctag.slice(lst[1]);
            }else{
                tag = ctag;
            }
            let be = document.createElement(tag);
            if (classes.length > 0) be.className = classes.join(" ");
            if (id) be.id = id;
            if (attrs) {
                for (let k in attrs) {
                    be.setAttribute(k, attrs[k]);
                }
            }
            if (inner) {
                be.innerHTML = inner;
            }
            if (parent) {
                parent.append(be);
            }
            return be;
        },
        /**
         * 对象合并
         * @param {Object} obj 需要合并的对象
         * @param {Object} target 目标对象
         * @param {Boolean} rewrite 是否覆盖目标对象
         */
        pushObj: function pushObj(obj, target, rewrite = false) {
            if (rewrite) {
                for (var key in obj) {
                    if (target.hasOwnProperty(key)) {
                        delete target[key];
                        target[key] = obj[key];
                    }
                }
            } else {
                for (var key in obj) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = obj[key];
                    }
                }
            }
        },
        cloneObj: function cloneObj(target) {
            if(typeof target == 'object'&&(target)){
                if(Array.isArray(target)){
                    let r=[];
                    for(var i=0;i<target.length;i++){
                        r.push(cloneObj(target[i]));
                    }
                    return r;
                }
                let r={};
                for(var key in target){
                    r[key] = cloneObj(target[key]);
                }
                return r;
            }
            return target;
           
        },
        /**
         * 将伪数组转换为真数组
         * @param {*} arr 伪数组
         * @returns {Array} 真数组
         */
        ToRealArray: function ToRealArray(arr) {
            return Array.prototype.slice.call(arr);
        },
        /**
         * 请求
         * @param {"GET"|"POST"} method 请求方法
         * @param {String} url 
         * @param {*} data? post数据
         * @param {"json"|"text"|""} type? 返回数据类型，默认json
         * @param {Function} progressListener? 进度监听器，可选
         * @returns {Promise} 返回Promise对象
         */
        ajax: function ajax(method, url, data, type = "json", progressListener) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        if (type == "json") {
                            try {
                                var j = toobj(xhr.responseText);
                            } catch (error) {
                                reject(error);
                                return;
                            }
                            resolve(j);
                        } else {
                            resolve(xhr.responseText);
                        }
                    } else {
                        reject(xhr);
                    }
                }
                xhr.onerror = function () {
                    reject(xhr);
                }
                if (progressListener) {
                    xhr.onprogress = function (ev) {
                        progressListener(ev.loaded / ev.total);
                    }
                }
                xhr.send(data);
            })
        },
        /**
         * get
         * @param {String} url 
         * @param {"json"|"text"|""} type? 返回数据类型，默认json
         * @param {Function} progressListener? 进度监听器，可选
         * @returns {Promise} 返回Promise对象
         */
        get: function get(url, type = "json", progressListener) {
            return ajax("GET", url, void 0, type, progressListener);
        },

        /**
         * post
         * @param {String} url 
         * @param {*} data post数据
         * @param {"json"|"text"|""} type? 返回数据类型，默认json
         * @param {Function} progressListener? 进度监听器，可选
         * @returns {Promise} 返回Promise对象
         */
        post: function post(url, data, type = "json", progressListener) {
            return ajax("POST", url, data, type, progressListener);
        },
        /**
         * 将对象转换为json字符串
         * @param {Object} obj 对象
         * @returns {String} 返回json字符串
         * @throws {Error} 如果对象格式不正确，则抛出错误
         */
        tojson: function tojson(obj) {
            return JSON.stringify(obj);
        },

        /**
         * 将json字符串转换为对象
         * @param {String} json json字符串
         * @returns {Object} 返回对象
         * @throws {Error} 如果json字符串格式不正确，则抛出错误
         */
        toobj: function toobj(json) {
            return JSON.parse(json);
        },

        isUd: function (a) {
            return typeof a == 'undefined';
        },

        isNl: function (a) {
            return (!a) && typeof a == 'object';
        },

        isNum: function (a, unstrict = false) {
            return unstrict ? (!isNaN(a - 0)) : typeof a == 'number';
        },

        getRandomCode() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2);
        }
    }

    // 扩展
    var el_ex = {
        css: function (a, b) {
            if (typeof a === "string") {
                if (b === undefined) {
                    return this.style.getPropertyValue(a)||getComputedStyle(this)[a];
                } else {
                    this.style.setProperty(a, b);
                }
            } else if (typeof a === "object") {
                for (var key in a) {
                    this.style.setProperty(key, a[key]);
                }
            } else {
                this.attr('style', '');
            }
        },
        attr: function (key, value) {
            if (typeof value !== "undefined") {
                this.setAttribute(key, value);
                return this;
            } else {
                return this.getAttribute(key) || null;
            }
        },
        hasClass: function (cls) {
            return this.classList.contains(cls);
        },
        addClass: function (cls) {
            this.classList.add(cls);
            return this;
        },
        removeClass: function (cls) {
            this.classList.remove(cls);
            return this;
        },
        toggleClass: function (cls) {
            this.classList.toggle(cls);
            return this;
        },
        html: function (html) {
            if (!isUd(html)) {
                this.innerHTML = html;
                return this;
            } else {
                return this.innerHTML;
            }
        },
        text: function (text) {
            if (!isUd(text)) {
                this.textContent = text;
                return this;
            } else {
                return this.textContent;
            }
        },
        val: function (value) {
            if (!isUd(value)) {
                this.value = value;
                return this;
            } else {
                return this.value;
            }
        },
        sr: function (src) {
            if (!isUd(src)) {
                this.src = src;
                return this;
            } else {
                return this.src;
            }
        },
        parent: function () {
            return this.parentNode;
        },
        child: function () {
            return this.children;
        },
        next: function () {
            return this.nextElementSibling;
        },
        prev: function () {
            return this.previousElementSibling;
        },
        index: function () {
            var index = 0;
            var El = this;
            while (El.previousElementSibling) {
                El = El.previousElementSibling;
                index++;
            }
            return index;
        },
        show: function (display = "block") {
            this.css("display", display);
            return this;
        },
        fadeIn: function (time = 300, display = "block") {
            this.show(display);
            var _ = this;
            sq.timeDo(function () {
                _.css('opacity', '1');
            }, time)
            return this;
        },
        fadeOut: function (time = 300) {
            this.css('opacity', '0');
            var _ = this;
            sq.timeDo(function () {
                _.css('display', 'none');
            }, time)
            return this;
        },
        hide: function () {
            this.css("display", "none");
            return this;
        },
        prepend: function (el) {
            this.insertBefore(el, this.firstChild);
            return this;
        },
        insertAfter: function (el, node) {
            this.insertBefore(el, node.nextSibling);
            return this;
        },
        getRect: function () {
            return this.getBoundingClientRect();
        },
        appendAfter: function (el) {
            this.parent().insertAfter(el, this);
            return this;
        },
        appendBefore: function (el) {
            this.parent().insertBefore(el, this);
            return this;
        },
        rm: function () {
            this.remove();
        },
        $: function (selector) {
            return this.querySelector(selector);
        },
        $$: function (selector) {
            return this.querySelectorAll(selector);
        },
        bind: function (binder) {
            QE.bind(this, binder);
            return this;
        },
        data: function (key, value) {
            if (typeof value !== "undefined") {
                this.dataset[key] = value;
                return this;
            } else {
                return this.dataset[key] || null;
            }
        }
    }

    // 扩展到原型链上
    for (var key in el_ex) {
        HTMLElement.prototype[key] = el_ex[key];
    }

    EventTarget.prototype.on = function (type, listener) {
        this.addEventListener(type, listener);
        return this;
    }

    EventTarget.prototype.off = function (type, listener) {
        this.removeEventListener(type, listener);
        return this;
    }

    EventTarget.prototype.doevent = function (type, argu) {
        if (this._q_evs[type]) {
            for (let i = 0; i < this._q_evs[type].length; i++) {
                this._q_evs[type][i].apply(this, argu);
            }
        }
    }

    // 扩展到原型链上
    let el_keys = Object.keys(el_ex);
    el_keys.push('on', 'off', 'doevent','remove');
    for (var key of el_keys) {
        (function (key) {
            HTMLCollection.prototype[key] = NodeList.prototype[key] = function () {
                var ret = [];
                for (var i = 0; i < this.length; i++) {
                    ret.push(this[i][key].apply(this[i], arguments));
                }
                return ret;
            };
        })(key)
    }

    HTMLCollection.prototype.active = NodeList.prototype.active = function (node, cn) {
        if (node instanceof HTMLElement) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === node) {
                    this[i].addClass(cn);
                } else {
                    this[i].removeClass(cn);
                }
            }
        } else if (typeof node === "string") {
            for (var i = 0; i < this.length; i++) {
                if (this[i].dataset.name === node) {
                    this[i].addClass(cn);
                } else {
                    this[i].removeClass(cn);
                }
            }
        } else if (typeof node === "number") {
            for (var i = 0; i < this.length; i++) {
                if (i === node) {
                    this[i].addClass(cn);
                } else {
                    this[i].removeClass(cn);
                }
            }
        } else if (!node) {
            for (var i = 0; i < this.length; i++) {
                this[i].removeClass(cn);
            }
        }

    }

    var str_ex = {
        toObj: function () {
            return JSON.parse(this.valueOf());
        }
    }

    // 扩展到String原型链上
    for (var key in str_ex) {
        String.prototype[key] = str_ex[key];
    }

    // QElement
    let QE = {
        qes: {},
        register: function (bindname, details) {
            this.qes[bindname] = details;
            $$('[data-bind="' + bindname + '"]').bind(bindname);
        },
        bind: function (el, binder) {
            this.qes[binder].init(el);
        }
    }

    sq.QE = QE;

    return sq;
});
},(require,module)=>{const icons={
    // https://github.com/oclero/qlementine-icons MIT
    minimize:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="currentColor" d="M3.5 8a.496.496 0 0 1-.351-.848A.48.48 0 0 1 3.5 7h9q.103 0 .19.039a.5.5 0 0 1 .161.112a.5.5 0 0 1 .146.35a.5.5 0 0 1-.146.352A.5.5 0 0 1 12.5 8z"/></svg>',
    maximize:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M9.8 4H6.2c-.577 0-.949 0-1.23.024c-.272.022-.372.06-.422.085a1 1 0 0 0-.437.437c-.025.05-.063.15-.085.422c-.023.283-.024.656-.024 1.23v3.6c0 .577 0 .949.024 1.23c.022.272.06.372.085.422c.096.188.249.341.437.437c.05.025.15.063.422.085c.283.023.656.024 1.23.024h3.6c.577 0 .949 0 1.23-.024c.272-.022.372-.06.422-.085c.188-.096.341-.249.437-.437c.025-.05.063-.15.085-.422c.023-.283.024-.656.024-1.23v-3.6c0-.577 0-.949-.024-1.23c-.022-.272-.06-.372-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085C10.747 4 10.374 4 9.8 4m-6.58.092c-.218.428-.218.988-.218 2.11v3.6c0 1.12 0 1.68.218 2.11c.192.376.498.682.874.874c.428.218.988.218 2.11.218h3.6c1.12 0 1.68 0 2.11-.218c.376-.192.682-.498.874-.874c.218-.428.218-.988.218-2.11v-3.6c0-1.12 0-1.68-.218-2.11a2 2 0 0 0-.874-.874C11.486 3 10.926 3 9.804 3h-3.6c-1.12 0-1.68 0-2.11.218a2 2 0 0 0-.874.874" clip-rule="evenodd"/></svg>',
    close:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="currentColor" d="m8 8.71l-4.15 4.15a.48.48 0 0 1-.352.146a.5.5 0 0 1-.361-.142a.5.5 0 0 1-.142-.361q0-.205.146-.352l4.15-4.15l-4.15-4.15a.48.48 0 0 1-.146-.356a.496.496 0 0 1 .502-.497q.205 0 .352.146L8 7.294l4.15-4.15a.48.48 0 0 1 .356-.146q.103 0 .19.039a.497.497 0 0 1 .161.814l-4.15 4.15l4.15 4.15a.496.496 0 0 1 0 .708a.5.5 0 0 1-.351.146a.48.48 0 0 1-.356-.146z"/></svg>',
    unmaximize:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="currentColor" d="M9.8 4H5.27c.193-.334.479-.606.824-.782C6.522 3 7.082 3 8.204 3h1.6c1.12 0 1.68 0 2.11.218c.376.192.682.498.874.874c.218.428.218.988.218 2.11v1.6c0 1.12 0 1.68-.218 2.11a2 2 0 0 1-.782.824v-4.53c0-.577 0-.949-.024-1.23c-.022-.272-.06-.372-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085a17 17 0 0 0-1.23-.024z"/><path fill="currentColor" fill-rule="evenodd" d="M3 8.2c0-1.12 0-1.68.218-2.11c.192-.376.498-.682.874-.874c.428-.218.988-.218 2.11-.218h1.6c1.12 0 1.68 0 2.11.218c.376.192.682.498.874.874c.218.428.218.988.218 2.11v1.6c0 1.12 0 1.68-.218 2.11a2 2 0 0 1-.874.874c-.428.218-.988.218-2.11.218h-1.6c-1.12 0-1.68 0-2.11-.218a2 2 0 0 1-.874-.874C3 11.482 3 10.922 3 9.8zM6.2 6h1.6c.577 0 .949 0 1.23.024c.272.022.372.06.422.085c.188.096.341.249.437.437c.025.05.063.15.085.422c.023.283.024.656.024 1.23v1.6c0 .577 0 .949-.024 1.23c-.022.272-.06.372-.085.422a1 1 0 0 1-.437.437c-.05.025-.15.063-.422.085c-.283.023-.656.024-1.23.024H6.2c-.577 0-.949 0-1.23-.024c-.272-.022-.372-.06-.422-.085a1 1 0 0 1-.437-.437c-.025-.05-.063-.15-.085-.422a17 17 0 0 1-.024-1.23v-1.6c0-.577 0-.949.024-1.23c.022-.272.06-.372.085-.422c.096-.188.249-.341.437-.437c.05-.025.15-.063.422-.085C5.253 6 5.626 6 6.2 6" clip-rule="evenodd"/></svg>',
    // https://github.com/tailwindlabs/heroicons MIT
    h1:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M2.75 4a.75.75 0 0 1 .75.75v4.5h5v-4.5a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0v-4.5h-5v4.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 2.75 4M13 8.75a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 .75.75v5.75h1a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5h1v-5h-1a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/></svg>',
    h2:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M2.75 4a.75.75 0 0 1 .75.75v4.5h5v-4.5a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0v-4.5h-5v4.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 2.75 4M15 9.5q-1.094 0-2.145.15a.75.75 0 0 1-.21-1.486a17 17 0 0 1 3.825-.1a1.67 1.67 0 0 1 1.527 1.637a18 18 0 0 1-.009.931a1.71 1.71 0 0 1-1.18 1.556l-2.453.818a1.25 1.25 0 0 0-.855 1.185v.309h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-1.059a2.75 2.75 0 0 1 1.88-2.608l2.454-.818c.102-.034.153-.117.155-.188a16 16 0 0 0 .009-.85a.17.17 0 0 0-.158-.169A16 16 0 0 0 15 9.5" clip-rule="evenodd"/></svg>',
    h3:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M2.75 4a.75.75 0 0 1 .75.75v4.5h5v-4.5a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0v-4.5h-5v4.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 2.75 4M15 9.5q-1.096 0-2.15.15a.75.75 0 1 1-.209-1.485a17 17 0 0 1 3.476-.128c.985.065 1.878.837 1.883 1.932V10a6.8 6.8 0 0 1-.301 2A6.8 6.8 0 0 1 18 14v.031c-.005 1.095-.898 1.867-1.883 1.932a17 17 0 0 1-3.467-.127a.75.75 0 0 1 .209-1.485a15.4 15.4 0 0 0 3.16.115c.308-.02.48-.24.48-.441L16.5 14q-.002-.648-.15-1.25h-2.6a.75.75 0 0 1 0-1.5h2.6q.148-.601.15-1.25v-.024c-.001-.201-.173-.422-.481-.443A16 16 0 0 0 15 9.5" clip-rule="evenodd"/></svg>',
    // https://github.com/twbs/icons MIT
    quote:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="currentColor" d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054q.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992a4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054q.094-.558.31-.992q.217-.434.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992a4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"/></svg>',
    // https://github.com/atisawd/boxicons CC BY 4.0
    undo:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4z"/></svg>',
    redo:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4l-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5"/></svg>',
    // https://github.com/tabler/tabler-icons MIT
    book:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"/></svg>',
    bookcase:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm4 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 8h4m0 8h4"/><path d="m13.803 4.56l2.184-.53c.562-.135 1.133.19 1.282.732l3.695 13.418a1.02 1.02 0 0 1-.634 1.219l-.133.041l-2.184.53c-.562.135-1.133-.19-1.282-.732L13.036 5.82a1.02 1.02 0 0 1 .634-1.219zM14 9l4-1m-2 8l3.923-.98"/></g></svg>',
    list:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"/></svg>',
    grid:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm10 0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm10 0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/></svg>',
    // https://github.com/microsoft/fluentui-system-icons MIT
    fullscreen:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20"><path fill="currentColor" d="m15.543 4.002l.085.015l.063.021l.076.04l.055.04l.06.06l.03.038l.041.073l.03.083l.015.082L16 4.5v6a.5.5 0 0 1-.992.09L15 10.5V5.706L5.706 15H10.5a.5.5 0 0 1 .492.41l.008.09a.5.5 0 0 1-.41.492L10.5 16H4.48l-.069-.008l-.102-.03l-.076-.04l-.055-.04l-.06-.06l-.03-.038l-.041-.073l-.03-.083l-.006-.023L4 15.52V9.5a.5.5 0 0 1 .992-.09L5 9.5v4.792L14.292 5H9.5a.5.5 0 0 1-.492-.41L9 4.5a.5.5 0 0 1 .5-.5zM4.006 15.574l-.004-.031L4 15.524z"/></svg>',
    unfullscreen:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 20 20"><path fill="currentColor" d="M3.5 11h5a.5.5 0 0 1 .492.41L9 11.5v5a.5.5 0 0 1-.992.09L8 16.5v-3.794l-5.146 5.148a.5.5 0 0 1-.765-.638l.057-.07L7.292 12H3.5a.5.5 0 0 1-.492-.41L3 11.5a.5.5 0 0 1 .41-.492zh5zm14.354-8.854a.5.5 0 0 1 .057.638l-.057.07L12.706 8H16.5a.5.5 0 0 1 .492.41L17 8.5a.5.5 0 0 1-.41.492L16.5 9h-5.02l-.069-.008l-.102-.03l-.076-.04l-.055-.04l-.032-.028l-.037-.042l-.042-.062l-.03-.06l-.02-.062l-.006-.023A.5.5 0 0 1 11 8.5l.005.074l-.003-.031L11 3.5a.5.5 0 0 1 .992-.09L12 3.5v3.792l5.146-5.146a.5.5 0 0 1 .708 0"/></svg>',
    // https://github.com/google/material-design-icons Apache 2.0
    add:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>',
    save:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>',
    delete:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>',
    chevronRight:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"/></svg>',
    text:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M21 6v2H3V6zM3 18h9v-2H3zm0-5h18v-2H3z"/></svg>',
    // https://www.figma.com/community/file/886554014393250663 CC BY 2.0
    setting:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M3.082 13.945c-.529-.95-.793-1.426-.793-1.945s.264-.994.793-1.944L4.43 7.63l1.426-2.381c.559-.933.838-1.4 1.287-1.66c.45-.259.993-.267 2.08-.285L12 3.26l2.775.044c1.088.018 1.631.026 2.08.286s.73.726 1.288 1.659L19.57 7.63l1.35 2.426c.528.95.792 1.425.792 1.944s-.264.994-.793 1.944L19.57 16.37l-1.426 2.381c-.559.933-.838 1.4-1.287 1.66c-.45.259-.993.267-2.08.285L12 20.74l-2.775-.044c-1.088-.018-1.631-.026-2.08-.286s-.73-.726-1.288-1.659L4.43 16.37z"/><circle cx="12" cy="12" r="3"/></g></svg>',
    // https://github.com/Richard9394/MingCute/ Apache 2.0
    flash:'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M13.232 1.36c.632-.758 1.863-.24 1.763.742L14.289 9H20a1 1 0 0 1 .768 1.64l-10 12c-.632.758-1.863.24-1.763-.742L9.711 15H4a1 1 0 0 1-.768-1.64z" /></g></svg>',
    // https://github.com/Iconscout/unicons/ Apache 2.0
    export:`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1" /></svg>`,
    // https://github.com/bytedance/IconPark Apache 2.0
    edit:`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M7 42h36"/><path fill="currentColor" d="M11 26.72V34h7.317L39 13.308L31.695 6z"/></g></svg>`

}

function drawIcon(body=document.body){
    body.$$('.m-icon').forEach(ic=>{
        ic.html(icons[ic.text()]);
    })
}

drawIcon();

module.exports={
    drawIcon,
    icons
}

// dbfymqikon
// caexlphjnm
// quvpywhzdg
// ptuoxvgycf
},(require,module)=>{$(".tofull").on("click",()=>{
    if(document.fullscreenElement){
        document.exitFullscreen();
    }else{
        document.documentElement.requestFullscreen();
    }
})

window.on("fullscreenchange",()=>{
    if(document.fullscreenElement){
        $(".tofull .f").hide();
        $(".tofull .u").show();
        $(".navbar").addClass("hid");
    }else{
        $(".tofull .u").hide();
        $(".tofull .f").show();
        $(".navbar").removeClass("hid");
    }
})

window.on("keydown",(e)=>{
    if(e.key=="F11"){
        e.preventDefault();
        $(".tofull").click();
    }
})
},(require,module)=>{let evs={};

// as you can see, this is a simple event emitter
// it's not very efficient, but it's simple and easy to use
// bus.on('anyevent',cb); to listen
// bus.off('anyevent',cb); to remove a listener
// bus.emit('anyevent',arg1,arg2,...); to emit an event

function on(ev,cb){
    if(!evs[ev])evs[ev]=[];
    evs[ev].push(cb);
}
function off(ev,cb){
    if(!evs[ev])return;
    let index=evs[ev].indexOf(cb);
    if(index!=-1)evs[ev].splice(index,1);
}
function emit(ev,...args){
    if(!evs[ev])return;
    evs[ev].forEach(cb=>cb(...args));
}

const bus={on,off,emit};

module.exports=bus;
},(require,module)=>{;

let ct=el(".toast-con");
document.body.appendChild(ct);

// it's easy to understand the simple component
// for msg is msg and time is time(ms)

function toast(msg,time){
    let t=el(".toaster",{},'<div></div>');
    t.$("div").text(msg);
    ct.appendChild(t);
    setTimeout(()=>{
        t.addClass("hiding");
        setTimeout(()=>{
            t.remove();
        },300); // 300ms is the transition time
        // if css changed, the time should be also changed
    },time);
}

let lt;
function foot(msg,time){
    clearTimeout(lt);
    $(".footinfo").text(msg);
    lt=setTimeout(()=>{
        $('.footinfo').text('');
    },time);
}

module.exports={
    toast,foot
};
},(require,module)=>{;

const bus=require(3);
const { toast } = require(4);
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
window.editor=editor;

module.exports=editor;
},(require,module)=>{if(!localStorage.getItem("quik-noter")){
    localStorage.setItem("quik-noter",'{}');
}
let sto=JSON.parse(localStorage.getItem("quik-noter"));

function get(){
    return sto;
}

function set(){
    localStorage.setItem("quik-noter",JSON.stringify(sto));
}

// usage:
// get().a="b"; .... // change content
// set() // save changes

// I have been used Proxy to dymacically save changes 
// instead of calling set() every time
// however when it comes to arr.unshift() or others,
// its performance is so terrible that the page freezes
// and the time complexity is O(n^2) or even worse
// Oh... I have thought it was a groundbreaking idea before ...


module.exports={
    get,
    set
}
},(require,module)=>{function createSelect(cb) {
    // 根容器
    const container = el('.selector');
    const display = el('.sl-show',{}, '请选择');
    const dropdown = el('.sl-drop');
    container.appendChild(display);
    container.appendChild(dropdown);

    // 内部状态
    let options = {};
    let currentValue = undefined;
    let isOpen = false;

    // 重新渲染选项列表
    function renderOptions() {
        dropdown.html('');
        for(let key in options){
            const item = el('.sl-op', {'data-value':key }, options[key]);
            if (key === currentValue) {
                item.addClass('selected');
            }
            item.on('click', function (e) {
                selectItem(key);
            });
            dropdown.appendChild(item);
        }
    }

    // 选中一项
    function selectItem(key,isNotCb) {
        currentValue = key;
        display.text(options[key]);
        // 更新高亮
        dropdown.$$('.sl-op.selected').removeClass("selected");
        dropdown.$$(".sl-op[data-value='"+key+"']").addClass("selected");
        (!isNotCb)&&cb(key);
    }

    // 打开下拉
    function openDropdown() {
        if (isOpen) return;
        isOpen = true;
        dropdown.addClass('open');
        // 延迟绑定，避免当前点击立即触发关闭
        setTimeout(function () {
            $(".setting-box").on('click', closeDropdown);
        }, 0);
    }

    // 关闭下拉
    function closeDropdown() {
        if (!isOpen) return;
        isOpen = false;
        dropdown.removeClass('open');
        $(".setting-box").off('click', closeDropdown);
    }

    // 点击展示区域切换展开/收起
    display.on('click', openDropdown);

    // --- 实例方法 ---

    // 批量设置选项
    container.setOptions = function (opts) {
        options = opts || {};
        currentValue = undefined;
        display.text('请选择');
        renderOptions();
    };

    // 手动设置选中值
    container.set = function (value) {
        selectItem(value,true);
    };

    // 获取当前值
    container.get = function () {
        return currentValue;
    };

    // 添加单个选项
    container.addOption = function (key,value) {
        options[key]=value;
        renderOptions();
    };

    return container;
}

module.exports=createSelect;
},(require,module)=>{function createSwitcher(cb){
    let E=el(".switcher",{},'<div class="sw-bar"></div><div class="sw-er"></div>');
    E.onclick=function(){
        E.toggleClass("on");
        cb(E.hasClass("on"));
    }
    E.set=function(value){
        value?E.addClass("on"):E.removeClass("on");
    }
    E.get=function(){
        return E.hasClass("on");
    }
    return E;
}

module.exports=createSwitcher;
},(require,module)=>{const createSelect = require(7);
const createSwitcher = require(8);

const SettingTypes={
    SELECT:0,
    INPUT:1,
    SWITCH:2,
    BUTTON:3
}

const InputDrawers={
    [SettingTypes.SELECT]:function(si,sh,setter){
        let E=createSelect(function(v){
            setter(v);
        });
        let options=si.option();
        E.setOptions(options);
        sh.append(E);

        return {
            setValue(value){
                E.set(value);
            }
        }
    },
    [SettingTypes.SWITCH]:function(si,sh,setter){
        let E=createSwitcher((value)=>{
            setter(value);
        });
        sh.append(E);
        return {
            setValue(value){
                E.set(value);
            }
        }
    }
}

module.exports={
    SettingTypes,
    InputDrawers
}
},(require,module)=>{module.exports=`# 欢迎使用 QUIK 笔记夹

> 海内存知己，天涯若比邻。  ——王勃

在左侧的笔记夹配置中查看使用帮助。

Try to type here...`;},(require,module)=>{const { SettingTypes } = require(9)

const settingList={
    "theme":{
        type:SettingTypes.SELECT,
        option(){
            return {
                "def-light":"默认浅色",
                "def-dark":"默认深色",
                "mild-light":"柔和浅色",
                "mild-dark":"柔和深色",
            }
        },
        default:"def-light",
        title:"主题",
        desc:"页面显示样式主题"
    },
    "eyeCare":{
        type:SettingTypes.SELECT,
        default:'no',
        title:"护眼模式",
        desc:"使页面色调偏向橘黄色",
        option(){
            return {
                "no":"关闭",
                "l1":"淡",
                "l2":"较淡",
                "l3":"适中",
                "l4":"较浓",
            }
        }
    },
    "fonts":{
        type:SettingTypes.SELECT,
        default:"def",
        title:"字体",
        desc:"页面显示字体",
        option(){
            return {
                "def":"默认字体",
                "cla":"默认字体+",
                "mono":"等宽字体",
                "cons":"等宽字体+",
                "kaiti":"楷体",
            }
        }
    },
    "autoSave":{
        type:SettingTypes.SWITCH,
        default:true,
        title:"自动保存",
        desc:"每30s自动保存一次当前编辑的内容"
    },
    "welcomeText":{
        // for welcome page text model
        default:require(10)
    }
}

const settingStructure=[
    {
        title:"通用设置",
        list:["theme","eyeCare","autoSave","fonts"]
    }
]

module.exports={
    settingList,
    settingStructure,
}
},(require,module)=>{;
const sto=require(6);
const { InputDrawers } = require(9);
const { settingList, settingStructure } = require(11);
const bus=require(3)

$(".opensetting").on("click",()=>{
    $(".setting-container").addClass("show");
    reGetAll();
})

$(".setting-container").on("click",()=>{
    $(".setting-container").removeClass("show");
})

$(".setting-container .setting-box").on("click",e=>e.stopPropagation());

if(!sto.get().config){
    sto.get().config={};
    sto.set();
}

const pageConfig=sto.get().config;

function getConfig(key){
    let y=pageConfig[key];
    if(!settingList[key])return y;
    if(isUd(y)){
        return settingList[key].default;
    }else{
        return y;
    }
}

function setConfig(key,v){
    pageConfig[key]=v;
    sto.set();
    bus.emit("config-"+key,v);
}

function drawSetting(){
    const settingBox=$(".setting-box");
    settingBox.html(`<h1 class="t-t">设置</h1>`);
    settingStructure.forEach(sgroup=>{
        el("h2.t-t",{},sgroup.title,settingBox);
        sgroup.list.forEach(key=>{
            let setting=settingList[key];
            let stb=el(".si",{"data-key":key},`<div class="si-m"><div class="si-t"></div><div class="si-d"></div></div><div class="si-input"></div>`,settingBox);
            stb.$(".si-t").html(setting.title);
            stb.$(".si-d").html(setting.desc);

            if(!InputDrawers[setting.type])return;            
            let v=getConfig(key);
            let inputer=InputDrawers[setting.type](setting,stb.$(".si-input"),(nv)=>{
                pageConfig[key]=nv;
                sto.set();
                bus.emit("config-"+key,nv);
            });

            inputer.setValue(v);
            setting.inputer=inputer;
        })
    })
}

function reGetAll(){
    settingStructure.forEach(sg=>{
        sg.list.forEach(k=>reGet(k));
    })
}

function reGet(key){
    let inpt=settingList[key];
    inpt&&inpt.inputer.setValue(getConfig(key));
}

module.exports={
    reGetAll,
    reGet,
    getConfig,
    setConfig,
    drawSetting,
    settingList,
    settingStructure
}
},(require,module)=>{module.exports=`# 关于 QUIK 笔记夹

QUIK 笔记夹是一个简单的沉浸式Markdown写作软件，让创作回归纯粹。

版本：v0.1.0  _持续更新中_
作者：雨竹upon

##  为何编写这个软件

在很多时候突然想写些东西，或者更新一下博客（少数），一般来说会使用VSCode，但这样实在不优雅，于是我想找找看网上是否有比较好的沉浸式Markdown写作软件。

我发现了一个开源的 Clear Writer [:1] ，它使用CodeMirror，这本质是一个代码编辑器。但经过魔改，其显示效果几乎可以和许多专业软件匹敌。其中提到一个**保留Markdown标记**的思想，这点我非常赞同。我本身在原来VSCode是直接写Markdown的。Markdown本身就是一个简单的文档标记语言，写和看标记基本不是难事，保留Markdown标记并不会很影响Markdown编辑，而且要修改或添加什么内容也很直观，直接修改或添加标记就好。一些软件的把Markdown标记隐藏，反而让一些修改的操作变得没那么直观，而得到的只是少了一些标记的文本，对编辑的体验并没有很大提升，反而需要学些额外的东西。

同时里面的诸如“闪念”的快速开始功能也很值得参考。

然而 Clear Writer [:1] 目前已经停止维护，而且很多功能也不太完善。软件本身以GPL3.0协议开源，于是，我打算参照Clear Writer，自己编写一个类似的软件。（代码没有任何参照Clear Writer）

沉浸式就不用多说了吧，相信正在使用的你，按一下F11，也可以感受到的。

## 软件特色

- 保留Markdown标记
- 标题、引用挂起
- Markdown格式高亮
- 高亮当前段落
- 自动保存
- 不同主题
- 沉浸式编辑器
- 全屏标题栏隐藏
- 文档分组管理
- 自动确认标题
- 可让你立即进入状态的”闪念“功能
- 内容全部保存于本地，隐私+

## PoweredBy

- 西文字体：NeverMind（SIL Open Font License 1.1）
- 中文字体：思源黑体（SIL Open Font License 1.1）
- 编辑器基础：CodeMirror（MIT License）
- 蓝本：Clear Writer（GPL 3.0）
- 前端存储：localforage（Apache License 2.0）

[:1] Clear Writer : https://gitee.com/clearwriter/`;},(require,module)=>{module.exports=`# 使用帮助

## 编辑器

- 只需书写Markdown就好，编辑器会根据标记格式自动排版和高亮
- 按\`Ctrl+S\`保存文档
- **左侧标题和简略内容由文档内容自动确定**

## 文档管理

- 在左侧栏点击任意分组进入分组，点击上方“+ 添加分组”添加新分组。
- 将鼠标放在分组上，点击小铅笔图标修改分组信息，点击垃圾桶图标删除
   *（默认的分组不可删除，笔记夹配置分组不可修改）*
- 进入分组后，点击文档标题进入文档，点击顶部的“+ 新文档”新建文档
- 将鼠标放在文档标题上，点击垃圾桶图标删除
- **点击顶部的“闪念”，可迅速跳转到“闪念”分组，并快速进入编写状态。**
- 打开文档后点击右上角的“导出”，可将当前文档导出为.md文件

**注意：数据无价！删除文档和分组前需谨慎确认！**

## 界面设置

- 点击右上角的双箭头图标可切换全屏状态，在全屏时标题栏将会自动隐藏，在鼠标移至上方时才显示
- 点击左侧栏下方右侧的“<”可隐藏左侧栏
- 点击上方“设置”可打开设置面板以切换主题，自动保存和字体等。
- 打开QUIK 笔记夹时的欢迎界面显示的文字可在“笔记夹配置”>“首页文字设置”自定义，使用以下特殊占位符可动态显示欢迎界面语。
   - \`$saying\` ：随机一言（使用hitokoto API）
`;},(require,module)=>{const { getConfig, setConfig } = require(12);

let textlist=[
    {
        meta:{
            title:"关于我们",
            desc:"关于QUIK笔记夹，以及开发感想",
        },        
        readonly:true,
        content(){
            return require(13)
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
            return require(14)
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
},(require,module)=>{const sto =require(6);

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
},(require,module)=>{const configGroup = require(15);
const defgroup = require(16);

let qb=[defgroup,configGroup];
let groupTypes={};
for(let i=0;i<qb.length;i++){
    groupTypes[qb[i].id]=qb[i];
}
module.exports=groupTypes;
},(require,module)=>{const groupTypes = require(17);
const sto = require(6);

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
},(require,module)=>{const state={
    group:null, // the group start now
    text:null, // the text start now
    group_type:null,
}

module.exports=state;
},(require,module)=>{function createDialog(dt){
    let d=el(".dialog");
    let dg=el(".dialog-bg");
    let dc=el(".dialog-c");
    d.append(dg);
    d.append(dc);
    document.body.append(d);
    dc.innerHTML=dt.content;
    if(dt.ctor){
        dg.onclick=function(){
            d.removeClass("show");
        }
    }
    return {
        getD:()=>dc,
        show(){
            d.addClass("show");
        },
        hide(){
            d.removeClass("show");
        }
    }
}

let alertDialog=createDialog({
    content:`<div class='alert-alt'>提示</div>
    <div class='alert-text'></div>
    <div class="pp-input"><input type="text"/></div>
    <div class="btns">
        <div class="btn cancel">取消</div>
        <div class="btn ok">确定</div>
    </div>`
})

function alert(text,ok=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").hide();
    d.$(".pp-input").hide();
    d.$(".alert-text").text(text);
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        ok();
    }
    alertDialog.show();
}

function confirm(text,ok=()=>{},cancel=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").show("inline-block");
    d.$(".pp-input").hide();
    d.$(".alert-text").text(text);
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        ok();
    }
    d.$(".cancel").onclick=function(){
        alertDialog.hide();
        cancel();
    }
    alertDialog.show();
}

function prompt(text,cb=()=>{}){
    let d=alertDialog.getD();
    d.$(".cancel").show("inline-block");
    d.$(".pp-input").show();
    d.$(".alert-text").text(text);
    d.$("input").val('');
    d.$(".ok").onclick=function(){
        alertDialog.hide();
        cb(d.$("input").val());
    }
    d.$(".cancel").onclick=function(){
        alertDialog.hide();
        cb('');
    }
    alertDialog.show();
    d.$("input").focus();
    d.$("input").onkeydown=function(e){
        if(e.key=="Enter"){
            d.$(".ok").onclick();
        }
    }
}

;
module.exports={
    createDialog,
    alert,
    confirm,
    prompt
};
},(require,module)=>{module.exports="<div class=\"alert-alt\"></div><form><div class=\"type_selector\"></div><div class=\"ff\"></div><div class=\"btns\"><div class=\"btn cancel\">取消</div><button class=\"btn ok\">确定</button></div></form>";},(require,module)=>{const groupTypes = require(17);
const { icons } = require(1);
const { createDialog } = require(20);


let groupEditor=createDialog({
    content:require(21)
})

let d=groupEditor.getD();
d.$(".btn.cancel").on("click",()=>{
    groupEditor.hide();
})
function editGroup(type,dt,cb){
    groupEditor.show();
    d.$('.type_selector').hide();
    d.$(".alert-alt").text("修改分组");
    h='';
    let f=groupTypes[type||"def"].groupConfigs;
    for(let p in f){
        h+=`<div class='alert-text'>${f[p].label}：</div>
        <div class="pp-input"><input type="${f[p].type}" name="${p}" ${f[p].required?"required":""}/></div>`
    }
    d.$(".ff").html(h)
    for(let p in f){
        d.$("input[name='"+p+"']").val(dt[p])
    }
    d.$("form").onsubmit=function(e){
        e.preventDefault();
        for(let p in f){
            dt[p]=d.$("input[name='"+p+"']").val();
        }
        cb(dt);
        groupEditor.hide();
    }
}

function drawSelector(){
    let g=d.$('.type_selector');
    g.html('');
    for(let k in groupTypes){
        if(groupTypes[k].notCreated)continue;
        let ti=el(".gt-item");
        let t=groupTypes[k];
        ti.html(`<div class="m-icon">${icons[t.icon]||''}</div><div class="gt-text">${t.name}</div>`);
        ti.on("click",()=>{
            drawDTer(k);
            $$(".gt-item.active").removeClass("active");
            ti.addClass("active");
        })
        ti.data("type",k);
        g.append(ti);
    }
}

drawSelector();

function drawDTer(type){
    h='';
    let f=groupTypes[type||"def"].groupConfigs;
    for(let p in f){
        h+=`<div class='alert-text'>${f[p].label}：</div>
        <div class="pp-input"><input type="${f[p].type}" name="${p}" ${f[p].required?"required":""}/></div>`
    }
    d.$(".ff").html(h);
}

function createGroup(cb){
    groupEditor.show();
    d.$('.type_selector').show();
    d.$('.gt-item[data-type=def]').click();
    d.$(".alert-alt").text("创建分组");
    d.$("form").onsubmit=function(e){
        e.preventDefault();
        let dt={};
        dt.type=d.$(".gt-item.active").data("type");
        let f=groupTypes[dt.type].groupConfigs;
        for(let p in f){
            dt[p]=d.$("input[name='"+p+"']").val();
        }
        cb(dt);
        groupEditor.hide();
    }
}

module.exports={
    editGroup,
    createGroup
}
},(require,module)=>{const core = require(18);
const { icons } = require(1);
const state = require(19);
const { confirm, alert } = require(20);

function drawGroupItem(group,TL){
    let li=geneLi(group,TL);
    if(!group.nodel){
        let delicon=delIcon(group);
        li.append(delicon);
    }
    let spicon=spIcon(group);
    if(spicon){
        li.append(spicon);
    }
    if(!group.noedit){
        let editicon=editIcon(group,TL);
        li.append(editicon);
    }
    if(state.group==group.id){
        li.addClass("active");
    }
    return li;
}

function geneLi(group,TL){
    let li=el(".bli.group-item");
    let ti=el(".ti");
    let dsc=el(".dsc");
    li.append(ti);
    li.append(dsc);
    ti.text(group.name);
    dsc.text(group.desc);
    li.data("id",group.id);
    li.on("click",()=>{
        TL.openGroup(group.id);
    })
    return li;
}

function delIcon(group){
    let delicon=el(".delicon.m-icon",{},icons["delete"]);
    delicon.on("click",(e)=>{
        e.stopPropagation();
        confirm("确定要删除该笔记夹吗？该操作不可恢复！",async ()=>{
            await core.removeGroup(group.id);
            alert("已删除");
        })
    })
    return delicon;
}

function spIcon(group){
    let sps={
        def:["默认笔记夹","book"],
        flash:["闪念","flash"],
        config:["配置","setting"]
    }
    if(group.sp&&sps[group.sp]){
        let [title,icon]=sps[group.sp];
        let spicon=el(".sp.m-icon.delicon",{title},icons[icon]);
        return spicon;
    }
}

function editIcon(group,TL){
    let editicon=el(".editicon.m-icon",{},icons["edit"]);
    editicon.on("click",(e)=>{
        e.stopPropagation();
        TL.editGroup(group.id);
    })
    return editicon;
}

module.exports= {
    drawGroupItem
}
},(require,module)=>{const core = require(18);
const { icons } = require(1);
const state = require(19);
const { confirm, alert } = require(20);

function drawTextItem(t,TL) {
    let li=geneLi(t);
    if(!t.nodel){
        li.append(delIcon(t,TL));
    }
    li.on("click",()=>{
        TL.openText(t.id);
    })
    // and if actived
    if(state.text==t.id){
        li.addClass("active");
    }
    return li;
}

function geneLi(text){
    let li=el(".bli.text-item");
    let ti=el(".ti");
    let dsc=el(".dsc");
    li.append(ti);
    li.append(dsc);
    ti.text(text.meta.title);
    dsc.text(text.meta.desc);
    li.data("id",text.id);
    return li;
}

function delIcon(text,TL){
    let delicon=el(".delicon.m-icon",{},icons["delete"]);
    delicon.on("click",(e)=>{
        e.stopPropagation();
        confirm("确定要删除该笔记吗？该操作不可恢复！",async ()=>{
            if(state.text==text.id){
                TL.closeText();
            }
            TL.listRemove(text.id);
            await core.removeItem(text.id);
            alert("已删除");
        })
    })
    return delicon;
}

module.exports={
    drawTextItem
}
},(require,module)=>{const bus = require(3);
const core = require(18);
const groupTypes = require(17);
const { icons } = require(1);
const state = require(19);
const editor = require(5);
const { toast } = require(4);
const { editGroup, createGroup } = require(22);
const { drawGroupItem } = require(23);
const { drawTextItem } = require(24);

const TL={
    drawGroupList(){
        let gl=core.getGroupList();
        let g=$(".groupList .groups");
        g.html(''); // clear the list
        for(let i=0;i<gl.length;i++){
            g.append(drawGroupItem(gl[i],this));
        }
    },
    async openGroup(gid){
        state.group=gid;
        let g=core.getGroup(gid);
        state.group_type=g.type||"def";
        this.switchPage(2);
        let gdt=await core.getGroupDT(gid);
        $(".textList .group-name").text(gdt.name);
        state.gdt=gdt;
        this.refreshList();
        this.drawNavBarIcon(g.type||"def");
    },
    editGroup(gid){
        let g=core.getGroup(gid);
        editGroup(g.type,g,(newone)=>{
            core.changeGroup(gid,newone);
            toast("修改成功",2000);
            TL.drawGroupList();
        })
    },
    addGroup(){
        createGroup((dt)=>{
            core.addGroup(dt);
            toast("新建成功",2000);
            TL.drawGroupList();
        })
    },
    drawNavBarIcon(type){
        $$(".navbar .icon-btn.gper").remove();
        let t=groupTypes[type];
        if(!t)return;
        for(let b of t.navbarBtns){
            let btn=el(".icon-btn.gper");
            btn.html(`<div class="m-icon">${icons[b.icon]}</div><div class="tx">${b.text}</div>`);
            btn.on("click",()=>{
                b.click(core.getGroup(state.group),TL);
            })
            $(".navbar").append(btn);
        }
    },
    async save(){
        if(!state.group||!state.text)return;
        await core.saveContent(state.group,state.text,editor.getValue());
        TL.listUpdate(state.text);
    },
    async refreshList(){
        if(!state.group)return;
        let texts=await core.getList(state.group);
        let g=$(".textList .texts");
        g.html(''); // clear the list
        for(let i=0;i<texts.length;i++){
            g.append(drawTextItem(texts[i],this));
        }
    },
    async listUnshift(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        g.prepend(drawTextItem(text,this));
    },
    async listRemove(tid){
        $$(".textList .texts .text-item[data-id='"+tid+"']").remove();
    },
    async listPush(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        g.append(drawTextItem(text,this));
    },
    async listUpdate(tid){
        let text=await core.getItem(state.group,tid);
        let g=$(".textList .texts");
        $(".textList .texts .text-item[data-id='"+tid+"']").addClass("readyReplace");
        g.insertBefore(drawTextItem(text,this),$(".textList .readyReplace"));
        $(".textList .readyReplace").remove();
    },
    async closeGroup(){
        this.closeText();
        $$(".navbar .icon-btn.gper").remove();
        let gc=groupTypes[state.group_type].close;
        gc&&(await gc(core.getGroup(state.group),TL));
        state.group=null;
        state.group_type=null;
        state.gdt=null;
    },
    switchPage(p){
        if(p==1){
            $(".left").addClass("ongroup");
        }else if(p==2){
            $(".left").removeClass("ongroup");
        }
    },
    async openText(id){
        await this.save();
        state.text=id;
        let ct=await core.getContent(state.group,state.text);
        editor.setValue(ct.content);
        this.setEditorConfig(ct.editor);
        $$(".textList .texts .text-item.active").removeClass("active");
        $$(".textList .texts .text-item[data-id='"+id+"']").addClass("active");
        $(".exportbtn").show();
    },
    closeText(){
        if(!state.text)return;
        state.text=null;
        editor.setValue("");
        editor.setOption("readOnly",true);
        $$(".textList .texts .text-item.active").removeClass("active");
        $(".exportbtn").hide();
    },
    setEditorConfig(cf={}){
        let defOption={
            readOnly: false,
            mode: "markdown"
        };
        for(let k in defOption){
            if(isUd(cf[k])){
                editor.setOption(k,defOption[k]);
            }else{
                editor.setOption(k,cf[k]);
            }
        }
    },
    exportText(){
        if(groupTypes[state.group_type].export){
            groupTypes[state.group_type].export(core.getGroup(state.group),TL);
        }else{
            downloadTxt(editor.getValue(),$(".text-item.active .ti").text()+".md");
        }
    }
}

TL.drawGroupList();
$(".textList .group-name").on('click',async ()=>{
    await TL.save();
    await TL.closeGroup();
    TL.switchPage(1);
})

bus.on("savenow",()=>{
    TL.save();
})

$(".exportbtn").hide();
$(".exportbtn").on("click",()=>{
    TL.exportText();
})


const b0=a=>a<10?"0"+a:a;

// create the flash text
$(".flashbtn").on("click",async ()=>{
    // just open the flash group
    let fid=core.getGroupList().find(g=>g.sp=="flash").id;
    let id=await core.addItem(fid,{});
    await core.saveContent(fid,id,`# 闪念 ${formatDate()}\n\nTyping here...`); // for the special flash text
    await TL.openGroup(fid);
    await TL.openText(id);
})

function formatDate(){
    let date=new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${b0(date.getMinutes())}:${b0(date.getSeconds())}`
}

function downloadTxt(content, fileName="sth.md") {
    // 创建 Blob（使用 UTF-8 编码，支持中文）
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;
    // 避免在页面上显示
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放对象 URL
    URL.revokeObjectURL(url);
}

$(".add-group").on("click",()=>{
    TL.addGroup();
})
},(require,module)=>{const bus = require(3);
const sto=require(6);
const { getConfig } = require(12);
let leftWidth=sto.get().leftW||300;

function setLeftWidth(width){
    $(".left").css("width",width+'px');
    $(".right").css("width",`calc(100% - ${width+10}px)`);
    $(".lr-hr").css("left",width-2+'px');
    $(".hidelbtn").css("left",width-15+'px');
}

setLeftWidth(leftWidth);

$(".lr-hr").on("mousedown",(e)=>{
    let x=e.pageX;
    document.onmousemove=(e2)=>{
        let x2=e2.pageX;
        let w=x2-x+leftWidth;
        if(w<150)w=150;
        if(w>600)w=600;
        setLeftWidth(w);
    }
    document.onmouseup=(e2)=>{
        let x2=e2.pageX;
        let w=x2-x+leftWidth;
        if(w<150)w=150;
        if(w>600)w=600;
        leftWidth=w;
        sto.get().leftW=w;
        sto.set();
        document.onmousemove=null;
        document.onmouseup=null;
    }
})

$(".hidelbtn").on("click",()=>{
    $(".main").toggleClass("hidel");
})

let nativeThemes=["def-light","def-dark","mild-light","mild-dark"];
let themes=sto.get().themes||{};

function initTheme(){
    let th=getConfig("theme");
    let clss=gbcl(th);
    function gbcl(th){
        let r=[th];
        if(nativeThemes.includes(th))return r;
        if(!themes[th]||(!themes[th].baseon))return r;
        themes[th].baseon.forEach(i=>{
            r.push.apply(r,gbcl(i));
        })
        return r;
    }
    $("body").className=clss.join(" ");
}

initTheme();
bus.on("config-theme",()=>{
    initTheme();
})

function initEyeCare(){
    let ec=getConfig("eyeCare");
    let bl={
        no:0,
        l1:0.06,
        l2:0.12,
        l3:0.24,
        l4:0.4,
    }
    $(".eyeCare").css("opacity",bl[ec]);
    if(bl[ec]>0){
        $(".eyeCare").show();
    }else{
        $(".eyeCare").hide();
    }
}

initEyeCare();
bus.on("config-eyeCare",()=>{
    initEyeCare();
})

function initFonts(){
    let fs=getConfig("fonts");
    let bl={
        "def":"",
        "cla":"'Clear Sans',Iosevka,sans-serif",
        "mono":"monospace,sans-serif",
        "cons":"Consolas,monospace,sans-serif",
        "kaiti":"'楷体'",
    }
    $("body").css("font-family",bl[fs]);
}

initFonts();
bus.on("config-fonts",()=>{
    initFonts();
})
},(require,module)=>{;
;
;
},(require,module)=>{const { on, emit } = require(3);
const state = require(19);
const { getConfig } = require(12);
const { foot } = require(4);

let autoSaver=null;
function initAutoSave(){
    let isautosave=getConfig("autoSave")
    if(isautosave){
        autoSaver=autoSaver||setInterval(save,30000)
    }else{
        clearInterval(autoSaver);
        autoSaver=null;
    }
}

const b0=a=>a<10?"0"+a:a;
function save(){
    if(state.gdt&&state.gdt.type=="config")return;
    if(state.text){
        emit("savenow");
        let d=new Date();
        foot("自动保存于 "+d.getHours()+":"+b0(d.getMinutes())+":"+b0(d.getSeconds()),3000);
    }
}

initAutoSave();
on("config-autoSave",(nv)=>{
    initAutoSave();
})
},(require,module)=>{const { getConfig } = require(12)

let replacers={
    "$saying":async function(){
        try{
            return (await(await fetch("https://v1.hitokoto.cn/")).json()).hitokoto
        }catch(e){
            let nz=["海内存知己，天涯若比邻。","木受绳则直，金就砺则利。"]
            return nz[Math.floor(Math.random()*nz.length)];
        }
    }
}

async function getText(){
    let wlp=getConfig("welcomeText");
    for(let i in replacers){
        if(wlp.indexOf(i)!==-1){
            wlp=wlp.replaceAll(i,await replacers[i]());
        }
    }
    return wlp;
}

module.exports={
    getText
}
},(require,module)=>{;
;
require(0)
require(1);
require(2);
require(5);
require(25);
require(26);
require(27)
const settingBox=require(12);
require(28);
initResize();
const state = require(19);
const editor = require(5);
const { getText } = require(29);

// I think it's bad to put it here, but idk where to put the fucking code
// bus.on("savenow",()=>{
//     console.log(state);
//     if(!state.group) return;
//     if(!state.text) return;
//     if(state.group=="config-group"){
//         saveText();
//     }else{
//         core.setContent(state.group,state.text,editor.getValue());
//     }
//     console.log("已保存");
// })

// I must let you see the so graceful loading page :)
setTimeout(()=>{
    $(".loading-page").css("opacity",0);
},300)


settingBox.drawSetting();

editor.setValue("正在加载...");
getText().then(t=>{
    if(state.group||state.text)return;
    editor.setValue(t);
})
}])