"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const selector_1 = require("./utils/selector");
const updater_1 = require("./updater");
class SpuScriptExecutor19To111 {
    execute(script, args) {
        const splited = script.split(' ');
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value;
            }
            else if (splited[i].slice(0, 1) === '$') {
                const params = splited[i].slice(1).split('%');
                const index1 = parseInt(params[1]);
                const index2 = parseInt(params[2]);
                const param1 = args[index1] ? args[index1].value : '';
                const param2 = args[index2] ? args[index2].value : '';
                switch (params[0]) {
                    case 'setTypeWithNbt': {
                        const result = updater_1.UpdaterTo111.upEntityNbtWithType(utils_1.getNbtCompound(param2, 'before 1.12'), param1);
                        splited[i] = result.type;
                        break;
                    }
                    case 'setSelectorWithNbt': {
                        try {
                            const sel = new selector_1.Selector111(param1);
                            if (sel.arguments.type !== undefined) {
                                const result = updater_1.UpdaterTo111.upEntityNbtWithType(utils_1.getNbtCompound(param2, 'before 1.12'), sel.arguments.type);
                                sel.arguments.type = result.type;
                                splited[i] = sel.toString();
                            }
                            else {
                                splited[i] = param1;
                            }
                        }
                        catch (ignored) {
                            // Take it easy.
                            splited[i] = param1;
                        }
                        break;
                    }
                    case 'delVariantNbt': {
                        const nbt = utils_1.getNbtCompound(param1, 'before 1.12');
                        nbt.del('Type');
                        nbt.del('Elder');
                        nbt.del('ZombieType');
                        nbt.del('SkeletonType');
                        splited[i] = nbt.toString();
                        break;
                    }
                    default:
                        throw `Unexpected script method: '${params[0]}'.`;
                }
            }
        }
        return splited.join(' ');
    }
}
exports.SpuScriptExecutor19To111 = SpuScriptExecutor19To111;
//# sourceMappingURL=excutor.js.map