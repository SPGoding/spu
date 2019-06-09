"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const nbt_1 = require("../utils/nbt/nbt");
class SpuScriptExecutor18To19 {
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
                    case 'setTypeByNbt': {
                        const nbt = utils_1.getNbtCompound(param1, 'before 1.12');
                        const riding = nbt.get('Riding');
                        if (riding instanceof nbt_1.NbtCompound) {
                            const id = riding.get('id');
                            if (id instanceof nbt_1.NbtString) {
                                splited[i] = id.get();
                            }
                            else {
                                splited[i] = 'spgoding:undefined';
                            }
                        }
                        else {
                            splited[i] = 'spgoding:undefined';
                        }
                        break;
                    }
                    case 'setNbtWithType': {
                        const passenger = utils_1.getNbtCompound(param1, 'before 1.12');
                        const ridden = passenger.get('Riding');
                        passenger.del('Riding');
                        passenger.set('id', new nbt_1.NbtString(param2));
                        if (ridden instanceof nbt_1.NbtCompound) {
                            ridden.del('id');
                            const passengers = new nbt_1.NbtList();
                            passengers.add(passenger);
                            ridden.set('Passengers', passengers);
                            splited[i] = ridden.toString();
                        }
                        else {
                            splited[i] = '{}';
                        }
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
exports.SpuScriptExecutor18To19 = SpuScriptExecutor18To19;
//# sourceMappingURL=executor.js.map