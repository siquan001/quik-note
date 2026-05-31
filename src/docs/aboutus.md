# 关于 QUIK 笔记夹

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

[:1] Clear Writer : https://gitee.com/clearwriter/