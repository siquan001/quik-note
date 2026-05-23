function createSelect(cb) {
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