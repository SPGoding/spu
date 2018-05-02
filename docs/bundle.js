(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgReader {
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
exports.default = ArgReader;

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
                    return `execute positioned 0.0 0.0 0.0 run ${fmtNew}`;
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

},{"./arg_reader":1,"./formats":4,"./selector":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Formats {
}
Formats.pairs = new Map([
    [
        'advancement grant %entity only %string',
        'advancement grant %0 only %1'
    ], [
        'advancement grant %entity only %string %string',
        'advancement grant %0 only %1 %2'
    ]
]);
exports.default = Formats;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
$(document).ready(function () {
    $('#button').click(function () {
        let result = '';
        let lines = $('#input').val().toString().split('\n');
        for (let line of lines) {
            line = converter_1.default.line(line);
            result += line + '<br>';
        }
        $('#output').html(result);
    });
});

},{"./converter":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const converter_1 = require("./converter");
const char_reader_2 = require("./char_reader");
/**
 * Represent an entity selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
class Selector {
    constructor() { }
    parse112(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        this.properties = new Map();
        this.scores = new Map();
        this.advancements = new Map();
        this.ranges = new Map();
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        switch (char) {
            case 'a':
                this.type = SelectorType.A;
                this.properties.set('sort', 'nearest');
                break;
            case 'e':
                this.type = SelectorType.E;
                this.properties.set('sort', 'nearest');
                break;
            case 'p':
                this.type = SelectorType.P;
                break;
            case 'r':
                this.type = SelectorType.R;
                break;
            case 's':
                this.type = SelectorType.S;
                break;
            default:
                throw `Unknown type: ${char} in ${str}`;
        }
        char = charReader.next();
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
                    // 读取key
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    key += char;
                    char = charReader.next();
                }
                char = charReader.next();
                while (char !== ',' && char !== ']') {
                    // 读取value
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    val += char;
                    char = charReader.next();
                }
                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    // 特殊处理score
                    let objective;
                    if (key.slice(-4) === '_min') {
                        // 最小值
                        objective = key.slice(6, -4);
                        if (this.scores.has(objective)) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMin(Number(val));
                        }
                        else {
                            // map里没这个记分项，创建
                            this.scores.set(objective, new Range(Number(val), null));
                        }
                    }
                    else {
                        // 最大值
                        objective = key.slice(6);
                        if (this.scores.has(objective)) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMax(Number(val));
                        }
                        else {
                            // map里没这个记分项，创建
                            this.scores.set(objective, new Range(null, Number(val)));
                        }
                    }
                }
                else {
                    // 其他属性
                    switch (key) {
                        // 无变化
                        case 'dx':
                        case 'dy':
                        case 'dz':
                        case 'tag':
                        case 'team':
                        case 'name':
                        case 'type':
                            this.properties.set(key, val);
                            break;
                        // 重命名
                        case 'c':
                            if (Number(val) >= 0) {
                                this.properties.set('limit', val);
                            }
                            else {
                                this.properties.set('sort', 'furthest');
                                this.properties.set('limit', (-Number(val)).toString());
                            }
                            break;
                        case 'm':
                            this.properties.set('gamemode', converter_1.default.gamemode(val));
                            break;
                        // range且重命名
                        case 'l':
                            this.setRangeMax('level', val);
                            break;
                        case 'lm':
                            this.setRangeMin('level', val);
                            break;
                        case 'r':
                            this.setRangeMax('distance', val);
                            break;
                        case 'rm':
                            this.setRangeMin('distance', val);
                            break;
                        case 'rx':
                            this.setRangeMax('x_rotation', val);
                            break;
                        case 'rxm':
                            this.setRangeMin('x_rotation', val);
                            break;
                        case 'ry':
                            this.setRangeMax('y_rotation', val);
                            break;
                        case 'rym':
                            this.setRangeMin('y_rotation', val);
                            break;
                        // 中心对正
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5';
                            }
                            this.properties.set(key, val);
                            break;
                    }
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    get113() {
        let result = '@';
        switch (this.type) {
            // 类型
            case SelectorType.A:
                result += 'a';
                break;
            case SelectorType.E:
                result += 'e';
                break;
            case SelectorType.P:
                result += 'p';
                break;
            case SelectorType.R:
                result += 'r';
                break;
            case SelectorType.S:
                result += 's';
                break;
        }
        result += '[';
        if (this.properties.size !== 0) {
            // 普通属性
            for (const key of this.properties.keys()) {
                let val = this.properties.get(key);
                result += `${key}=${val},`;
            }
        }
        if (this.ranges.size !== 0) {
            // range属性
            for (const key of this.ranges.keys()) {
                let range = this.ranges.get(key);
                result += `${key}=${range.toString()},`;
            }
        }
        if (this.scores.size !== 0) {
            result += 'scores={';
            // 分数
            for (const objective of this.scores.keys()) {
                let range = this.scores.get(objective);
                result += `${objective}=${range.toString()},`;
            }
            result = result.slice(0, -1) + '},';
        }
        if (this.advancements.size !== 0) {
            // 进度 TODO
        }
        // NBT TODO
        // 完美闭合选择器
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']';
        }
        else if (result.slice(-1) === '[') {
            result = result.slice(0, -1);
        }
        return result;
    }
    setRangeMin(key, min) {
        if (this.ranges.has(key)) {
            this.ranges.get(key).setMin(Number(min));
        }
        else {
            this.ranges.set(key, new Range(Number(min), null));
        }
    }
    setRangeMax(key, max) {
        if (this.ranges.has(key)) {
            this.ranges.get(key).setMax(Number(max));
        }
        else {
            this.ranges.set(key, new Range(null, Number(max)));
        }
    }
    static isValid(input) {
        try {
            let sel = new Selector();
            sel.parse112(input);
        }
        catch (ignored) {
            return false;
        }
        return true;
    }
}
exports.default = Selector;
var SelectorType;
(function (SelectorType) {
    SelectorType[SelectorType["A"] = 0] = "A";
    SelectorType[SelectorType["E"] = 1] = "E";
    SelectorType[SelectorType["P"] = 2] = "P";
    SelectorType[SelectorType["R"] = 3] = "R";
    SelectorType[SelectorType["S"] = 4] = "S";
})(SelectorType || (SelectorType = {}));
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
    toString() {
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
            console.log(`NullPointerException at Range!`);
            return '';
        }
    }
}

},{"./char_reader":2,"./converter":3}]},{},[5]);
