const { SettingTypes } = require("./inputs.js")

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