/**
 * qui-core 1.1.0 
 * Web 开发辅助工具库 - 全局类型定义
 * 注意：此库会将 qui 内部方法全部平铺至 window 对象
 * @author siquan001
 */

/** 库基本信息接口 */
interface QuiAbout {
    name: string;
    version: string;
    author: string;
    desc: string;
}

/** qui 核心工具类接口 */
interface Qui {
    /** 库信息 */
    about: QuiAbout;
    
    /**
     * 初始化页面尺寸。自动将 body 宽高设为窗口大小，并监听 resize。
     * @param fn 尺寸变化时的回调 (w, h)
     */
    initResize(fn?: (w: number, h: number) => void): void;
    
    /** 动态插入 JS (支持 URL 或代码内容) */
    js(code: string, isurl?: boolean): void;
    
    /** 动态插入 CSS (支持 URL 或样式内容) */
    css(styles: string, isurl?: boolean): void;
    
    /** document.querySelector 的简写 */
    $(selector: string): HTMLElement | null;
    
    /** document.querySelectorAll 的简写 */
    $$(selector: string): NodeListOf<HTMLElement>;
    
    /** Emmet 风格创建元素，如 "div#id.class" */
    el(ctag: string, attrs?: Record<string, string>, inner?: string, parent?: HTMLElement): HTMLElement;
    
    /** 定时/循环执行工具 */
    timeDo(fn: Function, time?: number, iswhile?: boolean): number;
    
    /** 合并对象属性 */
    pushObj(obj: object, target: object, rewrite?: boolean): void;
    
    /** 深拷贝对象 */
    cloneObj<T>(obj: T): T;
    
    /** 类数组转真数组 */
    ToRealArray<T>(arr: ArrayLike<T>): T[];
    
    /** requestAnimationFrame 高频循环 */
    whiledo(func: Function): void;
    
    /** 基于 Promise 的 Ajax 请求 */
    ajax(method: "GET" | "POST", url: string, data?: any, type?: "json" | "text" | "", progressListener?: (p: number) => void): Promise<any>;
    
    /** GET 请求快捷方式 */
    get(url: string, type?: "json" | "text" | "", progressListener?: (p: number) => void): Promise<any>;
    
    /** POST 请求快捷方式 */
    post(url: string, data: any, type?: "json" | "text" | "", progressListener?: (p: number) => void): Promise<any>;
    
    /** 对象转 JSON 字符串 */
    tojson(obj: any): string;
    
    /** JSON 字符串转对象 */
    toobj(json: string): any;

    /** 是否为 undefined */
    isUd(a: any): boolean;

    /** 是否为 null */
    isNl(a: any): boolean;

    /** 是否为数字 (unstrict 为 true 时支持字符串数字) */
    isNum(a: any, unstrict?: boolean): boolean;

    /** 获取随机 ID 字符串 */
    getRandomCode(): string;

    /** 组件系统 */
    QE: {
        register(bindname: string, details: { init: (el: HTMLElement) => void }): void;
        bind(el: HTMLElement, binder: string): void;
    };
}

/** * ============================================================
 * 全局变量声明 (由于 pushObj 的作用，qui 的成员均在全局)
 * ============================================================
 */

declare var qui: Qui;

// 直接映射 qui 的成员到全局作用域
declare var initResize: Qui["initResize"];
declare var js: Qui["js"];
declare var css: Qui["css"];
declare var $: Qui["$"];
declare var $$: Qui["$$"];
declare var el: Qui["el"];
declare var timeDo: Qui["timeDo"];
declare var pushObj: Qui["pushObj"];
declare var cloneObj: Qui["cloneObj"];
declare var ToRealArray: Qui["ToRealArray"];
declare var whiledo: Qui["whiledo"];
declare var ajax: Qui["ajax"];
declare var get: Qui["get"];
declare var post: Qui["post"];
declare var tojson: Qui["tojson"];
declare var toobj: Qui["toobj"];
declare var isUd: Qui["isUd"];
declare var isNl: Qui["isNl"];
declare var isNum: Qui["isNum"];
declare var getRandomCode: Qui["getRandomCode"];
declare var QE: Qui["QE"];

/** 扩展 Window 接口 */
interface Window extends Qui {
    qui: Qui;
}

/** * ============================================================
 * 原生对象原型链扩展
 * ============================================================
 */

interface EventTarget {
    /** 绑定事件 */
    on(type: string, listener: (this: this, ev: Event) => any): this;
    /** 移除事件 (支持索引或函数引用) */
    off(type?: string, listener?: Function | number): this;
    /** 手动触发事件 */
    doevent(type: string, argu?: any[]): void;
}

interface HTMLElement {
    /** 获取/设置 CSS (支持驼峰转短横线) */
    css(a: string | Record<string, string>, b?: string): any;
    /** 获取/设置 属性 */
    attr(key: string, value?: string): any;
    /** 检查类名 */
    hasClass(cls: string): boolean;
    /** 添加类名 */
    addClass(cls: string): this;
    /** 移除类名 */
    removeClass(cls: string): this;
    /** 切换类名 */
    toggleClass(cls: string): this;
    /** 操作 innerHTML */
    html(html?: string): any;
    /** 操作 textContent */
    text(text?: string): any;
    /** 操作 value */
    val(value?: string): any;
    /** 操作 src */
    sr(src?: string): any;
    /** 获取父元素 */
    parent(): HTMLElement;
    /** 获取子元素集合 */
    child(): HTMLCollection;
    /** 下一个兄弟 */
    next(): HTMLElement | null;
    /** 上一个兄弟 */
    prev(): HTMLElement | null;
    /** 元素索引 */
    index(): number;
    /** 显示 */
    show(display?: string): this;
    /** 淡入 */
    fadeIn(time?: number, display?: string): this;
    /** 淡出 */
    fadeOut(time?: number): this;
    /** 隐藏 */
    hide(): this;
    /** 内部前插节点 */
    prepend(el: HTMLElement): this;
    /** 获取位置矩形 */
    getRect(): DOMRect;
    /** 移除自身 */
    rm(): void;
    /** 局部查找单个 */
    $(selector: string): HTMLElement | null;
    /** 局部查找多个 */
    $$(selector: string): NodeListOf<HTMLElement>;
}

interface HTMLCollection {
    /** 批量绑定事件 */
    on(type: string, listener: Function): any[];
    /** 批量移除事件 */
    off(type?: string, listener?: Function | number): any[];
    /** 批量添加类名 */
    addClass(cls: string): any[];
    /** 批量移除类名 */
    removeClass(cls: string): any[];
    /** 排他性激活类名 */
    active(node: HTMLElement | string | number | null, cn: string): void;
}

interface NodeList extends HTMLCollection {}

interface String {
    /** 快速解析 JSON 字符串 */
    toObj(): any;
}

/**
 * 组件卸载时事件（这仅在开发时的HMR时生效，你的代码功能不应依赖于此）
 * @param fn 回调函数
 */
declare var onUnmounted: (fn: () => void) => void;

/**
 * 组件更新时事件（这仅在开发时的HMR时生效，你的代码功能不应依赖于此）
 * @param module 模块名
 * @param fn 回调函数
 */
declare var onUpdate: (module:string,fn: () => void) => void;

declare module "*.css" {
    const content: void;
    export default content;
}