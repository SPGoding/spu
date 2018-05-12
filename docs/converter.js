"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argument_reader_1 = require("./argument_reader");
const selector_1 = require("./selector");
const spuses_1 = require("./spuses");
const spu_script_1 = require("./spu_script");
class Converter {
    static getResultMap(cmd, spus) {
        let spusReader = new argument_reader_1.default(spus);
        let spusArg = spusReader.next();
        let cmdReader = new argument_reader_1.default(cmd);
        let cmdArg = cmdReader.next();
        let map = new Map();
        let cnt = 0;
        while (spusArg !== '') {
            while (!spu_script_1.default.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next();
                }
                else {
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
            return map;
        }
        else {
            return null;
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
    static cvtLine(input) {
        if (input.charAt(0) === '#') {
            return input;
        }
        else {
            for (const spusOld of spuses_1.default.pairs.keys()) {
                let map = Converter.getResultMap(input, spusOld);
                if (map) {
                    let spusNew = spuses_1.default.pairs.get(spusOld);
                    let spus = new spu_script_1.default(spusNew);
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
        if (spu_script_1.default.isTargetSelector(input)) {
            return Converter.cvtTargetSelector(input);
        }
        else {
            return input;
        }
    }
}
exports.default = Converter;
//# sourceMappingURL=converter.js.map