"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arg_reader_1 = require("./arg_reader");
const selector_1 = require("./selector");
const formats_1 = require("./formats");
/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
class Converter {
    /**
     * Returns an command matches an format.
     * @param cmd An old minecraft command.
     * @param fmt An old format defined in formats.ts.
     * @returns An map of {%n: converted val}
     */
    static match(cmd, fmt) {
        let fmtReader = new arg_reader_1.default(fmt);
        let fmtArg = fmtReader.next();
        let cmdReader = new arg_reader_1.default(cmd);
        let cmdArg = cmdReader.next();
        let map = new Map();
        let cnt = 0;
        while (fmtArg !== '') {
            while (!Converter.isArgMatch(cmdArg, fmtArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next();
                }
                else {
                    // 把arg连接到最后一个了也不匹配，凉了
                    // Exm??? Why Chinese??? What are you saying???
                    return null;
                }
            }
            if (fmtArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.arg(cmdArg, fmtArg));
                cnt++;
            }
            fmtArg = fmtReader.next();
            cmdArg = cmdReader.next();
        }
        if (cmdArg === '') {
            // cmd也到头了，完美匹配
            return map;
        }
        else {
            return null;
        }
    }
    static isArgMatch(cmdArg, fmtArg) {
        if (fmtArg.charAt(0) === '%') {
            switch (fmtArg.slice(1)) {
                case 'entity':
                    return Converter.isEntity(cmdArg);
                case 'string':
                    return Converter.isString(cmdArg);
                case 'number':
                    return Converter.isNumber(cmdArg);
                case 'selector':
                    return Converter.isSelector(cmdArg);
                case 'uuid':
                    return Converter.isUuid(cmdArg);
                default:
                    throw `Unknown arg type: ${fmtArg.slice(1)}`;
                // TODO
            }
        }
        else {
            return cmdArg === fmtArg;
        }
    }
    static arg(cmd, fmt) {
        switch (fmt.slice(1)) {
            case 'entity':
                return Converter.entity(cmd);
            default:
                return cmd;
        }
    }
    static isEntity(input) {
        return Converter.isSelector(input) || Converter.isString(input) || Converter.isUuid(input);
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
    static isSelector(input) {
        return selector_1.default.isValid(input);
    }
    static line(input) {
        if (input.charAt(0) === '#') {
            return input;
        }
        else {
            for (const fmtOld of formats_1.default.pairs.keys()) {
                let map = Converter.match(input, fmtOld);
                if (map) {
                    let fmtNew = formats_1.default.pairs.get(fmtOld);
                    let cnt = 0;
                    while (/\s%[0-9]+(\s|$)/.test(fmtNew)) {
                        fmtNew = fmtNew.replace(`%${cnt}`, map.get(`%${cnt}`));
                        cnt++;
                    }
                    return fmtNew;
                }
            }
            throw `Unknown line: ${input}`;
        }
    }
    static gamemode(input) {
        switch (input) {
            case 's':
            case '0':
            case 'survival':
                return 'survival';
            case 'c':
            case '1':
            case 'creative':
                return 'creative';
            case 'a':
            case '2':
            case 'adventure':
                return 'adventure';
            case 'sp':
            case '3':
            case 'spector':
                return 'spector';
            default:
                throw `Unknown gamemode: ${input}`;
        }
    }
    static selector(input) {
        let sel = new selector_1.default();
        sel.parse112(input);
        return sel.get113();
    }
    static entity(input) {
        if (Converter.isSelector(input)) {
            return Converter.selector(input);
        }
        else {
            return input;
        }
    }
}
exports.default = Converter;
