(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgumentReader {
    constructor(str) {
        this.arg = str.split(' ');
        this.pos = 0;
        this.length = this.arg.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.arg[this.pos];
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.arg[this.pos++];
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
}
exports.default = ArgumentReader;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CharReader {
    constructor(str) {
        this.str = str;
        this.pos = 0;
        this.length = str.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.str.charAt(this.pos);
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.str.charAt(this.pos++);
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
}
exports.default = CharReader;
function isWhiteSpace(char) {
    return char === ' ' || char === '\t';
}
exports.isWhiteSpace = isWhiteSpace;

},{}],3:[function(require,module,exports){
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
            return Converter.cvtCommand(input, true);
        }
    }
    static cvtCommand(input, positionCorrect) {
        for (const spusOld of spuses_1.default.pairs.keys()) {
            let map = Converter.getResultMap(input, spusOld);
            if (map) {
                let spusNew = spuses_1.default.pairs.get(spusOld);
                let spus = new spu_script_1.default(spusNew);
                let result = spus.compileWith(map);
                if (positionCorrect) {
                    return `execute positioned 0.0 0.0 0.0 run ${result}`;
                }
                else {
                    return result;
                }
            }
        }
        throw `Unknown command: ${input}`;
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
    static cvtDifficulty(input) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful';
            case '1':
            case 'e':
            case 'easy':
                return 'easy';
            case '2':
            case 'n':
            case 'normal':
                return 'normal';
            case '3':
            case 'h':
            case 'hard':
                return 'hard';
            default:
                throw `Unknown difficulty: ${input}`;
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

},{"./argument_reader":1,"./selector":5,"./spu_script":6,"./spuses":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
$(document).ready(function () {
    $('#button').click(function () {
        let result = '';
        let lines = $('#input')
            .val()
            .toString()
            .split('\n');
        for (let line of lines) {
            line = converter_1.default.cvtLine(line);
            result += line + '<br>';
        }
        $('#output').html(result);
    });
});

},{"./converter":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const converter_1 = require("./converter");
const char_reader_2 = require("./char_reader");
class TargetSelector {
    constructor() {
        this.tag = [];
        this.team = [];
        this.name = [];
        this.type = [];
        this.gamemode = [];
        this.level = new Range(null, null);
        this.distance = new Range(null, null);
        this.x_rotation = new Range(null, null);
        this.y_rotation = new Range(null, null);
        this.scores = new Map();
        this.advancements = new Map();
    }
    parse112(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        this.parseVariable112(char, str);
        char = charReader.next();
        this.parseProperties112(char, charReader, str);
    }
    parse113(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        this.parseVariable113(char, str);
        char = charReader.next();
        this.parseProperties113(char, charReader, str);
    }
    get113() {
        let result = '@';
        result = this.getVariable113(result);
        result += '[';
        result = this.getProperties113(result);
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']';
        }
        else if (result.slice(-1) === '[') {
            result = result.slice(0, -1);
        }
        console.log(this);
        return result;
    }
    static isValid(input) {
        let sel = new TargetSelector();
        sel.parse112(input);
        return true;
    }
    addFinishedAdvancement(adv, crit) {
        if (crit) {
            if (this.advancements.has(adv)) {
                let val = this.advancements.get(adv);
                if (typeof val === 'boolean') {
                    return;
                }
                else {
                    val.set(crit, true);
                }
            }
            else {
                this.advancements.set(adv, new Map([[crit, true]]));
            }
        }
        else {
            this.advancements.set(adv, true);
        }
    }
    parseVariable112(char, str) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A;
                this.sort = 'nearest';
                break;
            case 'e':
                this.variable = SelectorVariable.E;
                this.sort = 'nearest';
                break;
            case 'p':
                this.variable = SelectorVariable.P;
                break;
            case 'r':
                this.variable = SelectorVariable.E;
                this.sort = 'random';
                break;
            case 's':
                this.variable = SelectorVariable.S;
                break;
            default:
                throw `Unknown variable: ${char} in ${str}`;
        }
    }
    parseProperties112(char, charReader, str) {
        if (!char) {
            return;
        }
        if (char === '[') {
            let key;
            let val;
            while (char !== ']') {
                key = '';
                val = '';
                char = charReader.next();
                while (char !== '=') {
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    key += char;
                    char = charReader.next();
                }
                char = charReader.next();
                while (char !== ',' && char !== ']') {
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    val += char;
                    char = charReader.next();
                }
                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    this.parseScore112(key, val);
                }
                else {
                    switch (key) {
                        case 'dx':
                            this.dx = Number(val);
                            break;
                        case 'dy':
                            this.dy = Number(val);
                            break;
                        case 'dz':
                            this.dz = Number(val);
                            break;
                        case 'tag':
                            this.tag.push(val);
                            break;
                        case 'team':
                            this.team.push(val);
                            break;
                        case 'name':
                            this.name.push(val);
                            break;
                        case 'type':
                            this.type.push(val);
                            break;
                        case 'c':
                            if (Number(val) >= 0) {
                                this.limit = Number(val);
                            }
                            else {
                                if (this.sort !== 'random') {
                                    this.sort = 'furthest';
                                }
                                this.limit = -Number(val);
                            }
                            break;
                        case 'm':
                            this.gamemode.push(converter_1.default.cvtGamemode(val));
                            break;
                        case 'l':
                            this.level.setMax(Number(val));
                            break;
                        case 'lm':
                            this.level.setMax(Number(val));
                            break;
                        case 'r':
                            this.distance.setMax(Number(val));
                            break;
                        case 'rm':
                            this.distance.setMin(Number(val));
                            break;
                        case 'rx':
                            this.x_rotation.setMax(Number(val));
                            break;
                        case 'rxm':
                            this.x_rotation.setMin(Number(val));
                            break;
                        case 'ry':
                            this.y_rotation.setMax(Number(val));
                            break;
                        case 'rym':
                            this.y_rotation.setMin(Number(val));
                            break;
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5';
                            }
                            switch (key) {
                                case 'x':
                                    this.x = Number(val);
                                    break;
                                case 'y':
                                    this.y = Number(val);
                                    break;
                                case 'z':
                                    this.z = Number(val);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    parseVariable113(char, str) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A;
                break;
            case 'e':
                this.variable = SelectorVariable.E;
                break;
            case 'p':
                this.variable = SelectorVariable.P;
                break;
            case 'r':
                this.variable = SelectorVariable.R;
                break;
            case 's':
                this.variable = SelectorVariable.S;
                break;
            default:
                throw `Unknown variable: ${char} in ${str}`;
        }
    }
    parseProperties113(char, charReader, str) {
        if (char === '') {
            return;
        }
        else if (char === '[') {
            let key;
            let val;
            while (char !== ']') {
                key = '';
                val = '';
                char = charReader.next();
                while (char !== '=') {
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    key += char;
                    char = charReader.next();
                }
                char = charReader.next();
                let depth = 0;
                while (depth !== 0 || (char !== ',' && char !== ']')) {
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    if (char === '{' || char === '[') {
                        depth += 1;
                    }
                    else if (char === '}' || char === ']') {
                        depth -= 1;
                    }
                    val += char;
                    char = charReader.next();
                }
                let range;
                switch (key) {
                    case 'dx':
                        this.dx = Number(val);
                        break;
                    case 'dy':
                        this.dy = Number(val);
                        break;
                    case 'dz':
                        this.dz = Number(val);
                        break;
                    case 'tag':
                        this.tag.push(val);
                        break;
                    case 'team':
                        this.team.push(val);
                        break;
                    case 'name':
                        this.name.push(val);
                        break;
                    case 'type':
                        this.type.push(val);
                        break;
                    case 'gamemode':
                        this.gamemode.push(val);
                        break;
                    case 'limit':
                        this.limit = Number(val);
                        break;
                    case 'level':
                        range = new Range(null, null);
                        range.parse113(val);
                        this.level = range;
                        break;
                    case 'distance':
                        range = new Range(null, null);
                        range.parse113(val);
                        this.distance = range;
                        break;
                    case 'x_rotation':
                        range = new Range(null, null);
                        range.parse113(val);
                        this.x_rotation = range;
                        break;
                    case 'y_rotation':
                        range = new Range(null, null);
                        range.parse113(val);
                        this.y_rotation = range;
                        break;
                    case 'x':
                        this.x = Number(val);
                        break;
                    case 'y':
                        this.y = Number(val);
                        break;
                    case 'z':
                        this.z = Number(val);
                        break;
                    case 'scores':
                        this.parseScores113(val);
                    case 'advancements':
                        this.parseAdvancements113(val);
                    case 'nbt':
                    default:
                        break;
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    parseAdvancements113(val) {
        let charReader = new char_reader_1.default(val);
        let char = charReader.next();
        let adv;
        let crit;
        let bool;
        let map;
        if (char !== '{') {
            throw `Advancements should start with '{', but get '${char}' at '${val}'`;
        }
        char = charReader.next();
        if (char === '}') {
            return;
        }
        while (char) {
            adv = '';
            bool = '';
            while (char !== '=') {
                if (char_reader_2.isWhiteSpace(char)) {
                    char = charReader.next();
                    continue;
                }
                adv += char;
                char = charReader.next();
            }
            char = charReader.next();
            if (char === '{') {
                map = new Map();
                while (char !== '}') {
                    char = charReader.next();
                    crit = '';
                    bool = '';
                    while (char !== '=') {
                        if (char_reader_2.isWhiteSpace(char)) {
                            char = charReader.next();
                            continue;
                        }
                        crit += char;
                        char = charReader.next();
                    }
                    char = charReader.next();
                    while (char !== '}' && char !== ',') {
                        if (char_reader_2.isWhiteSpace(char)) {
                            char = charReader.next();
                            continue;
                        }
                        bool += char;
                        char = charReader.next();
                    }
                    map.set(crit, Boolean(bool));
                }
                this.advancements.set(adv, map);
            }
            else {
                while (char !== '}' && char !== ',') {
                    if (char_reader_2.isWhiteSpace(char)) {
                        char = charReader.next();
                        continue;
                    }
                    bool += char;
                }
            }
            char = charReader.next();
            this.advancements.set(adv, Boolean(bool));
        }
    }
    getVariable113(result) {
        switch (this.variable) {
            case SelectorVariable.A:
                result += 'a';
                break;
            case SelectorVariable.E:
                result += 'e';
                break;
            case SelectorVariable.P:
                result += 'p';
                break;
            case SelectorVariable.R:
                result += 'r';
                break;
            case SelectorVariable.S:
                result += 's';
                break;
        }
        return result;
    }
    getProperties113(result) {
        if (this.dx) {
            result += `dx=${this.dx},`;
        }
        if (this.dy) {
            result += `dy=${this.dy},`;
        }
        if (this.dz) {
            result += `dz=${this.dz},`;
        }
        if (this.limit) {
            result += `limit=${this.limit},`;
        }
        if (this.x) {
            result += `x=${this.x},`;
        }
        if (this.y) {
            result += `y=${this.y},`;
        }
        if (this.z) {
            result += `z=${this.z},`;
        }
        if (this.sort) {
            result += `sort=${this.sort},`;
        }
        for (const i of this.tag) {
            result += `tag=${i},`;
        }
        for (const i of this.team) {
            result += `team=${i},`;
        }
        for (const i of this.name) {
            result += `name=${i},`;
        }
        for (const i of this.type) {
            result += `type=${i},`;
        }
        for (const i of this.gamemode) {
            result += `gamemode=${i},`;
        }
        let tmp = this.level.get113();
        if (tmp) {
            result += `level=${tmp},`;
        }
        tmp = this.distance.get113();
        if (this.distance.get113()) {
            result += `distance=${this.distance.get113()},`;
        }
        tmp = this.x_rotation.get113();
        if (tmp) {
            result += `x_rotation=${tmp},`;
        }
        tmp = this.y_rotation.get113();
        if (tmp) {
            result += `y_rotation=${tmp},`;
        }
        tmp = this.getScores113();
        if (tmp) {
            result += `scores=${tmp},`;
        }
        tmp = this.getAdvancements113();
        if (tmp) {
            result += `advancements=${tmp},`;
        }
        return result;
    }
    setScore(objective, value, type) {
        if (this.scores.has(objective)) {
            switch (type) {
                case 'max':
                    this.scores.get(objective).setMax(Number(value));
                    break;
                case 'min':
                    this.scores.get(objective).setMin(Number(value));
                    break;
                default:
                    throw `Unknown type: ${type}. Expected 'max' or 'min'`;
            }
        }
        else {
            let range;
            switch (type) {
                case 'max':
                    range = new Range(null, Number(value));
                    break;
                case 'min':
                    range = new Range(Number(value), null);
                    break;
                default:
                    throw `Unknown type: ${type}. Expected 'max' or 'min'`;
            }
            this.scores.set(objective, range);
        }
    }
    parseScore112(key, val) {
        let objective;
        if (key.slice(-4) === '_min') {
            objective = key.slice(6, -4);
            this.setScore(objective, val, 'min');
        }
        else {
            objective = key.slice(6);
            this.setScore(objective, val, 'max');
        }
    }
    parseScores113(str) {
        let charReader = new char_reader_1.default(str);
        let char = charReader.next();
        let objective;
        let rangeStr;
        let range;
        if (char !== '{') {
            throw `Unexpected 'scores' value begins: ${char} at ${str}.`;
        }
        char = charReader.next();
        while (char) {
            objective = '';
            rangeStr = '';
            range = new Range(null, null);
            while (char !== '=') {
                if (char_reader_2.isWhiteSpace(char)) {
                    char = charReader.next();
                    continue;
                }
                objective += char;
                char = charReader.next();
            }
            char = charReader.next();
            while (char && char !== ',' && char !== '}') {
                if (char_reader_2.isWhiteSpace(char)) {
                    char = charReader.next();
                    continue;
                }
                rangeStr += char;
                char = charReader.next();
            }
            char = charReader.next();
            range.parse113(rangeStr);
            this.scores.set(objective, range);
        }
    }
    getScores113() {
        let result = '{';
        for (const i of this.scores.keys()) {
            result += `${i}=${this.scores.get(i).get113()},`;
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
    getAdvancements113() {
        let result = '{';
        for (const i of this.advancements.keys()) {
            const val = this.advancements.get(i);
            if (typeof val === 'boolean') {
                result += `${i}=${val},`;
            }
            else {
                result += `${i}={`;
                for (const j of val.keys()) {
                    result += `${j}=${val.get(j)},`;
                }
                result = result.slice(0, -1) + '},';
            }
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
}
exports.default = TargetSelector;
var SelectorVariable;
(function (SelectorVariable) {
    SelectorVariable[SelectorVariable["A"] = 0] = "A";
    SelectorVariable[SelectorVariable["E"] = 1] = "E";
    SelectorVariable[SelectorVariable["P"] = 2] = "P";
    SelectorVariable[SelectorVariable["R"] = 3] = "R";
    SelectorVariable[SelectorVariable["S"] = 4] = "S";
})(SelectorVariable || (SelectorVariable = {}));
class Range {
    getMin() {
        return this.min;
    }
    setMin(min) {
        this.min = min;
    }
    getMax() {
        return this.max;
    }
    setMax(max) {
        this.max = max;
    }
    constructor(min, max) {
        this.max = max;
        this.min = min;
    }
    parse113(str) {
        let arr = str.split('..');
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null;
            this.max = arr[1] ? Number(arr[1]) : null;
        }
        else {
            this.min = this.max = Number(arr[0]);
        }
    }
    get113() {
        let min = this.min;
        let max = this.max;
        if (min && max) {
            if (min !== max) {
                return `${min}..${max}`;
            }
            else {
                return `${min}`;
            }
        }
        else if (min) {
            return `${min}..`;
        }
        else if (max) {
            return `..${max}`;
        }
        else {
            return '';
        }
    }
}

},{"./char_reader":2,"./converter":3}],6:[function(require,module,exports){
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
                arg = this.compileArgument(arg, map);
            }
            result += arg + ' ';
            arg = argReader.next();
        }
        result = result.slice(0, -1);
        return result;
    }
    compileArgument(arg, resultMap) {
        let tokensMap = this.tokenize(arg);
        let id = tokensMap.keys().next().value;
        let methods = tokensMap.get(id);
        let source = resultMap.get(`%${id}`);
        let result = source;
        for (const name of methods.keys()) {
            let params = methods.get(name);
            params = params.map(x => resultMap.get(`%${x}`));
            switch (name) {
                case 'addAdvancement':
                    let sel = new selector_1.default();
                    sel.parse113(source);
                    if (params.length === 1) {
                        sel.addFinishedAdvancement(params[0]);
                    }
                    else if (params.length === 2) {
                        sel.addFinishedAdvancement(params[0], params[1]);
                    }
                    else {
                        throw `Unexpected param count: ${params.length} of ${name} in ${arg}.`;
                    }
                    result = sel.get113();
                    break;
                default:
                    break;
            }
        }
        return result;
    }
    tokenize(arg) {
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
        let name;
        let param;
        let params;
        while (char) {
            name = '';
            params = [];
            char = charReader.next();
            while (char && char !== '%' && char !== '$') {
                name += char;
                char = charReader.next();
            }
            char = charReader.next();
            while (char && char !== '$') {
                param = '';
                while (char && char !== '%' && char !== '$') {
                    param += char;
                    char = charReader.next();
                }
                params.push(param);
                char = charReader.next();
            }
            methods.set(name, params);
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
                case 'word':
                    return SpuScript.isWord(cmdArg);
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
        return (SpuScript.isTargetSelector(input) || SpuScript.isWord(input) || SpuScript.isUuid(input));
    }
    static isWord(input) {
        return /^[\w:]*$/.test(input);
    }
    static isString(input) {
        return /^.*$/.test(input);
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

},{"./argument_reader":1,"./char_reader":2,"./selector":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spuses {
}
Spuses.pairs = new Map([
    ['advancement grant %entity only %word', 'advancement grant %0 only %1'],
    ['advancement grant %entity only %word %word', 'advancement grant %0 only %1 %2'],
    ['advancement revoke %entity only %word', 'advancement revoke %0 only %1'],
    ['advancement revoke %entity only %word %word', 'advancement revoke %0 only %1 %2'],
    ['advancement grant %entity until %word', 'advancement grant %0 until %1'],
    ['advancement grant %entity from %word', 'advancement grant %0 from %1'],
    ['advancement grant %entity through %word', 'advancement grant %0 through %1'],
    ['advancement revoke %entity until %word', 'advancement revoke %0 until %1'],
    ['advancement revoke %entity from %word', 'advancement revoke %0 from %1'],
    ['advancement revoke %entity through %word', 'advancement revoke %0 through %1'],
    ['advancement grant %entity everything', 'advancement grant %0 everything'],
    ['advancement revoke %entity everything', 'advancement revoke %0 everything'],
    ['advancement test %entity %word', 'execute if entity %0$addAdvancement%1'],
    ['advancement test %entity %word %word', 'execute if entity %0$addAdvancement%1%2'],
    ['ban %entity', 'ban %0'],
    ['ban %entity %string', 'ban %0 %1'],
    ['ban-ip %entity', 'ban-ip %0'],
    ['ban-ip %entity %string', 'ban-ip %0 %1'],
    ['ban-ip %string', 'ban-ip %0'],
    ['ban-ip %string %string', 'ban-ip %0 %1'],
    ['banlist %word', 'banlist %0'],
    ['blockdata %position %nbt', 'data merge block %0 %1'],
    ['clear', 'clear'],
    ['clear %entity', 'clear %0'],
    ['clear %entity %item', 'clear %0 %1'],
    ['clear %entity %itemWithData', 'clear %0 %1'],
    ['clear %entity %itemWithData %number', 'clear %0 %1 %2 %'],
    ['clear %entity %itemWithData %number %nbt', 'clear %0$addNbt%3 %1 %2'],
    ['clone %position %position %position', 'clone %0 %1 %2'],
    ['clone %position %position %position %word', 'clone %0 %1 %2 %3'],
    ['clone %position %position %position %word %word', 'clone %0 %1 %2 %3 %4'],
    ['clone %position %position %position %word %word %block', 'clone %0 %1 %2 %3 %5 %4'],
    [
        'clone %position %position %position %word %word %blockWithData',
        'clone %0 %1 %2 %3 %5 %4'
    ],
    ['debug %word', 'debug %0'],
    ['defaultgamemode %mode', 'defaultgamemode %0'],
    ['deop %entity', 'deop %0'],
    ['difficulty %difficulty', 'difficulty %0'],
    ['effect %entity clear', 'effect clear %0'],
    ['effect %entity %word', 'effect give %0 %1'],
    ['effect %entity %word %int', 'effect give %0 %1 %2'],
    ['effect %entity %word %int %int', 'effect give %0 %1 %2 %3'],
    ['effect %entity %word %int %int %bool', 'effect give %0 %1 %2 %3 %4'],
    ['enchant %entity %word', 'enchant %0 %1'],
    ['enchant %entity %word %int', 'enchant %0 %1 %2'],
    ['entitydata %entity %nbt', 'data merge entity %0$setLimitTo1 %1'],
    ['execute %entity %position %command', 'execute as %0 at @s positioned %1 run %2'],
    [
        'execute %entity %position detect %position %blockWithData %command',
        'execute as %0 at @s positioned %1 if block %2 %3 run %4'
    ],
    [
        '',
        ''
    ],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
]);
exports.default = Spuses;

},{}]},{},[4]);
