"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selector_1 = require("./utils/selector");
const parser_1 = require("../utils/wheel_chief/parser");
class ArgumentParser112To113 extends parser_1.ArgumentParser {
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        if (join.charAt(0) !== '@') {
            return 1;
        }
        if (selector_1.Selector113.isValid(join)) {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i];
                if (selector_1.Selector113.isValid(join)) {
                    return i - index + 1;
                }
                else {
                    continue;
                }
            }
            throw 'Expected an entity selector.';
        }
    }
}
exports.ArgumentParser112To113 = ArgumentParser112To113;
//# sourceMappingURL=parser.js.map