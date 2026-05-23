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
    _(20);
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
    el_keys.push('on', 'off', 'doevent');
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

module.exports={on,off,emit};
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
},(require,module)=>{const sto=require(6);
const bus=require(3);
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
},(require,module)=>{const state={
    group:null, // the group start now
    text:null // the text start now
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
},(require,module)=>{module.exports="<div class=\"alert-alt\"></div><div class=\"alert-text\">分组名称：</div><div class=\"pp-input\"><input type=\"text\" class=\"g-name\"></div><div class=\"alert-text\">分组描述：</div><div class=\"pp-input\"><input type=\"text\" class=\"g-desc\"></div><div class=\"btns\"><div class=\"btn cancel\">取消</div><div class=\"btn ok\">确定</div></div>";},(require,module)=>{const core=require(7);
const bus=require(3);
const state=require(8);
const editor = require(5);
const { icons } = require(1);
const { confirm,alert, prompt, createDialog } = require(9);
const {toast, foot}=require(4);
let groups=core.getGroupList();
if(groups.length==0){
    // create default group,
    // which can't be deleted(nodel:true)
    // the "sp" define the special icon(see line 76)
    core.addGroup({
        name:"默认笔记夹",
        desc:"默认的笔记存放处",
        nodel:true,
        sp:"def"
    })
    core.addGroup({
        name:"闪念",
        desc:"存放临时笔记的地方",
        nodel:true,
        sp:"flash"
    })
}
const b0=a=>a<10?"0"+a:a;
// listen change and draw timely
bus.on("groupChange",drawGroup);
bus.on("textsChange",(id)=>{
    if(state.group==id){// re-draw when is now opened one
        drawTexts();
    }
})

let groupEditor=createDialog({
    content:require(10)
})

function drawGroup(){
    groups=core.getGroupList();
    let g=$(".groupList .groups");
    g.html(''); // clear the list
    for(let i=0;i<groups.length;i++){
        let group=groups[i];
        // --create item--
        let li=el(".bli.group-item");
        let ti=el(".ti");
        let dsc=el(".dsc");
        li.append(ti);
        li.append(dsc);
        ti.text(group.name);
        dsc.text(group.desc);
        g.append(li);
        li.data("id",group.id);
        li.on("click",()=>{
            openGroup(group.id);
        })

        // for delete-icon
        if(!group.nodel){
            let delicon=el(".delicon.m-icon",{},icons["delete"]);
            li.append(delicon);
            delicon.on("click",(e)=>{
                e.stopPropagation();
                confirm("确定要删除该笔记夹吗？该操作不可恢复！",()=>{
                    core.removeGroup(group.id);
                    alert("已删除");
                    if(state.group==group.id){
                        state.group=null;
                        $(".left").addClass("ongroup");
                    }
                })
            })
        }

        // draw special icon
        if(group.sp=="def"){
            let delicon=el(".delicon.m-icon.sp",{title:"默认笔记夹"},icons["book"]);
            li.append(delicon);
        }else if(group.sp=="flash"){
            let delicon=el(".delicon.m-icon.sp",{title:"闪念"},icons["flash"]);
            li.append(delicon);
        }

        // for edit-icon
        let editicon=el(".editicon.m-icon",{},icons["edit"]);
        li.append(editicon);
        editicon.on("click",(e)=>{
            e.stopPropagation();
            groupEditor.show();
            let d=groupEditor.getD();
            // to edit the group info, first fill the form with original info
            d.$(".alert-alt").text("修改分组");
            d.$(".g-name").val(group.name);
            d.$(".g-desc").val(group.desc);
            d.$(".btn.ok").onclick=function(){
                let name=d.$(".g-name").val();
                let desc=d.$(".g-desc").val();
                if(name){ // name can't be empty,desc not required
                    group.name=name;
                    group.desc=desc;
                    core.changeGroup(group.id,group);
                    toast("修改成功",1000);
                }
                groupEditor.hide();
            }
            d.$(".btn.cancel").onclick=function(){
                groupEditor.hide(); // ah... I write it a bit more...
            }
        })

        // if actived
        if(state.group==group.id){
            li.addClass("active");
        }
    }
}

async function openGroup(id){
    // save Text first
    if(state.text){
        await core.setContent(state.group,state.text,editor.getValue());
        foot("已自动保存上一个打开的笔记",3000);
    }
    // if don't do that, when switch group,
    // the state.text will be not in the state.group 
    // causing error when switch-autosave
    state.text=null;
    editor.setValue("");
    $$(".group-item.active").removeClass("active");
    let li=$(".group-item[data-id='"+id+"']");
    li.addClass("active");
    state.group=id;
    $(".left").removeClass("ongroup");
    $(".textList .group-name").text(groups.find(g=>g.id==id).name);
    drawTexts();
}

function drawTexts(){
    let g=$(".textList .texts");
    g.html(''); // clear the list
    let texts=core.getTextList(state.group);
    for(let i=0;i<texts.length;i++){
        let text=texts[i];
        // --create item--
        let li=el(".bli.text-item");
        let ti=el(".ti");
        let dsc=el(".dsc");
        li.append(ti);
        li.append(dsc);
        ti.text(text.meta.title);
        dsc.text(text.meta.desc);
        g.append(li);
        li.data("id",text.id);

        // for delete-icon
        let delicon=el(".delicon.m-icon",{},icons["delete"]);
        li.append(delicon);
        delicon.on("click",(e)=>{
            e.stopPropagation();
            confirm("确定要删除该笔记吗？该操作不可恢复！",()=>{
                core.removeText(state.group,text.id);
                alert("已删除");
                if(state.text==text.id){
                    state.text=null;
                    editor.setValue("");
                }
            })
        })

        // open 
        li.on("click",()=>{
            openText(text.id);
        })
        // and if actived
        if(state.text==text.id){
            li.addClass("active");
        }
    }
}

async function openText(id,isgpc){
    // save Text first
    if(state.text&&(!isgpc)){
        await core.setContent(state.group,state.text,editor.getValue());
        foot("已自动保存上一个打开的笔记",3000);
    }
    // actived li
    $$(".text-item.active").removeClass("active");
    let li=$(".text-item[data-id='"+id+"']");
    li.addClass("active");

    state.text=id; // change global state 

    let ct=await core.getContent(id);
    editor.setValue(ct);
}

drawGroup();

// click the groupTitle in the textslist to redirect to the grouplist page
$(".textList .group-name").on("click",()=>{
    $(".left").addClass("ongroup");
})

// create the new text
$(".newdocbtn").on("click",async ()=>{
    // if no group was actived, first open the default group
    // if flash group actived, open the default group,too
    // because flash group has flash text only in principle 
    if((!state.group)||groups.find(g=>g.id==state.group).sp=="flash"){
        await openGroup(groups.find(g=>g.sp=="def").id);
    }else{
        // ensure the textlist was shown instead of the grouplist
        await openGroup(state.group);
    }

    // create and start
    let id=await core.addText(state.group);
    await openText(id,true);
})

// create the flash text
$(".flashbtn").on("click",async ()=>{
    // just open the flash group
    await openGroup(groups.find(g=>g.sp=="flash").id);
    let id=await core.addText(state.group);
    await core.setContent(state.group,id,`# 闪念 ${formatDate()}\n\nTyping here...`); // for the special flash text
    await openText(id,true);
})

function formatDate(){
    let date=new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${b0(date.getMinutes())}:${b0(date.getSeconds())}`
}

$(".add-group").on("click",()=>{
    groupEditor.show();
    let d=groupEditor.getD();
    // to add a new group, clear the input
    d.$(".alert-alt").text("新建分组");
    d.$(".g-name").val("");
    d.$(".g-desc").val("");
    d.$(".btn.ok").onclick=function(){
        let name=d.$(".g-name").val();
        let desc=d.$(".g-desc").val();
        if(name){ // name is required,and desc isnt
            let id=core.addGroup({name,desc});
            toast("新建成功",1000);
            openGroup(id);
        }
        groupEditor.hide(); 
    }
    d.$(".btn.cancel").onclick=function(){
        groupEditor.hide(); // why i should write it twice?
    }
})
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
},(require,module)=>{const createSelect = require(12);
const createSwitcher = require(13);

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
},(require,module)=>{const { SettingTypes } = require(14)

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
const { InputDrawers } = require(14);
const { settingList, settingStructure } = require(15);
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
    for(let key in settingList)reGet(key);
}

function reGet(key){
    let inpt=settingList[key];
    inpt&&inpt.inputer.setValue(getConfig(key));
}

module.exports={
    reGetAll,
    reGet,
    getConfig,
    drawSetting,
    settingList,
    settingStructure
}
},(require,module)=>{const bus = require(3);
const sto=require(6);
const { getConfig } = require(16);
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
const state = require(8);
const { getConfig } = require(16);
const { foot } = require(4);

let autoSaver=null;
function initAutoSave(){
    let isautosave=getConfig("autoSave")
    if(isautosave){
        console.log("set auto save");
        autoSaver=autoSaver||setInterval(save,30000)
    }else{
        clearInterval(autoSaver);
        autoSaver=null;
    }
}

const b0=a=>a<10?"0"+a:a;
function save(){
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
},(require,module)=>{;
;
require(0)
require(1);
require(2);
require(5);
require(11);
require(17);
require(18)
const settingBox=require(16);
require(19);
initResize();

const bus=require(3);
const core = require(7);
const state = require(8);
const editor = require(5);

// I think it's bad to put it here, but idk where to put the fucking code
bus.on("savenow",()=>{
    console.log(state);
    if(!state.group) return;
    if(!state.text) return;
    core.setContent(state.group,state.text,editor.getValue());
    console.log("已保存");
})

// I must let you see the so graceful loading page :)
setTimeout(()=>{
    $(".loading-page").css("opacity",0);
},300)


settingBox.drawSetting();
}])