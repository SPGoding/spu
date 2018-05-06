"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argument_reader_1 = require("./argument_reader");
const spuses_1 = require("./spuses");
const selector_1 = require("./selector");
const sweet_pragmatics_updater_script_1 = require("./sweet_pragmatics_updater_script");
/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
class Converter {
    /**
     * Returns an result map from an old command and an old spus.
     * @param cmd An old minecraft command.
     * @param spus An old spus defined in spuses.ts.
     * @returns NULLABLE. A map filled with converted value. Like {%n: converted value}.
     */
    static getResultMap(cmd, spus) {
        let spusReader = new argument_reader_1.default(spus);
        let spusArg = spusReader.next();
        let cmdReader = new argument_reader_1.default(cmd);
        let cmdArg = cmdReader.next();
        let map = new Map();
        let cnt = 0;
        while (spusArg !== '') {
            while (!Converter.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next();
                }
                else {
                    // Can't match this spus.
                    return null;
                }
            }
            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.cvtArgument(cmdArg, spusArg));
                cnt++;
            }
            spusArg = spusReader.next();
            cmdArg = cmdReader.next();
        }
        if (cmdArg === '') {
            // Match successfully.
            return map;
        }
        else {
            return null;
        }
    }
    static isArgumentMatch(cmdArg, spusArg) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return Converter.isEntity(cmdArg);
                case 'string':
                    return Converter.isString(cmdArg);
                case 'number':
                    return Converter.isNumber(cmdArg);
                case 'selector':
                    return Converter.isTargetSelector(cmdArg);
                case 'uuid':
                    return Converter.isUuid(cmdArg);
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`;
                // TODO
            }
        }
        else {
            return cmdArg === spusArg;
        }
    }
    static cvtArgument(cmd, spus) {
        switch (spus.slice(1)) {
            case 'entity':
                return Converter.cvtEntity(cmd);
            default:
                return cmd;
        }
    }
    static isEntity(input) {
        return Converter.isTargetSelector(input) || Converter.isString(input) || Converter.isUuid(input);
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
    static cvtLine(input) {
        if (input.charAt(0) === '#') {
            return input;
        }
        else {
            for (const spusOld of spuses_1.default.pairs.keys()) {
                let map = Converter.getResultMap(input, spusOld);
                if (map) {
                    let spusNew = spuses_1.default.pairs.get(spusOld);
                    let spus = new sweet_pragmatics_updater_script_1.default(spusNew);
                    let result = spus.compileWith(map);
                    return `execute positioned 0.0 0.0 0.0 run ${result}`;
                }
            }
            throw `Unknown line: ${input}`;
        }
    }
    static cvtGamemode(input) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival';
            case '1':
            case 'c':
            case 'creative':
                return 'creative';
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure';
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator';
            default:
                throw `Unknown gamemode: ${input}`;
        }
    }
    static cvtTargetSelector(input) {
        let sel = new selector_1.default();
        sel.parse112(input);
        return sel.get113();
    }
    static cvtEntity(input) {
        if (Converter.isTargetSelector(input)) {
            return Converter.cvtTargetSelector(input);
        }
        else {
            return input;
        }
    }
}
exports.default = Converter;
//# sourceMappingURL=converter.js.map