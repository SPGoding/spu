"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const parser_1 = require("../utils/wheel_chief/parser");
const selector_1 = require("./utils/selector");
const nbt_1 = require("../utils/nbt/nbt");
class ArgumentParser18To19 extends parser_1.ArgumentParser {
    parseArgument(parser, splited, index, properties) {
        switch (parser) {
            case 'spgoding:nbt_contains_riding':
                return this.parseSpgodingNbtContainsRiding(splited, index);
            default:
                return super.parseArgument(parser, splited, index, properties);
        }
    }
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        let result = '';
        if (join.charAt(0) !== '@') {
            return 1;
        }
        result = selector_1.Selector19.tryParse(join);
        if (result === 'VALID') {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`;
                result = selector_1.Selector19.tryParse(join);
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
    parseSpgodingNbtContainsRiding(splited, index) {
        let exception;
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ');
            try {
                const nbt = utils_1.getNbtCompound(test, 'before 1.12');
                if (nbt.get('Riding') instanceof nbt_1.NbtCompound) {
                    return endIndex - index;
                }
                else {
                    throw "Should contain 'Riding'.";
                }
            }
            catch (e) {
                exception = e;
                continue;
            }
        }
        throw exception;
    }
}
exports.ArgumentParser18To19 = ArgumentParser18To19;
//# sourceMappingURL=parser.js.map