"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const argument_reader_1 = require("./argument_reader");
const selector_1 = require("./selector");
class SpuScript {
    constructor(spus) {
        this.spus = spus;
    }
    compileWith(map) {
        let argReader = new argument_reader_1.default(this.spus);
        let arg = argReader.next();
        let result = '';
        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg);
            }
            result += arg + ' ';
            arg = argReader.next();
        }
        result = result.slice(0, -1);
        return result;
    }
    compileArgument(arg) {
        let map = this.compileArgumentToMap(arg);
        let id = map.keys().next().value;
        let methods = map.get(id);
        console.log(id);
        console.log(methods);
        return '';
    }
    compileArgumentToMap(arg) {
        let result = '';
        let charReader = new char_reader_1.default(arg);
        let char = charReader.next();
        let id = '';
        let methods = new Map();
        if (char === '%') {
            char = charReader.next();
        }
        else {
            throw `Unexpected token: ${char} in ${arg}. Should be '%".`;
        }
        while (char && char !== '$') {
            id += char;
            char = charReader.next();
        }
        let methodName;
        let methodParam;
        let methodParams;
        while (char) {
            methodName = '';
            methodParams = [];
            char = charReader.next();
            while (char && char !== '%' && char !== '$') {
                methodName += char;
                char = charReader.next();
            }
            char = charReader.next();
            while (char && char !== '$') {
                methodParam = '';
                while (char && char !== '%' && char !== '$') {
                    methodParam += char;
                    char = charReader.next();
                }
                methodParams.push(methodParam);
                char = charReader.next();
            }
            methods.set(methodName, methodParams);
        }
        return new Map([[id, methods]]);
    }
    static isArgumentMatch(cmdArg, spusArg) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return SpuScript.isEntity(cmdArg);
                case 'string':
                    return SpuScript.isString(cmdArg);
                case 'number':
                    return SpuScript.isNumber(cmdArg);
                case 'selector':
                    return SpuScript.isTargetSelector(cmdArg);
                case 'uuid':
                    return SpuScript.isUuid(cmdArg);
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`;
            }
        }
        else {
            return cmdArg.toLowerCase() === spusArg;
        }
    }
    static isEntity(input) {
        return SpuScript.isTargetSelector(input) ||
            SpuScript.isString(input) ||
            SpuScript.isUuid(input);
    }
    static isString(input) {
        return /^\w*$/.test(input);
    }
    static isUuid(input) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input);
    }
    static isNumber(input) {
        return /^[+-]?[0-9]+\.?[0-9]*$/.test(input);
    }
    static isTargetSelector(input) {
        return selector_1.default.isValid(input);
    }
}
exports.default = SpuScript;
//# sourceMappingURL=spu_script.js.map