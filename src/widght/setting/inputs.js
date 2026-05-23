const createSelect = require("./selector.js");
const createSwitcher = require("./switcher.js");

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