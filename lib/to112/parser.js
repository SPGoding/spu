"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("../utils/wheel_chief/parser");
const selector_1 = require("./utils/selector");
class ArgumentParser111To112 extends parser_1.ArgumentParser {
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        if (join.charAt(0) !== '@') {
            return 1;
        }
        if (selector_1.Selector112.isValid(join)) {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i];
                if (selector_1.Selector112.isValid(join)) {
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
exports.ArgumentParser111To112 = ArgumentParser111To112;
//# sourceMappingURL=parser.js.map