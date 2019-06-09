"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const parser_1 = require("../utils/wheel_chief/parser");
const selector_1 = require("./utils/selector");
class ArgumentParser19To111 extends parser_1.ArgumentParser {
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        let result = '';
        if (join.charAt(0) !== '@') {
            return 1;
        }
        result = selector_1.Selector111.tryParse(join);
        if (result === 'VALID') {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i];
                result = selector_1.Selector111.tryParse(join);
                if (result === 'VALID') {
                    return i - index + 1;
                }
                else {
                    continue;
                }
            }
            throw `Expected an entity selector: ${result}`;
        }
    }
    parseMinecraftNbt(splited, index) {
        let exception;
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ');
            try {
                utils_1.getNbtCompound(test, 'before 1.12');
                return endIndex - index;
            }
            catch (e) {
                exception = e;
                continue;
            }
        }
        throw exception;
    }
}
exports.ArgumentParser19To111 = ArgumentParser19To111;
//# sourceMappingURL=parser.js.map