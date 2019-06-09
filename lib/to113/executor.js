"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const selector_1 = require("./utils/selector");
const selector_2 = require("../utils/selector");
const blocks_1 = require("./mappings/blocks");
const items_1 = require("./mappings/items");
class SpuScriptExecutor112To113 {
    execute(script, args) {
        const splited = script.split(' ');
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value;
            }
            else if (splited[i].slice(0, 1) === '$') {
                const paramIndexes = splited[i].slice(1).split('%');
                const params = paramIndexes.slice(1).map(v => args[parseInt(v)] ? args[parseInt(v)].value : '');
                switch (paramIndexes[0]) {
                    case 'setAsRangeWithMin':
                        if (params[0] !== '*') {
                            splited[i] = `${params[0]}..`;
                        }
                        else {
                            splited[i] = '-2147483648..';
                        }
                        break;
                    case 'setAsRangeWithMinAndMax': {
                        if (params[0] !== '*' && params[1] !== '*') {
                            if (params[0] !== params[1]) {
                                splited[i] = `${params[0]}..${params[1]}`;
                            }
                            else {
                                splited[i] = `${params[0]}`;
                            }
                        }
                        else if (params[0] !== '*' && params[1] === '*') {
                            splited[i] = `${params[0]}..`;
                        }
                        else if (params[0] === '*' && params[1] !== '*') {
                            splited[i] = `..${params[1]}`;
                        }
                        else {
                            splited[i] = '-2147483648..';
                        }
                        break;
                    }
                    case 'setBlockParam':
                        splited[i] = blocks_1.default.to113(blocks_1.default.std112(parseInt(params[0]))).getFull();
                        break;
                    case 'setItemParams':
                        splited[i] = items_1.default.to113(items_1.default.std112(parseInt(params[0]), undefined, parseInt(params[1]))).getNominal();
                        break;
                    case 'setNameToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, params[0])).getNominal();
                        break;
                    case 'setNameDataToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, params[0], parseInt(params[1]))).getNominal();
                        break;
                    case 'setNameDataNbtToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, params[0], parseInt(params[1]), params[2])).getNominal();
                        break;
                    case 'setNameToBlockState':
                        splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, params[0])).getFull();
                        break;
                    case 'setNameStatesToBlockState':
                        if (utils_1.isNumeric(params[2])) {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, params[0], parseInt(params[1]))).getFull();
                        }
                        else {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, params[0], undefined, params[1])).getFull();
                        }
                        break;
                    case 'setNameStatesNbtToBlockState':
                        if (utils_1.isNumeric(params[2])) {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, params[0], parseInt(params[1]), undefined, params[2])).getFull();
                        }
                        else {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, params[0], undefined, params[1], params[2])).getFull();
                        }
                        break;
                    case 'setNbtToSelector': {
                        const sel112 = new selector_1.Selector113();
                        sel112.parse(params[0]);
                        const sel113 = new selector_2.TargetSelector(sel112.to113());
                        sel113.nbt = utils_1.getNbtCompound(params[1]);
                        splited[i] = sel113.toString();
                        break;
                    }
                    default:
                        throw `Unexpected script method: '${paramIndexes[0]}'.`;
                }
            }
        }
        return splited.join(' ');
    }
}
exports.SpuScriptExecutor112To113 = SpuScriptExecutor112To113;
//# sourceMappingURL=executor.js.map